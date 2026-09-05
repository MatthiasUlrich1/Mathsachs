import { describe, expect, it } from 'vitest'
import {
  GRADE_NOT_CLASS_MESSAGE,
  assignedLocalClassCodes,
  classPageFlags,
} from './gradeUi'

describe('classPageFlags', () => {
  it('hides Stufe create/assign for Schüler and Eltern', () => {
    expect(classPageFlags('schueler')).toEqual({
      canCreateClass: false,
      canManageGrades: false,
    })
    expect(classPageFlags('eltern')).toEqual({
      canCreateClass: true,
      canManageGrades: false,
    })
    expect(classPageFlags('lehrer')).toEqual({
      canCreateClass: true,
      canManageGrades: true,
    })
    expect(classPageFlags(undefined).canManageGrades).toBe(false)
  })
})

describe('assignedLocalClassCodes', () => {
  it('matches local class codes by anonymous grade id, not by secret', () => {
    expect(
      assignedLocalClassCodes(
        ['AAAA1111', 'BBBB2222', 'CCCC3333'],
        'n00aabbcc',
        {
          AAAA1111: { grade: { id: 'n00aabbcc' } },
          BBBB2222: { grade: { id: 'notherid1' } },
          CCCC3333: {},
        },
      ),
    ).toEqual(['AAAA1111'])
  })
})

describe('GRADE_NOT_CLASS_MESSAGE', () => {
  it('tells pupils points stay on the class code', () => {
    expect(GRADE_NOT_CLASS_MESSAGE).toContain('Klassenstufencode')
    expect(GRADE_NOT_CLASS_MESSAGE).toContain('Klassencodes')
  })
})
