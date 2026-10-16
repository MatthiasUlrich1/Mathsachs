# -*- coding: utf-8 -*-
"""
Cleanup after soft-upgrade: restore answers from v0.28.112 when current answer
shows Es-meint / bedeutet-double mush. Protect gold. Then polish 3 showstoppers.
"""
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

FACT_RE = re.compile(
    r"(?P<head>concept:\s*(?P<cq>['\"])(?P<concept>(?:\\.|[^\\\"'])*)(?P=cq)\s*,\s*"
    r"prompt:\s*(?P<pq>['\"])(?P<prompt>(?:\\.|[^\\\"'])*)(?P=pq)\s*,\s*)"
    r"answer:\s*(?P<aq>['\"])(?P<answer>(?:\\.|[^\\\"'])*)(?P=aq)\s*,\s*"
    r"wrong:\s*\[(?P<wrong>[\s\S]*?)\]",
)

GOLD_SUB = ("digitalbild:fact:", "lichtverschmutzung:fact:timer-sensor",
            "lichtdurchlaessigkeit:fact:transparent",
            "lichtdurchlaessigkeit:fact:transluzent",
            "lichtdurchlaessigkeit:fact:opak")

BAD = re.compile(
    r"^Es meint [a-zäöü]|"
    r"bedeutet:|"
    r"^Es dient dazu, [a-zäöü].*bedeutet|"
    r"Es meint nur ",
    re.I,
)

# Hand-polished showstoppers (topic-true, natural)
HAND = {
    "bio:k10:blut:ab": {
        "prompt": "Was kennzeichnet Blutgruppe AB?",
        "answer": "Sie trägt Antigene A und B kodominant auf den Erythrozyten.",
        "wrong": [
            "Sie trägt keine A/B-Antigene und gilt vereinfacht als Universalspender.",
            "Sie trägt nur Antigen A, aber kein Antigen B.",
            "Sie trägt nur den Rhesusfaktor ohne AB0-Antigene.",
        ],
    },
    "bio:k10:erbk:trisomie": {
        "prompt": "Was ist Trisomie 21?",
        "answer": "Bei Trisomie 21 liegt Chromosom 21 dreifach vor (Down-Syndrom als Genommutation).",
        "wrong": [
            "Nur ein einzelnes Basepaar in einem Gen ist ausgetauscht.",
            "Es handelt sich um eine Infektionskrankheit ohne Chromosomenbezug.",
            "Ursache ist ein reiner Vitaminmangel ohne Erbänderung.",
        ],
    },
    "bio:lk11:c3c4:10": {
        "prompt": "Was bedeutet Anpassung bei C3-, C4- und CAM-Pflanzen?",
        "answer": "Der Lebensraum diktiert die Strategie der CO2-Fixierung und Wasserersparnis.",
        "wrong": [
            "CO2 wird immer nur direkt mit Rubisco im Calvin-Zyklus fixiert.",
            "C4 trennt die Fixierung nur zeitlich wie CAM nachts/tags.",
            "Photorespiration ist bei Hitze immer der effizienteste Weg.",
        ],
    },
    "ph:gap:ph-k6-lb1-digitalbild:fact:sensor": {
        "prompt": "Wozu dient der Bildsensor bei der digitalen Bildentstehung?",
        "answer": "Er wandelt auftreffendes Licht in ein elektrisches Signal um, etwa in CCD- oder CMOS-Chips.",
        "wrong": [
            "Es ist der kleinste Bildpunkt eines Rasters, aus dem das digitale Bild aufgebaut ist.",
            "Sie gibt an, wie viele Bildpunkte pro Fläche das Detailreichtum bestimmen.",
            "Sie wandelt analoge Helligkeitswerte in speicherbare Zahlenwerte um.",
        ],
    },
}


def decode(s: str) -> str:
    s = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), s)
    out = []
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
    return s.replace("\\", "\\\\").replace(q, f"\\{q}").replace("\n", " ").replace("\r", " ")


def ensure_period(s: str) -> str:
    s = s.strip()
    if s and not s.endswith((".", "!", "?")):
        s += "."
    return s


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
        raise RuntimeError(r.stderr[:200])
    return r.stdout


def parse_facts(text: str) -> dict[str, dict]:
    out = {}
    for m in FACT_RE.finditer(text):
        out[decode(m.group("concept"))] = {
            "answer": decode(m.group("answer")),
            "wrong": [decode(x[1]) for x in re.findall(r"(['\"])((?:\\.|[^\\\"'])*)\1", m.group("wrong"))],
            "match": m,
            "aq": m.group("aq"),
        }
    return out


def fmt(answer: str, wrongs: list[str], aq: str) -> str:
    wrong_lit = ", ".join(f"{aq}{esc(w, aq)}{aq}" for w in wrongs[:3])
    return f"answer: {aq}{esc(answer, aq)}{aq}, wrong: [{wrong_lit}]"


def is_gold(c: str) -> bool:
    return any(s in c for s in GOLD_SUB)


def main() -> int:
    restored = 0
    for name in FILES:
        path = CUR / name
        rel = f"src/curriculum/{name}"
        cur = path.read_text(encoding="utf-8")
        old = git_show(rel)
        cur_f = parse_facts(cur)
        old_f = parse_facts(old)
        reps: list[tuple[int, int, str]] = []
        for concept, info in cur_f.items():
            m = info["match"]
            aq = info["aq"]
            if concept in HAND:
                h = HAND[concept]
                # Also fix prompt
                reps.append(
                    (
                        m.start() + len(m.group("head")),
                        m.end(),
                        fmt(h["answer"], h["wrong"], aq),
                        concept,
                    )
                )
                # prompt replace separately later
                continue
            if is_gold(concept):
                continue
            tagged = old_f.get(concept)
            if not tagged:
                continue
            ans = info["answer"]
            needs = bool(BAD.search(ans)) or any(BAD.search(w) for w in info["wrong"])
            # Also restore if Es meint wrap of short fragment
            if re.match(r"^Es meint .{1,80}\.$", ans) and len(ans.split()) < 12:
                needs = True
            if not needs:
                continue
            new_ans = ensure_period(tagged["answer"])
            new_wr = [ensure_period(w) for w in tagged["wrong"][:3]]
            while len(new_wr) < 3:
                new_wr.append("Andere fachliche Aussage.")
            reps.append((m.start() + len(m.group("head")), m.end(), fmt(new_ans, new_wr, aq), concept))
            restored += 1

        # Apply
        # Deduplicate by start (HAND may overlap)
        by_start: dict[int, tuple[int, int, str]] = {}
        for start, end, repl, _c in reps:
            by_start[start] = (start, end, repl)
        ordered = sorted(by_start.values(), key=lambda x: x[0], reverse=True)
        new_text = cur
        for start, end, repl in ordered:
            new_text = new_text[:start] + repl + new_text[end:]


        # Fix HAND prompts
        for concept, h in HAND.items():
            new_text = re.sub(
                rf'(concept:\s*["\']{re.escape(concept)}["\']\s*,\s*prompt:\s*)(["\'])((?:\\.|[^\\\"\'])*)\2',
                lambda m, hh=h: m.group(1) + m.group(2) + esc(hh["prompt"], m.group(2)) + m.group(2),
                new_text,
                count=1,
            )

        path.write_text(new_text, encoding="utf-8")
        print(f"{name}: cleaned {len(ordered)}")

    print(f"restored_from_112_mush: {restored}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
