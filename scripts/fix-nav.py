#!/usr/bin/env python3
"""Mobile navigation repair:
 - adds the hamburger toggle to any page that links nav but has no toggle
 - normalises ARIA (aria-label, aria-expanded, aria-controls) on every toggle
 - keeps the shared 8-link navigation identical across pages
"""
import io
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {"node_modules", ".git", ".vercel", "scripts"}
SKIP_FILES = {"welcome-email.html", "fan-card.html"}

BUTTON = (
    '\n      <button class="nav-hamburger" id="hamburger" type="button" '
    'aria-label="Open menu" aria-expanded="false" aria-controls="navLinks">'
    '\n        <span></span><span></span><span></span>'
    '\n      </button>'
)


def repair(text):
    nav_match = re.search(r'<nav id="nav">([\s\S]*?)</nav>', text)
    if not nav_match:
        return text, "no-nav"
    nav = nav_match.group(0)
    updated = nav

    if 'id="hamburger"' not in updated:
        # insert the toggle right after the link list
        if "</ul>" not in updated:
            return text, "no-list"
        updated = updated.replace("</ul>", "</ul>" + BUTTON, 1)
        status = "toggle-added"
    else:
        status = "aria-normalised"
        updated = re.sub(
            r'<button[^>]*id="hamburger"[^>]*>',
            '<button class="nav-hamburger" id="hamburger" type="button" '
            'aria-label="Open menu" aria-expanded="false" aria-controls="navLinks">',
            updated,
            count=1,
        )

    return text.replace(nav, updated), status


def main():
    counts = {}
    for base, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for name in sorted(files):
            if not name.endswith(".html") or name in SKIP_FILES:
                continue
            path = os.path.join(base, name)
            with io.open(path, encoding="utf-8") as handle:
                text = handle.read()
            if '<nav id="nav">' not in text:
                continue
            updated, status = repair(text)
            counts[status] = counts.get(status, 0) + 1
            if updated != text:
                with io.open(path, "w", encoding="utf-8") as handle:
                    handle.write(updated)
    print("nav repair:", ", ".join("%s=%d" % item for item in sorted(counts.items())))


if __name__ == "__main__":
    main()
