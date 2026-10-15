import React from 'react'
import './FindError.css'

export interface FindErrorProps {
  statements: string[]
  value: string | null
  onChange: (choice: string) => void
  instruction?: string
  disabled?: boolean
}

/** Pick the statement that contains a factual error. */
export const FindError: React.FC<FindErrorProps> = ({
  statements,
  value,
  onChange,
  instruction,
  disabled = false,
}) => (
  <div className="find-error">
    {instruction && <p className="find-error__instruction">{instruction}</p>}
    <div className="find-error__list" role="group" aria-label="Fehlerhafte Aussage wählen">
      {statements.map((s, i) => {
        const selected = value === s
        const letter = String.fromCharCode(65 + i)
        return (
          <button
            key={`${i}-${s.slice(0, 24)}`}
            type="button"
            className={`find-error__item${selected ? ' find-error__item--selected' : ''}`}
            onClick={() => onChange(s)}
            disabled={disabled}
            aria-pressed={selected}
          >
            <span className="find-error__badge" aria-hidden>
              {letter}
            </span>
            <span className="find-error__text">{s}</span>
          </button>
        )
      })}
    </div>
  </div>
)
