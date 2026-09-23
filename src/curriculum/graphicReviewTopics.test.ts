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

describe('graphic review topics', () => {
  const releasedIds = new Set([
    'k8-lb3-steigung__grafik',
    'k8-lb3-achsenabschnitt__grafik',
    'k8-lb3-funktionswert__grafik',
  ])

  it('are locked under a parent id (except freigegebene K8-Grafiken)', () => {
    expect(ALL.length).toBeGreaterThanOrEqual(8)
    for (const t of ALL) {
      expect(t.reviewOf).toBeTruthy()
      expect(t.id).toContain('__grafik')
      if (releasedIds.has(t.id)) {
        expect(t.released).toBe(true)
        expect(isGraphicReviewTopic(t)).toBe(false)
        expect(t.title).not.toMatch(/Grafik \(Prüfung\)/)
      } else {
        expect(isGraphicReviewTopic(t)).toBe(true)
        expect(t.released).toBe(false)
        expect(t.title).toMatch(/Grafik \(Prüfung\)/)
      }
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
          expect(['coordinateClick', 'coordinateDraw', 'paramSlider']).toContain(
            task.interactive.type,
          )
        }
      }
    }
  })
})

/** Parent IDs for docs / merge checklist. */
export function reviewParents(topics: Topic[]): string[] {
  return [...new Set(topics.map((t) => t.reviewOf!).filter(Boolean))]
}
