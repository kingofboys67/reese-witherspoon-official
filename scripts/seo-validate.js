#!/usr/bin/env node
/**
 * SEO / AEO / GEO validation gate for https://reesewitherspoonofficial.com
 *
 * Fails (exit 1) if any route breaks the official-entity contract:
 * canonicals, metadata, structured data, alt text, internal links,
 * robots.txt, sitemap.xml, llms.txt or IndexNow key.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const cfg = require('./seo-config');
const { ROOT, SITE, SITE_NAME, PERSON_ID, TODAY, EXCLUDE_FROM_SITEMAP } = cfg;

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

const SKIP_DIRS = new Set(['node_modules', '.git', '.vercel', 'scripts', 'api']);

/* Retired placeholder tokens that must never reappear (assembled at runtime). */
const RETIRED_ENTITY = 'Ree' + 'ta';
const RETIRED_ALT = 'ga' + 'na';
const LEGACY_PATTERN = new RegExp(RETIRED_ENTITY + '|' + RETIRED_ALT, 'gi');

function listHtml(dir = ROOT, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      listHtml(path.join(dir, entry.name), acc);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      acc.push(path.relative(ROOT, path.join(dir, entry.name)).split(path.sep).join('/'));
    }
  }
  return acc.sort();
}

const routeOf = (file) => file.replace(/index\.html$/, '').replace(/\.html$/, '');
const urlOf = (route) => (route === '' ? SITE + '/' : SITE + '/' + route);

function attr(tag, name) {
  const match = (tag || '').match(new RegExp(name + '="([^"]*)"', 'i'));
  return match ? match[1] : '';
}

function decode(value) {
  return (value || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function resolveInternal(target) {
  const clean = target.split('#')[0].split('?')[0];
  if (!clean.startsWith('/')) return true;
  if (clean === '/') return fs.existsSync(path.join(ROOT, 'index.html'));
  const rel = clean.slice(1);
  if (fs.existsSync(path.join(ROOT, rel))) return true;
  if (/\.[a-z0-9]{2,6}$/i.test(rel)) return false;
  return fs.existsSync(path.join(ROOT, rel + '.html')) ||
    fs.existsSync(path.join(ROOT, rel, 'index.html'));
}

function checkPage(file) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const route = routeOf(file);
  const expectedUrl = urlOf(route);
  const head = (html.match(/<head[^>]*>([\s\S]*?)<\/head>/i) || [])[1] || '';
  const indexable = !EXCLUDE_FROM_SITEMAP.has(file);

  if (!/<html[^>]+lang="?en/i.test(html)) fail(file + ': missing lang="en"');

  /* ---- title ---- */
  const titles = head.match(/<title>[\s\S]*?<\/title>/gi) || [];
  if (titles.length !== 1) fail(file + ': expected exactly 1 <title>, found ' + titles.length);
  const title = decode((titles[0] || '').replace(/<\/?title>/gi, '').trim());
  if (indexable) {
    if (!/Reese Witherspoon/.test(title)) fail(file + ': title missing entity name → ' + title);
    if (!/official/i.test(title)) fail(file + ': title missing "Official" → ' + title);
    if (title.length > 72) warn(file + ': title is ' + title.length + ' chars');
  }

  /* ---- description ---- */
  const descTags = head.match(/<meta\s+name="description"[^>]*>/gi) || [];
  if (descTags.length !== 1) fail(file + ': expected exactly 1 meta description, found ' + descTags.length);
  const description = decode(attr(descTags[0], 'content'));
  if (indexable) {
    if (!/Reese Witherspoon/.test(description)) fail(file + ': description missing entity name');
    if (!/official/i.test(description)) fail(file + ': description missing "Official"');
    if (description.length < 50) warn(file + ': description is short (' + description.length + ')');
    if (description.length > 175) warn(file + ': description is ' + description.length + ' chars');
  }

  /* ---- canonical ---- */
  const canonTags = head.match(/<link\s+rel="canonical"[^>]*>/gi) || [];
  if (canonTags.length !== 1) fail(file + ': expected exactly 1 canonical, found ' + canonTags.length);
  const canonical = attr(canonTags[0], 'href');
  if (canonical !== expectedUrl) {
    fail(file + ': canonical is "' + canonical + '", expected "' + expectedUrl + '"');
  }
  if (/\.html$/i.test(canonical)) fail(file + ': canonical must be a clean URL');

  /* ---- Open Graph ---- */
  const og = {};
  for (const tag of head.match(/<meta\s+property="og:[^"]*"[^>]*>/gi) || []) {
    og[attr(tag, 'property')] = decode(attr(tag, 'content'));
  }
  for (const key of ['og:title', 'og:description', 'og:url', 'og:type', 'og:image', 'og:site_name']) {
    if (!og[key]) fail(file + ': missing ' + key);
  }
  if (og['og:site_name'] !== SITE_NAME) fail(file + ': og:site_name must be "' + SITE_NAME + '"');
  if (og['og:url'] !== canonical) fail(file + ': og:url must equal canonical');
  if (og['og:image'] && !og['og:image'].startsWith(SITE + '/')) {
    fail(file + ': og:image must be an absolute URL on ' + SITE);
  }
  if ((html.match(/<meta\s+property="og:title"/gi) || []).length !== 1) fail(file + ': duplicate og:title');

  /* ---- Twitter / X ---- */
  const tw = {};
  for (const tag of head.match(/<meta\s+name="twitter:[^"]*"[^>]*>/gi) || []) {
    tw[attr(tag, 'name')] = decode(attr(tag, 'content'));
  }
  if (tw['twitter:card'] !== 'summary_large_image') fail(file + ': twitter:card must be summary_large_image');
  for (const key of ['twitter:title', 'twitter:description', 'twitter:image']) {
    if (!tw[key]) fail(file + ': missing ' + key);
  }

  /* ---- favicon / brand icon suite ---- */
  const iconHrefs = (head.match(/<link\s+rel="(?:icon|apple-touch-icon|manifest)"[^>]*>/gi) || [])
    .map((tag) => attr(tag, 'href'));
  for (const required of ['/favicon.ico', '/favicon.svg', '/favicon-48x48.png',
    '/icon-192x192.png', '/icon-512x512.png', '/apple-touch-icon.png', '/site.webmanifest']) {
    if (!iconHrefs.includes(required)) fail(file + ': missing <link> for ' + required);
  }
  if (og['og:image'] !== SITE + '/og-image.jpg') fail(file + ': og:image must be ' + SITE + '/og-image.jpg');
  if (og['og:image:width'] !== '1200' || og['og:image:height'] !== '630') {
    fail(file + ': og:image must declare 1200x630');
  }

  /* ---- structured data ---- */
  const nodes = [];
  const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];
  if (!blocks.length) fail(file + ': no JSON-LD found');
  for (const block of blocks) {
    const body = block.replace(/^<script[^>]*>/i, '').replace(/<\/script>$/i, '').trim();
    try {
      const parsed = JSON.parse(body);
      const roots = Array.isArray(parsed) ? parsed : [parsed];
      roots.forEach((root) => {
        if (root && Array.isArray(root['@graph'])) {
          root['@graph'].forEach((node) => nodes.push(node));
        } else {
          nodes.push(root);
        }
      });
    } catch (error) {
      fail(file + ': invalid JSON-LD (' + error.message.slice(0, 60) + ')');
    }
  }
  const types = nodes.map((node) => node['@type']);
  for (const required of ['Person', 'WebSite', 'BreadcrumbList']) {
    if (!types.includes(required)) fail(file + ': missing ' + required + ' schema');
  }

  const person = nodes.find((node) => node['@type'] === 'Person');
  if (person) {
    if (person['@id'] !== PERSON_ID) fail(file + ': Person @id must be ' + PERSON_ID);
    if (!Array.isArray(person.sameAs) || person.sameAs.length < 3) {
      fail(file + ': Person.sameAs needs verified profile URLs');
    }
    if (!Array.isArray(person.alternateName) ||
      !person.alternateName.some((name) => /Laura Jeanne Reese Witherspoon/i.test(name))) {
      fail(file + ': Person.alternateName must include the legal name');
    }
    const roles = Array.isArray(person.jobTitle) ? person.jobTitle.join(' ') : String(person.jobTitle || '');
    for (const role of ['Actress', 'Producer', 'Founder']) {
      if (!new RegExp(role, 'i').test(roles)) fail(file + ': Person.jobTitle missing "' + role + '"');
    }
    if (!Array.isArray(person.award) || !person.award.some((award) => /Emmy/i.test(award))) {
      fail(file + ': Person.award must include the Emmy Award');
    }
    if (!person.sameAs.some((url) => /imdb\.com/.test(url))) fail(file + ': Person.sameAs needs IMDb');
    if (!person.sameAs.some((url) => /wikipedia\.org/.test(url))) fail(file + ': Person.sameAs needs Wikipedia');
  }
  const website = nodes.find((node) => node['@type'] === 'WebSite');
  if (website && website.name !== SITE_NAME) fail(file + ': WebSite.name must be "' + SITE_NAME + '"');
  const breadcrumb = nodes.find((node) => node['@type'] === 'BreadcrumbList');
  if (breadcrumb && (!breadcrumb.itemListElement || !breadcrumb.itemListElement.length)) {
    fail(file + ': empty breadcrumb');
  }

  if (route === '') {
    if (!nodes.some((node) => node['@type'] === 'ProfilePage' &&
      node.mainEntity && node.mainEntity['@id'] === PERSON_ID)) {
      fail(file + ': ProfilePage.mainEntity must reference ' + PERSON_ID);
    }
    const faq = nodes.find((node) => node['@type'] === 'FAQPage');
    if (!faq) fail(file + ': missing FAQPage schema');
    else {
      const questions = faq.mainEntity || [];
      if (questions.length < 6) fail(file + ': FAQPage needs at least 6 questions');
      const asked = questions.map((q) => q.name).join(' | ');
      if (!/official website of Reese Witherspoon/i.test(asked)) {
        fail(file + ': FAQPage missing "What is the official website of Reese Witherspoon?"');
      }
      if (!/reels/i.test(asked)) fail(file + ': FAQPage missing the reels question');

      // Every schema question must exist as visible on-page content.
      const summaries = [...html.matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>/gi)]
        .map((match) => match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase());
      for (const question of questions) {
        const text = String(question.name || '').replace(/\s+/g, ' ').trim().toLowerCase();
        if (!summaries.some((summary) => summary === text)) {
          fail(file + ': FAQ question not visible on page → ' + question.name);
        }
      }
    }
  }

  /* ---- filmography ItemList + reel VideoObjects ---- */
  const videos = nodes.filter((node) => node['@type'] === 'VideoObject');
  if (route === '' || route === 'reels') {
    if (videos.length < 8) fail(file + ': expected 8+ VideoObject nodes, found ' + videos.length);
    for (const video of videos) {
      for (const key of ['name', 'description', 'thumbnailUrl', 'uploadDate', 'embedUrl', 'contentUrl']) {
        if (!video[key]) fail(file + ': VideoObject missing ' + key);
      }
      if (!video.actor || video.actor['@id'] !== PERSON_ID) {
        fail(file + ': VideoObject.actor must reference ' + PERSON_ID);
      }
    }
  }
  if (route === '' || route === 'films') {
    const list = nodes.find((node) => node['@type'] === 'ItemList');
    if (!list) fail(file + ': missing filmography ItemList schema');
    else if (!Array.isArray(list.itemListElement) || list.itemListElement.length < 30) {
      fail(file + ': ItemList must list 30+ filmography entries');
    }
  }
  const org = nodes.find((node) => node['@type'] === 'Organization');
  if (org) {
    const logo = org.logo && (org.logo.url || org.logo.contentUrl || org.logo);
    if (logo !== SITE + '/icon-512x512.png') {
      fail(file + ': Organization.logo must be ' + SITE + '/icon-512x512.png');
    }
  } else {
    fail(file + ': missing Organization schema');
  }

  /* ---- headings & images ---- */
  const h1s = html.match(/<h1[\s>]/gi) || [];
  if (indexable && h1s.length !== 1) fail(file + ': expected exactly 1 <h1>, found ' + h1s.length);
  if (route === '') {
    const h1Body = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '';
    const text = h1Body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!/Reese\s*Witherspoon/i.test(text)) {
      fail(file + ': homepage <h1> must read "Reese Witherspoon", found "' + text + '"');
    }
  }

  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  let missingAlt = 0;
  for (const tag of imgs) {
    if (!/\balt="/i.test(tag)) missingAlt += 1;
    else if (!attr(tag, 'alt').trim()) warn(file + ': empty alt on ' + (attr(tag, 'src') || 'image'));
  }
  if (missingAlt) fail(file + ': ' + missingAlt + ' <img> without alt attribute');

  /* ---- internal links ---- */
  let broken = 0;
  for (const raw of html.match(/href="([^"]+)"/gi) || []) {
    const target = raw.replace(/^href="/i, '').replace(/"$/, '');
    if (/\.html(?:[#?]|$)/i.test(target)) fail(file + ': internal link uses .html → ' + target);
    if (!resolveInternal(target) && broken++ < 3) fail(file + ': broken internal link → ' + target);
  }

  /* ---- retired placeholder traces ---- */
  const traces = html.match(LEGACY_PATTERN);
  if (traces) fail(file + ': retired placeholder traces (' + traces.length + ')');
  if (/\b(unofficial|fan site|fan archive|independent archive)\b/i.test(html)) {
    fail(file + ': contains unofficial / fan-site language');
  }

  /* ---- robots directive ---- */
  const robots = attr((head.match(/<meta\s+name="robots"[^>]*>/i) || [''])[0], 'content');
  if (indexable && /noindex/i.test(robots)) fail(file + ': indexable page marked noindex');
  if (!indexable && !/noindex/i.test(robots)) warn(file + ': ' + file + ' should be noindex');

  return { file, route, canonical, title, indexable };
}


/* ------------------------------------------------------------------ */
/* Official brand assets (favicons, manifest, OG image)                */
/* ------------------------------------------------------------------ */

function pngSize(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function jpegSize(file) {
  const buffer = fs.readFileSync(file);
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  return null;
}

function checkIcons() {
  const expected = [
    ['favicon.svg', null],
    ['favicon.ico', null],
    ['favicon-48x48.png', 48],
    ['icon-192x192.png', 192],
    ['icon-512x512.png', 512],
    ['apple-touch-icon.png', 180]
  ];
  for (const [name, size] of expected) {
    const file = path.join(ROOT, name);
    if (!fs.existsSync(file)) { fail('missing icon asset: ' + name); continue; }
    if (!size || !name.endsWith('.png')) continue;
    const dims = pngSize(file);
    if (!dims) { fail(name + ': not a valid PNG'); continue; }
    if (dims.width !== size || dims.height !== size) {
      fail(name + ': expected ' + size + 'x' + size + ', found ' + dims.width + 'x' + dims.height);
    }
  }

  const og = path.join(ROOT, 'og-image.jpg');
  if (!fs.existsSync(og)) fail('missing og-image.jpg');
  else {
    const dims = jpegSize(og);
    if (!dims) fail('og-image.jpg: not a valid JPEG');
    else if (dims.width !== 1200 || dims.height !== 630) {
      fail('og-image.jpg: expected 1200x630, found ' + dims.width + 'x' + dims.height);
    }
  }

  const manifestPath = path.join(ROOT, 'site.webmanifest');
  if (!fs.existsSync(manifestPath)) return fail('missing site.webmanifest');
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    return fail('site.webmanifest is not valid JSON');
  }
  if (manifest.name !== 'Reese Witherspoon — Official Website') {
    fail('site.webmanifest: name must be "Reese Witherspoon — Official Website"');
  }
  if (manifest.short_name !== 'Reese Witherspoon') {
    fail('site.webmanifest: short_name must be "Reese Witherspoon"');
  }
  const sizes = (manifest.icons || []).map((icon) => icon.sizes);
  for (const required of ['192x192', '512x512']) {
    if (!sizes.includes(required)) fail('site.webmanifest: missing ' + required + ' icon');
  }
}

function checkFilmographyAndReels() {
  const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const films = fs.readFileSync(path.join(ROOT, 'films.html'), 'utf8');
  const reels = fs.readFileSync(path.join(ROOT, 'reels.html'), 'utf8');

  const count = (html, pattern) => (html.match(pattern) || []).length;

  if (count(home, /class="fgx-card"/g) < 10) fail('index.html: homepage filmography needs 10+ cards');
  if (count(films, /class="fgx-card"/g) < 30) fail('films.html: full filmography needs 30+ cards');
  if (count(films, /<time datetime="\d{4}"/g) < 30) fail('films.html: cards need <time datetime> years');
  if (count(home, /data-reel-src="[^"]+\.mp4"/g) < 8) fail('index.html: reels rail needs 8+ playable clips');
  if (count(reels, /data-reel-src="[^"]+\.mp4"/g) < 8) fail('reels.html: reels rail needs 8+ playable clips');

  for (const [label, html] of [['index.html', home], ['films.html', films]]) {
    const filters = count(html, /class="fgx-tab" type="button" data-filter="(all|feature|series|producer|award)"/g);
    if (filters < 5) fail(label + ': filmography needs 5 filter tabs (all, feature, series, producer, award)');
  }

  // Every card image must reference an existing local asset.
  const source = home + films;
  const imageRe = /<img[^>]+src="(\/[^"]+)"[^>]*>/g;
  let match;
  while ((match = imageRe.exec(source))) {
    const rel = match[1].slice(1).split('?')[0];
    if (!fs.existsSync(path.join(ROOT, rel))) fail('broken card image → ' + match[1]);
  }
}


function checkRobots() {
  const file = path.join(ROOT, 'robots.txt');
  if (!fs.existsSync(file)) return fail('robots.txt is missing');
  const body = fs.readFileSync(file, 'utf8');
  const requiredAgents = [
    'Googlebot', 'Google-Extended', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User',
    'GPTBot', 'ClaudeBot', 'Claude-Web', 'anthropic-ai', 'PerplexityBot',
    'Applebot', 'Meta-ExternalAgent'
  ];
  for (const agent of requiredAgents) {
    if (!new RegExp('User-agent:\\s*' + agent + '\\b', 'i').test(body)) {
      fail('robots.txt: missing explicit User-agent for ' + agent);
    }
  }
  if (!/^Allow:\s*\/$/m.test(body)) fail('robots.txt: missing Allow: /');
  if (!body.includes('Sitemap: ' + SITE + '/sitemap.xml')) {
    fail('robots.txt: missing Sitemap: ' + SITE + '/sitemap.xml');
  }
}

function checkSitemap(pages) {
  const file = path.join(ROOT, 'sitemap.xml');
  if (!fs.existsSync(file)) {
    fail('sitemap.xml is missing');
    return [];
  }
  const body = fs.readFileSync(file, 'utf8');
  const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  if (!locs.length) fail('sitemap.xml contains no <loc> entries');
  if (new Set(locs).size !== locs.length) fail('sitemap.xml contains duplicate <loc> entries');
  if ((body.match(/<urlset/g) || []).length !== 1) fail('sitemap.xml must contain a single <urlset>');

  for (const loc of locs) {
    if (!loc.startsWith(SITE + '/')) fail('sitemap.xml: off-domain loc → ' + loc);
    if (/\.html$/i.test(loc)) fail('sitemap.xml: clean URL expected → ' + loc);
  }

  const homepageBlock =
    (body.match(/<url>\s*<loc>https:\/\/reesewitherspoonofficial\.com\/<\/loc>[\s\S]*?<\/url>/) || [''])[0];
  if (!/<priority>1\.0<\/priority>/.test(homepageBlock)) {
    fail('sitemap.xml: homepage must have <priority>1.0</priority>');
  }
  if (!homepageBlock.includes('<lastmod>' + TODAY + '</lastmod>')) {
    warn('sitemap.xml: homepage lastmod is not today (' + TODAY + ')');
  }
  if (!/xmlns:video="http:\/\/www\.google\.com\/schemas\/sitemap-video\/1\.1"/.test(body)) {
    fail('sitemap.xml: missing the video sitemap namespace');
  }
  const videoEntries = (body.match(/<video:video>/g) || []).length;
  if (videoEntries < 10) fail('sitemap.xml: expected 10+ <video:video> entries, found ' + videoEntries);
  for (const key of ['<video:thumbnail_loc>', '<video:title>', '<video:description>', '<video:content_loc>']) {
    if (!body.includes(key)) fail('sitemap.xml: video entries missing ' + key);
  }

  for (const page of pages.filter((entry) => entry.indexable)) {
    if (!locs.includes(page.canonical)) fail('sitemap.xml: missing route ' + page.canonical);
  }
  return locs;
}


function checkLlmsTxt(locs) {
  const file = path.join(ROOT, 'llms.txt');
  if (!fs.existsSync(file)) fail('llms.txt is missing');
  else {
    const body = fs.readFileSync(file, 'utf8');
    if (!body.includes(SITE)) fail('llms.txt: canonical domain missing');
    if (!/official website/i.test(body)) fail('llms.txt: no official-website statement');
    if (!/Canonical Authority Notice/i.test(body)) fail('llms.txt: missing Canonical Authority Notice');
    for (const loc of locs) {
      if (!body.includes(loc)) fail('llms.txt: route not listed → ' + loc);
    }
  }

  const full = path.join(ROOT, 'llms-full.txt');
  if (!fs.existsSync(full)) fail('llms-full.txt is missing');
  else {
    const body = fs.readFileSync(full, 'utf8');
    if (!body.includes(SITE)) fail('llms-full.txt: canonical domain missing');
    if (!/Reese Witherspoon/.test(body)) fail('llms-full.txt: entity name missing');
    if (body.length < 5000) warn('llms-full.txt: knowledge base looks thin');
  }
}

function checkIndexNow() {
  const candidates = fs.readdirSync(ROOT).filter((name) => /^[a-f0-9]{32,}\.txt$/i.test(name));
  if (!candidates.length) {
    fail('IndexNow key file (32+ hex characters .txt at site root) is missing');
    return;
  }
  const key = candidates[0].replace(/\.txt$/, '');
  const body = fs.readFileSync(path.join(ROOT, candidates[0]), 'utf8').trim();
  if (body !== key) fail('IndexNow key file content must match its filename');
  const vercel = fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8');
  if (!vercel.includes('indexnow')) warn('vercel.json: no IndexNow endpoint allowance found');
}

function checkSupportingSitemaps() {
  for (const name of ['image-sitemap.xml', 'video-sitemap.xml', 'feed.xml']) {
    const file = path.join(ROOT, name);
    if (!fs.existsSync(file)) {
      warn(name + ' is missing');
      continue;
    }
    const body = fs.readFileSync(file, 'utf8');
    if (!body.includes(SITE)) fail(name + ': does not reference ' + SITE);
    if (new RegExp(RETIRED_ENTITY + '|' + RETIRED_ALT, 'i').test(body)) {
      fail(name + ': retired placeholder reference');
    }
    if (/\.html</.test(body)) fail(name + ': uses .html URLs instead of clean URLs');
  }
}

/* ------------------------------------------------------------------ */
/* Run                                                                 */
/* ------------------------------------------------------------------ */

function main() {
  const pages = listHtml().map(checkPage);
  checkRobots();
  const locs = checkSitemap(pages);
  checkLlmsTxt(locs);
  checkIndexNow();
  checkSupportingSitemaps();
  checkIcons();
  checkFilmographyAndReels();

  const indexable = pages.filter((page) => page.indexable).length;
  console.log('Reese Witherspoon SEO validation — ' + TODAY);
  console.log('  pages checked : ' + pages.length + ' (' + indexable + ' indexable)');
  console.log('  errors        : ' + errors.length);
  console.log('  warnings      : ' + warnings.length);

  if (warnings.length) {
    console.log('\nWarnings:');
    warnings.forEach((message) => console.log('  ! ' + message));
  }
  if (errors.length) {
    console.log('\nErrors:');
    errors.forEach((message) => console.log('  x ' + message));
    process.exit(1);
  }
  console.log('\n✓ All SEO, schema, AI-discovery and indexing checks passed.');
}

if (require.main === module) main();

module.exports = { listHtml, checkPage };

