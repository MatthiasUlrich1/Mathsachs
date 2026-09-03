import { describe, it, expect } from 'vitest'
import {
  add,
  compare,
  divide,
  gcd,
  isReduced,
  isTerminating,
  makeFraction,
  multiply,
  reduce,
  subtract,
  toDecimal,
} from './fraction'

describe('fraction basics', () => {
  it('computes gcd', () => {
    expect(gcd(12, 8)).toBe(4)
    expect(gcd(7, 3)).toBe(1)
  })

  it('reduces fractions and normalises sign', () => {
    expect(reduce({ n: 4, d: 8 })).toEqual({ n: 1, d: 2 })
    expect(reduce({ n: 3, d: -6 })).toEqual({ n: -1, d: 2 })
  })

  it('adds and subtracts with a common denominator', () => {
    expect(add(makeFraction(1, 2), makeFraction(1, 3))).toEqual({ n: 5, d: 6 })
    expect(subtract(makeFraction(3, 4), makeFraction(1, 4))).toEqual({
      n: 1,
      d: 2,
    })
  })

  it('multiplies and divides', () => {
    expect(multiply(makeFraction(2, 3), makeFraction(3, 4))).toEqual({
      n: 1,
      d: 2,
    })
    expect(divide(makeFraction(1, 2), makeFraction(1, 4))).toEqual({
      n: 2,
      d: 1,
    })
  })

  it('compares fractions', () => {
    expect(compare(makeFraction(1, 2), makeFraction(2, 3))).toBeLessThan(0)
    expect(compare(makeFraction(3, 4), makeFraction(1, 2))).toBeGreaterThan(0)
    expect(compare(makeFraction(2, 4), makeFraction(1, 2))).toBe(0)
  })

  it('detects reduced and terminating fractions', () => {
    expect(isReduced({ n: 1, d: 2 })).toBe(true)
    expect(isReduced({ n: 2, d: 4 })).toBe(false)
    expect(isTerminating(makeFraction(1, 8))).toBe(true)
    expect(isTerminating(makeFraction(1, 3))).toBe(false)
  })

  it('converts to decimal', () => {
    expect(toDecimal(makeFraction(3, 4))).toBe(0.75)
  })
})
