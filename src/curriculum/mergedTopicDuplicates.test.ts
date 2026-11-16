import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { klasse5 } from './math5'
import { klasse6 } from './math6'
import { klasse7 } from './math7'
import { klasse8 } from './math8'
import { klasse9 } from './math9'
import { klasse10 } from './math10'
import { klasse11_12 } from './math11_12'
import { blendIndex, blendSourcesOf } from './mergeNeu'
import { resolveTasksPerRound } from './tasksPerRound'
import {
  buildUniqueTaskRoundWithSeeds,
  isGenericPromptStem,
  normalizeTaskText,
  numericFactKey,
  taskContentIds,
  taskFingerprint,
} from './uniqueRound'
import type { Topic } from './types'

const GRADES = [klasse5, klasse6, klasse7, klasse8, klasse9, klasse10, klasse11_12]
const merged = (grade: (typeof GRADES)[number]): Topic[] =>
  grade.areas.flatMap((a) => a.topics).filter((t) => blendSourcesOf(t))
const byId = (id: string): Topic =>
  GRADES.flatMap((g) => g.areas.flatMap((a) => a.topics)).find((t) => t.id === id)!

describe('Runden gemergter Mathe-Themen: keine inhaltlichen Wiederholungen (30 Seeds)', () => {
  for (const grade of GRADES) {
    it(
      `${grade.id}: Runde 10, kein gleicher Stamm, keine gleiche Rechnung in anderer Einkleidung`,
      () => {
        const failures: string[] = []
        for (const t of merged(grade)) {
          const want = resolveTasksPerRound(t)
          for (let s = 1; s <= 30; s++) {
            const rows = buildUniqueTaskRoundWithSeeds(t.generate, createRng(s * 1237), want)
            if (rows.length !== want) failures.push(`${t.id} seed ${s}: Länge ${rows.length}`)
            const stems = new Set<string>()
            const facts = new Set<string>()
            const fps = new Set<string>()
            for (const { task } of rows) {
              const stem = normalizeTaskText(task.question)
              // Gleicher Stamm ist nur bei generischen Stämmen (Bild trägt den Inhalt) erlaubt.
              if (stems.has(stem) && !isGenericPromptStem(stem)) {
                failures.push(`${t.id} seed ${s}: doppelter Stamm „${stem.slice(0, 50)}“`)
              }
              stems.add(stem)
              const fp = taskFingerprint(task)
              if (fps.has(fp)) failures.push(`${t.id} seed ${s}: gleicher Inhalt trotz generischem Stamm`)
              fps.add(fp)
              const fact = numericFactKey(task)
              if (fact) {
                if (facts.has(fact)) failures.push(`${t.id} seed ${s}: gleiche Zahlen und Lösung ${fact}`)
                facts.add(fact)
              }
            }
          }
        }
        expect(failures).toEqual([])
      },
      240_000,
    )
  }
})

describe('Alt/Neu-Duplikate: dieselbe Rechnung in anderer Einkleidung trifft sich nie in einer Runde', () => {
  const TOPICS = [
    'k7-lb1-basiswinkel',
    'k7-lb2-add-rational',
    'k7-lb2-div-rational',
    'k10-lb3-rechteck-umfang',
    'lb2-dez-div',
    'lb1-kuerzen',
    'lb3-umfang-rechteck',
  ]
  for (const id of TOPICS) {
    it(`${id}: gleiche Zahlen und Lösung teilen eine Identität`, () => {
      const src = blendSourcesOf(byId(id))!
      const byFact = new Map<string, string[][]>()
      for (const gen of [src.old, src.neu]) {
        for (let s = 1; s <= 300; s++) {
          const task = gen(createRng(s * 3571))
          const fact = numericFactKey(task)
          if (!fact) continue
          byFact.set(fact, [...(byFact.get(fact) ?? []), taskContentIds(task)])
        }
      }
      for (const group of byFact.values()) {
        for (let i = 1; i < group.length; i++) {
          expect(group[i]!.some((x) => group[0]!.includes(x))).toBe(true)
        }
      }
    })
  }
})

describe('Überarbeitete Neu-Varianten: eigene Aufgabenart statt Kopie des Parents', () => {
  const REWORKED: Array<[string, RegExp]> = [
    ['k10-lb4-parabel-wert', /Bestimme c\.|Welcher Punkt liegt auf dem Graphen/],
    ['k7-lb4-rel-haeufigkeit', /Torwandschießen/],
    ['k7-lb1-basiswinkel', /gleichschenklig\?/],
    ['k7-lb2-add-rational', /Fragezeichen/],
    ['k7-lb2-sub-rational', /Fragezeichen/],
    ['k7-lb2-mul-rational', /Fragezeichen/],
    ['k7-lb2-div-rational', /Fragezeichen/],
    ['k1112-lb2-skalarprodukt', /senkrecht zueinander\?/],
    ['lb1-prozent', /Welche Angabe ist am größten/],
    ['lb1-potenzieren', /Fragezeichen/],
  ]
  for (const [id, pattern] of REWORKED) {
    it(`${id}: Neu-Seite enthält die neue Aufgabenart, der Parent nicht`, () => {
      const src = blendSourcesOf(byId(id))!
      let hits = 0
      for (let s = 1; s <= 200; s++) {
        const task = src.neu(createRng(s * 97))
        expect(task.check(task.sampleAnswer), `${id} seed ${s}`).toBe(true)
        if (pattern.test(task.question)) hits++
      }
      expect(hits).toBeGreaterThan(10)
      for (let s = 1; s <= 100; s++) {
        expect(src.old(createRng(s * 97)).question).not.toMatch(pattern)
      }
    })
  }

  it('lb2-grafische-brueche: Bildaufgaben mit gleichem Stamm wiederholen kein Bild, Runde 10', () => {
    const t = byId('lb2-grafische-brueche')
    for (let s = 1; s <= 30; s++) {
      const rows = buildUniqueTaskRoundWithSeeds(t.generate, createRng(s * 11), 10)
      expect(rows).toHaveLength(10)
      expect(new Set(rows.map((r) => r.task.dedupeKey)).size).toBe(10)
    }
  })

  it('lb4-wuerfelnetz: Runde 10 mit Parent-Anteil von mindestens 20 %', () => {
    const t = byId('lb4-wuerfelnetz')
    const src = blendSourcesOf(t)!
    let old = 0
    let total = 0
    for (let s = 1; s <= 30; s++) {
      const rows = buildUniqueTaskRoundWithSeeds(t.generate, createRng(s * 977), 10)
      expect(rows).toHaveLength(10)
      for (const r of rows) {
        total++
        if (blendIndex([src.weights.old, src.weights.neu], createRng(r.seed)) === 0) old++
      }
    }
    expect(old / total).toBeGreaterThanOrEqual(0.2)
  })
})
