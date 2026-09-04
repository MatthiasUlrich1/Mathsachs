import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  CLASS_POINTS_API,
  ClassApiError,
  CLASS_API_NOT_READY_MESSAGE,
  CLASS_API_NETWORK_MESSAGE,
  CLASS_API_STUB_MESSAGE,
  addClassPoints,
  checkClassApiHealth,
  classApiUrl,
  classPointsUrl,
  classResourceUrl,
  createClass,
  deleteClass,
  getClass,
} from './api'

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('class API URL building', () => {
  it('uses the hardcoded Worker host by default', () => {
    expect(CLASS_POINTS_API).toBe(
      'https://mathsachs-punkte.broad-heart-ad82.workers.dev',
    )
    expect(classApiUrl('/')).toBe(`${CLASS_POINTS_API}/`)
    expect(classApiUrl('/classes')).toBe(`${CLASS_POINTS_API}/classes`)
  })

  it('strips trailing slashes and normalizes the code in the path', () => {
    expect(classApiUrl('classes', 'https://example.test/')).toBe(
      'https://example.test/classes',
    )
    expect(classResourceUrl(' abcd-2345 ', 'https://example.test')).toBe(
      'https://example.test/classes/ABCD2345',
    )
    expect(classPointsUrl('iloUabcd', 'https://example.test')).toBe(
      'https://example.test/classes/110ABCD/points',
    )
  })
})

describe('class API client', () => {
  it('creates, reads and posts a delta against the override base', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const method = (init?.method ?? 'GET').toUpperCase()
      if (url.endsWith('/') && method === 'GET') {
        return jsonResponse({ ok: true, service: 'mathsachs-punkte', hasClasses: true })
      }
      if (url.endsWith('/classes') && method === 'POST') {
        return jsonResponse(
          {
            code: 'ABCD2345',
            name: 'Klasse 6a',
            points: { today: 0, week: 0, month: 0, year: 0, total: 0 },
          },
          201,
        )
      }
      if (url.endsWith('/classes/ABCD2345') && method === 'GET') {
        return jsonResponse({
          code: 'ABCD2345',
          name: 'Klasse 6a',
          points: { today: 4, week: 4, month: 4, year: 4, total: 4 },
        })
      }
      if (url.endsWith('/classes/ABCD2345/points') && method === 'POST') {
        const body = JSON.parse(String(init?.body)) as { delta: number }
        expect(body.delta).toBe(4)
        return jsonResponse({
          code: 'ABCD2345',
          name: 'Klasse 6a',
          points: { today: 4, week: 4, month: 4, year: 4, total: 4 },
        })
      }
      if (url.endsWith('/classes/ABCD2345') && method === 'DELETE') {
        return jsonResponse({ ok: true, deleted: 'ABCD2345' })
      }
      return jsonResponse({ error: 'nope' }, 404)
    })
    vi.stubGlobal('fetch', fetchMock)

    const base = 'https://example.test'
    await expect(checkClassApiHealth(base)).resolves.toEqual({
      ok: true,
      service: 'mathsachs-punkte',
      hasClasses: true,
    })
    await expect(createClass('Klasse 6a', base)).resolves.toMatchObject({
      code: 'ABCD2345',
      name: 'Klasse 6a',
    })
    await expect(getClass('abcd-2345', base)).resolves.toMatchObject({
      points: { today: 4 },
    })
    await expect(addClassPoints('abcd-2345', 4, base)).resolves.toMatchObject({
      points: { total: 4 },
    })
    await expect(deleteClass('abcd-2345', base)).resolves.toBeUndefined()
  })

  it('detects the Hello-World stub that ignores POST /classes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        jsonResponse({ ok: true, service: 'mathsachs-punkte', hasClasses: true }),
      ),
    )
    await expect(createClass('Klasse 6a', 'https://example.test')).rejects.toMatchObject({
      kind: 'not_ready',
      message: CLASS_API_STUB_MESSAGE,
    })
  })

  it('maps a Cloudflare 1042 stub to the German not-ready error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('error code: 1042', { status: 404 })),
    )
    await expect(checkClassApiHealth('https://example.test')).rejects.toMatchObject({
      kind: 'not_ready',
      message: CLASS_API_NOT_READY_MESSAGE,
    })
  })

  it('maps a failed fetch to the German network / not-ready hint', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }),
    )
    await expect(checkClassApiHealth('https://example.test')).rejects.toMatchObject({
      kind: 'network',
      message: CLASS_API_NETWORK_MESSAGE,
    })
  })

  it('maps JSON 404 to an unknown-code error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        jsonResponse({ error: 'Diesen Klassencode gibt es nicht.', code: 'NOT_FOUND' }, 404),
      ),
    )
    await expect(getClass('ABCD2345', 'https://example.test')).rejects.toBeInstanceOf(
      ClassApiError,
    )
    await expect(getClass('ABCD2345', 'https://example.test')).rejects.toMatchObject({
      kind: 'not_found',
    })
  })

  it('chunks deltas larger than 100', async () => {
    const deltas: number[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
        const body = JSON.parse(String(init?.body)) as { delta: number }
        deltas.push(body.delta)
        return jsonResponse({
          code: 'ABCD2345',
          name: '6a',
          points: { today: body.delta, week: 0, month: 0, year: 0, total: body.delta },
        })
      }),
    )
    await addClassPoints('ABCD2345', 150, 'https://example.test')
    expect(deltas).toEqual([100, 50])
  })
})
