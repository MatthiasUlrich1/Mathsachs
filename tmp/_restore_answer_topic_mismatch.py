# -*- coding: utf-8 -*-
"""
Restore corrupted locked-fill MC answers from tag v0.28.112 (71d6210).

Detects answer≠term/topic mismatches (bulk rewrite swaps) and restores
answer + wrong arrays from the clean tag. Protects Timer/Sensor/Transparent
and digitalbild hand-gold. Optionally soft-upgrades short restored answers
into full German sentences without borrowing foreign-topic text.
"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CUR = ROOT / "src" / "curriculum"
TAG = "v0.28.112"

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

FACT_RE = re.compile(
    r"(?P<head>concept:\s*(?P<cq>['\"])(?P<concept>(?:\\.|[^\\\"'])*)(?P=cq)\s*,\s*"
    r"prompt:\s*(?P<pq>['\"])(?P<prompt>(?:\\.|[^\\\"'])*)(?P=pq)\s*,\s*)"
    r"answer:\s*(?P<aq>['\"])(?P<answer>(?:\\.|[^\\\"'])*)(?P=aq)\s*,\s*"
    r"wrong:\s*\[(?P<wrong>[\s\S]*?)\]",
)

# Gold: never overwrite from tag
GOLD_PREFIXES = (
    "ph:gap:ph-k6-lb1-lichtverschmutzung:fact:timer-sensor",
    "ph:gap:ph-k6-lb1-lichtverschmutzung:fact:richtlinie",
    "ph:gap:ph-k6-lb1-lichtverschmutzung:fact:blendung",
    "ph:gap:ph-k6-lb1-lichtverschmutzung:fact:dunkelheit",
    "ph:gap:ph-k6-lb1-lichtdurchlaessigkeit:fact:transparent",
    "ph:gap:ph-k6-lb1-lichtdurchlaessigkeit:fact:transluzent",
    "ph:gap:ph-k6-lb1-lichtdurchlaessigkeit:fact:opak",
)
GOLD_SUBSTR = ("digitalbild:fact:",)

# Hand-authored digitalbild Sensor wrongs (natural, non-pad)
DIGITALBILD_SENSOR = {
    "concept": "ph:gap:ph-k6-lb1-digitalbild:fact:sensor",
    "prompt": "Wozu dient der Bildsensor bei der digitalen Bildentstehung?",
    "answer": "Er wandelt auftreffendes Licht in ein elektrisches Signal um, etwa in CCD- oder CMOS-Chips.",
    "wrong": [
        "Es ist der kleinste Bildpunkt eines Rasters, aus dem das digitale Bild aufgebaut ist.",
        "Sie gibt an, wie viele Bildpunkte pro Fläche das Detailreichtum bestimmen.",
        "Sie wandelt analoge Helligkeitswerte in speicherbare Zahlenwerte um.",
    ],
}

STOP = {
    "der", "die", "das", "ein", "eine", "einer", "eines", "einem", "einen",
    "und", "oder", "mit", "von", "vom", "zum", "zur", "für", "auf", "aus",
    "bei", "ist", "sind", "hat", "wird", "werden", "als", "auch", "nur",
    "nicht", "sich", "den", "dem", "des", "im", "in", "an", "am", "zu",
    "wie", "so", "etwa", "oft", "sehr", "kann", "über", "nach", "vor",
    "ohne", "durch", "gegen", "beim", "ins", "ihr", "ihre", "ihren",
    "sie", "er", "es", "wir", "man", "dass", "wenn", "weil", "aber",
    "noch", "schon", "mehr", "weniger", "zwischen", "sowie", "bzw",
    "bezug", "bedeutet", "beschreibt", "kennzeichnet", "meint", "fachlich",
    "themenspezifisch", "einordnen", "merke",
}

TITLE_MUSH = re.compile(
    r"\b(?:Sie|Er|Es)\s+beschreibt\s+ein(?:e)?\s+[A-ZÄÖÜ]"
)
IST_EINE_TITLE = re.compile(r"\bist eine [A-ZÄÖÜ]")
BESCHREIBT_TITLE = re.compile(r"\bbeschreibt ein(?:e)? [A-ZÄÖÜ]")


def decode(s: str) -> str:
    s = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), s)
    out: list[str] = []
    i = 0
    while i < len(s):
        if s[i] == "\\" and i + 1 < len(s):
            nxt = s[i + 1]
            mapping = {"n": "\n", "t": "\t", "r": "\r", '"': '"', "'": "'", "\\": "\\"}
            out.append(mapping.get(nxt, nxt))
            i += 2
            continue
        out.append(s[i])
        i += 1
    return "".join(out)


def esc(s: str, q: str = '"') -> str:
    return (
        s.replace("\\", "\\\\")
        .replace(q, f"\\{q}")
        .replace("\n", " ")
        .replace("\r", " ")
    )


def tokens(s: str) -> set[str]:
    words = re.findall(r"[A-Za-zÄÖÜäöüß0-9]{3,}", s.lower())
    return {w for w in words if w not in STOP}


def overlap(a: set[str], b: set[str]) -> float:
    if not a or not b:
        return 0.0
    return len(a & b) / max(1, min(len(a), len(b)))


def git_show(path: str) -> str:
    r = subprocess.run(
        ["git", "show", f"{TAG}:{path}"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    if r.returncode != 0:
        raise RuntimeError(f"git show failed for {path}: {r.stderr[:200]}")
    return r.stdout


def parse_wrongs(blob: str) -> list[str]:
    return [decode(m.group(2)) for m in re.finditer(r"(['\"])((?:\\.|[^\\\"'])*)\1", blob)]


def parse_facts(text: str) -> dict[str, dict]:
    out: dict[str, dict] = {}
    for m in FACT_RE.finditer(text):
        concept = decode(m.group("concept"))
        out[concept] = {
            "prompt": decode(m.group("prompt")),
            "answer": decode(m.group("answer")),
            "wrong": parse_wrongs(m.group("wrong")),
            "span": (m.start(), m.end()),
            "aq": m.group("aq"),
            "match": m,
        }
    return out


def extract_ref_blob(text: str, concept: str) -> str:
    """Pull explanation/wissen near a concept for topic anchoring."""
    # Find concept occurrence and take following ~800 chars of related fields
    idx = text.find(f'"{concept}"')
    if idx < 0:
        idx = text.find(f"'{concept}'")
    if idx < 0:
        return ""
    chunk = text[idx : idx + 1200]
    parts = []
    for key in ("explanation", "wissen", "gap", "flashFront"):
        mm = re.search(
            rf"{key}:\s*(?:fw\()?(['\"])((?:\\.|[^\\\"'])*)\1",
            chunk,
        )
        if mm:
            parts.append(decode(mm.group(2)))
    return " ".join(parts)


def is_gold(concept: str) -> bool:
    if concept in GOLD_PREFIXES or any(concept.startswith(p) for p in GOLD_PREFIXES):
        return True
    return any(s in concept for s in GOLD_SUBSTR)


def needs_restore(concept: str, cur: dict, old: dict, cur_ref: str, old_ref: str, all_old: dict) -> str | None:
    """Return reason string if answer should be restored from tag."""
    if is_gold(concept):
        return None
    ca, oa = cur["answer"], old["answer"]
    ca_t, oa_t = tokens(ca), tokens(oa)
    ref_blob = cur_ref + " " + old_ref + " " + oa
    ref_t = tokens(ref_blob)

    # Famous-name / DNA bleed into blood bank etc. (hard showstoppers)
    foreign_markers = [
        (r"Franklin|Röntgenbeugung|Doppelhelix|Watson|Crick", r"Blut|Antigen|Rhesus|AB0|Transfusion"),
        (r"Geschlechtschromosom|\bXX\b|\bXY\b|Autosom", r"Trisomie|Down|Chromosom 21"),
        (r"Hydrolase|Kompetitiv|Lineweaver|Coenzym|Vmax|Enzymklasse", r"C3|C4|CAM|Rubisco|Photorespiration|Anpassung|Calvin"),
        (r"Franklin|Röntgen", r"Trisomie|Blutgruppe"),
        (r"Antigene A/B|AB0-Gruppe|Rhesus", r"Geschlechtschromosom|\bXX\b|\bXY\b|Autosom"),
        (r"Calvin|Rubisco|C3-Verbindung|Photorespiration", r"Glykolyse|Citratzyklus|Atmungskette|Chemiosmose|NADH"),
    ]
    for foreign, topic in foreign_markers:
        if re.search(foreign, ca) and re.search(topic, ref_blob, re.I):
            if not re.search(foreign, oa):
                return f"foreign-marker:{foreign[:24]}"

    if ca.strip() == oa.strip():
        return None

    # Own-topic fit vs cross-topic: answer matches another concept better
    own_fit = max(overlap(ca_t, oa_t), overlap(ca_t, ref_t))
    best_other = 0.0
    best_other_c = ""
    for oc, of in all_old.items():
        if oc == concept:
            continue
        sc = overlap(ca_t, tokens(of["answer"]))
        if sc > best_other:
            best_other = sc
            best_other_c = oc

    # Clear bank-shift: current answer ≈ some other concept's old answer
    if best_other >= 0.55 and own_fit < 0.4:
        return f"cross-topic→{best_other_c}"
    if best_other >= 0.4 and own_fit < 0.2 and len(oa_t) >= 2:
        return f"cross-topic→{best_other_c}"

    # Title-Case beschreibt/ist-eine mush with foreign content
    if TITLE_MUSH.search(ca) or BESCHREIBT_TITLE.search(ca):
        if own_fit < 0.45 and overlap(ca_t, oa_t) < 0.4:
            return "beschreibt-title-mush"
    if IST_EINE_TITLE.search(ca) and own_fit < 0.4 and overlap(ca_t, oa_t) < 0.35:
        return "ist-eine-title-mush"

    # Near-identical wrongs cloned across a whole bank (all facts share same answer)
    # Handled at bank level separately — skip here.

    return None


def soft_sentence(answer: str, prompt: str) -> str:
    """Keep restored tag text intact; only ensure terminal punctuation."""
    del prompt  # unused — no invented wrappers
    a = answer.strip()
    if not a:
        return a
    if not a.endswith((".", "!", "?")):
        a = a + "."
    return a


def try_unwrap_mush(answer: str, old_answer: str, ref: str) -> str | None:
    """If beschreibt/ist-eine Title mush wraps own-topic content, unwrap it."""
    m = re.match(
        r"^(?:Sie|Er|Es)\s+beschreibt\s+ein(?:e)?\s+(.+)$",
        answer.strip(),
    )
    if not m:
        m = re.match(r"^(?:Sie|Er|Es)\s+ist\s+eine?\s+(.+)$", answer.strip())
    if not m:
        return None
    inner = m.group(1).strip()
    # Drop trailing mush commas that repeat tips
    inner = re.sub(r",\s*[a-zäöü].{0,40}$", "", inner).strip()
    if not inner:
        return None
    it = tokens(inner)
    ot = tokens(old_answer + " " + ref)
    if overlap(it, ot) >= 0.35 or overlap(it, tokens(old_answer)) >= 0.4:
        if not inner.endswith((".", "!", "?")):
            inner = inner + "."
        if inner[0].islower():
            inner = inner[0].upper() + inner[1:]
        return inner
    return None


def format_fact_tail(answer: str, wrongs: list[str], aq: str = '"') -> str:
    wq = aq
    wrong_lit = ", ".join(f"{wq}{esc(w, wq)}{wq}" for w in wrongs)
    return f"answer: {aq}{esc(answer, aq)}{aq}, wrong: [{wrong_lit}]"


def main() -> int:
    dry = "--dry" in sys.argv
    stats: dict[str, int] = {}
    samples: list[str] = []
    total_restore = 0

    for name in FILES:
        path = CUR / name
        rel = f"src/curriculum/{name}"
        cur_text = path.read_text(encoding="utf-8")
        try:
            old_text = git_show(rel)
        except RuntimeError as e:
            print(f"SKIP {name}: {e}")
            continue
        cur_facts = parse_facts(cur_text)
        old_facts = parse_facts(old_text)
        # Build replacement list (end→start so offsets stay valid)
        replacements: list[tuple[int, int, str, str]] = []

        for concept, cur in cur_facts.items():
            # Force digitalbild Sensor gold
            if concept == DIGITALBILD_SENSOR["concept"]:
                m = cur["match"]
                # replace prompt+answer+wrong
                new_block = (
                    f'concept: "{concept}",\n'
                    f'      prompt: "{esc(DIGITALBILD_SENSOR["prompt"])}",\n'
                    f'      {format_fact_tail(DIGITALBILD_SENSOR["answer"], DIGITALBILD_SENSOR["wrong"])}'
                )
                # Only replace answer+wrong portion (keep concept line structure)
                ans_start = m.start() + len(m.group("head"))
                replacements.append(
                    (
                        ans_start,
                        m.end(),
                        format_fact_tail(
                            DIGITALBILD_SENSOR["answer"],
                            DIGITALBILD_SENSOR["wrong"],
                            cur["aq"],
                        ),
                        "digitalbild-sensor-gold",
                    )
                )
                # Also fix prompt if drifted
                if cur["prompt"] != DIGITALBILD_SENSOR["prompt"]:
                    # replace prompt inside head — handled separately below via full rewrite of head
                    pass
                stats["digitalbild-sensor"] = stats.get("digitalbild-sensor", 0) + 1
                continue

            old = old_facts.get(concept)
            if not old:
                continue
            cur_ref = extract_ref_blob(cur_text, concept)
            old_ref = extract_ref_blob(old_text, concept)
            ref_blob = cur_ref + " " + old_ref

            # Prefer unwrap of own-topic Title mush before full tag restore
            unwrapped = try_unwrap_mush(cur["answer"], old["answer"], ref_blob)
            mushy = bool(
                TITLE_MUSH.search(cur["answer"])
                or BESCHREIBT_TITLE.search(cur["answer"])
                or IST_EINE_TITLE.search(cur["answer"])
                or any(
                    TITLE_MUSH.search(w) or BESCHREIBT_TITLE.search(w) or IST_EINE_TITLE.search(w)
                    for w in cur["wrong"]
                )
            )
            if unwrapped and unwrapped != cur["answer"]:
                reason = "unwrap-mush"
                new_answer = unwrapped
                new_wrongs = list(cur["wrong"][:3])
                if any(BESCHREIBT_TITLE.search(w) or TITLE_MUSH.search(w) or IST_EINE_TITLE.search(w) for w in new_wrongs):
                    new_wrongs = [soft_sentence(w, cur["prompt"]) for w in old["wrong"][:3]]
                while len(new_wrongs) < 3:
                    pad = (
                        soft_sentence(old["wrong"][len(new_wrongs) % max(1, len(old["wrong"]))], cur["prompt"])
                        if old["wrong"]
                        else "Andere fachliche Aussage."
                    )
                    new_wrongs.append(pad)
            else:
                reason = needs_restore(concept, cur, old, cur_ref, old_ref, old_facts)
                if not reason and mushy:
                    # Hard ban: any residual beschreibt/ist-eine Title mush → restore from tag
                    reason = "residual-title-mush"
                if not reason:
                    continue
                new_answer = soft_sentence(old["answer"], cur["prompt"])
                new_wrongs = [soft_sentence(w, cur["prompt"]) for w in old["wrong"][:3]]
                while len(new_wrongs) < 3:
                    new_wrongs.append("Andere fachliche Aussage.")

            # Deduplicate wrongs vs answer
            cleaned: list[str] = []
            seen = {new_answer.lower().rstrip(".")}
            for w in new_wrongs:
                key = w.lower().rstrip(".")
                if key in seen:
                    continue
                seen.add(key)
                cleaned.append(w)
            while len(cleaned) < 3:
                cleaned.append(f"Andere fachliche Aussage ({len(cleaned) + 1}).")
            new_wrongs = cleaned[:3]

            m = cur["match"]
            ans_start = m.start() + len(m.group("head"))
            replacements.append(
                (
                    ans_start,
                    m.end(),
                    format_fact_tail(new_answer, new_wrongs, cur["aq"]),
                    reason,
                )
            )
            total_restore += 1
            stats[reason.split("→")[0].split(":")[0]] = (
                stats.get(reason.split("→")[0].split(":")[0], 0) + 1
            )
            if len(samples) < 25:
                samples.append(
                    f"{name} | {concept}\n  reason: {reason}\n  OLD: {old['answer'][:100]}\n  BAD: {cur['answer'][:100]}\n  NEW: {new_answer[:100]}"
                    .replace("\u2192", "->")
                    .replace("\u2248", "~=")
                )

        if not replacements:
            print(f"{name}: 0 restores")
            continue

        # Apply from end
        replacements.sort(key=lambda x: x[0], reverse=True)
        new_text = cur_text
        for start, end, repl, _reason in replacements:
            new_text = new_text[:start] + repl + new_text[end:]

        # Fix digitalbild sensor prompt if needed
        db = DIGITALBILD_SENSOR
        new_text = re.sub(
            rf'(concept:\s*["\']{re.escape(db["concept"])}["\']\s*,\s*prompt:\s*["\'])((?:\\.|[^\\\"\'])*)(["\'])',
            lambda m: m.group(1) + esc(db["prompt"], m.group(3)) + m.group(3),
            new_text,
            count=1,
        )

        if not dry:
            path.write_text(new_text, encoding="utf-8")
        print(f"{name}: {len(replacements)} restores")

    print("\n=== SUMMARY ===")
    print(f"total_restore~={total_restore}")
    for k, v in sorted(stats.items(), key=lambda kv: -kv[1]):
        print(f"  {k}: {v}")
    print("\n=== SAMPLES ===")
    print("\n\n".join(samples))
    report = ROOT / "tmp" / "_restore_mismatch_report.txt"
    report.write_text(
        f"total={total_restore}\nstats={stats}\n\n" + "\n\n".join(samples),
        encoding="utf-8",
    )
    print("report:", report)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
