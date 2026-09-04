'use strict'

const OWNER = 'MatthiasUlrich1'
const REPO = 'Mathsachs'
const LATEST_API = `https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`
const RELEASES_PAGE = `https://github.com/${OWNER}/${REPO}/releases`

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

async function fetchLatestRelease() {
  const response = await fetch(LATEST_API, {
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

async function checkGithubUpdate(currentVersion, platform, canAutoInstall) {
  const release = await fetchLatestRelease()
  if (!release || release.draft || release.prerelease) return null
  const version = normalizeVersion(release.tag_name)
  if (!isNewerVersion(version, currentVersion)) return null
  const asset = pickPlatformAsset(release.assets, platform)
  return {
    available: true,
    version,
    title: (release.name || `Version ${version}`).trim(),
    notes: (release.body || '').trim(),
    htmlUrl: release.html_url || RELEASES_PAGE,
    downloadUrl: (asset && asset.browser_download_url) || release.html_url || RELEASES_PAGE,
    downloadLabel: (asset && asset.name) || null,
    canAutoInstall: Boolean(canAutoInstall),
  }
}

module.exports = {
  RELEASES_PAGE,
  checkGithubUpdate,
  isNewerVersion,
  normalizeVersion,
}
