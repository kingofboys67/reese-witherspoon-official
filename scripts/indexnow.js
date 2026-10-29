#!/usr/bin/env node
/**
 * IndexNow submission for https://reesewitherspoonofficial.com
 *
 * Submits every URL in sitemap.xml to the IndexNow endpoint used by Bing,
 * Microsoft Copilot and ChatGPT Search so new or updated pages are indexed
 * within minutes of deployment.
 *
 * Usage: npm run seo:indexnow
 * The key file must be deployed at https://reesewitherspoonofficial.com/<key>.txt
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HOST = 'reesewitherspoonofficial.com';
const SITE = 'https://' + HOST;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

function readKey() {
  const file = fs.readdirSync(ROOT).find((name) => /^[a-f0-9]{32,}\.txt$/i.test(name));
  if (!file) throw new Error('IndexNow key file not found at project root');
  return { key: file.replace(/\.txt$/, ''), keyFile: file };
}

function readUrls() {
  const sitemap = path.join(ROOT, 'sitemap.xml');
  if (!fs.existsSync(sitemap)) throw new Error('sitemap.xml not found — run npm run build first');
  const body = fs.readFileSync(sitemap, 'utf8');
  return [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

async function main() {
  const { key, keyFile } = readKey();
  const urlList = readUrls();

  const payload = {
    host: HOST,
    key,
    keyLocation: SITE + '/' + keyFile,
    urlList
  };

  console.log('IndexNow: submitting ' + urlList.length + ' URLs for ' + HOST);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
    signal: controller.signal
  }).finally(() => clearTimeout(timer));

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error('IndexNow rejected the submission (' + response.status + '): ' + detail);
  }
  console.log('IndexNow: accepted (' + response.status + ').');
}

if (require.main === module) {
  main().catch((error) => {
    console.error('IndexNow error: ' + error.message);
    process.exit(1);
  });
}

module.exports = { readKey, readUrls };
