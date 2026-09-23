/**
 * Real Wikimedia Commons maps for „Vom Stadtstaat zum Weltreich (Mare Nostrum)“.
 * Bundled under public/maps/ for stable offline use; full attribution below.
 */

/** Visible + explanation attribution (CC BY-SA / Public Domain). */
export const ROM_MAP_ATTRIBUTION =
  'Karten: (1) Varana, „Extent of the Roman Republic and the Roman Empire between 218 BC and 117 AD“, Wikimedia Commons, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Extent_of_the_Roman_Republic_and_the_Roman_Empire_between_218_BC_and_117_AD.png · (2) Javierfv1212, „Roman conquest of Italy“, Wikimedia Commons, Public Domain — https://commons.wikimedia.org/wiki/File:Roman_conquest_of_Italy.PNG'

export const ROM_MAP_QUELLE = {
  quelle: 'Wikimedia Commons · Varana (CC BY-SA 3.0) / Javierfv1212 (Public Domain)',
  url: 'https://commons.wikimedia.org/wiki/File:Extent_of_the_Roman_Republic_and_the_Roman_Empire_between_218_BC_and_117_AD.png',
} as const

/** Legend phases of the Varana extent map (colors as on the Commons file). */
export const ROM_MAP_PHASES = {
  p218: {
    fill: '#7a1515',
    label: 'Dunkelrot: 218 v. Chr.',
    meaning: 'Kerngebiet vor dem Zweiten Punischen Krieg',
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

export type RomMapKind = 'extent' | 'italy'

const EXTENT_SRC = '/maps/roman-extent-218bc-117ad-varana-1280.png'
const ITALY_SRC = '/maps/roman-conquest-of-italy.png'

const EXTENT_CAPTION =
  'Varana: Ausdehnung der römischen Republik und des Römischen Reichs 218 v. Chr.–117 n. Chr. (CC BY-SA 3.0)'
const ITALY_CAPTION =
  'Javierfv1212: Eroberung Italiens durch Rom (Public Domain)'

/**
 * HTML figure with the real Commons map (img), optional focus hint for a phase,
 * and a short license line under the image.
 */
export function romanExpansionMapHtml(
  kind: RomMapKind = 'extent',
  focus?: RomMapPhase | 'mare' | 'all',
): string {
  const src = kind === 'italy' ? ITALY_SRC : EXTENT_SRC
  const alt =
    kind === 'italy'
      ? 'Historische Karte: Eroberung Italiens durch Rom'
      : 'Historische Karte: Ausdehnung Roms vom Mittelmeer bis Trajan'
  const caption = kind === 'italy' ? ITALY_CAPTION : EXTENT_CAPTION

  let hint = ''
  if (kind === 'extent' && focus && focus !== 'all') {
    if (focus === 'mare') {
      hint =
        '<p style="margin:0 0 8px;font-size:0.95rem;line-height:1.35"><strong>Blick auf die Karte:</strong> Spätere Farben (gelb/grün) umschließen das Mittelmeer — Mare Nostrum („unser Meer“).</p>'
    } else {
      const p = ROM_MAP_PHASES[focus]
      hint = `<p style="margin:0 0 8px;font-size:0.95rem;line-height:1.35"><strong>Legende beachten:</strong> ${p.label} — ${p.meaning}.</p>`
    }
  } else if (kind === 'italy') {
    hint =
      '<p style="margin:0 0 8px;font-size:0.95rem;line-height:1.35"><strong>Blick auf die Karte:</strong> Rom wird Landmacht auf der italienischen Halbinsel (Zahlen = Jahre v. Chr.).</p>'
  } else {
    hint =
      '<p style="margin:0 0 8px;font-size:0.95rem;line-height:1.35"><strong>Gesamtkarte:</strong> Farben zeigen Wachstumsschritte vom Kern (dunkelrot) zur größten Ausdehnung (grün) — Weg zum Mare Nostrum.</p>'
  }

  return `<figure style="margin:0;max-width:100%;text-align:center">
  ${hint}
  <img src="${src}" alt="${alt}" style="display:block;max-width:100%;width:100%;height:auto;margin:0 auto;border-radius:4px" loading="lazy" decoding="async"/>
  <figcaption style="margin-top:8px;font-size:0.72rem;line-height:1.35;opacity:0.85;text-align:left">${caption}</figcaption>
</figure>`
}
