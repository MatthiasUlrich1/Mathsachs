import type { Grade } from '../curriculum/types'
import { isNeuTopic } from '../curriculum/placeholderNeuIds'
import { isCurriculumPreviewRole } from './roles'

/** Minimal Form eines Themas (Seed-Thema, Pack-Thema oder hydriertes Topic). */
export interface TopicLike {
  id?: string
  released?: boolean
  neu?: boolean
}

/** Gesperrt = `released:false` oder noch nicht freigegebenes `__neu`-Thema. */
export function isTopicLocked(topic: TopicLike): boolean {
  if (topic.released === false) return true
  if (topic.released === true) return false
  return topic.neu === true || (topic.id !== undefined && isNeuTopic(topic.id))
}

/**
 * Zentrale Sichtbarkeitsregel: gesperrte Themen sehen nur Pruefer und Entwickler.
 * Fuer alle anderen Rollen (auch Lehrer/Eltern/unbekannt) werden sie nirgends aufgelistet.
 */
export function isTopicVisible(topic: TopicLike, role?: unknown): boolean {
  return !isTopicLocked(topic) || isCurriculumPreviewRole(role)
}

/** Entfernt gesperrte Themen und dadurch leer gewordene Lernbereiche. */
export function filterGradeForRole(grade: Grade, role?: unknown): Grade {
  if (isCurriculumPreviewRole(role)) return grade
  const areas = grade.areas
    .map((area) => ({
      area,
      topics: area.topics.filter((topic) => isTopicVisible(topic, role)),
    }))
    .filter(({ area, topics }) => topics.length > 0 || area.topics.length === 0)
    .map(({ area, topics }) => (topics.length === area.topics.length ? area : { ...area, topics }))
  return { ...grade, areas }
}

/** Wie {@link filterGradeForRole} fuer geladene Klassenstufen; Stufen ohne sichtbares Thema entfallen. */
export function filterLoadedForRole<T extends { grade: Grade }>(
  loaded: T[],
  role?: unknown,
): T[] {
  if (isCurriculumPreviewRole(role)) return loaded
  return loaded
    .map((row) => ({ ...row, grade: filterGradeForRole(row.grade, role) }))
    .filter((row, i) => row.grade.areas.length > 0 || loaded[i]!.grade.areas.length === 0)
}
