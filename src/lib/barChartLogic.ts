/**
 * Pure maths and layout for the bar chart the learner builds (barChartTask).
 * The learner drags the top of every bar; heights snap to `step`. All coordinates are SVG units.
 */

export const BC_MIN_CATEGORIES = 2
export const BC_MAX_CATEGORIES = 6
/** Between 2 and this many steps from 0 to yMax (the grid stays dense enough to hit a line). */
export const BC_MAX_STEPS = 20
export const BC_MIN_STEPS = 2
export const BC_MAX_AXIS_LABEL_CHARS = 24
export const BC_MAX_CATEGORY_CHARS = 14

export const BC_VIEWBOX_W = 600
export const BC_VIEWBOX_H = 300
export const BC_X0 = 70
export const BC_X1 = 584
export const BC_Y_TOP = 34
export const BC_Y_BASE = 244
export const BC_TICK_FONT = 13
export const BC_TICK_LABEL_X = BC_X0 - 8
export const BC_CATEGORY_FONT = 13
export const BC_CATEGORY_Y = 272
export const BC_AXIS_LABEL_FONT = 13
export const BC_AXIS_LABEL_X = 8
export const BC_AXIS_LABEL_Y = 18
export const BC_VALUE_FONT = 13
/** Height of the grab handle on top of every bar (it also shows the current value). */
export const BC_HANDLE_H = 22
/** Radius of the invisible hit area around the handle. */
export const BC_HIT_R = 24
export const BC_BAR_MAX_W = 56

const round9 = (n: number): number => Math.round(n * 1e9) / 1e9

/** Estimated text width (same 0.6 em estimate as the other widgets). */
export const bcTextWidth = (text: string, fontSize: number): number => text.length * fontSize * 0.6

export const bcSlotWidth = (count: number): number => (BC_X1 - BC_X0) / count
export const bcBarWidth = (count: number): number => Math.min(BC_BAR_MAX_W, bcSlotWidth(count) * 0.55)
export const bcBarCentreX = (index: number, count: number): number => BC_X0 + bcSlotWidth(count) * (index + 0.5)

/** Value -> y of the bar top. */
export const bcYFromValue = (value: number, yMax: number): number => BC_Y_BASE - (value / yMax) * (BC_Y_BASE - BC_Y_TOP)

export const bcSnap = (value: number, step: number, yMax: number): number => {
  const k = Math.round(value / step)
  return round9(Math.min(yMax, Math.max(0, k * step)))
}

/** y -> value, snapped to `step` and clamped to 0..yMax. */
export const bcValueFromY = (y: number, yMax: number, step: number): number =>
  bcSnap(((BC_Y_BASE - y) / (BC_Y_BASE - BC_Y_TOP)) * yMax, step, yMax)

/** Moves a bar by `delta` steps; the result stays on the axis. */
export const bcNudge = (current: number, delta: number, step: number, yMax: number): number =>
  bcSnap(current + delta * step, step, yMax)

/** Tick values 0, step, ... yMax (index based, no float drift). */
export const bcTickValues = (yMax: number, step: number): number[] => {
  const n = Math.round(yMax / step)
  return Array.from({ length: n + 1 }, (_, i) => round9(i * step))
}

/** Numbers at every tick, or at every 2nd tick when there are more than 10 ticks. */
export const bcLabelEvery = (yMax: number, step: number): number => (bcTickValues(yMax, step).length > 10 ? 2 : 1)

export const bcLabelledTicks = (yMax: number, step: number): number[] => {
  const every = bcLabelEvery(yMax, step)
  return bcTickValues(yMax, step).filter((_, i) => i % every === 0)
}

/** German number text (decimals only when needed, at most 3). */
export const bcFormatNumber = (value: number): string => {
  for (let d = 0; d <= 3; d++) {
    if (Math.abs(value * 10 ** d - Math.round(value * 10 ** d)) < 1e-6) return value.toFixed(d).replace('.', ',')
  }
  return value.toFixed(3).replace('.', ',')
}

/** All values exact after snapping; an untouched bar (null) stays at 0. */
export const bcMatches = (
  data: readonly number[],
  values: ReadonlyArray<number | null> | undefined,
  step: number,
  yMax: number,
): boolean => {
  if (!values || values.length !== data.length) return false
  return data.every((target, i) => {
    const v = values[i] ?? 0
    return Number.isFinite(v) && Math.abs(bcSnap(v, step, yMax) - target) < 1e-9
  })
}

/** At least one bar has been moved. */
export const bcTouched = (values: ReadonlyArray<number | null> | undefined): boolean =>
  (values ?? []).some((v) => typeof v === 'number' && Number.isFinite(v))

/** A category label has to fit under its bar (inside its slot). */
export const bcCategoryFits = (label: string, count: number): boolean =>
  bcTextWidth(label, BC_CATEGORY_FONT) <= bcSlotWidth(count) - 8

export interface BcTextExtent {
  text: string
  fontSize: number
  x: number
  y: number
  anchor: 'start' | 'middle' | 'end'
}

/** Every text of the chart frame (numbers, categories, axis title), for the viewBox fit test. */
export const bcTextExtents = (categories: readonly string[], yMax: number, step: number, axisLabel: string): BcTextExtent[] => {
  const out: BcTextExtent[] = bcLabelledTicks(yMax, step).map((v) => ({
    text: bcFormatNumber(v),
    fontSize: BC_TICK_FONT,
    x: BC_TICK_LABEL_X,
    y: bcYFromValue(v, yMax) + 4,
    anchor: 'end',
  }))
  categories.forEach((text, i) =>
    out.push({ text, fontSize: BC_CATEGORY_FONT, x: bcBarCentreX(i, categories.length), y: BC_CATEGORY_Y, anchor: 'middle' }),
  )
  if (axisLabel) out.push({ text: axisLabel, fontSize: BC_AXIS_LABEL_FONT, x: BC_AXIS_LABEL_X, y: BC_AXIS_LABEL_Y, anchor: 'start' })
  return out
}

/** Whether the estimated text box lies inside the viewBox. */
export const bcExtentFits = (e: BcTextExtent): boolean => {
  const w = bcTextWidth(e.text, e.fontSize)
  const left = e.anchor === 'start' ? e.x : e.anchor === 'middle' ? e.x - w / 2 : e.x - w
  return left >= 0 && left + w <= BC_VIEWBOX_W && e.y - e.fontSize >= 0 && e.y + e.fontSize * 0.25 <= BC_VIEWBOX_H
}

const fail = (msg: string): never => {
  throw new Error(`barChartTask: ${msg}`)
}

/** Axis rules only (categories, y-axis, title); the worksheet frame needs no data. Throws a descriptive error. */
export const bcValidateAxis = (categories: readonly string[], yMax: number, step: number, axisLabel: string): void => {
  if (!Array.isArray(categories) || categories.length < BC_MIN_CATEGORIES || categories.length > BC_MAX_CATEGORIES) {
    fail(`need ${BC_MIN_CATEGORIES}..${BC_MAX_CATEGORIES} categories`)
  }
  if (new Set(categories.map((c) => c.trim())).size !== categories.length) fail('category names must differ')
  for (const c of categories) {
    if (typeof c !== 'string' || c.trim() === '' || c.length > BC_MAX_CATEGORY_CHARS) {
      fail(`category needs 1..${BC_MAX_CATEGORY_CHARS} characters, got ${JSON.stringify(c)}`)
    }
    if (!bcCategoryFits(c, categories.length)) fail(`category ${JSON.stringify(c)} does not fit under its bar`)
  }
  if (![yMax, step].every(Number.isFinite) || !(step > 0) || !(yMax > 0)) fail(`need yMax > 0 and step > 0, got ${yMax}, ${step}`)
  const steps = yMax / step
  if (Math.abs(steps - Math.round(steps)) > 1e-6) fail(`yMax (${yMax}) must be a multiple of step (${step})`)
  if (Math.round(steps) < BC_MIN_STEPS || Math.round(steps) > BC_MAX_STEPS) {
    fail(`yMax / step must be ${BC_MIN_STEPS}..${BC_MAX_STEPS}, got ${Math.round(steps)}`)
  }
  if (axisLabel.length > BC_MAX_AXIS_LABEL_CHARS) fail(`axis label has at most ${BC_MAX_AXIS_LABEL_CHARS} characters`)
}

/** Full input check of the helper: axis rules plus the data (one value per category, on the grid, not all zero). */
export const bcValidate = (categories: readonly string[], data: readonly number[], yMax: number, step: number, axisLabel: string): void => {
  if (!Array.isArray(data) || !Array.isArray(categories) || data.length !== categories.length) fail('data needs one value per category')
  bcValidateAxis(categories, yMax, step, axisLabel)
  for (const v of data) {
    if (!Number.isFinite(v) || v < 0 || v > yMax + 1e-9) fail(`value ${v} is outside 0..${yMax}`)
    const k = v / step
    if (Math.abs(k - Math.round(k)) > 1e-6) fail(`value ${v} is not a multiple of step (${step})`)
  }
  if (data.every((v) => v === 0)) fail('data must not be all zero (an untouched chart would already be the answer)')
}

const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Empty axis frame for the worksheet: grid, numbers, axes and category names; the bars are drawn by hand. */
export const barChartPrintSvg = (categories: readonly string[], yMax: number, step: number, axisLabel: string): string => {
  const out: string[] = []
  const labelled = new Set(bcLabelledTicks(yMax, step))
  for (const v of bcTickValues(yMax, step)) {
    const y = bcYFromValue(v, yMax)
    out.push(
      `<line x1="${BC_X0}" y1="${y}" x2="${BC_X1}" y2="${y}" stroke="${v === 0 ? '#0f172a' : '#94a3b8'}" stroke-width="${v === 0 ? 2 : 1}"/>`,
    )
    if (labelled.has(v)) {
      out.push(`<text x="${BC_TICK_LABEL_X}" y="${y + 4}" text-anchor="end" font-size="${BC_TICK_FONT}" fill="#0f172a">${esc(bcFormatNumber(v))}</text>`)
    }
  }
  out.push(`<line x1="${BC_X0}" y1="${BC_Y_TOP - 6}" x2="${BC_X0}" y2="${BC_Y_BASE}" stroke="#0f172a" stroke-width="2"/>`)
  categories.forEach((c, i) => {
    out.push(
      `<text x="${bcBarCentreX(i, categories.length)}" y="${BC_CATEGORY_Y}" text-anchor="middle" font-size="${BC_CATEGORY_FONT}" fill="#0f172a">${esc(c)}</text>`,
    )
  })
  if (axisLabel) {
    out.push(`<text x="${BC_AXIS_LABEL_X}" y="${BC_AXIS_LABEL_Y}" font-size="${BC_AXIS_LABEL_FONT}" fill="#0f172a">${esc(axisLabel)}</text>`)
  }
  return `<svg width="${BC_VIEWBOX_W}" height="${BC_VIEWBOX_H}" viewBox="0 0 ${BC_VIEWBOX_W} ${BC_VIEWBOX_H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Leeres Achsenkreuz für das Säulendiagramm">${out.join('')}</svg>`
}

// ---------------------------------------------------------------------------
// Data sources shown with the question (tally sheet / frequency table)
// ---------------------------------------------------------------------------

export const BC_SOURCE_W = 520
export const BC_SOURCE_FONT = 15
export const BC_SOURCE_TEXT_X = 12
export const BC_SOURCE_ROW_H = 34
export const BC_SOURCE_HEAD_H = 36
export const BC_SOURCE_COL2_X = 300
/** x where the tally marks start, and the width one group of five takes. */
export const BC_TALLY_X = 170
export const BC_TALLY_GROUP_W = 38
export const BC_TALLY_LINE_GAP = 7

const fitsRight = (text: string, right: number): boolean => BC_SOURCE_TEXT_X + bcTextWidth(text, BC_SOURCE_FONT) <= right

/** Whether all texts and tally marks of a source figure stay inside it and in their columns. */
export const bcSourceFits = (head: string, labels: readonly string[], counts: readonly number[], mode: 'tally' | 'table'): boolean => {
  if (!fitsRight(head, BC_SOURCE_W - 8)) return false
  const labelRight = mode === 'tally' ? BC_TALLY_X - 12 : BC_SOURCE_COL2_X - 12
  if (!labels.every((l) => fitsRight(l, labelRight))) return false
  return mode === 'table' || counts.every((c) => BC_TALLY_X + Math.ceil(c / 5) * BC_TALLY_GROUP_W <= BC_SOURCE_W - 8)
}

const sourceFrame = (rows: number, body: string): string => {
  const h = BC_SOURCE_HEAD_H + rows * BC_SOURCE_ROW_H + 8
  return `<svg width="100%" style="max-width:${BC_SOURCE_W}px" viewBox="0 0 ${BC_SOURCE_W} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Umfrageergebnisse">${body}</svg>`
}

const headText = (head: string): string =>
  `<text x="${BC_SOURCE_TEXT_X}" y="24" font-size="${BC_SOURCE_FONT}" font-weight="700" fill="#0f172a">${esc(head)}</text>`

/** Tally sheet ("Strichliste"): groups of five (four strokes and one crossing). The learner counts. */
export const barChartTallySvg = (head: string, labels: readonly string[], counts: readonly number[]): string => {
  const out: string[] = [headText(head)]
  labels.forEach((label, i) => {
    const yMid = BC_SOURCE_HEAD_H + i * BC_SOURCE_ROW_H + BC_SOURCE_ROW_H / 2
    out.push(
      `<line x1="4" y1="${yMid + BC_SOURCE_ROW_H / 2}" x2="${BC_SOURCE_W - 4}" y2="${yMid + BC_SOURCE_ROW_H / 2}" stroke="#cbd5e1" stroke-width="1"/>`,
      `<text x="${BC_SOURCE_TEXT_X}" y="${yMid + 5}" font-size="${BC_SOURCE_FONT}" fill="#0f172a">${esc(label)}</text>`,
    )
    const n = counts[i] ?? 0
    for (let g = 0; g * 5 < n; g++) {
      const inGroup = Math.min(5, n - g * 5)
      const gx = BC_TALLY_X + g * BC_TALLY_GROUP_W
      for (let s = 0; s < Math.min(4, inGroup); s++) {
        const x = gx + s * BC_TALLY_LINE_GAP
        out.push(`<line x1="${x}" y1="${yMid - 11}" x2="${x}" y2="${yMid + 11}" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>`)
      }
      if (inGroup === 5) {
        out.push(
          `<line x1="${gx - 5}" y1="${yMid + 8}" x2="${gx + 3 * BC_TALLY_LINE_GAP + 5}" y2="${yMid - 8}" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>`,
        )
      }
    }
  })
  return sourceFrame(labels.length, out.join(''))
}

/** Two-column frequency table with the numbers written out. */
export const barChartTableSvg = (
  head: string,
  colLeft: string,
  colRight: string,
  labels: readonly string[],
  counts: readonly number[],
): string => {
  const out: string[] = [headText(head)]
  const left = [colLeft, ...labels]
  const right = [colRight, ...counts.map((c) => String(c))]
  left.forEach((text, i) => {
    const yMid = BC_SOURCE_HEAD_H + i * BC_SOURCE_ROW_H + BC_SOURCE_ROW_H / 2
    const bold = i === 0
    const weight = bold ? 'font-weight="700" ' : ''
    out.push(
      `<line x1="4" y1="${yMid + BC_SOURCE_ROW_H / 2}" x2="${BC_SOURCE_W - 4}" y2="${yMid + BC_SOURCE_ROW_H / 2}" stroke="${bold ? '#0f172a' : '#cbd5e1'}" stroke-width="${bold ? 2 : 1}"/>`,
      `<text x="${BC_SOURCE_TEXT_X}" y="${yMid + 5}" font-size="${BC_SOURCE_FONT}" ${weight}fill="#0f172a">${esc(text)}</text>`,
      `<text x="${BC_SOURCE_COL2_X}" y="${yMid + 5}" font-size="${BC_SOURCE_FONT}" ${weight}fill="#0f172a">${esc(right[i] ?? '')}</text>`,
    )
  })
  return sourceFrame(left.length, out.join(''))
}
