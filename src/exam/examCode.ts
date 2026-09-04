import { createRng } from '../lib/rng'
import { makeFraction } from '../lib/fraction'
import { parseNumber } from '../lib/num'
import {
  CURRICULUM_VERSION,
  getCurriculumModule,
} from '../curriculum/registry'
import { fractionTask, textTask, valueTask } from '../curriculum/taskHelpers'
import type { Grade, Task, Topic } from '../curriculum/types'
import type { ExamSpec, ExamTaskRef } from './types'

/**
 * Codec for the shareable "Übungsklausur per Code".
 *
 * A code looks like `MSX1:<payload>:<checksum>` where
 * - `MSX1:` is a fixed identifier (M-a-t-h-s-a-c-h-s eXam, v1),
 * - `<payload>` is the compact exam JSON, UTF-8 → Base64url encoded,
 * - `<checksum>` is a short FNV-1a hash (base36) of the payload used to catch
 *   accidental truncation/corruption before we even attempt to parse.
 *
 * There is no backend: everything travels inside the code (schema `'A'` keeps
 * only seeds, schema `'B'` may embed the full content — see `types.ts`).
 */

/** Fixed identifier prefix of every Mathsachs exam code (version 1). */
export const EXAM_CODE_PREFIX = 'MSX1:'

/** URL hash key used for shareable links, e.g. `…#klausur=<code>`. */
export const EXAM_HASH_KEY = 'klausur'

/** Thrown for any malformed, corrupted or structurally invalid exam code. */
export class ExamCodeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ExamCodeError'
  }
}

// --- Base64url (works in both browsers and Node/Vitest) --------------------

const toBase64Url = (bytes: Uint8Array): string => {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const fromBase64Url = (text: string): Uint8Array => {
  const b64 = text.replace(/-/g, '+').replace(/_/g, '/')
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4))
  const bin = atob(b64 + pad)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

/** Small, fast FNV-1a hash rendered as base36 — a lightweight checksum. */
const checksum = (text: string): string => {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(36)
}

/** Encode an exam into a compact, shareable code string. */
export const encodeExam = (spec: ExamSpec): string => {
  const json = JSON.stringify(spec)
  const payload = toBase64Url(new TextEncoder().encode(json))
  return `${EXAM_CODE_PREFIX}${payload}:${checksum(payload)}`
}

/**
 * Decode a code back into an {@link ExamSpec}.
 *
 * Throws an {@link ExamCodeError} for anything that is not a well-formed,
 * checksum-valid Mathsachs code. When the embedded `curriculumVersion` differs
 * from the current {@link CURRICULUM_VERSION}, decoding still succeeds but a
 * warning is emitted because seed-based tasks might no longer match.
 */
export const decodeExam = (code: string): ExamSpec => {
  const trimmed = code.trim()
  if (!trimmed.startsWith(EXAM_CODE_PREFIX)) {
    throw new ExamCodeError(
      'Das ist kein gültiger Mathsachs-Klausurcode (erwartet wird der Beginn „MSX1:“).',
    )
  }
  const body = trimmed.slice(EXAM_CODE_PREFIX.length)
  const sep = body.lastIndexOf(':')
  if (sep <= 0) {
    throw new ExamCodeError('Der Code ist unvollständig (Prüfsumme fehlt).')
  }
  const payload = body.slice(0, sep)
  const given = body.slice(sep + 1)
  if (checksum(payload) !== given) {
    throw new ExamCodeError('Der Code ist beschädigt (Prüfsumme stimmt nicht).')
  }

  let json: string
  try {
    json = new TextDecoder().decode(fromBase64Url(payload))
  } catch {
    throw new ExamCodeError('Der Code konnte nicht dekodiert werden.')
  }

  let spec: unknown
  try {
    spec = JSON.parse(json)
  } catch {
    throw new ExamCodeError('Der Code enthält keine gültigen Daten.')
  }

  if (!isExamSpec(spec)) {
    throw new ExamCodeError('Der Code enthält keine gültige Klausur.')
  }

  if (spec.curriculumVersion !== CURRICULUM_VERSION) {
    console.warn(
      `Klausur wurde für Lehrplan-Version ${spec.curriculumVersion} erstellt, ` +
        `aktuell ist Version ${CURRICULUM_VERSION}. Einzelne Aufgaben können abweichen.`,
    )
  }
  return spec
}

const isTaskRef = (value: unknown): value is ExamTaskRef => {
  if (typeof value !== 'object' || value === null) return false
  const r = value as Record<string, unknown>
  return (
    typeof r.modul === 'string' &&
    typeof r.thema === 'string' &&
    typeof r.seed === 'number' &&
    typeof r.punkte === 'number'
  )
}

const isExamSpec = (value: unknown): value is ExamSpec => {
  if (typeof value !== 'object' || value === null) return false
  const s = value as Record<string, unknown>
  return (
    (s.schema === 'A' || s.schema === 'B') &&
    typeof s.curriculumVersion === 'number' &&
    typeof s.titel === 'string' &&
    Array.isArray(s.aufgaben) &&
    s.aufgaben.every(isTaskRef)
  )
}

// --- Shareable links -------------------------------------------------------

/** Build a shareable link that auto-loads the exam via the URL hash. */
export const buildExamLink = (code: string): string => {
  const base =
    typeof window !== 'undefined' && window.location
      ? window.location.origin + window.location.pathname
      : ''
  return `${base}#${EXAM_HASH_KEY}=${encodeURIComponent(code)}`
}

/** Extract an exam code from a location hash, or `null` if none is present. */
export const parseExamHash = (hash: string): string | null => {
  const match = new RegExp(`[#&]${EXAM_HASH_KEY}=([^&]+)`).exec(hash)
  return match ? decodeURIComponent(match[1]) : null
}

// --- Resolving an exam into runnable tasks ---------------------------------

/** A single resolved exam task, ready to be presented and graded. */
export interface ResolvedExamTask {
  ref: ExamTaskRef
  task: Task
  punkte: number
  moduleId: string
  topicId: string
  topicTitle: string
  areaTitle: string
  gradeTitle: string
}

/** True when a ref carries enough embedded content for schema `'B'`. */
const isEmbedded = (ref: ExamTaskRef): boolean =>
  typeof ref.frage === 'string' &&
  ref.frage.length > 0 &&
  typeof ref.antwortart === 'string' &&
  typeof ref.loesung === 'string'

/**
 * Build a {@link Task} directly from embedded content (Variante B). Kept
 * intentionally simple: the answer check is derived from `antwortart` +
 * `loesung`, mirroring the curriculum's own `taskHelpers`.
 */
const buildEmbeddedTask = (ref: ExamTaskRef): Task => {
  const kind = ref.antwortart ?? 'text'
  const question = ref.frage ?? ''
  const solution = ref.loesung ?? ''
  const explanation = ref.erklaerung ?? ''
  if (kind === 'fraction') {
    const [n, d] = solution.split('/').map((s) => Number.parseInt(s.trim(), 10))
    return fractionTask({
      question,
      unit: ref.einheit,
      value: makeFraction(Number.isFinite(n) ? n : 0, Number.isFinite(d) && d !== 0 ? d : 1),
      solution,
      explanation,
    })
  }
  if (kind === 'text') {
    return textTask({ question, accepted: [solution], solution, explanation })
  }
  return valueTask({
    question,
    unit: ref.einheit,
    answerKind: kind,
    value: parseNumber(solution) ?? 0,
    solution,
    explanation,
  })
}

const findTopic = (
  grade: Grade,
  topicId: string,
): { topic: Topic; areaTitle: string } | null => {
  for (const area of grade.areas) {
    const topic = area.topics.find((t) => t.id === topicId)
    if (topic) return { topic, areaTitle: area.title }
  }
  return null
}

/**
 * Resolve an exam into concrete, gradeable tasks.
 *
 * For embedded refs (schema `'B'`) the task is built from the payload. For
 * seed-based refs (schema `'A'`) the grade module is loaded on demand via the
 * registry, the topic located by id and re-generated with `createRng(seed)` —
 * so a code always reproduces the very same question and solution.
 */
export const resolveExam = async (
  spec: ExamSpec,
): Promise<ResolvedExamTask[]> => {
  const gradeCache = new Map<string, Promise<Grade>>()
  const loadGrade = (moduleId: string): Promise<Grade> => {
    let pending = gradeCache.get(moduleId)
    if (!pending) {
      const mod = getCurriculumModule(moduleId)
      if (!mod) {
        return Promise.reject(
          new ExamCodeError(`Unbekanntes Modul „${moduleId}“ in der Klausur.`),
        )
      }
      pending = mod.load()
      gradeCache.set(moduleId, pending)
    }
    return pending
  }

  const resolved: ResolvedExamTask[] = []
  for (const ref of spec.aufgaben) {
    if (isEmbedded(ref)) {
      resolved.push({
        ref,
        task: buildEmbeddedTask(ref),
        punkte: ref.punkte,
        moduleId: ref.modul,
        topicId: ref.thema,
        topicTitle: ref.frage ?? ref.thema,
        areaTitle: '',
        gradeTitle: '',
      })
      continue
    }
    const grade = await loadGrade(ref.modul)
    const found = findTopic(grade, ref.thema)
    if (!found) {
      throw new ExamCodeError(
        `Thema „${ref.thema}“ wurde im Modul „${ref.modul}“ nicht gefunden.`,
      )
    }
    resolved.push({
      ref,
      task: found.topic.generate(createRng(ref.seed)),
      punkte: ref.punkte,
      moduleId: ref.modul,
      topicId: found.topic.id,
      topicTitle: found.topic.title,
      areaTitle: found.areaTitle,
      gradeTitle: grade.title,
    })
  }
  return resolved
}
