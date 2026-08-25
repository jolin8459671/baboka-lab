const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('[pageerror]', String(e)));
  page.on('console', m => console.log(`[console.${m.type()}]`, m.text()));
  page.on('requestfailed', r => console.log('[requestfailed]', r.url(), r.failure() && r.failure().errorText));
  await page.goto('http://localhost:4173/play-online.html', { waitUntil: 'networkidle', timeout: 30000 });
  await page.click('text=建立新戰局');
  await page.waitForTimeout(3000);
  console.log('BODY HTML snippet:', (await page.locator('#app').innerHTML()).slice(0, 1200));
  await browser.close();
})();
