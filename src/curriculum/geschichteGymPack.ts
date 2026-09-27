import {
  GYM_SACHSEN_GESCHICHTE_PACK_ID,
  packContentHash,
  type CurriculumPack,
} from './pack'
import { buildGeschichteGymOfficialGrades } from './geschichteGymTopics'

/** Gymnasium Sachsen · Geschichte — K6 LB1–LB4 + Wahl freigegeben. */
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
    version: '1.9.0',
    changelog: `K6 freigegeben: LB2 Mittelalter (14), LB3 Religionen/Kulturen (9), LB4 Bürger „Durch die Zeiten“, Wahl Regionalgeschichte. Karl/Verdun erweitert; Toleranz-heute ohne Meta-Übungsbeispiel; Lückentoleranz fuzzy. ${topics} Themen.`,
    official,
    extras: [],
  }
  return { ...pack, contentHash: packContentHash(official, []) }
}
