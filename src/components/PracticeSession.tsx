import { useEffect, useMemo, useRef, useState } from 'react'
import { createRng, timeSeed } from '../lib/rng'
import { recordSession } from '../lib/storage'
import { emptyInput, type Task, type Topic, type UserInput } from '../curriculum/types'
import { AnswerInput } from './AnswerInput'

const TASKS_PER_ROUND = 10

interface Props {
  topic: Topic
  areaTitle: string
  user: string
  onExit: () => void
  challengeId?: string
}

type Phase = 'answering' | 'correct' | 'wrong'

export function PracticeSession({ topic, areaTitle, user, onExit, challengeId }: Props) {
  const [rng] = useState(() => createRng(timeSeed()))
  const [task, setTask] = useState<Task>(() => topic.generate(rng))
  const [input, setInput] = useState<UserInput>(() => emptyInput(task.answerKind))
  const [phase, setPhase] = useState<Phase>('answering')
  const [showExplanation, setShowExplanation] = useState(false)

  // Reset the answer widget whenever a fresh task appears.
  useEffect(() => {
    setInput(emptyInput(task.answerKind))
  }, [task])

  const [index, setIndex] = useState(1)
  const [correct, setCorrect] = useState(0)
  const [points, setPoints] = useState(0)
  const [finished, setFinished] = useState(false)
  const recorded = useRef(false)

  // Reset the input widget whenever a new task with a different kind appears.
  const answerKind = task.answerKind

  const submit = () => {
    if (phase !== 'answering') return
    const ok = task.check(input)
    if (ok) {
      setCorrect((c) => c + 1)
      setPoints((p) => p + topic.pointsPerTask)
      setPhase('correct')
    } else {
      setPhase('wrong')
    }
  }

  const finish = (answered: number, correctCount: number, pts: number) => {
    if (recorded.current) return
    recorded.current = true
    if (answered > 0) {
      recordSession(user, {
        topicId: topic.id,
        topicTitle: topic.title,
        areaTitle,
        attempts: answered,
        correct: correctCount,
        points: pts,
        ...(challengeId?.trim() ? { challengeId: challengeId.trim() } : {}),
      })
    }
    setFinished(true)
  }

  const next = () => {
    if (index >= TASKS_PER_ROUND) {
      finish(index, correct, points)
      return
    }
    const newTask = topic.generate(rng)
    setTask(newTask)
    setInput(emptyInput(newTask.answerKind))
    setPhase('answering')
    setShowExplanation(false)
    setIndex((i) => i + 1)
  }

  const endEarly = () => {
    // Count the current task only if it was already answered.
    const answered = phase === 'answering' ? index - 1 : index
    finish(answered, correct, points)
  }

  const accuracy = useMemo(
    () => (index > 0 ? Math.round((correct / Math.max(1, index)) * 100) : 0),
    [correct, index],
  )

  if (finished) {
    const answered = phase === 'answering' ? index - 1 : index
    const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0
    return (
      <div className="card session">
        <h2 className="section-title">Runde beendet</h2>
        <p className="muted">
          {topic.title} · {areaTitle}
        </p>
        <div className="results">
          <div className="result">
            <span className="result__value">{correct}</span>
            <span className="result__label">Richtig</span>
          </div>
          <div className="result">
            <span className="result__value">{pct}%</span>
            <span className="result__label">Genauigkeit</span>
          </div>
          <div className="result">
            <span className="result__value">{points}</span>
            <span className="result__label">Punkte</span>
          </div>
        </div>
        <p className="muted small">
          Deine Punkte wurden für <strong>{user}</strong> gespeichert.
        </p>
        <button type="button" className="primary" onClick={onExit}>
          Zurück zur Themenauswahl
        </button>
      </div>
    )
  }

  return (
    <div className="card session">
      <div className="session__head">
        <div>
          <h2 className="section-title no-margin">{topic.title}</h2>
          <p className="muted small">{areaTitle}</p>
        </div>
        <button type="button" className="link" onClick={endEarly}>
          Runde beenden
        </button>
      </div>

      <div className="session__meta">
        <span>
          Aufgabe {index} von {TASKS_PER_ROUND}
        </span>
        <span>Punkte: {points}</span>
        <span>{accuracy}%</span>
      </div>
      <div className="progress">
        <div
          className="progress__fill"
          style={{ width: `${((index - 1) / TASKS_PER_ROUND) * 100}%` }}
        />
      </div>

      <div className={`prompt prompt--${phase}`}>{task.question}</div>
      {topic.hint && phase === 'answering' && (
        <p className="muted small hint">{topic.hint}</p>
      )}

      <AnswerInput
        answerKind={answerKind}
        unit={task.unit}
        value={input}
        onChange={setInput}
        onSubmit={submit}
        disabled={phase !== 'answering'}
      />

      {phase === 'answering' && (
        <button type="button" className="primary" onClick={submit}>
          Antwort prüfen
        </button>
      )}

      {phase === 'correct' && (
        <div className="feedback feedback--good">
          <strong>Richtig! +{topic.pointsPerTask} Punkte</strong>
          <button type="button" className="primary" onClick={next}>
            {index >= TASKS_PER_ROUND ? 'Runde abschließen' : 'Nächste Aufgabe'}
          </button>
        </div>
      )}

      {phase === 'wrong' && (
        <div className="feedback feedback--bad">
          <strong>Leider falsch.</strong>
          <p>
            Richtige Lösung: <span className="solution">{task.solution}</span>
          </p>
          {!showExplanation ? (
            <button
              type="button"
              className="ghost"
              onClick={() => setShowExplanation(true)}
            >
              Erklärung anzeigen
            </button>
          ) : (
            <p className="explanation">{task.explanation}</p>
          )}
          <button type="button" className="primary" onClick={next}>
            {index >= TASKS_PER_ROUND ? 'Runde abschließen' : 'Nächste Aufgabe'}
          </button>
        </div>
      )}
    </div>
  )
}
