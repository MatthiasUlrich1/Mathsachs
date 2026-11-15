import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  applyTheme,
  isThemePreference,
  loadThemePreference,
  resolveTheme,
  saveThemePreference,
  THEME_STORAGE_KEY,
} from './theme'

describe('resolveTheme', () => {
  it('follows the system for "system"', () => {
    expect(resolveTheme('system', false)).toBe('heft')
    expect(resolveTheme('system', true)).toBe('tafel')
  })
  it('honours explicit choices regardless of the system', () => {
    expect(resolveTheme('heft', true)).toBe('heft')
    expect(resolveTheme('tafel', false)).toBe('tafel')
  })
})

describe('theme persistence', () => {
  const memory = () => {
    const data = new Map<string, string>()
    return {
      data,
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
    }
  }
  const throwing = {
    getItem: () => {
      throw new Error('blocked')
    },
    setItem: () => {
      throw new Error('blocked')
    },
  }

  it('round-trips a preference under tasktrophy.theme', () => {
    const s = memory()
    saveThemePreference('tafel', s)
    expect(s.data.get('tasktrophy.theme')).toBe('tafel')
    expect(THEME_STORAGE_KEY).toBe('tasktrophy.theme')
    expect(loadThemePreference(s)).toBe('tafel')
  })
  it('defaults to system when empty or invalid', () => {
    const s = memory()
    expect(loadThemePreference(s)).toBe('system')
    s.data.set(THEME_STORAGE_KEY, 'neon')
    expect(loadThemePreference(s)).toBe('system')
    expect(isThemePreference('neon')).toBe(false)
  })
  it('does not throw when storage throws', () => {
    expect(loadThemePreference(throwing)).toBe('system')
    expect(() => saveThemePreference('heft', throwing)).not.toThrow()
  })
})

describe('blocked localStorage global', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('does not throw when reading the localStorage getter throws', () => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('SecurityError')
      },
    })
    try {
      expect(loadThemePreference()).toBe('system')
      expect(() => saveThemePreference('tafel')).not.toThrow()
    } finally {
      delete (globalThis as { localStorage?: unknown }).localStorage
    }
  })
})

describe('applyTheme', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('sets and removes data-theme on the root element', () => {
    const dataset: Record<string, string> = {}
    vi.stubGlobal('document', { documentElement: { dataset } })
    applyTheme('tafel')
    expect(dataset.theme).toBe('tafel')
    applyTheme('heft')
    expect(dataset.theme).toBe('heft')
    applyTheme('system')
    expect('theme' in dataset).toBe(false)
  })
})
