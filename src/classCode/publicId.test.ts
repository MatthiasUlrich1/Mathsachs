import { describe, expect, it } from 'vitest'
import { isValidClassCode } from './code'
import { publicIdFromCode } from './publicId'

describe('publicIdFromCode', () => {
  it('is stable, prefixed, and never a secret Klassencode', () => {
    expect(publicIdFromCode('AAAA1111')).toBe(publicIdFromCode('AAAA1111'))
    expect(publicIdFromCode('AAAA1111')).toMatch(/^n[0-9a-f]{8}$/)
    expect(isValidClassCode(publicIdFromCode('AAAA1111'))).toBe(false)
    expect(publicIdFromCode('AAAA1111')).not.toBe(publicIdFromCode('BBBB2222'))
  })
})
