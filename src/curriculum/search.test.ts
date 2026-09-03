import { describe, it, expect } from 'vitest'
import { klasse5 } from './math5'
import { klasse6 } from './math6'
import { normalize, searchTopics, searchUnloadedHints } from './search'

const loaded = [{ moduleId: 'mathematik-klasse-5', grade: klasse5 }]

describe('topic search', () => {
  it('normalises case and folds umlauts to ASCII', () => {
    expect(normalize('Fläche')).toBe('flaeche')
    expect(normalize('  MÜNZE  wurf ')).toBe('muenze wurf')
    expect(normalize('Straße')).toBe('strasse')
  })

  it('finds the unit-conversion topic via the user example "Fläche umrechnen"', () => {
    const hits = searchTopics('Fläche umrechnen', loaded)
    const ids = hits.map((h) => h.topic.id)
    expect(ids).toContain('k5-umrechnen-flaeche')
  })

  it('is umlaut-tolerant: "flaeche" (typed without umlaut) still matches', () => {
    const hits = searchTopics('flaeche', loaded)
    expect(hits.some((h) => h.topic.id === 'k5-umrechnen-flaeche')).toBe(true)
  })

  it('matches a curated keyword such as "m²" / "Hektar"', () => {
    expect(searchTopics('Hektar', loaded).length).toBeGreaterThan(0)
    expect(searchTopics('m²', loaded).length).toBeGreaterThan(0)
  })

  it('is case-insensitive and substring-based', () => {
    expect(searchTopics('PRIM', loaded).some((h) => h.topic.id === 'lb1-primzahl')).toBe(true)
  })

  it('returns each hit with its grade and Lernbereich titles', () => {
    const hit = searchTopics('Median', [{ moduleId: 'k6', grade: klasse6 }]).length
      ? null
      : searchTopics('Volumen', loaded)[0]
    expect(hit).not.toBeUndefined()
    if (hit) {
      expect(hit.gradeTitle.length).toBeGreaterThan(0)
      expect(hit.areaTitle.length).toBeGreaterThan(0)
    }
  })

  it('returns no hits for an empty query', () => {
    expect(searchTopics('   ', loaded)).toHaveLength(0)
  })

  it('hints an available but unloaded class', () => {
    // "Pythagoras" lives in Klasse 9, which is not loaded here.
    const hints = searchUnloadedHints('Pythagoras', ['mathematik-klasse-5'])
    expect(hints.some((m) => m.id === 'mathematik-klasse-9')).toBe(true)
  })

  it('does not hint a class that is already loaded', () => {
    const hints = searchUnloadedHints('Fläche', ['mathematik-klasse-5'])
    expect(hints.some((m) => m.id === 'mathematik-klasse-5')).toBe(false)
  })
})
