import { useMemo, useState } from 'react'
import {
  draftToTask,
  exportGeneratorSnippet,
  loadDrafts,
  type DraftAuthoringTask,
  upsertDraft,
  validateDraft,
} from '../lib/taskAuthoring'
import { initTaskInput, TaskInteractive, TaskVisual } from './TaskMedia'
import type { UserInput } from '../curriculum/types'

/** Entwickler review queue for submitted drafts. */
export function TaskAuthoringReviewPanel() {
  const [drafts, setDrafts] = useState(() => loadDrafts())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [exportText, setExportText] = useState<string | null>(null)
  const [previewInput, setPreviewInput] = useState<UserInput | null>(null)

  const submitted = drafts.filter((d) => d.status === 'submitted')
  const selected = drafts.find((d) => d.id === selectedId) ?? null

  const previewTask = useMemo(() => {
    if (!selected || validateDraft(selected).length) return null
    try {
      return draftToTask(selected)
    } catch {
      return null
    }
  }, [selected])

  const select = (d: DraftAuthoringTask) => {
    setSelectedId(d.id)
    setNote(d.review?.note ?? '')
    setExportText(null)
    try {
      const t = draftToTask(d)
      setPreviewInput(initTaskInput(t))
    } catch {
      setPreviewInput(null)
    }
  }

  const applyStatus = (status: 'approved' | 'rejected') => {
    if (!selected) return
    const next: DraftAuthoringTask = {
      ...selected,
      status,
      review: { by: 'entwickler', at: Date.now(), note: note.trim() || undefined },
    }
    setDrafts(upsertDraft(next))
    setSelectedId(next.id)
    if (status === 'approved') {
      setExportText(exportGeneratorSnippet(next))
    }
  }

  return (
    <section className="card task-authoring" aria-label="Aufgaben-Prüfung">
      <h2 className="section-title no-margin">Aufgaben-Prüfung</h2>
      <p className="muted small">
        Eingereichte Entwürfe prüfen. Nach Freigabe: Code-Snippet kopieren und manuell in den
        Lehrplan übernehmen.
      </p>

      <h3 className="task-authoring__sub">Eingereicht ({submitted.length})</h3>
      {submitted.length === 0 && (
        <p className="muted small">Keine offenen Einreichungen.</p>
      )}
      <ul className="task-authoring__drafts">
        {submitted.map((d) => (
          <li key={d.id}>
            <button type="button" className="link" onClick={() => select(d)}>
              {(d.task.question || d.target.topicTitle || d.id).slice(0, 60)}
            </button>
            <span className="muted small"> · {d.authorRole}</span>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="task-authoring__preview">
          <h3 className="task-authoring__sub">Vorschau</h3>
          <p className="muted small">
            Ziel: {selected.target.topicTitle || '—'} ({selected.target.topicId || '—'}) · Typ:{' '}
            {selected.element.type}
          </p>
          {previewTask && previewInput ? (
            <>
              <p>
                <strong>{previewTask.question}</strong>
              </p>
              <TaskVisual html={previewTask.visualContent} />
              <TaskInteractive
                task={previewTask}
                value={previewInput}
                onChange={setPreviewInput}
              />
              <p className="muted small">
                Musterlösung check:{' '}
                {previewTask.check(previewTask.sampleAnswer) ? 'ok' : 'FAIL'}
              </p>
            </>
          ) : (
            <p className="error">Entwurf ungültig — bitte Autor korrigieren lassen.</p>
          )}

          <div className="field">
            <label className="field__label" htmlFor="review-note">
              Notiz
            </label>
            <textarea
              id="review-note"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="task-authoring__actions">
            <button type="button" className="btn primary" onClick={() => applyStatus('approved')}>
              Freigeben
            </button>
            <button type="button" className="btn" onClick={() => applyStatus('rejected')}>
              Ablehnen
            </button>
          </div>
        </div>
      )}

      {exportText && (
        <div className="field">
          <label className="field__label" htmlFor="export-snip">
            Code aus dem Generator
          </label>
          <textarea id="export-snip" rows={14} readOnly value={exportText} />
          <button
            type="button"
            className="btn"
            onClick={() => {
              void navigator.clipboard?.writeText(exportText)
            }}
          >
            In Zwischenablage kopieren
          </button>
          <button
            type="button"
            className="link"
            onClick={() => {
              const blob = new Blob([exportText], { type: 'text/plain' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `task-authoring-${selectedId ?? 'export'}.ts.txt`
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            Als Datei speichern
          </button>
        </div>
      )}
    </section>
  )
}
