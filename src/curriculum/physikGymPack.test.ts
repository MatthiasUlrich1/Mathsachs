import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { bundledPackById, installPack, resetCurriculumMemory } from './install'
import { GYM_SACHSEN_PHYSIK_PACK_ID, parseCurriculumPack, parseManifest } from './pack'
import { buildGymSachsenPhysikPack } from './physikGymPack'
import { listVisibleGradeModules } from './registry'

const curriculaDir = join(dirname(fileURLToPath(import.meta.url)), '../../curricula')

afterEach(() => {
  resetCurriculumMemory()
})

describe('Gymnasium Sachsen Physik pack', () => {
  it('builds a Physik outline pack with grades 6–12', () => {
    const pack = buildGymSachsenPhysikPack()
    expect(pack.id).toBe(GYM_SACHSEN_PHYSIK_PACK_ID)
    expect(pack.subject).toBe('Physik')
    expect(pack.official.map((g) => g.id)).toEqual([
      'physik-klasse-6',
      'physik-klasse-7',
      'physik-klasse-8',
      'physik-klasse-9',
      'physik-klasse-10',
      'physik-jgs-11-gk',
      'physik-jgs-12-gk',
      'physik-jgs-11-lk',
      'physik-jgs-12-lk',
    ])
    expect(pack.official.every((g) => g.subjectTitle === 'Physik')).toBe(true)
    expect(pack.extras).toEqual([])
  })

  it('is installable as a bundled pack and appears in Themen', async () => {
    const pack = await bundledPackById(GYM_SACHSEN_PHYSIK_PACK_ID)
    expect(pack?.id).toBe(GYM_SACHSEN_PHYSIK_PACK_ID)
    installPack(pack!)
    const visible = listVisibleGradeModules()
    expect(visible.map((m) => m.id)).toContain('physik-klasse-6')
    expect(visible.every((m) => m.subjectTitle === 'Physik')).toBe(true)
    const grade = await visible.find((m) => m.id === 'physik-klasse-6')!.load()
    expect(grade.areas[0]?.topics[0]?.outlineOnly).toBeFalsy()
    expect(grade.areas.some((a) => a.topics.some((t) => t.id === 'ph-k6-lb1-schatten'))).toBe(
      true,
    )
  })

  it('matches the exported JSON and is listed in the manifest', () => {
    const pack = buildGymSachsenPhysikPack()
    const file = parseCurriculumPack(
      JSON.parse(readFileSync(join(curriculaDir, 'gym-sachsen-physik.json'), 'utf8')),
    )
    const manifest = parseManifest(
      JSON.parse(readFileSync(join(curriculaDir, 'manifest.json'), 'utf8')),
    )
    expect(pack.version).toBe('2.5.5')
    expect(file?.version).toBe('2.5.5')
    expect(file?.contentHash).toBe(pack.contentHash)
    const volumen = file?.official
      .flatMap((g) => g.areas)
      .flatMap((a) => a.topics)
      .find((t) => t.id === 'ph-k6-lb2-volumen')
    expect(volumen?.released).toBe(true)
    const symbole = file?.official
      .flatMap((g) => g.areas)
      .flatMap((a) => a.topics)
      .find((t) => t.id === 'ph-k6-lb4-symbole')
    const widerstand = file?.official
      .flatMap((g) => g.areas)
      .flatMap((a) => a.topics)
      .find((t) => t.id === 'ph-k6-lb4-widerstand')
    const leiter = file?.official
      .flatMap((g) => g.areas)
      .flatMap((a) => a.topics)
      .find((t) => t.id === 'ph-k6-lb4-leiter')
    const reihe = file?.official
      .flatMap((g) => g.areas)
      .flatMap((a) => a.topics)
      .find((t) => t.id === 'ph-k6-lb4-reiheparallel')
    const gefahren = file?.official
      .flatMap((g) => g.areas)
      .flatMap((a) => a.topics)
      .find((t) => t.id === 'ph-k6-lb4-gefahren')
    expect(symbole?.released).toBe(true)
    expect(widerstand?.released).toBe(true)
    expect(leiter?.released).toBe(true)
    expect(reihe?.released).toBe(true)
    expect(gefahren?.released).toBe(true)
    expect(manifest?.packs.map((p) => p.id)).toContain(GYM_SACHSEN_PHYSIK_PACK_ID)
    expect(manifest?.packs.find((p) => p.id === GYM_SACHSEN_PHYSIK_PACK_ID)?.subject).toBe(
      'Physik',
    )
    expect(manifest?.packs.find((p) => p.id === GYM_SACHSEN_PHYSIK_PACK_ID)?.version).toBe(
      pack.version,
    )
  })
})
