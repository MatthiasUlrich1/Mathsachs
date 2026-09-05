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
const MAX_TRANSFERS = 200
const USER_ROLES = new Set(['schueler', 'eltern', 'lehrer'])
const DELETED_CLASS_CODE_TTL_MS = 30 * 24 * 60 * 60 * 1000
const MAX_DELETED_CLASS_CODES = 200
const USERS_KEY = 'mathsachs.users.v1'
const CLASS_CODES_KEY = 'mathsachs.classCodes.v1'
const USER_KEY_RE = /^mathsachs\.user\.(.+)\.v1$/

function emptyClassCodes() {
  return {
    created: [],
    known: [],
    deletedCodes: [],
    activeCode: null,
    sendPoints: false,
  }
}

function emptyGradeCodes() {
  return {
    created: [],
    deletedCodes: [],
  }
}

function emptyState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    migratedLocalStorage: false,
    users: [],
    records: {},
    classCodes: emptyClassCodes(),
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

function normalizeTransfer(raw) {
  if (!raw || typeof raw !== 'object') return null
  const code = normalizeCode(raw.code)
  if (!code) return null
  const points = asFiniteNumber(raw.points, 0)
  if (!(points > 0)) return null
  return {
    date: asFiniteNumber(raw.date, 0),
    code,
    className: asString(raw.className, '').trim().slice(0, 80),
    points,
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
  const classTransfers = Array.isArray(src.classTransfers)
    ? src.classTransfers.map(normalizeTransfer).filter(Boolean)
    : []
  const out = {
    name: asString(src.name, name),
    created: asFiniteNumber(src.created, Date.now()),
    stats,
    sessions,
    classTransfers,
  }
  if (Object.prototype.hasOwnProperty.call(src, 'classCodes')) {
    out.classCodes = normalizeClassCodes(src.classCodes)
  }
  if (Object.prototype.hasOwnProperty.call(src, 'gradeCodes')) {
    out.gradeCodes = normalizeGradeCodes(src.gradeCodes)
  }
  if (USER_ROLES.has(src.role)) out.role = src.role
  return out
}

function normalizeCode(raw) {
  if (typeof raw !== 'string') return ''
  return raw
    .trim()
    .toUpperCase()
    .replace(/[-_\s]/g, '')
    .replace(/[IL]/g, '1')
    .replace(/O/g, '0')
    .replace(/[^0-9A-HJKMNP-TV-Z]/g, '')
}

function normalizeCreatedCode(raw) {
  if (!raw || typeof raw !== 'object') return null
  const code = normalizeCode(raw.code)
  if (!code) return null
  return {
    code,
    name: asString(raw.name, '').trim().slice(0, 80),
    createdAt: asFiniteNumber(raw.createdAt, 0),
  }
}

function normalizeDeletedCode(raw) {
  if (!raw || typeof raw !== 'object') return null
  const code = normalizeCode(raw.code)
  if (!code) return null
  return {
    code,
    deletedAt: asFiniteNumber(raw.deletedAt, 0),
  }
}

function pruneDeletedCodes(list, now) {
  const cutoff = now - DELETED_CLASS_CODE_TTL_MS
  const byCode = new Map()
  for (const item of list || []) {
    const row = normalizeDeletedCode(item)
    if (!row || row.deletedAt < cutoff) continue
    const prev = byCode.get(row.code)
    if (!prev || row.deletedAt > prev.deletedAt) byCode.set(row.code, row)
  }
  return [...byCode.values()]
    .sort((a, b) => b.deletedAt - a.deletedAt || a.code.localeCompare(b.code))
    .slice(0, MAX_DELETED_CLASS_CODES)
}

function applyClassCodeTombstones(created, deletedCodes) {
  const deletedAt = new Map(deletedCodes.map((row) => [row.code, row.deletedAt]))
  const live = []
  const resurrected = new Set()
  for (const item of created) {
    const tomb = deletedAt.get(item.code)
    if (tomb != null && item.createdAt > tomb) {
      live.push(item)
      resurrected.add(item.code)
      continue
    }
    if (tomb != null) continue
    live.push(item)
  }
  live.sort((a, b) => a.createdAt - b.createdAt || a.code.localeCompare(b.code))
  return {
    created: live,
    deletedCodes: deletedCodes.filter((row) => !resurrected.has(row.code)),
  }
}

function normalizeClassCodes(raw, now) {
  const src = raw && typeof raw === 'object' ? raw : {}
  const created = []
  const seen = new Set()
  const list = Array.isArray(src.created) ? src.created : []
  for (const item of list) {
    const row = normalizeCreatedCode(item)
    if (!row || seen.has(row.code)) continue
    seen.add(row.code)
    created.push(row)
  }
  const applied = applyClassCodeTombstones(
    created,
    pruneDeletedCodes(src.deletedCodes, now || Date.now()),
  )
  const active =
    src.activeCode == null || src.activeCode === ''
      ? null
      : normalizeCode(src.activeCode) || null
  const activeLive =
    active && applied.deletedCodes.some((row) => row.code === active) ? null : active
  const known = []
  const knownSeen = new Set()
  const knownList = Array.isArray(src.known) ? src.known : []
  for (const item of knownList) {
    const row = normalizeCreatedCode(item)
    if (!row || knownSeen.has(row.code)) continue
    knownSeen.add(row.code)
    known.push(row)
  }
  const dead = new Set(applied.deletedCodes.map((row) => row.code))
  return {
    created: applied.created,
    known: known
      .filter((row) => !dead.has(row.code))
      .sort((a, b) => a.createdAt - b.createdAt || a.code.localeCompare(b.code)),
    deletedCodes: applied.deletedCodes,
    activeCode: activeLive,
    sendPoints: Boolean(src.sendPoints) && Boolean(activeLive),
  }
}

function mergeNamedCodeList(left, right) {
  const byCode = new Map()
  for (const item of [...(left || []), ...(right || [])]) {
    const prev = byCode.get(item.code)
    if (!prev) {
      byCode.set(item.code, item)
      continue
    }
    const createdAt = Math.min(prev.createdAt || Infinity, item.createdAt || Infinity)
    byCode.set(item.code, {
      code: item.code,
      name: prev.name || item.name,
      createdAt: Number.isFinite(createdAt) ? createdAt : 0,
    })
  }
  return [...byCode.values()]
}

function mergeClassCodes(base, incoming, now) {
  const left = base || emptyClassCodes()
  const right = incoming || emptyClassCodes()
  return normalizeClassCodes(
    {
      created: mergeNamedCodeList(left.created, right.created),
      known: mergeNamedCodeList(left.known, right.known),
      deletedCodes: [...(left.deletedCodes || []), ...(right.deletedCodes || [])],
      activeCode: right.activeCode,
      sendPoints: right.sendPoints,
    },
    now || Date.now(),
  )
}

function hasClassCodeData(settings) {
  if (!settings) return false
  return (
    settings.created.length > 0 ||
    (settings.known && settings.known.length > 0) ||
    (settings.deletedCodes && settings.deletedCodes.length > 0) ||
    Boolean(settings.activeCode) ||
    Boolean(settings.sendPoints)
  )
}

function normalizeGradeCodes(raw, now) {
  const src = raw && typeof raw === 'object' ? raw : {}
  const created = []
  const seen = new Set()
  const list = Array.isArray(src.created) ? src.created : []
  for (const item of list) {
    const row = normalizeCreatedCode(item)
    if (!row || seen.has(row.code)) continue
    seen.add(row.code)
    created.push(row)
  }
  const applied = applyClassCodeTombstones(
    created,
    pruneDeletedCodes(src.deletedCodes, now || Date.now()),
  )
  return {
    created: applied.created,
    deletedCodes: applied.deletedCodes,
  }
}

function mergeGradeCodes(base, incoming, now) {
  const byCode = new Map()
  const left = base || emptyGradeCodes()
  const right = incoming || emptyGradeCodes()
  for (const item of [...left.created, ...right.created]) {
    const prev = byCode.get(item.code)
    if (!prev) {
      byCode.set(item.code, item)
      continue
    }
    const createdAt = Math.min(prev.createdAt || Infinity, item.createdAt || Infinity)
    byCode.set(item.code, {
      code: item.code,
      name: prev.name || item.name,
      createdAt: Number.isFinite(createdAt) ? createdAt : 0,
    })
  }
  return normalizeGradeCodes(
    {
      created: [...byCode.values()],
      deletedCodes: [...(left.deletedCodes || []), ...(right.deletedCodes || [])],
    },
    now || Date.now(),
  )
}

function hasGradeCodeData(settings) {
  if (!settings) return false
  return (
    settings.created.length > 0 ||
    (settings.deletedCodes && settings.deletedCodes.length > 0)
  )
}

function pickClassCodeMigrationTarget(users, preferredUser) {
  const preferred = typeof preferredUser === 'string' ? preferredUser.trim() : ''
  if (preferred && users.includes(preferred)) return preferred
  return users[0] || null
}

function migrateSharedClassCodes(state, preferredUser) {
  const shared = normalizeClassCodes(state.classCodes)
  if (!hasClassCodeData(shared)) {
    return { ...state, classCodes: emptyClassCodes() }
  }
  const target = pickClassCodeMigrationTarget(state.users, preferredUser)
  if (!target) {
    return { ...state, classCodes: shared }
  }
  const record = state.records[target] || normalizeUserData(target, {})
  const existing = record.classCodes || emptyClassCodes()
  return {
    ...state,
    classCodes: emptyClassCodes(),
    records: {
      ...state.records,
      [target]: {
        ...record,
        classCodes: mergeClassCodes(existing, shared),
      },
    },
  }
}

function mergeUserClassCodes(base, incoming) {
  if (!hasClassCodeData(incoming)) return base || incoming
  if (!hasClassCodeData(base)) return incoming
  return mergeClassCodes(base, incoming)
}

function mergeUserGradeCodes(base, incoming) {
  if (!hasGradeCodeData(incoming)) return base || incoming
  if (!hasGradeCodeData(base)) return incoming
  return mergeGradeCodes(base, incoming)
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
    classCodes: normalizeClassCodes(src.classCodes),
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

function transferKey(transfer) {
  return [transfer.date, transfer.code, transfer.points].join('|')
}

function mergeTransfers(a, b) {
  const seen = new Set()
  const transfers = []
  for (const transfer of [...(a || []), ...(b || [])]) {
    const key = transferKey(transfer)
    if (seen.has(key)) continue
    seen.add(key)
    transfers.push(transfer)
  }
  transfers.sort((x, y) => y.date - x.date)
  if (transfers.length > MAX_TRANSFERS) transfers.length = MAX_TRANSFERS
  return transfers
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
  const classCodes = mergeUserClassCodes(a.classCodes, b.classCodes)
  const gradeCodes = mergeUserGradeCodes(a.gradeCodes, b.gradeCodes)
  const out = {
    name: a.name || b.name,
    created: Math.min(a.created, b.created),
    stats,
    sessions,
    classTransfers: mergeTransfers(a.classTransfers, b.classTransfers),
  }
  if (classCodes) out.classCodes = classCodes
  if (gradeCodes) out.gradeCodes = gradeCodes
  const role = USER_ROLES.has(b.role) ? b.role : USER_ROLES.has(a.role) ? a.role : null
  if (role) out.role = role
  return out
}

/**
 * Merge two shared states without clobbering parallel edits.
 * - users[] is a union (base order first, then new names from incoming)
 * - score records merge by user, then by topicId (newer lastPracticed wins)
 */
function mergeSharedState(baseRaw, incomingRaw) {
  const base = migrateSharedClassCodes(normalizeState(baseRaw))
  const incoming = migrateSharedClassCodes(normalizeState(incomingRaw))
  const users = uniqueNames([...base.users, ...incoming.users])
  const records = {}
  for (const name of users) {
    records[name] = mergeUserData(base.records[name], incoming.records[name])
  }
  return migrateSharedClassCodes({
    schemaVersion: SCHEMA_VERSION,
    migratedLocalStorage: base.migratedLocalStorage || incoming.migratedLocalStorage,
    users,
    records,
    classCodes: mergeClassCodes(base.classCodes, incoming.classCodes),
  })
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
  let classCodes
  if (typeof src[CLASS_CODES_KEY] === 'string') {
    try {
      classCodes = JSON.parse(src[CLASS_CODES_KEY])
    } catch {
      classCodes = undefined
    }
  }
  return normalizeState({ users, records, classCodes })
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
  MAX_TRANSFERS,
  USERS_KEY,
  CLASS_CODES_KEY,
  emptyState,
  normalizeState,
  mergeSharedState,
  migrateSharedClassCodes,
  hasClassCodeData,
  hasGradeCodeData,
  snapshotToState,
  isEmptyState,
  createFileStore,
  createMemoryStore,
}
