import { describe, expect, it } from 'vitest'
import { resolveAnatomySrc } from './resolveAnatomySrc'

describe('resolveAnatomySrc', () => {
  it('resolves known schnabel schema from logical path', () => {
    const url = resolveAnatomySrc('/anatomy/vogel-schnabel-typen.svg')
    expect(url).toBeTruthy()
    expect(url).not.toBe('/anatomy/vogel-schnabel-typen.svg')
    expect(url.toLowerCase()).toMatch(/vogel-schnabel-typen|data:image/i)
  })

  it('resolves lung schema and trout photo', () => {
    expect(resolveAnatomySrc('/anatomy/saeuger-atemweg-schema.svg')).toMatch(
      /saeuger-atemweg|data:image/i,
    )
    expect(resolveAnatomySrc('/anatomy/oncorhynchus-mykiss-raver.jpg')).toMatch(
      /oncorhynchus|mykiss|raver|assets\//i,
    )
  })

  it('passes through absolute http(s) urls', () => {
    expect(resolveAnatomySrc('https://example.com/a.png')).toBe(
      'https://example.com/a.png',
    )
  })
})
