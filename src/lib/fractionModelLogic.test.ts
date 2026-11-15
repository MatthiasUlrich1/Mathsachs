import { describe, expect, it } from 'vitest'
import {
  FRACTION_BAR_VIEWBOX,
  FRACTION_CIRCLE_VIEWBOX,
  clampDen,
  fractionModelBounds,
  fractionModelMatches,
  fractionModelReachable,
  fractionModelStartDen,
  fractionPartShapes,
  normalizeShaded,
  resizeFractionModel,
  shadedCount,
  toggleShaded,
} from './fractionModelLogic'

describe('fractionModelLogic', () => {
  it('start den never equals the target den and stays in 2..12', () => {
    for (let d = 1; d <= 12; d++) {
      const s = fractionModelStartDen(d)
      expect(s).not.toBe(d)
      expect(s).toBeGreaterThanOrEqual(2)
      expect(s).toBeLessThanOrEqual(12)
    }
  })

  it('clampDen limits the stepper to 2..12', () => {
    expect(clampDen(1)).toBe(2)
    expect(clampDen(13)).toBe(12)
    expect(clampDen(7)).toBe(7)
  })

  it('toggleShaded adds, removes and keeps indices sorted and in range', () => {
    expect(toggleShaded(4, [], 2)).toEqual([2])
    expect(toggleShaded(4, [2], 0)).toEqual([0, 2])
    expect(toggleShaded(4, [0, 2], 2)).toEqual([0])
    expect(normalizeShaded(4, [3, 3, 9, -1, 1.5, 0])).toEqual([0, 3])
  })

  it('resizeFractionModel drops shading outside the new range', () => {
    expect(resizeFractionModel([0, 4, 5], 4)).toEqual({ den: 4, shaded: [0] })
    expect(resizeFractionModel([0], 20)).toEqual({ den: 12, shaded: [0] })
    expect(shadedCount(4, [0, 0, 1, 7])).toBe(2)
  })

  it('fractionModelMatches: equivalent fractions and exact den', () => {
    const half = { num: 1, den: 2 }
    expect(fractionModelMatches(2, [0], half, true)).toBe(true)
    expect(fractionModelMatches(4, [0, 1], half, true)).toBe(true)
    expect(fractionModelMatches(4, [0, 3], half, true)).toBe(true)
    expect(fractionModelMatches(4, [0], half, true)).toBe(false)
    expect(fractionModelMatches(4, [0, 1], half, false)).toBe(false)
    expect(fractionModelMatches(2, [1], half, false)).toBe(true)
    expect(fractionModelMatches(4, [], half, true)).toBe(false)
    expect(fractionModelMatches(13, [0], half, true)).toBe(false)
  })

  it('fractionModelMatches counts duplicate or out-of-range indices only once', () => {
    expect(fractionModelMatches(4, [0, 0], { num: 1, den: 2 }, true)).toBe(false)
    expect(fractionModelMatches(4, [0, 1, 9], { num: 1, den: 2 }, true)).toBe(true)
  })

  it('fractionModelReachable', () => {
    expect(fractionModelReachable({ num: 1, den: 2 })).toBe(true)
    expect(fractionModelReachable({ num: 3, den: 15 })).toBe(true) // 1/5 -> 2/10
    expect(fractionModelReachable({ num: 1, den: 13 })).toBe(false)
  })

  it('part shapes stay inside the viewBox for every number of parts', () => {
    for (const shape of ['bar', 'circle'] as const) {
      const vb = shape === 'bar' ? FRACTION_BAR_VIEWBOX : FRACTION_CIRCLE_VIEWBOX
      const b = fractionModelBounds(shape)
      expect(b.x).toBeGreaterThanOrEqual(0)
      expect(b.y).toBeGreaterThanOrEqual(0)
      expect(b.x + b.w).toBeLessThanOrEqual(vb.w)
      expect(b.y + b.h).toBeLessThanOrEqual(vb.h)
      for (let den = 2; den <= 12; den++) {
        const parts = fractionPartShapes(shape, den)
        expect(parts).toHaveLength(den)
        const nums = parts.flatMap((p) => p.d.match(/-?\d+(\.\d+)?/g)!.map(Number))
        for (const n of nums) expect(Number.isFinite(n)).toBe(true)
      }
    }
  })
})
