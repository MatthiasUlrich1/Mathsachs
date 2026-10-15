/**
 * Cross-pack Themenbindung smoke: alle Fächer × Klassen × LBs.
 * Flaggt themenfremde Bare-Arithmetik und Slogan-/Meta-Prompts.
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { hydratePackGrades } from './hydrate'
import { buildGymSachsenBiologiePack } from './biologieGymPack'
import { buildGymSachsenGeschichtePack } from './geschichteGymPack'
import { buildGymSachsenPhysikPack } from './physikGymPack'
import { buildOberschuleHsPack, buildOberschuleRsPack } from './oberschulePacks'
import { buildGymSachsenAnhaltPack } from './gymSachsenAnhaltPack'
import {
  buildSekundarschuleSachsenAnhaltHsPack,
  buildSekundarschuleSachsenAnhaltRsPack,
} from './sekundarschuleSachsenAnhaltPack'
import { getBundledModule } from './bundled'

const BARE_ARITH = /^Berechne:\s*\d+\s*[+·\-×x]\s*\d+\s*$/i
/** Echte Lehrplan-Meta / Slogan — nicht jedes „Warum … wichtig?“ (fachlich ok). */
const META =
  /Unterrichtsthema hilft|für Sachsen relevant|Lehrplankontext|nennt der Lehrplan|laut Lehrplan|steht im Lehrplan|Warum .* Lehrplan/i
const SLOGAN =
  /Zeichnung zum Sachverhalt|Zahlenaufgabe zu|Was gehoert zu|Was gehört zu „(Rechnung|Begriff|Formel|Skizze|Probe|Einheit)“/i
const BANNED_MATH_UI = new Set([
  'pairMatch',
  'clozeMulti',
  'flashcardFlip',
  'causeEffect',
  'dragDropSlots',
  'imageLabelSlots',
  'iconBelong',
])
const BANNED_PHY_UI = new Set(['pairMatch', 'clozeMulti', 'flashcardFlip', 'causeEffect', 'iconBelong'])
const DEF_WAS_BEDEUTET = /^Was bedeutet\b/i
/** GE Thin-Fill-Allgemeinplätze — nur in Methoden-/Zeitrechnungsthemen ok. */
const GE_GENERIC_VOCAB =
  /Was (beschreibt|bedeutet|ist) [„""']?(Herrschaft|Gesellschaft|Wirtschaft|Religion|Kultur|Konflikt|Revolution|Kontinuität|Migration|Erinnerung)\b/i
function geAllowsGenericMethodVocab(id: string, title: string): boolean {
  // Nur echte Methoden-Themen — nicht Metallzeit/Polis/…
  return /quelle|chronolog|zeitrechnung|orientierung|method|werkzeug/i.test(`${id} ${title}`)
}

/** Topics where plain integer a±b / a·b is on-topic (not a boost leak). */
function allowsBareArith(id: string, title: string): boolean {
  const s = `${id} ${title}`.toLowerCase()
  // Gebrochene/rationale/Dezimal/Spiele: integer Bare-Arith ist themenfremd.
  if (/gebrochen|rational|bruch|dezimal|spiele|prozent|period|gesetz|vorteil/.test(s)) {
    return false
  }
  return /add|sub|mul|multiplik|schriftlich|kopfrechnen|natuerlich|natürlich|grundrechen/.test(
    s,
  )
}

type Hit = { pack: string; id: string; title: string; seed: number; issue: string }

async function collectHits(
  packName: string,
  grades: Awaited<ReturnType<typeof hydratePackGrades>>,
  opts?: { subject?: 'mathematik' | 'physik' | 'other' },
): Promise<Hit[]> {
  const subject = opts?.subject ?? 'other'
  const hits: Hit[] = []
  for (const g of grades) {
    for (const area of g.areas) {
      for (const topic of area.topics) {
        if (topic.outlineOnly) continue
        for (let seed = 1; seed <= 6; seed++) {
          let task
          try {
            task = topic.generate(createRng(seed * 97 + 3))
          } catch (e) {
            hits.push({
              pack: packName,
              id: topic.id,
              title: topic.title,
              seed,
              issue: `throw: ${(e as Error).message}`,
            })
            continue
          }
          const q = (task.question || '').trim()
          const fw = task.fachwissen?.text || ''
          const ui = task.interactive?.type
          if (subject === 'mathematik' && ui && BANNED_MATH_UI.has(ui)) {
            hits.push({
              pack: packName,
              id: topic.id,
              title: topic.title,
              seed,
              issue: `banned-ui: ${ui}`,
            })
          }
          if (subject === 'physik' && ui && BANNED_PHY_UI.has(ui)) {
            hits.push({
              pack: packName,
              id: topic.id,
              title: topic.title,
              seed,
              issue: `banned-ui: ${ui}`,
            })
          }
          if (subject === 'physik' && DEF_WAS_BEDEUTET.test(q)) {
            hits.push({
              pack: packName,
              id: topic.id,
              title: topic.title,
              seed,
              issue: `def-mc: ${q.slice(0, 100)}`,
            })
          }
          if (BARE_ARITH.test(q) && !allowsBareArith(topic.id, topic.title)) {
            hits.push({
              pack: packName,
              id: topic.id,
              title: topic.title,
              seed,
              issue: `bare-arith: ${q}`,
            })
          }
          if (META.test(q) || META.test(fw)) {
            hits.push({
              pack: packName,
              id: topic.id,
              title: topic.title,
              seed,
              issue: `meta: ${q.slice(0, 100)}`,
            })
          }
          if (SLOGAN.test(q)) {
            hits.push({
              pack: packName,
              id: topic.id,
              title: topic.title,
              seed,
              issue: `slogan: ${q.slice(0, 100)}`,
            })
          }
        }
      }
    }
  }
  return hits
}

describe('Themenbindung alle Fächer×Klassen×LBs (smoke)', () => {
  it('Mathe Gym K5–K6 bundled: keine Bare-Arithmetik/Slogan-ThinFill', async () => {
    const hits: Hit[] = []
    for (const id of ['mathematik-klasse-5', 'mathematik-klasse-6']) {
      const mod = getBundledModule(id)!
      const grade = await mod.load()
      hits.push(...(await collectHits(id, [grade], { subject: 'mathematik' })))
    }
    // User-Beispiele müssen sauber sein
    const examples = hits.filter(
      (h) => h.id === 'lb1-rechengesetze' || h.id === 'k6-lb1-periodische-dezimal',
    )
    expect(examples, JSON.stringify(examples, null, 2)).toEqual([])
    // Bare-arith überall in K5/K6 Mathe verboten
    const bare = hits.filter((h) => h.issue.startsWith('bare-arith') || h.issue.startsWith('banned-ui'))
    expect(bare, JSON.stringify(bare.slice(0, 20), null, 2)).toEqual([])
  }, 60_000)

  it('Physik Gym hydrate: keine Bare-Arithmetik/Slogan/PairMatch/Def-MC', async () => {
    const grades = await hydratePackGrades(buildGymSachsenPhysikPack())
    const hits = await collectHits('physik', grades, { subject: 'physik' })
    const bad = hits.filter(
      (h) =>
        h.issue.startsWith('bare-arith') ||
        h.issue.startsWith('slogan') ||
        h.issue.startsWith('banned-ui') ||
        h.issue.startsWith('def-mc'),
    )
    expect(bad, JSON.stringify(bad.slice(0, 25), null, 2)).toEqual([])
  }, 90_000)

  it('Bio Gym hydrate: keine Slogan-ThinFill-Prompts', async () => {
    const grades = await hydratePackGrades(buildGymSachsenBiologiePack())
    const hits = await collectHits('bio', grades)
    const slogan = hits.filter((h) => h.issue.startsWith('slogan') || h.issue.startsWith('meta'))
    expect(slogan, JSON.stringify(slogan.slice(0, 25), null, 2)).toEqual([])
  }, 90_000)

  it('Geschichte Gym hydrate: keine Meta-Prompts und kein generisches Thin-Fill', async () => {
    const grades = await hydratePackGrades(buildGymSachsenGeschichtePack())
    const hits = await collectHits('geschichte', grades)
    const meta = hits.filter((h) => h.issue.startsWith('meta') || h.issue.startsWith('slogan'))
    expect(meta, JSON.stringify(meta.slice(0, 25), null, 2)).toEqual([])
    // User-Beispiel: „Was ist ein Konflikt?“ unter Metallzeit = Themenfremdheit
    const offTopic: Hit[] = []
    for (const g of grades) {
      for (const area of g.areas) {
        for (const topic of area.topics) {
          if (topic.outlineOnly) continue
          if (geAllowsGenericMethodVocab(topic.id, topic.title)) continue
          for (let seed = 1; seed <= 8; seed++) {
            const task = topic.generate(createRng(seed * 97 + 3))
            const q = (task.question || '').trim()
            if (GE_GENERIC_VOCAB.test(q)) {
              offTopic.push({
                pack: 'geschichte',
                id: topic.id,
                title: topic.title,
                seed,
                issue: `ge-generic-vocab: ${q.slice(0, 100)}`,
              })
            }
          }
        }
      }
    }
    expect(offTopic, JSON.stringify(offTopic.slice(0, 25), null, 2)).toEqual([])
  }, 120_000)

  it('Oberschule HS/RS hydrate: keine Bare-Arithmetik unter Fremdthemen', async () => {
    const hs = await hydratePackGrades(buildOberschuleHsPack())
    const rs = await hydratePackGrades(buildOberschuleRsPack())
    const hits = [
      ...(await collectHits('os-hs', hs, { subject: 'mathematik' })),
      ...(await collectHits('os-rs', rs, { subject: 'mathematik' })),
    ]
    const bare = hits.filter((h) => h.issue.startsWith('bare-arith') || h.issue.startsWith('banned-ui'))
    expect(bare, JSON.stringify(bare.slice(0, 25), null, 2)).toEqual([])
  }, 120_000)

  it('ST/SKS hydrate: keine Bare-Arithmetik unter Fremdthemen', async () => {
    const st = await hydratePackGrades(buildGymSachsenAnhaltPack())
    const sksHs = await hydratePackGrades(buildSekundarschuleSachsenAnhaltHsPack())
    const sksRs = await hydratePackGrades(buildSekundarschuleSachsenAnhaltRsPack())
    const hits = [
      ...(await collectHits('gym-st', st, { subject: 'mathematik' })),
      ...(await collectHits('sks-hs', sksHs, { subject: 'mathematik' })),
      ...(await collectHits('sks-rs', sksRs, { subject: 'mathematik' })),
    ]
    const bare = hits.filter((h) => h.issue.startsWith('bare-arith') || h.issue.startsWith('banned-ui'))
    expect(bare, JSON.stringify(bare.slice(0, 25), null, 2)).toEqual([])
  }, 120_000)
})
