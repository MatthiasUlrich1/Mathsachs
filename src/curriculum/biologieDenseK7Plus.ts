/**
 * Biologie Gym Sachsen — Lehrplan 522 Lückenfüllung K7–10 + OS.
 * Eigene Formulierungen; Distraktoren LB-lokal; wenig Gaps.
 * Quelle: https://www.schulportal.sachsen.de/lplandb/lehrplan/522
 */
import { biBakterienBauBild } from './biologieAnatomy'
import { bankGenerate, type BioBank } from './biologieBank'
import { mixedVariants } from './taskHelpers'
import type { Topic } from './types'

const bank = (
  quelle: string,
  url: string,
  prefix: string,
  facts: BioBank['facts'],
  extra?: Partial<BioBank>,
): BioBank => ({
  quelle,
  url,
  conceptPrefix: prefix,
  facts,
  ...extra,
})

const fw = (s: string) => s

// ---------------------------------------------------------------------------
// Klasse 7
// ---------------------------------------------------------------------------

export const k7BakterienBau: BioBank = bank(
  'Wikipedia: Bakterien',
  'https://de.wikipedia.org/wiki/Bakterien',
  'bio:k7:bakbau',
  [
    {
      concept: 'bio:k7:bakbau:prokaryot',
      prompt: 'Warum gelten Bakterien als Prokaryoten?',
      answer: 'Ihr Erbgut liegt nicht in einem echten Zellkern',
      wrong: ['Sie haben immer Chloroplasten', 'Sie sind immer vielzellig', 'Sie besitzen nie Zellwände'],
      explanation: 'Prokaryoten: kein kernmembranumschlossener Zellkern.',
      wissen: fw(
        'Bakterien sind Prokaryoten: die DNA liegt im Nucleoid, nicht in einem kernmembranumschlossenen Zellkern. Typische Strukturen sind Zellwand, Zellmembran und Zytoplasma; manche haben Geißeln oder eine Kapsel.',
      ),
    },
    {
      concept: 'bio:k7:bakbau:wand',
      prompt: 'Welche Aufgabe hat die Bakterienzellwand grob?',
      answer: 'Formgebung und Schutz der Zelle',
      wrong: ['Photosynthese wie im Blattgrün', 'Bildung von Antikörpern', 'Leitung von Nervenimpulsen'],
      explanation: 'Zellwand stabilisiert die Bakterienzelle.',
      wissen: fw(
        'Die Bakterienzellwand gibt Form und mechanischen Schutz. Viele Antibiotika greifen Zellwandaufbau oder andere bakterielle Prozesse an — Viren haben keine solche Zellwand.',
      ),
    },
    {
      concept: 'bio:k7:bakbau:vermehrung',
      prompt: 'Wie vermehren sich Bakterien typischerweise?',
      answer: 'Durch ungeschlechtliche Teilung (Zweiteilung)',
      wrong: ['Nur durch Meiose wie in Keimzellen', 'Nur durch Bestäubung', 'Nur durch Eierlegen'],
      explanation: 'Binäre Spaltung — schnell unter günstigen Bedingungen.',
      wissen: fw(
        'Bakterien vermehren sich ungeschlechtlich durch Zweiteilung. Unter guten Bedingungen entstehen so schnell große Populationen (Kolonien). Sexualität im Sinne der Meiose fehlt.',
      ),
    },
    {
      concept: 'bio:k7:bakbau:bedeutung',
      prompt: 'Welche Rolle können Bakterien in der Natur/Lebensmittelindustrie spielen?',
      answer: 'Zersetzer, Nützlinge (z. B. Joghurt) oder Krankheitserreger',
      wrong: ['Nur immer krankheitserregend', 'Nur als Pflanzenzellen', 'Nur als Virenpartikel'],
      explanation: 'Vielfalt der Bedeutung — nicht pauschal „schädlich“.',
      wissen: fw(
        'Bakterien sind Zersetzer in Stoffkreisläufen, Nützlinge in Lebensmitteln (Joghurt, Käse) und manchmal Krankheitserreger. Hygiene und Impfungen betreffen vor allem unerwünschte Erreger.',
      ),
    },
    {
      concept: 'bio:k7:bakbau:koch',
      prompt: 'Wofür ist Robert Koch in der Mikrobiologie bekannt?',
      answer: 'Nachweis und Erforschung bakterieller Krankheitserreger',
      wrong: ['Entdeckung der Fotosyntheseformel', 'Erfindung des Mikroskops allein', 'Nur Zoologie der Vögel'],
      explanation: 'Koch-Postulate / bakteriologische Forschung.',
      wissen: fw(
        'Robert Koch leistete Pionierarbeit bei der Identifikation bakterieller Erreger (z. B. Tuberkulose). Solche Erkenntnisse begründeten moderne Hygiene und Bekämpfungsstrategien.',
      ),
    },
    {
      concept: 'bio:k7:bakbau:fleming',
      prompt: 'Womit ist Alexander Fleming eng verbunden?',
      answer: 'Entdeckung des Penicillins (Antibiotikum)',
      wrong: ['Entdeckung der DNA-Doppelhelix allein', 'Erfindung der Impfung gegen Pocken', 'Nur Astrologie'],
      explanation: 'Penicillin — Meilenstein gegen Bakterien.',
      wissen: fw(
        'Fleming entdeckte Penicillin, das Bakterien hemmen kann. Antibiotika wirken nicht gegen Viren; falscher Einsatz fördert Resistenzen.',
      ),
    },
  ],
  {
    pairs: [
      { term: 'Kapsel', meaning: 'Schützende Hülle mancher Bakterien', wissen: 'Erschwert u. a. die Phagozytose.' },
      { term: 'Geißel', meaning: 'Bewegungsorganell mancher Bakterien', wissen: 'Ermöglicht Fortbewegung in Flüssigkeiten.' },
      { term: 'Kolonie', meaning: 'Sichtbare Bakterienmenge auf Nährboden', wissen: 'Entsteht durch wiederholte Teilung.' },
    ],
    trueFalse: [
      {
        concept: 'bio:k7:bakbau:tf-viruswand',
        statement: 'Viren besitzen dieselbe Zellwand wie Bakterien.',
        correct: false,
        explanation: 'Viren sind keine Zellen und haben keine bakterielle Zellwand.',
        wissen: fw('Viren bestehen aus Erbgut und oft Proteinhülle — keine Zellwand wie Bakterien.'),
      },
    ],
  },
)

export const k7Gefaesse: BioBank = bank(
  'Wikipedia: Blutgefäß',
  'https://de.wikipedia.org/wiki/Blutgef%C3%A4%C3%9F',
  'bio:k7:gefaesse',
  [
    {
      concept: 'bio:k7:gefaesse:arterie',
      prompt: 'Woran erkennt man Arterien grob?',
      answer: 'Führen Blut vom Herzen weg; oft dickwandig und elastisch',
      wrong: ['Führen immer nur Lymphflüssigkeit', 'Haben nie Muskelschicht', 'Sind nur in Pflanzen'],
      explanation: 'Arterien = vom Herzen fort.',
      wissen: fw(
        'Arterien transportieren Blut vom Herzen zu den Organen. Ihre Wand ist kräftig und elastisch, um den Pulsdruck auszuhalten. Ausnahmebegriff: Lungenarterie führt sauerstoffarmes Blut zur Lunge.',
      ),
    },
    {
      concept: 'bio:k7:gefaesse:vene',
      prompt: 'Was kennzeichnen Venen grob?',
      answer: 'Führen Blut zum Herzen zurück; oft mit Klappen',
      wrong: ['Pumpen aktiv wie ein zweites Herz allein', 'Enthalten nur Luft', 'Sind nur Nervenfasern'],
      explanation: 'Venen = zum Herzen hin; Klappen gegen Rückfluss.',
      wissen: fw(
        'Venen bringen Blut zum Herzen zurück. Viele Körpervenen haben Klappen, die den Rückfluss verhindern. Die Muskelpumpe unterstützt den Rückfluss aus den Beinen.',
      ),
    },
    {
      concept: 'bio:k7:gefaesse:kapillare',
      prompt: 'Wozu dienen Kapillaren?',
      answer: 'Stoffaustausch zwischen Blut und Gewebe',
      wrong: ['Nur Speicherung von Galle', 'Nur Bildung von Knochenmarkhormonen überall', 'Nur Schallleitung'],
      explanation: 'Haargefäße — Diffusion von O₂, Nährstoffen, CO₂.',
      wissen: fw(
        'Kapillaren sind feinste Gefäße mit dünner Wand. Hier tauschen Blut und Gewebe Sauerstoff, Nährstoffe und Abbauprodukte aus.',
      ),
    },
    {
      concept: 'bio:k7:gefaesse:koerper-lungen',
      prompt: 'Was unterscheidet Körper- und Lungenkreislauf?',
      answer: 'Körperkreislauf versorgt Organe; Lungenkreislauf führt zur Lunge zum Gasaustausch',
      wrong: ['Es gibt nur einen Kreislauf ohne Lunge', 'Beide enden immer im Magen', 'Venen gibt es nur im Kopf'],
      explanation: 'Doppelter Kreislauf beim Menschen.',
      wissen: fw(
        'Im Körperkreislauf versorgt das Herz Organe mit sauerstoffreichem Blut. Im Lungenkreislauf wird Blut in der Lunge mit Sauerstoff angereichert und gibt CO₂ ab.',
      ),
    },
    {
      concept: 'bio:k7:gefaesse:puls',
      prompt: 'Was misst man näherungsweise am Puls?',
      answer: 'Die Herzschlagfrequenz (Wellung der Arterienwand)',
      wrong: ['Die Anzahl der Leukozyten exakt', 'Den Blutzucker ohne Gerät', 'Die Knochenlänge'],
      explanation: 'Puls = Fortpflanzung der Druckwelle.',
      wissen: fw(
        'Der Puls entsteht durch die Druckwelle in den Arterien bei jedem Herzschlag. Pulsfrequenz entspricht grob der Herzfrequenz und ist ein einfaches Gesundheitszeichen.',
      ),
    },
    {
      concept: 'bio:k7:gefaesse:gesundheit',
      prompt: 'Welche Maßnahme unterstützt die Herz-Kreislauf-Gesundheit?',
      answer: 'Regelmäßige Bewegung und ausgewogene Ernährung',
      wrong: ['Dauerhaftes Rauchen', 'Vollständige Bewegungsvermeidung', 'Nur Süßigkeiten als Kost'],
      explanation: 'Lebensstil beeinflusst Risiko für Herz-Kreislauf-Erkrankungen.',
      wissen: fw(
        'Bewegung, ausgewogene Ernährung, Nichtrauchen und Stressmanagement senken Risiken für Herz-Kreislauf-Erkrankungen. Bluthochdruck und Bewegungsmangel wirken ungünstig.',
      ),
    },
  ],
  {
    pairs: [
      { term: 'Arterie', meaning: 'Gefäß vom Herzen weg', wissen: 'Dicke, elastische Wand.' },
      { term: 'Vene', meaning: 'Gefäß zum Herzen hin', wissen: 'Oft Klappen gegen Rückfluss.' },
      { term: 'Kapillare', meaning: 'Ort des Stoffaustauschs', wissen: 'Sehr dünne Wand.' },
    ],
    multis: [
      {
        concept: 'bio:k7:gefaesse:multi',
        question: 'Welche Strukturen gehören zum Blutgefäßsystem?',
        correct: ['Arterien', 'Venen', 'Kapillaren'],
        wrong: ['Nur Blütenstaubschläuche', 'Nur Jahresringe'],
        explanation: 'Gefäßsystem = Arterien, Venen, Kapillaren (+ Herz).',
        wissen: fw('Das Blutgefäßsystem umfasst Herz sowie Arterien, Venen und Kapillaren.'),
      },
    ],
  },
)

export const k7Muskeln: BioBank = bank(
  'Wikipedia: Skelettmuskel',
  'https://de.wikipedia.org/wiki/Skelettmuskel',
  'bio:k7:muskeln',
  [
    {
      concept: 'bio:k7:muskeln:kontraktion',
      prompt: 'Wie erzeugen Skelettmuskeln Bewegung?',
      answer: 'Durch aktives Zusammenziehen (Kontraktion) und Zug an Knochen',
      wrong: ['Durch Photosynthese', 'Durch Impfung', 'Durch reine Nerven ohne Muskel'],
      explanation: 'Muskeln ziehen — sie drücken nicht aktiv.',
      wissen: fw(
        'Skelettmuskeln verkürzen sich aktiv und ziehen über Sehnen an Knochen. Gegenspieler (Antagonisten) ermöglichen Beugen und Strecken.',
      ),
    },
    {
      concept: 'bio:k7:muskeln:sehne',
      prompt: 'Was ist die Aufgabe von Sehnen?',
      answer: 'Kraftübertragung vom Muskel auf den Knochen',
      wrong: ['Bildung von Antikörpern', 'Gasaustausch in der Lunge', 'Filterung des Blutes in der Niere'],
      explanation: 'Sehnen = zugfeste Verbindung.',
      wissen: fw('Sehnen sind straffes Bindegewebe und übertragen die Muskelkraft auf den Knochen.'),
    },
    {
      concept: 'bio:k7:muskeln:antagonist',
      prompt: 'Warum braucht Bewegung oft Muskelpaare (Antagonisten)?',
      answer: 'Ein Muskel kann nur ziehen; der Gegenspieler ermöglicht die Gegenbewegung',
      wrong: ['Weil Knochen keine Gelenke haben', 'Weil Blut keine Aufgabe hat', 'Weil Haut keine Sinne hat'],
      explanation: 'Beuger und Strecker arbeiten zusammen.',
      wissen: fw(
        'Muskeln können nur aktiv verkürzen. Für die Gegenbewegung braucht es den Antagonisten (z. B. Bizeps/Trizeps).',
      ),
    },
    {
      concept: 'bio:k7:muskeln:training',
      prompt: 'Was bewirkt sinnvolles Muskeltraining typischerweise?',
      answer: 'Kraft und oft auch Stoffwechsel/Haltung verbessern sich',
      wrong: ['Knochen verschwinden', 'Atmung wird überflüssig', 'Immunsystem fällt aus'],
      explanation: 'Training adaptiert Muskulatur.',
      wissen: fw(
        'Regelmäßiges Training steigert Kraft und Ausdauer der Muskulatur und unterstützt Haltung sowie Stoffwechsel. Überlastung und fehlendes Aufwärmen erhöhen Verletzungsrisiko.',
      ),
    },
  ],
  {
    pairs: [
      { term: 'Bizeps', meaning: 'Beugt typischerweise den Arm', wissen: 'Beispiel für Beuger.' },
      { term: 'Trizeps', meaning: 'Streckt typischerweise den Arm', wissen: 'Antagonist zum Bizeps.' },
      { term: 'Muskelfaser', meaning: 'Kontraktile Zelleinheit', wissen: 'Viele Fasern bilden den Muskel.' },
    ],
    trueFalse: [
      {
        concept: 'bio:k7:muskeln:tf-druecken',
        statement: 'Skelettmuskeln können Knochen aktiv auseinanderdrücken wie Hydraulikzylinder.',
        correct: false,
        explanation: 'Muskeln ziehen; Gegenspieler und Hebelmechanik erzeugen die Bewegung.',
        wissen: fw('Aktive Muskelarbeit ist Zug. Druckwirkungen entstehen indirekt über Hebel und Gegenspieler.'),
      },
    ],
  },
)

export const k7Gelenke: BioBank = bank(
  'Wikipedia: Gelenk',
  'https://de.wikipedia.org/wiki/Gelenk',
  'bio:k7:gelenke',
  [
    {
      concept: 'bio:k7:gelenke:funktion',
      prompt: 'Wozu dienen Gelenke?',
      answer: 'Bewegliche Verbindung zwischen Knochen',
      wrong: ['Nur Sauerstofftransport', 'Nur Hormonproduktion', 'Nur Verdauung von Fett'],
      explanation: 'Gelenke ermöglichen Bewegung.',
      wissen: fw(
        'Gelenke verbinden Knochen beweglich. Knorpel und Gelenkflüssigkeit mindern Reibung; Bänder stabilisieren.',
      ),
    },
    {
      concept: 'bio:k7:gelenke:scharnier',
      prompt: 'Welches Gelenk erlaubt vorwiegend Beugung/Streckung in einer Ebene?',
      answer: 'Scharniergelenk (z. B. Ellbogen)',
      wrong: ['Kugelgelenk der Schulter allein', 'Nur die Naht am Schädel', 'Nur Zahnwurzelgelenk ohne Bewegung'],
      explanation: 'Scharnier = eine Hauptebene.',
      wissen: fw('Scharniergelenke (Ellbogen, Finger) bewegen sich vorwiegend in einer Ebene: Beugen und Strecken.'),
    },
    {
      concept: 'bio:k7:gelenke:kugel',
      prompt: 'Welches Gelenk erlaubt Bewegung in vielen Richtungen?',
      answer: 'Kugelgelenk (z. B. Schulter, Hüfte)',
      wrong: ['Nur Scharniergelenk am Finger', 'Nur starre Schädelnähte', 'Nur Zahnschmelz'],
      explanation: 'Kugelkopf in Pfanne.',
      wissen: fw('Kugelgelenke bieten große Beweglichkeit, sind aber verletzungsanfälliger und brauchen Muskel-/Bandführung.'),
    },
    {
      concept: 'bio:k7:gelenke:schutz',
      prompt: 'Was schützt Gelenkflächen typischerweise?',
      answer: 'Knorpel und Gelenkflüssigkeit',
      wrong: ['Nur Haarschaft', 'Nur Zahnfleisch', 'Nur Trommelfell'],
      explanation: 'Gleiteigenschaften und Puffer.',
      wissen: fw('Gelenkknorpel und Synovialflüssigkeit reduzieren Reibung. Überlastung und Entzündung können schädigen.'),
    },
  ],
  {
    pairs: [
      { term: 'Band', meaning: 'Stabilisiert das Gelenk', wissen: 'Bindegewebsstrang Knochen–Knochen.' },
      { term: 'Knorpel', meaning: 'Überzieht Gelenkflächen', wissen: 'Druckelastisch, wenig durchblutet.' },
      { term: 'Hüftgelenk', meaning: 'Kugelgelenk Bein–Becken', wissen: 'Trägt Körperlast, große Beweglichkeit.' },
    ],
  },
)

// ---------------------------------------------------------------------------
// Klasse 8
// ---------------------------------------------------------------------------

export const k8Geschlechtsorgane: BioBank = bank(
  'Wikipedia: Fortpflanzungssystem',
  'https://de.wikipedia.org/wiki/Fortpflanzungssystem_des_Menschen',
  'bio:k8:gonaden',
  [
    {
      concept: 'bio:k8:gonaden:hoden',
      prompt: 'Welche Hauptaufgabe haben die Hoden?',
      answer: 'Bildung von Spermien und Testosteron',
      wrong: ['Filterung des Urins wie die Niere', 'Produktion von Insulin allein', 'Bildung von Eizellen'],
      explanation: 'Männliche Keimdrüsen.',
      wissen: fw(
        'Hoden bilden Spermien und das Hormon Testosteron. Reifung und Transport erfolgen über Nebenhoden und Samenwege.',
      ),
    },
    {
      concept: 'bio:k8:gonaden:eierstoecke',
      prompt: 'Welche Hauptaufgabe haben die Eierstöcke?',
      answer: 'Bildung von Eizellen und weiblichen Geschlechtshormonen',
      wrong: ['Nur Speicherung von Galle', 'Nur Bildung von Spermien', 'Nur Antikörperproduktion'],
      explanation: 'Weibliche Keimdrüsen.',
      wissen: fw(
        'Eierstöcke bilden Eizellen und Hormone (u. a. Östrogene, Progesteron). Sie steuern den Zyklus mit.',
      ),
    },
    {
      concept: 'bio:k8:gonaden:befruchtung',
      prompt: 'Wo findet die Befruchtung beim Menschen typischerweise statt?',
      answer: 'Im Eileiter',
      wrong: ['Im Magen', 'In der Lunge', 'Im Trommelfell'],
      explanation: 'Spermium und Eizelle verschmelzen meist im Eileiter.',
      wissen: fw(
        'Nach dem Eisprung kann die Befruchtung im Eileiter erfolgen. Die befruchtete Eizelle wandert in die Gebärmutter zur Einnistung.',
      ),
    },
    {
      concept: 'bio:k8:gonaden:gebärmutter',
      prompt: 'Welche Aufgabe hat die Gebärmutter?',
      answer: 'Ort der Einnistung und Entwicklung des Embryos/Feten',
      wrong: ['Bildung von Magensäure', 'Filterung der Lymphe allein', 'Schallleitung im Ohr'],
      explanation: 'Schwangerschaft findet in der Gebärmutter statt.',
      wissen: fw(
        'In der Gebärmutter nistet sich der Embryo ein und entwickelt sich. Die Gebärmutterschleimhaut verändert sich zyklisch.',
      ),
    },
    {
      concept: 'bio:k8:gonaden:pubertaet',
      prompt: 'Woran erkennt man die Pubertät biologisch?',
      answer: 'Hormone steuern die Entwicklung der Geschlechtsmerkmale und Fruchtbarkeit',
      wrong: ['Es gibt keine Hormoneschwankungen', 'Nur Zahnwechsel ohne Hormone', 'Nur Wachstum der Haare ohne Keimdrüsen'],
      explanation: 'Hypothalamus–Hypophyse–Keimdrüsen-Achse.',
      wissen: fw(
        'In der Pubertät steigen Geschlechtshormone; sekundäre Geschlechtsmerkmale und Fruchtbarkeit entwickeln sich. Tempo und Verlauf sind individuell.',
      ),
    },
  ],
  {
    pairs: [
      { term: 'Spermium', meaning: 'Männliche Keimzelle', wissen: 'Haploid; beweglich.' },
      { term: 'Eizelle', meaning: 'Weibliche Keimzelle', wissen: 'Haploid; größer als Spermium.' },
      { term: 'Zyklus', meaning: 'Wiederkehrende hormonelle Steuerung', wissen: 'U. a. Eisprung und Schleimhautaufbau.' },
    ],
    trueFalse: [
      {
        concept: 'bio:k8:gonaden:tf',
        statement: 'Geschlechtshormone beeinflussen nur das Aussehen, nie Organfunktionen.',
        correct: false,
        explanation: 'Hormone steuern u. a. Zyklus, Fruchtbarkeit und viele Körperprozesse.',
        wissen: fw('Geschlechtshormone wirken systemisch auf Entwicklung, Zyklus und Stoffwechsel.'),
      },
    ],
  },
)

export const k8Verantwortung: BioBank = bank(
  'Wikipedia: Empfängnisverhütung',
  'https://de.wikipedia.org/wiki/Empf%C3%A4ngnisverh%C3%BCtung',
  'bio:k8:verantwortung',
  [
    {
      concept: 'bio:k8:verantwortung:schutz',
      prompt: 'Warum ist Verhütung und Infektionsschutz ein Verantwortungsthema?',
      answer: 'Weil Entscheidungen Gesundheit und Lebensplanung beeinflussen',
      wrong: ['Weil Biologie keine Rolle spielt', 'Weil nur Noten zählen', 'Weil Hormone irrelevant sind'],
      explanation: 'Fachwissen + Verantwortung gehören zusammen.',
      wissen: fw(
        'Verhütung und Schutz vor sexuell übertragbaren Infektionen betreffen Gesundheit und Selbstbestimmung. Aufklärung ermöglicht informierte Entscheidungen.',
      ),
    },
    {
      concept: 'bio:k8:verantwortung:kondom',
      prompt: 'Welchen doppelten Nutzen hat ein Kondom typischerweise?',
      answer: 'Schwangerschaftsverhütung und Schutz vor vielen Infektionen',
      wrong: ['Nur Zahnreinigung', 'Nur Blutdrucksenkung', 'Nur Impfstoffersatz'],
      explanation: 'Barriere-Methode.',
      wissen: fw(
        'Kondome sind Barriere-Methoden: sie mindern Schwangerschaftsrisiko und schützen vor vielen sexuell übertragbaren Erregern — im Gegensatz zu rein hormonellen Methoden.',
      ),
    },
    {
      concept: 'bio:k8:verantwortung:aufklaerung',
      prompt: 'Was gehört zu verantwortungsvoller Sexualaufklärung?',
      answer: 'Fachliche Informationen, Respekt und Zustimmung (Konsens)',
      wrong: ['Nur Gerüchte aus dem Internet glauben', 'Druck auf andere ausüben', 'Gesundheitsfragen ignorieren'],
      explanation: 'Konsens und Wissen.',
      wissen: fw(
        'Verantwortungsvolle Sexualität umfasst Konsens, Respekt, Wissen über Körper und Risiken sowie Zugang zu verlässlichen Informationen — nicht Druck oder Fehlinformation.',
      ),
    },
    {
      concept: 'bio:k8:verantwortung:sti',
      prompt: 'Was sind STI grob?',
      answer: 'Sexuell übertragbare Infektionen',
      wrong: ['Nur Schulnoten', 'Nur Pflanzenkrankheiten', 'Nur Knochenbrüche'],
      explanation: 'Infektionen, die durch Sexualkontakt übertragen werden können.',
      wissen: fw(
        'STI (sexually transmitted infections) können bakteriell oder viral sein. Schutz, Testung und Behandlung sind öffentliche Gesundheitsmaßnahmen.',
      ),
    },
  ],
  {
    trueFalse: [
      {
        concept: 'bio:k8:verantwortung:tf',
        statement: 'Hormonalverhütung schützt zuverlässig vor allen sexuell übertragbaren Infektionen.',
        correct: false,
        explanation: 'Hormonelle Methoden verhüten Schwangerschaft, schützen aber nicht vor STI.',
        wissen: fw('Barriere-Methoden wie Kondome sind für Infektionsschutz zentral; Hormone allein reichen dafür nicht.'),
      },
    ],
    pairs: [
      { term: 'Konsens', meaning: 'Freiwillige, klare Zustimmung', wissen: 'Grundlage respektvoller Sexualität.' },
      { term: 'Barriere', meaning: 'Physische Verhütungsmethode', wissen: 'z. B. Kondom.' },
      { term: 'Aufklärung', meaning: 'Fachlich korrekte Information', wissen: 'Ermöglicht informierte Entscheidungen.' },
    ],
  },
)

// ---------------------------------------------------------------------------
// Klasse 9
// ---------------------------------------------------------------------------

export const k9Nahrungskette: BioBank = bank(
  'Wikipedia: Nahrungskette',
  'https://de.wikipedia.org/wiki/Nahrungskette',
  'bio:k9:kette',
  [
    {
      concept: 'bio:k9:kette:produzent',
      prompt: 'Wer steht am Beginn der meisten Nahrungsketten?',
      answer: 'Produzenten (meist Pflanzen/Algen mit Fotosynthese)',
      wrong: ['Nur Endverbraucher ohne Ausnahme', 'Nur Destruenten ohne Produzenten', 'Nur Viren'],
      explanation: 'Autotrophe Basis.',
      wissen: fw(
        'Produzenten bilden Biomasse aus anorganischen Stoffen (Fotosynthese). Konsumenten fressen; Destruenten zersetzen tote organische Substanz.',
      ),
    },
    {
      concept: 'bio:k9:kette:energie',
      prompt: 'Warum geht entlang der Nahrungskette nutzbare Energie verloren?',
      answer: 'Weil Lebewesen Energie veratmen und Wärme abgeben',
      wrong: ['Weil Physikgesetze aussetzen', 'Weil Produzenten keine Biomasse bilden', 'Weil Destruenten Energie erzeugen aus nichts'],
      explanation: 'Energiefluss ist einseitig; Stoffkreisläufe schließen sich.',
      wissen: fw(
        'Auf jeder Stufe geht Energie durch Stoffwechsel (Wärme) verloren. Deshalb sind höhere Trophieebenen energetisch „dünner“. Stoffe hingegen zirkulieren.',
      ),
    },
    {
      concept: 'bio:k9:kette:destruent',
      prompt: 'Welche Aufgabe haben Destruenten?',
      answer: 'Abbau toter organischer Substanz und Rückführung von Nährstoffen',
      wrong: ['Nur Photosynthese', 'Nur Jagd auf Großsäuger immer', 'Nur Bildung von Erdöl in Minuten'],
      explanation: 'Bakterien, Pilze, viele Bodenlebewesen.',
      wissen: fw(
        'Destruenten (Bakterien, Pilze u. a.) zerlegen tote Biomasse und machen Mineralstoffe wieder für Produzenten verfügbar — zentral für Stoffkreisläufe.',
      ),
    },
    {
      concept: 'bio:k9:kette:netz',
      prompt: 'Warum spricht man oft von Nahrungsnetzen statt nur Ketten?',
      answer: 'Weil Arten meist mehrere Nahrungsbeziehungen haben',
      wrong: ['Weil es keine Produzenten gibt', 'Weil Energie zunimmt ohne Grenze', 'Weil Ökosysteme keine Wechselwirkungen haben'],
      explanation: 'Vernetzte Beziehungen.',
      wissen: fw(
        'In realen Ökosystemen frisst eine Art oft mehrere andere und wird von mehreren gefressen — ein Netz, keine einfache Linie.',
      ),
    },
  ],
  {
    pairs: [
      { term: 'Trophieebene', meaning: 'Stufe in der Nahrungskette', wissen: 'Produzent, Konsument 1. Ordnung, …' },
      { term: 'Konsument', meaning: 'Heterotrophe Art', wissen: 'Ernährt sich von anderen Organismen.' },
      { term: 'Biomasse', meaning: 'Masse lebender Organismen', wissen: 'Oft abnehmend zu höheren Ebenen.' },
    ],
    sorts: [
      {
        concept: 'bio:k9:kette:sort',
        question: 'Ordne eine einfache Nahrungskette (Beginn zuerst).',
        labels: ['Gras', 'Hase', 'Fuchs'],
        explanation: 'Produzent → Pflanzenfresser → Fleischfresser.',
        wissen: fw('Klassisches Schulbeispiel einer Nahrungskette.'),
      },
    ],
  },
)

export const k9Population: BioBank = bank(
  'Wikipedia: Population (Biologie)',
  'https://de.wikipedia.org/wiki/Population_(Biologie)',
  'bio:k9:pop',
  [
    {
      concept: 'bio:k9:pop:def',
      prompt: 'Was ist eine Population?',
      answer: 'Gruppe von Individuen einer Art in einem Gebiet, die sich fortpflanzen können',
      wrong: ['Nur alle Arten der Erde zusammen', 'Nur tote Organismen', 'Nur chemische Elemente'],
      explanation: 'Artgenossen in Raum und Zeit.',
      wissen: fw(
        'Eine Population umfasst Individuen einer Art in einem Gebiet, die potenziell eine Fortpflanzungsgemeinschaft bilden. Populationsökologie untersucht Wachstum und Begrenzung.',
      ),
    },
    {
      concept: 'bio:k9:pop:tragfaehigkeit',
      prompt: 'Was beschreibt die Tragfähigkeit eines Lebensraums?',
      answer: 'Die langfristig mögliche Individuenzahl bei gegebenen Ressourcen',
      wrong: ['Die Lichtgeschwindigkeit', 'Die Anzahl der Atome im Universum', 'Nur die Schulnote'],
      explanation: 'K-Wert im logistischen Modell.',
      wissen: fw(
        'Die Tragfähigkeit (K) ist die Individuenzahl, die Ressourcen langfristig erlauben. Dichteabhängige Faktoren bremsen Wachstum nahe K.',
      ),
    },
    {
      concept: 'bio:k9:pop:dichte',
      prompt: 'Ein dichteabhängiger begrenzender Faktor wirkt stärker, wenn …',
      answer: 'die Population dichter wird (z. B. Konkurrenz, Seuchen)',
      wrong: ['die Physik aussetzt', 'es keine Individuen gibt', 'nur der Wochentag zählt'],
      explanation: 'Wirkung hängt von der Dichte ab.',
      wissen: fw(
        'Bei hoher Dichte steigen Konkurrenz um Nahrung/Raum und oft Krankheitsdruck. Dichteunabhängige Faktoren (z. B. Unwetter) wirken unabhängig von der Individuenzahl.',
      ),
    },
    {
      concept: 'bio:k9:pop:nische',
      prompt: 'Was meint die ökologische Nische grob?',
      answer: 'Die Rolle/Ansprüche einer Art im Ökosystem (Ressourcen, Bedingungen)',
      wrong: ['Nur den geografischen Punkt auf der Karte', 'Nur die Fellfarbe', 'Nur den lateinischen Namen'],
      explanation: 'Mehr als der Lebensort (Habitat).',
      wissen: fw(
        'Die Nische beschreibt, welche Ressourcen und Bedingungen eine Art nutzt und welche Wechselwirkungen sie hat. Habitat ist der Ort; Nische die „Berufsrolle“.',
      ),
    },
  ],
  {
    pairs: [
      { term: 'Habitat', meaning: 'Lebensort einer Art', wissen: 'Räumliche Umwelt.' },
      { term: 'Konkurrenz', meaning: 'Wettbewerb um begrenzte Ressourcen', wissen: 'Inner- oder zwischenartlich.' },
      { term: 'Kapazität K', meaning: 'Tragfähigkeit', wissen: 'Langfristiges Populationslimit.' },
    ],
    trueFalse: [
      {
        concept: 'bio:k9:pop:tf',
        statement: 'Populationen können unbegrenzt exponentiell wachsen, ohne Ressourcengrenzen.',
        correct: false,
        explanation: 'Ressourcen und Umwelt setzen Grenzen (Tragfähigkeit).',
        wissen: fw('Unbegrenztes Wachstum ist ein Modellfall; real begrenzen Ressourcen und Umwelt.'),
      },
    ],
  },
)

// Fix duplicate prompt key in k9Population - I accidentally duplicated prompt. Let me fix when writing is done.

export const k9WurzelSpross: BioBank = bank(
  'Wikipedia: Sprossachse',
  'https://de.wikipedia.org/wiki/Sprossachse',
  'bio:k9:spross',
  [
    {
      concept: 'bio:k9:spross:wurzel',
      prompt: 'Welche Hauptaufgaben hat die Wurzel?',
      answer: 'Verankerung sowie Aufnahme von Wasser und Mineralstoffen',
      wrong: ['Nur Photosynthese mit Chlorophyll flächig', 'Nur Bildung von Pollen', 'Nur Schallleitung'],
      explanation: 'Wurzel = Aufnahme + Halt.',
      wissen: fw(
        'Wurzeln verankern die Pflanze und nehmen Wasser sowie Mineralstoffe auf. Wurzelhaare vergrößern die Oberfläche.',
      ),
    },
    {
      concept: 'bio:k9:spross:spross',
      prompt: 'Welche Aufgabe hat die Sprossachse grob?',
      answer: 'Trägt Blätter/Blüten und leitet Stoffe',
      wrong: ['Filtert Blut', 'Bildet nur Antikörper', 'Ersetzt die Niere'],
      explanation: 'Leitgewebe in der Achse.',
      wissen: fw(
        'Die Sprossachse trägt Blätter und Fortpflanzungsorgane und enthält Leitgewebe (Xylem/Phloem) für Wasser und Assimilate.',
      ),
    },
    {
      concept: 'bio:k9:spross:xylem',
      prompt: 'Wozu dient das Xylem?',
      answer: 'Transport von Wasser und Mineralstoffen nach oben',
      wrong: ['Nur Transport von Zucker nach unten immer ausschließlich', 'Nur Impfung', 'Nur Knochenbildung'],
      explanation: 'Holzteil.',
      wissen: fw('Xylem leitet Wasser und gelöste Mineralstoffe von der Wurzel zu den Blättern (Transpirationsstrom).'),
    },
    {
      concept: 'bio:k9:spross:phloem',
      prompt: 'Wozu dient das Phloem?',
      answer: 'Transport von Assimilaten (z. B. Zucker)',
      wrong: ['Nur Sauerstoffbindung wie Hämoglobin', 'Nur Harnbildung', 'Nur Nervenleitung'],
      explanation: 'Siebröhren.',
      wissen: fw('Phloem transportiert organische Stoffe (Assimilate) von den Bildungs- zu den Verbrauchsorten.'),
    },
  ],
  {
    pairs: [
      { term: 'Wurzelhaar', meaning: 'Vergrößert Aufnahmefläche', wissen: 'Feinste Ausstülpungen.' },
      { term: 'Assimilat', meaning: 'Aufbauprodukt der Fotosynthese', wissen: 'z. B. Zucker.' },
      { term: 'Transpiration', meaning: 'Wasserabgabe über Blätter', wissen: 'Treibt den Wasserstrom mit an.' },
    ],
  },
)

// ---------------------------------------------------------------------------
// Klasse 10
// ---------------------------------------------------------------------------

export const k10MutationMeiose: BioBank = bank(
  'Wikipedia: Mutation',
  'https://de.wikipedia.org/wiki/Mutation',
  'bio:k10:mut',
  [
    {
      concept: 'bio:k10:mut:def',
      prompt: 'Was ist eine Mutation?',
      answer: 'Eine bleibende Veränderung der Erbinformation',
      wrong: ['Nur eine vorübergehende Ermüdung', 'Nur eine Ernährungsgewohnheit', 'Nur ein Muskelkater'],
      explanation: 'DNA-Veränderung.',
      wissen: fw(
        'Mutationen sind Änderungen der DNA-Sequenz oder Chromosomenstruktur. Sie entstehen spontan oder durch Mutagene und sind Rohmaterial der Evolution.',
      ),
    },
    {
      concept: 'bio:k10:mut:meiose',
      prompt: 'Welche Bedeutung hat die Meiose für die Vererbung?',
      answer: 'Bildet haploide Keimzellen und sorgt für genetische Vielfalt',
      wrong: ['Verdoppelt Körperzellen ohne Reduktion', 'Ersetzt die Fotosynthese', 'Löscht alle Gene'],
      explanation: 'Reduktionsteilung + Rekombination.',
      wissen: fw(
        'Meiose halbiert den Chromosomensatz zu haploiden Keimzellen. Crossing-over und Zufallsverteilung erhöhen die genetische Vielfalt der Nachkommen.',
      ),
    },
    {
      concept: 'bio:k10:mut:mitose',
      prompt: 'Was leistet die Mitose im Vergleich zur Meiose?',
      answer: 'Erzeugt genetisch gleiche Körperzellen zur Vermehrung/Reparatur',
      wrong: ['Bildet immer nur Keimzellen', 'Halbiert immer den Chromosomensatz', 'Erzeugt nur Gameten'],
      explanation: 'Äquationsteilung.',
      wissen: fw(
        'Mitose erzeugt zwei genetisch gleiche Tochterzellen (Körperzellen). Meiose erzeugt Vielfalt und Reduktion für die sexuelle Fortpflanzung.',
      ),
    },
    {
      concept: 'bio:k10:mut:allel',
      prompt: 'Was sind Allele?',
      answer: 'Verschiedene Varianten eines Gens',
      wrong: ['Nur Zellorganellen', 'Nur Nährstoffe', 'Nur Knochenarten'],
      explanation: 'Genvarianten an einem Locus.',
      wissen: fw(
        'Allele sind Varianten eines Gens. Dominant/rezessiv beschreiben, wie sich Allele im Phänotyp zeigen — Grundlage der Mendel-Regeln.',
      ),
    },
  ],
  {
    pairs: [
      { term: 'Haploid', meaning: 'Einfacher Chromosomensatz', wissen: 'Keimzellen.' },
      { term: 'Diploid', meaning: 'Doppelter Chromosomensatz', wissen: 'Körperzellen.' },
      { term: 'Mutagen', meaning: 'Auslöser von Mutationen', wissen: 'z. B. UV, bestimmte Chemikalien.' },
    ],
    trueFalse: [
      {
        concept: 'bio:k10:mut:tf',
        statement: 'Alle Mutationen sind sofort tödlich für den Organismus.',
        correct: false,
        explanation: 'Viele Mutationen sind neutral oder haben geringe Wirkung; manche sind schädlich, selten vorteilhaft.',
        wissen: fw('Mutationen haben unterschiedliche Effekte — von neutral bis schädlich oder (selten) vorteilhaft.'),
      },
    ],
  },
)

export const k10Artbildung: BioBank = bank(
  'Wikipedia: Artbildung',
  'https://de.wikipedia.org/wiki/Artbildung',
  'bio:k10:art',
  [
    {
      concept: 'bio:k10:art:selektion',
      prompt: 'Was bewirkt natürliche Selektion?',
      answer: 'Unterschiedliche Fortpflanzungserfolge je nach Angepasstheit',
      wrong: ['Dass alle Varianten gleich häufig bleiben', 'Dass Mutationen unmöglich werden', 'Dass Ökosysteme keine Ressourcen haben'],
      explanation: 'Angepasste Merkmale häufen sich.',
      wissen: fw(
        'Natürliche Selektion begünstigt Varianten, die unter gegebenen Bedingungen höheren Fortpflanzungserfolg haben. Zusammen mit Mutation und Isolation kann Artbildung folgen.',
      ),
    },
    {
      concept: 'bio:k10:art:isolation',
      prompt: 'Warum fördert Isolation Artbildung?',
      answer: 'Getrennte Populationen tauschen keine Gene mehr und können sich auseinanderentwickeln',
      wrong: ['Weil Selektion dann aussetzt', 'Weil DNA verschwindet', 'Weil Produzenten fehlen immer'],
      explanation: 'Genfluss unterbrochen.',
      wissen: fw(
        'Geografische oder reproduktive Isolation unterbricht Genfluss. Getrennte Populationen akkumulieren unterschiedliche Änderungen — bis zur Artbildung.',
      ),
    },
    {
      concept: 'bio:k10:art:anpassung',
      prompt: 'Was meint Anpassung evolutionär?',
      answer: 'Merkmale, die den Fortpflanzungserfolg in einer Umwelt erhöhen',
      wrong: ['Bewusste Planung der Art in einer Generation', 'Nur Lernziel der Schule', 'Nur Fellpflege'],
      explanation: 'Resultat von Variation + Selektion.',
      wissen: fw(
        'Anpassungen sind ererbte Merkmale, die unter bestimmten Bedingungen den Erfolg erhöhen. Sie entstehen historisch durch Selektion, nicht durch Absicht des Individuums.',
      ),
    },
    {
      concept: 'bio:k10:art:fossil',
      prompt: 'Welche Rolle spielen Fossilien für die Evolutionsbiologie?',
      answer: 'Belegen historische Lebensformen und Abfolgen in Gesteinsschichten',
      wrong: ['Ersetzen DNA vollständig', 'Beweisen, dass Selektion unmöglich ist', 'Sind nur Kunstprodukte ohne Aussage'],
      explanation: 'Paläontologische Evidenz.',
      wissen: fw(
        'Fossilien dokumentieren ausgestorbene Formen und relative zeitliche Abfolgen. Zusammen mit vergleichender Anatomie und Molekularbiologie stützen sie Evolutionshypothesen.',
      ),
    },
  ],
  {
    pairs: [
      { term: 'Art', meaning: 'Fortpflanzungsgemeinschaft (Bio-Konzept)', wissen: 'Individuen können fruchtbare Nachkommen zeugen.' },
      { term: 'Genfluss', meaning: 'Genaustausch zwischen Populationen', wissen: 'Wirkt vereinheitlichend.' },
      { term: 'Selektion', meaning: 'Unterschiedlicher Fortpflanzungserfolg', wissen: 'Filtert Variation.' },
    ],
    multis: [
      {
        concept: 'bio:k10:art:multi',
        question: 'Welche Faktoren tragen zur Artenvielfalt bei?',
        correct: ['Mutation', 'Selektion', 'Isolation'],
        wrong: ['Vollständige Klonung ohne Variation überall', 'Sofortige Auslöschung aller Habitate'],
        explanation: 'Evolutionäre Mechanismen.',
        wissen: fw('Mutation liefert Variation; Selektion und Isolation formen neue Linien.'),
      },
    ],
  },
)

export const k10MethodenMensch: BioBank = bank(
  'Wikipedia: Humanevolution',
  'https://de.wikipedia.org/wiki/Humanevolution',
  'bio:k10:menschmeth',
  [
    {
      concept: 'bio:k10:menschmeth:homologie',
      prompt: 'Was zeigen homologe Merkmale (z. B. Skelettvergleiche)?',
      answer: 'Gemeinsame Abstammung trotz unterschiedlicher Funktion möglich',
      wrong: ['Immer konvergente Evolution ohne Verwandtschaft', 'Nur Zufall ohne Biologie', 'Nur Ernährungsgewohnheiten'],
      explanation: 'Vergleichende Anatomie.',
      wissen: fw(
        'Homologe Organe gehen auf gemeinsame Vorfahren zurück (z. B. Vorderextremitäten der Wirbeltiere). Analogien entstehen durch ähnliche Selektion ohne enge Verwandtschaft.',
      ),
    },
    {
      concept: 'bio:k10:menschmeth:werkzeug',
      prompt: 'Warum sind Steinwerkzeuge für die Humanevolution relevant?',
      answer: 'Sie belegen kulturelle und technologische Fähigkeiten früher Homininen',
      wrong: ['Sie widerlegen jede Verwandtschaft', 'Sie sind nur moderne Plastikprodukte', 'Sie ersetzen Fossilien vollständig'],
      explanation: 'Archäologische Befunde.',
      wissen: fw(
        'Werkzeuge und Siedlungsspuren ergänzen Fossilfunde: sie zeigen Verhalten, Ernährung und Kulturentwicklung der Homininen.',
      ),
    },
    {
      concept: 'bio:k10:menschmeth:dna',
      prompt: 'Was leisten DNA-Vergleiche in der Humanevolution?',
      answer: 'Schätzen Verwandtschaftsgrade und Trennungzeiten ab',
      wrong: ['Ersetzen alle Fossilien zwingend', 'Messen nur Körpergröße', 'Löschen Chromosomen'],
      explanation: 'Molekulare Phylogenetik.',
      wissen: fw(
        'Genetische Ähnlichkeiten stützen Stammbaumhypothesen (z. B. Nähe Mensch–Schimpanse). Kalibrierung braucht oft Fossilien und Modelle.',
      ),
    },
    {
      concept: 'bio:k10:menschmeth:bipedie',
      prompt: 'Was meint Bipedie?',
      answer: 'Aufrechter Gang auf zwei Beinen',
      wrong: ['Nur Fliegen', 'Nur Schwimmen mit Kiemen', 'Nur Nachtaktivität'],
      explanation: 'Wichtiges Merkmal der Homininen.',
      wissen: fw(
        'Der aufrechte Gang ist ein zentrales Merkmal der menschlichen Stammesgeschichte und hinterlässt Spuren am Skelett (Becken, Fuß, Wirbelsäule).',
      ),
    },
  ],
  {
    pairs: [
      { term: 'Homininen', meaning: 'Menschenartige Linie', wissen: 'Inkl. moderne Menschen und nahe Verwandte.' },
      { term: 'Fossil', meaning: 'Erhaltene Reste früherer Lebewesen', wissen: 'Oft mineralisiert.' },
      { term: 'Kultur', meaning: 'Erlerntes, weitergegebenes Verhalten', wissen: 'z. B. Werkzeugtechnik.' },
    ],
  },
)

// ---------------------------------------------------------------------------
// Oberstufe Zusatzthemen
// ---------------------------------------------------------------------------

export const osFotosyntheseDetail: BioBank = bank(
  'Wikipedia: Photosynthese',
  'https://de.wikipedia.org/wiki/Photosynthese',
  'bio:os:foto',
  [
    {
      concept: 'bio:os:foto:licht',
      prompt: 'Was geschieht in den lichtabhängigen Reaktionen grob?',
      answer: 'Lichtenergie wird in ATP und Reduktionsmittel überführt; O₂ entsteht',
      wrong: ['Nur Citratzyklus in der Matrix ohne Licht', 'Nur Translation am Ribosom', 'Nur Meiose'],
      explanation: 'Thylakoidmembran.',
      wissen: fw(
        'In den lichtabhängigen Reaktionen spaltet die Fotosynthese Wasser, setzt O₂ frei und bildet ATP sowie NADPH. Die Energie treibt später die Calvin-Reaktionen.',
      ),
    },
    {
      concept: 'bio:os:foto:calvin',
      prompt: 'Was leistet der Calvin-Zyklus grob?',
      answer: 'Fixierung von CO₂ zu Zucker mit ATP/NADPH',
      wrong: ['Abbau von Glucose zu CO₂ in der Atmungskette', 'Bildung von Antikörpern', 'Nervenleitung'],
      explanation: 'Lichtunabhängige Reaktionen im Stroma.',
      wissen: fw(
        'Im Calvin-Zyklus wird CO₂ enzymatisch fixiert und zu Zucker aufgebaut. Dafür werden ATP und NADPH aus den Lichtreaktionen verbraucht.',
      ),
    },
    {
      concept: 'bio:os:foto:chloroplast',
      prompt: 'Wo findet die Fotosynthese eukaryotischer Pflanzen statt?',
      answer: 'In Chloroplasten',
      wrong: ['Nur in Mitochondrien der Atmungskette', 'Nur im Zellkern', 'Nur in Lysosomen'],
      explanation: 'Chlorophyllhaltige Organellen.',
      wissen: fw(
        'Chloroplasten enthalten Thylakoide (Lichtreaktionen) und Stroma (Calvin-Zyklus). Sie sind die Orte der oxygenen Fotosynthese in Pflanzenzellen.',
      ),
    },
    {
      concept: 'bio:os:foto:bilanz',
      prompt: 'Welche grobe Stoffbilanz hat die oxygene Fotosynthese?',
      answer: 'CO₂ + H₂O → Zucker + O₂ (vereinfacht)',
      wrong: ['Zucker + O₂ → nur Metalle', 'Nur N₂ → Proteine ohne Kohlenstoff', 'Nur Salz → Licht'],
      explanation: 'Schulbilanz.',
      wissen: fw(
        'Vereinfacht: Kohlenstoffdioxid und Wasser werden zu Glucose und Sauerstoff. Tatsächlich sind viele Schritte und Zwischenprodukte beteiligt.',
      ),
    },
  ],
  {
    pairs: [
      { term: 'Chlorophyll', meaning: 'Grünes Fotosynthesepigment', wissen: 'Fängt Lichtenergie ein.' },
      { term: 'Thylakoid', meaning: 'Membransäckchen der Lichtreaktion', wissen: 'Ort der Elektronentransportkette.' },
      { term: 'Stroma', meaning: 'Grundsubstanz des Chloroplasten', wissen: 'Calvin-Zyklus.' },
    ],
    sorts: [
      {
        concept: 'bio:os:foto:sort',
        question: 'Ordne grob den Energiefluss der Fotosynthese.',
        labels: ['Lichtabsorption', 'ATP/NADPH', 'Zuckerbildung'],
        explanation: 'Licht → Energieträger → Assimilat.',
        wissen: fw('Lichtenergie wird chemisch gespeichert und dann in Zucker fixiert.'),
      },
    ],
  },
)

export const osPopulationenOS: BioBank = bank(
  'Wikipedia: Populationsökologie',
  'https://de.wikipedia.org/wiki/Populations%C3%B6kologie',
  'bio:os:pop',
  [
    {
      concept: 'bio:os:pop:wachstum',
      prompt: 'Wann erscheint Populationswachstum näherungsweise exponentiell?',
      answer: 'Wenn Ressourcen reichlich und Begrenzung gering sind',
      wrong: ['Nur wenn die Tragfähigkeit bereits überschritten ist', 'Nur ohne Fortpflanzung', 'Nur im Vakuum ohne Biologie'],
      explanation: 'r-Phase des Wachstums.',
      wissen: fw(
        'Bei geringen Dichten und reichen Ressourcen kann Wachstum näherungsweise exponentiell sein. Später bremsen dichteabhängige Faktoren — logistisches Wachstum.',
      ),
    },
    {
      concept: 'bio:os:pop:nachhaltigkeit',
      prompt: 'Was meint nachhaltige Nutzung einer Population grob?',
      answer: 'Entnahme so begrenzen, dass die Population langfristig erhalten bleibt',
      wrong: ['Maximale Ausbeutung bis zum Zusammenbruch', 'Ignorieren von Reproduktionsraten', 'Nur kurzfristiger Profit ohne Daten'],
      explanation: 'Bezug Tragfähigkeit / Reproduktion.',
      wissen: fw(
        'Nachhaltige Nutzung orientiert sich an Reproduktionsraten und Tragfähigkeit. Übernutzung führt zu Bestandsrückgang und Ökosystemschäden.',
      ),
    },
    {
      concept: 'bio:os:pop:biodiversitaet',
      prompt: 'Warum ist genetische Vielfalt in Populationen ökologisch relevant?',
      answer: 'Sie erhöht Anpassungspotenzial gegenüber Umweltänderungen',
      wrong: ['Sie verhindert jede Evolution', 'Sie löscht Allele immer', 'Sie ist nur kosmetisch'],
      explanation: 'Evolutionsökologie.',
      wissen: fw(
        'Genetische Vielfalt ermöglicht unterschiedliche Reaktionen auf Stressoren (Klima, Pathogene). Engpässe und Inzucht verringern dieses Potenzial.',
      ),
    },
    {
      concept: 'bio:os:pop:indikator',
      prompt: 'Was leistet ein Bioindikator?',
      answer: 'Zeigt Umweltzustände anhand des Vorkommens/Zustands von Arten an',
      wrong: ['Misst nur Schulnoten', 'Ersetzt Physikgesetze', 'Löscht Schadstoffe immer vollständig'],
      explanation: 'Umweltmonitoring.',
      wissen: fw(
        'Bioindikatoren (z. B. Flechten, bestimmte Wirbellose) spiegeln Umweltqualität wider. Sie ergänzen chemische Messungen.',
      ),
    },
  ],
  {
    pairs: [
      { term: 'r-Stratege', meaning: 'Viele Nachkommen, geringe Investition', wissen: 'Typisch bei instabilen Habitaten.' },
      { term: 'K-Stratege', meaning: 'Wenige Nachkommen, hohe Investition', wissen: 'Näher an Tragfähigkeit.' },
      { term: 'Übernutzung', meaning: 'Entnahme über Reproduktionsvermögen', wissen: 'Gefährdet Bestände.' },
    ],
  },
)

export const osSignalWege: BioBank = bank(
  'Wikipedia: Signaltransduktion',
  'https://de.wikipedia.org/wiki/Signaltransduktion',
  'bio:os:signal',
  [
    {
      concept: 'bio:os:signal:cascade',
      prompt: 'Was beschreibt Signaltransduktion?',
      answer: 'Umwandlung eines äußeren Signals in eine zelluläre Antwort',
      wrong: ['Nur Verdauung von Stärke', 'Nur Knochenwachstum ohne Zellen', 'Nur Jahresringbildung'],
      explanation: 'Rezeptor → Kaskade → Antwort.',
      wissen: fw(
        'Signaltransduktion: Ligand bindet Rezeptor, intrazelluläre Kaskaden (oft Second Messenger) führen zu Stoffwechsel- oder Genexpressionsänderungen.',
      ),
    },
    {
      concept: 'bio:os:signal:spezifitaet',
      prompt: 'Warum wirken Hormone selektiv?',
      answer: 'Nur Zellen mit passenden Rezeptoren reagieren',
      wrong: ['Alle Körperzellen haben immer alle Rezeptoren', 'Hormone binden nie', 'Nur die Haut reagiert immer'],
      explanation: 'Rezeptorausstattung.',
      wissen: fw(
        'Die Wirkung hängt von der Rezeptorausstattung der Zielzelle ab. Deshalb erreichen Hormone viele Organe, wirken aber nur selektiv.',
      ),
    },
    {
      concept: 'bio:os:signal:nerv',
      prompt: 'Was unterscheidet synaptische von hormoneller Signalwirkung typischerweise?',
      answer: 'Synapse: schnell und lokal; Hormon: oft langsamer und systemischer',
      wrong: ['Hormone wirken nur in Millisekunden lokal an einer Synapse immer', 'Nerven nutzen nie Transmitter', 'Beide sind identisch ohne Unterschied'],
      explanation: 'Zeit- und Raumskala.',
      wissen: fw(
        'Nervensignale sind schnell und ortsgebunden (Synapse). Hormone wirken über Blut oft langsamer und länger auf mehrere Organe.',
      ),
    },
    {
      concept: 'bio:os:signal:stoerung',
      prompt: 'Warum können Störungen der Signalwege krankheitsrelevant sein?',
      answer: 'Falsche oder fehlende Signale verändern Zellwachstum und Stoffwechsel',
      wrong: ['Signalwege haben keine biologische Funktion', 'Nur Haare sind betroffen', 'Nur Schulklingeln'],
      explanation: 'z. B. Krebs, Diabetes, Rezeptordefekte.',
      wissen: fw(
        'Fehlregulation von Wachstums- oder Stoffwechselsignalen kann zu Krankheiten führen (z. B. unkontrolliertes Wachstum, Insulinresistenz).',
      ),
    },
  ],
  {
    pairs: [
      { term: 'Ligand', meaning: 'Signalstoff, der bindet', wissen: 'z. B. Hormon, Transmitter.' },
      { term: 'cAMP', meaning: 'Häufiger Second Messenger', wissen: 'Verstärkt Signale.' },
      { term: 'Zielzelle', meaning: 'Zelle mit passendem Rezeptor', wissen: 'Selektive Wirkung.' },
    ],
  },
)

/** Generators for new topic ids (keep locked via PackTopic released:false). */
export const BIOLOGIE_DENSE_K7PLUS_GENERATORS: Record<string, Topic['generate']> = {
  'bi-k7-lb1-bakterien-bau': mixedVariants(
    bankGenerate(k7BakterienBau),
    biBakterienBauBild,
    biBakterienBauBild,
    bankGenerate(k7BakterienBau),
  ),
  'bi-k7-lb2-gefaesse': bankGenerate(k7Gefaesse),
  'bi-k7-lb4-muskeln': bankGenerate(k7Muskeln),
  'bi-k7-lb4-gelenke': bankGenerate(k7Gelenke),
  'bi-k8-lb2-geschlechtsorgane': bankGenerate(k8Geschlechtsorgane),
  'bi-k8-lb2-verantwortung': bankGenerate(k8Verantwortung),
  'bi-k9-lb1-wurzel-spross': bankGenerate(k9WurzelSpross),
  'bi-k9-lb2-nahrungskette': bankGenerate(k9Nahrungskette),
  'bi-k9-lb2-population': bankGenerate(k9Population),
  'bi-k10-lb1-mutation-meiose': bankGenerate(k10MutationMeiose),
  'bi-k10-lb2-artbildung': bankGenerate(k10Artbildung),
  'bi-k10-lb3-methoden': bankGenerate(k10MethodenMensch),
  'bi-gk11-lb2-fotosynthese': bankGenerate(osFotosyntheseDetail),
  'bi-gk11-lb2-atmung': bankGenerate(osFotosyntheseDetail),
  'bi-gk11-lb3-populationen': bankGenerate(osPopulationenOS),
  'bi-gk11-lb3-kreislauf': bankGenerate(osPopulationenOS),
  'bi-lk11-lb2-fotosynthese': bankGenerate(osFotosyntheseDetail),
  'bi-lk11-lb3-populationen': bankGenerate(osPopulationenOS),
  'bi-gk12-lb2-signalwege': bankGenerate(osSignalWege),
  'bi-gk12-lb2-stoerung': bankGenerate(osSignalWege),
  'bi-lk12-lb2-signalwege': bankGenerate(osSignalWege),
  'bi-lk12-lb2-stoerung': bankGenerate(osSignalWege),
}
