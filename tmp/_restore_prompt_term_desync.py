# -*- coding: utf-8 -*-
"""
Restore locked-fill facts where the prompt names a *sibling* glossary term
(wrong concept), while answer/explanation/gapAccepted belong to another concept.

Strategy:
1. Build expected term per concept from v0.28.112 (gapAccepted / explanation /
   quoted prompt term).
2. Detect current prompts that name a different concept's expected term.
3. Prefer restoring the *whole* fact object from v0.28.112.
4. Re-apply only safe concrete stems that keep the *same* concept term.
5. Never overwrite Timer/Sensor/Transparent gold or AB/Trisomie/Anpassung fixes
   when those are already correct relative to 112 topic.
"""
from __future__ import annotations

import re
import subprocess
import sys
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

# Whole-object gold — never restore from tag
GOLD_CONCEPTS = {
    "ph:gap:ph-k6-lb1-lichtverschmutzung:fact:timer-sensor",
    "ph:gap:ph-k6-lb1-lichtverschmutzung:fact:richtlinie",
    "ph:gap:ph-k6-lb1-lichtverschmutzung:fact:blendung",
    "ph:gap:ph-k6-lb1-lichtverschmutzung:fact:dunkelheit",
    "ph:gap:ph-k6-lb1-lichtdurchlaessigkeit:fact:transparent",
    "ph:gap:ph-k6-lb1-lichtdurchlaessigkeit:fact:transluzent",
    "ph:gap:ph-k6-lb1-lichtdurchlaessigkeit:fact:opak",
    "ph:gap:ph-k6-lb1-digitalbild:fact:sensor",
}
# Keep these answer-topic fixes if already topical (do not clobber with bad 112
# if somehow drifted — but still allow prompt restore when desynced)
KEEP_TOPIC_OK = {
    "bio:k10:blut:ab",
    "bio:k10:erbk:trisomie",
    "bio:lk11:c3c4:10",
}

FACT_OBJ = re.compile(
    r"\{\s*concept:\s*(?P<cq>['\"])(?P<concept>(?:\\.|[^\\\"'])*)(?P=cq)\s*,\s*"
    r"prompt:\s*(?P<pq>['\"])(?P<prompt>(?:\\.|[^\\\"'])*)(?P=pq)\s*,\s*"
    r"answer:\s*(?P<aq>['\"])(?P<answer>(?:\\.|[^\\\"'])*)(?P=aq)\s*,\s*"
    r"wrong:\s*\[(?P<wrong>[\s\S]*?)\]"
    r"(?P<tail>[\s\S]*?)(?=\n\s*\},)",
)

PAIR = re.compile(
    r"\{\s*concept:\s*(['\"])((?:\\.|[^\\\"'])*)\1\s*,\s*"
    r"term:\s*(['\"])((?:\\.|[^\\\"'])*)\3\s*,\s*"
    r"meaning:\s*(['\"])((?:\\.|[^\\\"'])*)\5",
)

QUOTE = re.compile(r"[„\"“]([^„\"”]{2,80})[“\"”]")
SIMPLE = re.compile(
    r"(?:Welche Eigenschaft hat (?:die|das|den|der|ein|eine)|"
    r"Woran erkennt man (?:die|das|den|der|ein|eine)|"
    r"Wozu dient (?:die|das|den|der|ein|eine)|"
    r"Was bewirkt (?:die|das|den|der|ein|eine)|"
    r"Mit welchen Mitteln arbeitet (?:die|das|den|der|ein|eine)|"
    r"Was kennzeichnet (?:die|das|den|der|ein|eine)|"
    r"Wofür steht (?:die|das|den|der|ein|eine))\s+(.+?)\s*\??\s*$",
    re.I,
)
WAS_BED = re.compile(
    r"(?:Was bedeutet|Was beschreibt|Fachbegriff:\s*Was bedeutet)\s+[„\"“]?([^„\"”?\n]{2,80})[“\"”]?\s*\??\s*$",
    re.I,
)
COLON_TOPIC = re.compile(
    r"^[^:]{2,60}:\s*(?:Was bedeutet|Was beschreibt)\s+[„\"“]?([^„\"”?\n]{2,80})",
    re.I,
)
FEM = re.compile(r"(ung|heit|keit|schaft|ion|tät|ik|enz|anz|ur|e)$", re.I)
MASC = re.compile(r"(er|or|ismus|us|ling)$", re.I)


def decode(s: str) -> str:
    s = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), s)
    out: list[str] = []
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
    return (
        s.replace("\\", "\\\\")
        .replace(q, f"\\{q}")
        .replace("\n", " ")
        .replace("\r", " ")
    )


def norm(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r"[\"„“”']", "", s)
    s = re.sub(r"\s*\([^)]*\)\s*", " ", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip(" .?!,;:")


def terms_match(a: str, b: str) -> bool:
    na, nb = norm(a), norm(b)
    if not na or not nb:
        return False
    if na == nb:
        return True
    if len(na) >= 4 and len(nb) >= 4 and (na in nb or nb in na):
        return True
    ta, tb = set(na.split()), set(nb.split())
    if ta and tb and len(ta & tb) / max(1, min(len(ta), len(tb))) >= 0.7:
        return True
    return False


def prompt_named_term(p: str) -> str | None:
    """Extract an explicit glossary-style term from a prompt, if any."""
    m = QUOTE.search(p)
    if m:
        return m.group(1).strip()
    m = COLON_TOPIC.search(p.strip())
    if m:
        return m.group(1).strip()
    m = WAS_BED.search(p.strip())
    if m:
        return m.group(1).strip()
    m = SIMPLE.search(p.strip())
    if m:
        return m.group(1).strip().rstrip("?.!")
    return None


def expl_term(e: str) -> str | None:
    m = re.match(r"^([^:]{2,80}):\s", e.strip())
    if m:
        t = m.group(1).strip()
        # Avoid long non-term prefixes
        if len(t) > 60:
            return None
        return t
    return None


def article_for(term: str) -> str:
    t = term.strip()
    low = t.lower()
    if " oder " in low or "/" in t:
        return "das"
    # Common biology/physics glossary genders
    if re.search(r"schnabel$", low) or low.endswith("faktor") or low.endswith("bereich"):
        return "der"
    if low.endswith("zelle") or low.endswith("theorie") or low.endswith("potenz"):
        return "die"
    if re.search(r"(chen|lein|ment|tum|um)$", low) or low in {
        "licht",
        "gas",
        "eis",
        "pixel",
        "display",
        "gewebe",
        "organ",
    }:
        return "das" if low != "organ" else "das"
    if low == "organ":
        return "das"
    if FEM.search(low):
        return "die"
    if MASC.search(low):
        return "der"
    return "das"


def concrete_stem(term: str, meaning: str, style: int) -> str:
    """Safe same-concept stem upgrade — always names the correct term."""
    t = term.strip()
    art = article_for(t)
    # Prefer quoted glossary form for clarity / gap alignment
    styles = [
        f"Was bedeutet „{t}“?",
        f"Woran erkennt man {art} {t}?",
        f"Wozu dient {art} {t}?",
        f"Welche Eigenschaft hat {art} {t}?",
        f"Was bewirkt {art} {t}?",
        f"Was kennzeichnet {art} {t}?",
    ]
    # Purpose-ish meanings → prefer Wozu/Was bewirkt
    if re.match(
        r"^(dient|ermöglicht|steuert|regelt|schützt|erzeugt|wandelt|enthält|misst)",
        meaning.strip(),
        re.I,
    ):
        styles = [styles[2], styles[4], styles[0], styles[1], styles[3], styles[5]]
    return styles[style % len(styles)]


def ensure_period(s: str) -> str:
    s = s.strip()
    if not s:
        return s
    if not s.endswith((".", "!", "?")):
        return s + "."
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
        raise RuntimeError(f"git show failed: {rel}: {r.stderr[:200]}")
    return r.stdout


def parse_wrongs(blob: str) -> list[str]:
    return [decode(m.group(2)) for m in re.finditer(r"(['\"])((?:\\.|[^\\\"'])*)\1", blob)]


def extract_tail(tail: str) -> dict:
    out = {
        "explanation": "",
        "wissen": "",
        "gap": "",
        "gapAccepted": [],
        "flashFront": "",
        "raw_tail": tail,
    }
    for key in ("explanation", "wissen", "gap", "flashFront"):
        mm = re.search(rf"{key}:\s*(?:fw\()?(['\"])((?:\\.|[^\\\"'])*)\1", tail)
        if mm:
            out[key] = decode(mm.group(2))
    gm = re.search(r"gapAccepted:\s*\[([\s\S]*?)\]", tail)
    if gm:
        out["gapAccepted"] = parse_wrongs(gm.group(1))
    return out


def parse_facts(text: str) -> dict[str, dict]:
    facts: dict[str, dict] = {}
    for m in FACT_OBJ.finditer(text):
        concept = decode(m.group("concept"))
        tail = m.group("tail")
        fields = extract_tail(tail)
        facts[concept] = {
            "concept": concept,
            "prompt": decode(m.group("prompt")),
            "answer": decode(m.group("answer")),
            "wrong": parse_wrongs(m.group("wrong")),
            "span": (m.start(), m.end()),
            "full": m.group(0),
            "aq": m.group("aq"),
            "pq": m.group("pq"),
            "cq": m.group("cq"),
            "match": m,
            **fields,
        }
    return facts


def parse_pairs(text: str) -> dict[str, str]:
    """Map pair concept-id → term. Only safe :pN→:fN remaps (same bank index)."""
    out: dict[str, str] = {}
    for m in PAIR.finditer(text):
        concept = decode(m.group(2))
        term = decode(m.group(4))
        out[concept] = term
        # Safe: bio:…:p12 → bio:…:f12 (lehrplan-style). Never :p:N → bare :N
        # (os-gaps uses :fak:10 vs :p:10 for unrelated slots).
        if re.search(r":p\d+$", concept):
            alt = re.sub(r":p(\d+)$", r":f\1", concept)
            out.setdefault(alt, term)
    return out


def expected_term(fact: dict, pair_terms: dict[str, str]) -> str | None:
    """Canonical term for THIS fact — prefer fields on the fact itself over pairs."""
    c = fact["concept"]
    if fact["gapAccepted"]:
        return fact["gapAccepted"][0]
    if fact.get("flashFront"):
        return fact["flashFront"]
    expl = fact.get("explanation") or ""
    # dens-style
    m = re.search(r"Bezug:\s*([^.]+?)\.\s*\1\s+bedeutet", expl, re.I)
    if m:
        return m.group(1).strip()
    m = re.search(r"([A-ZÄÖÜ][^.]{1,50}?)\s+bedeutet:", expl)
    if m:
        return m.group(1).strip()
    # os-gaps often uses short explanation = the term itself ("Intraspezifisch.")
    if expl and len(expl) <= 60 and expl.count(" ") <= 4:
        t = expl.rstrip(".")
        if t and not re.search(r"[→+\-=]", t):
            return t
    et = expl_term(expl)
    if et and len(et) <= 40 and not re.search(r"[→+\-=]", et):
        return et
    # Only then: exact pair concept id match (no fuzzy remap)
    if c in pair_terms:
        return pair_terms[c]
    pt = prompt_named_term(fact["prompt"])
    if pt:
        return pt
    # bare prompt like "Intraspezifisch?" / "Habitat vs. Nische?"
    bare = fact["prompt"].strip().rstrip("?")
    if (
        bare
        and len(bare) <= 60
        and ((" " not in bare) or (bare.count(" ") <= 3 and "vs" in bare.lower()))
        and not re.match(r"^(Was|Woran|Wozu|Welche|Mit|Fachbegriff)", bare, re.I)
    ):
        return bare
    m = re.search(r":fact:([^:]+)$", c)
    if m:
        return m.group(1).replace("-", " ")
    return None


def bank_prefix(concept: str) -> str:
    """Group sibling facts: strip trailing :fN / :xN / :fact:slug / :N."""
    c = re.sub(r":f\d+$", "", concept)
    c = re.sub(r":x\d+$", "", concept)
    c = re.sub(r":tf\d+$", "", concept)
    c = re.sub(r":p\d+$", "", concept)
    c = re.sub(r":fact:[^:]+$", "", c)
    c = re.sub(r":\d+$", "", c)
    c = re.sub(r":p:\d+$", "", c)
    return c


def format_whole_fact(
    concept: str,
    prompt: str,
    answer: str,
    wrongs: list[str],
    explanation: str,
    wissen: str,
    gap: str,
    gap_accepted: list[str],
    flash: str,
    aq: str = '"',
    use_fw: bool = True,
) -> str:
    wlit = ", ".join(f'{aq}{esc(w, aq)}{aq}' for w in wrongs[:3])
    lines = [
        "{",
        f"      concept: {aq}{esc(concept, aq)}{aq},",
        f"      prompt: {aq}{esc(prompt, aq)}{aq},",
        f"      answer: {aq}{esc(answer, aq)}{aq}, wrong: [{wlit}],",
        f"      explanation: {aq}{esc(explanation, aq)}{aq},",
    ]
    if use_fw:
        lines.append(f"      wissen: fw(\n        {aq}{esc(wissen, aq)}{aq},\n      ),")
    else:
        lines.append(f"      wissen: {aq}{esc(wissen, aq)}{aq},")
    if gap and gap_accepted:
        ga = ", ".join(f'{aq}{esc(g, aq)}{aq}' for g in gap_accepted)
        lines.append(f"      gap: {aq}{esc(gap, aq)}{aq},")
        lines.append(f"      gapAccepted: [{ga}],")
    if flash:
        lines.append(f"      flashFront: {aq}{esc(flash, aq)}{aq},")
    # drop trailing comma on last field before close — keep commas as in source style
    return "\n".join(lines)


def detect_wissen_fw(raw_tail: str) -> bool:
    return bool(re.search(r"wissen:\s*fw\(", raw_tail))


def main() -> int:
    dry = "--dry" in sys.argv
    upgrade = "--upgrade" in sys.argv or True  # default: re-apply safe stems
    no_upgrade = "--no-upgrade" in sys.argv
    if no_upgrade:
        upgrade = False

    total = 0
    by_file: dict[str, int] = {}
    samples: list[str] = []
    desync_before = 0

    for name in FILES:
        path = CUR / name
        rel = f"src/curriculum/{name}"
        cur_text = path.read_text(encoding="utf-8")
        try:
            old_text = git_show(rel)
        except RuntimeError as e:
            print(f"SKIP {name}: {e}")
            continue

        cur_facts = parse_facts(cur_text)
        old_facts = parse_facts(old_text)
        cur_pairs = parse_pairs(cur_text)
        old_pairs = parse_pairs(old_text)

        # Expected terms from 112
        expected: dict[str, str] = {}
        for c, f in old_facts.items():
            t = expected_term(f, old_pairs)
            if t:
                expected[c] = t
        # also from pairs alone
        for c, t in old_pairs.items():
            expected.setdefault(c, t)

        # File-wide term → concept index (reshuffles often cross topic banks)
        term_owner: dict[str, str] = {}  # norm_term -> concept
        for c, t in expected.items():
            term_owner.setdefault(norm(t), c)

        replacements: list[tuple[int, int, str]] = []
        file_n = 0

        for concept, cur in cur_facts.items():
            if concept in GOLD_CONCEPTS or any(concept.startswith(g) for g in GOLD_CONCEPTS):
                continue
            old = old_facts.get(concept)
            if not old:
                continue

            exp = expected.get(concept) or expected_term(old, old_pairs)
            if not exp:
                continue

            named = prompt_named_term(cur["prompt"])
            if not named:
                continue

            # Own-term OK?
            if terms_match(named, exp):
                continue

            # Also OK if named matches current gapAccepted/flash/expl (aligned unit)
            cur_targets = []
            if cur["gapAccepted"]:
                cur_targets.append(cur["gapAccepted"][0])
            if cur.get("flashFront"):
                cur_targets.append(cur["flashFront"])
            et = expected_term(cur, {})
            if et:
                cur_targets.append(et)
            if any(terms_match(named, t) for t in cur_targets):
                continue

            # Serious only if named term belongs to a *different* concept in this file
            other = term_owner.get(norm(named))
            if not other:
                for nt, oc in term_owner.items():
                    if terms_match(named, nt) and oc != concept:
                        other = oc
                        break
            if not other or other == concept:
                # Descriptive stem (not another glossary term) — skip
                continue

            desync_before += 1

            # Prefer whole-object restore from 112
            use_fw = detect_wissen_fw(cur["raw_tail"]) or detect_wissen_fw(old["raw_tail"])
            new_prompt = old["prompt"]
            new_answer = ensure_period(old["answer"]) if not old["answer"].endswith((".", "!", "?")) else old["answer"]
            # Keep sentence form if current answer already topical & longer — but
            # user asked: prefer whole fact from 112 when any field desynced.
            new_answer = old["answer"]
            new_wrongs = list(old["wrong"][:3])
            while len(new_wrongs) < 3:
                new_wrongs.append("Andere fachliche Aussage.")
            new_expl = old["explanation"]
            new_wissen = old["wissen"] or cur["wissen"]
            new_gap = old["gap"]
            new_ga = list(old["gapAccepted"]) if old["gapAccepted"] else list(cur["gapAccepted"])
            new_flash = old.get("flashFront") or ""

            # KEEP_TOPIC: if current answer already matches expected topic better
            # than 112 somehow (post-112 gold fixes), keep answer/wrong/expl/gap
            # but still fix prompt to use correct term
            if concept in KEEP_TOPIC_OK:
                # keep current content fields; only fix prompt
                new_answer = cur["answer"]
                new_wrongs = cur["wrong"][:3]
                new_expl = cur["explanation"] or new_expl
                new_wissen = cur["wissen"] or new_wissen
                new_gap = cur["gap"] or new_gap
                new_ga = cur["gapAccepted"] or new_ga

            if upgrade:
                # Safe stem using correct term (exp), not sibling
                style = abs(hash(concept)) % 6
                meaning = new_answer or (new_expl.split(":", 1)[-1] if new_expl else "")
                new_prompt = concrete_stem(exp, meaning, style)

            # Ensure period on short answers for MC readability
            if len(new_answer.split()) <= 8 and not new_answer.endswith((".", "!", "?")):
                new_answer = ensure_period(new_answer)
            new_wrongs = [
                ensure_period(w) if len(w.split()) <= 8 and not w.endswith((".", "!", "?")) else w
                for w in new_wrongs
            ]

            # Dedup wrongs vs answer
            cleaned: list[str] = []
            seen = {new_answer.lower().rstrip(".")}
            for w in new_wrongs:
                k = w.lower().rstrip(".")
                if k in seen:
                    continue
                seen.add(k)
                cleaned.append(w)
            while len(cleaned) < 3:
                cleaned.append(f"Andere fachliche Aussage ({len(cleaned)+1}).")
            new_wrongs = cleaned[:3]

            # Preserve original object formatting loosely — replace from concept to end
            # Use current match span which ends before `\n    },`
            m = cur["match"]
            # Rebuild object body matching typical fill style
            # Detect if wissen uses fw in CURRENT file for this fact
            use_fw = "wissen: fw(" in cur["full"] or "wissen: fw(" in old["full"]
            # flashFront presence
            has_flash = "flashFront:" in cur["full"] or "flashFront:" in old["full"]
            flash_out = new_flash if has_flash else (new_flash if "flashFront:" in old["raw_tail"] else "")

            # Prefer copying structure from OLD full object with substitutions
            # Simplest robust approach: replace prompt/answer/wrong/explanation/
            # wissen/gap/gapAccepted inside the old object's fields onto current span.

            block = format_whole_fact(
                concept,
                new_prompt,
                new_answer,
                new_wrongs,
                new_expl,
                new_wissen,
                new_gap,
                new_ga,
                flash_out if (new_ga or flash_out) else "",
                aq=cur["aq"],
                use_fw=use_fw,
            )
            # Match indentation of original — original starts with `{` after spaces
            # The FACT_OBJ match starts at `{`
            replacements.append((m.start(), m.end(), block))
            file_n += 1
            total += 1
            if len(samples) < 40:
                samples.append(
                    f"{name} | {concept}\n"
                    f"  sibling: {named} -> expected {exp} (other={other})\n"
                    f"  BAD Q: {cur['prompt'][:90]}\n"
                    f"  NEW Q: {new_prompt[:90]}\n"
                    f"  A: {new_answer[:80]}"
                )

        by_file[name] = file_n
        if not replacements:
            print(f"{name}: 0 restores")
            continue

        replacements.sort(key=lambda x: x[0], reverse=True)
        new_text = cur_text
        for start, end, repl in replacements:
            new_text = new_text[:start] + repl + new_text[end:]

        if not dry:
            path.write_text(new_text, encoding="utf-8")
        print(f"{name}: {file_n} restores")

    print("\n=== SUMMARY ===")
    print(f"desync_flagged_and_restored={total}")
    print(f"by_file={by_file}")
    report = ROOT / "tmp" / "_prompt_term_desync_restore.txt"
    report.write_text(
        f"total={total}\nby_file={by_file}\n\n" + "\n\n".join(samples),
        encoding="utf-8",
    )
    print(f"samples written: {len(samples)} (see report)")
    print("report:", report)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
