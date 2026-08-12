// 排球少年 TCG 卡牌資料庫 —— 純文字整理,無官方圖片
// rarity 標示為「未確認」代表尚未從實體卡片上清楚辨識稀有度標記
// rarity 為 Deck 指該卡是「起始套牌(スターターデッキ)專屬收錄卡」

const CARDS = [
  {
    code: "HV-D01-001", name: "日向翔陽", type: "character", series: "D01 起始",
    rarity: "Deck", position: "アタック", school: "烏野・1年",
    stats: { serve: 2, block: 2, receive: 2, toss: 0, attack: 2 },
    zone: "攻擊區域",
    skill: "支付2點資源(犧牲下方2張卡),攻擊點數 +2(2→4)。"
  },
  {
    code: "HV-D01-002", name: "影山飛雄", type: "character", series: "D01 起始",
    rarity: "Deck", position: "トス", school: "烏野・1年",
    stats: { serve: 1, block: 1, receive: 2, toss: 1, attack: 1 },
    zone: "舉球區域",
    skill: "支付2點資源(犧牲下方2張卡),舉球點數 +2(1→3)。"
  },
  {
    code: "HV-D01-003", name: "月島螢", type: "character", series: "D01 起始",
    rarity: "Deck", position: "ミドルブロッカー", school: "烏野・1年",
    stats: { serve: 1, block: 3, receive: 1, toss: 0, attack: 2 },
    zone: "阻擋區域",
    skill: "若對方進攻點數≤4,支付1點資源,抽1張卡。"
  },
  {
    code: "HV-D01-006", name: "西谷夕", type: "character", series: "D01 起始",
    rarity: "Deck", position: "リベロ", school: "烏野・2年",
    stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
    zone: "接球區域",
    skill: "支付3點資源(犧牲下方3張卡),抽1張卡,並讓接球點數 +2(5→7)。"
  },
  {
    code: "HV-D01-007", name: "緣下力", type: "character", series: "D01 起始",
    rarity: "Deck", position: "ウイングスパイカー", school: "鴨舞・2年",
    stats: { serve: 2, block: 1, receive: 2, toss: 0, attack: 3 },
    zone: "接球區域",
    skill: "丟棄1張手牌,接球點數 +3(2→5)。"
  },
  {
    code: "HV-P02-005", name: "西谷夕（PR版）", type: "character", series: "P02 宣傳卡",
    rarity: "S", position: "リベロ", school: "烏野・2年",
    stats: { serve: null, block: null, receive: 5, toss: 0, attack: 0 },
    zone: "接球區域",
    skill: "限定條件：必須是透過「助けてもらう!!!」技能登場才能發動。條件符合後支付2點資源,接球點數 +2(5→7),並從棄牌區把〔木下久志〕最多1張撿回手牌。"
  },
  {
    code: "HV-P03-067", name: "牛島若利", type: "character", series: "P03 宣傳卡",
    rarity: "R", position: "エーススパイカー", school: "白鳥澤・3年",
    stats: { serve: 3, block: 0, receive: 2, toss: 0, attack: 3 },
    zone: "接球區域",
    skill: "技能一：支付2點資源,接球點數 +4(2→6)。技能二：若對方攻擊角色原始攻擊點數≤1,可犧牲場上另一名白鳥澤阻擋角色,讓對方這次進攻點數 -2。"
  },
  {
    code: "HV-D01-011", name: "排球是!!!永遠向上仰望的運動", type: "event", series: "D01 起始",
    rarity: "Deck", category: "接球類",
    skill: "抽1張卡;選自己場上1名角色,接球點數 +1;若該角色接球點數≤4,再額外 +1(最多+2)。"
  },
  {
    code: "HV-D01-012", name: "Broad攻擊（快速平行攻擊）", type: "event", series: "D01 起始",
    rarity: "Deck", category: "攻擊類",
    skill: "抽1張卡,自己場上1名烏野角色攻擊點數 +1。組合技：若舉球角色為〔影山飛雄〕、攻擊角色為〔日向翔陽〕,下一個對手回合,對手最多只能登場1名阻擋角色。"
  },
  {
    code: "HV-P03-081", name: "球場裡到處都是情報", type: "event", series: "P03 宣傳卡",
    rarity: "R", category: "阻擋／接球／攻擊（每回合限用1次）",
    skill: "抽1張卡;若自己場上所有角色都是「疑似ユース」系列,選1名角色任選1項數值 +1;若自己事件棄牌堆疊≥8張,再抽1張卡。同回合內同名卡技能會被無效化。"
  },
  {
    code: "HV-P03-099", name: "…那你到底在做什麼？", type: "event", series: "P03 宣傳卡",
    rarity: "N", category: "攻擊類（白鳥澤主題）",
    skill: "抽1張卡,自己場上1名白鳥澤攻擊角色攻擊點數 +1;若選中角色是〔牛島若利〕,額外把對方事件區所有角色卡丟棄,若丟掉2張以上,牛島攻擊點數再 +1。"
  },
  {
    code: "HV-P02-096", name: "給我們的攻擊手讓路", type: "event", series: "P02 宣傳卡",
    rarity: "R", category: "攻擊類（白鳥澤主題,每回合限用1次）",
    skill: "抽1張卡,自己場上1名白鳥澤角色攻擊點數 +1。發動條件：舉球角色是〔白布賢二郎〕且攻擊角色原始攻擊點數為3。條件符合後,把攻擊區資源卡中的〔牛島若利〕撿出重新登場,並讓他攻擊點數再 +1。"
  }
];
