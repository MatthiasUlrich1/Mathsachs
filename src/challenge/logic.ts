import type { ClassCodeSettings, GradeCodeSettings, SessionRecord } from '../lib/sharedState'
import { canCreateClassChallenge, canCreateGradeChallenge, type UserRole } from '../lib/roles'
import {
  mergeStoredChallenges,
  parsePrize,
  parseStoredChallenge,
  parseStoredChallenges,
  parseTopicIds,
  parseTopicRefs,
} from './parse'
import { isInChallengeWindow, parseChallengeInstant } from './time'
import {
  MAX_CHALLENGE_NAME_LENGTH,
  NO_ACTIVE_CHALLENGE_MESSAGE,
  type ChallengePrize,
  type ChallengeScope,
  type ChallengeTopicRef,
  type StoredChallenge,
} from './types'

export { NO_ACTIVE_CHALLENGE_MESSAGE }
export {
  mergeStoredChallenges,
  parsePrize,
  parseStoredChallenge,
  parseStoredChallenges,
  parseTopicIds,
  parseTopicRefs,
}

export function classCodesForChallengeCreate(
  settings: ClassCodeSettings | undefined | null,
): string[] {
  if (!settings) return []
  const codes = new Set<string>()
  for (const row of settings.created) codes.add(row.code)
  for (const row of settings.known ?? []) codes.add(row.code)
  if (settings.activeCode) codes.add(settings.activeCode)
  return [...codes]
}

export function gradeCodesForChallengeCreate(
  settings: GradeCodeSettings | undefined | null,
): string[] {
  if (!settings) return []
  const codes = new Set<string>()
  for (const row of settings.created ?? []) codes.add(row.code)
  for (const row of settings.known ?? []) codes.add(row.code)
  return [...codes]
}

export function canOfferClassChallengeCreate(
  role: UserRole | unknown,
  settings: ClassCodeSettings | undefined | null,
): boolean {
  return canCreateClassChallenge(role) && classCodesForChallengeCreate(settings).length > 0
}

export function canOfferGradeChallengeCreate(
  role: UserRole | unknown,
  settings: GradeCodeSettings | undefined | null,
): boolean {
  return canCreateGradeChallenge(role) && gradeCodesForChallengeCreate(settings).length > 0
}

export function allowedChallengeScopes(role: UserRole | unknown): ChallengeScope[] {
  const scopes: ChallengeScope[] = []
  if (canCreateClassChallenge(role)) scopes.push('class')
  if (canCreateGradeChallenge(role)) scopes.push('grade')
  return scopes
}

/** Worker adds points to a challenge only when the window and topic match. */
export function shouldAttributeChallengePoints(
  challenge: Pick<StoredChallenge, 'topicIds' | 'start' | 'end'>,
  topicId: string | undefined,
  now: number = Date.now(),
): boolean {
  const topic = topicId?.trim() ?? ''
  if (!topic) return false
  if (!challenge.topicIds.includes(topic)) return false
  return isInChallengeWindow(challenge.start, challenge.end, now)
}

export function filterSessionsForChallenge(
  sessions: SessionRecord[],
  challenge: Pick<StoredChallenge, 'topicIds' | 'start' | 'end'>,
): SessionRecord[] {
  const from = parseChallengeInstant(challenge.start)
  const to = parseChallengeInstant(challenge.end)
  const topics = new Set(challenge.topicIds)
  return sessions.filter((session) => {
    if (!topics.has(session.topicId)) return false
    if (!Number.isFinite(from) || !Number.isFinite(to)) return false
    return session.date >= from && session.date <= to
  })
}

export function challengePointsFromSessions(
  sessions: SessionRecord[],
  challenge: Pick<StoredChallenge, 'topicIds' | 'start' | 'end'>,
): number {
  return filterSessionsForChallenge(sessions, challenge).reduce(
    (sum, session) => sum + (session.points > 0 ? session.points : 0),
    0,
  )
}

/** Points POST body: class code travels in the URL; never names or user ids. */
export function classPointsPayload(
  delta: number,
  topicId?: string,
): { delta: number; topicId?: string } {
  const body: { delta: number; topicId?: string } = { delta: Math.trunc(delta) }
  const topic = topicId?.trim()
  if (topic) body.topicId = topic
  return body
}

export function createChallengePayload(input: {
  scope: ChallengeScope
  classCode?: string
  gradeCode?: string
  name: string
  topicIds: string[]
  topics?: ChallengeTopicRef[]
  start: string
  end: string
  prize: ChallengePrize
}): Record<string, unknown> {
  const body: Record<string, unknown> = {
    scope: input.scope,
    name: input.name.trim().slice(0, MAX_CHALLENGE_NAME_LENGTH),
    topicIds: parseTopicIds(input.topicIds),
    start: input.start,
    end: input.end,
    prize: parsePrize(input.prize),
  }
  if (input.scope === 'class' && input.classCode) body.classCode = input.classCode
  if (input.scope === 'grade' && input.gradeCode) body.gradeCode = input.gradeCode
  if (input.topics?.length) body.topics = parseTopicRefs(input.topics, body.topicIds as string[])
  return body
}
