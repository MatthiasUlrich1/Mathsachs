import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import {
  checkAnswer,
  generateProblem,
  type Difficulty,
  type Operation,
  type Problem,
} from './math'
import './App.css'

type Phase = 'setup' | 'playing' | 'over'

type Feedback = 'correct' | 'wrong' | null

const ROUND_SECONDS = 60

const ALL_OPERATIONS: { op: Operation; label: string }[] = [
  { op: '+', label: 'Add' },
  { op: '-', label: 'Subtract' },
  { op: '×', label: 'Multiply' },
  { op: '÷', label: 'Divide' },
]

const DIFFICULTIES: { value: Difficulty; label: string; blurb: string }[] = [
  { value: 'easy', label: 'Easy', blurb: 'Numbers up to 10' },
  { value: 'medium', label: 'Medium', blurb: 'Numbers up to 25' },
  { value: 'hard', label: 'Hard', blurb: 'Numbers up to 99' },
]

export default function App() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [operations, setOperations] = useState<Operation[]>(['+', '-'])

  const [problem, setProblem] = useState<Problem | null>(null)
  const [response, setResponse] = useState('')
  const [feedback, setFeedback] = useState<Feedback>(null)

  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)

  const inputRef = useRef<HTMLInputElement>(null)

  const toggleOperation = (op: Operation) => {
    setOperations((current) =>
      current.includes(op)
        ? current.filter((o) => o !== op)
        : [...current, op],
    )
  }

  const nextProblem = useCallback(() => {
    setProblem(generateProblem(difficulty, operations))
    setResponse('')
  }, [difficulty, operations])

  const startGame = () => {
    if (operations.length === 0) return
    setScore(0)
    setAttempts(0)
    setStreak(0)
    setBestStreak(0)
    setTimeLeft(ROUND_SECONDS)
    setFeedback(null)
    setProblem(generateProblem(difficulty, operations))
    setResponse('')
    setPhase('playing')
  }

  // Countdown timer for the active round.
  useEffect(() => {
    if (phase !== 'playing') return
    if (timeLeft <= 0) {
      setPhase('over')
      return
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [phase, timeLeft])

  // Keep the answer box focused while playing.
  useEffect(() => {
    if (phase === 'playing') inputRef.current?.focus()
  }, [phase, problem])

  // Clear the correct/wrong flash shortly after it appears.
  useEffect(() => {
    if (!feedback) return
    const id = setTimeout(() => setFeedback(null), 450)
    return () => clearTimeout(id)
  }, [feedback])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!problem || response.trim() === '') return

    const value = Number(response)
    const correct = Number.isFinite(value) && checkAnswer(problem, value)

    setAttempts((a) => a + 1)
    if (correct) {
      setScore((s) => s + 1)
      setStreak((s) => {
        const next = s + 1
        setBestStreak((b) => Math.max(b, next))
        return next
      })
      setFeedback('correct')
    } else {
      setStreak(0)
      setFeedback('wrong')
    }
    nextProblem()
  }

  const accuracy = useMemo(
    () => (attempts === 0 ? 0 : Math.round((score / attempts) * 100)),
    [score, attempts],
  )

  return (
    <main className="app">
      <header className="brand">
        <span className="brand__mark" aria-hidden="true">
          ÷
        </span>
        <div>
          <h1 className="brand__title">Mathsachs</h1>
          <p className="brand__tag">Sharpen your mental math in 60 seconds.</p>
        </div>
      </header>

      <section className={`card card--${phase}`}>
        {phase === 'setup' && (
          <div className="setup">
            <h2 className="section-title">Choose your challenge</h2>

            <div className="field">
              <span className="field__label">Difficulty</span>
              <div className="options">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    className={`chip ${difficulty === d.value ? 'chip--active' : ''}`}
                    onClick={() => setDifficulty(d.value)}
                  >
                    <strong>{d.label}</strong>
                    <small>{d.blurb}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <span className="field__label">Operations</span>
              <div className="options options--ops">
                {ALL_OPERATIONS.map(({ op, label }) => (
                  <button
                    key={op}
                    type="button"
                    className={`chip ${operations.includes(op) ? 'chip--active' : ''}`}
                    onClick={() => toggleOperation(op)}
                    aria-pressed={operations.includes(op)}
                  >
                    <span className="chip__op">{op}</span>
                    <small>{label}</small>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="primary"
              onClick={startGame}
              disabled={operations.length === 0}
            >
              {operations.length === 0 ? 'Pick an operation' : 'Start round'}
            </button>
          </div>
        )}

        {phase === 'playing' && problem && (
          <div className="play">
            <div className="hud">
              <div className="hud__item">
                <span className="hud__value">{score}</span>
                <span className="hud__label">Score</span>
              </div>
              <div className="hud__item">
                <span className="hud__value">{streak}🔥</span>
                <span className="hud__label">Streak</span>
              </div>
              <div className="hud__item hud__item--timer">
                <span className="hud__value">{timeLeft}s</span>
                <span className="hud__label">Time</span>
              </div>
            </div>

            <div className="timerbar">
              <div
                className="timerbar__fill"
                style={{ width: `${(timeLeft / ROUND_SECONDS) * 100}%` }}
              />
            </div>

            <div className={`prompt ${feedback ? `prompt--${feedback}` : ''}`}>
              {problem.prompt}
              <span className="prompt__eq"> = ?</span>
            </div>

            <form className="answer" onSubmit={submit}>
              <input
                ref={inputRef}
                className="answer__input"
                type="number"
                inputMode="numeric"
                placeholder="Your answer"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                aria-label="Your answer"
              />
              <button type="submit" className="primary">
                Enter
              </button>
            </form>
          </div>
        )}

        {phase === 'over' && (
          <div className="over">
            <h2 className="section-title">Time&apos;s up!</h2>
            <div className="results">
              <div className="result">
                <span className="result__value">{score}</span>
                <span className="result__label">Correct</span>
              </div>
              <div className="result">
                <span className="result__value">{accuracy}%</span>
                <span className="result__label">Accuracy</span>
              </div>
              <div className="result">
                <span className="result__value">{bestStreak}</span>
                <span className="result__label">Best streak</span>
              </div>
            </div>
            <div className="over__actions">
              <button type="button" className="primary" onClick={startGame}>
                Play again
              </button>
              <button
                type="button"
                className="ghost"
                onClick={() => setPhase('setup')}
              >
                Change settings
              </button>
            </div>
          </div>
        )}
      </section>

      <footer className="foot">
        Built with React + Vite · {ROUND_SECONDS}s rounds
      </footer>
    </main>
  )
}
