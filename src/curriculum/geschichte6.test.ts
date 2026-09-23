import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { GESCHICHTE_K6_GENERATORS } from './geschichte6'
import { isPlayableGeschichteTopic, resolveGeschichteGenerate } from './geschichteGenerators'
import { hydratePackGrades } from './hydrate'
import { buildGymSachsenGeschichtePack } from './geschichteGymPack'

describe('Geschichte K6 Römische Zivilisation', () => {
  const romIds = Object.keys(GESCHICHTE_K6_GENERATORS)

  it('registers generators for all Rom LB1 practice topics', () => {
    expect(romIds.length).toBeGreaterThanOrEqual(6)
    for (const id of romIds) {
      expect(isPlayableGeschichteTopic(id), id).toBe(true)
      expect(resolveGeschichteGenerate(id)).toBeTypeOf('function')
    }
  })

  it('generates checkable tasks for each Rom topic', () => {
    for (const id of romIds) {
      const gen = GESCHICHTE_K6_GENERATORS[id]!
      for (let seed = 1; seed <= 12; seed++) {
        const task = gen(createRng(seed))
        expect(task.question.length, id).toBeGreaterThan(10)
        expect(task.check(task.sampleAnswer), `${id} seed ${seed}`).toBe(true)
      }
    }
  })

  it('jahreszahlen drill asks for years most of the time', () => {
    let yearAsks = 0
    for (let seed = 1; seed <= 40; seed++) {
      const task = GESCHICHTE_K6_GENERATORS['ge-k6-lb1-jahreszahlen']!(createRng(seed))
      if (
        task.answerKind === 'integer' ||
        /\d{3}\s*v\.\s*Chr/i.test(task.question) ||
        /Welches Jahr|welchem Jahr|Jahreszahl/i.test(task.question)
      ) {
        yearAsks += 1
      }
      expect(task.check(task.sampleAnswer)).toBe(true)
    }
    expect(yearAsks).toBeGreaterThan(30)
  })

  it('never serves Platzhalter stubs for Rom LB1 topics', () => {
    for (const id of romIds) {
      for (let seed = 1; seed <= 5; seed++) {
        const task = GESCHICHTE_K6_GENERATORS[id]!(createRng(seed))
        expect(task.question).not.toMatch(/Übungsaufgaben folgen|Tippe „ok“/)
      }
    }
  })

  it('hydrates K6 LB1 with playable Rom topics (still locked)', async () => {
    const grades = await hydratePackGrades(buildGymSachsenGeschichtePack())
    const k6 = grades.find((g) => g.id === 'geschichte-klasse-6')!
    const lb1 = k6.areas.find((a) => a.id === 'lb1')!
    expect(lb1.topics.length).toBeGreaterThanOrEqual(7)
    expect(lb1.topics.every((t) => t.released === false)).toBe(true)
    expect(lb1.topics.every((t) => !t.outlineOnly)).toBe(true)
    const punisch = lb1.topics.find((t) => t.id === 'ge-k6-lb1-punische-kriege')!
    const task = punisch.generate(createRng(5))
    expect(task.check(task.sampleAnswer)).toBe(true)
  })
})
