import { canCreateClassCodes, canManageGradeCodes } from '../lib/roles'

/** Shown when a Stufencode is used where a Klassencode is required. */
export const GRADE_NOT_CLASS_MESSAGE =
  'Das ist ein Klassenstufencode. Punkte gehen nur an Klassencodes.'

export const GRADE_PRIVACY_COPY =
  'Online speichert Mathsachs nur den Stufennamen, die Klassennamen und die Punktesummen — keine Vornamen, keine Benutzerkonten und keine Geräte-IDs. Der Stufencode bleibt beim Lehrer. Schüler senden Punkte nur an ihren Klassencode, sehen aber die Stände aller Klassen der Stufe.'

export const GRADE_MANAGE_HINT =
  'Nur Lehrer legen eine Klassenstufe an und ordnen Klassencodes zu. Eltern behalten das Erstellen von Klassencodes. Schüler tragen nur einen Klassencode ein.'

export interface ClassPageFlags {
  canCreateClass: boolean
  canManageGrades: boolean
}

/** Settings → Klasse: create/assign Stufe is Lehrer only; class create is Eltern+Lehrer. */
export function classPageFlags(role?: unknown): ClassPageFlags {
  return {
    canCreateClass: canCreateClassCodes(role),
    canManageGrades: canManageGradeCodes(role),
  }
}

export function assignedLocalClassCodes(
  localCodes: readonly string[],
  gradePublicId: string | undefined,
  standings: Record<string, { grade?: { id?: string } }>,
): string[] {
  if (!gradePublicId) return []
  return localCodes.filter((code) => standings[code]?.grade?.id === gradePublicId)
}
