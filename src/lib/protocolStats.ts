import {
  berlinDayKey,
  summarizeDays,
  type ClassPointSummary,
  type DayBuckets,
} from '../classCode/buckets'
import { publicClassLabel } from '../classCode/code'
import type { ClassTransferRecord, CreatedClassCode, SessionRecord } from './sharedState'

export type { ClassPointSummary } from '../classCode/buckets'

const asPoints = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0

const asDate = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null

/** Group dated point items into Berlin calendar-day buckets. */
export function itemsToDayBuckets(
  items: Array<{ date: number; points: number }>,
): DayBuckets {
  const days: DayBuckets = {}
  for (const item of items) {
    const date = asDate(item.date)
    const points = asPoints(item.points)
    if (date == null || !points) continue
    const key = berlinDayKey(date)
    days[key] = (days[key] ?? 0) + points
  }
  return days
}

/** Tag / Woche / Monat / Schuljahr / Gesamt from dated point items. */
export function summarizePointItems(
  items: Array<{ date: number; points: number }>,
  now: Date | number = Date.now(),
): ClassPointSummary {
  return summarizeDays(itemsToDayBuckets(items), now)
}

export function summarizeSessions(
  sessions: SessionRecord[],
  now: Date | number = Date.now(),
): ClassPointSummary {
  return summarizePointItems(sessions, now)
}

export interface ClassTransferGroup {
  code: string
  className: string
  label: string
  summary: ClassPointSummary
}

export interface ClassTransferTotals {
  summary: ClassPointSummary
  byClass: ClassTransferGroup[]
}

const latestName = (rows: ClassTransferRecord[]): string => {
  let best = ''
  let bestDate = -1
  for (const row of rows) {
    const name = row.className.trim()
    if (!name) continue
    if (row.date >= bestDate) {
      best = name
      bestDate = row.date
    }
  }
  return best
}

/** Overall and per-class transfer totals using the same Berlin buckets. */
export function summarizeClassTransfers(
  transfers: ClassTransferRecord[],
  now: Date | number = Date.now(),
  created: CreatedClassCode[] = [],
): ClassTransferTotals {
  const summary = summarizePointItems(transfers, now)
  const byCode = new Map<string, ClassTransferRecord[]>()
  for (const transfer of transfers) {
    const list = byCode.get(transfer.code) ?? []
    list.push(transfer)
    byCode.set(transfer.code, list)
  }
  const byClass = [...byCode.entries()]
    .map(([code, rows]) => {
      const stored = latestName(rows)
      const known = created.find((row) => row.code === code && row.name.trim())?.name
      const className = stored || known?.trim() || ''
      return {
        code,
        className,
        label: publicClassLabel(className) ?? 'Klasse',
        summary: summarizePointItems(rows, now),
      }
    })
    .sort((a, b) => b.summary.total - a.summary.total || a.code.localeCompare(b.code))
  return { summary, byClass }
}
