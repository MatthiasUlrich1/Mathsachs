import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { canShowExploreBoard } from '../lib/exploreBoards'
import { isTopicLocked } from '../lib/topicVisibility'
import { findLoadedTopic } from '../challenge/topics'
import { resolveExam } from '../exam/examCode'
import { CURRICULUM_VERSION } from './registry'
import { klasse5 } from './math5'
import { klasse6 } from './math6'
import { klasse7 } from './math7'
import { klasse8 } from './math8'
import { klasse9 } from './math9'
import { klasse10 } from './math10'
import { klasse11_12 } from './math11_12'
import { math5NeuTopics } from './math5NeuTopics'
import { math6NeuTopics } from './math6NeuTopics'
import { math7NeuTopics } from './math7NeuTopics'
import { math8NeuTopics } from './math8NeuTopics'
import { math9NeuTopics } from './math9NeuTopics'
import { math10NeuTopics } from './math10NeuTopics'
import { math1112NeuTopics } from './math11_12NeuTopics'
import {
  NEU_BLEND_OVERRIDES,
  blendGenerators,
  blendIndex,
  blendSourcesOf,
  findTopicWithLegacy,
  legacyNeuIdToParent,
  mergeFachwissen,
  mergeNeuIntoParents,
  neuBlendWeights,
  splitSentences,
} from './mergeNeu'
import { gymGeneratorCatalog, OS_GENERATOR_MAP } from './oberschuleGenerators'
import { ST_GENERATOR_MAP } from './gymSachsenAnhaltPack'
import { SKS_GENERATOR_MAP } from './sekundarschuleSachsenAnhaltPack'
import { resolveTasksPerRound } from './tasksPerRound'
import { taskContentIds, buildUniqueTaskRoundWithSeeds } from './uniqueRound'
import { textTask } from './taskHelpers'
import type { Grade, Task, Topic, TopicArea } from './types'

const GRADES: Array<{ grade: Grade; neu: Topic[] }> = [
  { grade: klasse5, neu: math5NeuTopics },
  { grade: klasse6, neu: math6NeuTopics },
  { grade: klasse7, neu: math7NeuTopics },
  { grade: klasse8, neu: math8NeuTopics },
  { grade: klasse9, neu: math9NeuTopics },
  { grade: klasse10, neu: math10NeuTopics },
  { grade: klasse11_12, neu: math1112NeuTopics },
]

const topicsOf = (grade: Grade): Topic[] => grade.areas.flatMap((a) => a.topics)

const fixed = (label: string) => (): Task =>
  textTask({ question: label, accepted: [label], solution: label, explanation: label })

const fakeTopic = (id: string, extra: Partial<Topic> = {}): Topic => ({
  id,
  title: id,
  pointsPerTask: 10,
  generate: fixed(id),
  ...extra,
})

describe('legacyNeuIdToParent / findTopicWithLegacy', () => {
  it('mappt <parent>__neu auf den Parent, lässt andere IDs unverändert', () => {
    expect(legacyNeuIdToParent('lb1-addition__neu')).toBe('lb1-addition')
    expect(legacyNeuIdToParent('lb1-addition')).toBe('lb1-addition')
    expect(legacyNeuIdToParent('a__neu__neu')).toBe('a__neu')
  })

  it('bevorzugt exakte Treffer und fällt sonst auf den Parent zurück', () => {
    const areas: TopicArea[] = [
      { id: 'a', title: 'A', topics: [fakeTopic('t1')] },
      { id: 'b', title: 'B', topics: [fakeTopic('t2'), fakeTopic('t2__neu')] },
    ]
    expect(findTopicWithLegacy(areas, 't2__neu')?.topic.id).toBe('t2__neu')
    expect(findTopicWithLegacy(areas, 't1__neu')?.topic.id).toBe('t1')
    expect(findTopicWithLegacy(areas, 't1__neu')?.area.id).toBe('a')
    expect(findTopicWithLegacy(areas, 'gibt-es-nicht__neu')).toBeNull()
    expect(findTopicWithLegacy(areas, 'gibt-es-nicht')).toBeNull()
  })
})

describe('blendGenerators', () => {
  const parts = [
    { gen: fixed('alt'), weight: 1 },
    { gen: fixed('neu'), weight: 3 },
  ]

  it('ist je Seed deterministisch und nutzt nur den übergebenen rng', () => {
    const blend = blendGenerators(parts)
    for (let seed = 1; seed <= 50; seed++) {
      expect(blend(createRng(seed)).question).toBe(blend(createRng(seed)).question)
    }
    // Verbraucht genau einen Wert für die Wahl, die Quelle bekommt den Rest-rng.
    let calls = 0
    const counting = () => {
      calls++
      return 0.5
    }
    blendGenerators([{ gen: () => fixed('x')(), weight: 1 }])(counting)
    expect(calls).toBe(1)
  })

  it('blendIndex entspricht der Wahl in blendGenerators und folgt den Gewichten', () => {
    const blend = blendGenerators(parts)
    let neu = 0
    const n = 4000
    for (let seed = 1; seed <= n; seed++) {
      const idx = blendIndex([1, 3], createRng(seed))
      const label = blend(createRng(seed)).question
      expect(label).toBe(idx === 0 ? 'alt' : 'neu')
      if (idx === 1) neu++
    }
    expect(neu / n).toBeGreaterThan(0.7)
    expect(neu / n).toBeLessThan(0.8)
  })

  it('wirft ohne Quelle', () => {
    expect(() => blendGenerators([])).toThrow()
  })
})

describe('mergeFachwissen', () => {
  it('lässt den Parent-Text primär und hängt nur neue Sätze ohne Dopplung an', () => {
    const merged = mergeFachwissen(
      { text: 'Beim Runden schaut man auf die Ziffer rechts. Ab 5 wird aufgerundet.', quelle: 'Eltern' },
      {
        text: 'Beim Runden schaut man auf die Ziffer rechts. Große Zahlen runden hilft beim Überschlag. Große Zahlen runden hilft beim Überschlag.',
        quelle: 'Neu',
        explore: { boardId: 'b' },
      },
    )!
    expect(merged.text.startsWith('Beim Runden schaut man auf die Ziffer rechts. Ab 5 wird aufgerundet.')).toBe(true)
    expect(merged.text.match(/Überschlag/g)).toHaveLength(1)
    expect(merged.text.match(/Ziffer rechts/g)).toHaveLength(1)
    expect(merged.quelle).toBe('Eltern')
    expect(merged.explore).toEqual({ boardId: 'b' })
  })

  it('übernimmt das Neu-Fachwissen, wenn der Parent keines hat, und behält das Parent-explore', () => {
    expect(mergeFachwissen(undefined, { text: 'X.' })?.text).toBe('X.')
    expect(mergeFachwissen({ text: 'A.' }, undefined)?.text).toBe('A.')
    const both = mergeFachwissen(
      { text: 'A.', explore: { boardId: 'p' } },
      { text: 'B.', explore: { boardId: 'n' } },
    )!
    expect(both.explore).toEqual({ boardId: 'p' })
    expect(both.text).toBe('A. B.')
  })
})

describe('mergeNeuIntoParents', () => {
  const areas = (): TopicArea[] => [
    { id: 'a', title: 'A', topics: [fakeTopic('t1', { released: true, title: 'Haupt' })] },
    { id: 'b', title: 'B', topics: [fakeTopic('t2')] },
  ]

  it('entfernt das Neu-Thema, behält Parent-Titel/-Status und mischt beide Generatoren', () => {
    const neu = fakeTopic('t1__neu', {
      title: 'Haupt · Neu (Prüfung)',
      reviewOf: 't1',
      neu: true,
      released: false,
      keywords: ['Neu', 'Prüfung', 't1', 'Extra'],
      hint: 'fremder Hinweis',
    })
    const merged = mergeNeuIntoParents(areas(), [neu])
    const all = merged.flatMap((a) => a.topics)
    expect(all.map((t) => t.id)).toEqual(['t1', 't2'])
    const t1 = all[0]!
    expect(t1.title).toBe('Haupt')
    expect(t1.released).toBe(true)
    expect(t1.neu).toBeUndefined()
    expect(t1.reviewOf).toBeUndefined()
    expect(t1.keywords).toEqual(['Extra'])
    expect(t1.hint).toBe('fremder Hinweis')
    const seen = new Set<string>()
    for (let seed = 1; seed <= 200; seed++) seen.add(t1.generate(createRng(seed)).question)
    expect(seen).toEqual(new Set(['t1', 't1__neu']))
    expect(blendSourcesOf(t1)?.weights).toEqual({ old: 1, neu: 1 })
  })

  it('wirft bei Neu-Themen ohne Parent und bei zwei Neu-Themen pro Parent', () => {
    expect(() =>
      mergeNeuIntoParents(areas(), [fakeTopic('zzz__neu', { reviewOf: 'zzz' })]),
    ).toThrow(/ohne Parent/)
    expect(() =>
      mergeNeuIntoParents(areas(), [
        fakeTopic('t1__neu', { reviewOf: 't1' }),
        fakeTopic('t1__neu', { reviewOf: 't1' }),
      ]),
    ).toThrow(/mehrere/)
  })

  it('mutiert die Eingaben nicht', () => {
    const input = areas()
    const parent = input[0]!.topics[0]!
    const gen = parent.generate
    mergeNeuIntoParents(input, [fakeTopic('t1__neu', { reviewOf: 't1' })])
    expect(input[0]!.topics[0]).toBe(parent)
    expect(parent.generate).toBe(gen)
  })
})

describe('Mathe-Klassenstufen: Neu-Themen sind aufgelöst', () => {
  it('jedes Neu-Thema hat einen Parent in seiner Klassenstufe (keines ohne Parent)', () => {
    for (const { grade, neu } of GRADES) {
      const ids = new Set(topicsOf(grade).map((t) => t.id))
      for (const n of neu) {
        expect(ids.has(n.reviewOf!), `${grade.id}: ${n.id} ohne Parent ${n.reviewOf}`).toBe(true)
        expect(n.id).toBe(`${n.reviewOf}__neu`)
      }
    }
  })

  it('keine __neu-ID, keine Sperre, kein Neu-Flag auf gemergten Parents', () => {
    for (const { grade, neu } of GRADES) {
      const merged = new Set(neu.map((n) => n.reviewOf))
      for (const t of topicsOf(grade)) {
        expect(t.id.includes('__neu'), `${grade.id}: ${t.id}`).toBe(false)
        if (!merged.has(t.id)) continue
        expect(t.neu, t.id).toBeUndefined()
        expect(t.reviewOf, t.id).toBeUndefined()
        expect(t.released, t.id).not.toBe(false)
        expect(t.title, t.id).not.toMatch(/Neu \(Prüfung\)/)
        expect(isTopicLocked({ id: t.id, released: t.released, neu: t.neu }), t.id).toBe(false)
        expect(blendSourcesOf(t), `${t.id} ist kein Mix`).toBeDefined()
      }
    }
  })

  it('zählt 156 gemergte Themen über alle Klassenstufen', () => {
    const per = GRADES.map(({ neu }) => neu.length)
    expect(per).toEqual([48, 33, 22, 17, 15, 14, 7])
    expect(per.reduce((a, b) => a + b, 0)).toBe(156)
  })

  it('exploration-Tafelbilder der Neu-Themen liegen jetzt am Parent und sind sichtbar', () => {
    const byId = new Map(GRADES.flatMap(({ grade }) => topicsOf(grade)).map((t) => [t.id, t]))
    const expected: Record<string, string> = {
      'lb2-erweitern': 'bruchErweitern',
      'lb1-erweitern': 'bruchErweitern',
      'lb3-winkelarten': 'winkelarten',
      'k7-lb1-mittelsenkrechte-schritte': 'mittelsenkrechte',
    }
    for (const [id, board] of Object.entries(expected)) {
      const t = byId.get(id)!
      expect(t.fachwissen?.explore?.boardId, id).toBe(board)
      for (const role of ['schueler', 'lehrer', undefined]) {
        expect(canShowExploreBoard(t, role), `${id} ${String(role)}`).toBe(true)
      }
    }
  })

  it('Fachwissen: Parent-Text steht am Anfang, keine doppelten Sätze', () => {
    for (const { grade, neu } of GRADES) {
      const byId = new Map(topicsOf(grade).map((t) => [t.id, t]))
      for (const n of neu) {
        const t = byId.get(n.reviewOf!)!
        const text = t.fachwissen?.text
        if (!text) continue
        const sentences = splitSentences(text).map((s) => s.toLowerCase())
        expect(new Set(sentences).size, `${t.id}: doppelter Satz`).toBe(sentences.length)
      }
    }
  })
})

/**
 * Parents mit nur wenigen eindeutigen Aufgaben auf einer Seite. Die Pools wurden mit
 * `buildUniqueTaskRound` (Ziel 60) gemessen; hier steckt die Begrenzung in der Aufgabenfamilie
 * selbst (identischer Stamm bzw. eine einzige feste Aufgabe), nicht im Mix.
 * - minOldShare: Untergrenze des Parent-Anteils, wo ein Pool von 1 keine 20 % zulässt.
 * - maxRound: Runde kürzer als 10, weil Gesamtpool (alt + neu) < 10.
 */
const POOL_LIMITED: Record<string, { minOldShare?: number; maxRound?: number }> = {
  // alt: 1 feste Ordnungsaufgabe → höchstens 1 von 10 Aufgaben stammt vom Parent
  'k7-lb1-mittelsenkrechte-schritte': { minOldShare: 0.05 },
  // alt-Pool 1 (gleicher Stamm), neu-Pool 6 → Gesamtpool 7
  'lb4-wuerfelnetz': { minOldShare: 0.08, maxRound: 7 },
  // alt-Pool 3, neu-Pool 3 → Gesamtpool 6
  'lb2-grafische-brueche': { maxRound: 6 },
}

describe('Mathe-Runden der gemergten Themen (30 Seeds)', () => {
  it.each(GRADES.map((g) => [g.grade.id, g] as const))(
    '%s: Runde 10, keine Wiederholung, alt und neu je >= 20 %%',
    (_id, { grade, neu }) => {
      const merged = new Set(neu.map((n) => n.reviewOf))
      const failures: string[] = []
      for (const t of topicsOf(grade)) {
        if (!merged.has(t.id)) continue
        const src = blendSourcesOf(t)!
        const w = [src.weights.old, src.weights.neu]
        const limit = POOL_LIMITED[t.id]
        const want = resolveTasksPerRound(t)
        let nOld = 0
        let nNeu = 0
        for (let s = 1; s <= 30; s++) {
          const rows = buildUniqueTaskRoundWithSeeds(t.generate, createRng(s * 977), want)
          const maxLen = limit?.maxRound ?? want
          if (rows.length > want || (limit?.maxRound ? rows.length < 5 : rows.length !== want)) {
            failures.push(`${t.id} seed ${s}: Länge ${rows.length} (erwartet ${maxLen})`)
          }
          const seen = new Set<string>()
          for (const row of rows) {
            for (const id of taskContentIds(row.task)) {
              if (seen.has(id)) failures.push(`${t.id} seed ${s}: doppelt ${id.slice(0, 60)}`)
            }
            for (const id of taskContentIds(row.task)) seen.add(id)
            if (blendIndex(w, createRng(row.seed)) === 0) nOld++
            else nNeu++
          }
        }
        const total = nOld + nNeu
        const minOld = limit?.minOldShare ?? 0.2
        if (nOld / total < minOld) failures.push(`${t.id}: Parent-Anteil ${(100 * nOld / total).toFixed(0)} %`)
        if (nNeu / total < 0.2) failures.push(`${t.id}: Neu-Anteil ${(100 * nNeu / total).toFixed(0)} %`)
      }
      expect(failures).toEqual([])
    },
    240_000,
  )

  it('Gewichts-Overrides verweisen auf existierende Parents', () => {
    const ids = new Set(GRADES.flatMap(({ grade }) => topicsOf(grade).map((t) => t.id)))
    for (const id of Object.keys(NEU_BLEND_OVERRIDES)) expect(ids.has(id), id).toBe(true)
    expect(neuBlendWeights('lb1-addition')).toEqual({ old: 1, neu: 1 })
    expect(neuBlendWeights('lb1-schriftliche-division')).toEqual({ old: 3, neu: 1 })
  })
})

describe('Alte __neu-IDs funktionieren weiter', () => {
  it('resolveExam: alter Klausur-Code mit <parent>__neu verweist auf den Parent', async () => {
    const [resolved] = await resolveExam({
      schema: 'A',
      curriculumVersion: CURRICULUM_VERSION - 1,
      titel: 'Alt',
      aufgaben: [{ modul: 'mathematik-klasse-6', thema: 'lb1-kuerzen__neu', seed: 5, punkte: 3 }],
    })
    expect(resolved.topicId).toBe('lb1-kuerzen')
    expect(resolved.task.check(resolved.task.sampleAnswer)).toBe(true)
  })

  it('resolveExam: unbekannte __neu-ID bleibt ein sauberer Fehler', async () => {
    await expect(
      resolveExam({
        schema: 'A',
        curriculumVersion: CURRICULUM_VERSION,
        titel: 'X',
        aufgaben: [{ modul: 'mathematik-klasse-6', thema: 'gibt-es-nicht__neu', seed: 1, punkte: 1 }],
      }),
    ).rejects.toThrow(/nicht gefunden/)
  })

  it('Challenge: findLoadedTopic löst alte __neu-IDs auf den Parent auf', () => {
    const loaded = [{ moduleId: 'mathematik-klasse-5', grade: klasse5 }]
    const hit = findLoadedTopic(loaded, 'lb1-addition__neu')
    expect(hit?.topic.id).toBe('lb1-addition')
    expect(findLoadedTopic(loaded, 'lb1-addition')?.topic.id).toBe('lb1-addition')
    expect(findLoadedTopic(loaded, 'nichts__neu')).toBeNull()
  })

  it('jede alte Neu-ID jeder Klassenstufe wird gefunden', () => {
    for (const { grade, neu } of GRADES) {
      for (const n of neu) {
        const hit = findTopicWithLegacy(grade.areas, n.id)
        expect(hit?.topic.id, n.id).toBe(n.reviewOf)
      }
    }
  })
})

describe('Andere Packs: Generator-Maps lösen nach dem Merge weiter auf', () => {
  it('jede ID aus OS/ST/SKS_GENERATOR_MAP existiert im Gym-Katalog (kein __neu)', async () => {
    const catalog = await gymGeneratorCatalog()
    const missing: string[] = []
    for (const [name, map] of Object.entries({
      OS: OS_GENERATOR_MAP,
      ST: ST_GENERATOR_MAP,
      SKS: SKS_GENERATOR_MAP,
    })) {
      for (const [from, gymId] of Object.entries(map)) {
        if (gymId.includes('__neu') || !catalog.has(gymId)) missing.push(`${name}: ${from} -> ${gymId}`)
      }
    }
    expect(missing).toEqual([])
  })

  it('Umrechnen-Themen (k5/k6) haben einen Parent und stehen als normale Themen im Katalog', async () => {
    const catalog = await gymGeneratorCatalog()
    for (const id of ['k5-umrechnen-laenge', 'k5-umrechnen-masse', 'k5-umrechnen-zeit', 'k5-umrechnen-flaeche', 'k5-umrechnen-volumen', 'k6-umrechnen-laenge', 'k6-umrechnen-flaeche']) {
      expect(catalog.has(id), id).toBe(true)
    }
  })
})
