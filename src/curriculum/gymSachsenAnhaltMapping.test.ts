import { describe, expect, it } from 'vitest'
import { allOfficialStTopics, ST_GENERATOR_MAP, ST_TOPIC_MAPPINGS } from './gymSachsenAnhaltPack'
import { gymGeneratorCatalog, isPlayableOfficialTopic, resolveOsGenerate } from './oberschuleGenerators'
import { KNOWN_BEFORE_E5 } from './packMappingBaseline'

/** Mapping-Dokument: docs/lehrplan-mapping/gym-sachsen-anhalt.md (nachher: 144 spielbar). */
const PLAYABLE_AFTER = 144

describe('Gymnasium Sachsen-Anhalt: Lehrplan-Mapping (E5a)', () => {
  it('hat mindestens so viele spielbare Themen wie das Mapping-Dokument', async () => {
    await gymGeneratorCatalog()
    const playable = allOfficialStTopics().filter((t) => isPlayableOfficialTopic(t.id))
    expect(playable.length).toBeGreaterThanOrEqual(PLAYABLE_AFTER)
    expect(Object.keys(ST_TOPIC_MAPPINGS).length).toBeGreaterThanOrEqual(PLAYABLE_AFTER)
  })

  it('jeder Mapping-Schlüssel ist ein Pack-Thema, keine Quelle ist doppelt', () => {
    const ids = new Set(allOfficialStTopics().map((t) => t.id))
    const seen = new Map<string, string>()
    for (const [id, m] of Object.entries(ST_TOPIC_MAPPINGS)) {
      expect(ids.has(id), id).toBe(true)
      for (const s of m.sources) {
        expect(seen.get(s), `${s} in ${id} und ${seen.get(s)}`).toBeUndefined()
        seen.set(s, id)
      }
    }
  })

  it('altes String-Map ist leer, Baseline für ST leer', () => {
    expect(Object.keys(ST_GENERATOR_MAP)).toEqual([])
    expect(Object.keys(KNOWN_BEFORE_E5).filter((k) => k.includes(':gym-sachsen-anhalt'))).toEqual([])
  })

  it('Outline-Themen (ohne Quelle) lösen ohne Fehler auf (gespeicherte IDs)', async () => {
    const catalog = await gymGeneratorCatalog()
    for (const id of ['st-k6-anteil-prozent', 'st-k7-mittelwert', 'st-k10-zinsen', 'st-k1112-skalar']) {
      expect(isPlayableOfficialTopic(id), id).toBe(false)
      expect(() => resolveOsGenerate(id, catalog)).not.toThrow()
    }
  })

  it('1:n-Ergänzungen sind aufgelöst (K5-Quader: K5 + K6 qualifiziert)', () => {
    expect(ST_TOPIC_MAPPINGS['st-k5-volumen-quader'].sources).toEqual([
      'mathematik-klasse-5:lb4-volumen-quader',
      'mathematik-klasse-6:lb4-volumen-quader',
    ])
    expect(ST_TOPIC_MAPPINGS['st-k6-haeufigkeit'].sources).toContain('k7-lb4-rel-haeufigkeit')
  })
})
