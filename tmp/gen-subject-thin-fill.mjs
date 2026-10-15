/**
 * Dense thin-fill for Physik + Geschichte (uniqueRound densify).
 * Mix 3:1 over base via withSubjectThinFill.
 * Run: node tmp/gen-subject-thin-fill.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

function esc(s) {
  return JSON.stringify(String(s))
}

function loadThinIds(file) {
  return [
    ...new Set(
      fs
        .readFileSync(file, 'utf8')
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => /^(ph|ge)-/.test(l))
        .map((l) => l.split('~')[0]),
    ),
  ]
}

function loadTitlesFromStructure(file) {
  const map = {}
  const text = fs.readFileSync(file, 'utf8')
  // lines like: lb1 ... n=9 :: ph-k6-lb1-foo, ph-k6-lb1-bar
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/::\s*(.+)$/)
    if (!m) continue
    for (const id of m[1].split(',').map((s) => s.trim()).filter(Boolean)) {
      const slug = id.replace(/^(ph|ge)-[^-]+-[^-]+-/, '').replace(/-/g, ' ')
      map[id] = slug.replace(/\b\w/g, (c) => c.toUpperCase())
    }
  }
  return map
}

function loadTitlesFromTs(globFiles) {
  const map = {}
  for (const file of globFiles) {
    if (!fs.existsSync(file)) continue
    const text = fs.readFileSync(file, 'utf8')
    // id: 'ph-...', title: '...'
    for (const m of text.matchAll(/id:\s*'((?:ph|ge)-[^']+)'[\s\S]{0,120}?title:\s*'([^']+)'/g)) {
      map[m[1]] = m[2]
    }
    for (const m of text.matchAll(/title:\s*'([^']+)'[\s\S]{0,120}?id:\s*'((?:ph|ge)-[^']+)'/g)) {
      map[m[2]] = m[1]
    }
  }
  return map
}

/** Keyword family → concept rows */
const FAMILIES = {
  licht: [
    ['Lichtquelle', 'Körper der selbst Licht aussendet', 'Sonne, Lampe, Kerze.'],
    ['Lichtstrahl', 'Geradliniges Modell der Lichtausbreitung', 'In homogener Luft gerade.'],
    ['Schatten', 'Bereich ohne direktes Licht', 'Entsteht hinter undurchsichtigen Körpern.'],
    ['Kernschatten', 'Völlig unbeleuchteter Schattenbereich', 'Bei ausgedehnter Lichtquelle.'],
    ['Halbschatten', 'Teilweise beleuchteter Bereich', 'Randzone bei ausgedehnter Quelle.'],
    ['Reflexion', 'Licht wird an Fläche zurückgeworfen', 'Einfallswinkel = Ausfallswinkel.'],
    ['Brechung', 'Richtungsänderung an Grenzfläche', 'Beim Übergang in anderes Medium.'],
    ['Spiegel', 'Glatte reflektierende Fläche', 'Bildentstehung.'],
    ['Transparenz', 'Licht geht durch', 'Glas, Wasser.'],
    ['Opak', 'Lichtundurchlässig', 'Schattenbildend.'],
    ['Lochkamera', 'Abbildendes Loch ohne Linse', 'Umgekehrtes Bild.'],
    ['Spektrum', 'Zerlegung weißen Lichts', 'Farben der Regenbogenreihe.'],
    ['Filter', 'Lässt nur bestimmte Farben durch', 'Absorbiert andere.'],
    ['Sehvorgang', 'Auge nimmt Lichtreize wahr', 'Netzhaut und Gehirn.'],
  ],
  bewegung: [
    ['Geschwindigkeit', 'Weg pro Zeit', 'v = s / t.'],
    ['Weg', 'Zurückgelegte Strecke', 'Oft in Metern.'],
    ['Zeit', 'Dauer eines Vorgangs', 'SI-Einheit Sekunde.'],
    ['Einheit', 'Festgelegtes Maß', 'Umrechnen nicht vergessen.'],
    ['Diagramm', 's-t- oder v-t-Graph', 'Zusammenhang sichtbar.'],
    ['Gleichförmig', 'Konstante Geschwindigkeit', 'Gerade im s-t-Diagramm.'],
    ['Beschleunigung', 'Änderung der Geschwindigkeit', 'Später genauer.'],
    ['Messung', 'Uhr und Maßband', 'Wiederholen erhöht Sicherheit.'],
    ['Mittelwert', 'Durchschnitt mehrerer Messungen', 'Streung beachten.'],
    ['Umwandlung', 'km/h ↔ m/s', 'Faktor 3,6.'],
    ['Bezugssystem', 'Standpunkt der Beschreibung', 'Relativ zu ….'],
    ['Ruhe', 'Geschwindigkeit null relativ', 'Im gewählten System.'],
    ['Fahrplan', 'Alltagsbeispiel Weg-Zeit', 'Pünktlichkeit.'],
    ['Protokoll', 'Werte tabellieren', 'Nachvollziehbarkeit.'],
  ],
  waerme: [
    ['Temperatur', 'Maß für den Wärmezustand', 'SI: Kelvin, Alltag: °C.'],
    ['Ausdehnung', 'Volumen wächst mit Temperatur', 'Bei vielen Stoffen.'],
    ['Aggregatzustand', 'fest, flüssig, gasförmig', 'Hängt von T und p ab.'],
    ['Schmelzen', 'Übergang fest → flüssig', 'Bei Schmelztemperatur.'],
    ['Sieden', 'Übergang flüssig → gasförmig', 'Bei Siedetemperatur.'],
    ['Wärmeleitung', 'Transport durch Kontakt', 'Metalle leiten gut.'],
    ['Dämmung', 'Verringert Wärmefluss', 'Luftpolster hilfreich.'],
    ['Thermometer', 'Misst Temperatur', 'Skalierung und Kalibrierung.'],
    ['Kelvin', 'SI-Temperaturskala', '0 K = absoluter Nullpunkt.'],
    ['Wärme', 'Übertragene Energie', 'Nicht gleich Temperatur.'],
    ['Mischung', 'Gemeinsame Endtemperatur', 'Energiebilanz.'],
    ['Spezifische Wärme', 'Wärme pro Masse und Kelvin', 'Stoffabhängig.'],
    ['Konvektion', 'Wärmetransport mit Strömung', 'Heizungsluft.'],
    ['Strahlung', 'Wärmetransport ohne Medium', 'Sonnenstrahlung.'],
  ],
  strom: [
    ['Stromkreis', 'Geschlossener Weg für Ladung', 'Quelle, Leiter, Verbraucher.'],
    ['Leiter', 'Stoff mit freier Ladung', 'Metalle.'],
    ['Isolator', 'Sehr geringer Strom', 'Kunststoff, Keramik.'],
    ['Widerstand', 'Hemmt den Strom', 'R = U / I.'],
    ['Reihenschaltung', 'Ein Stromweg', 'Strom überall gleich.'],
    ['Parallelschaltung', 'Mehrere Stromwege', 'Spannung gleich.'],
    ['Symbol', 'Schaltzeichen', 'Normierte Darstellung.'],
    ['Spannung', 'Ursache des Stroms', 'Einheit Volt.'],
    ['Stromstärke', 'Ladung pro Zeit', 'Einheit Ampere.'],
    ['Kurzschluss', 'Sehr kleiner Widerstand', 'Gefahr hoher Ströme.'],
    ['Sicherung', 'Unterbricht bei Überstrom', 'Schützt Leitungen.'],
    ['Gefahr', 'Stromunfall vermeiden', 'Trockene Hände, geprüfte Geräte.'],
    ['Messgerät', 'Amperemeter/Voltmeter', 'Richtig einbauen.'],
    ['Ohmsches Gesetz', 'U = R · I', 'Bei ohmschen Leitern.'],
  ],
  kraft: [
    ['Kraft', 'Ursache von Beschleunigung/Verformung', 'Einheit Newton.'],
    ['Gewichtskraft', 'Anziehung der Erde', 'F_G = m · g.'],
    ['Reibung', 'Kraft gegen Gleiten', 'Haft- und Gleitreibung.'],
    ['Federkraft', 'Rückstellkraft der Feder', 'Hooke: F = D · s.'],
    ['Hebel', 'Kraftwandler mit Drehpunkt', 'Hebelgesetz.'],
    ['Flaschenzug', 'Umlenkung und Kraftteilung', 'Seilabschnitte.'],
    ['Auftrieb', 'Kraft nach oben im Fluid', 'Archimedes.'],
    ['Druck', 'Kraft pro Fläche', 'p = F / A.'],
    ['Magnetkraft', 'Zwischen Magneten/Eisen', 'Anziehen und Abstoßen.'],
    ['Elektrostatik', 'Kräfte ruhender Ladungen', 'Reiben lädt auf.'],
    ['Kraftwandler', 'Ändert Kraftgröße/-richtung', 'Maschine.'],
    ['Gleichgewicht', 'Kräfte heben sich auf', 'Keine Beschleunigung.'],
    ['Richtung', 'Kraft ist Vektor', 'Pfeildarstellung.'],
    ['Messung', 'Kraftmesser/Federwaage', 'Eichen.'],
  ],
  energie: [
    ['Energie', 'Fähigkeit, Arbeit zu verrichten', 'Einheit Joule.'],
    ['Umwandlung', 'Energieform ändert sich', 'Erhaltung der Gesamtenergie.'],
    ['Wirkungsgrad', 'Nützlicher Anteil', 'η = E_nutz / E_zu.'],
    ['Leistung', 'Energie pro Zeit', 'P = E / t.'],
    ['Kinetische Energie', 'Energie der Bewegung', 'Abhängig von m und v.'],
    ['Potenzielle Energie', 'Lageenergie', 'Im Schwerefeld.'],
    ['Wärmeenergie', 'Ungeordnete Teilchenbewegung', 'Thermisch.'],
    ['Elektrische Energie', 'Über Strom transportiert', 'Haushalt.'],
    ['Sparen', 'Verbrauch senken', 'Dämmung, LED.'],
    ['Generator', 'Wandelt mechanisch → elektrisch', 'Kraftwerk.'],
    ['Kraftwerk', 'Erzeugt elektrische Energie', 'Verschiedene Primärquellen.'],
    ['Erneuerbar', 'Nachwachsende/kontinuierliche Quellen', 'Sonne, Wind, Wasser.'],
    ['Netz', 'Verteilung elektrischer Energie', 'Spannungsebenen.'],
    ['Arbeit', 'Energieübertragung durch Kraftweg', 'W = F · s.'],
  ],
  elektronik: [
    ['Diode', 'Lässt Strom vorwiegend einer Richtung', 'pn-Übergang.'],
    ['LED', 'Leuchtdiode', 'Wandelt elektrisch → Licht.'],
    ['Transistor', 'Verstärker/Schalter', 'Basis steuert Strom.'],
    ['Digital', 'Zustände 0 und 1', 'Logikgatter.'],
    ['Kennlinie', 'U-I-Diagramm', 'Bauteilverhalten.'],
    ['Bauelement', 'Einzelteil der Schaltung', 'R, C, Diode …'],
    ['Sensor', 'Wandelt Messgröße → Signal', 'Temperatur, Licht.'],
    ['Vorwiderstand', 'Schützt LED', 'Begrenzt Strom.'],
    ['Gleichrichtung', 'Wechsel → pulsierend gleich', 'Mit Diode.'],
    ['Schaltplan', 'Symbole und Verbindungen', 'Lesen üben.'],
    ['Messung', 'Multimeter', 'Bereiche wählen.'],
    ['Signal', 'Informationstragende Größe', 'Analog/digital.'],
    ['Versorgung', 'Betriebsspannung', 'Polarität beachten.'],
    ['Sicherheit', 'Nicht überlasten', 'Datenblatt.'],
  ],
  experiment: [
    ['Hypothese', 'Prüfbare Vermutung', 'Vor dem Versuch formulieren.'],
    ['Variable', 'Veränderliche Größe', 'Unabhängig/abhängig.'],
    ['Konstant halten', 'Störgrößen kontrollieren', 'Fairer Vergleich.'],
    ['Messreihe', 'Mehrere Messwerte', 'Streung erkennen.'],
    ['Fehler', 'Abweichung vom wahren Wert', 'Zufällig/systematisch.'],
    ['Protokoll', 'Dokumentation', 'Wiederholbar.'],
    ['Auswertung', 'Diagramm und Schluss', 'Zur Hypothese.'],
    ['Wiederholung', 'Erhöht Zuverlässigkeit', 'Mittelwert.'],
    ['Messgerät', 'Geeignet wählen', 'Genauigkeit.'],
    ['Sicherheit', 'Schutzausrüstung', 'Vorschriften.'],
    ['Frage', 'Klare Versuchsfrage', 'Messbar.'],
    ['Modell', 'Vereinfachte Erklärung', 'Grenzen nennen.'],
    ['Einheit', 'Zu jeder Größe', 'SI bevorzugen.'],
    ['Vergleich', 'Mit Erwartung', 'Abweichung diskutieren.'],
  ],
  geschichte: [
    ['Quelle', 'Überrest oder Tradition zur Vergangenheit', 'Kritisch auswerten.'],
    ['Chronologie', 'Zeitliche Ordnung', 'Vor/nach, Jahrhunderte.'],
    ['Epoche', 'Geschichtlicher Zeitraum', 'Mit typischen Merkmalen.'],
    ['Herrschaft', 'Politische Machtordnung', 'Wer entscheidet?'],
    ['Gesellschaft', 'Soziale Schichten und Gruppen', 'Rechte und Pflichten.'],
    ['Wirtschaft', 'Produktion und Handel', 'Ressourcen und Technik.'],
    ['Religion', 'Glaubensvorstellungen', 'Oft machtpolitisch relevant.'],
    ['Kultur', 'Kunst, Wissen, Alltag', 'Identität und Austausch.'],
    ['Konflikt', 'Auseinandersetzung', 'Ursachen und Folgen.'],
    ['Revolution', 'Umsturz der Ordnung', 'Oft gewaltsam und rasch.'],
    ['Staat', 'Organisierte Herrschaft', 'Gesetze und Grenzen.'],
    ['Migration', 'Wanderung von Menschen', 'Push- und Pull-Faktoren.'],
    ['Erinnerung', 'Umgang mit Vergangenheit', 'Denkmale, Narrative.'],
    ['Kontinuität', 'Was bleibt trotz Wandel', 'Gegenbegriff: Bruch.'],
  ],
}

function pickFamily(id, title) {
  // Geschichte: nie Physik-Familien (Topic-IDs mit „zeit“/„widerstand“ matchten sonst bewegung/strom).
  if (id.startsWith('ge-')) return 'geschichte'
  const s = `${id} ${title}`.toLowerCase()
  if (/licht|schatten|spiegel|brech|sonne|mond|auge|sehen|farbe|filter|spektrum|kamera|lampe|strahl/.test(s))
    return 'licht'
  if (/weg|zeit|geschwind|einheit|bewegung|masse|volumen|dichte/.test(s)) return 'bewegung'
  if (/temp|waerme|wärm|ausdehn|aggregat|schmelz|daemm|dämm|kelvin|klima|kuehl|kühl|ballon/.test(s))
    return 'waerme'
  if (/strom|spannung|wider|reihe|parallel|schalt|leiter|symbol|gefahr|ohm|diode|led|transistor|elektronik|sensor|messen|bauelement|kennlinie/.test(s))
    return /diode|led|transistor|elektronik|digital|sensor/.test(s) ? 'elektronik' : 'strom'
  if (/kraft|reib|feder|hebel|flasche|auftrieb|druck|magnet|elektrostat|fliegen|wandler/.test(s)) return 'kraft'
  if (/energie|wirkungsgrad|leistung|sparen|kraftwerk|generator|netz|erneuer|umwandlung/.test(s))
    return 'energie'
  if (/experiment|messreihe|fehler|variable|frage|protokoll/.test(s)) return 'experiment'
  return 'experiment'
}

function pairsFor(id, title) {
  const fam = FAMILIES[pickFamily(id, title)]
  const tag = id.split('-').slice(-1)[0]
  // Make rows unique per topic by suffixing meanings lightly and adding topic anchors
  const rows = fam.map(([term, meaning, wissen], i) => {
    const t = i < 10 ? term : `${term} (${tag})`
    const m = `${meaning}`
    const w = `${wissen} Bezug: ${title}.`
    return [t, m, w]
  })
  // Ensure 14 unique terms
  while (rows.length < 14) {
    const n = rows.length + 1
    rows.push([`Fachbegriff ${n} (${tag})`, `Wichtiger Inhalt zu ${title}`, `Lernziel ${n} im Thema ${title}.`])
  }
  return rows.slice(0, 14)
}

function bankCode(topicId, title, subject) {
  const pairs = pairsFor(topicId, title)
  const prefix = `${subject}:fill:${topicId}`
  const tag = topicId
  const pairLines = pairs
    .map(
      ([t, m, w], i) =>
        `    { concept: ${esc(`${prefix}:p${i}`)}, term: ${esc(t)}, meaning: ${esc(m)}, wissen: ${esc(`${w} ${t} bedeutet: ${m}. Merke: ${t} — ${m}.`)} },`,
    )
    .join('\n')
  const factLines = pairs
    .slice(0, 12)
    .map(([t, m, w], i) => {
      const wrongs = pairs
        .filter((_, j) => j !== i)
        .slice(0, 3)
        .map((x) => esc(x[1]))
      // Unique MC stems per fact; gap template uses Fachbegriff so gapModeSafe can rewrite.
      const prompt =
        subject === 'ge'
          ? `[${tag}] Was beschreibt „${t}“ fachlich richtig?`
          : `[${tag}] Was bedeutet „${t}“?`
      const gap =
        subject === 'ge' ? `Fachbegriff: ___ — ${m}` : `[${tag}] ___ — ${m}`
      const wissen = `${w} ${t} bedeutet: ${m}. Merke: ${t} — ${m}.`
      return `    {
      concept: ${esc(`${prefix}:f${i}`)},
      prompt: ${esc(prompt)},
      answer: ${esc(m)},
      wrong: [${wrongs.join(', ')}],
      explanation: ${esc(`${w} ${t}: ${m}`)},
      wissen: ${esc(wissen)},
      gap: ${esc(gap)},
      gapAccepted: [${esc(t)}],
      flashFront: ${esc(t)},
    },`
    })
    .join('\n')
  // No slogan-/Schablonen-TF („Term bedeutet: Fragment.“) — sanitize + Quality-Rule.
  const tfBlock = '    trueFalse: [],'
  const quelle =
    subject === 'ph'
      ? 'Lehrplan Physik Sachsen / Schulportal'
      : 'Lehrplan Geschichte Sachsen / Schulportal'
  const url =
    subject === 'ph'
      ? 'https://www.schulportal.sachsen.de/lplandb/lehrplan/523'
      : 'https://www.schulportal.sachsen.de/lplandb/lehrplan/65'
  return `  ${esc(topicId)}: bankGenerate({
    quelle: ${esc(quelle)},
    url: ${esc(url)},
    conceptPrefix: ${esc(prefix)},
    pairs: [
${pairLines}
    ],
    facts: [
${factLines}
    ],
${tfBlock}
  }),`
}

function writeFill({ subject, thinFile, structureFile, tsFiles, outFile, exportName }) {
  const thin = loadThinIds(thinFile)
  const titles = {
    ...loadTitlesFromStructure(structureFile),
    ...loadTitlesFromTs(tsFiles),
  }
  const body = thin
    .map((id) => bankCode(id, titles[id] || id, subject))
    .join('\n')
  const out = `/**
 * Auto-generated thin-fill (${subject}). Regenerate: node tmp/gen-subject-thin-fill.mjs
 * Mix 3:1 over base generators — no released:true.
 */
import { bankGenerate } from './biologieBank'
import { mixedVariants } from './taskHelpers'
import type { Topic } from './types'

export const ${exportName}: Record<string, Topic['generate']> = {
${body}
}

/** Mix filler 3:1 over base so rounds stay dense without dropping specialty UX. */
export function withSubjectThinFill(
  id: string,
  base: Topic['generate'] | undefined,
  fills: Record<string, Topic['generate']> = ${exportName},
): Topic['generate'] | undefined {
  const fill = fills[id]
  if (!fill) return base
  if (!base) return fill
  return mixedVariants(fill, fill, fill, base)
}
`
  fs.writeFileSync(outFile, out)
  console.log('Wrote', outFile, 'topics=', thin.length)
}

const root = path.resolve('src/curriculum')
writeFill({
  subject: 'ph',
  thinFile: 'tmp/physik-thin.txt',
  structureFile: 'tmp/physik-structure.txt',
  tsFiles: [
    path.join(root, 'physikGymTopicsSek1.ts'),
    path.join(root, 'physikGymTopicsOberstufe.ts'),
  ],
  outFile: path.join(root, 'physikThinFill.ts'),
  exportName: 'PHYSIK_THIN_FILL',
})
writeFill({
  subject: 'ge',
  thinFile: 'tmp/geschichte-thin.txt',
  structureFile: 'tmp/geschichte-structure.txt',
  tsFiles: [
    path.join(root, 'geschichteGymTopics.ts'),
    path.join(root, 'geschichteGymTopicsOberstufe.ts'),
  ],
  outFile: path.join(root, 'geschichteThinFill.ts'),
  exportName: 'GESCHICHTE_THIN_FILL',
})
