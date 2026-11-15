/**
 * Pure maths and layout for the clock with draggable hands (clockTask).
 * Time is stored as hour 0..11 (0 = 12 o'clock) and minute 0..59. The hour hand moves along with the minute hand
 * like on a real clock: hour angle = h * 30 + m * 0.5. Angles are degrees clockwise from 12 o'clock.
 * All coordinates are SVG units.
 */

export const CK_DEFAULT_SNAP = 5
export const CK_ALLOWED_SNAPS: readonly number[] = [1, 5]
export const CK_DEFAULT_ANGLE_TOLERANCE = 2.5

export const CK_VIEWBOX = 320
export const CK_C = 160
/** Radius of the clock face (rim). */
export const CK_R = 146
/** Tick lengths (inwards from the rim): minute ticks and the longer 5-minute ticks. */
export const CK_TICK_SHORT = 6
export const CK_TICK_LONG = 14
export const CK_NUM_FONT = 20
/** Radius on which the 12 numbers are centred. */
export const CK_NUM_R = 112
/** Distance of the knob (hand tip) from the centre. */
export const CK_MINUTE_LEN = 90
export const CK_HOUR_LEN = 58
export const CK_KNOB_R = 10
/** Radius of the invisible hit area around a knob (at least 22 units). */
export const CK_HIT_R = 24

export type ClockHand = 'hour' | 'minute'
export interface ClockTime {
  /** 0..11 (0 stands for 12 o'clock). */
  h: number
  /** 0..59. */
  m: number
}

const round9 = (n: number): number => Math.round(n * 1e9) / 1e9
const mod = (n: number, d: number): number => ((n % d) + d) % d

/** The start state of every clock task: 12:00 (never depends on the answer). */
export const ckStart = (): ClockTime => ({ h: 0, m: 0 })

export const ckToMinutes = (t: ClockTime): number => mod(t.h, 12) * 60 + t.m
export const ckFromMinutes = (total: number): ClockTime => {
  const t = mod(Math.round(total), 720)
  return { h: Math.floor(t / 60), m: t % 60 }
}

export const ckHourAngle = (t: ClockTime): number => round9(mod(t.h, 12) * 30 + t.m * 0.5)
export const ckMinuteAngle = (t: ClockTime): number => round9(t.m * 6)

export const ckPoint = (angleDeg: number, radius: number): { x: number; y: number } => {
  const a = (angleDeg * Math.PI) / 180
  return { x: round9(CK_C + radius * Math.sin(a)), y: round9(CK_C - radius * Math.cos(a)) }
}

export const ckHandTip = (hand: ClockHand, t: ClockTime): { x: number; y: number } =>
  hand === 'hour' ? ckPoint(ckHourAngle(t), CK_HOUR_LEN) : ckPoint(ckMinuteAngle(t), CK_MINUTE_LEN)

/** Pointer position (SVG units) -> angle 0..360 clockwise from 12 o'clock around the centre. */
export const ckPointerAngle = (x: number, y: number): number => {
  const deg = (Math.atan2(x - CK_C, -(y - CK_C)) * 180) / Math.PI
  return mod(deg, 360)
}

/** Shortest way around the dial: a difference in degrees wrapped into -180..180. */
export const ckWrapDelta = (diff: number): number => {
  const d = mod(diff + 180, 360) - 180
  return d === -180 ? 180 : d
}

/** Estimated text width (same 0.6 em estimate as the other widgets). */
export const ckTextWidth = (text: string, fontSize: number): number => text.length * fontSize * 0.6

// ---------------------------------------------------------------------------
// Dragging: accumulate the movement so the hour is carried correctly past 12 in both directions
// ---------------------------------------------------------------------------

export interface ClockDrag {
  hand: ClockHand
  /** Continuous position: total minutes since 12:00 for the minute hand, hours (with fraction) for the hour hand. Not wrapped. */
  raw: number
  /** Pointer angle of the last move event. */
  lastAngle: number
}

/** Starts a drag: the pointer keeps its offset to the hand, nothing jumps. */
export const ckDragStart = (hand: ClockHand, t: ClockTime, pointerAngle: number): ClockDrag => ({
  hand,
  raw: hand === 'minute' ? ckToMinutes(t) : mod(t.h, 12) + t.m / 60,
  lastAngle: pointerAngle,
})

/** Moves the drag by the pointer's way along the dial since the last event (shortest path, so 12 o'clock is no jump). */
export const ckDragMove = (drag: ClockDrag, pointerAngle: number): ClockDrag => {
  const delta = ckWrapDelta(pointerAngle - drag.lastAngle)
  return { hand: drag.hand, raw: drag.raw + delta / (drag.hand === 'minute' ? 6 : 30), lastAngle: pointerAngle }
}

/**
 * The time a drag shows. The minute hand snaps the total minutes (the hour follows, also across 12 in both directions),
 * the hour hand moves in whole hours and keeps the minutes.
 */
export const ckDragTime = (drag: ClockDrag, current: ClockTime, snap: number): ClockTime => {
  if (drag.hand === 'minute') return ckFromMinutes(Math.round(drag.raw / snap) * snap)
  return { h: mod(Math.round(drag.raw - current.m / 60), 12), m: current.m }
}

/** Keyboard: the minute hand moves one snap step (the hour follows), the hour hand one whole hour. */
export const ckNudge = (hand: ClockHand, t: ClockTime, delta: number, snap: number): ClockTime =>
  hand === 'minute' ? ckFromMinutes(ckToMinutes(t) + delta * snap) : { h: mod(t.h + delta, 12), m: t.m }

/** The hand whose knob is nearest to the pointer within the hit radius, or null. A tie goes to the minute hand. */
export const ckNearestHand = (t: ClockTime, x: number, y: number): ClockHand | null => {
  const dm = Math.hypot(ckHandTip('minute', t).x - x, ckHandTip('minute', t).y - y)
  const dh = Math.hypot(ckHandTip('hour', t).x - x, ckHandTip('hour', t).y - y)
  if (dm > CK_HIT_R && dh > CK_HIT_R) return null
  return dm <= dh ? 'minute' : 'hour'
}

// ---------------------------------------------------------------------------
// Checking
// ---------------------------------------------------------------------------

/** The smaller angle between the hands in degrees (0..180). */
export const ckAngleBetween = (t: ClockTime): number => {
  const diff = mod(Math.abs(mod(t.h, 12) * 30 - 5.5 * t.m), 360)
  return round9(diff > 180 ? 360 - diff : diff)
}

const validTime = (t: unknown): t is ClockTime => {
  const x = t as ClockTime
  return !!x && Number.isFinite(x.h) && Number.isFinite(x.m)
}

/** Analog clock: 3:00 and 15:00 are the same. */
export const ckMatchesTime = (target: ClockTime, answer: ClockTime): boolean =>
  validTime(answer) && mod(answer.h, 12) === mod(target.h, 12) && answer.m === target.m

export const ckMatchesAngle = (angle: number, answer: ClockTime, tolerance: number): boolean =>
  validTime(answer) && Math.abs(ckAngleBetween(answer) - angle) <= tolerance + 1e-9

/** The clock has been moved at least once. */
export const ckTouched = (value: { touched?: boolean } | null | undefined): boolean => value?.touched === true

/** "7:25" style (12 for hour 0), as written on a digital clock. */
export const ckFormatTime = (t: ClockTime): string => `${t.h % 12 === 0 ? 12 : t.h % 12}:${String(t.m).padStart(2, '0')}`

/** Spoken for screen readers: "7 Uhr 25". */
export const ckSpokenTime = (t: ClockTime): string => `${t.h % 12 === 0 ? 12 : t.h % 12} Uhr${t.m ? ` ${t.m}` : ''}`

/** A reachable time (on the minute grid) whose hands form `angle` within the tolerance, nearest first; null if none. */
export const ckFindTime = (angle: number, snap: number, tolerance: number): ClockTime | null => {
  let best: ClockTime | null = null
  let bestD = Infinity
  for (let h = 0; h < 12; h++) {
    for (let m = 0; m < 60; m += snap) {
      const d = Math.abs(ckAngleBetween({ h, m }) - angle)
      if (d < bestD - 1e-9) {
        best = { h, m }
        bestD = d
      }
    }
  }
  return best && bestD <= tolerance + 1e-9 ? best : null
}

const fail = (msg: string): never => {
  throw new Error(`clockTask: ${msg}`)
}

export const ckValidateSnap = (snap: number): void => {
  if (!CK_ALLOWED_SNAPS.includes(snap)) fail(`minuteSnap must be one of ${CK_ALLOWED_SNAPS.join(', ')}, got ${snap}`)
}

/** Target time of mode setTime: whole minutes on the snap grid, hour 0..23, and not 12:00 (the start state). */
export const ckValidateTime = (time: ClockTime, snap: number): void => {
  ckValidateSnap(snap)
  if (!time || !Number.isInteger(time.h) || time.h < 0 || time.h > 23) fail(`time.h must be a whole number from 0 to 23, got ${time?.h}`)
  if (!Number.isInteger(time.m) || time.m < 0 || time.m > 59) fail(`time.m must be a whole number from 0 to 59, got ${time.m}`)
  if (time.m % snap !== 0) fail(`time.m ${time.m} is not a multiple of minuteSnap (${snap})`)
  if (time.h % 12 === 0 && time.m === 0) fail('the target time 12:00 is the start state: an untouched clock would already be the answer')
}

/** Target angle of mode angle: 0 < angle <= 180, more than the tolerance (the start shows 0 degrees), and reachable. */
export const ckValidateAngle = (angle: number, snap: number, tolerance: number): void => {
  ckValidateSnap(snap)
  if (!Number.isFinite(tolerance) || tolerance < 0 || tolerance >= 15) fail(`tolerance must be at least 0 and below 15 degrees, got ${tolerance}`)
  if (!Number.isFinite(angle) || angle <= 0 || angle > 180) fail(`angle must be greater than 0 and at most 180, got ${angle}`)
  if (angle <= tolerance) fail(`angle ${angle} is within the tolerance of the start state (0 degrees at 12:00)`)
  if (!ckFindTime(angle, snap, tolerance)) fail(`no time with minuteSnap ${snap} forms ${angle} degrees within ${tolerance} degrees`)
}

// ---------------------------------------------------------------------------
// Face drawing shared by the component and the worksheet
// ---------------------------------------------------------------------------

export interface CkTick {
  x1: number
  y1: number
  x2: number
  y2: number
  major: boolean
}

/** 60 minute ticks; every fifth one is longer. */
export const ckTicks = (): CkTick[] =>
  Array.from({ length: 60 }, (_, i) => {
    const major = i % 5 === 0
    const a = ckPoint(i * 6, CK_R)
    const b = ckPoint(i * 6, CK_R - (major ? CK_TICK_LONG : CK_TICK_SHORT))
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y, major }
  })

/** The numbers 1..12 around the face. */
export const ckNumbers = (): Array<{ n: number; x: number; y: number }> =>
  Array.from({ length: 12 }, (_, i) => {
    const n = i + 1
    const p = ckPoint(n * 30, CK_NUM_R)
    return { n, x: p.x, y: p.y }
  })

/** Every number as text extent, for the viewBox fit test (the glyph box is centred on the point). */
export const ckNumberFits = (n: number, x: number, y: number): boolean => {
  const w = ckTextWidth(String(n), CK_NUM_FONT)
  return x - w / 2 >= 0 && x + w / 2 <= CK_VIEWBOX && y - CK_NUM_FONT / 2 >= 0 && y + CK_NUM_FONT / 2 <= CK_VIEWBOX
}

/** Empty clock face for the worksheet (ticks and numbers, no hands). The learner draws the hands. */
export const clockPrintSvg = (): string => {
  const out: string[] = [`<circle cx="${CK_C}" cy="${CK_C}" r="${CK_R}" fill="#fff" stroke="#0f172a" stroke-width="3"/>`]
  for (const t of ckTicks()) {
    out.push(`<line x1="${t.x1}" y1="${t.y1}" x2="${t.x2}" y2="${t.y2}" stroke="#0f172a" stroke-width="${t.major ? 2.5 : 1}"/>`)
  }
  for (const n of ckNumbers()) {
    out.push(`<text x="${n.x}" y="${n.y}" text-anchor="middle" dominant-baseline="central" font-size="${CK_NUM_FONT}" font-weight="700" fill="#0f172a">${n.n}</text>`)
  }
  out.push(`<circle cx="${CK_C}" cy="${CK_C}" r="4" fill="#0f172a"/>`)
  return `<svg width="${CK_VIEWBOX}" height="${CK_VIEWBOX}" viewBox="0 0 ${CK_VIEWBOX} ${CK_VIEWBOX}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Leeres Zifferblatt zum Einzeichnen der Zeiger">${out.join('')}</svg>`
}
