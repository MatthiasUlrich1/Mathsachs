import type { UserData, UserRole } from './sharedState'

export type { UserRole }

/** German labels for the four app roles. */
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
  value === 'lehrer'

/** Missing or unknown roles default to Schüler (most restricted). */
export const normalizeRole = (role?: unknown): UserRole =>
  isUserRole(role) ? role : 'schueler'

/** Lehrer and Klassenlehrer — both need the shared Lehrercode. */
export const isTeacherRole = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id === 'lehrer' || id === 'klassenlehrer'
}

/** Klausur erstellen — Eltern and Lehrer only. */
export const canCreateExam = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id === 'eltern' || id === 'lehrer'
}

/** Klausur schreiben — everyone except Klassenlehrer. */
export const canWriteExam = (role?: unknown): boolean =>
  normalizeRole(role) !== 'klassenlehrer'

export const canCreateClassCodes = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id === 'eltern' || id === 'lehrer'
}

/** Klassenstufencode anlegen — nur Lehrer. */
export const canManageGradeCodes = (role?: unknown): boolean =>
  normalizeRole(role) === 'lehrer'

/** Stufencode eintragen (secret-as-capability) — nur Lehrer. */
export const canEnterGradeCodes = (role?: unknown): boolean =>
  normalizeRole(role) === 'lehrer'

/** Vorgaben für neue Aufgaben senden — nur Lehrer. */
export const canRequestTasks = (role?: unknown): boolean =>
  normalizeRole(role) === 'lehrer'

/** Punkte an die aktive Klasse senden — nicht Klassenlehrer. */
export const canSendClassPoints = (role?: unknown): boolean =>
  normalizeRole(role) !== 'klassenlehrer'

/** Challenge anlegen — Lehrer (Klasse + Stufe) und Klassenlehrer (nur Klasse). */
export const canCreateChallenge = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id === 'lehrer' || id === 'klassenlehrer'
}

/** Klassenchallenge anlegen — Lehrer und Klassenlehrer (mit Klassencode). */
export const canCreateClassChallenge = (role?: unknown): boolean =>
  canCreateChallenge(role)

/** Stufenchallenge anlegen — nur Lehrer. */
export const canCreateGradeChallenge = (role?: unknown): boolean =>
  normalizeRole(role) === 'lehrer'

/** Challenge ändern / löschen — dieselben Rollen wie Anlegen. */
export const canManageChallenge = (role?: unknown): boolean => canCreateChallenge(role)

/** Stufenchallenge ändern / löschen — nur Lehrer. */
export const canManageGradeChallenge = (role?: unknown): boolean =>
  canCreateGradeChallenge(role)

/**
 * Challenge-Themen vom Challenge-Tab aus üben (mitmachen).
 * Eltern sehen den Tab nur lesend und üben weiter unter Themen.
 */
export const canPracticeFromChallenge = (role?: unknown): boolean =>
  normalizeRole(role) !== 'eltern'

/** @deprecated Use canCreateChallenge. Kept so older tests/imports still typecheck during edits. */
export const canCreateChallengeLater = canCreateChallenge

export const roleLabel = (role?: unknown): string => {
  const id = normalizeRole(role)
  return USER_ROLES.find((entry) => entry.id === id)?.label ?? 'Schüler'
}

/**
 * Stored role if valid. Legacy profiles without `role` become Eltern when
 * they already created class codes (they used the old full UI), otherwise
 * Schüler. A persisted Schüler stays Schüler even with leftover codes.
 * Never auto-promotes to Lehrer or Klassenlehrer.
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
