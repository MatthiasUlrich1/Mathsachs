import type { Grade, Topic } from '../curriculum/types'

export interface LoadedGrade {
  moduleId: string
  grade: Grade
}

export interface ResolvedTopic {
  topic: Topic
  areaTitle: string
  gradeTitle: string
}

export function findLoadedTopic(
  loaded: LoadedGrade[],
  topicId: string,
): ResolvedTopic | null {
  for (const { grade } of loaded) {
    for (const area of grade.areas) {
      const topic = area.topics.find((item) => item.id === topicId)
      if (topic) return { topic, areaTitle: area.title, gradeTitle: grade.title }
    }
  }
  return null
}
