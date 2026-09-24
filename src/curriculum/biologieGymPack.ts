import {
  GYM_SACHSEN_BIOLOGIE_PACK_ID,
  packContentHash,
  type CurriculumPack,
} from './pack'
import { buildBiologieGymOfficialGrades } from './biologieGymTopics'

/** Gymnasium Sachsen · Biologie — K5–12 Generatoren (released:false, Entwickler). */
export function buildGymSachsenBiologiePack(): CurriculumPack {
  const official = buildBiologieGymOfficialGrades()
  const topics = official.reduce(
    (sum, grade) => sum + grade.areas.reduce((n, area) => n + area.topics.length, 0),
    0,
  )
  const pack: Omit<CurriculumPack, 'contentHash'> = {
    id: GYM_SACHSEN_BIOLOGIE_PACK_ID,
    title: 'Gymnasium Sachsen · Biologie',
    region: 'Sachsen',
    school: 'Gymnasium',
    subject: 'Biologie',
    version: '1.1.0',
    changelog: `Klassen 5–12 (Gk/Lk) · ${topics} Themen mit Generatoren (MC, R/F, Match, Sort, Gap, Multi; released:false). Lehrplan 522; Quiz-Ideen an Schulportale angelehnt. Ohne Netz lokale Fassung.`,
    official,
    extras: [],
  }
  return { ...pack, contentHash: packContentHash(official, []) }
}
