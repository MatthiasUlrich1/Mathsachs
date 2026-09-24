import {
  GYM_SACHSEN_BIOLOGIE_PACK_ID,
  packContentHash,
  type CurriculumPack,
} from './pack'
import { buildBiologieGymOfficialGrades } from './biologieGymTopics'

/** Gymnasium Sachsen · Biologie — K5 Wirbeltiere spielbar (Entwickler), Rest Outline. */
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
    version: '1.0.0',
    changelog: `Klassen 5–12 (Gk/Lk) · ${topics} Themen. K5 Wirbeltiere mit Generatoren (released:false, Entwickler). Ohne Netz lokale Fassung.`,
    official,
    extras: [],
  }
  return { ...pack, contentHash: packContentHash(official, []) }
}
