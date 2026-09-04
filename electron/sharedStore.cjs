/**
 * Shared users + scores store for the desktop app and WLAN tablets.
 *
 * Source of truth is a JSON file (typically under Electron userData).
 * Writes are atomic (temp file + rename). Concurrent clients merge:
 * user-list union and per-user / per-topic score merge.
 */
const fs = require('node:fs')
const path = require('node:path')

const SCHEMA_VERSION = 1
const MAX_SESSIONS = 200
const USERS_KEY = 'mathsachs.users.v1'
const USER_KEY_RE = /^mathsachs\.user\.(.+)\.v1$/

function emptyState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    migratedLocalStorage: false,
    users: [],
    records: {},
  }
}

function asFiniteNumber(value, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function asString(value, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function normalizeTopicStat(topicId, raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      topicId,
      topicTitle: topicId,
      areaTitle: '',
      attempts: 0,
      correct: 0,
      points: 0,
      lastPracticed: 0,
    }
  }
  return {
    topicId: asString(raw.topicId, topicId),
    topicTitle: asString(raw.topicTitle, topicId),
    areaTitle: asString(raw.areaTitle, ''),
    attempts: asFiniteNumber(raw.attempts, 0),
    correct: asFiniteNumber(raw.correct, 0),
    points: asFiniteNumber(raw.points, 0),
    lastPracticed: asFiniteNumber(raw.lastPracticed, 0),
  }
}

function normalizeSession(raw) {
  if (!raw || typeof raw !== 'object') return null
  const topicId = asString(raw.topicId, '')
  if (!topicId) return null
  return {
    date: asFiniteNumber(raw.date, 0),
    topicId,
    topicTitle: asString(raw.topicTitle, topicId),
    areaTitle: asString(raw.areaTitle, ''),
    attempts: asFiniteNumber(raw.attempts, 0),
    correct: asFiniteNumber(raw.correct, 0),
    points: asFiniteNumber(raw.points, 0),
  }
}

function normalizeUserData(name, raw) {
  const src = raw && typeof raw === 'object' ? raw : {}
  const statsIn = src.stats && typeof src.stats === 'object' ? src.stats : {}
  const stats = {}
  for (const [topicId, stat] of Object.entries(statsIn)) {
    if (!topicId) continue
    stats[topicId] = normalizeTopicStat(topicId, stat)
  }
  const sessions = Array.isArray(src.sessions)
    ? src.sessions.map(normalizeSession).filter(Boolean)
    : []
  return {
    name: asString(src.name, name),
    created: asFiniteNumber(src.created, Date.now()),
    stats,
    sessions,
  }
}

function uniqueNames(names) {
  const out = []
  const seen = new Set()
  for (const name of names) {
    if (typeof name !== 'string') continue
    const trimmed = name.trim()
    if (!trimmed || seen.has(trimmed)) continue
    seen.add(trimmed)
    out.push(trimmed)
  }
  return out
}

/** Normalize a possibly partial / untrusted JSON payload into SharedState. */
function normalizeState(raw) {
  const src = raw && typeof raw === 'object' ? raw : {}
  const recordsIn = src.records && typeof src.records === 'object' ? src.records : {}
  const users = uniqueNames(Array.isArray(src.users) ? src.users : Object.keys(recordsIn))
  const records = {}
  for (const name of users) {
    records[name] = normalizeUserData(name, recordsIn[name])
  }
  for (const name of Object.keys(recordsIn)) {
    const trimmed = typeof name === 'string' ? name.trim() : ''
    if (!trimmed || records[trimmed]) continue
    users.push(trimmed)
    records[trimmed] = normalizeUserData(trimmed, recordsIn[name])
  }
  return {
    schemaVersion: SCHEMA_VERSION,
    migratedLocalStorage: Boolean(src.migratedLocalStorage),
    users,
    records,
  }
}

function sessionKey(session) {
  return [
    session.date,
    session.topicId,
    session.attempts,
    session.correct,
    session.points,
  ].join('|')
}

function pickStat(a, b) {
  if (!a) return b
  if (!b) return a
  if (b.lastPracticed !== a.lastPracticed) {
    return b.lastPracticed > a.lastPracticed ? b : a
  }
  if (b.points !== a.points) return b.points > a.points ? b : a
  if (b.attempts !== a.attempts) return b.attempts > a.attempts ? b : a
  if (b.correct !== a.correct) return b.correct > a.correct ? b : a
  return {
    ...a,
    topicTitle: a.topicTitle || b.topicTitle,
    areaTitle: a.areaTitle || b.areaTitle,
  }
}

function mergeUserData(a, b) {
  if (!a) return b
  if (!b) return a
  const stats = {}
  const topicIds = new Set([...Object.keys(a.stats), ...Object.keys(b.stats)])
  for (const topicId of topicIds) {
    stats[topicId] = pickStat(a.stats[topicId], b.stats[topicId])
  }
  const seen = new Set()
  const sessions = []
  for (const session of [...a.sessions, ...b.sessions]) {
    const key = sessionKey(session)
    if (seen.has(key)) continue
    seen.add(key)
    sessions.push(session)
  }
  sessions.sort((x, y) => y.date - x.date)
  if (sessions.length > MAX_SESSIONS) sessions.length = MAX_SESSIONS
  return {
    name: a.name || b.name,
    created: Math.min(a.created, b.created),
    stats,
    sessions,
  }
}

/**
 * Merge two shared states without clobbering parallel edits.
 * - users[] is a union (base order first, then new names from incoming)
 * - score records merge by user, then by topicId (newer lastPracticed wins)
 */
function mergeSharedState(baseRaw, incomingRaw) {
  const base = normalizeState(baseRaw)
  const incoming = normalizeState(incomingRaw)
  const users = uniqueNames([...base.users, ...incoming.users])
  const records = {}
  for (const name of users) {
    records[name] = mergeUserData(base.records[name], incoming.records[name])
  }
  return {
    schemaVersion: SCHEMA_VERSION,
    migratedLocalStorage: base.migratedLocalStorage || incoming.migratedLocalStorage,
    users,
    records,
  }
}

function isEmptyState(state) {
  const normalized = normalizeState(state)
  return normalized.users.length === 0 && Object.keys(normalized.records).length === 0
}

/** Convert a renderer localStorage key/value snapshot into SharedState. */
function snapshotToState(snapshot) {
  const src = snapshot && typeof snapshot === 'object' ? snapshot : {}
  let users = []
  if (typeof src[USERS_KEY] === 'string') {
    try {
      const parsed = JSON.parse(src[USERS_KEY])
      if (Array.isArray(parsed)) users = uniqueNames(parsed)
    } catch {
      users = []
    }
  }
  const records = {}
  for (const [key, value] of Object.entries(src)) {
    const match = USER_KEY_RE.exec(key)
    if (!match || typeof value !== 'string') continue
    const name = match[1]
    try {
      records[name] = normalizeUserData(name, JSON.parse(value))
      if (!users.includes(name)) users.push(name)
    } catch {
      // skip corrupt records
    }
  }
  return normalizeState({ users, records })
}

function atomicWriteFile(filePath, contents) {
  const dir = path.dirname(filePath)
  fs.mkdirSync(dir, { recursive: true })
  const tmp = `${filePath}.${process.pid}.${Date.now()}.tmp`
  fs.writeFileSync(tmp, contents, 'utf8')
  try {
    fs.renameSync(tmp, filePath)
  } catch (err) {
    try {
      fs.unlinkSync(filePath)
    } catch {
      // dest may not exist
    }
    try {
      fs.renameSync(tmp, filePath)
    } catch (err2) {
      try {
        fs.unlinkSync(tmp)
      } catch {
        // ignore cleanup
      }
      throw err2 || err
    }
  }
}

/**
 * File-backed store. `filePath` is typically
 * `path.join(app.getPath('userData'), 'mathsachs-state.json')`.
 */
function createFileStore(filePath) {
  let cached = null
  const listeners = new Set()

  function emit() {
    for (const listener of listeners) {
      try {
        listener(cached)
      } catch {
        // isolated listener failures
      }
    }
  }

  function readFromDisk() {
    try {
      const raw = fs.readFileSync(filePath, 'utf8')
      cached = normalizeState(JSON.parse(raw))
    } catch (err) {
      if (!err || err.code === 'ENOENT') {
        cached = emptyState()
      } else {
        cached = emptyState()
      }
    }
    return cached
  }

  function persist(next, extra = {}) {
    cached = {
      ...normalizeState(next),
      ...extra,
    }
    atomicWriteFile(filePath, `${JSON.stringify(cached, null, 2)}\n`)
    emit()
    return cached
  }

  return {
    read() {
      if (cached) return cached
      return readFromDisk()
    },
    write(state) {
      return persist(state, cached ? { migratedLocalStorage: cached.migratedLocalStorage } : {})
    },
    mergeWrite(incoming) {
      const merged = mergeSharedState(this.read(), incoming)
      return persist(merged, { migratedLocalStorage: merged.migratedLocalStorage })
    },
    /**
     * Import a renderer localStorage snapshot once. If the file already has
     * users (e.g. a tablet wrote first), the snapshot is merged rather than
     * replacing it. Subsequent calls are no-ops.
     */
    migrateFromSnapshot(snapshot) {
      const current = this.read()
      if (current.migratedLocalStorage) return current
      const incoming = snapshotToState(snapshot)
      const merged = mergeSharedState(current, incoming)
      return persist(merged, { migratedLocalStorage: true })
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    filePath,
  }
}

/** In-memory store with the same API as createFileStore (for tests). */
function createMemoryStore(initial) {
  let cached = normalizeState(initial || emptyState())
  const listeners = new Set()

  function emit() {
    for (const listener of listeners) {
      try {
        listener(cached)
      } catch {
        // isolated listener failures
      }
    }
  }

  return {
    read() {
      return cached
    },
    write(state) {
      cached = normalizeState(state)
      emit()
      return cached
    },
    mergeWrite(incoming) {
      cached = mergeSharedState(cached, incoming)
      emit()
      return cached
    },
    migrateFromSnapshot(snapshot) {
      if (cached.migratedLocalStorage) return cached
      cached = {
        ...mergeSharedState(cached, snapshotToState(snapshot)),
        migratedLocalStorage: true,
      }
      emit()
      return cached
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    filePath: null,
  }
}

module.exports = {
  SCHEMA_VERSION,
  MAX_SESSIONS,
  USERS_KEY,
  emptyState,
  normalizeState,
  mergeSharedState,
  snapshotToState,
  isEmptyState,
  createFileStore,
  createMemoryStore,
}
