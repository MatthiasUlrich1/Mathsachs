import { afterEach, describe, expect, it, vi } from 'vitest'
import { LAST_UPDATE_CHECK_KEY } from './constants'
import {
  msUntilNextBerlinDay,
  readLastUpdateCheckAt,
  shouldCheckForUpdate,
  writeLastUpdateCheckAt,
} from './schedule'

function memoryStorage(): Storage {
  const map = new Map<string, string>()
  return {
    get length() {
      return map.size
    },
    clear: () => map.clear(),
    getItem: (key: string) => map.get(key) ?? null,
    key: (index: number) => [...map.keys()][index] ?? null,
    removeItem: (key: string) => {
      map.delete(key)
    },
    setItem: (key: string, value: string) => {
      map.set(key, value)
    },
  }
}

/** 5 Sep 2026 06:00 UTC = 08:00 in Berlin (CEST). */
const SAT_MORNING = Date.UTC(2026, 8, 5, 6, 0, 0)
/** 5 Sep 2026 20:00 UTC = 22:00 in Berlin, same calendar day. */
const SAT_EVENING = Date.UTC(2026, 8, 5, 20, 0, 0)
/** 4 Sep 2026 21:59 UTC = 23:59 in Berlin. */
const FRI_BEFORE_MIDNIGHT = Date.UTC(2026, 8, 4, 21, 59, 0)
/** 4 Sep 2026 22:00 UTC = 00:00 Saturday in Berlin. */
const SAT_MIDNIGHT = Date.UTC(2026, 8, 4, 22, 0, 0)

describe('shouldCheckForUpdate', () => {
  it('checks when there is no previous timestamp', () => {
    expect(shouldCheckForUpdate(null, SAT_MORNING)).toBe(true)
    expect(shouldCheckForUpdate(undefined, SAT_MORNING)).toBe(true)
    expect(shouldCheckForUpdate(0, SAT_MORNING)).toBe(true)
  })

  it('skips a second check on the same Berlin calendar day', () => {
    expect(shouldCheckForUpdate(SAT_MORNING, SAT_EVENING)).toBe(false)
    expect(shouldCheckForUpdate(SAT_MORNING, SAT_MORNING)).toBe(false)
  })

  it('checks again after Berlin midnight even if less than 24h passed', () => {
    expect(shouldCheckForUpdate(FRI_BEFORE_MIDNIGHT, SAT_MIDNIGHT)).toBe(true)
    expect(shouldCheckForUpdate(FRI_BEFORE_MIDNIGHT, SAT_MORNING)).toBe(true)
  })

  it('does not treat a 15-hour same-day gap as a new check', () => {
    expect(shouldCheckForUpdate(SAT_MORNING, SAT_EVENING)).toBe(false)
  })
})

describe('msUntilNextBerlinDay', () => {
  it('returns the remaining time until the next Berlin calendar day', () => {
    const wait = msUntilNextBerlinDay(FRI_BEFORE_MIDNIGHT)
    expect(wait).toBeGreaterThanOrEqual(60_000)
    expect(wait).toBeLessThan(61_000)
  })

  it('is about a day when called at Berlin midnight', () => {
    const wait = msUntilNextBerlinDay(SAT_MIDNIGHT)
    expect(wait).toBeGreaterThan(23 * 60 * 60 * 1000)
    expect(wait).toBeLessThanOrEqual(26 * 60 * 60 * 1000)
  })
})

describe('last update-check persistence', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reads and writes the last-check timestamp', () => {
    const local = memoryStorage()
    expect(readLastUpdateCheckAt(local)).toBeNull()
    writeLastUpdateCheckAt(SAT_MORNING, local)
    expect(local.getItem(LAST_UPDATE_CHECK_KEY)).toBe(String(SAT_MORNING))
    expect(readLastUpdateCheckAt(local)).toBe(SAT_MORNING)
    expect(shouldCheckForUpdate(readLastUpdateCheckAt(local), SAT_EVENING)).toBe(
      false,
    )
  })
})
