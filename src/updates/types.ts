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

export interface MathsachsDesktop {
  isDesktop: true
  platform: string
  getVersion: () => Promise<string>
  checkForUpdates: () => Promise<UpdateCheckResult>
  downloadUpdate: () => Promise<DesktopDownloadResult>
  installUpdate: () => Promise<void>
  openExternal: (url: string) => Promise<void>
  onUpdateEvent: (callback: (event: DesktopUpdateEvent) => void) => () => void
}
