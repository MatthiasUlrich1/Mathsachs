import { useEffect, useState } from 'react'
import './App.css'
import {
  availableCurricula,
  getCurriculumModule,
  getLoadedIds,
  setLoadedIds,
} from './curriculum/registry'
import type { Grade, Topic } from './curriculum/types'
import { addUser, listUsers } from './lib/storage'
import { CurriculumBrowser } from './components/CurriculumBrowser'
import { CurriculumSetup } from './components/CurriculumSetup'
import { PracticeSession } from './components/PracticeSession'
import { Worksheet } from './components/Worksheet'
import { Protocol } from './components/Protocol'

const ACTIVE_KEY = 'mathsachs.activeUser.v1'

interface LoadedGrade {
  moduleId: string
  grade: Grade
}

type View =
  | { name: 'browse' }
  | { name: 'setup' }
  | { name: 'protocol' }
  | { name: 'practice'; topic: Topic; areaTitle: string; gradeTitle: string }
  | { name: 'worksheet'; topic: Topic; areaTitle: string; gradeTitle: string }

const registryOrder = (id: string) =>
  availableCurricula.findIndex((m) => m.id === id)

export default function App() {
  const [users, setUsers] = useState<string[]>(() => listUsers())
  const [activeUser, setActiveUser] = useState<string | null>(
    () => localStorage.getItem(ACTIVE_KEY) || null,
  )
  const [view, setView] = useState<View>({ name: 'browse' })
  const [newName, setNewName] = useState('')

  const [loaded, setLoaded] = useState<LoadedGrade[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (activeUser) localStorage.setItem(ACTIVE_KEY, activeUser)
  }, [activeUser])

  // Load the persisted curricula on start via dynamic import.
  useEffect(() => {
    let cancelled = false
    const ids = getLoadedIds()
    Promise.all(
      ids.map(async (id): Promise<LoadedGrade | null> => {
        const mod = getCurriculumModule(id)
        if (!mod) return null
        const grade = await mod.load()
        return { moduleId: id, grade }
      }),
    ).then((results) => {
      if (cancelled) return
      const ok = results.filter((r): r is LoadedGrade => r !== null)
      setLoaded(ok)
      setActiveId(ok[0]?.moduleId ?? '')
      setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const loadCurriculum = async (id: string) => {
    if (loaded.some((l) => l.moduleId === id)) return
    const mod = getCurriculumModule(id)
    if (!mod) return
    const grade = await mod.load()
    const next = [...loaded, { moduleId: id, grade }].sort(
      (a, b) => registryOrder(a.moduleId) - registryOrder(b.moduleId),
    )
    setLoaded(next)
    setLoadedIds(next.map((l) => l.moduleId))
    setActiveId(id)
  }

  const removeCurriculum = (id: string) => {
    const next = loaded.filter((l) => l.moduleId !== id)
    setLoaded(next)
    setLoadedIds(next.map((l) => l.moduleId))
    if (activeId === id) setActiveId(next[0]?.moduleId ?? '')
  }

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

  const activeLoaded =
    loaded.find((l) => l.moduleId === activeId) ?? loaded[0] ?? null
  const activeModule = activeLoaded
    ? getCurriculumModule(activeLoaded.moduleId)
    : undefined

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
            className={`tab ${view.name === 'setup' ? 'tab--active' : ''}`}
            onClick={() => setView({ name: 'setup' })}
          >
            Lehrpläne
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
          {!ready ? (
            <p className="muted">Lehrpläne werden geladen …</p>
          ) : !activeLoaded ? (
            <div className="course-head">
              <h2 className="section-title no-margin">Kein Lehrplan geladen</h2>
              <p className="muted small">
                Öffne den Bereich „Lehrpläne" und lade eine Klasse, um mit dem
                Üben zu beginnen.
              </p>
              <button
                type="button"
                className="primary setup-cta"
                onClick={() => setView({ name: 'setup' })}
              >
                Zu den Lehrplänen
              </button>
            </div>
          ) : (
            <>
              <div className="course-head">
                <h2 className="section-title no-margin">
                  {activeModule?.subjectTitle ?? 'Mathematik'} ·{' '}
                  {activeLoaded.grade.title}
                </h2>
                <p className="muted small">
                  Lehrplan Gymnasium (Sachsen). Klappe einen Lernbereich auf,
                  wähle ein Thema und übe direkt oder erstelle ein Übungsblatt.
                </p>
              </div>

              {loaded.length > 1 && (
                <div className="grade-tabs" role="tablist">
                  {loaded.map((l) => (
                    <button
                      key={l.moduleId}
                      type="button"
                      role="tab"
                      aria-selected={l.moduleId === activeLoaded.moduleId}
                      className={`grade-tab ${
                        l.moduleId === activeLoaded.moduleId
                          ? 'grade-tab--active'
                          : ''
                      }`}
                      onClick={() => setActiveId(l.moduleId)}
                    >
                      {l.grade.title}
                    </button>
                  ))}
                </div>
              )}

              <CurriculumBrowser
                key={activeLoaded.moduleId}
                grade={activeLoaded.grade}
                onPractice={(topic, areaTitle) =>
                  setView({
                    name: 'practice',
                    topic,
                    areaTitle,
                    gradeTitle: activeLoaded.grade.title,
                  })
                }
                onWorksheet={(topic, areaTitle) =>
                  setView({
                    name: 'worksheet',
                    topic,
                    areaTitle,
                    gradeTitle: activeLoaded.grade.title,
                  })
                }
              />
            </>
          )}
        </section>
      )}

      {view.name === 'setup' && (
        <CurriculumSetup
          loadedIds={loaded.map((l) => l.moduleId)}
          onLoad={loadCurriculum}
          onRemove={removeCurriculum}
          onExit={() => setView({ name: 'browse' })}
        />
      )}

      {view.name === 'practice' && (
        <PracticeSession
          topic={view.topic}
          areaTitle={view.areaTitle}
          user={activeUser}
          onExit={() => setView({ name: 'browse' })}
        />
      )}

      {view.name === 'worksheet' && (
        <Worksheet
          topic={view.topic}
          areaTitle={view.areaTitle}
          gradeTitle={view.gradeTitle}
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
            Üben nach Lehrplan — Gymnasium Mathematik (Sachsen)
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
      weitere Klassen und Fächer
    </footer>
  )
}
