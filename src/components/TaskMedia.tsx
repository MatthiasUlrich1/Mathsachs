import type { Task, UserInput } from '../curriculum/types'
import { emptyInput } from '../curriculum/types'
import { ensureSvgViewBox } from '../lib/ensureSvgViewBox'
import { NumberLineSlider } from './NumberLineSlider'
import { ThermometerSlider } from './ThermometerSlider'
import { DragDropSort } from './DragDropSort'
import { DragDropSlots } from './DragDropSlots'
import { DigitGrid } from './DigitGrid'
import { ChoicePick } from './ChoicePick'
import { MultiSelect } from './MultiSelect'
import { CoordinateClick } from './CoordinateClick'
import { CoordinateGraphEditor } from './CoordinateGraphEditor'
import { ParamSlider } from './ParamSlider'
import { EquationSteps, keysToOps, opsToKeys } from './EquationSteps'
import { PairMatch } from './PairMatch'
import { ClozeMulti } from './ClozeMulti'
import { IconBelong } from './IconBelong'
import { FlashcardFlip } from './FlashcardFlip'
import type { ParamSliderSpec } from '../curriculum/taskHelpers'
import type { EqOp, LinEq } from '../lib/equationSteps'
import {
  emptyCoordinateScene,
  parseCoordinateScene,
  type CoordinateScene,
} from '../lib/coordinateScene'

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
    const askResult = Boolean(task.interactive.props.askResult)
    return {
      kind: 'dragDropSlots',
      slots: Array.from({ length: n }, () => null),
      ...(askResult ? { result: '' } : {}),
    }
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
    const max = Number(task.interactive.props.maxPoints ?? 1)
    if (max > 1) {
      return { kind: 'coordinateClick', x: Number.NaN, y: Number.NaN, points: [] }
    }
    return { kind: 'coordinateClick', x: Number.NaN, y: Number.NaN }
  }
  if (task.interactive?.type === 'coordinateDraw') {
    const blank =
      parseCoordinateScene(task.interactive.props.blankScene) ??
      emptyCoordinateScene()
    return { kind: 'coordinateDraw', scene: blank }
  }
  if (task.interactive?.type === 'paramSlider') {
    const params = (task.interactive.props.params ?? []) as ParamSliderSpec[]
    const values: Record<string, number> = {}
    for (const p of params) {
      values[p.id] = p.start ?? p.min
    }
    return { kind: 'paramSlider', values }
  }
  if (task.interactive?.type === 'equationSteps') {
    return { kind: 'equationSteps', ops: [] }
  }
  if (task.interactive?.type === 'pairMatch') {
    const left = (task.interactive.props.left ?? []) as Array<{ id: string }>
    const links: Record<string, string> = {}
    for (const item of left) links[item.id] = ''
    return { kind: 'pairMatch', links }
  }
  if (task.interactive?.type === 'clozeMulti') {
    const n = Number(task.interactive.props.blankCount ?? 0)
    return { kind: 'clozeMulti', blanks: Array.from({ length: n }, () => '') }
  }
  if (task.interactive?.type === 'iconBelong') {
    return { kind: 'iconBelong', choice: '' }
  }
  if (task.interactive?.type === 'flashcardFlip') {
    return { kind: 'flashcardFlip', flipped: false, answer: '' }
  }
  return emptyInput(task.answerKind)
}

/** SVG / HTML diagram attached to a generated task. */
export function TaskVisual({ html }: { html?: string }) {
  if (!html) return null
  return (
    <div
      className="task-visual"
      dangerouslySetInnerHTML={{ __html: ensureSvgViewBox(html) }}
    />
  )
}

interface InteractiveProps {
  task: Task
  value: UserInput
  onChange: (value: UserInput) => void
  disabled?: boolean
  /** Per-part correctness after check (cloze blanks / pairMatch left items). */
  partResults?: boolean[]
}

/** Interactive widgets for a task. */
export function TaskInteractive({
  task,
  value,
  onChange,
  disabled = false,
  partResults,
}: InteractiveProps) {
  const interactive = task.interactive
  if (!interactive) return null

  return (
    <div className="task-interactive">
      {interactive.type === 'numberLine' && !disabled && interactive.props.variant === 'thermometer' && (
        <ThermometerSlider
          min={interactive.props.min}
          max={interactive.props.max}
          step={interactive.props.step}
          labelStep={interactive.props.labelStep}
          value={value.kind === 'numberLine' ? value.value : null}
          onChange={(v) => onChange({ kind: 'numberLine', value: v })}
          label="Stelle die Temperatur am Thermometer ein:"
        />
      )}
      {interactive.type === 'numberLine' && !disabled && interactive.props.variant !== 'thermometer' && (
        <NumberLineSlider
          min={interactive.props.min}
          max={interactive.props.max}
          step={interactive.props.step}
          decimals={interactive.props.decimals}
          labelStep={interactive.props.labelStep}
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
          instruction="Ziehe die Elemente in die richtige Reihenfolge (oder nutze ▲/▼):"
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
          onChange={(slots) =>
            onChange({
              kind: 'dragDropSlots',
              slots,
              ...(value.kind === 'dragDropSlots' && value.result !== undefined
                ? { result: value.result }
                : interactive.props.askResult
                  ? { result: '' }
                  : {}),
            })
          }
          instruction={interactive.props.instruction}
          slotLabels={interactive.props.slotLabels}
          worksheet={interactive.props.worksheet}
          result={
            interactive.props.askResult
              ? {
                  label: String(interactive.props.resultLabel ?? 'x ='),
                  value: value.kind === 'dragDropSlots' ? (value.result ?? '') : '',
                  onChange: (result) =>
                    onChange({
                      kind: 'dragDropSlots',
                      slots:
                        value.kind === 'dragDropSlots'
                          ? value.slots
                          : Array.from(
                              { length: Number(interactive.props.slotCount ?? 0) },
                              () => null,
                            ),
                      result,
                    }),
                }
              : undefined
          }
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
          largeSymbols={Boolean(interactive.props.largeSymbols)}
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
          maxPoints={Number(interactive.props.maxPoints ?? 1)}
          value={
            Number(interactive.props.maxPoints ?? 1) <= 1 &&
            value.kind === 'coordinateClick' &&
            Number.isFinite(value.x)
              ? { x: value.x, y: value.y }
              : null
          }
          onChange={(p) => onChange({ kind: 'coordinateClick', x: p.x, y: p.y })}
          points={
            value.kind === 'coordinateClick' ? (value.points ?? []) : []
          }
          onChangePoints={(pts) =>
            onChange({
              kind: 'coordinateClick',
              x: pts[0]?.x ?? Number.NaN,
              y: pts[0]?.y ?? Number.NaN,
              points: pts,
            })
          }
          instruction={interactive.props.instruction}
          disabled={disabled}
          markers={interactive.props.markers}
          guide={interactive.props.guide}
          solutionRay={interactive.props.solutionRay}
          solutionPoints={interactive.props.solutionPoints}
          showSolution={disabled}
        />
      )}
      {interactive.type === 'coordinateDraw' && (
        <CoordinateGraphEditor
          scene={
            value.kind === 'coordinateDraw'
              ? value.scene
              : ((interactive.props.blankScene as CoordinateScene) ??
                emptyCoordinateScene())
          }
          onChange={(scene) => onChange({ kind: 'coordinateDraw', scene })}
          allowedTools={interactive.props.allowedTools}
          instruction={interactive.props.instruction}
          disabled={disabled}
          solutionOverlay={
            disabled
              ? parseCoordinateScene(interactive.props.solutionScene)
              : null
          }
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
      {interactive.type === 'equationSteps' && (
        <EquationSteps
          start={interactive.props.start as LinEq}
          buttons={(interactive.props.buttons ?? []) as EqOp[]}
          solution={Number(interactive.props.solution)}
          ops={
            value.kind === 'equationSteps' ? keysToOps(value.ops) : []
          }
          onChange={(ops) =>
            onChange({ kind: 'equationSteps', ops: opsToKeys(ops) })
          }
          instruction={interactive.props.instruction}
          disabled={disabled}
        />
      )}
      {interactive.type === 'pairMatch' && (
        <PairMatch
          left={interactive.props.left ?? []}
          right={interactive.props.right ?? []}
          links={
            value.kind === 'pairMatch'
              ? value.links
              : Object.fromEntries(
                  ((interactive.props.left ?? []) as Array<{ id: string }>).map(
                    (l) => [l.id, ''],
                  ),
                )
          }
          onChange={(links) => onChange({ kind: 'pairMatch', links })}
          instruction={interactive.props.instruction}
          disabled={disabled}
          partResults={partResults}
        />
      )}
      {interactive.type === 'clozeMulti' && (
        <ClozeMulti
          segments={interactive.props.segments ?? ['']}
          blanks={
            value.kind === 'clozeMulti'
              ? value.blanks
              : Array.from(
                  { length: Number(interactive.props.blankCount ?? 0) },
                  () => '',
                )
          }
          onChange={(blanks) => onChange({ kind: 'clozeMulti', blanks })}
          instruction={interactive.props.instruction}
          placeholders={interactive.props.placeholders}
          disabled={disabled}
          partResults={partResults}
        />
      )}
      {interactive.type === 'iconBelong' && (
        <IconBelong
          options={interactive.props.options ?? []}
          value={value.kind === 'iconBelong' ? value.choice || null : null}
          onChange={(choice) => onChange({ kind: 'iconBelong', choice })}
          instruction={interactive.props.instruction}
          prompt={interactive.props.prompt}
          disabled={disabled}
        />
      )}
      {interactive.type === 'flashcardFlip' && (
        <FlashcardFlip
          front={String(interactive.props.front ?? '')}
          backHint={interactive.props.backHint}
          choices={
            Array.isArray(interactive.props.choices)
              ? (interactive.props.choices as string[])
              : undefined
          }
          flipped={value.kind === 'flashcardFlip' ? value.flipped : false}
          onFlip={() =>
            onChange({
              kind: 'flashcardFlip',
              flipped: true,
              answer: value.kind === 'flashcardFlip' ? value.answer : '',
            })
          }
          answer={value.kind === 'flashcardFlip' ? value.answer : ''}
          onAnswerChange={(answer) =>
            onChange({ kind: 'flashcardFlip', flipped: true, answer })
          }
          instruction={interactive.props.instruction}
          placeholder={interactive.props.placeholder}
          checkHint={interactive.props.checkHint}
          disabled={disabled}
        />
      )}
    </div>
  )
}
