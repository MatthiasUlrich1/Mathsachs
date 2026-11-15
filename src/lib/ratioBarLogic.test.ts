import { describe, expect, it } from 'vitest'
import {
  RATIO_MAX_SEGMENTS,
  RATIO_MIN_SEGMENTS,
  RATIO_VIEWBOX_W,
  cycleRatioField,
  normalizeParts,
  ratioBarLayout,
  ratioBarPrintSvg,
  ratioBarTextExtents,
  ratioColourMatches,
  ratioColourSolution,
  ratioSplitAmounts,
  ratioSplitExact,
  ratioSplitMatches,
  ratioSplitParts,
  ratioTextWidth,
  reduceRatio,
  type RatioPart,
} from './ratioBarLogic'

/** 'AB.' -> ['A', 'B', null] */
const parts = (s: string): RatioPart[] => [...s].map((c) => (c === '.' ? null : (c as 'A' | 'B')))

describe('ratioBarLogic colouring', () => {
  it('cycles empty -> A -> B -> empty and ignores bad indices', () => {
    let p: RatioPart[] = new Array<RatioPart>(4).fill(null)
    p = cycleRatioField(4, p, 1)
    expect(p).toEqual([null, 'A', null, null])
    p = cycleRatioField(4, p, 1)
    expect(p[1]).toBe('B')
    p = cycleRatioField(4, p, 1)
    expect(p[1]).toBeNull()
    expect(cycleRatioField(4, p, -1)).toEqual(p)
    expect(cycleRatioField(4, p, 4)).toEqual(p)
    expect(cycleRatioField(4, p, 1.5)).toEqual(p)
  })

  it('normalizeParts pads, cuts and drops invalid entries', () => {
    expect(normalizeParts(3, ['A'])).toEqual(['A', null, null])
    expect(normalizeParts(2, ['A', 'B', 'A'])).toEqual(['A', 'B'])
    expect(normalizeParts(2, ['x' as never, 'B'])).toEqual([null, 'B'])
  })

  it('reduceRatio', () => {
    expect(reduceRatio(4, 6)).toEqual([2, 3])
    expect(reduceRatio(3, 1)).toEqual([3, 1])
  })

  it('2 : 3 on 10 fields: 4 A and 6 B in any order is right; every other count is wrong', () => {
    expect(ratioColourMatches(10, [2, 3], parts('AAAABBBBBB'))).toBe(true)
    expect(ratioColourMatches(10, [2, 3], parts('BABABBABBA'))).toBe(true)
    expect(ratioColourMatches(10, [2, 3], parts('AAABBBBBBB'))).toBe(false) // 3 : 7
    expect(ratioColourMatches(10, [2, 3], parts('AAAAABBBBB'))).toBe(false) // 5 : 5
    expect(ratioColourMatches(10, [2, 3], parts('AABBBBBBBB'))).toBe(false) // 2 : 8
    expect(ratioColourMatches(10, [2, 3], parts('BBBBAAAAAA'))).toBe(false) // swapped: 6 : 4
  })

  it('a reduced ratio counts: 1 : 2 on 9 fields needs 3 A and 6 B', () => {
    expect(ratioColourMatches(9, [1, 2], parts('ABBABBABB'))).toBe(true)
    expect(ratioColourMatches(9, [1, 2], parts('AABBBBBBB'))).toBe(false)
  })

  it('fails when a field is empty, nothing is coloured, one colour only, or the length is wrong', () => {
    expect(ratioColourMatches(6, [1, 2], parts('......'))).toBe(false)
    expect(ratioColourMatches(6, [1, 2], parts('ABBAB.'))).toBe(false)
    expect(ratioColourMatches(6, [1, 2], parts('AAAAAA'))).toBe(false)
    expect(ratioColourMatches(6, [1, 2], [])).toBe(false)
    expect(ratioColourMatches(6, [1, 2], parts('ABB'))).toBe(false)
  })

  it('the solution passes for every legal (ratio, segments) combination', () => {
    let combos = 0
    for (let a = 1; a <= 11; a++) {
      for (let b = 1; a + b <= RATIO_MAX_SEGMENTS; b++) {
        for (let n = RATIO_MIN_SEGMENTS; n <= RATIO_MAX_SEGMENTS; n++) {
          if (n % (a + b) !== 0) continue
          combos++
          expect(ratioColourMatches(n, [a, b], ratioColourSolution(n, [a, b])), `${a}:${b} in ${n}`).toBe(true)
        }
      }
    }
    expect(combos).toBeGreaterThan(20)
  })
})

describe('ratioBarLogic split', () => {
  it('splits the total and detects exact two-decimal shares', () => {
    expect(ratioSplitAmounts(600, [1, 3])).toEqual([150, 450])
    expect(ratioSplitParts([2, 3])).toEqual(['A', 'A', 'B', 'B', 'B'])
    expect(ratioSplitExact(600, [1, 3])).toBe(true)
    expect(ratioSplitExact(50, [1, 3])).toBe(true) // 12,5 / 37,5
    expect(ratioSplitExact(100, [1, 2])).toBe(false) // 33,333...
    expect(ratioSplitExact(10.005, [1, 1])).toBe(false)
  })

  it('accepts comma and point decimals; rejects wrong, swapped, empty and non-numeric amounts', () => {
    expect(ratioSplitMatches(50, [1, 3], ['12,5', '37,5'])).toBe(true)
    expect(ratioSplitMatches(50, [1, 3], ['12.5', ' 37,50 '])).toBe(true)
    expect(ratioSplitMatches(50, [1, 3], ['37,5', '12,5'])).toBe(false)
    expect(ratioSplitMatches(50, [1, 3], ['12,5', '37'])).toBe(false)
    expect(ratioSplitMatches(50, [1, 3], ['12,5', ''])).toBe(false)
    expect(ratioSplitMatches(50, [1, 3], ['', ''])).toBe(false)
    expect(ratioSplitMatches(50, [1, 3], ['a', 'b'])).toBe(false)
    expect(ratioSplitMatches(50, [1, 3], undefined)).toBe(false)
  })
})

describe('ratioBarLogic layout', () => {
  const modes = ['colour', 'split'] as const
  it('every cell and legend swatch lies inside the viewBox; cells tile the bar in order', () => {
    for (const mode of modes) {
      for (let n = 2; n <= RATIO_MAX_SEGMENTS; n++) {
        const l = ratioBarLayout(mode, n)
        expect(l.cells).toHaveLength(n)
        l.cells.forEach((c, i) => {
          expect(c.x).toBeGreaterThanOrEqual(0)
          expect(c.x + c.w).toBeLessThanOrEqual(RATIO_VIEWBOX_W + 0.02)
          expect(c.y + c.h).toBeLessThanOrEqual(l.viewBoxH)
          if (i > 0) expect(c.x).toBeGreaterThanOrEqual(l.cells[i - 1]!.x + l.cells[i - 1]!.w - 0.02)
        })
        for (const it of l.legend) {
          expect(it.swatchX).toBeGreaterThanOrEqual(0)
          expect(it.swatchY + 18).toBeLessThanOrEqual(l.viewBoxH)
        }
        expect(l.legend[0]!.swatchY).toBeGreaterThanOrEqual(l.bar.y + l.bar.h)
      }
    }
  })

  it('every text fits the viewBox and its own column / cell, also for 12-char labels and long totals', () => {
    for (const mode of modes) {
      for (const n of [2, 5, 12]) {
        const l = ratioBarLayout(mode, n)
        const texts = ratioBarTextExtents(mode, n, ['Zitronensaft', 'Kakaopulver'], { value: 12345.5, unit: 'ml' })
        expect(texts.length).toBeGreaterThan(n)
        for (const t of texts) {
          const w = ratioTextWidth(t)
          expect(w, t.text).toBeLessThanOrEqual(t.maxWidth)
          const left = t.anchor === 'middle' ? t.x - w / 2 : t.x
          expect(left, t.text).toBeGreaterThanOrEqual(0)
          expect(left + w, t.text).toBeLessThanOrEqual(RATIO_VIEWBOX_W)
          expect(t.y, t.text).toBeLessThanOrEqual(l.viewBoxH)
          expect(t.y - t.fontSize, t.text).toBeGreaterThanOrEqual(0)
        }
      }
    }
  })

  it('the fit test can fail: an over-long label is detected', () => {
    const texts = ratioBarTextExtents('colour', 6, ['Zitronensaftsirup', 'Wasser'])
    const legendA = texts.find((t) => t.text.startsWith('A ='))!
    expect(ratioTextWidth(legendA)).toBeGreaterThan(legendA.maxWidth)
  })
})

describe('ratioBarPrintSvg', () => {
  it('colour: empty bar, empty swatches, legend, no solution colours', () => {
    const svg = ratioBarPrintSvg('colour', 10, ['Saft', 'Wasser'])
    expect(svg).toMatch(/^<svg /)
    expect(svg.match(/<rect /g)).toHaveLength(12)
    expect(svg).toContain('A = Saft')
    expect(svg).toContain('B = Wasser')
    expect(svg).not.toContain('#fbbf24')
    expect(svg).not.toContain('#38bdf8')
  })
  it('split: divided bar coloured A then B with the total', () => {
    const svg = ratioBarPrintSvg('split', 5, ['Saft', 'Wasser'], [2, 3], { value: 500, unit: 'ml' })
    expect(svg).toContain('Gesamt: 500 ml')
    expect(svg.match(/fill="#fbbf24"/g)).toHaveLength(3) // 2 fields + swatch
    expect(svg.match(/fill="#38bdf8"/g)).toHaveLength(4) // 3 fields + swatch
  })
  it('escapes label text', () => {
    expect(ratioBarPrintSvg('colour', 4, ['a<b', 'c&d'])).toContain('A = a&lt;b')
  })
})
