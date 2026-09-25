import { useEffect, useMemo, useState } from 'react'
import { createRng, timeSeed } from '../lib/rng'
import { reportSchuelerAnswersChecked } from '../lib/schuelerAnswerStats'
import { recordSession } from '../lib/storage'
import { normalizeRole, type UserRole } from '../lib/roles'
import type { TaskGrade, Topic, UserInput } from '../curriculum/types'
import { awardPoints, gradeTask, isFormulaLikeHint } from '../curriculum/types'
import {
  DEFAULT_TASKS_PER_ROUND,
  resolveTasksPerRound,
} from '../curriculum/tasksPerRound'
import {
  buildBerichtigungRound,
  buildUniqueTaskRoundWithSeeds,
  type BerichtigungTopicRef,
} from '../curriculum/uniqueRound'
import { AnswerInput } from './AnswerInput'
import { ReportFaultyTask } from './ReportFaultyTask'
import { initTaskInput, TaskInteractive, TaskVisual } from './TaskMedia'

export type PracticeMode = 'practice' | 'berichtigung' | 'replay'

interface RoundItem {
  topic: Topic
  areaTitle: string
  gradeTitle?: string
  task: import('../curriculum/types').Task
  seed: number
}

interface Props {
  topic: Topic
  areaTitle: string
  user: string
  role?: UserRole | null
  onExit: () => void
  challengeId?: string
  /** Reproduce a reported task first (Entwickler / Melder). */
  initialSeed?: number
  /** Berichtigung: no protocol points; multi-topic pool. */
  mode?: PracticeMode
  berichtigungTopics?: BerichtigungTopicRef[]
}

type Phase = 'answering' | 'correct' | 'partial' | 'wrong'

export function PracticeSession({
  topic,
  areaTitle,
  user,
  role,
  onExit,
  challengeId,
  initialSeed,
  mode = 'practice',
  berichtigungTopics,
}: Props) {
  const isBerichtigung = mode === 'berichtigung'
  const isReplay = mode === 'replay'
  const skipProtocol = isBerichtigung || isReplay

  const [items] = useState<RoundItem[]>(() => {
    if (isBerichtigung && berichtigungTopics && berichtigungTopics.length > 0) {
      return buildBerichtigungRound(berichtigungTopics, DEFAULT_TASKS_PER_ROUND)
    }
    const rng = createRng(timeSeed())
    const target = isReplay && initialSeed != null ? 1 : resolveTasksPerRound(topic)
    return buildUniqueTaskRoundWithSeeds(
      topic.generate,
      rng,
      target,
      400,
      initialSeed,
    ).map((row) => ({
      topic,
      areaTitle,
      task: row.task,
      seed: row.seed,
    }))
  })

  const totalTasks = items.length
  const [index, setIndex] = useState(1)
  const current = items[index - 1]!
  const task = current.task
  const activeTopic = current.topic
  const activeArea = current.areaTitle
  const activeSeed = current.seed

  const [input, setInput] = useState<UserInput>(() => initTaskInput(task))
  const [phase, setPhase] = useState<Phase>('answering')
  const [lastGrade, setLastGrade] = useState<TaskGrade | null>(null)
  const [lastAwarded, setLastAwarded] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showFachwissen, setShowFachwissen] = useState(false)

  useEffect(() => {
    setInput(initTaskInput(task))
    setLastGrade(null)
    setLastAwarded(0)
  }, [task])

  const [correct, setCorrect] = useState(0)
  const [points, setPoints] = useState(0)
  const [finished, setFinished] = useState(false)

  const answerKind = task.answerKind
  /** Prefer question-specific Fachwissen; fall back to topic-level. */
  const fachwissen = task.fachwissen ?? activeTopic.fachwissen

  const persistAttempt = (fullyCorrect: boolean, awarded: number) => {
    if (skipProtocol) return
    recordSession(user, {
      topicId: activeTopic.id,
      topicTitle: activeTopic.title,
      areaTitle: activeArea,
      attempts: 1,
      correct: fullyCorrect ? 1 : 0,
      points: awarded,
      ...(challengeId?.trim() ? { challengeId: challengeId.trim() } : {}),
    })
  }

  const submit = () => {
    if (phase !== 'answering') return
    const grade = gradeTask(task, input)
    const awarded = awardPoints(activeTopic.pointsPerTask, grade)
    const fullyCorrect = grade.fraction >= 1
    setLastGrade(grade)
    setLastAwarded(awarded)
    persistAttempt(fullyCorrect, awarded)
    if (!skipProtocol && normalizeRole(role) === 'schueler') {
      reportSchuelerAnswersChecked(1)
    }
    if (awarded > 0) {
      setPoints((p) => p + awarded)
    }
    if (fullyCorrect) {
      setCorrect((c) => c + 1)
      setPhase('correct')
    } else if (grade.fraction > 0) {
      setPhase('partial')
    } else {
      setPhase('wrong')
    }
  }

  const finish = () => {
    setFinished(true)
  }

  const next = () => {
    if (index >= totalTasks) {
      finish()
      return
    }
    setPhase('answering')
    setShowExplanation(false)
    setShowFachwissen(false)
    setLastGrade(null)
    setLastAwarded(0)
    setIndex((i) => i + 1)
  }

  const endEarly = () => {
    finish()
  }

  const accuracy = useMemo(
    () => (index > 0 ? Math.round((correct / Math.max(1, index)) * 100) : 0),
    [correct, index],
  )

  const headline = isBerichtigung
    ? 'Berichtigung'
    : isReplay
      ? 'Gemeldete Aufgabe'
      : activeTopic.title
  const subline = isBerichtigung
    ? 'Ähnliche Aufgaben zu falschen Klausur-Themen · zählt nicht für die Klausurauswertung'
    : isReplay
      ? `${activeTopic.title} · Seed ${activeSeed}`
      : activeArea

  const showInteractiveFeedback = phase === 'partial' || phase === 'wrong'
  const partResults =
    showInteractiveFeedback && lastGrade?.parts ? lastGrade.parts : undefined

  if (finished) {
    const answered = phase === 'answering' ? index - 1 : index
    const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0
    return (
      <div className="card session">
        <h2 className="section-title">
          {isBerichtigung ? 'Berichtigung beendet' : 'Runde beendet'}
        </h2>
        <p className="muted">
          {isBerichtigung ? 'Falsche Klausur-Themen' : `${topic.title} · ${areaTitle}`}
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
          {!skipProtocol && (
            <div className="result">
              <span className="result__value">{points}</span>
              <span className="result__label">Punkte</span>
            </div>
          )}
        </div>
        <p className="muted small">
          {skipProtocol
            ? 'Diese Runde hat die Klausurauswertung und das Punkteprotokoll nicht verändert.'
            : `Punkte wurden sofort bei jeder Antwort für ${user} gespeichert.`}
        </p>
        <button type="button" className="primary" onClick={onExit}>
          {isBerichtigung ? 'Zurück zur Auswertung' : 'Zurück zur Themenauswahl'}
        </button>
      </div>
    )
  }

  return (
    <div className="card session">
      <div className="session__head">
        <div>
          <h2 className="section-title no-margin">{headline}</h2>
          <p className="muted small">{subline}</p>
          {isBerichtigung && (
            <p className="muted small">
              Aktuell: {activeTopic.title} · Seed {activeSeed}
            </p>
          )}
        </div>
        <button type="button" className="link" onClick={endEarly}>
          Runde beenden
        </button>
      </div>

      <div className="session__meta">
        <span>
          Aufgabe {index} von {totalTasks}
        </span>
        {!skipProtocol && <span>Punkte: {points}</span>}
        <span>{accuracy}%</span>
      </div>
      <div className="progress">
        <div
          className="progress__fill"
          style={{ width: `${((index - 1) / totalTasks) * 100}%` }}
        />
      </div>

      <div className={`prompt prompt--${phase}`}>{task.question}</div>

      <TaskVisual
        html={
          phase === 'answering'
            ? task.visualContent
            : (task.solutionVisualContent ?? task.visualContent)
        }
      />

      {(phase === 'answering' || showInteractiveFeedback) && (
        <TaskInteractive
          task={task}
          value={input}
          onChange={setInput}
          disabled={phase !== 'answering'}
          partResults={partResults}
        />
      )}

      {activeTopic.hint && phase === 'answering' && !isFormulaLikeHint(activeTopic.hint) && (
        <p className="muted small hint">{activeTopic.hint}</p>
      )}

      {fachwissen && (
        <div className="session__fachwissen">
          <button
            type="button"
            className="session__fachwissen-toggle"
            aria-expanded={showFachwissen}
            onClick={() => setShowFachwissen((v) => !v)}
          >
            💡 Fachwissen {showFachwissen ? '▲' : '▼'}
          </button>
          {showFachwissen && (
            <div className="fachwissen-card fachwissen-card--session">
              <p className="fachwissen-card__text">{fachwissen.text}</p>
              {fachwissen.quelle && (
                <p className="fachwissen-card__source">
                  Quelle:{' '}
                  {fachwissen.url ? (
                    <a
                      href={fachwissen.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {fachwissen.quelle}
                    </a>
                  ) : (
                    fachwissen.quelle
                  )}
                  {fachwissen.url && (
                    <span className="fachwissen-card__license"> (CC BY-SA 4.0)</span>
                  )}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {!task.interactive && (
        <AnswerInput
          answerKind={answerKind}
          unit={task.unit}
          value={input}
          onChange={setInput}
          onSubmit={submit}
          disabled={phase !== 'answering'}
        />
      )}

      {phase === 'answering' && (
        <button type="button" className="primary" onClick={submit}>
          Antwort prüfen
        </button>
      )}

      {phase === 'correct' && (
        <div className="feedback feedback--good">
          <strong>
            Richtig!
            {!skipProtocol ? ` +${lastAwarded || activeTopic.pointsPerTask} Punkte` : ''}
          </strong>
          <button type="button" className="primary" onClick={next}>
            {index >= totalTasks ? 'Runde abschließen' : 'Nächste Aufgabe'}
          </button>
        </div>
      )}

      {phase === 'partial' && (
        <div className="feedback feedback--partial">
          <strong>
            Teilweise richtig
            {lastGrade?.parts
              ? ` (${lastGrade.parts.filter(Boolean).length} von ${lastGrade.parts.length})`
              : ''}
            {!skipProtocol && lastAwarded > 0 ? ` · +${lastAwarded} Punkte` : ''}
          </strong>
          <p>
            Vollständige Lösung: <span className="solution">{task.solution}</span>
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
            {index >= totalTasks ? 'Runde abschließen' : 'Nächste Aufgabe'}
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
            {index >= totalTasks ? 'Runde abschließen' : 'Nächste Aufgabe'}
          </button>
        </div>
      )}

      <ReportFaultyTask
        key={`${activeTopic.id}-${index}-${activeSeed}`}
        topicId={activeTopic.id}
        topicTitle={activeTopic.title}
        areaTitle={activeArea}
        contentId={activeTopic.contentId}
        question={task.question}
        seed={activeSeed}
      />
    </div>
  )
}
