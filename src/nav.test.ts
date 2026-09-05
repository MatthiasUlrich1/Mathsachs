import { describe, expect, it } from 'vitest'
import { SETTINGS_SECTIONS, TOP_TABS } from './nav'

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

  it('groups former top-level items as settings sections', () => {
    expect(SETTINGS_SECTIONS).toEqual(['Lehrpläne', 'Klasse', 'WLAN-Zugang', 'Profil'])
  })
})
