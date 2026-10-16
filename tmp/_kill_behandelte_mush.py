# -*- coding: utf-8 -*-
"""
Kill angry leftovers: bei den behandelten Arten, stock bio Nur-*, Title-Case ist eine,
broken Erbgänge / Lebensraum / Zwei Membranen.

Rebuilds from topic-local pair meanings via rewrite_natural_authorship helpers.
Never pads. Skips gold Timer/Sensor/Transparent/digitalbild.
"""
from __future__ import annotations

import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import rewrite_natural_authorship as nat

ROOT = Path(__file__).resolve().parents[1]
FILES = [
    "physikLehrplanGapsFill.ts",
    "physikOsDensityFill.ts",
    "physikThinFill.ts",
    "biologieThinFill.ts",
    "biologieLehrplanGapsFill.ts",
    "biologieOsDensityFill.ts",
    "biologieOsGapsFill.ts",
    "biologieK8K10DensityFill.ts",
]

KILL = re.compile(
    r"bei den behandelten Arten|"
    r"\bNur Haarfarbe\b|\bNur Zahnzahl\b|ohne biologischen Bezug|"
    r"Nur Fotosynthese ohne biologischen Bezug|"
    r"\bEs ist eine Nur\b|\bSie ist eine Nur\b|\bEr ist eine Nur\b|"
    r"Es ist eine Erbgänge|Es ist eine Lebensraum diktiert|"
    r"Es beschreibt ein Zwei Membranen",
    re.I,
)
TITLE_IST = re.compile(r"\bist eine [A-ZÄÖÜ]")


def safe_write(path: Path, content: str) -> None:
    tmp = path.with_suffix(path.suffix + ".tmpkill")
    tmp.write_text(content, encoding="utf-8", newline="\n")
    for _ in range(16):
        try:
            tmp.replace(path)
            return
        except OSError:
            time.sleep(0.2)
    path.write_text(content, encoding="utf-8", newline="\n")


def protect(concept: str) -> bool:
    c = concept.lower()
    if "digitalbild:fact:" in c:
        return True
    if "lichtverschmutzung:fact:timer" in c:
        return True
    if "lichtdurchlaessigkeit:fact:transparent" in c:
        return True
    if "lichtdurchlaessigkeit:fact:transluzent" in c:
        return True
    if "lichtdurchlaessigkeit:fact:opak" in c:
        return True
    return False


def needs_kill(prompt: str, answer: str, wrongs: list[str]) -> bool:
    blob = " ".join([prompt, answer, *wrongs])
    if KILL.search(blob) or TITLE_IST.search(blob):
        return True
    if re.match(r"^(Sie|Er|Es) ist (eine|ein)\b", answer, re.I):
        return True
    return False


def process(path: Path) -> tuple[int, int]:
    text = path.read_text(encoding="utf-8")
    changed = 0
    scanned = 0
    replacements: list[tuple[int, int, str]] = []

    for m in nat.FACT_RE.finditer(text):
        full = m.group(0)
        concept = nat.decode(m.group(2))
        prompt = nat.decode(m.group(4))
        answer = nat.decode(m.group(6))
        wrong_raw = m.group(7)
        flash = nat.decode(m.group(9)) if m.group(9) else ""
        wrongs = [nat.decode(w[1]) for w in re.findall(r"(['\"])((?:\\.|[^\\\"'])*)\1", wrong_raw)]

        if protect(concept):
            continue
        if not needs_kill(prompt, answer, wrongs):
            continue
        scanned += 1

        pairs = nat.parse_pairs_near(text, m.start())
        term = re.sub(r"\s*\([^)]*\)\s*$", "", flash).strip() if flash else ""
        meaning, wissen = "", ""
        fm = re.search(r":f(\d+)$", concept)
        if fm and pairs:
            fi = int(fm.group(1))
            if 0 <= fi < len(pairs):
                term, meaning, wissen = pairs[fi]
        if not term:
            term = pairs[0][0] if pairs else concept.split(":")[-1]
        if not meaning and pairs:
            base_flash = nat.norm_term(re.sub(r"\s*\(.*$", "", term))
            for t, mm, ww in pairs:
                tb = re.sub(r"\s*\(.*$", "", nat.norm_term(t))
                if tb == base_flash or (base_flash and tb.startswith(base_flash.split()[0])):
                    meaning, wissen = mm, ww
                    term = t
                    break
        if not meaning and pairs:
            meaning, wissen = pairs[0][1], pairs[0][2]

        new_prompt = nat.natural_prompt(term, meaning, concept)
        new_answer = nat.natural_answer(term, meaning, wissen, concept)
        new_wrongs = nat.sibling_answers(term, pairs, 3, concept)
        new_wrongs = [w for w in new_wrongs if w.lower() != new_answer.lower()][:3]

        if len(new_wrongs) < 3 or not nat.quality_ok(new_prompt, new_answer, new_wrongs):
            # Fallback: strip banned tails only when rebuild fails — keep answer if already ok
            stripped_ans = re.sub(r",?\s*bei den behandelten Arten\.?", "", answer, flags=re.I)
            stripped_ans = nat.ensure_period(stripped_ans.strip())
            stripped_w = []
            for w in wrongs:
                w2 = re.sub(r",?\s*bei den behandelten Arten\.?", "", w, flags=re.I)
                if KILL.search(w2) or TITLE_IST.search(w2):
                    continue
                stripped_w.append(nat.ensure_period(w2.strip()))
            # Rebuild wrongs from siblings even if answer strip-only
            if len(new_wrongs) >= 3 and not KILL.search(new_answer) and not TITLE_IST.search(new_answer):
                if len(new_answer.split()) >= 6 and not re.match(
                    r"^(Sie|Er|Es) ist (eine|ein)\b", new_answer, re.I
                ):
                    new_prompt2 = new_prompt if new_prompt.endswith("?") else prompt
                    if nat.quality_ok(new_prompt2, new_answer, new_wrongs):
                        new_prompt, answer, wrongs = new_prompt2, new_answer, new_wrongs
                        # fall through to write
                    else:
                        continue
                else:
                    continue
            elif (
                stripped_ans
                and len(stripped_ans.split()) >= 6
                and not KILL.search(stripped_ans)
                and not TITLE_IST.search(stripped_ans)
                and not re.match(r"^(Sie|Er|Es) ist (eine|ein)\b", stripped_ans, re.I)
                and len(stripped_w) >= 3
            ):
                # Use stripped + fill wrongs from siblings if needed
                while len(stripped_w) < 3 and new_wrongs:
                    cand = new_wrongs.pop(0)
                    if cand.lower() not in {x.lower() for x in stripped_w} and cand.lower() != stripped_ans.lower():
                        stripped_w.append(cand)
                if len(stripped_w) < 3:
                    continue
                new_prompt, new_answer, new_wrongs = prompt, stripped_ans, stripped_w[:3]
                if not nat.quality_ok(new_prompt, new_answer, new_wrongs):
                    continue
            else:
                continue
        else:
            pass  # new_* already good

        if KILL.search(" ".join([new_prompt, new_answer, *new_wrongs])) or TITLE_IST.search(
            " ".join([new_answer, *new_wrongs])
        ):
            continue

        new_block = full
        new_block = re.sub(
            r"prompt:\s*(['\"])(?:\\.|[^\\\"'])*\1",
            f'prompt: "{nat.esc(new_prompt)}"',
            new_block,
            count=1,
        )
        wrong_lit = ", ".join(f'"{nat.esc(w)}"' for w in new_wrongs)
        new_block = re.sub(
            r"answer:\s*(['\"])(?:\\.|[^\\\"'])*\1\s*,\s*wrong:\s*\[[\s\S]*?\]",
            f'answer: "{nat.esc(new_answer)}", wrong: [{wrong_lit}]',
            new_block,
            count=1,
        )
        replacements.append((m.start(), m.end(), new_block))
        changed += 1

    if changed:
        parts: list[str] = []
        last = 0
        for start, end, block in replacements:
            parts.append(text[last:start])
            parts.append(block)
            last = end
        parts.append(text[last:])
        safe_write(path, "".join(parts))
    return scanned, changed


def main() -> None:
    total_s = total_c = 0
    for name in FILES:
        path = ROOT / "src/curriculum" / name
        if not path.exists():
            continue
        s, c = process(path)
        total_s += s
        total_c += c
        if c or s:
            print(f"{name}: kill-candidates={s} changed={c}")
    print(f"TOTAL candidates={total_s} changed={total_c}")


if __name__ == "__main__":
    main()
