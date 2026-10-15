import React from 'react'
import './ComparePick.css'

export type CompareCard = {
  id: string
  title: string
  body: string
}

export interface ComparePickProps {
  cards: CompareCard[]
  value: string | null
  onChange: (choice: string) => void
  instruction?: string
  disabled?: boolean
}

/** Side-by-side A/B cards — pick which statement / scenario fits. */
export const ComparePick: React.FC<ComparePickProps> = ({
  cards,
  value,
  onChange,
  instruction,
  disabled = false,
}) => (
  <div className="compare-pick">
    {instruction && <p className="compare-pick__instruction">{instruction}</p>}
    <div className="compare-pick__grid" role="group" aria-label="Vergleich A oder B">
      {cards.map((card) => {
        const selected = value === card.id
        return (
          <button
            key={card.id}
            type="button"
            className={`compare-pick__card${selected ? ' compare-pick__card--selected' : ''}`}
            onClick={() => onChange(card.id)}
            disabled={disabled}
            aria-pressed={selected}
          >
            <span className="compare-pick__title">{card.title}</span>
            <span className="compare-pick__body">{card.body}</span>
          </button>
        )
      })}
    </div>
  </div>
)
