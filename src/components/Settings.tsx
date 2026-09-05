import { CurriculumSetup } from './CurriculumSetup'
import { ClassCodes } from './ClassCodes'
import { LanAccessCard } from './LanAccessCard'
import {
  SETTINGS_SECTIONS,
  type SettingsSectionId,
} from '../nav'
import {
  USER_ROLES,
  canCreateClassCodes,
  canManageGradeCodes,
  roleLabel,
  type UserRole,
} from '../lib/roles'
import type { LanServerStatus } from '../updates/types'

const SECTION_HINTS: Record<SettingsSectionId, string> = {
  curricula: 'Klassenstufen laden und entfernen',
  class: 'Klassencode erstellen, eintragen oder teilen',
  lan: 'Tablets im selben WLAN verbinden',
  profile: 'Rolle ändern oder Benutzer wechseln',
}

interface Props {
  loadedIds: string[]
  onLoad: (id: string) => Promise<void>
  onRemove: (id: string) => void
  onBack: () => void
  onOpenSection: (id: SettingsSectionId) => void
  section?: SettingsSectionId | null
  user: string
  role: UserRole
  classLabel: string | null
  lanStatus: LanServerStatus | null
  onChangeRole: (role: UserRole) => void
  onSwitchUser: () => void
}

export function Settings({
  loadedIds,
  onLoad,
  onRemove,
  onBack,
  onOpenSection,
  section = null,
  user,
  role,
  classLabel,
  lanStatus,
  onChangeRole,
  onSwitchUser,
}: Props) {
  const lanAvailable = Boolean(lanStatus)
  const sectionHint = (id: SettingsSectionId) => {
    if (id === 'class' && canManageGradeCodes(role)) {
      return 'Klassencode und Klassenstufe'
    }
    if (id === 'class' && !canCreateClassCodes(role)) {
      return 'Klassencode eintragen und Stufen-Wettbewerb'
    }
    return SECTION_HINTS[id]
  }

  if (!section) {
    return (
      <section className="card settings-hub" aria-label="Einstellungen">
        <div className="session__head">
          <div>
            <h2 className="section-title no-margin">Einstellungen</h2>
            <p className="muted small">Wähle einen Bereich.</p>
          </div>
        </div>

        <ul className="settings-menu">
          {SETTINGS_SECTIONS.map((item) => {
            const lanOnWeb = item.id === 'lan' && !lanAvailable
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className="settings-menu__btn"
                  onClick={() => onOpenSection(item.id)}
                >
                  <span className="settings-menu__text">
                    <span className="settings-menu__label">{item.label}</span>
                    <span className="settings-menu__hint">
                      {lanOnWeb
                        ? 'Nur in der Desktop-App — hier ein Hinweis'
                        : sectionHint(item.id)}
                    </span>
                  </span>
                  <span className="settings-menu__chevron" aria-hidden="true">
                    ›
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    )
  }

  return (
    <div className="settings-section">
      <div className="settings-section__nav no-print">
        <button type="button" className="link" onClick={onBack}>
          Zurück
        </button>
      </div>

      {section === 'curricula' && (
        <CurriculumSetup
          loadedIds={loadedIds}
          onLoad={onLoad}
          onRemove={onRemove}
        />
      )}

      {section === 'class' && (
        <ClassCodes
          key={user}
          user={user}
          canCreateCodes={canCreateClassCodes(role)}
          canManageGrades={canManageGradeCodes(role)}
        />
      )}

      {section === 'lan' &&
        (lanStatus ? (
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
        ))}

      {section === 'profile' && (
        <section className="card" aria-label="Profil">
          <div className="session__head">
            <div>
              <h2 className="section-title no-margin">Profil</h2>
              <p className="muted small">
                Angemeldet als <strong>{user}</strong>
                {` · ${roleLabel(role)}`}
                {classLabel ? ` · ${classLabel}` : ''}. Die Rolle gilt für die
                Reiter und für Klassencodes. Benutzer wechseln führt zur
                Auswahl wie beim Start („Wer übt heute?“).
              </p>
            </div>
          </div>
          <fieldset className="role-fieldset">
            <legend className="field__label">Rolle</legend>
            <div className="role-options">
              {USER_ROLES.map((entry) => (
                <label
                  key={entry.id}
                  className={`role-option ${
                    role === entry.id ? 'role-option--active' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="profile-role"
                    value={entry.id}
                    checked={role === entry.id}
                    onChange={() => onChangeRole(entry.id)}
                  />
                  {entry.label}
                </label>
              ))}
            </div>
          </fieldset>
          <button type="button" className="ghost" onClick={onSwitchUser}>
            Benutzer wechseln
          </button>
        </section>
      )}
    </div>
  )
}
