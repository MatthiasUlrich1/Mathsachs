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

export function circuitSvg(
  closed: boolean,
  device: 'Lampe' | 'Summer' | 'LED' = 'Lampe',
): string {
  const consumer =
    device === 'Summer'
      ? buzzerGlyph(220, 36)
      : device === 'LED'
        ? ledGlyph(220, 36)
        : lampGlyph(220, 36)
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
  ${consumer}
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

function circuitSymbolBody(kind: CircuitSymbolKind): string {
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
}

export function circuitSymbolSvg(kind: CircuitSymbolKind): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="200" height="160" role="img" aria-label="Schaltsymbol">
  <rect width="200" height="160" fill="#f8fafc"/>
  ${circuitSymbolBody(kind)}
</svg>`
}

/** Row of several Schaltsymbole (for multi-select / Messgerät tasks). */
export function circuitSymbolsRowSvg(kinds: CircuitSymbolKind[]): string {
  const n = Math.max(1, kinds.length)
  const cellW = 170
  const gap = 12
  const pad = 10
  const totalW = pad * 2 + n * cellW + (n - 1) * gap
  const totalH = 140
  const bodies = kinds
    .map((kind, i) => {
      const x = pad + i * (cellW + gap)
      return `<g transform="translate(${x - 10}, -5) scale(0.82)">${circuitSymbolBody(kind)}</g>`
    })
    .join('\n')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}" role="img" aria-label="Schaltsymbole">
  <rect width="${totalW}" height="${totalH}" fill="#f8fafc"/>
  ${bodies}
</svg>`
}

/** Official-style Glühlampe (Kreis mit X). */
function lampGlyph(cx: number, cy: number, r = 16): string {
  const d = r * 0.72
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fffbeb" stroke="#334155" stroke-width="2.5"/>
  <path d="M${cx - d} ${cy - d} L${cx + d} ${cy + d} M${cx + d} ${cy - d} L${cx - d} ${cy + d}" stroke="#334155" stroke-width="2.5" fill="none"/>`
}

/** Summer / Klingel (Trapez, school Schaltzeichen). */
function buzzerGlyph(cx: number, cy: number, r = 16): string {
  const w = r * 1.35
  const h = r * 1.1
  return `<path d="M${cx - w} ${cy - h} H${cx + w * 0.15} L${cx + w} ${cy} L${cx + w * 0.15} ${cy + h} H${cx - w} Z" fill="#fef3c7" stroke="#334155" stroke-width="2.5"/>`
}

/** LED (Dreieck + Querstrich). */
function ledGlyph(cx: number, cy: number, r = 16): string {
  return `<path d="M${cx - r} ${cy - r * 0.85} L${cx + r * 0.7} ${cy} L${cx - r} ${cy + r * 0.85} Z" fill="#ecfdf5" stroke="#334155" stroke-width="2.5"/>
  <path d="M${cx + r * 0.7} ${cy - r * 0.85} V${cy + r * 0.85}" stroke="#334155" stroke-width="2.5" fill="none"/>`
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

/** Lochkamera: Gegenstand → Öffnung → umgekehrtes Abbild auf dem Schirm. */
/** Intersection of the ray through `from`→`through` with the vertical line x = atX. */
function rayHitAtX(
  from: { x: number; y: number },
  through: { x: number; y: number },
  atX: number,
): { x: number; y: number } {
  const dx = through.x - from.x
  if (Math.abs(dx) < 1e-9) return { x: atX, y: from.y }
  const t = (atX - from.x) / dx
  return { x: atX, y: from.y + t * (through.y - from.y) }
}

export function lochkameraSvg(opts?: {
  showRays?: boolean
  showLabels?: boolean
  /** Gegenstandsgröße G, Gegenstandsweite g, Bildgröße B, Bildweite b */
  showSizes?: boolean
}): string {
  const showRays = opts?.showRays !== false
  const showLabels = opts?.showLabels !== false
  const showSizes = opts?.showSizes === true

  // Geometrie so, dass b < g → kleineres Abbild; Strahlen = echte Geraden durch die Öffnung
  const hole = { x: 200, y: 90 }
  const objTop = { x: 48, y: 44 } // Flammenspitze (Ellipse cy=58, ry=14)
  const objBot = { x: 48, y: 128 } // Kerzenfuß
  const screenX = 328
  const hitFromTop = rayHitAtX(objTop, hole, screenX) // → unten am Schirm (Bild umgedreht)
  const hitFromBot = rayHitAtX(objBot, hole, screenX) // → oben am Schirm

  // Ähnlichkeitsabbildung (180°-Drehung in der Bildebene): y am Schirm aus Gegenstands-y
  const objH = objBot.y - objTop.y
  const mapY = (y: number) =>
    hitFromBot.y + ((objBot.y - y) / objH) * (hitFromTop.y - hitFromBot.y)
  const scale = Math.abs(hitFromTop.y - hitFromBot.y) / objH
  // Gegenstand: Körper y=70…128, Flamme cx=48 cy=58 rx=8 ry=14
  const bodyTop = mapY(70)
  const bodyBot = mapY(128) // = hitFromBot.y
  const bodyY = Math.min(bodyTop, bodyBot)
  const bodyH = Math.abs(bodyTop - bodyBot)
  const bodyW = 14 * scale
  const imgCx = screenX - 5
  const bodyX = imgCx - bodyW / 2
  const flameCy = mapY(58)
  const flameRx = 8 * scale
  const flameRy = 14 * scale

  const rays = showRays
    ? `<!-- Geradlinige Ausbreitung: echte Geraden (zuletzt gezeichnet, über der Öffnung) -->
  <line x1="${objTop.x}" y1="${objTop.y}" x2="${hitFromTop.x}" y2="${hitFromTop.y}" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="${objBot.x}" y1="${objBot.y}" x2="${hitFromBot.x}" y2="${hitFromBot.y}" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="${hole.x}" cy="${hole.y}" r="2.2" fill="#0f172a"/>`
    : ''
  const labels = showLabels
    ? `<text x="48" y="168" text-anchor="middle" fill="#334155" font-size="11" font-family="system-ui,sans-serif">Gegenstand</text>
  <text x="${hole.x}" y="28" text-anchor="middle" fill="#334155" font-size="11" font-family="system-ui,sans-serif">Öffnung</text>
  <text x="${screenX}" y="28" text-anchor="middle" fill="#334155" font-size="11" font-family="system-ui,sans-serif">Schirm</text>
  <text x="${screenX}" y="168" text-anchor="middle" fill="#334155" font-size="11" font-family="system-ui,sans-serif">Abbild</text>`
    : ''
  const sizes = showSizes
    ? `<!-- Größen/Weiten -->
  <line x1="32" y1="${objTop.y}" x2="32" y2="${objBot.y}" stroke="#64748b" stroke-width="1.5"/>
  <text x="20" y="92" fill="#334155" font-size="12" font-family="system-ui,sans-serif" font-weight="600">G</text>
  <line x1="${objTop.x}" y1="145" x2="${hole.x}" y2="145" stroke="#64748b" stroke-width="1.5"/>
  <text x="${(objTop.x + hole.x) / 2}" y="160" text-anchor="middle" fill="#334155" font-size="12" font-family="system-ui,sans-serif" font-weight="600">g</text>
  <line x1="${hole.x}" y1="145" x2="${screenX}" y2="145" stroke="#64748b" stroke-width="1.5"/>
  <text x="${(hole.x + screenX) / 2}" y="160" text-anchor="middle" fill="#334155" font-size="12" font-family="system-ui,sans-serif" font-weight="600">b</text>
  <line x1="345" y1="${hitFromBot.y.toFixed(1)}" x2="345" y2="${hitFromTop.y.toFixed(1)}" stroke="#64748b" stroke-width="1.5"/>
  <text x="356" y="92" fill="#334155" font-size="12" font-family="system-ui,sans-serif" font-weight="600">B</text>`
    : ''
  // Kamerakasten: Vorderwand mit Lücke an der Öffnung (kein Kreis über den Strahlen)
  const wallGap = 9
  const boxTop = 40
  const boxBot = 140
  const boxRight = screenX
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 180" width="380" height="180" role="img" aria-label="Lochkamera">
  <rect width="380" height="180" fill="#f8fafc"/>
  <!-- Kerze (Gegenstand) -->
  <rect x="41" y="70" width="14" height="58" rx="2" fill="#fda4af"/>
  <ellipse cx="48" cy="58" rx="8" ry="14" fill="#fde68a" stroke="#f59e0b" stroke-width="1"/>
  <!-- Kamera-Kasten mit Öffnung (Lücke in der Vorderwand) -->
  <path d="M${hole.x} ${boxTop} H${boxRight} V${boxBot} H${hole.x} V${hole.y + wallGap} M${hole.x} ${hole.y - wallGap} V${boxTop}" fill="none" stroke="#334155" stroke-width="2.5" stroke-linejoin="miter"/>
  <!-- Abbild: Ähnlichkeitsabbildung, umgekehrt; Treffer = Strahlenden -->
  <rect x="${bodyX.toFixed(2)}" y="${bodyY.toFixed(2)}" width="${bodyW.toFixed(2)}" height="${bodyH.toFixed(2)}" rx="1" fill="#fda4af" opacity="0.9"/>
  <ellipse cx="${imgCx.toFixed(2)}" cy="${flameCy.toFixed(2)}" rx="${flameRx.toFixed(2)}" ry="${flameRy.toFixed(2)}" fill="#fde68a" opacity="0.95"/>
  ${rays}
  ${labels}
  ${sizes}
  <text x="190" y="175" text-anchor="middle" fill="#64748b" font-size="12" font-family="system-ui,sans-serif">Lochkamera</text>
</svg>`
}

/** Auge im Querschnitt: Gegenstand → Linse → kleineres, umgekehrtes ähnliches Bild auf der Netzhaut. */
export function augeSehSvg(opts?: { showRays?: boolean }): string {
  const showRays = opts?.showRays !== false
  // Gegenstand (Baum): Spitze (55,40), Kronenbasis y=95 Breite 40, Stamm h=30 → Gesamthöhe 85
  const objTip = { x: 55, y: 40 }
  const objBase = { x: 55, y: 125 }
  const lens = { x: 208, y: 85 }
  const retinaX = 292
  const hitTip = rayHitAtX(objTip, lens, retinaX) // Spitze → unten auf Netzhaut
  const hitBase = rayHitAtX(objBase, lens, retinaX) // Fuß → oben auf Netzhaut
  const imgH = hitTip.y - hitBase.y
  const scale = imgH / 85
  const trunkH = 30 * scale
  const halfCanopy = 20 * scale
  const trunkW = 10 * scale
  const cx = retinaX
  // Umgedreht: Stamm oben (hitBase), Krone darunter, Spitze bei hitTip
  const trunkY = hitBase.y
  const canopyBaseY = hitBase.y + trunkH
  const tipY = hitTip.y

  const rays = showRays
    ? `<!-- Zentralstrahlen: unvermittelt gerade durch Linsenmitte (zuletzt gezeichnet) -->
  <line x1="${objTip.x}" y1="${objTip.y}" x2="${hitTip.x}" y2="${hitTip.y}" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="4 3" stroke-linecap="round"/>
  <line x1="${objBase.x}" y1="${objBase.y}" x2="${hitBase.x}" y2="${hitBase.y}" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="4 3" stroke-linecap="round"/>`
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 170" width="360" height="170" role="img" aria-label="Auge und Sehvorgang">
  <rect width="360" height="170" fill="#f8fafc"/>
  <!-- Baum (aufrecht) -->
  <polygon points="55,40 35,95 75,95" fill="#16a34a"/>
  <rect x="50" y="95" width="10" height="30" fill="#78716c"/>
  <text x="55" y="145" text-anchor="middle" fill="#334155" font-size="11" font-family="system-ui,sans-serif">Gegenstand</text>
  <!-- Auge -->
  <ellipse cx="240" cy="85" rx="70" ry="48" fill="#f1f5f9" stroke="#64748b" stroke-width="2"/>
  <ellipse cx="188" cy="85" rx="10" ry="22" fill="#a78bfa"/>
  <ellipse cx="${lens.x}" cy="${lens.y}" rx="14" ry="20" fill="#60a5fa" stroke="#2563eb" stroke-width="1.5" fill-opacity="0.55"/>
  <path d="M278 50 Q300 85 278 120" fill="none" stroke="#fb923c" stroke-width="8"/>
  <text x="208" y="72" text-anchor="middle" fill="#1e3a8a" font-size="9" font-family="system-ui,sans-serif">Linse</text>
  <text x="308" y="40" fill="#9a3412" font-size="10" font-family="system-ui,sans-serif">Netzhaut</text>
  <!-- Ähnlichkeitsabbild: gleiche Proportionen, kleiner, verkehrt auf der Netzhaut -->
  <rect x="${(cx - trunkW / 2).toFixed(2)}" y="${trunkY.toFixed(2)}" width="${trunkW.toFixed(2)}" height="${trunkH.toFixed(2)}" fill="#78716c"/>
  <polygon points="${cx},${tipY.toFixed(2)} ${(cx - halfCanopy).toFixed(2)},${canopyBaseY.toFixed(2)} ${(cx + halfCanopy).toFixed(2)},${canopyBaseY.toFixed(2)}" fill="#16a34a"/>
  ${rays}
  <text x="318" y="95" fill="#334155" font-size="9" font-family="system-ui,sans-serif">Abbild</text>
</svg>`
}

/** Weißes Licht → Farbfilter → durchgelassene Farbe. */
export function farbfilterSvg(opts: {
  filterColor: 'rot' | 'grün' | 'blau'
  showAfter?: boolean
}): string {
  const map = {
    rot: { fill: '#ef4444', out: '#ef4444', label: 'roter Filter' },
    grün: { fill: '#22c55e', out: '#22c55e', label: 'grüner Filter' },
    blau: { fill: '#3b82f6', out: '#3b82f6', label: 'blauer Filter' },
  } as const
  const c = map[opts.filterColor]
  const after =
    opts.showAfter === false
      ? ''
      : `<path d="M205 85 H245" stroke="#64748b" stroke-width="2"/>
  <rect x="250" y="70" width="70" height="30" fill="${c.out}" opacity="0.85"/>
  <text x="285" y="120" text-anchor="middle" fill="#334155" font-size="11" font-family="system-ui,sans-serif">${opts.filterColor}es Licht</text>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 150" width="360" height="150" role="img" aria-label="Farbfilter">
  <rect width="360" height="150" fill="#f8fafc"/>
  <defs>
    <linearGradient id="whiteBand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fecaca"/><stop offset="25%" stop-color="#fde68a"/>
      <stop offset="50%" stop-color="#bbf7d0"/><stop offset="75%" stop-color="#bfdbfe"/>
      <stop offset="100%" stop-color="#e9d5ff"/>
    </linearGradient>
  </defs>
  <rect x="20" y="70" width="80" height="30" fill="url(#whiteBand)" stroke="#94a3b8"/>
  <text x="60" y="60" text-anchor="middle" fill="#334155" font-size="11" font-family="system-ui,sans-serif">weißes Licht</text>
  <path d="M105 85 H145" stroke="#64748b" stroke-width="2"/>
  <rect x="150" y="55" width="50" height="60" rx="4" fill="${c.fill}" opacity="0.75" stroke="#334155"/>
  <text x="175" y="135" text-anchor="middle" fill="#334155" font-size="11" font-family="system-ui,sans-serif">${c.label}</text>
  ${after}
</svg>`
}

/** Weißes Licht durch Prisma → Spektrum (ohne sin/Brechungsformel). */
export function prismaSpektrumSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 160" width="380" height="160" role="img" aria-label="Prisma und Spektrum">
  <rect width="380" height="160" fill="#f8fafc"/>
  <rect x="20" y="70" width="70" height="18" fill="#e2e8f0" stroke="#94a3b8"/>
  <text x="55" y="58" text-anchor="middle" fill="#334155" font-size="11" font-family="system-ui,sans-serif">weißes Licht</text>
  <polygon points="140,35 200,125 80,125" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
  <text x="140" y="148" text-anchor="middle" fill="#334155" font-size="11" font-family="system-ui,sans-serif">Prisma</text>
  <line x1="90" y1="79" x2="130" y2="79" stroke="#64748b" stroke-width="2"/>
  <g stroke-width="3">
    <line x1="175" y1="70" x2="310" y2="40" stroke="#ef4444"/>
    <line x1="175" y1="75" x2="310" y2="55" stroke="#f97316"/>
    <line x1="175" y1="80" x2="310" y2="70" stroke="#eab308"/>
    <line x1="175" y1="85" x2="310" y2="85" stroke="#22c55e"/>
    <line x1="175" y1="90" x2="310" y2="100" stroke="#3b82f6"/>
    <line x1="175" y1="95" x2="310" y2="115" stroke="#8b5cf6"/>
  </g>
  <text x="320" y="80" fill="#334155" font-size="11" font-family="system-ui,sans-serif">Spektrum</text>
</svg>`
}

/** Vergleich von Dämmstoffen (qualitativ: besser / schlechter). */
export function daemmstoffCompareSvg(): string {
  const bar = (x: number, h: number, label: string, fill: string) =>
    `<rect x="${x}" y="${130 - h}" width="44" height="${h}" fill="${fill}" stroke="#334155"/>
  <text x="${x + 22}" y="148" text-anchor="middle" fill="#334155" font-size="10" font-family="system-ui,sans-serif">${label}</text>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160" width="320" height="160" role="img" aria-label="Dämmstoffe vergleichen">
  <rect width="320" height="160" fill="#f8fafc"/>
  <text x="160" y="22" text-anchor="middle" fill="#334155" font-size="12" font-family="system-ui,sans-serif">Dämmwirkung (schematisch, höher = besser)</text>
  ${bar(40, 95, 'Mineralwolle', '#86efac')}
  ${bar(110, 88, 'Styropor', '#a5b4fc')}
  ${bar(180, 35, 'Holz voll', '#fdba74')}
  ${bar(250, 18, 'Metall', '#94a3b8')}
</svg>`
}
