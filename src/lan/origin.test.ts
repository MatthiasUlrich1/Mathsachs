import { describe, expect, it } from 'vitest'
import { primaryLanOrigin } from './useLanStatus'
import type { LanServerStatus } from '../updates/types'

const base: LanServerStatus = {
  running: true,
  port: 4747,
  urls: ['http://127.0.0.1:4747/', 'http://192.168.1.9:4747/'],
  lanUrls: ['http://192.168.1.9:4747/'],
  error: null,
}

describe('primaryLanOrigin', () => {
  it('returns the first WLAN URL for Klausur links', () => {
    expect(primaryLanOrigin(base)).toBe('http://192.168.1.9:4747/')
  })

  it('returns undefined without a LAN address (no file:// or loopback share)', () => {
    expect(
      primaryLanOrigin({ ...base, lanUrls: [] }),
    ).toBeUndefined()
    expect(primaryLanOrigin({ ...base, running: false })).toBeUndefined()
    expect(primaryLanOrigin(null)).toBeUndefined()
  })
})
