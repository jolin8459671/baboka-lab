// 排球少年 TCG 卡牌資料庫 —— 純文字整理,無官方圖片
// rarity 標示為「未確認」代表尚未從實體卡片上清楚辨識稀有度標記
// rarity 為 Deck 指該卡是「起始套牌(スターターデッキ)專屬收錄卡」
// H:秘, I:頂, IP:頂P, K:極, KP:極P

const CARDS = [
    // #region D01 起始（共 14 張）
    {
        code: "HV-D01-001", name: "日向翔陽", type: "character", series: "D01 起始",
        rarity: "Deck", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 2, block: 2, receive: 2, toss: 0, attack: 2 },
        zone: "攻擊區域", copies: 3,
        skill: "支付2點資源(犧牲下方2張卡),攻擊點數 +2(2→4)。",
        image: "assets/cards/HV-D01-001.webp"
    },
    {
        code: "HV-D01-001", name: "日向翔陽", type: "character", series: "D01 起始", variant: "DP",
        rarity: "Deck", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 2, block: 2, receive: 2, toss: 0, attack: 2 },
        zone: "攻擊區域", copies: 1,
        skill: "支付2點資源(犧牲下方2張卡),攻擊點數 +2(2→4)。",
        image: "assets/cards/HV-D01-001-DP.webp"
    },
    {
        code: "HV-D01-002", name: "影山飛雄", type: "character", series: "D01 起始",
        rarity: "Deck", position: "セッター", school: "烏野・1年",
        stats: { serve: 1, block: 1, receive: 2, toss: 1, attack: 1 },
        zone: "舉球區域", copies: 3,
        skill: "支付2點資源(犧牲下方2張卡),舉球點數 +2(1→3)。",
        image: "assets/cards/HV-D01-002.webp"
    },
    {
        code: "HV-D01-002", name: "影山飛雄", type: "character", series: "D01 起始", variant: "DP",
        rarity: "Deck", position: "セッター", school: "烏野・1年",
        stats: { serve: 1, block: 1, receive: 2, toss: 1, attack: 1 },
        zone: "舉球區域", copies: 1,
        skill: "支付2點資源(犧牲下方2張卡),舉球點數 +2(1→3)。",
        image: "assets/cards/HV-D01-002-DP.webp"
    },
    {
        code: "HV-D01-003", name: "月島螢", type: "character", series: "D01 起始",
        rarity: "Deck", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 1, block: 3, receive: 1, toss: 0, attack: 2 },
        zone: "阻擋區域", copies: 2,
        skill: "若對方進攻點數≤4,支付1點資源,抽1張卡。",
        image: "assets/cards/HV-D01-003.webp"
    },
    {
        code: "HV-D01-004", name: "山口忠", type: "character", series: "D01 起始",
        rarity: "Deck", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 5, block: 3, receive: 3, toss: 0, attack: 1 },
        zone: "阻擋區域", copies: 2,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D01-004.webp"
    },
    {
        code: "HV-D01-005", name: "西谷夕", type: "character", series: "D01 起始",
        rarity: "Deck", position: "リベロ", school: "烏野・2年",
        stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域", copies: 2,
        skill: "支付3點資源(犧牲下方3張卡),抽1張卡,並讓接球點數 +2(5→7)。",
        image: "assets/cards/HV-D01-005.webp"
    },
    {
        code: "HV-D01-006", name: "田中龍之介", type: "character", series: "D01 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "烏野・2年",
        stats: { serve: 1, block: 2, receive: 2, toss: 1, attack: 3 },
        zone: "攻擊區域", copies: 4,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D01-006.webp"
    },
    {
        code: "HV-D01-007", name: "緣下力", type: "character", series: "D01 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "烏野・2年",
        stats: { serve: 2, block: 1, receive: 2, toss: 0, attack: 3 },
        zone: "接球區域", copies: 2,
        skill: "丟棄1張手牌,接球點數 +3(2→5)。",
        image: "assets/cards/HV-D01-007.webp"
    },
    {
        code: "HV-D01-008", name: "澤村大地", type: "character", series: "D01 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "烏野・3年",
        stats: { serve: 3, block: 1, receive: 5, toss: 0, attack: 2 },
        zone: "接球區域", copies: 4,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D01-008.webp"
    },
    {
        code: "HV-D01-009", name: "菅原孝支", type: "character", series: "D01 起始",
        rarity: "Deck", position: "セッター", school: "烏野・3年",
        stats: { serve: 1, block: 1, receive: 2, toss: 2, attack: 3 },
        zone: "攻擊區域", copies: 4,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D01-009.webp"
    },
    {
        code: "HV-D01-010", name: "東峰旭", type: "character", series: "D01 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "烏野・3年",
        stats: { serve: 2, block: 2, receive: 4, toss: 0, attack: 3 },
        zone: "攻擊區域", copies: 4,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D01-010.webp"
    },
    {
        code: "HV-D01-011", name: "排球是!!!永遠向上仰望的運動", type: "event", series: "D01 起始",
        rarity: "Deck", category: "接球類", copies: 4,
        skill: "抽1張卡;選自己場上1名角色,接球點數 +1;若該角色接球點數≤4,再額外 +1(最多+2)。",
        image: "assets/cards/HV-D01-011.webp"
    },
    {
        code: "HV-D01-012", name: "Broad攻擊（快速平行攻擊）", type: "event", series: "D01 起始",
        rarity: "Deck", category: "攻擊類", copies: 4,
        skill: "抽1張卡,自己場上1名烏野角色攻擊點數 +1。組合技：若舉球角色為〔影山飛雄〕、攻擊角色為〔日向翔陽〕,下一個對手回合,對手最多只能登場1名阻擋角色。",
        image: "assets/cards/HV-D01-012.webp"
    },
    // #endregion D01 起始

    // #region D02 起始（共 14 張）
    {
        code: "HV-D02-001", name: "孤爪研磨", type: "character", series: "D02 起始",
        rarity: "Deck", position: "セッター", school: "音駒・2年",
        stats: { serve: 1, block: 2, receive: 1, toss: 1, attack: 0 },
        zone: "舉球區域", copies: 3,
        skill: "支付2點資源(犧牲下方2張卡),舉球點數 +1,並讓下一個對手回合中,對手每有1名攻擊角色登場,就使該角色攻擊點數 -2。",
        image: "assets/cards/HV-D02-001.webp"
    },
    {
        code: "HV-D02-001", name: "孤爪研磨", type: "character", series: "D02 起始", variant: "DP",
        rarity: "Deck", position: "セッター", school: "音駒・2年",
        stats: { serve: 1, block: 2, receive: 1, toss: 1, attack: 0 },
        zone: "舉球區域", copies: 1,
        skill: "支付2點資源(犧牲下方2張卡),舉球點數 +1,並讓下一個對手回合中,對手每有1名攻擊角色登場,就使該角色攻擊點數 -2。",
        image: "assets/cards/HV-D02-001-DP.webp"
    },
    {
        code: "HV-D02-002", name: "黑尾鐵朗", type: "character", series: "D02 起始",
        rarity: "Deck", position: "ミドルブロッカー", school: "音駒・3年",
        stats: { serve: 1, block: 3, receive: 1, toss: 0, attack: 2 },
        zone: "阻擋區域", copies: 3,
        skill: "支付1點資源(犧牲下方1張卡),發動後：這回合內只要阻擋成功，就會觸發關鍵字「絕殺鎖定5」——這回合結束時，自己的進攻點數會被強制設定為 5（不論原本疊加到多少）。",
        image: "assets/cards/HV-D02-002.webp"
    },
    {
        code: "HV-D02-002", name: "黑尾鐵朗", type: "character", series: "D02 起始", variant: "DP",
        rarity: "Deck", position: "ミドルブロッカー", school: "音駒・3年",
        stats: { serve: 1, block: 3, receive: 1, toss: 0, attack: 2 },
        zone: "阻擋區域", copies: 1,
        skill: "支付1點資源(犧牲下方1張卡),發動後：這回合內只要阻擋成功，就會觸發關鍵字「絕殺鎖定5」——這回合結束時，自己的進攻點數會被強制設定為 5（不論原本疊加到多少）。",
        image: "assets/cards/HV-D02-002-DP.webp"
    },
    {
        code: "HV-D02-003", name: "夜久衛輔", type: "character", series: "D02 起始",
        rarity: "Deck", position: "リベロ", school: "音駒・3年",
        stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域", copies: 2,
        skill: "丟棄1張手牌(不是犧牲下方的資源卡),接球點數 +2(5→7)。",
        image: "assets/cards/HV-D02-003.webp"
    },
    {
        code: "HV-D02-004", name: "灰羽利耶夫", type: "character", series: "D02 起始",
        rarity: "Deck", position: "ミドルブロッカー", school: "音駒・1年",
        stats: { serve: 1, block: 2, receive: 1, toss: 0, attack: 3 },
        zone: "攻擊區域（特殊：可在下方條件成立時額外加入阻擋區）", copies: 4,
        skill: "自己場上有阻擋角色登場時，如果這張卡本身是本次的攻擊角色，可以支付2點資源，讓這張卡「同時」以副攔身份登場到阻擋區。若自己阻擋區已經有另一張灰羽利耶夫，或阻擋區已滿3人，則不能這樣登場。",
        image: "assets/cards/HV-D02-004.webp"
    },
    {
        code: "HV-D02-005", name: "海信行", type: "character", series: "D02 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "音駒・3年",
        stats: { serve: 1, block: 2, receive: 5, toss: 0, attack: 2 },
        zone: "接球區域", copies: 2,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D02-005.webp"
    },
    {
        code: "HV-D02-006", name: "山本猛虎", type: "character", series: "D02 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "音駒・2年",
        stats: { serve: 5, block: 2, receive: 2, toss: 0, attack: 3 },
        zone: "攻擊區域", copies: 4,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D02-006.webp"
    },
    {
        code: "HV-D02-007", name: "福永招平", type: "character", series: "D02 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "音駒・2年",
        stats: { serve: 1, block: 0, receive: 4, toss: 1, attack: 3 },
        zone: "接球區域", copies: 4,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D02-007.webp"
    },
    {
        code: "HV-D02-008", name: "犬岡走", type: "character", series: "D02 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "音駒・1年",
        stats: { serve: 2, block: 3, receive: 3, toss: 0, attack: 3 },
        zone: "攻擊區域", copies: 4,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D02-008.webp"
    },
    {
        code: "HV-D02-009", name: "芝山優生", type: "character", series: "D02 起始",
        rarity: "Deck", position: "リベロ", school: "音駒・1年",
        stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域", copies: 2,
        skill: "支付2點資源(犧牲下方2張卡),抽1張卡。",
        image: "assets/cards/HV-D02-009.webp"
    },
    {
        code: "HV-D02-010", name: "手白球彦", type: "character", series: "D02 起始",
        rarity: "Deck", position: "セッター", school: "音駒・1年",
        stats: { serve: 4, block: 1, receive: 4, toss: 1, attack: 0 },
        zone: "舉球區域", copies: 2,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D02-010.webp"
    },
    {
        code: "HV-D02-011", name: "不是說了手要往前伸嗎，信勝君", type: "event", series: "D02 起始",
        rarity: "Deck", category: "阻擋／接球", copies: 4,
        skill: "抽1張卡；以下擇一使用：①自己場上的阻擋角色〔黑尾鐵朗〕1人，阻擋點數 +1　②自己場上1名角色，接球點數 +1。",
        image: "assets/cards/HV-D02-011.webp"
    },
    {
        code: "HV-D02-012", name: "用物理攻擊揍下去就好了吧", type: "event", series: "D02 起始",
        rarity: "Deck", category: "抽牌類", copies: 4,
        skill: "抽1張卡。接著看自己牌組最上面3張，從中選〔灰羽利耶夫〕或〔犬岡走〕最多1張公開加入手牌，沒被選中的卡以任意順序放回牌組最下面。",
        image: "assets/cards/HV-D02-012.webp"
    },
    // #endregion D02 起始

    // #region D03 起始（共 14 張）
    {
        code: "HV-D03-001", name: "宮侑", type: "character", series: "D03 起始",
        rarity: "Deck", position: "セッター", school: "稻荷崎・2年",
        stats: { serve: 2, block: 2, receive: 0, toss: 1, attack: 0 },
        zone: "舉球區域", copies: 2,
        skill: "支付2點資源(犧牲下方2張卡)，舉球點數 +1(1→2)，並從自己事件區把〔今天要做什麼？〕最多1張加入手牌；若有加入，從手牌選1張卡放到牌組最下面。",
        image: "assets/cards/HV-D03-001.webp"
    },
    {
        code: "HV-D03-001", name: "宮侑", type: "character", series: "D03 起始", variant: "DP",
        rarity: "Deck", position: "セッター", school: "稻荷崎・2年",
        stats: { serve: 2, block: 2, receive: 0, toss: 1, attack: 0 },
        zone: "舉球區域", copies: 1,
        skill: "支付2點資源(犧牲下方2張卡)，舉球點數 +1(1→2)，並從自己事件區把〔今天要做什麼？〕最多1張加入手牌；若有加入，從手牌選1張卡放到牌組最下面。",
        image: "assets/cards/HV-D03-001-DP.webp"
    },
    {
        code: "HV-D03-002", name: "宮治", type: "character", series: "D03 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "稻荷崎・2年",
        stats: { serve: 1, block: 1, receive: 1, toss: 1, attack: 2 },
        zone: "攻擊區域", copies: 2,
        skill: "若自己的舉球角色是〔宮侑〕,可從手牌選1張卡放到牌組最下面,攻擊點數 +2。",
        image: "assets/cards/HV-D03-002.webp"
    },
    {
        code: "HV-D03-002", name: "宮治", type: "character", series: "D03 起始", variant: "DP",
        rarity: "Deck", position: "ウイングスパイカー", school: "稻荷崎・2年",
        stats: { serve: 1, block: 1, receive: 1, toss: 1, attack: 2 },
        zone: "攻擊區域", copies: 1,
        skill: "若自己的舉球角色是〔宮侑〕,可從手牌選1張卡放到牌組最下面,攻擊點數 +2。",
        image: "assets/cards/HV-D03-002-DP.webp"
    },
    {
        code: "HV-D03-003", name: "宮侑", type: "character", series: "D03 起始",
        rarity: "Deck", position: "セッター", school: "稻荷崎・2年",
        stats: { serve: 5, block: 0, receive: 0, toss: 1, attack: 0 },
        zone: "發球區域", copies: 2,
        skill: "從手牌選1張事件卡放到事件區即可使用。抽1張卡,並從以下擇一發動:這張卡的發球點數 +1;或下一個對手回合中,對手每有1名舉球角色登場,就讓該角色舉球點數 -2。(用這個技能放置的事件卡,其技能無法使用)",
        image: "assets/cards/HV-D03-003.webp"
    },
    {
        code: "HV-D03-004", name: "宮侑", type: "character", series: "D03 起始",
        rarity: "Deck", position: "セッター", school: "稻荷崎・2年",
        stats: { serve: 4, block: 0, receive: 0, toss: 2, attack: 3 },
        zone: "舉球區域", copies: 2,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D03-004.webp"
    },
    {
        code: "HV-D03-005", name: "宮治", type: "character", series: "D03 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "稻荷崎・2年",
        stats: { serve: 1, block: 3, receive: 0, toss: 2, attack: 2 },
        zone: "阻擋區域", copies: 2,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D03-005.webp"
    },
    {
        code: "HV-D03-006", name: "北信介", type: "character", series: "D03 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "稻荷崎・3年",
        stats: { serve: 2, block: 0, receive: 5, toss: 1, attack: 0 },
        zone: "接球區域", copies: 3,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D03-006.webp"
    },
    {
        code: "HV-D03-007", name: "角名倫太郎", type: "character", series: "D03 起始",
        rarity: "Deck", position: "ミドルブロッカー", school: "稻荷崎・2年",
        stats: { serve: 2, block: 3, receive: 3, toss: 0, attack: 3 },
        zone: "阻擋區域", copies: 4,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D03-007.webp"
    },
    {
        code: "HV-D03-008", name: "尾白亞蘭", type: "character", series: "D03 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "稻荷崎・3年",
        stats: { serve: 4, block: 0, receive: 1, toss: 0, attack: 3 },
        zone: "攻擊區域", copies: 4,
        skill: "支付5點資源(犧牲下方5張卡),攻擊點數 +2。",
        image: "assets/cards/HV-D03-008.webp"
    },
    {
        code: "HV-D03-009", name: "銀島結", type: "character", series: "D03 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "稻荷崎・2年",
        stats: { serve: 2, block: 2, receive: 4, toss: 0, attack: 3 },
        zone: "接球區域", copies: 4,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D03-009.webp"
    },
    {
        code: "HV-D03-010", name: "大耳練", type: "character", series: "D03 起始",
        rarity: "Deck", position: "ミドルブロッカー", school: "稻荷崎・3年",
        stats: { serve: 3, block: 3, receive: 2, toss: 0, attack: 3 },
        zone: "阻擋區域", copies: 3,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D03-010.webp"
    },
    {
        code: "HV-D03-011", name: "赤木路成", type: "character", series: "D03 起始",
        rarity: "Deck", position: "リベロ", school: "稻荷崎・3年",
        stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域", copies: 2,
        skill: "支付2點資源(犧牲下方2張卡),接球點數 +2。",
        image: "assets/cards/HV-D03-011.webp"
    },
    {
        code: "HV-D03-012", name: "這就是冠軍候補的樣子", type: "event", series: "D03 起始",
        rarity: "Deck", category: "接球", copies: 4,
        skill: "抽1張卡，自己1名稲荷崎角色的接球點數 +1。若從自己接球區支付4點資源(犧牲該區角色下方4張卡)，可再抽1張卡。",
        image: "assets/cards/HV-D03-012.webp"
    },
    {
        code: "HV-D03-013", name: "今天要做什麼？", type: "event", series: "D03 起始",
        rarity: "Deck", category: "舉球／攻擊", copies: 4,
        skill: "若自己的舉球角色是〔宮侑〕或〔宮治〕,才可使用此卡。抽1張卡,該角色舉球點數 +1。",
        image: "assets/cards/HV-D03-013.webp"
    },
    // #endregion D03 起始

    // #region P01 補充包（共 1 張）
    {
    code: "HV-P01-001", name: "日向翔陽", type: "character", series: "P01 紀念卡",
    rarity: "H", position: "ミドルブロッカー", school: "烏野・1年",
    stats: { serve: 2, block: 3, receive: 4, toss: 0, attack: 2 },
    zone: "接球區域", copies: 1,
    skill: "無特殊技能。",
    playable: false,
    image: "assets/cards/HV-P01-001.webp"
    },
    {
        code: "HV-P01-031", name: "芝山優生", type: "character", series: "P01 補充包",
        rarity: "N", position: "リベロ", school: "音駒・1年",
        stats: { serve: null, block: null, receive: 4, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "【從手牌丟棄這張卡】：自己場上1名音駒角色的接球點數 +2。發動時機：接球階段中，只要這張卡仍在手牌，就能像事件卡一樣的時機發動此效果。",
        image: "assets/cards/HV-P01-031.webp"
    },
    // #endregion P01 補充包

    // #region P02 宣傳卡（共 55 張）
    {
        code: "HV-P02-005", name: "西谷夕（PR版）", type: "character", series: "P02 宣傳卡",
        rarity: "S", position: "リベロ", school: "烏野・2年",
        stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "限定條件：必須是透過「助けてもらう!!!」技能登場才能發動。條件符合後支付2點資源,接球點數 +2(5→7),並從棄牌區把〔木下久志〕最多1張撿回手牌。",
        image: "assets/cards/HV-P02-005-S.webp"
    },
    {
        code: "HV-P02-096", name: "給我們的攻擊手讓路", type: "event", series: "P02 宣傳卡",
        rarity: "R", category: "攻擊類（白鳥澤主題,每回合限用1次）",
        skill: "抽1張卡,自己場上1名白鳥澤角色攻擊點數 +1。發動條件：舉球角色是〔白布賢二郎〕且攻擊角色原始攻擊點數為3。條件符合後,把攻擊區資源卡中的〔牛島若利〕撿出重新登場,並讓他攻擊點數再 +1。",
        image: "assets/cards/HV-P02-096-R.webp"
    },
    {
        code: "HV-P02-011", name: "成田一仁", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ミドルブロッカー", school: "烏野・2年",
        stats: { serve: 0, block: 2, receive: 0, toss: 0, attack: 0 },
        zone: "阻擋區域",
        skill: "【從手牌丟棄這張卡】：自己場上1名烏野角色的1項數值 +1。發動時機：阻擋階段／接球階段中，只要這張卡仍在手牌，就能像事件卡一樣的時機發動此效果。",
        image: "assets/cards/HV-P02-011.webp"
    },
    {
        code: "HV-P02-078", name: "澤村・黑尾", type: "character", series: "P02 宣傳卡",
        rarity: "R", position: "ウイングスパイカー／ミドルブロッカー（雙面聯名卡）",
        school: "烏野・3年（澤村大地）／音駒・3年（黑尾鉄朗）",
        stats: { serve: 0, block: 1, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "這張卡登場時，可以把卡片名稱從「澤村・黑尾」改成「澤村大地」或「黑尾鉄朗」其中一個。登場時選擇的名稱，在該回合結束前皆有效。此卡在計算場上角色人數時，算作1人。",
        image: "assets/cards/HV-P02-078-R.webp"
    },
    {
        code: "HV-P02-100", name: "灰羽アリサ", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "阻擋／接球／攻擊（皆可用）",
        school: "音駒", position: "應援團",
        skill: "【回合1次】抽1張卡，並讓自己場上1名「灰羽リエーフ」角色的1項數值 +1。【回合1次】這個回合中，無效化自己場上「與這張卡同名卡片」的技能。",
        image: "assets/cards/HV-P02-100.webp"
    },
    {
        code: "HV-P02-008", name: "田中龍之介", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "烏野・2年",
        stats: { serve: 4, block: 1, receive: 4, toss: 0, attack: 3 },
        zone: "攻擊區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-008.webp"
    },
    {
        code: "HV-P02-009", name: "緣下力", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "烏野・2年",
        stats: { serve: 2, block: 2, receive: 4, toss: 0, attack: 3 },
        zone: "攻擊區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-009.webp"
    },
    {
        code: "HV-P02-012", name: "澤村大地", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "烏野・3年",
        stats: { serve: 1, block: 0, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "雙方SET牌區合計剩1張以下時,支付3點資源,接球點數 +3。",
        image: "assets/cards/HV-P02-012.webp"
    },
    {
        code: "HV-P02-018", name: "宮侑", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "セッター", school: "稲荷崎・2年",
        stats: { serve: 2, block: 1, receive: 1, toss: 2, attack: 3 },
        zone: "攻擊區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-018-N.webp"
    },
    {
        code: "HV-P02-020", name: "宮治", type: "character", series: "P02 宣傳卡",
        rarity: "頂", position: "ウイングスパイカー", school: "稲荷崎・2年",
        stats: { serve: 3, block: 1, receive: 3, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "支付3點資源,攻擊點數 +3;若這張卡是透過〔どんぴしゃり〕技能登場的,再額外 +1,並讓下一個對手回合中,對手手牌最多只能讓2名阻擋角色登場。",
        image: "assets/cards/HV-P02-020-頂.webp"
    },
    {
        code: "HV-P02-021", name: "宮治", type: "character", series: "P02 宣傳卡",
        rarity: "R", position: "ウイングスパイカー", school: "稲荷崎・2年",
        stats: { serve: 3, block: 2, receive: 1, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "自己手牌≤2張時,攻擊點數 +2。",
        image: "assets/cards/HV-P02-021-R.webp"
    },
    {
        code: "HV-P02-022", name: "宮治", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "稲荷崎・2年",
        stats: { serve: 1, block: 1, receive: 5, toss: 0, attack: 3 },
        zone: "接球區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-022.webp"
    },
    {
        code: "HV-P02-024", name: "北信介", type: "character", series: "P02 宣傳卡",
        rarity: "S", position: "ウイングスパイカー", school: "稲荷崎・3年",
        stats: { serve: 1, block: 0, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "丟棄1張手牌,支付3點資源,接球點數 +1,並從自己事件區把1張稲荷崎的卡撿回手牌。",
        image: "assets/cards/HV-P02-024-S.webp"
    },
    {
        code: "HV-P02-029", name: "尾白アラン", type: "character", series: "P02 宣傳卡",
        rarity: "R", position: "ウイングスパイカー", school: "稲荷崎・3年",
        stats: { serve: 5, block: 0, receive: 2, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "支付3點資源;若自己棄牌區裡卡名不同的稲荷崎角色卡合計≥6種,攻擊點數 +3,並讓下一個對手回合中,對手接球角色技能失效。",
        image: "assets/cards/HV-P02-029-R.webp"
    },
    {
        code: "HV-P02-030", name: "尾白アラン", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "稲荷崎・3年",
        stats: { serve: 5, block: 0, receive: 4, toss: 0, attack: 3 },
        zone: "攻擊區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-030.webp"
    },
    {
        code: "HV-P02-031", name: "理石平介", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "稲荷崎・1年",
        stats: { serve: 0, block: 2, receive: 2, toss: 0, attack: 3 },
        zone: "發球區域",
        skill: "支付1點資源;若支付的是〔理石平介〕本人,發球點數 +6,並讓下一個對手回合中,對手不能讓S位置的舉球角色登場。",
        image: "assets/cards/HV-P02-031.webp"
    },
    {
        code: "HV-P02-032", name: "銀島結", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "稲荷崎・2年",
        stats: { serve: 1, block: 3, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-032.webp"
    },
    {
        code: "HV-P02-033", name: "大耳練", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ミドルブロッカー", school: "稲荷崎・3年",
        stats: { serve: 2, block: 3, receive: 3, toss: 0, attack: 3 },
        zone: "阻擋區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-033.webp"
    },
    {
        code: "HV-P02-034", name: "赤木路成", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "リベロ", school: "稲荷崎・3年",
        stats: { serve: null, block: null, receive: 6, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-034.webp"
    },
    {
        code: "HV-P02-035", name: "小作裕渡", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "稲荷崎・2年",
        stats: { serve: 3, block: 0, receive: 0, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "【從手牌丟棄這張卡】：自己場上1名稲荷崎角色的接球點數 +2。發動時機：接球階段中，只要這張卡仍在手牌，就能像事件卡一樣的時機發動此效果。",
        image: "assets/cards/HV-P02-035.webp"
    },
    {
        code: "HV-P02-038", name: "二口堅治", type: "character", series: "P02 宣傳卡",
        rarity: "頂", position: "ウイングスパイカー", school: "伊達工業・2年",
        stats: { serve: 1, block: 2, receive: 4, toss: 0, attack: 0 },
        zone: "阻擋區域",
        skill: "這回合內只要阻擋成功，就觸發〔絕殺鎖定4〕；若這張卡是副攔身份，下一個對手回合中，對手每有1名接球角色登場，就使該角色接球點數 -1。",
        image: "assets/cards/HV-P02-038-頂.webp"
    },
    {
        code: "HV-P02-041", name: "作並浩輔", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "リベロ", school: "伊達工業・1年",
        stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
        zone: "阻擋區域",
        skill: "【從手牌丟棄這張卡】：自己牌組最上面3張全丟棄,若3張都是伊達工業的卡,從自己棄牌區把1張沒有技能的伊達工業角色卡以副攔身份登場。發動時機：阻擋階段中，只要這張卡仍在手牌，就能像事件卡一樣的時機發動此效果。",
        image: "assets/cards/HV-P02-041.webp"
    },
    {
        code: "HV-P02-042", name: "鎌先靖志", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ミドルブロッカー", school: "伊達工業・3年",
        stats: { serve: 1, block: 3, receive: 0, toss: 0, attack: 2 },
        zone: "阻擋區域",
        skill: "對方事件區可用於舉球/攻擊的卡合計≥4張時,阻擋點數 +5。",
        image: "assets/cards/HV-P02-042.webp"
    },
    {
        code: "HV-P02-043", name: "茂庭要", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "セッター", school: "伊達工業・3年",
        stats: { serve: 2, block: 3, receive: 1, toss: 2, attack: 0 },
        zone: "舉球區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-043.webp"
    },
    {
        code: "HV-P02-044", name: "笹谷武仁", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "伊達工業・3年",
        stats: { serve: 2, block: 3, receive: 3, toss: 0, attack: 3 },
        zone: "攻擊區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-044.webp"
    },
    {
        code: "HV-P02-045", name: "小原豊", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "伊達工業・2年",
        stats: { serve: 1, block: 3, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-045.webp"
    },
    {
        code: "HV-P02-048", name: "天童覚", type: "character", series: "P02 宣傳卡",
        rarity: "S", position: "ミドルブロッカー", school: "白鳥沢・3年",
        stats: { serve: 1, block: 2, receive: 1, toss: 0, attack: 3 },
        zone: "阻擋區域",
        skill: "擲一次硬幣;正面,阻擋點數 +4;反面,自己牌組最上面3張丟棄。",
        image: "assets/cards/HV-P02-048-S.webp"
    },
    {
        code: "HV-P02-052", name: "大平獅音", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "白鳥沢・3年",
        stats: { serve: 1, block: 0, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "支付3點資源,接球點數 +2。",
        image: "assets/cards/HV-P02-052.webp"
    },
    {
        code: "HV-P02-053", name: "山形隼人", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "リベロ", school: "白鳥沢・3年",
        stats: { serve: null, block: null, receive: 6, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-053.webp"
    },
    {
        code: "HV-P02-054", name: "川西太一", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ミドルブロッカー", school: "白鳥沢・2年",
        stats: { serve: 2, block: 3, receive: 3, toss: 0, attack: 3 },
        zone: "阻擋區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-054.webp"
    },
    {
        code: "HV-P02-055", name: "瀬見英太", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "セッター", school: "白鳥沢・3年",
        stats: { serve: 4, block: 2, receive: 1, toss: 2, attack: 0 },
        zone: "舉球區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-055.webp"
    },
    {
        code: "HV-P02-059", name: "京谷賢太郎", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "青葉城西・2年",
        stats: { serve: 2, block: 2, receive: 4, toss: 0, attack: 3 },
        zone: "攻擊區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-059-N.webp"
    },
    {
        code: "HV-P02-060", name: "孤爪研磨", type: "character", series: "P02 宣傳卡",
        rarity: "R", position: "セッター", school: "音駒・2年",
        stats: { serve: 1, block: 1, receive: 1, toss: 1, attack: 2 },
        zone: "舉球區域",
        skill: "自己手牌裡有原始攻擊點數3的攻擊角色登場,且這張卡是舉球角色時,自己牌組最上面丟棄1張,舉球點數 +1,並讓自己攻擊區的1張資源卡以攻擊角色身份登場。",
        image: "assets/cards/HV-P02-060.webp"
    },
    {
        code: "HV-P02-062", name: "夜久衛輔", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "リベロ", school: "音駒・3年",
        stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "支付2點資源,看自己牌組最上面2張,從中選1張音駒角色卡公開加入手牌,其餘依任意順序放回牌組最下面。",
        image: "assets/cards/HV-P02-062.webp"
    },
    {
        code: "HV-P02-063", name: "灰羽利耶夫", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ミドルブロッカー", school: "音駒・1年",
        stats: { serve: 2, block: 2, receive: 4, toss: 0, attack: 3 },
        zone: "阻擋區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-063.webp"
    },
    {
        code: "HV-P02-066", name: "赤葦京治", type: "character", series: "P02 宣傳卡",
        rarity: "S", position: "セッター", school: "梟谷・2年",
        stats: { serve: 2, block: 1, receive: 1, toss: 1, attack: 1 },
        zone: "舉球區域",
        skill: "自己牌組最上面3張丟棄,支付2點資源,舉球點數 +2,並讓這回合內自己角色〔木兎光太郎〕的技能失效。",
        image: "assets/cards/HV-P02-066.webp"
    },
    {
        code: "HV-P02-067", name: "赤葦京治", type: "character", series: "P02 宣傳卡",
        rarity: "R", position: "セッター", school: "梟谷・2年",
        stats: { serve: 3, block: 0, receive: 1, toss: 1, attack: 1 },
        zone: "舉球區域",
        skill: "自己牌組最上面最多丟棄1張;若該張是梟谷角色卡,丟棄1張手牌,強制設定自己進攻點數為3並立刻結束回合,下一個對手回合中對手不能讓阻擋角色登場。",
        image: "assets/cards/HV-P02-067.webp"
    },
    {
        code: "HV-P02-068", name: "星海光来", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "鴎台・2年",
        stats: { serve: 3, block: 2, receive: 0, toss: 1, attack: 3 },
        zone: "攻擊區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-068-N.webp"
    },
    {
        code: "HV-P02-069", name: "佐久早聖臣", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "井闥山・2年",
        stats: { serve: 5, block: 0, receive: 4, toss: 0, attack: 3 },
        zone: "接球區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-069.webp"
    },
    {
        code: "HV-P02-070", name: "古森元也", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "リベロ", school: "井闥山・2年",
        stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "支付4點資源,抽2張卡,自己手牌丟棄1張放到牌組最上或最下,接球點數 +3。",
        image: "assets/cards/HV-P02-070.webp"
    },
    {
        code: "HV-P02-071", name: "丸山一喜", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "椿原・3年",
        stats: { serve: 1, block: 0, receive: 3, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "支付2點資源,抽1張卡,接球點數 +2。",
        image: "assets/cards/HV-P02-071.webp"
    },
    {
        code: "HV-P02-072", name: "金沢伊織", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "早流川工業・3年",
        stats: { serve: 2, block: 2, receive: 4, toss: 0, attack: 3 },
        zone: "攻擊區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-072.webp"
    },
    {
        code: "HV-P02-073", name: "大将優", type: "character", series: "P02 宣傳卡",
        rarity: "R", position: "ウイングスパイカー", school: "戸美・3年",
        stats: { serve: 4, block: 1, receive: 3, toss: 0, attack: 1 },
        zone: "攻擊區域",
        skill: "支付3點資源,攻擊點數 +4,並從自己事件區把1張戸美的卡加入手牌;若有加入,自己手牌丟棄1張。",
        image: "assets/cards/HV-P02-073-R.webp"
    },
    {
        code: "HV-P02-073", name: "大将優", type: "character", series: "P02 宣傳卡", variant: "RP",
        rarity: "R", position: "ウイングスパイカー", school: "戸美・3年",
        stats: { serve: 4, block: 1, receive: 3, toss: 0, attack: 1 },
        zone: "攻擊區域",
        skill: "支付3點資源,攻擊點數 +4,並從自己事件區把1張戸美的卡加入手牌;若有加入,自己手牌丟棄1張。",
        image: "assets/cards/HV-P02-073-RP.webp"
    },
    {
        code: "HV-P02-074", name: "沼井和馬", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "戸美・3年",
        stats: { serve: 4, block: 1, receive: 0, toss: 0, attack: 3 },
        zone: "發球區域",
        skill: "支付1點資源;若支付的是戸美的卡,發球點數 +2,並讓下一個對手回合中,對手每有1名S位置的舉球角色登場,就使該角色舉球點數 -1。",
        image: "assets/cards/HV-P02-074.webp"
    },
    {
        code: "HV-P02-080", name: "武田一鉄", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "抽牌類", school: "烏野", position: "監督",
        skill: "抽1張卡;把對方事件區1張監督/元監督/教練卡放到對方牌組最下面就能發動;看自己牌組最上面3張,選1張烏野角色卡公開加入手牌,其餘依任意順序放回牌組最下面。",
        image: "assets/cards/HV-P02-080.webp"
    },
    {
        code: "HV-P02-083", name: "助けてもらう!!!", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "接球類", school: "烏野",
        skill: "抽1張卡,讓自己接球區裡最多1張リベロ位置的資源卡以接球角色身份登場。",
        image: "assets/cards/HV-P02-083.webp"
    },
    {
        code: "HV-P02-084", name: "黒須法宗", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "接球類", school: "稲荷崎", position: "監督",
        skill: "抽1張卡,自己場上1名稲荷崎角色接球點數 +1;若自己事件區裡可用於發球/舉球/攻擊的稲荷崎卡合計≥2張,再 +1。",
        image: "assets/cards/HV-P02-084.webp"
    },
    {
        code: "HV-P02-085", name: "大見太郎", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "接球類", school: "稲荷崎", position: "コーチ",
        skill: "自己場上1名稲荷崎角色接球點數 +1;自己手牌丟棄1張稲荷崎的卡就能發動;抽2張卡。",
        image: "assets/cards/HV-P02-085.webp"
    },
    {
        code: "HV-P02-090", name: "追分拓朗", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "阻擋／接球類", school: "伊達工業", position: "監督",
        skill: "抽1張卡;以下擇一使用：①阻擋點數為3的自己伊達工業角色1人,阻擋點數 +1　②自己伊達工業角色1人,接球點數 +1。",
        image: "assets/cards/HV-P02-090.webp"
    },
    {
        code: "HV-P02-091", name: "最強の防御で最速の攻撃 それが\"ブロック\"。", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "阻擋類", school: "伊達工業",
        skill: "抽1張卡,自己1名伊達工業角色阻擋點數 +1;若對方事件區可用於舉球/攻擊的卡合計≥4張,再 +6,並讓這回合內阻擋成功時觸發〔絕殺鎖定7〕。",
        image: "assets/cards/HV-P02-091.webp"
    },
    {
        code: "HV-P02-092", name: "来年の\"鉄壁\"は 絶対崩れねぇよ", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "阻擋／抽牌類", school: "伊達工業",
        skill: "抽1張卡;若自己場上中堅阻攔手是伊達工業3年級生,把自己場上1名伊達工業1或2年級角色加入手牌;若有加入,自己手牌丟棄1張。",
        image: "assets/cards/HV-P02-092-N.webp"
    },
    {
        code: "HV-P02-094", name: "鷲匠鍛治", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "接球類", school: "白鳥沢", position: "監督",
        skill: "抽1張卡,自己1名白鳥沢角色接球點數 +1;自己手牌丟棄1張沒有技能的白鳥沢角色卡就能發動,再 +2。",
        image: "assets/cards/HV-P02-094.webp"
    },
    {
        code: "HV-P02-095", name: "斉藤明", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "抽牌類", school: "白鳥沢", position: "コーチ",
        skill: "自己棄牌區最多2張沒有技能的白鳥沢角色卡加入手牌;若加入2張,自己手牌丟棄1張。",
        image: "assets/cards/HV-P02-095.webp"
    },
    {
        code: "HV-P02-098", name: "頼むぞ", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "攻擊類", school: "白鳥沢",
        skill: "抽1張卡,自己1名白鳥沢角色攻擊點數 +1;若自己攻擊角色是〔五色工〕,自己手牌丟棄1張〔牛島若利〕就能發動,再 +1。",
        image: "assets/cards/HV-P02-098.webp"
    },
    // #endregion P02 宣傳卡

    // #region P03 宣傳卡（共 18 張）
    {
        code: "HV-P03-067", name: "牛島若利", type: "character", series: "P03 宣傳卡",
        rarity: "R", position: "ウイングスパイカー", school: "白鳥澤・3年",
        stats: { serve: 3, block: 0, receive: 2, toss: 0, attack: 3 },
        zone: "接球區域",
        skill: "技能一：支付2點資源,接球點數 +4(2→6)。技能二：若對方攻擊角色原始攻擊點數≤1,可犧牲場上另一名白鳥澤阻擋角色,讓對方這次進攻點數 -2。",
        image: "assets/cards/HV-P03-067-R.webp"
    },
    {
        code: "HV-P03-081", name: "球場裡到處都是情報", type: "event", series: "P03 宣傳卡",
        rarity: "R", category: "阻擋／接球／攻擊（每回合限用1次）",
        skill: "抽1張卡;若自己場上所有角色都是「疑似ユース」系列,選1名角色任選1項數值 +1;若自己事件棄牌堆疊≥8張,再抽1張卡。同回合內同名卡技能會被無效化。",
        image: "assets/cards/HV-P03-081.webp"
    },
    {
        code: "HV-P03-099", name: "…那你到底在做什麼？", type: "event", series: "P03 宣傳卡",
        rarity: "N", category: "攻擊類（白鳥澤主題）",
        skill: "抽1張卡,自己場上1名白鳥澤攻擊角色攻擊點數 +1;若選中角色是〔牛島若利〕,額外把對方事件區所有角色卡丟棄,若丟掉2張以上,牛島攻擊點數再 +1。",
        image: "assets/cards/HV-P03-099-N.webp"
    },
    {
        code: "HV-P03-004", name: "月島螢", type: "character", series: "P03 宣傳卡",
        rarity: "N", position: "ミドルブロッカー", school: "烏野／疑似ユース・1年",
        stats: { serve: 2, block: 3, receive: 3, toss: 0, attack: 3 },
        zone: "阻擋區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P03-004.webp"
    },
    {
        code: "HV-P03-013", name: "寒河江勇将", type: "character", series: "P03 宣傳卡",
        rarity: "N", position: "ボール拾い", school: "白鳥沢／疑似ユース・1年",
        stats: { serve: null, block: null, receive: null, toss: null, attack: null },
        zone: "事件區域",
        skill: "【從手牌把這張卡放到自己事件區】：自己角色全部都是疑似YOUTH時,自己牌組最上面2張公開,從中選1張角色卡加入手牌,其餘依任意順序放回牌組最下面。發動時機：攻擊階段中，只要這張卡仍在手牌，就能像事件卡一樣的時機發動此效果。",
        image: "assets/cards/HV-P03-013.webp"
    },
    {
        code: "HV-P03-017", name: "百沢雄大", type: "character", series: "P03 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "角川／疑似ユース・1年",
        stats: { serve: 2, block: 3, receive: 3, toss: 0, attack: 3 },
        zone: "攻擊區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P03-017.webp"
    },
    {
        code: "HV-P03-018", name: "黒石純二", type: "character", series: "P03 宣傳卡",
        rarity: "N", position: "リベロ", school: "白水館／疑似ユース・1年",
        stats: { serve: null, block: null, receive: 6, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P03-018.webp"
    },
    {
        code: "HV-P03-022", name: "宮侑", type: "character", series: "P03 宣傳卡",
        rarity: "R", position: "セッター", school: "稲荷崎／ユース・2年",
        stats: { serve: 1, block: 3, receive: 0, toss: 2, attack: 2 },
        zone: "舉球區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P03-022.webp"
    },
    {
        code: "HV-P03-023", name: "星海光来", type: "character", series: "P03 宣傳卡",
        rarity: "頂", position: "ウイングスパイカー", school: "鴎台／ユース・2年",
        stats: { serve: 4, block: 0, receive: 3, toss: 0, attack: 1 },
        zone: "阻擋區域／接球區域／攻擊區域（三選一）",
        skill: "自己角色全部都是YOUTH時,自己事件區丟棄1張YOUTH的卡就能發動,任選1項數值 +3。",
        image: "assets/cards/HV-P03-023-頂.webp"
    },
    {
        code: "HV-P03-024", name: "星海光来", type: "character", series: "P03 宣傳卡",
        rarity: "S", position: "ウイングスパイカー", school: "鴎台／ユース・2年",
        stats: { serve: 2, block: 0, receive: 5, toss: 0, attack: 3 },
        zone: "接球區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P03-024.webp"
    },
    {
        code: "HV-P03-038", name: "犬岡走", type: "character", series: "P03 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "音駒・1年",
        stats: { serve: 2, block: 2, receive: 0, toss: 0, attack: 3 },
        zone: "阻擋區域",
        skill: "自己手牌丟棄1張音駒的卡,阻擋點數 +3;若對方手牌≤2張,再 +2。",
        image: "assets/cards/HV-P03-038.webp"
    },
    {
        code: "HV-P03-042", name: "宮治", type: "character", series: "P03 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "稲荷崎・2年",
        stats: { serve: 0, block: 3, receive: 5, toss: 0, attack: 1 },
        zone: "接球區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P03-042-N.webp"
    },
    {
        code: "HV-P03-059", name: "岩泉一", type: "character", series: "P03 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "青葉城西・3年",
        stats: { serve: 4, block: 3, receive: 1, toss: 0, attack: 3 },
        zone: "攻擊區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P03-059-N.webp"
    },
    {
        code: "HV-P03-066", name: "吹上仁悟", type: "character", series: "P03 宣傳卡",
        rarity: "N", position: "ミドルブロッカー", school: "伊達工業・1年",
        stats: { serve: 3, block: 3, receive: 2, toss: 0, attack: 3 },
        zone: "阻擋區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P03-066.webp"
    },
    {
        code: "HV-P03-068", name: "天童覚", type: "character", series: "P03 宣傳卡", variant: "RA",
        rarity: "RA", position: "ミドルブロッカー", school: "白鳥沢・3年",
        stats: { serve: 1, block: 3, receive: 0, toss: 1, attack: 3 },
        zone: "阻擋區域",
        skill: "無特殊技能。（這張是Q版像素風的特別繪版卡）",
        image: "assets/cards/HV-P03-068-RA.webp"
    },
    {
        code: "HV-P03-083", name: "火焼呼太郎", type: "event", series: "P03 宣傳卡",
        rarity: "N", category: "接球類", school: "ユース", position: "監督",
        skill: "自己角色全部都是YOUTH時,抽1張卡,自己1名角色接球點數 +1,並讓自己接球區跟攻擊區各1張YOUTH的資源卡互換。",
        image: "assets/cards/HV-P03-083.webp"
    },
    {
        code: "HV-P03-084", name: "雲雀田吹", type: "event", series: "P03 宣傳卡",
        rarity: "N", category: "接球類", school: "全日本男子代表／ユース", position: "監督",
        skill: "【回合1次】自己角色全部都是YOUTH時,抽1張卡,自己1名角色接球點數 +1;若自己事件區≤2張,再 +1。",
        image: "assets/cards/HV-P03-084-N.webp"
    },
    {
        code: "HV-P03-098", name: "ブッ潰ス!!!", type: "event", series: "P03 宣傳卡",
        rarity: "N", category: "發球／阻擋類", school: "伊達工業",
        skill: "自己角色全部都是伊達工業時,抽1張卡;以下擇一使用：①自己角色1人,阻擋點數 +1　②若是發球階段中,下一個對手回合中,對手手牌裡S位置的舉球角色登場時,該角色舉球點數 -1。",
        image: "assets/cards/HV-P03-098.webp"
    },
    // #endregion P03 宣傳卡
];
