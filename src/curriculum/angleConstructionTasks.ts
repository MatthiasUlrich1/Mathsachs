/**
 * Geführte Dreieckskonstruktionen mit dem Winkel-Werkzeug: SWS und WSW.
 * Parameter sind von Hand gewählt: Dreieck konstruierbar (WSW: α + β < 180°, die Schenkel
 * schneiden sich in genau einem Punkt), Seiten 3-8 cm, und der dritte Eckpunkt C liegt auf
 * dem ½-cm-Raster, damit er mit dem Punkt-Werkzeug exakt gesetzt werden kann.
 * Einheit: 1 Rasterfeld = 1 cm. A = (0|0), B = (c|0).
 */
import { emptyCoordinateScene, type CoordinateScene, type GraphObject } from '../lib/coordinateScene'
import {
  constructionStepsTask,
  hasAngleAt,
  hasPointNear,
  hasRayIntersectionAt,
  hasSegment,
} from './measureTaskHelpers'
import type { Task } from './types'
import { formatDe } from '../lib/num'

export interface SwsSet {
  /** Seite c = |AB| in cm. */
  c: number
  /** Winkel bei A in Grad (zwischen AB und AC). */
  alpha: number
  /** Seite b = |AC| in cm. */
  b: number
  /** Eckpunkt C (Rasterpunkt, oberhalb von AB). */
  C: { x: number; y: number }
}

export interface WswSet {
  c: number
  alpha: number
  beta: number
  /** Schnittpunkt der beiden Schenkel (Rasterpunkt, oberhalb von AB). */
  C: { x: number; y: number }
}

export const SWS_SETS: readonly SwsSet[] = [
  { c: 6, alpha: 53, b: 5, C: { x: 3, y: 4 } },
  { c: 7, alpha: 37, b: 7.5, C: { x: 6, y: 4.5 } },
  { c: 5, alpha: 127, b: 5, C: { x: -3, y: 4 } },
  { c: 8, alpha: 67, b: 6.5, C: { x: 2.5, y: 6 } },
]

export const WSW_SETS: readonly WswSet[] = [
  { c: 5, alpha: 63, beta: 53, C: { x: 2, y: 4 } },
  { c: 7, alpha: 53, beta: 45, C: { x: 3, y: 4 } },
  { c: 5, alpha: 106, beta: 30, C: { x: -1, y: 3.5 } },
  { c: 5, alpha: 67, beta: 45, C: { x: 1.5, y: 3.5 } },
]

const cm = (v: number) => `${formatDe(v)} cm`

/** Planfigur (Skizze, nicht maßstabsgetreu) mit den gegebenen Größen; zeigt nichts Gesuchtes. */
const planSvg = (label: string, parts: { base: string; left?: string; angleA?: string; angleB?: string }) =>
  `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">` +
  `<polygon points="40,160 260,160 190,40" fill="#eef3fb" stroke="#1d3557" stroke-width="2"/>` +
  `<g font-family="sans-serif" font-size="15" fill="#1f2937">` +
  `<text x="26" y="176">A</text><text x="262" y="176">B</text><text x="188" y="30">C</text>` +
  `<text x="118" y="184">c = ${parts.base}</text>` +
  (parts.left ? `<text x="40" y="94">b = ${parts.left}</text>` : '') +
  (parts.angleA ? `<path d="M 72 160 A 32 32 0 0 0 62 136" fill="none" stroke="#c62828" stroke-width="2"/><text x="76" y="150" fill="#c62828">${parts.angleA}</text>` : '') +
  (parts.angleB ? `<path d="M 228 160 A 32 32 0 0 1 236 138" fill="none" stroke="#c62828" stroke-width="2"/><text x="190" y="150" fill="#c62828">${parts.angleB}</text>` : '') +
  `</g></svg>`

const sceneFor = (c: number, C: { x: number; y: number }): CoordinateScene => {
  const reach = Math.ceil(Math.abs(C.y)) + 2
  return emptyCoordinateScene({
    xRange: [Math.floor(Math.min(0, C.x)) - 2, Math.ceil(Math.max(c, C.x)) + 2],
    yRange: [-reach, reach],
    snap: 'half',
    objects: [{ id: 'A', kind: 'point', x: 0, y: 0, label: 'A', fixed: true }],
  })
}

const mirrored = (C: { x: number; y: number }) => [C, { x: C.x, y: -C.y }]

const rayThrough = (id: string, from: { x: number; y: number }, to: { x: number; y: number }): GraphObject => ({
  id,
  kind: 'ray',
  x1: from.x,
  y1: from.y,
  x2: to.x,
  y2: to.y,
})

const seg = (id: string, p: { x: number; y: number }, q: { x: number; y: number }): GraphObject => ({
  id,
  kind: 'segment',
  x1: p.x,
  y1: p.y,
  x2: q.x,
  y2: q.y,
})

const dist = (p: { x: number; y: number }, q: { x: number; y: number }) => Math.hypot(p.x - q.x, p.y - q.y)

/** Dreieck aus zwei Seiten und dem eingeschlossenen Winkel (SWS). */
export const swsConstructionTask = (set: SwsSet): Task => {
  const { c, alpha, b, C } = set
  const B = { x: c, y: 0 }
  const A = { x: 0, y: 0 }
  const a = dist(B, C)
  const startScene = sceneFor(c, C)
  const candidates = mirrored(C)
  const solutionScene: CoordinateScene = {
    ...startScene,
    objects: [
      ...startScene.objects,
      seg('s-ab', A, B),
      rayThrough('s-w', A, C),
      { id: 's-c', kind: 'point', x: C.x, y: C.y },
      seg('s-ac', A, C),
      seg('s-bc', B, C),
    ],
  }
  return constructionStepsTask({
    question: `Konstruiere das Dreieck ABC mit c = ${cm(c)}, b = ${cm(b)} und dem Winkel α = ${alpha}° bei A. Der Punkt A ist vorgegeben, B soll rechts von A liegen.`,
    planFigureSvg: planSvg('Skizze des Dreiecks ABC mit zwei Seiten und dem eingeschlossenen Winkel', {
      base: cm(c),
      left: cm(b),
      angleA: `${alpha}°`,
    }),
    startScene,
    steps: [
      {
        instruction: `Zeichne die Seite c = ${cm(c)}: Strecke von A aus ${cm(c)} nach rechts bis B.`,
        allowedTools: ['segment', 'select', 'delete'],
        check: (s) => hasSegment(s, 'A', B, c),
      },
      {
        instruction: `Trage bei A den Winkel α = ${alpha}° an die Strecke AB an. Der Schenkel darf oberhalb oder unterhalb von AB liegen.`,
        allowedTools: ['angle', 'select', 'delete'],
        check: (s) => hasAngleAt(s, 'A', B, alpha),
      },
      {
        instruction: `Markiere auf dem Schenkel den Punkt C im Abstand b = ${cm(b)} von A.`,
        allowedTools: ['point', 'select', 'delete'],
        check: (s) => candidates.some((p) => hasPointNear(s, p.x, p.y)),
      },
      {
        instruction: 'Verbinde C mit A und mit B.',
        allowedTools: ['segment', 'select', 'delete'],
        check: (s) => candidates.some((p) => hasSegment(s, 'A', p, b) && hasSegment(s, B, p, dist(B, p))),
      },
    ],
    solutionScene,
    solution: `Dreieck ABC mit C(${formatDe(C.x)}|${formatDe(C.y)}) (oder gespiegelt an AB), dritte Seite a ≈ ${formatDe(Math.round(a * 10) / 10)} cm`,
    explanation:
      `Bei SWS sind zwei Seiten und der eingeschlossene Winkel bekannt. ` +
      `1. Zeichne AB mit c = ${cm(c)}. ` +
      `2. Trage bei A den Winkel α = ${alpha}° an AB an (auf 1° genau); der freie Schenkel zeigt in die Richtung von C. ` +
      `3. Auf diesem Schenkel liegt C im Abstand b = ${cm(b)} von A. ` +
      `4. Verbinde C mit A und B: Die dritte Seite a = BC ergibt sich von selbst, sie ist nicht mehr frei wählbar. ` +
      `Liegt der Schenkel unterhalb von AB, entsteht das an AB gespiegelte, kongruente Dreieck. Damit ist das Dreieck durch SWS eindeutig festgelegt.`,
    dedupeKey: `lb3kong-konstruktion-sws:${c}:${alpha}:${b}`,
  })
}

/** Dreieck aus einer Seite und den beiden anliegenden Winkeln (WSW). */
export const wswConstructionTask = (set: WswSet): Task => {
  const { c, alpha, beta, C } = set
  if (alpha + beta >= 180) throw new Error('wswConstructionTask: alpha + beta must be < 180')
  const A = { x: 0, y: 0 }
  const B = { x: c, y: 0 }
  const startScene = sceneFor(c, C)
  const candidates = mirrored(C)
  const solutionScene: CoordinateScene = {
    ...startScene,
    objects: [
      ...startScene.objects,
      seg('s-ab', A, B),
      rayThrough('s-wa', A, C),
      rayThrough('s-wb', B, C),
      { id: 's-c', kind: 'point', x: C.x, y: C.y },
      seg('s-ac', A, C),
      seg('s-bc', B, C),
    ],
  }
  return constructionStepsTask({
    question: `Konstruiere das Dreieck ABC mit c = ${cm(c)}, α = ${alpha}° bei A und β = ${beta}° bei B. Der Punkt A ist vorgegeben, B soll rechts von A liegen.`,
    planFigureSvg: planSvg('Skizze des Dreiecks ABC mit einer Seite und den beiden anliegenden Winkeln', {
      base: cm(c),
      angleA: `${alpha}°`,
      angleB: `${beta}°`,
    }),
    startScene,
    steps: [
      {
        instruction: `Zeichne die Seite c = ${cm(c)}: Strecke von A aus ${cm(c)} nach rechts bis B.`,
        allowedTools: ['segment', 'select', 'delete'],
        check: (s) => hasSegment(s, 'A', B, c),
      },
      {
        instruction: `Trage bei A den Winkel α = ${alpha}° an die Strecke AB an.`,
        allowedTools: ['angle', 'select', 'delete'],
        check: (s) => hasAngleAt(s, 'A', B, alpha),
      },
      {
        instruction: `Trage bei B den Winkel β = ${beta}° an die Strecke AB an, auf derselben Seite von AB wie bei A.`,
        allowedTools: ['angle', 'select', 'delete'],
        check: (s) => hasAngleAt(s, B, 'A', beta),
      },
      {
        instruction: 'Markiere den Schnittpunkt der beiden Schenkel als C.',
        allowedTools: ['point', 'select', 'delete'],
        check: (s) => candidates.some((p) => hasPointNear(s, p.x, p.y) && hasRayIntersectionAt(s, p.x, p.y)),
      },
      {
        instruction: 'Verbinde C mit A und mit B.',
        allowedTools: ['segment', 'select', 'delete'],
        check: (s) => candidates.some((p) => hasSegment(s, 'A', p, dist(A, p)) && hasSegment(s, B, p, dist(B, p))),
      },
    ],
    solutionScene,
    solution: `Dreieck ABC mit C(${formatDe(C.x)}|${formatDe(C.y)}) (oder gespiegelt an AB)`,
    explanation:
      `Bei WSW sind eine Seite und die beiden anliegenden Winkel bekannt. ` +
      `1. Zeichne AB mit c = ${cm(c)}. ` +
      `2. Trage bei A den Winkel α = ${alpha}° an AB an. ` +
      `3. Trage bei B den Winkel β = ${beta}° an AB an, auf derselben Seite. Beide Winkel zusammen sind ${alpha + beta}° und damit kleiner als 180°, deshalb schneiden sich die Schenkel. ` +
      `4. Der Schnittpunkt der Schenkel ist C. ` +
      `5. Verbinde C mit A und B. Die Winkelangaben stimmen auf 1° genau. ` +
      `Liegen beide Schenkel unterhalb von AB, entsteht das an AB gespiegelte, kongruente Dreieck: Das Dreieck ist durch WSW eindeutig festgelegt.`,
    dedupeKey: `lb3kong-konstruktion-wsw:${c}:${alpha}:${beta}`,
  })
}
