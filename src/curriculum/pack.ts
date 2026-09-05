import { compareSemver, isNewerVersion } from '../updates/semver'
import type { AnswerKind } from './types'

export const GYM_SACHSEN_PACK_ID = 'gym-sachsen'
export const OS_HS_PACK_ID = 'oberschule-sachsen-hs'
export const OS_RS_PACK_ID = 'oberschule-sachsen-rs'
export type ExtraSource = 'lehrer'

export interface PackTask {
  kind: 'value' | 'text' | 'fraction'
  answerKind: AnswerKind
  question: string
  solution: string
  explanation: string
  unit?: string
  value?: number
  accepted?: string[]
  numerator?: number
  denominator?: number
}

export interface PackTopic {
  id: string
  title: string
  hint?: string
  pointsPerTask: number
  keywords?: string[]
}

export interface PackArea {
  id: string
  title: string
  ustd?: number
  topics: PackTopic[]
}

export interface PackGrade {
  id: string
  title: string
  subjectTitle: string
  gradeTitle: string
  description: string
  searchHints?: string[]
  areas: PackArea[]
}

export interface PackExtra {
  id: string
  gradeId: string
  areaId: string
  source: ExtraSource
  topic: PackTopic
  tasks?: PackTask[]
}

export interface CurriculumPack {
  id: string
  title: string
  region: string
  school: string
  subject: string
  version: string
  changelog: string
  contentHash: string
  official: PackGrade[]
  extras: PackExtra[]
}

export interface CurriculumRef {
  moduleId: string
  version: string
  contentHash?: string
}

export interface InstalledCurriculum {
  id: string
  version: string
  installedAt: number
  contentHash?: string
}

/** Tombstone so LAN/PC merge cannot resurrect a locally removed pack. */
export interface DeletedCurriculum {
  id: string
  deletedAt: number
}

export const DELETED_CURRICULUM_TTL_MS = 30 * 24 * 60 * 60 * 1000
export const MAX_DELETED_CURRICULA = 200

export interface ManifestPack {
  id: string
  title: string
  region: string
  school: string
  subject: string
  version: string
  url: string
  size?: number
  changelog?: string
}

export interface CurriculumManifest {
  updatedAt: string
  packs: ManifestPack[]
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

export function packContentHash(official: PackGrade[], extras: PackExtra[]): string {
  const json = JSON.stringify({ official, extras })
  let h = 0x811c9dc5
  for (let i = 0; i < json.length; i++) {
    h ^= json.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

const parseTopic = (raw: unknown): PackTopic | null => {
  if (!isRecord(raw)) return null
  const id = asString(raw.id).trim()
  const title = asString(raw.title).trim()
  if (!id || !title) return null
  const keywords = Array.isArray(raw.keywords)
    ? raw.keywords.filter((item): item is string => typeof item === 'string' && item.trim() !== '')
    : undefined
  return {
    id,
    title,
    hint: asString(raw.hint) || undefined,
    pointsPerTask: Math.max(1, Math.trunc(asNumber(raw.pointsPerTask, 10))),
    ...(keywords?.length ? { keywords } : {}),
  }
}

const parseTask = (raw: unknown): PackTask | null => {
  if (!isRecord(raw)) return null
  const kind =
    raw.kind === 'value' || raw.kind === 'text' || raw.kind === 'fraction' ? raw.kind : null
  const answerKind =
    raw.answerKind === 'integer' ||
    raw.answerKind === 'decimal' ||
    raw.answerKind === 'fraction' ||
    raw.answerKind === 'text'
      ? raw.answerKind
      : null
  const question = asString(raw.question).trim()
  const solution = asString(raw.solution).trim()
  if (!kind || !answerKind || !question || !solution) return null
  const accepted = Array.isArray(raw.accepted)
    ? raw.accepted.filter((item): item is string => typeof item === 'string')
    : undefined
  return {
    kind,
    answerKind,
    question,
    solution,
    explanation: asString(raw.explanation),
    unit: asString(raw.unit) || undefined,
    value: typeof raw.value === 'number' ? raw.value : undefined,
    ...(accepted?.length ? { accepted } : {}),
    numerator: typeof raw.numerator === 'number' ? raw.numerator : undefined,
    denominator: typeof raw.denominator === 'number' ? raw.denominator : undefined,
  }
}

const parseArea = (raw: unknown): PackArea | null => {
  if (!isRecord(raw)) return null
  const id = asString(raw.id).trim()
  const title = asString(raw.title).trim()
  if (!id || !title || !Array.isArray(raw.topics)) return null
  const topics = raw.topics.map(parseTopic).filter((item): item is PackTopic => item !== null)
  if (topics.length === 0) return null
  return {
    id,
    title,
    ustd: typeof raw.ustd === 'number' ? raw.ustd : undefined,
    topics,
  }
}

const parseGrade = (raw: unknown): PackGrade | null => {
  if (!isRecord(raw)) return null
  const id = asString(raw.id).trim()
  const title = asString(raw.title).trim()
  if (!id || !title || !Array.isArray(raw.areas)) return null
  const areas = raw.areas.map(parseArea).filter((item): item is PackArea => item !== null)
  if (areas.length === 0) return null
  const searchHints = Array.isArray(raw.searchHints)
    ? raw.searchHints.filter((item): item is string => typeof item === 'string')
    : undefined
  return {
    id,
    title,
    subjectTitle: asString(raw.subjectTitle, 'Mathematik'),
    gradeTitle: asString(raw.gradeTitle, title),
    description: asString(raw.description),
    ...(searchHints?.length ? { searchHints } : {}),
    areas,
  }
}

const parseExtra = (raw: unknown): PackExtra | null => {
  if (!isRecord(raw)) return null
  const id = asString(raw.id).trim()
  const gradeId = asString(raw.gradeId).trim()
  const areaId = asString(raw.areaId).trim()
  const topic = parseTopic(raw.topic)
  if (!id || !gradeId || !areaId || !topic) return null
  const tasks = Array.isArray(raw.tasks)
    ? raw.tasks.map(parseTask).filter((item): item is PackTask => item !== null)
    : undefined
  return {
    id,
    gradeId,
    areaId,
    source: 'lehrer',
    topic: { ...topic, id: topic.id || id },
    ...(tasks?.length ? { tasks } : {}),
  }
}

export function parseCurriculumPack(raw: unknown): CurriculumPack | null {
  if (!isRecord(raw)) return null
  const id = asString(raw.id).trim()
  const title = asString(raw.title).trim()
  const version = asString(raw.version).trim()
  if (!id || !title || !version || !Array.isArray(raw.official) || !Array.isArray(raw.extras)) {
    return null
  }
  const official = raw.official.map(parseGrade).filter((item): item is PackGrade => item !== null)
  if (official.length === 0) return null
  const extras = raw.extras.map(parseExtra).filter((item): item is PackExtra => item !== null)
  return {
    id,
    title,
    region: asString(raw.region),
    school: asString(raw.school),
    subject: asString(raw.subject, 'Mathematik'),
    version,
    changelog: asString(raw.changelog),
    contentHash: asString(raw.contentHash) || packContentHash(official, extras),
    official,
    extras,
  }
}

export function parseManifest(raw: unknown): CurriculumManifest | null {
  if (!isRecord(raw) || !Array.isArray(raw.packs)) return null
  const packs: ManifestPack[] = []
  for (const item of raw.packs) {
    if (!isRecord(item)) continue
    const id = asString(item.id).trim()
    const title = asString(item.title).trim()
    const version = asString(item.version).trim()
    const url = asString(item.url).trim()
    if (!id || !title || !version || !url) continue
    packs.push({
      id,
      title,
      region: asString(item.region),
      school: asString(item.school),
      subject: asString(item.subject, 'Mathematik'),
      version,
      url,
      size: typeof item.size === 'number' ? item.size : undefined,
      changelog: asString(item.changelog) || undefined,
    })
  }
  if (packs.length === 0) return null
  return { updatedAt: asString(raw.updatedAt), packs }
}

export function mergePackUpdate(previous: CurriculumPack, incoming: CurriculumPack): CurriculumPack {
  const byId = new Map<string, PackExtra>()
  for (const extra of previous.extras) byId.set(extra.id, extra)
  for (const extra of incoming.extras) byId.set(extra.id, extra)
  const extras = [...byId.values()]
  return {
    ...incoming,
    extras,
    contentHash: incoming.contentHash || packContentHash(incoming.official, extras),
  }
}

export function parseCurriculumRefs(raw: unknown): CurriculumRef[] {
  if (!Array.isArray(raw)) return []
  const out: CurriculumRef[] = []
  const seen = new Set<string>()
  for (const item of raw) {
    if (!isRecord(item)) continue
    const moduleId = asString(item.moduleId).trim()
    const version = asString(item.version).trim()
    if (!moduleId || !version || seen.has(moduleId)) continue
    seen.add(moduleId)
    const contentHash = asString(item.contentHash).trim()
    out.push({ moduleId, version, ...(contentHash ? { contentHash } : {}) })
  }
  return out
}

export function parseInstalledCurricula(raw: unknown): InstalledCurriculum[] {
  if (!Array.isArray(raw)) return []
  const byId = new Map<string, InstalledCurriculum>()
  for (const item of raw) {
    if (!isRecord(item)) continue
    const id = asString(item.id).trim()
    const version = asString(item.version).trim()
    if (!id || !version) continue
    byId.set(id, {
      id,
      version,
      installedAt: asNumber(item.installedAt, 0),
      contentHash: asString(item.contentHash) || undefined,
    })
  }
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id))
}

export function parseCurriculumPacksMap(raw: unknown): Record<string, CurriculumPack> {
  if (!isRecord(raw)) return {}
  const out: Record<string, CurriculumPack> = {}
  for (const [key, value] of Object.entries(raw)) {
    const pack = parseCurriculumPack(value)
    if (pack) out[pack.id || key] = pack
  }
  return out
}

export function mergeInstalledPackMaps(
  base: Record<string, CurriculumPack>,
  incoming: Record<string, CurriculumPack>,
): Record<string, CurriculumPack> {
  const ids = new Set([...Object.keys(base), ...Object.keys(incoming)])
  const out: Record<string, CurriculumPack> = {}
  for (const id of ids) {
    const a = base[id]
    const b = incoming[id]
    if (!a) out[id] = b
    else if (!b) out[id] = a
    else if (compareSemver(a.version, b.version) < 0) out[id] = mergePackUpdate(a, b)
    else if (compareSemver(a.version, b.version) > 0) out[id] = mergePackUpdate(b, a)
    else out[id] = a.extras.length >= b.extras.length ? mergePackUpdate(b, a) : mergePackUpdate(a, b)
  }
  return out
}

export function mergeInstalledMeta(
  base: InstalledCurriculum[],
  incoming: InstalledCurriculum[],
): InstalledCurriculum[] {
  const byId = new Map<string, InstalledCurriculum>()
  for (const row of [...base, ...incoming]) {
    const prev = byId.get(row.id)
    if (!prev || isNewerVersion(row.version, prev.version) || row.installedAt > prev.installedAt) {
      byId.set(row.id, row)
    }
  }
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id))
}

export function parseDeletedCurricula(
  raw: unknown,
  now: number = Date.now(),
): DeletedCurriculum[] {
  if (!Array.isArray(raw)) return []
  const byId = new Map<string, DeletedCurriculum>()
  const cutoff = now - DELETED_CURRICULUM_TTL_MS
  for (const item of raw) {
    if (!isRecord(item)) continue
    const id = asString(item.id).trim()
    if (!id) continue
    const deletedAt = asNumber(item.deletedAt, 0)
    if (deletedAt < cutoff) continue
    const prev = byId.get(id)
    if (!prev || deletedAt > prev.deletedAt) byId.set(id, { id, deletedAt })
  }
  return [...byId.values()]
    .sort((a, b) => b.deletedAt - a.deletedAt || a.id.localeCompare(b.id))
    .slice(0, MAX_DELETED_CURRICULA)
}

export function mergeDeletedCurricula(
  base: DeletedCurriculum[] | undefined,
  incoming: DeletedCurriculum[] | undefined,
  now: number = Date.now(),
): DeletedCurriculum[] {
  return parseDeletedCurricula([...(base ?? []), ...(incoming ?? [])], now)
}

/**
 * Drop packs whose tombstone is newer than `installedAt`.
 * A later reinstall (`installedAt` > `deletedAt`) clears that tombstone.
 */
export function applyCurriculumTombstones(
  packs: Record<string, CurriculumPack>,
  meta: InstalledCurriculum[],
  deleted: DeletedCurriculum[],
): {
  packs: Record<string, CurriculumPack>
  meta: InstalledCurriculum[]
  deleted: DeletedCurriculum[]
} {
  const deletedAt = new Map(deleted.map((row) => [row.id, row.deletedAt]))
  const metaById = new Map(meta.map((row) => [row.id, row]))
  const livePacks: Record<string, CurriculumPack> = {}
  const resurrected = new Set<string>()

  for (const [id, pack] of Object.entries(packs)) {
    const tomb = deletedAt.get(id)
    const installedAt = metaById.get(id)?.installedAt ?? 0
    if (tomb != null && installedAt > tomb) {
      livePacks[id] = pack
      resurrected.add(id)
      continue
    }
    if (tomb != null) continue
    livePacks[id] = pack
  }

  const liveMeta: InstalledCurriculum[] = []
  for (const row of meta) {
    const tomb = deletedAt.get(row.id)
    if (tomb != null && row.installedAt > tomb) {
      liveMeta.push(row)
      resurrected.add(row.id)
      continue
    }
    if (tomb != null) continue
    liveMeta.push(row)
  }

  return {
    packs: livePacks,
    meta: liveMeta.sort((a, b) => a.id.localeCompare(b.id)),
    deleted: deleted.filter((row) => !resurrected.has(row.id)),
  }
}

export function packNeedsUpdate(localVersion: string, remoteVersion: string): boolean {
  return isNewerVersion(remoteVersion, localVersion)
}

export { compareSemver, isNewerVersion }
