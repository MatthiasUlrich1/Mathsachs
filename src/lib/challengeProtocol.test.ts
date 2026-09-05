import { afterEach, describe, expect, it, vi } from 'vitest'
import { berlinLocalToUtcMs } from '../challenge/time'
import {
  addUser,
  buildChallengeProtocol,
  initSharedStorage,
  loadUser,
  recordSession,
  rememberJoinedClassCode,
  resetSharedStorageForTests,
  setActiveStorageUser,
  setSendClassPoints,
} from './storage'

function memoryStorage(): Storage {
  const map = new Map<string, string>()
  return {
    get length() {
      return map.size
    },
    clear: () => map.clear(),
    getItem: (key: string) => map.get(key) ?? null,
    key: (index: number) => [...map.keys()][index] ?? null,
    removeItem: (key: string) => {
      map.delete(key)
    },
    setItem: (key: string, value: string) => {
      map.set(key, value)
    },
  }
}

function htmlResponse(): Response {
  return new Response('<!doctype html><title>Vite</title>', {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

const challenge = {
  name: 'Woche 36',
  topicIds: ['n5-add'],
  start: '2026-09-07T08:00',
  end: '2026-09-11T16:00',
  prize: { enabled: true, classPrize: true, classThreshold: 100, text: 'Film' },
}

const workerSummary = {
  name: 'Woche 36',
  start: '2026-09-07T08:00',
  end: '2026-09-11T16:00',
  topics: [{ id: 'n5-add', title: 'Addieren' }],
  prize: { enabled: true, classPrize: true, classThreshold: 80, text: 'Film' },
}

describe('buildChallengeProtocol', () => {
  afterEach(() => {
    resetSharedStorageForTests()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  const setup = async () => {
    const local = memoryStorage()
    vi.stubGlobal('localStorage', local)
    vi.stubGlobal('fetch', vi.fn(async () => htmlResponse()))
    await initSharedStorage()
    addUser('Lea', 'schueler')
    setActiveStorageUser('Lea')
    rememberJoinedClassCode('abcd-2345', 'Klasse 6a')
    setSendClassPoints(true)
  }

  it('records an in-window topic and shows rows, totals and transferred points', async () => {
    await setup()
    const inside = berlinLocalToUtcMs('2026-09-08T10:00')
    vi.setSystemTime(inside)
    recordSession('Lea', {
      topicId: 'n5-add',
      topicTitle: 'Addieren',
      areaTitle: 'Natürliche Zahlen',
      attempts: 10,
      correct: 8,
      points: 16,
    })
    expect(loadUser('Lea').sessions).toHaveLength(1)
    expect(loadUser('Lea').classTransfers?.[0]).toMatchObject({
      points: 16,
      topicId: 'n5-add',
    })

    const protocol = buildChallengeProtocol('Lea', challenge, inside)
    expect(protocol.rows).toHaveLength(1)
    expect(protocol.rows[0]).toMatchObject({
      topicTitle: 'Addieren',
      areaTitle: 'Natürliche Zahlen',
      attempts: 10,
      correct: 8,
      points: 16,
      percent: 80,
    })
    expect(protocol.totalPoints).toBe(16)
    expect(protocol.totalAttempts).toBe(10)
    expect(protocol.totalCorrect).toBe(8)
    expect(protocol.transferredPoints).toBe(16)
    expect(protocol.transfers.summary.total).toBe(16)
    expect(protocol.classThreshold).toBe(100)
  })

  it('does not increment challenge protocol for a topic outside the challenge', async () => {
    await setup()
    const inside = berlinLocalToUtcMs('2026-09-08T10:00')
    vi.setSystemTime(inside)
    recordSession('Lea', {
      topicId: 'n5-mul',
      topicTitle: 'Multiplizieren',
      areaTitle: 'Natürliche Zahlen',
      attempts: 5,
      correct: 5,
      points: 10,
    })

    const protocol = buildChallengeProtocol('Lea', challenge, inside)
    expect(protocol.rows).toEqual([])
    expect(protocol.totalPoints).toBe(0)
    expect(protocol.transferredPoints).toBe(0)
  })

  it('still finds sessions when the Worker summary has topics[] but no topicIds', async () => {
    await setup()
    const inside = berlinLocalToUtcMs('2026-09-08T10:00')
    vi.setSystemTime(inside)
    recordSession('Lea', {
      topicId: 'n5-add',
      topicTitle: 'Addieren',
      areaTitle: 'Natürliche Zahlen',
      attempts: 4,
      correct: 3,
      points: 6,
    })

    const protocol = buildChallengeProtocol('Lea', workerSummary, inside)
    expect(protocol.totalPoints).toBe(6)
    expect(protocol.rows[0]?.topicTitle).toBe('Addieren')
    expect(protocol.transferredPoints).toBe(6)
    expect(protocol.classThreshold).toBe(80)
  })

  it('omits Klassenziel when no threshold is set', async () => {
    await setup()
    const protocol = buildChallengeProtocol(
      'Lea',
      {
        name: 'Ohne Ziel',
        topicIds: ['n5-add'],
        start: '2026-09-07T08:00',
        end: '2026-09-11T16:00',
        prize: { enabled: false },
      },
      berlinLocalToUtcMs('2026-09-08T10:00'),
    )
    expect(protocol.classThreshold).toBeUndefined()
  })
})
