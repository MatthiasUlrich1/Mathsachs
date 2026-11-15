import type { Task, UserInput } from '../curriculum/types'
import type { ResolvedExamTask } from '../exam/examCode'
import { treePathLabel, type TreeLevel } from '../lib/treeDiagramLogic'

export interface ExamTaskResult {
  resolved: ResolvedExamTask
  answer: UserInput
  correct: boolean
  earned: number
}

/** Display text of a number-line label (falls back to the id when the task is not known). */
const numberLineMultiLabel = (task: Task | undefined, id: string): string => {
  const items = task?.interactive?.type === 'numberLineMulti' ? (task.interactive.props.items as Array<{ id: string; label: string }> | undefined) : undefined
  return items?.find((i) => i.id === id)?.label ?? id
}

/** Render a learner's answer for the evaluation / protocol table. */
export const formatExamAnswer = (input: UserInput, task?: Task): string => {
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
    const slots = input.slots.map((s) => (s === null ? '—' : String(s))).join(' | ')
    return input.result != null && input.result.trim()
      ? `${slots} → ${input.result.trim()}`
      : slots
  }
  if (input.kind === 'imageLabelSlots') {
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
    if (input.points && input.points.length > 0) {
      return input.points.map((p) => `(${p.x}|${p.y})`).join(', ')
    }
    if (!Number.isFinite(input.x) || !Number.isFinite(input.y)) return '—'
    return `(${input.x}|${input.y})`
  }
  if (input.kind === 'coordinateDraw' || input.kind === 'constructionSteps') {
    const n = input.scene.objects.filter((o) => !(o.kind === 'point' && o.fixed)).length
    return n ? `${n} Objekt${n === 1 ? '' : 'e'}` : '—'
  }
  if (input.kind === 'paramSlider') {
    const parts = Object.entries(input.values).map(([k, v]) => `${k}=${v}`)
    return parts.length ? parts.join(', ') : '—'
  }
  if (input.kind === 'angleProtractor') {
    return input.touched && input.degrees !== null ? `${input.degrees}°` : '—'
  }
  if (input.kind === 'rulerMeasure') {
    return input.touched && input.length !== null ? `${String(input.length).replace('.', ',')} cm` : '—'
  }
  if (input.kind === 'fractionModel') {
    return input.shaded.length > 0 ? `${input.shaded.length}/${input.den}` : '—'
  }
  if (input.kind === 'fractionWall') {
    return input.selected.length > 0 ? input.selected.map((s) => `${s.count}/${s.row}`).join(', ') : '—'
  }
  if (input.kind === 'divideTool') {
    const given = input.assignment.filter((v) => v !== null).length
    return given > 0 ? `${input.partsPerWhole} Teile pro Ganzes, ${given} von ${input.assignment.length} Teilen verteilt` : '—'
  }
  if (input.kind === 'ratioBar') {
    const [aText, bText] = input.amounts ?? ['', '']
    if (aText.trim() || bText.trim()) return `A: ${aText.trim() || '—'}, B: ${bText.trim() || '—'}`
    const a = input.parts.filter((v) => v === 'A').length
    const b = input.parts.filter((v) => v === 'B').length
    return a + b > 0 ? `Felder A: ${a}, Felder B: ${b}` : '—'
  }
  if (input.kind === 'numberLineMulti') {
    const placed = Object.entries(input.positions ?? {})
    return placed.length ? placed.map(([id, p]) => `${numberLineMultiLabel(task, id)}: ${String(p).replace('.', ',')}`).join('; ') : '—'
  }
  if (input.kind === 'treeDiagram') {
    const levels = task?.interactive?.type === 'treeDiagram' ? (task.interactive.props.levels as TreeLevel[] | undefined) : undefined
    const name = (id: string) => (levels ? treePathLabel(levels, id) : id)
    const rows = [
      ...Object.entries(input.branches ?? {}).filter(([, v]) => v.trim()).map(([id, v]) => `Zweig ${name(id)}: ${v.trim()}`),
      ...Object.entries(input.leaves ?? {}).filter(([, v]) => v.trim()).map(([id, v]) => `Pfad ${name(id)}: ${v.trim()}`),
    ]
    return rows.length ? rows.join('; ') : '—'
  }
  if (input.kind === 'equationSteps') {
    return input.ops.length ? input.ops.join(' → ') : '—'
  }
  if (input.kind === 'pairMatch') {
    const parts = Object.entries(input.links)
      .filter(([, r]) => r)
      .map(([l, r]) => `${l}→${r}`)
    return parts.length ? parts.join('; ') : '—'
  }
  if (input.kind === 'clozeMulti') {
    return input.blanks.some((b) => b.trim())
      ? input.blanks.map((b) => b.trim() || '…').join(' | ')
      : '—'
  }
  if (input.kind === 'iconBelong') {
    return input.choice.trim() || '—'
  }
  if (input.kind === 'flashcardFlip') {
    if (!input.flipped) return '(nicht umgedreht)'
    return input.answer.trim() || '—'
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
                  {formatExamAnswer(r.answer, r.resolved.task)}
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
