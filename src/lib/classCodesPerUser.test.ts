import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  addUser,
  getClassCodeSettings,
  initSharedStorage,
  rememberCreatedClassCode,
  resetSharedStorageForTests,
  setActiveStorageUser,
  setSendClassPoints,
} from './storage'
import {
  CLASS_CODES_STORAGE_KEY,
  USERS_STORAGE_KEY,
  emptyClassCodes,
  mergeSharedState,
  migrateSharedClassCodes,
  userRecordKey,
  type SharedState,
} from './sharedState'

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

const emptyUser = (name: string): SharedState['records'][string] => ({
  name,
  created: 1,
  stats: {},
  sessions: [],
})

describe('per-user class codes', () => {
  afterEach(() => {
    resetSharedStorageForTests()
    vi.unstubAllGlobals()
  })

  it('hides Ada’s created code from Ben and resets after switch', async () => {
    vi.stubGlobal('localStorage', memoryStorage())
    vi.stubGlobal('location', { protocol: 'file:' })
    await initSharedStorage()
    addUser('Ada')
    addUser('Ben')
    setActiveStorageUser('Ada')
    rememberCreatedClassCode('abcd-2345', 'Klasse 6a')
    setSendClassPoints(true)

    expect(getClassCodeSettings()).toMatchObject({
      created: [{ code: 'ABCD2345', name: 'Klasse 6a' }],
      activeCode: 'ABCD2345',
      sendPoints: true,
    })
    expect(getClassCodeSettings('Ada').created.map((row) => row.code)).toEqual(['ABCD2345'])
    expect(getClassCodeSettings('Ben')).toEqual(emptyClassCodes())

    setActiveStorageUser('Ben')
    expect(getClassCodeSettings()).toEqual(emptyClassCodes())
    expect(getClassCodeSettings().created.map((row) => row.code)).not.toContain('ABCD2345')
    expect(getClassCodeSettings('Ada').activeCode).toBe('ABCD2345')

    setActiveStorageUser('Ada')
    expect(getClassCodeSettings().activeCode).toBe('ABCD2345')
    expect(getClassCodeSettings().created).toHaveLength(1)
  })

  it('migrates leftover shared classCodes onto the current user once', async () => {
    const local = memoryStorage()
    local.setItem(USERS_STORAGE_KEY, '["Ada","Ben"]')
    local.setItem(userRecordKey('Ada'), JSON.stringify(emptyUser('Ada')))
    local.setItem(userRecordKey('Ben'), JSON.stringify(emptyUser('Ben')))
    local.setItem(
      CLASS_CODES_STORAGE_KEY,
      JSON.stringify({
        created: [{ code: 'AAAA1111', name: '6a', createdAt: 1 }],
        activeCode: 'AAAA1111',
        sendPoints: true,
      }),
    )
    vi.stubGlobal('localStorage', local)
    vi.stubGlobal('location', { protocol: 'file:' })

    setActiveStorageUser('Ben')
    await initSharedStorage()

    expect(getClassCodeSettings('Ben')).toMatchObject({
      created: [{ code: 'AAAA1111', name: '6a' }],
      activeCode: 'AAAA1111',
      sendPoints: true,
    })
    expect(getClassCodeSettings('Ada')).toEqual(emptyClassCodes())
    expect(getClassCodeSettings()).toMatchObject({ activeCode: 'AAAA1111' })
  })

  it('migrates onto the first listed user when no current user is set', () => {
    const migrated = migrateSharedClassCodes({
      schemaVersion: 1,
      users: ['Ada', 'Ben'],
      records: {
        Ada: emptyUser('Ada'),
        Ben: emptyUser('Ben'),
      },
      classCodes: {
        created: [{ code: 'AAAA1111', name: '6a', createdAt: 1 }],
        activeCode: 'AAAA1111',
        sendPoints: true,
      },
    })
    expect(migrated.records.Ada.classCodes?.activeCode).toBe('AAAA1111')
    expect(migrated.records.Ben.classCodes).toBeUndefined()
    expect(migrated.classCodes).toEqual(emptyClassCodes())
  })

  it('does not leak created lists across names on WLAN merge', () => {
    const merged = mergeSharedState(
      {
        schemaVersion: 1,
        users: ['Ada'],
        records: {
          Ada: {
            ...emptyUser('Ada'),
            classCodes: {
              created: [{ code: 'AAAA1111', name: '6a', createdAt: 1 }],
              activeCode: 'AAAA1111',
              sendPoints: true,
            },
          },
        },
      },
      {
        schemaVersion: 1,
        users: ['Ben'],
        records: {
          Ben: {
            ...emptyUser('Ben'),
            classCodes: {
              created: [{ code: 'BBBB2222', name: '6b', createdAt: 2 }],
              activeCode: 'BBBB2222',
              sendPoints: true,
            },
          },
        },
      },
    )
    expect(merged.records.Ada.classCodes?.created.map((row) => row.code)).toEqual(['AAAA1111'])
    expect(merged.records.Ben.classCodes?.created.map((row) => row.code)).toEqual(['BBBB2222'])
    expect(merged.classCodes).toEqual(emptyClassCodes())
  })

  it('keeps a user’s codes when the other side has an empty classCodes field', () => {
    const merged = mergeSharedState(
      {
        schemaVersion: 1,
        users: ['Ada'],
        records: {
          Ada: {
            ...emptyUser('Ada'),
            classCodes: {
              created: [{ code: 'AAAA1111', name: '6a', createdAt: 1 }],
              activeCode: 'AAAA1111',
              sendPoints: true,
            },
          },
        },
      },
      {
        schemaVersion: 1,
        users: ['Ada'],
        records: {
          Ada: {
            ...emptyUser('Ada'),
            classCodes: emptyClassCodes(),
          },
        },
      },
    )
    expect(merged.records.Ada.classCodes).toMatchObject({
      created: [{ code: 'AAAA1111', name: '6a' }],
      activeCode: 'AAAA1111',
      sendPoints: true,
    })
  })
})
