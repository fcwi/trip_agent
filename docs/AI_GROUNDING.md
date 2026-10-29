# AI 導遊的即時查證

模型為 gemini-3.5-flash-lite。導遊請求提供 Google Search 與 Google Maps 兩項內建工具，模型依問題與前文自行決定是否呼叫；不再以固定關鍵字阻擋查證。單純問候、改寫與既有行程整理不必使用工具。口譯與收據辨識不加入查證工具。

營業時間、價格、班次、活動與交通異動等資訊要求優先查證官方近期公告；地點、附近商家、地址、評價等使用 Maps，必要時搭配 Search。只有已授權定位且座標有限、範圍有效、非載入中時才傳送 latLng；否則依問題與行程目的地，不捏造座標。Maps 查詢使用英文，最終以繁體中文回答。

來源來自 API groundingMetadata，顯示網站／Google Maps／評論的標題與原始 HTTPS 連結，去除重複與非 HTTPS 網址。Google Search 建議內容以禁止 script、獨立 origin 的 sandbox iframe 呈現，避免在應用程式內執行外部 HTML。回覆時間只表示生成時間，不能當作來源更新時間。無來源時明確提示未附查證來源，不能宣稱最新或已查證。

查證請求遭上游 400/403 拒絕時顯示工具無法使用，不移除工具重試成無來源答案。Render 沿用 GEMINI_API_KEY，不須把 Google Maps 的瀏覽器 key 給模型；這是 Gemini 內建 grounding，與網站地圖及 Places 補強分開。

Google Search 與 Google Maps grounding 需要 Gemini 付費方案，費用與配額依 Google 帳戶及最新官方公告；提供工具不代表每次均實際呼叫，也不能保證資訊永遠即時或正確。請設定供應商端用量限制。本次本機測試不使用正式密鑰、不驗證帳戶實際工具權限。

參考：
- https://ai.google.dev/gemini-api/docs/generate-content/maps-grounding
- https://ai.google.dev/gemini-api/docs/generate-content/google-search
- https://ai.google.dev/gemini-api/docs/pricing#gemini-3.5-flash-lite

驗證：94 項單元測試、後端代理測試與建置產物檢查通過。本機 Chromium 使用模擬工具回應確認 320px 淺色、390px 深色的來源連結、Maps 標示、搜尋建議 sandbox、非法連結阻擋與無水平溢出；未發出正式付費工具呼叫。
