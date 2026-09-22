import { describe, expect, it } from 'vitest'
import {
  dragDropSlotsTask,
  isCommutativeProductFormula,
} from './taskHelpers'

describe('dragDropSlots commutativeFactors', () => {
  const volumeItems = [
    { label: 'V =', value: 1 },
    { label: 'l', value: 2 },
    { label: '× b', value: 3 },
    { label: '× h', value: 4 },
    { label: '× m', value: 5 },
  ]
  const volumeCorrect = [0, 1, 2, 3] // V = l × b × h

  it('detects V = l × b × h as a commutative product', () => {
    expect(isCommutativeProductFormula(volumeItems, volumeCorrect)).toBe(true)
  })

  it('accepts any order of multiplied volume factors', () => {
    const task = dragDropSlotsTask({
      question: 'Volumen',
      items: volumeItems,
      correctSlots: volumeCorrect,
      solution: 'V = l × b × h',
      explanation: 'Produkt',
      checkMode: 'commutativeFactors',
    })
    expect(task.check({ kind: 'dragDropSlots', slots: [0, 1, 2, 3] })).toBe(true)
    // V = ×b, l, ×h
    expect(task.check({ kind: 'dragDropSlots', slots: [0, 2, 1, 3] })).toBe(true)
    // V = ×h, ×b, l
    expect(task.check({ kind: 'dragDropSlots', slots: [0, 3, 2, 1] })).toBe(true)
  })

  it('rejects distractor chips even in commutative mode', () => {
    const task = dragDropSlotsTask({
      question: 'Volumen',
      items: volumeItems,
      correctSlots: volumeCorrect,
      solution: 'V = l × b × h',
      explanation: 'Produkt',
      checkMode: 'commutativeFactors',
    })
    // uses × m instead of × h
    expect(task.check({ kind: 'dragDropSlots', slots: [0, 1, 2, 4] })).toBe(false)
    // wrong LHS
    expect(task.check({ kind: 'dragDropSlots', slots: [4, 1, 2, 3] })).toBe(false)
  })

  it('auto-detects product formulas when checkMode is omitted', () => {
    const task = dragDropSlotsTask({
      question: 'Volumen',
      items: volumeItems,
      correctSlots: volumeCorrect,
      solution: 'V = l × b × h',
      explanation: 'Produkt',
    })
    expect(task.check({ kind: 'dragDropSlots', slots: [0, 3, 1, 2] })).toBe(true)
  })

  it('keeps F_G = m · g commutative and rejects / g distractor', () => {
    const items = [
      { label: 'F_G', value: 1 },
      { label: '=', value: 2 },
      { label: 'm', value: 3 },
      { label: '· g', value: 4 },
      { label: '/ g', value: 5 },
    ]
    const correct = [0, 1, 2, 3]
    const task = dragDropSlotsTask({
      question: 'Gewichtskraft',
      items,
      correctSlots: correct,
      solution: 'F_G = m · g',
      explanation: 'Produkt',
      checkMode: 'commutativeFactors',
    })
    expect(task.check({ kind: 'dragDropSlots', slots: [0, 1, 3, 2] })).toBe(true)
    expect(task.check({ kind: 'dragDropSlots', slots: [0, 1, 2, 4] })).toBe(false)
  })

  it('does not treat ρ = m / V as commutative (swapped operands fail)', () => {
    const items = [
      { label: 'ρ', value: 1 },
      { label: '=', value: 2 },
      { label: 'm', value: 3 },
      { label: '/', value: 4 },
      { label: 'V', value: 5 },
      { label: '+ t', value: 6 },
    ]
    const correct = [0, 1, 2, 3, 4] // ρ = m / V
    expect(isCommutativeProductFormula(items, correct)).toBe(false)

    const task = dragDropSlotsTask({
      question: 'Dichte',
      items,
      correctSlots: correct,
      solution: 'ρ = m / V',
      explanation: 'Quotient',
    })
    expect(task.check({ kind: 'dragDropSlots', slots: [0, 1, 2, 3, 4] })).toBe(true)
    // ρ = V / m  (inverts meaning)
    expect(task.check({ kind: 'dragDropSlots', slots: [0, 1, 4, 3, 2] })).toBe(false)
    // ρ = m V /  (broken order)
    expect(task.check({ kind: 'dragDropSlots', slots: [0, 1, 2, 4, 3] })).toBe(false)
  })

  it('does not treat unit conversion juxtaposition as a product', () => {
    const items = [
      { label: '1 kg', value: 1 },
      { label: '=', value: 2 },
      { label: '1000', value: 3 },
      { label: 'g', value: 4 },
    ]
    const correct = [0, 1, 2, 3]
    expect(isCommutativeProductFormula(items, correct)).toBe(false)
    const task = dragDropSlotsTask({
      question: 'Masse',
      items,
      correctSlots: correct,
      solution: '1 kg = 1000 g',
      explanation: 'Umrechnung',
    })
    expect(task.check({ kind: 'dragDropSlots', slots: [0, 1, 3, 2] })).toBe(false)
  })

  it('strict mode rejects factor permutations', () => {
    const task = dragDropSlotsTask({
      question: 'Volumen',
      items: volumeItems,
      correctSlots: volumeCorrect,
      solution: 'V = l × b × h',
      explanation: 'Produkt',
      checkMode: 'strict',
    })
    expect(task.check({ kind: 'dragDropSlots', slots: [0, 1, 2, 3] })).toBe(true)
    expect(task.check({ kind: 'dragDropSlots', slots: [0, 2, 1, 3] })).toBe(false)
  })

  it('treats identical labels as interchangeable in strict mode', () => {
    // Equation rearrange: | : (−4)  then  x = (−20) : (−4)
    // Two distinct chips both labeled (−4) and two labeled :
    const items = [
      { label: ':', value: 1 },
      { label: '(−4)', value: 2 },
      { label: 'x', value: 3 },
      { label: '=', value: 4 },
      { label: '(−20)', value: 5 },
      { label: ':', value: 6 },
      { label: '(−4)', value: 7 },
      { label: '+', value: 8 },
    ]
    const correct = [0, 1, 2, 3, 4, 5, 6] // : (−4) x = (−20) : (−4)
    const task = dragDropSlotsTask({
      question: 'Umstellen',
      items,
      correctSlots: correct,
      solution: 'x = (−20) : (−4)',
      explanation: 'Division',
      checkMode: 'strict',
      resultValue: 5,
    })
    expect(task.check({ kind: 'dragDropSlots', slots: correct, result: '5' })).toBe(true)
    // Swap the two (−4) chips and the two : chips — still correct by content
    expect(
      task.check({ kind: 'dragDropSlots', slots: [5, 6, 2, 3, 4, 0, 1], result: '5' }),
    ).toBe(true)
    // Wrong label in a slot still fails
    expect(
      task.check({ kind: 'dragDropSlots', slots: [0, 7, 2, 3, 4, 5, 6], result: '5' }),
    ).toBe(false)
  })

  it('anyOrder accepts swapped charge/pole symbols', () => {
    const items = [
      { label: '+', value: 1 },
      { label: '↔', value: 2 },
      { label: '−', value: 3 },
      { label: '+ ↔ +', value: 4 },
    ]
    const task = dragDropSlotsTask({
      question: 'Anziehung',
      items,
      correctSlots: [0, 1, 2],
      solution: '+ ↔ −',
      explanation: 'ungleichnamig',
      checkMode: 'anyOrder',
    })
    expect(task.check({ kind: 'dragDropSlots', slots: [0, 1, 2] })).toBe(true)
    expect(task.check({ kind: 'dragDropSlots', slots: [2, 1, 0] })).toBe(true)
    expect(task.check({ kind: 'dragDropSlots', slots: [0, 1, 3] })).toBe(false)
  })

  it('endsSwap keeps middle arrow fixed and swaps outer poles', () => {
    const items = [
      { label: 'N', value: 1 },
      { label: '→ ←', value: 2 },
      { label: 'S', value: 3 },
      { label: '← →', value: 4 },
    ]
    const task = dragDropSlotsTask({
      question: 'Anziehung',
      items,
      correctSlots: [0, 1, 2],
      solution: 'N → ← S',
      explanation: 'anziehen',
      checkMode: 'endsSwap',
    })
    expect(task.check({ kind: 'dragDropSlots', slots: [0, 1, 2] })).toBe(true)
    expect(task.check({ kind: 'dragDropSlots', slots: [2, 1, 0] })).toBe(true)
    // wrong middle (Abstoßen)
    expect(task.check({ kind: 'dragDropSlots', slots: [0, 3, 2] })).toBe(false)
  })
})
