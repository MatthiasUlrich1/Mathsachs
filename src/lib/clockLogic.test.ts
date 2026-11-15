import { describe, expect, it } from 'vitest'
import {
  CK_C,
  CK_HIT_R,
  CK_KNOB_R,
  CK_VIEWBOX,
  ckAngleBetween,
  ckDragMove,
  ckDragStart,
  ckDragTime,
  ckFindTime,
  ckFormatTime,
  ckFromMinutes,
  ckHandTip,
  ckHourAngle,
  ckMatchesAngle,
  ckMatchesTime,
  ckMinuteAngle,
  ckNearestHand,
  ckNudge,
  ckNumberFits,
  ckNumbers,
  ckPointerAngle,
  ckStart,
  ckTicks,
  ckToMinutes,
  ckValidateAngle,
  ckValidateTime,
  ckWrapDelta,
  clockPrintSvg,
  type ClockDrag,
  type ClockTime,
} from './clockLogic'

/** Moves a drag along the dial through several pointer angles and returns the final time. */
const run = (hand: 'hour' | 'minute', start: ClockTime, angles: number[], snap = 5): ClockTime => {
  let drag: ClockDrag = ckDragStart(hand, start, angles[0]!)
  let t = start
  for (const a of angles.slice(1)) {
    drag = ckDragMove(drag, a)
    t = ckDragTime(drag, t, snap)
  }
  return t
}

describe('clock angles', () => {
  it('the hour hand moves along with the minutes: h * 30 + m * 0.5', () => {
    expect(ckHourAngle({ h: 7, m: 0 })).toBe(210)
    expect(ckHourAngle({ h: 7, m: 30 })).toBe(225)
    expect(ckHourAngle({ h: 0, m: 30 })).toBe(15)
    expect(ckMinuteAngle({ h: 3, m: 25 })).toBe(150)
  })

  it('the smaller angle between the hands is folded into 0..180', () => {
    expect(ckAngleBetween({ h: 0, m: 0 })).toBe(0)
    expect(ckAngleBetween({ h: 3, m: 0 })).toBe(90)
    expect(ckAngleBetween({ h: 9, m: 0 })).toBe(90)
    expect(ckAngleBetween({ h: 6, m: 0 })).toBe(180)
    expect(ckAngleBetween({ h: 7, m: 30 })).toBe(45)
    expect(ckAngleBetween({ h: 11, m: 30 })).toBe(165)
    expect(ckAngleBetween({ h: 4, m: 0 })).toBe(120)
    expect(ckAngleBetween({ h: 8, m: 0 })).toBe(120)
  })

  it('the start state is 12:00 and the pointer angle is clockwise from 12 o-clock', () => {
    expect(ckStart()).toEqual({ h: 0, m: 0 })
    expect(ckPointerAngle(CK_C, 0)).toBeCloseTo(0)
    expect(ckPointerAngle(CK_VIEWBOX, CK_C)).toBeCloseTo(90)
    expect(ckPointerAngle(CK_C, CK_VIEWBOX)).toBeCloseTo(180)
    expect(ckPointerAngle(0, CK_C)).toBeCloseTo(270)
    expect(ckWrapDelta(350)).toBe(-10)
    expect(ckWrapDelta(-350)).toBe(10)
  })

  it('minutes since 12 convert both ways', () => {
    expect(ckToMinutes({ h: 7, m: 25 })).toBe(445)
    expect(ckFromMinutes(445)).toEqual({ h: 7, m: 25 })
    expect(ckFromMinutes(-5)).toEqual({ h: 11, m: 55 })
    expect(ckFromMinutes(725)).toEqual({ h: 0, m: 5 })
  })
})

describe('clock dragging', () => {
  it('the minute hand carries the hour forward across 12 and back again', () => {
    // 11:55 -> pointer at the 12 and on to the 1: 12:05
    expect(run('minute', { h: 11, m: 55 }, [330, 355, 5, 30])).toEqual({ h: 0, m: 5 })
    // 12:05 -> back past the 12: 11:55
    expect(run('minute', { h: 0, m: 5 }, [30, 5, 355, 330])).toEqual({ h: 11, m: 55 })
    // 2:50 -> 3:05 (the hour moves on, the pointer crosses the 12 of the dial)
    expect(run('minute', { h: 2, m: 50 }, [300, 330, 359, 10, 30])).toEqual({ h: 3, m: 5 })
  })

  it('a full turn of the minute hand adds one hour, also backwards', () => {
    expect(run('minute', { h: 0, m: 0 }, [0, 90, 180, 270, 359, 90, 180, 270, 359, 0])).toEqual({ h: 2, m: 0 })
    expect(run('minute', { h: 5, m: 0 }, [0, 270, 180, 90, 1, 270, 180, 90, 1, 0])).toEqual({ h: 3, m: 0 })
  })

  it('the minute hand snaps to 5 or 1 minutes and keeps the grab offset', () => {
    // pressed 2 minutes (12 degrees) beside the tip, moved 30 degrees on: +5 minutes
    expect(run('minute', { h: 3, m: 20 }, [132, 162])).toEqual({ h: 3, m: 25 })
    expect(run('minute', { h: 3, m: 20 }, [120, 122], 1)).toEqual({ h: 3, m: 20 }) // 2 degrees is a third of a minute
    expect(run('minute', { h: 3, m: 20 }, [120, 127], 1)).toEqual({ h: 3, m: 21 })
    expect(run('minute', { h: 3, m: 20 }, [120, 132], 5)).toEqual({ h: 3, m: 20 })
    expect(run('minute', { h: 3, m: 20 }, [120, 138], 5)).toEqual({ h: 3, m: 25 })
  })

  it('the hour hand moves in whole hours, keeps the minutes and wraps from 11 to 12', () => {
    expect(run('hour', { h: 3, m: 40 }, [110, 140])).toEqual({ h: 4, m: 40 })
    expect(run('hour', { h: 11, m: 20 }, [340, 10])).toEqual({ h: 0, m: 20 })
    expect(run('hour', { h: 0, m: 20 }, [10, 340])).toEqual({ h: 11, m: 20 })
    expect(run('hour', { h: 3, m: 40 }, [110, 112])).toEqual({ h: 3, m: 40 })
  })

  it('keyboard: the minute hand moves one snap step (carrying the hour), the hour hand one hour', () => {
    expect(ckNudge('minute', { h: 3, m: 55 }, 1, 5)).toEqual({ h: 4, m: 0 })
    expect(ckNudge('minute', { h: 0, m: 0 }, -1, 5)).toEqual({ h: 11, m: 55 })
    expect(ckNudge('minute', { h: 6, m: 14 }, 1, 1)).toEqual({ h: 6, m: 15 })
    expect(ckNudge('hour', { h: 11, m: 25 }, 1, 5)).toEqual({ h: 0, m: 25 })
    expect(ckNudge('hour', { h: 0, m: 25 }, -1, 5)).toEqual({ h: 11, m: 25 })
  })

  it('the nearest knob wins when both hit areas overlap, and a far press hits none', () => {
    const t = { h: 0, m: 0 } // both hands up: tips 58 and 90 above the centre
    const hour = ckHandTip('hour', t)
    const minute = ckHandTip('minute', t)
    expect(ckNearestHand(t, hour.x, hour.y + 3)).toBe('hour')
    expect(ckNearestHand(t, minute.x, minute.y)).toBe('minute')
    expect(ckNearestHand(t, CK_C, CK_C + 100)).toBeNull()
  })
})

describe('clock checks', () => {
  it('a time matches modulo 12 hours (analog clock)', () => {
    expect(ckMatchesTime({ h: 15, m: 0 }, { h: 3, m: 0 })).toBe(true)
    expect(ckMatchesTime({ h: 3, m: 0 }, { h: 3, m: 5 })).toBe(false)
    expect(ckMatchesTime({ h: 3, m: 0 }, { h: 9, m: 0 })).toBe(false)
  })

  it('an angle matches within the tolerance', () => {
    expect(ckMatchesAngle(90, { h: 3, m: 0 }, 2.5)).toBe(true)
    expect(ckMatchesAngle(90, { h: 3, m: 5 }, 2.5)).toBe(false) // 62.5
    expect(ckMatchesAngle(120, { h: 4, m: 0 }, 2.5)).toBe(true)
    expect(ckMatchesAngle(45, { h: 7, m: 30 }, 2.5)).toBe(true)
    expect(ckMatchesAngle(47, { h: 7, m: 30 }, 2.5)).toBe(true)
    expect(ckMatchesAngle(48, { h: 7, m: 30 }, 2.5)).toBe(false)
  })

  it('finds a reachable time, nearest first, or none', () => {
    expect(ckFindTime(90, 5, 2.5)).toEqual({ h: 3, m: 0 })
    expect(ckAngleBetween(ckFindTime(45, 5, 2.5)!)).toBe(45)
    expect(ckFindTime(180, 5, 2.5)).toEqual({ h: 6, m: 0 })
    expect(ckFindTime(90, 5, 0)).not.toBeNull()
    expect(ckFindTime(17, 5, 0)).toBeNull() // no multiple-of-5 time forms exactly 17 degrees
    expect(ckFindTime(17, 1, 0.5)).not.toBeNull()
  })

  it('formats a time as written on a digital clock', () => {
    expect(ckFormatTime({ h: 0, m: 5 })).toBe('12:05')
    expect(ckFormatTime({ h: 7, m: 25 })).toBe('7:25')
  })

  it('validates targets', () => {
    expect(() => ckValidateTime({ h: 7, m: 25 }, 5)).not.toThrow()
    expect(() => ckValidateTime({ h: 0, m: 0 }, 5)).toThrow(/start state/)
    expect(() => ckValidateTime({ h: 12, m: 0 }, 5)).toThrow(/start state/)
    expect(() => ckValidateTime({ h: 24, m: 0 }, 5)).toThrow(/time\.h/)
    expect(() => ckValidateTime({ h: 7, m: 23 }, 5)).toThrow(/multiple/)
    expect(() => ckValidateTime({ h: 7, m: 23 }, 1)).not.toThrow()
    expect(() => ckValidateTime({ h: 7, m: 25 }, 3)).toThrow(/minuteSnap/)
    expect(() => ckValidateAngle(90, 5, 2.5)).not.toThrow()
    expect(() => ckValidateAngle(0, 5, 2.5)).toThrow(/greater than 0/)
    expect(() => ckValidateAngle(2, 5, 2.5)).toThrow(/start state/)
    expect(() => ckValidateAngle(181, 5, 2.5)).toThrow(/at most 180/)
    expect(() => ckValidateAngle(17, 5, 0)).toThrow(/no time/)
  })
})

describe('clock face layout', () => {
  it('has 60 ticks with 12 longer ones and the numbers 1 to 12', () => {
    const ticks = ckTicks()
    expect(ticks).toHaveLength(60)
    expect(ticks.filter((t) => t.major)).toHaveLength(12)
    const len = (t: (typeof ticks)[number]) => Math.hypot(t.x2 - t.x1, t.y2 - t.y1)
    expect(len(ticks[0]!)).toBeGreaterThan(len(ticks[1]!))
    expect(ckNumbers().map((n) => n.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    const twelve = ckNumbers()[11]!
    expect(twelve.x).toBeCloseTo(CK_C, 6)
    expect(twelve.y).toBeLessThan(CK_C)
  })

  it('every number fits inside the viewBox', () => {
    for (const n of ckNumbers()) expect(ckNumberFits(n.n, n.x, n.y), String(n.n)).toBe(true)
    expect(ckNumberFits(12, CK_VIEWBOX - 2, 20)).toBe(false) // negative control
  })

  it('knobs and their hit areas stay inside the viewBox for every time, and the hit area is at least 22', () => {
    expect(CK_HIT_R).toBeGreaterThanOrEqual(22)
    for (let total = 0; total < 720; total += 1) {
      const t = ckFromMinutes(total)
      for (const hand of ['hour', 'minute'] as const) {
        const tip = ckHandTip(hand, t)
        const r = CK_HIT_R
        expect(tip.x - r).toBeGreaterThanOrEqual(0)
        expect(tip.x + r).toBeLessThanOrEqual(CK_VIEWBOX)
        expect(tip.y - r).toBeGreaterThanOrEqual(0)
        expect(tip.y + r).toBeLessThanOrEqual(CK_VIEWBOX)
      }
    }
    expect(CK_KNOB_R).toBeLessThan(CK_HIT_R)
  })

  it('the worksheet face has ticks and numbers but no hands', () => {
    const svg = clockPrintSvg()
    expect(svg.match(/<line/g)).toHaveLength(60)
    expect(svg.match(/<text/g)).toHaveLength(12)
    expect(svg).toContain('viewBox="0 0 320 320"')
  })
})
