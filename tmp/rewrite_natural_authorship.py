# -*- coding: utf-8 -*-
"""
Natural Timer-caliber authorship for locked fill MCs.

- Edits bank source prompt/answer/wrong (no runtime pads)
- Verb-led full sentences, correct articles, no Title-Case mush
- Varied stems: Wozu / Woran / Welche Eigenschaft / Mit welchen Mitteln / Was bewirkt
- Topic-local distractors from sibling pair meanings
- Protects GOLD Timer/Sensor/Transparent (+ other GOLD keys)
- Never touches released curated packs (only *ThinFill* / *GapsFill* / *Density* / *Dichte*)

Usage:
  py -3 tmp/rewrite_natural_authorship.py --topic ph-k6-lb1
  py -3 tmp/rewrite_natural_authorship.py --topic bio:fill:k5:lb4:kriechtiere
  py -3 tmp/rewrite_natural_authorship.py --file physikThinFill.ts --limit 120
  py -3 tmp/rewrite_natural_authorship.py --dry-run --topic ph-k6-lb1
"""
from __future__ import annotations

import argparse
import hashlib
import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import rewrite_glossary_mc_quality_pass6 as p6
import rewrite_glossary_mc_quality_pass6f as p6f
import rewrite_glossary_mc_quality_pass6i as p6i
import rewrite_glossary_mc_quality_pass6m as p6m
import rewrite_locked_mc_final as fin
import rewrite_locked_mc_showable as show

p6.CURATED.update(p6f.EXTRA_CURATED)
p6.CURATED.update(p6i.EXTRA_I)
p6.CURATED.update(p6m.HAND)
p6.CURATED.update(getattr(show, "EXTRA_MEANINGS", {}))
p6.CURATED.update(fin.EXTRA)

ROOT = Path(__file__).resolve().parents[1]
TARGETS = show.TARGETS

# Never overwrite these concept IDs (gold Timer/Sensor/Transparent etc.)
GOLD_CONCEPTS = set(p6.GOLD.keys()) | {
    "ph:gap:ph-k6-lb1-lichtverschmutzung:fact:timer-sensor",
    "ph:gap:ph-k6-lb1-lichtverschmutzung:fact:richtlinie",
    "ph:gap:ph-k6-lb1-lichtverschmutzung:fact:blendung",
    "ph:gap:ph-k6-lb1-lichtverschmutzung:fact:dunkelheit",
    "ph:gap:ph-k6-lb1-lichtdurchlaessigkeit:fact:transparent",
    "ph:gap:ph-k6-lb1-lichtdurchlaessigkeit:fact:transluzent",
    "ph:gap:ph-k6-lb1-lichtdurchlaessigkeit:fact:opak",
}

# Hand prompts + answers for high-traffic optics / shared terms (Timer caliber).
# Keys: normalized term (lowercase, paren stripped).
HAND: dict[str, dict[str, object]] = {
    "lichtquelle": {
        "prompt": "Woran erkennt man eine Lichtquelle?",
        "answer": "Sie sendet selbst Licht aus, zum Beispiel als Sonne, Lampe oder Kerze.",
    },
    "lichtstrahl": {
        "prompt": "Was beschreibt das Modell des Lichtstrahls?",
        "answer": "Er modelliert die Ausbreitung des Lichts als Gerade in homogener Luft.",
    },
    "schatten": {
        "prompt": "Was bewirkt ein undurchsichtiger Körper im Licht?",
        "answer": "Er erzeugt hinter sich einen Bereich ohne direktes Licht.",
    },
    "kernschatten": {
        "prompt": "Welche Eigenschaft hat der Kernschatten?",
        "answer": "Er bleibt völlig unbeleuchtet, wenn die Lichtquelle ausgedehnt ist.",
    },
    "halbschatten": {
        "prompt": "Woran erkennt man den Halbschatten?",
        "answer": "Er ist nur teilweise beleuchtet und bildet die Randzone um den Kernschatten.",
    },
    "reflexion": {
        "prompt": "Was bewirkt Reflexion an einer Fläche?",
        "answer": "Licht wird zurückgeworfen, wobei Einfalls- und Ausfallswinkel gleich sind.",
    },
    "brechung": {
        "prompt": "Was bewirkt Brechung an einer Grenzfläche?",
        "answer": "Sie ändert die Richtung des Lichts beim Übergang in ein anderes Medium.",
    },
    "spiegel": {
        "prompt": "Wozu dient ein Spiegel?",
        "answer": "Er wirft Licht an einer glatten Fläche geordnet zurück und kann Bilder erzeugen.",
    },
    "transparenz": {
        "prompt": "Welche Eigenschaft beschreibt Transparenz?",
        "answer": "Licht geht so klar hindurch, dass man Gegenstände dahinter scharf erkennen kann.",
    },
    "opak": {
        "prompt": "Welche Eigenschaft hat ein opaker Körper?",
        "answer": "Er lässt kein Licht durch und wirft deshalb einen deutlichen Schatten.",
    },
    "lochkamera": {
        "prompt": "Mit welchen Mitteln bildet eine Lochkamera ab?",
        "answer": "Sie erzeugt durch ein kleines Loch ohne Linse ein umgekehrtes Bild.",
    },
    "spektrum": {
        "prompt": "Was bewirkt die Zerlegung weißen Lichts?",
        "answer": "Es entsteht ein Spektrum mit den Farben der Regenbogenreihe.",
    },
    "filter": {
        "prompt": "Wozu dient ein Farbfilter?",
        "answer": "Er lässt nur bestimmte Farben durch und absorbiert die übrigen.",
    },
    "sehvorgang": {
        "prompt": "Was bewirkt der Sehvorgang im Auge?",
        "answer": "Das Auge nimmt Lichtreize auf der Netzhaut wahr und das Gehirn deutet sie.",
    },
    "sensor": {
        "prompt": "Wozu dient ein Sensor in elektronischen Schaltungen?",
        "answer": "Er wandelt eine Messgröße wie Temperatur oder Licht in ein elektrisches Signal um.",
    },
    # Digitale Bildentstehung (gold-level, topic-local via __digitalbild)
    "pixel__digitalbild": {
        "prompt": "Was beschreibt ein Pixel in einem Digitalbild?",
        "answer": "Es ist der kleinste Bildpunkt eines Rasters, aus dem das digitale Bild aufgebaut ist.",
    },
    "auflösung__digitalbild": {
        "prompt": "Was beschreibt die Auflösung eines Digitalbildes?",
        "answer": "Sie gibt an, wie viele Bildpunkte pro Fläche das Detailreichtum bestimmen.",
    },
    "digitalisierung__digitalbild": {
        "prompt": "Was bewirkt die Digitalisierung bei der Bildaufnahme?",
        "answer": "Sie wandelt analoge Helligkeitswerte in speicherbare Zahlenwerte um.",
    },
    "belichtung__digitalbild": {
        "prompt": "Wozu dient die Belichtung bei der Aufnahme?",
        "answer": "Sie steuert die Lichtmenge auf dem Sensor über Zeit und Blende.",
    },
    "speichern__digitalbild": {
        "prompt": "Was geschieht beim Speichern eines Digitalbildes?",
        "answer": "Es speichert das fertige Bild dauerhaft als Datei auf dem Speichermedium.",
    },
    "display__digitalbild": {
        "prompt": "Wozu dient das Display bei digitalen Bildern?",
        "answer": "Es zeigt das fertige Pixelraster auf einem Bildschirm an.",
    },
    "rauschen__digitalbild": {
        "prompt": "Woran erkennt man Rauschen im Digitalbild?",
        "answer": "Es beschreibt zufällige Störungen im Bild, die besonders bei wenig Licht auffallen.",
    },
    "sensor__digitalbild": {
        "prompt": "Wozu dient der Bildsensor bei der digitalen Bildentstehung?",
        "answer": "Er wandelt auftreffendes Licht in ein elektrisches Signal um, etwa in CCD- oder CMOS-Chips.",
    },
    "vergleich film__digitalbild": {
        "prompt": "Worin unterscheidet sich der Vergleich von Film und Digitalbild?",
        "answer": "Es beschreibt den historischen Vergleich von chemischem Film und digitaler Aufnahme.",
    },
    "datensatz__digitalbild": {
        "prompt": "Was beschreibt der Datensatz eines Digitalbildes?",
        "answer": "Es speichert Helligkeitswerte kanalweise als Zahlen für die spätere Darstellung.",
    },
    "anwendung__digitalbild": {
        "prompt": "Wo begegnet uns digitale Bildentstehung im Alltag?",
        "answer": "Sie steckt hinter typischen Smartphone-Fotos und vielen Alltagsaufnahmen.",
    },
    "farbe__digitalbild": {
        "prompt": "Wie entsteht Farbe in einem typischen Digitalbild?",
        "answer": "Sie mischt typischerweise Rot-, Grün- und Blaukanäle zu wahrgenommenen Farben.",
    },
    "kieme": {
        "prompt": "Wozu dient die Kieme bei Fischen?",
        "answer": "Sie entzieht dem Wasser Sauerstoff und dient der Atmung.",
    },
    # Motion / Weg-Zeit
    "geschwindigkeit": {
        "prompt": "Was beschreibt die Geschwindigkeit?",
        "answer": "Sie gibt den zurückgelegten Weg pro Zeit an, oft mit der Formel v = s / t.",
    },
    "weg": {
        "prompt": "Was versteht man unter dem Weg eines Körpers?",
        "answer": "Er ist die zurückgelegte Strecke eines Körpers, oft in Metern gemessen.",
    },
    "zeit": {
        "prompt": "Wozu braucht man die Zeit bei Bewegungen?",
        "answer": "Sie misst die Dauer eines Vorgangs und steckt in der Formel für die Geschwindigkeit.",
    },
    "beschleunigung": {
        "prompt": "Was bewirkt eine Beschleunigung?",
        "answer": "Sie ändert die Geschwindigkeit pro Zeit und wird später genauer behandelt.",
    },
    "ruhe": {
        "prompt": "Woran erkennt man Ruhe relativ zu einem Bezugssystem?",
        "answer": "Der Körper hat die Geschwindigkeit null relativ zum gewählten Bezugssystem.",
    },
    "bezugssystem": {
        "prompt": "Wozu dient ein Bezugssystem?",
        "answer": "Es ist der Standpunkt, von dem aus eine Bewegung beschrieben wird.",
    },
    "diagramm": {
        "prompt": "Wozu dient ein s-t- oder v-t-Diagramm?",
        "answer": "Es stellt den Zusammenhang zwischen Weg, Zeit und Geschwindigkeit grafisch dar.",
    },
    "gleichförmig": {
        "prompt": "Welche Eigenschaft hat eine gleichförmige Bewegung?",
        "answer": "Die Geschwindigkeit bleibt konstant, ohne Beschleunigung, und erscheint gerade im s-t-Diagramm.",
    },
    "messung": {
        "prompt": "Mit welchen Mitteln misst man Weg und Zeit?",
        "answer": "Man misst mit Uhr und Maßband oder vergleichbaren Messgeräten.",
    },
    # Bio Kriechtiere / Lurche (high weak counts)
    "zauneidechse": {
        "prompt": "Woran erkennt man die Zauneidechse?",
        "answer": "Sie lebt als heimische Eidechse an warmen, strukturreichen Standorten und Säumen.",
    },
    "waldeidechse": {
        "prompt": "Woran erkennt man die Waldeidechse?",
        "answer": "Sie lebt als kleine heimische Eidechse oft in Wäldern und an Waldrändern.",
    },
    "mauereidechse": {
        "prompt": "Woran erkennt man die Mauereidechse?",
        "answer": "Sie lebt als wärmeliebende Eidechse an sonnigen Mauern, Felsen und Steinen.",
    },
    "blindschleiche": {
        "prompt": "Woran erkennt man die Blindschleiche?",
        "answer": "Sie lebt als beinlose Echse ohne Gift und ohne typischen Schlangenbau.",
    },
    "ringelnatter": {
        "prompt": "Woran erkennt man die Ringelnatter?",
        "answer": "Sie jagt als ungiftige Wassernatter oft an Gewässern.",
    },
    "kreuzotter": {
        "prompt": "Woran erkennt man die Kreuzotter?",
        "answer": "Sie trägt als giftige Vipernart Mitteleuropas ein Zickzackband auf dem Rücken.",
    },
    "europäische sumpfschildkröte": {
        "prompt": "Woran erkennt man die Europäische Sumpfschildkröte?",
        "answer": "Sie lebt als seltene, geschützte heimische Schildkröte in Feuchtgebieten.",
    },
    "landschildkröte": {
        "prompt": "Woran erkennt man eine Landschildkröte?",
        "answer": "Sie frisst als panzertragende Pflanzenfresserin; wilde heimische Arten sind selten.",
    },
    "aspisviper": {
        "prompt": "Woran erkennt man die Aspisviper?",
        "answer": "Sie lebt als giftige Viper Südeuropas und ist bei uns nicht überall heimisch.",
    },
    "gleichwarm": {
        "prompt": "Was meint gleichwarm bei Tieren?",
        "answer": "Die Körpertemperatur bleibt weitgehend unabhängig von der Umgebung stabil.",
    },
    "knochenfisch": {
        "prompt": "Woran erkennt man einen Knochenfisch?",
        "answer": "Sein Skelett besteht vorwiegend aus Knochen, zum Beispiel bei der Forelle.",
    },
    "knorpelfisch": {
        "prompt": "Woran erkennt man einen Knorpelfisch?",
        "answer": "Sein Skelett besteht aus Knorpel, zum Beispiel bei Haien.",
    },
    "mittelwert": {
        "prompt": "Wozu dient der Mittelwert bei Messungen?",
        "answer": "Er ist der Durchschnitt mehrerer Messwerte und glättet einzelne Streuungen.",
    },
    "protokoll": {
        "prompt": "Wozu dient ein Versuchsprotokoll?",
        "answer": "Es dokumentiert Versuchsschritte und Messwerte so, dass andere den Versuch wiederholen können.",
    },
    # Physik shared experiment-method core (≈54 topics)
    "hypothese": {
        "prompt": "Wozu formuliert man vor dem Versuch eine Hypothese?",
        "answer": "Sie stellt eine prüfbare Vermutung auf, die der Versuch bestätigen oder widerlegen kann.",
    },
    "variable": {
        "prompt": "Was ist eine Variable im Versuch?",
        "answer": "Sie ist die veränderliche Größe; man unterscheidet unabhängige und abhängige Variable.",
    },
    "konstant halten": {
        "prompt": "Warum hält man Störgrößen konstant?",
        "answer": "Man kontrolliert Störgrößen, damit der Vergleich fair bleibt und nur eine Größe wirkt.",
    },
    "messreihe": {
        "prompt": "Wozu dient eine Messreihe?",
        "answer": "Sie liefert mehrere Messwerte, damit Streuung erkennbar und auswertbar wird.",
    },
    "fehler": {
        "prompt": "Was versteht man unter einem Messfehler?",
        "answer": "Er beschreibt die Abweichung vom wahren Wert, zufällig oder systematisch.",
    },
    "auswertung": {
        "prompt": "Was leistet die Auswertung eines Versuchs?",
        "answer": "Sie stellt Diagramme und Schlüsse her und prüft sie an der Hypothese.",
    },
    "wiederholung": {
        "prompt": "Wozu wiederholt man Messungen?",
        "answer": "Sie erhöht die Zuverlässigkeit und ermöglicht einen belastbaren Mittelwert.",
    },
    "messgerät": {
        "prompt": "Worauf achtet man bei der Wahl des Messgeräts?",
        "answer": "Man wählt ein geeignetes Gerät zur Messgröße und mit passender Genauigkeit.",
    },
    "sicherheit": {
        "prompt": "Was gehört zur Sicherheit im Physikversuch?",
        "answer": "Man nutzt Schutzausrüstung und hält die geltenden Vorschriften ein.",
    },
    "frage": {
        "prompt": "Woran erkennt man eine gute Versuchsfrage?",
        "answer": "Sie ist klar und messbar formuliert, bevor der Versuch startet.",
    },
    "modell": {
        "prompt": "Wozu dient ein Modell in der Physik?",
        "answer": "Es liefert eine vereinfachte Erklärung und nennt zugleich seine Grenzen.",
    },
    "einheit": {
        "prompt": "Wozu braucht jede Messgröße eine Einheit?",
        "answer": "Sie legt das Maß fest, in dem die Größe angegeben wird; SI-Einheiten sind bevorzugt.",
    },
    "vergleich": {
        "prompt": "Wozu dient der Vergleich mit der Erwartung?",
        "answer": "Er prüft das Ergebnis an der Hypothese und diskutiert Abweichungen.",
    },
    # Physik Wärme / Ausdehnung
    "temperatur": {
        "prompt": "Was beschreibt die Temperatur?",
        "answer": "Sie misst den Wärmezustand; im Alltag in °C, als SI-Einheit in Kelvin.",
    },
    "ausdehnung": {
        "prompt": "Was bewirkt die Wärmeausdehnung bei vielen Stoffen?",
        "answer": "Das Volumen wächst mit steigender Temperatur bei vielen Stoffen.",
    },
    "aggregatzustand": {
        "prompt": "Was meint der Aggregatzustand?",
        "answer": "Er beschreibt fest, flüssig oder gasförmig und hängt von Temperatur und Druck ab.",
    },
    "schmelzen": {
        "prompt": "Was geschieht beim Schmelzen?",
        "answer": "Der Stoff geht bei der Schmelztemperatur vom festen in den flüssigen Zustand über.",
    },
    "sieden": {
        "prompt": "Was geschieht beim Sieden?",
        "answer": "Die Flüssigkeit geht bei der Siedetemperatur in den gasförmigen Zustand über.",
    },
    "wärmeleitung": {
        "prompt": "Wie transportiert Wärmeleitung Energie?",
        "answer": "Sie überträgt Wärme durch Kontakt; Metalle leiten dabei besonders gut.",
    },
    "dämmung": {
        "prompt": "Wozu dient die Dämmung?",
        "answer": "Sie verringert den Wärmefluss, oft mit Hilfe von Luftpolstern.",
    },
    "thermometer": {
        "prompt": "Wozu dient ein Thermometer?",
        "answer": "Es misst die Temperatur und braucht dazu Skalierung und Kalibrierung.",
    },
    "kelvin": {
        "prompt": "Was ist die Kelvin-Skala?",
        "answer": "Sie ist die SI-Temperaturskala; 0 K entspricht dem absoluten Nullpunkt.",
    },
    "wärme": {
        "prompt": "Was versteht man unter Wärme?",
        "answer": "Sie ist übertragene Energie und ist nicht dasselbe wie Temperatur.",
    },
    "mischung": {
        "prompt": "Was bestimmt die Endtemperatur einer Mischung?",
        "answer": "Die gemeinsame Endtemperatur folgt aus der Energiebilanz der Anteile.",
    },
    "spezifische wärme": {
        "prompt": "Was beschreibt die spezifische Wärme?",
        "answer": "Sie gibt an, wie viel Wärme pro Masse und Kelvin nötig ist, und ist stoffabhängig.",
    },
    "konvektion": {
        "prompt": "Wie transportiert Konvektion Wärme?",
        "answer": "Sie transportiert Wärme mit einer strömenden Flüssigkeit oder Luft, etwa bei Heizungsluft.",
    },
    "strahlung": {
        "prompt": "Wie transportiert Wärmestrahlung Energie?",
        "answer": "Sie überträgt Wärme ohne stoffliches Medium, zum Beispiel als Sonnenstrahlung.",
    },
    # Physik Kraft / Mechanik
    "kraft": {
        "prompt": "Was bewirkt eine Kraft?",
        "answer": "Sie ist die Ursache von Beschleunigung oder Verformung und wird in Newton gemessen.",
    },
    "gewichtskraft": {
        "prompt": "Was beschreibt die Gewichtskraft?",
        "answer": "Sie beschreibt die Anziehung der Erde auf eine Masse, oft mit F_G = m · g.",
    },
    "reibung": {
        "prompt": "Was bewirkt Reibung?",
        "answer": "Sie hemmt die Bewegung zwischen Berührflächen und wandelt Bewegungsenergie in Wärme um.",
    },
    "federkraft": {
        "prompt": "Woran erkennt man die Federkraft?",
        "answer": "Sie wirkt zurücktreibend proportional zur Auslenkung der Feder.",
    },
    "hebel": {
        "prompt": "Wozu dient ein Hebel?",
        "answer": "Er wandelt Kräfte über Hebelarme und erleichtert so das Heben oder Drehen.",
    },
    "flaschenzug": {
        "prompt": "Wozu dient ein Flaschenzug?",
        "answer": "Er verringert die nötige Zugkraft, indem er die Last auf mehrere Seilabschnitte verteilt.",
    },
    "auftrieb": {
        "prompt": "Was bewirkt der Auftrieb in Flüssigkeiten?",
        "answer": "Er wirkt der Gewichtskraft entgegen und entspricht dem Gewicht der verdrängten Flüssigkeit.",
    },
    "druck": {
        "prompt": "Was beschreibt der Druck?",
        "answer": "Er ist Kraft pro Fläche und wirkt in Flüssigkeiten und Gasen nach allen Seiten.",
    },
    "magnetkraft": {
        "prompt": "Woran erkennt man Magnetkraft?",
        "answer": "Sie wirkt anziehend oder abstoßend zwischen Magneten und magnetisierbaren Stoffen.",
    },
    "elektrostatik": {
        "prompt": "Was beschreibt die Elektrostatik?",
        "answer": "Sie beschreibt Kräfte und Felder ruhender elektrischer Ladungen.",
    },
    "kraftwandler": {
        "prompt": "Wozu dient ein Kraftwandler?",
        "answer": "Er verändert Betrag oder Richtung einer Kraft, etwa mit Hebel oder Flaschenzug.",
    },
    "gleichgewicht": {
        "prompt": "Woran erkennt man mechanisches Gleichgewicht?",
        "answer": "Die Kräfte und Drehmomente heben sich auf, sodass sich nichts beschleunigt.",
    },
    "richtung": {
        "prompt": "Warum gehört zur Kraft eine Richtung?",
        "answer": "Kräfte sind Vektoren; ohne Richtung ist die Wirkung nicht vollständig beschrieben.",
    },
    # Physik Stromkreis
    "stromkreis": {
        "prompt": "Woran erkennt man einen geschlossenen Stromkreis?",
        "answer": "Er bildet einen geschlossenen Weg für Ladung mit Quelle, Leiter und Verbraucher.",
    },
    "leiter": {
        "prompt": "Woran erkennt man einen elektrischen Leiter?",
        "answer": "Er enthält frei bewegliche Ladungen; Metalle leiten deshalb gut.",
    },
    "isolator": {
        "prompt": "Welche Eigenschaft hat ein Isolator?",
        "answer": "Er lässt nur sehr geringen Strom zu, etwa Kunststoff oder Keramik.",
    },
    "widerstand": {
        "prompt": "Was bewirkt ein Widerstand im Stromkreis?",
        "answer": "Er hemmt den Strom; oft gilt R = U / I.",
    },
    "reihenschaltung": {
        "prompt": "Woran erkennt man eine Reihenschaltung?",
        "answer": "Es gibt einen Stromweg, und die Stromstärke ist überall gleich.",
    },
    "parallelschaltung": {
        "prompt": "Woran erkennt man eine Parallelschaltung?",
        "answer": "Es gibt mehrere Stromwege, und die Spannung an den Zweigen ist gleich.",
    },
    "symbol": {
        "prompt": "Wozu dienen Schaltsymbole?",
        "answer": "Sie sind normierte Schaltzeichen für Bauteile in Stromkreisskizzen.",
    },
    "spannung": {
        "prompt": "Was bewirkt die elektrische Spannung?",
        "answer": "Sie ist die Ursache des Stroms und wird in Volt gemessen.",
    },
    "stromstärke": {
        "prompt": "Was beschreibt die Stromstärke?",
        "answer": "Sie gibt die Ladung pro Zeit an und wird in Ampere gemessen.",
    },
    "kurzschluss": {
        "prompt": "Was geschieht bei einem Kurzschluss?",
        "answer": "Der Strom nimmt einen Weg mit sehr geringem Widerstand und kann gefährlich ansteigen.",
    },
    "sicherung": {
        "prompt": "Wozu dient eine Sicherung?",
        "answer": "Sie unterbricht den Strom bei Überlast und schützt so Leitung und Gerät.",
    },
    "gefahr": {
        "prompt": "Warum ist Strom gefährlich?",
        "answer": "Hohe Stromstärke und Spannung können Körper und Geräte schwer schädigen.",
    },
    "ohmsches gesetz": {
        "prompt": "Was besagt das Ohmsche Gesetz?",
        "answer": "Es verknüpft Spannung, Stromstärke und Widerstand in der Form U = R · I.",
    },
    # Physik Energie / Elektronik residuals
    "energie": {
        "prompt": "Was beschreibt Energie in der Physik?",
        "answer": "Sie beschreibt die Fähigkeit, Arbeit zu verrichten, und wird in Joule gemessen.",
    },
    "umwandlung": {
        "prompt": "Was geschieht bei einer Energieumwandlung?",
        "answer": "Die Energieform ändert sich, während die Gesamtenergie erhalten bleibt.",
    },
    "umwandlung__motion": {
        "prompt": "Wozu dient die Umwandlung von km/h in m/s?",
        "answer": "Sie rechnet Geschwindigkeiten mit dem Faktor 3,6 zwischen km/h und m/s um.",
    },
    "wirkungsgrad": {
        "prompt": "Was beschreibt den Wirkungsgrad?",
        "answer": "Er gibt den nützlichen Anteil der zugeführten Energie an, oft als E_nutz geteilt durch E_zu.",
    },
    "leistung": {
        "prompt": "Was beschreibt die Leistung?",
        "answer": "Sie gibt die Energie pro Zeit an, oft mit P = E / t.",
    },
    "kinetische energie": {
        "prompt": "Was beschreibt die kinetische Energie?",
        "answer": "Sie beschreibt die Energie der Bewegung und hängt von Masse und Geschwindigkeit ab.",
    },
    "potenzielle energie": {
        "prompt": "Was beschreibt die potenzielle Energie?",
        "answer": "Sie beschreibt die Lageenergie im Schwerefeld der Erde.",
    },
    "wärmeenergie": {
        "prompt": "Was beschreibt Wärmeenergie?",
        "answer": "Sie beschreibt die ungeordnete Teilchenbewegung und ist thermische Energie.",
    },
    "elektrische energie": {
        "prompt": "Wie wird elektrische Energie transportiert?",
        "answer": "Sie wird über den Strom transportiert, etwa im Haushalt.",
    },
    "sparen": {
        "prompt": "Wozu dient Energiesparen?",
        "answer": "Es senkt den Verbrauch, zum Beispiel durch Dämmung oder LED-Lampen.",
    },
    "generator": {
        "prompt": "Wozu dient ein Generator?",
        "answer": "Er wandelt mechanische Energie in elektrische Energie um, etwa im Kraftwerk.",
    },
    "kraftwerk": {
        "prompt": "Wozu dient ein Kraftwerk?",
        "answer": "Es erzeugt elektrische Energie aus verschiedenen Primärquellen.",
    },
    "erneuerbar": {
        "prompt": "Woran erkennt man erneuerbare Energiequellen?",
        "answer": "Sie nutzen nachwachsende oder kontinuierliche Quellen wie Sonne, Wind oder Wasser.",
    },
    "netz": {
        "prompt": "Wozu dient das elektrische Netz?",
        "answer": "Es verteilt elektrische Energie über verschiedene Spannungsebenen.",
    },
    "arbeit": {
        "prompt": "Was beschreibt mechanische Arbeit?",
        "answer": "Sie beschreibt die Energieübertragung durch Kraft und Weg, oft mit W = F · s.",
    },
    "diode": {
        "prompt": "Wozu dient eine Diode?",
        "answer": "Sie lässt Strom vorwiegend in einer Richtung durch den pn-Übergang.",
    },
    "transistor": {
        "prompt": "Wozu dient ein Transistor?",
        "answer": "Er verstärkt oder schaltet Strom, gesteuert über die Basis.",
    },
    "bauteil": {
        "prompt": "Was ist ein elektronisches Bauteil?",
        "answer": "Es ist ein Bauelement wie Widerstand, Kondensator oder Diode im Stromkreis.",
    },
    "led": {
        "prompt": "Wozu dient eine LED?",
        "answer": "Als Leuchtdiode wandelt sie elektrische Energie in Licht um.",
    },
    "digital": {
        "prompt": "Was kennzeichnet digitale Elektronik?",
        "answer": "Sie arbeitet mit den Zuständen 0 und 1 in Logikgattern.",
    },
    "kennlinie": {
        "prompt": "Wozu dient eine Kennlinie?",
        "answer": "Sie zeigt das Bauteilverhalten als U-I-Diagramm.",
    },
    "gleichrichtung": {
        "prompt": "Was bewirkt die Gleichrichtung?",
        "answer": "Sie wandelt Wechselspannung mit einer Diode in pulsierende Gleichspannung um.",
    },
    "schaltplan": {
        "prompt": "Was zeigt ein Schaltplan?",
        "answer": "Er zeigt Symbole und Verbindungen der Bauteile in einem Stromkreis.",
    },
    "signal": {
        "prompt": "Was ist ein elektrisches Signal?",
        "answer": "Es überträgt Information als elektrische Größe, etwa Spannung oder Strom.",
    },
    "messung__elektronik": {
        "prompt": "Womit misst man in der Elektronik?",
        "answer": "Man misst mit dem Multimeter und wählt passende Messbereiche.",
    },
    "sicherheit__elektronik": {
        "prompt": "Was bedeutet Sicherheit an elektronischen Bauteilen?",
        "answer": "Man überlastet Bauteile nicht und beachtet die Angaben im Datenblatt.",
    },
    "versorgung__elektronik": {
        "prompt": "Was meint die Versorgung in einer Schaltung?",
        "answer": "Sie liefert die Betriebsspannung; die Polarität muss stimmen.",
    },
    "vorwiderstand": {
        "prompt": "Wozu dient ein Vorwiderstand bei einer LED?",
        "answer": "Er schützt die LED, indem er den Strom begrenzt.",
    },
    "bauelement": {
        "prompt": "Was ist ein Bauelement in einer Schaltung?",
        "answer": "Es ist ein Einzelteil der Schaltung wie Widerstand, Kondensator oder Diode.",
    },
    # Lurche
    "hautatmung": {
        "prompt": "Wozu dient die Hautatmung bei Lurchen?",
        "answer": "Sie ermöglicht den Gasaustausch über die feuchte Haut zusätzlich zur Lunge.",
    },
    "lungenatmung": {
        "prompt": "Wozu dient die Lungenatmung bei Lurchen?",
        "answer": "Sie nimmt Sauerstoff über die Lungen auf, vor allem an Land.",
    },
    "laich": {
        "prompt": "Was ist Laich bei Lurchen?",
        "answer": "Es sind gallertig umhüllte Eigelege, die meist im Wasser abgelegt werden.",
    },
    "wanderung": {
        "prompt": "Was bewirkt die Laichwanderung der Lurche?",
        "answer": "Sie führt die Tiere zu geeigneten Laichgewässern zur Fortpflanzung.",
    },
    "giftstoffe": {
        "prompt": "Wozu dienen Giftstoffe in der Haut mancher Lurche?",
        "answer": "Sie schützen als Hautsekrete vor Fressfeinden.",
    },
    "kaulquappe": {
        "prompt": "Woran erkennt man eine Kaulquappe?",
        "answer": "Sie ist die wasserlebende Larve der Lurche mit Kiemen und Schwanz.",
    },
    "metamorphose": {
        "prompt": "Was bewirkt die Metamorphose bei Lurchen?",
        "answer": "Sie wandelt die Kaulquappe schrittweise in das landlebende erwachsene Tier um.",
    },
    "feuchtigkeit": {
        "prompt": "Warum brauchen Lurche Feuchtigkeit?",
        "answer": "Sie schützt die Haut vor Austrocknung und ermöglicht die Hautatmung.",
    },
    # Geschichte shared core (geschichteThinFill — same 10–14 terms in every bank)
    "quelle": {
        "prompt": "Was versteht man in der Geschichtswissenschaft unter einer Quelle?",
        "answer": "Sie gibt als Überrest oder Tradition Auskunft über die Vergangenheit.",
    },
    "chronologie": {
        "prompt": "Was leistet die Chronologie in der Geschichte?",
        "answer": "Sie ordnet Ereignisse in ihre zeitliche Reihenfolge ein.",
    },
    "epoche": {
        "prompt": "Woran erkennt man eine Epoche?",
        "answer": "Sie fasst einen geschichtlichen Zeitraum mit typischen gemeinsamen Merkmalen zusammen.",
    },
    "herrschaft": {
        "prompt": "Was beschreibt Herrschaft in der Geschichte?",
        "answer": "Sie beschreibt, wer politische Macht ausübt und Entscheidungen trifft.",
    },
    "gesellschaft": {
        "prompt": "Was umfasst eine Gesellschaft historisch?",
        "answer": "Sie umfasst soziale Schichten, Gruppen und ihre Rechte und Pflichten.",
    },
    "wirtschaft": {
        "prompt": "Was regelt die Wirtschaft in historischen Zusammenhängen?",
        "answer": "Sie regelt Produktion, Handel und Verteilung von Gütern und Ressourcen.",
    },
    "religion": {
        "prompt": "Welche Rolle spielt Religion in der Geschichte?",
        "answer": "Sie prägt Werte, Herrschaft und Alltag und kann machtpolitisch wirken.",
    },
    "kultur": {
        "prompt": "Was umfasst Kultur historisch?",
        "answer": "Sie umfasst Sprache, Kunst, Brauchtum und den Austausch zwischen Gruppen.",
    },
    "konflikt": {
        "prompt": "Was kennzeichnet einen historischen Konflikt?",
        "answer": "Er beschreibt Auseinandersetzungen mit Ursachen, Verlauf und Folgen.",
    },
    "revolution": {
        "prompt": "Woran erkennt man eine Revolution?",
        "answer": "Sie ersetzt eine bestehende Ordnung oft rasch und mit Gewalt.",
    },
    "staat": {
        "prompt": "Wozu dient ein Staat historisch?",
        "answer": "Er organisiert Herrschaft durch Gesetze, Institutionen und Grenzen.",
    },
    "migration": {
        "prompt": "Was beschreibt Migration in der Geschichte?",
        "answer": "Sie beschreibt die Wanderung von Menschen zwischen Regionen oder Ländern.",
    },
    "erinnerung": {
        "prompt": "Was meint Erinnerung im Umgang mit Geschichte?",
        "answer": "Sie beschreibt den öffentlichen und privaten Umgang mit der Vergangenheit, etwa in Denkmalen und Narrativen.",
    },
    "kontinuität": {
        "prompt": "Was meint Kontinuität in der Geschichte?",
        "answer": "Sie beschreibt, was trotz Wandel bestehen bleibt, im Gegensatz zum Bruch.",
    },
    # Geschichte densify — Mittelalter / Regional (K6)
    "lehnswesen": {
        "prompt": "Was verbindet das Lehnswesen?",
        "answer": "Es verbindet den Treueeid des Vasallen mit der Leihe von Land.",
    },
    "grundherrschaft": {
        "prompt": "Was beschreibt die Grundherrschaft?",
        "answer": "Sie beschreibt die Herrschaft über Bauernland mit Abgaben und Diensten.",
    },
    "stadtrecht": {
        "prompt": "Was gewährt das Stadtrecht einer Kommune?",
        "answer": "Es gewährt Freiheiten wie Markt und eigene Gerichtsbarkeit.",
    },
    "zunft": {
        "prompt": "Wozu dient eine Zunft?",
        "answer": "Sie organisiert Handwerker eines Berufs und regelt Qualität sowie Marktschutz.",
    },
    "hanse": {
        "prompt": "Was organisiert die Hanse?",
        "answer": "Sie organisiert den Fernhandel an Nord- und Ostsee als Städtebund.",
    },
    "ostsiedlung": {
        "prompt": "Was beschreibt die Ostsiedlung?",
        "answer": "Sie beschreibt die mittelalterliche Expansion und Kolonisation nach Osten.",
    },
    "papsttum": {
        "prompt": "Welche Rolle hat das Papsttum?",
        "answer": "Es bildet die geistliche Spitze der lateinischen Kirche mit politischer Macht.",
    },
    "kloster": {
        "prompt": "Wozu dient ein Kloster im Mittelalter?",
        "answer": "Es vereint Gebet, Arbeit und Wissenspflege als geistliches Zentrum.",
    },
    "frondienst": {
        "prompt": "Woran erkennt man den Frondienst?",
        "answer": "Er beschreibt die Arbeitsleistung unfreier Bauern für den Grundherrn.",
    },
    "zehnten": {
        "prompt": "Woran erkennt man den Zehnt?",
        "answer": "Er beschreibt die Abgabe an die Kirche, oft ein Zehntel der Erträge.",
    },
    "schriftlichkeit": {
        "prompt": "Wozu dient Schriftlichkeit in der Herrschaft?",
        "answer": "Sie dokumentiert Herrschaft über Urkunden und Register.",
    },
    "juden im mittelalter": {
        "prompt": "Welche Lage hatten Juden im Mittelalter?",
        "answer": "Sie lebten als Minderheit mit Sonderstatus zwischen Schutz und Verfolgung.",
    },
    # Geschichte densify — high-frequency Moderne / NS / Kalter Krieg
    "weimarer republik": {
        "prompt": "Was war die Weimarer Republik?",
        "answer": "Sie war die erste deutsche Demokratie nach dem Ersten Weltkrieg von 1919 bis 1933.",
    },
    "blockbildung": {
        "prompt": "Was kennzeichnet die Blockbildung nach 1945?",
        "answer": "Sie kennzeichnet die Lagerbildung im Ost-West-Konflikt nach 1945.",
    },
    "stellvertreterkrieg": {
        "prompt": "Was beschreibt einen Stellvertreterkrieg?",
        "answer": "Er beschreibt einen Konflikt, der über Drittstaaten oder Proxys ausgetragen wird.",
    },
    "ddr": {
        "prompt": "Was war die DDR?",
        "answer": "Sie war der sozialistische deutsche Staat auf dem Gebiet der sowjetischen Besatzungszone.",
    },
    "brd": {
        "prompt": "Was war die BRD nach 1949?",
        "answer": "Sie war die Bundesrepublik Deutschland als demokratischer Weststaat nach 1949.",
    },
    "quellenkritik": {
        "prompt": "Wozu dient die Quellenkritik?",
        "answer": "Sie prüft Herkunft, Absicht und Glaubwürdigkeit einer historischen Quelle.",
    },
    "friedliche revolution": {
        "prompt": "Was bewirkte die Friedliche Revolution 1989?",
        "answer": "Sie führte 1989 in der DDR durch Proteste zum Ende der SED-Herrschaft.",
    },
    "erinnerungskultur": {
        "prompt": "Was gestaltet die Erinnerungskultur?",
        "answer": "Sie gestaltet den gesellschaftlichen Umgang mit Vergangenheit und Gedenken.",
    },
    "inflation 1923": {
        "prompt": "Was kennzeichnet die Inflation 1923?",
        "answer": "Sie zerstörte Geldwerte und Ersparnisse in der Weimarer Republik durch Hyperinflation.",
    },
    "wiedervereinigung": {
        "prompt": "Was vollzog die Wiedervereinigung 1990?",
        "answer": "Sie vollzog 1990 die staatliche Einheit Deutschlands nach dem Ende der DDR.",
    },
    "mauerbau": {
        "prompt": "Was bewirkte der Mauerbau 1961?",
        "answer": "Er errichtete 1961 die Berliner Mauer und zementierte die deutsche Teilung.",
    },
    "gleichschaltung": {
        "prompt": "Was bewirkte die Gleichschaltung?",
        "answer": "Sie unterwarf Parteien, Verbände und Institutionen der einheitlichen NS-Kontrolle.",
    },
    "holocaust": {
        "prompt": "Was bezeichnet der Holocaust?",
        "answer": "Er bezeichnet den systematischen Völkermord an Juden und anderen Verfolgten im NS.",
    },
    "weltwirtschaftskrise": {
        "prompt": "Was bezeichnet die Weltwirtschaftskrise?",
        "answer": "Sie bezeichnet den globalen Wirtschaftseinbruch ab 1929 mit Massenarbeitslosigkeit.",
    },
    "warschauer pakt": {
        "prompt": "Was war der Warschauer Pakt?",
        "answer": "Er war das östliche Militärbündnis unter Führung der Sowjetunion im Kalten Krieg.",
    },
    "volksgemeinschaft": {
        "prompt": "Was propagierte die Volksgemeinschaft?",
        "answer": "Sie propagierte die NS-Ideologie einer einheitlichen Volkszugehörigkeit unter Ausschluss von Minderheiten.",
    },
    # Geschichte only — electrical "widerstand" stays in Physik HAND above;
    # lookup is subject-aware via hand_entry().
    "widerstand__ge": {
        "prompt": "Was umfasst Widerstand gegen Diktatur?",
        "answer": "Er umfasst mutige Handlungen gegen Unrecht und Diktatur trotz hoher Gefahr.",
    },
    "ermächtigungsgesetz": {
        "prompt": "Was bewirkte das Ermächtigungsgesetz 1933?",
        "answer": "Es übertrug 1933 der Regierung Gesetzgebungsrechte und entmachtete den Reichstag.",
    },
    "propaganda": {
        "prompt": "Wozu dient Propaganda in Diktaturen?",
        "answer": "Sie steuert die öffentliche Meinung durch gezielte Medien- und Massenbeeinflussung.",
    },
    "nato": {
        "prompt": "Was ist die NATO?",
        "answer": "Sie ist das westliche Verteidigungsbündnis mit Beistandspflicht der Mitgliedstaaten.",
    },
    "kalter krieg": {
        "prompt": "Was kennzeichnet den Kalten Krieg?",
        "answer": "Er kennzeichnet den Ost-West-Konflikt nach 1945 mit Blockbildung und Abschreckung.",
    },
    "potsdamer konferenz": {
        "prompt": "Was beschloss die Potsdamer Konferenz?",
        "answer": "Sie regelte 1945 Besatzung, Demilitarisierung und Grenzen Deutschlands nach dem Krieg.",
    },
    "industrialisierung": {
        "prompt": "Was prägte die Industrialisierung?",
        "answer": "Sie prägte Wirtschaft und Gesellschaft durch Maschinen, Fabrik und Kapital.",
    },
    "gewaltenteilung": {
        "prompt": "Was bewirkt die Gewaltenteilung?",
        "answer": "Sie teilt staatliche Macht in Legislative, Exekutive und Judikative.",
    },
    "gesellschaftsvertrag": {
        "prompt": "Was begründet der Gesellschaftsvertrag?",
        "answer": "Er begründet Herrschaft durch Zustimmung der Bürger statt allein durch Gottesgnadentum.",
    },
    "reformation": {
        "prompt": "Was bezeichnet die Reformation?",
        "answer": "Sie bezeichnet die Kirchenspaltung und Erneuerung im 16. Jahrhundert.",
    },
    "aufklärung": {
        "prompt": "Was stellt die Aufklärung in den Mittelpunkt?",
        "answer": "Sie stellt Vernunft und Kritik als Leitideen der Gesellschaft in den Mittelpunkt.",
    },
    "absolutismus": {
        "prompt": "Woran erkennt man den Absolutismus?",
        "answer": "Er bedeutet unumschränkte Fürstenmacht über Staat und Untertanen.",
    },
    "merkantilismus": {
        "prompt": "Wozu dient der Merkantilismus?",
        "answer": "Er lenkt die Wirtschaft staatlich zugunsten von Handelsüberschüssen.",
    },
    "imperialismus": {
        "prompt": "Was strebt der Imperialismus an?",
        "answer": "Er strebt die globale Machtausdehnung von Staaten an.",
    },
    "liberalismus": {
        "prompt": "Was betont der Liberalismus?",
        "answer": "Er betont individuelle Freiheitsrechte und begrenzte Staatseingriffe.",
    },
    "nationalismus": {
        "prompt": "Was sieht der Nationalismus als zentral an?",
        "answer": "Er sieht die Nation als zentrale politische Einheit.",
    },
    "humanismus": {
        "prompt": "Was betont der Humanismus?",
        "answer": "Er betont Bildung und die Würde des Menschen nach antiken Vorbildern.",
    },
    "amerikanische revolution": {
        "prompt": "Was bewirkte die Amerikanische Revolution?",
        "answer": "Sie führte 1776 zur Unabhängigkeit der amerikanischen Kolonien von Großbritannien.",
    },
    "französische revolution": {
        "prompt": "Was bewirkte die Französische Revolution?",
        "answer": "Sie stürzte ab 1789 die alte Ordnung in Frankreich und verbreitete Freiheitsideen.",
    },
    "napoleonische ordnung": {
        "prompt": "Was prägte die Napoleonische Ordnung?",
        "answer": "Sie prägte Europa durch französische Herrschaft, Reformen und Kriege um 1800.",
    },
    "arbeiterbewegung": {
        "prompt": "Was forderte die Arbeiterbewegung?",
        "answer": "Sie forderte soziale Rechte und politische Mitbestimmung der Industriearbeiterschaft.",
    },
    "nationalstaat": {
        "prompt": "Was beschreibt den Nationalstaat?",
        "answer": "Er beschreibt einen Staat, der Nation, Territorium und zentrale Herrschaft verbindet.",
    },
    "wiener kongress": {
        "prompt": "Was regelte der Wiener Kongress?",
        "answer": "Er regelte 1814/15 die Neuordnung Europas nach den Napoleonischen Kriegen.",
    },
    "parlamentarismus": {
        "prompt": "Was kennzeichnet den Parlamentarismus?",
        "answer": "Er kennzeichnet Herrschaft durch ein gewähltes Parlament mit Gesetzgebungsrechten.",
    },
    "urbanisierung": {
        "prompt": "Was bewirkt die Urbanisierung?",
        "answer": "Sie beschreibt das Wachstum der Städte durch Zuzug und Industrie.",
    },
    "reichseinigung": {
        "prompt": "Was beschreibt die Reichseinigung?",
        "answer": "Sie beschreibt die deutsche Nationalstaatsbildung in den Einigungskriegen 1864 bis 1871.",
    },
    "soziale frage": {
        "prompt": "Was meint die Soziale Frage?",
        "answer": "Sie beschreibt die Lage der Industriearbeiter mit Armut und Reformdebatten.",
    },
    "wettrüsten": {
        "prompt": "Was kennzeichnet das Wettrüsten vor 1914?",
        "answer": "Es beschreibt die militärische Konkurrenz der Großmächte vor 1914.",
    },
    "wettruesten": {
        "prompt": "Was kennzeichnet das Wettrüsten vor 1914?",
        "answer": "Es beschreibt die militärische Konkurrenz der Großmächte vor 1914.",
    },
}

BANNED_OUT = re.compile(
    r"ist hier:|kurz gesagt:|\bHier gilt\b|Es geht um|Fachzusammenhang|"
    r"Nachbarbegriff|prüfbaren Sachverhalt|Was bedeutet\b|Folgendes|"
    r"bei den behandelten Arten|"
    r"\bNur Haarfarbe\b|\bNur Zahnzahl\b|"
    r"ohne biologischen Bezug|"
    r"Nur Fotosynthese ohne biologischen Bezug|"
    r"\bEs ist eine Nur\b|\bSie ist eine Nur\b|\bEr ist eine Nur\b|"
    r"Es ist eine Erbgänge|Es ist eine Lebensraum diktiert|"
    r"Es beschreibt ein Zwei Membranen",
    re.I,
)
# Title-Case mush after „ist eine“ (two+ Title tokens) / „beschreibt eine|ein“
TITLE_AFTER_IST_EINE = re.compile(r"\bist eine [A-ZÄÖÜ][a-zäöüß]+ [A-ZÄÖÜ]")
TITLE_AFTER_BESCHREIBT = re.compile(r"\bbeschreibt ein(?:e)? [A-ZÄÖÜ]")
TITLE_MUSH = re.compile(
    r"\b(der|die|das|ein|eine|einen|einem|einer)\s+"
    r"([A-ZÄÖÜ][a-zäöüß]+)(?:\s+([A-ZÄÖÜ][a-zäöüß]+)){1,}",
)
MECH_ANS = re.compile(
    r"^(Sie|Er|Es) ist (eine|ein)\b|"
    r"^(Sie|Er|Es) ist [a-zäöü]"  # Es ist militärische… / Es ist deutsche…
    r"|\bdurch (Beim|In|Bei|Mit)\b|"
    r"\bdurch [A-ZÄÖÜ][a-zäöüß]*(?:/[a-z]+)?(?:,|\.|$)|"
    r"\bdurch (vor \d|Armut|1864)\b|"
    r"\bSelbst Licht Aussendet\b|"
    r"\bGeradliniges Modell\b.*\bdurch in\b|"
    r"\bLicht geht durch durch\b|"
    r"\bWas kennzeichnet [„\"]",
    re.I,
)
VERB_LEAD = re.compile(
    r"^(Ist|Sind|Dient|Bildet|Steuert|Misst|Schützt|Erfasst|Reguliert|"
    r"Wandelt|Spaltet|Fixiert|Nutzt|Überträgt|Trennt|Verläuft|Gewinnt|"
    r"Besitzt|Enthält|Umfasst|Prüft|Gestaltet|War|Unterwirft|Propagiert|"
    r"Begründet|Führte|Prägt|Organisiert|Betont|Teilt|Kennzeichnet|"
    r"Bezeichnet|Vollzieht|Errichtet|Bedeutet|Gibt|Lässt|Wird|"
    r"Ermöglicht|Verringert|Erbeutet|Ernährt|Ändert|Liefert|Erklärt|"
    r"Fördert|Schwächt|Dokumentiert|Unterscheidet|Besiedelt|Ordnet|"
    r"Betrifft|Zählt|Heißt|Nennt|Zeigt|Hängt|Transportiert|Erzeugt|"
    r"Speichert|Unterbricht|Hemmt|Reflektiert|Absorbiert|Sendet|"
    r"Wirft|Modelliert|Verbindet|Gewährt|Leitet|Filtert|"
    r"Pumpt|Kontrolliert|Bestimmt|Meint|Steht|Folgt|Nimmt|"
    r"Stellt|Beschreibt|Misst|Zeigt|Nennt|Heißt|Macht|Hilft|"
    r"Sorgt|Führt|Bringt|Hält|Liegt|Läuft|Fließt|Schaltet|"
    r"Vermeidet|Erhöht|Ersetzt|Bleibt|Deutet|Entzieht|Erkennt)\b",
    re.I,
)
# Detect verb-looking first token even if not in list (Stellt, Misst, …)
VERBISH = re.compile(
    r"^[A-ZÄÖÜ][a-zäöüß]{2,}(t|en|elt|ert|igt|iert|iert|isst|ässt)\b"
)
# German nouns that look verbish by ending (-haut, -ung, …) must not be treated as verbs
NOUNISH_END = re.compile(
    r"(haut|keit|heit|ung|tion|schaft|nis|tum|chen|lein|heit|schaft|"
    r"körper|öffnung|schicht|organ|hilfe|blase|deckel|linse)$",
    re.I,
)
BAD_ANSWER = re.compile(
    # article + capitalized verb (Ein Stellt / Eine Beschreibt), not nouns
    r"^(Ein|Eine)\s+(Stellt|Beschreibt|Bildet|Gibt|Lässt|Wird|Zeigt|Nennt|"
    r"Macht|Hilft|Sorgt|Führt|Bringt|Hält|Misst|Sendet|Wirft|Ändert)\b|"
    # casing mush: article + lowercase common nouns
    r"\b(ist eine|ist ein)\s+(körper|bereich|modell|organ|fläche|weg)\b|"
    r"^(Sie|Er|Es) ist (Die|Der|Das)\s+[A-ZÄÖÜ].*\bist\b|"  # Sie ist Die X ist …
    r"\bEine Beschreibt\b|\bEin Stellt\b|"
    r"\bdurch (Beim|In Homogener)\b|"
    r"Sie schlangen\b|Es ist ein Bei\b",
    re.I,
)
# Case-sensitive mush (re.I would match lowercase adjectives)
TITLE_TIP = re.compile(r",\s*[A-ZÄÖÜ][a-zäöüß]+ [A-ZÄÖÜ]")
TITLE_AFTER_IST = re.compile(
    r"\bist eine [A-ZÄÖÜ][a-zäöüß]+ [A-ZÄÖÜ]|"
    r"\bist ein [A-ZÄÖÜ][a-zäöüß]+ [A-ZÄÖÜ]|"
    r"\bdurch (Oft in|Sonnige|Beim|In Homogener)\b"
)

PAIR_RE = re.compile(
    r"\{[^{}]*?term:\s*(['\"])((?:\\.|[^\\\"'])*)\1\s*,\s*"
    r"meaning:\s*(['\"])((?:\\.|[^\\\"'])*)\3"
    r"(?:[^{}]*?wissen:\s*(['\"])((?:\\.|[^\\\"'])*)\5)?[^{}]*?\}",
)
FACT_RE = re.compile(
    r"\{\s*\n\s*concept:\s*(['\"])((?:\\.|[^\\\"'])*)\1\s*,\s*\n\s*"
    r"prompt:\s*(['\"])((?:\\.|[^\\\"'])*)\3\s*,\s*\n\s*"
    r"answer:\s*(['\"])((?:\\.|[^\\\"'])*)\5\s*,\s*"
    r"wrong:\s*\[([\s\S]*?)\]"
    r"(?:[\s\S]*?flashFront:\s*(['\"])((?:\\.|[^\\\"'])*)\8)?"
    r"[\s\S]*?\n\s*\},",
)
FLASH_RE = re.compile(r"flashFront:\s*(['\"])((?:\\.|[^\\\"'])*)\1")


def decode(s: str) -> str:
    s = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), s)
    return (
        s.replace("\\n", "\n")
        .replace('\\"', '"')
        .replace("\\'", "'")
        .replace("\\\\", "\\")
    )


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def norm_term(term: str) -> str:
    t = p6.display_term(term).lower().strip()
    t = re.sub(r"\s+", " ", t)
    return t


def hand_entry(term: str, concept: str = "") -> dict[str, object] | None:
    """Subject-aware HAND lookup (Geschichte Widerstand ≠ Physik Widerstand)."""
    key = norm_term(term)
    base = re.sub(r"\s*\(.*$", "", key).strip()
    c = (concept or "").lower()
    if c.startswith("ge:") or ":ge:" in c or "geschichte" in c:
        for k in (f"{key}__ge", f"{base}__ge", key, base):
            if k in HAND:
                return HAND[k]
        return None
    # Topic-tagged terms: Messung (elektronik) ≠ motion Messung
    paren = re.search(r"\(([^)]+)\)", term or "")
    if paren:
        tag = paren.group(1).lower().strip()
        tagged = f"{base}__{tag}"
        if tagged in HAND:
            return HAND[tagged]
        # Do not fall back to generic HAND for shared method words
        if base in {"messung", "sicherheit", "signal", "versorgung", "netz", "arbeit", "kraftwerk"}:
            return None
    # Motion unit conversion vs energy conversion
    if base == "umwandlung" and (
        "lb2-wegzeit" in c or "lb2-einheiten" in c or "wegzeit" in c
    ):
        if "umwandlung__motion" in HAND:
            return HAND["umwandlung__motion"]
    # Digitale Bildentstehung topic-local HAND
    if "digitalbild" in c:
        for k in (f"{base}__digitalbild", f"{key}__digitalbild"):
            if k in HAND:
                return HAND[k]
    for k in (key, base):
        if k in HAND and not str(k).endswith(("__ge", "__motion", "__elektronik", "__digitalbild")):
            return HAND[k]
    return None


def tip_from_wissen(wissen: str) -> str:
    if not wissen:
        return ""
    # First clause before Bezug/bedeutet/Merke — take first sentence only
    w = wissen.split("Bezug:")[0].split("bedeutet:")[0].split("Merke:")[0]
    w = re.sub(r"\s+", " ", w).strip(" .;")
    w = w.split(".")[0].strip()
    if len(w) > 80:
        w = " ".join(w.split()[:12])
    # Avoid meta / densify crumbs
    if re.search(r"Lehrplan|Thema hilft|Gemeint ist", w, re.I):
        return ""
    if len(w.split()) < 2:
        return ""
    if not re.search(r"[a-zäöü]", w):  # all-caps / label
        return ""
    return w


def ensure_period(s: str) -> str:
    s = s.strip()
    if not s:
        return s
    if s[-1] not in ".!?":
        s += "."
    return s


def fix_casing(s: str) -> str:
    """Undo Title-Case mush mid-sentence; keep German noun caps after articles."""
    s = re.sub(r"\s+", " ", s).strip()
    # Fix classic mush patterns
    reps = [
        (r"\bSelbst Licht Aussendet\b", "selbst Licht aussendet"),
        (r"\bDirektes Licht\b", "direktes Licht"),
        (r"\bVöllig Unbeleuchteter\b", "völlig unbeleuchteter"),
        (r"\bTeilweise Beleuchteter\b", "teilweise beleuchteter"),
        (r"\bGlatte Reflektierende\b", "glatte reflektierende"),
        (r"\bAbbildendes Loch\b", "abbildendes Loch"),
        (r"\bUmgekehrtes Bild\b", "umgekehrtes Bild"),
        (r"\bWeißen Lichts\b", "weißen Lichts"),
        (r"\bAnderes Medium\b", "anderes Medium"),
        (r"\bAusgedehnter (Lichtquelle|Quelle)\b", r"ausgedehnter \1"),
        (r"\bHomogener Luft\b", "homogener Luft"),
        (r"\bBeim Übergang\b", "beim Übergang"),
        (r"\bdurch Beim\b", "beim"),
        (r"\bdurch in\b", "in"),
        (r"\bdurch bei\b", "bei"),
        (r"\bLicht geht durch durch\b", "Licht geht durch"),
        (r"\beinfallswinkel\b", "Einfallswinkel"),
        (r"\bglas,", "Glas,"),
    ]
    for a, b in reps:
        s = re.sub(a, b, s, flags=re.I)
    # Lowercase adjectives wrongly capitalized after articles when followed by noun
    s = re.sub(
        r"\b(der|die|das|ein|eine|einen|einem|einer|und|oder|als|wie|bei|mit|ohne|für|durch|über)\s+"
        r"(Selbst|Direktes|Völlig|Teilweise|Glatte|Abbildendes|Umgekehrtes|Weißen|"
        r"Anderes|Ausgedehnter|Homogener|Geradliniges|Lichtundurchlässig)\b",
        lambda m: f"{m.group(1)} {m.group(2).lower()}",
        s,
    )
    return s


def curated_core(term: str, meaning: str, concept: str = "") -> str:
    key = norm_term(term)
    # strip topic parenthetical for lookup
    base = re.sub(r"\s*\(.*$", "", key).strip()
    he = hand_entry(term, concept)
    if he and isinstance(he.get("answer"), str):
        return p6.strip_period(str(he["answer"]))
    for k in (key, base, key.split()[0] if key else ""):
        if k in p6.CURATED:
            return p6.strip_period(p6.CURATED[k])
        if k in fin.EXTRA:
            return p6.strip_period(fin.EXTRA[k])
    cur = fin.curated(term) if hasattr(fin, "curated") else None
    if cur:
        return p6.strip_period(cur)
    m = p6.strip_period(meaning or "")
    m = re.sub(r"^(Gemeint ist:?\s*)", "", m, flags=re.I)
    return m


def weave_tip(sentence: str, tip: str) -> str:
    if not tip:
        return sentence
    tip = tip.strip(" .")
    low = sentence.lower()
    # tip already present?
    tip_words = [w for w in re.split(r"[,\s]+", tip) if len(w) > 3]
    if tip_words and sum(1 for w in tip_words if w.lower() in low) >= min(2, len(tip_words)):
        return sentence
    # Avoid stacking awkward tips
    if re.search(r"zum Beispiel|etwa |wie Sonne|wobei ", low):
        return sentence
    # list-like tip
    if "," in tip or " und " in tip.lower():
        tip2 = re.sub(r",\s*([^,]+)$", r" oder \1", tip)
        return f"{sentence.rstrip('.')} , zum Beispiel {tip2}"
    # short clause tip
    if re.match(r"^(Bei|In|Mit|Durch|Als|Ohne)\b", tip, re.I):
        return f"{sentence.rstrip('.')} ({tip[0].lower() + tip[1:]})"
    if len(tip.split()) <= 6:
        return f"{sentence.rstrip('.')} — {tip}"
    return sentence


def quality_ok(prompt: str, answer: str, wrongs: list[str]) -> bool:
    blob = " ".join([prompt, answer, *wrongs])
    if (
        BANNED_OUT.search(blob)
        or BAD_ANSWER.search(answer)
        or TITLE_TIP.search(answer)
        or TITLE_AFTER_IST.search(answer)
        or TITLE_AFTER_IST_EINE.search(answer)
        or TITLE_AFTER_BESCHREIBT.search(answer)
    ):
        return False
    # Reject uniform Sie/Er/Es-ist-ein(e) answers (mechanical thin fill)
    if re.match(r"^(Sie|Er|Es) ist (eine|ein)\b", answer, re.I):
        return False
    if sum(1 for w in wrongs if re.match(r"^(Sie|Er|Es) ist (eine|ein)\b", w, re.I)) >= 2:
        return False
    if any(
        BAD_ANSWER.search(w)
        or TITLE_TIP.search(w)
        or TITLE_AFTER_IST.search(w)
        or TITLE_AFTER_IST_EINE.search(w)
        or TITLE_AFTER_BESCHREIBT.search(w)
        or BANNED_OUT.search(w)
        for w in wrongs
    ):
        return False
    if len(answer.split()) < 6 or not answer.strip().endswith((".", "!", "?")):
        return False
    if len(wrongs) < 3:
        return False
    if len({w.lower() for w in wrongs}) < len(wrongs):
        return False
    # stem must be a real question
    if not prompt.strip().endswith("?"):
        return False
    if re.search(r"\b(das Weg|die Weg|der Messung)\b", prompt):
        return False
    if re.search(r"Was bewirkt das [A-ZÄÖÜ]", prompt):
        return False
    if re.search(
        r"Das trifft auf einen anderen|verwandten Fachbegriff|anderen Vorgang mit anderer|"
        r"Sie schlangen\b|Es ist ein Bei\b|streung beachten|nachvollziehbarkeit\)",
        blob,
        re.I,
    ):
        return False
    # Fragment mush from short meanings (angry leftovers)
    if re.search(
        r"\bbeschreibt ein[e]?\s+[a-zäöü]|"  # beschreibt ein Bedarfs…
        r"\bbeschreibt eine [A-ZÄÖÜ][a-zäöüß]+ [a-zäöü]|"
        r",\s*(strom|zeit|linse|spiegel|basis|oft)\b|"
        r"\bbildpunkt digital\b|\blichtmenge auf\b",
        answer,
        re.I,
    ):
        return False
    # no Title-Case runs of 3+ mid words
    if re.search(r"\b[A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+){2,}\b", answer):
        rest = " ".join(answer.split()[1:])
        if re.search(r"\b[A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+){2,}\b", rest):
            return False
    return True


def natural_answer(term: str, meaning: str, wissen: str, concept: str = "") -> str:
    key = norm_term(term)
    base = re.sub(r"\s*\(.*$", "", key).strip()
    tip = tip_from_wissen(wissen)
    # never weave Title-Case tips
    if tip and re.search(r"[A-ZÄÖÜ].*[A-ZÄÖÜ]", tip):
        tip = tip[0].lower() + tip[1:] if tip else tip
        tip = re.sub(
            r"\b(Oft|Später|Relativ|Gerade|Zusammenhang|Handy|Smartphone)\b",
            lambda m: m.group(1).lower(),
            tip,
        )

    # Full hand answer (subject-aware)
    he = hand_entry(term, concept)
    if he and "answer" in he:
        ans = ensure_period(fix_casing(str(he["answer"])))
        if not BANNED_OUT.search(ans) and not BAD_ANSWER.search(ans) and len(ans.split()) >= 6:
            return ans

    core = curated_core(term, meaning, concept)
    # If curated_core returned a full HAND answer (with pronoun), strip for rebuild
    if core.startswith(("Sie ", "Er ", "Es ")):
        return ensure_period(fix_casing(core))
    # Noun-led curated ("Ein Überrest…") — keep as full sentence, no Sie-ist wrap
    if re.match(r"^(Ein|Eine|Der|Die|Das)\b", core):
        return ensure_period(fix_casing(core))

    core = fix_casing(core)
    pron = p6.pronoun(term)

    # Prefer verb-led always when possible — avoid mechanical "Sie ist eine…"
    if re.match(r"^Ist (ein|eine)\b", core, re.I):
        body = re.sub(r"^Ist\s+(ein|eine)\s+", "", core, flags=re.I).strip()
        if re.search(r"\b(organisiert|verbindet|beschreibt|regelt|bildet|lebt)\b", body, re.I):
            sent = body[0].upper() + body[1:] if body else core
        else:
            sent = f"{pron} gilt als {('ein ' if re.match(r'^Ist ein\b', core, re.I) else 'eine ')}{body}"
    elif re.match(r"^Ist (der|die|das)\b", core, re.I):
        sent = f"{pron} {p6.lower_first(core)}"
    elif VERB_LEAD.match(core) or (
        VERBISH.match(core) and not NOUNISH_END.search(core.split()[0] if core.split() else "")
    ):
        sent = f"{pron} {p6.lower_first(core)}"
    elif re.match(r"^(der|die|das|ein|eine)\b", core, re.I):
        sent = f"{pron} ist {core}"
    elif re.match(r"^[A-ZÄÖÜ].*\b(wird|werden|geht|lässt)\b", core):
        sent = core
    else:
        # Noun phrase: NEVER emit mechanical „Sie ist eine …“ — use verb-led forms
        body = fix_casing(core).strip()
        words = body.split()
        if words and p6.is_likely_adj(words[0]):
            words[0] = p6.lower_first(words[0])
            body = " ".join(words)
        low = body.lower()
        if re.search(
            r"\b(organ|hilfe|schicht|öffnung|gerät|werkzeug|deckel|blase|"
            r"linse|muskel|drüse|gewebe|zelle|membran|system)\b",
            low,
        ):
            # functional anatomy / device
            if body[:1].isupper() and not body.startswith(("ein ", "eine ", "der ", "die ", "das ")):
                sent = f"{pron} dient als {body}"
            else:
                sent = f"{pron} dient als {body}"
        elif re.match(r"^(Übergang|Zerlegung|Änderung|Aufnahme|Abgabe|Transport)\b", body):
            sent = f"{pron} beschreibt {p6.lower_first(body)}"
        elif re.search(r"\b(schützt|regelt|steuert|ermöglicht|verhindert|bildet|enthält|umfasst)\b", low):
            # already verbish mid-phrase — lead with pronoun + lower first if needed
            sent = f"{pron} {p6.lower_first(body)}"
        else:
            # definitional noun phrase
            if re.match(r"^(ein|eine|der|die|das)\b", body, re.I):
                sent = f"{pron} beschreibt {p6.lower_first(body)}"
            else:
                sent = f"{pron} beschreibt {body}"

    sent = fix_casing(sent)
    sent = re.sub(r"\bist eine (Körper|Bereich|Modell|Organ|Schatten|Spiegel|Filter|Weg)\b", r"ist ein \1", sent, flags=re.I)
    sent = re.sub(r"\bist ein (Lichtquelle|Reflexion|Brechung|Transparenz|Fläche|Richtung|Messung)\b", r"ist eine \1", sent, flags=re.I)
    sent = re.sub(r"\bist eine (geradliniges|völlig|teilweise|abbildendes)\b", r"ist ein \1", sent, flags=re.I)

    # Lowercase leading adjective after beschreibt/dient als
    sent = re.sub(
        r"\b(beschreibt|dient als)\s+([A-ZÄÖÜ][a-zäöüß]+(?:e|en|es|er|em)?)\b",
        lambda m: (
            f"{m.group(1)} {m.group(2).lower()}"
            if p6.is_likely_adj(m.group(2))
            or m.group(2).endswith(("e", "en", "es", "er", "em"))
            and m.group(2).lower()
            not in {
                "auge",
                "organe",
                "hilfe",
                "blase",
                "deckel",
                "linse",
                "drüse",
                "zelle",
                "haut",
            }
            else m.group(0)
        ),
        sent,
    )
    # Add indefinite article after beschreibt when missing (Hörorgan → ein Hörorgan)
    m_art = re.match(r"^(Sie|Er|Es) beschreibt ([A-ZÄÖÜ][a-zäöüß].*)$", sent)
    if m_art and not re.match(
        r"^(ein|eine|einen|einem|einer|der|die|das)\b", m_art.group(2), re.I
    ):
        head = re.sub(r"[^A-Za-zÄÖÜäöüß].*$", "", m_art.group(2).split()[0])
        art = p6.article_for_head(head, term)
        indef = {"der": "ein", "die": "eine", "das": "ein"}[art]
        sent = f"{m_art.group(1)} beschreibt {indef} {m_art.group(2)}"

    # Weave tip to reach ≥6 words and add context
    if tip and tip.lower() not in sent.lower():
        tip_l = tip[0].lower() + tip[1:] if tip else tip
        tip_l = re.sub(
            r"\b(Oft|Beim|Bei|In|Mit|Für|Zur|Zum|Wichtig|Abhängig|Anpassung)\b",
            lambda m: m.group(1).lower(),
            tip_l,
        )
        if tip_l:
            if len(sent.split()) < 8 or len(tip_l.split()) <= 6:
                if "," in tip_l and len(tip_l.split()) <= 8:
                    tip2 = re.sub(r",\s*([^,]+)$", r" oder \1", tip_l)
                    sent = f"{p6.strip_period(sent)}, etwa {tip2}"
                elif len(tip_l.split()) <= 7:
                    sent = f"{p6.strip_period(sent)} — {tip_l}"
    # Last resort: extend short answers from meaning — NEVER topic pads
    if len(sent.split()) < 6 and meaning:
        mbody = fix_casing(meaning.replace("→", "zu").strip())
        if mbody and mbody.lower() not in sent.lower():
            if VERB_LEAD.match(mbody) or VERBISH.match(mbody):
                sent = f"{pron} {p6.lower_first(mbody)}"
            else:
                sent = f"{p6.strip_period(sent)}, genauer: {p6.lower_first(mbody)}"
    if len(sent.split()) < 6:
        # Still short — leave for quality_ok / caller to skip (no pad)
        sent = ensure_period(sent)
        return sent

    sent = ensure_period(re.sub(r"\s{2,}", " ", fix_casing(sent)).replace(" — ", ", "))
    if BANNED_OUT.search(sent) or "biologischen Zusammenhang" in sent:
        sent = re.sub(r",?\s*im biologischen Zusammenhang\.?", "", sent)
        sent = re.sub(r",?\s*bei den behandelten Arten\.?", "", sent, flags=re.I)
        sent = ensure_period(sent)
    return sent


def natural_prompt(term: str, meaning: str, concept: str) -> str:
    key = norm_term(term)
    base = re.sub(r"\s*\(.*$", "", key).strip()
    he = hand_entry(term, concept)
    if he and "prompt" in he:
        return str(he["prompt"])
    disp = p6.display_term(term)
    art = p6.article_for_head(disp.split()[0], term)
    # accusative/dative helpers for stems
    art_acc = {"der": "den", "die": "die", "das": "das"}[art]
    h = int(hashlib.md5(concept.encode()).hexdigest()[:8], 16)
    core = curated_core(term, meaning, concept)
    if base == "opak":
        return "Welche Eigenschaft hat ein opaker Körper?"
    if base in {"transparent", "transluzent"}:
        return f"Welche Eigenschaft hat ein {base}er Körper?"

    stems = [
        f"Was beschreibt „{disp}“?",
        f"Woran erkennt man {art_acc} {disp}?",
        f"Welche Eigenschaft hat {art} {disp}?",
        f"Wozu dient {art} {disp}?",
        f"Was bewirkt {art} {disp}?",
        f"Mit welchen Mitteln arbeitet {art} {disp}?",
    ]
    # Prefer function stems when curated is clearly functional
    if VERB_LEAD.match(core) and re.match(
        r"^(Dient|Lässt|Wandelt|Schützt|Bildet|Steuert|Misst|Erfasst|Sendet|Wirft|Gibt)",
        core,
        re.I,
    ):
        stems = [
            f"Wozu dient {art} {disp}?",
            f"Was bewirkt {art} {disp}?",
            f"Woran erkennt man {art_acc} {disp}?",
            f"Mit welchen Mitteln wirkt {art} {disp}?",
        ]
    stem = stems[h % len(stems)]
    if re.search(r"Was bedeutet|fachlich richtig|Was trifft", stem, re.I):
        stem = f"Was beschreibt „{disp}“?"
    return stem


def sibling_answers(
    term: str,
    pairs: list[tuple[str, str, str]],
    n: int = 3,
    concept: str = "",
) -> list[str]:
    others = [(t, m, w) for t, m, w in pairs if norm_term(t) != norm_term(term)]
    # stable shuffle by term
    others = sorted(others, key=lambda x: hashlib.md5((term + x[0]).encode()).hexdigest())
    out: list[str] = []
    seen: set[str] = set()
    for t, m, w in others:
        ans = natural_answer(t, m, w, concept)
        key = ans.lower()
        if key in seen:
            continue
        if (
            BANNED_OUT.search(ans)
            or BAD_ANSWER.search(ans)
            or TITLE_AFTER_IST.search(ans)
            or TITLE_TIP.search(ans)
            or re.match(r"^(Sie|Er|Es) ist (eine|ein)\b", ans, re.I)
            or re.search(r"Pflanzenfressend|terrariumarten|≠", ans)
            or len(ans.split()) < 6
        ):
            continue
        seen.add(key)
        out.append(ans)
        if len(out) >= n:
            break
    # No meta fillers — if siblings are insufficient, caller must skip rewrite
    return out[:n]


def parse_pairs_near(text: str, fact_start: int) -> list[tuple[str, str, str]]:
    # Walk backward to nearest pairs: [
    window = text[max(0, fact_start - 8000) : fact_start + 200]
    # find last pairs: before fact
    idx = text.rfind("pairs:", 0, fact_start)
    if idx < 0:
        return []
    end = text.find("facts:", idx)
    if end < 0:
        end = fact_start
    chunk = text[idx:end]
    pairs = []
    for m in PAIR_RE.finditer(chunk):
        term = decode(m.group(2))
        meaning = decode(m.group(4))
        wissen = decode(m.group(6) or "")
        pairs.append((term, meaning, wissen))
    return pairs


def needs_rewrite(
    prompt: str,
    answer: str,
    wrongs: list[str],
    term: str = "",
    concept: str = "",
) -> bool:
    blob = " ".join([prompt, answer, *wrongs])
    if hand_entry(term, concept):
        # Always refresh HAND terms (answers + sibling distractors stay in sync)
        return True
    if "Diktatur" in blob and (concept or "").startswith("ph:"):
        return True  # leaked Geschichte Widerstand into Physik
    if MECH_ANS.search(answer) or MECH_ANS.search(blob):
        return True
    if BANNED_OUT.search(blob):
        return True
    if re.match(r"^(Sie|Er|Es) ist (eine|ein)\b", answer, re.I):
        return True
    if sum(1 for w in wrongs if re.match(r"^(Sie|Er|Es) ist (eine|ein)\b", w, re.I)) >= 2:
        return True
    if TITLE_MUSH.search(answer) or TITLE_MUSH.search(blob):
        return True
    if re.search(
        r"\b(Körper, der Selbst|eine Bereich|eine Geradliniges|eine Völlig|"
        r"Weg Pro Zeit|Festgelegtes Maβ|Dauer Eines|Durchschnitt Mehrerer)\b",
        blob,
        re.I,
    ):
        return True
    # Title-Case runs inside options
    if re.search(r"\b[A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+){2,}\b", answer):
        rest = " ".join(answer.split()[1:])
        if re.search(r"\b[A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+){1,}\b", rest):
            return True
    if re.search(r"^Was kennzeichnet ", prompt) and re.search(r"ist eine\b", blob, re.I):
        return True
    # Angry leftovers that soft gates previously allowed
    if re.search(r"bei den behandelten Arten", blob, re.I):
        return True
    if re.search(
        r"Nur Haarfarbe|Nur Zahnzahl|ohne biologischen Bezug|\bEs ist eine Nur\b",
        blob,
        re.I,
    ):
        return True
    if re.search(
        r"Es ist eine Erbgänge|Es ist eine Lebensraum diktiert|"
        r"Es beschreibt ein Zwei Membranen",
        blob,
        re.I,
    ):
        return True
    return False


def safe_write(path: Path, content: str) -> None:
    tmp = path.with_suffix(path.suffix + ".tmpwrite")
    tmp.write_text(content, encoding="utf-8", newline="\n")
    for _ in range(16):
        try:
            tmp.replace(path)
            return
        except OSError:
            time.sleep(0.25)
    path.write_text(content, encoding="utf-8", newline="\n")


def process_file(
    path: Path,
    topic: str | None,
    limit: int | None,
    dry: bool,
) -> tuple[int, int, list[dict]]:
    text = path.read_text(encoding="utf-8")
    changed = 0
    scanned = 0
    samples: list[dict] = []
    replacements: list[tuple[int, int, str]] = []

    for m in FACT_RE.finditer(text):
        full = m.group(0)
        concept = decode(m.group(2))
        prompt = decode(m.group(4))
        answer = decode(m.group(6))
        wrong_raw = m.group(7)
        flash = decode(m.group(9)) if m.group(9) else ""
        wrongs = [decode(w[1]) for w in re.findall(r"(['\"])((?:\\.|[^\\\"'])*)\1", wrong_raw)]

        if topic and topic.lower() not in concept.lower():
            continue
        # Hard-protect optics Timer/Sensor/Transparent + hand-gold digitalbild
        if "lichtverschmutzung:fact:timer" in concept or "lichtdurchlaessigkeit:fact:transparent" in concept:
            continue
        if "digitalbild:fact:" in concept:
            continue
        if concept in {
            "ph:gap:ph-k6-lb1-lichtverschmutzung:fact:timer-sensor",
            "ph:gap:ph-k6-lb1-lichtverschmutzung:fact:richtlinie",
            "ph:gap:ph-k6-lb1-lichtverschmutzung:fact:blendung",
            "ph:gap:ph-k6-lb1-lichtverschmutzung:fact:dunkelheit",
            "ph:gap:ph-k6-lb1-lichtdurchlaessigkeit:fact:transparent",
            "ph:gap:ph-k6-lb1-lichtdurchlaessigkeit:fact:transluzent",
            "ph:gap:ph-k6-lb1-lichtdurchlaessigkeit:fact:opak",
        }:
            continue

        pairs = parse_pairs_near(text, m.start())
        # densify concepts often end with :pN:f — map to pair index
        pair_idx = None
        pm = re.search(r":p(\d+)(?::f)?$", concept)
        if pm:
            pair_idx = int(pm.group(1))
        # flashFront may carry topic tags: "Kloake (k5-lb3-lurche-merkmale)"
        term = re.sub(r"\s*\([^)]*\)\s*$", "", flash).strip() if flash else ""
        meaning, wissen = "", ""
        # Prefer :fN index from concept when pairs align
        fm = re.search(r":f(\d+)$", concept)
        if fm and pairs:
            fi = int(fm.group(1))
            if 0 <= fi < len(pairs):
                term, meaning, wissen = pairs[fi]
        if pair_idx is not None and 0 <= pair_idx < len(pairs):
            term, meaning, wissen = pairs[pair_idx]
        if not term:
            term = pairs[0][0] if pairs else concept.split(":")[-1]
        if not meaning:
            base_flash = norm_term(re.sub(r"\s*\(.*$", "", term))
            for t, mm, ww in pairs:
                tb = re.sub(r"\s*\(.*$", "", norm_term(t))
                if tb == base_flash or (base_flash and tb.startswith(base_flash.split()[0])):
                    meaning, wissen = mm, ww
                    term = t
                    break
        if not meaning and pairs:
            meaning, wissen = pairs[0][1], pairs[0][2]

        scanned += 1
        if not needs_rewrite(prompt, answer, wrongs, term, concept):
            continue
        if limit is not None and changed >= limit:
            break

        new_prompt = natural_prompt(term, meaning, concept)
        new_answer = natural_answer(term, meaning, wissen, concept)
        new_wrongs = sibling_answers(term, pairs, 3, concept)
        new_wrongs = [w for w in new_wrongs if w.lower() != new_answer.lower()]
        new_wrongs = new_wrongs[:3]
        if len(new_wrongs) < 3:
            continue  # need 3 topic-local distractors; skip rather than meta-pad

        if BANNED_OUT.search(new_answer) or any(BANNED_OUT.search(w) for w in new_wrongs):
            continue
        if not quality_ok(new_prompt, new_answer, new_wrongs):
            continue
        if new_answer == answer and new_prompt == prompt and new_wrongs == wrongs:
            continue

        new_block = full
        new_block = re.sub(
            r"prompt:\s*(['\"])(?:\\.|[^\\\"'])*\1",
            f'prompt: "{esc(new_prompt)}"',
            new_block,
            count=1,
        )
        wrong_lit = ", ".join(f'"{esc(w)}"' for w in new_wrongs)
        new_block = re.sub(
            r"answer:\s*(['\"])(?:\\.|[^\\\"'])*\1\s*,\s*wrong:\s*\[[\s\S]*?\]",
            f'answer: "{esc(new_answer)}", wrong: [{wrong_lit}]',
            new_block,
            count=1,
        )

        replacements.append((m.start(), m.end(), new_block))
        changed += 1
        if len(samples) < 8:
            samples.append(
                {
                    "concept": concept,
                    "prompt": new_prompt,
                    "answer": new_answer,
                    "wrong": new_wrongs,
                    "file": path.name,
                }
            )

    if changed and not dry:
        parts: list[str] = []
        last = 0
        for start, end, block in replacements:
            parts.append(text[last:start])
            parts.append(block)
            last = end
        parts.append(text[last:])
        safe_write(path, "".join(parts))
    return scanned, changed, samples


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--topic", default=None, help="Substring match on concept id")
    ap.add_argument("--file", default=None, help="Single filename under src/curriculum")
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    files = TARGETS
    if args.file:
        files = [ROOT / "src/curriculum" / args.file]

    total_scan = total_chg = 0
    all_samples: list[dict] = []
    for path in files:
        if not path.exists():
            print("missing", path)
            continue
        sc, ch, samples = process_file(path, args.topic, args.limit, args.dry_run)
        total_scan += sc
        total_chg += ch
        all_samples.extend(samples)
        if ch:
            print(f"{path.name}: scanned={sc} changed={ch}")
        if args.limit is not None and total_chg >= args.limit:
            break

    print(f"TOTAL scanned={total_scan} changed={total_chg} dry={args.dry_run}")
    for i, s in enumerate(all_samples[:5], 1):
        print(f"\n--- sample {i} [{s['file']}] {s['concept']}")
        print("Q:", s["prompt"])
        print("A:", s["answer"])
        for w in s["wrong"]:
            print(" -", w)


if __name__ == "__main__":
    main()
