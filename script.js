// ---------- 導覽列手機版切換 ----------
(function () {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (toggle && links) {
        toggle.addEventListener('click', () => links.classList.toggle('open'));
    }
})();

// ---------- 卡牌資料庫 ----------
(function () {
    const grid = document.getElementById('grid');
    if (!grid || typeof CARDS === 'undefined') return;

    const empty = document.getElementById('empty');
    const qInput = document.getElementById('q');
    const fType = document.getElementById('fType');
    const fSeries = document.getElementById('fSeries');
    const fSchool = document.getElementById('fTeam'); // 下拉選單id沿用fTeam,但改用school欄位動態切出學校名稱

    // 從 "烏野・1年" 這種字串裡切出「烏野」——不新增欄位,直接從既有 school 動態取值
    function schoolOf(c) {
        if (!c.school) return null;       // 事件卡沒有 school,篩選時會被排除
        return c.school.split('・')[0];
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

    function statPill(label, val) {
        if (val === null || val === undefined) return '';
        return `<span><b>${val}</b>${label}</span>`;
    }

    function cardHTML(c) {
        const typeLabel = c.type === 'character' ? '角色卡' : '事件卡';
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
            metaLine = `登場區域：${c.zone}　｜　${c.school || ''}`;
        } else {
            metaLine = `類型：${c.category}`;
        }

        return `
      <div class="bracket ccard" data-name="${c.name}" data-code="${c.code}" data-skill="${c.skill}">
        <div class="ccard__top">
          <span class="ccard__code" title="點擊複製" onclick="navigator.clipboard&&navigator.clipboard.writeText('${c.code}')">${c.code}</span>
          <span class="ccard__rarity">${c.rarity}</span>
        </div>
        <h3>${c.name}</h3>
        <div class="ccard__type">${typeLabel} ／ ${c.series}</div>
        ${statsHTML}
        <div class="ccard__skill">
          <div style="margin-bottom:6px;color:var(--chalk-dim);font-family:var(--mono);font-size:11px;">${metaLine}</div>
          <b>技能：</b>${c.skill}
        </div>
      </div>`;
    }

    function render() {
        const q = qInput.value.trim().toLowerCase();
        const t = fType.value;
        const s = fSeries.value;
        const sc = fSchool.value;

        const filtered = CARDS.filter(c => {
            if (t && c.type !== t) return false;
            if (s && c.series !== s) return false;
            if (sc && schoolOf(c) !== sc) return false;
            if (q) {
                const hay = (c.name + c.code + c.skill + (c.school || '')).toLowerCase();
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

    render();
})();