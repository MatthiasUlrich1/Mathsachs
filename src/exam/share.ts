/** German subject for Klausurcode mail / share. */
export const EXAM_CODE_SHARE_SUBJECT = 'TaskTrophy Klausurcode'

const EXAM_CODE_SHARE_HINT =
  'Schüler öffnet die App → Klausur schreiben → Code eingeben.'

/**
 * Mail body — short explanation + Klausurcode (no LAN URL).
 * WhatsApp uses {@link examCodeWhatsAppText} (code only) so copy-paste stays clean.
 */
export function examCodeShareText(code: string, title?: string): string {
  const trimmed = title?.trim()
  const headline = trimmed
    ? `TaskTrophy Klausurcode für „${trimmed}“:`
    : `${EXAM_CODE_SHARE_SUBJECT}:`
  return `${headline}\n${code}\n\n${EXAM_CODE_SHARE_HINT}`
}

/** WhatsApp prefill — only the Klausurcode (no explanatory prefix). */
export function examCodeWhatsAppText(code: string): string {
  return code.trim()
}

export function examCodeShareSubject(): string {
  return EXAM_CODE_SHARE_SUBJECT
}

export function examCodeWhatsAppUrl(code: string, _title?: string): string {
  return `https://wa.me/?text=${encodeURIComponent(examCodeWhatsAppText(code))}`
}

/** Recipient-less mailto so the OS mail app opens a compose window. */
export function examCodeMailtoUrl(code: string, title?: string): string {
  const subject = encodeURIComponent(examCodeShareSubject())
  const body = encodeURIComponent(examCodeShareText(code, title))
  return `mailto:?subject=${subject}&body=${body}`
}
