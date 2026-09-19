import { useCallback, useEffect, useState } from 'react'
import { ClassApiError } from '../classCode/api'
import {
  fetchMyReportUpdates,
  listMyStoredReports,
  mergeMyReportList,
  myReportStatusLabel,
  type MyReportListItem,
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

export function MyReportedTasksPanel() {
  const [rows, setRows] = useState<MyReportListItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const stored = listMyStoredReports()
    if (stored.length === 0) {
      setRows([])
      setLoading(false)
      return
    }
    try {
      const updates = await fetchMyReportUpdates()
      // fetchMyReportUpdates purges deleted ids from localStorage — re-read.
      setRows(
        mergeMyReportList(listMyStoredReports(), updates, { statusFetched: true }),
      )
    } catch (err) {
      setRows(mergeMyReportList(stored, [], { statusFetched: false }))
      setError(
        err instanceof ClassApiError
          ? err.message
          : 'Status konnte nicht geladen werden.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <section className="card" aria-label="Meine Meldungen">
      <div className="faulty-tasks__toolbar">
        <h2 className="section-title no-margin">Meine Meldungen</h2>
        <button type="button" className="ghost" disabled={loading} onClick={() => void load()}>
          {loading ? 'Lädt …' : 'Aktualisieren'}
        </button>
      </div>
      <p className="muted small">
        Aufgaben, die du auf diesem Gerät als fehlerhaft gemeldet hast. Status und
        Korrektur-Hinweise erscheinen hier, sobald sie bearbeitet wurden.
      </p>
      {error && <p className="task-report__error">{error}</p>}
      {!loading && rows && rows.length === 0 && (
        <p className="muted">Noch keine gemeldeten Aufgaben</p>
      )}
      {rows && rows.length > 0 && (
        <ul className="faulty-tasks my-reports">
          {rows.map((row) => {
            const closed = row.status === 'done' || row.status === 'fixed'
            const label = myReportStatusLabel(row.status)
            return (
              <li
                key={row.id}
                className={`faulty-tasks__item${closed ? ' faulty-tasks__item--done' : ''}${
                  row.status === 'fixed' ? ' faulty-tasks__item--fixed' : ''
                }`}
              >
                <div className="faulty-tasks__head">
                  <strong>
                    {row.contentId > 0 ? `ID ${row.contentId}` : 'Gemeldete Aufgabe'}
                  </strong>
                  <span className="muted small">{formatReportTime(row.rememberedAt)}</span>
                </div>
                <p
                  className={`faulty-tasks__status${
                    row.status === 'fixed' ? ' faulty-tasks__status--fixed' : ' muted small'
                  }`}
                >
                  {label}
                </p>
                {row.topicTitle && (
                  <p className="muted small faulty-tasks__meta">{row.topicTitle}</p>
                )}
                {row.comment && <p className="faulty-tasks__comment">{row.comment}</p>}
                {row.status === 'fixed' && row.replyMessage && (
                  <p className="faulty-tasks__reply" role="status">
                    <span className="faulty-tasks__reply-label">Nachricht vom Entwickler</span>
                    {row.replyMessage}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
