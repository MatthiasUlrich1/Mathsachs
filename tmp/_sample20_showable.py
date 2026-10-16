# -*- coding: utf-8 -*-
"""Independent random sample of 20 locked MC facts — seed ≠ prior audit."""
from __future__ import annotations

import random
import re
from pathlib import Path

FILES = [
    "biologieThinFill.ts",
    "biologieLehrplanGapsFill.ts",
    "biologieOsDensityFill.ts",
    "biologieOsGapsFill.ts",
    "biologieK8K10DensityFill.ts",
    "physikThinFill.ts",
    "physikLehrplanGapsFill.ts",
    "physikOsDensityFill.ts",
    "geschichteThinFill.ts",
    "geschichteDichteFillPass1.ts",
]

FACT = re.compile(
    r"concept:\s*(['\"])(?P<concept>(?:\\.|[^\\\"'])*)\1\s*,\s*"
    r"prompt:\s*(['\"])(?P<prompt>(?:\\.|[^\\\"'])*)\3\s*,\s*"
    r"answer:\s*(['\"])(?P<answer>(?:\\.|[^\\\"'])*)\5\s*,\s*"
    r"wrong:\s*\[(?P<wrong>[\s\S]*?)\]",
)

STOCK = re.compile(
    r"Hormone in Drüsen|Primärharn|Synapsen von einer Nervenzelle|"
    r"teilt staatliche Macht in Legislative|"
    r"Überrest oder eine Tradition, die über die Vergangenheit|"
    r"Wirtschaftseinbruch ab 1929 mit Massenarbeitslosigkeit|"
    r"Stromkreis bei Überstrom und schützt|"
    r"v = s / t geschrieben|"
    r"typische Funktion von|ordnet Merkmale von|"
    r"trifft eher auf|Fachlich gehört dazu|"
    r"wäre richtig für einen anderen Begriff|"
    r"gibt eine falsche Funktion|"
    r"ist als Antwort zu .+ ungeeignet|"
    r"bei den behandelten Arten|"
    r"\bNur Haarfarbe\b|\bNur Zahnzahl\b|ohne biologischen Bezug|"
    r"Nur Fotosynthese ohne biologischen Bezug|"
    r"\bEs ist eine Nur\b|\bSie ist eine Nur\b|\bEr ist eine Nur\b",
    re.I,
)
BROKEN = re.compile(
    r"beschreibt [a-zäöü](?!(?:der|die|das|den|dem|des|ein|eine|einen|einem|einer)\b)|"
    r"kennzeichnet das Hängt|kennzeichnet die Gilt|kennzeichnet das Gilt|die Dient|"
    r"\?\?\?|Es handelt sich um das [A-ZÄÖÜ]|"
    r"bildet einen fachlichen Kern|bezeichnet die Ist |bezeichnet das Ist |"
    r"nennt in .+ einen anderen Teilaspekt|BotenRNAA|AIDS Mechanismus|"
    r"\b(?:ge|ph|bi|bio)-k?\d+-|"  # topic-id leak
    r"\(Begriff [^)]+, [a-z0-9-]{3,}\)|"
    r"Es ist eine Erbgänge|Es ist eine Lebensraum diktiert|"
    r"Es beschreibt ein Zwei Membranen",
    re.I,
)
TITLE_AFTER_IST_EINE = re.compile(r"\bist eine [A-ZÄÖÜ]")
WEAK_STEM = re.compile(r"^Was beschreibt\s+\S+\?\s*$", re.I)


def unesc(s: str) -> str:
    return bytes(s, "utf-8").decode("unicode_escape") if "\\u" in s else s


def judge(prompt: str, answer: str, wrongs: list[str]) -> tuple[str, list[str]]:
    reasons = []
    blob = " ".join([prompt, answer, *wrongs])
    if WEAK_STEM.match(prompt.strip()):
        reasons.append("weak-stem")
    if BROKEN.search(answer):
        reasons.append("broken-answer")
    if STOCK.search(blob):
        reasons.append("stock-mush")
    if TITLE_AFTER_IST_EINE.search(blob):
        reasons.append("title-after-ist-eine")
    if TITLE_AFTER_IST_EINE.search(answer) or re.search(
        r"\bist ein [A-ZÄÖÜ][a-zäöüß]+ [A-ZÄÖÜ]", answer
    ):
        reasons.append("pronoun-ist-eine-title")
    if len(answer.split()) < 6:
        reasons.append("short-answer")
    if not re.search(r"[.!?]$", answer.strip()):
        reasons.append("no-period")
    if not re.match(
        r"^(Sie|Er|Es|Das|Die|Der|Man|Ein|Eine|Im|Licht|Wärme|Bei)\b",
        answer.strip(),
    ):
        if not re.search(
            r"\b(ist|sind|dient|bildet|gibt|kennzeichnet|betrifft|umfasst|teilt|prägt|bedeutet)\b",
            answer,
            re.I,
        ):
            reasons.append("not-sentence")
    # Stock templates in wrongs (not legitimate sibling definitions)
    stock_tpl = re.compile(
        r"typische Funktion von|ordnet Merkmale von|trifft eher auf|"
        r"Fachlich gehört dazu|wäre richtig für einen anderen|"
        r"gibt eine falsche Funktion|ist als Antwort zu .+ ungeeignet|"
        r"Anders als bei|korrekt, aber nicht|"
        r"bei den behandelten Arten|Nur Haarfarbe|Nur Zahnzahl|"
        r"ohne biologischen Bezug|\bEs ist eine Nur\b",
        re.I,
    )
    for w in wrongs:
        if stock_tpl.search(w) or BROKEN.search(w) or TITLE_AFTER_IST_EINE.search(w):
            reasons.append("broken-wrong")
            break
        if len(w.split()) < 6:
            reasons.append("short-wrong")
            break
    if re.search(
        r"\b(dem wasser|durch maschinen|durch gesetze|die nation|die freiheit)\b",
        answer,
        re.I,
    ):
        reasons.append("casing")
    if "???" in prompt + answer + "".join(wrongs):
        reasons.append("umlaut-???")
    return ("SHOWABLE" if not reasons else "WEAK"), reasons


def main() -> None:
    items = []
    root = Path("src/curriculum")
    for name in FILES:
        text = (root / name).read_text(encoding="utf-8")
        for m in FACT.finditer(text):
            wrong_blob = m.group("wrong")
            wrongs = re.findall(r"(['\"])((?:\\.|[^\\\"'])*)\1", wrong_blob)
            wrongs = [w[1] for w in wrongs]
            items.append(
                {
                    "file": name,
                    "concept": m.group("concept"),
                    "prompt": m.group("prompt"),
                    "answer": m.group("answer"),
                    "wrong": wrongs,
                }
            )
    out_lines = [f"POOL {len(items)}"]
    rng = random.Random(20261016)  # independent seed (date-based, ≠ prior audit)
    sample = rng.sample(items, 20)
    ok = 0
    for i, it in enumerate(sample, 1):
        status, reasons = judge(it["prompt"], it["answer"], it["wrong"])
        if status == "SHOWABLE":
            ok += 1
        out_lines.append(f"\n=== {i}/20 [{status}] {it['file']} ===")
        out_lines.append(f"concept: {it['concept']}")
        out_lines.append(f"Q: {it['prompt']}")
        out_lines.append(f"A: {it['answer']}")
        for w in it["wrong"]:
            out_lines.append(f"  - {w}")
        if reasons:
            out_lines.append(f"reasons: {reasons}")
    out_lines.append(f"\nSCORE: {ok}/20 SHOWABLE")
    out_lines.append("VERDICT: " + ("PASS" if ok >= 18 else "FAIL"))
    report = "\n".join(out_lines) + "\n"
    Path("tmp/_sample20_out.txt").write_text(report, encoding="utf-8")
    # ASCII-safe console summary
    print(f"POOL {len(items)}")
    print(f"SCORE: {ok}/20 SHOWABLE")
    print("VERDICT:", "PASS" if ok >= 18 else "FAIL")
    print("Full report: tmp/_sample20_out.txt")


if __name__ == "__main__":
    main()
