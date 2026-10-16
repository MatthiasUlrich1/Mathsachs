# -*- coding: utf-8 -*-
"""Rewrite remaining ^(Sie|Er|Es) ist eine TitleCase answers via wissen."""
from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, "tmp")
import rewrite_natural_authorship as nat
import rewrite_glossary_mc_quality_pass6 as p6

ROOT = Path("src/curriculum")
FILES = [
    "physikLehrplanGapsFill.ts",
    "physikOsDensityFill.ts",
    "physikThinFill.ts",
    "biologieThinFill.ts",
    "biologieLehrplanGapsFill.ts",
    "biologieOsDensityFill.ts",
    "biologieOsGapsFill.ts",
    "biologieK8K10DensityFill.ts",
    "geschichteThinFill.ts",
    "geschichteDichteFillPass1.ts",
]
TITLE = re.compile(r"^(Sie|Er|Es) ist eine [A-ZÄÖÜ]")
TITLE_ANY = re.compile(r"\bist eine [A-ZÄÖÜ]")


def ensure_period(s: str) -> str:
    s = re.sub(r"\s+", " ", s).strip()
    return s if re.search(r"[.!?]$", s) else s + "."


def from_wissen(wissen: str, term: str) -> str:
    body = wissen.split("Fachlich")[0].split("Bezug:")[0].split("bedeutet:")[-1].strip(" .")
    if "bedeutet:" in wissen.lower():
        m = re.search(r"bedeutet:\s*(.+?)(?:\.|$)", wissen, re.I)
        if m:
            body = m.group(1).strip()
    body = re.sub(r"\s+", " ", body).strip()
    if not body:
        return ""
    pron = p6.pronoun(term) if term else "Es"
    if re.match(
        r"^(Dient|Lässt|Wandelt|Schützt|Bildet|Steuert|Misst|Gibt|Beschreibt|"
        r"Bedeutet|Ist|Sind|Enthält|Umfasst|Regelt|Erzeugt)\b",
        body,
        re.I,
    ):
        return ensure_period(f"{pron} {p6.lower_first(body)}")
    return ensure_period(f"{pron} beschreibt {p6.lower_first(body)}")


def main() -> None:
    total = 0
    for name in FILES:
        path = ROOT / name
        text = path.read_text(encoding="utf-8")
        reps = []
        for m in nat.FACT_RE.finditer(text):
            concept = nat.decode(m.group(2))
            if "digitalbild:fact:" in concept or "timer-sensor" in concept:
                continue
            if "fact:transparent" in concept:
                continue
            answer = nat.decode(m.group(6))
            wrongs = [nat.decode(w[1]) for w in re.findall(r"(['\"])((?:\\.|[^\\\"'])*)\1", m.group(7))]
            blob = " ".join([answer, *wrongs])
            if not (TITLE.search(answer) or TITLE_ANY.search(blob)):
                continue
            flash = nat.decode(m.group(9)) if m.group(9) else ""
            rest = m.group(0)
            wiss_m = re.search(r"wissen:\s*(['\"])((?:\\.|[^\\\"'])*)\1", rest)
            wissen = nat.decode(wiss_m.group(2)) if wiss_m else ""
            term = re.sub(r"\s*\([^)]*\)\s*$", "", flash).strip()
            pairs = nat.parse_pairs_near(text, m.start())
            meaning = ""
            if pairs:
                for t, mm, ww in pairs:
                    if nat.norm_term(t) == nat.norm_term(term):
                        term, meaning, wissen = t, mm, ww or wissen
                        break
            new_a = from_wissen(wissen, term) if wissen else ""
            if not new_a or TITLE_ANY.search(new_a) or len(new_a.split()) < 6:
                if meaning:
                    new_a = nat.natural_answer(term, meaning, wissen, concept)
            if not new_a or TITLE_ANY.search(new_a) or len(new_a.split()) < 6:
                continue
            # rebuild wrongs if any title mush
            new_w = []
            for w in wrongs:
                if TITLE_ANY.search(w) or re.match(r"^(Sie|Er|Es) ist (eine|ein)\b", w, re.I):
                    continue
                new_w.append(w)
            sibs = nat.sibling_answers(term, pairs, 3, concept) if pairs else []
            for s in sibs:
                if s.lower() == new_a.lower() or TITLE_ANY.search(s):
                    continue
                if s.lower() not in {x.lower() for x in new_w}:
                    new_w.append(s)
                if len(new_w) >= 3:
                    break
            if len(new_w) < 3:
                continue
            new_w = new_w[:3]
            prompt = nat.decode(m.group(4))
            nb = m.group(0)
            wl = ", ".join(f'"{nat.esc(w)}"' for w in new_w)
            nb = re.sub(
                r"answer:\s*(['\"])(?:\\.|[^\\\"'])*\1\s*,\s*wrong:\s*\[[\s\S]*?\]",
                f'answer: "{nat.esc(new_a)}", wrong: [{wl}]',
                nb,
                count=1,
            )
            reps.append((m.start(), m.end(), nb))
            total += 1
        if reps:
            parts = []
            last = 0
            for s, e, b in reps:
                parts.append(text[last:s])
                parts.append(b)
                last = e
            parts.append(text[last:])
            path.write_text("".join(parts), encoding="utf-8", newline="\n")
            print(f"{name}: {len(reps)}")
    print("TOTAL", total)


if __name__ == "__main__":
    main()
