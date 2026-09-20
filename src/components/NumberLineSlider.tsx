import { useState, useRef, useCallback, useEffect } from 'react'
import './NumberLineSlider.css'

export interface NumberLineSliderProps {
  /** Minimum value of the number line */
  min: number
  /** Maximum value of the number line */
  max: number
  /** Step between tick marks (e.g., 0.1, 1, 10) */
  step: number
  /** Currently selected value (controlled) */
  value: number | null
  /** Callback when value changes */
  onChange: (value: number) => void
  /** Optional label above the number line */
  label?: string
  /** Number of decimal places to show in labels (default 0) */
  decimals?: number
  /** Spacing between labeled major ticks (default step×5). */
  labelStep?: number
}

/**
 * Interactive number line component where users can drag to place a number.
 * Displays tick marks, labels, and a draggable marker.
 */
export const NumberLineSlider: React.FC<NumberLineSliderProps> = ({
  min,
  max,
  step,
  value,
  onChange,
  label,
  decimals = 0,
  labelStep,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const labelEvery = labelStep ?? step * 5

  const width = 600
  const height = 120
  const padding = 40
  const lineY = 60

  const formatNumber = (num: number) => {
    if (decimals === 0) return num.toFixed(0)
    return num.toFixed(decimals).replace('.', ',')
  }

  const screenToValue = useCallback(
    (screenX: number): number => {
      const svg = svgRef.current
      if (!svg) return min
      const rect = svg.getBoundingClientRect()
      const relativeX = screenX - rect.left
      const ratio = (relativeX - padding) / (width - 2 * padding)
      const rawValue = min + ratio * (max - min)
      const snapped = Math.round(rawValue / step) * step
      return Math.max(min, Math.min(max, snapped))
    },
    [min, max, step, padding, width],
  )

  const valueToX = (val: number) => {
    const ratio = (val - min) / (max - min)
    return padding + ratio * (width - 2 * padding)
  }

  useEffect(() => {
    if (!isDragging) return
    const handleMouseMove = (e: MouseEvent) => {
      onChange(screenToValue(e.clientX))
    }
    const handleMouseUp = () => setIsDragging(false)
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      onChange(screenToValue(t.clientX))
    }
    const handleTouchEnd = () => setIsDragging(false)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, screenToValue, onChange])

  const ticks: number[] = []
  for (let v = min; v <= max + 1e-9; v += step) {
    ticks.push(Number(v.toFixed(6)))
  }

  const isMajor = (tick: number) =>
    Math.abs(tick - min) < 1e-9 ||
    Math.abs(tick - max) < 1e-9 ||
    Math.abs(tick % labelEvery) < 1e-9

  return (
    <div className="number-line-slider">
      {label && <div className="number-line-label">{label}</div>}
      <p className="number-line-mobile-hint" role="note">
        Am Handy: Telefon seitlich drehen für bessere Bedienbarkeit.
      </p>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="number-line-svg"
        onMouseDown={(e) => {
          setIsDragging(true)
          onChange(screenToValue(e.clientX))
        }}
        onTouchStart={(e) => {
          const t = e.touches[0]
          if (!t) return
          setIsDragging(true)
          onChange(screenToValue(t.clientX))
        }}
      >
        <line
          x1={padding}
          y1={lineY}
          x2={width - padding}
          y2={lineY}
          stroke="#e2e8f0"
          strokeWidth="3"
        />

        {ticks.map((tick) => {
          const x = valueToX(tick)
          const major = isMajor(tick)
          const tickHeight = major ? 15 : 8
          return (
            <g key={tick}>
              <line
                x1={x}
                y1={lineY - tickHeight / 2}
                x2={x}
                y2={lineY + tickHeight / 2}
                stroke="#e2e8f0"
                strokeWidth={major ? 2.5 : 1.5}
              />
              {major && (
                <text x={x} y={lineY + 30} textAnchor="middle" fontSize="14" fill="#f8fafc">
                  {formatNumber(tick)}
                </text>
              )}
            </g>
          )
        })}

        {value !== null && (
          <g>
            <line
              x1={valueToX(value)}
              y1={lineY - 30}
              x2={valueToX(value)}
              y2={lineY}
              stroke="#38bdf8"
              strokeWidth={2}
              className={isDragging ? 'dragging' : ''}
            />
            <circle
              cx={valueToX(value)}
              cy={lineY - 30}
              r={10}
              fill="#38bdf8"
              stroke="#fff"
              strokeWidth={2}
              className={isDragging ? 'dragging' : ''}
              style={{ cursor: 'grab' }}
            />
          </g>
        )}
      </svg>
    </div>
  )
}
