import { describe, expect, it } from 'vitest'
import { USER_ROLES } from './roles'
import {
  ROLE_RIGHT_COLUMNS,
  ROLE_RIGHT_ROWS,
  rightMarkLabel,
  rightMarkSymbol,
} from './roleRights'

describe('Rollen-Rechte-Matrix', () => {
  it('lists all four roles as columns', () => {
    expect(ROLE_RIGHT_COLUMNS.map((role) => role.id)).toEqual([
      'schueler',
      'eltern',
      'klassenlehrer',
      'lehrer',
    ])
    expect(ROLE_RIGHT_COLUMNS).toEqual(USER_ROLES)
    expect(ROLE_RIGHT_COLUMNS.map((role) => role.label)).toEqual([
      'Schüler',
      'Eltern',
      'Klassenlehrer',
      'Lehrer',
    ])
  })

  it('covers the published rights including planned Challenge', () => {
    const labels = ROLE_RIGHT_ROWS.map((row) => row.label)
    expect(labels).toEqual([
      'Themen',
      'Klausur schreiben',
      'Klausur erstellen',
      'Punkteprotokoll',
      'Einstellungen',
      'Klassencode erstellen',
      'Klassencode eintragen / Teil der Klasse',
      'Punkte an Klasse senden',
      'Stufencode erstellen',
      'Stufencode eintragen',
      'Klassen auf eingetragener Stufe anlegen',
      'Stufen-Wettbewerb sehen',
      'Challenge erstellen',
    ])
    const byId = Object.fromEntries(ROLE_RIGHT_ROWS.map((row) => [row.id, row.marks]))
    expect(byId.examRun.klassenlehrer).toBe('no')
    expect(byId.examBuild.klassenlehrer).toBe('no')
    expect(byId.classCreate.klassenlehrer).toBe('no')
    expect(byId.classEnter.klassenlehrer).toBe('yes')
    expect(byId.sendPoints.klassenlehrer).toBe('no')
    expect(byId.gradeCreate.lehrer).toBe('yes')
    expect(byId.gradeEnter.lehrer).toBe('yes')
    expect(byId.gradeEnter.eltern).toBe('no')
    expect(byId.challenge.lehrer).toBe('planned')
    expect(byId.challenge.klassenlehrer).toBe('planned')
    expect(rightMarkSymbol('planned')).toBe('geplant')
    expect(rightMarkLabel('planned')).toBe('Geplant')
  })
})
