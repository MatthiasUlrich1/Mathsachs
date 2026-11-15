import { describe, expect, it } from 'vitest'
import { angleProtractorTask } from './measureTaskHelpers'
import { examAnswerAttempted } from '../exam/examAnswerAttempted'
import { emptyInput } from './types'
import { drawStartDegrees } from '../lib/protractorGeometry'

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
