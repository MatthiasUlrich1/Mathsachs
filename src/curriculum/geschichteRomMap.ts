/**
 * Educational schematic: Roman expansion around the Mediterranean (Mare Nostrum).
 * Phase colors inspired by Wikimedia Commons phased territory maps (city → Italy →
 * western Mediterranean after the Punic wars → Mare Nostrum).
 *
 * Attribution (CC BY-SA concept / phase idea):
 * Varana, „Extent of the Roman Republic and the Roman Empire between 218 BC and 117 AD“,
 * Wikimedia Commons, CC BY-SA — https://commons.wikimedia.org/wiki/File:Extent_of_the_Roman_Republic_and_the_Roman_Empire_between_218_BC_and_117_AD.png
 * This SVG is an original simplified classroom schematic (not a copy of that PNG).
 */

export const ROM_MAP_ATTRIBUTION =
  'Kartenphasen angelehnt an: Varana, „Extent of the Roman Republic and the Roman Empire…“, Wikimedia Commons (CC BY-SA). Schematische Schulkarte, keine exakte Grenzzeichnung.'

export const ROM_MAP_QUELLE = {
  quelle: 'Wikimedia Commons (Varana) · CC BY-SA',
  url: 'https://commons.wikimedia.org/wiki/File:Extent_of_the_Roman_Republic_and_the_Roman_Empire_between_218_BC_and_117_AD.png',
} as const

/** Colors for expansion phases (legend + regions). */
export const ROM_MAP_PHASES = {
  stadt: { fill: '#7a1f1f', label: 'Stadtstaat (Rom + Umland)' },
  italien: { fill: '#c45c26', label: 'Landmacht Italien' },
  west: { fill: '#e8a838', label: 'Westmittelmeer nach großen Kriegen' },
  mare: { fill: '#2f6b4f', label: 'Mare Nostrum (Vormacht)' },
} as const

export type RomMapHighlight = keyof typeof ROM_MAP_PHASES | 'all'

/**
 * Simplified Mediterranean outline with layered expansion fills.
 * highlight: show all phases, or emphasize one (others muted).
 */
export function romanExpansionMapSvg(highlight: RomMapHighlight = 'all'): string {
  const opacity = (key: keyof typeof ROM_MAP_PHASES) =>
    highlight === 'all' || highlight === key ? 1 : 0.22

  const { stadt, italien, west, mare } = ROM_MAP_PHASES

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" role="img" aria-label="Schematische Karte: Expansion Roms um das Mittelmeer">
  <rect width="640" height="360" fill="#eef4f8"/>
  <text x="320" y="22" text-anchor="middle" font-family="Georgia,serif" font-size="15" fill="#1a2a35">Rom: vom Stadtstaat zum Mare Nostrum</text>
  <!-- Sea basin -->
  <ellipse cx="320" cy="175" rx="250" ry="95" fill="#b9d4e8" stroke="#6a90a8" stroke-width="1.5"/>
  <text x="320" y="172" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="#3a5a70" font-style="italic">Mittelmeer</text>
  <!-- Phase 4: Mare Nostrum ring (outer coastal band) -->
  <path d="M90,130 C140,70 250,55 320,58 C400,55 500,75 545,125 C560,155 555,210 530,235 C480,280 380,295 320,292 C250,295 150,275 105,230 C80,200 75,160 90,130 Z"
        fill="${mare.fill}" fill-opacity="${opacity('mare') * 0.55}" stroke="${mare.fill}" stroke-width="1"/>
  <!-- Phase 3: West Mediterranean (west half stronger) -->
  <path d="M100,140 C150,95 220,100 260,130 C280,155 275,200 250,225 C200,255 130,245 110,200 C95,170 95,155 100,140 Z"
        fill="${west.fill}" fill-opacity="${opacity('west') * 0.85}" stroke="${west.fill}" stroke-width="1"/>
  <ellipse cx="195" cy="250" rx="42" ry="22" fill="${west.fill}" fill-opacity="${opacity('west') * 0.9}" stroke="${west.fill}" stroke-width="1"/>
  <text x="195" y="254" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#4a3010">N-Afrika</text>
  <!-- Sicily marker -->
  <ellipse cx="255" cy="228" rx="18" ry="10" fill="${west.fill}" fill-opacity="${opacity('west')}" stroke="#8a6010" stroke-width="0.8"/>
  <text x="255" y="231" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#3a2808">Sizilien</text>
  <!-- Phase 2: Italian peninsula -->
  <path d="M300,95 L318,100 L328,145 L335,190 L325,235 L312,250 L300,240 L295,200 L288,150 Z"
        fill="${italien.fill}" fill-opacity="${opacity('italien')}" stroke="#8a3a10" stroke-width="1.2"/>
  <text x="348" y="165" font-family="system-ui,sans-serif" font-size="10" fill="#5a2a08">Italien</text>
  <!-- Phase 1: City-state (Rome) -->
  <circle cx="308" cy="155" r="10" fill="${stadt.fill}" fill-opacity="${opacity('stadt')}" stroke="#3a0a0a" stroke-width="1.5"/>
  <text x="308" y="140" text-anchor="middle" font-family="Georgia,serif" font-size="11" font-weight="700" fill="${stadt.fill}">Rom</text>
  <!-- Legend -->
  <g font-family="system-ui,sans-serif" font-size="10" fill="#1a2a35">
    <rect x="24" y="288" width="14" height="10" fill="${stadt.fill}" rx="1"/>
    <text x="44" y="297">${stadt.label}</text>
    <rect x="24" y="306" width="14" height="10" fill="${italien.fill}" rx="1"/>
    <text x="44" y="315">${italien.label}</text>
    <rect x="24" y="324" width="14" height="10" fill="${west.fill}" rx="1"/>
    <text x="44" y="333">${west.label}</text>
    <rect x="24" y="342" width="14" height="10" fill="${mare.fill}" rx="1"/>
    <text x="44" y="351">${mare.label}</text>
  </g>
  <text x="620" y="352" text-anchor="end" font-family="system-ui,sans-serif" font-size="7.5" fill="#5a6a78">Schematisch · CC-BY-SA-Phasenidee (Commons)</text>
</svg>`
}
