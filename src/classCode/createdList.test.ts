import { afterEach, describe, expect, it, vi } from 'vitest'
import { CLASS_API_NETWORK_MESSAGE, ClassApiError } from './api'
import {
  activateCreatedClassCode,
  isConfirmedMissingClass,
  loadCreatedClassStandings,
  missingClassCodeNotice,
} from './createdList'
import {
  getClassCodeSettings,
  initSharedStorage,
  rememberCreatedClassCode,
  resetSharedStorageForTests,
  setSendClassPoints,
  type CreatedClassCode,
} from '../lib/storage'
import type { ClassStats } from './api'

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

const stats = (code: string, name = 'Klasse 6a'): ClassStats => ({
  code,
  name,
  points: { today: 1, week: 1, month: 1, year: 1, total: 1 },
})

const row = (code: string, name = 'Klasse 6a'): CreatedClassCode => ({
  code,
  name,
  createdAt: 1,
})

const notFound = () =>
  new ClassApiError('not_found', 'Diesen Klassencode gibt es nicht.', 404)

const networkErr = () =>
  new ClassApiError('network', CLASS_API_NETWORK_MESSAGE, 0)

const notReady = () =>
  new ClassApiError('not_ready', 'Klassencodes sind gerade nicht verfügbar.', 0)

const rateErr = () => new ClassApiError('rate', 'Zu viele Anfragen. Bitte kurz warten.', 429)

describe('isConfirmedMissingClass', () => {
  it('is true only for ClassApiError kind not_found', () => {
    expect(isConfirmedMissingClass(notFound())).toBe(true)
    expect(isConfirmedMissingClass(networkErr())).toBe(false)
    expect(isConfirmedMissingClass(notReady())).toBe(false)
    expect(isConfirmedMissingClass(rateErr())).toBe(false)
    expect(isConfirmedMissingClass(new Error('Diesen Klassencode gibt es nicht.'))).toBe(
      false,
    )
  })
})

describe('loadCreatedClassStandings', () => {
  it('prunes a 404 / not_found code and does not keep a standing row', async () => {
    const forget = vi.fn()
    const setActive = vi.fn()
    const getClass = vi.fn(async (code: string) => {
      if (code === '9WATX7XC') throw notFound()
      return stats(code, '7b')
    })

    const { standings, notices } = await loadCreatedClassStandings(
      [row('9WATX7XC', '6a'), row('ABCD2345', '7b')],
      { getClass },
      { forgetCreatedClassCode: forget, setActiveClassCode: setActive },
    )

    expect(forget).toHaveBeenCalledTimes(1)
    expect(forget).toHaveBeenCalledWith('9WATX7XC')
    expect(setActive).not.toHaveBeenCalled()
    expect(standings['9WATX7XC']).toBeUndefined()
    expect(standings['ABCD2345']).toMatchObject({ code: 'ABCD2345', name: '7b' })
    expect(notices).toEqual([missingClassCodeNotice('9WATX7XC')])
    expect(notices[0]).toBe(
      'Der Code 9WAT-X7XC existiert nicht mehr und wurde aus der Liste entfernt.',
    )
  })

  it('keeps the row on network, not_ready and rate errors', async () => {
    const forget = vi.fn()
    const setActive = vi.fn()
    const getClass = vi.fn(async (code: string) => {
      if (code === 'NETW0001') throw networkErr()
      if (code === 'WAIT0001') throw notReady()
      if (code === 'RATE0001') throw rateErr()
      throw new Error('unexpected')
    })

    const { standings, notices } = await loadCreatedClassStandings(
      [row('NETW0001'), row('WAIT0001'), row('RATE0001')],
      { getClass },
      { forgetCreatedClassCode: forget, setActiveClassCode: setActive },
    )

    expect(forget).not.toHaveBeenCalled()
    expect(setActive).not.toHaveBeenCalled()
    expect(notices).toEqual([])
    expect(standings['NETW0001']).toEqual({ error: CLASS_API_NETWORK_MESSAGE })
    expect(standings['WAIT0001']).toEqual({
      error: 'Klassencodes sind gerade nicht verfügbar.',
    })
    expect(standings['RATE0001']).toEqual({
      error: 'Zu viele Anfragen. Bitte kurz warten.',
    })
  })
})

describe('activateCreatedClassCode', () => {
  it('does not keep a missing code: forgets it and never activates', async () => {
    const forget = vi.fn()
    const setActive = vi.fn()
    const getClass = vi.fn(async () => {
      throw notFound()
    })

    const result = await activateCreatedClassCode(
      '9WATX7XC',
      { getClass },
      { forgetCreatedClassCode: forget, setActiveClassCode: setActive },
    )

    expect(result).toEqual({
      ok: false,
      pruned: true,
      notice: missingClassCodeNotice('9WATX7XC'),
    })
    expect(forget).toHaveBeenCalledWith('9WATX7XC')
    expect(setActive).not.toHaveBeenCalled()
  })

  it('activates only after GET succeeds', async () => {
    const forget = vi.fn()
    const setActive = vi.fn()
    const getClass = vi.fn(async (code: string) => stats(code, '6a'))

    const result = await activateCreatedClassCode(
      'ABCD2345',
      { getClass },
      { forgetCreatedClassCode: forget, setActiveClassCode: setActive },
    )

    expect(result).toEqual({ ok: true, stats: stats('ABCD2345', '6a') })
    expect(setActive).toHaveBeenCalledWith('ABCD2345')
    expect(forget).not.toHaveBeenCalled()
  })

  it('keeps the row on a network error and does not activate', async () => {
    const forget = vi.fn()
    const setActive = vi.fn()
    const getClass = vi.fn(async () => {
      throw networkErr()
    })

    const result = await activateCreatedClassCode(
      'ABCD2345',
      { getClass },
      { forgetCreatedClassCode: forget, setActiveClassCode: setActive },
    )

    expect(result).toEqual({
      ok: false,
      pruned: false,
      error: CLASS_API_NETWORK_MESSAGE,
    })
    expect(forget).not.toHaveBeenCalled()
    expect(setActive).not.toHaveBeenCalled()
  })
})

describe('created list + real storage', () => {
  afterEach(() => {
    resetSharedStorageForTests()
    vi.unstubAllGlobals()
  })

  it('refresh/prune on 404 clears the active collect-code and sendPoints', async () => {
    vi.stubGlobal('localStorage', memoryStorage())
    vi.stubGlobal('location', { protocol: 'file:' })
    await initSharedStorage()
    rememberCreatedClassCode('9wat-x7xc', '6a')
    setSendClassPoints(true)
    expect(getClassCodeSettings()).toMatchObject({
      created: [{ code: '9WATX7XC', name: '6a' }],
      activeCode: '9WATX7XC',
      sendPoints: true,
    })

    const { standings, notices } = await loadCreatedClassStandings(
      getClassCodeSettings().created,
      {
        getClass: async () => {
          throw notFound()
        },
      },
    )

    expect(standings).toEqual({})
    expect(notices).toEqual([missingClassCodeNotice('9WATX7XC')])
    expect(getClassCodeSettings()).toMatchObject({
      created: [],
      activeCode: null,
      sendPoints: false,
    })
  })

  it('activate path does not keep a missing code in the created list', async () => {
    vi.stubGlobal('localStorage', memoryStorage())
    vi.stubGlobal('location', { protocol: 'file:' })
    await initSharedStorage()
    rememberCreatedClassCode('9wat-x7xc', '6a')
    setSendClassPoints(true)

    const result = await activateCreatedClassCode('9WATX7XC', {
      getClass: async () => {
        throw notFound()
      },
    })

    expect(result.ok).toBe(false)
    expect(result).toMatchObject({ pruned: true })
    expect(getClassCodeSettings()).toMatchObject({
      created: [],
      activeCode: null,
      sendPoints: false,
    })
  })

  it('network errors keep the created row and the active collect-code', async () => {
    vi.stubGlobal('localStorage', memoryStorage())
    vi.stubGlobal('location', { protocol: 'file:' })
    await initSharedStorage()
    rememberCreatedClassCode('abcd-2345', '6a')
    setSendClassPoints(true)

    const { standings, notices } = await loadCreatedClassStandings(
      getClassCodeSettings().created,
      {
        getClass: async () => {
          throw networkErr()
        },
      },
    )

    expect(notices).toEqual([])
    expect(standings['ABCD2345']).toEqual({ error: CLASS_API_NETWORK_MESSAGE })
    expect(getClassCodeSettings()).toMatchObject({
      created: [{ code: 'ABCD2345', name: '6a' }],
      activeCode: 'ABCD2345',
      sendPoints: true,
    })
  })
})
