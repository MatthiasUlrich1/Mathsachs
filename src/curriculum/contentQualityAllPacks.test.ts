/**
 * Inhaltsqualität über alle Packs × viele Seeds (Regeln: `.cursor/rules/curriculum-aufgaben-qualitaet.mdc`).
 * Ausführliches Audit mit mehr Seeds: `npx tsx tmp/audit-content-quality.ts`.
 */
import { describe, expect, it } from 'vitest'
import { auditTopic, crossTopicDuplicates, type AuditIssue, type TopicSample } from './contentAudit'
import { AUDIT_PACK_NAMES, loadAuditTopics, type AuditPackName } from './contentAuditPacks'

const SEEDS = 40
const ROUND_SEEDS = 3

const GROUPS: Record<string, AuditPackName[]> = {
  'Gymnasium Sachsen (Mathe, Physik, Biologie, Geschichte)': ['gym-mathe', 'gym-physik', 'gym-bio', 'gym-geschichte'],
  'Oberschule Hauptschulbildungsgang': ['os-hs'],
  'Oberschule Realschulbildungsgang': ['os-rs'],
  'Gymnasium Sachsen-Anhalt': ['gym-st'],
  'Sekundarschule Sachsen-Anhalt HS': ['sks-hs'],
  'Sekundarschule Sachsen-Anhalt RS': ['sks-rs'],
}

const format = (issues: AuditIssue[]) =>
  issues
    .slice(0, 40)
    .map((i) => `[${i.rule}] ${i.pack}/${i.topicId}: ${i.detail}`)
    .join('\n')

describe('Inhaltsqualität aller Packs', () => {
  it('jedes Audit-Pack ist einer Gruppe zugeordnet', () => {
    expect(Object.values(GROUPS).flat().sort()).toEqual([...AUDIT_PACK_NAMES].sort())
  })

  for (const [label, packs] of Object.entries(GROUPS)) {
    it(`${label}: keine Regelverstöße`, async () => {
      const refs = await loadAuditTopics(packs)
      expect(refs.length).toBeGreaterThan(0)
      const issues: AuditIssue[] = []
      const samples: TopicSample[] = []
      for (const ref of refs) {
        const r = auditTopic(ref, { seeds: SEEDS, roundSeeds: ROUND_SEEDS })
        issues.push(...r.issues)
        samples.push(r.sample)
      }
      issues.push(...crossTopicDuplicates(samples))
      expect(issues.length, format(issues)).toBe(0)
    }, 600_000)
  }
})
