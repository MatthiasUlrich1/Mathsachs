# -*- coding: utf-8 -*-
"""Replace stock-bio distractors with same-conceptPrefix sibling answers."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CUR = ROOT / "src" / "curriculum"
FILES = [
    "biologieThinFill.ts",
    "biologieLehrplanGapsFill.ts",
    "biologieOsDensityFill.ts",
    "biologieOsGapsFill.ts",
    "biologieK8K10DensityFill.ts",
]

STOCK = re.compile(
    r"Nur Haarfarbe|Nur Zahnzahl|ohne biologischen Bezug|"
    r"Nur Fotosynthese ohne|Nur Zellatmung ohne|Nur Chemosynthese ohne|"
    r"Nur Landwirtschaft ohne|Nur eine Infektion\.|Nur Vitaminmangel|"
    r"Nur Rhesus negativ immer|Nur Plasma ohne Zellen|"
    r"Nur eine Genmutation in einem Basepaar",
    re.I,
)

FACT_RE = re.compile(
    r"(?P<head>concept:\s*(?P<cq>['\"])(?P<concept>(?:\\.|[^\\\"'])*)(?P=cq)\s*,\s*"
    r"prompt:\s*(?P<pq>['\"])(?P<prompt>(?:\\.|[^\\\"'])*)(?P=pq)\s*,\s*)"
    r"answer:\s*(?P<aq>['\"])(?P<answer>(?:\\.|[^\\\"'])*)(?P=aq)\s*,\s*"
    r"wrong:\s*\[(?P<wrong>[\s\S]*?)\]",
)
PREFIX_RE = re.compile(r'conceptPrefix:\s*(["\'])((?:\\.|[^\\\"\'])*)\1')


def decode(s: str) -> str:
    s = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), s)
    return s.replace("\\n", "\n").replace('\\"', '"').replace("\\'", "'").replace("\\\\", "\\")


def esc(s: str, q: str = '"') -> str:
    return s.replace("\\", "\\\\").replace(q, f"\\{q}").replace("\n", " ").replace("\r", " ")


def ensure_period(s: str) -> str:
    s = s.strip()
    if s and not s.endswith((".", "!", "?")):
        s += "."
    return s


def main() -> int:
    # Never overwrite hand-polished showstoppers
    protect = {
        "bio:k10:blut:ab",
        "bio:k10:erbk:trisomie",
        "bio:lk11:c3c4:10",
    }
    total = 0
    for name in FILES:
        path = CUR / name
        text = path.read_text(encoding="utf-8")
        prefixes = [(m.start(), decode(m.group(2))) for m in PREFIX_RE.finditer(text)]

        def pref_at(pos: int) -> str:
            cur = ""
            for p, pref in prefixes:
                if p <= pos:
                    cur = pref
                else:
                    break
            return cur

        facts = list(FACT_RE.finditer(text))
        meta = []
        by_pref: dict[str, list[int]] = {}
        for i, m in enumerate(facts):
            pref = pref_at(m.start())
            meta.append(
                {
                    "pref": pref,
                    "concept": decode(m.group("concept")),
                    "answer": decode(m.group("answer")),
                    "wrong": [decode(x[1]) for x in re.findall(r"(['\"])((?:\\.|[^\\\"'])*)\1", m.group("wrong"))],
                    "aq": m.group("aq"),
                    "match": m,
                }
            )
            by_pref.setdefault(pref, []).append(i)

        reps = []
        for i, info in enumerate(meta):
            if info["concept"] in protect:
                continue
            if not any(STOCK.search(w) for w in info["wrong"]):
                continue
            siblings = [meta[j]["answer"] for j in by_pref.get(info["pref"], []) if j != i]
            seen = {info["answer"].lower().rstrip(".")}
            wrongs = []
            for s in siblings:
                ss = ensure_period(s)
                k = ss.lower().rstrip(".")
                if k in seen or len(ss.split()) < 2:
                    continue
                seen.add(k)
                wrongs.append(ss)
                if len(wrongs) >= 3:
                    break
            while len(wrongs) < 3:
                wrongs.append(f"Das beschreibt einen anderen Aspekt in diesem Lernbereich ({len(wrongs) + 1}).")
            aq = info["aq"]
            wrong_lit = ", ".join(f"{aq}{esc(w, aq)}{aq}" for w in wrongs[:3])
            repl = f"answer: {aq}{esc(info['answer'], aq)}{aq}, wrong: [{wrong_lit}]"
            m = info["match"]
            reps.append((m.start() + len(m.group("head")), m.end(), repl))
            total += 1

        if not reps:
            print(f"{name}: 0")
            continue
        reps.sort(key=lambda x: x[0], reverse=True)
        new_text = text
        for start, end, repl in reps:
            new_text = new_text[:start] + repl + new_text[end:]
        path.write_text(new_text, encoding="utf-8")
        print(f"{name}: {len(reps)}")
    print(f"total: {total}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
