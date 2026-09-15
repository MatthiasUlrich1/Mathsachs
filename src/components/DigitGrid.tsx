import './DigitGrid.css'

export interface DigitGridRow {
  /** Optional prefix shown left of the digits (e.g. "+", "−", "·", ":"). */
  prefix?: string
  /** Digits / symbols for this row (right-aligned cells; '' = empty cell). */
  digits: string[]
  /** If true, cells are editable answer cells. */
  editable?: boolean
  /** Draw a horizontal rule under the previous content (separator line). */
  rule?: boolean
  /** Annotation to the right of the row (e.g. "= 23 · 30"). */
  label?: string
  /** Color emphasis for the whole row (display or input). */
  tone?: 'green' | 'blue' | 'red' | 'default'
  /** Per-cell color for display digits (overrides `tone` when set). */
  cellTones?: Array<'green' | 'blue' | 'red' | 'default'>
}

export interface DigitGridProps {
  /** Operand / separator / editable rows. */
  rows: DigitGridRow[]
  /**
   * Flat answer digits for a single editable row (legacy +/−).
   * Ignored when `answerRows` is provided.
   */
  digits: string[]
  /**
   * Multi-row answers: one string[] per editable row (same order as editable rows).
   * When set, DigitGrid uses this instead of flat `digits`.
   */
  answerRows?: string[][]
  /** Callback when a single-row answer changes. */
  onChange: (digits: string[]) => void
  /** Callback when multi-row answers change. */
  onChangeRows?: (rows: string[][]) => void
  instruction?: string
  disabled?: boolean
}

const emptyRow = (len: number): string[] => Array.from({ length: len }, () => '')

/**
 * Written-arithmetic style digit grid (Kästchenpapier).
 * Supports stacked +/−, multi-row multiplication (partial products + sum),
 * and division header with editable quotient.
 */
export const DigitGrid: React.FC<DigitGridProps> = ({
  rows,
  digits,
  answerRows,
  onChange,
  onChangeRows,
  instruction,
  disabled = false,
}) => {
  const editableMeta = rows
    .map((row, idx) => ({ row, idx }))
    .filter(({ row }) => row.editable)

  const multi = Boolean(answerRows && answerRows.length > 0)

  const rowDigits = (editableIndex: number, width: number): string[] => {
    if (multi && answerRows) {
      const r = answerRows[editableIndex] ?? emptyRow(width)
      if (r.length === width) return r
      const next = emptyRow(width)
      for (let i = 0; i < Math.min(width, r.length); i++) next[i] = r[i] ?? ''
      return next
    }
    // Legacy: only the first editable row uses flat digits
    if (editableIndex === 0) {
      if (digits.length === width) return digits
      const next = emptyRow(width)
      for (let i = 0; i < Math.min(width, digits.length); i++) next[i] = digits[i] ?? ''
      return next
    }
    return emptyRow(width)
  }

  const setCell = (editableIndex: number, cellIndex: number, raw: string, width: number) => {
    if (disabled) return
    const char = raw.replace(/\D/g, '').slice(-1)
    if (multi && onChangeRows) {
      const nextRows = editableMeta.map(({ row }, i) => {
        const w = row.digits.length
        return rowDigits(i, w)
      })
      const copy = [...(nextRows[editableIndex] ?? emptyRow(width))]
      copy[cellIndex] = char
      nextRows[editableIndex] = copy
      onChangeRows(nextRows)
      // Also keep flat digits = last editable row (final answer) for protocol fallback
      const last = nextRows[nextRows.length - 1] ?? []
      onChange(last)
      return
    }
    const next = [...rowDigits(0, width)]
    next[cellIndex] = char
    onChange(next)
  }

  const focusCell = (
    editableIndex: number,
    cellIndex: number,
    from: HTMLInputElement,
  ) => {
    const paper = from.closest('.digit-grid__paper')
    if (!paper) return
    const input = paper.querySelector<HTMLInputElement>(
      `input[data-edit-row="${editableIndex}"][data-edit-cell="${cellIndex}"]`,
    )
    input?.focus()
  }

  const onKeyDown = (
    editableIndex: number,
    cellIndex: number,
    width: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    current: string[],
  ) => {
    if (e.key === 'Backspace' && !current[cellIndex] && cellIndex > 0) {
      focusCell(editableIndex, cellIndex - 1, e.currentTarget)
    }
    if (e.key === 'ArrowLeft' && cellIndex > 0) {
      focusCell(editableIndex, cellIndex - 1, e.currentTarget)
      e.preventDefault()
    }
    if (e.key === 'ArrowRight' && cellIndex < width - 1) {
      focusCell(editableIndex, cellIndex + 1, e.currentTarget)
      e.preventDefault()
    }
    if (e.key === 'ArrowUp' && editableIndex > 0) {
      const prevW = editableMeta[editableIndex - 1].row.digits.length
      focusCell(editableIndex - 1, Math.min(cellIndex, prevW - 1), e.currentTarget)
      e.preventDefault()
    }
    if (e.key === 'ArrowDown' && editableIndex < editableMeta.length - 1) {
      const nextW = editableMeta[editableIndex + 1].row.digits.length
      focusCell(editableIndex + 1, Math.min(cellIndex, nextW - 1), e.currentTarget)
      e.preventDefault()
    }
  }

  let editableCounter = -1

  return (
    <div className="digit-grid">
      {instruction && <div className="digit-grid__instruction">{instruction}</div>}
      <div className="digit-grid__paper" role="group" aria-label="Schriftliches Rechnen">
        {rows.map((row, rowIdx) => {
          if (row.rule) {
            return (
              <div
                key={`rule-${rowIdx}`}
                className="digit-grid__rule"
                style={{ width: `calc(${row.digits.length || 1} * 36px)` }}
                aria-hidden
              />
            )
          }

          const isEdit = Boolean(row.editable)
          if (isEdit) editableCounter += 1
          const eIdx = editableCounter
          const width = row.digits.length
          const values = isEdit ? rowDigits(eIdx, width) : row.digits
          const tone = row.tone ?? (isEdit ? 'input' : 'default')

          return (
            <div
              key={rowIdx}
              className={`digit-grid__row${isEdit ? ' digit-grid__row--answer' : ''}`}
            >
              <span className="digit-grid__prefix">{row.prefix ?? ''}</span>
              <div className="digit-grid__cells">
                {values.map((d, i) =>
                  isEdit ? (
                    <input
                      key={i}
                      data-edit-row={eIdx}
                      data-edit-cell={i}
                      className={`digit-grid__cell digit-grid__cell--input digit-grid__cell--${tone === 'red' ? 'red' : 'input'}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      disabled={disabled}
                      aria-label={`Zeile ${eIdx + 1}, Ziffer ${i + 1}`}
                      onChange={(e) => {
                        setCell(eIdx, i, e.target.value, width)
                        if (e.target.value.replace(/\D/g, '') && i < width - 1) {
                          focusCell(eIdx, i + 1, e.currentTarget)
                        }
                      }}
                      onKeyDown={(e) => onKeyDown(eIdx, i, width, e, values)}
                    />
                  ) : (
                    <span
                      key={i}
                      className={`digit-grid__cell${d ? '' : ' digit-grid__cell--empty'}${(() => {
                        const cellTone = row.cellTones?.[i] ?? tone
                        return cellTone !== 'default' ? ` digit-grid__cell--${cellTone}` : ''
                      })()}`}
                    >
                      {d || ''}
                    </span>
                  ),
                )}
              </div>
              {row.label ? <span className="digit-grid__label">{row.label}</span> : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
