# -*- coding: utf-8 -*-
"""
Pass 6: enrich locked fill bank meanings/answers at source.

Goal: natural full German MC options (Timer/Transparent caliber).
Kill „Gemeint ist:“ monotony in meaning / answer / wrong / wissen.
Does NOT touch released curated packs (physik6.ts, biologie5.ts, …).
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

TARGETS = [
    ROOT / "src/curriculum/physikLehrplanGapsFill.ts",
    ROOT / "src/curriculum/physikThinFill.ts",
    ROOT / "src/curriculum/physikOsDensityFill.ts",
    ROOT / "src/curriculum/biologieLehrplanGapsFill.ts",
    ROOT / "src/curriculum/biologieThinFill.ts",
    ROOT / "src/curriculum/biologieOsDensityFill.ts",
    ROOT / "src/curriculum/biologieOsGapsFill.ts",
    ROOT / "src/curriculum/geschichteThinFill.ts",
    ROOT / "src/curriculum/geschichteDichteFillPass1.ts",
]

# Hand-authored Timer/Transparent/Kieme/Quelle caliber — never overwrite.
GOLD: dict[str, dict[str, object]] = {
    "ph:gap:ph-k6-lb1-lichtverschmutzung:fact:timer-sensor": {
        "prompt": "Wozu dienen Timer oder Sensoren bei intelligenter Beleuchtung gegen Lichtverschmutzung?",
        "answer": "Sie schalten Beleuchtung nur bei Bedarf ein und vermeiden Dauerleuchten.",
        "wrong": [
            "Sie legen verbindliche Beleuchtungsrichtlinien für Kommunen fest.",
            "Sie erzeugen absichtlich Blendung im Straßenverkehr.",
            "Sie ersetzen Abschirmung, indem sie Licht in den Himmel lenken.",
        ],
        "meaning": "Schaltet Beleuchtung nur bei Bedarf ein und vermeidet Dauerleuchten",
    },
    "ph:gap:ph-k6-lb1-lichtdurchlaessigkeit:fact:transparent": {
        "prompt": "Welche Eigenschaft hat ein transparenter Körper?",
        "answer": "Er lässt Licht klar durch, sodass man Gegenstände dahinter scharf erkennen kann.",
        "wrong": [
            "Er lässt Licht nur diffus gestreut durch, sodass kein scharfes Bild entsteht.",
            "Er lässt kein Licht durch und wirft einen deutlichen Schatten.",
            "Er nimmt Licht vollständig auf und erwärmt sich, ohne etwas durchzulassen.",
        ],
        "meaning": "Lässt Licht klar durch, sodass Gegenstände dahinter scharf erkennbar sind",
    },
    "ge:fill:ge-k5-lb1-quellen:f0": {
        "prompt": "Was versteht man in der Geschichtswissenschaft unter einer Quelle?",
        "answer": "Sie gibt als Überrest oder Tradition Auskunft über die Vergangenheit.",
        "wrong": [
            "Sie ordnet Ereignisse in ihre zeitliche Reihenfolge ein.",
            "Sie fasst einen geschichtlichen Zeitraum mit typischen gemeinsamen Merkmalen zusammen.",
            "Sie beschreibt, wer politische Macht ausübt und Entscheidungen trifft.",
        ],
        "meaning": "Gibt als Überrest oder Tradition Auskunft über die Vergangenheit",
    },
    "bio:fill:k5:lb2:fische:f0": {
        "prompt": "Wozu dient die Kieme bei Fischen?",
        "answer": "Sie entzieht dem Wasser Sauerstoff und dient der Atmung.",
        "wrong": [
            "Sie steuert vor allem die Fortbewegung wie eine Flosse.",
            "Sie bildet die äußere Schutzschicht aus Schuppen.",
            "Sie misst vor allem Druckwellen wie die Seitenlinie.",
        ],
        "meaning": "Entzieht dem Wasser Sauerstoff und dient der Atmung",
    },
    "bio:k6:atmverg:f0": {
        "prompt": "Wozu dient die Kieme im Thema Atmungsvergleich?",
        "answer": "Sie ist das Atemorgan, mit dem Sauerstoff aus dem Wasser aufgenommen wird.",
        "wrong": [
            "Sie ist das Atemorgan für den Gasaustausch in der Luft.",
            "Sie ist das Luftröhrensystem der Insekten.",
            "Sie ist der Gasaustausch allein über die Körperoberfläche.",
        ],
        "meaning": "Atemorgan, mit dem Sauerstoff aus dem Wasser aufgenommen wird",
    },
}

# High-frequency term → full natural meaning sentence (without trailing period).
CURATED: dict[str, str] = {
    "kieme": "Entzieht dem Wasser Sauerstoff und dient der Atmung",
    "flosse": "Steuert und treibt den Fischkörper im Wasser voran",
    "schuppe": "Bildet die äußere Schutzschicht auf der Haut",
    "seitenlinie": "Erfasst Druckwellen und Bewegungen im Wasser",
    "schwimmblase": "Reguliert den Auftrieb vieler Knochenfische",
    "kiemendeckel": "Schützt die Kiemen und steuert den Wasserstrom",
    "lichtquelle": "Ist ein Körper, der selbst Licht aussendet",
    "lichtstrahl": "Beschreibt das geradlinige Modell der Lichtausbreitung",
    "schatten": "Ist der Bereich ohne direktes Licht hinter einem Körper",
    "kernschatten": "Ist der völlig unbeleuchtete Kernbereich eines Schattens",
    "halbschatten": "Ist der teilweise beleuchtete Randbereich eines Schattens",
    "reflexion": "Wirft Licht an einer Fläche zurück",
    "brechung": "Ändert die Richtung des Lichts an einer Grenzfläche",
    "spiegel": "Ist eine glatte Fläche, die Licht geordnet zurückwirft",
    "transparenz": "Lässt Licht so durch, dass man hindurchsehen kann",
    "opak": "Lässt kein Licht durch und wirft einen deutlichen Schatten",
    "transparent": "Lässt Licht klar durch, sodass Gegenstände dahinter scharf erkennbar sind",
    "transluzent": "Lässt Licht nur diffus gestreut durch, ohne scharfes Bild",
    "lehnswesen": "Verbindet den Treueeid des Vasallen mit der Leihe von Land",
    "grundherrschaft": "Beschreibt die Herrschaft über Bauernland mit Abgaben und Diensten",
    "stadtrecht": "Gewährt einer Kommune Freiheiten wie Markt und eigene Gerichtsbarkeit",
    "zunft": "Organisiert Handwerker eines Berufs und regelt Qualität sowie Marktschutz",
    "hanse": "Ist ein Städtebund, der den Fernhandel an Nord- und Ostsee organisiert",
    "ostsiedlung": "Bezeichnet die mittelalterliche Expansion und Kolonisation nach Osten",
    "papsttum": "Bildet die geistliche Spitze der lateinischen Kirche mit politischer Macht",
    "kloster": "Vereint Gebet, Arbeit und Wissenspflege als geistliches Zentrum",
    "frondienst": "Ist die Arbeitsleistung unfreier Bauern für den Grundherrn",
    "zehnten": "Ist die Abgabe an die Kirche, oft ein Zehntel der Erträge",
    "chronologie": "Beschreibt die zeitliche Ordnung von Ereignissen",
    "quelle": "Ist ein Überrest oder eine Tradition zur Vergangenheit",
    "epoche": "Ist ein geschichtlicher Zeitraum mit typischen Merkmalen",
    "absolutismus": "Bedeutet unumschränkte Fürstenmacht über Staat und Untertanen",
    "aufklärung": "Stellt Vernunft und Kritik als Leitideen der Gesellschaft in den Mittelpunkt",
    "reformation": "Bezeichnet die Kirchenspaltung und Erneuerung im 16. Jahrhundert",
    "industrialisierung": "Prägt Wirtschaft und Gesellschaft durch Maschinen, Fabrik und Kapital",
    "gewaltenteilung": "Teilt staatliche Macht in Legislative, Exekutive und Judikative",
    "volkssouveränität": "Leitet Herrschaft aus der Zustimmung des Volkes ab",
    "nationalismus": "Sieht die Nation als zentrale politische Einheit",
    "imperialismus": "Strebt die globale Machtausdehnung von Staaten an",
    "merkantilismus": "Lenkt die Wirtschaft staatlich zugunsten von Handelsüberschüssen",
    "fotosynthese": "Wandelt Lichtenergie in chemische Energie in Form von Glucose um",
    "glykolyse": "Spaltet Glucose zu Pyruvat und liefert ATP im Cytoplasma",
    "redoxreaktion": "Überträgt Elektronen zwischen Stoffen im Stoffwechsel",
    "calvin-zyklus": "Fixiert CO2 im Stroma und baut Zucker auf",
    "atmung": "Gewinnt Energie, indem sie organische Stoffe oxidiert",
    "diffusion": "Ist der Konzentrationsausgleich durch ungeordnete Teilchenbewegung",
    "osmose": "Ist die Diffusion von Wasser durch eine semipermeable Membran",
}

FEM = re.compile(
    r"(ung|heit|keit|schaft|ion|tät|ik|enz|anz|ur|treue|freiheit|ordnung|hilfe|form|schicht|blase|linse)$",
    re.I,
)
NEUT = re.compile(
    r"(chen|lein|ment|tum|um|organ|system|modell|recht|wesen|maß|licht|gas)$", re.I
)
MASC = re.compile(
    r"(er|en|el|körper|bereich|schatten|spiegel|filter|sensor|pixel|bund)$", re.I
)
PURPOSE = re.compile(
    r"^(Schaltet|Dient|Dienen|Vermeidet|Ermöglicht|Regelt|Steuert|Misst|Schützt|Hilft|"
    r"Unterstützt|Begrenzt|Verhindert|Reduziert|Erhöht|Verringert|Speichert|Überträgt|"
    r"Entzieht|Nimmt|Bewegt|Reguliert|Verbindet|Gewährt|Organisiert|Bildet|Vereint|"
    r"Prägt|Teilt|Leitet|Strebt|Lenkt|Wandelt|Spaltet|Fixiert|Gewinnt|"
    r"Erfasst|Ändert|Wirft|Lässt|Ist|Sind|Beschreibt|Bezeichnet|Bedeutet|Stellt|"
    r"Meint|Vergleicht|Gibt|Tritt|Sieht|Leitet|Wandelt|Erzeugt|Bildet)\b",
    re.I,
)
EFFECT = re.compile(
    r"^(Stört|Entsteht|Wird|Werden|Lässt|Lassen|Sendet|Wirft|Nimmt|Geht|Liegt|Steht|"
    r"Bildet|Zeigt|Enthält|Umfasst|Kennzeichnet|Bezeichnet|Beschreibt|Bedeutet|Gilt|"
    r"Lenkt|Hat|Haben|Ist|Sind|Ändert|Hängt|Folgt|Treibt|Wandelt|Abbildet|Fungiert|"
    r"Organisiert|Fasst|Verbindet|Gewährt|Prägt|Stellt|Meint|Vergleicht|Gibt|Tritt|"
    r"Sieht|Erzeugt|Löst)\b",
    re.I,
)
PROPERTY_TERM = re.compile(r"^(Transparent|Transluzent|Opak)$", re.I)
VERBISH = re.compile(
    r"\b(ist|sind|hat|haben|wird|werden|lässt|lassen|dient|dienen|beschreibt|"
    r"bezeichnet|steht|meint|handelt|verbindet|regelt|steuert|misst|schützt|"
    r"entzieht|sendet|wirft|bildet|zeigt|enthält|umfasst|kennzeichnet|bedeutet|"
    r"gilt|lenkt|ändert|hängt|folgt|treibt|wandelt|abbildet|schaltet|vermeidet|"
    r"ermöglicht|nimmt|bewegt|reguliert|entsteht|geht|liegt|stört|fungiert|"
    r"organisiert|fasst|gewährt|prägt|teilt|leitet|strebt|wandelt|spaltet|"
    r"überträgt|fixiert|gewinnt|erfasst|vereint)\b",
    re.I,
)
PREPS = {
    "zu", "zur", "zum", "von", "vom", "für", "im", "in", "am", "an", "auf", "bei",
    "vs", "oder", "und", "der", "die", "das", "den", "dem", "des", "ein", "eine",
    "einen", "einem", "einer", "mit", "ohne", "nach", "gegen", "über", "unter",
    "aus", "als", "bis", "um", "durch", "vor", "seit",
}
FORCE_LOWER = {
    "selbst", "vollständig", "immer", "nur", "nie", "sich", "vor", "allem",
    "anderen", "typischen", "politische", "zeitliche", "geistliche", "völlig",
    "direktes", "unbeleuchteter", "bedrohter", "geeigneter", "heimische",
    "warmer", "feuchter", "geschichtlichen", "aussendet", "ernährt", "verbessert",
    "nutzen", "meiden", "sind", "betroffen", "folgt",
    "man", "manchen", "manche", "etwas", "nichts", "niemand", "jemand",
}
GI = re.compile(r"^Gemeint ist:?\s*|^Gemeint sind:?\s*", re.I)


def display_term(term: str) -> str:
    t = re.sub(r"\s*\([^)]*\)\s*$", "", term).strip()
    return t.replace("/", " oder ")


def pronoun(term: str) -> str:
    t = display_term(term)
    low = t.lower()
    if " oder " in t:
        return "Sie"
    if low in {"transparent", "transluzent", "opak"}:
        return "Er"
    if NEUT.search(low) or low in {"licht", "gas", "eis", "pixel"}:
        return "Es"
    if FEM.search(low) or re.search(r"e$", low):
        return "Sie"
    if re.search(r"(er|or|ismus|us|ling)$", low):
        return "Er"
    return "Es"


def lower_first(s: str) -> str:
    return s[:1].lower() + s[1:] if s else s


def soften(body: str) -> str:
    words = re.sub(r"\s+", " ", body).strip().split(" ")
    out = []
    for i, w in enumerate(words):
        if i == 0:
            out.append(w)
            continue
        prev = re.sub(r"[^a-zäöüß]", "", words[i - 1], flags=re.I).lower()
        if prev not in PREPS and prev not in {
            "ein", "eine", "einen", "einem", "einer", "der", "die", "das", "den", "dem", "des",
        }:
            out.append(w)
            continue
        bare = re.sub(r"[^a-zäöüßA-ZÄÖÜ]", "", w)
        if bare.lower() in FORCE_LOWER:
            out.append(lower_first(w))
            continue
        nxt = words[i + 1] if i + 1 < len(words) else ""
        if nxt and re.match(r"^[A-ZÄÖÜ]", nxt) and re.search(
            r"(e|er|es|en|em|iges|liches|isches)$", bare, re.I
        ):
            out.append(lower_first(w))
            continue
        if prev in {"der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer"} and re.match(
            r"^[a-zäöü]", bare
        ) and len(bare) > 2:
            out.append(bare[:1].upper() + bare[1:] + w[len(bare) :])
            continue
        out.append(w)
    return " ".join(out)


def core_meaning(text: str) -> str:
    o = re.sub(r"\s+", " ", text).strip().rstrip(".")
    # Peel wrappers repeatedly (prevents „Sie beschreibt die Sie kennzeichnet …“)
    for _ in range(4):
        prev = o
        o = re.sub(r"^Darunter versteht man\s+", "", o, flags=re.I)
        o = GI.sub("", o)
        o = re.sub(r"^(Das ist|Das sind|Es handelt sich um)\s+", "", o, flags=re.I)
        o = re.sub(r"^(Sie|Er|Es)\s+dient dazu:\s*", "", o, flags=re.I)
        o = re.sub(
            r"^(Sie|Er|Es)\s+(bezeichnet|ist|sind|beschreibt|steht für|fungiert als|dient als|kennzeichnet|meint|umfasst|bildet|gewährt|verbindet|stellt)\s+",
            "",
            o,
            flags=re.I,
        )
        o = re.sub(r"^(den|die|das|dem|des|der|ein|eine|einen|einem|einer)\s+", "", o, flags=re.I)
        # Drop duplicated pronoun mid-phrase
        o = re.sub(r"\b(Sie|Er|Es)\s+(kennzeichnet|beschreibt|bezeichnet|steht)\b", "", o, flags=re.I)
        o = re.sub(r"\s+", " ", o).strip()
        if o == prev:
            break
    return soften(o).strip()


def is_likely_adj(word: str) -> bool:
    return bool(
        re.search(r"(ig|lich|isch|iv|al|är|os|bar|sam)(e|er|es|en|em)?$", word, re.I)
        or re.match(
            r"^(geradliniges|teilweise|völlig|äußere|widerstandsarme|zeitliche|politische|geistliche)$",
            word,
            re.I,
        )
    )


def article_for_head(head: str, term: str) -> str:
    low = head.lower()
    if FEM.search(low) or (low.endswith("e") and len(low) > 3 and not low.endswith(("ee", "ie"))):
        return "die"
    if NEUT.search(low):
        return "das"
    if MASC.search(low):
        return "der"
    p = pronoun(term)
    return {"Sie": "die", "Er": "der"}.get(p, "das")


def with_nom_np(body: str, term: str) -> str:
    b = soften(body).rstrip(".").strip()
    if not b:
        return b
    if re.match(r"^(der|die|das|ein|eine)\s+", b, re.I):
        return re.sub(r"^den\s+", "der ", b, flags=re.I)
    if re.match(
        r"^(maßnahmen|freiheiten|urkunden|abgaben|register|schuppen|flossen)\b", b, re.I
    ):
        head, *rest = b.split(" ", 1)
        head = head[:1].upper() + head[1:]
        return head if not rest else f"{head} {rest[0]}"
    words = b.split()
    head = words[0]
    if is_likely_adj(head) and len(words) >= 2:
        noun = words[1]
        art = article_for_head(noun, term)
        adj = lower_first(head)
        if art in {"das", "ein"} and adj.endswith("es"):
            adj = adj[:-2] + "e"
        if art in {"die", "eine"} and adj.endswith("es"):
            adj = adj[:-2] + "e"
        return f"{art} {adj} {' '.join(words[1:])}"
    art = article_for_head(head, term)
    return f"{art} {b}"


def to_acc(np: str) -> str:
    np = re.sub(r"^der\s+", "den ", np, flags=re.I)
    np = re.sub(r"^ein\s+(?![aeiouäöü])", "einen ", np, flags=re.I)
    np = re.sub(
        r"\b(den|einen)\s+(\w+?)er\s+",
        lambda m: f"{m.group(1)} {m.group(2)}en ",
        np,
        count=1,
        flags=re.I,
    )
    return np


def for_steht_fuer(np: str) -> str:
    np = np.strip()
    if re.match(r"^der\s+", np, re.I):
        return to_acc(np)
    return np


def hash_pick(seed: str, n: int) -> int:
    h = 0
    for ch in seed:
        h = (h * 31 + ord(ch)) & 0x7FFFFFFF
    return h % n


def ensure_period(s: str) -> str:
    s = s.strip()
    return s if not s or s[-1] in ".!?" else s + "."


def strip_period(s: str) -> str:
    return s.strip().rstrip(".!?")


def is_full_sentence(s: str) -> bool:
    o = re.sub(r"\s+", " ", s).strip()
    if GI.search(o) or re.match(r"^Darunter versteht man\b", o, re.I):
        return False
    words = o.split()
    return len(words) >= 8 and bool(VERBISH.search(o))


def wissen_lead(wissen: str, term: str) -> str | None:
    if not wissen:
        return None
    t = display_term(term)
    parts = re.split(r"\.\s*", wissen)
    for p in parts:
        p = p.strip()
        if not p:
            continue
        if re.search(rf"{re.escape(term)}\s+bedeutet|{re.escape(t)}\s+bedeutet", p, re.I):
            continue
        if re.match(r"^(Merke|Bezug|z\.?\s*B\.?)\b", p, re.I):
            continue
        if len(p.split()) >= 3 and not re.match(r"^[a-zäöü]{1,12}$", p):
            return p
    return None


def classify(term: str, meaning: str, topic: str | None) -> str:
    t = display_term(term)
    m = core_meaning(meaning)
    ctx = f"{topic or ''} {t}"
    if PROPERTY_TERM.match(t) or (
        re.search(r"lichtdurch|optik", ctx, re.I) and re.search(r"lässt|durch", m, re.I)
    ):
        return "property"
    if PURPOSE.search(m):
        return "purpose"
    if re.search(
        r"organ|gerät|mittel|hilfe|sensor|timer|deckel|blase|werkzeug|schutzschicht",
        t,
        re.I,
    ) or re.search(r"organ|gerät|mittel|hilfe|schützt|steuert|misst|entzieht", m, re.I):
        return "purpose"
    if EFFECT.search(m) or re.match(r"^(Licht|Wärme|Energie)\b", m):
        return "process"
    return "definition"


def enrich_meaning(term: str, meaning: str, wissen: str = "") -> str:
    """Full natural meaning sentence without trailing period (stored in pair.meaning)."""
    t = display_term(term)
    key = t.lower()
    if key in CURATED:
        return CURATED[key]
    # Strip topic slug noise in term keys like "Lochkamera (lampenposition)"
    bare_key = re.sub(r"\s*\([^)]*\)\s*$", "", key).strip()
    if bare_key in CURATED:
        return CURATED[bare_key]

    core = core_meaning(meaning)
    if not core:
        return f"Beschreibt einen zentralen Sachverhalt zu {t}"

    if is_full_sentence(core):
        return strip_period(core)

    if PURPOSE.search(core) or EFFECT.search(core):
        # Already verb-led fragment → keep as predicate body
        return strip_period(core[0].upper() + core[1:] if core else core)

    lead = wissen_lead(wissen, term)
    pron_body = None
    if lead:
        lead_c = core_meaning(lead) if GI.search(lead) else lead
        # Verb-first lead without subject: „Entzieht dem Wasser Sauerstoff“
        if PURPOSE.search(lead_c) or EFFECT.search(lead_c):
            pron_body = strip_period(lead_c[0].upper() + lead_c[1:])
        elif re.match(
            r"^(Erfasst|Reguliert|Bewegt|Bildet|Organisiert|Verbindet|Gewährt|Lenkt|Wandelt)\b",
            lead_c,
            re.I,
        ):
            pron_body = strip_period(lead_c[0].upper() + lead_c[1:])

    # Relative-clause style NP: „Körper der selbst Licht aussendet“
    if re.search(r"\b(der|die|das)\s+\S+", core) and len(core.split()) >= 4:
        np = with_nom_np(core, term)
        return strip_period(f"Ist {np}")

    # Arrow / formula stubs: „Licht → chemische Energie“
    if "→" in core or "->" in core or "\u2192" in core:
        return strip_period(f"Beschreibt den Vorgang {core}")

    # Organ / device nouns
    if re.search(r"organ|hilfe|mittel|gerät|schicht|blase|deckel|sensor|filter", core, re.I):
        if pron_body:
            return strip_period(f"{pron_body} und dient als {core_meaning(core)}")
        return strip_period(f"Dient als {core_meaning(core)}")

    # Short process-ish with lead
    if pron_body:
        np = with_nom_np(core, term)
        return strip_period(f"{pron_body}; es handelt sich um {np}")

    # Comma lists
    if "," in core and len(core.split()) <= 8:
        parts = [p.strip() for p in core.split(",") if p.strip()]
        parts = [p[:1].upper() + p[1:] for p in parts]
        if len(parts) >= 3:
            joined = f"{', '.join(parts[:-1])} und {parts[-1]}"
        else:
            joined = " und ".join(parts)
        return strip_period(f"Umfasst {joined}")

    # Date stubs
    if re.match(r"^ab\s+\d{3,4}\b", core, re.I) or re.match(r"^\d{3,4}$", core):
        return strip_period(f"Bezeichnet die historische Entwicklung {core}")

    np = with_nom_np(core, term)
    pick = hash_pick(f"{t}|{np}|enrich", 4)
    if pick == 0:
        return strip_period(f"Beschreibt {to_acc(np)}")
    if pick == 1:
        return strip_period(f"Steht für {for_steht_fuer(np)}")
    if pick == 2:
        # Prefer relative / full NP without bare „Ist …“ storage that later double-wraps
        return strip_period(f"Bezeichnet {to_acc(np)}")
    return strip_period(f"Kennzeichnet {to_acc(np)}")


def looks_verb_led(s: str) -> bool:
    s = strip_period(s).strip()
    if PURPOSE.search(s) or EFFECT.search(s):
        return True
    # Capitalized finite verb at start (German MC predicate)
    return bool(
        re.match(
            r"^(Stellt|Meint|Vergleicht|Gibt|Tritt|Sieht|Erzeugt|Löst|Bildet|Regelt|"
            r"Steuert|Misst|Schützt|Entzieht|Verbindet|Gewährt|Organisiert|Prägt|"
            r"Wandelt|Spaltet|Fixiert|Gewinnt|Erfasst|Ändert|Wirft|Lässt|Beschreibt|"
            r"Bezeichnet|Bedeutet|Kennzeichnet|Umfasst|Enthält|Folgt|Treibt|Hängt)\b",
            s,
        )
    )


def option_from_meaning(term: str, meaning: str, style: str) -> str:
    """Parallel full MC option sentence from enriched meaning."""
    m = strip_period(meaning)
    if not m:
        return ensure_period(f"{pronoun(term)} beschreibt einen verwandten Sachverhalt")
    # Strip accidental wrapper leftovers before classifying
    m = GI.sub("", m).strip()
    m = re.sub(r"^(Es handelt sich um|Das ist|Das sind)\s+", "", m, flags=re.I).strip()
    if is_full_sentence(m) and not GI.search(m):
        # Ensure third-person option form
        if re.match(r"^(Sie|Er|Es|Man|Das|Die|Der|Licht|Wärme|Energie|Ein|Eine|Es handelt)\b", m, re.I):
            return ensure_period(m)
        if looks_verb_led(m):
            return ensure_period(f"{pronoun(term)} {lower_first(m)}")
        return ensure_period(m)

    pron = pronoun(term)
    t = display_term(term)
    core = core_meaning(m)

    if looks_verb_led(m) or looks_verb_led(core):
        body = m if looks_verb_led(m) else core
        return ensure_period(f"{pron} {lower_first(body)}")

    if style == "property":
        return ensure_period(f"{pron} {lower_first(core)}")

    if style == "process" and re.match(
        r"^(Licht|Wärme|Energie|Der|Die|Das|Ein|Eine|Es|Man)\b", core
    ):
        return ensure_period(core[0].upper() + core[1:])

    if style == "purpose" and re.search(
        r"organ|hilfe|mittel|gerät|deckel|blase|schicht", core, re.I
    ):
        pick = hash_pick(f"{term}|{core}|purpose", 3)
        if pick == 0:
            return ensure_period(f"{pron} dient als {core_meaning(core)}")
        if pick == 1:
            return ensure_period(f"Das ist {with_nom_np(core, term)}")
        return ensure_period(f"Es handelt sich um {with_nom_np(core, term)}")

    if "," in core and len(core.split()) <= 8:
        parts = [p.strip() for p in core.split(",") if p.strip()]
        parts = [p[:1].upper() + p[1:] for p in parts]
        joined = (
            f"{', '.join(parts[:-1])} und {parts[-1]}"
            if len(parts) >= 3
            else " und ".join(parts)
        )
        return ensure_period(f"{pron} umfasst {joined}")

    if re.match(r"^ab\s+\d{3,4}\b", core, re.I) or re.match(r"^\d{3,4}$", core):
        return ensure_period(f"{t} meint die Entwicklung {core}")

    np = with_nom_np(core, term)
    if not np:
        return ensure_period(f"{pron} beschreibt einen verwandten Sachverhalt")

    if not re.match(r"^(der|die|das|ein|eine)\s+", np, re.I):
        if re.match(r"^[a-zäöü]", np):
            np = np[:1].upper() + np[1:]
        return ensure_period(
            f"Es handelt sich um {np}" if hash_pick(f"{term}|{np}", 2) == 0 else f"Das sind {np}"
        )

    pick = hash_pick(f"{term}|{np}|opt", 4)
    if pick == 0:
        return ensure_period(f"Es handelt sich um {np}")
    if pick == 1:
        return ensure_period(f"Das ist {np}")
    if pick == 2:
        return ensure_period(f"{pron} beschreibt {to_acc(np)}")
    return ensure_period(f"{pron} steht für {for_steht_fuer(np)}")


def concrete_stem(term: str, topic: str | None, meaning: str, style: str) -> str:
    t = display_term(term)
    topic_clean = None
    if topic:
        tc = re.sub(r"\s+", " ", topic).strip()
        if not re.match(r"^(ph|bio|ge|ma)[\s:_-]", tc, re.I) and not re.search(
            r"\bk\d+\b|\blb\d+", tc, re.I
        ):
            if tc.lower() != t.lower():
                topic_clean = tc
    low = t.lower()
    m = core_meaning(meaning)

    if style == "purpose":
        if low == "kieme":
            return (
                f"Wozu dient die Kieme im Thema {topic_clean}?"
                if topic_clean
                else "Wozu dient die Kieme bei Wassertieren?"
            )
        if " oder " in t:
            base = f"Wozu dienen {t}"
        elif FEM.search(low) or low.endswith("e"):
            base = f"Wozu dient die {t}"
        else:
            base = f"Wozu dient {t}"
        return f"{base} im Thema {topic_clean}?" if topic_clean else f"{base}?"

    if style == "property":
        if low == "transparent":
            return "Welche Eigenschaft hat ein transparenter Körper?"
        if low == "transluzent":
            return "Welche Eigenschaft hat ein transluzenter Körper?"
        if low == "opak":
            return "Welche Eigenschaft hat ein opaker Körper?"
        return f"Welche Eigenschaft hat {t}?"

    if style == "process":
        if re.search(r"stört|blend", m, re.I) or "blend" in low:
            return (
                f"Woran erkennt man {t} im Thema {topic_clean}?"
                if topic_clean
                else f"Woran erkennt man {t}?"
            )
        return (
            f"Was bewirkt {t} im Thema {topic_clean}?"
            if topic_clean
            else f"Was bewirkt {t}?"
        )

    if low == "quelle":
        return "Was versteht man in der Geschichtswissenschaft unter einer Quelle?"
    if re.search(r"ordnung|chronologie|zeit|epoche|schicht|struktur|system", f"{t} {m}", re.I):
        return (
            f"Was kennzeichnet {t} im Thema {topic_clean}?"
            if topic_clean
            else f"Was kennzeichnet {t}?"
        )
    if re.search(
        r"rolle|funktion|aufgabe|zweck|macht|herrschaft|recht|bund|wesen", f"{t} {m}", re.I
    ):
        return (
            f"Welche Rolle hat {t} im Thema {topic_clean}?"
            if topic_clean
            else f"Welche Rolle hat {t}?"
        )
    pick = hash_pick(f"{t}|{m}", 3)
    if pick == 0:
        base = f"Woran erkennt man {t}"
    elif pick == 1:
        base = f"Was beschreibt {t}"
    else:
        base = f"Was kennzeichnet {t}"
    return f"{base} im Thema {topic_clean}?" if topic_clean else f"{base}?"


def extract_topic(*texts: str) -> str | None:
    for text in texts:
        if not text:
            continue
        m = re.search(r"Bezug:\s*([^.]+)", text)
        if m:
            return m.group(1).strip()
        m = re.search(r"im Thema\s+([^?]+?)(?:\s+unter|\s+auf|\?|$)", text, re.I)
        if m:
            return m.group(1).strip()
    return None


def escape(s: str, quote: str) -> str:
    s = re.sub(r"\\+(?=[äöüÄÖÜß])", "", s)
    s = s.replace("\\", "\\\\")
    if quote == '"':
        return s.replace('"', '\\"')
    return s.replace("'", "\\'")


def format_wrong(opts: list[str], quote: str, indent: str = "        ") -> str:
    parts = f",\n{indent}".join(f"{quote}{escape(o, quote)}{quote}" for o in opts)
    return f"[\n{indent}{parts},\n      ]"


def unescape_ts(s: str) -> str:
    return re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), s)


PAIR_RE = re.compile(
    r"(\{\s*concept:\s*(?P<cq>['\"])(?P<concept>(?:\\.|[^\\\"'])*?)(?P=cq)\s*,\s*"
    r"term:\s*(?P<tq>['\"])(?P<term>(?:\\.|[^\\\"'])*?)(?P=tq)\s*,\s*"
    r"meaning:\s*(?P<mq>['\"])(?P<meaning>(?:\\.|[^\\\"'])*?)(?P=mq)\s*,\s*"
    r"wissen:\s*(?P<wq>['\"])(?P<wissen>(?:\\.|[^\\\"'])*?)(?P=wq)\s*\})",
)

FACT_DQ = re.compile(
    r"(\{\s*\n\s*concept:\s*\"([^\"]+)\"\s*,\s*\n"
    r"\s*prompt:\s*\"((?:\\.|[^\"\\])*)\"\s*,\s*\n"
    r"\s*answer:\s*\"((?:\\.|[^\"\\])*)\"\s*,\s*\n"
    r"\s*wrong:\s*(\[[\s\S]*?\])\s*,)",
)
FACT_SQ = re.compile(
    r"(\{\s*\n\s*concept:\s*'((?:\\.|[^'\\])*)'\s*,\s*\n"
    r"\s*prompt:\s*'((?:\\.|[^'\\])*)'\s*,\s*\n"
    r"\s*answer:\s*'((?:\\.|[^'\\])*)'\s*,\s*\n"
    r"\s*wrong:\s*(\[[\s\S]*?\])\s*,)",
)


def parse_wrong(blob: str) -> list[str]:
    opts = re.findall(r'"((?:\\.|[^"\\])*)"', blob)
    if opts:
        return opts
    return re.findall(r"'((?:\\.|[^'\\])*)'", blob)


def needs_option_rewrite(answer: str, wrongs: list[str]) -> bool:
    for o in [answer, *wrongs]:
        if GI.search(o) or re.match(r"^Darunter versteht man\b", o, re.I):
            return True
        # Double-wrap / verb-as-noun corruption
        if re.search(
            r"handelt sich um die (Stellt|Meint|Beschreibt|Bezeichnet|Kennzeichnet|Ist)\b|"
            r"Das ist die Meint\b|"
            r"\b(die|das|der)\s+(Sie|Er|Es)\b|"
            r"steht für das (Es|Bei|N |Φ)\b",
            o,
            re.I,
        ):
            return True
        if re.match(r"^(Sie|Er|Es)\s+(bezeichnet|ist\s+(das|die|der))\b", o, re.I):
            if not re.search(
                r",\s*(mit|durch|über|für|bei|in|an|aus)\s+(dem|der|die|den|einem|einer)\b",
                o,
                re.I,
            ):
                # Keep rich relative clauses
                if not re.search(r",\s*(der|die|das)\s+\S+", o, re.I):
                    return True
        words = o.split()
        if len(words) < 8 and not VERBISH.search(o):
            return True
        if len(o) < 40 and not VERBISH.search(o):
            return True
        # Title-Case abuse mid option after article
        if re.search(r"\b(die|das|der|den)\s+[A-ZÄÖÜ][a-zäöü]+\s+[A-ZÄÖÜ]", o):
            return True
    return False


def rewrite_wissen(wissen: str, term: str, new_meaning: str) -> str:
    if not wissen:
        return f"{display_term(term)}: {new_meaning}."
    t = display_term(term)
    # Replace „X bedeutet: …“ clause
    w = re.sub(
        rf"({re.escape(term)}|{re.escape(t)})\s+bedeutet:\s*[^.]+",
        rf"\1 bedeutet: {new_meaning}",
        wissen,
        count=1,
        flags=re.I,
    )
    w = re.sub(
        rf"Merke:\s*({re.escape(term)}|{re.escape(t)})\s*[—\-]\s*[^.]+",
        rf"Merke: \1 — {new_meaning}",
        w,
        count=1,
        flags=re.I,
    )
    if w == wissen and "bedeutet:" not in wissen.lower():
        w = f"{wissen.rstrip('. ')}. {t} bedeutet: {new_meaning}."
    return w


def transform_file(path: Path) -> tuple[int, int, int]:
    text = path.read_text(encoding="utf-8")
    pair_changed = 0
    fact_changed = 0
    scanned = 0

    # term -> enriched meaning (local to banks; last write wins per term string)
    pair_map: dict[str, str] = {}

    def repl_pair(m: re.Match) -> str:
        nonlocal pair_changed
        concept = unescape_ts(m.group("concept"))
        term = unescape_ts(m.group("term"))
        meaning = unescape_ts(m.group("meaning"))
        wissen = unescape_ts(m.group("wissen"))
        q = m.group("cq")

        gold_meaning = None
        # Map gold by related fact concept prefix
        for gconcept, g in GOLD.items():
            if concept.startswith(gconcept.rsplit(":f", 1)[0]) or concept in gconcept:
                if "meaning" in g:
                    gold_meaning = str(g["meaning"])
        # Also match pair concept to gold fact by replacing :f with :p patterns loosely
        if concept in GOLD and "meaning" in GOLD[concept]:
            gold_meaning = str(GOLD[concept]["meaning"])

        new_m = gold_meaning or enrich_meaning(term, meaning, wissen)
        new_w = rewrite_wissen(wissen, term, new_m)
        pair_map[term.lower()] = new_m
        pair_map[display_term(term).lower()] = new_m
        if new_m != meaning or new_w != wissen:
            pair_changed += 1
        return (
            f"{{ concept: {q}{escape(concept, q)}{q}, term: {q}{escape(term, q)}{q}, "
            f"meaning: {q}{escape(new_m, q)}{q}, wissen: {q}{escape(new_w, q)}{q} }}"
        )

    text = PAIR_RE.sub(repl_pair, text)

    def handle_fact(m: re.Match, quote: str) -> str:
        nonlocal fact_changed, scanned
        scanned += 1
        concept = unescape_ts(m.group(2))
        prompt = unescape_ts(m.group(3))
        answer = unescape_ts(m.group(4))
        wrongs = [unescape_ts(w) for w in parse_wrong(m.group(5))]

        if concept in GOLD:
            g = GOLD[concept]
            new_p, new_a, new_w = str(g["prompt"]), str(g["answer"]), list(g["wrong"])  # type: ignore
            fact_changed += 1
        elif not needs_option_rewrite(answer, wrongs):
            return m.group(0)
        else:
            start = m.start()
            window = text[start : start + 1600]
            flash_m = re.search(
                rf"flashFront:\s*{re.escape(quote)}((?:\\.|[^{quote}\\])*){re.escape(quote)}",
                window,
            )
            wissen_m = re.search(
                rf"wissen:\s*{re.escape(quote)}((?:\\.|[^{quote}\\])*){re.escape(quote)}",
                window,
            )
            expl_m = re.search(
                rf"explanation:\s*{re.escape(quote)}((?:\\.|[^{quote}\\])*){re.escape(quote)}",
                window,
            )
            gap_m = re.search(
                rf"gap:\s*{re.escape(quote)}((?:\\.|[^{quote}\\])*){re.escape(quote)}",
                window,
            )
            gap_acc = re.search(
                rf"gapAccepted:\s*\[\s*{re.escape(quote)}((?:\\.|[^{quote}\\])*){re.escape(quote)}",
                window,
            )

            flash = unescape_ts(flash_m.group(1)) if flash_m else ""
            if not flash and gap_acc:
                flash = unescape_ts(gap_acc.group(1))
            wissen = unescape_ts(wissen_m.group(1)) if wissen_m else ""
            expl = unescape_ts(expl_m.group(1)) if expl_m else ""
            gap = unescape_ts(gap_m.group(1)) if gap_m else ""

            term = display_term(flash) if flash else ""
            if not term:
                tm = re.search(r"[„\"']([^„\"']+)[“\"']", prompt)
                if tm:
                    term = display_term(tm.group(1))
            if not term:
                tm = re.search(
                    r"(?:Was kennzeichnet|Welche Rolle hat|Was beschreibt|Was bewirkt|"
                    r"Woran erkennt man|Wozu dient(?: die)?|Welche Eigenschaft hat)\s+(.+?)"
                    r"(?:\s+im Thema|\?|$)",
                    prompt,
                    re.I,
                )
                if tm:
                    term = display_term(tm.group(1).strip())
            if not term:
                return m.group(0)

            topic = extract_topic(wissen, expl, prompt)
            raw = (
                pair_map.get(term.lower())
                or pair_map.get(display_term(term).lower())
                or enrich_meaning(term, core_meaning(answer) or answer, wissen or expl)
            )
            # Prefer gap meaning fragment if pair missing
            if gap and "—" in gap:
                gm = gap.split("—", 1)[-1].strip()
                if gm and term.lower() not in pair_map:
                    raw = enrich_meaning(term, gm, wissen or expl)

            style = classify(term, raw, topic)
            new_p = prompt
            if re.search(
                r"(Was trifft|fachlich richtig|Was versteht man(?! in der Geschichtswissenschaft)|"
                r"Was bewirkt oder beschreibt|Fachbegriff\s*\(|Was bedeutet)",
                prompt,
                re.I,
            ) or not re.match(
                r"^(Wozu|Welche|Woran|Was bewirkt|Was beschreibt|Was kennzeichnet|Was passiert|Wie|Warum|Was versteht)\b",
                prompt,
                re.I,
            ):
                new_p = concrete_stem(term, topic, raw, style)

            new_a = option_from_meaning(term, raw, style)

            # Build distractors from other enriched meanings in map, preserving order of old wrongs' cores
            cand = []
            for mean in pair_map.values():
                if mean == raw or mean in cand:
                    continue
                cand.append(mean)
                if len(cand) >= 24:
                    break

            new_w: list[str] = []
            for w in wrongs:
                src = core_meaning(w)
                matched = None
                for mean in cand:
                    cm = core_meaning(mean).lower()
                    if cm == src.lower() or src.lower() in mean.lower() or cm in src.lower():
                        matched = mean
                        break
                new_w.append(option_from_meaning(term, matched or enrich_meaning(term, src, ""), style))

            seen = {new_a.lower()}
            deduped: list[str] = []
            for w in new_w:
                if w.lower() in seen:
                    continue
                seen.add(w.lower())
                deduped.append(w)
            for mean in cand:
                if len(deduped) >= 3:
                    break
                opt = option_from_meaning(term, mean, style)
                if opt.lower() not in seen:
                    deduped.append(opt)
                    seen.add(opt.lower())
            fillers = [
                ensure_period(f"{pronoun(term)} steuert vor allem einen anderen Vorgang im gleichen Themenfeld"),
                ensure_period(f"{pronoun(term)} ersetzt vollständig einen anderen Fachbegriff"),
                ensure_period(f"{pronoun(term)} beschreibt nur einen Randaspekt ohne klaren Bezug"),
            ]
            for f in fillers:
                if len(deduped) >= 3:
                    break
                if f.lower() not in seen:
                    deduped.append(f)
                    seen.add(f.lower())
            new_w = deduped[:3]
            fact_changed += 1

        wrong_fmt = format_wrong(new_w, quote)
        return (
            "{\n"
            f"      concept: {quote}{escape(concept, quote)}{quote},\n"
            f"      prompt: {quote}{escape(new_p, quote)}{quote},\n"
            f"      answer: {quote}{escape(new_a, quote)}{quote},\n"
            f"      wrong: {wrong_fmt},"
        )

    def repl_dq(m: re.Match) -> str:
        return handle_fact(m, '"')

    def repl_sq(m: re.Match) -> str:
        return handle_fact(m, "'")

    new_text = FACT_DQ.sub(repl_dq, text)
    new_text = FACT_SQ.sub(repl_sq, new_text)

    # Patch wissen/explanation „bedeutet:“ lines that still point at thin cores — light pass
    def patch_bedeutet(m: re.Match) -> str:
        term = unescape_ts(m.group(1))
        key = display_term(term).lower()
        if key in pair_map:
            return f"{m.group(1)} bedeutet: {pair_map[key]}"
        return m.group(0)

    new_text = re.sub(
        r"([A-Za-zÄÖÜäöüß0-9/\- ]{2,60}?)\s+bedeutet:\s*([^.\"']+)",
        patch_bedeutet,
        new_text,
    )

    if pair_changed or fact_changed:
        import time

        tmp = path.with_suffix(path.suffix + ".tmpwrite")
        tmp.write_text(new_text, encoding="utf-8", newline="\n")
        for _ in range(8):
            try:
                tmp.replace(path)
                break
            except OSError:
                time.sleep(0.4)
        else:
            path.write_text(new_text, encoding="utf-8", newline="\n")
    return scanned, pair_changed, fact_changed


def main() -> None:
    total_s = total_p = total_f = 0
    for path in TARGETS:
        if not path.exists():
            print(f"MISSING {path}")
            continue
        s, p, f = transform_file(path)
        total_s += s
        total_p += p
        total_f += f
        print(f"{path.name}: facts_scanned={s} pairs_changed={p} facts_changed={f}")
    print(f"TOTAL facts_scanned={total_s} pairs_changed={total_p} facts_changed={total_f}")


if __name__ == "__main__":
    main()
