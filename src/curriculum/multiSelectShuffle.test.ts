import { describe, expect, it } from 'vitest'
import { multiSelectTask } from './taskHelpers'

describe('multiSelectTask option shuffle', () => {
  it('shuffles so correct answers are not always the first N options', () => {
    const correct = ['A', 'B', 'C', 'D']
    const wrong = ['E']
    let correctFirstCount = 0
    for (let i = 0; i < 40; i++) {
      const task = multiSelectTask({
        question: `Welche passen ${i}? (mehrere möglich)`,
        choices: [...correct, ...wrong],
        correct,
        solution: correct.join(', '),
        explanation: 'Test',
        instruction: 'Tippe alle zutreffenden:',
      })
      const choices = (task.interactive?.props?.choices as string[]) ?? []
      expect(choices).toHaveLength(5)
      expect(new Set(choices)).toEqual(new Set([...correct, ...wrong]))
      expect(task.check({ kind: 'multiSelect', selected: correct })).toBe(true)
      const firstFour = choices.slice(0, 4)
      if (firstFour.every((c) => correct.includes(c))) correctFirstCount++
    }
    // Unshuffled would be 40/40; after shuffle ~1/5 ≈ 8.
    expect(correctFirstCount).toBeLessThan(25)
  })

  it('keeps a stable order for the same content (exam reproducibility)', () => {
    const input = {
      question: 'Stabil?',
      choices: ['richtig1', 'richtig2', 'falsch'],
      correct: ['richtig1', 'richtig2'],
      solution: 'richtig1, richtig2',
      explanation: 'x',
    }
    const a = multiSelectTask(input)
    const b = multiSelectTask(input)
    expect(a.interactive?.props?.choices).toEqual(b.interactive?.props?.choices)
  })
})
