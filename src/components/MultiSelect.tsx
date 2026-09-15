import './ChoicePick.css'

export interface MultiSelectProps {
  choices: string[]
  value: string[]
  onChange: (selected: string[]) => void
  instruction?: string
  disabled?: boolean
}

/** Toggle several choices (e.g. Mantelflächen am Netz). */
export const MultiSelect: React.FC<MultiSelectProps> = ({
  choices,
  value,
  onChange,
  instruction,
  disabled = false,
}) => {
  const selected = new Set(value)
  const toggle = (c: string) => {
    const next = new Set(selected)
    if (next.has(c)) next.delete(c)
    else next.add(c)
    onChange(choices.filter((x) => next.has(x)))
  }
  return (
    <div className="choice-pick">
      {instruction && <p className="choice-pick__instruction">{instruction}</p>}
      <div className="choice-pick__row" role="group" aria-label="Mehrere Antworten wählen">
        {choices.map((c) => {
          const on = selected.has(c)
          return (
            <button
              key={c}
              type="button"
              className={`choice-pick__btn${on ? ' choice-pick__btn--selected' : ''}`}
              onClick={() => toggle(c)}
              disabled={disabled}
              aria-pressed={on}
            >
              {c}
            </button>
          )
        })}
      </div>
    </div>
  )
}
