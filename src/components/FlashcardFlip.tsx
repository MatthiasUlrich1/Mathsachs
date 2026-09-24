import React from 'react'
import './FlashcardFlip.css'

export interface FlashcardFlipProps {
  front: string
  /** Hint shown on the back before answering (optional) */
  backHint?: string
  flipped: boolean
  onFlip: () => void
  answer: string
  onAnswerChange: (value: string) => void
  /** Optional multiple-choice options shown after flip (preferred over free text). */
  choices?: string[]
  /**
   * Optional extra instruction. Prefer omitting — the numbered steps list
   * already explains the flow; do not pass a duplicate of those steps.
   */
  instruction?: string
  disabled?: boolean
  placeholder?: string
  /** Optional short UI hint under the answer (not Fachwissen). Prefer omitting. */
  checkHint?: string
}

const DEFAULT_STEPS = [
  'Vorderseite lesen',
  'Karte umdrehen',
  'Antwort wählen oder tippen',
] as const

/** True when `instruction` only restates the default step list (skip rendering). */
export function isRedundantFlashcardInstruction(instruction: string | undefined): boolean {
  if (!instruction?.trim()) return true
  const n = instruction
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[)）.：:]/g, '')
  return (
    n.includes('vorderseite') &&
    n.includes('umdrehen') &&
    (n.includes('antwort tippen') || n.includes('antwort wählen'))
  )
}

/** Flip card → choose or tip answer (quiz-style flashcard). */
export const FlashcardFlip: React.FC<FlashcardFlipProps> = ({
  front,
  backHint,
  flipped,
  onFlip,
  answer,
  onAnswerChange,
  choices,
  instruction,
  disabled = false,
  placeholder = 'Antwort tippen…',
  checkHint,
}) => {
  const hasChoices = Boolean(choices && choices.length > 0)
  const showInstruction =
    Boolean(instruction?.trim()) && !isRedundantFlashcardInstruction(instruction)

  return (
    <div className="flashcard-flip">
      <ol className="flashcard-flip__steps" aria-label="Ablauf">
        {DEFAULT_STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      {showInstruction && <p className="flashcard-flip__instruction">{instruction}</p>}
      {!flipped && !disabled && (
        <p className="flashcard-flip__hint">
          {hasChoices
            ? 'Nach dem Umdrehen erscheinen Antwort-Optionen.'
            : 'Nach dem Umdrehen erscheint ein Eingabefeld.'}
        </p>
      )}
      <button
        type="button"
        className={`flashcard-flip__card${flipped ? ' flashcard-flip__card--flipped' : ''}`}
        onClick={() => {
          if (!disabled && !flipped) onFlip()
        }}
        disabled={disabled || flipped}
        aria-label={flipped ? 'Karte umgedreht' : 'Karte umdrehen'}
      >
        <span className="flashcard-flip__face">
          {flipped ? (backHint ?? 'Was passt dazu?') : front}
        </span>
        {!flipped && !disabled && (
          <span className="flashcard-flip__tap">Tippen zum Umdrehen</span>
        )}
      </button>
      {flipped && (
        <div className="flashcard-flip__answer-area">
          <p className="flashcard-flip__answer-label">
            {hasChoices ? 'Antwort wählen:' : 'Antwort tippen:'}
          </p>
          {hasChoices ? (
            <div
              className="flashcard-flip__choices"
              role="group"
              aria-label="Antwort wählen"
            >
              {choices!.map((c) => {
                const selected = answer === c
                return (
                  <button
                    key={c}
                    type="button"
                    className={`flashcard-flip__choice${selected ? ' flashcard-flip__choice--selected' : ''}`}
                    onClick={() => onAnswerChange(c)}
                    disabled={disabled}
                    aria-pressed={selected}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
          ) : (
            <input
              className="flashcard-flip__input"
              type="text"
              value={answer}
              onChange={(e) => onAnswerChange(e.target.value)}
              disabled={disabled}
              placeholder={placeholder}
              aria-label="Antwort nach dem Umdrehen"
              autoComplete="off"
              spellCheck={false}
            />
          )}
          {checkHint?.trim() ? (
            <p className="flashcard-flip__check-hint">{checkHint}</p>
          ) : null}
        </div>
      )}
    </div>
  )
}
