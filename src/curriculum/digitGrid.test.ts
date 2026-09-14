import { describe, expect, it } from 'vitest'
import { digitGridTask, parseDigitGrid } from '../curriculum/taskHelpers'

describe('digitGrid helpers', () => {
  it('parses digit cells into an integer', () => {
    expect(parseDigitGrid(['', '1', '2', '3'])).toBe(123)
    expect(parseDigitGrid(['5', '0', '0'])).toBe(500)
    expect(parseDigitGrid(['', '', ''])).toBeNull()
  })

  it('checks correct sample answers', () => {
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
})
