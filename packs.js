// =========================================================
// 抽卡包 雛型版 —— 純前端，收藏紀錄存在 localStorage（這是真的
// 部署網站，不是 Claude 的 artifact 沙盒，所以這裡用 localStorage
// 沒問題，跟 online.js 那邊「不能用瀏覽器儲存」的限制無關）
// =========================================================

(function () {
  const app = document.getElementById('app');
  if (!app || typeof CARDS === 'undefined') return;

  const PACK_SIZE = 5;
  const STORAGE_KEY = 'baboka_collection_v1';

  // 只有非「起始套牌」稀有度的卡才會出現在卡包裡（跟正式TCG一樣，
  // 起始套牌的牌不會混進補充包）。之後補完 N/R/S/頂/秘/極 的補充包
  // 卡越多，這個池子會自動變大，不用改這支程式。
  const BOOSTER_POOL = CARDS.filter(c => c.rarity !== 'Deck');
  const RARITY_WEIGHT = { N: 60, R: 27, S: 10, '頂': 2, '秘': 0.7, '極': 0.3 };
  const RARITY_ORDER = ['N', 'R', 'S', '頂', '秘', '極'];

  function loadCollection() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }
  function saveCollection(col) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(col)); } catch (e) { /* 存不進去就算了，不影響本次開包結果顯示 */ }
  }

  let collection = loadCollection(); // { cardCode: count }
  let screen = 'home'; // home / revealing / dex
  let currentPack = []; // 本次開的5張
  let revealedCount = 0;

  function weightedRandomRarity() {
    const present = RARITY_ORDER.filter(r => BOOSTER_POOL.some(c => c.rarity === r));
    if (present.length === 0) return null;
    const total = present.reduce((s, r) => s + (RARITY_WEIGHT[r] || 1), 0);
    let roll = Math.random() * total;
    for (const r of present) {
      roll -= (RARITY_WEIGHT[r] || 1);
      if (roll <= 0) return r;
    }
    return present[present.length - 1];
  }

  function drawOneCard() {
    const rarity = weightedRandomRarity();
    if (!rarity) return null;
    const pool = BOOSTER_POOL.filter(c => c.rarity === rarity);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function openPack() {
    if (BOOSTER_POOL.length === 0) return;
    currentPack = [];
    for (let i = 0; i < PACK_SIZE; i++) {
      const c = drawOneCard();
      if (c) currentPack.push(c);
    }
    revealedCount = 0;
    screen = 'revealing';
    render();
  }

  function revealNext(idx) {
    if (idx !== revealedCount) return; // 只能按順序翻，不能跳著翻
    const card = currentPack[idx];
    collection[card.code] = (collection[card.code] || 0) + 1;
    saveCollection(collection);
    revealedCount++;
    render();
  }

  function revealAll() {
    currentPack.forEach((card, i) => {
      if (i >= revealedCount) {
        collection[card.code] = (collection[card.code] || 0) + 1;
      }
    });
    saveCollection(collection);
    revealedCount = currentPack.length;
    render();
  }

  function isRareRarity(r) { return r === 'S' || r === '頂' || r === '秘' || r === '極'; }

  function pcardHTML(card, opts) {
    opts = opts || {};
    if (opts.faceDown) {
      return `<div class="pcard faceDown" onclick="${opts.onclick || ''}"><div class="pcard__back">?</div></div>`;
    }
    const rarityClass = card.rarity || 'N';
    const glow = opts.revealed && isRareRarity(card.rarity) ? 'rare-glow' : '';
    const countBadge = opts.count != null ? `<div class="pcard__count">×${opts.count}</div>` : '';
    return `<div class="pcard pcard--${rarityClass} ${opts.revealed ? 'revealed' : ''} ${glow} ${opts.locked ? 'locked' : ''}">
      <div class="pcard__rarity">${opts.locked ? '？' : (card.rarity === 'Deck' ? '起始' : card.rarity)}</div>
      <div class="pcard__mono">${opts.locked ? '？' : card.name[0]}</div>
      ${opts.showName ? `<div class="pcard__name">${opts.locked ? '未取得' : card.name}</div>` : ''}
      ${countBadge}
    </div>`;
  }

  function homeHTML() {
    const totalOwned = Object.keys(collection).filter(code => collection[code] > 0).length;
    return `
    <div class="bracket statbar">
      <span>卡包池目前 <b>${BOOSTER_POOL.length}</b> 張可抽</span>
      <span>已收藏 <b>${totalOwned}</b> / ${BOOSTER_POOL.length} 種</span>
    </div>
    <div class="bracket packresult">
      <h2>バボカ補充包</h2>
      <p style="color:var(--chalk-dim);font-size:13px;margin:6px 0 0;">每包 ${PACK_SIZE} 張，稀有度機率：${RARITY_ORDER.filter(r => BOOSTER_POOL.some(c => c.rarity === r)).map(r => `${r} ${RARITY_WEIGHT[r]}%`).join('　')}（會依實際卡池自動重新正規化）</p>
      <div class="btnrow-wrap" style="justify-content:center;">
        <button class="mini-btn mini-btn--primary" ${BOOSTER_POOL.length === 0 ? 'disabled' : ''} onclick="handleOpenPack()">開一包</button>
        <button class="mini-btn" onclick="handleShowDex()">查看圖鑑</button>
      </div>
      ${BOOSTER_POOL.length === 0 ? '<p style="color:var(--score);font-size:12px;margin-top:10px;">目前卡池是空的（所有卡都是起始套牌稀有度），先去 data/cards.js 補幾張非 Deck 稀有度的卡才能開包。</p>' : ''}
    </div>`;
  }

  function revealingHTML() {
    const allDone = revealedCount >= currentPack.length;
    return `
    <div class="bracket packresult">
      <h2>${allDone ? '開包結果' : '點卡片翻開'}</h2>
      <div class="packgrid">
        ${currentPack.map((card, i) => {
          if (i < revealedCount) return pcardHTML(card, { revealed: true, showName: true });
          return pcardHTML(card, { faceDown: true, onclick: `handleRevealNext(${i})` });
        }).join('')}
      </div>
      <div class="btnrow-wrap" style="justify-content:center;">
        ${!allDone ? `<button class="mini-btn" onclick="handleRevealAll()">全部翻開</button>` : ''}
        ${allDone ? `<button class="mini-btn mini-btn--primary" onclick="handleOpenPack()">再開一包</button>
                      <button class="mini-btn" onclick="handleShowDex()">查看圖鑑</button>
                      <button class="mini-btn" onclick="handleGoHome()">回首頁</button>` : ''}
      </div>
    </div>`;
  }

  function dexHTML() {
    const deckCards = CARDS.filter(c => c.rarity === 'Deck');
    const boosterCards = BOOSTER_POOL;
    return `
    <div class="bracket packresult" style="text-align:left;">
      <h2 style="text-align:center;">圖鑑</h2>
      <div class="btnrow-wrap" style="justify-content:center;"><button class="mini-btn" onclick="handleGoHome()">回開包頁</button></div>
    </div>
    <div class="bracket setup-card" style="padding:22px;">
      <h3 style="font-family:var(--display);font-size:18px;margin:0 0 12px;color:var(--whistle);">卡包收藏（${boosterCards.filter(c => collection[c.code] > 0).length}/${boosterCards.length}）</h3>
      <div class="dexgrid">
        ${boosterCards.map(c => {
          const owned = collection[c.code] || 0;
          return `<div class="dexcard-wrap">${pcardHTML(c, { locked: owned === 0, showName: true, count: owned > 0 ? owned : null })}</div>`;
        }).join('')}
      </div>
    </div>
    <div class="bracket setup-card" style="padding:22px;">
      <h3 style="font-family:var(--display);font-size:18px;margin:0 0 12px;color:var(--chalk-dim);">起始套牌（一定有，不用抽）</h3>
      <div class="dexgrid">
        ${deckCards.map(c => `<div class="dexcard-wrap">${pcardHTML(c, { showName: true })}</div>`).join('')}
      </div>
    </div>`;
  }

  function render() {
    if (screen === 'home') app.innerHTML = homeHTML();
    else if (screen === 'revealing') app.innerHTML = revealingHTML();
    else if (screen === 'dex') app.innerHTML = dexHTML();
  }

  window.handleOpenPack = function () { openPack(); };
  window.handleRevealNext = function (i) { revealNext(i); };
  window.handleRevealAll = function () { revealAll(); };
  window.handleShowDex = function () { screen = 'dex'; render(); };
  window.handleGoHome = function () { screen = 'home'; render(); };

  render();
})();
