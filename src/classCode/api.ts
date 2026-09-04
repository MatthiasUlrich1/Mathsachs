import { CLASS_CODE_LENGTH, isValidClassCode, normalizeClassCode } from './code'
import type { ClassPointBreakdown, ClassPointPeriod } from './buckets'

/** Default public Worker. Override in tests or a custom deploy. */
export const CLASS_POINTS_API = 'https://mathsachs-punkte.broad-heart-ad82.workers.dev'

export const MAX_POINTS_DELTA = 100
export const MAX_CLASS_NAME_LENGTH = 80

export type ClassApiErrorKind =
  | 'not_ready'
  | 'not_found'
  | 'rate'
  | 'invalid'
  | 'network'
  | 'http'

export class ClassApiError extends Error {
  readonly kind: ClassApiErrorKind
  readonly status: number

  constructor(kind: ClassApiErrorKind, message: string, status = 0) {
    super(message)
    this.name = 'ClassApiError'
    this.kind = kind
    this.status = status
  }
}

export const CLASS_API_NOT_READY_MESSAGE =
  'Klassencodes sind gerade nicht verfügbar. Bitte später erneut versuchen.'

export const CLASS_API_NETWORK_MESSAGE =
  'Keine Verbindung zum Klassen-Server. Bitte Internet prüfen und später erneut versuchen.'

export const CLASS_API_STUB_MESSAGE =
  'Der Klassen-Server läuft noch mit dem Test-Programm. Das ist nicht der Klassencode in der App: Linus oder Matthias müssen einmal die Datei cloudflare/worker.js in Cloudflare unter Edit Code einfügen und auf Deploy klicken. Danach erzeugt die App Codes selbst.'

export interface ClassStats {
  code: string
  name: string
  createdAt?: number
  points: ClassPointBreakdown
  period?: ClassPointPeriod
}

const joinUrl = (base: string, path: string): string => {
  const root = base.replace(/\/+$/, '')
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${root}${suffix}`
}

/** Build an absolute Worker URL from a path (`/`, `/classes`, `/classes/CODE`). */
export function classApiUrl(path: string, base: string = CLASS_POINTS_API): string {
  return joinUrl(base, path)
}

export function classResourceUrl(code: string, base: string = CLASS_POINTS_API): string {
  const normalized = normalizeClassCode(code)
  return classApiUrl(`/classes/${encodeURIComponent(normalized)}`, base)
}

export function classPointsUrl(code: string, base: string = CLASS_POINTS_API): string {
  return `${classResourceUrl(code, base)}/points`
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const asFinite = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0

const parsePoints = (raw: unknown): ClassPointBreakdown => {
  const src = isRecord(raw) ? raw : {}
  return {
    today: asFinite(src.today),
    week: asFinite(src.week),
    month: asFinite(src.month),
    year: asFinite(src.year),
    total: asFinite(src.total),
  }
}

const parsePeriod = (raw: unknown): ClassPointPeriod | undefined => {
  if (!isRecord(raw)) return undefined
  const today = typeof raw.today === 'string' ? raw.today : ''
  const week = typeof raw.week === 'string' ? raw.week : ''
  const month = typeof raw.month === 'string' ? raw.month : ''
  const schoolYear = typeof raw.schoolYear === 'string' ? raw.schoolYear : ''
  if (!today && !week && !month && !schoolYear) return undefined
  return { today, week, month, schoolYear }
}

const parseClassStats = (raw: unknown): ClassStats | null => {
  if (!isRecord(raw)) return null
  const code = typeof raw.code === 'string' ? normalizeClassCode(raw.code) : ''
  const name = typeof raw.name === 'string' ? raw.name : ''
  if (!code || !name) return null
  return {
    code,
    name,
    createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : undefined,
    points: parsePoints(raw.points),
    period: parsePeriod(raw.period),
  }
}

const looksLikeWorkerHealth = (raw: unknown): boolean => {
  if (!isRecord(raw)) return false
  return raw.ok === true && typeof raw.service === 'string'
}

const throwIfStubHealth = (json: unknown): void => {
  if (looksLikeWorkerHealth(json) && !('code' in (json as object) && 'name' in (json as object))) {
    throw new ClassApiError('not_ready', CLASS_API_STUB_MESSAGE, 200)
  }
}

const looksLikeCloudflareBlock = (status: number, text: string): boolean => {
  if (status === 1042 || text.includes('error code: 1042')) return true
  if (status === 404 && /error code:\s*\d+/i.test(text)) return true
  if (status >= 500 && /cloudflare|worker/i.test(text) && !text.includes('{')) return true
  if (status === 404 && /<!doctype html/i.test(text)) return true
  return false
}

const messageForKind = (kind: ClassApiErrorKind, fallback: string): string => {
  if (kind === 'not_ready') return CLASS_API_NOT_READY_MESSAGE
  if (kind === 'not_found') return 'Diesen Klassencode gibt es nicht.'
  if (kind === 'rate') return 'Zu viele Anfragen. Bitte kurz warten.'
  if (kind === 'network') return CLASS_API_NETWORK_MESSAGE
  return fallback
}

const readBody = async (
  res: Response,
): Promise<{ json: unknown | null; text: string }> => {
  const text = await res.text()
  const type = res.headers.get('content-type') || ''
  if (type.includes('application/json') || text.trim().startsWith('{')) {
    try {
      return { json: JSON.parse(text) as unknown, text }
    } catch {
      return { json: null, text }
    }
  }
  return { json: null, text }
}

const throwForResponse = (res: Response, json: unknown, text: string): never => {
  if (looksLikeCloudflareBlock(res.status, text) || (res.status === 404 && !isRecord(json))) {
    throw new ClassApiError('not_ready', CLASS_API_NOT_READY_MESSAGE, res.status)
  }
  const serverMessage =
    isRecord(json) && typeof json.error === 'string' ? json.error : ''
  if (res.status === 404) {
    throw new ClassApiError('not_found', messageForKind('not_found', serverMessage), 404)
  }
  if (res.status === 429) {
    throw new ClassApiError('rate', messageForKind('rate', serverMessage), 429)
  }
  if (res.status === 400) {
    throw new ClassApiError(
      'invalid',
      serverMessage || 'Die Anfrage war ungültig.',
      400,
    )
  }
  throw new ClassApiError(
    'http',
    serverMessage || `Der Klassen-Server antwortete mit ${res.status}.`,
    res.status,
  )
}

async function requestJson(
  url: string,
  init: RequestInit,
): Promise<unknown> {
  let res: Response
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
      cache: 'no-store',
    })
  } catch {
    throw new ClassApiError('network', messageForKind('network', ''), 0)
  }
  const { json, text } = await readBody(res)
  if (!res.ok) throwForResponse(res, json, text)
  if (json == null) {
    throw new ClassApiError('not_ready', CLASS_API_NOT_READY_MESSAGE, res.status)
  }
  return json
}

export async function checkClassApiHealth(
  base: string = CLASS_POINTS_API,
): Promise<{ ok: true; service: string; hasClasses: boolean }> {
  const json = await requestJson(classApiUrl('/', base), { method: 'GET' })
  if (!looksLikeWorkerHealth(json)) {
    throw new ClassApiError('not_ready', CLASS_API_NOT_READY_MESSAGE, 200)
  }
  const rec = json as Record<string, unknown>
  return {
    ok: true,
    service: String(rec.service),
    hasClasses: Boolean(rec.hasClasses),
  }
}

export async function createClass(
  name: string,
  base: string = CLASS_POINTS_API,
): Promise<ClassStats> {
  const trimmed = name.trim()
  if (!trimmed) {
    throw new ClassApiError('invalid', 'Bitte einen Klassennamen eingeben.', 400)
  }
  if (trimmed.length > MAX_CLASS_NAME_LENGTH) {
    throw new ClassApiError(
      'invalid',
      `Der Klassenname darf höchstens ${MAX_CLASS_NAME_LENGTH} Zeichen haben.`,
      400,
    )
  }
  const json = await requestJson(classApiUrl('/classes', base), {
    method: 'POST',
    body: JSON.stringify({ name: trimmed }),
  })
  throwIfStubHealth(json)
  const stats = parseClassStats(json)
  if (!stats) {
    throw new ClassApiError('not_ready', CLASS_API_NOT_READY_MESSAGE, 200)
  }
  return stats
}

export async function getClass(
  code: string,
  base: string = CLASS_POINTS_API,
): Promise<ClassStats> {
  const normalized = normalizeClassCode(code)
  if (!isValidClassCode(normalized)) {
    throw new ClassApiError('invalid', 'Der Klassencode ist ungültig.', 400)
  }
  const json = await requestJson(classResourceUrl(normalized, base), { method: 'GET' })
  const stats = parseClassStats(json)
  if (!stats) {
    throw new ClassApiError('not_ready', CLASS_API_NOT_READY_MESSAGE, 200)
  }
  return stats
}

const chunkDelta = (delta: number): number[] => {
  const n = Math.trunc(delta)
  if (n < 1) return []
  const chunks: number[] = []
  let left = n
  while (left > 0) {
    const piece = Math.min(MAX_POINTS_DELTA, left)
    chunks.push(piece)
    left -= piece
  }
  return chunks
}

export async function addClassPoints(
  code: string,
  delta: number,
  base: string = CLASS_POINTS_API,
): Promise<ClassStats | null> {
  const normalized = normalizeClassCode(code)
  if (!isValidClassCode(normalized)) return null
  const chunks = chunkDelta(delta)
  if (chunks.length === 0) return null
  let last: ClassStats | null = null
  for (const piece of chunks) {
    const json = await requestJson(classPointsUrl(normalized, base), {
      method: 'POST',
      body: JSON.stringify({ delta: piece }),
    })
    last = parseClassStats(json)
  }
  return last
}

export async function deleteClass(
  code: string,
  base: string = CLASS_POINTS_API,
): Promise<void> {
  const normalized = normalizeClassCode(code)
  if (!isValidClassCode(normalized)) {
    throw new ClassApiError('invalid', 'Der Klassencode ist ungültig.', 400)
  }
  const json = await requestJson(classResourceUrl(normalized, base), {
    method: 'DELETE',
  })
  throwIfStubHealth(json)
}

export { CLASS_CODE_LENGTH, isValidClassCode, normalizeClassCode }
