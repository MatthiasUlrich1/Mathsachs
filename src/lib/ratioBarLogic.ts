/**
 * Pure logic for the interactive ratio bar (RatioBar).
 *
 * colour mode: a bar of `segments` fields; a tap cycles a field empty -> A -> B -> empty. Correct when every field is
 *   coloured and count(A) : count(B) equals the ratio (reduced).
 * split mode: the bar is already divided into `ratio[0] + ratio[1]` fields (A first, then B) and the learner types the
 *   two amounts that belong to a given total.
 * Geometry is in SVG units (viewBox), never screen pixels.
 */
import { formatDe, parseNumber } from './num'

export const RATIO_MIN_SEGMENTS = 4
export const RATIO_MAX_SEGMENTS = 12
export const RATIO_MAX_LABEL_CHARS = 12

export type RatioBarMode = 'colour' | 'split'
export type RatioPart = 'A' | 'B' | null

/** Shared layout constants (component and fit tests use the same numbers). */
export const RATIO_VIEWBOX_W = 380
export const RATIO_BAR_X = 10
export const RATIO_BAR_W = RATIO_VIEWBOX_W - 2 * RATIO_BAR_X
export const RATIO_BAR_H = 56
export const RATIO_CELL_FONT = 16
export const RATIO_LEGEND_FONT = 14
export const RATIO_TOTAL_FONT = 16
export const RATIO_SWATCH = 18
export const RATIO_FILL_A = '#fbbf24'
export const RATIO_FILL_B = '#38bdf8'

const TOTAL_BASELINE = 26
const BAR_Y_COLOUR = 10
const BAR_Y_SPLIT = 44
const LEGEND_GAP = 18
/** Width of one legend column; the second starts at the middle of the bar. */
export const RATIO_LEGEND_COL_W = RATIO_VIEWBOX_W / 2 - RATIO_BAR_X
const CHAR_W = 0.6

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b))

export const reduceRatio = (a: number, b: number): [number, number] => {
  const g = gcd(a, b) || 1
  return [a / g, b / g]
}

/** Exactly `segments` entries; anything that is not 'A' or 'B' becomes `null`. */
export const normalizeParts = (segments: number, parts: readonly RatioPart[]): RatioPart[] =>
  Array.from({ length: segments }, (_, i) => (parts[i] === 'A' || parts[i] === 'B' ? parts[i]! : null))

/** Tap on a field: empty -> A -> B -> empty. */
export const cycleRatioField = (segments: number, parts: readonly RatioPart[], index: number): RatioPart[] => {
  const cur = normalizeParts(segments, parts)
  if (!Number.isInteger(index) || index < 0 || index >= segments) return cur
  const v = cur[index]
  cur[index] = v === null ? 'A' : v === 'A' ? 'B' : null
  return cur
}

export const countRatioParts = (parts: readonly RatioPart[]): { a: number; b: number; empty: number } => {
  let a = 0
  let b = 0
  let empty = 0
  for (const p of parts) {
    if (p === 'A') a++
    else if (p === 'B') b++
    else empty++
  }
  return { a, b, empty }
}

/** Colour mode check: all fields coloured, count(A) : count(B) = ratio. */
export const ratioColourMatches = (
  segments: number,
  ratio: readonly [number, number],
  parts: readonly RatioPart[],
): boolean => {
  if (parts.length !== segments) return false
  const { a, b, empty } = countRatioParts(normalizeParts(segments, parts))
  if (empty > 0 || a === 0 || b === 0) return false
  const [ra, rb] = reduceRatio(ratio[0], ratio[1])
  const [ca, cb] = reduceRatio(a, b)
  return ca === ra && cb === rb
}

/** One valid colouring: all A fields first, then all B fields. */
export const ratioColourSolution = (segments: number, ratio: readonly [number, number]): RatioPart[] => {
  const k = segments / (ratio[0] + ratio[1])
  return Array.from({ length: segments }, (_, i): RatioPart => (i < ratio[0] * k ? 'A' : 'B'))
}

/** Split mode: the divided bar, A fields first. */
export const ratioSplitParts = (ratio: readonly [number, number]): Array<'A' | 'B'> =>
  Array.from({ length: ratio[0] + ratio[1] }, (_, i): 'A' | 'B' => (i < ratio[0] ? 'A' : 'B'))

/** The two amounts of a total split by the ratio. */
export const ratioSplitAmounts = (total: number, ratio: readonly [number, number]): [number, number] => {
  const sum = ratio[0] + ratio[1]
  return [(total * ratio[0]) / sum, (total * ratio[1]) / sum]
}

/** True when both shares are exact with at most two decimals. */
export const ratioSplitExact = (total: number, ratio: readonly [number, number]): boolean => {
  const cents = Math.round(total * 100)
  const sum = ratio[0] + ratio[1]
  return Math.abs(cents - total * 100) < 1e-6 && (cents * ratio[0]) % sum === 0 && (cents * ratio[1]) % sum === 0
}

const EPS = 1e-6

/** Split mode check: both typed amounts are right (comma decimals accepted) and add up to the total. */
export const ratioSplitMatches = (
  total: number,
  ratio: readonly [number, number],
  amounts: readonly [string, string] | undefined,
): boolean => {
  if (!amounts) return false
  const a = parseNumber(amounts[0])
  const b = parseNumber(amounts[1])
  if (a === null || b === null) return false
  const [ea, eb] = ratioSplitAmounts(total, ratio)
  return Math.abs(a - ea) < EPS && Math.abs(b - eb) < EPS && Math.abs(a + b - total) < EPS
}

export interface RatioBarCell {
  index: number
  x: number
  y: number
  w: number
  h: number
  cx: number
  /** Text baseline for the field letter. */
  textY: number
}

export interface RatioLegendItem {
  letter: 'A' | 'B'
  swatchX: number
  swatchY: number
  textX: number
  textY: number
}

export interface RatioBarLayout {
  viewBoxW: number
  viewBoxH: number
  bar: { x: number; y: number; w: number; h: number }
  cells: RatioBarCell[]
  legend: RatioLegendItem[]
  /** Baseline of the total text (split mode only). */
  totalY: number | null
}

const f = (n: number): number => Math.round(n * 100) / 100

/** `fields` = number of fields in the bar (segments or ratio sum). */
export const ratioBarLayout = (mode: RatioBarMode, fields: number): RatioBarLayout => {
  const barY = mode === 'split' ? BAR_Y_SPLIT : BAR_Y_COLOUR
  const cw = RATIO_BAR_W / fields
  const cells: RatioBarCell[] = Array.from({ length: fields }, (_, i) => ({
    index: i,
    x: f(RATIO_BAR_X + i * cw),
    y: barY,
    w: f(cw),
    h: RATIO_BAR_H,
    cx: f(RATIO_BAR_X + (i + 0.5) * cw),
    textY: f(barY + RATIO_BAR_H / 2 + RATIO_CELL_FONT * 0.35),
  }))
  const swatchY = barY + RATIO_BAR_H + LEGEND_GAP
  const legend: RatioLegendItem[] = (['A', 'B'] as const).map((letter, i) => {
    const colX = i === 0 ? RATIO_BAR_X : RATIO_VIEWBOX_W / 2
    return {
      letter,
      swatchX: colX,
      swatchY,
      textX: colX + RATIO_SWATCH + 8,
      textY: swatchY + RATIO_SWATCH / 2 + RATIO_LEGEND_FONT * 0.35,
    }
  })
  return {
    viewBoxW: RATIO_VIEWBOX_W,
    viewBoxH: swatchY + RATIO_SWATCH + 10,
    bar: { x: RATIO_BAR_X, y: barY, w: RATIO_BAR_W, h: RATIO_BAR_H },
    cells,
    legend,
    totalY: mode === 'split' ? TOTAL_BASELINE : null,
  }
}

export const ratioLegendText = (letter: 'A' | 'B', label: string): string => `${letter} = ${label}`

export const ratioTotalText = (total: number, unit: string): string =>
  `Gesamt: ${formatDe(total)}${unit ? ` ${unit}` : ''}`

export interface RatioTextExtent {
  text: string
  x: number
  y: number
  fontSize: number
  anchor: 'start' | 'middle'
  /** Maximum width the text may use (its own column / cell). */
  maxWidth: number
}

/** Every text drawn in the SVG, for fit tests. */
export const ratioBarTextExtents = (
  mode: RatioBarMode,
  fields: number,
  labels: readonly [string, string],
  total?: { value: number; unit: string },
): RatioTextExtent[] => {
  const l = ratioBarLayout(mode, fields)
  const out: RatioTextExtent[] = []
  for (const c of l.cells) {
    out.push({ text: 'B', x: c.cx, y: c.textY, fontSize: RATIO_CELL_FONT, anchor: 'middle', maxWidth: c.w })
  }
  l.legend.forEach((it, i) =>
    out.push({
      text: ratioLegendText(it.letter, labels[i]!),
      x: it.textX,
      y: it.textY,
      fontSize: RATIO_LEGEND_FONT,
      anchor: 'start',
      maxWidth: RATIO_LEGEND_COL_W - RATIO_SWATCH - 8,
    }),
  )
  if (l.totalY !== null && total) {
    out.push({
      text: ratioTotalText(total.value, total.unit),
      x: RATIO_VIEWBOX_W / 2,
      y: l.totalY,
      fontSize: RATIO_TOTAL_FONT,
      anchor: 'middle',
      maxWidth: RATIO_VIEWBOX_W - 2 * RATIO_BAR_X,
    })
  }
  return out
}

export const ratioTextWidth = (t: Pick<RatioTextExtent, 'text' | 'fontSize'>): number =>
  t.text.length * t.fontSize * CHAR_W

const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Paper figure. colour: empty bar + legend (to colour in). split: the divided bar with the total, A/B marked. */
export const ratioBarPrintSvg = (
  mode: RatioBarMode,
  fields: number,
  labels: readonly [string, string],
  ratio?: readonly [number, number],
  total?: { value: number; unit: string },
): string => {
  const l = ratioBarLayout(mode, fields)
  const split = mode === 'split' && ratio ? ratioSplitParts(ratio) : null
  const out: string[] = []
  if (l.totalY !== null && total) {
    out.push(
      `<text x="${RATIO_VIEWBOX_W / 2}" y="${l.totalY}" text-anchor="middle" font-size="${RATIO_TOTAL_FONT}" fill="#0f172a">${esc(ratioTotalText(total.value, total.unit))}</text>`,
    )
  }
  for (const c of l.cells) {
    const p = split ? split[c.index] : null
    const fill = p === 'A' ? RATIO_FILL_A : p === 'B' ? RATIO_FILL_B : '#ffffff'
    out.push(
      `<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" fill="${fill}" stroke="#334155" stroke-width="1.5"/>`,
    )
    if (p) {
      out.push(
        `<text x="${c.cx}" y="${c.textY}" text-anchor="middle" font-size="${RATIO_CELL_FONT}" fill="#0f172a">${p}</text>`,
      )
    }
  }
  l.legend.forEach((it, i) => {
    const fill = split ? (it.letter === 'A' ? RATIO_FILL_A : RATIO_FILL_B) : '#ffffff'
    out.push(
      `<rect x="${it.swatchX}" y="${it.swatchY}" width="${RATIO_SWATCH}" height="${RATIO_SWATCH}" fill="${fill}" stroke="#334155" stroke-width="1.5"/>`,
      `<text x="${it.textX}" y="${it.textY}" font-size="${RATIO_LEGEND_FONT}" fill="#0f172a">${esc(ratioLegendText(it.letter, labels[i]!))}</text>`,
    )
  })
  return `<svg width="${l.viewBoxW}" height="${l.viewBoxH}" viewBox="0 0 ${l.viewBoxW} ${l.viewBoxH}" xmlns="http://www.w3.org/2000/svg">${out.join('')}</svg>`
}
