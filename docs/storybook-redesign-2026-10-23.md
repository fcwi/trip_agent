# 手繪旅行故事冊改版

本輪依使用者最新五項明確規範實作於現有 React／Vite 專案，沒有搬移框架、改寫行程內容或新增依賴。前一輪的灰白編輯風格改為陽光紙色與深可可夜色；已依使用者後續要求於 2026-10-23 部署。

## 方向與規則取捨

使用 Taste Skill 的 app-screen 流程，方向為 **Editorial greeting，seed 1070326585**，保留現有品牌色與字體角色（`--keep palette,type`），未重抽。套用現有 UX/UI Pro Max 工作流程的可讀性、響應式、焦點、觸控、狀態與減少動態效果要求；其搜尋資料庫不在專案內，未聲稱執行資料庫搜尋。

使用者最新要求明確指定三體混用、黃色紙底、柔和陰影與毛玻璃導覽，因此這些設計依最新要求優先，列為對 Taste Skill 的具名例外：三種字體角色、黃色紙底、夜間區塊極弱陰影、固定導覽模糊。沒有將例外延伸成全站模糊卡片。

概念：**讓三趟真實親子旅行的封面、每日風景與航班，成為可以翻閱的旅行故事冊。** 主要互動是選天數查看安排、切換日夜閱讀、展開景點與搜尋指南。

## 完整實作

- 字體：`--font-story` 用在旅程核心標題、封面與回顧標題，字距 0.06em；`--font-rounded` 使用專案自帶 Huninn 子集，負責區塊、日期與景點名稱；`--font-data` 負責正文、時間、天氣與匯率，保留等寬數字特性。明體使用裝置的 CJK 襯線字回退，因此跨裝置字形略有差異，不需遠端字體服務。
- 日夜插畫：三張目的地封面及十六張每日風景均依相同 React 外觀狀態切換。夜間實際增加月亮、星空與暖黃窗光，移除日間太陽，維持深色手繪線條；沒有反色或灰階。原有山景、列車、街屋與海灣仍各自不同。
- 替換圖片：已預留 `*-light.png`／`*-dark.png` 路徑設定。素材尚未放入時使用完整 SVG，不請求不存在的檔案；替代圖片錯誤會回退至對應日夜 SVG，避免空白或錯誤圖片。
- 夜間介面：底色 #1A1614，面板 #25201D，次層 #302924；主要內容框線移除，以色階分層，陰影僅 8% 黑。鎖定頁也套用同一套暖色。
- 時間軸：用圓筆端、不等距虛線的波浪 SVG 遮罩取代筆直 dotted border；節點採三種柔和色與不規則輪廓。行程目錄、住宿與天氣的斜箭頭換為原創圓筆轉向記號。
- 旅程足跡：純文字加手繪小星星，移除滿版黃色與藥丸容器；桌面兩欄，手機單欄。
- 航班：每張有獨立 SVG clipPath 的雙側凹口登機證，手繪飛行虛線；航班號、時間、機場與時刻附註完整保留。
- 導覽：92% 不透明度的紙色／可可玻璃底與 16px 模糊；不支援模糊或使用者減少透明效果時回退為實色。保留文字標籤、細線 SVG 與選取圓點。
- 間距：主要區塊間距調至 28px；固定導覽留有內容避讓。日期淡入淡出保留，減少動態效果時停用移動與淡入淡出。

素材全部沿用專案原創 SVG，再由程式繪製日夜差異；沒有外部圖庫、虛構證言或新增示範數據。

## 人工畫面複核

ROUND 1

Seen in one second: 黃紙、圓體節點與彩色風景重新形成旅行手冊。

Idea (one sentence): 真實旅行的日期與交通物件組成可翻閱的故事冊。

Live thing: 手動日夜切換實際改變天空與窗光，天數切換帶出對應每日風景。

Layout words by section: title=故事書名 / days=翻閱索引 / overview=下一站與封面 / flights=登機證 / timeline=手繪路徑 / memories=星星文字。

Scores: design 7.4 · usability 8.0 · creativity 7.4 · content 8.0 → overall 6.0（未釐清工具圖示誤判前）。

Caps applied: 首次 inspector 把原創風景縮圖、操作按鈕與不可見的滑動提示計為 icon-chips，1 FAIL。

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. `storybook-screens/auth-390.png`：鎖定頁外圍仍被舊版深黑樣式覆蓋；提高外觀選擇器優先度，將底色與輸入欄位一致暖化。
2. `storybook-screens/2026_busan-cover-dark.png`：釜山海岸列車的窗格仍用環境色；明確改接暖黃窗光 token。
3. `storybook-inspect/report.json`：工具將小於 64px 的真實風景 SVG、按鈕與隱藏滑動圖示都列為彩色 icon-chips；逐項檢查來源並記錄例外，未以隱藏內容規避檢查。

ROUND 2

Seen in one second: 旅程主標與陽光／月夜風景有一致的手繪閱讀氣氛。

Idea (one sentence): 三趟親子旅行自己的風景與登機證，成為可操作的故事冊。

Live thing: 真實日期的淡入淡出、日夜插畫切換、景點展開與指南搜尋。

Layout words by section: title=故事書名 / days=翻閱索引 / overview=下一站與封面 / flights=登機證 / timeline=手繪路徑 / memories=星星文字。

Scores: design 7.7 · usability 8.0 · creativity 7.5 · content 8.0 → overall 7.8（採已列明的使用者設計例外）。

Caps applied: 未宣稱無例外符合 Taste Skill。這是旅程工具，採 app 規則，不套用行銷頁照片與滾動場景的要求。

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. `storybook-inspect/desktop-fold.jpg`：長篇準備清單等區塊仍需往下閱讀；保留首屏下一站與主操作，避免把旅程工具壓成過密儀表板。
2. `storybook-inspect/desktop-page-01.jpg`：工具將內容外側的導覽算入畫布偏移；保留置中的主內容與獨立導覽，避免導覽遮住卡片。
3. `storybook-screens/2027_tohoku-cover-dark.png`：天空仍是簡化向量繪本而非手繪點陣水彩；提供雙圖片替換位置，當前 SVG 版本完整可用。

## 驗證與交付

預覽與量測位於 `.taste-skill/storybook-screens/`、`.taste-skill/storybook-inspect/`；包含桌面、平板、手機首屏／逐段畫面及三旅程日夜封面。

瀏覽器測試覆蓋三旅程日夜切換及重新整理後保留、無反色、三體角色、320／768／1024／1440px 無溢出、登機證裁切與航班時間、手繪時間軸、景點展開、日期淡入淡出與減少動態效果、指南搜尋、導覽、記帳設定及鎖定畫面。雲端同步與真實 AI 回覆不在本輪視覺測試範圍。

最終結果：主要瀏覽器回歸 10 項、追加航班／首頁／天氣回歸 5 項均通過；88 項單元測試、ESLint、來源秘密掃描、正式建置及 build:verify 通過。Inspector 為 **0 FAIL／2 WARN**，明列允許的例外是 `glass,font-count,icon-chips,palette-cream`；剩餘兩項提醒為上述畫布偵測與首屏資訊量。正式產物仍保留既有地圖／影像處理大型分塊提醒及 Browserslist 資料更新提醒。

本輪五個核心新檔／元件的 skill 靜態掃描使用 `--app`，結果 **0 FAIL／21 WARN**；提醒為明確設為 none 的陰影／模糊移除宣告，以及使用者指定的弱陰影與導覽模糊。航班解析正則中的箭頭字元只用於讀取原始資料，不呈現於 UI，採逐行理由註解排除錯誤的 emoji 判定。

完整下載包包含前端來源、公開資產、套件鎖定檔、建置設定、腳本、測試與環境變數範本；不含私人 `.env.production.local`、Git 記錄或 node_modules。安裝及啟動方法附於包內 `STORYBOOK-README.md`。

## 部署完成 — 2026-10-23

- 網址：https://fcwi.github.io/trip_agent/
- 重新執行來源秘密掃描、正式建置與 build:verify，均通過後發布至既有 `gh-pages`。
- 發布版本：`7c328f0a7a91a9aa6e240aae7eaf300857435454`。
- 公開 HTML 的入口已為 `/trip_agent/assets/index-C5y-QHnZ.js`，與本次建置相同。
- 入口程式、manifest 與 service worker 均為 HTTP 200；正式 service worker 的 SHA-256 與本機產物一致。
- 原始碼修改保留在本機工作目錄；本次發布的是網站成品，沒有另行提交來源分支。
