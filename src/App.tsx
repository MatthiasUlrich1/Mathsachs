import { useEffect, useState } from 'react'
import './App.css'
import { mathematik } from './curriculum/math6'
import { addUser, listUsers } from './lib/storage'
import { CurriculumBrowser } from './components/CurriculumBrowser'
import { PracticeSession } from './components/PracticeSession'
import { Worksheet } from './components/Worksheet'
import { Protocol } from './components/Protocol'

const ACTIVE_KEY = 'mathsachs.activeUser.v1'

type View =
  | { name: 'browse' }
  | { name: 'practice'; topicId: string }
  | { name: 'worksheet'; topicId: string }
  | { name: 'protocol' }

export default function App() {
  const [users, setUsers] = useState<string[]>(() => listUsers())
  const [activeUser, setActiveUser] = useState<string | null>(
    () => localStorage.getItem(ACTIVE_KEY) || null,
  )
  const [view, setView] = useState<View>({ name: 'browse' })
  const [newName, setNewName] = useState('')

  useEffect(() => {
    if (activeUser) localStorage.setItem(ACTIVE_KEY, activeUser)
  }, [activeUser])

  const grade = mathematik.grades[0]

  const createUser = () => {
    const name = newName.trim()
    if (!name) return
    setUsers(addUser(name))
    setActiveUser(name)
    setNewName('')
    setView({ name: 'browse' })
  }

  if (!activeUser) {
    return (
      <main className="app">
        <Brand />
        <section className="card">
          <h2 className="section-title">Wer übt heute?</h2>
          {users.length > 0 && (
            <ul className="user-list">
              {users.map((u) => (
                <li key={u}>
                  <button
                    type="button"
                    className="user-list__btn"
                    onClick={() => setActiveUser(u)}
                  >
                    {u}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="field">
            <span className="field__label">Neuen Benutzer anlegen</span>
            <div className="inline-form">
              <input
                className="answer-input__field"
                type="text"
                placeholder="Vorname"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createUser()}
              />
              <button type="button" className="primary" onClick={createUser}>
                Anlegen
              </button>
            </div>
          </div>
        </section>
        <Foot />
      </main>
    )
  }

  return (
    <main className="app app--wide">
      <header className="topbar">
        <Brand compact />
        <nav className="topbar__nav">
          <button
            type="button"
            className={`tab ${view.name === 'browse' ? 'tab--active' : ''}`}
            onClick={() => setView({ name: 'browse' })}
          >
            Themen
          </button>
          <button
            type="button"
            className={`tab ${view.name === 'protocol' ? 'tab--active' : ''}`}
            onClick={() => setView({ name: 'protocol' })}
          >
            Punkteprotokoll
          </button>
          <div className="user-badge">
            <span className="user-badge__name">{activeUser}</span>
            <button
              type="button"
              className="link"
              onClick={() => {
                setActiveUser(null)
                setView({ name: 'browse' })
              }}
            >
              wechseln
            </button>
          </div>
        </nav>
      </header>

      {view.name === 'browse' && (
        <section className="card">
          <div className="course-head">
            <h2 className="section-title no-margin">
              {mathematik.title} · {grade.title}
            </h2>
            <p className="muted small">
              Lehrplan Gymnasium (Sachsen). Klappe einen Lernbereich auf, wähle
              ein Thema und übe direkt oder erstelle ein Übungsblatt.
            </p>
          </div>
          <CurriculumBrowser
            grade={grade}
            onPractice={(topicId) => setView({ name: 'practice', topicId })}
            onWorksheet={(topicId) => setView({ name: 'worksheet', topicId })}
          />
        </section>
      )}

      {view.name === 'practice' && (
        <PracticeSession
          topicId={view.topicId}
          user={activeUser}
          onExit={() => setView({ name: 'browse' })}
        />
      )}

      {view.name === 'worksheet' && (
        <Worksheet
          topicId={view.topicId}
          onExit={() => setView({ name: 'browse' })}
        />
      )}

      {view.name === 'protocol' && (
        <Protocol user={activeUser} onExit={() => setView({ name: 'browse' })} />
      )}

      <Foot />
    </main>
  )
}

function Brand({ compact }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? 'brand--compact' : ''}`}>
      <span className="brand__mark" aria-hidden="true">
        ÷
      </span>
      <div>
        <h1 className="brand__title">Mathsachs</h1>
        {!compact && (
          <p className="brand__tag">
            Üben nach Lehrplan — Gymnasium Mathematik, Klasse 6
          </p>
        )}
      </div>
    </div>
  )
}

function Foot() {
  return (
    <footer className="foot">
      Mathsachs · Übungsprogramm nach sächsischem Lehrplan · erweiterbar für
      weitere Fächer
    </footer>
  )
}
