import { useEffect, useMemo, useState } from 'react'
import {
  AUTHORING_ELEMENT_OPTIONS,
  createEmptyDraft,
  deleteDraft,
  draftToTask,
  exportGeneratorSnippet,
  loadDrafts,
  type AuthoringElementType,
  type DraftAuthoringTask,
  upsertDraft,
  validateDraft,
} from '../lib/taskAuthoring'
import type { UserRole } from '../lib/roles'
import { initTaskInput, TaskInteractive, TaskVisual } from './TaskMedia'
import { TaskAuthoringSvgPicker } from './TaskAuthoringSvgPicker'
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
      return { x: 2, y: 3 }
    case 'paramSlider':
      return { paramId: 'm', paramLabel: 'm', min: -5, max: 5, step: 1, correct: 2 }
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
      <div className="task-authoring__grid">
        {(
          [
            ['packId', 'Pack-ID'],
            ['gradeId', 'Klasse/Stufe'],
            ['areaId', 'Lernbereich'],
            ['topicId', 'Themen-ID'],
            ['topicTitle', 'Themen-Titel'],
          ] as const
        ).map(([key, label]) => (
          <div className="field" key={key}>
            <label className="field__label" htmlFor={`ta-${key}`}>
              {label}
            </label>
            <input
              id={`ta-${key}`}
              value={draft.target[key]}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  target: { ...draft.target, [key]: e.target.value },
                })
              }
            />
          </div>
        ))}
      </div>

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
    case 'coordinateClick':
      return (
        <>
          {field('x', 'x')}
          {field('y', 'y')}
        </>
      )
    case 'paramSlider':
      return (
        <>
          {field('paramId', 'Param-ID')}
          {field('paramLabel', 'Label')}
          {field('min', 'Min')}
          {field('max', 'Max')}
          {field('step', 'Schrittweite')}
          {field('correct', 'Richtiger Wert')}
        </>
      )
    default:
      return null
  }
}
