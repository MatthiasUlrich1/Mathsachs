import type { Task, UserInput } from '../curriculum/types'

/** True when the learner has entered something beyond the blank widget state. */
export function examAnswerAttempted(_task: Task, input: UserInput): boolean {
  switch (input.kind) {
    case 'value':
      return input.value.trim().length > 0
    case 'fraction':
      return input.num.trim().length > 0 || input.den.trim().length > 0
    case 'choicePick':
      return input.choice.trim().length > 0
    case 'multiSelect':
      return input.selected.length > 0
    case 'coordinateClick':
      return Number.isFinite(input.x) && Number.isFinite(input.y)
    case 'digitGrid': {
      const cells = input.answerRows?.flat() ?? input.digits
      return cells.some((d) => String(d).trim().length > 0)
    }
    case 'dragDropSort':
      return input.order.length > 0
    case 'numberLine':
    case 'paramSlider':
      // Defaults look "filled" — only score when the caller locks the task (leave/submit).
      return false
    default:
      return false
  }
}

export function examTaskEarned(
  task: Task,
  input: UserInput,
  punkte: number,
  opts?: { requireAttempt?: boolean },
): number {
  if (opts?.requireAttempt !== false && !examAnswerAttempted(task, input)) return 0
  return task.check(input) ? punkte : 0
}
