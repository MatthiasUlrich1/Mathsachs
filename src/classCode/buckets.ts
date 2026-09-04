/** Berlin-local calendar buckets for class point totals. */

export const BERLIN_TZ = 'Europe/Berlin'

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/

export interface DayBuckets {
  [day: string]: number
}

export interface ClassPointBreakdown {
  today: number
  week: number
  month: number
  year: number
  total: number
}

export interface ClassPointPeriod {
  today: string
  week: string
  month: string
  schoolYear: string
}

export interface ClassPointSummary extends ClassPointBreakdown {
  period: ClassPointPeriod
}

const berlinParts = (at: Date | number): { year: string; month: string; day: string } => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: BERLIN_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(at))
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  return { year: get('year'), month: get('month'), day: get('day') }
}

/** Calendar date `YYYY-MM-DD` in Europe/Berlin for the given instant. */
export function berlinDayKey(at: Date | number = Date.now()): string {
  const { year, month, day } = berlinParts(at)
  return `${year}-${month}-${day}`
}

/** Schuljahr starts 1 August. Returns the start calendar year (e.g. 2025 for 2025/26). */
export function schoolYearStartYear(dayKey: string): number {
  const [year, month] = dayKey.split('-').map(Number)
  if (!year || !month) return 0
  return month >= 8 ? year : year - 1
}

/** Label like `2025/26`. */
export function schoolYearLabel(startYear: number): string {
  const end = startYear + 1
  return `${startYear}/${String(end).slice(-2)}`
}

export function monthKey(dayKey: string): string {
  return dayKey.slice(0, 7)
}

/**
 * ISO week (`YYYY-Www`) for a Berlin calendar date.
 * The date string is treated as a civil date, not a UTC instant.
 */
export function isoWeekKey(dayKey: string): string {
  const [year, month, day] = dayKey.split('-').map(Number)
  if (!year || !month || !day) return ''
  const date = new Date(Date.UTC(year, month - 1, day))
  const dow = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dow)
  const isoYear = date.getUTCFullYear()
  const jan4 = new Date(Date.UTC(isoYear, 0, 4))
  const jan4Dow = jan4.getUTCDay() || 7
  const week1Monday = new Date(jan4)
  week1Monday.setUTCDate(jan4.getUTCDate() - (jan4Dow - 1))
  const week = 1 + Math.round((date.getTime() - week1Monday.getTime()) / 604800000)
  return `${isoYear}-W${String(week).padStart(2, '0')}`
}

export function inSchoolYear(dayKey: string, startYear: number): boolean {
  return schoolYearStartYear(dayKey) === startYear
}

const asPoints = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0

/** Sum daily KV buckets into Tag / Woche / Monat / Schuljahr using Berlin `now`. */
export function summarizeDays(
  days: DayBuckets,
  now: Date | number = Date.now(),
): ClassPointSummary {
  const todayKey = berlinDayKey(now)
  const week = isoWeekKey(todayKey)
  const month = monthKey(todayKey)
  const startYear = schoolYearStartYear(todayKey)
  let today = 0
  let weekSum = 0
  let monthSum = 0
  let yearSum = 0
  let total = 0
  for (const [day, raw] of Object.entries(days ?? {})) {
    if (!DAY_RE.test(day)) continue
    const value = asPoints(raw)
    if (!value) continue
    total += value
    if (day === todayKey) today += value
    if (isoWeekKey(day) === week) weekSum += value
    if (monthKey(day) === month) monthSum += value
    if (inSchoolYear(day, startYear)) yearSum += value
  }
  return {
    today,
    week: weekSum,
    month: monthSum,
    year: yearSum,
    total,
    period: {
      today: todayKey,
      week,
      month,
      schoolYear: schoolYearLabel(startYear),
    },
  }
}

export function addDeltaToDays(
  days: DayBuckets,
  delta: number,
  now: Date | number = Date.now(),
): DayBuckets {
  const key = berlinDayKey(now)
  const next = { ...days }
  next[key] = (asPoints(next[key]) || 0) + delta
  return next
}
