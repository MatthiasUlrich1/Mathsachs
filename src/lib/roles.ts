import type { UserData, UserRole } from './sharedState'

export type { UserRole }

/** German labels for the three app roles. */
export const USER_ROLES: { id: UserRole; label: string }[] = [
  { id: 'schueler', label: 'Schüler' },
  { id: 'eltern', label: 'Eltern' },
  { id: 'lehrer', label: 'Lehrer' },
]

export const isUserRole = (value: unknown): value is UserRole =>
  value === 'schueler' || value === 'eltern' || value === 'lehrer'

/** Missing or unknown roles default to Schüler (most restricted). */
export const normalizeRole = (role?: unknown): UserRole =>
  isUserRole(role) ? role : 'schueler'

export const canCreateExam = (role?: unknown): boolean =>
  normalizeRole(role) !== 'schueler'

export const canCreateClassCodes = (role?: unknown): boolean =>
  normalizeRole(role) !== 'schueler'

/** Klassenstufencode anlegen und Klassencodes zuordnen — nur Lehrer. */
export const canManageGradeCodes = (role?: unknown): boolean =>
  normalizeRole(role) === 'lehrer'

export const roleLabel = (role?: unknown): string => {
  const id = normalizeRole(role)
  return USER_ROLES.find((entry) => entry.id === id)?.label ?? 'Schüler'
}

/**
 * Stored role if valid. Legacy profiles without `role` become Eltern when
 * they already created class codes (they used the old full UI), otherwise
 * Schüler. A persisted Schüler stays Schüler even with leftover codes.
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
