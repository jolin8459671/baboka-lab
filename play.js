// =========================================================
// バボカ対戦 雛型版 —— 純前端、無連線、關分頁即重置
// 已自動化：發球／接球／阻擋／舉球／攻擊流程、點數比對、
//           落球判定、局末補牌、SET區歸零判整場輸、賽末判定
// 手動輔助：角色技能效果（展開技能文字，自己判斷後用「手動加減值」套用）
// =========================================================

(function () {
  const app = document.getElementById('app');
  if (!app || typeof CARDS === 'undefined') return;

  const STAT_LABEL = { serve: '發球', receive: '接球', block: '阻擋', toss: '舉球', attack: '攻擊' };
  const COPIES_PER_CARD = 3; // 目前資料庫每套起始牌只有 5~7 種角色，先每張複製3份湊出可玩的測試牌組
  const START_HAND = 6;
  const SET_ZONE_SIZE = 2;
  const SETS_TO_WIN = 3;

  const POOLS = {
    karasuno: { label: '烏野 (D01 起始)', cards: CARDS.filter(c => c.series.startsWith('D01')) },
    nekoma:   { label: '音駒 (D02 起始)', cards: CARDS.filter(c => c.series.startsWith('D02')) },
  };

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

  function draw(player, n) {
    for (let i = 0; i < n; i++) {
      if (player.deck.length === 0) break;
      player.hand.push(player.deck.shift());
    }
  }

  // ---------------------------------------------------------
  // 全域狀態
  // ---------------------------------------------------------
  const state = {
    stage: 'setup', // setup -> playing -> setEnd -> matchEnd
    players: {
      A: newPlayer('A', '玩家一'),
      B: newPlayer('B', '玩家二'),
    },
    serverKey: null,
    actingKey: null,
    phase: null, // SERVE_CHOOSE, RESPOND, RECEIVE_PLAY, BLOCK_PLAY, TOSS_PLAY, ATTACK_PLAY
    ball: null, // { points, fromKey, mustReceiveOnly }
    excludeName: { toss: null, attack: null },
    blockPicks: [], // 阻擋階段暫存已選卡
    setNumber: 1,
    log: [],
    matchWinner: null,
    lastSetLoser: null,
  };

  function newPlayer(key, label) {
    return {
      key, label,
      deckKey: key === 'A' ? 'karasuno' : 'nekoma',
      deck: [], hand: [], setZone: [], discard: [],
      zones: { serve: null, receive: null, block: null, toss: null, attack: null },
      setsWon: 0,
      mulliganUsed: false,
    };
  }

  function other(key) { return key === 'A' ? 'B' : 'A'; }

  function log(text, cls) {
    state.log.unshift({ text, cls: cls || '' });
    if (state.log.length > 60) state.log.pop();
  }

  // ---------------------------------------------------------
  // 開局準備
  // ---------------------------------------------------------
  function beginMatch() {
    ['A', 'B'].forEach(k => {
      const p = state.players[k];
      p.deck = buildDeck(p.deckKey);
      p.hand = [];
      p.setZone = [];
      p.discard = [];
      draw(p, START_HAND);
    });
    state.stage = 'presetup'; // 給重抽手牌 / 擲硬幣的畫面
    log('雙方已洗牌並抽 6 張起始手牌。可各自重抽一次，準備好後擲硬幣決定發球權。');
    render();
  }

  function mulligan(key) {
    const p = state.players[key];
    if (p.mulliganUsed) return;
    p.deck.push(...p.hand);
    p.hand = [];
    p.deck = shuffle(p.deck);
    draw(p, START_HAND);
    p.mulliganUsed = true;
    log(`${p.label} 重抽了起始手牌。`);
    render();
  }

  function coinFlip() {
    state.serverKey = Math.random() < 0.5 ? 'A' : 'B';
    log(`擲硬幣結果：${state.players[state.serverKey].label} 先發球。`);
    render();
  }

  // SET 區直接從牌組頂端拿 2 張蓋著放置，不經過手牌
  function confirmSetupCorrect() {
    ['A', 'B'].forEach(k => {
      const p = state.players[k];
      const taken = p.deck.splice(0, SET_ZONE_SIZE);
      p.setZone = taken;
    });
    state.stage = 'playing';
    startSet();
  }

  // ---------------------------------------------------------
  // 每一局(SET)
  // ---------------------------------------------------------
  function startSet() {
    ['A', 'B'].forEach(k => {
      const p = state.players[k];
      p.zones = { serve: null, receive: null, block: null, toss: null, attack: null };
    });
    state.ball = null;
    state.excludeName = { toss: null, attack: null };
    state.blockPicks = [];
    state.actingKey = state.serverKey;
    state.phase = 'SERVE_CHOOSE';
    log(`— 第 ${state.setNumber} 局開始，由 ${state.players[state.serverKey].label} 發球 —`, 'win');
    render();
  }

  function placeInZone(player, zoneName, card) {
    const cur = player.zones[zoneName];
    if (cur) card.pile = [cur, ...cur.pile];
    player.zones[zoneName] = card;
  }

  function removeFromHand(player, uid) {
    const idx = player.hand.findIndex(c => c.uid === uid);
    if (idx === -1) return null;
    return player.hand.splice(idx, 1)[0];
  }

  function playServe(uid, mod) {
    const p = state.players[state.actingKey];
    const card = p.hand.find(c => c.uid === uid);
    if (!card || card.stats.serve == null) return;
    removeFromHand(p, uid);
    placeInZone(p, 'serve', card);
    const pts = card.stats.serve + (mod || 0);
    card._finalVal = pts;
    state.ball = { points: pts, fromKey: p.key, mustReceiveOnly: true };
    log(`${p.label} 發球：〔${card.name}〕發球值 ${card.stats.serve}${mod ? `${mod > 0 ? '+' : ''}${mod}` : ''} → 進攻點數 ${pts}。`);
    state.actingKey = other(p.key);
    state.phase = 'RESPOND';
    render();
  }

  function chooseRespond(choice) {
    const p = state.players[state.actingKey];
    if (choice === 'block' && state.ball.mustReceiveOnly) return; // 不可選
    if (choice === 'receive') {
      draw(p, 1);
      log(`${p.label} 選擇接球，抽 1 張牌。`);
      state.phase = 'RECEIVE_PLAY';
    } else {
      state.blockPicks = [];
      state.phase = 'BLOCK_PLAY';
      log(`${p.label} 選擇阻擋。`);
    }
    render();
  }

  function playReceive(uid, mod) {
    const p = state.players[state.actingKey];
    const card = p.hand.find(c => c.uid === uid);
    if (!card || card.stats.receive == null) return;
    removeFromHand(p, uid);
    placeInZone(p, 'receive', card);
    const val = card.stats.receive + (mod || 0);
    card._finalVal = val;
    const need = state.ball.points;
    if (val >= need) {
      log(`${p.label} 接球：〔${card.name}〕接球值 ${val} ≥ 對方進攻點數 ${need}，接球成功。`, 'win');
      state.excludeName.toss = card.name;
      state.phase = 'TOSS_PLAY';
      render();
    } else {
      log(`${p.label} 接球：〔${card.name}〕接球值 ${val} ＜ 對方進攻點數 ${need}，接球失敗！宣告落球。`, 'lost');
      endSet(p.key);
    }
  }

  function toggleBlockPick(uid) {
    const p = state.players[state.actingKey];
    const card = p.hand.find(c => c.uid === uid);
    if (!card || card.stats.block == null) return;
    const idx = state.blockPicks.findIndex(c => c.uid === uid);
    if (idx > -1) { state.blockPicks.splice(idx, 1); render(); return; }
    if (state.blockPicks.length >= 3) return;
    if (state.blockPicks.length === 0) {
      state.blockPicks.push(card);
    } else {
      // 副攔不能跟主攔或其他副攔同名
      const names = state.blockPicks.map(c => c.name);
      if (names.includes(card.name)) return;
      state.blockPicks.push(card);
    }
    render();
  }

  function confirmBlock(mod) {
    const p = state.players[state.actingKey];
    if (state.blockPicks.length === 0) return;
    const [main, ...subs] = state.blockPicks;
    let total = 0;
    state.blockPicks.forEach(c => { total += c.stats.block; });
    total += (mod || 0);
    // 從手牌移除、放入場上
    state.blockPicks.forEach(c => removeFromHand(p, c.uid));
    placeInZone(p, 'block', main);
    main._finalVal = total;
    subs.forEach(c => p.discard.push(c)); // 副攔阻擋後丟棄
    const need = state.ball.points;
    const names = state.blockPicks.map(c => `〔${c.name}〕`).join('');
    if (total >= need) {
      log(`${p.label} 阻擋：${names} 合計阻擋值 ${total} ≥ 對方進攻點數 ${need}，阻擋成功，點數歸零回擊。`, 'win');
      const attackerKey = other(p.key);
      state.ball = { points: 0, fromKey: p.key, mustReceiveOnly: true };
      state.actingKey = attackerKey;
      state.phase = 'RESPOND';
      state.blockPicks = [];
      render();
    } else {
      log(`${p.label} 阻擋：${names} 合計阻擋值 ${total} ＜ 對方進攻點數 ${need}，阻擋失敗！宣告落球。`, 'lost');
      endSet(p.key);
    }
  }

  function playToss(uid, mod) {
    const p = state.players[state.actingKey];
    const card = p.hand.find(c => c.uid === uid);
    if (!card || card.stats.toss == null) return;
    if (state.excludeName.toss && card.name === state.excludeName.toss) return;
    removeFromHand(p, uid);
    placeInZone(p, 'toss', card);
    const val = card.stats.toss + (mod || 0);
    p.zones.toss._tossVal = val;
    log(`${p.label} 舉球：〔${card.name}〕舉球值 ${val}。`);
    state.excludeName.attack = card.name;
    state.phase = 'ATTACK_PLAY';
    render();
  }

  function playAttack(uid, mod) {
    const p = state.players[state.actingKey];
    const card = p.hand.find(c => c.uid === uid);
    if (!card || card.stats.attack == null) return;
    if (state.excludeName.attack && card.name === state.excludeName.attack) return;
    removeFromHand(p, uid);
    placeInZone(p, 'attack', card);
    const attackVal = card.stats.attack + (mod || 0);
    const tossVal = p.zones.toss._tossVal || 0;
    const pts = tossVal + attackVal;
    log(`${p.label} 攻擊：〔${card.name}〕攻擊值 ${attackVal} ＋ 舉球值 ${tossVal} → 進攻點數 ${pts}。`);
    state.ball = { points: pts, fromKey: p.key, mustReceiveOnly: false };
    state.actingKey = other(p.key);
    state.phase = 'RESPOND';
    render();
  }

  function declareLost() {
    const p = state.players[state.actingKey];
    log(`${p.label} 手牌無法應對，宣告落球。`, 'lost');
    endSet(p.key);
  }

  // ---------------------------------------------------------
  // 局末 / 賽末
  // ---------------------------------------------------------
  function endSet(loserKey) {
    const winnerKey = other(loserKey);
    const winner = state.players[winnerKey];
    winner.setsWon += 1;
    state.lastSetLoser = loserKey;

    ['A', 'B'].forEach(k => {
      const p = state.players[k];
      const z = p.zones;
      [z.serve, z.receive, z.block, z.toss, z.attack].forEach(c => {
        if (!c) return;
        p.discard.push(c, ...(c.pile || []));
      });
      p.zones = { serve: null, receive: null, block: null, toss: null, attack: null };
    });

    log(`— 第 ${state.setNumber} 局結束：${winner.label} 拿下這局（${state.players.A.label} ${state.players.A.setsWon} : ${state.players.B.setsWon} ${state.players.B.label}）—`, 'win');

    if (winner.setsWon >= SETS_TO_WIN) {
      state.stage = 'matchEnd';
      state.matchWinner = winnerKey;
      render();
      return;
    }
    state.stage = 'interval';
    render();
  }

  function proceedInterval() {
    ['A', 'B'].forEach(k => {
      const p = state.players[k];
      if (p.hand.length < START_HAND) draw(p, START_HAND - p.hand.length);
    });
    const loser = state.players[state.lastSetLoser];
    if (loser.setZone.length === 0) {
      // SET 區沒牌可拿 → 直接輸掉整場
      state.stage = 'matchEnd';
      state.matchWinner = other(state.lastSetLoser);
      log(`${loser.label} 的 SET 牌區已經沒有牌可以拿，直接判定輸掉整場比賽！`, 'lost');
      render();
      return;
    }
    const extra = loser.setZone.shift();
    loser.hand.push(extra);
    log(`${loser.label} 從 SET 牌區補 1 張，手牌來到 ${loser.hand.length} 張；${state.players[other(state.lastSetLoser)].label} 維持 ${state.players[other(state.lastSetLoser)].hand.length} 張。`);
    state.serverKey = other(state.lastSetLoser);
    state.setNumber += 1;
    state.stage = 'playing';
    startSet();
  }

  function restartAll() {
    uidSeed = 1;
    state.stage = 'setup';
    state.players = { A: newPlayer('A', '玩家一'), B: newPlayer('B', '玩家二') };
    state.serverKey = null; state.actingKey = null; state.phase = null;
    state.ball = null; state.setNumber = 1; state.log = []; state.matchWinner = null;
    render();
  }

  // ---------------------------------------------------------
  // 渲染
  // ---------------------------------------------------------
  function statPillsForHandCard(c) {
    return Object.keys(STAT_LABEL).map(k => {
      const v = c.stats ? c.stats[k] : null;
      if (v == null) return '';
      return `<span style="margin-right:10px;"><b class="handcard__stat" style="font-size:14px;">${v}</b><span class="handcard__statlabel"> ${STAT_LABEL[k]}</span></span>`;
    }).join('');
  }

  function handCardHTML(c, opts) {
    opts = opts || {};
    const disabled = opts.disabled ? 'disabled' : '';
    const selected = opts.selected ? 'selected' : '';
    return `
    <div class="handcard ${disabled} ${selected}" data-uid="${c.uid}" onclick="${disabled ? '' : opts.onclick}">
      <div class="handcard__name">${c.name} <span style="color:var(--chalk-dim);font-weight:400;font-size:11px;">${c.type === 'event' ? '(事件卡)' : ''}</span></div>
      <div>${c.type === 'character' ? statPillsForHandCard(c) : ''}</div>
      <div class="handcard__toggle" onclick="event.stopPropagation();this.parentElement.classList.toggle('expanded')">技能／效果 ▾</div>
      <div class="handcard__skill">${c.skill}</div>
    </div>`;
  }

  function valOf(card, statKey) {
    return card._finalVal != null ? card._finalVal : card.stats[statKey];
  }

  function zoneHTML(label, card, extraVal) {
    if (!card) {
      return `<div class="zone"><div class="zone__label">${label}</div><div class="zone__empty">—</div></div>`;
    }
    const pileNote = card.pile && card.pile.length ? `<div class="zone__pile">下方資源 ${card.pile.length} 張</div>` : '';
    return `<div class="zone has-card">
      <div class="zone__label">${label}</div>
      <div class="zone__card">${card.name}</div>
      ${extraVal != null ? `<div class="zone__val">${extraVal}</div>` : ''}
      ${pileNote}
    </div>`;
  }

  function panelHTML(key) {
    const p = state.players[key];
    const acting = state.stage === 'playing' && state.actingKey === key;
    const z = p.zones;
    return `
    <div class="bracket panel ${acting ? 'panel--acting' : ''}">
      <div class="panel__head">
        <div class="panel__name">${p.label} ${acting ? '<span class="tag">行動中</span>' : ''}</div>
        <div class="panel__meta">
          <span>牌組 <b>${p.deck.length}</b></span>
          <span>手牌 <b>${p.hand.length}</b></span>
          <span>SET區 <b>${p.setZone.length}</b></span>
          <span>棄牌 <b>${p.discard.length}</b></span>
          <span>局數 <b style="color:var(--score);">${p.setsWon}</b></span>
        </div>
      </div>
      <div class="zonerow">
        ${zoneHTML('發球', z.serve, z.serve ? valOf(z.serve, 'serve') : null)}
        ${zoneHTML('接球', z.receive, z.receive ? valOf(z.receive, 'receive') : null)}
        ${zoneHTML('阻擋(合計)', z.block, z.block ? valOf(z.block, 'block') : null)}
        ${zoneHTML('舉球', z.toss, z.toss ? (z.toss._tossVal != null ? z.toss._tossVal : z.toss.stats.toss) : null)}
        ${zoneHTML('攻擊', z.attack, z.attack ? z.attack.stats.attack : null)}
      </div>
    </div>`;
  }

  function ballBarHTML() {
    if (!state.ball) return '';
    const from = state.players[state.ball.fromKey].label;
    return `<div class="bracket ballbar">
      <span>目前來球：由 <b>${from}</b> 這邊打過來</span>
      <span>進攻點數 <b>${state.ball.points}</b>${state.ball.mustReceiveOnly ? '　(這球只能接球，不能阻擋)' : ''}</span>
    </div>`;
  }

  function actionZoneHTML() {
    const p = state.players[state.actingKey];
    if (!p) return '';

    if (state.phase === 'SERVE_CHOOSE') {
      const valid = p.hand.filter(c => c.type === 'character' && c.stats.serve != null);
      return actionWrap('發球階段 — 選一張角色卡發球（不抽牌）', valid, p, 'serve',
        (uid) => `handleServe('${uid}')`, valid.length === 0);
    }

    if (state.phase === 'RESPOND') {
      const canBlock = !state.ball.mustReceiveOnly;
      return `
      <div class="bracket actionzone">
        <div class="actionzone__title">應對階段 — ${p.label} 選擇接球或阻擋</div>
        <div class="btnrow-wrap">
          <button class="mini-btn mini-btn--primary" onclick="handleRespond('receive')">接球（先抽1張）</button>
          <button class="mini-btn" ${canBlock ? '' : 'disabled'} onclick="handleRespond('block')">阻擋${canBlock ? '' : '（這球不可阻擋）'}</button>
          <button class="mini-btn mini-btn--danger" onclick="handleDeclareLost()">直接宣告落球</button>
        </div>
      </div>`;
    }

    if (state.phase === 'RECEIVE_PLAY') {
      const valid = p.hand.filter(c => c.type === 'character' && c.stats.receive != null);
      return actionWrap(`接球階段 — 需要接球值 ≥ ${state.ball.points}`, valid, p, 'receive',
        (uid) => `handleReceive('${uid}')`, valid.length === 0, true);
    }

    if (state.phase === 'BLOCK_PLAY') {
      const valid = p.hand.filter(c => c.type === 'character' && c.stats.block != null);
      const picks = state.blockPicks;
      const total = picks.reduce((s, c) => s + c.stats.block, 0);
      return `
      <div class="bracket actionzone">
        <div class="actionzone__title">阻擋階段 — 需要合計阻擋值 ≥ ${state.ball.points}（先選主攔，最多再加2名副攔，同名不可重複）</div>
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

    if (state.phase === 'TOSS_PLAY') {
      const valid = p.hand.filter(c => c.type === 'character' && c.stats.toss != null && c.name !== state.excludeName.toss);
      return actionWrap(`舉球階段 — 不能跟接球區同名角色（${state.excludeName.toss || '—'}）`, valid, p, 'toss',
        (uid) => `handleToss('${uid}')`, valid.length === 0);
    }

    if (state.phase === 'ATTACK_PLAY') {
      const valid = p.hand.filter(c => c.type === 'character' && c.stats.attack != null && c.name !== state.excludeName.attack);
      return actionWrap(`攻擊階段 — 不能跟舉球區同名角色（${state.excludeName.attack || '—'}）`, valid, p, 'attack',
        (uid) => `handleAttack('${uid}')`, valid.length === 0);
    }

    return '';
  }

  function modRow() {
    return `<div class="modrow">
      技能手動加減值（展開手牌卡片看技能文字，自己判斷是否符合條件）：
      <input type="number" id="modInput" value="0" step="1">
    </div>`;
  }

  function actionWrap(title, cards, player, statKey, onclickFn, empty, showMod) {
    return `
    <div class="bracket actionzone">
      <div class="actionzone__title">${title}</div>
      <div class="handgrid">
        ${cards.map(c => handCardHTML(c, { onclick: onclickFn(c.uid) })).join('') ||
          '<div class="zone__empty">手上沒有符合條件的角色卡</div>'}
      </div>
      ${showMod === false ? '' : modRow()}
      <div class="btnrow-wrap">
        <button class="mini-btn mini-btn--danger" onclick="handleDeclareLost()">${empty ? '無牌可出，宣告落球' : '放棄，宣告落球'}</button>
      </div>
    </div>`;
  }

  function logHTML() {
    return `<div class="bracket logpanel">
      <div class="logpanel__title">對戰紀錄</div>
      ${state.log.map(l => `<div class="logline ${l.cls}">${l.text}</div>`).join('')}
    </div>`;
  }

  function render() {
    if (state.stage === 'setup') {
      app.innerHTML = `
      <div class="setup-grid">
        <div class="bracket setup-card">
          <h3>玩家一牌組</h3>
          <div class="setup-row">
            <label>選擇起始套牌</label>
            <select id="deckA" onchange="setDeck('A', this.value)">
              ${Object.keys(POOLS).map(k => `<option value="${k}" ${state.players.A.deckKey === k ? 'selected' : ''}>${POOLS[k].label}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="bracket setup-card">
          <h3>玩家二牌組</h3>
          <div class="setup-row">
            <label>選擇起始套牌</label>
            <select id="deckB" onchange="setDeck('B', this.value)">
              ${Object.keys(POOLS).map(k => `<option value="${k}" ${state.players.B.deckKey === k ? 'selected' : ''}>${POOLS[k].label}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
      <div class="bracket setup-card">
        <p class="setup-note">
          目前卡牌資料庫每套起始牌只收錄 5～7 種角色／事件（正式牌組應為40張），
          這裡先把每張複製 ${COPIES_PER_CARD} 份湊成測試用牌組方便跑流程，之後把完整40張資料補進 <code>data/cards.js</code> 就會自動變成正式牌量。
        </p>
        <button class="mini-btn mini-btn--primary" onclick="handleBeginMatch()">洗牌並開始準備</button>
      </div>`;
      return;
    }

    if (state.stage === 'presetup') {
      app.innerHTML = `
      <div class="setup-grid">
        ${['A', 'B'].map(k => {
          const p = state.players[k];
          return `<div class="bracket setup-card">
            <h3>${p.label}（${POOLS[p.deckKey].label}）</h3>
            <div class="handgrid">${p.hand.map(c => handCardHTML(c, { onclick: '' })).join('')}</div>
            <div class="btnrow-wrap">
              <button class="mini-btn" ${p.mulliganUsed ? 'disabled' : ''} onclick="handleMulligan('${k}')">${p.mulliganUsed ? '已重抽過' : '重抽起始手牌(限一次)'}</button>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div class="bracket setup-card">
        <div class="btnrow-wrap">
          <button class="mini-btn mini-btn--primary" onclick="handleCoinFlip()">${state.serverKey ? `已決定：${state.players[state.serverKey].label} 先發球（可重擲）` : '擲硬幣決定發球權'}</button>
          <button class="mini-btn mini-btn--primary" ${state.serverKey ? '' : 'disabled'} onclick="handleConfirmSetup()">確認完成，開始對戰</button>
        </div>
      </div>
      ${logHTML()}`;
      return;
    }

    if (state.stage === 'playing') {
      app.innerHTML = `
      <div class="bracket matchbar">
        <div class="matchbar__score">${state.players.A.label} <b>${state.players.A.setsWon}</b> <span class="vs">SET</span> <b>${state.players.B.setsWon}</b> ${state.players.B.label}</div>
        <div class="matchbar__phase">第 ${state.setNumber} 局<small>目前行動：${state.players[state.actingKey].label}</small></div>
      </div>
      <div class="board">
        ${panelHTML('B')}
        ${ballBarHTML()}
        ${panelHTML('A')}
      </div>
      ${actionZoneHTML()}
      ${logHTML()}`;
      return;
    }

    if (state.stage === 'interval') {
      const loser = state.players[state.lastSetLoser];
      app.innerHTML = `
      <div class="bracket resultcard">
        <h2>局末休息</h2>
        <p>雙方手牌補到 6 張；${loser.label} 是這局輸家，再從 SET 牌區補 1 張（共 7 張）。下一局由贏家發球。</p>
        <button class="mini-btn mini-btn--primary" onclick="handleProceedInterval()">執行補牌，進入下一局</button>
      </div>
      ${logHTML()}`;
      return;
    }

    if (state.stage === 'matchEnd') {
      const w = state.players[state.matchWinner];
      app.innerHTML = `
      <div class="bracket resultcard">
        <h2>${w.label} 獲勝！</h2>
        <p>最終比數　${state.players.A.label} ${state.players.A.setsWon} : ${state.players.B.setsWon} ${state.players.B.label}</p>
        <button class="mini-btn mini-btn--primary" onclick="handleRestart()">重新開始一場</button>
      </div>
      ${logHTML()}`;
      return;
    }
  }

  // ---------------------------------------------------------
  // 事件處理（掛在 window 給 inline onclick 用）
  // ---------------------------------------------------------
  function currentMod() {
    const el = document.getElementById('modInput');
    return el ? (parseInt(el.value, 10) || 0) : 0;
  }

  window.setDeck = function (key, val) { state.players[key].deckKey = val; };
  window.handleBeginMatch = function () { beginMatch(); };
  window.handleMulligan = function (key) { mulligan(key); };
  window.handleCoinFlip = function () { coinFlip(); };
  window.handleConfirmSetup = function () { confirmSetupCorrect(); };
  window.handleServe = function (uid) { playServe(uid, currentMod()); };
  window.handleRespond = function (choice) { chooseRespond(choice); };
  window.handleReceive = function (uid) { playReceive(uid, currentMod()); };
  window.handleToggleBlock = function (uid) { toggleBlockPick(uid); };
  window.handleConfirmBlock = function () { confirmBlock(currentMod()); };
  window.handleToss = function (uid) { playToss(uid, currentMod()); };
  window.handleAttack = function (uid) { playAttack(uid, currentMod()); };
  window.handleDeclareLost = function () { declareLost(); };
  window.handleProceedInterval = function () { proceedInterval(); };
  window.handleRestart = function () { restartAll(); };

  render();
})();
