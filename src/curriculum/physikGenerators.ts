import { PHYSIK_K6_GENERATORS } from './physik6'
import type { Topic } from './types'

const PHYSIK_GENERATORS: Record<string, Topic['generate']> = {
  ...PHYSIK_K6_GENERATORS,
}

export function resolvePhysikGenerate(topicId: string): Topic['generate'] | undefined {
  return PHYSIK_GENERATORS[topicId]
}

export function isPlayablePhysikTopic(topicId: string): boolean {
  return Boolean(PHYSIK_GENERATORS[topicId])
}
