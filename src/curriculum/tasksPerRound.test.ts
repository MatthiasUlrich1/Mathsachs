import { describe, expect, it } from 'vitest'
import {
  DEFAULT_TASKS_PER_ROUND,
  MAX_TASKS_PER_ROUND,
  resolveTasksPerRound,
} from './tasksPerRound'
import { buildUniqueTaskRound } from './uniqueRound'
import { createRng } from '../lib/rng'
import { valueTask } from './taskHelpers'
import type { Task } from './types'
import { buildOberschuleHsPack } from './oberschulePacks'
import { buildGymSachsenAnhaltPack } from './gymSachsenAnhaltPack'
import { buildSekundarschuleSachsenAnhaltHsPack } from './sekundarschuleSachsenAnhaltPack'
import { buildGymSachsenPhysikPack } from './physikGymPack'
import { buildGymSachsenBiologiePack } from './biologieGymPack'
import { buildGymSachsenGeschichtePack } from './geschichteGymPack'
import { buildGymSachsenSeed } from './seed'

describe('tasksPerRound global default', () => {
  it('exports DEFAULT_TASKS_PER_ROUND = 10', () => {
    expect(DEFAULT_TASKS_PER_ROUND).toBe(10)
  })

  it('resolveTasksPerRound falls back to 10 for missing / invalid', () => {
    expect(resolveTasksPerRound(undefined)).toBe(10)
    expect(resolveTasksPerRound({})).toBe(10)
    expect(resolveTasksPerRound({ tasksPerRound: 0 })).toBe(10)
    expect(resolveTasksPerRound({ tasksPerRound: NaN })).toBe(10)
  })

  it('resolveTasksPerRound respects justified overrides and caps at MAX', () => {
    expect(resolveTasksPerRound({ tasksPerRound: 7 })).toBe(7)
    expect(resolveTasksPerRound({ tasksPerRound: 11 })).toBe(11)
    expect(resolveTasksPerRound({ tasksPerRound: 99 })).toBe(MAX_TASKS_PER_ROUND)
  })

  it('uniqueRound default target is 10 and shortens when pool < 10', () => {
    let n = 0
    const rich = (): Task => {
      n++
      return valueTask({
        question: `Q${n}`,
        answerKind: 'integer',
        value: n,
        solution: String(n),
        explanation: 'e',
      })
    }
    expect(buildUniqueTaskRound(rich, createRng(1))).toHaveLength(10)

    const tiny = [
      valueTask({ question: 'A', answerKind: 'integer', value: 1, solution: '1', explanation: 'e' }),
      valueTask({ question: 'B', answerKind: 'integer', value: 2, solution: '2', explanation: 'e' }),
    ]
    let i = 0
    const round = buildUniqueTaskRound(() => tiny[i++ % tiny.length]!, createRng(2), 10, 20)
    expect(round.length).toBe(2)
  })

  it('Mathe pack helpers default every topic to tasksPerRound 10', async () => {
    const packs = [
      buildOberschuleHsPack(),
      buildGymSachsenAnhaltPack(),
      buildSekundarschuleSachsenAnhaltHsPack(),
      await buildGymSachsenSeed(),
    ]
    for (const pack of packs) {
      for (const grade of pack.official) {
        for (const area of grade.areas) {
          for (const t of area.topics) {
            expect(t.tasksPerRound, `${pack.id}/${t.id}`).toBe(10)
          }
        }
      }
    }
  })

  it('Physik / Bio / Geschichte pack helpers default to 10 (pool exception allowed)', () => {
    const packs = [
      buildGymSachsenPhysikPack(),
      buildGymSachsenBiologiePack(),
      buildGymSachsenGeschichtePack(),
    ]
    for (const pack of packs) {
      for (const grade of pack.official) {
        for (const area of grade.areas) {
          for (const t of area.topics) {
            const n = t.tasksPerRound
            expect(typeof n, `${pack.id}/${t.id}`).toBe('number')
            expect(n!, `${pack.id}/${t.id}`).toBeGreaterThanOrEqual(1)
            expect(n!, `${pack.id}/${t.id}`).toBeLessThanOrEqual(DEFAULT_TASKS_PER_ROUND)
            // Global rule: never an arbitrary default below 10 unless pool-capped.
            // Authors may set < 10 only for known small pools; most topics are 10.
            if (t.id !== 'ge-k6-lb1-jahreszahlen') {
              expect(n, `${pack.id}/${t.id}`).toBe(10)
            } else {
              expect(n).toBeLessThanOrEqual(10)
            }
          }
        }
      }
    }
  })
})
