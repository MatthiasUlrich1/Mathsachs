import { describe, expect, it } from 'vitest'
import {
  CLASS_CODE_ALPHABET,
  CLASS_CODE_LENGTH,
  displayClassName,
  formatClassCode,
  generateClassCode,
  isValidClassCode,
  normalizeClassCode,
  publicClassLabel,
  resolveKnownClassName,
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

  it('prefers a class name and falls back to the formatted code', () => {
    expect(displayClassName('Klasse 6a', 'ABCD2345')).toBe('Klasse 6a')
    expect(displayClassName('  ', 'ABCD2345')).toBe('ABCD-2345')
    expect(displayClassName(undefined, 'ABCD2345')).toBe('ABCD-2345')
  })
})

describe('publicClassLabel / resolveKnownClassName', () => {
  it('returns the class name for badge and protocol, never the formatted code', () => {
    expect(publicClassLabel('6/6')).toBe('6/6')
    expect(publicClassLabel('  Klasse 6a  ')).toBe('Klasse 6a')
    expect(publicClassLabel('')).toBeNull()
    expect(publicClassLabel('   ')).toBeNull()
    expect(publicClassLabel(undefined)).toBeNull()
    expect(publicClassLabel(null)).toBeNull()
  })

  it('resolves a Worker name cached on an entered (joined) class', () => {
    const name = resolveKnownClassName(
      [],
      [{ code: '8G4Y0CV6', name: '6/6' }],
      '8G4Y-0CV6',
    )
    expect(name).toBe('6/6')
    expect(publicClassLabel(name)).toBe('6/6')
    expect(name).not.toContain('8G4Y')
    expect(publicClassLabel(name)).not.toBe(formatClassCode('8G4Y0CV6'))
  })

  it('prefers a created-list name over the joined cache', () => {
    expect(
      resolveKnownClassName(
        [{ code: '8G4Y0CV6', name: '6/6' }],
        [{ code: '8G4Y0CV6', name: 'alt' }],
        '8G4Y0CV6',
      ),
    ).toBe('6/6')
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
