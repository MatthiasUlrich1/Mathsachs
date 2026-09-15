import './ChoicePick.css'

export interface ChoicePickProps {
  choices: string[]
  value: string | null
  onChange: (choice: string) => void
  instruction?: string
  disabled?: boolean
}

/** Tappable multiple-choice buttons (A/B/C, Winkelart, Kongruenzsatz, …). */
export const ChoicePick: React.FC<ChoicePickProps> = ({
  choices,
  value,
  onChange,
  instruction,
  disabled = false,
}) => (
  <div className="choice-pick">
    {instruction && <p className="choice-pick__instruction">{instruction}</p>}
    <div className="choice-pick__row" role="group" aria-label="Antwort wählen">
      {choices.map((c) => {
        const selected = value === c
        return (
          <button
            key={c}
            type="button"
            className={`choice-pick__btn${selected ? ' choice-pick__btn--selected' : ''}`}
            onClick={() => onChange(c)}
            disabled={disabled}
            aria-pressed={selected}
          >
            {c}
          </button>
        )
      })}
    </div>
  </div>
)
