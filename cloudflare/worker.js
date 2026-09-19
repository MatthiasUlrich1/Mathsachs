/**
 * Mathsachs class-points Worker (KV binding MUST be named CLASSES).
 *
 * Paste this entire file into dash.cloudflare.com → Workers → mathsachs-punkte
 * → Edit Code, then Deploy. Keep in sync with src/classCode/buckets.ts,
 * src/classCode/code.ts and src/classCode/publicId.ts.
 *
 * Rate limits per client IP / 60s (classroom-safe listing + a few deletes):
 * GET class/grade 300, DELETE 30, POST /classes 8, POST /grades 8,
 * POST /challenges 8, PUT /challenges/:id 30, DELETE /challenges/:id 30,
 * POST /exams 8, PUT /exams/:id 30, DELETE /exams/:id 30,
 * POST /exams/complete 60, POST /exams/:id/complete 60,
 * POST /stats/install 5 / 24h (anonymous install ping),
 * GET /stats/install 60,
 * POST /reports/tasks 10 / 1h (faulty-task reports),
 * POST /reports/tasks/status 60 (anonymous status lookup by report ids),
 * GET /reports/tasks 60 (requires Bearer REPORTS_TOKEN),
 * PATCH /reports/tasks/:id 60 (status + optional replyMessage, REPORTS_TOKEN),
 * DELETE /reports/tasks/:id 30 (REPORTS_TOKEN),
 * PUT grade membership 30, POST points 60.
 * GET / (health) is not rate-limited. Raise GET/DELETE here if a class page
 * with many Eigene Codes still 429s; keep POST points tight against abuse.
 *
 * Privacy: KV stores class/grade display names, daily point buckets,
 * anonymous challenge sums, class exam assignments (name + MSX1 code +
 * anonymous solve counts), a single anonymous install counter, and
 * faulty-task reports (contentId + short comment + optional topic/question
 * snippets + status open|done|fixed + optional replyMessage — never pupil
 * names, user ids, emails or device identifiers).
 * GET /grades never returns member Klassencodes. Points are accepted only
 * on class records. Challenge POST never stores names.
 * POST /stats/install stores only `{ count }` — no IP persistence beyond
 * the short-lived rate-limit map in Worker memory.
 * GET/PATCH/DELETE /reports/tasks require Worker secret REPORTS_TOKEN
 * (Authorization: Bearer … or X-Reports-Token). Must match the app’s
 * REPORTS_READ_TOKEN. Public POST for new reports and anonymous status
 * lookup by known report ids stay open (no PII). Status lookup may return
 * the reporter’s own comment/topicTitle for the requested ids only.
 */
// @ts-nocheck — plain Worker JS; Cloudflare editor checkJs unions are noisy.

const BERLIN_TZ = 'Europe/Berlin'
const CLASS_CODE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
const CLASS_CODE_LENGTH = 8
const MAX_POINTS_DELTA = 100
const MAX_CLASS_NAME_LENGTH = 80
const MAX_GRADE_CLASSES = 40
const SERVICE = 'mathsachs-punkte'
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/

const ALLOWED_METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'

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

/** Upcoming or running — used for GET class/grade embeds (not only the live window). */
export function isChallengeOpen(start, end, now = Date.now()) {
  const from = parseChallengeInstant(start)
  const to = parseChallengeInstant(end)
  if (!Number.isFinite(from) || !Number.isFinite(to) || to < from) return false
  return now <= to
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

function parseCurriculumRefsStored(raw) {
  if (!Array.isArray(raw)) return []
  const out = []
  const seen = new Set()
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const moduleId = typeof item.moduleId === 'string' ? item.moduleId.trim().slice(0, 80) : ''
    const version = typeof item.version === 'string' ? item.version.trim().slice(0, 32) : ''
    if (!moduleId || !version || seen.has(moduleId)) continue
    seen.add(moduleId)
    const row = { moduleId, version }
    if (typeof item.contentHash === 'string' && item.contentHash.trim()) {
      row.contentHash = item.contentHash.trim().slice(0, 64)
    }
    out.push(row)
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
    ...(parseCurriculumRefsStored(raw.curriculumRefs).length
      ? { curriculumRefs: parseCurriculumRefsStored(raw.curriculumRefs) }
      : {}),
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
  if (ch.curriculumRefs && ch.curriculumRefs.length) out.curriculumRefs = ch.curriculumRefs
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
  const threshold =
    prize.enabled && prize.classPrize && typeof prize.classThreshold === 'number'
      ? prize.classThreshold
      : null
  return {
    id: ch.id,
    name: ch.name,
    scope: 'class',
    start: ch.start,
    end: ch.end,
    topicIds: ch.topicIds,
    topics: publicTopics(ch),
    prize,
    ...(ch.curriculumRefs && ch.curriculumRefs.length ? { curriculumRefs: ch.curriculumRefs } : {}),
    points: {
      today: summary.today,
      week: summary.week,
      month: summary.month,
      year: summary.year,
      total: summary.total,
    },
    className,
    active: isInChallengeWindow(ch.start, ch.end, now),
    ...(threshold != null
      ? {
          classThreshold: threshold,
          reachedThreshold: summary.total >= threshold,
        }
      : {}),
  }
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
    topicIds: ch.topicIds,
    topics: publicTopics(ch),
    prize,
    ...(ch.curriculumRefs && ch.curriculumRefs.length ? { curriculumRefs: ch.curriculumRefs } : {}),
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

const EXAM_INDEX_PREFIX = 'E:'
const MAX_EXAM_CODE_PAYLOAD = 50_000

function examIndexKey(id) {
  return `${EXAM_INDEX_PREFIX}${id}`
}

function installStatsKey() {
  return 'stats:installs'
}

function taskReportsKey() {
  return 'reports:tasks'
}

const MAX_TASK_REPORTS = 500
const MAX_REPORT_COMMENT = 500
const MAX_REPORT_QUESTION = 280
const MAX_REPORT_TITLE = 120
const MAX_REPORT_TOPIC_ID = 80
const MAX_REPORT_VERSION = 32
const MAX_REPORT_STATUS_LOOKUP = 40

function trimReportText(value, max) {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim().replace(/\s+/g, ' ')
  if (!trimmed) return ''
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed
}

/** Sanitize Entwickler reply shown to the anonymous reporter (max 500). */
export function sanitizeReportReplyMessage(value) {
  return trimReportText(value, MAX_REPORT_COMMENT)
}

function normalizeReportStatus(value) {
  if (typeof value !== 'string') return 'open'
  const trimmed = value.trim().toLowerCase()
  if (trimmed === 'done' || trimmed === 'erledigt') return 'done'
  if (trimmed === 'fixed' || trimmed === 'korrigiert') return 'fixed'
  return 'open'
}

function parseTaskReports(raw) {
  const list = raw && Array.isArray(raw.reports) ? raw.reports : Array.isArray(raw) ? raw : []
  const out = []
  for (const item of list) {
    if (!item || typeof item !== 'object') continue
    const id = typeof item.id === 'string' ? item.id.trim() : ''
    const comment = trimReportText(item.comment, MAX_REPORT_COMMENT)
    const contentId =
      typeof item.contentId === 'number' && Number.isFinite(item.contentId)
        ? Math.floor(item.contentId)
        : typeof item.contentId === 'string' && /^\d{4}$/.test(item.contentId.trim())
          ? Number.parseInt(item.contentId.trim(), 10)
          : NaN
    if (!id || !comment || !Number.isFinite(contentId) || contentId < 1000 || contentId > 9999) {
      continue
    }
    const at =
      typeof item.at === 'number' && Number.isFinite(item.at) ? Math.floor(item.at) : Date.now()
    const topicId = trimReportText(item.topicId, MAX_REPORT_TOPIC_ID)
    const topicTitle = trimReportText(item.topicTitle, MAX_REPORT_TITLE)
    const areaTitle = trimReportText(item.areaTitle, MAX_REPORT_TITLE)
    const question = trimReportText(item.question, MAX_REPORT_QUESTION)
    const appVersion = trimReportText(item.appVersion, MAX_REPORT_VERSION)
    const status = normalizeReportStatus(item.status)
    const replyMessage = sanitizeReportReplyMessage(item.replyMessage)
    const fixedAt =
      typeof item.fixedAt === 'number' && Number.isFinite(item.fixedAt)
        ? Math.floor(item.fixedAt)
        : undefined
    out.push({
      id,
      at,
      contentId,
      comment,
      status,
      ...(topicId ? { topicId } : {}),
      ...(topicTitle ? { topicTitle } : {}),
      ...(areaTitle ? { areaTitle } : {}),
      ...(question ? { question } : {}),
      ...(appVersion ? { appVersion } : {}),
      ...(replyMessage ? { replyMessage } : {}),
      ...(fixedAt !== undefined ? { fixedAt } : {}),
    })
  }
  return out
}

async function requireReportsAuth(request, env) {
  const expected = typeof env?.REPORTS_TOKEN === 'string' ? env.REPORTS_TOKEN.trim() : ''
  if (!expected) {
    return errorJson(
      request,
      503,
      'REPORTS_TOKEN ist nicht konfiguriert.',
      'NO_REPORTS_TOKEN',
    )
  }
  if (!reportsAuthorized(request, env)) {
    return errorJson(request, 401, 'Nicht autorisiert.', 'UNAUTHORIZED')
  }
  if (!env.CLASSES) {
    return errorJson(request, 503, 'KV-Bindung CLASSES fehlt.', 'NO_KV')
  }
  return null
}

function reportsAuthorized(request, env) {
  const expected = typeof env?.REPORTS_TOKEN === 'string' ? env.REPORTS_TOKEN.trim() : ''
  if (!expected) return false
  const auth = request.headers.get('Authorization') || ''
  const bearer = /^Bearer\s+(\S+)/i.exec(auth)
  const headerToken = (request.headers.get('X-Reports-Token') || '').trim()
  const token = bearer ? bearer[1].trim() : headerToken
  return token.length > 0 && token === expected
}

function parseExamStored(raw) {
  if (!raw || typeof raw !== 'object') return null
  const id = normalizeClassCode(raw.id)
  if (!isValidClassCode(id)) return null
  const name = typeof raw.name === 'string' ? raw.name.trim() : ''
  if (!name || name.length > MAX_CLASS_NAME_LENGTH) return null
  const examCode = typeof raw.examCode === 'string' ? raw.examCode.trim() : ''
  if (!examCode.startsWith('MSX1:') || examCode.length > MAX_EXAM_CODE_PAYLOAD) return null
  const createdAt =
    typeof raw.createdAt === 'number' && Number.isFinite(raw.createdAt) ? raw.createdAt : Date.now()
  const taskCount =
    typeof raw.taskCount === 'number' && Number.isFinite(raw.taskCount)
      ? Math.max(0, Math.floor(raw.taskCount))
      : undefined
  const totalPoints =
    typeof raw.totalPoints === 'number' && Number.isFinite(raw.totalPoints)
      ? Math.max(0, Math.floor(raw.totalPoints))
      : undefined
  const solveCount =
    typeof raw.solveCount === 'number' && Number.isFinite(raw.solveCount)
      ? Math.max(0, Math.floor(raw.solveCount))
      : 0
  return {
    id,
    name,
    examCode,
    createdAt,
    ...(taskCount != null ? { taskCount } : {}),
    ...(totalPoints != null ? { totalPoints } : {}),
    solveCount,
  }
}

function parseExamsMap(raw) {
  const src = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
  const out = {}
  for (const item of Object.values(src)) {
    const parsed = parseExamStored(item)
    if (parsed) out[parsed.id] = parsed
  }
  return out
}

function serializeExam(exam) {
  const out = {
    id: exam.id,
    name: exam.name,
    examCode: exam.examCode,
    createdAt: exam.createdAt,
    solveCount: typeof exam.solveCount === 'number' ? exam.solveCount : 0,
  }
  if (exam.taskCount != null) out.taskCount = exam.taskCount
  if (exam.totalPoints != null) out.totalPoints = exam.totalPoints
  return out
}

function publicClassExam(exam, className) {
  return {
    id: exam.id,
    name: exam.name,
    examCode: exam.examCode,
    createdAt: exam.createdAt,
    solveCount: typeof exam.solveCount === 'number' ? exam.solveCount : 0,
    ...(exam.taskCount != null ? { taskCount: exam.taskCount } : {}),
    ...(exam.totalPoints != null ? { totalPoints: exam.totalPoints } : {}),
    ...(className ? { className } : {}),
  }
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
    exams: parseExamsMap(data.exams),
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
  const exams = stored.exams || {}
  if (Object.keys(exams).length) {
    const packed = {}
    for (const [id, exam] of Object.entries(exams)) packed[id] = serializeExam(exam)
    out.exams = packed
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
  const listedChallenges = Object.values(grade.challenges || {})
    .filter((ch) => isChallengeOpen(ch.start, ch.end, now))
    .map((ch) => publicGradeChallenge(ch, gradeWithClasses, now))
  listedChallenges.sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name, 'de'))
  const view = {
    id: publicIdFromCode(gradeCode),
    name: grade.name,
    classes,
    points,
    period,
  }
  if (listedChallenges.length) {
    view.challenges = listedChallenges
    const live = listedChallenges.find((row) => row.active)
    if (live) view.challenge = live
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
  const classListed = Object.values(stored.challenges || {})
    .filter((ch) => isChallengeOpen(ch.start, ch.end, now))
    .map((ch) => publicClassChallenge(ch, stored.name, now))
  const gradeListed = gradeView && Array.isArray(gradeView.challenges) ? gradeView.challenges : []
  const all = [...classListed, ...gradeListed]
  all.sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name, 'de'))
  if (all.length) {
    body.challenges = all
    const live = all.find((row) => row.active)
    if (live) body.challenge = live
  }
  const listedExams = Object.values(stored.exams || {})
    .map((exam) => publicClassExam(exam, stored.name))
    .sort((a, b) => b.createdAt - a.createdAt || a.name.localeCompare(b.name, 'de'))
  if (listedExams.length) body.exams = listedExams
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
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Reports-Token',
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
  challengeUpdate: { limit: 30, windowMs: 60_000 },
  challengeDelete: { limit: 30, windowMs: 60_000 },
  examCreate: { limit: 8, windowMs: 60_000 },
  examUpdate: { limit: 30, windowMs: 60_000 },
  examDelete: { limit: 30, windowMs: 60_000 },
  examComplete: { limit: 60, windowMs: 60_000 },
  /** One ping per first install; keep daily IP cap low against inflation. */
  installPing: { limit: 5, windowMs: 24 * 60 * 60 * 1000 },
  installGet: { limit: 60, windowMs: 60_000 },
  /** Faulty-task reports — low hourly cap against spam. */
  reportPost: { limit: 10, windowMs: 60 * 60 * 1000 },
  reportStatus: { limit: 60, windowMs: 60_000 },
  reportGet: { limit: 60, windowMs: 60_000 },
  reportPatch: { limit: 60, windowMs: 60_000 },
  reportDelete: { limit: 30, windowMs: 60_000 },
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
    throw Object.assign(new Error('invalid json'), { code: 'INVALID_JSON' })
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

/** Per-class write gate inside one Worker isolate (limits lost updates under burst POSTs). */
const classWriteTails = new Map()

function withClassWriteLock(code, work) {
  const prev = classWriteTails.get(code) || Promise.resolve()
  const run = prev.then(work, work)
  classWriteTails.set(
    code,
    run.then(
      () => undefined,
      () => undefined,
    ),
  )
  return run
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
  const codeHint = normalizeClassCode(rawCode)
  if (!isValidClassCode(codeHint)) {
    return errorJson(request, 400, 'Der Klassencode ist ungültig.', 'BAD_CODE')
  }

  return withClassWriteLock(codeHint, async () => {
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
  })
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
    curriculumRefs: parseCurriculumRefsStored(body.curriculumRefs),
  }
}

function readChallengeUpdateBody(body, scope) {
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
  return {
    name: named.name,
    topicIds,
    topics: parseTopicsStored(body.topics, topicIds),
    start,
    end,
    prize,
    curriculumRefs: parseCurriculumRefsStored(body.curriculumRefs),
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
    ...(parsed.curriculumRefs && parsed.curriculumRefs.length
      ? { curriculumRefs: parsed.curriculumRefs }
      : {}),
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

async function loadChallengeHost(env, rawId) {
  const id = normalizeClassCode(rawId)
  if (!isValidClassCode(id)) {
    return { error: { status: 400, message: 'Die Challenge-ID ist ungültig.', code: 'BAD_CODE' } }
  }
  if (!env.CLASSES) {
    return { error: { status: 503, message: 'KV-Bindung CLASSES fehlt.', code: 'NO_KV' } }
  }
  const index = parseRaw(await env.CLASSES.get(challengeIndexKey(id)))
  if (!index || typeof index.hostCode !== 'string') {
    return { error: { status: 404, message: 'Diese Challenge gibt es nicht.', code: 'NOT_FOUND' } }
  }
  return { id, index }
}

async function handleUpdateChallenge(request, env, rawId) {
  if (
    !rateLimit(
      `challengeUpdate:${clientKey(request)}`,
      RATE_LIMITS.challengeUpdate.limit,
      RATE_LIMITS.challengeUpdate.windowMs,
    )
  ) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE')
  }
  const found = await loadChallengeHost(env, rawId)
  if (found.error) {
    return errorJson(request, found.error.status, found.error.message, found.error.code)
  }
  let body
  try {
    body = await readJson(request)
  } catch {
    return errorJson(request, 400, 'Ungültiges JSON.', 'BAD_JSON')
  }
  const parsed = readChallengeUpdateBody(body, found.index.scope)
  if (parsed.error) return errorJson(request, 400, parsed.error, parsed.code)

  const now = Date.now()
  if (found.index.scope === 'grade') {
    const loaded = await loadGrade(env, found.index.hostCode)
    const err = gradeLoadError(request, loaded)
    if (err) return err
    const existing = (loaded.stored.challenges || {})[found.id]
    if (!existing) return errorJson(request, 404, 'Diese Challenge gibt es nicht.', 'NOT_FOUND')
    const challenge = {
      ...existing,
      id: found.id,
      name: parsed.name,
      topicIds: parsed.topicIds,
      topics: parsed.topics,
      start: parsed.start,
      end: parsed.end,
      prize: parsed.prize,
      days: existing.days || {},
      classDays: existing.classDays || {},
      ...(parsed.curriculumRefs && parsed.curriculumRefs.length
        ? { curriculumRefs: parsed.curriculumRefs }
        : {}),
    }
    const stored = {
      ...loaded.stored,
      challenges: { ...(loaded.stored.challenges || {}), [found.id]: challenge },
    }
    await env.CLASSES.put(loaded.code, JSON.stringify(serializeGrade(stored)))
    const view = await buildGradeView(env, loaded.code, stored, now)
    const fromView = (view.challenges || []).find((row) => row.id === found.id)
    return json(
      request,
      200,
      fromView || publicGradeChallenge(challenge, { ...stored, _classByCode: {} }, now),
    )
  }

  const loaded = await loadClass(env, found.index.hostCode)
  const err = classLoadError(request, loaded)
  if (err) return err
  const existing = (loaded.stored.challenges || {})[found.id]
  if (!existing) return errorJson(request, 404, 'Diese Challenge gibt es nicht.', 'NOT_FOUND')
  const challenge = {
    ...existing,
    id: found.id,
    name: parsed.name,
    topicIds: parsed.topicIds,
    topics: parsed.topics,
    start: parsed.start,
    end: parsed.end,
    prize: parsed.prize,
    days: existing.days || {},
    classDays: existing.classDays || {},
    ...(parsed.curriculumRefs && parsed.curriculumRefs.length
      ? { curriculumRefs: parsed.curriculumRefs }
      : {}),
  }
  const stored = {
    ...loaded.stored,
    challenges: { ...(loaded.stored.challenges || {}), [found.id]: challenge },
  }
  await putClass(env, loaded.code, stored)
  return json(request, 200, publicClassChallenge(challenge, stored.name, now))
}

async function handleDeleteChallenge(request, env, rawId) {
  if (
    !rateLimit(
      `challengeDelete:${clientKey(request)}`,
      RATE_LIMITS.challengeDelete.limit,
      RATE_LIMITS.challengeDelete.windowMs,
    )
  ) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE')
  }
  const found = await loadChallengeHost(env, rawId)
  if (found.error) {
    return errorJson(request, found.error.status, found.error.message, found.error.code)
  }

  if (found.index.scope === 'grade') {
    const loaded = await loadGrade(env, found.index.hostCode)
    const err = gradeLoadError(request, loaded)
    if (err) return err
    const challenges = { ...(loaded.stored.challenges || {}) }
    delete challenges[found.id]
    await env.CLASSES.put(
      loaded.code,
      JSON.stringify(serializeGrade({ ...loaded.stored, challenges })),
    )
  } else {
    const loaded = await loadClass(env, found.index.hostCode)
    const err = classLoadError(request, loaded)
    if (err) return err
    const challenges = { ...(loaded.stored.challenges || {}) }
    delete challenges[found.id]
    await putClass(env, loaded.code, { ...loaded.stored, challenges })
  }
  await env.CLASSES.delete(challengeIndexKey(found.id))
  return json(request, 200, { ok: true, deleted: found.id })
}

async function allocateExamId(env) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const id = generateClassCode()
    const existing = await env.CLASSES.get(examIndexKey(id))
    if (existing) continue
    return id
  }
  return null
}

function readExamCreateBody(body) {
  const named = readDisplayName(body, 'Bitte einen Klausur-Namen eingeben.')
  if (named.error) return { ok: false, error: named.error, code: 'BAD_NAME' }
  const examCode = typeof body.examCode === 'string' ? body.examCode.trim() : ''
  if (!examCode.startsWith('MSX1:') || examCode.length > MAX_EXAM_CODE_PAYLOAD) {
    return {
      ok: false,
      error: 'Bitte einen gültigen Klausurcode (MSX1:…) senden.',
      code: 'BAD_EXAM',
    }
  }
  const taskCount =
    typeof body.taskCount === 'number' && Number.isFinite(body.taskCount)
      ? Math.max(0, Math.floor(body.taskCount))
      : undefined
  const totalPoints =
    typeof body.totalPoints === 'number' && Number.isFinite(body.totalPoints)
      ? Math.max(0, Math.floor(body.totalPoints))
      : undefined
  const hostCode = normalizeClassCode(body.classCode)
  const gradeCode = normalizeClassCode(body.gradeCode)
  const classId = typeof body.classId === 'string' ? body.classId.trim() : ''
  if (isValidClassCode(hostCode)) {
    return {
      ok: true,
      hostCode,
      name: named.name,
      examCode,
      taskCount,
      totalPoints,
    }
  }
  if (isValidClassCode(gradeCode) && classId) {
    return {
      ok: true,
      gradeCode,
      classId,
      name: named.name,
      examCode,
      taskCount,
      totalPoints,
    }
  }
  return {
    ok: false,
    error:
      'Bitte einen Klassencode senden — oder Stufencode plus Klassen-ID (aus der Stufe).',
    code: 'BAD_HOST',
  }
}

async function resolveExamHostCode(env, input) {
  if (input.hostCode) return { hostCode: input.hostCode }
  const loadedGrade = await loadGrade(env, input.gradeCode)
  if (loadedGrade.error) {
    const status =
      loadedGrade.error === 'BAD_CODE' || loadedGrade.error === 'NOT_GRADE'
        ? 400
        : loadedGrade.error === 'NO_KV'
          ? 503
          : 404
    const message =
      loadedGrade.error === 'BAD_CODE'
        ? 'Der Stufencode ist ungültig.'
        : loadedGrade.error === 'NOT_GRADE'
          ? 'Das ist ein Klassencode, kein Stufencode.'
          : loadedGrade.error === 'NO_KV'
            ? 'KV-Bindung CLASSES fehlt.'
            : 'Diesen Stufencode gibt es nicht.'
    return { error: { status, message, code: loadedGrade.error } }
  }
  const match = (loadedGrade.stored.classes || []).find(
    (code) => publicIdFromCode(code) === input.classId,
  )
  if (!match) {
    return {
      error: {
        status: 404,
        message: 'Diese Klasse gehört nicht zur Stufe (oder die ID ist ungültig).',
        code: 'NOT_FOUND',
      },
    }
  }
  return { hostCode: match }
}

async function handleCreateExam(request, env) {
  if (
    !rateLimit(
      `examCreate:${clientKey(request)}`,
      RATE_LIMITS.examCreate.limit,
      RATE_LIMITS.examCreate.windowMs,
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
  const parsed = readExamCreateBody(body)
  if (!parsed.ok) return errorJson(request, 400, parsed.error, parsed.code)
  const examName = parsed.name
  const examCode = parsed.examCode
  const examTaskCount = parsed.taskCount
  const examTotalPoints = parsed.totalPoints

  const resolved = await resolveExamHostCode(env, parsed)
  if (resolved.error) {
    return errorJson(
      request,
      resolved.error.status,
      resolved.error.message,
      resolved.error.code,
    )
  }

  const id = await allocateExamId(env)
  if (!id) {
    return errorJson(request, 503, 'Keine freie Klausur-ID. Bitte erneut versuchen.', 'BUSY')
  }

  const loaded = await loadClass(env, resolved.hostCode)
  const err = classLoadError(request, loaded)
  if (err) return err

  const exam = {
    id,
    name: examName,
    examCode,
    createdAt: Date.now(),
    solveCount: 0,
    ...(examTaskCount != null ? { taskCount: examTaskCount } : {}),
    ...(examTotalPoints != null ? { totalPoints: examTotalPoints } : {}),
  }
  const stored = {
    ...loaded.stored,
    exams: { ...(loaded.stored.exams || {}), [id]: exam },
  }
  await putClass(env, loaded.code, stored)
  await env.CLASSES.put(examIndexKey(id), JSON.stringify({ hostCode: loaded.code }))
  return json(request, 201, {
    ...publicClassExam(exam, stored.name),
    hostCode: loaded.code,
  })
}

async function loadExamHost(env, rawId) {
  const id = normalizeClassCode(rawId)
  if (!isValidClassCode(id)) {
    return { error: { status: 400, message: 'Die Klausur-ID ist ungültig.', code: 'BAD_CODE' } }
  }
  if (!env.CLASSES) {
    return { error: { status: 503, message: 'KV-Bindung CLASSES fehlt.', code: 'NO_KV' } }
  }
  const index = parseRaw(await env.CLASSES.get(examIndexKey(id)))
  if (!index || typeof index.hostCode !== 'string') {
    return { error: { status: 404, message: 'Diese Klausur gibt es nicht.', code: 'NOT_FOUND' } }
  }
  return { id, index: { hostCode: normalizeClassCode(index.hostCode) } }
}

async function handleGetExam(request, env, rawId) {
  if (!rateLimit(`get:${clientKey(request)}`, RATE_LIMITS.get.limit, RATE_LIMITS.get.windowMs)) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE')
  }
  const found = await loadExamHost(env, rawId)
  if (found.error) {
    return errorJson(request, found.error.status, found.error.message, found.error.code)
  }
  const loaded = await loadClass(env, found.index.hostCode)
  const err = classLoadError(request, loaded)
  if (err) return err
  const exam = (loaded.stored.exams || {})[found.id]
  if (!exam) return errorJson(request, 404, 'Diese Klausur gibt es nicht.', 'NOT_FOUND')
  return json(request, 200, publicClassExam(exam, loaded.stored.name))
}

async function handleUpdateExam(request, env, rawId) {
  if (
    !rateLimit(
      `examUpdate:${clientKey(request)}`,
      RATE_LIMITS.examUpdate.limit,
      RATE_LIMITS.examUpdate.windowMs,
    )
  ) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE')
  }
  const found = await loadExamHost(env, rawId)
  if (found.error) {
    return errorJson(request, found.error.status, found.error.message, found.error.code)
  }
  let body
  try {
    body = await readJson(request)
  } catch {
    return errorJson(request, 400, 'Ungültiges JSON.', 'BAD_JSON')
  }
  const named = readDisplayName(body, 'Bitte einen Klausur-Namen eingeben.')
  if (named.error) return errorJson(request, 400, named.error, 'BAD_NAME')
  const examCode = typeof body.examCode === 'string' ? body.examCode.trim() : ''
  if (!examCode.startsWith('MSX1:') || examCode.length > MAX_EXAM_CODE_PAYLOAD) {
    return errorJson(request, 400, 'Bitte einen gültigen Klausurcode (MSX1:…) senden.', 'BAD_EXAM')
  }
  const nextHost = normalizeClassCode(body.classCode || found.index.hostCode)
  if (!isValidClassCode(nextHost)) {
    return errorJson(request, 400, 'Bitte einen Klassencode senden.', 'BAD_HOST')
  }
  const taskCount =
    typeof body.taskCount === 'number' && Number.isFinite(body.taskCount)
      ? Math.max(0, Math.floor(body.taskCount))
      : undefined
  const totalPoints =
    typeof body.totalPoints === 'number' && Number.isFinite(body.totalPoints)
      ? Math.max(0, Math.floor(body.totalPoints))
      : undefined

  const oldLoaded = await loadClass(env, found.index.hostCode)
  const oldErr = classLoadError(request, oldLoaded)
  if (oldErr) return oldErr
  const existing = (oldLoaded.stored.exams || {})[found.id]
  if (!existing) return errorJson(request, 404, 'Diese Klausur gibt es nicht.', 'NOT_FOUND')

  const exam = {
    ...existing,
    id: found.id,
    name: named.name,
    examCode,
    createdAt: existing.createdAt || Date.now(),
    ...(taskCount != null ? { taskCount } : {}),
    ...(totalPoints != null ? { totalPoints } : {}),
  }

  if (nextHost === oldLoaded.code) {
    const stored = {
      ...oldLoaded.stored,
      exams: { ...(oldLoaded.stored.exams || {}), [found.id]: exam },
    }
    await putClass(env, oldLoaded.code, stored)
    return json(request, 200, publicClassExam(exam, stored.name))
  }

  const newLoaded = await loadClass(env, nextHost)
  const newErr = classLoadError(request, newLoaded)
  if (newErr) return newErr

  const oldExams = { ...(oldLoaded.stored.exams || {}) }
  delete oldExams[found.id]
  await putClass(env, oldLoaded.code, { ...oldLoaded.stored, exams: oldExams })

  const stored = {
    ...newLoaded.stored,
    exams: { ...(newLoaded.stored.exams || {}), [found.id]: exam },
  }
  await putClass(env, newLoaded.code, stored)
  await env.CLASSES.put(examIndexKey(found.id), JSON.stringify({ hostCode: newLoaded.code }))
  return json(request, 200, publicClassExam(exam, stored.name))
}

async function handleDeleteExam(request, env, rawId) {
  if (
    !rateLimit(
      `examDelete:${clientKey(request)}`,
      RATE_LIMITS.examDelete.limit,
      RATE_LIMITS.examDelete.windowMs,
    )
  ) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE')
  }
  const found = await loadExamHost(env, rawId)
  if (found.error) {
    return errorJson(request, found.error.status, found.error.message, found.error.code)
  }
  const loaded = await loadClass(env, found.index.hostCode)
  const err = classLoadError(request, loaded)
  if (err) return err
  const exams = { ...(loaded.stored.exams || {}) }
  delete exams[found.id]
  await putClass(env, loaded.code, { ...loaded.stored, exams })
  await env.CLASSES.delete(examIndexKey(found.id))
  return json(request, 200, { ok: true, deleted: found.id })
}

function normalizeExamCodeKey(raw) {
  return String(raw || '')
    .trim()
    .replace(/\s+/g, '')
}

/** Bump anonymous solveCount for an exam already loaded on its host class. */
async function bumpExamSolveCount(env, loaded, examId) {
  const existing = (loaded.stored.exams || {})[examId]
  if (!existing) return null
  const prev =
    typeof existing.solveCount === 'number' && Number.isFinite(existing.solveCount)
      ? Math.max(0, Math.floor(existing.solveCount))
      : 0
  const exam = { ...existing, solveCount: prev + 1 }
  const stored = {
    ...loaded.stored,
    exams: { ...(loaded.stored.exams || {}), [examId]: exam },
  }
  await putClass(env, loaded.code, stored)
  return { exam, stored }
}

/** Anonymous completion counter — no pupil identity stored. */
async function handleCompleteExam(request, env, rawId) {
  if (
    !rateLimit(
      `examComplete:${clientKey(request)}`,
      RATE_LIMITS.examComplete.limit,
      RATE_LIMITS.examComplete.windowMs,
    )
  ) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE')
  }
  const found = await loadExamHost(env, rawId)
  if (found.error) {
    return errorJson(request, found.error.status, found.error.message, found.error.code)
  }
  const loaded = await loadClass(env, found.index.hostCode)
  const err = classLoadError(request, loaded)
  if (err) return err
  const bumped = await bumpExamSolveCount(env, loaded, found.id)
  if (!bumped) return errorJson(request, 404, 'Diese Klausur gibt es nicht.', 'NOT_FOUND')
  return json(request, 200, publicClassExam(bumped.exam, bumped.stored.name))
}

/**
 * Complete by Klassencode + MSX1 payload — clients that only have the share
 * code (no local exam id) can still increment the Lehrer solveCount.
 */
async function handleCompleteExamByCode(request, env) {
  if (
    !rateLimit(
      `examComplete:${clientKey(request)}`,
      RATE_LIMITS.examComplete.limit,
      RATE_LIMITS.examComplete.windowMs,
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
  const classCode = normalizeClassCode(body && body.classCode)
  const examCode = normalizeExamCodeKey(body && body.examCode)
  if (!isValidClassCode(classCode)) {
    return errorJson(request, 400, 'Der Klassencode ist ungültig.', 'BAD_CODE')
  }
  if (!examCode.startsWith('MSX1:')) {
    return errorJson(request, 400, 'Der Klausurcode ist ungültig.', 'BAD_EXAM')
  }
  const loaded = await loadClass(env, classCode)
  const err = classLoadError(request, loaded)
  if (err) return err
  const match = Object.values(loaded.stored.exams || {}).find(
    (exam) => normalizeExamCodeKey(exam.examCode) === examCode,
  )
  if (!match) {
    return errorJson(
      request,
      404,
      'Diese Klausur ist der Klasse nicht zugeordnet.',
      'NOT_FOUND',
    )
  }
  const bumped = await bumpExamSolveCount(env, loaded, match.id)
  if (!bumped) return errorJson(request, 404, 'Diese Klausur gibt es nicht.', 'NOT_FOUND')
  return json(request, 200, publicClassExam(bumped.exam, bumped.stored.name))
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
  if (challengeMatch && method === 'PUT') {
    return handleUpdateChallenge(request, env, decodeURIComponent(challengeMatch[1]))
  }
  if (challengeMatch && method === 'DELETE') {
    return handleDeleteChallenge(request, env, decodeURIComponent(challengeMatch[1]))
  }

  if (path === '/exams' && method === 'POST') {
    return handleCreateExam(request, env)
  }

  if (path === '/exams/complete' && method === 'POST') {
    return handleCompleteExamByCode(request, env)
  }

  const examMatch = /^\/exams\/([^/]+)$/.exec(path)
  if (examMatch && method === 'GET') {
    return handleGetExam(request, env, decodeURIComponent(examMatch[1]))
  }
  if (examMatch && method === 'PUT') {
    return handleUpdateExam(request, env, decodeURIComponent(examMatch[1]))
  }
  if (examMatch && method === 'DELETE') {
    return handleDeleteExam(request, env, decodeURIComponent(examMatch[1]))
  }

  const examCompleteMatch = /^\/exams\/([^/]+)\/complete$/.exec(path)
  if (examCompleteMatch && method === 'POST') {
    return handleCompleteExam(request, env, decodeURIComponent(examCompleteMatch[1]))
  }

  if (path === '/stats/install' && method === 'GET') {
    return handleGetInstallCount(request, env)
  }
  if (path === '/stats/install' && method === 'POST') {
    return handlePingInstall(request, env)
  }

  if (path === '/reports/tasks' && method === 'POST') {
    return handleCreateTaskReport(request, env)
  }
  if (path === '/reports/tasks/status' && method === 'POST') {
    return handleLookupTaskReportStatus(request, env)
  }
  if (path === '/reports/tasks' && method === 'GET') {
    return handleListTaskReports(request, env)
  }
  const reportMatch = /^\/reports\/tasks\/([^/]+)$/.exec(path)
  if (reportMatch && method === 'PATCH') {
    return handlePatchTaskReport(request, env, decodeURIComponent(reportMatch[1]))
  }
  if (reportMatch && method === 'DELETE') {
    return handleDeleteTaskReport(request, env, decodeURIComponent(reportMatch[1]))
  }

  return errorJson(request, 404, 'Unbekannter Pfad.', 'NOT_FOUND')
}

/** Anonymous install counter — no device id, no user payload. */
async function handleGetInstallCount(request, env) {
  if (
    !rateLimit(
      `installGet:${clientKey(request)}`,
      RATE_LIMITS.installGet.limit,
      RATE_LIMITS.installGet.windowMs,
    )
  ) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE_LIMIT')
  }
  if (!env.CLASSES) {
    return errorJson(request, 503, 'KV-Bindung CLASSES fehlt.', 'NO_KV')
  }
  const raw = parseRaw(await env.CLASSES.get(installStatsKey()))
  const count =
    raw && typeof raw.count === 'number' && Number.isFinite(raw.count)
      ? Math.max(0, Math.floor(raw.count))
      : 0
  return json(request, 200, { count })
}

async function handlePingInstall(request, env) {
  if (
    !rateLimit(
      `installPing:${clientKey(request)}`,
      RATE_LIMITS.installPing.limit,
      RATE_LIMITS.installPing.windowMs,
    )
  ) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE_LIMIT')
  }
  if (!env.CLASSES) {
    return errorJson(request, 503, 'KV-Bindung CLASSES fehlt.', 'NO_KV')
  }
  const raw = parseRaw(await env.CLASSES.get(installStatsKey()))
  const prev =
    raw && typeof raw.count === 'number' && Number.isFinite(raw.count)
      ? Math.max(0, Math.floor(raw.count))
      : 0
  const count = prev + 1
  await env.CLASSES.put(installStatsKey(), JSON.stringify({ count }))
  return json(request, 200, { count })
}

async function handleCreateTaskReport(request, env) {
  if (
    !rateLimit(
      `reportPost:${clientKey(request)}`,
      RATE_LIMITS.reportPost.limit,
      RATE_LIMITS.reportPost.windowMs,
    )
  ) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE_LIMIT')
  }
  if (!env.CLASSES) {
    return errorJson(request, 503, 'KV-Bindung CLASSES fehlt.', 'NO_KV')
  }

  let body
  try {
    body = await readJson(request)
  } catch {
    return errorJson(request, 400, 'Ungültiges JSON.', 'INVALID_JSON')
  }

  const contentIdRaw = body.contentId
  const contentId =
    typeof contentIdRaw === 'number' && Number.isFinite(contentIdRaw)
      ? Math.floor(contentIdRaw)
      : typeof contentIdRaw === 'string' && /^\d{4}$/.test(contentIdRaw.trim())
        ? Number.parseInt(contentIdRaw.trim(), 10)
        : NaN
  if (!Number.isFinite(contentId) || contentId < 1000 || contentId > 9999) {
    return errorJson(request, 400, 'Ungültige Content-ID.', 'INVALID_CONTENT_ID')
  }

  const comment = trimReportText(body.comment, MAX_REPORT_COMMENT)
  if (!comment) {
    return errorJson(request, 400, 'Bitte einen kurzen Kommentar eingeben.', 'INVALID_COMMENT')
  }

  const topicId = trimReportText(body.topicId, MAX_REPORT_TOPIC_ID)
  const topicTitle = trimReportText(body.topicTitle, MAX_REPORT_TITLE)
  const areaTitle = trimReportText(body.areaTitle, MAX_REPORT_TITLE)
  const question = trimReportText(body.question, MAX_REPORT_QUESTION)
  const appVersion = trimReportText(body.appVersion, MAX_REPORT_VERSION)

  const report = {
    id: generateClassCode(),
    at: Date.now(),
    contentId,
    comment,
    status: 'open',
    ...(topicId ? { topicId } : {}),
    ...(topicTitle ? { topicTitle } : {}),
    ...(areaTitle ? { areaTitle } : {}),
    ...(question ? { question } : {}),
    ...(appVersion ? { appVersion } : {}),
  }

  const existing = parseTaskReports(parseRaw(await env.CLASSES.get(taskReportsKey())))
  const next = [report, ...existing].slice(0, MAX_TASK_REPORTS)
  await env.CLASSES.put(taskReportsKey(), JSON.stringify({ reports: next }))
  return json(request, 201, { ok: true, id: report.id })
}

async function handleListTaskReports(request, env) {
  if (
    !rateLimit(
      `reportGet:${clientKey(request)}`,
      RATE_LIMITS.reportGet.limit,
      RATE_LIMITS.reportGet.windowMs,
    )
  ) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE_LIMIT')
  }
  const authError = await requireReportsAuth(request, env)
  if (authError) return authError
  const reports = parseTaskReports(parseRaw(await env.CLASSES.get(taskReportsKey())))
  return json(request, 200, { reports })
}

async function handleLookupTaskReportStatus(request, env) {
  if (
    !rateLimit(
      `reportStatus:${clientKey(request)}`,
      RATE_LIMITS.reportStatus.limit,
      RATE_LIMITS.reportStatus.windowMs,
    )
  ) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE_LIMIT')
  }
  if (!env.CLASSES) {
    return errorJson(request, 503, 'KV-Bindung CLASSES fehlt.', 'NO_KV')
  }

  let body
  try {
    body = await readJson(request)
  } catch {
    return errorJson(request, 400, 'Ungültiges JSON.', 'INVALID_JSON')
  }

  const rawIds = body && Array.isArray(body.ids) ? body.ids : null
  if (!rawIds) {
    return errorJson(request, 400, 'IDs fehlen.', 'INVALID_IDS')
  }
  const ids = []
  const seen = new Set()
  for (const value of rawIds) {
    if (typeof value !== 'string') continue
    const id = value.trim()
    if (!id || seen.has(id)) continue
    seen.add(id)
    ids.push(id)
    if (ids.length >= MAX_REPORT_STATUS_LOOKUP) break
  }

  const existing = parseTaskReports(parseRaw(await env.CLASSES.get(taskReportsKey())))
  const byId = new Map(existing.map((row) => [row.id, row]))
  const reports = []
  for (const id of ids) {
    const row = byId.get(id)
    if (!row) continue
    // Own-id lookup only: safe to return the reporter’s own comment/title
    // (no pupil names or other PII are stored on reports).
    reports.push({
      id: row.id,
      status: row.status,
      contentId: row.contentId,
      ...(row.comment ? { comment: row.comment } : {}),
      ...(row.topicTitle ? { topicTitle: row.topicTitle } : {}),
      ...(row.replyMessage ? { replyMessage: row.replyMessage } : {}),
      ...(typeof row.fixedAt === 'number' ? { fixedAt: row.fixedAt } : {}),
    })
  }
  return json(request, 200, { reports })
}

async function handlePatchTaskReport(request, env, rawId) {
  if (
    !rateLimit(
      `reportPatch:${clientKey(request)}`,
      RATE_LIMITS.reportPatch.limit,
      RATE_LIMITS.reportPatch.windowMs,
    )
  ) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE_LIMIT')
  }
  const authError = await requireReportsAuth(request, env)
  if (authError) return authError

  const id = typeof rawId === 'string' ? rawId.trim() : ''
  if (!id) {
    return errorJson(request, 400, 'Ungültige Melde-ID.', 'INVALID_REPORT_ID')
  }

  let body
  try {
    body = await readJson(request)
  } catch {
    return errorJson(request, 400, 'Ungültiges JSON.', 'INVALID_JSON')
  }

  if (!body || typeof body !== 'object' || body.status === undefined) {
    return errorJson(request, 400, 'Status fehlt.', 'INVALID_STATUS')
  }
  const statusRaw = typeof body.status === 'string' ? body.status.trim().toLowerCase() : ''
  if (
    statusRaw !== 'open' &&
    statusRaw !== 'done' &&
    statusRaw !== 'erledigt' &&
    statusRaw !== 'fixed' &&
    statusRaw !== 'korrigiert'
  ) {
    return errorJson(request, 400, 'Ungültiger Status.', 'INVALID_STATUS')
  }
  const status = normalizeReportStatus(statusRaw)
  const hasReplyField = Object.prototype.hasOwnProperty.call(body, 'replyMessage')
  const replyMessage = hasReplyField ? sanitizeReportReplyMessage(body.replyMessage) : undefined

  const existing = parseTaskReports(parseRaw(await env.CLASSES.get(taskReportsKey())))
  const index = existing.findIndex((row) => row.id === id)
  if (index < 0) {
    return errorJson(request, 404, 'Meldung nicht gefunden.', 'NOT_FOUND')
  }
  const prev = existing[index]
  const updated = { ...prev, status }
  if (status === 'fixed') {
    updated.fixedAt =
      typeof prev.fixedAt === 'number' && Number.isFinite(prev.fixedAt)
        ? prev.fixedAt
        : Date.now()
    if (hasReplyField) {
      if (replyMessage) updated.replyMessage = replyMessage
      else delete updated.replyMessage
    }
  } else if (status === 'open' || status === 'done') {
    delete updated.replyMessage
    delete updated.fixedAt
  }
  const next = [...existing]
  next[index] = updated
  await env.CLASSES.put(taskReportsKey(), JSON.stringify({ reports: next }))
  return json(request, 200, { ok: true, report: updated })
}

async function handleDeleteTaskReport(request, env, rawId) {
  if (
    !rateLimit(
      `reportDelete:${clientKey(request)}`,
      RATE_LIMITS.reportDelete.limit,
      RATE_LIMITS.reportDelete.windowMs,
    )
  ) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE_LIMIT')
  }
  const authError = await requireReportsAuth(request, env)
  if (authError) return authError

  const id = typeof rawId === 'string' ? rawId.trim() : ''
  if (!id) {
    return errorJson(request, 400, 'Ungültige Melde-ID.', 'INVALID_REPORT_ID')
  }

  const existing = parseTaskReports(parseRaw(await env.CLASSES.get(taskReportsKey())))
  const next = existing.filter((row) => row.id !== id)
  if (next.length === existing.length) {
    return errorJson(request, 404, 'Meldung nicht gefunden.', 'NOT_FOUND')
  }
  await env.CLASSES.put(taskReportsKey(), JSON.stringify({ reports: next }))
  return json(request, 200, { ok: true, id })
}

export default {
  async fetch(request, env) {
    return handleRequest(request, env)
  },
}

export { MAX_POINTS_DELTA, CLASS_CODE_LENGTH, SERVICE, MAX_GRADE_CLASSES }
