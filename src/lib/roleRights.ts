import { USER_ROLES, type UserRole } from './roles'

export type RightMark = 'yes' | 'no' | 'optin' | 'viaClass' | 'viaClassOrGrade' | 'planned'

export interface RightRow {
  id: string
  label: string
  marks: Record<UserRole, RightMark>
}

/** In-app and README matrix: rows = features, columns = the four roles. */
export const ROLE_RIGHT_ROWS: RightRow[] = [
  {
    id: 'topics',
    label: 'Themen',
    marks: { schueler: 'yes', eltern: 'yes', klassenlehrer: 'yes', lehrer: 'yes' },
  },
  {
    id: 'examRun',
    label: 'Klausur schreiben',
    marks: { schueler: 'yes', eltern: 'yes', klassenlehrer: 'no', lehrer: 'yes' },
  },
  {
    id: 'examBuild',
    label: 'Klausur erstellen',
    marks: { schueler: 'no', eltern: 'yes', klassenlehrer: 'no', lehrer: 'yes' },
  },
  {
    id: 'protocol',
    label: 'Punkteprotokoll',
    marks: { schueler: 'yes', eltern: 'yes', klassenlehrer: 'yes', lehrer: 'yes' },
  },
  {
    id: 'settings',
    label: 'Einstellungen',
    marks: { schueler: 'yes', eltern: 'yes', klassenlehrer: 'yes', lehrer: 'yes' },
  },
  {
    id: 'classCreate',
    label: 'Klassencode erstellen',
    marks: { schueler: 'no', eltern: 'yes', klassenlehrer: 'no', lehrer: 'yes' },
  },
  {
    id: 'classEnter',
    label: 'Klassencode eintragen / Teil der Klasse',
    marks: { schueler: 'yes', eltern: 'yes', klassenlehrer: 'yes', lehrer: 'yes' },
  },
  {
    id: 'sendPoints',
    label: 'Punkte an Klasse senden',
    marks: { schueler: 'optin', eltern: 'optin', klassenlehrer: 'no', lehrer: 'optin' },
  },
  {
    id: 'gradeCreate',
    label: 'Stufencode erstellen',
    marks: { schueler: 'no', eltern: 'no', klassenlehrer: 'no', lehrer: 'yes' },
  },
  {
    id: 'gradeEnter',
    label: 'Stufencode eintragen',
    marks: { schueler: 'no', eltern: 'no', klassenlehrer: 'no', lehrer: 'yes' },
  },
  {
    id: 'gradeAssign',
    label: 'Klassen auf eingetragener Stufe anlegen',
    marks: { schueler: 'no', eltern: 'no', klassenlehrer: 'no', lehrer: 'yes' },
  },
  {
    id: 'gradeCompetition',
    label: 'Stufen-Wettbewerb sehen',
    marks: {
      schueler: 'viaClass',
      eltern: 'viaClass',
      klassenlehrer: 'viaClass',
      lehrer: 'viaClassOrGrade',
    },
  },
  {
    id: 'taskRequest',
    label: 'Aufgaben ergänzen',
    marks: { schueler: 'no', eltern: 'no', klassenlehrer: 'no', lehrer: 'yes' },
  },
  {
    id: 'challengeCreateClass',
    label: 'Challenge anlegen (Klasse)',
    marks: { schueler: 'no', eltern: 'no', klassenlehrer: 'yes', lehrer: 'yes' },
  },
  {
    id: 'challengeCreateGrade',
    label: 'Challenge anlegen (Stufe)',
    marks: { schueler: 'no', eltern: 'no', klassenlehrer: 'no', lehrer: 'yes' },
  },
  {
    id: 'challengeView',
    label: 'Challenge sehen',
    marks: { schueler: 'yes', eltern: 'yes', klassenlehrer: 'yes', lehrer: 'yes' },
  },
  {
    id: 'challengeJoin',
    label: 'Challenge mitmachen',
    marks: { schueler: 'yes', eltern: 'no', klassenlehrer: 'yes', lehrer: 'yes' },
  },
]

export const ROLE_RIGHT_COLUMNS = USER_ROLES

export const rightMarkLabel = (mark: RightMark): string => {
  if (mark === 'yes') return 'Ja'
  if (mark === 'no') return 'Nein'
  if (mark === 'optin') return 'Opt-in'
  if (mark === 'viaClass') return 'Über Klasse'
  if (mark === 'viaClassOrGrade') return 'Klasse oder Stufe'
  return 'Geplant'
}

export const rightMarkSymbol = (mark: RightMark): string => {
  if (mark === 'yes' || mark === 'optin' || mark === 'viaClass' || mark === 'viaClassOrGrade') {
    return '✓'
  }
  if (mark === 'planned') return 'geplant'
  return '—'
}
