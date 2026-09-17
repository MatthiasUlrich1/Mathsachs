import {
  applyChallengeTombstones,
  mergeDeletedChallenges,
  mergeStoredChallenges,
  parseStoredChallenges,
} from '../challenge/parse'
import {
  applyClassExamTombstones,
  mergeCompletedClassExamIds,
  mergeDeletedClassExams,
  mergeStoredClassExams,
  parseCompletedClassExamIds,
  parseStoredClassExams,
} from '../exam/classExamParse'
import type { DeletedChallenge, StoredChallenge } from '../challenge/types'
import type { DeletedClassExam, StoredClassExam } from '../exam/classExamTypes'
import {
  applyCurriculumTombstones,
  mergeDeletedCurricula,
  mergeInstalledMeta,
  mergeInstalledPackMaps,
  parseCurriculumPacksMap,
  parseDeletedCurricula,
  parseInstalledCurricula,
  type CurriculumPack,
  type DeletedCurriculum,
  type InstalledCurriculum,
} from '../curriculum/pack'
import { normalizePreferredSubjects } from '../curriculum/packFilters'

/** Per-topic aggregated statistics for a user. */
export interface TopicStat {
  topicId: string
  topicTitle: string
  areaTitle: string
  attempts: number
  correct: number
  points: number
  lastPracticed: number
}

/** One completed practice session. */
export interface SessionRecord {
  date: number
  topicId: string
  topicTitle: string
  areaTitle: string
  attempts: number
  correct: number
  points: number
  /** Set when practiced from a Challenge or during one matching active challenge. */
  challengeId?: string
}

/** Local log of points the app decided to POST to a class code. */
export interface ClassTransferRecord {
  date: number
  code: string
  className: string
  points: number
  /** Set when the session topic is known — used to attribute Challenge transfers. */
  topicId?: string
  /** Same challenge as the session, when known. */
  challengeId?: string
}

/** Schüler is the most restricted role. Missing roles normalize to Schüler. */
export type UserRole =
  | 'schueler'
  | 'eltern'
  | 'klassenlehrer'
  | 'lehrer'
  | 'entwickler'

export interface UserData {
  name: string
  created: number
  stats: Record<string, TopicStat>
  sessions: SessionRecord[]
  classTransfers?: ClassTransferRecord[]
  /** Created / active / send-points for this user only. */
  classCodes?: ClassCodeSettings
  /** Lehrer Stufencodes: created locally and/or entered (not Worker ownership). */
  gradeCodes?: GradeCodeSettings
  /** Challenges this Lehrer/Klassenlehrer created (manage UI + LAN merge). */
  challenges?: StoredChallenge[]
  /** Tombstones so WLAN/PC merge cannot resurrect a deleted challenge. */
  deletedChallenges?: DeletedChallenge[]
  /** Class exams this Lehrer assigned (manage UI + LAN merge). */
  classExams?: StoredClassExam[]
  /** Tombstones so WLAN/PC merge cannot resurrect a deleted class exam. */
  deletedClassExams?: DeletedClassExam[]
  /** Locally completed class-exam ids (badge / unsolved list). */
  completedClassExamIds?: string[]
  /** Optional for older records; treat missing as Schüler (see roleForUser). */
  role?: UserRole
  /**
   * Lehrer preferred subjects (e.g. Mathematik, Physik).
   * Filters Lehrpläne / Themen / Klausur erstellen to those Fächer.
   * Legacy single `preferredSubject` is migrated on read.
   */
  preferredSubjects?: string[]
  /** @deprecated Prefer preferredSubjects; kept as first selected Fach for older clients. */
  preferredSubject?: string
  /** Epoch ms when preferred subjects were last set (last-write-wins on merge). */
  preferredSubjectAt?: number
  /** Silent pack-review flag (set via alternate Lehrercode). */
  curriculumDevPreview?: boolean
}

/** A class code this user created. Ownership is local, not on the Worker. */
export interface CreatedClassCode {
  code: string
  name: string
  createdAt: number
}

/** A locally deleted class code. Wins over created-list union on WLAN/PC merge. */
export interface DeletedClassCode {
  code: string
  deletedAt: number
}

/** Per-user settings for online class codes. */
export interface ClassCodeSettings {
  created: CreatedClassCode[]
  /**
   * Worker class names for codes this user entered (joined), not created.
   * Kept off `created` so Schüler are not promoted to Eltern.
   */
  known?: CreatedClassCode[]
  /** Tombstones so merge cannot resurrect a code this client just deleted. */
  deletedCodes?: DeletedClassCode[]
  /** Only one collect-code at a time. */
  activeCode: string | null
  /** Opt-in: send newly earned points to `activeCode`. */
  sendPoints: boolean
}

/** Lehrer grade-level codes. Same tombstone rules as class codes. */
export interface GradeCodeSettings {
  created: CreatedClassCode[]
  /**
   * Stufencodes this Lehrer entered (same secret-as-capability), not created.
   * Kept off `created` so enter is not treated as ownership.
   */
  known?: CreatedClassCode[]
  deletedCodes?: DeletedClassCode[]
}

export const DELETED_CLASS_CODE_TTL_MS = 30 * 24 * 60 * 60 * 1000
export const MAX_DELETED_CLASS_CODES = 200

/** A locally deleted user. Wins over user list union on WLAN/PC merge. */
export interface DeletedUser {
  name: string
  deletedAt: number
}

export const DELETED_USER_TTL_MS = 30 * 24 * 60 * 60 * 1000
export const MAX_DELETED_USERS = 50

/** On-disk / API payload for users and per-user scores. */
export interface SharedState {
  schemaVersion: number
  migratedLocalStorage?: boolean
  users: string[]
  records: Record<string, UserData>
  classCodes?: ClassCodeSettings
  installedCurricula?: InstalledCurriculum[]
  curriculumPacks?: Record<string, CurriculumPack>
  /** Tombstones so merge cannot resurrect a pack this device just removed. */
  deletedCurricula?: DeletedCurriculum[]
  /** Tombstones so merge cannot resurrect a user this device just removed/renamed. */
  deletedUsers?: DeletedUser[]
}

export const SHARED_STATE_SCHEMA_VERSION = 1
export const USERS_STORAGE_KEY = 'mathsachs.users.v1'
export const CLASS_CODES_STORAGE_KEY = 'mathsachs.classCodes.v1'
export const DELETED_USERS_STORAGE_KEY = 'mathsachs.deletedUsers.v1'
export const userRecordKey = (name: string) => `mathsachs.user.${name}.v1`

const CLASS_CODE_CLEAN_RE = /[^0-9A-HJKMNP-TV-Z]/g

/** Same rules as `normalizeClassCode` (kept here so sharedState stays dependency-light). */
export const normalizeSharedClassCode = (raw: string): string => {
  if (typeof raw !== 'string') return ''
  return raw
    .trim()
    .toUpperCase()
    .replace(/[-_\s]/g, '')
    .replace(/[IL]/g, '1')
    .replace(/O/g, '0')
    .replace(CLASS_CODE_CLEAN_RE, '')
}

export const emptyClassCodes = (): ClassCodeSettings => ({
  created: [],
  known: [],
  deletedCodes: [],
  activeCode: null,
  sendPoints: false,
})

export const emptyGradeCodes = (): GradeCodeSettings => ({
  created: [],
  known: [],
  deletedCodes: [],
})

export const emptySharedState = (): SharedState => ({
  schemaVersion: SHARED_STATE_SCHEMA_VERSION,
  users: [],
  records: {},
  classCodes: emptyClassCodes(),
  installedCurricula: [],
  curriculumPacks: {},
  deletedCurricula: [],
  deletedUsers: [],
})

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isUserRole = (value: unknown): value is UserRole =>
  value === 'schueler' ||
  value === 'eltern' ||
  value === 'klassenlehrer' ||
  value === 'lehrer' ||
  value === 'entwickler'

const isCreatedCode = (value: unknown): value is CreatedClassCode => {
  if (!isRecord(value)) return false
  return typeof value.code === 'string' && typeof value.name === 'string'
}

const parseDeletedCodes = (
  raw: unknown,
  now: number,
): DeletedClassCode[] => {
  const list = Array.isArray(raw) ? raw : []
  const byCode = new Map<string, DeletedClassCode>()
  const cutoff = now - DELETED_CLASS_CODE_TTL_MS
  for (const item of list) {
    if (!isRecord(item) || typeof item.code !== 'string') continue
    const code = normalizeSharedClassCode(item.code)
    if (!code) continue
    const deletedAt =
      typeof item.deletedAt === 'number' && Number.isFinite(item.deletedAt)
        ? item.deletedAt
        : 0
    if (deletedAt < cutoff) continue
    const prev = byCode.get(code)
    if (!prev || deletedAt > prev.deletedAt) byCode.set(code, { code, deletedAt })
  }
  return [...byCode.values()]
    .sort((a, b) => b.deletedAt - a.deletedAt || a.code.localeCompare(b.code))
    .slice(0, MAX_DELETED_CLASS_CODES)
}

/** Drop created rows covered by a tombstone; drop tombstones superseded by a later create. */
export const applyClassCodeTombstones = (
  created: CreatedClassCode[],
  deletedCodes: DeletedClassCode[],
): { created: CreatedClassCode[]; deletedCodes: DeletedClassCode[] } => {
  const deletedAt = new Map(deletedCodes.map((row) => [row.code, row.deletedAt]))
  const live: CreatedClassCode[] = []
  const resurrected = new Set<string>()
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
  return {
    created: live.sort((a, b) => a.createdAt - b.createdAt || a.code.localeCompare(b.code)),
    deletedCodes: deletedCodes.filter((row) => !resurrected.has(row.code)),
  }
}

const parseCreatedCodeList = (raw: unknown): CreatedClassCode[] => {
  const seen = new Set<string>()
  const created: CreatedClassCode[] = []
  const list = Array.isArray(raw) ? raw : []
  for (const item of list) {
    if (!isCreatedCode(item)) continue
    const code = normalizeSharedClassCode(item.code)
    if (!code || seen.has(code)) continue
    seen.add(code)
    created.push({
      code,
      name: item.name.trim().slice(0, 80),
      createdAt:
        typeof item.createdAt === 'number' && Number.isFinite(item.createdAt)
          ? item.createdAt
          : 0,
    })
  }
  return created
}

const mergeNamedCodeList = (
  base: CreatedClassCode[],
  incoming: CreatedClassCode[],
): CreatedClassCode[] => {
  const byCode = new Map<string, CreatedClassCode>()
  for (const item of [...base, ...incoming]) {
    const prev = byCode.get(item.code)
    if (!prev) {
      byCode.set(item.code, item)
      continue
    }
    const createdAt = Math.min(
      prev.createdAt || Number.POSITIVE_INFINITY,
      item.createdAt || Number.POSITIVE_INFINITY,
    )
    byCode.set(item.code, {
      code: item.code,
      name: prev.name || item.name,
      createdAt: Number.isFinite(createdAt) ? createdAt : 0,
    })
  }
  return [...byCode.values()]
}

export const parseClassCodes = (raw: unknown, now: number = Date.now()): ClassCodeSettings => {
  if (!isRecord(raw)) return emptyClassCodes()
  const created = parseCreatedCodeList(raw.created)
  const known = parseCreatedCodeList(raw.known)
  const applied = applyClassCodeTombstones(created, parseDeletedCodes(raw.deletedCodes, now))
  const dead = new Set(applied.deletedCodes.map((row) => row.code))
  const activeRaw = raw.activeCode
  const activeCode =
    typeof activeRaw === 'string' && activeRaw.trim()
      ? normalizeSharedClassCode(activeRaw) || null
      : null
  const activeLive =
    activeCode && applied.deletedCodes.some((row) => row.code === activeCode)
      ? null
      : activeCode
  return {
    created: applied.created,
    known: known
      .filter((row) => !dead.has(row.code))
      .sort((a, b) => a.createdAt - b.createdAt || a.code.localeCompare(b.code)),
    deletedCodes: applied.deletedCodes,
    activeCode: activeLive,
    sendPoints: Boolean(raw.sendPoints) && Boolean(activeLive),
  }
}

export const mergeClassCodes = (
  base: ClassCodeSettings,
  incoming: ClassCodeSettings,
  now: number = Date.now(),
): ClassCodeSettings => {
  return parseClassCodes(
    {
      created: mergeNamedCodeList(base.created, incoming.created),
      known: mergeNamedCodeList(base.known ?? [], incoming.known ?? []),
      deletedCodes: [...(base.deletedCodes ?? []), ...(incoming.deletedCodes ?? [])],
      activeCode: incoming.activeCode,
      sendPoints: incoming.sendPoints,
    },
    now,
  )
}

/** Forget locally: drop the row and write a tombstone that merge must honor. */
export const withForgottenClassCode = (
  current: ClassCodeSettings,
  code: string,
  now: number = Date.now(),
): ClassCodeSettings => {
  const normalized = normalizeSharedClassCode(code)
  if (!normalized) return parseClassCodes(current, now)
  return parseClassCodes(
    {
      ...current,
      created: current.created.filter((row) => row.code !== normalized),
      known: (current.known ?? []).filter((row) => row.code !== normalized),
      deletedCodes: [
        ...(current.deletedCodes ?? []),
        { code: normalized, deletedAt: now },
      ],
      activeCode: current.activeCode === normalized ? null : current.activeCode,
      sendPoints: current.activeCode === normalized ? false : current.sendPoints,
    },
    now,
  )
}

export const hasClassCodeData = (
  settings: ClassCodeSettings | undefined | null,
): boolean => {
  if (!settings) return false
  return (
    settings.created.length > 0 ||
    (settings.known?.length ?? 0) > 0 ||
    (settings.deletedCodes?.length ?? 0) > 0 ||
    Boolean(settings.activeCode) ||
    Boolean(settings.sendPoints)
  )
}

export const parseGradeCodes = (
  raw: unknown,
  now: number = Date.now(),
): GradeCodeSettings => {
  if (!isRecord(raw)) return emptyGradeCodes()
  const deletedCodes = parseDeletedCodes(raw.deletedCodes, now)
  const createdApplied = applyClassCodeTombstones(
    parseCreatedCodeList(raw.created),
    deletedCodes,
  )
  const knownApplied = applyClassCodeTombstones(
    parseCreatedCodeList(raw.known),
    createdApplied.deletedCodes,
  )
  const createdCodes = new Set(createdApplied.created.map((row) => row.code))
  return {
    created: createdApplied.created,
    known: knownApplied.created.filter((row) => !createdCodes.has(row.code)),
    deletedCodes: createdApplied.deletedCodes,
  }
}

export const mergeGradeCodes = (
  base: GradeCodeSettings,
  incoming: GradeCodeSettings,
  now: number = Date.now(),
): GradeCodeSettings => {
  return parseGradeCodes(
    {
      created: mergeNamedCodeList(base.created ?? [], incoming.created ?? []),
      known: mergeNamedCodeList(base.known ?? [], incoming.known ?? []),
      deletedCodes: [...(base.deletedCodes ?? []), ...(incoming.deletedCodes ?? [])],
    },
    now,
  )
}

export const withForgottenGradeCode = (
  current: GradeCodeSettings,
  code: string,
  now: number = Date.now(),
): GradeCodeSettings => {
  const normalized = normalizeSharedClassCode(code)
  if (!normalized) return parseGradeCodes(current, now)
  return parseGradeCodes(
    {
      created: current.created.filter((row) => row.code !== normalized),
      known: (current.known ?? []).filter((row) => row.code !== normalized),
      deletedCodes: [
        ...(current.deletedCodes ?? []),
        { code: normalized, deletedAt: now },
      ],
    },
    now,
  )
}

export const hasGradeCodeData = (
  settings: GradeCodeSettings | undefined | null,
): boolean => {
  if (!settings) return false
  return (
    (settings.created?.length ?? 0) > 0 ||
    (settings.known?.length ?? 0) > 0 ||
    (settings.deletedCodes?.length ?? 0) > 0
  )
}

const parseDeletedUsers = (raw: unknown, now: number = Date.now()): DeletedUser[] => {
  const list = Array.isArray(raw) ? raw : []
  const byName = new Map<string, DeletedUser>()
  const cutoff = now - DELETED_USER_TTL_MS
  for (const item of list) {
    if (!isRecord(item) || typeof item.name !== 'string') continue
    const name = item.name.trim()
    if (!name) continue
    const deletedAt =
      typeof item.deletedAt === 'number' && Number.isFinite(item.deletedAt)
        ? item.deletedAt
        : 0
    if (deletedAt < cutoff) continue
    const prev = byName.get(name)
    if (!prev || deletedAt > prev.deletedAt) byName.set(name, { name, deletedAt })
  }
  return [...byName.values()]
    .sort((a, b) => b.deletedAt - a.deletedAt || a.name.localeCompare(b.name))
    .slice(0, MAX_DELETED_USERS)
}

const mergeDeletedUsers = (
  a: DeletedUser[] | undefined,
  b: DeletedUser[] | undefined,
  now: number = Date.now(),
): DeletedUser[] => {
  return parseDeletedUsers([...(a ?? []), ...(b ?? [])], now)
}

/** Apply tombstones: remove users covered by deletedUsers, drop tombstones superseded by later adds. */
const applyUserTombstones = (
  users: string[],
  records: Record<string, UserData>,
  deletedUsers: DeletedUser[],
): { users: string[]; records: Record<string, UserData>; deletedUsers: DeletedUser[] } => {
  const deletedAt = new Map(deletedUsers.map((row) => [row.name, row.deletedAt]))
  const liveUsers: string[] = []
  const liveRecords: Record<string, UserData> = {}
  const resurrected = new Set<string>()
  
  for (const name of users) {
    const tomb = deletedAt.get(name)
    const record = records[name]
    const createdAt = record?.created ?? 0
    
    // If user was created after deletion, they're resurrected
    if (tomb != null && createdAt > tomb) {
      liveUsers.push(name)
      if (record) liveRecords[name] = record
      resurrected.add(name)
      continue
    }
    // If user has a tombstone and wasn't resurrected, skip them
    if (tomb != null) continue
    
    liveUsers.push(name)
    if (record) liveRecords[name] = record
  }
  
  return {
    users: liveUsers,
    records: liveRecords,
    deletedUsers: deletedUsers.filter((row) => !resurrected.has(row.name)),
  }
}

export const pickClassCodeMigrationTarget = (
  users: string[],
  preferredUser?: string | null,
): string | null => {
  const preferred = preferredUser?.trim() ?? ''
  if (preferred && users.includes(preferred)) return preferred
  return users[0] ?? null
}

const emptyUser = (name: string): UserData => ({
  name,
  created: Date.now(),
  stats: {},
  sessions: [],
  classTransfers: [],
})

/**
 * Move leftover shared `classCodes` onto the preferred / first user once.
 * Other users stay empty. If nobody exists yet, keep the leftover for later.
 */
export const migrateSharedClassCodes = (
  state: SharedState,
  preferredUser?: string | null,
): SharedState => {
  const shared = parseClassCodes(state.classCodes)
  if (!hasClassCodeData(shared)) {
    return { ...state, classCodes: emptyClassCodes() }
  }
  const target = pickClassCodeMigrationTarget(state.users, preferredUser)
  if (!target) {
    return { ...state, classCodes: shared }
  }
  const record = state.records[target] ?? emptyUser(target)
  const existing = record.classCodes
    ? parseClassCodes(record.classCodes)
    : emptyClassCodes()
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

const mergeUserClassCodes = (
  base?: ClassCodeSettings,
  incoming?: ClassCodeSettings,
): ClassCodeSettings | undefined => {
  if (!hasClassCodeData(incoming)) return base ?? incoming
  if (!hasClassCodeData(base)) return incoming
  return mergeClassCodes(base as ClassCodeSettings, incoming as ClassCodeSettings)
}

const mergeUserGradeCodes = (
  base?: GradeCodeSettings,
  incoming?: GradeCodeSettings,
): GradeCodeSettings | undefined => {
  if (!hasGradeCodeData(incoming)) return base ?? incoming
  if (!hasGradeCodeData(base)) return incoming
  return mergeGradeCodes(base as GradeCodeSettings, incoming as GradeCodeSettings)
}

/** True when a GET /api/state body looks like shared app state, not HTML. */
export const looksLikeSharedState = (value: unknown): value is SharedState => {
  if (!isRecord(value)) return false
  return Array.isArray(value.users) || isRecord(value.records)
}

export const collectLocalStorageSnapshot = (
  storage: Pick<Storage, 'length' | 'key' | 'getItem'> | undefined,
): Record<string, string> => {
  const snapshot: Record<string, string> = {}
  if (!storage) return snapshot
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i)
    if (!key) continue
    if (
      key !== USERS_STORAGE_KEY &&
      key !== CLASS_CODES_STORAGE_KEY &&
      key !== DELETED_USERS_STORAGE_KEY &&
      !key.startsWith('mathsachs.user.')
    ) {
      continue
    }
    if (!key.endsWith('.v1')) continue
    const value = storage.getItem(key)
    if (value != null) snapshot[key] = value
  }
  return snapshot
}

export const cloneSharedState = (state: SharedState): SharedState =>
  JSON.parse(JSON.stringify(state)) as SharedState

export const sharedStateFingerprint = (state: SharedState): string =>
  JSON.stringify({
    users: state.users,
    records: state.records,
    classCodes: state.classCodes ?? emptyClassCodes(),
    installedCurricula: parseInstalledCurricula(state.installedCurricula),
    curriculumPacks: parseCurriculumPacksMap(state.curriculumPacks),
    deletedCurricula: parseDeletedCurricula(state.deletedCurricula),
  })

const MAX_SESSIONS = 200
const MAX_TRANSFERS = 200

const uniqueNames = (names: string[]): string[] => {
  const out: string[] = []
  const seen = new Set<string>()
  for (const name of names) {
    const trimmed = name.trim()
    if (!trimmed || seen.has(trimmed)) continue
    seen.add(trimmed)
    out.push(trimmed)
  }
  return out
}

const sessionKey = (session: SessionRecord): string =>
  [
    session.date,
    session.topicId,
    session.attempts,
    session.correct,
    session.points,
    session.challengeId ?? '',
  ].join('|')

const transferKey = (transfer: ClassTransferRecord): string =>
  [transfer.date, transfer.code, transfer.points, transfer.challengeId ?? ''].join('|')

const mergeTransfers = (
  a: ClassTransferRecord[] | undefined,
  b: ClassTransferRecord[] | undefined,
): ClassTransferRecord[] => {
  const seen = new Set<string>()
  const transfers: ClassTransferRecord[] = []
  for (const transfer of [...(a ?? []), ...(b ?? [])]) {
    const key = transferKey(transfer)
    if (seen.has(key)) continue
    seen.add(key)
    transfers.push(transfer)
  }
  transfers.sort((x, y) => y.date - x.date)
  if (transfers.length > MAX_TRANSFERS) transfers.length = MAX_TRANSFERS
  return transfers
}

/** Drop local send-logs for tombstoned class codes so WLAN merge cannot resurrect them. */
export const dropDeletedClassTransfers = (
  transfers: ClassTransferRecord[] | undefined,
  deletedCodes: DeletedClassCode[] | undefined,
): ClassTransferRecord[] => {
  const list = transfers ?? []
  if (list.length === 0) return list
  const dead = new Set((deletedCodes ?? []).map((row) => row.code))
  if (dead.size === 0) return list
  return list.filter((row) => !dead.has(row.code.trim().toUpperCase()))
}

const pickStat = (a: TopicStat | undefined, b: TopicStat | undefined): TopicStat => {
  if (!a) return b as TopicStat
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

export const mergeUserData = (a: UserData | undefined, b: UserData | undefined): UserData => {
  if (!a) return b as UserData
  if (!b) return a
  const stats: Record<string, TopicStat> = {}
  for (const topicId of new Set([...Object.keys(a.stats), ...Object.keys(b.stats)])) {
    stats[topicId] = pickStat(a.stats[topicId], b.stats[topicId])
  }
  const seen = new Set<string>()
  const sessions: SessionRecord[] = []
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
  const deletedChallenges = mergeDeletedChallenges(a.deletedChallenges, b.deletedChallenges)
  const applied = applyChallengeTombstones(
    mergeStoredChallenges(
      parseStoredChallenges(a.challenges),
      parseStoredChallenges(b.challenges),
    ),
    deletedChallenges,
  )
  const challenges = applied.challenges
  const deletedClassExams = mergeDeletedClassExams(a.deletedClassExams, b.deletedClassExams)
  const appliedExams = applyClassExamTombstones(
    mergeStoredClassExams(
      parseStoredClassExams(a.classExams),
      parseStoredClassExams(b.classExams),
    ),
    deletedClassExams,
  )
  const completedClassExamIds = mergeCompletedClassExamIds(
    parseCompletedClassExamIds(a.completedClassExamIds),
    parseCompletedClassExamIds(b.completedClassExamIds),
  )
  const role = isUserRole(b.role) ? b.role : isUserRole(a.role) ? a.role : undefined
  const preferred = mergePreferredSubject(a, b)
  return {
    name: a.name || b.name,
    created: Math.min(a.created, b.created),
    stats,
    sessions,
    classTransfers: dropDeletedClassTransfers(
      mergeTransfers(a.classTransfers, b.classTransfers),
      classCodes?.deletedCodes,
    ),
    ...(classCodes ? { classCodes } : {}),
    ...(gradeCodes ? { gradeCodes } : {}),
    ...(challenges.length > 0 ? { challenges } : {}),
    ...(applied.deletedChallenges.length > 0
      ? { deletedChallenges: applied.deletedChallenges }
      : {}),
    ...(appliedExams.classExams.length > 0 ? { classExams: appliedExams.classExams } : {}),
    ...(appliedExams.deletedClassExams.length > 0
      ? { deletedClassExams: appliedExams.deletedClassExams }
      : {}),
    ...(completedClassExamIds.length > 0 ? { completedClassExamIds } : {}),
    ...(role ? { role } : {}),
    ...preferred,
  }
}

/** Last-write-wins for preferred Fächer (timestamp; equal/missing → incoming `b`). */
export const mergePreferredSubject = (
  a: UserData | undefined,
  b: UserData | undefined,
): Pick<UserData, 'preferredSubject' | 'preferredSubjects' | 'preferredSubjectAt'> => {
  const at = (v: unknown) =>
    typeof v === 'number' && Number.isFinite(v) ? v : 0
  const subjectsOf = (u: UserData | undefined): string[] => {
    if (!u) return []
    if (Array.isArray(u.preferredSubjects) && u.preferredSubjects.length > 0) {
      return normalizePreferredSubjects(u.preferredSubjects)
    }
    if (typeof u.preferredSubject === 'string' && u.preferredSubject.trim()) {
      return normalizePreferredSubjects([u.preferredSubject])
    }
    return []
  }
  const aSubs = subjectsOf(a)
  const bSubs = subjectsOf(b)
  const aAt = at(a?.preferredSubjectAt)
  const bAt = at(b?.preferredSubjectAt)
  const pick = (subs: string[], stamp: number) => {
    if (subs.length === 0) return {}
    return {
      preferredSubjects: subs,
      preferredSubject: subs[0],
      ...(stamp ? { preferredSubjectAt: stamp } : {}),
    }
  }
  if (aSubs.length > 0 && bSubs.length > 0) {
    return aAt > bAt ? pick(aSubs, aAt) : pick(bSubs, bAt)
  }
  if (bSubs.length > 0) return pick(bSubs, bAt)
  if (aSubs.length > 0) return pick(aSubs, aAt)
  return {}
}

/** Union users and merge scores by user/topic. Same rules as electron/sharedStore.cjs. */
export const mergeSharedState = (base: SharedState, incoming: SharedState): SharedState => {
  const baseM = migrateSharedClassCodes(base)
  const incomingM = migrateSharedClassCodes(incoming)
  const users = uniqueNames([...baseM.users, ...incomingM.users])
  const records: Record<string, UserData> = {}
  for (const name of users) {
    const mergedUser = mergeUserData(baseM.records[name], incomingM.records[name])
    records[name] = mergedUser ?? emptyUser(name)
  }
  const curricula = applyCurriculumTombstones(
    mergeInstalledPackMaps(
      parseCurriculumPacksMap(baseM.curriculumPacks),
      parseCurriculumPacksMap(incomingM.curriculumPacks),
    ),
    mergeInstalledMeta(
      parseInstalledCurricula(baseM.installedCurricula),
      parseInstalledCurricula(incomingM.installedCurricula),
    ),
    mergeDeletedCurricula(
      parseDeletedCurricula(baseM.deletedCurricula),
      parseDeletedCurricula(incomingM.deletedCurricula),
    ),
  )
  const deletedUsers = mergeDeletedUsers(baseM.deletedUsers, incomingM.deletedUsers)
  const usersTombstoned = applyUserTombstones(users, records, deletedUsers)
  return migrateSharedClassCodes({
    schemaVersion: SHARED_STATE_SCHEMA_VERSION,
    migratedLocalStorage: Boolean(base.migratedLocalStorage || incoming.migratedLocalStorage),
    users: usersTombstoned.users,
    records: usersTombstoned.records,
    classCodes: mergeClassCodes(
      baseM.classCodes ?? emptyClassCodes(),
      incomingM.classCodes ?? emptyClassCodes(),
    ),
    installedCurricula: curricula.meta,
    curriculumPacks: curricula.packs,
    deletedCurricula: curricula.deleted,
    deletedUsers: usersTombstoned.deletedUsers,
  })
}
