import { describe, expect, it } from 'vitest'
import {
  belongsToChallenge,
  challengeTopicIds,
  initialChallengeSelection,
  shouldAttributeChallengePoints,
} from '../challenge/logic'
import { examSelKey, examThemeKey, hydrateExamBuilderFromSpec } from '../exam/examBuilderState'
import { mergeStatsByLegacyId } from '../lib/storage'
import { normalizeLegacyTopicIds } from './mergeNeu'
import { CURRICULUM_VERSION } from './registry'
import type { ExamSpec } from '../exam/types'

describe('normalizeLegacyTopicIds', () => {
  it('bildet __neu auf den Parent ab und dedupliziert', () => {
    expect(normalizeLegacyTopicIds(['a__neu', 'b', 'a', 'b__neu'])).toEqual(['a', 'b'])
  })
})

describe('Challenge mit alten __neu-IDs', () => {
  it('Bearbeiten: Auswahl enthält die Parents, ohne Duplikate', () => {
    const sel = initialChallengeSelection({ topicIds: ['lb1-addition__neu', 'lb1-addition', 'x'] })
    expect([...sel].sort()).toEqual(['lb1-addition', 'x'])
    const fromTopics = initialChallengeSelection({ topics: [{ id: 'k__neu' }] })
    expect([...fromTopics]).toEqual(['k'])
  })

  it('challengeTopicIds / Zuordnung zählen alte Sessions auf dem Parent', () => {
    const challenge = {
      id: 'c1',
      name: 'C',
      start: '2026-01-01T00:00:00',
      end: '2026-12-31T23:59:59',
      topicIds: ['lb1-addition__neu'],
    }
    expect(challengeTopicIds(challenge)).toEqual(['lb1-addition'])
    const date = new Date('2026-06-01T12:00:00Z').getTime()
    expect(belongsToChallenge({ date, topicId: 'lb1-addition__neu' }, challenge, true)).toBe(true)
    expect(belongsToChallenge({ date, topicId: 'lb1-addition' }, challenge, true)).toBe(true)
    expect(shouldAttributeChallengePoints(challenge, 'lb1-addition', date)).toBe(true)
  })
})

describe('Klausur bearbeiten mit alten __neu-IDs', () => {
  it('hydrateExamBuilderFromSpec normalisiert thema und führt Seeds zusammen', () => {
    const spec: ExamSpec = {
      schema: 'A',
      curriculumVersion: CURRICULUM_VERSION - 1,
      titel: 'Alt',
      aufgaben: [
        { modul: 'm', thema: 'lb1-addition__neu', seed: 1, punkte: 2 },
        { modul: 'm', thema: 'lb1-addition', seed: 2, punkte: 3 },
        { modul: 'm', thema: 'lb1-addition__neu', seed: 2, punkte: 5 },
      ],
    }
    const state = hydrateExamBuilderFromSpec(spec)
    const key = examThemeKey('m', 'lb1-addition')
    expect(state.selectedThemes).toEqual([key])
    expect(state.pools[key]!.slice(0, 2)).toEqual([1, 2])
    expect(state.selections[examSelKey('m', 'lb1-addition', 1)]).toBe(2)
    expect(state.selections[examSelKey('m', 'lb1-addition', 2)]).toBe(5)
    expect(Object.keys(state.selections).some((k) => k.includes('__neu'))).toBe(false)
  })
})

describe('Lernstand/Protokoll-Aggregation', () => {
  const stat = (topicId: string, topicTitle: string, n: number, last: number) => ({
    topicId,
    topicTitle,
    areaTitle: 'A',
    attempts: n,
    correct: n - 1,
    points: n * 10,
    lastPracticed: last,
  })

  it('Stats unter x__neu zählen zu x; Parent-Titel bleibt, gespeicherte Daten unverändert', () => {
    const input = [stat('x__neu', 'X · Neu (Prüfung)', 4, 100), stat('x', 'X', 6, 50), stat('y', 'Y', 2, 5)]
    const frozen = JSON.stringify(input)
    const out = mergeStatsByLegacyId(input)
    expect(out).toHaveLength(2)
    const x = out.find((s) => s.topicId === 'x')!
    expect(x).toMatchObject({ topicTitle: 'X', attempts: 10, correct: 8, points: 100, lastPracticed: 100 })
    expect(JSON.stringify(input)).toBe(frozen)
  })

  it('nur x__neu vorhanden: wird zu x', () => {
    const out = mergeStatsByLegacyId([stat('x__neu', 'X', 3, 1)])
    expect(out).toEqual([expect.objectContaining({ topicId: 'x', attempts: 3 })])
  })
})
