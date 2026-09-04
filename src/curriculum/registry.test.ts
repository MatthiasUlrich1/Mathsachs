import { describe, it, expect } from 'vitest'
import { createRng } from '../lib/rng'
import { availableCurricula, getCurriculumModule } from './registry'

describe('curriculum registry', () => {
  it('has unique module ids', () => {
    const ids = availableCurricula.map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('offers Klasse 5 and Klasse 6', () => {
    expect(getCurriculumModule('mathematik-klasse-5')).toBeDefined()
    expect(getCurriculumModule('mathematik-klasse-6')).toBeDefined()
  })

  it('lazily loads a real Grade with generatable topics for every module', async () => {
    for (const mod of availableCurricula) {
      const grade = await mod.load()
      expect(grade.id.length).toBeGreaterThan(0)
      expect(grade.areas.length).toBeGreaterThan(0)
      const topics = grade.areas.flatMap((a) => a.topics)
      expect(topics.length).toBeGreaterThan(0)
      const task = topics[0].generate(createRng(1))
      expect(task.check(task.sampleAnswer)).toBe(true)
    }
  })

  // Exam codes (see src/exam) reference tasks globally by (moduleId, topicId).
  // Overlapping topic ids between different modules (e.g. Klasse 5/6) are fine,
  // but within a single module every topic id MUST be unique so a reference can
  // resolve to exactly one topic.
  it('has topic ids that are unique within each module', async () => {
    for (const mod of availableCurricula) {
      const grade = await mod.load()
      const ids = grade.areas.flatMap((a) => a.topics).map((t) => t.id)
      expect(new Set(ids).size, `duplicate topic id in ${mod.id}`).toBe(ids.length)
    }
  })
})
