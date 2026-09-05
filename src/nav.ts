/** Primary top-bar tabs after the settings reorganization. */
export const TOP_TABS = [
  { id: 'browse', label: 'Themen' },
  { id: 'examBuild', label: 'Klausur erstellen' },
  { id: 'examRun', label: 'Klausur schreiben' },
  { id: 'protocol', label: 'Punkteprotokoll' },
  { id: 'settings', label: 'Einstellungen' },
] as const

export type TopTabId = (typeof TOP_TABS)[number]['id']

/** Settings hub entries — one submenu item per setting. */
export const SETTINGS_SECTIONS = [
  { id: 'curricula', label: 'Lehrpläne' },
  { id: 'class', label: 'Klasse' },
  { id: 'lan', label: 'WLAN-Zugang' },
  { id: 'profile', label: 'Profil' },
] as const

export type SettingsSectionId = (typeof SETTINGS_SECTIONS)[number]['id']
