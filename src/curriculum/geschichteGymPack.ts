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
    version: '1.11.0',
    changelog: `K5 Neu-Themen mit hand-authored Aufgabenbanken (Archäologie, Jetztmensch, Gesellschaftspyramide, Polis, Mitbestimmung, Ressourcen, Landschaft); neu+gesperrt bis Freigabe. Polis-Bildbeschriftung mit Commons-Karte. ${topics} Themen.`,
    official,
    extras: [],
  }
  return { ...pack, contentHash: packContentHash(official, []) }
}
