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
import { bioTextContainsAcceptedTerm } from './biologieBank'

const HARD_META =
  /Prüfung:|Antwort prüfen|Teilpunkte|Groß-\/Kleinschreibung|Karte umdrehen|Tippe „ok“|Übungsaufgaben folgen/i
const THIN_PLACEHOLDER =
  /^(LB:?\s|Wahl:?\s|Wahlbereich|Lehrplanziel|Schlaukopf)/i

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
    for (const id of allIds) {
      const gen = resolveGeschichteGenerate(id)
      if (!gen) continue
      for (let seed = 0; seed < 10; seed++) {
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
    expect(sawCloze).toBeGreaterThan(20)
  })
})
