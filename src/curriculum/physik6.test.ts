import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { emptyInput } from './types'
import { PHYSIK_K6_GENERATORS } from './physik6'
import { isPlayablePhysikTopic } from './physikGenerators'
import { buildGymSachsenPhysikPack } from './physikGymPack'
import { hydratePackGrades } from './hydrate'

describe('Physik Klasse 6 generators', () => {
  it('registers a generator for every K6 topic in the pack', () => {
    const k6 = buildGymSachsenPhysikPack().official.find((g) => g.id === 'physik-klasse-6')
    expect(k6).toBeTruthy()
    const ids = k6!.areas.flatMap((a) => a.topics.map((t) => t.id))
    expect(ids.length).toBeGreaterThan(8)
    for (const id of ids) {
      expect(isPlayablePhysikTopic(id), id).toBe(true)
      expect(PHYSIK_K6_GENERATORS[id]).toBeTypeOf('function')
    }
  })

  it('produces tasks whose sample answers pass check (60 seeds)', () => {
    for (const [id, generate] of Object.entries(PHYSIK_K6_GENERATORS)) {
      for (let seed = 1; seed <= 60; seed++) {
        const task = generate(createRng(seed))
        expect(task.check(task.sampleAnswer), `${id} seed ${seed}`).toBe(true)
        const blank = emptyInput(task.interactive?.type ?? task.answerKind)
        if (JSON.stringify(blank) !== JSON.stringify(task.sampleAnswer)) {
          expect(task.check(blank), `${id} seed ${seed} blank`).toBe(false)
        }
      }
    }
  })

  it('hydrates Klasse 6 without outlineOnly topics', async () => {
    const grades = await hydratePackGrades(buildGymSachsenPhysikPack())
    const k6 = grades.find((g) => g.id === 'physik-klasse-6')
    expect(k6).toBeTruthy()
    const topics = k6!.areas.flatMap((a) => a.topics)
    expect(topics.every((t) => !t.outlineOnly)).toBe(true)
    expect(topics.some((t) => t.id === 'ph-k6-lb1-schatten')).toBe(true)
  })
})
