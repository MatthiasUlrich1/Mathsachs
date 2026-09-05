import { afterEach, describe, expect, it } from 'vitest'
import {
  berlinDayKey,
  isoWeekKey,
  schoolYearStartYear,
  summarizeDays,
} from '../src/classCode/buckets'
import worker, {
  MAX_POINTS_DELTA,
  RATE_LIMITS,
  berlinDayKey as workerBerlinDayKey,
  isoWeekKey as workerIsoWeekKey,
  resetRateLimitsForTests,
  schoolYearStartYear as workerSchoolYearStartYear,
  summarizeDays as workerSummarizeDays,
} from './worker.js'

class MemoryKV {
  private readonly map = new Map<string, string>()
  async get(key: string): Promise<string | null> {
    return this.map.get(key) ?? null
  }
  async put(key: string, value: string): Promise<void> {
    this.map.set(key, value)
  }
  async delete(key: string): Promise<void> {
    this.map.delete(key)
  }
}

const env = () => ({ CLASSES: new MemoryKV() })

const request = (path: string, init?: RequestInit) =>
  new Request(`https://mathsachs-punkte.example${path}`, init)

afterEach(() => {
  resetRateLimitsForTests()
})

const BEFORE_ROLLOVER = Date.UTC(2026, 6, 31, 21, 59, 0)
const AFTER_ROLLOVER = Date.UTC(2026, 6, 31, 22, 0, 0)

describe('worker copy stays in lockstep with src/classCode/buckets.ts', () => {
  it('matches Berlin day, ISO week and school-year start', () => {
    expect(workerBerlinDayKey(BEFORE_ROLLOVER)).toBe(berlinDayKey(BEFORE_ROLLOVER))
    expect(workerBerlinDayKey(AFTER_ROLLOVER)).toBe(berlinDayKey(AFTER_ROLLOVER))
    expect(workerIsoWeekKey('2025-12-29')).toBe(isoWeekKey('2025-12-29'))
    expect(workerSchoolYearStartYear('2026-07-31')).toBe(schoolYearStartYear('2026-07-31'))
    expect(workerSchoolYearStartYear('2026-08-01')).toBe(schoolYearStartYear('2026-08-01'))
  })

  it('matches summarizeDays fixtures', () => {
    const now = Date.UTC(2026, 8, 4, 10, 0, 0)
    const days = { '2026-09-04': 5, '2026-07-31': 11, '2026-08-20': 7 }
    expect(workerSummarizeDays(days, now)).toEqual(summarizeDays(days, now))
  })
})

describe('Cloudflare Worker API', () => {
  it('serves a compatible health document', async () => {
    const res = await worker.fetch(request('/'), env())
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({
      ok: true,
      service: 'mathsachs-punkte',
      hasClasses: true,
    })
  })

  it('creates a class, reads breakdowns and accepts a bounded delta', async () => {
    const kv = env()
    const created = await worker.fetch(
      request('/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Klasse 6a' }),
      }),
      kv,
    )
    expect(created.status).toBe(201)
    const body = (await created.json()) as {
      code: string
      name: string
      points: { total: number }
    }
    expect(body.name).toBe('Klasse 6a')
    expect(body.code).toMatch(/^[0-9A-HJKMNP-TV-Z]{8}$/)
    expect(body.points.total).toBe(0)

    const got = await worker.fetch(request(`/classes/${body.code.toLowerCase()}`), kv)
    expect(got.status).toBe(200)
    const stats = (await got.json()) as { name: string; period: { schoolYear: string } }
    expect(stats.name).toBe('Klasse 6a')
    expect(stats.period.schoolYear).toMatch(/^\d{4}\/\d{2}$/)

    const posted = await worker.fetch(
      request(`/classes/${body.code}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: 7 }),
      }),
      kv,
    )
    expect(posted.status).toBe(200)
    const after = (await posted.json()) as { points: { today: number; total: number } }
    expect(after.points.today).toBe(7)
    expect(after.points.total).toBe(7)
  })

  it('rejects huge deltas and unknown codes', async () => {
    const kv = env()
    const created = await worker.fetch(
      request('/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '6a' }),
      }),
      kv,
    )
    const { code } = (await created.json()) as { code: string }

    const huge = await worker.fetch(
      request(`/classes/${code}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: MAX_POINTS_DELTA + 1 }),
      }),
      kv,
    )
    expect(huge.status).toBe(400)

    const missing = await worker.fetch(request('/classes/ZZZZZZZZ'), kv)
    expect(missing.status).toBe(404)

    const removed = await worker.fetch(request(`/classes/${code}`, { method: 'DELETE' }), kv)
    expect(removed.status).toBe(200)
    const gone = await worker.fetch(request(`/classes/${code}`), kv)
    expect(gone.status).toBe(404)
  })

  it('answers CORS preflight and echoes allowed methods', async () => {
    const res = await worker.fetch(
      request('/classes', {
        method: 'OPTIONS',
        headers: {
          Origin: 'https://matthiasulrich1.github.io',
          'Access-Control-Request-Method': 'POST',
        },
      }),
      env(),
    )
    expect(res.status).toBe(204)
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(
      'https://matthiasulrich1.github.io',
    )
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('POST')
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('DELETE')
  })

  it('uses * for file:// / null Origin so Electron can call the API', async () => {
    const fromFile = await worker.fetch(
      request('/', { headers: { Origin: 'null' } }),
      env(),
    )
    expect(fromFile.headers.get('Access-Control-Allow-Origin')).toBe('*')
  })

  it('allows classroom-sized GET/DELETE bursts and keeps POST points tighter', async () => {
    expect(RATE_LIMITS).toEqual({
      create: { limit: 8, windowMs: 60_000 },
      delete: { limit: 30, windowMs: 60_000 },
      get: { limit: 300, windowMs: 60_000 },
      points: { limit: 60, windowMs: 60_000 },
    })

    const kv = env()
    const created = await worker.fetch(
      request('/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.8' },
        body: JSON.stringify({ name: '6a' }),
      }),
      kv,
    )
    const { code } = (await created.json()) as { code: string }
    const ip = { 'CF-Connecting-IP': '203.0.113.9' }

    for (let i = 0; i < RATE_LIMITS.get.limit; i++) {
      const res = await worker.fetch(request(`/classes/${code}`, { headers: ip }), kv)
      expect(res.status).toBe(200)
    }
    const getBlocked = await worker.fetch(request(`/classes/${code}`, { headers: ip }), kv)
    expect(getBlocked.status).toBe(429)

    const other = { 'CF-Connecting-IP': '203.0.113.10' }
    for (let i = 0; i < RATE_LIMITS.delete.limit; i++) {
      const res = await worker.fetch(
        request(`/classes/${code}`, { method: 'DELETE', headers: other }),
        kv,
      )
      expect([200, 404]).toContain(res.status)
    }
    const deleteBlocked = await worker.fetch(
      request(`/classes/${code}`, { method: 'DELETE', headers: other }),
      kv,
    )
    expect(deleteBlocked.status).toBe(429)
  })
})
