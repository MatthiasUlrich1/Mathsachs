import { GITHUB_RELEASES_LATEST_API, GITHUB_RELEASES_PAGE } from './constants'
import { isNewerVersion, normalizeVersion } from './semver'
import type {
  AppUpdateInfo,
  DesktopPlatform,
  GithubRelease,
  GithubReleaseAsset,
} from './types'

export function detectPlatform(
  userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '',
): DesktopPlatform {
  if (/Win/i.test(userAgent)) return 'win32'
  if (/Mac/i.test(userAgent)) return 'darwin'
  return 'linux'
}

/**
 * Pick the installer that matches the running OS. Windows → `.exe`,
 * macOS → `.dmg`, Linux → `.AppImage` then `.deb`.
 */
export function pickPlatformAsset(
  assets: GithubReleaseAsset[],
  platform: DesktopPlatform,
): GithubReleaseAsset | null {
  const list = assets.filter((a) => a.name && a.browser_download_url)
  if (platform === 'win32') {
    return list.find((a) => /\.exe$/i.test(a.name)) ?? null
  }
  if (platform === 'darwin') {
    return list.find((a) => /\.dmg$/i.test(a.name)) ?? null
  }
  return (
    list.find((a) => /\.appimage$/i.test(a.name)) ??
    list.find((a) => /\.deb$/i.test(a.name)) ??
    null
  )
}

/** electron-updater metadata file published next to the installer. */
export function updaterYamlName(platform: DesktopPlatform): string {
  if (platform === 'win32') return 'latest.yml'
  if (platform === 'darwin') return 'latest-mac.yml'
  return 'latest-linux.yml'
}

export function hasUpdaterYaml(
  assets: GithubReleaseAsset[],
  platform: DesktopPlatform,
): boolean {
  const name = updaterYamlName(platform)
  return assets.some((a) => a.name === name)
}

/** True when the platform installer is listed on the release. */
export function releaseIsReady(
  release: GithubRelease,
  platform: DesktopPlatform,
): boolean {
  return pickPlatformAsset(release.assets ?? [], platform) != null
}

/**
 * HEAD the installer URL. 404/410 → not ready. Network / CORS / 405 →
 * treat the listed asset as enough (do not block the update).
 */
export async function urlIsDownloadable(
  url: string,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  try {
    const response = await fetchImpl(url, {
      method: 'HEAD',
      redirect: 'follow',
    })
    if (response.status === 404 || response.status === 410) return false
    return true
  } catch {
    return true
  }
}

export function releaseToUpdateInfo(
  release: GithubRelease,
  currentVersion: string,
  platform: DesktopPlatform,
  canAutoInstall = false,
): AppUpdateInfo | null {
  if (release.draft || release.prerelease) return null
  const version = normalizeVersion(release.tag_name)
  if (!isNewerVersion(version, currentVersion)) return null
  const asset = pickPlatformAsset(release.assets ?? [], platform)
  if (!asset) return null
  return {
    available: true,
    version,
    title: (release.name || `Version ${version}`).trim(),
    notes: (release.body || '').trim(),
    htmlUrl: release.html_url || GITHUB_RELEASES_PAGE,
    downloadUrl: asset.browser_download_url,
    downloadLabel: asset.name,
    canAutoInstall: Boolean(canAutoInstall && hasUpdaterYaml(release.assets ?? [], platform)),
  }
}

export const UPDATE_CHECK_FAILED = 'Prüfung fehlgeschlagen.'

export const UPDATE_BUILDING_TITLE = 'Da kommt was neues!'
export const UPDATE_BUILDING_BODY =
  'Ein Update wird gerade erzeugt.\nBitte in 5 Minuten erneut prüfen.'
export const UPDATE_BUILDING_HINT = `${UPDATE_BUILDING_TITLE}\n${UPDATE_BUILDING_BODY}`

export type AppUpdateProbe =
  | { status: 'update'; info: AppUpdateInfo }
  | { status: 'current' }
  | { status: 'building'; message: string }
  | { status: 'error'; message: string }

export async function fetchLatestRelease(
  fetchImpl: typeof fetch = fetch,
): Promise<GithubRelease | null> {
  const response = await fetchImpl(GITHUB_RELEASES_LATEST_API, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  if (!response.ok) return null
  const data = (await response.json()) as GithubRelease
  if (!data || typeof data.tag_name !== 'string') return null
  return data
}

export async function probeAppUpdate(options: {
  currentVersion: string
  platform?: DesktopPlatform
  fetchImpl?: typeof fetch
  canAutoInstall?: boolean
  verifyDownload?: boolean
}): Promise<AppUpdateProbe> {
  try {
    const fetchImpl = options.fetchImpl ?? fetch
    const release = await fetchLatestRelease(fetchImpl)
    if (!release) return { status: 'error', message: UPDATE_CHECK_FAILED }
    if (release.draft || release.prerelease) return { status: 'current' }
    const version = normalizeVersion(release.tag_name)
    if (!isNewerVersion(version, options.currentVersion)) {
      return { status: 'current' }
    }
    const platform = options.platform ?? detectPlatform()
    const info = releaseToUpdateInfo(
      release,
      options.currentVersion,
      platform,
      options.canAutoInstall ?? false,
    )
    if (!info) return { status: 'building', message: UPDATE_BUILDING_HINT }
    if (options.verifyDownload) {
      const ok = await urlIsDownloadable(info.downloadUrl, fetchImpl)
      if (!ok) return { status: 'building', message: UPDATE_BUILDING_HINT }
    }
    return { status: 'update', info }
  } catch {
    return { status: 'error', message: UPDATE_CHECK_FAILED }
  }
}

export async function checkForAppUpdate(options: {
  currentVersion: string
  platform?: DesktopPlatform
  fetchImpl?: typeof fetch
  canAutoInstall?: boolean
  verifyDownload?: boolean
}): Promise<AppUpdateInfo | null> {
  const probe = await probeAppUpdate(options)
  return probe.status === 'update' ? probe.info : null
}
