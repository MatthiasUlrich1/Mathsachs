import type { ManifestPack } from '../curriculum/pack'

interface Props {
  pack: ManifestPack
  localVersion: string
  busy?: boolean
  error?: string | null
  onUpdate: () => void
  onDismiss: () => void
}

export function CurriculumBanner({
  pack,
  localVersion,
  busy = false,
  error,
  onUpdate,
  onDismiss,
}: Props) {
  return (
    <section className="update-banner no-print" role="status">
      <div className="update-banner__head">
        <h2 className="update-banner__title">
          Neuer Lehrplan {pack.title} Version {pack.version} verfügbar
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
      <p className="muted small">
        Installiert ist Version {localVersion}.
        {pack.changelog ? ` ${pack.changelog}` : ''}
      </p>
      {error && <p className="notice notice--error update-banner__error">{error}</p>}
      <div className="update-banner__actions">
        <button type="button" className="primary" onClick={onUpdate} disabled={busy}>
          {busy ? 'Wird aktualisiert …' : 'Lehrplan aktualisieren'}
        </button>
      </div>
    </section>
  )
}
