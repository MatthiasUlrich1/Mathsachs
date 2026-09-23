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

/** Legend phases of the Varana extent map (colors as on the Commons file). Starts 218 BC — not Stadtstaat. */
export const ROM_MAP_PHASES = {
  p218: {
    fill: '#7a1515',
    label: 'Dunkelrot: 218 v. Chr.',
    meaning: 'Kerngebiet vor dem Zweiten Punischen Krieg (Varana beginnt hier — nicht Stadtstaat)',
  },
  p133: {
    fill: '#c45c5c',
    label: 'Hellrot: 133 v. Chr.',
    meaning: 'Nach den großen Kriegen im Westen — Vormacht ums Westmittelmeer',
  },
  p44: {
    fill: '#e07a28',
    label: 'Orange: 44 v. Chr.',
    meaning: 'Späte Republik (Tod Caesars)',
  },
  p14: {
    fill: '#e8c838',
    label: 'Gelb: 14 n. Chr.',
    meaning: 'Reich unter Augustus (Tod des Augustus)',
  },
  p117: {
    fill: '#3a8a4a',
    label: 'Grün: nach 14 / Trajan 117 n. Chr.',
    meaning: 'Weitere Erwerbungen bis zur größten Ausdehnung',
  },
} as const

export type RomMapPhase = keyof typeof ROM_MAP_PHASES

/** Three Commons maps: early city-state, Italian conquest, Mediterranean empire. */
export type RomMapKind = 'stadtstaat' | 'italy' | 'extent'

const STADTSTAAT_SRC = '/maps/roma-antiga-500bc.png'
const ITALY_SRC = '/maps/roman-conquest-of-italy.png'
const EXTENT_SRC = '/maps/roman-extent-218bc-117ad-varana-1280.png'

const STADTSTAAT_CAPTION =
  'Renato de Carvalho Ferreira: Römisches Gebiet um 500 v. Chr. (Stadtstaat/Latium), CC0 1.0'
const ITALY_CAPTION =
  'Javierfv1212: Eroberung Italiens durch Rom (ca. 500–218 v. Chr.), Public Domain'
const EXTENT_CAPTION =
  'Varana: Ausdehnung der römischen Republik und des Römischen Reichs 218 v. Chr.–117 n. Chr. (CC BY-SA 3.0) — beginnt erst 218 v. Chr.'

/**
 * HTML figure with the real Commons map (img), optional focus hint for a phase,
 * and a short license line under the image.
 */
export function romanExpansionMapHtml(
  kind: RomMapKind = 'extent',
  focus?: RomMapPhase | 'mare' | 'all' | 'stadtstaat' | 'italy',
): string {
  const src = kind === 'stadtstaat' ? STADTSTAAT_SRC : kind === 'italy' ? ITALY_SRC : EXTENT_SRC
  const alt =
    kind === 'stadtstaat'
      ? 'Historische Karte: Rom als Stadtstaat um 500 v. Chr. (Latium)'
      : kind === 'italy'
        ? 'Historische Karte: Eroberung Italiens durch Rom (vor 218 v. Chr.)'
        : 'Historische Karte: Ausdehnung Roms vom Mittelmeer bis Trajan (ab 218 v. Chr.)'
  const caption =
    kind === 'stadtstaat' ? STADTSTAAT_CAPTION : kind === 'italy' ? ITALY_CAPTION : EXTENT_CAPTION

  let hint = ''
  if (kind === 'stadtstaat') {
    hint =
      '<p style="margin:0 0 8px;font-size:0.95rem;line-height:1.35"><strong>Blick auf die Karte:</strong> Frühes Rom als Stadtstaat — kleines Gebiet am Tiber in Latium (Phasen bis ca. 500 v. Chr.).</p>'
  } else if (kind === 'italy') {
    hint =
      '<p style="margin:0 0 8px;font-size:0.95rem;line-height:1.35"><strong>Blick auf die Karte:</strong> Vom Stadtstaat zur Landmacht auf der italienischen Halbinsel (Zahlen = Jahre v. Chr., bis 218).</p>'
  } else if (focus && focus !== 'all') {
    if (focus === 'mare') {
      hint =
        '<p style="margin:0 0 8px;font-size:0.95rem;line-height:1.35"><strong>Blick auf die Karte:</strong> Spätere Farben (gelb/grün) umschließen das Mittelmeer — Mare Nostrum („unser Meer“). Diese Karte beginnt erst 218 v. Chr.</p>'
    } else if (focus === 'stadtstaat' || focus === 'italy') {
      hint =
        '<p style="margin:0 0 8px;font-size:0.95rem;line-height:1.35"><strong>Hinweis:</strong> Stadtstaat und frühe Italien-Expansion liegen <em>vor</em> 218 v. Chr. — dafür die anderen Karten (Latium / Italien).</p>'
    } else {
      const p = ROM_MAP_PHASES[focus]
      hint = `<p style="margin:0 0 8px;font-size:0.95rem;line-height:1.35"><strong>Legende beachten:</strong> ${p.label} — ${p.meaning}.</p>`
    }
  } else {
    hint =
      '<p style="margin:0 0 8px;font-size:0.95rem;line-height:1.35"><strong>Gesamtkarte (ab 218 v. Chr.):</strong> Farben zeigen Wachstumsschritte vom Kern (dunkelrot) zur größten Ausdehnung (grün). Stadtstaat und frühe Italien-Eroberung sind hier nicht dargestellt.</p>'
  }

  return `<figure style="margin:0;max-width:100%;text-align:center">
  ${hint}
  <img src="${src}" alt="${alt}" style="display:block;max-width:100%;width:100%;height:auto;margin:0 auto;border-radius:4px" loading="lazy" decoding="async"/>
  <figcaption style="margin-top:8px;font-size:0.72rem;line-height:1.35;opacity:0.85;text-align:left">${caption}</figcaption>
</figure>`
}
