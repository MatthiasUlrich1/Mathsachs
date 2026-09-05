'use strict'

const OWNER = 'MatthiasUlrich1'
const REPO = 'Mathsachs'
const LATEST_API = `https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`
const RELEASES_PAGE = `https://github.com/${OWNER}/${REPO}/releases`
const UPDATE_BUILDING_HINT =
  'Da kommt was neues!\nEin Update wird gerade erzeugt.\nBitte in 5 Minuten erneut prüfen.'

function parseSemver(input) {
  const cleaned = String(input || '')
    .trim()
    .replace(/^v/i, '')
  const match = cleaned.match(/^(\d+)\.(\d+)\.(\d+)/)
  if (!match) return null
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

function compareSemver(a, b) {
  const pa = parseSemver(a)
  const pb = parseSemver(b)
  if (!pa && !pb) return 0
  if (!pa) return -1
  if (!pb) return 1
  for (let i = 0; i < 3; i++) {
    if (pa[i] > pb[i]) return 1
    if (pa[i] < pb[i]) return -1
  }
  return 0
}

function isNewerVersion(latest, current) {
  return compareSemver(latest, current) > 0
}

function normalizeVersion(input) {
  const parsed = parseSemver(input)
  return parsed ? parsed.join('.') : String(input || '').trim().replace(/^v/i, '')
}

function pickPlatformAsset(assets, platform) {
  const list = (assets || []).filter((a) => a && a.name && a.browser_download_url)
  if (platform === 'win32') {
    return list.find((a) => /\.exe$/i.test(a.name)) || null
  }
  if (platform === 'darwin') {
    return list.find((a) => /\.dmg$/i.test(a.name)) || null
  }
  return (
    list.find((a) => /\.appimage$/i.test(a.name)) ||
    list.find((a) => /\.deb$/i.test(a.name)) ||
    null
  )
}

function updaterYamlName(platform) {
  if (platform === 'win32') return 'latest.yml'
  if (platform === 'darwin') return 'latest-mac.yml'
  return 'latest-linux.yml'
}

function hasUpdaterYaml(assets, platform) {
  const name = updaterYamlName(platform)
  return (assets || []).some((a) => a && a.name === name)
}

function releaseIsReady(release, platform) {
  return Boolean(pickPlatformAsset(release && release.assets, platform))
}

function isMissingUpdateArtifactError(err) {
  const msg = err && err.message ? String(err.message) : String(err || '')
  return /404|410|latest(-mac|-linux)?\.yml|Cannot download|ENOENT/i.test(msg)
}

async function urlIsDownloadable(url, fetchImpl) {
  const fetchFn = fetchImpl || fetch
  try {
    const response = await fetchFn(url, { method: 'HEAD', redirect: 'follow' })
    if (response.status === 404 || response.status === 410) return false
    return true
  } catch {
    return true
  }
}

async function fetchLatestRelease(fetchImpl) {
  const fetchFn = fetchImpl || fetch
  const response = await fetchFn(LATEST_API, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'Mathsachs',
    },
  })
  if (!response.ok) return null
  const data = await response.json()
  if (!data || typeof data.tag_name !== 'string') return null
  return data
}

/**
 * @returns {{
 *   status: 'current' | 'building' | 'update' | 'error',
 *   info?: object,
 *   yamlReady?: boolean,
 *   message?: string,
 * }}
 */
async function probeGithubUpdate(currentVersion, platform, options) {
  const opts = options || {}
  const fetchImpl = opts.fetchImpl
  const release = await fetchLatestRelease(fetchImpl)
  if (!release || release.draft || release.prerelease) {
    return { status: 'current' }
  }
  const version = normalizeVersion(release.tag_name)
  if (!isNewerVersion(version, currentVersion)) return { status: 'current' }
  const asset = pickPlatformAsset(release.assets, platform)
  if (!asset) {
    return { status: 'building', message: UPDATE_BUILDING_HINT, version }
  }
  if (opts.verifyUrls) {
    const ok = await urlIsDownloadable(asset.browser_download_url, fetchImpl)
    if (!ok) {
      return { status: 'building', message: UPDATE_BUILDING_HINT, version }
    }
  }
  const yamlReady = hasUpdaterYaml(release.assets, platform)
  const canAutoInstall = Boolean(opts.canAutoInstall && yamlReady)
  return {
    status: 'update',
    yamlReady,
    info: {
      available: true,
      version,
      title: (release.name || `Version ${version}`).trim(),
      notes: (release.body || '').trim(),
      htmlUrl: release.html_url || RELEASES_PAGE,
      downloadUrl: asset.browser_download_url,
      downloadLabel: asset.name,
      canAutoInstall,
    },
  }
}

function resolveDesktopUpdateCheck({
  current,
  github,
  updaterInfo,
  updaterError,
  canAutoInstall,
}) {
  if (github && github.status === 'update' && github.info) {
    return {
      ...github.info,
      canAutoInstall: Boolean(canAutoInstall && github.yamlReady),
    }
  }

  if (github && github.status === 'building') {
    return {
      available: false,
      building: true,
      current,
      message: UPDATE_BUILDING_HINT,
    }
  }

  const updaterHasNewer =
    updaterInfo && isNewerVersion(updaterInfo.version, current)
  if (updaterHasNewer && (!github || github.status !== 'current')) {
    const notes =
      typeof updaterInfo.releaseNotes === 'string'
        ? updaterInfo.releaseNotes
        : ''
    return {
      available: true,
      version: updaterInfo.version,
      title: updaterInfo.releaseName || `Version ${updaterInfo.version}`,
      notes,
      htmlUrl: RELEASES_PAGE,
      downloadUrl: RELEASES_PAGE,
      downloadLabel: null,
      canAutoInstall: Boolean(canAutoInstall),
    }
  }

  void updaterError
  return { available: false, current }
}

async function checkGithubUpdate(currentVersion, platform, canAutoInstall) {
  const probe = await probeGithubUpdate(currentVersion, platform, {
    canAutoInstall,
    verifyUrls: false,
  })
  return probe.status === 'update' ? probe.info : null
}

module.exports = {
  RELEASES_PAGE,
  UPDATE_BUILDING_HINT,
  checkGithubUpdate,
  hasUpdaterYaml,
  isMissingUpdateArtifactError,
  isNewerVersion,
  normalizeVersion,
  pickPlatformAsset,
  probeGithubUpdate,
  releaseIsReady,
  resolveDesktopUpdateCheck,
  updaterYamlName,
  urlIsDownloadable,
}
