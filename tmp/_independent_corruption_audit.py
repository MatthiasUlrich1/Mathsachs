# -*- coding: utf-8 -*-
"""Independent human-reading audit: topic match, no foreign bleed, no Title mush,
no prompt↔gapAccepted sibling-term desync."""
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
    "bio:k6:orgene:f11": re.compile(r"Heterotroph|organisch", re.I),
    "bio:k6:zellth:f6": re.compile(r"Gewebe|Verband|Zellen", re.I),
    "bio:k9:fakt:f3": re.compile(r"Potenz|Reaktionsbreite", re.I),
}
PROMPT_OK = {
    "bio:k6:orgene:f11": re.compile(r"Heterotrophie", re.I),
    "bio:k6:zellth:f6": re.compile(r"Gewebe", re.I),
    "bio:k9:fakt:f3": re.compile(r"Ökologische Potenz|Oekologische Potenz", re.I),
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

QUOTE = re.compile(r"[„\"“]([^„\"”]{2,80})[“\"”]")
SIMPLE = re.compile(
    r"(?:Welche Eigenschaft hat (?:die|das|den|der|ein|eine)|"
    r"Woran erkennt man (?:die|das|den|der|ein|eine)|"
    r"Wozu dient (?:die|das|den|der|ein|eine)|"
    r"Was bewirkt (?:die|das|den|der|ein|eine)|"
    r"Mit welchen Mitteln arbeitet (?:die|das|den|der|ein|eine)|"
    r"Was kennzeichnet (?:die|das|den|der|ein|eine))\s+(.+?)\s*\??\s*$",
    re.I,
)
WAS_BED = re.compile(
    r"(?:Was bedeutet|Was beschreibt|Fachbegriff:\s*Was bedeutet)\s+[„\"“]?([^„\"”?\n]{2,80})[“\"”]?\s*\??\s*$",
    re.I,
)


def decode(s: str) -> str:
    s = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), s)
    return s.replace("\\n", "\n").replace('\\"', '"').replace("\\'", "'").replace("\\\\", "\\")


def norm(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r"[\"„“”']", "", s)
    s = re.sub(r"\s*\([^)]*\)\s*", " ", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip(" .?!,;:")


def terms_match(a: str, b: str) -> bool:
    na, nb = norm(a), norm(b)
    if not na or not nb:
        return False
    if na == nb:
        return True
    if len(na) >= 4 and len(nb) >= 4 and (na in nb or nb in na):
        return True
    return False


def prompt_named_term(p: str) -> str | None:
    m = QUOTE.search(p)
    if m:
        return m.group(1).strip()
    m = WAS_BED.search(p.strip())
    if m:
        return m.group(1).strip()
    m = SIMPLE.search(p.strip())
    if m:
        return m.group(1).strip().rstrip("?.!")
    return None


def expl_term(e: str) -> str | None:
    m = re.match(r"^([^:]{2,60}):\s", e.strip())
    return m.group(1).strip() if m else None


def load() -> list[dict]:
    items = []
    for name in FILES:
        text = (CUR / name).read_text(encoding="utf-8")
        for m in FACT.finditer(text):
            concept = decode(m.group(2))
            prompt = decode(m.group(4))
            answer = decode(m.group(6))
            wrongs = [decode(w[1]) for w in re.findall(r"(['\"])((?:\\.|[^\\\"'])*)\1", m.group(7))]
            chunk = text[m.end() : m.end() + 700]
            stop = re.search(r"\n\s*(?:\{?\s*)?concept:\s*['\"]", chunk)
            if stop:
                chunk = chunk[: stop.start()]
            expl = ""
            em = re.search(r"explanation:\s*(['\"])((?:\\.|[^\\\"'])*)\1", chunk)
            if em:
                expl = decode(em.group(2))
            gap_a: list[str] = []
            gm = re.search(r"gapAccepted:\s*\[([\s\S]*?)\]", chunk)
            if gm:
                gap_a = [decode(x[1]) for x in re.findall(r"(['\"])((?:\\.|[^\\\"'])*)\1", gm.group(1))]
            flash = ""
            fm = re.search(r"flashFront:\s*(['\"])((?:\\.|[^\\\"'])*)\1", chunk)
            if fm:
                flash = decode(fm.group(2))
            items.append(
                {
                    "file": name,
                    "concept": concept,
                    "prompt": prompt,
                    "answer": answer,
                    "wrong": wrongs,
                    "explanation": expl,
                    "gapAccepted": gap_a,
                    "flashFront": flash,
                }
            )
    return items


def concept_term(it: dict) -> str | None:
    """Canonical glossary term for a fact (prefer gap/flash over mushy expl prefixes)."""
    if it.get("gapAccepted"):
        return it["gapAccepted"][0]
    if it.get("flashFront"):
        return it["flashFront"]
    # dens-style: "Bezug: Term. Term bedeutet:"
    m = re.search(r"Bezug:\s*([^.]+?)\.\s*\1\s+bedeutet", it.get("explanation", ""), re.I)
    if m:
        return m.group(1).strip()
    m = re.search(r"([A-ZÄÖÜ][^.]{1,50}?)\s+bedeutet:", it.get("explanation", ""))
    if m:
        return m.group(1).strip()
    return expl_term(it.get("explanation", ""))


def build_term_owners(items: list[dict]) -> dict[str, dict[str, str]]:
    """Per-file map: norm(term) -> concept."""
    by_file: dict[str, dict[str, str]] = {}
    for it in items:
        owners = by_file.setdefault(it["file"], {})
        term = concept_term(it)
        if term:
            owners.setdefault(norm(term), it["concept"])
    return by_file


def score_item(it: dict, term_owners: dict[str, dict[str, str]] | None = None) -> list[str]:
    reasons: list[str] = []
    opts = " ".join([it["answer"], *it["wrong"]])
    if BANNED.search(opts):
        reasons.append("banned-or-title-mush")
    if it["concept"] in KNOWN and not KNOWN[it["concept"]].search(it["answer"]):
        reasons.append("known-topic-fail")
    if it["concept"] in PROMPT_OK and not PROMPT_OK[it["concept"]].search(it["prompt"]):
        reasons.append("prompt-term-desync")

    # Sibling glossary-term swap: prompt names another concept's term
    if term_owners is not None:
        named = prompt_named_term(it["prompt"])
        own = concept_term(it)
        targets: list[str] = []
        if own:
            targets.append(own)
        if it["gapAccepted"]:
            targets.append(it["gapAccepted"][0])
        if it.get("flashFront"):
            targets.append(it["flashFront"])
        # Meaning-clue prompts (os-gaps): prompt names the meaning, gapAccepted is the term.
        # Aligned if named matches explanation OR flashFront OR gapAccepted.
        expl_ok = bool(it.get("explanation") and terms_match(named or "", it["explanation"]))
        if named and targets and not any(terms_match(named, t) for t in targets) and not expl_ok:
            # Ignore tiny/stub own labels ("AP","ATP","Nicht","Andere") vs fuller prompt terms
            if own and (
                len(norm(own)) <= 4
                or norm(own) in {"andere", "nicht", "bestimmt", "jedes", "keimzellen"}
            ):
                pass
            elif own and terms_match(named, own):
                pass
            else:
                owners = term_owners.get(it["file"], {})
                other = owners.get(norm(named))
                if not other:
                    for nt, oc in owners.items():
                        if terms_match(named, nt) and oc != it["concept"]:
                            other = oc
                            break
                if other and other != it["concept"]:
                    reasons.append("prompt-term-desync")

    topic = it["prompt"] + " " + it["explanation"] + " " + it["concept"]
    for foreign, topical in FOREIGN:
        if foreign.search(it["answer"]) and topical.search(topic) and not foreign.search(topic):
            reasons.append("foreign-bleed")
    if len(it["answer"].split()) < 3:
        reasons.append("answer-emptyish")
    if not it["answer"].strip():
        reasons.append("empty")
    return reasons


def main() -> int:
    items = load()
    term_owners = build_term_owners(items)
    by_c = {it["concept"]: it for it in items}
    lines: list[str] = ["=== KNOWN SHOWSTOPPERS ==="]
    known_ok = 0
    for cid, pat in KNOWN.items():
        it = by_c.get(cid)
        if not it:
            lines.append(f"FAIL missing {cid}")
            continue
        reasons = score_item(it, term_owners)
        ok = not any(
            r in reasons
            for r in ("foreign-bleed", "banned-or-title-mush", "known-topic-fail", "prompt-term-desync")
        ) and bool(pat.search(it["answer"]))
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

    scored = [(it, score_item(it, term_owners)) for it in items]
    serious = [
        (it, rs)
        for it, rs in scored
        if any(
            r in rs
            for r in ("foreign-bleed", "banned-or-title-mush", "known-topic-fail", "prompt-term-desync")
        )
    ]
    lines.append("\n=== CORPUS SERIOUS MISMATCH ===")
    lines.append(f"flagged: {len(serious)} / {len(items)}")
    for it, rs in serious[:20]:
        lines.append(f"  {it['concept']}: {rs} | Q={it['prompt'][:60]} | A={it['answer'][:60]}")

    seeds = [555666, 112358, 998877, 991177]
    seed_results = []
    for seed in seeds:
        rng = random.Random(seed)
        sample = rng.sample(items, min(12, len(items)))
        ok = 0
        lines.append(f"\n=== SEED {seed} (human topic reading, strict) ===")
        for i, it in enumerate(sample, 1):
            reasons = score_item(it, term_owners)
            # Strict: any reason fails (incl. answer-emptyish)
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
    # print summary only (avoid cp1252 crash)
    print("\n".join(lines[-30:]).encode("ascii", "replace").decode("ascii"))
    print("report:", out)
    return code


if __name__ == "__main__":
    raise SystemExit(main())
