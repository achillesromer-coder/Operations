#!/usr/bin/env python3
"""Validate the Git-facing Operations control surface without changing files."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_FILES = [
    Path("CORE/Drive_GitHub_Bridge.md"),
    Path("CORE/GITHUB_ALIGNMENT_HANDOFF_2026_07_03.md"),
    Path("Agents/Achilles/Achilles_Tasks.md"),
    Path("Agents/Neo/Neo_Tasks.md"),
]

REQUIRED_BRIDGE_TERMS = [
    "Canonical task/index authority",
    "Git execution/control surface",
    "GitHub should not create a parallel task system",
]

PROHIBITED_CANONICAL_PATTERNS = [
    re.compile(r"GitHub Operations is (?:the )?canonical task", re.I),
    re.compile(r"OPEN_TASKS[^\n]{0,40}(?:canonical|source of truth)", re.I),
]

STATUS_PATTERN = re.compile(r"^Status:\s*\S.+$", re.MULTILINE)
UPDATED_PATTERN = re.compile(r"^Updated:\s*\d{4}-\d{2}-\d{2}\s*$", re.MULTILINE)
CORE_ID_PATTERN = re.compile(r"\bCORE-[A-Z]\d{2,}\b")


def read_text(path: Path, errors: list[str]) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError) as exc:
        errors.append(f"Unreadable control file: {path.relative_to(ROOT)}: {exc}")
        return ""


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []

    for relative in REQUIRED_FILES:
        path = ROOT / relative
        if not path.is_file():
            errors.append(f"Missing required control file: {relative}")
            continue

        text = read_text(path, errors)
        if not text:
            continue
        if not STATUS_PATTERN.search(text):
            errors.append(f"Missing Status field: {relative}")
        if not UPDATED_PATTERN.search(text):
            warnings.append(f"Missing or non-ISO Updated field: {relative}")

        for pattern in PROHIBITED_CANONICAL_PATTERNS:
            if pattern.search(text):
                errors.append(f"Canonical-authority conflict in {relative}: {pattern.pattern}")

    bridge_path = ROOT / REQUIRED_FILES[0]
    if bridge_path.is_file():
        bridge = read_text(bridge_path, errors)
        for term in REQUIRED_BRIDGE_TERMS:
            if term.lower() not in bridge.lower():
                errors.append(f"Bridge contract missing required term: {term}")

    ledger_count = 0
    linked_core_ids: set[str] = set()
    agents_root = ROOT / "Agents"
    if agents_root.is_dir():
        for ledger in sorted(agents_root.glob("*/**/*_Tasks.md")):
            ledger_count += 1
            text = read_text(ledger, errors)
            linked_core_ids.update(CORE_ID_PATTERN.findall(text))

    if ledger_count == 0:
        errors.append("No agent task ledgers found under Agents/")
    if not linked_core_ids:
        errors.append("No CORE task identifiers found in agent ledgers")

    print(
        f"Validated {len(REQUIRED_FILES)} required controls, "
        f"{ledger_count} agent ledgers, and {len(linked_core_ids)} CORE links."
    )
    for warning in warnings:
        print(f"WARNING: {warning}", file=sys.stderr)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    print("Operations control validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
