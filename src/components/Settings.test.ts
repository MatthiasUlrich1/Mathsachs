import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import {
  MANUAL_CHECK_CHECKING,
  MANUAL_CHECK_CURRENT,
  MANUAL_CHECK_FAILED,
  MANUAL_CHECK_LABEL,
} from '../updates/runCheck'
import { Settings } from './Settings'
import {
  TEACHER_CODE_REQUEST_LABEL,
  formatTeacherCode,
} from '../lib/teacherCode'

const baseProps = {
  loadedIds: [] as string[],
  onLoad: vi.fn(async () => undefined),
  onRemove: vi.fn(),
  onBack: vi.fn(),
  onOpenSection: vi.fn(),
  user: 'Ada',
  role: 'lehrer' as const,
  classLabel: '6/6',
  lanStatus: null,
  onChangeRole: vi.fn(),
  onSwitchUser: vi.fn(),
  onCheckUpdates: vi.fn(),
}

describe('Settings hub update check', () => {
  it('shows “Auf Updates prüfen” on the Einstellungen hub', () => {
    const html = renderToStaticMarkup(createElement(Settings, baseProps))
    expect(html).toContain('Einstellungen')
    expect(html).toContain('Lehrpläne')
    expect(html).toContain('Klasse')
    expect(html).toContain('WLAN-Zugang')
    expect(html).toContain('Profil')
    expect(html).toContain('Aufgaben ergänzen')
    expect(html).toContain(MANUAL_CHECK_LABEL)
    expect(html).not.toContain(MANUAL_CHECK_CURRENT)
    expect(html).not.toContain(MANUAL_CHECK_CHECKING)
  })

  it('does not show the button on Profil, WLAN or other submenu pages', () => {
    const profile = renderToStaticMarkup(
      createElement(Settings, { ...baseProps, section: 'profile' }),
    )
    expect(profile).toContain('Profil')
    expect(profile).toContain('Benutzer wechseln')
    expect(profile).not.toContain(MANUAL_CHECK_LABEL)

    const lan = renderToStaticMarkup(
      createElement(Settings, { ...baseProps, section: 'lan' }),
    )
    expect(lan).not.toContain(MANUAL_CHECK_LABEL)

    const curricula = renderToStaticMarkup(
      createElement(Settings, { ...baseProps, section: 'curricula' }),
    )
    expect(curricula).not.toContain(MANUAL_CHECK_LABEL)
  })

  it('lists Aufgaben ergänzen only for Lehrer', () => {
    const lehrer = renderToStaticMarkup(createElement(Settings, baseProps))
    expect(lehrer).toContain('Aufgaben ergänzen')
    expect(lehrer).toContain('Vorgaben für neue Übungsaufgaben senden')

    for (const role of ['schueler', 'eltern', 'klassenlehrer'] as const) {
      const html = renderToStaticMarkup(
        createElement(Settings, { ...baseProps, role }),
      )
      expect(html).not.toContain('Aufgaben ergänzen')
    }
  })

  it('renders the Vorgaben form on the tasks section for Lehrer', () => {
    const html = renderToStaticMarkup(
      createElement(Settings, { ...baseProps, section: 'tasks' }),
    )
    expect(html).toContain('Klassenstufe')
    expect(html).toContain('Themengebiet')
    expect(html).toContain('Titel des Themas')
    expect(html).toContain('Aufgabenbeispiel')
    expect(html).toContain('Vorgaben senden')
  })

  it('denies the tasks section to other roles', () => {
    const html = renderToStaticMarkup(
      createElement(Settings, {
        ...baseProps,
        role: 'schueler',
        section: 'tasks',
      }),
    )
    expect(html).toContain('Nur Lehrer können Vorgaben für neue Aufgaben senden.')
    expect(html).not.toContain('Themengebiet')
  })

  it('shows checking, current and error texts under the hub button', () => {
    const checking = renderToStaticMarkup(
      createElement(Settings, {
        ...baseProps,
        manualCheckStatus: 'checking',
      }),
    )
    expect(checking).toContain(MANUAL_CHECK_CHECKING)
    expect(checking).toContain('disabled')

    const current = renderToStaticMarkup(
      createElement(Settings, {
        ...baseProps,
        manualCheckStatus: 'current',
      }),
    )
    expect(current).toContain(MANUAL_CHECK_CURRENT)

    const failed = renderToStaticMarkup(
      createElement(Settings, {
        ...baseProps,
        manualCheckStatus: 'error',
        manualCheckError: MANUAL_CHECK_FAILED,
      }),
    )
    expect(failed).toContain(MANUAL_CHECK_FAILED)
    expect(failed).toContain('notice--error')

    const profileCurrent = renderToStaticMarkup(
      createElement(Settings, {
        ...baseProps,
        section: 'profile',
        manualCheckStatus: 'current',
      }),
    )
    expect(profileCurrent).not.toContain(MANUAL_CHECK_CURRENT)
    expect(profileCurrent).not.toContain(MANUAL_CHECK_LABEL)
  })
})

describe('Settings profile Lehrercode', () => {
  it('shows the shared code on a Lehrer profile', () => {
    const html = renderToStaticMarkup(
      createElement(Settings, { ...baseProps, section: 'profile' }),
    )
    expect(html).toContain('Lehrercode')
    expect(html).toContain(formatTeacherCode())
    expect(html).toContain('Lehrercode kopieren')
    expect(html).toContain('andere Lehrer der Schule')
    expect(html).not.toContain(TEACHER_CODE_REQUEST_LABEL)
  })

  it('shows the request button for Schüler and hides the secret', () => {
    const html = renderToStaticMarkup(
      createElement(Settings, {
        ...baseProps,
        role: 'schueler',
        section: 'profile',
      }),
    )
    expect(html).toContain(TEACHER_CODE_REQUEST_LABEL)
    expect(html).toContain('mailto:')
    expect(html).toContain('keine Personendaten')
    expect(html).toContain('Lehrer und Klassenlehrer nur mit')
    expect(html).not.toContain(formatTeacherCode())
    expect(html).not.toContain('Mit Lehrercode übernehmen')
  })

  it('shows the shared code for Klassenlehrer as well', () => {
    const html = renderToStaticMarkup(
      createElement(Settings, {
        ...baseProps,
        role: 'klassenlehrer',
        section: 'profile',
      }),
    )
    expect(html).toContain(formatTeacherCode())
    expect(html).not.toContain(TEACHER_CODE_REQUEST_LABEL)
  })
})
