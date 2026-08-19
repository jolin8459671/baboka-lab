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
  const COPIES_PER_CARD = 3;
  const START_HAND = 6;
  const SET_ZONE_SIZE = 2;
  const SETS_TO_WIN = 3;
  const TURN_SECONDS = 15;

  const POOLS = {
    karasuno: { label: '烏野 (D01 起始)', cards: CARDS.filter(c => c.series.startsWith('D01')) },
    nekoma:   { label: '音駒 (D02 起始)', cards: CARDS.filter(c => c.series.startsWith('D02')) },
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
    for (let i = 0; i < COPIES_PER_CARD; i++) {
      base.forEach(c => pile.push(Object.assign({}, c, { uid: 'c' + (uidSeed++), pile: [] })));
    }
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
  };
  let processedIntervalFor = null; // 避免同一局間休息重複處理
  let lastPlayedZone = { key: null, side: null }; // 給飛入動畫用

  let timerInterval = null;
  let timerDeadline = null;

  const db = getDB();

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
    processedIntervalFor = null;
  }

  function reactToRoom() {
    if (!room) return;

    // 剛回到大廳（重新開一場）：清掉上一場殘留的本地私有資料
    if (room.stage === 'lobby' && (local.hand.length > 0 || local.deck.length > 0)) {
      resetLocalForNewMatch();
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
    publishCounts();
    const pts = myTossVal + attackVal;
    writeLog(`${slotLabel(me.key)} 攻擊：〔${card.name}〕攻擊值 ${attackVal} ＋ 舉球值 ${myTossVal} → 進攻點數 ${pts}。`);
    db.update(`rooms/${roomCode}`, {
      ball: { points: pts, fromKey: me.key, mustReceiveOnly: false },
      actingKey: other(me.key), phase: 'RESPOND', turnDeadline: Date.now() + TURN_SECONDS * 1000,
    });
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
    return `<div class="cardface cardface--${side} ${opts.justPlayed ? 'just-played' : ''}">
      <div class="cardface__pos">${posLabel}</div>
      <div class="cardface__mono">${mono}</div>
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
    return `
    <div class="handcard ${disabled} ${selected}" data-uid="${c.uid}" onclick="${disabled ? '' : opts.onclick}">
      ${cardFaceHTML(c, me.key, {})}
      <div class="handcard__info">
        <div class="handcard__name">${c.name}</div>
        <div>${c.type === 'character' ? statPillsForHandCard(c) : '<span class="handcard__statlabel">事件卡</span>'}</div>
        <div class="handcard__toggle" onclick="event.stopPropagation();this.parentElement.parentElement.classList.toggle('expanded')">技能 ▾</div>
        <div class="handcard__skill">${c.skill}</div>
      </div>
    </div>`;
  }

  function zoneHTML(label, zoneData, side) {
    if (!zoneData) return `<div class="zone"><div class="zone__label">${label}</div><div class="zone__empty">—</div></div>`;
    return `<div class="zone">
      <div class="zone__label">${label}</div>
      ${cardFaceHTML({ name: zoneData.name }, side, { val: zoneData.val, justPlayed: true })}
      <div class="zone__cardname">${zoneData.name}</div>
    </div>`;
  }

  function panelHTML(key) {
    const pub = room.public[key];
    const isMe = key === me.key;
    const acting = room.stage === 'playing' && room.actingKey === key;
    const z = pub.zones || {};
    return `
    <div class="bracket panel ${acting ? 'panel--acting' : ''} ${isMe ? 'panel--me' : ''}">
      <div class="panel__head">
        <div class="panel__name">${slotLabel(key)}${isMe ? '（你）' : ''} ${acting ? '<span class="tag">行動中</span>' : ''}</div>
        <div class="panel__meta">
          <span>牌組 <b>${pub.deckCount}</b></span>
          <span>手牌 <b>${pub.handCount}</b></span>
          <span>SET區 <b>${pub.setZoneCount}</b></span>
          <span>棄牌 <b>${pub.discardCount}</b></span>
          <span>局數 <b style="color:var(--score);">${pub.setsWon}</b></span>
        </div>
      </div>
      <div class="zonerow">
        ${zoneHTML('發球', z.serve, key)}
        ${zoneHTML('接球', z.receive, key)}
        ${zoneHTML('阻擋(合計)', z.block, key)}
        ${zoneHTML('舉球', z.toss, key)}
        ${zoneHTML('攻擊', z.attack, key)}
      </div>
    </div>`;
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

  function actionWrap(title, cards, onclickFn, empty) {
    return `
    <div class="bracket actionzone">
      <div class="actionzone__title">${title}</div>
      <div class="handgrid">
        ${cards.map(c => handCardHTML(c, { onclick: onclickFn(c.uid) })).join('') || '<div class="zone__empty">手上沒有符合條件的角色卡</div>'}
      </div>
      ${modRow()}
      <div class="btnrow-wrap">
        <button class="mini-btn mini-btn--danger" onclick="handleDeclareLost()">${empty ? '無牌可出，宣告落球' : '放棄，宣告落球'}</button>
      </div>
    </div>`;
  }

  function actionZoneHTML() {
    if (!isMyTurn()) {
      return `<div class="bracket actionzone"><div class="actionzone__title">等待 ${slotLabel(room.actingKey)} 行動中…</div></div>`;
    }
    const phase = room.phase;
    if (phase === 'SERVE_CHOOSE') {
      const valid = local.hand.filter(c => c.type === 'character' && c.stats.serve != null);
      return actionWrap('發球階段 — 選一張角色卡發球（不抽牌）', valid, uid => `handleServe('${uid}')`, valid.length === 0);
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
      const valid = local.hand.filter(c => c.type === 'character' && c.stats.receive != null);
      return actionWrap(`接球階段 — 需要接球值 ≥ ${room.ball.points}`, valid, uid => `handleReceive('${uid}')`, valid.length === 0);
    }
    if (phase === 'BLOCK_PLAY') {
      const valid = local.hand.filter(c => c.type === 'character' && c.stats.block != null);
      const picks = local.blockPicks;
      const total = picks.reduce((s, c) => s + c.stats.block, 0);
      return `
      <div class="bracket actionzone">
        <div class="actionzone__title">阻擋階段 — 需要合計阻擋值 ≥ ${room.ball.points}（先選主攔，最多再加2名副攔，同名不可重複）</div>
        <div class="handgrid">
          ${valid.map(c => handCardHTML(c, {
            selected: picks.some(x => x.uid === c.uid),
            disabled: !picks.some(x => x.uid === c.uid) && picks.length >= 3,
            onclick: `handleToggleBlock('${c.uid}')`
          })).join('') || '<div class="zone__empty">手上沒有可上場阻擋的角色卡</div>'}
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
      const valid = local.hand.filter(c => c.type === 'character' && c.stats.toss != null && c.name !== exToss);
      return actionWrap(`舉球階段 — 不能跟接球區同名角色（${exToss || '—'}）`, valid, uid => `handleToss('${uid}')`, valid.length === 0);
    }
    if (phase === 'ATTACK_PLAY') {
      const exAttack = room.excludeName ? room.excludeName.attack : null;
      const valid = local.hand.filter(c => c.type === 'character' && c.stats.attack != null && c.name !== exAttack);
      return actionWrap(`攻擊階段 — 不能跟舉球區同名角色（${exAttack || '—'}）`, valid, uid => `handleAttack('${uid}')`, valid.length === 0);
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

  function render() {
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
      <div class="handgrid">${local.hand.map(c => handCardHTML(c, { onclick: '' })).join('')}</div>
      <div class="btnrow-wrap">
        <button class="mini-btn" ${local.mulliganUsed || local.setupDone ? 'disabled' : ''} onclick="handleMulligan()">${local.mulliganUsed ? '已重抽過' : '重抽起始手牌(限一次)'}</button>
        <button class="mini-btn mini-btn--primary" ${local.setupDone ? 'disabled' : ''} onclick="handleConfirmPresetup()">${local.setupDone ? '等待對方…' : '準備完成'}</button>
      </div>`;
      return;
    }

    if (screen === 'playing') {
      app.innerHTML = `
      <div class="bracket matchbar">
        <div class="matchbar__score">${slotLabel('A')} <b>${room.public.A.setsWon}</b> <span class="vs">SET</span> <b>${room.public.B.setsWon}</b> ${slotLabel('B')}</div>
        <div class="matchbar__phase">第 ${room.setNumber} 局<small>目前行動：${slotLabel(room.actingKey)}</small></div>
        ${timerHTML()}
      </div>
      <div class="board">
        ${panelHTML(other(me.key))}
        ${ballBarHTML()}
        ${panelHTML(me.key)}
      </div>
      ${actionZoneHTML()}
      ${logHTML()}`;
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
  window.handleDeclareLost = function () { declareLost(); };
  window.handlePlayAgain = function () { playAgain(); };

  render();
})();