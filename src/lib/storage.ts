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

const USERS_KEY = 'mathsachs.users.v1'
const userKey = (name: string) => `mathsachs.user.${name}.v1`
const MAX_SESSIONS = 200

const canStore = (): boolean => {
  try {
    return typeof localStorage !== 'undefined'
  } catch {
    return false
  }
}

export const listUsers = (): string[] => {
  if (!canStore()) return []
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

const writeUsers = (names: string[]): void => {
  if (!canStore()) return
  localStorage.setItem(USERS_KEY, JSON.stringify(names))
}

export const loadUser = (name: string): UserData => {
  if (canStore()) {
    try {
      const raw = localStorage.getItem(userKey(name))
      if (raw) return JSON.parse(raw) as UserData
    } catch {
      // fall through to a fresh record
    }
  }
  return { name, created: Date.now(), stats: {}, sessions: [] }
}

export const saveUser = (data: UserData): void => {
  if (!canStore()) return
  localStorage.setItem(userKey(data.name), JSON.stringify(data))
}

/** Add a user if the (trimmed, non-empty) name is new. Returns the user list. */
export const addUser = (rawName: string): string[] => {
  const name = rawName.trim()
  if (!name) return listUsers()
  const users = listUsers()
  if (!users.includes(name)) {
    users.push(name)
    writeUsers(users)
    saveUser({ name, created: Date.now(), stats: {}, sessions: [] })
  }
  return users
}

export const deleteUser = (name: string): string[] => {
  const users = listUsers().filter((n) => n !== name)
  writeUsers(users)
  if (canStore()) localStorage.removeItem(userKey(name))
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

/** Record a finished session into the user's aggregated stats and history. */
export const recordSession = (name: string, input: SessionInput): UserData => {
  const data = loadUser(name)
  const prev = data.stats[input.topicId]
  data.stats[input.topicId] = {
    topicId: input.topicId,
    topicTitle: input.topicTitle,
    areaTitle: input.areaTitle,
    attempts: (prev?.attempts ?? 0) + input.attempts,
    correct: (prev?.correct ?? 0) + input.correct,
    points: (prev?.points ?? 0) + input.points,
    lastPracticed: Date.now(),
  }
  data.sessions.unshift({ date: Date.now(), ...input })
  if (data.sessions.length > MAX_SESSIONS) data.sessions.length = MAX_SESSIONS
  saveUser(data)
  return data
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
