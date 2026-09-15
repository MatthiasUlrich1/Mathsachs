import { describe, expect, it } from 'vitest'
import {
  digitGridTask,
  digitGridMultiplyTask,
  digitGridDivideTask,
  parseDigitGrid,
} from '../curriculum/taskHelpers'
import { longDivisionSteps, padDigits } from '../curriculum/digitGridTasks'

describe('digitGrid helpers', () => {
  it('parses digit cells into an integer', () => {
    expect(parseDigitGrid(['', '1', '2', '3'])).toBe(123)
    expect(parseDigitGrid(['5', '0', '0'])).toBe(500)
    expect(parseDigitGrid(['', '', ''])).toBeNull()
  })

  it('checks correct sample answers for +/−', () => {
    const task = digitGridTask({
      question: 'Addiere',
      a: 123,
      b: 45,
      operator: '+',
      value: 168,
      solution: '168',
      explanation: '123 + 45 = 168',
    })
    expect(task.check(task.sampleAnswer)).toBe(true)
    expect(task.interactive?.type).toBe('digitGrid')
    expect(task.check({ kind: 'digitGrid', digits: ['1', '6', '8'] })).toBe(true)
    expect(task.check({ kind: 'digitGrid', digits: ['1', '6', '9'] })).toBe(false)
    expect(task.check({ kind: 'value', value: '168' })).toBe(true)
  })

  it('builds German multiplikation with Teilprodukte + Summe', () => {
    // 23 · 36 → 690 (=23·30), 138 (=23·6), Summe 828
    const task = digitGridMultiplyTask({
      question: 'Multipliziere',
      a: 23,
      b: 36,
      solution: '828',
      explanation: '23 · 36 = 828',
    })
    expect(task.interactive?.type).toBe('digitGrid')
    expect(task.interactive?.props.layout).toBe('multiply')
    const editable = (task.interactive?.props.rows as Array<{ editable?: boolean }>).filter(
      (r) => r.editable,
    )
    expect(editable).toHaveLength(3) // 2 partials + sum
    expect(task.check(task.sampleAnswer)).toBe(true)
    const width = task.interactive?.props.answerLength as number
    expect(
      task.check({
        kind: 'digitGrid',
        digits: padDigits(828, width),
        answerRows: [padDigits(690, width), padDigits(138, width), padDigits(828, width)],
      }),
    ).toBe(true)
    expect(
      task.check({
        kind: 'digitGrid',
        digits: padDigits(828, width),
        answerRows: [padDigits(138, width), padDigits(690, width), padDigits(828, width)],
      }),
    ).toBe(false)
  })

  it('builds schriftliche Division with quotient (+ rest)', () => {
    const task = digitGridDivideTask({
      question: 'Dividiere',
      dividend: 59535,
      divisor: 7,
      quotient: 8505,
      rest: 0,
      solution: '8505',
      explanation: '59535 : 7 = 8505',
    })
    expect(task.interactive?.props.layout).toBe('divide')
    expect(task.check(task.sampleAnswer)).toBe(true)
    expect(
      task.check({
        kind: 'digitGrid',
        digits: ['8', '5', '0', '5'],
        answerRows: [['8', '5', '0', '5']],
      }),
    ).toBe(true)
    expect(
      task.check({
        kind: 'digitGrid',
        digits: ['8', '5', '5', '5'],
        answerRows: [['8', '5', '5', '5']],
      }),
    ).toBe(false)

    const withRest = digitGridDivideTask({
      question: 'Dividiere',
      dividend: 100,
      divisor: 7,
      quotient: 14,
      rest: 2,
      solution: '14 R 2',
      explanation: '100 : 7 = 14 Rest 2',
    })
    expect(withRest.check(withRest.sampleAnswer)).toBe(true)
    expect(
      withRest.check({
        kind: 'digitGrid',
        digits: ['1', '4'],
        answerRows: [
          ['1', '4'],
          ['2'],
        ],
      }),
    ).toBe(true)
  })

  it('computes long-division steps including zero quotient digits', () => {
    const { quotient, rest, steps } = longDivisionSteps(59535, 7)
    expect(quotient).toBe(8505)
    expect(rest).toBe(0)
    expect(steps.map((s) => s.qDigit)).toEqual([8, 5, 0, 5])
  })
})
