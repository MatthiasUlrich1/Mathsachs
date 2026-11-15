/**
 * Pure logic for the symmetry drawing widget (SymmetryDraw): complete a figure on a grid so that it is symmetric.
 *
 * Conventions (all in CELL coordinates, `x` to the right and `y` downwards, the top-left cell is "0,0"):
 * - A cell is the string "x,y". The grid has `cols` x `rows` cells (SYM_MIN_SIZE..SYM_MAX_SIZE each).
 * - A line axis runs ALONG A GRID LINE, never through a cell centre. `at` is the index of that line: line `at` lies
 *   between column `at - 1` and column `at` (vertical) or between row `at - 1` and row `at` (horizontal), 1..size-1.
 *   So no cell sits on a vertical/horizontal axis and every cell has a different mirror cell.
 * - diagonal: the main diagonal of a square grid, (x, y) -> (y, x). Cells on the diagonal are their own mirror and
 *   may therefore neither be given nor be drawn.
 * - Point symmetry: the centre is a grid intersection `{ x, y }` (line indices 1..size-1); the map is the point
 *   reflection through it.
 * - All mirror images are computed with `reflectCell` below: the ONE formula `2 * line - 1 - c`.
 * Geometry is in SVG units (viewBox), never screen pixels.
 */

export const SYM_MIN_SIZE = 4
export const SYM_MAX_SIZE = 12

/** Shared layout constants (component, print and fit tests use the same numbers). */
export const SYM_CELL = 30
export const SYM_PAD = 14
/** How far the axis line sticks out over the grid. Smaller than SYM_PAD so it stays inside the viewBox. */
export const SYM_AXIS_OVERHANG = 8
export const SYM_CENTRE_R = 5
export const SYM_GRID_STROKE = '#94a3b8'
export const SYM_GIVEN_FILL = '#64748b'
export const SYM_DRAWN_FILL = '#38bdf8'
export const SYM_AXIS_STROKE = '#dc2626'

/** Readability floor: a cell must be at least this wide on a phone (CSS px) ... */
export const SYM_MIN_CELL_PX = 24
/** ... when the widget is 343 px wide (a 375 px screen minus the page gutters). */
export const SYM_REF_WIDTH_PX = 343

export type SymAxisKind = 'vertical' | 'horizontal' | 'diagonal'
export interface SymAxis {
  kind: SymAxisKind
  /** Grid line index for vertical/horizontal (1..size-1). Not used for diagonal. */
  at?: number
}
export interface SymPoint {
  x: number
  y: number
}
export interface SymConfig {
  cols: number
  rows: number
  /** The given figure as "x,y" cells. */
  given: readonly string[]
  /** Exactly one of `axis` and `point`. */
  axis?: SymAxis
  point?: SymPoint
}

export const cellKey = (x: number, y: number): string => `${x},${y}`

/** Reads "x,y" (canonical form only: non-negative integers without leading zeros or blanks); null otherwise. */
export const parseCell = (key: unknown): [number, number] | null => {
  if (typeof key !== 'string') return null
  const m = /^(\d+),(\d+)$/.exec(key)
  if (!m) return null
  const x = Number(m[1])
  const y = Number(m[2])
  return cellKey(x, y) === key ? [x, y] : null
}

/** THE reflection formula: cell coordinate `c` mirrored at the grid line with index `line` (also used for the point reflection). */
export const reflectCell = (c: number, line: number): number => 2 * line - 1 - c

/** Mirror image of one cell. The configuration must have been validated for the result to mean anything. */
export const mirrorCell = (x: number, y: number, sym: Pick<SymConfig, 'axis' | 'point'>): [number, number] => {
  if (sym.point) return [reflectCell(x, sym.point.x), reflectCell(y, sym.point.y)]
  const axis = sym.axis
  if (axis?.kind === 'diagonal') return [y, x]
  if (axis?.kind === 'horizontal') return [x, reflectCell(y, axis.at as number)]
  return [reflectCell(x, (axis?.at as number) ?? 0), y]
}

const byRowThenColumn = (a: string, b: string): number => {
  const [ax, ay] = parseCell(a) ?? [0, 0]
  const [bx, by] = parseCell(b) ?? [0, 0]
  return ay - by || ax - bx
}
export const sortCells = (cells: readonly string[]): string[] => [...cells].sort(byRowThenColumn)

const isInt = (n: unknown): n is number => typeof n === 'number' && Number.isInteger(n)

/** Largest column count whose cells are still SYM_MIN_CELL_PX wide at SYM_REF_WIDTH_PX (padding included). */
export const symMaxColsForPhone = (): number => {
  let cols = SYM_MIN_SIZE
  while (symCellPx(cols + 1, SYM_REF_WIDTH_PX) >= SYM_MIN_CELL_PX) cols++
  return cols
}

/** Width of one cell in CSS px when the whole widget is `widgetPx` wide. */
export const symCellPx = (cols: number, widgetPx: number): number => (SYM_CELL * widgetPx) / (cols * SYM_CELL + 2 * SYM_PAD)

/** Throws an Error with a German-free technical message when the configuration is unusable. */
export const symValidate = (config: SymConfig): void => {
  const { cols, rows, given, axis, point } = config
  if (!isInt(cols) || !isInt(rows) || cols < SYM_MIN_SIZE || rows < SYM_MIN_SIZE || cols > SYM_MAX_SIZE || rows > SYM_MAX_SIZE) {
    throw new Error(`symmetryDrawTask: cols and rows must be whole numbers from ${SYM_MIN_SIZE} to ${SYM_MAX_SIZE}`)
  }
  if ((axis === undefined) === (point === undefined)) throw new Error('symmetryDrawTask: give exactly one of axis and point')
  if (axis) {
    if (axis.kind === 'diagonal') {
      if (cols !== rows) throw new Error('symmetryDrawTask: a diagonal axis needs a square grid')
    } else if (axis.kind === 'vertical' || axis.kind === 'horizontal') {
      const size = axis.kind === 'vertical' ? cols : rows
      if (!isInt(axis.at) || axis.at < 1 || axis.at > size - 1) {
        throw new Error(`symmetryDrawTask: axis.at must be a grid line from 1 to ${size - 1}`)
      }
    } else {
      throw new Error(`symmetryDrawTask: unknown axis kind ${String((axis as { kind: unknown }).kind)}`)
    }
  }
  if (point && (!isInt(point.x) || !isInt(point.y) || point.x < 1 || point.x > cols - 1 || point.y < 1 || point.y > rows - 1)) {
    throw new Error('symmetryDrawTask: point must be a grid intersection inside the grid')
  }
  if (!Array.isArray(given) || given.length === 0) throw new Error('symmetryDrawTask: given needs at least one cell')
  const seen = new Set<string>()
  const cells: Array<[number, number]> = []
  for (const key of given) {
    const c = parseCell(key)
    if (!c || c[0] >= cols || c[1] >= rows) throw new Error(`symmetryDrawTask: given cell "${String(key)}" is not a cell of the grid`)
    if (seen.has(key)) throw new Error(`symmetryDrawTask: given cell "${key}" appears twice`)
    seen.add(key)
    cells.push(c)
  }
  if (axis) {
    const sides = new Set(cells.map(([x, y]) => symSide(axis, x, y)))
    if (sides.has(0)) throw new Error('symmetryDrawTask: a given cell lies on the axis (it would be its own mirror image)')
    if (sides.size > 1) throw new Error('symmetryDrawTask: the given figure must lie on one side of the axis')
  }
  for (const [x, y] of cells) {
    const [mx, my] = mirrorCell(x, y, config)
    if (mx < 0 || my < 0 || mx >= cols || my >= rows) throw new Error(`symmetryDrawTask: the mirror image of "${x},${y}" lies outside the grid`)
    if (seen.has(cellKey(mx, my))) throw new Error(`symmetryDrawTask: the mirror image of "${x},${y}" overlaps the given figure`)
  }
}

/** Which side of the axis a cell is on: -1 / +1, or 0 when the cell lies on the diagonal (vertical/horizontal axes never give 0). */
const symSide = (axis: SymAxis, x: number, y: number): -1 | 0 | 1 => {
  if (axis.kind === 'diagonal') return Math.sign(x - y) as -1 | 0 | 1
  const c = axis.kind === 'vertical' ? x : y
  return c < (axis.at as number) ? -1 : 1
}

/** The expected drawing: the mirror image of `given`, sorted. Validates the configuration (throws when unusable). */
export const symTarget = (config: SymConfig): string[] => {
  symValidate(config)
  return sortCells(
    config.given.map((key) => {
      const [x, y] = parseCell(key) as [number, number]
      const [mx, my] = mirrorCell(x, y, config)
      return cellKey(mx, my)
    }),
  )
}

/** Exact comparison: the drawn cells must be the mirror image, no cell missing, none extra. */
export const symMatches = (target: readonly string[], cells: readonly string[]): boolean => {
  const drawn = new Set(cells)
  return drawn.size === target.length && target.every((key) => drawn.has(key))
}

/** Can the learner switch this cell? Not given cells, and for an axis only the free side (the side without the figure). */
export const symIsToggleable = (config: SymConfig, x: number, y: number): boolean => {
  if (x < 0 || y < 0 || x >= config.cols || y >= config.rows) return false
  if (config.given.includes(cellKey(x, y))) return false
  const axis = config.axis
  if (!axis) return true
  const first = parseCell(config.given[0])
  if (!first) return false
  const [gx, gy] = first
  const side = symSide(axis, x, y)
  return side !== 0 && side === -symSide(axis, gx, gy)
}

/** Tap on a cell: switches it on or off (when toggleable) and returns the sorted cell list. */
export const symToggle = (config: SymConfig, cells: readonly string[], x: number, y: number): string[] => {
  if (!symIsToggleable(config, x, y)) return sortCells(cells)
  const key = cellKey(x, y)
  return sortCells(cells.includes(key) ? cells.filter((c) => c !== key) : [...cells, key])
}

/** Attempted = at least one cell was set. */
export const symTouched = (cells: readonly string[] | undefined): boolean => Array.isArray(cells) && cells.length > 0

/** "1 Feld gefärbt" / "5 Felder gefärbt" (singular for 1). */
export const symCountText = (n: number): string => `${n} ${n === 1 ? 'Feld' : 'Felder'} gefärbt`

/** Reads cells like "2,3; 4,5" or one per line; used by the authoring form. Unreadable pieces are kept so validation fails. */
export const symParseCells = (text: unknown): string[] =>
  (Array.isArray(text) ? text.map(String).join(';') : String(text ?? ''))
    .split(/[;\n]|\s{2,}/)
    .map((s) => s.trim().replace(/\s*,\s*/, ','))
    .filter(Boolean)

/** Cells of an ASCII picture: '#' is a cell, anything else is empty. Row r, column c -> "c,r". */
export const symCellsFromArt = (art: readonly string[]): string[] => {
  const out: string[] = []
  art.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) if (line[x] === '#') out.push(cellKey(x, y))
  })
  return out
}

export interface SymLayout {
  viewBoxW: number
  viewBoxH: number
  gridX: number
  gridY: number
  gridW: number
  gridH: number
  cellRect: (x: number, y: number) => { x: number; y: number; w: number; h: number }
  /** The axis as a line segment (null for point symmetry). */
  axisLine: { x1: number; y1: number; x2: number; y2: number } | null
  /** The symmetry centre (null for axial symmetry). */
  centre: { cx: number; cy: number } | null
}

export const symLayout = (config: Pick<SymConfig, 'cols' | 'rows' | 'axis' | 'point'>): SymLayout => {
  const { cols, rows, axis, point } = config
  const gridW = cols * SYM_CELL
  const gridH = rows * SYM_CELL
  const o = SYM_AXIS_OVERHANG
  let axisLine: SymLayout['axisLine'] = null
  if (axis?.kind === 'vertical') {
    const x = SYM_PAD + (axis.at as number) * SYM_CELL
    axisLine = { x1: x, y1: SYM_PAD - o, x2: x, y2: SYM_PAD + gridH + o }
  } else if (axis?.kind === 'horizontal') {
    const y = SYM_PAD + (axis.at as number) * SYM_CELL
    axisLine = { x1: SYM_PAD - o, y1: y, x2: SYM_PAD + gridW + o, y2: y }
  } else if (axis?.kind === 'diagonal') {
    axisLine = { x1: SYM_PAD - o, y1: SYM_PAD - o, x2: SYM_PAD + gridW + o, y2: SYM_PAD + gridH + o }
  }
  return {
    viewBoxW: gridW + 2 * SYM_PAD,
    viewBoxH: gridH + 2 * SYM_PAD,
    gridX: SYM_PAD,
    gridY: SYM_PAD,
    gridW,
    gridH,
    cellRect: (x, y) => ({ x: SYM_PAD + x * SYM_CELL, y: SYM_PAD + y * SYM_CELL, w: SYM_CELL, h: SYM_CELL }),
    axisLine,
    centre: point ? { cx: SYM_PAD + point.x * SYM_CELL, cy: SYM_PAD + point.y * SYM_CELL } : null,
  }
}

/** Static SVG for the worksheet: the grid, the given cells shaded, the axis (dashed) or the centre (dot). */
export const symmetryPrintSvg = (config: SymConfig): string => {
  const l = symLayout(config)
  const out: string[] = []
  const given = new Set(config.given)
  for (let y = 0; y < config.rows; y++) {
    for (let x = 0; x < config.cols; x++) {
      const r = l.cellRect(x, y)
      const fill = given.has(cellKey(x, y)) ? SYM_GIVEN_FILL : '#ffffff'
      out.push(`<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${fill}" stroke="${SYM_GRID_STROKE}" stroke-width="1"/>`)
    }
  }
  if (l.axisLine) {
    const a = l.axisLine
    out.push(`<line x1="${a.x1}" y1="${a.y1}" x2="${a.x2}" y2="${a.y2}" stroke="${SYM_AXIS_STROKE}" stroke-width="2.5" stroke-dasharray="8 5"/>`)
  }
  if (l.centre) out.push(`<circle cx="${l.centre.cx}" cy="${l.centre.cy}" r="${SYM_CENTRE_R}" fill="${SYM_AXIS_STROKE}"/>`)
  return `<svg width="${l.viewBoxW}" height="${l.viewBoxH}" viewBox="0 0 ${l.viewBoxW} ${l.viewBoxH}" xmlns="http://www.w3.org/2000/svg">${out.join('')}</svg>`
}
