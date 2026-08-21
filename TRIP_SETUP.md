# 新增或切換旅程

## 切換現有旅程

如果專案已經有 `.env`，請保留原檔與其中的 API／加密設定，只新增或修改以下旅程設定：

```env
VITE_TRIP_ID=2026_karuizawa
VITE_BASE_PATH=/trip_agent/
VITE_PUBLIC_SITE_URL=https://example.com/trip_agent/
```

不要用 `.env.example` 覆蓋現有 `.env`。只有全新安裝、尚無 `.env` 時，才複製 `.env.example`，再填入自己的服務設定。

修改後重新執行 `npm run dev` 或 `npm run build`。

系統會依 ID 載入 `src/tripdata_<旅程 ID>.jsx`，並同步更新畫面內容、主題、PWA 名稱、Meta、時區、幣別與本機資料命名空間。

## 建立新旅程

1. 複製最接近的現有旅程資料檔，例如 `src/tripdata_2026_busan.jsx`。
2. 重新命名為 `src/tripdata_<新旅程 ID>.jsx`。
3. 修改檔案內的 `tripConfig`、行程、指南、連結、購物指南與檢查清單。
4. 在 `.env` 設定相同的 `VITE_TRIP_ID`。

啟動時會驗證必要資料、地點座標、行程地點對應及主題樣式；格式有誤時會直接列出缺少的欄位。

## 可選部署設定

- `VITE_BASE_PATH`：網站部署路徑，根目錄使用 `/`。
- `VITE_PUBLIC_SITE_URL`：Open Graph 使用的公開完整網址。

## API 與加密設定

以下設定與旅程內容分開管理，切換旅程時通常不需要更改：

- `VITE_ENCODED_KEY`
- `VITE_ENCODED_MAPS_KEY`
- `VITE_ENCODED_MAPTILER_KEY`
- `VITE_ENCODED_GAS_URL`
- `VITE_ENCODED_GAS_TOKEN`

`.env` 已被 Git 忽略，應保存實際值；`.env.example` 只提供空白欄位名稱，不應放入真實密鑰。

解鎖密碼只保留在目前分頁的 `sessionStorage`；關閉分頁或按下鎖定後需重新輸入。舊版本曾保存於 `localStorage` 的密碼會在首次載入時自動移除。

請注意，所有 `VITE_*` 變數都會進入瀏覽器端建置內容。現有加密可避免直接顯示憑證，但不能取代伺服器端秘密管理；正式公開部署時，應限制 Maps／MapTiler Key 的允許網域與配額，Gemini／GAS 則建議改由受驗證的後端代理呼叫。

不同 `tripConfig.id`／`VITE_TRIP_ID` 的清單、天氣、聊天、記帳與圖片資料會分開儲存，不會互相覆蓋。
