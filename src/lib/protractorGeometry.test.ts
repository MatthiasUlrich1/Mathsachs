import { describe, expect, it } from 'vitest'
import {
  PROTRACTOR_HALF_WIDTH,
  PROTRACTOR_HANDLE_RADIUS,
  PROTRACTOR_HANDLE_Y,
  PROTRACTOR_SNAP_DISTANCE,
  PROTRACTOR_VIEWBOX as VB,
  legGrabOffset,
  PROTRACTOR_VERTEX as V,
  directionDegrees,
  legDegreesFromPointer,
  measureStartPose,
  pointAt,
  snapToVertex,
} from './protractorGeometry'

describe('protractorGeometry', () => {
  it('snaps the origin onto the vertex within 12 SVG units only', () => {
    expect(snapToVertex({ x: V.x + 8, y: V.y + 8 })).toEqual({ x: V.x, y: V.y })
    const near = { x: V.x + PROTRACTOR_SNAP_DISTANCE, y: V.y }
    expect(snapToVertex(near)).toEqual({ x: V.x, y: V.y })
    const far = { x: V.x + PROTRACTOR_SNAP_DISTANCE + 1, y: V.y }
    expect(snapToVertex(far)).toEqual(far)
  })

  it('round-trips direction and point', () => {
    for (const deg of [0, 30, 90, 135, 200, 359]) {
      expect(directionDegrees(V, pointAt(V, deg, 100))).toBeCloseTo(deg % 360, 6)
    }
  })

  it('turns a pointer position into a 1..179 integer leg angle', () => {
    expect(legDegreesFromPointer(pointAt(V, 47.2, 90), 0)).toBe(47)
    expect(legDegreesFromPointer(pointAt(V, 77, 90), 30)).toBe(47)
    // beyond the straight angle the handle clamps instead of jumping
    expect(legDegreesFromPointer(pointAt(V, 200, 90), 0)).toBe(179)
    expect(legDegreesFromPointer(pointAt(V, 300, 90), 0)).toBe(1)
  })

  it('keeps the whole instrument and handle inside the viewBox at the start pose', () => {
    const RT = PROTRACTOR_HALF_WIDTH
    const local = [
      { x: -RT, y: 0 },
      { x: RT, y: 0 },
      { x: 0, y: -RT },
      { x: -PROTRACTOR_HANDLE_RADIUS, y: PROTRACTOR_HANDLE_Y + PROTRACTOR_HANDLE_RADIUS },
      { x: PROTRACTOR_HANDLE_RADIUS, y: PROTRACTOR_HANDLE_Y + PROTRACTOR_HANDLE_RADIUS },
    ]
    for (let angle = 1; angle < 180; angle += 3) {
      for (const startAngle of [0, 45, 90, 180, 270]) {
        const pose = measureStartPose(angle, startAngle)
        const a = (pose.rot * Math.PI) / 180
        for (const p of local) {
          // local y is down; rotation is counter-clockwise on screen
          const x = pose.x + p.x * Math.cos(a) + p.y * Math.sin(a)
          const y = pose.y - p.x * Math.sin(a) + p.y * Math.cos(a)
          expect(x).toBeGreaterThanOrEqual(0)
          expect(x).toBeLessThanOrEqual(VB.w)
          expect(y).toBeGreaterThanOrEqual(0)
          expect(y).toBeLessThanOrEqual(VB.h)
        }
      }
    }
  })

  it('keeps the leg handle from jumping on grab', () => {
    const grabbed = pointAt(V, 50, 120)
    const off = legGrabOffset(grabbed, 0, 47)
    expect(off).toBeCloseTo(-3, 6)
    const again = legGrabOffset(pointAt(V, 47, 130), 0, 47)
    expect(again).toBeCloseTo(0, 6)
  })

  it('starts the loose protractor off the vertex and not aligned to the first leg', () => {
    for (let angle = 1; angle < 180; angle += 7) {
      const pose = measureStartPose(angle, 0)
      expect(Math.hypot(pose.x - V.x, pose.y - V.y)).toBeGreaterThan(PROTRACTOR_SNAP_DISTANCE)
      expect(pose.rot % 360).not.toBe(0)
    }
  })
})
