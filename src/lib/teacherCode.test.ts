import { describe, expect, it } from 'vitest'
import { CONTACT_EMAIL } from '../legal/content'
import {
  TEACHER_CODE,
  TEACHER_CODE_REQUEST_BODY,
  TEACHER_CODE_REQUEST_SUBJECT,
  TEACHER_CODE_WRONG,
  applyRoleChange,
  buildTeacherCodeRequestMailto,
  formatTeacherCode,
  matchesTeacherCode,
  needsTeacherCode,
  normalizeTeacherCode,
} from './teacherCode'

describe('Lehrercode', () => {
  it('is one 8-character school-wide code', () => {
    expect(TEACHER_CODE).toBe('88MXDZ92')
    expect(TEACHER_CODE).toMatch(/^[0-9A-HJKMNP-TV-Z]{8}$/)
    expect(formatTeacherCode()).toBe('88MX-DZ92')
  })

  it('normalizes like a Klassencode and accepts separators', () => {
    expect(normalizeTeacherCode(' 88mx-dz92 ')).toBe('88MXDZ92')
    expect(normalizeTeacherCode('88mxo dz92')).toBe('88MX0DZ92')
    expect(matchesTeacherCode('88mx-dz92')).toBe(true)
    expect(matchesTeacherCode('88MXDZ92')).toBe(true)
    expect(matchesTeacherCode('ABCD-EFGH')).toBe(false)
    expect(matchesTeacherCode('')).toBe(false)
  })

  it('requires the code only when entering Lehrer or Klassenlehrer', () => {
    expect(needsTeacherCode('schueler', 'lehrer')).toBe(true)
    expect(needsTeacherCode('eltern', 'klassenlehrer')).toBe(true)
    expect(needsTeacherCode(null, 'lehrer')).toBe(true)
    expect(needsTeacherCode(undefined, 'klassenlehrer')).toBe(true)
    expect(needsTeacherCode('lehrer', 'klassenlehrer')).toBe(false)
    expect(needsTeacherCode('klassenlehrer', 'lehrer')).toBe(false)
    expect(needsTeacherCode('lehrer', 'schueler')).toBe(false)
    expect(needsTeacherCode('schueler', 'eltern')).toBe(false)
    expect(needsTeacherCode('schueler', 'schueler')).toBe(false)
  })

  it('applies a teacher role only with the matching code', () => {
    expect(applyRoleChange('schueler', 'lehrer', 'wrong')).toEqual({
      ok: false,
      error: TEACHER_CODE_WRONG,
    })
    expect(applyRoleChange(null, 'klassenlehrer', '88mx-dz92')).toEqual({
      ok: true,
      role: 'klassenlehrer',
    })
    expect(applyRoleChange('lehrer', 'klassenlehrer', '')).toEqual({
      ok: true,
      role: 'klassenlehrer',
    })
    expect(applyRoleChange('lehrer', 'eltern', '')).toEqual({
      ok: true,
      role: 'eltern',
    })
  })

  it('builds a mailto without person data or the secret code', () => {
    const href = buildTeacherCodeRequestMailto()
    expect(href.startsWith(`mailto:${CONTACT_EMAIL}?`)).toBe(true)
    expect(href).toContain(
      `subject=${encodeURIComponent(TEACHER_CODE_REQUEST_SUBJECT)}`,
    )
    expect(href).toContain(
      `body=${encodeURIComponent(TEACHER_CODE_REQUEST_BODY)}`,
    )
    expect(href).not.toContain(' ')
    const decoded = decodeURIComponent(href)
    expect(decoded).toContain('keine Personendaten')
    expect(decoded).not.toMatch(/Vorname|Geräte-ID|Ada|88MXDZ92|88MX-DZ92/i)
    expect(TEACHER_CODE_REQUEST_BODY).not.toContain(TEACHER_CODE)
    expect(TEACHER_CODE_REQUEST_SUBJECT).toBe(
      'Lehrercode für das Mathsachs Übungsprogramm.',
    )
  })
})
