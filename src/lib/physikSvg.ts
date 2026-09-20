/** Compact SVG helpers for Physik Klasse 6 tasks. */

export function lightShadowSvg(opts: {
  lampLeft: boolean
  /** Shadow side relative to object: 'left' | 'right' */
  shadowSide: 'left' | 'right'
  /** When false, only lamp + Körper (for „wo liegt der Schatten?“). */
  showShadow?: boolean
}): string {
  const lampX = opts.lampLeft ? 70 : 410
  const objX = 240
  const shadowX = opts.shadowSide === 'left' ? 120 : 360
  return lightShadowSceneSvg({
    lampX,
    objX,
    shadowX,
    showShadow: opts.showShadow !== false,
  })
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
  showShadow?: boolean
}): string {
  const { lampX, objX, shadowX, caption, showShadow = true } = opts
  const shadow = showShadow
    ? `<ellipse cx="${shadowX}" cy="140" rx="52" ry="12" fill="#020617" opacity="0.9"/>
  <text x="${shadowX}" y="126" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="system-ui,sans-serif">Schatten</text>`
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 180" width="480" height="180" role="img" aria-label="Lampe und Gegenstand">
  <rect x="0" y="0" width="480" height="180" fill="#0f172a"/>
  <line x1="24" y1="142" x2="456" y2="142" stroke="#64748b" stroke-width="2"/>
  <circle cx="${lampX}" cy="48" r="16" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
  <text x="${lampX}" y="28" text-anchor="middle" fill="#fde68a" font-size="12" font-family="system-ui,sans-serif">Lampe</text>
  <rect x="${objX}" y="78" width="32" height="64" rx="3" fill="#94a3b8" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="${objX + 16}" y="164" text-anchor="middle" fill="#cbd5e1" font-size="12" font-family="system-ui,sans-serif">Körper</text>
  ${shadow}
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
  const yTop = 28
  const yBot = 268
  const fillH = (yBot - yTop) * t
  const yFill = yBot - fillH
  const tubeX = 70
  const tubeW = 26
  const yAt = (v: number) => yBot - ((v - min) / (max - min)) * (yBot - yTop)
  const ticks: string[] = []
  for (let v = min; v <= max; v += 5) {
    const y = yAt(v)
    const major = v % 20 === 0 || v === min || v === max
    const mid = v % 10 === 0
    const len = major ? 16 : mid ? 11 : 6
    ticks.push(
      `<line x1="${tubeX + tubeW}" y1="${y}" x2="${tubeX + tubeW + len}" y2="${y}" stroke="#334155" stroke-width="${major ? 2 : 1}"/>`,
    )
    if (major) {
      ticks.push(
        `<text x="${tubeX + tubeW + len + 5}" y="${y + 4}" fill="#334155" font-size="12" font-family="system-ui,sans-serif">${v} °C</text>`,
      )
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 320" width="200" height="320" role="img" aria-label="Thermometer">
  <rect width="200" height="320" fill="#f8fafc"/>
  <rect x="${tubeX}" y="${yTop - 4}" width="${tubeW}" height="${yBot - yTop + 8}" rx="${tubeW / 2}" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
  <rect x="${tubeX + 5}" y="${yFill}" width="${tubeW - 10}" height="${fillH}" fill="#ef4444"/>
  <circle cx="${tubeX + tubeW / 2}" cy="${yBot + 20}" r="20" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
  ${ticks.join('\n  ')}
</svg>`
}

/**
 * Weg-Zeit-Diagramm (s–t): gleichförmige Bewegung als Gerade vom Ursprung,
 * optional mit Hilfslinie bei einer Ablesezeit `markT`.
 */
export function wegZeitDiagramSvg(opts: {
  /** Geschwindigkeit in m/s (Steigung). */
  v: number
  /** Zeitachse bis tMax (s). */
  tMax: number
  /** Optional: vertikale Hilfslinie bei dieser Zeit (s). */
  markT?: number
  /** Optional: Beschriftung der Endpunkt-Koordinaten. */
  showEndLabels?: boolean
}): string {
  const { v, tMax } = opts
  const sMax = v * tMax
  const W = 340
  const H = 240
  const padL = 48
  const padR = 28
  const padT = 24
  const padB = 40
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const toX = (t: number) => padL + (t / tMax) * plotW
  const toY = (s: number) => padT + plotH - (s / sMax) * plotH
  const x0 = toX(0)
  const y0 = toY(0)
  const x1 = toX(tMax)
  const y1 = toY(sMax)
  const ticks: string[] = []
  for (let t = 0; t <= tMax; t++) {
    const x = toX(t)
    ticks.push(
      `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + 5}" stroke="#64748b" stroke-width="1"/>`,
      `<text x="${x}" y="${y0 + 18}" text-anchor="middle" fill="#475569" font-size="11" font-family="system-ui,sans-serif">${t}</text>`,
    )
  }
  const sStep = sMax <= 10 ? 2 : sMax <= 20 ? 5 : 10
  for (let s = 0; s <= sMax; s += sStep) {
    const y = toY(s)
    ticks.push(
      `<line x1="${x0 - 5}" y1="${y}" x2="${x0}" y2="${y}" stroke="#64748b" stroke-width="1"/>`,
      `<text x="${x0 - 8}" y="${y + 4}" text-anchor="end" fill="#475569" font-size="11" font-family="system-ui,sans-serif">${s}</text>`,
    )
  }
  let mark = ''
  if (opts.markT != null && opts.markT > 0 && opts.markT <= tMax) {
    const mx = toX(opts.markT)
    const my = toY(v * opts.markT)
    mark = `
  <line x1="${mx}" y1="${y0}" x2="${mx}" y2="${my}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3"/>
  <line x1="${x0}" y1="${my}" x2="${mx}" y2="${my}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3"/>
  <circle cx="${mx}" cy="${my}" r="4" fill="#2563eb"/>`
  }
  const endLabels = opts.showEndLabels
    ? `<text x="${x1 + 4}" y="${y1 + 4}" fill="#1e40af" font-size="11" font-family="system-ui,sans-serif">(${tMax}|${sMax})</text>`
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Weg-Zeit-Diagramm">
  <rect width="${W}" height="${H}" fill="#f8fafc"/>
  <line x1="${x0}" y1="${padT}" x2="${x0}" y2="${y0}" stroke="#334155" stroke-width="2"/>
  <line x1="${x0}" y1="${y0}" x2="${W - padR}" y2="${y0}" stroke="#334155" stroke-width="2"/>
  <polygon points="${x0},${padT} ${x0 - 5},${padT + 10} ${x0 + 5},${padT + 10}" fill="#334155"/>
  <polygon points="${W - padR},${y0} ${W - padR - 10},${y0 - 5} ${W - padR - 10},${y0 + 5}" fill="#334155"/>
  <text x="${x0 - 14}" y="${padT + 8}" text-anchor="middle" fill="#0f172a" font-size="13" font-family="system-ui,sans-serif" font-weight="600">s (m)</text>
  <text x="${W - padR}" y="${y0 + 32}" text-anchor="end" fill="#0f172a" font-size="13" font-family="system-ui,sans-serif" font-weight="600">t (s)</text>
  ${ticks.join('\n  ')}
  <line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="#2563eb" stroke-width="3"/>
  <circle cx="${x1}" cy="${y1}" r="3.5" fill="#1d4ed8"/>
  ${endLabels}${mark}
</svg>`
}

/** Vergleich: Ruhe / gleichförmig / beschleunigt (drei Mini-Diagramme). */
export function wegZeitCompareSvg(highlight: 'rest' | 'uniform' | 'accel'): string {
  const box = (x: number, kind: 'rest' | 'uniform' | 'accel', label: string) => {
    const on = kind === highlight
    const stroke = on ? '#2563eb' : '#94a3b8'
    const sw = on ? 3 : 1.5
    const path =
      kind === 'rest'
        ? 'M20 70 H100'
        : kind === 'uniform'
          ? 'M20 90 L100 20'
          : 'M20 90 Q60 70 100 15'
    return `<g transform="translate(${x},0)">
  <rect x="4" y="4" width="112" height="112" rx="8" fill="#fff" stroke="${on ? '#93c5fd' : '#e2e8f0'}" stroke-width="2"/>
  <line x1="20" y1="20" x2="20" y2="90" stroke="#64748b" stroke-width="1.5"/>
  <line x1="20" y1="90" x2="100" y2="90" stroke="#64748b" stroke-width="1.5"/>
  <path d="${path}" fill="none" stroke="${stroke}" stroke-width="${sw}"/>
  <text x="60" y="128" text-anchor="middle" fill="#334155" font-size="12" font-family="system-ui,sans-serif">${label}</text>
</g>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 140" width="360" height="140" role="img" aria-label="Weg-Zeit-Vergleich">
  <rect width="360" height="140" fill="#f8fafc"/>
  ${box(8, 'rest', 'A')}
  ${box(124, 'uniform', 'B')}
  ${box(240, 'accel', 'C')}
</svg>`
}

export function circuitSvg(closed: boolean): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150" width="300" height="150" role="img" aria-label="Einfacher Stromkreis">
  <rect width="300" height="150" fill="#f8fafc"/>
  ${batteryOnRail(40, 75)}
  <path d="M40 47 V36 H110" stroke="#334155" stroke-width="2.5" fill="none"/>
  ${
    closed
      ? `<circle cx="110" cy="36" r="3.5" fill="#334155"/>
  <path d="M110 36 H160" stroke="#334155" stroke-width="2.5" fill="none"/>
  <circle cx="160" cy="36" r="3.5" fill="#334155"/>`
      : `<circle cx="110" cy="36" r="3.5" fill="#334155"/>
  <path d="M110 36 L148 20" stroke="#334155" stroke-width="2.5" fill="none"/>
  <circle cx="160" cy="36" r="3.5" fill="#334155"/>`
  }
  <path d="M160 36 H200" stroke="#334155" stroke-width="2.5" fill="none"/>
  ${lampGlyph(220, 36)}
  <path d="M236 36 H270 V114 H40 V${75 + 28}" stroke="#334155" stroke-width="2.5" fill="none"/>
</svg>`
}

/** School-style Schaltsymbole (IEC-like, original line art — no textbook scans). */
export type CircuitSymbolKind =
  | 'battery'
  | 'lamp'
  | 'switchOpen'
  | 'switchClosed'
  | 'resistor'
  | 'motor'
  | 'buzzer'
  | 'ammeter'
  | 'voltmeter'

const SYMBOL_LABEL: Record<CircuitSymbolKind, string> = {
  battery: 'Batterie / Spannungsquelle',
  lamp: 'Lampe',
  switchOpen: 'Schalter (offen)',
  switchClosed: 'Schalter (geschlossen)',
  resistor: 'Widerstand',
  motor: 'Motor',
  buzzer: 'Summer / Klingel',
  ammeter: 'Amperemeter',
  voltmeter: 'Voltmeter',
}

export function circuitSymbolLabel(kind: CircuitSymbolKind): string {
  return SYMBOL_LABEL[kind]
}

export function circuitSymbolSvg(kind: CircuitSymbolKind): string {
  const body = (() => {
    switch (kind) {
      case 'battery':
        return `
  <path d="M40 80 H90" stroke="#334155" stroke-width="3" fill="none"/>
  <path d="M90 55 V105" stroke="#334155" stroke-width="4" fill="none"/>
  <path d="M105 65 V95" stroke="#334155" stroke-width="3" fill="none"/>
  <path d="M105 80 H160" stroke="#334155" stroke-width="3" fill="none"/>
  <text x="100" y="42" text-anchor="middle" fill="#64748b" font-size="12" font-family="system-ui,sans-serif">+</text>
  <text x="78" y="128" text-anchor="middle" fill="#64748b" font-size="12" font-family="system-ui,sans-serif">−</text>`
      case 'lamp':
        return `
  <path d="M40 80 H70" stroke="#334155" stroke-width="3" fill="none"/>
  <circle cx="100" cy="80" r="28" fill="#fffbeb" stroke="#334155" stroke-width="3"/>
  <path d="M82 62 L118 98 M118 62 L82 98" stroke="#334155" stroke-width="2.5" fill="none"/>
  <path d="M130 80 H160" stroke="#334155" stroke-width="3" fill="none"/>`
      case 'switchOpen':
        return `
  <path d="M40 80 H80" stroke="#334155" stroke-width="3" fill="none"/>
  <circle cx="80" cy="80" r="5" fill="#334155"/>
  <path d="M80 80 L130 55" stroke="#334155" stroke-width="3" fill="none"/>
  <circle cx="140" cy="80" r="5" fill="#334155"/>
  <path d="M140 80 H160" stroke="#334155" stroke-width="3" fill="none"/>`
      case 'switchClosed':
        return `
  <path d="M40 80 H80" stroke="#334155" stroke-width="3" fill="none"/>
  <circle cx="80" cy="80" r="5" fill="#334155"/>
  <path d="M80 80 H140" stroke="#334155" stroke-width="3" fill="none"/>
  <circle cx="140" cy="80" r="5" fill="#334155"/>
  <path d="M140 80 H160" stroke="#334155" stroke-width="3" fill="none"/>`
      case 'resistor':
        return `
  <path d="M40 80 H60" stroke="#334155" stroke-width="3" fill="none"/>
  <rect x="60" y="62" width="80" height="36" fill="#f8fafc" stroke="#334155" stroke-width="3"/>
  <path d="M140 80 H160" stroke="#334155" stroke-width="3" fill="none"/>`
      case 'motor':
        return `
  <path d="M40 80 H70" stroke="#334155" stroke-width="3" fill="none"/>
  <circle cx="100" cy="80" r="28" fill="#eff6ff" stroke="#334155" stroke-width="3"/>
  <text x="100" y="86" text-anchor="middle" fill="#1e3a8a" font-size="22" font-family="system-ui,sans-serif" font-weight="700">M</text>
  <path d="M130 80 H160" stroke="#334155" stroke-width="3" fill="none"/>`
      case 'buzzer':
        return `
  <path d="M40 80 H70" stroke="#334155" stroke-width="3" fill="none"/>
  <path d="M70 55 H110 L130 80 L110 105 H70 Z" fill="#fef3c7" stroke="#334155" stroke-width="3"/>
  <path d="M130 80 H160" stroke="#334155" stroke-width="3" fill="none"/>`
      case 'ammeter':
        return `
  <path d="M40 80 H70" stroke="#334155" stroke-width="3" fill="none"/>
  <circle cx="100" cy="80" r="28" fill="#ecfdf5" stroke="#334155" stroke-width="3"/>
  <text x="100" y="88" text-anchor="middle" fill="#065f46" font-size="24" font-family="system-ui,sans-serif" font-weight="700">A</text>
  <path d="M130 80 H160" stroke="#334155" stroke-width="3" fill="none"/>`
      case 'voltmeter':
        return `
  <path d="M40 80 H70" stroke="#334155" stroke-width="3" fill="none"/>
  <circle cx="100" cy="80" r="28" fill="#f5f3ff" stroke="#334155" stroke-width="3"/>
  <text x="100" y="88" text-anchor="middle" fill="#5b21b6" font-size="24" font-family="system-ui,sans-serif" font-weight="700">V</text>
  <path d="M130 80 H160" stroke="#334155" stroke-width="3" fill="none"/>`
    }
  })()
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="200" height="160" role="img" aria-label="Schaltsymbol">
  <rect width="200" height="160" fill="#f8fafc"/>
  ${body}
</svg>`
}

/** Official-style Glühlampe (Kreis mit X). */
function lampGlyph(cx: number, cy: number, r = 16): string {
  const d = r * 0.72
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fffbeb" stroke="#334155" stroke-width="2.5"/>
  <path d="M${cx - d} ${cy - d} L${cx + d} ${cy + d} M${cx + d} ${cy - d} L${cx - d} ${cy + d}" stroke="#334155" stroke-width="2.5" fill="none"/>`
}

/** Spannungsquelle on a vertical rail (long + / short − bars). */
function batteryOnRail(x: number, cy: number): string {
  return `<path d="M${x} ${cy - 28} V${cy - 10}" stroke="#334155" stroke-width="2.5" fill="none"/>
  <path d="M${x - 16} ${cy - 10} H${x + 16}" stroke="#334155" stroke-width="3" fill="none"/>
  <path d="M${x - 9} ${cy + 6} H${x + 9}" stroke="#334155" stroke-width="5" fill="none"/>
  <path d="M${x} ${cy + 6} V${cy + 28}" stroke="#334155" stroke-width="2.5" fill="none"/>
  <text x="${x + 22}" y="${cy - 6}" fill="#64748b" font-size="14" font-family="system-ui,sans-serif">+</text>
  <text x="${x + 22}" y="${cy + 14}" fill="#64748b" font-size="14" font-family="system-ui,sans-serif">−</text>`
}

/** Open switch on a horizontal wire (hinged lever). */
function openSwitch(x0: number, x1: number, y: number): string {
  const mid = (x0 + x1) / 2
  return `<path d="M${x0} ${y} H${mid - 14}" stroke="#334155" stroke-width="2.5" fill="none"/>
  <circle cx="${mid - 14}" cy="${y}" r="3.5" fill="#334155"/>
  <path d="M${mid - 14} ${y} L${mid + 18} ${y - 16}" stroke="#334155" stroke-width="2.5" fill="none"/>
  <circle cx="${mid + 14}" cy="${y}" r="3.5" fill="#334155"/>
  <path d="M${mid + 14} ${y} H${x1}" stroke="#334155" stroke-width="2.5" fill="none"/>`
}

/**
 * Reihe / Parallel as school Schaltbilder (IEC-like).
 * No solution captions — pupils must read the topology themselves.
 */
export function seriesParallelSvg(kind: 'series' | 'parallel'): string {
  if (kind === 'series') {
    // One loop: battery left, switch top, two lamps in series on the top rail.
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160" width="320" height="160" role="img" aria-label="Reihenschaltung">
  <rect width="320" height="160" fill="#f8fafc"/>
  ${batteryOnRail(40, 80)}
  <path d="M40 52 V36 H90" stroke="#334155" stroke-width="2.5" fill="none"/>
  ${openSwitch(90, 150, 36)}
  <path d="M150 36 H170" stroke="#334155" stroke-width="2.5" fill="none"/>
  ${lampGlyph(186, 36)}
  <path d="M202 36 H218" stroke="#334155" stroke-width="2.5" fill="none"/>
  ${lampGlyph(234, 36)}
  <path d="M250 36 H280 V108 H40" stroke="#334155" stroke-width="2.5" fill="none"/>
</svg>`
  }
  // Parallel: after the switch, two vertical branches each with one lamp (own Zweig).
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" width="320" height="180" role="img" aria-label="Parallelschaltung">
  <rect width="320" height="180" fill="#f8fafc"/>
  ${batteryOnRail(40, 90)}
  <path d="M40 62 V40 H90" stroke="#334155" stroke-width="2.5" fill="none"/>
  ${openSwitch(90, 150, 40)}
  <path d="M150 40 H200" stroke="#334155" stroke-width="2.5" fill="none"/>
  <path d="M200 40 V64" stroke="#334155" stroke-width="2.5" fill="none"/>
  ${lampGlyph(200, 82)}
  <path d="M200 98 V140" stroke="#334155" stroke-width="2.5" fill="none"/>
  <path d="M200 40 H260" stroke="#334155" stroke-width="2.5" fill="none"/>
  <path d="M260 40 V64" stroke="#334155" stroke-width="2.5" fill="none"/>
  ${lampGlyph(260, 82)}
  <path d="M260 98 V140 H40 V118" stroke="#334155" stroke-width="2.5" fill="none"/>
  <path d="M200 140 H260" stroke="#334155" stroke-width="2.5" fill="none"/>
</svg>`
}

function bodyDisk(
  cx: number,
  cy: number,
  r: number,
  fill: string,
  label: string,
): string {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#334155" stroke-width="2"/>
  <text x="${cx}" y="${cy + r + 16}" text-anchor="middle" fill="#475569" font-size="12" font-family="system-ui,sans-serif">${label}</text>`
}

/** Anordnung Sonne–Mond–Erde bei Finsternis (ohne Lösungstext). */
export function eclipseArrangementSvg(kind: 'solar' | 'lunar'): string {
  const label = kind === 'solar' ? 'Anordnung A' : 'Anordnung B'
  if (kind === 'solar') {
    // Sonne — Mond — Erde
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 140" width="360" height="140" role="img" aria-label="${label}">
  <rect width="360" height="140" fill="#f8fafc"/>
  ${bodyDisk(55, 58, 28, '#fde68a', 'Sonne')}
  ${bodyDisk(175, 58, 14, '#cbd5e1', 'Mond')}
  ${bodyDisk(290, 58, 22, '#93c5fd', 'Erde')}
  <path d="M85 58 H155 M195 58 H262" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
</svg>`
  }
  // Sonne — Erde — Mond
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 140" width="360" height="140" role="img" aria-label="${label}">
  <rect width="360" height="140" fill="#f8fafc"/>
  ${bodyDisk(55, 58, 28, '#fde68a', 'Sonne')}
  ${bodyDisk(175, 58, 22, '#93c5fd', 'Erde')}
  ${bodyDisk(295, 58, 14, '#cbd5e1', 'Mond')}
  <path d="M85 58 H147 M203 58 H275" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
</svg>`
}

export type MoonPhaseKind = 'new' | 'full' | 'waxing' | 'waning'

/**
 * Stellung Sonne–Erde–Mond (Draufsicht). Sonne links; Mondposition zeigt die Phase.
 * Keine Phasenbezeichnung im Bild — die soll der Schüler nennen.
 */
export function moonPhaseSvg(kind: MoonPhaseKind): string {
  const sun = bodyDisk(48, 80, 22, '#fde68a', 'Sonne')
  const earth = bodyDisk(180, 80, 20, '#93c5fd', 'Erde')
  // Orbit hint
  const orbit = `<circle cx="180" cy="80" r="70" fill="none" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="3 3"/>`
  const moonAt = (cx: number, cy: number) => bodyDisk(cx, cy, 12, '#e2e8f0', 'Mond')
  const moon =
    kind === 'new'
      ? moonAt(110, 80) // between Sun and Earth
      : kind === 'full'
        ? moonAt(250, 80) // opposite Sun
        : kind === 'waxing'
          ? moonAt(180, 22) // first quarter-ish (above)
          : moonAt(180, 138) // last quarter-ish (below)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 180" width="300" height="180" role="img" aria-label="Stellung Sonne Erde Mond">
  <rect width="300" height="180" fill="#f8fafc"/>
  ${orbit}
  ${sun}
  ${earth}
  ${moon}
</svg>`
}
