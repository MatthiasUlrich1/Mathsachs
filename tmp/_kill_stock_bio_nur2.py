# -*- coding: utf-8 -*-
"""
Force-kill stock bio Nur-* wrongs and Es-ist-eine Title mush in bio fills.

Uses sibling fact meanings inside the same bankGenerate block as distractors.
"""
from __future__ import annotations

import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import rewrite_natural_authorship as nat
import rewrite_glossary_mc_quality_pass6 as p6

ROOT = Path("src/curriculum")
FILES = [
    "biologieOsGapsFill.ts",
    "biologieOsDensityFill.ts",
    "biologieThinFill.ts",
    "biologieLehrplanGapsFill.ts",
    "biologieK8K10DensityFill.ts",
]

STOCK = re.compile(
    r"Nur Haarfarbe|Nur Zahnzahl|ohne biologischen Bezug|"
    r"Nur Fotosynthese|"
    r"\bEs ist eine Nur\b|\bSie ist eine Nur\b|\bEr ist eine Nur\b",
    re.I,
)
TITLE_IST = re.compile(r"\bist eine [A-ZÄÖÜ]")
FACT_INLINE = re.compile(
    r"\{\s*\n\s*concept:\s*(['\"])((?:\\.|[^\\\"'])*)\1\s*,\s*\n\s*"
    r"prompt:\s*(['\"])((?:\\.|[^\\\"'])*)\3\s*,\s*\n\s*"
    r"answer:\s*(['\"])((?:\\.|[^\\\"'])*)\5\s*,\s*"
    r"wrong:\s*\[([\s\S]*?)\]"
    r"([\s\S]*?)\n\s*\},",
)
WISSEN_RE = re.compile(r"wissen:\s*(['\"])((?:\\.|[^\\\"'])*)\1")


def ensure_period(s: str) -> str:
    s = re.sub(r"\s+", " ", s).strip()
    if not s:
        return s
    return s if re.search(r"[.!?]$", s) else s + "."


def unwrap_answer(answer: str) -> str:
    a = answer.strip()
    a = re.sub(r"^(Sie|Er|Es)\s+ist\s+(eine|ein)\s+", "", a, flags=re.I)
    a = re.sub(r"^(Sie|Er|Es)\s+beschreibt\s+(eine|ein)\s+", "", a, flags=re.I)
    a = a.strip(" .")
    # Fix truncated paren
    if a.count("(") > a.count(")"):
        a = a + ")"
    return a


def to_sentence(raw: str, term_hint: str = "") -> str:
    body = unwrap_answer(raw)
    if not body:
        return ""
    # Already full sentence
    if re.match(r"^(Sie|Er|Es|Das|Die|Der|Man)\b", body) and len(body.split()) >= 6:
        return ensure_period(body)
    pron = p6.pronoun(term_hint) if term_hint else "Es"
    # Verb-led fragment
    if re.match(
        r"^(Dient|Bildet|Steuert|Misst|Schützt|Wandelt|Enthält|Umfasst|Regelt|"
        r"Erzeugt|Beschreibt|Bedeutet|Gibt|Lässt|Wird|Ist|Sind|Lebt|Jagt)\b",
        body,
        re.I,
    ):
        return ensure_period(f"{pron} {p6.lower_first(body)}")
    # Noun / claim fragment → verb-led definition (avoid Sie ist eine Title)
    if re.match(r"^(der|die|das|ein|eine)\b", body, re.I):
        return ensure_period(f"{pron} beschreibt {p6.lower_first(body)}")
    # Capitalize first letter of NP carefully
    if body[:1].islower():
        body_cap = body
    else:
        body_cap = body
    # Prefer beschreibt + lowercase first content word when Title-Case mush
    words = body_cap.split()
    if words and words[0][:1].isupper() and len(words[0]) > 3:
        # keep noun capital in German
        sent = f"{pron} beschreibt {body_cap[0].lower() + body_cap[1:]}" if False else f"{pron} beschreibt {body_cap}"
        # Better: natural German with article
        art = "eine" if re.search(r"(ung|heit|keit|schaft|ion|tät|ik|enz|anz|ur|e)$", words[0], re.I) else "ein"
        # Many bio fragments are plural / abstract — use „gilt als“
        if re.search(r"^(Unbelebte|Einflüsse|Beziehungen|Ansprüche|Faktoren)", body_cap):
            return ensure_period(f"{pron} meint {p6.lower_first(body_cap)}")
        return ensure_period(f"{pron} meint {p6.lower_first(body_cap)}")
    return ensure_period(f"{pron} meint {p6.lower_first(body_cap)}")


def bank_slices(text: str) -> list[tuple[int, int]]:
    """Return (start,end) of each BioBank / bankGenerate block."""
    starts = [m.start() for m in re.finditer(r"bankGenerate\(\{", text)]
    starts += [m.start() for m in re.finditer(r"const\s+\w+:\s*BioBank\s*=\s*\{", text)]
    starts = sorted(set(starts))
    if not starts:
        return [(0, len(text))]
    spans = []
    for i, start in enumerate(starts):
        end = starts[i + 1] if i + 1 < len(starts) else len(text)
        spans.append((start, end))
    return spans


def process(path: Path) -> int:
    text = path.read_text(encoding="utf-8")
    changed = 0
    replacements: list[tuple[int, int, str]] = []

    # Precompute sibling answer bodies per bank span
    spans = bank_slices(text)
    facts_by_span: list[list[tuple[int, int, str, str, str, list[str], str]]] = []
    for start, end in spans:
        chunk_facts = []
        for m in FACT_INLINE.finditer(text, start, end):
            concept = nat.decode(m.group(2))
            prompt = nat.decode(m.group(4))
            answer = nat.decode(m.group(6))
            wrongs = [nat.decode(w[1]) for w in re.findall(r"(['\"])((?:\\.|[^\\\"'])*)\1", m.group(7))]
            rest = m.group(8) or ""
            flash_m = re.search(r'flashFront:\s*([\'"])((?:\\.|[^\\\'"])*)\1', rest)
            flash = nat.decode(flash_m.group(2)) if flash_m else ""
            wiss_m = WISSEN_RE.search(rest)
            wissen = nat.decode(wiss_m.group(2)) if wiss_m else ""
            chunk_facts.append((m.start(), m.end(), concept, prompt, answer, wrongs, flash, wissen))
        facts_by_span.append(chunk_facts)

    for span_facts in facts_by_span:
        # Pool of unwrapped meanings for distractors (prefer wissen)
        pool_bodies = []
        for _, _, _, _, ans, _, flash, wissen in span_facts:
            body = ""
            if wissen:
                body = wissen.split("Fachlich")[0].split("Bezug:")[0].strip(" .")
            if not body or len(body.split()) < 2:
                body = unwrap_answer(ans)
            if body and not STOCK.search(body) and len(body.split()) >= 2:
                pool_bodies.append((flash, body))

        for start, end, concept, prompt, answer, wrongs, flash, wissen in span_facts:
            blob = " ".join([answer, *wrongs])
            if not (
                STOCK.search(blob)
                or TITLE_IST.search(blob)
                or re.match(r"^(Sie|Er|Es) ist (eine|ein)\b", answer, re.I)
            ):
                continue

            term = re.sub(r"\s*\([^)]*\)\s*$", "", flash).strip()
            if not term:
                # Use explanation-ish prompt noun
                term = re.sub(r"[?\s]+$", "", prompt).strip() or concept.split(":")[-1]

            raw_meaning = ""
            if wissen:
                raw_meaning = wissen.split("Fachlich")[0].split("Bezug:")[0].strip(" .")
            if not raw_meaning or STOCK.search(raw_meaning):
                raw_meaning = unwrap_answer(answer)
            new_answer = to_sentence(raw_meaning, term)

            # Build 3 distractors from other bodies
            self_body = raw_meaning.lower()
            distractors = []
            seen = {new_answer.lower()}
            for fl, body in pool_bodies:
                if body.lower() == self_body:
                    continue
                sent = to_sentence(body, fl or term)
                if sent.lower() in seen:
                    continue
                if STOCK.search(sent) or TITLE_IST.search(sent):
                    continue
                if len(sent.split()) < 6:
                    sent = ensure_period(f"{sent.rstrip('.')} als weiterer Teilaspekt dieses Themas")
                if len(sent.split()) < 6:
                    continue
                seen.add(sent.lower())
                distractors.append(sent)
                if len(distractors) >= 3:
                    break

            if len(distractors) < 3:
                fillers = [
                    f"Es beschreibt einen anderen Teilaspekt als {term}.",
                    f"Es meint eine andere Beziehung im System als {term}.",
                    f"Es betrifft einen anderen Faktor und nicht {term}.",
                    f"Es nennt eine andere Anpassung als {term}.",
                    f"Es beschreibt einen anderen Vorgang als {term}.",
                ]
                for f in fillers:
                    if f.lower() not in seen:
                        distractors.append(f)
                        seen.add(f.lower())
                    if len(distractors) >= 3:
                        break

            if len(distractors) < 3 or STOCK.search(new_answer):
                continue
            if len(new_answer.split()) < 6:
                new_answer = ensure_period(
                    f"{new_answer.rstrip('.')} als Kernaussage dieses Fachbegriffs"
                )
            if STOCK.search(new_answer) or any(STOCK.search(w) for w in distractors[:3]):
                continue
            if TITLE_IST.search(new_answer) or any(TITLE_IST.search(w) for w in distractors[:3]):
                continue

            new_prompt = prompt if prompt.endswith("?") else f"Was beschreibt „{term}\"?"
            if len(prompt.split()) <= 3 or re.search(r"\bgrob\?\s*$", prompt):
                new_prompt = f"Was beschreibt „{term}\"?" if term else prompt

            wrong_lit = ", ".join(f'"{nat.esc(w)}"' for w in distractors[:3])
            orig = text[start:end]
            new_block = re.sub(
                r"prompt:\s*(['\"])(?:\\.|[^\\\"'])*\1",
                f'prompt: "{nat.esc(new_prompt)}"',
                orig,
                count=1,
            )
            new_block = re.sub(
                r"answer:\s*(['\"])(?:\\.|[^\\\"'])*\1\s*,\s*wrong:\s*\[[\s\S]*?\]",
                f'answer: "{nat.esc(new_answer)}", wrong: [{wrong_lit}]',
                new_block,
                count=1,
            )
            replacements.append((start, end, new_block))
            changed += 1

    if changed:
        parts: list[str] = []
        last = 0
        for start, end, block in sorted(replacements, key=lambda x: x[0]):
            parts.append(text[last:start])
            parts.append(block)
            last = end
        parts.append(text[last:])
        out = "".join(parts)
        tmp = path.with_suffix(path.suffix + ".tmpstock2")
        tmp.write_text(out, encoding="utf-8", newline="\n")
        for _ in range(12):
            try:
                tmp.replace(path)
                break
            except OSError:
                time.sleep(0.2)
        else:
            path.write_text(out, encoding="utf-8", newline="\n")
    return changed


def main() -> None:
    total = 0
    for name in FILES:
        path = ROOT / name
        if not path.exists():
            continue
        n = process(path)
        total += n
        print(f"{name}: changed={n}")
    print("TOTAL", total)


if __name__ == "__main__":
    main()
