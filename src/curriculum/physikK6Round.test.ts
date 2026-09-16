import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { PHYSIK_K6_GENERATORS } from './physik6'
import { buildUniqueTaskRound } from './uniqueRound'

describe('Physik K6 unique practice rounds', () => {
  it('can fill ~10 unique tasks per topic (Pack 1.1–1.3 content included)', () => {
    for (const [id, gen] of Object.entries(PHYSIK_K6_GENERATORS)) {
      const lengths = [1, 7, 42, 99].map(
        (seed) => buildUniqueTaskRound(gen, createRng(seed), 10).length,
      )
      const best = Math.max(...lengths)
      expect(best, `${id} unique round too short: ${lengths.join(',')}`).toBeGreaterThanOrEqual(8)
    }
  })
})
