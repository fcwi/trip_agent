# 本機與 GitHub 同步差異紀錄（2026-11-06）

> 後續已依使用者要求加入待補項目；下文保留同步時的差異快照。最新完成狀態與驗證見 [Render 整合紀錄](render-integration-2026-11-06.md)。

## 同步範圍

- 同步前本機 main：`e7c6e522ac963390d28f002accf278e2b594d5ef`。
- GitHub main：`9bf97b0c34fb931ab91ee5f73e018ce138402f9a`，本機落後 9 個提交、沒有本機獨有提交。
- 以 GitHub main 為同步基準；不發布網站、不推送 GitHub、不將舊前端帳密機制帶回新版。
- 本機 50 個已追蹤檔案修改，約新增 2,900 行、刪除 2,004 行；不含新增檔案。
- 先前的 28 個未追蹤項目為資料夾折疊計數，非新增檔案總數。

## 同步前本機未提交內容

| 分類 | 內容與代表檔案 |
| --- | --- |
| 視覺定版 | 手帳／故事書視覺、插畫貼紙、夜空、交通工具、每日選擇器；`src/styles/{journal,editorial,notebook}.css`、Itinerary 元件與 artwork |
| 操作與天氣 | 共用標題、AI／紀錄獨立捲動與鍵盤避讓、金額欄位焦點、高溫在左低溫在右；`usePanelViewport.js`、FinanceNote、AIPanel、WeatherDetail |
| 東北行程 | 暫定航班、待確認飯店／供應商、冬季交通提醒、猊鼻溪活動尺度、景點定位修正；`src/trip/tripdata_2027_tohoku.jsx` |
| 店家來源 | 16 間具體店家、分店、位置、時間、官方來源與地圖搜尋分流；新增 `src/trip/tohokuShopGuide.js`，調整 ShopsTab、GuidesTab 與 AI 資料 |
| 地圖與依賴 | MapLibre 6.15.0 與 style-spec 26.4.4、ES module／worker 載入與重試、Node 版本檔、套件鎖檔、CI 與安全掃描指令 |
| 測試 | 新增 notebook、storybook、release-baseline、tohoku-content、design-refinements 瀏覽器案例，調整地圖／正式產物測試 |
| 規範與證據 | AGENTS.md、7 份 2026-10-23 文件、.taste-skill 截圖／量測、.agents 技能、public/artwork 說明、deliverables 原始碼壓縮包 |

## 備份與還原界線

- `local-changes.patch`：同步前已追蹤檔案完整 binary patch。
- `file-inventory.txt`：同步前全部 Git 狀態（含展開的新增檔案清單）。
- `tracked-summary.txt`、`local-version.txt`、`remote-version.txt`：差異統計與版本識別。
- `local-docs/`：同步前 docs 副本。
- 將以具名 Git stash 備份修改與新增檔案；`.agents/`、`.taste-skill/` 保持原位，避免移除技能與檢查證據。
- 忽略的本機設定與 node_modules 不屬來源版本；不列印或複製密鑰。
- 還原應從備份逐項移植，勿對新版直接整包套用舊 stash，以免覆蓋 Render 後端、安全登入與 AI 新功能。

## GitHub 新版已知變更

- `render.yaml`、Dockerfile、`server/production.mjs`：Render Docker Web Service、同源前後端、`/healthz`、關閉自動部署。
- 密碼雜湊登入、HttpOnly Cookie session、後端保存 Gemini／GAS／Places 私密金鑰。
- Gemini 新模型、Search／Maps grounding 與來源顯示、翻譯與導遊隔離。
- 登出／離線／本機紀錄強化、工具列與紀錄區改善、地圖標籤修正與測試。

## 同步完成

- main 已快轉至 `9bf97b0c34fb931ab91ee5f73e018ce138402f9a`，與 origin/main 差距為 `0 / 0`。
- 原修改已保存為 stash `eada2032bacc30dd9bbfe6f33e99f3588480c0d6`，名稱 `pre-render-sync-2026-11-06 local visual content security backup`。
- stash 含 50 個修改檔案及 26 個新增檔案，共 76 個檔案；`.agents/`、`.taste-skill/` 原位保留。
- 額外建立 `tracked-snapshot.tar`（已追蹤檔案完整樹）與 `untracked-snapshot.tar`（26 個新增檔案），不只依賴 stash 序號。
- 兩份 tar 的 SHA-256 記錄在 `snapshot-checksums.json`，便於日後核對備份完整性。
- 已執行 npm ci，以線上 package-lock.json 重建本機依賴；本機 Node 仍為原已安裝的 24.22.1，沒有修改系統版本。
- 同步後的應用程式與部署來源沒有加入舊版變更；僅新增本次差異報告。

## 仍需補充的差異與優先順序

| 優先 | 差異 | 新版實際狀態與建議 |
| --- | --- | --- |
| P1 | 地圖套件安全修補 | 新版仍使用 MapLibre 5.x；2026-11-06 對鎖檔安裝後執行正式依賴 audit，得到 1 critical（maplibre-gl）及 1 moderate（protocol-buffers-schema）。舊本機的 MapLibre 6／worker／ES module 修補未納入，需以 Render 版為基底重做套件升級與地圖回歸測試。不能只換套件版本而不改載入器。 |
| P1 | 東北行程不確定性 | 旅程資料自共同基點後未在遠端修改，因此本機 10/23 的查證未納入。補回銀山冬季接駁、石黑家停止公開提醒、阿仁站名／方向、猊鼻溪約 90 分鐘、未確認草莓園與魚板供應商；保留暫定航班、住宿待出發通知等標記。時效資訊需重新查證，勿把 10/23 資料當成今日公告。 |
| P1 | 實際店家與來源 | 新版仍有「藥妝與保健用品」「美食街」「扭蛋與小物」「免稅購物服務」「五大堂周邊」等泛稱，沒有 `tohokuShopGuide.js`。補回 16 間具體店家、位置、官方來源、查證日，將地圖搜尋與來源連結分開。AI 資料也要補入特色店家與待確認狀態，同時保留新版 grounding。 |
| P2 | 高低溫一致性 | WeatherDetail 主摘要已有高／低文字，但七日預報仍先 min、後 max；統一高溫左／低溫右，連同溫度條、目前溫度點、首頁及當日摘要一起核對。 |
| P2 | 定版視覺與交通導航 | 新版仍有既有 journal／editorial 基礎，但沒有新增的 notebook.css、editorial.css、JournalSticker、JournalMarks、NightSky、journeyVehicle；需恢復使用者指定的手帳、插畫貼紙與交通導航細節，沿用既定視覺，不重新設計。 |
| P2 | 跨分頁標題與手機鍵盤 | 新版缺少 usePanelViewport；AIPanel 仍使用固定 calc(100vh - 85px)，本機先前共用 visualViewport、AI／紀錄獨立狀態、鍵盤收起導航的做法未納入。逐項整合至新版，保留新版記帳區及工具列。 |
| P2 | 回歸測試與維護規範 | 五份本機新測試與 AGENTS.md／視覺定版紀錄未在遠端。移植時須改成新版伺服器 Cookie 登入測試 fixture，不照搬舊前端解密流程；保留設計基準及內容查證規範。 |
| P3 | Render 周邊整理 | render.yaml／Dockerfile／production server 已存在，無須重做部署架構。package.json 的 homepage 及 deploy／predeploy 仍指向 GitHub Pages；可改為明確的舊站發布命令或移除以防誤用。確認 .dockerignore 是否排除 .taste-skill、deliverables、backups.local 等本機證據，避免額外建置上下文。 |
| P3 | Node／CI 與安全掃描 | 新版 Docker 與 CI 使用 Node 22，本機舊紀錄要求 Node 24.22.1；應明確選定受支援版本後同步 Docker、CI、engines 與版本檔，不直接搬回本機版本。補上正式依賴安全檢查、第三方技能／證據資料夾的 ESLint 排除。 |

### 已有新版解法，避免重複覆蓋

- finance 空狀態、可用高度與 AI／紀錄單行工具列已有新提交及可用性紀錄，視為部分重疊，不能把舊 FinanceNote 或 CSS 整檔蓋回。
- 新版已加入伺服器驗證、跨分頁鎖定、失敗登出維持鎖定、IndexedDB 交易保存、本機資料保留、AI 模式隔離與來源呈現；這些均須保留。
- 舊版離線解鎖與新版伺服器驗證邊界不同；新版重開／重新整理需連線驗證，不能把舊版離線解鎖視為單純缺功能而回退安全流程。
- 舊 GitHub Pages 的發布紀錄只證明當時的部署；不代表本次 Render 正式服務使用相同產物。

## 本次驗證與限制

- 來源比對：HEAD 等於 origin/main；已追蹤檔案與 origin/main 無差異。
- npm ci 成功。
- ESLint 通過，執行時額外排除 `.agents/**` 與 `.taste-skill/**`，沒有變更線上版 eslint.config.js；因此不宣稱原封不動的 npm run check 已通過。
- 來源敏感資料掃描通過（115 個檔案）；110 項單元測試通過；2 項後端測試通過。
- `travel-reliability.spec.js` 的 5 項瀏覽器測試通過，涵蓋失敗登出、跨分頁鎖定、交易失敗保留、AI 模式切換／session 到期與離線編輯保存。首次沙箱執行未能啟動，改用沙箱外執行後確認預設 Chromium 未安裝；最終使用已安裝 Chrome、獨立測試資料與關閉錄影完成驗證，沒有下載瀏覽器或使用日常瀏覽器資料。
- 設定 VITE_BASE_PATH=/ 後，東北旅程正式建置、PWA 與 build:verify 通過，符合 Render 根目錄網址。
- 正式依賴 audit：2 個套件警示（1 critical、1 moderate），不是零漏洞。完整 npm ci 安裝結果另有 31 個警示（含開發依賴），本次沒有擅自修補線上版鎖檔。
- MapLibre 公告：<https://github.com/advisories/GHSA-jrc7-96c5-q579>；原始 audit 回應保存在 `remote-production-audit.json`。
- 本次確認的是 GitHub main 的 Render 來源設定。儲存庫沒有實際 onrender.com 站址，也未連接 Render 控制台，無法證明已上線的服務正執行哪個提交、機密是否齊全或真實 Gemini／GAS 是否可用。
- 本機目前沒有根目錄 `.env.server`；要在本機使用真實後端，需按 `docs/SECURE_BACKEND.md` 私下設定。測試使用合成密碼與假服務，不需要正式密鑰。
- 不輸出真實密鑰、不操作正式帳目、不部署、不推送 GitHub。實際 Render 驗收需另取得站址；若需完整 AI／GAS 驗收，再使用已授權帳號進行。

## 後續整合順序

1. 在新版基礎上補地圖安全修補與正式依賴掃描。
2. 補東北行程與店家來源，更新 AI 行程上下文。
3. 補高低溫順序、定版視覺與鍵盤／標題行為，逐項回歸測試。
4. 更新維護文件、測試與 Render 專用發布說明，再驗證真實站址。

這次依要求完成記錄、同步與差異審查；上述缺項尚未套用到新版。

## 附錄：50 個已修改檔案的整合分類

14 個檔案在本機及遠端都修改，36 個檔案的遠端版本仍等於共同基點。後者代表本機修改沒有隨本次遠端更新帶入，不代表可不經檢查直接套用。

| 檔案 | 狀態 |
| --- | --- |
| .github/workflows/ci.yml | 雙方均修改，需逐段整合 |
| eslint.config.js | 遠端未含本機修改 |
| package-lock.json | 遠端未含本機修改 |
| package.json | 雙方均修改，需逐段整合 |
| src/AuthenticatedTripApp.jsx | 雙方均修改，需逐段整合 |
| src/assets/fonts/README.md | 遠端未含本機修改 |
| src/components/AI/AIPanel.jsx | 雙方均修改，需逐段整合 |
| src/components/ChatMessageList.jsx | 雙方均修改，需逐段整合 |
| src/components/ChecklistCard.jsx | 遠端未含本機修改 |
| src/components/DayMap.jsx | 遠端未含本機修改 |
| src/components/FinanceNote.jsx | 雙方均修改，需逐段整合 |
| src/components/Itinerary/DayItinerary.jsx | 遠端未含本機修改 |
| src/components/Itinerary/DaySelector.jsx | 遠端未含本機修改 |
| src/components/Itinerary/FlightTicket.jsx | 遠端未含本機修改 |
| src/components/Itinerary/JournalIllustration.jsx | 遠端未含本機修改 |
| src/components/Itinerary/TimelineEvent.jsx | 遠端未含本機修改 |
| src/components/Itinerary/TripCover.jsx | 遠端未含本機修改 |
| src/components/Itinerary/TripDayIndex.jsx | 遠端未含本機修改 |
| src/components/Itinerary/TripOverview.jsx | 遠端未含本機修改 |
| src/components/Itinerary/artwork/BusanCoast.jsx | 遠端未含本機修改 |
| src/components/Itinerary/artwork/DailyScenePrimitives.jsx | 遠端未含本機修改 |
| src/components/Itinerary/artwork/README.md | 遠端未含本機修改 |
| src/components/Itinerary/artwork/ScenePrimitives.jsx | 遠端未含本機修改 |
| src/components/Itinerary/artwork/TripArtwork.jsx | 遠端未含本機修改 |
| src/components/MapModal.jsx | 遠端未含本機修改 |
| src/components/MapPicker.jsx | 雙方均修改，需逐段整合 |
| src/components/Navigation/BottomNav.jsx | 遠端未含本機修改 |
| src/components/Tabs/FinanceTab.jsx | 雙方均修改，需逐段整合 |
| src/components/Tabs/GuidesTab.jsx | 遠端未含本機修改 |
| src/components/Tabs/ItineraryTab.jsx | 遠端未含本機修改 |
| src/components/Tabs/ShopsTab.jsx | 遠端未含本機修改 |
| src/components/TodayOverviewCard.jsx | 遠端未含本機修改 |
| src/components/TripTabPanels.jsx | 遠端未含本機修改 |
| src/components/WeatherDetail.css | 遠端未含本機修改 |
| src/components/WeatherDetail.jsx | 遠端未含本機修改 |
| src/hooks/useItineraryDayPager.js | 遠端未含本機修改 |
| src/hooks/useTripShellTheme.js | 遠端未含本機修改 |
| src/main.jsx | 遠端未含本機修改 |
| src/styles/journal.css | 雙方均修改，需逐段整合 |
| src/trip/tripdata_2027_tohoku.jsx | 遠端未含本機修改 |
| src/utils/aiHelpers.js | 雙方均修改，需逐段整合 |
| src/utils/itineraryHelpers.js | 遠端未含本機修改 |
| src/utils/journalMapEngine.js | 遠端未含本機修改 |
| tests/e2e/appearance.spec.js | 遠端未含本機修改 |
| tests/e2e/journal-map.spec.js | 遠端未含本機修改 |
| tests/e2e/sea-label-tile.js | 遠端未含本機修改 |
| tests/e2e/trip-smoke.spec.js | 雙方均修改，需逐段整合 |
| tests/production/README.md | 雙方均修改，需逐段整合 |
| tests/production/journal-runtime.mjs | 雙方均修改，需逐段整合 |
| vite.config.js | 雙方均修改，需逐段整合 |

## 附錄：26 個新增備份檔案

- .nvmrc
- AGENTS.md
- deliverables/trip-agent-storybook-source.zip
- docs/design-review-2026-10-23.md
- docs/editorial-redesign-2026-10-23.md
- docs/notebook-compact-and-ai-2026-10-23.md
- docs/security-update-2026-10-23.md
- docs/storybook-redesign-2026-10-23.md
- docs/tohoku-content-review-2026-10-23.md
- docs/ui-ux-baseline-2026-10-23.md
- public/artwork/README.md
- skills-lock.json
- src/components/Itinerary/JournalMarks.jsx
- src/components/Itinerary/JournalSticker.jsx
- src/components/Itinerary/artwork/NightSky.jsx
- src/components/Itinerary/artwork/artworkTheme.js
- src/hooks/usePanelViewport.js
- src/styles/editorial.css
- src/styles/notebook.css
- src/trip/tohokuShopGuide.js
- src/utils/journeyVehicle.js
- tests/e2e/design-refinements.spec.js
- tests/e2e/notebook.spec.js
- tests/e2e/release-baseline.spec.js
- tests/e2e/storybook.spec.js
- tests/e2e/tohoku-content.spec.js
