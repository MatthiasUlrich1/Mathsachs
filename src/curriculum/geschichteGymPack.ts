import {
  GYM_SACHSEN_GESCHICHTE_PACK_ID,
  packContentHash,
  type CurriculumPack,
} from './pack'
import { buildGeschichteGymOfficialGrades } from './geschichteGymTopics'

/** Gymnasium Sachsen · Geschichte — K6 LB1 freigegeben (weltreich gesperrt), Rest Outline/gesperrt. */
export function buildGymSachsenGeschichtePack(): CurriculumPack {
  const official = buildGeschichteGymOfficialGrades()
  const topics = official.reduce(
    (sum, grade) => sum + grade.areas.reduce((n, area) => n + area.topics.length, 0),
    0,
  )
  const pack: Omit<CurriculumPack, 'contentHash'> = {
    id: GYM_SACHSEN_GESCHICHTE_PACK_ID,
    title: 'Gymnasium Sachsen · Geschichte',
    region: 'Sachsen',
    school: 'Gymnasium',
    subject: 'Geschichte',
    version: '1.4.3',
    changelog: `Klassen 5–12 (Gk/Lk) · ${topics} Themen. K6 LB1 Rom freigegeben (weltreich/Mare-Nostrum gesperrt; einfache Legenden-Aufgaben). Ohne Netz lokale Fassung.`,
    official,
    extras: [],
  }
  return { ...pack, contentHash: packContentHash(official, []) }
}
