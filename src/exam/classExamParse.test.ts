import { describe, expect, it } from 'vitest'
import {
  applyClassExamTombstones,
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
})
