import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { emptyInput } from './types'
import { PHYSIK_K6_GENERATORS } from './physik6'
import { isPlayablePhysikTopic, resolvePhysikGenerate } from './physikGenerators'
import { buildGymSachsenPhysikPack } from './physikGymPack'
import { hydratePackGrades } from './hydrate'

describe('Physik Klasse 6 generators', () => {
  it('registers a generator for every K6 topic in the pack', () => {
    const k6 = buildGymSachsenPhysikPack().official.find((g) => g.id === 'physik-klasse-6')
    expect(k6).toBeTruthy()
    const ids = k6!.areas.flatMap((a) => a.topics.map((t) => t.id))
    expect(ids.length).toBeGreaterThan(20)
    for (const id of ids) {
      expect(isPlayablePhysikTopic(id), id).toBe(true)
      expect(resolvePhysikGenerate(id), id).toBeTypeOf('function')
    }
  })

  it('produces tasks whose sample answers pass check (60 seeds)', () => {
    for (const [id, generate] of Object.entries(PHYSIK_K6_GENERATORS)) {
      for (let seed = 1; seed <= 60; seed++) {
        const task = generate(createRng(seed))
        expect(task.check(task.sampleAnswer), `${id} seed ${seed}`).toBe(true)
        const blank = emptyInput(task.interactive?.type ?? task.answerKind)
        if (JSON.stringify(blank) !== JSON.stringify(task.sampleAnswer)) {
          expect(task.check(blank), `${id} seed ${seed} blank`).toBe(false)
        }
      }
    }
  })

  it('hydrates Klasse 6 with content IDs; LB1 Licht is released', async () => {
    const grades = await hydratePackGrades(buildGymSachsenPhysikPack())
    const k6 = grades.find((g) => g.id === 'physik-klasse-6')
    expect(k6).toBeTruthy()
    const topics = k6!.areas.flatMap((a) => a.topics)
    expect(topics.every((t) => typeof t.contentId === 'number')).toBe(true)
    const lb1 = k6!.areas.find((a) => a.id === 'lb1')!.topics
    expect(lb1.every((t) => t.released === true)).toBe(true)
    expect(lb1.find((t) => t.id === 'ph-k6-lb1-spiegel')?.tasksPerRound).toBe(10)
    expect(lb1.find((t) => t.id === 'ph-k6-lb1-brechung')?.tasksPerRound).toBe(10)
    expect(lb1.find((t) => t.id === 'ph-k6-lb1-sonne-mond-erde')?.released).toBe(true)
    const lb2 = k6!.areas.find((a) => a.id === 'lb2')!.topics
    expect(lb2.find((t) => t.id === 'ph-k6-lb2-dichte')?.released).toBe(true)
    expect(lb2.find((t) => t.id === 'ph-k6-lb2-wegzeit')?.released).toBe(true)
    expect(lb2.find((t) => t.id === 'ph-k6-lb2-einheiten')?.released).toBe(true)
    const lbw = k6!.areas.find((a) => a.id === 'lbw')!.topics
    expect(lbw.find((t) => t.id === 'ph-k6-lbw-lochkamera')?.released).toBe(true)
    expect(lbw.find((t) => t.id === 'ph-k6-lbw-auge')?.released).toBe(true)
    expect(lbw.every((t) => t.released === true)).toBe(true)
  })

  it('hides Schatten in lampenposition MC until Auflösung', () => {
    const gen = PHYSIK_K6_GENERATORS['ph-k6-lb1-lampenposition']!
    let found = false
    for (let seed = 1; seed <= 40; seed++) {
      const task = gen(createRng(seed))
      if (!task.question.includes('Wohin fällt der Schatten')) continue
      found = true
      expect(task.visualContent).not.toContain('>Schatten<')
      expect(task.solutionVisualContent).toContain('>Schatten<')
    }
    expect(found).toBe(true)
  })

  it('uses interactive variants for Dichte, Stromkreis, Farben, Lichtstrahl and Aggregate', () => {
    const need = {
      'ph-k6-lb2-dichte': new Set(['paramSlider', 'dragDropSlots']),
      'ph-k6-lb4-stromkreis': new Set(['multiSelect']),
      'ph-k6-lbw-farben': new Set(['multiSelect']),
      'ph-k6-lb1-lichtstrahl': new Set(['coordinateClick']),
      'ph-k6-lb3-aggregate': new Set(['dragDropSort']),
    } as const
    for (const [id, kinds] of Object.entries(need)) {
      const found = new Set<string>()
      for (let seed = 1; seed <= 80; seed++) {
        const task = PHYSIK_K6_GENERATORS[id]!(createRng(seed))
        if (task.interactive?.type) found.add(task.interactive.type)
      }
      for (const kind of kinds) {
        expect(found.has(kind), `${id} missing ${kind}`).toBe(true)
      }
    }
  })

  it('Weg-Zeit tasks include an s–t diagram SVG', () => {
    const gen = PHYSIK_K6_GENERATORS['ph-k6-lb2-wegzeit']!
    let withSvg = 0
    for (let seed = 1; seed <= 40; seed++) {
      const task = gen(createRng(seed))
      if (task.visualContent?.includes('Weg-Zeit')) withSvg++
      expect(task.check(task.sampleAnswer), `seed ${seed}`).toBe(true)
    }
    expect(withSvg).toBeGreaterThan(10)
  })

  it('Temperatur-Messreihe (ID 3173) evaluates series — no time-sorting busywork', () => {
    const gen = PHYSIK_K6_GENERATORS['ph-k6-lb3-messreihe']!
    for (let seed = 1; seed <= 80; seed++) {
      const task = gen(createRng(seed))
      expect(task.check(task.sampleAnswer), `seed ${seed}`).toBe(true)
      expect(task.question).not.toMatch(/Ordne die Temperatur-Messreihe nach der Zeit/)
      expect(task.interactive?.type).not.toBe('dragDropSort')
      const blob = `${task.question}\n${task.solution}`
      expect(blob).toMatch(
        /Mittelwert|Δϑ|Ausreißer|Messreihe|Temperaturänderung|pro Minute|Erwärmung|Messwert|Zeitpunkt/i,
      )
    }
  })

  it('Aggregatzustände avoid spoilers and off-topic Messreihe sorting', () => {
    const gen = PHYSIK_K6_GENERATORS['ph-k6-lb3-aggregate']!
    for (let seed = 1; seed <= 80; seed++) {
      const task = gen(createRng(seed))
      expect(task.check(task.sampleAnswer), `seed ${seed}`).toBe(true)
      expect(task.question).not.toMatch(/^Eis bei/)
      expect(task.question).not.toMatch(/Wasserdampf/)
      expect(task.question).not.toMatch(/Messreihe nach der Zeit/)
      expect(task.question).not.toMatch(/°C in Kelvin|Kelvin um/)
    }
  })

  it('Wärmeausdehnung stays on thermal expansion (not Kelvin conversion)', () => {
    const gen = PHYSIK_K6_GENERATORS['ph-k6-lb3-ausdehnung']!
    for (let seed = 1; seed <= 60; seed++) {
      const task = gen(createRng(seed))
      expect(task.check(task.sampleAnswer), `seed ${seed}`).toBe(true)
      const blob = `${task.question}\n${task.solution}\n${task.explanation}`
      expect(blob).toMatch(/Ausdehnung|Bimetall|Schiene|Thermometer|erwärm|abkühl|Länge|Volumen/i)
      expect(blob).not.toMatch(/T\s*=\s*ϑ\s*\+\s*273|°C in Kelvin/)
    }
  })

  it('Schmelzen und Sieden stays on phase changes (not Kelvin conversion)', () => {
    const gen = PHYSIK_K6_GENERATORS['ph-k6-lb3-schmelzen']!
    for (let seed = 1; seed <= 60; seed++) {
      const task = gen(createRng(seed))
      expect(task.check(task.sampleAnswer), `seed ${seed}`).toBe(true)
      const blob = `${task.question}\n${task.solution}`
      expect(blob).toMatch(/Schmelz|Sied|Erstarr|Kondens|Phasen|0 °C|100 °C|fest|flüssig|gas/i)
      expect(blob).not.toMatch(/T\s*=\s*ϑ\s*\+\s*273|Wandle .* Kelvin/)
    }
  })

  it('Celsius/Kelvin tasks have no conversion formula in the question', () => {
    const gen = PHYSIK_K6_GENERATORS['ph-k6-lb3-kelvin']!
    let numberLine = 0
    for (let seed = 1; seed <= 60; seed++) {
      const task = gen(createRng(seed))
      expect(task.question, `seed ${seed}`).not.toMatch(/T\/K|ϑ\/°C|\+ 273|− 273|- 273/)
      expect(task.check(task.sampleAnswer), `seed ${seed}`).toBe(true)
      if (task.interactive?.type === 'numberLine') {
        numberLine++
        expect(task.interactive.props.labelStep).toBe(20)
        expect(task.question).toMatch(/\d+ K/)
        expect(task.question).toMatch(/in °C/)
        expect(task.sampleAnswer.kind).toBe('numberLine')
        if (task.sampleAnswer.kind === 'numberLine') {
          expect(task.sampleAnswer.value).toBeLessThan(200)
        }
      }
    }
    expect(numberLine).toBeGreaterThan(5)
  })

  it('Temperatur ablesen uses thermometer slider with target °C in the question', () => {
    const gen = PHYSIK_K6_GENERATORS['ph-k6-lb3-thermometer']!
    let slider = 0
    let reading = 0
    for (let seed = 1; seed <= 60; seed++) {
      const task = gen(createRng(seed))
      expect(task.check(task.sampleAnswer), `seed ${seed}`).toBe(true)
      if (task.interactive?.type === 'numberLine') {
        slider++
        expect(task.interactive.props.variant).toBe('thermometer')
        expect(task.question).toMatch(/Stelle -?\d+ °C am Thermometer ein/)
        expect(task.question).not.toMatch(/Zahlenstrahl/)
      }
      if (task.visualContent?.includes('Thermometer')) {
        reading++
        expect(task.visualContent).toMatch(/°C/)
        expect(task.visualContent.length).toBeGreaterThan(400)
      }
    }
    expect(slider).toBeGreaterThan(10)
    expect(reading).toBeGreaterThan(5)
  })

  it('Stromkreis SVG has no solution labels like Schalter zu/offen', () => {
    const gen = PHYSIK_K6_GENERATORS['ph-k6-lb4-stromkreis']!
    for (let seed = 1; seed <= 40; seed++) {
      const svg = gen(createRng(seed)).visualContent ?? ''
      if (!svg) continue
      expect(svg, `seed ${seed}`).not.toMatch(/Schalter (zu|offen|geschlossen)/i)
    }
  })

  it('Stromkreis open-switch SVG uses hinged angled lever (not staggered horizontals)', () => {
    const gen = PHYSIK_K6_GENERATORS['ph-k6-lb4-stromkreis']!
    let openFound = false
    for (let seed = 1; seed <= 60; seed++) {
      const task = gen(createRng(seed))
      const svg = task.visualContent ?? ''
      if (!svg.includes('circle cx="110"') || !svg.includes('L148')) continue
      openFound = true
      expect(svg).toMatch(/L1\d+ \d+/)
      expect(svg).not.toMatch(/M148 58 H168/)
      expect(svg).toContain('circle cx="110"')
      expect(svg).toContain('circle cx="160"')
    }
    expect(openFound).toBe(true)
  })

  it('Sonne/Mond/Erde covers eclipses and moon phases with arrangement SVGs', () => {
    const gen = PHYSIK_K6_GENERATORS['ph-k6-lb1-sonne-mond-erde']!
    const hits = { eclipse: 0, phase: 0, sort: 0 }
    for (let seed = 1; seed <= 80; seed++) {
      const task = gen(createRng(seed))
      expect(task.check(task.sampleAnswer), `seed ${seed}`).toBe(true)
      const blob = `${task.question}\n${task.visualContent ?? ''}`
      expect(blob).not.toMatch(/Schalter (zu|offen)/i)
      if (/Finsternis|Anordnung/.test(task.question) || /Anordnung [AB]/.test(task.visualContent ?? '')) {
        hits.eclipse++
      }
      if (/Mondphase|Neumond|Vollmond|zunehmend|abnehmend/.test(task.question)) hits.phase++
      if (task.interactive?.type === 'dragDropSort') hits.sort++
      if (task.visualContent) {
        expect(task.visualContent).not.toMatch(/Sonnenfinsternis|Mondfinsternis|Neumond|Vollmond/)
      }
    }
    expect(hits.eclipse).toBeGreaterThan(5)
    expect(hits.phase).toBeGreaterThan(5)
  })

  it('Reihe/Parallel SVGs use official symbols and never spoil the answer', () => {
    const gen = PHYSIK_K6_GENERATORS['ph-k6-lb4-reiheparallel']!
    let series = 0
    let parallel = 0
    for (let seed = 1; seed <= 80; seed++) {
      const svg = gen(createRng(seed)).visualContent ?? ''
      if (!svg) continue
      expect(svg).not.toMatch(/eigene Zweige|gemeinsamer Weg/i)
      expect(svg).toMatch(/aria-label="(Reihen|Parallel)schaltung"/)
      // Glühlampe = Kreis mit X (two diagonal strokes)
      expect(svg).toMatch(/L[\d.]+ [\d.]+ M[\d.]+ [\d.]+ L[\d.]+/)
      // Spannungsquelle polarity marks
      expect(svg).toContain('>+</text>')
      expect(svg).toContain('>−</text>')
      if (svg.includes('Parallelschaltung')) parallel++
      if (svg.includes('Reihenschaltung')) series++
    }
    expect(series).toBeGreaterThan(5)
    expect(parallel).toBeGreaterThan(5)
  })

  it('Schaltsymbole (ID 6148) asks for symbols, not Ohm calculations', () => {
    const gen = PHYSIK_K6_GENERATORS['ph-k6-lb4-symbole']!
    for (let seed = 1; seed <= 40; seed++) {
      const task = gen(createRng(seed))
      expect(task.question, `seed ${seed}`).not.toMatch(/U\s*=\s*\d+\s*V/)
      expect(task.question, `seed ${seed}`).not.toMatch(/ohmschen Widerstand/)
      expect(task.question, `seed ${seed}`).not.toMatch(/Berechne die Stromstärke/)
      expect(task.question, `seed ${seed}`).not.toMatch(/Es gibt keine Schaltsymbole/)
      const blob = `${task.question}\n${task.solution}`
      expect(blob, `seed ${seed}`).toMatch(/Schaltsymbol|Bauteil|Symbol|Amperemeter|Voltmeter|Lampe|Widerstand|Batterie|Motor|Schalter|Summer/i)
    }
    let withSvg = 0
    let multiSymbol = 0
    let ohneCorrect = 0
    for (let seed = 1; seed <= 80; seed++) {
      const task = gen(createRng(seed))
      if (task.visualContent) withSvg++
      if ((task.visualContent?.match(/<circle/g) ?? []).length >= 2) multiSymbol++
      if (
        /Welche Aussagen zu Schaltsymbolen/.test(task.question) &&
        task.sampleAnswer.kind === 'multiSelect' &&
        task.sampleAnswer.selected.some((s) => /Ohne Schaltsymbole/.test(s))
      ) {
        ohneCorrect++
      }
    }
    expect(withSvg).toBeGreaterThan(20)
    expect(multiSymbol).toBeGreaterThan(5)
    expect(ohneCorrect).toBeGreaterThan(0)
  })

  it('Stromkreis (ID 8500) uses matching consumer glyph and Der Summer', () => {
    const gen = PHYSIK_K6_GENERATORS['ph-k6-lb4-stromkreis']!
    let summerHits = 0
    for (let seed = 1; seed <= 100; seed++) {
      const task = gen(createRng(seed))
      if (!/Summer/.test(task.question)) continue
      summerHits++
      expect(task.question + task.solution).toMatch(/Der Summer/)
      expect(task.question + task.solution).not.toMatch(/Die Summer/)
      expect(task.visualContent ?? '').toMatch(/fef3c7/)
      expect(task.visualContent ?? '').not.toMatch(/L[\d.]+ [\d.]+ M[\d.]+ [\d.]+ L[\d.]+/)
    }
    expect(summerHits).toBeGreaterThan(5)
  })

  it('Thermometer (ID 3126) accepts ±1 °C', () => {
    const gen = PHYSIK_K6_GENERATORS['ph-k6-lb3-thermometer']!
    let thermo = 0
    for (let seed = 1; seed <= 60; seed++) {
      const task = gen(createRng(seed))
      if (task.interactive?.type !== 'numberLine') continue
      if (task.interactive.props.variant !== 'thermometer') continue
      thermo++
      const target =
        task.sampleAnswer.kind === 'numberLine' ? task.sampleAnswer.value : null
      expect(target).not.toBeNull()
      expect(task.check({ kind: 'numberLine', value: target! + 1 })).toBe(true)
      expect(task.check({ kind: 'numberLine', value: target! - 1 })).toBe(true)
      expect(task.check({ kind: 'numberLine', value: target! + 2 })).toBe(false)
    }
    expect(thermo).toBeGreaterThan(5)
  })

  it('Elektrischer Widerstand topic keeps Ohm-style tasks', () => {
    const gen = PHYSIK_K6_GENERATORS['ph-k6-lb4-widerstand']!
    const kinds = new Set<string>()
    for (let seed = 1; seed <= 50; seed++) {
      const task = gen(createRng(seed))
      expect(task.check(task.sampleAnswer), `seed ${seed}`).toBe(true)
      if (task.unit === 'A' || /Stromstärke/.test(task.question)) kinds.add('calc')
      if (/R\s*=\s*U/.test(task.question) || /ohmschen Widerstand/.test(task.question)) kinds.add('ohm')
      if (task.interactive?.type === 'dragDropSlots') kinds.add('slots')
    }
    expect(kinds.has('calc') || kinds.has('ohm')).toBe(true)
  })

  it('Dichte paramSlider questions do not spoiler Ziel m/V', () => {
    const gen = PHYSIK_K6_GENERATORS['ph-k6-lb2-dichte']!
    let slider = 0
    for (let seed = 1; seed <= 60; seed++) {
      const task = gen(createRng(seed))
      if (task.interactive?.type !== 'paramSlider') continue
      slider++
      expect(task.question).not.toMatch(/Ziel:/)
      expect(task.question).not.toMatch(/m\s*=\s*\d+\s*g/)
    }
    expect(slider).toBeGreaterThan(0)
  })
})
