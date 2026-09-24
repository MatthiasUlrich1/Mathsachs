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
    }
  ],
  "trueFalse": [
    {
      "concept": "ge:k5:mn:t1",
      "statement": "Menschliche Eingriffe in die Natur haben historisch oft Folgen für Wirtschaft und Macht.",
      "correct": true,
      "explanation": "Umwelt und Gesellschaft bedingen sich.",
      "wissen": "Umwelt und Gesellschaft bedingen sich. Ressourcen und Klima sind historische Faktoren. Längsschnitte zeigen Wandel."
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
    }
  ],
  "trueFalse": [
    {
      "concept": "ge:k5:al:t1",
      "statement": "Alexanders Reich blieb nach seinem Tod dauerhaft als Einheit bestehen.",
      "correct": false,
      "explanation": "Diadochenkämpfe zersplitterten das Reich.",
      "wissen": "Diadochenkämpfe zersplitterten das Reich. Teilreiche entstanden. Die Einheit war kurzlebig."
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
    }
  ],
  "trueFalse": [
    {
      "concept": "ge:k5:ax:t1",
      "statement": "Alexandria war ein hellenistisches Handels- und Wissenszentrum.",
      "correct": true,
      "explanation": "Hafen, Bibliothek und Vielfalt prägten die Stadt.",
      "wissen": "Hafen, Bibliothek und Vielfalt prägten die Stadt. Sie verband Ägypten mit dem Mittelmeer."
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
    }
  ],
  "trueFalse": [
    {
      "concept": "ge:k5:ag:t1",
      "statement": "Alle Geschichten über Alexander sind wörtliche Augenzeugenberichte.",
      "correct": false,
      "explanation": "Viele Berichte sind später und stilisiert.",
      "wissen": "Viele Berichte sind später und stilisiert. Legenden mischen sich mit Historischem. Quellenkritik ist Pflicht."
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
