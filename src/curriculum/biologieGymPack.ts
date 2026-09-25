import {
  GYM_SACHSEN_BIOLOGIE_PACK_ID,
  packContentHash,
  type CurriculumPack,
} from './pack'
import { buildBiologieGymOfficialGrades } from './biologieGymTopics'

/** Gymnasium Sachsen · Biologie — K5 Freigabeliste + K6 LB2 Wirbellose; Rest released:false. */
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
    version: '1.7.0',
    changelog: `K5 Freigabeliste: Fisch-Aufbau, Lurch-/Kriechtier-Fortpflanzung, Vogel Aufbau+Flug, Säuger Überblick+Skelett, Zuordnung freigegeben. Anatomie-Slots kalibriert; dichte Banken für gesperrte Themen; Fortpflanzung Mensch (locked). ${topics} Themen.`,
    official,
    extras: [],
  }
  return { ...pack, contentHash: packContentHash(official, []) }
}
