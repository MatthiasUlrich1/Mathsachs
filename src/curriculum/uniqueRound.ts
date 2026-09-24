import type { Rng } from '../lib/rng'
import { createRng, randInt, timeSeed } from '../lib/rng'
import type { Task, Topic } from './types'

/** Extra identity for interactive tasks when dedupeKey/contentIds are absent. */
function interactiveFingerprint(task: Task): string {
  const ix = task.interactive
  if (!ix) return ''
  const p = ix.props ?? {}
  if (ix.type === 'pairMatch') {
    const left = (p.left as Array<{ label?: string }> | undefined)?.map((l) => l.label ?? '') ?? []
    return `pair:${[...left].sort().join('|')}`
  }
  if (ix.type === 'clozeMulti') {
    const segs = (p.segments as string[] | undefined) ?? []
    return `cloze:${segs.join('___')}`
  }
  if (ix.type === 'flashcardFlip') {
    return `flash:${String(p.front ?? '')}`
  }
  if (ix.type === 'iconBelong') {
    return `icon:${String(p.prompt ?? '')}`
  }
  if (ix.type === 'choicePick') {
    return `choice:${String((p.choices as string[] | undefined)?.slice().sort().join('|') ?? '')}`
  }
  return ix.type
}

/**
 * All identities that must stay unique within a practice round.
 * Prefer contentIds / dedupeKey (fact-level); fall back to question fingerprint.
 */
export function taskContentIds(task: Task): string[] {
  const ids = new Set<string>()
  const dedupe = task.dedupeKey?.trim()
  if (dedupe) ids.add(`dedupe:${dedupe}`)
  for (const raw of task.contentIds ?? []) {
    const id = raw.trim()
    if (id) ids.add(`content:${id}`)
  }
  if (ids.size > 0) return [...ids]
  // Fallback: whole-task fingerprint as one identity
  return [`fp:${taskFingerprintFallback(task)}`]
}

function taskFingerprintFallback(task: Task): string {
  const ix = interactiveFingerprint(task)
  return [task.question, task.solution, task.visualContent ?? '', task.unit ?? '', ix].join('\n')
}

/** Stable identity for "same exercise" within a practice round (legacy single key). */
export function taskFingerprint(task: Task): string {
  const dedupe = task.dedupeKey?.trim()
  if (dedupe) return `dedupe:${dedupe}`
  const content = (task.contentIds ?? []).map((c) => c.trim()).filter(Boolean).sort()
  if (content.length) return `content:${content.join('+')}`
  return taskFingerprintFallback(task)
}

function overlapsSeen(ids: string[], seen: Set<string>): boolean {
  return ids.some((id) => seen.has(id))
}

function markSeen(ids: string[], seen: Set<string>) {
  for (const id of ids) seen.add(id)
}

/**
 * Build a practice round of unique tasks (no duplicate content identities).
 * Stops early if the generator cannot produce more distinct tasks —
 * so a round may be shorter than `targetCount`.
 */
export function buildUniqueTaskRound(
  generate: (rng: Rng) => Task,
  rng: Rng,
  targetCount = 10,
  maxAttemptsPerSlot = 80,
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
  maxAttemptsPerSlot = 80,
  firstSeed?: number,
): SeededTask[] {
  const tasks: SeededTask[] = []
  const seen = new Set<string>()
  let failedStreak = 0

  const tryPush = (seed: number): boolean => {
    const task = generate(createRng(seed))
    const ids = taskContentIds(task)
    if (overlapsSeen(ids, seen)) return false
    markSeen(ids, seen)
    tasks.push({ task, seed })
    return true
  }

  if (typeof firstSeed === 'number' && Number.isFinite(firstSeed)) {
    const seed = Math.floor(firstSeed) >>> 0
    if (!tryPush(seed)) {
      // Replay: force the requested seed even if it collides (single-task round).
      const task = generate(createRng(seed))
      tasks.push({ task, seed })
      markSeen(taskContentIds(task), seen)
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
    const task = generate(createRng(seed))
    tasks.push({ task, seed })
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
    while (added < perTopic && out.length < targetCount && attempts < perTopic * 60) {
      attempts++
      const seed = randInt(rng, 1, 0x7fffffff)
      const task = ref.topic.generate(createRng(seed))
      const ids = taskContentIds(task).map((id) => `${ref.topic.id}:${id}`)
      if (overlapsSeen(ids, seen)) continue
      markSeen(ids, seen)
      out.push({ ...ref, task, seed })
      added++
    }
  }

  let guard = 0
  while (out.length < targetCount && guard < targetCount * 40) {
    guard++
    const ref = topics[out.length % topics.length]!
    const seed = randInt(rng, 1, 0x7fffffff)
    const task = ref.topic.generate(createRng(seed))
    const ids = taskContentIds(task).map((id) => `${ref.topic.id}:${id}`)
    if (overlapsSeen(ids, seen)) continue
    markSeen(ids, seen)
    out.push({ ...ref, task, seed })
  }

  return out
}
