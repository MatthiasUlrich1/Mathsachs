/** Stable 4-digit content ID for pack topics (for freigeben / feedback). */
export function topicContentId(topicId: string): number {
  let h = 2166136261
  for (let i = 0; i < topicId.length; i++) {
    h ^= topicId.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return 1000 + ((h >>> 0) % 9000)
}

export function formatTopicContentId(topicId: string): string {
  return `ID ${topicContentId(topicId)}`
}
