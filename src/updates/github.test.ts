import { describe, expect, it, vi } from 'vitest'
import { GITHUB_RELEASES_LATEST_API } from './constants'
import {
  checkForAppUpdate,
  detectPlatform,
  pickPlatformAsset,
  releaseToUpdateInfo,
} from './github'
import type { GithubRelease, GithubReleaseAsset } from './types'

const assets: GithubReleaseAsset[] = [
  {
    name: 'Mathsachs-Setup-0.1.4.exe',
    browser_download_url: 'https://example.com/setup.exe',
  },
  {
    name: 'Mathsachs-0.1.4.dmg',
    browser_download_url: 'https://example.com/app.dmg',
  },
  {
    name: 'Mathsachs-0.1.4.AppImage',
    browser_download_url: 'https://example.com/app.AppImage',
  },
  {
    name: 'mathsachs_0.1.4_amd64.deb',
    browser_download_url: 'https://example.com/app.deb',
  },
]

const newerRelease: GithubRelease = {
  tag_name: 'v0.1.4',
  name: 'v0.1.4',
  body: '## Neu\n- Klausur-Code\n- Desktop-Installer',
  html_url: 'https://github.com/MatthiasUlrich1/Mathsachs/releases/tag/v0.1.4',
  prerelease: false,
  draft: false,
  assets,
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('pickPlatformAsset', () => {
  it('maps Windows to the .exe installer', () => {
    expect(pickPlatformAsset(assets, 'win32')?.name).toMatch(/\.exe$/)
  })

  it('maps macOS to the .dmg', () => {
    expect(pickPlatformAsset(assets, 'darwin')?.name).toMatch(/\.dmg$/)
  })

  it('prefers AppImage on Linux and falls back to .deb', () => {
    expect(pickPlatformAsset(assets, 'linux')?.name).toMatch(/\.AppImage$/i)
    const withoutAppImage = assets.filter((a) => !/\.appimage$/i.test(a.name))
    expect(pickPlatformAsset(withoutAppImage, 'linux')?.name).toMatch(/\.deb$/)
  })
})

describe('detectPlatform', () => {
  it('reads Windows / macOS / Linux from the user agent', () => {
    expect(detectPlatform('Mozilla/5.0 (Windows NT 10.0)')).toBe('win32')
    expect(detectPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)')).toBe(
      'darwin',
    )
    expect(detectPlatform('Mozilla/5.0 (X11; Linux x86_64)')).toBe('linux')
  })
})

describe('checkForAppUpdate', () => {
  it('reports an update when the latest tag is newer than 0.1.3', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(newerRelease))
    const info = await checkForAppUpdate({
      currentVersion: '0.1.3',
      platform: 'win32',
      fetchImpl,
    })
    expect(fetchImpl).toHaveBeenCalledWith(
      GITHUB_RELEASES_LATEST_API,
      expect.objectContaining({ headers: expect.any(Object) }),
    )
    expect(info).toMatchObject({
      available: true,
      version: '0.1.4',
      downloadUrl: 'https://example.com/setup.exe',
      downloadLabel: 'Mathsachs-Setup-0.1.4.exe',
    })
    expect(info?.notes).toContain('Klausur-Code')
  })

  it('reports no update when the latest tag equals the current version', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({ ...newerRelease, tag_name: 'v0.1.3' }),
    )
    const info = await checkForAppUpdate({
      currentVersion: '0.1.3',
      platform: 'linux',
      fetchImpl,
    })
    expect(info).toBeNull()
  })

  it('reports no update when the latest tag is older than the current version', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({ ...newerRelease, tag_name: 'v0.1.2' }),
    )
    const info = await checkForAppUpdate({
      currentVersion: '0.1.3',
      platform: 'darwin',
      fetchImpl,
    })
    expect(info).toBeNull()
  })

  it('returns null when the GitHub API is unavailable', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ message: 'nope' }, 404))
    expect(
      await checkForAppUpdate({ currentVersion: '0.1.3', fetchImpl }),
    ).toBeNull()

    const failing = vi.fn().mockRejectedValue(new Error('network'))
    expect(
      await checkForAppUpdate({ currentVersion: '0.1.3', fetchImpl: failing }),
    ).toBeNull()
  })
})

describe('releaseToUpdateInfo', () => {
  it('ignores drafts and prereleases', () => {
    expect(
      releaseToUpdateInfo({ ...newerRelease, draft: true }, '0.1.3', 'linux'),
    ).toBeNull()
    expect(
      releaseToUpdateInfo(
        { ...newerRelease, prerelease: true },
        '0.1.3',
        'linux',
      ),
    ).toBeNull()
  })

  it('falls back to the releases page when no matching asset exists', () => {
    const info = releaseToUpdateInfo(
      { ...newerRelease, assets: [] },
      '0.1.3',
      'win32',
    )
    expect(info?.downloadUrl).toBe(newerRelease.html_url)
    expect(info?.downloadLabel).toBeNull()
  })
})
