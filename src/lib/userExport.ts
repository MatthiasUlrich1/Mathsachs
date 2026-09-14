import type { UserData } from './sharedState'

/** Versioned wrapper format for exported user data. */
export const USER_EXPORT_VERSION = 1

export interface UserExportFile {
  mathsachs_export_version: typeof USER_EXPORT_VERSION
  exportedAt: number
  user: UserData
}

/** Build the export payload (deep-cloned, no references to live data). */
export function buildExportPayload(data: UserData): UserExportFile {
  return {
    mathsachs_export_version: USER_EXPORT_VERSION,
    exportedAt: Date.now(),
    user: JSON.parse(JSON.stringify(data)) as UserData,
  }
}

/** Trigger a browser / Electron download of the user's export as a JSON file. */
export function downloadUserExport(data: UserData): void {
  const payload = buildExportPayload(data)
  const json = JSON.stringify(payload, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const safeName = data.name.replace(/[^a-z0-9äöüÄÖÜß]/gi, '_')
  const date = new Date().toISOString().slice(0, 10)
  a.download = `mathsachs-${safeName}-${date}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

/** Parse and validate an export JSON string. */
export function parseUserExport(
  json: string,
): { ok: true; user: UserData } | { ok: false; error: string } {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    return { ok: false, error: 'Ungültige Datei (kein gültiges JSON).' }
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { ok: false, error: 'Ungültiges Dateiformat.' }
  }
  const obj = parsed as Record<string, unknown>
  if (obj.mathsachs_export_version !== USER_EXPORT_VERSION) {
    return {
      ok: false,
      error:
        typeof obj.mathsachs_export_version === 'undefined'
          ? 'Keine Mathsachs-Exportdatei.'
          : `Unbekannte Export-Version (${String(obj.mathsachs_export_version)}).`,
    }
  }
  const user = obj.user
  if (typeof user !== 'object' || user === null || Array.isArray(user)) {
    return { ok: false, error: 'Keine Benutzerdaten in der Datei.' }
  }
  const u = user as Record<string, unknown>
  if (typeof u.name !== 'string' || !u.name.trim()) {
    return { ok: false, error: 'Kein Benutzername in den Daten.' }
  }
  // Minimal type guard: the rest is validated on import via mergeSharedState.
  return { ok: true, user: user as UserData }
}
