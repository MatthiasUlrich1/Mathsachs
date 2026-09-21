/**
 * Aufgabengenerator: draft schema, validation, draft→Task, storage, export.
 * Local-only — no PackTask / curriculum write.
 */
import {
  choicePickTask,
  coordinateClickTask,
  coordinateDrawTask,
  digitGridTask,
  dragDropSlotsTask,
  dragDropSortTask,
  fractionTask,
  multiSelectTask,
  numberLineTask,
  paramSliderTask,
  textTask,
  valueTask,
  visualTask,
} from '../curriculum/taskHelpers'
import type { Task } from '../curriculum/types'
import { bundledPackById } from '../curriculum/install'
import {
  loadTaskRequestPacks,
  type TaskRequestPackOption,
} from '../legal/taskRequest'
import { getSvgTemplate, sanitizeSvg } from './svgTemplateRegistry'
import {
  emptyCoordinateScene,
  generateCoordinateSceneSvg,
  parseCoordinateScene,
  type CoordinateScene,
} from './coordinateScene'

export type { TaskRequestPackOption }

export type AuthoringTopicOption = { id: string; title: string }
export type AuthoringAreaOption = {
  id: string
  title: string
  topics: AuthoringTopicOption[]
}

/** Sentinel value in the Thema dropdown for a brand-new topic title. */
export const AUTHORING_NEW_TOPIC = '__new__'

/** Load Lehrpläne (reuse TaskRequest catalog). */
export async function loadAuthoringPacks(): Promise<TaskRequestPackOption[]> {
  return loadTaskRequestPacks()
}

/** Lernbereiche + Themen for a grade inside a pack (bundled outline). */
export async function loadAuthoringAreas(
  packId: string,
  gradeId: string,
): Promise<AuthoringAreaOption[]> {
  const pack = await bundledPackById(packId.trim())
  const grade = pack?.official.find((g) => g.id === gradeId.trim())
  if (!grade) return []
  return grade.areas.map((area) => ({
    id: area.id,
    title: area.title,
    topics: area.topics.map((t) => ({ id: t.id, title: t.title })),
  }))
}

export type AuthoringElementType =
  | 'value'
  | 'text'
  | 'fraction'
  | 'choicePick'
  | 'multiSelect'
  | 'numberLine'
  | 'numberLineThermometer'
  | 'dragDropSort'
  | 'dragDropSlots'
  | 'digitGrid'
  | 'coordinateClick'
  | 'coordinateDraw'
  | 'paramSlider'

export const AUTHORING_ELEMENT_OPTIONS: Array<{
  id: AuthoringElementType
  label: string
}> = [
  { id: 'value', label: 'Zahleneingabe' },
  { id: 'text', label: 'Textantwort' },
  { id: 'fraction', label: 'Bruch' },
  { id: 'choicePick', label: 'Einfachauswahl' },
  { id: 'multiSelect', label: 'Mehrfachauswahl' },
  { id: 'numberLine', label: 'Zahlengerade' },
  { id: 'numberLineThermometer', label: 'Thermometer' },
  { id: 'dragDropSort', label: 'Sortieren (Drag&Drop)' },
  { id: 'dragDropSlots', label: 'Zuordnen / Slots' },
  { id: 'digitGrid', label: 'Zifferngitter' },
  { id: 'coordinateClick', label: 'Koordinaten klicken' },
  { id: 'coordinateDraw', label: 'Zeichnen im Koordinatensystem' },
  { id: 'paramSlider', label: 'Parameter-Slider (Funktionsgraph)' },
]

export type DraftStatus = 'draft' | 'submitted' | 'approved' | 'rejected'

export type VisualSpec = {
  mode: 'none' | 'template' | 'raw' | 'scene'
  templateId?: string
  params?: Record<string, string>
  svg?: string
  /** Graph editor scene (mode === 'scene'). */
  scene?: CoordinateScene
}

export type DraftAuthoringTask = {
  id: string
  status: DraftStatus
  authorRole: 'lehrer' | 'entwickler'
  createdAt: number
  updatedAt: number
  target: {
    packId: string
    gradeId: string
    areaId: string
    topicId: string
    topicTitle: string
  }
  display: {
    showUnit: boolean
    showVisual: boolean
    showSolutionVisual: boolean
    showExplanation: boolean
    showHint: boolean
  }
  element: {
    type: AuthoringElementType
    props: Record<string, unknown>
  }
  task: {
    question: string
    unit: string
    solution: string
    explanation: string
    hint: string
  }
  visual: VisualSpec
  solutionVisual: VisualSpec
  review?: { by?: string; at?: number; note?: string }
}

const STORAGE_KEY = 'tasktrophy.taskAuthoring.drafts.v1'

/** In-memory fallback when localStorage is missing (tests / SSR). */
let memoryStore: DraftAuthoringTask[] = []

export function newDraftId(): string {
  return `draft-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function createEmptyDraft(
  authorRole: 'lehrer' | 'entwickler',
): DraftAuthoringTask {
  const now = Date.now()
  return {
    id: newDraftId(),
    status: 'draft',
    authorRole,
    createdAt: now,
    updatedAt: now,
    target: {
      packId: '',
      gradeId: '',
      areaId: '',
      topicId: '',
      topicTitle: '',
    },
    display: {
      showUnit: false,
      showVisual: false,
      showSolutionVisual: false,
      showExplanation: true,
      showHint: false,
    },
    element: {
      type: 'choicePick',
      props: {
        choices: ['A', 'B', 'C'],
        correct: 'A',
      },
    },
    task: {
      question: '',
      unit: '',
      solution: '',
      explanation: '',
      hint: '',
    },
    visual: { mode: 'none' },
    solutionVisual: { mode: 'none' },
  }
}

type AuthoringSlider = {
  id: string
  label: string
  min: number
  max: number
  step: number
  correct: number
}

function readAuthoringSliders(p: Record<string, unknown>): AuthoringSlider[] {
  if (Array.isArray(p.sliders) && p.sliders.length) {
    return p.sliders.map((r) => {
      const row = r as Record<string, unknown>
      return {
        id: String(row.id ?? 'p'),
        label: String(row.label ?? row.id ?? 'p'),
        min: Number(row.min ?? 0),
        max: Number(row.max ?? 10),
        step: Number(row.step ?? 1) || 1,
        correct: Number(row.correct ?? 0),
      }
    })
  }
  const id = String(p.paramId ?? 'm')
  return [
    {
      id,
      label: String(p.paramLabel ?? id),
      min: Number(p.min ?? 0),
      max: Number(p.max ?? 10),
      step: Number(p.step) || 1,
      correct: Number(p.correct),
    },
  ]
}

function readAuthoringPoints(
  p: Record<string, unknown>,
): Array<{ x: number; y: number }> {
  if (Array.isArray(p.points) && p.points.length) {
    return p.points
      .map((r) => {
        const row = r as Record<string, unknown>
        return { x: Number(row.x), y: Number(row.y) }
      })
      .filter((pt) => Number.isFinite(pt.x) && Number.isFinite(pt.y))
  }
  const x = Number(p.x)
  const y = Number(p.y)
  if (Number.isFinite(x) && Number.isFinite(y)) return [{ x, y }]
  return []
}

export function resolveVisualSvg(spec: VisualSpec): string | undefined {
  if (spec.mode === 'none') return undefined
  if (spec.mode === 'scene') {
    const scene = parseCoordinateScene(spec.scene) ?? emptyCoordinateScene()
    return generateCoordinateSceneSvg(scene)
  }
  if (spec.mode === 'raw') {
    const cleaned = sanitizeSvg(spec.svg ?? '')
    return cleaned || undefined
  }
  if (spec.mode === 'template' && spec.templateId) {
    const t = getSvgTemplate(spec.templateId)
    if (!t) return undefined
    try {
      return t.build(spec.params ?? {})
    } catch {
      return undefined
    }
  }
  return undefined
}

function linesToLabels(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String).map((s) => s.trim()).filter(Boolean)
  return String(raw ?? '')
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function parseItems(raw: unknown): Array<{ label: string; value: number }> {
  const lines = linesToLabels(raw)
  return lines.map((label, i) => ({ label, value: i + 1 }))
}

export function validateDraft(draft: DraftAuthoringTask): string[] {
  const errors: string[] = []
  if (!draft.task.question.trim()) errors.push('Frage fehlt.')
  if (!draft.task.solution.trim()) errors.push('Lösung fehlt.')
  if (!draft.target.packId.trim()) errors.push('Lehrplan wählen.')
  if (!draft.target.gradeId.trim()) errors.push('Klassenstufe wählen.')
  if (!draft.target.areaId.trim()) errors.push('Lernbereich wählen.')
  if (!draft.target.topicTitle.trim()) errors.push('Thema wählen oder neuen Titel eingeben.')
  if (draft.display.showExplanation && !draft.task.explanation.trim()) {
    errors.push('Erklärung fehlt (Checkbox aktiv).')
  }
  if (draft.display.showUnit && !draft.task.unit.trim()) {
    errors.push('Einheit fehlt (Checkbox aktiv).')
  }
  if (draft.display.showHint && !draft.task.hint.trim()) {
    errors.push('Hinweis fehlt (Checkbox aktiv).')
  }
  if (draft.display.showVisual && draft.visual.mode === 'none') {
    errors.push('Visual aktiv, aber kein Modus gewählt.')
  }
  if (draft.display.showSolutionVisual && draft.solutionVisual.mode === 'none') {
    errors.push('Lösungs-Visual aktiv, aber kein Modus gewählt.')
  }
  if (draft.display.showVisual && draft.visual.mode !== 'none') {
    if (!resolveVisualSvg(draft.visual)) errors.push('Visual-SVG konnte nicht erzeugt werden.')
  }
  if (draft.display.showSolutionVisual && draft.solutionVisual.mode !== 'none') {
    if (!resolveVisualSvg(draft.solutionVisual)) {
      errors.push('Lösungs-Visual-SVG konnte nicht erzeugt werden.')
    }
  }

  const p = draft.element.props
  switch (draft.element.type) {
    case 'value': {
      if (!Number.isFinite(Number(p.value))) errors.push('Zahlenwert ungültig.')
      break
    }
    case 'text': {
      if (linesToLabels(p.accepted).length === 0) errors.push('Akzeptierte Antworten fehlen.')
      break
    }
    case 'fraction': {
      if (!Number.isFinite(Number(p.num)) || !Number.isFinite(Number(p.den)) || Number(p.den) === 0) {
        errors.push('Bruch (Zähler/Nenner) ungültig.')
      }
      break
    }
    case 'choicePick': {
      const choices = linesToLabels(p.choices)
      if (choices.length < 2) errors.push('Mindestens 2 Antwortoptionen.')
      if (!String(p.correct ?? '').trim()) errors.push('Richtige Option fehlt.')
      break
    }
    case 'multiSelect': {
      if (linesToLabels(p.choices).length < 2) errors.push('Mindestens 2 Optionen.')
      if (linesToLabels(p.correct).length < 1) errors.push('Mindestens eine richtige Option.')
      break
    }
    case 'numberLine':
    case 'numberLineThermometer': {
      const min = Number(p.min)
      const max = Number(p.max)
      const step = Number(p.step)
      const value = Number(p.value)
      if (![min, max, step, value].every(Number.isFinite) || step <= 0 || min >= max) {
        errors.push('Zahlengerade: min/max/step/value ungültig.')
      }
      break
    }
    case 'dragDropSort': {
      const items = parseItems(p.items)
      if (items.length < 2) errors.push('Sortieren: mindestens 2 Elemente.')
      break
    }
    case 'dragDropSlots': {
      const items = parseItems(p.items)
      const slots = linesToLabels(p.correctSlots).map(Number)
      if (items.length < 1) errors.push('Slots: Elemente fehlen.')
      if (slots.length < 1 || slots.some((x) => !Number.isFinite(x))) {
        errors.push('Slots: korrekte Indizes (0-basiert, Komma) fehlen.')
      }
      break
    }
    case 'digitGrid': {
      if (![p.a, p.b, p.value].every((x) => Number.isFinite(Number(x)))) {
        errors.push('Zifferngitter: a, b, Ergebnis ungültig.')
      }
      break
    }
    case 'coordinateClick': {
      const pts = readAuthoringPoints(p)
      if (!pts.length) errors.push('Koordinaten: mindestens einen Punkt setzen.')
      for (const pt of pts) {
        if (!Number.isFinite(pt.x) || !Number.isFinite(pt.y)) {
          errors.push('Koordinaten: x/y ungültig.')
          break
        }
      }
      break
    }
    case 'coordinateDraw': {
      const scene = parseCoordinateScene(p.solutionScene)
      if (!scene || scene.objects.length === 0) {
        errors.push('Zeichnen: Musterlösung mit mindestens einem Objekt nötig.')
      }
      break
    }
    case 'paramSlider': {
      const sliders = readAuthoringSliders(p)
      if (!sliders.length) errors.push('Slider: mindestens ein Parameter.')
      for (const s of sliders) {
        if (!s.id.trim()) errors.push('Slider: Param-ID fehlt.')
        if (![s.min, s.max, s.correct, s.step].every(Number.isFinite)) {
          errors.push(`Slider „${s.id}“: Zahlen ungültig.`)
        }
      }
      break
    }
  }
  return errors
}

export function draftToTask(draft: DraftAuthoringTask): Task {
  const visualContent = draft.display.showVisual
    ? resolveVisualSvg(draft.visual)
    : undefined
  const solutionVisualContent = draft.display.showSolutionVisual
    ? resolveVisualSvg(draft.solutionVisual)
    : undefined
  const unit = draft.display.showUnit ? draft.task.unit.trim() || undefined : undefined
  const explanation = draft.display.showExplanation
    ? draft.task.explanation
    : draft.task.explanation || '—'
  const question = draft.task.question
  const solution = draft.task.solution
  const p = draft.element.props

  const withVisual = (task: Task): Task => ({
    ...task,
    ...(visualContent ? { visualContent } : {}),
    ...(solutionVisualContent ? { solutionVisualContent } : {}),
    ...(unit ? { unit } : {}),
  })

  switch (draft.element.type) {
    case 'value': {
      const value = Number(p.value)
      const answerKind = p.answerKind === 'decimal' ? 'decimal' : 'integer'
      return withVisual(
        valueTask({
          question,
          unit,
          answerKind,
          value,
          solution,
          explanation,
          eps: Number(p.eps) || undefined,
        }),
      )
    }
    case 'text':
      return withVisual(
        textTask({
          question,
          accepted: linesToLabels(p.accepted),
          solution,
          explanation,
        }),
      )
    case 'fraction':
      return withVisual(
        fractionTask({
          question,
          unit,
          value: { n: Number(p.num), d: Number(p.den) },
          solution,
          explanation,
          requireReduced: Boolean(p.requireReduced),
        }),
      )
    case 'choicePick':
      return withVisual(
        choicePickTask({
          question,
          choices: linesToLabels(p.choices),
          correct: String(p.correct).trim(),
          solution,
          explanation,
          visualContent,
          solutionVisualContent,
        }),
      )
    case 'multiSelect':
      return withVisual(
        multiSelectTask({
          question,
          choices: linesToLabels(p.choices),
          correct: linesToLabels(p.correct),
          solution,
          explanation,
          visualContent,
        }),
      )
    case 'numberLine':
    case 'numberLineThermometer':
      return withVisual(
        numberLineTask({
          question,
          min: Number(p.min),
          max: Number(p.max),
          step: Number(p.step),
          value: Number(p.value),
          solution,
          explanation,
          decimals: Number(p.decimals) || 0,
          variant:
            draft.element.type === 'numberLineThermometer' ? 'thermometer' : 'line',
        }),
      )
    case 'dragDropSort': {
      const items = parseItems(p.items)
      const correctOrder =
        linesToLabels(p.correctOrder).map(Number).filter(Number.isFinite).length ===
        items.length
          ? linesToLabels(p.correctOrder).map(Number)
          : items.map((_, i) => i)
      return withVisual(
        dragDropSortTask({
          question,
          items,
          correctOrder,
          solution,
          explanation,
        }),
      )
    }
    case 'dragDropSlots': {
      const items = parseItems(p.items)
      const correctSlots = linesToLabels(p.correctSlots).map(Number)
      return withVisual(
        dragDropSlotsTask({
          question,
          items,
          correctSlots,
          solution,
          explanation,
          instruction: String(p.instruction ?? 'Setze die Blöcke in die richtigen Plätze:'),
        }),
      )
    }
    case 'digitGrid':
      return withVisual(
        digitGridTask({
          question,
          a: Number(p.a),
          b: Number(p.b),
          operator: p.operator === '−' || p.operator === '-' ? '−' : '+',
          value: Number(p.value),
          solution,
          explanation,
        }),
      )
    case 'coordinateClick': {
      const pts = readAuthoringPoints(p)
      const first = pts[0] ?? { x: 0, y: 0 }
      return withVisual(
        coordinateClickTask({
          question,
          x: first.x,
          y: first.y,
          ...(pts.length > 1 ? { points: pts } : {}),
          solution:
            solution ||
            pts.map((pt) => `(${pt.x}|${pt.y})`).join(', '),
          explanation,
          visualContent,
        }),
      )
    }
    case 'coordinateDraw': {
      const solutionScene =
        parseCoordinateScene(p.solutionScene) ?? emptyCoordinateScene()
      return withVisual(
        coordinateDrawTask({
          question,
          solutionScene,
          solution,
          explanation,
          visualContent,
        }),
      )
    }
    case 'paramSlider': {
      const sliders = readAuthoringSliders(p)
      const previewRaw = String(p.preview ?? '')
      const preview =
        previewRaw === 'shadow' ||
        [
          'linear',
          'quadratic',
          'cubic',
          'sin',
          'cos',
          'tan',
          'exp',
          'ln',
          'abs',
          'reciprocal',
          'sqrt',
          'power',
        ].includes(previewRaw)
          ? (previewRaw as
              | 'linear'
              | 'quadratic'
              | 'cubic'
              | 'sin'
              | 'cos'
              | 'tan'
              | 'exp'
              | 'ln'
              | 'abs'
              | 'reciprocal'
              | 'sqrt'
              | 'power'
              | 'shadow')
          : undefined
      const correct: Record<string, number> = {}
      for (const s of sliders) correct[s.id] = s.correct
      return withVisual(
        paramSliderTask({
          question,
          params: sliders.map((s) => ({
            id: s.id,
            label: s.label,
            min: s.min,
            max: s.max,
            step: s.step,
          })),
          correct,
          solution,
          explanation,
          visualContent,
          preview,
        }),
      )
    }
    default: {
      // Exhaustiveness fallback
      return withVisual(
        visualTask({
          question,
          unit,
          answerKind: 'integer',
          value: 0,
          solution,
          explanation,
          visualContent: visualContent ?? '<svg xmlns="http://www.w3.org/2000/svg"/>',
        }),
      )
    }
  }
}

function visualExportExpr(spec: VisualSpec): string | null {
  if (spec.mode === 'none') return null
  if (spec.mode === 'scene') {
    const scene = parseCoordinateScene(spec.scene) ?? emptyCoordinateScene()
    return `generateCoordinateSceneSvg(${JSON.stringify(scene)})`
  }
  if (spec.mode === 'template' && spec.templateId) {
    const t = getSvgTemplate(spec.templateId)
    if (t) return t.exportCall(spec.params ?? {})
  }
  if (spec.mode === 'raw' && spec.svg?.trim()) {
    return `\`${sanitizeSvg(spec.svg).replace(/`/g, '\\`')}\``
  }
  return null
}

export function exportGeneratorSnippet(draft: DraftAuthoringTask): string {
  const task = draftToTask(draft)
  const visualExpr = draft.display.showVisual ? visualExportExpr(draft.visual) : null
  const solutionVisualExpr = draft.display.showSolutionVisual
    ? visualExportExpr(draft.solutionVisual)
    : null
  const p = draft.element.props
  const q = JSON.stringify(draft.task.question)
  const sol = JSON.stringify(draft.task.solution)
  const expl = JSON.stringify(
    draft.display.showExplanation ? draft.task.explanation : draft.task.explanation || '—',
  )
  const unit = draft.display.showUnit ? JSON.stringify(draft.task.unit) : undefined

  let call = ''
  switch (draft.element.type) {
    case 'value':
      call = `valueTask({
  question: ${q},
  ${unit ? `unit: ${unit},` : ''}
  answerKind: ${JSON.stringify(p.answerKind === 'decimal' ? 'decimal' : 'integer')},
  value: ${Number(p.value)},
  solution: ${sol},
  explanation: ${expl},
})`
      break
    case 'text':
      call = `textTask({
  question: ${q},
  accepted: ${JSON.stringify(linesToLabels(p.accepted))},
  solution: ${sol},
  explanation: ${expl},
})`
      break
    case 'fraction':
      call = `fractionTask({
  question: ${q},
  ${unit ? `unit: ${unit},` : ''}
  value: { n: ${Number(p.num)}, d: ${Number(p.den)} },
  solution: ${sol},
  explanation: ${expl},
})`
      break
    case 'choicePick':
      call = `choicePickTask({
  question: ${q},
  choices: ${JSON.stringify(linesToLabels(p.choices))},
  correct: ${JSON.stringify(String(p.correct).trim())},
  solution: ${sol},
  explanation: ${expl},
  ${visualExpr ? `visualContent: ${visualExpr},` : ''}
  ${solutionVisualExpr ? `solutionVisualContent: ${solutionVisualExpr},` : ''}
})`
      break
    case 'multiSelect':
      call = `multiSelectTask({
  question: ${q},
  choices: ${JSON.stringify(linesToLabels(p.choices))},
  correct: ${JSON.stringify(linesToLabels(p.correct))},
  solution: ${sol},
  explanation: ${expl},
  ${visualExpr ? `visualContent: ${visualExpr},` : ''}
})`
      break
    case 'numberLine':
    case 'numberLineThermometer':
      call = `numberLineTask({
  question: ${q},
  min: ${Number(p.min)},
  max: ${Number(p.max)},
  step: ${Number(p.step)},
  value: ${Number(p.value)},
  solution: ${sol},
  explanation: ${expl},
  variant: ${JSON.stringify(
    draft.element.type === 'numberLineThermometer' ? 'thermometer' : 'line',
  )},
})`
      break
    case 'dragDropSort': {
      const items = parseItems(p.items)
      const correctOrder =
        linesToLabels(p.correctOrder).map(Number).filter(Number.isFinite).length ===
        items.length
          ? linesToLabels(p.correctOrder).map(Number)
          : items.map((_, i) => i)
      call = `dragDropSortTask({
  question: ${q},
  items: ${JSON.stringify(items)},
  correctOrder: ${JSON.stringify(correctOrder)},
  solution: ${sol},
  explanation: ${expl},
})`
      break
    }
    case 'dragDropSlots':
      call = `dragDropSlotsTask({
  question: ${q},
  items: ${JSON.stringify(parseItems(p.items))},
  correctSlots: ${JSON.stringify(linesToLabels(p.correctSlots).map(Number))},
  solution: ${sol},
  explanation: ${expl},
})`
      break
    case 'digitGrid':
      call = `digitGridTask({
  question: ${q},
  a: ${Number(p.a)},
  b: ${Number(p.b)},
  operator: ${JSON.stringify(p.operator === '−' || p.operator === '-' ? '−' : '+')},
  value: ${Number(p.value)},
  solution: ${sol},
  explanation: ${expl},
})`
      break
    case 'coordinateClick': {
      const pts = readAuthoringPoints(p)
      const first = pts[0] ?? { x: 0, y: 0 }
      const pointsPart =
        pts.length > 1 ? `points: ${JSON.stringify(pts)},` : ''
      call = `coordinateClickTask({
  question: ${q},
  x: ${first.x},
  y: ${first.y},
  ${pointsPart}
  solution: ${sol},
  explanation: ${expl},
  ${visualExpr ? `visualContent: ${visualExpr},` : ''}
})`
      break
    }
    case 'coordinateDraw': {
      const solutionScene =
        parseCoordinateScene(p.solutionScene) ?? emptyCoordinateScene()
      call = `coordinateDrawTask({
  question: ${q},
  solutionScene: ${JSON.stringify(solutionScene)},
  solution: ${sol},
  explanation: ${expl},
  ${visualExpr ? `visualContent: ${visualExpr},` : ''}
})`
      break
    }
    case 'paramSlider': {
      const sliders = readAuthoringSliders(p)
      const previewRaw = String(p.preview ?? '')
      const previewPart = previewRaw
        ? `preview: ${JSON.stringify(previewRaw)},`
        : ''
      call = `paramSliderTask({
  question: ${q},
  params: ${JSON.stringify(
    sliders.map((s) => ({
      id: s.id,
      label: s.label,
      min: s.min,
      max: s.max,
      step: s.step,
    })),
  )},
  correct: ${JSON.stringify(
    Object.fromEntries(sliders.map((s) => [s.id, s.correct])),
  )},
  solution: ${sol},
  explanation: ${expl},
  ${previewPart}
  ${visualExpr ? `visualContent: ${visualExpr},` : ''}
})`
      break
    }
    default:
      call = `/* unsupported type */`
  }

  const needsGeo =
    visualExpr?.includes('generate') ||
    solutionVisualExpr?.includes('generate') ||
    visualExpr?.includes('buildFunctionTemplateSvg') ||
    solutionVisualExpr?.includes('buildFunctionTemplateSvg')
  const needsPhysik =
    visualExpr?.includes('thermometerSvg') ||
    visualExpr?.includes('circuit') ||
    visualExpr?.includes('seriesParallel') ||
    solutionVisualExpr?.includes('thermometerSvg') ||
    solutionVisualExpr?.includes('circuit') ||
    solutionVisualExpr?.includes('seriesParallel')
  const needsFn =
    visualExpr?.includes('buildFunctionTemplateSvg') ||
    solutionVisualExpr?.includes('buildFunctionTemplateSvg')
  const needsScene =
    visualExpr?.includes('generateCoordinateSceneSvg') ||
    solutionVisualExpr?.includes('generateCoordinateSceneSvg') ||
    draft.element.type === 'coordinateDraw'

  return `// Aufgabengenerator-Export — ${draft.id}
// Ziel: ${draft.target.topicTitle || '(ohne Titel)'} / ${draft.target.topicId || '—'}
// Status: ${draft.status}
// sampleAnswer check: ${task.check(task.sampleAnswer) ? 'ok' : 'FAIL'}

${needsGeo ? `import { /* generate*Svg */ } from '../lib/geometrySvg'\n` : ''}${needsFn ? `import { buildFunctionTemplateSvg } from '../lib/functionGraph'\n` : ''}${needsScene ? `import { generateCoordinateSceneSvg } from '../lib/coordinateScene'\n` : ''}${needsPhysik ? `import { /* thermometerSvg, circuitSvg, … */ } from '../lib/physikSvg'\n` : ''}import { /* task helper */ } from './taskHelpers'

return ${call}
`
}

export function loadDrafts(): DraftAuthoringTask[] {
  if (typeof localStorage === 'undefined') return [...memoryStore]
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as DraftAuthoringTask[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveDrafts(drafts: DraftAuthoringTask[]): void {
  memoryStore = [...drafts]
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
}

export function upsertDraft(draft: DraftAuthoringTask): DraftAuthoringTask[] {
  const list = loadDrafts()
  const next = { ...draft, updatedAt: Date.now() }
  const idx = list.findIndex((d) => d.id === next.id)
  if (idx >= 0) list[idx] = next
  else list.unshift(next)
  saveDrafts(list)
  return list
}

export function deleteDraft(id: string): DraftAuthoringTask[] {
  const list = loadDrafts().filter((d) => d.id !== id)
  saveDrafts(list)
  return list
}
