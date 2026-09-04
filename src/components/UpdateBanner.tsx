import { formatReleaseNotes } from '../updates/releaseNotes'
import type { AppUpdateInfo } from '../updates/types'
import type { UpdateUiStatus } from '../updates/useUpdateCheck'

interface Props {
  update: AppUpdateInfo
  status: UpdateUiStatus
  progress: number
  error: string | null
  isDesktop: boolean
  onDownload: () => void
  onInstall: () => void
  onDismiss: () => void
  onIgnore: () => void
}

export function UpdateBanner({
  update,
  status,
  progress,
  error,
  isDesktop,
  onDownload,
  onInstall,
  onDismiss,
  onIgnore,
}: Props) {
  const notesHtml = formatReleaseNotes(update.notes)
  const downloading = status === 'downloading'
  const downloaded = status === 'downloaded'
  const autoInstall = isDesktop && update.canAutoInstall

  return (
    <section className="update-banner no-print" role="status">
      <div className="update-banner__head">
        <h2 className="update-banner__title">
          Neue Version {update.version} verfügbar
        </h2>
        <button
          type="button"
          className="update-banner__close"
          aria-label="Hinweis schließen"
          onClick={onDismiss}
        >
          ×
        </button>
      </div>
      {notesHtml ? (
        <div
          className="update-banner__notes"
          dangerouslySetInnerHTML={{ __html: notesHtml }}
        />
      ) : (
        <p className="muted small">
          Was neu ist, steht in den{' '}
          <a
            href={update.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Release-Notes auf GitHub
          </a>
          .
        </p>
      )}
      {error && <p className="notice notice--error update-banner__error">{error}</p>}
      {downloading && (
        <div className="update-banner__progress" aria-live="polite">
          <div className="progress update-banner__bar">
            <div
              className="progress__fill"
              style={{ width: `${Math.round(progress)}%` }}
            />
          </div>
          <span className="muted small">{Math.round(progress)}&nbsp;%</span>
        </div>
      )}
      <div className="update-banner__actions">
        {downloaded ? (
          <button type="button" className="primary" onClick={onInstall}>
            Jetzt installieren
          </button>
        ) : (
          <button
            type="button"
            className="primary"
            onClick={onDownload}
            disabled={downloading}
          >
            {autoInstall
              ? downloading
                ? 'Wird heruntergeladen …'
                : 'Update herunterladen'
              : 'Download'}
          </button>
        )}
        <a
          className="ghost update-banner__link"
          href={update.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Releases-Seite
        </a>
        <button type="button" className="link" onClick={onIgnore}>
          Diese Version ignorieren
        </button>
      </div>
      {update.downloadLabel && (
        <p className="muted small update-banner__asset">{update.downloadLabel}</p>
      )}
    </section>
  )
}
