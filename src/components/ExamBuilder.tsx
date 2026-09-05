import { useMemo, useState, type MouseEvent } from 'react'
import { createRng } from '../lib/rng'
import type { Grade, Task, Topic } from '../curriculum/types'
import { encodeExam } from '../exam/examCode'
import { examCodeMailtoUrl, examCodeWhatsAppUrl } from '../exam/share'
import { openClassCodeShareUrl } from '../classCode/share'
import { CURRICULUM_VERSION } from '../curriculum/registry'
import type { ExamSpec, ExamTaskRef } from '../exam/types'

interface LoadedGrade {
  moduleId: string
  grade: Grade
}

interface Props {
  loaded: LoadedGrade[]
  onExit: () => void
}

/** Number of concrete task proposals offered per selected topic in step 2. */
const POOL_SIZE = 5

/** A single selectable topic, flattened out of the loaded grades. */
interface TopicEntry {
  key: string
  moduleId: string
  topicId: string
  gradeTitle: string
  areaTitle: string
  topic: Topic
}

const themeKey = (moduleId: string, topicId: string) => `${moduleId}::${topicId}`
const selKey = (moduleId: string, topicId: string, seed: number) =>
  `${moduleId}::${topicId}::${seed}`

const randomSeed = () => Math.floor(Math.random() * 0xffffffff) >>> 0

export function ExamBuilder({ loaded, onExit }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Flattened list of every topic across the loaded grades.
  const entries = useMemo<TopicEntry[]>(() => {
    const list: TopicEntry[] = []
    for (const { moduleId, grade } of loaded) {
      for (const area of grade.areas) {
        for (const topic of area.topics) {
          list.push({
            key: themeKey(moduleId, topic.id),
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

  // Step 1 — which topics feed the proposal pools.
  const [selectedThemes, setSelectedThemes] = useState<Set<string>>(new Set())
  // Step 2 — proposal seeds per topic, and the concrete selected tasks.
  const [pools, setPools] = useState<Record<string, number[]>>({})
  const [selections, setSelections] = useState<Record<string, number>>({})
  // Step 3 — exam title.
  const [title, setTitle] = useState('Übungsklausur')

  const toggleTheme = (key: string) =>
    setSelectedThemes((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  // Build proposal pools when advancing to step 2, keeping any pools/selections
  // of topics that are still selected and dropping the rest.
  const goToProposals = () => {
    setPools((prev) => {
      const next: Record<string, number[]> = {}
      for (const key of selectedThemes) {
        next[key] =
          prev[key] ?? Array.from({ length: POOL_SIZE }, () => randomSeed())
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
      [key]: Array.from({ length: POOL_SIZE }, () => randomSeed()),
    }))
    // Drop selections that belonged to this topic's previous proposals.
    setSelections((prev) => {
      const next: Record<string, number> = {}
      for (const [sk, punkte] of Object.entries(prev)) {
        if (sk.slice(0, sk.lastIndexOf('::')) !== key) next[sk] = punkte
      }
      return next
    })
  }

  const toggleSelection = (entry: TopicEntry, seed: number) => {
    const sk = selKey(entry.moduleId, entry.topicId, seed)
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

  // Assemble the exam spec + code once we reach step 3.
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
          <h2 className="section-title no-margin">Klausur erstellen</h2>
          <p className="muted small">
            Stelle eine Übungsklausur zusammen und teile den Klausurcode per
            E-Mail oder WhatsApp — ganz ohne Server.
          </p>
        </div>
        <button type="button" className="link" onClick={onExit}>
          Zurück
        </button>
      </div>

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
              if (!entry) return null
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
          title={title}
          onTitleChange={setTitle}
          code={code}
          count={selectedCount}
          totalPoints={totalPoints}
          copied={copied}
          onCopy={copyCode}
          onShareLink={onShareLink}
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

// --- Step 1: choose topics --------------------------------------------------

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
          {grade.areas.map((area) => (
            <fieldset key={area.id} className="exam-area">
              <legend className="exam-area__legend">{area.title}</legend>
              <div className="exam-area__topics">
                {area.topics.map((topic) => {
                  const key = themeKey(moduleId, topic.id)
                  return (
                    <label key={key} className="exam-check">
                      <input
                        type="checkbox"
                        checked={selected.has(key)}
                        onChange={() => onToggle(key)}
                      />
                      <span>{topic.title}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </div>
      ))}
    </div>
  )
}

// --- Step 2: pick concrete tasks -------------------------------------------

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
          const sk = selKey(entry.moduleId, entry.topicId, seed)
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

// --- Step 3: Klausurcode + Mail / WhatsApp ----------------------------------

function ExamStepCode({
  title,
  onTitleChange,
  code,
  count,
  totalPoints,
  copied,
  onCopy,
  onShareLink,
}: {
  title: string
  onTitleChange: (v: string) => void
  code: string
  count: number
  totalPoints: number
  copied: boolean
  onCopy: () => void
  onShareLink: (event: MouseEvent<HTMLAnchorElement>) => void
}) {
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
        Teile den Klausurcode per E-Mail oder WhatsApp. Schüler:innen öffnen die
        App, wählen „Klausur schreiben“ und geben den Code ein.
      </p>
    </div>
  )
}
