# trip_agent 重啟盤點與 Backlog

> 產出日期：2026-09-11  
> 範圍：本機 `C:\Users\fcwi\trip_agent`（對應 `https://github.com/fcwi/trip_agent`）  
> 產品目標：通用（換地點可套用）／易用（一看就懂）／好用（旅途中資訊＋解問題）

## 一句話現況

這不是空殼專案，而是**已能換旅程資料的家族旅遊 PWA**；最大阻塞不是缺功能，而是 **`AuthenticatedTripApp.jsx` 巨石（約 4000 行）** 讓改動成本很高，且「旅途中優先」的資訊架構還不夠尖銳。

## 技術棧速覽

| 層級 | 現況 |
|------|------|
| 前端 | React 19 + Vite 7 + Tailwind 3 + Framer Motion + Lucide |
| PWA | `vite-plugin-pwa`、離線殼、更新提示 |
| 地圖 | `maplibre-gl`（手冊仍寫 Leaflet，文件略過時） |
| 後端 | `api.gs` → Google Sheets / Drive；位置共享、記帳 CRUD |
| AI | 前端呼叫 Gemini（聊天、收據辨識相關） |
| 部署 | GitHub Pages（`homepage`: `fcwi.github.io/trip_agent`） |
| 品質 | ESLint、單元測試、Playwright smoke、CI 雙旅程 build matrix |

## 功能盤點

成熟度：✅ 完整可用訊號　🟡 半成品／耦合重　⚠️ 風險高　❓ 需實機再確認

| 功能 | 主要位置 | 成熟度 | 通用 | 旅途中價值 | 備註 |
|------|----------|--------|------|------------|------|
| 旅程切換（資料驅動） | `VITE_TRIP_ID`、`src/config/tripData.js`、`src/trip/tripdata_*.jsx`、`TRIP_SETUP.md` | ✅ | 高 | 中 | 已有驗證器與雙旅程 CI |
| 行程日覽 | `AuthenticatedTripApp.jsx` + itinerary | 🟡 | 中 | **很高** | UI 仍綁在巨石檔 |
| 實用指南 | guides tab + `guidesData` | ✅ | 高 | 高 | 內容品質取決於資料檔 |
| 購物指南 | shops tab + `shopGuideData` | ✅ | 高 | 中 | 可保留但不必佔主導航 |
| 檢查清單 | `ChecklistCard.jsx` + `checklistData` | ✅ | 高 | 中高 | 出發前／旅途中都有用 |
| 認證鎖定 | `AuthenticationScreen.jsx`、`useTripAuthentication.js` | ✅ | 中 | 低（安全） | sessionStorage；適合家庭分享 |
| 天氣 | `WeatherCard` / `WeatherDetail` | 🟡 | 中 | 高 | 體積不小，需確認離線行為 |
| 匯率／計算機 | `CurrencyWidget`、`CalculatorModal`、`useCurrency` | ✅ | 高 | 高 | 旅途中高頻 |
| 地圖／導航 | `DayMap`、`MapModal`、`MapPicker` | 🟡 | 中 | **很高** | 文件與實作不一致；離線圖磚策略要再驗 |
| 航班卡 | `FlightInfoCard.jsx` | ✅ | 高 | 高（進出關日） | 資料在 `tripConfig.flights` |
| AI 聊天／翻譯 | AI tab、`aiHelpers.js`、語音相關邏輯在巨石檔 | 🟡 | 中 | 高（解問題） | 網路依賴強；邏輯未拆出 |
| 記帳＋收據 AI | `FinanceNote.jsx`（~100KB！） | 🟡⚠️ | 中 | 中高 | 最大獨立模組；與 GAS／圖片壓縮耦合深 |
| 位置共享 | GAS `updateLocation` / `getLocations` | 🟡 | 低～中 | 中（家庭） | 隱私與電量成本要標清楚 |
| 主題／深淺色 | `ThemeConfig.jsx`、trip theme | ✅ | 高 | 低 | 驗證器要求 light/dark |
| 測試模式 | `TestModePanel.jsx` | 🟡 | — | 開發用 | 勿進正式旅途主流程 |
| PWA 更新 | `PwaUpdatePrompt.jsx` | ✅ | — | 中 | 出差前更新很重要 |
| 緊急聯絡資料 | `tripConfig.emergency` | ✅資料／❓UI | 高 | **很高** | 資料已有；需確認是否一眼可達 |

### 分頁（導航真相來源）

`useTripNavigation.js` 合法 tab：`itinerary`｜`guides`｜`shops`｜`ai`｜`finance`  
預設：`itinerary`；URL `?tab=` 可深連。

### 後端 GAS actions（已見）

- 寫入流：`add`／`addBatch`／`edit`／`delete`（記帳／記事）
- 讀取／位置：`getLocations`（另有 getAll 等，以 `api.gs` 為準）
- 圖片上傳、位置更新（手冊有列；實作以 `api.gs` 為準）

## 對三目標的診斷

### 1. 通用 — 方向對，負擔在資料檔形態

**已做對的事**
- 一旅程一檔 + `.env` 切換
- `tripValidation.js` 擋壞資料
- CI 對 `2026_busan`／`2026_karuizawa` 各建一次

**阻力**
- 資料檔是 JSX（內嵌 Lucide icon），難給非工程伙伴編、也難做 CMS／JSON
- 單檔 1200～1700 行，複製新旅程摩擦大
- `AuthenticatedTripApp` 仍可能藏城市假設（需持續清）

### 2. 易用 — 功能多，主線不夠「旅途中」

五個底部分頁平均用力，使用者要自己找「現在該看什麼」。  
緊急聯絡、下一站、離線狀態若埋在行程細節裡，壓力情境會失敗。

### 3. 好用 — 能力面很齊，維護面扛不住

記帳、AI、地圖、天氣都在，但改一處常要進巨石檔；`FinanceNote.jsx` 本身又是第二顆巨石。

## 技術債與風險（優先序）

1. **P0** `AuthenticatedTripApp.jsx` 巨石（狀態、手勢、AI、語音、位置、主題、多 tab UI 混雜）
2. **P0** 旅途中 IA 不夠尖銳（缺「今天／現在／出事」主線）
3. **P1** `FinanceNote.jsx` 過大，重啟時應獨立演进，勿再塞回 shell
4. **P1** 旅程資料 JSX+icon → 建議逐步改純資料（JSON/JS object）+ UI 端映射 icon
5. **P1** `technical_manual.md` 與實作漂移（地圖庫等）
6. **P2** 前端暴露的 `VITE_ENCODED_*` 僅混淆非真密管（文件已警告）
7. **P2** Cloud Agent／CI 遠端協作需確保 GitHub 授權可用（本機盤點時遠端 agent 無法存取 repo）

## 建議原則（重啟時遵守）

1. **不重寫**：保留 PWA、驗證、雙旅程、GAS、測試骨架  
2. **先可改、再變好**：拆檔優先於新功能  
3. **旅途中 > 出發前 > 開發者工具**  
4. **新功能必須能被「換 tripdata」覆蓋**，否則不做進核心  
5. **每階段都要能 `npm run check` + 至少一個 trip build**

## 分階段 Backlog

### P0 — 讓專案「敢繼續改」（1～2 週量級，可拆 PR）

| ID | 項目 | 完成樣貌 |
|----|------|----------|
| P0-1 | 拆 `AuthenticatedTripApp` 為 shell + tab panels | `ItineraryPanel`／`GuidesPanel`／`ShopsPanel`／`AiPanel`／`FinancePanel` 各自檔案；shell < ~800 行目標可再調 |
| P0-2 | 抽出跨 tab hooks | 主題、線上狀態、語音、位置共享、Gemini 呼叫各自 hook／module |
| P0-3 | 「旅途中」資訊架構草案（先設計、可先做導航實驗） | 明確三入口：今天／下一站、現在需要、緊急；可先用現有 tab 重組，不必新寫後端 |
| P0-4 | 緊急資訊可达性 | `tripConfig.emergency`（＋飯店電話）從任一主畫面 ≤2 次點擊可到；離線可見 |

### P1 — 對準通用＋好用

| ID | 項目 | 完成樣貌 |
|----|------|----------|
| P1-1 | 旅程資料 schema 文件化 | 一份 `TRIP_DATA_SCHEMA.md`（欄位、必填、範例）；與 `tripValidation` 對齊 |
| P1-2 | 資料與 UI 圖示解耦 | tripdata 用 icon key 字串；元件映射 Lucide |
| P1-3 | 「今天／下一站」體驗 | 依 `timeZone`+日期自動定位 Day；下一事件＋一鍵地圖／地址 |
| P1-4 | 「現在需要」聚合 | 交通票、Wi‑Fi、換匯、藥局／醫院、常用連結從 guides/links 精選，而非整本指南 |
| P1-5 | 地圖文件與實作對齊 | 更新 `technical_manual.md`；確認離線圖磚／失敗降級 |
| P1-6 | Finance 模組邊界 | `FinanceNote` 維持 lazy；列清 GAS 契約測試；不與 AI chat 狀態交纏 |

### P2 — 增益與長期

| ID | 項目 | 完成樣貌 |
|----|------|----------|
| P2-1 | 新旅程產生器／範本精簡 | `npm` script 或範本檔，10 分鐘可開空殼旅程 |
| P2-2 | 位置共享改為明確 opt-in UX | 預設關、家庭用途說明、可見狀態 |
| P2-3 | AI 離線降級 | 無網時顯示常用片語／已快取回答，而非空白錯誤 |
| P2-4 | 密鑰治理 | Maps key 網域限制；Gemini／敏感呼叫儘量經後端代理 |
| P2-5 | 文件一次對齊 | README 短＋手冊長；刪過時 Leaflet 描述 |

## 建議的「下兩個」實作任務

1. **P0-1**：只做結構拆分，行為不變（行為等價重構）  
2. **P0-4 + P0-3 草案**：緊急入口 + 旅途中導航草圖（可先低保真改底部／頂部入口）

## 刻意先不做

- 換框架／重寫成另一套 app  
- 一次合併所有 UX 大改與重構  
- 為了「看起來通用」先做多租戶後台  
- 在巨石檔上繼續堆新功能

## 附錄：關鍵路徑速查

```
src/App.jsx                    認證閘門
src/AuthenticatedTripApp.jsx   主殼（待拆）
src/config/tripData.js         載入＋freeze 設定
src/trip/tripdata_*.jsx        旅程內容
src/hooks/useTripNavigation.js tab 狀態
src/utils/tripValidation.js    資料驗證
src/utils/api.js               GAS retry client
api.gs                         後端
TRIP_SETUP.md                  換旅程操作說明
technical_manual.md            架構手冊（部分過時）
```
