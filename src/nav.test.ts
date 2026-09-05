import { describe, expect, it } from 'vitest'
import {
  SETTINGS_SECTIONS,
  SETTINGS_TOP_TABS,
  TOP_TABS,
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

  it('keeps the learning tabs outside settings, including submenu-unrelated views', () => {
    expect(topTabsForView('browse')).toEqual(TOP_TABS)
    expect(topTabsForView('examBuild')).toEqual(TOP_TABS)
    expect(topTabsForView('examRun')).toEqual(TOP_TABS)
    expect(topTabsForView('protocol')).toEqual(TOP_TABS)
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
