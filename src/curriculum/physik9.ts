import { pick, randInt, type Rng } from '../lib/rng'
import {
  choicePickTask,
  dragDropSortTask,
  mixedVariants,
  multiSelectTask,
  numberLineTask,
  paramSliderTask,
  valueTask,
} from './taskHelpers'
import type { Topic } from './types'

const shuffleChoices = (rng: Rng, choices: string[], correct: string): string[] => {
  const list = [...choices]
  for (let i = list.length - 1; i > 0; i--) {
    const j = randInt(rng, 0, i)
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  if (!list.includes(correct)) list[0] = correct
  return list
}

/** LB1 — Grundlagen der Elektronik */
const elektronik: Topic['generate'] = mixedVariants(
  (rng) => {
    const forward = pick(rng, [true, false])
    const correct = forward
      ? 'Strom fließt in Durchlassrichtung'
      : 'Strom fließt praktisch nicht (Sperrrichtung)'
    return choicePickTask({
      question: forward
        ? 'Eine Diode ist in Durchlassrichtung gepolt. Was passiert?'
        : 'Eine Diode ist in Sperrrichtung gepolt. Was passiert?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          forward
            ? 'Strom fließt praktisch nicht (Sperrrichtung)'
            : 'Strom fließt in Durchlassrichtung',
          'Die Diode speichert elektrische Energie',
          'Die Diode wird zum Transistor',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Eine Diode lässt Strom vor allem in einer Richtung durch (Durchlass) und sperrt in der anderen (Sperr).',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Wozu dient ein Transistor typischerweise in einfachen Schaltungen?',
        correct: 'als Schalter oder Verstärker',
        wrong: ['als reine Energiequelle', 'nur als Glühlampe', 'als mechanisches Zahnrad'],
      },
      {
        q: 'Welche Aussage zum Transistor stimmt qualitativ?',
        correct: 'Ein kleiner Steuerstrom kann einen größeren Laststrom steuern',
        wrong: [
          'Ein Transistor speichert nur Wärme',
          'Ein Transistor lässt Strom nur in eine Richtung durch wie eine Diode',
          'Ein Transistor braucht keine Anschlüsse',
        ],
      },
      {
        q: 'Wie viele Anschlüsse hat ein bipolarer Transistor typischerweise?',
        correct: 'drei (Basis, Emitter, Kollektor)',
        wrong: ['einen', 'zwei (wie eine Diode)', 'fünf'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Transistoren steuern/verstärken Ströme; bipolare Typen haben Basis, Emitter und Kollektor.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Warum leuchtet eine LED nur bei richtiger Polung?',
        correct: 'Sie ist eine Diode und leuchtet vor allem in Durchlassrichtung',
        wrong: [
          'Sie braucht keinen Strom',
          'Sie leuchtet nur in Sperrrichtung',
          'Sie funktioniert nur ohne Spannung',
        ],
      },
      {
        q: 'Was bedeutet LED?',
        correct: 'lichtemittierende Diode',
        wrong: ['lange elektrische Dose', 'luftempfindlicher Draht', 'leistungsfreie Einheit'],
      },
      {
        q: 'Welche Aussage zur LED stimmt?',
        correct: 'Eine LED wandelt elektrische Energie teilweise in Licht um',
        wrong: [
          'Eine LED speichert nur mechanische Energie',
          'Eine LED erzeugt Strom aus Wärme allein',
          'Eine LED ist ein reiner Widerstand ohne Halbleiter',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'LED = lichtemittierende Diode: leuchtet in Durchlassrichtung.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LB2 — Energieversorgung */
const versorgung: Topic['generate'] = mixedVariants(
  (rng) => {
    const pairs = [
      { nutz: 40, zu: 100 },
      { nutz: 30, zu: 100 },
      { nutz: 45, zu: 90 },
      { nutz: 25, zu: 50 },
      { nutz: 60, zu: 100 },
      { nutz: 36, zu: 90 },
    ] as const
    const { nutz, zu } = pick(rng, [...pairs])
    const eta = (nutz / zu) * 100
    return valueTask({
      question: `Ein Kraftwerk liefert nutzbare Energie E_nutz = ${nutz} MJ bei zugeführter Energie E_zu = ${zu} MJ. Berechne den Wirkungsgrad η = E_nutz / E_zu in Prozent.`,
      answerKind: 'integer',
      unit: '%',
      value: eta,
      solution: `${eta} %`,
      explanation: `η = E_nutz / E_zu = ${nutz} / ${zu} = ${eta / 100} → ${eta} %.`,
    })
  },
  (rng) => {
    const chains = [
      [
        { label: 'Brennstoff / Primärenergie', value: 1 },
        { label: 'Wärme / Dampf', value: 2 },
        { label: 'Turbine / Generator', value: 3 },
        { label: 'elektrische Energie', value: 4 },
      ],
      [
        { label: 'Kohle verbrennen', value: 1 },
        { label: 'Wasser erhitzen', value: 2 },
        { label: 'Dampf treibt Turbine', value: 3 },
        { label: 'Generator erzeugt Strom', value: 4 },
      ],
    ] as const
    const ordered = pick(rng, [...chains])
    const items = [...ordered]
    const correctOrder = ordered.map((_, i) => i)
    return dragDropSortTask({
      question: 'Ordne die typische Kraftwerkskette (Anfang → Ende).',
      items,
      correctOrder,
      solution: ordered.map((row) => row.label).join(' → '),
      explanation: 'Primärenergie → Wärme/Dampf → Turbine/Generator → elektrische Energie.',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Aussagen zu fossilen und erneuerbaren Energien stimmen? (mehrere möglich)',
      choices: [
        'Fossile Energieträger entstehen über geologische Zeiträume und sind endlich',
        'Wind und Sonne zählen zu den erneuerbaren Energiequellen',
        'Beim Verbrennen fossiler Brennstoffe entstehen typischerweise Abgase/CO₂',
        'Erneuerbare Energien sind immer ohne Technik nutzbar',
        'Kohle und Erdöl sind erneuerbar innerhalb weniger Tage',
      ],
      correct: [
        'Fossile Energieträger entstehen über geologische Zeiträume und sind endlich',
        'Wind und Sonne zählen zu den erneuerbaren Energiequellen',
        'Beim Verbrennen fossiler Brennstoffe entstehen typischerweise Abgase/CO₂',
      ],
      solution:
        'Fossil = endlich + Abgase; Wind/Sonne erneuerbar. Nicht: „ohne Technik“ oder „Kohle in Tagen erneuerbar“.',
      explanation:
        'Fossile Quellen sind endlich und erzeugen bei Verbrennung Abgase; Wind und Sonne sind erneuerbar, brauchen aber Anlagen.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
)

/** LB3 — Bewegungsgesetze */
const bewegung: Topic['generate'] = mixedVariants(
  (rng) => {
    const v = pick(rng, [2, 3, 4, 5, 6, 8, 10, 12])
    const t = pick(rng, [2, 3, 4, 5, 6, 8])
    const s = v * t
    const askV = pick(rng, [true, false])
    if (askV) {
      return valueTask({
        question: `Ein Körper legt s = ${s} m in t = ${t} s gleichförmig zurück. Berechne v = s / t.`,
        answerKind: 'integer',
        unit: 'm/s',
        value: v,
        solution: `${v} m/s`,
        explanation: `v = s / t = ${s} / ${t} = ${v} m/s.`,
      })
    }
    return valueTask({
      question: `Ein Körper bewegt sich gleichförmig mit v = ${v} m/s für t = ${t} s. Berechne s = v · t.`,
      answerKind: 'integer',
      unit: 'm',
      value: s,
      solution: `${s} m`,
      explanation: `s = v · t = ${v} · ${t} = ${s} m.`,
    })
  },
  (rng) => {
    const pairs = [
      { v0: 0, v: 10, t: 5 },
      { v0: 2, v: 8, t: 3 },
      { v0: 0, v: 12, t: 4 },
      { v0: 4, v: 16, t: 4 },
      { v0: 5, v: 15, t: 5 },
      { v0: 0, v: 20, t: 4 },
    ] as const
    const { v0, v, t } = pick(rng, [...pairs])
    const a = (v - v0) / t
    return valueTask({
      question: `Ein Körper beschleunigt von v₀ = ${v0} m/s auf v = ${v} m/s in t = ${t} s. Berechne a = (v − v₀) / t.`,
      answerKind: 'integer',
      unit: 'm/s²',
      value: a,
      solution: `${a} m/s²`,
      explanation: `a = (v − v₀) / t = (${v} − ${v0}) / ${t} = ${a} m/s².`,
    })
  },
  (rng) => {
    const v = pick(rng, [3, 4, 5, 6, 8, 10])
    const t = pick(rng, [2, 3, 4, 5])
    const s = v * t
    return paramSliderTask({
      question: `Stelle Geschwindigkeit und Zeit so ein, dass bei gleichförmiger Bewegung s = v · t = ${s} m gilt (v = ${v} m/s, t = ${t} s).`,
      params: [
        {
          id: 'v',
          label: 'Geschwindigkeit v (m/s)',
          min: 1,
          max: 12,
          step: 1,
          start: v === 5 ? 3 : 5,
        },
        {
          id: 't',
          label: 'Zeit t (s)',
          min: 1,
          max: 8,
          step: 1,
          start: t === 3 ? 2 : 3,
        },
      ],
      correct: { v, t },
      solution: `v = ${v} m/s, t = ${t} s → s = ${s} m`,
      explanation: `s = v · t = ${v} · ${t} = ${s} m. Beide Werte müssen passen.`,
      instruction: 'Schieberegler auf die geforderten Werte:',
    })
  },
)

/** LB4 — Physikalisches Praktikum */
const praktikum: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Was versteht man unter einem Messfehler?',
        correct: 'Abweichung des Messwerts vom wahren Wert',
        wrong: [
          'immer absichtliches Fälschen',
          'nur der Mittelwert der Messreihe',
          'die Einheit der Messgröße',
        ],
      },
      {
        q: 'Wie verringert man zufällige Messfehler oft?',
        correct: 'mehrfach messen und Mittelwert bilden',
        wrong: [
          'nur einmal messen und nie wiederholen',
          'die Einheit weglassen',
          'immer die größte Zahl nehmen',
        ],
      },
      {
        q: 'Welcher Tipp hilft gegen grobe Bedienfehler?',
        correct: 'Messgerät richtig ablesen und Messbereich prüfen',
        wrong: [
          'Augen beim Messen schließen',
          'Einheiten willkürlich wechseln',
          'Ergebnisse ohne Kontrolle übernehmen',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Messfehler = Abweichung vom wahren Wert; Wiederholen und sorgfältiges Ablesen reduzieren Fehler.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const series = pick(rng, [
      [
        { label: 'Messung 1: t = 1 s, s = 2 m', value: 1 },
        { label: 'Messung 2: t = 2 s, s = 4 m', value: 2 },
        { label: 'Messung 3: t = 3 s, s = 6 m', value: 3 },
        { label: 'Messung 4: t = 4 s, s = 8 m', value: 4 },
      ],
      [
        { label: 't = 0 s: v = 0 m/s', value: 0 },
        { label: 't = 2 s: v = 4 m/s', value: 2 },
        { label: 't = 4 s: v = 8 m/s', value: 4 },
        { label: 't = 6 s: v = 12 m/s', value: 6 },
      ],
    ])
    const items = [...series]
    const correctOrder = series.map((_, i) => i)
    return dragDropSortTask({
      question: 'Ordne die Messreihe nach steigender Zeit (früh → spät).',
      items,
      correctOrder,
      solution: series.map((row) => row.label).join(' → '),
      explanation: 'Messreihen werden nach der unabhängigen Größe (hier Zeit) geordnet.',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Beim Versuch „Feder auslenken und Federkraft messen“: Was ist typischerweise die abhängige Variable?',
        correct: 'Federkraft (wird gemessen)',
        wrong: ['Auslenkung (wird eingestellt)', 'die Raumnummer', 'die Uhrzeit ohne Bezug'],
      },
      {
        q: 'Beim Versuch „Weg-Zeit bei konstanter Geschwindigkeit“: Was ist oft die abhängige Variable?',
        correct: 'zurückgelegter Weg s',
        wrong: ['eingestellte Zeit t', 'die Farbe des Wagens', 'der Name der Gruppe'],
      },
      {
        q: 'Was kennzeichnet die abhängige Variable in einem Experiment?',
        correct: 'Sie ändert sich als Folge der eingestellten Größe',
        wrong: [
          'Sie wird immer festgehalten und nie gemessen',
          'Sie ist immer die Zeit',
          'Sie hat keine Einheit',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Unabhängige Variable wird eingestellt; abhängige Variable wird als Folge gemessen.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LBW — Natürliche Radioaktivität */
const radioaktivitaet: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Welche Strahlung wird schon durch ein Blatt Papier weitgehend abgeschirmt?',
        correct: 'Alphastrahlung',
        wrong: ['Gammastrahlung', 'Röntgenstrahlung im Weltraum', 'sichtbares Licht'],
      },
      {
        q: 'Welche Strahlung braucht typischerweise dickeres Material (z. B. Blei) zur Abschirmung?',
        correct: 'Gammastrahlung',
        wrong: ['Alphastrahlung', 'Schallwellen in Luft', 'Wasserwellen'],
      },
      {
        q: 'Betastrahlung lässt sich im Vergleich zu Alphastrahlung …',
        correct: 'schwerer abschirmen (z. B. mit Metallblech)',
        wrong: [
          'leichter abschirmen als Alpha',
          'gar nicht abschirmen',
          'immer nur mit Papier stoppen wie Alpha',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Alpha: Papier reicht oft; Beta: Metallblech; Gamma: dicke Abschirmung (z. B. Blei).',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const ordered = pick(rng, [
      [
        { label: 'Alpha (leicht abschirmbar)', value: 1 },
        { label: 'Beta (mittlere Abschirmung)', value: 2 },
        { label: 'Gamma (starke Abschirmung nötig)', value: 3 },
      ],
      [
        { label: 'α: Papier', value: 1 },
        { label: 'β: Aluminiumblech', value: 2 },
        { label: 'γ: dicke Bleischicht', value: 3 },
      ],
    ])
    const items = [...ordered]
    const correctOrder = ordered.map((_, i) => i)
    return dragDropSortTask({
      question: 'Ordne nach steigendem Abschirmaufwand (leicht → schwer).',
      items,
      correctOrder,
      solution: ordered.map((row) => row.label).join(' → '),
      explanation: 'Typisch: Alpha am leichtesten, dann Beta, Gamma am aufwendigsten abzuschirmen.',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Aussagen zu α-, β- und γ-Strahlung stimmen qualitativ? (mehrere möglich)',
      choices: [
        'Alphastrahlung besteht aus Heliumkernen',
        'Gammastrahlung ist elektromagnetische Strahlung',
        'Alphastrahlung wird oft schon durch Papier abgeschirmt',
        'Gammastrahlung lässt sich immer mit einem Blatt Papier stoppen',
        'Betastrahlung sind Elektronen oder Positronen',
      ],
      correct: [
        'Alphastrahlung besteht aus Heliumkernen',
        'Gammastrahlung ist elektromagnetische Strahlung',
        'Alphastrahlung wird oft schon durch Papier abgeschirmt',
        'Betastrahlung sind Elektronen oder Positronen',
      ],
      solution:
        'α = Heliumkerne (Papier); β = e±; γ = EM-Strahlung (nicht mit Papier stoppen).',
      explanation:
        'Falsch ist, dass Gamma mit Papier gestoppt wird. Alpha/Beta/Gamma unterscheiden sich stark in der Abschirmbarkeit.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
)

/** LBW — Energie von Wind und Sonne */
const windSonne: Topic['generate'] = mixedVariants(
  (_rng) =>
    multiSelectTask({
      question: 'Welche Vorteile haben Wind- und Sonnenenergie oft? (mehrere möglich)',
      choices: [
        'keine direkten CO₂-Emissionen im Betrieb',
        'erneuerbar / nachwachsend im Sinne der Sonneneinstrahlung und des Windes',
        'unabhängig von Wetter und Nacht immer konstant verfügbar',
        'reduzieren den Verbrauch fossiler Brennstoffe',
        'brauchen keinerlei Anlagen oder Flächen',
      ],
      correct: [
        'keine direkten CO₂-Emissionen im Betrieb',
        'erneuerbar / nachwachsend im Sinne der Sonneneinstrahlung und des Windes',
        'reduzieren den Verbrauch fossiler Brennstoffe',
      ],
      solution:
        'Vorteile: wenig Betriebs-CO₂, erneuerbar, weniger Fossilverbrauch. Nicht: immer konstant oder ohne Anlagen.',
      explanation:
        'Wind und Sonne sind erneuerbar und im Betrieb emissionsarm, aber wetterabhängig und brauchen Technik/Fläche.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
  (rng) => {
    const cases = [
      {
        q: 'Welcher Vorteil trifft typischerweise auf Photovoltaik zu?',
        correct: 'wandelt Sonnenlicht direkt in elektrische Energie um',
        wrong: [
          'verbrennt Kohle besonders effizient',
          'erzeugt nur mechanische Schwingungen ohne Nutzen',
          'funktioniert nur unter der Erde ohne Licht',
        ],
      },
      {
        q: 'Welcher Vorteil trifft typischerweise auf Windkraft zu?',
        correct: 'nutzt kinetische Energie der Luftströmung',
        wrong: [
          'braucht immer fossilen Brennstoff im Rotor',
          'erzeugt Strom nur aus Erdöl',
          'funktioniert nur ohne Wind',
        ],
      },
      {
        q: 'Was ist ein gemeinsamer Vorteil von Wind und Sonne?',
        correct: 'sie gelten als erneuerbare Energiequellen',
        wrong: [
          'sie sind in wenigen Jahren endgültig verbraucht',
          'sie erzeugen immer gleich viel Strom rund um die Uhr',
          'sie brauchen keine Umwandlungstechnik',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'PV und Wind nutzen erneuerbare Quellen und ersetzen teilweise fossile Energien.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = pick(rng, [
      'Speicher und Netze helfen bei schwankendem Angebot',
      'Standort und Wetter beeinflussen den Ertrag',
      'Kombination mehrerer Quellen kann Versorgung sichern',
    ])
    return choicePickTask({
      question: 'Welche Aussage zur Nutzung von Wind und Sonne stimmt?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Wind und Sonne schwanken nie',
          'Ohne Netz und Speicher ist Schwankung kein Thema',
          'Erneuerbare Energien brauchen keine Planung',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Angebot schwankt; Speicher, Netze und Mix aus Quellen verbessern die Versorgung.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LBW — Bewegungen auf gekrümmten Bahnen */
const kurven: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Wohin zeigt die Zentripetalkraft bei gleichförmiger Kreisbewegung?',
        correct: 'zum Kreismittelpunkt',
        wrong: ['tangential in Bewegungsrichtung', 'vom Mittelpunkt weg', 'senkrecht nach oben immer'],
      },
      {
        q: 'Was bewirkt die Zentripetalkraft qualitativ?',
        correct: 'sie hält den Körper auf der Kreisbahn (ändert die Richtung von v)',
        wrong: [
          'sie erhöht immer nur den Betrag von v ohne Richtungsänderung',
          'sie wirkt nur bei gerader Bahn',
          'sie ist immer null auf der Kreisbahn',
        ],
      },
      {
        q: 'Ohne Zentripetalkraft würde ein Körper auf der Kreisbahn …',
        correct: 'geradlinig (tangential) weiterfliegen',
        wrong: [
          'sofort zum Mittelpunkt fallen und dort bleiben',
          'eine engere Kreisbahn von allein finden',
          'die Geschwindigkeit verdoppeln müssen',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Zentripetalkraft zeigt zum Mittelpunkt und ändert die Richtung der Geschwindigkeit.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const pairs = [
      { r: 2, T: 4 },
      { r: 3, T: 6 },
      { r: 5, T: 10 },
      { r: 4, T: 8 },
      { r: 6, T: 3 },
    ] as const
    const { r, T } = pick(rng, [...pairs])
    // v = 2πr / T — ask for Umfang U = 2πr näherungsweise mit π≈3 → U = 6r, dann v = U/T
    const u = 6 * r
    const v = u / T
    return valueTask({
      question: `Ein Körper läuft auf einem Kreis mit Radius r = ${r} m in der Periodendauer T = ${T} s. Näherung π ≈ 3: Umfang U ≈ 6 · r. Berechne die Bahngeschwindigkeit v = U / T.`,
      answerKind: 'integer',
      unit: 'm/s',
      value: v,
      solution: `${v} m/s`,
      explanation: `U ≈ 6 · ${r} = ${u} m; v = U / T = ${u} / ${T} = ${v} m/s.`,
    })
  },
  (rng) => {
    const v = pick(rng, [3, 4, 5, 6, 8, 10])
    return numberLineTask({
      question: `Stelle die Bahngeschwindigkeit v = ${v} m/s auf dem Zahlenstrahl ein.`,
      min: 0,
      max: 12,
      step: 1,
      value: v,
      solution: `${v} m/s`,
      explanation: `Die Markierung liegt bei v = ${v} m/s.`,
    })
  },
)

export const PHYSIK_K9_GENERATORS: Record<string, Topic['generate']> = {
  'ph-k9-lb1-elektronik': elektronik,
  'ph-k9-lb2-versorgung': versorgung,
  'ph-k9-lb3-bewegung': bewegung,
  'ph-k9-lb4-praktikum': praktikum,
  'ph-k9-lbw-radioaktivitaet': radioaktivitaet,
  'ph-k9-lbw-wind-sonne': windSonne,
  'ph-k9-lbw-kurven': kurven,
}
