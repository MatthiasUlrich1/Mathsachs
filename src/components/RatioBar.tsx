import type { UserInput } from '../curriculum/types'
import {
  RATIO_CELL_FONT,
  RATIO_FILL_A,
  RATIO_FILL_B,
  RATIO_LEGEND_FONT,
  RATIO_SWATCH,
  RATIO_TOTAL_FONT,
  cycleRatioField,
  normalizeParts,
  ratioBarLayout,
  ratioLegendText,
  ratioSplitParts,
  ratioTotalText,
  type RatioBarMode,
  type RatioPart,
} from '../lib/ratioBarLogic'
import './RatioBar.css'

type RatioBarValue = Extract<UserInput, { kind: 'ratioBar' }>

export interface RatioBarProps {
  mode: RatioBarMode
  /** colour mode: number of fields in the bar. */
  segments: number
  ratio: readonly [number, number]
  /** Names of the two parts, e.g. ['Saft', 'Wasser']. */
  labels: readonly [string, string]
  /** split mode: the total amount and its unit. */
  total?: number
  unit?: string
  value: RatioBarValue
  onChange: (value: UserInput) => void
  instruction?: string
  disabled?: boolean
}

const fillOf = (p: RatioPart): string => (p === 'A' ? RATIO_FILL_A : p === 'B' ? RATIO_FILL_B : '#ffffff')

const keyActivate = (run: () => void) => (e: { key: string; preventDefault: () => void }) => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    run()
  }
}

/** Ratio bar: colour the fields A/B by tapping (colour) or type the two shares of a total (split). Tap-only, no state of its own. */
export function RatioBar({ mode, segments, ratio, labels, total, unit, value, onChange, instruction, disabled }: RatioBarProps) {
  const split = mode === 'split'
  const fieldCount = split ? ratio[0] + ratio[1] : segments
  const layout = ratioBarLayout(mode, fieldCount)
  const parts: RatioPart[] = split ? ratioSplitParts(ratio) : normalizeParts(segments, value.parts)
  const amounts: [string, string] = value.amounts ?? ['', '']

  const tapField = (index: number) => {
    if (disabled || split) return
    onChange({ kind: 'ratioBar', parts: cycleRatioField(segments, value.parts, index) })
  }
  const setAmount = (which: 0 | 1, text: string) => {
    if (disabled) return
    const next: [string, string] = [amounts[0], amounts[1]]
    next[which] = text
    onChange({ kind: 'ratioBar', parts: [], amounts: next })
  }
  const stateName = (p: RatioPart) => (p === null ? 'nicht gefärbt' : `${p} = ${labels[p === 'A' ? 0 : 1]}`)

  return (
    <div className="ratio-bar">
      {instruction && <p className="ratio-bar__instruction">{instruction}</p>}
      <svg
        className="ratio-bar__svg"
        viewBox={`0 0 ${layout.viewBoxW} ${layout.viewBoxH}`}
        role="group"
        aria-disabled={disabled ? true : undefined}
        aria-label={
          split
            ? `Verhältnisleiste mit ${fieldCount} Feldern, ${ratio[0]} für ${labels[0]} und ${ratio[1]} für ${labels[1]}`
            : `Verhältnisleiste mit ${fieldCount} Feldern, ${parts.filter((p) => p !== null).length} gefärbt`
        }
      >
        {split && layout.totalY !== null && total !== undefined && (
          <text
            className="ratio-bar__total"
            x={layout.viewBoxW / 2}
            y={layout.totalY}
            textAnchor="middle"
            fontSize={RATIO_TOTAL_FONT}
          >
            {ratioTotalText(total, unit ?? '')}
          </text>
        )}
        {layout.cells.map((c) => {
          const p = parts[c.index] ?? null
          return (
            <g key={c.index}>
              <rect
                x={c.x}
                y={c.y}
                width={c.w}
                height={c.h}
                data-testid="ratio-cell"
                data-index={c.index}
                data-part={p ?? ''}
                className={`ratio-bar__cell${split ? ' ratio-bar__cell--fixed' : ''}`}
                fill={fillOf(p)}
                role={split ? undefined : 'button'}
                aria-label={split ? undefined : `Feld ${c.index + 1} von ${fieldCount}, ${stateName(p)}`}
                aria-disabled={disabled ? true : undefined}
                tabIndex={split || disabled ? undefined : 0}
                onClick={split ? undefined : () => tapField(c.index)}
                onKeyDown={split ? undefined : keyActivate(() => tapField(c.index))}
              />
              {p && (
                <text className="ratio-bar__letter" x={c.cx} y={c.textY} textAnchor="middle" fontSize={RATIO_CELL_FONT}>
                  {p}
                </text>
              )}
            </g>
          )
        })}
        {layout.legend.map((it, i) => (
          <g key={it.letter} data-testid="ratio-legend">
            <rect
              x={it.swatchX}
              y={it.swatchY}
              width={RATIO_SWATCH}
              height={RATIO_SWATCH}
              fill={it.letter === 'A' ? RATIO_FILL_A : RATIO_FILL_B}
              stroke="#334155"
              strokeWidth={1.5}
            />
            <text className="ratio-bar__legend" x={it.textX} y={it.textY} fontSize={RATIO_LEGEND_FONT}>
              {ratioLegendText(it.letter, labels[i]!)}
            </text>
          </g>
        ))}
      </svg>
      {split && (
        <div className="ratio-bar__answers">
          {([0, 1] as const).map((i) => (
            <label key={i} className="ratio-bar__answer">
              <span>{labels[i]}</span>
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                className="ratio-bar__input"
                data-testid={`ratio-amount-${i}`}
                value={amounts[i]}
                disabled={disabled}
                onChange={(e) => setAmount(i, e.target.value)}
              />
              {unit && <span>{unit}</span>}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
