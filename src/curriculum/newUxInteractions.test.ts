import { describe, expect, it } from 'vitest'
import { emptyInput } from './types'
import {
  comparePickTask,
  findErrorTask,
  imageHotspotTask,
} from './taskHelpers'

describe('new UX interactions', () => {
  it('comparePick grades A vs B', () => {
    const task = comparePickTask({
      question: 'Welche Karte passt?',
      cards: [
        { id: 'A', title: 'A', body: 'Richtig' },
        { id: 'B', title: 'B', body: 'Falsch' },
      ],
      correctId: 'A',
      solution: 'Richtig',
      explanation: 'A passt.',
    })
    expect(task.interactive?.type).toBe('comparePick')
    expect(task.check({ kind: 'comparePick', choice: 'A' })).toBe(true)
    expect(task.check({ kind: 'comparePick', choice: 'B' })).toBe(false)
    expect(emptyInput('comparePick').kind).toBe('comparePick')
  })

  it('findError picks the faulty statement', () => {
    const faulty = 'Modelle sind immer exakt wie das Original.'
    const task = findErrorTask({
      question: 'Welche Aussage ist falsch?',
      statements: [
        'Beobachten erfasst Merkmale gezielt.',
        faulty,
        'Protokolle halten Beobachtungen fest.',
      ],
      faulty,
      solution: faulty,
      explanation: 'Modelle vereinfachen.',
    })
    expect(task.interactive?.type).toBe('findError')
    expect(task.check({ kind: 'findError', choice: faulty })).toBe(true)
    expect(
      task.check({
        kind: 'findError',
        choice: 'Beobachten erfasst Merkmale gezielt.',
      }),
    ).toBe(false)
  })

  it('imageHotspot accepts the correct region', () => {
    const task = imageHotspotTask({
      question: 'Tippe auf Beobachtung.',
      correctRegionId: 'b',
      regions: [
        { id: 'q', label: 'Frage', x: 0, y: 0, w: 20, h: 20 },
        { id: 'b', label: 'Beobachtung', x: 40, y: 0, w: 20, h: 20 },
      ],
      imageSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"/>',
      solution: 'Beobachtung',
      explanation: 'Mitte.',
    })
    expect(task.interactive?.type).toBe('imageHotspot')
    expect(task.check({ kind: 'imageHotspot', regionId: 'b' })).toBe(true)
    expect(task.check({ kind: 'imageHotspot', regionId: 'q' })).toBe(false)
  })
})
