import { describe, expect, it } from 'vitest'
import { CURRICULUM_VERSION } from '../curriculum/registry'
import { encodeExam } from './examCode'
import type { ExamSpec } from './types'
import {
  EXAM_CODE_SHARE_SUBJECT,
  examCodeMailtoUrl,
  examCodeShareSubject,
  examCodeShareText,
  examCodeWhatsAppUrl,
} from './share'

const sampleSpec: ExamSpec = {
  schema: 'A',
  curriculumVersion: CURRICULUM_VERSION,
  titel: 'Übungsklausur Brüche',
  aufgaben: [
    { modul: 'mathematik-klasse-6', thema: 'lb1-kuerzen', seed: 12345, punkte: 10 },
  ],
}

const LAN_URL_RE = /192\.168|#klausur=|:4747|file:\/\//

describe('examCodeShareText', () => {
  it('includes the Klausurcode, title and instruction, but no LAN URL', () => {
    const code = encodeExam(sampleSpec)
    const text = examCodeShareText(code, sampleSpec.titel)
    expect(text).toContain(code)
    expect(text).toContain('Übungsklausur Brüche')
    expect(text).toContain('Schüler öffnet die App → Klausur schreiben → Code eingeben.')
    expect(text).not.toMatch(LAN_URL_RE)
    expect(text).not.toContain('http')
  })

  it('falls back to the generic subject when the title is blank', () => {
    const text = examCodeShareText('MSX1:abc:1', '   ')
    expect(text.startsWith(`${EXAM_CODE_SHARE_SUBJECT}:`)).toBe(true)
    expect(text).toContain('MSX1:abc:1')
  })
})

describe('examCodeShareSubject', () => {
  it('is the fixed German mail subject', () => {
    expect(examCodeShareSubject()).toBe('Mathsachs Klausurcode')
  })
})

describe('examCodeWhatsAppUrl', () => {
  it('puts the exam code on wa.me and does not include a LAN URL', () => {
    const code = encodeExam(sampleSpec)
    const text = examCodeShareText(code, sampleSpec.titel)
    const url = examCodeWhatsAppUrl(code, sampleSpec.titel)
    expect(url).toBe(`https://wa.me/?text=${encodeURIComponent(text)}`)
    expect(url.startsWith('https://wa.me/?text=')).toBe(true)
    expect(decodeURIComponent(url)).toContain(code)
    expect(url).not.toMatch(LAN_URL_RE)
    expect(url).not.toContain(' ')
  })
})

describe('examCodeMailtoUrl', () => {
  it('has no recipient, encodes subject plus body with the exam code', () => {
    const code = encodeExam(sampleSpec)
    const subject = examCodeShareSubject()
    const body = examCodeShareText(code, sampleSpec.titel)
    const href = examCodeMailtoUrl(code, sampleSpec.titel)
    expect(href.startsWith('mailto:?')).toBe(true)
    expect(href).toBe(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    )
    expect(decodeURIComponent(href)).toContain(code)
    expect(href).toContain('subject=')
    expect(href).toContain('body=')
    expect(href).not.toContain('mailto:info')
    expect(href).not.toMatch(LAN_URL_RE)
  })
})
