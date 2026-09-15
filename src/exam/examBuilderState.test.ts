import { describe, expect, it } from 'vitest'
import { CURRICULUM_VERSION } from '../curriculum/registry'
import type { ExamSpec } from './types'
import { hydrateExamBuilderFromSpec, examSelKey, examThemeKey } from './examBuilderState'

describe('hydrateExamBuilderFromSpec', () => {
  it('rebuilds themes, pools and selections from an ExamSpec', () => {
    const spec: ExamSpec = {
      schema: 'A',
      curriculumVersion: CURRICULUM_VERSION,
      titel: 'Klassenarbeit Test',
      aufgaben: [
        { modul: 'mathematik-klasse-6', thema: 'lb1-kuerzen', seed: 11, punkte: 5 },
        { modul: 'mathematik-klasse-6', thema: 'lb1-kuerzen', seed: 22, punkte: 7 },
        { modul: 'mathematik-klasse-7', thema: 'k7-lb1-nebenwinkel', seed: 33, punkte: 4 },
      ],
    }
    const state = hydrateExamBuilderFromSpec(spec)
    expect(state.title).toBe('Klassenarbeit Test')
    expect(state.selectedThemes).toContain(examThemeKey('mathematik-klasse-6', 'lb1-kuerzen'))
    expect(state.selectedThemes).toContain(examThemeKey('mathematik-klasse-7', 'k7-lb1-nebenwinkel'))
    expect(state.pools[examThemeKey('mathematik-klasse-6', 'lb1-kuerzen')]).toEqual(
      expect.arrayContaining([11, 22]),
    )
    expect(state.pools[examThemeKey('mathematik-klasse-6', 'lb1-kuerzen')]).toHaveLength(5)
    expect(state.selections[examSelKey('mathematik-klasse-6', 'lb1-kuerzen', 11)]).toBe(5)
    expect(state.selections[examSelKey('mathematik-klasse-6', 'lb1-kuerzen', 22)]).toBe(7)
  })
})
