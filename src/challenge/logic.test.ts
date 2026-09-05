import { describe, expect, it } from 'vitest'
import {
  allowedChallengeScopes,
  canOfferClassChallengeCreate,
  canOfferGradeChallengeCreate,
  challengePointsFromSessions,
  classPointsPayload,
  createChallengePayload,
  filterSessionsForChallenge,
  NO_ACTIVE_CHALLENGE_MESSAGE,
  shouldAttributeChallengePoints,
} from './logic'
import { berlinLocalToUtcMs, defaultBerlinChallengeWindow, isInChallengeWindow } from './time'
import { emptyClassCodes, emptyGradeCodes } from '../lib/sharedState'
import type { SessionRecord } from '../lib/sharedState'

const challenge = {
  topicIds: ['n5-add', 'n5-sub'],
  start: '2026-09-07T08:00',
  end: '2026-09-11T16:00',
}

const session = (
  topicId: string,
  points: number,
  date: number,
): SessionRecord => ({
  date,
  topicId,
  topicTitle: topicId,
  areaTitle: 'Test',
  attempts: 1,
  correct: 1,
  points,
})

describe('Challenge rights and empty copy', () => {
  it('uses the exact empty-state sentence', () => {
    expect(NO_ACTIVE_CHALLENGE_MESSAGE).toBe('Aktuell keine Challenge aktiv.')
  })

  it('lets Lehrer create class and grade challenges; Klassenlehrer only class', () => {
    expect(allowedChallengeScopes('lehrer')).toEqual(['class', 'grade'])
    expect(allowedChallengeScopes('klassenlehrer')).toEqual(['class'])
    expect(allowedChallengeScopes('schueler')).toEqual([])
    expect(allowedChallengeScopes('eltern')).toEqual([])
  })

  it('requires a class code for Klassenlehrer and a grade code for Stufe', () => {
    const emptyClass = emptyClassCodes()
    const withClass = {
      ...emptyClassCodes(),
      activeCode: 'ABCD2345',
      known: [{ code: 'ABCD2345', name: '6a', createdAt: 1 }],
    }
    expect(canOfferClassChallengeCreate('klassenlehrer', emptyClass)).toBe(false)
    expect(canOfferClassChallengeCreate('klassenlehrer', withClass)).toBe(true)
    expect(canOfferClassChallengeCreate('schueler', withClass)).toBe(false)
    expect(canOfferClassChallengeCreate('eltern', withClass)).toBe(false)
    expect(canOfferGradeChallengeCreate('klassenlehrer', emptyGradeCodes())).toBe(false)
    expect(
      canOfferGradeChallengeCreate('lehrer', {
        ...emptyGradeCodes(),
        created: [{ code: 'GGGG2345', name: '6', createdAt: 1 }],
      }),
    ).toBe(true)
  })
})

describe('Challenge points attribution', () => {
  it('counts selected topics inside the Berlin window and ignores others', () => {
    const inside = berlinLocalToUtcMs('2026-09-08T10:00')
    const outside = berlinLocalToUtcMs('2026-09-14T10:00')
    expect(shouldAttributeChallengePoints(challenge, 'n5-add', inside)).toBe(true)
    expect(shouldAttributeChallengePoints(challenge, 'n5-mul', inside)).toBe(false)
    expect(shouldAttributeChallengePoints(challenge, 'n5-add', outside)).toBe(false)
    expect(shouldAttributeChallengePoints(challenge, undefined, inside)).toBe(false)
    expect(isInChallengeWindow(challenge.start, challenge.end, inside)).toBe(true)

    const sessions = [
      session('n5-add', 4, inside),
      session('n5-mul', 9, inside),
      session('n5-add', 3, outside),
    ]
    expect(challengePointsFromSessions(sessions, challenge)).toBe(4)
    expect(filterSessionsForChallenge(sessions, challenge)).toHaveLength(1)
  })

  it('defaults this week to Monday 08:00–Friday 16:00 Berlin', () => {
    const window = defaultBerlinChallengeWindow(berlinLocalToUtcMs('2026-09-09T12:00'))
    expect(window.startLocal.endsWith('T08:00')).toBe(true)
    expect(window.endLocal.endsWith('T16:00')).toBe(true)
    expect(window.startLocal.startsWith('2026-09-07')).toBe(true)
    expect(window.endLocal.startsWith('2026-09-11')).toBe(true)
  })
})

describe('online payloads have no name fields', () => {
  it('posts only delta and optional topicId', () => {
    expect(classPointsPayload(5, 'n5-add')).toEqual({ delta: 5, topicId: 'n5-add' })
    expect(classPointsPayload(5)).toEqual({ delta: 5 })
    expect(JSON.stringify(classPointsPayload(5, 'n5-add'))).not.toMatch(
      /name|user|device|schueler/i,
    )
  })

  it('creates a challenge without pupil or device fields', () => {
    const body = createChallengePayload({
      scope: 'class',
      classCode: 'ABCD2345',
      name: 'Woche 36',
      topicIds: ['n5-add'],
      start: '2026-09-07T08:00',
      end: '2026-09-11T16:00',
      prize: { enabled: true, classPrize: true, classThreshold: 100, text: 'Film' },
    })
    expect(body).toEqual({
      scope: 'class',
      classCode: 'ABCD2345',
      name: 'Woche 36',
      topicIds: ['n5-add'],
      start: '2026-09-07T08:00',
      end: '2026-09-11T16:00',
      prize: { enabled: true, classPrize: true, classThreshold: 100, text: 'Film' },
    })
    expect(Object.keys(body)).not.toContain('userId')
    expect(Object.keys(body)).not.toContain('deviceId')
    expect(JSON.stringify(body)).not.toMatch(/userId|deviceId|vorname|schuelername/i)
  })
})
