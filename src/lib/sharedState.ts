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
}

export interface UserData {
  name: string
  created: number
  stats: Record<string, TopicStat>
  sessions: SessionRecord[]
}

/** On-disk / API payload for users and per-user scores. */
export interface SharedState {
  schemaVersion: number
  migratedLocalStorage?: boolean
  users: string[]
  records: Record<string, UserData>
}

export const SHARED_STATE_SCHEMA_VERSION = 1
export const USERS_STORAGE_KEY = 'mathsachs.users.v1'
export const userRecordKey = (name: string) => `mathsachs.user.${name}.v1`

export const emptySharedState = (): SharedState => ({
  schemaVersion: SHARED_STATE_SCHEMA_VERSION,
  users: [],
  records: {},
})

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

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
    if (key !== USERS_STORAGE_KEY && !key.startsWith('mathsachs.user.')) continue
    if (!key.endsWith('.v1')) continue
    const value = storage.getItem(key)
    if (value != null) snapshot[key] = value
  }
  return snapshot
}

export const cloneSharedState = (state: SharedState): SharedState =>
  JSON.parse(JSON.stringify(state)) as SharedState

export const sharedStateFingerprint = (state: SharedState): string =>
  JSON.stringify({ users: state.users, records: state.records })

const MAX_SESSIONS = 200

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
  [session.date, session.topicId, session.attempts, session.correct, session.points].join('|')

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

const mergeUserData = (a: UserData | undefined, b: UserData | undefined): UserData => {
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
  return {
    name: a.name || b.name,
    created: Math.min(a.created, b.created),
    stats,
    sessions,
  }
}

/** Union users and merge scores by user/topic. Same rules as electron/sharedStore.cjs. */
export const mergeSharedState = (base: SharedState, incoming: SharedState): SharedState => {
  const users = uniqueNames([...base.users, ...incoming.users])
  const records: Record<string, UserData> = {}
  for (const name of users) {
    const mergedUser = mergeUserData(base.records[name], incoming.records[name])
    records[name] = mergedUser ?? {
      name,
      created: Date.now(),
      stats: {},
      sessions: [],
    }
  }
  return {
    schemaVersion: SHARED_STATE_SCHEMA_VERSION,
    migratedLocalStorage: Boolean(base.migratedLocalStorage || incoming.migratedLocalStorage),
    users,
    records,
  }
}
