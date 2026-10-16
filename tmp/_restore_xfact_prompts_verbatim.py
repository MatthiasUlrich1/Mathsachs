# -*- coding: utf-8 -*-
"""Restore mangled application (xN) prompts verbatim from v0.28.112."""
from __future__ import annotations

import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TAG = "v0.28.112"
FILES = [
    "biologieLehrplanGapsFill.ts",
    "biologieK8K10DensityFill.ts",
    "biologieOsGapsFill.ts",
]

PROMPT_RE = re.compile(
    r"(concept:\s*(['\"])((?:\\.|[^\\\"'])*)\2\s*,\s*prompt:\s*)(['\"])((?:\\.|[^\\\"'])*)\4"
)


def decode(s: str) -> str:
    s = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), s)
    return s.replace("\\n", "\n").replace('\\"', '"').replace("\\'", "'").replace("\\\\", "\\")


def esc(s: str, q: str = '"') -> str:
    return s.replace("\\", "\\\\").replace(q, f"\\{q}").replace("\n", " ").replace("\r", " ")


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


def load_prompts(text: str) -> dict[str, str]:
    out = {}
    for m in PROMPT_RE.finditer(text):
        out[decode(m.group(3))] = decode(m.group(5))
    return out


def looks_mangled(prompt: str) -> bool:
    # concrete_stem wrapped a full question: "Was bewirkt der Topic: Warum ...?"
    if re.search(
        r"(Was bewirkt|Woran erkennt|Wozu dient|Welche Eigenschaft|Was kennzeichnet|Was bedeutet).{0,40}:( Was | Warum | Wozu | Woran )",
        prompt,
    ):
        return True
    if prompt.count("?") >= 2:
        return True
    return False


def main() -> int:
    total = 0
    for name in FILES:
        path = ROOT / "src" / "curriculum" / name
        rel = f"src/curriculum/{name}"
        cur = path.read_text(encoding="utf-8")
        old_prompts = load_prompts(git_show(rel))
        reps = []
        for m in PROMPT_RE.finditer(cur):
            concept = decode(m.group(3))
            cur_p = decode(m.group(5))
            old_p = old_prompts.get(concept)
            if not old_p:
                continue
            # Always restore x-facts from 112; also any mangled stem
            is_x = bool(re.search(r":x\d+$", concept))
            if not is_x and not looks_mangled(cur_p):
                continue
            if cur_p == old_p:
                continue
            q = m.group(4)
            reps.append((m.start(5), m.end(5), esc(old_p, q), concept, cur_p, old_p))
        if not reps:
            print(f"{name}: 0")
            continue
        reps.sort(key=lambda x: x[0], reverse=True)
        new_text = cur
        for start, end, repl, *_rest in reps:
            new_text = new_text[:start] + repl + new_text[end:]
        path.write_text(new_text, encoding="utf-8")
        print(f"{name}: {len(reps)}")
        for *_a, concept, cur_p, old_p in reps[:6]:
            print(f"  {concept}")
            print(f"    BAD: {cur_p[:90]}")
            print(f"    NEW: {old_p[:90]}")
        total += len(reps)
    print(f"TOTAL={total}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
