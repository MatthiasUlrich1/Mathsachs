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
import { ConstructionSteps } from './ConstructionSteps'
import { ParamSlider } from './ParamSlider'
import { AngleProtractor } from './AngleProtractor'
import { FractionModel } from './FractionModel'
import { FractionWall } from './FractionWall'
import { DivideTool } from './DivideTool'
import { emptyAssignment } from '../lib/divideToolLogic'
import { RatioBar } from './RatioBar'
import { NumberLineMulti } from './NumberLineMulti'
import { BarChart } from './BarChart'
import { PieChart } from './PieChart'
import { Clock } from './Clock'
import { TreeDiagram } from './TreeDiagram'
import type { TreeLevel } from '../lib/treeDiagramLogic'
import { RulerMeasure } from './RulerMeasure'
import { EquationSteps, keysToOps, opsToKeys } from './EquationSteps'
import { PairMatch } from './PairMatch'
import { ClozeMulti } from './ClozeMulti'
import { IconBelong } from './IconBelong'
import { FlashcardFlip } from './FlashcardFlip'
import { SourceQuote } from './SourceQuote'
import { ImageLabelSlots } from './ImageLabelSlots'
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
  if (task.interactive?.type === 'imageLabelSlots') {
    const n = Number(
      task.interactive.props.slotCount ??
        (task.interactive.props.slots as unknown[] | undefined)?.length ??
        0,
    )
    return {
      kind: 'imageLabelSlots',
      slots: Array.from({ length: n }, () => null),
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
  if (task.interactive?.type === 'constructionSteps') {
    const blank =
      parseCoordinateScene(task.interactive.props.blankScene) ?? emptyCoordinateScene()
    return { kind: 'constructionSteps', scene: blank, stepIndex: 0 }
  }
  if (task.interactive?.type === 'paramSlider') {
    const params = (task.interactive.props.params ?? []) as ParamSliderSpec[]
    const values: Record<string, number> = {}
    for (const p of params) {
      values[p.id] = p.start ?? p.min
    }
    return { kind: 'paramSlider', values }
  }
  if (task.interactive?.type === 'angleProtractor') {
    // Draw mode starts with the leg away from the target (untouched = not attempted).
    const start = task.interactive.props.initialDegrees
    return {
      kind: 'angleProtractor',
      degrees: typeof start === 'number' ? start : null,
      touched: false,
    }
  }
  if (task.interactive?.type === 'rulerMeasure') {
    // Draw mode starts with the end point away from the target (untouched = not attempted).
    const start = task.interactive.props.initialLength
    return {
      kind: 'rulerMeasure',
      length: typeof start === 'number' ? start : null,
      touched: false,
    }
  }
  if (task.interactive?.type === 'fractionModel') {
    // Start with nothing shaded and a number of parts different from the target's.
    const start = task.interactive.props.initialDen
    return { kind: 'fractionModel', den: typeof start === 'number' ? start : 4, shaded: [] }
  }
  if (task.interactive?.type === 'fractionWall') {
    return { kind: 'fractionWall', selected: [] }
  }
  if (task.interactive?.type === 'divideTool') {
    // Undivided and nothing handed out: the start state does not show a solution.
    return { kind: 'divideTool', partsPerWhole: 1, assignment: emptyAssignment(Number(task.interactive.props.count) || 1, 1) }
  }
  if (task.interactive?.type === 'ratioBar') {
    // Nothing coloured, nothing typed: the start state does not show a solution.
    return { kind: 'ratioBar', parts: [] }
  }
  if (task.interactive?.type === 'numberLineMulti') {
    // Every label starts in the tray: nothing placed, nothing given away.
    return { kind: 'numberLineMulti', positions: {} }
  }
  if (task.interactive?.type === 'treeDiagram') {
    // Every field starts empty: the blank values are not given away.
    return { kind: 'treeDiagram', branches: {}, leaves: {} }
  }
  if (task.interactive?.type === 'barChart') {
    // Every bar starts untouched (flat on the axis): the heights are not given away.
    return { kind: 'barChart', values: ((task.interactive.props.categories ?? []) as string[]).map(() => null) }
  }
  if (task.interactive?.type === 'pieChart') {
    // Untouched: the equal start shares are shown but not stored as an answer.
    return { kind: 'pieChart', percents: null }
  }
  if (task.interactive?.type === 'clock') {
    // Untouched: 12:00 is shown but not stored as an answer.
    return { kind: 'clock', h: 0, m: 0, touched: false }
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
  if (task.interactive?.type === 'sourceQuote') {
    return { kind: 'choicePick', choice: '' }
  }
  if (task.interactive?.type === 'causeEffect') {
    const left = (task.interactive.props.left ?? []) as Array<{ id: string }>
    const links: Record<string, string> = {}
    for (const item of left) links[item.id] = ''
    return { kind: 'pairMatch', links }
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
  /** Exam: construction steps are all shown at once instead of unlocked one by one. */
  allAtOnce?: boolean
}

/**
 * Stable identity of a task's interactive widget. Used as React key so widget-local
 * state (typed text, pose, drag) never leaks between consecutive tasks.
 */
export function taskInteractiveKey(task: Task): string {
  const i = task.interactive
  if (!i) return ''
  let props = ''
  try {
    props = JSON.stringify(i.props)
  } catch {
    props = ''
  }
  return `${i.type}|${task.question}|${props}`
}

/** Interactive widgets for a task. */
export function TaskInteractive({
  task,
  value,
  onChange,
  disabled = false,
  partResults,
  allAtOnce = false,
}: InteractiveProps) {
  const interactive = task.interactive
  if (!interactive) return null

  return (
    <div className="task-interactive" key={taskInteractiveKey(task)}>
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
      {interactive.type === 'imageLabelSlots' && (
        <ImageLabelSlots
          imageSrc={String(interactive.props.imageSrc ?? '')}
          imageAlt={String(interactive.props.imageAlt ?? '')}
          attribution={String(interactive.props.attribution ?? '')}
          drawLeaders={interactive.props.drawLeaders !== false}
          items={interactive.props.items ?? []}
          slots={interactive.props.slots ?? []}
          value={
            value.kind === 'imageLabelSlots'
              ? value.slots
              : Array.from(
                  {
                    length: Number(
                      interactive.props.slotCount ??
                        (interactive.props.slots as unknown[] | undefined)?.length ??
                        0,
                    ),
                  },
                  () => null,
                )
          }
          onChange={(slots) => onChange({ kind: 'imageLabelSlots', slots })}
          instruction={interactive.props.instruction}
          disabled={disabled}
          partResults={partResults}
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
      {interactive.type === 'constructionSteps' && (
        <ConstructionSteps
          planFigureSvg={interactive.props.planFigureSvg}
          steps={interactive.props.steps}
          value={
            value.kind === 'constructionSteps'
              ? value
              : {
                  kind: 'constructionSteps',
                  scene: parseCoordinateScene(interactive.props.blankScene) ?? emptyCoordinateScene(),
                  stepIndex: 0,
                }
          }
          onChange={onChange}
          allAtOnce={allAtOnce}
          disabled={disabled}
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
      {interactive.type === 'angleProtractor' && (
        <AngleProtractor
          mode={interactive.props.mode}
          angle={interactive.props.angle}
          startAngle={interactive.props.startAngle}
          initialDegrees={interactive.props.initialDegrees ?? undefined}
          value={
            value.kind === 'angleProtractor'
              ? value
              : { kind: 'angleProtractor', degrees: null, touched: false }
          }
          onChange={onChange}
          instruction={interactive.props.instruction}
          disabled={disabled}
        />
      )}
      {interactive.type === 'rulerMeasure' && (
        <RulerMeasure
          mode={interactive.props.mode}
          lengthCm={interactive.props.lengthCm}
          angle={interactive.props.angle}
          unitPx={interactive.props.unitPx}
          initialLength={interactive.props.initialLength ?? undefined}
          value={
            value.kind === 'rulerMeasure'
              ? value
              : { kind: 'rulerMeasure', length: null, touched: false }
          }
          onChange={onChange}
          instruction={interactive.props.instruction}
          disabled={disabled}
        />
      )}
      {interactive.type === 'fractionModel' && (
        <FractionModel
          shape={interactive.props.shape}
          value={
            value.kind === 'fractionModel'
              ? value
              : { kind: 'fractionModel', den: interactive.props.initialDen ?? 4, shaded: [] }
          }
          onChange={onChange}
          instruction={interactive.props.instruction}
          disabled={disabled}
        />
      )}
      {interactive.type === 'fractionWall' && (
        <FractionWall
          mode={interactive.props.mode === 'compare' ? 'compare' : 'equivalent'}
          rows={interactive.props.rows}
          target={interactive.props.target}
          value={value.kind === 'fractionWall' ? value : { kind: 'fractionWall', selected: [] }}
          onChange={onChange}
          instruction={interactive.props.instruction}
          disabled={disabled}
        />
      )}
      {interactive.type === 'divideTool' && (
        <DivideTool
          shape={interactive.props.shape === 'circle' ? 'circle' : 'bar'}
          count={Number(interactive.props.count)}
          persons={Number(interactive.props.persons)}
          objectName={interactive.props.objectName}
          value={
            value.kind === 'divideTool'
              ? value
              : { kind: 'divideTool', partsPerWhole: 1, assignment: emptyAssignment(Number(interactive.props.count) || 1, 1) }
          }
          onChange={onChange}
          instruction={interactive.props.instruction}
          disabled={disabled}
        />
      )}
      {interactive.type === 'ratioBar' && (
        <RatioBar
          mode={interactive.props.mode === 'split' ? 'split' : 'colour'}
          segments={Number(interactive.props.segments)}
          ratio={interactive.props.ratio as [number, number]}
          labels={interactive.props.labels as [string, string]}
          total={interactive.props.total === undefined ? undefined : Number(interactive.props.total)}
          unit={typeof interactive.props.unit === 'string' ? interactive.props.unit : undefined}
          value={value.kind === 'ratioBar' ? value : { kind: 'ratioBar', parts: [] }}
          onChange={onChange}
          instruction={interactive.props.instruction}
          disabled={disabled}
        />
      )}
      {interactive.type === 'numberLineMulti' && (
        <NumberLineMulti
          items={interactive.props.items as Array<{ id: string; label: string }>}
          order={interactive.props.order as string[] | undefined}
          min={Number(interactive.props.min)}
          max={Number(interactive.props.max)}
          step={Number(interactive.props.step)}
          snap={interactive.props.snap === undefined ? undefined : Number(interactive.props.snap)}
          labelEvery={Number(interactive.props.labelEvery) || 1}
          value={value.kind === 'numberLineMulti' ? value : { kind: 'numberLineMulti', positions: {} }}
          onChange={onChange}
          instruction={interactive.props.instruction}
          disabled={disabled}
        />
      )}
      {interactive.type === 'treeDiagram' && (
        <TreeDiagram
          levels={interactive.props.levels as TreeLevel[]}
          given={(interactive.props.given ?? {}) as Record<string, string>}
          blankBranches={(interactive.props.blankBranches ?? []) as string[]}
          blankLeaves={(interactive.props.blankLeaves ?? []) as string[]}
          rootLabel={interactive.props.rootLabel as string | undefined}
          value={value.kind === 'treeDiagram' ? value : { kind: 'treeDiagram', branches: {}, leaves: {} }}
          onChange={onChange}
          instruction={interactive.props.instruction}
          disabled={disabled}
        />
      )}
      {interactive.type === 'barChart' && (
        <BarChart
          categories={interactive.props.categories as string[]}
          yMax={Number(interactive.props.yMax)}
          step={Number(interactive.props.step)}
          yLabel={interactive.props.yLabel as string | undefined}
          value={value.kind === 'barChart' ? value : { kind: 'barChart', values: [] }}
          onChange={onChange}
          instruction={interactive.props.instruction}
          disabled={disabled}
        />
      )}
      {interactive.type === 'pieChart' && (
        <PieChart
          categories={interactive.props.categories as string[]}
          snapPercent={interactive.props.snapPercent === undefined ? undefined : Number(interactive.props.snapPercent)}
          value={value.kind === 'pieChart' ? value : { kind: 'pieChart', percents: null }}
          onChange={onChange}
          instruction={interactive.props.instruction}
          disabled={disabled}
        />
      )}
      {interactive.type === 'clock' && (
        <Clock
          minuteSnap={interactive.props.minuteSnap === undefined ? undefined : Number(interactive.props.minuteSnap)}
          value={value.kind === 'clock' ? value : { kind: 'clock', h: 0, m: 0, touched: false }}
          onChange={onChange}
          instruction={interactive.props.instruction}
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
          leftTitle={interactive.props.leftTitle}
          rightTitle={interactive.props.rightTitle}
          groupLabel={interactive.props.groupLabel}
          disabled={disabled}
          partResults={partResults}
        />
      )}
      {interactive.type === 'causeEffect' && (
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
          instruction={
            interactive.props.instruction ??
            'Ordne jeder Ursache die passende Wirkung zu.'
          }
          leftTitle={interactive.props.leftTitle ?? 'Ursache'}
          rightTitle={interactive.props.rightTitle ?? 'Wirkung'}
          groupLabel={interactive.props.groupLabel ?? 'Ursache und Wirkung zuordnen'}
          disabled={disabled}
          partResults={partResults}
        />
      )}
      {interactive.type === 'sourceQuote' && (
        <SourceQuote
          sourceLabel={interactive.props.sourceLabel}
          sourceKind={interactive.props.sourceKind}
          sourceText={String(interactive.props.sourceText ?? '')}
          attribution={interactive.props.attribution}
          choices={interactive.props.choices ?? []}
          value={value.kind === 'choicePick' ? value.choice || null : null}
          onChange={(choice) => onChange({ kind: 'choicePick', choice })}
          instruction={interactive.props.instruction}
          disabled={disabled}
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
