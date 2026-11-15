/**
 * Pure logic for the interactive fraction wall (FractionWall).
 * Row d has d tiles of width 1/d. Geometry is in SVG units (viewBox), never screen pixels.
 */
export const FRACTION_WALL_MAX_ROW = 12
export const FRACTION_WALL_DEFAULT_ROWS: readonly number[] = [1, 2, 3, 4, 5, 6, 8, 10, 12]

export type FractionWallMode = 'equivalent' | 'compare'

export interface FractionWallFraction {
  num: number
  den: number
}

/** `count` tiles from the left edge are selected in the row with `row` tiles. */
export interface FractionWallSelection {
  row: number
  count: number
}

export const FRACTION_WALL_VIEWBOX_W = 380
const WALL = { x: 56, w: 300, top: 50, rowH: 26, gap: 4 } as const
const HANDLE_R = 9
const HANDLE_Y = 26
/** Invisible hit area around the handle (about 44 px at 375 px width). */
const HANDLE_HIT_R = 22

export const fractionWallViewBoxH = (rowCount: number): number =>
  WALL.top + rowCount * (WALL.rowH + WALL.gap) + 4

const isValidRow = (rows: readonly number[], row: number): boolean => rows.includes(row)

/** Valid rows only (row shown, 1..row tiles), one entry per row (last wins), sorted by row. */
export const normalizeWallSelection = (
  rows: readonly number[],
  selected: readonly FractionWallSelection[],
): FractionWallSelection[] => {
  const byRow = new Map<number, number>()
  for (const s of selected) {
    if (isValidRow(rows, s.row) && Number.isInteger(s.count) && s.count >= 1 && s.count <= s.row) {
      byRow.set(s.row, s.count)
    }
  }
  return [...byRow.entries()].sort((a, b) => a[0] - b[0]).map(([row, count]) => ({ row, count }))
}

/**
 * Tap on tile `index` (0-based) of `row`: select the run 0..index. Tapping the end of the
 * current run again shrinks it by one tile. In `single` mode the new run replaces everything else.
 */
export const toggleWallTile = (
  rows: readonly number[],
  selected: readonly FractionWallSelection[],
  row: number,
  index: number,
  single: boolean,
): FractionWallSelection[] => {
  if (!isValidRow(rows, row) || !Number.isInteger(index) || index < 0 || index >= row) {
    return normalizeWallSelection(rows, selected)
  }
  const cur = normalizeWallSelection(rows, selected)
  const old = cur.find((s) => s.row === row)?.count ?? 0
  const next = old === index + 1 ? index : index + 1
  const base = single ? [] : cur.filter((s) => s.row !== row)
  return normalizeWallSelection(rows, next > 0 ? [...base, { row, count: next }] : base)
}

export const wallFractionsEqual = (a: FractionWallFraction, b: FractionWallFraction): boolean =>
  a.num * b.den === b.num * a.den

/** Rows (other than the reference row) in which `target` can be shown with whole tiles. */
export const equivalentWallRows = (
  rows: readonly number[],
  target: FractionWallFraction,
  referenceRow: number = target.den,
): number[] => rows.filter((r) => r !== referenceRow && (target.num * r) % target.den === 0)

/** The selection that solves an `equivalent` task. */
export const equivalentWallSolution = (
  rows: readonly number[],
  target: FractionWallFraction,
): FractionWallSelection[] =>
  equivalentWallRows(rows, target).map((row) => ({ row, count: (target.num * row) / target.den }))

/**
 * `equivalent`: every row with a tile run exactly as long as the target is selected with that
 * run, and nothing else (the reference row of the target itself is given, not part of the answer).
 */
export const wallEquivalentMatches = (
  rows: readonly number[],
  selected: readonly FractionWallSelection[],
  target: FractionWallFraction,
): boolean => {
  const cur = normalizeWallSelection(rows, selected)
  // Invalid or duplicate entries count as wrong selections.
  if (cur.length !== selected.length) return false
  const want = equivalentWallSolution(rows, target)
  return (
    cur.length === want.length &&
    want.every((w) => cur.some((c) => c.row === w.row && c.count === w.count))
  )
}

/** `compare`: exactly one run is selected and it is as long as the larger fraction. */
export const wallCompareMatches = (
  rows: readonly number[],
  selected: readonly FractionWallSelection[],
  a: FractionWallFraction,
  b: FractionWallFraction,
): boolean => {
  const cur = normalizeWallSelection(rows, selected)
  if (cur.length !== 1 || selected.length !== 1) return false
  const larger = a.num * b.den > b.num * a.den ? a : b
  const s = cur[0]!
  return s.count * larger.den === larger.num * s.row
}

export interface FractionWallTile {
  index: number
  x: number
  w: number
}

export interface FractionWallRowLayout {
  row: number
  y: number
  h: number
  /** x of the row label (right aligned). */
  labelX: number
  tiles: FractionWallTile[]
}

const f = (n: number) => Math.round(n * 100) / 100

export const fractionWallLayout = (rows: readonly number[]): FractionWallRowLayout[] =>
  rows.map((row, i) => ({
    row,
    y: WALL.top + i * (WALL.rowH + WALL.gap),
    h: WALL.rowH,
    labelX: WALL.x - 6,
    tiles: Array.from({ length: row }, (_, index) => ({
      index,
      x: f(WALL.x + (index * WALL.w) / row),
      w: f(WALL.w / row),
    })),
  }))

export const FRACTION_WALL_LINE_STEP = 1 / 24
export const clampLinePos = (pos: number): number => Math.min(1, Math.max(0, Number.isFinite(pos) ? pos : 0))

/** SVG x of the comparison line for a position 0..1. */
export const wallLineX = (pos: number): number => f(WALL.x + clampLinePos(pos) * WALL.w)

/**
 * Line position (0..1) for a pointer at `clientX`. `grabOffset` (SVG units, pointer minus line x
 * at grab time) keeps the handle from jumping under the finger.
 */
export const linePosFromClientX = (
  clientX: number,
  rectLeft: number,
  rectWidth: number,
  grabOffset = 0,
): number => {
  if (!(rectWidth > 0)) return 0
  const svgX = ((clientX - rectLeft) * FRACTION_WALL_VIEWBOX_W) / rectWidth
  return clampLinePos((svgX - grabOffset - WALL.x) / WALL.w)
}

/** Bounding box of the line handle in SVG units. */
export const wallHandleBounds = (pos: number): { x: number; y: number; w: number; h: number } => ({
  x: wallLineX(pos) - HANDLE_HIT_R,
  y: HANDLE_Y - HANDLE_HIT_R,
  w: 2 * HANDLE_HIT_R,
  h: 2 * HANDLE_HIT_R,
})
export const FRACTION_WALL_HANDLE = { r: HANDLE_R, hitR: HANDLE_HIT_R, y: HANDLE_Y } as const
export const fractionWallLineSpan = (rowCount: number): { y1: number; y2: number } => ({
  y1: HANDLE_Y + HANDLE_R,
  y2: fractionWallViewBoxH(rowCount) - 2,
})

/** Printable empty wall (paper): tile outlines and row labels; the reference run is shaded grey. */
export const fractionWallPrintSvg = (
  rows: readonly number[],
  reference?: FractionWallFraction,
): string => {
  const layout = fractionWallLayout(rows)
  const h = fractionWallViewBoxH(rows.length) - WALL.top + 8
  const shift = WALL.top - 4
  const parts: string[] = []
  for (const r of layout) {
    const y = r.y - shift
    parts.push(
      `<text x="${r.labelX}" y="${f(y + r.h / 2 + 4)}" text-anchor="end" font-size="12" fill="#0f172a">${r.row === 1 ? "Ganzes" : `1/${r.row}`}</text>`,
    )
    const shaded = reference && r.row === reference.den ? reference.num : 0
    for (const t of r.tiles) {
      parts.push(
        `<rect x="${t.x}" y="${y}" width="${t.w}" height="${r.h}" fill="${t.index < shaded ? '#94a3b8' : '#ffffff'}" stroke="#334155" stroke-width="1.5"/>`,
      )
    }
  }
  return `<svg width="${FRACTION_WALL_VIEWBOX_W}" height="${h}" viewBox="0 0 ${FRACTION_WALL_VIEWBOX_W} ${h}" xmlns="http://www.w3.org/2000/svg">${parts.join('')}</svg>`
}
