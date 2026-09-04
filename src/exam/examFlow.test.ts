import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import {
  CURRICULUM_VERSION,
  getCurriculumModule,
} from '../curriculum/registry'
import type { UserInput } from '../curriculum/types'
import {
  buildExamLink,
  decodeExam,
  encodeExam,
  parseExamHash,
  resolveExam,
} from './examCode'
import type { ExamSpec, ExamTaskRef } from './types'

/**
 * End-to-end integration test mirroring the real teacher (ExamBuilder) →
 * student (ExamRunner) flow through the actual code paths: pick topics, build a
 * spec from concrete seeds, encode → share link → decode, resolve into tasks
 * and grade a mixed set of answers.
 */
describe('exam builder → runner flow', () => {
  it('produces a shareable code that grades exactly like the teacher preview', async () => {
    const moduleId = 'mathematik-klasse-6'
    const grade = await getCurriculumModule(moduleId)!.load()
    const topics = grade.areas.flatMap((a) => a.topics)

    // Teacher (ExamBuilder): choose three topics with fixed proposal seeds.
    const picks = [
      { topic: topics[0], seed: 1001 },
      { topic: topics[1], seed: 2002 },
      { topic: topics[2], seed: 3003 },
    ]
    const aufgaben: ExamTaskRef[] = picks.map((p) => ({
      modul: moduleId,
      thema: p.topic.id,
      seed: p.seed,
      punkte: p.topic.pointsPerTask,
    }))
    const spec: ExamSpec = {
      schema: 'A',
      curriculumVersion: CURRICULUM_VERSION,
      titel: 'Integrationstest-Klausur',
      aufgaben,
    }

    // What the teacher sees in the proposal pool.
    const preview = picks.map((p) => p.topic.generate(createRng(p.seed)))

    // Share as a code + link, then decode on the student's device.
    const code = encodeExam(spec)
    const link = buildExamLink(code)
    const roundTripped = decodeExam(parseExamHash(link.slice(link.indexOf('#')))!)
    expect(roundTripped).toEqual(spec)

    // Student (ExamRunner): resolve into runnable tasks.
    const resolved = await resolveExam(roundTripped)
    expect(resolved.map((r) => r.task.question)).toEqual(
      preview.map((t) => t.question),
    )

    // Student answers: #0 correct, #1 wrong, #2 correct.
    const wrong: UserInput = { kind: 'value', value: 'definitiv-falsch' }
    const answers: UserInput[] = [
      resolved[0].task.sampleAnswer,
      wrong,
      resolved[2].task.sampleAnswer,
    ]
    const graded = resolved.map((r, i) => ({
      correct: r.task.check(answers[i]),
      earned: r.task.check(answers[i]) ? r.punkte : 0,
      possible: r.punkte,
    }))

    const earned = graded.reduce((s, g) => s + g.earned, 0)
    const possible = graded.reduce((s, g) => s + g.possible, 0)
    expect(graded[0].correct).toBe(true)
    expect(graded[1].correct).toBe(false)
    expect(graded[2].correct).toBe(true)
    expect(earned).toBe(picks[0].topic.pointsPerTask + picks[2].topic.pointsPerTask)
    expect(possible).toBe(
      picks[0].topic.pointsPerTask +
        picks[1].topic.pointsPerTask +
        picks[2].topic.pointsPerTask,
    )
  })
})
