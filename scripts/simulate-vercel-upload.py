#!/usr/bin/env python3
"""Simulates Vercel's uploaded file set (.vercelignore) and reports every
asset referenced by the build that would be missing in the cloud build."""
import fnmatch
import io
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_rules():
    includes, excludes = [], []
    with io.open(os.path.join(ROOT, ".vercelignore"), encoding="utf-8") as handle:
        for raw in handle:
            rule = raw.strip()
            if not rule or rule.startswith("#"):
                continue
            if rule.startswith("!"):
                includes.append(rule[1:])
            else:
                excludes.append(rule)
    return includes, excludes


def is_uploaded(rel, includes, excludes):
    for pattern in includes:
        if fnmatch.fnmatch(rel, pattern):
            return True
    for pattern in excludes:
        if fnmatch.fnmatch(rel, pattern):
            return False
    return True


def referenced_assets():
    assets = set()
    with io.open(os.path.join(ROOT, "scripts/data/filmography.json"), encoding="utf-8") as handle:
        for entry in json.load(handle)["entries"]:
            assets.add(entry["poster"].lstrip("/"))
    with io.open(os.path.join(ROOT, "scripts/data/reels.json"), encoding="utf-8") as handle:
        for entry in json.load(handle)["entries"]:
            assets.add(entry["poster"].lstrip("/"))
            assets.add(entry["src"].lstrip("/"))
    for page in ("index.html", "films.html", "reels.html"):
        with io.open(os.path.join(ROOT, page), encoding="utf-8") as handle:
            text = handle.read()
        for match in re.findall(r'(?:src|data-reel-src)="/([^"]+\.(?:jpg|jpeg|png|webp|mp4|svg))"', text):
            assets.add(match)
    return assets


def main():
    includes, excludes = load_rules()
    print("vercelignore: %d exclude rules, %d include rules" % (len(excludes), len(includes)))
    missing_local, missing_cloud = [], []
    for asset in sorted(referenced_assets()):
        if not os.path.exists(os.path.join(ROOT, asset)):
            missing_local.append(asset)
        elif not is_uploaded(asset, includes, excludes):
            missing_cloud.append(asset)
    print("assets referenced:", len(referenced_assets()))
    print("missing locally :", len(missing_local), missing_local[:5])
    print("excluded from cloud build:", len(missing_cloud))
    for asset in missing_cloud[:15]:
        print("   -", asset)


if __name__ == "__main__":
    main()
