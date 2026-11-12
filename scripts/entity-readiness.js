#!/usr/bin/env node
/**
 * Entity-readiness audit for https://reesewitherspoonofficial.com
 *
 * Answers one question: "what still stands between this site and being
 * labelled/cited as the entity's official website by Google (AI Overviews,
 * Knowledge Panel) and the other answer engines?"
 *
 * Two groups of checks:
 *   1. ON-SITE  — things this repo can prove from the built files.
 *   2. OFF-SITE — things only the owner can do (Search Console, Wikidata,
 *                 social bios, press links). Reported as pending until done.
 *
 * Usage:
 *   node scripts/entity-readiness.js            # report (always exit 0)
 *   node scripts/entity-readiness.js --strict   # exit 1 if the contract fails
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const cfg = require('./seo-config');
const { ROOT, SITE } = cfg;

const STRICT = process.argv.includes('--strict');
const OPEN = process.argv.includes('--open');
const results = [];

function record(group, label, status, detail) {
  results.push({ group, label, status, detail });
}

function read(file) {
  const full = path.join(ROOT, file);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}

/** Every JSON-LD node of the homepage graph. */
function homeGraph() {
  const html = read('index.html');
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  const nodes = [];
  for (const block of blocks) {
    try {
      const data = JSON.parse(block[1].trim());
      if (Array.isArray(data['@graph'])) nodes.push(...data['@graph']);
      else nodes.push(data);
    } catch (error) {
      record('on-site', 'JSON-LD parses', 'FAIL', 'Invalid JSON-LD: ' + error.message);
    }
  }
  return nodes;
}

function findNode(nodes, type, idSuffix) {
  return nodes.find(
    (node) =>
      node &&
      (node['@type'] === type || (Array.isArray(node['@type']) && node['@type'].includes(type))) &&
      (!idSuffix || String(node['@id'] || '').endsWith(idSuffix))
  );
}

/* ------------------------------------------------------------------ */
/* 1. On-site entity contract                                          */
/* ------------------------------------------------------------------ */

function checkOnSite() {
  const nodes = homeGraph();

  const person = findNode(nodes, 'Person');
  record(
    'on-site',
    'Person node with canonical @id',
    person && person['@id'] === cfg.PERSON_ID ? 'PASS' : 'FAIL',
    person ? person['@id'] : 'missing'
  );

  const site = findNode(nodes, 'WebSite');
  record('on-site', 'WebSite node', site ? 'PASS' : 'FAIL', site ? site['@id'] : 'missing');

  if (site) {
    const publisherId =
      typeof site.publisher === 'object' && site.publisher ? site.publisher['@id'] : null;
    record(
      'on-site',
      'WebSite.publisher → Organization',
      publisherId && publisherId.endsWith('#organization') ? 'PASS' : 'FAIL',
      publisherId || 'not set'
    );
    record(
      'on-site',
      'WebSite.about → Person (entity link)',
      site.about && site.about['@id'] === cfg.PERSON_ID ? 'PASS' : 'FAIL',
      site.about ? site.about['@id'] : 'not set'
    );
  }

  const org = findNode(nodes, 'Organization', '#organization');
  record('on-site', 'Organization node', org ? 'PASS' : 'FAIL', org ? org['@id'] : 'missing');
  if (org) {
    record(
      'on-site',
      'Organization logo 512×512 (Knowledge Panel image)',
      org.logo && org.logo.width === 512 ? 'PASS' : 'FAIL',
      org.logo ? org.logo.contentUrl : 'missing'
    );
  }

  const sameAs = (person && person.sameAs) || [];
  const required = [
    ['Wikipedia', 'wikipedia.org'],
    ['Wikidata', 'wikidata.org'],
    ['IMDb', 'imdb.com'],
    ['Instagram', 'instagram.com']
  ];
  for (const [name, needle] of required) {
    record(
      'on-site',
      'sameAs → ' + name,
      sameAs.some((url) => String(url).includes(needle)) ? 'PASS' : 'FAIL',
      sameAs.length + ' sameAs entries'
    );
  }

  const html = read('index.html');
  const hasGoogleTag = /<meta name="google-site-verification"/.test(html);
  record(
    'on-site',
    'google-site-verification meta tag',
    hasGoogleTag ? 'PASS' : 'PENDING',
    hasGoogleTag
      ? 'present in built HTML'
      : 'set GOOGLE_SITE_VERIFICATION=<token> then npm run build (or use a DNS TXT Domain property)'
  );

  record(
    'on-site',
    'Direct "official website" Q→A passage',
    /What is the official website of Reese Witherspoon/i.test(html) ? 'PASS' : 'FAIL',
    'AI Overviews quote direct answer passages'
  );

  const llms = read('llms.txt');
  record(
    'on-site',
    'llms.txt canonical notice',
    /canonical/i.test(llms) && llms.includes(SITE) ? 'PASS' : 'FAIL',
    'llms.txt ' + llms.length + ' chars'
  );

  const robots = read('robots.txt');
  record(
    'on-site',
    'robots.txt allows AI crawlers + sitemap',
    /Google-Extended/.test(robots) && /OAI-SearchBot/.test(robots) && robots.includes('Sitemap:')
      ? 'PASS'
      : 'FAIL',
    'Google-Extended · OAI-SearchBot · PerplexityBot · ClaudeBot'
  );

  const sitemap = read('sitemap.xml');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const htmlSuffix = locs.filter((loc) => /\.html$/.test(loc)).length;
  record(
    'on-site',
    'sitemap.xml uses clean URLs',
    locs.length && htmlSuffix === 0 ? 'PASS' : 'FAIL',
    locs.length + ' URLs, ' + htmlSuffix + ' still end in .html'
  );
  record('on-site', 'sitemap size', 'INFO', locs.length + ' indexable URLs');
}

/* ------------------------------------------------------------------ */
/* 2. Off-site corroboration (owner actions — cannot be automated)     */
/* ------------------------------------------------------------------ */

const OFF_SITE = [
  {
    who: 'Deploy',
    what: 'Publish the current commit — production still serves the old build',
    why: 'The live sitemap has 8 .html URLs; this repo has over 40 clean routes. Unpublished fixes cannot rank.',
    how: 'git push origin main (if the Vercel project has Git integration) or npx vercel@latest --prod --yes'
  },
  {
    who: 'Google Search Console',
    what: 'Verify a DOMAIN property (DNS TXT) for the domain root',
    why: 'Ownership verification is the only first-party signal that this host belongs to the entity.',
    how: 'Add property → Domain → add the TXT record in DNS.',
    link: 'https://search.google.com/search-console/welcome'
  },
  {
    who: 'Google Search Console',
    what: 'Submit /sitemap.xml, then URL Inspection → Request indexing on /, /about, /films, /reels, /facts',
    why: 'AI Overviews can only cite pages Google has crawled and indexed.',
    how: 'Sitemaps → Add new sitemap → ' + SITE + '/sitemap.xml',
    link: 'https://search.google.com/search-console/sitemaps'
  },
  {
    who: 'Wikidata (Q44063)',
    what: 'Add statement P856 "official website" = ' + SITE,
    why: 'Knowledge Panels and AI Overview entity summaries read P856 from Wikidata. Today P856 points at reesesbookclub.com, which is why the AI Overview lists the Book Club and not this domain.',
    how: 'Needs a reference (verified-profile link or press coverage). Wikidata editors will review the edit.',
    link: 'https://www.wikidata.org/wiki/Q44063'
  },
  {
    who: 'Verified social accounts',
    what: 'Put the domain in the Instagram / X / TikTok / Facebook website field',
    why: 'A followed link from an account Google has verified as the person is what upgrades "a website about X" into "the website of X".',
    how: 'Instagram → Edit profile → Website. X → Profile → Website.',
    link: 'https://www.instagram.com/reesewitherspoon/'
  },
  {
    who: 'Third-party mentions',
    what: 'Get cited as "her official website" by outlets, Hello Sunshine or Reese\'s Book Club',
    why: 'AI Overviews weigh what independent, already-trusted sources say. On-page markup never establishes officialdom on its own.',
    how: 'Press kit → outreach. One followed link from a trusted outlet beats any schema change.'
  },
  {
    who: 'Bing Webmaster Tools',
    what: 'Verify the domain and submit the sitemap (feeds Copilot and ChatGPT Search)',
    why: 'Second index, same pages; already wired via msvalidate.01.',
    how: 'npm run seo:indexnow pushes all sitemap URLs in one call.',
    link: 'https://www.bing.com/webmasters'
  }
];

/* ------------------------------------------------------------------ */
/* Report                                                              */
/* ------------------------------------------------------------------ */

const ICON = { PASS: '✓', FAIL: '✗', PENDING: '·', INFO: 'i' };

function print() {
  const line = (text) => console.log(text);

  line('');
  line('Entity readiness — ' + SITE);
  line('='.repeat(66));

  line('');
  line('ON-SITE (this repo can fix these)');
  line('-'.repeat(66));
  for (const item of results.filter((result) => result.group === 'on-site')) {
    line(' ' + (ICON[item.status] || '?') + ' ' + item.label);
    if (item.detail) line('     ' + item.detail);
  }

  const failures = results.filter((item) => item.status === 'FAIL');
  const pending = results.filter((item) => item.status === 'PENDING');

  line('');
  line('OFF-SITE (only the site owner can do these — priority order)');
  line('-'.repeat(66));
  OFF_SITE.forEach((step, index) => {
    line(' ' + (index + 1) + '. ' + step.who + ' — ' + step.what);
    line('     why: ' + step.why);
    line('     how: ' + step.how);
    if (step.link) line('     link: ' + step.link);
  });

  line('');
  line('SUMMARY');
  line('-'.repeat(66));
  line('  on-site failures : ' + failures.length);
  line('  on-site pending  : ' + pending.length);
  line('  off-site steps   : ' + OFF_SITE.length + ' (not automatable)');
  line('');
  line('  On-site markup alone cannot label a site "official" in Google. That label comes');
  line('  from the Knowledge Graph (Wikidata P856) plus first-party corroboration. Schema');
  line('  only makes the claim unambiguous once that trust already exists.');
  line('');

  const links = OFF_SITE.filter((step) => step.link);
  if (links.length) {
    line('1-CLICK LINKS  (open them all: npm run seo:entity -- --open)');
    line('-'.repeat(66));
    links.forEach((step) => line('  ' + step.link + '   <- ' + step.who));
    line('');

    if (OPEN) {
      for (const step of links) {
        try {
          execSync('open ' + JSON.stringify(step.link));
          line('  opened: ' + step.link);
        } catch (error) {
          line('  could not open ' + step.link + ' (' + error.message + ')');
        }
      }
      line('');
    }
  }

  if (STRICT && (failures.length || pending.length)) {
    line('STRICT MODE: on-site contract incomplete.');
    process.exit(1);
  }
}

checkOnSite();
print();
