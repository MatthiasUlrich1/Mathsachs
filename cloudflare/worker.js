/**
 * Mathsachs class-points Worker (KV binding MUST be named CLASSES).
 *
 * Paste this entire file into dash.cloudflare.com → Workers → mathsachs-punkte
 * → Edit Code, then Deploy. Keep in sync with src/classCode/buckets.ts,
 * src/classCode/code.ts and src/classCode/publicId.ts.
 *
 * Rate limits per client IP / 60s (classroom-safe listing + a few deletes):
 * GET class/grade 300, DELETE 30, POST /classes 8, POST /grades 8,
 * POST /challenges 8, PUT grade membership 30, POST points 60.
 * GET / (health) is not rate-limited. Raise GET/DELETE here if a class page
 * with many Eigene Codes still 429s; keep POST points tight against abuse.
 *
 * Privacy: KV stores class/grade display names, daily point buckets and
 * anonymous challenge sums only. No pupil names, user ids or emails.
 * GET /grades never returns member Klassencodes. Points are accepted only
 * on class records. Challenge POST never stores names.
 */

const BERLIN_TZ = 'Europe/Berlin'
const CLASS_CODE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
const CLASS_CODE_LENGTH = 8
const MAX_POINTS_DELTA = 100
const MAX_CLASS_NAME_LENGTH = 80
const MAX_GRADE_CLASSES = 40
const SERVICE = 'mathsachs-punkte'
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/

const ALLOWED_METHODS = 'GET, POST, PUT, DELETE, OPTIONS'

export function normalizeClassCode(raw) {
  if (typeof raw !== 'string') return ''
  return raw
    .trim()
    .toUpperCase()
    .replace(/[-_\s]/g, '')
    .replace(/[IL]/g, '1')
    .replace(/O/g, '0')
    .replace(/[^0-9A-HJKMNP-TV-Z]/g, '')
}

export function isValidClassCode(raw) {
  const code = normalizeClassCode(raw)
  return code.length === CLASS_CODE_LENGTH && [...code].every((ch) => CLASS_CODE_ALPHABET.includes(ch))
}

export function generateClassCode() {
  const bytes = new Uint8Array(CLASS_CODE_LENGTH)
  crypto.getRandomValues(bytes)
  let out = ''
  for (let i = 0; i < CLASS_CODE_LENGTH; i++) {
    out += CLASS_CODE_ALPHABET[bytes[i] % CLASS_CODE_ALPHABET.length]
  }
  return out
}

/** Anonymous UI key. Prefixed so it is never a valid 8-character Klassencode. */
export function publicIdFromCode(code) {
  let hash = 2166136261
  const text = String(code || '')
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return `n${(hash >>> 0).toString(16).padStart(8, '0')}`
}

function berlinParts(at) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: BERLIN_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(at))
  const get = (type) => parts.find((part) => part.type === type)?.value ?? ''
  return { year: get('year'), month: get('month'), day: get('day') }
}

export function berlinDayKey(at = Date.now()) {
  const { year, month, day } = berlinParts(at)
  return `${year}-${month}-${day}`
}

export function schoolYearStartYear(dayKey) {
  const [year, month] = dayKey.split('-').map(Number)
  if (!year || !month) return 0
  return month >= 8 ? year : year - 1
}

export function schoolYearLabel(startYear) {
  const end = startYear + 1
  return `${startYear}/${String(end).slice(-2)}`
}

export function monthKey(dayKey) {
  return dayKey.slice(0, 7)
}

export function isoWeekKey(dayKey) {
  const [year, month, day] = dayKey.split('-').map(Number)
  if (!year || !month || !day) return ''
  const date = new Date(Date.UTC(year, month - 1, day))
  const dow = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dow)
  const isoYear = date.getUTCFullYear()
  const jan4 = new Date(Date.UTC(isoYear, 0, 4))
  const jan4Dow = jan4.getUTCDay() || 7
  const week1Monday = new Date(jan4)
  week1Monday.setUTCDate(jan4.getUTCDate() - (jan4Dow - 1))
  const week = 1 + Math.round((date.getTime() - week1Monday.getTime()) / 604800000)
  return `${isoYear}-W${String(week).padStart(2, '0')}`
}

export function inSchoolYear(dayKey, startYear) {
  return schoolYearStartYear(dayKey) === startYear
}

function asPoints(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0
}

export function summarizeDays(days, now = Date.now()) {
  const todayKey = berlinDayKey(now)
  const week = isoWeekKey(todayKey)
  const month = monthKey(todayKey)
  const startYear = schoolYearStartYear(todayKey)
  let today = 0
  let weekSum = 0
  let monthSum = 0
  let yearSum = 0
  let total = 0
  for (const [day, raw] of Object.entries(days || {})) {
    if (!DAY_RE.test(day)) continue
    const value = asPoints(raw)
    if (!value) continue
    total += value
    if (day === todayKey) today += value
    if (isoWeekKey(day) === week) weekSum += value
    if (monthKey(day) === month) monthSum += value
    if (inSchoolYear(day, startYear)) yearSum += value
  }
  return {
    today,
    week: weekSum,
    month: monthSum,
    year: yearSum,
    total,
    period: {
      today: todayKey,
      week,
      month,
      schoolYear: schoolYearLabel(startYear),
    },
  }
}

const CHALLENGE_INDEX_PREFIX = 'C:'
const LOCAL_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/
const MAX_CHALLENGE_TOPICS = 40
const MAX_PRIZE_TEXT_LENGTH = 200

function berlinDateTimeParts(at) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: BERLIN_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(new Date(at))
  const get = (type) => parts.find((part) => part.type === type)?.value ?? ''
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour') === '24' ? '00' : get('hour'),
    minute: get('minute'),
    second: get('second'),
  }
}

export function berlinLocalToUtcMs(local) {
  const match = LOCAL_RE.exec(String(local || '').trim())
  if (!match) return Number.NaN
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const hour = Number(match[4])
  const minute = Number(match[5])
  const second = Number(match[6] ?? 0)
  let utc = Date.UTC(year, month - 1, day, hour, minute, second)
  const shown = berlinDateTimeParts(utc)
  const shownUtc = Date.UTC(
    Number(shown.year),
    Number(shown.month) - 1,
    Number(shown.day),
    Number(shown.hour),
    Number(shown.minute),
    Number(shown.second),
  )
  return utc - (shownUtc - utc)
}

export function parseChallengeInstant(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value !== 'string') return Number.NaN
  const trimmed = value.trim()
  if (LOCAL_RE.test(trimmed) && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(trimmed)) {
    return berlinLocalToUtcMs(trimmed)
  }
  const parsed = Date.parse(trimmed)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

export function isInChallengeWindow(start, end, now = Date.now()) {
  const from = parseChallengeInstant(start)
  const to = parseChallengeInstant(end)
  if (!Number.isFinite(from) || !Number.isFinite(to) || to < from) return false
  return now >= from && now <= to
}

function parsePrizeStored(raw) {
  if (!raw || typeof raw !== 'object') return { enabled: false }
  const text = typeof raw.text === 'string' ? raw.text.trim().slice(0, MAX_PRIZE_TEXT_LENGTH) : ''
  const threshold =
    typeof raw.classThreshold === 'number' && Number.isFinite(raw.classThreshold) && raw.classThreshold > 0
      ? Math.trunc(raw.classThreshold)
      : undefined
  const prize = { enabled: Boolean(raw.enabled) }
  if (raw.classPrize) prize.classPrize = true
  if (raw.studentPrize) prize.studentPrize = true
  if (threshold != null) prize.classThreshold = threshold
  if (text) prize.text = text
  return prize
}

function parseTopicIdsStored(raw) {
  const list = Array.isArray(raw) ? raw : []
  const out = []
  const seen = new Set()
  for (const item of list) {
    if (typeof item !== 'string') continue
    const id = item.trim()
    if (!id || seen.has(id)) continue
    seen.add(id)
    out.push(id)
    if (out.length >= MAX_CHALLENGE_TOPICS) break
  }
  return out
}

function parseTopicsStored(raw, topicIds) {
  const byId = new Map()
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (!item || typeof item !== 'object' || typeof item.id !== 'string') continue
      const id = item.id.trim()
      const title = typeof item.title === 'string' ? item.title.trim().slice(0, 80) : ''
      if (id && title) byId.set(id, title)
    }
  }
  return topicIds.map((id) => (byId.has(id) ? { id, title: byId.get(id) } : { id }))
}

function parseChallengeStored(raw) {
  if (!raw || typeof raw !== 'object') return null
  const id = typeof raw.id === 'string' ? normalizeClassCode(raw.id) : ''
  if (!isValidClassCode(id)) return null
  const name = typeof raw.name === 'string' ? raw.name.trim().slice(0, MAX_CLASS_NAME_LENGTH) : ''
  const topicIds = parseTopicIdsStored(raw.topicIds)
  const start = typeof raw.start === 'string' ? raw.start.trim() : ''
  const end = typeof raw.end === 'string' ? raw.end.trim() : ''
  if (!name || topicIds.length === 0 || !start || !end) return null
  if (!Number.isFinite(parseChallengeInstant(start)) || !Number.isFinite(parseChallengeInstant(end))) {
    return null
  }
  const days =
    raw.days && typeof raw.days === 'object' && !Array.isArray(raw.days) ? raw.days : {}
  const classDays =
    raw.classDays && typeof raw.classDays === 'object' && !Array.isArray(raw.classDays)
      ? raw.classDays
      : {}
  return {
    id,
    name,
    topicIds,
    topics: parseTopicsStored(raw.topics, topicIds),
    start,
    end,
    prize: parsePrizeStored(raw.prize),
    days,
    classDays,
  }
}

function parseChallengesMap(raw) {
  const src = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
  const out = {}
  for (const item of Object.values(src)) {
    const parsed = parseChallengeStored(item)
    if (parsed) out[parsed.id] = parsed
  }
  return out
}

function serializeChallenge(ch) {
  const out = {
    id: ch.id,
    name: ch.name,
    topicIds: ch.topicIds,
    topics: ch.topics,
    start: ch.start,
    end: ch.end,
    prize: ch.prize,
    days: ch.days || {},
  }
  if (ch.classDays && Object.keys(ch.classDays).length) out.classDays = ch.classDays
  return out
}

function publicPrize(prize) {
  return parsePrizeStored(prize)
}

function publicTopics(ch) {
  return parseTopicsStored(ch.topics, ch.topicIds)
}

function publicClassChallenge(ch, className, now) {
  const summary = summarizeDays(ch.days, now)
  const prize = publicPrize(ch.prize)
  const body = {
    id: ch.id,
    name: ch.name,
    scope: 'class',
    start: ch.start,
    end: ch.end,
    topics: publicTopics(ch),
    prize,
    points: {
      today: summary.today,
      week: summary.week,
      month: summary.month,
      year: summary.year,
      total: summary.total,
    },
    className,
    active: isInChallengeWindow(ch.start, ch.end, now),
  }
  if (prize.enabled && prize.classPrize && typeof prize.classThreshold === 'number') {
    body.classThreshold = prize.classThreshold
    body.reachedThreshold = summary.total >= prize.classThreshold
  }
  return body
}

function publicGradeChallenge(ch, grade, now) {
  const prize = publicPrize(ch.prize)
  const classDays = ch.classDays || {}
  const classes = []
  let points = emptyPoints()
  let period = summarizeDays({}, now).period
  for (const classCode of grade.classes) {
    const stored = grade._classByCode && grade._classByCode[classCode]
    const days = classDays[classCode] || {}
    const summary = summarizeDays(days, now)
    period = summary.period
    const standing = {
      id: publicIdFromCode(classCode),
      name: stored ? stored.name : 'Klasse',
      points: {
        today: summary.today,
        week: summary.week,
        month: summary.month,
        year: summary.year,
        total: summary.total,
      },
    }
    classes.push(standing)
    points = addBreakdown(points, standing.points)
  }
  classes.sort((a, b) => b.points.total - a.points.total || a.name.localeCompare(b.name, 'de'))
  return {
    id: ch.id,
    name: ch.name,
    scope: 'grade',
    start: ch.start,
    end: ch.end,
    topics: publicTopics(ch),
    prize,
    classes,
    points,
    period,
    active: isInChallengeWindow(ch.start, ch.end, now),
  }
}

function topicAllowed(ch, topicId) {
  if (typeof topicId !== 'string' || !topicId.trim()) return false
  return ch.topicIds.includes(topicId.trim())
}

function challengeIndexKey(id) {
  return `${CHALLENGE_INDEX_PREFIX}${id}`
}

function parseRaw(raw) {
  if (!raw) return null
  try {
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (!data || typeof data !== 'object') return null
    return data
  } catch {
    return null
  }
}

function isGradeRecord(data) {
  return Boolean(data && data.type === 'grade')
}

function uniqueValidCodes(list) {
  const out = []
  const seen = new Set()
  const src = Array.isArray(list) ? list : []
  for (const item of src) {
    const code = normalizeClassCode(item)
    if (!isValidClassCode(code) || seen.has(code)) continue
    seen.add(code)
    out.push(code)
  }
  return out
}

function parseClassStored(raw) {
  const data = parseRaw(raw)
  if (!data || isGradeRecord(data)) return null
  const name = typeof data.name === 'string' ? data.name.trim() : ''
  if (!name) return null
  const days =
    data.days && typeof data.days === 'object' && !Array.isArray(data.days) ? data.days : {}
  const createdAt =
    typeof data.createdAt === 'number' && Number.isFinite(data.createdAt)
      ? data.createdAt
      : Date.now()
  const gradeId = typeof data.gradeId === 'string' ? normalizeClassCode(data.gradeId) : ''
  return {
    name,
    createdAt,
    days,
    gradeId: isValidClassCode(gradeId) ? gradeId : undefined,
    challenges: parseChallengesMap(data.challenges),
  }
}

function parseGradeStored(raw) {
  const data = parseRaw(raw)
  if (!data || !isGradeRecord(data)) return null
  const name = typeof data.name === 'string' ? data.name.trim() : ''
  if (!name) return null
  const createdAt =
    typeof data.createdAt === 'number' && Number.isFinite(data.createdAt)
      ? data.createdAt
      : Date.now()
  return {
    type: 'grade',
    name,
    createdAt,
    classes: uniqueValidCodes(data.classes),
    challenges: parseChallengesMap(data.challenges),
  }
}

function serializeClass(stored) {
  const out = {
    name: stored.name,
    createdAt: stored.createdAt,
    days: stored.days || {},
  }
  if (stored.gradeId) out.gradeId = stored.gradeId
  const challenges = stored.challenges || {}
  if (Object.keys(challenges).length) {
    const packed = {}
    for (const [id, ch] of Object.entries(challenges)) packed[id] = serializeChallenge(ch)
    out.challenges = packed
  }
  return out
}

function serializeGrade(stored) {
  const out = {
    type: 'grade',
    name: stored.name,
    createdAt: stored.createdAt,
    classes: uniqueValidCodes(stored.classes),
  }
  const challenges = stored.challenges || {}
  if (Object.keys(challenges).length) {
    const packed = {}
    for (const [id, ch] of Object.entries(challenges)) packed[id] = serializeChallenge(ch)
    out.challenges = packed
  }
  return out
}

function emptyPoints() {
  return { today: 0, week: 0, month: 0, year: 0, total: 0 }
}

function addBreakdown(a, b) {
  return {
    today: a.today + b.today,
    week: a.week + b.week,
    month: a.month + b.month,
    year: a.year + b.year,
    total: a.total + b.total,
  }
}

function standingFromClass(classCode, stored, now) {
  const summary = summarizeDays(stored.days, now)
  return {
    id: publicIdFromCode(classCode),
    name: stored.name,
    points: {
      today: summary.today,
      week: summary.week,
      month: summary.month,
      year: summary.year,
      total: summary.total,
    },
  }
}

async function buildGradeView(env, gradeCode, grade, now = Date.now()) {
  const classes = []
  const classByCode = {}
  let points = emptyPoints()
  let period = summarizeDays({}, now).period
  for (const classCode of grade.classes) {
    const stored = parseClassStored(await env.CLASSES.get(classCode))
    if (!stored) continue
    classByCode[classCode] = stored
    const standing = standingFromClass(classCode, stored, now)
    const summary = summarizeDays(stored.days, now)
    period = summary.period
    classes.push(standing)
    points = addBreakdown(points, standing.points)
  }
  classes.sort((a, b) => a.name.localeCompare(b.name, 'de') || a.id.localeCompare(b.id))
  const gradeWithClasses = { ...grade, _classByCode: classByCode }
  const activeChallenges = Object.values(grade.challenges || {})
    .filter((ch) => isInChallengeWindow(ch.start, ch.end, now))
    .map((ch) => publicGradeChallenge(ch, gradeWithClasses, now))
  const view = {
    id: publicIdFromCode(gradeCode),
    name: grade.name,
    classes,
    points,
    period,
  }
  if (activeChallenges.length) {
    view.challenges = activeChallenges
    view.challenge = activeChallenges[0]
  }
  return view
}

function publicClass(code, stored, now = Date.now(), gradeView = null) {
  const summary = summarizeDays(stored.days, now)
  const body = {
    code,
    name: stored.name,
    createdAt: stored.createdAt,
    points: {
      today: summary.today,
      week: summary.week,
      month: summary.month,
      year: summary.year,
      total: summary.total,
    },
    period: summary.period,
  }
  if (gradeView) body.grade = gradeView
  const classActive = Object.values(stored.challenges || {})
    .filter((ch) => isInChallengeWindow(ch.start, ch.end, now))
    .map((ch) => publicClassChallenge(ch, stored.name, now))
  const gradeActive = gradeView && Array.isArray(gradeView.challenges) ? gradeView.challenges : []
  const all = [...classActive, ...gradeActive]
  if (all.length) {
    body.challenges = all
    body.challenge = all[0]
  }
  return body
}

function publicGradeView(view) {
  const body = {
    id: view.id,
    name: view.name,
    classes: view.classes,
    points: view.points,
    period: view.period,
  }
  if (view.challenges) body.challenges = view.challenges
  if (view.challenge) body.challenge = view.challenge
  return body
}

function corsHeaders(request) {
  const origin = request.headers.get('Origin')
  const allow = !origin || origin === 'null' || origin === 'file://' ? '*' : origin
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': ALLOWED_METHODS,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function json(request, status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...corsHeaders(request),
    },
  })
}

function errorJson(request, status, message, code) {
  return json(request, status, { error: message, code })
}

export const RATE_LIMITS = {
  create: { limit: 8, windowMs: 60_000 },
  delete: { limit: 30, windowMs: 60_000 },
  get: { limit: 300, windowMs: 60_000 },
  points: { limit: 60, windowMs: 60_000 },
  gradeCreate: { limit: 8, windowMs: 60_000 },
  gradeUpdate: { limit: 30, windowMs: 60_000 },
  challengeCreate: { limit: 8, windowMs: 60_000 },
}

const hits = new Map()

export function resetRateLimitsForTests() {
  hits.clear()
}

function rateLimit(key, limit, windowMs) {
  const now = Date.now()
  const slot = hits.get(key)
  if (!slot || now > slot.reset) {
    hits.set(key, { n: 1, reset: now + windowMs })
    return true
  }
  slot.n += 1
  return slot.n <= limit
}

function clientKey(request) {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For') ||
    'local'
  )
}

async function readJson(request) {
  const text = await request.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    const err = new Error('invalid json')
    err.code = 'INVALID_JSON'
    throw err
  }
}

function pathnameOf(request) {
  try {
    return new URL(request.url).pathname.replace(/\/+$/, '') || '/'
  } catch {
    return '/'
  }
}

function readDisplayName(body, emptyMessage) {
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!name) return { error: emptyMessage }
  if (name.length > MAX_CLASS_NAME_LENGTH) {
    return {
      error: `Der Name darf höchstens ${MAX_CLASS_NAME_LENGTH} Zeichen haben.`,
    }
  }
  return { name }
}

async function allocateCode(env) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generateClassCode()
    const existing = await env.CLASSES.get(code)
    if (existing) continue
    return code
  }
  return null
}

async function handleCreate(request, env) {
  if (!rateLimit(`create:${clientKey(request)}`, RATE_LIMITS.create.limit, RATE_LIMITS.create.windowMs)) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE')
  }
  if (!env.CLASSES) {
    return errorJson(request, 503, 'KV-Bindung CLASSES fehlt.', 'NO_KV')
  }
  let body
  try {
    body = await readJson(request)
  } catch {
    return errorJson(request, 400, 'Ungültiges JSON.', 'BAD_JSON')
  }
  const named = readDisplayName(body, 'Bitte einen Klassennamen eingeben.')
  if (named.error) return errorJson(request, 400, named.error, 'BAD_NAME')
  const code = await allocateCode(env)
  if (!code) {
    return errorJson(request, 503, 'Kein freier Klassencode. Bitte erneut versuchen.', 'BUSY')
  }
  const stored = { name: named.name, createdAt: Date.now(), days: {} }
  await env.CLASSES.put(code, JSON.stringify(stored))
  return json(request, 201, publicClass(code, stored))
}

async function loadClass(env, rawCode) {
  const code = normalizeClassCode(rawCode)
  if (!isValidClassCode(code)) return { error: 'BAD_CODE' }
  if (!env.CLASSES) return { error: 'NO_KV' }
  const raw = await env.CLASSES.get(code)
  const data = parseRaw(raw)
  if (isGradeRecord(data)) return { error: 'NOT_CLASS', code }
  const stored = parseClassStored(raw)
  if (!stored) return { error: 'NOT_FOUND', code }
  return { code, stored }
}

async function loadGrade(env, rawCode) {
  const code = normalizeClassCode(rawCode)
  if (!isValidClassCode(code)) return { error: 'BAD_CODE' }
  if (!env.CLASSES) return { error: 'NO_KV' }
  const raw = await env.CLASSES.get(code)
  const data = parseRaw(raw)
  if (data && !isGradeRecord(data)) return { error: 'NOT_GRADE', code }
  const stored = parseGradeStored(raw)
  if (!stored) return { error: 'NOT_FOUND', code }
  return { code, stored }
}

function classLoadError(request, loaded, forPoints = false) {
  if (loaded.error === 'BAD_CODE') {
    return errorJson(request, 400, 'Der Klassencode ist ungültig.', 'BAD_CODE')
  }
  if (loaded.error === 'NO_KV') {
    return errorJson(request, 503, 'KV-Bindung CLASSES fehlt.', 'NO_KV')
  }
  if (loaded.error === 'NOT_CLASS') {
    return errorJson(
      request,
      400,
      forPoints
        ? 'Das ist ein Klassenstufencode. Punkte gehen nur an Klassencodes.'
        : 'Das ist ein Klassenstufencode, kein Klassencode.',
      'NOT_CLASS',
    )
  }
  if (loaded.error === 'NOT_FOUND') {
    return errorJson(request, 404, 'Diesen Klassencode gibt es nicht.', 'NOT_FOUND')
  }
  return null
}

function gradeLoadError(request, loaded) {
  if (loaded.error === 'BAD_CODE') {
    return errorJson(request, 400, 'Der Stufencode ist ungültig.', 'BAD_CODE')
  }
  if (loaded.error === 'NO_KV') {
    return errorJson(request, 503, 'KV-Bindung CLASSES fehlt.', 'NO_KV')
  }
  if (loaded.error === 'NOT_GRADE') {
    return errorJson(request, 400, 'Das ist ein Klassencode, kein Stufencode.', 'NOT_GRADE')
  }
  if (loaded.error === 'NOT_FOUND') {
    return errorJson(request, 404, 'Diesen Stufencode gibt es nicht.', 'NOT_FOUND')
  }
  return null
}

async function unlinkClassFromGrade(env, classCode, gradeId) {
  if (!gradeId) return
  const grade = parseGradeStored(await env.CLASSES.get(gradeId))
  if (!grade) return
  const next = grade.classes.filter((item) => item !== classCode)
  if (next.length === grade.classes.length) return
  await env.CLASSES.put(gradeId, JSON.stringify(serializeGrade({ ...grade, classes: next })))
}

async function putClass(env, code, stored) {
  await env.CLASSES.put(code, JSON.stringify(serializeClass(stored)))
}

async function handleDelete(request, env, rawCode) {
  if (!rateLimit(`delete:${clientKey(request)}`, RATE_LIMITS.delete.limit, RATE_LIMITS.delete.windowMs)) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE')
  }
  const loaded = await loadClass(env, rawCode)
  const err = classLoadError(request, loaded)
  if (err) return err
  await unlinkClassFromGrade(env, loaded.code, loaded.stored.gradeId)
  await env.CLASSES.delete(loaded.code)
  return json(request, 200, { ok: true, deleted: loaded.code })
}

async function handleGet(request, env, rawCode) {
  if (!rateLimit(`get:${clientKey(request)}`, RATE_LIMITS.get.limit, RATE_LIMITS.get.windowMs)) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE')
  }
  const loaded = await loadClass(env, rawCode)
  const err = classLoadError(request, loaded)
  if (err) return err
  let gradeView = null
  if (loaded.stored.gradeId) {
    const grade = parseGradeStored(await env.CLASSES.get(loaded.stored.gradeId))
    if (grade) gradeView = await buildGradeView(env, loaded.stored.gradeId, grade)
  }
  return json(request, 200, publicClass(loaded.code, loaded.stored, Date.now(), gradeView))
}

async function handlePoints(request, env, rawCode) {
  if (!rateLimit(`points:${clientKey(request)}`, RATE_LIMITS.points.limit, RATE_LIMITS.points.windowMs)) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE')
  }
  let body
  try {
    body = await readJson(request)
  } catch {
    return errorJson(request, 400, 'Ungültiges JSON.', 'BAD_JSON')
  }
  const delta = Number.isInteger(body.delta) ? body.delta : body.points
  if (!Number.isInteger(delta) || delta < 1 || delta > MAX_POINTS_DELTA) {
    return errorJson(
      request,
      400,
      `delta muss eine ganze Zahl von 1 bis ${MAX_POINTS_DELTA} sein.`,
      'BAD_DELTA',
    )
  }
  const topicId = typeof body.topicId === 'string' ? body.topicId.trim() : ''
  const loaded = await loadClass(env, rawCode)
  const err = classLoadError(request, loaded, true)
  if (err) return err
  const now = Date.now()
  const day = berlinDayKey(now)
  const days = { ...loaded.stored.days }
  days[day] = (asPoints(days[day]) || 0) + delta
  const stored = { ...loaded.stored, days, challenges: { ...(loaded.stored.challenges || {}) } }
  if (topicId) {
    for (const ch of Object.values(stored.challenges)) {
      if (!isInChallengeWindow(ch.start, ch.end, now)) continue
      if (!topicAllowed(ch, topicId)) continue
      const challengeDays = { ...(ch.days || {}) }
      challengeDays[day] = (asPoints(challengeDays[day]) || 0) + delta
      ch.days = challengeDays
    }
    if (stored.gradeId) {
      const grade = parseGradeStored(await env.CLASSES.get(stored.gradeId))
      if (grade) {
        let gradeChanged = false
        const gradeChallenges = { ...(grade.challenges || {}) }
        for (const ch of Object.values(gradeChallenges)) {
          if (!isInChallengeWindow(ch.start, ch.end, now)) continue
          if (!topicAllowed(ch, topicId)) continue
          const classDays = { ...(ch.classDays || {}) }
          const bucket = { ...(classDays[loaded.code] || {}) }
          bucket[day] = (asPoints(bucket[day]) || 0) + delta
          classDays[loaded.code] = bucket
          ch.classDays = classDays
          gradeChanged = true
        }
        if (gradeChanged) {
          await env.CLASSES.put(
            stored.gradeId,
            JSON.stringify(serializeGrade({ ...grade, challenges: gradeChallenges })),
          )
        }
      }
    }
  }
  await putClass(env, loaded.code, stored)
  let gradeView = null
  if (stored.gradeId) {
    const grade = parseGradeStored(await env.CLASSES.get(stored.gradeId))
    if (grade) gradeView = await buildGradeView(env, stored.gradeId, grade, now)
  }
  return json(request, 200, publicClass(loaded.code, stored, now, gradeView))
}

async function handleCreateGrade(request, env) {
  if (
    !rateLimit(
      `gradeCreate:${clientKey(request)}`,
      RATE_LIMITS.gradeCreate.limit,
      RATE_LIMITS.gradeCreate.windowMs,
    )
  ) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE')
  }
  if (!env.CLASSES) {
    return errorJson(request, 503, 'KV-Bindung CLASSES fehlt.', 'NO_KV')
  }
  let body
  try {
    body = await readJson(request)
  } catch {
    return errorJson(request, 400, 'Ungültiges JSON.', 'BAD_JSON')
  }
  const named = readDisplayName(body, 'Bitte einen Namen für die Klassenstufe eingeben.')
  if (named.error) return errorJson(request, 400, named.error, 'BAD_NAME')
  const code = await allocateCode(env)
  if (!code) {
    return errorJson(request, 503, 'Kein freier Stufencode. Bitte erneut versuchen.', 'BUSY')
  }
  const stored = { type: 'grade', name: named.name, createdAt: Date.now(), classes: [] }
  await env.CLASSES.put(code, JSON.stringify(stored))
  const view = await buildGradeView(env, code, stored)
  return json(request, 201, { code, ...publicGradeView(view) })
}

async function handleGetGrade(request, env, rawCode) {
  if (!rateLimit(`get:${clientKey(request)}`, RATE_LIMITS.get.limit, RATE_LIMITS.get.windowMs)) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE')
  }
  const loaded = await loadGrade(env, rawCode)
  const err = gradeLoadError(request, loaded)
  if (err) return err
  const view = await buildGradeView(env, loaded.code, loaded.stored)
  return json(request, 200, publicGradeView(view))
}

async function handleDeleteGrade(request, env, rawCode) {
  if (!rateLimit(`delete:${clientKey(request)}`, RATE_LIMITS.delete.limit, RATE_LIMITS.delete.windowMs)) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE')
  }
  const loaded = await loadGrade(env, rawCode)
  const err = gradeLoadError(request, loaded)
  if (err) return err
  for (const classCode of loaded.stored.classes) {
    const stored = parseClassStored(await env.CLASSES.get(classCode))
    if (!stored || stored.gradeId !== loaded.code) continue
    await putClass(env, classCode, { ...stored, gradeId: undefined })
  }
  await env.CLASSES.delete(loaded.code)
  return json(request, 200, { ok: true, deleted: loaded.code })
}

async function handleUpdateGradeClasses(request, env, rawCode) {
  if (
    !rateLimit(
      `gradeUpdate:${clientKey(request)}`,
      RATE_LIMITS.gradeUpdate.limit,
      RATE_LIMITS.gradeUpdate.windowMs,
    )
  ) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE')
  }
  let body
  try {
    body = await readJson(request)
  } catch {
    return errorJson(request, 400, 'Ungültiges JSON.', 'BAD_JSON')
  }
  const add = uniqueValidCodes(body.add)
  const remove = uniqueValidCodes(body.remove)
  if (add.length === 0 && remove.length === 0) {
    return errorJson(request, 400, 'Bitte Klassencodes zum Zuordnen oder Entfernen senden.', 'BAD_BODY')
  }
  const loaded = await loadGrade(env, rawCode)
  const err = gradeLoadError(request, loaded)
  if (err) return err

  const adding = []
  for (const classCode of add) {
    const stored = parseClassStored(await env.CLASSES.get(classCode))
    if (!stored) {
      return errorJson(
        request,
        400,
        'Einer der Klassencodes existiert nicht oder ist ein Stufencode.',
        'BAD_CLASS',
      )
    }
    adding.push({ code: classCode, stored })
  }

  const members = new Set(loaded.stored.classes)
  for (const classCode of remove) members.delete(classCode)
  for (const row of adding) members.add(row.code)
  const nextClasses = [...members]
  if (nextClasses.length > MAX_GRADE_CLASSES) {
    return errorJson(
      request,
      400,
      `Eine Stufe darf höchstens ${MAX_GRADE_CLASSES} Klassen haben.`,
      'TOO_MANY',
    )
  }

  for (const classCode of remove) {
    const stored = parseClassStored(await env.CLASSES.get(classCode))
    if (stored && stored.gradeId === loaded.code) {
      await putClass(env, classCode, { ...stored, gradeId: undefined })
    }
  }
  for (const row of adding) {
    if (row.stored.gradeId && row.stored.gradeId !== loaded.code) {
      await unlinkClassFromGrade(env, row.code, row.stored.gradeId)
    }
    await putClass(env, row.code, { ...row.stored, gradeId: loaded.code })
  }

  const nextGrade = { ...loaded.stored, classes: nextClasses }
  await env.CLASSES.put(loaded.code, JSON.stringify(serializeGrade(nextGrade)))
  const view = await buildGradeView(env, loaded.code, nextGrade)
  return json(request, 200, publicGradeView(view))
}

async function allocateChallengeId(env) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const id = generateClassCode()
    const existing = await env.CLASSES.get(challengeIndexKey(id))
    if (existing) continue
    return id
  }
  return null
}

function readChallengeCreateBody(body) {
  const scope = body.scope === 'grade' ? 'grade' : body.scope === 'class' ? 'class' : ''
  if (!scope) return { error: 'Bitte den Umfang Klasse oder Stufe wählen.', code: 'BAD_SCOPE' }
  const named = readDisplayName(body, 'Bitte einen Challenge-Namen eingeben.')
  if (named.error) return { error: named.error, code: 'BAD_NAME' }
  const topicIds = parseTopicIdsStored(body.topicIds)
  if (topicIds.length === 0) {
    return { error: 'Bitte mindestens ein Challenge-Thema wählen.', code: 'BAD_TOPICS' }
  }
  const start = typeof body.start === 'string' ? body.start.trim() : ''
  const end = typeof body.end === 'string' ? body.end.trim() : ''
  const startMs = parseChallengeInstant(start)
  const endMs = parseChallengeInstant(end)
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs < startMs) {
    return { error: 'Bitte Start und Ende (Europe/Berlin) angeben.', code: 'BAD_WINDOW' }
  }
  const prize = parsePrizeStored(body.prize)
  if (scope === 'grade' && prize.classThreshold != null) {
    delete prize.classThreshold
  }
  const hostCode = normalizeClassCode(scope === 'class' ? body.classCode : body.gradeCode)
  if (!isValidClassCode(hostCode)) {
    return {
      error: scope === 'class' ? 'Bitte einen Klassencode senden.' : 'Bitte einen Stufencode senden.',
      code: 'BAD_HOST',
    }
  }
  return {
    scope,
    hostCode,
    name: named.name,
    topicIds,
    topics: parseTopicsStored(body.topics, topicIds),
    start,
    end,
    prize,
  }
}

async function handleCreateChallenge(request, env) {
  if (
    !rateLimit(
      `challengeCreate:${clientKey(request)}`,
      RATE_LIMITS.challengeCreate.limit,
      RATE_LIMITS.challengeCreate.windowMs,
    )
  ) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE')
  }
  if (!env.CLASSES) {
    return errorJson(request, 503, 'KV-Bindung CLASSES fehlt.', 'NO_KV')
  }
  let body
  try {
    body = await readJson(request)
  } catch {
    return errorJson(request, 400, 'Ungültiges JSON.', 'BAD_JSON')
  }
  const parsed = readChallengeCreateBody(body)
  if (parsed.error) return errorJson(request, 400, parsed.error, parsed.code)

  const id = await allocateChallengeId(env)
  if (!id) {
    return errorJson(request, 503, 'Keine freie Challenge-ID. Bitte erneut versuchen.', 'BUSY')
  }

  const challenge = {
    id,
    name: parsed.name,
    topicIds: parsed.topicIds,
    topics: parsed.topics,
    start: parsed.start,
    end: parsed.end,
    prize: parsed.prize,
    days: {},
    classDays: {},
  }

  if (parsed.scope === 'class') {
    const loaded = await loadClass(env, parsed.hostCode)
    const err = classLoadError(request, loaded)
    if (err) return err
    const stored = {
      ...loaded.stored,
      challenges: { ...(loaded.stored.challenges || {}), [id]: challenge },
    }
    await putClass(env, loaded.code, stored)
    await env.CLASSES.put(
      challengeIndexKey(id),
      JSON.stringify({ scope: 'class', hostCode: loaded.code }),
    )
    return json(request, 201, {
      ...publicClassChallenge(challenge, stored.name, Date.now()),
      host: 'class',
    })
  }

  const loaded = await loadGrade(env, parsed.hostCode)
  const err = gradeLoadError(request, loaded)
  if (err) return err
  const stored = {
    ...loaded.stored,
    challenges: { ...(loaded.stored.challenges || {}), [id]: challenge },
  }
  await env.CLASSES.put(loaded.code, JSON.stringify(serializeGrade(stored)))
  await env.CLASSES.put(
    challengeIndexKey(id),
    JSON.stringify({ scope: 'grade', hostCode: loaded.code }),
  )
  const view = await buildGradeView(env, loaded.code, stored)
  const publicCh =
    view.challenge && view.challenge.id === id
      ? view.challenge
      : publicGradeChallenge(challenge, { ...stored, _classByCode: {} }, Date.now())
  return json(request, 201, { ...publicCh, host: 'grade' })
}

async function handleGetChallenge(request, env, rawId) {
  if (!rateLimit(`get:${clientKey(request)}`, RATE_LIMITS.get.limit, RATE_LIMITS.get.windowMs)) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE')
  }
  const id = normalizeClassCode(rawId)
  if (!isValidClassCode(id)) {
    return errorJson(request, 400, 'Die Challenge-ID ist ungültig.', 'BAD_CODE')
  }
  if (!env.CLASSES) {
    return errorJson(request, 503, 'KV-Bindung CLASSES fehlt.', 'NO_KV')
  }
  const index = parseRaw(await env.CLASSES.get(challengeIndexKey(id)))
  if (!index || typeof index.hostCode !== 'string') {
    return errorJson(request, 404, 'Diese Challenge gibt es nicht.', 'NOT_FOUND')
  }
  const now = Date.now()
  if (index.scope === 'grade') {
    const loaded = await loadGrade(env, index.hostCode)
    const err = gradeLoadError(request, loaded)
    if (err) return err
    const ch = (loaded.stored.challenges || {})[id]
    if (!ch) return errorJson(request, 404, 'Diese Challenge gibt es nicht.', 'NOT_FOUND')
    const view = await buildGradeView(env, loaded.code, loaded.stored, now)
    const fromView = (view.challenges || []).find((row) => row.id === id)
    return json(
      request,
      200,
      fromView || publicGradeChallenge(ch, { ...loaded.stored, _classByCode: {} }, now),
    )
  }
  const loaded = await loadClass(env, index.hostCode)
  const err = classLoadError(request, loaded)
  if (err) return err
  const ch = (loaded.stored.challenges || {})[id]
  if (!ch) return errorJson(request, 404, 'Diese Challenge gibt es nicht.', 'NOT_FOUND')
  return json(request, 200, publicClassChallenge(ch, loaded.stored.name, now))
}

export async function handleRequest(request, env) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(request) })
  }

  const path = pathnameOf(request)
  const method = request.method || 'GET'

  if (path === '/' && (method === 'GET' || method === 'HEAD')) {
    const body = {
      ok: true,
      service: SERVICE,
      hasClasses: Boolean(env && env.CLASSES),
    }
    if (method === 'HEAD') {
      return new Response(null, {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders(request) },
      })
    }
    return json(request, 200, body)
  }

  if (path === '/classes' && method === 'POST') {
    return handleCreate(request, env)
  }

  const classMatch = /^\/classes\/([^/]+)$/.exec(path)
  if (classMatch && method === 'GET') {
    return handleGet(request, env, decodeURIComponent(classMatch[1]))
  }
  if (classMatch && method === 'DELETE') {
    return handleDelete(request, env, decodeURIComponent(classMatch[1]))
  }

  const pointsMatch = /^\/classes\/([^/]+)\/points$/.exec(path)
  if (pointsMatch && method === 'POST') {
    return handlePoints(request, env, decodeURIComponent(pointsMatch[1]))
  }

  if (path === '/grades' && method === 'POST') {
    return handleCreateGrade(request, env)
  }

  const gradeMatch = /^\/grades\/([^/]+)$/.exec(path)
  if (gradeMatch && method === 'GET') {
    return handleGetGrade(request, env, decodeURIComponent(gradeMatch[1]))
  }
  if (gradeMatch && method === 'DELETE') {
    return handleDeleteGrade(request, env, decodeURIComponent(gradeMatch[1]))
  }

  const gradeClassesMatch = /^\/grades\/([^/]+)\/classes$/.exec(path)
  if (gradeClassesMatch && method === 'PUT') {
    return handleUpdateGradeClasses(request, env, decodeURIComponent(gradeClassesMatch[1]))
  }

  if (path === '/challenges' && method === 'POST') {
    return handleCreateChallenge(request, env)
  }

  const challengeMatch = /^\/challenges\/([^/]+)$/.exec(path)
  if (challengeMatch && method === 'GET') {
    return handleGetChallenge(request, env, decodeURIComponent(challengeMatch[1]))
  }

  return errorJson(request, 404, 'Unbekannter Pfad.', 'NOT_FOUND')
}

export default {
  async fetch(request, env) {
    return handleRequest(request, env)
  },
}

export { MAX_POINTS_DELTA, CLASS_CODE_LENGTH, SERVICE, MAX_GRADE_CLASSES }
