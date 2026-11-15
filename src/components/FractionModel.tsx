import type { UserInput } from '../curriculum/types'
import {
  FRACTION_BAR_VIEWBOX,
  FRACTION_CIRCLE_VIEWBOX,
  FRACTION_MODEL_MAX_DEN,
  FRACTION_MODEL_MIN_DEN,
  fractionPartShapes,
  normalizeShaded,
  resizeFractionModel,
  toggleShaded,
  type FractionModelShape,
} from '../lib/fractionModelLogic'
import './FractionModel.css'

type FractionModelValue = Extract<UserInput, { kind: 'fractionModel' }>

export interface FractionModelProps {
  shape: FractionModelShape
  value: FractionModelValue
  onChange: (value: UserInput) => void
  instruction?: string
  disabled?: boolean
}

/** Interactive fraction model: set the number of parts and shade parts by tapping. */
export function FractionModel({ shape, value, onChange, instruction, disabled }: FractionModelProps) {
  const vb = shape === 'bar' ? FRACTION_BAR_VIEWBOX : FRACTION_CIRCLE_VIEWBOX
  const den = Math.min(FRACTION_MODEL_MAX_DEN, Math.max(FRACTION_MODEL_MIN_DEN, value.den))
  const shaded = normalizeShaded(den, value.shaded)
  const parts = fractionPartShapes(shape, den)

  const emit = (nextDen: number, nextShaded: number[]) =>
    onChange({ kind: 'fractionModel', den: nextDen, shaded: nextShaded })

  const setDen = (next: number) => {
    if (disabled) return
    const r = resizeFractionModel(shaded, next)
    emit(r.den, r.shaded)
  }

  const toggle = (index: number) => {
    if (disabled) return
    emit(den, toggleShaded(den, shaded, index))
  }

  return (
    <div className="fraction-model">
      {instruction && <p className="fraction-model__instruction">{instruction}</p>}
      <div className="fraction-model__stepper" role="group" aria-label="Anzahl der Teile">
        <button
          type="button"
          className="fraction-model__step"
          aria-label="Ein Teil weniger"
          disabled={disabled || den <= FRACTION_MODEL_MIN_DEN}
          onClick={() => setDen(den - 1)}
        >
          −
        </button>
        <span className="fraction-model__den" data-testid="fraction-den" aria-live="polite">
          {den} Teile
        </span>
        <button
          type="button"
          className="fraction-model__step"
          aria-label="Ein Teil mehr"
          disabled={disabled || den >= FRACTION_MODEL_MAX_DEN}
          onClick={() => setDen(den + 1)}
        >
          +
        </button>
      </div>
      <svg
        className={`fraction-model__svg fraction-model__svg--${shape}`}
        viewBox={`0 0 ${vb.w} ${vb.h}`}
        role="img"
        aria-label={`Bruchmodell mit ${den} Teilen, ${shaded.length} gefärbt`}
      >
        {parts.map((part) => {
          const on = shaded.includes(part.index)
          return (
            <path
              key={part.index}
              d={part.d}
              data-testid="fraction-part"
              data-index={part.index}
              data-shaded={on ? 'true' : 'false'}
              className={`fraction-model__part${on ? ' fraction-model__part--on' : ''}`}
              role="checkbox"
              aria-checked={on}
              aria-label={`Teil ${part.index + 1} von ${den}`}
              tabIndex={disabled ? -1 : 0}
              onPointerDown={(e) => {
                e.preventDefault()
                toggle(part.index)
              }}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault()
                  toggle(part.index)
                }
              }}
            />
          )
        })}
      </svg>
    </div>
  )
}
