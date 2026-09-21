/**
 * Grafik-/Interactive-Themen zur Prüfung vor der Freigabe.
 * - `reviewOf` = ID des Hauptthemas
 * - `released: false` → Schüler/Eltern sehen sie nicht
 * - Nach Prüfung: Generator in die Haupt-ID mergen und dieses Unterthema entfernen
 *   (oder released:true setzen, wenn es eigenständig bleiben soll).
 */
import type { Topic } from './types'

/** Mark a topic as a pending graphic/interactive review child of `parentId`. */
export function asGraphicReview(parentId: string, topic: Topic): Topic {
  const baseTitle = topic.title.replace(/\s*·\s*Grafik\s*\(Prüfung\)\s*$/i, '').trim()
  return {
    ...topic,
    reviewOf: parentId,
    released: false,
    title: `${baseTitle} · Grafik (Prüfung)`,
    keywords: [
      ...(topic.keywords ?? []),
      'Grafik',
      'Prüfung',
      'Interactive',
      parentId,
    ],
  }
}

export function isGraphicReviewTopic(topic: Topic): boolean {
  return Boolean(topic.reviewOf) && topic.released === false
}
