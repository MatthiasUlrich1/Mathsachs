import { describe, expect, it } from 'vitest'
import {
  PROTRACTOR_SNAP_DISTANCE,
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

  it('starts the loose protractor off the vertex and not aligned to the first leg', () => {
    for (let angle = 1; angle < 180; angle += 7) {
      const pose = measureStartPose(angle, 0)
      expect(Math.hypot(pose.x - V.x, pose.y - V.y)).toBeGreaterThan(PROTRACTOR_SNAP_DISTANCE)
      expect(pose.rot % 360).not.toBe(0)
    }
  })
})
