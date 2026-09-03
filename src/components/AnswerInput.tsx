import { useEffect, useRef } from 'react'
import type { AnswerKind, UserInput } from '../curriculum/types'

interface Props {
  answerKind: AnswerKind
  unit?: string
  value: UserInput
  onChange: (next: UserInput) => void
  onSubmit: () => void
  disabled?: boolean
}

export function AnswerInput({
  answerKind,
  unit,
  value,
  onChange,
  onSubmit,
  disabled,
}: Props) {
  const firstRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!disabled) firstRef.current?.focus()
  }, [disabled, answerKind, value])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSubmit()
    }
  }

  if (answerKind === 'fraction') {
    const frac = value.kind === 'fraction' ? value : { num: '', den: '' }
    return (
      <div className="answer-input answer-input--fraction">
        <div className="frac">
          <input
            ref={firstRef}
            className="frac__field"
            type="text"
            inputMode="numeric"
            aria-label="Zähler"
            placeholder="Zähler"
            value={frac.num}
            disabled={disabled}
            onKeyDown={handleKey}
            onChange={(e) =>
              onChange({ kind: 'fraction', num: e.target.value, den: frac.den })
            }
          />
          <span className="frac__bar" />
          <input
            className="frac__field"
            type="text"
            inputMode="numeric"
            aria-label="Nenner"
            placeholder="Nenner"
            value={frac.den}
            disabled={disabled}
            onKeyDown={handleKey}
            onChange={(e) =>
              onChange({ kind: 'fraction', num: frac.num, den: e.target.value })
            }
          />
        </div>
      </div>
    )
  }

  const val = value.kind === 'value' ? value.value : ''
  const isText = answerKind === 'text'
  return (
    <div className="answer-input">
      <input
        ref={firstRef}
        className="answer-input__field"
        type="text"
        inputMode={isText ? 'text' : 'decimal'}
        aria-label="Antwort"
        placeholder={isText ? '<, > oder =' : 'Deine Antwort'}
        value={val}
        disabled={disabled}
        onKeyDown={handleKey}
        onChange={(e) => onChange({ kind: 'value', value: e.target.value })}
      />
      {unit && <span className="answer-input__unit">{unit}</span>}
    </div>
  )
}
