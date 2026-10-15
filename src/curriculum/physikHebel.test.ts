import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { buildUniqueTaskRound } from './uniqueRound'
import { resolvePhysikGenerate } from './physikGenerators'

const HEBEL_IDS = ['ph-k7-lb1-hebel', 'ph-k7-lbw-hebel'] as const

function fwText(task: { fachwissen?: unknown }): string {
  const fw = task.fachwissen
  if (!fw) return ''
  if (typeof fw === 'string') return fw
  if (typeof fw === 'object' && fw && 'text' in fw) return String((fw as { text: string }).text)
  return ''
}

describe('Physik K7 Hebel — curriculum quality rules', () => {
  for (const id of HEBEL_IDS) {
    it(`${id}: 10er uniqueRound (contentIds) across seeds`, () => {
      const gen = resolvePhysikGenerate(id)!
      expect(gen).toBeTypeOf('function')
      for (let seed = 1; seed <= 25; seed++) {
        const round = buildUniqueTaskRound(gen, createRng(seed), 10)
        expect(round.length, `${id} seed ${seed}`).toBe(10)
        const ids = round.flatMap((t) => t.contentIds ?? (t.dedupeKey ? [t.dedupeKey] : []))
        expect(ids.length, `${id} seed ${seed} missing ids`).toBeGreaterThanOrEqual(10)
        expect(new Set(ids).size, `${id} seed ${seed} contentId collision`).toBe(ids.length)
      }
    })

    it(`${id}: themengebunden, Fachwissen, kein Lehrplan-Meta`, () => {
      const gen = resolvePhysikGenerate(id)!
      for (let seed = 1; seed <= 40; seed++) {
        const task = gen(createRng(seed))
        const q = task.question ?? ''
        const text = fwText(task)
        expect(text.length, `fw seed ${seed}`).toBeGreaterThanOrEqual(20)
        expect(q.toLowerCase()).not.toMatch(/magnetkraft|elektrostatik|auftrieb|ohm|fotosynthese/)
        expect(`${q} ${text}`.toLowerCase()).not.toMatch(/im lehrplan|für sachsen relevant/)
        expect(q.length + (task.solution?.length ?? 0)).toBeGreaterThan(0)
      }
    })
  }
})
