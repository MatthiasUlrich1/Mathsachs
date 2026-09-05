import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRequire } from 'node:module'
import {
  acknowledgeCreatedListKey,
  completeCreatedListRefresh,
  createdCodesKey,
  deleteCreatedClassCode,
  loadCreatedClassStandings,
  resetCreatedListRefreshGateForTests,
  takeCreatedListRefresh,
} from '../classCode/createdList'
import { ClassApiError } from '../classCode/api'
import {
  addUser,
  forgetCreatedClassCode,
  getClassCodeSettings,
  initSharedStorage,
  rememberCreatedClassCode,
  resetSharedStorageForTests,
  setActiveStorageUser,
} from './storage'
import {
  mergeClassCodes,
  mergeSharedState,
  withForgottenClassCode,
  type ClassCodeSettings,
  type SharedState,
} from './sharedState'

const require = createRequire(import.meta.url)
const store = require('../../electron/sharedStore.cjs') as {
  mergeSharedState: (base: unknown, incoming: unknown) => SharedState
}

const CODE = '9WATX7XC'
const settingsWithCode = (createdAt = 1_000): ClassCodeSettings => ({
  created: [{ code: CODE, name: '6a', createdAt }],
  deletedCodes: [],
  activeCode: CODE,
  sendPoints: true,
})

const adaState = (classCodes: ClassCodeSettings): SharedState => ({
  schemaVersion: 1,
  users: ['Ada'],
  records: {
    Ada: {
      name: 'Ada',
      created: 1,
      stats: {},
      sessions: [],
      classCodes,
    },
  },
})

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

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

describe('merge after class-code delete', () => {
  it('tombstone wins: disk still has the code, incoming delete does not resurrect (TS)', () => {
    const deleted = withForgottenClassCode(settingsWithCode(), CODE, 2_000)
    expect(deleted.created).toEqual([])
    expect(deleted.deletedCodes.map((row) => row.code)).toEqual([CODE])

    const merged = mergeClassCodes(settingsWithCode(), deleted, 2_000)
    expect(merged.created).toEqual([])
    expect(merged.deletedCodes.some((row) => row.code === CODE)).toBe(true)
    expect(merged.activeCode).toBeNull()
    expect(merged.sendPoints).toBe(false)
  })

  it('per-user persist/poll merge does not bring a deleted code back (TS + CJS)', () => {
    const disk = adaState(settingsWithCode())
    const local = adaState(withForgottenClassCode(settingsWithCode(), CODE, 2_000))

    const persistEcho = mergeSharedState(disk, local)
    expect(persistEcho.records.Ada.classCodes?.created).toEqual([])
    expect(persistEcho.records.Ada.classCodes?.deletedCodes.some((row) => row.code === CODE)).toBe(
      true,
    )

    const applyRemote = mergeSharedState(local, persistEcho)
    expect(applyRemote.records.Ada.classCodes?.created).toEqual([])

    const cjsPersist = store.mergeSharedState(disk, local)
    expect(cjsPersist.records.Ada.classCodes?.created).toEqual([])
    const cjsApply = store.mergeSharedState(local, cjsPersist)
    expect(cjsApply.records.Ada.classCodes?.created).toEqual([])

    let cache = local
    let onDisk = disk
    let resurrected = 0
    for (let i = 0; i < 20; i++) {
      const saved = mergeSharedState(onDisk, cache)
      onDisk = saved
      cache = mergeSharedState(cache, saved)
      if (cache.records.Ada.classCodes?.created.some((row) => row.code === CODE)) resurrected++
    }
    expect(resurrected).toBe(0)
    expect(cache.records.Ada.classCodes?.created).toHaveLength(0)
  })

  it('a later recreate (createdAt after deletedAt) drops the tombstone', () => {
    const deleted = withForgottenClassCode(settingsWithCode(1_000), CODE, 2_000)
    const recreated: ClassCodeSettings = {
      created: [{ code: CODE, name: '6a neu', createdAt: 3_000 }],
      deletedCodes: [],
      activeCode: CODE,
      sendPoints: true,
    }
    const merged = mergeClassCodes(deleted, recreated, 3_000)
    expect(merged.created).toEqual([{ code: CODE, name: '6a neu', createdAt: 3_000 }])
    expect(merged.deletedCodes).toEqual([])
    expect(merged.activeCode).toBe(CODE)
  })
})

describe('delete → created empty → no refresh storm', () => {
  beforeEach(() => {
    resetCreatedListRefreshGateForTests()
  })

  afterEach(() => {
    resetSharedStorageForTests()
    vi.unstubAllGlobals()
  })

  it('schedules at most one GET set, then delete stays empty without a second fetch', async () => {
    const row = { code: CODE, name: '6a', createdAt: 1 }
    const before = createdCodesKey([row])
    expect(takeCreatedListRefresh(before, 1_000)).toBe(true)
    completeCreatedListRefresh(false, 1_010)

    const forgotten = withForgottenClassCode(settingsWithCode(1), CODE, 2_000)
    expect(forgotten.created).toHaveLength(0)
    acknowledgeCreatedListKey(createdCodesKey(forgotten.created))

    const merged = mergeSharedState(adaState(settingsWithCode(1)), adaState(forgotten))
    const afterKey = createdCodesKey(merged.records.Ada.classCodes?.created ?? [])
    expect(afterKey).toBe('')

    let fetches = 0
    for (let i = 0; i < 20; i++) {
      if (takeCreatedListRefresh(afterKey, 3_000 + i)) {
        fetches++
        completeCreatedListRefresh(false, 3_000 + i)
      }
    }
    expect(fetches).toBe(0)
    expect(merged.records.Ada.classCodes?.created).toHaveLength(0)
  })

  it('does not GET a tombstoned code even if a stale created row is passed', async () => {
    const getClass = vi.fn(async () => {
      throw new Error('must not GET a deleted code')
    })
    const { standings } = await loadCreatedClassStandings(
      [{ code: CODE, name: '6a', createdAt: 1 }],
      { getClass },
      {
        forgetCreatedClassCode: vi.fn(),
        setActiveClassCode: vi.fn(),
        getDeletedClassCodes: () => [{ code: CODE }],
      },
    )
    expect(getClass).not.toHaveBeenCalled()
    expect(standings).toEqual({})
  })

  it('HTTP /api/state merge after Löschen keeps created length 0', async () => {
    const disk: SharedState = adaState(settingsWithCode())
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const method = (init?.method ?? 'GET').toUpperCase()
      if (method === 'GET') return jsonResponse(disk)
      if (method === 'PUT' && typeof init?.body === 'string') {
        const incoming = JSON.parse(init.body) as SharedState
        const merged = mergeSharedState(disk, incoming)
        disk.users = merged.users
        disk.records = merged.records
        disk.classCodes = merged.classCodes
        return jsonResponse(merged)
      }
      return jsonResponse({ error: 'nope' }, 405)
    })
    vi.stubGlobal('location', { protocol: 'http:' })
    vi.stubGlobal('fetch', fetchMock)

    await initSharedStorage()
    addUser('Ada')
    setActiveStorageUser('Ada')
    rememberCreatedClassCode('9wat-x7xc', '6a')
    await vi.waitFor(() => {
      expect(disk.records.Ada.classCodes?.created.some((row) => row.code === CODE)).toBe(true)
    })

    const result = await deleteCreatedClassCode(CODE, {
      deleteClass: async () => {
        throw new ClassApiError('rate', 'Zu viele Anfragen. Bitte kurz warten.', 429)
      },
    })
    expect(result.ok).toBe(false)
    expect(getClassCodeSettings().created).toHaveLength(0)
    expect(getClassCodeSettings().deletedCodes.some((row) => row.code === CODE)).toBe(true)

    await vi.waitFor(() => {
      expect(disk.records.Ada.classCodes?.created).toEqual([])
    })
    expect(getClassCodeSettings().created).toHaveLength(0)

    resetCreatedListRefreshGateForTests()
    acknowledgeCreatedListKey(createdCodesKey(getClassCodeSettings().created))
    let fetches = 0
    for (let i = 0; i < 20; i++) {
      if (takeCreatedListRefresh(createdCodesKey(getClassCodeSettings().created), 9_000 + i)) {
        fetches++
      }
    }
    expect(fetches).toBe(0)
  })

  it('forgetCreatedClassCode writes a tombstone that local merge honors', async () => {
    vi.stubGlobal('localStorage', memoryStorage())
    vi.stubGlobal('location', { protocol: 'file:' })
    await initSharedStorage()
    addUser('Ada')
    setActiveStorageUser('Ada')
    rememberCreatedClassCode('9wat-x7xc', '6a')
    forgetCreatedClassCode(CODE)
    expect(getClassCodeSettings().created).toHaveLength(0)
    const merged = mergeClassCodes(settingsWithCode(), getClassCodeSettings())
    expect(merged.created).toHaveLength(0)
  })
})
