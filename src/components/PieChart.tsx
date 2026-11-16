import { useRef, useState } from 'react'
import type { UserInput } from '../curriculum/types'
import {
  PC_CX,
  PC_CY,
  PC_DEFAULT_SNAP,
  PC_HANDLE_R,
  PC_HIT_R,
  PC_LABEL_FONT,
  PC_LABEL_R,
  PC_TAG_FONT,
  PC_TAG_R,
  PC_LEGEND_FONT,
  PC_LEGEND_NAME_X,
  PC_LEGEND_RIGHT,
  PC_LEGEND_SWATCH,
  PC_LEGEND_X,
  PC_R,
  PC_VIEWBOX_H,
  PC_VIEWBOX_W,
  pcBoundaries,
  pcBoundaryRange,
  pcDragTarget,
  pcLegendRowY,
  pcMoveBoundary,
  pcNearestHandle,
  pcNudge,
  pcPercentText,
  pcPoint,
  pcPointerPercent,
  pcSectorLabelFits,
  pcSectorTags,
  pcSectorPath,
  pcStartPercents,
  pcWrapDelta,
} from '../lib/pieChartLogic'
import { SVG_COLOR, seriesColor } from '../lib/svgTokens'
import './PieChart.css'

type PieChartValue = Extract<UserInput, { kind: 'pieChart' }>

export interface PieChartProps {
  categories: string[]
  /** Boundaries snap to multiples of this percent (default 5). */
  snapPercent?: number
  value: PieChartValue
  onChange: (value: UserInput) => void
  instruction?: string
  disabled?: boolean
}

/**
 * Pie chart the learner builds: drag the knobs on the circle edge (or use the arrow keys) to move the sector boundaries.
 * Pointer events only (mouse, touch, stylus). `percents` is null while nothing has been moved (equal start shares are shown).
 */
export const PieChart: React.FC<PieChartProps> = ({ categories, snapPercent = PC_DEFAULT_SNAP, value, onChange, instruction, disabled = false }) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const grab = useRef<{ index: number; offset: number } | null>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const n = categories.length
  const touched = Array.isArray(value.percents) && value.percents.length === n
  const shown: number[] = touched ? (value.percents as number[]) : pcStartPercents(n, snapPercent)
  const bounds = pcBoundaries(shown)

  const commit = (next: number[]) => {
    // Only a real change counts as moving (a no-op drag keeps the chart untouched).
    if (next.every((p, i) => p === shown[i])) return
    onChange({ kind: 'pieChart', percents: next })
  }

  const toSvg = (e: React.PointerEvent): { x: number; y: number } => {
    const r = svgRef.current?.getBoundingClientRect()
    const sx = r && r.width > 0 ? PC_VIEWBOX_W / r.width : 1
    const sy = r && r.height > 0 ? PC_VIEWBOX_H / r.height : 1
    const cx = Number.isFinite(e.clientX) ? e.clientX : 0
    const cy = Number.isFinite(e.clientY) ? e.clientY : 0
    return { x: (cx - (r?.left ?? 0)) * sx, y: (cy - (r?.top ?? 0)) * sy }
  }

  const onDown = (fallback: number) => (e: React.PointerEvent) => {
    if (disabled) return
    try {
      // Capture on the svg: it never moves in the DOM.
      svgRef.current?.setPointerCapture?.(e.pointerId)
    } catch {
      /* synthetic pointers have nothing to capture */
    }
    const p = toSvg(e)
    const index = pcNearestHandle(shown, p.x, p.y) ?? fallback
    // Keep the offset between the pointer and the knob so it does not jump.
    grab.current = { index, offset: pcWrapDelta(bounds[index]! - pcPointerPercent(p.x, p.y)) }
    setDragging(index)
  }

  const onMove = (e: React.PointerEvent) => {
    const g = grab.current
    if (!g || disabled) return
    const p = toSvg(e)
    commit(pcMoveBoundary(shown, g.index, pcDragTarget(bounds[g.index]!, pcPointerPercent(p.x, p.y), g.offset), snapPercent))
  }

  const onUp = () => {
    grab.current = null
    setDragging(null)
  }

  const onKey = (index: number) => (e: React.KeyboardEvent) => {
    if (disabled) return
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    commit(pcNudge(shown, index, delta, snapPercent))
  }

  const fits = shown.map((p) => pcSectorLabelFits(p))
  const tags = pcSectorTags(categories)

  return (
    <div className="pie-chart">
      {instruction && <p className="pie-chart__instruction">{instruction}</p>}
      <svg
        ref={svgRef}
        className="pie-chart__svg"
        viewBox={`0 0 ${PC_VIEWBOX_W} ${PC_VIEWBOX_H}`}
        role="group"
        aria-label="Kreisdiagramm: Grenzen der Sektoren verschieben"
        aria-disabled={disabled || undefined}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onLostPointerCapture={onUp}
      >
        {categories.map((name, i) => (
          <path
            key={`sector-${i}`}
            data-testid="pc-sector"
            data-percent={shown[i]}
            className="pie-chart__sector"
            d={pcSectorPath(bounds[i]!, bounds[i + 1]!)}
            fill={seriesColor(i)}
            stroke={SVG_COLOR.surface}
            strokeWidth={2.5}
          >
            <title>{name}</title>
          </path>
        ))}
        <circle className="pie-chart__rim" cx={PC_CX} cy={PC_CY} r={PC_R} />
        {/* fixed start of the circle at 12 o'clock */}
        <line className="pie-chart__start" x1={PC_CX} y1={PC_CY} x2={PC_CX} y2={PC_CY - PC_R - 8} />
        {categories.map((_, i) => {
          if (!fits[i]) return null
          const mid = (bounds[i]! + bounds[i + 1]!) / 2
          const pt = pcPoint(mid, PC_LABEL_R)
          return (
            <text key={`label-${i}`} className="pie-chart__label" data-testid="pc-label" x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="central" fontSize={PC_LABEL_FONT}>
              {pcPercentText(shown[i]!)}
            </text>
          )
        })}
        {categories.map((_, i) => {
          const mid = (bounds[i]! + bounds[i + 1]!) / 2
          const pt = pcPoint(mid, PC_TAG_R)
          return (
            <text key={`tag-${i}`} className="pie-chart__tag" data-testid="pc-tag" x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="central" fontSize={PC_TAG_FONT}>
              {tags[i]}
            </text>
          )
        })}
        {categories.map((name, i) => {
          const y = pcLegendRowY(i, n)
          return (
            <g key={`legend-${i}`} data-testid="pc-legend">
              <rect x={PC_LEGEND_X} y={y - PC_LEGEND_SWATCH / 2} width={PC_LEGEND_SWATCH} height={PC_LEGEND_SWATCH} fill={seriesColor(i)} stroke={SVG_COLOR.svgLine} strokeWidth={1.5} />
              <text className="pie-chart__legend-name" x={PC_LEGEND_NAME_X} y={y + 5} fontSize={PC_LEGEND_FONT}>
                {name}
              </text>
              {!fits[i] && (
                <text className="pie-chart__legend-value" data-testid="pc-legend-value" x={PC_LEGEND_RIGHT} y={y + 5} textAnchor="end" fontSize={PC_LEGEND_FONT}>
                  {pcPercentText(shown[i]!)}
                </text>
              )}
            </g>
          )
        })}
        {categories.slice(1).map((_, k) => {
          const index = k + 1
          const pt = pcPoint(bounds[index]!, PC_R)
          const { lo, hi } = pcBoundaryRange(shown, index, snapPercent)
          return (
            <g
              key={`handle-${index}`}
              data-testid="pc-handle"
              data-index={index}
              data-boundary={bounds[index]}
              className={`pie-chart__handle${touched ? ' pie-chart__handle--touched' : ''}${dragging === index ? ' pie-chart__handle--dragging' : ''}`}
              tabIndex={disabled ? -1 : 0}
              role="slider"
              aria-label={`Grenze zwischen ${categories[index - 1]} und ${categories[index]}`}
              aria-valuemin={lo}
              aria-valuemax={hi}
              aria-valuenow={bounds[index]}
              aria-valuetext={`${pcPercentText(bounds[index]!)} vom Kreis`}
              onPointerDown={onDown(index)}
              onKeyDown={onKey(index)}
            >
              <circle className="pie-chart__knob" cx={pt.x} cy={pt.y} r={PC_HANDLE_R} />
              <circle className="pie-chart__hit" data-testid="pc-hit" cx={pt.x} cy={pt.y} r={PC_HIT_R} />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
