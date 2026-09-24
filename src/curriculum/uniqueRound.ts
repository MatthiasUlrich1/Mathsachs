import type { Rng } from '../lib/rng'
import { createRng, randInt, timeSeed } from '../lib/rng'
import type { Task, Topic } from './types'

/** Stable identity for "same exercise" within a practice round. */
export function taskFingerprint(task: Task): string {
  const dedupe = task.dedupeKey?.trim()
  if (dedupe) return `dedupe:${dedupe}`
  return [task.question, task.solution, task.visualContent ?? '', task.unit ?? ''].join('\n')
}

/**
 * Build a practice round of unique tasks (no duplicate fingerprints).
 * Stops early if the generator cannot produce more distinct tasks —
 * so a round may be shorter than `targetCount`.
 */
export function buildUniqueTaskRound(
  generate: (rng: Rng) => Task,
  rng: Rng,
  targetCount = 10,
  maxAttemptsPerSlot = 50,
): Task[] {
  return buildUniqueTaskRoundWithSeeds(generate, rng, targetCount, maxAttemptsPerSlot).map(
    (row) => row.task,
  )
}

export interface SeededTask {
  task: Task
  seed: number
}

/** Like {@link buildUniqueTaskRound}, but remembers the seed used for each task. */
export function buildUniqueTaskRoundWithSeeds(
  generate: (rng: Rng) => Task,
  rng: Rng,
  targetCount = 10,
  maxAttemptsPerSlot = 50,
  firstSeed?: number,
): SeededTask[] {
  const tasks: SeededTask[] = []
  const seen = new Set<string>()
  let failedStreak = 0

  const tryPush = (seed: number): boolean => {
    const task = generate(createRng(seed))
    const key = taskFingerprint(task)
    if (seen.has(key)) return false
    seen.add(key)
    tasks.push({ task, seed })
    return true
  }

  if (typeof firstSeed === 'number' && Number.isFinite(firstSeed)) {
    const seed = Math.floor(firstSeed) >>> 0
    if (!tryPush(seed)) {
      tasks.push({ task: generate(createRng(seed)), seed })
      seen.add(taskFingerprint(tasks[0]!.task))
    }
  }

  while (tasks.length < targetCount && failedStreak < maxAttemptsPerSlot) {
    const seed = randInt(rng, 1, 0x7fffffff)
    if (tryPush(seed)) {
      failedStreak = 0
    } else {
      failedStreak++
    }
  }

  if (tasks.length === 0) {
    const seed = timeSeed()
    tasks.push({ task: generate(createRng(seed)), seed })
  }
  return tasks
}

export interface BerichtigungTopicRef {
  topic: Topic
  areaTitle: string
  gradeTitle: string
}

/** Mixed round over wrong-exam topics (~2–3 similar tasks each, capped). */
export function buildBerichtigungRound(
  topics: BerichtigungTopicRef[],
  targetCount = 10,
): Array<SeededTask & BerichtigungTopicRef> {
  if (topics.length === 0) return []
  const rng = createRng(timeSeed())
  const perTopic = Math.max(2, Math.ceil(targetCount / topics.length))
  const out: Array<SeededTask & BerichtigungTopicRef> = []
  const seen = new Set<string>()

  for (const ref of topics) {
    let added = 0
    let attempts = 0
    while (added < perTopic && out.length < targetCount && attempts < perTopic * 40) {
      attempts++
      const seed = randInt(rng, 1, 0x7fffffff)
      const task = ref.topic.generate(createRng(seed))
      const key = `${ref.topic.id}\n${taskFingerprint(task)}`
      if (seen.has(key)) continue
      seen.add(key)
      out.push({ ...ref, task, seed })
      added++
    }
  }

  let guard = 0
  while (out.length < targetCount && guard < targetCount * 30) {
    guard++
    const ref = topics[out.length % topics.length]!
    const seed = randInt(rng, 1, 0x7fffffff)
    const task = ref.topic.generate(createRng(seed))
    const key = `${ref.topic.id}\n${taskFingerprint(task)}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push({ ...ref, task, seed })
  }

  return out
}
