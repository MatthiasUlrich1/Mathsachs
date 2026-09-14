import { useState, useRef, useCallback } from 'react'
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
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const width = 600
  const height = 120
  const padding = 40
  const lineY = 60

  const formatNumber = (num: number) => {
    if (decimals === 0) return num.toFixed(0)
    return num.toFixed(decimals).replace('.', ',')
  }

  // Convert screen X coordinate to value
  const screenToValue = useCallback(
    (screenX: number): number => {
      const svg = svgRef.current
      if (!svg) return min
      const rect = svg.getBoundingClientRect()
      const relativeX = screenX - rect.left
      const ratio = (relativeX - padding) / (width - 2 * padding)
      const rawValue = min + ratio * (max - min)
      // Snap to step
      const snapped = Math.round(rawValue / step) * step
      return Math.max(min, Math.min(max, snapped))
    },
    [min, max, step, padding, width]
  )

  // Convert value to SVG X coordinate
  const valueToX = (val: number) => {
    const ratio = (val - min) / (max - min)
    return padding + ratio * (width - 2 * padding)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const newValue = screenToValue(e.clientX)
    onChange(newValue)
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      const newValue = screenToValue(e.clientX)
      onChange(newValue)
    },
    [isDragging, screenToValue, onChange]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Attach global mouse listeners when dragging
  useState(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  })

  // Generate tick marks
  const ticks: number[] = []
  for (let v = min; v <= max; v += step) {
    ticks.push(v)
  }

  return (
    <div className="number-line-slider">
      {label && <div className="number-line-label">{label}</div>}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="number-line-svg"
        onMouseDown={handleMouseDown}
      >
        {/* Main horizontal line */}
        <line
          x1={padding}
          y1={lineY}
          x2={width - padding}
          y2={lineY}
          stroke="#333"
          strokeWidth="2"
        />

        {/* Tick marks and labels */}
        {ticks.map((tick) => {
          const x = valueToX(tick)
          const isMajor = tick === min || tick === max || Math.abs(tick % (step * 5)) < 1e-9
          const tickHeight = isMajor ? 15 : 8
          return (
            <g key={tick}>
              <line
                x1={x}
                y1={lineY - tickHeight / 2}
                x2={x}
                y2={lineY + tickHeight / 2}
                stroke="#333"
                strokeWidth={isMajor ? 2 : 1}
              />
              {isMajor && (
                <text
                  x={x}
                  y={lineY + 30}
                  textAnchor="middle"
                  fontSize="14"
                  fill="#333"
                >
                  {formatNumber(tick)}
                </text>
              )}
            </g>
          )
        })}

        {/* User's marker with vertical line (no number shown) */}
        {value !== null && (
          <g>
            {/* Vertical line from marker to number line */}
            <line
              x1={valueToX(value)}
              y1={lineY - 30}
              x2={valueToX(value)}
              y2={lineY}
              stroke="#007bff"
              strokeWidth={2}
              className={isDragging ? 'dragging' : ''}
            />
            {/* Draggable marker circle above the line */}
            <circle
              cx={valueToX(value)}
              cy={lineY - 30}
              r={10}
              fill="#007bff"
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
