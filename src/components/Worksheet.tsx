import { useMemo, useState } from 'react'
import { createRng, timeSeed } from '../lib/rng'
import type { Task, Topic } from '../curriculum/types'

interface Props {
  topic: Topic
  areaTitle: string
  gradeTitle: string
  onExit: () => void
}

const COUNTS = [10, 15, 20, 30]

export function Worksheet({ topic, areaTitle, gradeTitle, onExit }: Props) {
  const [count, setCount] = useState(15)
  const [seed, setSeed] = useState(() => timeSeed())

  const tasks = useMemo<Task[]>(() => {
    const rng = createRng(seed)
    return Array.from({ length: count }, () => topic.generate(rng))
  }, [topic, count, seed])

  return (
    <div className="worksheet-view">
      <div className="card no-print worksheet-controls">
        <div className="session__head">
          <h2 className="section-title no-margin">Übungsblatt erstellen</h2>
          <button type="button" className="link" onClick={onExit}>
            Zurück
          </button>
        </div>
        <p className="muted small">
          {topic.title} · {areaTitle}
        </p>
        <div className="worksheet-controls__row">
          <label>
            Anzahl Aufgaben:{' '}
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            >
              {COUNTS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="ghost"
            onClick={() => setSeed(timeSeed())}
          >
            Neue Aufgaben
          </button>
          <button type="button" className="primary" onClick={() => window.print()}>
            Drucken / als PDF speichern
          </button>
        </div>
      </div>

      <article className="sheet">
        <header className="sheet__head">
          <h1>Mathsachs — Übungsblatt</h1>
          <p>
            {gradeTitle} · {areaTitle} · <strong>{topic.title}</strong>
          </p>
          <p className="sheet__line">
            Name: ______________________ Datum: ____________ Punkte: ______
          </p>
        </header>

        <ol className="sheet__tasks">
          {tasks.map((t, i) => (
            <li key={i} className="sheet__task">
              <span className="sheet__q">{t.question}</span>
              <span className="sheet__blank">
                {t.answerKind === 'fraction' ? '______ / ______' : '__________'}
                {t.unit ? ` ${t.unit}` : ''}
              </span>
            </li>
          ))}
        </ol>

        <section className="sheet__solutions">
          <h2>Lösungen</h2>
          <ol>
            {tasks.map((t, i) => (
              <li key={i}>{t.solution}</li>
            ))}
          </ol>
        </section>
      </article>
    </div>
  )
}
