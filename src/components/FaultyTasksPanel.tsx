import { useCallback, useEffect, useState } from 'react'
import { ClassApiError } from '../classCode/api'
import {
  deleteTaskReport,
  fetchTaskReports,
  markTaskReportDone,
  markTaskReportFixed,
  MAX_REPORT_REPLY,
  trimReportReply,
  type TaskReport,
} from '../lib/taskReports'

function formatReportTime(at: number): string {
  try {
    return new Date(at).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return String(at)
  }
}

function statusLabel(status: TaskReport['status']): string | null {
  if (status === 'done') return 'Erledigt'
  if (status === 'fixed') return 'Korrigiert'
  return null
}

interface Props {
  onShowTask: (report: TaskReport) => void | Promise<void>
  /** Fired after list load / status / delete so nav badges stay in sync. */
  onReportsChanged?: (reports: TaskReport[]) => void
}

export function FaultyTasksPanel({ onShowTask, onReportsChanged }: Props) {
  const [reports, setReports] = useState<TaskReport[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [fixDraftId, setFixDraftId] = useState<string | null>(null)
  const [fixMessage, setFixMessage] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setActionError(null)
    try {
      const next = await fetchTaskReports()
      setReports(next)
      onReportsChanged?.(next)
    } catch (err) {
      setReports(null)
      setError(
        err instanceof ClassApiError
          ? err.message
          : 'Liste konnte nicht geladen werden.',
      )
    } finally {
      setLoading(false)
    }
  }, [onReportsChanged])

  useEffect(() => {
    void load()
  }, [load])

  const applyUpdated = (id: string, updated: TaskReport) => {
    setReports((prev) => {
      const next = prev
        ? prev.map((row) => (row.id === id ? updated : row))
        : prev
      if (next) onReportsChanged?.(next)
      return next
    })
  }

  const markDone = async (id: string) => {
    if (busyId) return
    setBusyId(id)
    setActionError(null)
    try {
      const updated = await markTaskReportDone(id)
      applyUpdated(id, updated)
      if (fixDraftId === id) {
        setFixDraftId(null)
        setFixMessage('')
      }
    } catch (err) {
      setActionError(
        err instanceof ClassApiError
          ? err.message
          : 'Status konnte nicht gespeichert werden.',
      )
    } finally {
      setBusyId(null)
    }
  }

  const markFixed = async (id: string) => {
    if (busyId) return
    setBusyId(id)
    setActionError(null)
    try {
      const updated = await markTaskReportFixed(id, fixMessage)
      applyUpdated(id, updated)
      setFixDraftId(null)
      setFixMessage('')
    } catch (err) {
      setActionError(
        err instanceof ClassApiError
          ? err.message
          : 'Korrektur-Hinweis konnte nicht gespeichert werden.',
      )
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (id: string) => {
    if (busyId) return
    setBusyId(id)
    setActionError(null)
    try {
      await deleteTaskReport(id)
      setReports((prev) => {
        const next = prev ? prev.filter((row) => row.id !== id) : prev
        if (next) onReportsChanged?.(next)
        return next
      })
    } catch (err) {
      setActionError(
        err instanceof ClassApiError
          ? err.message
          : 'Meldung konnte nicht gelöscht werden.',
      )
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="card" aria-label="Fehlerhafte Aufgaben">
      <div className="faulty-tasks__toolbar">
        <h2 className="section-title no-margin">Fehlerhafte Aufgaben</h2>
        <button type="button" className="ghost" disabled={loading} onClick={() => void load()}>
          {loading ? 'Lädt …' : 'Aktualisieren'}
        </button>
      </div>
      <p className="muted small">
        Gemeldete Aufgaben mit Content-ID und Nutzerkommentar (nur Entwickleransicht).
        <strong> Erledigt</strong> schließt ohne Meldung an den Melder.
        <strong> Als korrigiert melden</strong> benachrichtigt den Melder anonym
        (optional mit kurzer Nachricht). Einträge bleiben bis zum Löschen in der Liste.
      </p>
      {error && <p className="task-report__error">{error}</p>}
      {actionError && <p className="task-report__error">{actionError}</p>}
      {!error && !loading && reports && reports.length === 0 && (
        <p className="muted">Noch keine Meldungen.</p>
      )}
      {reports && reports.length > 0 && (
        <ul className="faulty-tasks">
          {reports.map((row) => {
            const closed = row.status === 'done' || row.status === 'fixed'
            const rowBusy = busyId === row.id
            const drafting = fixDraftId === row.id
            const label = statusLabel(row.status)
            return (
              <li
                key={row.id}
                className={`faulty-tasks__item${closed ? ' faulty-tasks__item--done' : ''}${
                  row.status === 'fixed' ? ' faulty-tasks__item--fixed' : ''
                }`}
              >
                <div className="faulty-tasks__head">
                  <strong>ID {row.contentId}</strong>
                  <span className="muted small">{formatReportTime(row.at)}</span>
                </div>
                {label && (
                  <p className="muted small faulty-tasks__status">{label}</p>
                )}
                <p className="faulty-tasks__comment">{row.comment}</p>
                {row.replyMessage && (
                  <p className="muted small faulty-tasks__reply">
                    Antwort an Melder: „{row.replyMessage}“
                  </p>
                )}
                <p className="muted small faulty-tasks__meta">
                  {[
                    row.topicTitle,
                    row.areaTitle,
                    row.topicId ? `Thema ${row.topicId}` : null,
                    typeof row.seed === 'number' ? `Seed ${row.seed}` : null,
                    row.appVersion ? `v${row.appVersion}` : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                {row.question && (
                  <p className="muted small faulty-tasks__question">„{row.question}“</p>
                )}
                {drafting && (
                  <div className="faulty-tasks__fix-form">
                    <label className="muted small" htmlFor={`fix-msg-${row.id}`}>
                      Optionale Nachricht an den Melder (ohne persönliche Daten):
                    </label>
                    <textarea
                      id={`fix-msg-${row.id}`}
                      className="task-report__comment"
                      rows={2}
                      maxLength={MAX_REPORT_REPLY}
                      value={fixMessage}
                      onChange={(e) => setFixMessage(e.target.value)}
                      placeholder="z. B. Lösungsweg korrigiert — bitte erneut versuchen."
                      disabled={rowBusy}
                    />
                    <div className="faulty-tasks__actions">
                      <button
                        type="button"
                        className="ghost"
                        disabled={rowBusy}
                        onClick={() => {
                          setFixDraftId(null)
                          setFixMessage('')
                        }}
                      >
                        Abbrechen
                      </button>
                      <button
                        type="button"
                        className="chip-btn chip-btn--primary"
                        disabled={rowBusy}
                        onClick={() => void markFixed(row.id)}
                      >
                        {rowBusy
                          ? '…'
                          : trimReportReply(fixMessage)
                            ? 'Korrigiert melden'
                            : 'Ohne Nachricht melden'}
                      </button>
                    </div>
                  </div>
                )}
                <div className="faulty-tasks__actions">
                  <button
                    type="button"
                    className="chip-btn chip-btn--primary"
                    disabled={rowBusy}
                    onClick={() => void onShowTask(row)}
                  >
                    Fehlerhafte Aufgabe anzeigen
                  </button>
                  {!closed ? (
                    <>
                      <button
                        type="button"
                        className="chip-btn"
                        disabled={rowBusy || drafting}
                        onClick={() => void markDone(row.id)}
                      >
                        {rowBusy ? '…' : 'Erledigt'}
                      </button>
                      {!drafting && (
                        <button
                          type="button"
                          className="chip-btn"
                          disabled={rowBusy}
                          onClick={() => {
                            setFixDraftId(row.id)
                            setFixMessage('')
                            setActionError(null)
                          }}
                        >
                          Als korrigiert melden
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      className="chip-btn"
                      disabled={rowBusy}
                      onClick={() => void remove(row.id)}
                    >
                      {rowBusy ? '…' : 'Löschen'}
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
