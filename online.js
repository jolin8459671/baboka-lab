// =========================================================
// バボカ対戦 線上版 —— 兩人各自裝置連線
// 私有資料（牌組/手牌/棄牌/SET區的實際卡片內容）只留在
// 自己瀏覽器記憶體裡，永遠不寫進資料庫；寫進資料庫、對方
// 看得到的只有「數量」跟「已經打出來、正在場上的牌」。
// 這代表：對戰途中重新整理分頁 = 手牌消失，請不要中途重整。
// =========================================================

(function () {
  const app = document.getElementById('app');
  if (!app || typeof CARDS === 'undefined') return;

  const STAT_LABEL = { serve: '發球', receive: '接球', block: '阻擋', toss: '舉球', attack: '攻擊' };
  const COPIES_PER_CARD = 3; // 備援值：卡片資料裡沒填 copies 欄位時才會用到（目前只有音駒還沒確認正式張數）
  const START_HAND = 6;
  const SET_ZONE_SIZE = 2;
  const SETS_TO_WIN = 3;
  const TURN_SECONDS = 15;

const POOLS = {
    karasuno: { label: '烏野 (D01 起始)', cards: CARDS.filter(c => c.series.startsWith('D01') && c.playable !== false) },
    nekoma:   { label: '音駒 (D02 起始)', cards: CARDS.filter(c => c.series.startsWith('D02') && c.playable !== false) },
};

  // ---------------------------------------------------------
  // 資料庫轉接層：有 window.__mockDB 就用它（測試用），
  // 否則用 Firebase compat SDK（firebase-config.js 已 initializeApp）
  // ---------------------------------------------------------
  function getDB() {
    if (window.__mockDB) return window.__mockDB;
    if (typeof firebase === 'undefined' || !firebase.apps || !firebase.apps.length) return null;
    const db = firebase.database();
    return {
      onValue(path, cb) {
        const ref = db.ref(path);
        const handler = snap => cb(snap.val());
        ref.on('value', handler);
        return () => ref.off('value', handler);
      },
      set(path, val) { return db.ref(path).set(val); },
      update(path, obj) { return db.ref(path).update(obj); },
      push(path, val) { return db.ref(path).push(val).then(ref => ({ key: ref.key })); },
      remove(path) { return db.ref(path).remove(); },
    };
  }

  let uidSeed = 1;
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function buildDeck(poolKey) {
    const base = POOLS[poolKey].cards;
    let pile = [];
    base.forEach(c => {
      const n = c.copies != null ? c.copies : COPIES_PER_CARD;
      for (let i = 0; i < n; i++) pile.push(Object.assign({}, c, { uid: 'c' + (uidSeed++), pile: [] }));
    });
    return shuffle(pile);
  }
  function draw(who, n) {
    for (let i = 0; i < n; i++) {
      if (who.deck.length === 0) break;
      who.hand.push(who.deck.shift());
    }
  }
  function genRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let s = '';
    for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  }
  function other(key) { return key === 'A' ? 'B' : 'A'; }

  // ---------------------------------------------------------
  // 狀態
  // ---------------------------------------------------------
  const me = { key: null, deckKey: null };           // 我是 A 還是 B
  let roomCode = null;
  let room = null;         // 從 DB 同步下來的共用房間狀態（不含私人手牌內容）
  let logEntries = [];      // 從 DB 同步下來的公開紀錄
  let screen = 'landing';   // landing / lobby / presetup / playing / interval / matchEnd / error
  let errorMsg = null;
  let unsubRoom = null, unsubLog = null;

  const local = {           // 只存在自己瀏覽器，永不上傳的私有資料
    deck: [], hand: [], setZone: [], discard: [],
    mulliganUsed: false, setupDone: false,
    blockPicks: [],
    zonePile: {},        // 每區「目前疊了幾張可當資源花」的計數，一局(SET)開始時歸零
    pendingPlay: null,    // { uid, rule } —— 選到有自動化技能的牌時，先跳確認面板
  };
  let processedIntervalFor = null; // 避免同一局間休息重複處理
  let pileResetForSet = null;      // 避免同一局內重複把資源計數歸零
  let pendingFlip = null;          // 手牌飛到場上的動畫來源座標
  let logOpen = false;             // 滿版對戰畫面的紀錄側欄開關

  let timerInterval = null;
  let timerDeadline = null;

  const db = getDB();

  // ---------------------------------------------------------
  // 技能自動化規則表 —— 只涵蓋烏野／音駒起始套牌裡「效果單純可判定」的技能：
  // 需要花「場上資源(疊在該區下方的牌)」或「丟1張手牌」當成本、
  // 效果是固定加值／抽卡的。其餘技能(結算複雜、跨區、影響下回合等)
  // 還是用手動加減值輸入框處理，牌片上照樣看得到完整技能文字。
  // ---------------------------------------------------------
  const SKILL_RULES = {
    '日向翔陽': { zone: 'attack', cost: { type: 'pile', amount: 2 }, effect: { statBonus: 2 } },
    '影山飛雄': { zone: 'toss', cost: { type: 'pile', amount: 2 }, effect: { statBonus: 2 } },
    '西谷夕':   { zone: 'receive', cost: { type: 'pile', amount: 3 }, effect: { statBonus: 2, draw: 1 } },
    '緣下力':   { zone: 'receive', cost: { type: 'hand', amount: 1 }, effect: { statBonus: 3 } },
    '孤爪研磨': { zone: 'toss', cost: { type: 'pile', amount: 2 }, effect: { statBonus: 1 } },
    '夜久衛輔': { zone: 'receive', cost: { type: 'hand', amount: 1 }, effect: { statBonus: 2 } },
    '芝山優生': { zone: 'receive', cost: { type: 'pile', amount: 2 }, effect: { statBonus: 0, draw: 1 } },
  };
  const PHASE_TO_ZONE = { SERVE_CHOOSE: 'serve', RECEIVE_PLAY: 'receive', TOSS_PLAY: 'toss', ATTACK_PLAY: 'attack' };

  // ---------------------------------------------------------
  // 建立 / 加入房間
  // ---------------------------------------------------------
  function createRoom() {
    if (!db) { errorMsg = '尚未連上資料庫，請確認 firebase-config.js 已填好金鑰。'; render(); return; }
    roomCode = genRoomCode();
    me.key = 'A';
    const initRoom = {
      createdAt: Date.now(),
      stage: 'lobby',
      slots: {
        A: { present: true, ready: false, deckKey: 'karasuno', setupDone: false },
        B: { present: false, ready: false, deckKey: 'nekoma', setupDone: false },
      },
      serverKey: null, actingKey: null, phase: null, setNumber: 1,
      ball: null, excludeName: { toss: null, attack: null },
      turnDeadline: null,
      public: { A: emptyPublic(), B: emptyPublic() },
      lastSetLoser: null, matchWinner: null,
    };
    db.set(`rooms/${roomCode}`, initRoom).then(() => subscribe());
  }

  function joinRoom(code) {
    if (!db) { errorMsg = '尚未連上資料庫，請確認 firebase-config.js 已填好金鑰。'; render(); return; }
    code = code.trim().toUpperCase();
    if (!code) return;
    roomCode = code;
    let unsub = null;
    let handled = false;
    unsub = db.onValue(`rooms/${roomCode}`, snap => {
      if (handled) return;
      handled = true;
      if (unsub) unsub();
      if (!snap) { errorMsg = `找不到房號 ${code}，確認代碼有沒有打對。`; render(); return; }
      if (snap.slots && snap.slots.B && snap.slots.B.present) {
        errorMsg = `房間 ${code} 已經滿兩人了。`; render(); return;
      }
      me.key = 'B';
      db.update(`rooms/${roomCode}/slots/B`, { present: true, ready: false, setupDone: false }).then(() => subscribe());
    });
  }

  function emptyPublic() {
    return {
      deckCount: 0, handCount: 0, setZoneCount: 0, discardCount: 0, setsWon: 0,
      zones: { serve: null, receive: null, block: null, toss: null, attack: null },
    };
  }

  function subscribe() {
    screen = 'lobby';
    unsubRoom = db.onValue(`rooms/${roomCode}`, val => {
      room = val;
      if (!room) return;
      reactToRoom();
      render();
    });
    unsubLog = db.onValue(`rooms/${roomCode}/log`, val => {
      logEntries = val ? Object.values(val).sort((a, b) => a.ts - b.ts) : [];
      render();
    });
  }

  function writeLog(text, cls) {
    db.push(`rooms/${roomCode}/log`, { text, cls: cls || '', ts: Date.now() });
  }

  // ---------------------------------------------------------
  // 大廳：選牌組、準備
  // ---------------------------------------------------------
  function setMyDeck(val) {
    db.update(`rooms/${roomCode}/slots/${me.key}`, { deckKey: val });
  }
  function toggleReady() {
    const mySlot = room.slots[me.key];
    db.update(`rooms/${roomCode}/slots/${me.key}`, { ready: !mySlot.ready });
  }

  function resetLocalForNewMatch() {
    local.deck = []; local.hand = []; local.setZone = []; local.discard = [];
    local.mulliganUsed = false; local.setupDone = false; local.blockPicks = [];
    local.zonePile = {}; local.pendingPlay = null;
    processedIntervalFor = null; pileResetForSet = null;
  }

  function reactToRoom() {
    if (!room) return;

    // 剛回到大廳（重新開一場）：清掉上一場殘留的本地私有資料
    if (room.stage === 'lobby' && (local.hand.length > 0 || local.deck.length > 0)) {
      resetLocalForNewMatch();
    }

    // 每一局(SET)開始時，場上資源計數歸零(只做一次)
    if (room.stage === 'playing' && pileResetForSet !== room.setNumber) {
      pileResetForSet = room.setNumber;
      local.zonePile = {};
    }

    // lobby -> presetup：雙方都 present + ready，由 A 負責觸發（單一寫入者）
    if (room.stage === 'lobby' && me.key === 'A') {
      const a = room.slots.A, b = room.slots.B;
      if (a && b && a.present && b.present && a.ready && b.ready) {
        db.update(`rooms/${roomCode}`, { stage: 'presetup' });
      }
    }

    // 進入 presetup：各自本地建立牌組、抽6張（只做一次）
    if (room.stage === 'presetup' && local.deck.length === 0 && local.hand.length === 0 && !local.setupDone) {
      me.deckKey = room.slots[me.key].deckKey;
      local.deck = buildDeck(me.deckKey);
      local.hand = [];
      draw(local, START_HAND);
      publishCounts();
    }

    // presetup -> playing：雙方 setupDone，由 A 負責擲硬幣+開局
    if (room.stage === 'presetup' && me.key === 'A') {
      const a = room.slots.A, b = room.slots.B;
      if (a.setupDone && b.setupDone) {
        const serverKey = Math.random() < 0.5 ? 'A' : 'B';
        db.update(`rooms/${roomCode}`, {
          stage: 'playing', serverKey, actingKey: serverKey, setNumber: 1,
          phase: 'SERVE_CHOOSE', ball: null, excludeName: { toss: null, attack: null },
          turnDeadline: Date.now() + TURN_SECONDS * 1000,
        });
        writeLog(`— 擲硬幣結果：${serverKey === 'A' ? slotLabel('A') : slotLabel('B')} 先發球，第 1 局開始 —`, 'win');
      }
    }

    // interval：各自補牌（只處理一次）
    if (room.stage === 'interval' && processedIntervalFor !== room.setNumber) {
      processedIntervalFor = room.setNumber;
      handleMyInterval();
    }

    // interval -> playing：雙方 setupDone(借用同一個旗標表示"補牌完成")，由 A 負責
    if (room.stage === 'interval' && me.key === 'A') {
      const a = room.slots.A, b = room.slots.B;
      if (a.setupDone && b.setupDone) {
        const winnerKey = other(room.lastSetLoser);
        const nextSetNumber = room.setNumber + 1;
        db.update(`rooms/${roomCode}`, {
          stage: 'playing', serverKey: winnerKey, actingKey: winnerKey,
          setNumber: nextSetNumber, phase: 'SERVE_CHOOSE', ball: null,
          excludeName: { toss: null, attack: null },
          turnDeadline: Date.now() + TURN_SECONDS * 1000,
          'slots/A/setupDone': false, 'slots/B/setupDone': false,
          'public/A/zones': emptyPublic().zones, 'public/B/zones': emptyPublic().zones,
        });
        writeLog(`— 第 ${nextSetNumber} 局開始，由 ${slotLabel(winnerKey)} 發球 —`, 'win');
      }
    }

    updateTimerDisplay();
    determineScreen();
  }

  function slotLabel(key) { return key === 'A' ? '玩家一' : '玩家二'; }

  function determineScreen() {
    if (!room) return;
    if (room.stage === 'lobby') screen = 'lobby';
    else if (room.stage === 'presetup') screen = 'presetup';
    else if (room.stage === 'playing') screen = 'playing';
    else if (room.stage === 'interval') screen = 'interval';
    else if (room.stage === 'matchEnd') screen = 'matchEnd';
  }

  function publishCounts() {
    db.update(`rooms/${roomCode}/public/${me.key}`, {
      deckCount: local.deck.length, handCount: local.hand.length,
      setZoneCount: local.setZone.length, discardCount: local.discard.length,
    });
  }

  function mulligan() {
    if (local.mulliganUsed) return;
    local.deck.push(...local.hand);
    local.hand = [];
    local.deck = shuffle(local.deck);
    draw(local, START_HAND);
    local.mulliganUsed = true;
    publishCounts();
    render();
  }

  function confirmPresetup() {
    const taken = local.deck.splice(0, SET_ZONE_SIZE);
    local.setZone = taken;
    local.setupDone = true;
    publishCounts();
    db.update(`rooms/${roomCode}/slots/${me.key}`, { setupDone: true });
  }

  // ---------------------------------------------------------
  // 對戰核心（發球/接球/阻擋/舉球/攻擊）
  // ---------------------------------------------------------
  function isMyTurn() { return room && room.stage === 'playing' && room.actingKey === me.key; }

  function resetTurnTimer() {
    db.update(`rooms/${roomCode}`, { turnDeadline: Date.now() + TURN_SECONDS * 1000 });
  }

  function writeZone(zoneName, card) {
    const val = card ? { name: card.name, val: card._finalVal != null ? card._finalVal : (card.stats ? card.stats[zoneName] : null), skill: card.skill } : null;
    db.update(`rooms/${roomCode}/public/${me.key}/zones`, { [zoneName]: val });
  }

  function playServe(uid, mod) {
    if (!isMyTurn() || room.phase !== 'SERVE_CHOOSE') return;
    const card = local.hand.find(c => c.uid === uid);
    if (!card || card.stats.serve == null) return;
    local.hand.splice(local.hand.indexOf(card), 1);
    const pts = card.stats.serve + (mod || 0);
    card._finalVal = pts;
    writeZone('serve', card);
    local.zonePile.serve = (local.zonePile.serve || 0) + 1;
    publishCounts();
    const nextActing = other(me.key);
    db.update(`rooms/${roomCode}`, {
      ball: { points: pts, fromKey: me.key, mustReceiveOnly: true },
      actingKey: nextActing, phase: 'RESPOND', turnDeadline: Date.now() + TURN_SECONDS * 1000,
    });
    writeLog(`${slotLabel(me.key)} 發球：〔${card.name}〕發球值 ${card.stats.serve}${mod ? `${mod > 0 ? '+' : ''}${mod}` : ''} → 進攻點數 ${pts}。`);
  }

  function chooseRespond(choice) {
    if (!isMyTurn() || room.phase !== 'RESPOND') return;
    if (choice === 'block' && room.ball.mustReceiveOnly) return;
    if (choice === 'receive') {
      draw(local, 1);
      publishCounts();
      writeLog(`${slotLabel(me.key)} 選擇接球，抽 1 張牌。`);
      db.update(`rooms/${roomCode}`, { phase: 'RECEIVE_PLAY', turnDeadline: Date.now() + TURN_SECONDS * 1000 });
    } else {
      local.blockPicks = [];
      writeLog(`${slotLabel(me.key)} 選擇阻擋。`);
      db.update(`rooms/${roomCode}`, { phase: 'BLOCK_PLAY', turnDeadline: Date.now() + TURN_SECONDS * 1000 });
    }
  }

  function playReceive(uid, mod) {
    if (!isMyTurn() || room.phase !== 'RECEIVE_PLAY') return;
    const card = local.hand.find(c => c.uid === uid);    if (!card || card.stats.receive == null) return;
    local.hand.splice(local.hand.indexOf(card), 1);
    const val = card.stats.receive + (mod || 0);
    card._finalVal = val;
    writeZone('receive', card);
    local.zonePile.receive = (local.zonePile.receive || 0) + 1;
    publishCounts();
    const need = room.ball.points;
    if (val >= need) {
      writeLog(`${slotLabel(me.key)} 接球：〔${card.name}〕接球值 ${val} ≥ 對方進攻點數 ${need}，接球成功。`, 'win');
      db.update(`rooms/${roomCode}`, {
        phase: 'TOSS_PLAY', 'excludeName/toss': card.name, turnDeadline: Date.now() + TURN_SECONDS * 1000,
      });
    } else {
      writeLog(`${slotLabel(me.key)} 接球：〔${card.name}〕接球值 ${val} ＜ 對方進攻點數 ${need}，接球失敗！宣告落球。`, 'lost');
      endSet(me.key);
    }
  }

  function toggleBlockPick(uid) {
    const card = local.hand.find(c => c.uid === uid);
    if (!card || card.stats.block == null) return;
    const idx = local.blockPicks.findIndex(c => c.uid === uid);
    if (idx > -1) { local.blockPicks.splice(idx, 1); render(); return; }
    if (local.blockPicks.length >= 3) return;
    if (local.blockPicks.length > 0 && local.blockPicks.some(c => c.name === card.name)) return;
    local.blockPicks.push(card);
    render();
  }

  function confirmBlock(mod) {
    if (!isMyTurn() || room.phase !== 'BLOCK_PLAY') return;
    if (local.blockPicks.length === 0) return;
    const [mainCard, ...subs] = local.blockPicks;
    let total = local.blockPicks.reduce((s, c) => s + c.stats.block, 0) + (mod || 0);
    local.blockPicks.forEach(c => local.hand.splice(local.hand.indexOf(c), 1));
    mainCard._finalVal = total;
    subs.forEach(c => local.discard.push(c));
    writeZone('block', mainCard);
    local.zonePile.block = (local.zonePile.block || 0) + 1;
    publishCounts();
    const names = local.blockPicks.map(c => `〔${c.name}〕`).join('');
    const need = room.ball.points;
    if (total >= need) {
      writeLog(`${slotLabel(me.key)} 阻擋：${names} 合計阻擋值 ${total} ≥ 對方進攻點數 ${need}，阻擋成功，點數歸零回擊。`, 'win');
      db.update(`rooms/${roomCode}`, {
        ball: { points: 0, fromKey: me.key, mustReceiveOnly: true },
        actingKey: other(me.key), phase: 'RESPOND', turnDeadline: Date.now() + TURN_SECONDS * 1000,
      });
      local.blockPicks = [];
    } else {
      writeLog(`${slotLabel(me.key)} 阻擋：${names} 合計阻擋值 ${total} ＜ 對方進攻點數 ${need}，阻擋失敗！宣告落球。`, 'lost');
      endSet(me.key);
    }
  }

  let myTossVal = 0;
  function playToss(uid, mod) {
    if (!isMyTurn() || room.phase !== 'TOSS_PLAY') return;
    const card = local.hand.find(c => c.uid === uid);
    if (!card || card.stats.toss == null) return;
    if (room.excludeName && room.excludeName.toss && card.name === room.excludeName.toss) return;
    local.hand.splice(local.hand.indexOf(card), 1);
    const val = card.stats.toss + (mod || 0);
    card._finalVal = val;
    myTossVal = val;
    writeZone('toss', card);
    local.zonePile.toss = (local.zonePile.toss || 0) + 1;
    publishCounts();
    writeLog(`${slotLabel(me.key)} 舉球：〔${card.name}〕舉球值 ${val}。`);
    db.update(`rooms/${roomCode}`, { phase: 'ATTACK_PLAY', 'excludeName/attack': card.name, turnDeadline: Date.now() + TURN_SECONDS * 1000 });
  }

  function playAttack(uid, mod) {
    if (!isMyTurn() || room.phase !== 'ATTACK_PLAY') return;
    const card = local.hand.find(c => c.uid === uid);
    if (!card || card.stats.attack == null) return;
    if (room.excludeName && room.excludeName.attack && card.name === room.excludeName.attack) return;
    local.hand.splice(local.hand.indexOf(card), 1);
    const attackVal = card.stats.attack + (mod || 0);
    card._finalVal = attackVal;
    writeZone('attack', card);
    local.zonePile.attack = (local.zonePile.attack || 0) + 1;
    publishCounts();
    const pts = myTossVal + attackVal;
    writeLog(`${slotLabel(me.key)} 攻擊：〔${card.name}〕攻擊值 ${attackVal} ＋ 舉球值 ${myTossVal} → 進攻點數 ${pts}。`);
    db.update(`rooms/${roomCode}`, {
      ball: { points: pts, fromKey: me.key, mustReceiveOnly: false },
      actingKey: other(me.key), phase: 'RESPOND', turnDeadline: Date.now() + TURN_SECONDS * 1000,
    });
  }

  const PHASE_TO_HANDLER = { SERVE_CHOOSE: playServe, RECEIVE_PLAY: playReceive, TOSS_PLAY: playToss, ATTACK_PLAY: playAttack };

  // 手牌被點擊時的統一入口：先抓飛入動畫的起點座標，再判斷這張牌
  // 在目前階段有沒有自動化技能規則 —— 有就跳確認面板，沒有就照舊直接出牌。
  function handleCardTap(evt, uid) {
    captureFlipSource(evt);
    const card = local.hand.find(c => c.uid === uid);
    if (!card) return;
    const zoneKey = PHASE_TO_ZONE[room.phase];
    const rule = SKILL_RULES[card.name];
    if (rule && rule.zone === zoneKey && (!rule.condition || rule.condition({ ball: room.ball }))) {
      pendingFlip = null; // 技能確認面板會先切畫面，飛入動畫的起點就對不上了，改用一般的浮現效果
      local.pendingPlay = { uid, rule };
      render();
      return;
    }
    if (pendingFlip) pendingFlip.zoneKey = zoneKey, pendingFlip.side = me.key;
    PHASE_TO_HANDLER[room.phase](uid, currentMod());
  }

  function captureFlipSource(evt) {
    try {
      const cardEl = evt && evt.currentTarget;
      const faceEl = cardEl && cardEl.querySelector('.cardface');
      if (faceEl) pendingFlip = { rect: faceEl.getBoundingClientRect() };
    } catch (e) { pendingFlip = null; }
  }

  function runFlipAnimation(flip) {
    try {
      const target = app.querySelector(`.zone[data-owner="${flip.side}"][data-zone="${flip.zoneKey}"] .cardface`);
      if (!target || !flip.rect || !flip.rect.width) return;
      const newRect = target.getBoundingClientRect();
      if (!newRect.width) return;
      const dx = flip.rect.left - newRect.left;
      const dy = flip.rect.top - newRect.top;
      const scale = flip.rect.width / newRect.width;
      target.style.transition = 'none';
      target.style.opacity = '0.75';
      target.style.transform = `translate(${dx}px,${dy}px) scale(${scale})`;
      requestAnimationFrame(() => {
        target.style.transition = 'transform .36s cubic-bezier(.2,.9,.3,1.1), opacity .2s';
        target.style.transform = 'translate(0,0) scale(1)';
        target.style.opacity = '1';
      });
    } catch (e) { /* 動畫失敗就算了，不影響對戰邏輯 */ }
  }

  function pendingSkillPanelHTML() {
    const { uid, rule } = local.pendingPlay;
    const card = local.hand.find(c => c.uid === uid);
    if (!card) { local.pendingPlay = null; return ''; }
    let costLine, canAfford;
    if (rule.cost.type === 'pile') {
      const avail = local.zonePile[rule.zone] || 0;
      canAfford = avail >= rule.cost.amount;
      costLine = `需要這區可用資源 ${rule.cost.amount} 張（目前 ${avail} 張）${canAfford ? '' : '——資源不夠，這次沒辦法用'}`;
    } else {
      canAfford = local.hand.filter(c => c.uid !== uid).length >= rule.cost.amount;
      costLine = `需要丟棄手牌 ${rule.cost.amount} 張（會自動丟最後一張，不能用就直接出牌）`;
    }
    return `
    <div class="bracket actionzone">
      <div class="actionzone__title">〔${card.name}〕技能確認</div>
      <p style="font-size:13px;color:var(--chalk-dim);margin:0 0 10px;">${card.skill}</p>
      <p style="font-size:12px;color:var(--chalk-dim);margin:0 0 14px;">${costLine}</p>
      <div class="btnrow-wrap">
        <button class="mini-btn mini-btn--primary" ${canAfford ? '' : 'disabled'} onclick="handleUseSkill()">使用技能</button>
        <button class="mini-btn" onclick="handlePlainPlay()">不使用技能，直接出牌</button>
        <button class="mini-btn mini-btn--danger" onclick="handleCancelPending()">取消，選別張</button>
      </div>
    </div>`;
  }

  function applySkillAndPlay(uid, rule) {
    let bonus = rule.effect.statBonus || 0;
    if (rule.cost.type === 'pile') {
      local.zonePile[rule.zone] = (local.zonePile[rule.zone] || 0) - rule.cost.amount;
    } else if (rule.cost.type === 'hand') {
      const others = local.hand.filter(c => c.uid !== uid);
      const discardCard = others[others.length - 1];
      if (discardCard) {
        local.hand.splice(local.hand.indexOf(discardCard), 1);
        local.discard.push(discardCard);
        writeLog(`${slotLabel(me.key)} 技能成本：丟棄〔${discardCard.name}〕。`);
      }
    }
    PHASE_TO_HANDLER[room.phase](uid, bonus);
    if (rule.effect.draw) {
      draw(local, rule.effect.draw);
      publishCounts();
      writeLog(`${slotLabel(me.key)} 技能：額外抽 ${rule.effect.draw} 張牌。`);
    }
  }

  function declareLost() {
    if (!isMyTurn()) return;
    writeLog(`${slotLabel(me.key)} 宣告落球（放棄）。`, 'lost');
    endSet(me.key);
  }

  function endSet(loserKey) {
    const winnerKey = other(loserKey);
    const setNumberAtEnd = room.setNumber;
    const newWon = (room.public[winnerKey].setsWon || 0) + 1;
    db.update(`rooms/${roomCode}`, {
      lastSetLoser: loserKey,
      [`public/${winnerKey}/setsWon`]: newWon,
      'public/A/zones': emptyPublic().zones,
      'public/B/zones': emptyPublic().zones,
    }).then(() => {
      writeLog(`— 第 ${setNumberAtEnd} 局結束：${slotLabel(winnerKey)} 拿下這局 —`, 'win');
      if (newWon >= SETS_TO_WIN) {
        db.update(`rooms/${roomCode}`, { stage: 'matchEnd', matchWinner: winnerKey });
      } else {
        db.update(`rooms/${roomCode}`, { stage: 'interval' });
      }
    });
  }

  function handleMyInterval() {
    if (local.hand.length < START_HAND) draw(local, START_HAND - local.hand.length);
    if (room.lastSetLoser === me.key) {
      if (local.setZone.length === 0) {
        publishCounts();
        db.update(`rooms/${roomCode}`, { stage: 'matchEnd', matchWinner: other(me.key) });
        writeLog(`${slotLabel(me.key)} 的 SET 牌區沒有牌可以拿了，直接判定輸掉整場比賽！`, 'lost');
        return;
      }
      const extra = local.setZone.shift();
      local.hand.push(extra);
      writeLog(`${slotLabel(me.key)} 從 SET 牌區補 1 張，手牌來到 ${local.hand.length} 張。`);
    }
    publishCounts();
    db.update(`rooms/${roomCode}/slots/${me.key}`, { setupDone: true });
  }

  function playAgain() {
    resetLocalForNewMatch();
    db.update(`rooms/${roomCode}`, {
      stage: 'lobby',
      slots: {
        A: { present: true, ready: false, deckKey: room.slots.A.deckKey, setupDone: false },
        B: { present: true, ready: false, deckKey: room.slots.B.deckKey, setupDone: false },
      },
      serverKey: null, actingKey: null, phase: null, setNumber: 1,
      ball: null, excludeName: { toss: null, attack: null }, turnDeadline: null,
      public: { A: emptyPublic(), B: emptyPublic() },
      lastSetLoser: null, matchWinner: null,
    });
  }

  // ---------------------------------------------------------
  // 15 秒倒數（只顯示，不會自動放棄——之後才做自動判定）
  // ---------------------------------------------------------
  function updateTimerDisplay() {
    if (room && room.stage === 'playing' && room.turnDeadline) {
      timerDeadline = room.turnDeadline;
      if (!timerInterval) timerInterval = setInterval(() => render(), 1000);
    } else {
      timerDeadline = null;
      if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    }
  }
  function timerHTML() {
    if (!timerDeadline) return '';
    const remain = Math.max(0, Math.ceil((timerDeadline - Date.now()) / 1000));
    return `<div class="timerpill ${remain <= 5 ? 'urgent' : ''}">${remain}s</div>`;
  }

  // ---------------------------------------------------------
  // 渲染
  // ---------------------------------------------------------
  function cardFaceHTML(card, side, opts) {
    opts = opts || {};
    const mono = card.name ? card.name[0] : '?';
    const val = opts.val != null ? opts.val : '';
    const posLabel = card.position || card.category || '';
    const imgHTML = card.image ? `<img class="cardface__img" src="${card.image}" alt="${card.name || ''}">` : '';
    return `<div class="cardface cardface--${side} ${opts.justPlayed ? 'just-played' : ''}">
      ${imgHTML}
      <div class="cardface__pos">${posLabel}</div>
      <div class="cardface__mono" style="${card.image ? 'display:none;' : ''}">${mono}</div>
      ${val !== '' ? `<div class="cardface__val">${val}</div>` : ''}
    </div>`;
  }

  function statPillsForHandCard(c) {
    return Object.keys(STAT_LABEL).map(k => {
      const v = c.stats ? c.stats[k] : null;
      if (v == null) return '';
      return `<span style="margin-right:8px;"><b class="handcard__stat">${v}</b><span class="handcard__statlabel"> ${STAT_LABEL[k]}</span></span>`;
    }).join('');
  }

  function handCardHTML(c, opts) {
    opts = opts || {};
    const disabled = opts.disabled ? 'disabled' : '';
    const selected = opts.selected ? 'selected' : '';
    const fanStyle = opts.fanStyle || '';
    return `
    <div class="handcard ${disabled} ${selected}" data-uid="${c.uid}" style="${fanStyle}" onclick="${disabled ? '' : opts.onclick}">
      ${cardFaceHTML(c, me.key, {})}
      <div class="handcard__info">
        <div class="handcard__name">${c.name}</div>
        <div>${c.type === 'character' ? statPillsForHandCard(c) : '<span class="handcard__statlabel">事件卡</span>'}</div>
        <div class="handcard__toggle" onclick="event.stopPropagation();this.parentElement.parentElement.classList.toggle('expanded')">技能 ▾</div>
        <div class="handcard__skill">${c.skill}</div>
      </div>
    </div>`;
  }

  // 手牌扇形展開：依索引/總數算出旋轉角度、上抬高度與動畫延遲，讓每張牌錯開像真的手持一疊卡
  function fanStyleFor(i, total) {
    if (total <= 1) return 'z-index:100;';
    const mid = (total - 1) / 2;
    const offset = i - mid;
    const maxAngle = Math.min(9, 30 / total);
    const angle = (offset * maxAngle).toFixed(1);
    const lift = Math.abs(offset) * 5;
    const z = 100 - Math.round(Math.abs(offset) * 10);
    const delay = (i * 0.12).toFixed(2);
    return `transform:rotate(${angle}deg) translateY(${lift.toFixed(1)}px);z-index:${z};animation-delay:${delay}s;`;
  }

  function handFanHTML(cards, cardHtmlFn) {
    return cards.map((c, i) => cardHtmlFn(c, fanStyleFor(i, cards.length))).join('');
  }

  function zoneHTML(label, zoneData, side, zoneKey) {
    if (!zoneData) return `<div class="zone" data-owner="${side}" data-zone="${zoneKey}"><div class="zone__face"><div class="zone__label">${label}</div><div class="zone__empty">—</div></div></div>`;
    return `<div class="zone" data-owner="${side}" data-zone="${zoneKey}">
      <div class="zone__face">
        <div class="zone__label">${label}</div>
        ${cardFaceHTML({ name: zoneData.name }, side, { val: zoneData.val, justPlayed: true })}
        <div class="zone__cardname">${zoneData.name}</div>
      </div>
    </div>`;
  }

  function zonesRowHTML(key) {
    const pub = room.public[key];
    const z = (pub && pub.zones) || {};
    return `
      ${zoneHTML('發球', z.serve, key, 'serve')}
      ${zoneHTML('接球', z.receive, key, 'receive')}
      ${zoneHTML('阻擋(合計)', z.block, key, 'block')}
      ${zoneHTML('舉球', z.toss, key, 'toss')}
      ${zoneHTML('攻擊', z.attack, key, 'attack')}
    `;
  }

  // 牌組區／局數區／棄牌區 —— 疊在對戰墊印刷好的那三個格子正中央，只顯示張數
  function matCountsHTML(key) {
    const pub = room.public[key];
    return `
      <div class="matcount" data-zone="deck"><span class="matcount__n">${pub.deckCount}</span></div>
      <div class="matcount" data-zone="set"><span class="matcount__n">${pub.setZoneCount}</span></div>
      <div class="matcount" data-zone="discard"><span class="matcount__n">${pub.discardCount}</span></div>
    `;
  }

  function matBadgeHTML(key) {
    const pub = room.public[key];
    const isMe = key === me.key;
    return `<div class="matlayer__badge"><span class="matlayer__badge-inner">${slotLabel(key)}${isMe ? '（你）' : ''} · 手牌${pub.handCount} · 局數<b style="color:var(--score);">${pub.setsWon}</b></span></div>`;
  }

  function ballBarHTML() {
    if (!room.ball) return '';
    return `<div class="bracket ballbar">
      <span>目前來球：由 <b>${slotLabel(room.ball.fromKey)}</b> 這邊打過來</span>
      <span>進攻點數 <b>${room.ball.points}</b>${room.ball.mustReceiveOnly ? '　(這球只能接球，不能阻擋)' : ''}</span>
    </div>`;
  }

  function modRow() {
    return `<div class="modrow">技能手動加減值（展開卡片看技能文字，自己判斷是否符合條件）：<input type="number" id="modInput" value="0" step="1"></div>`;
  }

  // 永遠列出整副手牌讓玩家知道自己手上有什麼，不符合目前階段的牌用灰階呈現、點了沒反應，
  // 不再像以前那樣直接把不能出的牌從畫面上濾掉。
  function actionWrap(title, isValid, onclickFn) {
    const cards = local.hand;
    const anyValid = cards.some(isValid);
    return `
    <div class="bracket actionzone">
      <div class="actionzone__title">${title}</div>
      <div class="handfan">
        ${cards.length ? handFanHTML(cards, (c, fanStyle) => {
          const ok = isValid(c);
          return handCardHTML(c, { onclick: ok ? onclickFn(c.uid) : '', disabled: !ok, fanStyle });
        }) : '<div class="zone__empty">手上沒有牌</div>'}
      </div>
      ${modRow()}
      <div class="btnrow-wrap">
        <button class="mini-btn mini-btn--danger" onclick="handleDeclareLost()">${anyValid ? '放棄，宣告落球' : '無牌可出，宣告落球'}</button>
      </div>
    </div>`;
  }

  function actionZoneHTML() {
    if (!isMyTurn()) {
      return `<div class="bracket actionzone"><div class="actionzone__title">等待 ${slotLabel(room.actingKey)} 行動中…</div></div>`;
    }
    if (local.pendingPlay) return pendingSkillPanelHTML();
    const phase = room.phase;
    if (phase === 'SERVE_CHOOSE') {
      const isValid = c => c.type === 'character' && c.stats.serve != null;
      return actionWrap('發球階段 — 選一張角色卡發球（不抽牌）', isValid, uid => `handleCardTap(event,'${uid}')`);
    }
    if (phase === 'RESPOND') {
      const canBlock = !room.ball.mustReceiveOnly;
      return `
      <div class="bracket actionzone">
        <div class="actionzone__title">應對階段 — 選擇接球或阻擋</div>
        <div class="btnrow-wrap">
          <button class="mini-btn mini-btn--primary" onclick="handleRespond('receive')">接球（先抽1張）</button>
          <button class="mini-btn" ${canBlock ? '' : 'disabled'} onclick="handleRespond('block')">阻擋${canBlock ? '' : '（這球不可阻擋）'}</button>
          <button class="mini-btn mini-btn--danger" onclick="handleDeclareLost()">直接宣告落球</button>
        </div>
      </div>`;
    }
    if (phase === 'RECEIVE_PLAY') {
      const isValid = c => c.type === 'character' && c.stats.receive != null;
      return actionWrap(`接球階段 — 需要接球值 ≥ ${room.ball.points}`, isValid, uid => `handleCardTap(event,'${uid}')`);
    }
    if (phase === 'BLOCK_PLAY') {
      const isValid = c => c.type === 'character' && c.stats.block != null;
      const picks = local.blockPicks;
      const total = picks.reduce((s, c) => s + c.stats.block, 0);
      return `
      <div class="bracket actionzone">
        <div class="actionzone__title">阻擋階段 — 需要合計阻擋值 ≥ ${room.ball.points}（先選主攔，最多再加2名副攔，同名不可重複）</div>
        <div class="handfan">
          ${local.hand.length ? handFanHTML(local.hand, (c, fanStyle) => {
            const picked = picks.some(x => x.uid === c.uid);
            const blocked = !isValid(c) || (!picked && picks.length >= 3) || (!picked && picks.length > 0 && picks.some(x => x.name === c.name));
            return handCardHTML(c, {
              selected: picked,
              disabled: blocked,
              onclick: `handleToggleBlock('${c.uid}')`,
              fanStyle
            });
          }) : '<div class="zone__empty">手上沒有牌</div>'}
        </div>
        <div style="margin-top:10px;font-family:var(--mono);font-size:13px;color:var(--chalk-dim);">
          已選：${picks.map(c => c.name).join('、') || '（尚未選擇）'}　合計阻擋值：<b style="color:var(--score);">${total}</b>
        </div>
        ${modRow()}
        <div class="btnrow-wrap">
          <button class="mini-btn mini-btn--primary" ${picks.length === 0 ? 'disabled' : ''} onclick="handleConfirmBlock()">確認阻擋</button>
          <button class="mini-btn mini-btn--danger" onclick="handleDeclareLost()">放棄，宣告落球</button>
        </div>
      </div>`;
    }
    if (phase === 'TOSS_PLAY') {
      const exToss = room.excludeName ? room.excludeName.toss : null;
      const isValid = c => c.type === 'character' && c.stats.toss != null && c.name !== exToss;
      return actionWrap(`舉球階段 — 不能跟接球區同名角色（${exToss || '—'}）`, isValid, uid => `handleCardTap(event,'${uid}')`);
    }
    if (phase === 'ATTACK_PLAY') {
      const exAttack = room.excludeName ? room.excludeName.attack : null;
      const isValid = c => c.type === 'character' && c.stats.attack != null && c.name !== exAttack;
      return actionWrap(`攻擊階段 — 不能跟舉球區同名角色（${exAttack || '—'}）`, isValid, uid => `handleCardTap(event,'${uid}')`);
    }
    return '';
  }

  function logHTML() {
    const rev = logEntries.slice().reverse();
    return `<div class="bracket logpanel">
      <div class="logpanel__title">對戰紀錄</div>
      ${rev.map(l => `<div class="logline ${l.cls || ''}">${l.text}</div>`).join('')}
    </div>`;
  }

  // 對戰墊是固定 12:7 比例的印刷圖，兩張疊起來(對手+我方)高度常常會超過螢幕，
  // 這裡量實際可用的寬/高，取「寬度撐滿」跟「高度撐滿」兩種算法中比較小的那個，
  // 用 px 精準設定每張墊子的寬高，確保永遠完整顯示在螢幕內，不用捲動也不會被裁切。
  const MAT_RATIO = 12 / 7;
  function layoutMatBattle() {
    const matEl = app.querySelector('.matbattle__mat');
    const layers = app.querySelectorAll('.matlayer');
    if (!matEl || !layers.length) return;
    const netgap = app.querySelector('.matbattle__netgap');
    const cw = matEl.clientWidth;
    const ch = matEl.clientHeight - (netgap ? netgap.offsetHeight : 0);
    const perMatH = ch / 2;
    let w = cw, h = w / MAT_RATIO;
    if (h > perMatH) { h = perMatH; w = h * MAT_RATIO; }
    layers.forEach(el => { el.style.width = w + 'px'; el.style.height = h + 'px'; });
  }
  let matResizeBound = false;
  function ensureMatResizeListener() {
    if (matResizeBound) return;
    matResizeBound = true;
    window.addEventListener('resize', () => { if (screen === 'playing') layoutMatBattle(); });
  }

  function render() {
    document.body.classList.toggle('fs-battle', screen === 'playing');
    if (screen !== 'playing' && pendingFlip) pendingFlip = null;
    if (errorMsg) {
      app.innerHTML = `<div class="errorbox">${errorMsg}</div>` + landingHTML();
      return;
    }
    if (screen === 'landing') { app.innerHTML = landingHTML(); return; }
    if (!room) { app.innerHTML = `<div class="bracket setup-card" style="padding:26px;">連線中…</div>`; return; }

    if (screen === 'lobby') {
      const a = room.slots.A, b = room.slots.B;
      app.innerHTML = `
      <div class="bracket lobby-card">
        <h3>房號</h3>
        <div class="roomcode-display">${roomCode}</div>
        <p>把這個房號給另一位玩家，他在「加入戰局」輸入就能進來。</p>
      </div>
      <div class="slotgrid">
        ${['A', 'B'].map(k => {
          const s = room.slots[k];
          return `<div class="bracket slotbox ${s.ready ? 'ready' : ''}">
            <b>${slotLabel(k)}${k === me.key ? '（你）' : ''}</b>
            <div class="status">${s.present ? (s.ready ? '已準備' : '尚未準備') : '等待加入…'}</div>
            ${k === me.key && s.present ? `
              <div class="setup-row" style="margin-top:10px;">
                <select onchange="handleSetDeck(this.value)" ${s.ready ? 'disabled' : ''}>
                  ${Object.keys(POOLS).map(pk => `<option value="${pk}" ${s.deckKey === pk ? 'selected' : ''}>${POOLS[pk].label}</option>`).join('')}
                </select>
              </div>
              <button class="mini-btn mini-btn--primary" style="margin-top:8px;" onclick="handleToggleReady()">${s.ready ? '取消準備' : '準備完成'}</button>
            ` : ''}
          </div>`;
        }).join('')}
      </div>`;
      return;
    }

    if (screen === 'presetup') {
      app.innerHTML = `
      <div class="bracket lobby-card">
        <h3>準備手牌</h3>
        <p>已抽 ${local.hand.length} 張起始手牌，可重抽一次。雙方都按下「準備完成」後自動擲硬幣開局。</p>
      </div>
      <div class="handfan">${handFanHTML(local.hand, (c, fanStyle) => handCardHTML(c, { onclick: '', fanStyle }))}</div>
      <div class="btnrow-wrap">
        <button class="mini-btn" ${local.mulliganUsed || local.setupDone ? 'disabled' : ''} onclick="handleMulligan()">${local.mulliganUsed ? '已重抽過' : '重抽起始手牌(限一次)'}</button>
        <button class="mini-btn mini-btn--primary" ${local.setupDone ? 'disabled' : ''} onclick="handleConfirmPresetup()">${local.setupDone ? '等待對方…' : '準備完成'}</button>
      </div>`;
      return;
    }

    if (screen === 'playing') {
      const oppKey = other(me.key);
      const oppActing = room.actingKey === oppKey;
      const meActing = room.actingKey === me.key;
      app.innerHTML = `
      <div class="matbattle">
        <div class="matbattle__hud">
          <div class="hudpill">${slotLabel('A')} <b>${room.public.A.setsWon}</b>：<b>${room.public.B.setsWon}</b> ${slotLabel('B')}</div>
          <div class="hudpill">第 ${room.setNumber} 局</div>
          ${timerHTML()}
          <button class="hudpill hudpill--log" onclick="handleToggleLog()">紀錄 ▸</button>
        </div>
        <div class="matbattle__mat">
          <div class="matlayer matlayer--opp ${oppActing ? 'acting' : ''}">
            <img class="matlayer__img" src="assets/single_playmat_print.png" alt="">
            ${zonesRowHTML(oppKey)}
            ${matCountsHTML(oppKey)}
            ${matBadgeHTML(oppKey)}
          </div>
          <div class="matbattle__netgap">${ballBarHTML()}</div>
          <div class="matlayer matlayer--me ${meActing ? 'acting' : ''}">
            <img class="matlayer__img" src="assets/single_playmat_print.png" alt="">
            ${zonesRowHTML(me.key)}
            ${matCountsHTML(me.key)}
            ${matBadgeHTML(me.key)}
          </div>
        </div>
        <div class="matbattle__dock">${actionZoneHTML()}</div>
      </div>
      <div class="matbattle__logdrawer ${logOpen ? 'open' : ''}">
        <button class="hudpill hudpill--log" onclick="handleToggleLog()">✕ 關閉</button>
        ${logHTML()}
      </div>`;
      layoutMatBattle();
      ensureMatResizeListener();
      if (pendingFlip) { runFlipAnimation(pendingFlip); pendingFlip = null; }
      return;
    }

    if (screen === 'interval') {
      app.innerHTML = `
      <div class="bracket resultcard">
        <h2>局末休息</h2>
        <p>雙方手牌補到 6 張；${slotLabel(room.lastSetLoser)} 是這局輸家，再從 SET 牌區補 1 張。等雙方都補完會自動進下一局。</p>
      </div>
      ${logHTML()}`;
      return;
    }

    if (screen === 'matchEnd') {
      app.innerHTML = `
      <div class="bracket resultcard">
        <h2>${slotLabel(room.matchWinner)} 獲勝！</h2>
        <p>最終比數　${slotLabel('A')} ${room.public.A.setsWon} : ${room.public.B.setsWon} ${slotLabel('B')}</p>
        <button class="mini-btn mini-btn--primary" onclick="handlePlayAgain()">再來一場（同房號）</button>
      </div>
      ${logHTML()}`;
      return;
    }
  }

  function landingHTML() {
    return `
    <div class="lobby-grid">
      <div class="bracket lobby-card">
        <h3>建立新戰局</h3>
        <p>你會拿到一組房號，傳給對方輸入即可加入。</p>
        <button class="mini-btn mini-btn--primary" onclick="handleCreateRoom()">建立新戰局</button>
      </div>
      <div class="bracket lobby-card">
        <h3>加入戰局</h3>
        <p>輸入對方給你的房號。</p>
        <input class="codeinput" id="joinCodeInput" maxlength="5" placeholder="房號">
        <button class="mini-btn mini-btn--primary" onclick="handleJoinRoom()">加入戰局</button>
      </div>
    </div>`;
  }

  // ---------------------------------------------------------
  // 事件掛載
  // ---------------------------------------------------------
  function currentMod() {
    const el = document.getElementById('modInput');
    return el ? (parseInt(el.value, 10) || 0) : 0;
  }
  window.handleCreateRoom = function () { errorMsg = null; createRoom(); };
  window.handleJoinRoom = function () {
    errorMsg = null;
    const el = document.getElementById('joinCodeInput');
    joinRoom(el ? el.value : '');
  };
  window.handleSetDeck = function (v) { setMyDeck(v); };
  window.handleToggleReady = function () { toggleReady(); };
  window.handleMulligan = function () { mulligan(); };
  window.handleConfirmPresetup = function () { confirmPresetup(); };
  window.handleServe = function (uid) { playServe(uid, currentMod()); };
  window.handleRespond = function (c) { chooseRespond(c); };
  window.handleReceive = function (uid) { playReceive(uid, currentMod()); };
  window.handleToggleBlock = function (uid) { toggleBlockPick(uid); };
  window.handleConfirmBlock = function () { confirmBlock(currentMod()); };
  window.handleToss = function (uid) { playToss(uid, currentMod()); };
  window.handleAttack = function (uid) { playAttack(uid, currentMod()); };
  window.handleCardTap = function (evt, uid) { handleCardTap(evt, uid); };
  window.handleUseSkill = function () {
    if (!local.pendingPlay) return;
    const { uid, rule } = local.pendingPlay;
    local.pendingPlay = null;
    applySkillAndPlay(uid, rule);
  };
  window.handlePlainPlay = function () {
    if (!local.pendingPlay) return;
    const { uid } = local.pendingPlay;
    local.pendingPlay = null;
    PHASE_TO_HANDLER[room.phase](uid, 0);
  };
  window.handleCancelPending = function () { local.pendingPlay = null; render(); };
  window.handleDeclareLost = function () { declareLost(); };
  window.handlePlayAgain = function () { playAgain(); };
  window.handleToggleLog = function () { logOpen = !logOpen; render(); };

  render();
})();
