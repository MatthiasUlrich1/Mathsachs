/**
 * Editable coordinate-scene model: points, segments, rays, lines, labels.
 * Used by the Aufgabengenerator graph editor and coordinateDraw tasks.
 */
import { generateCoordinateGridSvg } from './geometrySvg'

export type GraphPointObj = {
  id: string
  kind: 'point'
  x: number
  y: number
  label?: string
  color?: string
}

export type GraphSegmentObj = {
  id: string
  kind: 'segment'
  x1: number
  y1: number
  x2: number
  y2: number
  label?: string
  color?: string
}

export type GraphRayObj = {
  id: string
  kind: 'ray'
  x1: number
  y1: number
  x2: number
  y2: number
  color?: string
}

export type GraphLineObj = {
  id: string
  kind: 'line'
  x1: number
  y1: number
  x2: number
  y2: number
  color?: string
}

export type GraphLabelObj = {
  id: string
  kind: 'label'
  x: number
  y: number
  text: string
  color?: string
}

export type GraphObject =
  | GraphPointObj
  | GraphSegmentObj
  | GraphRayObj
  | GraphLineObj
  | GraphLabelObj

export type SnapMode = 'off' | 'half' | 'integer'

export type CoordinateScene = {
  xRange: [number, number]
  yRange: [number, number]
  cellSize?: number
  snap: SnapMode
  objects: GraphObject[]
}

export function emptyCoordinateScene(
  partial?: Partial<CoordinateScene>,
): CoordinateScene {
  return {
    xRange: [-5, 5],
    yRange: [-5, 5],
    cellSize: 32,
    snap: 'half',
    objects: [],
    ...partial,
  }
}

export function newGraphObjectId(): string {
  return `g-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function snapCoord(v: number, snap: SnapMode): number {
  if (snap === 'off') return v
  const step = snap === 'half' ? 0.5 : 1
  return Math.round(v / step) * step
}

export function snapPoint(
  p: { x: number; y: number },
  snap: SnapMode,
  xRange: [number, number],
  yRange: [number, number],
): { x: number; y: number } | null {
  const xMin = Math.min(xRange[0], xRange[1])
  const xMax = Math.max(xRange[0], xRange[1])
  const yMin = Math.min(yRange[0], yRange[1])
  const yMax = Math.max(yRange[0], yRange[1])
  const x = snapCoord(p.x, snap)
  const y = snapCoord(p.y, snap)
  if (x < xMin - 1e-9 || x > xMax + 1e-9 || y < yMin - 1e-9 || y > yMax + 1e-9) {
    return null
  }
  return { x, y }
}

/** Clip infinite line through (x1,y1)-(x2,y2) to axis-aligned rect. */
export function clipLineToRect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
): [[number, number], [number, number]] | null {
  const dx = x2 - x1
  const dy = y2 - y1
  if (Math.abs(dx) < 1e-12 && Math.abs(dy) < 1e-12) return null

  let t0 = -Infinity
  let t1 = Infinity
  const p = [-dx, dx, -dy, dy]
  const q = [x1 - xMin, xMax - x1, y1 - yMin, yMax - y1]
  for (let i = 0; i < 4; i++) {
    const pi = p[i]!
    const qi = q[i]!
    if (Math.abs(pi) < 1e-12) {
      if (qi < 0) return null
      continue
    }
    const r = qi / pi
    if (pi < 0) t0 = Math.max(t0, r)
    else t1 = Math.min(t1, r)
    if (t0 > t1) return null
  }
  if (!Number.isFinite(t0) || !Number.isFinite(t1)) return null
  return [
    [x1 + t0 * dx, y1 + t0 * dy],
    [x1 + t1 * dx, y1 + t1 * dy],
  ]
}

/** Clip ray from A through B to rect. */
export function clipRayToRect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
): [[number, number], [number, number]] | null {
  const dx = x2 - x1
  const dy = y2 - y1
  if (Math.abs(dx) < 1e-12 && Math.abs(dy) < 1e-12) return null
  const full = clipLineToRect(x1, y1, x2, y2, xMin, xMax, yMin, yMax)
  if (!full) return null
  const [[ax, ay], [bx, by]] = full
  const len2 = dx * dx + dy * dy
  const tA = ((ax - x1) * dx + (ay - y1) * dy) / len2
  const tB = ((bx - x1) * dx + (by - y1) * dy) / len2
  const startT = Math.max(0, Math.min(tA, tB))
  const endT = Math.max(tA, tB)
  if (endT < -1e-9) return null
  return [
    [x1 + startT * dx, y1 + startT * dy],
    [x1 + endT * dx, y1 + endT * dy],
  ]
}

export function generateCoordinateSceneSvg(scene: CoordinateScene): string {
  const xRange = scene.xRange
  const yRange = scene.yRange
  const cellSize = scene.cellSize ?? 32
  const xMin = Math.min(xRange[0], xRange[1])
  const xMax = Math.max(xRange[0], xRange[1])
  const yMin = Math.min(yRange[0], yRange[1])
  const yMax = Math.max(yRange[0], yRange[1])
  const padL = 36
  const padT = 28

  const points = scene.objects
    .filter((o): o is GraphPointObj => o.kind === 'point')
    .map((o) => ({ x: o.x, y: o.y, label: o.label }))

  let base = generateCoordinateGridSvg({
    xRange,
    yRange,
    cellSize,
    points,
  })

  const toSvg = (mx: number, my: number): [number, number] => [
    padL + (mx - xMin) * cellSize,
    padT + (yMax - my) * cellSize,
  ]

  const extras: string[] = []
  const defId = `arr-${Math.random().toString(36).slice(2, 8)}`
  extras.push(
    `<defs>
    <marker id="${defId}" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <polygon points="0,0 8,4 0,8" fill="#1565c0"/>
    </marker>
  </defs>`,
  )

  for (const o of scene.objects) {
    const color = o.color ?? '#1565c0'
    if (o.kind === 'segment') {
      const [a, b] = [toSvg(o.x1, o.y1), toSvg(o.x2, o.y2)]
      extras.push(
        `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="2.5"/>`,
      )
      if (o.label) {
        extras.push(
          `<text x="${(a[0] + b[0]) / 2 + 6}" y="${(a[1] + b[1]) / 2 - 6}" font-size="12" font-weight="bold" fill="${color}">${escapeXml(o.label)}</text>`,
        )
      }
    } else if (o.kind === 'line') {
      const seg = clipLineToRect(o.x1, o.y1, o.x2, o.y2, xMin, xMax, yMin, yMax)
      if (seg) {
        const [p, q] = seg
        const [a, b] = [toSvg(p[0], p[1]), toSvg(q[0], q[1])]
        extras.push(
          `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="2.5"/>`,
        )
      }
    } else if (o.kind === 'ray') {
      const seg = clipRayToRect(o.x1, o.y1, o.x2, o.y2, xMin, xMax, yMin, yMax)
      if (seg) {
        const [p, q] = seg
        const [a, b] = [toSvg(p[0], p[1]), toSvg(q[0], q[1])]
        extras.push(
          `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="2.5" marker-end="url(#${defId})"/>`,
        )
      }
    } else if (o.kind === 'label') {
      const [sx, sy] = toSvg(o.x, o.y)
      extras.push(
        `<text x="${sx + 6}" y="${sy - 6}" font-size="13" font-weight="bold" fill="${o.color ?? '#334155'}">${escapeXml(o.text)}</text>`,
      )
    } else if (o.kind === 'point' && o.color) {
      const [sx, sy] = toSvg(o.x, o.y)
      extras.push(
        `<circle cx="${sx}" cy="${sy}" r="5.5" fill="${o.color}" stroke="#0d47a1" stroke-width="1.5"/>`,
      )
    }
  }

  return base.replace('</svg>', `  ${extras.join('\n  ')}\n</svg>`)
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function sameLine(
  a: { x1: number; y1: number; x2: number; y2: number },
  b: { x1: number; y1: number; x2: number; y2: number },
  tol = 0.15,
): boolean {
  const ax = a.x2 - a.x1
  const ay = a.y2 - a.y1
  const bx = b.x2 - b.x1
  const by = b.y2 - b.y1
  const crossDir = ax * by - ay * bx
  const lenA = Math.hypot(ax, ay)
  const lenB = Math.hypot(bx, by)
  if (lenA < 1e-9 || lenB < 1e-9) return false
  if (Math.abs(crossDir) > tol * lenA * lenB) return false
  const dx = b.x1 - a.x1
  const dy = b.y1 - a.y1
  const crossPt = ax * dy - ay * dx
  return Math.abs(crossPt) <= tol * lenA
}

export function sameSegment(
  a: { x1: number; y1: number; x2: number; y2: number },
  b: { x1: number; y1: number; x2: number; y2: number },
  tol = 0.25,
): boolean {
  return (
    (near(a.x1, b.x1, tol) &&
      near(a.y1, b.y1, tol) &&
      near(a.x2, b.x2, tol) &&
      near(a.y2, b.y2, tol)) ||
    (near(a.x1, b.x2, tol) &&
      near(a.y1, b.y2, tol) &&
      near(a.x2, b.x1, tol) &&
      near(a.y2, b.y1, tol))
  )
}

function near(u: number, v: number, tol: number) {
  return Math.abs(u - v) <= tol
}

export function pointNear(
  a: { x: number; y: number },
  b: { x: number; y: number },
  tol = 0.35,
): boolean {
  return Math.hypot(a.x - b.x, a.y - b.y) <= tol
}

export function scenesMatch(
  answer: CoordinateScene,
  solution: CoordinateScene,
  tol = 0.35,
): boolean {
  const ansLines = answer.objects.filter((o) => o.kind === 'line') as GraphLineObj[]
  const solLines = solution.objects.filter((o) => o.kind === 'line') as GraphLineObj[]
  const ansSegs = answer.objects.filter((o) => o.kind === 'segment') as GraphSegmentObj[]
  const solSegs = solution.objects.filter((o) => o.kind === 'segment') as GraphSegmentObj[]
  const ansRays = answer.objects.filter((o) => o.kind === 'ray') as GraphRayObj[]
  const solRays = solution.objects.filter((o) => o.kind === 'ray') as GraphRayObj[]
  const ansPts = answer.objects.filter((o) => o.kind === 'point') as GraphPointObj[]
  const solPts = solution.objects.filter((o) => o.kind === 'point') as GraphPointObj[]

  if (
    ansLines.length !== solLines.length ||
    ansSegs.length !== solSegs.length ||
    ansRays.length !== solRays.length ||
    ansPts.length !== solPts.length
  ) {
    return false
  }

  const usedLine = new Set<number>()
  for (const s of solLines) {
    const idx = ansLines.findIndex((a, i) => !usedLine.has(i) && sameLine(a, s, tol))
    if (idx < 0) return false
    usedLine.add(idx)
  }

  const usedSeg = new Set<number>()
  for (const s of solSegs) {
    const idx = ansSegs.findIndex((a, i) => !usedSeg.has(i) && sameSegment(a, s, tol))
    if (idx < 0) return false
    usedSeg.add(idx)
  }

  const usedRay = new Set<number>()
  for (const s of solRays) {
    const idx = ansRays.findIndex((a, i) => {
      if (usedRay.has(i)) return false
      return (
        sameLine(a, s, tol) &&
        pointNear({ x: a.x1, y: a.y1 }, { x: s.x1, y: s.y1 }, tol)
      )
    })
    if (idx < 0) return false
    usedRay.add(idx)
  }

  const usedPt = new Set<number>()
  for (const s of solPts) {
    const idx = ansPts.findIndex((a, i) => !usedPt.has(i) && pointNear(a, s, tol))
    if (idx < 0) return false
    usedPt.add(idx)
  }

  return true
}

export function parseCoordinateScene(raw: unknown): CoordinateScene | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const xRange = o.xRange
  const yRange = o.yRange
  if (!Array.isArray(xRange) || !Array.isArray(yRange)) return null
  const objects = Array.isArray(o.objects) ? (o.objects as GraphObject[]) : []
  const snap =
    o.snap === 'off' || o.snap === 'half' || o.snap === 'integer' ? o.snap : 'half'
  return {
    xRange: [Number(xRange[0]), Number(xRange[1])],
    yRange: [Number(yRange[0]), Number(yRange[1])],
    cellSize: Number(o.cellSize) || 32,
    snap,
    objects,
  }
}
