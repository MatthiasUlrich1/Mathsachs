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
    expect(pack.version).toBe('2.5.17')
    expect(file?.version).toBe('2.5.17')
    expect(file?.contentHash).toBe(pack.contentHash)
    const lb3 = file?.official
      .find((g) => g.id === 'physik-klasse-6')
      ?.areas.find((a) => a.id === 'lb3')
      ?.topics
    expect(lb3?.every((t) => t.released)).toBe(true)
    expect(manifest?.packs.map((p) => p.id)).toContain(GYM_SACHSEN_PHYSIK_PACK_ID)
    expect(manifest?.packs.find((p) => p.id === GYM_SACHSEN_PHYSIK_PACK_ID)?.subject).toBe(
      'Physik',
    )
    expect(manifest?.packs.find((p) => p.id === GYM_SACHSEN_PHYSIK_PACK_ID)?.version).toBe(
      pack.version,
    )
  })
})
