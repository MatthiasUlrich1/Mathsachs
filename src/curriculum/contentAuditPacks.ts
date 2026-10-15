/**
 * Lädt alle Packs für das Inhalts-Audit (`contentAudit.ts`).
 * Gruppen: Packs, die ein Schüler gleichzeitig nutzt (Gym Sachsen: Mathe+Physik+Bio+Geschichte),
 * werden gemeinsam auf Cross-Topic-Duplikate geprüft. Schulformen (HS/RS, ST) sind getrennt.
 */
import { buildGymSachsenBiologiePack } from './biologieGymPack'
import { bundledCurricula } from './bundled'
import { ensureGradeFachwissen } from './fachwissen'
import { withMathGymThinFill } from './mathGymThinFill'
import type { Grade } from './types'
import type { AuditSubject, AuditTopicRef } from './contentAudit'
import { buildGymSachsenGeschichtePack } from './geschichteGymPack'
import { buildGymSachsenAnhaltPack } from './gymSachsenAnhaltPack'
import { hydratePackGrades } from './hydrate'
import { buildOberschuleHsPack, buildOberschuleRsPack } from './oberschulePacks'
import type { CurriculumPack } from './pack'
import { buildGymSachsenPhysikPack } from './physikGymPack'
import { buildGymSachsenSeed } from './seed'
import {
  buildSekundarschuleSachsenAnhaltHsPack,
  buildSekundarschuleSachsenAnhaltRsPack,
} from './sekundarschuleSachsenAnhaltPack'

export type AuditPackName =
  | 'gym-mathe'
  | 'gym-physik'
  | 'gym-bio'
  | 'gym-geschichte'
  | 'os-hs'
  | 'os-rs'
  | 'gym-st'
  | 'sks-hs'
  | 'sks-rs'

const PACKS: Record<
  AuditPackName,
  { group: string; subject: AuditSubject; build: () => CurriculumPack | Promise<CurriculumPack> }
> = {
  'gym-mathe': { group: 'gym-sn', subject: 'mathematik', build: () => buildGymSachsenSeed() },
  'gym-physik': { group: 'gym-sn', subject: 'physik', build: buildGymSachsenPhysikPack },
  'gym-bio': { group: 'gym-sn', subject: 'biologie', build: buildGymSachsenBiologiePack },
  'gym-geschichte': { group: 'gym-sn', subject: 'geschichte', build: buildGymSachsenGeschichtePack },
  'os-hs': { group: 'os-hs', subject: 'mathematik', build: buildOberschuleHsPack },
  'os-rs': { group: 'os-rs', subject: 'mathematik', build: buildOberschuleRsPack },
  'gym-st': { group: 'gym-st', subject: 'mathematik', build: buildGymSachsenAnhaltPack },
  'sks-hs': { group: 'sks-hs', subject: 'mathematik', build: buildSekundarschuleSachsenAnhaltHsPack },
  'sks-rs': { group: 'sks-rs', subject: 'mathematik', build: buildSekundarschuleSachsenAnhaltRsPack },
}

export const AUDIT_PACK_NAMES = Object.keys(PACKS) as AuditPackName[]

/** Fach je Topic (OS-Packs enthalten nur Mathe; Fallback über Pack). */
function subjectFor(pack: AuditPackName, topicId: string): AuditSubject {
  if (topicId.startsWith('ph-')) return 'physik'
  if (topicId.startsWith('bi-')) return 'biologie'
  if (topicId.startsWith('ge-')) return 'geschichte'
  return PACKS[pack].subject
}

/** Gym-Mathe wie in der App (`loadInstalledGrade`): Bundled-Modul + Thin-Fill + Fachwissen. */
async function loadGymMatheGrades(): Promise<Grade[]> {
  const grades: Grade[] = []
  for (const mod of bundledCurricula) {
    if (mod.subjectTitle !== 'Mathematik') continue
    const grade = await mod.load()
    grades.push(
      ensureGradeFachwissen(
        {
          ...grade,
          id: mod.id,
          areas: grade.areas.map((area) => ({
            ...area,
            topics: area.topics.map((topic) => ({
              ...topic,
              generate: withMathGymThinFill(topic.id, topic.generate) ?? topic.generate,
            })),
          })),
        },
        { subject: mod.subjectTitle },
      ),
    )
  }
  return grades
}

export async function loadAuditTopics(names: AuditPackName[] = AUDIT_PACK_NAMES): Promise<AuditTopicRef[]> {
  const out: AuditTopicRef[] = []
  for (const name of names) {
    const def = PACKS[name]
    const grades = name === 'gym-mathe' ? await loadGymMatheGrades() : await hydratePackGrades(await def.build())
    for (const g of grades) {
      for (const area of g.areas) {
        for (const topic of area.topics) {
          if (topic.outlineOnly) continue
          out.push({
            pack: name,
            group: def.group,
            subject: subjectFor(name, topic.id),
            gradeId: g.id,
            areaId: area.id,
            topic,
          })
        }
      }
    }
  }
  return out
}
