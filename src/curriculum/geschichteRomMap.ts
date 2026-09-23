/**
 * Real Wikimedia Commons maps for „Vom Stadtstaat zum Weltreich (Mare Nostrum)“.
 * Bundled under public/maps/ for stable offline use; full attribution below.
 *
 * Phase → map:
 * - Stadtstaat / archaisches Latium → Renato (500 v. Chr.)
 * - Expansion auf der italienischen Halbinsel (vor 218) → Javierfv1212
 * - Westmittelmeer / Mare Nostrum / Kaiserreich (ab 218 v. Chr.) → Varana
 */

/** Visible + explanation attribution (CC0 / Public Domain / CC BY-SA). */
export const ROM_MAP_ATTRIBUTION =
  'Karten: (1) Renato de Carvalho Ferreira, „Roma Antiga - 500 a.C.“, Wikimedia Commons, CC0 1.0 — https://commons.wikimedia.org/wiki/File:Roma_Antiga_-_500_a.C..svg · (2) Javierfv1212, „Roman conquest of Italy“, Wikimedia Commons, Public Domain — https://commons.wikimedia.org/wiki/File:Roman_conquest_of_Italy.PNG · (3) Varana, „Extent of the Roman Republic and the Roman Empire between 218 BC and 117 AD“, Wikimedia Commons, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Extent_of_the_Roman_Republic_and_the_Roman_Empire_between_218_BC_and_117_AD.png'

export const ROM_MAP_QUELLE = {
  quelle: 'Wikimedia Commons · Renato (CC0) / Javierfv1212 (Public Domain) / Varana (CC BY-SA 3.0)',
  url: 'https://commons.wikimedia.org/wiki/File:Roma_Antiga_-_500_a.C..svg',
} as const

/** Latium-Karte (Renato): Legende „Expansão territorial“ — Grün / Gelb / Orange-Rot. */
export const LATIUM_MAP_PHASES = {
  p753: {
    fill: '#3a8a4a',
    colorAsk: 'die grüne Farbe',
    colorShort: 'Grün',
    year: '753 v. Chr.',
    meaning: 'Gebiet um 753 v. Chr. (Gründungssage — kleinster Kern um Rom)',
  },
  p700: {
    fill: '#e8c838',
    colorAsk: 'die gelbe Farbe',
    colorShort: 'Gelb',
    year: '700 v. Chr.',
    meaning: 'Gebiet um 700 v. Chr. (erste Erweiterung um Rom)',
  },
  p500: {
    fill: '#c45c2c',
    colorAsk: 'die orange-rote Farbe',
    colorShort: 'Orange/Rot',
    year: '500 v. Chr.',
    meaning: 'Gebiet um 500 v. Chr. (größere Fläche in Latium)',
  },
} as const

export type LatiumMapPhase = keyof typeof LATIUM_MAP_PHASES

/** Italien-Karte (Javierfv1212): Phasenfarben mit Jahreszahlen v. Chr. */
export const ITALY_MAP_PHASES = {
  p500: {
    colorAsk: 'die dunkelrote Farbe',
    colorShort: 'Dunkelrot',
    year: '500 v. Chr.',
    meaning: 'Gebiet um 500 v. Chr. (früher Kern um Rom)',
  },
  p338: {
    colorAsk: 'die hellrote Farbe',
    colorShort: 'Hellrot',
    year: '338 v. Chr.',
    meaning: 'Gebiet um 338 v. Chr. (nach dem Latinerkrieg)',
  },
  p272: {
    colorAsk: 'die beige Farbe',
    colorShort: 'Beige',
    year: '272 v. Chr.',
    meaning: 'Gebiet um 272 v. Chr. (nach dem Pyrrhoskrieg — Süditalien)',
  },
  p218: {
    colorAsk: 'die hellgrüne Farbe',
    colorShort: 'Hellgrün',
    year: '218 v. Chr.',
    meaning: 'Gebiet um 218 v. Chr. (Beginn des Zweiten Punischen Krieges)',
  },
} as const

export type ItalyMapPhase = keyof typeof ITALY_MAP_PHASES

/** Legend phases of the Varana extent map (colors as on the Commons file). Starts 218 BC. */
export const ROM_MAP_PHASES = {
  p218: {
    fill: '#7a1515',
    colorAsk: 'die dunkelrote Farbe',
    colorShort: 'Dunkelrot',
    year: '218 v. Chr.',
    label: 'Dunkelrot: 218 v. Chr.',
    meaning: 'Gebiet um 218 v. Chr. (früheste Phase auf dieser Karte)',
  },
  p133: {
    fill: '#c45c5c',
    colorAsk: 'die hellrote Farbe',
    colorShort: 'Hellrot',
    year: '133 v. Chr.',
    label: 'Hellrot: 133 v. Chr.',
    meaning: 'Gebiet um 133 v. Chr. (nach den großen Kriegen im Westen)',
  },
  p44: {
    fill: '#e07a28',
    colorAsk: 'die orange Farbe',
    colorShort: 'Orange',
    year: '44 v. Chr.',
    label: 'Orange: 44 v. Chr.',
    meaning: 'Gebiet um 44 v. Chr. (späte Republik)',
  },
  p14: {
    fill: '#e8c838',
    colorAsk: 'die gelbe Farbe',
    colorShort: 'Gelb',
    year: '14 n. Chr.',
    label: 'Gelb: 14 n. Chr.',
    meaning: 'Gebiet um 14 n. Chr. (Tod des Augustus)',
  },
  p117: {
    fill: '#3a8a4a',
    colorAsk: 'die grüne Farbe',
    colorShort: 'Grün',
    year: '117 n. Chr.',
    label: 'Grün: 117 n. Chr.',
    meaning: 'Gebiet um 117 n. Chr. (größte Ausdehnung unter Trajan)',
  },
} as const

export type RomMapPhase = keyof typeof ROM_MAP_PHASES

/** Three Commons maps: early city-state, Italian conquest, Mediterranean empire. */
export type RomMapKind = 'stadtstaat' | 'italy' | 'extent'

const STADTSTAAT_SRC = '/maps/roma-antiga-500bc.png'
const ITALY_SRC = '/maps/roman-conquest-of-italy.png'
const EXTENT_SRC = '/maps/roman-extent-218bc-117ad-varana-1280.png'

const STADTSTAAT_CAPTION =
  'Renato de Carvalho Ferreira, „Roma Antiga - 500 a.C.“, Wikimedia Commons, CC0 1.0'
const ITALY_CAPTION =
  'Javierfv1212, „Roman conquest of Italy“, Wikimedia Commons, Public Domain'
const EXTENT_CAPTION =
  'Varana, Wikimedia Commons, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Extent_of_the_Roman_Republic_and_the_Roman_Empire_between_218_BC_and_117_AD.png'

const LEGEND_HINT =
  '<p style="margin:0 0 8px;font-size:0.95rem;line-height:1.35"><strong>Tipp:</strong> Schau in die Legende der Karte — jede Farbe steht für ein Jahr.</p>'

/**
 * HTML figure with the real Commons map (img) and a short license line.
 * Hints stay neutral (no year/color spoilers — pupils read the legend).
 */
export function romanExpansionMapHtml(
  kind: RomMapKind = 'extent',
  _focus?: RomMapPhase | 'mare' | 'all' | 'stadtstaat' | 'italy' | LatiumMapPhase | ItalyMapPhase,
): string {
  const src = kind === 'stadtstaat' ? STADTSTAAT_SRC : kind === 'italy' ? ITALY_SRC : EXTENT_SRC
  const alt =
    kind === 'stadtstaat'
      ? 'Historische Karte: frühes Rom in Latium (Farben = Jahre)'
      : kind === 'italy'
        ? 'Historische Karte: Eroberung Italiens durch Rom (Farben = Jahre)'
        : 'Historische Karte: Ausdehnung Roms (Farben = Jahre)'
  const caption =
    kind === 'stadtstaat' ? STADTSTAAT_CAPTION : kind === 'italy' ? ITALY_CAPTION : EXTENT_CAPTION

  return `<figure style="margin:0;max-width:100%;text-align:center">
  ${LEGEND_HINT}
  <img src="${src}" alt="${alt}" style="display:block;max-width:100%;width:100%;height:auto;margin:0 auto;border-radius:4px" loading="lazy" decoding="async"/>
  <figcaption style="margin-top:8px;font-size:0.72rem;line-height:1.35;opacity:0.85;text-align:left">${caption}</figcaption>
</figure>`
}
