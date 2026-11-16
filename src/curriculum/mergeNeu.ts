/**
 * Mathe: `__neu`-Themen in ihre Haupt-Themen (Parent) auflösen.
 *
 * - Das Neu-Thema verschwindet; sein Generator wird per `blendGenerators` mit dem
 *   Parent-Generator gemischt (deterministisch je Seed, nur über den übergebenen rng).
 * - Der Parent bleibt primär (Titel, Hinweis, Fachwissen-Text, `released`); nur neue
 *   Fachwissen-Aspekte, Schlagwörter und `fachwissen.explore` des Neu-Themas kommen dazu.
 * - Alte IDs (`<parent>__neu`) werden über `legacyNeuIdToParent` / `findTopicWithLegacy`
 *   auf den Parent abgebildet (alte Klausur-Codes, Challenges, Fehlerberichte, Protokolle).
 *
 * Die Generatoren selbst werden nicht verändert.
 */
import type { Rng } from '../lib/rng'
import type { Fachwissen, Task, Topic, TopicArea } from './types'

export const NEU_ID_SUFFIX = '__neu'

/** `lb1-addition__neu` → `lb1-addition`; andere IDs bleiben unverändert. */
export function legacyNeuIdToParent(id: string): string {
  return id.endsWith(NEU_ID_SUFFIX) ? id.slice(0, -NEU_ID_SUFFIX.length) : id
}

/**
 * Thema per ID in Bereichen finden. Exakter Treffer zuerst; sonst Fallback
 * `<parent>__neu` → `<parent>` (Neu-Themen existieren nach dem Merge nicht mehr).
 */
export function findTopicWithLegacy<A extends { topics: Topic[] }>(
  areas: readonly A[],
  topicId: string,
): { topic: Topic; area: A } | null {
  for (const area of areas) {
    const topic = area.topics.find((t) => t.id === topicId)
    if (topic) return { topic, area }
  }
  const parentId = legacyNeuIdToParent(topicId)
  if (parentId === topicId) return null
  for (const area of areas) {
    const topic = area.topics.find((t) => t.id === parentId)
    if (topic) return { topic, area }
  }
  return null
}

/** Alte `__neu`-IDs einer Liste auf Parents abbilden und Duplikate entfernen (Reihenfolge bleibt). */
export function normalizeLegacyTopicIds(ids: readonly string[]): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const id of ids) {
    const mapped = legacyNeuIdToParent(id)
    if (seen.has(mapped)) continue
    seen.add(mapped)
    out.push(mapped)
  }
  return out
}

export interface BlendPart {
  gen: (rng: Rng) => Task
  weight: number
}

/**
 * Wählt den Index einer Quelle gewichtet. Verbraucht genau EINEN rng-Wert, damit
 * der Aufrufer (und Tests) die Wahl für einen Seed exakt nachvollziehen können.
 */
export function blendIndex(weights: readonly number[], rng: Rng): number {
  const total = weights.reduce((sum, w) => sum + Math.max(0, w), 0)
  if (total <= 0) return 0
  let r = rng() * total
  for (let i = 0; i < weights.length; i++) {
    r -= Math.max(0, weights[i]!)
    if (r < 0) return i
  }
  return weights.length - 1
}

/** Mischt mehrere Generatoren gewichtet; deterministisch je Seed (nur `rng`). */
export function blendGenerators(parts: readonly BlendPart[]): (rng: Rng) => Task {
  if (parts.length === 0) throw new Error('blendGenerators: mindestens eine Quelle nötig')
  const weights = parts.map((p) => p.weight)
  return (rng) => parts[blendIndex(weights, rng)]!.gen(rng)
}

export interface NeuBlendWeights {
  /** Gewicht des bisherigen (Parent-)Generators. */
  old: number
  /** Gewicht des ehemaligen Neu-Generators. */
  neu: number
}

/**
 * Themenspezifische Gewichte (Schlüssel = Parent-ID). Standard 1:1.
 * Nur eintragen, wenn eine Seite einen sehr kleinen Unique-Pool hat
 * (Messung siehe `mergeNeu.test.ts` / Bericht Task E1).
 */
export const NEU_BLEND_OVERRIDES: Readonly<Record<string, NeuBlendWeights>> = {
  // Parent-Pool ≤ 4 eindeutige Aufgaben (Neu-Pool ≥ 60): Parent-Seite 3:1 gewichten,
  // damit der kleine Pool pro Runde möglichst ausgeschöpft wird (Anteil sonst ~23–25 %).
  'lb1-schriftliches-rechnen': { old: 3, neu: 1 },
  'lb1-schriftliche-division': { old: 3, neu: 1 },
  'lb3-koordinaten-ablesen': { old: 3, neu: 1 },
  'lb3-strecken-bezeichnung': { old: 3, neu: 1 },
  'k10-lb2-erwartungswert-wuerfel': { old: 3, neu: 1 },
}

export const DEFAULT_NEU_BLEND_WEIGHTS: NeuBlendWeights = { old: 1, neu: 1 }

export function neuBlendWeights(parentId: string): NeuBlendWeights {
  return NEU_BLEND_OVERRIDES[parentId] ?? DEFAULT_NEU_BLEND_WEIGHTS
}

/* ------------------------------ Fachwissen ------------------------------ */

const normSentence = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9äöüß ]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/** Satzgrenzen; Abkürzungen wie „z. B.“ / „d. h.“ trennen nicht. */
export const splitSentences = (text: string): string[] =>
  text
    .replace(/(\b[a-zäöü])\.\s(?=[a-zäöüA-ZÄÖÜ]\.)/g, '$1.\u0001')
    .split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ„"(])/)
    .map((x) => x.replace(/\u0001/g, ' ').trim())
    .filter(Boolean)

const wordSet = (s: string): Set<string> =>
  new Set(normSentence(s).split(' ').filter((w) => w.length > 2))

/** Satz gilt als Dopplung, wenn er (fast) im Parent-Text steckt. */
function isDuplicateSentence(sentence: string, parentNorm: string, parentSentences: string[]): boolean {
  const n = normSentence(sentence)
  if (!n) return true
  if (parentNorm.includes(n)) return true
  const words = wordSet(sentence)
  if (words.size === 0) return false
  for (const p of parentSentences) {
    const pw = wordSet(p)
    if (pw.size === 0) continue
    let common = 0
    for (const w of words) if (pw.has(w)) common++
    const jaccard = common / (words.size + pw.size - common)
    if (jaccard >= 0.7) return true
  }
  return false
}

export function mergeFachwissen(
  parent: Fachwissen | undefined,
  neu: Fachwissen | undefined,
): Fachwissen | undefined {
  if (!neu) return parent
  if (!parent) return neu
  const parentSentences = splitSentences(parent.text)
  const parentNorm = normSentence(parent.text)
  const extra: string[] = []
  const extraNorm: string[] = []
  for (const sentence of splitSentences(neu.text)) {
    if (isDuplicateSentence(sentence, parentNorm, parentSentences)) continue
    if (isDuplicateSentence(sentence, extraNorm.join(' '), extra)) continue
    extra.push(sentence)
    extraNorm.push(normSentence(sentence))
  }
  const text = extra.length > 0 ? `${parent.text.trim()} ${extra.join(' ')}` : parent.text
  const explore = parent.explore ?? neu.explore
  const quelle = parent.quelle ?? neu.quelle
  const url = parent.url ?? neu.url
  return {
    ...parent,
    text,
    ...(quelle ? { quelle } : {}),
    ...(url ? { url } : {}),
    ...(explore ? { explore } : {}),
  }
}

/* ------------------------------- Merge -------------------------------- */

const NEU_ONLY_KEYWORDS = new Set(['neu', 'prüfung'])

function mergeKeywords(parent: Topic, neu: Topic): string[] | undefined {
  const out: string[] = []
  const seen = new Set<string>()
  const add = (kw: string) => {
    const key = kw.trim().toLowerCase()
    if (!key || seen.has(key) || NEU_ONLY_KEYWORDS.has(key)) return
    if (key === parent.id.toLowerCase() || key === neu.id.toLowerCase()) return
    seen.add(key)
    out.push(kw)
  }
  for (const kw of parent.keywords ?? []) add(kw)
  for (const kw of neu.keywords ?? []) add(kw)
  return out.length > 0 ? out : undefined
}

export interface BlendSources {
  old: (rng: Rng) => Task
  neu: (rng: Rng) => Task
  weights: NeuBlendWeights
}

const BLEND_SOURCES = new WeakMap<object, BlendSources>()

/** Ursprüngliche Generatoren eines gemergten Themas (für Pool-/Anteils-Messungen in Tests). */
export function blendSourcesOf(topic: Topic): BlendSources | undefined {
  return BLEND_SOURCES.get(topic.generate)
}

export function mergeNeuTopic(parent: Topic, neu: Topic): Topic {
  const w = neuBlendWeights(parent.id)
  const generate = blendGenerators([
    { gen: parent.generate, weight: w.old },
    { gen: neu.generate, weight: w.neu },
  ])
  BLEND_SOURCES.set(generate, { old: parent.generate, neu: neu.generate, weights: w })
  const fachwissen = mergeFachwissen(parent.fachwissen, neu.fachwissen)
  const keywords = mergeKeywords(parent, neu)
  return {
    ...parent,
    ...(parent.hint ? {} : neu.hint ? { hint: neu.hint } : {}),
    ...(parent.difficulty ? {} : neu.difficulty ? { difficulty: neu.difficulty } : {}),
    ...(keywords ? { keywords } : {}),
    ...(fachwissen ? { fachwissen } : {}),
    generate,
  }
}

/**
 * Löst alle Neu-Themen in ihre Parents auf. Parent = `neu.reviewOf` (in irgendeinem
 * Bereich der Klassenstufe). Neu-Themen ohne Parent → Fehler (kein stilles Verwerfen).
 * Gibt neue Bereiche zurück; die Eingaben werden nicht verändert.
 */
export function mergeNeuIntoParents(
  areas: readonly TopicArea[],
  neuTopics: readonly Topic[],
): TopicArea[] {
  const neuByParent = new Map<string, Topic>()
  for (const neu of neuTopics) {
    const parentId = neu.reviewOf ?? legacyNeuIdToParent(neu.id)
    if (neuByParent.has(parentId)) {
      throw new Error(`mergeNeuIntoParents: mehrere Neu-Themen für Parent „${parentId}“`)
    }
    neuByParent.set(parentId, neu)
  }
  const existing = new Set(areas.flatMap((a) => a.topics.map((t) => t.id)))
  const orphans = [...neuByParent.keys()].filter((id) => !existing.has(id))
  if (orphans.length > 0) {
    throw new Error(`mergeNeuIntoParents: Neu-Themen ohne Parent: ${orphans.join(', ')}`)
  }
  return areas.map((area) => ({
    ...area,
    topics: area.topics.map((topic) => {
      const neu = neuByParent.get(topic.id)
      return neu ? mergeNeuTopic(topic, neu) : topic
    }),
  }))
}
