/**
 * Real Wikimedia Commons maps for „Vom Stadtstaat zum Weltreich (Mare Nostrum)“.
 * Bundled under public/maps/ for stable offline use; full attribution below.
 *
 * Phase → map:
 * - Stadtstaat / archaisches Latium → Renato (500 v. Chr.)
 * - Expansion auf der italienischen Halbinsel (vor 218) → Javierfv1212
 * - Westmittelmeer / Mare Nostrum / Kaiserreich (ab 218 v. Chr.) → Varana
 */

/** Per-map citation (author, title, year, license + links) for captions / explanations. */
export const ROM_MAP_CITATIONS = {
  stadtstaat:
    'Renato de Carvalho Ferreira: „Roma Antiga - 500 a.C.“ (2014). Wikimedia Commons, CC0 1.0 — https://creativecommons.org/publicdomain/zero/1.0/ · https://commons.wikimedia.org/wiki/File:Roma_Antiga_-_500_a.C..svg',
  italy:
    'Javierfv1212: „Roman conquest of Italy“ (2009). Wikimedia Commons, Public Domain — https://commons.wikimedia.org/wiki/File:Roman_conquest_of_Italy.PNG',
  extent:
    'Varana: „Extent of the Roman Republic and the Roman Empire between 218 BC and 117 AD“ (2006). Wikimedia Commons, CC BY-SA 3.0 — https://creativecommons.org/licenses/by-sa/3.0/ · https://commons.wikimedia.org/wiki/File:Extent_of_the_Roman_Republic_and_the_Roman_Empire_between_218_BC_and_117_AD.png (ShareAlike: abgeleitete Werke unter gleicher oder kompatibler Lizenz)',
} as const

/** Visible + explanation attribution (all three maps). */
export const ROM_MAP_ATTRIBUTION = `Karten: (1) ${ROM_MAP_CITATIONS.stadtstaat} · (2) ${ROM_MAP_CITATIONS.italy} · (3) ${ROM_MAP_CITATIONS.extent}`

export const ROM_MAP_QUELLE = {
  quelle: 'Wikimedia Commons · Renato (CC0 1.0) / Javierfv1212 (Public Domain) / Varana (CC BY-SA 3.0)',
  url: 'https://commons.wikimedia.org/wiki/File:Roma_Antiga_-_500_a.C..svg',
} as const

/** Latium-Karte (Renato): Legende „Expansão territorial“ — Grün / Gelb / Orange-Rot. */
export const LATIUM_MAP_PHASES = {
  p753: {
    fill: '#3a8a4a',
    colorAsk: 'die grüne Farbe',
    colorShort: 'Grün',
    year: '753 v. Chr.',
    choice: '753 v. Chr. — Gründung / kleines Gebiet um Rom',
    meaning: 'Gebiet um 753 v. Chr. (Gründungssage — kleinster Kern um Rom)',
  },
  p700: {
    fill: '#e8c838',
    colorAsk: 'die gelbe Farbe',
    colorShort: 'Gelb',
    year: '700 v. Chr.',
    choice: '700 v. Chr. — erste Erweiterung um Rom',
    meaning: 'Gebiet um 700 v. Chr. (erste Erweiterung um Rom)',
  },
  p500: {
    fill: '#c45c2c',
    colorAsk: 'die orange-rote Farbe',
    colorShort: 'Orange/Rot',
    year: '500 v. Chr.',
    choice: '500 v. Chr. — größeres Gebiet in Latium',
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
    choice: '500 v. Chr. — früher Kern um Rom',
    meaning: 'Gebiet um 500 v. Chr. (früher Kern um Rom)',
  },
  p338: {
    colorAsk: 'die hellrote Farbe',
    colorShort: 'Hellrot',
    year: '338 v. Chr.',
    choice: '338 v. Chr. — nach dem Latinerkrieg',
    meaning: 'Gebiet um 338 v. Chr. (nach dem Latinerkrieg)',
  },
  p272: {
    colorAsk: 'die beige Farbe',
    colorShort: 'Beige',
    year: '272 v. Chr.',
    choice: '272 v. Chr. — nach dem Pyrrhoskrieg (Süditalien)',
    meaning: 'Gebiet um 272 v. Chr. (nach dem Pyrrhoskrieg — Süditalien)',
  },
  p218: {
    colorAsk: 'die hellgrüne Farbe',
    colorShort: 'Hellgrün',
    year: '218 v. Chr.',
    choice: '218 v. Chr. — Kerngebiet vor dem 2. Punischen Krieg',
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
    choice: '218 v. Chr. — Kerngebiet vor dem 2. Punischen Krieg',
    meaning: 'Gebiet um 218 v. Chr. (früheste Phase auf dieser Karte)',
  },
  p133: {
    fill: '#c45c5c',
    colorAsk: 'die hellrote Farbe',
    colorShort: 'Hellrot',
    year: '133 v. Chr.',
    label: 'Hellrot: 133 v. Chr.',
    choice: '133 v. Chr. — Vormacht nach den Kriegen im Westen',
    meaning: 'Gebiet um 133 v. Chr. (nach den großen Kriegen im Westen)',
  },
  p44: {
    fill: '#e07a28',
    colorAsk: 'die orange Farbe',
    colorShort: 'Orange',
    year: '44 v. Chr.',
    label: 'Orange: 44 v. Chr.',
    choice: '44 v. Chr. — späte Republik',
    meaning: 'Gebiet um 44 v. Chr. (späte Republik)',
  },
  p14: {
    fill: '#e8c838',
    colorAsk: 'die gelbe Farbe',
    colorShort: 'Gelb',
    year: '14 n. Chr.',
    label: 'Gelb: 14 n. Chr.',
    choice: '14 n. Chr. — Tod des Augustus',
    meaning: 'Gebiet um 14 n. Chr. (Tod des Augustus)',
  },
  p117: {
    fill: '#3a8a4a',
    colorAsk: 'die grüne Farbe',
    colorShort: 'Grün',
    year: '117 n. Chr.',
    label: 'Grün: 117 n. Chr.',
    choice: '117 n. Chr. — größte Ausdehnung unter Trajan',
    meaning: 'Gebiet um 117 n. Chr. (größte Ausdehnung unter Trajan)',
  },
} as const

export type RomMapPhase = keyof typeof ROM_MAP_PHASES

/** Three Commons maps: early city-state, Italian conquest, Mediterranean empire. */
export type RomMapKind = 'stadtstaat' | 'italy' | 'extent'

const STADTSTAAT_SRC = '/maps/roma-antiga-500bc.png'
const ITALY_SRC = '/maps/roman-conquest-of-italy.png'
const EXTENT_SRC = '/maps/roman-extent-218bc-117ad-varana-1280.png'

/**
 * HTML figure with the real Commons map (img) and attribution under the map only.
 * No tip/spoiler captions above the image — pupils read the legend themselves.
 */
export function romanExpansionMapHtml(
  kind: RomMapKind = 'extent',
  _focus?: RomMapPhase | 'mare' | 'all' | 'stadtstaat' | 'italy' | LatiumMapPhase | ItalyMapPhase,
): string {
  const src = kind === 'stadtstaat' ? STADTSTAAT_SRC : kind === 'italy' ? ITALY_SRC : EXTENT_SRC
  const alt =
    kind === 'stadtstaat'
      ? 'Historische Karte: frühes Rom in Latium (Farben = Jahre und Phasen)'
      : kind === 'italy'
        ? 'Historische Karte: Eroberung Italiens durch Rom (Farben = Jahre und Phasen)'
        : 'Historische Karte: Ausdehnung Roms (Farben = Jahre und Phasen)'
  const caption = ROM_MAP_CITATIONS[kind]

  return `<figure style="margin:0;max-width:100%;text-align:center">
  <img src="${src}" alt="${alt}" style="display:block;max-width:100%;width:100%;height:auto;margin:0 auto;border-radius:4px" loading="lazy" decoding="async"/>
  <figcaption style="margin-top:8px;font-size:0.72rem;line-height:1.35;opacity:0.85;text-align:left">${caption}</figcaption>
</figure>`
}
