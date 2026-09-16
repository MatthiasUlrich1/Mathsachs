import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { emptyInput } from './types'
import { buildGymSachsenPhysikPack } from './physikGymPack'
import { hydratePackGrades } from './hydrate'
import {
  isPlayablePhysikTopic,
  listPhysikGeneratorIds,
  resolvePhysikGenerate,
} from './physikGenerators'

describe('Physik Gym generators (all grades)', () => {
  it('registers a generator for every topic in the pack', () => {
    const pack = buildGymSachsenPhysikPack()
    const ids = pack.official.flatMap((g) =>
      g.areas.flatMap((a) => a.topics.map((t) => t.id)),
    )
    expect(ids.length).toBeGreaterThan(150)
    for (const id of ids) {
      expect(isPlayablePhysikTopic(id), id).toBe(true)
      expect(resolvePhysikGenerate(id), id).toBeTypeOf('function')
    }
    expect(listPhysikGeneratorIds().length).toBe(ids.length)
  })

  it('gives each Lernbereich about 5–9 practice topics (like Math)', () => {
    const pack = buildGymSachsenPhysikPack()
    for (const grade of pack.official) {
      for (const area of grade.areas) {
        const n = area.topics.length
        expect(n, `${grade.id}/${area.id}`).toBeGreaterThanOrEqual(5)
        expect(n, `${grade.id}/${area.id}`).toBeLessThanOrEqual(9)
      }
    }
  })

  it('produces tasks whose sample answers pass check (40 seeds per topic)', () => {
    const ids = listPhysikGeneratorIds()
    for (const id of ids) {
      const generate = resolvePhysikGenerate(id)!
      for (let seed = 1; seed <= 40; seed++) {
        const task = generate(createRng(seed))
        expect(task.check(task.sampleAnswer), `${id} seed ${seed}`).toBe(true)
        const blank = emptyInput(task.interactive?.type ?? task.answerKind)
        if (JSON.stringify(blank) !== JSON.stringify(task.sampleAnswer)) {
          expect(task.check(blank), `${id} seed ${seed} blank`).toBe(false)
        }
      }
    }
  })

  it('hydrates the full pack without outlineOnly topics', async () => {
    const grades = await hydratePackGrades(buildGymSachsenPhysikPack())
    expect(grades.length).toBe(9)
    for (const grade of grades) {
      const topics = grade.areas.flatMap((a) => a.topics)
      expect(topics.length, grade.id).toBeGreaterThan(0)
      expect(
        topics.every((t) => !t.outlineOnly),
        `${grade.id} still has outlineOnly`,
      ).toBe(true)
    }
  })
})
