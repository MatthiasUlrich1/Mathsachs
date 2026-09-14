import { describe, it, expect } from 'vitest'
import {
  generateRectangleSvg,
  generateTriangleSvg,
  generateCircleSvg,
  generateCuboidSvg,
  generateAngleSvg,
  generateFractionCircleSvg,
  generateFractionBarSvg,
  generateFractionGridSvg,
  generateLShapeSvg,
  generateUShapeSvg,
  generateCompositeCuboidSvg,
  generateCoordinateGridSvg,
  generateTranslationSvg,
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
})
