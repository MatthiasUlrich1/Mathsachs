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
}

/**
 * Generate an SVG string for a labeled 3D cuboid (Quader).
 * Shows an isometric view with labeled dimensions.
 */
export function generateCuboidSvg({
  lengthLabel,
  widthLabel,
  heightLabel,
  fill = '#e3f2fd',
  stroke = '#1976d2',
}: CuboidSvgProps): string {
  const padding = 40
  const baseW = 180
  const baseH = 100
  const depth = 80
  const totalW = baseW + depth + 2 * padding
  const totalH = baseH + depth + 2 * padding + 40

  // Isometric projection points
  const x0 = padding
  const y0 = padding + depth
  
  // Front face corners
  const frontBL = [x0, y0 + baseH]
  const frontBR = [x0 + baseW, y0 + baseH]
  const frontTR = [x0 + baseW, y0]
  const frontTL = [x0, y0]
  
  // Back face corners (shifted by depth in isometric view)
  const backBL = [x0 + depth, y0 + baseH - depth]
  const backBR = [x0 + baseW + depth, y0 + baseH - depth]
  const backTR = [x0 + baseW + depth, y0 - depth]
  const backTL = [x0 + depth, y0 - depth]

  return `
<svg width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg">
  <!-- 3D Cuboid (Isometric view) -->
  
  <!-- Back faces (darker) -->
  <polygon
    points="${backTL[0]},${backTL[1]} ${backTR[0]},${backTR[1]} ${backBR[0]},${backBR[1]} ${backBL[0]},${backBL[1]}"
    fill="${fill}"
    stroke="${stroke}"
    stroke-width="2"
    opacity="0.7"
  />
  <polygon
    points="${backTR[0]},${backTR[1]} ${frontTR[0]},${frontTR[1]} ${frontBR[0]},${frontBR[1]} ${backBR[0]},${backBR[1]}"
    fill="${fill}"
    stroke="${stroke}"
    stroke-width="2"
    opacity="0.8"
  />
  
  <!-- Front face -->
  <polygon
    points="${frontTL[0]},${frontTL[1]} ${frontTR[0]},${frontTR[1]} ${frontBR[0]},${frontBR[1]} ${frontBL[0]},${frontBL[1]}"
    fill="${fill}"
    stroke="${stroke}"
    stroke-width="2"
  />
  
  <!-- Length label (bottom front) -->
  <line
    x1="${frontBL[0]}"
    y1="${frontBL[1] + 20}"
    x2="${frontBR[0]}"
    y2="${frontBR[1] + 20}"
    stroke="${stroke}"
    stroke-width="1"
    marker-start="url(#arrowStart)"
    marker-end="url(#arrowEnd)"
  />
  <text
    x="${(frontBL[0] + frontBR[0]) / 2}"
    y="${frontBL[1] + 38}"
    text-anchor="middle"
    font-size="14"
    font-weight="bold"
    fill="#333"
  >
    ${lengthLabel}
  </text>
  
  <!-- Width label (right bottom edge) -->
  <line
    x1="${frontBR[0] + 10}"
    y1="${frontBR[1]}"
    x2="${backBR[0] + 10}"
    y2="${backBR[1]}"
    stroke="${stroke}"
    stroke-width="1"
    marker-start="url(#arrowStart)"
    marker-end="url(#arrowEnd)"
  />
  <text
    x="${(frontBR[0] + backBR[0]) / 2 + 25}"
    y="${(frontBR[1] + backBR[1]) / 2 + 5}"
    text-anchor="middle"
    font-size="14"
    font-weight="bold"
    fill="#333"
  >
    ${widthLabel}
  </text>
  
  <!-- Height label (left edge) -->
  <line
    x1="${frontTL[0] - 15}"
    y1="${frontTL[1]}"
    x2="${frontBL[0] - 15}"
    y2="${frontBL[1]}"
    stroke="${stroke}"
    stroke-width="1"
    marker-start="url(#arrowStart)"
    marker-end="url(#arrowEnd)"
  />
  <text
    x="${frontTL[0] - 25}"
    y="${(frontTL[1] + frontBL[1]) / 2 + 5}"
    text-anchor="middle"
    font-size="14"
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
}

/**
 * Generate an SVG string for an angle visualization.
 * Shows two rays meeting at a vertex with an optional arc.
 */
export function generateAngleSvg({
  angle,
  label,
  showArc = true,
  fill = '#fff3e0',
  stroke = '#f57c00',
}: AngleSvgProps): string {
  const padding = 40
  const rayLength = 180
  const totalSize = rayLength + 2 * padding
  
  const cx = padding + 30
  const cy = padding + rayLength - 30
  
  // First ray (horizontal to the right)
  const ray1End = [cx + rayLength, cy]
  
  // Second ray (at given angle)
  const angleRad = (angle * Math.PI) / 180
  const ray2End = [
    cx + rayLength * Math.cos(angleRad),
    cy - rayLength * Math.sin(angleRad),
  ]
  
  // Arc path for the angle
  const arcRadius = 60
  const largeArcFlag = angle > 180 ? 1 : 0
  const arcPath = `M ${cx + arcRadius},${cy} A ${arcRadius},${arcRadius} 0 ${largeArcFlag},1 ${
    cx + arcRadius * Math.cos(angleRad)
  },${cy - arcRadius * Math.sin(angleRad)}`

  return `
<svg width="${totalSize}" height="${totalSize}" xmlns="http://www.w3.org/2000/svg">
  <!-- Angle visualization -->
  
  <!-- Ray 1 (horizontal) -->
  <line
    x1="${cx}"
    y1="${cy}"
    x2="${ray1End[0]}"
    y2="${ray1End[1]}"
    stroke="${stroke}"
    stroke-width="3"
  />
  
  <!-- Ray 2 (at angle) -->
  <line
    x1="${cx}"
    y1="${cy}"
    x2="${ray2End[0]}"
    y2="${ray2End[1]}"
    stroke="${stroke}"
    stroke-width="3"
  />
  
  ${
    showArc
      ? `
  <!-- Angle arc -->
  <path
    d="${arcPath}"
    fill="none"
    stroke="${stroke}"
    stroke-width="2"
  />
  <path
    d="${arcPath} L ${cx},${cy} Z"
    fill="${fill}"
    opacity="0.3"
  />`
      : ''
  }
  
  <!-- Vertex dot -->
  <circle
    cx="${cx}"
    cy="${cy}"
    r="4"
    fill="${stroke}"
  />
  
  ${
    label
      ? `
  <!-- Label -->
  <text
    x="${cx + arcRadius / 2 + 15}"
    y="${cy - arcRadius / 2 + 15}"
    text-anchor="middle"
    font-size="18"
    font-weight="bold"
    fill="#333"
  >
    ${label}
  </text>`
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
      const lab = p.label
        ? `<text x="${sx + 8}" y="${sy - 8}" font-size="13" font-weight="bold" fill="#333">${p.label}</text>`
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
