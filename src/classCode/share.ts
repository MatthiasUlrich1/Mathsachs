import { formatClassCode } from './code'

/** Fallback when a created class has no stored name. */
export const CLASS_CODE_SHARE_DEFAULT_NAME = 'Klasse'

export function classCodeShareLabel(name: string): string {
  const trimmed = name.trim()
  return trimmed || CLASS_CODE_SHARE_DEFAULT_NAME
}

/** German share text, e.g. Mathsachs-Klassencode für „Klasse 6a“: ABCD-2345 */
export function classCodeShareText(name: string, code: string): string {
  return `Mathsachs-Klassencode für „${classCodeShareLabel(name)}“: ${formatClassCode(code)}`
}

export function classCodeShareSubject(name: string): string {
  return `Mathsachs-Klassencode für „${classCodeShareLabel(name)}“`
}

export function classCodeWhatsAppUrl(name: string, code: string): string {
  return `https://wa.me/?text=${encodeURIComponent(classCodeShareText(name, code))}`
}

/** Recipient-less mailto so the OS mail app opens a compose window. */
export function classCodeMailtoUrl(name: string, code: string): string {
  const subject = encodeURIComponent(classCodeShareSubject(name))
  const body = encodeURIComponent(classCodeShareText(name, code))
  return `mailto:?subject=${subject}&body=${body}`
}

export function canUseWebShare(): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return false
  }
  if (typeof navigator.canShare === 'function') {
    try {
      return navigator.canShare({ text: classCodeShareText('Klasse', 'ABCD2345') })
    } catch {
      return true
    }
  }
  return true
}

/**
 * Open WhatsApp (https) or mailto outside the app window. Desktop uses the
 * preload bridge (`shell.openExternal`); the browser uses a new tab.
 * Electron also opens target=_blank http(s)/mailto via setWindowOpenHandler.
 */
export function openClassCodeShareUrl(url: string): void {
  const desktop = typeof window !== 'undefined' ? window.mathsachs : undefined
  if (desktop?.openExternal && (/^https?:\/\//i.test(url) || /^mailto:/i.test(url))) {
    void desktop.openExternal(url)
    return
  }
  window.open(url, '_blank', 'noopener')
}
