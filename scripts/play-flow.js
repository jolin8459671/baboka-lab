// 走一遍「線上對戰」完整流程：兩個 browser context 分別當玩家一/玩家二，
// 透過真的 Firebase 即時同步，每個關鍵畫面都截圖存到 scripts/.out/
const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const OUT = process.argv[2] || path.join(__dirname, '.out');
fs.mkdirSync(OUT, { recursive: true });

const BASE = 'http://localhost:4173/play-online.html';

function shot(page, name) {
  return page.screenshot({ path: path.join(OUT, name), fullPage: true });
}

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

  // --- 建房 / 加入房 ---
  await A.click('button:has-text("建立新戰局")');
  await A.waitForSelector('.roomcode-display');
  const roomCode = (await A.textContent('.roomcode-display')).trim();
  console.log('Room code:', roomCode);
  await shot(A, '01-A-lobby-created.png');

  await B.fill('#joinCodeInput', roomCode);
  await B.click('button:has-text("加入戰局")');
  await B.waitForSelector('.slotgrid');
  await shot(B, '02-B-lobby-joined.png');
  await shot(A, '03-A-lobby-bothpresent.png');

  // --- 準備 ready ---
  await A.click('button:has-text("準備完成")');
  await B.click('button:has-text("準備完成")');

  // --- presetup: 等自動轉場 ---
  await A.waitForSelector('text=準備手牌', { timeout: 10000 });
  await B.waitForSelector('text=準備手牌', { timeout: 10000 });
  await shot(A, '04-A-presetup.png');
  await shot(B, '05-B-presetup.png');

  await A.click('button:has-text("準備完成")');
  await B.click('button:has-text("準備完成")');

  // --- playing: 等自動擲硬幣開局 ---
  await A.waitForSelector('.tablescene', { timeout: 10000 });
  await B.waitForSelector('.tablescene', { timeout: 10000 });
  await shot(A, '06-A-playing-start.png');
  await shot(B, '07-B-playing-start.png');

  // 判斷誰先發球
  const aActing = (await A.locator('.matchbar__phase small').textContent()).includes('玩家一');
  const server = aActing ? A : B;
  const receiver = aActing ? B : A;
  const serverLabel = aActing ? 'A(玩家一)' : 'B(玩家二)';
  console.log('先發球:', serverLabel);

  // --- 發球：點手牌第一張有發球值的角色卡 ---
  await server.click('.handfan .handcard:not(.disabled)');
  await server.waitForTimeout(600); // 等技能確認面板判斷 or 直接送出
  // 若跳出技能確認面板，選「不使用技能，直接出牌」
  const skillPanelServer = await server.locator('text=不使用技能，直接出牌').count();
  if (skillPanelServer) await server.click('text=不使用技能，直接出牌');

  await receiver.waitForSelector('text=應對階段', { timeout: 10000 });
  await shot(server, '08-server-after-serve.png');
  await shot(receiver, '09-receiver-respond-phase.png');

  // --- 接球方選擇「接球」 ---
  await receiver.click('button:has-text("接球（先抽1張）")');
  await receiver.waitForSelector('text=接球階段', { timeout: 10000 });
  await shot(receiver, '10-receiver-receive-phase.png');

  await receiver.click('.handfan .handcard:not(.disabled)');
  await receiver.waitForTimeout(600);
  const skillPanelReceiver = await receiver.locator('text=不使用技能，直接出牌').count();
  if (skillPanelReceiver) await receiver.click('text=不使用技能，直接出牌');

  await server.waitForTimeout(1500);
  await shot(server, '11-server-view-after-receive.png');
  await shot(receiver, '12-receiver-view-after-receive.png');

  // 看現在輪到誰、走到哪個 phase，兩邊都截一次目前狀態方便妳比對
  await A.waitForTimeout(500);
  await shot(A, '13-A-current-state.png');
  await shot(B, '14-B-current-state.png');

  console.log('DONE. Screenshots in', OUT);
  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
