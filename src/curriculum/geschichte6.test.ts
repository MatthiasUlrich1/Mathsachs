import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createRng } from '../lib/rng'
import { GESCHICHTE_K6_GENERATORS, ROM_YEAR_FACT_COUNT } from './geschichte6'
import { isPlayableGeschichteTopic, resolveGeschichteGenerate } from './geschichteGenerators'
import { hydratePackGrades } from './hydrate'
import { buildGymSachsenGeschichtePack } from './geschichteGymPack'
import { buildUniqueTaskRound, taskFingerprint } from './uniqueRound'

describe('Geschichte K6 Römische Zivilisation', () => {
  const romIds = Object.keys(GESCHICHTE_K6_GENERATORS)

  it('registers generators for all Rom LB1 practice topics', () => {
    expect(romIds.length).toBeGreaterThanOrEqual(8)
    for (const id of romIds) {
      expect(isPlayableGeschichteTopic(id), id).toBe(true)
      expect(resolveGeschichteGenerate(id)).toBeTypeOf('function')
    }
  })

  it('generates checkable tasks for each Rom topic', () => {
    for (const id of romIds) {
      const gen = GESCHICHTE_K6_GENERATORS[id]!
      for (let seed = 1; seed <= 12; seed++) {
        const task = gen(createRng(seed))
        expect(task.question.length, id).toBeGreaterThan(10)
        expect(task.check(task.sampleAnswer), `${id} seed ${seed}`).toBe(true)
      }
    }
  })

  it('jahreszahlen topic is year-only (always year ask)', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const task = GESCHICHTE_K6_GENERATORS['ge-k6-lb1-jahreszahlen']!(createRng(seed))
      const yearAsk =
        task.answerKind === 'integer' ||
        /\d{3}\s*v\.\s*Chr/i.test(task.question) ||
        /Welches Jahr|welchem Jahr|Jahreszahl|Wann geschah/i.test(task.question)
      expect(yearAsk, `seed ${seed}: ${task.question.slice(0, 60)}`).toBe(true)
      expect(task.check(task.sampleAnswer)).toBe(true)
    }
  })

  it('jahreszahlen rounds have unique years (no double/triple same event)', () => {
    const gen = GESCHICHTE_K6_GENERATORS['ge-k6-lb1-jahreszahlen']!
    // Reported seed + many random round seeds (target > pool → must cap at unique years).
    const seeds = [1978221244, 1, 7, 42, 99, 12345, 999991, 0x5eed, 0xcafe, 0xbabe]
    for (const seed of seeds) {
      const round = buildUniqueTaskRound(gen, createRng(seed), 20, 50)
      expect(round.length, `seed ${seed}`).toBe(ROM_YEAR_FACT_COUNT)
      const keys = round.map(taskFingerprint)
      expect(new Set(keys).size, `seed ${seed} fingerprints`).toBe(round.length)
      const years = round.map((t) => {
        expect(t.dedupeKey, `seed ${seed} missing dedupeKey`).toMatch(/^rom-year:\d+$/)
        return t.dedupeKey!
      })
      expect(new Set(years).size, `seed ${seed} years`).toBe(round.length)
    }
  })

  it('does not put Merkhilfe spoilers into year questions', () => {
    for (let seed = 1; seed <= 30; seed++) {
      const task = GESCHICHTE_K6_GENERATORS['ge-k6-lb1-jahreszahlen']!(createRng(seed))
      expect(task.question).not.toMatch(/Merkhilfe|schlüpft aus dem Ei|Carthago delenda/i)
      expect(task.explanation.length).toBeGreaterThan(10)
    }
  })

  it('jahreszahlen Fachwissen is about the asked year/event (not whole LB1 dump)', () => {
    const seenYears = new Set<string>()
    for (let seed = 1; seed <= 50; seed++) {
      const task = GESCHICHTE_K6_GENERATORS['ge-k6-lb1-jahreszahlen']!(createRng(seed))
      const fw = task.fachwissen?.text ?? ''
      expect(fw.length, `seed ${seed}`).toBeGreaterThan(40)
      // Not the old topic-wide dump covering every LB1 strand at once.
      expect(fw).not.toMatch(/Bürgerrecht: Schutz, Verträge/)
      expect(fw).not.toMatch(/Ämter: Konsuln, Prätoren/)
      // Must mention a year from YEAR_FACTS (question-specific).
      const yearMatch = fw.match(/\b(753|1000|700|500|264|241|218|202|201|149|146)\b/)
      expect(yearMatch, `seed ${seed}: ${fw.slice(0, 80)}`).toBeTruthy()
      seenYears.add(yearMatch![1]!)
      // Fachwissen should relate to this task's solution year when answer is a year.
      if (task.answerKind === 'integer') {
        expect(fw).toContain(String(task.solution))
      } else if (/^\d{3,4}\s*v\.\s*Chr/.test(task.solution)) {
        const y = task.solution.match(/(\d{3,4})/)?.[1]
        if (y) expect(fw).toContain(y)
      } else {
        // Event-choice: solution is the event string — fachwissen should share year from question.
        const qYear = task.question.match(/(\d{3,4})\s*v\.\s*Chr/)?.[1]
        if (qYear) expect(fw).toContain(qYear)
      }
    }
    expect(seenYears.size).toBeGreaterThan(3)
  })

  it('every LB1 Rom task attaches question-specific Fachwissen', () => {
    for (const id of romIds) {
      for (let seed = 1; seed <= 15; seed++) {
        const task = GESCHICHTE_K6_GENERATORS[id]!(createRng(seed))
        expect(task.fachwissen?.text.trim().length, `${id} seed ${seed}`).toBeGreaterThan(40)
      }
    }
  })

  it('begriffe match uses slotLabels (terms on the left)', () => {
    let found = 0
    for (let seed = 1; seed <= 40; seed++) {
      const task = GESCHICHTE_K6_GENERATORS['ge-k6-lb1-begriffe']!(createRng(seed))
      if (task.interactive?.type !== 'dragDropSlots') continue
      const labels = task.interactive.props.slotLabels as string[] | undefined
      if (!labels?.length) continue
      const okCore = labels[0] === 'Republik' && labels.includes('Senat')
      const okExtra = labels[0] === 'res publica' && labels.includes('SPQR')
      expect(okCore || okExtra, `seed ${seed}: ${labels.join(', ')}`).toBe(true)
      expect(task.question).not.toMatch(/Platz 1\s*=/)
      found += 1
    }
    expect(found).toBeGreaterThan(5)
  })

  it('punische topic does not ask to type a year', () => {
    for (let seed = 1; seed <= 25; seed++) {
      const task = GESCHICHTE_K6_GENERATORS['ge-k6-lb1-punische-kriege']!(createRng(seed))
      expect(task.answerKind).not.toBe('integer')
      expect(task.question).not.toMatch(/Nur die Jahreszahl|Jahr v\. Chr\. \(nur/)
    }
  })

  it('never serves Platzhalter stubs for Rom LB1 topics', () => {
    for (const id of romIds) {
      for (let seed = 1; seed <= 5; seed++) {
        const task = GESCHICHTE_K6_GENERATORS[id]!(createRng(seed))
        expect(task.question).not.toMatch(/Übungsaufgaben folgen|Tippe „ok“/)
      }
    }
  })

  it('hydrates K6 LB1 with playable Rom topics (all released)', async () => {
    const grades = await hydratePackGrades(buildGymSachsenGeschichtePack())
    const k6 = grades.find((g) => g.id === 'geschichte-klasse-6')!
    const lb1 = k6.areas.find((a) => a.id === 'lb1')!
    expect(lb1.topics.length).toBeGreaterThanOrEqual(8)
    expect(lb1.topics.every((t) => t.released !== false)).toBe(true)
    expect(lb1.topics.every((t) => !t.outlineOnly)).toBe(true)
    expect(lb1.topics.some((t) => t.id === 'ge-k6-lb1-jahreszahlen')).toBe(true)
    const punisch = lb1.topics.find((t) => t.id === 'ge-k6-lb1-punische-kriege')!
    const task = punisch.generate(createRng(5))
    expect(task.check(task.sampleAnswer)).toBe(true)
  })

  it('chronologie sort labels have no ordinal war-number spoilers', () => {
    for (let seed = 1; seed <= 60; seed++) {
      const task = GESCHICHTE_K6_GENERATORS['ge-k6-lb1-chronologie']!(createRng(seed))
      if (task.interactive?.type !== 'dragDropSort') continue
      const items = task.interactive.props.items as Array<{ label: string }>
      for (const item of items) {
        expect(item.label, `seed ${seed}`).not.toMatch(/\b[123]\.\s*Punisch/i)
        expect(item.label, `seed ${seed}`).not.toMatch(/Erster|Zweiter|Dritter Punischer/i)
      }
    }
  })

  it('weltreich serves Commons map images for expansion tasks', () => {
    let withMap = 0
    let withEarly = 0
    let withExtent = 0
    let colorAskWithPhase = 0
    for (let seed = 1; seed <= 80; seed++) {
      const task = GESCHICHTE_K6_GENERATORS['ge-k6-lb1-weltreich']!(createRng(seed))
      expect(task.check(task.sampleAnswer)).toBe(true)
      const vc = task.visualContent ?? ''
      const q = task.question ?? ''
      // No spoiler captions that restate color+year before check; attribution only under map
      expect(vc).not.toMatch(/Legende beachten/i)
      expect(vc).not.toMatch(/Tipp:/i)
      expect(vc).not.toMatch(/Hellrot:\s*133/i)
      expect(vc).not.toMatch(/Dunkelrot:\s*218/i)
      expect(q).not.toMatch(/Varana-Karte/i)
      expect(q).not.toMatch(/Welche Karte zeigt/i)
      if (/Was zeigt die .+ Farbe auf dieser Karte\?/.test(q)) {
        colorAskWithPhase += 1
        const labels =
          task.interactive?.type === 'choicePick'
            ? (task.interactive.props.choices as string[])
            : []
        expect(labels.length).toBeGreaterThan(1)
        expect(labels.some((l) => /—/.test(l))).toBe(true)
        expect(labels.every((l) => !/^\d+\s*[vn]\.\s*Chr\.\s*$/.test(l))).toBe(true)
      }
      if (vc.includes('/maps/roman-') || vc.includes('/maps/roma-antiga')) {
        withMap += 1
        expect(vc).toContain('<img')
        expect(vc).not.toContain('<svg')
        expect(vc).toMatch(/figcaption/i)
        expect(vc).toMatch(/Wikimedia Commons/)
      }
      if (vc.includes('roma-antiga-500bc') || vc.includes('roman-conquest-of-italy')) withEarly += 1
      if (vc.includes('roman-extent-218bc-117ad-varana')) withExtent += 1
    }
    expect(withMap).toBeGreaterThan(5)
    expect(withEarly).toBeGreaterThan(0)
    expect(withExtent).toBeGreaterThan(0)
    expect(colorAskWithPhase).toBeGreaterThan(5)
  })

  it('releases weltreich (Mare Nostrum); other K6 LB1 topics stay released', async () => {
    const grades = await hydratePackGrades(buildGymSachsenGeschichtePack())
    const lb1 = grades
      .find((g) => g.id === 'geschichte-klasse-6')!
      .areas.find((a) => a.id === 'lb1')!
    const weltreich = lb1.topics.find((t) => t.id === 'ge-k6-lb1-weltreich')!
    expect(weltreich.released).toBe(true)
    expect(lb1.topics.every((t) => t.released !== false)).toBe(true)
  })
})

describe('DragDropSlots match layout', () => {
  it('renders terms on the left when slotLabels are set', async () => {
    const { DragDropSlots } = await import('../components/DragDropSlots')
    const html = renderToStaticMarkup(
      createElement(DragDropSlots, {
        items: [
          { label: 'öffentliche Sache', value: 0 },
          { label: 'Rat der Ältesten', value: 1 },
          { label: 'Adlige', value: 2 },
          { label: 'Volk', value: 3 },
          { label: 'König', value: 4 },
        ],
        slots: [null, null, null, null],
        onChange: () => {},
        slotLabels: ['Republik', 'Senat', 'Patrizier', 'Plebejer'],
        instruction: 'Zuordnen',
      }),
    )
    expect(html).toContain('drag-drop-slots__match')
    expect(html).toContain('Republik')
    expect(html).toContain('Senat')
    expect(html).toContain('Patrizier')
    expect(html).toContain('Plebejer')
  })
})
