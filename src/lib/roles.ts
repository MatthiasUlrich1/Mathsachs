import type { UserData, UserRole } from './sharedState'
import {
  TASK_AUTHORING_ENABLED,
  TASK_AUTHORING_SHOW_FOR_LEHRER,
} from './taskAuthoringFlags'

export type { UserRole }

/** Roles offered when creating a profile or changing role in settings. */
export const USER_ROLES: { id: UserRole; label: string }[] = [
  { id: 'schueler', label: 'Schüler' },
  { id: 'eltern', label: 'Eltern' },
  { id: 'klassenlehrer', label: 'Klassenlehrer' },
  { id: 'lehrer', label: 'Lehrer' },
]

export const isUserRole = (value: unknown): value is UserRole =>
  value === 'schueler' ||
  value === 'eltern' ||
  value === 'klassenlehrer' ||
  value === 'lehrer' ||
  value === 'entwickler' ||
  value === 'pruefer'

/** Missing or unknown roles default to Schüler (most restricted). */
export const normalizeRole = (role?: unknown): UserRole =>
  isUserRole(role) ? role : 'schueler'

/**
 * Classroom teacher roles (Lehrercode-fähig for Lehrer/Klassenlehrer unlock).
 * Prüfer unlocks via Prüfer-Code but is QA-only — not a teacher role.
 */
export const isTeacherRole = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id === 'lehrer' || id === 'klassenlehrer' || id === 'entwickler'
}

/** Unreleased curriculum topics visible (IDs / status). */
export const isCurriculumPreviewRole = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id === 'entwickler' || id === 'pruefer'
}

/** Fehlerhafte-Aufgaben-Liste (Admin) — nur Entwickler. */
export const canViewFaultyReports = (role?: unknown): boolean =>
  normalizeRole(role) === 'entwickler'

/** Anonymous telemetry panel (Schüler-Antwortzähler). */
export const canViewDeveloperInfo = (role?: unknown): boolean =>
  normalizeRole(role) === 'entwickler'

/** Klausur erstellen — Eltern, Lehrer und Entwickler. */
export const canCreateExam = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id === 'eltern' || id === 'lehrer' || id === 'entwickler'
}

/** Klausur einer Klasse zuordnen / verwalten — Lehrer und Entwickler. */
export const canAssignClassExam = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id === 'lehrer' || id === 'entwickler'
}

/** Klausur schreiben — not Klassenlehrer, not Prüfer (QA-only). */
export const canWriteExam = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id !== 'klassenlehrer' && id !== 'pruefer'
}

export const canCreateClassCodes = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id === 'eltern' || id === 'lehrer' || id === 'entwickler'
}

/** Einstellungen → Klasse (Klassencode eintragen/anlegen). Prüfer: nein. */
export const canAccessClassSettings = (role?: unknown): boolean =>
  normalizeRole(role) !== 'pruefer'

/** Klassenstufencode anlegen — Lehrer und Entwickler. */
export const canManageGradeCodes = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id === 'lehrer' || id === 'entwickler'
}

/** Stufencode eintragen — Lehrer und Entwickler. */
export const canEnterGradeCodes = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id === 'lehrer' || id === 'entwickler'
}

/** Vorgaben für neue Aufgaben senden — Lehrer und Entwickler. */
export const canRequestTasks = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id === 'lehrer' || id === 'entwickler'
}

/**
 * Capability: use Aufgabengenerator (save drafts, submit for review).
 * Lehrer + Entwickler. UI visibility is separate — see canSeeTaskAuthoringUI.
 */
export const canAuthorTasks = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id === 'lehrer' || id === 'entwickler'
}

/** Capability: review authored drafts — Entwickler only. */
export const canReviewAuthoredTasks = (role?: unknown): boolean =>
  normalizeRole(role) === 'entwickler'

/**
 * Settings UI visibility for Aufgabengenerator.
 * Capability (canAuthorTasks) includes Lehrer; visibility is flag-gated for QA.
 */
export const canSeeTaskAuthoringUI = (role?: unknown): boolean => {
  if (!TASK_AUTHORING_ENABLED) return false
  const id = normalizeRole(role)
  if (id === 'entwickler') return true
  if (id === 'lehrer') return TASK_AUTHORING_SHOW_FOR_LEHRER
  return false
}

/** Settings UI visibility for Aufgaben-Prüfung (Entwickler + feature enabled). */
export const canSeeTaskAuthoringReviewUI = (role?: unknown): boolean =>
  TASK_AUTHORING_ENABLED && canReviewAuthoredTasks(role)

/** Punkte an die aktive Klasse senden — nicht Klassenlehrer, nicht Prüfer. */
export const canSendClassPoints = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id !== 'klassenlehrer' && id !== 'pruefer'
}

/** Challenge anlegen — Lehrer/Entwickler (Klasse + Stufe) und Klassenlehrer (nur Klasse). */
export const canCreateChallenge = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id === 'lehrer' || id === 'klassenlehrer' || id === 'entwickler'
}

export const canCreateClassChallenge = (role?: unknown): boolean =>
  canCreateChallenge(role)

export const canCreateGradeChallenge = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id === 'lehrer' || id === 'entwickler'
}

export const canManageChallenge = (role?: unknown): boolean => canCreateChallenge(role)

export const canManageGradeChallenge = (role?: unknown): boolean =>
  canCreateGradeChallenge(role)

export const canPracticeFromChallenge = (role?: unknown): boolean =>
  normalizeRole(role) !== 'eltern'

/** @deprecated Use canCreateChallenge. */
export const canCreateChallengeLater = canCreateChallenge

export const roleLabel = (role?: unknown): string => {
  const id = normalizeRole(role)
  if (id === 'entwickler') return 'Entwickler'
  if (id === 'pruefer') return 'Prüfer'
  return USER_ROLES.find((entry) => entry.id === id)?.label ?? 'Schüler'
}

/** Prüfkriterien for the Prüfer profile (content QA checklist). */
export const PRUEFER_CRITERIA: readonly string[] = [
  'Prüfung auf Rechtschreibung und Grammatik',
  'Ergibt die Aufgabe Sinn?',
  'Ist die Aufgabe wirklich mit Schulstoff verbunden oder eher Meta-Frage?',
  'Könnte man den Aufgabentyp mit besseren grafischen Elementen oder anderer Interaktion interessanter machen?',
  'Verbesserungsvorschläge',
]

/**
 * Stored role if valid. Legacy profiles without `role` become Eltern when
 * they already created class codes, otherwise Schüler.
 * Never auto-promotes to Lehrer, Klassenlehrer or Entwickler.
 */
export const roleForUser = (user?: Partial<UserData> | null): UserRole => {
  if (isUserRole(user?.role)) return user.role
  if ((user?.classCodes?.created?.length ?? 0) > 0) return 'eltern'
  return 'schueler'
}

/** Incoming role wins when set; otherwise keep the base role. */
export const pickMergedRole = (
  base?: UserRole,
  incoming?: UserRole,
): UserRole | undefined => {
  if (isUserRole(incoming)) return incoming
  if (isUserRole(base)) return base
  return undefined
}
