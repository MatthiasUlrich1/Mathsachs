/**
 * Guard-Tests für die Mappings der Lehrplan-Packs (Master-Quellen, 1:n, Schwierigkeit).
 *
 * Strikt: Verstöße außerhalb von `KNOWN_BEFORE_E5` lassen den Test scheitern, und
 * `KNOWN_BEFORE_E5`-Einträge, die nicht mehr auftreten, ebenfalls (Liste schrumpft nur).
 * E5 ersetzt die String-Maps durch `*_TOPIC_MAPPINGS` und muss die Liste leeren.
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { buildGymSachsenAnhaltPack } from './gymSachsenAnhaltPack'
import {
  ambiguousCatalogIds,
  catalogEntryMeta,
  gymGeneratorCatalog,
  mappingForTopic,
  OS_CUSTOM_GENERATORS,
  resolveOsGenerate,
  resolveSources,
} from './oberschuleGenerators'
import {
  allOfficialTopics,
  buildOberschuleHsPack,
  buildOberschuleRsPack,
} from './oberschulePacks'
import type { PackTopic } from './pack'
import { isQualifiedRef, type PackTopicMapping } from './packMapping'
import { KNOWN_BEFORE_E5 } from './packMappingBaseline'
import {
  buildSekundarschuleSachsenAnhaltHsPack,
  buildSekundarschuleSachsenAnhaltRsPack,
} from './sekundarschuleSachsenAnhaltPack'
import { resolveTasksPerRound } from './tasksPerRound'
import { buildUniqueTaskRoundWithSeeds } from './uniqueRound'

interface PackUnderTest {
  id: string
  hs: boolean
  topics: PackTopic[]
}

const packTopics = (pack: { official: Array<{ areas: Array<{ topics: PackTopic[] }> }> }) =>
  pack.official.flatMap((g) => g.areas.flatMap((a) => a.topics))

const PACKS: PackUnderTest[] = [
  { id: 'gym-sachsen-anhalt', hs: false, topics: packTopics(buildGymSachsenAnhaltPack()) },
  { id: 'oberschule-sachsen-hs', hs: true, topics: allOfficialTopics(buildOberschuleHsPack()) },
  { id: 'oberschule-sachsen-rs', hs: false, topics: allOfficialTopics(buildOberschuleRsPack()) },
  {
    id: 'sekundarschule-sachsen-anhalt-hs',
    hs: true,
    topics: packTopics(buildSekundarschuleSachsenAnhaltHsPack()),
  },
  {
    id: 'sekundarschule-sachsen-anhalt-rs',
    hs: false,
    topics: packTopics(buildSekundarschuleSachsenAnhaltRsPack()),
  },
]

type Mapped = { topic: PackTopic; mapping: PackTopicMapping }
const mappedTopics = (pack: PackUnderTest): Mapped[] =>
  pack.topics.flatMap((topic) => {
    const mapping = mappingForTopic(topic.id)
    return mapping ? [{ topic, mapping }] : []
  })

const sorted = (xs: Iterable<string>) => [...xs].sort()

/** Aktuelle Verstöße müssen exakt der Baseline entsprechen (neue und veraltete Einträge scheitern). */
function expectBaseline(kind: string, actual: string[]) {
  const known = new Set<string>(KNOWN_BEFORE_E5[kind] ?? [])
  const now = new Set(actual)
  expect(
    sorted(actual.filter((v) => !known.has(v))),
    `${kind}: neue Verstöße`,
  ).toEqual([])
  expect(
    sorted([...known].filter((v) => !now.has(v))),
    `${kind}: Baseline-Einträge, die nicht mehr auftreten (aus KNOWN_BEFORE_E5 entfernen)`,
  ).toEqual([])
}

describe('Pack-Mappings: Katalog und Quellen', () => {
  it('Katalog: qualifizierte Schlüssel eindeutig, mehrdeutige einfache IDs sind bekannt', async () => {
    const catalog = await gymGeneratorCatalog()
    const ambiguous = ambiguousCatalogIds()
    expect(sorted(ambiguous.keys())).toEqual(['lb4-oberflaeche-quader', 'lb4-volumen-quader'])
    for (const [id, keys] of ambiguous) {
      expect(keys.length, id).toBeGreaterThan(1)
      for (const key of keys) {
        expect(catalog.has(key), key).toBe(true)
        expect(isQualifiedRef(key)).toBe(true)
      }
      // einfache ID löst weiter auf das erste Vorkommen auf (Bestands-IDs unverändert)
      expect(catalog.get(id)).toBe(catalog.get(keys[0]!))
    }
    // K5 und K6 sind echte Alternativen
    const k5 = catalog.get('mathematik-klasse-5:lb4-volumen-quader')
    const k6 = catalog.get('mathematik-klasse-6:lb4-volumen-quader')
    expect(k5).toBeDefined()
    expect(k6).toBeDefined()
    expect(k5).not.toBe(k6)
  })

  for (const pack of PACKS) {
    describe(pack.id, () => {
      it('(a) jede Quelle löst auf; maxDifficulty lässt keine leeren Themen zurück', async () => {
        const catalog = await gymGeneratorCatalog()
        const problems: string[] = []
        for (const { topic, mapping } of mappedTopics(pack)) {
          const res = resolveSources(mapping, catalog)
          for (const ref of res.missing) problems.push(`${topic.id}: Quelle fehlt ${ref}`)
          const custom = Boolean(OS_CUSTOM_GENERATORS[topic.id])
          if (mapping.sources.length > 0 && res.gens.length === 0 && !custom) {
            problems.push(`${topic.id}: alle Quellen durch maxDifficulty entfernt (bliebe Outline)`)
          }
          if (mapping.allowRepeat && !mapping.note) problems.push(`${topic.id}: allowRepeat ohne note`)
        }
        expect(problems).toEqual([])
      })

      it('(b) kein Master-Thema doppelt im Pack (außer allowRepeat mit note)', async () => {
        await gymGeneratorCatalog()
        const users = new Map<string, string[]>()
        for (const { topic, mapping } of mappedTopics(pack)) {
          if (mapping.allowRepeat && mapping.note) continue
          for (const ref of new Set(mapping.sources)) {
            const key = catalogEntryMeta(ref)?.key ?? ref
            users.set(key, [...(users.get(key) ?? []), topic.id])
          }
        }
        const repeats = [...users]
          .filter(([, ids]) => ids.length > 1)
          .map(([key, ids]) => `${pack.id}: ${key} <- ${sorted(ids).join(', ')}`)
        expectBaseline(`repeat:${pack.id}`, repeats)
      })

      it('(d) Hauptschul-Pack: keine Quelle mit difficulty 3 ohne note', async () => {
        await gymGeneratorCatalog()
        const bad: string[] = []
        if (pack.hs) {
          for (const { topic, mapping } of mappedTopics(pack)) {
            if (mapping.note) continue
            for (const ref of mapping.sources) {
              const diff = catalogEntryMeta(ref)?.difficulty
              if (diff === 3 && !(mapping.maxDifficulty && mapping.maxDifficulty < 3)) {
                bad.push(`${pack.id}: ${topic.id} -> ${ref}`)
              }
            }
          }
        }
        expectBaseline(`difficulty3:${pack.id}`, bad)
      })

      it('(e) keine mehrdeutige einfache Master-ID als Quelle', async () => {
        await gymGeneratorCatalog()
        const ambiguous = ambiguousCatalogIds()
        const bad: string[] = []
        for (const { topic, mapping } of mappedTopics(pack)) {
          for (const ref of mapping.sources) {
            if (ambiguous.has(ref)) bad.push(`${pack.id}: ${topic.id} -> ${ref}`)
          }
        }
        expectBaseline(`ambiguous:${pack.id}`, bad)
      })
    })
  }

  it(
    '(c) jedes spielbare Pack-Thema erreicht die Rundenlänge (10 oder dokumentiertes tasksPerRound) über 30 Seeds',
    async () => {
      const catalog = await gymGeneratorCatalog()
      const seen = new Set<string>()
      const short: string[] = []
      for (const pack of PACKS) {
        for (const topic of pack.topics) {
          if (seen.has(topic.id)) continue
          seen.add(topic.id)
          const gen = resolveOsGenerate(topic.id, catalog)
          if (!gen) continue
          const want = resolveTasksPerRound(topic)
          let worst = want
          for (let s = 1; s <= 30; s++) {
            const rows = buildUniqueTaskRoundWithSeeds(gen, createRng(s * 977), want)
            worst = Math.min(worst, rows.length)
          }
          if (worst < want) short.push(`${topic.id}: ${worst}/${want}`)
        }
      }
      expectBaseline('roundLength', short)
    },
    240_000,
  )
})

describe('Resolver: 1:n, maxDifficulty, Custom', () => {
  const T = '__test-topic'
  const withMapping = async (
    mapping: PackTopicMapping,
    run: (resolve: () => ReturnType<typeof resolveOsGenerate>) => void,
    custom?: (typeof OS_CUSTOM_GENERATORS)[string],
  ) => {
    const catalog = await gymGeneratorCatalog()
    const { OS_TOPIC_MAPPINGS } = await import('./oberschuleGenerators')
    OS_TOPIC_MAPPINGS[T] = mapping
    if (custom) OS_CUSTOM_GENERATORS[T] = custom
    try {
      run(() => resolveOsGenerate(T, catalog))
    } finally {
      delete OS_TOPIC_MAPPINGS[T]
      delete OS_CUSTOM_GENERATORS[T]
    }
  }
  const fingerprint = (gen: NonNullable<ReturnType<typeof resolveOsGenerate>>, seed: number) =>
    JSON.stringify(gen(createRng(seed)).question)

  it('mehrere Quellen: deterministisch je Seed und beide Quellen kommen vor', async () => {
    await withMapping({ sources: ['lb1-addition', 'lb1-subtraktion'] }, (resolve) => {
      const gen = resolve()!
      expect(gen).toBeDefined()
      const a = Array.from({ length: 40 }, (_, i) => fingerprint(gen, i + 1))
      const b = Array.from({ length: 40 }, (_, i) => fingerprint(resolve()!, i + 1))
      expect(a).toEqual(b)
      const add = a.filter((q) => q.includes('+')).length
      const sub = a.filter((q) => q.includes('−') || q.includes('-')).length
      expect(add).toBeGreaterThan(0)
      expect(sub).toBeGreaterThan(0)
    })
  })

  it('klassenqualifizierte Quelle löst die K6-Variante auf', async () => {
    const catalog = await gymGeneratorCatalog()
    await withMapping({ sources: ['mathematik-klasse-6:lb4-volumen-quader'] }, (resolve) => {
      expect(resolve()).toBe(catalog.get('mathematik-klasse-6:lb4-volumen-quader'))
    })
  })

  it('maxDifficulty filtert Quellen; bleibt nichts übrig, bleibt das Thema Outline', async () => {
    await gymGeneratorCatalog()
    const hard = [...ambiguousCatalogIds().keys()] // nur um Katalog zu laden
    expect(hard.length).toBeGreaterThan(0)
    const catalog = await gymGeneratorCatalog()
    const diff3 = [...catalog.keys()].find((k) => isQualifiedRef(k) && catalogEntryMeta(k)?.difficulty === 3)
    const diff1 = [...catalog.keys()].find((k) => isQualifiedRef(k) && catalogEntryMeta(k)?.difficulty === 1)
    expect(diff3, 'ein difficulty-3-Master existiert').toBeDefined()
    expect(diff1, 'ein difficulty-1-Master existiert').toBeDefined()
    await withMapping({ sources: [diff3!], maxDifficulty: 2 }, (resolve) => {
      expect(resolve()).toBeUndefined()
    })
    await withMapping({ sources: [diff3!, diff1!], maxDifficulty: 2 }, (resolve) => {
      expect(resolve()).toBe(catalog.get(diff1!))
    })
    await withMapping({ sources: [diff3!], maxDifficulty: 3 }, (resolve) => {
      expect(resolve()).toBe(catalog.get(diff3!))
    })
  })

  it('Custom allein bleibt Custom; Custom + Quellen werden gemischt', async () => {
    const custom = OS_CUSTOM_GENERATORS['os-k5-lb3-koordinaten']!
    await withMapping({ sources: [] }, (resolve) => expect(resolve()).toBe(custom), custom)
    await withMapping(
      { sources: ['lb3-koordinaten-eintragen'] },
      (resolve) => {
        const gen = resolve()!
        expect(gen).not.toBe(custom)
        const qs = new Set(Array.from({ length: 30 }, (_, i) => fingerprint(gen, i + 1)))
        expect(qs.size).toBeGreaterThan(1)
      },
      custom,
    )
    // gefilterte Quellen + Custom → nur Custom
    const catalog = await gymGeneratorCatalog()
    const diff3 = [...catalog.keys()].find((k) => isQualifiedRef(k) && catalogEntryMeta(k)?.difficulty === 3)!
    await withMapping({ sources: [diff3], maxDifficulty: 1 }, (resolve) => expect(resolve()).toBe(custom), custom)
  })

  it('String-Maps (Alt-Format) lösen unverändert auf', async () => {
    const catalog = await gymGeneratorCatalog()
    expect(resolveOsGenerate('os-k5-lb1-addition', catalog)).toBe(catalog.get('lb1-addition'))
    expect(mappingForTopic('os-k5-lb1-addition')).toEqual({ sources: ['lb1-addition'] })
  })
})

