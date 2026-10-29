// Quick tag-balance audit for the pages touched by the showcase build.
const fs = require('fs');

const files = process.argv.slice(2);
const TAGS = ['div', 'section', 'article', 'main', 'ul', 'button', 'a', 'span'];

let failed = false;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const report = [];
  for (const tag of TAGS) {
    const open = (html.match(new RegExp('<' + tag + '\\b', 'gi')) || []).length;
    const close = (html.match(new RegExp('</' + tag + '>', 'gi')) || []).length;
    if (open !== close) {
      report.push(tag + ': ' + open + ' open / ' + close + ' close');
      failed = true;
    }
  }
  console.log(file + (report.length ? '  ⚠ ' + report.join('; ') : '  ✓ balanced'));
}
process.exit(failed ? 1 : 0);
