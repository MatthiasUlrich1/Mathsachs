import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { awardPoints, gradeTask } from './types'
import { clozeMultiTask, pairMatchTask } from './taskHelpers'
import { buildUniqueTaskRound, taskContentIds } from './uniqueRound'
import { BIOLOGIE_GENERATORS } from './biologieGenerators'
import { isRedundantFlashcardInstruction } from '../components/FlashcardFlip'

describe('clozeMulti / pairMatch partial scoring', () => {
  it('awards fractional points per blank', () => {
    const task = clozeMultiTask({
      question: 'Lücken',
      segments: ['A ', ' B ', ' C ', '.'],
      accepted: [['eins'], ['zwei'], ['drei']],
      solution: 'eins / zwei / drei',
      explanation: 'ok',
    })
    const partial = gradeTask(task, {
      kind: 'clozeMulti',
      blanks: ['eins', 'falsch', 'drei'],
    })
    expect(partial.fraction).toBeCloseTo(2 / 3)
    expect(partial.parts).toEqual([true, false, true])
    expect(awardPoints(10, partial)).toBe(7)
    expect(task.check({ kind: 'clozeMulti', blanks: ['eins', 'zwei', 'drei'] })).toBe(true)
  })

  it('awards fractional points per pairMatch link', () => {
    const task = pairMatchTask({
      question: 'Paare',
      left: [
        { id: 'L0', label: 'A' },
        { id: 'L1', label: 'B' },
      ],
      right: [
        { id: 'R0', label: 'eins' },
        { id: 'R1', label: 'zwei' },
      ],
      correctLinks: { L0: 'R0', L1: 'R1' },
      solution: 'A→eins; B→zwei',
      explanation: 'ok',
    })
    const partial = gradeTask(task, {
      kind: 'pairMatch',
      links: { L0: 'R0', L1: 'R0' },
    })
    expect(partial.fraction).toBe(0.5)
    expect(partial.parts).toEqual([true, false])
    expect(awardPoints(10, partial)).toBe(5)
  })
})

describe('content-level round uniqueness', () => {
  it('rejects overlapping contentIds even when questions differ', () => {
    const pool = [
      clozeMultiTask({
        question: 'MC form',
        segments: ['x ', '.'],
        accepted: [['a']],
        solution: 'a',
        explanation: 'e',
        dedupeKey: 'bio:spinnen:beinzahl',
        contentIds: ['bio:spinnen:beinzahl'],
      }),
      clozeMultiTask({
        question: 'Other wording',
        segments: ['y ', '.'],
        accepted: [['b']],
        solution: 'b',
        explanation: 'e',
        dedupeKey: 'bio:spinnen:beinzahl',
        contentIds: ['bio:spinnen:beinzahl'],
      }),
      clozeMultiTask({
        question: 'Different fact',
        segments: ['z ', '.'],
        accepted: [['c']],
        solution: 'c',
        explanation: 'e',
        dedupeKey: 'bio:spinnen:netz-funktion',
        contentIds: ['bio:spinnen:netz-funktion'],
      }),
    ]
    let i = 0
    const round = buildUniqueTaskRound(() => pool[i++ % pool.length]!, createRng(1), 10, 20)
    expect(round.length).toBe(2)
    const ids = round.flatMap(taskContentIds)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('Biologie quality bar', () => {
  const META_FACHWISSEN =
    /Prüfung:|Antwort prüfen|Teilpunkte|Karteikarte:|Zur Frage|Die gesuchte Antwort|Auch akzeptiert|Klassenarbeiten|gewertet|Häufige Verwechslung in Quizzes|im Unterricht\.|Systemüberblick\.|Orientierung im|Wahl:|Wahlbereich:|LB\d|Kursinhalte beachten|Schlaukopf|Klassiker \(/i

  /** Sek I Gym (K5–10) — Fachwissen hier auf reines Fachwissen gehärtet. */
  const sekIIds = Object.keys(BIOLOGIE_GENERATORS).filter((id) =>
    /^bi-k(5|6|7|8|9|10)-/.test(id),
  )

  it('every Sek-I task has question-specific fachwissen', () => {
    expect(sekIIds.length).toBeGreaterThan(40)
    for (const id of sekIIds) {
      for (let seed = 0; seed < 6; seed++) {
        const task = BIOLOGIE_GENERATORS[id]!(createRng(seed * 97 + 3))
        expect(task.fachwissen?.text?.trim().length, `${id}@${seed}`).toBeGreaterThanOrEqual(45)
      }
    }
  })

  it('Sek-I fachwissen is pure subject knowledge — no grading/UI/meta bla', () => {
    for (const id of sekIIds) {
      for (let seed = 0; seed < 8; seed++) {
        const task = BIOLOGIE_GENERATORS[id]!(createRng(seed * 53 + 11))
        const text = task.fachwissen?.text ?? ''
        expect(text, `${id}@${seed}`).not.toMatch(META_FACHWISSEN)
        expect(text.toLowerCase(), `${id}@${seed}`).not.toContain('karte umdrehen')
        expect(text.toLowerCase(), `${id}@${seed}`).not.toContain('groß-/kleinschreibung')
      }
    }
  })

  it('no bio task injects Prüfung-/Wertung-meta into fachwissen', () => {
    const hardMeta = /Prüfung:|Antwort prüfen|Teilpunkte|Groß-\/Kleinschreibung|Karte umdrehen/i
    for (const id of Object.keys(BIOLOGIE_GENERATORS)) {
      for (let seed = 0; seed < 4; seed++) {
        const task = BIOLOGIE_GENERATORS[id]!(createRng(seed * 17 + 3))
        expect(task.fachwissen?.text ?? '', `${id}@${seed}`).not.toMatch(hardMeta)
      }
    }
  })

  it('flashcard questions are content prompts, not UI instructions', () => {
    for (const topicId of ['bi-k6-lb2-spinnen', 'bi-k5-lb2-fische', 'bi-k7-lb1-mikroben']) {
      const gen = BIOLOGIE_GENERATORS[topicId]!
      for (let seed = 0; seed < 40; seed++) {
        const task = gen(createRng(seed * 19 + 7))
        if (task.interactive?.type !== 'flashcardFlip') continue
        expect(task.question).not.toMatch(/Karteikarte:/i)
        expect(task.question).not.toMatch(/umdrehen/i)
      }
    }
  })

  it('rejects known-trivial spider iconBelong spoilers', () => {
    const gen = BIOLOGIE_GENERATORS['bi-k6-lb2-spinnen']!
    for (let seed = 0; seed < 80; seed++) {
      const task = gen(createRng(seed * 17 + 5))
      const q = task.question
      expect(q).not.toMatch(/\(\s*8\s*Beine\s*\)/i)
      expect(q).not.toMatch(/Welches Tier ist eine Spinne/i)
      if (task.interactive?.type === 'iconBelong') {
        expect(task.question).toMatch(/Seide|Netz|Spinn|Merkmal|Lebewesen/i)
      }
    }
  })

  it('wirbellose never serves vertebrate Körperbedeckung cloze', () => {
    const gen = BIOLOGIE_GENERATORS['bi-k6-lb2-wirbellose']!
    for (let seed = 0; seed < 100; seed++) {
      const task = gen(createRng(seed * 13 + 2))
      expect(task.question).not.toMatch(/Körperbedeckung/i)
      const segs = task.interactive?.props?.segments
      if (Array.isArray(segs)) {
        const text = segs.join('___')
        expect(text).not.toMatch(/Fische haben oft/i)
        expect(text).not.toMatch(/Säuger/i)
      }
    }
  })

  it('pairMatch tasks carry concept contentIds and enough pool variety', () => {
    const gen = BIOLOGIE_GENERATORS['bi-k6-lb2-wirbellose']!
    const pairKeys = new Set<string>()
    for (let seed = 0; seed < 60; seed++) {
      const task = gen(createRng(seed * 41 + 9))
      if (task.interactive?.type !== 'pairMatch') continue
      expect(task.contentIds?.length ?? 0).toBeGreaterThanOrEqual(3)
      for (const id of task.contentIds ?? []) pairKeys.add(id)
    }
    expect(pairKeys.size).toBeGreaterThanOrEqual(6)
  })

  it('rounds of 10 have unique content identities', () => {
    for (const topicId of [
      'bi-k6-lb2-spinnen',
      'bi-k6-lb2-wirbellose',
      'bi-k5-lb7-zuordnung',
    ]) {
      const gen = BIOLOGIE_GENERATORS[topicId]!
      const round = buildUniqueTaskRound(gen, createRng(42), 10, 100)
      expect(round.length).toBeGreaterThanOrEqual(6)
      const seen = new Set<string>()
      for (const t of round) {
        for (const id of taskContentIds(t)) {
          expect(seen.has(id), `${topicId} dup ${id}`).toBe(false)
          seen.add(id)
        }
        expect(t.fachwissen?.text?.length).toBeGreaterThan(10)
      }
    }
  })
})

describe('FlashcardFlip instructions', () => {
  it('treats numbered step paragraphs as redundant', () => {
    expect(
      isRedundantFlashcardInstruction(
        '1) Vorderseite lesen  2) Karte umdrehen  3) Antwort tippen (Option wählen).',
      ),
    ).toBe(true)
    expect(isRedundantFlashcardInstruction('Nutze das Fachwort aus dem Text.')).toBe(false)
  })
})
