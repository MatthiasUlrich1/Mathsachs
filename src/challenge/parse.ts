import { parseChallengeInstant } from './time'
import {
  DELETED_CHALLENGE_TTL_MS,
  MAX_CHALLENGE_NAME_LENGTH,
  MAX_CHALLENGE_TOPICS,
  MAX_DELETED_CHALLENGES,
  MAX_PRIZE_TEXT_LENGTH,
  type ChallengePrize,
  type ChallengeTopicRef,
  type DeletedChallenge,
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
    ...(raw.owned === true ? { owned: true } : raw.owned === false ? { owned: false } : {}),
  }
}

function pickMergedChallenge(prev: StoredChallenge, next: StoredChallenge): StoredChallenge {
  const newer = next.createdAt >= prev.createdAt ? next : prev
  const older = newer === next ? prev : next
  const owned = newer.owned === true || older.owned === true
  return {
    ...newer,
    ...(owned
      ? { owned: true }
      : newer.owned === false || older.owned === false
        ? { owned: false }
        : {}),
  }
}

export function parseStoredChallenges(raw: unknown): StoredChallenge[] {
  const list = Array.isArray(raw) ? raw : []
  const byId = new Map<string, StoredChallenge>()
  for (const item of list) {
    const parsed = parseStoredChallenge(item)
    if (!parsed) continue
    const prev = byId.get(parsed.id)
    byId.set(parsed.id, prev ? pickMergedChallenge(prev, parsed) : parsed)
  }
  return [...byId.values()].sort(
    (a, b) => b.createdAt - a.createdAt || a.id.localeCompare(b.id),
  )
}

export function parseDeletedChallenges(
  raw: unknown,
  now: number = Date.now(),
): DeletedChallenge[] {
  const list = Array.isArray(raw) ? raw : []
  const byId = new Map<string, DeletedChallenge>()
  const cutoff = now - DELETED_CHALLENGE_TTL_MS
  for (const item of list) {
    if (!isRecord(item) || typeof item.id !== 'string') continue
    const id = item.id.trim()
    if (!id) continue
    const deletedAt =
      typeof item.deletedAt === 'number' && Number.isFinite(item.deletedAt) ? item.deletedAt : 0
    if (deletedAt < cutoff) continue
    const prev = byId.get(id)
    if (!prev || deletedAt > prev.deletedAt) byId.set(id, { id, deletedAt })
  }
  return [...byId.values()]
    .sort((a, b) => b.deletedAt - a.deletedAt || a.id.localeCompare(b.id))
    .slice(0, MAX_DELETED_CHALLENGES)
}

export function applyChallengeTombstones(
  challenges: StoredChallenge[],
  deleted: DeletedChallenge[],
): { challenges: StoredChallenge[]; deletedChallenges: DeletedChallenge[] } {
  const deletedAt = new Map(deleted.map((row) => [row.id, row.deletedAt]))
  const live: StoredChallenge[] = []
  const resurrected = new Set<string>()
  for (const item of challenges) {
    const tomb = deletedAt.get(item.id)
    if (tomb != null && item.createdAt > tomb) {
      live.push(item)
      resurrected.add(item.id)
      continue
    }
    if (tomb != null) continue
    live.push(item)
  }
  return {
    challenges: live,
    deletedChallenges: deleted.filter((row) => !resurrected.has(row.id)),
  }
}

export function mergeStoredChallenges(
  base: StoredChallenge[] | undefined,
  incoming: StoredChallenge[] | undefined,
): StoredChallenge[] {
  return parseStoredChallenges([...(base ?? []), ...(incoming ?? [])])
}

export function mergeDeletedChallenges(
  base: DeletedChallenge[] | undefined,
  incoming: DeletedChallenge[] | undefined,
  now: number = Date.now(),
): DeletedChallenge[] {
  return parseDeletedChallenges([...(base ?? []), ...(incoming ?? [])], now)
}
