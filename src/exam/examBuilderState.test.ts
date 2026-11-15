import { describe, expect, it } from 'vitest'
import { CURRICULUM_VERSION } from '../curriculum/registry'
import type { ExamSpec } from './types'
import {
  EXAM_POOL_SIZE,
  buildExamPoolSeeds,
  hydrateExamBuilderFromSpec,
  resolveEditThemeKeys,
  isEditReady,
  examSelKey,
  examThemeKey,
} from './examBuilderState'
import { createRng } from '../lib/rng'
import { taskContentIds } from '../curriculum/uniqueRound'
import { romAnfaenge } from '../curriculum/geschichte6'

describe('EXAM_POOL_SIZE', () => {
  it('allows more than 5 proposals per topic', () => {
    expect(EXAM_POOL_SIZE).toBeGreaterThan(5)
  })
})

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
    expect(state.pools[examThemeKey('mathematik-klasse-6', 'lb1-kuerzen')]).toHaveLength(
      EXAM_POOL_SIZE,
    )
    expect(state.selections[examSelKey('mathematik-klasse-6', 'lb1-kuerzen', 11)]).toBe(5)
    expect(state.selections[examSelKey('mathematik-klasse-6', 'lb1-kuerzen', 22)]).toBe(7)
  })
})

describe('buildExamPoolSeeds', () => {
  it('yields distinct Geschichte tasks (no identical content identities)', () => {
    const seeds = buildExamPoolSeeds(romAnfaenge, 8)
    expect(seeds.length).toBeGreaterThan(1)
    const fingerprints = seeds.map((seed) => {
      const task = romAnfaenge(createRng(seed))
      return taskContentIds(task).sort().join('|')
    })
    expect(new Set(fingerprints).size).toBe(fingerprints.length)
  })
})

describe('resolveEditThemeKeys', () => {
  it('keeps keys without a visible topic and reports them as unresolved', () => {
    const out = resolveEditThemeKeys(['m5::a', 'm5::b__neu'], new Set(['m5::a']))
    expect(out.keys).toEqual(['m5::a', 'm5::b__neu'])
    expect(out.unresolved).toEqual(['m5::b__neu'])
  })

  it('reports nothing when all keys resolve', () => {
    expect(resolveEditThemeKeys(['k'], new Set(['k'])).unresolved).toEqual([])
  })
})

describe('isEditReady', () => {
  it('is ready when all needed modules are loaded', () => {
    expect(isEditReady(['a', 'b'], ['a', 'b', 'c'], null, 'e1')).toBe(true)
  })

  it('waits while a module is missing and not yet ensured', () => {
    expect(isEditReady(['a', 'locked'], ['a'], null, 'e1')).toBe(false)
    expect(isEditReady(['a', 'locked'], ['a'], 'other', 'e1')).toBe(false)
  })

  it('is ready for an all-locked module once ensuring finished for this exam', () => {
    expect(isEditReady(['a', 'locked'], ['a'], 'e1', 'e1')).toBe(true)
  })
})
