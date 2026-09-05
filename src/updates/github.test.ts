import { describe, expect, it, vi } from 'vitest'
import { GITHUB_RELEASES_LATEST_API } from './constants'
import {
  UPDATE_BUILDING_HINT,
  UPDATE_CHECK_FAILED,
  checkForAppUpdate,
  detectPlatform,
  hasUpdaterYaml,
  pickPlatformAsset,
  probeAppUpdate,
  releaseIsReady,
  releaseToUpdateInfo,
  updaterYamlName,
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

  it('reports current when the latest tag is not newer', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({ ...newerRelease, tag_name: 'v0.1.3' }),
    )
    expect(
      await probeAppUpdate({
        currentVersion: '0.1.3',
        platform: 'linux',
        fetchImpl,
      }),
    ).toEqual({ status: 'current' })
  })

  it('reports building when a newer tag has no matching installer yet', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({ ...newerRelease, assets: [] }),
    )
    expect(
      await probeAppUpdate({
        currentVersion: '0.1.3',
        platform: 'win32',
        fetchImpl,
      }),
    ).toEqual({ status: 'building', message: UPDATE_BUILDING_HINT })
    expect(
      await checkForAppUpdate({
        currentVersion: '0.1.3',
        platform: 'win32',
        fetchImpl,
      }),
    ).toBeNull()
  })

  it('reports building when only the other platform’s installer is listed', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({
        ...newerRelease,
        assets: [
          {
            name: 'Mathsachs-0.1.4.dmg',
            browser_download_url: 'https://example.com/app.dmg',
          },
        ],
      }),
    )
    expect(
      await probeAppUpdate({
        currentVersion: '0.1.3',
        platform: 'win32',
        fetchImpl,
      }),
    ).toEqual({ status: 'building', message: UPDATE_BUILDING_HINT })
  })

  it('reports an update when the matching installer is listed', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(newerRelease))
    const probe = await probeAppUpdate({
      currentVersion: '0.1.3',
      platform: 'win32',
      fetchImpl,
    })
    expect(probe.status).toBe('update')
    if (probe.status === 'update') {
      expect(probe.info.downloadUrl).toBe('https://example.com/setup.exe')
    }
  })

  it('reports building when a listed installer URL returns 404', async () => {
    const fetchImpl = vi.fn(async (input: Parameters<typeof fetch>[0], init?: RequestInit) => {
      const url =
        typeof input === 'string'
          ? input
          : input instanceof URL
            ? input.href
            : input.url
      if (init?.method === 'HEAD' && /setup\.exe$/i.test(url)) {
        return new Response(null, { status: 404 })
      }
      return jsonResponse(newerRelease)
    })
    expect(
      await probeAppUpdate({
        currentVersion: '0.1.3',
        platform: 'win32',
        fetchImpl,
        verifyDownload: true,
      }),
    ).toEqual({ status: 'building', message: UPDATE_BUILDING_HINT })
  })

  it('reports an error when the GitHub API is unavailable', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ message: 'nope' }, 404))
    expect(
      await probeAppUpdate({ currentVersion: '0.1.3', fetchImpl }),
    ).toEqual({ status: 'error', message: UPDATE_CHECK_FAILED })

    const failing = vi.fn().mockRejectedValue(new Error('network'))
    expect(
      await probeAppUpdate({ currentVersion: '0.1.3', fetchImpl: failing }),
    ).toEqual({ status: 'error', message: UPDATE_CHECK_FAILED })
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

  it('does not treat a newer release as available when no matching installer exists', () => {
    expect(
      releaseToUpdateInfo({ ...newerRelease, assets: [] }, '0.1.3', 'win32'),
    ).toBeNull()
    expect(
      releaseToUpdateInfo(
        {
          ...newerRelease,
          assets: [
            {
              name: 'latest.yml',
              browser_download_url: 'https://example.com/latest.yml',
            },
          ],
        },
        '0.1.3',
        'win32',
      ),
    ).toBeNull()
  })

  it('offers Download only when the platform installer is listed', () => {
    const info = releaseToUpdateInfo(newerRelease, '0.1.3', 'win32')
    expect(info).toMatchObject({
      available: true,
      downloadUrl: 'https://example.com/setup.exe',
      downloadLabel: 'Mathsachs-Setup-0.1.4.exe',
      canAutoInstall: false,
    })
  })

  it('enables auto-install only when the updater YAML is listed too', () => {
    const withYaml: GithubRelease = {
      ...newerRelease,
      assets: [
        ...assets,
        {
          name: 'latest.yml',
          browser_download_url: 'https://example.com/latest.yml',
        },
      ],
    }
    expect(releaseToUpdateInfo(withYaml, '0.1.3', 'win32', true)?.canAutoInstall).toBe(
      true,
    )
    expect(
      releaseToUpdateInfo(newerRelease, '0.1.3', 'win32', true)?.canAutoInstall,
    ).toBe(false)
  })
})

describe('releaseIsReady / updater YAML', () => {
  it('requires the platform installer and names the electron-updater YAML', () => {
    expect(releaseIsReady(newerRelease, 'win32')).toBe(true)
    expect(releaseIsReady({ ...newerRelease, assets: [] }, 'win32')).toBe(false)
    expect(updaterYamlName('win32')).toBe('latest.yml')
    expect(updaterYamlName('darwin')).toBe('latest-mac.yml')
    expect(updaterYamlName('linux')).toBe('latest-linux.yml')
    expect(hasUpdaterYaml(assets, 'win32')).toBe(false)
    expect(
      hasUpdaterYaml(
        [...assets, { name: 'latest.yml', browser_download_url: 'https://x/latest.yml' }],
        'win32',
      ),
    ).toBe(true)
  })
})
