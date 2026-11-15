import { describe, expect, it } from 'vitest'
import { angleProtractorTask, rulerMeasureTask } from './measureTaskHelpers'
import { examAnswerAttempted } from '../exam/examAnswerAttempted'
import { emptyInput } from './types'
import { drawStartDegrees } from '../lib/protractorGeometry'
import { drawStartLength } from '../lib/rulerGeometry'

const measure = () =>
  angleProtractorTask({
    question: 'Miss den Winkel.',
    mode: 'measure',
    angle: 47,
    solution: '47°',
    explanation: 'Ablesen an der Skala.',
  })

describe('angleProtractorTask', () => {
  it('accepts the angle within the default tolerance of 1 degree', () => {
    const t = measure()
    expect(t.check({ kind: 'angleProtractor', degrees: 47, touched: true })).toBe(true)
    expect(t.check({ kind: 'angleProtractor', degrees: 48, touched: true })).toBe(true)
    expect(t.check({ kind: 'angleProtractor', degrees: 46, touched: true })).toBe(true)
    expect(t.check({ kind: 'angleProtractor', degrees: 49, touched: true })).toBe(false)
  })

  it('honours a custom tolerance', () => {
    const t = angleProtractorTask({
      question: 'q',
      mode: 'measure',
      angle: 47,
      tolerance: 3,
      solution: 's',
      explanation: 'e',
    })
    expect(t.check({ kind: 'angleProtractor', degrees: 50, touched: true })).toBe(true)
    expect(t.check({ kind: 'angleProtractor', degrees: 51, touched: true })).toBe(false)
  })

  it('rejects an untouched instrument and missing degrees', () => {
    const t = measure()
    expect(t.check({ kind: 'angleProtractor', degrees: 47, touched: false })).toBe(false)
    expect(t.check({ kind: 'angleProtractor', degrees: null, touched: true })).toBe(false)
  })

  it('accepts a typed value (exam/worksheet) with the same tolerance', () => {
    const t = measure()
    expect(t.check({ kind: 'value', value: '47' })).toBe(true)
    expect(t.check({ kind: 'value', value: '48,0' })).toBe(true)
    expect(t.check({ kind: 'value', value: '50' })).toBe(false)
    expect(t.check({ kind: 'value', value: '' })).toBe(false)
    expect(t.check({ kind: 'value', value: 'abc' })).toBe(false)
  })

  it('has a sampleAnswer that passes check', () => {
    for (const mode of ['measure', 'draw'] as const) {
      const t = angleProtractorTask({ question: 'q', mode, angle: 120, solution: 's', explanation: 'e' })
      expect(t.check(t.sampleAnswer)).toBe(true)
    }
  })

  it('does not spoil the angle in the visual or the question', () => {
    const t = measure()
    expect(t.visualContent ?? '').not.toContain('47°')
    expect(t.question).not.toContain('47')
  })

  it('configures the interactive and a spoiler-free draw start', () => {
    const t = measure()
    expect(t.interactive?.type).toBe('angleProtractor')
    expect(t.interactive?.props).toMatchObject({ mode: 'measure', angle: 47, startAngle: 0 })
    for (let angle = 1; angle <= 179; angle++) {
      const start = drawStartDegrees(angle)
      expect(Math.abs(start - angle)).toBeGreaterThanOrEqual(20)
      expect(start).toBeGreaterThanOrEqual(1)
      expect(start).toBeLessThanOrEqual(179)
    }
    const draw = angleProtractorTask({ question: 'q', mode: 'draw', angle: 47, solution: 's', explanation: 'e' })
    expect(draw.interactive?.props.initialDegrees).not.toBe(47)
  })

  it('rejects angles outside 1..179', () => {
    const bad = (angle: number) =>
      angleProtractorTask({ question: 'q', mode: 'measure', angle, solution: 's', explanation: 'e' })
    expect(() => bad(0)).toThrow()
    expect(() => bad(180)).toThrow()
    expect(() => bad(47.5)).toThrow()
  })

  it('counts only a touched instrument as attempted in an exam', () => {
    const t = measure()
    expect(examAnswerAttempted(t, emptyInput('angleProtractor'))).toBe(false)
    expect(examAnswerAttempted(t, { kind: 'angleProtractor', degrees: 47, touched: false })).toBe(false)
    expect(examAnswerAttempted(t, { kind: 'angleProtractor', degrees: null, touched: true })).toBe(false)
    expect(examAnswerAttempted(t, { kind: 'angleProtractor', degrees: 47, touched: true })).toBe(true)
  })
})

describe('rulerMeasureTask', () => {
  const ruler = () =>
    rulerMeasureTask({
      question: 'Miss die Strecke.',
      mode: 'measure',
      lengthCm: 4.3,
      solution: '4,3 cm',
      explanation: 'Am Lineal ablesen.',
    })

  it('accepts the length within the default tolerance of 0.1 cm', () => {
    const t = ruler()
    expect(t.check({ kind: 'rulerMeasure', length: 4.3, touched: true })).toBe(true)
    expect(t.check({ kind: 'rulerMeasure', length: 4.4, touched: true })).toBe(true)
    expect(t.check({ kind: 'rulerMeasure', length: 4.2, touched: true })).toBe(true)
    expect(t.check({ kind: 'rulerMeasure', length: 4.5, touched: true })).toBe(false)
    expect(t.check({ kind: 'rulerMeasure', length: 4.1, touched: true })).toBe(false)
  })

  it('honours a custom tolerance', () => {
    const t = rulerMeasureTask({
      question: 'q',
      mode: 'measure',
      lengthCm: 4.3,
      tolerance: 0.3,
      solution: 's',
      explanation: 'e',
    })
    expect(t.check({ kind: 'rulerMeasure', length: 4.6, touched: true })).toBe(true)
    expect(t.check({ kind: 'rulerMeasure', length: 4.7, touched: true })).toBe(false)
  })

  it('rejects an untouched instrument and missing length', () => {
    const t = ruler()
    expect(t.check({ kind: 'rulerMeasure', length: 4.3, touched: false })).toBe(false)
    expect(t.check({ kind: 'rulerMeasure', length: null, touched: true })).toBe(false)
  })

  it('accepts a typed value with a decimal comma (exam/worksheet)', () => {
    const t = ruler()
    expect(t.check({ kind: 'value', value: '4,3' })).toBe(true)
    expect(t.check({ kind: 'value', value: '4.3' })).toBe(true)
    expect(t.check({ kind: 'value', value: '4,4' })).toBe(true)
    expect(t.check({ kind: 'value', value: '4,6' })).toBe(false)
    expect(t.check({ kind: 'value', value: '' })).toBe(false)
    expect(t.check({ kind: 'value', value: 'abc' })).toBe(false)
  })

  it('has a sampleAnswer that passes check', () => {
    for (const mode of ['measure', 'draw'] as const) {
      const t = rulerMeasureTask({ question: 'q', mode, lengthCm: 7.8, angle: -10, solution: 's', explanation: 'e' })
      expect(t.check(t.sampleAnswer)).toBe(true)
    }
  })

  it('does not spoil the length in the visual or the question', () => {
    const t = ruler()
    expect(t.visualContent ?? '').not.toContain('4,3')
    expect(t.visualContent ?? '').not.toContain('4.3')
    expect(t.question).not.toContain('4')
  })

  it('configures the interactive and a spoiler-free draw start', () => {
    const t = ruler()
    expect(t.interactive?.type).toBe('rulerMeasure')
    expect(t.interactive?.props).toMatchObject({ mode: 'measure', lengthCm: 4.3, angle: 0, unitPx: 40 })
    const draw = rulerMeasureTask({ question: 'q', mode: 'draw', lengthCm: 4.3, solution: 's', explanation: 'e' })
    expect(draw.interactive?.props.initialLength).toBe(drawStartLength(4.3))
    expect(draw.interactive?.props.initialLength).not.toBe(4.3)
  })

  it('rejects lengths, angles and scales outside the allowed range', () => {
    const make = (extra: object) => () =>
      rulerMeasureTask({ question: 'q', mode: 'measure', lengthCm: 4.3, solution: 's', explanation: 'e', ...extra })
    expect(make({ lengthCm: 0.4 })).toThrow()
    expect(make({ lengthCm: 12.1 })).toThrow()
    expect(make({ lengthCm: 4.33 })).toThrow()
    expect(make({ angle: 20 })).toThrow()
    expect(make({ unitPx: 60 })).toThrow()
    expect(make({ lengthCm: 0.5 })).not.toThrow()
    expect(make({ lengthCm: 12, angle: -15, unitPx: 40 })).not.toThrow()
  })

  it('counts only a touched instrument as attempted in an exam', () => {
    const t = ruler()
    expect(examAnswerAttempted(t, emptyInput('rulerMeasure'))).toBe(false)
    expect(examAnswerAttempted(t, { kind: 'rulerMeasure', length: 4.3, touched: false })).toBe(false)
    expect(examAnswerAttempted(t, { kind: 'rulerMeasure', length: null, touched: true })).toBe(false)
    expect(examAnswerAttempted(t, { kind: 'rulerMeasure', length: 4.3, touched: true })).toBe(true)
  })
})
