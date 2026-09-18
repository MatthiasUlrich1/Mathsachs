import type { Fachwissen, Grade, Topic } from './types'

/**
 * Issue #45 / product rule: every topic shows a „Wissen“ rubric unless the
 * author sets `excludeFachwissen: true`. Texts explain *how* to solve this
 * task type (principle), not only definitions.
 */

const wiki = (title: string, path: string): Pick<Fachwissen, 'quelle' | 'url'> => ({
  quelle: `Wikipedia: ${title}`,
  url: `https://de.wikipedia.org/wiki/${path}`,
})

/** Detailed unit-conversion Wissen (Issue #45 — previously missing entirely). */
export function conversionFachwissen(label: string): Fachwissen {
  switch (label) {
    case 'Länge':
      return {
        text:
          'Längeneinheiten (metrisch): mm, cm, dm, m, km. Zwischen benachbarten Vorsätzen ' +
          'liegt der Faktor 10 (1 cm = 10 mm, 1 m = 100 cm, 1 km = 1000 m). ' +
          'Vorgehen: (1) Finde den Faktor zwischen Ausgangs- und Zieleinheit. ' +
          '(2) Gehst du zu einer kleineren Einheit (z. B. m → cm), multipliziere. ' +
          '(3) Gehst du zu einer größeren Einheit (cm → m), dividiere. ' +
          'So bleibt der gleiche reale Abstand — nur die Zahl ändert sich.',
        ...wiki('Meter', 'Meter'),
      }
    case 'Flächeninhalt':
      return {
        text:
          'Flächeneinheiten sind Quadrate der Längeneinheiten: m² bedeutet m × m. ' +
          'Deshalb werden Umrechnungsfaktoren quadriert: 1 m = 100 cm ⇒ 1 m² = 100 × 100 = 10 000 cm² ' +
          '(nicht 100!). Ebenso 1 m = 10 dm ⇒ 1 m² = 100 dm². ' +
          'Weitere Einheiten: 1 a (Ar) = 100 m², 1 ha = 10 000 m². ' +
          'Zwei Dimensionen → Faktor². Immer zuerst den Längen-Faktor bestimmen, dann quadrieren, ' +
          'dann multiplizieren (kleinere Einheit) oder dividieren (größere Einheit).',
        ...wiki('Quadratmeter', 'Quadratmeter'),
      }
    case 'Volumen':
      return {
        text:
          'Volumeneinheiten sind Kuben der Länge: m³ = m × m × m. ' +
          'Umrechnungsfaktoren werden daher in die dritte Potenz erhoben: ' +
          '1 m = 10 dm ⇒ 1 m³ = 10³ = 1000 dm³. Praktisch: 1 dm³ = 1 l, 1 cm³ = 1 ml, ' +
          '1 m³ = 1000 l. Drei Dimensionen → Faktor³ (nicht denselben Faktor wie bei Länge!). ' +
          'Ablauf: Längen-Faktor finden → hoch 3 → je nach Richtung multiplizieren oder dividieren.',
        ...wiki('Kubikmeter', 'Kubikmeter'),
      }
    case 'Masse':
      return {
        text:
          'Masseneinheiten: mg, g, kg, t. Typische Faktoren: 1 g = 1000 mg, 1 kg = 1000 g, ' +
          '1 t = 1000 kg. Masse ist eindimensional in der Einheitenskala (kein Quadrieren/Kubieren). ' +
          'Zur kleineren Einheit multiplizieren, zur größeren dividieren. ' +
          'Tipp: Schreibe die Kette (z. B. kg → g → mg) und rechne Schritt für Schritt mit 1000.',
        ...wiki('Kilogramm', 'Kilogramm'),
      }
    case 'Zeit':
      return {
        text:
          'Zeiteinheiten: s, min, h (nicht dezimal!). Faktoren: 1 min = 60 s, 1 h = 60 min = 3600 s. ' +
          'Von Stunden zu Sekunden: erst · 60 (→ min), dann nochmal · 60 (→ s), oder direkt · 3600. ' +
          'Zurück: dividieren. Merke: Hier gilt nicht der Zehnerfaktor der Längenmaße.',
        ...wiki('Zeit', 'Zeit'),
      }
    default:
      return {
        text:
          `Beim Umrechnen von „${label}“ bestimmst du den Faktor zwischen den Einheiten und ` +
          'multiplizierst (Richtung kleinere Einheit) bzw. dividierst (größere Einheit). ' +
          'Bei Fläche Faktor², bei Volumen Faktor³ — weil Fläche und Volumen aus Länge × Länge ' +
          '(× Länge) entstehen.',
      }
  }
}

type TopicRef = { id: string; title: string }

/** Physics how-to Wissen from topic id/title (Issue #45 comment). */
export function physikFachwissen(topic: TopicRef): Fachwissen {
  const lower = `${topic.id} ${topic.title}`.toLowerCase()

  if (/volumen/.test(lower) && !/dichte|druck/.test(lower)) {
    return {
      text:
        'Volumen V ist der Rauminhalt. Beim Quader: V = Länge · Breite · Höhe (alle Maße in derselben ' +
        'Einheit). Einheit oft cm³ oder m³; 1 dm³ = 1 l. ' +
        'Vorgehen: (1) Alle Kanten in eine Einheit bringen. (2) Die drei Maße multiplizieren. ' +
        '(3) Einheit als Produkt der Längeneinheiten notieren (cm · cm · cm = cm³).',
      ...wiki('Volumen', 'Volumen'),
    }
  }
  if (/dichte/.test(lower) && /stoff|vergleich/.test(lower)) {
    return {
      text:
        'Stoffe vergleichen über die Dichte ρ. Faustregel in Wasser (ρ ≈ 1 g/cm³): ' +
        'ρ_Körper < ρ_Wasser → schwimmt; ρ_Körper > ρ_Wasser → sinkt. ' +
        'Zwei Stoffe: der mit dem größeren ρ-Wert ist dichter. ' +
        'Hier brauchst du keine Rechnung aus m und V — nur den Vergleich der gegebenen Dichten.',
      ...wiki('Dichte', 'Dichte_(Physik)'),
    }
  }
  if (/dichte/.test(lower)) {
    return {
      text:
        'Dichte ρ = m / V (Masse geteilt durch Volumen). Einheit z. B. g/cm³ oder kg/m³. ' +
        'Umstellen: m = ρ · V, V = m / ρ. ' +
        'Ablauf: (1) m und V in passende Einheiten bringen. (2) Dividieren bzw. umstellen. ' +
        '(3) Einheit mitführen — sie gehört zum Ergebnis.',
      ...wiki('Dichte', 'Dichte_(Physik)'),
    }
  }
  if (/masse/.test(lower) && !/dichte/.test(lower)) {
    return {
      text:
        'Masse m beschreibt, „wie viel Stoff“ ein Körper hat (Einheit g, kg). ' +
        'Aus Dichte und Volumen: m = ρ · V. Einheiten: 1 kg = 1000 g. ' +
        'Vorgehen: ρ und V einsetzen (gleiche Längenbasis, z. B. g und cm³), multiplizieren, ' +
        'dann ggf. in die geforderte Masseneinheit umrechnen.',
      ...wiki('Masse_(Physik)', 'Masse_(Physik)'),
    }
  }
  if (/weg.?zeit|diagramm/.test(lower)) {
    return {
      text:
        'Im Weg-Zeit-Diagramm steht die Strecke s senkrecht, die Zeit t waagerecht. ' +
        'Gleichförmige Bewegung → Gerade; Steigung = Geschwindigkeit v = Δs / Δt. ' +
        'Ablesen: zu einem Zeitpunkt die Höhe (s) nehmen; für v zwei Punkte wählen und ' +
        'Δs durch Δt teilen. Steilere Gerade = größere Geschwindigkeit.',
      ...wiki('Weg-Zeit-Diagramm', 'Weg-Zeit-Diagramm'),
    }
  }
  if (/bewegung|geschwindigkeit|kinematik/.test(lower)) {
    return {
      text:
        'Gleichförmige Bewegung: Geschwindigkeit v ist konstant. Grundformel s = v · t ' +
        '(Strecke = Geschwindigkeit · Zeit). Umstellen: v = s / t, t = s / v. ' +
        'Einheiten konsistent wählen (z. B. m und s → m/s). Zuerst gegebene Größen zuordnen, ' +
        'dann die passende Form der Formel wählen und einsetzen.',
      ...wiki('Geschwindigkeit', 'Geschwindigkeit'),
    }
  }
  if (/einheiten/.test(lower) && /v|s|t|geschwind/.test(lower)) {
    return {
      text:
        'Einheiten von Weg s (m, km), Zeit t (s, min, h) und Geschwindigkeit v (m/s, km/h). ' +
        '1 km/h = 1000 m / 3600 s ≈ 0,278 m/s; umgekehrt m/s · 3,6 = km/h. ' +
        'Immer erst Größen in Basiseinheiten bringen, dann rechnen — sonst passen die Formeln nicht.',
      ...wiki('Kilometer_pro_Stunde', 'Kilometer_pro_Stunde'),
    }
  }
  if (/licht|schatten|spiegel|brechung|strahl|optik|linse|prisma/.test(lower)) {
    return {
      text:
        'Licht breitet sich geradlinig aus. Schatten entstehen, wenn ein Körper Licht abhält; ' +
        'Kernschatten = völlig dunkel, Halbschatten = teilweise beleuchtet. ' +
        'Am Spiegel: Einfallswinkel = Ausfallswinkel. ' +
        'Löse Aufgaben, indem du Strahlengänge skizzierst und Winkel/Abstände an der Figur abliest.',
      ...wiki('Geometrische_Optik', 'Geometrische_Optik'),
    }
  }
  if (/temperatur|kelvin|celsius|aggregat|schmelz|sieden|wärme|ausdehnung/.test(lower)) {
    return {
      text:
        'Temperatur in °C oder K: T(K) = ϑ(°C) + 273. Aggregatzustände ändern sich bei Schmelz-/Siedepunkt. ' +
        'Wärmeausdehnung: die meisten Stoffe dehnen sich bei Erwärmung aus. ' +
        'Aufgaben: Skala ablesen, Umrechnung °C↔K, oder Zustand aus Temperatur vs. Schmelz-/Siedepunkt folgern.',
      ...wiki('Temperatur', 'Temperatur'),
    }
  }
  if (/strom|elektr|spannung|widerstand|ohm|schalt|leiter|ladung|kurzschluss/.test(lower)) {
    return {
      text:
        'Stromkreis: geschlossener Leiterweg + Spannungsquelle. Ohmsches Gesetz: R = U / I, also I = U / R, U = R · I. ' +
        'Einheiten: U in V, I in A, R in Ω. ' +
        'Reihe: gleicher Strom; Parallel: gleiche Spannung. Zuerst Formel wählen, Größen einsetzen, Einheit prüfen.',
      ...wiki('Ohmsches_Gesetz', 'Ohmsches_Gesetz'),
    }
  }
  if (/kraft|druck|impuls|newton|reibung|hebel|auftrieb|feder|hooke/.test(lower)) {
    return {
      text:
        'Kraft F in Newton (N). Druck p = F / A (Pascal). Gewichtskraft näherungsweise F_G = m · g (g ≈ 10 N/kg). ' +
        'Größere Fläche bei gleicher Kraft → kleinerer Druck. ' +
        'Ablauf: Formel wählen → Einheiten (N, m², kg) prüfen → einsetzen → Ergebnis mit Einheit angeben.',
      ...wiki('Druck_(Physik)', 'Druck_(Physik)'),
    }
  }
  if (/energie|leistung|arbeit|kinetisch|potentiell/.test(lower)) {
    return {
      text:
        'Energie E in Joule (J), Leistung P = E / t in Watt (W). Kinetisch E_kin = ½ m v², potentiell oft E_pot = m g h. ' +
        'Energieerhaltung: Formen können sich umwandeln, die Summe bleibt (ohne Reibungsverluste idealisiert). ' +
        'Aufgabe: passende Energie-/Leistungsformel wählen, einsetzen, Einheiten J bzw. W führen.',
      ...wiki('Energie', 'Energie'),
    }
  }
  if (/welle|schall|frequenz|periode|photon|quant|interferenz|beugung/.test(lower)) {
    return {
      text:
        'Welle: c = λ · f (oder v = λ · f). Frequenz und Periodendauer: f = 1 / T. ' +
        'Schall braucht ein Medium; Licht auch im Vakuum. ' +
        'Rechenweg: gegebene Größen zuordnen, Formel umstellen, einsetzen — Einheit Hz bzw. m mitführen.',
      ...wiki('Welle', 'Welle'),
    }
  }
  if (/atom|kern|radioaktiv|halbwert|zerfall|spaltung|fusion/.test(lower)) {
    return {
      text:
        'Radioaktiver Zerfall: nach einer Halbwertszeit ist die Hälfte der Kerne zerfallen. ' +
        'Strahlungsarten α, β, γ unterscheiden sich in Reichweite und Abschirmung. ' +
        'Aufgaben oft: Halbwertszeiten zählen oder Zuordnung Strahlungsart ↔ Eigenschaften.',
      ...wiki('Radioaktivität', 'Radioaktivit%C3%A4t'),
    }
  }
  if (/magnet|induktion|spule|lorentz|feld/.test(lower)) {
    return {
      text:
        'Magnetische und elektrische Felder üben Kräfte auf Ladungen/Ströme aus (z. B. Lorentzkraft). ' +
        'Induktion: zeitlich geändertes Magnetfeld erzeugt Spannung in einer Spule. ' +
        'Löse Aufgaben über die passende Beziehung (Kraft, Spannung, Feld) und prüfe die Einheit.',
      ...wiki('Elektromagnetische_Induktion', 'Elektromagnetische_Induktion'),
    }
  }
  if (/hypothese|experiment|mess|praktikum|variable|forschungs/.test(lower)) {
    return {
      text:
        'Im Praktikum: Hypothese formulieren, unabhängige Variable gezielt ändern, abhängige messen, ' +
        'Störgrößen möglichst konstant halten. Mittelwert = Summe / Anzahl. ' +
        'Messunsicherheit sagt, wie genau der Wert bestimmt ist — nicht „ob die Formel stimmt“.',
      ...wiki('Experiment', 'Experiment'),
    }
  }

  return {
    text:
      `Thema „${topic.title}“: Physikalische Größen hängen über Formeln zusammen. ` +
      'Prinzip: (1) Gegebene und gesuchte Größe benennen. (2) Passende Formel wählen und umstellen. ' +
      '(3) Einheiten angleichen und einsetzen. (4) Ergebnis mit Einheit und kurzer Begründung angeben. ' +
      'So verstehst du den Zusammenhang — nicht nur ein Rezept für eine Aufgabe.',
    ...wiki('Physik', 'Physik'),
  }
}

/** How-to fallback for any curriculum when no authored Fachwissen exists. */
export function defaultFachwissen(topic: TopicRef, subject?: string): Fachwissen {
  if (subject === 'Physik' || topic.id.startsWith('ph-')) {
    return physikFachwissen(topic)
  }
  if (/umrechnen|einheiten/.test(`${topic.id} ${topic.title}`.toLowerCase())) {
    if (/fläch|flaeche|m²|quadrat/.test(topic.title.toLowerCase())) {
      return conversionFachwissen('Flächeninhalt')
    }
    if (/volumen|rauminhalt|m³|liter/.test(topic.title.toLowerCase())) {
      return conversionFachwissen('Volumen')
    }
    if (/masse|gewicht|gramm|kilogramm/.test(topic.title.toLowerCase())) {
      return conversionFachwissen('Masse')
    }
    if (/zeit|minute|stunde|sekunde/.test(topic.title.toLowerCase())) {
      return conversionFachwissen('Zeit')
    }
    if (/länge|laenge|meter|zentimeter/.test(topic.title.toLowerCase())) {
      return conversionFachwissen('Länge')
    }
    return conversionFachwissen(topic.title)
  }
  return {
    text:
      `Zu „${topic.title}“: Lies die Aufgabe, markiere Gegebenes und Gesuchtes und wähle die passende ` +
      'Rechen- oder Denkstrategie. Kontrolliere Zwischenschritte und die Einheit bzw. Schreibweise der Antwort. ' +
      'Ziel ist, das Prinzip zu verstehen — dann kannst du ähnliche Aufgaben selbstständig lösen.',
  }
}

export type EnsureFachwissenOpts = {
  /** Pack/subject title, e.g. „Physik“ or „Mathematik“. */
  subject?: string
}

/**
 * Attach Fachwissen unless the topic opts out. Existing authored text wins.
 */
export function ensureTopicFachwissen(topic: Topic, opts?: EnsureFachwissenOpts): Topic {
  if (topic.excludeFachwissen) {
    const { fachwissen: _drop, ...rest } = topic
    return { ...rest, excludeFachwissen: true }
  }
  if (topic.fachwissen?.text?.trim()) return topic
  return {
    ...topic,
    fachwissen: defaultFachwissen(topic, opts?.subject),
  }
}

export function ensureGradeFachwissen(grade: Grade, opts?: EnsureFachwissenOpts): Grade {
  return {
    ...grade,
    areas: grade.areas.map((area) => ({
      ...area,
      topics: area.topics.map((topic) => ensureTopicFachwissen(topic, opts)),
    })),
  }
}

/** True when the Wissen rubric must be shown for this topic. */
export function topicHasWissenRubric(topic: Topic): boolean {
  return !topic.excludeFachwissen && Boolean(topic.fachwissen?.text?.trim())
}
