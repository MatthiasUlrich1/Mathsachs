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

/** Half width of the drawn triangle (scale radius plus rim). */
export const PROTRACTOR_HALF_WIDTH = PROTRACTOR_RADIUS + 10
/** Rotation handle below the long side (centre y and radius, local units). */
export const PROTRACTOR_HANDLE_Y = 38
export const PROTRACTOR_HANDLE_RADIUS = 14

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

/** Absolute math direction of a leg point, shifted by a grab offset (keeps the handle from jumping). */
export const legGrabOffset = (
  pointer: Point,
  startAngle: number,
  currentDegrees: number,
  vertex: Point = PROTRACTOR_VERTEX,
): number => {
  const off = normalizeDegrees(startAngle + currentDegrees - directionDegrees(vertex, pointer))
  return off > 180 ? off - 360 : off
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
  // Whole instrument (radius <= half width) stays inside the viewBox at any rotation.
  x: 240,
  y: 200,
  rot: normalizeDegrees(startAngle + 25 + ((angle * 7) % 35)),
})

/** Distance from the origin to the far side of the rotation handle, plus a visible margin. */
export const PROTRACTOR_EDGE_MARGIN = PROTRACTOR_HANDLE_Y + PROTRACTOR_HANDLE_RADIUS + 6

/**
 * Keep the protractor origin far enough from the viewBox edge that the rotation handle (and the
 * origin grip) stay inside and reachable at any rotation.
 */
export const clampProtractorPose = (pose: ProtractorPose): ProtractorPose => {
  const clamp = (v: number, size: number) =>
    Math.min(size - PROTRACTOR_EDGE_MARGIN, Math.max(PROTRACTOR_EDGE_MARGIN, v))
  return { ...pose, x: clamp(pose.x, PROTRACTOR_VIEWBOX.w), y: clamp(pose.y, PROTRACTOR_VIEWBOX.h) }
}
