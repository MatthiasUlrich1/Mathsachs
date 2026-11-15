/**
 * Zusätzliche Neu-/Prüfungs-Themen (Bettermarks-Zusatzbanken).
 * - Sibling-ID: `${parentId}__neu`
 * - `neu: true` + `released: false` bis expliziter User-Freigabe
 * - `reviewOf` = Parent-Haupt-Topic
 * Originale Generatoren bleiben unberührt.
 */
import type { Topic } from './types'

export function asNeuTopic(
  parentId: string,
  topic: Topic,
  opts?: { released?: boolean },
): Topic {
  const released = opts?.released === true
  const baseTitle = topic.title
    .replace(/\s*·\s*Neu\s*\(Prüfung\)\s*$/i, '')
    .replace(/\s*\(Neu\)\s*$/i, '')
    .trim()
  return {
    ...topic,
    id: topic.id.includes('__neu') ? topic.id : `${parentId}__neu`,
    reviewOf: parentId,
    neu: true,
    released,
    outlineOnly: false,
    title: released ? baseTitle : `${baseTitle} · Neu (Prüfung)`,
    keywords: [
      ...(topic.keywords ?? []),
      'Neu',
      ...(released ? [] : ['Prüfung']),
      parentId,
    ],
  }
}

export function isNeuReviewTopic(topic: Topic): boolean {
  return Boolean(topic.reviewOf) && topic.neu === true && topic.released === false
}
