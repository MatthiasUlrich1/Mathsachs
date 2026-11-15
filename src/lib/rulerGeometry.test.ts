import { describe, expect, it } from 'vitest'
import {
  RULER_CM,
  RULER_EDGE_MARGIN,
  RULER_MAX_ROTATION,
  clampRulerPose,
  clampRulerRotation,
  rulerHandleCentre,
  RULER_HANDLE_RADIUS,
  RULER_MAX_ANGLE,
  RULER_ORIGIN as O,
  RULER_SNAP_DISTANCE,
  RULER_VIEWBOX as VB,
  drawStartLength,
  lengthFromPointer,
  lengthGrabOffset,
  pointAt,
  roundCm,
  rulerLocalExtremes,
  rulerLocalToSvg,
  rulerStartPose,
  segmentEnd,
  snapRotation,
  snapToEnd,
} from './rulerGeometry'

const inside = (p: { x: number; y: number }, pad = 0) =>
  p.x >= pad && p.x <= VB.w - pad && p.y >= pad && p.y <= VB.h - pad

describe('rulerGeometry', () => {
  it('snaps the 0 mark onto the end point within 12 SVG units only', () => {
    expect(snapToEnd({ x: O.x + 8, y: O.y + 8 })).toEqual({ x: O.x, y: O.y })
    expect(snapToEnd({ x: O.x + RULER_SNAP_DISTANCE, y: O.y })).toEqual({ x: O.x, y: O.y })
    const far = { x: O.x + RULER_SNAP_DISTANCE + 1, y: O.y }
    expect(snapToEnd(far)).toEqual(far)
  })

  it('snaps the rotation onto the segment direction within 3 degrees only', () => {
    expect(snapRotation(12, 10)).toBe(10)
    expect(snapRotation(6, 10)).toBe(6)
    expect(snapRotation(14, 10)).toBe(14)
    expect(snapRotation(358.5, -1)).toBe(359)
    expect(snapRotation(1, -1)).toBe(359)
  })

  it('turns a pointer position into a length rounded to 0.1 cm', () => {
    expect(lengthFromPointer(pointAt(O, 0, 4.34 * 40), 0, 40)).toBe(4.3)
    expect(lengthFromPointer(pointAt(O, 10, 7.26 * 30), 10, 30)).toBe(7.3)
    // perpendicular pointer movement does not change the length
    expect(lengthFromPointer({ x: O.x + 160, y: O.y + 50 }, 0, 40)).toBe(4)
    // clamps at both ends
    expect(lengthFromPointer({ x: O.x - 100, y: O.y }, 0, 40)).toBe(0.1)
    expect(lengthFromPointer({ x: O.x + 900, y: O.y }, 0, 40)).toBe(RULER_CM)
  })

  it('keeps the handle from jumping on grab', () => {
    const grab = pointAt(O, 0, 4.6 * 40)
    const off = lengthGrabOffset(grab, 0, 40, 4.5)
    expect(off).toBeCloseTo(-0.1, 6)
    expect(lengthFromPointer(grab, 0, 40, off)).toBe(4.5)
  })

  it('starts the draw handle at least 2.5 cm from the target, inside the ruler', () => {
    for (let t = 5; t <= 120; t++) {
      const target = t / 10
      const start = drawStartLength(target)
      expect(Math.abs(start - target)).toBeGreaterThanOrEqual(2.5 - 1e-9)
      expect(start).toBeGreaterThanOrEqual(0.1)
      expect(start).toBeLessThanOrEqual(12.5)
      expect(roundCm(start)).toBe(start)
    }
  })

  it('keeps ruler, handle and segment inside the viewBox (start pose and draw pose)', () => {
    for (const unitPx of [20, 30, 40]) {
      for (let t = 5; t <= 120; t += 5) {
        const lengthCm = t / 10
        for (let angle = -RULER_MAX_ANGLE; angle <= RULER_MAX_ANGLE; angle += 5) {
          const start = rulerStartPose(lengthCm, angle)
          const drawPose = { x: O.x, y: O.y, rot: angle }
          for (const pose of [start, drawPose]) {
            for (const p of rulerLocalExtremes(unitPx)) {
              expect(inside(rulerLocalToSvg(pose, p))).toBe(true)
            }
          }
          const end = segmentEnd(lengthCm, angle, unitPx)
          expect(inside(end, RULER_HANDLE_RADIUS)).toBe(true)
          // the draw handle may sit anywhere along the ruler
          const far = segmentEnd(drawStartLength(lengthCm), angle, unitPx)
          expect(inside(far, RULER_HANDLE_RADIUS)).toBe(true)
        }
      }
    }
  })

  it('starts the loose ruler off the end point and not aligned to the segment', () => {
    for (let t = 5; t <= 120; t += 7) {
      const pose = rulerStartPose(t / 10, 0)
      expect(Math.hypot(pose.x - O.x, pose.y - O.y)).toBeGreaterThan(RULER_SNAP_DISTANCE)
      expect(pose.rot).toBeGreaterThan(0)
    }
  })
})

describe('clampRulerPose', () => {
  const M = RULER_EDGE_MARGIN
  const inside = (p: { x: number; y: number }) =>
    p.x >= M - 1e-6 && p.x <= VB.w - M + 1e-6 && p.y >= M - 1e-6 && p.y <= VB.h - M + 1e-6
  it('keeps a pose that is inside unchanged', () => {
    const pose = { x: 60, y: 190, rot: 5 }
    expect(clampRulerPose(pose, 40)).toEqual(pose)
  })
  it('pulls the grips of the long ruler back inside for far-off positions (near-horizontal)', () => {
    for (const rot of [0, 5, 15, 345, 180, 195]) {
      for (const [x, y] of [[-500, -500], [2000, 2000], [-100, 190], [700, 10], [320, 900]] as const) {
        const c = clampRulerPose({ x, y, rot }, 40)
        expect(c.rot).toBe(rot)
        expect(inside({ x: c.x, y: c.y }) && inside(rulerHandleCentre(c, 40)), `${x},${y},${rot}`).toBe(true)
      }
    }
  })
  it('keeps both grips inside for the short ruler at any rotation', () => {
    for (let rot = 0; rot < 360; rot += 10) {
      const c = clampRulerPose({ x: -900, y: 900, rot }, 20)
      expect(inside({ x: c.x, y: c.y }) && inside(rulerHandleCentre(c, 20)), `rot ${rot}`).toBe(true)
    }
  })
})

describe('clampRulerPose: 0 mark always inside', () => {
  const M = RULER_EDGE_MARGIN
  const inside = (p: { x: number; y: number }) => p.x >= M - 1e-6 && p.x <= VB.w - M + 1e-6 && p.y >= M - 1e-6 && p.y <= VB.h - M + 1e-6
  // The old behaviour: when both grips cannot fit, split the shift (midpoint) - this pushes both out.
  const oldMidpoint = (pose: { x: number; y: number; rot: number }, unitPx: number) => {
    const pts = [{ x: pose.x, y: pose.y }, rulerHandleCentre(pose, unitPx)]
    const f = (key: 'x' | 'y', size: number) => {
      const lo = Math.max(...pts.map((p) => M - p[key]))
      const hi = Math.min(...pts.map((p) => size - M - p[key]))
      return lo <= hi ? Math.min(hi, Math.max(lo, 0)) : (lo + hi) / 2
    }
    return { x: pose.x + f('x', VB.w), y: pose.y + f('y', VB.h) }
  }
  const starts = [[-300, 190], [900, 190], [320, -300], [320, 900], [5, 5], [630, 370], [5, 370], [630, 5]] as const
  it('sweeps all rotations, both unit sizes and positions near all edges', () => {
    let oldFailures = 0
    for (const unitPx of [20, 40]) {
      for (let rot = 0; rot < 360; rot += 5) {
        for (const [x, y] of starts) {
          const c = clampRulerPose({ x, y, rot }, unitPx)
          expect(c.rot).toBe(rot)
          expect(inside({ x: c.x, y: c.y }), `${unitPx} ${rot} ${x},${y}`).toBe(true)
          if (!inside(oldMidpoint({ x, y, rot }, unitPx))) oldFailures++
        }
      }
    }
    // negative control: the midpoint rule loses the 0 mark for some of these poses
    expect(oldFailures).toBeGreaterThan(0)
  })
})

describe('clampRulerRotation: both grips reachable at every allowed rotation', () => {
  const M = RULER_EDGE_MARGIN
  const ok = (p: { x: number; y: number }) =>
    p.x >= M - 1e-6 && p.x <= VB.w - M + 1e-6 && p.y >= M - 1e-6 && p.y <= VB.h - M + 1e-6
  const allowed = (r: number) => r <= RULER_MAX_ROTATION + 1e-9 || r >= 360 - RULER_MAX_ROTATION - 1e-9
  it('maps every rotation 0..359 into the allowed range and keeps allowed ones', () => {
    for (let r = 0; r < 360; r += 0.5) {
      const c = clampRulerRotation(r)
      expect(allowed(c), `${r} -> ${c}`).toBe(true)
      if (allowed(r)) expect(c).toBeCloseTo(r, 9)
    }
    expect(clampRulerRotation(90)).toBe(RULER_MAX_ROTATION)
    expect(clampRulerRotation(270)).toBe(360 - RULER_MAX_ROTATION)
    expect(clampRulerRotation(-10)).toBe(350)
  })
  it('keeps 0 mark and rotation handle inside at all allowed rotations, both units, all edges', () => {
    const starts = [[-300, 190], [900, 190], [320, -300], [320, 900], [5, 5], [630, 370], [5, 370], [630, 5]] as const
    for (const unitPx of [20, 40]) {
      for (let r = 0; r < 360; r += 0.5) {
        const rot = clampRulerRotation(r)
        for (const [x, y] of starts) {
          const c = clampRulerPose({ x, y, rot }, unitPx)
          expect(ok({ x: c.x, y: c.y }) && ok(rulerHandleCentre(c, unitPx)), `${unitPx} ${r} ${x},${y}`).toBe(true)
        }
      }
    }
  })
  it('keeps the existing start poses valid', () => {
    for (let rot = 4; rot <= 11; rot++) expect(clampRulerRotation(rot)).toBe(rot)
  })
})
