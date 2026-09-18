import { CLASS_POINTS_API, ClassApiError } from '../classCode/api'

/**
 * Shared read token for Entwickler GET /reports/tasks.
 * Must match the Cloudflare Worker secret `REPORTS_TOKEN`
 * (Workers → mathsachs-punkte → Settings → Variables → REPORTS_TOKEN).
 * Same privacy model as the Lehrercode: present in the client, not public API.
 */
export const REPORTS_READ_TOKEN = 'MS-REPORTS-8K3QZ7WN'

export const MAX_REPORT_COMMENT = 500

export type TaskReportStatus = 'open' | 'done'

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
}

export function trimReportComment(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ').slice(0, MAX_REPORT_COMMENT)
}

export function isReportCommentValid(raw: string): boolean {
  return trimReportComment(raw).length > 0
}

function normalizeReportStatus(value: unknown): TaskReportStatus {
  if (typeof value !== 'string') return 'open'
  const trimmed = value.trim().toLowerCase()
  if (trimmed === 'done' || trimmed === 'erledigt') return 'done'
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
  options?: { fetchImpl?: typeof fetch; baseUrl?: string },
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
    if (typeof body.id === 'string' && body.id.trim()) return { id: body.id.trim() }
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

/** Open (not erledigt) reports — used for Entwickler nav/settings badges. */
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

/** Mark a report as done (erledigt) — still listed until deleted. */
export async function markTaskReportDone(
  id: string,
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
      body: JSON.stringify({ status: 'done' }),
    },
    options,
  )
  try {
    const body = (await response.json()) as { report?: unknown }
    const report = parseReportRow(body.report)
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
