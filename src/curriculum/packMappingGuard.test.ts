/**
 * Guard-Tests für die Mappings der Lehrplan-Packs (Master-Quellen, 1:n, Schwierigkeit).
 *
 * Strikt: Verstöße außerhalb von `KNOWN_BEFORE_E5` lassen den Test scheitern, und
 * `KNOWN_BEFORE_E5`-Einträge, die nicht mehr auftreten, ebenfalls (Liste schrumpft nur).
 * E5 ersetzt die String-Maps durch `*_TOPIC_MAPPINGS` und muss die Liste leeren.
 * Die Prüflogik steht in `packMappingChecks.ts`; Negativ-Kontrollen speisen sie mit
 * injizierten Mappings.
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { buildGymSachsenAnhaltPack } from './gymSachsenAnhaltPack'
import { blendIndex } from './mergeNeu'
import {
  ambiguousCatalogIds,
  catalogEntryMeta,
  gymGeneratorCatalog,
  isPlayableOfficialTopic,
  mappingForTopic,
  OS_CUSTOM_GENERATORS,
  OS_TOPIC_MAPPINGS,
  resolveOsGenerate,
} from './oberschuleGenerators'
import { allOfficialTopics, buildOberschuleHsPack, buildOberschuleRsPack } from './oberschulePacks'
import type { PackTopic } from './pack'
import { DEFAULT_DIFFICULTY, isQualifiedRef, type PackTopicMapping } from './packMapping'
import { KNOWN_BEFORE_E5 } from './packMappingBaseline'
import {
  checkSources,
  diffBaseline,
  findAmbiguous,
  findHsDifficulty3,
  findRepeats,
  mastersWithoutDifficulty,
  type CheckPack,
} from './packMappingChecks'
import {
  buildSekundarschuleSachsenAnhaltHsPack,
  buildSekundarschuleSachsenAnhaltRsPack,
} from './sekundarschuleSachsenAnhaltPack'
import { resolveTasksPerRound } from './tasksPerRound'
import { buildUniqueTaskRoundWithSeeds } from './uniqueRound'

interface PackUnderTest extends CheckPack {
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

const sorted = (xs: Iterable<string>) => [...xs].sort()

/** Aktuelle Verstöße müssen exakt der Baseline entsprechen (neue und veraltete Einträge scheitern). */
function expectBaseline(kind: string, actual: string[]) {
  const { added, stale } = diffBaseline(KNOWN_BEFORE_E5[kind] ?? [], actual)
  expect(added, `${kind}: neue Verstöße`).toEqual([])
  expect(
    stale,
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

  it('qualifizierte Katalog-Schlüssel sind eindeutig (kein Master-Thema doppelt je Klasse)', async () => {
    const { bundledCurricula } = await import('./bundled')
    const seen = new Map<string, number>()
    for (const mod of bundledCurricula) {
      const grade = await mod.load()
      for (const area of grade.areas) {
        for (const t of area.topics) {
          const key = `${mod.id}:${t.id}`
          seen.set(key, (seen.get(key) ?? 0) + 1)
        }
      }
    }
    expect([...seen].filter(([, n]) => n > 1).map(([k]) => k)).toEqual([])
  })

  it('Master ohne difficulty (informativ; gelten als 2)', async () => {
    const catalog = await gymGeneratorCatalog()
    const none = mastersWithoutDifficulty(catalog)
    console.info(`[packMapping] Master-Themen ohne difficulty (gelten als ${DEFAULT_DIFFICULTY}): ${none.length}`)
    expect(none.length).toBeGreaterThanOrEqual(0)
  })

  for (const pack of PACKS) {
    describe(pack.id, () => {
      it('(a) jede Quelle löst auf; maxDifficulty lässt keine leeren Themen zurück', async () => {
        const catalog = await gymGeneratorCatalog()
        expect(checkSources(pack, mappingForTopic, catalog)).toEqual([])
      })

      it('(b) kein Master-Thema doppelt im Pack (außer allowRepeat mit note); kein veraltetes allowRepeat', async () => {
        await gymGeneratorCatalog()
        const { repeats, staleAllowRepeat } = findRepeats(pack, mappingForTopic)
        expect(staleAllowRepeat).toEqual([])
        expectBaseline(`repeat:${pack.id}`, repeats)
      })

      it('(d) Hauptschul-Pack: keine Quelle mit difficulty 3 ohne difficultyReason', async () => {
        await gymGeneratorCatalog()
        expectBaseline(`difficulty3:${pack.id}`, findHsDifficulty3(pack, mappingForTopic))
      })

      it('(e) keine mehrdeutige einfache Master-ID als Quelle', async () => {
        await gymGeneratorCatalog()
        expectBaseline(`ambiguous:${pack.id}`, findAmbiguous(pack, mappingForTopic))
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

describe('Negativ-Kontrollen: die Guards schlagen bei injizierten Verstößen an', () => {
  const lookupOf =
    (map: Record<string, PackTopicMapping>) =>
    (id: string): PackTopicMapping | undefined =>
      map[id]
  const fake = (ids: string[], hs = false): CheckPack => ({
    id: 'fake',
    hs,
    topics: ids.map((id) => ({ id })),
  })
  const findDiff3 = (catalog: Map<string, unknown>) =>
    [...catalog.keys()].find((k) => isQualifiedRef(k) && catalogEntryMeta(k)?.difficulty === 3)!

  it('(a) fehlende Quelle', async () => {
    const catalog = await gymGeneratorCatalog()
    const out = checkSources(fake(['t']), lookupOf({ t: { sources: ['gibt-es-nicht'] } }), catalog)
    expect(out.join('|')).toContain('Quelle fehlt gibt-es-nicht')
  })

  it('(a) durch maxDifficulty geleerte Quelle', async () => {
    const catalog = await gymGeneratorCatalog()
    const out = checkSources(
      fake(['t']),
      lookupOf({ t: { sources: [findDiff3(catalog)], maxDifficulty: 2 } }),
      catalog,
    )
    expect(out.join('|')).toContain('bliebe Outline')
  })

  it('(a) allowRepeat ohne note', async () => {
    const catalog = await gymGeneratorCatalog()
    const out = checkSources(
      fake(['t']),
      lookupOf({ t: { sources: ['lb1-addition'], allowRepeat: true } }),
      catalog,
    )
    expect(out.join('|')).toContain('allowRepeat ohne note')
  })

  it('(b) doppelter Master; allowRepeat mit note erlaubt ihn; stale allowRepeat wird gemeldet', async () => {
    await gymGeneratorCatalog()
    const dup = lookupOf({ a: { sources: ['lb1-addition'] }, b: { sources: ['lb1-addition'] } })
    expect(findRepeats(fake(['a', 'b']), dup).repeats).toHaveLength(1)

    const allowed = lookupOf({
      a: { sources: ['lb1-addition'] },
      b: { sources: ['lb1-addition'], allowRepeat: true, note: 'LP verlangt Wiederholung' },
    })
    const ok = findRepeats(fake(['a', 'b']), allowed)
    expect(ok.repeats).toEqual([])
    expect(ok.staleAllowRepeat).toEqual([])

    const stale = lookupOf({
      a: { sources: ['lb1-addition'] },
      b: { sources: ['lb1-subtraktion'], allowRepeat: true, note: 'x' },
    })
    expect(findRepeats(fake(['a', 'b']), stale).staleAllowRepeat).toHaveLength(1)
  })

  it('(b) einfache und qualifizierte Form desselben Masters zählen als Wiederholung', async () => {
    await gymGeneratorCatalog()
    const key = ambiguousCatalogIds().get('lb4-volumen-quader')![0]!
    const m = lookupOf({ a: { sources: ['lb4-volumen-quader'] }, b: { sources: [key] } })
    expect(findRepeats(fake(['a', 'b']), m).repeats).toHaveLength(1)
  })

  it('(e) mehrdeutige einfache ID; qualifizierte Form ist erlaubt', async () => {
    await gymGeneratorCatalog()
    expect(findAmbiguous(fake(['t']), lookupOf({ t: { sources: ['lb4-volumen-quader'] } }))).toHaveLength(1)
    expect(
      findAmbiguous(
        fake(['t']),
        lookupOf({ t: { sources: ['mathematik-klasse-6:lb4-volumen-quader'] } }),
      ),
    ).toEqual([])
  })

  it('(d) difficulty 3 im HS-Pack: nur mit difficultyReason (note genügt nicht) oder maxDifficulty < 3', async () => {
    const catalog = await gymGeneratorCatalog()
    const d3 = findDiff3(catalog)
    const pack = fake(['t'], true)
    expect(findHsDifficulty3(pack, lookupOf({ t: { sources: [d3] } }))).toHaveLength(1)
    expect(findHsDifficulty3(pack, lookupOf({ t: { sources: [d3], note: 'egal' } }))).toHaveLength(1)
    expect(
      findHsDifficulty3(pack, lookupOf({ t: { sources: [d3], difficultyReason: 'Differenzierung' } })),
    ).toEqual([])
    expect(findHsDifficulty3(pack, lookupOf({ t: { sources: [d3], maxDifficulty: 2 } }))).toEqual([])
    // Nicht-HS-Pack wird nicht geprüft
    expect(findHsDifficulty3(fake(['t'], false), lookupOf({ t: { sources: [d3] } }))).toEqual([])
  })

  it('expectBaseline: neuer Verstoß und veralteter Baseline-Eintrag schlagen an', () => {
    expect(diffBaseline(['a'], ['a', 'b'])).toEqual({ added: ['b'], stale: [] })
    expect(diffBaseline(['a', 'c'], ['a'])).toEqual({ added: [], stale: ['c'] })
    expect(diffBaseline(['a'], ['a'])).toEqual({ added: [], stale: [] })
  })
})

describe('Resolver: 1:n, maxDifficulty, Custom, isPlayable', () => {
  const T = '__test-topic'
  const withMapping = async (
    mapping: PackTopicMapping | null,
    run: (resolve: () => ReturnType<typeof resolveOsGenerate>) => void,
    custom?: (typeof OS_CUSTOM_GENERATORS)[string],
  ) => {
    const catalog = await gymGeneratorCatalog()
    if (mapping) OS_TOPIC_MAPPINGS[T] = mapping
    if (custom) OS_CUSTOM_GENERATORS[T] = custom
    try {
      run(() => resolveOsGenerate(T, catalog))
    } finally {
      delete OS_TOPIC_MAPPINGS[T]
      delete OS_CUSTOM_GENERATORS[T]
    }
  }
  const taskJson = (gen: NonNullable<ReturnType<typeof resolveOsGenerate>>, seed: number) =>
    JSON.stringify(gen(createRng(seed)))

  it('mehrere Quellen: je Seed exakt die per blendIndex gewählte Quelle (gleiche Gewichte)', async () => {
    const catalog = await gymGeneratorCatalog()
    const gens = ['lb1-addition', 'lb1-subtraktion'].map((id) => catalog.get(id)!)
    await withMapping({ sources: ['lb1-addition', 'lb1-subtraktion'] }, (resolve) => {
      const gen = resolve()!
      const picked = new Set<number>()
      for (let seed = 1; seed <= 40; seed++) {
        const rng = createRng(seed)
        const idx = blendIndex([1, 1], rng)
        picked.add(idx)
        expect(taskJson(gen, seed), `seed ${seed}`).toBe(JSON.stringify(gens[idx]!(rng)))
        expect(taskJson(resolve()!, seed)).toBe(taskJson(gen, seed))
      }
      expect(picked.size).toBe(2)
    })
  })

  it('klassenqualifizierte Quelle löst die K6-Variante auf', async () => {
    const catalog = await gymGeneratorCatalog()
    await withMapping({ sources: ['mathematik-klasse-6:lb4-volumen-quader'] }, (resolve) => {
      expect(resolve()).toBe(catalog.get('mathematik-klasse-6:lb4-volumen-quader'))
    })
  })

  it('maxDifficulty filtert Quellen; bleibt nichts übrig, bleibt das Thema Outline', async () => {
    const catalog = await gymGeneratorCatalog()
    const diff3 = [...catalog.keys()].find((k) => isQualifiedRef(k) && catalogEntryMeta(k)?.difficulty === 3)
    const diff1 = [...catalog.keys()].find((k) => isQualifiedRef(k) && catalogEntryMeta(k)?.difficulty === 1)
    expect(diff3, 'ein difficulty-3-Master existiert').toBeDefined()
    expect(diff1, 'ein difficulty-1-Master existiert').toBeDefined()
    await withMapping({ sources: [diff3!], maxDifficulty: 2 }, (resolve) => {
      expect(resolve()).toBeUndefined()
      expect(isPlayableOfficialTopic(T, catalog)).toBe(false)
    })
    await withMapping({ sources: [diff3!, diff1!], maxDifficulty: 2 }, (resolve) => {
      expect(resolve()).toBe(catalog.get(diff1!))
    })
    await withMapping({ sources: [diff3!], maxDifficulty: 3 }, (resolve) => {
      expect(resolve()).toBe(catalog.get(diff3!))
    })
  })

  it('fehlende difficulty gilt als 2 (Meta temporär geleert; aktuell hat jeder Master eine difficulty)', async () => {
    const catalog = await gymGeneratorCatalog()
    const key = 'mathematik-klasse-5:lb1-addition'
    const meta = catalogEntryMeta(key)!
    const original = meta.difficulty
    meta.difficulty = undefined
    try {
      expect(DEFAULT_DIFFICULTY).toBe(2)
      await withMapping({ sources: [key], maxDifficulty: 1 }, (resolve) => {
        expect(resolve()).toBeUndefined()
      })
      await withMapping({ sources: [key], maxDifficulty: 2 }, (resolve) => {
        expect(resolve()).toBe(catalog.get(key))
      })
      expect(mastersWithoutDifficulty(catalog)).toContain(key)
    } finally {
      meta.difficulty = original
    }
  })

  it('Custom gewinnt allein (Standard); mit includeCustom wird gemischt', async () => {
    const custom = OS_CUSTOM_GENERATORS['os-k5-lb3-koordinaten']!
    const catalog = await gymGeneratorCatalog()
    await withMapping({ sources: [] }, (resolve) => expect(resolve()).toBe(custom), custom)
    // Standard: Quellen werden ignoriert, Custom läuft allein
    await withMapping(
      { sources: ['lb3-koordinaten-eintragen'] },
      (resolve) => expect(resolve()).toBe(custom),
      custom,
    )
    // includeCustom: Mischung aus Custom und Quelle
    await withMapping(
      { sources: ['lb3-koordinaten-eintragen'], includeCustom: true },
      (resolve) => {
        const gen = resolve()!
        expect(gen).not.toBe(custom)
        const src = catalog.get('lb3-koordinaten-eintragen')!
        const used = new Set<string>()
        for (let seed = 1; seed <= 40; seed++) {
          const rng = createRng(seed)
          const idx = blendIndex([1, 1], rng)
          used.add(String(idx))
          expect(taskJson(gen, seed)).toBe(JSON.stringify((idx === 0 ? custom : src)(rng)))
        }
        expect(used.size).toBe(2)
      },
      custom,
    )
    // includeCustom, aber alle Quellen gefiltert → nur Custom
    const diff3 = [...catalog.keys()].find((k) => isQualifiedRef(k) && catalogEntryMeta(k)?.difficulty === 3)!
    await withMapping(
      { sources: [diff3], maxDifficulty: 1, includeCustom: true },
      (resolve) => expect(resolve()).toBe(custom),
      custom,
    )
  })

  it('allowRepeat ändert die Auflösung nicht (nur Guard (b) liest es)', async () => {
    const catalog = await gymGeneratorCatalog()
    await withMapping({ sources: ['lb1-addition'], allowRepeat: true, note: 'LP: Wiederholung' }, (resolve) => {
      expect(resolve()).toBe(catalog.get('lb1-addition'))
    })
  })

  it('String-Maps (Alt-Format) lösen unverändert auf', async () => {
    const catalog = await gymGeneratorCatalog()
    expect(resolveOsGenerate('os-k5-lb1-addition', catalog)).toBe(catalog.get('lb1-addition'))
    expect(mappingForTopic('os-k5-lb1-addition')).toEqual({ sources: ['lb1-addition'] })
  })

  it('isPlayableOfficialTopic stimmt mit dem Resolver überein (Randfälle)', async () => {
    const catalog = await gymGeneratorCatalog()
    const agree = () =>
      expect(isPlayableOfficialTopic(T, catalog)).toBe(resolveOsGenerate(T, catalog) !== undefined)
    // alle Quellen fehlen
    await withMapping({ sources: ['gibt-es-nicht'] }, () => {
      agree()
      expect(isPlayableOfficialTopic(T, catalog)).toBe(false)
    })
    // sources: [] ersetzt einen Alt-Eintrag → Outline
    const { OS_GENERATOR_MAP } = await import('./oberschuleGenerators')
    OS_GENERATOR_MAP[T] = 'lb1-addition'
    try {
      expect(isPlayableOfficialTopic(T, catalog)).toBe(true)
      await withMapping({ sources: [] }, () => {
        agree()
        expect(isPlayableOfficialTopic(T, catalog)).toBe(false)
      })
    } finally {
      delete OS_GENERATOR_MAP[T]
    }
    // Custom + nur gefilterte Quellen → spielbar via Custom
    const custom = OS_CUSTOM_GENERATORS['os-k5-lb3-koordinaten']!
    await withMapping({ sources: ['gibt-es-nicht'], includeCustom: true }, () => {
      agree()
      expect(isPlayableOfficialTopic(T, catalog)).toBe(true)
    }, custom)
    // reale Alt-Themen
    for (const pack of PACKS)
      for (const t of pack.topics) {
        expect(isPlayableOfficialTopic(t.id, catalog), t.id).toBe(resolveOsGenerate(t.id, catalog) !== undefined)
      }
  })
})
