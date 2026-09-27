/**
 * Geschichte pack quality: every topic playable, Fachwissen substantive, no stubs.
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { allGeschichteTopicIds } from './geschichteGymTopics'
import {
  isPlayableGeschichteTopic,
  resolveGeschichteGenerate,
} from './geschichteGenerators'
import { buildUniqueTaskRound } from './uniqueRound'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { bioTextContainsAcceptedTerm, isLehrplanMetaWissen } from './biologieBank'
import { gapQualityIssues } from './gapQuality'
import { GESCHICHTE_DENSE_K6_LB23_GENERATORS } from './geschichteDenseK6Lb23'

const HARD_META =
  /Prüfung:|Antwort prüfen|Teilpunkte|Groß-\/Kleinschreibung|Karte umdrehen|Tippe „ok“|Übungsaufgaben folgen/i
const THIN_PLACEHOLDER =
  /^(LB:?\s|Wahl:?\s|Wahlbereich|Lehrplanziel|Schlaukopf)/i
/** Schüler prompts must not ask about Lehrplan meta or spoil chronology order. */
const LEHRPLAN_META_PROMPT =
  /Lehrplanziel|steht im Lehrplan|laut Lehrplan|lehrplanrelevant|für Sachsen relevant|Warum .* Lehrplan|Welches Lehrplanziel|verbindlichen Lehrplanstoff|Lehrplanbezug/i
const CHRONOLOGY_SPOILER =
  /Ordne chronologisch:\s*\S|Ordne:[^?]{0,80}→|→[^?]{0,60}→/i

describe('Geschichte generators quality', () => {
  const allIds = allGeschichteTopicIds()

  it('covers every Lehrplan topic with a real generator', () => {
    expect(allIds.length).toBeGreaterThan(50)
    for (const id of allIds) {
      expect(isPlayableGeschichteTopic(id), id).toBe(true)
      expect(resolveGeschichteGenerate(id), id).toBeTypeOf('function')
    }
  })

  it('emits checkable tasks with question-specific Fachwissen (≥80 chars, 2+ sentences)', () => {
    for (const id of allIds) {
      const gen = resolveGeschichteGenerate(id)!
      for (let seed = 0; seed < 4; seed++) {
        const task = gen(createRng(seed * 97 + 3))
        expect(task.question.length, `${id}@${seed}`).toBeGreaterThan(8)
        expect(task.check(task.sampleAnswer), `${id}@${seed}`).toBe(true)
        const fw = task.fachwissen?.text?.trim() ?? ''
        const minFw = id.startsWith('ge-k6-lb1-') ? 40 : 80
        expect(fw.length, `${id}@${seed} fw`).toBeGreaterThanOrEqual(minFw)
        expect(fw, `${id}@${seed}`).not.toMatch(HARD_META)
        expect(fw, `${id}@${seed}`).not.toMatch(THIN_PLACEHOLDER)
        // K6 LB1 Rom: eigene Tests; neue Banken ≥2 Sätze.
        if (!id.startsWith('ge-k6-lb1-')) {
          const sentences = fw.split(/[.!?]+/).filter((s) => s.trim().length > 20)
          expect(sentences.length, `${id}@${seed} sentences`).toBeGreaterThanOrEqual(2)
        }
      }
    }
  })

  it('non-Rom topics stay conceptually distinct from stub placeholder text', () => {
    const locked = allIds.filter((id) => !id.startsWith('ge-k6-lb1-'))
    for (const id of locked.slice(0, 20)) {
      const task = resolveGeschichteGenerate(id)!(createRng(11))
      expect(task.question).not.toMatch(/Übungsaufgaben folgen|Tippe „ok“/)
    }
  })

  it('can build unique rounds of ~8 for sample banks', () => {
    const sample = [
      'ge-k5-lb1-orientierung',
      'ge-k6-lb2-mittelalter',
      'ge-k7-lb1-neuzeit',
      'ge-k8-lb2-industrialisierung',
      'ge-k9-lb2-demokratie-diktatur',
      'ge-k10-lb2-ost-west',
      'ge-gk-lb4-frieden',
    ]
    for (const id of sample) {
      const gen = resolveGeschichteGenerate(id)!
      const round = buildUniqueTaskRound(gen, createRng(42), 8, 40)
      expect(round.length, id).toBeGreaterThanOrEqual(6)
      const keys = new Set(round.map((t) => t.dedupeKey ?? t.contentIds?.[0] ?? t.question))
      expect(keys.size, id).toBe(round.length)
    }
  })

  it('cloze/gap answers never appear in gap text or question stem', () => {
    let sawCloze = 0
    // Gaps are intentionally rare in bankGenerate; sample more seeds.
    for (const id of allIds) {
      const gen = resolveGeschichteGenerate(id)
      if (!gen) continue
      for (let seed = 0; seed < 40; seed++) {
        const task = gen(createRng(seed * 53 + 17))
        if (task.interactive?.type !== 'clozeMulti') continue
        sawCloze++
        const segs = (task.interactive.props?.segments as string[]) ?? []
        const accepted = ((task.interactive.props?.accepted as string[][]) ?? []).flat()
        const gapText = segs.join(' ')
        for (const a of accepted) {
          expect(
            bioTextContainsAcceptedTerm(gapText, [a]),
            `${id}@${seed} gap←${a}`,
          ).toBe(false)
        }
        expect(
          bioTextContainsAcceptedTerm(task.question, accepted),
          `${id}@${seed} Q`,
        ).toBe(false)
      }
    }
    expect(sawCloze).toBeGreaterThan(3)
  })

  it('K6 LB2/LB3: no Lehrplan-meta prompts/Fachwissen and no chronology spoilers', () => {
    const ids = Object.keys(GESCHICHTE_DENSE_K6_LB23_GENERATORS)
    expect(ids.length).toBeGreaterThanOrEqual(14)
    for (const id of ids) {
      const gen = resolveGeschichteGenerate(id)!
      for (let seed = 0; seed < 12; seed++) {
        const task = gen(createRng(seed * 41 + 5))
        expect(task.question, `${id}@${seed} Q`).not.toMatch(LEHRPLAN_META_PROMPT)
        expect(task.question, `${id}@${seed} chrono`).not.toMatch(CHRONOLOGY_SPOILER)
        const fw = task.fachwissen?.text ?? ''
        expect(isLehrplanMetaWissen(fw), `${id}@${seed} fw-meta`).toBe(false)
        expect(fw, `${id}@${seed} fw-text`).not.toMatch(LEHRPLAN_META_PROMPT)
        // Prefer MC/decision over True/False for densified banks
        expect(task.question, `${id}@${seed} tf`).not.toMatch(/^Stimmt die Aussage\?/i)
      }
    }
  })

  it('emitted Geschichte prompts avoid Lehrplan-meta and chronology spoilers (sample)', () => {
    const sample = [
      'ge-k6-lb2-frankenreich',
      'ge-k6-lb2-reichsbildung',
      'ge-k6-lb3-kreuzzuege',
      'ge-k6-lb3-toleranz-heute',
      'ge-k7-lb1-renaissance',
      'ge-k5-lb2-athen',
    ]
    for (const id of sample) {
      const gen = resolveGeschichteGenerate(id)
      if (!gen) continue
      for (let seed = 0; seed < 8; seed++) {
        const task = gen(createRng(seed * 19 + 2))
        expect(task.question, `${id}@${seed}`).not.toMatch(LEHRPLAN_META_PROMPT)
        expect(task.question, `${id}@${seed}`).not.toMatch(CHRONOLOGY_SPOILER)
      }
    }
  })

  it('dense bank sources reject meta gaps and fragment answers (erschließbar)', () => {
    const files = [
      'geschichteDenseK6Lb23.ts',
      'geschichteDense.ts',
      'geschichteDenseUpper.ts',
    ]
    const factRe =
      /fact\(\s*['"]([^'"]+)['"]\s*,\s*['"]((?:\\.|[^'"\\])*)['"]\s*,\s*['"]((?:\\.|[^'"\\])*)['"]\s*,\s*\[((?:.|\n)*?)\]\s*,\s*['"]((?:\\.|[^'"\\])*)['"]\s*,\s*['"]((?:\\.|[^'"\\])*)['"]\s*,\s*['"]((?:\\.|[^'"\\])*)['"]\s*,\s*(\[[^\]]*\])/g
    for (const file of files) {
      const text = readFileSync(join(process.cwd(), 'src/curriculum', file), 'utf8')
      let m: RegExpExecArray | null
      let count = 0
      while ((m = factRe.exec(text))) {
        count++
        const [, concept, prompt, , , , , gap, accRaw] = m
        const accepted = [...accRaw.matchAll(/['"]((?:\\.|[^'"\\])*)['"]/g)].map((x) => x[1]!)
        const issues = gapQualityIssues(gap!, accepted, prompt!)
        expect(issues, `${file}:${concept} ${issues.join(',')}`).toEqual([])
      }
      expect(count, file).toBeGreaterThan(10)
    }
  })

  it('emitted clozes are not meta templates or fragment answers', () => {
    const ids = [
      ...Object.keys(GESCHICHTE_DENSE_K6_LB23_GENERATORS),
      'ge-k7-lb1-renaissance',
      'ge-k5-lb2-athen',
      'ge-k5-lb1-quellen',
      'ge-k5-lb1-zeitrechnung',
      'ge-k6-lb2-lehnswesen',
    ]
    let saw = 0
    // bankGenerate emits gaps sparsely; oversample so quality still gets checked.
    for (const id of ids) {
      const gen = resolveGeschichteGenerate(id)
      if (!gen) continue
      for (let seed = 0; seed < 80; seed++) {
        const task = gen(createRng(seed * 31 + 7))
        if (task.interactive?.type !== 'clozeMulti') continue
        saw++
        const segs = (task.interactive.props?.segments as string[]) ?? []
        const gapText = segs.join('___')
        const accepted = ((task.interactive.props?.accepted as string[][]) ?? []).flat()
        const issues = gapQualityIssues(gapText, accepted, task.question)
        expect(issues, `${id}@${seed} ${issues.join(',')}`).toEqual([])
      }
    }
    expect(saw).toBeGreaterThan(2)
  })
})
