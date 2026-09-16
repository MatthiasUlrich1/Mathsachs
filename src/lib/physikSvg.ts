/** Compact SVG helpers for Physik Klasse 6 tasks. */

export function lightShadowSvg(opts: {
  lampLeft: boolean
  /** Shadow side relative to object: 'left' | 'right' */
  shadowSide: 'left' | 'right'
}): string {
  const lampX = opts.lampLeft ? 40 : 260
  const objX = 150
  const shadowX = opts.shadowSide === 'left' ? 70 : 175
  return lightShadowSceneSvg({ lampX, objX, shadowX })
}

/** Live preview for lamp-position slider (object fixed at center). */
export function lightShadowFromLampParam(lampX: number): string {
  const obj = 0
  const lampLeft = lampX < obj
  const shadowSide: 'left' | 'right' = lampLeft ? 'right' : 'left'
  // Map math x (−5…5) onto SVG coordinates.
  const toSvg = (x: number) => 150 + x * 22
  const lampSvg = toSvg(lampX)
  const shadowSvg = shadowSide === 'left' ? toSvg(-3.2) : toSvg(3.2)
  return lightShadowSceneSvg({
    lampX: lampSvg,
    objX: toSvg(0) - 14,
    shadowX: shadowSvg,
    caption: `Lampe x = ${String(lampX).replace('.', ',')}`,
  })
}

function lightShadowSceneSvg(opts: {
  lampX: number
  objX: number
  shadowX: number
  caption?: string
}): string {
  const { lampX, objX, shadowX, caption } = opts
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 160" width="300" height="160" role="img" aria-label="Lampe, Gegenstand und Schatten">
  <rect x="0" y="0" width="300" height="160" fill="#0f172a"/>
  <line x1="20" y1="130" x2="280" y2="130" stroke="#64748b" stroke-width="2"/>
  <circle cx="${lampX}" cy="45" r="14" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
  <text x="${lampX}" y="28" text-anchor="middle" fill="#fde68a" font-size="11" font-family="system-ui,sans-serif">Lampe</text>
  <rect x="${objX}" y="70" width="28" height="60" rx="3" fill="#94a3b8" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="${objX + 14}" y="150" text-anchor="middle" fill="#cbd5e1" font-size="11" font-family="system-ui,sans-serif">Körper</text>
  <ellipse cx="${shadowX}" cy="128" rx="42" ry="10" fill="#020617" opacity="0.85"/>
  <text x="${shadowX}" y="118" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="system-ui,sans-serif">Schatten</text>
  ${caption ? `<text x="150" y="18" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="system-ui,sans-serif">${caption}</text>` : ''}
</svg>`
}

/** Grid hint for a light ray through a slit (for questions; click UI is separate). */
export function lightRayHintSvg(opts: {
  from: { x: number; y: number }
  through: { x: number; y: number }
  label?: string
}): string {
  const { from, through, label } = opts
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 80" width="280" height="80" role="img" aria-label="Lichtstrahl-Hinweis">
  <rect width="280" height="80" fill="#f8fafc"/>
  <text x="12" y="24" fill="#334155" font-size="12" font-family="system-ui,sans-serif">${label ?? 'Licht läuft geradlinig durch den Spalt.'}</text>
  <text x="12" y="48" fill="#2563eb" font-size="12" font-family="system-ui,sans-serif">Lampe (${from.x}|${from.y}) → Spalt (${through.x}|${through.y}) → ?</text>
  <text x="12" y="68" fill="#64748b" font-size="11" font-family="system-ui,sans-serif">Tippe einen weiteren Gitterpunkt auf derselben Geraden.</text>
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
