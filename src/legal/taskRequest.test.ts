import { describe, expect, it } from 'vitest'
import { availableCurricula } from '../curriculum/registry'
import { CONTACT_EMAIL } from './content'
import {
  TASK_REQUEST_GRADES,
  TASK_REQUEST_SUBJECT,
  buildTaskRequestMailto,
  isTaskRequestComplete,
  taskRequestBody,
  trimTaskRequest,
} from './taskRequest'

const sample = {
  grade: ' Klasse 6 ',
  area: ' Brüche ',
  title: ' Brüche addieren ',
  example: ' Berechne 1/2 + 1/3. ',
}

describe('task request Vorgaben', () => {
  it('lists every Lehrplan Klassenstufe', () => {
    expect(TASK_REQUEST_GRADES).toEqual(
      availableCurricula.map((mod) => mod.gradeTitle),
    )
    expect(TASK_REQUEST_GRADES).toContain('Klasse 6')
    expect(TASK_REQUEST_GRADES).toContain('Jahrgangsstufe 11/12 (Grundkurs)')
  })

  it('requires Klassenstufe, Themengebiet, Titel and Aufgabenbeispiel', () => {
    expect(isTaskRequestComplete(sample)).toBe(true)
    expect(isTaskRequestComplete({ ...sample, grade: '  ' })).toBe(false)
    expect(isTaskRequestComplete({ ...sample, area: '' })).toBe(false)
    expect(isTaskRequestComplete({ ...sample, title: '\n' })).toBe(false)
    expect(isTaskRequestComplete({ ...sample, example: '   ' })).toBe(false)
  })

  it('builds a German body with the four Vorgaben', () => {
    expect(trimTaskRequest(sample)).toEqual({
      grade: 'Klasse 6',
      area: 'Brüche',
      title: 'Brüche addieren',
      example: 'Berechne 1/2 + 1/3.',
    })
    expect(taskRequestBody(sample)).toBe(
      [
        'Vorgaben für eine neue Aufgabe:',
        '',
        'Klassenstufe: Klasse 6',
        'Themengebiet: Brüche',
        'Titel des Themas: Brüche addieren',
        '',
        'Aufgabenbeispiel:',
        'Berechne 1/2 + 1/3.',
      ].join('\n'),
    )
  })

  it('opens mailto to the contact address with encoded subject and body', () => {
    const href = buildTaskRequestMailto(sample)
    expect(href.startsWith(`mailto:${CONTACT_EMAIL}?`)).toBe(true)
    expect(href).toContain(`subject=${encodeURIComponent(TASK_REQUEST_SUBJECT)}`)
    expect(href).toContain(`body=${encodeURIComponent(taskRequestBody(sample))}`)
    expect(decodeURIComponent(href)).toContain('Klassenstufe: Klasse 6')
    expect(decodeURIComponent(href)).toContain('Themengebiet: Brüche')
    expect(decodeURIComponent(href)).toContain('Titel des Themas: Brüche addieren')
    expect(decodeURIComponent(href)).toContain('Berechne 1/2 + 1/3.')
    expect(href).not.toContain(' ')
    expect(TASK_REQUEST_SUBJECT).toBe(
      'Neue Aufgabe für das Mathsachs Übungsprogramm.',
    )
  })

  it('does not put a user name or Klassencode into the mail', () => {
    const href = buildTaskRequestMailto(sample)
    const decoded = decodeURIComponent(href)
    expect(decoded).not.toMatch(/Vorname|Klassencode|Geräte-ID|Ada/i)
  })
})
