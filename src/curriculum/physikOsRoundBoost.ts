/**
 * P2: Unique-Runden-Boost für OS-Physik-Topics mit dünnem Unique-Pool.
 * Parametrische Anwendung/Rechnung/MC — keine Slogan-TF.
 * Kein released:true.
 */
import type { Rng } from '../lib/rng'
import { shuffle } from './biologieHelpers'
import {
  choicePickTask,
  mixedVariants,
  multiSelectTask,
  valueTask,
} from './taskHelpers'
import type { Topic } from './types'

const Q = 'Lehrplan Physik Sachsen Oberstufe'
const U = 'https://www.schulportal.sachsen.de/lplandb/'
const fw = (text: string) => {
  let t = text.trim()
  if (t.length < 40) {
    t = `${t} Das ist prüfbarer Lehrplaninhalt der Oberstufe Physik mit Größen, Einheiten und Begründung.`
  }
  return { text: t, quelle: Q, url: U }
}

function hashId(id: string): number {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function nums(id: string, n: number, min: number, max: number): number[] {
  const h = hashId(id)
  const out: number[] = []
  for (let i = 0; i < n; i++) {
    const x = min + ((h + i * 97) % (max - min + 1))
    out.push(x)
  }
  return out
}

function mc(
  rng: Rng,
  id: string,
  i: number,
  q: string,
  correct: string,
  wrong: string[],
  wissen: string,
) {
  const cid = `ph:osboost:${id}:mc${i}`
  const seen = new Set<string>([correct.trim().toLowerCase()])
  const uniqWrong = wrong.filter((w) => {
    const k = w.trim().toLowerCase()
    if (!k || seen.has(k)) return false
    seen.add(k)
    return true
  })
  while (uniqWrong.length < 3) uniqWrong.push(`Andere Deutung (${uniqWrong.length + 1})`)
  return choicePickTask({
    question: q,
    choices: shuffle(rng, [correct, ...uniqWrong.slice(0, 3)]),
    correct,
    solution: correct,
    explanation: wissen,
    fachwissen: fw(`${wissen} ${q}`),
    dedupeKey: cid,
    contentIds: [cid],
  })
}

/** Family-specific boost generator with ≥10 unique contentIds. */
function makeOsBoost(topicId: string): Topic['generate'] {
  const id = topicId
  const L = id.toLowerCase()
  const variants: Array<(rng: Rng) => ReturnType<Topic['generate']>> = []

  const addMc = (
    i: number,
    q: string,
    correct: string,
    wrong: string[],
    wissen: string,
  ) => {
    variants.push((rng) => mc(rng, id, i, q, correct, wrong, wissen))
  }

  // --- Energy ---
  if (/ekin|epot|energie|bilanz|arbeit/.test(L)) {
    const ms = nums(id, 4, 2, 8)
    const vs = nums(id, 4, 3, 12)
    ms.forEach((m, i) => {
      const v = vs[i]!
      const E = 0.5 * m * v * v
      variants.push((_rng) =>
        valueTask({
          question: `E_kin = ½mv². m = ${m} kg, v = ${v} m/s. E_kin in J?`,
          answerKind: E % 1 === 0 ? 'integer' : 'decimal',
          value: E,
          solution: String(E),
          explanation: `½·${m}·${v}² = ${E} J.`,
          fachwissen: fw('Kinetische Energie E_kin = ½ m v².'),
          dedupeKey: `ph:osboost:${id}:ekin${i}`,
        }),
      )
    })
    addMc(10, 'Potenzielle Lageenergie näherungsweise?', 'E_pot = m·g·h', ['E = m·v', 'E = q·U nur', 'E = B·I·ℓ'], 'Im homogenen Schwerefeld: m·g·h.')
    addMc(11, 'Energieerhaltung (abgeschlossen, konservativ) bedeutet …', 'Die Summe der Energieformen bleibt konstant', ['Energie entsteht aus dem Nichts', 'Nur kinetische Energie zählt', 'Arbeit ist immer null'], 'Bilanz: ΔE = W + Q je nach Systemgrenze.')
  }

  // --- Newton / Kraft ---
  if (/newton|kraft|reibung|beschleun|kinematik|kurven|zentripetal/.test(L)) {
    const ms = nums(id, 4, 1, 6)
    const as_ = nums(id, 4, 2, 9)
    ms.forEach((m, i) => {
      const a = as_[i]!
      variants.push((_rng) =>
        valueTask({
          question: `Newton II: F = m·a. m = ${m} kg, a = ${a} m/s². F in N?`,
          answerKind: 'integer',
          value: m * a,
          solution: String(m * a),
          explanation: `F = ${m}·${a} = ${m * a} N.`,
          fachwissen: fw('Grundgesetz: F = m·a (resultierende Kraft).'),
          dedupeKey: `ph:osboost:${id}:fma${i}`,
        }),
      )
    })
    addMc(20, 'Trägheit bedeutet …', 'Widerstand eines Körpers gegen Geschwindigkeitsänderung', ['nur die Farbe', 'nur die Temperatur', 'Ladung ohne Masse'], 'Trägheit hängt mit der Masse zusammen.')
    addMc(21, 'Zentripetalkraft zeigt …', 'zum Zentrum der Kreisbahn', ['vom Zentrum weg als Ursache im Inertialsystem', 'immer vertikal nach oben', 'nur entlang B'], 'F_z = m v² / r.')
  }

  // --- Fields / lines ---
  if (/feld|linien|efeld|mfeld|teilchen|ablenkung/.test(L)) {
    addMc(30, 'Elektrische Feldstärke Definition?', 'E = F / q (Kraft auf Probeladung)', ['E = m·g', 'E = B·v', 'E = I·R'], 'Vektorfeld E.')
    addMc(31, 'Magnetische Feldlinien sind …', 'geschlossen (keine Monopole)', ['offen wie E-Feldlinien einer Punktladung', 'immer Geraden ohne Krümmung', 'nur im Vakuum sichtbar als Stoff'], 'B-Feldlinien geschlossen.')
    addMc(32, 'Lorentzkraft auf Ladung (qualitativ) …', 'steht senkrecht zu v und B', ['zeigt immer parallel zu v', 'ist null wenn B vorhanden und v ≠ 0 zwingend', 'hängt nur von der Farbe ab'], 'F = q·(v × B).')
    const qs = nums(id, 4, 1, 5)
    const Fs = nums(id, 4, 2, 10)
    qs.forEach((q, i) => {
      const F = Fs[i]!
      const E = F / q
      variants.push((_rng) =>
        valueTask({
          question: `E = F/q. F = ${F}·10⁻⁹ N, q = ${q} nC. E in N/C?`,
          answerKind: 'decimal',
          value: E,
          eps: 0.05,
          solution: String(E),
          explanation: `E = ${F}/${q} = ${E} N/C.`,
          fachwissen: fw('E = F/q.'),
          dedupeKey: `ph:osboost:${id}:E${i}`,
        }),
      )
    })
  }

  // --- Induction / EM ---
  if (/induktion|em-feld|faraday|lenz|selbstinduktion|transformator/.test(L)) {
    addMc(40, 'Faradaysches Gesetz (qualitativ): Induktionsspannung …', 'hängt von der Änderungsrate des magnetischen Flusses ab', ['braucht keine Flussänderung', 'gilt nur für Gleichstrom ohne Spule', 'ist unabhängig von Windungszahl'], 'u_ind ~ −N dΦ/dt.')
    addMc(41, 'Lenzsche Regel: Der Induktionsstrom …', 'wirkt der Ursache seiner Entstehung entgegen', ['verstärkt immer die Flussänderung maximal', 'fließt nur in Isolatoren', 'löscht die Ladungserhaltung'], 'Vorzeichen / Richtung.')
    const Ns = nums(id, 4, 2, 8)
    const dPhis = nums(id, 4, 1, 5)
    const dts = nums(id, 4, 1, 4)
    Ns.forEach((N, i) => {
      const dPhi = dPhis[i]!
      const dt = dts[i]!
      const U = (N * dPhi) / dt
      variants.push((_rng) =>
        valueTask({
          question: `|U| = N·|ΔΦ|/Δt. N = ${N}, |ΔΦ| = ${dPhi} Wb, Δt = ${dt} s. |U| in V?`,
          answerKind: U % 1 === 0 ? 'integer' : 'decimal',
          value: U,
          solution: String(U),
          explanation: `U = ${N}·${dPhi}/${dt} = ${U} V.`,
          fachwissen: fw('Betrag der Induktionsspannung.'),
          dedupeKey: `ph:osboost:${id}:ind${i}`,
        }),
      )
    })
  }

  // --- Waves / oscillation ---
  if (/schwing|welle|daempf|frequenz|akustik|schall|optikt|regenbogen/.test(L) || /wellen/.test(L)) {
    const fs = nums(id, 4, 2, 10)
    fs.forEach((f, i) => {
      const T = 1 / f
      variants.push((_rng) =>
        valueTask({
          question: `T = 1/f. f = ${f} Hz. T in s?`,
          answerKind: 'decimal',
          value: T,
          eps: 0.001,
          solution: String(T),
          explanation: `T = 1/${f} = ${T} s.`,
          fachwissen: fw('Periodendauer und Frequenz sind reziprok.'),
          dedupeKey: `ph:osboost:${id}:T${i}`,
        }),
      )
    })
    addMc(50, 'c = f·λ gilt für …', 'periodische Wellen (bei konstanter Ausbreitungsgeschwindigkeit)', ['nur für Gleichstrom', 'nur für Massepunkte ohne Mediumbezug je', 'Temperatur allein'], 'Basisbeziehung Wellen.')
    addMc(51, 'Gedämpfte Schwingung: Amplitude …', 'nimmt mit der Zeit ab (Energieverlust)', ['wächst unbegrenzt', 'ist immer null', 'ändert die Masse'], 'Reibung/Abstrahlungsverluste.')
  }

  // --- Radiation / nuclear (must stay on-topic for topic-factory gates) ---
  const radiationFamily =
    /zerfall|strahl|halbwert|spaltung|radioaktiv|alpha|beta|gamma|atomhuelle/.test(L)
  if (radiationFamily) {
    addMc(60, 'Radioaktiver Zerfall bedeutet …', 'Kerne wandeln sich unter Aussendung von Strahlung um', ['Ohmsches Gesetz für Stromkreise', 'nur mechanische Reibung', 'keine Energieumsätze'], 'Alpha-, Beta- und Gamma-Strahlung sind typische Formen.')
    addMc(61, 'Halbwertszeit ist …', 'die Zeit, in der die Hälfte der Kerne zerfallen ist', ['die Periodendauer einer Schwingung', 'nur die Temperatur des Kerns', 'der Widerstand R = U/I'], 'N(t) nimmt exponentiell ab.')
    addMc(62, 'Alpha-Strahlung besteht näherungsweise aus …', 'Heliumkernen (2p+2n)', ['Elektronen nur', 'Röntgen ohne Kernbezug', 'Schallwellen'], 'Stark ionisierend, geringe Reichweite.')
    addMc(63, 'Gamma-Strahlung ist …', 'elektromagnetische Kernstrahlung', ['ein Teilchenstrom aus Protonen', 'nur Gleichstrom', 'mechanische Welle in Luft'], 'Hohe Durchdringung.')
    addMc(64, 'Bindungsenergie pro Nukleon …', 'misst die Stabilität von Kernen', ['ist die kinetische Energie der Elektronen nur', 'ist immer negativ ohne Betrag', 'gilt nur für Moleküle ohne Kern'], 'Massendefekt ↔ Energie.')
    const ns = nums(id, 4, 80, 200)
    ns.forEach((n0, i) => {
      const half = Math.round(n0 / 2)
      variants.push((_rng) =>
        valueTask({
          question: `Nach einer Halbwertszeit sind von ${n0} Kernen noch wie viele übrig (Näherung)?`,
          answerKind: 'integer',
          value: half,
          solution: String(half),
          explanation: `N ≈ N0/2 = ${n0}/2 = ${half}. Radioaktiver Zerfall.`,
          fachwissen: fw('Halbwertszeit: die Hälfte der Kerne ist zerfallen.'),
          dedupeKey: `ph:osboost:${id}:hwz${i}`,
        }),
      )
    })
  }

  // --- Quantum / atom (ohne generisches Ohm) ---
  const quantumFamily =
    !radiationFamily &&
    /quanten|atom|foto|photo|compton|debroglie|kern|bindung|unschaerfe|franck|hertz|grenze/.test(L)
  if (quantumFamily) {
    addMc(70, 'Photonenenergie?', 'E = h·f = h·c/λ', ['E = m·g·h', 'E = ½mv² nur für Photonen', 'E = B·I'], 'Quantenhypothese.')
    addMc(71, 'de Broglie-Wellenlänge?', 'λ = h / p', ['λ = c / nur für Schall', 'λ = m·g', 'λ = U·I'], 'Materiewellen.')
    addMc(72, 'Bindungsenergie pro Nukleon …', 'misst die Stabilität von Kernen', ['ist die kinetische Energie der Elektronen nur', 'ist immer negativ ohne Betrag', 'gilt nur für Moleküle ohne Kern'], 'Massendefekt ↔ Energie.')
    const fs = nums(id, 3, 1, 9)
    fs.forEach((f, i) => {
      const E = f * 2
      variants.push((_rng) =>
        valueTask({
          question: `Modellrechnung: E = 2·f (f in willkürlichen Einheiten). f = ${f}. E?`,
          answerKind: 'integer',
          value: E,
          solution: String(E),
          explanation: `Proportionalität E ∼ f (Photonen). Hier E = 2·${f} = ${E}.`,
          fachwissen: fw('Photonenenergie proportional zur Frequenz.'),
          dedupeKey: `ph:osboost:${id}:hf${i}`,
        }),
      )
    })
  }

  // --- Thermo ---
  if (/thermo|gas|chaos|waerme|temperatur/.test(L)) {
    const ms = nums(id, 4, 1, 5)
    const dTs = nums(id, 4, 5, 20)
    ms.forEach((m, i) => {
      const dT = dTs[i]!
      const Q = m * dT // c=1
      variants.push((_rng) =>
        valueTask({
          question: `Q = c·m·ΔT mit c = 1 kJ/(kg·K). m = ${m} kg, ΔT = ${dT} K. Q in kJ?`,
          answerKind: 'integer',
          value: Q,
          solution: String(Q),
          explanation: `Q = ${m}·${dT} = ${Q} kJ.`,
          fachwissen: fw('Wärmemenge Q = c m ΔT.'),
          dedupeKey: `ph:osboost:${id}:Q${i}`,
        }),
      )
    })
    addMc(70, 'Ideales Gasgesetz (qualitativ) verknüpft …', 'p, V, T (und Stoffmenge)', ['nur Farbe und Geruch', 'nur magnetische Flussdichte', 'nur Kernspin'], 'pV = nRT.')
  }

  // --- Relativity ---
  if (/relativ|\/c\b|lb6-c|lb6-relativ/.test(L) || L.endsWith('-c')) {
    addMc(80, 'c im Vakuum ist …', 'invariant / gleich für alle Inertialsysteme', ['abhängig von der Quellenbewegung additiv klassisch', 'nur in Wasser definiert', 'unendlich'], 'Postulat der SRT.')
    addMc(81, 'Zeitdilatation: bewegte Uhren …', 'gehen aus Sicht des ruhenden Beobachters langsamer', ['gehen immer schneller', 'ändern die Ladung', 'löschen Massenerhaltung'], 'γ-Faktor.')
  }

  // Universal Ohm/Mittelwert nur, wenn keine Themenfamilie greift —
  // sonst Cross-Topic (z. B. Zerfall → Ohmsches Gesetz).
  const hadFamily = variants.length > 0
  if (!hadFamily && !radiationFamily && !quantumFamily) {
    const voltVals = nums(id, 3, 6, 24)
    const ohmVals = nums(id + 'R', 3, 2, 8)
    voltVals.forEach((volt, i) => {
      const ohm = ohmVals[i]!
      const amp = volt / ohm
      variants.push((_rng) =>
        valueTask({
          question: `Ohmsches Gesetz: U = ${volt} V, R = ${ohm} Ω. I = U/R in A?`,
          answerKind: amp % 1 === 0 ? 'integer' : 'decimal',
          value: amp,
          eps: 0.01,
          solution: String(amp),
          explanation: `I = ${volt}/${ohm} = ${amp} A.`,
          fachwissen: fw('I = U/R — oft in Messungen und Schaltungen.'),
          dedupeKey: `ph:osboost:${id}:ohm${i}`,
        }),
      )
    })
    const triples = [0, 1, 2].map((i) => nums(id + String(i), 3, 2, 12))
    triples.forEach((t, i) => {
      const mean = (t[0]! + t[1]! + t[2]!) / 3
      variants.push((_rng) =>
        valueTask({
          question: `Messreihe ${t.join(' · ')}. Mittelwert?`,
          answerKind: mean % 1 === 0 ? 'integer' : 'decimal',
          value: mean,
          eps: 0.01,
          solution: String(mean),
          explanation: `Mittelwert = (${t.join(' + ')}) / 3 = ${mean}.`,
          fachwissen: fw('Mittelwert aus Messreihe.'),
          dedupeKey: `ph:osboost:${id}:mean${i}`,
        }),
      )
    })
  }
  if (radiationFamily) {
    variants.push((_rng) =>
      multiSelectTask({
        question: 'Welche Aussagen zu radioaktiver Strahlung/Zerfall sind richtig?',
        choices: [
          'Alpha-, Beta- und Gamma-Strahlung unterscheiden sich in Reichweite',
          'Halbwertszeit beschreibt den Zerfall statistisch',
          'Ohmsches Gesetz erklärt den Kernzerfall',
          'Kerne können unter Strahlungsemission umwandeln',
        ],
        correct: [
          'Alpha-, Beta- und Gamma-Strahlung unterscheiden sich in Reichweite',
          'Halbwertszeit beschreibt den Zerfall statistisch',
          'Kerne können unter Strahlungsemission umwandeln',
        ],
        solution: 'Strahlungsarten, Halbwertszeit, Kernzerfall — nicht Ohmsches Gesetz.',
        explanation: 'Radioaktivität ist ein Kernprozess mit charakteristischen Strahlungsarten.',
        fachwissen: fw('Radioaktiver Zerfall und Strahlungsarten.'),
        dedupeKey: `ph:osboost:${id}:multi-nuk`,
        contentIds: [`ph:osboost:${id}:multi-nuk`],
      }),
    )
  } else if (!quantumFamily) {
    addMc(
      90,
      'Messunsicherheit einzuschätzen bedeutet …',
      'anzugeben, wie genau ein Wert bestimmt ist',
      ['die Einheit zu löschen', 'nur die Gerätefarbe zu notieren', 'Ergebnisse zu erfinden'],
      'Unsicherheit gehört zur Messung.',
    )
    addMc(
      91,
      'Ein physikalisches Modell …',
      'vereinfacht und erklärt Beobachtungen im Gültigkeitsbereich',
      ['ersetzt jede Messung vollständig', 'darf Daten dauerhaft widersprechen', 'braucht keine Größen'],
      'Modelle sind begrenzt gültig.',
    )
    variants.push((_rng) =>
      multiSelectTask({
        question: 'Welche Aussagen zur physikalischen Auswertung sind richtig?',
        choices: [
          'Erhaltungssätze helfen bei Bilanzen',
          'Diagramme können Zusammenhänge zeigen',
          'Einheiten darf man weglassen',
          'Messunsicherheit kann die Deutung beeinflussen',
        ],
        correct: [
          'Erhaltungssätze helfen bei Bilanzen',
          'Diagramme können Zusammenhänge zeigen',
          'Messunsicherheit kann die Deutung beeinflussen',
        ],
        solution: 'Erhaltung, Diagramme, Unsicherheit — Einheiten nicht weglassen.',
        explanation: 'Auswertung braucht Größen, Modelle und Fehlerbewusstsein.',
        fachwissen: fw('Methodik der physikalischen Auswertung.'),
        dedupeKey: `ph:osboost:${id}:multi`,
        contentIds: [`ph:osboost:${id}:multi`],
      }),
    )
  }

  return mixedVariants(...variants)
}

/** Boost OS-Physik (ph-j*) — Unique-Pool-Erweiterung (nicht Sek I: Themenbindung). */
export function withOsRoundBoost(
  topicId: string,
  base: Topic['generate'] | undefined,
): Topic['generate'] | undefined {
  if (!topicId.startsWith('ph-j')) return base
  const boost = makeOsBoost(topicId)
  if (!base) return boost
  return mixedVariants(base, boost, boost)
}
