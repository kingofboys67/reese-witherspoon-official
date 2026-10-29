#!/usr/bin/env python3
"""Ensures every mp4 referenced by the site is whitelisted for deployment."""
import io
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = os.path.join(ROOT, ".vercelignore")


def main():
    with io.open(V, encoding="utf-8") as handle:
        lines = handle.read().splitlines()
    known = {line.strip()[1:] for line in lines if line.strip().startswith("!")}

    refs = set(re.findall(r"'((?:reesewitherspoon/)[^']+\.mp4)'",
                          io.open(os.path.join(ROOT, "reels.js"), encoding="utf-8").read()))
    for entry in json.load(io.open(os.path.join(ROOT, "scripts/data/reels.json"), encoding="utf-8"))["entries"]:
        refs.add(entry["src"].lstrip("/"))

    added = []
    for ref in sorted(refs):
        if ref not in known:
            lines.append("!" + ref)
            added.append(ref)

    if added:
        with io.open(V, "w", encoding="utf-8") as handle:
            handle.write("\n".join(lines) + "\n")
        for ref in added:
            print("  + whitelisted", ref)
    print("new whitelist rules:", len(added))


if __name__ == "__main__":
    main()
