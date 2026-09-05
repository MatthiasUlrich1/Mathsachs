import { bundledCurricula } from './bundled'
import type { Grade } from './types'
import {
  GYM_SACHSEN_PACK_ID,
  packContentHash,
  type CurriculumPack,
  type PackArea,
  type PackExtra,
  type PackGrade,
  type PackTopic,
} from './pack'

const GRADE_META = Object.fromEntries(
  bundledCurricula.map((mod) => [
    mod.id,
    {
      subjectTitle: mod.subjectTitle,
      gradeTitle: mod.gradeTitle,
      description: mod.description,
      searchHints: mod.searchHints,
    },
  ]),
)

const topicMeta = (topic: {
  id: string
  title: string
  hint?: string
  pointsPerTask: number
  keywords?: string[]
}): PackTopic => ({
  id: topic.id,
  title: topic.title,
  hint: topic.hint,
  pointsPerTask: topic.pointsPerTask,
  ...(topic.keywords?.length ? { keywords: topic.keywords } : {}),
})

export function gradeToPackGrade(
  grade: Grade,
  meta = GRADE_META[grade.id],
): PackGrade {
  return {
    id: grade.id,
    title: grade.title,
    subjectTitle: meta?.subjectTitle ?? 'Mathematik',
    gradeTitle: meta?.gradeTitle ?? grade.title,
    description: meta?.description ?? '',
    ...(meta?.searchHints?.length ? { searchHints: meta.searchHints } : {}),
    areas: grade.areas.map(
      (area): PackArea => ({
        id: area.id,
        title: area.title,
        ustd: area.ustd,
        topics: area.topics.map(topicMeta),
      }),
    ),
  }
}

export const GYM_SACHSEN_SEED_EXTRAS: PackExtra[] = [
  {
    id: 'extra-k5-kopfrechnen-zehner',
    gradeId: 'mathematik-klasse-5',
    areaId: 'lb1',
    source: 'lehrer',
    topic: {
      id: 'extra-k5-kopfrechnen-zehner',
      title: 'Kopfrechnen mit Zehnerzahlen',
      hint: 'Zehner plus Zehner, ohne Schriftlich-Rechnen.',
      pointsPerTask: 10,
      keywords: ['Kopfrechnen', 'Zehner', 'Lehrer'],
    },
    tasks: [
      {
        kind: 'value',
        answerKind: 'integer',
        question: 'Berechne: 30 + 40',
        value: 70,
        solution: '70',
        explanation: '30 + 40 = 70.',
      },
      {
        kind: 'value',
        answerKind: 'integer',
        question: 'Berechne: 80 − 50',
        value: 30,
        solution: '30',
        explanation: '80 − 50 = 30.',
      },
    ],
  },
]

export async function buildGymSachsenSeed(): Promise<CurriculumPack> {
  const official: PackGrade[] = []
  for (const mod of bundledCurricula) {
    official.push(gradeToPackGrade(await mod.load()))
  }
  const extras = GYM_SACHSEN_SEED_EXTRAS
  return {
    id: GYM_SACHSEN_PACK_ID,
    title: 'Gymnasium Sachsen · Mathematik',
    region: 'Sachsen',
    school: 'Gymnasium',
    subject: 'Mathematik',
    version: '1.0.0',
    changelog:
      'Erstfassung: Klassen 5–10 und Jahrgangsstufe 11/12 (Grundkurs), plus getrennte Lehrer-Ergänzungen.',
    contentHash: packContentHash(official, extras),
    official,
    extras,
  }
}

export const GYM_SACHSEN_PACK_VERSION = '1.0.0'
