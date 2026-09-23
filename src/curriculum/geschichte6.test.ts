import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createRng } from '../lib/rng'
import { GESCHICHTE_K6_GENERATORS } from './geschichte6'
import { isPlayableGeschichteTopic, resolveGeschichteGenerate } from './geschichteGenerators'
import { hydratePackGrades } from './hydrate'
import { buildGymSachsenGeschichtePack } from './geschichteGymPack'

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
      expect(labels).toEqual(['Republik', 'Senat', 'Patrizier', 'Plebejer'])
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

  it('hydrates K6 LB1 with playable Rom topics (still locked)', async () => {
    const grades = await hydratePackGrades(buildGymSachsenGeschichtePack())
    const k6 = grades.find((g) => g.id === 'geschichte-klasse-6')!
    const lb1 = k6.areas.find((a) => a.id === 'lb1')!
    expect(lb1.topics.length).toBeGreaterThanOrEqual(8)
    expect(lb1.topics.every((t) => t.released === false)).toBe(true)
    expect(lb1.topics.every((t) => !t.outlineOnly)).toBe(true)
    expect(lb1.topics.some((t) => t.id === 'ge-k6-lb1-jahreszahlen')).toBe(true)
    const punisch = lb1.topics.find((t) => t.id === 'ge-k6-lb1-punische-kriege')!
    const task = punisch.generate(createRng(5))
    expect(task.check(task.sampleAnswer)).toBe(true)
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
