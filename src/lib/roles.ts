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

/** Geplant: Challenge erstellen — Lehrer und Klassenlehrer. */
export const canCreateChallengeLater = (role?: unknown): boolean => {
  const id = normalizeRole(role)
  return id === 'lehrer' || id === 'klassenlehrer'
}

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
