# 安全更新 — 2026-10-23

依使用者「請幫我更新」指示，更新本機 Node.js、正式地圖依賴與可相容修補的開發工具。未調整定版視覺或旅程資料；已依後續「請部屬」指示發布至 GitHub Pages。

## 版本與變更

| 項目 | 更新前 | 更新後 |
| --- | --- | --- |
| Windows 主要 Node.js | 24.19.0 | 24.22.1 LTS |
| 隨 Node 安裝的 npm | 11.17.0 | 11.19.1 |
| MapLibre GL JS | 5.19.0 | 6.15.0（明確鎖版） |
| MapLibre style spec | 24.6.0 | 26.4.4（與地圖引擎一致） |
| Vite | 7.2.7 | 7.3.7（最低範圍同步提高） |
| PostCSS | 8.5.6 | 8.5.31 |
| Tailwind CSS | 3.4.17 | 3.4.19，保留原有框架世代 |

- 系統 Node 透過 winget 的官方 Node.js MSI 更新，安裝成功後另以 `node --version` 確認。未修改 Codex 自帶的其他 runtime。
- `.nvmrc` 設定 24.22.1，package engines 要求 `>=24.22.1 <25`；四個 CI 工作改讀同一版本檔，使用 check-latest 避免舊 runner 快取。
- 套用版本範圍內的安全修補並更新 package-lock。對 `brace-expansion@^1.1.7` 使用 1.1.21，以及對 `postcss-selector-parser` 使用 7.1.7 的 overrides；已以實際樣式建置與瀏覽器驗證相容性。
- 新增 `npm run security:audit`（正式依賴漏洞檢查）並加入 CI。原有 `security:check` 仍是敏感資料檢查，兩者用途不同。
- ESLint 排除 `.agents` 與 `.taste-skill` 的第三方技能、參考專案；應用、腳本及測試原始碼仍會檢查。

## 地圖修補與載入相容性

[MapLibre 維護者公告](https://github.com/maplibre/maplibre-gl-js/security/advisories/GHSA-jrc7-96c5-q579) 指出來源標示清理器可能略過連續危險屬性，修補版起點為 6.4.1；本輪採 6.15.0。

MapLibre 6 已移除原本使用的 UMD 檔案，改為 ES modules 與獨立 worker。更新主地圖及座標選擇器的載入介面，讓 Vite 打包 worker URL，保留按需載入及離線快取策略。新增小型建置插件，輸出具有完整公開介面的引擎網址；失敗後重試使用新的模組查詢參數，避免瀏覽器記住第一次失敗而必須重整頁面。正式壓縮建置明確保留模組 export signature，避免開發模式正常、正式模式卻因匯出名稱縮寫而失敗。

新增兩個回歸案例：第三方來源標示不能保留連續事件屬性，以及引擎下載失敗後能原地手動重試。測試只在本機模擬內容與旗標，不對公開服務輸入測試內容。向量圖磚測試資料改用新版 pbf 的 PbfWriter。

## 安全掃描結果與殘餘限制

- 更新前完整依賴樹：33 筆套件警示（1 critical、23 high、8 moderate、1 low）；正式依賴 2 筆。
- 更新後正式依賴：**0 個已知漏洞**。
- 更新後完整依賴樹：**7 筆 high 套件警示**，全部來自開發／發布工具的 `braces` 相依鏈：braces、chokidar、micromatch、fast-glob、globby、gh-pages、tailwindcss。這不是 7 個不同的公開網站漏洞，也不是已完成全庫零警示。
- [braces 公告](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) 的受影響版本截至檢查時仍無修補版。觸發條件為工具處理惡意深層 brace patterns，可能導致 Node process 堆疊耗盡。這些工具處理本機專案的路徑／設定，不會隨 dist 上傳到 GitHub Pages；應避免向建置工具提供不可信 pattern 或執行不可信專案。
- 未執行 `npm audit fix --force` 強制將 Tailwind 3 遷移為 4，也未用不相容替代套件隱藏掃描結果。待上游修補或另行規劃完整框架遷移。沒有更改使用者定版版面來清除開發工具警示。
- [Node.js 24.22.1 官方安全版本](https://nodejs.org/en/blog/release/v24.22.1) 涵蓋 2026-10-21 公告的修補。本次未安裝 PHP，因專案未使用 PHP。
- 掃描是當時已知公告的依賴比對，不等同滲透測試，也不代表不存在其他未公告問題。

## 驗證

- ESLint、敏感資料掃描與 88 個單元測試通過。
- 45 項相關瀏覽器案例完成驗證：最後一輪 44 項通過；新增下載重試案例因路線回應會自動重新繪製地圖，改成單點 fixture 固定手動重試情境後另行通過。未降低原本功能斷言。
- 舊煙霧測試的航班文字斷言同步至既有「暫定時刻，待出發通知確認」；工具位置改檢查各尺寸都在畫面內且不與分頁按鈕重疊，適用定版後桌面直向導覽。未改產品內容或版型迎合測試。
- 正式產物 4 情境通過：東北行程 320px 亮色、390px 深色，各含離線重新啟動與冷快取慢網路；每情境涵蓋 6 頁。確認地圖引擎恢復、AI 錯誤提示、記帳重開保留、字型快取與旅程切換。
- 正式測試原預設 5189 埠被 Windows 拒絕綁定，新增可設定埠後使用 4189 重跑；預設 CI 行為保留。
- 檢視日夜手機與桌面地圖截圖，路線、標記與縮放控制保留。地圖外部服務使用隔離資料，不操作真實雲端帳目。
- 正式建置、PWA 輸出驗證與 git diff --check 通過。地圖及 HEIC 套件仍有大型分包提示，非建置錯誤。

本機證據：`.taste-skill/security-audit-2026-10-23.json`、`test-run.local/production-audit/results-2027_tohoku.json` 及 `test-run.local/map-*.png`。

## 發布狀態

**已部署 — 2026-10-23。** 本機 Node.js 更新與公開網站地圖安全修補皆已生效。

- 公開網址：https://fcwi.github.io/trip_agent/
- 發布版本：`dbb4a0a12d024960b54dda02f11cce27a44ba569`。
- 公開入口：`/trip_agent/assets/index-B5ZGbXGy.js`，與本機正式建置一致。
- 入口、manifest、service worker 均為 HTTP 200；service worker SHA-256 與本機一致。
- 另外比對地圖引擎 `maplibre-gl-My3fgx7d.js` 與 worker `maplibre-gl-worker-Oa3i4_IL.js`，兩者皆 HTTP 200 且 SHA-256 與本機修補版一致。
- 部署前再次通過敏感資料掃描、建置輸出驗證及正式依賴安全掃描（0 個已知漏洞）。前述 7 筆開發工具警示仍保留，並未因部署而消失。
- 本次僅發布網站成品，未另行提交來源分支。已安裝舊版 PWA 的裝置需連線並套用網站更新，才會使用新版快取。
