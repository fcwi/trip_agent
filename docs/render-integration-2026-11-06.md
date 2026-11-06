# Render 版待補項目整合紀錄 — 2026-11-06

## 結果

以 GitHub `main` 的 `9bf97b0` 為基礎，逐段整合 10/23 本機定版內容。沒有整包還原 stash，沒有部署或推送。原備份 `eada2032bacc30dd9bbfe6f33e99f3588480c0d6` 仍保留。

新版後端登入、Cookie session、跨分頁鎖定、失敗登出保護、IndexedDB 交易保存、AI 模式隔離與 Search／Maps 來源功能均保留。`server/`、`useTripAuthentication.js`、`authClient.js`、`aiGrounding.js`、`indexedDBManager.js` 未被舊版覆蓋。

## 待補項目完成表

| 項目 | 完成內容 |
| --- | --- |
| 地圖安全修補 | MapLibre 6.16.0、style-spec 26.5.1；引擎與 worker 一起打包，支援下載失敗原地重試，保留新版標籤修補及缺少 road shield 的處理。 |
| 正式依賴檢查 | 新增 `security:audit` 並加入 CI；升級鎖檔中的相容修補，正式依賴掃描為 0 個已知漏洞。另修補開發依賴 Zod；開發工具仍有 6 項低／中風險警示，未強制降版 PWA 工具。 |
| 東北行程 | 補回銀山冬季交通、角館石黑家休止公開、阿仁站名／方向、猊鼻溪活動尺度等提醒；未確認航班、住宿、草莓園與魚板體驗供應商仍明確標示。 |
| 16 間具體店家 | 新增 `tohokuShopGuide.js`，提供分店、位置、參考時間與官方／觀光來源；店家來源與 Google Maps 搜尋分開顯示。NISHIKIYA 改連品牌分店開幕公告，ずんだ茶寮改連明確分店頁。 |
| AI 內容 | 店家上下文涵蓋一般與特色店家、位置、參考時間、核對日與官方來源，行程上下文保留待確認項目；同時保留新版 grounding 及來源驗證規則。 |
| 高低溫 | 首頁、當日摘要、每日資訊與七日預報統一高溫左、低溫右，溫度條及目前溫度點同步反向計算。 |
| 定版視覺 | 補回手帳樣式、插畫貼紙、日夜場景與交通工具導航，沿用原方向與配色，不重新設計。 |
| 標題與鍵盤 | 五個分頁共用標題；AI 與紀錄各自追蹤 visualViewport，內容獨立捲動，鍵盤開啟時避讓底部導航及次要匯率列。 |
| 新版工具列 | 保留新版 AI／紀錄單行工具列、紀錄空狀態與操作，使用共用樣式類別整合舊版空間改善；手機的編輯／刪除操作不依賴 hover。 |
| 測試與規範 | 補回五份定版測試與 AGENTS.md／歷史檢查文件；測試使用伺服器登入取得 Cookie，AI 攔截改為同源 `/api/gemini/*`。 |
| Render 整理 | 前端預設根路徑 `/`；移除舊 GitHub Pages 的 homepage、deploy／predeploy 及 gh-pages；更新環境範例、TRIP_SETUP 與後端說明。 |
| 執行版本 | `.nvmrc`、CI、Dockerfile 均使用 Node 24.22.1 LTS；已核對 Docker 官方 `24.22.1-alpine` 標籤存在。 |
| 本機檢查資料 | ESLint／Git／Docker 排除本機技能、截圖與來源壓縮包，避免混入程式檢查或 Render 建置上下文。 |

## 官方資訊復核

店家原始查證日仍是 **2026-10-23**。本次復核可讀的官方分店頁與重要公告，不把資料擷取日改寫成店方公告日，也不宣稱 2027 年旅行當天營業已確定。

- [角館觀光協會](https://tazawako-kakunodate.com/news/19439/)：公告石黑家於 2026/11/30 結束一般公開；本趟不排入內參觀。
- [銀山溫泉 2026 交通公告](https://www.ginzanonsen.jp/blog/archives/620)：保留冬季入場／接駁需確認的提醒，不把上一季規則當成新季團體安排已確認。
- [阿仁滑雪場](https://www.aniski.jp/)與[秋田內陸線路線](https://www.akita-nairiku.com/routemap/)：保留樹冰活動與列車站名的區分，不補造團體乘車班次。
- [名取 AEON](https://natori.aeonmall.jp/shop/b41d19d6-c80e-4ffb-b38f-b4e5e6316785)、[丸亀製麺](https://natori.aeonmall.jp/shop/ecbf2b7b-764c-4bdf-9c37-24e4bc7ace1f)、[LOFT](https://natori.aeonmall.jp/shop/c9f4d518-a64d-40e3-8dde-9d032ec8b098)、[ドリームカプセル](https://natori.aeonmall.jp/shop/f7898604-e4a6-4af4-ae70-512f0e9789c0)：分店、樓層與參考時間可查。
- [NISHIKIYA 分店公告](https://www.nishiki-shokuhin.jp/news/pkobo_news/upload/223-0link_file.pdf)、[喜助 S-PAL](https://www.kisuke.co.jp/spal/)、[菓匠三全](https://www.s-pal.jp/sendai/floormap/菓匠三全/)、[ずんだ茶寮分店](https://www.sanzen.co.jp/store/078/)、[仙台 LOFT](https://www.loft.co.jp/shop_list/detail.php?shop_id=285)：改用或保留實際分店來源，不以品牌首頁冒充分店查證。
- [阿部蒲鉾店觀光介紹](https://datekan.jp/manabitabi/spots/笹かまぼこ手焼き体験-2/)、[雪竹屋](https://www.matsushima-kanko.com/shopping/detail.php?id=58)、[唐土庵](https://www.morokosian.jp/store04.html)、[藤木伝四郎](https://fujikidenshiro.co.jp/?mode=f1)：分店與地址有來源，推薦不代表團體預約。
- [銀山商店頁](https://www.ginzanonsen.jp/store/)可讀；官方散策 PDF 本次回應 403，部分店家時間保留舊參考資料及原核對日，未改標為今日已確認。

仍需旅行社出發通知：正式航班與集合、四晚實際飯店、草莓園、魚板承辦店、列車方向／班次、預約及包含費用、銀山當季安排。這些不是可由程式碼自行補成確定資訊的缺項。

## 驗證

- 110 項單元測試、2 項後端測試通過。
- 最終鎖檔重新執行 `npm ci`、`npm run check`、`npm run test:server` 通過；MapLibre 6.16.0、style-spec 26.5.1、Zod 4.6.7 與鎖檔一致。
- 75 項瀏覽器案例全部通過：先跑 35 項整合案例，再跑其餘 40 項，沒有重複計數。使用獨立 Chrome、假密碼及假服務，不使用正式帳目或付費 AI。
- 正式產物東北旅程 4 種情境通過：320px 亮色／390px 深色，各含離線重新啟動與冷快取慢網路。每情境涵蓋六頁、地圖恢復、本機紀錄、AI 失敗提示與字體快取。
- 最終乾淨安裝後，Render 根路徑正式建置及 `build:verify` 通過，入口 gzip 62.76 KiB、初始 JS gzip 74.60 KiB。地圖與 HEIC 選用分包仍有既有大小提示，按需載入。
- 離線重開仍需連線驗證 session，未恢復舊版以本機密碼繞過伺服器驗證的流程。
- 正式依賴 audit：0；包含開發工具的 audit：6 項（2 low、4 moderate），沒有 high／critical。原始掃描證據保存在本機 `.taste-skill/`。
- 本機無 Docker 執行環境，因此沒有宣稱已完成容器執行或 Render 正式站驗收；Docker 標籤已核對存在。

## 視覺檢查

沿用既定 Editorial greeting 方向（seed 1070326585），無重抽方向。旅行內容成為可翻閱的手帳；主要工作是查看下一站、切換日期、記帳與詢問導遊，交通標記及目的地插畫仍是識別元素。

Taste inspector 在 1440／768／390px 的整合後結果為 **0 FAIL、1 WARN**。沿用使用者要求的 glass、font-count、icon-chips、palette-cream 及固定導航捲動採樣 covered-text 例外。唯一 WARN 為 unused-canvas：桌面內容置中且左右留白，工具把獨立左導航軌算進內容邊界；沿用定版寬度，不為工具評分改版。

六個聚焦檔案的通用 Taste 靜態掃描另有 3 FAIL、56 WARN：指南頁原有的三個 purple 工具類別命中禁色規則，陰影及 backdrop blur 命中 56 筆提示。這是工具的通用風格規則，未視為推翻使用者定版配色、插畫陰影與毛玻璃的授權；保留命中紀錄，不宣稱全庫靜態 Taste 掃描通過。ESLint、行為測試與實際瀏覽器量測結果如上。

檢視三種尺寸的首屏及全頁截圖，並核對 AI、紀錄與店家頁：

1. 下一個行程日先於封面閱讀，主要動作可直接進入當日行程。
2. 桌面主要區塊共用內容邊界；手機長標題可換行或省略，完整名稱仍有可存取文字。
3. 手帳紙張、日夜插畫與毛玻璃為使用者定版例外，不套用一般管理後台的純灰規則。
4. 清單數量與紀錄金額來自狀態／資料，沒有加入虛構統計。
5. 缺少天氣顯示缺資料與復原入口，不把缺值寫成零度。
6. 天氣高低順序、地圖標記及交通工具都與資料一致；此工具沒有圖表圖例需求。
7. 手機保留可操作的固定導航，鍵盤開啟時收起；內容末端保有捲動避讓空間。

證據位於 `.taste-skill/render-sync-inspect/`、`render-sync-after/`、`render-sync-after-light/` 與 `test-run.local/production-audit/`。保持本機證據與第三方技能不進入部署產物。

## 發布邊界

這次完成本機整合與驗證，沒有提交、推送或部署。實際 Render 網址尚未提供；正式站提交版本、平台機密與真實 Gemini／GAS／MapTiler 的驗收仍待部署時處理。
