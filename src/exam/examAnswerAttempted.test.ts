import { describe, expect, it } from 'vitest'
import type { Task, UserInput } from '../curriculum/types'
import { examAnswerAttempted, examTaskEarned } from './examAnswerAttempted'

const baseTask = (check: Task['check']): Task => ({
  question: 'q',
  answerKind: 'integer',
  solution: '1',
  explanation: '',
  check,
  sampleAnswer: { kind: 'value', value: '1' },
})

describe('examAnswerAttempted', () => {
  it('detects coordinate clicks', () => {
    const task = baseTask(() => true)
    expect(
      examAnswerAttempted(task, { kind: 'coordinateClick', x: Number.NaN, y: Number.NaN }),
    ).toBe(false)
    expect(examAnswerAttempted(task, { kind: 'coordinateClick', x: 4, y: 3 })).toBe(true)
  })

  it('scores attempted correct answers', () => {
    const task = baseTask((input) => {
      return input.kind === 'coordinateClick' && input.x === 4 && input.y === 3
    })
    const ok: UserInput = { kind: 'coordinateClick', x: 4, y: 3 }
    const bad: UserInput = { kind: 'coordinateClick', x: 1, y: 1 }
    expect(examTaskEarned(task, ok, 10)).toBe(10)
    expect(examTaskEarned(task, bad, 10)).toBe(0)
    expect(
      examTaskEarned(task, { kind: 'coordinateClick', x: Number.NaN, y: Number.NaN }, 10),
    ).toBe(0)
  })
})
