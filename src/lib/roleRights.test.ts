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

  it('covers the published rights including Challenge anlegen/sehen/mitmachen', () => {
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
      'Aufgaben ergänzen',
      'Challenge anlegen (Klasse)',
      'Challenge anlegen (Stufe)',
      'Challenge ändern / löschen (Klasse)',
      'Challenge ändern / löschen (Stufe)',
      'Challenge sehen',
      'Challenge mitmachen',
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
    expect(byId.taskRequest.lehrer).toBe('yes')
    expect(byId.taskRequest.klassenlehrer).toBe('no')
    expect(byId.taskRequest.eltern).toBe('no')
    expect(byId.taskRequest.schueler).toBe('no')
    expect(byId.challengeCreateClass.lehrer).toBe('yes')
    expect(byId.challengeCreateClass.klassenlehrer).toBe('yes')
    expect(byId.challengeCreateClass.eltern).toBe('no')
    expect(byId.challengeCreateClass.schueler).toBe('no')
    expect(byId.challengeCreateGrade.lehrer).toBe('yes')
    expect(byId.challengeCreateGrade.klassenlehrer).toBe('no')
    expect(byId.challengeManageClass.lehrer).toBe('yes')
    expect(byId.challengeManageClass.klassenlehrer).toBe('yes')
    expect(byId.challengeManageClass.schueler).toBe('no')
    expect(byId.challengeManageGrade.lehrer).toBe('yes')
    expect(byId.challengeManageGrade.klassenlehrer).toBe('no')
    expect(byId.challengeView.schueler).toBe('yes')
    expect(byId.challengeView.eltern).toBe('yes')
    expect(byId.challengeJoin.schueler).toBe('yes')
    expect(byId.challengeJoin.eltern).toBe('no')
    expect(labels).not.toContain('Challenge erstellen')
    expect(ROLE_RIGHT_ROWS.some((row) => Object.values(row.marks).includes('planned'))).toBe(
      false,
    )
    expect(rightMarkSymbol('planned')).toBe('geplant')
    expect(rightMarkLabel('planned')).toBe('Geplant')
  })
})
