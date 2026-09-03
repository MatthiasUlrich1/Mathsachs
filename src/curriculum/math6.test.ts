import { describe, it, expect } from 'vitest'
import { createRng } from '../lib/rng'
import { subjects, topicIndex } from './math6'

const allTopics = subjects.flatMap((s) =>
  s.grades.flatMap((g) => g.areas.flatMap((a) => a.topics)),
)

describe('Klasse 6 curriculum', () => {
  it('exposes topics across all five Lernbereiche', () => {
    const areas = subjects[0].grades[0].areas
    expect(areas).toHaveLength(5)
    expect(allTopics.length).toBeGreaterThanOrEqual(20)
  })

  it('has a unique id for every topic', () => {
    const ids = allTopics.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('indexes every topic by id', () => {
    for (const t of allTopics) {
      expect(topicIndex.get(t.id)?.topic.id).toBe(t.id)
    }
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
})
