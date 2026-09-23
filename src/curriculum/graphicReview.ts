/**
 * Grafik-/Interactive-Themen zur Prüfung vor der Freigabe.
 * - `reviewOf` = ID des Hauptthemas
 * - `released: false` → Schüler/Eltern sehen sie nicht
 * - Nach Prüfung: Generator in die Haupt-ID mergen und dieses Unterthema entfernen
 *   (oder `{ released: true }`, wenn es eigenständig freigegeben bleiben soll).
 */
import type { Topic } from './types'

/** Mark a topic as a graphic/interactive review child of `parentId`. */
export function asGraphicReview(
  parentId: string,
  topic: Topic,
  opts?: { released?: boolean },
): Topic {
  const released = opts?.released === true
  const baseTitle = topic.title.replace(/\s*·\s*Grafik\s*\(Prüfung\)\s*$/i, '').trim()
  return {
    ...topic,
    reviewOf: parentId,
    released,
    title: released ? baseTitle : `${baseTitle} · Grafik (Prüfung)`,
    keywords: [
      ...(topic.keywords ?? []),
      'Grafik',
      ...(released ? [] : ['Prüfung']),
      'Interactive',
      parentId,
    ],
  }
}

export function isGraphicReviewTopic(topic: Topic): boolean {
  return Boolean(topic.reviewOf) && topic.released === false
}
