import { describe, expect, it } from 'vitest'
import type { CurriculumPack, PackGrade } from './pack'
import {
  countPackTopics,
  formatCurriculumDate,
  formatPackCardCopy,
  formatPackGradesLabel,
} from './packDisplay'

const grade = (gradeTitle: string, topics = 1): PackGrade => ({
  id: gradeTitle.toLowerCase().replace(/\s+/g, '-'),
  title: gradeTitle,
  subjectTitle: 'Biologie',
  gradeTitle,
  description: 'Test',
  areas: [
    {
      id: 'lb1',
      title: 'LB1',
      topics: Array.from({ length: topics }, (_, i) => ({
        id: `t${i}`,
        title: `Thema ${i}`,
        pointsPerTask: 10,
      })),
    },
  ],
})

const samplePack = (grades: PackGrade[]): Pick<CurriculumPack, 'official'> => ({
  official: grades,
})

describe('packDisplay', () => {
  it('counts topics and formats grade ranges', () => {
    const pack = samplePack([
      grade('Klasse 5', 2),
      grade('Klasse 6', 1),
      grade('Jahrgangsstufe 11/12 (Grundkurs)', 3),
    ])
    expect(countPackTopics(pack)).toBe(6)
    expect(formatPackGradesLabel(pack.official)).toBe('3 Klassenstufen · Klassen 5–12')
  })

  it('formats installed card copy without changelog', () => {
    const pack = samplePack([grade('Klasse 5', 1), grade('Klasse 10', 2)])
    const copy = formatPackCardCopy({
      entry: { version: '1.2.1' },
      pack,
      local: {
        id: 'gym-sachsen-biologie',
        version: '1.2.0',
        installedAt: new Date(2026, 8, 20).getTime(),
      },
      canUpdate: true,
      catalogUpdatedAt: '2026-09-24T12:00:00.000Z',
    })
    expect(copy.coverage).toBe('3 Themen · 2 Klassenstufen · Klassen 5–10')
    expect(copy.status).toContain('Version 1.2.0')
    expect(copy.status).toContain('Aktualisiert am 20.09.2026')
    expect(copy.status).toContain('Online: Version 1.2.1')
  })

  it('formats uninstalled catalog status from manifest updatedAt', () => {
    const copy = formatPackCardCopy({
      entry: { version: '2.5.32' },
      pack: null,
      local: null,
      canUpdate: false,
      catalogUpdatedAt: '2026-09-24T12:00:00.000Z',
    })
    expect(copy.coverage).toBeNull()
    expect(copy.status).toContain('Version 2.5.32 verfügbar')
    expect(copy.status).toMatch(/Katalog vom 24\.09\.2026/)
  })

  it('formats German short dates', () => {
    expect(formatCurriculumDate(new Date(2026, 8, 24).getTime())).toBe('24.09.2026')
    expect(formatCurriculumDate(0)).toBeNull()
  })
})
