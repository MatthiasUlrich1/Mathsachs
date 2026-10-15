import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { findTrackingIdIssues } from './contentAudit'
import { loadAuditTopics } from './contentAuditPacks'
import {
  stripInternalPromptTracking,
  withOsTopicIdentity,
} from './oberschuleGenerators'
import type { Task } from './types'

describe('keine internen Nr-Tracking-Suffixe im Prompt', () => {
  it('stripInternalPromptTracking entfernt · Nr… und Nr…', () => {
    expect(stripInternalPromptTracking('Was ist Leben? · Nr83801785')).toBe('Was ist Leben?')
    expect(stripInternalPromptTracking('Aussage Nr12')).toBe('Aussage Nr12') // <4 Ziffern ohne Mittelpunkt
    expect(stripInternalPromptTracking('Fachbegriff Nr76042837 hier')).toBe('Fachbegriff hier')
    expect(stripInternalPromptTracking('Punkt • Nr99999999')).toBe('Punkt')
  })

  it('withOsTopicIdentity hängt keine Nr an und entfernt vorhandene', () => {
    const gen = withOsTopicIdentity('bio-k5-leben', 'Merkmale des Lebens', () => {
      const task = {
        question: 'Was gehört nicht zu den Merkmalen des Lebens? · Nr83801785',
        solution: 'x',
        sampleAnswer: 'x',
        answerKind: 'text' as const,
        check: () => true,
        interactive: {
          type: 'choicePick' as const,
          props: { statement: 'Leben braucht Energie. · Nr83801785', choices: ['a'], correct: 'a' },
        },
        contentIds: ['shared'],
      }
      return task as unknown as Task
    })
    const task = gen(createRng(1))
    expect(task.question).toBe('Was gehört nicht zu den Merkmalen des Lebens?')
    expect(task.question).not.toMatch(/Nr\d/)
    expect(String(task.interactive?.props?.statement)).toBe('Leben braucht Energie.')
    expect(task.dedupeKey?.startsWith('bio-k5-leben::')).toBe(true)
    expect(findTrackingIdIssues(task)).toEqual([])
  })

  it('kein generiertes Audit-Sample enthält Nr+Ziffern im Prompt', async () => {
    const refs = await loadAuditTopics()
    const hits: string[] = []
    for (const ref of refs) {
      for (let s = 0; s < 12; s++) {
        let task: Task
        try {
          task = ref.topic.generate(createRng(s * 104729 + 7))
        } catch {
          continue
        }
        for (const d of findTrackingIdIssues(task)) {
          hits.push(`${ref.pack}/${ref.topic.id}: ${d}`)
        }
      }
    }
    expect(hits, hits.slice(0, 20).join('\n')).toEqual([])
  }, 300_000)
})
