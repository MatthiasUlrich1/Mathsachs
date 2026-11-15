import { describe, expect, it } from 'vitest'
import {
  BC_CATEGORY_FONT,
  BC_SOURCE_W,
  BC_VIEWBOX_H,
  BC_VIEWBOX_W,
  BC_X0,
  BC_X1,
  BC_Y_BASE,
  BC_Y_TOP,
  barChartPrintSvg,
  barChartTableSvg,
  barChartTallySvg,
  bcBarCentreX,
  bcBarWidth,
  bcCategoryFits,
  bcExtentFits,
  bcFormatNumber,
  bcLabelEvery,
  bcLabelledTicks,
  bcMatches,
  bcNudge,
  bcSlotWidth,
  bcSnap,
  bcSourceFits,
  bcTextExtents,
  bcTickValues,
  bcTouched,
  bcValidate,
  bcValidateAxis,
  bcValueFromY,
  bcYFromValue,
} from './barChartLogic'

describe('axis maths', () => {
  it('maps values to y and back, with snapping and clamping', () => {
    expect(bcYFromValue(0, 10)).toBe(BC_Y_BASE)
    expect(bcYFromValue(10, 10)).toBe(BC_Y_TOP)
    for (const v of [0, 1, 4, 7, 10]) expect(bcValueFromY(bcYFromValue(v, 10), 10, 1)).toBe(v)
    // a little off still snaps
    expect(bcValueFromY(bcYFromValue(4, 10) + 5, 10, 1)).toBe(4)
    expect(bcValueFromY(5000, 10, 1)).toBe(0)
    expect(bcValueFromY(-5000, 10, 1)).toBe(10)
    expect(bcValueFromY(bcYFromValue(6, 12), 12, 2)).toBe(6)
    expect(bcValueFromY(bcYFromValue(5, 12) , 12, 2)).toBe(6) // 5 snaps to the 2-grid (6)
  })

  it('snap and nudge stay inside 0..yMax and avoid float drift', () => {
    expect(bcSnap(7.4, 1, 10)).toBe(7)
    expect(bcSnap(0.3, 0.5, 5)).toBe(0.5)
    expect(bcSnap(99, 1, 10)).toBe(10)
    expect(bcSnap(-3, 1, 10)).toBe(0)
    expect(bcNudge(0, -1, 1, 10)).toBe(0)
    expect(bcNudge(10, 1, 1, 10)).toBe(10)
    expect(bcNudge(4, 1, 2, 10)).toBe(6)
    let v = 0
    for (let i = 0; i < 6; i++) v = bcNudge(v, 1, 0.1, 5)
    expect(v).toBe(0.6)
  })

  it('writes a number at every tick up to 10 ticks, otherwise at every 2nd', () => {
    expect(bcTickValues(5, 1)).toEqual([0, 1, 2, 3, 4, 5])
    expect(bcLabelEvery(9, 1)).toBe(1) // 10 ticks
    expect(bcLabelledTicks(9, 1)).toHaveLength(10)
    expect(bcLabelEvery(10, 1)).toBe(2) // 11 ticks
    expect(bcLabelledTicks(10, 1)).toEqual([0, 2, 4, 6, 8, 10])
    expect(bcLabelledTicks(14, 1)).toEqual([0, 2, 4, 6, 8, 10, 12, 14])
    expect(bcTickValues(1, 0.25)).toEqual([0, 0.25, 0.5, 0.75, 1])
    expect(bcFormatNumber(0.5)).toBe('0,5')
    expect(bcFormatNumber(12)).toBe('12')
  })

  it('bars sit inside the plot area, in order, and do not overlap', () => {
    for (let n = 2; n <= 6; n++) {
      const w = bcBarWidth(n)
      for (let i = 0; i < n; i++) {
        const cx = bcBarCentreX(i, n)
        expect(cx - w / 2).toBeGreaterThanOrEqual(BC_X0)
        expect(cx + w / 2).toBeLessThanOrEqual(BC_X1)
        if (i > 0) expect(cx - bcBarCentreX(i - 1, n)).toBeCloseTo(bcSlotWidth(n), 6)
      }
      expect(bcSlotWidth(n)).toBeGreaterThan(w)
    }
  })
})

describe('start values and check', () => {
  it('an untouched bar (null) counts as 0, so a zero bar needs no move', () => {
    expect(bcMatches([4, 0, 7], [4, null, 7], 1, 10)).toBe(true)
    expect(bcMatches([4, 0, 7], [4, 0, 7], 1, 10)).toBe(true)
    expect(bcMatches([4, 0, 7], [4, null, null], 1, 10)).toBe(false)
  })

  it('all bars untouched never matches real data (the helper refuses all-zero data)', () => {
    expect(bcMatches([4, 0, 7], [null, null, null], 1, 10)).toBe(false)
    expect(bcMatches([4, 0, 7], [0, 0, 0], 1, 10)).toBe(false)
  })

  it('matches only when every bar has exactly its value (after snapping)', () => {
    const data = [4, 0, 7]
    expect(bcMatches(data, [4, 0, 7], 1, 10)).toBe(true)
    expect(bcMatches(data, [4.2, 0.1, 6.9], 1, 10)).toBe(true) // snaps to the step
    expect(bcMatches(data, [4, 0, 6], 1, 10)).toBe(false)
    expect(bcMatches(data, [4, 0], 1, 10)).toBe(false)
    expect(bcMatches(data, undefined, 1, 10)).toBe(false)
    expect(bcMatches(data, [4, 0, Number.NaN], 1, 10)).toBe(false)
  })

  it('touched means at least one bar was moved', () => {
    expect(bcTouched([null, null])).toBe(false)
    expect(bcTouched([])).toBe(false)
    expect(bcTouched(undefined)).toBe(false)
    expect(bcTouched([null, 0])).toBe(true)
  })
})

describe('validation', () => {
  const ok = () => bcValidate(['A', 'B', 'C'], [1, 2, 3], 4, 1, 'Anzahl')
  it('accepts a sensible input', () => expect(ok).not.toThrow())
  it.each([
    ['one category', ['A'], [1], 4, 1],
    ['seven categories', ['A', 'B', 'C', 'D', 'E', 'F', 'G'], [1, 1, 1, 1, 1, 1, 1], 4, 1],
    ['missing data', ['A', 'B'], [1], 4, 1],
    ['duplicate names', ['A', 'A'], [1, 2], 4, 1],
    ['yMax not a multiple of step', ['A', 'B'], [1, 2], 5, 2],
    ['value above yMax', ['A', 'B'], [1, 6], 5, 1],
    ['value off the grid', ['A', 'B'], [1, 1.5], 4, 1],
    ['negative value', ['A', 'B'], [-1, 2], 4, 1],
    ['too many steps', ['A', 'B'], [1, 2], 50, 1],
    ['a single step', ['A', 'B'], [0, 1], 1, 1],
    ['name too long', ['A', 'Eine sehr lange Beschriftung'], [1, 2], 4, 1],
    ['name not fitting under 6 bars', ['A', 'B', 'C', 'D', 'E', 'Schwimmverein'], [1, 1, 1, 1, 1, 1], 4, 1],
  ])('rejects %s', (_name, cats, data, yMax, step) => {
    expect(() => bcValidate(cats as string[], data as number[], yMax as number, step as number, '')).toThrow(/barChartTask/)
  })
  it('rejects data that is all zero (the untouched chart would be the answer)', () => {
    expect(() => bcValidate(['A', 'B'], [0, 0], 4, 1, '')).toThrow(/all zero/)
    expect(() => bcValidate(['A', 'B'], [0, 1], 4, 1, '')).not.toThrow()
  })
  it('the axis rules alone need no data (worksheet frame)', () => {
    expect(() => bcValidateAxis(['A', 'B'], 4, 1, '')).not.toThrow()
    expect(() => bcValidateAxis(['A'], 4, 1, '')).toThrow(/categories/)
    expect(() => bcValidateAxis(['A', 'B'], 5, 2, '')).toThrow(/multiple/)
  })
  it('rejects a long axis label and accepts a decimal step', () => {
    expect(() => bcValidate(['A', 'B'], [1, 2], 4, 1, 'x'.repeat(25))).toThrow()
    expect(() => bcValidate(['A', 'B'], [0.5, 1], 2, 0.5, '')).not.toThrow()
  })
})

describe('text fits the viewBox (estimated extents)', () => {
  it('all numbers, categories and the axis title of typical charts fit', () => {
    const cases: Array<[string[], number, number, string]> = [
      [['Fußball', 'Schwimmen', 'Tanzen', 'Turnen', 'Reiten'], 10, 1, 'Anzahl Kinder'],
      [['Zu Fuß', 'Fahrrad', 'Bus', 'Auto'], 20, 1, 'x'.repeat(24)],
      [['Schoko', 'Vanille', 'Erdbeere', 'Zitrone', 'Waffel', 'Sahne'], 12, 2, 'Anzahl'],
      [['A', 'B'], 1000, 100, ''],
      [['A', 'B'], 2, 0.25, 'Anteil'],
    ]
    for (const [cats, yMax, step, label] of cases) {
      for (const e of bcTextExtents(cats, yMax, step, label)) expect(bcExtentFits(e), `${e.text} @${e.x},${e.y}`).toBe(true)
    }
  })

  it('negative control: text that is too long or too far out is detected', () => {
    expect(bcExtentFits({ text: 'x'.repeat(80), fontSize: 13, x: 8, y: 18, anchor: 'start' })).toBe(false)
    expect(bcExtentFits({ text: 'Beschriftung', fontSize: 13, x: 10, y: 272, anchor: 'middle' })).toBe(false)
    expect(bcExtentFits({ text: '1000000', fontSize: 13, x: 40, y: 100, anchor: 'end' })).toBe(false)
    expect(bcExtentFits({ text: 'ok', fontSize: 13, x: 300, y: BC_VIEWBOX_H, anchor: 'middle' })).toBe(false)
    expect(bcCategoryFits('Schwimmverein', 6)).toBe(false)
    expect(bcCategoryFits('Schwimmverein', 3)).toBe(true)
    expect(BC_CATEGORY_FONT).toBeGreaterThan(0)
  })
})

describe('worksheet print figure', () => {
  it('is an empty frame: grid, numbers and category names, no bars and no data', () => {
    const svg = barChartPrintSvg(['Hund', 'Katze'], 6, 1, 'Anzahl Kinder')
    expect(svg).toContain('<svg')
    expect(svg).toContain(`viewBox="0 0 ${BC_VIEWBOX_W} ${BC_VIEWBOX_H}"`)
    expect(svg.match(/<line/g)!.length).toBe(7 + 1) // 7 grid lines + y axis
    expect(svg).not.toContain('<rect')
    for (const t of ['Hund', 'Katze', 'Anzahl Kinder']) expect(svg).toContain(t)
    const numbers = (svg.match(/text-anchor="end"[^>]*>([^<]*)</g) ?? []).map((m) => m.replace(/.*>/, '').replace('<', ''))
    expect(numbers).toEqual(['0', '1', '2', '3', '4', '5', '6'])
  })

  it('escapes names', () => {
    expect(barChartPrintSvg(['A&B', '<x>'], 4, 1, '')).toContain('A&amp;B')
  })
})

describe('data source figures', () => {
  it('tally sheet draws groups of five with a crossing stroke and one row per category', () => {
    const svg = barChartTallySvg('Strichliste: Test', ['A', 'B', 'C'], [0, 4, 12])
    expect(svg).toContain('Strichliste: Test')
    // strokes: 0 + 4 + (4+4+2) ; crossing strokes: 0 + 0 + 2
    const strokes = svg.match(/stroke="#0f172a" stroke-width="2.5"/g)!.length
    expect(strokes).toBe(4 + 10 + 2)
    expect(svg).not.toMatch(/>\s*12\s*</) // the number itself is not written
  })

  it('frequency table writes the numbers', () => {
    const svg = barChartTableSvg('Tabelle', 'Sport', 'Anzahl Kinder', ['Fußball', 'Tanzen'], [9, 1])
    for (const t of ['Sport', 'Anzahl Kinder', 'Fußball', 'Tanzen', '>9<', '>1<']) expect(svg).toContain(t)
  })

  it('fit test accepts normal content and rejects long labels or too many tally marks', () => {
    expect(bcSourceFits('Strichliste: Lieblingssportart', ['Fußball', 'Schwimmen'], [9, 6], 'tally' as const)).toBe(true)
    expect(bcSourceFits('Tabelle', ['Fußball'], [9], 'table')).toBe(true)
    expect(bcSourceFits('Strichliste', ['Ein viel zu langer Name'], [3], 'tally')).toBe(false)
    expect(bcSourceFits('Strichliste', ['A'], [60], 'tally')).toBe(false)
    expect(bcSourceFits('x'.repeat(80), ['A'], [1], 'table')).toBe(false)
    expect(BC_SOURCE_W).toBeGreaterThan(0)
  })
})
