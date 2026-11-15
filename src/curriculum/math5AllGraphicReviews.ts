/**
 * Klasse 5 Mathematik — alle Topics als gesperrte Review-Unterthemen.
 * reviewOf = Topic-ID, released: false, neu: true
 * Nach Prüfung: mergen in die Haupt-ID.
 */
import type { Topic } from './types'
import { asGraphicReview } from './graphicReview'

const reviewTopics: Topic[] = []

export function addMath5GraphicReview(topic: Topic): void {
  reviewTopics.push(asGraphicReview(topic.id, topic, { released: false }))
}

export const math5AllGraphicReviews: Topic[] = reviewTopics