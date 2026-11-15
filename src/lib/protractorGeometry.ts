/**
 * Pure geometry for the virtual Geodreieck (AngleProtractor).
 * All lengths are SVG units (viewBox), never screen pixels, so behaviour is
 * identical at 375 px and on desktop. Angles are mathematical (counter-clockwise,
 * 0° = pointing right) unless a name says "svg".
 */

export const PROTRACTOR_VIEWBOX = { w: 360, h: 320 } as const
/** Vertex of the drawn angle. */
export const PROTRACTOR_VERTEX = { x: 180, y: 160 } as const
/** Length of the drawn legs. */
export const PROTRACTOR_LEG_LENGTH = 130
/** Half length of the Geodreieck's long side (zero point at its middle). */
export const PROTRACTOR_RADIUS = 100
/** Protractor origin snaps onto the vertex within this distance. */
export const PROTRACTOR_SNAP_DISTANCE = 12

export interface Point {
  x: number
  y: number
}

export interface ProtractorPose {
  x: number
  y: number
  /** Rotation in degrees, counter-clockwise. */
  rot: number
}

const DEG = Math.PI / 180

export const normalizeDegrees = (d: number): number => ((d % 360) + 360) % 360

/** Point at `length` from `from` in math direction `degrees`. */
export const pointAt = (from: Point, degrees: number, length: number): Point => ({
  x: from.x + length * Math.cos(degrees * DEG),
  y: from.y - length * Math.sin(degrees * DEG),
})

/** Math direction (0..360, ccw) of `to` as seen from `from`. */
export const directionDegrees = (from: Point, to: Point): number =>
  normalizeDegrees(Math.atan2(-(to.y - from.y), to.x - from.x) / DEG)

/** Snap the protractor origin onto the vertex when close enough. */
export const snapToVertex = (p: Point, vertex: Point = PROTRACTOR_VERTEX): Point => {
  const d = Math.hypot(p.x - vertex.x, p.y - vertex.y)
  return d <= PROTRACTOR_SNAP_DISTANCE ? { x: vertex.x, y: vertex.y } : p
}

/**
 * Relative angle (1..179, integer) of the second leg for a pointer position
 * while dragging in draw mode. Values past the straight angle clamp to the
 * nearest end so the handle never jumps across.
 */
export const legDegreesFromPointer = (
  pointer: Point,
  startAngle: number,
  vertex: Point = PROTRACTOR_VERTEX,
): number => {
  const rel = normalizeDegrees(directionDegrees(vertex, pointer) - startAngle)
  const clamped = rel > 180 ? (rel > 270 ? 1 : 179) : rel
  return Math.min(179, Math.max(1, Math.round(clamped)))
}

/**
 * Where the learner's second leg starts in draw mode: always clearly away
 * from the target so the start position never spoils the answer.
 */
export const drawStartDegrees = (angle: number): number => {
  const offset = 35 + ((angle * 13) % 30)
  const up = angle + offset
  const s = up <= 175 ? up : angle - offset
  return Math.min(179, Math.max(1, s))
}

/** Start pose of the loose protractor in measure mode (off the vertex and not aligned). */
export const measureStartPose = (angle: number, startAngle: number): ProtractorPose => ({
  x: 285,
  y: 280,
  rot: normalizeDegrees(startAngle + 25 + ((angle * 7) % 35)),
})
