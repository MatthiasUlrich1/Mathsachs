import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { CONTACT_EMAIL } from '../legal/content'
import {
  TEACHER_CODE_REQUEST_LABEL,
  TEACHER_CODE_WRONG,
  buildTeacherCodeRequestMailto,
  formatTeacherCode,
} from '../lib/teacherCode'
import {
  RoleOptions,
  TeacherCodeGate,
  TeacherCodeRequestButton,
  TeacherCodeReveal,
} from './TeacherCodePanel'

describe('TeacherCodePanel', () => {
  it('offers a mailto request without the secret', () => {
    const html = renderToStaticMarkup(createElement(TeacherCodeRequestButton))
    expect(html).toContain(TEACHER_CODE_REQUEST_LABEL)
    expect(html).toContain(`href="${buildTeacherCodeRequestMailto()}"`)
    expect(html).toContain(`mailto:${CONTACT_EMAIL}`)
    expect(html).not.toContain(formatTeacherCode())
  })

  it('shows the shared code in the teacher profile reveal', () => {
    const html = renderToStaticMarkup(createElement(TeacherCodeReveal))
    expect(html).toContain('Lehrercode')
    expect(html).toContain(formatTeacherCode())
    expect(html).toContain('Lehrercode kopieren')
    expect(html).toContain('andere Lehrer der Schule')
    expect(html).toContain('keine')
    expect(html).not.toContain(TEACHER_CODE_REQUEST_LABEL)
  })

  it('asks for the code and a mail request in the gate', () => {
    const html = renderToStaticMarkup(
      createElement(TeacherCodeGate, {
        value: '',
        onChange: vi.fn(),
        error: TEACHER_CODE_WRONG,
        confirmLabel: 'Mit Lehrercode übernehmen',
        onConfirm: vi.fn(),
      }),
    )
    expect(html).toContain('Lehrer und Klassenlehrer nur mit Lehrercode')
    expect(html).toContain('Lehrercode anfordern')
    expect(html).toContain('keine Personendaten')
    expect(html).toContain(TEACHER_CODE_WRONG)
    expect(html).toContain('id="teacher-code"')
    expect(html).toContain('Mit Lehrercode übernehmen')
    expect(html).not.toContain(formatTeacherCode())
  })

  it('renders the four role radios', () => {
    const html = renderToStaticMarkup(
      createElement(RoleOptions, {
        name: 'test-role',
        value: 'schueler',
        onSelect: vi.fn(),
      }),
    )
    expect(html).toContain('Schüler')
    expect(html).toContain('Eltern')
    expect(html).toContain('Klassenlehrer')
    expect(html).toContain('Lehrer')
    expect(html).toContain('name="test-role"')
  })
})
