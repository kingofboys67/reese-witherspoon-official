#!/usr/bin/env python3
"""Prepares the release: verifies reel clips, rewrites .gitignore for the
deployed mp4 subset, and reports anything missing."""
import io
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VERCELIGNORE = os.path.join(ROOT, ".vercelignore")
REELS_JS = os.path.join(ROOT, "reels.js")
REELS_JSON = os.path.join(ROOT, "scripts", "data", "reels.json")
GITIGNORE = os.path.join(ROOT, ".gitignore")


def whitelisted_mp4s():
    with io.open(VERCELIGNORE, encoding="utf-8") as handle:
        lines = [line.strip() for line in handle if line.strip()]
    return sorted({line[1:] for line in lines
                   if line.startswith("!") and line.endswith(".mp4")})


def referenced_mp4s():
    refs = set()
    with io.open(REELS_JS, encoding="utf-8") as handle:
        refs.update(re.findall(r"'((?:reesewitherspoon/)[^']+\.mp4)'", handle.read()))
    with io.open(REELS_JSON, encoding="utf-8") as handle:
        for entry in json.load(handle)["entries"]:
            refs.add(entry["src"].lstrip("/"))
    return refs


def main():
    whitelist = whitelisted_mp4s()
    refs = referenced_mp4s()
    missing = sorted(ref for ref in refs if ref not in whitelist)
    print("mp4 referenced by the site :", len(refs))
    print("mp4 whitelisted for deploy :", len(whitelist))
    print("referenced but not deployed:", missing if missing else "none")

    existing = []
    with io.open(GITIGNORE, encoding="utf-8") as handle:
        for line in handle.read().splitlines():
            line = line.strip()
            if not line or line == "*.mp4" or line in ("__pycache__/", "*.pyc"):
                continue
            if line.startswith("# deployment media"):
                continue
            existing.append(line)

    block = ["# deployment media (small clips referenced by the live site)", "*.mp4"]
    block += ["!" + path for path in whitelist]
    block += ["", "__pycache__/", "*.pyc"]
    with io.open(GITIGNORE, "w", encoding="utf-8") as handle:
        handle.write("\n".join(existing + [""] + block) + "\n")
    print(".gitignore rules written:", len(existing + block))
    print("mp4 to be committed      :", len(whitelist))


if __name__ == "__main__":
    main()
