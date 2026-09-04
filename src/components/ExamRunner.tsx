import { useEffect, useMemo, useState } from 'react'
import { emptyInput, type UserInput } from '../curriculum/types'
import { recordSession } from '../lib/storage'
import { AnswerInput } from './AnswerInput'
import {
  ExamCodeError,
  decodeExam,
  resolveExam,
  type ResolvedExamTask,
} from '../exam/examCode'
import type { ExamSpec } from '../exam/types'

interface Props {
  user: string
  /** Optional code pre-filled from a shared link (`#klausur=…`). */
  initialCode?: string
  onExit: () => void
  /** Open a fresh practice round for a topic ("Ähnliche Aufgabe üben"). */
  onPracticeTopic: (moduleId: string, topicId: string) => void
}

type Phase = 'input' | 'ready' | 'loading' | 'running' | 'done'

interface TaskResult {
  resolved: ResolvedExamTask
  answer: UserInput
  correct: boolean
  earned: number
}

/** Render a learner's answer for the evaluation screen. */
const formatInput = (input: UserInput): string => {
  if (input.kind === 'fraction') {
    const num = input.num.trim()
    const den = input.den.trim()
    return num || den ? `${num || '?'}/${den || '?'}` : '—'
  }
  return input.value.trim() || '—'
}

export function ExamRunner({ user, initialCode, onExit, onPracticeTopic }: Props) {
  const [phase, setPhase] = useState<Phase>(initialCode ? 'ready' : 'input')
  const [codeText, setCodeText] = useState(initialCode ?? '')
  const [error, setError] = useState<string | null>(null)
  const [spec, setSpec] = useState<ExamSpec | null>(null)

  const [resolved, setResolved] = useState<ResolvedExamTask[]>([])
  const [answers, setAnswers] = useState<UserInput[]>([])
  const [current, setCurrent] = useState(0)
  const [results, setResults] = useState<TaskResult[]>([])

  // Auto-decode a code handed in via a shared link.
  useEffect(() => {
    if (!initialCode) return
    try {
      setSpec(decodeExam(initialCode))
      setError(null)
    } catch (e) {
      setError(e instanceof ExamCodeError ? e.message : 'Der Code ist ungültig.')
      setPhase('input')
    }
  }, [initialCode])

  const decode = () => {
    try {
      const decoded = decodeExam(codeText)
      setSpec(decoded)
      setError(null)
      setPhase('ready')
    } catch (e) {
      setSpec(null)
      setError(e instanceof ExamCodeError ? e.message : 'Der Code ist ungültig.')
    }
  }

  const start = async () => {
    if (!spec) return
    setPhase('loading')
    setError(null)
    try {
      const tasks = await resolveExam(spec)
      setResolved(tasks)
      setAnswers(tasks.map((t) => emptyInput(t.task.answerKind)))
      setCurrent(0)
      setPhase('running')
    } catch (e) {
      setError(
        e instanceof ExamCodeError
          ? e.message
          : 'Die Klausur konnte nicht geladen werden.',
      )
      setPhase('ready')
    }
  }

  const totalPoints = useMemo(
    () => (spec ? spec.aufgaben.reduce((s, a) => s + a.punkte, 0) : 0),
    [spec],
  )

  const setAnswer = (input: UserInput) =>
    setAnswers((prev) => prev.map((a, i) => (i === current ? input : a)))

  const submit = () => {
    const computed: TaskResult[] = resolved.map((r, i) => {
      const answer = answers[i] ?? emptyInput(r.task.answerKind)
      const correct = r.task.check(answer)
      return { resolved: r, answer, correct, earned: correct ? r.punkte : 0 }
    })
    setResults(computed)
    persist(computed)
    setPhase('done')
  }

  // Aggregate per topic and store into the points protocol, consistent with
  // PracticeSession's use of recordSession.
  const persist = (computed: TaskResult[]) => {
    const byTopic = new Map<
      string,
      { topicTitle: string; areaTitle: string; attempts: number; correct: number; points: number }
    >()
    for (const r of computed) {
      const id = r.resolved.topicId
      const agg = byTopic.get(id) ?? {
        topicTitle: r.resolved.topicTitle,
        areaTitle: r.resolved.areaTitle || 'Übungsklausur',
        attempts: 0,
        correct: 0,
        points: 0,
      }
      agg.attempts += 1
      agg.correct += r.correct ? 1 : 0
      agg.points += r.earned
      byTopic.set(id, agg)
    }
    for (const [topicId, agg] of byTopic) {
      recordSession(user, { topicId, ...agg })
    }
  }

  // ---- Render ----

  if (phase === 'input') {
    return (
      <section className="card">
        <div className="session__head">
          <div>
            <h2 className="section-title no-margin">Klausur schreiben</h2>
            <p className="muted small">
              Füge den Klausurcode ein oder öffne einen geteilten Link.
            </p>
          </div>
          <button type="button" className="link" onClick={onExit}>
            Zurück
          </button>
        </div>
        {error && <p className="notice notice--error">{error}</p>}
        <div className="field">
          <span className="field__label">Klausurcode (beginnt mit „MSX1:“)</span>
          <textarea
            className="exam-code__field"
            rows={3}
            placeholder="MSX1:…"
            value={codeText}
            onChange={(e) => setCodeText(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="primary"
          disabled={codeText.trim().length === 0}
          onClick={decode}
        >
          Klausur laden
        </button>
      </section>
    )
  }

  if (phase === 'ready' || phase === 'loading') {
    return (
      <section className="card">
        <div className="session__head">
          <div>
            <h2 className="section-title no-margin">{spec?.titel}</h2>
            <p className="muted small">Bereit zum Start</p>
          </div>
          <button type="button" className="link" onClick={onExit}>
            Abbrechen
          </button>
        </div>
        {error && <p className="notice notice--error">{error}</p>}
        <div className="exam-summary">
          <div className="exam-summary__item">
            <span className="big">{spec?.aufgaben.length ?? 0}</span>
            <span className="muted small">Aufgaben</span>
          </div>
          <div className="exam-summary__item">
            <span className="big">{totalPoints}</span>
            <span className="muted small">Punkte gesamt</span>
          </div>
        </div>
        <p className="muted small">
          Du schreibst als <strong>{user}</strong>. Das Ergebnis wird in deinem
          Punkteprotokoll gespeichert.
        </p>
        {phase === 'loading' ? (
          <p className="muted">Aufgaben werden geladen …</p>
        ) : (
          <button type="button" className="primary" onClick={start}>
            Klausur starten
          </button>
        )}
      </section>
    )
  }

  if (phase === 'running') {
    const r = resolved[current]
    const task = r.task
    const isLast = current === resolved.length - 1
    return (
      <section className="card session">
        <div className="session__head">
          <div>
            <h2 className="section-title no-margin">{spec?.titel}</h2>
            <p className="muted small">
              {task.answerKind !== 'text' && r.topicTitle
                ? r.topicTitle
                : 'Aufgabe'}
            </p>
          </div>
          <span className="muted small">{r.punkte} P.</span>
        </div>
        <div className="session__meta">
          <span>
            Aufgabe {current + 1} von {resolved.length}
          </span>
          <span>Punkte gesamt: {totalPoints}</span>
        </div>
        <div className="progress">
          <div
            className="progress__fill"
            style={{ width: `${(current / resolved.length) * 100}%` }}
          />
        </div>

        <div className="prompt">{task.question}</div>

        <AnswerInput
          answerKind={task.answerKind}
          unit={task.unit}
          value={answers[current] ?? emptyInput(task.answerKind)}
          onChange={setAnswer}
          onSubmit={() => (isLast ? undefined : setCurrent((c) => c + 1))}
        />

        <div className="exam-nav">
          {current > 0 && (
            <button
              type="button"
              className="ghost"
              onClick={() => setCurrent((c) => c - 1)}
            >
              Zurück
            </button>
          )}
          {!isLast ? (
            <button
              type="button"
              className="primary"
              onClick={() => setCurrent((c) => c + 1)}
            >
              Nächste Aufgabe
            </button>
          ) : (
            <button type="button" className="primary" onClick={submit}>
              Klausur abgeben
            </button>
          )}
        </div>
      </section>
    )
  }

  // phase === 'done'
  const earned = results.reduce((s, r) => s + r.earned, 0)
  const correctCount = results.filter((r) => r.correct).length
  const pct = totalPoints > 0 ? Math.round((earned / totalPoints) * 100) : 0
  return (
    <section className="card">
      <div className="session__head">
        <div>
          <h2 className="section-title no-margin">Auswertung: {spec?.titel}</h2>
          <p className="muted small">
            Ergebnis für <strong>{user}</strong> — im Punkteprotokoll gespeichert.
          </p>
        </div>
        <button type="button" className="link" onClick={onExit}>
          Fertig
        </button>
      </div>

      <div className="results">
        <div className="result">
          <span className="result__value">
            {earned}/{totalPoints}
          </span>
          <span className="result__label">Punkte</span>
        </div>
        <div className="result">
          <span className="result__value">{pct}%</span>
          <span className="result__label">Erreicht</span>
        </div>
        <div className="result">
          <span className="result__value">
            {correctCount}/{results.length}
          </span>
          <span className="result__label">Richtig</span>
        </div>
      </div>

      <ol className="exam-review">
        {results.map((r, i) => (
          <li
            key={i}
            className={`exam-review__item ${
              r.correct ? 'exam-review__item--ok' : 'exam-review__item--bad'
            }`}
          >
            <div className="exam-review__head">
              <span className="exam-review__q">{r.resolved.task.question}</span>
              <span className="exam-review__badge">
                {r.correct ? `+${r.earned}` : '0'} / {r.resolved.punkte} P.
              </span>
            </div>
            <p className="exam-review__line">
              Deine Antwort: <strong>{formatInput(r.answer)}</strong>
              {r.resolved.task.unit ? ` ${r.resolved.task.unit}` : ''}
              {r.correct ? ' ✓' : ' ✗'}
            </p>
            {!r.correct && (
              <p className="exam-review__line">
                Richtige Lösung:{' '}
                <span className="solution">{r.resolved.task.solution}</span>
                {r.resolved.task.unit ? ` ${r.resolved.task.unit}` : ''}
              </p>
            )}
            <p className="explanation">{r.resolved.task.explanation}</p>
            <button
              type="button"
              className="ghost"
              onClick={() =>
                onPracticeTopic(r.resolved.moduleId, r.resolved.topicId)
              }
            >
              Ähnliche Aufgabe üben
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}
