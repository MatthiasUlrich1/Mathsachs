import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { emptyInput } from './types'
import { PHYSIK_K6_GENERATORS } from './physik6'
import { isPlayablePhysikTopic, resolvePhysikGenerate } from './physikGenerators'
import { buildGymSachsenPhysikPack } from './physikGymPack'
import { hydratePackGrades } from './hydrate'

describe('Physik Klasse 6 generators', () => {
  it('registers a generator for every K6 topic in the pack', () => {
    const k6 = buildGymSachsenPhysikPack().official.find((g) => g.id === 'physik-klasse-6')
    expect(k6).toBeTruthy()
    const ids = k6!.areas.flatMap((a) => a.topics.map((t) => t.id))
    expect(ids.length).toBeGreaterThan(20)
    for (const id of ids) {
      expect(isPlayablePhysikTopic(id), id).toBe(true)
      expect(resolvePhysikGenerate(id), id).toBeTypeOf('function')
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

  it('hydrates Klasse 6 with content IDs; LB1 Licht is released', async () => {
    const grades = await hydratePackGrades(buildGymSachsenPhysikPack())
    const k6 = grades.find((g) => g.id === 'physik-klasse-6')
    expect(k6).toBeTruthy()
    const topics = k6!.areas.flatMap((a) => a.topics)
    expect(topics.every((t) => typeof t.contentId === 'number')).toBe(true)
    const lb1 = k6!.areas.find((a) => a.id === 'lb1')!.topics
    expect(lb1.every((t) => t.released === true)).toBe(true)
    expect(lb1.find((t) => t.id === 'ph-k6-lb1-spiegel')?.tasksPerRound).toBe(5)
    expect(lb1.find((t) => t.id === 'ph-k6-lb1-brechung')?.tasksPerRound).toBe(10)
    expect(topics.filter((t) => t.released === false).length).toBeGreaterThan(0)
  })

  it('hides Schatten in lampenposition MC until Auflösung', () => {
    const gen = PHYSIK_K6_GENERATORS['ph-k6-lb1-lampenposition']!
    let found = false
    for (let seed = 1; seed <= 40; seed++) {
      const task = gen(createRng(seed))
      if (!task.question.includes('Wohin fällt der Schatten')) continue
      found = true
      expect(task.visualContent).not.toContain('>Schatten<')
      expect(task.solutionVisualContent).toContain('>Schatten<')
    }
    expect(found).toBe(true)
  })

  it('uses interactive variants for Dichte, Stromkreis, Farben, Lichtstrahl and Aggregate', () => {
    const need = {
      'ph-k6-lb2-dichte': new Set(['paramSlider']),
      'ph-k6-lb4-stromkreis': new Set(['multiSelect']),
      'ph-k6-lbw-farben': new Set(['multiSelect']),
      'ph-k6-lb1-lichtstrahl': new Set(['coordinateClick']),
      'ph-k6-lb3-aggregate': new Set(['dragDropSort']),
    } as const
    for (const [id, kinds] of Object.entries(need)) {
      const found = new Set<string>()
      for (let seed = 1; seed <= 80; seed++) {
        const task = PHYSIK_K6_GENERATORS[id]!(createRng(seed))
        if (task.interactive?.type) found.add(task.interactive.type)
      }
      for (const kind of kinds) {
        expect(found.has(kind), `${id} missing ${kind}`).toBe(true)
      }
    }
  })
})
