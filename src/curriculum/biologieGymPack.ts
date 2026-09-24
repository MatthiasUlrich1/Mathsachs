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
    version: '1.2.0',
    changelog: `Klassen 5–12 · ${topics} Themen + neue Interaktionen pairMatch, clozeMulti, iconBelong, flashcardFlip (released:false). Lehrplan 522; Schlaukopf-Themen als Ideen (original formuliert).`,
    official,
    extras: [],
  }
  return { ...pack, contentHash: packContentHash(official, []) }
}
