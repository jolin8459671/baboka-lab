// 走到「對戰中」畫面，截圖檢查滿版對戰墊效果
const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const OUT = process.argv[2] || path.join(__dirname, '.out');
fs.mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:4173/play-online.html';
const shot = (page, name, opts) => page.screenshot({ path: path.join(OUT, name), ...opts });

async function main() {
  const browser = await chromium.launch();
  const ctxA = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const ctxB = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const A = await ctxA.newPage();
  const B = await ctxB.newPage();
  for (const [label, p] of [['A', A], ['B', B]]) {
    p.on('pageerror', e => console.log(`[${label} pageerror]`, String(e)));
    p.on('console', m => { if (m.type() === 'error') console.log(`[${label} console.error]`, m.text()); });
  }

  await A.goto(BASE, { waitUntil: 'networkidle' });
  await B.goto(BASE, { waitUntil: 'networkidle' });

  await A.click('button:has-text("建立新戰局")');
  await A.waitForSelector('.roomcode-display');
  const roomCode = (await A.textContent('.roomcode-display')).trim();
  await B.fill('#joinCodeInput', roomCode);
  await B.click('button:has-text("加入戰局")');
  await B.waitForSelector('.slotgrid');

  await A.click('button:has-text("準備完成")');
  await B.click('button:has-text("準備完成")');
  await A.waitForSelector('text=準備手牌', { timeout: 10000 });
  await B.waitForSelector('text=準備手牌', { timeout: 10000 });
  await A.click('button:has-text("準備完成")');
  await B.click('button:has-text("準備完成")');

  await A.waitForSelector('.matbattle', { timeout: 10000 });
  await B.waitForSelector('.matbattle', { timeout: 10000 });
  await A.waitForTimeout(500);

  await shot(A, '01-A-desktop-1280x900.png', { fullPage: true });

  // 手機尺寸也看一下
  await A.setViewportSize({ width: 390, height: 844 });
  await A.waitForTimeout(300);
  await shot(A, '02-A-mobile-390x844.png', { fullPage: true });

  // 走一步發球：先判斷誰先手（誰的 handfan 有可點的牌）
  await A.setViewportSize({ width: 1280, height: 900 });
  await A.waitForTimeout(300);
  const aCanServe = await A.locator('.handfan .handcard:not(.disabled)').count();
  const server = aCanServe ? A : B;
  const other = aCanServe ? B : A;
  await server.click('.handfan .handcard:not(.disabled)');
  await server.waitForTimeout(500);
  if (await server.locator('text=不使用技能，直接出牌').count()) await server.click('text=不使用技能，直接出牌');
  await server.waitForTimeout(600);
  await shot(server, '03-server-after-serve.png', { fullPage: true });
  await other.waitForTimeout(500);
  await shot(other, '04-other-view-after-serve.png', { fullPage: true });

  // 開一下 log 抽屜看看
  await server.click('.hudpill--log');
  await server.waitForTimeout(400);
  await shot(server, '05-log-drawer.png', { fullPage: true });

  console.log('room:', roomCode, 'DONE ->', OUT);
  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
