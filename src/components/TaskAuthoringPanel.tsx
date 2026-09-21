import { useEffect, useMemo, useState } from 'react'
import {
  AUTHORING_ELEMENT_OPTIONS,
  AUTHORING_NEW_TOPIC,
  createEmptyDraft,
  deleteDraft,
  draftToTask,
  exportGeneratorSnippet,
  loadAuthoringAreas,
  loadAuthoringPacks,
  loadDrafts,
  type AuthoringAreaOption,
  type AuthoringElementType,
  type DraftAuthoringTask,
  upsertDraft,
  validateDraft,
} from '../lib/taskAuthoring'
import {
  defaultSliderParamsForPreview,
  FUNCTION_PREVIEW_OPTIONS,
  type FunctionPreviewKind,
} from '../lib/functionGraph'
import {
  emptyCoordinateScene,
  parseCoordinateScene,
  type CoordinateScene,
} from '../lib/coordinateScene'
import { CoordinateGraphEditor } from './CoordinateGraphEditor'
import type { TaskRequestPackOption } from '../legal/taskRequest'
import type { UserRole } from '../lib/roles'
import { initTaskInput, TaskInteractive, TaskVisual } from './TaskMedia'
import { TaskAuthoringSvgPicker } from './TaskAuthoringSvgPicker'
import { CoordinateClick } from './CoordinateClick'
import type { UserInput } from '../curriculum/types'

interface Props {
  role: UserRole
}

function propStr(draft: DraftAuthoringTask, key: string, fallback = ''): string {
  const v = draft.element.props[key]
  if (Array.isArray(v)) return v.join('\n')
  return v == null ? fallback : String(v)
}

function setProp(
  draft: DraftAuthoringTask,
  key: string,
  value: unknown,
): DraftAuthoringTask {
  return {
    ...draft,
    element: {
      ...draft.element,
      props: { ...draft.element.props, [key]: value },
    },
  }
}

function defaultPropsFor(type: AuthoringElementType): Record<string, unknown> {
  switch (type) {
    case 'value':
      return { value: 42, answerKind: 'integer' }
    case 'text':
      return { accepted: 'ja\nnein' }
    case 'fraction':
      return { num: 1, den: 2 }
    case 'choicePick':
      return { choices: 'A\nB\nC', correct: 'A' }
    case 'multiSelect':
      return { choices: 'A\nB\nC', correct: 'A\nB' }
    case 'numberLine':
    case 'numberLineThermometer':
      return { min: 0, max: 10, step: 1, value: 5 }
    case 'dragDropSort':
      return { items: 'Neumond\nzunehmender Mond\nVollmond\nabnehmender Mond', correctOrder: '0,1,2,3' }
    case 'dragDropSlots':
      return { items: 'm\n·\na\n=\nF', correctSlots: '0,1,2,3,4' }
    case 'digitGrid':
      return { a: 23, b: 45, operator: '+', value: 68 }
    case 'coordinateClick':
      return {
        pointCount: 1,
        points: [{ x: 2, y: 3 }],
        x: 2,
        y: 3,
      }
    case 'coordinateDraw':
      return {
        solutionScene: {
          xRange: [-5, 5],
          yRange: [-5, 5],
          snap: 'half',
          objects: [
            {
              id: 'sol-line',
              kind: 'line',
              x1: 0,
              y1: 0,
              x2: 1,
              y2: 1,
            },
          ],
        },
      }
    case 'paramSlider':
      return {
        preview: 'linear',
        sliders: [
          { id: 'm', label: 'm', min: -5, max: 5, step: 1, correct: 1 },
          { id: 'n', label: 'n', min: -5, max: 5, step: 1, correct: 0 },
        ],
      }
    default:
      return {}
  }
}

/** Authoring UI: create/edit drafts, preview, save, submit for review. */
export function TaskAuthoringPanel({ role }: Props) {
  const authorRole: 'lehrer' | 'entwickler' =
    role === 'lehrer' ? 'lehrer' : 'entwickler'
  const [drafts, setDrafts] = useState<DraftAuthoringTask[]>(() => loadDrafts())
  const [draft, setDraft] = useState<DraftAuthoringTask>(() =>
    createEmptyDraft(authorRole),
  )
  const [message, setMessage] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [previewInput, setPreviewInput] = useState<UserInput | null>(null)
  const [checkResult, setCheckResult] = useState<boolean | null>(null)

  const previewTask = useMemo(() => {
    try {
      if (validateDraft(draft).length) return null
      return draftToTask(draft)
    } catch {
      return null
    }
  }, [draft])

  useEffect(() => {
    if (!previewTask) {
      setPreviewInput(null)
      setCheckResult(null)
      return
    }
    setPreviewInput(initTaskInput(previewTask))
    setCheckResult(null)
  }, [previewTask])

  const refresh = () => setDrafts(loadDrafts())

  const save = (status?: DraftAuthoringTask['status']) => {
    const errs = validateDraft(draft)
    setErrors(errs)
    if (errs.length) {
      setMessage(null)
      return
    }
    const next = {
      ...draft,
      status: status ?? draft.status,
      authorRole,
    }
    setDrafts(upsertDraft(next))
    setDraft(next)
    setMessage(status === 'submitted' ? 'Zur Prüfung eingereicht.' : 'Entwurf gespeichert.')
  }

  const loadOne = (id: string) => {
    const found = loadDrafts().find((d) => d.id === id)
    if (found) {
      setDraft(found)
      setErrors([])
      setMessage(null)
    }
  }

  return (
    <section className="card task-authoring" aria-label="Aufgabengenerator">
      <h2 className="section-title no-margin">Aufgabengenerator</h2>
      <p className="muted small">
        Entwurf lokal speichern und zur Prüfung einreichen. Offizielle Lehrplan-Übernahme
        bleibt manuell (Export-Snippet).
      </p>

      <div className="task-authoring__list">
        <h3 className="task-authoring__sub">Meine Entwürfe</h3>
        {drafts.length === 0 && <p className="muted small">Noch keine Entwürfe.</p>}
        <ul className="task-authoring__drafts">
          {drafts.map((d) => (
            <li key={d.id}>
              <button type="button" className="link" onClick={() => loadOne(d.id)}>
                {(d.task.question || d.target.topicTitle || d.id).slice(0, 48)}
              </button>
              <span className="muted small"> · {d.status}</span>
              <button
                type="button"
                className="link"
                onClick={() => {
                  setDrafts(deleteDraft(d.id))
                  refresh()
                }}
              >
                {' '}
                löschen
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setDraft(createEmptyDraft(authorRole))
            setErrors([])
            setMessage(null)
          }}
        >
          Neuer Entwurf
        </button>
      </div>

      <h3 className="task-authoring__sub">Ziel</h3>
      <TargetCascadingSelects draft={draft} setDraft={setDraft} />

      <h3 className="task-authoring__sub">Interaktion</h3>
      <div className="field">
        <label className="field__label" htmlFor="ta-element">
          Typ
        </label>
        <select
          id="ta-element"
          value={draft.element.type}
          onChange={(e) => {
            const type = e.target.value as AuthoringElementType
            setDraft({
              ...draft,
              element: { type, props: defaultPropsFor(type) },
            })
          }}
        >
          {AUTHORING_ELEMENT_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <ElementPropsForm draft={draft} setDraft={setDraft} />

      <h3 className="task-authoring__sub">Anzeige</h3>
      <div className="task-authoring__checks">
        {(
          [
            ['showUnit', 'Einheit'],
            ['showVisual', 'Visual'],
            ['showSolutionVisual', 'Lösungs-Visual'],
            ['showExplanation', 'Erklärung'],
            ['showHint', 'Hinweis'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="task-authoring-svg__mode">
            <input
              type="checkbox"
              checked={draft.display[key]}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  display: { ...draft.display, [key]: e.target.checked },
                })
              }
            />
            {label}
          </label>
        ))}
      </div>

      <h3 className="task-authoring__sub">Aufgabe</h3>
      <div className="field">
        <label className="field__label" htmlFor="ta-q">
          Frage
        </label>
        <textarea
          id="ta-q"
          rows={2}
          value={draft.task.question}
          onChange={(e) =>
            setDraft({ ...draft, task: { ...draft.task, question: e.target.value } })
          }
        />
      </div>
      {draft.display.showUnit && (
        <div className="field">
          <label className="field__label" htmlFor="ta-unit">
            Einheit
          </label>
          <input
            id="ta-unit"
            value={draft.task.unit}
            onChange={(e) =>
              setDraft({ ...draft, task: { ...draft.task, unit: e.target.value } })
            }
          />
        </div>
      )}
      <div className="field">
        <label className="field__label" htmlFor="ta-sol">
          Lösung (Anzeige)
        </label>
        <input
          id="ta-sol"
          value={draft.task.solution}
          onChange={(e) =>
            setDraft({ ...draft, task: { ...draft.task, solution: e.target.value } })
          }
        />
      </div>
      {draft.display.showExplanation && (
        <div className="field">
          <label className="field__label" htmlFor="ta-expl">
            Erklärung
          </label>
          <textarea
            id="ta-expl"
            rows={3}
            value={draft.task.explanation}
            onChange={(e) =>
              setDraft({
                ...draft,
                task: { ...draft.task, explanation: e.target.value },
              })
            }
          />
        </div>
      )}
      {draft.display.showHint && (
        <div className="field">
          <label className="field__label" htmlFor="ta-hint">
            Hinweis
          </label>
          <input
            id="ta-hint"
            value={draft.task.hint}
            onChange={(e) =>
              setDraft({ ...draft, task: { ...draft.task, hint: e.target.value } })
            }
          />
        </div>
      )}

      <TaskAuthoringSvgPicker
        label="Visual"
        enabled={draft.display.showVisual}
        value={draft.visual}
        onChange={(visual) => setDraft({ ...draft, visual })}
      />
      <TaskAuthoringSvgPicker
        label="Lösungs-Visual"
        enabled={draft.display.showSolutionVisual}
        value={draft.solutionVisual}
        onChange={(solutionVisual) => setDraft({ ...draft, solutionVisual })}
      />

      <h3 className="task-authoring__sub">Vorschau</h3>
      {previewTask && previewInput ? (
        <div className="task-authoring__preview">
          <p>
            <strong>{previewTask.question}</strong>
          </p>
          <TaskVisual html={previewTask.visualContent} />
          <TaskInteractive
            task={previewTask}
            value={previewInput}
            onChange={setPreviewInput}
          />
          <button
            type="button"
            className="btn"
            onClick={() => setCheckResult(previewTask.check(previewInput))}
          >
            Antwort prüfen (Vorschau)
          </button>
          <button
            type="button"
            className="link"
            onClick={() => {
              setPreviewInput(previewTask.sampleAnswer)
              setCheckResult(previewTask.check(previewTask.sampleAnswer))
            }}
          >
            Musterlösung laden
          </button>
          {checkResult !== null && (
            <p className={checkResult ? 'ok' : 'error'}>
              {checkResult ? 'Richtig' : 'Noch nicht richtig'}
            </p>
          )}
        </div>
      ) : (
        <p className="muted small">
          Vorschau erscheint, wenn der Entwurf gültig ist (siehe Fehlermeldungen).
        </p>
      )}

      {errors.length > 0 && (
        <ul className="task-authoring__errors">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      {message && <p className="muted small">{message}</p>}

      <div className="task-authoring__actions">
        <button type="button" className="btn" onClick={() => save('draft')}>
          Entwurf speichern
        </button>
        <button type="button" className="btn primary" onClick={() => save('submitted')}>
          Zur Prüfung einreichen
        </button>
        {draft.status === 'approved' && (
          <button
            type="button"
            className="btn"
            onClick={() => {
              const snip = exportGeneratorSnippet(draft)
              void navigator.clipboard?.writeText(snip)
              setMessage('TS-Snippet in die Zwischenablage kopiert.')
            }}
          >
            Code aus dem Generator (kopieren)
          </button>
        )}
      </div>
    </section>
  )
}

function TargetCascadingSelects({
  draft,
  setDraft,
}: {
  draft: DraftAuthoringTask
  setDraft: (d: DraftAuthoringTask) => void
}) {
  const [packs, setPacks] = useState<TaskRequestPackOption[]>([])
  const [packsLoading, setPacksLoading] = useState(true)
  const [areas, setAreas] = useState<AuthoringAreaOption[]>([])
  const [areasLoading, setAreasLoading] = useState(false)
  const [topicChoice, setTopicChoice] = useState(() =>
    draft.target.topicId ? draft.target.topicId : AUTHORING_NEW_TOPIC,
  )

  useEffect(() => {
    let cancelled = false
    setPacksLoading(true)
    void loadAuthoringPacks()
      .then((next) => {
        if (cancelled) return
        setPacks(next)
        setPacksLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setPacks([])
        setPacksLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const selectedPack = packs.find((p) => p.id === draft.target.packId)
  const grades = selectedPack?.grades ?? []

  useEffect(() => {
    if (!draft.target.packId || !draft.target.gradeId) {
      setAreas([])
      setAreasLoading(false)
      return
    }
    let cancelled = false
    setAreasLoading(true)
    void loadAuthoringAreas(draft.target.packId, draft.target.gradeId)
      .then((next) => {
        if (cancelled) return
        setAreas(next)
        setAreasLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setAreas([])
        setAreasLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [draft.target.packId, draft.target.gradeId])

  const selectedArea = areas.find((a) => a.id === draft.target.areaId)
  const topics = selectedArea?.topics ?? []
  const gradeDisabled = !draft.target.packId || packsLoading || grades.length === 0
  const areaDisabled = !draft.target.gradeId || areasLoading || areas.length === 0
  const topicDisabled = !draft.target.areaId || topics.length === 0
  const isNewTopic = topicChoice === AUTHORING_NEW_TOPIC || !draft.target.topicId

  return (
    <div className="task-authoring__target">
      <div className="field">
        <label className="field__label" htmlFor="ta-pack">
          Lehrplan
        </label>
        <select
          id="ta-pack"
          className="answer-input__field"
          value={draft.target.packId}
          disabled={packsLoading || packs.length === 0}
          onChange={(e) => {
            setDraft({
              ...draft,
              target: {
                ...draft.target,
                packId: e.target.value,
                gradeId: '',
                areaId: '',
                topicId: '',
                topicTitle: '',
              },
            })
            setTopicChoice(AUTHORING_NEW_TOPIC)
          }}
        >
          <option value="">
            {packsLoading ? 'Lehrpläne werden geladen …' : 'Lehrplan wählen'}
          </option>
          {packs.map((pack) => (
            <option key={pack.id} value={pack.id}>
              {pack.title}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="ta-grade">
          Klassenstufe
        </label>
        <select
          id="ta-grade"
          className="answer-input__field"
          value={draft.target.gradeId}
          disabled={gradeDisabled}
          onChange={(e) => {
            setDraft({
              ...draft,
              target: {
                ...draft.target,
                gradeId: e.target.value,
                areaId: '',
                topicId: '',
                topicTitle: '',
              },
            })
            setTopicChoice(AUTHORING_NEW_TOPIC)
          }}
        >
          <option value="">
            {!draft.target.packId ? 'Zuerst Lehrplan wählen' : 'Klassenstufe wählen'}
          </option>
          {grades.map((g) => (
            <option key={g.id} value={g.id}>
              {g.gradeTitle}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="ta-area">
          Lernbereich
        </label>
        <select
          id="ta-area"
          className="answer-input__field"
          value={draft.target.areaId}
          disabled={areaDisabled}
          onChange={(e) => {
            setDraft({
              ...draft,
              target: {
                ...draft.target,
                areaId: e.target.value,
                topicId: '',
                topicTitle: '',
              },
            })
            setTopicChoice(AUTHORING_NEW_TOPIC)
          }}
        >
          <option value="">
            {!draft.target.gradeId
              ? 'Zuerst Klassenstufe wählen'
              : areasLoading
                ? 'Lernbereiche werden geladen …'
                : 'Lernbereich wählen'}
          </option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="ta-topic">
          Thema
        </label>
        <select
          id="ta-topic"
          className="answer-input__field"
          value={isNewTopic ? AUTHORING_NEW_TOPIC : draft.target.topicId}
          disabled={!draft.target.areaId}
          onChange={(e) => {
            const v = e.target.value
            setTopicChoice(v)
            if (v === AUTHORING_NEW_TOPIC) {
              setDraft({
                ...draft,
                target: { ...draft.target, topicId: '', topicTitle: '' },
              })
              return
            }
            const topic = topics.find((t) => t.id === v)
            setDraft({
              ...draft,
              target: {
                ...draft.target,
                topicId: v,
                topicTitle: topic?.title ?? '',
              },
            })
          }}
        >
          <option value={AUTHORING_NEW_TOPIC}>
            {topicDisabled && !draft.target.areaId
              ? 'Zuerst Lernbereich wählen'
              : '— Neues Thema —'}
          </option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      {isNewTopic && (
        <div className="field">
          <label className="field__label" htmlFor="ta-topic-title">
            Titel für neues Thema
          </label>
          <input
            id="ta-topic-title"
            className="answer-input__field"
            value={draft.target.topicTitle}
            placeholder="z. B. Mondphasen sortieren"
            onChange={(e) =>
              setDraft({
                ...draft,
                target: { ...draft.target, topicId: '', topicTitle: e.target.value },
              })
            }
          />
        </div>
      )}

      <p className="muted small">
        Pack- und Themen-IDs werden intern gesetzt und erscheinen erst beim Code-Export.
      </p>
    </div>
  )
}

function ElementPropsForm({
  draft,
  setDraft,
}: {
  draft: DraftAuthoringTask
  setDraft: (d: DraftAuthoringTask) => void
}) {
  const type = draft.element.type
  const field = (key: string, label: string, multiline = false) => (
    <div className="field" key={key}>
      <label className="field__label" htmlFor={`prop-${key}`}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={`prop-${key}`}
          rows={3}
          value={propStr(draft, key)}
          onChange={(e) => setDraft(setProp(draft, key, e.target.value))}
        />
      ) : (
        <input
          id={`prop-${key}`}
          value={propStr(draft, key)}
          onChange={(e) => setDraft(setProp(draft, key, e.target.value))}
        />
      )}
    </div>
  )

  switch (type) {
    case 'value':
      return (
        <>
          {field('value', 'Richtiger Wert')}
          <div className="field">
            <label className="field__label" htmlFor="prop-ak">
              Antwortart
            </label>
            <select
              id="prop-ak"
              value={propStr(draft, 'answerKind', 'integer')}
              onChange={(e) => setDraft(setProp(draft, 'answerKind', e.target.value))}
            >
              <option value="integer">Ganzzahl</option>
              <option value="decimal">Dezimal</option>
            </select>
          </div>
        </>
      )
    case 'text':
      return field('accepted', 'Akzeptierte Antworten (Zeile oder Komma)', true)
    case 'fraction':
      return (
        <>
          {field('num', 'Zähler')}
          {field('den', 'Nenner')}
        </>
      )
    case 'choicePick':
      return (
        <>
          {field('choices', 'Optionen (eine pro Zeile)', true)}
          {field('correct', 'Richtige Option (Text)')}
        </>
      )
    case 'multiSelect':
      return (
        <>
          {field('choices', 'Optionen (eine pro Zeile)', true)}
          {field('correct', 'Richtige Optionen (Zeile/Komma)', true)}
        </>
      )
    case 'numberLine':
    case 'numberLineThermometer':
      return (
        <>
          {field('min', 'Min')}
          {field('max', 'Max')}
          {field('step', 'Schrittweite')}
          {field('value', 'Richtiger Wert')}
        </>
      )
    case 'dragDropSort':
      return (
        <>
          {field('items', 'Elemente (eine pro Zeile)', true)}
          {field('correctOrder', 'Korrekte Reihenfolge (Indizes 0-basiert, Komma)')}
        </>
      )
    case 'dragDropSlots':
      return (
        <>
          {field('items', 'Blöcke (eine pro Zeile)', true)}
          {field('correctSlots', 'Korrekte Slot-Indizes (0-basiert, Komma)')}
        </>
      )
    case 'digitGrid':
      return (
        <>
          {field('a', 'Operand a')}
          {field('b', 'Operand b')}
          {field('operator', 'Operator (+ oder −)')}
          {field('value', 'Ergebnis')}
        </>
      )
    case 'coordinateClick': {
      const pointCount = Math.max(
        1,
        Math.min(12, Math.floor(Number(draft.element.props.pointCount ?? 1)) || 1),
      )
      const rawPoints = Array.isArray(draft.element.props.points)
        ? (draft.element.props.points as Array<{ x: number; y: number }>)
        : []
      let points = rawPoints.filter(
        (p) => Number.isFinite(p.x) && Number.isFinite(p.y),
      )
      if (points.length === 0) {
        const x = Number(propStr(draft, 'x', '2'))
        const y = Number(propStr(draft, 'y', '3'))
        points = Number.isFinite(x) && Number.isFinite(y) ? [{ x, y }] : [{ x: 2, y: 3 }]
      }
      while (points.length < pointCount) {
        points = [...points, { x: points.length, y: 0 }]
      }
      if (points.length > pointCount) points = points.slice(0, pointCount)

      const setPoints = (next: Array<{ x: number; y: number }>) => {
        const clipped = next.slice(0, pointCount)
        setDraft({
          ...draft,
          element: {
            ...draft.element,
            props: {
              ...draft.element.props,
              pointCount,
              points: clipped,
              x: clipped[0]?.x ?? 0,
              y: clipped[0]?.y ?? 0,
            },
          },
        })
      }

      return (
        <>
          <div className="field">
            <label className="field__label" htmlFor="ta-point-count">
              Anzahl Punkte
            </label>
            <input
              id="ta-point-count"
              className="answer-input__field"
              type="number"
              min={1}
              max={12}
              value={pointCount}
              onChange={(e) => {
                const n = Math.max(1, Math.min(12, Math.floor(Number(e.target.value)) || 1))
                let next = points.slice(0, n)
                while (next.length < n) next = [...next, { x: next.length, y: 0 }]
                setDraft({
                  ...draft,
                  element: {
                    ...draft.element,
                    props: {
                      ...draft.element.props,
                      pointCount: n,
                      points: next,
                      x: next[0]?.x ?? 0,
                      y: next[0]?.y ?? 0,
                    },
                  },
                })
              }}
            />
          </div>
          <p className="muted small">
            Tippe die Lösungspunkte auf dem Gitter
            {pointCount > 1 ? ` (${pointCount} Stück, Reihenfolge egal)` : ''}.
            Erneutes Tippen auf einen Punkt entfernt ihn.
          </p>
          <CoordinateClick
            xRange={[-5, 8]}
            yRange={[-5, 8]}
            maxPoints={pointCount}
            value={pointCount === 1 ? points[0]! : null}
            onChange={(point) => setPoints([point])}
            points={points}
            onChangePoints={setPoints}
            instruction={
              pointCount > 1
                ? `Setze ${pointCount} Lösungspunkte:`
                : 'Tippe den gesuchten Punkt:'
            }
          />
          <p className="muted small">
            Aktuell:{' '}
            {points.map((p) => `(${p.x}|${p.y})`).join(', ') || '—'}
          </p>
        </>
      )
    }
    case 'coordinateDraw': {
      const scene =
        parseCoordinateScene(draft.element.props.solutionScene) ??
        emptyCoordinateScene({
          objects: [
            { id: 'sol-line', kind: 'line', x1: 0, y1: 0, x2: 1, y2: 1 },
          ],
        })
      return (
        <>
          <p className="muted small">
            Zeichne die Musterlösung: Geraden, Strecken, Halbgeraden, Punkte und
            Texte. Schüler bekommen dasselbe Werkzeug.
          </p>
          <CoordinateGraphEditor
            scene={scene}
            onChange={(solutionScene: CoordinateScene) =>
              setDraft({
                ...draft,
                element: {
                  ...draft.element,
                  props: { ...draft.element.props, solutionScene },
                },
              })
            }
            instruction="Musterlösung im Koordinatensystem zeichnen:"
          />
        </>
      )
    }
    case 'paramSlider':
      return (
        <ParamSliderAuthorForm draft={draft} setDraft={setDraft} />
      )
    default:
      return null
  }
}

type SliderRow = {
  id: string
  label: string
  min: number
  max: number
  step: number
  correct: number
}

function readSliderRows(draft: DraftAuthoringTask): SliderRow[] {
  const raw = draft.element.props.sliders
  if (Array.isArray(raw) && raw.length) {
    return raw.map((r) => {
      const row = r as Record<string, unknown>
      return {
        id: String(row.id ?? 'p'),
        label: String(row.label ?? row.id ?? 'p'),
        min: Number(row.min ?? 0),
        max: Number(row.max ?? 10),
        step: Number(row.step ?? 1) || 1,
        correct: Number(row.correct ?? 0),
      }
    })
  }
  // Legacy single-param drafts
  const id = String(draft.element.props.paramId ?? 'm')
  return [
    {
      id,
      label: String(draft.element.props.paramLabel ?? id),
      min: Number(draft.element.props.min ?? 0),
      max: Number(draft.element.props.max ?? 10),
      step: Number(draft.element.props.step ?? 1) || 1,
      correct: Number(draft.element.props.correct ?? 0),
    },
  ]
}

function ParamSliderAuthorForm({
  draft,
  setDraft,
}: {
  draft: DraftAuthoringTask
  setDraft: (d: DraftAuthoringTask) => void
}) {
  const previewRaw = String(draft.element.props.preview ?? 'linear')
  const previewOk = FUNCTION_PREVIEW_OPTIONS.some((o) => o.id === previewRaw)
  const preview = (previewOk ? previewRaw : 'linear') as FunctionPreviewKind
  const rows = readSliderRows(draft)

  const setSliders = (sliders: SliderRow[], nextPreview = preview) => {
    setDraft({
      ...draft,
      element: {
        ...draft.element,
        props: {
          ...draft.element.props,
          preview: nextPreview,
          sliders,
        },
      },
    })
  }

  return (
    <>
      <div className="field">
        <label className="field__label" htmlFor="ta-fn-preview">
          Live-Vorschau (Funktionsgraph)
        </label>
        <select
          id="ta-fn-preview"
          className="answer-input__field"
          value={preview}
          onChange={(e) => {
            const next = e.target.value as FunctionPreviewKind
            const defaults = defaultSliderParamsForPreview(next)
            setSliders(defaults, next)
          }}
        >
          {FUNCTION_PREVIEW_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <p className="muted small">
        Schüler stellen die Parameter per Slider; der Graph aktualisiert sich live.
      </p>
      {rows.map((row, idx) => (
        <div className="task-authoring__grid" key={`${row.id}-${idx}`}>
          <div className="field">
            <label className="field__label">ID</label>
            <input
              value={row.id}
              onChange={(e) => {
                const next = [...rows]
                next[idx] = { ...row, id: e.target.value }
                setSliders(next)
              }}
            />
          </div>
          <div className="field">
            <label className="field__label">Label</label>
            <input
              value={row.label}
              onChange={(e) => {
                const next = [...rows]
                next[idx] = { ...row, label: e.target.value }
                setSliders(next)
              }}
            />
          </div>
          <div className="field">
            <label className="field__label">Min</label>
            <input
              value={String(row.min)}
              onChange={(e) => {
                const next = [...rows]
                next[idx] = { ...row, min: Number(e.target.value) }
                setSliders(next)
              }}
            />
          </div>
          <div className="field">
            <label className="field__label">Max</label>
            <input
              value={String(row.max)}
              onChange={(e) => {
                const next = [...rows]
                next[idx] = { ...row, max: Number(e.target.value) }
                setSliders(next)
              }}
            />
          </div>
          <div className="field">
            <label className="field__label">Schritt</label>
            <input
              value={String(row.step)}
              onChange={(e) => {
                const next = [...rows]
                next[idx] = { ...row, step: Number(e.target.value) || 1 }
                setSliders(next)
              }}
            />
          </div>
          <div className="field">
            <label className="field__label">Richtig</label>
            <input
              value={String(row.correct)}
              onChange={(e) => {
                const next = [...rows]
                next[idx] = { ...row, correct: Number(e.target.value) }
                setSliders(next)
              }}
            />
          </div>
        </div>
      ))}
    </>
  )
}
