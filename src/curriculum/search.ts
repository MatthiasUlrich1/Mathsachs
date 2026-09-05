import { availableCurricula, type CurriculumModule } from './registry'
import type { Grade, Topic } from './types'

/**
 * Normalise text for tolerant matching: lower-case, fold German umlauts and ß
 * to their ASCII spellings (ä→ae, ö→oe, ü→ue, ß→ss) and collapse whitespace.
 * This makes the search case-insensitive and umlaut-tolerant in both
 * directions (typing "flaeche" finds "Fläche" and vice versa).
 */
export const normalize = (text: string): string =>
  text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/\s+/g, ' ')
    .trim()

/** True when every whitespace-separated token of the query occurs in haystack. */
const matches = (haystack: string, query: string): boolean => {
  const tokens = normalize(query).split(' ').filter(Boolean)
  if (tokens.length === 0) return false
  const hay = normalize(haystack)
  return tokens.every((t) => hay.includes(t))
}

/** A grade the user has actually loaded (topics available in memory). */
export interface LoadedGrade {
  moduleId: string
  grade: Grade
}

/** A single search hit within a loaded grade. */
export interface TopicHit {
  moduleId: string
  gradeTitle: string
  areaTitle: string
  topic: Topic
}

/** All searchable text for a topic (title + curated keywords + context). */
const haystackFor = (topic: Topic, areaTitle: string, gradeTitle: string): string =>
  [topic.title, ...(topic.keywords ?? []), areaTitle, gradeTitle].join(' ')

/** Search the topics of the currently loaded grades. */
export const searchTopics = (query: string, loaded: LoadedGrade[]): TopicHit[] => {
  if (normalize(query) === '') return []
  const hits: TopicHit[] = []
  for (const { moduleId, grade } of loaded) {
    for (const area of grade.areas) {
      for (const topic of area.topics) {
        if (matches(haystackFor(topic, area.title, grade.title), query)) {
          hits.push({ moduleId, gradeTitle: grade.title, areaTitle: area.title, topic })
        }
      }
    }
  }
  return hits
}

/**
 * Registry modules that are NOT currently loaded but whose static search hints
 * match the query — used to show "In Klasse X verfügbar – unter Einstellungen →
 * Lehrpläne laden" without importing the ungeladenen grade's topics.
 */
export const searchUnloadedHints = (
  query: string,
  loadedModuleIds: string[],
): CurriculumModule[] => {
  if (normalize(query) === '') return []
  return availableCurricula.filter((mod) => {
    if (loadedModuleIds.includes(mod.id)) return false
    const hay = [mod.gradeTitle, mod.subjectTitle, ...(mod.searchHints ?? [])].join(' ')
    return matches(hay, query)
  })
}
