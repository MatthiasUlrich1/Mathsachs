# -*- coding: utf-8 -*-
"""Independent human-reading audit: topic match, no foreign bleed, no Title mush."""
from __future__ import annotations

import random
import re
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

KNOWN = {
    "bio:k10:blut:ab": re.compile(r"Antigen|kodominant|A und B", re.I),
    "bio:k10:erbk:trisomie": re.compile(r"Chromosom 21|Down|dreifach|Genommutation|Trisomie", re.I),
    "bio:lk11:c3c4:10": re.compile(r"Lebensraum|Strategie|Anpassung|CO2|C3|C4|CAM", re.I),
}

BANNED = re.compile(
    r"Nur Haarfarbe|Nur Zahnzahl|ohne biologischen Bezug|"
    r"ist hier:|kurz gesagt:|\bHier gilt\b|"
    r"\bbeschreibt eine [A-ZÄÖÜ]|\bbeschreibt ein [A-ZÄÖÜ]",
)

FOREIGN = [
    (re.compile(r"Franklin|Röntgenbeugung|Doppelhelix", re.I), re.compile(r"Blut|Antigen|AB0|Rhesus|Blutgruppe", re.I)),
    (re.compile(r"Geschlechtschromosom|\bXX\b|\bXY\b", re.I), re.compile(r"Trisomie|Down|Chromosom 21", re.I)),
    (re.compile(r"Hydrolase|Enzymklasse|Vmax|Kompetitiv|Lineweaver", re.I), re.compile(r"C3|C4|CAM|Anpassung|Rubisco|Calvin", re.I)),
]


def decode(s: str) -> str:
    s = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), s)
    return s.replace("\\n", "\n").replace('\\"', '"').replace("\\'", "'").replace("\\\\", "\\")


def load() -> list[dict]:
    items = []
    for name in FILES:
        text = (CUR / name).read_text(encoding="utf-8")
        for m in FACT.finditer(text):
            concept = decode(m.group(2))
            prompt = decode(m.group(4))
            answer = decode(m.group(6))
            wrongs = [decode(w[1]) for w in re.findall(r"(['\"])((?:\\.|[^\\\"'])*)\1", m.group(7))]
            chunk = text[m.end() : m.end() + 500]
            expl = ""
            em = re.search(r"explanation:\s*(['\"])((?:\\.|[^\\\"'])*)\1", chunk)
            if em:
                expl = decode(em.group(2))
            items.append(
                {
                    "file": name,
                    "concept": concept,
                    "prompt": prompt,
                    "answer": answer,
                    "wrong": wrongs,
                    "explanation": expl,
                }
            )
    return items


def score_item(it: dict) -> list[str]:
    reasons: list[str] = []
    # Ban/mush only on options — prompts like „Was beschreibt ein Pixel?“ are fine
    opts = " ".join([it["answer"], *it["wrong"]])
    if BANNED.search(opts):
        reasons.append("banned-or-title-mush")
    if it["concept"] in KNOWN and not KNOWN[it["concept"]].search(it["answer"]):
        reasons.append("known-topic-fail")
    topic = it["prompt"] + " " + it["explanation"] + " " + it["concept"]
    for foreign, topical in FOREIGN:
        if foreign.search(it["answer"]) and topical.search(topic) and not foreign.search(topic):
            reasons.append("foreign-bleed")
    # Human minimum: non-empty topical answer
    if len(it["answer"].split()) < 3:
        reasons.append("answer-emptyish")
    if not it["answer"].strip():
        reasons.append("empty")
    return reasons


def main() -> int:
    items = load()
    by_c = {it["concept"]: it for it in items}
    lines: list[str] = ["=== KNOWN SHOWSTOPPERS ==="]
    known_ok = 0
    for cid, pat in KNOWN.items():
        it = by_c.get(cid)
        if not it:
            lines.append(f"FAIL missing {cid}")
            continue
        reasons = score_item(it)
        ok = not reasons and bool(pat.search(it["answer"]))
        # Extra: wrongs must not be foreign-topic for known IDs
        if cid == "bio:lk11:c3c4:10" and any(
            re.search(r"Hydrolase|Vmax|Kompetitiv|Enzymklasse", w, re.I) for w in it["wrong"]
        ):
            ok = False
            reasons.append("enzyme-wrongs")
        if cid == "bio:k10:blut:ab" and any(re.search(r"Franklin|Röntgen", w, re.I) for w in it["wrong"]):
            ok = False
            reasons.append("franklin-wrongs")
        if cid == "bio:k10:erbk:trisomie" and any(
            re.search(r"Geschlechtschromosom|\bXX\b|\bXY\b", w, re.I) for w in it["wrong"]
        ):
            ok = False
            reasons.append("geschlecht-wrongs")
        if ok:
            known_ok += 1
        lines.append(f"{'PASS' if ok else 'FAIL'} {cid}")
        lines.append(f"  Q: {it['prompt']}")
        lines.append(f"  A: {it['answer']}")
        for w in it["wrong"]:
            lines.append(f"  - {w}")
        if reasons:
            lines.append(f"  reasons: {reasons}")

    mismatch = [(it, score_item(it)) for it in items if score_item(it)]
    # Filter to serious only
    serious = [
        (it, rs)
        for it, rs in mismatch
        if any(r in rs for r in ("foreign-bleed", "banned-or-title-mush", "known-topic-fail"))
    ]
    lines.append(f"\n=== CORPUS SERIOUS MISMATCH ===")
    lines.append(f"flagged: {len(serious)} / {len(items)}")
    for it, rs in serious[:15]:
        lines.append(f"  {it['concept']}: {rs} | A={it['answer'][:80]}")

    seeds = [555666, 112358, 998877]
    seed_results = []
    for seed in seeds:
        rng = random.Random(seed)
        sample = rng.sample(items, min(12, len(items)))
        ok = 0
        lines.append(f"\n=== SEED {seed} (human topic reading) ===")
        for i, it in enumerate(sample, 1):
            reasons = score_item(it)
            status = "OK" if not reasons else "WEAK"
            if not reasons:
                ok += 1
            lines.append(f"{i}. [{status}] {it['concept']}")
            lines.append(f"   Q: {it['prompt']}")
            lines.append(f"   A: {it['answer']}")
            if reasons:
                lines.append(f"   reasons: {reasons}")
        lines.append(f"SCORE: {ok}/12 -> {'PASS' if ok >= 10 else 'FAIL'}")
        seed_results.append((seed, ok))

    lines.append("\n=== VERDICT ===")
    lines.append(f"known: {known_ok}/{len(KNOWN)}")
    lines.append(f"seeds: {seed_results}")
    lines.append(f"serious_mismatch: {len(serious)}")
    if known_ok == len(KNOWN) and all(ok >= 10 for _, ok in seed_results) and len(serious) == 0:
        lines.append("PASS")
        code = 0
    elif known_ok == len(KNOWN) and all(ok >= 10 for _, ok in seed_results):
        lines.append(f"PARTIAL (remaining serious mismatch: {len(serious)})")
        code = 0
    else:
        lines.append("FAIL")
        code = 1

    out = ROOT / "tmp" / "_independent_corruption_audit.txt"
    out.write_text("\n".join(lines), encoding="utf-8")
    print("\n".join(lines[-25:]))
    print("report:", out)
    return code


if __name__ == "__main__":
    raise SystemExit(main())
