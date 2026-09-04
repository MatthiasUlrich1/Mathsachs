import { describe, expect, it } from 'vitest'
import { compareSemver, isNewerVersion, normalizeVersion } from './semver'

describe('compareSemver', () => {
  it('orders major.minor.patch numerically', () => {
    expect(compareSemver('0.1.4', '0.1.3')).toBe(1)
    expect(compareSemver('0.1.3', '0.1.3')).toBe(0)
    expect(compareSemver('0.1.2', '0.1.3')).toBe(-1)
    expect(compareSemver('1.0.0', '0.9.9')).toBe(1)
  })

  it('ignores a leading v and pre-release suffixes', () => {
    expect(compareSemver('v0.1.4', '0.1.3')).toBe(1)
    expect(compareSemver('0.1.3-beta', '0.1.3')).toBe(0)
    expect(normalizeVersion('v0.1.4')).toBe('0.1.4')
  })
})

describe('isNewerVersion', () => {
  it('treats 0.1.4 as an update over current 0.1.3', () => {
    expect(isNewerVersion('0.1.4', '0.1.3')).toBe(true)
    expect(isNewerVersion('v0.1.4', '0.1.3')).toBe(true)
  })

  it('does not report an update when the tag equals the current version', () => {
    expect(isNewerVersion('0.1.3', '0.1.3')).toBe(false)
    expect(isNewerVersion('v0.1.3', '0.1.3')).toBe(false)
  })

  it('does not report an update when the tag is older than the current version', () => {
    expect(isNewerVersion('0.1.2', '0.1.3')).toBe(false)
    expect(isNewerVersion('v0.1.0', '0.1.3')).toBe(false)
  })
})
