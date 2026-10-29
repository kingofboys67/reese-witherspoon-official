#!/usr/bin/env node
/**
 * Builds the Official Filmography grid + Watchable Reels rail.
 *
 * - Reads scripts/data/filmography.json and scripts/data/reels.json
 * - Renders crawlable <article> cards and 9:16 reel buttons
 * - Injects them into index.html, films.html and reels.html markers
 * - Verifies every local asset exists and is whitelisted in .vercelignore
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://reesewitherspoonofficial.com';

const filmography = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'filmography.json'), 'utf8'));
const reels = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'reels.json'), 'utf8'));

const KIND_LABEL = { film: 'Feature Film', series: 'Television Series' };
const HOME_ORDER = [
  'walk-the-line', 'legally-blonde', 'wild', 'big-little-lies', 'the-morning-show',
  'sweet-home-alabama', 'election', 'legally-blonde-3', 'your-place-or-mine',
  'little-fires-everywhere', 'cruel-intentions', 'sing'
];

const problems = [];
const FALLBACK_IMAGE = '/og-image.jpg';

function assetExists(rel) {
  const clean = rel.replace(/^\//, '');
  if (fs.existsSync(path.join(ROOT, clean))) return true;
  problems.push('missing asset: ' + rel);
  return false;
}

/** Image path with a guaranteed-present fallback (never ships a broken <img>). */
function imagePath(rel) {
  const clean = rel.replace(/^\//, '');
  return assetExists(rel) ? '/' + clean : FALLBACK_IMAGE;
}

function esc(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sortEntries(list) {
  return list.slice().sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}

function renderCard(entry) {
  const posterPath = imagePath(entry.poster);
  assetExists(entry.poster);
  const kind = KIND_LABEL[entry.kind] || 'Feature Film';
  const alt = entry.title + ' (' + entry.year + ') — Reese Witherspoon as ' +
    (entry.credit.indexOf('Producer') === 0 ? 'executive producer' : entry.role);

  const trailerBtn = entry.trailer
    ? '<button type="button" class="fgx-btn" data-trailer="' + esc(entry.trailer) +
      '" data-trailer-title="' + esc(entry.title + ' — Official Trailer') + '">Trailer</button>'
    : '';
  const detailsBtn = '<a class="fgx-btn fgx-btn--solid" href="' + esc(entry.details) + '">Details</a>';
  const watchBtn = '<a class="fgx-btn" href="/where-to-watch">Where to Watch</a>';

  return [
    '<article class="fgx-card" data-cats="' + esc(entry.cats.join(' ')) + '" data-year="' + entry.year + '" id="fg-' + esc(entry.id) + '">',
    '  <div class="fgx-poster">',
    '    <img src="' + esc(posterPath) + '" alt="' + esc(alt) + '" width="440" height="660" loading="lazy" decoding="async"/>',
    entry.badge ? '    <span class="fgx-badge">' + esc(entry.badge) + '</span>' : '',
    '    <span class="fgx-kind">' + esc(kind) + '</span>',
    '  </div>',
    '  <div class="fgx-body">',
    '    <h3 class="fgx-title"><a href="' + esc(entry.details) + '">' + esc(entry.title) + '</a></h3>',
    '    <p class="fgx-year"><time datetime="' + entry.year + '">' + entry.year + '</time> · ' + esc(entry.credit) + '</p>',
    '    <p class="fgx-role">' + esc(entry.role) + '</p>',
    '    <div class="fgx-actions">',
    '      ' + trailerBtn,
    '      ' + detailsBtn,
    '      ' + watchBtn,
    '    </div>',
    '  </div>',
    '</article>'
  ].filter(Boolean).join('\n');
}

function renderReel(entry) {
  const src = '/' + entry.src.replace(/^\//, '');
  if (!assetExists(entry.src)) return '';
  const poster = imagePath(entry.poster);
  return [
    '<button type="button" class="rxl-card" data-reel-src="' + esc(src) + '"',
    '  data-reel-poster="' + esc(poster) + '" data-reel-title="' + esc(entry.title) + '"',
    '  aria-label="Play reel: ' + esc(entry.title) + '">',
    '  <img src="' + esc(poster) + '" alt="Reese Witherspoon — ' + esc(entry.title) + '" width="360" height="640" loading="lazy" decoding="async"/>',
    '  <span class="rxl-play" aria-hidden="true">▶</span>',
    '  <span class="rxl-meta">',
    '    <span class="rxl-cat">' + esc(entry.category) + '</span>',
    '    <span class="rxl-title">' + esc(entry.title) + '</span>',
    '  </span>',
    '</button>'
  ].join('\n');
}

/**
 * Replaces the inner HTML of the element carrying `id`.
 * Uses tag-depth scanning so nested <div> children never break the match.
 */
function replaceChildren(html, id, inner) {
  const idIndex = html.indexOf('id="' + id + '"');
  if (idIndex === -1) return null;
  const tagStart = html.lastIndexOf('<div', idIndex);
  if (tagStart === -1) return null;
  const tagEnd = html.indexOf('>', idIndex) + 1;
  if (tagEnd <= 0) return null;

  const re = /<\/?div\b[^>]*>/g;
  re.lastIndex = tagEnd;
  let depth = 1;
  let match;
  while ((match = re.exec(html))) {
    if (match[0].indexOf('</') === 0) depth -= 1;
    else depth += 1;
    if (depth === 0) {
      return html.slice(0, tagEnd) + '\n' + inner + '\n    ' + html.slice(match.index);
    }
  }
  return null;
}

function inject(file, targetId, html, label) {
  const filePath = path.join(ROOT, file);
  const source = fs.readFileSync(filePath, 'utf8');
  const updated = replaceChildren(source, targetId, html);
  if (!updated) {
    problems.push('container #' + targetId + ' not found in ' + file + ' (' + label + ')');
    return 0;
  }
  fs.writeFileSync(filePath, updated, 'utf8');
  return 1;
}


function ensureWhitelisted(assets) {
  const ignorePath = path.join(ROOT, '.vercelignore');
  if (!fs.existsSync(ignorePath)) return;
  const lines = fs.readFileSync(ignorePath, 'utf8').split('\n');
  const set = new Set(lines.map((line) => line.trim()));
  const added = [];
  assets.forEach((asset) => {
    const rel = asset.replace(/^\//, '');
    if (!rel.startsWith('reesewitherspoon/')) return;
    const rule = '!' + rel;
    if (!set.has(rule)) {
      set.add(rule);
      added.push(rule);
    }
  });
  if (added.length) {
    try {
      fs.writeFileSync(ignorePath, lines.concat(added).join('\n') + '\n', 'utf8');
    } catch (error) {
      console.log('  ! could not update .vercelignore (read-only build): ' + error.message);
    }
  }
  return added;
}

function writeManifest() {
  const assets = new Set();
  filmography.entries.forEach((entry) => assets.add('/' + entry.poster.replace(/^\//, '')));
  reels.entries.forEach((entry) => {
    assets.add('/' + entry.poster.replace(/^\//, ''));
    assets.add('/' + entry.src.replace(/^\//, ''));
  });
  const manifest = {
    updated: new Date().toISOString().slice(0, 10),
    site: SITE,
    filmographyCount: filmography.entries.length,
    reelCount: reels.entries.length,
    assets: Array.from(assets).sort()
  };
  fs.writeFileSync(
    path.join(__dirname, 'data', 'media-manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
    'utf8'
  );
  return manifest;
}

function main() {
  const all = sortEntries(filmography.entries);
  const byId = new Map(all.map((entry) => [entry.id, entry]));
  const homeEntries = HOME_ORDER
    .map((id) => byId.get(id))
    .filter(Boolean)
    .slice(0, 12);

  const homeCards = homeEntries.map(renderCard).join('\n');
  const filmsCards = all.map(renderCard).join('\n');
  const reelCards = reels.entries.map(renderReel).join('\n');

  inject('index.html', 'fgGridHome', homeCards, 'home filmography');
  inject('films.html', 'fgGridFilms', filmsCards, 'full filmography');
  inject('index.html', 'reelRail', reelCards, 'home reels');
  inject('reels.html', 'reelRailTop', reelCards, 'reels rail');

  const manifest = writeManifest();
  const added = ensureWhitelisted(manifest.assets) || [];

  console.log('Reese Witherspoon showcase build');
  console.log('  filmography entries : ' + all.length + ' (' + homeEntries.length + ' on homepage)');
  console.log('  reels               : ' + reels.entries.length);
  console.log('  media whitelisted   : ' + added.length + ' new .vercelignore rule(s)');

  if (problems.length) {
    console.log('\nAsset warnings (build continues, fallbacks applied):');
    problems.slice(0, 10).forEach((problem) => console.log('  ! ' + problem));
    if (problems.length > 10) console.log('  ! … ' + (problems.length - 10) + ' more');
  } else {
    console.log('  ✓ all poster, still and video assets verified locally');
  }
  console.log('  build complete');
}

if (require.main === module) main();

module.exports = { renderCard, renderReel, filmography, reels };

