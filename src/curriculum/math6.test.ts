import { describe, it, expect } from 'vitest'
import { createRng } from '../lib/rng'
import { gcd } from '../lib/fraction'
import { klasse6 } from './math6'

const allTopics = klasse6.areas.flatMap((a) => a.topics)

describe('Klasse 6 curriculum', () => {
  it('exposes topics across all five Lernbereiche', () => {
    expect(klasse6.areas).toHaveLength(5)
    expect(allTopics.length).toBeGreaterThanOrEqual(20)
  })

  it('exposes Fläche-Kante topic as released (ID 2101)', () => {
    const topic = allTopics.find((t) => t.id === 'lb4-flaeche-kante-quader')
    expect(topic?.released).not.toBe(false)
    expect(allTopics.every((t) => t.released !== false)).toBe(true)
  })

  it('matches Quader/Würfel wording to the matching solid SVG', () => {
    const topic = allTopics.find((t) => t.id === 'lb4-flaeche-kante-quader')
    expect(topic).toBeTruthy()
    let sawQuader = false
    let sawWuerfel = false
    let sawFront = false
    let sawRight = false
    let sawTop = false
    let volumeFocus = 0
    for (let seed = 1; seed <= 120; seed++) {
      const task = topic!.generate(createRng(seed))
      const svg = task.visualContent ?? ''
      if (/V = |Volumen|Grundfläche|senkrechte Kante/.test(task.question)) {
        volumeFocus++
      }
      if (task.question.includes('Ein Quader')) {
        sawQuader = true
        expect(svg).toMatch(/aria-label="Quader/)
        expect(svg).not.toContain('polygon points="60,180')
      }
      if (task.question.includes('Ein Würfel')) {
        sawWuerfel = true
        expect(svg).toMatch(/aria-label="Würfel/)
        expect(svg).toContain('stroke-dasharray')
      }
      if (/Vorderfläche/.test(task.question)) sawFront = true
      if (/rechte Seitenfläche/.test(task.question)) sawRight = true
      if (/obere Seitenfläche|Grundfläche/.test(task.question)) sawTop = true
      if (task.question.includes('Ein Prisma')) {
        expect(svg).toContain('h =')
        expect(svg).toContain('G =')
        expect(svg).toContain('text-anchor="end"')
      }
    }
    expect(sawQuader).toBe(true)
    expect(sawWuerfel).toBe(true)
    expect(sawFront).toBe(true)
    expect(sawRight).toBe(true)
    expect(sawTop).toBe(true)
    expect(volumeFocus).toBeGreaterThan(50)
  })

  it('has a unique id for every topic', () => {
    const ids = allTopics.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('generates tasks whose own correct answer passes the check', () => {
    for (const topic of allTopics) {
      for (let seed = 1; seed <= 60; seed++) {
        const task = topic.generate(createRng(seed))
        expect(task.question.length).toBeGreaterThan(0)
        expect(task.explanation.length).toBeGreaterThan(0)
        expect(
          task.check(task.sampleAnswer),
          `${topic.id} seed ${seed}: correct answer rejected (solution ${task.solution})`,
        ).toBe(true)
      }
    }
  })

  it('rejects a clearly wrong answer', () => {
    for (const topic of allTopics) {
      const task = topic.generate(createRng(123))
      const wrong =
        task.sampleAnswer.kind === 'fraction'
          ? { kind: 'fraction' as const, num: '999', den: '1' }
          : { kind: 'value' as const, value: 'zzz' }
      expect(task.check(wrong)).toBe(false)
    }
  })

  it('is deterministic for a given seed', () => {
    for (const topic of allTopics) {
      const a = topic.generate(createRng(7))
      const b = topic.generate(createRng(7))
      expect(a.question).toBe(b.question)
      expect(a.solution).toBe(b.solution)
    }
  })

  it('emits SVG visuals for LB3/LB4 geometry topics', () => {
    const visualIds = [
      'lb3-winkel-dreieck',
      'lb3-winkel-viereck',
      'lb3-umfang-rechteck',
      'lb3-flaeche-rechteck',
      'lb3-flaeche-dreieck',
      'lb4-volumen-quader',
      'lb4-oberflaeche-quader',
      'lb4-volumen-prisma',
      'lb4-flaeche-kante-quader',
    ]
    for (const id of visualIds) {
      const topic = allTopics.find((t) => t.id === id)
      expect(topic, id).toBeTruthy()
      let sawVisual = false
      for (let seed = 1; seed <= 80; seed++) {
        const task = topic!.generate(createRng(seed))
        if (task.visualContent?.includes('<svg')) {
          sawVisual = true
          break
        }
      }
      expect(sawVisual, `${id} should produce SVG for some seeds`).toBe(true)
    }
  })

  it('emits graphics or number-line for Plan B fraction/share topics', () => {
    const visualIds = [
      'lb1-kuerzen',
      'lb1-vergleichen',
      'lb1-add-sub-brueche',
      'lb1-bruch-dezimal',
      'lb1-prozent',
      'lb2-haeufigkeit',
      'lb5-anteil-groesse',
      'lb5-anteil-prozent',
    ]
    for (const id of visualIds) {
      const topic = allTopics.find((t) => t.id === id)
      expect(topic, id).toBeTruthy()
      let saw = false
      for (let seed = 1; seed <= 100; seed++) {
        const task = topic!.generate(createRng(seed))
        if (
          task.visualContent?.includes('<svg') ||
          task.interactive?.type === 'numberLine' ||
          task.interactive?.type === 'dragDropSort'
        ) {
          saw = true
          break
        }
      }
      expect(saw, `${id} should produce visual/interactive for some seeds`).toBe(true)
    }
  })

  it('lb1-kuerzen visuals are proper partial fractions matching the answer pipeline', () => {
    const topic = allTopics.find((t) => t.id === 'lb1-kuerzen')
    expect(topic).toBeTruthy()
    let visualCount = 0
    for (let seed = 1; seed <= 400; seed++) {
      const task = topic!.generate(createRng(seed))
      const svg = task.visualContent
      if (!svg?.includes('<svg')) continue
      visualCount++

      const explained = task.explanation.match(/(\d+) von (\d+)/)
      expect(explained, `seed ${seed}: missing "X von Y" in explanation`).toBeTruthy()
      const colored = Number(explained![1])
      const total = Number(explained![2])

      // Never a full whole; always needs shortening
      expect(colored, `seed ${seed}`).toBeGreaterThan(0)
      expect(colored, `seed ${seed}`).toBeLessThan(total)
      expect(gcd(colored, total), `seed ${seed}: already reduced visually`).toBeGreaterThan(1)

      const sol = task.solution.match(/^(\d+)\/(\d+)$/)
      expect(sol, `seed ${seed}: solution must be a/b`).toBeTruthy()
      const sn = Number(sol![1])
      const sd = Number(sol![2])
      expect(gcd(sn, sd), `seed ${seed}`).toBe(1)
      expect(sn, `seed ${seed}: reduced must stay proper`).toBeLessThan(sd)
      expect(sd, `seed ${seed}: no integer answers like 2/1`).toBeGreaterThan(1)
      expect(sn * total, `seed ${seed}: value mismatch`).toBe(sd * colored)

      // Segment count and fill count must match unsimplified fraction
      const fills = [...svg.matchAll(/\bfill="([^"]+)"/g)].map((m) => m[1])
      const empty = '#ecf0f1'
      const segmentFills = fills.filter((f) => f !== '#f8fafc')
      expect(segmentFills.length, `seed ${seed}: segment count`).toBe(total)
      const filledCount = segmentFills.filter((f) => f !== empty).length
      expect(filledCount, `seed ${seed}: colored segments`).toBe(colored)
    }
    expect(visualCount).toBeGreaterThan(80)
  })

  it('emits tables/graphs for Plan C assignment topics', () => {
    const visualIds = ['lb2-proportional', 'lb2-antiproportional', 'lb2-sachaufgabe-dreisatz']
    for (const id of visualIds) {
      const topic = allTopics.find((t) => t.id === id)
      expect(topic, id).toBeTruthy()
      let saw = false
      for (let seed = 1; seed <= 120; seed++) {
        const task = topic!.generate(createRng(seed))
        if (task.visualContent?.includes('<svg')) {
          saw = true
          break
        }
      }
      expect(saw, `${id} should produce SVG for some seeds`).toBe(true)
    }
  })
})
