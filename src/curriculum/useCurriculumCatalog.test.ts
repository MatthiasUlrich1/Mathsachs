import { afterEach, describe, expect, it } from 'vitest'
import { resetCurriculumMemory, type CurriculumKv } from './install'
import {
  detectAppVersionChange,
  LAST_SEEN_APP_VERSION_KEY,
} from './useCurriculumCatalog'

const memoryKv = (): CurriculumKv => {
  const map = new Map<string, string>()
  return {
    getItem: (key) => (map.has(key) ? map.get(key)! : null),
    setItem: (key, value) => {
      map.set(key, value)
    },
    removeItem: (key) => {
      map.delete(key)
    },
  }
}

afterEach(() => {
  resetCurriculumMemory()
})

describe('detectAppVersionChange', () => {
  it('is false on first launch and stores the version', () => {
    const kv = memoryKv()
    expect(detectAppVersionChange('0.27.7', kv)).toBe(false)
    expect(kv.getItem(LAST_SEEN_APP_VERSION_KEY)).toBe('0.27.7')
  })

  it('is true when the app version changed since last launch', () => {
    const kv = memoryKv()
    kv.setItem(LAST_SEEN_APP_VERSION_KEY, '0.27.6')
    expect(detectAppVersionChange('0.27.7', kv)).toBe(true)
    expect(kv.getItem(LAST_SEEN_APP_VERSION_KEY)).toBe('0.27.7')
  })

  it('is false when the version is unchanged', () => {
    const kv = memoryKv()
    kv.setItem(LAST_SEEN_APP_VERSION_KEY, '0.27.7')
    expect(detectAppVersionChange('0.27.7', kv)).toBe(false)
  })
})
