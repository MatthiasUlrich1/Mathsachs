# -*- coding: utf-8 -*-
"""
Force-align biologieOsGapsFill prompts to v0.28.112 terms.

Always rebuild the stem from the 112 prompt's named/bare term so a prior
bad pass cannot leave mangled expected fragments in place.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from tmp._restore_prompt_term_desync import (  # noqa: E402
    concrete_stem,
    decode,
    esc,
    git_show,
    parse_facts,
    prompt_named_term,
    terms_match,
)

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "src" / "curriculum" / "biologieOsGapsFill.ts"
REL = "src/curriculum/biologieOsGapsFill.ts"

PROMPT_RE = re.compile(
    r"(concept:\s*(['\"])((?:\\.|[^\\\"'])*)\2\s*,\s*prompt:\s*)(['\"])((?:\\.|[^\\\"'])*)\4"
)


def term_from_112_prompt(prompt: str) -> str | None:
    named = prompt_named_term(prompt)
    if named:
        return named.strip()
    bare = prompt.strip().rstrip("?")
    if not bare or len(bare) > 70:
        return None
    if re.match(r"^(Was|Woran|Wozu|Welche|Mit|Fachbegriff|Warum)", bare, re.I):
        return None
    return bare


def main() -> int:
    cur = PATH.read_text(encoding="utf-8")
    old = git_show(REL)
    old_facts = parse_facts(old)

    n = 0
    samples: list[str] = []
    reps: list[tuple[int, int, str]] = []
    for m in PROMPT_RE.finditer(cur):
        concept = decode(m.group(3))
        cur_prompt = decode(m.group(5))
        old_f = old_facts.get(concept)
        if not old_f:
            continue
        exp = term_from_112_prompt(old_f["prompt"])
        if not exp:
            # Keep longer 112 sentence prompts verbatim when drifted
            if cur_prompt.strip() != old_f["prompt"].strip() and 8 < len(old_f["prompt"]) < 160:
                q = m.group(4)
                reps.append((m.start(5), m.end(5), esc(old_f["prompt"], q)))
                n += 1
                if len(samples) < 12:
                    samples.append(f"{concept}: VERBATIM -> {old_f['prompt']!r}")
            continue

        style = abs(hash(concept)) % 6
        new_prompt = concrete_stem(exp, old_f.get("answer") or exp, style)
        # Skip only if already exactly this stem or already names the same term cleanly
        named = prompt_named_term(cur_prompt)
        if named and terms_match(named, exp) and named.lower() == exp.lower():
            # keep a good existing concrete stem that names the exact term
            if cur_prompt != new_prompt and (
                "Was bedeutet" in cur_prompt
                or "Woran erkennt" in cur_prompt
                or "Wozu dient" in cur_prompt
                or "Welche Eigenschaft" in cur_prompt
                or "Was bewirkt" in cur_prompt
                or "Was kennzeichnet" in cur_prompt
            ):
                continue
        q = m.group(4)
        reps.append((m.start(5), m.end(5), esc(new_prompt, q)))
        n += 1
        if len(samples) < 25:
            samples.append(f"{concept}: {cur_prompt!r} -> {new_prompt!r}")

    reps.sort(key=lambda x: x[0], reverse=True)
    new_text = cur
    for start, end, repl in reps:
        new_text = new_text[:start] + repl + new_text[end:]
    PATH.write_text(new_text, encoding="utf-8")
    print(f"fixed prompts: {n}")
    print("\n".join(samples))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
