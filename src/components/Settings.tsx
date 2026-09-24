import { useState } from 'react'
import { CurriculumSetup } from './CurriculumSetup'
import { ClassCodes } from './ClassCodes'
import { FaultyTasksPanel } from './FaultyTasksPanel'
import { LanAccessCard } from './LanAccessCard'
import { MyReportedTasksPanel } from './MyReportedTasksPanel'
import { RoleRightsMatrix } from './RoleRightsMatrix'
import { AboutApp } from './AboutApp'
import { DeveloperInfoPanel } from './DeveloperInfoPanel'
import { Supporters } from './Supporters'
import { TaskAuthoringPanel } from './TaskAuthoringPanel'
import { TaskAuthoringReviewPanel } from './TaskAuthoringReviewPanel'
import { TaskRequest } from './TaskRequest'
import { UserManagement } from './UserManagement'
import {
  RoleOptions,
  TeacherCodeGate,
  TeacherCodeReveal,
} from './TeacherCodePanel'
import {
  settingsSectionsForRole,
  type SettingsSectionId,
} from '../nav'
import {
  canCreateClassCodes,
  canEnterGradeCodes,
  canManageGradeCodes,
  canRequestTasks,
  canSeeTaskAuthoringReviewUI,
  canSeeTaskAuthoringUI,
  canSendClassPoints,
  canViewFaultyReports,
  isTeacherRole,
  roleLabel,
  type UserRole,
} from '../lib/roles'
import { applyRoleChange, needsTeacherCode } from '../lib/teacherCode'
import { SUBJECT_OPTIONS } from '../curriculum/packFilters'
import type { LanServerStatus } from '../updates/types'
import {
  MANUAL_CHECK_LABEL,
  manualCheckHint,
  type ManualCheckStatus,
} from '../updates/runCheck'
import type { TaskReport } from '../lib/taskReports'

const SECTION_HINTS: Record<SettingsSectionId, string> = {
  curricula: 'Lehrpläne installieren, aktualisieren oder entfernen',
  class: 'Klassencode erstellen, eintragen oder teilen',
  tasks: 'Vorgaben für neue Übungsaufgaben senden',
  taskAuthoring: 'Aufgaben interaktiv entwerfen und zur Prüfung einreichen',
  taskAuthoringReview: 'Eingereichte Generator-Entwürfe prüfen und exportieren',
  myReports: 'Deine gemeldeten fehlerhaften Aufgaben und Korrektur-Hinweise',
  faulty: 'Gemeldete fehlerhafte Aufgaben einsehen',
  info: 'Anonyme Schüler-Antwortzähler (Entwickler)',
  lan: 'Tablets im selben WLAN verbinden',
  profile: 'Rolle, Lehrercode, Rechte und Benutzerwechsel',
  supporters: 'Organisationen, die TaskTrophy unterstützen',
  about: 'Kurzanleitung und Inhaltsverzeichnis',
}

interface Props {
  loadedIds: string[]
  onLoad: (id: string) => Promise<void>
  onRemove: (id: string) => void
  onPacksChanged: () => void
  onBack: () => void
  onOpenSection: (id: SettingsSectionId) => void
  onShowFaultyTask?: (report: TaskReport) => void | Promise<void>
  /** Open (not done) faulty-task reports — Entwickler badge only. */
  openFaultyReportCount?: number
  onFaultyReportsChanged?: (reports: TaskReport[]) => void
  section?: SettingsSectionId | null
  user: string
  role: UserRole
  preferredSubject: string
  preferredSubjects: string[]
  onChangePreferredSubjects: (subjects: string[]) => void
  /** Nach Lehrplan-Installation: Fach in die bevorzugten Fächer aufnehmen. */
  onEnsureSubject?: (subject: string) => void
  classLabel: string | null
  lanStatus: LanServerStatus | null
  onChangeRole: (role: UserRole) => void
  onSwitchUser: () => void
  onRenameUser: (newName: string) => void
  onDeleteUser: () => void
  onCheckUpdates: () => void
  manualCheckStatus?: ManualCheckStatus
  manualCheckError?: string | null
}

export function Settings({
  loadedIds,
  onLoad,
  onRemove,
  onPacksChanged,
  onBack,
  onOpenSection,
  onShowFaultyTask,
  openFaultyReportCount = 0,
  onFaultyReportsChanged,
  section = null,
  user,
  role,
  preferredSubject,
  preferredSubjects,
  onChangePreferredSubjects,
  onEnsureSubject,
  classLabel,
  lanStatus,
  onChangeRole,
  onSwitchUser,
  onRenameUser,
  onDeleteUser,
  onCheckUpdates,
  manualCheckStatus = 'idle',
  manualCheckError = null,
}: Props) {
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null)
  const [teacherCodeDraft, setTeacherCodeDraft] = useState('')
  const [teacherCodeError, setTeacherCodeError] = useState<string | null>(null)
  const selectedRole = pendingRole ?? role
  const lanAvailable = Boolean(lanStatus)
  const updateHint = manualCheckHint(manualCheckStatus, manualCheckError)

  const pickRole = (next: UserRole) => {
    if (!needsTeacherCode(role, next)) {
      setPendingRole(null)
      setTeacherCodeDraft('')
      setTeacherCodeError(null)
      if (next !== role) onChangeRole(next)
      return
    }
    setPendingRole(next)
    setTeacherCodeError(null)
  }

  const confirmTeacherRole = () => {
    if (!pendingRole) return
    const result = applyRoleChange(role, pendingRole, teacherCodeDraft)
    if (!result.ok) {
      setTeacherCodeError(result.error)
      return
    }
    onChangeRole(result.role)
    setPendingRole(null)
    setTeacherCodeDraft('')
    setTeacherCodeError(null)
  }
  const sectionHint = (id: SettingsSectionId) => {
    if (id === 'class' && (canManageGradeCodes(role) || canEnterGradeCodes(role))) {
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
          {settingsSectionsForRole(role).map((item) => {
            const lanOnWeb = item.id === 'lan' && !lanAvailable
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className="settings-menu__btn"
                  onClick={() => onOpenSection(item.id)}
                >
                  <span className="settings-menu__text">
                    <span className="settings-menu__label">
                      {item.label}
                      {item.id === 'faulty' &&
                        canViewFaultyReports(role) &&
                        openFaultyReportCount > 0 && (
                          <span
                            className="tab__badge"
                            aria-label={`${openFaultyReportCount} offene Fehlermeldungen`}
                          >
                            {openFaultyReportCount}
                          </span>
                        )}
                    </span>
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

        <div className="settings-updates">
          <button
            type="button"
            className="ghost"
            onClick={onCheckUpdates}
            disabled={manualCheckStatus === 'checking'}
            aria-busy={manualCheckStatus === 'checking'}
          >
            {MANUAL_CHECK_LABEL}
          </button>
          {updateHint && (
            <p
              className={
                manualCheckStatus === 'error'
                  ? 'notice notice--error'
                  : manualCheckStatus === 'building'
                    ? 'notice settings-updates__building'
                    : 'muted small'
              }
              aria-live="polite"
            >
              {updateHint}
            </p>
          )}
        </div>
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
          onPacksChanged={onPacksChanged}
          onEnsureSubject={onEnsureSubject}
          initialSubject={isTeacherRole(role) ? preferredSubject : undefined}
        />
      )}

      {section === 'class' && (
        <ClassCodes
          key={user}
          user={user}
          canCreateCodes={canCreateClassCodes(role)}
          canManageGrades={canManageGradeCodes(role)}
          canEnterGrades={canEnterGradeCodes(role)}
          canSendPoints={canSendClassPoints(role)}
        />
      )}

      {section === 'tasks' &&
        (canRequestTasks(role) ? (
          <TaskRequest />
        ) : (
          <section className="card" aria-label="Aufgaben ergänzen">
            <h2 className="section-title no-margin">Aufgaben ergänzen</h2>
            <p className="muted small">
              Nur Lehrer können Vorgaben für neue Aufgaben senden.
            </p>
          </section>
        ))}

      {section === 'taskAuthoring' &&
        (canSeeTaskAuthoringUI(role) ? (
          <TaskAuthoringPanel role={role} />
        ) : (
          <section className="card" aria-label="Aufgabengenerator">
            <h2 className="section-title no-margin">Aufgabengenerator</h2>
            <p className="muted small">Derzeit nur in der Entwickleransicht verfügbar.</p>
          </section>
        ))}

      {section === 'taskAuthoringReview' &&
        (canSeeTaskAuthoringReviewUI(role) ? (
          <TaskAuthoringReviewPanel />
        ) : (
          <section className="card" aria-label="Aufgaben-Prüfung">
            <h2 className="section-title no-margin">Aufgaben-Prüfung</h2>
            <p className="muted small">Nur in der Entwickleransicht verfügbar.</p>
          </section>
        ))}

      {section === 'myReports' && <MyReportedTasksPanel />}

      {section === 'faulty' &&
        (canViewFaultyReports(role) ? (
          <FaultyTasksPanel
            onShowTask={(report) => {
              void onShowFaultyTask?.(report)
            }}
            onReportsChanged={onFaultyReportsChanged}
          />
        ) : (
          <section className="card" aria-label="Fehlerhafte Aufgaben">
            <h2 className="section-title no-margin">Fehlerhafte Aufgaben</h2>
            <p className="muted small">Nur in der Entwickleransicht verfügbar.</p>
          </section>
        ))}

      {section === 'lan' &&
        (lanStatus ? (
          <LanAccessCard status={lanStatus} />
        ) : (
          <section className="card lan-card no-print" aria-label="WLAN-Zugang">
            <h2 className="section-title no-margin">WLAN-Zugang</h2>
            <p className="muted small">
              WLAN-Zugang gibt es nur in der installierten Desktop-App. Im Browser
              auf einem Tablet oder Handy siehst du keine Adresse — du bist bereits
              über das WLAN verbunden, wenn TaskTrophy auf dem Rechner geöffnet ist.
            </p>
          </section>
        ))}

      {section === 'profile' && (
        <>
          <section className="card" aria-label="Profil">
            <div className="session__head">
              <div>
                <h2 className="section-title no-margin">Profil</h2>
                <p className="muted small">
                  Angemeldet als <strong>{user}</strong>
                  {` · ${roleLabel(role)}`}
                  {classLabel ? ` · ${classLabel}` : ''}. Die Rolle gilt für die
                  Reiter und für Klassencodes. Lehrer und Klassenlehrer nur mit
                  Lehrercode. Benutzer wechseln führt zur Auswahl wie beim Start
                  („Wer übt heute?“).
                </p>
              </div>
            </div>
            <RoleOptions
              name="profile-role"
              value={selectedRole}
              onSelect={pickRole}
            />
            {isTeacherRole(role) && !pendingRole && (
              <div className="field">
                <span className="field__label" id="profile-preferred-subjects-label">
                  Fächer
                </span>
                <div
                  className="exam-area__topics"
                  role="group"
                  aria-labelledby="profile-preferred-subjects-label"
                >
                  {SUBJECT_OPTIONS.map((label) => {
                    const checked = preferredSubjects.some(
                      (s) => s.toLowerCase() === label.toLowerCase(),
                    )
                    return (
                      <label key={label} className="exam-check">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            if (checked) {
                              if (preferredSubjects.length <= 1) return
                              onChangePreferredSubjects(
                                preferredSubjects.filter(
                                  (s) => s.toLowerCase() !== label.toLowerCase(),
                                ),
                              )
                            } else {
                              onChangePreferredSubjects([...preferredSubjects, label])
                            }
                          }}
                        />
                        <span>{label}</span>
                      </label>
                    )
                  })}
                </div>
                <p className="muted small">
                  Lehrpläne, Themen und Klausur erstellen zeigen nur die
                  ausgewählten Fächer. Mindestens eines muss aktiv bleiben.
                </p>
              </div>
            )}
            {pendingRole ? (
              <TeacherCodeGate
                id="profile-teacher-code"
                value={teacherCodeDraft}
                onChange={(next) => {
                  setTeacherCodeDraft(next)
                  setTeacherCodeError(null)
                }}
                error={teacherCodeError}
                confirmLabel="Mit Lehrercode übernehmen"
                onConfirm={confirmTeacherRole}
              />
            ) : role === 'entwickler' ? null : isTeacherRole(role) ? (
              <TeacherCodeReveal />
            ) : null}
            <button type="button" className="ghost" onClick={onSwitchUser}>
              Benutzer wechseln
            </button>
          </section>
          <RoleRightsMatrix />
          <UserManagement
            user={user}
            onRename={onRenameUser}
            onDelete={onDeleteUser}
          />
        </>
      )}

      {section === 'supporters' && <Supporters />}

      {section === 'about' && <AboutApp />}

      {section === 'info' && <DeveloperInfoPanel />}
    </div>
  )
}
