import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  addUser,
  getSharedStorageBackendForTests,
  initSharedStorage,
  listUsers,
  loadUser,
  recordSession,
  resetSharedStorageForTests,
} from './storage'
import { USERS_STORAGE_KEY, userRecordKey, type SharedState } from './sharedState'

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

function htmlResponse(): Response {
  return new Response('<!doctype html><title>Vite</title>', {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

const empty: SharedState = { schemaVersion: 1, users: [], records: {} }

describe('storage adapter', () => {
  afterEach(() => {
    resetSharedStorageForTests()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('falls back to localStorage when /api/state is missing (plain Vite)', async () => {
    const local = memoryStorage()
    vi.stubGlobal('localStorage', local)
    vi.stubGlobal('location', { protocol: 'http:' })
    vi.stubGlobal('fetch', vi.fn(async () => htmlResponse()))

    await initSharedStorage()
    expect(getSharedStorageBackendForTests()).toBe('local')
    addUser('Ada')
    expect(listUsers()).toEqual(['Ada'])
    await vi.waitFor(() => {
      expect(JSON.parse(local.getItem(USERS_STORAGE_KEY) ?? '[]')).toEqual(['Ada'])
    })
    expect(local.getItem(userRecordKey('Ada'))).toContain('Ada')
  })

  it('uses GET/PUT /api/state on an HTTP origin when the API exists', async () => {
    const server: SharedState = {
      schemaVersion: 1,
      users: ['Ada'],
      records: {
        Ada: { name: 'Ada', created: 1, stats: {}, sessions: [] },
      },
    }
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const method = (init?.method ?? 'GET').toUpperCase()
      if (method === 'GET') return jsonResponse(server)
      if (method === 'PUT' && typeof init?.body === 'string') {
        const incoming = JSON.parse(init.body) as SharedState
        server.users = incoming.users
        server.records = incoming.records
        return jsonResponse(server)
      }
      return jsonResponse({ error: 'nope' }, 405)
    })
    vi.stubGlobal('location', { protocol: 'http:' })
    vi.stubGlobal('fetch', fetchMock)

    await initSharedStorage()
    expect(getSharedStorageBackendForTests()).toBe('http')
    expect(listUsers()).toEqual(['Ada'])

    addUser('Ben')
    expect(listUsers()).toEqual(['Ada', 'Ben'])
    await vi.waitFor(() => {
      expect(server.users).toEqual(['Ada', 'Ben'])
    })
    expect(
      fetchMock.mock.calls.some(
        (call) => String(call[0]).includes('/api/state') && call[1]?.method === 'PUT',
      ),
    ).toBe(true)
  })

  it('uses the desktop IPC bridge when preload is present', async () => {
    const fileState: SharedState = { ...empty }
    const mathsachs = {
      isDesktop: true as const,
      loadSharedState: vi.fn(async () => fileState),
      saveSharedState: vi.fn(async (next: SharedState) => {
        fileState.users = next.users
        fileState.records = next.records
        return { ...fileState }
      }),
      migrateSharedState: vi.fn(async (snapshot: Record<string, string>) => {
        if (snapshot[USERS_STORAGE_KEY]) {
          fileState.users = JSON.parse(snapshot[USERS_STORAGE_KEY]) as string[]
        }
        return { ...fileState }
      }),
      onSharedState: vi.fn(() => () => undefined),
    }
    const local = memoryStorage()
    local.setItem(USERS_STORAGE_KEY, '["Ada"]')
    vi.stubGlobal('localStorage', local)
    vi.stubGlobal('window', { mathsachs })

    await initSharedStorage()
    expect(getSharedStorageBackendForTests()).toBe('ipc')
    expect(mathsachs.migrateSharedState).toHaveBeenCalled()
    expect(listUsers()).toEqual(['Ada'])

    recordSession('Ada', {
      topicId: 'brueche',
      topicTitle: 'Brüche',
      areaTitle: 'Zahlen',
      attempts: 10,
      correct: 8,
      points: 16,
    })
    expect(loadUser('Ada').stats.brueche.points).toBe(16)
    await vi.waitFor(() => {
      expect(fileState.records.Ada?.stats.brueche.points).toBe(16)
    })
  })
})
