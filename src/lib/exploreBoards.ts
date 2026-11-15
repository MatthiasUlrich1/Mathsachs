/**
 * Erkundungs-Tafelbilder (Fachwissen-Panel): Regler/Schalter veraendern eine SVG live.
 * Nicht bewertet, keine Aufgabe. Alles reine Funktionen; Lehrplan-Packs speichern nur
 * die Board-ID (`Fachwissen.explore`).
 */

export interface ExploreSlider {
  type: 'slider'
  id: string
  label: string
  min: number
  max: number
  step: number
  start: number
  /** Einheit fuer die Wertanzeige, inkl. fuehrendem Leerzeichen wenn noetig (" cm", "°"). */
  unit?: string
  /** Optional: Obergrenze zusaetzlich durch den Wert eines anderen Reglers begrenzt. */
  maxId?: string
}

export interface ExploreToggle {
  type: 'toggle'
  id: string
  label: string
  start: boolean
}

export type ExploreControl = ExploreSlider | ExploreToggle

/** Reglerwerte; Schalter sind 0 (aus) oder 1 (an). */
export type ExploreState = Record<string, number>

export interface ExploreBoardDef {
  title: string
  controls: ExploreControl[]
  /** Reine Funktion: SVG-Markup (nur Zahlen und feste Texte, nichts Nutzergeliefertes). */
  render(state: ExploreState): string
  /** Kurzer deutscher Text fuer Screenreader und als Bildunterschrift. */
  describe(state: ExploreState): string
}

export interface ExploreRef {
  boardId: string
  params?: Record<string, number>
}

import { isTopicVisible } from './topicVisibility'

/** Boards gehoeren zum Fachwissen: bei gesperrten (released:false) Themen nur fuer Pruefer/Entwickler. */
export function canShowExploreBoard(topic: { id?: string; released?: boolean; neu?: boolean }, role?: unknown): boolean {
  return isTopicVisible(topic, role)
}

/* ----------------------------- Helfer ----------------------------- */

const round10 = (n: number) => Math.round(n * 1e10) / 1e10

/** Zahl mit deutschem Dezimalkomma ("2,5"). */
export function fmtDe(n: number): string {
  return String(round10(n)).replace('.', ',')
}

/** Obergrenze eines Reglers unter Beruecksichtigung von `maxId`. */
export function sliderMax(control: ExploreSlider, state: ExploreState): number {
  if (control.maxId && Number.isFinite(state[control.maxId])) {
    return Math.max(control.min, Math.min(control.max, state[control.maxId]))
  }
  return control.max
}

function clampSlider(control: ExploreSlider, raw: number | undefined, max: number): number {
  const v = typeof raw === 'number' && Number.isFinite(raw) ? raw : control.start
  const snapped = control.min + Math.round((v - control.min) / control.step) * control.step
  return round10(Math.min(max, Math.max(control.min, snapped)))
}

/** Begrenzt jeden Wert auf Bereich/Raster; Regler mit `maxId` werden nach dem Bezugsregler begrenzt. */
export function clampExploreState(
  controls: ExploreControl[],
  state: ExploreState,
): ExploreState {
  const out: ExploreState = {}
  // Zwei Durchlaeufe: erst Regler ohne maxId, dann die abhaengigen.
  for (const c of controls) {
    if (c.type === 'toggle') out[c.id] = state[c.id] ? 1 : 0
    else if (!c.maxId) out[c.id] = clampSlider(c, state[c.id], c.max)
  }
  for (const c of controls) {
    if (c.type === 'slider' && c.maxId) out[c.id] = clampSlider(c, state[c.id], sliderMax(c, out))
  }
  return out
}

/** Startzustand; `params` ueberschreiben die Startwerte einzelner Regler/Schalter. */
export function exploreStartState(
  def: ExploreBoardDef,
  params?: Record<string, number>,
): ExploreState {
  const raw: ExploreState = {}
  for (const c of def.controls) {
    const override = params && Number.isFinite(params[c.id]) ? params[c.id] : undefined
    raw[c.id] = override ?? (c.type === 'toggle' ? (c.start ? 1 : 0) : c.start)
  }
  return clampExploreState(def.controls, raw)
}

const defineBoard = (def: ExploreBoardDef): ExploreBoardDef => ({
  ...def,
  render: (state) => def.render(clampExploreState(def.controls, state)),
  describe: (state) => def.describe(clampExploreState(def.controls, state)),
})

/* ------------------- Gemeinsame Layout-Konstanten ------------------- */

export const EXPLORE_VIEW_W = 400
export const EXPLORE_VIEW_H = 260
export const EXPLORE_FONT = 14
export const EXPLORE_FONT_BIG = 18

type TextAnchor = 'start' | 'middle' | 'end'

/** Einheitliches <text>-Format (wird vom Text-Fit-Test geparst). */
function svgText(
  x: number,
  y: number,
  content: string,
  opts: { anchor?: TextAnchor; size?: number; cls?: string } = {},
): string {
  const size = opts.size ?? EXPLORE_FONT
  const anchor = opts.anchor ?? 'middle'
  const cls = opts.cls ?? 'eb-text'
  return `<text x="${r2(x)}" y="${r2(y)}" font-size="${size}" text-anchor="${anchor}" class="${cls}">${content}</text>`
}

function r2(n: number): number {
  return Math.round(n * 100) / 100
}

const svgOpen = (extra = '') =>
  `<svg class="eb-svg" viewBox="0 0 ${EXPLORE_VIEW_W} ${EXPLORE_VIEW_H}" width="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"${extra}>`

/* --------------------------- Mittelsenkrechte --------------------------- */

export const MS_SCALE = 22 // Pixel je cm
export const MS_AB_CM = 6
export const MS_CX = 200
export const MS_CY = 130
export const MS_A = { x: MS_CX - (MS_AB_CM * MS_SCALE) / 2, y: MS_CY }
export const MS_B = { x: MS_CX + (MS_AB_CM * MS_SCALE) / 2, y: MS_CY }

const MS_EPS = 1e-9

export type MsCase = 'none' | 'touch' | 'two'

export function mittelsenkrechteCase(radiusCm: number): MsCase {
  const half = MS_AB_CM / 2
  if (Math.abs(radiusCm - half) < MS_EPS) return 'touch'
  return radiusCm > half ? 'two' : 'none'
}

const mittelsenkrechte = defineBoard({
  title: 'Mittelsenkrechte konstruieren',
  controls: [
    {
      type: 'slider',
      id: 'radius',
      label: 'Radius r',
      min: 1,
      max: 6,
      step: 0.5,
      start: 2,
      unit: ' cm',
    },
    { type: 'toggle', id: 'strecke', label: 'Strecke AB', start: true },
    { type: 'toggle', id: 'senkrechte', label: 'Mittelsenkrechte zeigen', start: false },
  ],
  render(s) {
    const r = s.radius
    const px = r * MS_SCALE
    const kind = mittelsenkrechteCase(r)
    const parts: string[] = [svgOpen()]
    parts.push(`<circle class="eb-circle eb-circle--a" cx="${MS_A.x}" cy="${MS_A.y}" r="${r2(px)}"/>`)
    parts.push(`<circle class="eb-circle eb-circle--b" cx="${MS_B.x}" cy="${MS_B.y}" r="${r2(px)}"/>`)
    if (s.strecke) {
      parts.push(`<line class="eb-seg" x1="${MS_A.x}" y1="${MS_A.y}" x2="${MS_B.x}" y2="${MS_B.y}"/>`)
      parts.push(svgText(MS_CX, MS_CY + 26, `AB = ${MS_AB_CM} cm`))
    }
    if (s.senkrechte) {
      parts.push(`<line class="eb-axis" x1="${MS_CX}" y1="4" x2="${MS_CX}" y2="${EXPLORE_VIEW_H - 4}"/>`)
      if (s.strecke) {
        parts.push(
          `<path class="eb-rightangle" d="M ${MS_CX} ${MS_CY - 9} L ${MS_CX + 9} ${MS_CY - 9} L ${MS_CX + 9} ${MS_CY}"/>`,
        )
      }
    }
    if (s.strecke || s.senkrechte) {
      parts.push(`<circle class="eb-dot eb-dot--m" cx="${MS_CX}" cy="${MS_CY}" r="3"/>`)
      parts.push(svgText(MS_CX - 7, MS_CY - 8, 'M', { anchor: 'end' }))
    }
    if (kind === 'two') {
      const h = Math.sqrt(r * r - (MS_AB_CM / 2) ** 2) * MS_SCALE
      for (const [sign, name] of [
        [-1, 'S₁'],
        [1, 'S₂'],
      ] as const) {
        const y = MS_CY + sign * h
        parts.push(`<circle class="eb-dot eb-dot--s" cx="${MS_CX}" cy="${r2(y)}" r="4"/>`)
        parts.push(svgText(MS_CX + 9, y + 5, name, { anchor: 'start' }))
      }
    }
    parts.push(`<circle class="eb-dot" cx="${MS_A.x}" cy="${MS_A.y}" r="4"/>`)
    parts.push(`<circle class="eb-dot" cx="${MS_B.x}" cy="${MS_B.y}" r="4"/>`)
    parts.push(svgText(MS_A.x, MS_A.y + 22, 'A'))
    parts.push(svgText(MS_B.x, MS_B.y + 22, 'B'))
    parts.push(svgText(10, 22, `r = ${fmtDe(r)} cm`, { anchor: 'start' }))
    parts.push('</svg>')
    return parts.join('')
  },
  describe(s) {
    const r = s.radius
    const half = MS_AB_CM / 2
    const rs = `${fmtDe(r)} cm`
    const hs = `${fmtDe(half)} cm`
    const kind = mittelsenkrechteCase(r)
    if (kind === 'none') {
      return `Mit r = ${rs} schneiden sich die Kreise um A und B nicht. Sie schneiden sich nur, wenn r größer als die Hälfte von AB ist, also r > ${hs}.`
    }
    if (kind === 'touch') {
      return `Mit r = ${rs} berühren sich die Kreise nur im Mittelpunkt M der Strecke AB. Sie schneiden sich erst, wenn r größer als ${hs} ist.`
    }
    const tail = s.senkrechte
      ? ' Die Gerade durch S₁ und S₂ ist die Mittelsenkrechte von AB.'
      : ' Schalte „Mittelsenkrechte zeigen“ ein, um die Gerade durch S₁ und S₂ zu sehen.'
    return `Mit r = ${rs} schneiden sich die Kreise in zwei Punkten S₁ und S₂, denn r ist größer als ${hs}.${tail}`
  },
})

/* ------------------------------ Winkelarten ------------------------------ */

export const WA_VX = 200
export const WA_VY = 130
export const WA_ARM = 110
export const WA_ARC_R = 38
export const WA_LABEL_R = 66
export const WA_SQUARE = 20

export interface WinkelArt {
  key: 'null' | 'spitz' | 'recht' | 'stumpf' | 'gestreckt' | 'ueberstumpf' | 'voll'
  /** Mit unbestimmtem Artikel: "ein spitzer Winkel". */
  phrase: string
  rule: string
}

export function winkelArt(deg: number): WinkelArt {
  if (deg <= 0) return { key: 'null', phrase: 'ein Nullwinkel', rule: 'beide Schenkel liegen aufeinander' }
  if (deg < 90) return { key: 'spitz', phrase: 'ein spitzer Winkel', rule: 'kleiner als 90°' }
  if (deg === 90) return { key: 'recht', phrase: 'ein rechter Winkel', rule: 'genau 90°' }
  if (deg < 180) return { key: 'stumpf', phrase: 'ein stumpfer Winkel', rule: 'größer als 90°, kleiner als 180°' }
  if (deg === 180) return { key: 'gestreckt', phrase: 'ein gestreckter Winkel', rule: 'genau 180°' }
  if (deg < 360) return { key: 'ueberstumpf', phrase: 'ein überstumpfer Winkel', rule: 'größer als 180°, kleiner als 360°' }
  return { key: 'voll', phrase: 'ein Vollwinkel', rule: 'genau 360°' }
}

const polar = (deg: number, radius: number) => {
  const rad = (deg * Math.PI) / 180
  return { x: WA_VX + radius * Math.cos(rad), y: WA_VY - radius * Math.sin(rad) }
}

const winkelarten = defineBoard({
  title: 'Winkelarten erkunden',
  controls: [
    { type: 'slider', id: 'winkel', label: 'Winkel', min: 0, max: 360, step: 5, start: 60, unit: '°' },
    { type: 'toggle', id: 'grad', label: 'Gradzahl anzeigen', start: true },
  ],
  render(s) {
    const deg = s.winkel
    const parts: string[] = [svgOpen()]
    const end = polar(deg, WA_ARM)
    const arcStart = polar(0, WA_ARC_R)
    const arcEnd = polar(deg, WA_ARC_R)
    const large = deg > 180 ? 1 : 0
    if (deg >= 360) {
      parts.push(`<circle class="eb-sector" cx="${WA_VX}" cy="${WA_VY}" r="${WA_ARC_R}"/>`)
    } else if (deg > 0) {
      parts.push(
        `<path class="eb-sector" d="M ${WA_VX} ${WA_VY} L ${r2(arcStart.x)} ${r2(arcStart.y)} A ${WA_ARC_R} ${WA_ARC_R} 0 ${large} 0 ${r2(arcEnd.x)} ${r2(arcEnd.y)} Z"/>`,
      )
    }
    if (deg === 90) {
      parts.push(
        `<path class="eb-rightangle" d="M ${WA_VX + WA_SQUARE} ${WA_VY} L ${WA_VX + WA_SQUARE} ${WA_VY - WA_SQUARE} L ${WA_VX} ${WA_VY - WA_SQUARE}"/>`,
      )
    } else if (deg >= 360) {
      parts.push(`<circle class="eb-arc" cx="${WA_VX}" cy="${WA_VY}" r="${WA_ARC_R}"/>`)
    } else if (deg > 0) {
      parts.push(
        `<path class="eb-arc" d="M ${r2(arcStart.x)} ${r2(arcStart.y)} A ${WA_ARC_R} ${WA_ARC_R} 0 ${large} 0 ${r2(arcEnd.x)} ${r2(arcEnd.y)}"/>`,
      )
    }
    parts.push(`<line class="eb-arm eb-arm--fixed" x1="${WA_VX}" y1="${WA_VY}" x2="${WA_VX + WA_ARM}" y2="${WA_VY}"/>`)
    parts.push(`<line class="eb-arm" x1="${WA_VX}" y1="${WA_VY}" x2="${r2(end.x)}" y2="${r2(end.y)}"/>`)
    parts.push(`<circle class="eb-dot" cx="${WA_VX}" cy="${WA_VY}" r="4"/>`)
    if (s.grad) {
      const p = polar(deg / 2, WA_LABEL_R)
      parts.push(svgText(p.x, p.y + 5, `${deg}°`, { size: EXPLORE_FONT_BIG }))
    }
    parts.push('</svg>')
    return parts.join('')
  },
  describe(s) {
    const art = winkelArt(s.winkel)
    return `Der Winkel ist ${s.winkel}° groß, das ist ${art.phrase} (${art.rule}).`
  },
})

/* ----------------------------- Bruch erweitern ----------------------------- */

export const BE_X = 30
export const BE_W = 340
export const BE_BAR_H = 44
export const BE_TOP_Y = 44
export const BE_BOTTOM_Y = 134

function bar(y: number, parts: number, filled: number, withOriginal: number | null): string {
  const w = BE_W / parts
  const out: string[] = []
  for (let i = 0; i < parts; i++) {
    out.push(
      `<rect class="eb-part${i < filled ? ' eb-part--fill' : ''}" x="${r2(BE_X + i * w)}" y="${y}" width="${r2(w)}" height="${BE_BAR_H}"/>`,
    )
  }
  out.push(`<rect class="eb-frame" x="${BE_X}" y="${y}" width="${BE_W}" height="${BE_BAR_H}"/>`)
  if (withOriginal !== null) {
    const ow = BE_W / withOriginal
    for (let i = 1; i < withOriginal; i++) {
      out.push(
        `<line class="eb-strong" x1="${r2(BE_X + i * ow)}" y1="${y - 4}" x2="${r2(BE_X + i * ow)}" y2="${y + BE_BAR_H + 4}"/>`,
      )
    }
  }
  return out.join('')
}

const bruchErweitern = defineBoard({
  title: 'Brüche erweitern',
  controls: [
    { type: 'slider', id: 'zaehler', label: 'Zähler', min: 1, max: 12, step: 1, start: 2, maxId: 'nenner' },
    { type: 'slider', id: 'nenner', label: 'Nenner', min: 2, max: 12, step: 1, start: 3 },
    { type: 'slider', id: 'faktor', label: 'Erweiterungsfaktor k', min: 2, max: 6, step: 1, start: 2 },
  ],
  render(s) {
    const a = s.zaehler
    const b = s.nenner
    const k = s.faktor
    const parts: string[] = [svgOpen()]
    parts.push(svgText(BE_X, BE_TOP_Y - 10, `${a}/${b}`, { anchor: 'start', size: EXPLORE_FONT_BIG }))
    parts.push(bar(BE_TOP_Y, b, a, null))
    parts.push(svgText(EXPLORE_VIEW_W / 2, 112, `Erweitern mit ${k}`))
    parts.push(svgText(BE_X, BE_BOTTOM_Y - 10, `${a * k}/${b * k}`, { anchor: 'start', size: EXPLORE_FONT_BIG }))
    parts.push(bar(BE_BOTTOM_Y, b * k, a * k, b))
    parts.push('</svg>')
    return parts.join('')
  },
  describe(s) {
    const a = s.zaehler
    const b = s.nenner
    const k = s.faktor
    return `${a}/${b} = ${a * k}/${b * k} – der Anteil bleibt gleich. Zähler und Nenner wurden beide mit ${k} multipliziert.`
  },
})

/* ------------------------------- Registry ------------------------------- */

export const EXPLORE_BOARDS: Record<string, ExploreBoardDef> = {
  mittelsenkrechte,
  winkelarten,
  bruchErweitern,
}

/** Unbekannte IDs liefern `undefined` (kein Absturz, nichts wird gezeigt). */
export function getExploreBoard(boardId: string | undefined): ExploreBoardDef | undefined {
  if (!boardId || !Object.prototype.hasOwnProperty.call(EXPLORE_BOARDS, boardId)) return undefined
  return EXPLORE_BOARDS[boardId]
}
