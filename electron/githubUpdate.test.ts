import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import { UPDATE_BUILDING_HINT } from '../src/updates/github'

const require = createRequire(import.meta.url)
const githubUpdate = require('./githubUpdate.cjs') as {
  UPDATE_BUILDING_HINT: string
  isMissingUpdateArtifactError: (err: unknown) => boolean
  probeGithubUpdate: (
    currentVersion: string,
    platform: string,
    options?: { fetchImpl?: typeof fetch; canAutoInstall?: boolean },
  ) => Promise<{ status: string; info?: { downloadUrl?: string }; message?: string }>
  resolveDesktopUpdateCheck: (input: {
    current: string
    github: { status: string; info?: object; yamlReady?: boolean } | null
    updaterInfo: { version: string; releaseName?: string; releaseNotes?: string } | null
    updaterError: unknown
    canAutoInstall: boolean
  }) => {
    available: boolean
    building?: boolean
    current?: string
    message?: string
    version?: string
    canAutoInstall?: boolean
    downloadUrl?: string
  }
}

describe('electron githubUpdate', () => {
  it('keeps the pending German copy in sync with the web module', () => {
    expect(githubUpdate.UPDATE_BUILDING_HINT).toBe(UPDATE_BUILDING_HINT)
  })

  it('detects a missing latest.yml / 404 from electron-updater', () => {
    expect(
      githubUpdate.isMissingUpdateArtifactError(
        new Error(
          'Error: 404 Not Found: https://github.com/MatthiasUlrich1/Mathsachs/releases/download/v0.1.30/latest.yml',
        ),
      ),
    ).toBe(true)
    expect(githubUpdate.isMissingUpdateArtifactError(new Error('offline'))).toBe(
      false,
    )
  })

  it('maps updater 404 + newer GitHub tag without assets to building', () => {
    const result = githubUpdate.resolveDesktopUpdateCheck({
      current: '0.1.29',
      github: { status: 'building' },
      updaterInfo: null,
      updaterError: new Error('404 Not Found: latest.yml'),
      canAutoInstall: false,
    })
    expect(result).toEqual({
      available: false,
      building: true,
      current: '0.1.29',
      message: UPDATE_BUILDING_HINT,
    })
    expect(JSON.stringify(result)).not.toMatch(/404/)
    expect(result.message).not.toMatch(/latest\.yml/)
  })

  it('maps a ready GitHub release to an available update', () => {
    const result = githubUpdate.resolveDesktopUpdateCheck({
      current: '0.1.29',
      github: {
        status: 'update',
        yamlReady: true,
        info: {
          available: true,
          version: '0.1.30',
          title: 'v0.1.30',
          notes: '',
          htmlUrl: 'https://example.com/tag',
          downloadUrl: 'https://example.com/setup.exe',
          downloadLabel: 'Mathsachs-Setup-0.1.30.exe',
          canAutoInstall: true,
        },
      },
      updaterInfo: { version: '0.1.30' },
      updaterError: null,
      canAutoInstall: true,
    })
    expect(result).toMatchObject({
      available: true,
      version: '0.1.30',
      downloadUrl: 'https://example.com/setup.exe',
      canAutoInstall: true,
    })
  })

  it('does not enable auto-install when the YAML is still missing', () => {
    const result = githubUpdate.resolveDesktopUpdateCheck({
      current: '0.1.29',
      github: {
        status: 'update',
        yamlReady: false,
        info: {
          available: true,
          version: '0.1.30',
          title: 'v0.1.30',
          notes: '',
          htmlUrl: 'https://example.com/tag',
          downloadUrl: 'https://example.com/setup.exe',
          downloadLabel: 'Mathsachs-Setup-0.1.30.exe',
          canAutoInstall: false,
        },
      },
      updaterInfo: null,
      updaterError: new Error('404 Not Found: latest.yml'),
      canAutoInstall: true,
    })
    expect(result).toMatchObject({
      available: true,
      downloadUrl: 'https://example.com/setup.exe',
      canAutoInstall: false,
    })
  })

  it('probes a newer release without assets as building', async () => {
    const fetchImpl = async () =>
      new Response(
        JSON.stringify({
          tag_name: 'v0.1.30',
          name: 'v0.1.30',
          body: '',
          html_url: 'https://example.com/tag',
          prerelease: false,
          draft: false,
          assets: [],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    const probe = await githubUpdate.probeGithubUpdate('0.1.29', 'win32', {
      fetchImpl,
    })
    expect(probe).toMatchObject({
      status: 'building',
      message: UPDATE_BUILDING_HINT,
    })
  })

  it('stays on current when the latest tag is already installed', () => {
    const result = githubUpdate.resolveDesktopUpdateCheck({
      current: '0.1.29',
      github: { status: 'current' },
      updaterInfo: null,
      updaterError: new Error('404 Not Found: latest.yml'),
      canAutoInstall: false,
    })
    expect(result).toEqual({ available: false, current: '0.1.29' })
    expect(JSON.stringify(result)).not.toMatch(/404/)
  })
})
