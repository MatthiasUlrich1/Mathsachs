import { afterEach, describe, expect, it, vi } from 'vitest'
import { IGNORE_KEY, SESSION_DISMISS_KEY } from './constants'
import {
  dismissUpdateForSession,
  ignoreUpdateVersion,
  isUpdateHidden,
} from './ignore'

function memoryStorage(): Storage {
  const map = new Map<string, string>()
  return {
    get length() {
      return map.size
    },
    clear: () => map.clear(),
    getItem: (key: string) => map.get(key) ?? null,
    key: (index: number) => [...map.keys()][index] ?? null,
    removeItem: (key: string) => {
      map.delete(key)
    },
    setItem: (key: string, value: string) => {
      map.set(key, value)
    },
  }
}

describe('update ignore / dismiss', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('hides a version after session dismiss or persistent ignore', () => {
    const local = memoryStorage()
    const session = memoryStorage()
    vi.stubGlobal('localStorage', local)
    vi.stubGlobal('sessionStorage', session)

    expect(isUpdateHidden('0.1.4')).toBe(false)
    dismissUpdateForSession('0.1.4')
    expect(session.getItem(SESSION_DISMISS_KEY)).toBe('0.1.4')
    expect(isUpdateHidden('0.1.4')).toBe(true)
    expect(isUpdateHidden('0.1.5')).toBe(false)

    session.removeItem(SESSION_DISMISS_KEY)
    ignoreUpdateVersion('0.1.4')
    expect(local.getItem(IGNORE_KEY)).toBe('0.1.4')
    expect(isUpdateHidden('0.1.4')).toBe(true)
    expect(isUpdateHidden('0.1.5')).toBe(false)
  })
})
