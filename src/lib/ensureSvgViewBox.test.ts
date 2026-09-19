import { describe, expect, it } from 'vitest'
import { ensureSvgViewBox } from './ensureSvgViewBox'

describe('ensureSvgViewBox', () => {
  it('adds viewBox from numeric width/height', () => {
    const out = ensureSvgViewBox(
      '<svg width="366" height="261" xmlns="http://www.w3.org/2000/svg"><circle r="1"/></svg>',
    )
    expect(out).toContain('viewBox="0 0 366 261"')
    expect(out).toContain('width="366"')
    expect(out).toContain('height="261"')
    expect(out).toContain('<circle r="1"/>')
  })

  it('leaves existing viewBox unchanged', () => {
    const src =
      '<svg width="100" height="50" viewBox="0 0 100 50"><rect width="10" height="10"/></svg>'
    expect(ensureSvgViewBox(src)).toBe(src)
  })

  it('skips percentage sizes', () => {
    const src = '<svg width="100%" height="100%"><rect/></svg>'
    expect(ensureSvgViewBox(src)).toBe(src)
  })

  it('returns non-svg html unchanged', () => {
    expect(ensureSvgViewBox('<div>hi</div>')).toBe('<div>hi</div>')
  })
})
