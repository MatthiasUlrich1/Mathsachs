import { describe, expect, it } from 'vitest'
import { availableCurricula } from '../curriculum/registry'
import { klasse5 } from '../curriculum/math5'
import { klasse6 } from '../curriculum/math6'
import { CONTACT_EMAIL } from './content'
import {
  TASK_REQUEST_ATTACHMENT_NOTE,
  TASK_REQUEST_GRADES,
  TASK_REQUEST_SUBJECT,
  areaTitlesOfGrade,
  buildTaskRequestMailto,
  getTaskRequestModule,
  isTaskRequestComplete,
  keepValidArea,
  loadTaskRequestAreas,
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

  it('lists Themengebiete from the selected Lehrplan areas, not Einzelthemen', async () => {
    expect(getTaskRequestModule('Klasse 5')?.id).toBe('mathematik-klasse-5')
    const titles = await loadTaskRequestAreas('Klasse 5')
    expect(titles).toEqual(areaTitlesOfGrade(klasse5))
    expect(titles).toContain('Arbeiten mit natürlichen Zahlen')
    expect(titles).not.toContain('Natürliche Zahlen runden')
    expect(titles).not.toContain('Arbeiten mit gebrochenen Zahlen')
  })

  it('clears a Themengebiet that does not belong to the new Klassenstufe', async () => {
    const klasse5Titles = await loadTaskRequestAreas('Klasse 5')
    const klasse6Titles = await loadTaskRequestAreas(' Klasse 6 ')
    expect(klasse6Titles).toEqual(areaTitlesOfGrade(klasse6))
    expect(
      keepValidArea('Arbeiten mit gebrochenen Zahlen', klasse5Titles),
    ).toBe('')
    expect(
      keepValidArea('Arbeiten mit natürlichen Zahlen', klasse5Titles),
    ).toBe('Arbeiten mit natürlichen Zahlen')
    expect(keepValidArea('Arbeiten mit gebrochenen Zahlen', klasse6Titles)).toBe(
      'Arbeiten mit gebrochenen Zahlen',
    )
    expect(await loadTaskRequestAreas('')).toEqual([])
    expect(await loadTaskRequestAreas('Klasse 99')).toEqual([])
  })

  it('accepts „siehe Anhang“ and puts the area title into the mailto body', () => {
    const fields = {
      grade: 'Klasse 5',
      area: 'Arbeiten mit natürlichen Zahlen',
      title: 'Natürliche Zahlen runden',
      example: `  ${TASK_REQUEST_ATTACHMENT_NOTE}  `,
    }
    expect(isTaskRequestComplete(fields)).toBe(true)
    expect(trimTaskRequest(fields).example).toBe(TASK_REQUEST_ATTACHMENT_NOTE)
    const body = taskRequestBody(fields)
    expect(body).toContain('Klassenstufe: Klasse 5')
    expect(body).toContain('Themengebiet: Arbeiten mit natürlichen Zahlen')
    expect(body).toContain('Aufgabenbeispiel:')
    expect(body).toContain(TASK_REQUEST_ATTACHMENT_NOTE)
    const href = buildTaskRequestMailto(fields)
    expect(decodeURIComponent(href)).toContain(
      'Themengebiet: Arbeiten mit natürlichen Zahlen',
    )
    expect(decodeURIComponent(href)).toContain(TASK_REQUEST_ATTACHMENT_NOTE)
  })
})
