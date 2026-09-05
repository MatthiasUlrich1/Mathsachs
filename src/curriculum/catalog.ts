import { GITHUB_OWNER, GITHUB_REPO } from '../updates/constants'
import { parseCurriculumPack, parseManifest, type CurriculumManifest, type CurriculumPack } from './pack'

export const CURRICULUM_MANIFEST_PATH = 'curricula/manifest.json'
export const CURRICULUM_MANIFEST_URLS = [
  `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${CURRICULUM_MANIFEST_PATH}`,
  `https://cdn.jsdelivr.net/gh/${GITHUB_OWNER}/${GITHUB_REPO}@main/${CURRICULUM_MANIFEST_PATH}`,
]
export const LAST_CURRICULUM_CHECK_KEY = 'mathsachs.curriculumCheckAt.v1'
export const SESSION_DISMISS_CURRICULUM_KEY = 'mathsachs.dismissCurriculum.session'

const resolveUrl = (url: string, base: string): string => {
  try {
    return new URL(url, base).toString()
  } catch {
    return url
  }
}

export async function fetchCurriculumManifest(
  fetchImpl: typeof fetch = fetch,
  urls: string[] = CURRICULUM_MANIFEST_URLS,
): Promise<CurriculumManifest | null> {
  for (const url of urls) {
    try {
      const response = await fetchImpl(url, { cache: 'no-store' })
      if (!response.ok) continue
      const parsed = parseManifest(await response.json())
      if (!parsed) continue
      return {
        ...parsed,
        packs: parsed.packs.map((pack) => ({ ...pack, url: resolveUrl(pack.url, url) })),
      }
    } catch {
      /* next host */
    }
  }
  return null
}

export async function fetchCurriculumPack(
  url: string,
  fetchImpl: typeof fetch = fetch,
): Promise<CurriculumPack | null> {
  try {
    const response = await fetchImpl(url, { cache: 'no-store' })
    if (!response.ok) return null
    return parseCurriculumPack(await response.json())
  } catch {
    return null
  }
}

export function readLastCurriculumCheckAt(storage?: Pick<Storage, 'getItem'> | null): number | null {
  const store = storage ?? (typeof localStorage !== 'undefined' ? localStorage : undefined)
  if (!store) return null
  try {
    const value = Number(store.getItem(LAST_CURRICULUM_CHECK_KEY))
    return Number.isFinite(value) && value > 0 ? value : null
  } catch {
    return null
  }
}

export function writeLastCurriculumCheckAt(at: number, storage?: Pick<Storage, 'setItem'> | null): void {
  const store = storage ?? (typeof localStorage !== 'undefined' ? localStorage : undefined)
  if (!store) return
  try {
    store.setItem(LAST_CURRICULUM_CHECK_KEY, String(at))
  } catch {
    /* private mode */
  }
}
