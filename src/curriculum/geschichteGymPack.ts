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
    version: '1.7.0',
    changelog: `K7–OS Unterthemen verdichtet (Klett+Schlaukopf+Wikipedia-Inspiration, eigene Formulierungen) · Schwerpunkt K8–10/Oberstufe · Wahl Alltag WK1 · ${topics} Themen. K6 LB1 Rom freigegeben; Rest Entwickler (released:false).`,
    official,
    extras: [],
  }
  return { ...pack, contentHash: packContentHash(official, []) }
}
