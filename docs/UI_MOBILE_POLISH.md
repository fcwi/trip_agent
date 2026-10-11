# 手機閱讀與正式文案修整（2026-10-11）

本次保留既有影片參考的手繪旅行手帳風格，集中修正草稿文字、閱讀密度與手機相容性。

## 文案

- 東北行程的首頁、五天行程、住宿、景點、購物、指南及清單，移除「可刪」「未保證落點」、版本號及回填程式資料的編輯指示。
- 保留對旅客有用的天候與集合提醒，改寫為可直接閱讀的句子。
- 尚未確認的航班時刻仍顯示「時刻依出發通知」；住宿區域不宣稱已訂房，參考飯店明確顯示住宿參考說明。
- 移除未核實的活動取消退費金額，改為向領隊確認退費方式。
- 縮短副標題為日期，避免重複旅程名稱；每日提醒使用旅客用語。
- 未填寫的車程耗時省略，不再顯示「待領隊」占位文字。

## 排版

- 標題使用自然換行與 `text-wrap: balance`，保留不支援此屬性的自然換行退路，不插入固定斷行。
- 減少首頁卡片間距、封面內距與手機標題字距，保留清楚的閱讀層級。
- 每日標題插圖縮至 56px，給長路線標題更多空間。
- 時間軸減少左側佔用及交通列內距；類型與車程不拆字，必要時整段換到下一列，地圖按鈕保持 44px。
- 指南標題與正文分別使用 16px，摘要使用 14px／兩行，展開後可以閱讀完整內容。
- 發現並修復語音 API 不可用時整個行程頁載入失敗的問題，加入對應回歸測試。

## UX/UI Pro Max

使用 [原始專案](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) 的 `.claude/skills/ui-ux-pro-max/SKILL.md`，直接執行附帶的本機搜尋工具。

- `orphan heading line balance --domain ux`：核對 Typography／Heading Line Balance，採用標題平衡換行與跨字型、寬度檢查。
- `chip badge overflow nowrap --stack html-tailwind`：核對 Layout／Compact label layout，採用完整標籤換行、不拆短標籤、控制項不收縮。
- 依 Quick Reference 的可讀性、焦點、觸控、深淺色與響應式項目檢查既有畫面。現有 React、Tailwind 與圖示系統繼續沿用。

## 裝置與驗證範圍

| 檢查環境 | CSS 尺寸 | 瀏覽器引擎 |
| --- | --- | --- |
| iPhone 18 Pro 直向 | 402 × 874 | WebKit |
| iPhone 18 Pro 橫向 | 874 × 402 | WebKit |
| Galaxy S25 Ultra 常見寬度 | 412 × 915 | Chrome／Chromium |
| Galaxy 寬版顯示設定補充 | 480 × 1040 | Chrome／Chromium |
| Galaxy 橫向 | 915 × 412 | Chrome／Chromium |
| 小螢幕退路 | 320 × 740 | Chrome／Chromium |
| iPhone 放大文字補充 | 402 × 874、125% 文字 | WebKit |

每個環境分別測試淺色與深色；檢查首頁、五天行程、指南、商店、導遊及記錄頁。檢查頁面水平溢出、正式文案、交通時間完整性與執行錯誤，並檢視實際畫面。

Apple [官方規格](https://www.apple.com/iphone-18-pro/specs/) 列出 1206 × 2622 螢幕像素；402 × 874 是以 3 倍像素比推估的測試視窗，不宣稱官方公布 CSS 視窗。Samsung [官方規格](https://images.samsung.com/is/content/samsung/assets/us/business/mobile/phones/galaxy-s25/02052025/S25_Series_B2B_Spec_Sheet_HRc.pdf) 列出 QHD+ 顯示器；Galaxy 的 CSS 寬度會隨顯示設定而異，因此測試多個寬度。

這是瀏覽器模擬驗證，並非實體手機操作；125% 文字壓力測試也不等同完整 iOS Dynamic Type 驗證。測試阻擋外部服務，不能據此宣稱真實天氣、定位、雲端或地圖服務可用。

修改前備份：`backups.local/trip-agent-before-mobile-polish-14f782a.zip`。

## 驗證結果

14 組排版環境全部通過（140 次頁面／每日檢查）；最後移除七處未填寫車程後，兩款主要手機的深淺色再次全部通過（40 次檢查）。具體範圍、引擎、文字倍率與最終來源雜湊見 [驗證記錄](UI_MOBILE_VALIDATION.json)。

程式檢查、65 項單元測試、30 項瀏覽器回歸測試，以及正式建置與建置驗證均通過。
