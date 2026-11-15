import { useRef, useState } from 'react'
import type { UserInput } from '../curriculum/types'
import { parseNumber } from '../lib/num'
import {
  PROTRACTOR_LEG_LENGTH,
  PROTRACTOR_VERTEX,
  PROTRACTOR_VIEWBOX,
  directionDegrees,
  drawStartDegrees,
  PROTRACTOR_HALF_WIDTH,
  PROTRACTOR_HANDLE_Y,
  legDegreesFromPointer,
  legGrabOffset,
  measureStartPose,
  normalizeDegrees,
  pointAt,
  snapToVertex,
  clampProtractorPose,
  type Point,
  type ProtractorPose,
} from '../lib/protractorGeometry'
import './AngleProtractor.css'

type AngleProtractorValue = Extract<UserInput, { kind: 'angleProtractor' }>

export interface AngleProtractorProps {
  mode: 'measure' | 'draw'
  /** Target angle 1..179 (measure: the drawn angle; draw: the goal). */
  angle: number
  /** Rotation of the first leg (default 0). */
  startAngle?: number
  /** Draw mode: where the second leg starts (defaults to a spoiler-free offset). */
  initialDegrees?: number
  value: AngleProtractorValue
  onChange: (value: UserInput) => void
  instruction?: string
  disabled?: boolean
}

/** Half width of the drawn triangle (a little larger than the scale radius). */
const RT = PROTRACTOR_HALF_WIDTH
const DEG = Math.PI / 180
const V = PROTRACTOR_VERTEX
const ROTATE_HANDLE_Y = PROTRACTOR_HANDLE_Y

/** Point on the triangle's short side hit by the ray at math angle `deg` from the origin. */
const edgePoint = (deg: number): Point => {
  const d = RT / (Math.abs(Math.cos(deg * DEG)) + Math.sin(deg * DEG))
  return { x: d * Math.cos(deg * DEG), y: -d * Math.sin(deg * DEG) }
}

/** Both scales (0-180 counter-clockwise and 180-0 clockwise), built once. */
const SCALE = (() => {
  let path = ''
  const labels: Array<{ x: number; y: number; text: string; inner: boolean }> = []
  for (let deg = 0; deg <= 180; deg += 1) {
    const major = deg % 10 === 0
    const len = major ? 9 : deg % 5 === 0 ? 6 : 3.5
    const p = edgePoint(deg)
    const dist = Math.hypot(p.x, p.y)
    const ux = p.x / dist
    const uy = p.y / dist
    path += `M${p.x.toFixed(2)} ${p.y.toFixed(2)}L${(p.x - ux * len).toFixed(2)} ${(p.y - uy * len).toFixed(2)}`
    if (major) {
      labels.push({ x: p.x - ux * 17, y: p.y - uy * 17, text: String(deg), inner: false })
      if (deg > 0 && deg < 180) {
        labels.push({ x: p.x - ux * 29, y: p.y - uy * 29, text: String(180 - deg), inner: true })
      }
    }
  }
  return { path, labels }
})()

const TRIANGLE = `${-RT},0 ${RT},0 0,${-RT}`

const fmt = (n: number) => Math.round(n * 100) / 100

/**
 * Virtual Geodreieck. measure: move/rotate the instrument and read the angle,
 * then type it in. draw: the instrument sits on the vertex, drag the second leg.
 * Pointer events only (mouse, touch, stylus); coordinates in SVG units.
 */
export const AngleProtractor: React.FC<AngleProtractorProps> = ({
  mode,
  angle,
  startAngle = 0,
  initialDegrees,
  value,
  onChange,
  instruction,
  disabled = false,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const drag = useRef<
    { kind: 'move'; dx: number; dy: number } | { kind: 'rotate'; offset: number } | { kind: 'leg'; offset: number } | null
  >(null)
  const [pose, setPose] = useState<ProtractorPose>(() => measureStartPose(angle, startAngle))
  const [text, setText] = useState(
    mode === 'measure' && value.degrees !== null ? String(value.degrees) : '',
  )

  const drawDegrees = value.degrees ?? initialDegrees ?? drawStartDegrees(angle)
  const effectivePose: ProtractorPose =
    mode === 'draw' ? { x: V.x, y: V.y, rot: startAngle } : pose

  const toSvg = (e: React.PointerEvent): Point => {
    const r = svgRef.current?.getBoundingClientRect()
    const sx = r && r.width > 0 ? PROTRACTOR_VIEWBOX.w / r.width : 1
    const sy = r && r.height > 0 ? PROTRACTOR_VIEWBOX.h / r.height : 1
    const cx = Number.isFinite(e.clientX) ? e.clientX : 0
    const cy = Number.isFinite(e.clientY) ? e.clientY : 0
    return { x: (cx - (r?.left ?? 0)) * sx, y: (cy - (r?.top ?? 0)) * sy }
  }

  const capture = (e: React.PointerEvent) => {
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId)
    } catch {
      /* synthetic pointers have nothing to capture */
    }
  }

  const emitDraw = (degrees: number) =>
    onChange({ kind: 'angleProtractor', degrees, touched: true })

  const onBodyDown = (e: React.PointerEvent) => {
    if (disabled || mode !== 'measure') return
    capture(e)
    const p = toSvg(e)
    drag.current = { kind: 'move', dx: pose.x - p.x, dy: pose.y - p.y }
  }

  const onRotateDown = (e: React.PointerEvent) => {
    if (disabled || mode !== 'measure') return
    e.stopPropagation()
    capture(e)
    // Remember the grab offset so the instrument does not jump under the finger.
    drag.current = {
      kind: 'rotate',
      offset: pose.rot - directionDegrees({ x: pose.x, y: pose.y }, toSvg(e)),
    }
  }

  const onLegDown = (e: React.PointerEvent) => {
    if (disabled || mode !== 'draw') return
    capture(e)
    // Keep the grab offset (like rotate) so the leg does not jump to the pointer.
    drag.current = { kind: 'leg', offset: legGrabOffset(toSvg(e), startAngle, drawDegrees) }
  }

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d || disabled) return
    const p = toSvg(e)
    if (d.kind === 'move') {
      const c = clampProtractorPose({ rot: 0, x: p.x + d.dx, y: p.y + d.dy })
      const next = snapToVertex({ x: c.x, y: c.y })
      setPose((cur) => ({ ...cur, x: next.x, y: next.y }))
    } else if (d.kind === 'rotate') {
      const rot = Math.round(
        normalizeDegrees(directionDegrees({ x: pose.x, y: pose.y }, p) + d.offset),
      )
      setPose((cur) => ({ ...cur, rot }))
    } else {
      const target = pointAt(V, directionDegrees(V, p) + d.offset, 100)
      emitDraw(legDegreesFromPointer(target, startAngle))
    }
  }

  const onUp = () => {
    drag.current = null
  }

  const onLegKey = (e: React.KeyboardEvent) => {
    if (disabled || mode !== 'draw') return
    const step =
      e.key === 'ArrowRight' || e.key === 'ArrowUp'
        ? 1
        : e.key === 'ArrowLeft' || e.key === 'ArrowDown'
          ? -1
          : 0
    if (!step) return
    e.preventDefault()
    emitDraw(Math.min(179, Math.max(1, drawDegrees + step)))
  }

  const onText = (raw: string) => {
    setText(raw)
    onChange({ kind: 'angleProtractor', degrees: parseNumber(raw), touched: true })
  }

  const leg1End = pointAt(V, startAngle, PROTRACTOR_LEG_LENGTH)
  const leg2End = pointAt(V, startAngle + (mode === 'measure' ? angle : drawDegrees), PROTRACTOR_LEG_LENGTH)
  const solutionEnd = pointAt(V, startAngle + angle, PROTRACTOR_LEG_LENGTH)

  return (
    <div className="angle-protractor">
      {instruction && <p className="angle-protractor__instruction">{instruction}</p>}
      <svg
        ref={svgRef}
        className="angle-protractor__svg"
        viewBox={`0 0 ${PROTRACTOR_VIEWBOX.w} ${PROTRACTOR_VIEWBOX.h}`}
        role="img"
        aria-label={
          mode === 'measure' ? 'Winkel mit Geodreieck messen' : 'Winkel mit Geodreieck einstellen'
        }
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <line className="angle-protractor__leg" x1={V.x} y1={V.y} x2={leg1End.x} y2={leg1End.y} />
        <line
          className="angle-protractor__leg angle-protractor__leg--second"
          x1={V.x}
          y1={V.y}
          x2={leg2End.x}
          y2={leg2End.y}
          data-testid="leg-second"
          data-degrees={mode === 'draw' ? drawDegrees : undefined}
        />
        {disabled && mode === 'draw' && (
          <line
            className="angle-protractor__leg angle-protractor__leg--solution"
            x1={V.x}
            y1={V.y}
            x2={solutionEnd.x}
            y2={solutionEnd.y}
          />
        )}
        <g
          data-testid="protractor"
          className={
            mode === 'measure' && !disabled
              ? 'angle-protractor__tool angle-protractor__tool--movable'
              : 'angle-protractor__tool'
          }
          transform={`translate(${fmt(effectivePose.x)} ${fmt(effectivePose.y)}) rotate(${fmt(-effectivePose.rot)})`}
        >
          <polygon className="angle-protractor__body" points={TRIANGLE} onPointerDown={onBodyDown} />
          <path className="angle-protractor__ticks" d={SCALE.path} pointerEvents="none" />
          {SCALE.labels.map((l) => (
            <text
              key={`${l.inner ? 'i' : 'o'}${l.text}`}
              className={
                l.inner
                  ? 'angle-protractor__label angle-protractor__label--inner'
                  : 'angle-protractor__label'
              }
              x={fmt(l.x)}
              y={fmt(l.y)}
              textAnchor="middle"
              dominantBaseline="central"
              pointerEvents="none"
            >
              {l.text}
            </text>
          ))}
          <line className="angle-protractor__zero" x1={-RT} y1={0} x2={RT} y2={0} pointerEvents="none" />
          <line className="angle-protractor__zero" x1={0} y1={-6} x2={0} y2={6} pointerEvents="none" />
          {mode === 'measure' && !disabled && (
            <g
              data-testid="rotate-handle"
              className="angle-protractor__handle"
              onPointerDown={onRotateDown}
            >
              <line x1={0} y1={0} x2={0} y2={ROTATE_HANDLE_Y - 14} className="angle-protractor__stem" />
              <circle cx={0} cy={ROTATE_HANDLE_Y} r={14} />
              <text
                x={0}
                y={ROTATE_HANDLE_Y}
                textAnchor="middle"
                dominantBaseline="central"
                pointerEvents="none"
              >
                {'↻'}
              </text>
            </g>
          )}
        </g>
        <circle className="angle-protractor__vertex" cx={V.x} cy={V.y} r={3} pointerEvents="none" />
        {mode === 'draw' && (
          <circle
            data-testid="leg-handle"
            className="angle-protractor__leg-handle"
            cx={fmt(leg2End.x)}
            cy={fmt(leg2End.y)}
            r={13}
            tabIndex={disabled ? -1 : 0}
            role="slider"
            aria-label="Zweiter Schenkel"
            aria-valuemin={1}
            aria-valuemax={179}
            aria-valuenow={drawDegrees}
            onPointerDown={onLegDown}
            onKeyDown={onLegKey}
          />
        )}
      </svg>
      {mode === 'measure' && (
        <label className="angle-protractor__answer">
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            aria-label="Gemessener Winkel in Grad"
            value={text}
            disabled={disabled}
            onChange={(e) => onText(e.target.value)}
          />
          <span aria-hidden="true">°</span>
        </label>
      )}
    </div>
  )
}
