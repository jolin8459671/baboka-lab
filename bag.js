// =========================================================
// 卡牌背包 —— 讀 Firebase 的 bagCollection（跟圖鑑 packsCollection
// 分開的另一張表）。key = "卡號::稀有度代碼"，value = 張數。
// 這頁只讀不寫；寫入發生在 packs.js 翻牌時。組牌組功能之後再做。
// =========================================================
(function () {
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  const statEl = document.getElementById('bagstat');
  if (!grid || typeof CARDS === 'undefined') return;

  const BAG_PATH = 'bagCollection';

  // ---- rarity：data 存代碼，這裡轉中文顯示 / 收斂成基本階配色 ----
  const RARITY_TIER = {
    H: '秘', I: '頂', IP: '頂', K: '極', KP: '極',
    '頂P': '頂', '秘P': '秘', '極P': '極',
    NP: 'N', RP: 'R', SP: 'S', RA: 'R',
  };
  const RARITY_LABEL = { H: '秘', I: '頂', IP: '頂P', K: '極', KP: '極P' };
  const RARITY_SORT = ['N', 'R', 'S', '頂', '秘', '極'];
  function tierOf(r) { return RARITY_TIER[r] || r; }
  function rarityLabel(r) { return r === 'Deck' ? '起始' : (RARITY_LABEL[r] || r); }

  function schoolOf(c) { return c.school ? c.school.split('・')[0].split('／')[0] : null; }

  // ---- 資料庫轉接層（跟 online.js / packs.js 同一套）----
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
    };
  }

  // 用 "卡號::稀有度" 反查卡片資料
  const CARD_BY_KEY = {};
  CARDS.forEach((c, i) => { CARD_BY_KEY[c.code + '::' + c.rarity] = Object.assign({ _i: i }, c); });

  const db = getDB();
  let bag = {};
  let ready = false;
  let dbError = db ? null : '尚未連上資料庫，請確認 firebase-config.js 已填好金鑰。';

  // ---- 篩選下拉選單 ----
  const qInput = document.getElementById('q');
  const fType = document.getElementById('fType');
  const fSeries = document.getElementById('fSeries');
  const fSchool = document.getElementById('fTeam');
  const fRarity = document.getElementById('fRarity');
  const fSort = document.getElementById('fSort');

  [...new Set(CARDS.map(c => c.series))].forEach(s => addOpt(fSeries, s));
  [...new Set(CARDS.map(schoolOf).filter(Boolean))].forEach(s => addOpt(fSchool, s));
  [...new Set(CARDS.filter(c => c.rarity !== 'Deck').map(c => rarityLabel(c.rarity)))]
    .sort((a, b) => RARITY_SORT.indexOf(tierOf(a)) - RARITY_SORT.indexOf(tierOf(b)))
    .forEach(r => addOpt(fRarity, r));

  function addOpt(sel, val) {
    const o = document.createElement('option');
    o.value = val; o.textContent = val;
    sel.appendChild(o);
  }

  [qInput, fType, fSeries, fSchool, fRarity, fSort].forEach(el =>
    el.addEventListener(el === qInput ? 'input' : 'change', render));

  // ---- 卡面 ----
  const CARD_BACK = 'assets/cards/back.webp';
  function bagCardHTML(card, count) {
    const tier = tierOf(card.rarity) || 'N';
    const img = card.image
      ? `<img class="pcard__img" src="${card.image}" alt="${card.name}">`
      : `<img class="pcard__img pcard__img--back" src="${CARD_BACK}" alt="">`;
    const zoom = card.image ? `data-fullimg="${card.image}" data-fullname="${card.name}（${rarityLabel(card.rarity)}）"` : '';
    return `<div class="bagcard">
      <div class="pcard pcard--${tier}${card.image ? ' zoomable' : ''}" ${zoom}>
        ${img}
        <div class="pcard__rarity">${rarityLabel(card.rarity)}</div>
        <div class="pcard__mono" style="${card.image ? 'display:none;' : ''}">${card.name ? card.name[0] : '?'}</div>
        <div class="pcard__count">×${count}</div>
      </div>
      <div class="bagcard__name">${card.name}</div>
      <div class="bagcard__meta">${card.code}</div>
    </div>`;
  }

  function render() {
    if (dbError) { statEl.textContent = ''; statEl.className = 'errorbox'; statEl.textContent = dbError; grid.innerHTML = ''; return; }
    if (!ready) { statEl.textContent = '連線中…'; return; }

    // bag -> [{card, count}]
    let items = Object.keys(bag)
      .filter(k => bag[k] > 0 && CARD_BY_KEY[k])
      .map(k => ({ card: CARD_BY_KEY[k], count: bag[k] }));

    const totalCards = items.reduce((s, it) => s + it.count, 0);
    const totalKinds = items.length;

    const q = qInput.value.trim().toLowerCase();
    const t = fType.value, s = fSeries.value, sc = fSchool.value, rr = fRarity.value;

    items = items.filter(({ card }) => {
      if (t && card.type !== t) return false;
      if (s && card.series !== s) return false;
      if (sc && schoolOf(card) !== sc) return false;
      if (rr && rarityLabel(card.rarity) !== rr) return false;
      if (q) {
        const hay = (card.name + card.code + card.skill + (card.school || '')).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const sort = fSort.value;
    items.sort((a, b) => {
      if (sort === 'count') return b.count - a.count || a.card._i - b.card._i;
      if (sort === 'rarity') {
        const d = RARITY_SORT.indexOf(tierOf(b.card.rarity)) - RARITY_SORT.indexOf(tierOf(a.card.rarity));
        return d || a.card._i - b.card._i;
      }
      return a.card._i - b.card._i; // series（照 data 檔順序）
    });

    statEl.className = 'bracket statbar';
    statEl.innerHTML = `<span>背包共 <b>${totalCards}</b> 張</span><span><b>${totalKinds}</b> 種不同卡片</span>` +
      (items.length !== totalKinds ? `<span>篩選後 <b>${items.length}</b> 種</span>` : '');

    grid.innerHTML = items.map(it => bagCardHTML(it.card, it.count)).join('');
    empty.style.display = items.length ? 'none' : 'block';
  }

  // ---- 點卡面放大 ----
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
  grid.addEventListener('click', e => {
    const el = e.target.closest('.pcard[data-fullimg]');
    if (el) openLightbox(el.dataset.fullimg, el.dataset.fullname || '');
  });

  if (db) {
    db.onValue(BAG_PATH, val => { bag = val || {}; ready = true; render(); });
  } else {
    render();
  }
})();
