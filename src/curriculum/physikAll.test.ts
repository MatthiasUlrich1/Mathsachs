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

  it('hydrates the full pack with generators; only freigegebene topics are released', async () => {
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
    const k6 = grades.find((g) => g.id === 'physik-klasse-6')!
    const lb1 = k6.areas.find((a) => a.id === 'lb1')!.topics
    expect(lb1.every((t) => t.released === true)).toBe(true)
    const lb2 = k6.areas.find((a) => a.id === 'lb2')!.topics
    const releasedLb2 = new Set([
      'ph-k6-lb2-volumen',
      'ph-k6-lb2-dichte',
      'ph-k6-lb2-dichtestoffe',
      'ph-k6-lb2-masse',
      'ph-k6-lb2-geschwindigkeit',
      'ph-k6-lb2-wegzeit',
      'ph-k6-lb2-einheiten',
    ])
    for (const t of lb2) {
      if (releasedLb2.has(t.id)) {
        expect(t.released, t.id).toBe(true)
        expect(t.tasksPerRound, t.id).toBe(10)
      } else {
        expect(t.released, t.id).toBe(false)
      }
    }
    const lb3 = k6.areas.find((a) => a.id === 'lb3')!.topics
    const releasedLb3 = new Set([
      'ph-k6-lb3-thermometer',
      'ph-k6-lb3-kelvin',
      'ph-k6-lb3-ausdehnung',
      'ph-k6-lb3-aggregate',
      'ph-k6-lb3-schmelzen',
      'ph-k6-lb3-messreihe',
    ])
    for (const t of lb3) {
      if (releasedLb3.has(t.id)) {
        expect(t.released, t.id).toBe(true)
      } else {
        expect(t.released, t.id).toBe(false)
      }
    }
    const lb4 = k6.areas.find((a) => a.id === 'lb4')!.topics
    const releasedLb4 = new Set([
      'ph-k6-lb4-stromkreis',
      'ph-k6-lb4-leiter',
      'ph-k6-lb4-symbole',
      'ph-k6-lb4-widerstand',
      'ph-k6-lb4-reiheparallel',
      'ph-k6-lb4-gefahren',
    ])
    for (const t of lb4) {
      if (releasedLb4.has(t.id)) {
        expect(t.released, t.id).toBe(true)
      } else {
        expect(t.released, t.id).toBe(false)
      }
    }
    expect(
      k6.areas
        .filter((a) => a.id !== 'lb1' && a.id !== 'lb2' && a.id !== 'lb3' && a.id !== 'lb4')
        .flatMap((a) => a.topics)
        .every((t) => t.released === false),
    ).toBe(true)
  })

  it('attaches Wissen (Fachwissen) to every hydrated Physik topic', async () => {
    const grades = await hydratePackGrades(buildGymSachsenPhysikPack())
    for (const grade of grades) {
      for (const topic of grade.areas.flatMap((a) => a.topics)) {
        expect(topic.fachwissen?.text.trim().length, `${grade.id}/${topic.id}`).toBeGreaterThan(40)
      }
    }
  })
})
