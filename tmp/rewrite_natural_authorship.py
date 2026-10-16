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
        "answer": "Sie ist eine heimische Eidechse warmer, strukturreicher Standorte und Säume.",
    },
    "waldeidechse": {
        "prompt": "Woran erkennt man die Waldeidechse?",
        "answer": "Sie ist eine kleine heimische Eidechse, die oft in Wäldern und an Waldrändern lebt.",
    },
    "mauereidechse": {
        "prompt": "Woran erkennt man die Mauereidechse?",
        "answer": "Sie ist eine wärmeliebende Eidechse sonniger Mauern, Felsen und Steine.",
    },
    "blindschleiche": {
        "prompt": "Woran erkennt man die Blindschleiche?",
        "answer": "Sie ist eine beinlose Echse ohne Gift und ohne typischen Schlangenbau.",
    },
    "ringelnatter": {
        "prompt": "Woran erkennt man die Ringelnatter?",
        "answer": "Sie ist eine ungiftige Wassernatter, die oft an Gewässern jagt.",
    },
    "kreuzotter": {
        "prompt": "Woran erkennt man die Kreuzotter?",
        "answer": "Sie ist die giftige Vipernart Mitteleuropas mit Zickzackband auf dem Rücken.",
    },
    "europäische sumpfschildkröte": {
        "prompt": "Woran erkennt man die Europäische Sumpfschildkröte?",
        "answer": "Sie ist eine seltene, geschützte heimische Schildkröte der Feuchtgebiete.",
    },
    "landschildkröte": {
        "prompt": "Woran erkennt man eine Landschildkröte?",
        "answer": "Sie ist eine panzertragende Pflanzenfresserin; wilde heimische Arten sind selten.",
    },
    "aspisviper": {
        "prompt": "Woran erkennt man die Aspisviper?",
        "answer": "Sie ist eine giftige Viper Südeuropas und bei uns nicht überall heimisch.",
    },
    "mittelwert": {
        "prompt": "Wozu dient der Mittelwert bei Messungen?",
        "answer": "Er ist der Durchschnitt mehrerer Messwerte und glättet einzelne Streuungen.",
    },
    "protokoll": {
        "prompt": "Wozu dient ein Versuchsprotokoll?",
        "answer": "Es dokumentiert Versuchsschritte und Messwerte so, dass andere den Versuch wiederholen können.",
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
}

BANNED_OUT = re.compile(
    r"ist hier:|kurz gesagt:|\bHier gilt\b|Es geht um|Fachzusammenhang|"
    r"Nachbarbegriff|prüfbaren Sachverhalt|Was bedeutet\b|Folgendes",
    re.I,
)
TITLE_MUSH = re.compile(
    r"\b(der|die|das|ein|eine|einen|einem|einer)\s+"
    r"([A-ZÄÖÜ][a-zäöüß]+)(?:\s+([A-ZÄÖÜ][a-zäöüß]+)){1,}",
)
MECH_ANS = re.compile(
    r"^(Sie|Er|Es) ist (eine|ein)\b|"
    r"\bdurch (Beim|In|Bei|Mit)\b|"
    r"\bdurch [A-ZÄÖÜ][a-zäöüß]*(?:/[a-z]+)?(?:,|\.|$)|"  # durch Kritisch / durch Oft
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
    r"[\s\S]*?flashFront:\s*(['\"])((?:\\.|[^\\\"'])*)\8\s*,\s*\n\s*\},",
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


def tip_from_wissen(wissen: str) -> str:
    if not wissen:
        return ""
    # First clause before Bezug/bedeutet/Merke
    w = wissen.split("Bezug:")[0].split("bedeutet:")[0].split("Merke:")[0]
    w = re.sub(r"\s+", " ", w).strip(" .;")
    # Drop trailing topic label crumbs
    w = re.sub(r"\.\s*$", "", w)
    if len(w) > 80:
        w = w.split(".")[0].strip()
    # Avoid meta
    if re.search(r"Lehrplan|Thema hilft|Gemeint ist", w, re.I):
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


def curated_core(term: str, meaning: str) -> str:
    key = norm_term(term)
    # strip topic parenthetical for lookup
    base = re.sub(r"\s*\(.*$", "", key).strip()
    for k in (key, base, key.split()[0] if key else ""):
        if k in HAND and isinstance(HAND[k].get("answer"), str):
            # Prefer full hand answer later; core from hand answer without period
            return p6.strip_period(HAND[k]["answer"])  # type: ignore[index]
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
    ):
        return False
    # Reject uniform Sie/Er/Es-ist-ein(e) answers (mechanical thin fill)
    if re.match(r"^(Sie|Er|Es) ist (eine|ein)\b", answer, re.I):
        return False
    if sum(1 for w in wrongs if re.match(r"^(Sie|Er|Es) ist (eine|ein)\b", w, re.I)) >= 2:
        return False
    if any(
        BAD_ANSWER.search(w) or TITLE_TIP.search(w) or TITLE_AFTER_IST.search(w) or BANNED_OUT.search(w)
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
    # no Title-Case runs of 3+ mid words
    if re.search(r"\b[A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+){2,}\b", answer):
        rest = " ".join(answer.split()[1:])
        if re.search(r"\b[A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+){2,}\b", rest):
            return False
    return True


def natural_answer(term: str, meaning: str, wissen: str) -> str:
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

    # Full hand answer
    for k in (key, base):
        if k in HAND and "answer" in HAND[k]:
            ans = ensure_period(fix_casing(str(HAND[k]["answer"])))
            if not BANNED_OUT.search(ans) and not BAD_ANSWER.search(ans) and len(ans.split()) >= 6:
                return ans

    core = curated_core(term, meaning)
    # If curated_core returned a full HAND answer (with pronoun), strip for rebuild
    if core.startswith(("Sie ", "Er ", "Es ")):
        return ensure_period(fix_casing(core))
    # Noun-led curated ("Ein Überrest…") — keep as full sentence, no Sie-ist wrap
    if re.match(r"^(Ein|Eine|Der|Die|Das)\b", core):
        return ensure_period(fix_casing(core))

    core = fix_casing(core)
    pron = p6.pronoun(term)

    # Prefer verb-led always when possible — but avoid "Sie ist ein…" from "Ist ein…"
    if re.match(r"^Ist (ein|eine)\b", core, re.I):
        # Drop mechanical Ist-ein; rebuild as bare noun clause without Sie-ist
        body = re.sub(r"^Ist\s+", "", core, flags=re.I).strip()
        sent = body[0].upper() + body[1:] if body else core
    elif VERB_LEAD.match(core) or VERBISH.match(core):
        sent = f"{pron} {p6.lower_first(core)}"
    elif re.match(r"^(der|die|das|ein|eine)\b", core, re.I):
        sent = f"{pron} ist {core}"
    elif re.match(r"^[A-ZÄÖÜ].*\b(wird|werden|geht|lässt)\b", core):
        sent = core
    else:
        # Noun phrase: prefer verb-ish curated over raw Sie-ist-eine
        # Skip rather than emit mechanical Sie-ist-eine if meaning is too thin
        body = core
        words = body.split()
        if words and p6.is_likely_adj(words[0]) and len(words) >= 2:
            noun = words[1]
        else:
            noun = words[0] if words else term
        art = p6.article_for_head(re.sub(r"[^A-Za-zÄÖÜäöüß]", "", noun), term)
        indef = {"der": "ein", "die": "eine", "das": "ein"}[art]
        if words and p6.is_likely_adj(words[0]):
            words[0] = p6.lower_first(words[0])
            body = " ".join(words)
        # Still allow as last resort, but quality_ok / MECH gate may reject
        sent = f"{pron} ist {indef} {body}"

    sent = fix_casing(sent)
    sent = re.sub(r"\bist eine (Körper|Bereich|Modell|Organ|Schatten|Spiegel|Filter|Weg)\b", r"ist ein \1", sent, flags=re.I)
    sent = re.sub(r"\bist ein (Lichtquelle|Reflexion|Brechung|Transparenz|Fläche|Richtung|Messung)\b", r"ist eine \1", sent, flags=re.I)
    sent = re.sub(r"\bist eine (geradliniges|völlig|teilweise|abbildendes)\b", r"ist ein \1", sent, flags=re.I)

    # Weave tip only if clean lowercase-ish and short
    if tip and len(sent.split()) < 14 and not re.search(r"[A-ZÄÖÜ].*[A-ZÄÖÜ]", tip):
        tip_l = tip[0].lower() + tip[1:] if tip else tip
        if tip_l and tip_l.lower() not in sent.lower():
            if "," in tip_l:
                tip2 = re.sub(r",\s*([^,]+)$", r" oder \1", tip_l)
                sent = f"{p6.strip_period(sent)}, zum Beispiel {tip2}"
            elif len(tip_l.split()) <= 5:
                sent = f"{p6.strip_period(sent)} ({tip_l})"

    sent = ensure_period(re.sub(r"\s{2,}", " ", fix_casing(sent)).replace(" — ", ", "))
    return sent


def natural_prompt(term: str, meaning: str, concept: str) -> str:
    key = norm_term(term)
    base = re.sub(r"\s*\(.*$", "", key).strip()
    for k in (key, base):
        if k in HAND and "prompt" in HAND[k]:
            return str(HAND[k]["prompt"])
    disp = p6.display_term(term)
    art = p6.article_for_head(disp.split()[0], term)
    # accusative/dative helpers for stems
    art_acc = {"der": "den", "die": "die", "das": "das"}[art]
    h = int(hashlib.md5(concept.encode()).hexdigest()[:8], 16)
    core = curated_core(term, meaning)
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
) -> list[str]:
    others = [(t, m, w) for t, m, w in pairs if norm_term(t) != norm_term(term)]
    # stable shuffle by term
    others = sorted(others, key=lambda x: hashlib.md5((term + x[0]).encode()).hexdigest())
    out: list[str] = []
    seen: set[str] = set()
    for t, m, w in others:
        ans = natural_answer(t, m, w)
        key = ans.lower()
        if key in seen:
            continue
        if (
            BANNED_OUT.search(ans)
            or BAD_ANSWER.search(ans)
            or TITLE_AFTER_IST.search(ans)
            or TITLE_TIP.search(ans)
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


def needs_rewrite(prompt: str, answer: str, wrongs: list[str], term: str = "") -> bool:
    blob = " ".join([prompt, answer, *wrongs])
    key = norm_term(term) if term else ""
    base = re.sub(r"\s*\(.*$", "", key).strip()
    if key in HAND or base in HAND:
        # Always refresh HAND terms (answers + sibling distractors stay in sync)
        return True
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
        flash = decode(m.group(9))
        wrongs = [decode(w[1]) for w in re.findall(r"(['\"])((?:\\.|[^\\\"'])*)\1", wrong_raw)]

        if topic and topic.lower() not in concept.lower():
            continue
        # Hard-protect optics Timer/Sensor/Transparent only
        if "lichtverschmutzung:fact:timer" in concept or "lichtdurchlaessigkeit:fact:transparent" in concept:
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
        term = flash or (pairs[0][0] if pairs else concept.split(":")[-1])
        meaning, wissen = "", ""
        for t, mm, ww in pairs:
            if norm_term(t) == norm_term(term) or (
                norm_term(term) and norm_term(t).startswith(norm_term(term).split()[0])
            ):
                meaning, wissen = mm, ww
                term = t
                break
        if not meaning and pairs:
            meaning, wissen = pairs[0][1], pairs[0][2]

        scanned += 1
        if not needs_rewrite(prompt, answer, wrongs, term):
            continue
        if limit is not None and changed >= limit:
            break

        new_prompt = natural_prompt(term, meaning, concept)
        new_answer = natural_answer(term, meaning, wissen)
        new_wrongs = sibling_answers(term, pairs, 3)
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
