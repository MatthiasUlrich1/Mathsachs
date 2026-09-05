import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Challenge, ChallengePrizeInfo } from './Challenge'
import {
  allowedChallengeScopes,
  canOfferClassChallengeCreate,
  canOfferGradeChallengeCreate,
  NO_ACTIVE_CHALLENGE_MESSAGE,
} from '../challenge/logic'
import { canCreateChallenge, canPracticeFromChallenge } from '../lib/roles'
import { emptyClassCodes, emptyGradeCodes } from '../lib/sharedState'
import { SETTINGS_TOP_TABS, TOP_TABS, topTabsForRole, topTabsForView } from '../nav'
import {
  resetSharedStorageForTests,
  saveUser,
} from '../lib/storage'
import type { StoredChallenge } from '../challenge/types'

describe('Challenge tab UI rules', () => {
  it('adds Challenge to the top bar and hides it in Einstellungen', () => {
    expect(TOP_TABS.some((tab) => tab.id === 'challenge' && tab.label === 'Challenge')).toBe(
      true,
    )
    expect(SETTINGS_TOP_TABS.map((tab) => tab.label)).toEqual(['Zum Üben', 'Einstellungen'])
    expect(topTabsForView('settings', 'lehrer').map((tab) => tab.label)).not.toContain(
      'Challenge',
    )
    expect(topTabsForRole('schueler').map((tab) => tab.label)).toContain('Challenge')
    expect(topTabsForRole('eltern').map((tab) => tab.label)).toContain('Challenge')
  })

  it('lets Schüler participate and blocks Eltern from creating or practicing from Challenge', () => {
    expect(canCreateChallenge('schueler')).toBe(false)
    expect(canPracticeFromChallenge('schueler')).toBe(true)
    expect(canCreateChallenge('eltern')).toBe(false)
    expect(canPracticeFromChallenge('eltern')).toBe(false)
    expect(
      canOfferClassChallengeCreate('eltern', {
        ...emptyClassCodes(),
        activeCode: 'ABCD2345',
      }),
    ).toBe(false)
  })

  it('does not offer Stufe create to Klassenlehrer', () => {
    expect(allowedChallengeScopes('klassenlehrer')).not.toContain('grade')
    expect(
      canOfferGradeChallengeCreate('klassenlehrer', {
        ...emptyGradeCodes(),
        created: [{ code: 'GGGG2345', name: '6', createdAt: 1 }],
      }),
    ).toBe(false)
  })

  it('shows the exact empty copy when no challenge is active', () => {
    expect(NO_ACTIVE_CHALLENGE_MESSAGE).toBe('Aktuell keine Challenge aktiv.')
    const schueler = renderToStaticMarkup(
      createElement(Challenge, {
        user: 'Lea',
        role: 'schueler',
        loaded: [],
        onPractice: () => undefined,
      }),
    )
    expect(schueler).toContain('Aktuell keine Challenge aktiv.')
    expect(schueler).toContain('Challenge')
    expect(schueler).not.toContain('Challenge anlegen')

    const eltern = renderToStaticMarkup(
      createElement(Challenge, {
        user: 'Eltern',
        role: 'eltern',
        loaded: [],
        onPractice: () => undefined,
      }),
    )
    expect(eltern).toContain('Aktuell keine Challenge aktiv.')
    expect(eltern).not.toContain('Challenge anlegen')
    expect(eltern).not.toContain('Challenge starten')

    const lehrer = renderToStaticMarkup(
      createElement(Challenge, {
        user: 'Lehrer',
        role: 'lehrer',
        loaded: [],
        onPractice: () => undefined,
      }),
    )
    expect(lehrer).toContain('Zum Anlegen einer Klassenchallenge')
    expect(lehrer).toContain('Stufenchallenge')

    const klassenlehrer = renderToStaticMarkup(
      createElement(Challenge, {
        user: 'KL',
        role: 'klassenlehrer',
        loaded: [],
        onPractice: () => undefined,
      }),
    )
    expect(klassenlehrer).toContain('Aktuell keine Challenge aktiv.')
    expect(klassenlehrer).not.toContain('Stufenchallenge')
  })
})

const sampleChallenge = (overrides: Partial<StoredChallenge> = {}): StoredChallenge => ({
  id: 'CHAL2345',
  scope: 'class',
  hostCode: 'ABCD2345',
  name: 'Woche 36',
  topicIds: ['n5-add'],
  topics: [{ id: 'n5-add', title: 'Addieren' }],
  start: '2026-09-01T08:00',
  end: '2026-09-11T16:00',
  prize: {
    enabled: true,
    classPrize: true,
    studentPrize: true,
    classThreshold: 100,
    text: 'Film schauen',
  },
  createdAt: 1,
  ...overrides,
})

describe('Challenge visibility for Lehrer, Schüler and Eltern', () => {
  afterEach(() => {
    resetSharedStorageForTests()
    vi.unstubAllGlobals()
  })

  const offlineFetch = () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline')
      }),
    )
  }

  it('lists a Lehrer-created challenge even when it is not the active class', () => {
    offlineFetch()
    saveUser({
      name: 'Lehrer',
      created: 1,
      stats: {},
      sessions: [],
      role: 'lehrer',
      classCodes: {
        ...emptyClassCodes(),
        created: [{ code: 'ABCD2345', name: '6a', createdAt: 1 }],
        activeCode: 'EEEE5555',
      },
      challenges: [sampleChallenge()],
    })
    const html = renderToStaticMarkup(
      createElement(Challenge, {
        user: 'Lehrer',
        role: 'lehrer',
        loaded: [],
        onPractice: () => undefined,
      }),
    )
    expect(html).toContain('Woche 36')
    expect(html).toContain('Laufende Challenges')
    expect(html).toContain('Klasse 6a')
    expect(html).toContain('Film schauen')
    expect(html).toContain('Wer gewinnen kann')
    expect(html).toContain('Klasse')
    expect(html).toContain('Schüler')
    expect(html).toContain('Klassenziel: 100 Punkte')
    expect(html).toContain('Addieren')
    expect(html).toContain('Challenge anlegen')
  })

  it('lists a Klassenlehrer-created challenge on their class', () => {
    offlineFetch()
    saveUser({
      name: 'KL',
      created: 1,
      stats: {},
      sessions: [],
      role: 'klassenlehrer',
      classCodes: {
        ...emptyClassCodes(),
        known: [{ code: 'ABCD2345', name: '6a', createdAt: 1 }],
        activeCode: 'ABCD2345',
      },
      challenges: [sampleChallenge({ name: 'Klassenwoche' })],
    })
    const html = renderToStaticMarkup(
      createElement(Challenge, {
        user: 'KL',
        role: 'klassenlehrer',
        loaded: [],
        onPractice: () => undefined,
      }),
    )
    expect(html).toContain('Klassenwoche')
    expect(html).toContain('Laufende Challenges')
    expect(html).toContain('Klassenziel: 100 Punkte')
    expect(html).not.toContain('Stufenchallenge')
  })

  it('shows Schüler Gewinn, winner categories and Klassenziel', () => {
    offlineFetch()
    saveUser({
      name: 'Lea',
      created: 1,
      stats: {},
      sessions: [],
      role: 'schueler',
      classCodes: {
        ...emptyClassCodes(),
        known: [{ code: 'ABCD2345', name: '6a', createdAt: 1 }],
        activeCode: 'ABCD2345',
      },
    })
    saveUser({
      name: 'Lehrer',
      created: 1,
      stats: {},
      sessions: [],
      role: 'lehrer',
      challenges: [sampleChallenge()],
    })
    const html = renderToStaticMarkup(
      createElement(Challenge, {
        user: 'Lea',
        role: 'schueler',
        loaded: [],
        onPractice: () => undefined,
      }),
    )
    expect(html).toContain('Woche 36')
    expect(html).toContain('Gewinn:')
    expect(html).toContain('Film schauen')
    expect(html).toContain('Wer gewinnen kann')
    expect(html).toContain('Klasse')
    expect(html).toContain('Schüler')
    expect(html).toContain('Klassenziel: 100 Punkte')
    expect(html).not.toContain('Challenge anlegen')
  })

  it('shows Eltern the same prize, who and Klassenziel read-only', () => {
    offlineFetch()
    saveUser({
      name: 'Eltern',
      created: 1,
      stats: {},
      sessions: [],
      role: 'eltern',
      classCodes: {
        ...emptyClassCodes(),
        known: [{ code: 'ABCD2345', name: '6a', createdAt: 1 }],
        activeCode: 'ABCD2345',
      },
    })
    saveUser({
      name: 'Lehrer',
      created: 1,
      stats: {},
      sessions: [],
      role: 'lehrer',
      challenges: [sampleChallenge()],
    })
    const html = renderToStaticMarkup(
      createElement(Challenge, {
        user: 'Eltern',
        role: 'eltern',
        loaded: [],
        onPractice: () => undefined,
      }),
    )
    expect(html).toContain('Klassenziel: 100 Punkte')
    expect(html).toContain('Wer gewinnen kann')
    expect(html).not.toContain('Challenge anlegen')
    expect(html).not.toContain('Üben')
  })

  it('renders Stufe winner categories without a pupil name', () => {
    const html = renderToStaticMarkup(
      createElement(ChallengePrizeInfo, {
        prize: {
          enabled: true,
          classPrize: true,
          studentPrize: true,
          text: 'Ausflug',
        },
        scope: 'grade',
      }),
    )
    expect(html).toContain('Ausflug')
    expect(html).toContain('Klasse/Stufe')
    expect(html).toContain('Schüler')
    expect(html).not.toMatch(/Max|Lea|vorname/i)
  })

  it('lists an upcoming created challenge under Angelegte Challenges', () => {
    offlineFetch()
    saveUser({
      name: 'Lehrer',
      created: 1,
      stats: {},
      sessions: [],
      role: 'lehrer',
      classCodes: {
        ...emptyClassCodes(),
        created: [{ code: 'ABCD2345', name: '6a', createdAt: 1 }],
        activeCode: 'ABCD2345',
      },
      challenges: [
        sampleChallenge({
          name: 'Nächste Woche',
          start: '2035-09-08T08:00',
          end: '2035-09-12T16:00',
        }),
      ],
    })
    const html = renderToStaticMarkup(
      createElement(Challenge, {
        user: 'Lehrer',
        role: 'lehrer',
        loaded: [],
        onPractice: () => undefined,
      }),
    )
    expect(html).toContain('Angelegte Challenges')
    expect(html).toContain('Nächste Woche')
    expect(html).toContain('Angelegt')
    expect(html).toContain('Klassenziel: 100 Punkte')
  })
})
