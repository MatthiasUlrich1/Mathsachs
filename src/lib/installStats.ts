import { CLASS_POINTS_API, ClassApiError } from '../classCode/api'

export const INSTALL_COUNTED_KEY = 'mathsachs.installCounted.v1'

const readFlag = (storage?: Pick<Storage, 'getItem'> | null): boolean => {
  const store = storage ?? (typeof localStorage !== 'undefined' ? localStorage : null)
  if (!store) return false
  try {
    return store.getItem(INSTALL_COUNTED_KEY) === '1'
  } catch {
    return false
  }
}

const writeFlag = (storage?: Pick<Storage, 'setItem'> | null): void => {
  const store = storage ?? (typeof localStorage !== 'undefined' ? localStorage : null)
  if (!store) return
  try {
    store.setItem(INSTALL_COUNTED_KEY, '1')
  } catch {
    /* private mode */
  }
}

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

/** Public anonymous install total (no personal data). */
export async function fetchInstallCount(
  fetchImpl: typeof fetch = fetch,
  baseUrl: string = CLASS_POINTS_API,
): Promise<number | null> {
  try {
    const response = await fetchImpl(`${baseUrl}/stats/install`, { cache: 'no-store' })
    return parseCount(response)
  } catch {
    return null
  }
}

/**
 * Once per device: anonymous +1 on Cloudflare.
 * Stores only a local “already counted” flag — never a device id.
 */
export async function reportFirstInstall(
  options?: {
    fetchImpl?: typeof fetch
    baseUrl?: string
    storage?: Pick<Storage, 'getItem' | 'setItem'> | null
  },
): Promise<number | null> {
  const storage = options?.storage
  if (readFlag(storage)) return null
  const fetchImpl = options?.fetchImpl ?? fetch
  const baseUrl = options?.baseUrl ?? CLASS_POINTS_API
  try {
    const response = await fetchImpl(`${baseUrl}/stats/install`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    })
    if (response.status === 429) {
      throw new ClassApiError('rate', 'Zu viele Anfragen. Bitte kurz warten.', 429)
    }
    const count = await parseCount(response)
    if (count == null) return null
    writeFlag(storage)
    return count
  } catch (error) {
    if (error instanceof ClassApiError) throw error
    return null
  }
}
