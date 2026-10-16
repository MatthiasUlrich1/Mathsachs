# -*- coding: utf-8 -*-
"""Strip 'bei den behandelten Arten' pad from locked fill sources. No other edits."""
from __future__ import annotations

import re
from pathlib import Path

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

PAT = re.compile(r",?\s*bei den behandelten Arten\.?", re.I)


def main() -> None:
    total = 0
    for name in FILES:
        path = ROOT / name
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        n = len(PAT.findall(text))
        if not n:
            continue
        new = PAT.sub(".", text)
        new = re.sub(r"\.\s*\.", ".", new)
        new = re.sub(r",\s*\.", ".", new)
        # fix double spaces / trailing before period
        new = re.sub(r"\s+\.", ".", new)
        path.write_text(new, encoding="utf-8", newline="\n")
        total += n
        print(f"{name}: stripped {n}")
    print("TOTAL stripped", total)


if __name__ == "__main__":
    main()
