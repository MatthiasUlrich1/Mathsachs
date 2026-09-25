import type { Rng } from '../lib/rng'
import { createRng, randInt, timeSeed } from '../lib/rng'
import { DEFAULT_TASKS_PER_ROUND } from './tasksPerRound'
import type { Task, Topic } from './types'

/** Normalize free text for within-round identity (ignore punctuation / case). */
export function normalizeTaskText(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[„“”"']/g, '')
    .replace(/[^a-z0-9äöüß:.\- ]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const TRIVIAL_SOLUTION =
  /^(richtig|falsch|ja|nein|true|false|ok|—|-|r|f|\.|…)$/i

/** Generic prompts whose stem alone must not block distinct item sets. */
function isGenericPromptStem(stem: string): boolean {
  return (
    /^(ordne|ordne zu|zuordnung|passe .* zu|klick-paare|karteikarte)/i.test(stem) ||
    /klick-paare/i.test(stem) ||
    /^ordne (begriff|fachbegriff|term|jedem|die|den|das|\d+)/i.test(stem) ||
    /fachbegriffe ihren erkl/i.test(stem) ||
    /lebensmerkmale ihren erkl/i.test(stem) ||
    /welches schaltsymbol/i.test(stem) ||
    /ist der schalter offen oder geschlossen/i.test(stem)
  )
}

/** Extra identity for interactive tasks when dedupeKey/contentIds are absent. */
function interactiveContentKey(task: Task): string {
  const ix = task.interactive
  if (!ix) return ''
  const p = ix.props ?? {}
  if (ix.type === 'pairMatch') {
    const left = (p.left as Array<{ label?: string }> | undefined)?.map((l) => l.label ?? '') ?? []
    return `pair:${[...left].map(normalizeTaskText).sort().join('|')}`
  }
  if (ix.type === 'clozeMulti') {
    const segs = (p.segments as string[] | undefined) ?? []
    return `cloze:${normalizeTaskText(segs.join('___'))}`
  }
  if (ix.type === 'flashcardFlip') {
    return `flash:${normalizeTaskText(String(p.front ?? task.question ?? ''))}`
  }
  if (ix.type === 'iconBelong') {
    return `icon:${normalizeTaskText(String(p.prompt ?? task.question ?? ''))}`
  }
  if (ix.type === 'choicePick' || ix.type === 'multiSelect') {
    // Ignore shuffled distractors — question + solution define the fact.
    return `${ix.type}:${normalizeTaskText(task.question)}\n${normalizeTaskText(String(task.solution ?? ''))}`
  }
  if (ix.type === 'dragDropSlots') {
    const items = (p.items as Array<{ label?: string }> | undefined) ?? []
    const labels = items.map((it) => normalizeTaskText(it.label ?? '')).filter(Boolean).sort()
    return `slots:${labels.join('|')}`
  }
  if (ix.type === 'imageLabelSlots') {
    const items = (p.items as Array<{ label?: string }> | undefined) ?? []
    const labels = items.map((it) => normalizeTaskText(it.label ?? '')).filter(Boolean).sort()
    const src = String(p.imageSrc ?? '')
    return `imgSlots:${src}:${labels.join('|')}`
  }
  if (ix.type === 'dragDropSort') {
    const items = (p.items as Array<{ label?: string }> | undefined) ?? []
    const labels = items.map((it) => normalizeTaskText(it.label ?? '')).filter(Boolean)
    return `sort:${labels.join('>')}`
  }
  return ix.type
}

/**
 * All identities that must stay unique within a practice round.
 * Prefer contentIds / dedupeKey (fact-level); also block same stem / same
 * distinctive answer; fall back to a distractor-stable fingerprint.
 */
export function taskContentIds(task: Task): string[] {
  const ids = new Set<string>()
  const dedupe = task.dedupeKey?.trim()
  if (dedupe) ids.add(`dedupe:${dedupe}`)
  for (const raw of task.contentIds ?? []) {
    const id = raw.trim()
    if (id) ids.add(`content:${id}`)
  }

  const stem = normalizeTaskText(task.question ?? '')
  if (stem && !isGenericPromptStem(stem)) {
    ids.add(`stem:${stem}`)
  }

  const sol = normalizeTaskText(String(task.solution ?? ''))
  if (sol && sol.length >= 4 && !TRIVIAL_SOLUTION.test(sol)) {
    // Same fact via MC / cloze / flash with different wording → same answer.
    ids.add(`ans:${sol}`)
  }

  // Item-level term identities only when the task has no authored contentIds /
  // dedupeKey. Anatomy label/match tasks already list concepts — also marking
  // every drag label as `term:` collapses a rich pool (e.g. Vogel-Aufbau) to
  // ≤9 unique slots and silently ships short rounds.
  const hasAuthoredIdentity =
    Boolean(dedupe) || (task.contentIds ?? []).some((c) => c.trim())
  if (!hasAuthoredIdentity) {
    const ix = task.interactive
    if (ix?.type === 'pairMatch') {
      const left = (ix.props?.left as Array<{ label?: string }> | undefined) ?? []
      for (const l of left) {
        const term = normalizeTaskText(l.label ?? '')
        if (term) ids.add(`term:${term}`)
      }
    }
    if (ix?.type === 'dragDropSlots') {
      const items = (ix.props?.items as Array<{ label?: string }> | undefined) ?? []
      for (const it of items) {
        const term = normalizeTaskText(it.label ?? '')
        if (term && term.length >= 3) ids.add(`term:${term}`)
      }
      const slotLabels = (ix.props?.slotLabels as string[] | undefined) ?? []
      for (const label of slotLabels) {
        const term = normalizeTaskText(label)
        if (term && term.length >= 3) ids.add(`term:${term}`)
      }
    }
    if (ix?.type === 'imageLabelSlots') {
      const items = (ix.props?.items as Array<{ label?: string }> | undefined) ?? []
      for (const it of items) {
        const term = normalizeTaskText(it.label ?? '')
        if (term && term.length >= 3) ids.add(`term:${term}`)
      }
    }
  }

  if (ids.size > 0) return [...ids]
  return [`fp:${taskFingerprintFallback(task)}`]
}

function taskFingerprintFallback(task: Task): string {
  const ix = interactiveContentKey(task)
  const stem = normalizeTaskText(task.question ?? '')
  const sol = normalizeTaskText(String(task.solution ?? ''))
  return [stem, sol, task.visualContent ?? '', task.unit ?? '', ix].join('\n')
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
 * Prefer rich concept pools so `targetCount` (~10) is usually reached.
 * Early-stop only when the unique pool is truly exhausted after expansion.
 */
export function buildUniqueTaskRound(
  generate: (rng: Rng) => Task,
  rng: Rng,
  targetCount = DEFAULT_TASKS_PER_ROUND,
  maxAttemptsPerSlot = 120,
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
  targetCount = DEFAULT_TASKS_PER_ROUND,
  maxAttemptsPerSlot = 120,
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
  targetCount = DEFAULT_TASKS_PER_ROUND,
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
