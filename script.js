// 導覽列漢堡選單邏輯已搬到全站共用的 nav.js，這支只留 cards.html 專用的資料庫邏輯。

// ---------- 卡牌資料庫 ----------
(function () {
    const grid = document.getElementById('grid');
    if (!grid || typeof CARDS === 'undefined') return;

    const empty = document.getElementById('empty');
    const qInput = document.getElementById('q');
    const fType = document.getElementById('fType');
    const fSeries = document.getElementById('fSeries');
    const fSchool = document.getElementById('fTeam'); // 下拉選單id沿用fTeam,但改用school欄位動態切出學校名稱

    // 從 school 字串切出「主學校」——不新增欄位,直接從既有 school 動態取值。
    //   "烏野・1年"            → 烏野
    //   "烏野／疑似ユース・1年" → 烏野   （疑似ユース／ユース 是選拔隊分組,不是學校,砍掉）
    function schoolOf(c) {
        if (!c.school) return null;       // 事件卡多半沒有 school,篩選時會被排除
        return c.school.split('・')[0].split('／')[0];
    }

    // 系列下拉選單動態產生
    const seriesSet = [...new Set(CARDS.map(c => c.series))];
    seriesSet.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s; opt.textContent = s;
        fSeries.appendChild(opt);
    });

    // 學校下拉選單動態產生(從 school 切出來,只有角色卡會有值)
    const schoolSet = [...new Set(CARDS.map(schoolOf).filter(Boolean))];
    schoolSet.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s; opt.textContent = s;
        fSchool.appendChild(opt);
    });

    // 卡片文字直接塞進 HTML 屬性/內容前先跳脫，避免哪天技能文字裡出現
    // 引號或角括號時把卡片排版弄壞（目前資料裡沒有這些字元，純防呆）。
    function esc(str) {
        return String(str == null ? '' : str).replace(/[&<>"']/g, ch => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[ch]));
    }

    function statPill(label, val) {
        if (val === null || val === undefined) return '';
        return `<span><b>${val}</b>${label}</span>`;
    }

    // rarity 在 data 裡存原始代碼，這裡轉成中文顯示（見 data/cards.js 檔頭說明）
    const RARITY_LABEL = { H: '秘', I: '頂', IP: '頂P', K: '極', KP: '極P', Deck: '起始' };
    function rarityLabel(r) { return RARITY_LABEL[r] || r; }

    // 稀有度收斂成 6 個基本階，只用來決定卡框配色（跟原本抽卡包頁的配色邏輯一致），
    // 跟中文顯示（rarityLabel）分開算，平行版（NP/RP/SP/RA/IP/KP）都歸邊配色。
    const RARITY_TIER = { H: '秘', I: '頂', IP: '頂', K: '極', KP: '極', NP: 'N', RP: 'R', SP: 'S', RA: 'R' };
    function tierOf(r) { return RARITY_TIER[r] || r; }

    // 同一張卡的平行版（同 code 同 rarity，例如王牌的 DP 版）在純文字資料庫裡
    // 只需顯示一次，用角標註明；「兩個稀有度」才會是兩筆、照樣各顯示一張。
    function dedupeVariants(list) {
        const out = [];
        const seen = new Map();
        list.forEach(c => {
            const key = c.code + '|' + c.rarity;
            if (seen.has(key)) {
                const kept = seen.get(key);
                kept._variants = kept._variants || [];
                if (c.variant) kept._variants.push(c.variant);
                return;
            }
            const copy = Object.assign({}, c);
            if (c.variant) copy._variants = [c.variant];
            seen.set(key, copy);
            out.push(copy);
        });
        return out;
    }

    function cardHTML(c) {
        const typeLabel = c.type === 'character' ? '角色卡' : '事件卡';
        const tier = tierOf(c.rarity) || 'N';
        let statsHTML = '';
        let metaLine = '';

        if (c.type === 'character') {
            statsHTML = `
        <div class="statsrow">
          ${statPill('發球', c.stats.serve)}
          ${statPill('阻擋', c.stats.block)}
          ${statPill('接球', c.stats.receive)}
          ${statPill('舉球', c.stats.toss)}
          ${statPill('攻擊', c.stats.attack)}
        </div>`;
            metaLine = `${esc(c.zone) || '無登場區域'}　｜　${esc(c.school) || ''}`;
        } else {
            metaLine = `類型：${esc(c.category)}`;
        }

        const rarityText = esc(rarityLabel(c.rarity)) + (c._variants && c._variants.length ? ` ＋${esc(c._variants.join('／'))}` : '');
        const imgHTML = c.image
            ? `<img class="ccard__img" src="${c.image}" alt="${esc(c.name)}" loading="lazy" data-fullimg="${c.image}" data-fullname="${esc(c.name)}（${rarityText}）">`
            : `<div class="ccard__noimg">${esc(c.name ? c.name[0] : '?')}</div>`;

        return `
      <div class="bracket ccard ccard--${tier}">
        <div class="ccard__imgwrap ${c.image ? 'zoomable' : ''}">
          ${imgHTML}
          <span class="ccard__raritybadge">${rarityText}</span>
        </div>
        <div class="ccard__body">
          <div class="ccard__top">
            <span class="ccard__code" title="點擊複製卡號" onclick="navigator.clipboard&&navigator.clipboard.writeText('${esc(c.code)}')">${esc(c.code)}</span>
            <span class="ccard__type">${typeLabel} ／ ${esc(c.series)}</span>
          </div>
          <h3>${esc(c.name)}</h3>
          <div class="ccard__meta">${metaLine}</div>
          ${statsHTML}
          <div class="ccard__skill"><b>技能：</b>${esc(c.skill)}</div>
        </div>
      </div>`;
    }

    function render() {
        const q = qInput.value.trim().toLowerCase();
        const t = fType.value;
        const s = fSeries.value;
        const sc = fSchool.value;

        const filtered = dedupeVariants(CARDS).filter(c => {
            if (t && c.type !== t) return false;
            if (s && c.series !== s) return false;
            if (sc && schoolOf(c) !== sc) return false;
            if (q) {
                const hay = (c.name + c.code + c.skill + (c.school || '') + rarityLabel(c.rarity)).toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });

        grid.innerHTML = filtered.map(cardHTML).join('');
        empty.style.display = filtered.length ? 'none' : 'block';
    }

    qInput.addEventListener('input', render);
    fType.addEventListener('change', render);
    fSeries.addEventListener('change', render);
    fSchool.addEventListener('change', render);

    // ---- 點卡面放大看圖 ----
    function openLightbox(src, name) {
        const box = document.createElement('div');
        box.className = 'imglightbox';
        box.innerHTML = `<img src="${src}" alt="${esc(name)}"><div class="imglightbox__name">${esc(name)}</div><button class="imglightbox__close" aria-label="關閉">✕</button>`;
        box.addEventListener('click', () => box.remove());
        document.addEventListener('keydown', function onKey(e) {
            if (e.key === 'Escape') { box.remove(); document.removeEventListener('keydown', onKey); }
        });
        document.body.appendChild(box);
    }
    grid.addEventListener('click', e => {
        const el = e.target.closest('.ccard__img[data-fullimg]');
        if (!el) return;
        openLightbox(el.dataset.fullimg, el.dataset.fullname || '');
    });

    render();
})();
