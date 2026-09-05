/**
 * Mathsachs class-points Worker (KV binding MUST be named CLASSES).
 *
 * Paste this entire file into dash.cloudflare.com → Workers → mathsachs-punkte
 * → Edit Code, then Deploy. Keep in sync with src/classCode/buckets.ts,
 * src/classCode/code.ts and src/classCode/publicId.ts.
 *
 * Rate limits per client IP / 60s (classroom-safe listing + a few deletes):
 * GET class/grade 300, DELETE 30, POST /classes 8, POST /grades 8,
 * PUT grade membership 30, POST points 60.
 * GET / (health) is not rate-limited. Raise GET/DELETE here if a class page
 * with many Eigene Codes still 429s; keep POST points tight against abuse.
 *
 * Privacy: KV stores class/grade display names and daily point buckets only.
 * No pupil names, user ids or emails. GET /grades never returns member
 * Klassencodes. Points are accepted only on class records.
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
  }
}

function serializeClass(stored) {
  const out = {
    name: stored.name,
    createdAt: stored.createdAt,
    days: stored.days || {},
  }
  if (stored.gradeId) out.gradeId = stored.gradeId
  return out
}

function serializeGrade(stored) {
  return {
    type: 'grade',
    name: stored.name,
    createdAt: stored.createdAt,
    classes: uniqueValidCodes(stored.classes),
  }
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
  let points = emptyPoints()
  let period = summarizeDays({}, now).period
  for (const classCode of grade.classes) {
    const stored = parseClassStored(await env.CLASSES.get(classCode))
    if (!stored) continue
    const standing = standingFromClass(classCode, stored, now)
    const summary = summarizeDays(stored.days, now)
    period = summary.period
    classes.push(standing)
    points = addBreakdown(points, standing.points)
  }
  classes.sort((a, b) => a.name.localeCompare(b.name, 'de') || a.id.localeCompare(b.id))
  return {
    id: publicIdFromCode(gradeCode),
    name: grade.name,
    classes,
    points,
    period,
  }
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
  return body
}

function publicGradeView(view) {
  return {
    id: view.id,
    name: view.name,
    classes: view.classes,
    points: view.points,
    period: view.period,
  }
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
  const delta = body.delta
  if (!Number.isInteger(delta) || delta < 1 || delta > MAX_POINTS_DELTA) {
    return errorJson(
      request,
      400,
      `delta muss eine ganze Zahl von 1 bis ${MAX_POINTS_DELTA} sein.`,
      'BAD_DELTA',
    )
  }
  const loaded = await loadClass(env, rawCode)
  const err = classLoadError(request, loaded, true)
  if (err) return err
  const day = berlinDayKey()
  const days = { ...loaded.stored.days }
  days[day] = (asPoints(days[day]) || 0) + delta
  const stored = { ...loaded.stored, days }
  await putClass(env, loaded.code, stored)
  return json(request, 200, publicClass(loaded.code, stored))
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

  return errorJson(request, 404, 'Unbekannter Pfad.', 'NOT_FOUND')
}

export default {
  async fetch(request, env) {
    return handleRequest(request, env)
  },
}

export { MAX_POINTS_DELTA, CLASS_CODE_LENGTH, SERVICE, MAX_GRADE_CLASSES }
