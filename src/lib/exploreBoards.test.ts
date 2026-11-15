import { describe, expect, it } from 'vitest'
import {
  EXPLORE_BOARDS,
  EXPLORE_VIEW_H,
  EXPLORE_VIEW_W,
  clampExploreState,
  exploreStartState,
  getExploreBoard,
  mittelsenkrechteCase,
  winkelArt,
  type ExploreBoardDef,
} from './exploreBoards'

const board = (id: string): ExploreBoardDef => {
  const def = getExploreBoard(id)
  if (!def) throw new Error(`board ${id} fehlt`)
  return def
}

/** Alle Zustaende eines Boards (Regler: jeder Rasterwert, Schalter: an/aus), begrenzt. */
function allStates(def: ExploreBoardDef): Record<string, number>[] {
  const sliders = def.controls.filter((c) => c.type === 'slider')
  const toggles = def.controls.filter((c) => c.type === 'toggle')
  let acc: Record<string, number>[] = [{}]
  for (const c of sliders) {
    if (c.type !== 'slider') continue
    const grid: number[] = []
    for (let v = c.min; v <= c.max + 1e-9; v += c.step) grid.push(Math.round(v * 1e6) / 1e6)
    acc = acc.flatMap((s) => grid.map((v) => ({ ...s, [c.id]: v })))
  }
  for (const t of toggles) acc = acc.flatMap((s) => [0, 1].map((v) => ({ ...s, [t.id]: v })))
  return acc.map((s) => clampExploreState(def.controls, s))
}

describe('Registry', () => {
  it('kennt die drei Boards, unbekannte IDs liefern undefined statt Absturz', () => {
    expect(Object.keys(EXPLORE_BOARDS).sort()).toEqual([
      'bruchErweitern',
      'mittelsenkrechte',
      'winkelarten',
    ])
    expect(getExploreBoard('gibt-es-nicht')).toBeUndefined()
    expect(getExploreBoard('')).toBeUndefined()
    expect(getExploreBoard(undefined)).toBeUndefined()
    expect(getExploreBoard('toString')).toBeUndefined()
    expect(getExploreBoard('__proto__')).toBeUndefined()
  })

  it('Startzustand aus Reglern, params ueberschreiben und werden begrenzt', () => {
    const def = board('winkelarten')
    expect(exploreStartState(def)).toEqual({ winkel: 60, grad: 1 })
    expect(exploreStartState(def, { winkel: 135 }).winkel).toBe(135)
    expect(exploreStartState(def, { winkel: 999 }).winkel).toBe(360)
    expect(exploreStartState(def, { winkel: 133 }).winkel).toBe(135)
    expect(exploreStartState(def, { winkel: Number.NaN }).winkel).toBe(60)
  })

  it('render ist rein: gleicher Zustand ergibt identisches Markup', () => {
    for (const id of Object.keys(EXPLORE_BOARDS)) {
      const def = board(id)
      const s = exploreStartState(def)
      expect(def.render(s)).toBe(def.render({ ...s }))
      expect(def.describe(s)).toBe(def.describe({ ...s }))
    }
  })

  it('render und describe erzeugen kein NaN/undefined und genau ein svg', () => {
    for (const id of Object.keys(EXPLORE_BOARDS)) {
      const def = board(id)
      for (const s of allStates(def)) {
        const svg = def.render(s)
        expect(svg).not.toMatch(/NaN|undefined|Infinity/)
        expect(svg.startsWith('<svg')).toBe(true)
        expect(svg.endsWith('</svg>')).toBe(true)
        expect(def.describe(s)).not.toMatch(/NaN|undefined|Infinity/)
      }
    }
  })

  it('jedes Control hat id, Label und gueltigen Bereich', () => {
    for (const def of Object.values(EXPLORE_BOARDS)) {
      const ids = new Set<string>()
      for (const c of def.controls) {
        expect(c.label.trim()).not.toBe('')
        expect(ids.has(c.id)).toBe(false)
        ids.add(c.id)
        if (c.type === 'slider') {
          expect(c.min).toBeLessThan(c.max)
          expect(c.start).toBeGreaterThanOrEqual(c.min)
          expect(c.start).toBeLessThanOrEqual(c.max)
          expect(c.step).toBeGreaterThan(0)
        }
      }
    }
  })
})

describe('mittelsenkrechte', () => {
  const def = board('mittelsenkrechte')
  const st = (radius: number, strecke = 1, senkrechte = 0) => ({ radius, strecke, senkrechte })

  it('Fallunterscheidung an r = |AB|/2 = 3 cm', () => {
    expect(mittelsenkrechteCase(2.5)).toBe('none')
    expect(mittelsenkrechteCase(2.999999)).toBe('none')
    expect(mittelsenkrechteCase(3)).toBe('touch')
    expect(mittelsenkrechteCase(3.5)).toBe('two')
    expect(mittelsenkrechteCase(3.000001)).toBe('two')
  })

  it('Schnittpunkte nur wenn r > 3 cm', () => {
    expect(def.render(st(2.5))).not.toContain('S₁')
    expect(def.render(st(3))).not.toContain('S₁')
    const svg = def.render(st(3.5))
    expect(svg).toContain('S₁')
    expect(svg).toContain('S₂')
  })

  it('Caption: kein Schnitt, Beruehrung, zwei Punkte', () => {
    expect(def.describe(st(2.5))).toContain('schneiden sich die Kreise um A und B nicht')
    expect(def.describe(st(2.5))).toContain('r > 3 cm')
    expect(def.describe(st(3))).toContain('berühren sich')
    expect(def.describe(st(3.5))).toContain('in zwei Punkten S₁ und S₂')
    expect(def.describe(st(3.5))).toContain('r = 3,5 cm')
  })

  it('Toggles: Mittelsenkrechte und Strecke AB', () => {
    expect(def.render(st(4, 1, 0))).toContain('eb-seg')
    expect(def.render(st(4, 0, 0))).not.toContain('eb-seg')
    expect(def.render(st(4, 1, 1))).toContain('eb-axis')
    expect(def.render(st(4, 1, 0))).not.toContain('eb-axis')
    expect(def.describe(st(4, 1, 0))).toContain('Mittelsenkrechte zeigen')
    expect(def.describe(st(4, 1, 1))).toContain('ist die Mittelsenkrechte')
  })

  it('Radius 6 cm: Schnittpunkte liegen im Bild', () => {
    const svg = def.render(st(6))
    const ys = [...svg.matchAll(/class="eb-dot eb-dot--s" cx="[\d.]+" cy="([\d.]+)"/g)].map((m) =>
      Number(m[1]),
    )
    expect(ys).toHaveLength(2)
    for (const y of ys) {
      expect(y).toBeGreaterThan(8)
      expect(y).toBeLessThan(EXPLORE_VIEW_H - 8)
    }
  })
})

describe('winkelarten', () => {
  const def = board('winkelarten')
  const art = (deg: number) => winkelArt(deg).key

  it('Grenzen exakt bei 0, 90, 180, 360', () => {
    expect(art(0)).toBe('null')
    expect(art(5)).toBe('spitz')
    expect(art(85)).toBe('spitz')
    expect(art(90)).toBe('recht')
    expect(art(95)).toBe('stumpf')
    expect(art(175)).toBe('stumpf')
    expect(art(180)).toBe('gestreckt')
    expect(art(185)).toBe('ueberstumpf')
    expect(art(270)).toBe('ueberstumpf')
    expect(art(355)).toBe('ueberstumpf')
    expect(art(360)).toBe('voll')
  })

  it('Caption nennt Gradzahl und Winkelart', () => {
    const d = (winkel: number) => def.describe({ winkel, grad: 1 })
    expect(d(0)).toContain('Der Winkel ist 0° groß, das ist ein Nullwinkel')
    expect(d(90)).toContain('das ist ein rechter Winkel')
    expect(d(135)).toContain('Der Winkel ist 135° groß, das ist ein stumpfer Winkel')
    expect(d(180)).toContain('ein gestreckter Winkel')
    expect(d(270)).toContain('ein überstumpfer Winkel')
    expect(d(360)).toContain('ein Vollwinkel')
    expect(d(45)).toContain('ein spitzer Winkel')
  })

  it('Gradzahl-Schalter blendet das Label ein/aus', () => {
    expect(def.render({ winkel: 135, grad: 1 })).toContain('>135°<')
    expect(def.render({ winkel: 135, grad: 0 })).not.toContain('135°')
  })

  it('Figur an den Grenzen: Quadrat bei 90, Vollkreis bei 360, nichts bei 0', () => {
    expect(def.render({ winkel: 90, grad: 0 })).toContain('eb-rightangle')
    expect(def.render({ winkel: 85, grad: 0 })).not.toContain('eb-rightangle')
    expect(def.render({ winkel: 360, grad: 0 })).toContain('<circle class="eb-arc"')
    const zero = def.render({ winkel: 0, grad: 0 })
    expect(zero).not.toContain('eb-sector')
    expect(zero).not.toContain('eb-arc')
    expect(def.render({ winkel: 270, grad: 0 })).toContain(' 0 1 0 ')
    expect(def.render({ winkel: 180, grad: 0 })).toContain(' 0 0 0 ')
  })

  it('Regler 0 bis 360 in 5er-Schritten', () => {
    expect(def.controls[0]).toMatchObject({ type: 'slider', min: 0, max: 360, step: 5 })
  })
})

describe('bruchErweitern', () => {
  const def = board('bruchErweitern')

  it('Caption wie im Auftrag', () => {
    expect(def.describe({ zaehler: 2, nenner: 3, faktor: 2 })).toContain(
      '2/3 = 4/6 – der Anteil bleibt gleich.',
    )
  })

  it('Zaehler wird auf den Nenner begrenzt', () => {
    expect(clampExploreState(def.controls, { zaehler: 9, nenner: 4, faktor: 2 })).toEqual({
      zaehler: 4,
      nenner: 4,
      faktor: 2,
    })
    expect(clampExploreState(def.controls, { zaehler: 7, nenner: 5, faktor: 3 }).zaehler).toBe(5)
    expect(def.describe({ zaehler: 11, nenner: 3, faktor: 2 })).toContain('3/3 = 6/6')
  })

  it('Balkenmodell: Teile und gefuellte Teile oben und unten', () => {
    const svg = def.render({ zaehler: 2, nenner: 3, faktor: 2 })
    expect((svg.match(/class="eb-part/g) ?? []).length).toBe(3 + 6)
    expect((svg.match(/eb-part--fill/g) ?? []).length).toBe(2 + 4)
    expect((svg.match(/class="eb-strong"/g) ?? []).length).toBe(2)
    expect(svg).toContain('>2/3<')
    expect(svg).toContain('>4/6<')
    expect(svg).toContain('Erweitern mit 2')
  })
})

describe('Text im SVG passt in den viewBox (Text-Fit)', () => {
  const textRe =
    /<text x="([-\d.]+)" y="([-\d.]+)" font-size="(\d+)" text-anchor="(start|middle|end)"[^>]*>([^<]*)<\/text>/g
  for (const id of Object.keys(EXPLORE_BOARDS)) {
    it(`${id}: alle Labels liegen komplett im Bild`, () => {
      const def = board(id)
      let seen = 0
      for (const s of allStates(def)) {
        const svg = def.render(s)
        const openTexts = (svg.match(/<text /g) ?? []).length
        let found = 0
        for (const m of svg.matchAll(textRe)) {
          found++
          const x = Number(m[1])
          const y = Number(m[2])
          const size = Number(m[3])
          const width = m[5].length * size * 0.6 + 3
          const left = m[4] === 'start' ? x : m[4] === 'end' ? x - width : x - width / 2
          expect(left, `${id} links "${m[5]}"`).toBeGreaterThanOrEqual(0)
          expect(left + width, `${id} rechts "${m[5]}"`).toBeLessThanOrEqual(EXPLORE_VIEW_W)
          expect(y - size, `${id} oben "${m[5]}"`).toBeGreaterThanOrEqual(0)
          expect(y + size * 0.3, `${id} unten "${m[5]}"`).toBeLessThanOrEqual(EXPLORE_VIEW_H)
        }
        expect(found).toBe(openTexts)
        seen += found
      }
      expect(seen).toBeGreaterThan(0)
    })
  }
})
