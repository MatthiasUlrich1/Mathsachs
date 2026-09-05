/** German subject for Klausurcode mail / share. */
export const EXAM_CODE_SHARE_SUBJECT = 'Mathsachs Klausurcode'

const EXAM_CODE_SHARE_HINT =
  'Schüler öffnet die App → Klausur schreiben → Code eingeben.'

/** Body for WhatsApp / mailto — Klausurcode only, no LAN URL. */
export function examCodeShareText(code: string, title?: string): string {
  const trimmed = title?.trim()
  const headline = trimmed
    ? `Mathsachs Klausurcode für „${trimmed}“:`
    : `${EXAM_CODE_SHARE_SUBJECT}:`
  return `${headline}\n${code}\n\n${EXAM_CODE_SHARE_HINT}`
}

export function examCodeShareSubject(): string {
  return EXAM_CODE_SHARE_SUBJECT
}

export function examCodeWhatsAppUrl(code: string, title?: string): string {
  return `https://wa.me/?text=${encodeURIComponent(examCodeShareText(code, title))}`
}

/** Recipient-less mailto so the OS mail app opens a compose window. */
export function examCodeMailtoUrl(code: string, title?: string): string {
  const subject = encodeURIComponent(examCodeShareSubject())
  const body = encodeURIComponent(examCodeShareText(code, title))
  return `mailto:?subject=${subject}&body=${body}`
}
