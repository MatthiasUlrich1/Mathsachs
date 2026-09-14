import { describe, expect, it } from 'vitest'
import {
  buildExamProtocolHtml,
  examProtocolFileStem,
} from './examProtocolExport'
import type { ExamTaskResult } from '../components/ExamProtocolSheet'

const sampleResults = (): ExamTaskResult[] => [
  {
    resolved: {
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
    },
    answer: { kind: 'value', value: '7' },
    correct: true,
    earned: 2,
  },
]

describe('examProtocolExport', () => {
  it('builds HTML with separate Drucken and PDF actions', () => {
    const html = buildExamProtocolHtml({
      user: 'Ada',
      title: 'Probeklausur',
      results: sampleResults(),
      totalPoints: 2,
      printedAt: '15.09.2026',
    })
    expect(html).toContain('Klausurprotokoll')
    expect(html).toContain('>Drucken<')
    expect(html).toContain('Als PDF speichern')
    expect(html).toContain('Ada')
    expect(html).toContain('Probeklausur')
    expect(html).toContain('richtig')
    expect(html).not.toContain('<script>')
  })

  it('escapes HTML in task text', () => {
    const results = sampleResults()
    results[0].resolved.task.question = 'Was ist <b>3</b> & 4?'
    const html = buildExamProtocolHtml({
      user: 'Ada',
      title: 'T',
      results,
      totalPoints: 2,
      printedAt: '15.09.2026',
    })
    expect(html).toContain('Was ist &lt;b&gt;3&lt;/b&gt; &amp; 4?')
    expect(html).not.toContain('<b>3</b>')
  })

  it('builds a safe PDF filename stem', () => {
    expect(examProtocolFileStem('Probe / Test', 'Max Mustermann')).toMatch(
      /^Klausurprotokoll_/,
    )
    expect(examProtocolFileStem('Probe / Test', 'Max Mustermann')).not.toContain('/')
  })
})
