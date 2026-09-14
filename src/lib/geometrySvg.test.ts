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
})
