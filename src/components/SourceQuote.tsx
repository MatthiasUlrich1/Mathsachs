import './SourceQuote.css'
import { ChoicePick } from './ChoicePick'

export interface SourceQuoteProps {
  /** Short label, e.g. "Primärquelle" or "Auszug". */
  sourceLabel?: string
  /** Optional kind chip, e.g. "Primärquelle", "Karikatur", "Gesetzestext". */
  sourceKind?: string
  /** The excerpt / quote shown to the learner. */
  sourceText: string
  /** Optional attribution under the quote (not the answer). */
  attribution?: string
  choices: string[]
  value: string | null
  onChange: (choice: string) => void
  instruction?: string
  disabled?: boolean
}

/**
 * Reusable source/excerpt card + multiple choice.
 * Designed for Geschichte Quellenarbeit; also usable in Deutsch, Bio, etc.
 */
export function SourceQuote({
  sourceLabel = 'Quelle',
  sourceKind,
  sourceText,
  attribution,
  choices,
  value,
  onChange,
  instruction,
  disabled = false,
}: SourceQuoteProps) {
  return (
    <div className="source-quote">
      {instruction && <p className="source-quote__instruction">{instruction}</p>}
      <figure className="source-quote__card" aria-label={sourceLabel}>
        <div className="source-quote__meta">
          <span className="source-quote__label">{sourceLabel}</span>
          {sourceKind ? <span className="source-quote__kind">{sourceKind}</span> : null}
        </div>
        <blockquote className="source-quote__text">{sourceText}</blockquote>
        {attribution ? (
          <figcaption className="source-quote__attr">{attribution}</figcaption>
        ) : null}
      </figure>
      <ChoicePick
        choices={choices}
        value={value}
        onChange={onChange}
        instruction="Wähle die passende Deutung:"
        disabled={disabled}
      />
    </div>
  )
}
