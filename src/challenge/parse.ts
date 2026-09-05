import { parseChallengeInstant } from './time'
import {
  MAX_CHALLENGE_NAME_LENGTH,
  MAX_CHALLENGE_TOPICS,
  MAX_PRIZE_TEXT_LENGTH,
  type ChallengePrize,
  type ChallengeTopicRef,
  type StoredChallenge,
} from './types'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export function parsePrize(raw: unknown): ChallengePrize {
  if (!isRecord(raw)) return { enabled: false }
  const text =
    typeof raw.text === 'string' ? raw.text.trim().slice(0, MAX_PRIZE_TEXT_LENGTH) : ''
  const thresholdRaw = raw.classThreshold
  const classThreshold =
    typeof thresholdRaw === 'number' && Number.isFinite(thresholdRaw) && thresholdRaw > 0
      ? Math.trunc(thresholdRaw)
      : undefined
  return {
    enabled: Boolean(raw.enabled),
    ...(raw.classPrize ? { classPrize: true } : {}),
    ...(raw.studentPrize ? { studentPrize: true } : {}),
    ...(classThreshold != null ? { classThreshold } : {}),
    ...(text ? { text } : {}),
  }
}

export function parseTopicIds(raw: unknown): string[] {
  const list = Array.isArray(raw) ? raw : []
  const out: string[] = []
  const seen = new Set<string>()
  for (const item of list) {
    if (typeof item !== 'string') continue
    const id = item.trim()
    if (!id || seen.has(id)) continue
    seen.add(id)
    out.push(id)
    if (out.length >= MAX_CHALLENGE_TOPICS) break
  }
  return out
}

export function parseTopicRefs(raw: unknown, topicIds: string[]): ChallengeTopicRef[] {
  const byId = new Map<string, string>()
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (!isRecord(item) || typeof item.id !== 'string') continue
      const id = item.id.trim()
      if (!id) continue
      const title = typeof item.title === 'string' ? item.title.trim().slice(0, 80) : ''
      if (title) byId.set(id, title)
    }
  }
  return topicIds.map((id) => {
    const title = byId.get(id)
    return title ? { id, title } : { id }
  })
}

export function parseStoredChallenge(raw: unknown): StoredChallenge | null {
  if (!isRecord(raw)) return null
  const id = typeof raw.id === 'string' ? raw.id.trim() : ''
  const scope = raw.scope === 'grade' ? 'grade' : raw.scope === 'class' ? 'class' : ''
  const hostCode = typeof raw.hostCode === 'string' ? raw.hostCode.trim() : ''
  const name = typeof raw.name === 'string' ? raw.name.trim().slice(0, MAX_CHALLENGE_NAME_LENGTH) : ''
  const topicIds = parseTopicIds(raw.topicIds)
  const start = typeof raw.start === 'string' ? raw.start.trim() : ''
  const end = typeof raw.end === 'string' ? raw.end.trim() : ''
  if (!id || !scope || !hostCode || !name || topicIds.length === 0 || !start || !end) {
    return null
  }
  if (!Number.isFinite(parseChallengeInstant(start)) || !Number.isFinite(parseChallengeInstant(end))) {
    return null
  }
  return {
    id,
    scope,
    hostCode,
    name,
    topicIds,
    topics: parseTopicRefs(raw.topics, topicIds),
    start,
    end,
    prize: parsePrize(raw.prize),
    createdAt:
      typeof raw.createdAt === 'number' && Number.isFinite(raw.createdAt) ? raw.createdAt : 0,
  }
}

export function parseStoredChallenges(raw: unknown): StoredChallenge[] {
  const list = Array.isArray(raw) ? raw : []
  const byId = new Map<string, StoredChallenge>()
  for (const item of list) {
    const parsed = parseStoredChallenge(item)
    if (!parsed) continue
    const prev = byId.get(parsed.id)
    if (!prev || parsed.createdAt >= prev.createdAt) byId.set(parsed.id, parsed)
  }
  return [...byId.values()].sort(
    (a, b) => b.createdAt - a.createdAt || a.id.localeCompare(b.id),
  )
}

export function mergeStoredChallenges(
  base: StoredChallenge[] | undefined,
  incoming: StoredChallenge[] | undefined,
): StoredChallenge[] {
  return parseStoredChallenges([...(base ?? []), ...(incoming ?? [])])
}
