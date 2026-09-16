/** Compact SVG helpers for Physik Klasse 6 tasks. */

export function lightShadowSvg(opts: {
  lampLeft: boolean
  /** Shadow side relative to object: 'left' | 'right' */
  shadowSide: 'left' | 'right'
}): string {
  const lampX = opts.lampLeft ? 70 : 410
  const objX = 240
  const shadowX = opts.shadowSide === 'left' ? 120 : 360
  return lightShadowSceneSvg({ lampX, objX, shadowX })
}

/** Live preview for lamp-position slider (object fixed at center). */
export function lightShadowFromLampParam(
  lampX: number,
  opts?: {
    /** Keep Schatten fixed (match-the-shadow tasks). */
    fixedShadowSide?: 'left' | 'right'
    showLampCaption?: boolean
  },
): string {
  const obj = 0
  const lampLeft = lampX < obj
  const shadowSide: 'left' | 'right' =
    opts?.fixedShadowSide ?? (lampLeft ? 'right' : 'left')
  // Map math x (−5…5) onto a wider SVG.
  const toSvg = (x: number) => 240 + x * 36
  const lampSvg = toSvg(lampX)
  const shadowSvg = shadowSide === 'left' ? toSvg(-3.5) : toSvg(3.5)
  return lightShadowSceneSvg({
    lampX: lampSvg,
    objX: toSvg(0) - 16,
    shadowX: shadowSvg,
    caption: opts?.showLampCaption ? `Lampe x = ${String(lampX).replace('.', ',')}` : undefined,
  })
}

function lightShadowSceneSvg(opts: {
  lampX: number
  objX: number
  shadowX: number
  caption?: string
}): string {
  const { lampX, objX, shadowX, caption } = opts
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 180" width="480" height="180" role="img" aria-label="Lampe, Gegenstand und Schatten">
  <rect x="0" y="0" width="480" height="180" fill="#0f172a"/>
  <line x1="24" y1="142" x2="456" y2="142" stroke="#64748b" stroke-width="2"/>
  <circle cx="${lampX}" cy="48" r="16" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
  <text x="${lampX}" y="28" text-anchor="middle" fill="#fde68a" font-size="12" font-family="system-ui,sans-serif">Lampe</text>
  <rect x="${objX}" y="78" width="32" height="64" rx="3" fill="#94a3b8" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="${objX + 16}" y="164" text-anchor="middle" fill="#cbd5e1" font-size="12" font-family="system-ui,sans-serif">Körper</text>
  <ellipse cx="${shadowX}" cy="140" rx="52" ry="12" fill="#020617" opacity="0.9"/>
  <text x="${shadowX}" y="126" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="system-ui,sans-serif">Schatten</text>
  ${caption ? `<text x="240" y="18" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="system-ui,sans-serif">${caption}</text>` : ''}
</svg>`
}

/** Grid hint for a light ray (Taschenlampe → Spalt); click UI is separate. */
export function lightRayHintSvg(opts: {
  from: { x: number; y: number }
  through: { x: number; y: number }
  label?: string
}): string {
  const { from, through, label } = opts
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 72" width="320" height="72" role="img" aria-label="Lichtstrahl-Hinweis">
  <rect width="320" height="72" fill="#f8fafc"/>
  <text x="12" y="22" fill="#334155" font-size="12" font-family="system-ui,sans-serif">${label ?? 'Taschenlampe auf Kästchenpapier: Licht läuft geradlinig.'}</text>
  <text x="12" y="44" fill="#2563eb" font-size="12" font-family="system-ui,sans-serif">Lampe (${from.x}|${from.y}) → Spalt (${through.x}|${through.y}) → verlängern</text>
  <text x="12" y="64" fill="#64748b" font-size="11" font-family="system-ui,sans-serif">Tippe einen weiteren Gitterpunkt auf dem Strahl. Bei Auflösung wird der Strahl eingezeichnet.</text>
</svg>`
}

/** Kern-/Halbschatten sketch (two lamps + obstacle) for MC questions. */
export function kernHalbschattenSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 160" width="360" height="160" role="img" aria-label="Kernschatten und Halbschatten">
  <rect width="360" height="160" fill="#e0f2fe"/>
  <circle cx="40" cy="40" r="10" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/>
  <circle cx="40" cy="120" r="10" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/>
  <text x="40" y="24" text-anchor="middle" font-size="10" fill="#334155">L1</text>
  <text x="40" y="148" text-anchor="middle" font-size="10" fill="#334155">L2</text>
  <rect x="150" y="55" width="28" height="50" fill="#1e3a8a"/>
  <text x="164" y="148" text-anchor="middle" font-size="10" fill="#334155">Hindernis</text>
  <polygon points="178,55 280,20 280,70" fill="#93c5fd" opacity="0.7"/>
  <polygon points="178,105 280,90 280,140" fill="#93c5fd" opacity="0.7"/>
  <polygon points="178,55 178,105 250,80" fill="#1e40af" opacity="0.85"/>
  <text x="300" y="45" font-size="11" fill="#1e3a8a">1 Halbschatten</text>
  <text x="300" y="85" font-size="11" fill="#1e3a8a">3 Kernschatten</text>
  <text x="300" y="125" font-size="11" fill="#1e3a8a">2 Halbschatten</text>
</svg>`
}

export function mirrorAngleSvg(incidentDeg: number): string {
  const rad = (incidentDeg * Math.PI) / 180
  const cx = 150
  const cy = 110
  const len = 70
  const ix = cx - Math.sin(rad) * len
  const iy = cy - Math.cos(rad) * len
  const rx = cx + Math.sin(rad) * len
  const ry = cy - Math.cos(rad) * len
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 160" width="300" height="160" role="img" aria-label="Spiegelung am ebenen Spiegel">
  <rect width="300" height="160" fill="#f8fafc"/>
  <line x1="40" y1="${cy}" x2="260" y2="${cy}" stroke="#334155" stroke-width="4"/>
  <text x="150" y="148" text-anchor="middle" fill="#475569" font-size="12" font-family="system-ui,sans-serif">Spiegel</text>
  <line x1="${cx}" y1="${cy}" x2="${cx}" y2="30" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3"/>
  <text x="${cx + 6}" y="42" fill="#64748b" font-size="10" font-family="system-ui,sans-serif">Lot</text>
  <line x1="${ix}" y1="${iy}" x2="${cx}" y2="${cy}" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arr)"/>
  <line x1="${cx}" y1="${cy}" x2="${rx}" y2="${ry}" stroke="#dc2626" stroke-width="2.5" marker-end="url(#arr2)"/>
  <defs>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker>
    <marker id="arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#dc2626"/></marker>
  </defs>
  <text x="55" y="55" fill="#2563eb" font-size="12" font-family="system-ui,sans-serif">Einfall ${incidentDeg}°</text>
  <text x="190" y="55" fill="#dc2626" font-size="12" font-family="system-ui,sans-serif">Ausfall ?</text>
</svg>`
}

export function thermometerSvg(celsius: number): string {
  const min = -20
  const max = 100
  const t = Math.max(0, Math.min(1, (celsius - min) / (max - min)))
  const yTop = 30
  const yBot = 130
  const fillH = (yBot - yTop) * t
  const yFill = yBot - fillH
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 170" width="160" height="170" role="img" aria-label="Thermometer">
  <rect width="160" height="170" fill="#f8fafc"/>
  <rect x="68" y="28" width="24" height="110" rx="12" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
  <rect x="72" y="${yFill}" width="16" height="${fillH}" fill="#ef4444"/>
  <circle cx="80" cy="140" r="16" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
  <text x="110" y="40" fill="#334155" font-size="11" font-family="system-ui,sans-serif">100 °C</text>
  <text x="110" y="95" fill="#334155" font-size="11" font-family="system-ui,sans-serif">0 °C</text>
  <text x="110" y="145" fill="#334155" font-size="11" font-family="system-ui,sans-serif">−20 °C</text>
</svg>`
}

export function circuitSvg(closed: boolean): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 140" width="280" height="140" role="img" aria-label="Einfacher Stromkreis">
  <rect width="280" height="140" fill="#f8fafc"/>
  <rect x="40" y="55" width="36" height="30" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
  <text x="58" y="48" text-anchor="middle" fill="#92400e" font-size="11" font-family="system-ui,sans-serif">Batterie</text>
  <circle cx="210" cy="70" r="18" fill="#fef9c3" stroke="#ca8a04" stroke-width="2"/>
  <text x="210" y="74" text-anchor="middle" fill="#854d0e" font-size="16" font-family="system-ui,sans-serif">💡</text>
  <text x="210" y="105" text-anchor="middle" fill="#64748b" font-size="11" font-family="system-ui,sans-serif">Lampe</text>
  <path d="M76 70 H120" stroke="#334155" stroke-width="3" fill="none"/>
  <path d="M160 70 H192" stroke="#334155" stroke-width="3" fill="none"/>
  <path d="M228 70 H250 V110 H40 V85" stroke="#334155" stroke-width="3" fill="none"/>
  ${
    closed
      ? `<path d="M120 70 H160" stroke="#334155" stroke-width="3" fill="none"/>
  <text x="140" y="58" text-anchor="middle" fill="#15803d" font-size="11" font-family="system-ui,sans-serif">Schalter zu</text>`
      : `<path d="M120 70 H140" stroke="#334155" stroke-width="3" fill="none"/>
  <path d="M148 58 H168" stroke="#334155" stroke-width="3" fill="none"/>
  <text x="148" y="48" text-anchor="middle" fill="#b91c1c" font-size="11" font-family="system-ui,sans-serif">Schalter offen</text>`
  }
</svg>`
}
