import { useCallback, useEffect, useState } from 'react'
import { ClassApiError } from '../classCode/api'
import {
  deleteTaskReport,
  fetchTaskReports,
  markTaskReportDone,
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

interface Props {
  onShowTask: (report: TaskReport) => void | Promise<void>
}

export function FaultyTasksPanel({ onShowTask }: Props) {
  const [reports, setReports] = useState<TaskReport[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setActionError(null)
    try {
      const next = await fetchTaskReports()
      setReports(next)
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
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const markDone = async (id: string) => {
    if (busyId) return
    setBusyId(id)
    setActionError(null)
    try {
      const updated = await markTaskReportDone(id)
      setReports((prev) =>
        prev ? prev.map((row) => (row.id === id ? updated : row)) : prev,
      )
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

  const remove = async (id: string) => {
    if (busyId) return
    setBusyId(id)
    setActionError(null)
    try {
      await deleteTaskReport(id)
      setReports((prev) => (prev ? prev.filter((row) => row.id !== id) : prev))
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
        Erledigte Meldungen bleiben in der Liste, bis sie gelöscht werden.
      </p>
      {error && <p className="task-report__error">{error}</p>}
      {actionError && <p className="task-report__error">{actionError}</p>}
      {!error && !loading && reports && reports.length === 0 && (
        <p className="muted">Noch keine Meldungen.</p>
      )}
      {reports && reports.length > 0 && (
        <ul className="faulty-tasks">
          {reports.map((row) => {
            const done = row.status === 'done'
            const rowBusy = busyId === row.id
            return (
              <li
                key={row.id}
                className={`faulty-tasks__item${done ? ' faulty-tasks__item--done' : ''}`}
              >
                <div className="faulty-tasks__head">
                  <strong>ID {row.contentId}</strong>
                  <span className="muted small">{formatReportTime(row.at)}</span>
                </div>
                {done && (
                  <p className="muted small faulty-tasks__status">Erledigt</p>
                )}
                <p className="faulty-tasks__comment">{row.comment}</p>
                <p className="muted small faulty-tasks__meta">
                  {[
                    row.topicTitle,
                    row.areaTitle,
                    row.topicId ? `Thema ${row.topicId}` : null,
                    row.appVersion ? `v${row.appVersion}` : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                {row.question && (
                  <p className="muted small faulty-tasks__question">„{row.question}“</p>
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
                  {!done ? (
                    <button
                      type="button"
                      className="chip-btn"
                      disabled={rowBusy}
                      onClick={() => void markDone(row.id)}
                    >
                      {rowBusy ? '…' : 'Erledigt'}
                    </button>
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
