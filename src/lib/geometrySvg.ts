/**
 * SVG generators for geometry tasks.
 * Provides functions to create visual representations of geometric shapes.
 */

export interface RectangleSvgProps {
  /** Width label (e.g., "5 cm") */
  widthLabel: string
  /** Height label (e.g., "3 cm") */
  heightLabel: string
  /** Optional fill color */
  fill?: string
  /** Optional stroke color */
  stroke?: string
}

/**
 * Generate an SVG string for a labeled rectangle.
 * Used for area/perimeter problems.
 * Automatically detects squares and renders them with equal sides.
 */
export function generateRectangleSvg({
  widthLabel,
  heightLabel,
  fill = '#e3f2fd',
  stroke = '#1976d2',
}: RectangleSvgProps): string {
  // Extract numeric values to determine if it's a square
  const widthNum = parseFloat(widthLabel)
  const heightNum = parseFloat(heightLabel)
  const isSquare = !isNaN(widthNum) && !isNaN(heightNum) && widthNum === heightNum
  
  // Base dimensions
  let rectW: number
  let rectH: number
  
  if (isSquare) {
    // Square: equal sides
    rectW = 160
    rectH = 160
  } else {
    // Rectangle: proportional to actual values
    const ratio = isNaN(widthNum) || isNaN(heightNum) ? 1.67 : widthNum / heightNum
    if (ratio > 1) {
      rectW = 200
      rectH = 200 / ratio
    } else {
      rectH = 160
      rectW = 160 * ratio
    }
  }
  
  const padding = 40
  const labelSpaceRight = 70 // Extra space for right label
  const totalW = rectW + 2 * padding + labelSpaceRight
  const totalH = rectH + 2 * padding + 40

  return `
<svg width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg">
  <!-- Rectangle ${isSquare ? '(Square)' : ''} -->
  <rect
    x="${padding}"
    y="${padding}"
    width="${rectW}"
    height="${rectH}"
    fill="${fill}"
    stroke="${stroke}"
    stroke-width="2"
  />
  
  <!-- Width label (bottom) -->
  <line
    x1="${padding}"
    y1="${padding + rectH + 15}"
    x2="${padding + rectW}"
    y2="${padding + rectH + 15}"
    stroke="${stroke}"
    stroke-width="1"
    marker-start="url(#arrowStart)"
    marker-end="url(#arrowEnd)"
  />
  <text
    x="${padding + rectW / 2}"
    y="${padding + rectH + 35}"
    text-anchor="middle"
    font-size="16"
    font-weight="bold"
    fill="#333"
  >
    ${widthLabel}
  </text>
  
  <!-- Height label (right) -->
  <line
    x1="${padding + rectW + 15}"
    y1="${padding}"
    x2="${padding + rectW + 15}"
    y2="${padding + rectH}"
    stroke="${stroke}"
    stroke-width="1"
    marker-start="url(#arrowStart)"
    marker-end="url(#arrowEnd)"
  />
  <text
    x="${padding + rectW + 30}"
    y="${padding + rectH / 2 + 5}"
    text-anchor="start"
    font-size="16"
    font-weight="bold"
    fill="#333"
  >
    ${heightLabel}
  </text>
  
  <!-- Arrow markers -->
  <defs>
    <marker
      id="arrowStart"
      markerWidth="10"
      markerHeight="10"
      refX="5"
      refY="5"
      orient="auto-start-reverse"
    >
      <polygon points="10,5 0,10 0,0" fill="${stroke}" />
    </marker>
    <marker
      id="arrowEnd"
      markerWidth="10"
      markerHeight="10"
      refX="5"
      refY="5"
      orient="auto"
    >
      <polygon points="0,5 10,10 10,0" fill="${stroke}" />
    </marker>
  </defs>
</svg>`.trim()
}

export interface TriangleSvgProps {
  /** Base label */
  baseLabel: string
  /** Height label */
  heightLabel: string
  /** Optional fill color */
  fill?: string
  /** Optional stroke color */
  stroke?: string
}

/**
 * Generate an SVG string for a labeled triangle (base + height).
 */
export function generateTriangleSvg({
  baseLabel,
  heightLabel,
  fill = '#fff3e0',
  stroke = '#f57c00',
}: TriangleSvgProps): string {
  const base = 200
  const height = 140
  const padding = 40
  const totalW = base + 2 * padding
  const totalH = height + 2 * padding + 20

  const x1 = padding
  const y1 = padding + height
  const x2 = padding + base
  const y2 = padding + height
  const x3 = padding + base / 2
  const y3 = padding

  return `
<svg width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg">
  <!-- Triangle -->
  <polygon
    points="${x1},${y1} ${x2},${y2} ${x3},${y3}"
    fill="${fill}"
    stroke="${stroke}"
    stroke-width="2"
  />
  
  <!-- Height line (dashed) -->
  <line
    x1="${x3}"
    y1="${y3}"
    x2="${x3}"
    y2="${y1}"
    stroke="${stroke}"
    stroke-width="1"
    stroke-dasharray="4"
  />
  
  <!-- Base label (bottom) -->
  <line
    x1="${x1}"
    y1="${y1 + 15}"
    x2="${x2}"
    y2="${y1 + 15}"
    stroke="${stroke}"
    stroke-width="1"
    marker-start="url(#arrowStart)"
    marker-end="url(#arrowEnd)"
  />
  <text
    x="${x1 + base / 2}"
    y="${y1 + 35}"
    text-anchor="middle"
    font-size="16"
    font-weight="bold"
    fill="#333"
  >
    ${baseLabel}
  </text>
  
  <!-- Height label (right of dashed line) -->
  <text
    x="${x3 + 15}"
    y="${y3 + height / 2}"
    text-anchor="start"
    font-size="16"
    font-weight="bold"
    fill="#333"
  >
    ${heightLabel}
  </text>
  
  <!-- Arrow markers -->
  <defs>
    <marker
      id="arrowStart"
      markerWidth="10"
      markerHeight="10"
      refX="5"
      refY="5"
      orient="auto-start-reverse"
    >
      <polygon points="10,5 0,10 0,0" fill="${stroke}" />
    </marker>
    <marker
      id="arrowEnd"
      markerWidth="10"
      markerHeight="10"
      refX="5"
      refY="5"
      orient="auto"
    >
      <polygon points="0,5 10,10 10,0" fill="${stroke}" />
    </marker>
  </defs>
</svg>`.trim()
}

export interface TriangleAnglesSvgProps {
  /** Labels for the three interior angles (e.g. "70°", "?"). */
  aLabel: string
  bLabel: string
  cLabel: string
  /**
   * Interior angles in degrees at vertices A, B, C (must sum to 180).
   * When set, the triangle is constructed so drawn angles match the numbers.
   */
  anglesDeg?: [number, number, number]
  fill?: string
  stroke?: string
  /** Arc radius in px (default 28). */
  arcRadius?: number
}

/** Unit vector from `from` toward `to`. */
function unitToward(
  from: [number, number],
  to: [number, number],
): [number, number] {
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const len = Math.hypot(dx, dy) || 1
  return [dx / len, dy / len]
}

function normalize2(v: [number, number]): [number, number] {
  const len = Math.hypot(v[0], v[1]) || 1
  return [v[0] / len, v[1] / len]
}

/**
 * Interior-angle mark at a polygon vertex.
 *
 * German school convention:
 * - normal angle: circular arc (sector) on the **interior** side
 * - right angle (≈90°): Viertelkreis **with a dot** (not a US-style square)
 *
 * `u` and `v` are unit vectors along the two edges leaving the vertex.
 * Optional `interior` (e.g. polygon centroid) forces the wedge that contains
 * that point — critical for obtuse angles.
 */
export function angleMarkSvg(
  vertex: [number, number],
  uIn: [number, number],
  vIn: [number, number],
  label: string,
  {
    radius = 28,
    stroke = '#f57c00',
    fill = '#fff3e0',
    interior,
  }: {
    radius?: number
    stroke?: string
    fill?: string
    /** A point known to lie inside the marked angle (e.g. centroid). */
    interior?: [number, number]
  } = {},
): string {
  const [vx, vy] = vertex
  let u = normalize2(uIn)
  let v = normalize2(vIn)

  if (interior) {
    const w = unitToward(vertex, interior)
    // Direct wedge u→v contains w if both partial crosses share the turn sense.
    const crossUV = u[0] * v[1] - u[1] * v[0]
    const crossUW = u[0] * w[1] - u[1] * w[0]
    const crossWV = w[0] * v[1] - w[1] * v[0]
    const inWedge =
      Math.abs(crossUV) < 1e-12 ||
      (crossUW * crossUV >= -1e-12 && crossWV * crossUV >= -1e-12)
    if (!inWedge) {
      ;[u, v] = [v, u]
    }
  }

  const cross = u[0] * v[1] - u[1] * v[0]
  const dot = Math.max(-1, Math.min(1, u[0] * v[0] + u[1] * v[1]))
  const ang = Math.acos(dot)
  const deg = (ang * 180) / Math.PI
  const isRight = Math.abs(deg - 90) < 1.5

  // Bisector of the marked wedge (points into the interior for convex polygons)
  let bx = u[0] + v[0]
  let by = u[1] + v[1]
  const bl = Math.hypot(bx, by) || 1
  bx /= bl
  by /= bl
  if (interior) {
    const w = unitToward(vertex, interior)
    if (bx * w[0] + by * w[1] < 0) {
      bx = -bx
      by = -by
    }
  }

  // SVG y-down: cross > 0 ⇒ clockwise from u to v ⇒ sweep-flag 1
  const sweep = cross > 0 ? 1 : 0
  const large = deg > 180 ? 1 : 0

  const a0x = vx + u[0] * radius
  const a0y = vy + u[1] * radius
  const a1x = vx + v[0] * radius
  const a1y = vy + v[1] * radius
  const arc = `M ${a0x},${a0y} A ${radius},${radius} 0 ${large},${sweep} ${a1x},${a1y}`

  const labelR = radius + 14
  const lx = vx + bx * labelR
  const ly = vy + by * labelR
  const labelSvg = label
    ? `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="15" font-weight="bold" fill="#333">${label}</text>`
    : ''

  if (isRight) {
    // German: Viertelkreis mit Punkt (not a US square)
    const dotR = radius * 0.42
    const dx = vx + bx * dotR
    const dy = vy + by * dotR
    return `
  <path d="${arc} L ${vx},${vy} Z" fill="${fill}" fill-opacity="0.45" stroke="none"/>
  <path d="${arc}" fill="none" stroke="${stroke}" stroke-width="2"/>
  <circle cx="${dx}" cy="${dy}" r="3.2" fill="${stroke}"/>
  ${labelSvg}`
  }

  return `
  <path d="${arc} L ${vx},${vy} Z" fill="${fill}" fill-opacity="0.35" stroke="none"/>
  <path d="${arc}" fill="none" stroke="${stroke}" stroke-width="2"/>
  ${labelSvg}`
}

function fitPolygon(
  pts: Array<[number, number]>,
  width: number,
  height: number,
  pad: number,
): Array<[number, number]> {
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const bw = maxX - minX || 1
  const bh = maxY - minY || 1
  const scale = Math.min((width - 2 * pad) / bw, (height - 2 * pad) / bh)
  return pts.map(([x, y]) => [
    pad + (x - minX) * scale,
    pad + (y - minY) * scale,
  ])
}

/** Triangle from interior angles (law of sines), math y-up then flipped for SVG. */
function trianglePointsFromAngles(
  A: number,
  B: number,
  C: number,
): [[number, number], [number, number], [number, number]] {
  const toRad = (d: number) => (d * Math.PI) / 180
  const scale = 200
  const sideC = scale // AB
  const sideB = (scale * Math.sin(toRad(B))) / Math.sin(toRad(C)) // AC
  const Ax = 0
  const Ay = 0
  const Bx = sideC
  const By = 0
  const Cx = sideB * Math.cos(toRad(A))
  const Cy = sideB * Math.sin(toRad(A))
  // Flip y for SVG
  return [
    [Ax, -Ay],
    [Bx, -By],
    [Cx, -Cy],
  ]
}

/**
 * Triangle with geometrically correct interior angles, angle arcs (or
 * German right-angle marks), and labels at the vertices.
 */
export function generateTriangleAnglesSvg({
  aLabel,
  bLabel,
  cLabel,
  anglesDeg,
  fill = '#fff3e0',
  stroke = '#f57c00',
  arcRadius = 28,
}: TriangleAnglesSvgProps): string {
  const w = 300
  const h = 240
  const pad = 44
  const angles: [number, number, number] = anglesDeg ?? [50, 60, 70]
  const raw = trianglePointsFromAngles(angles[0], angles[1], angles[2])
  const [A, B, C] = fitPolygon(raw, w, h, pad) as [
    [number, number],
    [number, number],
    [number, number],
  ]
  const interior: [number, number] = [
    (A[0] + B[0] + C[0]) / 3,
    (A[1] + B[1] + C[1]) / 3,
  ]

  const markA = angleMarkSvg(A, unitToward(A, B), unitToward(A, C), aLabel, {
    radius: arcRadius,
    stroke,
    fill,
    interior,
  })
  const markB = angleMarkSvg(B, unitToward(B, A), unitToward(B, C), bLabel, {
    radius: arcRadius,
    stroke,
    fill,
    interior,
  })
  const markC = angleMarkSvg(C, unitToward(C, A), unitToward(C, B), cLabel, {
    radius: arcRadius,
    stroke,
    fill,
    interior,
  })

  return `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <polygon points="${A[0]},${A[1]} ${B[0]},${B[1]} ${C[0]},${C[1]}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
  ${markA}
  ${markB}
  ${markC}
</svg>`.trim()
}

export interface QuadAnglesSvgProps {
  aLabel: string
  bLabel: string
  cLabel: string
  dLabel: string
  /** Interior angles in degrees (must sum to 360). Enables correct corner marks. */
  anglesDeg?: [number, number, number, number]
  fill?: string
  stroke?: string
  arcRadius?: number
}

/** Equal-side convex polygon from interior angles (turtle construction). */
function polygonFromInteriorAngles(angles: number[], side = 90): Array<[number, number]> {
  let x = 0
  let y = 0
  let heading = 0
  const pts: Array<[number, number]> = []
  const n = angles.length
  for (let i = 0; i < n; i++) {
    pts.push([x, y])
    x += side * Math.cos(heading)
    y += side * Math.sin(heading)
    const nextInterior = angles[(i + 1) % n]
    const exterior = Math.PI - (nextInterior * Math.PI) / 180
    heading += exterior
  }
  // Flip y for SVG
  return pts.map(([px, py]) => [px, -py])
}

/**
 * Convex quadrilateral with correct interior-angle arcs / German right-angle marks.
 */
export function generateQuadAnglesSvg({
  aLabel,
  bLabel,
  cLabel,
  dLabel,
  anglesDeg,
  fill = '#e8f5e9',
  stroke = '#2e7d32',
  arcRadius = 26,
}: QuadAnglesSvgProps): string {
  const w = 320
  const h = 260
  const pad = 44
  const angles: [number, number, number, number] = anglesDeg ?? [80, 100, 90, 90]
  const raw = polygonFromInteriorAngles(angles)
  const pts = fitPolygon(raw, w, h, pad) as [
    [number, number],
    [number, number],
    [number, number],
    [number, number],
  ]
  const interior: [number, number] = [
    pts.reduce((s, p) => s + p[0], 0) / 4,
    pts.reduce((s, p) => s + p[1], 0) / 4,
  ]
  const labels = [aLabel, bLabel, cLabel, dLabel]
  const marks = pts
    .map((p, i) => {
      const prev = pts[(i + 3) % 4]
      const next = pts[(i + 1) % 4]
      return angleMarkSvg(p, unitToward(p, prev), unitToward(p, next), labels[i], {
        radius: arcRadius,
        stroke,
        fill,
        interior,
      })
    })
    .join('\n')

  return `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <polygon points="${pts.map((p) => p.join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
  ${marks}
</svg>`.trim()
}

export interface CircleSvgProps {
  /** Radius label */
  radiusLabel: string
  /** Optional fill color */
  fill?: string
  /** Optional stroke color */
  stroke?: string
}

/**
 * Generate an SVG string for a labeled circle (radius).
 */
export function generateCircleSvg({
  radiusLabel,
  fill = '#f3e5f5',
  stroke = '#7b1fa2',
}: CircleSvgProps): string {
  const radius = 80
  const padding = 40
  const totalSize = 2 * (radius + padding)

  const cx = padding + radius
  const cy = padding + radius

  return `
<svg width="${totalSize}" height="${totalSize}" xmlns="http://www.w3.org/2000/svg">
  <!-- Circle -->
  <circle
    cx="${cx}"
    cy="${cy}"
    r="${radius}"
    fill="${fill}"
    stroke="${stroke}"
    stroke-width="2"
  />
  
  <!-- Radius line -->
  <line
    x1="${cx}"
    y1="${cy}"
    x2="${cx + radius}"
    y2="${cy}"
    stroke="${stroke}"
    stroke-width="2"
  />
  
  <!-- Center dot -->
  <circle
    cx="${cx}"
    cy="${cy}"
    r="3"
    fill="${stroke}"
  />
  
  <!-- Radius label -->
  <text
    x="${cx + radius / 2}"
    y="${cy - 10}"
    text-anchor="middle"
    font-size="16"
    font-weight="bold"
    fill="#333"
  >
    ${radiusLabel}
  </text>
</svg>`.trim()
}

export interface CuboidSvgProps {
  /** Length (Länge) label */
  lengthLabel: string
  /** Width (Breite) label */
  widthLabel: string
  /** Height (Höhe) label */
  heightLabel: string
  /** Optional fill color */
  fill?: string
  /** Optional stroke color */
  stroke?: string
  /** Equal edge look (Würfel). */
  cube?: boolean
  /** Optional label on the top face, e.g. "G = 24 cm²". */
  topFaceLabel?: string
}

type CuboidPt = [number, number]

/** Shared isometric Quader/Würfel geometry (visible faces + dashed hidden edges). */
function cuboidIsoGeometry(opts?: { cube?: boolean; padding?: number }) {
  const cube = Boolean(opts?.cube)
  const padding = opts?.padding ?? 40
  const baseW = cube ? 120 : 180
  const baseH = cube ? 120 : 100
  const depth = cube ? 70 : 80
  const totalW = baseW + depth + 2 * padding + 36
  const totalH = baseH + depth + 2 * padding + 48
  const x0 = padding
  const y0 = padding + depth
  const frontBL: CuboidPt = [x0, y0 + baseH]
  const frontBR: CuboidPt = [x0 + baseW, y0 + baseH]
  const frontTR: CuboidPt = [x0 + baseW, y0]
  const frontTL: CuboidPt = [x0, y0]
  const backBL: CuboidPt = [x0 + depth, y0 + baseH - depth]
  const backBR: CuboidPt = [x0 + baseW + depth, y0 + baseH - depth]
  const backTR: CuboidPt = [x0 + baseW + depth, y0 - depth]
  const backTL: CuboidPt = [x0 + depth, y0 - depth]
  const poly = (...pts: CuboidPt[]) => pts.map(([x, y]) => `${x},${y}`).join(' ')
  return {
    padding,
    baseW,
    baseH,
    depth,
    totalW,
    totalH,
    frontBL,
    frontBR,
    frontTR,
    frontTL,
    backBL,
    backBR,
    backTR,
    backTL,
    poly,
  }
}

function cuboidSolidFaces(
  g: ReturnType<typeof cuboidIsoGeometry>,
  fill: string,
  stroke: string,
  frontFill?: string,
): string {
  const {
    frontBL,
    frontBR,
    frontTR,
    frontTL,
    backBL,
    backBR,
    backTR,
    backTL,
    poly,
  } = g
  // Hidden edges (the three occluded sides), then visible faces: top, right, front.
  return `
  <g stroke="${stroke}" stroke-width="1.6" fill="none" stroke-dasharray="5 4" opacity="0.85">
    <line x1="${frontBL[0]}" y1="${frontBL[1]}" x2="${backBL[0]}" y2="${backBL[1]}"/>
    <line x1="${backBL[0]}" y1="${backBL[1]}" x2="${backBR[0]}" y2="${backBR[1]}"/>
    <line x1="${backBL[0]}" y1="${backBL[1]}" x2="${backTL[0]}" y2="${backTL[1]}"/>
  </g>
  <polygon points="${poly(frontTL, frontTR, backTR, backTL)}" fill="${fill}" stroke="${stroke}" stroke-width="2" opacity="0.92"/>
  <polygon points="${poly(frontTR, frontBR, backBR, backTR)}" fill="${fill}" stroke="${stroke}" stroke-width="2" opacity="0.8"/>
  <polygon points="${poly(frontTL, frontTR, frontBR, frontBL)}" fill="${frontFill ?? fill}" stroke="${stroke}" stroke-width="2"/>
`.trim()
}

/**
 * Generate an SVG string for a labeled 3D cuboid (Quader) or cube (Würfel).
 * Shows front, top and right faces plus dashed hidden edges for the other three sides.
 */
export function generateCuboidSvg({
  lengthLabel,
  widthLabel,
  heightLabel,
  fill = '#e3f2fd',
  stroke = '#1976d2',
  cube = false,
  topFaceLabel,
}: CuboidSvgProps): string {
  const g = cuboidIsoGeometry({ cube })
  const {
    totalW,
    totalH,
    frontBL,
    frontBR,
    frontTR,
    frontTL,
    backBR,
    backTR,
    backTL,
  } = g
  const topMidX = (frontTL[0] + frontTR[0] + backTR[0] + backTL[0]) / 4
  const topMidY = (frontTL[1] + frontTR[1] + backTR[1] + backTL[1]) / 4

  return `
<svg width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${cube ? 'Würfel' : 'Quader'}">
  ${cuboidSolidFaces(g, fill, stroke)}
  ${
    topFaceLabel
      ? `<text x="${topMidX}" y="${topMidY + 5}" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">${topFaceLabel}</text>`
      : ''
  }
  <line x1="${frontBL[0]}" y1="${frontBL[1] + 20}" x2="${frontBR[0]}" y2="${frontBR[1] + 20}" stroke="${stroke}" stroke-width="1" marker-start="url(#cuboidArrowStart)" marker-end="url(#cuboidArrowEnd)"/>
  <text x="${(frontBL[0] + frontBR[0]) / 2}" y="${frontBL[1] + 38}" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">${lengthLabel}</text>
  <line x1="${frontBR[0] + 10}" y1="${frontBR[1]}" x2="${backBR[0] + 10}" y2="${backBR[1]}" stroke="${stroke}" stroke-width="1" marker-start="url(#cuboidArrowStart)" marker-end="url(#cuboidArrowEnd)"/>
  <text x="${(frontBR[0] + backBR[0]) / 2 + 25}" y="${(frontBR[1] + backBR[1]) / 2 + 5}" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">${widthLabel}</text>
  <line x1="${frontTL[0] - 15}" y1="${frontTL[1]}" x2="${frontBL[0] - 15}" y2="${frontBL[1]}" stroke="${stroke}" stroke-width="1" marker-start="url(#cuboidArrowStart)" marker-end="url(#cuboidArrowEnd)"/>
  <text x="${frontTL[0] - 28}" y="${(frontTL[1] + frontBL[1]) / 2 + 5}" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">${heightLabel}</text>
  <defs>
    <marker id="cuboidArrowStart" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto-start-reverse">
      <polygon points="10,5 0,10 0,0" fill="${stroke}" />
    </marker>
    <marker id="cuboidArrowEnd" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
      <polygon points="0,5 10,10 10,0" fill="${stroke}" />
    </marker>
  </defs>
</svg>`.trim()
}

export interface CuboidFaceEdgeSvgProps {
  /** Highlighted face area label, e.g. "24 cm²" or "?" */
  faceAreaLabel: string
  /** Edge on the face (horizontal), e.g. "6 cm" or "?" */
  faceEdgeLabel: string
  /** Edge perpendicular to that face edge (height of face / body), e.g. "4 cm" or "?" */
  perpendicularLabel: string
  /** Caption under the figure */
  caption?: string
  fill?: string
  stroke?: string
  highlight?: string
  /** Draw as Würfel (square faces). */
  cube?: boolean
  /** Optional face kind label above the highlighted face. */
  faceKindLabel?: string
}

/**
 * Quader/Würfel with one face highlighted: Fläche ↔ senkrechte Seitenlänge.
 * Complete solid (front/top/right + dashed hidden edges).
 */
export function generateCuboidFaceEdgeSvg({
  faceAreaLabel,
  faceEdgeLabel,
  perpendicularLabel,
  caption,
  fill = '#e3f2fd',
  stroke = '#1976d2',
  highlight = '#fff3cd',
  cube = false,
  faceKindLabel,
}: CuboidFaceEdgeSvgProps): string {
  const g = cuboidIsoGeometry({ cube, padding: 36 })
  const { totalW, totalH, frontBL, frontBR, frontTR, frontTL } = g
  const midX = (frontTL[0] + frontTR[0]) / 2
  const midY = (frontTL[1] + frontBL[1]) / 2
  const kind =
    faceKindLabel ?? (cube ? 'Seitenfläche (Quadrat)' : 'Seitenfläche (Rechteck)')
  return `
<svg width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${cube ? 'Würfel' : 'Quader'} mit hervorgehobener Seitenfläche">
  ${cuboidSolidFaces(g, fill, stroke, highlight)}
  <text x="${midX}" y="${midY + 5}" text-anchor="middle" font-size="15" font-weight="bold" fill="#333">A = ${faceAreaLabel}</text>
  <line x1="${frontBL[0]}" y1="${frontBL[1] + 18}" x2="${frontBR[0]}" y2="${frontBR[1] + 18}" stroke="${stroke}" stroke-width="1.5"/>
  <text x="${midX}" y="${frontBL[1] + 36}" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">${faceEdgeLabel}</text>
  <line x1="${frontBR[0] + 14}" y1="${frontBR[1]}" x2="${frontTR[0] + 14}" y2="${frontTR[1]}" stroke="${stroke}" stroke-width="1.5"/>
  <text x="${frontBR[0] + 28}" y="${midY + 5}" text-anchor="start" font-size="14" font-weight="bold" fill="#333">${perpendicularLabel}</text>
  <text x="${midX}" y="${frontTL[1] - 12}" text-anchor="middle" font-size="12" fill="#555">${kind}</text>
  ${
    caption
      ? `<text x="${totalW / 2}" y="${totalH - 12}" text-anchor="middle" font-size="12" fill="#444">${caption}</text>`
      : ''
  }
</svg>`.trim()
}

export interface PrismVolumeSvgProps {
  /** Label for the base area G, e.g. "24 cm²". */
  baseAreaLabel: string
  /** Label for the prism height h, e.g. "8 cm". */
  heightLabel: string
  fill?: string
  stroke?: string
}

/** Simple triangular prism (isometric) with Grundfläche G and Höhe h labeled. */
export function generatePrismVolumeSvg({
  baseAreaLabel,
  heightLabel,
  fill = '#e8eaf6',
  stroke = '#3949ab',
}: PrismVolumeSvgProps): string {
  const w = 320
  const h = 240
  // Front triangle
  const f1 = [60, 180]
  const f2 = [200, 180]
  const f3 = [130, 90]
  // Back triangle (offset)
  const dx = 70
  const dy = -45
  const b1 = [f1[0] + dx, f1[1] + dy]
  const b2 = [f2[0] + dx, f2[1] + dy]
  const b3 = [f3[0] + dx, f3[1] + dy]
  return `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <polygon points="${b1[0]},${b1[1]} ${b2[0]},${b2[1]} ${b3[0]},${b3[1]}" fill="${fill}" stroke="${stroke}" stroke-width="2" opacity="0.7"/>
  <polygon points="${f1[0]},${f1[1]} ${f2[0]},${f2[1]} ${b2[0]},${b2[1]} ${b1[0]},${b1[1]}" fill="${fill}" stroke="${stroke}" stroke-width="2" opacity="0.85"/>
  <polygon points="${f2[0]},${f2[1]} ${f3[0]},${f3[1]} ${b3[0]},${b3[1]} ${b2[0]},${b2[1]}" fill="${fill}" stroke="${stroke}" stroke-width="2" opacity="0.9"/>
  <polygon points="${f1[0]},${f1[1]} ${f2[0]},${f2[1]} ${f3[0]},${f3[1]}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
  <text x="130" y="205" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">G = ${baseAreaLabel}</text>
  <text x="250" y="120" font-size="14" font-weight="bold" fill="#333">h = ${heightLabel}</text>
  <line x1="210" y1="175" x2="255" y2="145" stroke="${stroke}" stroke-width="1" stroke-dasharray="3"/>
</svg>`.trim()
}

export interface AngleSvgProps {
  /** Angle value in degrees */
  angle: number
  /** Optional angle label (e.g., "α", "β", "45°") */
  label?: string
  /** Show the angle arc */
  showArc?: boolean
  /** Optional fill color for arc */
  fill?: string
  /** Optional stroke color */
  stroke?: string
  /**
   * Direction of the first ray in degrees (0 = east, counter-clockwise).
   * Rotates the figure so identical angles look different.
   */
  startAngle?: number
}

/**
 * Generate an SVG string for an angle visualization.
 * Two rays with an interior arc; 90° uses the German Viertelkreis-mit-Punkt.
 */
export function generateAngleSvg({
  angle,
  label,
  showArc = true,
  fill = '#fff3e0',
  stroke = '#f57c00',
  startAngle = 0,
}: AngleSvgProps): string {
  const padding = 40
  const rayLength = 160
  const totalSize = rayLength + 2 * padding

  const cx = totalSize / 2
  const cy = totalSize / 2

  const startRad = (startAngle * Math.PI) / 180
  const angleRad = (angle * Math.PI) / 180
  const endRad = startRad + angleRad

  const ray1End = [
    cx + rayLength * Math.cos(startRad),
    cy - rayLength * Math.sin(startRad),
  ]
  const ray2End = [
    cx + rayLength * Math.cos(endRad),
    cy - rayLength * Math.sin(endRad),
  ]

  const u: [number, number] = [Math.cos(startRad), -Math.sin(startRad)]
  const v: [number, number] = [Math.cos(endRad), -Math.sin(endRad)]
  const midRad = startRad + angleRad / 2
  const interior: [number, number] = [
    cx + Math.cos(midRad) * 40,
    cy - Math.sin(midRad) * 40,
  ]

  const markSvg = showArc
    ? angleMarkSvg([cx, cy], u, v, '', {
        radius: Math.abs(angle - 90) < 0.5 ? 36 : 60,
        stroke,
        fill,
        interior,
      })
    : ''

  const labelX = cx + Math.cos(midRad) * 78
  const labelY = cy - Math.sin(midRad) * 78

  return `
<svg width="${totalSize}" height="${totalSize}" xmlns="http://www.w3.org/2000/svg">
  <line x1="${cx}" y1="${cy}" x2="${ray1End[0]}" y2="${ray1End[1]}" stroke="${stroke}" stroke-width="3"/>
  <line x1="${cx}" y1="${cy}" x2="${ray2End[0]}" y2="${ray2End[1]}" stroke="${stroke}" stroke-width="3"/>
  ${markSvg}
  <circle cx="${cx}" cy="${cy}" r="4" fill="${stroke}"/>
  ${
    label
      ? `<text x="${labelX}" y="${labelY}" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">${label}</text>`
      : ''
  }
</svg>`.trim()
}

export interface FractionCircleSvgProps {
  /** Numerator (Zähler) */
  numerator: number
  /** Denominator (Nenner) */
  denominator: number
  /** Show fraction label (default false — too easy for "read the fraction" tasks) */
  showLabel?: boolean
  /** Optional fill color for filled parts */
  fillColor?: string
  /** Optional fill color for empty parts */
  emptyColor?: string
  /** Optional stroke color */
  stroke?: string
}

/**
 * Generate SVG for a fraction shown as a pie chart / circle.
 * Filled slices represent the numerator, empty slices the rest.
 */
export function generateFractionCircleSvg({
  numerator,
  denominator,
  showLabel = false,
  fillColor = '#3498db',
  emptyColor = '#ecf0f1',
  stroke = '#2c3e50',
}: FractionCircleSvgProps): string {
  const size = 200
  const cx = size / 2
  const cy = size / 2
  const radius = 70

  const slices: string[] = []
  const anglePerSlice = (2 * Math.PI) / denominator

  for (let i = 0; i < denominator; i++) {
    const startAngle = i * anglePerSlice - Math.PI / 2
    const endAngle = (i + 1) * anglePerSlice - Math.PI / 2

    const x1 = cx + radius * Math.cos(startAngle)
    const y1 = cy + radius * Math.sin(startAngle)
    const x2 = cx + radius * Math.cos(endAngle)
    const y2 = cy + radius * Math.sin(endAngle)

    const largeArc = anglePerSlice > Math.PI ? 1 : 0
    const fill = i < numerator ? fillColor : emptyColor

    slices.push(`
    <path
      d="M ${cx},${cy} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z"
      fill="${fill}"
      stroke="${stroke}"
      stroke-width="2"
    />`)
  }

  const label = showLabel
    ? `
  <text
    x="${cx}"
    y="${cy + 8}"
    text-anchor="middle"
    font-size="24"
    font-weight="bold"
    fill="#333"
  >
    ${numerator}/${denominator}
  </text>`
    : ''

  return `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Fraction Circle (Pie Chart) -->
  ${slices.join('\n  ')}
  ${label}
</svg>`.trim()
}

export interface FractionBarSvgProps {
  /** Numerator (Zähler) */
  numerator: number
  /** Denominator (Nenner) */
  denominator: number
  /** Show fraction label (default false) */
  showLabel?: boolean
  /** Optional fill color for filled parts */
  fillColor?: string
  /** Optional fill color for empty parts */
  emptyColor?: string
  /** Optional stroke color */
  stroke?: string
}

/**
 * Generate SVG for a fraction shown as a horizontal bar.
 * Filled sections represent the numerator.
 */
export function generateFractionBarSvg({
  numerator,
  denominator,
  showLabel = false,
  fillColor = '#2ecc71',
  emptyColor = '#ecf0f1',
  stroke = '#27ae60',
}: FractionBarSvgProps): string {
  const totalWidth = 300
  const padding = 20
  const barHeight = 40
  const height = showLabel ? 80 : padding + barHeight + padding
  const barWidth = totalWidth - 2 * padding
  const sectionWidth = barWidth / denominator

  const sections: string[] = []
  for (let i = 0; i < denominator; i++) {
    const x = padding + i * sectionWidth
    const fill = i < numerator ? fillColor : emptyColor
    sections.push(`
    <rect
      x="${x}"
      y="${padding}"
      width="${sectionWidth}"
      height="${barHeight}"
      fill="${fill}"
      stroke="${stroke}"
      stroke-width="2"
    />`)
  }

  const label = showLabel
    ? `
  <text
    x="${totalWidth / 2}"
    y="${padding + barHeight + 22}"
    text-anchor="middle"
    font-size="18"
    font-weight="bold"
    fill="#333"
  >
    ${numerator}/${denominator}
  </text>`
    : ''

  return `
<svg width="${totalWidth}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Fraction Bar -->
  ${sections.join('\n  ')}
  ${label}
</svg>`.trim()
}

export interface FractionGridSvgProps {
  /** Numerator (Zähler) — number of filled cells */
  numerator: number
  /** Denominator (Nenner) — total number of cells */
  denominator: number
  /** Number of columns (default: auto, roughly square) */
  cols?: number
  /** Show fraction label (default false) */
  showLabel?: boolean
  /** Optional fill color for filled cells */
  fillColor?: string
  /** Optional fill color for empty cells */
  emptyColor?: string
  /** Optional stroke color */
  stroke?: string
}

/**
 * Generate SVG for a fraction shown as a rectangle divided into equal cells.
 * Filled cells represent the numerator.
 */
export function generateFractionGridSvg({
  numerator,
  denominator,
  cols,
  showLabel = false,
  fillColor = '#e74c3c',
  emptyColor = '#ecf0f1',
  stroke = '#c0392b',
}: FractionGridSvgProps): string {
  const columns = cols ?? Math.ceil(Math.sqrt(denominator))
  const rows = Math.ceil(denominator / columns)
  const cellSize = 40
  const gap = 2
  const padding = 16
  const gridW = columns * cellSize + (columns - 1) * gap
  const gridH = rows * cellSize + (rows - 1) * gap
  const totalW = gridW + 2 * padding
  const totalH = gridH + 2 * padding + (showLabel ? 28 : 0)

  const cells: string[] = []
  for (let i = 0; i < denominator; i++) {
    const col = i % columns
    const row = Math.floor(i / columns)
    const x = padding + col * (cellSize + gap)
    const y = padding + row * (cellSize + gap)
    const fill = i < numerator ? fillColor : emptyColor
    cells.push(`
    <rect
      x="${x}"
      y="${y}"
      width="${cellSize}"
      height="${cellSize}"
      fill="${fill}"
      stroke="${stroke}"
      stroke-width="2"
      rx="2"
    />`)
  }

  const label = showLabel
    ? `
  <text
    x="${totalW / 2}"
    y="${padding + gridH + 22}"
    text-anchor="middle"
    font-size="18"
    font-weight="bold"
    fill="#333"
  >
    ${numerator}/${denominator}
  </text>`
    : ''

  return `
<svg width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg">
  <!-- Fraction Grid -->
  ${cells.join('\n  ')}
  ${label}
</svg>`.trim()
}

export interface LShapeSvgProps {
  /**
   * Outer bottom edge length (full width of L).
   * Geometry: cutout is top-right, so L looks like:
   *   +----+
   *   |    |
   *   |    +----+
   *   |         |
   *   +---------+
   */
  outerWidth: number
  /** Outer left edge length (full height of L) */
  outerHeight: number
  /** Width of the top-right cutout */
  cutWidth: number
  /** Height of the top-right cutout */
  cutHeight: number
  /** Labels for outer edges (omit or empty to hide) */
  bottomLabel?: string
  leftLabel?: string
  topLabel?: string
  rightLabel?: string
  /** Optional inner-corner labels (cut edges) */
  innerHorizontalLabel?: string
  innerVerticalLabel?: string
  fill?: string
  stroke?: string
}

/**
 * Generate SVG for a labeled L-shape (rectangle with top-right cutout).
 * Dimensions are used for proportions; labels are display strings (e.g. "8 m").
 */
export function generateLShapeSvg({
  outerWidth,
  outerHeight,
  cutWidth,
  cutHeight,
  bottomLabel,
  leftLabel,
  topLabel,
  rightLabel,
  innerHorizontalLabel,
  innerVerticalLabel,
  fill = '#e8f5e9',
  stroke = '#2e7d32',
}: LShapeSvgProps): string {
  const padL = 55
  const padR = 70
  const padT = 40
  const padB = 50
  const maxDrawW = 220
  const maxDrawH = 180
  const scale = Math.min(maxDrawW / outerWidth, maxDrawH / outerHeight)
  const W = outerWidth * scale
  const H = outerHeight * scale
  const cW = cutWidth * scale
  const cH = cutHeight * scale

  const x0 = padL
  const y0 = padT
  // Polygon points (clockwise from top-left)
  // TL -> top of stem TR -> inner corner top -> inner corner -> BR -> BL
  const points = [
    [x0, y0],
    [x0 + W - cW, y0],
    [x0 + W - cW, y0 + cH],
    [x0 + W, y0 + cH],
    [x0 + W, y0 + H],
    [x0, y0 + H],
  ]
    .map(([x, y]) => `${x},${y}`)
    .join(' ')

  const totalW = padL + W + padR
  const totalH = padT + H + padB

  const label = (x: number, y: number, text: string | undefined, anchor = 'middle') =>
    text
      ? `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="14" font-weight="bold" fill="#333">${text}</text>`
      : ''

  return `
<svg width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg">
  <polygon
    points="${points}"
    fill="${fill}"
    stroke="${stroke}"
    stroke-width="2"
  />
  ${label(x0 + W / 2, y0 + H + 28, bottomLabel)}
  ${label(x0 - 18, y0 + H / 2 + 5, leftLabel, 'end')}
  ${label(x0 + (W - cW) / 2, y0 - 12, topLabel)}
  ${label(x0 + W + 18, y0 + cH + (H - cH) / 2 + 5, rightLabel, 'start')}
  ${label(x0 + W - cW / 2, y0 + cH - 8, innerHorizontalLabel)}
  ${label(x0 + W - cW - 10, y0 + cH / 2 + 5, innerVerticalLabel, 'end')}
</svg>`.trim()
}

export interface UShapeSvgProps {
  /** Outer width */
  outerWidth: number
  /** Outer height */
  outerHeight: number
  /** Width of the inner notch (opening) */
  notchWidth: number
  /** Height of the inner notch from the top */
  notchHeight: number
  bottomLabel?: string
  leftLabel?: string
  rightLabel?: string
  topLeftLabel?: string
  topRightLabel?: string
  fill?: string
  stroke?: string
}

/**
 * Generate SVG for a U-shape (rectangle with a top-center notch).
 */
export function generateUShapeSvg({
  outerWidth,
  outerHeight,
  notchWidth,
  notchHeight,
  bottomLabel,
  leftLabel,
  rightLabel,
  topLeftLabel,
  topRightLabel,
  fill = '#e3f2fd',
  stroke = '#1565c0',
}: UShapeSvgProps): string {
  const padL = 55
  const padR = 70
  const padT = 40
  const padB = 50
  const maxDrawW = 240
  const maxDrawH = 160
  const scale = Math.min(maxDrawW / outerWidth, maxDrawH / outerHeight)
  const W = outerWidth * scale
  const H = outerHeight * scale
  const nW = notchWidth * scale
  const nH = notchHeight * scale
  const side = (W - nW) / 2

  const x0 = padL
  const y0 = padT
  const points = [
    [x0, y0],
    [x0 + side, y0],
    [x0 + side, y0 + nH],
    [x0 + side + nW, y0 + nH],
    [x0 + side + nW, y0],
    [x0 + W, y0],
    [x0 + W, y0 + H],
    [x0, y0 + H],
  ]
    .map(([x, y]) => `${x},${y}`)
    .join(' ')

  const totalW = padL + W + padR
  const totalH = padT + H + padB

  const label = (x: number, y: number, text: string | undefined, anchor = 'middle') =>
    text
      ? `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="14" font-weight="bold" fill="#333">${text}</text>`
      : ''

  return `
<svg width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg">
  <polygon
    points="${points}"
    fill="${fill}"
    stroke="${stroke}"
    stroke-width="2"
  />
  ${label(x0 + W / 2, y0 + H + 28, bottomLabel)}
  ${label(x0 - 18, y0 + H / 2 + 5, leftLabel, 'end')}
  ${label(x0 + W + 18, y0 + H / 2 + 5, rightLabel, 'start')}
  ${label(x0 + side / 2, y0 - 12, topLeftLabel)}
  ${label(x0 + side + nW + side / 2, y0 - 12, topRightLabel)}
</svg>`.trim()
}

export interface CompositeCuboidSvgProps {
  /**
   * L-shaped solid (constant height): outer base length × width with a
   * rectangular cutout from the far-right corner of the base, extruded by height.
   * Numeric values control proportions; labels are display strings.
   */
  length: number
  width: number
  height: number
  cutLength: number
  cutWidth: number
  lengthLabel?: string
  widthLabel?: string
  heightLabel?: string
  cutLengthLabel?: string
  cutWidthLabel?: string
  fill?: string
  stroke?: string
}

/**
 * Generate an isometric SVG of an L-shaped composite cuboid (two joined cuboids).
 */
export function generateCompositeCuboidSvg({
  length,
  width,
  height,
  cutLength,
  cutWidth,
  lengthLabel,
  widthLabel,
  heightLabel,
  cutLengthLabel,
  cutWidthLabel,
  fill = '#e3f2fd',
  stroke = '#1565c0',
}: CompositeCuboidSvgProps): string {
  const pad = 50
  const scale = Math.min(140 / length, 90 / width, 80 / height)
  const L = length * scale
  const W = width * scale
  const H = height * scale
  const cL = cutLength * scale
  const cW = cutWidth * scale

  // Isometric offsets (same style as generateCuboidSvg)
  const dx = W * 0.55
  const dy = W * 0.45

  const x0 = pad + 20
  const y0 = pad + dy + 10

  // Helper: isometric point from (x along length, y along width, z up)
  const iso = (x: number, y: number, z: number): [number, number] => [
    x0 + x + y * 0.55,
    y0 + H - z - y * 0.45,
  ]

  const poly = (...pts: Array<[number, number]>) =>
    pts.map(([x, y]) => `${x},${y}`).join(' ')

  // Key corners of the L solid
  // Base L (z=0) and top L (z=H)
  // Stem occupies x in [0, L-cL], full width [0,W]
  // Foot occupies x in [L-cL, L], width [0, W-cW]

  const stemTop = L - cL

  // Visible faces (approx.):
  // 1) Front foot face (y=0, x from 0 to L)
  // 2) Front stem-right step
  // 3) Top L face
  // 4) Right faces

  const f = (x: number, y: number, z: number) => iso(x, y, z)

  // Front vertical face of full length at y=0 (only up to foot height region — full front)
  // Actually at y=0 the solid spans full length L and full height H
  const frontFace = poly(f(0, 0, 0), f(L, 0, 0), f(L, 0, H), f(0, 0, H))

  // Top face of L (z=H)
  const topFace = poly(
    f(0, 0, H),
    f(L, 0, H),
    f(L, W - cW, H),
    f(stemTop, W - cW, H),
    f(stemTop, W, H),
    f(0, W, H),
  )

  // Right face of foot (x=L, y from 0 to W-cW)
  const rightFoot = poly(f(L, 0, 0), f(L, W - cW, 0), f(L, W - cW, H), f(L, 0, H))

  // Inner vertical step (x=stemTop, y from W-cW to W)
  const stepFace = poly(
    f(stemTop, W - cW, 0),
    f(stemTop, W, 0),
    f(stemTop, W, H),
    f(stemTop, W - cW, H),
  )

  // Back-left top edge region face (y=W, x from 0 to stemTop)
  const backStem = poly(f(0, W, 0), f(stemTop, W, 0), f(stemTop, W, H), f(0, W, H))

  const totalW = pad * 2 + L + dx + 80
  const totalH = pad * 2 + H + dy + 60

  const label = (x: number, y: number, text: string | undefined, anchor = 'middle') =>
    text
      ? `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="13" font-weight="bold" fill="#333">${text}</text>`
      : ''

  const mid = (p: [number, number], q: [number, number]): [number, number] => [
    (p[0] + q[0]) / 2,
    (p[1] + q[1]) / 2,
  ]

  const bottomMid = mid(f(0, 0, 0), f(L, 0, 0))
  const heightMid = mid(f(0, 0, 0), f(0, 0, H))
  const widthMid = mid(f(L, 0, 0), f(L, W - cW, 0))
  const cutLenMid = mid(f(stemTop, W - cW, H), f(L, W - cW, H))
  const cutWidMid = mid(f(stemTop, W - cW, H), f(stemTop, W, H))

  return `
<svg width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg">
  <!-- L-shaped composite cuboid (isometric) -->
  <polygon points="${backStem}" fill="${fill}" stroke="${stroke}" stroke-width="2" opacity="0.75" />
  <polygon points="${stepFace}" fill="${fill}" stroke="${stroke}" stroke-width="2" opacity="0.85" />
  <polygon points="${rightFoot}" fill="${fill}" stroke="${stroke}" stroke-width="2" opacity="0.9" />
  <polygon points="${frontFace}" fill="${fill}" stroke="${stroke}" stroke-width="2" />
  <polygon points="${topFace}" fill="${fill}" stroke="${stroke}" stroke-width="2" opacity="0.95" />
  ${label(bottomMid[0], bottomMid[1] + 22, lengthLabel)}
  ${label(heightMid[0] - 18, heightMid[1] + 4, heightLabel, 'end')}
  ${label(widthMid[0] + 22, widthMid[1] + 4, widthLabel, 'start')}
  ${label(cutLenMid[0], cutLenMid[1] - 8, cutLengthLabel)}
  ${label(cutWidMid[0] - 10, cutWidMid[1] + 4, cutWidthLabel, 'end')}
</svg>`.trim()
}

// ---------------------------------------------------------------------------
// Coordinate grid & translation (Verschiebung)
// ---------------------------------------------------------------------------

export interface GridLabeledPoint {
  x: number
  y: number
  label?: string
}

export interface GridPolygon {
  points: Array<[number, number]>
  fill?: string
  stroke?: string
  opacity?: number
  label?: string
}

export interface CoordinateGridSvgProps {
  /** Inclusive x range (default [-1, 8]) */
  xRange?: [number, number]
  /** Inclusive y range (default [-1, 8]) */
  yRange?: [number, number]
  /** Optional labeled points in grid coordinates */
  points?: GridLabeledPoint[]
  /** Optional filled polygons in grid coordinates */
  polygons?: GridPolygon[]
  /** Pixels per grid unit (default 36) */
  cellSize?: number
}

function gridBounds(xRange: [number, number], yRange: [number, number]) {
  const xMin = Math.min(xRange[0], xRange[1])
  const xMax = Math.max(xRange[0], xRange[1])
  const yMin = Math.min(yRange[0], yRange[1])
  const yMax = Math.max(yRange[0], yRange[1])
  return { xMin, xMax, yMin, yMax }
}

/**
 * Square coordinate grid (graph paper) with math convention: positive y upward.
 * Axes, unit ticks, optional points and polygons. Labels get enough padding.
 */
export function generateCoordinateGridSvg({
  xRange = [-1, 8],
  yRange = [-1, 8],
  points = [],
  polygons = [],
  cellSize = 36,
}: CoordinateGridSvgProps): string {
  const { xMin, xMax, yMin, yMax } = gridBounds(xRange, yRange)
  const padL = 36
  const padR = 44
  const padT = 28
  const padB = 36
  const gridW = (xMax - xMin) * cellSize
  const gridH = (yMax - yMin) * cellSize
  const totalW = padL + gridW + padR
  const totalH = padT + gridH + padB

  const toSvg = (mx: number, my: number): [number, number] => [
    padL + (mx - xMin) * cellSize,
    padT + (yMax - my) * cellSize,
  ]

  const [ox, oy] = toSvg(0, 0)

  const gridLines: string[] = []
  for (let x = xMin; x <= xMax; x++) {
    const [sx] = toSvg(x, 0)
    const isAxis = x === 0
    gridLines.push(
      `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + gridH}" stroke="${
        isAxis ? '#555' : '#c8c8c8'
      }" stroke-width="${isAxis ? 2 : 1}" />`,
    )
  }
  for (let y = yMin; y <= yMax; y++) {
    const [, sy] = toSvg(0, y)
    const isAxis = y === 0
    gridLines.push(
      `<line x1="${padL}" y1="${sy}" x2="${padL + gridW}" y2="${sy}" stroke="${
        isAxis ? '#555' : '#c8c8c8'
      }" stroke-width="${isAxis ? 2 : 1}" />`,
    )
  }

  const tickLabels: string[] = []
  for (let x = xMin; x <= xMax; x++) {
    if (x === 0) continue
    const [sx] = toSvg(x, 0)
    tickLabels.push(
      `<text x="${sx}" y="${oy + 16}" text-anchor="middle" font-size="11" fill="#444">${x}</text>`,
    )
  }
  for (let y = yMin; y <= yMax; y++) {
    if (y === 0) continue
    const [, sy] = toSvg(0, y)
    tickLabels.push(
      `<text x="${ox - 10}" y="${sy + 4}" text-anchor="end" font-size="11" fill="#444">${y}</text>`,
    )
  }
  // Origin label
  if (xMin <= 0 && xMax >= 0 && yMin <= 0 && yMax >= 0) {
    tickLabels.push(
      `<text x="${ox - 8}" y="${oy + 14}" text-anchor="end" font-size="11" fill="#444">0</text>`,
    )
  }

  const polySvg = polygons
    .map((poly) => {
      const pts = poly.points.map(([x, y]) => toSvg(x, y).join(',')).join(' ')
      const fill = poly.fill ?? '#90caf9'
      const stroke = poly.stroke ?? '#1565c0'
      const opacity = poly.opacity ?? 0.45
      const labelSvg =
        poly.label && poly.points.length > 0
          ? (() => {
              const cx = poly.points.reduce((s, p) => s + p[0], 0) / poly.points.length
              const cy = poly.points.reduce((s, p) => s + p[1], 0) / poly.points.length
              const [lx, ly] = toSvg(cx, cy)
              return `<text x="${lx}" y="${ly + 4}" text-anchor="middle" font-size="13" font-weight="bold" fill="#333">${poly.label}</text>`
            })()
          : ''
      return `<polygon points="${pts}" fill="${fill}" fill-opacity="${opacity}" stroke="${stroke}" stroke-width="2" />${labelSvg}`
    })
    .join('\n  ')

  const pointSvg = points
    .map((p) => {
      const [sx, sy] = toSvg(p.x, p.y)
      // Place labels inward from grid edges so they are not clipped
      let lx = sx + 8
      let ly = sy - 8
      let anchor = 'start'
      if (p.x >= xMax - 0.5) {
        lx = sx - 8
        anchor = 'end'
      } else if (p.x <= xMin + 0.5) {
        lx = sx + 8
        anchor = 'start'
      }
      if (p.y >= yMax - 0.5) {
        ly = sy + 16
      } else if (p.y <= yMin + 0.5) {
        ly = sy - 8
      }
      const lab = p.label
        ? `<text x="${lx}" y="${ly}" text-anchor="${anchor}" font-size="13" font-weight="bold" fill="#333">${p.label}</text>`
        : ''
      return `<circle cx="${sx}" cy="${sy}" r="4.5" fill="#333" />${lab}`
    })
    .join('\n  ')

  // Axis arrow tips (beyond last grid line slightly clipped into pad)
  const xArrowEnd = padL + gridW + 10
  const yArrowEnd = padT - 10

  return `
<svg width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="gridArrowX" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <polygon points="0,0 8,4 0,8" fill="#555" />
    </marker>
    <marker id="gridArrowY" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <polygon points="0,0 8,4 0,8" fill="#555" />
    </marker>
  </defs>
  <rect x="0" y="0" width="${totalW}" height="${totalH}" fill="#fafafa" />
  ${gridLines.join('\n  ')}
  <!-- x-axis arrow -->
  <line x1="${padL}" y1="${oy}" x2="${xArrowEnd}" y2="${oy}" stroke="#555" stroke-width="2" marker-end="url(#gridArrowX)" />
  <!-- y-axis arrow -->
  <line x1="${ox}" y1="${padT + gridH}" x2="${ox}" y2="${yArrowEnd}" stroke="#555" stroke-width="2" marker-end="url(#gridArrowY)" />
  <text x="${xArrowEnd + 4}" y="${oy + 4}" font-size="14" font-weight="bold" fill="#333">x</text>
  <text x="${ox + 8}" y="${yArrowEnd + 4}" font-size="14" font-weight="bold" fill="#333">y</text>
  ${tickLabels.join('\n  ')}
  ${polySvg}
  ${pointSvg}
</svg>`.trim()
}

export interface PointsOnGridSvgProps {
  /** Labeled points in grid coordinates (e.g. A, B, C) */
  points: Array<{ x: number; y: number; label: string }>
  /** Inclusive x range (default [-5, 8]) */
  xRange?: [number, number]
  /** Inclusive y range (default [-5, 8]) */
  yRange?: [number, number]
  cellSize?: number
  /** Optional connections between point labels, e.g. [['A','B']] */
  connectLabels?: Array<[string, string]>
  stroke?: string
}

/**
 * Convenience wrapper: labeled points on a coordinate grid.
 * Optionally draws segments between named points (distance tasks).
 */
export function generatePointsOnGridSvg({
  points,
  xRange = [-5, 8],
  yRange = [-5, 8],
  cellSize = 36,
  connectLabels = [],
  stroke = '#1565c0',
}: PointsOnGridSvgProps): string {
  const base = generateCoordinateGridSvg({
    xRange,
    yRange,
    points,
    cellSize,
  })

  if (connectLabels.length === 0) return base

  const byLabel = new Map(points.map((p) => [p.label, p]))
  const { xMin, yMax } = gridBounds(xRange, yRange)
  const padL = 36
  const padT = 28
  const toSvg = (mx: number, my: number): [number, number] => [
    padL + (mx - xMin) * cellSize,
    padT + (yMax - my) * cellSize,
  ]

  const lines = connectLabels
    .map(([la, lb]) => {
      const a = byLabel.get(la)
      const b = byLabel.get(lb)
      if (!a || !b) return ''
      const [x1, y1] = toSvg(a.x, a.y)
      const [x2, y2] = toSvg(b.x, b.y)
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="2.5" />`
    })
    .filter(Boolean)
    .join('\n  ')

  return lines ? base.replace('</svg>', `  ${lines}\n</svg>`) : base
}

export interface TranslationSvgProps {
  /** Original polygon vertices in grid coordinates */
  points: Array<[number, number]>
  /** Translation in x (positive = right) */
  dx: number
  /** Translation in y (positive = up) */
  dy: number
  /** Draw arrows from original to translated vertices (default true) */
  showArrows?: boolean
  /** Draw the translated polygon (default true; false when student must find it) */
  showTranslated?: boolean
  /** Inclusive x range */
  xRange?: [number, number]
  /** Inclusive y range */
  yRange?: [number, number]
  /** Label the first vertex as A / A' when useful */
  labelVertices?: boolean
  /** Draw a single clear vector arrow from centroid instead of per-vertex */
  singleVectorArrow?: boolean
}

/**
 * Coordinate grid showing an original polygon, optional translated copy,
 * and translation arrows. Positive y is upward (math convention).
 */
export function generateTranslationSvg({
  points,
  dx,
  dy,
  showArrows = true,
  showTranslated = true,
  xRange,
  yRange,
  labelVertices = true,
  singleVectorArrow = false,
}: TranslationSvgProps): string {
  const translated = points.map(([x, y]): [number, number] => [x + dx, y + dy])

  const allPts = showTranslated ? [...points, ...translated] : [...points]
  const xs = allPts.map((p) => p[0])
  const ys = allPts.map((p) => p[1])
  const autoXMin = Math.min(0, ...xs) - 1
  const autoXMax = Math.max(0, ...xs) + 1
  const autoYMin = Math.min(0, ...ys) - 1
  const autoYMax = Math.max(0, ...ys) + 1

  const xr: [number, number] = xRange ?? [autoXMin, autoXMax]
  const yr: [number, number] = yRange ?? [autoYMin, autoYMax]

  const polygons: GridPolygon[] = [
    {
      points,
      fill: '#90caf9',
      stroke: '#1565c0',
      opacity: 0.5,
      label: showTranslated ? 'F' : undefined,
    },
  ]
  if (showTranslated) {
    polygons.push({
      points: translated,
      fill: '#a5d6a7',
      stroke: '#2e7d32',
      opacity: 0.5,
      label: "F'",
    })
  }

  const labeled: GridLabeledPoint[] = []
  if (labelVertices && points.length > 0) {
    labeled.push({ x: points[0][0], y: points[0][1], label: 'A' })
    if (showTranslated) {
      labeled.push({ x: translated[0][0], y: translated[0][1], label: "A'" })
    }
  }

  // Build base grid, then inject arrows before closing </svg>
  const base = generateCoordinateGridSvg({
    xRange: xr,
    yRange: yr,
    points: labeled,
    polygons,
  })

  if (!showArrows || (dx === 0 && dy === 0)) return base

  const { xMin, yMax } = gridBounds(xr, yr)
  const cellSize = 36
  const padL = 36
  const padT = 28
  const toSvg = (mx: number, my: number): [number, number] => [
    padL + (mx - xMin) * cellSize,
    padT + (yMax - my) * cellSize,
  ]

  const arrowColor = '#c62828'
  let arrows = ''
  if (singleVectorArrow || !showTranslated) {
    const cx = points.reduce((s, p) => s + p[0], 0) / points.length
    const cy = points.reduce((s, p) => s + p[1], 0) / points.length
    const [x1, y1] = toSvg(cx, cy)
    const [x2, y2] = toSvg(cx + dx, cy + dy)
    arrows = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${arrowColor}" stroke-width="2.5" marker-end="url(#transArrow)" />`
  } else {
    arrows = points
      .map((p, i) => {
        const [x1, y1] = toSvg(p[0], p[1])
        const [x2, y2] = toSvg(translated[i][0], translated[i][1])
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${arrowColor}" stroke-width="2" marker-end="url(#transArrow)" opacity="0.85" />`
      })
      .join('\n  ')
  }

  const marker = `
  <defs>
    <marker id="transArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <polygon points="0,0 8,4 0,8" fill="${arrowColor}" />
    </marker>
  </defs>`

  return base.replace('</svg>', `${marker}\n  ${arrows}\n</svg>`)
}

// ---------------------------------------------------------------------------
// Symmetry (Achsen- / Punktsymmetrie)
// ---------------------------------------------------------------------------

export type SymmetryShapeKind =
  | 'square'
  | 'rectangle'
  | 'kite'
  | 'isoscelesTrapezoid'
  | 'equilateralTriangle'
  | 'isoscelesTriangle'
  | 'scaleneTriangle'
  | 'parallelogram'

export interface SymmetryShapeSvgProps {
  shape: SymmetryShapeKind
  /** Draw correct axes of symmetry as green solid lines */
  showAxes?: boolean
  /** Draw a black center/point-of-symmetry marker */
  showPointOfSymmetry?: boolean
  /** Draw one incorrect axis (red dashed) as a distractor */
  showWrongAxis?: boolean
  fill?: string
  stroke?: string
}

/** Number of reflection axes for a given shape kind. */
export function symmetryAxisCount(shape: SymmetryShapeKind): number {
  switch (shape) {
    case 'square':
      return 4
    case 'rectangle':
      return 2
    case 'equilateralTriangle':
      return 3
    case 'kite':
    case 'isoscelesTrapezoid':
    case 'isoscelesTriangle':
      return 1
    case 'scaleneTriangle':
    case 'parallelogram':
      return 0
  }
}

/** German display name for shape kinds used in questions. */
export function symmetryShapeLabel(shape: SymmetryShapeKind): string {
  switch (shape) {
    case 'square':
      return 'Quadrat'
    case 'rectangle':
      return 'Rechteck'
    case 'kite':
      return 'Drachenviereck'
    case 'isoscelesTrapezoid':
      return 'gleichschenkliges Trapez'
    case 'equilateralTriangle':
      return 'gleichseitiges Dreieck'
    case 'isoscelesTriangle':
      return 'gleichschenkliges Dreieck'
    case 'scaleneTriangle':
      return 'ungleichseitiges Dreieck'
    case 'parallelogram':
      return 'Parallelogramm'
  }
}

type Pt = [number, number]

function shapeGeometry(shape: SymmetryShapeKind): {
  vertices: Pt[]
  axes: Array<[Pt, Pt]>
  center: Pt
  wrongAxis: [Pt, Pt]
} {
  // Canvas-ish coordinates; positive y downward in SVG (standalone, not math grid).
  const cx = 160
  const cy = 145
  switch (shape) {
    case 'square': {
      const s = 55
      const vertices: Pt[] = [
        [cx - s, cy - s],
        [cx + s, cy - s],
        [cx + s, cy + s],
        [cx - s, cy + s],
      ]
      return {
        vertices,
        axes: [
          [[cx - s - 12, cy], [cx + s + 12, cy]],
          [[cx, cy - s - 12], [cx, cy + s + 12]],
          [[cx - s - 8, cy - s - 8], [cx + s + 8, cy + s + 8]],
          [[cx - s - 8, cy + s + 8], [cx + s + 8, cy - s - 8]],
        ],
        center: [cx, cy],
        wrongAxis: [[cx - s - 10, cy - s / 2], [cx + s + 10, cy + s / 2]],
      }
    }
    case 'rectangle': {
      const w = 80
      const h = 45
      const vertices: Pt[] = [
        [cx - w, cy - h],
        [cx + w, cy - h],
        [cx + w, cy + h],
        [cx - w, cy + h],
      ]
      return {
        vertices,
        axes: [
          [[cx - w - 12, cy], [cx + w + 12, cy]],
          [[cx, cy - h - 12], [cx, cy + h + 12]],
        ],
        center: [cx, cy],
        wrongAxis: [
          [cx - w - 8, cy - h - 8],
          [cx + w + 8, cy + h + 8],
        ],
      }
    }
    case 'kite': {
      const vertices: Pt[] = [
        [cx, cy - 70],
        [cx + 55, cy],
        [cx, cy + 50],
        [cx - 55, cy],
      ]
      return {
        vertices,
        axes: [[[cx, cy - 82], [cx, cy + 62]]],
        center: [cx, cy],
        wrongAxis: [[cx - 70, cy], [cx + 70, cy]],
      }
    }
    case 'isoscelesTrapezoid': {
      const vertices: Pt[] = [
        [cx - 45, cy - 40],
        [cx + 45, cy - 40],
        [cx + 75, cy + 45],
        [cx - 75, cy + 45],
      ]
      return {
        vertices,
        axes: [[[cx, cy - 55], [cx, cy + 60]]],
        center: [cx, cy + 2],
        wrongAxis: [[cx - 80, cy], [cx + 80, cy]],
      }
    }
    case 'equilateralTriangle': {
      const r = 72
      const vertices: Pt[] = [0, 1, 2].map((i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3
        return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as Pt
      })
      const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      const axes: Array<[Pt, Pt]> = [
        [vertices[0], mid(vertices[1], vertices[2])],
        [vertices[1], mid(vertices[0], vertices[2])],
        [vertices[2], mid(vertices[0], vertices[1])],
      ].map(([p, q]) => {
        const dx = q[0] - p[0]
        const dy = q[1] - p[1]
        const len = Math.hypot(dx, dy) || 1
        const ux = dx / len
        const uy = dy / len
        return [
          [p[0] - ux * 14, p[1] - uy * 14],
          [q[0] + ux * 14, q[1] + uy * 14],
        ]
      })
      return {
        vertices,
        axes,
        center: [cx, cy],
        wrongAxis: [[cx - 90, cy + 10], [cx + 90, cy + 10]],
      }
    }
    case 'isoscelesTriangle': {
      const vertices: Pt[] = [
        [cx, cy - 70],
        [cx + 70, cy + 55],
        [cx - 70, cy + 55],
      ]
      return {
        vertices,
        axes: [[[cx, cy - 82], [cx, cy + 68]]],
        center: [cx, cy + 10],
        wrongAxis: [[cx - 80, cy], [cx + 80, cy]],
      }
    }
    case 'scaleneTriangle': {
      const vertices: Pt[] = [
        [cx - 60, cy + 50],
        [cx + 80, cy + 40],
        [cx - 10, cy - 65],
      ]
      return {
        vertices,
        axes: [],
        center: [cx, cy],
        wrongAxis: [[cx, cy - 80], [cx, cy + 70]],
      }
    }
    case 'parallelogram': {
      const vertices: Pt[] = [
        [cx - 70, cy + 40],
        [cx + 30, cy + 40],
        [cx + 70, cy - 40],
        [cx - 30, cy - 40],
      ]
      return {
        vertices,
        axes: [],
        center: [cx, cy],
        wrongAxis: [[cx, cy - 70], [cx, cy + 70]],
      }
    }
  }
}

/**
 * Standalone shape for axis-/point-symmetry recognition (worksheet style).
 * Axes (green), optional center point, optional wrong (red dashed) axis.
 */
export function generateSymmetryShapeSvg({
  shape,
  showAxes = false,
  showPointOfSymmetry = false,
  showWrongAxis = false,
  fill = '#90caf9',
  stroke = '#1565c0',
}: SymmetryShapeSvgProps): string {
  const { vertices, axes, center, wrongAxis } = shapeGeometry(shape)
  const pts = vertices.map(([x, y]) => `${x},${y}`).join(' ')
  const axisLines = showAxes
    ? axes
        .map(
          ([[x1, y1], [x2, y2]]) =>
            `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2e7d32" stroke-width="2.5" />`,
        )
        .join('\n  ')
    : ''
  const wrong = showWrongAxis
    ? `<line x1="${wrongAxis[0][0]}" y1="${wrongAxis[0][1]}" x2="${wrongAxis[1][0]}" y2="${wrongAxis[1][1]}" stroke="#c62828" stroke-width="2" stroke-dasharray="8 5" />`
    : ''
  const centerDot = showPointOfSymmetry
    ? `<circle cx="${center[0]}" cy="${center[1]}" r="5" fill="#111" />`
    : ''

  return `
<svg width="320" height="290" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="320" height="290" fill="#fafafa" />
  <polygon points="${pts}" fill="${fill}" fill-opacity="0.5" stroke="${stroke}" stroke-width="2.5" />
  ${wrong}
  ${axisLines}
  ${centerDot}
</svg>`.trim()
}

export type MirrorLineKind =
  | 'x-axis'
  | 'y-axis'
  | 'y=x'
  | { type: 'vertical'; x: number }
  | { type: 'horizontal'; y: number }

export interface ReflectionSvgProps {
  /** Original polygon vertices (math y-up) */
  points: Array<[number, number]>
  /** Mirror line s */
  mirror: MirrorLineKind
  /** Draw the reflected image (default true) */
  showImage?: boolean
  xRange?: [number, number]
  yRange?: [number, number]
  labelVertices?: boolean
  /** Label for the mirror line (default "s") */
  mirrorLabel?: string
}

/** Reflect a point across the given mirror line. */
export function reflectPointAcross(
  point: [number, number],
  mirror: MirrorLineKind,
): [number, number] {
  const [x, y] = point
  if (mirror === 'x-axis') return [x, -y]
  if (mirror === 'y-axis') return [-x, y]
  if (mirror === 'y=x') return [y, x]
  if (mirror.type === 'vertical') return [2 * mirror.x - x, y]
  return [x, 2 * mirror.y - y]
}

function mirrorSegment(
  mirror: MirrorLineKind,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
): { a: [number, number]; b: [number, number]; labelAt: [number, number] } {
  if (mirror === 'x-axis') {
    return { a: [xMin, 0], b: [xMax, 0], labelAt: [xMax - 0.6, 0.55] }
  }
  if (mirror === 'y-axis') {
    return { a: [0, yMin], b: [0, yMax], labelAt: [0.55, yMax - 0.4] }
  }
  if (mirror === 'y=x') {
    const lo = Math.max(xMin, yMin)
    const hi = Math.min(xMax, yMax)
    return { a: [lo, lo], b: [hi, hi], labelAt: [hi - 0.5, hi + 0.55] }
  }
  if (mirror.type === 'vertical') {
    const x = mirror.x
    return { a: [x, yMin], b: [x, yMax], labelAt: [x + 0.45, yMax - 0.4] }
  }
  const y = mirror.y
  return { a: [xMin, y], b: [xMax, y], labelAt: [xMax - 0.6, y + 0.55] }
}

/**
 * Coordinate grid with a figure, mirror line s, and optional reflected image.
 */
export function generateReflectionSvg({
  points,
  mirror,
  showImage = true,
  xRange,
  yRange,
  labelVertices = true,
  mirrorLabel = 's',
}: ReflectionSvgProps): string {
  const reflected = points.map((p) => reflectPointAcross(p, mirror))
  const allPts = showImage ? [...points, ...reflected] : [...points]
  const xs = allPts.map((p) => p[0])
  const ys = allPts.map((p) => p[1])
  const autoXMin = Math.min(0, ...xs) - 1
  const autoXMax = Math.max(0, ...xs) + 1
  const autoYMin = Math.min(0, ...ys) - 1
  const autoYMax = Math.max(0, ...ys) + 1
  const xr: [number, number] = xRange ?? [autoXMin, autoXMax]
  const yr: [number, number] = yRange ?? [autoYMin, autoYMax]
  const { xMin, xMax, yMin, yMax } = gridBounds(xr, yr)

  const polygons: GridPolygon[] = [
    {
      points,
      fill: '#90caf9',
      stroke: '#1565c0',
      opacity: 0.5,
      label: showImage ? 'F' : undefined,
    },
  ]
  if (showImage) {
    polygons.push({
      points: reflected,
      fill: '#a5d6a7',
      stroke: '#2e7d32',
      opacity: 0.5,
      label: "F'",
    })
  }

  const labeled: GridLabeledPoint[] = []
  if (labelVertices && points.length > 0) {
    labeled.push({ x: points[0][0], y: points[0][1], label: 'A' })
    if (showImage) {
      labeled.push({ x: reflected[0][0], y: reflected[0][1], label: "A'" })
    }
  }

  const base = generateCoordinateGridSvg({
    xRange: xr,
    yRange: yr,
    points: labeled,
    polygons,
  })

  const cellSize = 36
  const padL = 36
  const padT = 28
  const toSvg = (mx: number, my: number): [number, number] => [
    padL + (mx - xMin) * cellSize,
    padT + (yMax - my) * cellSize,
  ]

  const seg = mirrorSegment(mirror, xMin, xMax, yMin, yMax)
  const [ax, ay] = toSvg(seg.a[0], seg.a[1])
  const [bx, by] = toSvg(seg.b[0], seg.b[1])
  const [lx, ly] = toSvg(seg.labelAt[0], seg.labelAt[1])
  const mirrorSvg = `
  <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#6a1b9a" stroke-width="2.5" stroke-dasharray="7 4" />
  <text x="${lx}" y="${ly}" font-size="15" font-weight="bold" fill="#6a1b9a">${mirrorLabel}</text>`

  return base.replace('</svg>', `${mirrorSvg}\n</svg>`)
}

export interface PointReflectionSvgProps {
  /** Original polygon vertices */
  points: Array<[number, number]>
  /** Center of point reflection S */
  center: [number, number]
  /** Draw the image after 180° rotation around S (default true) */
  showImage?: boolean
  xRange?: [number, number]
  yRange?: [number, number]
  labelVertices?: boolean
  /** Label for the center (default "S") */
  centerLabel?: string
}

/** Point reflection (180°) of a point across center S. */
export function pointReflectAcross(
  point: [number, number],
  center: [number, number],
): [number, number] {
  return [2 * center[0] - point[0], 2 * center[1] - point[1]]
}

/**
 * Coordinate grid with original figure, center S, and optional point-reflected image.
 */
export function generatePointReflectionSvg({
  points,
  center,
  showImage = true,
  xRange,
  yRange,
  labelVertices = true,
  centerLabel = 'S',
}: PointReflectionSvgProps): string {
  const reflected = points.map((p) => pointReflectAcross(p, center))
  const allPts: Array<[number, number]> = showImage
    ? [...points, ...reflected, center]
    : [...points, center]
  const allX = allPts.map((p) => p[0])
  const allY = allPts.map((p) => p[1])
  const autoXMin = Math.min(0, ...allX) - 1
  const autoXMax = Math.max(0, ...allX) + 1
  const autoYMin = Math.min(0, ...allY) - 1
  const autoYMax = Math.max(0, ...allY) + 1
  const xr: [number, number] = xRange ?? [autoXMin, autoXMax]
  const yr: [number, number] = yRange ?? [autoYMin, autoYMax]

  const polygons: GridPolygon[] = [
    {
      points,
      fill: '#90caf9',
      stroke: '#1565c0',
      opacity: 0.5,
      label: showImage ? 'F' : undefined,
    },
  ]
  if (showImage) {
    polygons.push({
      points: reflected,
      fill: '#ce93d8',
      stroke: '#6a1b9a',
      opacity: 0.5,
      label: "F'",
    })
  }

  const labeled: GridLabeledPoint[] = [
    { x: center[0], y: center[1], label: centerLabel },
  ]
  if (labelVertices && points.length > 0) {
    labeled.push({ x: points[0][0], y: points[0][1], label: 'A' })
    if (showImage) {
      labeled.push({ x: reflected[0][0], y: reflected[0][1], label: "A'" })
    }
  }

  const base = generateCoordinateGridSvg({
    xRange: xr,
    yRange: yr,
    points: labeled,
    polygons,
  })

  // Emphasize S with a slightly larger ring (injected)
  const { xMin, yMax } = gridBounds(xr, yr)
  const cellSize = 36
  const padL = 36
  const padT = 28
  const [sx, sy] = [
    padL + (center[0] - xMin) * cellSize,
    padT + (yMax - center[1]) * cellSize,
  ]
  const ring = `<circle cx="${sx}" cy="${sy}" r="7" fill="none" stroke="#111" stroke-width="2" />`

  // Optional guide segments A–S–A' when image is shown
  let guides = ''
  if (showImage && points.length > 0) {
    const [ax, ay] = [
      padL + (points[0][0] - xMin) * cellSize,
      padT + (yMax - points[0][1]) * cellSize,
    ]
    const [apx, apy] = [
      padL + (reflected[0][0] - xMin) * cellSize,
      padT + (yMax - reflected[0][1]) * cellSize,
    ]
    guides = `<line x1="${ax}" y1="${ay}" x2="${apx}" y2="${apy}" stroke="#888" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.8" />`
  }

  return base.replace('</svg>', `  ${guides}\n  ${ring}\n</svg>`)
}

// ---------------------------------------------------------------------------
// Strecken (line segments), rays, lines
// ---------------------------------------------------------------------------

export interface StandaloneSegment {
  /** Endpoint A in cm-like units (x right, y up) */
  a: [number, number]
  /** Endpoint B in cm-like units */
  b: [number, number]
  /** Label for first endpoint (default "A") */
  labelA?: string
  /** Label for second endpoint (default "B") */
  labelB?: string
  /** Explicit length text near the segment (e.g. "5 cm"); auto-computed if omitted when showLabel */
  lengthLabel?: string
}

export interface SegmentSvgProps {
  /** One or more segments (e.g. AB and CD) */
  segments: StandaloneSegment[]
  /** Show length labels on/near segments (default true; false when student must measure) */
  showLabel?: boolean
  /** Draw a 1 cm / 1 unit scale bar (default true) */
  showScaleBar?: boolean
  /** Pixels per unit; 1 unit ≈ 1 cm (default 40) */
  unitPx?: number
  stroke?: string
}

/** Euclidean length of a segment in the same units as its endpoints. */
export function segmentLength(a: [number, number], b: [number, number]): number {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Standalone diagram of labeled segments with optional length labels and scale bar.
 * Coordinates use math convention (y up); 1 unit maps to unitPx pixels (≈ 1 cm).
 */
export function generateSegmentSvg({
  segments,
  showLabel = true,
  showScaleBar = true,
  unitPx = 40,
  stroke = '#1565c0',
}: SegmentSvgProps): string {
  if (segments.length === 0) {
    return `<svg width="120" height="80" xmlns="http://www.w3.org/2000/svg"></svg>`
  }

  const allX = segments.flatMap((s) => [s.a[0], s.b[0]])
  const allY = segments.flatMap((s) => [s.a[1], s.b[1]])
  const minX = Math.min(...allX)
  const maxX = Math.max(...allX)
  const minY = Math.min(...allY)
  const maxY = Math.max(...allY)

  const pad = 48
  const scaleBarH = showScaleBar ? 36 : 0
  const contentW = Math.max((maxX - minX) * unitPx, unitPx)
  const contentH = Math.max((maxY - minY) * unitPx, unitPx)
  const totalW = contentW + 2 * pad
  const totalH = contentH + 2 * pad + scaleBarH

  // Math y-up → SVG y-down
  const toSvg = (mx: number, my: number): [number, number] => [
    pad + (mx - minX) * unitPx,
    pad + (maxY - my) * unitPx,
  ]

  const defaultLabels = [
    ['A', 'B'],
    ['C', 'D'],
    ['E', 'F'],
    ['G', 'H'],
  ]

  const body = segments
    .map((seg, i) => {
      const [x1, y1] = toSvg(seg.a[0], seg.a[1])
      const [x2, y2] = toSvg(seg.b[0], seg.b[1])
      const la = seg.labelA ?? defaultLabels[i]?.[0] ?? `P${i * 2}`
      const lb = seg.labelB ?? defaultLabels[i]?.[1] ?? `P${i * 2 + 1}`
      const mx = (x1 + x2) / 2
      const my = (y1 + y2) / 2
      // Offset label perpendicular to segment
      const dx = x2 - x1
      const dy = y2 - y1
      const len = Math.hypot(dx, dy) || 1
      const ox = (-dy / len) * 14
      const oy = (dx / len) * 14
      const lenVal = segmentLength(seg.a, seg.b)
      const lenText =
        seg.lengthLabel ??
        `${Number.isInteger(lenVal) ? String(lenVal) : lenVal.toFixed(1).replace('.', ',')} cm`
      const lengthSvg = showLabel
        ? `<text x="${mx + ox}" y="${my + oy}" text-anchor="middle" font-size="13" font-weight="bold" fill="#333">${lenText}</text>`
        : ''
      // Cross markers at endpoints
      const cross = (cx: number, cy: number) =>
        `<g>
          <line x1="${cx - 5}" y1="${cy}" x2="${cx + 5}" y2="${cy}" stroke="#222" stroke-width="1.5" />
          <line x1="${cx}" y1="${cy - 5}" x2="${cx}" y2="${cy + 5}" stroke="#222" stroke-width="1.5" />
          <circle cx="${cx}" cy="${cy}" r="3" fill="#222" />
        </g>`
      const labelOff = (cx: number, cy: number, otherX: number, otherY: number, text: string) => {
        const awayX = cx - otherX
        const awayY = cy - otherY
        const al = Math.hypot(awayX, awayY) || 1
        const lx = cx + (awayX / al) * 14
        const ly = cy + (awayY / al) * 14 - 2
        return `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">${text}</text>`
      }
      return `
  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="2.5" />
  ${cross(x1, y1)}
  ${cross(x2, y2)}
  ${labelOff(x1, y1, x2, y2, la)}
  ${labelOff(x2, y2, x1, y1, lb)}
  ${lengthSvg}`
    })
    .join('\n')

  const scaleBar = showScaleBar
    ? (() => {
        const bx = pad
        const by = totalH - 18
        return `
  <line x1="${bx}" y1="${by}" x2="${bx + unitPx}" y2="${by}" stroke="#444" stroke-width="2" />
  <line x1="${bx}" y1="${by - 5}" x2="${bx}" y2="${by + 5}" stroke="#444" stroke-width="2" />
  <line x1="${bx + unitPx}" y1="${by - 5}" x2="${bx + unitPx}" y2="${by + 5}" stroke="#444" stroke-width="2" />
  <text x="${bx + unitPx / 2}" y="${by - 8}" text-anchor="middle" font-size="11" fill="#444">1 cm</text>`
      })()
    : ''

  return `
<svg width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="${totalW}" height="${totalH}" fill="#fafafa" />
  ${body}
  ${scaleBar}
</svg>`.trim()
}

export interface GridSegmentDef {
  a: [number, number]
  b: [number, number]
  labelA?: string
  labelB?: string
  /** Length label near midpoint (shown only if showLengthLabels) */
  lengthLabel?: string
}

export interface SegmentsOnGridSvgProps {
  segments: GridSegmentDef[]
  /** Draw segment lines (default true; false = only endpoints) */
  showSegments?: boolean
  /** Show length labels on segments (default false) */
  showLengthLabels?: boolean
  xRange?: [number, number]
  yRange?: [number, number]
  cellSize?: number
  stroke?: string
}

/**
 * One or more segments on a coordinate grid (math y-up).
 * Length in grid units = Euclidean distance.
 */
export function generateSegmentsOnGridSvg({
  segments,
  showSegments = true,
  showLengthLabels = false,
  xRange,
  yRange,
  cellSize = 36,
  stroke = '#1565c0',
}: SegmentsOnGridSvgProps): string {
  const allPts = segments.flatMap((s) => [s.a, s.b])
  const xs = allPts.map((p) => p[0])
  const ys = allPts.map((p) => p[1])
  const autoXMin = Math.min(0, ...xs) - 1
  const autoXMax = Math.max(0, ...xs) + 1
  const autoYMin = Math.min(0, ...ys) - 1
  const autoYMax = Math.max(0, ...ys) + 1
  const xr: [number, number] = xRange ?? [autoXMin, autoXMax]
  const yr: [number, number] = yRange ?? [autoYMin, autoYMax]

  const defaultLabels = [
    ['A', 'B'],
    ['C', 'D'],
    ['E', 'F'],
  ]
  const labeled: GridLabeledPoint[] = []
  for (let i = 0; i < segments.length; i++) {
    const s = segments[i]
    labeled.push({
      x: s.a[0],
      y: s.a[1],
      label: s.labelA ?? defaultLabels[i]?.[0] ?? `P${i * 2}`,
    })
    labeled.push({
      x: s.b[0],
      y: s.b[1],
      label: s.labelB ?? defaultLabels[i]?.[1] ?? `P${i * 2 + 1}`,
    })
  }

  const base = generateCoordinateGridSvg({
    xRange: xr,
    yRange: yr,
    points: labeled,
    cellSize,
  })

  if (!showSegments && !showLengthLabels) return base

  const { xMin, yMax } = gridBounds(xr, yr)
  const padL = 36
  const padT = 28
  const toSvg = (mx: number, my: number): [number, number] => [
    padL + (mx - xMin) * cellSize,
    padT + (yMax - my) * cellSize,
  ]

  const extras = segments
    .map((s) => {
      const [x1, y1] = toSvg(s.a[0], s.a[1])
      const [x2, y2] = toSvg(s.b[0], s.b[1])
      const line = showSegments
        ? `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="2.5" />`
        : ''
      let label = ''
      if (showLengthLabels) {
        const len = segmentLength(s.a, s.b)
        const text =
          s.lengthLabel ??
          (Number.isInteger(len) ? String(len) : len.toFixed(1).replace('.', ','))
        const mx = (x1 + x2) / 2
        const my = (y1 + y2) / 2
        const dx = x2 - x1
        const dy = y2 - y1
        const L = Math.hypot(dx, dy) || 1
        const ox = (-dy / L) * 12
        const oy = (dx / L) * 12
        label = `<text x="${mx + ox}" y="${my + oy}" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">${text}</text>`
      }
      return `${line}\n  ${label}`
    })
    .join('\n  ')

  return base.replace('</svg>', `  ${extras}\n</svg>`)
}

export type LineFigureKind = 'strecke' | 'halbgerade' | 'gerade'

export interface RayOrLineSvgProps {
  /** Strecke (segment), Halbgerade (ray), or Gerade (line) */
  kind: LineFigureKind
  labelA?: string
  labelB?: string
  stroke?: string
}

/**
 * Diagram distinguishing Strecke / Halbgerade / Gerade for identification tasks.
 * - Strecke: solid segment AB with endpoints
 * - Halbgerade: starts at A, through B, arrow beyond B
 * - Gerade: extends both ways through A and B with arrows
 */
export function generateRayOrLineSvg({
  kind,
  labelA = 'A',
  labelB = 'B',
  stroke = '#1565c0',
}: RayOrLineSvgProps): string {
  const W = 320
  const H = 140
  // Place A left, B right on a horizontal figure
  const ay = H / 2
  const ax = 110
  const bx = 210

  // Extension length beyond endpoints for ray/line
  const ext = 55

  const cross = (cx: number, cy: number) =>
    `<g>
      <line x1="${cx - 5}" y1="${cy}" x2="${cx + 5}" y2="${cy}" stroke="#222" stroke-width="1.5" />
      <line x1="${cx}" y1="${cy - 5}" x2="${cx}" y2="${cy + 5}" stroke="#222" stroke-width="1.5" />
      <circle cx="${cx}" cy="${cy}" r="3.5" fill="#222" />
    </g>`

  const markerDefs =
    kind === 'strecke'
      ? ''
      : `
  <defs>
    <marker id="rayArrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
      <polygon points="0,0 9,4.5 0,9" fill="${stroke}" />
    </marker>
  </defs>`

  let lineSvg = ''
  if (kind === 'strecke') {
    lineSvg = `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${ay}" stroke="${stroke}" stroke-width="2.5" />`
  } else if (kind === 'halbgerade') {
    lineSvg = `<line x1="${ax}" y1="${ay}" x2="${bx + ext}" y2="${ay}" stroke="${stroke}" stroke-width="2.5" marker-end="url(#rayArrow)" />`
  } else {
    // Two half-lines with marker-end so both arrows point outward
    const mid = (ax + bx) / 2
    lineSvg = `
  <line x1="${mid}" y1="${ay}" x2="${ax - ext}" y2="${ay}" stroke="${stroke}" stroke-width="2.5" marker-end="url(#rayArrow)" />
  <line x1="${mid}" y1="${ay}" x2="${bx + ext}" y2="${ay}" stroke="${stroke}" stroke-width="2.5" marker-end="url(#rayArrow)" />`
  }

  return `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="${W}" height="${H}" fill="#fafafa" />
  ${markerDefs}
  ${lineSvg}
  ${cross(ax, ay)}
  ${cross(bx, ay)}
  <text x="${ax}" y="${ay - 14}" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">${labelA}</text>
  <text x="${bx}" y="${ay - 14}" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">${labelB}</text>
</svg>`.trim()
}

// ---------------------------------------------------------------------------
// Zuordnungen (Klasse 6 Plan C): Wertetabelle + Graphen 1. Quadrant
// ---------------------------------------------------------------------------

export interface ValueTableCell {
  x: string | number
  /** Use null for the missing cell (shown as „?“). */
  y: string | number | null
}

export interface ValueTableSvgProps {
  cells: ValueTableCell[]
  xLabel?: string
  yLabel?: string
  /** Optional factor arrow, e.g. "· 3" or ": 2" shown beside the table. */
  arrowHint?: string
}

/** Compact 2-row value table (x / y) with optional ·k / :k arrow hint. */
export function generateValueTableSvg({
  cells,
  xLabel = 'x',
  yLabel = 'y',
  arrowHint,
}: ValueTableSvgProps): string {
  const colW = 64
  const rowH = 36
  const labelW = 48
  const pad = 12
  const tableW = labelW + cells.length * colW
  const tableH = 2 * rowH
  const arrowW = arrowHint ? 90 : 0
  const totalW = pad * 2 + tableW + arrowW
  const totalH = pad * 2 + tableH

  const cell = (
    cx: number,
    cy: number,
    w: number,
    h: number,
    text: string,
    bold = false,
  ) => `
  <rect x="${cx}" y="${cy}" width="${w}" height="${h}" fill="#fff" stroke="#455a64" stroke-width="1.5"/>
  <text x="${cx + w / 2}" y="${cy + h / 2 + 5}" text-anchor="middle" font-size="15" font-weight="${
    bold ? 'bold' : 'normal'
  }" fill="#333">${text}</text>`

  const xRow = cells
    .map((c, i) => cell(pad + labelW + i * colW, pad, colW, rowH, String(c.x)))
    .join('')
  const yRow = cells
    .map((c, i) =>
      cell(pad + labelW + i * colW, pad + rowH, colW, rowH, c.y === null ? '?' : String(c.y), c.y === null),
    )
    .join('')

  const arrow =
    arrowHint != null
      ? `
  <defs>
    <marker id="tableArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <polygon points="0,0 8,4 0,8" fill="#1565c0"/>
    </marker>
  </defs>
  <line x1="${pad + tableW + 8}" y1="${pad + rowH}" x2="${pad + tableW + 48}" y2="${pad + rowH}" stroke="#1565c0" stroke-width="2.5" marker-end="url(#tableArrow)"/>
  <text x="${pad + tableW + 54}" y="${pad + rowH + 5}" font-size="14" font-weight="bold" fill="#1565c0">${arrowHint}</text>`
      : ''

  return `
<svg width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="${totalW}" height="${totalH}" fill="#fafafa"/>
  ${cell(pad, pad, labelW, rowH, xLabel, true)}
  ${cell(pad, pad + rowH, labelW, rowH, yLabel, true)}
  ${xRow}
  ${yRow}
  ${arrow}
</svg>`.trim()
}

export interface AssignmentGraphSvgProps {
  /** Discrete points in the first quadrant (positive x,y). */
  points: Array<{ x: number; y: number; label?: string }>
  /** Draw a ray from origin through the first point (proportional). */
  showRay?: boolean
  /** Draw a light hyperbola guide for product ≈ k (antiproportional). */
  productK?: number
  xMax?: number
  yMax?: number
  cellSize?: number
}

/** First-quadrant assignment graph: points, optional origin ray or hyperbola sketch. */
export function generateAssignmentGraphSvg({
  points,
  showRay = false,
  productK,
  xMax,
  yMax,
  cellSize = 32,
}: AssignmentGraphSvgProps): string {
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const maxX = xMax ?? Math.max(6, ...xs) + 1
  const maxY = yMax ?? Math.max(6, ...ys) + 1
  const xRange: [number, number] = [0, maxX]
  const yRange: [number, number] = [0, maxY]

  let base = generateCoordinateGridSvg({
    xRange,
    yRange,
    points: points.map((p, i) => ({
      x: p.x,
      y: p.y,
      label: p.label ?? String.fromCharCode(65 + i),
    })),
    cellSize,
  })

  const { xMin, yMax: yTop } = gridBounds(xRange, yRange)
  const padL = 36
  const padT = 28
  const toSvg = (mx: number, my: number): [number, number] => [
    padL + (mx - xMin) * cellSize,
    padT + (yTop - my) * cellSize,
  ]

  const extras: string[] = []
  if (showRay && points.length > 0) {
    const p = points[0]
    const t = Math.min(maxX / p.x, maxY / p.y)
    const [x1, y1] = toSvg(0, 0)
    const [x2, y2] = toSvg(p.x * t, p.y * t)
    extras.push(
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#1565c0" stroke-width="2" stroke-dasharray="5 4" opacity="0.85"/>`,
    )
  }
  if (productK != null && productK > 0) {
    const curvePts: string[] = []
    for (let i = 0; i <= 24; i++) {
      const x = 0.4 + (i / 24) * (maxX - 0.4)
      const y = productK / x
      if (y < 0.3 || y > maxY) continue
      const [sx, sy] = toSvg(x, y)
      curvePts.push(`${sx},${sy}`)
    }
    if (curvePts.length >= 2) {
      extras.push(
        `<polyline points="${curvePts.join(' ')}" fill="none" stroke="#c62828" stroke-width="2" stroke-dasharray="5 4" opacity="0.8"/>`,
      )
    }
  }

  if (extras.length === 0) return base
  return base.replace('</svg>', `  ${extras.join('\n  ')}\n</svg>`)
}

// ---------------------------------------------------------------------------
// Klasse 7: Winkel an Geraden / Parallelen + Pyramide
// ---------------------------------------------------------------------------

export interface CrossingLinesSvgProps {
  /** One angle at the intersection (degrees, 20–160). */
  angleDeg: number
  /** Which related angle is asked (?). */
  ask: 'neben' | 'scheitel'
  givenLabel?: string
  askLabel?: string
  stroke?: string
}

/**
 * Two intersecting lines with a given angle and either the adjacent
 * (Nebenwinkel) or opposite (Scheitelwinkel) marked with „?“.
 * Always draws proper angle arcs.
 */
export function generateCrossingLinesSvg({
  angleDeg,
  ask,
  givenLabel,
  askLabel = '?',
  stroke = '#1565c0',
}: CrossingLinesSvgProps): string {
  const w = 320
  const h = 280
  const cx = w / 2
  const cy = h / 2
  const len = 130
  const a = (angleDeg * Math.PI) / 180
  // Line 1: horizontal. Line 2: at angleDeg from +x
  const h1 = [cx - len, cy]
  const h2 = [cx + len, cy]
  const d1 = [cx - len * Math.cos(a), cy + len * Math.sin(a)]
  const d2 = [cx + len * Math.cos(a), cy - len * Math.sin(a)]

  const given = givenLabel ?? `${angleDeg}°`
  // Given angle: between +x and the upper direction of line 2 (screen: -sin)
  const uGiven: [number, number] = [1, 0]
  const vGiven: [number, number] = [Math.cos(a), -Math.sin(a)]
  const givenInterior: [number, number] = [
    cx + Math.cos(a / 2) * 40,
    cy - Math.sin(a / 2) * 40,
  ]
  const givenMark = angleMarkSvg([cx, cy], uGiven, vGiven, given, {
    radius: 34,
    stroke: '#e65100',
    fill: '#fff3e0',
    interior: givenInterior,
  })

  let askMark = ''
  if (ask === 'neben') {
    // Adjacent on the straight line: from line2 to -x
    const uAsk: [number, number] = [Math.cos(a), -Math.sin(a)]
    const vAsk: [number, number] = [-1, 0]
    const nebenDeg = Math.PI - a
    const askInterior: [number, number] = [
      cx + Math.cos(a + nebenDeg / 2) * 40,
      cy - Math.sin(a + nebenDeg / 2) * 40,
    ]
    askMark = angleMarkSvg([cx, cy], uAsk, vAsk, askLabel, {
      radius: 42,
      stroke: '#2e7d32',
      fill: '#e8f5e9',
      interior: askInterior,
    })
  } else {
    // Scheitel: opposite = between -x and opposite ray of line2
    const uAsk: [number, number] = [-1, 0]
    const vAsk: [number, number] = [-Math.cos(a), Math.sin(a)]
    const askInterior: [number, number] = [
      cx - Math.cos(a / 2) * 40,
      cy + Math.sin(a / 2) * 40,
    ]
    askMark = angleMarkSvg([cx, cy], uAsk, vAsk, askLabel, {
      radius: 42,
      stroke: '#2e7d32',
      fill: '#e8f5e9',
      interior: askInterior,
    })
  }

  return `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <line x1="${h1[0]}" y1="${h1[1]}" x2="${h2[0]}" y2="${h2[1]}" stroke="${stroke}" stroke-width="2.5"/>
  <line x1="${d1[0]}" y1="${d1[1]}" x2="${d2[0]}" y2="${d2[1]}" stroke="${stroke}" stroke-width="2.5"/>
  <circle cx="${cx}" cy="${cy}" r="3.5" fill="${stroke}"/>
  ${givenMark}
  ${askMark}
</svg>`.trim()
}

export interface ParallelTransversalSvgProps {
  angleDeg: number
  /** Stufen (corresponding/F) or Wechsel (alternate/Z). */
  kind: 'stufen' | 'wechsel'
  givenLabel?: string
  askLabel?: string
  stroke?: string
}

/** Two parallels cut by a transversal; mark given angle and equal Stufen/Wechsel. */
export function generateParallelTransversalSvg({
  angleDeg,
  kind,
  givenLabel,
  askLabel = '?',
  stroke = '#455a64',
}: ParallelTransversalSvgProps): string {
  const w = 340
  const h = 300
  const y1 = 80
  const y2 = 220
  const a = (Math.min(160, Math.max(20, angleDeg)) * Math.PI) / 180
  // Direction of transversal in SVG (math angle from +x, positive = up)
  const ux = Math.cos(a)
  const uy = -Math.sin(a)
  const bx = 130
  const by = y2
  const tx1 = bx - 170 * ux
  const ty1 = by - 170 * uy
  const tx2 = bx + 170 * ux
  const ty2 = by + 170 * uy
  // Intersection with top parallel
  const tTop = (y1 - by) / uy
  const tTopX = bx + tTop * ux

  const given = givenLabel ?? `${angleDeg}°`
  const uPar: [number, number] = [1, 0]
  const uTrans: [number, number] = [ux, uy]
  const givenMark = angleMarkSvg([bx, by], uPar, uTrans, given, {
    radius: 32,
    stroke: '#e65100',
    fill: '#fff3e0',
  })

  let askMark = ''
  if (kind === 'stufen') {
    askMark = angleMarkSvg([tTopX, y1], [1, 0], [ux, uy], askLabel, {
      radius: 32,
      stroke: '#2e7d32',
      fill: '#e8f5e9',
    })
  } else {
    askMark = angleMarkSvg([tTopX, y1], [-1, 0], [-ux, -uy], askLabel, {
      radius: 32,
      stroke: '#2e7d32',
      fill: '#e8f5e9',
    })
  }

  return `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <line x1="20" y1="${y1}" x2="${w - 20}" y2="${y1}" stroke="${stroke}" stroke-width="2.5"/>
  <line x1="20" y1="${y2}" x2="${w - 20}" y2="${y2}" stroke="${stroke}" stroke-width="2.5"/>
  <line x1="${tx1}" y1="${ty1}" x2="${tx2}" y2="${ty2}" stroke="#1565c0" stroke-width="2.5"/>
  <text x="${w - 28}" y="${y1 - 8}" font-size="13" fill="#666">g</text>
  <text x="${w - 28}" y="${y2 - 8}" font-size="13" fill="#666">h</text>
  ${givenMark}
  ${askMark}
</svg>`.trim()
}

export interface PyramidVolumeSvgProps {
  baseAreaLabel: string
  heightLabel: string
  fill?: string
  stroke?: string
}

/** Isometric-ish square pyramid with G and h labels. */
export function generatePyramidVolumeSvg({
  baseAreaLabel,
  heightLabel,
  fill = '#fce4ec',
  stroke = '#ad1457',
}: PyramidVolumeSvgProps): string {
  const w = 300
  const h = 260
  // Base quad (isometric)
  const b1 = [60, 200]
  const b2 = [200, 200]
  const b3 = [240, 160]
  const b4 = [100, 160]
  const apex = [150, 40]
  return `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <polygon points="${b4[0]},${b4[1]} ${b3[0]},${b3[1]} ${apex[0]},${apex[1]}" fill="${fill}" stroke="${stroke}" stroke-width="2" opacity="0.75"/>
  <polygon points="${b2[0]},${b2[1]} ${b3[0]},${b3[1]} ${apex[0]},${apex[1]}" fill="${fill}" stroke="${stroke}" stroke-width="2" opacity="0.9"/>
  <polygon points="${b1[0]},${b1[1]} ${b2[0]},${b2[1]} ${apex[0]},${apex[1]}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
  <polygon points="${b1[0]},${b1[1]} ${b2[0]},${b2[1]} ${b3[0]},${b3[1]} ${b4[0]},${b4[1]}" fill="${fill}" stroke="${stroke}" stroke-width="2" opacity="0.55"/>
  <line x1="${apex[0]}" y1="${apex[1]}" x2="150" y2="180" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="4 3"/>
  <text x="150" y="230" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">G = ${baseAreaLabel}</text>
  <text x="168" y="120" font-size="14" font-weight="bold" fill="#333">h = ${heightLabel}</text>
</svg>`.trim()
}

// ---------------------------------------------------------------------------
// Klasse 8: lineare Funktionen (Graph + Steigungsdreieck)
// ---------------------------------------------------------------------------

export interface LinearFunctionSvgProps {
  /** Slope m of y = m·x + n */
  m: number
  /** y-intercept n */
  n: number
  /** Extra labeled points (grid coordinates) */
  points?: Array<{ x: number; y: number; label?: string }>
  /**
   * Draw a slope triangle starting at grid x = fromX with horizontal run
   * (default 1). Labels Δx / Δy when showLabels is true.
   */
  slopeTriangle?: {
    fromX: number
    run?: number
    showLabels?: boolean
    dxLabel?: string
    dyLabel?: string
  }
  /** Mark y-intercept; string replaces the numeric label (e.g. „?“). */
  interceptLabel?: string | false
  xRange?: [number, number]
  yRange?: [number, number]
  cellSize?: number
  stroke?: string
  /** Optional label near the primary line (e.g. „A“). */
  lineLabel?: string
  /** Optional second line (LGS / compare graphs). */
  second?: { m: number; n: number; stroke?: string; label?: string }
}

function clipLineToRect(
  m: number,
  n: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
): [[number, number], [number, number]] | null {
  const candidates: Array<[number, number]> = []
  const push = (x: number, y: number) => {
    if (x >= xMin - 1e-9 && x <= xMax + 1e-9 && y >= yMin - 1e-9 && y <= yMax + 1e-9) {
      candidates.push([
        Math.max(xMin, Math.min(xMax, x)),
        Math.max(yMin, Math.min(yMax, y)),
      ])
    }
  }
  // Vertical edges
  push(xMin, m * xMin + n)
  push(xMax, m * xMax + n)
  // Horizontal edges (if not horizontal line)
  if (Math.abs(m) > 1e-9) {
    push((yMin - n) / m, yMin)
    push((yMax - n) / m, yMax)
  } else if (n >= yMin && n <= yMax) {
    push(xMin, n)
    push(xMax, n)
  }
  // Deduplicate near-equal points
  const uniq: Array<[number, number]> = []
  for (const p of candidates) {
    if (!uniq.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 1e-6)) uniq.push(p)
  }
  if (uniq.length < 2) return null
  // Furthest pair
  let best: [[number, number], [number, number]] = [uniq[0], uniq[1]]
  let bestD = -1
  for (let i = 0; i < uniq.length; i++) {
    for (let j = i + 1; j < uniq.length; j++) {
      const d = Math.hypot(uniq[i][0] - uniq[j][0], uniq[i][1] - uniq[j][1])
      if (d > bestD) {
        bestD = d
        best = [uniq[i], uniq[j]]
      }
    }
  }
  return best
}

/**
 * Coordinate grid with the graph of y = m·x + n, optional slope triangle,
 * intercept mark, points, and a second line for LGS.
 */
export function generateLinearFunctionSvg({
  m,
  n,
  points = [],
  slopeTriangle,
  interceptLabel,
  xRange,
  yRange,
  cellSize = 32,
  stroke = '#1565c0',
  lineLabel,
  second,
}: LinearFunctionSvgProps): string {
  const xs = [0, ...points.map((p) => p.x)]
  const ys = [n, ...points.map((p) => p.y)]
  if (slopeTriangle) {
    const run = slopeTriangle.run ?? 1
    const x0 = slopeTriangle.fromX
    xs.push(x0, x0 + run)
    ys.push(m * x0 + n, m * (x0 + run) + n)
  }
  if (second) {
    ys.push(second.n)
  }
  const autoXMax = Math.max(5, ...xs.map(Math.abs)) + 1
  const autoYMax = Math.max(5, ...ys.map(Math.abs)) + 1
  const xr: [number, number] = xRange ?? [-autoXMax, autoXMax]
  const yr: [number, number] = yRange ?? [-autoYMax, autoYMax]
  const { xMin, xMax, yMin, yMax } = gridBounds(xr, yr)

  const marked = [...points]
  if (interceptLabel !== false) {
    const lab = interceptLabel === undefined ? `n=${n}` : interceptLabel
    if (!marked.some((p) => p.x === 0 && p.y === n)) {
      marked.push({ x: 0, y: n, label: lab })
    }
  }

  let base = generateCoordinateGridSvg({
    xRange: xr,
    yRange: yr,
    points: marked,
    cellSize,
  })

  const padL = 36
  const padT = 28
  const toSvg = (mx: number, my: number): [number, number] => [
    padL + (mx - xMin) * cellSize,
    padT + (yMax - my) * cellSize,
  ]

  const extras: string[] = []

  const drawLine = (mm: number, nn: number, color: string, width = 2.5) => {
    const seg = clipLineToRect(mm, nn, xMin, xMax, yMin, yMax)
    if (!seg) return
    const [a, b] = seg
    const [x1, y1] = toSvg(a[0], a[1])
    const [x2, y2] = toSvg(b[0], b[1])
    extras.push(
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"/>`,
    )
  }

  drawLine(m, n, stroke)
  if (second) drawLine(second.m, second.n, second.stroke ?? '#c62828')

  const placeLineLabel = (mm: number, nn: number, lab: string, color: string) => {
    const x = Math.min(xMax - 0.5, Math.max(xMin + 0.5, 3))
    const y = mm * x + nn
    if (y < yMin || y > yMax) return
    const [sx, sy] = toSvg(x, y)
    extras.push(
      `<text x="${sx + 6}" y="${sy - 6}" font-size="14" font-weight="bold" fill="${color}">${lab}</text>`,
    )
  }
  if (lineLabel) placeLineLabel(m, n, lineLabel, stroke)
  if (second?.label) placeLineLabel(second.m, second.n, second.label, second.stroke ?? '#c62828')

  if (slopeTriangle) {
    const run = slopeTriangle.run ?? 1
    const x0 = slopeTriangle.fromX
    const y0 = m * x0 + n
    const x1 = x0 + run
    const y1 = m * x1 + n
    const [sx0, sy0] = toSvg(x0, y0)
    const [sx1, sy1] = toSvg(x1, y0) // horizontal corner
    const [sx2, sy2] = toSvg(x1, y1)
    extras.push(
      `<polyline points="${sx0},${sy0} ${sx1},${sy1} ${sx2},${sy2}" fill="none" stroke="#e65100" stroke-width="2"/>`,
    )
    // Right-angle mark at the corner (x1, y0)
    const s = Math.min(10, cellSize * 0.35)
    const [rx, ry] = toSvg(x1, y0)
    const up = y1 >= y0 ? -1 : 1 // SVG y decreases upward in math → screen
    const left = run >= 0 ? -1 : 1
    extras.push(
      `<polyline points="${rx + left * s},${ry} ${rx + left * s},${ry + up * s} ${rx},${ry + up * s}" fill="none" stroke="#e65100" stroke-width="1.5"/>`,
    )
    if (slopeTriangle.showLabels !== false) {
      const dxLab = slopeTriangle.dxLabel ?? `Δx=${run}`
      const dyLab = slopeTriangle.dyLabel ?? `Δy=${y1 - y0}`
      const [mx, my] = toSvg((x0 + x1) / 2, y0)
      extras.push(
        `<text x="${mx}" y="${my + (y1 >= y0 ? 16 : -8)}" text-anchor="middle" font-size="12" font-weight="bold" fill="#e65100">${dxLab}</text>`,
      )
      const [nx, ny] = toSvg(x1, (y0 + y1) / 2)
      extras.push(
        `<text x="${nx + (run >= 0 ? 8 : -8)}" y="${ny + 4}" text-anchor="${
          run >= 0 ? 'start' : 'end'
        }" font-size="12" font-weight="bold" fill="#e65100">${dyLab}</text>`,
      )
    }
  }

  if (extras.length === 0) return base
  return base.replace('</svg>', `  ${extras.join('\n  ')}\n</svg>`)
}

// ---------------------------------------------------------------------------
// Klasse 9: rechtwinkliges Dreieck / Trig / Kreis mit Durchmesser
// ---------------------------------------------------------------------------

export interface RightTriangleSvgProps {
  /** Horizontal leg label (a) */
  aLabel: string
  /** Vertical leg label (b) */
  bLabel: string
  /** Hypotenuse label (c); omit or null to hide */
  cLabel?: string | null
  /** Angle at the left base vertex (degrees), drawn with arc if set */
  angleDeg?: number
  /** Label for that angle (default α or the degree) */
  angleLabel?: string
  /** Which side is unknown / marked with emphasis */
  ask?: 'a' | 'b' | 'c' | 'angle'
  fill?: string
  stroke?: string
}

/**
 * Right triangle with legs a (base), b (height), hypotenuse c, right-angle
 * square at the origin corner. Optional acute angle at the left base.
 */
export function generateRightTriangleSvg({
  aLabel,
  bLabel,
  cLabel = null,
  angleDeg,
  angleLabel,
  ask,
  fill = '#e3f2fd',
  stroke = '#1565c0',
}: RightTriangleSvgProps): string {
  const w = 320
  const h = 260
  const pad = 36
  // Proportions: prefer ~3:4 look unless angle suggests otherwise
  let base = 180
  let height = 120
  if (angleDeg != null && angleDeg > 5 && angleDeg < 85) {
    const t = Math.tan((angleDeg * Math.PI) / 180)
    height = Math.min(160, Math.max(70, base * t))
    if (height > 160) {
      height = 160
      base = height / t
    }
  }
  const ox = pad + 20
  const oy = h - pad
  const A: [number, number] = [ox, oy]
  const B: [number, number] = [ox + base, oy]
  const C: [number, number] = [ox, oy - height]

  const interiorA: [number, number] = [ox + 20, oy - 20]
  const rightMark = angleMarkSvg(A, [1, 0], [0, -1], '', {
    radius: 18,
    stroke: '#f57c00',
    interior: interiorA,
  })

  let angleMark = ''
  if (angleDeg != null) {
    const lab = angleLabel ?? (ask === 'angle' ? '?' : `${angleDeg}°`)
    const midTri: [number, number] = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3]
    angleMark = angleMarkSvg(B, [-1, 0], unitToward(B, C), lab, {
      radius: 34,
      stroke: ask === 'angle' ? '#2e7d32' : '#f57c00',
      fill: ask === 'angle' ? '#e8f5e9' : '#fff3e0',
      interior: midTri,
    })
  }

  const mid = (p: [number, number], q: [number, number]): [number, number] => [
    (p[0] + q[0]) / 2,
    (p[1] + q[1]) / 2,
  ]
  const [abx, aby] = mid(A, B)
  const [acx, acy] = mid(A, C)
  const [bcx, bcy] = mid(B, C)

  const sideText = (x: number, y: number, lab: string, emphasize: boolean) =>
    lab
      ? `<text x="${x}" y="${y}" text-anchor="middle" font-size="15" font-weight="bold" fill="${
          emphasize ? '#c62828' : '#333'
        }">${lab}</text>`
      : ''

  return `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <polygon points="${A[0]},${A[1]} ${B[0]},${B[1]} ${C[0]},${C[1]}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>
  ${rightMark}
  ${angleMark}
  ${sideText(abx, aby + 22, aLabel, ask === 'a')}
  ${sideText(acx - 18, acy + 5, bLabel, ask === 'b')}
  ${cLabel != null ? sideText(bcx + 14, bcy - 8, cLabel, ask === 'c') : ''}
</svg>`.trim()
}

export interface CircleMeasureSvgProps {
  radiusLabel: string
  /** Show diameter instead of / in addition to radius */
  showDiameter?: boolean
  diameterLabel?: string
  fill?: string
  stroke?: string
}

/** Circle with radius (and optional diameter) for Umfang/Fläche tasks. */
export function generateCircleMeasureSvg({
  radiusLabel,
  showDiameter = false,
  diameterLabel,
  fill = '#f3e5f5',
  stroke = '#7b1fa2',
}: CircleMeasureSvgProps): string {
  const r = 80
  const pad = 44
  const size = 2 * (r + pad)
  const cx = pad + r
  const cy = pad + r
  const diam =
    showDiameter
      ? `
  <line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${stroke}" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="${cx}" y="${cy + 28}" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">${
          diameterLabel ?? `d = ${radiusLabel}`
        }</text>`
      : ''
  return `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
  <line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${stroke}" stroke-width="2"/>
  <circle cx="${cx}" cy="${cy}" r="3" fill="${stroke}"/>
  <text x="${cx + r / 2}" y="${cy - 10}" text-anchor="middle" font-size="15" font-weight="bold" fill="#333">${radiusLabel}</text>
  ${diam}
</svg>`.trim()
}

export interface CylinderSvgProps {
  radiusLabel: string
  heightLabel: string
  fill?: string
  stroke?: string
}

/** Simple isometric cylinder with r and h labels. */
export function generateCylinderSvg({
  radiusLabel,
  heightLabel,
  fill = '#e8f5e9',
  stroke = '#2e7d32',
}: CylinderSvgProps): string {
  const w = 280
  const h = 260
  const cx = 140
  const topY = 70
  const botY = 190
  const rx = 70
  const ry = 28
  return `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="${cx}" cy="${botY}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
  <rect x="${cx - rx}" y="${topY}" width="${2 * rx}" height="${botY - topY}" fill="${fill}" stroke="none"/>
  <line x1="${cx - rx}" y1="${topY}" x2="${cx - rx}" y2="${botY}" stroke="${stroke}" stroke-width="2"/>
  <line x1="${cx + rx}" y1="${topY}" x2="${cx + rx}" y2="${botY}" stroke="${stroke}" stroke-width="2"/>
  <ellipse cx="${cx}" cy="${topY}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
  <line x1="${cx}" y1="${topY}" x2="${cx + rx}" y2="${topY}" stroke="${stroke}" stroke-width="1.5"/>
  <text x="${cx + rx / 2}" y="${topY - 10}" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">r = ${radiusLabel}</text>
  <text x="${cx + rx + 16}" y="${(topY + botY) / 2 + 5}" font-size="14" font-weight="bold" fill="#333">h = ${heightLabel}</text>
</svg>`.trim()
}

// ---------------------------------------------------------------------------
// Körpernetze (Würfel) für Interaktionsaufgaben
// ---------------------------------------------------------------------------

export type CubeNetKind = 'cross' | 'zigzag' | 'invalid-row' | 'invalid-block'

/** Draw a cube-net option as a small labeled grid of unit squares. */
export function generateCubeNetSvg(
  kind: CubeNetKind,
  {
    label,
    cell = 28,
    fill = '#bbdefb',
    stroke = '#1565c0',
  }: { label?: string; cell?: number; fill?: string; stroke?: string } = {},
): string {
  // Relative cell positions [col, row]
  const layouts: Record<CubeNetKind, Array<[number, number]>> = {
    // Valid latin-cross net
    cross: [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
      [1, 3],
    ],
    // Valid Z / zigzag net
    zigzag: [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
      [2, 2],
      [2, 3],
    ],
    // Invalid: six squares in a row
    'invalid-row': [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
    ],
    // Invalid: 2×3 rectangle
    'invalid-block': [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
  }
  const cells = layouts[kind]
  const maxC = Math.max(...cells.map((c) => c[0]))
  const maxR = Math.max(...cells.map((c) => c[1]))
  const pad = 10
  const labelH = label ? 22 : 0
  const w = pad * 2 + (maxC + 1) * cell
  const h = pad * 2 + (maxR + 1) * cell + labelH
  const rects = cells
    .map(
      ([c, r]) =>
        `<rect x="${pad + c * cell}" y="${pad + r * cell}" width="${cell}" height="${cell}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`,
    )
    .join('\n  ')
  const lab = label
    ? `<text x="${w / 2}" y="${h - 6}" text-anchor="middle" font-size="15" font-weight="bold" fill="#333">${label}</text>`
    : ''
  return `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  ${rects}
  ${lab}
</svg>`.trim()
}

/** Side-by-side net choices A/B/C for „Welches Netz faltbar?“. */
export function generateCubeNetChoicesSvg(
  options: Array<{ kind: CubeNetKind; label: string }>,
): string {
  const parts = options.map((o) => generateCubeNetSvg(o.kind, { label: o.label }))
  return `<div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;align-items:flex-end">${parts.join('')}</div>`
}

// ---------------------------------------------------------------------------
// Gym 10–12 + OS: Parabel, Glücksrad, Pie, Tangente, Integral, Vektoren
// ---------------------------------------------------------------------------

export interface ParabolaSvgProps {
  /** Coefficient a in f(x) = a·x² + c */
  a: number
  /** Vertical shift c */
  c?: number
  /** Optional points on the curve */
  points?: Array<{ x: number; y: number; label?: string }>
  xRange?: [number, number]
  yRange?: [number, number]
  cellSize?: number
  stroke?: string
}

/** Graph of f(x) = a·x² + c on a coordinate grid with optional points. */
export function generateParabolaSvg({
  a,
  c = 0,
  points = [],
  xRange,
  yRange,
  cellSize = 28,
  stroke = '#1565c0',
}: ParabolaSvgProps): string {
  const xs = points.map((p) => p.x)
  const ys = [c, ...points.map((p) => p.y)]
  for (let x = -4; x <= 4; x++) ys.push(a * x * x + c)
  const autoX = Math.max(5, ...xs.map(Math.abs), 4) + 1
  const autoY = Math.max(5, ...ys.map((y) => Math.abs(y))) + 1
  const xr: [number, number] = xRange ?? [-autoX, autoX]
  const yr: [number, number] = yRange ?? [-autoY, autoY]
  const { xMin, xMax, yMin, yMax } = gridBounds(xr, yr)

  let base = generateCoordinateGridSvg({
    xRange: xr,
    yRange: yr,
    points,
    cellSize,
  })

  const padL = 36
  const padT = 28
  const toSvg = (mx: number, my: number): [number, number] => [
    padL + (mx - xMin) * cellSize,
    padT + (yMax - my) * cellSize,
  ]

  const curve: string[] = []
  const steps = Math.max(40, (xMax - xMin) * 8)
  for (let i = 0; i <= steps; i++) {
    const x = xMin + (i / steps) * (xMax - xMin)
    const y = a * x * x + c
    if (y < yMin - 0.5 || y > yMax + 0.5) continue
    const [sx, sy] = toSvg(x, Math.max(yMin, Math.min(yMax, y)))
    curve.push(`${sx},${sy}`)
  }
  if (curve.length >= 2) {
    base = base.replace(
      '</svg>',
      `  <polyline points="${curve.join(' ')}" fill="none" stroke="${stroke}" stroke-width="2.5"/>\n</svg>`,
    )
  }
  return base
}

export interface SpinnerSvgProps {
  /** Payoff label per equal sector (clockwise from +x). */
  payoffs: Array<string | number>
  /** Optional highlight index */
  highlightIndex?: number
  size?: number
}

/** Glücksrad with equal sectors and payoff labels. */
export function generateSpinnerSvg({
  payoffs,
  highlightIndex,
  size = 260,
}: SpinnerSvgProps): string {
  const n = Math.max(2, payoffs.length)
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.38
  const colors = ['#bbdefb', '#c8e6c9', '#ffe0b2', '#f8bbd0', '#d1c4e9', '#b2ebf2', '#fff9c4', '#ffccbc']
  const slices: string[] = []
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 2 * Math.PI - Math.PI / 2
    const a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2
    const x0 = cx + r * Math.cos(a0)
    const y0 = cy + r * Math.sin(a0)
    const x1 = cx + r * Math.cos(a1)
    const y1 = cy + r * Math.sin(a1)
    const large = 2 * Math.PI / n > Math.PI ? 1 : 0
    const fill = colors[i % colors.length]
    const stroke = highlightIndex === i ? '#c62828' : '#455a64'
    const sw = highlightIndex === i ? 3 : 1.5
    slices.push(
      `<path d="M ${cx},${cy} L ${x0},${y0} A ${r},${r} 0 ${large},1 ${x1},${y1} Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`,
    )
    const am = (a0 + a1) / 2
    const lx = cx + r * 0.62 * Math.cos(am)
    const ly = cy + r * 0.62 * Math.sin(am)
    slices.push(
      `<text x="${lx}" y="${ly + 5}" text-anchor="middle" font-size="13" font-weight="bold" fill="#333">${payoffs[i]}</text>`,
    )
  }
  return `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  ${slices.join('\n  ')}
  <circle cx="${cx}" cy="${cy}" r="6" fill="#37474f"/>
</svg>`.trim()
}

export interface PieChartSvgProps {
  /** Slices with value (relative) and label */
  slices: Array<{ value: number; label: string; color?: string }>
  size?: number
}

/** Labeled pie chart for Anteile / Kreisdiagramm (not equal-slice fraction pies). */
export function generatePieChartSvg({ slices, size = 280 }: PieChartSvgProps): string {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1
  const cx = size / 2
  const cy = size / 2 - 8
  const r = size * 0.34
  const defaults = ['#42a5f5', '#66bb6a', '#ffa726', '#ab47bc', '#ef5350', '#26c6da']
  let angle = -Math.PI / 2
  const parts: string[] = []
  slices.forEach((sl, i) => {
    const frac = sl.value / total
    const a0 = angle
    const a1 = angle + frac * 2 * Math.PI
    angle = a1
    const x0 = cx + r * Math.cos(a0)
    const y0 = cy + r * Math.sin(a0)
    const x1 = cx + r * Math.cos(a1)
    const y1 = cy + r * Math.sin(a1)
    const large = frac > 0.5 ? 1 : 0
    const fill = sl.color ?? defaults[i % defaults.length]
    if (frac >= 1 - 1e-9) {
      parts.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#455a64" stroke-width="1.5"/>`)
    } else if (frac > 1e-9) {
      parts.push(
        `<path d="M ${cx},${cy} L ${x0},${y0} A ${r},${r} 0 ${large},1 ${x1},${y1} Z" fill="${fill}" stroke="#455a64" stroke-width="1.5"/>`,
      )
    }
  })
  const legendSvg = slices
    .map((sl, i) => {
      const pct = Math.round((sl.value / total) * 100)
      const fill = sl.color ?? defaults[i % defaults.length]
      const y = size - 8 - (slices.length - 1 - i) * 15
      return `<rect x="14" y="${y - 10}" width="10" height="10" fill="${fill}"/><text x="30" y="${y}" font-size="12" fill="#333">${sl.label}: ${pct}%</text>`
    })
    .join('\n  ')
  return `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  ${parts.join('\n  ')}
  ${legendSvg}
</svg>`.trim()
}

export interface FunctionGraphSvgProps {
  /** Sampled y = f(x) */
  f: (x: number) => number
  xRange?: [number, number]
  yRange?: [number, number]
  cellSize?: number
  stroke?: string
  /** Optional tangent at x0 with slope m */
  tangent?: { x0: number; m: number; label?: string }
  /** Optional shaded area between a and b under the curve (and x-axis) */
  shade?: { a: number; b: number; fill?: string }
  points?: Array<{ x: number; y: number; label?: string }>
}

/** Smooth function graph with optional tangent and integral shading. */
export function generateFunctionGraphSvg({
  f,
  xRange = [-4, 6],
  yRange = [-4, 8],
  cellSize = 28,
  stroke = '#1565c0',
  tangent,
  shade,
  points = [],
}: FunctionGraphSvgProps): string {
  const { xMin, xMax, yMin, yMax } = gridBounds(xRange, yRange)
  let base = generateCoordinateGridSvg({
    xRange,
    yRange,
    points,
    cellSize,
  })
  const padL = 36
  const padT = 28
  const toSvg = (mx: number, my: number): [number, number] => [
    padL + (mx - xMin) * cellSize,
    padT + (yMax - my) * cellSize,
  ]

  const extras: string[] = []

  if (shade) {
    const a = Math.max(xMin, shade.a)
    const b = Math.min(xMax, shade.b)
    const poly: string[] = []
    const [ax0, ay0] = toSvg(a, 0)
    poly.push(`${ax0},${ay0}`)
    const steps = 32
    for (let i = 0; i <= steps; i++) {
      const x = a + (i / steps) * (b - a)
      const y = Math.max(yMin, Math.min(yMax, f(x)))
      const [sx, sy] = toSvg(x, y)
      poly.push(`${sx},${sy}`)
    }
    const [bx0, by0] = toSvg(b, 0)
    poly.push(`${bx0},${by0}`)
    extras.push(
      `<polygon points="${poly.join(' ')}" fill="${shade.fill ?? '#90caf9'}" fill-opacity="0.45" stroke="none"/>`,
    )
  }

  const curve: string[] = []
  const steps = Math.max(48, (xMax - xMin) * 10)
  for (let i = 0; i <= steps; i++) {
    const x = xMin + (i / steps) * (xMax - xMin)
    const y = f(x)
    if (y < yMin - 1 || y > yMax + 1) {
      if (curve.length >= 2) {
        extras.push(
          `<polyline points="${curve.join(' ')}" fill="none" stroke="${stroke}" stroke-width="2.5"/>`,
        )
        curve.length = 0
      }
      continue
    }
    const [sx, sy] = toSvg(x, Math.max(yMin, Math.min(yMax, y)))
    curve.push(`${sx},${sy}`)
  }
  if (curve.length >= 2) {
    extras.push(
      `<polyline points="${curve.join(' ')}" fill="none" stroke="${stroke}" stroke-width="2.5"/>`,
    )
  }

  if (tangent) {
    const { x0, m } = tangent
    const y0 = f(x0)
    const seg = clipLineToRect(m, y0 - m * x0, xMin, xMax, yMin, yMax)
    if (seg) {
      const [p, q] = seg
      const [x1, y1] = toSvg(p[0], p[1])
      const [x2, y2] = toSvg(q[0], q[1])
      extras.push(
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c62828" stroke-width="2" stroke-dasharray="6 4"/>`,
      )
    }
    const [tx, ty] = toSvg(x0, y0)
    extras.push(`<circle cx="${tx}" cy="${ty}" r="4.5" fill="#c62828"/>`)
    if (tangent.label) {
      extras.push(
        `<text x="${tx + 8}" y="${ty - 8}" font-size="12" font-weight="bold" fill="#c62828">${tangent.label}</text>`,
      )
    }
  }

  if (extras.length === 0) return base
  return base.replace('</svg>', `  ${extras.join('\n  ')}\n</svg>`)
}

export interface VectorArrowsSvgProps {
  /** Vectors from origin (or from optional `from`) */
  vectors: Array<{
    x: number
    y: number
    label?: string
    stroke?: string
    from?: [number, number]
  }>
  xRange?: [number, number]
  yRange?: [number, number]
  cellSize?: number
}

/** 2D vector arrows on a coordinate grid (for Betrag / Skalarprodukt sketches). */
export function generateVectorArrowsSvg({
  vectors,
  xRange,
  yRange,
  cellSize = 32,
}: VectorArrowsSvgProps): string {
  const xs = vectors.flatMap((v) => [v.from?.[0] ?? 0, (v.from?.[0] ?? 0) + v.x])
  const ys = vectors.flatMap((v) => [v.from?.[1] ?? 0, (v.from?.[1] ?? 0) + v.y])
  const auto = Math.max(4, ...xs.map(Math.abs), ...ys.map(Math.abs)) + 1
  const xr: [number, number] = xRange ?? [-auto, auto]
  const yr: [number, number] = yRange ?? [-auto, auto]
  const { xMin, yMax } = gridBounds(xr, yr)
  let base = generateCoordinateGridSvg({ xRange: xr, yRange: yr, cellSize })
  const padL = 36
  const padT = 28
  const toSvg = (mx: number, my: number): [number, number] => [
    padL + (mx - xMin) * cellSize,
    padT + (yMax - my) * cellSize,
  ]
  const colors = ['#1565c0', '#c62828', '#2e7d32']
  const extras: string[] = [
    `<defs>
    <marker id="vecArrow0" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><polygon points="0,0 8,4 0,8" fill="#1565c0"/></marker>
    <marker id="vecArrow1" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><polygon points="0,0 8,4 0,8" fill="#c62828"/></marker>
    <marker id="vecArrow2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><polygon points="0,0 8,4 0,8" fill="#2e7d32"/></marker>
  </defs>`,
  ]
  vectors.forEach((v, i) => {
    const ox = v.from?.[0] ?? 0
    const oy = v.from?.[1] ?? 0
    const [x1, y1] = toSvg(ox, oy)
    const [x2, y2] = toSvg(ox + v.x, oy + v.y)
    const color = v.stroke ?? colors[i % colors.length]
    const marker = `vecArrow${i % 3}`
    extras.push(
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2.5" marker-end="url(#${marker})"/>`,
    )
    if (v.label) {
      extras.push(
        `<text x="${(x1 + x2) / 2 + 8}" y="${(y1 + y2) / 2 - 6}" font-size="13" font-weight="bold" fill="${color}">${v.label}</text>`,
      )
    }
  })
  return base.replace('</svg>', `  ${extras.join('\n  ')}\n</svg>`)
}

export interface GridRectSvgProps {
  /** Bottom-left corner in grid coords */
  x: number
  y: number
  width: number
  height: number
  widthLabel?: string
  heightLabel?: string
  xRange?: [number, number]
  yRange?: [number, number]
  cellSize?: number
}

/** Axis-aligned rectangle (or square) on the coordinate grid. */
export function generateGridRectSvg({
  x,
  y,
  width,
  height,
  widthLabel,
  heightLabel,
  xRange,
  yRange,
  cellSize = 32,
}: GridRectSvgProps): string {
  const maxX = x + width
  const maxY = y + height
  const xr: [number, number] = xRange ?? [Math.min(-1, x - 1), Math.max(8, maxX + 1)]
  const yr: [number, number] = yRange ?? [Math.min(-1, y - 1), Math.max(8, maxY + 1)]
  return generateCoordinateGridSvg({
    xRange: xr,
    yRange: yr,
    cellSize,
    polygons: [
      {
        points: [
          [x, y],
          [x + width, y],
          [x + width, y + height],
          [x, y + height],
        ],
        fill: '#fff3e0',
        stroke: '#f57c00',
        opacity: 0.55,
        label: widthLabel && heightLabel ? undefined : undefined,
      },
    ],
    points: [
      ...(widthLabel
        ? [{ x: x + width / 2, y: y - 0.35, label: widthLabel }]
        : []),
      ...(heightLabel
        ? [{ x: x + width + 0.35, y: y + height / 2, label: heightLabel }]
        : []),
    ],
  })
}

/** Simple triangular prism net (2 triangles + 3 rectangles) as choice option. */
export function generatePrismNetSvg(
  kind: 'valid' | 'invalid',
  { label, cell = 22 }: { label?: string; cell?: number } = {},
): string {
  // valid: triangle - rect - triangle row with two side rects; simplified strip
  const layouts: Record<'valid' | 'invalid', Array<[number, number, number, number]>> = {
    // [col, row, w, h] in cell units — rectangles only approximation of net
    valid: [
      [1, 0, 2, 1],
      [0, 1, 1, 2],
      [1, 1, 2, 2],
      [3, 1, 1, 2],
      [1, 3, 2, 1],
    ],
    invalid: [
      [0, 0, 2, 2],
      [2, 0, 2, 2],
      [0, 2, 2, 2],
    ],
  }
  const boxes = layouts[kind]
  const maxC = Math.max(...boxes.map(([c, , w]) => c + w))
  const maxR = Math.max(...boxes.map(([, r, , h]) => r + h))
  const pad = 10
  const labelH = label ? 20 : 0
  const w = pad * 2 + maxC * cell
  const h = pad * 2 + maxR * cell + labelH
  const fill = kind === 'valid' ? '#c8e6c9' : '#ffcdd2'
  const stroke = kind === 'valid' ? '#2e7d32' : '#c62828'
  const rects = boxes
    .map(
      ([c, r, bw, bh]) =>
        `<rect x="${pad + c * cell}" y="${pad + r * cell}" width="${bw * cell}" height="${bh * cell}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`,
    )
    .join('\n  ')
  const lab = label
    ? `<text x="${w / 2}" y="${h - 4}" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">${label}</text>`
    : ''
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${rects}${lab}</svg>`
}

export function generatePrismNetChoicesSvg(
  options: Array<{ kind: 'valid' | 'invalid'; label: string }>,
): string {
  const parts = options.map((o) => generatePrismNetSvg(o.kind, { label: o.label }))
  return `<div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;align-items:flex-end">${parts.join('')}</div>`
}

/**
 * Crossing lines with three labeled angles A/B/C so learners can mark
 * Nebenwinkel vs. Scheitelwinkel by letter.
 * Given angle is the orange one; A = Neben, B = Scheitel, C = other Neben.
 */
export function generateAnglePickSvg({
  angleDeg,
  stroke = '#1565c0',
}: {
  angleDeg: number
  stroke?: string
}): string {
  const w = 340
  const h = 300
  const cx = w / 2
  const cy = h / 2
  const len = 130
  const a = (angleDeg * Math.PI) / 180
  const h1 = [cx - len, cy]
  const h2 = [cx + len, cy]
  const d1 = [cx - len * Math.cos(a), cy + len * Math.sin(a)]
  const d2 = [cx + len * Math.cos(a), cy - len * Math.sin(a)]

  const givenInterior: [number, number] = [
    cx + Math.cos(a / 2) * 40,
    cy - Math.sin(a / 2) * 40,
  ]
  const givenMark = angleMarkSvg([cx, cy], [1, 0], [Math.cos(a), -Math.sin(a)], `${angleDeg}°`, {
    radius: 32,
    stroke: '#e65100',
    fill: '#fff3e0',
    interior: givenInterior,
  })

  const nebenDeg = Math.PI - a
  const nebenInterior: [number, number] = [
    cx + Math.cos(a + nebenDeg / 2) * 48,
    cy - Math.sin(a + nebenDeg / 2) * 48,
  ]
  const markA = angleMarkSvg(
    [cx, cy],
    [Math.cos(a), -Math.sin(a)],
    [-1, 0],
    'A',
    { radius: 44, stroke: '#2e7d32', fill: '#e8f5e9', interior: nebenInterior },
  )

  const scheitelInterior: [number, number] = [
    cx - Math.cos(a / 2) * 48,
    cy + Math.sin(a / 2) * 48,
  ]
  const markB = angleMarkSvg(
    [cx, cy],
    [-1, 0],
    [-Math.cos(a), Math.sin(a)],
    'B',
    { radius: 44, stroke: '#1565c0', fill: '#e3f2fd', interior: scheitelInterior },
  )

  const otherNebenInterior: [number, number] = [
    cx + Math.cos(a / 2 + Math.PI) * 48,
    cy - Math.sin(a / 2 + Math.PI) * 48,
  ]
  // C: the other adjacent on the straight line (from -line2 to +x)
  const markC = angleMarkSvg(
    [cx, cy],
    [-Math.cos(a), Math.sin(a)],
    [1, 0],
    'C',
    { radius: 50, stroke: '#6a1b9a', fill: '#f3e5f5', interior: otherNebenInterior },
  )

  return `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <line x1="${h1[0]}" y1="${h1[1]}" x2="${h2[0]}" y2="${h2[1]}" stroke="${stroke}" stroke-width="2.5"/>
  <line x1="${d1[0]}" y1="${d1[1]}" x2="${d2[0]}" y2="${d2[1]}" stroke="${stroke}" stroke-width="2.5"/>
  <circle cx="${cx}" cy="${cy}" r="3.5" fill="${stroke}"/>
  ${givenMark}
  ${markA}
  ${markB}
  ${markC}
</svg>`.trim()
}

/**
 * Labeled rectangular prism net: faces A–E (three Mantel + two bases).
 * Layout: top base A, middle row B–C–D (Mantel), bottom base E.
 * All faces look the same — learners must identify the Mantel.
 */
export function generateLabeledPrismNetSvg({
  faceLabels = ['A', 'B', 'C', 'D', 'E'],
  cell = 36,
}: {
  faceLabels?: string[]
  cell?: number
} = {}): string {
  const [la, lb, lc, ld, le] = faceLabels
  const boxes: Array<{ c: number; r: number; w: number; h: number; lab: string }> = [
    { c: 1, r: 0, w: 2, h: 1, lab: la },
    { c: 0, r: 1, w: 1, h: 2, lab: lb },
    { c: 1, r: 1, w: 2, h: 2, lab: lc },
    { c: 3, r: 1, w: 1, h: 2, lab: ld },
    { c: 1, r: 3, w: 2, h: 1, lab: le },
  ]
  const maxC = 4
  const maxR = 4
  const pad = 12
  const w = pad * 2 + maxC * cell
  const h = pad * 2 + maxR * cell + 28
  const rects = boxes
    .map(({ c, r, w: bw, h: bh, lab }) => {
      const x = pad + c * cell
      const y = pad + r * cell
      const tw = bw * cell
      const th = bh * cell
      return `<rect x="${x}" y="${y}" width="${tw}" height="${th}" fill="#fff8e1" stroke="#f57c00" stroke-width="2"/>
  <text x="${x + tw / 2}" y="${y + th / 2 + 5}" text-anchor="middle" font-size="16" font-weight="bold" fill="#333">${lab}</text>`
    })
    .join('\n  ')
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  ${rects}
  <text x="${w / 2}" y="${h - 8}" text-anchor="middle" font-size="11" fill="#666">Netz eines dreiseitigen Prismas</text>
</svg>`
}
