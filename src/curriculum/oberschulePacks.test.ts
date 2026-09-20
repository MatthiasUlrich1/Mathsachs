import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { hydratePackGrades } from './hydrate'
import {
  installPack,
  listInstalledPacks,
  resetCurriculumMemory,
  type CurriculumKv,
} from './install'
import {
  gymGeneratorCatalog,
  isPlayableOfficialTopic,
  OS_CUSTOM_GENERATORS,
  OS_GENERATOR_MAP,
} from './oberschuleGenerators'
import {
  allOfficialTopics,
  buildOberschuleHsPack,
  buildOberschuleRsPack,
} from './oberschulePacks'
import {
  OS_HS_PACK_ID,
  OS_RS_PACK_ID,
  parseCurriculumPack,
  parseManifest,
} from './pack'
import { getLoadedIds, listVisibleGradeModules } from './registry'

const memoryKv = (): CurriculumKv => {
  const map = new Map<string, string>()
  return {
    getItem: (key) => (map.has(key) ? map.get(key)! : null),
    setItem: (key, value) => {
      map.set(key, value)
    },
    removeItem: (key) => {
      map.delete(key)
    },
  }
}

const curriculaDir = join(dirname(fileURLToPath(import.meta.url)), '../../curricula')

const officialNames = (pack: ReturnType<typeof buildOberschuleHsPack>) =>
  pack.official.flatMap((grade) => grade.areas.map((area) => area.title))

describe('Oberschule Sachsen Lehrplan packs', () => {
  const hs = buildOberschuleHsPack()
  const rs = buildOberschuleRsPack()

  it('parses both packs with empty extras and matching schema', () => {
    const parsedHs = parseCurriculumPack(hs)
    const parsedRs = parseCurriculumPack(rs)
    expect(parsedHs?.id).toBe(OS_HS_PACK_ID)
    expect(parsedRs?.id).toBe(OS_RS_PACK_ID)
    expect(parsedHs?.extras).toEqual([])
    expect(parsedRs?.extras).toEqual([])
    expect(parsedHs?.region).toBe('Sachsen')
    expect(parsedHs?.school).toBe('Oberschule')
    expect(parsedHs?.subject).toBe('Mathematik')
    expect(parsedHs?.version).toBe('1.0.0')
    expect(parsedRs?.school).toBe('Oberschule')
  })

  it('uses official Lernbereich names, not invented Gymnasium titles', () => {
    const hsNames = officialNames(hs)
    const rsNames = officialNames(rs)
    expect(hsNames).toContain('Natürliche Zahlen')
    expect(hsNames).toContain('Gemeine Brüche, Dezimalzahlen und Größen')
    expect(hsNames).toContain('Anteile und Prozente')
    expect(hsNames).toContain('Wirtschaftliches Rechnen')
    expect(hsNames).not.toContain('Arbeiten mit natürlichen Zahlen')
    expect(rsNames).toContain('Prozent- und Zinsrechnung')
    expect(rsNames).toContain('Elemente der Stochastik')
    expect(rsNames).toContain('Ähnlichkeit')
    expect(rsNames).toContain('Quadratische Funktionen und quadratische Gleichungen')
    expect(rsNames).toContain('Dreiecke und Vielecke')
  })

  it('covers official grades: HS 5–9, RS 5–10, with shared 5–6 in both', () => {
    expect(hs.official.map((g) => g.id)).toEqual([
      'os-hs-klasse-5',
      'os-hs-klasse-6',
      'os-hs-klasse-7',
      'os-hs-klasse-8',
      'os-hs-klasse-9',
    ])
    expect(rs.official.map((g) => g.id)).toEqual([
      'os-rs-klasse-5',
      'os-rs-klasse-6',
      'os-rs-klasse-7',
      'os-rs-klasse-8',
      'os-rs-klasse-9',
      'os-rs-klasse-10',
    ])
  })

  it('keeps HS and RS distinct: RS has higher-level topics HS does not', () => {
    const hsTitles = new Set(allOfficialTopics(hs).map((t) => t.title))
    const rsTitles = new Set(allOfficialTopics(rs).map((t) => t.title))
    expect(hs.official.some((g) => g.id.endsWith('klasse-10'))).toBe(false)
    expect(rs.official.some((g) => g.id.endsWith('klasse-10'))).toBe(true)
    expect(rsTitles.has('Ähnliche Figuren: Seitenlänge, Flächen und Volumen')).toBe(true)
    expect(hsTitles.has('Ähnliche Figuren: Seitenlänge, Flächen und Volumen')).toBe(false)
    expect(rsTitles.has('Oberflächeninhalt und Volumen der Kugel')).toBe(true)
    expect(hsTitles.has('Oberflächeninhalt und Volumen der Kugel')).toBe(false)
    expect(rsTitles.has('Quadratische Gleichungen lösen')).toBe(true)
    expect(hsTitles.has('Quadratische Gleichungen lösen')).toBe(false)
    expect(hsTitles.has('Wirtschaftliches Rechnen') || officialNames(hs).includes('Wirtschaftliches Rechnen')).toBe(
      true,
    )
    expect(officialNames(rs).includes('Wirtschaftliches Rechnen')).toBe(false)
  })

  it('maps playable topics to existing Gymnasium generators', async () => {
    const catalog = await gymGeneratorCatalog()
    for (const [osId, gymId] of Object.entries(OS_GENERATOR_MAP)) {
      expect(catalog.has(gymId), `missing gym generator ${gymId} for ${osId}`).toBe(true)
    }
    const hsIds = new Set(allOfficialTopics(hs).map((t) => t.id))
    const rsIds = new Set(allOfficialTopics(rs).map((t) => t.id))
    for (const osId of Object.keys(OS_GENERATOR_MAP)) {
      expect(hsIds.has(osId) || rsIds.has(osId), `mapped id ${osId} missing from packs`).toBe(true)
    }
    for (const osId of Object.keys(OS_CUSTOM_GENERATORS)) {
      expect(hsIds.has(osId) || rsIds.has(osId), `custom id ${osId} missing from packs`).toBe(true)
      expect(isPlayableOfficialTopic(osId)).toBe(true)
    }
  })

  it('uses first-quadrant coordinates for OS Klasse 5', async () => {
    const gen = OS_CUSTOM_GENERATORS['os-k5-lb3-koordinaten']
    expect(gen).toBeDefined()
    for (let seed = 1; seed <= 20; seed++) {
      const task = gen!(createRng(seed))
      expect(task.check(task.sampleAnswer)).toBe(true)
      expect(task.visualContent || task.interactive).toBeTruthy()
      expect(task.question).toMatch(/erste[rn] Quadrant/)
    }
  })

  it('uses real pie charts for Kreisdiagramm (not fraction pies)', () => {
    const gen = OS_CUSTOM_GENERATORS['os-hs-k7-lb2-kreisdiagramm']
    expect(gen).toBeDefined()
    for (let seed = 1; seed <= 15; seed++) {
      const task = gen!(createRng(seed))
      expect(task.check(task.sampleAnswer)).toBe(true)
      expect(task.visualContent).toMatch(/Sport:|Musik:|Bus:|Bahn:|Rot:|Blau:|[ABC]:/)
      expect(task.question).toMatch(/Kreisdiagramm|Anteil/)
    }
  })

  it('uses prism-net choices for Körpernetze', () => {
    const gen = OS_CUSTOM_GENERATORS['os-hs-k7-lb4-netze']
    expect(gen).toBeDefined()
    for (let seed = 1; seed <= 12; seed++) {
      const task = gen!(createRng(seed))
      expect(task.check(task.sampleAnswer)).toBe(true)
      expect(task.visualContent).toContain('<rect')
      expect(task.interactive?.type).toBe('choicePick')
    }
  })

  it('wires composite geometry and graphical fractions into both tracks', async () => {
    const catalog = await gymGeneratorCatalog()
    expect(OS_GENERATOR_MAP['os-hs-k7-lb1-flaeche']).toBe('lb4-flaeche-zusammengesetzt')
    expect(OS_GENERATOR_MAP['os-hs-k7-lb1-volumen']).toBe('lb4-volumen-zusammengesetzt')
    expect(OS_GENERATOR_MAP['os-k5-lb2-anteil']).toBe('lb2-grafische-brueche')
    expect(OS_GENERATOR_MAP['os-k5-lb4-spiegelung']).toBe('lb3-achsensymmetrie')
    expect(OS_GENERATOR_MAP['os-rs-k7-lb4-vieleck-flaeche']).toBe('lb4-flaeche-zusammengesetzt')
    // Prefer visual K6 generators where OS previously fell back to text-only K7
    expect(OS_GENERATOR_MAP['os-hs-k7-lb2-haeufigkeit']).toBe('lb2-haeufigkeit')
    expect(OS_GENERATOR_MAP['os-rs-k7-lb2-haeufigkeit']).toBe('lb2-haeufigkeit')
    expect(OS_GENERATOR_MAP['os-hs-k7-lb4-volumen-prisma']).toBe('lb4-volumen-prisma')
    expect(OS_GENERATOR_MAP['os-rs-k7-lb4-volumen-prisma']).toBe('lb4-volumen-prisma')
    expect(OS_GENERATOR_MAP['os-hs-k7-lb4-oberflaeche']).toBe('lb4-oberflaeche-quader')
    expect(OS_GENERATOR_MAP['os-rs-k7-lb4-oberflaeche']).toBe('lb4-oberflaeche-quader')
    expect(OS_GENERATOR_MAP['os-k6-lb3-kongruenz']).toBe('lb3-kongruenzsatz')
    expect(OS_GENERATOR_MAP['os-k5-lb3-wuerfel']).toBe('lb4-wuerfelnetz')
    expect(OS_CUSTOM_GENERATORS['os-hs-k9-lb3-steigung']).toBeDefined()
    expect(OS_CUSTOM_GENERATORS['os-hs-k7-lb3-koordinaten']).toBeDefined()
    expect(OS_CUSTOM_GENERATORS['os-hs-k7-lb2-kreisdiagramm']).toBeDefined()
    expect(OS_CUSTOM_GENERATORS['os-rs-k7-lb1-kreisdiagramm']).toBeDefined()
    expect(OS_CUSTOM_GENERATORS['os-hs-k7-lb1-netze']).toBeDefined()
    expect(OS_CUSTOM_GENERATORS['os-rs-k7-lb4-darstellen']).toBeDefined()
    for (const id of [
      'lb4-flaeche-zusammengesetzt',
      'lb4-volumen-zusammengesetzt',
      'lb2-grafische-brueche',
      'lb3-achsensymmetrie',
      'lb3-koordinaten-eintragen',
      'lb2-haeufigkeit',
      'lb4-volumen-prisma',
      'lb4-oberflaeche-quader',
      'lb3-kongruenzsatz',
      'lb4-wuerfelnetz',
    ]) {
      expect(catalog.has(id), id).toBe(true)
    }
  })

  it('hydrates playable topics and marks the rest outline-only', async () => {
    const grades = await hydratePackGrades(hs)
    const topics = grades.flatMap((g) => g.areas.flatMap((a) => a.topics))
    const playable = topics.filter((t) => !t.outlineOnly)
    const outline = topics.filter((t) => t.outlineOnly)
    expect(playable.length).toBeGreaterThan(40)
    expect(outline.length).toBeGreaterThan(10)
    const task = playable[0].generate(createRng(1))
    expect(task.check(task.sampleAnswer)).toBe(true)
    expect(outline[0].generate(createRng(1)).question).toMatch(/noch keine Übungsaufgaben/)
    expect(topics.every((t) => t.source === 'official')).toBe(true)
    expect(topics.every((t) => isPlayableOfficialTopic(t.id) === !t.outlineOnly)).toBe(true)
  })

  it('installs a pack so Klassenstufen appear without the Gymnasium modules', async () => {
    resetCurriculumMemory()
    const kv = memoryKv()
    installPack(rs, kv)
    expect(listInstalledPacks(kv).map((p) => p.id)).toEqual([OS_RS_PACK_ID])
    const visible = listVisibleGradeModules(kv)
    expect(visible.map((m) => m.id)).toContain('os-rs-klasse-10')
    expect(visible.map((m) => m.id)).not.toContain('mathematik-klasse-5')
    expect(getLoadedIds(kv)).toEqual([])
    const grade = await visible.find((m) => m.id === 'os-rs-klasse-10')!.load()
    expect(grade.areas.some((a) => a.title === 'Zufallsgrößen')).toBe(true)
  })

  it('writes JSON files that match the builders and lists both packs in the manifest', () => {
    const hsFile = parseCurriculumPack(
      JSON.parse(readFileSync(join(curriculaDir, 'oberschule-sachsen-hs.json'), 'utf8')),
    )
    const rsFile = parseCurriculumPack(
      JSON.parse(readFileSync(join(curriculaDir, 'oberschule-sachsen-rs.json'), 'utf8')),
    )
    const manifest = parseManifest(
      JSON.parse(readFileSync(join(curriculaDir, 'manifest.json'), 'utf8')),
    )
    expect(hsFile?.contentHash).toBe(hs.contentHash)
    expect(rsFile?.contentHash).toBe(rs.contentHash)
    expect(manifest?.packs.map((p) => p.id)).toEqual([
      'gym-sachsen',
      'gym-sachsen-physik',
      OS_HS_PACK_ID,
      OS_RS_PACK_ID,
    ])
    expect(hsFile?.extras).toEqual([])
    expect(rsFile?.extras).toEqual([])
  })
})
