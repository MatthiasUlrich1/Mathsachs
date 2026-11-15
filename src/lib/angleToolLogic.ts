/**
 * Angle tool geometry (construction editor): given a vertex, a point on the first leg and the
 * pointer, the second leg is the first leg rotated towards the pointer by the whole-degree
 * angle shown in the live label. The label and the committed ray both come from this one
 * function, so the shown value is the committed value.
 */
type P = { x: number; y: number }

export type AngleLeg = {
  /** Angle between the legs in whole degrees, 1..179 (the smaller angle). */
  deg: number
  /** Point on the second leg (grid units); the ray runs from the vertex through it. */
  end: P
}

/** Min. length of the drawn leg in grid units. */
const MIN_LEG = 1

export function angleLegFromPointer(vertex: P, leg: P, pointer: P): AngleLeg | null {
  const dx = pointer.x - vertex.x
  const dy = pointer.y - vertex.y
  const dist = Math.hypot(dx, dy)
  if (dist < 0.2 || Math.hypot(leg.x - vertex.x, leg.y - vertex.y) < 1e-9) return null
  const t1 = Math.atan2(leg.y - vertex.y, leg.x - vertex.x)
  const t2 = Math.atan2(dy, dx)
  let d = ((t2 - t1) * 180) / Math.PI
  d = ((((d + 180) % 360) + 360) % 360) - 180 // (-180, 180]
  const deg = Math.min(179, Math.round(Math.abs(d)))
  if (deg < 1) return null
  const theta = t1 + (Math.sign(d) || 1) * ((deg * Math.PI) / 180)
  const len = Math.max(MIN_LEG, Math.round(dist * 10) / 10)
  const r6 = (n: number) => Math.round(n * 1e6) / 1e6
  return {
    deg,
    end: { x: r6(vertex.x + len * Math.cos(theta)), y: r6(vertex.y + len * Math.sin(theta)) },
  }
}

/**
 * Pointer position to commit when the pointer is released, or null when nothing is committed.
 * A cancelled gesture (pointercancel) never commits; the last hover position wins so the
 * committed value is the one the live label showed.
 */
export function angleReleasePointer(
  dragging: boolean,
  cancelled: boolean,
  hover: P | null,
  released: P | null,
): P | null {
  if (!dragging || cancelled) return null
  return hover ?? released
}
