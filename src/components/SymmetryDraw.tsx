import type { UserInput } from '../curriculum/types'
import {
  SYM_CENTRE_R,
  SYM_MAX_SIZE,
  cellKey,
  sortCells,
  symIsToggleable,
  symLayout,
  symToggle,
  symValidate,
  type SymConfig,
  type SymAxis,
  type SymPoint,
} from '../lib/symmetryDrawLogic'
import { SVG_COLOR } from '../lib/svgTokens'
import './SymmetryDraw.css'

type SymmetryValue = Extract<UserInput, { kind: 'symmetryDraw' }>

export interface SymmetryDrawProps {
  cols: number
  rows: number
  given: readonly string[]
  axis?: SymAxis
  point?: SymPoint
  value: SymmetryValue
  onChange: (value: UserInput) => void
  instruction?: string
  disabled?: boolean
}

const keyActivate = (run: () => void) => (e: { key: string; preventDefault: () => void }) => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    run()
  }
}

/** Symmetry drawing: tap the cells of the free side to colour them. Tap-only, no state of its own. */
export function SymmetryDraw({ cols, rows, given, axis, point, value, onChange, instruction, disabled }: SymmetryDrawProps) {
  // Malformed props (wrong sizes, missing or broken cells, bad axis) must not crash: show an empty, inert grid instead.
  const size = (n: number): number => (Number.isInteger(n) && n >= 1 && n <= SYM_MAX_SIZE ? n : Math.min(SYM_MAX_SIZE, Math.max(1, Math.round(Number(n)) || 1)))
  const rawGiven = Array.isArray(given) ? given.filter((g): g is string => typeof g === 'string') : []
  let config: SymConfig = { cols, rows, given: rawGiven, axis, point }
  let valid = true
  try {
    symValidate(config)
  } catch {
    valid = false
    config = { cols: size(cols), rows: size(rows), given: [] }
  }
  const layout = symLayout(config)
  const givenSet = new Set(config.given)
  const cells = new Set(Array.isArray(value.cells) ? value.cells : [])

  const tap = (x: number, y: number) => {
    if (disabled) return
    onChange({ kind: 'symmetryDraw', cells: symToggle(config, sortCells([...cells]), x, y) })
  }

  const grid = []
  for (let y = 0; y < config.rows; y++) {
    for (let x = 0; x < config.cols; x++) {
      const key = cellKey(x, y)
      const r = layout.cellRect(x, y)
      const isGiven = givenSet.has(key)
      const on = cells.has(key)
      const free = valid && !isGiven && symIsToggleable(config, x, y)
      const where = `Spalte ${x + 1}, Zeile ${y + 1}`
      grid.push(
        <rect
          key={key}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          data-testid="sym-cell"
          data-cell={key}
          data-state={isGiven ? 'given' : on ? 'on' : 'off'}
          className={`sym-draw__cell${free ? ' sym-draw__cell--free' : ''}`}
          fill={isGiven ? 'url(#sym-given-hatch)' : on ? SVG_COLOR.fillA : SVG_COLOR.surface}
          stroke={SVG_COLOR.svgLine}
          strokeWidth={1}
          role={free ? 'button' : undefined}
          aria-label={isGiven ? `${where}, vorgegeben` : free ? `${where}, ${on ? 'gefärbt' : 'nicht gefärbt'}` : undefined}
          aria-pressed={free ? on : undefined}
          aria-disabled={free && disabled ? true : undefined}
          tabIndex={free && !disabled ? 0 : undefined}
          onClick={free ? () => tap(x, y) : undefined}
          onKeyDown={free ? keyActivate(() => tap(x, y)) : undefined}
        />,
      )
    }
  }

  const a = valid ? layout.axisLine : null
  const c = valid ? layout.centre : null
  return (
    <div className="sym-draw">
      {instruction && <p className="sym-draw__instruction">{instruction}</p>}
      <svg
        className="sym-draw__svg"
        viewBox={`0 0 ${layout.viewBoxW} ${layout.viewBoxH}`}
        role="group"
        aria-disabled={disabled ? true : undefined}
        aria-label={
          !valid
            ? 'Leeres Gitter'
            : point
            ? `Gitter mit ${config.cols} Spalten und ${config.rows} Zeilen, Symmetriepunkt markiert, ${cells.size} Felder gefärbt`
            : `Gitter mit ${config.cols} Spalten und ${config.rows} Zeilen, Spiegelachse gestrichelt, ${cells.size} Felder gefärbt`
        }
      >
        <defs>
          {/* Given cells are hatched, drawn cells solid: they differ by pattern, not only by hue. */}
          <pattern id="sym-given-hatch" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill={SVG_COLOR.svgLine} />
            <path d="M-2 2 L2 -2 M0 8 L8 0 M6 10 L10 6" stroke={SVG_COLOR.surface} strokeWidth="2" />
          </pattern>
        </defs>
        {grid}
        {a && (
          <line
            data-testid="sym-axis"
            x1={a.x1}
            y1={a.y1}
            x2={a.x2}
            y2={a.y2}
            stroke={SVG_COLOR.highlight}
            strokeWidth={2.5}
            strokeDasharray="8 5"
            pointerEvents="none"
          />
        )}
        {c && <circle data-testid="sym-centre" cx={c.cx} cy={c.cy} r={SYM_CENTRE_R} fill={SVG_COLOR.highlight} pointerEvents="none" />}
      </svg>
    </div>
  )
}
