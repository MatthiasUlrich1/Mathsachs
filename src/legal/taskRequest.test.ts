import { describe, expect, it } from 'vitest'
import { klasse5 } from '../curriculum/math5'
import { klasse6 } from '../curriculum/math6'
import {
  GYM_SACHSEN_PACK_ID,
  GYM_SACHSEN_PHYSIK_PACK_ID,
  OS_HS_PACK_ID,
  OS_RS_PACK_ID,
} from '../curriculum/pack'
import { CONTACT_EMAIL } from './content'
import {
  TASK_REQUEST_ATTACHMENT_NOTE,
  TASK_REQUEST_PACK_IDS,
  TASK_REQUEST_SUBJECT,
  buildTaskRequestMailto,
  isTaskRequestComplete,
  keepValidArea,
  loadTaskRequestAreas,
  loadTaskRequestPacks,
  taskRequestBody,
  trimTaskRequest,
} from './taskRequest'

const sample = {
  packId: GYM_SACHSEN_PACK_ID,
  packTitle: 'Gymnasium Sachsen · Mathematik',
  gradeId: 'klasse-6',
  grade: ' Klasse 6 ',
  area: ' Brüche ',
  title: ' Brüche addieren ',
  example: ' Berechne 1/2 + 1/3. ',
}

describe('task request Vorgaben', () => {
  it('lists every bundled Lehrplan pack', async () => {
    expect([...TASK_REQUEST_PACK_IDS]).toEqual([
      GYM_SACHSEN_PACK_ID,
      GYM_SACHSEN_PHYSIK_PACK_ID,
      OS_HS_PACK_ID,
      OS_RS_PACK_ID,
    ])
    const packs = await loadTaskRequestPacks()
    expect(packs.map((p) => p.id)).toEqual([...TASK_REQUEST_PACK_IDS])
    expect(packs.map((p) => p.title)).toEqual([
      'Gymnasium Sachsen · Mathematik',
      'Gymnasium Sachsen · Physik',
      'Oberschule Sachsen · Mathematik · Hauptschulbildungsgang',
      'Oberschule Sachsen · Mathematik · Realschulbildungsgang',
    ])
    const math = packs.find((p) => p.id === GYM_SACHSEN_PACK_ID)!
    expect(math.grades.some((g) => g.gradeTitle === 'Klasse 6')).toBe(true)
    const physik = packs.find((p) => p.id === GYM_SACHSEN_PHYSIK_PACK_ID)!
    expect(physik.grades.some((g) => g.gradeTitle === 'Klasse 6')).toBe(true)
  })

  it('requires Lehrplan, Klassenstufe, Themengebiet, Titel and Aufgabenbeispiel', () => {
    expect(isTaskRequestComplete(sample)).toBe(true)
    expect(isTaskRequestComplete({ ...sample, packId: '  ' })).toBe(false)
    expect(isTaskRequestComplete({ ...sample, grade: '  ' })).toBe(false)
    expect(isTaskRequestComplete({ ...sample, area: '' })).toBe(false)
    expect(isTaskRequestComplete({ ...sample, title: '\n' })).toBe(false)
    expect(isTaskRequestComplete({ ...sample, example: '   ' })).toBe(false)
  })

  it('builds a German body with Lehrplan and the four Vorgaben', () => {
    expect(trimTaskRequest(sample)).toEqual({
      packId: GYM_SACHSEN_PACK_ID,
      packTitle: 'Gymnasium Sachsen · Mathematik',
      gradeId: 'klasse-6',
      grade: 'Klasse 6',
      area: 'Brüche',
      title: 'Brüche addieren',
      example: 'Berechne 1/2 + 1/3.',
    })
    expect(taskRequestBody(sample)).toBe(
      [
        'Vorgaben für eine neue Aufgabe:',
        '',
        'Lehrplan: Gymnasium Sachsen · Mathematik',
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
    expect(decodeURIComponent(href)).toContain('Lehrplan: Gymnasium Sachsen · Mathematik')
    expect(decodeURIComponent(href)).toContain('Klassenstufe: Klasse 6')
    expect(decodeURIComponent(href)).toContain('Themengebiet: Brüche')
    expect(decodeURIComponent(href)).toContain('Titel des Themas: Brüche addieren')
    expect(decodeURIComponent(href)).toContain('Berechne 1/2 + 1/3.')
    expect(href).not.toContain(' ')
    expect(TASK_REQUEST_SUBJECT).toBe(
      'Neue Aufgabe für das TaskTrophy Übungsprogramm.',
    )
  })

  it('does not put a user name or Klassencode into the mail', () => {
    const href = buildTaskRequestMailto(sample)
    const decoded = decodeURIComponent(href)
    expect(decoded).not.toMatch(/Vorname|Klassencode|Geräte-ID|Ada/i)
  })

  it('lists Themengebiete from the selected Lehrplan areas, not Einzelthemen', async () => {
    const titles = await loadTaskRequestAreas('klasse-5', GYM_SACHSEN_PACK_ID)
    expect(titles).toEqual(klasse5.areas.map((a) => a.title))
    expect(titles).toContain('Arbeiten mit natürlichen Zahlen')
    expect(titles).not.toContain('Natürliche Zahlen runden')
    expect(titles).not.toContain('Arbeiten mit gebrochenen Zahlen')
  })

  it('clears a Themengebiet that does not belong to the new Klassenstufe', async () => {
    const klasse5Titles = await loadTaskRequestAreas('klasse-5', GYM_SACHSEN_PACK_ID)
    const klasse6Titles = await loadTaskRequestAreas('klasse-6', GYM_SACHSEN_PACK_ID)
    expect(klasse6Titles).toEqual(klasse6.areas.map((a) => a.title))
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
    expect(await loadTaskRequestAreas('klasse-99')).toEqual([])
  })

  it('loads Physik Lernbereiche without requiring the pack to be installed', async () => {
    const titles = await loadTaskRequestAreas('physik-klasse-6')
    expect(titles.length).toBeGreaterThan(0)
    expect(titles.some((t) => /Körper|Licht|Elektr|Wärme|Magnet/i.test(t))).toBe(
      true,
    )
  })

  it('accepts „siehe Anhang“ and puts the area title into the mailto body', () => {
    const fields = {
      packId: GYM_SACHSEN_PACK_ID,
      packTitle: 'Gymnasium Sachsen · Mathematik',
      gradeId: 'klasse-5',
      grade: 'Klasse 5',
      area: 'Arbeiten mit natürlichen Zahlen',
      title: 'Natürliche Zahlen runden',
      example: `  ${TASK_REQUEST_ATTACHMENT_NOTE}  `,
    }
    expect(isTaskRequestComplete(fields)).toBe(true)
    expect(trimTaskRequest(fields).example).toBe(TASK_REQUEST_ATTACHMENT_NOTE)
    const body = taskRequestBody(fields)
    expect(body).toContain('Lehrplan: Gymnasium Sachsen · Mathematik')
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
