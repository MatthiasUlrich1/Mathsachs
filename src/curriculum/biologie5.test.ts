import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { BIOLOGIE_K5_EXPANDED } from './biologieNewUx'
import { BIOLOGIE_K5_WIRBELTIERE_TOPIC_IDS } from './biologieGymTopics'

describe('Biologie K5 Wirbeltiere generators', () => {
  it('produces valid tasks for many seeds per topic', () => {
    for (const id of BIOLOGIE_K5_WIRBELTIERE_TOPIC_IDS) {
      const gen = BIOLOGIE_K5_EXPANDED[id]
      expect(gen, id).toBeTypeOf('function')
      for (let seed = 0; seed < 24; seed++) {
        const task = gen!(createRng(seed * 997 + 13))
        expect(task.question.trim().length, `${id} seed ${seed}`).toBeGreaterThan(8)
        expect(task.solution.trim().length, `${id} seed ${seed}`).toBeGreaterThan(0)
        expect(task.explanation.trim().length, `${id} seed ${seed}`).toBeGreaterThan(10)
        const fw = task.fachwissen?.text ?? ''
        expect(fw.trim().length, `${id} seed ${seed}`).toBeGreaterThan(20)
        expect(task.sampleAnswer, `${id} seed ${seed}`).toBeTruthy()
        expect(task.check(task.sampleAnswer!), `${id} seed ${seed}`).toBe(true)
      }
    }
  })

  it('covers classic and NEW interactive styles across Wirbeltiere', () => {
    const kinds = new Set<string>()
    for (const id of BIOLOGIE_K5_WIRBELTIERE_TOPIC_IDS) {
      for (let seed = 0; seed < 40; seed++) {
        const task = BIOLOGIE_K5_EXPANDED[id]!(createRng(seed * 17 + 3))
        if (task.interactive?.type) kinds.add(task.interactive.type)
        else kinds.add('text')
      }
    }
    expect(kinds.has('choicePick')).toBe(true)
    expect(kinds.has('pairMatch')).toBe(true)
    expect(kinds.has('clozeMulti')).toBe(true)
    expect(kinds.has('iconBelong')).toBe(true)
    expect(kinds.has('flashcardFlip')).toBe(true)
    expect(kinds.has('imageLabelSlots')).toBe(true)
  })
})
