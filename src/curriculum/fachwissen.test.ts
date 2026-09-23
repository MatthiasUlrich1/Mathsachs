import { describe, expect, it } from 'vitest'
import {
  conversionFachwissen,
  defaultFachwissen,
  ensureGradeFachwissen,
  ensureTopicFachwissen,
  physikFachwissen,
  topicHasWissenRubric,
} from './fachwissen'
import { hydratePackGrades } from './hydrate'
import { klasse5 } from './math5'
import { klasse6 } from './math6'
import { buildGymSachsenPhysikPack } from './physikGymPack'
import { conversionTopic, FLAECHE, LAENGE, MASSE, VOLUMEN, ZEIT } from './units'
import type { Grade, Topic } from './types'

const stubTopic = (partial: Partial<Topic> & { id: string; title: string }): Topic => ({
  pointsPerTask: 10,
  generate: () => {
    throw new Error('unused')
  },
  ...partial,
})

describe('Fachwissen / Wissen rubric (Issue #45)', () => {
  it('provides detailed conversion Wissen for Länge, Fläche, Volumen (factors & dimensions)', () => {
    const laenge = conversionFachwissen('Länge')
    expect(laenge.text).toMatch(/Faktor 10|multipliziere|dividiere/)
    expect(laenge.text).toMatch(/mm|cm|m|km/)

    const flaeche = conversionFachwissen('Flächeninhalt')
    expect(flaeche.text).toMatch(/m\s*×\s*m|quadriert|Faktor²|10 000/)
    expect(flaeche.text).toMatch(/zwei Dimensionen|Zwei Dimensionen/i)

    const volumen = conversionFachwissen('Volumen')
    expect(volumen.text).toMatch(/m\s*×\s*m\s*×\s*m|Faktor³|1000/)
    expect(volumen.text).toMatch(/drei Dimensionen|Drei Dimensionen/i)

    expect(conversionFachwissen('Masse').text).toMatch(/1000/)
    expect(conversionFachwissen('Zeit').text).toMatch(/60/)
  })

  it('attaches conversion Fachwissen on conversionTopic factory', () => {
    for (const q of [LAENGE, FLAECHE, VOLUMEN, MASSE, ZEIT]) {
      const topic = conversionTopic('k5', q)
      expect(topic.fachwissen?.text.length, q.label).toBeGreaterThan(80)
      expect(topicHasWissenRubric(topic)).toBe(true)
    }
  })

  it('fills missing Fachwissen by default and respects excludeFachwissen', () => {
    const filled = ensureTopicFachwissen(stubTopic({ id: 'x', title: 'Testthema' }))
    expect(filled.fachwissen?.text).toMatch(/Prinzip|Gesuchtes|Strategie/)

    const kept = ensureTopicFachwissen(
      stubTopic({
        id: 'y',
        title: 'Mit Text',
        fachwissen: { text: 'Bereits authored how-to Text mit genug Inhalt.' },
      }),
    )
    expect(kept.fachwissen?.text).toBe('Bereits authored how-to Text mit genug Inhalt.')

    const excluded = ensureTopicFachwissen(
      stubTopic({
        id: 'z',
        title: 'Ohne Wissen',
        excludeFachwissen: true,
        fachwissen: { text: 'soll weg' },
      }),
    )
    expect(excluded.fachwissen).toBeUndefined()
    expect(excluded.excludeFachwissen).toBe(true)
    expect(topicHasWissenRubric(excluded)).toBe(false)
  })

  it('gives Physics topics how-to Wissen with formulas where relevant', () => {
    expect(physikFachwissen({ id: 'ph-k6-lb2-dichte', title: 'Dichte berechnen' }).text).toMatch(
      /ρ\s*=\s*m\s*\/\s*V/,
    )
    expect(physikFachwissen({ id: 'ph-k6-lb2-volumen', title: 'Volumen bestimmen' }).text).toMatch(
      /Länge · Breite · Höhe|V =/,
    )
    expect(
      physikFachwissen({ id: 'ph-k6-lb2-geschwindigkeit', title: 'Gleichförmige Bewegung' }).text,
    ).toMatch(/s\s*=\s*v\s*·\s*t/)
  })

  it('hydrated Physik pack has Wissen on every topic', async () => {
    const grades = await hydratePackGrades(buildGymSachsenPhysikPack())
    let n = 0
    for (const grade of grades) {
      for (const area of grade.areas) {
        for (const topic of area.topics) {
          n++
          expect(topic.excludeFachwissen, topic.id).toBeFalsy()
          expect(topic.fachwissen?.text.trim().length, topic.id).toBeGreaterThan(40)
        }
      }
    }
    expect(n).toBeGreaterThan(150)
  })

  it('ensures Wissen across Math Klasse 5/6 including former conversion gaps', () => {
    for (const grade of [klasse5, klasse6] as Grade[]) {
      const ensured = ensureGradeFachwissen(grade, { subject: 'Mathematik' })
      for (const topic of ensured.areas.flatMap((a) => a.topics)) {
        expect(topic.fachwissen?.text.trim().length, topic.id).toBeGreaterThan(40)
      }
      const conversions = ensured.areas
        .flatMap((a) => a.topics)
        .filter((t) => t.id.includes('umrechnen'))
      expect(conversions.length).toBeGreaterThan(0)
      for (const t of conversions) {
        expect(t.fachwissen?.text, t.id).toMatch(/Faktor|multipliz|dividier|Dimension/i)
      }
    }
  })

  it('gives Geschichte LB1 topic-specific Wissen (not one Rom dump for all)', () => {
    const jz = defaultFachwissen(
      { id: 'ge-k6-lb1-jahreszahlen', title: 'Jahreszahlen (nur LB1)' },
      'Geschichte',
    )
    expect(jz.text).toMatch(/Jahreszahlen|aktuellen Jahreszahl/i)
    expect(jz.text).not.toMatch(/Bürgerrecht: Schutz, Verträge/)

    const begriffe = defaultFachwissen(
      { id: 'ge-k6-lb1-begriffe', title: 'Senat, Republik, Patrizier und Plebejer' },
      'Geschichte',
    )
    expect(begriffe.text).toMatch(/res publica|Patrizier|Plebejer/)
    expect(begriffe.text).not.toMatch(/Punische Kriege \(264/)
  })

  it('defaultFachwissen routes OS unit topics to conversion texts', () => {
    const fw = defaultFachwissen(
      { id: 'os-k5-lb3-flaeche-eh', title: 'Einheiten umrechnen: Flächeninhalt' },
      'Mathematik',
    )
    expect(fw.text).toMatch(/quadriert|Faktor²|10 000/)
  })
})
