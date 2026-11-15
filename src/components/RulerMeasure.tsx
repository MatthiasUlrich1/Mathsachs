import { useRef, useState } from 'react'
import type { UserInput } from '../curriculum/types'
import { parseNumber } from '../lib/num'
import {
  RULER_BODY_HEIGHT,
  RULER_CM,
  RULER_DEFAULT_UNIT_PX,
  RULER_HANDLE_OFFSET_X,
  RULER_HANDLE_RADIUS,
  RULER_HANDLE_Y,
  RULER_ORIGIN,
  RULER_PAD,
  RULER_VIEWBOX,
  directionDegrees,
  drawStartLength,
  lengthFromPointer,
  lengthGrabOffset,
  normalizeDegrees,
  roundCm,
  rulerLength,
  rulerStartPose,
  clampRulerPose,
  clampRulerRotation,
  segmentEnd,
  snapRotation,
  snapToEnd,
  type Point,
  type RulerPose,
} from '../lib/rulerGeometry'
import './RulerMeasure.css'

type RulerMeasureValue = Extract<UserInput, { kind: 'rulerMeasure' }>

export interface RulerMeasureProps {
  mode: 'measure' | 'draw'
  /** Target length in cm (measure: the drawn segment; draw: the goal). */
  lengthCm: number
  /** Tilt of the segment in degrees (default 0). */
  angle?: number
  /** SVG units per cm (default 40). */
  unitPx?: number
  /** Draw mode: where the end point starts (defaults to a spoiler-free offset). */
  initialLength?: number
  value: RulerMeasureValue
  onChange: (value: UserInput) => void
  instruction?: string
  disabled?: boolean
}

const O = RULER_ORIGIN

const fmt = (n: number) => Math.round(n * 100) / 100

/** Graduation path (mm / half cm / cm ticks pointing up from the edge) and cm labels. */
const buildScale = (unitPx: number) => {
  let path = ''
  const labels: Array<{ x: number; text: string }> = []
  for (let mm = 0; mm <= RULER_CM * 10; mm += 1) {
    const x = fmt((mm * unitPx) / 10)
    const len = mm % 10 === 0 ? 14 : mm % 5 === 0 ? 10 : 6
    path += `M${x} 0L${x} ${-len}`
    if (mm % 10 === 0) labels.push({ x, text: String(mm / 10) })
  }
  return { path, labels }
}

/**
 * Virtual ruler. measure: move/rotate the ruler so its 0 mark sits on the segment
 * start, read the end point and type the length in cm. draw: the ruler lies on the
 * start point, drag the end point along its edge. Pointer events only (mouse,
 * touch, stylus); coordinates in SVG units.
 */
export const RulerMeasure: React.FC<RulerMeasureProps> = ({
  mode,
  lengthCm,
  angle = 0,
  unitPx = RULER_DEFAULT_UNIT_PX,
  initialLength,
  value,
  onChange,
  instruction,
  disabled = false,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const drag = useRef<
    | { kind: 'move'; dx: number; dy: number }
    | { kind: 'rotate'; offset: number }
    | { kind: 'end'; offset: number }
    | null
  >(null)
  const [pose, setPose] = useState<RulerPose>(() => rulerStartPose(lengthCm, angle))
  const [text, setText] = useState(
    mode === 'measure' && value.length !== null ? String(value.length).replace('.', ',') : '',
  )
  const scale = useRef(buildScale(unitPx)).current

  const drawLength = value.length ?? initialLength ?? drawStartLength(lengthCm)
  const effectivePose: RulerPose = mode === 'draw' ? { x: O.x, y: O.y, rot: angle } : pose
  const len = rulerLength(unitPx)

  const toSvg = (e: React.PointerEvent): Point => {
    const r = svgRef.current?.getBoundingClientRect()
    const sx = r && r.width > 0 ? RULER_VIEWBOX.w / r.width : 1
    const sy = r && r.height > 0 ? RULER_VIEWBOX.h / r.height : 1
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

  const emitDraw = (length: number) => onChange({ kind: 'rulerMeasure', length, touched: true })

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
    // Remember the grab offset so the ruler does not jump under the finger.
    drag.current = {
      kind: 'rotate',
      offset: pose.rot - directionDegrees({ x: pose.x, y: pose.y }, toSvg(e)),
    }
  }

  const onEndDown = (e: React.PointerEvent) => {
    if (disabled || mode !== 'draw') return
    capture(e)
    drag.current = { kind: 'end', offset: lengthGrabOffset(toSvg(e), angle, unitPx, drawLength) }
  }

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d || disabled) return
    const p = toSvg(e)
    if (d.kind === 'move') {
      setPose((cur) => {
        const c = clampRulerPose({ ...cur, x: p.x + d.dx, y: p.y + d.dy }, unitPx)
        const next = snapToEnd({ x: c.x, y: c.y })
        return { ...cur, x: next.x, y: next.y }
      })
    } else if (d.kind === 'rotate') {
      const raw = normalizeDegrees(directionDegrees({ x: pose.x, y: pose.y }, p) + d.offset)
      const rot = Math.round(raw * 10) / 10
      const onEnd = pose.x === O.x && pose.y === O.y
      setPose((cur) => clampRulerPose({ ...cur, rot: clampRulerRotation(onEnd ? snapRotation(rot, angle) : rot) }, unitPx))
    } else {
      emitDraw(lengthFromPointer(p, angle, unitPx, d.offset))
    }
  }

  const onUp = () => {
    drag.current = null
  }

  const onEndKey = (e: React.KeyboardEvent) => {
    if (disabled || mode !== 'draw') return
    const step =
      e.key === 'ArrowRight' || e.key === 'ArrowUp'
        ? 0.1
        : e.key === 'ArrowLeft' || e.key === 'ArrowDown'
          ? -0.1
          : 0
    if (!step) return
    e.preventDefault()
    emitDraw(Math.min(RULER_CM, Math.max(0.1, roundCm(drawLength + step))))
  }

  const onText = (raw: string) => {
    setText(raw)
    onChange({ kind: 'rulerMeasure', length: parseNumber(raw), touched: true })
  }

  const shownCm = mode === 'measure' ? lengthCm : drawLength
  const end = segmentEnd(shownCm, angle, unitPx)
  const solutionEnd = segmentEnd(lengthCm, angle, unitPx)
  // End ticks perpendicular to the segment.
  const a = (angle * Math.PI) / 180
  const tx = Math.sin(a) * 8
  const ty = Math.cos(a) * 8

  return (
    <div className="ruler-measure">
      {instruction && <p className="ruler-measure__instruction">{instruction}</p>}
      <svg
        ref={svgRef}
        className="ruler-measure__svg"
        viewBox={`0 0 ${RULER_VIEWBOX.w} ${RULER_VIEWBOX.h}`}
        role="img"
        aria-label={mode === 'measure' ? 'Strecke mit Lineal messen' : 'Strecke mit Lineal abtragen'}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <line
          className="ruler-measure__segment"
          data-testid="segment"
          data-length={mode === 'draw' ? drawLength : undefined}
          x1={O.x}
          y1={O.y}
          x2={fmt(end.x)}
          y2={fmt(end.y)}
        />
        <line className="ruler-measure__tick" x1={fmt(O.x - tx)} y1={fmt(O.y - ty)} x2={fmt(O.x + tx)} y2={fmt(O.y + ty)} />
        {mode === 'measure' && (
          <line className="ruler-measure__tick" x1={fmt(end.x - tx)} y1={fmt(end.y - ty)} x2={fmt(end.x + tx)} y2={fmt(end.y + ty)} />
        )}
        {disabled && mode === 'draw' && (
          <line
            className="ruler-measure__solution"
            x1={O.x}
            y1={O.y}
            x2={fmt(solutionEnd.x)}
            y2={fmt(solutionEnd.y)}
          />
        )}
        <g
          data-testid="ruler"
          className={
            mode === 'measure' && !disabled ? 'ruler-measure__tool ruler-measure__tool--movable' : 'ruler-measure__tool'
          }
          transform={`translate(${fmt(effectivePose.x)} ${fmt(effectivePose.y)}) rotate(${fmt(-effectivePose.rot)})`}
        >
          <rect
            className="ruler-measure__body"
            x={-RULER_PAD}
            y={-RULER_BODY_HEIGHT}
            width={len + RULER_PAD}
            height={RULER_BODY_HEIGHT}
            rx={3}
            onPointerDown={onBodyDown}
          />
          <path className="ruler-measure__ticks" d={scale.path} pointerEvents="none" />
          {scale.labels.map((l) => (
            <text
              key={l.text}
              className="ruler-measure__label"
              x={l.x}
              y={-22}
              textAnchor="middle"
              dominantBaseline="central"
              pointerEvents="none"
            >
              {l.text}
            </text>
          ))}
          <line className="ruler-measure__edge" x1={-RULER_PAD} y1={0} x2={len} y2={0} pointerEvents="none" />
          {mode === 'measure' && !disabled && (
            <g data-testid="rotate-handle" className="ruler-measure__handle" onPointerDown={onRotateDown}>
              <circle cx={len - RULER_HANDLE_OFFSET_X} cy={RULER_HANDLE_Y} r={RULER_HANDLE_RADIUS} />
              <text
                x={len - RULER_HANDLE_OFFSET_X}
                y={RULER_HANDLE_Y}
                textAnchor="middle"
                dominantBaseline="central"
                pointerEvents="none"
              >
                {'↻'}
              </text>
            </g>
          )}
        </g>
        <circle className="ruler-measure__start" cx={O.x} cy={O.y} r={3} pointerEvents="none" />
        {mode === 'draw' && (
          <circle
            data-testid="end-handle"
            className="ruler-measure__end-handle"
            cx={fmt(end.x)}
            cy={fmt(end.y)}
            r={RULER_HANDLE_RADIUS}
            tabIndex={disabled ? -1 : 0}
            role="slider"
            aria-label="Endpunkt der Strecke"
            aria-valuemin={0.1}
            aria-valuemax={RULER_CM}
            aria-valuenow={drawLength}
            onPointerDown={onEndDown}
            onKeyDown={onEndKey}
          />
        )}
      </svg>
      {mode === 'measure' && (
        <label className="ruler-measure__answer">
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            aria-label="Gemessene Länge in Zentimetern"
            value={text}
            disabled={disabled}
            onChange={(e) => onText(e.target.value)}
          />
          <span aria-hidden="true">cm</span>
        </label>
      )}
    </div>
  )
}
