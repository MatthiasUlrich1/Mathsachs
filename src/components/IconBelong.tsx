import React from 'react'
import './IconBelong.css'

export type IconBelongOption = {
  id: string
  label: string
  /** Emoji or short glyph shown large */
  icon: string
}

export interface IconBelongProps {
  options: IconBelongOption[]
  value: string | null
  onChange: (id: string) => void
  instruction?: string
  disabled?: boolean
  /** Prompt above the icon grid (e.g. group name) */
  prompt?: string
}

/** Large emoji/icon cards: „Welches Tier / welche Struktur gehört dazu?“ */
export const IconBelong: React.FC<IconBelongProps> = ({
  options,
  value,
  onChange,
  instruction,
  disabled = false,
  prompt,
}) => (
  <div className="icon-belong">
    {instruction && <p className="icon-belong__instruction">{instruction}</p>}
    {prompt && <p className="icon-belong__prompt">{prompt}</p>}
    <div className="icon-belong__grid" role="group" aria-label="Auswahl mit Symbol">
      {options.map((opt) => {
        const selected = value === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            className={`icon-belong__card${selected ? ' icon-belong__card--selected' : ''}`}
            onClick={() => onChange(opt.id)}
            disabled={disabled}
            aria-pressed={selected}
            aria-label={opt.label}
          >
            <span className="icon-belong__icon" aria-hidden>
              {opt.icon}
            </span>
            <span className="icon-belong__label">{opt.label}</span>
          </button>
        )
      })}
    </div>
  </div>
)
