import { describe, expect, it } from 'vitest'
import {
  FRACTION_WALL_VIEWBOX_W,
  equivalentWallSolution,
  fractionWallLayout,
  fractionWallPrintSvg,
  fractionWallViewBoxH,
  linePosFromClientX,
  normalizeWallSelection,
  toggleWallTile,
  wallCompareMatches,
  wallEquivalentMatches,
  wallHandleBounds,
  wallLineX,
} from './fractionWallLogic'

const ROWS = [1, 2, 3, 4, 6, 8, 12]

describe('toggleWallTile', () => {
  it('selecting tile i selects the run 0..i; tapping the run end again shrinks it', () => {
    let s = toggleWallTile(ROWS, [], 8, 3, false)
    expect(s).toEqual([{ row: 8, count: 4 }])
    s = toggleWallTile(ROWS, s, 8, 5, false)
    expect(s).toEqual([{ row: 8, count: 6 }])
    s = toggleWallTile(ROWS, s, 8, 5, false)
    expect(s).toEqual([{ row: 8, count: 5 }])
    s = toggleWallTile(ROWS, s, 8, 0, false)
    expect(s).toEqual([{ row: 8, count: 1 }])
    s = toggleWallTile(ROWS, s, 8, 0, false)
    expect(s).toEqual([])
  })
  it('keeps other rows (multi) or replaces everything (single)', () => {
    const base = [{ row: 4, count: 2 }]
    expect(toggleWallTile(ROWS, base, 8, 3, false)).toEqual([
      { row: 4, count: 2 },
      { row: 8, count: 4 },
    ])
    expect(toggleWallTile(ROWS, base, 8, 3, true)).toEqual([{ row: 8, count: 4 }])
  })
  it('ignores unknown rows and out-of-range tiles', () => {
    expect(toggleWallTile(ROWS, [], 5, 0, false)).toEqual([])
    expect(toggleWallTile(ROWS, [], 4, 4, false)).toEqual([])
    expect(toggleWallTile(ROWS, [], 4, -1, false)).toEqual([])
  })
})

describe('normalizeWallSelection', () => {
  it('drops invalid entries, dedupes by row and sorts', () => {
    expect(
      normalizeWallSelection(ROWS, [
        { row: 8, count: 2 },
        { row: 5, count: 1 },
        { row: 4, count: 9 },
        { row: 4, count: 1 },
        { row: 4, count: 3 },
        { row: 2, count: 0 },
      ]),
    ).toEqual([
      { row: 4, count: 3 },
      { row: 8, count: 2 },
    ])
  })
})

describe('wallEquivalentMatches', () => {
  const target = { num: 1, den: 2 }
  it('solution lists every other row with a whole-tile run', () => {
    expect(equivalentWallSolution(ROWS, target)).toEqual([
      { row: 4, count: 2 },
      { row: 6, count: 3 },
      { row: 8, count: 4 },
      { row: 12, count: 6 },
    ])
  })
  it('accepts the complete solution in any order', () => {
    expect(wallEquivalentMatches(ROWS, equivalentWallSolution(ROWS, target).reverse(), target)).toBe(true)
  })
  it('rejects untouched, missing rows, wrong counts and extra rows', () => {
    const full = equivalentWallSolution(ROWS, target)
    expect(wallEquivalentMatches(ROWS, [], target)).toBe(false)
    expect(wallEquivalentMatches(ROWS, full.slice(1), target)).toBe(false)
    expect(wallEquivalentMatches(ROWS, [{ row: 4, count: 3 }, ...full.slice(1)], target)).toBe(false)
    expect(wallEquivalentMatches(ROWS, [...full, { row: 3, count: 1 }], target)).toBe(false)
    // The reference row is given, never part of the answer.
    expect(wallEquivalentMatches(ROWS, [...full, { row: 2, count: 1 }], target)).toBe(false)
    expect(wallEquivalentMatches(ROWS, [...full, { row: 99, count: 1 }], target)).toBe(false)
    expect(wallEquivalentMatches(ROWS, [...full, full[0]!], target)).toBe(false)
  })
})

describe('wallCompareMatches', () => {
  const a = { num: 2, den: 3 }
  const b = { num: 3, den: 4 }
  it('accepts exactly the larger fraction, also as an equal-length run in another row', () => {
    expect(wallCompareMatches(ROWS, [{ row: 4, count: 3 }], a, b)).toBe(true)
    expect(wallCompareMatches(ROWS, [{ row: 8, count: 6 }], a, b)).toBe(true)
  })
  it('rejects the smaller one, nothing, several runs and other lengths', () => {
    expect(wallCompareMatches(ROWS, [{ row: 3, count: 2 }], a, b)).toBe(false)
    expect(wallCompareMatches(ROWS, [], a, b)).toBe(false)
    expect(wallCompareMatches(ROWS, [{ row: 4, count: 3 }, { row: 3, count: 2 }], a, b)).toBe(false)
    expect(wallCompareMatches(ROWS, [{ row: 4, count: 2 }], a, b)).toBe(false)
  })
})

describe('geometry', () => {
  it('layout has d tiles of width 1/d per row, all inside the viewBox', () => {
    const layout = fractionWallLayout(ROWS)
    const h = fractionWallViewBoxH(ROWS.length)
    for (const r of layout) {
      expect(r.tiles).toHaveLength(r.row)
      const last = r.tiles[r.tiles.length - 1]!
      expect(r.tiles[0]!.x).toBe(36)
      expect(last.x + last.w).toBeCloseTo(336, 1)
      expect(last.x + last.w).toBeLessThanOrEqual(FRACTION_WALL_VIEWBOX_W)
      expect(r.y + r.h).toBeLessThanOrEqual(h)
      expect(r.labelX).toBeGreaterThan(0)
    }
  })
  it('the handle stays inside the viewBox at both ends', () => {
    for (const pos of [0, 0.5, 1, -3, 7]) {
      const b = wallHandleBounds(pos)
      expect(b.x).toBeGreaterThanOrEqual(0)
      expect(b.x + b.w).toBeLessThanOrEqual(FRACTION_WALL_VIEWBOX_W)
      expect(b.y).toBeGreaterThanOrEqual(0)
    }
  })
  it('linePosFromClientX works in SVG units, keeps the grab offset and clamps', () => {
    // Screen as wide as the viewBox => 1 px per SVG unit; wall spans svg x 36..336.
    expect(linePosFromClientX(186, 0, 362)).toBeCloseTo(0.5, 5)
    expect(linePosFromClientX(10, 0, 362)).toBe(0)
    expect(linePosFromClientX(9999, 0, 362)).toBe(1)
    // Grab 5 svg units right of the line centre: the line does not jump.
    expect(linePosFromClientX(wallLineX(0.5) + 5, 0, 362, 5)).toBeCloseTo(0.5, 2)
    expect(linePosFromClientX(100, 0, 0)).toBe(0)
  })
})

describe('fractionWallPrintSvg', () => {
  it('draws every tile empty; the reference run is shaded grey', () => {
    const svg = fractionWallPrintSvg([1, 2, 4], { num: 1, den: 2 })
    expect(svg.match(/<rect/g)).toHaveLength(1 + 2 + 4)
    expect(svg.match(/#94a3b8/g)).toHaveLength(1)
    expect(fractionWallPrintSvg([1, 2, 4]).match(/#94a3b8/g)).toBeNull()
  })
})

describe('handle hit area and print labels', () => {
  it('hit area is at least 22 SVG units in radius (and inside the viewBox)', () => {
    const b = wallHandleBounds(0.5)
    expect(b.w).toBeGreaterThanOrEqual(44)
    expect(b.h).toBeGreaterThanOrEqual(44)
  })
  it('prints row 1 as "Ganzes"', () => {
    const svg = fractionWallPrintSvg([1, 2])
    expect(svg).toContain('>Ganzes<')
    expect(svg).toContain('>1/2<')
  })
})
