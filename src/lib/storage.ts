import { addClassPoints } from '../classCode/api'
import { normalizeClassCode } from '../classCode/code'
import {
  CLASS_CODES_STORAGE_KEY,
  SHARED_STATE_SCHEMA_VERSION,
  USERS_STORAGE_KEY,
  cloneSharedState,
  collectLocalStorageSnapshot,
  emptyClassCodes,
  emptySharedState,
  looksLikeSharedState,
  mergeSharedState,
  parseClassCodes,
  sharedStateFingerprint,
  userRecordKey,
  type ClassCodeSettings,
  type SharedState,
  type UserData,
} from './sharedState'

export type {
  ClassCodeSettings,
  CreatedClassCode,
  SessionRecord,
  SharedState,
  TopicStat,
  UserData,
} from './sharedState'

const MAX_SESSIONS = 200
const POLL_MS = 1500

type StorageBackend = 'ipc' | 'http' | 'local'

const canUseLocalStorage = (): boolean => {
  try {
    return typeof localStorage !== 'undefined'
  } catch {
    return false
  }
}

const freshUser = (name: string): UserData => ({
  name,
  created: Date.now(),
  stats: {},
  sessions: [],
})

const readLocalState = (): SharedState => {
  const state = emptySharedState()
  if (!canUseLocalStorage()) return state
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    const names = raw ? (JSON.parse(raw) as string[]) : []
    if (Array.isArray(names)) state.users = names.filter((n) => typeof n === 'string')
  } catch {
    state.users = []
  }
  for (const name of state.users) {
    try {
      const raw = localStorage.getItem(userRecordKey(name))
      if (raw) state.records[name] = JSON.parse(raw) as UserData
      else state.records[name] = freshUser(name)
    } catch {
      state.records[name] = freshUser(name)
    }
  }
  try {
    const raw = localStorage.getItem(CLASS_CODES_STORAGE_KEY)
    if (raw) state.classCodes = parseClassCodes(JSON.parse(raw))
  } catch {
    state.classCodes = emptyClassCodes()
  }
  return state
}

const writeLocalState = (state: SharedState): void => {
  if (!canUseLocalStorage()) return
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(state.users))
  localStorage.setItem(
    CLASS_CODES_STORAGE_KEY,
    JSON.stringify(state.classCodes ?? emptyClassCodes()),
  )
  const keep = new Set(state.users.map((name) => userRecordKey(name)))
  keep.add(USERS_STORAGE_KEY)
  keep.add(CLASS_CODES_STORAGE_KEY)
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i)
    if (!key) continue
    if (key === USERS_STORAGE_KEY) continue
    if (key.startsWith('mathsachs.user.') && key.endsWith('.v1') && !keep.has(key)) {
      localStorage.removeItem(key)
    }
  }
  for (const name of state.users) {
    const data = state.records[name] ?? freshUser(name)
    localStorage.setItem(userRecordKey(name), JSON.stringify(data))
  }
}

const desktopBridge = () =>
  typeof window !== 'undefined' ? window.mathsachs : undefined

const isHttpOrigin = (): boolean => {
  try {
    return typeof location !== 'undefined' && /^https?:$/i.test(location.protocol)
  } catch {
    return false
  }
}

const isRecordMap = (value: unknown): value is Record<string, UserData> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const parseStateResponse = async (res: Response): Promise<SharedState | null> => {
  if (!res.ok) return null
  const type = res.headers.get('content-type') || ''
  if (!type.includes('application/json')) return null
  try {
    const data: unknown = await res.json()
    if (!looksLikeSharedState(data)) return null
    const records = isRecordMap(data.records) ? data.records : {}
    return {
      schemaVersion:
        typeof data.schemaVersion === 'number'
          ? data.schemaVersion
          : SHARED_STATE_SCHEMA_VERSION,
      migratedLocalStorage: Boolean(data.migratedLocalStorage),
      users: Array.isArray(data.users)
        ? data.users.filter((n): n is string => typeof n === 'string')
        : Object.keys(records),
      records,
      classCodes: parseClassCodes(data.classCodes),
    }
  } catch {
    return null
  }
}

const fetchHttpState = async (): Promise<SharedState | null> => {
  const res = await fetch('/api/state', {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })
  return parseStateResponse(res)
}

const putHttpState = async (state: SharedState): Promise<SharedState | null> => {
  const res = await fetch('/api/state', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      schemaVersion: SHARED_STATE_SCHEMA_VERSION,
      users: state.users,
      records: state.records,
      classCodes: state.classCodes ?? emptyClassCodes(),
    }),
  })
  return parseStateResponse(res)
}

let cache: SharedState = emptySharedState()
let ready = false
let backend: StorageBackend = 'local'
let initPromise: Promise<void> | null = null
let pollTimer: ReturnType<typeof setInterval> | null = null
let persistChain: Promise<void> = Promise.resolve()
let unsubIpc: (() => void) | null = null
const listeners = new Set<() => void>()

const notify = (): void => {
  for (const listener of listeners) listener()
}

const applyRemote = (next: SharedState): boolean => {
  const merged = mergeSharedState(cache, next)
  if (sharedStateFingerprint(cache) === sharedStateFingerprint(merged)) return false
  cache = cloneSharedState(merged)
  notify()
  return true
}

const detectBackend = async (): Promise<StorageBackend> => {
  const desktop = desktopBridge()
  if (desktop) return 'ipc'
  if (!isHttpOrigin()) return 'local'
  try {
    const remote = await fetchHttpState()
    if (remote) return 'http'
  } catch {
    // Vite without Electron has no /api/state (often serves index.html).
  }
  return 'local'
}

const loadFromBackend = async (): Promise<SharedState> => {
  if (backend === 'ipc') {
    const desktop = desktopBridge()
    if (!desktop) return emptySharedState()
    return desktop.loadSharedState()
  }
  if (backend === 'http') {
    const remote = await fetchHttpState()
    return remote ?? cache
  }
  return readLocalState()
}

const persistToBackend = async (state: SharedState): Promise<SharedState> => {
  if (backend === 'ipc') {
    const desktop = desktopBridge()
    if (!desktop) return state
    return desktop.saveSharedState(state)
  }
  if (backend === 'http') {
    const remote = await putHttpState(state)
    return remote ?? state
  }
  writeLocalState(state)
  return state
}

const persistCache = (): Promise<void> => {
  const snapshot = cloneSharedState(cache)
  persistChain = persistChain
    .then(async () => {
      const saved = await persistToBackend(snapshot)
      if (sharedStateFingerprint(cache) === sharedStateFingerprint(snapshot)) {
        applyRemote(saved)
      }
    })
    .catch(() => {
      // Keep the in-memory cache; the next write or poll retries.
    })
  return persistChain
}

const startPolling = (): void => {
  if (pollTimer || backend === 'local') return
  pollTimer = setInterval(() => {
    void loadFromBackend()
      .then((next) => {
        applyRemote(next)
      })
      .catch(() => {
        // stay on cache until the next tick
      })
  }, POLL_MS)
  if (typeof pollTimer === 'object' && pollTimer && 'unref' in pollTimer) {
    pollTimer.unref()
  }
}

const stopPolling = (): void => {
  if (!pollTimer) return
  clearInterval(pollTimer)
  pollTimer = null
}

/**
 * Hydrate the in-memory cache from IPC, `/api/state`, or localStorage.
 * Safe to call more than once; concurrent callers share one promise.
 */
export const initSharedStorage = (): Promise<void> => {
  if (initPromise) return initPromise
  initPromise = (async () => {
    backend = await detectBackend()
    cache = await loadFromBackend()
    if (backend === 'ipc') {
      const desktop = desktopBridge()
      if (desktop) {
        const snapshot = collectLocalStorageSnapshot(
          canUseLocalStorage() ? localStorage : undefined,
        )
        cache = await desktop.migrateSharedState(snapshot)
        unsubIpc = desktop.onSharedState((next) => {
          applyRemote(next)
        })
      }
    }
    ready = true
    notify()
    startPolling()
  })()
  return initPromise
}

export const isSharedStorageReady = (): boolean => ready

export const subscribeSharedStorage = (listener: () => void): (() => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const listUsers = (): string[] => [...cache.users]

export const loadUser = (name: string): UserData => {
  const existing = cache.records[name]
  if (existing) return existing
  return freshUser(name)
}

export const saveUser = (data: UserData): void => {
  const users = cache.users.includes(data.name)
    ? cache.users
    : [...cache.users, data.name]
  cache = {
    ...cache,
    users: [...users],
    records: { ...cache.records, [data.name]: data },
  }
  void persistCache()
  notify()
}

/** Add a user if the (trimmed, non-empty) name is new. Returns the user list. */
export const addUser = (rawName: string): string[] => {
  const name = rawName.trim()
  if (!name) return listUsers()
  const users = listUsers()
  if (!users.includes(name)) {
    users.push(name)
    cache = {
      ...cache,
      users: [...users],
      records: {
        ...cache.records,
        [name]: cache.records[name] ?? freshUser(name),
      },
    }
    void persistCache()
    notify()
  }
  return users
}

export const deleteUser = (name: string): string[] => {
  const users = listUsers().filter((n) => n !== name)
  const records = { ...cache.records }
  delete records[name]
  cache = { ...cache, users, records }
  void persistCache()
  notify()
  return users
}

interface SessionInput {
  topicId: string
  topicTitle: string
  areaTitle: string
  attempts: number
  correct: number
  points: number
}

const maybePostClassDelta = (delta: number): void => {
  if (!(delta > 0)) return
  const settings = cache.classCodes ?? emptyClassCodes()
  if (!settings.sendPoints || !settings.activeCode) return
  void addClassPoints(settings.activeCode, delta).catch(() => {
    // Fire-and-forget: offline / not-yet-deployed Worker must not fail practice.
  })
}

/** Record a finished session into the user's aggregated stats and history. */
export const recordSession = (name: string, input: SessionInput): UserData => {
  const data = loadUser(name)
  const prev = data.stats[input.topicId]
  const next: UserData = {
    ...data,
    stats: {
      ...data.stats,
      [input.topicId]: {
        topicId: input.topicId,
        topicTitle: input.topicTitle,
        areaTitle: input.areaTitle,
        attempts: (prev?.attempts ?? 0) + input.attempts,
        correct: (prev?.correct ?? 0) + input.correct,
        points: (prev?.points ?? 0) + input.points,
        lastPracticed: Date.now(),
      },
    },
    sessions: [{ date: Date.now(), ...input }, ...data.sessions],
  }
  if (next.sessions.length > MAX_SESSIONS) next.sessions.length = MAX_SESSIONS
  saveUser(next)
  maybePostClassDelta(input.points)
  return next
}

export const getClassCodeSettings = (): ClassCodeSettings =>
  cache.classCodes ?? emptyClassCodes()

const persistClassCodes = (classCodes: ClassCodeSettings): void => {
  cache = { ...cache, classCodes }
  void persistCache()
  notify()
}

/** Remember a code this PC/LAN created and make it the single active collect-code. */
export const rememberCreatedClassCode = (code: string, name: string): void => {
  const normalized = normalizeClassCode(code)
  if (!normalized) return
  const current = getClassCodeSettings()
  const created = current.created.filter((row) => row.code !== normalized)
  created.push({
    code: normalized,
    name: name.trim().slice(0, 80),
    createdAt: Date.now(),
  })
  persistClassCodes({
    ...current,
    created,
    activeCode: normalized,
  })
}

/** Drop a code from this PC’s list. Does not call the server. */
export const forgetCreatedClassCode = (code: string): void => {
  const normalized = normalizeClassCode(code)
  if (!normalized) return
  const current = getClassCodeSettings()
  persistClassCodes({
    ...current,
    created: current.created.filter((row) => row.code !== normalized),
    activeCode: current.activeCode === normalized ? null : current.activeCode,
    sendPoints:
      current.activeCode === normalized ? false : current.sendPoints,
  })
}

export const setActiveClassCode = (code: string | null): void => {
  const current = getClassCodeSettings()
  const normalized = code ? normalizeClassCode(code) : ''
  persistClassCodes({
    ...current,
    activeCode: normalized || null,
    sendPoints: Boolean(current.sendPoints) && Boolean(normalized),
  })
}

export const setSendClassPoints = (send: boolean): void => {
  const current = getClassCodeSettings()
  persistClassCodes({
    ...current,
    sendPoints: Boolean(send) && Boolean(current.activeCode),
  })
}

export interface ProtocolRow {
  areaTitle: string
  topicTitle: string
  attempts: number
  correct: number
  percent: number
  points: number
}

export interface Protocol {
  name: string
  generatedAt: number
  totalPoints: number
  totalAttempts: number
  totalCorrect: number
  overallPercent: number
  rows: ProtocolRow[]
}

/** Build a points-and-progress report for a user, grouped by topic area. */
export const buildProtocol = (name: string): Protocol => {
  const data = loadUser(name)
  const stats = Object.values(data.stats)
  const rows: ProtocolRow[] = stats
    .map((s) => ({
      areaTitle: s.areaTitle,
      topicTitle: s.topicTitle,
      attempts: s.attempts,
      correct: s.correct,
      percent: s.attempts ? Math.round((s.correct / s.attempts) * 100) : 0,
      points: s.points,
    }))
    .sort((a, b) =>
      a.areaTitle === b.areaTitle
        ? a.topicTitle.localeCompare(b.topicTitle)
        : a.areaTitle.localeCompare(b.areaTitle),
    )
  const totalPoints = stats.reduce((sum, s) => sum + s.points, 0)
  const totalAttempts = stats.reduce((sum, s) => sum + s.attempts, 0)
  const totalCorrect = stats.reduce((sum, s) => sum + s.correct, 0)
  return {
    name,
    generatedAt: Date.now(),
    totalPoints,
    totalAttempts,
    totalCorrect,
    overallPercent: totalAttempts
      ? Math.round((totalCorrect / totalAttempts) * 100)
      : 0,
    rows,
  }
}

export const resetSharedStorageForTests = (): void => {
  stopPolling()
  if (unsubIpc) {
    unsubIpc()
    unsubIpc = null
  }
  cache = emptySharedState()
  ready = false
  backend = 'local'
  initPromise = null
  persistChain = Promise.resolve()
  listeners.clear()
}

export const getSharedStorageBackendForTests = (): StorageBackend => backend
