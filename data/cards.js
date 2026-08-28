// 排球少年 TCG 卡牌資料庫 —— 純文字整理，無官方圖片
// rarity 為 Deck 指該卡是「起始套牌（スターターデッキ）專屬收錄卡」
//
// rarity 欄位在本檔一律存「原始代碼」，中文顯示交給各頁的 rarityLabel() 轉換：
//   H→秘  I→頂  IP→頂P  IA→頂A  K→極  KP→極P  （字母碼：頂/秘/極 這幾階一律用代碼）
//   N / R / S / NP / RP / SP / RA 直接照字面存
// packs.js 抽卡權重用 rarityTier() 把 IP→頂、KP→極、RP→R … 收斂到 6 個基本階
//
// variant 欄位：只有「同 code 且同 rarity」無法區分的平行版才需要（目前只有各起始
//   套牌王牌的 DP 版，rarity 都是 Deck）。兩個稀有度＝寫兩筆、靠 rarity 區分即可。

const CARDS = [
    // #region D01 起始（共 14 張）
    {
        code: "HV-D01-001", name: "日向翔陽", type: "character", series: "D01 起始",
        rarity: "Deck", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 2, block: 2, receive: 2, toss: 0, attack: 2 },
        zone: "攻擊區域", copies: 3,
        skill: "支付2點資源（犧牲下方2張卡），攻擊點數 +2（2→4）。",
        image: "assets/cards/HV-D01-001.webp"
    },
    {
        code: "HV-D01-001", name: "日向翔陽", type: "character", series: "D01 起始", variant: "DP",
        rarity: "Deck", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 2, block: 2, receive: 2, toss: 0, attack: 2 },
        zone: "攻擊區域", copies: 1,
        skill: "支付2點資源（犧牲下方2張卡），攻擊點數 +2（2→4）。",
        image: "assets/cards/HV-D01-001-DP.webp"
    },
    {
        code: "HV-D01-002", name: "影山飛雄", type: "character", series: "D01 起始",
        rarity: "Deck", position: "セッター", school: "烏野・1年",
        stats: { serve: 1, block: 1, receive: 2, toss: 1, attack: 1 },
        zone: "舉球區域", copies: 3,
        skill: "支付2點資源（犧牲下方2張卡），舉球點數 +2（1→3）。",
        image: "assets/cards/HV-D01-002.webp"
    },
    {
        code: "HV-D01-002", name: "影山飛雄", type: "character", series: "D01 起始", variant: "DP",
        rarity: "Deck", position: "セッター", school: "烏野・1年",
        stats: { serve: 1, block: 1, receive: 2, toss: 1, attack: 1 },
        zone: "舉球區域", copies: 1,
        skill: "支付2點資源（犧牲下方2張卡），舉球點數 +2（1→3）。",
        image: "assets/cards/HV-D01-002-DP.webp"
    },
    {
        code: "HV-D01-003", name: "月島螢", type: "character", series: "D01 起始",
        rarity: "Deck", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 1, block: 3, receive: 1, toss: 0, attack: 2 },
        zone: "阻擋區域", copies: 2,
        skill: "若對方進攻點數≤4，支付1點資源，抽1張卡。",
        image: "assets/cards/HV-D01-003.webp"
    },
    {
        code: "HV-D01-004", name: "山口忠", type: "character", series: "D01 起始",
        rarity: "Deck", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 5, block: 3, receive: 3, toss: 0, attack: 1 },
        copies: 2,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D01-004.webp"
    },
    {
        code: "HV-D01-005", name: "西谷夕", type: "character", series: "D01 起始",
        rarity: "Deck", position: "リベロ", school: "烏野・2年",
        stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域", copies: 2,
        skill: "支付3點資源（犧牲下方3張卡），抽1張卡，並讓接球點數 +2（5→7）。",
        image: "assets/cards/HV-D01-005.webp"
    },
    {
        code: "HV-D01-006", name: "田中龍之介", type: "character", series: "D01 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "烏野・2年",
        stats: { serve: 1, block: 2, receive: 2, toss: 1, attack: 3 },
        copies: 4,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D01-006.webp"
    },
    {
        code: "HV-D01-007", name: "緣下力", type: "character", series: "D01 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "烏野・2年",
        stats: { serve: 2, block: 1, receive: 2, toss: 0, attack: 3 },
        zone: "接球區域", copies: 2,
        skill: "丟棄1張手牌，接球點數 +3（2→5）。",
        image: "assets/cards/HV-D01-007.webp"
    },
    {
        code: "HV-D01-008", name: "澤村大地", type: "character", series: "D01 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "烏野・3年",
        stats: { serve: 3, block: 1, receive: 5, toss: 0, attack: 2 },
        copies: 4,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D01-008.webp"
    },
    {
        code: "HV-D01-009", name: "菅原孝支", type: "character", series: "D01 起始",
        rarity: "Deck", position: "セッター", school: "烏野・3年",
        stats: { serve: 1, block: 1, receive: 2, toss: 2, attack: 3 },
        copies: 4,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D01-009.webp"
    },
    {
        code: "HV-D01-010", name: "東峰旭", type: "character", series: "D01 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "烏野・3年",
        stats: { serve: 2, block: 2, receive: 4, toss: 0, attack: 3 },
        copies: 4,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D01-010.webp"
    },
    {
        code: "HV-D01-011", name: "排球是!!!永遠向上仰望的運動", type: "event", series: "D01 起始",
        rarity: "Deck", category: "接球", copies: 4,
        skill: "抽1張卡；選自己場上1名角色，接球點數 +1；若該角色接球點數≤4，再額外 +1（最多+2）。",
        image: "assets/cards/HV-D01-011.webp"
    },
    {
        code: "HV-D01-012", name: "Broad攻擊（快速平行攻擊）", type: "event", series: "D01 起始",
        rarity: "Deck", category: "攻擊", copies: 4,
        skill: "抽1張卡，自己場上1名烏野角色攻擊點數 +1。組合技：若舉球角色為〔影山飛雄〕、攻擊角色為〔日向翔陽〕，下一個對手回合，對手最多只能登場1名阻擋角色。",
        image: "assets/cards/HV-D01-012.webp"
    },
    // #endregion D01 起始

    // #region D02 起始（共 14 張）
    {
        code: "HV-D02-001", name: "孤爪研磨", type: "character", series: "D02 起始",
        rarity: "Deck", position: "セッター", school: "音駒・2年",
        stats: { serve: 1, block: 2, receive: 1, toss: 1, attack: 0 },
        zone: "舉球區域", copies: 3,
        skill: "支付2點資源（犧牲下方2張卡），舉球點數 +1，並讓下一個對手回合中，對手每有1名攻擊角色登場，就使該角色攻擊點數 -2。",
        image: "assets/cards/HV-D02-001.webp"
    },
    {
        code: "HV-D02-001", name: "孤爪研磨", type: "character", series: "D02 起始", variant: "DP",
        rarity: "Deck", position: "セッター", school: "音駒・2年",
        stats: { serve: 1, block: 2, receive: 1, toss: 1, attack: 0 },
        zone: "舉球區域", copies: 1,
        skill: "支付2點資源（犧牲下方2張卡），舉球點數 +1，並讓下一個對手回合中，對手每有1名攻擊角色登場，就使該角色攻擊點數 -2。",
        image: "assets/cards/HV-D02-001-DP.webp"
    },
    {
        code: "HV-D02-002", name: "黑尾鐵朗", type: "character", series: "D02 起始",
        rarity: "Deck", position: "ミドルブロッカー", school: "音駒・3年",
        stats: { serve: 1, block: 3, receive: 1, toss: 0, attack: 2 },
        zone: "阻擋區域", copies: 3,
        skill: "支付1點資源（犧牲下方1張卡），發動後：這回合內只要阻擋成功，就會觸發關鍵字〔絕殺鎖定5〕——這回合結束時，自己的進攻點數會被強制設定為 5（不論原本疊加到多少）。",
        image: "assets/cards/HV-D02-002.webp"
    },
    {
        code: "HV-D02-002", name: "黑尾鐵朗", type: "character", series: "D02 起始", variant: "DP",
        rarity: "Deck", position: "ミドルブロッカー", school: "音駒・3年",
        stats: { serve: 1, block: 3, receive: 1, toss: 0, attack: 2 },
        zone: "阻擋區域", copies: 1,
        skill: "支付1點資源（犧牲下方1張卡），發動後：這回合內只要阻擋成功，就會觸發關鍵字〔絕殺鎖定5〕——這回合結束時，自己的進攻點數會被強制設定為 5（不論原本疊加到多少）。",
        image: "assets/cards/HV-D02-002-DP.webp"
    },
    {
        code: "HV-D02-003", name: "夜久衛輔", type: "character", series: "D02 起始",
        rarity: "Deck", position: "リベロ", school: "音駒・3年",
        stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域", copies: 2,
        skill: "丟棄1張手牌（不是犧牲下方的資源卡），接球點數 +2（5→7）。",
        image: "assets/cards/HV-D02-003.webp"
    },
    {
        code: "HV-D02-004", name: "灰羽利耶夫", type: "character", series: "D02 起始",
        rarity: "Deck", position: "ミドルブロッカー", school: "音駒・1年",
        stats: { serve: 1, block: 2, receive: 1, toss: 0, attack: 3 },
        zone: "攻擊區域（特殊：可在下方條件成立時額外加入阻擋區）", copies: 4,
        skill: "自己場上有阻擋角色登場時，如果這張卡本身是本次的攻擊角色，可以支付2點資源，讓這張卡「同時」以副攔身份登場到阻擋區。若自己阻擋區已經有另一張〔灰羽利耶夫〕，或阻擋區已滿3人，則不能這樣登場。",
        image: "assets/cards/HV-D02-004.webp"
    },
    {
        code: "HV-D02-005", name: "海信行", type: "character", series: "D02 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "音駒・3年",
        stats: { serve: 1, block: 2, receive: 5, toss: 0, attack: 2 },
        copies: 2,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D02-005.webp"
    },
    {
        code: "HV-D02-006", name: "山本猛虎", type: "character", series: "D02 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "音駒・2年",
        stats: { serve: 5, block: 2, receive: 2, toss: 0, attack: 3 },
        copies: 4,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D02-006.webp"
    },
    {
        code: "HV-D02-007", name: "福永招平", type: "character", series: "D02 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "音駒・2年",
        stats: { serve: 1, block: 0, receive: 4, toss: 1, attack: 3 },
        copies: 4,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D02-007.webp"
    },
    {
        code: "HV-D02-008", name: "犬岡走", type: "character", series: "D02 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "音駒・1年",
        stats: { serve: 2, block: 3, receive: 3, toss: 0, attack: 3 },
        copies: 4,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D02-008.webp"
    },
    {
        code: "HV-D02-009", name: "芝山優生", type: "character", series: "D02 起始",
        rarity: "Deck", position: "リベロ", school: "音駒・1年",
        stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域", copies: 2,
        skill: "支付2點資源（犧牲下方2張卡），抽1張卡。",
        image: "assets/cards/HV-D02-009.webp"
    },
    {
        code: "HV-D02-010", name: "手白球彦", type: "character", series: "D02 起始",
        rarity: "Deck", position: "セッター", school: "音駒・1年",
        stats: { serve: 4, block: 1, receive: 4, toss: 1, attack: 0 },
        copies: 2,
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
        rarity: "Deck", category: "抽牌", copies: 4,
        skill: "抽1張卡。接著看自己牌組最上面3張，從中選〔灰羽利耶夫〕或〔犬岡走〕最多1張公開加入手牌，沒被選中的卡以任意順序放回牌組最下面。",
        image: "assets/cards/HV-D02-012.webp"
    },
    // #endregion D02 起始

    // #region D03 起始（共 15 張）
    {
        code: "HV-D03-001", name: "宮侑", type: "character", series: "D03 起始",
        rarity: "Deck", position: "セッター", school: "稻荷崎・2年",
        stats: { serve: 2, block: 2, receive: 0, toss: 1, attack: 0 },
        zone: "舉球區域", copies: 2,
        skill: "支付2點資源（犧牲下方2張卡），舉球點數 +1（1→2），並從自己事件區把〔今天要做什麼？〕最多1張加入手牌；若有加入，從手牌選1張卡放到牌組最下面。",
        image: "assets/cards/HV-D03-001.webp"
    },
    {
        code: "HV-D03-001", name: "宮侑", type: "character", series: "D03 起始", variant: "DP",
        rarity: "Deck", position: "セッター", school: "稻荷崎・2年",
        stats: { serve: 2, block: 2, receive: 0, toss: 1, attack: 0 },
        zone: "舉球區域", copies: 1,
        skill: "支付2點資源（犧牲下方2張卡），舉球點數 +1（1→2），並從自己事件區把〔今天要做什麼？〕最多1張加入手牌；若有加入，從手牌選1張卡放到牌組最下面。",
        image: "assets/cards/HV-D03-001-DP.webp"
    },
    {
        code: "HV-D03-002", name: "宮治", type: "character", series: "D03 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "稻荷崎・2年",
        stats: { serve: 1, block: 1, receive: 1, toss: 1, attack: 2 },
        zone: "攻擊區域", copies: 2,
        skill: "若自己的舉球角色是〔宮侑〕，可從手牌選1張卡放到牌組最下面，攻擊點數 +2。",
        image: "assets/cards/HV-D03-002.webp"
    },
    {
        code: "HV-D03-002", name: "宮治", type: "character", series: "D03 起始", variant: "DP",
        rarity: "Deck", position: "ウイングスパイカー", school: "稻荷崎・2年",
        stats: { serve: 1, block: 1, receive: 1, toss: 1, attack: 2 },
        zone: "攻擊區域", copies: 1,
        skill: "若自己的舉球角色是〔宮侑〕，可從手牌選1張卡放到牌組最下面，攻擊點數 +2。",
        image: "assets/cards/HV-D03-002-DP.webp"
    },
    {
        code: "HV-D03-003", name: "宮侑", type: "character", series: "D03 起始",
        rarity: "Deck", position: "セッター", school: "稻荷崎・2年",
        stats: { serve: 5, block: 0, receive: 0, toss: 1, attack: 0 },
        zone: "發球區域", copies: 2,
        skill: "從手牌選1張事件卡放到事件區即可使用。抽1張卡，並從以下擇一發動：這張卡的發球點數 +1；或下一個對手回合中，對手每有1名舉球角色登場，就讓該角色舉球點數 -2。（用這個技能放置的事件卡，其技能無法使用）",
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
        copies: 2,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D03-005.webp"
    },
    {
        code: "HV-D03-006", name: "北信介", type: "character", series: "D03 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "稻荷崎・3年",
        stats: { serve: 2, block: 0, receive: 5, toss: 1, attack: 0 },
        copies: 3,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D03-006.webp"
    },
    {
        code: "HV-D03-007", name: "角名倫太郎", type: "character", series: "D03 起始",
        rarity: "Deck", position: "ミドルブロッカー", school: "稻荷崎・2年",
        stats: { serve: 2, block: 3, receive: 3, toss: 0, attack: 3 },
        copies: 4,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D03-007.webp"
    },
    {
        code: "HV-D03-008", name: "尾白亞蘭", type: "character", series: "D03 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "稻荷崎・3年",
        stats: { serve: 4, block: 0, receive: 1, toss: 0, attack: 3 },
        zone: "攻擊區域", copies: 4,
        skill: "支付5點資源（犧牲下方5張卡），攻擊點數 +2。",
        image: "assets/cards/HV-D03-008.webp"
    },
    {
        code: "HV-D03-009", name: "銀島結", type: "character", series: "D03 起始",
        rarity: "Deck", position: "ウイングスパイカー", school: "稻荷崎・2年",
        stats: { serve: 2, block: 2, receive: 4, toss: 0, attack: 3 },
        copies: 4,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D03-009.webp"
    },
    {
        code: "HV-D03-010", name: "大耳練", type: "character", series: "D03 起始",
        rarity: "Deck", position: "ミドルブロッカー", school: "稻荷崎・3年",
        stats: { serve: 3, block: 3, receive: 2, toss: 0, attack: 3 },
        copies: 3,
        skill: "無特殊技能。",
        image: "assets/cards/HV-D03-010.webp"
    },
    {
        code: "HV-D03-011", name: "赤木路成", type: "character", series: "D03 起始",
        rarity: "Deck", position: "リベロ", school: "稻荷崎・3年",
        stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域", copies: 2,
        skill: "支付2點資源（犧牲下方2張卡），接球點數 +2。",
        image: "assets/cards/HV-D03-011.webp"
    },
    {
        code: "HV-D03-012", name: "這就是冠軍候補的樣子", type: "event", series: "D03 起始",
        rarity: "Deck", category: "接球", copies: 4,
        skill: "抽1張卡，自己1名稻荷崎角色的接球點數 +1。若從自己接球區支付4點資源（犧牲該區角色下方4張卡），可再抽1張卡。",
        image: "assets/cards/HV-D03-012.webp"
    },
    {
        code: "HV-D03-013", name: "今天要做什麼？", type: "event", series: "D03 起始",
        rarity: "Deck", category: "舉球／攻擊", copies: 4,
        skill: "若自己的舉球角色是〔宮侑〕或〔宮治〕，才可使用此卡。抽1張卡，該角色舉球點數 +1。",
        image: "assets/cards/HV-D03-013.webp"
    },
    // #endregion D03 起始

    // #region P01（共 58 筆：紀念卡 6 ＋ 補充包 52）
    {
        code: "HV-P01-001", name: "日向翔陽", type: "character", series: "P01 紀念卡",
        rarity: "H", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 2, block: 3, receive: 4, toss: 0, attack: 2 },
        skill: "無特殊技能。",
        playable: false,
        image: "assets/cards/HV-P01-001-H.webp"
    },
    {
        code: "HV-P01-002", name: "日向翔陽", type: "character", series: "P01 補充包",
        rarity: "I", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 2, block: 3, receive: 1, toss: 0, attack: 1 },
        zone: "攻擊區域",
        skill: "支付3點資源（犧牲下方3張卡），攻擊點數 +4，並讓下一個對手回合中，對手不能讓原始接球點數≥6的接球角色登場。",
        image: "assets/cards/HV-P01-002-I.webp"
    },
    {
        code: "HV-P01-002", name: "日向翔陽", type: "character", series: "P01 補充包",
        rarity: "IP", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 2, block: 3, receive: 1, toss: 0, attack: 1 },
        zone: "攻擊區域",
        skill: "支付3點資源（犧牲下方3張卡），攻擊點數 +4，並讓下一個對手回合中，對手不能讓原始接球點數≥6的接球角色登場。",
        image: "assets/cards/HV-P01-002-IP.webp"
    },
    {
        code: "HV-P01-003", name: "日向翔陽", type: "character", series: "P01 補充包",
        rarity: "S", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 1, block: 2, receive: 2, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "若這張卡是從手牌登場，且自己手牌≤3張，且自己的舉球角色是〔影山飛雄〕，可使用此卡。攻擊點數 +2，並讓下一個對手回合中，對手最多只能讓2名阻擋角色登場。",
        image: "assets/cards/HV-P01-003.webp"
    },
    {
        code: "HV-P01-004", name: "日向翔陽", type: "character", series: "P01 紀念卡",
        rarity: "K", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 2, block: 0, receive: 5, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        playable: false,
        image: "assets/cards/HV-P01-004-K.webp"
    },
    {
        code: "HV-P01-004", name: "日向翔陽", type: "character", series: "P01 紀念卡",
        rarity: "KP", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 2, block: 0, receive: 5, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        playable: false,
        image: "assets/cards/HV-P01-004-KP.webp"
    },
    {
        code: "HV-P01-004", name: "日向翔陽", type: "character", series: "P01 補充包",
        rarity: "R", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 2, block: 0, receive: 5, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-004-R.webp"
    },
    {
        code: "HV-P01-005", name: "影山飛雄", type: "character", series: "P01 紀念卡",
        rarity: "H", position: "セッター", school: "烏野・1年",
        stats: { serve: 4, block: 1, receive: 2, toss: 2, attack: 1 },
        skill: "無特殊技能。",
        playable: false,
        image: "assets/cards/HV-P01-005-H.webp"
    },
    {
        code: "HV-P01-006", name: "影山飛雄", type: "character", series: "P01 補充包",
        rarity: "I", position: "セッター", school: "烏野・1年",
        stats: { serve: 1, block: 1, receive: 1, toss: 1, attack: 2 },
        zone: "舉球區域",
        skill: "支付2點資源（犧牲下方2張卡），公開自己牌組最上面1張，若是〔日向翔陽〕或〔開放攻擊〕就加入手牌，沒加入的放到牌組最下面。此外，這回合內，自己每有1名〔日向翔陽〕登場，該角色攻擊點數 +2。",
        image: "assets/cards/HV-P01-006-I.webp"
    },
    {
        code: "HV-P01-006", name: "影山飛雄", type: "character", series: "P01 補充包",
        rarity: "IP", position: "セッター", school: "烏野・1年",
        stats: { serve: 1, block: 1, receive: 1, toss: 1, attack: 2 },
        zone: "舉球區域",
        skill: "支付2點資源（犧牲下方2張卡），公開自己牌組最上面1張，若是〔日向翔陽〕或〔開放攻擊〕就加入手牌，沒加入的放到牌組最下面。此外，這回合內，自己每有1名〔日向翔陽〕登場，該角色攻擊點數 +2。",
        image: "assets/cards/HV-P01-006-IP.webp"
    },
    {
        code: "HV-P01-007", name: "影山飛雄", type: "character", series: "P01 補充包",
        rarity: "R", position: "セッター", school: "烏野・1年",
        stats: { serve: 2, block: 2, receive: 1, toss: 2, attack: 2 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-007.webp"
    },
    {
        code: "HV-P01-008", name: "月島螢", type: "character", series: "P01 補充包",
        rarity: "S", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 1, block: 2, receive: 2, toss: 0, attack: 2 },
        zone: "阻擋區域",
        skill: "支付2點資源（犧牲下方2張卡），同時發動以下兩項效果：若自己場上有〔山口忠〕角色，這張卡的阻擋點數 +2；這回合內，只要阻擋成功，就觸發〔絕殺鎖定6〕（這回合結束時，自己的進攻點數會被強制設定為6）。",
        image: "assets/cards/HV-P01-008-S.webp"
    },
    {
        code: "HV-P01-008", name: "月島螢", type: "character", series: "P01 補充包",
        rarity: "SP", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 1, block: 2, receive: 2, toss: 0, attack: 2 },
        zone: "阻擋區域",
        skill: "支付2點資源（犧牲下方2張卡），同時發動以下兩項效果：若自己場上有〔山口忠〕角色，這張卡的阻擋點數 +2；這回合內，只要阻擋成功，就觸發〔絕殺鎖定6〕（這回合結束時，自己的進攻點數會被強制設定為6）。",
        image: "assets/cards/HV-P01-008-SP.webp"
    },
    {
        code: "HV-P01-009", name: "月島螢", type: "character", series: "P01 補充包",
        rarity: "N", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 2, block: 3, receive: 3, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-009.webp"
    },
    {
        code: "HV-P01-010", name: "山口忠", type: "character", series: "P01 補充包",
        rarity: "S", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 2, block: 2, receive: 0, toss: 0, attack: 3 },
        zone: "發球區域",
        skill: "公開自己牌組最上面1張，若是烏野的卡，下一個對手回合中，對手每有1名舉球角色登場，就讓該角色舉球點數 -2。公開的卡放回牌組最下面。",
        image: "assets/cards/HV-P01-010.webp"
    },
    {
        code: "HV-P01-011", name: "西谷夕", type: "character", series: "P01 補充包",
        rarity: "R", position: "リベロ", school: "烏野・2年",
        stats: { serve: null, block: null, receive: 6, toss: 0, attack: 0 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-011.webp"
    },
    {
        code: "HV-P01-011", name: "西谷夕", type: "character", series: "P01 補充包",
        rarity: "RP", position: "リベロ", school: "烏野・2年",
        stats: { serve: null, block: null, receive: 6, toss: 0, attack: 0 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-011-RP.webp"
    },
    {
        code: "HV-P01-012", name: "田中龍之介", type: "character", series: "P01 補充包",
        rarity: "N", position: "ウイングスパイカー", school: "烏野・2年",
        stats: { serve: 5, block: 2, receive: 2, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-012-N.webp"
    },
    {
        code: "HV-P01-012", name: "田中龍之介", type: "character", series: "P01 補充包",
        rarity: "NP", position: "ウイングスパイカー", school: "烏野・2年",
        stats: { serve: 5, block: 2, receive: 2, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-012-NP.webp"
    },
    {
        code: "HV-P01-013", name: "緣下力", type: "character", series: "P01 補充包",
        rarity: "N", position: "ウイングスパイカー", school: "烏野・2年",
        stats: { serve: 5, block: 2, receive: 2, toss: 0, attack: 3 },
        skill: "【從手牌丟棄這張卡】：自己場上1名烏野角色的接球點數 +2。發動時機：接球階段中，只要這張卡仍在手牌，就能像事件卡一樣的時機發動此效果。",
        image: "assets/cards/HV-P01-013.webp"
    },
    {
        code: "HV-P01-014", name: "澤村大地", type: "character", series: "P01 補充包",
        rarity: "R", position: "ウイングスパイカー", school: "烏野・3年",
        stats: { serve: 1, block: 3, receive: 5, toss: 0, attack: 0 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-014-R.webp"
    },
    {
        code: "HV-P01-014", name: "澤村大地", type: "character", series: "P01 補充包",
        rarity: "RP", position: "ウイングスパイカー", school: "烏野・3年",
        stats: { serve: 1, block: 3, receive: 5, toss: 0, attack: 0 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-014-RP.webp"
    },
    {
        code: "HV-P01-015", name: "菅原孝支", type: "character", series: "P01 補充包",
        rarity: "N", position: "セッター", school: "烏野・3年",
        stats: { serve: 1, block: 0, receive: 2, toss: 1, attack: 2 },
        zone: "舉球區域",
        skill: "支付2點資源（犧牲下方2張卡），抽1張卡，舉球點數 +1。",
        image: "assets/cards/HV-P01-015-N.webp"
    },
    {
        code: "HV-P01-015", name: "菅原孝支", type: "character", series: "P01 補充包",
        rarity: "NP", position: "セッター", school: "烏野・3年",
        stats: { serve: 1, block: 0, receive: 2, toss: 1, attack: 2 },
        zone: "舉球區域",
        skill: "支付2點資源（犧牲下方2張卡），抽1張卡，舉球點數 +1。",
        image: "assets/cards/HV-P01-015-NP.webp"
    },
    {
        code: "HV-P01-016", name: "東峰旭", type: "character", series: "P01 補充包",
        rarity: "N", position: "ウイングスパイカー", school: "烏野・3年",
        stats: { serve: 3, block: 0, receive: 1, toss: 0, attack: 3 },
        zone: "攻擊區域",
        skill: "支付2點資源（犧牲下方2張卡），抽1張卡，舉球點數 +1。",
        image: "assets/cards/HV-P01-016.webp"
    },
    {
        code: "HV-P01-017", name: "孤爪研磨", type: "character", series: "P01 紀念卡",
        rarity: "H", position: "セッター", school: "音駒・2年",
        stats: { serve: 2, block: 2, receive: 2, toss: 2, attack: 1 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-017-H.webp"
    },
    {
        code: "HV-P01-018", name: "孤爪研磨", type: "character", series: "P01 補充包",
        rarity: "I", position: "セッター", school: "音駒・2年",
        stats: { serve: 1, block: 2, receive: 0, toss: 1, attack: 1 },
        zone: "舉球區域",
        skill: "支付3點資源（犧牲下方3張卡），舉球點數 +1；若自己場上所有角色都是音駒，從自己事件區把最多1張卡加入手牌。",
        image: "assets/cards/HV-P01-018-I.webp"
    },
    {
        code: "HV-P01-018", name: "孤爪研磨", type: "character", series: "P01 補充包",
        rarity: "IP", position: "セッター", school: "音駒・2年",
        stats: { serve: 1, block: 2, receive: 0, toss: 1, attack: 1 },
        zone: "舉球區域",
        skill: "支付3點資源（犧牲下方3張卡），舉球點數 +1；若自己場上所有角色都是音駒，從自己事件區把最多1張卡加入手牌。",
        image: "assets/cards/HV-P01-018-IP.webp"
    },
    {
        code: "HV-P01-019", name: "孤爪研磨", type: "character", series: "P01 補充包",
        rarity: "R", position: "セッター", school: "音駒・2年",
        stats: { serve: 1, block: 1, receive: 2, toss: 1, attack: 1 },
        zone: "舉球區域",
        skill: "當自己原始攻擊點數為3的攻擊角色登場時，若這張卡是舉球角色，可支付2點資源（犧牲下方2張卡）發動。從自己攻擊區的音駒資源卡中選1張，以攻擊角色身份登場，該角色攻擊點數 +2。",
        image: "assets/cards/HV-P01-019.webp"
    },
    {
        code: "HV-P01-020", name: "黑尾鐵朗", type: "character", series: "P01 紀念卡",
        rarity: "H", position: "ミドルブロッカー", school: "音駒・3年",
        stats: { serve: 5, block: 2, receive: 2, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-020-H.webp"
    },
    {
        code: "HV-P01-021", name: "黑尾鐵朗", type: "character", series: "P01 補充包",
        rarity: "I", position: "ミドルブロッカー", school: "音駒・3年",
        stats: { serve: 2, block: 2, receive: 3, toss: 0, attack: 1 },
        zone: "攻擊區域",
        skill: "支付3點資源（犧牲下方3張卡），攻擊點數 +3，並從自己任1個區域，選2張卡名不同的音駒資源卡加入手牌。",
        image: "assets/cards/HV-P01-021-I.webp"
    },
    {
        code: "HV-P01-021", name: "黑尾鐵朗", type: "character", series: "P01 補充包",
        rarity: "IP", position: "ミドルブロッカー", school: "音駒・3年",
        stats: { serve: 2, block: 2, receive: 3, toss: 0, attack: 1 },
        zone: "攻擊區域",
        skill: "支付3點資源（犧牲下方3張卡），攻擊點數 +3，並從自己任1個區域，選2張卡名不同的音駒資源卡加入手牌。",
        image: "assets/cards/HV-P01-021-IP.webp"
    },
    {
        code: "HV-P01-022", name: "黑尾鐵朗", type: "character", series: "P01 補充包",
        rarity: "S", position: "ミドルブロッカー", school: "音駒・3年",
        stats: { serve: 1, block: 1, receive: 5, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-022.webp"
    },
    {
        code: "HV-P01-023", name: "夜久衛輔", type: "character", series: "P01 補充包",
        rarity: "S", position: "リベロ", school: "音駒・3年",
        stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "當這張接球角色上方登場了〔夜久衛輔〕以外的音駒角色時，可丟棄這張卡發動。該角色接球點數 +2。",
        image: "assets/cards/HV-P01-023-S.webp"
    },
    {
        code: "HV-P01-023", name: "夜久衛輔", type: "character", series: "P01 補充包",
        rarity: "SP", position: "リベロ", school: "音駒・3年",
        stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "當這張接球角色上方登場了〔夜久衛輔〕以外的音駒角色時，可丟棄這張卡發動。該角色接球點數 +2。",
        image: "assets/cards/HV-P01-023-SP.webp"
    },
    {
        code: "HV-P01-024", name: "夜久衛輔", type: "character", series: "P01 補充包",
        rarity: "N", position: "リベロ", school: "音駒・3年",
        stats: { serve: null, block: null, receive: 6, toss: 0, attack: 0 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-024.webp"
    },
    {
        code: "HV-P01-025", name: "灰羽利耶夫", type: "character", series: "P01 補充包",
        rarity: "S", position: "ミドルブロッカー", school: "音駒・1年",
        stats: { serve: 1, block: 3, receive: 1, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "支付2點資源（犧牲下方2張卡），同時發動以下兩項效果：若這張卡是透過〔孤爪研磨〕的技能登場的，攻擊點數 +2；下一個對手回合中，對手每有1名中間阻攔手登場，就讓該角色阻擋點數 -3。",
        image: "assets/cards/HV-P01-025.webp"
    },
    {
        code: "HV-P01-026", name: "灰羽利耶夫", type: "character", series: "P01 補充包",
        rarity: "N", position: "ミドルブロッカー", school: "音駒・1年",
        stats: { serve: 2, block: 3, receive: 3, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-026.webp"
    },
    {
        code: "HV-P01-027", name: "海信行", type: "character", series: "P01 補充包",
        rarity: "R", position: "ウイングスパイカー", school: "音駒・3年",
        stats: { serve: 1, block: 0, receive: 4, toss: 1, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-027-R.webp"
    },
    {
        code: "HV-P01-027", name: "海信行", type: "character", series: "P01 補充包",
        rarity: "RP", position: "ウイングスパイカー", school: "音駒・3年",
        stats: { serve: 1, block: 0, receive: 4, toss: 1, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-027-RP.webp"
    },
    {
        code: "HV-P01-028", name: "山本猛虎", type: "character", series: "P01 補充包",
        rarity: "N", position: "ウイングスパイカー", school: "音駒・2年",
        stats: { serve: 1, block: 2, receive: 0, toss: 0, attack: 3 },
        zone: "攻擊區域",
        skill: "當這張攻擊角色上方登場了〔灰羽利耶夫〕時，可從自己手牌丟棄1張音駒的卡發動。該角色攻擊點數 +1。",
        image: "assets/cards/HV-P01-028.webp"
    },
    {
        code: "HV-P01-029", name: "福永招平", type: "character", series: "P01 補充包",
        rarity: "R", position: "ウイングスパイカー", school: "音駒・2年",
        stats: { serve: 1, block: 1, receive: 5, toss: 1, attack: 0 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-029-R.webp"
    },
    {
        code: "HV-P01-029", name: "福永招平", type: "character", series: "P01 補充包",
        rarity: "RP", position: "ウイングスパイカー", school: "音駒・2年",
        stats: { serve: 1, block: 1, receive: 5, toss: 1, attack: 0 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-029-RP.webp"
    },
    {
        code: "HV-P01-030", name: "犬岡走", type: "character", series: "P01 補充包",
        rarity: "N", position: "ミドルブロッカー", school: "音駒・1年",
        stats: { serve: 1, block: 3, receive: 5, toss: 0, attack: 0 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-030.webp"
    },
    {
        code: "HV-P01-031", name: "芝山優生", type: "character", series: "P01 補充包",
        rarity: "N", position: "リベロ", school: "音駒・1年",
        stats: { serve: null, block: null, receive: 4, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "【從手牌丟棄這張卡】：自己場上1名音駒角色的接球點數 +2。發動時機：接球階段中，只要這張卡仍在手牌，就能像事件卡一樣的時機發動此效果。",
        image: "assets/cards/HV-P01-031.webp"
    },
    {
        code: "HV-P01-032", name: "手白球彥", type: "character", series: "P01 補充包",
        rarity: "R", position: "セッター", school: "音駒・1年",
        stats: { serve: 3, block: 1, receive: 1, toss: 1, attack: 0 },
        zone: "發球區域",
        skill: "下一個對手回合中，無效化對手接球角色與舉球角色的技能。",
        image: "assets/cards/HV-P01-032.webp"
    },
    {
        code: "HV-P01-033", name: "及川徹", type: "character", series: "P01 補充包",
        rarity: "I", position: "セッター", school: "青葉城西・3年",
        stats: { serve: 5, block: 0, receive: 0, toss: 1, attack: 0 },
        zone: "發球區域／舉球區域",
        skill: "從自己手牌丟棄1張青葉城西的卡即可使用。這張卡任1項數值 +1；若對手手牌≥4張，對手必須從手牌丟棄1張卡。",
        image: "assets/cards/HV-P01-033-I.webp"
    },
    {
        code: "HV-P01-033", name: "及川徹", type: "character", series: "P01 補充包",
        rarity: "IP", position: "セッター", school: "青葉城西・3年",
        stats: { serve: 5, block: 0, receive: 0, toss: 1, attack: 0 },
        zone: "發球區域／舉球區域",
        skill: "從自己手牌丟棄1張青葉城西的卡即可使用。這張卡任1項數值 +1；若對手手牌≥4張，對手必須從手牌丟棄1張卡。",
        image: "assets/cards/HV-P01-033-IP.webp"
    },
    {
        code: "HV-P01-034", name: "及川徹", type: "character", series: "P01 補充包",
        rarity: "R", position: "セッター", school: "青葉城西・3年",
        stats: { serve: 5, block: 0, receive: 0, toss: 1, attack: 0 },
        zone: "發球區域",
        skill: "支付1點資源（犧牲下方1張卡）；若支付的是青葉城西的卡，對手必須把手牌全部洗回牌組，重新抽6張。",
        image: "assets/cards/HV-P01-034.webp"
    },
    {
        code: "HV-P01-035", name: "岩泉一", type: "character", series: "P01 補充包",
        rarity: "S", position: "ウイングスパイカー", school: "青葉城西・3年",
        stats: { serve: 1, block: 3, receive: 1, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "從自己手牌丟棄1張青葉城西的卡即可使用。攻擊點數 +2；若對手手牌≤4張，下一個對手回合中，對手無法透過技能把卡加入手牌。",
        image: "assets/cards/HV-P01-035-S.webp"
    },
    {
        code: "HV-P01-035", name: "岩泉一", type: "character", series: "P01 補充包",
        rarity: "SP", position: "ウイングスパイカー", school: "青葉城西・3年",
        stats: { serve: 1, block: 3, receive: 1, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "從自己手牌丟棄1張青葉城西的卡即可使用。攻擊點數 +2；若對手手牌≤4張，下一個對手回合中，對手無法透過技能把卡加入手牌。",
        image: "assets/cards/HV-P01-035-SP.webp"
    },
    {
        code: "HV-P01-036", name: "金田一勇太郎", type: "character", series: "P01 補充包",
        rarity: "N", position: "ミドルブロッカー", school: "青葉城西・1年",
        stats: { serve: 3, block: 3, receive: 2, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-036.webp"
    },
    {
        code: "HV-P01-037", name: "松川一靜", type: "character", series: "P01 補充包",
        rarity: "N", position: "ミドルブロッカー", school: "青葉城西・3年",
        stats: { serve: 1, block: 3, receive: 1, toss: 0, attack: 2 },
        zone: "阻擋區域",
        skill: "若對手進攻點數≥8，支付1點資源（犧牲下方1張卡）即可使用。立刻結束阻擋階段，直接進入自己抽牌階段。此外，這回合內，自己每有1名青葉城西接球角色登場，該角色接球點數 +3。",
        image: "assets/cards/HV-P01-037.webp"
    },
    {
        code: "HV-P01-038", name: "花卷貴大", type: "character", series: "P01 補充包",
        rarity: "N", position: "ウイングスパイカー", school: "青葉城西・3年",
        stats: { serve: 1, block: 2, receive: 5, toss: 0, attack: 2 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-038.webp"
    },
    {
        code: "HV-P01-039", name: "渡親治", type: "character", series: "P01 補充包",
        rarity: "N", position: "リベロ", school: "青葉城西・2年",
        stats: { serve: null, block: null, receive: 5, toss: 1, attack: 0 },
        zone: "接球區域",
        skill: "若對手進攻點數≥6，從自己手牌丟棄1張青葉城西的卡即可使用。接球點數 +1；若自己場上所有角色都是青葉城西，再抽1張卡。",
        image: "assets/cards/HV-P01-039.webp"
    },
    {
        code: "HV-P01-040", name: "矢巾秀", type: "character", series: "P01 補充包",
        rarity: "N", position: "セッター", school: "青葉城西・2年",
        stats: { serve: 2, block: 1, receive: 3, toss: 2, attack: 2 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-040.webp"
    },
    {
        code: "HV-P01-041", name: "國見英", type: "character", series: "P01 補充包",
        rarity: "R", position: "ウイングスパイカー", school: "青葉城西・1年",
        stats: { serve: 1, block: 0, receive: 5, toss: 0, attack: 0 },
        zone: "攻擊區域",
        skill: "若自己場上所有角色都是青葉城西，且對手手牌≤3張，支付1點資源（犧牲下方1張卡）即可使用。觸發〔佯攻4〕（這回合結束時，自己的進攻點數會被強制設定為4，且下一個對手回合中，對手不能讓阻擋角色登場）。",
        image: "assets/cards/HV-P01-041.webp"
    },
    {
        code: "HV-P01-042", name: "京谷賢太郎", type: "character", series: "P01 補充包",
        rarity: "R", position: "ウイングスパイカー", school: "青葉城西・2年",
        stats: { serve: 5, block: 0, receive: 4, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-042.webp"
    },
    {
        code: "HV-P01-043", name: "木兔光太郎", type: "character", series: "P01 補充包",
        rarity: "I", position: "ウイングスパイカー", school: "梟谷・3年",
        stats: { serve: 4, block: 1, receive: 2, toss: 0, attack: 0 },
        zone: "攻擊區域",
        skill: "若這張卡是從手牌登場,且自己場上所有角色都是梟谷,且自己攻擊區資源卡數量為奇數,可使用此卡。攻擊點數 +5。",
        image: "assets/cards/HV-P01-043-I.webp"
    },
    {
        code: "HV-P01-043", name: "木兔光太郎", type: "character", series: "P01 補充包",
        rarity: "IP", position: "ウイングスパイカー", school: "梟谷・3年",
        stats: { serve: 4, block: 1, receive: 2, toss: 0, attack: 0 },
        zone: "攻擊區域",
        skill: "若這張卡是從手牌登場,且自己場上所有角色都是梟谷,且自己攻擊區資源卡數量為奇數,可使用此卡。攻擊點數 +5。",
        image: "assets/cards/HV-P01-043-IP.webp"
    },
    {
        code: "HV-P01-044", name: "木兔光太郎", type: "character", series: "P01 補充包",
        rarity: "R", position: "ウイングスパイカー", school: "梟谷・3年",
        stats: { serve: 5, block: 2, receive: 2, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-044.webp"
    },
    {
        code: "HV-P01-045", name: "赤葦京治", type: "character", series: "P01 補充包",
        rarity: "S", position: "セッター", school: "梟谷・3年",
        stats: { serve: 2, block: 1, receive: 0, toss: 1, attack: 2 },
        zone: "舉球區域",
        skill: "從自己舉球區和攻擊區合計支付4點資源(犧牲下方共4張卡)即可使用。舉球點數 +2,並從自己棄牌區選最多1張〔木兔光太郎〕加入手牌。",
        image: "assets/cards/HV-P01-045-S.webp"
    },
    {
        code: "HV-P01-045", name: "赤葦京治", type: "character", series: "P01 補充包",
        rarity: "SP", position: "セッター", school: "梟谷・3年",
        stats: { serve: 2, block: 1, receive: 0, toss: 1, attack: 2 },
        zone: "舉球區域",
        skill: "從自己舉球區和攻擊區合計支付4點資源(犧牲下方共4張卡)即可使用。舉球點數 +2,並從自己棄牌區選最多1張〔木兔光太郎〕加入手牌。",
        image: "assets/cards/HV-P01-045-SP.webp"
    },
    {
        code: "HV-P01-046", name: "赤葦京治", type: "character", series: "P01 補充包",
        rarity: "R", position: "セッター", school: "梟谷・3年",
        stats: { serve: 1, block: 2, receive: 3, toss: 2, attack: 1 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-046.webp"
    },
    {
        code: "HV-P01-047", name: "木葉秋紀", type: "character", series: "P01 補充包",
        rarity: "R", position: "ウイングスパイカー", school: "梟谷・3年",
        stats: { serve: 1, block: 0, receive: 5, toss: 0, attack: 0 },
        zone: "攻擊區域",
        skill: "當這張攻擊角色上方登場了梟谷角色時,可從自己手牌丟棄1張卡發動。該角色攻擊點數 +1。",
        image: "assets/cards/HV-P01-047.webp"
    },
    {
        code: "HV-P01-048", name: "木葉秋紀", type: "character", series: "P01 補充包",
        rarity: "N", position: "ウイングスパイカー", school: "梟谷・3年",
        stats: { serve: 1, block: 2, receive: 2, toss: 1, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-048-N.webp"
    },
    {
        code: "HV-P01-048", name: "木葉秋紀", type: "character", series: "P01 補充包",
        rarity: "NP", position: "ウイングスパイカー", school: "梟谷・3年",
        stats: { serve: 1, block: 2, receive: 2, toss: 1, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-048-NP.webp"
    },
    {
        code: "HV-P01-049", name: "猿代大和", type: "character", series: "P01 補充包",
        rarity: "N", position: "ウイングスパイカー", school: "梟谷・3年",
        stats: { serve: 1, block: 3, receive: 0, toss: 1, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-049.webp"
    },
    {
        code: "HV-P01-050", name: "小見春樹", type: "character", series: "P01 補充包",
        rarity: "N", position: "リベロ", school: "梟谷・3年",
        stats: { serve: null, block: null, receive: 6, toss: 0, attack: 0 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-050.webp"
    },
    {
        code: "HV-P01-051", name: "鷲尾辰生", type: "character", series: "P01 補充包",
        rarity: "N", position: "ミドルブロッカー", school: "梟谷・3年",
        stats: { serve: 3, block: 3, receive: 1, toss: 0, attack: 0 },
        zone: "阻擋區域",
        skill: "若對手進攻點數≥4,丟棄自己牌組最上面1張卡即可使用。若丟棄的卡是梟谷,觸發〔單觸3〕(對手進攻點數 -3,立刻結束阻擋階段,直接進入自己抽牌階段)。",
        image: "assets/cards/HV-P01-051.webp"
    },
    {
        code: "HV-P01-052", name: "尾長涉", type: "character", series: "P01 補充包",
        rarity: "N", position: "ミドルブロッカー", school: "梟谷・1年",
        stats: { serve: 2, block: 3, receive: 3, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-052.webp"
    },
    {
        code: "HV-P01-053", name: "池尻隼人", type: "character", series: "P01 補充包",
        rarity: "N", position: "ウイングスパイカー", school: "常波・3年",
        stats: { serve: 1, block: 2, receive: 5, toss: 0, attack: 2 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-053.webp"
    },
    {
        code: "HV-P01-054", name: "青根高伸", type: "character", series: "P01 補充包",
        rarity: "N", position: "ミドルブロッカー", school: "伊達工・3年",
        stats: { serve: 1, block: 2, receive: 1, toss: 0, attack: 3 },
        zone: "阻擋區域",
        skill: "支付3點資源(犧牲下方3張卡),阻擋點數 +5。",
        image: "assets/cards/HV-P01-054-N.webp"
    },
    {
        code: "HV-P01-055", name: "二口堅治", type: "character", series: "P01 補充包",
        rarity: "N", position: "ウイングスパイカー", school: "伊達工・3年",
        stats: { serve: 5, block: 3, receive: 0, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-055-N.webp"
    },
    {
        code: "HV-P01-055", name: "二口堅治", type: "character", series: "P01 補充包",
        rarity: "NP", position: "ウイングスパイカー", school: "伊達工・3年",
        stats: { serve: 5, block: 3, receive: 0, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-055-NP.webp"
    },
    {
        code: "HV-P01-056", name: "牛島若利", type: "character", series: "P01 補充包",
        rarity: "S", position: "ウイングスパイカー", school: "白鳥澤・3年",
        stats: { serve: 4, block: 0, receive: 3, toss: 0, attack: 2 },
        zone: "發球區域／攻擊區域",
        skill: "從自己手牌選1張事件卡放到事件區即可使用。抽1張卡,這張卡任1項數值 +2。",
        image: "assets/cards/HV-P01-056-S.webp"
    },
    {
        code: "HV-P01-057", name: "天童覺", type: "character", series: "P01 補充包",
        rarity: "N", position: "ミドルブロッカー", school: "白鳥澤・3年",
        stats: { serve: 1, block: 3, receive: 0, toss: 0, attack: 2 },
        zone: "阻擋區域",
        skill: "下一個對手回合中,對手每透過抽牌以外的方式把卡加入手牌,自己就抽1張卡。",
        image: "assets/cards/HV-P01-057.webp"
    },
    {
        code: "HV-P01-058", name: "五色工", type: "character", series: "P01 補充包",
        rarity: "N", position: "ウイングスパイカー", school: "白鳥澤・1年",
        stats: { serve: 5, block: 2, receive: 2, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-058.webp"
    },
    {
        code: "HV-P01-059", name: "十和田良樹", type: "character", series: "P01 補充包",
        rarity: "N", position: "ウイングスパイカー", school: "扇南・2年",
        stats: { serve: 3, block: 1, receive: 5, toss: 0, attack: 2 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-059.webp"
    },
    {
        code: "HV-P01-060", name: "百澤雄大", type: "character", series: "P01 補充包",
        rarity: "N", position: "ウイングスパイカー", school: "角川・1年",
        stats: { serve: 1, block: 3, receive: 1, toss: 0, attack: 2 },
        zone: "阻擋區域",
        skill: "若對手進攻點數≥4,可使用此卡。觸發〔單觸2〕(對手進攻點數 -2,立刻結束阻擋階段,直接進入自己抽牌階段)。",
        image: "assets/cards/HV-P01-060.webp"
    },
    {
        code: "HV-P01-061", name: "照島遊見", type: "character", series: "P01 補充包",
        rarity: "N", position: "ウイングスパイカー", school: "條善寺・2年",
        stats: { serve: 2, block: 2, receive: 1, toss: 1, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-061.webp"
    },
    {
        code: "HV-P01-062", name: "中島猛", type: "character", series: "P01 補充包",
        rarity: "N", position: "ウイングスパイカー", school: "和久谷南・3年",
        stats: { serve: 1, block: 2, receive: 5, toss: 0, attack: 2 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-062.webp"
    },
    {
        code: "HV-P01-063", name: "宮侑", type: "character", series: "P01 補充包",
        rarity: "N", position: "セッター", school: "稻荷崎・2年",
        stats: { serve: 5, block: 1, receive: 1, toss: 2, attack: 1 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-063-N.webp"
    },
    {
        code: "HV-P01-063", name: "宮侑", type: "character", series: "P01 補充包",
        rarity: "NP", position: "セッター", school: "稻荷崎・2年",
        stats: { serve: 5, block: 1, receive: 1, toss: 2, attack: 1 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-063-NP.webp"
    },
    {
        code: "HV-P01-064", name: "宮治", type: "character", series: "P01 補充包",
        rarity: "N", position: "ウイングスパイカー", school: "稻荷崎・2年",
        stats: { serve: 2, block: 2, receive: 4, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-064-N.webp"
    },
    {
        code: "HV-P01-064", name: "宮治", type: "character", series: "P01 補充包",
        rarity: "NP", position: "ウイングスパイカー", school: "稻荷崎・2年",
        stats: { serve: 2, block: 2, receive: 4, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-064-NP.webp"
    },
    {
        code: "HV-P01-065", name: "北信介", type: "character", series: "P01 補充包",
        rarity: "N", position: "ウイングスパイカー", school: "稻荷崎・3年",
        stats: { serve: 2, block: 1, receive: 2, toss: 0, attack: 3 },
        zone: "接球區域",
        skill: "若對手事件區中,可於舉球或攻擊時機使用的卡合計≥5張,接球點數 +6。",
        image: "assets/cards/HV-P01-065.webp"
    },
    {
        code: "HV-P01-066", name: "星海光來", type: "character", series: "P01 補充包",
        rarity: "S", position: "ウイングスパイカー", school: "鷗台・2年",
        stats: { serve: 3, block: 2, receive: 1, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "若自己場上所有角色都是鷗台,或自己場上有4名以上不同所屬的角色,支付3點資源(犧牲下方3張卡)即可使用。攻擊點數 +3,並從對手事件區丟棄最多2張卡;若丟棄後對手事件區剩餘卡數≤2張,再額外攻擊點數 +1。",
        image: "assets/cards/HV-P01-066-S.webp"
    },
    {
        code: "HV-P01-066", name: "星海光來", type: "character", series: "P01 補充包",
        rarity: "SP", position: "ウイングスパイカー", school: "鷗台・2年",
        stats: { serve: 3, block: 2, receive: 1, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "若自己場上所有角色都是鷗台,或自己場上有4名以上不同所屬的角色,支付3點資源(犧牲下方3張卡)即可使用。攻擊點數 +3,並從對手事件區丟棄最多2張卡;若丟棄後對手事件區剩餘卡數≤2張,再額外攻擊點數 +1。",
        image: "assets/cards/HV-P01-066-SP.webp"
    },
    {
        code: "HV-P01-067", name: "晝神幸郎", type: "character", series: "P01 補充包",
        rarity: "R", position: "ミドルブロッカー", school: "鷗台・2年",
        stats: { serve: 5, block: 3, receive: 2, toss: 0, attack: 2 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-067.webp"
    },
    {
        code: "HV-P01-068", name: "佐久早聖臣", type: "character", series: "P01 補充包",
        rarity: "S", position: "ウイングスパイカー", school: "井闥山・2年",
        stats: { serve: 4, block: 0, receive: 3, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "若自己手牌≤3張,且自己場上有4名以上不同所屬的角色,可使用此卡。攻擊點數 +2,並觸發〔封鎖出局2〕(下一個對手回合中,若對手登場原始阻擋點數≤2的阻擋角色,對手直接落敗)。",
        image: "assets/cards/HV-P01-068.webp"
    },
    {
        code: "HV-P01-069", name: "越後榮", type: "character", series: "P01 補充包",
        rarity: "N", position: "セッター", school: "樁原・3年",
        stats: { serve: 1, block: 2, receive: 3, toss: 2, attack: 1 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-069.webp"
    },
    {
        code: "HV-P01-070", name: "白峰周", type: "character", series: "P01 補充包",
        rarity: "N", position: "セッター", school: "早流川工業・3年",
        stats: { serve: 2, block: 0, receive: 4, toss: 2, attack: 1 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-070.webp"
    },
    {
        code: "HV-P01-071", name: "大將優", type: "character", series: "P01 補充包",
        rarity: "R", position: "ウイングスパイカー", school: "戶美・3年",
        stats: { serve: 1, block: 1, receive: 5, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-071-R.webp"
    },
    {
        code: "HV-P01-071", name: "大將優", type: "character", series: "P01 補充包",
        rarity: "RP", position: "ウイングスパイカー", school: "戶美・3年",
        stats: { serve: 1, block: 1, receive: 5, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P01-071-RP.webp"
    },
    {
        code: "HV-P01-072", name: "日向・孤爪", type: "character", series: "P01 宣傳卡",
        rarity: "N", position: "ミドルブロッカー／セッター（雙面聯名卡）",
        school: "烏野・1年（日向翔陽）／音駒・2年（孤爪研磨）",
        stats: { serve: 1, block: 0, receive: 0, toss: 1, attack: 3 },
        skill: "登場時,可將這張卡的卡名從〔日向・孤爪〕改為〔日向翔陽〕或〔孤爪研磨〕其中一個(該回合結束前持續有效)。這張卡在計算場上角色人數時,算作1人。",
        image: "assets/cards/HV-P01-072.webp"
    },
    {
        code: "HV-P01-073", name: "月島・黑尾", type: "character", series: "P01 宣傳卡",
        rarity: "N", position: "ミドルブロッカー（雙面聯名卡）",
        school: "烏野・1年（月島螢）／音駒・3年（黑尾鐵朗）",
        stats: { serve: 2, block: 3, receive: 0, toss: 0, attack: 2 },
        skill: "登場時,可將這張卡的卡名從〔月島・黑尾〕改為〔月島螢〕或〔黑尾鐵朗〕其中一個(該回合結束前持續有效)。這張卡在計算場上角色人數時,算作1人。",
        image: "assets/cards/HV-P01-073.webp"
    },
    // #endregion P01

    // #region P02 （共 55 張）
    {
        code: "HV-P02-001", name: "日向翔陽", type: "character", series: "P02 補充包",
        rarity: "S", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 2, block: 2, receive: 0, toss: 0, attack: 3 },
        zone: "接球區域",
        skill: "若雙方SET牌區合計≤1張,支付3點資源(犧牲下方3張卡)即可使用。接球點數 +6,並從自己棄牌區選最多1張烏野角色卡加入手牌。",
        image: "assets/cards/HV-P02-001.webp"
    },
    {
        code: "HV-P02-002", name: "影山飛雄", type: "character", series: "P02 補充包",
        rarity: "S", position: "セッター", school: "烏野・1年",
        stats: { serve: 4, block: 1, receive: 0, toss: 1, attack: 0 },
        zone: "舉球區域",
        skill: "從自己手牌丟棄1張卡,並支付2點資源(犧牲下方2張卡)即可使用。舉球點數 +2,並從自己棄牌區選1張〔田中龍之介〕加入手牌。",
        image: "assets/cards/HV-P02-002-S.webp"
    },
    {
        code: "HV-P02-002", name: "影山飛雄", type: "character", series: "P02 補充包",
        rarity: "SP", position: "セッター", school: "烏野・1年",
        stats: { serve: 4, block: 1, receive: 0, toss: 1, attack: 0 },
        zone: "舉球區域",
        skill: "從自己手牌丟棄1張卡,並支付2點資源(犧牲下方2張卡)即可使用。舉球點數 +2,並從自己棄牌區選1張〔田中龍之介〕加入手牌。",
        image: "assets/cards/HV-P02-002-SP.webp"
    },
    {
        code: "HV-P02-003", name: "月島螢", type: "character", series: "P02 補充包",
        rarity: "I", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 1, block: 2, receive: 3, toss: 0, attack: 2 },
        zone: "阻擋區域",
        skill: "若對手事件區卡數≥2張,從自己手牌選1張事件卡放到事件區即可使用。抽1張卡,阻擋點數 +6。",
        image: "assets/cards/HV-P02-003-I.webp"
    },
    {
        code: "HV-P02-003", name: "月島螢", type: "character", series: "P02 補充包",
        rarity: "IP", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 1, block: 2, receive: 3, toss: 0, attack: 2 },
        zone: "阻擋區域",
        skill: "若對手事件區卡數≥2張,從自己手牌選1張事件卡放到事件區即可使用。抽1張卡,阻擋點數 +6。",
        image: "assets/cards/HV-P02-003-IP.webp"
    },
    {
        code: "HV-P02-004", name: "山口忠", type: "character", series: "P02 宣傳卡",
        rarity: "I", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 2, block: 3, receive: 0, toss: 0, attack: 2 },
        zone: "發球區域",
        skill: "若這張卡是疊在烏野角色上方登場的,對手可以選擇從手牌放1張事件卡到事件區;若對手沒有這麼做,下一個對手回合中,對手每把1張卡加入手牌,自己就抽1張卡。",
        image: "assets/cards/HV-P02-004-I.webp"
    },
    {
        code: "HV-P02-004", name: "山口忠", type: "character", series: "P02 宣傳卡",
        rarity: "IP", position: "ミドルブロッカー", school: "烏野・1年",
        stats: { serve: 2, block: 3, receive: 0, toss: 0, attack: 2 },
        zone: "發球區域",
        skill: "若這張卡是疊在烏野角色上方登場的,對手可以選擇從手牌放1張事件卡到事件區;若對手沒有這麼做,下一個對手回合中,對手每把1張卡加入手牌,自己就抽1張卡。",
        image: "assets/cards/HV-P02-004-IP.webp"
    },
    {
        code: "HV-P02-005", name: "西谷夕", type: "character", series: "P02 宣傳卡",
        rarity: "S", position: "リベロ", school: "烏野・2年",
        stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "限定條件：必須是透過〔助けてもらう!!!〕技能登場才能發動。條件符合後支付2點資源，接球點數 +2（5→7），並從棄牌區把〔木下久志〕最多1張撿回手牌。",
        image: "assets/cards/HV-P02-005-S.webp"
    },
    {
        code: "HV-P02-005", name: "西谷夕", type: "character", series: "P02 宣傳卡",
        rarity: "SP", position: "リベロ", school: "烏野・2年",
        stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "限定條件：必須是透過〔助けてもらう!!!〕技能登場才能發動。條件符合後支付2點資源，接球點數 +2（5→7），並從棄牌區把〔木下久志〕最多1張撿回手牌。",
        image: "assets/cards/HV-P02-005-SP.webp"
    },
    {
        code: "HV-P02-006", name: "西谷夕", type: "character", series: "P02 宣傳卡",
        rarity: "R", position: "リベロ", school: "烏野・2年",
        stats: { serve: null, block: null, receive: 4, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "若對手事件區中,可於發球時機使用的卡≥3張,抽1張卡,接球點數 +3。",
        image: "assets/cards/HV-P02-006.webp"
    },
    {
        code: "HV-P02-007", name: "田中龍之介", type: "character", series: "P02 宣傳卡",
        rarity: "S", position: "ウイングスパイカー", school: "烏野・2年",
        stats: { serve: 3, block: 2, receive: 2, toss: 0, attack: 1 },
        zone: "攻擊區域",
        skill: "當自己的〔超インナークロス!!!〕被打出時,若這張卡是攻擊角色,支付3點資源(犧牲下方3張卡)即可使用。攻擊點數 +4,並讓下一個對手回合中,對手每有1名接球角色登場,就讓該角色接球點數 -2。",
        image: "assets/cards/HV-P02-007-S.webp"
    },
    {
        code: "HV-P02-007", name: "田中龍之介", type: "character", series: "P02 宣傳卡",
        rarity: "SP", position: "ウイングスパイカー", school: "烏野・2年",
        stats: { serve: 3, block: 2, receive: 2, toss: 0, attack: 1 },
        zone: "攻擊區域",
        skill: "當自己的〔超インナークロス!!!〕被打出時,若這張卡是攻擊角色,支付3點資源(犧牲下方3張卡)即可使用。攻擊點數 +4,並讓下一個對手回合中,對手每有1名接球角色登場,就讓該角色接球點數 -2。",
        image: "assets/cards/HV-P02-007-SP.webp"
    },
    {
        code: "HV-P02-008", name: "田中龍之介", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "烏野・2年",
        stats: { serve: 4, block: 1, receive: 4, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-008.webp"
    },
    {
        code: "HV-P02-009", name: "緣下力", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "烏野・2年",
        stats: { serve: 2, block: 2, receive: 4, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-009.webp"
    },
    {
        code: "HV-P02-010", name: "木下久志", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "烏野・2年",
        stats: { serve: 4, block: 0, receive: 1, toss: 0, attack: 3 },
        skill: "當自己接球區登場了〔西谷夕〕時,若這張卡是發球角色,可丟棄這張卡發動。自己1名〔西谷夕〕角色接球點數 +1。",
        image: "assets/cards/HV-P02-010-N.webp"
    },
    {
        code: "HV-P02-010", name: "木下久志", type: "character", series: "P02 宣傳卡",
        rarity: "NP", position: "ウイングスパイカー", school: "烏野・2年",
        stats: { serve: 4, block: 0, receive: 1, toss: 0, attack: 3 },
        skill: "當自己接球區登場了〔西谷夕〕時,若這張卡是發球角色,可丟棄這張卡發動。自己1名〔西谷夕〕角色接球點數 +1。",
        image: "assets/cards/HV-P02-010-NP.webp"
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
        code: "HV-P02-012", name: "澤村大地", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "烏野・3年",
        stats: { serve: 1, block: 0, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "雙方SET牌區合計剩1張以下時，支付3點資源，接球點數 +3。",
        image: "assets/cards/HV-P02-012.webp"
    },
    {
        code: "HV-P02-013", name: "菅原孝支", type: "character", series: "P02 宣傳卡",
        rarity: "R", position: "セッター", school: "烏野・3年",
        stats: { serve: 3, block: 2, receive: 2, toss: 2, attack: 0 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-013.webp"
    },
    {
        code: "HV-P02-014", name: "東峰旭", type: "character", series: "P02 宣傳卡",
        rarity: "R", position: "ウイングスパイカー", school: "烏野・3年",
        stats: { serve: 4, block: 0, receive: 0, toss: 0, attack: 3 },
        zone: "發球區域",
        skill: "若自己事件區中烏野的事件卡≥4張,發球點數 +2;若≥6張,再額外發球點數 +1。",
        image: "assets/cards/HV-P02-014.webp"
    },
    {
        code: "HV-P02-015", name: "宮侑", type: "character", series: "P02 紀念卡",
        rarity: "H", position: "セッター", school: "稻荷崎・2年",
        stats: { serve: 3, block: 1, receive: 2, toss: 2, attack: 2 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-015-H.webp"
    },
    {
        code: "HV-P02-016", name: "宮侑", type: "character", series: "P02 宣傳卡",
        rarity: "I", position: "セッター", school: "稻荷崎・2年",
        stats: { serve: 5, block: 0, receive: 0, toss: 1, attack: 0 },
        zone: "舉球區域",
        skill: "支付3點資源(犧牲下方3張卡)即可使用。抽1張卡,舉球點數 +2;此外,若這張卡是透過〔正中要害〕的技能登場的,下一個對手回合中,無效化對手〔單觸N〕與〔接球階段・手札〕類型的技能。",
        image: "assets/cards/HV-P02-016-I.webp"
    },
    {
        code: "HV-P02-016", name: "宮侑", type: "character", series: "P02 宣傳卡",
        rarity: "IP", position: "セッター", school: "稻荷崎・2年",
        stats: { serve: 5, block: 0, receive: 0, toss: 1, attack: 0 },
        zone: "舉球區域",
        skill: "支付3點資源(犧牲下方3張卡)即可使用。抽1張卡,舉球點數 +2;此外,若這張卡是透過〔正中要害〕的技能登場的,下一個對手回合中,無效化對手〔單觸N〕與〔接球階段・手札〕類型的技能。",
        image: "assets/cards/HV-P02-016-IP.webp"
    },
    {
        code: "HV-P02-017", name: "宮侑", type: "character", series: "P02 宣傳卡",
        rarity: "R", position: "セッター", school: "稻荷崎・2年",
        stats: { serve: 4, block: 0, receive: 0, toss: 1, attack: 1 },
        zone: "舉球區域",
        skill: "支付3點資源(犧牲下方3張卡)即可使用。若自己棄牌區稲荷崎角色卡名不重複的合計≥6種,舉球點數 +2,並從自己棄牌區選最多1張稲荷崎的邊翼攻擊手或中間阻攔手加入手牌。",
        image: "assets/cards/HV-P02-017.webp"
    },
    {
        code: "HV-P02-018", name: "宮侑", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "セッター", school: "稻荷崎・2年",
        stats: { serve: 2, block: 1, receive: 1, toss: 2, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-018-N.webp"
    },
    {
        code: "HV-P02-018", name: "宮侑", type: "character", series: "P02 宣傳卡",
        rarity: "NP", position: "セッター", school: "稻荷崎・2年",
        stats: { serve: 2, block: 1, receive: 1, toss: 2, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-018-NP.webp"
    },
    {
        code: "HV-P02-019", name: "宮治", type: "character", series: "P02 紀念卡",
        rarity: "H", position: "ウイングスパイカー", school: "稻荷崎・2年",
        stats: { serve: 2, block: 1, receive: 3, toss: 1, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-019-H.webp"
    },
    {
        code: "HV-P02-020", name: "宮治", type: "character", series: "P02 宣傳卡",
        rarity: "I", position: "ウイングスパイカー", school: "稻荷崎・2年",
        stats: { serve: 3, block: 1, receive: 3, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "支付3點資源，攻擊點數 +3；若這張卡是透過〔どんぴしゃり〕技能登場的，再額外 +1，並讓下一個對手回合中，對手手牌最多只能讓2名阻擋角色登場。",
        image: "assets/cards/HV-P02-020-I.webp"
    },
    {
        code: "HV-P02-020", name: "宮治", type: "character", series: "P02 宣傳卡",
        rarity: "IP", position: "ウイングスパイカー", school: "稻荷崎・2年",
        stats: { serve: 3, block: 1, receive: 3, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "支付3點資源，攻擊點數 +3；若這張卡是透過〔どんぴしゃり〕技能登場的，再額外 +1，並讓下一個對手回合中，對手手牌最多只能讓2名阻擋角色登場。",
        image: "assets/cards/HV-P02-020-IP.webp"
    },
    {
        code: "HV-P02-021", name: "宮治", type: "character", series: "P02 宣傳卡",
        rarity: "R", position: "ウイングスパイカー", school: "稻荷崎・2年",
        stats: { serve: 3, block: 2, receive: 1, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "自己手牌≤2張時，攻擊點數 +2。",
        image: "assets/cards/HV-P02-021-R.webp"
    },
    {
        code: "HV-P02-021", name: "宮治", type: "character", series: "P02 宣傳卡",
        rarity: "RP", position: "ウイングスパイカー", school: "稻荷崎・2年",
        stats: { serve: 3, block: 2, receive: 1, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "自己手牌≤2張時，攻擊點數 +2。",
        image: "assets/cards/HV-P02-021-RP.webp"
    },
    {
        code: "HV-P02-022", name: "宮治", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "稻荷崎・2年",
        stats: { serve: 1, block: 1, receive: 5, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-022.webp"
    },
    {
        code: "HV-P02-023", name: "北信介", type: "character", series: "P02 紀念卡",
        rarity: "H", position: "ウイングスパイカー", school: "稻荷崎・3年",
        stats: { serve: 1, block: 0, receive: 5, toss: 1, attack: 1 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-023-H.webp"
    },
    {
        code: "HV-P02-024", name: "北信介", type: "character", series: "P02 宣傳卡",
        rarity: "S", position: "ウイングスパイカー", school: "稻荷崎・3年",
        stats: { serve: 1, block: 0, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "丟棄1張手牌，支付3點資源，接球點數 +1，並從自己事件區把1張稻荷崎的卡撿回手牌。",
        image: "assets/cards/HV-P02-024-S.webp"
    },
    {
        code: "HV-P02-024", name: "北信介", type: "character", series: "P02 宣傳卡",
        rarity: "SP", position: "ウイングスパイカー", school: "稻荷崎・3年",
        stats: { serve: 1, block: 0, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "丟棄1張手牌，支付3點資源，接球點數 +1，並從自己事件區把1張稻荷崎的卡撿回手牌。",
        image: "assets/cards/HV-P02-024-SP.webp"
    },
    {
        code: "HV-P02-025", name: "北信介", type: "character", series: "P02 宣傳卡",
        rarity: "R", position: "ウイングスパイカー", school: "稻荷崎・3年",
        stats: { serve: 1, block: 0, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "支付2點資源(犧牲下方2張卡)即可使用。抽1張卡,並從自己手牌丟棄1張卡。",
        image: "assets/cards/HV-P02-025.webp"
    },
    {
        code: "HV-P02-026", name: "角名倫太郎", type: "character", series: "P02 紀念卡",
        rarity: "H", position: "ミドルブロッカー", school: "稻荷崎・2年",
        stats: { serve: 3, block: 3, receive: 2, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-026-H.webp"
    },
    {
        code: "HV-P02-027", name: "角名倫太郎", type: "character", series: "P02 宣傳卡",
        rarity: "S", position: "ミドルブロッカー", school: "稻荷崎・2年",
        stats: { serve: 2, block: 2, receive: 2, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "若自己棄牌區稲荷崎角色卡名不重複的合計≥6種,將這張卡橫放(側置)即可使用。攻擊點數 +2,並讓下一個對手回合中,對手的中間阻攔手阻擋點數視為無效(等同0)。",
        image: "assets/cards/HV-P02-027-S.webp"
    },
    {
        code: "HV-P02-027", name: "角名倫太郎", type: "character", series: "P02 宣傳卡",
        rarity: "SP", position: "ミドルブロッカー", school: "稻荷崎・2年",
        stats: { serve: 2, block: 2, receive: 2, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "若自己棄牌區稲荷崎角色卡名不重複的合計≥6種,將這張卡橫放(側置)即可使用。攻擊點數 +2,並讓下一個對手回合中,對手的中間阻攔手阻擋點數視為無效(等同0)。",
        image: "assets/cards/HV-P02-027-SP.webp"
    },
    {
        code: "HV-P02-028", name: "角名倫太郎", type: "character", series: "P02 宣傳卡",
        rarity: "R", position: "ミドルブロッカー", school: "稻荷崎・2年",
        stats: { serve: 2, block: 2, receive: 4, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-028.webp"
    },
    {
        code: "HV-P02-029", name: "尾白亞蘭", type: "character", series: "P02 宣傳卡",
        rarity: "R", position: "ウイングスパイカー", school: "稻荷崎・3年",
        stats: { serve: 5, block: 0, receive: 2, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "支付3點資源；若自己棄牌區裡卡名不同的稻荷崎角色卡合計≥6種，攻擊點數 +3，並讓下一個對手回合中，對手接球角色技能失效。",
        image: "assets/cards/HV-P02-029-R.webp"
    },
    {
        code: "HV-P02-029", name: "尾白亞蘭", type: "character", series: "P02 宣傳卡",
        rarity: "RP", position: "ウイングスパイカー", school: "稻荷崎・3年",
        stats: { serve: 5, block: 0, receive: 2, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "支付3點資源；若自己棄牌區裡卡名不同的稻荷崎角色卡合計≥6種，攻擊點數 +3，並讓下一個對手回合中，對手接球角色技能失效。",
        image: "assets/cards/HV-P02-029-RP.webp"
    },
    {
        code: "HV-P02-030", name: "尾白亞蘭", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "稻荷崎・3年",
        stats: { serve: 5, block: 0, receive: 4, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-030.webp"
    },
    {
        code: "HV-P02-031", name: "理石平介", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "稻荷崎・1年",
        stats: { serve: 0, block: 2, receive: 2, toss: 0, attack: 3 },
        zone: "發球區域",
        skill: "支付1點資源；若支付的是〔理石平介〕本人，發球點數 +6，並讓下一個對手回合中，對手不能讓S位置的舉球角色登場。",
        image: "assets/cards/HV-P02-031.webp"
    },
    {
        code: "HV-P02-032", name: "銀島結", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "稻荷崎・2年",
        stats: { serve: 1, block: 3, receive: 5, toss: 0, attack: 0 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-032.webp"
    },
    {
        code: "HV-P02-033", name: "大耳練", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ミドルブロッカー", school: "稻荷崎・3年",
        stats: { serve: 2, block: 3, receive: 3, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-033.webp"
    },
    {
        code: "HV-P02-034", name: "赤木路成", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "リベロ", school: "稻荷崎・3年",
        stats: { serve: null, block: null, receive: 6, toss: 0, attack: 0 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-034.webp"
    },
    {
        code: "HV-P02-035", name: "小作裕渡", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "稻荷崎・2年",
        stats: { serve: 3, block: 0, receive: 0, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "【從手牌丟棄這張卡】：自己場上1名稻荷崎角色的接球點數 +2。發動時機：接球階段中，只要這張卡仍在手牌，就能像事件卡一樣的時機發動此效果。",
        image: "assets/cards/HV-P02-035.webp"
    },
    {
        code: "HV-P02-036", name: "青根高伸", type: "character", series: "P02 宣傳卡",
        rarity: "I", position: "ミドルブロッカー", school: "伊達工業・2年",
        stats: { serve: 1, block: 2, receive: 1, toss: 0, attack: 3 },
        zone: "阻擋區域",
        skill: "若自己阻擋區有3名伊達工業角色,支付2點資源(犧牲下方2張卡)即可使用。這回合內,只要阻擋成功,就觸發〔絕殺鎖定7〕(這回合結束時,自己的進攻點數會被強制設定為7)。",
        image: "assets/cards/HV-P02-036-I.webp"
    },
    {
        code: "HV-P02-036", name: "青根高伸", type: "character", series: "P02 宣傳卡",
        rarity: "IP", position: "ミドルブロッカー", school: "伊達工業・2年",
        stats: { serve: 1, block: 2, receive: 1, toss: 0, attack: 3 },
        zone: "阻擋區域",
        skill: "若自己阻擋區有3名伊達工業角色,支付2點資源(犧牲下方2張卡)即可使用。這回合內,只要阻擋成功,就觸發〔絕殺鎖定7〕(這回合結束時,自己的進攻點數會被強制設定為7)。",
        image: "assets/cards/HV-P02-036-IP.webp"
    },
    {
        code: "HV-P02-037", name: "青根高伸", type: "character", series: "P02 宣傳卡",
        rarity: "S", position: "ミドルブロッカー", school: "伊達工業・2年",
        stats: { serve: 2, block: 2, receive: 2, toss: 0, attack: 2 },
        zone: "阻擋區域",
        skill: "若這張卡是從手牌以副攔角色身分登場的,可將這張卡放到自己牌組最下面發動。從自己棄牌區選1張〔青根高伸〕以副攔角色身分登場,並將其阻擋點數設為3。",
        image: "assets/cards/HV-P02-037.webp"
    },
    {
        code: "HV-P02-038", name: "二口堅治", type: "character", series: "P02 宣傳卡",
        rarity: "I", position: "ウイングスパイカー", school: "伊達工業・2年",
        stats: { serve: 1, block: 2, receive: 4, toss: 0, attack: 0 },
        zone: "阻擋區域",
        skill: "這回合內只要阻擋成功，就觸發〔絕殺鎖定4〕；若這張卡是副攔身份，下一個對手回合中，對手每有1名接球角色登場，就使該角色接球點數 -1。",
        image: "assets/cards/HV-P02-038-I.webp"
    },
    {
        code: "HV-P02-038", name: "二口堅治", type: "character", series: "P02 宣傳卡",
        rarity: "IP", position: "ウイングスパイカー", school: "伊達工業・2年",
        stats: { serve: 1, block: 2, receive: 4, toss: 0, attack: 0 },
        zone: "阻擋區域",
        skill: "這回合內只要阻擋成功，就觸發〔絕殺鎖定4〕；若這張卡是副攔身份，下一個對手回合中，對手每有1名接球角色登場，就使該角色接球點數 -1。",
        image: "assets/cards/HV-P02-038-IP.webp"
    },
    {
        code: "HV-P02-039", name: "二口堅治", type: "character", series: "P02 宣傳卡",
        rarity: "S", position: "ウイングスパイカー", school: "伊達工業・2年",
        stats: { serve: 1, block: 2, receive: 4, toss: 0, attack: 0 },
        zone: "攻擊區域",
        skill: "若自己的舉球角色是伊達工業的S位置(舉球員),下一個對手回合中,若對手阻擋的防禦點數≤6,對手直接阻擋失敗。",
        image: "assets/cards/HV-P02-039.webp"
    },
    {
        code: "HV-P02-040", name: "黃金川", type: "character", series: "P02 宣傳卡",
        rarity: "R", position: "セッター", school: "伊達工業・1年",
        stats: { serve: 2, block: 3, receive: 2, toss: 1, attack: 1 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-040-R.webp"
    },
    {
        code: "HV-P02-040", name: "黃金川", type: "character", series: "P02 宣傳卡",
        rarity: "RP", position: "セッター", school: "伊達工業・1年",
        stats: { serve: 2, block: 3, receive: 2, toss: 1, attack: 1 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-040-RP.webp"
    },
    {
        code: "HV-P02-041", name: "作並浩輔", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "リベロ", school: "伊達工業・1年",
        stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
        zone: "阻擋區域",
        skill: "【從手牌丟棄這張卡】：自己牌組最上面3張全丟棄，若3張都是伊達工業的卡，從自己棄牌區把1張沒有技能的伊達工業角色卡以副攔身份登場。發動時機：阻擋階段中，只要這張卡仍在手牌，就能像事件卡一樣的時機發動此效果。",
        image: "assets/cards/HV-P02-041.webp"
    },
    {
        code: "HV-P02-042", name: "鎌先靖志", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ミドルブロッカー", school: "伊達工業・3年",
        stats: { serve: 1, block: 3, receive: 0, toss: 0, attack: 2 },
        zone: "阻擋區域",
        skill: "對方事件區可用於舉球/攻擊的卡合計≥4張時，阻擋點數 +5。",
        image: "assets/cards/HV-P02-042.webp"
    },
    {
        code: "HV-P02-043", name: "茂庭要", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "セッター", school: "伊達工業・3年",
        stats: { serve: 2, block: 3, receive: 1, toss: 2, attack: 0 },
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
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-045.webp"
    },
    {
        code: "HV-P02-046", name: "牛島若利", type: "character", series: "P02 宣傳卡",
        rarity: "I", position: "ウイングスパイカー", school: "白鳥澤・3年",
        stats: { serve: 3, block: 1, receive: 3, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "若自己的舉球角色是白鳥澤的S位置(舉球員),支付3點資源(犧牲下方3張卡)即可使用。攻擊點數 +3,並丟棄對手接球區最多2張資源卡。",
        image: "assets/cards/HV-P02-046-I.webp"
    },
    {
        code: "HV-P02-046", name: "牛島若利", type: "character", series: "P02 宣傳卡",
        rarity: "IP", position: "ウイングスパイカー", school: "白鳥澤・3年",
        stats: { serve: 3, block: 1, receive: 3, toss: 0, attack: 2 },
        zone: "攻擊區域",
        skill: "若自己的舉球角色是白鳥澤的S位置(舉球員),支付3點資源(犧牲下方3張卡)即可使用。攻擊點數 +3,並丟棄對手接球區最多2張資源卡。",
        image: "assets/cards/HV-P02-046-IP.webp"
    },
    {
        code: "HV-P02-047", name: "牛島若利", type: "character", series: "P02 宣傳卡",
        rarity: "R", position: "ウイングスパイカー", school: "白鳥澤・3年",
        stats: { serve: 1, block: 1, receive: 5, toss: 0, attack: 3 },
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-047.webp"
    },
    {
        code: "HV-P02-048", name: "天童覺", type: "character", series: "P02 宣傳卡",
        rarity: "S", position: "ミドルブロッカー", school: "白鳥澤・3年",
        stats: { serve: 1, block: 2, receive: 1, toss: 0, attack: 3 },
        zone: "阻擋區域",
        skill: "擲一次硬幣；正面，阻擋點數 +4；反面，自己牌組最上面3張丟棄。",
        image: "assets/cards/HV-P02-048-S.webp"
    },
    {
        code: "HV-P02-048", name: "天童覺", type: "character", series: "P02 宣傳卡",
        rarity: "SP", position: "ミドルブロッカー", school: "白鳥澤・3年",
        stats: { serve: 1, block: 2, receive: 1, toss: 0, attack: 3 },
        zone: "阻擋區域",
        skill: "擲一次硬幣；正面，阻擋點數 +4；反面，自己牌組最上面3張丟棄。",
        image: "assets/cards/HV-P02-048-SP.webp"
    },
    {
        code: "HV-P02-052", name: "大平獅音", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "白鳥澤・3年",
        stats: { serve: 1, block: 0, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "支付3點資源，接球點數 +2。",
        image: "assets/cards/HV-P02-052.webp"
    },
    {
        code: "HV-P02-053", name: "山形隼人", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "リベロ", school: "白鳥澤・3年",
        stats: { serve: null, block: null, receive: 6, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-053.webp"
    },
    {
        code: "HV-P02-054", name: "川西太一", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ミドルブロッカー", school: "白鳥澤・2年",
        stats: { serve: 2, block: 3, receive: 3, toss: 0, attack: 3 },
        zone: "阻擋區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-054.webp"
    },
    {
        code: "HV-P02-055", name: "瀬見英太", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "セッター", school: "白鳥澤・3年",
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
        skill: "自己手牌裡有原始攻擊點數3的攻擊角色登場，且這張卡是舉球角色時，自己牌組最上面丟棄1張，舉球點數 +1，並讓自己攻擊區的1張資源卡以攻擊角色身份登場。",
        image: "assets/cards/HV-P02-060.webp"
    },
    {
        code: "HV-P02-062", name: "夜久衛輔", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "リベロ", school: "音駒・3年",
        stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "支付2點資源，看自己牌組最上面2張，從中選1張音駒角色卡公開加入手牌，其餘依任意順序放回牌組最下面。",
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
        skill: "自己牌組最上面3張丟棄，支付2點資源，舉球點數 +2，並讓這回合內自己角色〔木兎光太郎〕的技能失效。",
        image: "assets/cards/HV-P02-066.webp"
    },
    {
        code: "HV-P02-067", name: "赤葦京治", type: "character", series: "P02 宣傳卡",
        rarity: "R", position: "セッター", school: "梟谷・2年",
        stats: { serve: 3, block: 0, receive: 1, toss: 1, attack: 1 },
        zone: "舉球區域",
        skill: "自己牌組最上面最多丟棄1張；若該張是梟谷角色卡，丟棄1張手牌，強制設定自己進攻點數為3並立刻結束回合，下一個對手回合中對手不能讓阻擋角色登場。",
        image: "assets/cards/HV-P02-067.webp"
    },
    {
        code: "HV-P02-068", name: "星海光來", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "鷗台・2年",
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
        skill: "支付4點資源，抽2張卡，自己手牌丟棄1張放到牌組最上或最下，接球點數 +3。",
        image: "assets/cards/HV-P02-070.webp"
    },
    {
        code: "HV-P02-071", name: "丸山一喜", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "椿原・3年",
        stats: { serve: 1, block: 0, receive: 3, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "支付2點資源，抽1張卡，接球點數 +2。",
        image: "assets/cards/HV-P02-071.webp"
    },
    {
        code: "HV-P02-072", name: "金澤伊織", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "早流川工業・3年",
        stats: { serve: 2, block: 2, receive: 4, toss: 0, attack: 3 },
        zone: "攻擊區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P02-072.webp"
    },
    {
        code: "HV-P02-073", name: "大將優", type: "character", series: "P02 宣傳卡",
        rarity: "R", position: "ウイングスパイカー", school: "戶美・3年",
        stats: { serve: 4, block: 1, receive: 3, toss: 0, attack: 1 },
        zone: "攻擊區域",
        skill: "支付3點資源，攻擊點數 +4，並從自己事件區把1張戶美的卡加入手牌；若有加入，自己手牌丟棄1張。",
        image: "assets/cards/HV-P02-073-R.webp"
    },
    {
        code: "HV-P02-073", name: "大將優", type: "character", series: "P02 宣傳卡",
        rarity: "RP", position: "ウイングスパイカー", school: "戶美・3年",
        stats: { serve: 4, block: 1, receive: 3, toss: 0, attack: 1 },
        zone: "攻擊區域",
        skill: "支付3點資源，攻擊點數 +4，並從自己事件區把1張戶美的卡加入手牌；若有加入，自己手牌丟棄1張。",
        image: "assets/cards/HV-P02-073-RP.webp"
    },
    {
        code: "HV-P02-074", name: "沼井和馬", type: "character", series: "P02 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "戶美・3年",
        stats: { serve: 4, block: 1, receive: 0, toss: 0, attack: 3 },
        zone: "發球區域",
        skill: "支付1點資源；若支付的是戶美的卡，發球點數 +2，並讓下一個對手回合中，對手每有1名S位置的舉球角色登場，就使該角色舉球點數 -1。",
        image: "assets/cards/HV-P02-074.webp"
    },
    {
        code: "HV-P02-078", name: "澤村・黑尾", type: "character", series: "P02 宣傳卡",
        rarity: "R", position: "ウイングスパイカー／ミドルブロッカー（雙面聯名卡）",
        school: "烏野・3年（澤村大地）／音駒・3年（黑尾鐵朗）",
        stats: { serve: 0, block: 1, receive: 5, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "這張卡登場時，可以把卡片名稱從〔澤村・黑尾〕改成〔澤村大地〕或〔黑尾鐵朗〕其中一個。登場時選擇的名稱，在該回合結束前皆有效。此卡在計算場上角色人數時，算作1人。",
        image: "assets/cards/HV-P02-078-R.webp"
    },
    {
        code: "HV-P02-080", name: "武田一鐵", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "抽牌", school: "烏野", position: "監督",
        skill: "抽1張卡；把對方事件區1張監督/元監督/教練卡放到對方牌組最下面就能發動；看自己牌組最上面3張，選1張烏野角色卡公開加入手牌，其餘依任意順序放回牌組最下面。",
        image: "assets/cards/HV-P02-080.webp"
    },
    {
        code: "HV-P02-083", name: "借你們的力量了!!!", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "接球", school: "烏野",
        skill: "抽1張卡，讓自己接球區裡最多1張自由人位置的資源卡以接球角色身份登場。",
        image: "assets/cards/HV-P02-083.webp"
    },
    {
        code: "HV-P02-084", name: "黑須法宗", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "接球", school: "稻荷崎", position: "監督",
        skill: "抽1張卡，自己場上1名稻荷崎角色接球點數 +1；若自己事件區裡可用於發球/舉球/攻擊的稻荷崎卡合計≥2張，再 +1。",
        image: "assets/cards/HV-P02-084.webp"
    },
    {
        code: "HV-P02-085", name: "大見太郎", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "接球", school: "稻荷崎", position: "コーチ",
        skill: "自己場上1名稻荷崎角色接球點數 +1；自己手牌丟棄1張稻荷崎的卡就能發動；抽2張卡。",
        image: "assets/cards/HV-P02-085.webp"
    },
    {
        code: "HV-P02-090", name: "追分拓朗", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "阻擋／接球", school: "伊達工業", position: "監督",
        skill: "抽1張卡；以下擇一使用：①阻擋點數為3的自己伊達工業角色1人，阻擋點數 +1　②自己伊達工業角色1人，接球點數 +1。",
        image: "assets/cards/HV-P02-090.webp"
    },
    {
        code: "HV-P02-091", name: "最強的防守發動最快的攻擊，那就是「攔網」", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "阻擋", school: "伊達工業",
        skill: "抽1張卡，自己1名伊達工業角色阻擋點數 +1；若對方事件區可用於舉球/攻擊的卡合計≥4張，再 +6，並讓這回合內阻擋成功時觸發〔絕殺鎖定7〕。",
        image: "assets/cards/HV-P02-091.webp"
    },
    {
        code: "HV-P02-092", name: "明年的「鐵壁」絕對不會崩潰的！", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "阻擋／抽牌", school: "伊達工業",
        skill: "抽1張卡；若自己場上中堅阻攔手是伊達工業3年級生，把自己場上1名伊達工業1或2年級角色加入手牌；若有加入，自己手牌丟棄1張。",
        image: "assets/cards/HV-P02-092-N.webp"
    },
    {
        code: "HV-P02-094", name: "鷲匠鍛治", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "接球", school: "白鳥澤", position: "監督",
        skill: "抽1張卡，自己1名白鳥澤角色接球點數 +1；自己手牌丟棄1張沒有技能的白鳥澤角色卡就能發動，再 +2。",
        image: "assets/cards/HV-P02-094.webp"
    },
    {
        code: "HV-P02-095", name: "齊藤明", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "抽牌", school: "白鳥澤", position: "コーチ",
        skill: "自己棄牌區最多2張沒有技能的白鳥澤角色卡加入手牌；若加入2張，自己手牌丟棄1張。",
        image: "assets/cards/HV-P02-095.webp"
    },
    {
        code: "HV-P02-096", name: "給我們的攻擊手讓路", type: "event", series: "P02 宣傳卡",
        rarity: "R", category: "攻擊",
        skill: "抽1張卡，自己場上1名白鳥澤角色攻擊點數 +1。發動條件：舉球角色是〔白布賢二郎〕且攻擊角色原始攻擊點數為3。條件符合後，把攻擊區資源卡中的〔牛島若利〕撿出重新登場，並讓他攻擊點數再 +1。",
        image: "assets/cards/HV-P02-096-R.webp"
    },
    {
        code: "HV-P02-098", name: "拜託了！", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "攻擊", school: "白鳥澤",
        skill: "抽1張卡，自己1名白鳥澤角色攻擊點數 +1；若自己攻擊角色是〔五色工〕，自己手牌丟棄1張〔牛島若利〕就能發動，再 +1。",
        image: "assets/cards/HV-P02-098.webp"
    },
    {
        code: "HV-P02-100", name: "灰羽アリサ", type: "event", series: "P02 宣傳卡",
        rarity: "N", category: "阻擋／接球／攻擊",
        school: "音駒", position: "應援團",
        skill: "【回合1次】抽1張卡，並讓自己場上1名〔灰羽利耶夫〕角色的1項數值 +1。【回合1次】這個回合中，無效化自己場上〔與這張卡同名卡片〕的技能。",
        image: "assets/cards/HV-P02-100.webp"
    },
    // #endregion P02 宣傳卡

    // #region P03 宣傳卡（共 18 張）
    {
        code: "HV-P03-067", name: "牛島若利", type: "character", series: "P03 宣傳卡",
        rarity: "R", position: "ウイングスパイカー", school: "白鳥澤・3年",
        stats: { serve: 3, block: 0, receive: 2, toss: 0, attack: 3 },
        zone: "接球區域",
        skill: "技能一：支付2點資源，接球點數 +4（2→6）。技能二：若對方攻擊角色原始攻擊點數≤1，可犧牲場上另一名白鳥澤阻擋角色，讓對方這次進攻點數 -2。",
        image: "assets/cards/HV-P03-067-R.webp"
    },
    {
        code: "HV-P03-081", name: "球場裡到處都是情報", type: "event", series: "P03 宣傳卡",
        rarity: "R", category: "阻擋／接球／攻擊",
        skill: "抽1張卡；若自己場上所有角色都是〔疑似ユース〕系列，選1名角色任選1項數值 +1；若自己事件棄牌堆疊≥8張，再抽1張卡。同回合內同名卡技能會被無效化。",
        image: "assets/cards/HV-P03-081.webp"
    },
    {
        code: "HV-P03-099", name: "…那你到底在做什麼？", type: "event", series: "P03 宣傳卡",
        rarity: "N", category: "攻擊",
        skill: "抽1張卡，自己場上1名白鳥澤攻擊角色攻擊點數 +1；若選中角色是〔牛島若利〕，額外把對方事件區所有角色卡丟棄，若丟掉2張以上，牛島攻擊點數再 +1。",
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
        rarity: "N", position: "ボール拾い", school: "白鳥澤／疑似ユース・1年",
        stats: { serve: null, block: null, receive: null, toss: null, attack: null },
        zone: "事件區域",
        skill: "【從手牌把這張卡放到自己事件區】：自己角色全部都是疑似YOUTH時，自己牌組最上面2張公開，從中選1張角色卡加入手牌，其餘依任意順序放回牌組最下面。發動時機：攻擊階段中，只要這張卡仍在手牌，就能像事件卡一樣的時機發動此效果。",
        image: "assets/cards/HV-P03-013.webp"
    },
    {
        code: "HV-P03-017", name: "百澤雄大", type: "character", series: "P03 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "角川／疑似ユース・1年",
        stats: { serve: 2, block: 3, receive: 3, toss: 0, attack: 3 },
        zone: "攻擊區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P03-017.webp"
    },
    {
        code: "HV-P03-018", name: "黑石純二", type: "character", series: "P03 宣傳卡",
        rarity: "N", position: "リベロ", school: "白水館／疑似ユース・1年",
        stats: { serve: null, block: null, receive: 6, toss: 0, attack: 0 },
        zone: "接球區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P03-018.webp"
    },
    {
        code: "HV-P03-022", name: "宮侑", type: "character", series: "P03 宣傳卡",
        rarity: "R", position: "セッター", school: "稻荷崎／ユース・2年",
        stats: { serve: 1, block: 3, receive: 0, toss: 2, attack: 2 },
        zone: "舉球區域",
        skill: "無特殊技能。",
        image: "assets/cards/HV-P03-022.webp"
    },
    {
        code: "HV-P03-023", name: "星海光來", type: "character", series: "P03 宣傳卡",
        rarity: "I", position: "ウイングスパイカー", school: "鷗台／ユース・2年",
        stats: { serve: 4, block: 0, receive: 3, toss: 0, attack: 1 },
        zone: "阻擋區域／接球區域／攻擊區域（三選一）",
        skill: "自己角色全部都是YOUTH時，自己事件區丟棄1張YOUTH的卡就能發動，任選1項數值 +3。",
        image: "assets/cards/HV-P03-023-I.webp"
    },
    {
        code: "HV-P03-024", name: "星海光來", type: "character", series: "P03 宣傳卡",
        rarity: "S", position: "ウイングスパイカー", school: "鷗台／ユース・2年",
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
        skill: "自己手牌丟棄1張音駒的卡，阻擋點數 +3；若對方手牌≤2張，再 +2。",
        image: "assets/cards/HV-P03-038.webp"
    },
    {
        code: "HV-P03-042", name: "宮治", type: "character", series: "P03 宣傳卡",
        rarity: "N", position: "ウイングスパイカー", school: "稻荷崎・2年",
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
        code: "HV-P03-068", name: "天童覺", type: "character", series: "P03 宣傳卡",
        rarity: "RA", position: "ミドルブロッカー", school: "白鳥澤・3年",
        stats: { serve: 1, block: 3, receive: 0, toss: 1, attack: 3 },
        zone: "阻擋區域",
        skill: "無特殊技能。（這張是Q版像素風的特別繪版卡）",
        image: "assets/cards/HV-P03-068-RA.webp"
    },
    {
        code: "HV-P03-083", name: "火燒呼太郎", type: "event", series: "P03 宣傳卡",
        rarity: "N", category: "接球", school: "ユース", position: "監督",
        skill: "自己角色全部都是YOUTH時，抽1張卡，自己1名角色接球點數 +1，並讓自己接球區跟攻擊區各1張YOUTH的資源卡互換。",
        image: "assets/cards/HV-P03-083.webp"
    },
    {
        code: "HV-P03-084", name: "雲雀田吹", type: "event", series: "P03 宣傳卡",
        rarity: "N", category: "接球", school: "全日本男子代表／ユース", position: "監督",
        skill: "【回合1次】自己角色全部都是YOUTH時，抽1張卡，自己1名角色接球點數 +1；若自己事件區≤2張，再 +1。",
        image: "assets/cards/HV-P03-084-N.webp"
    },
    {
        code: "HV-P03-098", name: "ブッ潰ス!!!", type: "event", series: "P03 宣傳卡",
        rarity: "N", category: "發球／阻擋", school: "伊達工業",
        skill: "自己角色全部都是伊達工業時，抽1張卡；以下擇一使用：①自己角色1人，阻擋點數 +1　②若是發球階段中，下一個對手回合中，對手手牌裡S位置的舉球角色登場時，該角色舉球點數 -1。",
        image: "assets/cards/HV-P03-098.webp"
    },
    // #endregion P03 宣傳卡
];
