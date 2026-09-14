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
