import { describe, expect, it } from 'vitest'
import {
  NLM_CHIP_FONT,
  NLM_CHIP_H,
  NLM_CHIP_W,
  NLM_LINE_X0,
  NLM_LINE_X1,
  NLM_ROW_Y,
  NLM_TRAY_Y,
  NLM_TRAY_ZONE_Y,
  NLM_VIEWBOX_H,
  NLM_VIEWBOX_W,
  nlmChipTextFits,
  nlmClampChip,
  nlmDefaultLabelEvery,
  nlmFormatTick,
  nlmLabelledTicks,
  nlmMatches,
  nlmNudge,
  nlmShuffle,
  nlmSlotX,
  nlmSnap,
  nlmTextExtents,
  nlmTextWidth,
  nlmTickValues,
  nlmTrayOrder,
  nlmValueFromX,
  nlmXFromValue,
  numberLineMultiPrintSvg,
} from './numberLineMultiLogic'

describe('number line mapping', () => {
  it('maps values to x and back, clamped to the line', () => {
    expect(nlmXFromValue(0, 0, 2)).toBe(NLM_LINE_X0)
    expect(nlmXFromValue(2, 0, 2)).toBe(NLM_LINE_X1)
    expect(nlmXFromValue(1, 0, 2)).toBe((NLM_LINE_X0 + NLM_LINE_X1) / 2)
    expect(nlmValueFromX(NLM_LINE_X0 - 100, 0, 2)).toBe(0)
    expect(nlmValueFromX(NLM_LINE_X1 + 100, 0, 2)).toBe(2)
    expect(nlmValueFromX(nlmXFromValue(1.25, 0, 2), 0, 2)).toBeCloseTo(1.25, 9)
  })

  it('snaps to the grid from min and clamps without float drift', () => {
    expect(nlmSnap(0.31, 0, 2, 0.05)).toBe(0.3)
    expect(nlmSnap(0.33, 0, 2, 0.05)).toBe(0.35)
    expect(nlmSnap(-1.3, -3, 3, 0.25)).toBe(-1.25)
    expect(nlmSnap(9, 0, 2, 0.05)).toBe(2)
    expect(nlmSnap(-9, -3, 3, 0.25)).toBe(-3)
    expect(nlmSnap(0.1 + 0.2, 0, 2, 0.1)).toBe(0.3)
  })

  it('nudges by whole snap steps and stays on the line', () => {
    expect(nlmNudge(1, 1, 0, 2, 0.125)).toBe(1.125)
    expect(nlmNudge(0, -1, 0, 2, 0.125)).toBe(0)
    expect(nlmNudge(2, 1, 0, 2, 0.125)).toBe(2)
  })
})

describe('ticks and labels', () => {
  it('builds ticks by index (no drift) and labels min, max and every labelEvery tick', () => {
    const t = nlmTickValues(0, 2, 0.1)
    expect(t).toHaveLength(21)
    expect(t[3]).toBe(0.3)
    expect(nlmLabelledTicks(0, 2, 0.1, 5)).toEqual([0, 0.5, 1, 1.5, 2])
    // max is always written, even when it is not a multiple of labelEvery
    expect(nlmLabelledTicks(0, 1, 0.125, 3)).toEqual([0, 0.375, 0.75, 1])
  })

  it('default labelEvery: every tick up to 10 ticks, otherwise every 2nd', () => {
    expect(nlmDefaultLabelEvery(0, 9, 1)).toBe(1)
    expect(nlmDefaultLabelEvery(0, 10, 1)).toBe(2)
  })

  it('formats German numbers with only the needed decimals', () => {
    expect(nlmFormatTick(0)).toBe('0')
    expect(nlmFormatTick(1.5)).toBe('1,5')
    expect(nlmFormatTick(-2)).toBe('-2')
    expect(nlmFormatTick(0.125)).toBe('0,125')
    expect(nlmFormatTick(0.30000000000000004)).toBe('0,3')
  })
})

describe('check', () => {
  const items = [
    { id: 'a', label: '1/4', value: 0.25 },
    { id: 'b', label: '1,5', value: 1.5 },
  ]
  it('needs every item placed within the tolerance', () => {
    expect(nlmMatches(items, { a: 0.25, b: 1.5 }, 0.0625)).toBe(true)
    expect(nlmMatches(items, { a: 0.3125, b: 1.5 }, 0.0625)).toBe(true)
    expect(nlmMatches(items, { a: 0.375, b: 1.5 }, 0.0625)).toBe(false)
    expect(nlmMatches(items, { a: 0.25 }, 0.0625)).toBe(false)
    expect(nlmMatches(items, {}, 0.0625)).toBe(false)
    expect(nlmMatches(items, undefined, 0.0625)).toBe(false)
    expect(nlmMatches(items, { a: Number.NaN, b: 1.5 }, 0.0625)).toBe(false)
  })
})

describe('tray order', () => {
  const items = [
    { id: 'a', label: '1', value: 0.1 },
    { id: 'b', label: '2', value: 0.5 },
    { id: 'c', label: '3', value: 0.9 },
    { id: 'd', label: '4', value: 1.4 },
  ]
  it('is deterministic per seed and a permutation of the ids', () => {
    expect(nlmShuffle([1, 2, 3, 4, 5], 7)).toEqual(nlmShuffle([1, 2, 3, 4, 5], 7))
    expect([...nlmTrayOrder(items, 5)].sort()).toEqual(['a', 'b', 'c', 'd'])
    expect(nlmTrayOrder(items, 5)).toEqual(nlmTrayOrder(items, 5))
  })

  it('is never sorted by value (neither ascending nor descending) for any seed', () => {
    for (let seed = 0; seed < 400; seed++) {
      const o = nlmTrayOrder(items, seed).join('')
      expect(o, `seed ${seed}`).not.toBe('abcd')
      expect(o, `seed ${seed}`).not.toBe('dcba')
    }
    for (let seed = 0; seed < 100; seed++) expect(nlmTrayOrder(items.slice(0, 2), seed).join('')).not.toBe('ab')
  })
})

describe('layout stays inside the viewBox', () => {
  it('tray slots of 2..5 labels fit and do not overlap', () => {
    for (let n = 2; n <= 5; n++) {
      for (let i = 0; i < n; i++) {
        const x = nlmSlotX(i, n)
        expect(x - NLM_CHIP_W / 2).toBeGreaterThanOrEqual(0)
        expect(x + NLM_CHIP_W / 2).toBeLessThanOrEqual(NLM_VIEWBOX_W)
        if (i > 0) expect(x - nlmSlotX(i - 1, n)).toBeGreaterThanOrEqual(NLM_CHIP_W)
      }
    }
  })

  it('chips at both ends of the line, in both rows and anywhere dragged stay inside', () => {
    const boxes: Array<[number, number]> = []
    for (const v of [0, 2]) for (const y of NLM_ROW_Y) boxes.push([nlmXFromValue(v, 0, 2), y])
    for (const [cx, cy] of [[-999, -999], [9999, 9999], [0, 9999], [9999, 0]]) {
      const c = nlmClampChip(cx!, cy!)
      boxes.push([c.cx, c.cy])
    }
    for (const [x, y] of boxes) {
      const c = nlmClampChip(x, y)
      expect(c.cx - NLM_CHIP_W / 2).toBeGreaterThanOrEqual(0)
      expect(c.cx + NLM_CHIP_W / 2).toBeLessThanOrEqual(NLM_VIEWBOX_W)
      expect(c.cy - NLM_CHIP_H / 2).toBeGreaterThanOrEqual(0)
      expect(c.cy + NLM_CHIP_H / 2).toBeLessThan(NLM_VIEWBOX_H)
    }
    // the tray zone is reachable and the rows lie below it
    expect(NLM_TRAY_Y).toBeLessThan(NLM_TRAY_ZONE_Y)
    for (const y of NLM_ROW_Y) expect(y).toBeGreaterThan(NLM_TRAY_ZONE_Y)
  })

  it('every text (tick numbers and chips) fits inside the viewBox', () => {
    const cases: Array<[number, number, number, number, string[]]> = [
      [0, 2, 0.1, 5, ['0,3', '0,7', '1,2', '1,6']],
      [-3, 3, 0.5, 2, ['-2,5', '-0,5', '1,5', '2,5']],
      [0, 1, 0.125, 8, ['1/8', '3/8', '5/8', '3/4']],
      [-1000, 1000, 100, 2, ['-123,5', '1000', '999,25', '77', '-8']],
    ]
    for (const [min, max, step, every, labels] of cases) {
      for (const e of nlmTextExtents(min, max, step, every, labels)) {
        const w = nlmTextWidth(e.text, e.fontSize)
        expect(e.x - w / 2, e.text).toBeGreaterThanOrEqual(0)
        expect(e.x + w / 2, e.text).toBeLessThanOrEqual(NLM_VIEWBOX_W)
        expect(e.y + e.fontSize / 2, e.text).toBeLessThanOrEqual(NLM_VIEWBOX_H)
      }
    }
  })

  it('chip text fit check works both ways', () => {
    expect(nlmChipTextFits('-2,5')).toBe(true)
    expect(nlmChipTextFits('-123,456')).toBe(false)
    expect(nlmTextWidth('1234567', NLM_CHIP_FONT)).toBeLessThanOrEqual(NLM_CHIP_W - 12)
  })
})

describe('print svg', () => {
  it('draws the line, all ticks and only the written numbers', () => {
    const svg = numberLineMultiPrintSvg(0, 2, 0.25, 4)
    expect(svg).toContain('<svg')
    expect(svg.match(/<line /g)).toHaveLength(1 + 9)
    expect(svg.match(/<text /g)).toHaveLength(3)
    expect(svg).toContain('>0<')
    expect(svg).toContain('>2<')
    expect(svg).not.toContain('0,75')
  })
})
