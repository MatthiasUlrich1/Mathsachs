import type {
  ClassCodeSettings,
  ClassTransferRecord,
  GradeCodeSettings,
  SessionRecord,
} from '../lib/sharedState'
import { canCreateClassChallenge, canCreateGradeChallenge, type UserRole } from '../lib/roles'
import {
  mergeStoredChallenges,
  parsePrize,
  parseStoredChallenge,
  parseStoredChallenges,
  parseTopicIds,
  parseTopicRefs,
} from './parse'
import {
  challengePhase,
  isChallengeOpen,
  isInChallengeWindow,
  parseChallengeInstant,
  type ChallengePhase,
} from './time'
import {
  CHALLENGE_PHASE_LABEL,
  CLASS_GOAL_PREFIX,
  MAX_CHALLENGE_NAME_LENGTH,
  NO_ACTIVE_CHALLENGE_MESSAGE,
  type ChallengePrize,
  type ChallengeScope,
  type ChallengeTopicRef,
  type StoredChallenge,
} from './types'

export { NO_ACTIVE_CHALLENGE_MESSAGE, CHALLENGE_PHASE_LABEL, CLASS_GOAL_PREFIX }
export {
  mergeStoredChallenges,
  parsePrize,
  parseStoredChallenge,
  parseStoredChallenges,
  parseTopicIds,
  parseTopicRefs,
}
export { challengePhase, isChallengeOpen, isInChallengeWindow }
export type { ChallengePhase }

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

/** Codes a user can list Challenges for: created, entered, and active. */
export const classCodesForChallengeList = classCodesForChallengeCreate
export const gradeCodesForChallengeList = gradeCodesForChallengeCreate

export function challengeScopeLabel(scope: ChallengeScope): string {
  return scope === 'grade' ? 'Stufe' : 'Klasse'
}

export function challengePhaseLabel(phase: ChallengePhase): string {
  return CHALLENGE_PHASE_LABEL[phase]
}

/**
 * Winner category only — Klasse / Stufe / Schüler, never a pupil name.
 * For Stufe: „Klasse/Stufe“ vs „Schüler“.
 */
export function prizeAudienceLine(
  prize: ChallengePrize | undefined | null,
  scope: ChallengeScope,
): string | null {
  if (!prize?.enabled) return null
  const who: string[] = []
  if (prize.classPrize) who.push(scope === 'grade' ? 'Klasse/Stufe' : 'Klasse')
  if (prize.studentPrize) who.push('Schüler')
  if (who.length === 0) return null
  return `Wer gewinnen kann: ${who.join(' und ')}`
}

/** Visible Klassenziel when a class prize has a Punkteschwelle. */
export function classGoalLine(threshold?: number | null): string | null {
  if (typeof threshold !== 'number' || !Number.isFinite(threshold) || threshold <= 0) {
    return null
  }
  return `${CLASS_GOAL_PREFIX} ${Math.trunc(threshold)} Punkte`
}

export function challengeThreshold(
  challenge: {
    classThreshold?: number
    prize?: ChallengePrize
  },
): number | undefined {
  if (typeof challenge.classThreshold === 'number' && challenge.classThreshold > 0) {
    return Math.trunc(challenge.classThreshold)
  }
  const fromPrize = challenge.prize?.classThreshold
  return typeof fromPrize === 'number' && fromPrize > 0 ? Math.trunc(fromPrize) : undefined
}

export interface ListableChallenge {
  id: string
  scope: ChallengeScope
  start: string
  end: string
  hostCode?: string
}

function hostMatchesListedCodes(
  challenge: ListableChallenge,
  classCodes: string[],
  gradeCodes: string[],
): boolean {
  const host = challenge.hostCode?.trim()
  if (!host) return false
  return challenge.scope === 'class' ? classCodes.includes(host) : gradeCodes.includes(host)
}

function compareListedChallenges(
  a: ListableChallenge,
  b: ListableChallenge,
  now: number,
): number {
  const order: Record<ChallengePhase, number> = { active: 0, upcoming: 1, ended: 2 }
  const phaseA = challengePhase(a.start, a.end, now)
  const phaseB = challengePhase(b.start, b.end, now)
  if (order[phaseA] !== order[phaseB]) return order[phaseA] - order[phaseB]
  const startA = parseChallengeInstant(a.start)
  const startB = parseChallengeInstant(b.start)
  if (startA !== startB) return startA - startB
  return a.id.localeCompare(b.id)
}

/**
 * Lehrer/Klassenlehrer: Challenges of their Klassen/Stufen plus locally created.
 * Schüler/Eltern: Challenges linked to their class (or grade) codes.
 * Remote rows win over local copies (standings). Ended windows are dropped.
 */
export function mergeVisibleChallenges<T extends ListableChallenge>(input: {
  remote: T[]
  created: T[]
  device?: T[]
  classCodes: string[]
  gradeCodes: string[]
  includeCreated: boolean
  now?: number
}): T[] {
  const now = input.now ?? Date.now()
  const byId = new Map<string, T>()
  const consider = (row: T, allowWithoutHost: boolean) => {
    if (byId.has(row.id)) return
    if (challengePhase(row.start, row.end, now) === 'ended') return
    if (
      allowWithoutHost ||
      hostMatchesListedCodes(row, input.classCodes, input.gradeCodes)
    ) {
      byId.set(row.id, row)
    }
  }
  for (const row of input.remote) consider(row, true)
  for (const row of input.created) consider(row, input.includeCreated)
  for (const row of input.device ?? []) consider(row, false)
  return [...byId.values()].sort((a, b) => compareListedChallenges(a, b, now))
}

export type ChallengeTopicSource = {
  topicIds?: string[]
  topics?: Array<{ id: string }>
}

/** Union of stored topicIds and public `topics[].id` (Worker summaries omit topicIds). */
export function challengeTopicIds(challenge: ChallengeTopicSource): string[] {
  return parseTopicIds([
    ...(Array.isArray(challenge.topicIds) ? challenge.topicIds : []),
    ...(Array.isArray(challenge.topics) ? challenge.topics.map((topic) => topic.id) : []),
  ])
}

export type ChallengeWindowFilter = ChallengeTopicSource &
  Pick<StoredChallenge, 'start' | 'end'> & { id?: string }

type DatedChallengeItem = {
  date: number
  topicId?: string
  challengeId?: string
}

/** Protocol heading: always name the challenge so several challenges stay distinct. */
export function challengePeriodHeading(name: string): string {
  const trimmed = name.trim()
  return trimmed ? `Punkte im Challenge-Zeitraum — ${trimmed}` : 'Punkte im Challenge-Zeitraum'
}

export function challengeStandHeading(name: string): string {
  const trimmed = name.trim()
  return trimmed ? `Challenge-Stand — ${trimmed}` : 'Challenge-Stand'
}

export function challengeTransferHeading(name: string): string {
  const trimmed = name.trim()
  return trimmed ? `An die Klasse übertragen — ${trimmed}` : 'An die Klasse übertragen'
}

/**
 * Prefer an explicit challengeId (Challenge tab). Otherwise tag when exactly one
 * stored challenge is open and lists this topic.
 */
export function resolveChallengeIdForRecord(
  topicId: string | undefined,
  now: number,
  challenges: Array<ChallengeWindowFilter & { id: string }>,
  explicit?: string,
): string | undefined {
  const tagged = explicit?.trim()
  if (tagged) return tagged
  const topic = topicId?.trim()
  if (!topic) return undefined
  const matches = challenges.filter(
    (challenge) => challenge.id.trim() && shouldAttributeChallengePoints(challenge, topic, now),
  )
  return matches.length === 1 ? matches[0].id.trim() : undefined
}

function challengeWindowBounds(challenge: ChallengeWindowFilter): { from: number; to: number } | null {
  const from = parseChallengeInstant(challenge.start)
  const to = parseChallengeInstant(challenge.end)
  if (!Number.isFinite(from) || !Number.isFinite(to) || to < from) return null
  return { from, to }
}

function challengeIdMatches(
  item: DatedChallengeItem,
  challenge: ChallengeWindowFilter,
): boolean {
  const tagged = item.challengeId?.trim()
  const want = challenge.id?.trim()
  if (tagged && want) return tagged === want
  return true
}

/** Worker adds points to a challenge only when the window and topic match. */
export function shouldAttributeChallengePoints(
  challenge: ChallengeWindowFilter,
  topicId: string | undefined,
  now: number = Date.now(),
): boolean {
  const topic = topicId?.trim() ?? ''
  if (!topic) return false
  if (!challengeTopicIds(challenge).includes(topic)) return false
  return isInChallengeWindow(challenge.start, challenge.end, now)
}

/**
 * A row counts for this protocol when it is inside the Berlin window, on a
 * selected topic, and — if tagged — belongs to this challengeId.
 * Untagged legacy rows fall back to topic + window; rows tagged for another
 * challenge never leak in, even when topics and windows overlap.
 */
export function belongsToChallenge(
  item: DatedChallengeItem,
  challenge: ChallengeWindowFilter,
  requireTopic: boolean,
): boolean {
  const bounds = challengeWindowBounds(challenge)
  if (!bounds) return false
  if (item.date < bounds.from || item.date > bounds.to) return false
  if (!challengeIdMatches(item, challenge)) return false
  const topics = new Set(challengeTopicIds(challenge))
  const topic = item.topicId?.trim()
  if (requireTopic) {
    return Boolean(topic && topics.size > 0 && topics.has(topic))
  }
  if (topic && topics.size > 0) return topics.has(topic)
  return true
}

export function filterSessionsForChallenge(
  sessions: SessionRecord[],
  challenge: ChallengeWindowFilter,
): SessionRecord[] {
  return sessions.filter((session) => belongsToChallenge(session, challenge, true))
}

export function filterTransfersForChallenge(
  transfers: ClassTransferRecord[],
  challenge: ChallengeWindowFilter,
): ClassTransferRecord[] {
  return transfers.filter((transfer) => belongsToChallenge(transfer, challenge, false))
}

export function challengePointsFromSessions(
  sessions: SessionRecord[],
  challenge: ChallengeWindowFilter,
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
