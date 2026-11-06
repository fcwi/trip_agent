# 緊湊手帳與 AI 對話修正

依使用者兩張參考圖，延續既有 Editorial greeting 方向（seed 1070326585），未重抽或改換框架。這是上一輪已部署網站之後的新修改，已依使用者後續要求於 2026-10-23 部署。

## 設計與版面

- 日期列改回實際日期、Day 標籤、連續路線與圓節點；總覽是獨立的直式索引。選取的日期以粉色標記，交通圖案用共享版面動畫移到對應日期；減少動態效果時直接定位。手機最小按鈕仍至少 48 × 100px，窄螢幕的超出內容只在日期列內捲動。
- 保留原遊覽車，新增原創纜車與列車：東北第 3 天使用纜車、釜山第 2 天使用列車、輕井澤首末日使用列車，其餘為遊覽車。這是翻頁位置標記，不表示即時車輛定位。
- 大區塊間距從 28px 收至 18px；內容襯距由桌面 24px／手機 20px 降至桌面 18px／手機 14px。頁首、封面、航班、當日簡介與行程摘要同步收緊。
- 主標 22–28px、區塊標題 18px、景點名稱 17px、集合與時間資訊 14–17px；說明正文保留 15–16px，次要日期／數量／狀態約 12px。指南展開正文仍為 16px。沒有以縮小所有字或縮小觸控範圍來壓縮版面。
- 依內容加入原創行李箱、相機、護照與筆記本貼紙：出發準備配行李箱，回顧配相機，清單配護照，每日簡介與指南配筆記本，商店配旅行箱。三張目的地風景小品加上紙邊及和紙膠帶，保留日夜插畫與溫暖紙色。
- 封面和摘要、航班和清單在寬桌面共用底緣，避免不平衡留白。重要主標採平衡斷行，地名詞組優先保持完整。

概念：**把實際旅行日期變成手帳頁籤，把車票、風景小品與旅行物件貼在它們有用的章節。** 主要互動仍是點日期翻行程、查找指南與對話，沒有新增假內容或外部素材。

## AI 可用性修正

原本 AI 分頁同時承擔完整旅程頁首、多層卡片襯距及堆疊工具列，手機上對話區因而被擠壓。現在 AI 採專用對話工作區：

- 精簡旅程頁首，保留行程切換、鎖定與日夜操作。
- 導遊／口譯、搜尋與清除整合為橫向工具列；最窄手機省略重複的模式標題，但保留清楚的模式按鈕與導覽文字。
- 移除聊天外框的重複襯距，用可伸縮、可捲動的訊息區承擔主要高度；相機、語音、輸入和傳送列保持可操作，輸入字級為 16px。
- 使用 `visualViewport` 追蹤實際可視高度。只有在聊天輸入欄位有焦點且高度明顯縮小時，才判定鍵盤開啟，暫時收起底部導覽、匯率列與快捷提問；鍵盤關閉後恢復。單純縮放而未輸入不會觸發隱藏導覽。
- 補上對話搜尋的名稱、展開狀態與控制區域關聯。

實測高度（CSS 像素）：

| 畫面尺寸 | 對話區高度 | 輸入區底緣 |
| --- | ---: | ---: |
| 320 × 568 | 217 | 484 |
| 390 × 844 | 493 | 760 |
| 768 × 1024 | 673 | 940 |
| 1440 × 900 | 617 | 884 |
| 390px 手機，模擬鍵盤後可視高度 500px | 299 | 494 |

以上尺寸均無頁面水平溢出。鍵盤驗證是可視範圍縮小模擬，並非聲稱已在實體 iPhone／Android 鍵盤上測試。

## 設計複核

ROUND 1

Seen in one second: 日期成為旅行路線，貼紙重新連接到準備與回顧內容；AI 已有完整對話畫布。

Idea (one sentence): 真實日期與旅行物件形成可翻閱的手帳。

Live thing: 車輛隨日期翻頁；AI 長對話可捲動、輸入列固定留在可用區域。

Layout words by section: header=手帳書名 / dates=路線索引 / summary=下一站便條 / cover=風景剪貼 / flights=機票 / chat=對話工作區。

Scores: design 7.5 · usability 8.0 · creativity 7.5 · content 8.0 → overall 7.7。

Caps applied: 沿用使用者明確要求的三體字、暖紙色、玻璃導覽與手繪物件例外。

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. `notebook-inspect/desktop-fold.jpg`：封面與摘要底部有 73px 落差。縮短封面並讓同列內容等高。
2. `notebook-inspect/mobile-fold.jpg`：地名在字中斷行。使用平衡分行與 keep-all，在過長詞組時才允許必要折行。
3. `notebook-screens/ai-390.png`：模式按鈕的選取狀態偏弱。加上中性色填色與內縮輪廓，標籤提高至 14px。

ROUND 2

Seen in one second: 手帳頁籤、出發便條與風景剪貼有清楚順序，AI 不再被卡片容器擠壓。

Idea (one sentence): 真實日期與旅行物件形成可翻閱的手帳。

Live thing: 日期切換與完整 AI 對話操作。

Layout words by section: header=手帳書名 / dates=路線索引 / summary=下一站便條 / cover=風景剪貼 / flights=機票 / chat=對話工作區。

Scores: design 7.8 · usability 8.3 · creativity 7.6 · content 8.0 → overall 7.9。

Caps applied: 同上；採 app-screen 規則，不套用行銷頁照片數量與滾動場景。

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. `notebook-inspect/desktop-fold.jpg`：工具仍把內容外側導覽算成畫布偏移。主內容左右外緣相等，保留現有置中寬度。
2. `notebook-screens/ai-320.png`：最窄手機的旅程名稱需要截斷。保留完整無障礙名稱，可在行程分頁閱讀完整主標，優先留空間給對話。
3. `notebook-screens/ai-keyboard-390.png`：原生鍵盤的瀏覽器行為仍可能因裝置不同而略異。已以 visualViewport 處理並做可視高度模擬，實體裝置檢查仍是交付限制。

## 驗證

- 12 項相關瀏覽器案例最終皆通過：原先一項測試錯把已結束旅程也視為有行前清單，依實際資訊順序修正後，重跑 3 項新案例通過；其餘 9 項及兩項 AI 案例在前一批亦已通過。
- 三旅程交通標記、320／390／768／1440px 版面、日期操作、字級、準備貼紙與回顧貼紙均覆蓋。
- AI 以本機攔截的模擬回覆驗證長文字、訊息捲動、搜尋、模式切換與鍵盤縮小視窗；沒有呼叫真實 AI 服務或寫入正式記帳資料。
- 88 項單元測試、ESLint、來源秘密掃描通過；正式建置及 PWA 產物檢查另於本輪執行。
- 設計 inspector 為 0 FAIL／1 WARN；沿用 `glass,font-count,icon-chips,palette-cream` 的使用者設計例外，唯一保留提醒為上述外側導覽的畫布量測差異。
- 四個本輪核心檔案的 skill 靜態掃描為 0 FAIL／5 WARN；兩項為貼紙白色裁切邊的 drop-shadow，另外三項是明確設定 box-shadow:none 的移除宣告。實際畫面沒有新增卡片投影。
- 已開啟檢視三尺寸首屏與逐段圖、各分頁畫面、小手機 AI、正常手機 AI 與鍵盤縮小預覽。新增 SVG 為專案內原創繪圖，沒有示範資料或外部圖片。

預覽：`.taste-skill/notebook-inspect/`、`.taste-skill/notebook-screens/`。本輪原始碼保留在工作目錄，網站成品已發布至 GitHub Pages。

## 部署完成 — 2026-10-23

- 網址：https://fcwi.github.io/trip_agent/
- 重新執行來源秘密掃描、正式建置與 build:verify，通過後發布至既有 `gh-pages` 分支。
- 發布版本：`3184c662c28fc02d79b1a849fd2310cee7a63e77`。
- 公開 HTML 入口 `/trip_agent/assets/index-uHC0HWtk.js` 與本次本機建置相同。
- 入口程式、manifest 與 service worker 均回應 HTTP 200；正式 service worker 的 SHA-256 與本機產物一致。
- 本次發布的是網站成品，未另外提交來源分支。

## 聊天氣泡更新與部署 — 2026-10-23

- AI 訊息採左側暖紙色氣泡，使用者訊息採右側淡鼠尾草綠氣泡；夜間模式使用深可可與深綠底色。
- 保留 16px 訊息字級、長訊息展開、圖片預覽與朗讀操作，等待回覆狀態亦採一致氣泡。
- 四種螢幕寬度的日夜模式檢查通過，無橫向溢出；兩項 AI 瀏覽器案例及正式建置檢查通過。
- 已部署至 https://fcwi.github.io/trip_agent/ ，發布版本 `e498aeeb163ac96d9ba98482ab5d3a5d94ace4eb`。
- 公開入口 `/trip_agent/assets/index-BUTDS0da.js` 與本機建置相同，入口程式、manifest 與 service worker 均回應 HTTP 200，service worker 校驗一致。
