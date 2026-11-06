# 旅程網站視覺改版 — 2026-10-23

本輪為前一次部署後的新改版，已完成本機實作與驗證，尚未發布至 GitHub Pages。

## 設計依據與衝突處理

使用 `.agents/skills/design-taste-frontend/SKILL.md` 的 app-screen 流程，並採用 `.agent/workflows/ui-ux-pro-max.md` 的可讀性、對比、觸控、焦點、響應式與減少動態效果規範。UX/UI Pro Max 的搜尋資料庫與 `search.py` 不在專案內，因此沒有聲稱執行其資料庫搜尋。

方向：**Achromatic ledger**；seed **1257047807**，未重抽。保留其中安靜的中性色介面與平面層次，將旅行手冊的紙面轉為偏中性的灰白底色。字體明確採系統無襯線體與僅用於旅程身分／鎖定頁主標的系統襯線體，而非載入方向表中的 Geist；此為回應使用者的襯線主標要求，第二字體只有一個職責。

依使用者指定「兩個 skill 優先」，處理四項原始要求如下：

| 原始要求 | 最終處理 |
| --- | --- |
| 拆除卡片框線，改用 0.5px 分隔線 | 移除主要面板、內容卡片的外框、圓角與陰影；以留白與色階區分。僅保留真正列表及控制項需要的 1px 線，不加入裝飾性髮絲線。 |
| Serif 標題與極細內文 | 旅程主標採 Georgia／宋明體系統字，桌面 28px、手機 24px，字距 0.015em；內文採一般可讀的 400 字重，重點 500。 |
| 大天數橫向排版及淡入淡出 | 顯示實際第 1–N 天數，32px、等寬數字，保留日期與完整無障礙名稱。手機日期列可橫向捲動；切換採 150ms 淡出、220ms 淡入，沒有內容位移。減少動態效果時移除淡入淡出及平滑捲動。 |
| 毛玻璃導覽、細線單色圖示與圓點 | 採不透明平面導覽，SVG 筆畫 1.5px；選取項目下方 4px 圓點。手機置底、寬桌面位於內容外側。 |

概念句：**把這趟東北五日的實際天數與出發準備，排成可翻閱的旅行手冊索引。**

主要互動：點選實際日期翻閱當日安排，並從總覽一鍵前往下一個行程；指南保留全文搜尋與展開狀態。

沿用專案原有的目的地線稿並統一為灰階；沒有新增照片、外部素材、虛構評價或示範資料。既有頭像屬使用者身分選擇，不以表情符號取代操作圖示；AI 預設歡迎文字已移除裝飾性 emoji。

## 畫面複核

### ROUND 1

Seen in one second: 旅程標題、日期與下一站有明確順序，但指南仍殘留舊樣式。

Idea (one sentence): 真實旅行天數作為翻閱行程的索引。

Live thing: 日期切換與當日內容。

Layout words by section: header=旅程身分 / dates=橫向索引 / overview=下一站與封面 / preparation=航班與清單 / days=每日摘要 / weather=所在地天氣。

Scores: design 7.0 · usability 7.0 · creativity 6.8 · content 8.0 → overall 6.0（檢查失敗上限）。

Caps applied: 手機日期文字靠近螢幕邊緣，inspector 1 FAIL。

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. `editorial-screens/guides-expanded-390.png`：指南圖示仍有方框、分類仍為藍色。改為無框單色圖示與中性分類。
2. `editorial-inspect/mobile-fold.jpg`：日期列末端的日期過於靠邊。手機改為四個完整項目寬度，後續項目置於可捲動範圍內。
3. `editorial-screens/ai-390.png`：AI 歡迎訊息有裝飾性 emoji，移除後保留完整功能說明。

### ROUND 2 — 最終

Seen in one second: 這是東北五日旅行手冊，可以直接查看第一天完整行程。

Idea (one sentence): 真實旅行天數作為翻閱行程的索引。

Live thing: 天數切換、準備清單與指南搜尋，均沿用真實內容。

Layout words by section: header=旅程身分 / dates=橫向索引 / overview=下一站與封面 / preparation=航班與清單 / days=每日摘要 / weather=所在地天氣。

Scores: design 7.3 · usability 8.0 · creativity 6.8 · content 8.0 → overall 7.5。

Caps applied: 採 app-screen 規則，沒有要求行銷頁的照片數量或滾動場景。這是偏實用的編輯風格介面，並非完整攝影敘事型旅遊雜誌；創意分數反映此限制。

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. `editorial-inspect/desktop-fold.jpg`：首頁未同屏容納全部七個區塊；保留下一站與操作優先，航班、清單與每日摘要由向下閱讀取得，避免壓縮字體與觸控範圍。
2. `editorial-inspect/desktop-page-01.jpg`：工具將外側導覽到內容的距離算作不對稱畫布；實際主內容採置中封頂寬度，左右外緣一致，因此保留。
3. `editorial-screens/overview-390.png`：目前為零的準備進度沒有資料強調色；零值維持中性，避免以色彩誤示已完成或有風險。

最後一輪 inspector 的六張首屏／逐段圖皆已開啟檢視（1440、768、390px），另複核指南展開、AI、記錄、商店、每日行程及深色畫面。

## 驗證紀錄

- 瀏覽器設計檢查：**0 FAIL、3 WARN**，未使用規則豁免；三項提醒與保留理由如上。
- 新版相關五個檔案的 skill 靜態掃描使用 `--app`：**0 FAIL、14 WARN**。10 項 shadow 與 4 項 glass 提醒均指向明確設為 `none` 的移除宣告，屬文字掃描誤報；實際瀏覽器與新測試確認主要面板沒有陰影、導覽沒有背景模糊。三個內部 AI 上下文分隔符號不呈現於 UI，使用逐行具名註解排除誤報。
- 既有瀏覽器回歸 **11 項通過**，包含導覽、記帳設定、指南搜尋與展開、總覽順序、航班、減少動態效果及鎖定頁外觀。
- 最後補充瀏覽器回歸 **5 項通過**，包含淡入淡出期間 opacity 確有變化且水平位移為零、最後一天可捲入視野、單色筆畫與選取圓點、三旅程跨尺寸指南、減少動態效果及天氣失敗／429 重試。
- 三個旅程指南在 320、768、1440px 無頁面水平溢出；五個頁籤另截圖檢查 390、768、1440px，無頁面水平溢出。
- 主要查看行程按鈕在 390px 螢幕的底部約 728px，仍位於固定導覽上方。
- **88 項單元測試通過**；ESLint 與來源秘密掃描通過。
- 正式版建置及 `build:verify` 通過：入口 gzip 64.33 KiB，初始 JS gzip 75.86 KiB，PWA 預快取含主應用。
- 建置保留既有大型地圖／影像處理套件的 chunk 提醒，以及 Browserslist 資料更新提醒；本次未新增套件。
- 測試使用本機測試環境；正式雲端同步與真實 AI 回覆不屬本次視覺回歸驗證範圍。

預覽：`.taste-skill/editorial-inspect/` 與 `.taste-skill/editorial-screens/`。上一次公開部署仍是前一版，本輪新視覺尚未發布。
