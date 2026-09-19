import {
  canCreateExam,
  canRequestTasks,
  canViewFaultyReports,
  canWriteExam,
  type UserRole,
} from './lib/roles'

/** Primary top-bar tabs after the settings reorganization. */
export const TOP_TABS = [
  { id: 'browse', label: 'Themen' },
  { id: 'challenge', label: 'Challenge' },
  { id: 'examBuild', label: 'Klausur erstellen' },
  { id: 'examRun', label: 'Klausur schreiben' },
  { id: 'protocol', label: 'Punkteprotokoll' },
  { id: 'settings', label: 'Einstellungen' },
] as const

export type TopTabId = (typeof TOP_TABS)[number]['id']

/**
 * Settings hub and submenu: hide the learning tabs and put Zum Üben
 * immediately left of Einstellungen.
 */
export const SETTINGS_TOP_TABS = [
  { id: 'browse', label: 'Zum Üben' },
  { id: 'settings', label: 'Einstellungen' },
] as const

/** Learning tabs for a role. Klassenlehrer see neither Klausur tab. */
export function topTabsForRole(role?: UserRole | null) {
  return TOP_TABS.filter((tab) => {
    if (tab.id === 'examBuild') return canCreateExam(role)
    if (tab.id === 'examRun') return canWriteExam(role)
    return true
  })
}

export function topTabsForView(viewName: string, role?: UserRole | null) {
  return viewName === 'settings' ? SETTINGS_TOP_TABS : topTabsForRole(role)
}

/** Settings hub entries — one submenu item per setting. */
export const SETTINGS_SECTIONS = [
  { id: 'curricula', label: 'Lehrpläne' },
  { id: 'class', label: 'Klasse' },
  { id: 'tasks', label: 'Aufgaben ergänzen' },
  { id: 'myReports', label: 'Meine Meldungen' },
  { id: 'faulty', label: 'Fehlerhafte Aufgaben' },
  { id: 'lan', label: 'WLAN-Zugang' },
  { id: 'profile', label: 'Profil' },
  { id: 'supporters', label: 'Unterstützer' },
] as const

export type SettingsSectionId = (typeof SETTINGS_SECTIONS)[number]['id']

/**
 * Aufgaben ergänzen: Lehrer/Entwickler.
 * Meine Meldungen: alle Rollen (eigene anonyme Meldungen dieses Geräts).
 * Fehlerhafte Aufgaben: nur Entwickleransicht.
 */
export function settingsSectionsForRole(role?: UserRole | null) {
  return SETTINGS_SECTIONS.filter((item) => {
    if (item.id === 'tasks') return canRequestTasks(role)
    if (item.id === 'faulty') return canViewFaultyReports(role)
    return true
  })
}
