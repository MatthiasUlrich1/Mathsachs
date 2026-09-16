import { describe, expect, it } from 'vitest'
import {
  ALL_FILTER,
  defaultSubjectFilter,
  filterPacks,
  normalizeSubject,
  uniqueSubjects,
} from './packFilters'

const packs = [
  {
    id: 'gym-sachsen',
    title: 'Gymnasium Sachsen · Mathematik',
    region: 'Sachsen',
    school: 'Gymnasium',
    subject: 'Mathematik',
  },
  {
    id: 'gym-sachsen-physik',
    title: 'Gymnasium Sachsen · Physik',
    region: 'Sachsen',
    school: 'Gymnasium',
    subject: 'Physik',
  },
]

describe('packFilters subject', () => {
  it('defaults missing subject to Mathematik', () => {
    expect(normalizeSubject(undefined)).toBe('Mathematik')
    expect(normalizeSubject('  Physik ')).toBe('Physik')
  })

  it('lists Mathematik before Physik', () => {
    expect(uniqueSubjects(packs)).toEqual(['Mathematik', 'Physik'])
  })

  it('defaults to preferred subject when present', () => {
    expect(defaultSubjectFilter(packs, 'Physik')).toBe('Physik')
    expect(defaultSubjectFilter(packs)).toBe(ALL_FILTER)
  })

  it('filters catalog by Fach', () => {
    expect(filterPacks(packs, 'Sachsen', 'gymnasium', 'Physik').map((p) => p.id)).toEqual([
      'gym-sachsen-physik',
    ])
  })
})
