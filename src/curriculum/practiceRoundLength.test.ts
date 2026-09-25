/**
 * Practice rounds must reach 10 tasks whenever the unique pool is large enough.
 * Regression: „Angepasstheit der Vögel“ / Aufbau showed „1 von 9“ because
 * diagram contentIds + term: dedupe collapsed the pool.
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { BIOLOGIE_ANATOMY_GENERATORS } from './biologieAnatomy'
import { resolveBiologieGenerate } from './biologieGenerators'
import { DEFAULT_TASKS_PER_ROUND, resolveTasksPerRound } from './tasksPerRound'
import { buildUniqueTaskRound, taskContentIds } from './uniqueRound'

const ROUND_SEEDS = [1, 7, 42, 99, 12345, 999991, 111, 222, 333, 444, 0x5eed, 0xcafe]

function genFor(id: string) {
  return resolveBiologieGenerate(id) ?? BIOLOGIE_ANATOMY_GENERATORS[id]
}

describe('Practice rounds length 10 (Bio K5 / Angepasstheit der Vögel)', () => {
  it('defaults resolveTasksPerRound to 10', () => {
    expect(DEFAULT_TASKS_PER_ROUND).toBe(10)
    expect(resolveTasksPerRound({})).toBe(10)
    expect(resolveTasksPerRound({ tasksPerRound: 10 })).toBe(10)
  })

  it('Angepasstheit der Vögel (bi-k5-lb5-voegel-aufbau) reaches 10 on every seed', () => {
    const id = 'bi-k5-lb5-voegel-aufbau'
    const gen = genFor(id)
    expect(gen, id).toBeTypeOf('function')
    for (const seed of ROUND_SEEDS) {
      const round = buildUniqueTaskRound(gen!, createRng(seed), 10, 400)
      expect(round.length, `${id} seed=${seed} got ${round.length}`).toBe(10)
      const seen = new Set<string>()
      for (const t of round) {
        for (const cid of taskContentIds(t)) {
          expect(seen.has(cid), `${id} seed=${seed} dup ${cid}`).toBe(false)
          seen.add(cid)
        }
      }
    }
  })

  it('Vogel-Überblick and Fisch-Aufbau also reach 10', () => {
    for (const id of ['bi-k5-lb5-voegel', 'bi-k5-lb2-fische-aufbau'] as const) {
      const gen = genFor(id)
      expect(gen, id).toBeTypeOf('function')
      for (const seed of ROUND_SEEDS) {
        const round = buildUniqueTaskRound(gen!, createRng(seed), 10, 400)
        expect(round.length, `${id} seed=${seed} got ${round.length}`).toBe(10)
      }
    }
  })
})
