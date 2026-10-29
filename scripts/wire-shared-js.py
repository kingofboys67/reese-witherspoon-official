#!/usr/bin/env python3
"""Ensures every page with the shared navigation also loads shared.js (menu toggle)."""
import io
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {"node_modules", ".git", ".vercel", "scripts"}
SKIP_FILES = {"welcome-email.html"}
TAG = '<script src="/shared.js" defer></script>'


def main():
    added = 0
    for base, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for name in sorted(files):
            if not name.endswith(".html") or name in SKIP_FILES:
                continue
            path = os.path.join(base, name)
            with io.open(path, encoding="utf-8") as handle:
                text = handle.read()
            if 'id="hamburger"' not in text or "shared.js" in text:
                continue
            if "</body>" not in text:
                continue
            text = text.replace("</body>", TAG + "\n</body>", 1)
            with io.open(path, "w", encoding="utf-8") as handle:
                handle.write(text)
            added += 1
            print("  + shared.js →", os.path.relpath(path, ROOT))
    print("pages wired to shared.js:", added)


if __name__ == "__main__":
    main()
