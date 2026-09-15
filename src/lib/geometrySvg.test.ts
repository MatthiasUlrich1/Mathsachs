import { describe, it, expect } from 'vitest'
import {
  generateRectangleSvg,
  generateTriangleSvg,
  generateTriangleAnglesSvg,
  generateQuadAnglesSvg,
  generateCircleSvg,
  generateCuboidSvg,
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
  generateCoordinateGridSvg,
  generatePointsOnGridSvg,
  generateTranslationSvg,
  generateSymmetryShapeSvg,
  generateReflectionSvg,
  generatePointReflectionSvg,
  generateSegmentSvg,
  generateSegmentsOnGridSvg,
  generateRayOrLineSvg,
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
      expect(svg).toMatch(/<path|<polyline/)
    })

    it('uses a right-angle square at 90°', () => {
      const svg = generateTriangleAnglesSvg({
        aLabel: '90°',
        bLabel: '45°',
        cLabel: '45°',
        anglesDeg: [90, 45, 45],
      })
      expect(svg).toContain('<polyline')
      expect(svg).toContain('90°')
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
      expect(svg).toMatch(/<path|<polyline/)
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
    })
  })

  describe('generatePrismVolumeSvg', () => {
    it('shows base area and height labels', () => {
      const svg = generatePrismVolumeSvg({
        baseAreaLabel: '12 cm²',
        heightLabel: '5 cm',
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('G = 12 cm²')
      expect(svg).toContain('h = 5 cm')
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

    it('marks a right angle with a square instead of an arc', () => {
      const svg = generateAngleSvg({
        angle: 90,
        label: '90°',
      })
      expect(svg).toContain('<polyline')
      expect(svg).toContain('90°')
    })
  })

  describe('generateCrossingLinesSvg', () => {
    it('marks nebenwinkel with arcs', () => {
      const svg = generateCrossingLinesSvg({ angleDeg: 70, ask: 'neben' })
      expect(svg).toContain('<svg')
      expect(svg).toContain('70°')
      expect(svg).toContain('?')
      expect(svg).toMatch(/<path|<polyline/)
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
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('<polygon')
      expect(svg).toContain('8 m')
      expect(svg).toContain('6 m')
      expect(svg).toContain('5 m')
      expect(svg).toContain('2 m')
    })
  })

  describe('generateUShapeSvg', () => {
    it('generates U-shape with dimension labels', () => {
      const svg = generateUShapeSvg({
        outerWidth: 10,
        outerHeight: 6,
        notchWidth: 4,
        notchHeight: 3,
        bottomLabel: '10 m',
        leftLabel: '6 m',
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('<polygon')
      expect(svg).toContain('10 m')
      expect(svg).toContain('6 m')
    })
  })

  describe('generateCompositeCuboidSvg', () => {
    it('generates L-shaped solid with dimension labels', () => {
      const svg = generateCompositeCuboidSvg({
        length: 10,
        width: 6,
        height: 4,
        cutLength: 4,
        cutWidth: 3,
        lengthLabel: '10 cm',
        widthLabel: '6 cm',
        heightLabel: '4 cm',
        cutLengthLabel: '4 cm',
        cutWidthLabel: '3 cm',
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('<polygon')
      expect(svg).toContain('10 cm')
      expect(svg).toContain('6 cm')
      expect(svg).toContain('4 cm')
      expect(svg).toContain('3 cm')
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
})
