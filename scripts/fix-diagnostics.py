#!/usr/bin/env python3
"""Resolves the 8 IDE diagnostics + 2 JS syntax errors in one pass."""
import io
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
SITE = "https://reesewitherspoonofficial.com"

REPLACEMENTS = {
    "fan-card.html": [
        ('<img id="photo-preview" src="" alt="Member Photo"/>',
         '<img id="photo-preview" src="' + PIXEL + '" alt="Member photo preview" decoding="async"/>'),
    ],
    "films.html": [
        ('<img id="fm-poster-img" src="" alt="Movie poster"/>',
         '<img id="fm-poster-img" src="' + PIXEL + '" alt="Reese Witherspoon movie poster" decoding="async"/>'),
        ('<a class="fm-trailer-cta-btn" id="fm-trailer-btn" href="#" target="_blank" rel="noopener">',
         '<a class="fm-trailer-cta-btn" id="fm-trailer-btn" href="/reels" target="_blank" rel="noopener">'),
    ],
    "gallery.html": [
        ('<img id="lb-img" src="" alt="Gallery photo"/>',
         '<img id="lb-img" src="' + PIXEL + '" alt="Reese Witherspoon gallery photo" decoding="async"/>'),
    ],
    "index.html": [
        ('<img id="lb-img" src="" alt="Reese Witherspoon photo preview"/>',
         '<img id="lb-img" src="' + PIXEL + '" alt="Reese Witherspoon photo preview" decoding="async"/>'),
    ],
    "join.html": [
        ('<img id="preview-img" src="" alt="Preview"/>',
         '<img id="preview-img" src="' + PIXEL + '" alt="Fan card preview" decoding="async"/>'),
    ],
    "welcome-email.html": [
        ('<a href="#" style="color: #9E9AA8; text-decoration: underline;">Unsubscribe</a>',
         '<a href="' + SITE + '/community" style="color: #9E9AA8; text-decoration: underline;">Unsubscribe</a>'),
        ('<a href="#" style="color: #9E9AA8; text-decoration: underline;">Update Preferences</a>',
         '<a href="' + SITE + '/community" style="color: #9E9AA8; text-decoration: underline;">Update Preferences</a>'),
    ],
    "reels.js": [
        ("tags: 'book club monthly pick announcement Reese's books reading selection'",
         "tags: 'book club monthly pick announcement Reese\\'s books reading selection'"),
    ],
}

GENERATOR_TAIL = """const fileContent = `export function getWelcomeEmailHtml(from_name, from_email) {
  return \\`${html}\\`;
}
`;
"""


def patch_files():
    for name, pairs in REPLACEMENTS.items():
        path = os.path.join(ROOT, name)
        with io.open(path, encoding="utf-8") as handle:
            text = handle.read()
        original = text
        for old, new in pairs:
            if old not in text:
                print("  ! pattern not found in %s: %s" % (name, old[:60]))
            text = text.replace(old, new)
        if text != original:
            with io.open(path, "w", encoding="utf-8") as handle:
                handle.write(text)
            print("  fixed", name)


def patch_generator():
    path = os.path.join(ROOT, "generate_template.js")
    with io.open(path, encoding="utf-8") as handle:
        lines = handle.readlines()
    start = next(i for i, line in enumerate(lines) if line.startswith("const fileContent ="))
    end = next(i for i in range(start, len(lines)) if lines[i].rstrip("\n") in ("\\`;", "`;"))
    lines[start:end + 1] = [GENERATOR_TAIL]
    with io.open(path, "w", encoding="utf-8") as handle:
        handle.writelines(lines)
    print("  fixed generate_template.js")


if __name__ == "__main__":
    patch_files()
    patch_generator()
