import {
  GYM_SACHSEN_GESCHICHTE_PACK_ID,
  packContentHash,
  type CurriculumPack,
} from './pack'
import { buildGeschichteGymOfficialGrades } from './geschichteGymTopics'

const SOURCE =
  'Lehrplan Gymnasium Geschichte (Sachsen) 2004/2007/2009/2011/2019, lplanid=65, https://www.schulportal.sachsen.de/lplandb/lehrplan/65'

/** Gymnasium Sachsen · Geschichte — Outline, Themen gesperrt (nur Entwickleransicht). */
export function buildGymSachsenGeschichtePack(): CurriculumPack {
  const official = buildGeschichteGymOfficialGrades()
  const pack: Omit<CurriculumPack, 'contentHash'> = {
    id: GYM_SACHSEN_GESCHICHTE_PACK_ID,
    title: 'Gymnasium Sachsen · Geschichte',
    region: 'Sachsen',
    school: 'Gymnasium',
    subject: 'Geschichte',
    version: '1.1.0',
    changelog:
      `K6 LB1 Römische Zivilisation: Übungsaufgaben aus Heft + Schulwissen ` +
      `(Anfänge, Begriffe, Ämter, Punische Kriege, Mare Nostrum, Bürgerrecht). ` +
      `Themen weiterhin gesperrt — nur Entwickleransicht. ${SOURCE}`,
    official,
    extras: [],
  }
  return { ...pack, contentHash: packContentHash(official, []) }
}
