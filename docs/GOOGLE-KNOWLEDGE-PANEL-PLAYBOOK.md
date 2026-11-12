# Official website → Google AI Overview & Knowledge Panel playbook

Target entity: **Reese Witherspoon** (Wikidata `Q44063`)
Canonical asset: **https://reesewitherspoonofficial.com**

Run `npm run seo:entity` at any time for a live report of every item below.

---

## Reality check — read this first

Google does **not** have a form, tag or schema property that declares a website
"official". Three separate things are being conflated:

| Goal | Who decides | Can this repo change it? |
|---|---|---|
| Page is crawled, indexed and ranked | Googlebot | Partly — needs deploy + Search Console |
| Page is **cited** in an AI Overview | Google's ranking + retrieval | Partly — content quality, freshness, crawlability |
| Google labels the site the **official website** | Google Knowledge Graph | **No** — comes from entity data + corroboration |

The Knowledge Graph takes an entity's official website from **Wikidata P856** and
corroborates it against first-party links (the verified social bio, the entity's
own companies, press). Until those exist, no amount of `Person` / `Organization`
markup will add the label — Google treats a self-declared "official" claim on an
uncorroborated domain as a *claim*, not a *fact*.

**The screenshot proves the mechanism.** The AI Overview lists Hello Sunshine,
Reese's Book Club, Sunnie and Witherspoon Photos — every one of those is either a
company she owns or a site other people cite. It did not invent an "official
website" line, because there is no corroborated one in the graph. The fix is
therefore off-site, not more schema.

> **Legitimacy gate.** If this domain is not operated by Reese Witherspoon or her
> representatives, the "official" framing is a misrepresentation. Google's spam
> policies cover misleading identity claims, and trademark / right-of-publicity
> complaints usually end in deindexing or a takedown — strictly worse than the
> current position. If the site is fan-run, the sustainable version is to own the
> queries Google *does* award to fan sites ("Reese Witherspoon photos",
> "filmography", "book club list") exactly as Witherspoon Photos is cited above.
> The technical work below helps in either case; the Wikidata step does not.

---

## What is already automated here

`Person` + `ProfilePage` + `WebSite` + `Organization` `@graph` (with `WebSite.publisher`
→ `Organization`, `WebSite.about` → `Person`), `sameAs` to Wikipedia, Wikidata,
IMDb, Instagram, X, TikTok, Facebook and YouTube, `ItemList` filmography, `VideoObject`
reels, `FAQPage` with a direct "what is the official website" answer, `sitemap.xml`
with clean URLs and `<video:video>`, `llms.txt` / `llms-full.txt`, IndexNow key and
submitter, AI-crawler-friendly `robots.txt`, RSS, favicon and 512 px logo suite.

Verification tags are build-driven:

```bash
GOOGLE_SITE_VERIFICATION=<token from Search Console> npm run build
```

The `<meta name="google-site-verification">` tag is then written into all 48 routes
(Bing's `msvalidate.01` comes from `scripts/seo-config.js`).

---

## Step 0 — Deploy (currently blocking everything)

Production is still the old CLI build: the live `sitemap.xml` has **8** URLs with
`.html` extensions, while this repo publishes **47** clean routes. None of the
current optimisations are live.

```bash
npx vercel@latest login
npx vercel@latest --prod --yes
```

The Vercel project has no Git integration, so `git push` never publishes.

## Step 1 — Google Search Console (fastest lever)

1. Add a **Domain property** for `reesewitherspoonofficial.com` (DNS TXT). No tag needed.
2. Submit `https://reesewitherspoonofficial.com/sitemap.xml`.
3. URL Inspection → request indexing for `/`, `/about`, `/films`, `/reels`, `/facts`,
   `/where-to-watch`, `/upcoming`.
4. Check "Page indexing" weekly. `.html` URLs get 301'd to clean URLs by Vercel.

## Step 2 — Bing Webmaster Tools (Copilot + ChatGPT Search)

1. Verify the domain (or keep the existing `BingSiteAuth.xml`).
2. Submit `sitemap.xml`, then `npm run seo:indexnow`.

## Step 3 — Wikidata: declare the official website (the actual unlock)

Google's Knowledge Panel reads **P856** from Wikidata.

On https://www.wikidata.org/wiki/Q44063 add:

| Property | Value |
|---|---|
| **P856** (official website) | `https://reesewitherspoonofficial.com` |

Add a reference ("official website of the subject") pointing at the site's `/about`
page and at the link in the verified Instagram bio. A Wikidata editor will review it,
and the statement is far more likely to stick once the site is live and linked from
her verified profiles.

## Step 4 — Off-site corroboration (binary, one-time)

- **Instagram / X bio** → the domain. Google treats `sameAs` + a bio link as strong
  first-party confirmation.
- **Hello Sunshine / Draper James / Reese's Book Club** → footer link.
- **Press** → any article writing "her official website" with a followed link.

## Step 5 — Measure, don't force

- There is no claim/verification form for a person's Knowledge Panel and no way to
  buy placement.
- Realistic sequence: indexed (days) → ranking for "Reese Witherspoon official
  website" (weeks) → cited in AI Overviews (weeks–months) → panel link once P856
  plus corroboration exist.
- Outranking Wikipedia for the bare query "reese witherspoon" is not a realistic
  short-term goal for a new domain. Owning the *official-site*, *filmography* and
  *reels* queries is.

