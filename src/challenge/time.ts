/** Challenge windows use Europe/Berlin wall-clock, same as class-point days. */
export const CHALLENGE_TZ = 'Europe/Berlin'

const LOCAL_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/

const berlinParts = (at: number) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: CHALLENGE_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
    hour12: false,
  }).formatToParts(new Date(at))
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''
  const hour = get('hour') === '24' ? '00' : get('hour')
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour,
    minute: get('minute'),
    second: get('second'),
    weekday: get('weekday'),
  }
}

/** Interpret `YYYY-MM-DDTHH:mm` as Berlin local time and return UTC ms. */
export function berlinLocalToUtcMs(local: string): number {
  const match = LOCAL_RE.exec(String(local || '').trim())
  if (!match) return Number.NaN
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const hour = Number(match[4])
  const minute = Number(match[5])
  const second = Number(match[6] ?? 0)
  const utc = Date.UTC(year, month - 1, day, hour, minute, second)
  const shown = berlinParts(utc)
  const shownUtc = Date.UTC(
    Number(shown.year),
    Number(shown.month) - 1,
    Number(shown.day),
    Number(shown.hour),
    Number(shown.minute),
    Number(shown.second),
  )
  return utc - (shownUtc - utc)
}

export function msToBerlinLocal(ms: number): string {
  const parts = berlinParts(ms)
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`
}

/** ISO with offset, or a Berlin-local `YYYY-MM-DDTHH:mm` string. */
export function parseChallengeInstant(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value !== 'string') return Number.NaN
  const trimmed = value.trim()
  if (LOCAL_RE.test(trimmed) && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(trimmed)) {
    return berlinLocalToUtcMs(trimmed)
  }
  const parsed = Date.parse(trimmed)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

export function isInChallengeWindow(
  start: unknown,
  end: unknown,
  now: number = Date.now(),
): boolean {
  const from = parseChallengeInstant(start)
  const to = parseChallengeInstant(end)
  if (!Number.isFinite(from) || !Number.isFinite(to) || to < from) return false
  return now >= from && now <= to
}

/** Upcoming or currently running — not yet past the end (Europe/Berlin). */
export function isChallengeOpen(
  start: unknown,
  end: unknown,
  now: number = Date.now(),
): boolean {
  const from = parseChallengeInstant(start)
  const to = parseChallengeInstant(end)
  if (!Number.isFinite(from) || !Number.isFinite(to) || to < from) return false
  return now <= to
}

export type ChallengePhase = 'upcoming' | 'active' | 'ended'

export function challengePhase(
  start: unknown,
  end: unknown,
  now: number = Date.now(),
): ChallengePhase {
  const from = parseChallengeInstant(start)
  const to = parseChallengeInstant(end)
  if (!Number.isFinite(from) || !Number.isFinite(to) || to < from) return 'ended'
  if (now < from) return 'upcoming'
  if (now > to) return 'ended'
  return 'active'
}

const WEEKDAY_TO_MONDAY_OFFSET: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
}

/** Example window: this week's Monday 08:00 – Friday 16:00 (Berlin). */
export function defaultBerlinChallengeWindow(
  now: number = Date.now(),
): { startLocal: string; endLocal: string } {
  const parts = berlinParts(now)
  const offset = WEEKDAY_TO_MONDAY_OFFSET[parts.weekday] ?? 0
  const mondayGuess = berlinLocalToUtcMs(
    `${parts.year}-${parts.month}-${parts.day}T00:00`,
  )
  const monday = mondayGuess - offset * 86_400_000
  const mondayParts = berlinParts(monday)
  const friday = monday + 4 * 86_400_000
  const fridayParts = berlinParts(friday)
  return {
    startLocal: `${mondayParts.year}-${mondayParts.month}-${mondayParts.day}T08:00`,
    endLocal: `${fridayParts.year}-${fridayParts.month}-${fridayParts.day}T16:00`,
  }
}
