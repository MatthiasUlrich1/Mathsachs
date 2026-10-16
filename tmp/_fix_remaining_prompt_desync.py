# -*- coding: utf-8 -*-
"""
Prompt-only restore for remaining sibling-term desyncs.

Uses v0.28.112 prompt term (named/bare) — never pair remaps, never whole-object
rewrite (preserves current answers/wrongs/gold).
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from tmp._restore_prompt_term_desync import (  # noqa: E402
    FILES,
    concrete_stem,
    decode,
    esc,
    expected_term,
    git_show,
    parse_facts,
    parse_pairs,
    prompt_named_term,
    terms_match,
    norm,
)

ROOT = Path(__file__).resolve().parents[1]
CUR = ROOT / "src" / "curriculum"

GOLD = {
    "bio:lk11:c3c4:10",
    "bio:k10:blut:ab",
    "bio:k10:erbk:trisomie",
    "ph:gap:ph-k6-lb1-lichtverschmutzung:fact:timer-sensor",
    "ph:gap:ph-k6-lb1-lichtdurchlaessigkeit:fact:transparent",
    "ph:gap:ph-k6-lb1-digitalbild:fact:sensor",
}

PROMPT_RE = re.compile(
    r"(concept:\s*(['\"])((?:\\.|[^\\\"'])*)\2\s*,\s*prompt:\s*)(['\"])((?:\\.|[^\\\"'])*)\4"
)


def term_from_112_prompt(prompt: str) -> str | None:
    named = prompt_named_term(prompt)
    if named:
        return named.strip()
    bare = prompt.strip().rstrip("?")
    if not bare or len(bare) > 80:
        return None
    if re.match(r"^(Was|Woran|Wozu|Welche|Mit|Fachbegriff|Warum)", bare, re.I):
        return None
    return bare


def main() -> int:
    total = 0
    for name in FILES:
        path = CUR / name
        rel = f"src/curriculum/{name}"
        cur = path.read_text(encoding="utf-8")
        try:
            old = git_show(rel)
        except RuntimeError:
            continue
        old_facts = parse_facts(old)
        old_pairs = parse_pairs(old)
        expected: dict[str, str] = {}
        for c, f in old_facts.items():
            # Prefer 112 prompt term; fall back to structured fields
            t = term_from_112_prompt(f["prompt"]) or expected_term(f, old_pairs)
            if t:
                expected[c] = t
        term_owner = {norm(t): c for c, t in expected.items()}

        reps: list[tuple[int, int, str]] = []
        samples = []
        for m in PROMPT_RE.finditer(cur):
            concept = decode(m.group(3))
            if concept in GOLD:
                continue
            cur_prompt = decode(m.group(5))
            exp = expected.get(concept)
            if not exp:
                continue
            named = prompt_named_term(cur_prompt)
            if not named:
                continue
            if terms_match(named, exp):
                continue
            # only if named is another concept's term
            other = term_owner.get(norm(named))
            if not other:
                for nt, oc in term_owner.items():
                    if terms_match(named, nt) and oc != concept:
                        other = oc
                        break
            if not other or other == concept:
                continue
            style = abs(hash(concept)) % 6
            meaning = (old_facts[concept]["answer"] if concept in old_facts else "") or exp
            new_prompt = concrete_stem(exp, meaning, style)
            q = m.group(4)
            reps.append((m.start(5), m.end(5), esc(new_prompt, q)))
            total += 1
            if len(samples) < 8:
                samples.append(f"{name}|{concept}: {named!r}->{exp!r} | {new_prompt}")

        if not reps:
            print(f"{name}: 0")
            continue
        reps.sort(key=lambda x: x[0], reverse=True)
        new_text = cur
        for start, end, repl in reps:
            new_text = new_text[:start] + repl + new_text[end:]
        path.write_text(new_text, encoding="utf-8")
        print(f"{name}: {len(reps)}")
        for s in samples:
            print(" ", s)
    print(f"TOTAL={total}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
