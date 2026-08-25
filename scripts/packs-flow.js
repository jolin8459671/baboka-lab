// 走一遍抽卡包流程：選包→撕開→翻牌→查看圖鑑，順便驗證 pcard__img CSS 修好了沒
const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const OUT = process.argv[2] || path.join(__dirname, '.out');
fs.mkdirSync(OUT, { recursive: true });
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name), fullPage: true });

function firePointerSeq(page, selector, dx, dy) {
  return page.evaluate(({ selector, dx, dy }) => {
    const el = document.querySelector(selector);
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const x0 = rect.left + rect.width / 2, y0 = rect.top + rect.height / 2;
    const opts = (x, y) => ({ bubbles: true, clientX: x, clientY: y, pointerId: 1 });
    el.dispatchEvent(new PointerEvent('pointerdown', opts(x0, y0)));
    document.dispatchEvent(new PointerEvent('pointermove', opts(x0 + dx, y0 + dy)));
    document.dispatchEvent(new PointerEvent('pointerup', opts(x0 + dx, y0 + dy)));
    return true;
  }, { selector, dx, dy });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console.error: ' + m.text()); });

  await page.goto('http://localhost:4173/packs.html', { waitUntil: 'networkidle' });
  await shot(page, '01-home.png');

  await page.click('button:has-text("去開卡包")');
  await page.waitForSelector('.packobj');
  await shot(page, '02-select.png');

  await page.click('.packobj');
  await page.waitForSelector('#dragpack', { timeout: 10000 });
  await shot(page, '03-opening.png');

  // 撕開卡包：往上滑超過70px
  await firePointerSeq(page, '#dragpack', 0, -120);
  await page.waitForTimeout(500);
  await page.waitForSelector('.packstack', { timeout: 10000 });
  await shot(page, '04-revealing-stack.png');

  // 全部翻開，看圖鑑用的 pcard__img 有沒有正確疊在卡面上
  await page.click('button:has-text("全部翻開")');
  await page.waitForTimeout(400);
  await shot(page, '05-revealed-all.png');

  await page.click('button:has-text("查看圖鑑")');
  await page.waitForTimeout(300);
  await shot(page, '06-dex.png');

  console.log('errors:', errors.length ? errors : 'none');
  await browser.close();
})();
