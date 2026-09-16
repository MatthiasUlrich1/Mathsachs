import type { UserData, UserRole } from './sharedState'

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
  value === 'entwickler'

/** Missing or unknown roles default to Schüler (most restricted). */
export const normalizeRole = (role?: unknown): UserRole =>
  isUserRole(role) ? role : 'schueler'

/** Lehrer, Klassenlehrer und Entwickler — Lehrercode-fähig. */
export const isTeacherRole = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id === 'lehrer' || id === 'klassenlehrer' || id === 'entwickler'
}

/** Unreleased curriculum topics visible (IDs / status). */
export const isCurriculumPreviewRole = (role?: unknown): boolean =>
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

/** Klausur schreiben — everyone except Klassenlehrer. */
export const canWriteExam = (role?: unknown): boolean =>
  normalizeRole(role) !== 'klassenlehrer'

export const canCreateClassCodes = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id === 'eltern' || id === 'lehrer' || id === 'entwickler'
}

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

/** Punkte an die aktive Klasse senden — nicht Klassenlehrer. */
export const canSendClassPoints = (role?: unknown): boolean =>
  normalizeRole(role) !== 'klassenlehrer'

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
  return USER_ROLES.find((entry) => entry.id === id)?.label ?? 'Schüler'
}

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
