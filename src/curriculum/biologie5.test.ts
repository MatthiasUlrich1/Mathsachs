import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { BIOLOGIE_K5_GENERATORS } from './biologie5'
import { BIOLOGIE_K5_WIRBELTIERE_TOPIC_IDS } from './biologieGymTopics'

describe('Biologie K5 Wirbeltiere generators', () => {
  it('produces valid tasks for many seeds per topic', () => {
    for (const id of BIOLOGIE_K5_WIRBELTIERE_TOPIC_IDS) {
      const gen = BIOLOGIE_K5_GENERATORS[id]
      expect(gen, id).toBeTypeOf('function')
      for (let seed = 0; seed < 24; seed++) {
        const task = gen!(createRng(seed * 997 + 13))
        expect(task.question.trim().length, `${id} seed ${seed}`).toBeGreaterThan(8)
        expect(task.solution.trim().length, `${id} seed ${seed}`).toBeGreaterThan(0)
        expect(task.explanation.trim().length, `${id} seed ${seed}`).toBeGreaterThan(10)
        const fw = task.fachwissen?.text ?? ''
        expect(fw.trim().length, `${id} seed ${seed}`).toBeGreaterThan(20)
        // sampleAnswer must exist for interactive / tip-in checks
        expect(task.sampleAnswer, `${id} seed ${seed}`).toBeTruthy()
        expect(task.check(task.sampleAnswer!), `${id} seed ${seed}`).toBe(true)
      }
    }
  })

  it('covers interactive styles across the Wirbeltiere set', () => {
    const kinds = new Set<string>()
    for (const id of BIOLOGIE_K5_WIRBELTIERE_TOPIC_IDS) {
      for (let seed = 0; seed < 40; seed++) {
        const task = BIOLOGIE_K5_GENERATORS[id]!(createRng(seed * 17 + 3))
        if (task.interactive?.type) kinds.add(task.interactive.type)
        else kinds.add('text')
      }
    }
    expect(kinds.has('choicePick')).toBe(true)
    expect(kinds.has('multiSelect')).toBe(true)
    expect(kinds.has('dragDropSlots')).toBe(true)
    expect(kinds.has('dragDropSort')).toBe(true)
  })
})
