# 地圖道路路線修正（2026-10-11）

## 原因與修正

原本 `DayMap` 將當日所有有效座標合併為一次 OSRM driving 請求。東北 Day 1 包含桃園出發與日本落地，實際服務回傳 HTTP 400／`NoRoute`；日本的道路段也因此一併無法顯示。

- 飛機事件的座標代表出發機場：保留到機場的道路段，飛機事件後另起道路段。
- 每段移除連續重複座標；不足兩個不同座標的段落不發請求。
- 分段請求獨立保留成功結果；部分失敗時，顯示可用道路段與全部地點標記。
- 使用 GeoJSON `MultiLineString` 顯示分離的道路段，不在飛行段之間補上錯誤連線。
- 支援事件的 `roadRouteBreakBefore`／`roadRouteBreakAfter`，可明確指定其他不連續道路段。未聲明的交通方式仍以原有道路參考線顯示，並非實際鐵道／纜車導航。

本次未更換金鑰或變更正式服務設定。來源備份：忽略的 `backups.local/before-map-route-fix-daa5f1c.zip`。

## 驗證

- lint、來源安全檢查及 68 項單元測試通過。
- 8 項瀏覽器地圖測試通過，包含地點編號、操作、重試、服務拒絕、離線恢復、窄螢幕與飛行分段／部分失敗。
- 經使用者明確授權，直接核對公開景點的 OSRM 請求：原始跨海請求回傳 400／`NoRoute`；仙台空港到天童道路段回傳 200／`Ok`，取得 1,755 個路線座標點。
- 402×874 瀏覽器使用隔離底圖與實際 OSRM 路線，確認僅請求日本道路段，顯示一個 `MultiLineString` 道路段與全部 5 個地點標記；沒有跨海請求。忽略的證據：`test-run.local/road-only-live.png`。
- 正式建置與建置產物檢查通過。

## 尚待定位的黃色警告

`Expected value to be of type number, but found null instead` 尚未在隔離底圖中重現。應取得使用者實際 MapTiler `style.json` 的圖層內容（移除金鑰），確認數值表達式與資料缺值的來源後再修正。本輪沒有隱藏警告或任意改寫所有外部圖層的數值。

MapLibre 的表達式評估在 runtime 錯誤時可警告並回傳該屬性的預設值；這不等同確認每個圖層都正確顯示。參考：[MapLibre 表達式實作](https://github.com/maplibre/maplibre-style-spec/blob/main/src/expression/index.ts)、[官方表達式規格](https://maplibre.org/maplibre-style-spec/expressions/)。
