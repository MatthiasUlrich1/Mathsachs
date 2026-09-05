import { describe, expect, it } from 'vitest'
import {
  allowedChallengeScopes,
  canOfferClassChallengeCreate,
  canOfferGradeChallengeCreate,
  challengePhase,
  challengePointsFromSessions,
  challengeTopicIds,
  classCodesForChallengeList,
  classGoalLine,
  classPointsPayload,
  createChallengePayload,
  filterSessionsForChallenge,
  filterTransfersForChallenge,
  mergeVisibleChallenges,
  NO_ACTIVE_CHALLENGE_MESSAGE,
  prizeAudienceLine,
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

  it('reads topic ids from Worker summaries that only send topics[]', () => {
    expect(
      challengeTopicIds({
        topics: [{ id: 'n5-add' }, { id: 'n5-sub' }],
      }),
    ).toEqual(['n5-add', 'n5-sub'])
    expect(
      shouldAttributeChallengePoints(
        { topics: [{ id: 'n5-add' }], start: challenge.start, end: challenge.end },
        'n5-add',
        berlinLocalToUtcMs('2026-09-08T10:00'),
      ),
    ).toBe(true)
  })

  it('counts transfers in the window and matching topic, including legacy rows without topicId', () => {
    const inside = berlinLocalToUtcMs('2026-09-08T10:00')
    const outside = berlinLocalToUtcMs('2026-09-14T10:00')
    const transfers = [
      { date: inside, code: 'ABCD2345', className: '6a', points: 4, topicId: 'n5-add' },
      { date: inside, code: 'ABCD2345', className: '6a', points: 9, topicId: 'n5-mul' },
      { date: outside, code: 'ABCD2345', className: '6a', points: 3, topicId: 'n5-add' },
      { date: inside, code: 'ABCD2345', className: '6a', points: 2 },
    ]
    expect(filterTransfersForChallenge(transfers, challenge).map((row) => row.points)).toEqual([
      4, 2,
    ])
  })

  it('defaults this week to Monday 08:00–Friday 16:00 Berlin', () => {
    const window = defaultBerlinChallengeWindow(berlinLocalToUtcMs('2026-09-09T12:00'))
    expect(window.startLocal.endsWith('T08:00')).toBe(true)
    expect(window.endLocal.endsWith('T16:00')).toBe(true)
    expect(window.startLocal.startsWith('2026-09-07')).toBe(true)
    expect(window.endLocal.startsWith('2026-09-11')).toBe(true)
  })
})

describe('Challenge visibility and prize copy', () => {
  const now = Date.parse('2026-09-08T10:00:00+02:00')

  it('labels Klasse/Schüler and Klasse/Stufe vs Schüler, never a person name', () => {
    expect(
      prizeAudienceLine({ enabled: true, classPrize: true, studentPrize: true }, 'class'),
    ).toBe('Wer gewinnen kann: Klasse und Schüler')
    expect(prizeAudienceLine({ enabled: true, classPrize: true }, 'class')).toBe(
      'Wer gewinnen kann: Klasse',
    )
    expect(prizeAudienceLine({ enabled: true, studentPrize: true }, 'class')).toBe(
      'Wer gewinnen kann: Schüler',
    )
    expect(
      prizeAudienceLine({ enabled: true, classPrize: true, studentPrize: true }, 'grade'),
    ).toBe('Wer gewinnen kann: Klasse/Stufe und Schüler')
    expect(prizeAudienceLine({ enabled: true, classPrize: true }, 'grade')).toBe(
      'Wer gewinnen kann: Klasse/Stufe',
    )
    expect(prizeAudienceLine({ enabled: false, classPrize: true }, 'class')).toBeNull()
    expect(JSON.stringify(prizeAudienceLine({ enabled: true, classPrize: true }, 'class'))).not.toMatch(
      /vorname|schuelername|userId/i,
    )
  })

  it('shows Klassenziel with the Punkteschwelle', () => {
    expect(classGoalLine(100)).toBe('Klassenziel: 100 Punkte')
    expect(classGoalLine(0)).toBeNull()
    expect(classGoalLine(undefined)).toBeNull()
  })

  it('lists Lehrer created + class/grade linked challenges, not only the active class', () => {
    const created = {
      id: 'CHAL1111',
      scope: 'class' as const,
      hostCode: 'ZZZZ9999',
      start: '2026-09-14T08:00',
      end: '2026-09-18T16:00',
    }
    const runningOnOtherClass = {
      id: 'CHAL2222',
      scope: 'class' as const,
      hostCode: 'ABCD2345',
      start: '2026-09-07T08:00',
      end: '2026-09-11T16:00',
    }
    const ended = {
      id: 'CHAL3333',
      scope: 'class' as const,
      hostCode: 'ABCD2345',
      start: '2026-08-01T08:00',
      end: '2026-08-05T16:00',
    }
    const listed = mergeVisibleChallenges({
      remote: [runningOnOtherClass],
      created: [created, ended],
      classCodes: ['ABCD2345', 'EEEE5555'],
      gradeCodes: [],
      includeCreated: true,
      now,
    })
    expect(listed.map((row) => row.id)).toEqual(['CHAL2222', 'CHAL1111'])
    expect(challengePhase(created.start, created.end, now)).toBe('upcoming')
    expect(challengePhase(runningOnOtherClass.start, runningOnOtherClass.end, now)).toBe(
      'active',
    )
  })

  it('hides foreign created challenges from Schüler unless the host class matches', () => {
    const otherClass = {
      id: 'CHAL4444',
      scope: 'class' as const,
      hostCode: 'ZZZZ9999',
      start: '2026-09-07T08:00',
      end: '2026-09-11T16:00',
    }
    const mine = {
      id: 'CHAL5555',
      scope: 'class' as const,
      hostCode: 'ABCD2345',
      start: '2026-09-07T08:00',
      end: '2026-09-11T16:00',
    }
    expect(
      mergeVisibleChallenges({
        remote: [],
        created: [otherClass],
        device: [mine],
        classCodes: ['ABCD2345'],
        gradeCodes: [],
        includeCreated: false,
        now,
      }).map((row) => row.id),
    ).toEqual(['CHAL5555'])
  })

  it('collects created, entered and active class codes for listing', () => {
    expect(
      classCodesForChallengeList({
        ...emptyClassCodes(),
        activeCode: 'AAAA1111',
        created: [{ code: 'BBBB2222', name: '6a', createdAt: 1 }],
        known: [{ code: 'CCCC3333', name: '6b', createdAt: 2 }],
      }).sort(),
    ).toEqual(['AAAA1111', 'BBBB2222', 'CCCC3333'])
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
