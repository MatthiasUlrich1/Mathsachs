# -*- coding: utf-8 -*-
"""Backfill empty wissen: fw(\"\") from v0.28.112 after prompt-term restore."""
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

EMPTY_FW = re.compile(
    r"(wissen:\s*fw\(\s*)(['\"])\2(\s*,?\s*\))",
    re.M,
)
EMPTY_FW_ML = re.compile(
    r"(wissen:\s*fw\(\s*\n\s*)(['\"])\2(\s*,?\s*\n\s*\))",
    re.M,
)

FACT = re.compile(
    r"concept:\s*(['\"])((?:\\.|[^\\\"'])*)\1\s*,\s*"
    r"prompt:\s*(['\"])((?:\\.|[^\\\"'])*)\3",
)

WISSEN_112 = re.compile(
    r"wissen:\s*(?:fw\(\s*)?(['\"])((?:\\.|[^\\\"'])*)\1",
    re.M,
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


def wissen_map(text: str) -> dict[str, str]:
    out: dict[str, str] = {}
    for m in FACT.finditer(text):
        concept = decode(m.group(2))
        chunk = text[m.end() : m.end() + 1200]
        # allow newline after fw(
        wm = re.search(
            r"wissen:\s*(?:fw\(\s*)?(['\"])((?:\\.|[^\\\"'])*)\1",
            chunk,
        )
        if not wm:
            wm = re.search(
                r"wissen:\s*fw\(\s*\n\s*(['\"])((?:\\.|[^\\\"'])*)\1",
                chunk,
            )
        if wm:
            out[concept] = decode(wm.group(2))
    return out


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
        old_w = wissen_map(old)
        # also keep non-empty current as fallback — we only fill empties

        def repl_factory(text: str):
            # Walk empty fw blocks and replace using nearest preceding concept
            parts: list[str] = []
            last = 0
            count = 0
            for rx in (EMPTY_FW_ML, EMPTY_FW):
                pass
            # Combined scan
            pattern = re.compile(
                r"concept:\s*(['\"])((?:\\.|[^\\\"'])*)\1"
                r"([\s\S]*?)"
                r"(wissen:\s*fw\(\s*(?:\n\s*)?)(['\"])\5(\s*,?\s*(?:\n\s*)?\))",
            )
            new_text = text
            # Simpler: find each empty wissen and look backward for concept
            for m in list(
                re.finditer(
                    r"wissen:\s*fw\(\s*(?:\n\s*)?(['\"])\1(\s*,?\s*(?:\n\s*)?\))",
                    text,
                )
            )[::-1]:
                # look back for concept
                before = text[max(0, m.start() - 800) : m.start()]
                cm = None
                for cm in re.finditer(r"concept:\s*(['\"])((?:\\.|[^\\\"'])*)\1", before):
                    pass
                if not cm:
                    continue
                concept = decode(cm.group(2))
                w = old_w.get(concept, "").strip()
                if not w:
                    # fallback: explanation from current nearby
                    em = re.search(
                        r"explanation:\s*(['\"])((?:\\.|[^\\\"'])*)\1",
                        before,
                    )
                    if em:
                        w = decode(em.group(2))
                if not w:
                    continue
                q = m.group(1)
                # rebuild wissen fw block preserving multiline-ness
                body = m.group(0)
                if "\n" in body:
                    repl = f'wissen: fw(\n        {q}{esc(w, q)}{q},\n      )'
                else:
                    repl = f"wissen: fw({q}{esc(w, q)}{q})"
                # keep trailing comma if original had structure inside larger object
                # Original match is just the fw(...) part starting at wissen:
                text = text[: m.start()] + repl + text[m.end() :]
                count += 1
            return text, count

        new_text, n = repl_factory(cur)
        if n:
            path.write_text(new_text, encoding="utf-8")
        print(f"{name}: filled {n} empty wissen")
        total += n
    print(f"TOTAL filled={total}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
