import { describe, expect, it } from 'vitest'
import { fractionModelTask } from './taskHelpers'
import { initTaskInput } from '../components/TaskMedia'

const mk = (over: Partial<Parameters<typeof fractionModelTask>[0]> = {}) =>
  fractionModelTask({
    question: 'q',
    shape: 'bar',
    target: { num: 1, den: 2 },
    solution: '1/2',
    explanation: 'e',
    ...over,
  })

describe('fractionModelTask', () => {
  it('accepts the target and equivalent fractions by default (allowEquivalent true)', () => {
    const t = mk()
    expect(t.check({ kind: 'fractionModel', den: 2, shaded: [1] })).toBe(true)
    expect(t.check({ kind: 'fractionModel', den: 4, shaded: [0, 1] })).toBe(true)
    expect(t.check({ kind: 'fractionModel', den: 6, shaded: [0, 2, 4] })).toBe(true)
    expect(t.check({ kind: 'fractionModel', den: 4, shaded: [0] })).toBe(false)
  })

  it('requires the exact number of parts when allowEquivalent is false', () => {
    const t = mk({ allowEquivalent: false })
    expect(t.check({ kind: 'fractionModel', den: 2, shaded: [0] })).toBe(true)
    expect(t.check({ kind: 'fractionModel', den: 4, shaded: [0, 1] })).toBe(false)
  })

  it('untouched start state and other input kinds fail', () => {
    const t = mk()
    expect(t.check(initTaskInput(t))).toBe(false)
    expect(t.check({ kind: 'fractionModel', den: 2, shaded: [] })).toBe(false)
    expect(t.check({ kind: 'value', value: '1/2' })).toBe(false)
  })

  it('sampleAnswer passes check (also for targets outside 2..12 parts)', () => {
    for (const allowEquivalent of [true, false]) {
      for (const [num, den] of [[1, 2], [3, 4], [5, 6], [1, 12], [2, 3]]) {
        const t = mk({ target: { num: num!, den: den! }, allowEquivalent, shape: 'circle' })
        expect(t.check(t.sampleAnswer)).toBe(true)
      }
    }
    const t = mk({ target: { num: 1, den: 1 } })
    expect(t.check(t.sampleAnswer)).toBe(true)
    const odd = mk({ target: { num: 3, den: 15 } })
    expect(odd.check(odd.sampleAnswer)).toBe(true)
  })

  it('props: shape, target, allowEquivalent and a start den that is not the target den', () => {
    const t = mk({ target: { num: 3, den: 4 }, shape: 'circle' })
    expect(t.interactive?.type).toBe('fractionModel')
    expect(t.interactive?.props).toMatchObject({
      shape: 'circle',
      target: { num: 3, den: 4 },
      allowEquivalent: true,
    })
    expect(t.interactive?.props.initialDen).not.toBe(4)
    expect(initTaskInput(t)).toEqual({ kind: 'fractionModel', den: t.interactive?.props.initialDen, shaded: [] })
  })

  it('rejects invalid targets and shapes', () => {
    expect(() => mk({ target: { num: 0, den: 2 } })).toThrow()
    expect(() => mk({ target: { num: 3, den: 2 } })).toThrow()
    expect(() => mk({ target: { num: 1, den: 13 } })).toThrow()
    expect(() => mk({ target: { num: 1, den: 13 }, allowEquivalent: false })).toThrow()
    expect(() => mk({ shape: 'square' as never })).toThrow()
  })

  it('keeps an optional dedupeKey', () => {
    expect(mk({ dedupeKey: ' k ' }).dedupeKey).toBe('k')
    expect(mk().dedupeKey).toBeUndefined()
  })
})
