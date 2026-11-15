import { asGraphicReview } from './graphicReview'
import type { Topic } from './types'

export function makeAutoGraphicReview(topic: Topic): Topic {
  return asGraphicReview(
    topic.id,
    {
      ...topic,
      id: `${topic.id}__grafik`,
      title: `${topic.title} (Neu)`,
    },
    { released: false },
  )
}
