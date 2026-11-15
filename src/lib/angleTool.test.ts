import { describe, expect, it } from 'vitest'
import {
  angleBetweenDeg,
  emptyCoordinateScene,
  hasAngleAt,
  hasPointOnRay,
  hasRayIntersectionAt,
  rayIntersection,
  type CoordinateScene,
  type GraphObject,
} from './coordinateScene'
import { angleLegFromPointer, angleReleasePointer } from './angleToolLogic'

const rad = (deg: number) => (deg * Math.PI) / 180
const rayAt = (id: string, ox: number, oy: number, deg: number): GraphObject => ({
  id,
  kind: 'ray',
  x1: ox,
  y1: oy,
  x2: ox + 4 * Math.cos(rad(deg)),
  y2: oy + 4 * Math.sin(rad(deg)),
})
const sceneWith = (...objs: GraphObject[]): CoordinateScene =>
  emptyCoordinateScene({
    xRange: [-8, 8],
    yRange: [-8, 8],
    objects: [
      { id: 'A', kind: 'point', x: 0, y: 0, label: 'A', fixed: true },
      { id: 'B', kind: 'point', x: 5, y: 0, label: 'B', fixed: true },
      ...objs,
    ],
  })

describe('hasAngleAt', () => {
  it('accepts the correct angle at the vertex', () => {
    expect(hasAngleAt(sceneWith(rayAt('r', 0, 0, 52)), 'A', 'B', 52)).toBe(true)
  })

  it('accepts 1 degree off, rejects 2 degrees off', () => {
    expect(hasAngleAt(sceneWith(rayAt('r', 0, 0, 51)), 'A', 'B', 52)).toBe(true)
    expect(hasAngleAt(sceneWith(rayAt('r', 0, 0, 50)), 'A', 'B', 52)).toBe(false)
    expect(hasAngleAt(sceneWith(rayAt('r', 0, 0, 54)), 'A', 'B', 52)).toBe(false)
  })

  it('rejects the right angle at the wrong vertex', () => {
    expect(hasAngleAt(sceneWith(rayAt('r', 3, 3, 52)), 'A', 'B', 52)).toBe(false)
    expect(hasAngleAt(sceneWith(rayAt('r', 0, 0, 52)), 'B', 'A', 52)).toBe(false)
    expect(hasAngleAt(sceneWith(rayAt('r', 0, 0, 52)), 'unknown', 'B', 52)).toBe(false)
  })

  it('counts the mirrored orientation (other side of the first leg) as correct', () => {
    expect(hasAngleAt(sceneWith(rayAt('r', 0, 0, -52)), 'A', 'B', 52)).toBe(true)
  })

  it('measures the smaller angle for obtuse values and from the other base point', () => {
    expect(hasAngleAt(sceneWith(rayAt('r', 0, 0, 127)), 'A', 'B', 127)).toBe(true)
    expect(hasAngleAt(sceneWith(rayAt('r', 0, 0, -127)), 'A', 'B', 127)).toBe(true)
    // at B the first leg points towards A (180 degrees); direction 127 degrees is 53 degrees away from it
    expect(hasAngleAt(sceneWith(rayAt('r', 5, 0, 127)), 'B', 'A', 53)).toBe(true)
    expect(hasAngleAt(sceneWith(rayAt('r', 5, 0, 127)), { x: 5, y: 0 }, { x: 0, y: 0 }, 53)).toBe(true)
  })

  it('only rays count: a segment at the right angle is not an angle leg', () => {
    const seg: GraphObject = { id: 's', kind: 'segment', x1: 0, y1: 0, x2: 3, y2: 3 }
    expect(hasAngleAt(sceneWith(seg), 'A', 'B', 45)).toBe(false)
  })

  it('does not accept a missing ray or the first leg itself (0 degrees)', () => {
    expect(hasAngleAt(sceneWith(), 'A', 'B', 52)).toBe(false)
    expect(hasAngleAt(sceneWith(rayAt('r', 0, 0, 0)), 'A', 'B', 52)).toBe(false)
  })
})

describe('rayIntersection / hasRayIntersectionAt', () => {
  it('finds the unique intersection of the angle legs at A and B', () => {
    // alpha = 53 at A, beta = 45 at B (c = 7): C is about (3|4)
    const p = rayIntersection(
      { x1: 0, y1: 0, x2: Math.cos(rad(53)), y2: Math.sin(rad(53)) },
      { x1: 7, y1: 0, x2: 7 - Math.cos(rad(45)), y2: Math.sin(rad(45)) },
    )
    expect(p!.x).toBeCloseTo(3.01, 1)
    expect(p!.y).toBeCloseTo(3.99, 1)
  })

  it('returns null for parallel rays and for rays that meet only behind their origin', () => {
    expect(rayIntersection({ x1: 0, y1: 0, x2: 1, y2: 0 }, { x1: 0, y1: 1, x2: 1, y2: 1 })).toBeNull()
    expect(rayIntersection({ x1: 0, y1: 0, x2: 1, y2: 1 }, { x1: 5, y1: 0, x2: 6, y2: -1 })).toBeNull()
  })

  it('same-side legs meet at C, legs on opposite sides of the base never do', () => {
    const rayTo = (id: string, ox: number, oy: number, tx: number, ty: number): GraphObject => ({
      id,
      kind: 'ray',
      x1: ox,
      y1: oy,
      x2: tx,
      y2: ty,
    })
    const same = sceneWith(rayTo('a', 0, 0, 3, 4), rayTo('b', 7, 0, 3, 4))
    expect(hasRayIntersectionAt(same, 3, 4)).toBe(true)
    expect(hasRayIntersectionAt(same, 3, -4)).toBe(false)
    expect(hasRayIntersectionAt(same, 3.6, 4)).toBe(false)
    const opposite = sceneWith(rayTo('a', 0, 0, 3, 4), rayTo('b', 7, 0, 3, -4))
    expect(hasRayIntersectionAt(opposite, 3, 4)).toBe(false)
    expect(hasRayIntersectionAt(opposite, 3, -4)).toBe(false)
  })
})

describe('angleLegFromPointer (live value equals committed value)', () => {
  const V = { x: 1, y: 1 }
  const L = { x: 6, y: 1 }

  it('rounds to whole degrees and the committed ray measures exactly that', () => {
    for (const pointer of [
      { x: 4.1, y: 3.3 },
      { x: 0, y: 4 },
      { x: 5, y: 0 },
      { x: -2, y: 1.4 },
    ]) {
      const leg = angleLegFromPointer(V, L, pointer)!
      expect(Number.isInteger(leg.deg)).toBe(true)
      const committed = angleBetweenDeg(
        { x: L.x - V.x, y: L.y - V.y },
        { x: leg.end.x - V.x, y: leg.end.y - V.y },
      )!
      expect(committed).toBeCloseTo(leg.deg, 3)
      const scene = sceneWith({ id: 'r', kind: 'ray', x1: V.x, y1: V.y, x2: leg.end.x, y2: leg.end.y })
      expect(hasAngleAt(scene, V, L, leg.deg, 0.01)).toBe(true)
    }
  })

  it('goes to the side of the pointer (mirrored) with the same value', () => {
    const up = angleLegFromPointer(V, L, { x: 4, y: 4 })!
    const down = angleLegFromPointer(V, L, { x: 4, y: -2 })!
    expect(up.deg).toBe(45)
    expect(down.deg).toBe(45)
    expect(up.end.y).toBeGreaterThan(V.y)
    expect(down.end.y).toBeLessThan(V.y)
  })

  it('a pointer at about 52 degrees gives exactly 52; degenerate pointers give nothing', () => {
    const p = { x: V.x + 3 * Math.cos(rad(52.3)), y: V.y + 3 * Math.sin(rad(52.3)) }
    expect(angleLegFromPointer(V, L, p)!.deg).toBe(52)
    expect(angleLegFromPointer(V, L, V)).toBeNull()
    expect(angleLegFromPointer(V, L, { x: 4, y: 1 })).toBeNull() // along the first leg: 0 degrees
    expect(angleLegFromPointer(V, V, { x: 4, y: 4 })).toBeNull()
  })

  it('caps the straight angle at 179', () => {
    expect(angleLegFromPointer(V, L, { x: -3, y: 1 })!.deg).toBe(179)
  })
})

describe('hasPointOnRay', () => {
  const scene = sceneWith({ id: 'r', kind: 'ray', x1: 0, y1: 0, x2: 3, y2: 4 })
  it('accepts points on the ray, also beyond its drawn end', () => {
    expect(hasPointOnRay(scene, 'A', 3, 4)).toBe(true)
    expect(hasPointOnRay(scene, 'A', 6, 8)).toBe(true)
  })
  it('rejects points behind the origin and mirrored points', () => {
    expect(hasPointOnRay(scene, 'A', -3, -4)).toBe(false)
    expect(hasPointOnRay(scene, 'A', 3, -4)).toBe(false)
  })
  it('respects tol: just inside passes, more than tol off fails', () => {
    expect(hasPointOnRay(scene, 'A', 3.2, 3.8, 0.35)).toBe(true)
    expect(hasPointOnRay(scene, 'A', 4, 4, 0.35)).toBe(false)
  })
  it('needs the ray to start at the given origin and a known origin', () => {
    expect(hasPointOnRay(scene, 'B', 3, 4)).toBe(false)
    expect(hasPointOnRay(scene, 'nope', 3, 4)).toBe(false)
  })
})

describe('angleReleasePointer (pointer cancel aborts, release commits)', () => {
  const hover = { x: 2, y: 3 }
  const released = { x: 2.1, y: 3.1 }
  it('commits the last hover position on release', () => {
    expect(angleReleasePointer(true, false, hover, released)).toBe(hover)
    expect(angleReleasePointer(true, false, null, released)).toBe(released)
  })
  it('never commits on pointercancel or without a drag', () => {
    expect(angleReleasePointer(true, true, hover, released)).toBeNull()
    expect(angleReleasePointer(false, false, hover, released)).toBeNull()
  })
})
