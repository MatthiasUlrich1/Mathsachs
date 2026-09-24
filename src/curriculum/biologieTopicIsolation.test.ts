/**
 * Biologie topic isolation — Überblick vs Spezial, no shared stems/contentIds.
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { BIOLOGIE_GENERATORS } from './biologieGenerators'
import { BIOLOGIE_SPECIAL_GENERATORS } from './biologieSpecialTopics'

/** Sibling families: Überblick + Spezial within one LB (must not share stems/ids). */
const SIBLING_FAMILIES: string[][] = [
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
  [
    'bi-k6-lb1-samenpflanzen',
    'bi-k6-lb1-bluete',
    'bi-k6-lb1-baeume',
    'bi-k6-lb1-organe',
  ],
  ['bi-k6-lb2-wirbellose', 'bi-k6-lb2-insekten', 'bi-k6-lb2-spinnen', 'bi-k6-lb2-krebstiere', 'bi-k6-lb2-ringelwuermer', 'bi-k6-lb2-rundwuermer', 'bi-k6-lb2-nesseltiere'],
  ['bi-k6-lbw-spinnen', 'bi-k6-lbw-weichtiere', 'bi-k6-lbw-schnecken', 'bi-k6-lbw-muscheln', 'bi-k6-lbw-kopffuesser'],
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
]

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

/** Shared UI chrome for pairMatch etc. — not topic content. */
const GENERIC_STEM =
  /^(ordne begriff und erklaerung|ordne zu|welche aussage|richtig oder falsch|karteikarte|tippe|waehle|welcher fachbegriff passt|fachbegriff was bedeutet)/i

function isContentStem(stem: string): boolean {
  if (stem.length < 12) return false
  if (GENERIC_STEM.test(stem)) return false
  if (/^ordne( zu)?(:)?\s*\d+\s*fachbegriff/i.test(stem)) return false
  if (/klick.?paare/i.test(stem) && /ordne/i.test(stem)) return false
  if (/lebensmerkmale ihren erkl/i.test(stem)) return false
  if (/bau und funktionsbegriff/i.test(stem)) return false
  // Flashcard/gap template + term only — real isolation is via contentIds.
  if (/^fachbegriff\b/i.test(stem) && /bedeutet/.test(stem)) return false
  return true
}

function sampleTopic(topicId: string, n = 100) {
  const gen = BIOLOGIE_GENERATORS[topicId]
  if (!gen) throw new Error(`missing generator: ${topicId}`)
  const stems = new Set<string>()
  const contentIds = new Set<string>()
  const questions: string[] = []
  for (let seed = 0; seed < n; seed++) {
    const task = gen(createRng(seed * 101 + 7))
    questions.push(task.question)
    stems.add(normalizeStem(task.question))
    const prompt = task.interactive?.props?.prompt
    if (typeof prompt === 'string' && prompt.trim()) stems.add(normalizeStem(prompt))
    const front = task.interactive?.props?.front
    if (typeof front === 'string' && front.trim()) stems.add(normalizeStem(front))
    // Drop generic UI chrome before cross-topic compare
    for (const stem of [...stems]) {
      if (!isContentStem(stem)) stems.delete(stem)
    }
    for (const id of task.contentIds ?? []) {
      if (id.trim()) contentIds.add(id.trim())
    }
    if (task.dedupeKey?.trim()) contentIds.add(task.dedupeKey.trim())
  }
  return { stems, contentIds, questions }
}

describe('Biologie topic isolation (no cross-pollination)', () => {
  it('Wirbellose Überblick never asks vertebrate-group iconBelong (Vögel/Fische/…)', () => {
    const texts = sampleTopic('bi-k6-lb2-wirbellose', 120).questions.join('\n')
    expect(texts).not.toMatch(/gehört zu den Vögeln/i)
    expect(texts).not.toMatch(/Gruppe:\s*Vögel/i)
    expect(texts).not.toMatch(/gehört zu den Fischen/i)
    expect(texts).not.toMatch(/Gruppe:\s*Fische/i)
    expect(texts).not.toMatch(/gehört zu den Säugetieren/i)
    expect(texts.toLowerCase()).toMatch(/wirbellos/)
  })

  it('Insekten topic stays on insects — not spider-net or bird assign', () => {
    const texts = sampleTopic('bi-k6-lb2-insekten', 100).questions.join('\n')
    expect(texts).not.toMatch(/Spinnennetz/i)
    expect(texts).not.toMatch(/gehört zu den Vögeln/i)
    expect(texts).toMatch(/Insekt|Metamorphose|Beine|Chitin|Imago|Puppe/i)
  })

  it('Spinnen topic stays on spiders — not full insect metamorphose sort as sole bank', () => {
    const texts = sampleTopic('bi-k6-lb2-spinnen', 100).questions.join('\n')
    expect(texts).not.toMatch(/gehört zu den Vögeln/i)
    expect(texts).toMatch(/Spinne|Beine|Netz|Spinnenseide|acht/i)
  })

  it('new Wirbellose Spezial topics are playable and stay on-theme', () => {
    const cases: Array<{ id: string; expect: RegExp; forbid: RegExp }> = [
      {
        id: 'bi-k6-lb2-krebstiere',
        expect: /Krebs|Kieme|Antenne|Wasserfloh|Häutung|Schere/i,
        forbid: /vollständige Metamorphose|Spinnenseide|Ambulakral/i,
      },
      {
        id: 'bi-k6-lb2-ringelwuermer',
        expect: /Regenwurm|Segment|Ringel|Borste|Blutegel|Hautatmung/i,
        forbid: /Spinnenseide|Radula|Ambulakral/i,
      },
      {
        id: 'bi-k6-lb2-rundwuermer',
        expect: /Rundwurm|Nematod|Fadenwurm|Askaris|Spulwurm|parasit/i,
        forbid: /Spinnenseide|Ambulakral|Radula/i,
      },
      {
        id: 'bi-k6-lb2-nesseltiere',
        expect: /Nessel|Qualle|Koralle|Polyp|Meduse|Tentakel|Hohltier/i,
        forbid: /Spinnenseide|Ambulakral|Kriechfuß/i,
      },
      {
        id: 'bi-k6-lbw-spinnen',
        expect: /Spinne|Netz|Beute|Spinnenseide|acht/i,
        forbid: /Ambulakral|Radula|vollständige Metamorphose/i,
      },
      {
        id: 'bi-k6-lbw-weichtiere',
        expect: /Weichtier|Mantel|Schnecke|Muschel|Kopffüß/i,
        forbid: /Ambulakral|Nesselzelle/i,
      },
      {
        id: 'bi-k6-lbw-schnecken',
        expect: /Schnecke|Kriechfuß|Radula|Gehäuse|Fühler/i,
        forbid: /Ambulakral|Nesselzelle/i,
      },
      {
        id: 'bi-k6-lbw-muscheln',
        expect: /Muschel|Klappe|Filtr|Kieme|Byssus/i,
        forbid: /Ambulakral|Nesselzelle|Spinnenseide/i,
      },
      {
        id: 'bi-k6-lbw-kopffuesser',
        expect: /Tintenfisch|Fangarm|Rückstoß|Tinte|Kopffüß/i,
        forbid: /Ambulakral|Nesselzelle|Spinnenseide/i,
      },
    ]
    for (const c of cases) {
      const { questions } = sampleTopic(c.id, 80)
      const blob = questions.join('\n')
      expect(blob, c.id).toMatch(c.expect)
      expect(blob, c.id).not.toMatch(c.forbid)
    }
  })

  it('Wirbellose Überblick stays high-level — no Spezial-only detail stems', () => {
    const texts = sampleTopic('bi-k6-lb2-wirbellose', 100).questions.join('\n')
    expect(texts).toMatch(/wirbellos/i)
    expect(texts).not.toMatch(/Butterkrebs/i)
    expect(texts).not.toMatch(/Madreporenplatte/i)
    expect(texts).not.toMatch(/Forcipulen/i)
    expect(texts).not.toMatch(/Zooxanthellen/i)
  })

  it('Fische Überblick never asks „Welches Tier gehört zu den Vögeln?“', () => {
    const texts = sampleTopic('bi-k5-lb2-fische', 100).questions.join('\n')
    expect(texts).not.toMatch(/gehört zu den Vögeln/i)
    expect(texts).not.toMatch(/Gruppe:\s*Vögel/i)
    expect(texts).not.toMatch(/gehört zu den Säugetieren/i)
  })

  it('Vögel Überblick never asks fish/lurch assign icons', () => {
    const texts = sampleTopic('bi-k5-lb5-voegel', 100).questions.join('\n')
    expect(texts).not.toMatch(/gehört zu den Fischen/i)
    expect(texts).not.toMatch(/Gruppe:\s*Fische/i)
    expect(texts).not.toMatch(/gehört zu den Lurchen/i)
  })

  it('Bäume und Holzpflanzen never serves Blütenpflanzen-Überblick prompts', () => {
    const { questions, stems } = sampleTopic('bi-k6-lb1-baeume', 120)
    const blob = questions.join('\n')
    expect(blob).not.toMatch(/Aussagen zu Blütenpflanzen/i)
    expect(blob).not.toMatch(/Welcher Blütenteil erzeugt Pollen/i)
    expect(blob).not.toMatch(/Bestäubung und Befruchtung sind dasselbe/i)
    expect(stems.has(normalizeStem('Welche Aussagen zu Blütenpflanzen stimmen?'))).toBe(false)
    expect(blob).toMatch(/Baum|Holz|Jahresring|Laub|Nadel|Kambium|Xylem/i)
  })

  it('every special-topic id is registered as a playable generator', () => {
    for (const id of Object.keys(BIOLOGIE_SPECIAL_GENERATORS)) {
      expect(BIOLOGIE_GENERATORS[id], id).toBeTypeOf('function')
    }
  })

  it('sibling families share neither normalized stems nor contentIds', () => {
    for (const family of SIBLING_FAMILIES) {
      const byTopic = family.map((id) => ({ id, ...sampleTopic(id, 90) }))
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
            expect(
              b.contentIds.has(cid),
              `shared contentId between ${a.id} and ${b.id}: "${cid}"`,
            ).toBe(false)
          }
        }
      }
    }
  })

  it('Überblick topics do not emit Spezial-only plant prompts', () => {
    const overview = sampleTopic('bi-k6-lb1-samenpflanzen', 100).questions.join('\n')
    expect(overview).not.toMatch(/Jahresringe im Stammquerschnitt/i)
    expect(overview).not.toMatch(/Welcher Blütenteil erzeugt Pollen/i)
    expect(overview).not.toMatch(/Spaltöffnungen in der Blattunterseite/i)
    expect(overview).toMatch(/Samen|Blütenpflanzen|Grundorgane/i)
  })
})
