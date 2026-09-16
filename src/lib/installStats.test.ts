import { afterEach, describe, expect, it, vi } from 'vitest'
import { CLASS_POINTS_API } from '../classCode/api'
import {
  INSTALL_COUNTED_KEY,
  fetchInstallCount,
  reportFirstInstall,
} from './installStats'

const memoryStorage = (): Storage => {
  const map = new Map<string, string>()
  return {
    get length() {
      return map.size
    },
    clear: () => map.clear(),
    getItem: (key) => (map.has(key) ? map.get(key)! : null),
    setItem: (key, value) => {
      map.set(key, String(value))
    },
    removeItem: (key) => {
      map.delete(key)
    },
    key: (index) => [...map.keys()][index] ?? null,
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('installStats', () => {
  it('reads the anonymous install count', async () => {
    const fetchImpl = vi.fn(async () =>
      Response.json({ count: 12 }),
    ) as unknown as typeof fetch
    await expect(fetchInstallCount(fetchImpl)).resolves.toBe(12)
    expect(fetchImpl).toHaveBeenCalledWith(`${CLASS_POINTS_API}/stats/install`, {
      cache: 'no-store',
    })
  })

  it('posts +1 once per device and sets the local flag', async () => {
    const storage = memoryStorage()
    const fetchImpl = vi.fn(async () =>
      Response.json({ count: 1 }),
    ) as unknown as typeof fetch
    await expect(reportFirstInstall({ fetchImpl, storage })).resolves.toBe(1)
    expect(storage.getItem(INSTALL_COUNTED_KEY)).toBe('1')
    expect(fetchImpl).toHaveBeenCalledTimes(1)

    await expect(reportFirstInstall({ fetchImpl, storage })).resolves.toBe(null)
    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })
})
