/**
 * Reine Prüffunktionen für die Pack-Mapping-Guards (`packMappingGuard.test.ts`).
 * Sie nehmen Mappings über `lookup` entgegen, damit Negativ-Kontrollen
 * Mappings injizieren können. Der Katalog muss geladen sein (`gymGeneratorCatalog()`).
 */
import { DEFAULT_DIFFICULTY, type PackTopicMapping } from './packMapping'
import {
  ambiguousCatalogIds,
  catalogEntryMeta,
  OS_CUSTOM_GENERATORS,
  resolveSources,
} from './oberschuleGenerators'
import type { Topic } from './types'
import { createRng } from '../lib/rng'
import { resolveTasksPerRound } from './tasksPerRound'
import { buildUniqueTaskRoundWithSeeds } from './uniqueRound'

export interface CheckPack {
  id: string
  /** Hauptschul-Profil: difficulty 3 braucht `difficultyReason`. */
  hs: boolean
  topics: ReadonlyArray<{ id: string }>
}
export type MappingLookup = (topicId: string) => PackTopicMapping | undefined

const mapped = (pack: CheckPack, lookup: MappingLookup) =>
  pack.topics.flatMap((topic) => {
    const mapping = lookup(topic.id)
    return mapping ? [{ id: topic.id, mapping }] : []
  })

/** (a) Quellen lösen auf, maxDifficulty leert kein Thema, allowRepeat hat note. */
export function checkSources(
  pack: CheckPack,
  lookup: MappingLookup,
  catalog: Map<string, Topic['generate']>,
): string[] {
  const problems: string[] = []
  for (const { id, mapping } of mapped(pack, lookup)) {
    const res = resolveSources(mapping, catalog)
    for (const ref of res.missing) problems.push(`${id}: Quelle fehlt ${ref}`)
    const playsViaCustom = Boolean(OS_CUSTOM_GENERATORS[id])
    if (mapping.sources.length > 0 && res.gens.length === 0 && !playsViaCustom) {
      problems.push(`${id}: alle Quellen durch maxDifficulty/Fehlen entfernt (bliebe Outline)`)
    }
    if (mapping.allowRepeat && !mapping.note) problems.push(`${id}: allowRepeat ohne note`)
  }
  return problems
}

const keyOf = (ref: string) => catalogEntryMeta(ref)?.key ?? ref

/** (b) Master doppelt im Pack; zusätzlich veraltetes `allowRepeat`. */
export function findRepeats(
  pack: CheckPack,
  lookup: MappingLookup,
): { repeats: string[]; staleAllowRepeat: string[] } {
  const users = new Map<string, Array<{ id: string; allowed: boolean }>>()
  const entries = mapped(pack, lookup)
  for (const { id, mapping } of entries) {
    const allowed = Boolean(mapping.allowRepeat && mapping.note)
    for (const ref of new Set(mapping.sources)) {
      const key = keyOf(ref)
      users.set(key, [...(users.get(key) ?? []), { id, allowed }])
    }
  }
  // Ein Master darf wiederholt werden, wenn höchstens EIN Nutzer kein allowRepeat trägt.
  const repeats = [...users]
    .filter(([, u]) => u.length > 1 && u.filter((x) => !x.allowed).length > 1)
    .map(([key, u]) => `${pack.id}: ${key} <- ${u.map((x) => x.id).sort().join(', ')}`)
  const staleAllowRepeat = entries
    .filter(({ mapping }) => mapping.allowRepeat)
    .filter(({ mapping }) => ![...new Set(mapping.sources)].some((r) => (users.get(keyOf(r))?.length ?? 0) > 1))
    .map(({ id }) => `${pack.id}: ${id} (allowRepeat ohne tatsächliche Wiederholung)`)
  return { repeats, staleAllowRepeat }
}

/** (d) HS: difficulty-3-Quelle ohne `difficultyReason` (und nicht durch maxDifficulty < 3 gefiltert). */
export function findHsDifficulty3(pack: CheckPack, lookup: MappingLookup): string[] {
  if (!pack.hs) return []
  const bad: string[] = []
  for (const { id, mapping } of mapped(pack, lookup)) {
    if (mapping.difficultyReason) continue
    for (const ref of mapping.sources) {
      const diff = catalogEntryMeta(ref)?.difficulty ?? DEFAULT_DIFFICULTY
      if (diff === 3 && !(mapping.maxDifficulty && mapping.maxDifficulty < 3)) {
        bad.push(`${pack.id}: ${id} -> ${ref}`)
      }
    }
  }
  return bad
}

/** (e) Mehrdeutige einfache Master-ID als Quelle. */
export function findAmbiguous(pack: CheckPack, lookup: MappingLookup): string[] {
  const ambiguous = ambiguousCatalogIds()
  return mapped(pack, lookup).flatMap(({ id, mapping }) =>
    mapping.sources.filter((r) => ambiguous.has(r)).map((r) => `${pack.id}: ${id} -> ${r}`),
  )
}

/** Baseline-Vergleich: neue Verstöße und veraltete Baseline-Einträge. */
export function diffBaseline(known: readonly string[], actual: readonly string[]) {
  const k = new Set(known)
  const a = new Set(actual)
  return {
    added: [...a].filter((v) => !k.has(v)).sort(),
    stale: [...k].filter((v) => !a.has(v)).sort(),
  }
}

/** Master-Themen ohne `difficulty` (informativ; gelten als `DEFAULT_DIFFICULTY`). */
export function mastersWithoutDifficulty(catalog: Map<string, Topic['generate']>): string[] {
  return [...catalog.keys()]
    .filter((k) => k.includes(':'))
    .filter((k) => catalogEntryMeta(k)?.difficulty === undefined)
    .sort()
}

/** (c) Themen, deren Runde über `seeds` Seeds die Soll-Länge (10 oder `tasksPerRound`) verfehlt. */
export function findShortRounds(
  topics: ReadonlyArray<{ id: string; tasksPerRound?: number }>,
  resolveGen: (topicId: string) => Topic['generate'] | undefined,
  seeds = 30,
): string[] {
  const short: string[] = []
  const seen = new Set<string>()
  for (const topic of topics) {
    if (seen.has(topic.id)) continue
    seen.add(topic.id)
    const gen = resolveGen(topic.id)
    if (!gen) continue
    const want = resolveTasksPerRound(topic)
    let worst = want
    for (let s = 1; s <= seeds; s++) {
      worst = Math.min(worst, buildUniqueTaskRoundWithSeeds(gen, createRng(s * 977), want).length)
    }
    if (worst < want) short.push(`${topic.id}: ${worst}/${want}`)
  }
  return short
}
