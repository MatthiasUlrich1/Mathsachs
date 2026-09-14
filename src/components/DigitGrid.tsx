import './DigitGrid.css'

export interface DigitGridRow {
  /** Optional prefix shown left of the digits (e.g. "+", "−", "·"). */
  prefix?: string
  /** Digits for this row (already right-aligned to answerLength). */
  digits: string[]
  /** If true, cells are editable answer cells. */
  editable?: boolean
}

export interface DigitGridProps {
  /** Operand / separator rows above the answer. */
  rows: DigitGridRow[]
  /** Current answer digits (one string per cell, '' when empty). */
  digits: string[]
  /** Callback when answer digits change. */
  onChange: (digits: string[]) => void
  /** Optional instruction above the grid. */
  instruction?: string
  /** Disable editing. */
  disabled?: boolean
}

/**
 * Written-arithmetic style digit grid (Kästchenpapier).
 * Shows fixed operand rows and an editable result row — one digit per cell.
 */
export const DigitGrid: React.FC<DigitGridProps> = ({
  rows,
  digits,
  onChange,
  instruction,
  disabled = false,
}) => {
  const setDigit = (index: number, raw: string) => {
    if (disabled) return
    const char = raw.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = char
    onChange(next)
  }

  const onKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const prev = e.currentTarget
        .closest('.digit-grid__row')
        ?.querySelectorAll<HTMLInputElement>('input')[index - 1]
      prev?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      const prev = e.currentTarget
        .closest('.digit-grid__row')
        ?.querySelectorAll<HTMLInputElement>('input')[index - 1]
      prev?.focus()
      e.preventDefault()
    }
    if (e.key === 'ArrowRight' && index < digits.length - 1) {
      const next = e.currentTarget
        .closest('.digit-grid__row')
        ?.querySelectorAll<HTMLInputElement>('input')[index + 1]
      next?.focus()
      e.preventDefault()
    }
  }

  const onInput = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    setDigit(index, e.target.value)
    if (e.target.value.replace(/\D/g, '') && index < digits.length - 1) {
      const next = e.currentTarget
        .closest('.digit-grid__row')
        ?.querySelectorAll<HTMLInputElement>('input')[index + 1]
      next?.focus()
    }
  }

  return (
    <div className="digit-grid">
      {instruction && <div className="digit-grid__instruction">{instruction}</div>}
      <div className="digit-grid__paper" role="group" aria-label="Schriftliches Rechnen">
        {rows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className={`digit-grid__row ${row.editable ? 'digit-grid__row--answer' : ''}`}
          >
            <span className="digit-grid__prefix">{row.prefix ?? ''}</span>
            <div className="digit-grid__cells">
              {row.editable
                ? digits.map((d, i) => (
                    <input
                      key={i}
                      className="digit-grid__cell digit-grid__cell--input"
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      disabled={disabled}
                      aria-label={`Ziffer ${i + 1} von ${digits.length}`}
                      onChange={(e) => onInput(i, e)}
                      onKeyDown={(e) => onKeyDown(i, e)}
                    />
                  ))
                : row.digits.map((d, i) => (
                    <span key={i} className={`digit-grid__cell ${d ? '' : 'digit-grid__cell--empty'}`}>
                      {d || ''}
                    </span>
                  ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
