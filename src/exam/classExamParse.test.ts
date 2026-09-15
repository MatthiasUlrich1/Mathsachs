import { describe, expect, it } from 'vitest'
import {
  applyClassExamTombstones,
  groupClassExamsByCode,
  mergeCompletedClassExamIds,
  parseStoredClassExam,
  parseStoredClassExams,
} from './classExamParse'

describe('classExamParse', () => {
  it('parses a valid stored class exam', () => {
    const parsed = parseStoredClassExam({
      id: 'ABCDEF12',
      hostCode: 'GHJKMN34',
      name: 'Brüche KA',
      examCode: 'MSX1:abc:def',
      createdAt: 100,
      owned: true,
      taskCount: 5,
      totalPoints: 10,
    })
    expect(parsed).toMatchObject({
      id: 'ABCDEF12',
      hostCode: 'GHJKMN34',
      name: 'Brüche KA',
      owned: true,
      taskCount: 5,
    })
  })

  it('rejects exams without MSX1 payload', () => {
    expect(
      parseStoredClassExam({
        id: 'ABCDEF12',
        hostCode: 'GHJKMN34',
        name: 'X',
        examCode: 'nope',
        createdAt: 1,
      }),
    ).toBeNull()
  })

  it('applies tombstones and merges completed ids', () => {
    const exams = parseStoredClassExams([
      {
        id: 'AAAAAAAA',
        hostCode: 'BBBBBBBB',
        name: 'A',
        examCode: 'MSX1:a:b',
        createdAt: 1,
      },
      {
        id: 'CCCCCCCC',
        hostCode: 'BBBBBBBB',
        name: 'C',
        examCode: 'MSX1:c:d',
        createdAt: 2,
      },
    ])
    const applied = applyClassExamTombstones(exams, [
      { id: 'AAAAAAAA', deletedAt: Date.now() },
    ])
    expect(applied.classExams.map((e) => e.id)).toEqual(['CCCCCCCC'])
    expect(mergeCompletedClassExamIds(['aa'], ['BB', 'aa'])).toEqual(['AA', 'BB'])
  })

  it('keeps hostCode when reassignment has the same createdAt', () => {
    const exams = parseStoredClassExams([
      {
        id: 'EXAM0001',
        hostCode: 'CLASSAAA',
        name: 'KA',
        examCode: 'MSX1:x:y',
        createdAt: 100,
        owned: true,
      },
      {
        id: 'EXAM0001',
        hostCode: 'CLASSBBB',
        name: 'KA',
        examCode: 'MSX1:x:y',
        createdAt: 100,
        owned: true,
      },
    ])
    expect(exams).toHaveLength(1)
    expect(exams[0].hostCode).toBe('CLASSBBB')
  })

  it('groups exams by MSX1 code across classes', () => {
    const groups = groupClassExamsByCode([
      {
        id: 'A1',
        hostCode: 'CLASS1',
        className: '5a',
        name: 'KA Brüche',
        examCode: 'MSX1:same:one',
        createdAt: 10,
        solveCount: 2,
      },
      {
        id: 'A2',
        hostCode: 'CLASS2',
        className: '5b',
        name: 'KA Brüche',
        examCode: 'MSX1:same:one',
        createdAt: 20,
        solveCount: 3,
      },
      {
        id: 'B1',
        hostCode: 'CLASS1',
        name: 'Andere',
        examCode: 'MSX1:other:two',
        createdAt: 5,
      },
    ])
    expect(groups).toHaveLength(2)
    const main = groups.find((g) => g.examCode === 'MSX1:same:one')!
    expect(main.assignments).toHaveLength(2)
    expect(main.solveCount).toBe(5)
    expect(main.assignments.map((a) => a.className)).toEqual(['5a', '5b'])
  })
})
