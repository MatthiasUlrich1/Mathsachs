import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { resolvePhysikGenerate } from './physikGenerators'
import { PHYSIK_K6_GENERATORS } from './physik6'
import { buildUniqueTaskRound } from './uniqueRound'

describe('Physik K6 unique practice rounds', () => {
  it('can fill at least 5 unique tasks per topic (Physik-Rundenlänge)', () => {
    for (const [id, gen] of Object.entries(PHYSIK_K6_GENERATORS)) {
      const lengths = [1, 7, 42, 99].map(
        (seed) => buildUniqueTaskRound(gen, createRng(seed), 5).length,
      )
      const best = Math.max(...lengths)
      expect(best, `${id} unique round too short: ${lengths.join(',')}`).toBeGreaterThanOrEqual(5)
    }
  })

  it('can fill 10 unique tasks for freigegebene LB1 topics', () => {
    const need10 = [
      'ph-k6-lb1-lichtquellen',
      'ph-k6-lb1-ausbreitung',
      'ph-k6-lb1-schatten',
      'ph-k6-lb1-kernschatten',
      'ph-k6-lb1-lampenposition',
      'ph-k6-lb1-lichtstrahl',
      'ph-k6-lb1-brechung',
    ]
    for (const id of need10) {
      const gen = resolvePhysikGenerate(id)
      expect(gen, id).toBeTypeOf('function')
      const lengths = [1, 7, 42, 99].map(
        (seed) => buildUniqueTaskRound(gen!, createRng(seed), 10).length,
      )
      const best = Math.max(...lengths)
      expect(best, `${id} unique round too short: ${lengths.join(',')}`).toBeGreaterThanOrEqual(10)
    }
  })
})
