import {
  GYM_SACHSEN_GESCHICHTE_PACK_ID,
  packContentHash,
  type CurriculumPack,
} from './pack'
import { buildGeschichteGymOfficialGrades } from './geschichteGymTopics'

/** Gymnasium Sachsen · Geschichte — K6 LB1 freigegeben; übrige Banken released:false. */
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
    version: '1.8.0',
    changelog: `K6 LB2/LB3 verdichtet nach Lehrplan (Herrschaft/Lebensformen Mittelalter; Religionen/Kulturen): Frankenreich, Reichsbildung, Mission, Ostkolonisation, HRR, Weltlich/Geistlich, Grundherrschaft, Burg/Ritter, Frömmigkeit, Klöster; Juden, Pogrome, Kreuzzüge, Al-Andalus, Kulturtransfer, Toleranz heute. ${topics} Themen. K6 LB1 Rom freigegeben; neue Themen released:false.`,
    official,
    extras: [],
  }
  return { ...pack, contentHash: packContentHash(official, []) }
}
