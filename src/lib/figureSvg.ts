/**
 * SVG-Figuren für Vierecke, gerade Prismen (Vorderfläche in wahrer Größe),
 * Quader mit aufgesetzter Pyramide sowie Säulen- und Liniendiagramme.
 */
import { geoDimLabel } from './geometrySvg'

type Pt = [number, number]

const STROKE = '#1976d2'
const FILL = '#e3f2fd'
const SIDE_FILL = '#bbdefb'
const HELP = '#e65100'

const r2 = (n: number) => Math.round(n * 10) / 10

const centroid = (pts: Pt[]): Pt => [
  pts.reduce((s, p) => s + p[0], 0) / pts.length,
  pts.reduce((s, p) => s + p[1], 0) / pts.length,
]

/** Label position next to the midpoint of p→q, pushed away from `center`. */
function edgeLabelPos(p: Pt, q: Pt, center: Pt, dist = 16): Pt {
  const mx = (p[0] + q[0]) / 2
  const my = (p[1] + q[1]) / 2
  let nx = q[1] - p[1]
  let ny = p[0] - q[0]
  const len = Math.hypot(nx, ny) || 1
  nx /= len
  ny /= len
  if ((mx - center[0]) * nx + (my - center[1]) * ny < 0) {
    nx = -nx
    ny = -ny
  }
  return [r2(mx + nx * dist), r2(my + ny * dist + 5)]
}

const poly = (pts: Pt[], attrs: string) =>
  `<polygon points="${pts.map((p) => `${r2(p[0])},${r2(p[1])}`).join(' ')}" ${attrs}/>`

const line = (p: Pt, q: Pt, attrs: string) =>
  `<line x1="${r2(p[0])}" y1="${r2(p[1])}" x2="${r2(q[0])}" y2="${r2(q[1])}" ${attrs}/>`

const rightAngleMark = (foot: Pt, alongDir: Pt, upDir: Pt, size = 9): string => {
  const a: Pt = [foot[0] + alongDir[0] * size, foot[1] + alongDir[1] * size]
  const c: Pt = [foot[0] + upDir[0] * size, foot[1] + upDir[1] * size]
  const b: Pt = [a[0] + upDir[0] * size, a[1] + upDir[1] * size]
  return `<polyline points="${r2(a[0])},${r2(a[1])} ${r2(b[0])},${r2(b[1])} ${r2(c[0])},${r2(c[1])}" fill="none" stroke="${HELP}" stroke-width="1.2"/>`
}

function wrapSvg(width: number, height: number, body: string, label: string): string {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
  ${body}
</svg>`
}

// ---------------------------------------------------------------------------
// Vierecke
// ---------------------------------------------------------------------------

export type QuadKind = 'parallelogramm' | 'trapez' | 'drachen' | 'raute'

export interface QuadrilateralSvgProps {
  kind: QuadKind
  /** Seiten a = AB, b = BC, c = CD, d = DA (leer = ohne Beschriftung). */
  sides?: { a?: string; b?: string; c?: string; d?: string }
  /** Höhe auf a (Parallelogramm, Trapez), gestrichelt von D aus. */
  heightLabel?: string
  /** Diagonalen e = AC und f = BD (Drachen, Raute). */
  diagonals?: { e?: string; f?: string }
  /** Eckpunkte beschriften. */
  vertexNames?: boolean
}

export function generateQuadrilateralSvg({
  kind,
  sides = {},
  heightLabel,
  diagonals,
  vertexNames = true,
}: QuadrilateralSvgProps): string {
  const pts: Record<QuadKind, [Pt, Pt, Pt, Pt]> = {
    parallelogramm: [[50, 190], [250, 190], [320, 70], [120, 70]],
    trapez: [[40, 190], [320, 190], [240, 70], [110, 70]],
    drachen: [[180, 220], [270, 100], [180, 30], [90, 100]],
    raute: [[180, 220], [265, 125], [180, 30], [95, 125]],
  }
  const [A, B, C, D] = pts[kind]
  const center = centroid([A, B, C, D])
  const parts: string[] = [poly([A, B, C, D], `fill="${FILL}" stroke="${STROKE}" stroke-width="2"`)]
  const names = ['A', 'B', 'C', 'D']
  const sideList: Array<[Pt, Pt, string | undefined]> = [
    [A, B, sides.a],
    [B, C, sides.b],
    [C, D, sides.c],
    [D, A, sides.d],
  ]
  for (const [p, q, text] of sideList) {
    if (!text) continue
    const [x, y] = edgeLabelPos(p, q, center, 18)
    parts.push(geoDimLabel(x, y, text))
  }
  if (heightLabel && (kind === 'parallelogramm' || kind === 'trapez')) {
    const foot: Pt = [D[0], A[1]]
    parts.push(line(D, foot, `stroke="${HELP}" stroke-width="2" stroke-dasharray="6 4"`))
    parts.push(rightAngleMark(foot, [1, 0], [0, -1]))
    parts.push(geoDimLabel(D[0] + 8, (D[1] + foot[1]) / 2 + 5, heightLabel, { anchor: 'start' }))
  }
  if (diagonals && (kind === 'drachen' || kind === 'raute')) {
    parts.push(line(A, C, `stroke="${HELP}" stroke-width="1.8" stroke-dasharray="6 4"`))
    parts.push(line(B, D, `stroke="${HELP}" stroke-width="1.8" stroke-dasharray="6 4"`))
    if (diagonals.e) parts.push(geoDimLabel(A[0] + 8, (A[1] + C[1]) / 2 + 30, diagonals.e, { anchor: 'start' }))
    if (diagonals.f) parts.push(geoDimLabel((B[0] + D[0]) / 2 - 40, B[1] - 8, diagonals.f))
  }
  if (vertexNames) {
    ;[A, B, C, D].forEach((p, i) => {
      const dx = p[0] - center[0]
      const dy = p[1] - center[1]
      const len = Math.hypot(dx, dy) || 1
      parts.push(
        `<text x="${r2(p[0] + (dx / len) * 16)}" y="${r2(p[1] + (dy / len) * 16 + 5)}" text-anchor="middle" font-size="14" fill="#90caf9">${names[i]}</text>`,
      )
    })
  }
  return wrapSvg(370, 250, parts.join('\n  '), kind === 'parallelogramm' ? 'Parallelogramm' : kind === 'trapez' ? 'Trapez' : kind === 'drachen' ? 'Drachenviereck' : 'Raute')
}

// ---------------------------------------------------------------------------
// Gerade Prismen: Vorderfläche in wahrer Größe, schräg nach hinten versetzt
// ---------------------------------------------------------------------------

export interface ExtrudedPrismSvgProps {
  /** Konvexe Vorderfläche (Pixel, y nach unten). */
  face: Pt[]
  /** Versatz der Rückfläche (Kavalierperspektive), z. B. [70, -45]. */
  depth?: Pt
  /** Beschriftungen von Kanten der Vorderfläche: [Index von, Index nach, Text]. */
  edgeLabels?: Array<[number, number, string]>
  /** Beschriftung einer nach hinten laufenden Kante an Ecke i. */
  depthLabel?: { at: number; text: string }
  /** Gestrichelte Hilfslinie (z. B. Höhe der Grundfläche) mit Beschriftung. */
  helper?: { from: Pt; to: Pt; text?: string; rightAngleAlong?: Pt }
  /** Text in der Vorderfläche (z. B. „G“). */
  faceText?: string
  width?: number
  height?: number
  ariaLabel?: string
}

export function generateExtrudedPrismSvg({
  face,
  depth = [70, -45],
  edgeLabels = [],
  depthLabel,
  helper,
  faceText,
  width = 380,
  height = 270,
  ariaLabel = 'Gerades Prisma',
}: ExtrudedPrismSvgProps): string {
  const n = face.length
  const back = face.map(([x, y]) => [x + depth[0], y + depth[1]] as Pt)
  const center = centroid(face)
  const visibleSide = face.map((p, i) => {
    const q = face[(i + 1) % n]!
    let nx = q[1] - p[1]
    let ny = p[0] - q[0]
    const mx = (p[0] + q[0]) / 2 - center[0]
    const my = (p[1] + q[1]) / 2 - center[1]
    if (mx * nx + my * ny < 0) {
      nx = -nx
      ny = -ny
    }
    return nx * depth[0] + ny * depth[1] > 1e-6
  })
  const parts: string[] = []
  const hidden = `stroke="${STROKE}" stroke-width="1.4" stroke-dasharray="5 4" opacity="0.75"`
  const solid = `stroke="${STROKE}" stroke-width="2"`
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    if (!visibleSide[i]) parts.push(line(back[i]!, back[j]!, hidden))
    const adjacentVisible = visibleSide[i] || visibleSide[(i - 1 + n) % n]
    if (!adjacentVisible) parts.push(line(face[i]!, back[i]!, hidden))
  }
  for (let i = 0; i < n; i++) {
    if (!visibleSide[i]) continue
    const j = (i + 1) % n
    parts.push(poly([face[i]!, face[j]!, back[j]!, back[i]!], `fill="${SIDE_FILL}" ${solid} stroke-linejoin="round"`))
  }
  parts.push(poly(face, `fill="${FILL}" ${solid} stroke-linejoin="round"`))
  if (helper) {
    parts.push(line(helper.from, helper.to, `stroke="${HELP}" stroke-width="2" stroke-dasharray="6 4"`))
    if (helper.rightAngleAlong) {
      const up = [helper.from[0] - helper.to[0], helper.from[1] - helper.to[1]] as Pt
      const len = Math.hypot(up[0], up[1]) || 1
      parts.push(rightAngleMark(helper.to, helper.rightAngleAlong, [up[0] / len, up[1] / len]))
    }
    if (helper.text) {
      parts.push(geoDimLabel(r2((helper.from[0] + helper.to[0]) / 2 + 8), r2((helper.from[1] + helper.to[1]) / 2 + 5), helper.text, { anchor: 'start' }))
    }
  }
  for (const [i, j, text] of edgeLabels) {
    const [x, y] = edgeLabelPos(face[i]!, face[j]!, center, 18)
    parts.push(geoDimLabel(x, y, text))
  }
  if (depthLabel) {
    const p = face[depthLabel.at]!
    const q = back[depthLabel.at]!
    const [x, y] = edgeLabelPos(p, q, center, 16)
    parts.push(geoDimLabel(x + 6, y, depthLabel.text, { anchor: 'start' }))
  }
  if (faceText) {
    parts.push(`<text x="${r2(center[0])}" y="${r2(center[1] + 5)}" text-anchor="middle" font-size="15" font-weight="bold" fill="#0d47a1">${faceText}</text>`)
  }
  return wrapSvg(width, height, parts.join('\n  '), ariaLabel)
}

// ---------------------------------------------------------------------------
// Quader mit aufgesetzter quadratischer Pyramide
// ---------------------------------------------------------------------------

export interface CuboidPyramidSvgProps {
  edgeLabel?: string
  cuboidHeightLabel?: string
  pyramidHeightLabel?: string
  slantHeightLabel?: string
}

export function generateCuboidWithPyramidSvg({
  edgeLabel,
  cuboidHeightLabel,
  pyramidHeightLabel,
  slantHeightLabel,
}: CuboidPyramidSvgProps): string {
  const a = 150
  const hq = 100
  const hp = 95
  const d: Pt = [60, -40]
  const F1: Pt = [50, 250]
  const F2: Pt = [F1[0] + a, F1[1]]
  const T1: Pt = [F1[0], F1[1] - hq]
  const T2: Pt = [F2[0], F2[1] - hq]
  const B2: Pt = [T2[0] + d[0], T2[1] + d[1]]
  const B1: Pt = [T1[0] + d[0], T1[1] + d[1]]
  const G2: Pt = [F2[0] + d[0], F2[1] + d[1]]
  const G1: Pt = [F1[0] + d[0], F1[1] + d[1]]
  const M: Pt = [(T1[0] + B2[0]) / 2, (T1[1] + B2[1]) / 2]
  const S: Pt = [M[0], M[1] - hp]
  const solid = `stroke="${STROKE}" stroke-width="2"`
  const hidden = `stroke="${STROKE}" stroke-width="1.4" stroke-dasharray="5 4" opacity="0.75"`
  const parts = [
    line(G1, F1, hidden),
    line(G1, G2, hidden),
    line(G1, B1, hidden),
    line(T1, B1, hidden),
    line(B1, B2, hidden),
    line(S, B1, hidden),
    poly([F2, G2, B2, T2], `fill="${SIDE_FILL}" ${solid}`),
    poly([F1, F2, T2, T1], `fill="${FILL}" ${solid}`),
    poly([T1, T2, S], `fill="#fff3e0" ${solid}`),
    poly([T2, B2, S], `fill="#ffe0b2" ${solid}`),
  ]
  if (pyramidHeightLabel) {
    parts.push(line(S, M, `stroke="${HELP}" stroke-width="2" stroke-dasharray="6 4"`))
    parts.push(geoDimLabel(M[0] + 8, (S[1] + M[1]) / 2 + 5, pyramidHeightLabel, { anchor: 'start' }))
  }
  if (slantHeightLabel) {
    const mid: Pt = [(T1[0] + T2[0]) / 2, T1[1]]
    parts.push(line(S, mid, `stroke="${HELP}" stroke-width="2" stroke-dasharray="3 3"`))
    parts.push(geoDimLabel(mid[0] - 10, (S[1] + mid[1]) / 2 + 12, slantHeightLabel, { anchor: 'end' }))
  }
  if (edgeLabel) parts.push(geoDimLabel((F1[0] + F2[0]) / 2, F1[1] + 22, edgeLabel))
  if (cuboidHeightLabel) parts.push(geoDimLabel(F1[0] - 8, (F1[1] + T1[1]) / 2 + 5, cuboidHeightLabel, { anchor: 'end' }))
  return wrapSvg(330, 290, parts.join('\n  '), 'Quader mit aufgesetzter Pyramide')
}

// ---------------------------------------------------------------------------
// Diagramme
// ---------------------------------------------------------------------------

export interface ChartSvgProps {
  data: Array<{ label: string; value: number }>
  yMax: number
  yStep: number
  /** Beginn der y-Achse (Standard 0; > 0 = abgeschnittene Achse). */
  yMin?: number
  /** Achsenbeschriftung, z. B. „Anzahl“. */
  yTitle?: string
  /** Optional hervorgehobene Kategorie (Index). */
  highlight?: number
}

function chartFrame(width: number, height: number, yMin: number, yMax: number, yStep: number, yTitle: string | undefined) {
  const left = 52
  const right = 16
  const top = 28
  const bottom = 46
  const plotH = height - top - bottom
  const plotW = width - left - right
  const yPx = (v: number) => top + plotH - ((v - yMin) / (yMax - yMin)) * plotH
  const parts: string[] = []
  for (let v = yMin; v <= yMax + 1e-9; v += yStep) {
    const y = r2(yPx(v))
    const axis = v === yMin || v === 0
    parts.push(`<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" stroke="#90a4ae" stroke-width="${axis ? 1.6 : 0.8}" ${axis ? '' : 'stroke-dasharray="3 3"'}/>`)
    parts.push(`<text x="${left - 8}" y="${y + 4}" text-anchor="end" font-size="12" fill="#cfd8dc">${String(v).replace('-', '−').replace('.', ',')}</text>`)
  }
  parts.push(`<line x1="${left}" y1="${top - 8}" x2="${left}" y2="${top + plotH}" stroke="#90a4ae" stroke-width="1.6"/>`)
  if (yTitle) parts.push(`<text x="${left - 40}" y="${top - 12}" font-size="12" fill="#cfd8dc">${yTitle}</text>`)
  return { left, top, plotH, plotW, yPx, parts }
}

export function generateBarChartSvg({ data, yMax, yStep, yMin = 0, yTitle, highlight }: ChartSvgProps): string {
  const width = Math.max(320, 70 + data.length * 62)
  const height = 260
  const { left, top, plotH, plotW, yPx, parts } = chartFrame(width, height, yMin, yMax, yStep, yTitle)
  const slot = plotW / data.length
  const barW = Math.min(40, slot * 0.6)
  data.forEach((d, i) => {
    const x = left + slot * i + (slot - barW) / 2
    const y = yPx(d.value)
    parts.push(`<rect x="${r2(x)}" y="${r2(y)}" width="${r2(barW)}" height="${r2(top + plotH - y)}" fill="${i === highlight ? '#ffa726' : '#42a5f5'}" stroke="#1565c0" stroke-width="1"/>`)
    parts.push(`<text x="${r2(x + barW / 2)}" y="${top + plotH + 18}" text-anchor="middle" font-size="12" fill="#eceff1">${d.label}</text>`)
  })
  return wrapSvg(width, height, parts.join('\n  '), 'Säulendiagramm')
}

export function generateLineChartSvg({ data, yMax, yStep, yMin = 0, yTitle, highlight }: ChartSvgProps): string {
  const width = Math.max(320, 70 + data.length * 56)
  const height = 260
  const { left, top, plotH, plotW, yPx, parts } = chartFrame(width, height, yMin, yMax, yStep, yTitle)
  const slot = plotW / data.length
  const pts = data.map((d, i) => [left + slot * i + slot / 2, yPx(d.value)] as Pt)
  parts.push(`<polyline points="${pts.map((p) => `${r2(p[0])},${r2(p[1])}`).join(' ')}" fill="none" stroke="#42a5f5" stroke-width="2.5"/>`)
  pts.forEach((p, i) => {
    parts.push(`<circle cx="${r2(p[0])}" cy="${r2(p[1])}" r="${i === highlight ? 6 : 4.5}" fill="${i === highlight ? '#ffa726' : '#42a5f5'}" stroke="#0d47a1" stroke-width="1"/>`)
    parts.push(`<text x="${r2(p[0])}" y="${top + plotH + 18}" text-anchor="middle" font-size="12" fill="#eceff1">${data[i]!.label}</text>`)
  })
  return wrapSvg(width, height, parts.join('\n  '), 'Liniendiagramm')
}

/** Kreisdiagramm ohne Prozentangaben in der Legende (zum Ablesen/Berechnen). */
export function generatePlainPieChartSvg(slices: Array<{ value: number; label: string }>): string {
  const size = 280
  const cx = size / 2
  const cy = 120
  const r = 95
  const colors = ['#42a5f5', '#66bb6a', '#ffa726', '#ab47bc', '#ef5350', '#26c6da']
  const total = slices.reduce((s, x) => s + x.value, 0) || 1
  let angle = -Math.PI / 2
  const parts: string[] = []
  slices.forEach((sl, i) => {
    const frac = sl.value / total
    const a0 = angle
    const a1 = angle + frac * 2 * Math.PI
    angle = a1
    const large = frac > 0.5 ? 1 : 0
    parts.push(
      `<path d="M ${cx},${cy} L ${r2(cx + r * Math.cos(a0))},${r2(cy + r * Math.sin(a0))} A ${r},${r} 0 ${large},1 ${r2(cx + r * Math.cos(a1))},${r2(cy + r * Math.sin(a1))} Z" fill="${colors[i % colors.length]}" stroke="#263238" stroke-width="1.5"/>`,
    )
  })
  const legend = slices
    .map((sl, i) => {
      const x = 14 + (i % 3) * 88
      const y = 238 + Math.floor(i / 3) * 18
      return `<rect x="${x}" y="${y - 10}" width="10" height="10" fill="${colors[i % colors.length]}"/><text x="${x + 15}" y="${y}" font-size="12" fill="#eceff1">${sl.label}</text>`
    })
    .join('\n  ')
  return wrapSvg(size, 280, `${parts.join('\n  ')}\n  ${legend}`, 'Kreisdiagramm')
}
