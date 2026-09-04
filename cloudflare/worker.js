/**
 * Mathsachs class-points Worker (KV binding MUST be named CLASSES).
 *
 * Paste this entire file into dash.cloudflare.com → Workers → mathsachs-punkte
 * → Edit Code, then Deploy. Keep in sync with src/classCode/buckets.ts and
 * src/classCode/code.ts.
 */

const BERLIN_TZ = 'Europe/Berlin'
const CLASS_CODE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
const CLASS_CODE_LENGTH = 8
const MAX_POINTS_DELTA = 100
const MAX_CLASS_NAME_LENGTH = 80
const SERVICE = 'mathsachs-punkte'
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/

const ALLOWED_METHODS = 'GET, POST, DELETE, OPTIONS'

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

function parseStored(raw) {
  if (!raw) return null
  try {
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (!data || typeof data !== 'object') return null
    const name = typeof data.name === 'string' ? data.name.trim() : ''
    if (!name) return null
    const days =
      data.days && typeof data.days === 'object' && !Array.isArray(data.days) ? data.days : {}
    const createdAt =
      typeof data.createdAt === 'number' && Number.isFinite(data.createdAt)
        ? data.createdAt
        : Date.now()
    return { name, createdAt, days }
  } catch {
    return null
  }
}

function publicClass(code, stored, now = Date.now()) {
  const summary = summarizeDays(stored.days, now)
  return {
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

const hits = new Map()

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

async function handleCreate(request, env) {
  if (!rateLimit(`create:${clientKey(request)}`, 8, 60_000)) {
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
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!name) return errorJson(request, 400, 'Bitte einen Klassennamen eingeben.', 'BAD_NAME')
  if (name.length > MAX_CLASS_NAME_LENGTH) {
    return errorJson(
      request,
      400,
      `Der Klassenname darf höchstens ${MAX_CLASS_NAME_LENGTH} Zeichen haben.`,
      'BAD_NAME',
    )
  }
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generateClassCode()
    const existing = await env.CLASSES.get(code)
    if (existing) continue
    const stored = { name, createdAt: Date.now(), days: {} }
    await env.CLASSES.put(code, JSON.stringify(stored))
    return json(request, 201, publicClass(code, stored))
  }
  return errorJson(request, 503, 'Kein freier Klassencode. Bitte erneut versuchen.', 'BUSY')
}

async function loadClass(env, rawCode) {
  const code = normalizeClassCode(rawCode)
  if (!isValidClassCode(code)) return { error: 'BAD_CODE' }
  if (!env.CLASSES) return { error: 'NO_KV' }
  const stored = parseStored(await env.CLASSES.get(code))
  if (!stored) return { error: 'NOT_FOUND', code }
  return { code, stored }
}

async function handleDelete(request, env, rawCode) {
  if (!rateLimit(`delete:${clientKey(request)}`, 8, 60_000)) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE')
  }
  const loaded = await loadClass(env, rawCode)
  if (loaded.error === 'BAD_CODE') {
    return errorJson(request, 400, 'Der Klassencode ist ungültig.', 'BAD_CODE')
  }
  if (loaded.error === 'NO_KV') {
    return errorJson(request, 503, 'KV-Bindung CLASSES fehlt.', 'NO_KV')
  }
  if (loaded.error === 'NOT_FOUND') {
    return errorJson(request, 404, 'Diesen Klassencode gibt es nicht.', 'NOT_FOUND')
  }
  await env.CLASSES.delete(loaded.code)
  return json(request, 200, { ok: true, deleted: loaded.code })
}

async function handleGet(request, env, rawCode) {
  if (!rateLimit(`get:${clientKey(request)}`, 120, 60_000)) {
    return errorJson(request, 429, 'Zu viele Anfragen. Bitte kurz warten.', 'RATE')
  }
  const loaded = await loadClass(env, rawCode)
  if (loaded.error === 'BAD_CODE') {
    return errorJson(request, 400, 'Der Klassencode ist ungültig.', 'BAD_CODE')
  }
  if (loaded.error === 'NO_KV') {
    return errorJson(request, 503, 'KV-Bindung CLASSES fehlt.', 'NO_KV')
  }
  if (loaded.error === 'NOT_FOUND') {
    return errorJson(request, 404, 'Diesen Klassencode gibt es nicht.', 'NOT_FOUND')
  }
  return json(request, 200, publicClass(loaded.code, loaded.stored))
}

async function handlePoints(request, env, rawCode) {
  if (!rateLimit(`points:${clientKey(request)}`, 60, 60_000)) {
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
  if (loaded.error === 'BAD_CODE') {
    return errorJson(request, 400, 'Der Klassencode ist ungültig.', 'BAD_CODE')
  }
  if (loaded.error === 'NO_KV') {
    return errorJson(request, 503, 'KV-Bindung CLASSES fehlt.', 'NO_KV')
  }
  if (loaded.error === 'NOT_FOUND') {
    return errorJson(request, 404, 'Diesen Klassencode gibt es nicht.', 'NOT_FOUND')
  }
  const day = berlinDayKey()
  const days = { ...loaded.stored.days }
  days[day] = (asPoints(days[day]) || 0) + delta
  const stored = { ...loaded.stored, days }
  await env.CLASSES.put(loaded.code, JSON.stringify(stored))
  return json(request, 200, publicClass(loaded.code, stored))
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

  return errorJson(request, 404, 'Unbekannter Pfad.', 'NOT_FOUND')
}

export default {
  async fetch(request, env) {
    return handleRequest(request, env)
  },
}

export { MAX_POINTS_DELTA, CLASS_CODE_LENGTH, SERVICE }
