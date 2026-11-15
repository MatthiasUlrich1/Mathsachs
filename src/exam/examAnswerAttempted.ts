import type { Task, UserInput } from '../curriculum/types'
import { bcTouched } from '../lib/barChartLogic'
import { pcTouched } from '../lib/pieChartLogic'
import { treeAnyInput } from '../lib/treeDiagramLogic'

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
      return (
        Number.isFinite(input.x) && Number.isFinite(input.y)
      ) || (input.points?.length ?? 0) > 0
    case 'coordinateDraw':
    case 'constructionSteps':
      // Given (fixed) points do not count as an attempt.
      return input.scene.objects.some((o) => !(o.kind === 'point' && o.fixed))
    case 'digitGrid': {
      const cells = input.answerRows?.flat() ?? input.digits
      return cells.some((d) => String(d).trim().length > 0)
    }
    case 'dragDropSort':
      return input.order.length > 0
    case 'dragDropSlots':
      return (
        input.slots.some((s) => s !== null) ||
        Boolean(input.result && input.result.trim().length > 0)
      )
    case 'imageLabelSlots':
      return input.slots.some((s) => s !== null)
    case 'equationSteps':
      return input.ops.length > 0
    case 'pairMatch':
      return Object.values(input.links).some((v) => Boolean(v && v.trim()))
    case 'clozeMulti':
      return input.blanks.some((b) => b.trim().length > 0)
    case 'iconBelong':
      return input.choice.trim().length > 0
    case 'flashcardFlip':
      return input.flipped && input.answer.trim().length > 0
    case 'angleProtractor':
      // Start position must not score: only a moved/typed instrument counts.
      return input.touched && input.degrees !== null
    case 'rulerMeasure':
      return input.touched && input.length !== null
    case 'fractionModel':
      // Only coloured parts count; the start number of parts alone is not an attempt.
      return input.shaded.length > 0
    case 'fractionWall':
      return input.selected.length > 0
    case 'divideTool':
      // Only handed-out parts count; the stepper alone is not an attempt.
      return input.assignment.some((v) => v !== null)
    case 'ratioBar':
      // Untouched = no coloured field and no typed amount (the split bar itself is given).
      return input.parts.some((v) => v !== null) || (input.amounts ?? []).some((s) => s.trim() !== '')
    case 'numberLineMulti':
      // Untouched = no label placed on the line (labels in the tray are not an answer).
      return Object.keys(input.positions ?? {}).length > 0
    case 'treeDiagram':
      // Untouched = every field empty.
      return treeAnyInput(input.branches, input.leaves)
    case 'pieChart':
      // Untouched = no boundary moved (the equal start shares are not an answer).
      return pcTouched(input.percents)
    case 'barChart':
      // Untouched = no bar moved (bars at their start height are not an answer).
      return bcTouched(input.values)
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
