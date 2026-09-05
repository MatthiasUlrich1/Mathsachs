import { useEffect, useState } from 'react'
import './App.css'
import {
  availableCurricula,
  getCurriculumModule,
  getLoadedIds,
  setLoadedIds,
} from './curriculum/registry'
import type { Grade, Topic } from './curriculum/types'
import { getClass } from './classCode/api'
import {
  activeClassDisplayName,
  addUser,
  cacheKnownClassName,
  getClassCodeSettings,
  getUserRole,
  initSharedStorage,
  listUsers,
  setActiveStorageUser,
  setUserRole,
  subscribeSharedStorage,
  type UserRole,
} from './lib/storage'
import {
  canCreateExam,
  canWriteExam,
  isTeacherRole,
  roleLabel,
} from './lib/roles'
import { applyRoleChange } from './lib/teacherCode'
import {
  RoleOptions,
  TeacherCodeGate,
} from './components/TeacherCodePanel'
import { searchTopics, searchUnloadedHints } from './curriculum/search'
import { CurriculumBrowser } from './components/CurriculumBrowser'
import { PracticeSession } from './components/PracticeSession'
import { Worksheet } from './components/Worksheet'
import { Protocol } from './components/Protocol'
import { Challenge } from './components/Challenge'
import { SearchResults } from './components/SearchResults'
import { ExamBuilder } from './components/ExamBuilder'
import { ExamRunner } from './components/ExamRunner'
import { UpdateBanner } from './components/UpdateBanner'
import { UpdateBuildingBanner } from './components/UpdateBuildingBanner'
import { LegalFooter } from './components/LegalFooter'
import { Settings } from './components/Settings'
import { parseExamHash } from './exam/examCode'
import { useUpdateCheck } from './updates/useUpdateCheck'
import { useLanStatus } from './lan/useLanStatus'
import {
  topTabsForView,
  type SettingsSectionId,
  type TopTabId,
} from './nav'

const ACTIVE_KEY = 'mathsachs.activeUser.v1'

interface LoadedGrade {
  moduleId: string
  grade: Grade
}

type View =
  | { name: TopTabId; section?: SettingsSectionId }
  | {
      name: 'practice'
      topic: Topic
      areaTitle: string
      gradeTitle: string
      returnTo?: TopTabId
    }
  | { name: 'worksheet'; topic: Topic; areaTitle: string; gradeTitle: string }

const registryOrder = (id: string) =>
  availableCurricula.findIndex((m) => m.id === id)

export default function App() {
  const [storageReady, setStorageReady] = useState(false)
  const [users, setUsers] = useState<string[]>([])
  const [classLabel, setClassLabel] = useState<string | null>(null)
  const [activeUser, setActiveUser] = useState<string | null>(
    () => localStorage.getItem(ACTIVE_KEY) || null,
  )
  const [view, setView] = useState<View>({ name: 'browse' })
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState<UserRole | null>(null)
  const [newTeacherCode, setNewTeacherCode] = useState('')
  const [newTeacherCodeError, setNewTeacherCodeError] = useState<string | null>(
    null,
  )
  const [userRole, setUserRoleState] = useState<UserRole>('schueler')
  // Exam code taken from a shared link (`#klausur=…`), consumed by ExamRunner.
  const [examCodeFromLink, setExamCodeFromLink] = useState<string | null>(null)

  const [loaded, setLoaded] = useState<LoadedGrade[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [ready, setReady] = useState(false)
  const [query, setQuery] = useState('')
  const updateCheck = useUpdateCheck()
  const lanStatus = useLanStatus()
  const isDesktop = typeof window !== 'undefined' && Boolean(window.mathsachs?.isDesktop)
  const hideUpdateBanner =
    view.name === 'practice' ||
    view.name === 'worksheet' ||
    view.name === 'examRun'
  const updateBanner = hideUpdateBanner
    ? null
    : updateCheck.update ? (
        <UpdateBanner
          update={updateCheck.update}
          status={updateCheck.status}
          progress={updateCheck.progress}
          error={updateCheck.error}
          isDesktop={isDesktop}
          onDownload={() => void updateCheck.download()}
          onInstall={() => void updateCheck.install()}
          onDismiss={updateCheck.dismiss}
          onIgnore={updateCheck.ignore}
        />
      ) : updateCheck.building ? (
        <UpdateBuildingBanner onDismiss={updateCheck.dismissBuilding} />
      ) : null

  useEffect(() => {
    if (activeUser) localStorage.setItem(ACTIVE_KEY, activeUser)
  }, [activeUser])

  useEffect(() => {
    let cancelled = false
    const unsub = subscribeSharedStorage(() => {
      if (cancelled) return
      setUsers(listUsers())
      setClassLabel(activeClassDisplayName())
      const current = localStorage.getItem(ACTIVE_KEY)
      if (current) setUserRoleState(getUserRole(current))
    })
    void initSharedStorage().then(() => {
      if (cancelled) return
      const stored = localStorage.getItem(ACTIVE_KEY)
      if (stored) setActiveStorageUser(stored)
      setUsers(listUsers())
      setClassLabel(activeClassDisplayName())
      setStorageReady(true)
    })
    return () => {
      cancelled = true
      unsub()
    }
  }, [])

  // A shared "#klausur=…" link opens the exam runner directly. We read the code
  // once on start, switch to the runner and then clean the hash from the URL so
  // it is not re-triggered on reload. If nobody is logged in yet, the runner is
  // shown right after the user picks/creates a profile (the view is preserved).
  useEffect(() => {
    if (typeof window === 'undefined') return
    const code = parseExamHash(window.location.hash)
    if (!code) return
    setExamCodeFromLink(code)
    setView({ name: 'examRun' })
    window.history.replaceState(
      null,
      '',
      window.location.pathname + window.location.search,
    )
  }, [])

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

  useEffect(() => {
    if (view.name === 'examBuild' && !canCreateExam(userRole)) {
      setView({ name: 'browse' })
    }
    if (view.name === 'examRun' && !canWriteExam(userRole)) {
      setView({ name: 'browse' })
    }
  }, [view.name, userRole])

  // Schüler enter a code; persist the Worker class name so the badge
  // never falls back to the secret Klassencode.
  useEffect(() => {
    if (!storageReady || !activeUser) return
    const code = getClassCodeSettings().activeCode
    if (!code || activeClassDisplayName()) return
    let cancelled = false
    void getClass(code)
      .then((stats) => {
        if (!cancelled) cacheKnownClassName(stats.code, stats.name)
      })
      .catch(() => {
        /* offline: leave the class slot empty rather than showing the code */
      })
    return () => {
      cancelled = true
    }
  }, [storageReady, activeUser, classLabel])

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

  const selectUser = (name: string) => {
    setActiveStorageUser(name)
    setActiveUser(name)
    setClassLabel(activeClassDisplayName())
    setUserRoleState(getUserRole(name))
  }

  const createUser = () => {
    const name = newName.trim()
    if (!name || !newRole) return
    const result = applyRoleChange(null, newRole, newTeacherCode)
    if (!result.ok) {
      setNewTeacherCodeError(result.error)
      return
    }
    setUsers(addUser(name, result.role))
    selectUser(name)
    setNewName('')
    setNewRole(null)
    setNewTeacherCode('')
    setNewTeacherCodeError(null)
    setView({ name: 'browse' })
  }

  const pickNewRole = (role: UserRole) => {
    setNewRole(role)
    if (!isTeacherRole(role)) {
      setNewTeacherCode('')
      setNewTeacherCodeError(null)
    }
  }

  const changeRole = (role: UserRole) => {
    if (!activeUser) return
    setUserRole(activeUser, role)
    setUserRoleState(role)
    if (
      (view.name === 'examBuild' && !canCreateExam(role)) ||
      (view.name === 'examRun' && !canWriteExam(role))
    ) {
      setView({ name: 'browse' })
    }
  }

  if (!storageReady) {
    return (
      <main className="app">
        {updateBanner}
        <Brand />
        <section className="card">
          <h2 className="section-title">Wer übt heute?</h2>
          <p className="muted">Daten werden geladen …</p>
        </section>
        <LegalFooter version={updateCheck.currentVersion} />
      </main>
    )
  }

  if (!activeUser) {
    return (
      <main className="app">
        {updateBanner}
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
                    onClick={() => selectUser(u)}
                  >
                    {u}
                    <span className="user-list__role">
                      {roleLabel(getUserRole(u))}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="field">
            <span className="field__label">Neuen Benutzer anlegen</span>
            <input
              className="answer-input__field"
              type="text"
              placeholder="Vorname"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createUser()}
            />
          </div>
          <RoleOptions
            name="new-user-role"
            value={newRole}
            onSelect={pickNewRole}
          />
          {newRole && isTeacherRole(newRole) && (
            <TeacherCodeGate
              id="new-user-teacher-code"
              value={newTeacherCode}
              onChange={(next) => {
                setNewTeacherCode(next)
                setNewTeacherCodeError(null)
              }}
              error={newTeacherCodeError}
            />
          )}
          <div className="field">
            <button
              type="button"
              className="primary"
              disabled={!newName.trim() || !newRole}
              onClick={createUser}
            >
              Anlegen
            </button>
          </div>
        </section>
        <LegalFooter version={updateCheck.currentVersion} />
      </main>
    )
  }

  const activeLoaded =
    loaded.find((l) => l.moduleId === activeId) ?? loaded[0] ?? null
  const activeModule = activeLoaded
    ? getCurriculumModule(activeLoaded.moduleId)
    : undefined

  const trimmedQuery = query.trim()
  const searchResults = trimmedQuery ? searchTopics(query, loaded) : []
  const searchHints = trimmedQuery
    ? searchUnloadedHints(query, loaded.map((l) => l.moduleId))
    : []

  const openPractice = (
    topic: Topic,
    areaTitle: string,
    gradeTitle: string,
    returnTo?: TopTabId,
  ) => setView({ name: 'practice', topic, areaTitle, gradeTitle, returnTo })
  const openWorksheet = (topic: Topic, areaTitle: string, gradeTitle: string) =>
    setView({ name: 'worksheet', topic, areaTitle, gradeTitle })

  // "Ähnliche Aufgabe üben" from the exam evaluation: load the referenced grade
  // module on demand, locate the topic by id and open a fresh practice round.
  const openPracticeById = async (moduleId: string, topicId: string) => {
    const mod = getCurriculumModule(moduleId)
    if (!mod) return
    const grade = await mod.load()
    for (const area of grade.areas) {
      const topic = area.topics.find((t) => t.id === topicId)
      if (topic) {
        openPractice(topic, area.title, grade.title)
        return
      }
    }
  }

  return (
    <main className="app app--wide">
      {updateBanner}
      <header className="topbar">
        <Brand compact />
        <nav className="topbar__nav">
          {topTabsForView(view.name, userRole).map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`tab ${view.name === tab.id ? 'tab--active' : ''}`}
              onClick={() => setView({ name: tab.id })}
            >
              {tab.label}
            </button>
          ))}
          <div className="user-badge">
            <div className="user-badge__who">
              <span className="user-badge__name">{activeUser}</span>
              <span className="user-badge__class">
                {roleLabel(userRole)}
                {classLabel ? ` · ${classLabel}` : ''}
              </span>
            </div>
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
                Öffne Einstellungen und lade unter Lehrpläne eine Klasse, um
                mit dem Üben zu beginnen.
              </p>
              <button
                type="button"
                className="primary setup-cta"
                onClick={() =>
                  setView({ name: 'settings', section: 'curricula' })
                }
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

              <div className="topic-search">
                <input
                  className="topic-search__field"
                  type="search"
                  placeholder="Themen durchsuchen, z. B. „Fläche umrechnen“, „Pythagoras“, „Bruch“ …"
                  aria-label="Themen durchsuchen"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {trimmedQuery && (
                  <button
                    type="button"
                    className="link topic-search__clear"
                    onClick={() => setQuery('')}
                  >
                    Suche zurücksetzen
                  </button>
                )}
              </div>

              {trimmedQuery ? (
                <SearchResults
                  query={query}
                  results={searchResults}
                  hints={searchHints}
                  onPractice={openPractice}
                  onWorksheet={openWorksheet}
                  onGoToSetup={() =>
                    setView({ name: 'settings', section: 'curricula' })
                  }
                />
              ) : (
                <>
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
                      openPractice(topic, areaTitle, activeLoaded.grade.title)
                    }
                    onWorksheet={(topic, areaTitle) =>
                      openWorksheet(topic, areaTitle, activeLoaded.grade.title)
                    }
                  />
                </>
              )}
            </>
          )}
        </section>
      )}

      {view.name === 'settings' && (
        <Settings
          loadedIds={loaded.map((l) => l.moduleId)}
          onLoad={loadCurriculum}
          onRemove={removeCurriculum}
          section={view.section}
          onOpenSection={(id) => setView({ name: 'settings', section: id })}
          onBack={() => setView({ name: 'settings' })}
          user={activeUser}
          role={userRole}
          classLabel={classLabel}
          lanStatus={lanStatus}
          onChangeRole={changeRole}
          onSwitchUser={() => {
            setActiveStorageUser(null)
            setActiveUser(null)
            setClassLabel(null)
            setView({ name: 'browse' })
          }}
          onCheckUpdates={() => void updateCheck.checkNow()}
          manualCheckStatus={updateCheck.manualStatus}
          manualCheckError={updateCheck.manualError}
        />
      )}

      {view.name === 'challenge' && (
        <Challenge
          user={activeUser}
          role={userRole}
          loaded={loaded}
          onPractice={(topic, areaTitle, gradeTitle) =>
            openPractice(topic, areaTitle, gradeTitle, 'challenge')
          }
        />
      )}

      {view.name === 'practice' && (
        <PracticeSession
          topic={view.topic}
          areaTitle={view.areaTitle}
          user={activeUser}
          onExit={() =>
            setView({ name: view.returnTo === 'challenge' ? 'challenge' : 'browse' })
          }
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

      {view.name === 'examBuild' && (
        <ExamBuilder
          loaded={loaded}
          onExit={() => setView({ name: 'browse' })}
        />
      )}

      {view.name === 'examRun' && (
        <ExamRunner
          key={examCodeFromLink ?? 'manual'}
          user={activeUser}
          initialCode={examCodeFromLink ?? undefined}
          onExit={() => {
            setExamCodeFromLink(null)
            setView({ name: 'browse' })
          }}
          onPracticeTopic={openPracticeById}
        />
      )}

      {view.name === 'protocol' && (
        <Protocol user={activeUser} onExit={() => setView({ name: 'browse' })} />
      )}

      <LegalFooter version={updateCheck.currentVersion} />
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

