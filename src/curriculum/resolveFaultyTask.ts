import { topicContentId } from './contentId'
import { loadInstalledGrade } from './loadGrade'
import { listVisibleGradeModules } from './registry'
import type { Topic } from './types'

export interface ResolvedFaultyTopic {
  topic: Topic
  areaTitle: string
  gradeTitle: string
  moduleId: string
}

/**
 * Locate a reported task in installed Lehrpläne by topicId and/or contentId.
 * Prefers an exact topicId match when present.
 */
export async function resolveFaultyTask(report: {
  contentId: number
  topicId?: string
}): Promise<ResolvedFaultyTopic | null> {
  const topicId = report.topicId?.trim() || ''
  const modules = listVisibleGradeModules()

  if (topicId) {
    for (const mod of modules) {
      const grade = await loadInstalledGrade(mod.id).catch(() => null)
      if (!grade) continue
      for (const area of grade.areas) {
        const topic = area.topics.find((t) => t.id === topicId)
        if (topic) {
          return {
            topic,
            areaTitle: area.title,
            gradeTitle: grade.title,
            moduleId: mod.id,
          }
        }
      }
    }
  }

  for (const mod of modules) {
    const grade = await loadInstalledGrade(mod.id).catch(() => null)
    if (!grade) continue
    for (const area of grade.areas) {
      const topic = area.topics.find((t) => {
        const id =
          typeof t.contentId === 'number' && Number.isFinite(t.contentId)
            ? Math.floor(t.contentId)
            : topicContentId(t.id)
        return id === report.contentId
      })
      if (topic) {
        return {
          topic,
          areaTitle: area.title,
          gradeTitle: grade.title,
          moduleId: mod.id,
        }
      }
    }
  }

  return null
}
