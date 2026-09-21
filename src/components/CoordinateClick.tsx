import { useCallback, useRef, useState } from 'react'
import './CoordinateClick.css'

export interface CoordinateMarker {
  x: number
  y: number
  label?: string
  color?: string
}

export type CoordPoint = { x: number; y: number }

export interface CoordinateClickProps {
  xRange: [number, number]
  yRange: [number, number]
  cellSize?: number
  /** Single-point mode (default / maxPoints === 1). */
  value?: CoordPoint | null
  onChange?: (point: CoordPoint) => void
  /** Multi-point mode when maxPoints > 1. */
  points?: CoordPoint[]
  onChangePoints?: (points: CoordPoint[]) => void
  /** How many points the learner may place (1–12). Default 1. */
  maxPoints?: number
  instruction?: string
  disabled?: boolean
  markers?: CoordinateMarker[]
  guide?: { from: CoordPoint; to: CoordPoint }
  /** Drawn when disabled (Auflösung). */
  solutionRay?: { from: CoordPoint; to: CoordPoint }
  showSolution?: boolean
  /** Optional solution points to show when disabled. */
  solutionPoints?: CoordPoint[]
}

function samePoint(a: CoordPoint, b: CoordPoint): boolean {
  return a.x === b.x && a.y === b.y
}

/**
 * Interactive coordinate grid: click/tap snaps to the nearest lattice point.
 * Supports one or several points (maxPoints).
 */
export const CoordinateClick: React.FC<CoordinateClickProps> = ({
  xRange,
  yRange,
  cellSize = 32,
  value = null,
  onChange,
  points: pointsProp,
  onChangePoints,
  maxPoints = 1,
  instruction,
  disabled = false,
  markers = [],
  guide,
  solutionRay,
  showSolution = false,
  solutionPoints = [],
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hover, setHover] = useState<CoordPoint | null>(null)

  const multi = maxPoints > 1
  const selected: CoordPoint[] = multi
    ? (pointsProp ?? [])
    : value
      ? [value]
      : []

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
    [cellSize, xMin, yMax],
  )

  const screenToGrid = useCallback(
    (clientX: number, clientY: number): CoordPoint | null => {
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
    [cellSize, totalH, totalW, xMax, xMin, yMax, yMin],
  )

  const emit = (next: CoordPoint[]) => {
    if (multi) {
      onChangePoints?.(next)
      return
    }
    const p = next[0]
    if (p) onChange?.(p)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return
    const p = screenToGrid(e.clientX, e.clientY)
    if (!p) return
    if (!multi) {
      onChange?.(p)
      return
    }
    const idx = selected.findIndex((s) => samePoint(s, p))
    if (idx >= 0) {
      emit(selected.filter((_, i) => i !== idx))
      return
    }
    if (selected.length >= maxPoints) {
      // Replace oldest when full
      emit([...selected.slice(1), p])
      return
    }
    emit([...selected, p])
  }

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

  const hoverPos =
    hover && !selected.some((s) => samePoint(s, hover)) ? toSvg(hover.x, hover.y) : null
  const guideFrom = guide ? toSvg(guide.from.x, guide.from.y) : null
  const guideTo = guide ? toSvg(guide.to.x, guide.to.y) : null
  const rayFrom = showSolution && solutionRay ? toSvg(solutionRay.from.x, solutionRay.from.y) : null
  const rayTo = showSolution && solutionRay ? toSvg(solutionRay.to.x, solutionRay.to.y) : null
  const solPts = showSolution ? solutionPoints : []

  const readout =
    selected.length === 0
      ? null
      : selected.map((p) => `(${p.x}|${p.y})`).join(', ')

  return (
    <div className="coordinate-click">
      {instruction && <p className="coordinate-click__instruction">{instruction}</p>}
      <svg
        ref={svgRef}
        className={`coordinate-click__svg${disabled ? ' coordinate-click__svg--disabled' : ''}`}
        width={totalW}
        height={totalH}
        viewBox={`0 0 ${totalW} ${totalH}`}
        onClick={handleClick}
        onMouseMove={(e) => {
          if (disabled) return
          setHover(screenToGrid(e.clientX, e.clientY))
        }}
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label={
          multi
            ? `Koordinatensystem – bis zu ${maxPoints} Punkte setzen`
            : 'Kästchenpapier – Punkt tippen'
        }
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
        {guideFrom && guideTo && (
          <line
            x1={guideFrom[0]}
            y1={guideFrom[1]}
            x2={guideTo[0]}
            y2={guideTo[1]}
            stroke="#f59e0b"
            strokeWidth={3}
            strokeDasharray="6 4"
            pointerEvents="none"
          />
        )}
        {rayFrom && rayTo && (
          <line
            x1={rayFrom[0]}
            y1={rayFrom[1]}
            x2={rayTo[0]}
            y2={rayTo[1]}
            stroke="#2563eb"
            strokeWidth={3.5}
            pointerEvents="none"
          />
        )}
        {markers.map((m, i) => {
          const [sx, sy] = toSvg(m.x, m.y)
          const fill = m.color ?? '#f59e0b'
          return (
            <g key={`m${i}`} pointerEvents="none">
              <circle cx={sx} cy={sy} r={8} fill={fill} stroke="#92400e" strokeWidth={2} />
              {m.label && (
                <text
                  x={sx}
                  y={sy - 12}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#334155"
                  fontWeight={600}
                >
                  {m.label}
                </text>
              )}
            </g>
          )
        })}
        {solPts.map((p, i) => {
          const [sx, sy] = toSvg(p.x, p.y)
          return (
            <circle
              key={`sol${i}`}
              cx={sx}
              cy={sy}
              r={7}
              fill="#c62828"
              stroke="#b71c1c"
              strokeWidth={2}
              opacity={0.55}
              pointerEvents="none"
            />
          )
        })}
        {selected.map((p, i) => {
          const [sx, sy] = toSvg(p.x, p.y)
          return (
            <g key={`s${i}`} pointerEvents="none">
              <circle
                cx={sx}
                cy={sy}
                r={7}
                fill="#1565c0"
                stroke="#0d47a1"
                strokeWidth={2}
              />
              {multi && (
                <text
                  x={sx}
                  y={sy + 4}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={700}
                  fill="#fff"
                >
                  {i + 1}
                </text>
              )}
            </g>
          )
        })}
        {hoverPos && (
          <circle
            cx={hoverPos[0]}
            cy={hoverPos[1]}
            r={5}
            fill="#90caf9"
            stroke="#0d47a1"
            strokeWidth={2}
            pointerEvents="none"
          />
        )}
      </svg>
      {!showSolution && (
        <p className="coordinate-click__readout">
          {multi
            ? `Punkte: ${selected.length}/${maxPoints}${readout ? ` — ${readout}` : ''}`
            : readout
              ? `Gewählt: ${readout}`
              : null}
        </p>
      )}
      {showSolution && solutionRay && (
        <p className="coordinate-click__readout">Auflösung: Lichtstrahl eingezeichnet</p>
      )}
    </div>
  )
}
