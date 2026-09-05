import { makeFraction } from '../lib/fraction'
import { pick, type Rng } from '../lib/rng'
import { getBundledModule } from './bundled'
import type { CurriculumPack, PackExtra, PackTask } from './pack'
import { fractionTask, textTask, valueTask } from './taskHelpers'
import type { Grade, Task, Topic, TopicArea } from './types'

const taskFromPack = (spec: PackTask): Task => {
  if (spec.kind === 'fraction' || spec.answerKind === 'fraction') {
    return fractionTask({
      question: spec.question,
      unit: spec.unit,
      value: makeFraction(
        spec.numerator ?? 1,
        spec.denominator && spec.denominator !== 0 ? spec.denominator : 1,
      ),
      solution: spec.solution,
      explanation: spec.explanation,
    })
  }
  if (spec.kind === 'text' || spec.answerKind === 'text') {
    return textTask({
      question: spec.question,
      accepted: spec.accepted?.length ? spec.accepted : [spec.solution],
      solution: spec.solution,
      explanation: spec.explanation,
    })
  }
  return valueTask({
    question: spec.question,
    unit: spec.unit,
    answerKind: spec.answerKind === 'decimal' ? 'decimal' : 'integer',
    value: spec.value ?? 0,
    solution: spec.solution,
    explanation: spec.explanation,
  })
}

const extraTopic = (extra: PackExtra, fallback?: Topic): Topic => {
  const tasks = extra.tasks ?? []
  return {
    id: extra.topic.id,
    title: extra.topic.title,
    hint: extra.topic.hint,
    pointsPerTask: extra.topic.pointsPerTask,
    keywords: extra.topic.keywords,
    source: 'lehrer',
    extraId: extra.id,
    generate: (rng: Rng) => {
      if (tasks.length > 0) return taskFromPack(pick(rng, tasks))
      if (fallback) return fallback.generate(rng)
      return textTask({
        question: extra.topic.title,
        accepted: ['ok'],
        solution: 'ok',
        explanation: 'Lehrer-Ergänzung ohne hinterlegte Aufgabe.',
      })
    },
  }
}

const attachExtras = (grade: Grade, extras: PackExtra[], packGradeId: string): Grade => {
  if (extras.length === 0) return grade
  const areas: TopicArea[] = grade.areas.map((area) => {
    const forArea = extras.filter(
      (item) =>
        item.areaId === area.id && (item.gradeId === grade.id || item.gradeId === packGradeId),
    )
    if (forArea.length === 0) return area
    const existing = new Set(area.topics.map((topic) => topic.id))
    const added: Topic[] = []
    for (const extra of forArea) {
      if (existing.has(extra.topic.id)) continue
      added.push(extraTopic(extra))
      existing.add(extra.topic.id)
    }
    return added.length ? { ...area, topics: [...area.topics, ...added] } : area
  })
  return { ...grade, areas }
}

const markOfficial = (grade: Grade): Grade => ({
  ...grade,
  areas: grade.areas.map((area) => ({
    ...area,
    topics: area.topics.map((topic) =>
      topic.source ? topic : { ...topic, source: 'official' as const },
    ),
  })),
})

export async function hydratePackGrades(pack: CurriculumPack): Promise<Grade[]> {
  const grades: Grade[] = []
  for (const official of pack.official) {
    const runtime = getBundledModule(official.id)
    let grade: Grade
    if (runtime) {
      grade = await runtime.load()
    } else {
      grade = {
        id: official.id,
        title: official.title,
        packId: pack.id,
        areas: official.areas.map((area) => ({
          id: area.id,
          title: area.title,
          ustd: area.ustd,
          topics: area.topics.map((topic) =>
            extraTopic({
              id: topic.id,
              gradeId: official.id,
              areaId: area.id,
              source: 'lehrer',
              topic,
            }),
          ),
        })),
      }
    }
    const extras = pack.extras.filter(
      (item) => item.gradeId === official.id || item.gradeId === grade.id,
    )
    grades.push(
      markOfficial({ ...attachExtras(grade, extras, official.id), packId: pack.id }),
    )
  }
  return grades
}

export function extraIdsInGrade(grade: Grade): string[] {
  return grade.areas.flatMap((area) =>
    area.topics.filter((topic) => topic.source === 'lehrer').map((topic) => topic.id),
  )
}
