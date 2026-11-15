import { useRef, useState, type MutableRefObject, type RefObject } from 'react'
import type { UserInput } from '../curriculum/types'
import {
  FRACTION_WALL_HANDLE,
  FRACTION_WALL_LINE_STEP,
  FRACTION_WALL_VIEWBOX_W,
  clampLinePos,
  fractionWallLayout,
  fractionWallLineSpan,
  fractionWallViewBoxH,
  linePosFromClientX,
  normalizeWallSelection,
  toggleWallTile,
  wallLineX,
  type FractionWallFraction,
  type FractionWallMode,
} from '../lib/fractionWallLogic'
import './FractionWall.css'

type FractionWallValue = Extract<UserInput, { kind: 'fractionWall' }>

export interface FractionWallProps {
  mode: FractionWallMode
  rows: number[]
  /** equivalent mode: this fraction is shown shaded in its own row (reference, not part of the answer). */
  target?: FractionWallFraction
  value: FractionWallValue
  onChange: (value: UserInput) => void
  instruction?: string
  disabled?: boolean
}

export interface FractionWallBoardProps extends FractionWallProps {
  /** Comparison line, 0..1 across the wall. A help only, never part of the answer. */
  linePos: number
  onLineChange: (pos: number) => void
  /** Owned by the caller so the board itself stays hook-free (and testable). */
  svgRef: RefObject<SVGSVGElement>
  grabRef: MutableRefObject<number>
}

const rowName = (row: number) => (row === 1 ? 'Ganzes' : `1/${row}`)

/** The wall itself (no own state): tiles, row labels and the comparison line with its handle. */
export function FractionWallBoard({
  mode,
  rows,
  target,
  value,
  onChange,
  instruction,
  disabled,
  linePos,
  onLineChange,
  svgRef,
  grabRef,
}: FractionWallBoardProps) {
  const selected = normalizeWallSelection(rows, value.selected)
  const layout = fractionWallLayout(rows)
  const h = fractionWallViewBoxH(rows.length)
  const lineX = wallLineX(linePos)
  const span = fractionWallLineSpan(rows.length)
  const referenceRow = mode === 'equivalent' && target ? target.den : null

  const tap = (row: number, index: number) => {
    if (disabled || row === referenceRow) return
    onChange({
      kind: 'fractionWall',
      selected: toggleWallTile(rows, selected, row, index, mode === 'compare'),
    })
  }

  const moveTo = (clientX: number) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    onLineChange(linePosFromClientX(clientX, rect.left, rect.width, grabRef.current))
  }

  return (
    <div className="fraction-wall">
      {instruction && <p className="fraction-wall__instruction">{instruction}</p>}
      <svg
        ref={svgRef}
        className="fraction-wall__svg"
        viewBox={`0 0 ${FRACTION_WALL_VIEWBOX_W} ${h}`}
        role="group"
        aria-disabled={disabled ? true : undefined}
        aria-label="Bruchwand"
      >
        {layout.map((r) => {
          const isRef = r.row === referenceRow
          const count = isRef ? (target?.num ?? 0) : (selected.find((s) => s.row === r.row)?.count ?? 0)
          return (
            <g key={r.row} data-testid="wall-row" data-row={r.row}>
              <text className="fraction-wall__label" x={r.labelX} y={r.y + r.h / 2 + 4} textAnchor="end">
                {rowName(r.row)}
              </text>
              {r.tiles.map((t) => {
                const on = t.index < count
                return (
                  <rect
                    key={t.index}
                    x={t.x}
                    y={r.y}
                    width={t.w}
                    height={r.h}
                    data-testid="wall-tile"
                    data-row={r.row}
                    data-index={t.index}
                    data-selected={on ? 'true' : 'false'}
                    className={`fraction-wall__tile${on ? (isRef ? ' fraction-wall__tile--ref' : ' fraction-wall__tile--on') : ''}${isRef ? ' fraction-wall__tile--fixed' : ''}`}
                    role="checkbox"
                    aria-checked={on}
                    aria-disabled={isRef || disabled ? true : undefined}
                    aria-label={`Reihe ${rowName(r.row)}, Teil ${t.index + 1} von ${r.row}`}
                    tabIndex={disabled || isRef ? -1 : 0}
                    onPointerDown={(e) => {
                      e.preventDefault()
                      tap(r.row, t.index)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault()
                        tap(r.row, t.index)
                      }
                    }}
                  />
                )
              })}
            </g>
          )
        })}
        <line
          className="fraction-wall__line"
          data-testid="wall-line"
          x1={lineX}
          x2={lineX}
          y1={span.y1}
          y2={span.y2}
        />
        <circle
          className="fraction-wall__handle"
          data-testid="wall-handle"
          cx={lineX}
          cy={FRACTION_WALL_HANDLE.y}
          r={FRACTION_WALL_HANDLE.r}
          role="slider"
          aria-label="Vergleichslinie"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(linePos * 100)}
          aria-orientation="horizontal"
          tabIndex={0}
          onPointerDown={(e) => {
            e.preventDefault()
            try {
              e.currentTarget.setPointerCapture(e.pointerId)
            } catch {
              /* pointer capture is optional */
            }
            const rect = svgRef.current?.getBoundingClientRect()
            // Keep the grab offset (SVG units) so the handle does not jump under the finger.
            grabRef.current =
              rect && rect.width > 0 ? ((e.clientX - rect.left) * FRACTION_WALL_VIEWBOX_W) / rect.width - lineX : 0
          }}
          onPointerMove={(e) => {
            let captured = false
            try {
              captured = e.currentTarget.hasPointerCapture(e.pointerId)
            } catch {
              captured = false
            }
            if (captured) moveTo(e.clientX)
          }}
          onPointerUp={(e) => {
            try {
              e.currentTarget.releasePointerCapture(e.pointerId)
            } catch {
              /* ignore */
            }
          }}
          onKeyDown={(e) => {
            const dir =
              e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0
            if (dir === 0) return
            e.preventDefault()
            onLineChange(clampLinePos(linePos + dir * FRACTION_WALL_LINE_STEP))
          }}
        />
      </svg>
    </div>
  )
}

/** Interactive fraction wall with a movable vertical comparison line. */
export function FractionWall(props: FractionWallProps) {
  const [linePos, setLinePos] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)
  const grabRef = useRef(0)
  return <FractionWallBoard {...props} linePos={linePos} onLineChange={setLinePos} svgRef={svgRef} grabRef={grabRef} />
}
