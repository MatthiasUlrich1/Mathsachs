/**
 * Biologie Klasse 8 — Sinne/Nerven/Hormone, Sexualität (+ Wahl).
 * Quiz-Ideen analog Schulportale → Lehrplan-LB; Fachwissen = reine Fakten.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const sinne: BioBank = {
  quelle: 'Wikipedia: Sinnesorgan',
  url: 'https://de.wikipedia.org/wiki/Sinnesorgan',
  conceptPrefix: 'bio:k8:sinne',
  facts: [
    {
      concept: 'bio:k8:welche-aufgabe-haben-sinnesorgane',
      prompt: 'Welche Aufgabe haben Sinnesorgane?',
      answer: 'Reize aus der Umwelt aufnehmen und ans Nervensystem weitergeben',
      wrong: ['Nur Blut filtern', 'Nur Knochen bilden', 'Nur Enzyme im Magen ersetzen'],
      explanation: 'Sinne wandeln Reize in Nervensignale um.',
      wissen:
        'Sinnesorgane nehmen Reize auf und leiten Signale ans Nervensystem. Auge/Ohr und Hormone → Spezialthemen.',
    },
    {
      concept: 'bio:k8:wozu-dient-das-gehirn-im-nervensystem',
      prompt: 'Wozu dient das Gehirn im Nervensystem?',
      answer: 'Verarbeitung von Informationen und Steuerung',
      wrong: ['Nur Speichelproduktion', 'Nur Urinbildung', 'Nur Pollenflug'],
      explanation: 'Zentrales Steuer- und Verarbeitungsorgan.',
      wissen:
        'Reizaufnahme → Leitung → Verarbeitung im Gehirn/Rückenmark → Reaktion.',
    },
    {
      concept: 'bio:k8:ein-reflex-ist',
      prompt: 'Ein Reflex ist …',
      answer: 'eine schnelle, oft unwillkürliche Reaktion auf einen Reiz',
      wrong: ['immer eine bewusste Entscheidung nach Stunden', 'nur Fotosynthese', 'nur Verdauung im Dickdarm'],
      explanation: 'Reflexbögen ermöglichen schnelle Schutzreaktionen.',
      wissen:
        'Ein Reflex ist eine schnelle, oft unwillkürliche Reaktion über Rezeptor, Nerven und oft Rückenmark.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k8:sinne:paar-reiz',
      term: 'Reiz',
      meaning: 'Auslöser, der Sinneszellen erregt',
      wissen: 'Licht, Schall, Druck, chemische Stoffe u. a.',
    },
    {
      concept: 'bio:k8:sinne:paar-nerv',
      term: 'Nervenzelle',
      meaning: 'Leitet elektrische Signale',
      wissen: 'Vernetzt Sinnesorgane, Gehirn und Erfolgsorgane.',
    },
    {
      concept: 'bio:k8:sinne:paar-sinn',
      term: 'Sinn',
      meaning: 'Fähigkeit, bestimmte Reize wahrzunehmen',
      wissen: 'Klassisch: Sehen, Hören, Riechen, Schmecken, Tasten.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k8:sinne:tf-ohne-hirn',
      statement: 'Sinnesorgane verarbeiten komplexe Wahrnehmungen vollständig ohne Gehirn.',
      correct: false,
      explanation: 'Die bewusste Wahrnehmung entsteht vor allem im Gehirn.',
      wissen: 'Rezeptoren liefern Signale; das Gehirn erzeugt die Wahrnehmung.',
    },
  ],
  multis: [
    {
      concept: 'bio:k8:welche-sinne-gehoeren-zu-den-klassischen',
      question: 'Welche Sinne gehören zu den „klassischen“ fünf?',
      correct: ['Sehen', 'Hören', 'Riechen'],
      wrong: ['Fotosynthese', 'Gärung'],
      explanation: 'Sehen, Hören, Riechen, Schmecken, Tasten.',
      wissen:
        'Die fünf klassischen Sinne: Sehen, Hören, Riechen, Schmecken, Tasten.',
    },
  ],
}

const sexualitaet: BioBank = {
  quelle: 'Wikipedia: Menschliche Sexualität',
  url: 'https://de.wikipedia.org/wiki/Menschliche_Sexualit%C3%A4t',
  conceptPrefix: 'bio:k8:sexualitaet',
  facts: [
    {
      concept: 'bio:k8:was-beschreibt-empfaengnisverhuetung-sac',
      prompt: 'Was beschreibt Empfängnisverhütung sachlich?',
      answer: 'Methoden, ungewollte Schwangerschaft zu vermeiden',
      wrong: ['Nur Impfungen gegen Viren', 'Nur Knochenbruchheilung', 'Nur Blutdruckmessen'],
      explanation: 'Verschiedene Methoden mit unterschiedlicher Sicherheit.',
      wissen:
        'Empfängnisverhütung umfasst Methoden, die Befruchtung bzw. Einnistung verhindern sollen.',
    },
    {
      concept: 'bio:k8:sexualitaet:ueberblick',
      prompt: 'Was gehört zur Sexualität des Menschen im Überblick?',
      answer: 'Körperliche, emotionale und soziale Aspekte der Fortpflanzung und Beziehungen',
      wrong: ['Nur Blattbildung', 'Nur Jahresringe', 'Nur Zellwandbau'],
      explanation: 'Mehr als nur Biologie der Keimzellen.',
      wissen:
        'Sexualität umfasst Körper, Gefühle und soziale Verantwortung. Pubertät/Verantwortung → Spezial Entwicklung.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k8:sexualitaet:paar-verhuetung',
      term: 'Verhütung',
      meaning: 'Schutz vor ungewollter Schwangerschaft',
      wissen: 'Verschiedene Methoden mit unterschiedlicher Sicherheit.',
    },
    {
      concept: 'bio:k8:sexualitaet:paar-sti',
      term: 'STI',
      meaning: 'Sexuell übertragbare Infektion',
      wissen: 'Schutz z. B. durch Kondome und Aufklärung.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k8:sexualitaet:tf-nur-biologie',
      statement: 'Sexualität betrifft ausschließlich die Zellteilung.',
      correct: false,
      explanation: 'Sie umfasst auch Emotionen, Beziehungen und Verantwortung.',
      wissen: 'Biologie, Emotion und Verantwortung gehören zusammen.',
    },
  ],
  multis: [
    {
      concept: 'bio:k8:sexualitaet:multi',
      question: 'Welche Aussagen passen zur Sexualität im Überblick?',
      correct: ['Sie betrifft Körper und Gefühle', 'Verhütung kann ungewollte Schwangerschaft vermeiden'],
      wrong: ['Sie ist nur Blattphysiologie', 'Sie braucht keine Verantwortung'],
      explanation: 'Überblick ohne Pubertäts-/Entwicklungsdetails.',
      wissen: 'Details zu Pubertät und Verantwortung → Spezial Entwicklung.',
    },
  ],
}

const stress: BioBank = {
  quelle: 'Wikipedia: Stress',
  url: 'https://de.wikipedia.org/wiki/Stress',
  conceptPrefix: 'bio:k8:stress',
  facts: [
    {
      concept: 'bio:k8:was-kann-bei-stress-im-koerper-passieren',
      prompt: 'Was kann bei Stress im Körper passieren?',
      answer: 'Erhöhte Anspannung, veränderte Atmung/Puls, Stresshormone',
      wrong: ['Sofortige Fotosynthese', 'Knochen verschwinden', 'Keine Nervensignale mehr'],
      explanation: 'Stress aktiviert Alarmreaktionen — Dauerstress belastet.',
      wissen:
        'Bei Stress schüttet der Körper u. a. Adrenalin und Cortisol aus: Puls und Atmung steigen, Muskeln spannen sich an. Kurzfristig hilfreich, dauerhaft belastend.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k8:entspannungstechniken-und-pausen-koennen',
      statement: 'Entspannungstechniken und Pausen können helfen, Stress zu bewältigen.',
      correct: true,
      explanation: 'Bewegung, Gespräche, Pausen und Struktur sind typische Strategien.',
      wissen:
        'Pausen, Bewegung, Gespräche und Entspannungstechniken senken die Stressreaktion und helfen dem Körper, wieder ins Gleichgewicht zu kommen.',
    },
  ],
  pairs: [
    {
      term: 'Akuter Stress',
      meaning: 'Kurzfristige Alarmreaktion',
      wissen: 'Kurzfristige Aktivierung kann Leistung steigern — danach sollte Erholung folgen.',
    },
    {
      term: 'Chronischer Stress',
      meaning: 'Dauerhafte Überforderung',
      wissen: 'Dauerhafte Überforderung belastet Herz-Kreislauf, Schlaf und Immunsystem.',
    },
  ],
}

const sinneWahl: BioBank = {
  quelle: 'Wikipedia: Wahrnehmung',
  url: 'https://de.wikipedia.org/wiki/Wahrnehmung',
  conceptPrefix: 'bio:k8:sinne-wahl',
  facts: [
    {
      concept: 'bio:k8:warum-ergaenzen-sich-die-sinne-gegenseit',
      prompt: 'Warum ergänzen sich die Sinne gegenseitig?',
      answer: 'Die Wahrnehmung wird genauer und sicherer',
      wrong: ['Weil Knochen dann leuchten', 'Weil Blut dann grün wird', 'Weil Zellen verschwinden'],
      explanation: 'Multisensorik verbessert Orientierung.',
      wissen:
        'Mehrere Sinne zusammen (z. B. Sehen + Hören + Tasten) machen Wahrnehmung genauer und Orientierung sicherer — das Gehirn verknüpft die Eindrücke.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k8:ohne-sehsinn-ist-orientierung-immer-unmo',
      statement: 'Ohne Sehsinn ist Orientierung immer unmöglich.',
      correct: false,
      explanation: 'Andere Sinne und Hilfsmittel ermöglichen Orientierung.',
      wissen:
        'Ohne Sehen helfen Hören, Tasten, Riechen und Hilfsmittel (Stock, Orientierungstechniken) — Orientierung bleibt möglich.',
    },
  ],
}

const ersteHilfe: BioBank = {
  quelle: 'Wikipedia: Erste Hilfe',
  url: 'https://de.wikipedia.org/wiki/Erste_Hilfe',
  conceptPrefix: 'bio:k8:erste-hilfe',
  facts: [
    {
      concept: 'bio:k8:was-ist-der-erste-schritt-in-vielen-notf',
      prompt: 'Was ist der erste Schritt in vielen Notfallsituationen?',
      answer: 'Absichern und Notruf absetzen (wenn nötig)',
      wrong: ['Sofort weglaufen ohne Hilfe', 'Warten bis morgen', 'Nur fotografieren'],
      explanation: 'Eigene Sicherheit, dann Hilfe holen / leisten.',
      wissen:
        'Erste-Hilfe-Grundregel: eigene Sicherheit prüfen, Unfallstelle absichern, dann Notruf (in DE oft 112) und Hilfe leisten.',
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
      wissen:
        'Bei Bewusstlosigkeit: Atmung prüfen, Notruf absetzen; bei vorhandener Atmung stabile Seitenlage (laut Erste-Hilfe-Kurs).',
    },
  ],
  pairs: [
    {
      term: 'Notruf',
      meaning: 'Professionelle Hilfe anfordern',
      wissen: 'Notruf (112) holt Rettungsdienst — oft die wichtigste Sofortmaßnahme.',
    },
    {
      term: 'Wundversorgung',
      meaning: 'Blutung stillen / schützen',
      wissen: 'Druckverband oder saubere Abdeckung stillt Blutungen und schützt vor Keimen.',
    },
  ],
}

export const BIOLOGIE_K8_GENERATORS: Record<string, Topic['generate']> = {
  'bi-k8-lb1-sinne': bankGenerate(sinne),
  'bi-k8-lb2-sexualitaet': bankGenerate(sexualitaet),
  'bi-k8-lbw-stress': bankGenerate(stress),
  'bi-k8-lbw-sinne': bankGenerate(sinneWahl),
  'bi-k8-lbw-erste-hilfe': bankGenerate(ersteHilfe),
}
