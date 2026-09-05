import { challengeTopicIds, classPointsPayload, updateChallengePayload } from '../challenge/logic'
import type { ChallengePrize, ChallengeScope, ChallengeTopicRef } from '../challenge/types'
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

export const CLASS_API_RATE_MESSAGE = 'Zu viele Anfragen. Bitte kurz warten.'

export const CLASS_API_STUB_MESSAGE =
  'Der Klassen-Server läuft noch mit dem Test-Programm. Das ist nicht der Klassencode in der App: Linus oder Matthias müssen einmal die Datei cloudflare/worker.js in Cloudflare unter Edit Code einfügen und auf Deploy klicken. Danach erzeugt die App Codes selbst.'

export interface GradeClassStanding {
  id: string
  name: string
  points: ClassPointBreakdown
}

/** Competition view: class names + totals, never member Klassencodes. */
export interface GradeSummary {
  id?: string
  name: string
  classes: GradeClassStanding[]
  points: ClassPointBreakdown
  period?: ClassPointPeriod
  challenge?: ChallengeSummary
  challenges?: ChallengeSummary[]
}

export interface ChallengeClassStanding {
  id: string
  name: string
  points: ClassPointBreakdown
}

export interface ChallengeSummary {
  id: string
  name: string
  scope: ChallengeScope
  start: string
  end: string
  topicIds?: string[]
  topics: ChallengeTopicRef[]
  prize: ChallengePrize
  points?: ClassPointBreakdown
  className?: string
  classThreshold?: number
  reachedThreshold?: boolean
  classes?: ChallengeClassStanding[]
  period?: ClassPointPeriod
  active?: boolean
}

export interface ClassStats {
  code: string
  name: string
  createdAt?: number
  points: ClassPointBreakdown
  period?: ClassPointPeriod
  grade?: GradeSummary
  challenge?: ChallengeSummary
  challenges?: ChallengeSummary[]
}

export interface CreatedGrade {
  code: string
  name: string
  id?: string
  classes: GradeClassStanding[]
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

export function gradeResourceUrl(code: string, base: string = CLASS_POINTS_API): string {
  const normalized = normalizeClassCode(code)
  return classApiUrl(`/grades/${encodeURIComponent(normalized)}`, base)
}

export function gradeClassesUrl(code: string, base: string = CLASS_POINTS_API): string {
  return `${gradeResourceUrl(code, base)}/classes`
}

export function challengesUrl(base: string = CLASS_POINTS_API): string {
  return classApiUrl('/challenges', base)
}

export function challengeResourceUrl(id: string, base: string = CLASS_POINTS_API): string {
  const normalized = normalizeClassCode(id)
  return classApiUrl(`/challenges/${encodeURIComponent(normalized)}`, base)
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

const parseChallengeClassStanding = (raw: unknown): ChallengeClassStanding | null => {
  if (!isRecord(raw)) return null
  const id = typeof raw.id === 'string' ? raw.id.trim() : ''
  const name = typeof raw.name === 'string' ? raw.name.trim() : ''
  if (!id || !name) return null
  return { id, name, points: parsePoints(raw.points) }
}

const parseChallengeSummary = (raw: unknown): ChallengeSummary | null => {
  if (!isRecord(raw)) return null
  const id = typeof raw.id === 'string' ? normalizeClassCode(raw.id) : ''
  const name = typeof raw.name === 'string' ? raw.name.trim() : ''
  const scope = raw.scope === 'grade' ? 'grade' : raw.scope === 'class' ? 'class' : ''
  const start = typeof raw.start === 'string' ? raw.start : ''
  const end = typeof raw.end === 'string' ? raw.end : ''
  if (!id || !name || !scope || !start || !end) return null
  const topics = Array.isArray(raw.topics)
    ? raw.topics
        .filter((item): item is Record<string, unknown> => isRecord(item) && typeof item.id === 'string')
        .map((item) => ({
          id: String(item.id),
          ...(typeof item.title === 'string' && item.title.trim()
            ? { title: item.title.trim() }
            : {}),
        }))
    : []
  const topicIds = challengeTopicIds({
    topicIds: Array.isArray(raw.topicIds) ? raw.topicIds.filter((id): id is string => typeof id === 'string') : [],
    topics,
  })
  const prizeSrc = isRecord(raw.prize) ? raw.prize : {}
  const prize: ChallengePrize = {
    enabled: Boolean(prizeSrc.enabled),
    ...(prizeSrc.classPrize ? { classPrize: true } : {}),
    ...(prizeSrc.studentPrize ? { studentPrize: true } : {}),
    ...(typeof prizeSrc.classThreshold === 'number' && prizeSrc.classThreshold > 0
      ? { classThreshold: Math.trunc(prizeSrc.classThreshold) }
      : {}),
    ...(typeof prizeSrc.text === 'string' && prizeSrc.text.trim()
      ? { text: prizeSrc.text.trim() }
      : {}),
  }
  const classes = Array.isArray(raw.classes)
    ? raw.classes
        .map(parseChallengeClassStanding)
        .filter((row): row is ChallengeClassStanding => row !== null)
    : undefined
  return {
    id,
    name,
    scope,
    start,
    end,
    ...(topicIds.length ? { topicIds } : {}),
    topics,
    prize,
    points: raw.points ? parsePoints(raw.points) : undefined,
    className: typeof raw.className === 'string' ? raw.className : undefined,
    classThreshold:
      typeof raw.classThreshold === 'number' ? raw.classThreshold : prize.classThreshold,
    reachedThreshold:
      typeof raw.reachedThreshold === 'boolean' ? raw.reachedThreshold : undefined,
    ...(classes ? { classes } : {}),
    period: parsePeriod(raw.period),
    active: typeof raw.active === 'boolean' ? raw.active : undefined,
  }
}

const parseChallengesList = (raw: unknown): ChallengeSummary[] => {
  if (!Array.isArray(raw)) return []
  return raw
    .map(parseChallengeSummary)
    .filter((row): row is ChallengeSummary => row !== null)
}

const parseGradeClassStanding = (raw: unknown): GradeClassStanding | null => {
  if (!isRecord(raw)) return null
  const id = typeof raw.id === 'string' ? raw.id.trim() : ''
  const name = typeof raw.name === 'string' ? raw.name.trim() : ''
  if (!id || !name) return null
  return {
    id,
    name,
    points: parsePoints(raw.points),
  }
}

const parseGradeSummary = (raw: unknown): GradeSummary | null => {
  if (!isRecord(raw)) return null
  const name = typeof raw.name === 'string' ? raw.name.trim() : ''
  if (!name) return null
  const classes = Array.isArray(raw.classes)
    ? raw.classes
        .map(parseGradeClassStanding)
        .filter((row): row is GradeClassStanding => row !== null)
    : []
  const challenges = parseChallengesList(raw.challenges)
  const challenge = raw.challenge ? parseChallengeSummary(raw.challenge) : challenges[0] ?? null
  return {
    id: typeof raw.id === 'string' ? raw.id : undefined,
    name,
    classes,
    points: parsePoints(raw.points),
    period: parsePeriod(raw.period),
    ...(challenge ? { challenge } : {}),
    ...(challenges.length ? { challenges } : {}),
  }
}

const parseClassStats = (raw: unknown): ClassStats | null => {
  if (!isRecord(raw)) return null
  const code = typeof raw.code === 'string' ? normalizeClassCode(raw.code) : ''
  const name = typeof raw.name === 'string' ? raw.name : ''
  if (!code || !name) return null
  const grade = raw.grade ? parseGradeSummary(raw.grade) : null
  const challenges = parseChallengesList(raw.challenges)
  const challenge = raw.challenge ? parseChallengeSummary(raw.challenge) : challenges[0] ?? null
  return {
    code,
    name,
    createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : undefined,
    points: parsePoints(raw.points),
    period: parsePeriod(raw.period),
    ...(grade ? { grade } : {}),
    ...(challenge ? { challenge } : {}),
    ...(challenges.length ? { challenges } : {}),
  }
}

const parseCreatedGrade = (raw: unknown): CreatedGrade | null => {
  const summary = parseGradeSummary(raw)
  if (!summary || !isRecord(raw)) return null
  const code = typeof raw.code === 'string' ? normalizeClassCode(raw.code) : ''
  if (!code) return null
  return { ...summary, code }
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
  if (kind === 'rate') return CLASS_API_RATE_MESSAGE
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
    throw new ClassApiError(
      'not_found',
      serverMessage || messageForKind('not_found', serverMessage),
      404,
    )
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
  topicId?: string,
): Promise<ClassStats | null> {
  const api = base || CLASS_POINTS_API
  const normalized = normalizeClassCode(code)
  if (!isValidClassCode(normalized)) return null
  const chunks = chunkDelta(delta)
  if (chunks.length === 0) return null
  let last: ClassStats | null = null
  for (const piece of chunks) {
    const json = await requestJson(classPointsUrl(normalized, api), {
      method: 'POST',
      body: JSON.stringify(classPointsPayload(piece, topicId)),
    })
    last = parseClassStats(json)
  }
  return last
}

export interface CreateChallengeInput {
  scope: ChallengeScope
  classCode?: string
  gradeCode?: string
  name: string
  topicIds: string[]
  topics?: ChallengeTopicRef[]
  start: string
  end: string
  prize: ChallengePrize
}

export async function createChallenge(
  input: CreateChallengeInput,
  base: string = CLASS_POINTS_API,
): Promise<ChallengeSummary> {
  const json = await requestJson(challengesUrl(base), {
    method: 'POST',
    body: JSON.stringify({
      scope: input.scope,
      ...(input.scope === 'class' && input.classCode ? { classCode: input.classCode } : {}),
      ...(input.scope === 'grade' && input.gradeCode ? { gradeCode: input.gradeCode } : {}),
      name: input.name.trim(),
      topicIds: input.topicIds,
      topics: input.topics ?? [],
      start: input.start,
      end: input.end,
      prize: input.prize,
    }),
  })
  throwIfStubHealth(json)
  const created = parseChallengeSummary(json)
  if (!created) {
    throw new ClassApiError('not_ready', CLASS_API_STUB_MESSAGE, 200)
  }
  return created
}

export async function getChallenge(
  id: string,
  base: string = CLASS_POINTS_API,
): Promise<ChallengeSummary> {
  const normalized = normalizeClassCode(id)
  if (!isValidClassCode(normalized)) {
    throw new ClassApiError('invalid', 'Die Challenge-ID ist ungültig.', 400)
  }
  const json = await requestJson(challengeResourceUrl(normalized, base), { method: 'GET' })
  const summary = parseChallengeSummary(json)
  if (!summary) {
    throw new ClassApiError('not_ready', CLASS_API_NOT_READY_MESSAGE, 200)
  }
  return summary
}

export interface UpdateChallengeInput {
  name: string
  topicIds: string[]
  topics?: ChallengeTopicRef[]
  start: string
  end: string
  prize: ChallengePrize
}

export async function updateChallenge(
  id: string,
  input: UpdateChallengeInput,
  base: string = CLASS_POINTS_API,
): Promise<ChallengeSummary> {
  const normalized = normalizeClassCode(id)
  if (!isValidClassCode(normalized)) {
    throw new ClassApiError('invalid', 'Die Challenge-ID ist ungültig.', 400)
  }
  const json = await requestJson(challengeResourceUrl(normalized, base), {
    method: 'PUT',
    body: JSON.stringify(updateChallengePayload(input)),
  })
  throwIfStubHealth(json)
  const updated = parseChallengeSummary(json)
  if (!updated) {
    throw new ClassApiError('not_ready', CLASS_API_STUB_MESSAGE, 200)
  }
  return updated
}

export async function deleteChallenge(
  id: string,
  base: string = CLASS_POINTS_API,
): Promise<void> {
  const normalized = normalizeClassCode(id)
  if (!isValidClassCode(normalized)) {
    throw new ClassApiError('invalid', 'Die Challenge-ID ist ungültig.', 400)
  }
  const json = await requestJson(challengeResourceUrl(normalized, base), {
    method: 'DELETE',
  })
  throwIfStubHealth(json)
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

export function isGradeNotClassError(err: unknown): boolean {
  return err instanceof ClassApiError && err.kind === 'invalid' && /stufencode/i.test(err.message)
}

export async function createGrade(
  name: string,
  base: string = CLASS_POINTS_API,
): Promise<CreatedGrade> {
  const trimmed = name.trim()
  if (!trimmed) {
    throw new ClassApiError('invalid', 'Bitte einen Namen für die Klassenstufe eingeben.', 400)
  }
  if (trimmed.length > MAX_CLASS_NAME_LENGTH) {
    throw new ClassApiError(
      'invalid',
      `Der Name darf höchstens ${MAX_CLASS_NAME_LENGTH} Zeichen haben.`,
      400,
    )
  }
  const json = await requestJson(classApiUrl('/grades', base), {
    method: 'POST',
    body: JSON.stringify({ name: trimmed }),
  })
  throwIfStubHealth(json)
  const created = parseCreatedGrade(json)
  if (!created) {
    throw new ClassApiError('not_ready', CLASS_API_STUB_MESSAGE, 200)
  }
  return created
}

export async function getGrade(
  code: string,
  base: string = CLASS_POINTS_API,
): Promise<GradeSummary> {
  const normalized = normalizeClassCode(code)
  if (!isValidClassCode(normalized)) {
    throw new ClassApiError('invalid', 'Der Stufencode ist ungültig.', 400)
  }
  const json = await requestJson(gradeResourceUrl(normalized, base), { method: 'GET' })
  const summary = parseGradeSummary(json)
  if (!summary) {
    throw new ClassApiError('not_ready', CLASS_API_NOT_READY_MESSAGE, 200)
  }
  return summary
}

export async function updateGradeClasses(
  code: string,
  change: { add?: string[]; remove?: string[] },
  base: string = CLASS_POINTS_API,
): Promise<GradeSummary> {
  const normalized = normalizeClassCode(code)
  if (!isValidClassCode(normalized)) {
    throw new ClassApiError('invalid', 'Der Stufencode ist ungültig.', 400)
  }
  const json = await requestJson(gradeClassesUrl(normalized, base), {
    method: 'PUT',
    body: JSON.stringify({
      add: change.add ?? [],
      remove: change.remove ?? [],
    }),
  })
  const summary = parseGradeSummary(json)
  if (!summary) {
    throw new ClassApiError('not_ready', CLASS_API_NOT_READY_MESSAGE, 200)
  }
  return summary
}

export async function deleteGrade(
  code: string,
  base: string = CLASS_POINTS_API,
): Promise<void> {
  const normalized = normalizeClassCode(code)
  if (!isValidClassCode(normalized)) {
    throw new ClassApiError('invalid', 'Der Stufencode ist ungültig.', 400)
  }
  const json = await requestJson(gradeResourceUrl(normalized, base), {
    method: 'DELETE',
  })
  throwIfStubHealth(json)
}

export { CLASS_CODE_LENGTH, isValidClassCode, normalizeClassCode }
