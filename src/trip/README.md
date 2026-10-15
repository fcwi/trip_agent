# 旅程資料撰寫指南

此資料夾只放各旅程的資料與版面設定。共用程式邏輯留在 `src/components`、`src/hooks` 與 `src/utils`，不要複製進旅程檔案。

## 建立新旅程

1. 選一份最接近的旅程檔案複製，例如 `tripdata_2027_tohoku.jsx`。
2. 命名為 `tripdata_<tripId>.jsx`；`tripId` 只能使用英文字母、數字、底線與連字號。
3. 在 `src/config/tripCatalog.js` 登錄相同 ID、日期、時區與插畫 ID。
4. 更新所有旅程內容與 `tripConfig`。
5. 在 `src/components/Itinerary/artwork/` 新增對應 SVG 圖稿，並於 `TripArtwork.jsx` 登錄。
6. 執行文末的驗證指令。`VITE_TRIP_ID` 保留為舊版資料及 GAS Property 的相容設定，不再用來決定畫面行程。

網站內可由頁首的「切換行程」按鈕切換；網址 `?trip=<tripId>` 可直接指定。沒有指定時，優先選旅程中的行程，其次選最近的未出發行程；若皆已結束則選最近結束的旅程。日期以目的地時區判斷，結束當天仍算旅程中。

切換會載入新的旅程脈絡並保持登入，記帳、聊天、清單與資料庫使用各自的旅程 ID；不要在 UI 加入可任意指定 GAS Property 的欄位。原先自訂的 GAS Property 僅套用於 `VITE_TRIP_ID` 對應的舊部署行程，其他旅程由後端依 tripId 取得資源。

不要把 API Key、GAS Token、Spreadsheet ID 或 Drive Folder ID 寫進旅程檔案。GAS 只需要前端傳來的 `tripId`，並會在第一次請求時自動建立對應的雲端資源。

## 必要匯出

每份旅程檔必須匯出以下六個名稱：

```jsx
export const guidesData = [];
export const usefulLinks = [];
export const shopGuideData = [];
export const itineraryData = [];
export const tripConfig = {};
export const checklistData = [];
```

缺少任何一項時，建置會列出錯誤。

## 建議撰寫順序

### 1. `tripConfig`

先完成旅程的基本設定，再填其他資料：

```jsx
export const tripConfig = {
  title: "2027 日本東北五日",
  startDate: "2027-01-22T00:00:00",
  endDate: "2027-01-26T23:59:59",
  timeZone: "Asia/Tokyo",
  currency: {
    code: "jpy",
    source: "JPY",
    target: "TWD",
  },
  language: {
    code: "ja-JP",
    label: "日",
    name: "日文",
  },
  meta: {
    title: "2027 日本東北五日",
    description: "日本東北五日旅遊行程助手",
    shortName: "2027日本東北",
  },
  locations: [
    { key: "sendai", name: "仙台", lat: 38.2682, lon: 140.8694 },
  ],
  theme: {
    // 建議從現有旅程完整複製，再調整顏色。
    componentStyles: {},
  },
};
```

特別注意：`language` 是 AI 口譯與語音輸入的目的語言。日本行程應使用 `ja-JP／日文`，韓國行程應使用 `ko-KR／韓文`；不要填成使用者介面的繁體中文，否則模型會把中文做音譯而非翻譯。

### 2. `itineraryData`

每天需有唯一的 `day`，且 `locationKey` 必須存在於 `tripConfig.locations`：

```jsx
export const itineraryData = [
  {
    day: "Day 1",
    date: "1/22 (五)",
    locationKey: "sendai",
    events: [
      {
        time: "09:00",
        title: "抵達仙台",
        desc: "集合、領取行李後前往市區",
      },
    ],
  },
];
```

尚未確認的航班、飯店或時間請明確標示「待確認」，不要用推測值冒充已確認資訊。

### 3. 指南、連結與商店

- `guidesData`：簽證、交通票券、入場方式及緊急流程。
- `usefulLinks`：官方交通、天氣、景點與緊急聯絡連結。
- `shopGuideData`：依城市或區域整理商店、樓層、營業時間與購物提醒。
- `checklistData`：行前準備清單；避免放入個人證件號碼等敏感資料。

涉及營業時間、票價、航班或預約狀態的資訊可能變動，請記錄資料來源與查核日期。

## 主題與圖示

旅程資料可以直接使用 JSX 與 `lucide-react` 圖示。`theme.componentStyles` 的必要樣式都必須同時提供 `light` 與 `dark`；最安全的作法是完整複製現有旅程的主題，再只調整色彩。

## 驗證

建置會包含目錄內的旅程；保留原本的 `VITE_TRIP_ID`，不要為了預覽其他旅程而改動正式環境設定：

```powershell
npm run check
npm run build
npm run build:verify
```

如需跑手機版瀏覽器回歸：

```powershell
$env:E2E_TRIP_ID = "2027_tohoku"
npm run test:e2e
```

預覽其他旅程時使用網址 `?trip=2026_karuizawa` 或 `?trip=2026_busan`。新增旅程後至少確認：目錄與資料的 ID／日期／時區一致、幣別、AI 口譯目的語言、每日地點對應、深淺色版面、GAS 請求所帶的 `tripId`，以及往返切換後個別資料仍保留。
