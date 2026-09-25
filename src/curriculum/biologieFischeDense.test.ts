/**
 * Dense fish Lebensraum (Raub/Fried) + Fortpflanzung pools.
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { BIOLOGIE_GENERATORS } from './biologieGenerators'
import {
  fischeFortpflanzungMatch,
  fischeRaubFriedClassify,
  fischeRaubFriedDiffMatch,
} from './biologieFischeDense'

describe('Fische Raub-/Friedfisch + Fortpflanzung', () => {
  it('classifies Raub- and Friedfische with group-tolerant slots', () => {
    const task = fischeRaubFriedClassify(createRng(11))
    expect(task.interactive?.type).toBe('dragDropSlots')
    expect(task.check(task.sampleAnswer)).toBe(true)
    if (task.sampleAnswer.kind !== 'dragDropSlots') return
    const slots = [...task.sampleAnswer.slots]
    // Swap the two Raubfisch placements — still correct
    const swapped = [slots[1]!, slots[0]!, slots[2]!, slots[3]!]
    expect(task.check({ kind: 'dragDropSlots', slots: swapped })).toBe(true)
    // Put a Friedfisch into a Raub slot — fail
    const bad = [slots[2]!, slots[1]!, slots[0]!, slots[3]!]
    expect(task.check({ kind: 'dragDropSlots', slots: bad })).toBe(false)
  })

  it('emits difference matching for Raub/Fried', () => {
    const task = fischeRaubFriedDiffMatch(createRng(3))
    expect(task.interactive?.type).toBe('pairMatch')
    expect(task.check(task.sampleAnswer)).toBe(true)
    expect((task.fachwissen?.text ?? '').length).toBeGreaterThan(40)
  })

  it('emits fortpflanzung pairMatch with rich pool', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 30; i++) {
      const task = fischeFortpflanzungMatch(createRng(i * 17 + 2))
      expect(task.check(task.sampleAnswer)).toBe(true)
      for (const id of task.contentIds ?? []) seen.add(id)
    }
    expect(seen.size).toBeGreaterThanOrEqual(6)
  })

  it('Lebensraum and Schutz topics surface new content', () => {
    const lr = BIOLOGIE_GENERATORS['bi-k5-lb2-fische-lebensraum']!
    const sz = BIOLOGIE_GENERATORS['bi-k5-lb2-fische-schutz']!
    let sawRaub = false
    let sawFort = false
    for (let i = 0; i < 60; i++) {
      const a = lr(createRng(i * 13 + 1))
      const b = sz(createRng(i * 19 + 5))
      const ta = `${a.question}\n${a.solution}\n${a.explanation}`
      const tb = `${b.question}\n${b.solution}\n${b.explanation}`
      if (/Raubfisch|Friedfisch|Hecht|Karpfen/i.test(ta)) sawRaub = true
      if (/Laich|Befruchtung|Rogen|Milch|Stichling/i.test(tb)) sawFort = true
      expect(a.check(a.sampleAnswer)).toBe(true)
      expect(b.check(b.sampleAnswer)).toBe(true)
    }
    expect(sawRaub).toBe(true)
    expect(sawFort).toBe(true)
  })
})
