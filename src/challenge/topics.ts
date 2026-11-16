import { legacyNeuIdToParent } from '../curriculum/mergeNeu'
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
  // `<parent>__neu` aus alten Challenges → Parent (Neu-Themen wurden gemergt).
  const parentId = legacyNeuIdToParent(topicId)
  if (parentId !== topicId) return findLoadedTopic(loaded, parentId)
  return null
}
