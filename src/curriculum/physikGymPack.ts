import {
  GYM_SACHSEN_PHYSIK_PACK_ID,
  packContentHash,
  type CurriculumPack,
} from './pack'
import { buildPhysikGymOfficialGrades as buildSek1 } from './physikGymTopicsSek1'
import { buildPhysikGymOberstufeGrades } from './physikGymTopicsOberstufe'

/** Official Gymnasium Sachsen Physik outline (Klassen 6–10, JGS 11/12 Gk/Lk). */
export function buildPhysikGymOfficialGrades() {
  return [...buildSek1(), ...buildPhysikGymOberstufeGrades()]
}

export function buildGymSachsenPhysikPack(): CurriculumPack {
  const official = buildPhysikGymOfficialGrades()
  const pack: Omit<CurriculumPack, 'contentHash'> = {
    id: GYM_SACHSEN_PHYSIK_PACK_ID,
    title: 'Gymnasium Sachsen · Physik',
    region: 'Sachsen',
    school: 'Gymnasium',
    subject: 'Physik',
    version: '2.5.8',
    changelog:
      'LB3 komplett freigegeben; Wärmeausdehnung/Schmelzen/Messreihe/Aggregate themenrein; Factory-Routing (kein Kelvin-Dump, eta/radio/Strahlung-Kollisionen behoben).',
    official,
    extras: [],
  }
  return { ...pack, contentHash: packContentHash(official, []) }
}
