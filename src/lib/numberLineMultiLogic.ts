/**
 * Pure maths and layout for the multi-label number line (numberLineMultiTask).
 * Several labels are dragged from a tray onto a number line. All coordinates are SVG units.
 */

export const NLM_MAX_ITEMS = 5
export const NLM_MIN_ITEMS = 2
/** Longest label that still fits a chip (see `nlmChipTextFits`). */
export const NLM_MAX_LABEL_CHARS = 7
export const NLM_MAX_TICKS = 41

export const NLM_VIEWBOX_W = 600
export const NLM_VIEWBOX_H = 240
export const NLM_LINE_X0 = 50
export const NLM_LINE_X1 = 550
export const NLM_LINE_Y = 180
export const NLM_CHIP_W = 92
export const NLM_CHIP_H = 34
export const NLM_CHIP_FONT = 18
export const NLM_TICK_FONT = 15
export const NLM_TICK_LABEL_Y = NLM_LINE_Y + 30
/** Centre height of the tray row. */
export const NLM_TRAY_Y = 30
/** Centre heights of the two rows of placed labels (alternating, so neighbours rarely overlap). */
export const NLM_ROW_Y = [88, 132] as const
/** A dragged label whose centre is above this height goes back to the tray. */
export const NLM_TRAY_ZONE_Y = 60
export const NLM_SLOT_GAP = 10

const round9 = (n: number): number => Math.round(n * 1e9) / 1e9
const EPS = 1e-9

/** Value -> x on the line. */
export const nlmXFromValue = (value: number, min: number, max: number): number =>
  NLM_LINE_X0 + ((value - min) / (max - min)) * (NLM_LINE_X1 - NLM_LINE_X0)

/** x -> value, clamped to the line (not snapped). */
export const nlmValueFromX = (x: number, min: number, max: number): number => {
  const t = (x - NLM_LINE_X0) / (NLM_LINE_X1 - NLM_LINE_X0)
  return min + Math.min(1, Math.max(0, t)) * (max - min)
}

/** Snaps to the `snap` grid starting at `min` and clamps to [min, max]. */
export const nlmSnap = (value: number, min: number, max: number, snap: number): number => {
  const k = Math.round((value - min) / snap)
  return round9(Math.min(max, Math.max(min, min + k * snap)))
}

/** Tick values from min to max in steps of `step` (index based, no float drift). */
export const nlmTickValues = (min: number, max: number, step: number): number[] => {
  const n = Math.round((max - min) / step)
  return Array.from({ length: n + 1 }, (_, i) => round9(min + i * step))
}

/** Default: write every tick if there are at most 10 ticks, otherwise every 2nd one. */
export const nlmDefaultLabelEvery = (min: number, max: number, step: number): number =>
  nlmTickValues(min, max, step).length <= 10 ? 1 : 2

/** Tick values that get a number: min, max and every `labelEvery`-th tick. */
export const nlmLabelledTicks = (min: number, max: number, step: number, labelEvery: number): number[] => {
  const ticks = nlmTickValues(min, max, step)
  return ticks.filter((_, i) => i === 0 || i === ticks.length - 1 || i % labelEvery === 0)
}

/** German number text with only the decimals the value needs (0, 0,5, 1, -1,25; at most 3). */
export const nlmFormatTick = (value: number): string => {
  for (let d = 0; d <= 3; d++) {
    if (Math.abs(value * 10 ** d - Math.round(value * 10 ** d)) < 1e-6) return value.toFixed(d).replace('.', ',')
  }
  return value.toFixed(3).replace('.', ',')
}

export interface NlmItem {
  id: string
  label: string
  value: number
}

/** Only labels that were placed have a position. */
export const nlmMatches = (
  items: readonly NlmItem[],
  positions: Record<string, number> | undefined,
  tolerance: number,
): boolean => {
  if (!positions) return false
  return items.every((it) => {
    const p = positions[it.id]
    return typeof p === 'number' && Number.isFinite(p) && Math.abs(p - it.value) <= tolerance + EPS
  })
}

export const nlmSolution = (items: readonly NlmItem[]): Record<string, number> =>
  Object.fromEntries(items.map((it) => [it.id, it.value]))

/** Moves a label by `delta` snap steps; the result stays on the line. */
export const nlmNudge = (current: number, delta: number, min: number, max: number, snap: number): number =>
  nlmSnap(current + delta * snap, min, max, snap)

/** Deterministic Fisher-Yates (mulberry32) so the tray order is stable per task. */
export const nlmShuffle = <T>(list: readonly T[], seed: number): T[] => {
  const out = [...list]
  let s = seed >>> 0
  const rand = (): number => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    const a = out[i] as T
    out[i] = out[j] as T
    out[j] = a
  }
  return out
}

/**
 * Tray order for the ids: shuffled, but never already sorted by value (that would be the
 * solution). Rotation keeps it deterministic.
 */
export const nlmTrayOrder = (items: readonly NlmItem[], seed: number): string[] => {
  const byValue = [...items].sort((a, b) => a.value - b.value).map((i) => i.id)
  const asc = byValue.join('|')
  const desc = [...byValue].reverse().join('|')
  let order = nlmShuffle(
    items.map((i) => i.id),
    seed,
  )
  for (let k = 0; k < order.length; k++) {
    const key = order.join('|')
    if (key !== asc && (order.length < 3 || key !== desc)) break
    order = [...order.slice(1), order[0] as string]
  }
  return order
}

/** Centre x of tray slot `i` of `n`. */
export const nlmSlotX = (i: number, n: number): number => {
  const total = n * NLM_CHIP_W + (n - 1) * NLM_SLOT_GAP
  return (NLM_VIEWBOX_W - total) / 2 + NLM_CHIP_W / 2 + i * (NLM_CHIP_W + NLM_SLOT_GAP)
}

/**
 * Row height of every placed label: ranked by position along the line and alternating between the
 * two rows, so neighbours never share a row. Equal positions rank by item order.
 */
export const nlmRowsByRank = (ids: readonly string[], positions: Record<string, number>): Record<string, number> => {
  const placed = ids
    .map((id, index) => ({ id, index, pos: positions[id] }))
    .filter((p): p is { id: string; index: number; pos: number } => typeof p.pos === 'number')
    .sort((a, b) => a.pos - b.pos || a.index - b.index)
  return Object.fromEntries(placed.map((p, rank) => [p.id, NLM_ROW_Y[rank % 2] as number]))
}

/** State after a drag ended (pointer up, cancel or lost capture): nothing is grabbed any more. */
export const nlmEndDrag = (): { grab: null; drag: null } => ({ grab: null, drag: null })

/** Chip centre kept fully inside the viewBox and above the line. */
export const nlmClampChip = (cx: number, cy: number): { cx: number; cy: number } => ({
  cx: Math.min(NLM_VIEWBOX_W - NLM_CHIP_W / 2, Math.max(NLM_CHIP_W / 2, cx)),
  cy: Math.min(NLM_LINE_Y - NLM_CHIP_H / 2 - 4, Math.max(NLM_CHIP_H / 2, cy)),
})

/** Estimated text width (same 0.6 em estimate as the other widgets). */
export const nlmTextWidth = (text: string, fontSize: number): number => text.length * fontSize * 0.6

export const nlmChipTextFits = (label: string): boolean => nlmTextWidth(label, NLM_CHIP_FONT) <= NLM_CHIP_W - 12

export interface NlmTextExtent {
  text: string
  fontSize: number
  x: number
  y: number
}

/** Every text on the line (tick numbers) and in the tray chips, for the viewBox fit test. */
export const nlmTextExtents = (
  min: number,
  max: number,
  step: number,
  labelEvery: number,
  labels: readonly string[],
): NlmTextExtent[] => {
  const out: NlmTextExtent[] = nlmLabelledTicks(min, max, step, labelEvery).map((v) => ({
    text: nlmFormatTick(v),
    fontSize: NLM_TICK_FONT,
    x: nlmXFromValue(v, min, max),
    y: NLM_TICK_LABEL_Y,
  }))
  labels.forEach((text, i) => out.push({ text, fontSize: NLM_CHIP_FONT, x: nlmSlotX(i, labels.length), y: NLM_TRAY_Y }))
  return out
}

const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Empty number line for the worksheet: line, ticks and numbers at min, max and every labelEvery tick. */
export const numberLineMultiPrintSvg = (min: number, max: number, step: number, labelEvery: number): string => {
  const out: string[] = [
    `<line x1="${NLM_LINE_X0}" y1="${NLM_LINE_Y}" x2="${NLM_LINE_X1}" y2="${NLM_LINE_Y}" stroke="#0f172a" stroke-width="2"/>`,
  ]
  const labelled = new Set(nlmLabelledTicks(min, max, step, labelEvery))
  for (const v of nlmTickValues(min, max, step)) {
    const x = nlmXFromValue(v, min, max)
    const major = labelled.has(v)
    const h = major ? 12 : 7
    out.push(
      `<line x1="${x}" y1="${NLM_LINE_Y - h}" x2="${x}" y2="${NLM_LINE_Y + h}" stroke="#0f172a" stroke-width="${major ? 2 : 1.5}"/>`,
    )
    if (major) {
      out.push(
        `<text x="${x}" y="${NLM_TICK_LABEL_Y}" text-anchor="middle" font-size="${NLM_TICK_FONT}" fill="#0f172a">${esc(nlmFormatTick(v))}</text>`,
      )
    }
  }
  return `<svg width="${NLM_VIEWBOX_W}" height="110" viewBox="0 130 ${NLM_VIEWBOX_W} 110" xmlns="http://www.w3.org/2000/svg">${out.join('')}</svg>`
}
