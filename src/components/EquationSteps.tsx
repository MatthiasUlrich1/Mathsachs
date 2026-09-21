import { useMemo } from 'react'
import {
  applyOps,
  buildTranscript,
  formatOp,
  isSolved,
  opKey,
  parseOpKey,
  solutionX,
  type EqOp,
  type LinEq,
} from '../lib/equationSteps'
import './EquationSteps.css'

export interface EquationStepsProps {
  start: LinEq
  /** Precomputed button ops (useful + distractors). */
  buttons: EqOp[]
  /** Expected solution for x. */
  solution: number
  ops: EqOp[]
  onChange: (ops: EqOp[]) => void
  instruction?: string
  disabled?: boolean
}

/** Multi-line Äquivalenzumformung with operation buttons (school worksheet style). */
export const EquationSteps: React.FC<EquationStepsProps> = ({
  start,
  buttons,
  solution,
  ops,
  onChange,
  instruction,
  disabled = false,
}) => {
  const lines = useMemo(() => buildTranscript(start, ops), [start, ops])
  const current = useMemo(() => applyOps(start, ops), [start, ops])
  const solved = isSolved(current) && solutionX(current) === solution

  const available = useMemo(() => {
    if (solved || disabled) return []
    return buttons
  }, [buttons, solved, disabled])

  const apply = (op: EqOp) => {
    if (disabled || solved) return
    onChange([...ops, op])
  }

  const undo = () => {
    if (disabled || ops.length === 0) return
    onChange(ops.slice(0, -1))
  }

  const reset = () => {
    if (disabled) return
    onChange([])
  }

  return (
    <div className="eq-steps">
      {instruction && <p className="eq-steps__instruction">{instruction}</p>}
      <div className="eq-steps__sheet" aria-label="Umformungsschritte">
        {lines.map((line, i) => (
          <div key={i} className="eq-steps__row">
            <div className="eq-steps__eq">
              {renderEqWithHighlights(line.eq, line.highlights)}
            </div>
            {line.opLabel && <div className="eq-steps__op">{line.opLabel}</div>}
          </div>
        ))}
        {solved && (
          <p className="eq-steps__done" role="status">
            Lösung: x = {solution}
          </p>
        )}
      </div>
      {!disabled && (
        <>
          <p className="eq-steps__hint">
            Tippe eine Umformung — sie gilt für beide Seiten:
          </p>
          <div className="eq-steps__buttons" role="group" aria-label="Umformungen">
            {available.map((op) => (
              <button
                key={opKey(op)}
                type="button"
                className="eq-steps__btn"
                onClick={() => apply(op)}
              >
                {formatOp(op)}
              </button>
            ))}
          </div>
          <div className="eq-steps__tools">
            <button type="button" className="chip-btn" onClick={undo} disabled={ops.length === 0}>
              Schritt zurück
            </button>
            <button type="button" className="chip-btn" onClick={reset} disabled={ops.length === 0}>
              Neu starten
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function renderEqWithHighlights(eq: string, highlights?: string[]) {
  if (!highlights?.length) return eq
  // Split by highlight tokens and wrap matches in <span>
  let parts: Array<string | { hi: string }> = [eq]
  for (const h of highlights) {
    const next: Array<string | { hi: string }> = []
    for (const p of parts) {
      if (typeof p !== 'string') {
        next.push(p)
        continue
      }
      const idx = p.indexOf(h)
      if (idx < 0) {
        next.push(p)
        continue
      }
      if (idx > 0) next.push(p.slice(0, idx))
      next.push({ hi: h })
      // Also highlight other occurrences on the same line (both sides)
      let rest = p.slice(idx + h.length)
      let j = rest.indexOf(h)
      while (j >= 0) {
        if (j > 0) next.push(rest.slice(0, j))
        next.push({ hi: h })
        rest = rest.slice(j + h.length)
        j = rest.indexOf(h)
      }
      if (rest) next.push(rest)
    }
    parts = next
  }
  return (
    <>
      {parts.map((p, i) =>
        typeof p === 'string' ? (
          <span key={i}>{p}</span>
        ) : (
          <span key={i} className="eq-steps__hi">
            {p.hi}
          </span>
        ),
      )}
    </>
  )
}

/** Serialize ops for UserInput / sampleAnswer. */
export function opsToKeys(ops: EqOp[]): string[] {
  return ops.map(opKey)
}

export function keysToOps(keys: string[]): EqOp[] {
  return keys.map(parseOpKey).filter((o): o is EqOp => o !== null)
}
