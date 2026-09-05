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
import {
  challengePhase,
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
