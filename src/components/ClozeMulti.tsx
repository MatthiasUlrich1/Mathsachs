import React from 'react'
import './ClozeMulti.css'

export interface ClozeMultiProps {
  /** Text split around blanks; blanks.length === segments.length - 1 */
  segments: string[]
  blanks: string[]
  onChange: (blanks: string[]) => void
  instruction?: string
  disabled?: boolean
  /** Optional placeholders per blank */
  placeholders?: string[]
  /** After check: per-blank correct/incorrect highlight */
  partResults?: boolean[]
}

/** Multi-blank cloze: several gaps in one running sentence. */
export const ClozeMulti: React.FC<ClozeMultiProps> = ({
  segments,
  blanks,
  onChange,
  instruction,
  disabled = false,
  placeholders,
  partResults,
}) => {
  const setBlank = (index: number, value: string) => {
    const next = [...blanks]
    next[index] = value
    onChange(next)
  }

  return (
    <div className="cloze-multi">
      {instruction && <p className="cloze-multi__instruction">{instruction}</p>}
      <p className="cloze-multi__text" role="group" aria-label="Lückentext">
        {segments.map((seg, i) => (
          <React.Fragment key={`seg-${i}`}>
            <span>{seg}</span>
            {i < blanks.length && (
              <input
                className={[
                  'cloze-multi__input',
                  partResults?.[i] === true ? 'cloze-multi__input--ok' : '',
                  partResults?.[i] === false ? 'cloze-multi__input--bad' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                type="text"
                value={blanks[i] ?? ''}
                onChange={(e) => setBlank(i, e.target.value)}
                disabled={disabled}
                placeholder={placeholders?.[i] ?? '…'}
                aria-label={`Lücke ${i + 1}`}
                aria-invalid={partResults?.[i] === false ? true : undefined}
                autoComplete="off"
                spellCheck={false}
              />
            )}
          </React.Fragment>
        ))}
      </p>
    </div>
  )
}
