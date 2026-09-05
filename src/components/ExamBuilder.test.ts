import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { CURRICULUM_VERSION } from '../curriculum/registry'
import { encodeExam } from '../exam/examCode'
import { examCodeMailtoUrl, examCodeWhatsAppUrl } from '../exam/share'
import type { ExamSpec } from '../exam/types'

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'ExamBuilder.tsx'),
  'utf8',
)

const sampleSpec: ExamSpec = {
  schema: 'A',
  curriculumVersion: CURRICULUM_VERSION,
  titel: 'Klassenarbeit',
  aufgaben: [
    { modul: 'mathematik-klasse-6', thema: 'lb1-kuerzen', seed: 99, punkte: 5 },
  ],
}

describe('ExamBuilder Klausurerstellung', () => {
  it('does not expose a LAN share URL, QR code or Teilbarer Link', () => {
    expect(source).not.toMatch(/Teilbarer Link/)
    expect(source).not.toMatch(/QRCode|qrcode|exam-qr|QR-Code zur Klausur/)
    expect(source).not.toMatch(/shareOrigin|buildExamLink|Teilhaber/)
    expect(source).not.toMatch(/#klausur=/)
    expect(source).not.toMatch(/WLAN-Zugang dieses Rechners/)
  })

  it('keeps the Klausurcode and copy, plus WhatsApp and Mail', () => {
    expect(source).toMatch(/Klausurcode/)
    expect(source).toMatch(/Code kopieren/)
    expect(source).toMatch(/WhatsApp/)
    expect(source).toMatch(/>\s*Mail\s*</)
    expect(source).toMatch(/examCodeWhatsAppUrl/)
    expect(source).toMatch(/examCodeMailtoUrl/)
  })

  it('mail and WhatsApp hrefs contain the exam code and no LAN URL', () => {
    const code = encodeExam(sampleSpec)
    const whatsapp = examCodeWhatsAppUrl(code, sampleSpec.titel)
    const mail = examCodeMailtoUrl(code, sampleSpec.titel)
    expect(decodeURIComponent(whatsapp)).toContain(code)
    expect(decodeURIComponent(mail)).toContain(code)
    expect(whatsapp).not.toMatch(/192\.168|#klausur=|:4747/)
    expect(mail).not.toMatch(/192\.168|#klausur=|:4747/)
  })
})
