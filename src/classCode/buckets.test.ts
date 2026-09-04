import { describe, expect, it } from 'vitest'
import {
  addDeltaToDays,
  berlinDayKey,
  isoWeekKey,
  monthKey,
  schoolYearLabel,
  schoolYearStartYear,
  summarizeDays,
} from './buckets'

/** 31 July 2026 21:59 UTC = 31 July 23:59 in Berlin (CEST, UTC+2). */
const BEFORE_ROLLOVER = Date.UTC(2026, 6, 31, 21, 59, 0)
/** 31 July 2026 22:00 UTC = 1 August 00:00 in Berlin. */
const AFTER_ROLLOVER = Date.UTC(2026, 6, 31, 22, 0, 0)

describe('berlinDayKey', () => {
  it('uses Europe/Berlin, not UTC, around the Schuljahr boundary', () => {
    expect(berlinDayKey(BEFORE_ROLLOVER)).toBe('2026-07-31')
    expect(berlinDayKey(AFTER_ROLLOVER)).toBe('2026-08-01')
  })
})

describe('school year (1 Aug–31 Jul, Berlin)', () => {
  it('assigns 31 July to the previous year and 1 August to the new year', () => {
    expect(schoolYearStartYear('2026-07-31')).toBe(2025)
    expect(schoolYearStartYear('2026-08-01')).toBe(2026)
    expect(schoolYearStartYear('2026-01-15')).toBe(2025)
    expect(schoolYearLabel(2025)).toBe('2025/26')
    expect(schoolYearLabel(2026)).toBe('2026/27')
  })
})

describe('isoWeekKey', () => {
  it('uses ISO weeks for civil dates', () => {
    expect(isoWeekKey('2026-01-01')).toBe('2026-W01')
    expect(isoWeekKey('2025-12-29')).toBe('2026-W01')
    expect(isoWeekKey('2025-12-28')).toBe('2025-W52')
    expect(monthKey('2026-09-04')).toBe('2026-09')
  })
})

describe('summarizeDays', () => {
  it('sums Tag / Woche / Monat / Schuljahr from daily buckets', () => {
    const now = Date.UTC(2026, 8, 4, 10, 0, 0) // 4 Sep 2026 12:00 Berlin
    const days = {
      '2026-09-04': 5,
      '2026-09-01': 3,
      '2026-08-20': 7,
      '2026-07-31': 11,
      '2025-09-01': 2,
    }
    const summary = summarizeDays(days, now)
    expect(summary.today).toBe(5)
    expect(summary.week).toBe(8) // Mon 31 Aug 2026 starts week 36; 1+4 Sep
    expect(summary.month).toBe(8)
    expect(summary.year).toBe(15) // Aug 20 + Sep 1 + Sep 4 (not Jul 31)
    expect(summary.total).toBe(28)
    expect(summary.period.schoolYear).toBe('2026/27')
    expect(summary.period.today).toBe('2026-09-04')
  })

  it('adds a delta onto the Berlin calendar day', () => {
    const now = AFTER_ROLLOVER
    expect(addDeltaToDays({ '2026-07-31': 2 }, 4, now)).toEqual({
      '2026-07-31': 2,
      '2026-08-01': 4,
    })
  })
})
