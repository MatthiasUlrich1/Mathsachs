/**
 * Oberschule Sachsen (HS + RS): Mapping aus docs/lehrplan-mapping/oberschule-sachsen.md (E5b).
 */
import { describe, expect, it } from 'vitest'
import {
  gymGeneratorCatalog,
  isPlayableOfficialTopic,
  OS_CUSTOM_GENERATORS,
  OS_GENERATOR_MAP,
  OS_TOPIC_MAPPINGS,
} from './oberschuleGenerators'
import { allOfficialTopics, buildOberschuleHsPack, buildOberschuleRsPack } from './oberschulePacks'

const hsTopics = () => allOfficialTopics(buildOberschuleHsPack())
const rsTopics = () => allOfficialTopics(buildOberschuleRsPack())

describe('Oberschule Sachsen Mapping', () => {
  it('spielbare Themen erreichen die Zahl der Doku (HS >= 117, RS >= 129)', async () => {
    const catalog = await gymGeneratorCatalog()
    const playable = (ts: Array<{ id: string }>) =>
      ts.filter((t) => isPlayableOfficialTopic(t.id, catalog)).length
    expect(playable(hsTopics())).toBeGreaterThanOrEqual(117)
    expect(playable(rsTopics())).toBeGreaterThanOrEqual(129)
  })

  it('alte String-Map ist abgelöst', () => {
    expect(Object.keys(OS_GENERATOR_MAP)).toEqual([])
  })

  it('HS K7 LB1 Fläche/Volumen: allowRepeat mit Lehrplan-Begründung', () => {
    for (const id of ['os-hs-k7-lb1-flaeche', 'os-hs-k7-lb1-volumen']) {
      const m = OS_TOPIC_MAPPINGS[id]!
      expect(m.allowRepeat).toBe(true)
      expect(m.note).toMatch(/LP HS Kl\. 7 LB 1/)
    }
  })

  it('K7 Koordinaten: Custom (Q1) wird mit Master-Themen (4 Quadranten) gemischt', () => {
    for (const id of ['os-hs-k7-lb3-koordinaten', 'os-rs-k7-lb3-koordinaten']) {
      expect(OS_CUSTOM_GENERATORS[id]).toBeTypeOf('function')
      expect(OS_TOPIC_MAPPINGS[id]!.includeCustom).toBe(true)
      expect(OS_TOPIC_MAPPINGS[id]!.sources).toEqual([
        'lb3-koordinaten-eintragen',
        'lb3-koordinaten-ablesen',
      ])
    }
  })

  it('HS K9 Sinus: bekannte Abweichung (kein reines Sinus-Master) ist dokumentiert', () => {
    const m = OS_TOPIC_MAPPINGS['os-hs-k9-lb1-sinus']!
    expect(m.sources).toEqual(['k9-lb3-trig-wert'])
    expect(m.note).toMatch(/Abweichung D12/)
  })

  it('K6 Quader: klassenqualifizierte Quellen', () => {
    expect(OS_TOPIC_MAPPINGS['os-k6-lb4-volumen-quader']!.sources).toEqual([
      'mathematik-klasse-6:lb4-volumen-quader',
    ])
    expect(OS_TOPIC_MAPPINGS['os-k5-lb3-volumen-wuerfel']!.sources).toEqual([
      'mathematik-klasse-5:lb4-volumen-quader',
    ])
  })
})
