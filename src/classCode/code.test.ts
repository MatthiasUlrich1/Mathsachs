import { describe, expect, it } from 'vitest'
import {
  CLASS_CODE_ALPHABET,
  CLASS_CODE_LENGTH,
  formatClassCode,
  generateClassCode,
  isValidClassCode,
  normalizeClassCode,
} from './code'

describe('normalizeClassCode', () => {
  it('trims, uppercases and strips separators', () => {
    expect(normalizeClassCode('  abcd-2345  ')).toBe('ABCD2345')
    expect(normalizeClassCode('abcd_2345')).toBe('ABCD2345')
  })

  it('maps ambiguous Crockford glyphs', () => {
    expect(normalizeClassCode('iloU-iloU')).toBe('110110')
    expect(normalizeClassCode('o0il')).toBe('0011')
  })

  it('drops characters outside the alphabet', () => {
    expect(normalizeClassCode('AB*CD!23')).toBe('ABCD23')
  })
})

describe('isValidClassCode / formatClassCode', () => {
  it('accepts 8 Crockford characters after normalize', () => {
    expect(isValidClassCode('abcd-2345')).toBe(true)
    expect(isValidClassCode('abcd234')).toBe(false)
    expect(isValidClassCode('')).toBe(false)
  })

  it('formats as XXXX-XXXX', () => {
    expect(formatClassCode('abcd2345')).toBe('ABCD-2345')
    expect(formatClassCode('short')).toBe('SH0RT')
  })
})

describe('generateClassCode', () => {
  it('returns 8 alphabet characters from the supplied bytes', () => {
    const bytes = Uint8Array.from({ length: CLASS_CODE_LENGTH }, (_, i) => i)
    const code = generateClassCode(() => bytes)
    expect(code).toHaveLength(CLASS_CODE_LENGTH)
    expect([...code].every((ch) => CLASS_CODE_ALPHABET.includes(ch))).toBe(true)
    expect(isValidClassCode(code)).toBe(true)
  })
})
