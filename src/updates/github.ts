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
  return {
    available: true,
    version,
    title: (release.name || `Version ${version}`).trim(),
    notes: (release.body || '').trim(),
    htmlUrl: release.html_url || GITHUB_RELEASES_PAGE,
    downloadUrl: asset?.browser_download_url || release.html_url || GITHUB_RELEASES_PAGE,
    downloadLabel: asset?.name ?? null,
    canAutoInstall,
  }
}

export const UPDATE_CHECK_FAILED = 'Prüfung fehlgeschlagen.'

export type AppUpdateProbe =
  | { status: 'update'; info: AppUpdateInfo }
  | { status: 'current' }
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
}): Promise<AppUpdateProbe> {
  try {
    const release = await fetchLatestRelease(options.fetchImpl)
    if (!release) return { status: 'error', message: UPDATE_CHECK_FAILED }
    const platform = options.platform ?? detectPlatform()
    const info = releaseToUpdateInfo(
      release,
      options.currentVersion,
      platform,
      options.canAutoInstall ?? false,
    )
    if (!info) return { status: 'current' }
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
}): Promise<AppUpdateInfo | null> {
  const probe = await probeAppUpdate(options)
  return probe.status === 'update' ? probe.info : null
}
