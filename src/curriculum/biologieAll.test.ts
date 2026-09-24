import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { BIOLOGIE_GENERATORS, isPlayableBiologieTopic } from './biologieGenerators'
import { allBiologieTopicIds } from './biologieGymTopics'

describe('Biologie generators (K5–12)', () => {
  it('covers every outline topic id with a playable generator', () => {
    const ids = allBiologieTopicIds()
    expect(ids.length).toBeGreaterThan(40)
    for (const id of ids) {
      expect(isPlayableBiologieTopic(id), id).toBe(true)
      expect(BIOLOGIE_GENERATORS[id], id).toBeTypeOf('function')
    }
  })

  it('produces checkable tasks for many seeds across all topics', () => {
    for (const id of allBiologieTopicIds()) {
      const gen = BIOLOGIE_GENERATORS[id]!
      for (let seed = 0; seed < 8; seed++) {
        const task = gen(createRng(seed * 997 + 19))
        expect(task.question.trim().length, `${id}@${seed}`).toBeGreaterThan(8)
        expect(task.solution.trim().length, `${id}@${seed}`).toBeGreaterThan(0)
        expect(task.sampleAnswer, `${id}@${seed}`).toBeTruthy()
        expect(task.check(task.sampleAnswer!), `${id}@${seed}`).toBe(true)
      }
    }
  })

  it('uses a mix of interactive styles including NEW widgets', () => {
    const kinds = new Set<string>()
    for (const id of allBiologieTopicIds()) {
      for (let seed = 0; seed < 20; seed++) {
        const task = BIOLOGIE_GENERATORS[id]!(createRng(seed * 31 + 7))
        if (task.interactive?.type) kinds.add(task.interactive.type)
        else kinds.add('text')
      }
    }
    expect(kinds.has('choicePick')).toBe(true)
    expect(kinds.has('pairMatch')).toBe(true)
    expect(kinds.has('clozeMulti')).toBe(true)
    expect(kinds.has('iconBelong')).toBe(true)
    expect(kinds.has('flashcardFlip')).toBe(true)
  })
})
