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
}

BANNED_OUT = re.compile(
    r"ist hier:|kurz gesagt:|\bHier gilt\b|Es geht um|Fachzusammenhang|"
    r"Nachbarbegriff|prüfbaren Sachverhalt|Was bedeutet\b|Folgendes|"
    r"Sie ist eine |Er ist eine |Es ist eine ",
    re.I,
)
TITLE_MUSH = re.compile(
    r"\b(der|die|das|ein|eine|einen|einem|einer)\s+"
    r"([A-ZÄÖÜ][a-zäöüß]+)(?:\s+([A-ZÄÖÜ][a-zäöüß]+)){1,}",
)
MECH_ANS = re.compile(
    r"^(Sie|Er|Es) ist eine\b|"
    r"\bdurch (Beim|In|Bei|Mit)\b|"
    r"\bSelbst Licht Aussendet\b|"
    r"\bGeradliniges Modell\b.*\bdurch in\b|"
    r"\bLicht geht durch durch\b",
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
    r"Wirft|Modelliert|Erzeugt|Verbindet|Gewährt|Leitet|Filtert|"
    r"Pumpt|Kontrolliert|Bestimmt|Meint|Steht|Folgt|Nimmt)\b",
    re.I,
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


def natural_answer(term: str, meaning: str, wissen: str) -> str:
    key = norm_term(term)
    base = re.sub(r"\s*\(.*$", "", key).strip()
    tip = tip_from_wissen(wissen)

    # Full hand answer
    for k in (key, base):
        if k in HAND and "answer" in HAND[k]:
            ans = ensure_period(fix_casing(str(HAND[k]["answer"])))
            if not BANNED_OUT.search(ans) and len(ans.split()) >= 6:
                return ans

    core = curated_core(term, meaning)
    core = fix_casing(core)
    pron = p6.pronoun(term)

    if re.match(r"^(Sie|Er|Es)\b", core, re.I):
        sent = core
    elif VERB_LEAD.match(core):
        # "Ist ein Körper…" / "Lässt Licht…" / "Beschreibt…"
        sent = f"{pron} {p6.lower_first(core)}"
    elif re.match(r"^(der|die|das|ein|eine)\b", core, re.I):
        sent = f"{pron} ist {core}"
    elif re.match(r"^[A-ZÄÖÜ].*\b(wird|werden|geht|lässt|lässt)\b", core):
        sent = core
    else:
        # Noun phrase → prefer "Ein/Eine …" without forced "Sie ist eine"
        np = p6.with_nom_np(core, term)
        # Prefer indefinite for definition feel when definite
        np2 = re.sub(r"^der\s+", "ein ", np, count=1, flags=re.I)
        np2 = re.sub(r"^die\s+", "eine ", np2, count=1, flags=re.I)
        np2 = re.sub(r"^das\s+", "ein ", np2, count=1, flags=re.I)
        # Fix "eine Körper" / "eine Bereich" gender mush via article_for_head
        m = re.match(r"^(ein|eine)\s+(\S+)", np2, re.I)
        if m:
            head = m.group(2)
            # strip adjective
            words = np2.split()
            head_noun = words[1] if p6.is_likely_adj(words[0].split()[-1] if False else words[1] if len(words) > 1 else words[0]) and len(words) > 1 else words[0]
            # simpler: recompute
            body = re.sub(r"^(der|die|das|ein|eine)\s+", "", np, flags=re.I)
            words = body.split()
            if words and p6.is_likely_adj(words[0]) and len(words) >= 2:
                noun = words[1]
            else:
                noun = words[0] if words else term
            art = p6.article_for_head(noun, term)
            indef = {"der": "ein", "die": "eine", "das": "ein"}[art]
            np2 = f"{indef} {body}"
        sent = ensure_period(np2[0].upper() + np2[1:] if np2 else np2)
        # Prefer pronoun+verb when short NP
        if len(sent.split()) < 8 and VERB_LEAD.match("Ist"):
            sent = f"{pron} ist {np2}"

    sent = fix_casing(sent)
    # Kill remaining "ist eine + masc/neut mismatch"
    sent = re.sub(r"\bist eine (Körper|Bereich|Modell|Organ|Schatten|Spiegel|Filter)\b", r"ist ein \1", sent, flags=re.I)
    sent = re.sub(r"\bist ein (Lichtquelle|Reflexion|Brechung|Transparenz|Fläche|Richtung)\b", r"ist eine \1", sent, flags=re.I)
    sent = re.sub(r"\bist eine (geradliniges|völlig|teilweise|abbildendes)\b", r"ist ein \1", sent, flags=re.I)

    # Only weave tip if sentence still short / lacks concrete example
    if len(sent.split()) < 12:
        sent = weave_tip(p6.strip_period(sent), tip)
    sent = ensure_period(fix_casing(sent))
    # Final ban check — fall back to curated verb form
    if BANNED_OUT.search(sent) or MECH_ANS.search(sent) or len(sent.split()) < 6:
        fallback = curated_core(term, meaning)
        if VERB_LEAD.match(fallback):
            sent = ensure_period(f"{pron} {p6.lower_first(fallback)}")
        else:
            sent = ensure_period(f"{pron} kennzeichnet {p6.with_nom_np(fallback, term)}")
            # "kennzeichnet" can be formulaic — prefer beschreibt for variety
            if hashlib.md5(term.encode()).hexdigest()[0] in "01234567":
                sent = sent.replace("kennzeichnet", "beschreibt", 1)
        sent = ensure_period(fix_casing(sent))
    # Soften "Sie ist die/der" when we have verb curated
    sent = re.sub(r"\s{2,}", " ", sent)
    # Remove em-dash tips that look like pads
    sent = sent.replace(" — ", ", ")
    return ensure_period(sent)


def natural_prompt(term: str, meaning: str, concept: str) -> str:
    key = norm_term(term)
    base = re.sub(r"\s*\(.*$", "", key).strip()
    for k in (key, base):
        if k in HAND and "prompt" in HAND[k]:
            return str(HAND[k]["prompt"])
    disp = p6.display_term(term)
    # article for stem
    art = p6.article_for_head(disp.split()[0], term)
    # pick stem family from concept hash
    h = int(hashlib.md5(concept.encode()).hexdigest()[:8], 16)
    core = curated_core(term, meaning)
    # property / adjective meanings
    if re.search(r"(ig|lich|isch|iv|bar)$", p6.strip_period(meaning).split()[0] if meaning else "", re.I) or base in {
        "opak",
        "transparent",
        "transluzent",
        "transparenz",
    }:
        stems = [
            f"Welche Eigenschaft hat {art} {disp}?",
            f"Woran erkennt man {art} {disp}?",
            f"Was bewirkt {art} {disp}?",
        ]
    elif VERB_LEAD.match(core) and re.match(
        r"^(Dient|Lässt|Wandelt|Schützt|Bildet|Steuert|Misst|Erfasst|Sendet|Wirft)",
        core,
        re.I,
    ):
        stems = [
            f"Wozu dient {art} {disp}?",
            f"Was bewirkt {art} {disp}?",
            f"Mit welchen Mitteln wirkt {art} {disp}?",
            f"Woran erkennt man {art} {disp}?",
        ]
    else:
        stems = [
            f"Was bewirkt {art} {disp}?",
            f"Woran erkennt man {art} {disp}?",
            f"Welche Eigenschaft hat {art} {disp}?",
            f"Wozu dient {art} {disp}?",
            f"Mit welchen Mitteln arbeitet man mit {art}m {disp}?"
            if art == "da"
            else f"Was beschreibt „{disp}“?",
        ]
    # clean awkward
    stems = [s for s in stems if "dam " not in s and "artm " not in s]
    stems = [
        s.replace("dasm ", "dem ")
        .replace("derm ", "dem ")
        .replace("diem ", "der ")
        for s in stems
    ]
    # Fix "Wozu dient die Lichtquelle" ok; "Wozu dient der Lichtstrahl" ok
    # Fix bad "Was beschreibt" hanging
    stem = stems[h % len(stems)]
    # Grammar fix: "mit derm" already handled; "Wozu dient Opak" → "ein opaker Körper"
    if base == "opak":
        stem = "Welche Eigenschaft hat ein opaker Körper?"
    if base in {"transparent", "transluzent"}:
        stem = f"Welche Eigenschaft hat ein {base}er Körper?"
    # Ban meta
    if re.search(r"Was bedeutet|fachlich richtig|Was trifft", stem, re.I):
        stem = f"Woran erkennt man {art} {disp}?"
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
        if BANNED_OUT.search(ans) or len(ans.split()) < 6:
            continue
        seen.add(key)
        out.append(ans)
        if len(out) >= n:
            break
    alts = [
        "Das trifft auf einen anderen Vorgang mit anderer Ursache und Wirkung zu.",
        "Das gilt für einen verwandten Fachbegriff, der hier nicht gemeint ist.",
        "Das beschreibt eine andere Größe aus demselben Themenfeld.",
        "Das nennt eine Folge, die unter anderen Bedingungen eintritt.",
    ]
    i = 0
    while len(out) < n and i < len(alts) * 2:
        cand = alts[i % len(alts)]
        i += 1
        if cand.lower() not in seen:
            out.append(cand)
            seen.add(cand.lower())
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


def needs_rewrite(prompt: str, answer: str, wrongs: list[str]) -> bool:
    blob = " ".join([prompt, answer, *wrongs])
    if MECH_ANS.search(answer):
        return True
    if BANNED_OUT.search(blob):
        return True
    if answer.startswith("Sie ist eine ") or answer.startswith("Er ist eine ") or answer.startswith("Es ist eine "):
        return True
    if sum(1 for w in wrongs if re.match(r"^(Sie|Er|Es) ist eine\b", w)) >= 2:
        return True
    if TITLE_MUSH.search(answer):
        return True
    if re.search(r"\b(Körper, der Selbst|eine Bereich|eine Geradliniges|eine Völlig)\b", blob):
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
        if concept in GOLD_CONCEPTS:
            continue
        if "lichtverschmutzung:fact:timer" in concept or "lichtdurchlaessigkeit:fact:transparent" in concept:
            continue

        scanned += 1
        if not needs_rewrite(prompt, answer, wrongs):
            continue
        if limit is not None and changed >= limit:
            break

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

        new_prompt = natural_prompt(term, meaning, concept)
        new_answer = natural_answer(term, meaning, wissen)
        new_wrongs = sibling_answers(term, pairs, 3)
        new_wrongs = [w for w in new_wrongs if w.lower() != new_answer.lower()]
        while len(new_wrongs) < 3:
            new_wrongs.append(
                "Die Richtung des Lichts bleibt an jeder Grenzfläche unverändert."
            )
            if len(set(w.lower() for w in new_wrongs)) < len(new_wrongs):
                new_wrongs[-1] = "Ein Körper sendet selbst kein Licht aus und bleibt unsichtbar."
        new_wrongs = new_wrongs[:3]

        if BANNED_OUT.search(new_answer) or any(BANNED_OUT.search(w) for w in new_wrongs):
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
