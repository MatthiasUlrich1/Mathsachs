import { describe, expect, it } from 'vitest'
import {
  SYM_AXIS_OVERHANG,
  SYM_CELL,
  SYM_CENTRE_R,
  SYM_MAX_SIZE,
  SYM_MIN_CELL_PX,
  SYM_MIN_SIZE,
  SYM_PAD,
  SYM_REF_WIDTH_PX,
  cellKey,
  mirrorCell,
  parseCell,
  reflectCell,
  symCellPx,
  symCellsFromArt,
  symCountText,
  symIsToggleable,
  symLayout,
  symMatches,
  symMaxColsForPhone,
  symParseCells,
  symTarget,
  symToggle,
  symTouched,
  symValidate,
  symmetryPrintSvg,
  type SymConfig,
} from './symmetryDrawLogic'

const vertical: SymConfig = { cols: 8, rows: 6, given: ['3,1', '2,2', '3,2'], axis: { kind: 'vertical', at: 4 } }

describe('reflection formula', () => {
  it('2 * line - 1 - c is the one formula, an involution, and swaps the two cells next to the line', () => {
    expect(reflectCell(3, 4)).toBe(4)
    expect(reflectCell(4, 4)).toBe(3)
    expect(reflectCell(0, 4)).toBe(7)
    for (let line = 1; line < 10; line++) for (let c = 0; c < 12; c++) expect(reflectCell(reflectCell(c, line), line)).toBe(c)
  })

  it('mirrors at a vertical, a horizontal and a diagonal axis', () => {
    expect(mirrorCell(2, 5, { axis: { kind: 'vertical', at: 4 } })).toEqual([5, 5])
    expect(mirrorCell(2, 5, { axis: { kind: 'horizontal', at: 3 } })).toEqual([2, 0])
    expect(mirrorCell(2, 5, { axis: { kind: 'diagonal' } })).toEqual([5, 2])
  })

  it('point reflection: (x, y) -> (2px - 1 - x, 2py - 1 - y)', () => {
    expect(mirrorCell(1, 1, { point: { x: 4, y: 4 } })).toEqual([6, 6])
    expect(mirrorCell(3, 3, { point: { x: 4, y: 4 } })).toEqual([4, 4])
    expect(mirrorCell(2, 0, { point: { x: 6, y: 3 } })).toEqual([9, 5])
    // twice = identity
    const [a, b] = mirrorCell(2, 1, { point: { x: 5, y: 3 } })
    expect(mirrorCell(a, b, { point: { x: 5, y: 3 } })).toEqual([2, 1])
  })
})

describe('cells', () => {
  it('parseCell reads only the canonical "x,y"', () => {
    expect(parseCell('3,12')).toEqual([3, 12])
    for (const bad of ['03,1', '3, 1', '-1,2', '3', 'a,b', '1,2,3', '', 5, null]) expect(parseCell(bad)).toBeNull()
  })

  it('sortCells orders by row, then column; art picture to cells', () => {
    expect(symCellsFromArt(['.#.', '##.', '..#'])).toEqual(['1,0', '0,1', '1,1', '2,2'])
  })

  it('symParseCells accepts semicolons, lines and spaces after the comma', () => {
    expect(symParseCells('3,1; 2, 2\n1,3')).toEqual(['3,1', '2,2', '1,3'])
    expect(symParseCells(undefined)).toEqual([])
  })
})

describe('symValidate', () => {
  it('accepts a good axis configuration, a diagonal one and a point one', () => {
    expect(() => symValidate(vertical)).not.toThrow()
    expect(() => symValidate({ cols: 6, rows: 6, given: ['0,2', '0,3', '1,3'], axis: { kind: 'diagonal' } })).not.toThrow()
    expect(() => symValidate({ cols: 8, rows: 8, given: ['1,1', '2,1'], point: { x: 4, y: 4 } })).not.toThrow()
  })

  it('grid size 4..12 only', () => {
    expect(() => symValidate({ ...vertical, cols: 3 })).toThrow(/cols and rows/)
    expect(() => symValidate({ ...vertical, rows: 13 })).toThrow(/cols and rows/)
    expect(() => symValidate({ ...vertical, cols: 6.5 })).toThrow(/cols and rows/)
    expect(() => symValidate({ cols: SYM_MIN_SIZE, rows: SYM_MAX_SIZE, given: ['0,0'], axis: { kind: 'vertical', at: 2 } })).not.toThrow()
  })

  it('exactly one of axis and point', () => {
    expect(() => symValidate({ cols: 8, rows: 6, given: ['0,0'] })).toThrow(/exactly one/)
    expect(() => symValidate({ ...vertical, point: { x: 4, y: 3 } })).toThrow(/exactly one/)
  })

  it('the axis lies on an inner grid line; the diagonal needs a square grid', () => {
    expect(() => symValidate({ ...vertical, axis: { kind: 'vertical', at: 0 } })).toThrow(/axis.at/)
    expect(() => symValidate({ ...vertical, axis: { kind: 'vertical', at: 8 } })).toThrow(/axis.at/)
    expect(() => symValidate({ ...vertical, axis: { kind: 'vertical', at: 2.5 } })).toThrow(/axis.at/)
    expect(() => symValidate({ ...vertical, axis: { kind: 'horizontal', at: 6 } })).toThrow(/axis.at/)
    expect(() => symValidate({ ...vertical, axis: { kind: 'diagonal' } })).toThrow(/square/)
    expect(() => symValidate({ ...vertical, axis: { kind: 'sideways' as never } })).toThrow(/unknown axis/)
  })

  it('point must be a grid intersection', () => {
    expect(() => symValidate({ cols: 8, rows: 8, given: ['1,1'], point: { x: 0, y: 4 } })).toThrow(/point/)
    expect(() => symValidate({ cols: 8, rows: 8, given: ['1,1'], point: { x: 4, y: 8 } })).toThrow(/point/)
  })

  it('given: not empty, inside the grid, no duplicates, canonical', () => {
    expect(() => symValidate({ ...vertical, given: [] })).toThrow(/at least one/)
    expect(() => symValidate({ ...vertical, given: ['8,1'] })).toThrow(/not a cell/)
    expect(() => symValidate({ ...vertical, given: ['1,6'] })).toThrow(/not a cell/)
    expect(() => symValidate({ ...vertical, given: ['1,1', '1,1'] })).toThrow(/twice/)
    expect(() => symValidate({ ...vertical, given: ['01,1'] })).toThrow(/not a cell/)
  })

  it('the given figure lies on one side of the axis, never on it', () => {
    expect(() => symValidate({ ...vertical, given: ['1,1', '6,2'] })).toThrow(/one side/)
    expect(() => symValidate({ cols: 6, rows: 6, given: ['2,2', '1,3'], axis: { kind: 'diagonal' } })).toThrow(/on the axis/)
    expect(() => symValidate({ cols: 6, rows: 6, given: ['2,0', '0,3'], axis: { kind: 'diagonal' } })).toThrow(/one side/)
  })

  it('the mirror image must stay in the grid and may not overlap the given figure', () => {
    // at=2 mirrors column 0 to column 3: fine; column 1 -> 2 fine; with at=1 column 0 -> 1 fine but 1 itself is on the other side
    expect(() => symValidate({ cols: 8, rows: 6, given: ['0,1', '1,1'], axis: { kind: 'vertical', at: 2 } })).not.toThrow()
    expect(() => symValidate({ cols: 8, rows: 6, given: ['0,1'], axis: { kind: 'vertical', at: 5 } })).toThrow(/outside the grid/)
    expect(() => symValidate({ cols: 8, rows: 6, given: ['2,0'], axis: { kind: 'horizontal', at: 3 } })).not.toThrow()
    expect(() => symValidate({ cols: 8, rows: 6, given: ['2,0'], axis: { kind: 'horizontal', at: 5 } })).toThrow(/outside the grid/)
    expect(() => symValidate({ cols: 8, rows: 6, given: ['2,5'], axis: { kind: 'horizontal', at: 2 } })).toThrow(/outside the grid/)
    // point: a cell next to the centre maps onto a given cell
    expect(() => symValidate({ cols: 8, rows: 8, given: ['3,3', '4,4'], point: { x: 4, y: 4 } })).toThrow(/overlaps/)
    expect(() => symValidate({ cols: 8, rows: 8, given: ['3,3'], point: { x: 1, y: 1 } })).toThrow(/outside the grid/)
  })
})

describe('symTarget and symMatches', () => {
  it('the target is the sorted mirror image', () => {
    expect(symTarget(vertical)).toEqual(['4,1', '4,2', '5,2'])
    expect(symTarget({ cols: 8, rows: 8, given: ['1,1', '2,1', '2,2'], point: { x: 4, y: 4 } })).toEqual(['5,5', '5,6', '6,6'])
    expect(symTarget({ cols: 6, rows: 6, given: ['0,2', '0,3', '1,3'], axis: { kind: 'diagonal' } })).toEqual(['2,0', '3,0', '3,1'])
  })

  it('exact set match: missing, extra, wrong cell and duplicates all fail; order does not matter', () => {
    const target = symTarget(vertical)
    expect(symMatches(target, ['5,2', '4,1', '4,2'])).toBe(true)
    expect(symMatches(target, ['4,1', '4,2'])).toBe(false)
    expect(symMatches(target, [...target, '6,0'])).toBe(false)
    expect(symMatches(target, ['4,1', '4,2', '5,3'])).toBe(false)
    expect(symMatches(target, ['4,1', '4,1', '4,2'])).toBe(false)
    expect(symMatches(target, [])).toBe(false)
  })
})

describe('tapping', () => {
  it('given cells and the wrong side are not toggleable; the free side is', () => {
    expect(symIsToggleable(vertical, 3, 1)).toBe(false) // given
    expect(symIsToggleable(vertical, 0, 0)).toBe(false) // figure side
    expect(symIsToggleable(vertical, 4, 1)).toBe(true)
    expect(symIsToggleable(vertical, 7, 5)).toBe(true)
    expect(symIsToggleable(vertical, 8, 0)).toBe(false) // outside
  })

  it('a figure on the right leaves the left side free; horizontal and diagonal likewise', () => {
    const right: SymConfig = { ...vertical, given: ['4,1'] }
    expect(symIsToggleable(right, 3, 1)).toBe(true)
    expect(symIsToggleable(right, 5, 1)).toBe(false)
    const horiz: SymConfig = { cols: 6, rows: 8, given: ['1,1'], axis: { kind: 'horizontal', at: 4 } }
    expect(symIsToggleable(horiz, 1, 5)).toBe(true)
    expect(symIsToggleable(horiz, 1, 2)).toBe(false)
    const diag: SymConfig = { cols: 6, rows: 6, given: ['0,3'], axis: { kind: 'diagonal' } }
    expect(symIsToggleable(diag, 3, 0)).toBe(true)
    expect(symIsToggleable(diag, 2, 2)).toBe(false) // on the diagonal
    expect(symIsToggleable(diag, 0, 5)).toBe(false)
  })

  it('an axis task without given cells has no free side (nothing is toggleable)', () => {
    expect(symIsToggleable({ ...vertical, given: [] }, 5, 2)).toBe(false)
    expect(symIsToggleable({ ...vertical, given: ['x'] }, 5, 2)).toBe(false)
  })

  it('point symmetry: every cell that is not given can be set', () => {
    const p: SymConfig = { cols: 8, rows: 8, given: ['1,1'], point: { x: 4, y: 4 } }
    expect(symIsToggleable(p, 6, 6)).toBe(true)
    expect(symIsToggleable(p, 0, 0)).toBe(true)
    expect(symIsToggleable(p, 1, 1)).toBe(false)
  })

  it('symToggle switches on and off, keeps the list sorted and ignores forbidden cells', () => {
    let cells: string[] = []
    cells = symToggle(vertical, cells, 5, 2)
    cells = symToggle(vertical, cells, 4, 1)
    expect(cells).toEqual(['4,1', '5,2'])
    expect(symToggle(vertical, cells, 5, 2)).toEqual(['4,1'])
    expect(symToggle(vertical, cells, 3, 1)).toEqual(['4,1', '5,2'])
    expect(symToggle(vertical, cells, 0, 0)).toEqual(['4,1', '5,2'])
  })

  it('touched, count text (singular for 1)', () => {
    expect(symTouched([])).toBe(false)
    expect(symTouched(undefined)).toBe(false)
    expect(symTouched(['1,1'])).toBe(true)
    expect(symCountText(1)).toBe('1 Feld gefärbt')
    expect(symCountText(5)).toBe('5 Felder gefärbt')
  })
})

describe('layout', () => {
  it('every grid size from 4 to 12 has cells of at least 24 px at 343 px width (375 px screen)', () => {
    expect(symMaxColsForPhone()).toBeGreaterThanOrEqual(SYM_MAX_SIZE)
    for (let cols = SYM_MIN_SIZE; cols <= SYM_MAX_SIZE; cols++) {
      expect(symCellPx(cols, SYM_REF_WIDTH_PX), `cols ${cols}`).toBeGreaterThanOrEqual(SYM_MIN_CELL_PX)
    }
    // the check really can fail: far too many columns break the floor
    expect(symCellPx(20, SYM_REF_WIDTH_PX)).toBeLessThan(SYM_MIN_CELL_PX)
  })

  it('the axis and the centre stay inside the viewBox for every size and position', () => {
    for (let cols = SYM_MIN_SIZE; cols <= SYM_MAX_SIZE; cols++) {
      for (let rows = SYM_MIN_SIZE; rows <= SYM_MAX_SIZE; rows++) {
        const inside = (x: number, y: number, l: ReturnType<typeof symLayout>, r = 0) =>
          x - r >= 0 && y - r >= 0 && x + r <= l.viewBoxW && y + r <= l.viewBoxH
        const configs: Array<Pick<SymConfig, 'cols' | 'rows' | 'axis' | 'point'>> = [
          { cols, rows, axis: { kind: 'vertical', at: 1 } },
          { cols, rows, axis: { kind: 'vertical', at: cols - 1 } },
          { cols, rows, axis: { kind: 'horizontal', at: 1 } },
          { cols, rows, axis: { kind: 'horizontal', at: rows - 1 } },
          { cols, rows, axis: { kind: 'diagonal' } },
          { cols, rows, point: { x: 1, y: 1 } },
          { cols, rows, point: { x: cols - 1, y: rows - 1 } },
        ]
        for (const c of configs) {
          const l = symLayout(c)
          if (l.axisLine) {
            expect(inside(l.axisLine.x1, l.axisLine.y1, l)).toBe(true)
            expect(inside(l.axisLine.x2, l.axisLine.y2, l)).toBe(true)
          }
          if (l.centre) expect(inside(l.centre.cx, l.centre.cy, l, SYM_CENTRE_R)).toBe(true)
          const last = l.cellRect(cols - 1, rows - 1)
          expect(last.x + last.w).toBeLessThanOrEqual(l.viewBoxW)
          expect(last.y + last.h).toBeLessThanOrEqual(l.viewBoxH)
        }
      }
    }
    expect(SYM_AXIS_OVERHANG).toBeLessThan(SYM_PAD)
  })

  it('a vertical axis runs along the grid line between two columns, a centre on a grid intersection', () => {
    const l = symLayout({ cols: 8, rows: 6, axis: { kind: 'vertical', at: 4 } })
    expect(l.axisLine!.x1).toBe(SYM_PAD + 4 * SYM_CELL)
    expect(l.axisLine!.x1).toBe(l.axisLine!.x2)
    // the axis touches the right edge of column 3 and the left edge of column 4
    expect(l.cellRect(3, 0).x + SYM_CELL).toBe(l.axisLine!.x1)
    expect(l.cellRect(4, 0).x).toBe(l.axisLine!.x1)
    const p = symLayout({ cols: 8, rows: 8, point: { x: 4, y: 4 } })
    expect(p.centre).toEqual({ cx: SYM_PAD + 4 * SYM_CELL, cy: SYM_PAD + 4 * SYM_CELL })
    expect(p.axisLine).toBeNull()
  })
})

describe('print svg', () => {
  it('draws the grid, shades only the given cells and marks the axis (dashed) or the centre', () => {
    const svg = symmetryPrintSvg(vertical)
    expect(svg).toMatch(/viewBox="0 0 \d+ \d+"/)
    expect(svg.match(/<rect /g)).toHaveLength(8 * 6)
    expect(svg.match(/fill="#64748b"/g)).toHaveLength(3)
    expect(svg).toContain('stroke-dasharray')
    expect(svg).not.toContain('<circle')
    const p = symmetryPrintSvg({ cols: 8, rows: 8, given: ['1,1'], point: { x: 4, y: 4 } })
    expect(p).toContain('<circle')
    expect(p).not.toContain('stroke-dasharray')
  })

  it('does not contain the solution cells shaded', () => {
    const svg = symmetryPrintSvg(vertical)
    const target = symTarget(vertical)
    for (const key of target) {
      const [x, y] = parseCell(key)!
      const l = symLayout(vertical).cellRect(x, y)
      expect(svg).toContain(`<rect x="${l.x}" y="${l.y}" width="${l.w}" height="${l.h}" fill="#ffffff"`)
    }
    expect(cellKey(1, 2)).toBe('1,2')
  })
})
