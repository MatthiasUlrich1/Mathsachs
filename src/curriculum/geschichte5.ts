/**
 * Geschichte Klasse 5
 * Inspiration: Schlaukopf Geschichte (Gym) — Formulierungen original.
 * Lehrplan: Gym Sachsen Geschichte (lplanid=65). Fachwissen fragebezogen.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const orientierung: BioBank = {
  "quelle": "Wikipedia: Geschichtswissenschaft",
  "url": "https://de.wikipedia.org/wiki/Geschichtswissenschaft",
  "conceptPrefix": "ge:k5:orientierung",
  "facts": [
    {
      "concept": "ge:k5:o:quelle",
      "prompt": "Was ist eine historische Quelle?",
      "answer": "Ein Zeugnis aus der Vergangenheit, aus dem Historiker Informationen gewinnen",
      "wrong": [
        "Nur eine moderne Werbeanzeige ohne Vergangenheitsbezug",
        "Eine Erfindung ohne Beleg",
        "Nur heutige Wetterdaten"
      ],
      "explanation": "Quellen sind Überreste oder Überlieferungen aus der Vergangenheit.",
      "wissen": "Quellen sind Überreste oder Überlieferungen aus der Vergangenheit. Sie können schriftlich, bildlich oder gegenständlich sein. Historiker prüfen Herkunft, Absicht und Glaubwürdigkeit.",
      "gap": "Eine ___ liefert Informationen über die Vergangenheit.",
      "gapAccepted": [
        "Quelle",
        "historische Quelle"
      ]
    },
    {
      "concept": "ge:k5:o:primaer",
      "prompt": "Was ist eine Primärquelle?",
      "answer": "Ein Zeugnis aus der Zeit des Ereignisses selbst",
      "wrong": [
        "Ein heutiges Schulbuch über das Ereignis",
        "Nur eine Zeitung von morgen",
        "Ein Quiz ohne Angabe"
      ],
      "explanation": "Primärquellen entstehen in der Zeit des Geschehens.",
      "wissen": "Primärquellen entstehen in der Zeit des Geschehens. Sekundärquellen werten sie später aus. Die Unterscheidung hilft, Nähe zum Ereignis einzuschätzen.",
      "gap": "Eine ___ entsteht in der Zeit des Ereignisses.",
      "gapAccepted": [
        "Primärquelle"
      ]
    },
    {
      "concept": "ge:k5:o:zeit",
      "prompt": "Wozu dient ein Zeitstrahl?",
      "answer": "Ereignisse chronologisch einzuordnen",
      "wrong": [
        "Nur Farben mischen",
        "Wetter vorhersagen",
        "Personen zählen"
      ],
      "explanation": "Ein Zeitstrahl ordnet Ereignisse von früher nach später.",
      "wissen": "Ein Zeitstrahl ordnet Ereignisse von früher nach später. Abstände und Epochen werden sichtbar. Er ist ein zentrales Orientierungsinstrument.",
      "gap": "Der ___ ordnet Ereignisse chronologisch.",
      "gapAccepted": [
        "Zeitstrahl"
      ]
    },
    {
      "concept": "ge:k5:o:epoche",
      "prompt": "Was meint „Epoche“?",
      "answer": "Einen längeren Zeitraum mit gemeinsamen Merkmalen",
      "wrong": [
        "Nur einen einzelnen Tag",
        "Nur eine Namensliste",
        "Nur ein Gebäude"
      ],
      "explanation": "Epochen fassen Zeiträume mit typischen Merkmalen zusammen.",
      "wissen": "Epochen fassen Zeiträume mit typischen Merkmalen zusammen. Grenzen sind oft fließend und von Historikern gesetzt. Sie dienen der Orientierung.",
      "gap": "Eine ___ fasst einen längeren Zeitraum zusammen.",
      "gapAccepted": [
        "Epoche"
      ]
    },
    {
      "concept": "ge:k5:o:vc",
      "prompt": "Was bedeutet „v. Chr.“?",
      "answer": "Vor Christus — Jahre vor der christlichen Zeitrechnung",
      "wrong": [
        "Nach Christus",
        "Vor dem Computer",
        "Vor Charlemagne"
      ],
      "explanation": "„v.",
      "wissen": "„v. Chr.“ zählt Jahre vor Beginn der christlichen Zeitrechnung rückwärts. „n. Chr.“ zählt vorwärts. Antike Daten sind oft Schätzungen oder Traditionen.",
      "gap": "___ bedeutet Jahre vor der christlichen Zeitrechnung.",
      "gapAccepted": [
        "v. Chr.",
        "vor Christus"
      ]
    },
    {
      "concept": "ge:k5:o:arch",
      "prompt": "Womit arbeitet die Archäologie besonders?",
      "answer": "Mit materiellen Überresten (Funde, Grabungen)",
      "wrong": [
        "Nur Instantnachrichten",
        "Nur Wetterkarten",
        "Nur Sportregeln"
      ],
      "explanation": "Archäologie erschließt Vergangenheit über Funde und Grabungen.",
      "wissen": "Archäologie erschließt Vergangenheit über Funde und Grabungen. Für schriftlose Zeiten sind materielle Quellen zentral. Fundkontext hilft bei der Einordnung.",
      "gap": "Die ___ arbeitet vor allem mit Funden.",
      "gapAccepted": [
        "Archäologie"
      ]
    },
    {
      "concept": "ge:k5:o:muend",
      "prompt": "Warum sind mündliche Überlieferungen vorsichtig zu nutzen?",
      "answer": "Weil sie sich beim Weitererzählen verändern können",
      "wrong": [
        "Weil sie immer exakt datiert sind",
        "Weil sie nie existieren",
        "Weil sie nur aus Stein sind"
      ],
      "explanation": "Sagen können Kernwahrheiten enthalten, verändern sich aber oft.",
      "wissen": "Sagen können Kernwahrheiten enthalten, verändern sich aber oft. Historiker vergleichen sie mit anderen Quellen. Mythos und Geschichte werden unterschieden.",
      "gap": "Mündliche Überlieferung kann sich beim ___ verändern.",
      "gapAccepted": [
        "Weitererzählen",
        "Erzählen"
      ]
    },
    {
      "concept": "ge:k5:o:pers",
      "prompt": "Warum können Berichte zum selben Ereignis differieren?",
      "answer": "Weil Verfasser unterschiedliche Standpunkte haben",
      "wrong": [
        "Weil es nie zwei Quellen gibt",
        "Weil Geschichte nur Zahlen sind",
        "Weil Zeitrechnung unmöglich ist"
      ],
      "explanation": "Quellen spiegeln Perspektiven und Absichten.",
      "wissen": "Quellen spiegeln Perspektiven und Absichten. Kritik heißt, den Blickwinkel mitzudenken. Mehrere Quellen erhöhen die Sicherheit.",
      "gap": "Quellen spiegeln oft den ___ des Verfassers.",
      "gapAccepted": [
        "Standpunkt",
        "Blickwinkel",
        "Perspektive"
      ]
    }
  ],
  "pairs": [
    {
      "concept": "ge:k5:o:p1",
      "term": "Primärquelle",
      "meaning": "Zeitgenössisches Zeugnis",
      "wissen": "Entsteht in der Zeit des Geschehens — z. B. Inschrift oder Brief."
    },
    {
      "concept": "ge:k5:o:p2",
      "term": "Sekundärquelle",
      "meaning": "Spätere Auswertung",
      "wissen": "Schulbücher werten Primärquellen später aus."
    },
    {
      "concept": "ge:k5:o:p3",
      "term": "Chronologie",
      "meaning": "Zeitliche Reihenfolge",
      "wissen": "Ordnet, was früher und was später geschah."
    },
    {
      "concept": "ge:k5:o:p4",
      "term": "Artefakt",
      "meaning": "Von Menschen gemachter Gegenstand",
      "wissen": "Werkzeuge und Bauwerke sind materielle Quellen."
    },
    {
      "concept": "ge:k5:o:p5",
      "term": "Mythos",
      "meaning": "Erzählung mit oft übernatürlichen Zügen",
      "wissen": "Mythen erklären Herkunft oder Werte — nicht immer wörtliche Geschichte."
    }
  ],
  "trueFalse": [
    {
      "concept": "ge:k5:o:t1",
      "statement": "Historiker prüfen Quellen auf Herkunft und Glaubwürdigkeit.",
      "correct": true,
      "explanation": "Quellenkritik prüft Herkunft, Absicht und Zuverlässigkeit.",
      "wissen": "Quellenkritik prüft Herkunft, Absicht und Zuverlässigkeit. Ohne Kritik drohen Fehlschlüsse. Das gilt für Texte und Funde."
    },
    {
      "concept": "ge:k5:o:t2",
      "statement": "Ein Zeitstrahl zeigt Ereignisse in zufälliger Reihenfolge.",
      "correct": false,
      "explanation": "Ein Zeitstrahl ist chronologisch geordnet.",
      "wissen": "Ein Zeitstrahl ist chronologisch geordnet. Zufällige Reihenfolge zerstört Orientierung. Abstände werden so sichtbar."
    }
  ],
  "sources": [
    {
      "concept": "ge:k5:o:src1",
      "question": "Was lässt sich aus diesem Quellenhinweis vor allem schließen?",
      "sourceText": "„Ich berichte, was ich selbst gesehen habe, und was mir glaubwürdige Zeugen erzählten.“",
      "sourceLabel": "Quellennotiz",
      "sourceKind": "Chronik",
      "attribution": "Typische Selbstauskunft eines Chronisten (nachgestellt)",
      "correct": "Der Verfasser beansprucht Augenzeugenschaft und Prüfung von Zeugen",
      "wrong": [
        "Der Text ist eine moderne Wettervorhersage",
        "Quellenkritik ist hier überflüssig",
        "Es handelt sich um eine reine Zahlenliste ohne Absicht"
      ],
      "explanation": "Chronisten betonen oft Nähe zum Geschehen und Glaubwürdigkeit.",
      "wissen": "Solche Formeln zeigen, dass Verfasser ihre Glaubwürdigkeit absichern wollen. Historiker prüfen trotzdem Absicht und Kontext. Quellenkritik bleibt nötig, auch wenn jemand Augenzeugenschaft behauptet."
    },
    {
      "concept": "ge:k5:o:src2",
      "question": "Welche Quellenart liegt hier eher vor?",
      "sourceText": "Ein abgenutzter Feuerstein mit Bearbeitungsspuren aus einer Grabungsschicht.",
      "sourceLabel": "Fundbeschreibung",
      "sourceKind": "Überrest",
      "correct": "Ein materieller Überrest ohne Geschichtserzählungsabsicht",
      "wrong": [
        "Eine Traditionsquelle mit bewusster Heldengeschichte",
        "Ein modernes Schulbuchkapitel",
        "Eine politische Rede des 20. Jahrhunderts"
      ],
      "explanation": "Werkzeuge sind typische Überreste der Archäologie.",
      "wissen": "Überreste entstanden oft für den Alltag, nicht als Erzählung. Bearbeitungsspuren und Fundschicht helfen bei der Deutung. Archäologie erschließt so schriftlose Zeiten."
    }
  ],
  "causeEffects": [
    {
      "concept": "ge:k5:o:ce1",
      "cause": "Quellen sind lückenhaft oder parteilich",
      "effect": "Historische Deutungen bleiben oft unsicher",
      "wissen": "Ohne vollständige und neutrale Zeugnisse bleibt Rekonstruktion vorläufig. Mehrere Quellen erhöhen Sicherheit. Kritik ist deshalb zentral."
    },
    {
      "concept": "ge:k5:o:ce2",
      "cause": "Ereignisse werden chronologisch geordnet",
      "effect": "Zusammenhänge und Abstände werden sichtbar",
      "wissen": "Zeitstrahl und Datierung schaffen Orientierung. Ohne Reihenfolge wirken Fakten isoliert. Chronologie ist Grundwerkzeug."
    },
    {
      "concept": "ge:k5:o:ce3",
      "cause": "Verfasser haben unterschiedliche Standpunkte",
      "effect": "Berichte zum selben Ereignis können differieren",
      "wissen": "Perspektive prägt Auswahl und Bewertung. Quellenkritik fragt nach Absicht. Vergleich mehrerer Stimmen hilft."
    },
    {
      "concept": "ge:k5:o:ce4",
      "cause": "Archäologische Funde werden dokumentiert",
      "effect": "Auch schriftlose Zeiten lassen sich erschließen",
      "wissen": "Materielle Spuren ersetzen fehlende Texte. Fundkontext ist entscheidend. Regionalgeschichte wird greifbar."
    }
  ]
}

const steinzeit: BioBank = {
  "quelle": "Wikipedia: Steinzeit",
  "url": "https://de.wikipedia.org/wiki/Steinzeit",
  "conceptPrefix": "ge:k5:steinzeit",
  "facts": [
    {
      "concept": "ge:k5:st:paleo",
      "prompt": "Wovon lebten Menschen in der Altsteinzeit vor allem?",
      "answer": "Von Jagen, Sammeln und Fischen",
      "wrong": [
        "Von industrieller Massentierhaltung",
        "Von Großbanken",
        "Von Dampfmaschinen"
      ],
      "explanation": "In der Altsteinzeit lebten Menschen als Jäger und Sammler.",
      "wissen": "In der Altsteinzeit lebten Menschen als Jäger und Sammler. Gruppen waren oft mobil. Werkzeuge aus Stein und Knochen prägten den Alltag.",
      "gap": "Altsteinzeitliche Menschen lebten als ___.",
      "gapAccepted": [
        "Jäger und Sammler",
        "Wildbeuter",
        "Jäger"
      ]
    },
    {
      "concept": "ge:k5:st:neo",
      "prompt": "Was kennzeichnet die Jungsteinzeit besonders?",
      "answer": "Ackerbau, Viehzucht und sesshafte Dörfer",
      "wrong": [
        "Raumfahrt",
        "Buchdruck",
        "Dampfkraft"
      ],
      "explanation": "Im Neolithikum begannen Ackerbau und Viehzucht.",
      "wissen": "Im Neolithikum begannen Ackerbau und Viehzucht. Sesshaftigkeit veränderte Gesellschaft und Landschaft. Das gilt als Umbruch zum bäuerlichen Leben.",
      "gap": "Die Jungsteinzeit bringt ___ und Viehzucht.",
      "gapAccepted": [
        "Ackerbau",
        "Landwirtschaft"
      ]
    },
    {
      "concept": "ge:k5:st:feuer",
      "prompt": "Welche Bedeutung hatte die Beherrschung des Feuers?",
      "answer": "Wärme, Schutz, Nahrung zubereiten, Licht",
      "wrong": [
        "Nur für Stromnetze",
        "Nur für Autoreifen",
        "Nur für Smartphones"
      ],
      "explanation": "Feuer spendete Wärme und Licht und ermöglichte gekochte Nahrung.",
      "wissen": "Feuer spendete Wärme und Licht und ermöglichte gekochte Nahrung. Es war zentral für Lagerleben. Die Kontrolle über Feuer war ein Kulturtechnik-Schritt.",
      "gap": "Feuer diente u. a. der ___.",
      "gapAccepted": [
        "Wärme",
        "Nahrungszubereitung"
      ]
    },
    {
      "concept": "ge:k5:st:hoehle",
      "prompt": "Wofür sind Höhlenmalereien bekannt?",
      "answer": "Als frühe Bildkunst mit möglichen Ritualbezügen",
      "wrong": [
        "Als Baupläne für Wolkenkratzer",
        "Als Fahrpläne",
        "Als Aktienkurse"
      ],
      "explanation": "Höhlenmalereien zeigen Tiere und Zeichen der Eiszeit.",
      "wissen": "Höhlenmalereien zeigen Tiere und Zeichen der Eiszeit. Sie belegen symbolisches Denken. Der genaue Zweck wird diskutiert.",
      "gap": "Höhlenmalereien belegen frühe ___.",
      "gapAccepted": [
        "Bildkunst",
        "Kunst"
      ]
    },
    {
      "concept": "ge:k5:st:hoch",
      "prompt": "Was kennzeichnet frühe Hochkulturen grob?",
      "answer": "Schrift, Städte, Spezialisierung, zentrale Herrschaft",
      "wrong": [
        "Nur Nomadentum ohne Schrift",
        "Nur Steinzeitjagd",
        "Nur moderne Industrie"
      ],
      "explanation": "Hochkulturen entwickelten Städte, Verwaltung und oft Schrift.",
      "wissen": "Hochkulturen entwickelten Städte, Verwaltung und oft Schrift. Flusstäler boten günstige Bedingungen. Herrschaft und Religion waren eng verknüpft.",
      "gap": "Frühe Hochkulturen haben oft ___ und Städte.",
      "gapAccepted": [
        "Schrift",
        "Verwaltung"
      ]
    },
    {
      "concept": "ge:k5:st:nil",
      "prompt": "Warum war der Nil für Ägypten entscheidend?",
      "answer": "Überschwemmungen düngten die Felder",
      "wrong": [
        "Weil er nie Wasser führte",
        "Weil er nur gefror",
        "Weil er nur Bergbau ermöglichte"
      ],
      "explanation": "Nilüberschwemmungen brachten fruchtbaren Schlamm.",
      "wissen": "Nilüberschwemmungen brachten fruchtbaren Schlamm. Landwirtschaft hing vom Fluss ab. Kalender und Verwaltung organisierten Aussaat.",
      "gap": "Der Nil brachte ___ auf die Felder.",
      "gapAccepted": [
        "Schlamm",
        "Fruchtbarkeit",
        "Wasser"
      ]
    },
    {
      "concept": "ge:k5:st:meso",
      "prompt": "Wo lag Mesopotamien?",
      "answer": "Zwischen Euphrat und Tigris",
      "wrong": [
        "Zwischen Rhein und Donau",
        "In Skandinavien",
        "In Australien"
      ],
      "explanation": "Mesopotamien liegt zwischen Euphrat und Tigris.",
      "wissen": "Mesopotamien liegt zwischen Euphrat und Tigris. Dort entstanden Stadtstaaten und Keilschrift. Bewässerung war Grundlage der Landwirtschaft.",
      "gap": "Mesopotamien liegt zwischen ___ und Tigris.",
      "gapAccepted": [
        "Euphrat"
      ]
    },
    {
      "concept": "ge:k5:st:keil",
      "prompt": "Welche Schrift entstand in Mesopotamien?",
      "answer": "Keilschrift",
      "wrong": [
        "Lateinische Blockschrift der Neuzeit",
        "Morsezeichen",
        "QR-Codes"
      ],
      "explanation": "Keilschrift entstand in Mesopotamien, oft auf Tontafeln.",
      "wissen": "Keilschrift entstand in Mesopotamien, oft auf Tontafeln. Sie diente Verwaltung und Literatur. Schrift macht komplexe Gesellschaften steuerbar.",
      "gap": "In Mesopotamien entstand die ___.",
      "gapAccepted": [
        "Keilschrift"
      ]
    },
    {
      "concept": "ge:k5:st:sess",
      "prompt": "Was bedeutet Sesshaftigkeit?",
      "answer": "Dauerhaftes Wohnen an einem Ort",
      "wrong": [
        "Ständiges Umherziehen",
        "Nur Seefahrt",
        "Nur Weltraumleben"
      ],
      "explanation": "Sesshaftigkeit meint festes Wohnen mit Häusern und Feldern.",
      "wissen": "Sesshaftigkeit meint festes Wohnen mit Häusern und Feldern. Sie erleichtert Vorräte und Spezialisierung. Nomadisches Leben bleibt daneben bestehen.",
      "gap": "Sesshaftigkeit heißt dauerhaftes ___ an einem Ort.",
      "gapAccepted": [
        "Wohnen",
        "Leben"
      ]
    }
  ],
  "pairs": [
    {
      "concept": "ge:k5:st:p1",
      "term": "Altsteinzeit",
      "meaning": "Jäger und Sammler",
      "wissen": "Mobile Gruppen mit Steinwerkzeugen."
    },
    {
      "concept": "ge:k5:st:p2",
      "term": "Jungsteinzeit",
      "meaning": "Ackerbau und Viehzucht",
      "wissen": "Sesshafte Dörfer und Vorratshaltung."
    },
    {
      "concept": "ge:k5:st:p3",
      "term": "Pharao",
      "meaning": "Herrscher im alten Ägypten",
      "wissen": "Als gottähnlich verehrt; zentrale politische Figur."
    },
    {
      "concept": "ge:k5:st:p4",
      "term": "Pyramide",
      "meaning": "Monumentales Grabmal",
      "wissen": "Symbol königlicher Macht und Jenseitsglaube."
    },
    {
      "concept": "ge:k5:st:p5",
      "term": "Hieroglyphen",
      "meaning": "Bilderschrift Ägyptens",
      "wissen": "Entzifferung u. a. über den Rosetta-Stein."
    }
  ],
  "trueFalse": [
    {
      "concept": "ge:k5:st:t1",
      "statement": "In der Jungsteinzeit begannen Ackerbau und Viehzucht.",
      "correct": true,
      "explanation": "Das Neolithikum bringt Landwirtschaft und Sesshaftigkeit.",
      "wissen": "Das Neolithikum bringt Landwirtschaft und Sesshaftigkeit. Das verändert Ernährung und Gesellschaft. Es ist ein Schlüsselumbruch."
    },
    {
      "concept": "ge:k5:st:t2",
      "statement": "Hochkulturen entstehen typischerweise ohne Schrift und Städte.",
      "correct": false,
      "explanation": "Schrift, Städte und Spezialisierung sind typische Merkmale.",
      "wissen": "Schrift, Städte und Spezialisierung sind typische Merkmale. Flusstäler begünstigten Landwirtschaft. Herrschaft organisierte Abgaben."
    }
  ],
  "sorts": [
    {
      "concept": "ge:k5:st:sort",
      "question": "Ordne chronologisch (früh → spät):",
      "labels": [
        "Altsteinzeit",
        "Jungsteinzeit",
        "Frühe Hochkulturen"
      ],
      "explanation": "Die Abfolge Altsteinzeit → Jungsteinzeit → Hochkulturen ist ein grobes Schema.",
      "wissen": "Die Abfolge Altsteinzeit → Jungsteinzeit → Hochkulturen ist ein grobes Schema. Regional gibt es Übergänge. Es hilft zur Orientierung."
    }
  ]
}

const griechenland: BioBank = {
  "quelle": "Wikipedia: Antikes Griechenland",
  "url": "https://de.wikipedia.org/wiki/Antikes_Griechenland",
  "conceptPrefix": "ge:k5:griechenland",
  "facts": [
    {
      "concept": "ge:k5:gr:polis",
      "prompt": "Was war eine Polis?",
      "answer": "Ein Stadtstaat mit Umland und eigener Ordnung",
      "wrong": [
        "Ein modernes Bundesland",
        "Nur ein Sportverein",
        "Nur ein Fluss"
      ],
      "explanation": "Die Polis war der typische griechische Stadtstaat.",
      "wissen": "Die Polis war der typische griechische Stadtstaat. Bürgerrechte und Politik waren lokal organisiert. Athen und Sparta sind bekannte Beispiele.",
      "gap": "Eine ___ ist ein griechischer Stadtstaat.",
      "gapAccepted": [
        "Polis"
      ]
    },
    {
      "concept": "ge:k5:gr:dem",
      "prompt": "Wofür ist Athen bekannt?",
      "answer": "Für Ansätze direkter Demokratie der Bürger",
      "wrong": [
        "Für die Dampfmaschine",
        "Für die Berliner Mauer",
        "Für Feudalismus"
      ],
      "explanation": "In Athen konnten männliche Vollbürger in der Volksversammlung mitentscheiden.",
      "wissen": "In Athen konnten männliche Vollbürger in der Volksversammlung mitentscheiden. Frauen, Sklaven und Metöken waren ausgeschlossen. Das Modell prägte späteres Demokratieverständnis.",
      "gap": "Athen ist bekannt für frühe ___.",
      "gapAccepted": [
        "Demokratie"
      ]
    },
    {
      "concept": "ge:k5:gr:sparta",
      "prompt": "Wofür stand Sparta?",
      "answer": "Für militärische Disziplin und strenge Erziehung",
      "wrong": [
        "Für pazifistische Handelsrepublik",
        "Nur Buchdruck",
        "Nur Industrialisierung"
      ],
      "explanation": "Sparta betonte Kriegstüchtigkeit und strenge Erziehung.",
      "wissen": "Sparta betonte Kriegstüchtigkeit und strenge Erziehung. Heloten bearbeiteten die Felder. Die Ordnung unterschied sich stark von Athen.",
      "gap": "Sparta betonte vor allem ___.",
      "gapAccepted": [
        "Militär",
        "Disziplin",
        "Kriegstüchtigkeit"
      ]
    },
    {
      "concept": "ge:k5:gr:olymp",
      "prompt": "Was waren die Olympischen Spiele der Antike?",
      "answer": "Panhellenische Wettkämpfe zu Ehren des Zeus",
      "wrong": [
        "Nur Fußball-WM",
        "Nur Gladiatorenkämpfe",
        "Nur Mittelalterturniere"
      ],
      "explanation": "In Olympia fanden Wettkämpfe zu Ehren des Zeus statt.",
      "wissen": "In Olympia fanden Wettkämpfe zu Ehren des Zeus statt. Oft galt ein Gottesfriede. Sie verbanden Kult und Konkurrenz.",
      "gap": "Die Spiele in Olympia ehrten ___.",
      "gapAccepted": [
        "Zeus"
      ]
    },
    {
      "concept": "ge:k5:gr:phil",
      "prompt": "Welche Denker gehören zur klassischen Philosophie?",
      "answer": "Sokrates, Platon und Aristoteles",
      "wrong": [
        "Napoleon und Bismarck",
        "Gutenberg und Watt",
        "Karl der Große"
      ],
      "explanation": "Sokrates, Platon und Aristoteles prägten Denken über Ethik und Staat.",
      "wissen": "Sokrates, Platon und Aristoteles prägten Denken über Ethik und Staat. Philosophie fragt nach Gründen. Ihre Werke wurden später vielfach rezipiert.",
      "gap": "___ fragte kritisch nach Wissen und Tugend.",
      "gapAccepted": [
        "Sokrates"
      ]
    },
    {
      "concept": "ge:k5:gr:pers",
      "prompt": "Worum ging es in den Perserkriegen?",
      "answer": "Griechische Poleis wehrten das Perserreich ab",
      "wrong": [
        "Entdeckung Amerikas",
        "Dreißigjähriger Krieg",
        "Industrialisierung"
      ],
      "explanation": "Im 5.",
      "wissen": "Im 5. Jh. v. Chr. griff Persien an; Marathon und Salamis sind Stationen. Der Widerstand festigte Selbstbewusstsein. Danach stieg Athens Einfluss.",
      "gap": "Bei Marathon kämpften Griechen gegen ___.",
      "gapAccepted": [
        "Perser",
        "das Perserreich"
      ]
    },
    {
      "concept": "ge:k5:gr:sklav",
      "prompt": "Hatten alle Einwohner Athens volles Bürgerrecht?",
      "answer": "Nein — Frauen, Sklaven und Metöken waren ausgeschlossen",
      "wrong": [
        "Ja, ausnahmslos jeder",
        "Nur Sklaven hatten alle Rechte",
        "Nur Kinder"
      ],
      "explanation": "Die athenische Demokratie galt nur für Bürger.",
      "wissen": "Die athenische Demokratie galt nur für Bürger. Viele Einwohner hatten keine politischen Rechte. Das relativiert „Demokratie für alle“.",
      "gap": "Viele Einwohner Athens hatten kein volles ___.",
      "gapAccepted": [
        "Bürgerrecht"
      ]
    },
    {
      "concept": "ge:k5:gr:thea",
      "prompt": "Welche Kulturform blühte in Athen?",
      "answer": "Theater (Tragödie und Komödie)",
      "wrong": [
        "Nur moderne Kinos",
        "Nur Fernsehen",
        "Nur Operetten des 19. Jh."
      ],
      "explanation": "Dramen gehörten zum Festkult.",
      "wissen": "Dramen gehörten zum Festkult. Theater war Politik, Religion und Unterhaltung. Es prägte europäische Literatur.",
      "gap": "In Athen blühten Tragödie und ___.",
      "gapAccepted": [
        "Komödie",
        "Theater"
      ]
    }
  ],
  "pairs": [
    {
      "concept": "ge:k5:gr:p1",
      "term": "Athen",
      "meaning": "Demokratie / Kulturzentrum",
      "wissen": "Volksversammlung und kulturelle Blüte."
    },
    {
      "concept": "ge:k5:gr:p2",
      "term": "Sparta",
      "meaning": "Militärstaat",
      "wissen": "Strenge Erziehung und Kriegerideal."
    },
    {
      "concept": "ge:k5:gr:p3",
      "term": "Agora",
      "meaning": "Markt- und Versammlungsplatz",
      "wissen": "Ort öffentlicher Kommunikation."
    },
    {
      "concept": "ge:k5:gr:p4",
      "term": "Akropolis",
      "meaning": "Burgberg mit Tempeln",
      "wissen": "In Athen u. a. Parthenon."
    },
    {
      "concept": "ge:k5:gr:p5",
      "term": "Olympia",
      "meaning": "Ort der Spiele",
      "wissen": "Panhellenische Wettkämpfe für Zeus."
    }
  ],
  "trueFalse": [
    {
      "concept": "ge:k5:gr:t1",
      "statement": "Die Polis war der typische politische Rahmen im antiken Griechenland.",
      "correct": true,
      "explanation": "Stadtstaaten regierten lokal.",
      "wissen": "Stadtstaaten regierten lokal. Ein einheitlicher Nationalstaat existierte lange nicht. Bündnisse verbanden oder trennten Poleis."
    },
    {
      "concept": "ge:k5:gr:t2",
      "statement": "In Athen hatten Sklaven volles Stimmrecht.",
      "correct": false,
      "explanation": "Sklaven waren ausgeschlossen.",
      "wissen": "Sklaven waren ausgeschlossen. Auch Frauen und Metöken fehlten politische Rechte. Bürgerrecht war privilegiert."
    }
  ]
}

const menschNatur: BioBank = {
  "quelle": "Wikipedia: Umweltgeschichte",
  "url": "https://de.wikipedia.org/wiki/Umweltgeschichte",
  "conceptPrefix": "ge:k5:mensch-natur",
  "facts": [
    {
      "concept": "ge:k5:mn:fluss",
      "prompt": "Warum siedelten Hochkulturen oft an Flüssen?",
      "answer": "Wasser, Fruchtbarkeit und Transportwege",
      "wrong": [
        "Weil Flüsse immer giftig waren",
        "Wegen fehlender Sonne",
        "Nur wegen Gebirgsgipfeln"
      ],
      "explanation": "Flüsse lieferten Wasser und fruchtbare Böden und erleichterten Transport.",
      "wissen": "Flüsse lieferten Wasser und fruchtbare Böden und erleichterten Transport. Überschwemmungen konnten Segen und Gefahr sein. Herrschaft organisierte den Umgang damit.",
      "gap": "Flüsse boten Wasser, Böden und ___.",
      "gapAccepted": [
        "Transport",
        "Handelswege"
      ]
    },
    {
      "concept": "ge:k5:mn:wald",
      "prompt": "Welche Folge hatte Rodung oft?",
      "answer": "Mehr Ackerland, aber auch Erosion",
      "wrong": [
        "Immer sofortige Wüsten",
        "Nur mehr Eiszeiten",
        "Nur bessere Raumfahrt"
      ],
      "explanation": "Rodung schuf Felder, veränderte aber Ökosysteme.",
      "wissen": "Rodung schuf Felder, veränderte aber Ökosysteme. Holzknappheit und Erosion traten regional auf. Mensch-Natur-Beziehungen sind ambivalent.",
      "gap": "Rodung kann ___ fördern.",
      "gapAccepted": [
        "Erosion",
        "Holzknappheit"
      ]
    },
    {
      "concept": "ge:k5:mn:klima",
      "prompt": "Können Klimaänderungen Geschichte beeinflussen?",
      "answer": "Ja — Ernten, Wanderungen und Krisen hängen oft damit zusammen",
      "wrong": [
        "Nein, Klima ist irrelevant",
        "Nur für Sportwetten",
        "Nur für Mode"
      ],
      "explanation": "Dürre oder Kälte beeinflussten Ernten und Konflikte.",
      "wissen": "Dürre oder Kälte beeinflussten Ernten und Konflikte. Klima ist ein Faktor neben Politik und Wirtschaft. Es erklärt nicht alles allein.",
      "gap": "Klima kann ___ mitbestimmen.",
      "gapAccepted": [
        "Ernten",
        "Wanderungen",
        "Krisen"
      ]
    },
    {
      "concept": "ge:k5:mn:bew",
      "prompt": "Was ermöglicht Bewässerung?",
      "answer": "Landwirtschaft trotz geringer Niederschläge",
      "wrong": [
        "Verbot von Ackerbau",
        "Nur Eisberge",
        "Nur Weltraumkolonien"
      ],
      "explanation": "Kanäle leiten Wasser auf Felder.",
      "wissen": "Kanäle leiten Wasser auf Felder. Das erfordert Organisation. In Mesopotamien und Ägypten war Bewässerung zentral.",
      "gap": "Bewässerung macht ___ möglich.",
      "gapAccepted": [
        "Landwirtschaft",
        "Ackerbau"
      ]
    },
    {
      "concept": "ge:k5:mn:roh",
      "prompt": "Warum sind Rohstoffe historisch umkämpft?",
      "answer": "Weil sie Macht, Technik und Wohlstand ermöglichen",
      "wrong": [
        "Weil sie nie gebraucht werden",
        "Weil sie unsichtbar sind",
        "Nur aus Langeweile"
      ],
      "explanation": "Metalle, Holz oder später Kohle waren strategisch.",
      "wissen": "Metalle, Holz oder später Kohle waren strategisch. Kontrolle prägte Kriege und Handel. Umweltausbeutung ist Teil der Machtgeschichte.",
      "gap": "Rohstoffe ermöglichen Technik und ___.",
      "gapAccepted": [
        "Macht",
        "Wohlstand"
      ]
    },
    {
      "concept": "ge:k5:mn:tier",
      "prompt": "Welche Rolle spielten domestizierte Tiere?",
      "answer": "Arbeit, Nahrung, Transport und Rohstoffe",
      "wrong": [
        "Nur Haustierblogs",
        "Nur Weltraumforschung",
        "Nur als Münzen"
      ],
      "explanation": "Rinder, Schafe und Pferde lieferten Milch, Fleisch, Wolle und Zugkraft.",
      "wissen": "Rinder, Schafe und Pferde lieferten Milch, Fleisch, Wolle und Zugkraft. Domestikation veränderte die Lebensweise. Tiere waren auch Statussymbole.",
      "gap": "Domestizierte Tiere lieferten Nahrung und ___.",
      "gapAccepted": [
        "Arbeit",
        "Zugkraft"
      ]
    }
  ],
  "pairs": [
    {
      "concept": "ge:k5:mn:p1",
      "term": "Nilüberschwemmung",
      "meaning": "Fruchtbarer Schlamm",
      "wissen": "Flusseinfluss prägte Ägyptens Landwirtschaft."
    },
    {
      "concept": "ge:k5:mn:p2",
      "term": "Rodung",
      "meaning": "Wald zu Acker",
      "wissen": "Mehr Felder, aber Eingriff in Ökosysteme."
    },
    {
      "concept": "ge:k5:mn:p3",
      "term": "Bewässerungskanal",
      "meaning": "Wasserverteilung",
      "wissen": "Organisierte Technik für Trockengebiete."
    },
    {
      "concept": "ge:k5:mn:p4",
      "term": "Terrasse",
      "meaning": "Stufenacker am Hang gegen Erosion",
      "wissen": "Anpassung an Gelände, schonender Ackerbau."
    },
    {
      "concept": "ge:k5:mn:p5",
      "term": "Deich",
      "meaning": "Hochwasserschutz für Siedlungen",
      "wissen": "Gemeinschaftliche Bauleistung, sichert Ernten."
    },
    {
      "concept": "ge:k5:mn:p6",
      "term": "Pflug",
      "meaning": "Bodenbearbeitung, tieferes Lockern",
      "wissen": "Eisenpflug ermöglichte schwere Lehmböden."
    }
  ],
  "trueFalse": [
    {
      "concept": "ge:k5:mn:t1",
      "statement": "Menschliche Eingriffe in die Natur haben historisch oft Folgen für Wirtschaft und Macht.",
      "correct": true,
      "explanation": "Umwelt und Gesellschaft bedingen sich.",
      "wissen": "Umwelt und Gesellschaft bedingen sich. Ressourcen und Klima sind historische Faktoren. Längsschnitte zeigen Wandel."
    },
    {
      "concept": "ge:k5:mn:t2",
      "statement": "Klimaänderungen hatten in der Antike keinen Einfluss auf Ernten und Wanderungen.",
      "correct": false,
      "explanation": "Dürre und Kälte verursachten Ernteausfälle und Migrationsdruck.",
      "wissen": "Klima ist ein historischer Faktor neben Politik und Wirtschaft. Es erklärt nicht alles allein, aber es wirkt mit."
    },
    {
      "concept": "ge:k5:mn:t3",
      "statement": "Bewässerung war in Mesopotamien und Ägypten zentral für stabile Erträge.",
      "correct": true,
      "explanation": "Kanäle leiteten Flusswasser auf Felder bei geringem Regen.",
      "wissen": "Organisierte Bewässerung erforderte Verwaltung und Recht. Sie trug zur Staatsbildung bei."
    }
  ],
  "sorts": [
    {
      "concept": "ge:k5:mn:s1",
      "question": "Ordne den typischen Jahreszyklus am Nil (ältestes zuerst).",
      "labels": [
        "Nil schwillt an (Überschwemmung)",
        "Schlamm setzt sich auf Feldern ab",
        "Aussaat nach Rückgang des Wassers",
        "Ernte und Einlagerung in Speicher"
      ],
      "explanation": "Überschwemmung → Schlamm → Aussaat → Ernte — der ägyptische Rhythmus.",
      "wissen": "Der Nil bestimmte den Kalender. Priester berechneten den Anstieg. Staat organisierte Vorrat."
    }
  ],
  "multis": [
    {
      "concept": "ge:k5:mn:m1",
      "question": "Welche Folgen kann Rodung für Mensch und Natur haben?",
      "correct": [
        "Mehr Ackerfläche für Ernährung",
        "Erosion und Verlust von Oberboden",
        "Holzknappheit für Bau und Feuer"
      ],
      "wrong": [
        "Sofortige Wüstenbildung weltweit",
        "Automatisch mehr Wildtiere",
        "Keine Veränderung der Landschaft"
      ],
      "explanation": "Rodung ist ambivalent: Gewinn an Fläche, Risiko für Boden.",
      "wissen": "Historisch führten großflächige Rodungen zu Erosion und Holznot. Wiederaufforstung war selten."
    }
  ],
"causeEffects": [
      {
        "concept": "ge:k5:mn:c1",
        "cause": "Regelmäßige Nilüberschwemmung",
        "effect": "Fruchtbare Böden ohne künstlichen Dünger",
        "wissen": "Der Nil brachte jährlich nährstoffreichen Schlamm. Kein Kunstdünger nötig — natürliche Fruchtbarkeit."
      },
      {
        "concept": "ge:k5:mn:c2",
        "cause": "Rodung großer Waldgebiete",
        "effect": "Bodenabtrag durch Wind und Regen steigt",
        "wissen": "Ohne Wurzeln und Kronen schützen, wird Oberboden abgetragen. Erosion folgt oft auf Rodung."
      },
      {
        "concept": "ge:k5:mn:c3",
        "cause": "Bau von Bewässerungskanälen",
        "effect": "Ackerbau auch in Trockenzeiten möglich",
        "wissen": "Kanäle leiten Flusswasser auf Felder. Erfordert Organisation, Recht, Wartung — Basis früher Staatlichkeit."
      },
      {
        "concept": "ge:k5:mn:c4",
        "cause": "Einführung des Eisenpflugs",
        "effect": "Schwere Lehmböden werden ackerbar",
        "wissen": "Holzpflug brach auf leichten Böden. Eisenpflug (ab ca. 500 v. Chr.) öffnete schwere, fruchtbare Löss-/Lehmböden."
      }
    ],
  "sources": [
    {
      "concept": "ge:k5:mn:src1",
      "question": "Was beschreibt dieser Text über das alte Ägypten?",
      "sourceText": "Der Nil steigt jedes Jahr, überflutet die Felder und hinterlässt schwarzen Schlamm, der fruchtbarer ist als jeder Dünger.",
      "sourceLabel": "Herodot, Historien II, 5. Jh. v. Chr.",
      "sourceKind": "antike Quelle",
      "attribution": "Herodot, gemeinfrei",
      "correct": "Die jährliche Nilüberschwemmung düngte die Äcker natürlich.",
      "wrong": [
        "Der Nil war für die Landwirtschaft unwichtig.",
        "Ägypter nutzten nur künstlichen Dünger.",
        "Der Schlamm war giftig für Pflanzen."
      ],
      "explanation": "Herodot nannte Ägypten ‚Geschenk des Nils‘ — die Überschwemmung sicherte den Ertrag.",
      "wissen": "Antike Autoren wie Herodot sind wichtige Quellen für Umweltgeschichte. Ihre Berichte sind aber selektiv."
    }
  ]
}

const alexander: BioBank = {
  "quelle": "Wikipedia: Alexander der Große",
  "url": "https://de.wikipedia.org/wiki/Alexander_der_Gro%C3%9Fe",
  "conceptPrefix": "ge:k5:alexander",
  "facts": [
    {
      "concept": "ge:k5:al:wer",
      "prompt": "Wer war Alexander „der Große“?",
      "answer": "König von Makedonien, der ein Großreich eroberte",
      "wrong": [
        "Ein römischer Kaiser des 1. Jh.",
        "Ein mittelalterlicher Papst",
        "Ein Industrieller"
      ],
      "explanation": "Alexander III.",
      "wissen": "Alexander III. (356–323 v. Chr.) eroberte das Perserreich. Sein Reich reichte bis nach Indien. Nach seinem Tod zerfiel es unter den Diadochen.",
      "gap": "Alexander war König von ___.",
      "gapAccepted": [
        "Makedonien"
      ]
    },
    {
      "concept": "ge:k5:al:ar",
      "prompt": "Welcher Philosoph unterrichtete Alexander?",
      "answer": "Aristoteles",
      "wrong": [
        "Karl Marx",
        "Immanuel Kant",
        "Thomas Jefferson"
      ],
      "explanation": "Aristoteles unterrichtete den jungen Alexander.",
      "wissen": "Aristoteles unterrichtete den jungen Alexander. Die Verbindung von Macht und Bildung wurde stilisiert. Der Einfluss auf Politik ist umstritten.",
      "gap": "Alexander wurde von ___ unterrichtet.",
      "gapAccepted": [
        "Aristoteles"
      ]
    },
    {
      "concept": "ge:k5:al:pers",
      "prompt": "Welches Reich besiegte Alexander?",
      "answer": "Das Achämenidenreich (Perserreich)",
      "wrong": [
        "Das Heilige Römische Reich",
        "Das Britische Empire",
        "Die USA"
      ],
      "explanation": "Bei Issos und Gaugamela besiegte Alexander die Perser.",
      "wissen": "Bei Issos und Gaugamela besiegte Alexander die Perser. Er übernahm Herrschaftsstrukturen. Der Weg nach Zentralasien und Indien öffnete sich.",
      "gap": "Alexander besiegte das ___.",
      "gapAccepted": [
        "Perserreich",
        "Achämenidenreich"
      ]
    },
    {
      "concept": "ge:k5:al:hel",
      "prompt": "Was meint Hellenismus?",
      "answer": "Ausbreitung griechischer Kultur und Mischformen im Osten",
      "wrong": [
        "Nur Mittelalter in England",
        "Nur Industrialisierung",
        "Nur Feudalismus"
      ],
      "explanation": "Nach Alexander vermischten sich griechische und orientalische Elemente.",
      "wissen": "Nach Alexander vermischten sich griechische und orientalische Elemente. Städte und Sprache verbreiteten sich. Der Hellenismus prägte den Osten.",
      "gap": "Hellenismus meint Ausbreitung ___ Kultur.",
      "gapAccepted": [
        "griechischer",
        "hellenischer"
      ]
    },
    {
      "concept": "ge:k5:al:tod",
      "prompt": "Was geschah nach Alexanders Tod?",
      "answer": "Sein Reich zerfiel unter den Diadochen",
      "wrong": [
        "Es blieb ewig ungeteilt",
        "Es wurde sofort römisch",
        "Es verschwand ohne Nachfolger"
      ],
      "explanation": "Ohne klaren Erben kämpften Generäle um Teilreiche.",
      "wissen": "Ohne klaren Erben kämpften Generäle um Teilreiche. Ptolemäer und Seleukiden entstanden. Die Einheit endete rasch.",
      "gap": "Nach dem Tod kämpften die ___.",
      "gapAccepted": [
        "Diadochen"
      ]
    },
    {
      "concept": "ge:k5:al:titel",
      "prompt": "Warum ist „der Große“ umstritten?",
      "answer": "Weil Eroberung und Gewalt neben Kulturleistung stehen",
      "wrong": [
        "Weil er nie existierte",
        "Weil er nur Bauer war",
        "Weil er den Buchdruck erfand"
      ],
      "explanation": "„Groß“ bewertet Macht — oft aus Siegerperspektive.",
      "wissen": "„Groß“ bewertet Macht — oft aus Siegerperspektive. Kritiker betonen Gewalt. Urteile hängen vom Maßstab ab.",
      "gap": "Der Beiname ist eine ___.",
      "gapAccepted": [
        "Wertung",
        "Bewertung"
      ]
    }
  ],
  "pairs": [
    {
      "concept": "ge:k5:al:p1",
      "term": "Makedonien",
      "meaning": "Ausgangsland",
      "wissen": "Philipp II. einte vieles vor Alexander."
    },
    {
      "concept": "ge:k5:al:p2",
      "term": "Diadochen",
      "meaning": "Nachfolger-Generäle",
      "wissen": "Teilten das Reich nach 323 v. Chr."
    },
    {
      "concept": "ge:k5:al:p3",
      "term": "Hellenismus",
      "meaning": "Griechisch-orientalische Mischkultur",
      "wissen": "Städte und Sprache im Osten."
    },
    {
      "concept": "ge:k5:al:p4",
      "term": "Issos",
      "meaning": "Schlacht 333 v. Chr. gegen Dareios III.",
      "wissen": "Alexander besiegte den Großkönig erstmals."
    },
    {
      "concept": "ge:k5:al:p5",
      "term": "Gaugamela",
      "meaning": "Entscheidende Schlacht 331 v. Chr.",
      "wissen": "Ende der achämenidischen Herrschaft."
    },
    {
      "concept": "ge:k5:al:p6",
      "term": "Philipp II.",
      "meaning": "Vater, einte Makedonien, reformierte Heer",
      "wissen": "Schaffte die Basis für Alexanders Eroberungen."
    }
  ],
  "trueFalse": [
    {
      "concept": "ge:k5:al:t1",
      "statement": "Alexanders Reich blieb nach seinem Tod dauerhaft als Einheit bestehen.",
      "correct": false,
      "explanation": "Diadochenkämpfe zersplitterten das Reich.",
      "wissen": "Diadochenkämpfe zersplitterten das Reich. Teilreiche entstanden. Die Einheit war kurzlebig."
    },
    {
      "concept": "ge:k5:al:t2",
      "statement": "Alexander wurde von Platon unterrichtet.",
      "correct": false,
      "explanation": "Sein Lehrer war Aristoteles, nicht Platon.",
      "wissen": "Aristoteles (Schüler Platons) unterrichtete Alexander ca. 343–340 v. Chr."
    },
    {
      "concept": "ge:k5:al:t3",
      "statement": "Die Schlacht bei Gaugamela war die letzte große Feldschlacht gegen die Perser.",
      "correct": true,
      "explanation": "331 v. Chr. besiegte Alexander Dareios III. endgültig.",
      "wissen": "Nach Gaugamela floh Dareios, wurde später ermordet. Alexander übernahm das Perserreich."
    }
  ],
  "sorts": [
    {
      "concept": "ge:k5:al:s1",
      "question": "Ordne die Hauptstationen von Alexanders Zug (ältestes zuerst).",
      "labels": [
        "Übergang nach Kleinasien (334 v. Chr.)",
        "Schlacht bei Issos (333 v. Chr.)",
        "Eroberung Ägyptens, Gründung Alexandria (332 v. Chr.)",
        "Schlacht bei Gaugamela (331 v. Chr.)",
        "Vorstoß bis zum Indus (327–325 v. Chr.)"
      ],
      "explanation": "Kleinasien → Syrien/Phönizien → Ägypten → Mesopotamien/Persien → Indus.",
      "wissen": "Der Zug dauerte ca. 10 Jahre. Logistik, Belagerungen und Gründung hellenistischer Städte prägten den Weg."
    }
  ],
  "multis": [
    {
      "concept": "ge:k5:al:m1",
      "question": "Welche drei Reiche/Dynastien entstanden aus den Diadochenkämpfen?",
      "correct": [
        "Ptolemäer (Ägypten)",
        "Seleukiden (Syrien, Mesopotamien, Persien)",
        "Antigoniden (Makedonien, Griechenland)"
      ],
      "wrong": [
        "Römer, Karthager, Etrusker",
        "Hohenzollern, Habsburg, Bourbon",
        "Nur ein einziges Großreich blieb erhalten"
      ],
      "explanation": "Drei große hellenistische Reiche teilten Alexanders Erbe.",
      "wissen": "Kleinere Fürstentümer (Attaliden in Pergamon, Baktrien) kamen hinzu. Rom übernahm später alle."
    }
  ],
  "causeEffects": [
    {
      "concept": "ge:k5:al:c1",
      "cause": "Philipps Heereform (Phallanx, Sarissa)",
      "effect": "Makedonien wird militärische Großmacht",
      "wissen": "Philippos II. reformierte das Heer: Phallanx mit langer Sarissa, Berufssoldaten, Belagerungstechnik. Basis für Alexanders Siege."
    },
    {
      "concept": "ge:k5:al:c2",
      "cause": "Siege bei Issos und Gaugamela",
      "effect": "Ende des Achämenidenreichs, Alexander Herr über Persien",
      "wissen": "Zwei Entscheidungsschlachten (333, 331 v. Chr.) brachen persische Macht. Dareios floh, wurde ermordet. Alexander übernahm Reich."
    },
    {
      "concept": "ge:k5:al:c3",
      "cause": "Gründung griechischer Städte im Osten",
      "effect": "Verbreitung griechischer Sprache, Kultur, Polis-Struktur",
      "wissen": "Über 20 Stadtgründungen (viele 'Alexandria'). Gymnasion, Theater, Polis-Verfassung exportiert. Hellenismus beginnt."
    },
    {
      "concept": "ge:k5:al:c4",
      "cause": "Früher Tod ohne Erben (323 v. Chr.)",
      "effect": "Diadochenkämpfe, Zersplitterung in Teilreiche",
      "wissen": "Alexander starb mit 32, ohne legitimen Erben. Generäle (Diadochen) kämpften 40 Jahre um das Erbe. Drei Großreiche entstanden."
    }
  ],
  "sources": [
    {
      "concept": "ge:k5:al:src1",
      "question": "Was berichtet Arrian über Alexanders Tod?",
      "sourceText": "Alexander starb im Palast des Nebukadnezar in Babylon, nachdem er zehn Tage gefiebert hatte. Er war 32 Jahre alt.",
      "sourceLabel": "Arrian, Anabasis VII, 2. Jh. n. Chr.",
      "sourceKind": "antike Quelle",
      "attribution": "Arrian, gemeinfrei",
      "correct": "Alexander starb 323 v. Chr. in Babylon mit 32 Jahren an Fieber.",
      "wrong": [
        "Er wurde im Kampf getötet.",
        "Er starb friedlich im Alter von 80 Jahren in Makedonien.",
        "Er vergiftete sich selbst."
      ],
      "explanation": "Arrian nutzte zeitgenössische Hofberichte (Ptolemaios, Aristobulos). Die Todesursache bleibt unklar (Fieber, Gift, Krankheit).",
      "wissen": "Antike Biografien (Arrian, Plutarch, Curtius Rufus) basieren auf früheren, teils verlorenen Quellen. Vergleich ist nötig."
    }
  ]
}

const alexandria: BioBank = {
  "quelle": "Wikipedia: Alexandria",
  "url": "https://de.wikipedia.org/wiki/Alexandria",
  "conceptPrefix": "ge:k5:alexandria",
  "facts": [
    {
      "concept": "ge:k5:ax:g",
      "prompt": "Wer gründete Alexandria in Ägypten?",
      "answer": "Alexander der Große",
      "wrong": [
        "Karl der Große",
        "Napoleon",
        "Nur Augustus"
      ],
      "explanation": "Alexander gründete 331 v.",
      "wissen": "Alexander gründete 331 v. Chr. Alexandria. Die Stadt wurde hellenistisches Zentrum. Der Hafen förderte Handel.",
      "gap": "Alexandria gründete ___.",
      "gapAccepted": [
        "Alexander",
        "Alexander der Große"
      ]
    },
    {
      "concept": "ge:k5:ax:b",
      "prompt": "Wofür war die Bibliothek berühmt?",
      "answer": "Als bedeutende Wissenssammlung der Antike",
      "wrong": [
        "Als einzige Bäckerei Roms",
        "Als Fußballstadion",
        "Als Bergwerk"
      ],
      "explanation": "Die Bibliothek sammelte Schriften und Gelehrte.",
      "wissen": "Die Bibliothek sammelte Schriften und Gelehrte. Sie symbolisiert hellenistische Wissenskultur. Umfang und Ende sind teils legendär.",
      "gap": "Die Bibliothek war eine große ___.",
      "gapAccepted": [
        "Wissenssammlung",
        "Bibliothek"
      ]
    },
    {
      "concept": "ge:k5:ax:l",
      "prompt": "Welches Weltwunder stand in Alexandria?",
      "answer": "Der Leuchtturm (Pharos)",
      "wrong": [
        "Die Chinesische Mauer",
        "Der Eiffelturm",
        "Das Kolosseum"
      ],
      "explanation": "Der Pharos galt als Weltwunder.",
      "wissen": "Der Pharos galt als Weltwunder. Er leitete Schiffe. Technik und Prestige verbanden sich.",
      "gap": "Der ___ galt als Weltwunder.",
      "gapAccepted": [
        "Leuchtturm",
        "Pharos"
      ]
    },
    {
      "concept": "ge:k5:ax:k",
      "prompt": "Warum galt Alexandria als Begegnungsstätte?",
      "answer": "Griechen, Ägypter, Juden und andere trafen aufeinander",
      "wrong": [
        "Weil niemand dort lebte",
        "Weil es im Polargebiet lag",
        "Wegen Isolation"
      ],
      "explanation": "Als Hafenstadt mischten sich Kulturen und Religionen.",
      "wissen": "Als Hafenstadt mischten sich Kulturen und Religionen. Handel förderte Austausch. Alexandria ist hellenistisches Modell.",
      "gap": "In Alexandria trafen viele ___ aufeinander.",
      "gapAccepted": [
        "Kulturen",
        "Völker"
      ]
    },
    {
      "concept": "ge:k5:ax:p",
      "prompt": "Welche Dynastie herrschte über hellenistisches Ägypten?",
      "answer": "Die Ptolemäer",
      "wrong": [
        "Die Hohenzollern",
        "Die Ottonen",
        "Die Tudors"
      ],
      "explanation": "Die Ptolemäer regierten Ägypten.",
      "wissen": "Die Ptolemäer regierten Ägypten. Kleopatra VII. war die letzte bekannte Herrscherin. Danach wurde Ägypten römisch.",
      "gap": "Hellenistisches Ägypten regierten die ___.",
      "gapAccepted": [
        "Ptolemäer"
      ]
    }
  ],
  "pairs": [
    {
      "concept": "ge:k5:ax:p1",
      "term": "Pharos",
      "meaning": "Leuchtturm",
      "wissen": "Antikes Weltwunder am Hafen."
    },
    {
      "concept": "ge:k5:ax:p2",
      "term": "Bibliothek",
      "meaning": "Wissenszentrum",
      "wissen": "Symbol hellenistischer Gelehrsamkeit."
    },
    {
      "concept": "ge:k5:ax:p3",
      "term": "Ptolemäer",
      "meaning": "Herrscherdynastie",
      "wissen": "Griechischstämmige Könige in Ägypten."
    },
    {
      "concept": "ge:k5:ax:p4",
      "term": "Museion",
      "meaning": "Forschungsinstitut bei der Bibliothek",
      "wissen": "Gelehrte lebten und arbeiteten dort staatlich finanziert."
    },
    {
      "concept": "ge:k5:ax:p5",
      "term": "Kleopatra VII.",
      "meaning": "Letzte Ptolemäerin, verbündet mit Caesar/Antonius",
      "wissen": "Nach ihrem Tod 30 v. Chr. wurde Ägypten römische Provinz."
    },
    {
      "concept": "ge:k5:ax:p6",
      "term": "Hafen (Großer Hafen / Eunostos)",
      "meaning": "Verbindung Mittelmeer – Nil – Rotes Meer",
      "wissen": "Getreideexporte ernährten später Rom. Handel mit Indien, Arabien."
    }
  ],
  "trueFalse": [
    {
      "concept": "ge:k5:ax:t1",
      "statement": "Alexandria war ein hellenistisches Handels- und Wissenszentrum.",
      "correct": true,
      "explanation": "Hafen, Bibliothek und Vielfalt prägten die Stadt.",
      "wissen": "Hafen, Bibliothek und Vielfalt prägten die Stadt. Sie verband Ägypten mit dem Mittelmeer."
    },
    {
      "concept": "ge:k5:ax:t2",
      "statement": "Die Bibliothek von Alexandria brannte einmal komplett ab und war für immer weg.",
      "correct": false,
      "explanation": "Mehrere Brände/Verluste über Jahrhunderte; Ende unklar (Caesar 48 v. Chr., Christen 391 n. Chr., Araber 642 n. Chr.).",
      "wissen": "Der Mythos vom einen großen Brand vereinfacht. Bestand und Verluste streuten über Jahrhunderte."
    },
    {
      "concept": "ge:k5:ax:t3",
      "statement": "Die Ptolemäer waren eine ägyptische Pharaonendynastie.",
      "correct": false,
      "explanation": "Sie waren makedonisch-griechischer Herkunft, regierten aber als Pharaonen.",
      "wissen": "Ptolemaios I. (General Alexanders) gründete die Dynastie. Sie übernahmen ägyptische Titel und Kulte."
    }
  ],
  "sorts": [
    {
      "concept": "ge:k5:ax:s1",
      "question": "Ordne Entwicklung Alexandria (ältestes zuerst).",
      "labels": [
        "Gründung durch Alexander (331 v. Chr.)",
        "Ausbau unter Ptolemäern: Bibliothek, Museion, Pharos",
        "Blüte als Handels- und Wissenschaftsmetropole",
        "Ende der Ptolemäer, Ägypten wird römisch (30 v. Chr.)"
      ],
      "explanation": "Gründung → hellenistischer Ausbau → Blüte → römische Übernahme.",
      "wissen": "Ptolemäer machten Alexandria zur Hauptstadt. Getreide, Papyrus, Wissenschaft prägten die Stadt."
    }
  ],
  "multis": [
    {
      "concept": "ge:k5:ax:m1",
      "question": "Welche drei Elemente machten Alexandria zur Begegnungsstätte?",
      "correct": [
        "Hafen mit internationalem Handel",
        "Bibliothek und Museion als Wissenszentrum",
        "Bevölkerung: Griechen, Ägypter, Juden, Syrer u. a."
      ],
      "wrong": [
        "Nur einheimische ägyptische Bevölkerung",
        "Isolation vom Mittelmeerhandel",
        "Keine religiöse Vielfalt"
      ],
      "explanation": "Hafen, Wissen, Vielfalt — das hellenistische Modell.",
      "wissen": "Kulturmischung war Alltag. Septuaginta (griechische Bibel) entstand hier. Handel brachte Ideen und Waren."
    }
  ],
  "causeEffects": [
    {
      "concept": "ge:k5:ax:c1",
      "cause": "Lage am Nil-Delta mit zwei Häfen",
      "effect": "Kontrolle des Getreidehandels und Seehandelsrouten",
      "wissen": "Zwei Häfen (Großer Hafen, Eunostos) verbanden Nil, Mittelmeer, Rotes Meer. Getreide, Papyrus, Gewürze flossen durch Alexandria."
    },
    {
      "concept": "ge:k5:ax:c2",
      "cause": "Ptolemäische Förderung von Bibliothek und Museion",
      "effect": "Zuzug von Gelehrten, Sammlung von Wissen, Forschung",
      "wissen": "Ptolemäer finanzierten Museion (Forschungsinstitut) und Bibliothek. Gelehrte erhielten Gehalt, Steuerfreiheit, Wohnraum. Zentrum antiker Wissenschaft."
    },
    {
      "concept": "ge:k5:ax:c3",
      "cause": "Bevölkerungsmischung (Griechen, Ägypter, Juden, Händler)",
      "effect": "Kultureller Austausch, neue Kulte (Serapis), Übersetzungen (Septuaginta)",
      "wissen": "Stadtviertel nach Herkunft. Serapis-Kult (griechisch-ägyptisch) als Staatskult. Septuaginta: Tora ins Griechische übersetzt für griechischsprachige Juden."
    },
    {
      "concept": "ge:k5:ax:c4",
      "cause": "Römische Annexion (30 v. Chr.)",
      "effect": "Ägypten wird Kornkammer Roms, Alexandria zweitgrößte Stadt des Reiches",
      "wissen": "Nach Actium (31 v. Chr.) und Tod Kleopatras VII. (30 v. Chr.) römische Provinz. Getreideversorgung Roms sicherte Alexandrias Bedeutung."
    }
  ],
  "sources": [
    {
      "concept": "ge:k5:ax:src1",
      "question": "Was beschreibt Strabon über den Hafen von Alexandria?",
      "sourceText": "Der Hafen ist so groß, dass er die größte Flotte aufnehmen kann; der Pharos leuchtet weit hinaus und weist den Schiffen den Weg.",
      "sourceLabel": "Strabon, Geographika XVII, 1. Jh. v. Chr.",
      "sourceKind": "antike Quelle",
      "attribution": "Strabon, gemeinfrei",
      "correct": "Der Hafen war riesig und der Leuchtturm (Pharos) ein berühmtes Weltwunder.",
      "wrong": [
        "Der Hafen war winzig und nur für Fischerboote.",
        "Es gab keinen Leuchtturm.",
        "Schiffe mussten außen vor Anker liegen."
      ],
      "explanation": "Strabon beschreibt die Infrastruktur, die Alexandria zum Handelszentrum machte.",
      "wissen": "Strabon bereiste die Region. Seine Geographie ist wichtige Quelle für hellenistische Stadtanlagen."
    }
  ]
}

const alexGeschichten: BioBank = {
  "quelle": "Wikipedia: Alexander der Große",
  "url": "https://de.wikipedia.org/wiki/Alexander_der_Gro%C3%9Fe",
  "conceptPrefix": "ge:k5:alex-geschichten",
  "facts": [
    {
      "concept": "ge:k5:ag:sage",
      "prompt": "Warum vermischen sich bei Alexander Geschichte und Legende?",
      "answer": "Autoren stilisierten Heldentaten",
      "wrong": [
        "Weil es keine Quellen gibt",
        "Weil er im 20. Jh. lebte",
        "Weil er anonym blieb"
      ],
      "explanation": "Berichte stammen von späteren Autoren und sind teils panegyrisch.",
      "wissen": "Berichte stammen von späteren Autoren und sind teils panegyrisch. Wundererzählungen wuchsen an. Quellenkritik trennt Plausibles von Ausschmückung.",
      "gap": "Berichte über Alexander sind oft ___.",
      "gapAccepted": [
        "stilisiert",
        "legendär"
      ]
    },
    {
      "concept": "ge:k5:ag:knot",
      "prompt": "Was meint die Sage vom gordischen Knoten?",
      "answer": "Alexander löst ein unlösbares Problem",
      "wrong": [
        "Er erfindet die Dampfmaschine",
        "Er baut die Berliner Mauer",
        "Er druckt die Gutenberg-Bibel"
      ],
      "explanation": "Der gordische Knoten stand für eine scheinbar unlösbare Aufgabe.",
      "wissen": "Der gordische Knoten stand für eine scheinbar unlösbare Aufgabe. Die Erzählung stilisiert Entschlossenheit. Der historische Kern ist unsicher.",
      "gap": "Der gordische Knoten steht für ein ___ Problem.",
      "gapAccepted": [
        "unlösbares",
        "schwieriges"
      ]
    },
    {
      "concept": "ge:k5:ag:siwa",
      "prompt": "Welche Episode stilisiert göttliche Legitimation?",
      "answer": "Besuch des Orakels von Siwa",
      "wrong": [
        "Krönung in Aachen 800",
        "Reformation 1517",
        "1848 in Frankfurt"
      ],
      "explanation": "In Siwa soll Alexander als Sohn Ammons bestätigt worden sein.",
      "wissen": "In Siwa soll Alexander als Sohn Ammons bestätigt worden sein. Das stützt Herrscherideologie. Ob es genau so geschah, ist unklar.",
      "gap": "In Siwa ging es um ___ Legitimation.",
      "gapAccepted": [
        "göttliche",
        "sakrale"
      ]
    },
    {
      "concept": "ge:k5:ag:krit",
      "prompt": "Was sollten Schüler bei Heldengeschichten prüfen?",
      "answer": "Ob sie Macht verherrlichen und Opfer ausblenden",
      "wrong": [
        "Ob sie nur aus Emojis bestehen",
        "Ob sie immer falsch datiert sind",
        "Ob sie nur Mathematik sind"
      ],
      "explanation": "Heldenerzählungen selektieren Ruhm.",
      "wissen": "Heldenerzählungen selektieren Ruhm. Multiperspektivität fragt nach Unterworfenen. Geschichte ist mehr als Siegererzählung.",
      "gap": "Heldengeschichten blenden oft ___ aus.",
      "gapAccepted": [
        "Opfer",
        "Gewalt"
      ]
    },
    {
      "concept": "ge:k5:ag:qu",
      "prompt": "Warum gibt es keine Autobiografie Alexanders?",
      "answer": "Erhaltene Berichte stammen von späteren Autoren",
      "wrong": [
        "Weil er im Internet schrieb",
        "Weil er nie existierte",
        "Weil Rom 2020 alles vernichtete"
      ],
      "explanation": "Zeitgenössische Hofberichte sind verloren.",
      "wissen": "Zeitgenössische Hofberichte sind verloren. Spätere Historiker erhöhen Unsicherheit. Vergleich mehrerer Traditionen ist nötig.",
      "gap": "Berichte über Alexander sind meist ___.",
      "gapAccepted": [
        "später",
        "nicht autobiografisch"
      ]
    }
  ],
  "pairs": [
    {
      "concept": "ge:k5:ag:p1",
      "term": "Gordischer Knoten",
      "meaning": "Unlösbares Problem",
      "wissen": "Sage stilisiert Entschlossenheit."
    },
    {
      "concept": "ge:k5:ag:p2",
      "term": "Orakel von Siwa",
      "meaning": "Göttliche Bestätigung",
      "wissen": "Legitimation als Gottessohn in der Erzählung."
    },
    {
      "concept": "ge:k5:ag:p3",
      "term": "Heldenvita",
      "meaning": "Ruhm-Erzählung",
      "wissen": "Selektiv und oft panegyrisch."
    },
    {
      "concept": "ge:k5:ag:p4",
      "term": "Bukephalos",
      "meaning": "Pferd Alexanders, nur er konnte es reiten",
      "wissen": "Symbol für Beherrschung des Wilden. Stadt Bukephala benannt danach."
    },
    {
      "concept": "ge:k5:ag:p5",
      "term": "Hephaistion",
      "meaning": "Gefährte und möglicher Geliebter Alexanders",
      "wissen": "Sein Tod 324 v. Chr. traf Alexander schwer. Staatstrauer angeordnet."
    },
    {
      "concept": "ge:k5:ag:p6",
      "term": "Roxane",
      "meaning": "Baktrische Prinzessin, Alexanders Frau",
      "wissen": "Heirat 327 v. Chr. als Politik. Sohn Alexander IV. nachgeboren, später ermordet."
    }
  ],
  "trueFalse": [
    {
      "concept": "ge:k5:ag:t1",
      "statement": "Alle Geschichten über Alexander sind wörtliche Augenzeugenberichte.",
      "correct": false,
      "explanation": "Viele Berichte sind später und stilisiert.",
      "wissen": "Viele Berichte sind später und stilisiert. Legenden mischen sich mit Historischem. Quellenkritik ist Pflicht."
    },
    {
      "concept": "ge:k5:ag:t2",
      "statement": "Der gordische Knoten wurde von Alexander mit dem Schwert durchhauen.",
      "correct": true,
      "explanation": "Die Sage: er löst das Problem durch entschlossene Tat.",
      "wissen": "Varianten: durchhauen oder den Stift ziehen. Beide stilisieren Entschlossenheit. Historisch nicht belegbar."
    },
    {
      "concept": "ge:k5:ag:t3",
      "statement": "Alexander heiratete Roxane aus Liebe, nicht aus politischer Berechnung.",
      "correct": false,
      "explanation": "Die Heirat 327 v. Chr. band baktrische Eliten an das Reich.",
      "wissen": "Herrscherheiraten waren Politik. Roxane war Tochter des Oxyartes. Alexander IV. starb als Kind in Gefangenschaft."
    }
  ],
  "sorts": [
    {
      "concept": "ge:k5:ag:s1",
      "question": "Ordne die Überlieferungsschichten (ältestes zuerst).",
      "labels": [
        "Zeitgenössische Hofberichte (Ptolemaios, Aristobulos) — verloren",
        "Alexanderroman (Pseudo-Kallisthenes, 3. Jh. n. Chr.) — legendenhaft",
        "Arrian / Plutarch (2. Jh. n. Chr.) — nutzen frühe Quellen kritisch",
        "Mittelalterliche Bearbeitungen (z. B. Alexanderlied) — christlich überformt"
      ],
      "explanation": "Nah an der Zeit → spätere Sammler → antike Historiker → mittelalterliche Dichtung.",
      "wissen": "Keine Autobiografie erhalten. Arrian gilt als beste Quelle, da er Ptolemaios/Aristobulos folgte. Legenden wuchsen stetig."
    }
  ],
  "multis": [
    {
      "concept": "ge:k5:ag:m1",
      "question": "Welche drei Legenden ranken sich um Alexander?",
      "correct": [
        "Gordischer Knoten (durchhauen / lösen)",
        "Orakel von Siwa (Sohn des Ammon/Zeus)",
        "Bukephalos (unzähmbares Pferd, nur Alexander reitet es)"
      ],
      "wrong": [
        "Er erfand den Buchdruck.",
        "Er baute die Chinesische Mauer.",
        "Er flog mit einem Drachen zum Mond."
      ],
      "explanation": "Knoten, Siwa, Bukephalos — klassische Alexanderlegenden.",
      "wissen": "Diese Episoden dienen Herrscherideologie: Entschlossenheit, göttliche Abstammung, Beherrschung der Natur."
    }
  ],
  "causeEffects": [
    {
      "concept": "ge:k5:ag:c1",
      "cause": "Fehlende zeitgenössische Autobiografie",
      "effect": "Abhängigkeit von späteren, teils legendenhaften Berichten",
      "wissen": "Keine Selbstzeugnisse Alexanders erhalten. Hofberichte (Ptolemaios, Aristobulos) sind verloren. Spätere Autoren (Arrian, Plutarch, Curtius) nutzen diese zweitrangig."
    },
    {
      "concept": "ge:k5:ag:c2",
      "cause": "Herrscherideologie (göttliche Abstammung, Unbesiegbarkeit)",
      "effect": "Legendenbildung: Siwa, Knoten, Bukephalos, Unverwundbarkeit",
      "wissen": "Alexander nutzte Mythos politisch. Siwa-Besuch stilisierte göttliche Abstammung. Knoten und Bukephalos zeigen 'Herrscher über Natur/Götter'."
    },
    {
      "concept": "ge:k5:ag:c3",
      "cause": "Alexanderroman (Pseudo-Kallisthenes) verbreitete sich in vielen Sprachen",
      "effect": "Alexander wird zum weltliterarischen Helden (bis ins Mittelalter, Orient, Europa)",
      "wissen": "Alexanderroman (3. Jh. n. Chr.) übersetzt in Syrisch, Arabisch, Persisch, Armenisch, Georgisch, Latein, Altfranzösisch, Mittelhochdeutsch. Vorbild für Ritterideale."
    },
    {
      "concept": "ge:k5:ag:c4",
      "cause": "Quellenkritik (Arrian vs. Curtius Rufus vs. Plutarch)",
      "effect": "Unterscheidung: historischer Kern vs. literarische Ausschmückung",
      "wissen": "Arrian (2. Jh.) folgt Ptolemaios/Aristobulos — nüchtern, militärisch. Plutarch — Charakter, Moral, Anekdoten. Curtius Rufus (1. Jh. n. Chr.) — dramatisch, rhetorisch. Vergleich nötig."
    }
  ],
  "sources": [
    {
      "concept": "ge:k5:ag:src1",
      "question": "Was schreibt Plutarch über Alexanders Tod?",
      "sourceText": "Manche sagen, er sei an einer Krankheit gestorben; andere, er sei vergiftet worden. Die Ärzte aber gaben keine klare Auskunft.",
      "sourceLabel": "Plutarch, Alexander 75, 2. Jh. n. Chr.",
      "sourceKind": "antike Quelle",
      "attribution": "Plutarch, gemeinfrei",
      "correct": "Plutarch nennt Krankheit und Gift als mögliche Todesursachen — sicher ist keins.",
      "wrong": [
        "Er wurde im Kampf erschlagen.",
        "Er starb an Altersschwäche in Makedonien.",
        "Er vergiftete sich selbst absichtlich."
      ],
      "explanation": "Plutarch wägt Varianten ab. Die Todesursache (Fieber, Malaria, Typhus, Gift) ist bis heute ungeklärt.",
      "wissen": "Plutarch nutzte frühere Quellen (Aristobulos, Ptolemaios). Sein Fokus liegt auf Charakter und Moral, nicht nur Fakten."
    }
  ]
}

export const GESCHICHTE_K5_GENERATORS: Record<string, Topic['generate']> = {
  'ge-k5-lb1-orientierung': bankGenerate(orientierung),
  'ge-k5-lb2-steinzeit-hochkultur': bankGenerate(steinzeit),
  'ge-k5-lb3-griechenland': bankGenerate(griechenland),
  'ge-k5-lb4-mensch-natur': bankGenerate(menschNatur),
  'ge-k5-lbw-hellenismus-alexander': bankGenerate(alexander),
  'ge-k5-lbw-hellenismus-alexandria': bankGenerate(alexandria),
  'ge-k5-lbw-hellenismus-geschichten': bankGenerate(alexGeschichten),
}
