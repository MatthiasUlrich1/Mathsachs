import { useCallback, useRef, useState } from 'react'
import './CoordinateClick.css'

export interface CoordinateClickProps {
  xRange: [number, number]
  yRange: [number, number]
  cellSize?: number
  value: { x: number; y: number } | null
  onChange: (point: { x: number; y: number }) => void
  instruction?: string
  disabled?: boolean
}

/**
 * Interactive coordinate grid: click/tap snaps to the nearest lattice point.
 */
export const CoordinateClick: React.FC<CoordinateClickProps> = ({
  xRange,
  yRange,
  cellSize = 32,
  value,
  onChange,
  instruction,
  disabled = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null)

  const xMin = Math.min(xRange[0], xRange[1])
  const xMax = Math.max(xRange[0], xRange[1])
  const yMin = Math.min(yRange[0], yRange[1])
  const yMax = Math.max(yRange[0], yRange[1])

  const padL = 36
  const padR = 44
  const padT = 28
  const padB = 36
  const gridW = (xMax - xMin) * cellSize
  const gridH = (yMax - yMin) * cellSize
  const totalW = padL + gridW + padR
  const totalH = padT + gridH + padB

  const toSvg = useCallback(
    (mx: number, my: number): [number, number] => [
      padL + (mx - xMin) * cellSize,
      padT + (yMax - my) * cellSize,
    ],
    [cellSize, padL, padT, xMin, yMax],
  )

  const screenToGrid = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const svg = svgRef.current
      if (!svg) return null
      const rect = svg.getBoundingClientRect()
      const sx = ((clientX - rect.left) / rect.width) * totalW
      const sy = ((clientY - rect.top) / rect.height) * totalH
      const mx = xMin + (sx - padL) / cellSize
      const my = yMax - (sy - padT) / cellSize
      const x = Math.round(mx)
      const y = Math.round(my)
      if (x < xMin || x > xMax || y < yMin || y > yMax) return null
      return { x, y }
    },
    [cellSize, padL, padT, totalH, totalW, xMax, xMin, yMax, yMin],
  )

  const [ox, oy] = toSvg(0, 0)
  const gridLines: string[] = []
  for (let x = xMin; x <= xMax; x++) {
    const [sx] = toSvg(x, 0)
    gridLines.push(
      `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + gridH}" stroke="${
        x === 0 ? '#555' : '#c8c8c8'
      }" stroke-width="${x === 0 ? 2 : 1}"/>`,
    )
  }
  for (let y = yMin; y <= yMax; y++) {
    const [, sy] = toSvg(0, y)
    gridLines.push(
      `<line x1="${padL}" y1="${sy}" x2="${padL + gridW}" y2="${sy}" stroke="${
        y === 0 ? '#555' : '#c8c8c8'
      }" stroke-width="${y === 0 ? 2 : 1}"/>`,
    )
  }

  const tickLabels: React.ReactNode[] = []
  for (let x = xMin; x <= xMax; x++) {
    if (x === 0) continue
    const [sx] = toSvg(x, 0)
    tickLabels.push(
      <text key={`x${x}`} x={sx} y={oy + 16} textAnchor="middle" fontSize={11} fill="#444">
        {x}
      </text>,
    )
  }
  for (let y = yMin; y <= yMax; y++) {
    if (y === 0) continue
    const [, sy] = toSvg(0, y)
    tickLabels.push(
      <text key={`y${y}`} x={ox - 10} y={sy + 4} textAnchor="end" fontSize={11} fill="#444">
        {y}
      </text>,
    )
  }

  const mark = value ?? hover
  const markPos = mark ? toSvg(mark.x, mark.y) : null

  return (
    <div className="coordinate-click">
      {instruction && <p className="coordinate-click__instruction">{instruction}</p>}
      <svg
        ref={svgRef}
        className={`coordinate-click__svg${disabled ? ' coordinate-click__svg--disabled' : ''}`}
        width={totalW}
        height={totalH}
        viewBox={`0 0 ${totalW} ${totalH}`}
        onClick={(e) => {
          if (disabled) return
          const p = screenToGrid(e.clientX, e.clientY)
          if (p) onChange(p)
        }}
        onMouseMove={(e) => {
          if (disabled) return
          setHover(screenToGrid(e.clientX, e.clientY))
        }}
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label="Koordinatensystem – Punkt setzen"
      >
        <rect x={0} y={0} width={totalW} height={totalH} fill="#fafafa" />
        <g dangerouslySetInnerHTML={{ __html: gridLines.join('') }} />
        <line
          x1={padL}
          y1={oy}
          x2={padL + gridW + 10}
          y2={oy}
          stroke="#555"
          strokeWidth={2}
        />
        <line
          x1={ox}
          y1={padT + gridH}
          x2={ox}
          y2={padT - 10}
          stroke="#555"
          strokeWidth={2}
        />
        <text x={padL + gridW + 14} y={oy + 4} fontSize={14} fontWeight="bold" fill="#333">
          x
        </text>
        <text x={ox + 8} y={padT - 6} fontSize={14} fontWeight="bold" fill="#333">
          y
        </text>
        {tickLabels}
        {markPos && (
          <circle
            cx={markPos[0]}
            cy={markPos[1]}
            r={value ? 7 : 5}
            fill={value ? '#1565c0' : '#90caf9'}
            stroke="#0d47a1"
            strokeWidth={2}
            pointerEvents="none"
          />
        )}
      </svg>
      {value && (
        <p className="coordinate-click__readout">
          Gewählt: ({value.x}|{value.y})
        </p>
      )}
    </div>
  )
}
