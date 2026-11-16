import { describe, expect, it } from 'vitest'
import {
  PC_TAG_CLEARANCE,
  pcTagCircleClearance,
  pcTagKnobClearance,
  pcTagPlacements,
  PC_CX,
  PC_CY,
  PC_HIT_R,
  PC_R,
  pcBoundaries,
  pcBoundaryRange,
  pcDragTarget,
  pcExtentFits,
  pcLegendNameFits,
  pcMatches,
  pcMoveBoundary,
  pcNearestHandle,
  pcNudge,
  pcPercentText,
  pcPoint,
  pcPointerPercent,
  pcSectorLabelFits,
  pcSectorPath,
  pcSnap,
  pcSourceFits,
  pcStartPercents,
  pcTextExtents,
  pcTouched,
  pcValidate,
  pcValidateAxis,
  pcWrapDelta,
  pieChartPrintSvg,
  pieChartTableSvg,
} from './pieChartLogic'

describe('geometry', () => {
  it('percent positions run clockwise from 12 o\'clock (3.6 degrees per percent)', () => {
    const top = pcPoint(0, PC_R)
    expect(top.x).toBeCloseTo(PC_CX, 6)
    expect(top.y).toBeCloseTo(PC_CY - PC_R, 6)
    const right = pcPoint(25, PC_R)
    expect(right.x).toBeCloseTo(PC_CX + PC_R, 6)
    expect(right.y).toBeCloseTo(PC_CY, 6)
    const bottom = pcPoint(50, PC_R)
    expect(bottom.y).toBeCloseTo(PC_CY + PC_R, 6)
    const left = pcPoint(75, PC_R)
    expect(left.x).toBeCloseTo(PC_CX - PC_R, 6)
  })

  it('the pointer percent is the inverse of the point (round trip over the whole circle)', () => {
    for (let p = 0; p < 100; p += 2.5) {
      const pt = pcPoint(p, 77)
      expect(pcPointerPercent(pt.x, pt.y)).toBeCloseTo(p, 5)
    }
  })

  it('sector paths use the large-arc flag only above half the circle', () => {
    expect(pcSectorPath(0, 40)).toMatch(/ 0 0 1 /)
    expect(pcSectorPath(0, 50)).toMatch(/ 0 0 1 /)
    expect(pcSectorPath(10, 70)).toMatch(/ 0 1 1 /)
  })
})

describe('start state', () => {
  it('equal shares on the snap grid, the remainder goes to the last sector', () => {
    expect(pcStartPercents(2, 5)).toEqual([50, 50])
    expect(pcStartPercents(3, 5)).toEqual([30, 30, 40])
    expect(pcStartPercents(4, 5)).toEqual([25, 25, 25, 25])
    expect(pcStartPercents(5, 5)).toEqual([20, 20, 20, 20, 20])
    expect(pcStartPercents(3, 10)).toEqual([30, 30, 40])
    expect(pcStartPercents(4, 1)).toEqual([25, 25, 25, 25])
    expect(pcStartPercents(3, 1)).toEqual([33, 33, 34])
  })

  it('always sums to 100 and every sector is a multiple of snap and at least one step', () => {
    for (const snap of [1, 2, 4, 5, 10]) {
      for (let k = 2; k <= 5; k++) {
        const s = pcStartPercents(k, snap)
        expect(s.reduce((a, b) => a + b, 0)).toBe(100)
        for (const p of s) {
          expect(p).toBeGreaterThanOrEqual(snap)
          expect(Math.abs(p / snap - Math.round(p / snap))).toBeLessThan(1e-9)
        }
      }
    }
  })
})

describe('boundaries and snapping', () => {
  it('cumulative boundaries', () => {
    expect(pcBoundaries([40, 25, 35])).toEqual([0, 40, 65, 100])
  })

  it('snap rounds to the grid', () => {
    expect(pcSnap(12.4, 5)).toBe(10)
    expect(pcSnap(12.6, 5)).toBe(15)
    expect(pcSnap(7.5, 5)).toBe(10)
    expect(pcSnap(3.4, 1)).toBe(3)
  })

  it('moving a boundary snaps and keeps one step to each neighbour', () => {
    const start = [25, 25, 25, 25]
    expect(pcMoveBoundary(start, 1, 41, 5)).toEqual([40, 10, 25, 25])
    expect(pcMoveBoundary(start, 1, 60, 5)).toEqual([45, 5, 25, 25]) // cannot pass the next boundary
    expect(pcMoveBoundary(start, 2, 0, 5)).toEqual([25, 5, 45, 25]) // cannot pass the previous one
    expect(pcMoveBoundary(start, 3, 100, 5)).toEqual([25, 25, 45, 5])
    expect(pcMoveBoundary(start, 1, -30, 5)).toEqual([5, 45, 25, 25]) // cannot reach the fixed 0 boundary
  })

  it('the result always sums to 100 with every sector at least one step', () => {
    let p = [20, 20, 20, 20, 20]
    for (let i = 0; i < 200; i++) {
      p = pcMoveBoundary(p, 1 + (i % 4), (i * 37) % 130 - 15, 5)
      expect(p.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 9)
      for (const v of p) expect(v).toBeGreaterThanOrEqual(5)
    }
  })

  it('boundary range and nudging by whole steps', () => {
    expect(pcBoundaryRange([25, 25, 25, 25], 2, 5)).toEqual({ lo: 30, hi: 70 })
    expect(pcNudge([25, 25, 25, 25], 1, 1, 5)).toEqual([30, 20, 25, 25])
    expect(pcNudge([25, 25, 25, 25], 1, -1, 5)).toEqual([20, 30, 25, 25])
    expect(pcNudge([5, 45, 25, 25], 1, -1, 5)).toEqual([5, 45, 25, 25]) // already at the limit
  })
})

describe('dragging around 12 o\'clock', () => {
  it('wraps differences to the shortest way', () => {
    expect(pcWrapDelta(93)).toBe(-7)
    expect(pcWrapDelta(-93)).toBe(7)
    expect(pcWrapDelta(10)).toBe(10)
    expect(pcWrapDelta(50)).toBe(50)
    expect(pcWrapDelta(-50)).toBe(50)
  })

  it('a pointer that crosses 12 o\'clock does not make the knob jump to the other end', () => {
    // knob at 5 %, pointer moves to 98 % (= -2 %): the target is -2, not 98
    expect(pcDragTarget(5, 98, 0)).toBeCloseTo(-2, 9)
    expect(pcMoveBoundary([5, 45, 25, 25], 1, pcDragTarget(5, 98, 0), 5)).toEqual([5, 45, 25, 25])
    // knob at 95 %, pointer moves to 2 % (= 102 %): clamped at the end, no jump to 2
    expect(pcMoveBoundary([25, 25, 25, 20, 5], 4, pcDragTarget(95, 2, 0), 5)).toEqual([25, 25, 25, 20, 5])
  })

  it('keeps the grab offset', () => {
    expect(pcDragTarget(40, 43, -3)).toBe(40)
    expect(pcDragTarget(40, 50, -3)).toBe(47)
  })
})

describe('hit testing', () => {
  it('picks the nearest knob inside the hit radius and nothing outside', () => {
    const p = [25, 25, 25, 25]
    const k2 = pcPoint(50, PC_R)
    expect(pcNearestHandle(p, k2.x + 5, k2.y - 4)).toBe(2)
    expect(pcNearestHandle(p, k2.x + PC_HIT_R + 5, k2.y)).toBeNull()
    expect(pcNearestHandle(p, PC_CX, PC_CY)).toBeNull()
  })

  it('the hit radius is at least 22 units', () => {
    expect(PC_HIT_R).toBeGreaterThanOrEqual(22)
  })
})

describe('check logic', () => {
  const target = [40, 30, 20, 10]
  const start = pcStartPercents(4, 5)
  it('within tolerance and sum 100', () => {
    expect(pcMatches(target, [40, 30, 20, 10], start, 2.5)).toBe(true)
    expect(pcMatches(target, [40, 30, 25, 5], start, 2.5)).toBe(false)
    expect(pcMatches(target, [42, 30, 20, 8], start, 2.5)).toBe(true) // 2 off each
    expect(pcMatches(target, [45, 30, 20, 10], start, 2.5)).toBe(false) // sum 105
    expect(pcMatches(target, [40, 30, 20], start, 2.5)).toBe(false)
  })

  it('null (untouched) is the start state', () => {
    expect(pcMatches(target, null, start, 2.5)).toBe(false)
    expect(pcMatches(start, null, start, 2.5)).toBe(true)
  })

  it('touched means a finite array', () => {
    expect(pcTouched(null)).toBe(false)
    expect(pcTouched(undefined)).toBe(false)
    expect(pcTouched([])).toBe(false)
    expect(pcTouched([25, 25, 25, 25])).toBe(true)
    expect(pcTouched([25, Number.NaN])).toBe(false)
  })
})

describe('validation', () => {
  const cats = ['A', 'B', 'C', 'D']
  it('accepts valid input', () => {
    expect(() => pcValidate(cats, [40, 30, 20, 10], 5, 2.5)).not.toThrow()
    expect(() => pcValidate(['A', 'B'], [60, 40], 10, 5 - 1)).not.toThrow()
  })

  it('rejects wrong shares, sums, snaps, tolerance, names and the start state', () => {
    expect(() => pcValidate(cats, [40, 30, 20], 5, 2.5)).toThrow(/one value per category/)
    expect(() => pcValidate(cats, [40, 30, 20, 11], 5, 2.5)).toThrow(/multiple/)
    expect(() => pcValidate(cats, [40, 30, 20, 5], 5, 2.5)).toThrow(/100/)
    expect(() => pcValidate(cats, [50, 30, 20, 0], 5, 2.5)).toThrow(/greater than 0/)
    expect(() => pcValidate(cats, [25, 25, 25, 25], 5, 2.5)).toThrow(/start state/)
    expect(() => pcValidate(['A', 'B'], [50, 50], 5, 2.5)).toThrow(/start state/)
    expect(() => pcValidate(['A', 'B', 'C'], [30, 30, 40], 5, 2.5)).toThrow(/start state/)
    expect(() => pcValidate(cats, [40, 30, 20, 10], 3, 1)).toThrow(/snapPercent/)
    expect(() => pcValidate(cats, [40, 30, 20, 10], 5, 5)).toThrow(/tolerance/)
    expect(() => pcValidate(cats, [40, 30, 20, 10], 5, -1)).toThrow(/tolerance/)
    expect(() => pcValidateAxis(['A'], 5)).toThrow(/categories/)
    expect(() => pcValidateAxis(['A', 'B', 'C', 'D', 'E', 'F'], 5)).toThrow(/categories/)
    expect(() => pcValidateAxis(['A', 'A'], 5)).toThrow(/differ/)
    expect(() => pcValidateAxis(['A', 'Eine viel zu lange Kategorie'], 5)).toThrow(/category/)
  })

  it('with snap 1 a neighbouring split of the start is a valid target', () => {
    // 5 % target, 5 % tolerance would be rejected earlier; with snap 1, tol 0.5 only exact matches
    expect(() => pcValidate(['A', 'B'], [51, 49], 1, 0.5)).not.toThrow()
  })
})

describe('text fit (lesson h)', () => {
  it('short sectors move their percent text to the legend', () => {
    expect(pcSectorLabelFits(5)).toBe(false)
    expect(pcSectorLabelFits(10)).toBe(true)
    expect(pcSectorLabelFits(40)).toBe(true)
  })

  it('percent text uses a comma-ready format with a space before the sign', () => {
    expect(pcPercentText(45)).toBe('45 %')
    expect(pcPercentText(2.5)).toBe('2,5 %')
  })

  it('all legend texts and ring labels stay inside the viewBox for the longest names', () => {
    const names = ['Süßigkeiten', 'Müsliriegel', 'Kein Tier', 'Zu Fuß', 'Schwimmen']
    for (const e of pcTextExtents(names)) expect(pcExtentFits(e), e.text).toBe(true)
    for (let k = 2; k <= 5; k++) for (const e of pcTextExtents(names.slice(0, k))) expect(pcExtentFits(e), `${k} ${e.text}`).toBe(true)
  })

  it('the fit test can fail (negative control)', () => {
    expect(pcLegendNameFits('x'.repeat(14))).toBe(true)
    expect(pcLegendNameFits('x'.repeat(40))).toBe(false)
    expect(pcExtentFits({ text: 'x'.repeat(80), fontSize: 15, x: 366, y: 100, anchor: 'start' })).toBe(false)
  })
})

describe('print and table svgs', () => {
  it('the empty circle has 20 ticks, 10 labels 0..90, the legend and no sectors', () => {
    const svg = pieChartPrintSvg(['Sparen', 'Kino'])
    expect(svg).toContain('viewBox="0 0 600 340"')
    expect(svg.match(/<line /g)).toHaveLength(20)
    for (const p of [0, 10, 50, 90]) expect(svg).toContain(`>${p}</text>`)
    expect(svg).not.toContain('<path')
    expect(svg).toContain('Sparen')
    expect(svg).toContain('Kino')
    expect(svg).toContain('<rect')
  })

  it('the source table writes every cell and escapes text', () => {
    const svg = pieChartTableSvg('Umfrage: A&B', 'Fach', 'Anzahl Kinder', ['Mathe', 'Kunst'], ['8', '12'])
    expect(svg).toContain('A&amp;B')
    for (const t of ['Fach', 'Anzahl Kinder', 'Mathe', 'Kunst', '>8<', '>12<']) expect(svg).toContain(t)
  })

  it('the source fit test passes for normal and fails for long texts', () => {
    expect(pcSourceFits('Umfrage: Haustier', 'Haustier', 'Anzahl Kinder', ['Hund', 'Kein Tier'], ['10', '5'])).toBe(true)
    expect(pcSourceFits('Umfrage', 'Haustier', 'Anzahl Kinder', ['x'.repeat(40)], ['10'])).toBe(false)
    expect(pcSourceFits('x'.repeat(60), 'a', 'b', ['c'], ['1'])).toBe(false)
  })
})

describe("sector tags: clearance and zero-width sectors", () => {
  const cats = ["Sparen", "Kino", "Spiele", "Essen", "Buecher", "Kleidung"]
  /** Every share vector on the 5 % grid for k categories. */
  const compositions = (k: number, total = 100, snap = 5): number[][] =>
    k === 1 ? [[total]] : Array.from({ length: total / snap + 1 }, (_, i) => i * snap).flatMap((p) => (total - p >= 0 ? compositions(k - 1, total - p, snap).map((r) => [p, ...r]) : []))

  it("a 0 % sector gets no tag", () => {
    const pl = pcTagPlacements(["A", "B", "C"], [50, 0, 50])
    expect(pl.map((p) => p.visible)).toEqual([true, false, true])
  })

  it("every tag keeps >= 4 units from the circle, at all angles", () => {
    for (const k of [2, 3, 4]) {
      for (const shares of compositions(k)) {
        for (const p of pcTagPlacements(cats.slice(0, k), shares)) {
          expect(pcTagCircleClearance(p)).toBeGreaterThanOrEqual(PC_TAG_CLEARANCE)
        }
      }
    }
  })

  it("every visible tag keeps >= 4 units from every boundary knob", () => {
    let visibleCount = 0
    for (const k of [2, 3, 4]) {
      for (const shares of compositions(k)) {
        pcTagPlacements(cats.slice(0, k), shares).forEach((p) => {
          if (!p.visible) return
          visibleCount++
          for (let i = 1; i < k; i++) expect(pcTagKnobClearance(p, shares, i)).toBeGreaterThanOrEqual(PC_TAG_CLEARANCE)
        })
      }
    }
    expect(visibleCount).toBeGreaterThan(100)
  })

  it("negative control: with a 3-character tag a 1 % sector would touch a knob, so it is hidden", () => {
    const names = ["Aaa", "Bbb", "Ccc"]
    const shares = [1, 1, 98]
    const pl = pcTagPlacements(names, shares)
    const raw = pl.map((p) => ({ ...p, visible: true }))
    const worst = Math.min(...raw.flatMap((p) => [1, 2].map((k) => pcTagKnobClearance(p, shares, k))))
    expect(worst).toBeLessThan(PC_TAG_CLEARANCE)
    expect(pl.some((p) => !p.visible)).toBe(true)
  })
})
