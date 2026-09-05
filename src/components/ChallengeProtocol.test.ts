import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { berlinLocalToUtcMs } from '../challenge/time'
import type { StoredChallenge } from '../challenge/types'
import {
  addUser,
  initSharedStorage,
  recordSession,
  rememberJoinedClassCode,
  resetSharedStorageForTests,
  setActiveStorageUser,
  setSendClassPoints,
} from '../lib/storage'
import { ChallengeProtocol } from './ChallengeProtocol'

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

const stored: StoredChallenge = {
  id: 'CHAL2345',
  scope: 'class',
  hostCode: 'ABCD2345',
  name: 'Woche 36',
  topicIds: ['n5-add'],
  topics: [{ id: 'n5-add', title: 'Addieren' }],
  start: '2026-09-07T08:00',
  end: '2026-09-11T16:00',
  prize: {
    enabled: true,
    classPrize: true,
    studentPrize: true,
    classThreshold: 100,
    text: 'Film schauen',
  },
  createdAt: 1,
}

describe('ChallengeProtocol', () => {
  afterEach(() => {
    resetSharedStorageForTests()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('shows practiced topics, transferred points and Klassenziel after a session', async () => {
    const local = memoryStorage()
    vi.stubGlobal('localStorage', local)
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline')
      }),
    )
    await initSharedStorage()
    addUser('Lea', 'schueler')
    setActiveStorageUser('Lea')
    rememberJoinedClassCode('abcd-2345', 'Klasse 6a')
    setSendClassPoints(true)
    vi.setSystemTime(berlinLocalToUtcMs('2026-09-08T10:00'))
    recordSession('Lea', {
      topicId: 'n5-add',
      topicTitle: 'Addieren',
      areaTitle: 'Natürliche Zahlen',
      attempts: 10,
      correct: 8,
      points: 16,
    })

    const html = renderToStaticMarkup(
      createElement(ChallengeProtocol, {
        user: 'Lea',
        challenge: stored,
        onExit: () => undefined,
      }),
    )
    expect(html).toContain('Addieren')
    expect(html).toContain('Natürliche Zahlen')
    expect(html).toContain('16')
    expect(html).toContain('8/10')
    expect(html).toContain('An die Klasse übertragen')
    expect(html).toContain('16 Punkte aus dieser Challenge')
    expect(html).toContain('Klasse 6a')
    expect(html).toContain('Challenge-Stand')
    expect(html).toContain('Meine Challenge-Punkte')
    expect(html).toContain('Klassenziel: 100 Punkte')
    expect(html).toContain('Film schauen')
    expect(html).toContain('Wer gewinnen kann')
    expect(html).not.toMatch(/Max|vorname|userId/i)
  })

  it('hides Klassenziel when the challenge has no threshold', async () => {
    const local = memoryStorage()
    vi.stubGlobal('localStorage', local)
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline')
      }),
    )
    await initSharedStorage()
    addUser('Lea', 'schueler')
    const html = renderToStaticMarkup(
      createElement(ChallengeProtocol, {
        user: 'Lea',
        challenge: {
          ...stored,
          prize: { enabled: true, studentPrize: true, text: 'Lob' },
        },
        onExit: () => undefined,
      }),
    )
    expect(html).toContain('Lob')
    expect(html).not.toContain('Klassenziel:')
  })
})
