import { describe, expect, it } from 'vitest'
import { buildExportPayload, parseUserExport, USER_EXPORT_VERSION } from './userExport'
import type { UserData } from './sharedState'

const sampleUser: UserData = {
  name: 'Max',
  created: 1000,
  stats: {},
  sessions: [],
  classTransfers: [],
}

describe('buildExportPayload', () => {
  it('wraps user data with the version and timestamp', () => {
    const payload = buildExportPayload(sampleUser)
    expect(payload.mathsachs_export_version).toBe(USER_EXPORT_VERSION)
    expect(payload.user.name).toBe('Max')
    expect(typeof payload.exportedAt).toBe('number')
  })

  it('deep-clones the user data (no shared references)', () => {
    const payload = buildExportPayload(sampleUser)
    payload.user.name = 'Changed'
    expect(sampleUser.name).toBe('Max')
  })
})

describe('parseUserExport', () => {
  it('parses a valid export', () => {
    const json = JSON.stringify(buildExportPayload(sampleUser))
    const result = parseUserExport(json)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.user.name).toBe('Max')
  })

  it('rejects invalid JSON', () => {
    const result = parseUserExport('{broken}')
    expect(result.ok).toBe(false)
  })

  it('rejects a file without mathsachs_export_version', () => {
    const result = parseUserExport(JSON.stringify({ user: sampleUser }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toContain('TaskTrophy-Exportdatei')
  })

  it('rejects an unknown version', () => {
    const result = parseUserExport(
      JSON.stringify({ mathsachs_export_version: 999, user: sampleUser }),
    )
    expect(result.ok).toBe(false)
  })

  it('rejects a payload with no user object', () => {
    const result = parseUserExport(
      JSON.stringify({ mathsachs_export_version: USER_EXPORT_VERSION }),
    )
    expect(result.ok).toBe(false)
  })

  it('rejects a user without a name', () => {
    const result = parseUserExport(
      JSON.stringify({
        mathsachs_export_version: USER_EXPORT_VERSION,
        user: { ...sampleUser, name: '' },
      }),
    )
    expect(result.ok).toBe(false)
  })
})
