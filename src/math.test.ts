import { describe, it, expect } from 'vitest'
import { checkAnswer, generateProblem, rangeFor } from './math'

/** Deterministic RNG that cycles through the provided values. */
const seq = (values: number[]) => {
  let i = 0
  return () => values[i++ % values.length]
}

describe('generateProblem', () => {
  it('throws when no operations are enabled', () => {
    expect(() => generateProblem('easy', [])).toThrow()
  })

  it('produces a correct addition problem', () => {
    const p = generateProblem('easy', ['+'], seq([0, 0.5, 0.9]))
    expect(p.operation).toBe('+')
    expect(p.answer).toBe(p.a + p.b)
    expect(p.prompt).toBe(`${p.a} + ${p.b}`)
  })

  it('never produces negative subtraction answers', () => {
    for (let i = 0; i < 500; i++) {
      const p = generateProblem('hard', ['-'])
      expect(p.answer).toBeGreaterThanOrEqual(0)
      expect(p.answer).toBe(p.a - p.b)
    }
  })

  it('division always yields whole-number answers', () => {
    for (let i = 0; i < 500; i++) {
      const p = generateProblem('hard', ['÷'])
      expect(Number.isInteger(p.answer)).toBe(true)
      expect(p.a / p.b).toBe(p.answer)
    }
  })

  it('respects the difficulty range for addition operands', () => {
    const max = rangeFor('easy')
    for (let i = 0; i < 500; i++) {
      const p = generateProblem('easy', ['+'])
      expect(p.a).toBeLessThanOrEqual(max)
      expect(p.b).toBeLessThanOrEqual(max)
    }
  })

  it('only chooses from the enabled operations', () => {
    const enabled = new Set(['+', '×'])
    for (let i = 0; i < 500; i++) {
      const p = generateProblem('medium', ['+', '×'])
      expect(enabled.has(p.operation)).toBe(true)
    }
  })
})

describe('checkAnswer', () => {
  it('accepts the correct answer', () => {
    const p = generateProblem('easy', ['+'], seq([0, 0.5, 0.5]))
    expect(checkAnswer(p, p.answer)).toBe(true)
  })

  it('rejects an incorrect answer', () => {
    const p = generateProblem('easy', ['+'], seq([0, 0.5, 0.5]))
    expect(checkAnswer(p, p.answer + 1)).toBe(false)
  })
})
