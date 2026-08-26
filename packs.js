// =========================================================
// 抽卡包 雛型版 —— 收藏紀錄存在 Firebase Realtime Database（跟線上
// 對戰共用同一個 Firebase 專案，走獨立路徑 packsCollection，不會
// 跟 rooms/ 底下的對戰房間資料衝突）。目前只有 Jolin 自己用，換
// 裝置、清瀏覽器資料都不會遺失，方便她之後拿收藏資料繼續開發。
//
// 互動流程參考 Pokemon TCG Pocket：選一包(功能上都一樣，純儀式感)
// → 往上滑撕開卡包 → 卡片一張一張用滑動手勢翻開(或直接點一下)
// =========================================================

(function () {
  const app = document.getElementById('app');
  if (!app || typeof CARDS === 'undefined') return;

  const PACK_SIZE = 5;
  const DB_PATH = 'packsCollection';
  const PACK_CHOICES = 3; // 選包畫面顯示幾個包給你挑（功能完全一樣，純選擇的儀式感）

  // 只有非「起始套牌」稀有度的卡才會出現在卡包裡（跟正式TCG一樣，
  // 起始套牌的牌不會混進補充包）。之後補完 N/R/S/頂/秘/極 的補充包
  // 卡越多，這個池子會自動變大，不用改這支程式。
  const BOOSTER_POOL = CARDS.filter(c => c.rarity !== 'Deck');
  const RARITY_WEIGHT = { N: 60, R: 27, S: 10, '頂': 2, '秘': 0.7, '極': 0.3 };
  const RARITY_ORDER = ['N', 'R', 'S', '頂', '秘', '極'];

  // ---------------------------------------------------------
  // 資料庫轉接層：跟 online.js 同一套寫法（有 window.__mockDB 就用
  // 它方便測試，否則用 Firebase compat SDK）
  // ---------------------------------------------------------
  function getDB() {
    if (window.__mockDB) return window.__mockDB;
    if (typeof firebase === 'undefined' || !firebase.apps || !firebase.apps.length) return null;
    const dbRef = firebase.database();
    return {
      onValue(path, cb) {
        const ref = dbRef.ref(path);
        const handler = snap => cb(snap.val());
        ref.on('value', handler);
        return () => ref.off('value', handler);
      },
      update(path, obj) { return dbRef.ref(path).update(obj); },
    };
  }

  const db = getDB();
  let collection = {}; // { cardCode: count }，由 Firebase onValue 同步
  let dbReady = false;
  let dbError = db ? null : '尚未連上資料庫，請確認 firebase-config.js 已填好金鑰。';
  let screen = 'home'; // home / select / opening / revealing / dex
  let currentPack = []; // 本次開的5張
  let revealedCount = 0;

  if (db) {
    db.onValue(DB_PATH, val => {
      collection = val || {};
      dbReady = true;
      render();
    });
  }

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

  function goSelect() {
    if (BOOSTER_POOL.length === 0) return;
    screen = 'select';
    render();
  }

  function goOpening() {
    screen = 'opening';
    render();
  }

  function openPack() {
    currentPack = [];
    for (let i = 0; i < PACK_SIZE; i++) {
      const c = drawOneCard();
      if (c) currentPack.push(c);
    }
    revealedCount = 0;
    screen = 'revealing';
    render();
  }

  function revealOne(idx) {
    if (idx !== revealedCount) return; // 只能按順序翻，不能跳著翻
    const card = currentPack[idx];
    collection[card.code] = (collection[card.code] || 0) + 1;
    if (db) db.update(DB_PATH, { [card.code]: collection[card.code] });
    revealedCount++;
    render();
  }

  function revealAll() {
    const changed = {};
    currentPack.forEach((card, i) => {
      if (i >= revealedCount) {
        collection[card.code] = (collection[card.code] || 0) + 1;
        changed[card.code] = collection[card.code];
      }
    });
    if (db) db.update(DB_PATH, changed);
    revealedCount = currentPack.length;
    render();
  }

  function isRareRarity(r) { return r === 'S' || r === '頂' || r === '秘' || r === '極'; }

  const CARD_BACK = 'assets/cards/back.webp';

  function pcardHTML(card, opts) {
    opts = opts || {};
    if (opts.faceDown) {
      return `<div class="pcard faceDown"><img class="pcard__backimg" src="${CARD_BACK}" alt="卡背"></div>`;
    }
    const rarityClass = card.rarity || 'N';
    const glow = opts.revealed && isRareRarity(card.rarity) ? 'rare-glow' : '';
    const countBadge = opts.count != null ? `<div class="pcard__count">×${opts.count}</div>` : '';
    const showImg = card.image && !opts.locked;
    const imgHTML = showImg
      ? `<img class="pcard__img" src="${card.image}" alt="${card.name || ''}">`
      : (opts.locked ? `<img class="pcard__img pcard__img--back" src="${CARD_BACK}" alt="未取得">` : '');
    const zoomAttr = showImg ? `data-fullimg="${card.image}" data-fullname="${card.name || ''}"` : '';
    return `<div class="pcard pcard--${rarityClass} ${opts.revealed ? 'revealed' : ''} ${glow} ${opts.locked ? 'locked' : ''} ${showImg ? 'zoomable' : ''}" ${zoomAttr}>
      ${imgHTML}
      <div class="pcard__rarity">${opts.locked ? '？' : (card.rarity === 'Deck' ? '起始' : card.rarity)}</div>
      <div class="pcard__mono" style="${(showImg || opts.locked) ? 'display:none;' : ''}">${card.name ? card.name[0] : ''}</div>
      ${opts.showName ? `<div class="pcard__name">${opts.locked ? '未取得' : card.name}</div>` : ''}
      ${countBadge}
    </div>`;
  }

  // ---------------------------------------------------------
  // 畫面
  // ---------------------------------------------------------
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
        <button class="mini-btn mini-btn--primary" ${BOOSTER_POOL.length === 0 ? 'disabled' : ''} onclick="handleGoSelect()">去開卡包</button>
        <button class="mini-btn" onclick="handleShowDex()">查看圖鑑</button>
      </div>
      ${BOOSTER_POOL.length === 0 ? '<p style="color:var(--score);font-size:12px;margin-top:10px;">目前卡池是空的（所有卡都是起始套牌稀有度），先去 data/cards.js 補幾張非 Deck 稀有度的卡才能開包。</p>' : ''}
    </div>`;
  }

  function selectHTML() {
    return `
    <div class="bracket packresult">
      <h2>選一包</h2>
      <p style="color:var(--chalk-dim);font-size:13px;margin:4px 0 4px;">三包內容機率都一樣，純粹選個手感</p>
      <div class="packcarousel">
        ${Array.from({ length: PACK_CHOICES }).map(() => `
          <div class="packobj" onclick="handleGoOpening()">
            <div class="packobj__face">
              <div class="packobj__logo">Vobaca</div>
              <div class="packobj__spark"></div>
            </div>
          </div>`).join('')}
      </div>
      <div class="btnrow-wrap" style="justify-content:center;"><button class="mini-btn" onclick="handleGoHome()">返回</button></div>
    </div>`;
  }

  function openingHTML() {
    return `
    <div class="bracket packresult">
      <h2>往上滑撕開卡包</h2>
      <p style="color:var(--chalk-dim);font-size:13px;margin:4px 0 4px;">（滑鼠：按住往上拖曳；手機：手指往上滑；也可以直接點一下）</p>
      <div class="openzone" id="openzone">
        <div class="packobj packobj--big" id="dragpack" data-role="tearpack">
          <div class="packobj__face">
            <div class="packobj__logo">Vobaca</div>
            <div class="packobj__spark"></div>
            <div class="packobj__hint">↑</div>
          </div>
        </div>
      </div>
    </div>`;
  }

  function stackHTML() {
    const remaining = currentPack.length - revealedCount;
    const items = [];
    for (let depth = Math.min(remaining, 4) - 1; depth >= 0; depth--) {
      const idx = revealedCount + depth;
      const isActive = depth === 0;
      const style = `transform:translate(${depth * 3}px, ${depth * 5}px) scale(${1 - depth * 0.025}) rotate(${depth * 1.2}deg);z-index:${10 - depth};`;
      items.push(`<div class="stackcard ${isActive ? 'active' : ''}" data-idx="${idx}" style="${style}">${pcardHTML(currentPack[idx], { faceDown: true })}</div>`);
    }
    return items.join('');
  }

  function revealingHTML() {
    const allDone = revealedCount >= currentPack.length;
    if (allDone) {
      return `
      <div class="bracket packresult">
        <h2>開包結果</h2>
        <div class="packgrid">${currentPack.map(c => pcardHTML(c, { revealed: true, showName: true })).join('')}</div>
        <div class="btnrow-wrap" style="justify-content:center;">
          <button class="mini-btn mini-btn--primary" onclick="handleGoSelect()">再開一包</button>
          <button class="mini-btn" onclick="handleShowDex()">查看圖鑑</button>
          <button class="mini-btn" onclick="handleGoHome()">回首頁</button>
        </div>
      </div>`;
    }
    return `
    <div class="bracket packresult">
      <h2>滑開每張卡（左右滑，或直接點一下）</h2>
      <div class="packstack" id="packstack">${stackHTML()}</div>
      <div class="collected-row">${currentPack.slice(0, revealedCount).map(c => pcardHTML(c, { revealed: true })).join('')}</div>
      <div class="btnrow-wrap" style="justify-content:center;">
        <button class="mini-btn" onclick="handleRevealAll()">全部翻開</button>
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
      <h3 style="font-family:var(--display);font-size:18px;margin:0 0 12px;color:var(--chalk-dim);">起始套牌</h3>
      <div class="dexgrid">
        ${deckCards.map(c => `<div class="dexcard-wrap">${pcardHTML(c, { showName: true })}</div>`).join('')}
      </div>
    </div>`;
  }

  function render() {
    if (dbError) { app.innerHTML = `<div class="errorbox">${dbError}</div>`; return; }
    if (!dbReady) { app.innerHTML = `<div class="bracket setup-card" style="padding:26px;">連線中…</div>`; return; }
    if (screen === 'home') app.innerHTML = homeHTML();
    else if (screen === 'select') app.innerHTML = selectHTML();
    else if (screen === 'opening') app.innerHTML = openingHTML();
    else if (screen === 'revealing') app.innerHTML = revealingHTML();
    else if (screen === 'dex') app.innerHTML = dexHTML();
  }

  // ---------------------------------------------------------
  // 手勢處理（Pointer Events，滑鼠/觸控通用），用事件代理掛在
  // #app 上一次就好，畫面重繪不會失效
  // ---------------------------------------------------------
  let drag = null; // { el, kind:'tear'|'card', startX, startY, dx, dy, idx }

  function onPointerDown(e) {
    const tearEl = e.target.closest('[data-role="tearpack"]');
    const cardEl = e.target.closest('.stackcard.active');
    if (tearEl) {
      drag = { el: tearEl, kind: 'tear', startX: e.clientX, startY: e.clientY, dx: 0, dy: 0 };
    } else if (cardEl) {
      drag = { el: cardEl, kind: 'card', startX: e.clientX, startY: e.clientY, dx: 0, dy: 0, idx: parseInt(cardEl.dataset.idx, 10) };
    } else {
      return;
    }
    drag.el.style.transition = 'none';
    try { drag.el.setPointerCapture(e.pointerId); } catch (err) { /* 忽略不支援的環境 */ }
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }

  function onPointerMove(e) {
    if (!drag) return;
    drag.dx = e.clientX - drag.startX;
    drag.dy = e.clientY - drag.startY;
    if (drag.kind === 'tear') {
      const lift = Math.min(0, drag.dy); // 只在意往上拖
      drag.el.style.transform = `translateY(${lift}px) scale(${1 + Math.min(0, lift) * -0.0006})`;
      drag.el.style.opacity = String(Math.max(0.3, 1 + lift / 220));
    } else {
      const rot = drag.dx / 14;
      drag.el.style.transform = `translate(${drag.dx}px, ${drag.dy}px) rotate(${rot}deg)`;
    }
  }

  function endDrag() {
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    drag = null;
  }

  function onPointerUp() {
    if (!drag) return;
    const { el, kind, dx, dy, idx } = drag;

    if (kind === 'tear') {
      const tornOpen = dy < -70 || (Math.abs(dx) < 6 && Math.abs(dy) < 6); // 往上拖夠遠，或單純點一下
      if (tornOpen) {
        el.style.transition = 'transform .3s ease-out, opacity .3s ease-out';
        el.style.transform = 'translateY(-260px) scale(.7)';
        el.style.opacity = '0';
        endDrag();
        setTimeout(() => openPack(), 260);
        return;
      }
      el.style.transition = 'transform .25s ease';
      el.style.transform = 'translateY(0) scale(1)';
      el.style.opacity = '1';
      endDrag();
      return;
    }

    // kind === 'card'
    const threshold = 70;
    const isTap = Math.abs(dx) < 6 && Math.abs(dy) < 6;
    if (Math.abs(dx) > threshold || isTap) {
      const dir = isTap ? 1 : (dx > 0 ? 1 : -1);
      el.style.transition = 'transform .35s ease-out, opacity .35s ease-out';
      el.style.transform = `translate(${dir * 500}px, ${dy}px) rotate(${dir * 35}deg)`;
      el.style.opacity = '0';
      endDrag();
      setTimeout(() => revealOne(idx), 300);
      return;
    }
    el.style.transition = 'transform .22s ease';
    el.style.transform = 'translate(0,0) rotate(0)';
    endDrag();
  }

  app.addEventListener('pointerdown', onPointerDown);

  // ---------------------------------------------------------
  // 點卡面放大看圖：只有真的顯示圖片的卡（不是鎖住的？卡、也不是
  // 正在滑動翻牌的那張背面卡，pcardHTML 沒給那兩種 data-fullimg）
  // 才會被這個代理事件抓到，不會跟撕包/翻牌的拖曳手勢衝突。
  // ---------------------------------------------------------
  function openLightbox(src, name) {
    const box = document.createElement('div');
    box.className = 'imglightbox';
    box.innerHTML = `<img src="${src}" alt="${name}"><div class="imglightbox__name">${name}</div><button class="imglightbox__close" aria-label="關閉">✕</button>`;
    box.addEventListener('click', () => box.remove());
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') { box.remove(); document.removeEventListener('keydown', onKey); }
    });
    document.body.appendChild(box);
  }

  app.addEventListener('click', (e) => {
    const el = e.target.closest('.pcard[data-fullimg]');
    if (!el) return;
    openLightbox(el.dataset.fullimg, el.dataset.fullname || '');
  });

  window.handleGoSelect = function () { goSelect(); };
  window.handleGoOpening = function () { goOpening(); };
  window.handleRevealAll = function () { revealAll(); };
  window.handleShowDex = function () { screen = 'dex'; render(); };
  window.handleGoHome = function () { screen = 'home'; render(); };

  render();
})();
