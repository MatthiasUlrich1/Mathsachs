import { describe, it, expect } from 'vitest'
import { createRng } from '../lib/rng'
import { klasse6 } from './math6'

const allTopics = klasse6.areas.flatMap((a) => a.topics)

describe('Klasse 6 curriculum', () => {
  it('exposes topics across all five Lernbereiche', () => {
    expect(klasse6.areas).toHaveLength(5)
    expect(allTopics.length).toBeGreaterThanOrEqual(20)
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
})
