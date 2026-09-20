import { describe, expect, it } from 'vitest'
import { emptyInput } from '../curriculum/types'
import type { ExamTaskResult } from '../components/ExamProtocolSheet'
import {
  findSavedEvaluationForClassExam,
  fromSavedExamEvaluation,
  mergeSavedExamEvaluations,
  parseSavedExamEvaluations,
  toSavedExamEvaluation,
} from './savedExamEvaluation'

const sampleResult = (): ExamTaskResult => ({
  resolved: {
    ref: { modul: 'm', thema: 't', seed: 1, punkte: 2 },
    task: {
      question: 'Wieviel ist 1+1?',
      answerKind: 'text',
      solution: '2',
      explanation: 'Eins plus eins.',
      check: () => true,
      sampleAnswer: emptyInput('text'),
    },
    punkte: 2,
    moduleId: 'm',
    topicId: 't',
    topicTitle: 'Thema',
    areaTitle: 'Bereich',
    gradeTitle: 'Klasse',
  },
  answer: { kind: 'value', value: '2' },
  correct: true,
  earned: 2,
})

describe('savedExamEvaluation', () => {
  it('round-trips display fields for reopen', () => {
    const saved = toSavedExamEvaluation({
      title: 'Probeklausur',
      totalPoints: 2,
      results: [sampleResult()],
      classExamId: 'EX1',
    })
    const restored = fromSavedExamEvaluation(saved)
    expect(restored.title).toBe('Probeklausur')
    expect(restored.totalPoints).toBe(2)
    expect(restored.results[0]?.resolved.task.question).toBe('Wieviel ist 1+1?')
    expect(restored.results[0]?.answer).toEqual({ kind: 'value', value: '2' })
    expect(restored.results[0]?.correct).toBe(true)
    expect(JSON.parse(JSON.stringify(saved)).results[0].question).toBe('Wieviel ist 1+1?')
  })

  it('parses and finds by class exam id', () => {
    const saved = toSavedExamEvaluation({
      title: 'K',
      totalPoints: 2,
      results: [sampleResult()],
      classExamId: 'ab12',
    })
    const list = parseSavedExamEvaluations([saved])
    expect(findSavedEvaluationForClassExam(list, 'AB12')?.title).toBe('K')
    expect(findSavedEvaluationForClassExam(list, 'nope')).toBeNull()
  })

  it('merges by id keeping newer', () => {
    const older = toSavedExamEvaluation({
      title: 'alt',
      totalPoints: 2,
      results: [sampleResult()],
      classExamId: 'X',
      finishedAt: 100,
    })
    const newer = { ...older, title: 'neu', finishedAt: 200 }
    const merged = mergeSavedExamEvaluations([older], [newer])
    expect(merged).toHaveLength(1)
    expect(merged[0]?.title).toBe('neu')
  })
})
