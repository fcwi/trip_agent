# 旅程插畫

每個旅程使用獨立、原創的 SVG 元件，與頁首、行程資料及業務操作分開：

- `TohokuSnow.jsx`：東北雪國、樹冰纜車、積雪溫泉小屋與遊覽車。
- `KaruizawaSnow.jsx`：輕井澤雪山、針葉林、山間小屋、列車與雪人。
- `BusanCoast.jsx`：釜山海灣、跨海橋梁、彩色街屋、海岸列車與帆船。
- `ScenePrimitives.jsx`：共享的畫框、雪樹、雪花與遊覽車筆觸。
- `TripArtwork.jsx`：以旅程目錄中的 `artwork.id` 選擇圖稿。

在 `src/config/tripCatalog.js` 設定旅程的 `artwork.id` 與 `season`。封面、每日圖章、行程目錄及選擇視窗會使用同一份設定，不從城市名稱推斷季節。冬季景色採積雪色票；釜山夏季採海岸色票。明暗配色使用共用 CSS 變數，不依賴 SVG 外部圖片或下載服務。

新增行程圖稿時，請建立獨立元件，再於 `TripArtwork.jsx` 的對應表登錄。保持裝飾 SVG 的 `aria-hidden` 與可縮放 viewBox，不加入焦點、點擊行為或可辨識的私人資料。
