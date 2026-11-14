import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import desktop from 'lighthouse/core/config/desktop-config.js';
import { launch } from 'chrome-launcher';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.xml':'application/xml','.png':'image/png','.woff2':'font/woff2'};
const server = http.createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const file = path.resolve('.' + pathname + (pathname.endsWith('/') ? 'index.html' : ''));
  if (!file.startsWith(process.cwd() + '/')) return response.writeHead(403).end();
  try {
    const bytes = await fs.readFile(file);
    response.writeHead(200, {'content-type':mime[path.extname(file)] || 'text/plain', 'cache-control':'max-age=300'}).end(bytes);
  } catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = 'http://127.0.0.1:' + server.address().port + '/';
const views = [['desktop',1440,1000],['mobile',390,844]];
await fs.mkdir('screenshots', {recursive:true});
try {
  const browser = await chromium.launch();
  try {
    for (const [name,width,height] of views) {
      const page = await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      for (const file of (await fs.readdir('.')).filter(n => n.endsWith('.html') && !n.startsWith('obs-'))) {
        assert.equal((await page.goto(url + file)).status(), 200);
        assert.equal(await page.locator('h1').count(), 1);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), file + ' · ' + name);
      }
      await page.goto(url);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({path:'screenshots/' + name + '.png', fullPage:true});
      assert.deepEqual(errors, []);
      await page.close();
    }
  } finally { await browser.close(); }
  const chrome = await launch({chromePath:chromium.executablePath(),chromeFlags:['--headless','--no-sandbox']});
  try {
    const rows = [];
    for (const [name,width,height] of views) {
      const config = name === 'desktop' ? desktop : undefined;
      const {lhr} = await lighthouse(url,{port:chrome.port,logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']},config);
      rows.push([name,...Object.values(lhr.categories).map(category => Math.round(category.score*100))]);
    }
    const table = '| Tryb | Wydajność | Dostępność | Dobre praktyki | SEO |\n| --- | ---: | ---: | ---: | ---: |\n' + rows.map(row => '| ' + row.join(' | ') + ' |').join('\n') + '\n';
    await fs.writeFile('screenshots/lighthouse.md',table);
    console.log(table);
    const readme = await fs.readFile('README.md','utf8');
    await fs.writeFile('README.md',readme.replace(/<!-- AUDIT:START -->[\s\S]*?<!-- AUDIT:END -->/,'<!-- AUDIT:START -->\n'+table+'<!-- AUDIT:END -->'));
    await fs.appendFile(process.env.GITHUB_STEP_SUMMARY || 'screenshots/lighthouse-summary.md',table);
  } finally { await chrome.kill(); }
} finally { server.close(); }
