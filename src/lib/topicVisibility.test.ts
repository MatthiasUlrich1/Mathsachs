import { describe, expect, it } from 'vitest'
import type { Grade, Topic } from '../curriculum/types'
import {
  filterGradeForRole,
  filterLoadedForRole,
  isTopicVisible,
} from './topicVisibility'
import { loadAuthoringAreas, loadAuthoringPacks } from './taskAuthoring'

const topic = (id: string, extra: Partial<Topic> = {}): Topic =>
  ({ id, title: id, pointsPerTask: 1, ...extra }) as Topic

const grade = (): Grade =>
  ({
    id: 'g',
    title: 'Klasse 5',
    packId: 'p',
    areas: [
      { id: 'a1', title: 'Offen', topics: [topic('t1'), topic('t1__neu', { released: false, neu: true })] },
      { id: 'a2', title: 'Nur gesperrt', topics: [topic('t2', { released: false })] },
      { id: 'a3', title: 'Leer', topics: [] },
    ],
  }) as unknown as Grade

describe('isTopicVisible', () => {
  it('hides locked topics from every non-preview role', () => {
    for (const role of ['schueler', 'lehrer', 'klassenlehrer', 'eltern', undefined, 'unbekannt']) {
      expect(isTopicVisible({ released: false }, role)).toBe(false)
      expect(isTopicVisible({ id: 'x__neu', released: false, neu: true }, role)).toBe(false)
    }
  })

  it('shows locked topics to pruefer and entwickler', () => {
    expect(isTopicVisible({ released: false }, 'pruefer')).toBe(true)
    expect(isTopicVisible({ released: false }, 'entwickler')).toBe(true)
  })

  it('shows released topics and topics without released flag to everyone', () => {
    expect(isTopicVisible({ released: true }, 'schueler')).toBe(true)
    expect(isTopicVisible({ id: 'plain' }, 'schueler')).toBe(true)
    expect(isTopicVisible({ id: 'plain' }, undefined)).toBe(true)
  })

  it('treats outline topics flagged neu as locked even without released', () => {
    expect(isTopicVisible({ id: 'x', neu: true }, 'lehrer')).toBe(false)
  })
})

describe('filterGradeForRole / filterLoadedForRole', () => {
  it('drops locked topics and areas that become empty, keeps originally empty areas', () => {
    const out = filterGradeForRole(grade(), 'schueler')
    expect(out.areas.map((a) => a.id)).toEqual(['a1', 'a3'])
    expect(out.areas[0]!.topics.map((t) => t.id)).toEqual(['t1'])
  })

  it('returns the full grade for pruefer and entwickler', () => {
    const g = grade()
    expect(filterGradeForRole(g, 'pruefer')).toBe(g)
    expect(filterGradeForRole(g, 'entwickler')).toBe(g)
  })

  it('drops grades without any visible topic', () => {
    const onlyLocked = {
      ...grade(),
      areas: [{ id: 'a', title: 'A', topics: [topic('z', { released: false })] }],
    } as unknown as Grade
    const rows = [
      { moduleId: 'm1', grade: grade() },
      { moduleId: 'm2', grade: onlyLocked },
    ]
    expect(filterLoadedForRole(rows, 'lehrer').map((r) => r.moduleId)).toEqual(['m1'])
    expect(filterLoadedForRole(rows, 'pruefer').map((r) => r.moduleId)).toEqual(['m1', 'm2'])
  })
})

describe('Aufgabengenerator topic picker', () => {
  it('lists locked topics only for entwickler, not for lehrer', async () => {
    const packs = await loadAuthoringPacks()
    let compared = 0
    let hidden = 0
    for (const pack of packs) {
      for (const g of pack.grades) {
        const dev = await loadAuthoringAreas(pack.id, g.id, 'entwickler')
        const teacher = await loadAuthoringAreas(pack.id, g.id, 'lehrer')
        const devIds = new Set(dev.flatMap((a) => a.topics.map((t) => t.id)))
        const teacherIds = teacher.flatMap((a) => a.topics.map((t) => t.id))
        for (const id of teacherIds) expect(devIds.has(id)).toBe(true)
        expect(teacherIds.some((id) => id.includes('__neu'))).toBe(false)
        hidden += devIds.size - teacherIds.length
        compared += 1
      }
    }
    expect(compared).toBeGreaterThan(0)
    expect(hidden).toBeGreaterThan(0)
  }, 60_000)
})
