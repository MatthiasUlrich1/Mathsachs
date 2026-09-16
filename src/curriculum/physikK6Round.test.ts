import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
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
})
