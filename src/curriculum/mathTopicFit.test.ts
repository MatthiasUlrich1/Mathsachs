/**
 * Themenbindung Mathe: User-Beispiele + Boost darf nicht themenfremd füllen.
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import {
  generateBruchDezimalProzentK5,
  generateEchteUnechteBruecheK5,
  generatePeriodischeDezimalK6,
  generatePrimfaktorK5,
  generateRechengesetzeK5,
  generateVergleichenOrdnenK5,
} from './mathQualityBanks'
import { MATH_LEHRPLAN_TEILASPEKTE_BY_GRADE } from './mathLehrplanTeilaspekte'
import { ST_GENERATOR_MAP } from './gymSachsenAnhaltPack'
import {
  generatorIdForTopic,
  gymGeneratorCatalog,
  OS_CUSTOM_GENERATORS,
  OS_GENERATOR_MAP,
  resolveOsGenerate,
} from './oberschuleGenerators'
import { SKS_GENERATOR_MAP } from './sekundarschuleSachsenAnhaltPack'

describe('Mathe Themenbindung — User-Beispiele', () => {
  it('lb1-rechengesetze: gemischte Terme/Klammern, nie bloßes a+b, keine Methoden-Spoiler', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const task = generateRechengesetzeK5(createRng(seed))
      const q = task.question
      expect(q, `seed ${seed}`).toMatch(/·|\(/)
      expect(q, `seed ${seed}`).not.toMatch(/Punkt vor Strich|Distributivgesetz|Rechenvorteil|Nutze |Wende /i)
      expect(q, `seed ${seed}`).not.toMatch(/^Berechne:\s*\d+\s*\+\s*\d+\s*$/)
      expect(q, `seed ${seed}`).not.toMatch(/^Berechne:\s*\d+\s*·\s*\d+\s*$/)
      expect(task.check(task.sampleAnswer), `seed ${seed}`).toBe(true)
    }
  })

  it('k6-lb1-periodische-dezimal: endlich/periodisch, nie bloßes a·b', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const task = generatePeriodischeDezimalK6(createRng(seed))
      const q = task.question
      expect(q, `seed ${seed}`).toMatch(/endlich|periodisch|Dezimal|Bruch|\//i)
      expect(q, `seed ${seed}`).not.toMatch(/^Berechne:\s*\d+/)
      expect(task.check(task.sampleAnswer), `seed ${seed}`).toBe(true)
    }
  })

  it('wired Teilaspekt-Topics use quality generators', () => {
    const byId = (grade: string, id: string) =>
      MATH_LEHRPLAN_TEILASPEKTE_BY_GRADE[grade]?.find((x) => x.topic.id === id)?.topic.generate
    expect(byId('math5', 'lb1-rechengesetze')).toBe(generateRechengesetzeK5)
    expect(byId('math5', 'lb1-vergleichen-ordnen')).toBe(generateVergleichenOrdnenK5)
    expect(byId('math5', 'lb1-primfaktorzerlegung')).toBe(generatePrimfaktorK5)
    expect(byId('math5', 'lb2-echte-unechte-brueche')).toBe(generateEchteUnechteBruecheK5)
    expect(byId('math5', 'lb2-bruch-dezimal-prozent')).toBe(generateBruchDezimalProzentK5)
    expect(byId('math6', 'k6-lb1-periodische-dezimal')).toBe(generatePeriodischeDezimalK6)
  })

  it('weitere K5-Qualitätsbanken sind checkable und themengebunden', () => {
    for (let seed = 1; seed <= 20; seed++) {
      for (const gen of [
        generateVergleichenOrdnenK5,
        generatePrimfaktorK5,
        generateEchteUnechteBruecheK5,
        generateBruchDezimalProzentK5,
      ]) {
        const task = gen(createRng(seed))
        expect(task.check(task.sampleAnswer)).toBe(true)
        expect(task.question.length).toBeGreaterThan(12)
        expect(task.question).not.toMatch(/^Berechne:\s*\d+\s*[+·]\s*\d+\s*$/)
      }
    }
  })

  it('OS/ST/SKS-Themen mit Gym-Generator liefern genau dessen Aufgaben (keine themenfremden Füller)', async () => {
    const catalog = await gymGeneratorCatalog()
    const ids = Object.keys({ ...OS_GENERATOR_MAP, ...ST_GENERATOR_MAP, ...SKS_GENERATOR_MAP }).filter(
      (id) => !OS_CUSTOM_GENERATORS[id],
    )
    expect(ids.length).toBeGreaterThan(100)
    for (const id of ids) {
      const gymId = generatorIdForTopic(id)!
      const gym = catalog.get(gymId)
      expect(gym, `${id} → ${gymId}`).toBeDefined()
      const gen = resolveOsGenerate(id, catalog)!
      for (let seed = 1; seed <= 15; seed++) {
        expect(gen(createRng(seed)).question, `${id} seed ${seed}`).toBe(gym!(createRng(seed)).question)
      }
    }
  })
})
