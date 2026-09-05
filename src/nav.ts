/** Primary top-bar tabs after the settings reorganization (v0.1.16). */
export const TOP_TABS = [
  { id: 'browse', label: 'Themen' },
  { id: 'examBuild', label: 'Klausur erstellen' },
  { id: 'examRun', label: 'Klausur schreiben' },
  { id: 'protocol', label: 'Punkteprotokoll' },
  { id: 'settings', label: 'Einstellungen' },
] as const

export type TopTabId = (typeof TOP_TABS)[number]['id']

/** Section headings on the Einstellungen page (no nested router). */
export const SETTINGS_SECTIONS = [
  'Lehrpläne',
  'Klasse',
  'WLAN-Zugang',
  'Profil',
] as const
