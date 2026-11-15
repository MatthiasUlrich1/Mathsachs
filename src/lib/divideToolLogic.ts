/**
 * Pure logic for the interactive dividing tool (DivideTool): `count` wholes (bars or circles) are
 * cut into `parts` equal pieces each and the pieces are handed out to `persons` people.
 * Geometry is in SVG units (viewBox), never screen pixels.
 *
 * Part numbering: part `p` belongs to whole `floor(p / parts)` and is slice `p % parts` of it.
 */
export const DIVIDE_MIN_PARTS = 1
export const DIVIDE_MAX_PARTS = 12
export const DIVIDE_MIN_COUNT = 1
export const DIVIDE_MAX_COUNT = 4
export const DIVIDE_MIN_PERSONS = 2
export const DIVIDE_MAX_PERSONS = 6

export type DivideShape = 'bar' | 'circle'

/** part → person index (0-based), `null` = not yet handed out. */
export type DivideAssignment = Array<number | null>

export const clampParts = (parts: number): number =>
  Math.min(DIVIDE_MAX_PARTS, Math.max(DIVIDE_MIN_PARTS, Math.round(parts)))

export const divideTotalParts = (count: number, parts: number): number => count * parts

export const emptyAssignment = (count: number, parts: number): DivideAssignment =>
  new Array<number | null>(divideTotalParts(count, parts)).fill(null)

/** Exactly `count * parts` entries; anything that is not a valid person index becomes `null`. */
export const normalizeAssignment = (
  count: number,
  parts: number,
  persons: number,
  assignment: readonly (number | null)[],
): DivideAssignment =>
  Array.from({ length: divideTotalParts(count, parts) }, (_, i) => {
    const v = assignment[i]
    return typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < persons ? v : null
  })

/** Hand `part` to `person`. Handing it to the same person again takes it back. */
export const assignPart = (
  count: number,
  parts: number,
  persons: number,
  assignment: readonly (number | null)[],
  part: number,
  person: number,
): DivideAssignment => {
  const cur = normalizeAssignment(count, parts, persons, assignment)
  if (!Number.isInteger(part) || part < 0 || part >= cur.length) return cur
  if (!Number.isInteger(person) || person < 0 || person >= persons) return cur
  cur[part] = cur[part] === person ? null : person
  return cur
}

/** Number of parts each person holds. */
export const partsPerPerson = (persons: number, assignment: readonly (number | null)[]): number[] => {
  const out = new Array<number>(persons).fill(0)
  for (const v of assignment) if (typeof v === 'number' && v >= 0 && v < persons) out[v]!++
  return out
}

export const assignedCount = (assignment: readonly (number | null)[]): number =>
  assignment.filter((v) => v !== null).length

/**
 * Every part is handed out and every person holds the same share, which must equal count/persons.
 * A person with n parts holds n/parts wholes; n/parts === count/persons is compared as integers.
 */
export const divideMatches = (
  count: number,
  persons: number,
  parts: number,
  assignment: readonly (number | null)[],
): boolean => {
  if (!Number.isInteger(parts) || parts < DIVIDE_MIN_PARTS || parts > DIVIDE_MAX_PARTS) return false
  if (assignment.length !== divideTotalParts(count, parts)) return false
  if (assignment.some((v) => typeof v !== 'number' || !Number.isInteger(v) || v < 0 || v >= persons)) return false
  return partsPerPerson(persons, assignment).every((n) => n * persons === count * parts)
}

/** Numbers of parts per whole (1..12) that allow a fair share. */
export const divideSolvableParts = (count: number, persons: number): number[] => {
  const out: number[] = []
  for (let p = DIVIDE_MIN_PARTS; p <= DIVIDE_MAX_PARTS; p++) if ((count * p) % persons === 0) out.push(p)
  return out
}

/** A fair assignment for `parts` per whole (parts dealt out like cards), or null if there is none. */
export const divideSolutionAssignment = (count: number, persons: number, parts: number): DivideAssignment | null => {
  if ((count * parts) % persons !== 0) return null
  return Array.from({ length: count * parts }, (_, p) => p % persons)
}

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

export const DIVIDE_VIEWBOX_W = 380
const OBJECTS_TOP = 10
const BAR_H = 40
const BAR_PITCH = 54
const CIRCLE_R = 44
const CIRCLE_PITCH = 104
const PERSON_W = 112
const PERSON_H = 52
const PERSON_GAP = 10
const PERSON_COLS = 3
const SECTION_GAP = 18
const VIEWBOX_PAD = 8

/** Font size of the owner number drawn into an assigned part. */
export const DIVIDE_LABEL_FONT = 11

const f = (n: number) => Math.round(n * 100) / 100

export interface DividePartGeometry {
  part: number
  /** SVG path of the part. */
  d: string
  /** Centre for the owner label. */
  labelX: number
  labelY: number
}

export interface DivideObjectGeometry {
  index: number
  /** Bounding box of the whole. */
  box: { x: number; y: number; w: number; h: number }
  parts: DividePartGeometry[]
}

export interface DividePersonGeometry {
  index: number
  x: number
  y: number
  w: number
  h: number
  /** Text anchor (centre) of "Kind n" and of the part counter. */
  nameY: number
  countY: number
}

export interface DivideLayout {
  viewBoxW: number
  viewBoxH: number
  objects: DivideObjectGeometry[]
  people: DividePersonGeometry[]
}

const objectCols = (shape: DivideShape, count: number): number =>
  shape === 'bar' ? (count >= 3 ? 2 : 1) : count === 4 ? 2 : count

const circlePath = (cx: number, cy: number, r: number, parts: number, slice: number): string => {
  if (parts === 1) {
    return `M${f(cx - r)} ${f(cy)}A${r} ${r} 0 1 1 ${f(cx + r)} ${f(cy)}A${r} ${r} 0 1 1 ${f(cx - r)} ${f(cy)}Z`
  }
  const a0 = (slice / parts) * 2 * Math.PI - Math.PI / 2
  const a1 = ((slice + 1) / parts) * 2 * Math.PI - Math.PI / 2
  const p = (a: number) => `${f(cx + r * Math.cos(a))} ${f(cy + r * Math.sin(a))}`
  return `M${f(cx)} ${f(cy)}L${p(a0)}A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)}Z`
}

/** Positions of all wholes with their parts, and of the people below. */
export const divideLayout = (shape: DivideShape, count: number, persons: number, parts: number): DivideLayout => {
  const cols = objectCols(shape, count)
  const rows = Math.ceil(count / cols)
  const pitch = shape === 'bar' ? BAR_PITCH : CIRCLE_PITCH
  const cellW = shape === 'bar' ? (cols === 1 ? 300 : 170) : 2 * CIRCLE_R
  const colGap = shape === 'bar' ? 20 : 2 * CIRCLE_R * 0.4
  const gridW = cols * cellW + (cols - 1) * colGap
  const left = (DIVIDE_VIEWBOX_W - gridW) / 2

  const objects: DivideObjectGeometry[] = []
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols
    // A last, incomplete row is centred.
    const inRow = row === rows - 1 ? count - row * cols : cols
    const rowLeft = (DIVIDE_VIEWBOX_W - (inRow * cellW + (inRow - 1) * colGap)) / 2
    const x = (row === rows - 1 ? rowLeft : left) + col * (cellW + colGap)
    const y = OBJECTS_TOP + row * pitch
    const geo: DividePartGeometry[] = []
    for (let s = 0; s < parts; s++) {
      if (shape === 'bar') {
        const w = cellW / parts
        const x0 = x + s * w
        const x1 = x + (s + 1) * w
        geo.push({
          part: i * parts + s,
          d: `M${f(x0)} ${y}H${f(x1)}V${y + BAR_H}H${f(x0)}Z`,
          labelX: f((x0 + x1) / 2),
          labelY: y + BAR_H / 2 + 4,
        })
      } else {
        const cx = x + CIRCLE_R
        const cy = y + CIRCLE_R
        const mid = ((s + 0.5) / parts) * 2 * Math.PI - Math.PI / 2
        const lr = parts === 1 ? 0 : CIRCLE_R * 0.62
        geo.push({
          part: i * parts + s,
          d: circlePath(cx, cy, CIRCLE_R, parts, s),
          labelX: f(cx + lr * Math.cos(mid)),
          labelY: f(cy + lr * Math.sin(mid) + 4),
        })
      }
    }
    objects.push({
      index: i,
      box: { x, y, w: cellW, h: shape === 'bar' ? BAR_H : 2 * CIRCLE_R },
      parts: geo,
    })
  }

  const objectsBottom = OBJECTS_TOP + (rows - 1) * pitch + (shape === 'bar' ? BAR_H : 2 * CIRCLE_R)
  const personRows = Math.ceil(persons / PERSON_COLS)
  const peopleTop = objectsBottom + SECTION_GAP
  const people: DividePersonGeometry[] = []
  for (let i = 0; i < persons; i++) {
    const row = Math.floor(i / PERSON_COLS)
    const col = i % PERSON_COLS
    const inRow = row === personRows - 1 ? persons - row * PERSON_COLS : PERSON_COLS
    const rowLeft = (DIVIDE_VIEWBOX_W - (inRow * PERSON_W + (inRow - 1) * PERSON_GAP)) / 2
    const x = rowLeft + col * (PERSON_W + PERSON_GAP)
    const y = peopleTop + row * (PERSON_H + PERSON_GAP)
    people.push({ index: i, x, y, w: PERSON_W, h: PERSON_H, nameY: y + 21, countY: y + 40 })
  }
  const viewBoxH = peopleTop + personRows * PERSON_H + (personRows - 1) * PERSON_GAP + VIEWBOX_PAD
  return { viewBoxW: DIVIDE_VIEWBOX_W, viewBoxH, objects, people }
}

export const DIVIDE_PERSON_FILLS: readonly string[] = [
  '#fde68a',
  '#bfdbfe',
  '#fbcfe8',
  '#bbf7d0',
  '#ddd6fe',
  '#fed7aa',
]

export const dividePersonName = (index: number): string => `Kind ${index + 1}`

export const divideCountLabel = (n: number): string => (n === 1 ? '1 Teil' : `${n} Teile`)

/** Every text drawn into the SVG with a size, for fit tests (`chars * fontSize * 0.6` ≈ width). */
export const divideTextExtents = (
  shape: DivideShape,
  count: number,
  persons: number,
  parts: number,
): Array<{ text: string; x: number; y: number; fontSize: number; anchor: 'middle' }> => {
  const layout = divideLayout(shape, count, persons, parts)
  const out: Array<{ text: string; x: number; y: number; fontSize: number; anchor: 'middle' }> = []
  for (const o of layout.objects) {
    for (const p of o.parts) {
      // Owner label: person numbers are 1 digit (max 6).
      out.push({ text: String(persons), x: p.labelX, y: p.labelY, fontSize: DIVIDE_LABEL_FONT, anchor: 'middle' })
    }
  }
  for (const p of layout.people) {
    const cx = p.x + p.w / 2
    out.push({ text: dividePersonName(p.index), x: cx, y: p.nameY, fontSize: 13, anchor: 'middle' })
    out.push({ text: divideCountLabel(divideTotalParts(count, parts)), x: cx, y: p.countY, fontSize: 11, anchor: 'middle' })
  }
  return out
}

/** Static drawing for worksheets: undivided wholes and the (empty) people to divide and distribute on paper. */
export const dividePrintSvg = (shape: DivideShape, count: number, persons: number): string => {
  const layout = divideLayout(shape, count, persons, 1)
  const out: string[] = []
  for (const o of layout.objects) {
    out.push(`<path d="${o.parts[0]!.d}" fill="#ffffff" stroke="#334155" stroke-width="1.5"/>`)
  }
  for (const p of layout.people) {
    out.push(
      `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="8" fill="#ffffff" stroke="#334155" stroke-width="1.5"/>`,
      `<text x="${p.x + p.w / 2}" y="${p.nameY}" text-anchor="middle" font-size="13" fill="#0f172a">${dividePersonName(p.index)}</text>`,
    )
  }
  return `<svg width="${layout.viewBoxW}" height="${layout.viewBoxH}" viewBox="0 0 ${layout.viewBoxW} ${layout.viewBoxH}" xmlns="http://www.w3.org/2000/svg">${out.join('')}</svg>`
}
