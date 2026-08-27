# バボカ研究所 / バボカ!! BREAK online — 專案交接文件

這份檔案是給接手的 Claude Code 看的專案背景說明，不是給使用者看的文件。
使用者是 Jolin，台灣人，會用中文（繁體）溝通。這個專案分四塊：一個靜態的
排球少年 TCG 粉絲網站、一個附掛在同個網站上的「バボカ!! BREAK」數位對戰
小遊戲（給 Jolin 自己跟弟弟兩人玩，非公開專案）、一個抽卡包雛型，以及一個
從抽卡包延伸出來的「卡牌背包」收藏清單（之後要拿來自組牌組）。

> Jolin 同時也在用 Claude.ai 網頁版／另一個 Claude Code session 開發這個專案，
> 所以你接手時看到的檔案可能比這份文件新。以現有原始碼為準，這份是濃縮總結。
> 每次有重大變動就整份重新檢視更新，過時的段落要刪掉而不是留著疊加。

---

## 專案是什麼

- **バボカ研究所**：介紹日本卡牌遊戲《ハイキュー!! バボカ!! BREAK》(排球少年
  TCG) 的非官方粉絲網站，純文字/資料為主。已部署在
  `jolin8459671.github.io/baboka-lab`。
- **バボカ!! BREAK online**：把同一套規則做成瀏覽器裡的雙人連線對戰遊戲，
  兩人各自用自己的裝置連線（不是同一台裝置輪流玩），透過 Firebase Realtime
  Database 同步。畫面是滿版沉浸式對戰墊（詳見下方章節），不是傳統網頁排版。
- **抽卡包**：Pokémon TCG Pocket 風格的雛型，模擬拆包、翻牌，稀有度加權。
- **卡牌背包**：抽卡包翻出來的每一張卡除了進圖鑑，也會累積進背包（同卡號可
  疊多張），之後要拿來自組對戰牌組。組牌組功能還沒做。

抽卡包與背包的收藏紀錄都存 Firebase（原本 localStorage，Jolin 主動要求換成
資料庫，因為她想留著收藏繼續開發，不想因為換裝置/清瀏覽器資料就重置）。

## 檔案結構

```
/index.html /about.html /cards.html /rules.html /playmat.html   ← 靜態網站頁面
/style.css /script.js                                            ← 網站共用樣式/邏輯（含 cards.html 卡牌資料庫的搜尋/篩選、rarity 顯示轉換、variant 收合）
/data/cards.js                                                   ← 卡牌資料庫，網站/線上對戰/抽卡包/背包共用同一份
/play-online.html /online.js /online.css                         ← 「線上對戰」：兩人各自裝置連線，滿版對戰墊 UI（唯一的對戰入口。曾有「本機雙人」同裝置輪流版〔play.html/play.js/play.css〕，Jolin 已整個刪掉，不要重建）
/packs.html /packs.js /packs.css                                 ← 「抽卡包」：選包→撕包→翻牌。翻牌時同時寫圖鑑(packsCollection)與背包(bagCollection)。圖鑑畫面目前還在這支裡（screen === 'dex'），Jolin 想把它拆成獨立頁但還沒做
/bag.html /bag.js /bag.css                                       ← 「卡牌背包」：唯讀頁，讀 bagCollection，顯示每個版本收了幾張，可篩選。樣式沿用 packs.css 的 .pcard 系列 + style.css 的 .dbtools/.page-hero
/firebase-config.js                                              ← Jolin 已申請好 Firebase 專案並填好金鑰，不要動除非她主動要換專案
/assets/cards/*.webp                                             ← 卡牌插圖（Jolin 自己準備的圖，非官方原圖），還有 back.webp 卡背
/assets/*_playmat*.{svg,png}                                     ← 桌墊下載頁用的原創桌墊設計圖，single_playmat_print.png 也被線上對戰拿來當滿版背景
/scripts/*.js /package.json                                      ← Playwright 測試工具鏈，見下方「測試方式」章節
```

## 視覺設計語言

深色「夜間體育館記分板」風格，CSS 變數定義在 `style.css`（`--ink`
`--floor` `--floor-2` `--score` `--score-dim` `--whistle` `--chalk`
`--chalk-dim` `--line` `--display`(Anton字體) `--mono`(JetBrains Mono)
`--body`）。所有頁面都維持這個風格。

**卡牌插圖**：`data/cards.js` **每一筆 entry 都有 `image` 欄位**指向
`assets/cards/*.webp`。三處渲染卡面的地方都支援「有 `image` 就疊一張
`<img>` 蓋掉色塊背景，沒有就顯示原創色塊+姓名字首佔位」：`online.js` 的
`cardFaceHTML`、`packs.js` 的 `pcardHTML`、`bag.js` 的 `bagCardHTML`。
`cards.html` 的卡牌資料庫頁（`script.js`）**刻意不接圖片**，只顯示文字資訊。

---

## `data/cards.js` 資料現況（2026/08 大改後）

**共 174 筆 entry**（不是舊版寫的 36）：

| 系列 | entry 數 | 說明 |
|---|---|---|
| `D01 起始` | 14 | 烏野起始套牌，實際牌組 40 張 |
| `D02 起始` | 14 | 音駒起始套牌，40 張，結構對稱於烏野 |
| `D03 起始` | 15 | 稻荷崎起始套牌，40 張。13 卡號 + 2 張 DP（宮侑/宮治王牌）。宮侑有 3 個卡號（發球/舉球各版本）、宮治 2 個 |
| `P01 紀念卡` | 6 | `playable: false`，不進對戰牌組 |
| `P01 補充包` | 52 | |
| `P02 宣傳卡` | 55 | |
| `P03 宣傳卡` | 18 | 含「疑似ユース／ユース」選拔隊那批 |

每筆 entry 的欄位（並非每筆都有全部）：

| 欄位 | 意義 | 值域 | 誰在讀 |
|---|---|---|---|
| `code` | 卡號 `HV-D01-001` | D/DP、不同稀有度**共用同一個 code** | 三頁都用；背包 key 是 `code::rarity` |
| `name` | 角色/卡名 | 已統一成官方繁體用字（見下） | 全部 |
| `type` | `character` / `event` | | 分支渲染 |
| `series` | 系列字串 | 上表 7 種 | `script.js` 篩選；`online.js` POOLS 用 `startsWith('D01'/'D02'/'D03')`；`packs.js` 圖鑑分隊 |
| `rarity` | 稀有度**原始代碼** | `Deck` / `N R S NP RP SP RA` / `I IP H K KP`（**一律存代碼，不存中文**） | `script.js`/`packs.js`/`bag.js` 用 `rarityLabel()` 轉中文顯示；`packs.js` 用 `rarityTier()` 收斂成 6 階算抽卡權重 |
| `position` | 場上位置（日文） | `ミドルブロッカー` `セッター` `リベロ` `ウイングスパイカー` + `監督` `コーチ` `應援團` `ボール拾い` + 複合 | `online.js` 卡面標籤 |
| `school` | 學校・年級 | `烏野・1年`；複合用 `／`（`烏野／疑似ユース・1年`） | `script.js`/`bag.js` 的 `schoolOf()` 切「・」也切「／」取**主學校**當篩選值；`packs.js` 取隊名 |
| `stats` | `{serve,block,receive,toss,attack}` | 數值或 `null`（自由人 serve/block=null） | `online.js` 對戰引擎核心，`null`＝不能上該區；`script.js` 顯示 |
| `zone` | 登場區域字串 | 6 種基本 + 複合（`發球區域／舉球區域`）+ prose | 目前只有 `script.js` 顯示用途 |
| `copies` | 正式牌組張數 | 數字，**只有 D01/D02/D03 有** | `online.js` `buildDeck()`（fallback `COPIES_PER_CARD = 3`，目前用不到） |
| `skill` | 技能敘述字串 | **每筆都有非空值**（沒技能就填「無特殊技能。」） | `script.js`/`online.js` 顯示；`online.js` 出牌時會把 `skill` 寫進 Firebase（塞 `undefined` 會讓 SDK 拋例外，所以絕不能省略這欄位） |
| `image` | webp 路徑 | 每筆都有，對應檔案都存在 | `online.js`/`packs.js`/`bag.js` 疊圖；`script.js` 不用 |
| `variant` | 平行版標記 | **只有 `DP`**（6 張起始王牌） | 沒有任何程式讀它，純資料標記 |
| `category` | 事件卡類型 | 純類型 token：`發球`/`接球`/`舉球`/`攻擊`/`阻擋`/`抽牌` 及其 `／` 組合，**不加「類」、不加括號備註** | `script.js` 顯示；`online.js` 卡面標籤 fallback |
| `playable` | 能否進對戰牌組 | 只會是 `false`（預設 true） | `online.js` POOLS filter |

### 2026/08 這次做的資料整理

1. **rarity 一律存原始代碼**，中文顯示交給各頁的 `rarityLabel()`：
   `H→秘 I→頂 IP→頂P K→極 KP→極P`，其餘（`N R S NP RP SP RA`）照字面。
   `packs.js` 抽卡權重用 `rarityTier()` 把 `IP→頂`、`KP→極`、`RP→R`… 收斂到
   `N/R/S/頂/秘/極` 六個基本階。**修過 3 張** bug（`HV-P02-020`/`P02-038`/
   `P03-023` 之前 rarity 誤存中文「頂」、image 指到不存在的 `-頂.webp`，
   已改回 `I` + `-I.webp`）。
2. **`variant` 只留 `DP`**：規則是「同 code 且同 rarity、無法用 rarity 區分」
   才需要 variant（目前只有起始王牌的 DP 版，rarity 都是 `Deck`）。兩個稀有度
   ＝寫兩筆、靠 rarity 區分即可（P01 早就是這樣做）。已刪掉 `HV-P02-073`
   的 `variant:"RP"`、`HV-P03-068` 的 `variant:"RA"`（跟 rarity 重複）。
3. **卡名/隊名統一成官方繁體**（日文新字體 → 繁體）：
   `沢→澤 鉄→鐵 稲→稻 鴎→鷗 黒→黑 来→來 覚→覺 焼→燒`，另外
   `尾白アラン→尾白亞蘭`。**`灰羽アリサ`（HV-P02-100）還沒統一**——Jolin
   還沒給官方繁中譯名。
4. **skill 括號/標點統一**：卡名＋機制關鍵字一律 `〔〕`（原本混用的
   `「」` 幾乎全轉掉，只留「同時」「鐵壁」這種強調/標題用）；成本與時機
   標籤保留 `【】`（如「【從手牌丟棄這張卡】」「【回合1次】」）；半形
   `( ) , ; :` → 全形 `（ ） ， ； ：`（僅字串值內，不動程式碼）。
5. **`category` 純類型化**：去「類」、去括號備註。
6. `#region` 張數註解全部更新。

### 圖檔命名 → 稀有度代碼規則（Jolin 的檔名慣例）

Jolin 看不到圖片本體，只能看檔名/截圖。檔名後綴慣例（**只適用 P 開頭系列，
D 起始套牌不會有多版本後綴**）：

- 後綴在對照表裡 → 存那個代碼：`-H`→`H`(秘)、`-I`→`I`(頂)、`-IP`→`IP`(頂P)、
  `-K`→`K`(極)、`-KP`→`KP`(極P)。**data 存代碼，不存中文**，中文由
  `rarityLabel()` 轉。
- 後綴不在對照表（`-N` `-R` `-S` `-NP` `-RP` `-SP` `-RA`）→ 照原字母存。
- 卡號完全沒後綴（如 `HV-P01-007.webp`）→ 只有一個版本，沒辦法只靠檔名
  判斷稀有度，要看 Jolin 的截圖或她直接講，不要用猜的。

### `playable` + 紀念卡排除

- `series` 帶「紀念」的卡（目前是 `P01 紀念卡` 6 張）**不進對戰牌組**。
- 另外個別可標 `playable: false` 當額外的「只收藏不能戰」開關（預設 true）。
- `online.js` 的 POOLS 兩個條件都檢查：
  ```javascript
  const inBattlePool = c => c.playable !== false && !c.series.includes('紀念');
  const POOLS = {
    karasuno:  { label: '烏野 (D01 起始)',   cards: CARDS.filter(c => c.series.startsWith('D01') && inBattlePool(c)) },
    nekoma:    { label: '音駒 (D02 起始)',   cards: CARDS.filter(c => c.series.startsWith('D02') && inBattlePool(c)) },
    inarizaki: { label: '稻荷崎 (D03 起始)', cards: CARDS.filter(c => c.series.startsWith('D03') && inBattlePool(c)) },
  };
  ```
- `cards.html`（資料庫）、`packs.js`（抽卡包）、`bag.js`（背包）**不理會這些
  排除**，紀念卡照樣顯示/照樣可抽/照樣進背包。

---

## 遊戲規則（已跟官方規則書核對過）

- Guts(資源) = 疊在角色卡下方的牌，是技能的支付成本，不是手牌
- 角色只能在自己標示的登場區域使用技能
- 阻擋：1人主攔必選，可再加最多2名副攔（同名角色不能同時登場）
- 抽牌時機：只有選擇「接球」才抽牌，選「阻擋」不抽
- **一個 SET（局）= 一次連續的發球到落球的攻防交換**，不是打好幾個回合，
  局末補牌後才會有下一次發球
- 局末補牌：雙方補到6張，輸的一方再從 SET 牌區多補1張（共7張）；SET 牌區
  補不出來 = 直接輸掉整場
- 稀有度 D=起始牌 / P=宣傳卡，跟 N→R→S→頂→秘→極 的補充包序列是分開的兩套系統
- 發球方**不**在發球階段抽牌
- 先取3局(SET)獲勝 = 贏得整場比賽

---

## `online.js` 線上對戰引擎架構

### Firebase 資料模型
- 單一房間節點 `rooms/{5碼房號}`，欄位：`stage`(lobby/presetup/playing/
  interval/matchEnd)、`slots.A`/`slots.B`(present/ready/deckKey/setupDone)、
  `serverKey`、`actingKey`、`phase`、`ball`、`excludeName`、`turnDeadline`、
  `public.A`/`public.B`(deckCount/handCount/setZoneCount/discardCount/
  setsWon/zones)、`lastSetLoser`、`matchWinner`
- `rooms/{code}/log` 是獨立的 push-list（避免多人同時寫入同一個陣列欄位衝突）
- **隱私設計**：每個玩家實際的手牌/牌組/棄牌堆/SET區內容**只存在自己瀏覽器
  記憶體裡**（`local` 物件），從來不寫進 Firebase，上傳的只有「數量」跟
  「已經打出來、正在場上的牌」。資料庫規則是雙方全開讀寫（沒有 Auth，兩人
  互信），手牌不上傳才不會技術上被對方讀到。**代價是對戰中重新整理分頁 =
  手牌全部消失**，已知限制，不要試圖用 localStorage 解決。

### 技能自動化（`SKILL_RULES`，涵蓋 7 張角色）
`日向翔陽 影山飛雄 西谷夕 孤爪研磨 芝山優生`（用「場上資源」付費）、
`緣下力 夜久衛輔`（用「丟1張手牌」付費，丟棄目標自動選手牌最後一張）。
點手牌若符合規則會跳確認面板。**其他所有卡（含全部 D03 起始、月島螢、
黑尾鐵朗、灰羽利耶夫、全部事件卡）都沒自動化**，用手動加減值輸入框處理。

### 單一寫入者原則（避免 race condition）
- `lobby → presetup`、`presetup → playing`（擲硬幣）、`interval → playing`
  固定由 **slot A（房主）**觸發
- `playing` 階段內，只有 `actingKey` 對應的玩家會寫入
- 觸發 `endSet()` 的一定是當下持有 `actingKey` 的那一方

### 已修過、不要重蹈覆轍的 bug
1. **Firebase 會把值是 `null` 的欄位直接刪掉**，物件底下全 `null` 時整個節點
   消失（不是變 `{}`）。讀取一律 `pub.zones || {}` 防呆。
2. **`db.update()` 後不要直接讀剛寫入的同一個欄位**——`room` 是同一個被
   mutate 的物件參照，onValue callback 有時會在 `db.update()` 同步回傳前
   就先觸發。要用的值先存本地 const 再呼叫 `db.update()`。
3. **物件裡塞 `undefined`（不是 `null`）會讓 Firebase SDK 同步拋例外**。之前
   `writeZone()` 寫 `skill: card.skill` 時某張卡沒填 `skill`（`undefined`）
   就整個報錯卡死回合。教訓：`data/cards.js` 每張卡都必須有非空 `skill`。

### 滿版沉浸式對戰墊 UI
`play-online.html` 進 `playing` 畫面時 `render()` 幫 `<body>` 加 `fs-battle`
class，`online.css` 的 `body.fs-battle` 藏掉導覽列/大標題，`.matbattle` 用
`position:fixed;inset:0` 撐滿螢幕：

- 背景用 `assets/single_playmat_print.png`，比照實體「兩張單人墊阻擋區相對
  擺放、中間留球網」：對手那張整個 `rotate(180deg)` 接上緣、我方正向接下緣、
  中間夾 `.matbattle__netgap` 顯示來球資訊
- 每個出牌區塊用**絕對定位百分比座標**疊在桌墊印刷圖的格子上（座標照
  `assets/single_playmat.svg` 的 SVG 座標換算），對手那排子元素文字/卡面
  另外 `.matlayer--opp .zone__face {transform:rotate(180deg)}` 轉正
- **`layoutMatBattle()`**：對戰墊是固定 12:7 比例，兩張疊起來常超過螢幕。
  這函式量 `.matbattle__mat` 容器實際可用寬/高，取「寬撐滿」跟「高撐滿」
  中較小的，用 px 精準設定墊子寬高。**不要改回純 CSS `aspect-ratio`**，
  之前這樣做兩張墊子疊起來比螢幕高很多，預設捲動位置卡在正中間看起來像被
  放大好幾倍，真實發生過的 bug。有掛 `resize` 監聽。
- 手牌/出牌區、對戰紀錄是浮在墊子上的半透明面板（`.matbattle__dock` 固定
  底部、`.matbattle__logdrawer` 右側抽屜預設收起）

### 手牌永遠完整顯示
`actionZoneHTML()` **永遠列出整副手牌**，不符合當下階段的牌用
`.handcard.disabled`（灰階、`onclick` 空字串）呈現，不從陣列濾掉。這是
Jolin 明確要求的（「這樣玩家會不知道自己有哪些手牌」），邏輯在 `actionWrap()`。

---

## `packs.js` 抽卡包 + 圖鑑

- **卡池** = `CARDS.filter(c => c.rarity !== 'Deck')`（起始套牌的牌不進卡包），
  目前 131 筆。之後補更多補充包卡，池子自動變大，不用改程式。
- **稀有度加權** `RARITY_WEIGHT`（N 60% R 27% S 10% 頂 2% 秘 0.7% 極 0.3%），
  只對「實際存在於卡池裡的基本階」重新正規化。抽卡時先 `weightedRandomRarity()`
  抽一個基本階，再從 `BOOSTER_POOL.filter(c => tierOf(c.rarity) === 階)` 隨機。
  這組機率數字沒跟 Jolin 討論過細節，她想調手感要問她。
- 每包 `PACK_SIZE = 5`。流程：**選包**（3個一樣的包，純儀式感）→ **撕包**
  （Pointer Events「按住往上滑」，>70px 或單純點一下觸發）→ **翻牌堆疊**
  （最上面那張左右滑走或點一下翻開）。手勢用事件代理掛在 `#app`（每次
  `render()` 整個 innerHTML 重繪，個別綁定會失效）。
- **翻牌時同時寫兩個資料表**（`revealOne` / `revealAll`）：
  - `packsCollection`（圖鑑）：key = `code`，value = 收過幾次
  - `bagCollection`（背包）：key = `code::rarity`，value = 張數，用
    `firebase.database.ServerValue.increment(n)` 原子遞增（無 increment 可用
    時退回寫 n）
- **卡背圖** `assets/cards/back.webp`：翻牌堆疊裡未翻開的卡、圖鑑裡「未取得」
  鎖住的卡。
- **點卡面放大**：`pcardHTML` 判斷「有真的顯示圖片」才加 `data-fullimg`/
  `.zoomable`，事件代理在 `#app` 抓 click 開 `.imglightbox`（點背景或 Esc 關）。
  故意跟撕包/翻牌的 pointerdown 手勢分開判斷。
- 稀有卡（S 以上）翻開有光暈動畫。
- **圖鑑畫面**（`screen === 'dex'`）目前還在這支裡，分「卡包收藏」+「起始
  套牌」兩區。**Jolin 想把圖鑑拆成獨立頁**（跟抽卡包分開），還沒做。

## `bag.js` / `bag.html` 卡牌背包

- **唯讀頁**，只讀 `bagCollection`（寫入都發生在 `packs.js` 翻牌時）。
- key = `code::rarity`，所以**平行版分開算**。圖鑑記「有沒有收過這個卡號」，
  背包記「每個版本各幾張」——兩者刻意分開。
- 用 `code::rarity` 反查 `CARDS` 得到卡片資料（`CARD_BY_KEY`）。
- 畫面：統計列（共幾張／幾種）+ 篩選（搜尋／類型／系列／學校／稀有度）+
  排序（依系列＝data 檔順序／依張數／依稀有度）+ 卡片格（右下角黃色張數
  角標）+ 點卡放大。
- 樣式沿用 `packs.css` 的 `.pcard--{tier}` 系列 + `style.css` 的 `.dbtools`
  `.page-hero` `.statbar`，`bag.css` 只放小調整。
- **組牌組功能還沒做**，資料結構已經留好之後直接用。

## Firebase 路徑一覽

| 路徑 | 用途 | 寫入者 |
|---|---|---|
| `rooms/{code}` `rooms/{code}/log` | 線上對戰房間 | `online.js` |
| `packsCollection` | 圖鑑（`{code: 收過次數}`） | `packs.js` 翻牌 |
| `bagCollection` | 背包（`{"code::rarity": 張數}`） | `packs.js` 翻牌 |

轉接層 `getDB()` 三支（online/packs/bag）寫法一致，含 `window.__mockDB`
測試 hook。抽卡包/背包畫面都有處理「連線中…」跟連不上的 `.errorbox` 狀態。

---

## 測試方式：Playwright（真瀏覽器）

裝了 `@playwright/test`（見 `package.json`），工具鏈在 `scripts/`：

- `scripts/serve.js`：靜態伺服器 `http://localhost:4173`（`node scripts/serve.js`
  或 `npm run serve`）。跑其他腳本前要先開著。
- `scripts/screenshot.js`：單頁截圖，`node scripts/screenshot.js <頁面> <輸出> [寬] [高]`
- `scripts/playmat-flow.js`：線上對戰完整雙人流程（開房→加入→ready→擲硬幣→
  發球→應對），兩個 browser context，走真 Firebase，關鍵畫面截圖 + 印
  console error。改線上對戰要重跑。
- `scripts/packs-flow.js`：抽卡包完整流程（選包→撕包→翻牌→圖鑑），合成
  PointerEvent。**會實際寫進 Firebase**（`packsCollection` + `bagCollection`），
  跑完會在 Jolin 的收藏裡留測試資料，她要乾淨起點時要幫她清 `bagCollection`。
- `scripts/site-check.js`：全站 8 頁逐一載入，抓 console error / pageerror /
  破圖(404)。改完東西的第一道防線。
- 輸出資料夾參數請用 scratchpad 的絕對路徑（相對路徑會被解讀到奇怪的地方）。

**流程無法自動判斷「畫面好不好看」**，版面美感/動畫流暢度還是要 Jolin 看
截圖回饋；但 console error、卡死、座標、破圖這些可以自己先跑一輪。

---

## 目前功能完成度

### 已完成、測過穩定
- 線上對戰：建房/加入（5碼房號）、選牌組（烏野/音駒/稻荷崎 三副 D 起始）、
  雙方 ready 自動擲硬幣、完整規則引擎（發球→接球/阻擋→舉球→攻擊、點數比對、
  落球判定、局末補牌、SET區耗盡判整場輸、先3局勝出）、15秒回合倒數（純顯示）、
  手動「放棄」鈕、7 張角色技能自動化、滿版對戰墊 UI + 出牌動畫
- 卡牌資料庫：174 筆 entry 全部有圖、rarity 中文顯示、DP 平行版收合成一張
  帶角標、同 code 多稀有度各顯示一張、搜尋 + 類型/系列/學校篩選
- 抽卡包：選包/撕包/翻牌手勢、稀有度加權、翻牌同時寫圖鑑 + 背包、卡背圖、
  點圖放大、稀有光暈
- 卡牌背包：獨立頁 + 獨立資料表、平行版分開記、張數角標、五種篩選 + 三種排序
- Playwright 測試工具鏈（8 頁 site-check + 兩支 flow）

### 明確還沒做、Jolin 知情
- **圖鑑拆成獨立頁**（目前還在 `packs.js` 的 dex 畫面裡）
- **自組牌組功能**（背包資料結構已備好）
- **整體 UI/UX 檢視**（Jolin 說「希望不要太 AI 化」，要給她加強 UI/UX 的方法）
- 補充包 N/R/S/頂/秘/極 更多卡資料（目前 P01~P03）
- 事件卡完全不能出牌（`online.js` 引擎沒接事件卡進任何出牌流程）
- 月島螢/黑尾鐵朗/灰羽利耶夫 + 全部 D03 角色技能沒自動化，用手動加減值
- 15秒倒數時間到的自動判落球（Jolin 明確要求先不要做）
- `灰羽アリサ`（HV-P02-100）卡名還沒統一成官方繁體
- `cards.html` 學校篩選還會冒出 `ユース` / `全日本男子代表`（兩張教練事件卡
  的所屬，沒有真學校），Jolin 還沒決定要不要處理
- `D03 起始` 的角色張數/技能文字是 Jolin 之前建的，還沒拿官方収録内容圖核對過

### 已知但刻意接受的限制
- 對戰中重新整理分頁 = 手牌消失（見「隱私設計」）
- Firebase 規則雙方全開讀寫、無帳號驗證，純兩人互信，不是防作弊設計
- 卡牌插圖是 Jolin 自己準備的圖

---

## 跟 Jolin 溝通時的注意事項

- 繁體中文（台灣用語），回覆要條理分明、直奔重點、善用列點加粗
- 解釋複雜概念用比喻或具體範例
- 她會自己截圖回報畫面問題，這是正常迭代，不代表哪次做錯；她也會貼官方素材
  （卡圖、収録内容一覽圖）要你核對資料正確性——要老實核對、發現不一致講清楚，
  不要因為之前寫過就假設是對的
- `data/cards.js` 的內容是「遊戲事實資料」，牽涉真實角色數值/技能文字/張數
  配置的地方，沒有可靠來源（官方素材、Jolin 提供）就不要自己編，寧可標
  「不確定」或去查證
- 她原本用 Claude.ai 網頁版做這專案，換 Claude Code 主要是想用 Playwright
  做視覺測試
