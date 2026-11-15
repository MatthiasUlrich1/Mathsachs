import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import {
  math8GraphicReviews,
  math9GraphicReviews,
  math10GraphicReviews,
  math1112GraphicReviews,
} from './graphicReviewTopics'
import { isGraphicReviewTopic } from './graphicReview'
import type { Topic } from './types'

const ALL = [
  ...math8GraphicReviews,
  ...math9GraphicReviews,
  ...math10GraphicReviews,
  ...math1112GraphicReviews,
]

const EXPECTED_IDS = [
  'k8-lb3-steigung__grafik',
  'k8-lb3-achsenabschnitt__grafik',
  'k8-lb3-funktionswert__grafik',
  'k9-lb1-scheitel__grafik',
  'k9-lb1-quadrat-wert__grafik',
  'k10-lb4-parabel-wert__grafik',
  'k10-lb4-parabel-wert__grafik-ablesen',
  'k1112-lb1-ableitung-stelle__grafik',
  'k1112-lb1-bestimmtes-integral__grafik',
  'k1112-lb1-nullstelle-linear__grafik',
] as const

describe('graphic review topics', () => {
  it('lists exactly the marked Grafik-(Prüfung) topics, locked until freigabe', () => {
    expect(ALL.map((t) => t.id).sort()).toEqual([...EXPECTED_IDS].sort())
    for (const t of ALL) {
      expect(t.reviewOf).toBeTruthy()
      expect(t.id).toContain('__grafik')
      expect(t.released).toBe(false)
      expect(isGraphicReviewTopic(t)).toBe(true)
      expect(t.title).toMatch(/Grafik \(Prüfung\)/)
    }
  })

  it('generate plausible tasks (sampleAnswer + optional visual)', () => {
    for (const t of ALL) {
      for (let i = 0; i < 12; i++) {
        const rng = createRng(1000 + i * 17 + t.id.length * 3)
        const task = t.generate(rng)
        expect(task.question.length).toBeGreaterThan(10)
        expect(task.check(task.sampleAnswer)).toBe(true)
        if (task.visualContent) {
          expect(task.visualContent).toContain('<svg')
        }
        if (task.interactive) {
          expect([
            'coordinateClick',
            'coordinateDraw',
            'paramSlider',
            'choicePick',
          ]).toContain(task.interactive.type)
        }
      }
    }
  })
})

/** Parent IDs for docs / merge checklist. */
export function reviewParents(topics: Topic[]): string[] {
  return [...new Set(topics.map((t) => t.reviewOf!).filter(Boolean))]
}
