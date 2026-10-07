# バボカ研究所

非官方《ハイキュー!! バボカ!! BREAK》(排球少年 TCG) 中文玩家站，提供規則教學與卡牌技能翻譯資料庫。

🔗 **網站**：https://jolin8459671.github.io/baboka-lab/

## 這裡有什麼

- **玩法教學**：從開局準備到局末補牌、勝負判定，中文整理的完整規則說明
- **卡牌資料庫**：目前收錄 255 筆卡片資料，每張都附插圖、數值、登場區域與技能翻譯，可依類型／系列／學校搜尋篩選
- **桌墊下載**：原創設計的對戰墊 SVG／高解析度圖檔，可自行送印

## 技術

純靜態網站（HTML／CSS／JS），沒有後端、沒有資料庫。卡牌資料直接寫在 [`data/cards.js`](data/cards.js)，是全站唯一的資料來源。

### 本機測試

用 [Playwright](https://playwright.dev/) 跑自動化檢查（console error、破圖）：

```bash
npm install
npx playwright install chromium
node scripts/serve.js        # 啟動 http://localhost:4173
node scripts/site-check.js   # 檢查全站 5 頁
```

## 版權聲明

本站為玩家自製之非官方粉絲網站，內容為社群整理之規則說明與卡牌文字翻譯；卡牌插圖為站方原創繪製，非官方圖像重製。《ハイキュー!! バボカ!! BREAK》版權歸屬 古舘春一／集英社／株式会社タカラトミー 所有，本站與官方無隸屬關係，亦不代表官方立場。如版權方對本站內容有疑慮，歡迎聯繫調整或下架。

## 意見回饋

翻譯錯誤回報、規則疑問、想看到的新功能，歡迎來信：babokalab.tw@gmail.com
