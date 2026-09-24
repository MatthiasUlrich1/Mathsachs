import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { awardPoints, gradeTask } from './types'
import { clozeMultiTask, pairMatchTask } from './taskHelpers'
import { buildUniqueTaskRound, taskContentIds } from './uniqueRound'
import { BIOLOGIE_GENERATORS } from './biologieGenerators'
import { isRedundantFlashcardInstruction } from '../components/FlashcardFlip'
import {
  bankGenerate,
  bioFactGapModeSafe,
  bioFactQuestion,
  bioGapTemplateSpoils,
  bioQuestionSpoilsTerm,
  bioTextContainsAcceptedTerm,
  stripBioBankSlug,
} from './biologieBank'

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
    /Prüfung:|Antwort prüfen|Teilpunkte|Karteikarte:|Zur Frage|Die gesuchte Antwort|Auch akzeptiert|Klassenarbeiten|gewertet|Häufige Verwechslung in Quizzes|im Unterricht\.|Systemüberblick\.|Orientierung im|Wahl:\s|Wahlbereich:|LB\d|LB:\s|Kursinhalte beachten|Schlaukopf|Klassiker \(/i

  const TOPIC_SUBTITLE_PLACEHOLDER =
    /^(Anwendungen und Perspektiven der Genetik\.?|Grundlagen, Anwendungen und Perspektiven|Zellbiologie\.?|Genregulation\.?|Molekulare Genetik\.?|Genexpression\.?|Einordnung\.?|Vernetzung\.?|Systemdenken\.?|Immunologie\.?|Leben in der Wüste\.?|Wahl Energiehaushalt\.?|Wahl Fließgewässer\.?)$/i

  const allIds = Object.keys(BIOLOGIE_GENERATORS)
  const sekIIds = allIds.filter((id) => /^bi-k(5|6|7|8|9|10)-/.test(id))
  const oberstufeIds = allIds.filter(
    (id) => /^bi-(gk|lk)/.test(id) || id.includes('organellen'),
  )

  it('registers the full Biologie Lehrplan (Sek I + Oberstufe)', () => {
    expect(allIds.length).toBeGreaterThan(90)
    expect(sekIIds.length).toBeGreaterThan(40)
    expect(oberstufeIds.length).toBeGreaterThan(25)
  })

  it('every Bio task (incl. Oberstufe) has substantive question-specific fachwissen', () => {
    for (const id of allIds) {
      for (let seed = 0; seed < 5; seed++) {
        const task = BIOLOGIE_GENERATORS[id]!(createRng(seed * 97 + 3))
        const text = task.fachwissen?.text?.trim() ?? ''
        expect(text.length, `${id}@${seed}`).toBeGreaterThanOrEqual(80)
        const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 15)
        expect(sentences.length, `${id}@${seed} sentences`).toBeGreaterThanOrEqual(2)
        expect(text, `${id}@${seed}`).not.toMatch(TOPIC_SUBTITLE_PLACEHOLDER)
      }
    }
  })

  it('fachwissen is pure subject knowledge — no grading/UI/meta bla', () => {
    for (const id of allIds) {
      for (let seed = 0; seed < 4; seed++) {
        const task = BIOLOGIE_GENERATORS[id]!(createRng(seed * 53 + 11))
        const text = task.fachwissen?.text ?? ''
        expect(text, `${id}@${seed}`).not.toMatch(META_FACHWISSEN)
        expect(text.toLowerCase(), `${id}@${seed}`).not.toContain('karte umdrehen')
        expect(text.toLowerCase(), `${id}@${seed}`).not.toContain('groß-/kleinschreibung')
        expect(text, `${id}@${seed}`).not.toMatch(/^Wahl:\s/i)
        expect(text, `${id}@${seed}`).not.toMatch(/^LB:\s/i)
      }
    }
  })

  it('Genetik PCR prompt never pairs with Proteinbiosynthese cloze', () => {
    const genetikIds = [
      'bi-lk12-lb1-genetik',
      'bi-gk12-lb1-genetik',
      'bi-gk-lbw-gentechnik',
      'bi-lk12-lbw-gentechnik',
    ]
    for (const topicId of genetikIds) {
      const gen = BIOLOGIE_GENERATORS[topicId]!
      let pcrSeen = 0
      for (let seed = 0; seed < 120; seed++) {
        const task = gen(createRng(seed * 17 + 3))
        if (!/PCR/i.test(task.question)) continue
        pcrSeen++
        const segs = task.interactive?.props?.segments
        const cloze = Array.isArray(segs) ? segs.join('___') : ''
        expect(cloze, `${topicId} seed ${seed}`).not.toMatch(/Proteinbiosynthese/i)
        expect(cloze, `${topicId} seed ${seed}`).not.toMatch(/mRNA|Aminosäure/i)
        expect(task.fachwissen?.text ?? '', `${topicId} seed ${seed}`).toMatch(
          /Polymerase|Denaturierung|Primer|Amplifik|Vervielfält/i,
        )
        expect(task.fachwissen?.text ?? '', `${topicId} seed ${seed}`).not.toMatch(
          /^Anwendungen und Perspektiven/i,
        )
        expect(String(task.solution ?? ''), `${topicId} seed ${seed}`).toMatch(
          /Vervielfält|Amplifik|DNA/i,
        )
      }
      expect(pcrSeen, topicId).toBeGreaterThan(0)
    }
  })

  it('Oberstufe generators never emit thin LB/Wahl/subtitle placeholders', () => {
    const thin =
      /^(LB:?\s|Wahl:?\s|Wahlbereich|Anwendungen und Perspektiven|Zellbiologie\.?$|Genregulation\.?$|Molekulare Genetik\.?$|Genexpression\.?$|Einordnung\.?$|Vernetzung\.?$|Systemdenken\.?$|Immunologie\.?$|Dissimilation\.?$|Praxisbezug\.?$|Spezifität\.?$)/i
    for (const id of oberstufeIds) {
      for (let seed = 0; seed < 6; seed++) {
        const text = BIOLOGIE_GENERATORS[id]!(createRng(seed * 41 + 7)).fachwissen?.text?.trim() ?? ''
        expect(text.length, `${id}@${seed}`).toBeGreaterThanOrEqual(80)
        expect(text, `${id}@${seed}`).not.toMatch(thin)
      }
    }
  })

  it('no bio task injects Prüfung-/Wertung-meta into fachwissen', () => {
    const hardMeta = /Prüfung:|Antwort prüfen|Teilpunkte|Groß-\/Kleinschreibung|Karte umdrehen/i
    for (const id of allIds) {
      for (let seed = 0; seed < 3; seed++) {
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
    let maxLeft = 0
    for (let seed = 0; seed < 80; seed++) {
      const task = gen(createRng(seed * 41 + 9))
      if (task.interactive?.type !== 'pairMatch') continue
      expect(task.contentIds?.length ?? 0).toBeGreaterThanOrEqual(3)
      const left = (task.interactive.props?.left as Array<{ label?: string }>) ?? []
      maxLeft = Math.max(maxLeft, left.length)
      for (const id of task.contentIds ?? []) pairKeys.add(id)
    }
    expect(pairKeys.size).toBeGreaterThanOrEqual(8)
    expect(maxLeft).toBeGreaterThanOrEqual(4)
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
        expect(t.fachwissen?.text?.length).toBeGreaterThan(40)
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

describe('Biologie UX: bank slugs, pairMatch duplicates, Fachbegriff spoilers', () => {
  it('stripBioBankSlug removes internal topic keys from prompts', () => {
    expect(stripBioBankSlug('Fachbegriff (baeume): Was bedeutet „Laubbaum“?')).toBe(
      'Fachbegriff: Was bedeutet „Laubbaum“?',
    )
    expect(stripBioBankSlug('Fachbegriff (wirbellose): Was bedeutet „Gliederfüßer“?')).toBe(
      'Fachbegriff: Was bedeutet „Gliederfüßer“?',
    )
    expect(stripBioBankSlug('(wirbellose) Weichtier: Oft mit Schale.')).toBe(
      'Weichtier: Oft mit Schale.',
    )
    expect(stripBioBankSlug('baeume: Laubbaum')).toBe('Laubbaum')
  })

  it('gap/cloze meaning→term does not spoil the Fachbegriff in the question', () => {
    const fact = {
      prompt: 'Fachbegriff (baeume): Was bedeutet „Laubbaum“?',
      answer: 'Wirft Blätter saisonal ab (oft)',
      explanation: 'Laubbäume werfen oft saisonal Blätter ab.',
      wissen:
        'Laubbäume werfen oft saisonal Blätter ab. Das spart Wasser im Winter und schützt vor Frostschäden an der Blattfläche.',
      gap: 'Fachbegriff: ___ — Wirft Blätter saisonal ab (oft)',
      gapAccepted: ['Laubbaum'],
    }
    const gapQ = bioFactQuestion(fact, 'gap')
    expect(gapQ).not.toMatch(/Laubbaum/)
    expect(gapQ).toMatch(/Fachbegriff/i)
    expect(bioQuestionSpoilsTerm(gapQ, fact.gapAccepted)).toBe(false)

    const mcQ = bioFactQuestion(fact, 'mc')
    expect(mcQ).toContain('Laubbaum')
    expect(mcQ).not.toMatch(/\(baeume\)/)
  })

  it('detects accepted answers already present in gap template or unquoted stem', () => {
    expect(
      bioGapTemplateSpoils('Fachbegriff: ___ — Erzeugt Spinnenseide', ['Spinnenseide']),
    ).toBe(true)
    expect(
      bioGapTemplateSpoils('Fachbegriff: ___ — Männliches Blütenorgan mit Pollen', [
        'Staubblatt',
      ]),
    ).toBe(false)
    expect(
      bioTextContainsAcceptedTerm(
        'Welches Merkmal wird oft mit dem aufrechten Gang verbunden?',
        ['aufrecht'],
      ),
    ).toBe(true)
    expect(
      bioFactGapModeSafe(
        {
          prompt: 'Fachbegriff: Was bedeutet „Spinnenseide“?',
          answer: 'x',
          explanation: 'x',
          wissen: 'Spinnenseide ist ein Proteinsekret. Spinnen nutzen sie für Netze und Fangfäden.',
          gap: 'Fachbegriff: ___ — Erzeugt Spinnenseide',
          gapAccepted: ['Spinnenseide'],
        },
        'gap',
      ),
    ).toBe(false)
    expect(
      bioFactGapModeSafe(
        {
          prompt: 'Was ist ein transgener Organismus grob?',
          answer: 'x',
          explanation: 'x',
          wissen:
            'Ein transgener Organismus trägt artfremde Gene. Gentechnik kann solche Veränderungen gezielt einbringen.',
          gap: 'Ein ___ Organismus enthält artfremde Gene durch Gentechnik.',
          gapAccepted: ['transgener'],
        },
        'gap',
      ),
    ).toBe(false)
  })

  it('bankGenerate skips gap templates that already contain the answer', () => {
    const gen = bankGenerate({
      facts: [
        {
          concept: 'bio:test:ux:seide',
          prompt: 'Fachbegriff: Was bedeutet „Spinnenseide“?',
          answer: 'Erzeugt Spinnenseide',
          wrong: ['a', 'b', 'c'],
          explanation: 'x',
          wissen:
            'Spinnenseide ist ein Proteinsekret. Spinnen nutzen sie für Netze und Fangfäden im Beutefang.',
          gap: 'Fachbegriff: ___ — Erzeugt Spinnenseide',
          gapAccepted: ['Spinnenseide'],
        },
      ],
    })
    for (let i = 0; i < 80; i++) {
      const task = gen(createRng(i * 13 + 2))
      if (task.interactive?.type !== 'clozeMulti') continue
      const segs = (task.interactive.props?.segments as string[]) ?? []
      const accepted = ((task.interactive.props?.accepted as string[][]) ?? []).flat()
      const gapText = segs.join(' ')
      for (const a of accepted) {
        expect(bioTextContainsAcceptedTerm(gapText, [a]), `seed ${i} A=${a}`).toBe(false)
      }
      expect(bioTextContainsAcceptedTerm(task.question, accepted), `seed ${i} Q`).toBe(
        false,
      )
    }
  })

  it('live Bio generators: cloze answers never appear in gap text or question', () => {
    const ids = Object.keys(BIOLOGIE_GENERATORS)
    expect(ids.length).toBeGreaterThan(40)
    for (const topicId of ids) {
      const gen = BIOLOGIE_GENERATORS[topicId]!
      for (let i = 0; i < 12; i++) {
        const task = gen(createRng(i * 41 + 9))
        if (task.interactive?.type !== 'clozeMulti') continue
        const segs = (task.interactive.props?.segments as string[]) ?? []
        const accepted = ((task.interactive.props?.accepted as string[][]) ?? []).flat()
        const gapText = segs.join(' ')
        for (const a of accepted) {
          expect(
            bioTextContainsAcceptedTerm(gapText, [a]),
            `${topicId}@${i} gap←${a}`,
          ).toBe(false)
        }
        expect(
          bioTextContainsAcceptedTerm(task.question, accepted),
          `${topicId}@${i} Q`,
        ).toBe(false)
      }
    }
  })

  it('generated bank tasks never show slug tags or term spoilers on gap mode', () => {
    const gen = bankGenerate({
      // Isolated concept — avoid deepenBioBank merging real baeume extras.
      facts: [
        {
          concept: 'bio:test:ux:laub',
          prompt: 'Fachbegriff (baeume): Was bedeutet „Laubbaum“?',
          answer: 'Wirft Blätter saisonal ab (oft)',
          wrong: ['a', 'b', 'c'],
          explanation: 'x',
          wissen:
            'Laubbäume werfen oft saisonal Blätter ab. Das spart Wasser im Winter und schützt vor Frostschäden an der Blattfläche.',
          gap: 'Fachbegriff: ___ — Wirft Blätter saisonal ab (oft)',
          gapAccepted: ['Laubbaum'],
          flashFront: 'baeume: Laubbaum',
        },
      ],
      pairs: [
        {
          term: 'Laubbaum',
          meaning: 'Wirft Blätter saisonal ab (oft)',
          wissen:
            'Laubbäume werfen oft saisonal Blätter ab. Das spart Wasser im Winter und schützt vor Frostschäden an der Blattfläche.',
        },
        {
          term: 'Nadelbaum',
          meaning: 'Meist immergrün mit Nadeln',
          wissen:
            'Nadelbäume behalten meist ihre Nadeln. Das ermöglicht Fotosynthese auch in kühleren Perioden mit wenig Wasserverlust.',
        },
        {
          term: 'Kambium',
          meaning: 'Bildet neues Holz und Bast',
          wissen:
            'Das Kambium bildet neues Holz und Bast. Dadurch wächst der Stamm in die Dicke und leitet Wasser sowie Assimilate.',
        },
      ],
    })

    let sawGap = false
    for (let i = 0; i < 120; i++) {
      const task = gen(createRng(i * 17 + 3))
      expect(task.question).not.toMatch(/Fachbegriff\s*\([a-z]/i)
      expect(task.question).not.toMatch(/^\([a-z0-9_-]+\)/i)
      if (task.interactive?.type === 'flashcardFlip') {
        const front = String(task.interactive.props?.front ?? '')
        expect(front).not.toMatch(/^[a-z0-9_-]+:\s/)
      }
      if (task.interactive?.type === 'clozeMulti') {
        if (/laubbaum/i.test(String(task.solution ?? ''))) {
          sawGap = true
          expect(task.question).not.toMatch(/Laubbaum/i)
          expect(task.question).toMatch(/Fachbegriff/i)
        }
      }
    }
    expect(sawGap).toBe(true)
  })

  it('live wirbellose / baeume generators hide bank slugs', () => {
    for (const topicId of ['bi-k6-lb2-wirbellose', 'bi-k6-lb1-baeume'] as const) {
      const gen = BIOLOGIE_GENERATORS[topicId]
      if (!gen) continue
      for (let i = 0; i < 40; i++) {
        const task = gen(createRng(i + 100))
        expect(task.question, topicId).not.toMatch(/Fachbegriff\s*\([a-z]/i)
        expect(task.question, topicId).not.toMatch(/^\([a-z0-9_-]+\)/i)
      }
    }
  })
})
