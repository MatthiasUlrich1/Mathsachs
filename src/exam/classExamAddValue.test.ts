import { describe, expect, it } from 'vitest'
import { resolveAddClassValue } from './classExamAddValue'

describe('resolveAddClassValue', () => {
  it('keeps a still-available stored selection', () => {
    expect(resolveAddClassValue('BBBB', ['AAAA', 'BBBB'])).toBe('BBBB')
  })

  it('falls back when stored is empty (after assign)', () => {
    expect(resolveAddClassValue('', ['CCCC'])).toBe('CCCC')
    expect(resolveAddClassValue(undefined, ['CCCC'])).toBe('CCCC')
  })

  it('falls back when stored class is already assigned', () => {
    expect(resolveAddClassValue('AAAA', ['BBBB', 'CCCC'])).toBe('BBBB')
  })

  it('returns empty when nothing is available', () => {
    expect(resolveAddClassValue('AAAA', [])).toBe('')
  })
})
