/**
 * Pure geometry for the virtual ruler (RulerMeasure).
 * All lengths are SVG units (viewBox), never screen pixels, so behaviour is
 * identical at 375 px and on desktop. Angles are mathematical (counter-clockwise,
 * 0 degrees = pointing right) unless a name says "svg".
 */
import { directionDegrees, normalizeDegrees, pointAt, type Point } from './protractorGeometry'

export type { Point }
export { directionDegrees, normalizeDegrees, pointAt }

export const RULER_VIEWBOX = { w: 640, h: 380 } as const
/** Start point of the segment (the 0 mark of the ruler snaps here). */
export const RULER_ORIGIN = { x: 60, y: 190 } as const
export const RULER_DEFAULT_UNIT_PX = 40
/** Allowed range of SVG units per cm. */
export const RULER_MIN_UNIT_PX = 20
export const RULER_MAX_UNIT_PX = 40
/** Allowed segment lengths in cm. */
export const RULER_MIN_CM = 0.5
export const RULER_MAX_CM = 12
/** Allowed tilt of the segment in degrees (keeps segment and ruler inside the viewBox). */
export const RULER_MAX_ANGLE = 15
/** Graduated length of the ruler in cm. */
export const RULER_CM = 13
/** Ruler body: extends this far before the 0 mark and this high above the edge (SVG units). */
export const RULER_PAD = 10
export const RULER_BODY_HEIGHT = 44
/** Rotation handle: below the edge, near the far end (local units). */
export const RULER_HANDLE_OFFSET_X = 24
export const RULER_HANDLE_Y = 26
export const RULER_HANDLE_RADIUS = 13
/** The 0 mark snaps onto the segment end within this distance. */
export const RULER_SNAP_DISTANCE = 12

export interface RulerPose {
  x: number
  y: number
  /** Rotation in degrees, counter-clockwise. */
  rot: number
}

/** Ruler length in SVG units. */
export const rulerLength = (unitPx: number): number => RULER_CM * unitPx

/** Round a length in cm to 0.1. */
export const roundCm = (cm: number): number => Math.round(cm * 10) / 10

/** Snap the ruler origin onto the segment end point when close enough. */
export const snapToEnd = (p: Point, end: Point = RULER_ORIGIN): Point => {
  const d = Math.hypot(p.x - end.x, p.y - end.y)
  return d <= RULER_SNAP_DISTANCE ? { x: end.x, y: end.y } : p
}

/** The ruler turns onto the segment direction when this close (degrees) while its 0 mark sits on the start. */
export const RULER_SNAP_ROTATION = 3

/** Snap a rotation onto the segment direction within RULER_SNAP_ROTATION degrees. */
export const snapRotation = (rot: number, segmentAngle: number): number => {
  const diff = ((rot - segmentAngle + 540) % 360) - 180
  return Math.abs(diff) <= RULER_SNAP_ROTATION ? normalizeDegrees(segmentAngle) : rot
}

/** End point of the segment of `lengthCm` from the origin with tilt `angle`. */
export const segmentEnd = (lengthCm: number, angle: number, unitPx: number): Point =>
  pointAt(RULER_ORIGIN, angle, lengthCm * unitPx)

const alongRuler = (pointer: Point, angle: number, origin: Point): number => {
  const a = (angle * Math.PI) / 180
  return (pointer.x - origin.x) * Math.cos(a) - (pointer.y - origin.y) * Math.sin(a)
}

/**
 * Length in cm (rounded to 0.1, clamped 0.1..RULER_CM) of the pointer's
 * projection onto the ruler edge starting at the origin, plus a grab offset.
 */
export const lengthFromPointer = (
  pointer: Point,
  angle: number,
  unitPx: number,
  grabOffsetCm = 0,
  origin: Point = RULER_ORIGIN,
): number =>
  Math.min(
    RULER_CM,
    Math.max(0.1, roundCm(alongRuler(pointer, angle, origin) / unitPx + grabOffsetCm)),
  )

/** Offset (cm) between the current handle position and where it was grabbed. */
export const lengthGrabOffset = (
  pointer: Point,
  angle: number,
  unitPx: number,
  currentCm: number,
  origin: Point = RULER_ORIGIN,
): number => currentCm - alongRuler(pointer, angle, origin) / unitPx

/**
 * Where the learner's segment end starts in draw mode: clearly away from the
 * target (at least 2.5 cm) so the start position never spoils the answer.
 */
export const drawStartLength = (lengthCm: number): number => {
  const offset = 2.5 + ((Math.round(lengthCm * 10) * 7) % 15) / 10
  const up = lengthCm + offset
  return roundCm(up <= 12.5 ? up : Math.max(0.1, lengthCm - offset))
}

/** Start pose of the loose ruler in measure mode: off the end point and not aligned. */
export const rulerStartPose = (lengthCm: number, angle: number): RulerPose => ({
  x: 50,
  y: 335,
  rot: normalizeDegrees(4 + ((Math.round(lengthCm * 10) + Math.round(angle) * 3 + 80) % 8)),
})

/** Local-frame corners and handle extremes of the ruler (y down, origin = 0 mark). */
export const rulerLocalExtremes = (unitPx: number): Point[] => {
  const len = rulerLength(unitPx)
  const hx = len - RULER_HANDLE_OFFSET_X
  const hy = RULER_HANDLE_Y
  const r = RULER_HANDLE_RADIUS
  return [
    { x: -RULER_PAD, y: -RULER_BODY_HEIGHT },
    { x: len, y: -RULER_BODY_HEIGHT },
    { x: -RULER_PAD, y: 0 },
    { x: len, y: 0 },
    { x: hx - r, y: hy + r },
    { x: hx + r, y: hy + r },
  ]
}

/** Map a ruler-local point to the SVG for a pose (rotation is counter-clockwise on screen). */
export const rulerLocalToSvg = (pose: RulerPose, p: Point): Point => {
  const a = (pose.rot * Math.PI) / 180
  return {
    x: pose.x + p.x * Math.cos(a) + p.y * Math.sin(a),
    y: pose.y - p.x * Math.sin(a) + p.y * Math.cos(a),
  }
}

/** Visible margin (SVG units) that the grab points keep to the viewBox edge. */
export const RULER_EDGE_MARGIN = 14

/** Centre of the rotation handle for a pose (SVG units). */
export const rulerHandleCentre = (pose: RulerPose, unitPx: number): Point =>
  rulerLocalToSvg(pose, { x: rulerLength(unitPx) - RULER_HANDLE_OFFSET_X, y: RULER_HANDLE_Y })

/**
 * Shift the pose so that the 0 mark (move grip) and the rotation handle both stay inside the
 * viewBox with RULER_EDGE_MARGIN to spare. Rotation is untouched. If both cannot fit, the shift is
 * split evenly so neither is lost by more than necessary.
 */
export const clampRulerPose = (pose: RulerPose, unitPx: number): RulerPose => {
  const pts = [{ x: pose.x, y: pose.y }, rulerHandleCentre(pose, unitPx)]
  const shiftFor = (key: 'x' | 'y', size: number): number => {
    const lo = Math.max(...pts.map((p) => RULER_EDGE_MARGIN - p[key]))
    const hi = Math.min(...pts.map((p) => size - RULER_EDGE_MARGIN - p[key]))
    return lo <= hi ? Math.min(hi, Math.max(lo, 0)) : (lo + hi) / 2
  }
  return { ...pose, x: pose.x + shiftFor('x', RULER_VIEWBOX.w), y: pose.y + shiftFor('y', RULER_VIEWBOX.h) }
}
