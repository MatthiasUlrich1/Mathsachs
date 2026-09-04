import { describe, expect, it } from 'vitest'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  collectLocalStorageSnapshot,
  emptySharedState,
  looksLikeSharedState,
  mergeSharedState,
  USERS_STORAGE_KEY,
  userRecordKey,
} from './sharedState'

const require = createRequire(import.meta.url)
const store = require('../../electron/sharedStore.cjs') as {
  emptyState: () => {
    schemaVersion: number
    migratedLocalStorage: boolean
    users: string[]
    records: Record<string, unknown>
  }
  mergeSharedState: (base: unknown, incoming: unknown) => {
    users: string[]
    records: Record<
      string,
      {
        name: string
        created: number
        stats: Record<
          string,
          {
            topicId: string
            points: number
            attempts: number
            lastPracticed: number
            topicTitle: string
            areaTitle: string
            correct: number
          }
        >
        sessions: Array<{ date: number; topicId: string; points: number }>
      }
    >
    migratedLocalStorage: boolean
  }
  snapshotToState: (snapshot: Record<string, string>) => {
    users: string[]
    records: Record<string, { name: string }>
  }
  createFileStore: (filePath: string) => {
    read: () => { users: string[]; records: Record<string, unknown>; migratedLocalStorage: boolean }
    write: (state: unknown) => unknown
    mergeWrite: (incoming: unknown) => {
      users: string[]
      records: Record<string, { stats: Record<string, { points: number }> }>
    }
    migrateFromSnapshot: (snapshot: Record<string, string>) => {
      users: string[]
      migratedLocalStorage: boolean
    }
  }
}

const { mergeSharedState: mergeSharedStateCjs, snapshotToState, createFileStore } = store

const user = (
  name: string,
  extra: {
    created?: number
    stats?: Record<string, { topicId: string; points: number; lastPracticed: number; attempts?: number }>
    sessions?: Array<{ date: number; topicId: string; points: number }>
  } = {},
) => ({
  name,
  created: extra.created ?? 1000,
  stats: Object.fromEntries(
    Object.entries(extra.stats ?? {}).map(([id, s]) => [
      id,
      {
        topicId: s.topicId,
        topicTitle: id,
        areaTitle: 'Test',
        attempts: s.attempts ?? 1,
        correct: 1,
        points: s.points,
        lastPracticed: s.lastPracticed,
      },
    ]),
  ),
  sessions: (extra.sessions ?? []).map((s) => ({
    date: s.date,
    topicId: s.topicId,
    topicTitle: s.topicId,
    areaTitle: 'Test',
    attempts: 1,
    correct: 1,
    points: s.points,
  })),
})

describe('looksLikeSharedState', () => {
  it('accepts a users/records payload and rejects HTML-shaped bodies', () => {
    expect(looksLikeSharedState({ users: [], records: {} })).toBe(true)
    expect(looksLikeSharedState(emptySharedState())).toBe(true)
    expect(looksLikeSharedState({ html: true })).toBe(false)
    expect(looksLikeSharedState('<!doctype html>')).toBe(false)
  })
})

describe('collectLocalStorageSnapshot', () => {
  it('keeps only mathsachs user keys', () => {
    const map = new Map<string, string>([
      [USERS_STORAGE_KEY, '["Ada"]'],
      [userRecordKey('Ada'), '{"name":"Ada"}'],
      ['mathsachs.activeUser.v1', 'Ada'],
      ['mathsachs.curricula.loaded.v1', '["math6"]'],
    ])
    const storage = {
      get length() {
        return map.size
      },
      key: (i: number) => [...map.keys()][i] ?? null,
      getItem: (key: string) => map.get(key) ?? null,
    }
    expect(collectLocalStorageSnapshot(storage)).toEqual({
      [USERS_STORAGE_KEY]: '["Ada"]',
      [userRecordKey('Ada')]: '{"name":"Ada"}',
    })
  })
})

describe('mergeSharedState (TypeScript)', () => {
  it('matches the CJS union of users and per-topic scores', () => {
    const merged = mergeSharedState(
      {
        schemaVersion: 1,
        users: ['Ada'],
        records: {
          Ada: {
            name: 'Ada',
            created: 1,
            stats: {
              brueche: {
                topicId: 'brueche',
                topicTitle: 'Brüche',
                areaTitle: 'Zahlen',
                attempts: 2,
                correct: 2,
                points: 4,
                lastPracticed: 10,
              },
            },
            sessions: [],
          },
        },
      },
      {
        schemaVersion: 1,
        users: ['Ben'],
        records: {
          Ben: {
            name: 'Ben',
            created: 2,
            stats: {
              termine: {
                topicId: 'termine',
                topicTitle: 'Terme',
                areaTitle: 'Algebra',
                attempts: 1,
                correct: 1,
                points: 7,
                lastPracticed: 20,
              },
            },
            sessions: [],
          },
        },
      },
    )
    expect(merged.users).toEqual(['Ada', 'Ben'])
    expect(merged.records.Ada.stats.brueche.points).toBe(4)
    expect(merged.records.Ben.stats.termine.points).toBe(7)
  })
})

describe('mergeSharedState (CJS)', () => {
  it('unions user lists so two devices adding different names keep both', () => {
    const merged = mergeSharedStateCjs(
      { users: ['Ada'], records: { Ada: user('Ada') } },
      { users: ['Ben'], records: { Ben: user('Ben') } },
    )
    expect(merged.users).toEqual(['Ada', 'Ben'])
    expect(merged.records.Ada.name).toBe('Ada')
    expect(merged.records.Ben.name).toBe('Ben')
  })

  it('merges different topics for the same user', () => {
    const merged = mergeSharedStateCjs(
      {
        users: ['Ada'],
        records: {
          Ada: user('Ada', {
            stats: { brueche: { topicId: 'brueche', points: 4, lastPracticed: 10 } },
          }),
        },
      },
      {
        users: ['Ada'],
        records: {
          Ada: user('Ada', {
            stats: { termine: { topicId: 'termine', points: 7, lastPracticed: 20 } },
          }),
        },
      },
    )
    expect(merged.records.Ada.stats.brueche.points).toBe(4)
    expect(merged.records.Ada.stats.termine.points).toBe(7)
  })

  it('keeps the newer lastPracticed score when the same topic collides', () => {
    const merged = mergeSharedStateCjs(
      {
        users: ['Ada'],
        records: {
          Ada: user('Ada', {
            stats: { brueche: { topicId: 'brueche', points: 4, lastPracticed: 10 } },
          }),
        },
      },
      {
        users: ['Ada'],
        records: {
          Ada: user('Ada', {
            stats: { brueche: { topicId: 'brueche', points: 9, lastPracticed: 50 } },
          }),
        },
      },
    )
    expect(merged.records.Ada.stats.brueche.points).toBe(9)
  })

  it('unions session history without duplicating identical rows', () => {
    const session = { date: 42, topicId: 'brueche', points: 3 }
    const merged = mergeSharedStateCjs(
      { users: ['Ada'], records: { Ada: user('Ada', { sessions: [session] }) } },
      { users: ['Ada'], records: { Ada: user('Ada', { sessions: [session] }) } },
    )
    expect(merged.records.Ada.sessions).toHaveLength(1)
  })
})

describe('snapshotToState', () => {
  it('reads the localStorage keys used by storage.ts', () => {
    const ada = user('Ada', {
      stats: { brueche: { topicId: 'brueche', points: 5, lastPracticed: 1 } },
    })
    const state = snapshotToState({
      [USERS_STORAGE_KEY]: '["Ada"]',
      [userRecordKey('Ada')]: JSON.stringify(ada),
    })
    expect(state.users).toEqual(['Ada'])
    expect(state.records.Ada.name).toBe('Ada')
  })
})

describe('createFileStore', () => {
  it('writes atomically and migrates a localStorage snapshot only once', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mathsachs-store-'))
    const filePath = path.join(dir, 'mathsachs-state.json')
    const fileStore = createFileStore(filePath)

    const first = fileStore.migrateFromSnapshot({
      [USERS_STORAGE_KEY]: '["Ada"]',
      [userRecordKey('Ada')]: JSON.stringify(user('Ada')),
    })
    expect(first.users).toEqual(['Ada'])
    expect(first.migratedLocalStorage).toBe(true)
    expect(fs.existsSync(filePath)).toBe(true)

    fileStore.mergeWrite({
      users: ['Ben'],
      records: { Ben: user('Ben') },
    })
    const skipped = fileStore.migrateFromSnapshot({
      [USERS_STORAGE_KEY]: '["Clara"]',
      [userRecordKey('Clara')]: JSON.stringify(user('Clara')),
    })
    expect(skipped.users).toEqual(['Ada', 'Ben'])
    expect(skipped.users).not.toContain('Clara')

    const onDisk = JSON.parse(fs.readFileSync(filePath, 'utf8')) as { users: string[] }
    expect(onDisk.users).toEqual(['Ada', 'Ben'])
  })
})
