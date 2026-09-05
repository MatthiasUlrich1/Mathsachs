import { berlinDayKey } from '../classCode/buckets'
import { LAST_UPDATE_CHECK_KEY } from './constants'

const DAY_MS = 24 * 60 * 60 * 1000
const SEARCH_STEP_MS = 250

/**
 * Whether a GitHub / electron-updater check should run now.
 * At most one check per calendar day in Europe/Berlin (same TZ as class points).
 */
export function shouldCheckForUpdate(
  lastCheckAt: number | null | undefined,
  now: number = Date.now(),
): boolean {
  if (lastCheckAt == null || !Number.isFinite(lastCheckAt) || lastCheckAt <= 0) {
    return true
  }
  return berlinDayKey(lastCheckAt) !== berlinDayKey(now)
}

/** Milliseconds until the next Europe/Berlin calendar day (at least 1s). */
export function msUntilNextBerlinDay(now: number = Date.now()): number {
  const today = berlinDayKey(now)
  let lo = now
  let hi = now + DAY_MS
  while (berlinDayKey(hi) === today) {
    hi += 12 * 60 * 60 * 1000
  }
  while (hi - lo > SEARCH_STEP_MS) {
    const mid = Math.floor((lo + hi) / 2)
    if (berlinDayKey(mid) === today) lo = mid
    else hi = mid
  }
  return Math.max(1000, hi - now)
}

export function readLastUpdateCheckAt(
  storage?: Storage | null,
): number | null {
  const store =
    storage ?? (typeof localStorage !== 'undefined' ? localStorage : undefined)
  if (!store) return null
  try {
    const raw = store.getItem(LAST_UPDATE_CHECK_KEY)
    if (!raw) return null
    const value = Number(raw)
    return Number.isFinite(value) && value > 0 ? value : null
  } catch {
    return null
  }
}

export function writeLastUpdateCheckAt(
  at: number,
  storage?: Storage | null,
): void {
  const store =
    storage ?? (typeof localStorage !== 'undefined' ? localStorage : undefined)
  if (!store) return
  try {
    store.setItem(LAST_UPDATE_CHECK_KEY, String(at))
  } catch {
    // private mode / disabled storage
  }
}
