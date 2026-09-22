import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import {
  dragDropSlotsTask,
  dragDropSortTask,
  presentSlotItemsShuffled,
  presentSortItemsShuffled,
} from './taskHelpers'

describe('dragDropSort presentation shuffle', () => {
  it('never leaves items in the already-correct order (n>=2)', () => {
    const items = [
      { label: 'chemische Energie (Batterie)', value: 0 },
      { label: 'elektrische Energie', value: 1 },
      { label: 'Strahlungs- + thermische Energie', value: 2 },
    ]
    const correctOrder = [0, 1, 2]
    for (let seed = 1; seed <= 80; seed++) {
      const presented = presentSortItemsShuffled(items, correctOrder, createRng(seed))
      const displayIsSolved = presented.correctOrder.every((idx, pos) => idx === pos)
      expect(displayIsSolved, `seed ${seed}`).toBe(false)
      const task = dragDropSortTask({
        question: 'Taschenlampe: Ordne die Kette (Start → Ende).',
        items,
        correctOrder,
        solution: 'chemisch → elektrisch → Licht/Wärme',
        explanation: 'test',
        rng: createRng(seed),
      })
      expect(task.check(task.sampleAnswer), `seed ${seed}`).toBe(true)
    }
  })

  it('shuffles even when callers omit rng (hash seed)', () => {
    const task = dragDropSortTask({
      question: 'Ordne A→B→C',
      items: [
        { label: 'A', value: 0 },
        { label: 'B', value: 1 },
        { label: 'C', value: 2 },
      ],
      correctOrder: [0, 1, 2],
      solution: 'A→B→C',
      explanation: 'test',
    })
    const propsItems = (task.interactive?.props as { items: Array<{ label: string }> }).items
    expect(propsItems.map((i) => i.label).join('')).not.toBe('ABC')
    expect(task.check(task.sampleAnswer)).toBe(true)
  })
})

describe('dragDropSlots pool shuffle', () => {
  it('does not leave the formula as an ordered pool prefix', () => {
    const items = [
      { label: 'η', value: 0 },
      { label: '=', value: 1 },
      { label: 'E_nutz', value: 2 },
      { label: '/', value: 3 },
      { label: 'E_zu', value: 4 },
      { label: '· t', value: 5 },
    ]
    const correctSlots = [0, 1, 2, 3, 4]
    for (let seed = 1; seed <= 80; seed++) {
      const presented = presentSlotItemsShuffled(items, correctSlots, createRng(seed))
      const prefixIsFormula = presented.correctSlots.every((idx, pos) => idx === pos)
      expect(prefixIsFormula, `seed ${seed}`).toBe(false)
      const task = dragDropSlotsTask({
        question: 'Baue die Wirkungsgrad-Formel. Einen Block brauchst du nicht.',
        items,
        correctSlots,
        solution: 'η = E_nutz / E_zu',
        explanation: 'test',
        rng: createRng(seed),
      })
      expect(task.check(task.sampleAnswer), `seed ${seed}`).toBe(true)
      const propsItems = (task.interactive?.props as { items: typeof items }).items
      expect(propsItems.slice(0, 5).map((i) => i.label).join('')).not.toBe('η=E_nutz/E_zu')
    }
  })
})
