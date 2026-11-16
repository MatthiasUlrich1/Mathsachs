import { useState } from 'react'
import type { UserInput } from '../curriculum/types'
import {
  advanceConstructionStep,
  type ConstructionStep,
} from '../curriculum/measureTaskHelpers'
import { ensureSvgViewBox } from '../lib/ensureSvgViewBox'
import { CoordinateGraphEditor, type EditorTool } from './CoordinateGraphEditor'
import './ConstructionSteps.css'

type ConstructionValue = Extract<UserInput, { kind: 'constructionSteps' }>

export interface ConstructionStepsProps {
  /** Sketch with the given measurements, not to scale. */
  planFigureSvg: string
  steps: ConstructionStep[]
  value: ConstructionValue
  onChange: (value: UserInput) => void
  /** Exam / worksheet: all steps listed at once, no step check. */
  allAtOnce?: boolean
  disabled?: boolean
}

/** Tools of every step, in one list (all-at-once mode). */
const unionTools = (steps: ConstructionStep[]): EditorTool[] =>
  Array.from(new Set(steps.flatMap((s) => s.allowedTools)))

/**
 * Guided construction: Planfigur on top, then "Schritt n von N" with its own task above the
 * canvas. "Schritt prüfen" unlocks the next step only when the current one is correct; the
 * drawing so far stays. In all-at-once mode (exam) every step is listed and the editor offers
 * the tools of all steps.
 */
export function ConstructionSteps({
  planFigureSvg,
  steps,
  value,
  onChange,
  allAtOnce = false,
  disabled = false,
}: ConstructionStepsProps) {
  const [feedback, setFeedback] = useState<'ok' | 'retry' | null>(null)
  const total = steps.length
  const stepIndex = Math.min(Math.max(value.stepIndex, 0), total)
  const done = stepIndex >= total
  const current = steps[stepIndex]

  const checkStep = () => {
    const next = advanceConstructionStep(steps, value.scene, stepIndex)
    setFeedback(next > stepIndex ? 'ok' : 'retry')
    if (next > stepIndex) onChange({ ...value, stepIndex: next })
  }

  return (
    <div className="construction-steps">
      <figure className="construction-steps__plan">
        <div
          className="construction-steps__plan-svg heft-scope"
          dangerouslySetInnerHTML={{ __html: ensureSvgViewBox(planFigureSvg) }}
        />
        <figcaption>Planfigur (nicht maßstabsgetreu)</figcaption>
      </figure>

      {allAtOnce ? (
        <ol className="construction-steps__list" data-testid="step-list">
          {steps.map((s, i) => (
            <li key={i}>{s.instruction}</li>
          ))}
        </ol>
      ) : (
        <div className="construction-steps__current" aria-live="polite">
          <p className="construction-steps__indicator" data-testid="step-indicator">
            {done ? `Alle ${total} Schritte geschafft` : `Schritt ${stepIndex + 1} von ${total}`}
          </p>
          {current && !done && <p className="construction-steps__instruction">{current.instruction}</p>}
        </div>
      )}

      {/* Remount per step: the tool list changes and undo must not reach into earlier steps. */}
      <CoordinateGraphEditor
        key={allAtOnce ? 'all' : stepIndex}
        scene={value.scene}
        onChange={(scene) => {
          setFeedback(null)
          onChange({ ...value, scene, stepIndex })
        }}
        allowedTools={allAtOnce || done ? unionTools(steps) : current?.allowedTools}
        disabled={disabled}
      />

      {!allAtOnce && !done && !disabled && (
        <div className="construction-steps__actions">
          <button type="button" className="construction-steps__check" onClick={checkStep}>
            Schritt prüfen
          </button>
          {feedback === 'retry' && (
            <span className="construction-steps__feedback is-retry" role="status">
              Noch nicht ganz. Lies die Aufgabe noch einmal und probiere es erneut.
            </span>
          )}
        </div>
      )}
      {!allAtOnce && feedback === 'ok' && (
        <p className="construction-steps__feedback is-ok" role="status">
          {done ? 'Richtig! Die Konstruktion ist fertig.' : 'Richtig! Weiter mit dem nächsten Schritt.'}
        </p>
      )}
    </div>
  )
}
