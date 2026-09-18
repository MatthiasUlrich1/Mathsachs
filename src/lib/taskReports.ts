import { CLASS_POINTS_API, ClassApiError } from '../classCode/api'

/**
 * Shared read token for Entwickler GET /reports/tasks.
 * Must match the Cloudflare Worker secret `REPORTS_TOKEN`
 * (Workers → mathsachs-punkte → Settings → Variables → REPORTS_TOKEN).
 * Same privacy model as the Lehrercode: present in the client, not public API.
 */
export const REPORTS_READ_TOKEN = 'MS-REPORTS-8K3QZ7WN'

export const MAX_REPORT_COMMENT = 500

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
}

export function trimReportComment(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ').slice(0, MAX_REPORT_COMMENT)
}

export function isReportCommentValid(raw: string): boolean {
  return trimReportComment(raw).length > 0
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
  const fetchImpl = options?.fetchImpl ?? fetch
  const baseUrl = options?.baseUrl ?? CLASS_POINTS_API
  const token = (options?.token ?? REPORTS_READ_TOKEN).trim()
  if (!token) {
    throw new ClassApiError('invalid', 'Kein Leseschlüssel konfiguriert.')
  }

  let response: Response
  try {
    response = await fetchImpl(`${baseUrl}/reports/tasks`, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` },
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
  if (!response.ok) {
    throw new ClassApiError('http', 'Liste konnte nicht geladen werden.', response.status)
  }

  try {
    const body = (await response.json()) as { reports?: unknown }
    if (!Array.isArray(body.reports)) return []
    return body.reports.filter((row): row is TaskReport => {
      if (!row || typeof row !== 'object') return false
      const r = row as TaskReport
      return (
        typeof r.id === 'string' &&
        typeof r.comment === 'string' &&
        typeof r.contentId === 'number' &&
        typeof r.at === 'number'
      )
    })
  } catch {
    throw new ClassApiError('http', 'Unerwartete Server-Antwort.')
  }
}
