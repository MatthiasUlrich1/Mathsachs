import type { Task, UserInput } from '../curriculum/types'
import { emptyInput } from '../curriculum/types'
import { NumberLineSlider } from './NumberLineSlider'
import { DragDropSort } from './DragDropSort'
import { DragDropSlots } from './DragDropSlots'
import { DigitGrid } from './DigitGrid'
import { ChoicePick } from './ChoicePick'
import { MultiSelect } from './MultiSelect'
import { CoordinateClick } from './CoordinateClick'
import { ParamSlider } from './ParamSlider'
import type { ParamSliderSpec } from '../curriculum/taskHelpers'

/** Blank input matching a task's interactive widget (or answerKind). */
export const initTaskInput = (task: Task): UserInput => {
  if (task.interactive?.type === 'numberLine') {
    return { kind: 'numberLine', value: task.interactive.props.min ?? 0 }
  }
  if (task.interactive?.type === 'dragDropSort') {
    const items = task.interactive.props.items ?? []
    return { kind: 'dragDropSort', order: items.map((_: unknown, i: number) => i) }
  }
  if (task.interactive?.type === 'dragDropSlots') {
    const n = Number(task.interactive.props.slotCount ?? 0)
    return { kind: 'dragDropSlots', slots: Array.from({ length: n }, () => null) }
  }
  if (task.interactive?.type === 'digitGrid') {
    const lengths = task.interactive.props.answerRowLengths as number[] | undefined
    if (lengths && lengths.length > 0) {
      const answerRows = lengths.map((n) => Array.from({ length: n }, () => ''))
      const last = answerRows[answerRows.length - 1] ?? []
      return { kind: 'digitGrid', digits: [...last], answerRows }
    }
    const len = task.interactive.props.answerLength ?? 4
    return { kind: 'digitGrid', digits: Array.from({ length: len }, () => '') }
  }
  if (task.interactive?.type === 'choicePick') {
    return { kind: 'choicePick', choice: '' }
  }
  if (task.interactive?.type === 'multiSelect') {
    return { kind: 'multiSelect', selected: [] }
  }
  if (task.interactive?.type === 'coordinateClick') {
    return { kind: 'coordinateClick', x: Number.NaN, y: Number.NaN }
  }
  if (task.interactive?.type === 'paramSlider') {
    const params = (task.interactive.props.params ?? []) as ParamSliderSpec[]
    const values: Record<string, number> = {}
    for (const p of params) {
      values[p.id] = p.start ?? p.min
    }
    return { kind: 'paramSlider', values }
  }
  return emptyInput(task.answerKind)
}

/** SVG / HTML diagram attached to a generated task. */
export function TaskVisual({ html }: { html?: string }) {
  if (!html) return null
  return (
    <div
      className="task-visual"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

interface InteractiveProps {
  task: Task
  value: UserInput
  onChange: (value: UserInput) => void
  disabled?: boolean
}

/** Interactive widgets for a task. */
export function TaskInteractive({
  task,
  value,
  onChange,
  disabled = false,
}: InteractiveProps) {
  const interactive = task.interactive
  if (!interactive) return null

  return (
    <div className="task-interactive">
      {interactive.type === 'numberLine' && !disabled && (
        <NumberLineSlider
          min={interactive.props.min}
          max={interactive.props.max}
          step={interactive.props.step}
          decimals={interactive.props.decimals}
          value={value.kind === 'numberLine' ? value.value : null}
          onChange={(v) => onChange({ kind: 'numberLine', value: v })}
          label="Ziehe den Punkt an die richtige Stelle:"
        />
      )}
      {interactive.type === 'dragDropSort' && !disabled && (
        <DragDropSort
          items={interactive.props.items}
          userOrder={
            value.kind === 'dragDropSort'
              ? value.order
              : interactive.props.items.map((_: unknown, i: number) => i)
          }
          onChange={(order) => onChange({ kind: 'dragDropSort', order })}
          instruction="Ziehe die Elemente in die richtige Reihenfolge:"
        />
      )}
      {interactive.type === 'dragDropSlots' && !disabled && (
        <DragDropSlots
          items={interactive.props.items}
          slots={
            value.kind === 'dragDropSlots'
              ? value.slots
              : Array.from(
                  { length: Number(interactive.props.slotCount ?? 0) },
                  () => null,
                )
          }
          onChange={(slots) => onChange({ kind: 'dragDropSlots', slots })}
          instruction={interactive.props.instruction}
        />
      )}
      {interactive.type === 'digitGrid' && (
        <DigitGrid
          rows={interactive.props.rows}
          digits={
            value.kind === 'digitGrid'
              ? value.digits
              : Array.from(
                  { length: interactive.props.answerLength ?? 4 },
                  () => '',
                )
          }
          answerRows={
            value.kind === 'digitGrid' && value.answerRows
              ? value.answerRows
              : interactive.props.answerRowLengths
                ? (interactive.props.answerRowLengths as number[]).map((n) =>
                    Array.from({ length: n }, () => ''),
                  )
                : undefined
          }
          onChange={(digits) => {
            if (value.kind === 'digitGrid' && value.answerRows) {
              onChange({ kind: 'digitGrid', digits, answerRows: value.answerRows })
            } else {
              onChange({ kind: 'digitGrid', digits })
            }
          }}
          onChangeRows={(answerRows) => {
            const last = answerRows[answerRows.length - 1] ?? []
            onChange({ kind: 'digitGrid', digits: last, answerRows })
          }}
          instruction={
            interactive.props.layout === 'multiply'
              ? 'Trage die Teilprodukte und die Summe ziffernweise ein:'
              : interactive.props.layout === 'divide'
                ? 'Trage den Quotienten (und ggf. den Rest) ziffernweise ein:'
                : 'Trage das Ergebnis ziffernweise in die Kästchen ein:'
          }
          disabled={disabled}
        />
      )}
      {interactive.type === 'choicePick' && (
        <ChoicePick
          choices={interactive.props.choices}
          value={value.kind === 'choicePick' ? value.choice || null : null}
          onChange={(choice) => onChange({ kind: 'choicePick', choice })}
          instruction={interactive.props.instruction}
          disabled={disabled}
        />
      )}
      {interactive.type === 'multiSelect' && (
        <MultiSelect
          choices={interactive.props.choices}
          value={value.kind === 'multiSelect' ? value.selected : []}
          onChange={(selected) => onChange({ kind: 'multiSelect', selected })}
          instruction={interactive.props.instruction}
          disabled={disabled}
        />
      )}
      {interactive.type === 'coordinateClick' && (
        <CoordinateClick
          xRange={interactive.props.xRange}
          yRange={interactive.props.yRange}
          cellSize={interactive.props.cellSize}
          value={
            value.kind === 'coordinateClick' && Number.isFinite(value.x)
              ? { x: value.x, y: value.y }
              : null
          }
          onChange={(p) => onChange({ kind: 'coordinateClick', x: p.x, y: p.y })}
          instruction={interactive.props.instruction}
          disabled={disabled}
          markers={interactive.props.markers}
          guide={interactive.props.guide}
          solutionRay={interactive.props.solutionRay}
          showSolution={disabled}
        />
      )}
      {interactive.type === 'paramSlider' && (
        <ParamSlider
          params={interactive.props.params}
          values={value.kind === 'paramSlider' ? value.values : {}}
          onChange={(values) => onChange({ kind: 'paramSlider', values })}
          instruction={interactive.props.instruction}
          preview={interactive.props.preview}
          fixedShadowSide={interactive.props.fixedShadowSide}
          disabled={disabled}
        />
      )}
    </div>
  )
}
