// 通用截圖小工具：node scripts/screenshot.js <path> [output.png] [width] [height]
// 例: node scripts/screenshot.js play-online.html out.png 1280 900
const { chromium } = require('@playwright/test');
const path = require('path');

const [, , pagePath = 'index.html', outFile = 'screenshot.png', width = '1280', height = '900'] = process.argv;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: Number(width), height: Number(height) } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('console.error: ' + msg.text());
  });

  const url = `http://localhost:4173/${pagePath}`;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.resolve(outFile), fullPage: true });

  console.log('URL:', url);
  console.log('Title:', await page.title());
  console.log('Console/page errors:', errors.length ? errors : 'none');

  await browser.close();
})();
