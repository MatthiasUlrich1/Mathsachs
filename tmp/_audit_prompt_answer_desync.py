# -*- coding: utf-8 -*-
"""Audit prompt↔answer/gapAccepted desync in locked fill banks vs v0.28.112."""
from __future__ import annotations

import re
import subprocess
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

FACT = re.compile(
    r"concept:\s*(['\"])((?:\\.|[^\\\"'])*)\1\s*,\s*"
    r"prompt:\s*(['\"])((?:\\.|[^\\\"'])*)\3\s*,\s*"
    r"answer:\s*(['\"])((?:\\.|[^\\\"'])*)\5\s*,\s*"
    r"wrong:\s*\[([\s\S]*?)\]",
)

SIMPLE = re.compile(
    r"(?:Welche Eigenschaft hat (?:die|das|den|der|ein|eine)|"
    r"Woran erkennt man (?:die|das|den|der|ein|eine)|"
    r"Wozu dient (?:die|das|den|der|ein|eine)|"
    r"Was bewirkt (?:die|das|den|der|ein|eine)|"
    r"Mit welchen Mitteln arbeitet (?:die|das|den|der|ein|eine)|"
    r"Was kennzeichnet (?:die|das|den|der|ein|eine)|"
    r"Wofür steht (?:die|das|den|der|ein|eine))\s+(.+?)\s*\??\s*$",
    re.I,
)
QUOTE = re.compile(r"[„\"“]([^„\"”]{2,80})[“\"”]")
WAS_BED = re.compile(
    r"(?:Was bedeutet|Was beschreibt|Fachbegriff:\s*Was bedeutet)\s+[„\"“]?([^„\"”?\n]{2,80})[“\"”]?\s*\??\s*$",
    re.I,
)
COLON_TOPIC = re.compile(
    r"^[^:]{2,60}:\s*(?:Was bedeutet|Was beschreibt)\s+[„\"“]?([^„\"”?\n]{2,80})",
    re.I,
)


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


def norm(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"[\"„“”']", "", s)
    s = re.sub(r"\s*\([^)]*\)\s*", " ", s)
    return re.sub(r"\s+", " ", s).strip(" .?!,;:")


def prompt_term(p: str) -> str | None:
    m = QUOTE.search(p)
    if m:
        return m.group(1).strip()
    m = COLON_TOPIC.search(p.strip())
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
    m = re.match(r"^([^:]{2,80}):\s", e.strip())
    if m:
        return m.group(1).strip()
    return None


def terms_match(a: str, b: str) -> bool:
    na, nb = norm(a), norm(b)
    if not na or not nb:
        return False
    if na == nb:
        return True
    if na in nb or nb in na:
        return True
    # token overlap for multi-word
    ta, tb = set(na.split()), set(nb.split())
    if ta and tb and len(ta & tb) / max(1, min(len(ta), len(tb))) >= 0.6:
        return True
    return False


def extract_tail_fields(chunk: str) -> dict:
    out = {"explanation": "", "wissen": "", "gap": "", "gapAccepted": [], "flashFront": ""}
    for key in ("explanation", "wissen", "gap", "flashFront"):
        mm = re.search(rf"{key}:\s*(?:fw\()?(['\"])((?:\\.|[^\\\"'])*)\1", chunk)
        if mm:
            out[key] = decode(mm.group(2))
    gm = re.search(r"gapAccepted:\s*\[([\s\S]*?)\]", chunk)
    if gm:
        out["gapAccepted"] = [
            decode(x[1]) for x in re.findall(r"(['\"])((?:\\.|[^\\\"'])*)\1", gm.group(1))
        ]
    return out


def load_facts(text: str) -> list[dict]:
    items = []
    for m in FACT.finditer(text):
        concept = decode(m.group(2))
        prompt = decode(m.group(4))
        answer = decode(m.group(6))
        wrongs = [decode(w[1]) for w in re.findall(r"(['\"])((?:\\.|[^\\\"'])*)\1", m.group(7))]
        # find object end roughly: next concept or closing
        chunk = text[m.end() : m.end() + 900]
        # stop at next concept:
        stop = re.search(r"\n\s*(?:\{?\s*)?concept:\s*['\"]", chunk)
        if stop:
            chunk = chunk[: stop.start()]
        fields = extract_tail_fields(chunk)
        items.append(
            {
                "concept": concept,
                "prompt": prompt,
                "answer": answer,
                "wrong": wrongs,
                "span": (m.start(), m.end()),
                "match": m,
                **fields,
                "full_start": m.start(),
            }
        )
    return items


def git_show(rel: str) -> str:
    r = subprocess.run(
        ["git", "show", f"{TAG}:{rel}"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    if r.returncode != 0:
        raise RuntimeError(r.stderr[:300])
    return r.stdout


def is_desync(it: dict) -> str | None:
    pt = prompt_term(it["prompt"])
    if not pt:
        return None
    targets: list[str] = []
    if it["gapAccepted"]:
        targets.append(it["gapAccepted"][0])
    et = expl_term(it["explanation"])
    if et:
        targets.append(et)
    if it.get("flashFront"):
        targets.append(it["flashFront"])
    if not targets:
        return None
    if any(terms_match(pt, t) for t in targets):
        return None
    # Also: prompt term matches answer text as definition label? rare
    # Desync if prompt term looks like a sibling concept term
    return f"prompt={pt!r} vs target={targets[0]!r}"


def main() -> int:
    all_m: list[tuple[str, dict, str]] = []
    by_file: dict[str, int] = {}
    for name in FILES:
        path = CUR / name
        text = path.read_text(encoding="utf-8")
        facts = load_facts(text)
        n = 0
        for it in facts:
            reason = is_desync(it)
            if reason:
                all_m.append((name, it, reason))
                n += 1
        by_file[name] = n
        print(f"{name}: {n} desync / {len(facts)} facts")

    print(f"\nTOTAL desync: {len(all_m)}")
    print("\n=== EXAMPLES ===")
    for name, it, reason in all_m[:30]:
        print(f"{name} | {it['concept']}")
        print(f"  {reason}")
        print(f"  Q: {it['prompt'][:90]}")
        print(f"  A: {it['answer'][:70]}")
        print(f"  expl: {it['explanation'][:70]}")
        print(f"  gapA: {it['gapAccepted']}")

    out = ROOT / "tmp" / "_prompt_answer_desync_report.txt"
    lines = [f"total={len(all_m)}", f"by_file={by_file}", ""]
    for name, it, reason in all_m:
        lines.append(
            f"{name}\t{it['concept']}\t{reason}\tQ={it['prompt'][:80]}\tA={it['answer'][:60]}"
        )
    out.write_text("\n".join(lines), encoding="utf-8")
    print("report:", out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
