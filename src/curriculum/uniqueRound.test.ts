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

  it('does not collapse number-parameterized drills via stemfamily', () => {
    let n = 0
    const generate = (): Task => {
      n++
      const a = 10 + n
      const b = 50 + n
      return valueTask({
        question: `Vergleiche: Welche Aussage zu ${a} und ${b} ist richtig?`,
        answerKind: 'integer',
        value: a,
        solution: `${a} < ${b}`,
        explanation: 'e',
        dedupeKey: `test:vgl:${a}:${b}`,
        contentIds: [`test:vgl:${a}:${b}`],
      })
    }
    const round = buildUniqueTaskRound(generate, createRng(1), 10, 40)
    expect(round).toHaveLength(10)
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

  it('caps Zuordnung (pairMatch) to at most one per round', () => {
    let n = 0
    const generate = (): Task => {
      n++
      if (n % 2 === 1) {
        return {
          question: `Ordne Begriffe ${n}`,
          answerKind: 'text',
          solution: `s${n}`,
          explanation: 'e',
          dedupeKey: `pair-demo:${n}`,
          contentIds: [`pair-demo:${n}`],
          sampleAnswer: { kind: 'pairMatch', links: {} },
          interactive: {
            type: 'pairMatch',
            props: { left: [{ id: 'L0', label: `T${n}` }], right: [] },
          },
          check: () => true,
        }
      }
      return valueTask({
        question: `Q${n}`,
        answerKind: 'integer',
        value: n,
        solution: String(n),
        explanation: 'e',
        dedupeKey: `val:${n}`,
        contentIds: [`val:${n}`],
      })
    }
    const round = buildUniqueTaskRound(generate, createRng(1), 10, 80)
    const matches = round.filter((t) => t.interactive?.type === 'pairMatch')
    expect(matches.length).toBeLessThanOrEqual(1)
    expect(round.length).toBeGreaterThanOrEqual(5)
  })

  it('biases toward several interaction types when the pool allows', () => {
    let n = 0
    const types = ['choicePick', 'flashcardFlip', 'findError', 'comparePick', 'dragDropSort'] as const
    const generate = (): Task => {
      n++
      const ui = types[n % types.length]!
      return {
        question: `Mix ${n} ${ui}`,
        answerKind: 'text',
        solution: `s${n}`,
        explanation: 'e',
        dedupeKey: `mix-demo:${n}`,
        contentIds: [`mix-demo:${n}`],
        sampleAnswer: { kind: 'choicePick', choice: 'x' },
        interactive: { type: ui, props: {} },
        check: () => true,
      }
    }
    const round = buildUniqueTaskRound(generate, createRng(7), 10, 100)
    expect(round.length).toBe(10)
    const distinct = new Set(round.map((t) => t.interactive?.type)).size
    expect(distinct).toBeGreaterThanOrEqual(4)
  })

  it('does not soft-cap graphic Aufbau UIs (imageLabelSlots)', () => {
    let n = 0
    const generate = (): Task => {
      n++
      if (n % 3 !== 0) {
        return {
          question: `Slots ${n}`,
          answerKind: 'text',
          solution: `s${n}`,
          explanation: 'e',
          dedupeKey: `slot-demo:${n}`,
          contentIds: [`slot-demo:${n}`],
          sampleAnswer: { kind: 'imageLabelSlots', slots: [] },
          interactive: {
            type: 'imageLabelSlots',
            props: { items: [{ label: `L${n}` }], imageSrc: `/img/${n}.png` },
          },
          check: () => true,
        }
      }
      return valueTask({
        question: `Other ${n}`,
        answerKind: 'integer',
        value: n,
        solution: String(n),
        explanation: 'e',
        dedupeKey: `other:${n}`,
        contentIds: [`other:${n}`],
      })
    }
    const round = buildUniqueTaskRound(generate, createRng(3), 10, 80)
    const slots = round.filter((t) => t.interactive?.type === 'imageLabelSlots')
    expect(slots.length).toBeGreaterThanOrEqual(3)
    expect(round.length).toBe(10)
  })
})
