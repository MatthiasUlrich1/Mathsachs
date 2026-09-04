import { IGNORE_KEY, SESSION_DISMISS_KEY } from './constants'

function read(storage: Storage | undefined, key: string): string | null {
  if (!storage) return null
  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

function write(storage: Storage | undefined, key: string, value: string): void {
  if (!storage) return
  try {
    storage.setItem(key, value)
  } catch {
    // private mode / disabled storage
  }
}

/** Hide this version for the rest of the session (banner close). */
export function dismissUpdateForSession(version: string): void {
  write(typeof sessionStorage !== 'undefined' ? sessionStorage : undefined, SESSION_DISMISS_KEY, version)
}

/** Do not auto-prompt again until a newer version than this one appears. */
export function ignoreUpdateVersion(version: string): void {
  write(typeof localStorage !== 'undefined' ? localStorage : undefined, IGNORE_KEY, version)
}

export function isUpdateHidden(version: string): boolean {
  const ignored = read(
    typeof localStorage !== 'undefined' ? localStorage : undefined,
    IGNORE_KEY,
  )
  const dismissed = read(
    typeof sessionStorage !== 'undefined' ? sessionStorage : undefined,
    SESSION_DISMISS_KEY,
  )
  return ignored === version || dismissed === version
}
