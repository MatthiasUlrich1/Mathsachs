import { useCallback, useEffect, useRef, useState } from 'react'
import './ThermometerSlider.css'

export interface ThermometerSliderProps {
  min: number
  max: number
  step: number
  value: number | null
  onChange: (value: number) => void
  /** Spacing between labeled ticks (default 20). */
  labelStep?: number
  label?: string
}

/** Interactive vertical thermometer — drag to set °C. */
export function ThermometerSlider({
  min,
  max,
  step,
  value,
  onChange,
  labelStep = 20,
  label,
}: ThermometerSliderProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState(false)

  const width = 220
  const height = 360
  const yTop = 36
  const yBot = 300
  const tubeX = 78
  const tubeW = 28

  const valueToY = useCallback(
    (v: number) => {
      const t = (v - min) / (max - min)
      return yBot - t * (yBot - yTop)
    },
    [min, max],
  )

  const screenToValue = useCallback(
    (clientY: number): number => {
      const svg = svgRef.current
      if (!svg) return min
      const rect = svg.getBoundingClientRect()
      const relativeY = clientY - rect.top
      const ratio = 1 - (relativeY - yTop) / (yBot - yTop)
      const raw = min + ratio * (max - min)
      const snapped = Math.round(raw / step) * step
      return Math.max(min, Math.min(max, snapped))
    },
    [min, max, step],
  )

  const applyPointer = useCallback(
    (clientY: number) => {
      onChange(screenToValue(clientY))
    },
    [onChange, screenToValue],
  )

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: PointerEvent) => applyPointer(e.clientY)
    const onUp = () => setDragging(false)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [dragging, applyPointer])

  const current = value ?? min
  const fillY = valueToY(current)
  const fillH = yBot - fillY

  const ticks: number[] = []
  for (let v = min; v <= max + 1e-9; v += step) {
    ticks.push(Number(v.toFixed(6)))
  }

  const isLabeled = (v: number) =>
    Math.abs(v - min) < 1e-9 ||
    Math.abs(v - max) < 1e-9 ||
    Math.abs(v % labelStep) < 1e-9

  return (
    <div className="thermometer-slider">
      {label && <div className="thermometer-slider-label">{label}</div>}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="thermometer-slider-svg"
        viewBox={`0 0 ${width} ${height}`}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          setDragging(true)
          applyPointer(e.clientY)
        }}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={current}
        aria-label="Thermometer"
      >
        <rect width={width} height={height} fill="#f8fafc" rx="8" />
        {/* tube */}
        <rect
          x={tubeX}
          y={yTop - 4}
          width={tubeW}
          height={yBot - yTop + 8}
          rx={tubeW / 2}
          fill="#e2e8f0"
          stroke="#64748b"
          strokeWidth="2"
        />
        {/* mercury column */}
        <rect x={tubeX + 5} y={fillY} width={tubeW - 10} height={Math.max(0, fillH)} fill="#ef4444" />
        {/* bulb */}
        <circle cx={tubeX + tubeW / 2} cy={yBot + 22} r={22} fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
        {/* scale ticks */}
        {ticks.map((tick) => {
          const y = valueToY(tick)
          const major = isLabeled(tick)
          const mid = Math.abs(tick % 10) < 1e-9
          const len = major ? 18 : mid ? 12 : 7
          return (
            <g key={tick}>
              <line
                x1={tubeX + tubeW}
                y1={y}
                x2={tubeX + tubeW + len}
                y2={y}
                stroke="#334155"
                strokeWidth={major ? 2 : 1}
              />
              {major && (
                <text
                  x={tubeX + tubeW + len + 6}
                  y={y + 4}
                  fill="#334155"
                  fontSize="13"
                  fontFamily="system-ui,sans-serif"
                >
                  {tick} °C
                </text>
              )}
            </g>
          )
        })}
        {/* drag handle */}
        <g className={dragging ? 'dragging' : undefined} style={{ cursor: 'ns-resize' }}>
          <line
            x1={tubeX - 8}
            y1={fillY}
            x2={tubeX + 2}
            y2={fillY}
            stroke="#2563eb"
            strokeWidth="3"
          />
          <circle
            cx={tubeX - 14}
            cy={fillY}
            r={11}
            fill="#2563eb"
            stroke="#fff"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  )
}
