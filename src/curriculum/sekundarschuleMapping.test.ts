/**
 * E5c: Mapping der Sekundarschule Sachsen-Anhalt (HS + RS) auf den Gym-Sachsen-Master-Pool.
 * Herleitung: docs/lehrplan-mapping/sekundarschule-sachsen-anhalt.md
 */
import { describe, expect, it } from 'vitest'
import { gymGeneratorCatalog, isPlayableOfficialTopic, mappingForTopic } from './oberschuleGenerators'
import type { PackTopic } from './pack'
import {
  buildSekundarschuleSachsenAnhaltHsPack,
  buildSekundarschuleSachsenAnhaltRsPack,
  SKS_GENERATOR_MAP,
  SKS_TOPIC_MAPPINGS,
} from './sekundarschuleSachsenAnhaltPack'

const topicsOf = (pack: { official: Array<{ areas: Array<{ topics: PackTopic[] }> }> }) =>
  pack.official.flatMap((g) => g.areas.flatMap((a) => a.topics))

const hs = topicsOf(buildSekundarschuleSachsenAnhaltHsPack())
const rs = topicsOf(buildSekundarschuleSachsenAnhaltRsPack())
const ids = (ts: PackTopic[]) => new Set(ts.map((t) => t.id))

/** Laut Mapping-Doc zu entfernende Pack-Themen (Lehrplan-Abweichungen D1-D23, D35). */
const REMOVED_BOTH = [
  'sks-k5-gleichung-beid',
  'sks-k5-geo-punkt',
  'sks-k5-median',
  'sks-k5-spannweite',
  'sks-k6-haeufigkeit',
  'sks-k6-median',
  'sks-k7-ungleichung',
  'sks-k7-winkelsumme',
  'sks-k7-flaeche-rechteck',
  'sks-k7-mittelwert',
  'sks-k7-median',
  'sks-k7-spannweite',
  'sks-k8-zylinder',
]
const REMOVED_HS = [
  'sks-k7-zinseszins',
  'sks-k8-thales',
  'sks-hs-k9-potenz-prod',
  'sks-hs-k9-potenz-quot',
  'sks-hs-k9-kegel',
  'sks-hs-k9-lgs-y',
  'sks-hs-k9-zinsen',
  'sks-hs-k9-median',
  'sks-hs-k9-modal',
]
const REMOVED_RS = [
  'sks-rs-k9-lgs-y',
  'sks-rs-k9-zinsen',
  'sks-rs-k9-zinseszins',
  'sks-rs-k9-modal',
  'sks-rs-k9-laplace',
  'sks-rs-k10-zinsen',
  'sks-rs-k10-zinseszins',
  'sks-rs-k10-erwartung',
  'sks-rs-k10-erwartung-wuerfel',
]

describe('Sekundarschule Sachsen-Anhalt: Mapping HS/RS', () => {
  it('Abdeckung: spielbare Themen mindestens so viele wie das Mapping-Doc ("nachher", ohne verworfenes sks-k8-zusammengesetzt)', async () => {
    await gymGeneratorCatalog()
    const playable = (ts: PackTopic[]) => ts.filter((t) => isPlayableOfficialTopic(t.id)).length
    // Doc: HS 110, RS 123, minus 1 (sks-k8-zusammengesetzt entfällt nach Stichprobe)
    expect(playable(hs)).toBeGreaterThanOrEqual(109)
    expect(playable(rs)).toBeGreaterThanOrEqual(122)
  })

  it('entfernte Themen stehen nicht mehr im Outline des jeweiligen Packs', () => {
    for (const id of [...REMOVED_BOTH, ...REMOVED_HS]) expect(ids(hs).has(id), `hs ${id}`).toBe(false)
    for (const id of [...REMOVED_BOTH, ...REMOVED_RS]) expect(ids(rs).has(id), `rs ${id}`).toBe(false)
    // RS behält Zinseszins (RSA 7/8) und Thales (Outline) – nur HS entfernt sie
    expect(ids(rs).has('sks-k7-zinseszins')).toBe(true)
    expect(ids(rs).has('sks-k8-thales')).toBe(true)
  })

  it('zuvor spielbare, jetzt entfernte Themen lösen weiter auf (gespeicherte IDs crashen nicht)', async () => {
    await gymGeneratorCatalog()
    const formerlyPlayable = [
      'sks-k5-geo-punkt',
      'sks-k6-haeufigkeit',
      'sks-k7-winkelsumme',
      'sks-k7-mittelwert',
      'sks-k7-median',
      'sks-k7-spannweite',
      'sks-k8-zylinder',
      'sks-hs-k9-potenz-prod',
      'sks-hs-k9-potenz-quot',
      'sks-hs-k9-median',
      'sks-hs-k9-modal',
      'sks-rs-k9-modal',
      'sks-rs-k9-laplace',
      'sks-rs-k10-zinsen',
      'sks-rs-k10-zinseszins',
      'sks-rs-k10-erwartung',
      'sks-rs-k10-erwartung-wuerfel',
    ]
    for (const id of formerlyPlayable) {
      expect(isPlayableOfficialTopic(id), id).toBe(true)
      expect(mappingForTopic(id), id).toBeDefined()
    }
  })

  it('neue Pack-Themen sind im Outline und spielbar', async () => {
    await gymGeneratorCatalog()
    for (const id of ['sks-k5-sachaufgaben', 'sks-k7-haeufigkeit', 'sks-hs-k9-formeln']) {
      expect(ids(hs).has(id), `hs ${id}`).toBe(true)
      expect(isPlayableOfficialTopic(id), id).toBe(true)
    }
    for (const id of ['sks-hs-k7-kapital', 'sks-hs-k7-zinssatz']) {
      expect(ids(hs).has(id), id).toBe(true)
      expect(ids(rs).has(id), id).toBe(false)
    }
    for (const id of ['sks-rs-k9-formeln', 'sks-rs-k9-oberflaeche-pyramide']) {
      expect(ids(rs).has(id), id).toBe(true)
      expect(isPlayableOfficialTopic(id), id).toBe(true)
    }
  })

  it('sks-k8-zusammengesetzt entfällt: die Master enthalten keine Kreisanteile (Stichprobe E5c)', () => {
    expect(ids(hs).has('sks-k8-zusammengesetzt')).toBe(false)
    expect(ids(rs).has('sks-k8-zusammengesetzt')).toBe(false)
    expect(SKS_TOPIC_MAPPINGS['sks-k8-zusammengesetzt']).toBeUndefined()
  })

  it('sks-hs-k9-lgs: difficulty 3 nur mit difficultyReason (§3.4.2 S. 59)', () => {
    const m = SKS_TOPIC_MAPPINGS['sks-hs-k9-lgs']
    expect(m?.maxDifficulty).toBe(3)
    expect(m?.difficultyReason).toMatch(/§3\.4\.2/)
    expect(m?.difficultyReason).toMatch(/S\. 59/)
    // alle übrigen HS-Themen bleiben auf maxDifficulty 2 begrenzt
    for (const t of hs) {
      const mm = SKS_TOPIC_MAPPINGS[t.id]
      if (!mm || t.id === 'sks-hs-k9-lgs') continue
      expect(mm.maxDifficulty, t.id).toBe(2)
    }
  })

  it('K5/K6-Quader: klassenqualifizierte Quellen statt mehrdeutiger ID', () => {
    for (const id of ['sks-k5-volumen-quader', 'sks-k5-oberflaeche-quader']) {
      const src = SKS_TOPIC_MAPPINGS[id]!.sources
      expect(src.some((s) => s.startsWith('mathematik-klasse-5:')), id).toBe(true)
      expect(src.some((s) => s.startsWith('mathematik-klasse-6:')), id).toBe(true)
    }
  })

  it('alte String-Map ist leer (vollständig durch 1:n-Mappings ersetzt)', () => {
    expect(Object.keys(SKS_GENERATOR_MAP)).toEqual([])
  })
})
