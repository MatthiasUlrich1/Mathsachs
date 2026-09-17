import { describe, expect, it } from 'vitest'
import { publicIdFromCode } from '../classCode/publicId'
import {
  mergeExamAssignableClasses,
  parseExamAssignableValue,
} from './examAssignableClasses'

describe('parseExamAssignableValue', () => {
  it('parses a Klassencode', () => {
    expect(parseExamAssignableValue('ABCD2345')).toEqual({ classCode: 'ABCD2345' })
  })

  it('parses a Stufe+classId value', () => {
    expect(parseExamAssignableValue('grade:GGGG2345:n00abcdef')).toEqual({
      gradeCode: 'GGGG2345',
      classId: 'n00abcdef',
    })
  })

  it('rejects malformed grade values', () => {
    expect(parseExamAssignableValue('grade:')).toEqual({})
    expect(parseExamAssignableValue('grade:ONLY')).toEqual({})
    expect(parseExamAssignableValue('')).toEqual({})
  })
})

describe('mergeExamAssignableClasses', () => {
  it('lists local Klassencodes', () => {
    const rows = mergeExamAssignableClasses({
      classSettings: {
        created: [{ code: 'CLASSAAA', name: '7a', createdAt: 1 }],
        known: [],
        activeCode: null,
        sendPoints: false,
      },
      gradeSettings: { created: [], known: [] },
      gradeClasses: {},
    })
    expect(rows).toEqual([
      { code: 'CLASSAAA', name: '7a', value: 'CLASSAAA' },
    ])
  })

  it('adds Stufe classes by public id when Klassencode is unknown', () => {
    const classId = publicIdFromCode('SECRET99')
    const rows = mergeExamAssignableClasses({
      classSettings: {
        created: [],
        known: [],
        activeCode: null,
        sendPoints: false,
      },
      gradeSettings: {
        created: [{ code: 'GRADE111', name: 'Stufe 7', createdAt: 1 }],
        known: [],
      },
      gradeClasses: {
        GRADE111: [{ id: classId, name: '7b' }],
      },
    })
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      code: '',
      name: '7b',
      gradeCode: 'GRADE111',
      classId,
      value: `grade:GRADE111:${classId}`,
    })
  })

  it('prefers local Klassencode over grade-only entry for the same public id', () => {
    const local = 'LOCALAAA'
    const classId = publicIdFromCode(local)
    const rows = mergeExamAssignableClasses({
      classSettings: {
        created: [{ code: local, name: 'Lokal', createdAt: 1 }],
        known: [],
        activeCode: null,
        sendPoints: false,
      },
      gradeSettings: {
        created: [{ code: 'GRADE111', name: 'Stufe', createdAt: 1 }],
        known: [],
      },
      gradeClasses: {
        GRADE111: [{ id: classId, name: 'Vom Server' }],
      },
    })
    expect(rows).toHaveLength(1)
    expect(rows[0].code).toBe(local)
    expect(rows[0].value).toBe(local)
  })
})
