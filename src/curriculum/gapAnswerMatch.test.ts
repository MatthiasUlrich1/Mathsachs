import { describe, expect, it } from 'vitest'
import {
  enrichGapAccepted,
  gapAnswerMatches,
  normalizeGapAnswer,
} from './gapAnswerMatch'
import { clozeBlanksTask, gapFillTask } from './biologieHelpers'
import { textTask } from './taskHelpers'

describe('normalizeGapAnswer', () => {
  it('folds case, umlauts and trailing punctuation', () => {
    expect(normalizeGapAnswer('Wirkstoffe.')).toBe('wirkstoffe')
    expect(normalizeGapAnswer('Wirbelsäule')).toBe('wirbelsaeule')
    expect(normalizeGapAnswer('Wirbelsaeule')).toBe('wirbelsaeule')
    expect(normalizeGapAnswer('  Kamille!  ')).toBe('kamille')
  })

  it('keeps short math symbols', () => {
    expect(normalizeGapAnswer('<')).toBe('<')
    expect(normalizeGapAnswer('=')).toBe('=')
  })
})

describe('gapAnswerMatches', () => {
  it('accepts synonyms and stems for Heilpflanzen gaps', () => {
    const wirk = ['Wirkstoffe', 'Wirkstoff', 'medizinische Wirkstoffe']
    expect(gapAnswerMatches('Wirkstoff', wirk)).toBe(true)
    expect(gapAnswerMatches('Wirkstoffe', wirk)).toBe(true)
    expect(gapAnswerMatches('Inhaltsstoffe', enrichGapAccepted(wirk))).toBe(true)
    expect(gapAnswerMatches('medizinische Wirkstoffe', wirk)).toBe(true)
    expect(gapAnswerMatches('Wirkstoffe.', wirk)).toBe(true)
    expect(gapAnswerMatches('Giftzähne', wirk)).toBe(false)
    expect(gapAnswerMatches('Blätter', wirk)).toBe(false)
  })

  it('accepts Dosis synonyms and rejects unrelated', () => {
    const dosis = enrichGapAccepted(['Dosis', 'Dosierung'])
    expect(gapAnswerMatches('Dosis', dosis)).toBe(true)
    expect(gapAnswerMatches('Dosierung', dosis)).toBe(true)
    expect(gapAnswerMatches('Menge', dosis)).toBe(true)
    expect(gapAnswerMatches('Farbe', dosis)).toBe(false)
  })

  it('accepts umlaut ASCII variants', () => {
    expect(gapAnswerMatches('Wirbelsaeule', ['Wirbelsäule'])).toBe(true)
    expect(gapAnswerMatches('Spaltoeffnung', ['Spaltöffnung'])).toBe(true)
  })

  it('does not over-match short stems', () => {
    expect(gapAnswerMatches('artfremde', ['Art'])).toBe(false)
    expect(gapAnswerMatches('Kernmembran', ['Kern'])).toBe(false)
  })

  it('accepts Steuerung-style fish function synonyms via enrich', () => {
    const acc = enrichGapAccepted(['Steuern und Bremsen'])
    expect(gapAnswerMatches('Steuerung', acc)).toBe(true)
    expect(gapAnswerMatches('Lenken', acc)).toBe(true)
    expect(gapAnswerMatches('Atmung', acc)).toBe(false)
  })
})

describe('textTask / cloze use central tolerance', () => {
  const fw = { text: 'Test', quelle: 't', url: 'https://example.com' }

  it('gapFillTask accepts umlaut + stem', () => {
    const task = gapFillTask({
      question: 'Lücke?',
      accepted: ['Wirkstoffe'],
      solution: 'Wirkstoffe',
      explanation: 'e',
      fachwissen: fw,
    })
    expect(task.check({ kind: 'value', value: 'Wirkstoff' })).toBe(true)
    expect(task.check({ kind: 'value', value: 'wirkstoffe.' })).toBe(true)
    expect(task.check({ kind: 'value', value: 'Gift' })).toBe(false)
  })

  it('clozeBlanksTask accepts synonym list', () => {
    const task = clozeBlanksTask({
      question: 'Lücke?',
      template: 'Heilpflanzen enthalten ___.',
      accepted: [enrichGapAccepted(['Wirkstoffe'])],
      solution: 'Wirkstoffe',
      explanation: 'e',
      fachwissen: fw,
    })
    expect(task.check({ kind: 'clozeMulti', blanks: ['Inhaltsstoffe'] })).toBe(true)
    expect(task.check({ kind: 'clozeMulti', blanks: ['Federfahne'] })).toBe(false)
  })

  it('math textTask still exact for symbols', () => {
    const task = textTask({
      question: 'Vergleich',
      accepted: ['<', '>'],
      solution: '<',
      explanation: 'e',
    })
    expect(task.check({ kind: 'value', value: '<' })).toBe(true)
    expect(task.check({ kind: 'value', value: '>' })).toBe(true)
    expect(task.check({ kind: 'value', value: '=' })).toBe(false)
  })
})
