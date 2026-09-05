import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CLASS_API_NETWORK_MESSAGE, ClassApiError } from './api'
import {
  RATE_COOLDOWN_MS,
  activateCreatedClassCode,
  acknowledgeCreatedListKey,
  completeCreatedListRefresh,
  createdCodesKey,
  decideCreatedListRefresh,
  deleteCreatedClassCode,
  DELETE_STILL_ON_SERVER_NOTICE,
  emptyCreatedRefreshGate,
  isConfirmedMissingClass,
  loadCreatedClassStandings,
  missingClassCodeNotice,
  resetCreatedListRefreshGateForTests,
  takeCreatedListRefresh,
} from './createdList'
import {
  addUser,
  getClassCodeSettings,
  initSharedStorage,
  rememberCreatedClassCode,
  resetSharedStorageForTests,
  setActiveStorageUser,
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

    const { standings, notices, rateLimited } = await loadCreatedClassStandings(
      [row('NETW0001'), row('WAIT0001'), row('RATE0001')],
      { getClass },
      { forgetCreatedClassCode: forget, setActiveClassCode: setActive },
    )

    expect(forget).not.toHaveBeenCalled()
    expect(setActive).not.toHaveBeenCalled()
    expect(notices).toEqual([])
    expect(rateLimited).toBe(true)
    expect(standings['NETW0001']).toEqual({ error: CLASS_API_NETWORK_MESSAGE })
    expect(standings['WAIT0001']).toEqual({
      error: 'Klassencodes sind gerade nicht verfügbar.',
    })
    expect(standings['RATE0001']).toBeUndefined()
  })

  it('refresh 429 does not prune and stops further GETs', async () => {
    const forget = vi.fn()
    const setActive = vi.fn()
    const getClass = vi.fn(async (code: string) => {
      if (code === 'RATE0001') throw rateErr()
      return stats(code)
    })

    const { standings, notices, rateLimited } = await loadCreatedClassStandings(
      [row('RATE0001'), row('ABCD2345'), row('WAIT0001')],
      { getClass },
      { forgetCreatedClassCode: forget, setActiveClassCode: setActive },
    )

    expect(rateLimited).toBe(true)
    expect(forget).not.toHaveBeenCalled()
    expect(notices).toEqual([])
    expect(standings['RATE0001']).toBeUndefined()
    expect(standings['ABCD2345']).toBeUndefined()
    expect(getClass).toHaveBeenCalledTimes(1)
  })
})

describe('deleteCreatedClassCode', () => {
  it('removes the row locally even when DELETE returns 429', async () => {
    const forget = vi.fn()
    const setActive = vi.fn()
    const del = vi.fn(async () => {
      throw rateErr()
    })

    const result = await deleteCreatedClassCode(
      '9WATX7XC',
      { deleteClass: del },
      { forgetCreatedClassCode: forget, setActiveClassCode: setActive },
    )

    expect(forget).toHaveBeenCalledWith('9WATX7XC')
    expect(setActive).not.toHaveBeenCalled()
    expect(del).toHaveBeenCalledWith('9WATX7XC')
    expect(result).toEqual({
      ok: false,
      keptLocal: false,
      notice: DELETE_STILL_ON_SERVER_NOTICE,
    })
  })

  it('treats Worker 404 as already gone after the local remove', async () => {
    const forget = vi.fn()
    const result = await deleteCreatedClassCode(
      '9WATX7XC',
      {
        deleteClass: async () => {
          throw notFound()
        },
      },
      { forgetCreatedClassCode: forget, setActiveClassCode: vi.fn() },
    )
    expect(forget).toHaveBeenCalledWith('9WATX7XC')
    expect(result).toEqual({ ok: true, alreadyGone: true })
  })
})

describe('created list refresh gate', () => {
  beforeEach(() => {
    resetCreatedListRefreshGateForTests()
  })

  it('does not start a new GET loop when storage notifies the same codes', () => {
    const now = 1_000_000
    const key = createdCodesKey([row('ABCD2345'), row('9WATX7XC')])
    expect(takeCreatedListRefresh(key, now)).toBe(true)
    expect(takeCreatedListRefresh(key, now + 10)).toBe(false)
    completeCreatedListRefresh(false, now + 20)
    expect(takeCreatedListRefresh(key, now + 30)).toBe(false)
    expect(takeCreatedListRefresh(key, now + 40, { force: true })).toBe(true)
  })

  it('does not refetch when a code is only removed (delete / 404 prune)', () => {
    const gate = {
      ...emptyCreatedRefreshGate(),
      lastKey: createdCodesKey([row('ABCD2345'), row('9WATX7XC')]),
    }
    const afterDelete = createdCodesKey([row('ABCD2345')])
    expect(decideCreatedListRefresh(afterDelete, 1, gate)).toEqual({
      fetch: false,
      reason: 'same-codes',
    })
  })

  it('blocks further GETs for the cooldown after a 429', () => {
    const now = 5_000
    const key = 'ABCD2345'
    expect(takeCreatedListRefresh(key, now)).toBe(true)
    completeCreatedListRefresh(true, now)
    expect(takeCreatedListRefresh(key, now + 100, { force: true })).toBe(false)
    expect(takeCreatedListRefresh('NEWCODE01', now + 100)).toBe(false)
    expect(takeCreatedListRefresh('NEWCODE01', now + RATE_COOLDOWN_MS + 1)).toBe(true)
  })

  it('storage notify after prune does not retrigger a fetch', () => {
    const keyBoth = createdCodesKey([row('ABCD2345'), row('9WATX7XC')])
    const keyOne = createdCodesKey([row('ABCD2345')])
    expect(takeCreatedListRefresh(keyBoth, 1)).toBe(true)
    completeCreatedListRefresh(false, 2)
    acknowledgeCreatedListKey(keyOne)
    expect(takeCreatedListRefresh(keyOne, 3)).toBe(false)
    expect(takeCreatedListRefresh(keyOne, 4)).toBe(false)
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

  async function readyWithUser(name = 'Ada') {
    vi.stubGlobal('localStorage', memoryStorage())
    vi.stubGlobal('location', { protocol: 'file:' })
    await initSharedStorage()
    addUser(name)
    setActiveStorageUser(name)
  }

  it('optimistic delete on 429 forgets locally and clears active/sendPoints', async () => {
    await readyWithUser()
    rememberCreatedClassCode('9wat-x7xc', '6a')
    setSendClassPoints(true)

    const result = await deleteCreatedClassCode('9WATX7XC', {
      deleteClass: async () => {
        throw rateErr()
      },
    })

    expect(result.ok).toBe(false)
    expect(result).toMatchObject({ keptLocal: false })
    expect(getClassCodeSettings()).toMatchObject({
      created: [],
      activeCode: null,
      sendPoints: false,
    })
    expect(getClassCodeSettings().deletedCodes?.map((row) => row.code)).toEqual(['9WATX7XC'])
  })

  it('refresh/prune on 404 clears the active collect-code and sendPoints', async () => {
    await readyWithUser()
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
    await readyWithUser()
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
    await readyWithUser()
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

  it('refresh 429 does not prune the created row', async () => {
    await readyWithUser()
    rememberCreatedClassCode('abcd-2345', '6a')
    setSendClassPoints(true)

    const { standings, rateLimited } = await loadCreatedClassStandings(
      getClassCodeSettings().created,
      {
        getClass: async () => {
          throw rateErr()
        },
      },
    )

    expect(rateLimited).toBe(true)
    expect(standings['ABCD2345']).toBeUndefined()
    expect(getClassCodeSettings()).toMatchObject({
      created: [{ code: 'ABCD2345', name: '6a' }],
      activeCode: 'ABCD2345',
      sendPoints: true,
    })
  })
})
