// 全站巡檢：逐頁載入，記錄 console error / pageerror / 破損圖片(404)
const { chromium } = require('@playwright/test');

const PAGES = [
  'index.html', 'about.html', 'rules.html', 'cards.html', 'playmat.html',
  'play.html', 'play-online.html', 'packs.html',
];

async function checkPage(browser, page) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const pg = await ctx.newPage();
  const errors = [];
  const brokenImages = [];
  pg.on('pageerror', e => errors.push('pageerror: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errors.push('console.error: ' + m.text()); });
  pg.on('response', res => {
    const req = res.request();
    if (req.resourceType() === 'image' && res.status() >= 400) {
      brokenImages.push(`${res.status()} ${req.url()}`);
    }
  });
  await pg.goto(`http://localhost:4173/${page}`, { waitUntil: 'networkidle', timeout: 30000 });
  await pg.waitForTimeout(500);
  await ctx.close();
  return { page, errors, brokenImages };
}

(async () => {
  const browser = await chromium.launch();
  for (const page of PAGES) {
    const result = await checkPage(browser, page);
    console.log(`\n### ${result.page}`);
    console.log('errors:', result.errors.length ? result.errors : 'none');
    console.log('broken images:', result.brokenImages.length ? result.brokenImages : 'none');
  }
  await browser.close();
})();
