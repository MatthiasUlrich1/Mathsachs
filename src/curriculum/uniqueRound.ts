import type { Rng } from '../lib/rng'
import type { Task } from './types'

/** Stable identity for "same exercise" within a practice round. */
export function taskFingerprint(task: Task): string {
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
  const tasks: Task[] = []
  const seen = new Set<string>()
  let failedStreak = 0

  while (tasks.length < targetCount && failedStreak < maxAttemptsPerSlot) {
    const task = generate(rng)
    const key = taskFingerprint(task)
    if (seen.has(key)) {
      failedStreak++
      continue
    }
    seen.add(key)
    tasks.push(task)
    failedStreak = 0
  }

  if (tasks.length === 0) {
    tasks.push(generate(rng))
  }
  return tasks
}
