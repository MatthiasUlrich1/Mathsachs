import { describe, it, expect } from 'vitest'
import {
  generateRectangleSvg,
  generateTriangleSvg,
  generateTriangleAnglesSvg,
  generateQuadAnglesSvg,
  generateCircleSvg,
  generateCuboidSvg,
  generateCuboidFaceEdgeSvg,
  generatePrismVolumeSvg,
  generateValueTableSvg,
  generateAssignmentGraphSvg,
  generateAngleSvg,
  generateCrossingLinesSvg,
  generateParallelTransversalSvg,
  generatePyramidVolumeSvg,
  generateFractionCircleSvg,
  generateFractionBarSvg,
  generateFractionGridSvg,
  generateLShapeSvg,
  generateUShapeSvg,
  generateCompositeCuboidSvg,
  GEO_LABEL_FILL,
  generateCoordinateGridSvg,
  generatePointsOnGridSvg,
  generateTranslationSvg,
  generateSymmetryShapeSvg,
  generateReflectionSvg,
  generatePointReflectionSvg,
  generateSegmentSvg,
  generateSegmentsOnGridSvg,
  generateRayOrLineSvg,
  generateLinearFunctionSvg,
  generateRightTriangleSvg,
  generateCircleMeasureSvg,
  generateCylinderSvg,
  generateParabolaSvg,
  generateSpinnerSvg,
  generatePieChartSvg,
  generateFunctionGraphSvg,
  generateVectorArrowsSvg,
  generateGridRectSvg,
  generatePrismNetChoicesSvg,
  generateAnglePickSvg,
  generateLabeledPrismNetSvg,
  segmentLength,
  reflectPointAcross,
  pointReflectAcross,
  symmetryAxisCount,
} from './geometrySvg'

describe('geometrySvg', () => {
  describe('generateRectangleSvg', () => {
    it('generates valid SVG with labels', () => {
      const svg = generateRectangleSvg({
        widthLabel: '5 cm',
        heightLabel: '3 cm',
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('5 cm')
      expect(svg).toContain('3 cm')
      expect(svg).toContain('<rect')
    })

    it('uses custom colors', () => {
      const svg = generateRectangleSvg({
        widthLabel: '10 m',
        heightLabel: '6 m',
        fill: '#ff0000',
        stroke: '#00ff00',
      })
      expect(svg).toContain('fill="#ff0000"')
      expect(svg).toContain('stroke="#00ff00"')
    })
  })

  describe('generateTriangleSvg', () => {
    it('generates valid SVG with base and height', () => {
      const svg = generateTriangleSvg({
        baseLabel: '8 cm',
        heightLabel: '6 cm',
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('8 cm')
      expect(svg).toContain('6 cm')
      expect(svg).toContain('<polygon')
    })
  })

  describe('generateTriangleAnglesSvg', () => {
    it('labels angles and draws arcs for a constructed triangle', () => {
      const svg = generateTriangleAnglesSvg({
        aLabel: '50°',
        bLabel: '60°',
        cLabel: '?',
        anglesDeg: [50, 60, 70],
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('50°')
      expect(svg).toContain('60°')
      expect(svg).toContain('?')
      expect(svg).toContain('<polygon')
      expect(svg).toContain('<path')
    })

    it('uses a German right-angle mark (arc + dot) at 90°', () => {
      const svg = generateTriangleAnglesSvg({
        aLabel: '90°',
        bLabel: '45°',
        cLabel: '45°',
        anglesDeg: [90, 45, 45],
      })
      expect(svg).toContain('<path')
      expect(svg).toContain('<circle')
      expect(svg).not.toContain('<polyline')
      expect(svg).toContain('90°')
    })

    it('keeps every angle-arc midpoint inside the triangle', () => {
      const pointInTriangle = (
        p: [number, number],
        a: [number, number],
        b: [number, number],
        c: [number, number],
      ) => {
        const sign = (p1: [number, number], p2: [number, number], p3: [number, number]) =>
          (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1])
        const b1 = sign(p, a, b) < 0
        const b2 = sign(p, b, c) < 0
        const b3 = sign(p, c, a) < 0
        return b1 === b2 && b2 === b3
      }

      const cases: Array<[number, number, number]> = [
        [50, 60, 70],
        [37, 26, 117],
        [43, 47, 90],
        [90, 45, 45],
        [120, 30, 30],
        [40, 110, 30],
      ]

      for (const anglesDeg of cases) {
        const svg = generateTriangleAnglesSvg({
          aLabel: 'A',
          bLabel: 'B',
          cLabel: 'C',
          anglesDeg,
        })
        const poly = svg.match(/<polygon points="([^"]+)"/)?.[1]
        expect(poly).toBeTruthy()
        const [A, B, C] = poly!
          .split(' ')
          .map((s) => s.split(',').map(Number) as [number, number])

        const arcs = [
          ...svg.matchAll(
            /M ([\d.-]+),([\d.-]+) A ([\d.-]+),([\d.-]+) 0 ([01]),([01]) ([\d.-]+),([\d.-]+)/g,
          ),
        ]
        const seen = new Set<string>()
        for (const m of arcs) {
          if (seen.has(m[0])) continue
          seen.add(m[0])
          const x0 = +m[1]
          const y0 = +m[2]
          const r = +m[3]
          const sweep = +m[6]
          const x1 = +m[7]
          const y1 = +m[8]
          const vertex = [A, B, C].find(
            (v) =>
              Math.abs(Math.hypot(x0 - v[0], y0 - v[1]) - r) < 0.5 &&
              Math.abs(Math.hypot(x1 - v[0], y1 - v[1]) - r) < 0.5,
          )
          expect(vertex).toBeTruthy()
          const a0 = Math.atan2(y0 - vertex![1], x0 - vertex![0])
          const a1 = Math.atan2(y1 - vertex![1], x1 - vertex![0])
          let delta = a1 - a0
          // y-down: atan2 increases clockwise; SVG sweep=1 is clockwise
          if (sweep === 1) {
            while (delta < 0) delta += 2 * Math.PI
            while (delta >= 2 * Math.PI) delta -= 2 * Math.PI
          } else {
            while (delta > 0) delta -= 2 * Math.PI
            while (delta <= -2 * Math.PI) delta += 2 * Math.PI
          }
          const mid = a0 + delta / 2
          const mx = vertex![0] + r * Math.cos(mid)
          const my = vertex![1] + r * Math.sin(mid)
          expect(pointInTriangle([mx, my], A, B, C)).toBe(true)
        }
      }
    })
  })

  describe('generateQuadAnglesSvg', () => {
    it('labels all four interior angles with arcs', () => {
      const svg = generateQuadAnglesSvg({
        aLabel: '80°',
        bLabel: '100°',
        cLabel: '90°',
        dLabel: '?',
        anglesDeg: [80, 100, 90, 90],
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('80°')
      expect(svg).toContain('100°')
      expect(svg).toContain('90°')
      expect(svg).toContain('?')
      expect(svg).toContain('<polygon')
      expect(svg).toContain('<path')
    })
  })

  describe('generateCircleSvg', () => {
    it('generates valid SVG with radius', () => {
      const svg = generateCircleSvg({
        radiusLabel: 'r = 4 cm',
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('r = 4 cm')
      expect(svg).toContain('<circle')
    })
  })

  describe('generateCuboidSvg', () => {
    it('generates valid 3D cuboid SVG with all dimensions', () => {
      const svg = generateCuboidSvg({
        lengthLabel: '10 cm',
        widthLabel: '6 cm',
        heightLabel: '8 cm',
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('10 cm')
      expect(svg).toContain('6 cm')
      expect(svg).toContain('8 cm')
      expect(svg).toContain('<polygon')
      expect(svg).toContain('stroke-dasharray')
      expect((svg.match(/<polygon/g) ?? []).length).toBeGreaterThanOrEqual(3)
    })

    it('can look like a Würfel and label the top face', () => {
      const svg = generateCuboidSvg({
        lengthLabel: 'a',
        widthLabel: 'a',
        heightLabel: 'a',
        cube: true,
        topFaceLabel: 'G = ?',
      })
      expect(svg).toContain('aria-label="Würfel"')
      expect(svg).toContain('G = ?')
    })

    it('draws Würfel in Kavalierperspektive: 45° depth exactly half front edge', () => {
      const svg = generateCuboidSvg({
        lengthLabel: '',
        widthLabel: '',
        heightLabel: '',
        cube: true,
        areaFace: 'top',
        areaLabel: 'A = 100 cm²',
        perpendicularLabel: '?',
      })
      const polys = [...svg.matchAll(/<polygon points="([^"]+)"/g)].map((m) =>
        m[1]!.split(' ').map((p) => p.split(',').map(Number) as [number, number]),
      )
      // Order: top, right, front
      const front = polys[2]!
      const frontW = front[1]![0]! - front[0]![0]!
      const frontH = front[2]![1]! - front[1]![1]!
      expect(Math.abs(frontW - frontH)).toBeLessThan(1)
      const top = polys[0]!
      // frontTL → backTL is depth
      const ddx = top[3]![0]! - top[0]![0]!
      const ddy = top[0]![1]! - top[3]![1]!
      const depthLen = Math.hypot(ddx, ddy)
      expect(Math.abs(depthLen - frontW / 2)).toBeLessThan(1.5)
      expect(Math.abs(ddx - ddy)).toBeLessThan(1) // 45°
      expect(svg).toContain('stroke="#e65100"') // perp on the edge
    })

    it('keeps multi-digit height labels fully inside the viewBox', () => {
      const svg = generateCuboidSvg({
        lengthLabel: '',
        widthLabel: '',
        heightLabel: '',
        areaFace: 'top',
        areaLabel: 'G = ?',
        perpendicularLabel: '10 cm',
      })
      expect(svg).toContain('>10 cm<')
      const vb = svg.match(/viewBox="0 0 (\d+) (\d+)"/)
      expect(vb).toBeTruthy()
      expect(svg).toContain('text-anchor="end"')
      expect(Number(vb![1])).toBeGreaterThan(200)
    })

    it('uses uniform stroke color for height (no orange highlight)', () => {
      const svg = generateCuboidSvg({
        lengthLabel: '6 cm',
        widthLabel: '10 cm',
        heightLabel: '8 cm',
      })
      expect(svg).toContain('8 cm')
      expect(svg).toContain(GEO_LABEL_FILL)
      expect(svg).not.toContain('#e65100')
      // Height uses the same outward arrow markers as length/width
      expect(svg).toContain('marker-end="url(#cuboidArrow)"')
      expect(svg).toContain('id="cuboidArrow"')
      const dimLines = [...svg.matchAll(/<line[^>]*marker-end="url\(#cuboidArrow\)"[^>]*\/>/g)]
      // 3 measures × 2 half-lines
      expect(dimLines.length).toBe(6)
      for (const m of dimLines) {
        expect(m[0]).toContain('stroke="#1976d2"')
      }
    })
  })

  describe('generateCuboidFaceEdgeSvg', () => {
    it('highlights the face and labels area plus edges', () => {
      const svg = generateCuboidFaceEdgeSvg({
        faceAreaLabel: '24 cm²',
        faceEdgeLabel: '6 cm',
        perpendicularLabel: '?',
        caption: 'Test',
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('A = 24 cm²')
      expect(svg).toContain('6 cm')
      expect(svg).toContain('?')
      expect(svg).toContain('Test')
      expect(svg).toContain('stroke-dasharray')
    })

    it('draws a cube when cube=true', () => {
      const svg = generateCuboidFaceEdgeSvg({
        faceAreaLabel: '81 cm²',
        faceEdgeLabel: '?',
        perpendicularLabel: '?',
        cube: true,
      })
      expect(svg).toContain('Würfel')
      expect(svg).toContain('Quadrat')
    })
  })

  describe('generatePrismVolumeSvg', () => {
    it('shows base area on the bottom and height on a vertical edge', () => {
      const svg = generatePrismVolumeSvg({
        baseAreaLabel: '12 cm²',
        heightLabel: '5 cm',
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('G = 12 cm²')
      expect(svg).toContain('h = 5 cm')
      expect(svg).toContain('aria-label="Prisma"')
      expect(svg).toContain('text-anchor="end"')
      expect(svg).toContain('<polygon')
    })
  })

  describe('generateValueTableSvg', () => {
    it('renders cells and marks missing y with ?', () => {
      const svg = generateValueTableSvg({
        cells: [
          { x: 2, y: 6 },
          { x: 4, y: null },
        ],
        arrowHint: '· 3',
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('2')
      expect(svg).toContain('6')
      expect(svg).toContain('?')
      expect(svg).toContain('· 3')
    })
  })

  describe('generateAssignmentGraphSvg', () => {
    it('draws proportional ray and points', () => {
      const svg = generateAssignmentGraphSvg({
        points: [
          { x: 1, y: 2 },
          { x: 2, y: 4 },
        ],
        showRay: true,
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('<circle')
      expect(svg).toContain('<line')
    })

    it('draws antiproportional curve guide', () => {
      const svg = generateAssignmentGraphSvg({
        points: [
          { x: 2, y: 12 },
          { x: 3, y: 8 },
          { x: 4, y: 6 },
        ],
        productK: 24,
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('<polyline')
    })
  })

  describe('generateAngleSvg', () => {
    it('generates valid angle SVG with arc and label', () => {
      const svg = generateAngleSvg({
        angle: 45,
        label: '45°',
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('45°')
      expect(svg).toContain('<path') // Arc
      expect(svg).toContain('<line') // Rays
    })

    it('generates angle without arc when showArc is false', () => {
      const svg = generateAngleSvg({
        angle: 90,
        showArc: false,
      })
      expect(svg).toContain('<svg')
      expect(svg).not.toContain('<path')
      expect(svg).not.toContain('<polyline')
    })

    it('marks a right angle with Viertelkreis and dot', () => {
      const svg = generateAngleSvg({
        angle: 90,
        label: '90°',
      })
      expect(svg).toContain('<path')
      expect(svg).toContain('<circle')
      expect(svg).not.toContain('<polyline')
      expect(svg).toContain('90°')
    })

    it('rotates the figure when startAngle is set', () => {
      const a = generateAngleSvg({ angle: 90, startAngle: 0 })
      const b = generateAngleSvg({ angle: 90, startAngle: 45 })
      expect(a).not.toBe(b)
    })
  })

  describe('generateCrossingLinesSvg', () => {
    it('marks nebenwinkel with arcs', () => {
      const svg = generateCrossingLinesSvg({ angleDeg: 70, ask: 'neben' })
      expect(svg).toContain('<svg')
      expect(svg).toContain('70°')
      expect(svg).toContain('?')
      expect(svg).toContain('<path')
    })
  })

  describe('generateParallelTransversalSvg', () => {
    it('draws parallels and stufen marks', () => {
      const svg = generateParallelTransversalSvg({ angleDeg: 55, kind: 'stufen' })
      expect(svg).toContain('<svg')
      expect(svg).toContain('55°')
      expect(svg).toContain('?')
    })
  })

  describe('generatePyramidVolumeSvg', () => {
    it('labels base area and height', () => {
      const svg = generatePyramidVolumeSvg({
        baseAreaLabel: '36 cm²',
        heightLabel: '9 cm',
      })
      expect(svg).toContain('G = 36 cm²')
      expect(svg).toContain('h = 9 cm')
    })
  })

  describe('generateFractionCircleSvg', () => {
    it('generates valid fraction circle SVG without label by default', () => {
      const svg = generateFractionCircleSvg({
        numerator: 3,
        denominator: 4,
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('<path')
      expect(svg).not.toContain('3/4')
    })

    it('shows label when showLabel is true', () => {
      const svg = generateFractionCircleSvg({
        numerator: 3,
        denominator: 4,
        showLabel: true,
      })
      expect(svg).toContain('3/4')
    })
  })

  describe('generateFractionBarSvg', () => {
    it('generates valid fraction bar SVG without label by default', () => {
      const svg = generateFractionBarSvg({
        numerator: 2,
        denominator: 5,
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('<rect')
      expect(svg).not.toContain('2/5')
    })

    it('shows label when showLabel is true', () => {
      const svg = generateFractionBarSvg({
        numerator: 2,
        denominator: 5,
        showLabel: true,
      })
      expect(svg).toContain('2/5')
    })
  })

  describe('generateFractionGridSvg', () => {
    it('generates valid fraction grid SVG without label by default', () => {
      const svg = generateFractionGridSvg({
        numerator: 3,
        denominator: 6,
        cols: 3,
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('<rect')
      expect(svg).not.toContain('3/6')
      // 6 cells
      expect((svg.match(/<rect/g) ?? []).length).toBe(6)
    })

    it('shows label when showLabel is true', () => {
      const svg = generateFractionGridSvg({
        numerator: 2,
        denominator: 8,
        showLabel: true,
      })
      expect(svg).toContain('2/8')
    })
  })

  describe('generateLShapeSvg', () => {
    it('generates L-shape with dimension labels', () => {
      const svg = generateLShapeSvg({
        outerWidth: 8,
        outerHeight: 6,
        cutWidth: 3,
        cutHeight: 4,
        bottomLabel: '8 m',
        leftLabel: '6 m',
        topLabel: '5 m',
        rightLabel: '2 m',
        innerHorizontalLabel: '3 m',
        innerVerticalLabel: '4 m',
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('<polygon')
      expect(svg).toContain('8 m')
      expect(svg).toContain('6 m')
      expect(svg).toContain('5 m')
      expect(svg).toContain('2 m')
      expect(svg).toContain('3 m')
      expect(svg).toContain('4 m')
      expect(svg).toContain(GEO_LABEL_FILL)
      expect(svg).toContain('marker-end="url(#lshapeArrow)"')
      const dimLines = [...svg.matchAll(/<line[^>]*marker-end="url\(#lshapeArrow\)"[^>]*\/>/g)]
      // 6 measures × 2 half-lines
      expect(dimLines.length).toBe(12)
    })

    it('places inner cut labels in the cutout, not inside the L fill', () => {
      const svg = generateLShapeSvg({
        outerWidth: 14,
        outerHeight: 12,
        cutWidth: 12,
        cutHeight: 7,
        bottomLabel: '14 m',
        leftLabel: '12 m',
        topLabel: '2 m',
        rightLabel: '5 m',
        innerHorizontalLabel: '12,0 m',
        innerVerticalLabel: '7 m',
      })
      const scale = Math.min(220 / 14, 180 / 12)
      const padL = 68
      const padT = 44
      const stemEdgeX = padL + (14 - 12) * scale
      const stepY = padT + 7 * scale
      const vertMatch = svg.match(
        /<text x="([^"]+)" y="([^"]+)"[^>]*>7 m<\/text>/,
      )
      expect(vertMatch).toBeTruthy()
      expect(Number(vertMatch![1])).toBeGreaterThan(stemEdgeX)
      const horizMatch = svg.match(
        /<text x="([^"]+)" y="([^"]+)"[^>]*>12,0 m<\/text>/,
      )
      expect(horizMatch).toBeTruthy()
      expect(Number(horizMatch![1])).toBeGreaterThan(stemEdgeX)
      expect(Number(horizMatch![2])).toBeLessThan(stepY)
    })
  })

  describe('generateUShapeSvg', () => {
    it('generates U-shape with outer and notch labels', () => {
      const svg = generateUShapeSvg({
        outerWidth: 10,
        outerHeight: 6,
        notchWidth: 4,
        notchHeight: 3,
        bottomLabel: '10 m',
        leftLabel: '6 m',
        topLeftLabel: '3 m',
        topRightLabel: '3 m',
        notchLeftLabel: '3 m',
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('<polygon')
      expect(svg).toContain('10 m')
      expect(svg).toContain('6 m')
      expect(svg).toContain('3 m')
      expect(svg).toContain(GEO_LABEL_FILL)
      expect(svg).toContain('marker-end="url(#ushapeArrow)"')
      // No redundant right / notch-bottom / double height
      expect(svg).not.toContain('notchBottom')
      const dimLines = [...svg.matchAll(/<line[^>]*marker-end="url\(#ushapeArrow\)"[^>]*\/>/g)]
      // 5 measures × 2 half-lines
      expect(dimLines.length).toBe(10)
    })
  })

  describe('generateCompositeCuboidSvg', () => {
    it('generates L-shaped solid with dimension labels', () => {
      const svg = generateCompositeCuboidSvg({
        length: 10,
        width: 6,
        height: 5,
        cutLength: 4,
        cutWidth: 3,
        lengthLabel: '10 cm',
        widthLabel: '6 cm',
        heightLabel: '5 cm',
        cutLengthLabel: '4 cm',
        cutWidthLabel: '3 cm',
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('<polygon')
      expect(svg).toContain('10 cm')
      expect(svg).toContain('6 cm')
      expect(svg).toContain('5 cm')
      expect(svg).toContain('4 cm')
      expect(svg).toContain('3 cm')
      expect(svg).toContain(GEO_LABEL_FILL)
      expect(svg).not.toContain('stroke-dasharray')
      expect(svg).not.toContain('opacity="0.55"')
      expect(svg).toContain('marker-end="url(#compositeCuboidArrow)"')
      expect(svg).toContain('id="compositeCuboidArrow"')
      // Outward arrow via half-lines + marker-end (tip at +x)
      expect(svg).toMatch(
        /id="compositeCuboidArrow"[\s\S]*?points="0,0 10,5 0,10"/,
      )
      // All 5 measures = Strecke (5×2 half-lines) + Hilfslinien from corners
      const dimLines = [
        ...svg.matchAll(/<line[^>]*marker-end="url\(#compositeCuboidArrow\)"[^>]*\/>/g),
      ]
      expect(dimLines.length).toBe(10)
      // 5 Maße × 2 Hilfslinien (plus one face uses fill opacity 0.85 — match line tags)
      const extLines = [
        ...svg.matchAll(/<line[^>]*opacity="0\.85"[^>]*\/>/g),
      ]
      expect(extLines.length).toBe(10)
      // Height left, depth right (same layout as generateCuboidSvg)
      const heightText = svg.match(/<text x="([^"]+)" y="([^"]+)"[^>]*>5 cm<\/text>/)
      const widthText = svg.match(/<text x="([^"]+)" y="([^"]+)"[^>]*>6 cm<\/text>/)
      expect(heightText).toBeTruthy()
      expect(widthText).toBeTruthy()
      expect(Number(widthText![1])).toBeGreaterThan(Number(heightText![1]) + 40)
      expect(heightText![0]).toContain('text-anchor="end"')
      expect(widthText![0]).toContain('text-anchor="start"')
      expect(Number(heightText![2])).toBeGreaterThan(12)
      expect(Number(widthText![2])).toBeGreaterThan(12)
    })

    it('matches screenshot-like proportions without clipping labels', () => {
      const svg = generateCompositeCuboidSvg({
        length: 8,
        width: 6,
        height: 3,
        cutLength: 4,
        cutWidth: 2,
        lengthLabel: '8 cm',
        widthLabel: '6 cm',
        heightLabel: '3 cm',
        cutLengthLabel: '4 cm',
        cutWidthLabel: '2 cm',
      })
      const widthMatch = /width="(\d+)"/.exec(svg)
      const heightMatch = /height="(\d+)"/.exec(svg)
      expect(widthMatch).toBeTruthy()
      expect(heightMatch).toBeTruthy()
      const svgW = Number(widthMatch![1])
      const svgH = Number(heightMatch![1])
      const heightText = svg.match(
        /<text x="([^"]+)" y="([^"]+)"[^>]*>3 cm<\/text>/,
      )
      const depthText = svg.match(
        /<text x="([^"]+)" y="([^"]+)"[^>]*>6 cm<\/text>/,
      )
      expect(heightText).toBeTruthy()
      expect(depthText).toBeTruthy()
      // Depth Strecke sits to the right of height (no crossing)
      expect(Number(depthText![1])).toBeGreaterThan(Number(heightText![1]) + 40)
      const arrowLines = [
        ...svg.matchAll(
          /<line x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)"[^>]*marker-end="url\(#compositeCuboidArrow\)"[^>]*\/>/g,
        ),
      ]
      const heightHalves = arrowLines.filter((m) => Number(m[1]) === Number(m[3]))
      expect(heightHalves.length).toBe(2)
      const heightX = Number(heightHalves[0][1])
      // Depth halves are the diagonal ones whose endpoints are right of height
      const depthHalves = arrowLines.filter(
        (m) =>
          Number(m[1]) !== Number(m[3]) &&
          Number(m[2]) !== Number(m[4]) &&
          Number(m[1]) > heightX &&
          Number(m[3]) > heightX,
      )
      expect(depthHalves.length).toBeGreaterThanOrEqual(2)
      for (const m of svg.matchAll(
        /<text x="([^"]+)" y="([^"]+)"[^>]*text-anchor="([^"]+)"[^>]*>([^<]*)<\/text>/g,
      )) {
        const x = Number(m[1])
        const y = Number(m[2])
        const anchor = m[3]
        const text = m[4]
        const approxW = Math.max(28, text.length * 7.5)
        const left =
          anchor === 'end' ? x - approxW : anchor === 'middle' ? x - approxW / 2 : x
        const right =
          anchor === 'start' ? x + approxW : anchor === 'middle' ? x + approxW / 2 : x
        expect(left).toBeGreaterThanOrEqual(2)
        expect(right).toBeLessThanOrEqual(svgW - 2)
        expect(y).toBeGreaterThan(10)
        expect(y).toBeLessThan(svgH - 2)
      }
    })
  })

  describe('generateCoordinateGridSvg', () => {
    it('generates a labeled grid with axes and points', () => {
      const svg = generateCoordinateGridSvg({
        xRange: [-1, 5],
        yRange: [-1, 5],
        points: [{ x: 2, y: 3, label: 'P' }],
        polygons: [{ points: [[1, 1], [3, 1], [2, 3]], fill: '#90caf9', stroke: '#1565c0' }],
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('>x</text>')
      expect(svg).toContain('>y</text>')
      expect(svg).toContain('>P</text>')
      expect(svg).toContain('<polygon')
      expect(svg).toContain('<circle')
    })

    it('draws unit tick labels', () => {
      const svg = generateCoordinateGridSvg({
        xRange: [0, 3],
        yRange: [0, 3],
      })
      expect(svg).toContain('>1</text>')
      expect(svg).toContain('>2</text>')
      expect(svg).toContain('>3</text>')
    })

    it('places edge-point labels inward to avoid clipping', () => {
      const svg = generateCoordinateGridSvg({
        xRange: [-2, 4],
        yRange: [-2, 4],
        points: [
          { x: 4, y: 2, label: 'R' },
          { x: 1, y: 4, label: 'T' },
        ],
      })
      expect(svg).toContain('>R</text>')
      expect(svg).toContain('>T</text>')
      expect(svg).toContain('text-anchor="end"')
    })
  })

  describe('generatePointsOnGridSvg', () => {
    it('renders labeled points A, B, C on a grid', () => {
      const svg = generatePointsOnGridSvg({
        points: [
          { x: 2, y: 3, label: 'A' },
          { x: -1, y: 1, label: 'B' },
          { x: 3, y: -2, label: 'C' },
        ],
        xRange: [-5, 8],
        yRange: [-5, 8],
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('>A</text>')
      expect(svg).toContain('>B</text>')
      expect(svg).toContain('>C</text>')
      expect(svg).toContain('>x</text>')
      expect((svg.match(/<circle/g) ?? []).length).toBe(3)
    })

    it('can connect labeled points with a segment', () => {
      const svg = generatePointsOnGridSvg({
        points: [
          { x: 1, y: 1, label: 'A' },
          { x: 5, y: 1, label: 'B' },
        ],
        connectLabels: [['A', 'B']],
        xRange: [-5, 8],
        yRange: [-5, 8],
      })
      expect(svg).toContain('>A</text>')
      expect(svg).toContain('>B</text>')
      expect(svg).toContain('stroke="#1565c0"')
    })
  })

  describe('generateTranslationSvg', () => {
    it('shows original and translated polygons with arrows', () => {
      const svg = generateTranslationSvg({
        points: [[1, 1], [3, 1], [2, 3]],
        dx: 2,
        dy: 1,
        showArrows: true,
        showTranslated: true,
        xRange: [-1, 7],
        yRange: [-1, 6],
      })
      expect(svg).toContain('<svg')
      expect((svg.match(/<polygon/g) ?? []).length).toBeGreaterThanOrEqual(2)
      expect(svg).toContain("F'")
      expect(svg).toContain('transArrow')
      expect(svg).toContain('<line')
    })

    it('can hide the translated figure', () => {
      const svg = generateTranslationSvg({
        points: [[0, 0], [2, 0], [1, 2]],
        dx: 3,
        dy: 2,
        showTranslated: false,
        showArrows: true,
        singleVectorArrow: true,
        xRange: [-1, 6],
        yRange: [-1, 5],
      })
      expect(svg).toContain('<svg')
      expect(svg).not.toContain("F'")
      expect(svg).toContain('transArrow')
    })
  })

  describe('generateSymmetryShapeSvg', () => {
    it('draws a square with four green axes when requested', () => {
      const svg = generateSymmetryShapeSvg({
        shape: 'square',
        showAxes: true,
        showPointOfSymmetry: true,
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('<polygon')
      expect(svg).toContain('#2e7d32')
      expect(svg).toContain('<circle')
      expect(symmetryAxisCount('square')).toBe(4)
      expect((svg.match(/stroke="#2e7d32"/g) ?? []).length).toBe(4)
    })

    it('can show a wrong dashed axis without correct axes', () => {
      const svg = generateSymmetryShapeSvg({
        shape: 'rectangle',
        showAxes: false,
        showWrongAxis: true,
      })
      expect(svg).toContain('stroke-dasharray')
      expect(svg).toContain('#c62828')
      expect(svg).not.toContain('#2e7d32')
      expect(symmetryAxisCount('rectangle')).toBe(2)
      expect(symmetryAxisCount('scaleneTriangle')).toBe(0)
    })
  })

  describe('generateReflectionSvg', () => {
    it('shows original, mirror line s, and image', () => {
      const svg = generateReflectionSvg({
        points: [[1, 1], [3, 1], [2, 3]],
        mirror: 'x-axis',
        showImage: true,
        xRange: [-5, 8],
        yRange: [-5, 8],
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('>s</text>')
      expect((svg.match(/<polygon/g) ?? []).length).toBeGreaterThanOrEqual(2)
      expect(svg).toContain("F'")
      expect(reflectPointAcross([2, 3], 'x-axis')).toEqual([2, -3])
      expect(reflectPointAcross([2, 3], 'y-axis')).toEqual([-2, 3])
      expect(reflectPointAcross([2, 3], 'y=x')).toEqual([3, 2])
    })

    it('can hide the reflected image for find-A tasks', () => {
      const svg = generateReflectionSvg({
        points: [[2, 1], [4, 1], [3, 3]],
        mirror: { type: 'vertical', x: 1 },
        showImage: false,
        xRange: [-5, 8],
        yRange: [-5, 8],
      })
      expect(svg).toContain('>s</text>')
      expect(svg).not.toContain("F'")
      expect(svg).toContain('>A</text>')
      expect(reflectPointAcross([4, 2], { type: 'vertical', x: 1 })).toEqual([-2, 2])
    })
  })

  describe('generatePointReflectionSvg', () => {
    it('shows original, center S, and image', () => {
      const svg = generatePointReflectionSvg({
        points: [[1, 1], [3, 1], [2, 3]],
        center: [0, 0],
        showImage: true,
        xRange: [-5, 8],
        yRange: [-5, 8],
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('>S</text>')
      expect(svg).toContain("F'")
      expect(svg).toContain("A'")
      expect(pointReflectAcross([2, 3], [0, 0])).toEqual([-2, -3])
      expect(pointReflectAcross([1, 2], [2, 1])).toEqual([3, 0])
    })

    it('can hide the image when students must construct it', () => {
      const svg = generatePointReflectionSvg({
        points: [[2, 1], [4, 2], [3, 4]],
        center: [1, 1],
        showImage: false,
        xRange: [-5, 8],
        yRange: [-5, 8],
      })
      expect(svg).toContain('>S</text>')
      expect(svg).toContain('>A</text>')
      expect(svg).not.toContain("F'")
    })
  })

  describe('generateSegmentSvg', () => {
    it('draws labeled segments with scale bar and length label', () => {
      const svg = generateSegmentSvg({
        segments: [{ a: [0, 0], b: [5, 0], labelA: 'A', labelB: 'B' }],
        showLabel: true,
        showScaleBar: true,
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('>A</text>')
      expect(svg).toContain('>B</text>')
      expect(svg).toContain('5 cm')
      expect(svg).toContain('1 cm')
      expect(svg).toContain('<line')
      expect(segmentLength([0, 0], [5, 0])).toBe(5)
    })

    it('hides length labels when measuring', () => {
      const svg = generateSegmentSvg({
        segments: [
          { a: [0, 0], b: [4, 0], labelA: 'A', labelB: 'B' },
          { a: [0, 2], b: [3, 2], labelA: 'C', labelB: 'D' },
        ],
        showLabel: false,
      })
      expect(svg).toContain('>A</text>')
      expect(svg).toContain('>C</text>')
      expect(svg).not.toContain('4 cm')
      expect(svg).not.toContain('3 cm')
    })
  })

  describe('generateSegmentsOnGridSvg', () => {
    it('draws segments on a coordinate grid', () => {
      const svg = generateSegmentsOnGridSvg({
        segments: [{ a: [1, 1], b: [5, 1], labelA: 'A', labelB: 'B' }],
        showSegments: true,
        xRange: [-1, 7],
        yRange: [-1, 5],
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('>A</text>')
      expect(svg).toContain('>B</text>')
      expect(svg).toContain('>x</text>')
      expect(svg).toContain('<line')
      expect(segmentLength([1, 1], [4, 5])).toBe(5) // 3-4-5
    })

    it('can show only points without segment lines', () => {
      const svg = generateSegmentsOnGridSvg({
        segments: [{ a: [2, 2], b: [2, 6], labelA: 'A', labelB: 'B' }],
        showSegments: false,
        xRange: [-1, 8],
        yRange: [-1, 8],
      })
      expect(svg).toContain('>A</text>')
      expect(svg).toContain('<circle')
      // No blue segment stroke when hidden
      expect(svg).not.toContain('stroke="#1565c0"')
    })
  })

  describe('generateRayOrLineSvg', () => {
    it('distinguishes Strecke, Halbgerade and Gerade', () => {
      const strecke = generateRayOrLineSvg({ kind: 'strecke' })
      const ray = generateRayOrLineSvg({ kind: 'halbgerade' })
      const line = generateRayOrLineSvg({ kind: 'gerade' })
      expect(strecke).toContain('<svg')
      expect(strecke).toContain('>A</text>')
      expect(strecke).not.toContain('rayArrow')
      expect(ray).toContain('rayArrow')
      expect(line).toContain('rayArrow')
      expect((line.match(/marker-end/g) ?? []).length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('generateLinearFunctionSvg', () => {
    it('draws the line, slope triangle and intercept', () => {
      const svg = generateLinearFunctionSvg({
        m: 2,
        n: 1,
        points: [{ x: 1, y: 3, label: 'P' }],
        slopeTriangle: { fromX: 0, run: 1, dxLabel: 'Δx=1', dyLabel: 'Δy=2' },
        interceptLabel: 'n=1',
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('>P</text>')
      expect(svg).toContain('Δx=1')
      expect(svg).toContain('Δy=2')
      expect(svg).toContain('n=1')
      expect(svg).toContain('stroke="#1565c0"')
    })

    it('can draw a second line for LGS', () => {
      const svg = generateLinearFunctionSvg({
        m: 1,
        n: 0,
        second: { m: -1, n: 4 },
        interceptLabel: false,
        points: [{ x: 2, y: 2, label: 'S' }],
        xRange: [-5, 5],
        yRange: [-5, 5],
      })
      expect(svg).toContain('>S</text>')
      expect(svg).toContain('stroke="#c62828"')
    })
  })

  describe('generateRightTriangleSvg', () => {
    it('labels legs and hypotenuse with a right-angle mark', () => {
      const svg = generateRightTriangleSvg({
        aLabel: 'a=3',
        bLabel: 'b=4',
        cLabel: 'c=?',
        ask: 'c',
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('a=3')
      expect(svg).toContain('b=4')
      expect(svg).toContain('c=?')
      expect(svg).toContain('<path') // Viertelkreis
      expect(svg).toContain('<circle') // Punkt im rechten Winkel
    })

    it('marks an acute angle for trig tasks', () => {
      const svg = generateRightTriangleSvg({
        aLabel: 'Ank.',
        bLabel: 'Geg.',
        cLabel: 'Hyp.',
        angleDeg: 35,
        angleLabel: 'α',
        ask: 'angle',
      })
      expect(svg).toContain('α')
      expect(svg).toContain('<path') // angle arc
    })
  })

  describe('generateCircleMeasureSvg / generateCylinderSvg', () => {
    it('shows radius and optional diameter', () => {
      const svg = generateCircleMeasureSvg({
        radiusLabel: 'r = 5 cm',
        showDiameter: true,
        diameterLabel: 'd = 10 cm',
      })
      expect(svg).toContain('r = 5 cm')
      expect(svg).toContain('d = 10 cm')
    })

    it('draws a cylinder with r and h', () => {
      const svg = generateCylinderSvg({ radiusLabel: '3 cm', heightLabel: '8 cm' })
      expect(svg).toContain('r = 3 cm')
      expect(svg).toContain('h = 8 cm')
      expect(svg).toContain('<ellipse')
    })
  })

  describe('Gym 10–12 / OS diagram helpers', () => {
    it('draws a parabola with labeled points', () => {
      const svg = generateParabolaSvg({
        a: 1,
        c: 0,
        points: [{ x: 2, y: 4, label: 'P' }],
      })
      expect(svg).toContain('<polyline')
      expect(svg).toContain('>P</text>')
    })

    it('draws a Glücksrad with sector labels', () => {
      const svg = generateSpinnerSvg({ payoffs: ['1€', '2€', '3€', '4€'] })
      expect(svg).toContain('1€')
      expect(svg).toContain('<path')
    })

    it('draws a labeled pie chart with percentages', () => {
      const svg = generatePieChartSvg({
        slices: [
          { value: 40, label: 'Sport' },
          { value: 35, label: 'Musik' },
          { value: 25, label: 'Lesen' },
        ],
      })
      expect(svg).toContain('Sport: 40%')
      expect(svg).toContain('Musik: 35%')
      expect(svg).toContain('<path')
    })

    it('draws a function graph with tangent and shade', () => {
      const svg = generateFunctionGraphSvg({
        f: (x) => x * x,
        tangent: { x0: 1, m: 2, label: 'm=2' },
        shade: { a: 0, b: 2 },
        points: [{ x: 1, y: 1, label: 'P' }],
      })
      expect(svg).toContain('stroke-dasharray')
      expect(svg).toContain('<polygon')
      expect(svg).toContain('m=2')
    })

    it('draws vector arrows', () => {
      const svg = generateVectorArrowsSvg({
        vectors: [
          { x: 3, y: 1, label: 'a' },
          { x: 1, y: 2, label: 'b' },
        ],
      })
      expect(svg).toContain('marker-end')
      expect(svg).toContain('>a</text>')
    })

    it('draws a rectangle on the grid', () => {
      const svg = generateGridRectSvg({
        x: 1,
        y: 1,
        width: 4,
        height: 3,
        widthLabel: 'a=4',
        heightLabel: 'b=3',
      })
      expect(svg).toContain('<polygon')
      expect(svg).toContain('a=4')
    })

    it('builds prism-net choice SVGs', () => {
      const html = generatePrismNetChoicesSvg([
        { kind: 'valid', label: 'A' },
        { kind: 'invalid', label: 'B' },
      ])
      expect(html).toContain('>A</text>')
      expect(html).toContain('>B</text>')
      expect(html).toContain('<rect')
    })

    it('labels crossing angles A/B/C for pick tasks', () => {
      const svg = generateAnglePickSvg({ angleDeg: 55 })
      expect(svg).toContain('>A</text>')
      expect(svg).toContain('>B</text>')
      expect(svg).toContain('>C</text>')
    })

    it('draws labeled prism net for mantel multi-select', () => {
      const svg = generateLabeledPrismNetSvg({})
      expect(svg).toContain('>A</text>')
      expect(svg).toContain('>E</text>')
    })
  })
})
