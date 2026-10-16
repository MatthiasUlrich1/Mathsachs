# -*- coding: utf-8 -*-
"""
Pass 6m — residual finish after e815dd5 / pass6l.

Goals:
- Strip ALL formulaic Merkmal / Nachbarbegriff / length-pad tails
- Rebuild weak answers from curated + same-bank pair meanings (not corrupted wissen)
- Topic-local distractors from sibling pairs (not global stock bio/phy/ge)
- Hand-authored cores for known wrong-topic / scrambled items
- Expand residual thin meanings (except keep formulas showable as formulas)
- Never touch released curated packs

Run: py -3 tmp/rewrite_glossary_mc_quality_pass6m.py
"""
from __future__ import annotations

import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import rewrite_glossary_mc_quality_pass6 as p6
import rewrite_glossary_mc_quality_pass6f as p6f
import rewrite_glossary_mc_quality_pass6i as p6i

p6.CURATED.update(p6f.EXTRA_CURATED)
p6.CURATED.update(p6i.EXTRA_I)

# ---------------------------------------------------------------------------
# Hand-authored meanings / answers (term → meaning without trailing period)
# ---------------------------------------------------------------------------
HAND: dict[str, str] = {
    # Physics thin leftovers / formulas expanded to showable clauses
    "lupe": "Vergrößert nahe Gegenstände, indem sie als Sammellinse das Sehwinkelbild vergrößert",
    "celsius": "Setzt den Gefrierpunkt von Wasser auf 0 °C und den Siedepunkt auf 100 °C",
    "wärmestrahlung": "Transportiert Wärme als elektromagnetische Strahlung ohne Stofftransport",
    "generator": "Erzeugt elektrische Energie aus mechanischer Bewegung durch Induktion",
    "transformator": "Wandelt Spannungen um und verringert Übertragungsverluste bei Hochspannung",
    "winkel ϕ": "Gibt den magnetischen Fluss über Φ = B · A · cos ϕ in Abhängigkeit vom Winkel an",
    "winkel φ": "Gibt den magnetischen Fluss über Φ = B · A · cos φ in Abhängigkeit vom Winkel an",
    "federkraft": "Gibt die Federkraft nach Hooke mit der Beziehung F = D · s an",
    "bauelement": "Ist ein elektronisches Bauteil wie Widerstand, Kondensator oder Diode im Stromkreis",
    # Biology thin leftovers
    "fragmentierung": "Zerschneidet Lebensräume durch Straßen und Bauwerke und trennt Populationen",
    "energieumwandlung": "Wandelt Licht in chemische Energie und chemische Energie weiter in ATP um",
    "psychische abhängigkeit": "Bindet an den Stoff auch ohne starke körperliche Entzugserscheinungen",
    "soziale folge": "Betrifft Familie, Schule und Arbeit über den körperlichen Schaden hinaus",
    "bildschirmzeit": "Stört bei Übermaß Schlaf, Konzentration und Erholung im Alltag",
    "sprungschicht": "Trennt warmes Oberflächenwasser von kaltem Tiefenwasser in Seen ab",
    "seitenlinie": "Erfasst Druckwellen und Bewegungen im Wasser entlang der Körperseite",
    "kiemenrückbildung": "Ist Teil der Metamorphose vom kiemenatmenden Larvenstadium zum landlebenden Adult",
    "redoxreaktion": "Überträgt Elektronen zwischen Stoffen und treibt Stoffwechselreaktionen an",
    "transkription": "Schreibt die DNA-Information in mRNA um, bevor Proteine gebaut werden",
    # C3/C4 bank (scrambled cores — hand-authored from textbook facts)
    "c3": "Fixiert CO2 direkt mit Rubisco im Calvin-Zyklus und bildet zuerst eine C3-Verbindung",
    "c4": "Trennt die CO2-Fixierung räumlich und senkt Photorespiration bei Hitze und Licht",
    "cam": "Trennt die CO2-Aufnahme zeitlich: nachts Fixierung, tagsüber Calvin-Zyklus",
    "rubisco": "Katalysiert die CO2-Fixierung im Calvin-Zyklus und kann auch mit O2 reagieren",
    "photorespiration": "Ist der Verlustweg, wenn Rubisco O2 statt CO2 bindet und Energie verbraucht",
    "pep-carboxylase": "Fixiert CO2 zuerst im Mesophyll von C4-Pflanzen zu einer C4-Säure",
    "bündelscheide": "Beherbergt bei C4 den Calvin-Zyklus und hält die CO2-Konzentration hoch",
    "bundelscheide": "Beherbergt bei C4 den Calvin-Zyklus und hält die CO2-Konzentration hoch",
    "lhc": "Fängt Lichtquanten als Lichtsammelkomplex und leitet die Energie an Reaktionszentren",
    "atp-kosten": "Sind der zusätzliche ATP-Aufwand der C4-CO2-Pumpe, typisch etwa zwei ATP pro CO2",
    "angepasstheit": "Ist die Strategie, mit der Pflanzen C3, C4 oder CAM an Klima und Standort anpassen",
    # Common bio stubs that got Merkmal-padded
    "artenschutz": "Umfasst Maßnahmen zum Erhalt bedrohter Arten und ihrer Lebensräume",
    "lebensraumverlust": "Bedeutet das Verschwinden geeigneter Habitate für viele Arten",
    "habitatpflege": "Pflegt und erhält geeignete Lebensräume als Teil wirksamen Artenschutzes",
    "naturnaher garten": "Schafft Wildnisstrukturen als Ersatzlebensraum für Tiere im Siedlungsraum",
    "steinhaufen": "Bietet Eidechsen Mikrohabitate als Versteck und Wärmespeicher aus Lesesteinen",
    "ringelnatter": "Ist eine heimische Schlange feuchter Lebensräume an Gewässern",
    "brutruhe": "Sichert ungestörte Phasen an Nist- und Lebensräumen während der Fortpflanzung",
    "filterschnabel": "Seiht Nahrungspartikel aus dem Wasser, wie bei vielen Enten",
    "insektenschnabel": "Ist spitz und ermöglicht präzises Picken von Insekten",
    "spechtschnabel": "Ist meißelförmig und öffnet Gänge zu Insektenlarven im Holz",
    "hornscheide": "Bildet die leichte äußere Schnabelhaut und ersetzt funktionell Zähne",
    "nahrungsnische": "Ist die typische Ressource, die eine Art mit ihrer Schnabelform erschließt",
    "greifvogel": "Jagt oft Wirbeltiere und nutzt Hakenschnabel sowie Krallen zusammen",
    "balz": "Ist das Werbeverhalten vor der Paarung zur Partnerwahl",
    "revier": "Ist der verteidigte Lebensraum einer Art gegen Rivalen",
    "vogelzug": "Ist der saisonale Ortswechsel zwischen Brut- und Überwinterungsgebiet",
    "nesthocker": "Bleibt als Jungvogel lange nestabhängig und wird gefüttert",
    "nestflüchter": "Ist als Jungvogel früh mobil und verlässt das Nest rasch",
    "abiotisch": "Beschreibt unbelebte Umweltfaktoren wie Licht, Temperatur, Wasser und CO2",
    "abiotische faktoren": "Sind unbelebte Umweltfaktoren wie Licht, Temperatur, Wasser und CO2",
    "sandsturm": "Ist ein abiotischer Faktor, der Erosion auslöst und Lebensräume stark verändert",
    "strömung": "Ist ein abiotischer Faktor in Fließgewässern und fördert den Sauerstoffeintrag",
    "glykolyse": "Spaltet Glucose zu Pyruvat und liefert ATP im Cytoplasma",
    "atp-synthase": "Nutzt den Protonenfluss an der Membran zur Bildung von ATP",
    "oxidative phosphorylierung": "Bildet ATP an der Membran über Chemiosmose und Atmungskette",
    "lichtreaktion": "Erzeugt ATP und NADPH an den Thylakoiden aus Lichtenergie",
    "gärung": "Liefert ATP ohne Sauerstoff und ist energetisch weniger ergiebig als Atmung",
    "substratkettenphosphorylierung": "Bildet ATP direkt am Substrat, etwa in der Glykolyse",
    "citratzyklus": "Läuft in der Mitochondrienmatrix ab und liefert Reduktionsäquivalente",
    "atmungskette": "Sitzt in der inneren Mitochondrienmembran und treibt die ATP-Bildung an",
    "biotop": "Ist der Lebensraum einer Lebensgemeinschaft mit seinen abiotischen Faktoren",
    "toleranzkurve": "Zeigt Optimum sowie Unter- und Obergrenze für einen Umweltfaktor",
    "hydrolase": "Spaltet Substrate unter Aufnahme von Wasser als Enzymklasse",
    "coenzym": "Ist ein Hilfsmolekül, das Gruppen oder Elektronen bei Enzymreaktionen überträgt",
    "kompetitiv": "Hemmt Enzyme am aktiven Zentrum durch Konkurrenz mit dem Substrat",
    "nichtkompetitiv": "Hemmt Enzyme an einer anderen Stelle und senkt oft die Maximalrate",
    "allosterie": "Reguliert Enzyme durch Bindung an einer vom Zentrum entfernten Stelle",
    "vmax": "Ist die Sättigungsrate eines Enzyms bei maximaler Substratkonzentration",
    "km": "Ist ein Maß für die Affinität eines Enzyms zu seinem Substrat",
    "denaturierung": "Zerstört die Proteinstruktur durch Hitze oder pH und macht Enzyme inaktiv",
    "biokatalyse": "Nutzt Enzyme technisch, um Reaktionen unter milden Bedingungen zu beschleunigen",
    "effektor": "Erzeugt eine Reaktion auf ein Signal, etwa Bewegung oder Sekretion",
    # Common Lehrplan-stub terms
    "transpiration": "Ist die Verdunstung von Wasser über die Spaltöffnungen der Blätter",
    "allosterisch": "Bedeutet Regulation eines Enzyms durch Bindung außerhalb des aktiven Zentrums",
    "optimum": "Ist der Bereich eines Faktors mit höchster Leistung des Organismus oder Enzyms",
    "stoppcodon": "Beendet die Translation, weil keine Aminosäure mehr angehängt wird",
    "genregulation": "Steuert, welche Gene wann und wie stark abgelesen werden",
    "differenzierung": "Spezialisiert Zellen auf bestimmte Aufgaben bei gleicher DNA",
    "präparat": "Ist ein für die Mikroskopie vorbereitetes Untersuchungsobjekt",
    "habitat": "Ist der konkrete Lebensraum, den eine Art besiedelt",
    "konkurrenz": "Ist der Wettbewerb um begrenzte Ressourcen zwischen Lebewesen",
    "prädation": "Ist das Erbeuten und Fressen anderer Tiere durch Räuber",
    "mutation": "Ist eine bleibende Veränderung der Erbinformation in der DNA",
    "vektor": "Überträgt Fremd-DNA in Zellen, etwa ein Plasmid oder Virus in der Gentechnik",
    "impfung": "Bereitet das Immunsystem mit Antigenen auf einen Erreger vor",
    "gedächtniszelle": "Ermöglicht bei erneutem Kontakt eine schnelle Immunantwort",
    "autoimmun": "Bedeutet, dass das Immunsystem körpereigenes Gewebe angreift",
    "depolarisation": "Ist die Umkehr des Membranpotentials beim Aktionspotenzial",
    "summation": "Addiert mehrere Reize oder Potentiale zu einer stärkeren Wirkung",
    "falsifizierbar": "Bedeutet, dass eine Aussage grundsätzlich widerlegbar sein muss",
    "meristem": "Ist teilungsfähiges Bildungsgewebe an Spross- und Wurzelspitzen",
    "operator": "Ist die DNA-Stelle, an die ein Repressor bindet und die Transkription steuert",
    "epigenetik": "Beschreibt vererbbare Genaktivierung ohne Änderung der DNA-Sequenz",
    "enhancer": "Verstärkt die Transkription eines Gens über regulatorische DNA-Abschnitte",
    "chromatin": "Ist der Komplex aus DNA und Proteinen, der Chromosomen im Zellkern bildet",
    "amylase": "Spaltet Stärke in kleinere Zuckerbausteine im Verdauungstrakt",
    "tragfähigkeit": "Ist die maximale Populationsgröße, die ein Lebensraum dauerhaft trägt",
    "r-stratege": "Erzeugt viele Nachkommen bei geringer individueller Investition",
    "nitrifikation": "Wandelt Ammonium über Bakterien zu Nitrit und weiter zu Nitrat um",
    "hakenschnabel": "Ist gebogen zum Zerreißen von Fleisch und Kennzeichen vieler Greifvögel",
    "nektarschnabel": "Ist lang und schlank und erschließt Blütennektar als Nahrungsquelle",
    "muskelmagen": "Zerkleinert Nahrung nach dem Schnabel oft mit aufgenommenen Steinchen",
    "gesang": "Dient der Revierkennzeichnung und der Partnerwahl bei vielen Vogelarten",
    "alarmruf": "Warnt Artgenossen bei Gefahr durch einen kurzen, lauten Ruf",
    "gefiederpflege": "Erhält Flugfähigkeit und Isolation durch Putzen des Gefieders",
    "schwarm": "Kann Schutzvorteile bieten, weil Feinde einzelne Tiere schwerer erbeuten",
    "imponieren": "Bedeutet Drohverhalten, das Konflikte oft ohne Kampf klärt",
    "brutpflege": "Umfasst Wärmen, Füttern und Schützen der Jungvögel am Nest",
    "nachahmung": "Bedeutet Lernen durch Beobachten und Nachmachen von Verhalten",
    "hecke": "Bietet Nahrung, Deckung und Nistplätze für viele Vogelarten",
    "feuchtgebiet": "Ist wichtig für Wat- und Wasservögel als Rast- und Brutraum",
    "fensteranprall": "Ist die Kollision von Vögeln an Glasflächen in Siedlungen",
    "winterfütterung": "Ergänzt das Nahrungsangebot, ersetzt aber keine geeigneten Habitate",
    "insektennahrung": "Bedeutet, dass Insektenrückgang viele Vogelarten besonders trifft",
    "beobachtung": "Ist die Grundmethode der Verhaltensbiologie ohne Eingriff in das Verhalten",
    "angeboren": "Bedeutet Verhalten, das ohne langes Lernen genetisch weitgehend festgelegt abläuft",
    "territorialität": "Bedeutet das Verteidigen eines Gebiets gegen Rivalen der eigenen Art",
    "fluchtverhalten": "Ist die Reaktion auf Gefahr durch Weglaufen oder Wegfliegen",
    "nahrungssuche": "Umfasst Suchen und Erlangen von Futter in der Umwelt",
    "komfortverhalten": "Umfasst Putzen, Ruhen und Strecken zur Körperpflege",
    "markieren": "Bedeutet Kommunikation von Besitz oder Status durch Duft, Kot oder Laute",
    "spielverhalten": "Sind Übungs- und Sozialspiele junger Tiere ohne unmittelbaren Nutzen",
    "aktivitätszeit": "Ist an Beute und Feinde angepasst, etwa tag- oder nachtaktiv",
    "prägung": "Ist schnelles Lernen in sensiblen Phasen, oft unumkehrbar",
    "dehnung": "Ergänzt Muskelkraft für Haltung und Bewegung im Stützapparat",
}

# Concept-level overrides when term alone is ambiguous
HAND_CONCEPT: dict[str, dict[str, object]] = {
    "bio:lk11:c3c4:1": {
        "prompt": "Woran erkennt man C3-Pflanzen im Vergleich zu C4 und CAM?",
        "answer": "Sie fixieren CO2 direkt mit Rubisco im Calvin-Zyklus und bilden zuerst eine C3-Verbindung.",
        "wrong": [
            "Sie trennen die CO2-Fixierung räumlich und senken Photorespiration bei Hitze.",
            "Sie nehmen CO2 vor allem nachts auf und lagern Säuren bis zum Tag.",
            "Sie brauchen typischerweise zwei Extra-ATP pro CO2 für eine CO2-Pumpe.",
        ],
        "meaning": HAND["c3"],
        "wissen": "C3: direkte Rubisco-Fixierung im Calvin-Zyklus; oft höhere Photorespiration bei Hitze.",
    },
    "bio:lk11:c3c4:2": {
        "prompt": "Was kennzeichnet C4-Pflanzen?",
        "answer": "Sie trennen die CO2-Fixierung räumlich und senken Photorespiration bei Hitze und Licht.",
        "wrong": [
            "Sie fixieren CO2 nur direkt mit Rubisco ohne räumliche Trennung.",
            "Sie nehmen CO2 vor allem nachts auf und lagern Säuren bis zum Tag.",
            "Sie verzichten vollständig auf Rubisco und betreiben gar keinen Calvin-Zyklus.",
        ],
        "meaning": HAND["c4"],
        "wissen": "C4: Mesophyll-Fixierung plus Calvin in der Bündelscheide; weniger Photorespiration.",
    },
    "bio:lk11:c3c4:3": {
        "prompt": "Was kennzeichnet CAM-Pflanzen?",
        "answer": "Sie trennen die CO2-Aufnahme zeitlich: nachts Fixierung, tagsüber Calvin-Zyklus.",
        "wrong": [
            "Sie trennen die Fixierung räumlich in Mesophyll und Bündelscheide.",
            "Sie fixieren CO2 nur tagsüber direkt mit Rubisco ohne Säure-Speicher.",
            "Sie bilden ATP ausschließlich ohne Lichtreaktion und ohne Calvin-Zyklus.",
        ],
        "meaning": HAND["cam"],
        "wissen": "CAM: zeitliche Trennung; typisch für viele Sukkulenten an trockenen Standorten.",
    },
    "bio:lk11:c3c4:4": {
        "prompt": "Welche Rolle hat Rubisco bei C3- und C4-Pflanzen?",
        "answer": "Es katalysiert die CO2-Fixierung im Calvin-Zyklus und kann auch mit O2 reagieren.",
        "wrong": [
            "Es fixiert CO2 zuerst im Mesophyll von C4-Pflanzen zu einer C4-Säure.",
            "Es fängt Lichtquanten als Lichtsammelkomplex und leitet Energie weiter.",
            "Es regeneriert PEP aus Pyruvat und verbraucht dabei zusätzliches ATP.",
        ],
        "meaning": HAND["rubisco"],
        "wissen": "Rubisco: CO2-Fixierung im Calvin-Zyklus; Nebenreaktion mit O2 führt zur Photorespiration.",
    },
    "bio:lk11:c3c4:5": {
        "prompt": "Was beschreibt Photorespiration?",
        "answer": "Sie ist der Verlustweg, wenn Rubisco O2 statt CO2 bindet und Energie verbraucht.",
        "wrong": [
            "Sie ist die nächtliche CO2-Aufnahme typischer CAM-Pflanzen.",
            "Sie ist die räumliche Trennung der Fixierung in C4-Pflanzen.",
            "Sie ist der Lichtsammelkomplex, der Photonen an Reaktionszentren leitet.",
        ],
        "meaning": HAND["photorespiration"],
        "wissen": "Photorespiration: O2-Reaktion von Rubisco mit Energie- und Kohlenstoffverlust.",
    },
    "bio:lk11:c3c4:6": {
        "prompt": "Woran erkennt man PEP-Carboxylase?",
        "answer": "Sie fixiert CO2 zuerst im Mesophyll von C4-Pflanzen zu einer C4-Säure.",
        "wrong": [
            "Sie katalysiert die CO2-Fixierung im Calvin-Zyklus wie Rubisco.",
            "Sie bildet ATP aus dem Protonenfluss an der inneren Mitochondrienmembran.",
            "Sie spaltet Glucose zu Pyruvat und liefert ATP nur im Cytoplasma.",
        ],
        "meaning": HAND["pep-carboxylase"],
        "wissen": "PEP-Carboxylase: primäre CO2-Fixierung im C4-Mesophyll, hohe Affinität zu CO2.",
    },
    "bio:lk11:c3c4:7": {
        "prompt": "Welche Rolle hat die Bündelscheide bei C4?",
        "answer": "Sie beherbergt den Calvin-Zyklus und hält die CO2-Konzentration um Rubisco hoch.",
        "wrong": [
            "Sie speichert nachts organische Säuren wie bei CAM-Pflanzen.",
            "Sie ist der Ort der Glykolyse im Cytoplasma der Zelle.",
            "Sie fängt Lichtquanten als Antennenkomplex und ersetzt den Calvin-Zyklus.",
        ],
        "meaning": HAND["bündelscheide"],
        "wissen": "Bündelscheide: Ort des Calvin-Zyklus bei C4; hohe CO2-Konzentration mindert Photorespiration.",
    },
    "bio:lk11:c3c4:8": {
        "prompt": "Was kennzeichnet den LHC (Lichtsammelkomplex)?",
        "answer": "Er fängt Lichtquanten und leitet die Anregungsenergie an die Reaktionszentren.",
        "wrong": [
            "Er ist der zusätzliche ATP-Aufwand der C4-CO2-Pumpe pro fixiertem CO2.",
            "Er spaltet Glucose zu Pyruvat und liefert ATP im Cytoplasma.",
            "Er fixiert CO2 direkt mit Rubisco im Calvin-Zyklus.",
        ],
        "meaning": HAND["lhc"],
        "wissen": "LHC: Antennenpigmente fangen Photonen und leiten Energie an Reaktionszentren.",
    },
    "bio:lk11:c3c4:9": {
        "prompt": "Welche Rolle haben die ATP-Kosten bei C4?",
        "answer": "Sie bezeichnen den Extra-ATP-Aufwand der CO2-Pumpe, typisch etwa zwei ATP pro CO2.",
        "wrong": [
            "Sie sind unbelebte Umweltfaktoren wie Licht, Temperatur und Wasser.",
            "Sie bezeichnen die nächtliche Säurebildung typischer CAM-Pflanzen an trockenen Standorten.",
            "Sie bezeichnen den Ort der Glykolyse im Cytoplasma der Zelle.",
        ],
        "meaning": HAND["atp-kosten"],
        "wissen": "ATP-Kosten: C4 braucht Extra-ATP zur PEP-Regeneration (oft 2 ATP/CO2) zusätzlich zum Calvin-Zyklus.",
    },
    "bio:lk11:c3c4:10": {
        "prompt": "Was bedeutet Angepasstheit bei C3, C4 und CAM?",
        "answer": "Sie ist die Strategie, mit der Pflanzen ihren Stoffwechsel an Klima und Standort anpassen.",
        "wrong": [
            "Sie ist ausschließlich die Formel für die Federkraft nach Hooke.",
            "Sie ist der Lichtsammelkomplex der Photosysteme.",
            "Sie ist die Nettobewegung von Teilchen entlang eines Konzentrationsgefälles.",
        ],
        "meaning": HAND["angepasstheit"],
        "wissen": "Angepasstheit: C3/C4/CAM als Strategien an Temperatur, Wasser und Licht.",
    },
}

for _k, _v in HAND.items():
    p6.CURATED[_k] = _v

# Expand GOLD short distractors to ≥8 words with verb
p6.GOLD["ph:gap:ph-k6-lb1-lichtverschmutzung:fact:timer-sensor"] = {
    "prompt": "Wozu dienen Timer oder Sensoren bei intelligenter Beleuchtung gegen Lichtverschmutzung?",
    "answer": "Sie schalten Beleuchtung nur bei Bedarf ein und vermeiden Dauerleuchten.",
    "wrong": [
        "Sie legen verbindliche Beleuchtungsrichtlinien für Kommunen fest und ersetzen keine Abschirmung.",
        "Sie erzeugen absichtlich Blendung im Straßenverkehr und richten Licht in den Himmel.",
        "Sie ersetzen Abschirmung, indem sie Licht dauerhaft in den Himmel lenken.",
    ],
    "meaning": "Schaltet Beleuchtung nur bei Bedarf ein und vermeidet Dauerleuchten",
}
p6.GOLD["ge:fill:ge-k5-lb1-quellen:f0"] = {
    "prompt": "Was versteht man in der Geschichtswissenschaft unter einer Quelle?",
    "answer": "Sie gibt als Überrest oder Tradition Auskunft über die Vergangenheit.",
    "wrong": [
        "Sie ordnet Ereignisse in ihre zeitliche Reihenfolge ein.",
        "Sie fasst einen geschichtlichen Zeitraum mit typischen gemeinsamen Merkmalen zusammen.",
        "Sie beschreibt, wer politische Macht ausübt und Entscheidungen trifft.",
    ],
    "meaning": "Gibt als Überrest oder Tradition Auskunft über die Vergangenheit",
}

# ---------------------------------------------------------------------------
# Patterns
# ---------------------------------------------------------------------------
TAIL_RE = re.compile(
    r"(?:,?\s*)?(?:"
    r"ein biologisches Merkmal mit(?: klarer Funktion)?(?: im Organismus oder Ökosystem)?|"
    r"ein historisches Merkmal mit(?: Ursachen(?:, Verlauf und Folgen)?)?|"
    r"eine physikalische Größe oder Beziehung im fachlichen Modell|"
    r"als biologisches Merkmal mit klarer Funktion|"
    r"als historischen Zusammenhang mit Ursachen und Folgen|"
    r"als physikalisches Merkmal|"
    r"als physikalische Größe oder Beziehung im Modell|"
    r"und zeigt die Funktion im Organismus oder Ökosystem|"
    r"und ordnet es in Ursachen, Verlauf und Folgen ein|"
    r"und macht die Größe im Modell prüfbar|"
    r"die man von ähnlichen (?:Begriffen|Größen) klar unterscheiden kann|"
    r"den man von ähnlichen (?:Begriffen|Größen) klar unterscheiden kann|"
    r"das man von ähnlichen (?:Begriffen|Größen) klar unterscheiden kann|"
    r"im prüfbaren Zusammenhang von [^.]+|"
    r"sodass man .+? von Nachbarbegriffen unterscheiden kann|"
    r"und das [Gg]renzt [^.]+ von typischen Verwechslungen ab|"
    r"und lässt sich im Experiment oder an einem Beispiel prüfen|"
    r"und grenzt den Begriff von typischen Verwechslungen ab|"
    r"sodass man ihn von ähnlichen Größen unterscheiden kann|"
    r"und klärt, woran man den Sachverhalt sicher erkennt|"
    r"und prägt damit den Sachverhalt zu [^.]+|"
    r"in diesem physikalischen oder fachlichen Zusammenhang|"
    r"sodass [^.]+ im Fachzusammenhang klar erkennbar wird|"
    r"und gehört fachlich zu [^.]+|"
    r"als prüfbares Merkmal von [^.]+|"
    r"als abweichende Deutung im gleichen Fach|"
    r"prägt damit den Sachverhalt zu [^.]+"
    r")\.?\s*$",
    re.I,
)
TAIL_ANY = re.compile(
    r"Merkmal mit|Nachbarbegriffen|biologisches Merkmal|historisches Merkmal|"
    r"physikalische Größe oder Beziehung im|Funktion im Organismus oder Ökosystem|"
    r"Ursachen, Verlauf und Folgen|im prüfbaren Zusammenhang|"
    r"von ähnlichen Begriffen klar unterscheiden|Fachzusammenhang klar",
    re.I,
)
GEN_WRONG = re.compile(
    r"^(Ein Vorgang aus dem Nachbarthema|"
    r"Eine typische Verwechslung mit einem Nachbarbegriff|"
    r"Ein Randdetail, das fachlich nicht erklärt|"
    r"Ein anderer fachlicher Aspekt ohne klaren Bezug|"
    r"Ein anderer Vorgang ohne klaren Bezug|"
    r"Sie ist die typische Verwechslung|"
    r"Er ist die typische Verwechslung|"
    r"Es ist die typische Verwechslung)",
    re.I,
)
STOCK = re.compile(
    r"(Körpertemperatur aktiv konstant gehalten|"
    r"feinste Gefäß, in dem der Stoffaustausch|"
    r"Druck des Blutes auf die Gefäßwände|"
    r"entzieht dem Wasser Sauerstoff und dient der Atmung|"
    r"Nettobewegung von Teilchen entlang des Konzentrationsgefälles|"
    r"Protoplast bei Wasserverlust von der Zellwand|"
    r"Protoplast nach Wasseraufnahme wieder an die Zellwand|"
    r"fühlbare Druckwelle der Herzschläge|"
    r"sauerstoffreiches Blut vom Herzen zu den Organen|"
    r"Blut aus den Organen zurück zum Herzen)",
    re.I,
)
LEHRPLAN_META = re.compile(
    r"prüfbaren Lehrplaninhalt|im Unterrichtsthema hilft|steht im Lehrplan|"
    r"Zentraler Sachverhalt|Fachlich themenspezifisch einordnen",
    re.I,
)
FORMULAISH = re.compile(
    r"(=\s*|°C|Hooke|F\s*=|Φ\s*=|λ\s*=|U\s*=|E_el|½|cos\s*[ϕφ])",
    re.I,
)


def safe_write(path: Path, content: str) -> None:
    tmp = path.with_suffix(path.suffix + ".tmpwrite")
    tmp.write_text(content, encoding="utf-8", newline="\n")
    for _ in range(12):
        try:
            tmp.replace(path)
            return
        except OSError:
            time.sleep(0.25)
    path.write_text(content, encoding="utf-8", newline="\n")


def subject_of(path: Path) -> str:
    n = path.name.lower()
    if n.startswith("physik"):
        return "phy"
    if n.startswith("biologie"):
        return "bio"
    return "ge"


def strip_tail(s: str) -> str:
    o = s.strip()
    for _ in range(6):
        n = TAIL_RE.sub("", o)
        n = re.sub(r"\s{2,}", " ", n).strip().rstrip(",; ")
        if n == o:
            break
        o = n
    o = re.sub(r"\s+\.", ".", o)
    return o


def topic_key(concept: str) -> str:
    parts = concept.split(":")
    if len(parts) >= 3:
        # drop last token (fact id / pair id)
        return ":".join(parts[:-1])
    return concept


def curated_of(term: str) -> str | None:
    key = p6.display_term(term).lower().strip()
    bare = re.sub(r"\s*\([^)]*\)\s*$", "", key).strip()
    return p6.CURATED.get(key) or p6.CURATED.get(bare) or HAND.get(key) or HAND.get(bare)


def is_fullish(s: str) -> bool:
    s2 = strip_tail(s).strip().rstrip(".")
    if not s2 or GEN_WRONG.search(s2) or TAIL_ANY.search(s2):
        return False
    if LEHRPLAN_META.search(s2):
        return False
    words = s2.split()
    if FORMULAISH.search(s2) and len(words) >= 3:
        return True
    if len(words) < 8 or len(s2) < 40:
        return False
    if not p6.VERBISH.search(s2):
        return False
    return True


def is_thin_meaning(m: str) -> bool:
    m2 = strip_tail(m).strip().rstrip(".")
    if not m2 or GEN_WRONG.search(m2) or TAIL_ANY.search(m2):
        return True
    if FORMULAISH.search(m2) and len(m2.split()) >= 4 and p6.VERBISH.search(m2):
        return False
    words = m2.split()
    if len(words) <= 7 or (len(m2) < 45 and not p6.VERBISH.search(m2)):
        return True
    return False


def is_stock_or_generic(s: str) -> bool:
    return bool(GEN_WRONG.search(s.strip()) or STOCK.search(s) or TAIL_ANY.search(s))


def pronoun_of(answer: str, term: str) -> str:
    m = re.match(r"^(Sie|Er|Es)\b", answer.strip(), re.I)
    if m:
        return m.group(1)[0].upper() + m.group(1)[1:].lower()
    return p6.pronoun(term)


def meaning_to_option(pron: str, meaning: str) -> str:
    m = strip_tail(meaning).strip().rstrip(".")
    if not m:
        return ""
    if re.match(r"^(Sie|Er|Es)\b", m, re.I):
        out = p6.ensure_period(m)
    elif re.match(
        r"^(Ist|Sind|Beschreibt|Bedeutet|Dient|Gibt|Gilt|Verknüpft|Hemmt|Erzeugt|"
        r"Teilt|Führt|Pumpt|Steuert|Misst|Lässt|Bildet|Kennzeichnet|Umfasst|"
        r"Transportiert|Unterbricht|Speichert|Besagt|Verbindet|Verringert|"
        r"Schaltet|Fixiert|Spaltet|Nutzt|Schreibt|Überträgt|Setzt|Wandelt|"
        r"Beherbergt|Fängt|Katalysiert|Trennt|Zerschneidet|Bindet|Betrifft|"
        r"Stört|Erfasst|Pflegt|Schafft|Bietet|Seiht|Jagt|Bleibt|Reguliert|"
        r"Zerstört|Senkt|Läuft|Sitzt|Zeigt|Nimmt)\b",
        m,
        re.I,
    ):
        out = p6.ensure_period(f"{pron} {p6.lower_first(m)}")
    elif re.match(r"^(der|die|das|ein|eine|den)\b", m, re.I):
        out = p6.ensure_period(f"{pron} ist {p6.lower_first(m)}")
    else:
        out = p6.ensure_period(f"{pron} beschreibt {p6.lower_first(m)}")
    out = p6i.fix_umlauts(p6f.fix_articles(out))
    out = re.sub(r"\bdie Über\b", "die über", out)
    return out


def extract_term_from_prompt(prompt: str) -> str:
    tm = re.search(
        r"(?:Was kennzeichnet|Welche Rolle hat|Was beschreibt|Was bewirkt|"
        r"Woran erkennt man|Wozu dient(?: die| der| das)?|Welche Eigenschaft hat|"
        r"Wozu braucht man|Mit welchen Mitteln arbeitet|Was passiert bei|"
        r"Was bedeutet|Was versteht man unter|Wozu dienen)\s+(.+?)(?:\s+im Thema|\?|$)",
        prompt,
        re.I,
    )
    if tm and not re.fullmatch(r"\d+", tm.group(1).strip()):
        return p6.display_term(tm.group(1).strip())
    return "Begriff"


def rebuild_meaning(term: str, meaning: str, wissen: str) -> str:
    cur = curated_of(term)
    if cur:
        return p6.strip_period(p6i.fix_umlauts(cur))
    m = strip_tail(meaning)
    # Strip "Beschreibt X als …" shells left after tail strip
    m = re.sub(
        r"^Beschreibt\s+(.+?)\s+als\s+(?:biologisches|historisches|physikalisches).*$",
        r"\1",
        m,
        flags=re.I,
    ).strip()
    m = re.sub(r"^Beschreibt\s+", "", m, flags=re.I).strip()
    if not is_thin_meaning(m) and not TAIL_ANY.search(m):
        return p6.strip_period(p6i.fix_umlauts(m))
    lead = p6.wissen_lead(wissen, term)
    if lead and not LEHRPLAN_META.search(lead) and len(lead.split()) >= 5:
        # Avoid using clearly corrupted one-token leads
        if not re.fullmatch(r"[A-Za-zÄÖÜäöüß0-9\-]+", lead.strip()):
            body = p6i.strip_weak(lead)
            if body and not is_thin_meaning(body):
                return p6.strip_period(p6i.fix_umlauts(body))
    # Last resort: concrete clause from core fragment
    core = p6i.strip_weak(m or term).rstrip(".")
    t = p6.display_term(term)
    if not core or core.lower() == t.lower():
        core = f"einen zentralen beobachtbaren Vorgang zu {t}"
    return p6.strip_period(
        p6i.fix_umlauts(
            f"Beschreibt {p6.lower_first(core)} als zentralen fachlichen Kern von {t}"
        )
    )


def rebuild_answer(term: str, answer: str, wissen: str, pair_meaning: str | None) -> str:
    cur = curated_of(term)
    if cur:
        return meaning_to_option(pronoun_of(answer, term), cur)
    if pair_meaning and not is_thin_meaning(pair_meaning) and not TAIL_ANY.search(pair_meaning):
        return meaning_to_option(pronoun_of(answer, term), pair_meaning)
    a = strip_tail(answer)
    # Drop "Es beschreibt X" shells that remain short/weak
    if is_fullish(a) and not is_stock_or_generic(a) and "beschreibt begriff" not in a.lower():
        return p6.ensure_period(p6i.fix_umlauts(p6f.fix_articles(a)))
    # Prefer wissen only if it looks concrete and not meta
    lead = p6.wissen_lead(wissen, term)
    if lead and not LEHRPLAN_META.search(lead) and len(lead.split()) >= 6:
        opt = meaning_to_option(pronoun_of(answer, term), lead)
        if is_fullish(opt):
            return opt
    # Expand remaining core
    core = a
    core = re.sub(r"^(Sie|Er|Es)\s+beschreibt\s+", "", core, flags=re.I).strip().rstrip(".")
    core = re.sub(r"^(Sie|Er|Es)\s+ist\s+(die|der|das)\s+", "", core, flags=re.I).strip()
    if pair_meaning:
        core = strip_tail(pair_meaning) or core
    mean = rebuild_meaning(term, core, wissen)
    return meaning_to_option(pronoun_of(answer, term), mean)


def build_topic_pools(text: str) -> dict[str, list[tuple[str, str]]]:
    """topic -> [(term, meaning), ...] from pair blocks."""
    pools: dict[str, list[tuple[str, str]]] = {}
    for m in p6.PAIR_RE.finditer(text):
        concept = p6.unescape_ts(m.group("concept"))
        term = p6.unescape_ts(m.group("term"))
        meaning = strip_tail(p6.unescape_ts(m.group("meaning")))
        # Prefer curated
        cur = curated_of(term)
        if cur:
            meaning = cur
        elif is_thin_meaning(meaning) or TAIL_ANY.search(meaning):
            meaning = rebuild_meaning(term, meaning, p6.unescape_ts(m.group("wissen")))
        tk = topic_key(concept)
        pools.setdefault(tk, []).append((term, meaning))
    return pools


def build_wrongs(
    term: str,
    answer: str,
    existing: list[str],
    pool: list[tuple[str, str]],
    seed: str,
) -> list[str]:
    pron = pronoun_of(answer, term)
    ans_l = strip_tail(answer).lower().rstrip(".")
    seen = {ans_l}
    out: list[str] = []

    def add(opt: str) -> None:
        opt = strip_tail(opt)
        if not opt or is_stock_or_generic(opt):
            return
        if not is_fullish(opt):
            return
        key = opt.lower().rstrip(".")
        if key in seen or key[:36] == ans_l[:36]:
            return
        seen.add(key)
        out.append(p6.ensure_period(p6i.fix_umlauts(opt)))

    for w in existing:
        add(w)
        if len(out) >= 3:
            return out[:3]

    # Sibling meanings from same topic
    order = sorted(
        range(len(pool)),
        key=lambda i: p6.hash_pick(f"{seed}|{term}|sib|{i}", 100_000),
    )
    for i in order:
        if len(out) >= 3:
            break
        t2, mean2 = pool[i]
        if t2.lower() == term.lower():
            continue
        add(meaning_to_option(pron, mean2))

    # Subject fallbacks only as last resort — still full sentences, marked non-stock
    if len(out) < 3:
        fb = {
            "phy": [
                "hemmt den elektrischen Strom und wandelt Energie teilweise in Wärme um",
                "erzeugt Spannung durch zeitliche Änderung des magnetischen Flusses",
                "lässt Licht klar durch, sodass Gegenstände dahinter scharf erkennbar sind",
                "transportiert Wärme durch direkten Kontakt im Stoff ohne Strahlung",
                "gibt den Weg pro Zeit an und wird oft als v = s / t geschrieben",
                "bildet den geschlossenen Weg für elektrische Ladung im Stromkreis",
                "unterbricht den Stromkreis bei Überstrom und schützt Leitungen und Geräte",
                "speichert elektrische Energie gemäß der Beziehung E_el = ½ C U²",
            ],
            "bio": [
                "spaltet Glucose zu Pyruvat und liefert ATP im Cytoplasma der Zelle",
                "schreibt DNA-Information in mRNA beim Ablesen der Gene um",
                "fixiert CO2 direkt mit Rubisco im Calvin-Zyklus der Photosynthese",
                "nutzt den Protonenfluss zur Bildung von ATP an der Membran",
                "umfasst Maßnahmen zum Erhalt bedrohter Arten und ihrer Lebensräume",
                "zeigt Optimum sowie Unter- und Obergrenze für einen Umweltfaktor",
                "ist der Lebensraum einer Lebensgemeinschaft mit abiotischen Faktoren",
                "katalysiert Reaktionen unter milden Bedingungen als Biokatalysator",
            ],
            "ge": [
                "teilt staatliche Macht in Legislative, Exekutive und Judikative auf",
                "ist ein Überrest oder eine Tradition, die über die Vergangenheit Auskunft gibt",
                "bezeichnet den globalen Wirtschaftseinbruch ab 1929 mit Massenarbeitslosigkeit",
                "beschreibt die Wanderung von Menschen zwischen Regionen oder Ländern",
                "ist ein Umsturz der politischen Ordnung mit weitreichenden gesellschaftlichen Folgen",
                "kennzeichnet den Ost-West-Konflikt nach 1945 mit Blockbildung und Abschreckung",
                "gewährt Bürgerrechte und begrenzt staatliche Willkür durch die Verfassung",
                "ordnet Ereignisse auf einem Zeitstrahl in ihre zeitliche Reihenfolge ein",
            ],
        }
        # Infer subject from seed concept
        subj = "bio"
        if seed.startswith("ph") or ":ph-" in seed or seed.startswith("phy"):
            subj = "phy"
        if seed.startswith("ge") or ":ge-" in seed:
            subj = "ge"
        if seed.startswith("bio") or seed.startswith("bi:"):
            subj = "bio"
        fl = fb[subj]
        order2 = sorted(
            range(len(fl)),
            key=lambda i: p6.hash_pick(f"{seed}|{term}|fb|{i}", 100_000),
        )
        for i in order2:
            if len(out) >= 3:
                break
            add(f"{pron} {fl[i]}")

    while len(out) < 3:
        out.append(
            p6.ensure_period(
                f"{pron} beschreibt einen anderen prüfbaren Sachverhalt ohne Bezug zu {p6.display_term(term)}"
            )
        )
        # ensure uniqueness
        if out[-1].lower() in seen:
            out[-1] = p6.ensure_period(
                f"{pron} nennt eine fachlich benachbarte, aber hier falsche Deutung zu {p6.display_term(term)}"
            )
        seen.add(out[-1].lower())

    return out[:3]


def rewrite_stem(prompt: str) -> str:
    # Keep non-formulaic stems; only fix empty/Begriff placeholders lightly
    p = p6i.fix_umlauts(prompt.strip())
    if re.match(r"^(Was beschreibt|Was kennzeichnet|Welche Rolle hat)\s+Begriff\?", p, re.I):
        return "Welcher prüfbare Sachverhalt gehört zu diesem Fachbegriff?"
    if re.match(r"^(Was beschreibt|Was kennzeichnet|Welche Rolle hat)\s+x\d+\?", p, re.I):
        return "Welcher prüfbare Sachverhalt gehört zu diesem Fachbegriff?"
    return p


def transform(path: Path) -> tuple[int, int, int]:
    text = path.read_text(encoding="utf-8")
    pools = build_topic_pools(text)
    scanned = changed = pairs_changed = 0

    # Index pair meanings by topic+term for fact rebuild
    pair_by_topic_term: dict[tuple[str, str], str] = {}
    for tk, items in pools.items():
        for term, meaning in items:
            pair_by_topic_term[(tk, term.lower())] = meaning

    def repl_pair(m: re.Match) -> str:
        nonlocal pairs_changed
        concept = p6.unescape_ts(m.group("concept"))
        term = p6.unescape_ts(m.group("term"))
        meaning = p6.unescape_ts(m.group("meaning"))
        wissen = p6.unescape_ts(m.group("wissen"))
        q = m.group("cq")

        # Concept-level gold for pairs
        base = concept
        # map p:N ↔ N
        alt = re.sub(r":p:(\d+)$", r":\1", concept)
        alt2 = re.sub(r":p(\d+)$", r":\1", concept)
        hand = None
        for key in (concept, alt, alt2):
            if key in HAND_CONCEPT and "meaning" in HAND_CONCEPT[key]:
                hand = HAND_CONCEPT[key]
                break
        # Also map pair concept bio:lk11:c3c4:p:9 → fact :9
        fact_key = re.sub(r":p:(\d+)$", r":\1", concept)
        if fact_key in HAND_CONCEPT and "meaning" in HAND_CONCEPT[fact_key]:
            hand = HAND_CONCEPT[fact_key]

        if hand:
            new_m = str(hand["meaning"])
            if "wissen" in hand:
                wissen = str(hand["wissen"])
        else:
            new_m = rebuild_meaning(term, meaning, wissen)

        new_m = p6.strip_period(p6i.fix_umlauts(strip_tail(new_m)))
        new_w = p6i.fix_umlauts(wissen)
        new_term = p6i.fix_umlauts(term)
        if new_m != meaning or new_term != term or TAIL_ANY.search(meaning):
            pairs_changed += 1
        return (
            f"{{ concept: {q}{p6.escape(concept, q)}{q}, term: {q}{p6.escape(new_term, q)}{q}, "
            f"meaning: {q}{p6.escape(new_m, q)}{q}, wissen: {q}{p6.escape(new_w, q)}{q} }}"
        )

    text2 = p6.PAIR_RE.sub(repl_pair, text)
    # Refresh pools after pair rewrite
    pools = build_topic_pools(text2)
    pair_by_topic_term = {}
    for tk, items in pools.items():
        for term, meaning in items:
            pair_by_topic_term[(tk, term.lower())] = meaning

    FACT_OBJ = re.compile(
        r"(\{\s*\n"
        r"\s*concept:\s*(?P<cq>['\"])(?P<concept>(?:\\.|[^\\\"'])*?)(?P=cq)\s*,\s*\n"
        r"\s*prompt:\s*(?P<pq>['\"])(?P<prompt>(?:\\.|[^\\\"'])*?)(?P=pq)\s*,\s*\n"
        r"\s*answer:\s*(?P<aq>['\"])(?P<answer>(?:\\.|[^\\\"'])*?)(?P=aq)\s*,\s*\n"
        r"\s*wrong:\s*(?P<wrong>\[[\s\S]*?\])\s*,"
        r"(?P<tail>[\s\S]*?)"
        r"\n\s*\})",
    )

    def extract_field(tail: str, name: str) -> str:
        mm = re.search(rf"{name}:\s*(['\"])((?:\\.|[^\\\"'])*?)\1", tail)
        return p6.unescape_ts(mm.group(2)) if mm else ""

    def process(concept: str, prompt: str, answer: str, wrongs: list[str], wissen: str):
        if concept in p6.GOLD:
            g = p6.GOLD[concept]
            return str(g["prompt"]), str(g["answer"]), list(g["wrong"]), True
        if concept in HAND_CONCEPT:
            h = HAND_CONCEPT[concept]
            return (
                str(h["prompt"]),
                str(h["answer"]),
                list(h["wrong"]),  # type: ignore
                True,
            )

        new_p = rewrite_stem(prompt)
        term = extract_term_from_prompt(new_p if new_p != prompt else prompt)
        tk = topic_key(concept)
        pair_m = pair_by_topic_term.get((tk, term.lower()))
        # Also try stripping articles from term
        if not pair_m:
            bare = re.sub(r"^(der|die|das|ein|eine)\s+", "", term, flags=re.I).strip()
            pair_m = pair_by_topic_term.get((tk, bare.lower()))

        new_a = rebuild_answer(term, answer, wissen, pair_m)
        need_w = any(
            is_stock_or_generic(w) or not is_fullish(strip_tail(w)) or TAIL_ANY.search(w)
            for w in wrongs
        ) or is_stock_or_generic(answer) or TAIL_ANY.search(answer) or not is_fullish(answer)

        if need_w:
            new_w = build_wrongs(term, new_a, wrongs, pools.get(tk, []), seed=concept)
        else:
            new_w = [p6.ensure_period(p6i.fix_umlauts(strip_tail(w))) for w in wrongs]

        # Final answer polish
        new_a = p6.ensure_period(p6i.fix_umlauts(strip_tail(new_a)))
        dirty = (new_p, new_a, new_w) != (prompt, answer, wrongs) or TAIL_ANY.search(answer)
        return new_p, new_a, new_w, dirty

    def repl_fact(m: re.Match) -> str:
        nonlocal scanned, changed
        scanned += 1
        concept = p6.unescape_ts(m.group("concept"))
        prompt = p6.unescape_ts(m.group("prompt"))
        answer = p6.unescape_ts(m.group("answer"))
        wrongs = [p6.unescape_ts(w) for w in p6.parse_wrong(m.group("wrong"))]
        tail = m.group("tail")
        cq = m.group("cq")
        wissen = extract_field(tail, "wissen") or extract_field(tail, "explanation")
        if concept in HAND_CONCEPT and "wissen" in HAND_CONCEPT[concept]:
            wissen = str(HAND_CONCEPT[concept]["wissen"])
        new_p, new_a, new_w, dirty = process(concept, prompt, answer, wrongs, wissen)
        if dirty:
            changed += 1

        def fix_tail_field(mm: re.Match) -> str:
            key, q, body = mm.group(1), mm.group(2), mm.group(3)
            raw = p6.unescape_ts(body)
            if key == "wissen" and concept in HAND_CONCEPT and "wissen" in HAND_CONCEPT[concept]:
                raw = str(HAND_CONCEPT[concept]["wissen"])
            elif key in {"wissen", "explanation"}:
                raw = strip_tail(raw)
                raw = re.sub(r"\s*Fachlich themenspezifisch einordnen\.?\s*", " ", raw).strip()
            return f"{key}: {q}{p6.escape(p6i.fix_umlauts(raw), q)}{q}"

        new_tail = re.sub(
            r"\b(explanation|wissen|gap):\s*(['\"])((?:\\.|[^\\\"'])*?)\2",
            fix_tail_field,
            tail,
        )
        return (
            "{\n"
            f"      concept: {cq}{p6.escape(concept, cq)}{cq},\n"
            f"      prompt: {cq}{p6.escape(new_p, cq)}{cq},\n"
            f"      answer: {cq}{p6.escape(new_a, cq)}{cq},\n"
            f"      wrong: {p6.format_wrong(new_w, cq)},"
            f"{new_tail}\n"
            f"    }}"
        )

    text3 = FACT_OBJ.sub(repl_fact, text2)

    FACT_FLEX = re.compile(
        r"(\{\s*concept:\s*(?P<cq>['\"])(?P<concept>(?:\\.|[^\\\"'])*?)(?P=cq)\s*,\s*"
        r"prompt:\s*(?P<pq>['\"])(?P<prompt>(?:\\.|[^\\\"'])*?)(?P=pq)\s*,\s*"
        r"answer:\s*(?P<aq>['\"])(?P<answer>(?:\\.|[^\\\"'])*?)(?P=aq)\s*,\s*"
        r"wrong:\s*(?P<wrong>\[[^\]]*\]))",
    )

    def repl_flex(m: re.Match) -> str:
        nonlocal scanned, changed
        blob = m.group(0)
        if "\n" in blob and re.search(r"concept:.*\n\s*prompt:", blob):
            return blob
        scanned += 1
        cq = m.group("cq")
        concept = p6.unescape_ts(m.group("concept"))
        prompt = p6.unescape_ts(m.group("prompt"))
        answer = p6.unescape_ts(m.group("answer"))
        wrongs = [p6.unescape_ts(w) for w in p6.parse_wrong(m.group("wrong"))]
        new_p, new_a, new_w, dirty = process(concept, prompt, answer, wrongs, "")
        if dirty:
            changed += 1
        wfmt = "[" + ", ".join(f"{cq}{p6.escape(w, cq)}{cq}" for w in new_w) + "]"
        return (
            f"{{ concept: {cq}{p6.escape(concept, cq)}{cq}, "
            f"prompt: {cq}{p6.escape(new_p, cq)}{cq}, "
            f"answer: {cq}{p6.escape(new_a, cq)}{cq}, "
            f"wrong: {wfmt}"
        )

    text3 = FACT_FLEX.sub(repl_flex, text3)

    # Global sweep: strip any remaining tails in answer/meaning/wrong
    def polish_field(mm: re.Match) -> str:
        key, q, body = mm.group(1), mm.group(2), mm.group(3)
        raw = p6.unescape_ts(body)
        fixed = p6i.fix_umlauts(raw)
        if key in {"answer", "meaning"}:
            fixed = strip_tail(fixed)
            if key == "answer" and fixed and not fixed.endswith((".", "?", "!")):
                fixed += "."
            if key == "meaning":
                fixed = fixed.rstrip(".")
        fixed = fixed.replace("???", "")
        return f"{key}: {q}{p6.escape(fixed, q)}{q}"

    text3 = re.sub(
        r"\b(prompt|answer|meaning|wissen|explanation|term|gap):\s*(['\"])((?:\\.|[^\\\"'])*?)\2",
        polish_field,
        text3,
    )

    def polish_wrong(mm: re.Match) -> str:
        inner = mm.group(1)
        parts = []
        for sm in re.finditer(r"(['\"])((?:\\.|[^\\\"'])*?)\1", inner):
            q, body = sm.group(1), sm.group(2)
            fixed = strip_tail(p6i.fix_umlauts(p6.unescape_ts(body)))
            if fixed and not fixed.endswith((".", "?", "!")):
                fixed += "."
            parts.append(f"{q}{p6.escape(fixed, q)}{q}")
        return "wrong: [" + ", ".join(parts) + "]"

    text3 = re.sub(r"wrong:\s*\[((?:[^\[\]]|\n)*?)\]", polish_wrong, text3)
    text3 = text3.replace("???", "")
    text3 = text3.replace("Relativitaet", "Relativität")

    safe_write(path, text3)
    return scanned, changed, pairs_changed


def main() -> None:
    only = [a for a in sys.argv[1:] if not a.startswith("-")]
    targets = p6.TARGETS
    if only:
        targets = [p for p in targets if p.name in only]
    ts = tc = tp = 0
    for path in targets:
        print(f"START {path.name}", flush=True)
        s, c, pchg = transform(path)
        ts += s
        tc += c
        tp += pchg
        print(f"{path.name}: scanned={s} facts_changed={c} pairs_changed={pchg}", flush=True)
    print(f"TOTAL scanned={ts} facts_changed={tc} pairs_changed={tp}", flush=True)


if __name__ == "__main__":
    main()
