import { describe, expect, it } from 'vitest'
import {
  applyOps,
  formatEq,
  isSolved,
  linesAfterOp,
  solutionX,
  solveAddPath,
  solveMulPath,
  type LinEq,
} from './equationSteps'

describe('equationSteps', () => {
  it('solves x + a = b by subtracting a', () => {
    const start: LinEq = { ax: 1, b: 5, cx: 0, d: 12 }
    const ops = solveAddPath(5, 12)
    const end = applyOps(start, ops)
    expect(isSolved(end)).toBe(true)
    expect(solutionX(end)).toBe(7)
    expect(formatEq(end)).toBe('x = 7')
  })

  it('solves a · x = b by dividing', () => {
    const start: LinEq = { ax: 4, b: 0, cx: 0, d: -16 }
    const ops = solveMulPath(4, -16)
    const end = applyOps(start, ops)
    expect(isSolved(end)).toBe(true)
    expect(solutionX(end)).toBe(-4)
  })

  it('shows multi-line transcript like the worksheet', () => {
    const start: LinEq = { ax: 4, b: -8, cx: 2, d: 0 }
    const { lines, after } = linesAfterOp(start, { kind: 'add', n: 8 })
    expect(lines[0]?.opLabel).toBe('| + 8')
    expect(lines.some((l) => l.eq.includes('+ 8'))).toBe(true)
    const step2 = linesAfterOp(after, { kind: 'subX', n: 2 })
    const step3 = linesAfterOp(step2.after, { kind: 'div', n: 2 })
    expect(solutionX(step3.after)).toBe(4)
  })

  it('handles negative addend x − 5 = 2 via + 5', () => {
    const start: LinEq = { ax: 1, b: -5, cx: 0, d: 2 }
    const end = applyOps(start, solveAddPath(-5, 2))
    expect(solutionX(end)).toBe(7)
  })
})
