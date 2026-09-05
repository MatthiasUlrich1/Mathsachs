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

describe('Settings Profil update check', () => {
  it('shows “Auf Updates prüfen” on Profil', () => {
    const html = renderToStaticMarkup(
      createElement(Settings, { ...baseProps, section: 'profile' }),
    )
    expect(html).toContain(MANUAL_CHECK_LABEL)
    expect(html).toContain('Profil')
    expect(html).not.toContain(MANUAL_CHECK_CURRENT)
    expect(html).not.toContain(MANUAL_CHECK_CHECKING)
  })

  it('does not show the button on other settings sections', () => {
    const lan = renderToStaticMarkup(
      createElement(Settings, { ...baseProps, section: 'lan' }),
    )
    expect(lan).not.toContain(MANUAL_CHECK_LABEL)
    const hub = renderToStaticMarkup(createElement(Settings, baseProps))
    expect(hub).toContain('Einstellungen')
    expect(hub).not.toContain(MANUAL_CHECK_LABEL)
  })

  it('shows checking, current and error texts under the button', () => {
    const checking = renderToStaticMarkup(
      createElement(Settings, {
        ...baseProps,
        section: 'profile',
        manualCheckStatus: 'checking',
      }),
    )
    expect(checking).toContain(MANUAL_CHECK_CHECKING)
    expect(checking).toContain('disabled')

    const current = renderToStaticMarkup(
      createElement(Settings, {
        ...baseProps,
        section: 'profile',
        manualCheckStatus: 'current',
      }),
    )
    expect(current).toContain(MANUAL_CHECK_CURRENT)

    const failed = renderToStaticMarkup(
      createElement(Settings, {
        ...baseProps,
        section: 'profile',
        manualCheckStatus: 'error',
        manualCheckError: MANUAL_CHECK_FAILED,
      }),
    )
    expect(failed).toContain(MANUAL_CHECK_FAILED)
    expect(failed).toContain('notice--error')
  })
})
