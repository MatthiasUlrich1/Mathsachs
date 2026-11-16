/**
 * Pure maths and layout for the pie chart the learner builds (pieChartTask).
 * The learner drags the boundaries between the sectors around the circle; they snap to `snapPercent`.
 * Positions are percents of the full circle measured clockwise from 12 o'clock (100 % = 360 degrees).
 * All coordinates are SVG units.
 */

export const PC_MIN_CATEGORIES = 2
export const PC_MAX_CATEGORIES = 5
export const PC_MAX_CATEGORY_CHARS = 14
export const PC_DEFAULT_SNAP = 5
/** Snap values that divide 100 evenly and keep the handles usable. */
export const PC_ALLOWED_SNAPS: readonly number[] = [1, 2, 4, 5, 10]

export const PC_VIEWBOX_W = 600
export const PC_VIEWBOX_H = 340
export const PC_CX = 170
export const PC_CY = 170
export const PC_R = 120
/** Visible knob on the circle edge. */
export const PC_HANDLE_R = 11
/** Radius of the invisible hit area around a knob (at least 22 units). */
export const PC_HIT_R = 22
export const PC_LABEL_FONT = 14
/** Radius on which the percent text of a sector is centred. */
export const PC_LABEL_R = 80
export const PC_LABEL_PAD = 8
/** Radius on which the category tag sits, just outside the circle. */
export const PC_TAG_R = PC_R + 22
export const PC_TAG_FONT = 14
export const PC_TAG_MAX_CHARS = 3

export const PC_LEGEND_X = 340
export const PC_LEGEND_SWATCH = 16
export const PC_LEGEND_NAME_X = 366
export const PC_LEGEND_RIGHT = 592
export const PC_LEGEND_FONT = 15
export const PC_LEGEND_ROW_H = 34

/** Print ring: tick lengths and the font of the 10 % labels. */
export const PC_TICK_SHORT = 8
export const PC_TICK_LONG = 14
export const PC_RING_FONT = 12
export const PC_RING_LABEL_R = PC_R + 26

export const PC_COLORS: readonly string[] = ['#93c5fd', '#fcd34d', '#86efac', '#f9a8d4', '#c4b5fd']
export const PC_STROKES: readonly string[] = ['#1d4ed8', '#b45309', '#15803d', '#be185d', '#6d28d9']

const round9 = (n: number): number => Math.round(n * 1e9) / 1e9

/** Estimated text width (same 0.6 em estimate as the other widgets). */
export const pcTextWidth = (text: string, fontSize: number): number => text.length * fontSize * 0.6

export const pcPercentText = (percent: number): string => `${Math.round(percent * 100) / 100}`.replace('.', ',') + ' %'

/** Angle of a percent position in degrees, clockwise from 12 o'clock. */
export const pcAngle = (percent: number): number => percent * 3.6

export const pcPoint = (percent: number, radius: number): { x: number; y: number } => {
  const a = (pcAngle(percent) * Math.PI) / 180
  return { x: round9(PC_CX + radius * Math.sin(a)), y: round9(PC_CY - radius * Math.cos(a)) }
}

/** Pointer position (SVG units) -> percent position 0..100 around the centre. */
export const pcPointerPercent = (x: number, y: number): number => {
  const deg = (Math.atan2(x - PC_CX, -(y - PC_CY)) * 180) / Math.PI
  return (((deg % 360) + 360) % 360) / 3.6
}

export const pcSnap = (value: number, snap: number): number => round9(Math.round(value / snap) * snap)

/** Equal shares on the snap grid, the remainder goes to the last sector. Depends on the number of categories only. */
export const pcStartPercents = (count: number, snap: number): number[] => {
  const base = Math.max(snap, Math.floor(100 / count / snap + 1e-9) * snap)
  const out = Array.from({ length: count }, () => base)
  out[count - 1] = round9(100 - base * (count - 1))
  return out
}

/** Cumulative boundaries 0, b1, ..., 100 (length = sectors + 1). */
export const pcBoundaries = (percents: readonly number[]): number[] => {
  const out = [0]
  for (const p of percents) out.push(round9(out[out.length - 1]! + p))
  return out
}

export const pcFromBoundaries = (bounds: readonly number[]): number[] => bounds.slice(1).map((b, i) => round9(b - bounds[i]!))

/** Allowed range of boundary `index` (1..k-1): every sector keeps at least one snap step. */
export const pcBoundaryRange = (percents: readonly number[], index: number, snap: number): { lo: number; hi: number } => {
  const b = pcBoundaries(percents)
  return { lo: round9(b[index - 1]! + snap), hi: round9(b[index + 1]! - snap) }
}

/** Moves boundary `index` (1..k-1) to `target` percent: snapped and kept between its neighbours. */
export const pcMoveBoundary = (percents: readonly number[], index: number, target: number, snap: number): number[] => {
  const { lo, hi } = pcBoundaryRange(percents, index, snap)
  const next = Math.min(hi, Math.max(lo, pcSnap(target, snap)))
  const b = pcBoundaries(percents)
  b[index] = round9(next)
  return pcFromBoundaries(b)
}

/** Shortest way around the circle: a difference in percent wrapped into -50..50. */
export const pcWrapDelta = (diff: number): number => {
  const d = ((((diff + 50) % 100) + 100) % 100) - 50
  return d === -50 ? 50 : d
}

/**
 * Where the dragged boundary should go: the pointer position plus the grab offset, taken on the side of the circle
 * nearest to the current boundary (so crossing 12 o'clock does not make the knob jump around the circle).
 */
export const pcDragTarget = (current: number, pointerPercent: number, grabOffset: number): number =>
  current + pcWrapDelta(pointerPercent + grabOffset - current)

/** Nudges boundary `index` by `delta` snap steps. */
export const pcNudge = (percents: readonly number[], index: number, delta: number, snap: number): number[] =>
  pcMoveBoundary(percents, index, pcBoundaries(percents)[index]! + delta * snap, snap)

/** Index (1..k-1) of the knob nearest to a pointer position within the hit radius, or null. */
export const pcNearestHandle = (percents: readonly number[], x: number, y: number): number | null => {
  const b = pcBoundaries(percents)
  let best: number | null = null
  let bestD = PC_HIT_R
  for (let i = 1; i < percents.length; i++) {
    const p = pcPoint(b[i]!, PC_R)
    const d = Math.hypot(p.x - x, p.y - y)
    if (d <= bestD) {
      best = i
      bestD = d
    }
  }
  return best
}

/** Shares are within the tolerance of the targets and add up to 100 (an untouched chart shows the start shares). */
export const pcMatches = (
  target: readonly number[],
  percents: readonly number[] | null | undefined,
  start: readonly number[],
  tolerance: number,
): boolean => {
  const shown = percents ?? start
  if (!Array.isArray(shown) || shown.length !== target.length) return false
  if (!shown.every((p) => Number.isFinite(p))) return false
  if (Math.abs(shown.reduce((s, p) => s + p, 0) - 100) > 1e-6) return false
  return target.every((t, i) => Math.abs(shown[i]! - t) <= tolerance + 1e-9)
}

/** The chart has been moved at least once. */
export const pcTouched = (percents: readonly number[] | null | undefined): boolean =>
  Array.isArray(percents) && percents.length > 0 && percents.every((p) => Number.isFinite(p))

/** Whether the percent text fits inside its sector (along the arc through the label centre). */
export const pcSectorLabelFits = (percent: number): boolean =>
  ((pcAngle(percent) * Math.PI) / 180) * PC_LABEL_R >= pcTextWidth(pcPercentText(percent), PC_LABEL_FONT) + PC_LABEL_PAD

/**
 * Short tag per category for the direct label next to its sector: the shortest prefix of the name
 * (1..PC_TAG_MAX_CHARS characters) that no other category shares; falls back to initial + number.
 */
export const pcSectorTags = (categories: readonly string[]): string[] =>
  categories.map((name, i) => {
    const n = name.trim()
    for (let len = 1; len <= Math.min(PC_TAG_MAX_CHARS, n.length); len++) {
      const tag = n.slice(0, len)
      const clash = categories.some((o, j) => j !== i && o.trim().slice(0, len).toLowerCase() === tag.toLowerCase())
      if (!clash) return tag
    }
    return `${n.slice(0, 1)}${i + 1}`
  })

/** Minimum free space (SVG units) between a sector tag and the circle or a boundary knob. */
export const PC_TAG_CLEARANCE = 4

export interface PcTagPlacement {
  tag: string
  x: number
  y: number
  w: number
  h: number
  /** false for a 0 % sector or when the tag would come closer than PC_TAG_CLEARANCE to a knob. */
  visible: boolean
}

/** Distance from a point to an axis-aligned box centred on (cx, cy). */
const boxDistance = (px: number, py: number, cx: number, cy: number, w: number, h: number): number => {
  const dx = Math.max(Math.abs(px - cx) - w / 2, 0)
  const dy = Math.max(Math.abs(py - cy) - h / 2, 0)
  return Math.hypot(dx, dy)
}

/** Free space between the tag box and the circle edge (the nearest box point to the centre vs. PC_R). */
export const pcTagCircleClearance = (tag: PcTagPlacement): number => boxDistance(PC_CX, PC_CY, tag.x, tag.y, tag.w, tag.h) - PC_R

/** Free space between the tag box and the boundary knob `index` of the given shares. */
export const pcTagKnobClearance = (tag: PcTagPlacement, percents: readonly number[], index: number): number => {
  const k = pcPoint(pcBoundaries(percents)[index]!, PC_R)
  return boxDistance(k.x, k.y, tag.x, tag.y, tag.w, tag.h) - PC_HANDLE_R
}

/** Where each sector tag sits and whether it is shown: no tag for 0 % sectors or tags that would touch a knob. */
export const pcTagPlacements = (categories: readonly string[], percents: readonly number[]): PcTagPlacement[] => {
  const tags = pcSectorTags(categories)
  const b = pcBoundaries(percents)
  return categories.map((_, i) => {
    const pt = pcPoint(((b[i] ?? 0) + (b[i + 1] ?? 0)) / 2, PC_TAG_R)
    const base = { tag: tags[i]!, x: pt.x, y: pt.y, w: pcTextWidth(tags[i]!, PC_TAG_FONT), h: PC_TAG_FONT }
    let visible = (percents[i] ?? 0) > 0
    for (let k = 1; visible && k < percents.length; k++) {
      if (pcTagKnobClearance({ ...base, visible }, percents, k) < PC_TAG_CLEARANCE) visible = false
    }
    return { ...base, visible }
  })
}

/** Whether a legend name leaves room for a percent value ("100 %") at the right. */
export const pcLegendNameFits = (name: string): boolean =>
  PC_LEGEND_NAME_X + pcTextWidth(name, PC_LEGEND_FONT) + 12 + pcTextWidth(pcPercentText(100), PC_LEGEND_FONT) <= PC_LEGEND_RIGHT

export const pcLegendTop = (count: number): number => PC_CY - (count * PC_LEGEND_ROW_H) / 2
export const pcLegendRowY = (index: number, count: number): number => pcLegendTop(count) + index * PC_LEGEND_ROW_H + PC_LEGEND_ROW_H / 2

export interface PcTextExtent {
  text: string
  fontSize: number
  x: number
  y: number
  anchor: 'start' | 'middle' | 'end'
}

/** Every text of the chart (legend names and values, 10 % ring labels) for the viewBox fit test. */
export const pcTextExtents = (categories: readonly string[]): PcTextExtent[] => {
  const out: PcTextExtent[] = []
  categories.forEach((name, i) => {
    const y = pcLegendRowY(i, categories.length) + 5
    out.push({ text: name, fontSize: PC_LEGEND_FONT, x: PC_LEGEND_NAME_X, y, anchor: 'start' })
    out.push({ text: pcPercentText(100), fontSize: PC_LEGEND_FONT, x: PC_LEGEND_RIGHT, y, anchor: 'end' })
  })
  // Category tags sit outside the circle at the middle of their sector, which can be anywhere.
  const tags = pcSectorTags(categories)
  for (let p = 0; p < 100; p += 2.5) {
    const pt = pcPoint(p, PC_TAG_R)
    for (const tag of tags) out.push({ text: tag, fontSize: PC_TAG_FONT, x: pt.x, y: pt.y + 4, anchor: 'middle' })
  }
  for (let p = 0; p < 100; p += 10) {
    const pt = pcPoint(p, PC_RING_LABEL_R)
    out.push({ text: String(p), fontSize: PC_RING_FONT, x: pt.x, y: pt.y + 4, anchor: 'middle' })
  }
  return out
}

/** Whether the estimated text box lies inside the viewBox. */
export const pcExtentFits = (e: PcTextExtent): boolean => {
  const w = pcTextWidth(e.text, e.fontSize)
  const left = e.anchor === 'start' ? e.x : e.anchor === 'middle' ? e.x - w / 2 : e.x - w
  return left >= 0 && left + w <= PC_VIEWBOX_W && e.y - e.fontSize >= 0 && e.y + e.fontSize * 0.25 <= PC_VIEWBOX_H
}

const fail = (msg: string): never => {
  throw new Error(`pieChartTask: ${msg}`)
}

/** Category and snap rules only (the worksheet frame needs no targets). Throws a descriptive error. */
export const pcValidateAxis = (categories: readonly string[], snap: number): void => {
  if (!Array.isArray(categories) || categories.length < PC_MIN_CATEGORIES || categories.length > PC_MAX_CATEGORIES) {
    fail(`need ${PC_MIN_CATEGORIES}..${PC_MAX_CATEGORIES} categories`)
  }
  if (new Set(categories.map((c) => String(c).trim())).size !== categories.length) fail('category names must differ')
  for (const c of categories) {
    if (typeof c !== 'string' || c.trim() === '' || c.length > PC_MAX_CATEGORY_CHARS) {
      fail(`category needs 1..${PC_MAX_CATEGORY_CHARS} characters, got ${JSON.stringify(c)}`)
    }
    if (!pcLegendNameFits(c)) fail(`category ${JSON.stringify(c)} does not fit in the legend`)
  }
  if (!PC_ALLOWED_SNAPS.includes(snap)) fail(`snapPercent must be one of ${PC_ALLOWED_SNAPS.join(', ')}, got ${snap}`)
}

/** Full input check: categories, snap, tolerance and targets (multiples of snap, > 0, sum 100, not the start state). */
export const pcValidate = (categories: readonly string[], targets: readonly number[], snap: number, tolerance: number): void => {
  if (!Array.isArray(targets) || !Array.isArray(categories) || targets.length !== categories.length) fail('percents needs one value per category')
  pcValidateAxis(categories, snap)
  if (!Number.isFinite(tolerance) || tolerance < 0 || tolerance >= snap) fail(`tolerance must be at least 0 and below snapPercent, got ${tolerance}`)
  for (const t of targets) {
    if (!Number.isFinite(t) || t <= 0) fail(`every percent must be greater than 0, got ${t}`)
    const k = t / snap
    if (Math.abs(k - Math.round(k)) > 1e-6) fail(`percent ${t} is not a multiple of snapPercent (${snap})`)
  }
  if (Math.abs(targets.reduce((s, t) => s + t, 0) - 100) > 1e-6) fail('percents must add up to 100')
  if (pcMatches(targets, null, pcStartPercents(categories.length, snap), tolerance)) {
    fail(`percents equal the start state (${pcStartPercents(categories.length, snap).join(', ')}): an untouched chart would already be the answer`)
  }
}

const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Path of the sector between two percent positions. */
export const pcSectorPath = (from: number, to: number): string => {
  const a = pcPoint(from, PC_R)
  const b = pcPoint(to, PC_R)
  const large = to - from > 50 ? 1 : 0
  return `M ${PC_CX} ${PC_CY} L ${a.x} ${a.y} A ${PC_R} ${PC_R} 0 ${large} 1 ${b.x} ${b.y} Z`
}

/** Empty circle for the worksheet: 5 % ticks, labelled 10 % ticks, the centre and the legend. The learner draws the sectors. */
export const pieChartPrintSvg = (categories: readonly string[]): string => {
  const out: string[] = [`<circle cx="${PC_CX}" cy="${PC_CY}" r="${PC_R}" fill="#fff" stroke="#0f172a" stroke-width="2"/>`]
  out.push(`<circle cx="${PC_CX}" cy="${PC_CY}" r="2.5" fill="#0f172a"/>`)
  for (let p = 0; p < 100; p += 5) {
    const long = p % 10 === 0
    const a = pcPoint(p, PC_R)
    const b = pcPoint(p, PC_R + (long ? PC_TICK_LONG : PC_TICK_SHORT))
    out.push(`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#0f172a" stroke-width="${long ? 1.5 : 1}"/>`)
    if (long) {
      const t = pcPoint(p, PC_RING_LABEL_R)
      out.push(`<text x="${t.x}" y="${t.y + 4}" text-anchor="middle" font-size="${PC_RING_FONT}" fill="#0f172a">${p}</text>`)
    }
  }
  categories.forEach((name, i) => {
    const y = pcLegendRowY(i, categories.length)
    out.push(
      `<rect x="${PC_LEGEND_X}" y="${y - PC_LEGEND_SWATCH / 2}" width="${PC_LEGEND_SWATCH}" height="${PC_LEGEND_SWATCH}" fill="${PC_COLORS[i]}" stroke="${PC_STROKES[i]}" stroke-width="1.5"/>`,
      `<text x="${PC_LEGEND_NAME_X}" y="${y + 5}" font-size="${PC_LEGEND_FONT}" fill="#0f172a">${esc(name)}</text>`,
    )
  })
  return `<svg width="${PC_VIEWBOX_W}" height="${PC_VIEWBOX_H}" viewBox="0 0 ${PC_VIEWBOX_W} ${PC_VIEWBOX_H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Leerer Kreis mit Prozentskala für das Kreisdiagramm">${out.join('')}</svg>`
}

// ---------------------------------------------------------------------------
// Data source shown with the question (table of counts or percents)
// ---------------------------------------------------------------------------

export const PC_SOURCE_W = 520
export const PC_SOURCE_FONT = 15
export const PC_SOURCE_TEXT_X = 12
export const PC_SOURCE_ROW_H = 34
export const PC_SOURCE_HEAD_H = 36
export const PC_SOURCE_COL2_X = 300

/** Whether all texts of a source table stay inside it and in their columns. */
export const pcSourceFits = (head: string, colLeft: string, colRight: string, labels: readonly string[], cells: readonly string[]): boolean => {
  const fitsRight = (text: string, x: number, right: number): boolean => x + pcTextWidth(text, PC_SOURCE_FONT) <= right
  if (!fitsRight(head, PC_SOURCE_TEXT_X, PC_SOURCE_W - 8)) return false
  if (![colLeft, ...labels].every((l) => fitsRight(l, PC_SOURCE_TEXT_X, PC_SOURCE_COL2_X - 12))) return false
  return [colRight, ...cells].every((c) => fitsRight(c, PC_SOURCE_COL2_X, PC_SOURCE_W - 8))
}

/** Two-column table (category, number of children / share) shown with the question. `cells` are the written right-hand values. */
export const pieChartTableSvg = (
  head: string,
  colLeft: string,
  colRight: string,
  labels: readonly string[],
  cells: readonly string[],
): string => {
  const rows = [colLeft, ...labels]
  const right = [colRight, ...cells]
  const out: string[] = [
    `<text x="${PC_SOURCE_TEXT_X}" y="24" font-size="${PC_SOURCE_FONT}" font-weight="700" fill="#0f172a">${esc(head)}</text>`,
  ]
  rows.forEach((text, i) => {
    const yMid = PC_SOURCE_HEAD_H + i * PC_SOURCE_ROW_H + PC_SOURCE_ROW_H / 2
    const bold = i === 0
    const weight = bold ? 'font-weight="700" ' : ''
    out.push(
      `<line x1="4" y1="${yMid + PC_SOURCE_ROW_H / 2}" x2="${PC_SOURCE_W - 4}" y2="${yMid + PC_SOURCE_ROW_H / 2}" stroke="${bold ? '#0f172a' : '#cbd5e1'}" stroke-width="${bold ? 2 : 1}"/>`,
      `<text x="${PC_SOURCE_TEXT_X}" y="${yMid + 5}" font-size="${PC_SOURCE_FONT}" ${weight}fill="#0f172a">${esc(text)}</text>`,
      `<text x="${PC_SOURCE_COL2_X}" y="${yMid + 5}" font-size="${PC_SOURCE_FONT}" ${weight}fill="#0f172a">${esc(right[i] ?? '')}</text>`,
    )
  })
  const h = PC_SOURCE_HEAD_H + rows.length * PC_SOURCE_ROW_H + 8
  return `<svg width="100%" style="max-width:${PC_SOURCE_W}px" viewBox="0 0 ${PC_SOURCE_W} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Umfrageergebnisse">${out.join('')}</svg>`
}
