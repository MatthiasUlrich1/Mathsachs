/**
 * Printable representation of a practice task for Übungsblätter.
 * Interactive widgets become static diagrams / paper prompts.
 */
import type { Task } from '../curriculum/types'
import type { ParamSliderSpec } from '../curriculum/taskHelpers'
import {
  emptyCoordinateScene,
  generateCoordinateSceneSvg,
  parseCoordinateScene,
  type CoordinateScene,
  type GraphObject,
} from './coordinateScene'
import {
  generateAngleSvg,
  generateCoordinateGridSvg,
  generateFractionBarSvg,
  generateFractionCircleSvg,
} from './geometrySvg'
import { lightShadowFromLampParam } from './physikSvg'

export type WorksheetPrintExtras = {
  /** SVG/HTML shown under the question (visualContent or static stand-in). */
  visualHtml?: string
  /** Paper-only hint (e.g. draw on the grid). */
  paperHint?: string
  /** Choice / multi-select options for □ lists. */
  options?: string[]
  /** Overrides the default answer blank line. */
  answerBlank?: string
}

const defaultBlank = (task: Task): string => {
  const unit = task.unit ? ` ${task.unit}` : ''
  if (task.answerKind === 'fraction') return `______ / ______${unit}`
  return `__________${unit}`
}

/**
 * Drag-drop / choice items may be plain strings or `{ label, value }` objects.
 * React cannot render objects as children — always coerce to printable text.
 */
export function printLabel(item: unknown): string {
  if (typeof item === 'string') return item
  if (typeof item === 'number' || typeof item === 'boolean') return String(item)
  if (item && typeof item === 'object' && 'label' in item) {
    const label = (item as { label: unknown }).label
    if (typeof label === 'string') return label
    if (typeof label === 'number' || typeof label === 'boolean') return String(label)
  }
  return ''
}

export function printLabels(items: unknown): string[] | undefined {
  if (!Array.isArray(items) || items.length === 0) return undefined
  const labels = items.map(printLabel).filter((s) => s.length > 0)
  return labels.length > 0 ? labels : undefined
}

function paramStartValues(params: ParamSliderSpec[]): Record<string, number> {
  const values: Record<string, number> = {}
  for (const p of params) {
    values[p.id] = p.start ?? p.min
  }
  return values
}

function paramAnswerBlank(params: ParamSliderSpec[]): string {
  return params.map((p) => `${p.label} = ______`).join('    ')
}

function staticParamPreview(
  preview: unknown,
  values: Record<string, number>,
  fixedShadowSide?: 'left' | 'right',
): string | undefined {
  if (preview === 'shadow') {
    const lamp = values.lamp
    if (lamp === undefined) return undefined
    return lightShadowFromLampParam(lamp, {
      fixedShadowSide,
      showLampCaption: false,
    })
  }
  // Function-family previews: empty axes so the solution curve is not spoiled.
  if (typeof preview === 'string' && preview.length > 0) {
    return generateCoordinateGridSvg({
      xRange: [-5, 5],
      yRange: [-6, 6],
      cellSize: 28,
    })
  }
  return undefined
}

function staticCoordinateClickSvg(props: Record<string, unknown>): string {
  const xRange = (props.xRange as [number, number] | undefined) ?? [-5, 8]
  const yRange = (props.yRange as [number, number] | undefined) ?? [-5, 8]
  const cellSize = Number(props.cellSize) || 32
  const markers = (props.markers as
    | Array<{ x: number; y: number; label?: string; color?: string }>
    | undefined) ?? []
  const guide = props.guide as
    | { from: { x: number; y: number }; to: { x: number; y: number } }
    | undefined

  const objects: GraphObject[] = []
  markers.forEach((m, i) => {
    objects.push({
      id: `m${i}`,
      kind: 'point',
      x: m.x,
      y: m.y,
      label: m.label,
      color: m.color ?? '#1565c0',
    })
  })
  if (guide) {
    objects.push({
      id: 'guide',
      kind: 'segment',
      x1: guide.from.x,
      y1: guide.from.y,
      x2: guide.to.x,
      y2: guide.to.y,
      color: '#94a3b8',
    })
  }

  if (objects.length === 0) {
    return generateCoordinateGridSvg({ xRange, yRange, cellSize })
  }
  return generateCoordinateSceneSvg({
    xRange,
    yRange,
    cellSize,
    snap: 'integer',
    objects,
  })
}

function digitBoxes(n: number): string {
  return Array.from({ length: Math.max(0, n) }, () => '□').join(' ')
}

/**
 * Build static print extras for one task.
 * Prefer `visualContent`; otherwise derive a paper-suitable diagram from the interactive.
 */
/** Bare segment with end ticks (40 units per cm), no length label. */
function rulerSegmentSvg(lengthCm: number, angleDeg: number): string {
  const u = 40
  const a = (angleDeg * Math.PI) / 180
  const dx = lengthCm * u * Math.cos(a)
  const dy = -lengthCm * u * Math.sin(a)
  const pad = 12
  const w = Math.ceil(Math.abs(dx) + 2 * pad)
  const h = Math.ceil(Math.abs(dy) + 2 * pad)
  const x1 = pad
  const y1 = dy < 0 ? pad - dy : pad
  const x2 = x1 + dx
  const y2 = y1 + dy
  const nx = Math.sin(a) * 6
  const ny = Math.cos(a) * 6
  const f = (n: number) => n.toFixed(1)
  const tick = (x: number, y: number) =>
    `<line x1="${f(x - nx)}" y1="${f(y - ny)}" x2="${f(x + nx)}" y2="${f(y + ny)}"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" style="max-width:${w}px" role="img" aria-label="Strecke"><g stroke="#111" stroke-width="2" stroke-linecap="round"><line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}"/>${tick(x1, y1)}${tick(x2, y2)}</g></svg>`
}

export function worksheetPrintExtras(task: Task): WorksheetPrintExtras {
  const interactive = task.interactive
  const fromVisual = task.visualContent?.trim()
    ? { visualHtml: task.visualContent }
    : {}

  if (!interactive) {
    return {
      ...fromVisual,
      answerBlank: defaultBlank(task),
    }
  }

  const props = interactive.props ?? {}
  const instruction =
    typeof props.instruction === 'string' && props.instruction.trim()
      ? props.instruction.trim()
      : undefined

  switch (interactive.type) {
    case 'coordinateClick': {
      const visualHtml =
        fromVisual.visualHtml ?? staticCoordinateClickSvg(props)
      const maxPoints = Number(props.maxPoints ?? 1)
      const blank =
        maxPoints > 1
          ? Array.from({ length: maxPoints }, () => '(______|______)').join(
              '  ',
            )
          : '(______|______)'
      return {
        visualHtml,
        paperHint:
          instruction ??
          'Markiere den gesuchten Punkt im Koordinatensystem (oder trage die Koordinaten ein).',
        answerBlank: blank,
      }
    }

    case 'coordinateDraw': {
      const blank =
        parseCoordinateScene(props.blankScene) ??
        emptyCoordinateScene({
          xRange: (props.solutionScene as CoordinateScene | undefined)?.xRange,
          yRange: (props.solutionScene as CoordinateScene | undefined)?.yRange,
        })
      return {
        visualHtml: fromVisual.visualHtml ?? generateCoordinateSceneSvg(blank),
        paperHint:
          instruction ??
          'Zeichne die gesuchte Figur ins Koordinatensystem.',
      }
    }

    case 'constructionSteps': {
      // All steps at once: Planfigur, then the start scene to draw in.
      const blank = parseCoordinateScene(props.blankScene) ?? emptyCoordinateScene()
      const steps = (Array.isArray(props.steps) ? props.steps : []) as Array<{ instruction?: string }>
      const plan = typeof props.planFigureSvg === 'string' ? props.planFigureSvg : ''
      const list = steps
        .map((s, i) => `${i + 1}. ${s.instruction ?? ''}`.trim())
        .join(' ')
      return {
        visualHtml:
          fromVisual.visualHtml ??
          `<div>${plan}</div><div>${generateCoordinateSceneSvg(blank)}</div>`,
        paperHint: list || 'Konstruiere die Figur Schritt für Schritt.',
      }
    }

    case 'paramSlider': {
      const params = (props.params ?? []) as ParamSliderSpec[]
      const starts = paramStartValues(params)
      const previewSvg =
        fromVisual.visualHtml ??
        staticParamPreview(props.preview, starts, props.fixedShadowSide)
      return {
        visualHtml: previewSvg,
        paperHint:
          instruction ??
          'Stelle die Parameter ein bzw. zeichne passend zum Diagramm.',
        answerBlank: params.length
          ? paramAnswerBlank(params)
          : defaultBlank(task),
      }
    }

    case 'angleProtractor': {
      const measure = props.mode !== 'draw'
      const startAngle = Number(props.startAngle ?? 0)
      const angle = Number(props.angle)
      // Measure: the angle without any degree label. Draw: only the first leg.
      const visualHtml =
        fromVisual.visualHtml ??
        (measure && Number.isFinite(angle)
          ? generateAngleSvg({ angle, label: '', startAngle })
          : undefined)
      return {
        visualHtml,
        paperHint:
          instruction ??
          (measure
            ? 'Miss den Winkel mit dem Geodreieck und trage die Gradzahl ein.'
            : 'Zeichne den Winkel mit dem Geodreieck.'),
        answerBlank: '__________ °',
      }
    }

    case 'rulerMeasure': {
      const measure = props.mode !== 'draw'
      const lengthCm = Number(props.lengthCm)
      const angle = Number(props.angle ?? 0)
      // Measure: the bare segment (no length label). Draw: only the answer field.
      const visualHtml =
        fromVisual.visualHtml ??
        (measure && Number.isFinite(lengthCm) ? rulerSegmentSvg(lengthCm, angle) : undefined)
      return {
        visualHtml,
        paperHint:
          instruction ??
          (measure
            ? 'Miss die Strecke mit dem Lineal und trage die Länge in cm ein.'
            : 'Zeichne die Strecke mit dem Lineal.'),
        answerBlank: '__________ cm',
      }
    }

    case 'fractionModel': {
      // Paper: the empty model divided into the target's number of parts, to be shaded.
      const target = (props.target ?? {}) as { num?: number; den?: number }
      const den = Number(target.den)
      const circle = props.shape === 'circle'
      const emptyModel =
        Number.isInteger(den) && den >= 1
          ? circle
            ? generateFractionCircleSvg({ numerator: 0, denominator: den })
            : generateFractionBarSvg({ numerator: 0, denominator: den })
          : ''
      // A reference figure (e.g. the bar to expand/reduce) comes first, then the empty model to shade.
      const visualHtml = [fromVisual.visualHtml, emptyModel].filter(Boolean).join('') || undefined
      return {
        visualHtml,
        // The on-screen instruction mentions the stepper, which does not exist on paper.
        paperHint: fromVisual.visualHtml
          ? 'Färbe im leeren Modell darunter die passenden Teile (siehe Aufgabe).'
          : 'Färbe im Modell die passenden Teile.',
        answerBlank: '',
      }
    }

    case 'choicePick': {
      const choices = printLabels(props.choices)
      return {
        ...fromVisual,
        paperHint: instruction ?? 'Kreuze die richtige Antwort an.',
        options: choices,
        answerBlank: '□',
      }
    }

    case 'multiSelect': {
      const choices = printLabels(props.choices)
      return {
        ...fromVisual,
        paperHint: instruction ?? 'Kreuze alle zutreffenden Antworten an.',
        options: choices,
        answerBlank: '□',
      }
    }

    case 'dragDropSort': {
      const items = printLabels(props.items) ?? []
      return {
        ...fromVisual,
        paperHint:
          instruction ??
          'Nummeriere die Elemente in der richtigen Reihenfolge.',
        options: items.length ? items : undefined,
        answerBlank: items.map((_, i) => `${i + 1}. ______`).join('  '),
      }
    }

    case 'dragDropSlots': {
      const items = printLabels(props.items) ?? []
      const slotLabels = printLabels(props.slotLabels)
      const slotCount = Number(props.slotCount ?? 0)
      const worksheet = props.worksheet as
        | { given?: string; lineHint?: string }
        | undefined
      const given = worksheet?.given
        ? `Gegeben: ${worksheet.given}`
        : undefined
      const slotsLine = slotLabels?.length
        ? `Begriffe: ${slotLabels.join(' · ')}`
        : undefined
      return {
        ...fromVisual,
        paperHint:
          [instruction, given, slotsLine, worksheet?.lineHint]
            .filter(Boolean)
            .join(' ') ||
          'Ordne die Bausteine den Plätzen zu (auf Papier notieren).',
        options: items.length ? items : undefined,
        answerBlank:
          slotCount > 0
            ? Array.from({ length: slotCount }, (_, i) =>
                slotLabels?.[i]
                  ? `${slotLabels[i]}: ______`
                  : '______',
              ).join(' | ')
            : defaultBlank(task),
      }
    }

    case 'imageLabelSlots': {
      const items = printLabels(props.items) ?? []
      const slotCount = Number(
        props.slotCount ??
          (Array.isArray(props.slots) ? props.slots.length : 0),
      )
      const attr =
        typeof props.attribution === 'string' && props.attribution.trim()
          ? `Quelle: ${props.attribution.trim()}`
          : undefined
      return {
        ...fromVisual,
        paperHint:
          [instruction, attr, 'Beschrifte die nummerierten Felder an der Abbildung.']
            .filter(Boolean)
            .join(' '),
        options: items.length ? items : undefined,
        answerBlank:
          slotCount > 0
            ? Array.from({ length: slotCount }, (_, i) => `${i + 1}: ______`).join(
                ' | ',
              )
            : defaultBlank(task),
      }
    }

    case 'digitGrid': {
      const lengths = props.answerRowLengths as number[] | undefined
      const len = Number(props.answerLength ?? 4)
      const blank = lengths?.length
        ? lengths.map((n) => digitBoxes(n)).join('   ')
        : digitBoxes(len)
      return {
        ...fromVisual,
        paperHint: instruction ?? 'Trage die Ziffern in die Kästchen ein.',
        answerBlank: blank,
      }
    }

    case 'numberLine': {
      return {
        ...fromVisual,
        paperHint:
          instruction ??
          (props.variant === 'thermometer'
            ? 'Markiere die Temperatur auf dem Thermometer bzw. trage den Wert ein.'
            : 'Markiere den Wert auf dem Zahlenstrahl bzw. trage ihn ein.'),
        answerBlank: defaultBlank(task),
      }
    }

    case 'equationSteps': {
      const start = props.start as
        | { left: string; right: string }
        | undefined
      const given =
        start && typeof start.left === 'string' && typeof start.right === 'string'
          ? `${start.left} = ${start.right}`
          : undefined
      return {
        ...fromVisual,
        paperHint: given
          ? `Ausgangspunkt: ${given}. Notiere die Äquivalenzumformungen.`
          : 'Notiere die Äquivalenzumformungen Schritt für Schritt.',
        answerBlank: 'x = ______',
      }
    }

    case 'pairMatch': {
      const left = printLabels(
        (props.left as Array<{ label?: string; id?: string }> | undefined)?.map(
          (x) => x.label ?? x.id ?? '',
        ),
      )
      const right = printLabels(
        (props.right as Array<{ label?: string; id?: string }> | undefined)?.map(
          (x) => x.label ?? x.id ?? '',
        ),
      )
      return {
        ...fromVisual,
        paperHint:
          instruction ??
          'Ordne links und rechts zu (auf Papier: Begriff → Erklärung).',
        options: [...(left ?? []), ...(right ?? [])].filter(Boolean),
        answerBlank: (left ?? []).map((l) => `${l} → ______`).join(' | '),
      }
    }

    case 'causeEffect': {
      const left = printLabels(
        (props.left as Array<{ label?: string; id?: string }> | undefined)?.map(
          (x) => x.label ?? x.id ?? '',
        ),
      )
      const right = printLabels(
        (props.right as Array<{ label?: string; id?: string }> | undefined)?.map(
          (x) => x.label ?? x.id ?? '',
        ),
      )
      return {
        ...fromVisual,
        paperHint:
          instruction ??
          'Ordne Ursache und Wirkung zu (auf Papier: Ursache → Wirkung).',
        options: [...(left ?? []), ...(right ?? [])].filter(Boolean),
        answerBlank: (left ?? []).map((l) => `${l} → ______`).join(' | '),
      }
    }

    case 'sourceQuote': {
      const quote = String(props.sourceText ?? '')
      const choices = printLabels(props.choices as string[] | undefined)
      return {
        ...fromVisual,
        paperHint: quote
          ? `Quelle: „${quote.slice(0, 180)}${quote.length > 180 ? '…' : ''}“ — ${instruction ?? 'Deutung wählen.'}`
          : (instruction ?? 'Lies die Quelle und wähle die Deutung.'),
        options: choices,
        answerBlank: 'Deutung: ______',
      }
    }

    case 'clozeMulti': {
      const segments = (props.segments ?? []) as string[]
      const n = Number(props.blankCount ?? Math.max(0, segments.length - 1))
      const preview = segments
        .map((s, i) => (i < n ? `${s}______` : s))
        .join('')
      return {
        ...fromVisual,
        paperHint: instruction ?? 'Fülle alle Lücken aus.',
        answerBlank: preview || Array.from({ length: n }, () => '______').join(' | '),
      }
    }

    case 'iconBelong': {
      const opts = (props.options ?? []) as Array<{ label?: string; icon?: string }>
      const labels = opts.map((o) =>
        [o.icon, o.label].filter(Boolean).join(' ').trim(),
      )
      return {
        ...fromVisual,
        paperHint: instruction ?? 'Kreuze das passende Symbol / die passende Option an.',
        options: labels,
        answerBlank: '□',
      }
    }

    case 'flashcardFlip': {
      return {
        ...fromVisual,
        paperHint:
          instruction ??
          `Karte: „${String(props.front ?? '')}“. Schreibe die passende Antwort.`,
        answerBlank: '______',
      }
    }

    default:
      return {
        ...fromVisual,
        paperHint: instruction,
        answerBlank: defaultBlank(task),
      }
  }
}
