import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { textTask, valueTask } from './taskHelpers'
import { buildUniqueTaskRound, taskFingerprint } from './uniqueRound'
import type { Task } from './types'

describe('uniqueRound', () => {
  it('fingerprints by question and solution', () => {
    const a = valueTask({
      question: '1+1',
      answerKind: 'integer',
      value: 2,
      solution: '2',
      explanation: 'x',
    })
    const b = valueTask({
      question: '1+1',
      answerKind: 'integer',
      value: 2,
      solution: '2',
      explanation: 'other',
    })
    const c = valueTask({
      question: '1+2',
      answerKind: 'integer',
      value: 3,
      solution: '3',
      explanation: 'x',
    })
    expect(taskFingerprint(a)).toBe(taskFingerprint(b))
    expect(taskFingerprint(a)).not.toBe(taskFingerprint(c))
  })

  it('fingerprints by dedupeKey when set (near-duplicate formats collide)', () => {
    const tipIn = valueTask({
      question: 'Jahr der Gründung?',
      answerKind: 'integer',
      value: 753,
      solution: '753',
      explanation: 'x',
      dedupeKey: 'rom-year:753',
    })
    const mc = valueTask({
      question: 'Gründung Roms — Welches Jahr?',
      answerKind: 'integer',
      value: 753,
      solution: '753 v. Chr.',
      explanation: 'y',
      dedupeKey: 'rom-year:753',
    })
    const other = valueTask({
      question: 'Jahr der Republik?',
      answerKind: 'integer',
      value: 500,
      solution: '500',
      explanation: 'z',
      dedupeKey: 'rom-year:500',
    })
    expect(taskFingerprint(tipIn)).toBe(taskFingerprint(mc))
    expect(taskFingerprint(tipIn)).not.toBe(taskFingerprint(other))
  })

  it('contentIds overlap blocks a second fact even with different question text', () => {
    const a = textTask({
      question: 'Form A',
      accepted: ['x'],
      solution: 'x',
      explanation: 'e',
      contentIds: ['bio:demo:fact'],
    })
    const b = textTask({
      question: 'Form B völlig anders',
      accepted: ['y'],
      solution: 'y',
      explanation: 'e',
      contentIds: ['bio:demo:fact'],
    })
    const c = textTask({
      question: 'Other',
      accepted: ['z'],
      solution: 'z',
      explanation: 'e',
      contentIds: ['bio:demo:other'],
    })
    let i = 0
    const pool = [a, b, c]
    const round = buildUniqueTaskRound(() => pool[i++ % 3]!, createRng(1), 10, 20)
    expect(round.length).toBe(2)
  })

  it('returns up to targetCount unique tasks', () => {
    let n = 0
    const generate = (): Task => {
      n++
      return valueTask({
        question: `Q${n}`,
        answerKind: 'integer',
        value: n,
        solution: String(n),
        explanation: 'e',
      })
    }
    const round = buildUniqueTaskRound(generate, createRng(1), 10)
    expect(round).toHaveLength(10)
    const keys = new Set(round.map(taskFingerprint))
    expect(keys.size).toBe(10)
  })

  it('shortens the round when the generator has few variants', () => {
    const pool = [
      textTask({ question: 'A', accepted: ['a'], solution: 'a', explanation: 'e' }),
      textTask({ question: 'B', accepted: ['b'], solution: 'b', explanation: 'e' }),
      textTask({ question: 'C', accepted: ['c'], solution: 'c', explanation: 'e' }),
    ]
    let i = 0
    const generate = () => pool[i++ % pool.length]
    const round = buildUniqueTaskRound(generate, createRng(1), 10, 20)
    expect(round.length).toBe(3)
    expect(new Set(round.map(taskFingerprint)).size).toBe(3)
  })
})

describe('uniqueRound: generischer Stamm "Sortiere …"', () => {
  const sortTask = (solution: string) =>
    textTask({
      question: 'Sortiere die Größen von klein nach groß (kleinste zuerst):',
      accepted: [solution],
      solution,
      explanation: 'x',
    })

  it('gleicher Stamm, andere Elemente: Aufgaben bleiben unterscheidbar', async () => {
    const { taskContentIds } = await import('./uniqueRound')
    const a = taskContentIds(sortTask('877 ml < 0,9 l < 1,878 l'))
    const b = taskContentIds(sortTask('838 g < 1465 g < 1,8 kg'))
    expect(a.some((id) => b.includes(id))).toBe(false)
    expect(a.some((id) => id.startsWith('stem:'))).toBe(false)
  })

  it('gleicher Stamm und gleiche Elemente: weiterhin Duplikat', async () => {
    const { taskContentIds } = await import('./uniqueRound')
    const a = taskContentIds(sortTask('877 ml < 0,9 l < 1,878 l'))
    const b = taskContentIds(sortTask('877 ml < 0,9 l < 1,878 l'))
    expect(a.some((id) => b.includes(id))).toBe(true)
  })

  it('eine Runde enthält verschiedene Sortieraufgaben, aber keine doppelte', () => {
    const pool = ['1 m < 2 m < 3 m', '5 g < 6 g < 7 g', '9 l < 10 l < 11 l']
    const round = buildUniqueTaskRound((rng) => sortTask(pool[Math.floor(rng() * pool.length)]!), createRng(3), 10)
    expect(round.map((t) => t.solution).sort()).toEqual([...pool].sort())
  })
})
