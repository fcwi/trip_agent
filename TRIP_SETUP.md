# 新增或切換旅程

## 切換現有旅程

畫面可從旅程選擇器或 `?trip=2026_karuizawa` 切換。未指定旅程時，依 `src/config/tripCatalog.js` 的日期選擇進行中、最近未來或最近結束的旅程。

本機 `.env` 只放公開建置設定，不放服務私密金鑰。Render 使用根目錄：

```env
VITE_TRIP_ID=2026_karuizawa
VITE_BASE_PATH=/
VITE_PUBLIC_SITE_URL=https://example.com/
```

不要用 `.env.example` 覆蓋現有 `.env`。只有全新安裝、尚無 `.env` 時才複製範例。`VITE_TRIP_ID` 用於舊版資料遷移、GAS Property 相容及建置 Meta 預設，不會限制目前畫面只能顯示單一旅程。

修改後重新執行 `npm run dev` 或 `npm run build`。

系統會依 ID 載入 `src/trip/tripdata_<旅程 ID>.jsx`，並同步更新畫面內容、主題、PWA 名稱、Meta、時區、幣別與本機資料命名空間。完整撰寫範例與檢查清單請參考 [`src/trip/README.md`](src/trip/README.md)。

## 建立新旅程

1. 複製最接近的現有旅程資料檔，例如 `src/trip/tripdata_2026_busan.jsx`。
2. 重新命名為 `src/trip/tripdata_<新旅程 ID>.jsx`。
3. 修改檔案內的 `tripConfig`、行程、指南、連結、購物指南與檢查清單。
4. 在 `src/config/tripCatalog.js` 加入相同 ID、日期、時區及插畫摘要，讓選擇器與預設旅程規則可找到它。

啟動時會驗證必要資料、地點座標、行程地點對應及主題樣式；格式有誤時會直接列出缺少的欄位。

目前會檢查：

- `tripConfig`、行程、指南、連結、商店與清單等必要匯出。
- 標題、時區、開始／結束日期、語言、Meta 與幣別等必要欄位。
- `timeZone` 是否為有效 IANA 時區（例如 `Asia/Tokyo`）。
- 開始與結束日期是否有效，以及開始日期是否早於結束日期。
- 幣別代碼是否為 3 碼格式。
- 地點 `key` 是否重複，經緯度是否落在有效範圍。
- 行程的 `day` 是否重複、`locationKey` 是否存在，以及事件是否有時間與標題。
- 每一項主題元件樣式是否同時提供 `light` 與 `dark`。

可在修改後執行以下指令，一次檢查程式品質與驗證器測試：

```bash
npm run check
```

接著執行 `npm run build`，會用目前 `VITE_TRIP_ID` 的真實旅程資料進行驗證。若有多個問題，錯誤訊息會一次列出，不必逐項重跑才發現下一個問題。

## 可選部署設定

- `VITE_BASE_PATH`：網站部署路徑，根目錄使用 `/`。
- `VITE_PUBLIC_SITE_URL`：Open Graph 使用的公開完整網址。

## 後端登入與 API 設定

Gemini、Google Places、GAS 金鑰及密碼雜湊放在 Render 的機密設定；本機使用 Git 忽略的 `.env.server`，欄位參考 `server/.env.example`。不要設定舊版 `VITE_ENCODED_*`，也不要使用前端加密工具。完整步驟見 [SECURE_BACKEND.md](docs/SECURE_BACKEND.md)。

登入由後端驗證，HttpOnly Cookie 維持 session，瀏覽器不保存登入密碼。一般 session 為 8 小時，保持登入為 7 天；伺服器重啟會清除 session。離線重新整理、重開 PWA 或切換旅程時，需恢復連線才能驗證登入。

所有 `VITE_*` 都是公開建置資料。MapTiler 公開 key 由後端 `MAPTILER_PUBLIC_KEY` 提供，仍需限制實際 Render／自訂網域及配額；其他私密 API 金鑰不傳至瀏覽器。

不同 `tripConfig.id`／`VITE_TRIP_ID` 的清單、天氣、聊天、記帳與圖片資料會分開儲存，不會互相覆蓋。

## GAS 多旅程儲存

前端會把目前旅程的 `tripId` 加進記帳、記事與位置的 GAS 請求。`tripId` 只用來選擇試算表與 Drive 資料夾，**不會寫入 Sheet 欄位**。

預設 Script Property 名稱為 `trip_agent_${tripId}`，例如：

- `trip_agent_2026_busan`
- `trip_agent_2026_karuizawa`

第一次收到帶有新 `tripId` 的已驗證請求時，GAS 會自動：

1. 建立 `Trip Agent - <tripId>` 專屬資料夾。
2. 在資料夾內建立同名試算表及記帳、記事、位置三張工作表。
3. 將試算表與資料夾 ID 寫入上述 Script Property。

因此新增或切換旅程不需要手動新增 Property，也不需要重新部署 GAS。自動建立後的屬性內容為：

```json
{
  "spreadsheetId": "...",
  "folderId": "..."
}
```

預設會在「我的雲端硬碟」尋找或建立名為「旅遊」的共同上層資料夾，再把各旅程資料夾建立於其中。若要改名稱，可設定 Script Property `TRIP_ROOT_FOLDER_NAME`；若要直接指定既有資料夾，則設定其真正的 Google Drive ID 至 `TRIP_ROOT_FOLDER_ID`，此設定會優先於名稱。

已存在的 `trip_agent_<tripId>` 會直接沿用，GAS 不會覆寫或搬動既有試算表與資料夾。若屬性已存在但 JSON 或 ID 不完整，系統會回報設定錯誤，避免意外建立第二套資料。

若釜山要沿用舊資料，`trip_agent_2026_busan.spreadsheetId` 必須指向原本 `SPREADSHEET_ID` 的同一份試算表。沒有 `tripId` 的舊 PWA 仍可回退到 `SPREADSHEET_ID`／`FOLDER_ID`。

只有在 Script Property 名稱不是預設規則時，才需要在 `.env` 設定 `VITE_GAS_TRIP_PROPERTY_KEY`；空白時不要加入該欄位。

記帳與位置的讀取改為 POST，token 放在請求本文，不再出現在網址。本次加入自動建立功能時，必須把本機 `api.gs` **完整貼上**並建立**一次新的 Web App 部署版本**；之後增加任何 `tripId` 都不必再次部署。`api.gs` 目前被 Git 忽略，不要用片段覆蓋整份後端。舊版 GET 讀取仍可運作，但新版 PWA 只走 POST。

## 輪替服務金鑰

Git 歷史曾追蹤過 `.env`，舊密文仍可能留在歷史。輪替後將新值存入 Render 機密與本機 `.env.server`，不要提交。

1. 在 Google AI Studio／Cloud、Maps、MapTiler、Apps Script 分別建立新金鑰／Token，並停用舊的。
2. MapTiler 限制為實際 Render／自訂網域；Places 為後端 key，依 Google Cloud 可用的伺服器限制與配額設定。
3. 更新 Render 機密及本機 `.env.server`，不要放入 `VITE_*` 或聊天訊息。
4. 若也換了 GAS Token，同步更新 Script Property `AUTH_TOKEN`。
5. 執行品質、安全與建置檢查；獲得部署授權後，再於 Render 手動部署並核對 `/healthz`、登入及 API。
