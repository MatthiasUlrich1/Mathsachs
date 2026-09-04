import { useState } from 'react'
import { availableCurricula } from '../curriculum/registry'

interface Props {
  loadedIds: string[]
  onLoad: (id: string) => Promise<void>
  onRemove: (id: string) => void
  onExit: () => void
}

export function CurriculumSetup({ loadedIds, onLoad, onRemove, onExit }: Props) {
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLoad = async (id: string) => {
    setBusyId(id)
    setError(null)
    try {
      await onLoad(id)
    } catch {
      setError('Der Lehrplan konnte nicht geladen werden. Bitte erneut versuchen.')
    } finally {
      setBusyId(null)
    }
  }

  const nothingLoaded = loadedIds.length === 0

  return (
    <section className="card">
      <div className="session__head">
        <div>
          <h2 className="section-title no-margin">Lehrpläne</h2>
          <p className="muted small">
            Lade die Klassenstufen, die du üben möchtest. Inhalte werden erst
            beim Laden nachgeladen und danach im Themen-Browser auswählbar.
          </p>
        </div>
        <button type="button" className="link" onClick={onExit}>
          Zu den Themen
        </button>
      </div>

      {nothingLoaded && (
        <p className="notice notice--warn">
          Es ist aktuell kein Lehrplan geladen. Lade mindestens eine Klasse, um
          üben zu können.
        </p>
      )}

      {error && <p className="notice notice--error">{error}</p>}

      <ul className="curriculum-list">
        {availableCurricula.map((mod) => {
          const isLoaded = loadedIds.includes(mod.id)
          const isBusy = busyId === mod.id
          return (
            <li key={mod.id} className="curriculum-card">
              <div className="curriculum-card__head">
                <div>
                  <h3 className="curriculum-card__title">
                    {mod.subjectTitle} · {mod.gradeTitle}
                  </h3>
                  <p className="muted small">{mod.description}</p>
                </div>
                {isLoaded ? (
                  <span className="badge badge--ok">Geladen ✓</span>
                ) : (
                  <span className="badge">Nicht geladen</span>
                )}
              </div>
              <div className="curriculum-card__actions">
                {isLoaded ? (
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => onRemove(mod.id)}
                  >
                    Entfernen
                  </button>
                ) : (
                  <button
                    type="button"
                    className="primary"
                    disabled={isBusy}
                    onClick={() => handleLoad(mod.id)}
                  >
                    {isBusy ? 'Wird geladen …' : 'Laden'}
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
