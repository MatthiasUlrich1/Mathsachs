/**
 * Tests for reusable sourceQuote + causeEffect interactions.
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { causeEffectTask, sourceQuoteTask } from './taskHelpers'
import { bankGenerate, type BioBank } from './biologieBank'

describe('sourceQuote + causeEffect task helpers', () => {
  it('sourceQuote grades choicePick answers', () => {
    const task = sourceQuoteTask({
      question: 'Was folgt aus der Quelle?',
      sourceText: 'Testquelle.',
      sourceKind: 'Primärquelle',
      choices: ['Richtig', 'Falsch A', 'Falsch B'],
      correct: 'Richtig',
      solution: 'Richtig',
      explanation: 'Kurz erklärt.',
      fachwissen: {
        text: 'Quellenkritik prüft Herkunft und Absicht. Das gilt für Texte und Funde. Deutung bleibt rekonstruktiv.',
      },
      dedupeKey: 'test:src',
      contentIds: ['test:src'],
    })
    expect(task.interactive?.type).toBe('sourceQuote')
    expect(task.check({ kind: 'choicePick', choice: 'Richtig' })).toBe(true)
    expect(task.check({ kind: 'choicePick', choice: 'Falsch A' })).toBe(false)
    expect(task.sampleAnswer).toEqual({ kind: 'choicePick', choice: 'Richtig' })
  })

  it('causeEffect grades pairMatch links with partial credit', () => {
    const task = causeEffectTask({
      question: 'Ordne zu',
      left: [
        { id: 'c0', label: 'Ursache A' },
        { id: 'c1', label: 'Ursache B' },
      ],
      right: [
        { id: 'e0', label: 'Wirkung A' },
        { id: 'e1', label: 'Wirkung B' },
        { id: 'xd', label: 'Ablenkung' },
      ],
      correctLinks: { c0: 'e0', c1: 'e1' },
      solution: 'A→A; B→B',
      explanation: 'Passt.',
      fachwissen: {
        text: 'Ursache und Wirkung helfen, Zusammenhänge zu ordnen. Historische Prozesse sind oft mehrdeutig. Zuordnung schärft das Urteil.',
      },
    })
    expect(task.interactive?.type).toBe('causeEffect')
    expect(task.check({ kind: 'pairMatch', links: { c0: 'e0', c1: 'e1' } })).toBe(true)
    const partial = task.grade!({ kind: 'pairMatch', links: { c0: 'e0', c1: 'xd' } })
    expect(partial.fraction).toBe(0.5)
    expect(partial.parts).toEqual([true, false])
  })

  it('bankGenerate emits sourceQuote and causeEffect from BioBank fields', () => {
    const bank: BioBank = {
      quelle: 'Test',
      url: 'https://example.org',
      conceptPrefix: 'ge:test',
      sources: [
        {
          concept: 's1',
          question: 'Deutung?',
          sourceText: 'Ein kurzer Quellentext.',
          sourceKind: 'Chronik',
          correct: 'Deutung X',
          wrong: ['A', 'B', 'C'],
          explanation: 'Passt zur Quelle.',
          wissen:
            'Quellen sind parteilich und lückenhaft. Kritik prüft Absicht und Kontext. Deutung bleibt eine Rekonstruktion.',
        },
      ],
      causeEffects: [
        {
          concept: 'c1',
          cause: 'Ursache 1',
          effect: 'Wirkung 1',
          wissen: 'Erste Ursache führt zur ersten Wirkung. Zusammenhänge sind prüfbar. Zuordnung trainiert Urteil.',
        },
        {
          concept: 'c2',
          cause: 'Ursache 2',
          effect: 'Wirkung 2',
          wissen: 'Zweite Ursache führt zur zweiten Wirkung. Zusammenhänge sind prüfbar. Zuordnung trainiert Urteil.',
        },
        {
          concept: 'c3',
          cause: 'Ursache 3',
          effect: 'Wirkung 3',
          wissen: 'Dritte Ursache führt zur dritten Wirkung. Zusammenhänge sind prüfbar. Zuordnung trainiert Urteil.',
        },
      ],
    }
    const gen = bankGenerate(bank)
    let sawSource = false
    let sawCause = false
    for (let i = 0; i < 80; i++) {
      const t = gen(createRng(i * 17 + 3))
      if (t.interactive?.type === 'sourceQuote') sawSource = true
      if (t.interactive?.type === 'causeEffect') sawCause = true
    }
    expect(sawSource).toBe(true)
    expect(sawCause).toBe(true)
  })
})
