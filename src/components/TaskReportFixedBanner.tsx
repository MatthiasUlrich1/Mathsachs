import type { TaskReportUpdate } from '../lib/taskReports'

interface Props {
  update: TaskReportUpdate
  onDismiss: (id: string) => void
  onShowInSettings?: () => void
}

export function TaskReportFixedBanner({ update, onDismiss, onShowInSettings }: Props) {
  return (
    <section
      className="update-banner task-report-fixed-banner no-print"
      role="status"
      aria-label="Gemeldete Aufgabe korrigiert"
    >
      <div className="update-banner__head">
        <h2 className="update-banner__title">
          Deine gemeldete Aufgabe wurde korrigiert
        </h2>
        <button
          type="button"
          className="update-banner__close"
          aria-label="Hinweis schließen"
          onClick={() => onDismiss(update.id)}
        >
          ×
        </button>
      </div>
      <p className="muted small task-report-fixed-banner__meta">
        Aufgabe ID {update.contentId}
      </p>
      {update.replyMessage ? (
        <p className="task-report-fixed-banner__reply">{update.replyMessage}</p>
      ) : null}
      {onShowInSettings ? (
        <p className="task-report-fixed-banner__actions">
          <button
            type="button"
            className="link"
            onClick={() => {
              onDismiss(update.id)
              onShowInSettings()
            }}
          >
            In Einstellungen anzeigen
          </button>
        </p>
      ) : null}
    </section>
  )
}
