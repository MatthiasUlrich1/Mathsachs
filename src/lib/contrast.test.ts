import { describe, expect, it } from 'vitest'
import { contrastRatio, parseHex } from './contrast'

describe('contrastRatio', () => {
  it('black on white is 21:1', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5)
  })
  it('is symmetric and 1:1 for equal colours', () => {
    expect(contrastRatio('#1d3fa8', '#fbfcfe')).toBeCloseTo(contrastRatio('#fbfcfe', '#1d3fa8'), 10)
    expect(contrastRatio('#777777', '#777777')).toBeCloseTo(1, 10)
  })
  it('rejects invalid hex', () => {
    expect(() => parseHex('red')).toThrow()
  })
})
