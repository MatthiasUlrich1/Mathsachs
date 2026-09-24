/**
 * Bug A — within-topic uniqueness (one concept per round).
 * Bug B — cross-topic isolation (sibling topics share neither stems nor contentIds).
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { BIOLOGIE_GENERATORS } from './biologieGenerators'
import { BIOLOGIE_SPECIAL_GENERATORS } from './biologieSpecialTopics'
import { buildUniqueTaskRound, taskContentIds, normalizeTaskText } from './uniqueRound'

const SIBLING_FAMILIES: string[][] = [
  // K5 vertebrates — the user's Fische example
  [
    'bi-k5-lb2-fische',
    'bi-k5-lb2-fische-merkmale',
    'bi-k5-lb2-fische-lebensraum',
    'bi-k5-lb2-fische-schutz',
  ],
  [
    'bi-k5-lb3-lurche',
    'bi-k5-lb3-lurche-merkmale',
    'bi-k5-lb3-lurche-meta',
    'bi-k5-lb3-lurche-schutz',
  ],
  [
    'bi-k5-lb4-kriechtiere',
    'bi-k5-lb4-kriechtiere-merkmale',
    'bi-k5-lb4-kriechtiere-arten',
  ],
  ['bi-k5-lb5-voegel', 'bi-k5-lb5-voegel-flug', 'bi-k5-lb5-voegel-fortpflanzung'],
  [
    'bi-k5-lb6-saeugetiere',
    'bi-k5-lb6-saeuger-merkmale',
    'bi-k5-lb6-saeuger-angepasst',
    'bi-k5-lb6-saeuger-schutz',
  ],
  ['bi-k5-lb1-merkmale', 'bi-k5-lb1-kennzeichen'],
  ['bi-k5-lb7-systematik', 'bi-k5-lb7-zuordnung'],
  // K6–K10
  [
    'bi-k6-lb1-samenpflanzen',
    'bi-k6-lb1-bluete',
    'bi-k6-lb1-baeume',
    'bi-k6-lb1-organe',
  ],
  ['bi-k6-lb2-wirbellose', 'bi-k6-lb2-insekten', 'bi-k6-lb2-spinnen'],
  ['bi-k6-lb4-wald', 'bi-k6-lb4-nahrung'],
  ['bi-k6-lb5-zellen', 'bi-k6-lb5-mikroskop'],
  ['bi-k7-lb1-mikroben', 'bi-k7-lb1-hygiene'],
  ['bi-k7-lb2-blut', 'bi-k7-lb2-herz', 'bi-k7-lb2-immun'],
  ['bi-k7-lb3-ernaehrung', 'bi-k7-lb3-naehrstoffe', 'bi-k7-lb3-organe'],
  ['bi-k8-lb1-sinne', 'bi-k8-lb1-auge-ohr', 'bi-k8-lb1-hormone'],
  ['bi-k8-lb2-sexualitaet', 'bi-k8-lb2-entwicklung'],
  ['bi-k9-lb1-pflanzen', 'bi-k9-lb1-fotosynthese', 'bi-k9-lb1-wasser'],
  ['bi-k9-lb2-oekosystem', 'bi-k9-lb2-wald-gewaesser', 'bi-k9-lb2-stoffkreis'],
  ['bi-k10-lb1-genetik', 'bi-k10-lb1-mendel', 'bi-k10-lb1-dna'],
  ['bi-k10-lb2-artenvielfalt', 'bi-k10-lb2-selektion'],
  // Oberstufe siblings that must stay distinct
  ['bi-gk11-lb1-zellen', 'bi-gk11-lb1-organellen'],
]

const GENERIC_STEM =
  /^(ordne begriff und erklaerung|ordne zu|ordne zu \d+|welche aussage|richtig oder falsch|karteikarte|tippe|waehle|stimmt die aussage|welcher fachbegriff passt zur erklaerung)/i

function normalizeStem(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function isContentStem(stem: string): boolean {
  if (stem.length < 12) return false
  if (GENERIC_STEM.test(stem)) return false
  // Size-varying Zuordnung chrome — not topic content
  if (/^ordne( zu)?(:)?\s*\d+\s*fachbegriff/i.test(stem)) return false
  if (/klick.?paare/i.test(stem) && /ordne/i.test(stem)) return false
  if (/lebensmerkmale ihren erkl/i.test(stem)) return false
  if (/bau und funktionsbegriff/i.test(stem)) return false
  return true
}

function sampleTopic(topicId: string, n = 100) {
  const gen = BIOLOGIE_GENERATORS[topicId]
  if (!gen) throw new Error(`missing generator: ${topicId}`)
  const stems = new Set<string>()
  const contentIds = new Set<string>()
  for (let seed = 0; seed < n; seed++) {
    const task = gen(createRng(seed * 101 + 7))
    const stem = normalizeStem(task.question)
    if (isContentStem(stem)) stems.add(stem)
    const front = task.interactive?.props?.front
    if (typeof front === 'string' && isContentStem(normalizeStem(front))) {
      stems.add(normalizeStem(front))
    }
    for (const id of task.contentIds ?? []) {
      if (id.trim()) contentIds.add(id.trim())
    }
    if (task.dedupeKey?.trim()) contentIds.add(task.dedupeKey.trim())
  }
  return { stems, contentIds }
}

describe('Bug A — within-topic uniqueness (entire Bio Lehrplan)', () => {
  const ids = Object.keys(BIOLOGIE_GENERATORS)

  it('every playable bio topic has generators', () => {
    expect(ids.length).toBeGreaterThan(80)
  })

  it('every task carries at least one contentId or dedupeKey', () => {
    for (const id of ids) {
      const gen = BIOLOGIE_GENERATORS[id]!
      for (let seed = 0; seed < 12; seed++) {
        const task = gen(createRng(seed * 31 + 5))
        const has =
          (task.contentIds?.some((c) => c.trim()) ?? false) || Boolean(task.dedupeKey?.trim())
        expect(has, `${id}@${seed} missing content identity`).toBe(true)
      }
    }
  })

  it('rounds never repeat content identities (sampled seeds, all topics)', () => {
    for (const id of ids) {
      const gen = BIOLOGIE_GENERATORS[id]!
      for (const seed of [1, 42, 99, 777, 12345]) {
        const round = buildUniqueTaskRound(gen, createRng(seed), 10, 120)
        expect(round.length, `${id} empty round`).toBeGreaterThanOrEqual(1)
        const seen = new Set<string>()
        for (const t of round) {
          for (const cid of taskContentIds(t)) {
            expect(seen.has(cid), `${id} seed=${seed} dup ${cid}`).toBe(false)
            seen.add(cid)
          }
        }
        // Same distinctive non-trivial answer must not appear twice
        const answers = new Set<string>()
        for (const t of round) {
          const a = normalizeTaskText(String(t.solution ?? ''))
          if (a.length < 4) continue
          if (/^(richtig|falsch|ja|nein|ok)$/i.test(a)) continue
          expect(answers.has(a), `${id} seed=${seed} repeated answer "${a}"`).toBe(false)
          answers.add(a)
        }
      }
    }
  })

  it('does not pad rounds when the unique pool is small', () => {
    // Tiny bank: one fact → round length 1, never 10 duplicates
    const tiny = BIOLOGIE_GENERATORS['bi-gk-lbw-energie']
    if (!tiny) return
    const round = buildUniqueTaskRound(tiny, createRng(7), 10, 80)
    expect(round.length).toBeLessThanOrEqual(3)
    const idsRound = round.flatMap(taskContentIds)
    expect(new Set(idsRound).size).toBe(idsRound.length)
  })

  it('Sek-I core topics usually fill ~10 unique tasks (pool expansion, not short rounds)', () => {
    const core = [
      'bi-k5-lb1-merkmale',
      'bi-k5-lb1-kennzeichen',
      'bi-k5-lb2-fische',
      'bi-k5-lb2-fische-merkmale',
      'bi-k6-lb2-spinnen',
      'bi-k6-lb2-insekten',
      'bi-k6-lb2-wirbellose',
      'bi-k7-lb2-herz',
      'bi-k8-lb1-sinne',
      'bi-k9-lb1-fotosynthese',
      'bi-k10-lb1-dna',
    ]
    for (const id of core) {
      const gen = BIOLOGIE_GENERATORS[id]
      if (!gen) continue
      const lens = [1, 42, 99, 777, 12345].map(
        (s) => buildUniqueTaskRound(gen, createRng(s), 10, 140).length,
      )
      const avg = lens.reduce((a, b) => a + b, 0) / lens.length
      expect(avg, `${id} avgLen=${avg} lenses=${lens.join(',')}`).toBeGreaterThanOrEqual(8.5)
      expect(Math.min(...lens), `${id} min=${Math.min(...lens)}`).toBeGreaterThanOrEqual(7)
    }
  })
})

describe('Bug B — cross-topic isolation (sibling families)', () => {
  it('every special-topic id is registered (dedicated, not missing)', () => {
    for (const id of Object.keys(BIOLOGIE_SPECIAL_GENERATORS)) {
      expect(BIOLOGIE_GENERATORS[id], id).toBeTypeOf('function')
    }
  })

  it('Fische Überblick vs Merkmale share neither stems nor contentIds (proof case)', () => {
    const a = sampleTopic('bi-k5-lb2-fische', 120)
    const b = sampleTopic('bi-k5-lb2-fische-merkmale', 120)
    for (const stem of a.stems) {
      expect(b.stems.has(stem), `Fische shared stem: "${stem}"`).toBe(false)
    }
    for (const cid of a.contentIds) {
      expect(b.contentIds.has(cid), `Fische shared contentId: "${cid}"`).toBe(false)
    }
  })

  it('sibling families share neither normalized stems nor contentIds', () => {
    for (const family of SIBLING_FAMILIES) {
      const byTopic = family.map((id) => ({ id, ...sampleTopic(id, 100) }))
      for (let i = 0; i < byTopic.length; i++) {
        for (let j = i + 1; j < byTopic.length; j++) {
          const a = byTopic[i]!
          const b = byTopic[j]!
          for (const stem of a.stems) {
            expect(
              b.stems.has(stem),
              `shared stem between ${a.id} and ${b.id}: "${stem}"`,
            ).toBe(false)
          }
          for (const cid of a.contentIds) {
            // Ignore accidental ultra-generic ids
            if (cid === 'bio:placeholder') continue
            expect(
              b.contentIds.has(cid),
              `shared contentId between ${a.id} and ${b.id}: "${cid}"`,
            ).toBe(false)
          }
        }
      }
    }
  })
})
