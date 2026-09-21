import type { UserInput } from '../curriculum/types'
import type { ResolvedExamTask } from '../exam/examCode'

export interface ExamTaskResult {
  resolved: ResolvedExamTask
  answer: UserInput
  correct: boolean
  earned: number
}

/** Render a learner's answer for the evaluation / protocol table. */
export const formatExamAnswer = (input: UserInput): string => {
  if (input.kind === 'fraction') {
    const num = input.num.trim()
    const den = input.den.trim()
    return num || den ? `${num || '?'}/${den || '?'}` : '—'
  }
  if (input.kind === 'numberLine') {
    return input.value.toString()
  }
  if (input.kind === 'dragDropSort') {
    return input.order.join(', ')
  }
  if (input.kind === 'dragDropSlots') {
    return input.slots.map((s) => (s === null ? '—' : String(s))).join(' | ')
  }
  if (input.kind === 'digitGrid') {
    if (input.answerRows && input.answerRows.length > 0) {
      const parts = input.answerRows
        .map((row) => row.join('').replace(/\D/g, ''))
        .filter(Boolean)
      return parts.length ? parts.join(' | ') : '—'
    }
    const joined = input.digits.join('').replace(/\D/g, '')
    return joined || '—'
  }
  if (input.kind === 'choicePick') {
    return input.choice.trim() || '—'
  }
  if (input.kind === 'multiSelect') {
    return input.selected.length ? input.selected.join(', ') : '—'
  }
  if (input.kind === 'coordinateClick') {
    if (!Number.isFinite(input.x) || !Number.isFinite(input.y)) return '—'
    return `(${input.x}|${input.y})`
  }
  if (input.kind === 'coordinateDraw') {
    const n = input.scene.objects.length
    return n ? `${n} Objekt${n === 1 ? '' : 'e'}` : '—'
  }
  if (input.kind === 'paramSlider') {
    const parts = Object.entries(input.values).map(([k, v]) => `${k}=${v}`)
    return parts.length ? parts.join(', ') : '—'
  }
  return input.value.trim() || '—'
}

interface Props {
  user: string
  title: string
  results: ExamTaskResult[]
  totalPoints: number
  printedAt: string
}

/**
 * Printable Klausur evaluation (points + per-task outcome).
 * Shown only when printing — see `.exam-protocol-print` in App.css.
 */
export function ExamProtocolSheet({
  user,
  title,
  results,
  totalPoints,
  printedAt,
}: Props) {
  const earned = results.reduce((s, r) => s + r.earned, 0)
  const correctCount = results.filter((r) => r.correct).length
  const pct = totalPoints > 0 ? Math.round((earned / totalPoints) * 100) : 0

  return (
    <article className="sheet exam-protocol-print" aria-label="Klausurprotokoll">
      <header className="sheet__head">
        <h1>TaskTrophy — Klausurprotokoll</h1>
        <p>
          Schüler/in: <strong>{user}</strong> · Klausur: <strong>{title}</strong> ·
          erstellt am {printedAt}
        </p>
      </header>

      <div className="protocol-summary">
        <div className="protocol-summary__item">
          <span className="big">
            {earned}/{totalPoints}
          </span>
          <span className="muted small">Punkte</span>
        </div>
        <div className="protocol-summary__item">
          <span className="big">{pct}%</span>
          <span className="muted small">Erreicht</span>
        </div>
        <div className="protocol-summary__item">
          <span className="big">
            {correctCount}/{results.length}
          </span>
          <span className="muted small">richtige Aufgaben</span>
        </div>
      </div>

      <section className="protocol-area">
        <h3>Auswertung je Aufgabe</h3>
        <table className="protocol-table">
          <thead>
            <tr>
              <th>Nr.</th>
              <th>Thema</th>
              <th>Aufgabe</th>
              <th>Antwort</th>
              <th>Ergebnis</th>
              <th>Punkte</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{r.resolved.topicTitle || '—'}</td>
                <td>{r.resolved.task.question}</td>
                <td>
                  {formatExamAnswer(r.answer)}
                  {r.resolved.task.unit ? ` ${r.resolved.task.unit}` : ''}
                  {!r.correct
                    ? ` (richtig: ${r.resolved.task.solution}${
                        r.resolved.task.unit ? ` ${r.resolved.task.unit}` : ''
                      })`
                    : ''}
                </td>
                <td>{r.correct ? 'richtig' : 'falsch'}</td>
                <td>
                  {r.earned}/{r.resolved.punkte}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </article>
  )
}
