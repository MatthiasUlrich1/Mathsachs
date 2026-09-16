import { formatClassCode, normalizeClassCode } from '../classCode/code'
import { CONTACT_EMAIL } from '../legal/content'
import { isTeacherRole, type UserRole } from './roles'

/**
 * Single shared Lehrercode for every Lehrer and Klassenlehrer.
 * Not stored on the Worker (no person data there). Same alphabet as Klassencodes.
 */
export const TEACHER_CODE = '88MXDZ92'

/**
 * Entwickler-Vorschau: Lehrer sehen auch noch nicht freigegebene Curriculum-Themen
 * (mit Themen-ID und Status). Nicht der öffentliche Lehrercode.
 */
export const DEVELOPER_CODE = 'MSDEV815'

export const DEVELOPER_CODE_WRONG = 'Der Entwicklercode ist ungültig.'

export const TEACHER_CODE_REQUEST_LABEL = 'Lehrercode anfordern'

export const TEACHER_CODE_REQUEST_SUBJECT =
  'Lehrercode für das Mathsachs Übungsprogramm.'

export const TEACHER_CODE_REQUEST_BODY = [
  'Bitte den gemeinsamen Lehrercode für Mathsachs senden.',
  '',
  'Der Code ist für alle Lehrer gleich. Er verhindert, dass Schüler sich als',
  'Lehrer oder Klassenlehrer eintragen und Stufen oder Klassen anlegen.',
  '',
  'Es werden keine Personendaten benötigt.',
].join('\n')

export const TEACHER_CODE_WRONG = 'Der Lehrercode ist ungültig.'

export function normalizeTeacherCode(raw: string): string {
  return normalizeClassCode(raw)
}

export function matchesTeacherCode(raw: string): boolean {
  return normalizeTeacherCode(raw) === TEACHER_CODE
}

export function matchesDeveloperCode(raw: string): boolean {
  return normalizeTeacherCode(raw) === normalizeTeacherCode(DEVELOPER_CODE)
}

export function formatTeacherCode(raw: string = TEACHER_CODE): string {
  return formatClassCode(raw)
}

/**
 * Switching into Lehrer or Klassenlehrer needs the code.
 * Lehrer ↔ Klassenlehrer does not (already a teacher role).
 */
export function needsTeacherCode(
  from: UserRole | null | undefined,
  to: UserRole,
): boolean {
  if (!isTeacherRole(to)) return false
  if (from && isTeacherRole(from)) return false
  return true
}

export function applyRoleChange(
  from: UserRole | null | undefined,
  to: UserRole,
  code: string,
): { ok: true; role: UserRole } | { ok: false; error: string } {
  if (!needsTeacherCode(from, to)) return { ok: true, role: to }
  if (!matchesTeacherCode(code)) return { ok: false, error: TEACHER_CODE_WRONG }
  return { ok: true, role: to }
}

/** mailto to the Impressum address — nothing is stored on the Worker. */
export function buildTeacherCodeRequestMailto(): string {
  const subject = encodeURIComponent(TEACHER_CODE_REQUEST_SUBJECT)
  const body = encodeURIComponent(TEACHER_CODE_REQUEST_BODY)
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
}
