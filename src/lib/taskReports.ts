import { CLASS_POINTS_API, ClassApiError } from '../classCode/api'

/**
 * Shared read token for Entwickler GET /reports/tasks.
 * Must match the Cloudflare Worker secret `REPORTS_TOKEN`
 * (Workers → mathsachs-punkte → Settings → Variables → REPORTS_TOKEN).
 * Same privacy model as the Lehrercode: present in the client, not public API.
 */
export const REPORTS_READ_TOKEN = 'MS-REPORTS-8K3QZ7WN'

export const MAX_REPORT_COMMENT = 500
export const MAX_REPORT_REPLY = 500
export const MY_TASK_REPORTS_KEY = 'mathsachs.myTaskReports.v1'
export const MAX_MY_TASK_REPORTS = 40

export type TaskReportStatus = 'open' | 'done' | 'fixed'

export interface TaskReportPayload {
  contentId: number
  comment: string
  topicId?: string
  topicTitle?: string
  areaTitle?: string
  question?: string
  appVersion?: string
}

export interface TaskReport extends TaskReportPayload {
  id: string
  at: number
  status: TaskReportStatus
  replyMessage?: string
  fixedAt?: number
}

/** Public status slice returned for locally remembered report ids. */
export interface TaskReportUpdate {
  id: string
  status: TaskReportStatus
  contentId: number
  comment?: string
  topicTitle?: string
  replyMessage?: string
  fixedAt?: number
}

export interface MyStoredReport {
  id: string
  rememberedAt: number
  /** True after the reporter dismissed the “korrigiert” notice. */
  seenFixed?: boolean
  /** Snapshot from submit — used when status API omits comment/title. */
  contentId?: number
  comment?: string
  topicTitle?: string
}

/** Merged row for the reporter’s Einstellungen list (no admin actions). */
export interface MyReportListItem {
  id: string
  rememberedAt: number
  contentId: number
  status: TaskReportStatus
  comment?: string
  topicTitle?: string
  replyMessage?: string
  fixedAt?: number
}

export function trimReportComment(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ').slice(0, MAX_REPORT_COMMENT)
}

export function trimReportReply(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ').slice(0, MAX_REPORT_REPLY)
}

export function isReportCommentValid(raw: string): boolean {
  return trimReportComment(raw).length > 0
}

function storageOrLocal(storage?: Storage): Storage | undefined {
  if (storage) return storage
  return typeof localStorage !== 'undefined' ? localStorage : undefined
}

function optionalStoredContentId(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const n = Math.floor(value)
    if (n >= 1000 && n <= 9999) return n
  }
  return undefined
}

function parseMyStoredReports(raw: string | null): MyStoredReport[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    const list = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === 'object' && Array.isArray((parsed as { reports?: unknown }).reports)
        ? (parsed as { reports: unknown[] }).reports
        : []
    const out: MyStoredReport[] = []
    const seen = new Set<string>()
    for (const item of list) {
      if (!item || typeof item !== 'object') continue
      const row = item as Record<string, unknown>
      const id = typeof row.id === 'string' ? row.id.trim() : ''
      if (!id || seen.has(id)) continue
      seen.add(id)
      const rememberedAt =
        typeof row.rememberedAt === 'number' && Number.isFinite(row.rememberedAt)
          ? Math.floor(row.rememberedAt)
          : Date.now()
      const contentId = optionalStoredContentId(row.contentId)
      const comment =
        typeof row.comment === 'string' ? trimReportComment(row.comment) : ''
      const topicTitle =
        typeof row.topicTitle === 'string' ? row.topicTitle.trim().slice(0, 120) : ''
      out.push({
        id,
        rememberedAt,
        ...(row.seenFixed === true ? { seenFixed: true } : {}),
        ...(contentId !== undefined ? { contentId } : {}),
        ...(comment ? { comment } : {}),
        ...(topicTitle ? { topicTitle } : {}),
      })
      if (out.length >= MAX_MY_TASK_REPORTS) break
    }
    return out
  } catch {
    return []
  }
}

function writeMyStoredReports(entries: MyStoredReport[], storage?: Storage): void {
  const kv = storageOrLocal(storage)
  if (!kv) return
  kv.setItem(MY_TASK_REPORTS_KEY, JSON.stringify({ reports: entries.slice(0, MAX_MY_TASK_REPORTS) }))
}

/** Anonymous local memory of report ids submitted on this device — no PII. */
export function listMyStoredReports(storage?: Storage): MyStoredReport[] {
  const kv = storageOrLocal(storage)
  if (!kv) return []
  return parseMyStoredReports(kv.getItem(MY_TASK_REPORTS_KEY))
}

export function rememberMyReportId(
  id: string,
  storage?: Storage,
  now = Date.now(),
  snapshot?: { contentId?: number; comment?: string; topicTitle?: string },
): void {
  const trimmed = id.trim()
  if (!trimmed) return
  const existing = listMyStoredReports(storage)
  const prevRow = existing.find((row) => row.id === trimmed)
  const prev = existing.filter((row) => row.id !== trimmed)
  const contentId =
    optionalStoredContentId(snapshot?.contentId) ?? prevRow?.contentId
  const comment = snapshot?.comment
    ? trimReportComment(snapshot.comment)
    : prevRow?.comment ?? ''
  const topicTitle = snapshot?.topicTitle?.trim()
    ? snapshot.topicTitle.trim().slice(0, 120)
    : prevRow?.topicTitle ?? ''
  writeMyStoredReports(
    [
      {
        id: trimmed,
        rememberedAt: now,
        ...(prevRow?.seenFixed ? { seenFixed: true } : {}),
        ...(contentId !== undefined ? { contentId } : {}),
        ...(comment ? { comment } : {}),
        ...(topicTitle ? { topicTitle } : {}),
      },
      ...prev,
    ],
    storage,
  )
}

/** Drop remembered report ids (e.g. after Entwickler delete / KV miss). */
export function forgetMyReportIds(ids: string[], storage?: Storage): void {
  const drop = new Set(
    ids.map((id) => id.trim()).filter((id) => id.length > 0),
  )
  if (drop.size === 0) return
  const next = listMyStoredReports(storage).filter((row) => !drop.has(row.id))
  writeMyStoredReports(next, storage)
}

/**
 * After a successful status lookup: ids among `requestedIds` that are absent
 * from `updates` were deleted from KV — purge them from local memory.
 * Returns the purged ids.
 */
export function purgeMissingMyReports(
  requestedIds: string[],
  updates: TaskReportUpdate[],
  storage?: Storage,
): string[] {
  const known = new Set(updates.map((row) => row.id))
  const missing = requestedIds
    .map((id) => id.trim())
    .filter((id) => id.length > 0 && !known.has(id))
  if (missing.length === 0) return []
  forgetMyReportIds(missing, storage)
  return missing
}

/**
 * Combine local snapshots with anonymous status lookup for Einstellungen.
 * When `statusFetched` is true, rows missing from `updates` are omitted
 * (caller should have purged them via `purgeMissingMyReports`).
 */
export function mergeMyReportList(
  stored: MyStoredReport[],
  updates: TaskReportUpdate[],
  options?: { statusFetched?: boolean },
): MyReportListItem[] {
  const byId = new Map(updates.map((row) => [row.id, row]))
  const statusFetched = options?.statusFetched === true
  const out: MyReportListItem[] = []
  for (const row of stored) {
    const update = byId.get(row.id)
    const contentId = update?.contentId ?? row.contentId ?? 0
    const comment = update?.comment || row.comment
    const topicTitle = update?.topicTitle || row.topicTitle
    if (!update) {
      // Offline / failed fetch: keep local snapshot as open. After a successful
      // status lookup, deleted ids are purged and must not appear in the list.
      if (statusFetched) continue
      out.push({
        id: row.id,
        rememberedAt: row.rememberedAt,
        contentId,
        status: 'open',
        ...(comment ? { comment } : {}),
        ...(topicTitle ? { topicTitle } : {}),
      })
      continue
    }
    out.push({
      id: row.id,
      rememberedAt: row.rememberedAt,
      contentId,
      status: update.status,
      ...(comment ? { comment } : {}),
      ...(topicTitle ? { topicTitle } : {}),
      ...(update.replyMessage ? { replyMessage: update.replyMessage } : {}),
      ...(update.fixedAt !== undefined ? { fixedAt: update.fixedAt } : {}),
    })
  }
  return out
}

export function myReportStatusLabel(status: TaskReportStatus): string {
  if (status === 'done') return 'erledigt'
  if (status === 'fixed') return 'Aufgabe wurde korrigiert'
  return 'offen'
}

export function markMyReportFixedSeen(id: string, storage?: Storage): void {
  const trimmed = id.trim()
  if (!trimmed) return
  const next = listMyStoredReports(storage).map((row) =>
    row.id === trimmed ? { ...row, seenFixed: true } : row,
  )
  writeMyStoredReports(next, storage)
}

/** Fixed updates the reporter has not dismissed yet. */
export function unseenFixedUpdates(
  updates: TaskReportUpdate[],
  storage?: Storage,
): TaskReportUpdate[] {
  const seen = new Set(
    listMyStoredReports(storage)
      .filter((row) => row.seenFixed)
      .map((row) => row.id),
  )
  return updates.filter((row) => row.status === 'fixed' && !seen.has(row.id))
}

function normalizeReportStatus(value: unknown): TaskReportStatus {
  if (typeof value !== 'string') return 'open'
  const trimmed = value.trim().toLowerCase()
  if (trimmed === 'done' || trimmed === 'erledigt') return 'done'
  if (trimmed === 'fixed' || trimmed === 'korrigiert') return 'fixed'
  return 'open'
}

function parseReportRow(row: unknown): TaskReport | null {
  if (!row || typeof row !== 'object') return null
  const r = row as Record<string, unknown>
  if (
    typeof r.id !== 'string' ||
    typeof r.comment !== 'string' ||
    typeof r.contentId !== 'number' ||
    typeof r.at !== 'number'
  ) {
    return null
  }
  const replyMessage =
    typeof r.replyMessage === 'string' ? trimReportReply(r.replyMessage) : ''
  const fixedAt =
    typeof r.fixedAt === 'number' && Number.isFinite(r.fixedAt)
      ? Math.floor(r.fixedAt)
      : undefined
  return {
    id: r.id,
    at: r.at,
    contentId: r.contentId,
    comment: r.comment,
    status: normalizeReportStatus(r.status),
    ...(typeof r.topicId === 'string' && r.topicId.trim()
      ? { topicId: r.topicId.trim() }
      : {}),
    ...(typeof r.topicTitle === 'string' && r.topicTitle.trim()
      ? { topicTitle: r.topicTitle.trim() }
      : {}),
    ...(typeof r.areaTitle === 'string' && r.areaTitle.trim()
      ? { areaTitle: r.areaTitle.trim() }
      : {}),
    ...(typeof r.question === 'string' && r.question.trim()
      ? { question: r.question.trim() }
      : {}),
    ...(typeof r.appVersion === 'string' && r.appVersion.trim()
      ? { appVersion: r.appVersion.trim() }
      : {}),
    ...(replyMessage ? { replyMessage } : {}),
    ...(fixedAt !== undefined ? { fixedAt } : {}),
  }
}

function parseReportUpdate(row: unknown): TaskReportUpdate | null {
  if (!row || typeof row !== 'object') return null
  const r = row as Record<string, unknown>
  if (typeof r.id !== 'string' || typeof r.contentId !== 'number') return null
  const replyMessage =
    typeof r.replyMessage === 'string' ? trimReportReply(r.replyMessage) : ''
  const fixedAt =
    typeof r.fixedAt === 'number' && Number.isFinite(r.fixedAt)
      ? Math.floor(r.fixedAt)
      : undefined
  const comment =
    typeof r.comment === 'string' ? trimReportComment(r.comment) : ''
  const topicTitle =
    typeof r.topicTitle === 'string' ? r.topicTitle.trim().slice(0, 120) : ''
  return {
    id: r.id.trim(),
    status: normalizeReportStatus(r.status),
    contentId: r.contentId,
    ...(comment ? { comment } : {}),
    ...(topicTitle ? { topicTitle } : {}),
    ...(replyMessage ? { replyMessage } : {}),
    ...(fixedAt !== undefined ? { fixedAt } : {}),
  }
}

async function reportsMutate(
  path: string,
  init: RequestInit,
  options?: { fetchImpl?: typeof fetch; baseUrl?: string; token?: string },
): Promise<Response> {
  const fetchImpl = options?.fetchImpl ?? fetch
  const baseUrl = options?.baseUrl ?? CLASS_POINTS_API
  const token = (options?.token ?? REPORTS_READ_TOKEN).trim()
  if (!token) {
    throw new ClassApiError('invalid', 'Kein Leseschlüssel konfiguriert.')
  }

  let response: Response
  try {
    response = await fetchImpl(`${baseUrl}${path}`, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${token}`,
      },
    })
  } catch {
    throw new ClassApiError('network', 'Keine Verbindung zum Server. Bitte Internet prüfen.')
  }

  if (response.status === 401 || response.status === 403) {
    throw new ClassApiError('http', 'Nicht autorisiert — REPORTS_TOKEN prüfen.', response.status)
  }
  if (response.status === 429) {
    throw new ClassApiError('rate', 'Zu viele Anfragen. Bitte kurz warten.', 429)
  }
  if (response.status === 503) {
    throw new ClassApiError(
      'not_ready',
      'REPORTS_TOKEN fehlt auf dem Worker. Bitte in Cloudflare setzen.',
      503,
    )
  }
  if (response.status === 404) {
    throw new ClassApiError('http', 'Meldung nicht gefunden.', 404)
  }
  if (!response.ok) {
    let message = 'Aktion fehlgeschlagen.'
    try {
      const body = (await response.json()) as { error?: string }
      if (typeof body.error === 'string' && body.error.trim()) message = body.error.trim()
    } catch {
      /* ignore */
    }
    throw new ClassApiError(
      response.status === 400 ? 'invalid' : 'http',
      message,
      response.status,
    )
  }
  return response
}

/** Anonymous POST — no user/device identifiers. */
export async function submitTaskReport(
  payload: TaskReportPayload,
  options?: { fetchImpl?: typeof fetch; baseUrl?: string; storage?: Storage },
): Promise<{ id: string }> {
  const comment = trimReportComment(payload.comment)
  if (!comment) {
    throw new ClassApiError('invalid', 'Bitte einen kurzen Kommentar eingeben.')
  }
  if (
    !Number.isFinite(payload.contentId) ||
    payload.contentId < 1000 ||
    payload.contentId > 9999
  ) {
    throw new ClassApiError('invalid', 'Ungültige Content-ID.')
  }

  const fetchImpl = options?.fetchImpl ?? fetch
  const baseUrl = options?.baseUrl ?? CLASS_POINTS_API
  let response: Response
  try {
    response = await fetchImpl(`${baseUrl}/reports/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentId: Math.floor(payload.contentId),
        comment,
        ...(payload.topicId?.trim() ? { topicId: payload.topicId.trim() } : {}),
        ...(payload.topicTitle?.trim() ? { topicTitle: payload.topicTitle.trim() } : {}),
        ...(payload.areaTitle?.trim() ? { areaTitle: payload.areaTitle.trim() } : {}),
        ...(payload.question?.trim()
          ? { question: payload.question.trim().slice(0, 280) }
          : {}),
        ...(payload.appVersion?.trim() ? { appVersion: payload.appVersion.trim() } : {}),
      }),
    })
  } catch {
    throw new ClassApiError('network', 'Keine Verbindung zum Server. Bitte Internet prüfen.')
  }

  if (response.status === 429) {
    throw new ClassApiError('rate', 'Zu viele Anfragen. Bitte kurz warten.', 429)
  }
  if (!response.ok) {
    let message = 'Meldung konnte nicht gesendet werden.'
    try {
      const body = (await response.json()) as { error?: string }
      if (typeof body.error === 'string' && body.error.trim()) message = body.error.trim()
    } catch {
      /* ignore */
    }
    throw new ClassApiError(
      response.status === 400 ? 'invalid' : 'http',
      message,
      response.status,
    )
  }

  try {
    const body = (await response.json()) as { id?: unknown }
    if (typeof body.id === 'string' && body.id.trim()) {
      const id = body.id.trim()
      rememberMyReportId(id, options?.storage, Date.now(), {
        contentId: Math.floor(payload.contentId),
        comment,
        ...(payload.topicTitle?.trim()
          ? { topicTitle: payload.topicTitle.trim() }
          : {}),
      })
      return { id }
    }
  } catch {
    /* fall through */
  }
  throw new ClassApiError('http', 'Unerwartete Server-Antwort.')
}

/** Entwickler-only list — requires REPORTS_READ_TOKEN / Worker REPORTS_TOKEN. */
export async function fetchTaskReports(options?: {
  fetchImpl?: typeof fetch
  baseUrl?: string
  token?: string
}): Promise<TaskReport[]> {
  const response = await reportsMutate(
    '/reports/tasks',
    { cache: 'no-store' },
    options,
  )

  try {
    const body = (await response.json()) as { reports?: unknown }
    if (!Array.isArray(body.reports)) return []
    return body.reports
      .map(parseReportRow)
      .filter((row): row is TaskReport => row !== null)
  } catch {
    throw new ClassApiError('http', 'Unerwartete Server-Antwort.')
  }
}

/** Open (not erledigt/korrigiert) reports — used for Entwickler nav/settings badges. */
export function countOpenTaskReports(reports: TaskReport[]): number {
  return reports.reduce((n, row) => (row.status === 'open' ? n + 1 : n), 0)
}

export async function fetchOpenTaskReportCount(options?: {
  fetchImpl?: typeof fetch
  baseUrl?: string
  token?: string
}): Promise<number> {
  return countOpenTaskReports(await fetchTaskReports(options))
}

/**
 * Anonymous status check for report ids remembered on this device.
 * Returns only status / reply for known ids — never lists other reports.
 * Ids omitted from a successful response are treated as deleted and purged
 * from local memory (so Meine Meldungen / banners disappear).
 */
export async function fetchMyReportUpdates(options?: {
  fetchImpl?: typeof fetch
  baseUrl?: string
  storage?: Storage
  ids?: string[]
  /** When false, skip purge-on-missing (tests / dry lookup). Default true. */
  purgeMissing?: boolean
}): Promise<TaskReportUpdate[]> {
  const ids =
    options?.ids ??
    listMyStoredReports(options?.storage).map((row) => row.id)
  if (ids.length === 0) return []

  const fetchImpl = options?.fetchImpl ?? fetch
  const baseUrl = options?.baseUrl ?? CLASS_POINTS_API
  let response: Response
  try {
    response = await fetchImpl(`${baseUrl}/reports/tasks/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: ids.slice(0, MAX_MY_TASK_REPORTS) }),
    })
  } catch {
    throw new ClassApiError('network', 'Keine Verbindung zum Server. Bitte Internet prüfen.')
  }

  if (response.status === 429) {
    throw new ClassApiError('rate', 'Zu viele Anfragen. Bitte kurz warten.', 429)
  }
  if (!response.ok) {
    throw new ClassApiError('http', 'Status konnte nicht geladen werden.', response.status)
  }

  try {
    const body = (await response.json()) as { reports?: unknown }
    if (!Array.isArray(body.reports)) return []
    const updates = body.reports
      .map(parseReportUpdate)
      .filter((row): row is TaskReportUpdate => row !== null)
    if (options?.purgeMissing !== false) {
      purgeMissingMyReports(ids, updates, options?.storage)
    }
    return updates
  } catch {
    throw new ClassApiError('http', 'Unerwartete Server-Antwort.')
  }
}

/** Mark a report as done (erledigt) — still listed until deleted; no reporter notice. */
export async function markTaskReportDone(
  id: string,
  options?: { fetchImpl?: typeof fetch; baseUrl?: string; token?: string },
): Promise<TaskReport> {
  return patchTaskReportStatus(id, { status: 'done' }, options)
}

/** Mark as korrigiert and optionally notify the reporter with a short message. */
export async function markTaskReportFixed(
  id: string,
  replyMessage?: string,
  options?: { fetchImpl?: typeof fetch; baseUrl?: string; token?: string },
): Promise<TaskReport> {
  const reply = replyMessage !== undefined ? trimReportReply(replyMessage) : undefined
  return patchTaskReportStatus(
    id,
    {
      status: 'fixed',
      ...(reply !== undefined ? { replyMessage: reply } : { replyMessage: '' }),
    },
    options,
  )
}

async function patchTaskReportStatus(
  id: string,
  body: { status: TaskReportStatus; replyMessage?: string },
  options?: { fetchImpl?: typeof fetch; baseUrl?: string; token?: string },
): Promise<TaskReport> {
  const trimmed = id.trim()
  if (!trimmed) {
    throw new ClassApiError('invalid', 'Ungültige Melde-ID.')
  }
  const response = await reportsMutate(
    `/reports/tasks/${encodeURIComponent(trimmed)}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    options,
  )
  try {
    const parsed = (await response.json()) as { report?: unknown }
    const report = parseReportRow(parsed.report)
    if (report) return report
  } catch {
    /* fall through */
  }
  throw new ClassApiError('http', 'Unerwartete Server-Antwort.')
}

/** Permanently remove a report from the Cloudflare list. */
export async function deleteTaskReport(
  id: string,
  options?: { fetchImpl?: typeof fetch; baseUrl?: string; token?: string },
): Promise<void> {
  const trimmed = id.trim()
  if (!trimmed) {
    throw new ClassApiError('invalid', 'Ungültige Melde-ID.')
  }
  await reportsMutate(
    `/reports/tasks/${encodeURIComponent(trimmed)}`,
    { method: 'DELETE' },
    options,
  )
}
