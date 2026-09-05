import { afterEach, describe, expect, it } from 'vitest'
import {
  berlinDayKey,
  isoWeekKey,
  schoolYearStartYear,
  summarizeDays,
} from '../src/classCode/buckets'
import { publicIdFromCode } from '../src/classCode/publicId'
import worker, {
  MAX_POINTS_DELTA,
  RATE_LIMITS,
  berlinDayKey as workerBerlinDayKey,
  isoWeekKey as workerIsoWeekKey,
  publicIdFromCode as workerPublicIdFromCode,
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
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('PUT')
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
      gradeCreate: { limit: 8, windowMs: 60_000 },
      gradeUpdate: { limit: 30, windowMs: 60_000 },
      challengeCreate: { limit: 8, windowMs: 60_000 },
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

const postJson = (path: string, body: unknown, kv: ReturnType<typeof env>) =>
  worker.fetch(
    request(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    kv,
  )

const putJson = (path: string, body: unknown, kv: ReturnType<typeof env>) =>
  worker.fetch(
    request(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    kv,
  )

type GradeView = {
  id?: string
  name: string
  classes: Array<{ id: string; name: string; points: { total: number; year: number } }>
  points: { total: number; today: number }
  period?: { schoolYear: string }
  code?: string
}

const PERSONAL_KEY_RE = /email|userid|user_id|schueler|vorname|nachname|pupil|studentid/i

function assertPrivacySchema(value: unknown, secretCodes: string[]) {
  const walk = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }
    if (!node || typeof node !== 'object') return
    for (const [key, child] of Object.entries(node)) {
      expect(PERSONAL_KEY_RE.test(key)).toBe(false)
      if (key === 'code' && typeof child === 'string') {
        expect(secretCodes).not.toContain(child)
      }
      if (key === 'classes' && Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item === 'object') {
            expect(item).not.toHaveProperty('code')
            expect(item).not.toHaveProperty('gradeId')
          }
        }
      }
      walk(child)
    }
  }
  walk(value)
  const text = JSON.stringify(value)
  expect(text).not.toMatch(/@/)
  for (const code of secretCodes) {
    expect(text).not.toContain(code)
  }
}

describe('Klassenstufencode Worker API', () => {
  it('keeps publicIdFromCode in lockstep with the app', () => {
    expect(workerPublicIdFromCode('AAAA1111')).toBe(publicIdFromCode('AAAA1111'))
    expect(workerPublicIdFromCode('AAAA1111')).toMatch(/^n[0-9a-f]{8}$/)
    expect(workerPublicIdFromCode('AAAA1111')).not.toBe('AAAA1111')
  })

  it('creates a grade, assigns classes, embeds a summary and hides member codes', async () => {
    const kv = env()
    const a = await postJson('/classes', { name: 'Klasse 6a' }, kv)
    const b = await postJson('/classes', { name: 'Klasse 6b' }, kv)
    const classA = (await a.json()) as { code: string }
    const classB = (await b.json()) as { code: string }

    await worker.fetch(
      request(`/classes/${classA.code}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: 5 }),
      }),
      kv,
    )

    const created = await postJson('/grades', { name: '6. Klasse' }, kv)
    expect(created.status).toBe(201)
    const grade = (await created.json()) as GradeView & { code: string }
    expect(grade.name).toBe('6. Klasse')
    expect(grade.code).toMatch(/^[0-9A-HJKMNP-TV-Z]{8}$/)
    expect(grade.classes).toEqual([])

    const assigned = await putJson(
      `/grades/${grade.code}/classes`,
      { add: [classA.code, classB.code] },
      kv,
    )
    expect(assigned.status).toBe(200)
    const view = (await assigned.json()) as GradeView
    expect(view.classes.map((row) => row.name).sort()).toEqual(['Klasse 6a', 'Klasse 6b'])
    expect(view.points.today).toBe(5)
    expect(view.points.total).toBe(5)
    assertPrivacySchema(view, [classA.code, classB.code])
    expect(JSON.stringify(view)).not.toContain(grade.code)

    const gotGrade = await worker.fetch(request(`/grades/${grade.code}`), kv)
    expect(gotGrade.status).toBe(200)
    const publicGrade = (await gotGrade.json()) as GradeView
    expect(publicGrade).not.toHaveProperty('code')
    assertPrivacySchema(publicGrade, [classA.code, classB.code, grade.code])

    const gotClass = await worker.fetch(request(`/classes/${classA.code}`), kv)
    const classBody = (await gotClass.json()) as {
      code: string
      name: string
      grade?: GradeView
      gradeId?: string
    }
    expect(classBody.code).toBe(classA.code)
    expect(classBody.gradeId).toBeUndefined()
    expect(classBody.grade?.name).toBe('6. Klasse')
    expect(classBody.grade?.classes).toHaveLength(2)
    assertPrivacySchema(classBody.grade, [classB.code, grade.code])
    expect(classBody.grade?.classes.every((row) => row.id !== classB.code)).toBe(true)
  })

  it('rejects posting points onto a Stufencode and GET /classes for a grade key', async () => {
    const kv = env()
    const created = await postJson('/grades', { name: '7. Klasse' }, kv)
    const { code } = (await created.json()) as { code: string }

    const points = await worker.fetch(
      request(`/classes/${code}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: 4 }),
      }),
      kv,
    )
    expect(points.status).toBe(400)
    const pointsBody = (await points.json()) as { code: string; error: string }
    expect(pointsBody.code).toBe('NOT_CLASS')
    expect(pointsBody.error).toMatch(/stufencode/i)

    const asClass = await worker.fetch(request(`/classes/${code}`), kv)
    expect(asClass.status).toBe(400)
    const asClassBody = (await asClass.json()) as { code: string }
    expect(asClassBody.code).toBe('NOT_CLASS')

    const missingPoints = await worker.fetch(
      request(`/grades/${code}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: 4 }),
      }),
      kv,
    )
    expect(missingPoints.status).toBe(404)
  })

  it('rejects assigning an unknown or grade code and deletes a Stufe without dropping class points', async () => {
    const kv = env()
    const createdClass = await postJson('/classes', { name: '8a' }, kv)
    const { code: classCode } = (await createdClass.json()) as { code: string }
    await worker.fetch(
      request(`/classes/${classCode}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: 9 }),
      }),
      kv,
    )
    const createdGrade = await postJson('/grades', { name: '8. Klasse' }, kv)
    const { code: gradeCode } = (await createdGrade.json()) as { code: string }
    const otherGrade = await postJson('/grades', { name: '9. Klasse' }, kv)
    const { code: otherCode } = (await otherGrade.json()) as { code: string }

    const bad = await putJson(`/grades/${gradeCode}/classes`, { add: ['ZZZZZZZZ'] }, kv)
    expect(bad.status).toBe(400)

    const asGrade = await putJson(`/grades/${gradeCode}/classes`, { add: [otherCode] }, kv)
    expect(asGrade.status).toBe(400)

    const ok = await putJson(`/grades/${gradeCode}/classes`, { add: [classCode] }, kv)
    expect(ok.status).toBe(200)

    const removed = await worker.fetch(request(`/grades/${gradeCode}`, { method: 'DELETE' }), kv)
    expect(removed.status).toBe(200)
    const gone = await worker.fetch(request(`/grades/${gradeCode}`), kv)
    expect(gone.status).toBe(404)

    const stillClass = await worker.fetch(request(`/classes/${classCode}`), kv)
    const body = (await stillClass.json()) as { points: { total: number }; grade?: unknown }
    expect(body.points.total).toBe(9)
    expect(body.grade).toBeUndefined()
  })
})

describe('Challenge Worker API', () => {
  const windowNow = { start: '2020-01-01T00:00', end: '2035-12-31T23:59' }
  const windowPast = { start: '2020-01-01T00:00', end: '2020-01-02T00:00' }

  it('creates a class challenge and attributes only matching in-window topics', async () => {
    const kv = env()
    const created = await postJson('/classes', { name: 'Klasse 6a' }, kv)
    const { code } = (await created.json()) as { code: string }

    const challengeRes = await postJson(
      '/challenges',
      {
        scope: 'class',
        classCode: code,
        name: 'Woche 36',
        topicIds: ['n5-add'],
        topics: [{ id: 'n5-add', title: 'Addieren' }],
        ...windowNow,
        prize: { enabled: true, classPrize: true, classThreshold: 10, text: 'Film' },
      },
      kv,
    )
    expect(challengeRes.status).toBe(201)
    const challenge = (await challengeRes.json()) as {
      id: string
      name: string
      topicIds?: string[]
      points: { total: number }
      prize: { text?: string }
    }
    expect(challenge.name).toBe('Woche 36')
    expect(challenge.topicIds).toEqual(['n5-add'])
    expect(challenge.points.total).toBe(0)
    expect(JSON.stringify(challenge)).not.toMatch(/vorname|userId|deviceId|schueler/i)

    const otherTopic = await worker.fetch(
      request(`/classes/${code}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: 7, topicId: 'n5-mul' }),
      }),
      kv,
    )
    expect(otherTopic.status).toBe(200)
    const afterOther = (await otherTopic.json()) as {
      points: { total: number }
      challenge?: { points: { total: number } }
    }
    expect(afterOther.points.total).toBe(7)
    expect(afterOther.challenge?.points.total ?? 0).toBe(0)

    const matching = await worker.fetch(
      request(`/classes/${code}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: 5, topicId: 'n5-add' }),
      }),
      kv,
    )
    const afterMatch = (await matching.json()) as {
      points: { total: number }
      challenge: {
        points: { total: number }
        classThreshold: number
        prize: { text?: string }
      }
    }
    expect(afterMatch.points.total).toBe(12)
    expect(afterMatch.challenge.points.total).toBe(5)
    expect(afterMatch.challenge.prize.text).toBe('Film')
    expect(afterMatch.challenge.classThreshold).toBe(10)
    assertPrivacySchema(afterMatch.challenge, [])

    const got = await worker.fetch(request(`/challenges/${challenge.id}`), kv)
    expect(got.status).toBe(200)
    const publicCh = (await got.json()) as { points: { total: number }; code?: string }
    expect(publicCh.points.total).toBe(5)
    expect(publicCh).not.toHaveProperty('code')
    expect(JSON.stringify(publicCh)).not.toContain(code)
  })

  it('does not add challenge points outside the window', async () => {
    const kv = env()
    const created = await postJson('/classes', { name: '6b' }, kv)
    const { code } = (await created.json()) as { code: string }
    await postJson(
      '/challenges',
      {
        scope: 'class',
        classCode: code,
        name: 'Vorbei',
        topicIds: ['n5-add'],
        ...windowPast,
        prize: { enabled: false },
      },
      kv,
    )
    const posted = await worker.fetch(
      request(`/classes/${code}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: 4, topicId: 'n5-add' }),
      }),
      kv,
    )
    const body = (await posted.json()) as { challenge?: unknown; challenges?: unknown[] }
    expect(body.challenge).toBeUndefined()
    expect(body.challenges ?? []).toEqual([])
  })

  it('embeds upcoming class challenges on GET, not only the live window', async () => {
    const kv = env()
    const created = await postJson('/classes', { name: 'Klasse 6c' }, kv)
    const { code } = (await created.json()) as { code: string }
    const upcoming = await postJson(
      '/challenges',
      {
        scope: 'class',
        classCode: code,
        name: 'Nächste Woche',
        topicIds: ['n5-add'],
        start: '2035-09-08T08:00',
        end: '2035-09-12T16:00',
        prize: {
          enabled: true,
          classPrize: true,
          classThreshold: 100,
          text: 'Film',
        },
      },
      kv,
    )
    expect(upcoming.status).toBe(201)

    const got = await worker.fetch(request(`/classes/${code}`), kv)
    const body = (await got.json()) as {
      challenge?: { name: string }
      challenges: Array<{
        name: string
        active?: boolean
        prize: { classPrize?: boolean; classThreshold?: number; text?: string }
        classThreshold?: number
      }>
    }
    expect(body.challenge).toBeUndefined()
    expect(body.challenges).toHaveLength(1)
    expect(body.challenges[0].name).toBe('Nächste Woche')
    expect(body.challenges[0].active).toBe(false)
    expect(body.challenges[0].prize.text).toBe('Film')
    expect(body.challenges[0].prize.classPrize).toBe(true)
    expect(body.challenges[0].classThreshold).toBe(100)
    expect(JSON.stringify(body.challenges[0])).not.toMatch(/vorname|userId|deviceId|schuelername/i)
  })

  it('embeds anonymous grade-challenge standings and never member codes', async () => {
    const kv = env()
    const a = await postJson('/classes', { name: 'Klasse 6a' }, kv)
    const b = await postJson('/classes', { name: 'Klasse 6b' }, kv)
    const classA = (await a.json()) as { code: string }
    const classB = (await b.json()) as { code: string }
    const gradeRes = await postJson('/grades', { name: '6. Klasse' }, kv)
    const grade = (await gradeRes.json()) as { code: string }
    await putJson(`/grades/${grade.code}/classes`, { add: [classA.code, classB.code] }, kv)

    const created = await postJson(
      '/challenges',
      {
        scope: 'grade',
        gradeCode: grade.code,
        name: 'Stufenwoche',
        topicIds: ['n5-add'],
        ...windowNow,
        prize: { enabled: true, classPrize: true, text: 'Ausflug' },
      },
      kv,
    )
    expect(created.status).toBe(201)

    await worker.fetch(
      request(`/classes/${classA.code}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: 6, topicId: 'n5-add' }),
      }),
      kv,
    )

    const gotGrade = await worker.fetch(request(`/grades/${grade.code}`), kv)
    const view = (await gotGrade.json()) as {
      challenge: {
        classes: Array<{ id: string; name: string; points: { total: number } }>
        points: { total: number }
      }
    }
    expect(view.challenge.points.total).toBe(6)
    expect(view.challenge.classes.map((row) => row.name).sort()).toEqual([
      'Klasse 6a',
      'Klasse 6b',
    ])
    assertPrivacySchema(view.challenge, [classA.code, classB.code, grade.code])
  })
})
