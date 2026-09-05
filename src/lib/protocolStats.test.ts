import { describe, expect, it } from 'vitest'
import {
  itemsToDayBuckets,
  summarizeClassTransfers,
  summarizeSessions,
} from './protocolStats'
import type { ClassTransferRecord, SessionRecord } from './sharedState'

/** 4 Sep 2026 12:00 Berlin (CEST). Same fixture as buckets.test.ts. */
const NOW = Date.UTC(2026, 8, 4, 10, 0, 0)

const atBerlinNoon = (isoDay: string): number => {
  const [year, month, day] = isoDay.split('-').map(Number)
  return Date.UTC(year, month - 1, day, 10, 0, 0)
}

const session = (day: string, points: number, topicId = 'brueche'): SessionRecord => ({
  date: atBerlinNoon(day),
  topicId,
  topicTitle: topicId,
  areaTitle: 'Zahlen',
  attempts: 1,
  correct: 1,
  points,
})

const transfer = (
  day: string,
  points: number,
  code: string,
  className = '',
): ClassTransferRecord => ({
  date: atBerlinNoon(day),
  code,
  className,
  points,
})

describe('summarizeSessions', () => {
  it('aggregates local session points into Tag / Woche / Monat / Schuljahr', () => {
    const sessions = [
      session('2026-09-04', 5),
      session('2026-09-01', 3),
      session('2026-08-20', 7),
      session('2026-07-31', 11),
      session('2025-09-01', 2),
    ]
    const summary = summarizeSessions(sessions, NOW)
    expect(summary.today).toBe(5)
    expect(summary.week).toBe(8)
    expect(summary.month).toBe(8)
    expect(summary.year).toBe(15)
    expect(summary.total).toBe(28)
    expect(summary.period.schoolYear).toBe('2026/27')
    expect(summary.period.today).toBe('2026-09-04')
  })

  it('ignores zero or invalid point rows', () => {
    const sessions = [
      session('2026-09-04', 0),
      session('2026-09-04', -2),
      session('2026-09-04', 4),
    ]
    expect(summarizeSessions(sessions, NOW).today).toBe(4)
    expect(itemsToDayBuckets(sessions)).toEqual({ '2026-09-04': 4 })
  })
})

describe('summarizeClassTransfers', () => {
  it('sums transferred points overall and per class', () => {
    const transfers = [
      transfer('2026-09-04', 5, 'AAAA1111', 'Klasse 6a'),
      transfer('2026-09-01', 3, 'AAAA1111', 'Klasse 6a'),
      transfer('2026-08-20', 7, 'BBBB2222', 'Klasse 6b'),
      transfer('2026-07-31', 11, 'AAAA1111', 'Klasse 6a'),
    ]
    const totals = summarizeClassTransfers(transfers, NOW)
    expect(totals.summary.today).toBe(5)
    expect(totals.summary.week).toBe(8)
    expect(totals.summary.month).toBe(8)
    expect(totals.summary.year).toBe(15)
    expect(totals.summary.total).toBe(26)
    expect(totals.byClass).toHaveLength(2)
    expect(totals.byClass[0]).toMatchObject({
      code: 'AAAA1111',
      className: 'Klasse 6a',
      label: 'Klasse 6a',
    })
    expect(totals.byClass[0].summary.total).toBe(19)
    expect(totals.byClass[0].summary.year).toBe(8)
    expect(totals.byClass[1]).toMatchObject({
      code: 'BBBB2222',
      label: 'Klasse 6b',
    })
    expect(totals.byClass[1].summary.total).toBe(7)
    expect(totals.byClass[1].summary.year).toBe(7)
  })

  it('uses a known class name and never the formatted code as the label', () => {
    const transfers = [transfer('2026-09-04', 4, '8G4Y0CV6')]
    const unnamed = summarizeClassTransfers(transfers, NOW)
    expect(unnamed.byClass[0].label).toBe('Klasse')
    expect(unnamed.byClass[0].label).not.toBe('8G4Y-0CV6')

    const named = summarizeClassTransfers(transfers, NOW, [
      { code: '8G4Y0CV6', name: '6/6', createdAt: 1 },
    ])
    expect(named.byClass[0].label).toBe('6/6')
    expect(named.byClass[0].className).toBe('6/6')
  })
})
