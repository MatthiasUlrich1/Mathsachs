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
  instruction?: string
  disabled?: boolean
  placeholder?: string
}

/** Flip card → tip answer (quiz-style flashcard). */
export const FlashcardFlip: React.FC<FlashcardFlipProps> = ({
  front,
  backHint,
  flipped,
  onFlip,
  answer,
  onAnswerChange,
  instruction,
  disabled = false,
  placeholder = 'Antwort tippen…',
}) => (
  <div className="flashcard-flip">
    {instruction && <p className="flashcard-flip__instruction">{instruction}</p>}
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
  </div>
)
