import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Challenge } from './Challenge'
import {
  allowedChallengeScopes,
  canOfferClassChallengeCreate,
  canOfferGradeChallengeCreate,
  NO_ACTIVE_CHALLENGE_MESSAGE,
} from '../challenge/logic'
import { canCreateChallenge, canPracticeFromChallenge } from '../lib/roles'
import { emptyClassCodes, emptyGradeCodes } from '../lib/sharedState'
import { SETTINGS_TOP_TABS, TOP_TABS, topTabsForRole, topTabsForView } from '../nav'

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
