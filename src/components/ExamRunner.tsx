import { useEffect, useMemo, useRef, useState } from 'react'
import { emptyInput, type UserInput } from '../curriculum/types'
import {
  getClassCodeSettings,
  getCompletedClassExamIds,
  markClassExamCompleted,
  recordSession,
} from '../lib/storage'
import {
  getClass,
  completeClassExam,
  completeClassExamByCode,
  type ClassExamSummary,
} from '../classCode/api'
import { topicContentId } from '../curriculum/contentId'
import { AnswerInput } from './AnswerInput'
import { ExamProtocolSheet, formatExamAnswer } from './ExamProtocolSheet'
import { ReportFaultyTask } from './ReportFaultyTask'
import { initTaskInput, TaskInteractive, TaskVisual } from './TaskMedia'
import {
  printExamProtocol,
  saveExamProtocolPdf,
  type ExamProtocolExportInput,
} from '../exam/examProtocolExport'
import { examTaskEarned } from '../exam/examAnswerAttempted'
import {
  ExamCodeError,
  decodeExam,
  examCurriculumGate,
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

const normalizeExamCodeKey = (raw: string): string => raw.trim().replace(/\s+/g, '')

export function ExamRunner({ user, initialCode, onExit, onPracticeTopic }: Props) {
  const [phase, setPhase] = useState<Phase>(initialCode ? 'ready' : 'input')
  const [codeText, setCodeText] = useState(initialCode ?? '')
  const [error, setError] = useState<string | null>(null)
  const [spec, setSpec] = useState<ExamSpec | null>(null)

  const [resolved, setResolved] = useState<ResolvedExamTask[]>([])
  const [answers, setAnswers] = useState<UserInput[]>([])
  const answersRef = useRef<UserInput[]>([])
  const resolvedRef = useRef<ResolvedExamTask[]>([])
  const [current, setCurrent] = useState(0)
  /** Points locked when leaving a task (index → earned). */
  const [lockedEarned, setLockedEarned] = useState<Record<number, number>>({})
  const [results, setResults] = useState<TaskResult[]>([])
  const [completeNotice, setCompleteNotice] = useState<string | null>(null)

  const [pdfBusy, setPdfBusy] = useState(false)
  const [pdfNotice, setPdfNotice] = useState<string | null>(null)
  const [classExams, setClassExams] = useState<ClassExamSummary[]>([])
  const [completedIds, setCompletedIds] = useState(() => new Set(getCompletedClassExamIds()))
  const [activeClassExamId, setActiveClassExamId] = useState<string | null>(null)

  answersRef.current = answers
  resolvedRef.current = resolved

  const matchClassExamId = (examCode: string): string | null => {
    const trimmed = normalizeExamCodeKey(examCode)
    if (!trimmed) return null
    return (
      classExams.find((exam) => normalizeExamCodeKey(exam.examCode) === trimmed)?.id ?? null
    )
  }

  useEffect(() => {
    if (phase !== 'done') return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [phase])

  useEffect(() => {
    const code = getClassCodeSettings().activeCode
    if (!code) {
      setClassExams([])
      return
    }
    let cancelled = false
    void getClass(code)
      .then((stats) => {
        if (!cancelled) setClassExams(stats.exams ?? [])
      })
      .catch(() => {
        if (!cancelled) setClassExams([])
      })
    return () => {
      cancelled = true
    }
  }, [user, phase])

  // Bind pasted / shared MSX1 codes to the Klassenklausur so complete increments solveCount.
  useEffect(() => {
    if (activeClassExamId) return
    const code = codeText.trim() || initialCode?.trim() || ''
    const matched = matchClassExamId(code)
    if (matched) setActiveClassExamId(matched)
  }, [classExams, codeText, initialCode, activeClassExamId])

  // Auto-decode a code handed in via a shared link.
  useEffect(() => {
    if (!initialCode) return
    try {
      setSpec(decodeExam(initialCode))
      setCodeText(initialCode)
      setError(null)
      const matched = matchClassExamId(initialCode)
      if (matched) setActiveClassExamId(matched)
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
      setActiveClassExamId(matchClassExamId(codeText))
      setPhase('ready')
    } catch (e) {
      setSpec(null)
      setError(e instanceof ExamCodeError ? e.message : 'Der Code ist ungültig.')
    }
  }

  const startClassExam = (exam: ClassExamSummary) => {
    try {
      const decoded = decodeExam(exam.examCode)
      setSpec(decoded)
      setCodeText(exam.examCode)
      setError(null)
      setActiveClassExamId(exam.id)
      setPhase('ready')
    } catch (e) {
      setError(e instanceof ExamCodeError ? e.message : 'Die Klassenklausur ist ungültig.')
    }
  }

  const start = async () => {
    if (!spec) return
    const blocked = examCurriculumGate(spec)
    if (blocked) {
      setError(blocked)
      setPhase('ready')
      return
    }
    setPhase('loading')
    setError(null)
    try {
      const tasks = await resolveExam(spec)
      const initialAnswers = tasks.map((t) => initTaskInput(t.task))
      setResolved(tasks)
      resolvedRef.current = tasks
      setAnswers(initialAnswers)
      answersRef.current = initialAnswers
      setLockedEarned({})
      setResults([])
      setCompleteNotice(null)
      setCurrent(0)
      setPhase('running')
      // Resolve Klassenklausur-ID early so Abgabe can update the Lehrer-Zähler.
      const examCode = codeText.trim() || initialCode?.trim() || ''
      const classCode = getClassCodeSettings().activeCode
      if (!activeClassExamId && classCode && examCode) {
        void getClass(classCode)
          .then((stats) => {
            setClassExams(stats.exams ?? [])
            const id =
              stats.exams?.find(
                (exam) => normalizeExamCodeKey(exam.examCode) === normalizeExamCodeKey(examCode),
              )?.id ?? null
            if (id) setActiveClassExamId(id)
          })
          .catch(() => {
            /* offline */
          })
      }
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

  const scoreTask = (index: number, answerList: UserInput[], rows: ResolvedExamTask[]) => {
    const row = rows[index]
    if (!row) return { answer: emptyInput('text'), correct: false, earned: 0 }
    const answer = answerList[index] ?? initTaskInput(row.task)
    const earned = examTaskEarned(row.task, answer, row.punkte, { requireAttempt: false })
    return { answer, correct: earned > 0, earned }
  }

  const lockTaskEarned = (index: number, answerList: UserInput[] = answersRef.current) => {
    const scored = scoreTask(index, answerList, resolvedRef.current)
    setLockedEarned((prev) => ({ ...prev, [index]: scored.earned }))
  }

  const liveEarned = useMemo(() => {
    let sum = 0
    for (let i = 0; i < resolved.length; i++) {
      if (lockedEarned[i] != null) {
        sum += lockedEarned[i]
        continue
      }
      if (i !== current) continue
      const row = resolved[i]
      const answer = answers[i] ?? initTaskInput(row.task)
      sum += examTaskEarned(row.task, answer, row.punkte)
    }
    return sum
  }, [resolved, answers, lockedEarned, current])

  const setAnswer = (input: UserInput) => {
    setAnswers((prev) => {
      const next = prev.map((a, i) => (i === current ? input : a))
      answersRef.current = next
      return next
    })
  }

  const goToTask = (next: number) => {
    lockTaskEarned(current, answersRef.current)
    setCurrent(next)
  }

  const reportClassExamComplete = async () => {
    const examCode = normalizeExamCodeKey(codeText)
    let examId = activeClassExamId || matchClassExamId(examCode)
    const classCode = getClassCodeSettings().activeCode
    if (!examId && classCode && examCode) {
      try {
        const stats = await getClass(classCode)
        examId =
          stats.exams?.find(
            (exam) => normalizeExamCodeKey(exam.examCode) === examCode,
          )?.id ?? null
        if (examId) setActiveClassExamId(examId)
        setClassExams(stats.exams ?? [])
      } catch {
        /* offline */
      }
    }
    try {
      let updated: ClassExamSummary | null = null
      if (examId) {
        updated = await completeClassExam(examId)
      } else if (classCode && examCode) {
        updated = await completeClassExamByCode(classCode, examCode)
        examId = updated.id
        setActiveClassExamId(updated.id)
      } else {
        setCompleteNotice(
          classCode
            ? 'Klausur abgegeben. Der Klassen-Zähler konnte nicht aktualisiert werden (Klausur nicht in dieser Klasse gefunden).'
            : 'Klausur abgegeben. Für den Lehrer-Zähler bitte den Klassencode aktivieren und die Klausur über die Klassenliste starten — oder denselben Code erneut mit aktivem Klassencode abgeben.',
        )
        return
      }
      if (examId) {
        markClassExamCompleted(examId)
        setCompletedIds(new Set(getCompletedClassExamIds()))
      }
      setCompleteNotice(
        updated
          ? `Für die Klasse gezählt: jetzt ${updated.solveCount ?? 0}× gelöst.`
          : null,
      )
    } catch {
      if (examId) {
        markClassExamCompleted(examId)
        setCompletedIds(new Set(getCompletedClassExamIds()))
      }
      setCompleteNotice(
        'Klausur lokal gespeichert. Der Klassen-Zähler konnte online nicht erhöht werden — Internet/Worker prüfen (Datei cloudflare/worker.js neu deployen).',
      )
    }
  }

  const submit = () => {
    const answerList = answersRef.current
    const rows = resolvedRef.current
    lockTaskEarned(current, answerList)
    const computed: TaskResult[] = rows.map((r, i) => {
      const scored = scoreTask(i, answerList, rows)
      return {
        resolved: r,
        answer: scored.answer,
        correct: scored.correct,
        earned: scored.earned,
      }
    })
    setResults(computed)
    persist(computed)
    setPhase('done')
    void reportClassExamComplete()
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
    const openExams = classExams.filter((exam) => !completedIds.has(exam.id))
    const doneExams = classExams.filter((exam) => completedIds.has(exam.id))
    return (
      <section className="card">
        <div className="session__head">
          <div>
            <h2 className="section-title no-margin">Klausur schreiben</h2>
            <p className="muted small">
              Füge den Klausurcode ein (beginnt mit „MSX1:“) oder starte eine
              Klassenklausur.
            </p>
          </div>
          <button type="button" className="link" onClick={onExit}>
            Zurück
          </button>
        </div>
        {error && <p className="notice notice--error">{error}</p>}

        {classExams.length > 0 && (
          <div className="class-exam-inbox">
            <h3 className="exam-pool__title">Klausuren deiner Klasse</h3>
            {openExams.length === 0 ? (
              <p className="muted small">Keine offenen Klassenklausuren.</p>
            ) : (
              <ul className="class-exam-inbox__list">
                {openExams.map((exam) => (
                  <li key={exam.id} className="class-exam-inbox__item">
                    <div>
                      <strong>{exam.name}</strong>
                      <p className="muted small">
                        {exam.taskCount != null ? `${exam.taskCount} Aufgaben` : 'Klausur'}
                        {exam.totalPoints != null ? ` · ${exam.totalPoints} P.` : ''}
                        <span className="class-exam-inbox__new"> · offen</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="primary"
                      onClick={() => startClassExam(exam)}
                    >
                      Starten
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {doneExams.length > 0 && (
              <details className="class-exam-inbox__done">
                <summary className="muted small">
                  Bereits geschrieben ({doneExams.length})
                </summary>
                <ul className="class-exam-inbox__list">
                  {doneExams.map((exam) => (
                    <li key={exam.id} className="class-exam-inbox__item">
                      <div>
                        <strong>{exam.name}</strong>
                        <p className="muted small">Erneut schreiben möglich</p>
                      </div>
                      <button
                        type="button"
                        className="ghost"
                        onClick={() => startClassExam(exam)}
                      >
                        Nochmal
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

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
          <span className="muted small">Wert {r.punkte} P.</span>
        </div>
        <div className="session__meta">
          <span>
            Aufgabe {current + 1} von {resolved.length}
          </span>
          <span>
            Bisher {liveEarned} / {totalPoints} P.
          </span>
        </div>
        <div className="progress">
          <div
            className="progress__fill"
            style={{ width: `${(current / resolved.length) * 100}%` }}
          />
        </div>

        <div className="prompt">{task.question}</div>

        <TaskVisual html={task.visualContent} />

        <TaskInteractive
          task={task}
          value={answers[current] ?? initTaskInput(task)}
          onChange={setAnswer}
        />

        {!task.interactive && (
          <AnswerInput
            answerKind={task.answerKind}
            unit={task.unit}
            value={answers[current] ?? emptyInput(task.answerKind)}
            onChange={setAnswer}
            onSubmit={() => (isLast ? undefined : goToTask(current + 1))}
          />
        )}

        <div className="exam-nav">
          {current > 0 && (
            <button
              type="button"
              className="ghost"
              onClick={() => goToTask(current - 1)}
            >
              Zurück
            </button>
          )}
          {!isLast ? (
            <button
              type="button"
              className="primary"
              onClick={() => goToTask(current + 1)}
            >
              Nächste Aufgabe
            </button>
          ) : (
            <button type="button" className="primary" onClick={submit}>
              Klausur abgeben
            </button>
          )}
        </div>

        <ReportFaultyTask
          key={`${r.topicId}-${current}-${task.question.slice(0, 40)}`}
          topicId={r.topicId}
          topicTitle={r.topicTitle}
          areaTitle={r.areaTitle}
          contentId={topicContentId(r.topicId)}
          question={task.question}
        />
      </section>
    )
  }

  // phase === 'done'
  const earned = results.reduce((s, r) => s + r.earned, 0)
  const correctCount = results.filter((r) => r.correct).length
  const pct = totalPoints > 0 ? Math.round((earned / totalPoints) * 100) : 0
  const printedAt = new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const exportInput: ExamProtocolExportInput = {
    user,
    title: spec?.titel ?? 'Übungsklausur',
    results,
    totalPoints,
    printedAt,
  }

  const exportActions = (
    <div className="exam-export-actions">
      <button
        type="button"
        className="primary"
        onClick={() => printExamProtocol(exportInput)}
      >
        Drucken
      </button>
      <button
        type="button"
        className="ghost"
        disabled={pdfBusy}
        onClick={() => {
          setPdfBusy(true)
          setPdfNotice(null)
          void saveExamProtocolPdf(exportInput).then((result) => {
            setPdfBusy(false)
            if (result.ok) {
              setPdfNotice(
                result.filePath
                  ? `PDF gespeichert: ${result.filePath}`
                  : 'Druckfenster geöffnet — dort „Als PDF speichern“ wählen.',
              )
              return
            }
            if (result.cancelled) {
              setPdfNotice(null)
              return
            }
            setPdfNotice(result.error ?? 'PDF konnte nicht erstellt werden.')
          })
        }}
      >
        {pdfBusy ? 'PDF wird erstellt …' : 'Als PDF speichern'}
      </button>
    </div>
  )

  return (
    <div className="protocol-view">
      <section className="card no-print">
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

        {exportActions}
        {pdfNotice && <p className="muted small">{pdfNotice}</p>}
        {completeNotice && (
          <p
            className={`notice ${
              completeNotice.includes('gezählt') ? 'notice--ok' : 'notice--warn'
            }`}
          >
            {completeNotice}
          </p>
        )}

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
              <TaskVisual html={r.resolved.task.visualContent} />
              <p className="exam-review__line">
                Deine Antwort: <strong>{formatExamAnswer(r.answer)}</strong>
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

        {exportActions}
        {pdfNotice && <p className="muted small">{pdfNotice}</p>}
      </section>

      <ExamProtocolSheet
        user={user}
        title={spec?.titel ?? 'Übungsklausur'}
        results={results}
        totalPoints={totalPoints}
        printedAt={printedAt}
      />
    </div>
  )
}
