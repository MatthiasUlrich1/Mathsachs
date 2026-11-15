import { useRef, useState } from 'react'
import type { UserInput } from '../curriculum/types'
import {
  BC_AXIS_LABEL_FONT,
  BC_AXIS_LABEL_X,
  BC_AXIS_LABEL_Y,
  BC_CATEGORY_FONT,
  BC_CATEGORY_Y,
  BC_HANDLE_H,
  BC_HIT_R,
  BC_TICK_FONT,
  BC_TICK_LABEL_X,
  BC_VALUE_FONT,
  BC_VIEWBOX_H,
  BC_VIEWBOX_W,
  BC_X0,
  BC_X1,
  BC_Y_BASE,
  BC_Y_TOP,
  bcBarCentreX,
  bcBarWidth,
  bcFormatNumber,
  bcLabelledTicks,
  bcNudge,
  bcSlotWidth,
  bcTickValues,
  bcValueFromY,
  bcYFromValue,
} from '../lib/barChartLogic'
import './BarChart.css'

type BarChartValue = Extract<UserInput, { kind: 'barChart' }>

export interface BarChartProps {
  categories: string[]
  yMax: number
  step: number
  /** Height every untouched bar shows (default 0). */
  starts?: number[]
  /** Short title of the y-axis. */
  yLabel?: string
  value: BarChartValue
  onChange: (value: UserInput) => void
  instruction?: string
  disabled?: boolean
}

/**
 * Bar chart the learner builds: drag the top of each bar (or use the arrow keys); heights snap to the grid.
 * Pointer events only (mouse, touch, stylus). `values[i]` is null while bar i has not been moved.
 */
export const BarChart: React.FC<BarChartProps> = ({ categories, yMax, step, starts, yLabel, value, onChange, instruction, disabled = false }) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const grab = useRef<{ index: number; dy: number } | null>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const n = categories.length
  const values: Array<number | null> = categories.map((_, i) => {
    const v = value.values?.[i]
    return typeof v === 'number' && Number.isFinite(v) ? v : null
  })
  const shown = (i: number): number => values[i] ?? starts?.[i] ?? 0
  const ticks = bcTickValues(yMax, step)
  const labelled = new Set(bcLabelledTicks(yMax, step))
  const slotW = bcSlotWidth(n)
  const barW = bcBarWidth(n)

  const setBar = (index: number, next: number) => {
    if (values[index] === next) return
    const out = [...values]
    out[index] = next
    onChange({ kind: 'barChart', values: out })
  }

  const toSvgY = (e: React.PointerEvent): number => {
    const r = svgRef.current?.getBoundingClientRect()
    const sy = r && r.height > 0 ? BC_VIEWBOX_H / r.height : 1
    const cy = Number.isFinite(e.clientY) ? e.clientY : 0
    return (cy - (r?.top ?? 0)) * sy
  }

  const onDown = (index: number) => (e: React.PointerEvent) => {
    if (disabled) return
    try {
      // Capture on the svg: it never moves in the DOM.
      svgRef.current?.setPointerCapture?.(e.pointerId)
    } catch {
      /* synthetic pointers have nothing to capture */
    }
    const y = toSvgY(e)
    const handleY = bcYFromValue(shown(index), yMax)
    // Grabbing the handle keeps the offset (no jump); pressing elsewhere in the column puts the bar top there.
    const onHandle = Math.abs(y - handleY) <= BC_HIT_R
    const dy = onHandle ? handleY - y : 0
    grab.current = { index, dy }
    setDragging(index)
    if (!onHandle) setBar(index, bcValueFromY(y, yMax, step))
  }

  const onMove = (e: React.PointerEvent) => {
    const g = grab.current
    if (!g || disabled) return
    setBar(g.index, bcValueFromY(toSvgY(e) + g.dy, yMax, step))
  }

  const onUp = () => {
    grab.current = null
    setDragging(null)
  }

  const onKey = (index: number) => (e: React.KeyboardEvent) => {
    if (disabled) return
    const delta = e.key === 'ArrowUp' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowDown' || e.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    setBar(index, bcNudge(shown(index), delta, step, yMax))
  }

  return (
    <div className="bar-chart">
      {instruction && <p className="bar-chart__instruction">{instruction}</p>}
      <svg
        ref={svgRef}
        className="bar-chart__svg"
        viewBox={`0 0 ${BC_VIEWBOX_W} ${BC_VIEWBOX_H}`}
        role="group"
        aria-label="Säulendiagramm: Höhe der Balken einstellen"
        aria-disabled={disabled || undefined}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onLostPointerCapture={onUp}
      >
        {yLabel && (
          <text className="bar-chart__axis-title" x={BC_AXIS_LABEL_X} y={BC_AXIS_LABEL_Y} fontSize={BC_AXIS_LABEL_FONT}>
            {yLabel}
          </text>
        )}
        {ticks.map((t) => {
          const y = bcYFromValue(t, yMax)
          return (
            <g key={t}>
              <line className={t === 0 ? 'bar-chart__base' : 'bar-chart__grid'} x1={BC_X0} y1={y} x2={BC_X1} y2={y} />
              {labelled.has(t) && (
                <text className="bar-chart__num" x={BC_TICK_LABEL_X} y={y + 4} textAnchor="end" fontSize={BC_TICK_FONT}>
                  {bcFormatNumber(t)}
                </text>
              )}
            </g>
          )
        })}
        <line className="bar-chart__axis" x1={BC_X0} y1={BC_Y_TOP - 6} x2={BC_X0} y2={BC_Y_BASE} />
        {categories.map((name, i) => {
          const cx = bcBarCentreX(i, n)
          const topY = bcYFromValue(shown(i), yMax)
          const touched = values[i] !== null
          return (
            <g
              key={name}
              data-testid="bc-bar"
              data-index={i}
              data-value={touched ? values[i] : undefined}
              className={`bar-chart__bar${touched ? ' bar-chart__bar--touched' : ''}${dragging === i ? ' bar-chart__bar--dragging' : ''}`}
              tabIndex={disabled ? -1 : 0}
              role="slider"
              aria-label={`Balken ${name}`}
              aria-orientation="vertical"
              aria-valuemin={0}
              aria-valuemax={yMax}
              aria-valuenow={shown(i)}
              aria-valuetext={touched ? bcFormatNumber(shown(i)) : 'noch nicht eingestellt'}
              onPointerDown={onDown(i)}
              onKeyDown={onKey(i)}
            >
              <rect className="bar-chart__column" x={cx - slotW / 2} y={BC_Y_TOP - 12} width={slotW} height={BC_Y_BASE - BC_Y_TOP + 12} />
              <rect className="bar-chart__fill" x={cx - barW / 2} y={topY} width={barW} height={Math.max(0, BC_Y_BASE - topY)} />
              <rect className="bar-chart__handle" x={cx - barW / 2} y={topY - BC_HANDLE_H / 2} width={barW} height={BC_HANDLE_H} rx={6} />
              {touched && (
                <text className="bar-chart__value" x={cx} y={topY} textAnchor="middle" dominantBaseline="central" fontSize={BC_VALUE_FONT} pointerEvents="none">
                  {bcFormatNumber(shown(i))}
                </text>
              )}
              <circle className="bar-chart__hit" data-testid="bc-hit" cx={cx} cy={topY} r={BC_HIT_R} />
            </g>
          )
        })}
        {categories.map((name, i) => (
          <text key={`cat-${name}`} className="bar-chart__category" x={bcBarCentreX(i, n)} y={BC_CATEGORY_Y} textAnchor="middle" fontSize={BC_CATEGORY_FONT}>
            {name}
          </text>
        ))}
      </svg>
    </div>
  )
}
