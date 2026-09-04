import { afterEach, describe, expect, it, vi } from 'vitest'
import { CURRICULUM_VERSION } from '../curriculum/registry'
import {
  EXAM_CODE_PREFIX,
  ExamCodeError,
  buildExamLink,
  decodeExam,
  encodeExam,
  parseExamHash,
  resolveExam,
} from './examCode'
import type { ExamSpec } from './types'

const sampleSpec: ExamSpec = {
  schema: 'A',
  curriculumVersion: CURRICULUM_VERSION,
  titel: 'Klausur: Brüche & Flächen (Übung)',
  aufgaben: [
    { modul: 'mathematik-klasse-6', thema: 'lb1-kuerzen', seed: 12345, punkte: 10 },
    { modul: 'mathematik-klasse-6', thema: 'lb1-erweitern', seed: 777, punkte: 8 },
    { modul: 'mathematik-klasse-5', thema: 'lb2-erweitern', seed: 42, punkte: 5 },
  ],
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('exam code round-trip', () => {
  it('encodes to a prefixed, checksummed string and decodes back equal', () => {
    const code = encodeExam(sampleSpec)
    expect(code.startsWith(EXAM_CODE_PREFIX)).toBe(true)
    expect(code).toMatch(/^MSX1:[A-Za-z0-9_-]+:[a-z0-9]+$/)
    expect(decodeExam(code)).toEqual(sampleSpec)
  })

  it('survives German umlauts / special characters in the title', () => {
    const spec: ExamSpec = { ...sampleSpec, titel: 'Größenübung — ½, ×, ÷, äöüß' }
    expect(decodeExam(encodeExam(spec))).toEqual(spec)
  })

  it('tolerates surrounding whitespace in a pasted code', () => {
    const code = encodeExam(sampleSpec)
    expect(decodeExam(`  \n${code}\t `)).toEqual(sampleSpec)
  })
})

describe('exam code rejection of broken input', () => {
  it('rejects a missing prefix', () => {
    expect(() => decodeExam('not-a-code')).toThrow(ExamCodeError)
  })

  it('rejects a code without a checksum segment', () => {
    expect(() => decodeExam(`${EXAM_CODE_PREFIX}onlypayload`)).toThrow(ExamCodeError)
  })

  it('rejects a tampered payload via the checksum', () => {
    const code = encodeExam(sampleSpec)
    const sep = code.lastIndexOf(':')
    const tampered = `${code.slice(0, 8)}X${code.slice(9, sep)}${code.slice(sep)}`
    expect(() => decodeExam(tampered)).toThrow(/Prüfsumme/)
  })

  it('rejects a valid-checksum payload that is not a valid exam', () => {
    // Re-encode arbitrary JSON with a *correct* checksum to prove the shape
    // validation (not just the checksum) rejects it.
    const bogus = encodeExam({ hello: 'world' } as unknown as ExamSpec)
    expect(() => decodeExam(bogus)).toThrow(/keine gültige Klausur/)
  })
})

describe('curriculum version handling', () => {
  it('warns (but still decodes) when the curriculum version differs', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const spec: ExamSpec = { ...sampleSpec, curriculumVersion: CURRICULUM_VERSION + 1 }
    const decoded = decodeExam(encodeExam(spec))
    expect(decoded.curriculumVersion).toBe(CURRICULUM_VERSION + 1)
    expect(warn).toHaveBeenCalledOnce()
  })

  it('does not warn for a matching curriculum version', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    decodeExam(encodeExam(sampleSpec))
    expect(warn).not.toHaveBeenCalled()
  })
})

describe('shareable links', () => {
  it('builds a link with an encoded #klausur hash and parses it back', () => {
    const code = encodeExam(sampleSpec)
    const link = buildExamLink(code)
    expect(link).toContain(`#klausur=`)
    const hash = link.slice(link.indexOf('#'))
    expect(parseExamHash(hash)).toBe(code)
    expect(decodeExam(parseExamHash(hash)!)).toEqual(sampleSpec)
  })

  it('returns null when the hash carries no exam code', () => {
    expect(parseExamHash('#other=1')).toBeNull()
    expect(parseExamHash('')).toBeNull()
  })
})

describe('resolveExam', () => {
  it('reproduces identical question/solution for the same seed', async () => {
    const first = await resolveExam(sampleSpec)
    const second = await resolveExam(sampleSpec)
    expect(first).toHaveLength(sampleSpec.aufgaben.length)
    for (let i = 0; i < first.length; i++) {
      expect(first[i].task.question).toBe(second[i].task.question)
      expect(first[i].task.solution).toBe(second[i].task.solution)
      // The generated task's own sample answer must pass its check.
      expect(first[i].task.check(first[i].task.sampleAnswer)).toBe(true)
      expect(first[i].punkte).toBe(sampleSpec.aufgaben[i].punkte)
    }
  })

  it('produces stable output across a decode round-trip', async () => {
    const viaSpec = await resolveExam(sampleSpec)
    const viaCode = await resolveExam(decodeExam(encodeExam(sampleSpec)))
    expect(viaCode.map((r) => r.task.question)).toEqual(
      viaSpec.map((r) => r.task.question),
    )
    expect(viaCode.map((r) => r.task.solution)).toEqual(
      viaSpec.map((r) => r.task.solution),
    )
  })

  it('rejects an unknown module', async () => {
    const spec: ExamSpec = {
      ...sampleSpec,
      aufgaben: [{ modul: 'does-not-exist', thema: 'x', seed: 1, punkte: 1 }],
    }
    await expect(resolveExam(spec)).rejects.toThrow(ExamCodeError)
  })

  it('rejects an unknown topic within a known module', async () => {
    const spec: ExamSpec = {
      ...sampleSpec,
      aufgaben: [
        { modul: 'mathematik-klasse-6', thema: 'kein-thema', seed: 1, punkte: 1 },
      ],
    }
    await expect(resolveExam(spec)).rejects.toThrow(/nicht gefunden/)
  })

  it('builds a task from embedded content (schema B forward-compat)', async () => {
    const spec: ExamSpec = {
      schema: 'B',
      curriculumVersion: CURRICULUM_VERSION,
      titel: 'Eingebettet',
      aufgaben: [
        {
          modul: 'mathematik-klasse-6',
          thema: 'lb1-kuerzen',
          seed: 0,
          punkte: 7,
          frage: 'Kürze 4/8 vollständig.',
          antwortart: 'fraction',
          loesung: '1/2',
          erklaerung: 'Teile Zähler und Nenner durch 4.',
        },
      ],
    }
    const [resolved] = await resolveExam(spec)
    expect(resolved.task.question).toBe('Kürze 4/8 vollständig.')
    expect(resolved.task.check(resolved.task.sampleAnswer)).toBe(true)
    expect(resolved.punkte).toBe(7)
  })
})
