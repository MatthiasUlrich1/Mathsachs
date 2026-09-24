import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import {
  clozeMultiTask,
  flashcardFlipTask,
  iconBelongTask,
  pairMatchTask,
} from './taskHelpers'
import { initTaskInput } from '../components/TaskMedia'

describe('new biologie interaction task helpers', () => {
  it('pairMatch checks all links', () => {
    const task = pairMatchTask({
      question: 'Paare',
      left: [
        { id: 'L0', label: 'A' },
        { id: 'L1', label: 'B' },
      ],
      right: [
        { id: 'R1', label: 'zwei' },
        { id: 'R0', label: 'eins' },
      ],
      correctLinks: { L0: 'R0', L1: 'R1' },
      solution: 'A→eins; B→zwei',
      explanation: 'ok',
    })
    expect(task.interactive?.type).toBe('pairMatch')
    expect(task.check(task.sampleAnswer!)).toBe(true)
    expect(task.check({ kind: 'pairMatch', links: { L0: 'R1', L1: 'R0' } })).toBe(false)
    const blank = initTaskInput(task)
    expect(blank.kind).toBe('pairMatch')
  })

  it('clozeMulti accepts synonyms per blank', () => {
    const task = clozeMultiTask({
      question: 'Lücken',
      segments: ['Fische atmen über ', ' und Vögel über ', '.'],
      accepted: [
        ['Kiemen', 'Kieme'],
        ['Lungen', 'Lunge'],
      ],
      solution: 'Kiemen / Lungen',
      explanation: 'ok',
    })
    expect(task.interactive?.type).toBe('clozeMulti')
    expect(task.check({ kind: 'clozeMulti', blanks: ['Kieme', 'Lunge'] })).toBe(true)
    expect(task.check({ kind: 'clozeMulti', blanks: ['Federn', 'Lungen'] })).toBe(false)
  })

  it('iconBelong and flashcardFlip work end-to-end', () => {
    const icon = iconBelongTask({
      question: 'Welches?',
      options: [
        { id: 'f', label: 'Fisch', icon: '🐟' },
        { id: 'v', label: 'Vogel', icon: '🦅' },
      ],
      correctId: 'f',
      solution: 'Fisch',
      explanation: 'ok',
    })
    expect(icon.interactive?.type).toBe('iconBelong')
    expect(icon.check({ kind: 'iconBelong', choice: 'f' })).toBe(true)

    const flash = flashcardFlipTask({
      question: 'Karte',
      front: 'Atmung Fisch?',
      accepted: ['Kiemen', 'Kieme'],
      solution: 'Kiemen',
      explanation: 'ok',
    })
    expect(flash.interactive?.type).toBe('flashcardFlip')
    expect(flash.check({ kind: 'flashcardFlip', flipped: true, answer: 'Kiemen' })).toBe(
      true,
    )
    expect(flash.check({ kind: 'flashcardFlip', flipped: false, answer: 'Kiemen' })).toBe(
      false,
    )
    void createRng(1)
  })
})
