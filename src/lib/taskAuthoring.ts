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
  angleProtractorTask,
  rulerMeasureTask,
  fractionModelTask,
  fractionWallTask,
  divideToolTask,
  ratioBarTask,
  numberLineMultiTask,
  treeDiagramTask,
  barChartTask,
  pieChartTask,
  clockTask,
  paramSliderTask,
  textTask,
  valueTask,
  visualTask,
} from '../curriculum/taskHelpers'
import type { ClockTaskInput } from '../curriculum/taskHelpers'
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
  | 'angleProtractor'
  | 'rulerMeasure'
  | 'fractionModel'
  | 'fractionWall'
  | 'divideTool'
  | 'ratioBar'
  | 'numberLineMulti'
  | 'treeDiagram'
  | 'barChart'
  | 'pieChart'
  | 'clock'
  | 'pairMatch'
  | 'clozeMulti'
  | 'iconBelong'
  | 'flashcardFlip'

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
  { id: 'pairMatch', label: 'Paare klicken (2 Spalten)' },
  { id: 'clozeMulti', label: 'Lückentext (mehrere Lücken)' },
  { id: 'iconBelong', label: 'Symbol-/Emoji-Auswahl' },
  { id: 'flashcardFlip', label: 'Karteikarte umdrehen' },
  { id: 'digitGrid', label: 'Zifferngitter' },
  { id: 'coordinateClick', label: 'Koordinaten klicken' },
  { id: 'coordinateDraw', label: 'Zeichnen im Koordinatensystem' },
  { id: 'paramSlider', label: 'Parameter-Slider (Funktionsgraph)' },
  { id: 'angleProtractor', label: 'Winkelmesser (Geodreieck)' },
  { id: 'rulerMeasure', label: 'Lineal (Strecke messen/abtragen)' },
  { id: 'fractionModel', label: 'Bruchmodell (Teile färben)' },
  { id: 'fractionWall', label: 'Bruchwand (gleichwertige Brüche / vergleichen)' },
  { id: 'divideTool', label: 'Teilwerkzeug (Ganze gerecht verteilen)' },
  { id: 'ratioBar', label: 'Verhältnisleiste (Felder färben / Menge aufteilen)' },
  { id: 'numberLineMulti', label: 'Zahlengerade mit mehreren Zahlen (ziehen)' },
  { id: 'treeDiagram', label: 'Baumdiagramm (Wahrscheinlichkeiten eintragen)' },
  { id: 'barChart', label: 'Säulendiagramm zeichnen (Balkenhöhen ziehen)' },
  { id: 'pieChart', label: 'Kreisdiagramm zeichnen (Sektorgrenzen ziehen)' },
  { id: 'clock', label: 'Uhr (Zeiger verschieben)' },
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
    case 'angleProtractor': {
      const angle = Number(p.angle)
      if (!Number.isInteger(angle) || angle < 1 || angle > 179) {
        errors.push('Winkelmesser: Winkel muss eine ganze Zahl von 1 bis 179 sein.')
      }
      if (p.mode !== 'measure' && p.mode !== 'draw') {
        errors.push('Winkelmesser: Modus „messen“ oder „zeichnen“ wählen.')
      }
      const tol = Number(p.tolerance ?? 1)
      if (!Number.isFinite(tol) || tol < 0) errors.push('Winkelmesser: Toleranz ungültig.')
      break
    }
    case 'rulerMeasure': {
      const len = Number(p.lengthCm)
      if (!Number.isFinite(len) || len < 0.5 || len > 12 || Math.abs(Math.round(len * 10) / 10 - len) > 1e-9) {
        errors.push('Lineal: Länge muss zwischen 0,5 und 12 cm liegen (Schritt 0,1).')
      }
      if (p.mode !== 'measure' && p.mode !== 'draw') {
        errors.push('Lineal: Modus „messen“ oder „abtragen“ wählen.')
      }
      const ang = Number(p.angle ?? 0)
      if (!Number.isFinite(ang) || Math.abs(ang) > 15) {
        errors.push('Lineal: Neigung muss zwischen −15° und 15° liegen.')
      }
      const tol = Number(p.tolerance ?? 0.1)
      if (!Number.isFinite(tol) || tol < 0) errors.push('Lineal: Toleranz ungültig.')
      break
    }
    case 'fractionWall': {
      if (p.mode !== 'equivalent' && p.mode !== 'compare') {
        errors.push('Bruchwand: Modus „gleichwertig“ oder „vergleichen“ wählen.')
        break
      }
      try {
        fractionWallTask({ question: 'q', solution: 's', explanation: 'e', ...wallInputFromProps(p) })
      } catch (e) {
        errors.push(
          `Bruchwand: Reihen (aufsteigend, 1–12, mit den Nennern der Brüche) und Brüche prüfen. (${e instanceof Error ? e.message : String(e)})`,
        )
      }
      break
    }
    case 'divideTool': {
      try {
        divideToolTask({ question: 'q', solution: 's', explanation: 'e', ...divideInputFromProps(p) })
      } catch (e) {
        errors.push(
          `Teilwerkzeug: Form, Anzahl der Ganzen (1–4) und Personen (2–6; die Ganzen dürfen nicht ohne Teilen aufgehen) prüfen. (${e instanceof Error ? e.message : String(e)})`,
        )
      }
      break
    }
    case 'numberLineMulti': {
      try {
        numberLineMultiTask({ question: 'q', solution: 's', explanation: 'e', ...numberLineMultiInputFromProps(p) })
      } catch (e) {
        errors.push(
          `Zahlengerade: Anfang < Ende, Schrittweite (Ende − Anfang ein Vielfaches), 2–5 Zahlen als „Anzeige = Wert“ je Zeile (Anzeige höchstens 7 Zeichen, Werte auf dem Raster, nicht an beschrifteten Strichen, alle verschieden) prüfen. (${e instanceof Error ? e.message : String(e)})`,
        )
      }
      break
    }
    case 'treeDiagram': {
      try {
        treeDiagramTask({ question: 'q', solution: 's', explanation: 'e', ...treeInputFromProps(p) })
      } catch (e) {
        errors.push(
          `Baumdiagramm: 1–2 Stufen mit je 2–3 Ergebnissen (Namen höchstens 6 Zeichen), für JEDEN Zweig ein Wert als „Nummer = Wert“ (Zweige 0, 1, … und 0.0, 0.1, … 1.0, …; Geschwister ergeben zusammen 1), mindestens ein Feld zum Ausfüllen. (${e instanceof Error ? e.message : String(e)})`,
        )
      }
      break
    }
    case 'barChart': {
      try {
        barChartTask({ question: 'q', solution: 's', explanation: 'e', ...barChartInputFromProps(p) })
      } catch (e) {
        errors.push(
          `Säulendiagramm: 2–6 Kategorien (höchstens 14 Zeichen) als „Name = Wert“ je Zeile, y-Achse bis zu einem Vielfachen der Schrittweite (2–20 Schritte), alle Werte Vielfache der Schrittweite, höchstens bis zum Achsenende und nicht alle 0. (${e instanceof Error ? e.message : String(e)})`,
        )
      }
      break
    }
    case 'pieChart': {
      try {
        pieChartTask({ question: 'q', solution: 's', explanation: 'e', ...pieChartInputFromProps(p) })
      } catch (e) {
        errors.push(
          `Kreisdiagramm: 2–5 Kategorien (höchstens 14 Zeichen) als „Name = Prozent“ je Zeile, alle Prozentwerte größer als 0 und Vielfache der Schrittweite (1, 2, 4, 5 oder 10), zusammen genau 100, und nicht die gleichmäßige Startaufteilung. (${e instanceof Error ? e.message : String(e)})`,
        )
      }
      break
    }
    case 'clock': {
      try {
        clockTask({ question: 'q', solution: 's', explanation: 'e', ...clockInputFromProps(p) })
      } catch (e) {
        errors.push(
          `Uhr: Uhrzeit (nicht 12:00, Vielfaches der Schrittweite 1 oder 5) bzw. ein Winkel von mehr als 0 bis 180° mit passender Uhrzeit. (${e instanceof Error ? e.message : String(e)})`,
        )
      }
      break
    }
    case 'ratioBar': {
      try {
        ratioBarTask({ question: 'q', solution: 's', explanation: 'e', ...ratioInputFromProps(p) })
      } catch (e) {
        errors.push(
          `Verhältnisleiste: Verhältnis (ganze Zahlen, Summe höchstens 12), Namen (höchstens 12 Zeichen), bei „Färben“ die Felder (4–12, ein Vielfaches der Summe) und bei „Aufteilen“ die Gesamtmenge (höchstens zwei Dezimalstellen, Anteile ohne Rest) prüfen. (${e instanceof Error ? e.message : String(e)})`,
        )
      }
      break
    }
    case 'fractionModel': {
      const num = Number(p.num)
      const den = Number(p.den)
      if (!Number.isInteger(den) || den < 2 || den > 12) {
        errors.push('Bruchmodell: Nenner muss eine ganze Zahl von 2 bis 12 sein.')
      }
      if (!Number.isInteger(num) || num < 1 || num > den) {
        errors.push('Bruchmodell: Zähler muss eine ganze Zahl von 1 bis zum Nenner sein.')
      }
      if (p.shape !== 'bar' && p.shape !== 'circle') {
        errors.push('Bruchmodell: Form „Streifen“ oder „Kreis“ wählen.')
      }
      break
    }
    case 'pairMatch':
    case 'clozeMulti':
    case 'iconBelong':
    case 'flashcardFlip':
      // Generator-heavy widgets — full authoring UI follows later; allow draft shell.
      break
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
    case 'angleProtractor':
      return withVisual(
        angleProtractorTask({
          question,
          mode: p.mode === 'draw' ? 'draw' : 'measure',
          angle: Number(p.angle),
          startAngle: Number(p.startAngle) || 0,
          tolerance: Number.isFinite(Number(p.tolerance)) ? Number(p.tolerance) : 1,
          solution,
          explanation,
        }),
      )
    case 'rulerMeasure':
      return withVisual(
        rulerMeasureTask({
          question,
          mode: p.mode === 'draw' ? 'draw' : 'measure',
          lengthCm: Number(p.lengthCm),
          angle: Number(p.angle) || 0,
          tolerance: Number.isFinite(Number(p.tolerance)) ? Number(p.tolerance) : 0.1,
          solution,
          explanation,
        }),
      )
    case 'fractionWall':
      return withVisual(
        fractionWallTask({ question, solution, explanation, ...wallInputFromProps(p) }),
      )
    case 'divideTool':
      return withVisual(divideToolTask({ question, solution, explanation, ...divideInputFromProps(p) }))
    case 'numberLineMulti':
      return withVisual(numberLineMultiTask({ question, solution, explanation, ...numberLineMultiInputFromProps(p) }))
    case 'treeDiagram':
      return withVisual(treeDiagramTask({ question, solution, explanation, ...treeInputFromProps(p) }))
    case 'barChart':
      return withVisual(barChartTask({ question, solution, explanation, ...barChartInputFromProps(p) }))
    case 'pieChart':
      return withVisual(pieChartTask({ question, solution, explanation, ...pieChartInputFromProps(p) }))
    case 'clock':
      return withVisual(clockTask({ question, solution, explanation, ...clockInputFromProps(p) }))
    case 'ratioBar':
      return withVisual(ratioBarTask({ question, solution, explanation, ...ratioInputFromProps(p) }))
    case 'fractionModel':
      return withVisual(
        fractionModelTask({
          question,
          shape: p.shape === 'circle' ? 'circle' : 'bar',
          target: { num: Number(p.num), den: Number(p.den) },
          allowEquivalent: p.allowEquivalent !== false,
          solution,
          explanation,
        }),
      )
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
    case 'angleProtractor':
      call = `angleProtractorTask({
  question: ${q},
  mode: ${JSON.stringify(p.mode === 'draw' ? 'draw' : 'measure')},
  angle: ${Number(p.angle)},
  startAngle: ${Number(p.startAngle) || 0},
  tolerance: ${Number.isFinite(Number(p.tolerance)) ? Number(p.tolerance) : 1},
  solution: ${sol},
  explanation: ${expl},
})`
      break
    case 'rulerMeasure':
      call = `rulerMeasureTask({
  question: ${q},
  mode: ${JSON.stringify(p.mode === 'draw' ? 'draw' : 'measure')},
  lengthCm: ${Number(p.lengthCm)},
  angle: ${Number(p.angle) || 0},
  tolerance: ${Number.isFinite(Number(p.tolerance)) ? Number(p.tolerance) : 0.1},
  solution: ${sol},
  explanation: ${expl},
})`
      break
    case 'fractionWall': {
      const w = wallInputFromProps(p)
      const frac = (x: { num: number; den: number }) => `{ num: ${x.num}, den: ${x.den} }`
      call = `fractionWallTask({
  question: ${q},
  mode: ${JSON.stringify(w.mode)},
  rows: [${w.rows.join(', ')}],
  ${w.mode === 'compare' ? `a: ${frac(w.a)},\n  b: ${frac(w.b)},` : `target: ${frac(w.target)},`}
  solution: ${sol},
  explanation: ${expl},
})`
      break
    }
    case 'numberLineMulti': {
      const n = numberLineMultiInputFromProps(p)
      call = `numberLineMultiTask({
  question: ${q},
  min: ${n.min},
  max: ${n.max},
  step: ${n.step},
  items: ${JSON.stringify(n.items)},
${[n.snap, n.labelEvery].some((v) => v !== undefined) ? [n.snap !== undefined ? `  snap: ${n.snap},` : '', n.labelEvery !== undefined ? `  labelEvery: ${n.labelEvery},` : ''].filter(Boolean).join('\n') + '\n' : ''}  solution: ${sol},
  explanation: ${expl},
})`
      break
    }
    case 'treeDiagram': {
      const t = treeInputFromProps(p)
      call = `treeDiagramTask({
  question: ${q},
  levels: ${JSON.stringify(t.levels)},
  probabilities: ${JSON.stringify(t.probabilities)},
  blanks: ${JSON.stringify(t.blanks)},
${t.rootLabel ? `  rootLabel: ${JSON.stringify(t.rootLabel)},\n` : ''}  solution: ${sol},
  explanation: ${expl},
})`
      break
    }
    case 'clock': {
      const b = clockInputFromProps(p)
      call = `clockTask({
  question: ${q},
  mode: ${JSON.stringify(b.mode)},
${b.time ? `  time: ${JSON.stringify(b.time)},\n` : ''}${b.angle !== undefined ? `  angle: ${b.angle},\n` : ''}${b.exampleTime ? `  exampleTime: ${JSON.stringify(b.exampleTime)},\n` : ''}${b.angleTolerance !== undefined ? `  angleTolerance: ${b.angleTolerance},\n` : ''}${b.minuteSnap !== 5 ? `  minuteSnap: ${b.minuteSnap},\n` : ''}  solution: ${sol},
  explanation: ${expl},
})`
      break
    }
    case 'pieChart': {
      const b = pieChartInputFromProps(p)
      call = `pieChartTask({
  question: ${q},
  categories: ${JSON.stringify(b.categories)},
  percents: ${JSON.stringify(b.percents)},
${b.snapPercent !== 5 ? `  snapPercent: ${b.snapPercent},\n` : ''}${b.tolerance !== undefined ? `  tolerance: ${b.tolerance},\n` : ''}  solution: ${sol},
  explanation: ${expl},
})`
      break
    }
    case 'barChart': {
      const b = barChartInputFromProps(p)
      call = `barChartTask({
  question: ${q},
  categories: ${JSON.stringify(b.categories)},
  data: ${JSON.stringify(b.data)},
  yMax: ${b.yMax},
  step: ${b.step},
${b.yLabel ? `  yLabel: ${JSON.stringify(b.yLabel)},\n` : ''}  solution: ${sol},
  explanation: ${expl},
})`
      break
    }
    case 'ratioBar': {
      const r = ratioInputFromProps(p)
      const amountLines = r.mode === 'split' ? `total: ${r.total},\n  unit: ${JSON.stringify(r.unit)},` : `segments: ${r.segments},`
      call = `ratioBarTask({
  question: ${q},
  mode: ${JSON.stringify(r.mode)},
  ${amountLines}
  ratio: [${r.ratio[0]}, ${r.ratio[1]}],
  labels: [${JSON.stringify(r.labels[0])}, ${JSON.stringify(r.labels[1])}],
  solution: ${sol},
  explanation: ${expl},
})`
      break
    }
    case 'divideTool': {
      const d = divideInputFromProps(p)
      call = `divideToolTask({
  question: ${q},
  shape: ${JSON.stringify(d.shape)},
  count: ${d.count},
  persons: ${d.persons},
  objectName: ${JSON.stringify(d.objectName)},
  solution: ${sol},
  explanation: ${expl},
})`
      break
    }
    case 'fractionModel':
      call = `fractionModelTask({
  question: ${q},
  shape: ${JSON.stringify(p.shape === 'circle' ? 'circle' : 'bar')},
  target: { num: ${Number(p.num)}, den: ${Number(p.den)} },
  allowEquivalent: ${p.allowEquivalent !== false},
  solution: ${sol},
  explanation: ${expl},
})`
      break
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

/** "1, 2, 3, 4, 6" → [1, 2, 3, 4, 6] (NaN for unreadable entries, caught by validation). */
const parseWallRows = (v: unknown): number[] =>
  String(v ?? '')
    .split(/[\s,;]+/)
    .filter(Boolean)
    .map(Number)

const wallFractionOf = (p: Record<string, unknown>, a: string, b: string) => ({ num: Number(p[a]), den: Number(p[b]) })

/** Builds the fractionWallTask input of an authoring draft (validated beforehand). */
const wallInputFromProps = (p: Record<string, unknown>) => {
  const rows = parseWallRows(p.rows)
  return p.mode === 'compare'
    ? { mode: 'compare' as const, rows, a: wallFractionOf(p, 'aNum', 'aDen'), b: wallFractionOf(p, 'bNum', 'bDen') }
    : { mode: 'equivalent' as const, rows, target: wallFractionOf(p, 'num', 'den') }
}

/** Builds the divideToolTask input of an authoring draft (validated beforehand). */
const divideInputFromProps = (p: Record<string, unknown>) => ({
  shape: (p.shape === 'circle' ? 'circle' : 'bar') as 'bar' | 'circle',
  count: Number(p.count),
  persons: Number(p.persons),
  objectName: String(p.objectName ?? '').trim() || (p.shape === 'circle' ? 'Pizza' : 'Schokoriegel'),
})

/** Builds the ratioBarTask input of an authoring draft (validated beforehand). */
const ratioInputFromProps = (p: Record<string, unknown>) => ({
  mode: (p.mode === 'split' ? 'split' : 'colour') as 'colour' | 'split',
  segments: Number(p.segments),
  ratio: [Number(p.ratioA), Number(p.ratioB)] as [number, number],
  labels: [String(p.labelA ?? '').trim(), String(p.labelB ?? '').trim()] as [string, string],
  total: Number(String(p.total ?? '').replace(',', '.')),
  unit: String(p.unit ?? '').trim(),
})

/** Builds the numberLineMultiTask input of an authoring draft (validated beforehand). One "label = value" per line. */
const numberLineMultiInputFromProps = (p: Record<string, unknown>) => {
  const num = (v: unknown): number => Number(String(v ?? '').trim().replace(',', '.'))
  const rawList = Array.isArray(p.items) ? p.items.map(String).join('\n') : String(p.items ?? '')
  const items = rawList
    .split(/\n|;/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const cut = line.lastIndexOf('=')
      return {
        id: `i${index + 1}`,
        label: (cut < 0 ? line : line.slice(0, cut)).trim(),
        value: cut < 0 ? Number.NaN : num(line.slice(cut + 1)),
      }
    })
  const optional = (v: unknown): number | undefined => (String(v ?? '').trim() === '' ? undefined : num(v))
  return {
    min: num(p.min),
    max: num(p.max),
    step: num(p.step),
    snap: optional(p.snap),
    labelEvery: optional(p.labelEvery),
    items,
  }
}

/** Builds the treeDiagramTask input of an authoring draft (validated beforehand). Lists are comma separated, values one "id = value" per line. */
const treeInputFromProps = (p: Record<string, unknown>) => {
  const list = (v: unknown): string[] =>
    String(v ?? '')
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean)
  const levels = [list(p.level1), list(p.level2)].filter((o) => o.length > 0).map((outcomes) => ({ outcomes }))
  const probabilities: Record<string, string> = {}
  for (const line of String(p.probabilities ?? '').split(/\n|;/)) {
    const cut = line.indexOf('=')
    if (cut > 0) probabilities[line.slice(0, cut).trim()] = line.slice(cut + 1).trim()
  }
  const rootLabel = String(p.rootLabel ?? '').trim()
  return {
    levels,
    probabilities,
    blanks: { branches: list(p.blankBranches), leaves: list(p.blankLeaves) },
    ...(rootLabel ? { rootLabel } : {}),
  }
}

/** Builds the barChartTask input of an authoring draft (validated beforehand). One "category = value" per line. */
const barChartInputFromProps = (p: Record<string, unknown>) => {
  const num = (v: unknown): number => Number(String(v ?? '').trim().replace(',', '.'))
  const rawList = Array.isArray(p.items) ? p.items.map(String).join('\n') : String(p.items ?? '')
  const rows = rawList
    .split(/\n|;/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const cut = line.lastIndexOf('=')
      return { name: (cut < 0 ? line : line.slice(0, cut)).trim(), value: cut < 0 ? Number.NaN : num(line.slice(cut + 1)) }
    })
  return {
    categories: rows.map((r) => r.name),
    data: rows.map((r) => r.value),
    yMax: num(p.yMax),
    step: num(p.step),
    yLabel: String(p.yLabel ?? '').trim(),
  }
}

/** Builds the pieChartTask input of an authoring draft (validated beforehand). One "category = percent" per line. */
const pieChartInputFromProps = (p: Record<string, unknown>) => {
  const num = (v: unknown): number => Number(String(v ?? '').trim().replace(',', '.'))
  const rawList = Array.isArray(p.items) ? p.items.map(String).join('\n') : String(p.items ?? '')
  const rows = rawList
    .split(/\n|;/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const cut = line.lastIndexOf('=')
      return { name: (cut < 0 ? line : line.slice(0, cut)).trim(), value: cut < 0 ? Number.NaN : num(line.slice(cut + 1).replace('%', '')) }
    })
  const snapRaw = String(p.snapPercent ?? '').trim()
  const tolRaw = String(p.tolerance ?? '').trim()
  return {
    categories: rows.map((r) => r.name),
    percents: rows.map((r) => r.value),
    snapPercent: snapRaw === '' ? 5 : num(snapRaw),
    ...(tolRaw === '' ? {} : { tolerance: num(tolRaw) }),
  }
}

/** Reads "7:25" (also "7.25" or "7,25") into a clock time; null when it is not a time. */
const parseClockTime = (v: unknown): { h: number; m: number } | null => {
  const mt = /^\s*(\d{1,2})\s*[:.,]\s*(\d{1,2})\s*(?:Uhr)?\s*$/i.exec(String(v ?? ''))
  return mt ? { h: Number(mt[1]), m: Number(mt[2]) } : null
}

/** Builds the clockTask input of an authoring draft (validated beforehand). */
const clockInputFromProps = (p: Record<string, unknown>): Pick<ClockTaskInput, 'mode' | 'time' | 'angle' | 'exampleTime' | 'angleTolerance'> & { minuteSnap: number } => {
  const num = (v: unknown): number => Number(String(v ?? '').trim().replace(',', '.'))
  const snapRaw = String(p.minuteSnap ?? '').trim()
  const tolRaw = String(p.tolerance ?? '').trim()
  const mode = p.mode === 'angle' ? ('angle' as const) : ('setTime' as const)
  const example = String(p.exampleTime ?? '').trim() === '' ? null : parseClockTime(p.exampleTime)
  return {
    mode,
    ...(mode === 'setTime' ? { time: parseClockTime(p.time) ?? { h: Number.NaN, m: Number.NaN } } : { angle: num(p.angle) }),
    ...(mode === 'angle' && example ? { exampleTime: example } : {}),
    ...(mode === 'angle' && tolRaw !== '' ? { angleTolerance: num(tolRaw) } : {}),
    minuteSnap: snapRaw === '' ? 5 : num(snapRaw),
  }
}
