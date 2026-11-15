import { useRef, useState } from 'react'
import type { UserInput } from '../curriculum/types'
import {
  CK_C,
  CK_DEFAULT_SNAP,
  CK_HIT_R,
  CK_HOUR_LEN,
  CK_KNOB_R,
  CK_MINUTE_LEN,
  CK_NUM_FONT,
  CK_VIEWBOX,
  CK_R,
  ckDragMove,
  ckDragStart,
  ckDragTime,
  ckHandTip,
  ckHourAngle,
  ckMinuteAngle,
  ckNearestHand,
  ckNudge,
  ckNumbers,
  ckPoint,
  ckPointerAngle,
  ckSpokenTime,
  ckStart,
  ckTicks,
  type ClockDrag,
  type ClockHand,
  type ClockTime,
} from '../lib/clockLogic'
import './Clock.css'

type ClockValue = Extract<UserInput, { kind: 'clock' }>

export interface ClockProps {
  /** The minute hand snaps to multiples of this many minutes (1 or 5, default 5). */
  minuteSnap?: number
  value: ClockValue
  onChange: (value: UserInput) => void
  instruction?: string
  disabled?: boolean
}

const HANDS: ClockHand[] = ['hour', 'minute']
const HAND_NAME: Record<ClockHand, string> = { hour: 'Stundenzeiger', minute: 'Minutenzeiger' }

/**
 * Analog clock with two draggable hands (pointer events: mouse, touch, stylus; arrow keys for the focused hand).
 * The hour hand moves along with the minute hand like on a real clock. Untouched (`touched: false`) the clock shows 12:00.
 */
export const Clock: React.FC<ClockProps> = ({ minuteSnap = CK_DEFAULT_SNAP, value, onChange, instruction, disabled = false }) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const drag = useRef<ClockDrag | null>(null)
  const [dragging, setDragging] = useState<ClockHand | null>(null)
  const touched = value.touched === true
  const shown: ClockTime = touched ? { h: value.h, m: value.m } : ckStart()

  const commit = (next: ClockTime) => {
    // Only a real change counts as moving (a no-op drag keeps the clock untouched).
    if (next.h === shown.h && next.m === shown.m) return
    onChange({ kind: 'clock', h: next.h, m: next.m, touched: true })
  }

  const toSvg = (e: React.PointerEvent): { x: number; y: number } => {
    const r = svgRef.current?.getBoundingClientRect()
    const sx = r && r.width > 0 ? CK_VIEWBOX / r.width : 1
    const sy = r && r.height > 0 ? CK_VIEWBOX / r.height : 1
    const cx = Number.isFinite(e.clientX) ? e.clientX : 0
    const cy = Number.isFinite(e.clientY) ? e.clientY : 0
    return { x: (cx - (r?.left ?? 0)) * sx, y: (cy - (r?.top ?? 0)) * sy }
  }

  const onDown = (fallback: ClockHand) => (e: React.PointerEvent) => {
    if (disabled) return
    try {
      // Capture on the svg: it never moves in the DOM.
      svgRef.current?.setPointerCapture?.(e.pointerId)
    } catch {
      /* synthetic pointers have nothing to capture */
    }
    const p = toSvg(e)
    const hand = ckNearestHand(shown, p.x, p.y) ?? fallback
    // The drag follows the way the pointer travels, so the knob keeps its offset to the pointer.
    drag.current = ckDragStart(hand, shown, ckPointerAngle(p.x, p.y))
    setDragging(hand)
  }

  const onMove = (e: React.PointerEvent) => {
    const g = drag.current
    if (!g || disabled) return
    const p = toSvg(e)
    const next = ckDragMove(g, ckPointerAngle(p.x, p.y))
    drag.current = next
    commit(ckDragTime(next, shown, minuteSnap))
  }

  const onUp = () => {
    drag.current = null
    setDragging(null)
  }

  const onKey = (hand: ClockHand) => (e: React.KeyboardEvent) => {
    if (disabled) return
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    commit(ckNudge(hand, shown, delta, minuteSnap))
  }

  const hourEnd = ckPoint(ckHourAngle(shown), CK_HOUR_LEN)
  const minuteEnd = ckPoint(ckMinuteAngle(shown), CK_MINUTE_LEN)

  return (
    <div className="clock">
      {instruction && <p className="clock__instruction">{instruction}</p>}
      <svg
        ref={svgRef}
        className="clock__svg"
        viewBox={`0 0 ${CK_VIEWBOX} ${CK_VIEWBOX}`}
        role="group"
        aria-label="Uhr: Zeiger verschieben"
        aria-disabled={disabled || undefined}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onLostPointerCapture={onUp}
      >
        <circle className="clock__face" cx={CK_C} cy={CK_C} r={CK_R} />
        {ckTicks().map((t, i) => (
          <line key={`tick-${i}`} data-testid="ck-tick" className={t.major ? 'clock__tick clock__tick--major' : 'clock__tick'} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
        ))}
        {ckNumbers().map((n) => (
          <text key={`num-${n.n}`} data-testid="ck-number" className="clock__number" x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central" fontSize={CK_NUM_FONT}>
            {n.n}
          </text>
        ))}
        <line className="clock__hand clock__hand--hour" data-testid="ck-hour-line" x1={CK_C} y1={CK_C} x2={hourEnd.x} y2={hourEnd.y} />
        <line className="clock__hand clock__hand--minute" data-testid="ck-minute-line" x1={CK_C} y1={CK_C} x2={minuteEnd.x} y2={minuteEnd.y} />
        <circle className="clock__centre" cx={CK_C} cy={CK_C} r={5} />
        {HANDS.map((hand) => {
          const tip = ckHandTip(hand, shown)
          return (
            <g
              key={hand}
              data-testid="ck-handle"
              data-hand={hand}
              className={`clock__handle clock__handle--${hand}${touched ? ' clock__handle--touched' : ''}${dragging === hand ? ' clock__handle--dragging' : ''}`}
              tabIndex={disabled ? -1 : 0}
              role="slider"
              aria-label={HAND_NAME[hand]}
              aria-valuemin={0}
              aria-valuemax={hand === 'hour' ? 11 : 59}
              aria-valuenow={hand === 'hour' ? shown.h : shown.m}
              aria-valuetext={ckSpokenTime(shown)}
              onPointerDown={onDown(hand)}
              onKeyDown={onKey(hand)}
            >
              <circle className="clock__knob" cx={tip.x} cy={tip.y} r={CK_KNOB_R} />
              <circle className="clock__hit" data-testid="ck-hit" cx={tip.x} cy={tip.y} r={CK_HIT_R} />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
