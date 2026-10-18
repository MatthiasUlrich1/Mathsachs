import { formatClassCode, normalizeClassCode } from '../classCode/code'
import { CONTACT_EMAIL } from '../legal/content'
import { isTeacherRole, type UserRole } from './roles'

/**
 * Single shared Lehrercode for every Lehrer and Klassenlehrer.
 * Not stored on the Worker (no person data there). Same alphabet as Klassencodes.
 */
export const TEACHER_CODE = '88MXDZ92'

/** FNV-1a of an alternate accepted Lehrercode (not stored in plaintext). */
const TEACHER_CODE_GATE = '62b34d22'

/**
 * FNV-1a of the Prüfer-Code (not stored in plaintext).
 * Plaintext for maintainers: 88PRF875 (Klassencode-Alphabet, ohne I/O/U/L).
 */
const PRUEFER_CODE_GATE = '13de625d'

export const TEACHER_CODE_REQUEST_LABEL = 'Lehrercode anfordern'

export const TEACHER_CODE_REQUEST_SUBJECT =
  'Lehrercode für das TaskTrophy Übungsprogramm.'

export const TEACHER_CODE_REQUEST_BODY = [
  'Bitte den gemeinsamen Lehrercode für TaskTrophy senden.',
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

function codeDigest(normalized: string): string {
  let h = 2166136261
  for (let i = 0; i < normalized.length; i++) {
    h ^= normalized.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

/**
 * Valid Lehrercode access.
 * - `standard` — Lehrer / Klassenlehrer
 * - `extended` — Entwickler (unreleased topics + admin tools)
 * - `pruefer` — Prüfer (QA: locked topics + report; no Lehrer/Entwickler classroom tools)
 */
export function resolveTeacherCodeAccess(
  raw: string,
): 'standard' | 'extended' | 'pruefer' | null {
  const normalized = normalizeTeacherCode(raw)
  if (!normalized) return null
  if (normalized === TEACHER_CODE) return 'standard'
  if (codeDigest(normalized) === TEACHER_CODE_GATE) return 'extended'
  if (codeDigest(normalized) === PRUEFER_CODE_GATE) return 'pruefer'
  return null
}

export function matchesTeacherCode(raw: string): boolean {
  return resolveTeacherCodeAccess(raw) !== null
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

export type RoleChangeResult =
  | { ok: true; role: UserRole }
  | { ok: false; error: string }

export function applyRoleChange(
  from: UserRole | null | undefined,
  to: UserRole,
  code: string,
): RoleChangeResult {
  if (!needsTeacherCode(from, to)) return { ok: true, role: to }
  const access = resolveTeacherCodeAccess(code)
  if (!access) return { ok: false, error: TEACHER_CODE_WRONG }
  return { ok: true, role: roleForTeacherAccess(to, access) }
}

/**
 * Extended Lehrercode → Entwickler; Prüfer-Code → Prüfer.
 * Standard keeps the requested Lehrer/Klassenlehrer role.
 */
export function roleForTeacherAccess(
  requested: UserRole,
  access: 'standard' | 'extended' | 'pruefer',
): UserRole {
  if (access === 'extended') return 'entwickler'
  if (access === 'pruefer') return 'pruefer'
  return requested
}

/** mailto to the Impressum address — nothing is stored on the Worker. */
export function buildTeacherCodeRequestMailto(): string {
  const subject = encodeURIComponent(TEACHER_CODE_REQUEST_SUBJECT)
  const body = encodeURIComponent(TEACHER_CODE_REQUEST_BODY)
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
}
