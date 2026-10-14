# 插畫與東北行程整理（2026-10-14）

## 本輪內容

- 新版本更新通知改為畫面中央，以 portal 放在 document.body，避開頁面 transform、overflow 等容器影響。保留原有更新與關閉行為，加入安全區留白與短畫面內部捲動。離線就緒訊息置於上方，避免首次登入時遮住表單。
- 延伸現有手繪 SVG：調整主次線條、加入封面紙張點紋與輕量風景細節；每日景點章新增街屋圖案，讓銀山／角館內容有相應的插畫。保留遊覽車、粉彩色與手繪輪廓，不載入外部作品或新增大型圖片。
- 收細封面、日標題與事件卡邊線，加入克制的紙片陰影與分隔線。正文區域保持素底，減少裝飾與資訊爭奪注意力。
- 潤稿五天共 28 個事件與 8 篇指南，加入 5 段每日導讀及首頁短摘要。移除私人命令口吻、反覆比較與粗略備註；餐食、採果、船型與活動包含項目採符合團體安排的描述。
- 保留既有日期、時間、地點查詢與座標、航班及日序；未宣稱已確認 2027 年的實際出發通知、館名、園區或各項預約。護照提醒改為核對證件與旅行社要求，免稅退款說明改為店家／指定業者在持出確認後處理，避免誤認在機場立即領取退款。
- 重新生成中文字型子集，確保新增文案使用的支援字元完整保留。

## 參考與查核

設計參考：

- [Scott Dunn Passport Issue 2](https://www.timandres.co.uk/projects/scott-dunn-passport-issue-2)：旅行手帳的精細編排、訂製插畫及便箋細節。
- [Julia Emiliani — Travel Editorial Illustrations](https://www.juliaemiliani.com/travel-editorial-illustrations-2)：以景觀、建築等地方特色構成插畫。
- [Sarah Locher — Illustrated Travel Journal](https://sarahlocher.com/en/travels)：短篇旅程記錄與插畫的配合。

景點與制度描述參照官方資料；內容以簡短導覽為主，未新增未確認的團體服務：

- [JNTO 銀山溫泉](https://www.japan.travel/tw/spot/1798/)
- [JNTO 角館](https://www.japan.travel/tw/destinations/tohoku/akita/kakunodate-and-around/)
- [秋田官方旅遊資訊：森吉山與阿仁纜車](https://akita-fun.jp/spots/327)
- [JNTO 猊鼻溪](https://www.japan.travel/tw/experiences-in-japan/1934/)
- [JNTO 松島](https://www.japan.travel/tw/spot/2127/)
- [日本國稅廳：2026 年 11 月起免稅退款制度](https://www.nta.go.jp/publication/pamph/shohi/menzei/201805/format/002.htm)

## 額外錯誤截圖

`Failed to launch itms-appss://… because the scheme does not have a registered handler` 表示裝置未能啟動 App Store。來源程式沒有該 scheme 或 App Store URL；地圖連結採一般 HTTPS Google Maps 網址。僅憑截圖無法確認是哪個外部頁面觸發跳轉。Self-XSS 文字為開發工具的安全提醒。

原先 MapTiler 數值空值及缺少圖示警告仍需實際 style.json 圖層內容定位，本輪未宣稱已解決。

## 備份與驗證證據

修改前來源備份：忽略的 `backups.local/before-editorial-polish-20261014.zip`；正式設定備份：忽略的 `backups.local/env-before-editorial-20261014.private`。測試使用隔離資料與假憑證，不修改正式服務資料。

新版版面與逐頁檢查證據：忽略的 `test-run.local/editorial-20261014/`。通知回歸測試包含 320、402、412px 直向與 874、915px 橫向，並刻意將頁面容器設為 transform／overflow，確認通知仍位於完整可視範圍中央；同時驗證更新與關閉操作。

驗證結果：69 項單元測試、lint／來源安全檢查、35 項端到端案例皆已通過。主題回歸測試已改為先明確選擇配色，避免依賴時間決定的初始主題。14 組配置共 140 個頁面狀態通過；WebKit 另核對通知直向、橫向與 125% 文字。正式建置的 4 組離線重開／慢網路案例通過，包含字型快取；操作頁面標頭前，以正常關閉按鈕確認首次離線提示。正式建置與產物檢查通過，正式設定與備份一致。

上述為瀏覽器模擬與隔離服務測試，並非實體手機或原生文字縮放認證。最後核對亦確認既有行程時間、座標與每日日期保持一致。
