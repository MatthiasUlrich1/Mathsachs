/** Public GitHub repository that publishes Mathsachs releases. */
export const GITHUB_OWNER = 'MatthiasUlrich1'
export const GITHUB_REPO = 'Mathsachs'

export const GITHUB_RELEASES_LATEST_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`

export const GITHUB_RELEASES_PAGE = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases`

/** electron-updater metadata — no API rate limit (CDN redirect from /latest/download/). */
export const githubLatestYamlUrl = (file: string): string =>
  `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest/download/${file}`

export const IGNORE_KEY = 'mathsachs.ignoreUpdate.v1'
export const SESSION_DISMISS_KEY = 'mathsachs.dismissUpdate.session'
export const LAST_UPDATE_CHECK_KEY = 'mathsachs.updateCheckAt.v1'
