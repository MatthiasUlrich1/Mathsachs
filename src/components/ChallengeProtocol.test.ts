import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { berlinLocalToUtcMs } from '../challenge/time'
import type { StoredChallenge } from '../challenge/types'
import type { ChallengeSummary } from '../classCode/api'
import {
  addUser,
  initSharedStorage,
  recordSession,
  rememberCreatedChallenge,
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

  it('shows practiced topics and Klassenziel after a session, without class transfers', async () => {
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
    expect(html).not.toContain('An die Klasse übertragen')
    expect(html).not.toContain('aus dieser Challenge')
    expect(html).toContain('Punkte im Challenge-Zeitraum — Woche 36')
    expect(html).toContain('Challenge-Stand — Woche 36')
    expect(html).toContain('Meine Challenge-Punkte')
    expect(html).toContain('Klassenziel: 100 Punkte')
    expect(html).toContain('challenge-class-goal--sheet')
    expect(html).toContain('challenge-class-goal__label')
    expect(html).toContain('Film schauen')
    expect(html).toContain('Wer gewinnen kann')
    expect(html).not.toMatch(/Max|vorname|userId/i)
  })

  it('renders Klassenziel remaining with high-contrast sheet classes', async () => {
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
    const live: ChallengeSummary = {
      id: stored.id,
      name: stored.name,
      scope: stored.scope,
      start: stored.start,
      end: stored.end,
      topicIds: stored.topicIds,
      topics: stored.topics,
      prize: stored.prize,
      className: '6/6',
      points: { today: 30, week: 30, month: 30, year: 30, total: 30 },
    }
    const html = renderToStaticMarkup(
      createElement(ChallengeProtocol, {
        user: 'Lea',
        challenge: live,
        onExit: () => undefined,
      }),
    )
    expect(html).toContain('Klassenziel: 100 Punkte')
    expect(html).toContain('noch 70 Punkte')
    expect(html).toContain('challenge-class-goal--sheet')
    expect(html).toContain('challenge-class-goal__label')
    expect(html).toContain('challenge-class-goal__remaining')
    expect(html).toContain('Klasse 6/6')
    expect(html).toContain('30')
    expect(html).not.toContain('An die Klasse übertragen')
  })

  it('keeps high-contrast Klassenziel colors on the white protocol sheet', () => {
    const css = readFileSync(
      resolve(dirname(fileURLToPath(import.meta.url)), '../App.css'),
      'utf8',
    )
    expect(css).toContain('.sheet .challenge-class-goal__label')
    expect(css).toContain('.sheet .challenge-class-goal__remaining')
    expect(css).toContain('color: #0f3d4c')
    expect(css).toContain('background: #a5f3fc')
    expect(css).toContain('color: #1e3a5f')
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

  it('names the current challenge on the period block when several exist', async () => {
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
    rememberCreatedChallenge({
      ...stored,
      id: 'CHAL-OLD',
      name: 'Alter Test',
      start: '2026-08-31T08:00',
      end: '2026-09-04T16:00',
    })
    rememberCreatedChallenge(stored)
    const html = renderToStaticMarkup(
      createElement(ChallengeProtocol, {
        user: 'Lea',
        challenge: { ...stored, name: 'Testchallenge' },
        onExit: () => undefined,
      }),
    )
    expect(html).toContain('Punkte im Challenge-Zeitraum — Testchallenge')
    expect(html).toContain('Challenge-Stand — Testchallenge')
    expect(html).not.toContain('An die Klasse übertragen')
    expect(html).not.toContain('Punkte im Challenge-Zeitraum — Alter Test')
  })
})
