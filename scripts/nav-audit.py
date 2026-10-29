#!/usr/bin/env python3
"""Navigation audit: every nav href resolves, no duplicate ids, ARIA intact."""
import io
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP = {"node_modules", ".git", ".vercel", "scripts"}

problems = []
navs = {}

for base, dirs, files in os.walk(ROOT):
    dirs[:] = [d for d in dirs if d not in SKIP]
    for name in sorted(files):
        if not name.endswith(".html"):
            continue
        rel = os.path.relpath(os.path.join(base, name), ROOT)
        if rel in ("welcome-email.html",):
            continue
        with io.open(os.path.join(base, name), encoding="utf-8") as handle:
            text = handle.read()

        nav_match = re.search(r'<nav\b[^>]*>([\s\S]*?)</nav>', text)
        if not nav_match:
            problems.append("%s: <nav> element missing" % rel)
            continue
        if 'aria-label' not in nav_match.group(0).split('>')[0]:
            problems.append("%s: <nav> missing aria-label" % rel)
        nav = nav_match.group(1)
        if "fan-card.html" in rel:
            # bespoke compact nav (2 links) — intentionally different
            continue

        hrefs = re.findall(r'<a\s[^>]*href="([^"]+)"', nav)
        navs[rel] = tuple(sorted(hrefs))

        for href in hrefs:
            if href.startswith(("http", "mailto:", "#")):
                continue
            route = href.split("#")[0].split("?")[0].lstrip("/")
            if route in ("",):
                continue
            target = os.path.join(ROOT, route)
            if not (os.path.exists(target) or os.path.exists(target + ".html")
                    or os.path.exists(os.path.join(target, "index.html"))):
                problems.append("%s: nav link 404 → %s" % (rel, href))

        if 'id="navLinks"' not in nav:
            problems.append("%s: navLinks container missing" % rel)
        if 'id="hamburger"' not in nav:
            problems.append("%s: hamburger toggle missing" % rel)
        if 'aria-label="Menu"' not in nav and 'aria-label="Open menu"' not in nav:
            problems.append("%s: hamburger missing aria-label" % rel)

        ids = re.findall(r'\sid="([^"]+)"', text)
        dupes = {i for i in ids if ids.count(i) > 1}
        if dupes:
            problems.append("%s: duplicate ids %s" % (rel, ", ".join(sorted(dupes))))

signature = None
for rel, links in navs.items():
    if signature is None:
        signature = links
    elif links != signature:
        problems.append("%s: nav links differ from the shared navigation" % rel)

print("pages audited:", len(navs))
print("unique nav routes:", len(signature or ()))
if problems:
    print("\nPROBLEMS (%d):" % len(problems))
    for problem in problems:
        print("  -", problem)
else:
    print("\n✓ navigation consistent, all routes resolve, no duplicate ids")
