import { CurriculumSetup } from './CurriculumSetup'
import { ClassCodes } from './ClassCodes'
import { LanAccessCard } from './LanAccessCard'
import type { LanServerStatus } from '../updates/types'

interface Props {
  loadedIds: string[]
  onLoad: (id: string) => Promise<void>
  onRemove: (id: string) => void
  onExitToTopics: () => void
  user: string
  classLabel: string | null
  lanStatus: LanServerStatus | null
  onSwitchUser: () => void
}

export function Settings({
  loadedIds,
  onLoad,
  onRemove,
  onExitToTopics,
  user,
  classLabel,
  lanStatus,
  onSwitchUser,
}: Props) {
  return (
    <>
      <CurriculumSetup
        loadedIds={loadedIds}
        onLoad={onLoad}
        onRemove={onRemove}
        onExit={onExitToTopics}
      />

      <ClassCodes key={user} user={user} />

      {lanStatus ? (
        <LanAccessCard status={lanStatus} />
      ) : (
        <section className="card lan-card no-print" aria-label="WLAN-Zugang">
          <h2 className="section-title no-margin">WLAN-Zugang</h2>
          <p className="muted small">
            WLAN-Zugang gibt es nur in der installierten Desktop-App. Im Browser
            auf einem Tablet oder Handy siehst du keine Adresse — du bist bereits
            über das WLAN verbunden, wenn Mathsachs auf dem Rechner geöffnet ist.
          </p>
        </section>
      )}

      <section className="card" aria-label="Profil">
        <div className="session__head">
          <div>
            <h2 className="section-title no-margin">Profil</h2>
            <p className="muted small">
              Angemeldet als <strong>{user}</strong>
              {classLabel ? ` · ${classLabel}` : ''}. Hier wechselst du den
              Benutzer — dieselbe Auswahl wie beim Start („Wer übt heute?“).
            </p>
          </div>
        </div>
        <button type="button" className="ghost" onClick={onSwitchUser}>
          Benutzer wechseln
        </button>
      </section>
    </>
  )
}
