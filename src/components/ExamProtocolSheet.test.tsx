import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { UserInput } from '../curriculum/types'
import type { ResolvedExamTask } from '../exam/examCode'
import { ExamProtocolSheet, formatExamAnswer } from './ExamProtocolSheet'

const sampleResolved = (overrides: Partial<ResolvedExamTask> = {}): ResolvedExamTask => ({
  ref: { modul: 'mathematik-klasse-5', thema: 'lb1-addition', seed: 1, punkte: 2 },
  task: {
    question: 'Berechne 3 + 4.',
    answerKind: 'integer',
    solution: '7',
    explanation: '3 + 4 = 7',
    sampleAnswer: { kind: 'value', value: '7' },
    check: () => true,
  },
  punkte: 2,
  moduleId: 'mathematik-klasse-5',
  topicId: 'lb1-addition',
  topicTitle: 'Addition',
  areaTitle: 'Zahlen',
  gradeTitle: 'Klasse 5',
  ...overrides,
})

describe('ExamProtocolSheet', () => {
  it('renders an evaluation-only Klausurprotokoll', () => {
    const results = [
      {
        resolved: sampleResolved(),
        answer: { kind: 'value', value: '7' } satisfies UserInput,
        correct: true,
        earned: 2,
      },
      {
        resolved: sampleResolved({
          task: {
            question: 'Berechne 9 − 2.',
            answerKind: 'integer',
            solution: '7',
            explanation: '9 − 2 = 7',
            sampleAnswer: { kind: 'value', value: '7' },
            check: () => false,
          },
          topicTitle: 'Subtraktion',
          punkte: 3,
        }),
        answer: { kind: 'value', value: '5' } satisfies UserInput,
        correct: false,
        earned: 0,
      },
    ]

    const html = renderToStaticMarkup(
      createElement(ExamProtocolSheet, {
        user: 'Ada',
        title: 'Probeklausur LB1',
        results,
        totalPoints: 5,
        printedAt: '15.09.2026',
      }),
    )

    expect(html).toContain('Klausurprotokoll')
    expect(html).toContain('Ada')
    expect(html).toContain('Probeklausur LB1')
    expect(html).toContain('2/5')
    expect(html).toContain('40%')
    expect(html).toContain('1/2')
    expect(html).toContain('richtig')
    expect(html).toContain('falsch')
    expect(html).toContain('(richtig: 7)')
    expect(html).not.toContain('Ähnliche Aufgabe üben')
    expect(html).not.toContain('Drucken')
  })

  it('formats interactive answers for the protocol table', () => {
    expect(formatExamAnswer({ kind: 'fraction', num: '1', den: '2' })).toBe('1/2')
    expect(formatExamAnswer({ kind: 'numberLine', value: 3.5 })).toBe('3.5')
    expect(formatExamAnswer({ kind: 'digitGrid', digits: ['', '1', '2'] })).toBe('12')
    expect(formatExamAnswer({ kind: 'value', value: '  ' })).toBe('—')
  })
})
