import { useCallback, useEffect, useState } from 'react'
import { ClassApiError } from '../classCode/api'
import { fetchTaskReports, type TaskReport } from '../lib/taskReports'

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

export function FaultyTasksPanel() {
  const [reports, setReports] = useState<TaskReport[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
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
      </p>
      {error && <p className="task-report__error">{error}</p>}
      {!error && !loading && reports && reports.length === 0 && (
        <p className="muted">Noch keine Meldungen.</p>
      )}
      {reports && reports.length > 0 && (
        <ul className="faulty-tasks">
          {reports.map((row) => (
            <li key={row.id} className="faulty-tasks__item">
              <div className="faulty-tasks__head">
                <strong>ID {row.contentId}</strong>
                <span className="muted small">{formatReportTime(row.at)}</span>
              </div>
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
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
