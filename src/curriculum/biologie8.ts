/**
 * Biologie Klasse 8 — Sinne/Nerven/Hormone, Sexualität (+ Wahl).
 * Quiz-Ideen analog Schulportale (Sinne, Hormone, Sexualität) → Lehrplan-LB.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const sinne: BioBank = {
  quelle: 'Wikipedia: Sinnesorgan',
  url: 'https://de.wikipedia.org/wiki/Sinnesorgan',
  facts: [
    {
      concept: 'bio:k8:welche-aufgabe-haben-sinnesorgane',
      prompt: 'Welche Aufgabe haben Sinnesorgane?',
      answer: 'Reize aus der Umwelt aufnehmen und ans Nervensystem weitergeben',
      wrong: ['Nur Blut filtern', 'Nur Knochen bilden', 'Nur Enzyme im Magen ersetzen'],
      explanation: 'Sinne wandeln Reize in Nervensignale um.',
      wissen: 'Auge, Ohr, Haut, Zunge, Nase — Übersicht.',
      gap: 'Lichtreize werden im ___ verarbeitet (Sehsinn).',
      gapAccepted: ['Auge', 'Auge/Retina', 'Auge (Netzhaut)'],
    },
    {
      concept: 'bio:k8:wozu-dient-das-gehirn-im-nervensystem',
      prompt: 'Wozu dient das Gehirn im Nervensystem?',
      answer: 'Verarbeitung von Informationen und Steuerung',
      wrong: ['Nur Speichelproduktion', 'Nur Urinbildung', 'Nur Pollenflug'],
      explanation: 'Zentrales Steuer- und Verarbeitungsorgan.',
      wissen: 'Nervensystem: Aufnahme – Leitung – Verarbeitung – Reaktion.',
    },
    {
      concept: 'bio:k8:was-transportieren-hormone-typischerweis',
      prompt: 'Was transportieren Hormone typischerweise?',
      answer: 'Botenstoffe über das Blut zu Zielorganen',
      wrong: ['Nur festen Knochenkalk', 'Nur Luft in die Lungenbläschen', 'Nur Chitin'],
      explanation: 'Hormonsystem steuert längerfristig als viele Nervenreflexe.',
      wissen: 'Vergleich Nerven- vs. Hormonsystem.',
      gap: 'Hormone gelangen über das ___ zu ihren Zielzellen.',
      gapAccepted: ['Blut', 'Blutbahn', 'Blutgefäßsystem'],
    },
    {
      concept: 'bio:k8:ein-reflex-ist',
      prompt: 'Ein Reflex ist …',
      answer: 'eine schnelle, oft unwillkürliche Reaktion auf einen Reiz',
      wrong: ['immer eine bewusste Entscheidung nach Stunden', 'nur Fotosynthese', 'nur Verdauung im Dickdarm'],
      explanation: 'Reflexbögen ermöglichen schnelle Schutzreaktionen.',
      wissen: 'Informationsverarbeitung im Nervensystem.',
    },
  ],
  pairs: [
    { term: 'Netzhaut', meaning: 'Lichtempfindliche Schicht im Auge', wissen: 'Zapfen und Stäbchen.' },
    { term: 'Hörschnecke', meaning: 'Wandelt Schall im Innenohr um', wissen: 'Gehörsinn.' },
    { term: 'Nervenzelle', meaning: 'Leitet elektrische Signale', wissen: 'Grundeinheit des Nervensystems.' },
    { term: 'Hormon', meaning: 'Chemischer Botenstoff', wissen: 'Wirkt an Zielzellen mit Rezeptoren.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k8:hormone-wirken-immer-nur-an-der-stelle-a',
      statement: 'Hormone wirken immer nur an der Stelle, an der sie gebildet werden.',
      correct: false,
      explanation: 'Viele Hormone wirken entfernt über die Blutbahn.',
      wissen: 'Zielorgane und Rezeptoren.',
    },
  ],
  sorts: [
    {
      concept: 'bio:k8:ordne-den-vereinfachten-weg-eines-lichtr',
      question: 'Ordne den vereinfachten Weg eines Lichtreizes.',
      labels: ['Licht trifft Auge', 'Rezeptoren in der Netzhaut', 'Sehnerv leitet', 'Gehirn verarbeitet'],
      explanation: 'Reiz → Rezeptor → Leitung → Verarbeitung.',
      wissen: 'Informationsweg üben.',
    },
  ],
  multis: [
    {
      concept: 'bio:k8:welche-sinne-gehoeren-zu-den-klassischen',
      question: 'Welche Sinne gehören zu den „klassischen“ fünf?',
      correct: ['Sehen', 'Hören', 'Riechen'],
      wrong: ['Fotosynthese', 'Gärung'],
      explanation: 'Sehen, Hören, Riechen, Schmecken, Tasten.',
      wissen: 'Grundwissen Sinnesorgane.',
    },
  ],
}

const sexualitaet: BioBank = {
  quelle: 'Wikipedia: Menschliche Sexualität',
  url: 'https://de.wikipedia.org/wiki/Menschliche_Sexualit%C3%A4t',
  facts: [
    {
      concept: 'bio:k8:was-ist-mit-verantwortung-in-der-sexuali',
      prompt: 'Was ist mit Verantwortung in der Sexualität gemeint?',
      answer: 'Rücksicht, Einvernehmen, Schutz vor Infektionen und ungewollter Schwangerschaft',
      wrong: ['Nur Gewinnmaximierung', 'Nur Sportrekorde', 'Nur Ernährungsumstellung'],
      explanation: 'Sexualität umfasst Körper, Gefühle und Verantwortung füreinander.',
      wissen: 'Lehrplan: Sexualität des Menschen — sachlich und respektvoll.',
    },
    {
      concept: 'bio:k8:wozu-dienen-geschlechtshormone-u-a',
      prompt: 'Wozu dienen Geschlechtshormone u. a.?',
      answer: 'Steuerung der Geschlechtsentwicklung und -funktionen',
      wrong: ['Nur der Zahnschmelzhärtung', 'Nur der Blattbildung', 'Nur der Knochenmarklosigkeit'],
      explanation: 'Hormone beeinflussen Pubertät und Fortpflanzungsfunktionen.',
      wissen: 'Anbindung an Hormonsystem (LB1).',
      gap: 'In der Pubertät steigen die ___ und lösen körperliche Veränderungen aus.',
      gapAccepted: ['Geschlechtshormone', 'Hormone', 'Sexualhormone'],
    },
    {
      concept: 'bio:k8:was-beschreibt-empfaengnisverhuetung-sac',
      prompt: 'Was beschreibt Empfängnisverhütung sachlich?',
      answer: 'Methoden, ungewollte Schwangerschaft zu vermeiden',
      wrong: ['Nur Impfungen gegen Viren', 'Nur Knochenbruchheilung', 'Nur Blutdruckmessen'],
      explanation: 'Verschiedene Methoden mit unterschiedlicher Sicherheit.',
      wissen: 'Aufklärung ohne moralisierenden Ton — Fakten.',
    },
  ],
  pairs: [
    { term: 'Pubertät', meaning: 'Phase der Geschlechtsreifung', wissen: 'Körperliche und emotionale Veränderungen.' },
    { term: 'Einvernehmen', meaning: 'Gegenseitige Zustimmung', wissen: 'Grundlage respektvoller Beziehungen.' },
    { term: 'STI', meaning: 'Sexuell übertragbare Infektion', wissen: 'Schutz durch Aufklärung und Vorsicht.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k8:ueber-sexualitaet-zu-sprechen-und-fragen',
      statement: 'Über Sexualität zu sprechen und Fragen zu stellen ist im Unterricht erlaubt und sinnvoll.',
      correct: true,
      explanation: 'Sachliche Aufklärung schützt und klärt.',
      wissen: 'Unterrichtsklima.',
    },
    {
      concept: 'bio:k8:nur-erwachsene-haben-hormone',
      statement: 'Nur Erwachsene haben Hormone.',
      correct: false,
      explanation: 'Hormone wirken in jedem Lebensalter — in der Pubertät besonders spürbar.',
      wissen: 'Hormonsystem.',
    },
  ],
  multis: [
    {
      concept: 'bio:k8:welche-aspekte-gehoeren-zu-verantwortlic',
      question: 'Welche Aspekte gehören zu verantwortlicher Sexualität?',
      correct: ['Einvernehmen', 'Schutz vor Infektionen'],
      wrong: ['Druck ausüben', 'Informationen absichtlich verfälschen'],
      explanation: 'Respekt und Schutz sind zentral.',
      wissen: 'Werte und Fakten verbinden.',
    },
  ],
}

const stress: BioBank = {
  quelle: 'Wikipedia: Stress',
  url: 'https://de.wikipedia.org/wiki/Stress',
  facts: [
    {
      concept: 'bio:k8:was-kann-bei-stress-im-koerper-passieren',
      prompt: 'Was kann bei Stress im Körper passieren?',
      answer: 'Erhöhte Anspannung, veränderte Atmung/Puls, Stresshormone',
      wrong: ['Sofortige Fotosynthese', 'Knochen verschwinden', 'Keine Nervensignale mehr'],
      explanation: 'Stress aktiviert Alarmreaktionen — Dauerstress belastet.',
      wissen: 'Wahl: Stress und Stressbewältigung.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k8:entspannungstechniken-und-pausen-koennen',
      statement: 'Entspannungstechniken und Pausen können helfen, Stress zu bewältigen.',
      correct: true,
      explanation: 'Bewegung, Gespräche, Pausen und Struktur sind typische Strategien.',
      wissen: 'Handlungsoptionen.',
    },
  ],
  pairs: [
    { term: 'Akuter Stress', meaning: 'Kurzfristige Alarmreaktion', wissen: 'Kann leistungsfördernd sein.' },
    { term: 'Chronischer Stress', meaning: 'Dauerhafte Überforderung', wissen: 'Gesundheitlich belastend.' },
  ],
}

const sinneWahl: BioBank = {
  quelle: 'Wikipedia: Wahrnehmung',
  url: 'https://de.wikipedia.org/wiki/Wahrnehmung',
  facts: [
    {
      concept: 'bio:k8:warum-ergaenzen-sich-die-sinne-gegenseit',
      prompt: 'Warum ergänzen sich die Sinne gegenseitig?',
      answer: 'Die Wahrnehmung wird genauer und sicherer',
      wrong: ['Weil Knochen dann leuchten', 'Weil Blut dann grün wird', 'Weil Zellen verschwinden'],
      explanation: 'Multisensorik verbessert Orientierung.',
      wissen: 'Wahl: Erleben mit allen Sinnen.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k8:ohne-sehsinn-ist-orientierung-immer-unmo',
      statement: 'Ohne Sehsinn ist Orientierung immer unmöglich.',
      correct: false,
      explanation: 'Andere Sinne und Hilfsmittel ermöglichen Orientierung.',
      wissen: 'Kompensation und Vielfalt der Sinne.',
    },
  ],
}

const ersteHilfe: BioBank = {
  quelle: 'Wikipedia: Erste Hilfe',
  url: 'https://de.wikipedia.org/wiki/Erste_Hilfe',
  facts: [
    {
      concept: 'bio:k8:was-ist-der-erste-schritt-in-vielen-notf',
      prompt: 'Was ist der erste Schritt in vielen Notfallsituationen?',
      answer: 'Absichern und Notruf absetzen (wenn nötig)',
      wrong: ['Sofort weglaufen ohne Hilfe', 'Warten bis morgen', 'Nur fotografieren'],
      explanation: 'Eigene Sicherheit, dann Hilfe holen / leisten.',
      wissen: 'Wahl: Erste Hilfe — Grundregeln.',
      gap: 'In Deutschland lautet die Notrufnummer oft ___.',
      gapAccepted: ['112', '110/112'],
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k8:bei-bewusstlosigkeit-prueft-man-atmung-u',
      statement: 'Bei Bewusstlosigkeit prüft man Atmung und holt Hilfe.',
      correct: true,
      explanation: 'Bewusstlosigkeit ist ein Notfall — Atmung prüfen, Notruf, stabile Seitenlage wenn Atmung vorhanden (Kurswissen).',
      wissen: 'Kursinhalte beachten; hier nur Orientierung.',
    },
  ],
  pairs: [
    { term: 'Notruf', meaning: 'Professionelle Hilfe anfordern', wissen: 'Wichtigste Sofortmaßnahme oft.' },
    { term: 'Wundversorgung', meaning: 'Blutung stillen / schützen', wissen: 'Grundfertigkeit.' },
  ],
}

export const BIOLOGIE_K8_GENERATORS: Record<string, Topic['generate']> = {
  'bi-k8-lb1-sinne': bankGenerate(sinne),
  'bi-k8-lb2-sexualitaet': bankGenerate(sexualitaet),
  'bi-k8-lbw-stress': bankGenerate(stress),
  'bi-k8-lbw-sinne': bankGenerate(sinneWahl),
  'bi-k8-lbw-erste-hilfe': bankGenerate(ersteHilfe),
}
