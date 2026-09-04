export type DesktopPlatform = 'win32' | 'darwin' | 'linux'

export interface GithubReleaseAsset {
  name: string
  browser_download_url: string
}

export interface GithubRelease {
  tag_name: string
  name: string | null
  body: string | null
  html_url: string
  prerelease: boolean
  draft: boolean
  assets: GithubReleaseAsset[]
}

export interface AppUpdateInfo {
  available: true
  version: string
  title: string
  notes: string
  htmlUrl: string
  downloadUrl: string
  downloadLabel: string | null
  /** True when the Electron main process can download + quitAndInstall. */
  canAutoInstall: boolean
}

export type UpdateCheckResult =
  | AppUpdateInfo
  | { available: false; current: string }

export type DesktopUpdateEvent =
  | { type: 'progress'; percent: number }
  | { type: 'downloaded'; version?: string }
  | { type: 'error'; message: string }

export interface DesktopDownloadResult {
  ok: boolean
  mode: 'auto' | 'external'
  error?: string
}

/** Status of the in-app LAN HTTP server (desktop only). */
export interface LanServerStatus {
  running: boolean
  port: number | null
  /** Loopback plus RFC1918 URLs, each with a trailing slash. */
  urls: string[]
  /** Wi-Fi / LAN URLs only (no 127.0.0.1). */
  lanUrls: string[]
  error: string | null
}

export interface MathsachsDesktop {
  isDesktop: true
  platform: string
  getVersion: () => Promise<string>
  checkForUpdates: () => Promise<UpdateCheckResult>
  downloadUpdate: () => Promise<DesktopDownloadResult>
  installUpdate: () => Promise<void>
  openExternal: (url: string) => Promise<void>
  getLanStatus: () => Promise<LanServerStatus>
  onUpdateEvent: (callback: (event: DesktopUpdateEvent) => void) => () => void
}
