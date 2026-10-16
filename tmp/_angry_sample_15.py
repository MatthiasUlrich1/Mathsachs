# -*- coding: utf-8 -*-
"""Strict angry-user SHOWABLE sample gate for locked fill MCs."""
from __future__ import annotations

import random
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CUR = ROOT / "src" / "curriculum"
FILES = [
    "physikThinFill.ts",
    "physikLehrplanGapsFill.ts",
    "physikOsDensityFill.ts",
    "biologieThinFill.ts",
    "biologieLehrplanGapsFill.ts",
    "biologieOsDensityFill.ts",
    "biologieOsGapsFill.ts",
    "biologieK8K10DensityFill.ts",
    "geschichteThinFill.ts",
    "geschichteDichteFillPass1.ts",
]

FACT = re.compile(
    r"concept:\s*(['\"])((?:\\.|[^\\\"'])*)\1\s*,\s*"
    r"prompt:\s*(['\"])((?:\\.|[^\\\"'])*)\3\s*,\s*"
    r"answer:\s*(['\"])((?:\\.|[^\\\"'])*)\5\s*,\s*"
    r"wrong:\s*\[([\s\S]*?)\]",
)

BANNED = re.compile(
    r"Bezeichnet die Bezeichnet|zählt inhaltlich|Fachzusammenhang als zentralen|"
    r"— so bei|\bNachbarbegriff\b|Randdetail ohne|vertauschte Ursache-Wirkung|"
    r"bezeichnet die Ist |bezeichnet das Ist |Es das Ist|"
    r"kennzeichnet das Ist|kennzeichnet die Ist|beschreibt die Ist|"
    r"\?\?\?|zentralen fachlichen Kern|von Nachbarbegriffen|"
    r"typische Verwechslung|im prüfbaren Zusammenhang|"
    r"ist hier:|kurz gesagt:|\bHier gilt\b|Es geht um|und zwar gilt|"
    r"steht im Kern für Folgendes|der Ereignisse|fachlich richtig|Was bedeutet",
    re.I,
)
PAD_WRAPPER = re.compile(
    r"ist hier:|kurz gesagt:|\bHier gilt\b|Es geht um|der Ereignisse",
    re.I,
)
META_STEM = re.compile(
    r"fachlich richtig|Was trifft\b|Was bedeutet\b|Welche Aussage zu\b|"
    r"Was bewirkt oder beschreibt\b|^\[[^\]]+\]",
    re.I,
)
FORMULAIC = re.compile(r"Was kennzeichnet .+ im Thema ", re.I)
VERB = re.compile(
    r"\b(ist|sind|hat|haben|wird|werden|lässt|lassen|dient|dienen|beschreibt|"
    r"bedeutet|gilt|bildet|zeigt|enthält|umfasst|sendet|wirft|regelt|steuert|"
    r"misst|schützt|entzieht|verbindet|erzeugt|entsteht|geht|liegt|nimmt|"
    r"speichert|transportiert|meint|kennzeichnet|prägt|gewährt|organisiert|"
    r"fasst|trennt|leitet|nutzt|dokumentiert|ordnet|wirkt|hemmt|pumpt|"
    r"steht|erkenne[nt]?|begünstigt|kontrollier\w*|bestimmt|"
    r"modelliert|ändert|bleibt|schaltet|legen|legt|ermöglicht|erhöht|"
    r"ersetzt|vermeidet|absorbiert|deutet|entsteht|bleibt|wirft|"
    r"zurückgeworfen|aussendet|beleuchtet|unbeleuchtet|"
    r"gibt|stellt|steckt|erscheint|dokumentiert|wiederholen|hat|"
    r"verbindet|gewährt|vereint|lebt\w*|bildet|"
    r"war|waren|prüft|führte|führt|gestaltet|zerstörte|vollzog|"
    r"errichtete|unterwarf|übertrug|entmachtete|teilt|begründet|"
    r"lenkt|strebt|sieht|forderte|fordert|stürzte|propagierte|"
    r"prägte|bezeichnet|regelte|regelt|lebte|lebten|verbreitete|zementierte|"
    r"betont|bedeutet|ausgetragen|"
    r"wächst|wählt|entspricht|nennt|folgt|überträgt|liefert|prüft|"
    r"diskutiert|bestätigt|widerlegt|hemmt|wandelt|verändert|erleichtert|"
    r"verringert|verteilt|heben|beschleunigt|kontrolliert|unterscheidet|"
    r"formuliert|braucht|gilt|wirkt|bildet|enthält|unterbricht|verknüpft|"
    r"nimmt|kann|können|steigt|geht|hängt|misst|leitet|transportiert|"
    r"überträgt|nützt|nutzt|nutze[nt]?|stellt|erhöht|dokumentiert|schützt|sendet|"
    r"modelliert|erzeugt|ändert|wirft|lässt|bleibt|absorbiert|deutet|"
    r"beschreibt|regelt|organisiert|prägt|prüft|führt|errichtet|"
    r"arbeitet|zeigt|senkt|rechnet|verstärkt|schaltet|steuert|teilt|"
    r"überlastet|beachtet|wählt|liefert|schützt|wandelt|lässt|"
    r"lebt|jagt|trägt|frisst|besteht|bleibt|treibt|erfasst|"
    r"regulier\w*|verringer\w*|bedeutet|signalisiert|befeuchtet|"
    r"feuchthält|erbeutet|ernährt)\b",
    re.I,
)


def decode(s: str) -> str:
    s = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), s)
    return (
        s.replace("\\n", "\n")
        .replace('\\"', '"')
        .replace("\\'", "'")
        .replace("\\\\", "\\")
    )


def judge(prompt: str, answer: str, wrongs: list[str]) -> list[str]:
    reasons: list[str] = []
    blob = " ".join([prompt, answer, *wrongs])
    if BANNED.search(blob) or "???" in blob:
        reasons.append("banned")
    # Hard fail: uniform Term-ist-hier / kurz gesagt / Es geht um pads
    if PAD_WRAPPER.search(blob):
        reasons.append("pad-wrapper")
    if META_STEM.search(prompt):
        reasons.append("meta-stem")
    if FORMULAIC.search(prompt):
        reasons.append("formulaic-im-thema")
    if not prompt.strip().endswith("?"):
        reasons.append("stem-no-?")
    # double-verb / missing article mash
    if re.search(
        r"\b(bezeichnet|beschreibt|kennzeichnet)\s+(die|das|den)\s+"
        r"(Ist|Sind|Bezeichnet|Beschreibt|Gilt|Hängt)\b",
        blob,
        re.I,
    ):
        reasons.append("double-verb-mash")
    if re.search(r"\b(Es das |Sie die |das Ist |die Ist )\b", blob):
        reasons.append("article-mash")
    # lowercase German noun mid-sentence after article incorrectly: „das körper“
    if re.search(r"\b(der|die|das|ein|eine|einen)\s+[a-zäöü]{4,}\b", answer):
        # allow common adjectives after article
        if not re.search(
            r"\b(der|die|das|ein|eine|einen)\s+"
            r"(große|kleine|neue|alte|eigene|selbst|völlig|teilweise|andere|"
            r"politische|zeitliche|geradlinige|unbeleuchtete|beleuchtete|"
            r"lichtundurchlässig\w*|transparent\w*|opake?\w*)\b",
            answer,
            re.I,
        ):
            # flag only clear noun-looking lowercase after article
            if re.search(r"\b(der|die|das|ein|eine)\s+(körper|bereich|modell|organ|fläche)\b", answer):
                reasons.append("casing")
    opts = [answer, *wrongs]
    for i, o in enumerate(opts):
        words = o.split()
        if len(words) < 6 or not VERB.search(o) or not re.search(r"[.!?]$", o.strip()):
            reasons.append(f"weak-opt{i}")
        if BANNED.search(o) or PAD_WRAPPER.search(o):
            reasons.append(f"banned-opt{i}")
    if len(wrongs) < 3:
        reasons.append("missing-wrongs")
    if len({w.lower() for w in wrongs}) < len(wrongs):
        reasons.append("dup-wrongs")
    return reasons


def load_items() -> list[dict]:
    items = []
    for name in FILES:
        text = (CUR / name).read_text(encoding="utf-8")
        for m in FACT.finditer(text):
            wrongs = [decode(w[1]) for w in re.findall(r"(['\"])((?:\\.|[^\\\"'])*)\1", m.group(7))]
            items.append(
                {
                    "file": name,
                    "concept": decode(m.group(2)),
                    "prompt": decode(m.group(4)),
                    "answer": decode(m.group(6)),
                    "wrong": wrongs,
                }
            )
    return items


def run_seed(seed: int, n: int = 15) -> tuple[int, list[str]]:
    items = load_items()
    rng = random.Random(seed)
    sample = rng.sample(items, min(n, len(items)))
    lines = [f"SEED {seed} POOL {len(items)} SAMPLE {len(sample)}"]
    ok = 0
    for i, it in enumerate(sample, 1):
        reasons = judge(it["prompt"], it["answer"], it["wrong"])
        status = "SHOWABLE" if not reasons else "WEAK"
        if not reasons:
            ok += 1
        lines.append(f"\n=== {i}/{len(sample)} [{status}] {it['file']} ===")
        lines.append(f"concept: {it['concept']}")
        lines.append(f"Q: {it['prompt']}")
        lines.append(f"A: {it['answer']}")
        for w in it["wrong"]:
            lines.append(f"  - {w}")
        if reasons:
            lines.append(f"reasons: {reasons}")
    lines.append(f"\nSCORE: {ok}/{len(sample)} SHOWABLE")
    lines.append("GATE: " + ("PASS" if ok >= 12 else "FAIL"))
    return ok, lines


def main() -> int:
    seeds = [int(x) for x in (sys.argv[1:] or ["991177", "555666", "777888"])]
    all_lines: list[str] = []
    results = []
    for seed in seeds:
        ok, lines = run_seed(seed, 15)
        results.append((seed, ok))
        all_lines.extend(lines)
        all_lines.append("\n" + ("=" * 60) + "\n")
        print(f"seed {seed}: {ok}/15 SHOWABLE -> {'PASS' if ok >= 12 else 'FAIL'}")
    out = ROOT / "tmp" / "_angry_sample_out.txt"
    out.write_text("\n".join(all_lines), encoding="utf-8")
    print("report:", out)
    # overall
    fails = [s for s, ok in results if ok < 12]
    if fails:
        print("OVERALL: FAIL (seeds", fails, ")")
        return 1
    print("OVERALL: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
