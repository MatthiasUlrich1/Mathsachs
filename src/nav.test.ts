import { describe, expect, it } from 'vitest'
import {
  SETTINGS_SECTIONS,
  SETTINGS_TOP_TABS,
  TOP_TABS,
  topTabsForRole,
  topTabsForView,
} from './nav'

describe('top-bar navigation', () => {
  it('keeps learning tabs plus Einstellungen, without Lehrpläne or Klasse', () => {
    const labels: string[] = TOP_TABS.map((tab) => tab.label)
    expect(labels).toEqual([
      'Themen',
      'Klausur erstellen',
      'Klausur schreiben',
      'Punkteprotokoll',
      'Einstellungen',
    ])
    expect(labels).not.toContain('Lehrpläne')
    expect(labels).not.toContain('Klasse')
    expect(labels).not.toContain('wechseln')
  })

  it('shows Zum Üben immediately left of Einstellungen while in settings', () => {
    const labels = topTabsForView('settings').map((tab) => tab.label)
    expect(labels).toEqual(['Zum Üben', 'Einstellungen'])
    expect(labels).not.toContain('Themen')
    expect(labels).not.toContain('Klausur erstellen')
    expect(labels).not.toContain('Klausur schreiben')
    expect(labels).not.toContain('Punkteprotokoll')
    expect(SETTINGS_TOP_TABS[0]).toEqual({ id: 'browse', label: 'Zum Üben' })
    expect(SETTINGS_TOP_TABS[1]).toEqual({
      id: 'settings',
      label: 'Einstellungen',
    })
  })

  it('keeps the learning tabs outside settings for Eltern and Lehrer', () => {
    expect(topTabsForView('browse', 'eltern')).toEqual(TOP_TABS)
    expect(topTabsForView('examBuild', 'lehrer')).toEqual(TOP_TABS)
    expect(topTabsForView('examRun', 'eltern')).toEqual(TOP_TABS)
    expect(topTabsForView('protocol', 'lehrer')).toEqual(TOP_TABS)
    expect(topTabsForRole('eltern')).toEqual(TOP_TABS)
    expect(topTabsForRole('lehrer')).toEqual(TOP_TABS)
  })

  it('hides Klausur erstellen for Schüler, including a missing role', () => {
    const labels = topTabsForRole('schueler').map((tab) => tab.label)
    expect(labels).toEqual([
      'Themen',
      'Klausur schreiben',
      'Punkteprotokoll',
      'Einstellungen',
    ])
    expect(labels).not.toContain('Klausur erstellen')
    expect(topTabsForView('browse', 'schueler')).toEqual(topTabsForRole('schueler'))
    expect(topTabsForView('examBuild').map((tab) => tab.label)).not.toContain(
      'Klausur erstellen',
    )
  })

  it('keeps the settings top bar the same for every role', () => {
    for (const role of ['schueler', 'eltern', 'lehrer'] as const) {
      expect(topTabsForView('settings', role).map((tab) => tab.label)).toEqual([
        'Zum Üben',
        'Einstellungen',
      ])
    }
  })

  it('lists former top-level items as a settings submenu', () => {
    expect(SETTINGS_SECTIONS.map((item) => item.label)).toEqual([
      'Lehrpläne',
      'Klasse',
      'WLAN-Zugang',
      'Profil',
    ])
    expect(SETTINGS_SECTIONS.map((item) => item.id)).toEqual([
      'curricula',
      'class',
      'lan',
      'profile',
    ])
  })
})
