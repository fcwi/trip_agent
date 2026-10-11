# Trip Agent 整體 UI/UX 複查（2026-10-11）

## 本次完成

- 首頁封面纜車改為有車窗、輪胎與道路的手繪遊覽車，移除懸吊纜線。
- 每日日期選擇器共用同一款遊覽車插畫，維持現有紙張色、粉彩與手繪線條。
- 每日景點章中的纜車保留：那是實際纜車景點的插畫，不是全站品牌圖案。
- 不更換已正常運作的 API 設定。

## 檢視方法

使用 UI/UX Pro Max 原始 skill（本機參考庫 `.claude/skills/ui-ux-pro-max/SKILL.md`，參考版本 `67803ea`），閱讀 quick-reference 與 pro-rules，執行 `mobile touch target spacing`、`form visible label` 的 UX 搜尋，以及 React stack 的 `responsive accessible forms` 搜尋。檢視保留現有視覺方向，未重新生成或覆寫設計系統。

檢視首頁、Day 1–5、指南、商店、AI 導遊與記錄頁，共 10 個頁面狀態。額外檢視完成暱稱設定後的記錄輸入表單，並核對編輯視窗與加密工具原始碼。

瀏覽器矩陣：WebKit 402×874、874×402、402×874／125% 文字；Chrome 412×915、480×1040、915×412、320×740。每種設定皆檢視明暗模式與 reduced-motion 偏好，共 14 組、140 個頁面狀態檢查。

瀏覽器測試使用假憑證與隔離資料，封鎖外部服務請求；地圖／天氣的未設定或離線畫面屬測試條件，不代表正式網站故障。這是瀏覽器模擬，並非實體 iPhone／Galaxy 或原生 Dynamic Type 認證，也不是完整 WCAG 合規認證。

## 優先改善清單

| 優先度 | 已確認的發現 | 具體修改計畫 | 驗收方式 |
| --- | --- | --- | --- |
| P1 | 記錄頁 `financeAmount`、`financeTextInput` 只有 placeholder，缺少關聯 label 或 accessible name。編輯視窗的文字 label 也缺少 `htmlFor`。 | 在 `src/components/FinanceNote.jsx` 為金額、項目說明／記事內容提供可見 label 與對應 id；編輯欄位建立 label 關聯。 | 以欄位標籤定位輸入框；輸入後仍能辨識欄位用途；小手機與放大文字不溢出。 |
| P1 | 部分粉彩卡片的次要文字色與底色組合不達 4.5:1。淺色藍底 3.30、黃底 3.74；深色藍底 3.23、黃底 2.75。 | 在 `src/styles/journal.css` 為有色卡片建立可讀的次要文字色，保留既有主色；檢查眉標 opacity 對有效對比的影響。 | 測量實際文字與背景（包括透明度），一般文字至少 4.5:1；分別檢查明暗模式。這些數值是特定 token 組合，不表示所有卡片文字都失敗。 |
| P1 | CSS 支援減少動畫，但日期切換的 Framer Motion 使用 JavaScript transform 動畫，原始碼未見 `MotionConfig`／`useReducedMotion` 對應。 | 為行程切換與全站動畫接入使用者 reduced-motion 偏好，避免大幅水平位移。 | 啟用偏好後切換日期仍立即可操作，沒有滑動轉場；一般模式保留原有轉場。現有矩陣證明版面可用，未證明所有 JS 動畫已停用。 |
| P2 | 記錄頁搜尋與同步按鈕為 28×28；模式切換高度 32；送出、上傳等約 40–42。導遊頁搜尋／清除為 28×28，朗讀按鈕約 22×22；天氣重新整理約 34×34。 | 擴大 `FinanceNote.jsx`、導遊／訊息元件與天氣元件中獨立操作按鈕的可點區至至少 44×44 CSS px，並檢查間距與橫向 reflow。 | 412／402／320 寬皆容易點選，放大後不擠壓輸入框。此為手機操作舒適度目標，不把原生 pt／dp 或 44px 當作 Web WCAG 通用門檻；22px 控制需另查 WCAG 間距等例外條件。 |
| P2 | 加密工具只有 Gemini／Maps 選項；Maps 未區分 Google Maps 與 MapTiler，易混淆服務用途。 | 在 `src/components/AuthenticationScreen.jsx` 明確區分服務名稱，將管理者設定收在進階入口，避免首次使用旅客誤認需要自行設定金鑰。 | 一般旅客只需解鎖；管理者能辨識 Google Maps、MapTiler 與各設定欄位用途。 |
| P2 | 主中文字型檔約 2.1 MB，初次慢網路下載成本較高。 | 評估字型子集與系統中文字型 fallback，保留使用者自行輸入的中文可讀性。 | 慢網路下正文先可讀；字型切換不造成明顯位移；不出現缺字。 |

## 目前可保留的設計

- 手繪向量插畫、紙張色背景與粉彩卡片已形成一致風格；下一波應修可讀性與操作細節。
- 五項主要導覽數量合理；日期選擇器保留按鈕操作，不依賴滑動。
- 一般表單輸入文字維持 16px；新記錄暱稱已有明確標籤。
- 主文字／紙張背景的 token 對比為淺色 11.88、深色 13.67；次要文字／一般卡片背景為淺色 5.52、深色 7.08。

## 驗證與證據

140 個頁面狀態檢查皆通過，檢視期間未記錄到 JavaScript page error；主體頁面的可見按鈕未發現缺少可辨識名稱。這些通過項目不抵銷上方的欄位標籤、對比與操作尺寸問題。程式碼 lint、正式建置與建置產物檢查皆通過。

本次版面檢查結果與逐頁觀察儲存在忽略的 `test-run.local/coach-ui-review/`，包含首頁、每日頁、指南與記錄表單截圖、`report.json`、`observations.json` 及 `record-controls.json`。不將完整雜湊或任何憑證寫入公開報告。

本次修改檔案：`src/components/Itinerary/JournalIllustration.jsx`、`src/styles/journal.css`。修改前備份：忽略的 `backups.local/before-coach-ui-review-20261011.zip`。
