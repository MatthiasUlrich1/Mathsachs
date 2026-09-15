import { useMemo, useState, type MouseEvent } from 'react'
import { createRng } from '../lib/rng'
import type { Grade, Task, Topic } from '../curriculum/types'
import { encodeExam, decodeExam } from '../exam/examCode'
import {
  EXAM_POOL_SIZE,
  examSelKey,
  examThemeKey,
  hydrateExamBuilderFromSpec,
} from '../exam/examBuilderState'
import { examCodeMailtoUrl, examCodeWhatsAppUrl } from '../exam/share'
import { openClassCodeShareUrl } from '../classCode/share'
import {
  ClassApiError,
  createClassExam,
  updateClassExam,
} from '../classCode/api'
import { CURRICULUM_VERSION } from '../curriculum/registry'
import { refsForGradeModules } from '../curriculum/versionGate'
import type { ExamSpec, ExamTaskRef } from '../exam/types'
import type { StoredClassExam } from '../exam/classExamTypes'
import { canAssignClassExam } from '../lib/roles'
import {
  getClassCodeSettings,
  getCreatedClassExams,
  rememberCreatedClassExam,
} from '../lib/storage'
import { TeacherExtraBadge } from './TeacherExtraBadge'
import { TaskVisual } from './TaskMedia'
import { ClassExamManager } from './ClassExamManager'

interface LoadedGrade {
  moduleId: string
  grade: Grade
}

interface Props {
  loaded: LoadedGrade[]
  onExit: () => void
  /** Current user role — Lehrer get class assignment. */
  role?: string
}

/** A single selectable topic, flattened out of the loaded grades. */
interface TopicEntry {
  key: string
  moduleId: string
  topicId: string
  gradeTitle: string
  areaTitle: string
  topic: Topic
}

interface EditingExam {
  id: string
  hostCode: string
  className?: string
  createdAt: number
  solveCount?: number
  /** Original MSX1 — used to find sibling class assignments. */
  examCode: string
}

const randomSeed = () => Math.floor(Math.random() * 0xffffffff) >>> 0

export function ExamBuilder({ loaded, onExit, role }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const assignEnabled = canAssignClassExam(role)
  const [listRefresh, setListRefresh] = useState(0)
  const [editing, setEditing] = useState<EditingExam | null>(null)

  const entries = useMemo<TopicEntry[]>(() => {
    const list: TopicEntry[] = []
    for (const { moduleId, grade } of loaded) {
      for (const area of grade.areas) {
        for (const topic of area.topics) {
          if (topic.outlineOnly) continue
          list.push({
            key: examThemeKey(moduleId, topic.id),
            moduleId,
            topicId: topic.id,
            gradeTitle: grade.title,
            areaTitle: area.title,
            topic,
          })
        }
      }
    }
    return list
  }, [loaded])

  const entryByKey = useMemo(() => {
    const map = new Map<string, TopicEntry>()
    for (const e of entries) map.set(e.key, e)
    return map
  }, [entries])

  const [selectedThemes, setSelectedThemes] = useState<Set<string>>(new Set())
  const [pools, setPools] = useState<Record<string, number[]>>({})
  const [selections, setSelections] = useState<Record<string, number>>({})
  const [title, setTitle] = useState('Übungsklausur')

  const loadExamForEdit = (exam: StoredClassExam) => {
    const spec = decodeExam(exam.examCode)
    const hydrated = hydrateExamBuilderFromSpec(spec)
    const known = hydrated.selectedThemes.filter((k) => entryByKey.has(k))
    setSelectedThemes(new Set(known.length ? known : hydrated.selectedThemes))
    setPools(hydrated.pools)
    setSelections(hydrated.selections)
    setTitle(hydrated.title)
    setEditing({
      id: exam.id,
      hostCode: exam.hostCode,
      className: exam.className,
      createdAt: exam.createdAt,
      solveCount: exam.solveCount,
      examCode: exam.examCode,
    })
    setStep(2)
  }

  const clearEditing = () => setEditing(null)

  const toggleTheme = (key: string) =>
    setSelectedThemes((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const goToProposals = () => {
    setPools((prev) => {
      const next: Record<string, number[]> = {}
      for (const key of selectedThemes) {
        next[key] =
          prev[key] ?? Array.from({ length: EXAM_POOL_SIZE }, () => randomSeed())
      }
      return next
    })
    setSelections((prev) => {
      const next: Record<string, number> = {}
      for (const [key, punkte] of Object.entries(prev)) {
        const tKey = key.slice(0, key.lastIndexOf('::'))
        if (selectedThemes.has(tKey)) next[key] = punkte
      }
      return next
    })
    setStep(2)
  }

  const refreshPool = (key: string) => {
    setPools((prev) => ({
      ...prev,
      [key]: Array.from({ length: EXAM_POOL_SIZE }, () => randomSeed()),
    }))
    setSelections((prev) => {
      const next: Record<string, number> = {}
      for (const [sk, punkte] of Object.entries(prev)) {
        if (sk.slice(0, sk.lastIndexOf('::')) !== key) next[sk] = punkte
      }
      return next
    })
  }

  const toggleSelection = (entry: TopicEntry, seed: number) => {
    const sk = examSelKey(entry.moduleId, entry.topicId, seed)
    setSelections((prev) => {
      const next = { ...prev }
      if (sk in next) delete next[sk]
      else next[sk] = entry.topic.pointsPerTask
      return next
    })
  }

  const setPunkte = (sk: string, punkte: number) =>
    setSelections((prev) => ({ ...prev, [sk]: punkte }))

  const selectedCount = Object.keys(selections).length
  const totalPoints = Object.values(selections).reduce((s, p) => s + p, 0)

  const spec = useMemo<ExamSpec>(() => {
    const aufgaben: ExamTaskRef[] = Object.entries(selections).map(
      ([sk, punkte]) => {
        const sep = sk.lastIndexOf('::')
        const tKey = sk.slice(0, sep)
        const seed = Number(sk.slice(sep + 2))
        const [modul, thema] = tKey.split('::')
        return { modul, thema, seed, punkte }
      },
    )
    return {
      schema: 'A',
      curriculumVersion: CURRICULUM_VERSION,
      curriculumRefs: refsForGradeModules(aufgaben.map((item) => item.modul)),
      titel: title.trim() || 'Übungsklausur',
      aufgaben,
    }
  }, [selections, title])

  const code = useMemo(() => encodeExam(spec), [spec])

  const [copied, setCopied] = useState(false)
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const onShareLink = (event: MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute('href')
    if (!href) return
    if (
      window.mathsachs?.openExternal &&
      (/^https?:\/\//i.test(href) || /^mailto:/i.test(href))
    ) {
      event.preventDefault()
      openClassCodeShareUrl(href)
    }
  }

  if (loaded.length === 0) {
    return (
      <section className="card">
        <div className="session__head">
          <h2 className="section-title no-margin">Klausur erstellen</h2>
          <button type="button" className="link" onClick={onExit}>
            Zurück
          </button>
        </div>
        <p className="notice notice--warn">
          Es ist kein Lehrplan geladen. Lade zuerst unter Einstellungen →
          Lehrpläne eine Klasse, um Themen für eine Klausur auswählen zu können.
        </p>
      </section>
    )
  }

  return (
    <section className="card">
      <div className="session__head">
        <div>
          <h2 className="section-title no-margin">
            {editing ? 'Klausur bearbeiten' : 'Klausur erstellen'}
          </h2>
          <p className="muted small">
            {editing
              ? 'Änderungen speichern die Klausur für dieselbe Klasse (gleicher Eintrag). Schüler sehen den aktualisierten Code.'
              : assignEnabled
                ? 'Stelle eine Übungsklausur zusammen, teile den Code oder ordne sie einer Klasse zu.'
                : 'Stelle eine Übungsklausur zusammen und teile den Klausurcode per E-Mail oder WhatsApp — ganz ohne Server.'}
          </p>
        </div>
        <button type="button" className="link" onClick={onExit}>
          Zurück
        </button>
      </div>

      {assignEnabled && (
        <ClassExamManager refreshKey={listRefresh} onEdit={loadExamForEdit} />
      )}

      {editing && (
        <p className="notice">
          Bearbeite „{title}“.{' '}
          <button type="button" className="link" onClick={clearEditing}>
            Bearbeitung abbrechen (neue Klausur)
          </button>
        </p>
      )}

      <ol className="exam-steps">
        {(['Themen', 'Aufgaben', 'Code'] as const).map((label, i) => {
          const n = (i + 1) as 1 | 2 | 3
          return (
            <li
              key={label}
              className={`exam-step ${step === n ? 'exam-step--active' : ''} ${
                step > n ? 'exam-step--done' : ''
              }`}
            >
              <span className="exam-step__num">{n}</span>
              {label}
            </li>
          )
        })}
      </ol>

      {step === 1 && (
        <ExamStepThemes
          loaded={loaded}
          selected={selectedThemes}
          onToggle={toggleTheme}
          onClear={() => setSelectedThemes(new Set())}
        />
      )}

      {step === 2 && (
        <div className="exam-proposals">
          {selectedThemes.size === 0 ? (
            <p className="muted">Keine Themen ausgewählt.</p>
          ) : (
            [...selectedThemes].map((key) => {
              const entry = entryByKey.get(key)
              if (!entry) {
                return (
                  <p key={key} className="notice notice--warn">
                    Thema „{key}“ ist im geladenen Lehrplan nicht verfügbar.
                  </p>
                )
              }
              return (
                <ProposalPool
                  key={key}
                  entry={entry}
                  seeds={pools[key] ?? []}
                  selections={selections}
                  onToggle={toggleSelection}
                  onSetPunkte={setPunkte}
                  onRefresh={() => refreshPool(key)}
                />
              )
            })
          )}
        </div>
      )}

      {step === 3 && (
        <ExamStepCode
          key={editing ? `edit-${editing.id}` : 'new'}
          title={title}
          onTitleChange={setTitle}
          code={code}
          count={selectedCount}
          totalPoints={totalPoints}
          copied={copied}
          onCopy={copyCode}
          onShareLink={onShareLink}
          assignEnabled={assignEnabled}
          editing={editing}
          onAssigned={() => setListRefresh((n) => n + 1)}
          onSavedEdit={() => {
            setListRefresh((n) => n + 1)
            setEditing(null)
            setStep(1)
            setSelectedThemes(new Set())
            setPools({})
            setSelections({})
            setTitle('Übungsklausur')
          }}
        />
      )}

      <div className="exam-nav">
        {step > 1 && (
          <button
            type="button"
            className="ghost"
            onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
          >
            Zurück
          </button>
        )}
        {step === 1 && (
          <button
            type="button"
            className="primary"
            disabled={selectedThemes.size === 0}
            onClick={goToProposals}
          >
            Weiter zu den Aufgaben
          </button>
        )}
        {step === 2 && (
          <button
            type="button"
            className="primary"
            disabled={selectedCount === 0}
            onClick={() => setStep(3)}
          >
            Weiter zum Code ({selectedCount})
          </button>
        )}
      </div>
    </section>
  )
}

function ExamStepThemes({
  loaded,
  selected,
  onToggle,
  onClear,
}: {
  loaded: LoadedGrade[]
  selected: Set<string>
  onToggle: (key: string) => void
  onClear: () => void
}) {
  return (
    <div className="exam-themes">
      <div className="exam-themes__head">
        <p className="muted small">
          Wähle die Themen, aus denen Aufgaben vorgeschlagen werden sollen.
        </p>
        {selected.size > 0 && (
          <button type="button" className="link" onClick={onClear}>
            Auswahl zurücksetzen ({selected.size})
          </button>
        )}
      </div>
      {loaded.map(({ moduleId, grade }) => (
        <div key={moduleId} className="exam-grade">
          <h3 className="exam-grade__title">{grade.title}</h3>
          {grade.areas.map((area) => {
            const playable = area.topics.filter((topic) => !topic.outlineOnly)
            if (playable.length === 0) return null
            return (
              <fieldset key={area.id} className="exam-area">
                <legend className="exam-area__legend">{area.title}</legend>
                <div className="exam-area__topics">
                  {playable.map((topic) => {
                    const key = examThemeKey(moduleId, topic.id)
                    return (
                      <label key={key} className="exam-check">
                        <input
                          type="checkbox"
                          checked={selected.has(key)}
                          onChange={() => onToggle(key)}
                        />
                        <span>
                          {topic.title}
                          <TeacherExtraBadge source={topic.source} />
                        </span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function ProposalPool({
  entry,
  seeds,
  selections,
  onToggle,
  onSetPunkte,
  onRefresh,
}: {
  entry: TopicEntry
  seeds: number[]
  selections: Record<string, number>
  onToggle: (entry: TopicEntry, seed: number) => void
  onSetPunkte: (sk: string, punkte: number) => void
  onRefresh: () => void
}) {
  const proposals = useMemo<{ seed: number; task: Task }[]>(
    () => seeds.map((seed) => ({ seed, task: entry.topic.generate(createRng(seed)) })),
    [seeds, entry.topic],
  )

  return (
    <div className="exam-pool">
      <div className="exam-pool__head">
        <div>
          <h3 className="exam-pool__title">{entry.topic.title}</h3>
          <p className="muted small">
            {entry.gradeTitle} · {entry.areaTitle}
          </p>
        </div>
        <button type="button" className="ghost" onClick={onRefresh}>
          Neue Vorschläge
        </button>
      </div>
      <ul className="exam-pool__list">
        {proposals.map(({ seed, task }) => {
          const sk = examSelKey(entry.moduleId, entry.topicId, seed)
          const checked = sk in selections
          return (
            <li key={seed} className={`exam-task ${checked ? 'exam-task--on' : ''}`}>
              <label className="exam-task__main">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(entry, seed)}
                />
                <span className="exam-task__body">
                  <span className="exam-task__q">{task.question}</span>
                  <TaskVisual html={task.visualContent} />
                  <span className="exam-task__sol">
                    Lösung: {task.solution}
                    {task.unit ? ` ${task.unit}` : ''}
                  </span>
                </span>
              </label>
              {checked && (
                <label className="exam-task__points">
                  Punkte
                  <input
                    type="number"
                    min={1}
                    value={selections[sk]}
                    onChange={(e) =>
                      onSetPunkte(sk, Math.max(1, Number(e.target.value) || 1))
                    }
                  />
                </label>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function ExamStepCode({
  title,
  onTitleChange,
  code,
  count,
  totalPoints,
  copied,
  onCopy,
  onShareLink,
  assignEnabled,
  editing,
  onAssigned,
  onSavedEdit,
}: {
  title: string
  onTitleChange: (v: string) => void
  code: string
  count: number
  totalPoints: number
  copied: boolean
  onCopy: () => void
  onShareLink: (event: MouseEvent<HTMLAnchorElement>) => void
  assignEnabled: boolean
  editing: EditingExam | null
  onAssigned: () => void
  onSavedEdit: () => void
}) {
  const createdClasses = getClassCodeSettings().created
  const [classCode, setClassCode] = useState(
    editing?.hostCode ?? createdClasses[0]?.code ?? '',
  )
  const [assignBusy, setAssignBusy] = useState(false)
  const [assignNotice, setAssignNotice] = useState<string | null>(null)

  if (count === 0) {
    return (
      <p className="notice notice--warn">
        Es wurde noch keine Aufgabe ausgewählt. Gehe zurück und wähle mindestens
        eine Aufgabe aus.
      </p>
    )
  }
  return (
    <div className="exam-code">
      <div className="field">
        <span className="field__label">Titel der Klausur</span>
        <input
          className="answer-input__field"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="z. B. Klassenarbeit Brüche"
        />
      </div>

      <div className="exam-summary">
        <div className="exam-summary__item">
          <span className="big">{count}</span>
          <span className="muted small">Aufgaben</span>
        </div>
        <div className="exam-summary__item">
          <span className="big">{totalPoints}</span>
          <span className="muted small">Punkte gesamt</span>
        </div>
      </div>

      {assignEnabled && editing && (
        <div className="field exam-assign">
          <span className="field__label">Änderungen speichern</span>
          <p className="muted small">
            Speichert Titel und Aufgaben für alle Klassen, denen diese Klausur
            zugeordnet ist. Weitere Klassen zuordnen oder entfernen kannst du in
            der Liste „Meine Klassenklausuren“.
          </p>
          <button
            type="button"
            className="primary"
            disabled={assignBusy}
            onClick={() => {
              setAssignBusy(true)
              setAssignNotice(null)
              const siblings = getCreatedClassExams().filter(
                (row) =>
                  row.examCode === editing.examCode || row.id === editing.id,
              )
              const targets = siblings.length > 0 ? siblings : [
                {
                  id: editing.id,
                  hostCode: editing.hostCode,
                  className: editing.className,
                  name: title.trim() || 'Übungsklausur',
                  examCode: editing.examCode,
                  createdAt: editing.createdAt,
                  solveCount: editing.solveCount,
                },
              ]
              void (async () => {
                try {
                  let lastName = title.trim() || 'Übungsklausur'
                  for (const row of targets) {
                    const updated = await updateClassExam(row.id, {
                      classCode: row.hostCode,
                      name: title.trim() || 'Übungsklausur',
                      examCode: code,
                      taskCount: count,
                      totalPoints,
                    })
                    lastName = updated.name
                    rememberCreatedClassExam({
                      id: updated.id,
                      hostCode: row.hostCode,
                      className:
                        updated.className ??
                        row.className ??
                        createdClasses.find((c) => c.code === row.hostCode)?.name,
                      name: updated.name,
                      examCode: updated.examCode,
                      createdAt: row.createdAt,
                      owned: true,
                      taskCount: updated.taskCount ?? count,
                      totalPoints: updated.totalPoints ?? totalPoints,
                      solveCount: updated.solveCount ?? row.solveCount,
                    })
                  }
                  setAssignNotice(
                    targets.length > 1
                      ? `Klausur „${lastName}“ in ${targets.length} Klassen gespeichert.`
                      : `Klausur „${lastName}“ gespeichert.`,
                  )
                  onSavedEdit()
                } catch (e: unknown) {
                  setAssignNotice(
                    e instanceof ClassApiError
                      ? e.message
                      : 'Speichern fehlgeschlagen. Prüfe die Internetverbindung.',
                  )
                } finally {
                  setAssignBusy(false)
                }
              })()
            }}
          >
            {assignBusy ? 'Wird gespeichert …' : 'Änderungen speichern'}
          </button>
          {assignNotice && <p className="muted small">{assignNotice}</p>}
        </div>
      )}

      {assignEnabled && !editing && (
        <div className="field exam-assign">
          <span className="field__label">Klasse zuordnen (Lehrer)</span>
          {createdClasses.length === 0 ? (
            <p className="muted small">
              Lege zuerst unter Einstellungen → Klasse einen Klassencode an.
            </p>
          ) : (
            <>
              <select
                className="answer-input__field"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
              >
                {createdClasses.map((row) => (
                  <option key={row.code} value={row.code}>
                    {row.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="primary"
                disabled={assignBusy || !classCode}
                onClick={() => {
                  setAssignBusy(true)
                  setAssignNotice(null)
                  void createClassExam({
                    classCode,
                    name: title.trim() || 'Übungsklausur',
                    examCode: code,
                    taskCount: count,
                    totalPoints,
                  })
                    .then((created) => {
                      rememberCreatedClassExam({
                        id: created.id,
                        hostCode: classCode,
                        className:
                          created.className ??
                          createdClasses.find((c) => c.code === classCode)?.name,
                        name: created.name,
                        examCode: created.examCode,
                        createdAt: created.createdAt,
                        owned: true,
                        taskCount: created.taskCount ?? count,
                        totalPoints: created.totalPoints ?? totalPoints,
                        solveCount: created.solveCount ?? 0,
                      })
                      setAssignNotice(
                        `Klausur „${created.name}“ der Klasse zugeordnet.`,
                      )
                      onAssigned()
                    })
                    .catch((e: unknown) => {
                      setAssignNotice(
                        e instanceof ClassApiError
                          ? e.message
                          : 'Zuordnung fehlgeschlagen. Prüfe die Internetverbindung.',
                      )
                    })
                    .finally(() => setAssignBusy(false))
                }}
              >
                {assignBusy ? 'Wird zugeordnet …' : 'Der Klasse zuordnen'}
              </button>
              {assignNotice && <p className="muted small">{assignNotice}</p>}
            </>
          )}
        </div>
      )}

      <div className="field">
        <span className="field__label">Klausurcode</span>
        <textarea className="exam-code__field" readOnly rows={3} value={code} />
        <div className="exam-code__share">
          <button type="button" className="ghost exam-copy" onClick={onCopy}>
            {copied ? 'Kopiert ✓' : 'Code kopieren'}
          </button>
          <a
            className="link"
            href={examCodeWhatsAppUrl(code, title)}
            target="_blank"
            rel="noopener"
            onClick={onShareLink}
          >
            WhatsApp
          </a>
          <a
            className="link"
            href={examCodeMailtoUrl(code, title)}
            target="_blank"
            rel="noopener"
            onClick={onShareLink}
          >
            Mail
          </a>
        </div>
      </div>

      <p className="muted small">
        Schüler:innen fügen den Code unter „Klausur schreiben“ ein — oder du
        ordnest die Klausur einer Klasse zu.
      </p>
    </div>
  )
}
