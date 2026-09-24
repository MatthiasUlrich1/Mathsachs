import { CLASS_POINTS_API } from '../classCode/api'

async function parseCount(response: Response): Promise<number | null> {
  if (!response.ok) return null
  try {
    const body = (await response.json()) as { count?: unknown }
    return typeof body.count === 'number' && Number.isFinite(body.count)
      ? Math.max(0, Math.floor(body.count))
      : null
  } catch {
    return null
  }
}

/** Anonymous global total of checked Schüler answers (no PII). */
export async function fetchSchuelerAnswerCount(
  fetchImpl: typeof fetch = fetch,
  baseUrl: string = CLASS_POINTS_API,
): Promise<number | null> {
  try {
    const response = await fetchImpl(`${baseUrl}/stats/schueler-answers`, {
      cache: 'no-store',
    })
    return parseCount(response)
  } catch {
    return null
  }
}

/**
 * Fire-and-forget +N on the anonymous Cloudflare counter when a Schüler
 * checks an answer. Never sends names, profile ids or task content.
 */
export function reportSchuelerAnswersChecked(
  delta: number,
  options?: { fetchImpl?: typeof fetch; baseUrl?: string },
): void {
  const n = Math.max(1, Math.min(30, Math.floor(delta)))
  const fetchImpl = options?.fetchImpl ?? fetch
  const baseUrl = options?.baseUrl ?? CLASS_POINTS_API
  void fetchImpl(`${baseUrl}/stats/schueler-answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ delta: n }),
  }).catch(() => {
    /* offline / Worker not deployed yet */
  })
}
