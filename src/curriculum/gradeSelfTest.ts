import { expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { ensureGradeFachwissen } from './fachwissen'
import type { Grade } from './types'

/**
 * Shared Vitest invariants for a generatable Grade, mirroring math6.test.ts:
 * over many seeds every generated task must self-check, carry a non-empty
 * question/explanation, have a class-unique id, be deterministic per seed and
 * reject an obviously wrong answer.
 *
 * Wissen is ensured like in production hydrate (Issue #45 default).
 */
export const runGradeSelfTest = (
  grade: Grade,
  opts: {
    idPrefix: string
    areaCount: number
    minTopics: number
    seeds?: number
    subject?: string
  },
): void => {
  const ensured = ensureGradeFachwissen(grade, { subject: opts.subject ?? 'Mathematik' })
  const allTopics = ensured.areas.flatMap((a) => a.topics)
  const seeds = opts.seeds ?? 120

  it(`exposes ${opts.areaCount} Lernbereiche with enough topics`, () => {
    expect(ensured.areas).toHaveLength(opts.areaCount)
    expect(allTopics.length).toBeGreaterThanOrEqual(opts.minTopics)
  })

  it('has a unique, class-prefixed id for every topic', () => {
    const ids = allTopics.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id.startsWith(opts.idPrefix)).toBe(true)
  })

  it('includes Wissen (Fachwissen) for every topic unless excluded', () => {
    for (const topic of allTopics) {
      if (topic.excludeFachwissen) {
        expect(topic.fachwissen, topic.id).toBeUndefined()
        continue
      }
      expect(topic.fachwissen?.text?.trim().length, topic.id).toBeGreaterThan(40)
    }
  })

  it('generates tasks whose own correct answer passes the check', () => {
    for (const topic of allTopics) {
      for (let seed = 1; seed <= seeds; seed++) {
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
          : { kind: 'value' as const, value: 'definitiv-falsch' }
      expect(
        task.check(wrong),
        `${topic.id}: wrong answer unexpectedly accepted`,
      ).toBe(false)
    }
  })

  it('is deterministic for a given seed', () => {
    for (const topic of allTopics) {
      const a = topic.generate(createRng(7))
      const b = topic.generate(createRng(7))
      expect(a.question).toBe(b.question)
      expect(a.solution).toBe(b.solution)
      expect(a.explanation).toBe(b.explanation)
    }
  })
}
