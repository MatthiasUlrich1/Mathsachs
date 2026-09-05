import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  addUser,
  buildProtocol,
  getClassCodeSettings,
  getSharedStorageBackendForTests,
  getUserRole,
  initSharedStorage,
  listUsers,
  loadUser,
  recordSession,
  rememberCreatedClassCode,
  rememberJoinedClassCode,
  forgetCreatedClassCode,
  resetSharedStorageForTests,
  setActiveStorageUser,
  setSendClassPoints,
  setUserRole,
  saveUser,
  activeClassDisplayName,
} from './storage'
import { CLASS_POINTS_API } from '../classCode/api'
import {
  USERS_STORAGE_KEY,
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
    expect(loadUser('Ada').role).toBe('schueler')
    await vi.waitFor(() => {
      expect(JSON.parse(local.getItem(USERS_STORAGE_KEY) ?? '[]')).toEqual(['Ada'])
    })
    expect(local.getItem(userRecordKey('Ada'))).toContain('Ada')
    expect(local.getItem(userRecordKey('Ada'))).toContain('schueler')
  })

  it('persists the role passed to addUser and setUserRole', async () => {
    const local = memoryStorage()
    vi.stubGlobal('localStorage', local)
    vi.stubGlobal('location', { protocol: 'http:' })
    vi.stubGlobal('fetch', vi.fn(async () => htmlResponse()))

    await initSharedStorage()
    addUser('Ben', 'lehrer')
    expect(loadUser('Ben').role).toBe('lehrer')
    expect(getUserRole('Ben')).toBe('lehrer')
    setUserRole('Ben', 'eltern')
    expect(loadUser('Ben').role).toBe('eltern')
    expect(getUserRole('Ben')).toBe('eltern')
    await vi.waitFor(() => {
      expect(local.getItem(userRecordKey('Ben'))).toContain('eltern')
    })
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

  it('POSTs a class-point delta when collect is opted in (does not block)', async () => {
    const local = memoryStorage()
    vi.stubGlobal('localStorage', local)
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(String(input)).toBe(`${CLASS_POINTS_API}/classes/ABCD2345/points`)
      expect(init?.method).toBe('POST')
      expect(JSON.parse(String(init?.body))).toEqual({ delta: 6 })
      return jsonResponse({
        code: 'ABCD2345',
        name: '6a',
        points: { today: 6, week: 6, month: 6, year: 6, total: 6 },
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    await initSharedStorage()
    expect(getSharedStorageBackendForTests()).toBe('local')
    addUser('Ada')
    setActiveStorageUser('Ada')
    rememberCreatedClassCode('abcd-2345', 'Klasse 6a')
    setSendClassPoints(true)
    expect(getClassCodeSettings()).toMatchObject({
      activeCode: 'ABCD2345',
      sendPoints: true,
    })
    forgetCreatedClassCode('ABCD2345')
    expect(getClassCodeSettings()).toMatchObject({
      created: [],
      activeCode: null,
      sendPoints: false,
    })
    rememberCreatedClassCode('abcd-2345', 'Klasse 6a')
    setSendClassPoints(true)
    expect(getClassCodeSettings()).toMatchObject({
      activeCode: 'ABCD2345',
      sendPoints: true,
    })
    await vi.waitFor(() => {
      expect(local.getItem(userRecordKey('Ada'))).toContain('ABCD2345')
    })

    recordSession('Ada', {
      topicId: 'brueche',
      topicTitle: 'Brüche',
      areaTitle: 'Zahlen',
      attempts: 3,
      correct: 3,
      points: 6,
    })
    expect(loadUser('Ada').stats.brueche.points).toBe(6)
    const logged = loadUser('Ada').classTransfers ?? []
    expect(logged).toHaveLength(1)
    expect(logged[0]).toMatchObject({
      code: 'ABCD2345',
      className: 'Klasse 6a',
      points: 6,
    })
    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalled()
    })
  })

  it('does not log a class transfer when collect is off', async () => {
    const local = memoryStorage()
    vi.stubGlobal('localStorage', local)
    vi.stubGlobal('fetch', vi.fn(async () => htmlResponse()))

    await initSharedStorage()
    addUser('Ada')
    setActiveStorageUser('Ada')
    rememberCreatedClassCode('abcd-2345', 'Klasse 6a')
    recordSession('Ada', {
      topicId: 'brueche',
      topicTitle: 'Brüche',
      areaTitle: 'Zahlen',
      attempts: 3,
      correct: 3,
      points: 6,
    })
    expect(loadUser('Ada').classTransfers).toEqual([])
  })

  it('still logs a transfer when the class POST fails later', async () => {
    const local = memoryStorage()
    vi.stubGlobal('localStorage', local)
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse({ error: 'offline' }, 503)),
    )

    await initSharedStorage()
    addUser('Ada')
    setActiveStorageUser('Ada')
    rememberCreatedClassCode('abcd-2345', 'Klasse 6a')
    setSendClassPoints(true)
    recordSession('Ada', {
      topicId: 'brueche',
      topicTitle: 'Brüche',
      areaTitle: 'Zahlen',
      attempts: 2,
      correct: 2,
      points: 4,
    })
    expect(loadUser('Ada').classTransfers?.[0]).toMatchObject({
      code: 'ABCD2345',
      points: 4,
    })
  })

  it('shows a joined Worker class name in the badge and protocol, not the code', async () => {
    const local = memoryStorage()
    vi.stubGlobal('localStorage', local)
    vi.stubGlobal('fetch', vi.fn(async () => htmlResponse()))

    await initSharedStorage()
    addUser('Test', 'schueler')
    setActiveStorageUser('Test')
    rememberJoinedClassCode('8G4Y-0CV6', '6/6')
    setSendClassPoints(true)

    expect(getUserRole('Test')).toBe('schueler')
    expect(getClassCodeSettings().created).toEqual([])
    expect(getClassCodeSettings().known).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: '8G4Y0CV6', name: '6/6' })]),
    )
    expect(activeClassDisplayName()).toBe('6/6')
    expect(activeClassDisplayName()).not.toContain('8G4Y')

    recordSession('Test', {
      topicId: 'brueche',
      topicTitle: 'Brüche',
      areaTitle: 'Zahlen',
      attempts: 3,
      correct: 3,
      points: 30,
    })
    expect(loadUser('Test').classTransfers?.[0]).toMatchObject({
      code: '8G4Y0CV6',
      className: '6/6',
      points: 30,
    })
    const protocol = buildProtocol('Test')
    expect(protocol.transfers.byClass[0].label).toBe('6/6')
    expect(protocol.transfers.byClass[0].label).not.toBe('8G4Y-0CV6')
  })

  it('builds protocol period totals from local sessions and transfers', async () => {
    const local = memoryStorage()
    vi.stubGlobal('localStorage', local)
    vi.stubGlobal('fetch', vi.fn(async () => htmlResponse()))
    await initSharedStorage()

    const now = Date.UTC(2026, 8, 4, 10, 0, 0)
    const at = (iso: string) => {
      const [y, m, d] = iso.split('-').map(Number)
      return Date.UTC(y, m - 1, d, 10, 0, 0)
    }
    saveUser({
      name: 'Ada',
      created: 1,
      stats: {
        brueche: {
          topicId: 'brueche',
          topicTitle: 'Brüche',
          areaTitle: 'Zahlen',
          attempts: 2,
          correct: 2,
          points: 8,
          lastPracticed: now,
        },
      },
      sessions: [
        {
          date: at('2026-09-04'),
          topicId: 'brueche',
          topicTitle: 'Brüche',
          areaTitle: 'Zahlen',
          attempts: 1,
          correct: 1,
          points: 5,
        },
        {
          date: at('2026-09-01'),
          topicId: 'brueche',
          topicTitle: 'Brüche',
          areaTitle: 'Zahlen',
          attempts: 1,
          correct: 1,
          points: 3,
        },
      ],
      classTransfers: [
        {
          date: at('2026-09-04'),
          code: 'AAAA1111',
          className: 'Klasse 6a',
          points: 5,
        },
        {
          date: at('2026-08-20'),
          code: 'BBBB2222',
          className: 'Klasse 6b',
          points: 7,
        },
      ],
    })

    const protocol = buildProtocol('Ada', now)
    expect(protocol.period.today).toBe(5)
    expect(protocol.period.week).toBe(8)
    expect(protocol.period.total).toBe(8)
    expect(protocol.transfers.summary.total).toBe(12)
    expect(protocol.transfers.summary.year).toBe(12)
    expect(protocol.transfers.byClass.map((row) => row.code)).toEqual([
      'BBBB2222',
      'AAAA1111',
    ])
  })
})
