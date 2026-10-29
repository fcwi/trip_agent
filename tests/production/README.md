# 正式產物旅行手帳驗證

`npm run test:production` 依序建置釜山、輕井澤、東北三套資料，以測試密碼及本機 API 執行，不使用正式憑證、不寫入真實雲端資料。單一旅程可用 `npm run test:production -- 2027_tohoku`。修改原始碼後請重新建置；`--reuse` 僅供已建置相同版本的診斷。

需 Playwright Chromium；Windows 已安裝 Chrome 時可設定 `$env:PRODUCTION_TEST_BROWSER='chrome'`。使用系統 Chromium 的 Linux 環境可設定 `PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium`。

每套旅程檢查 320px 淺色、390px 深色：

- 安裝 Service Worker 並清除 HTTP 快取，斷網重新啟動後必須停在密碼頁；不可用本機登入旗標繞過伺服器驗證。恢復網路並登入後，再確認已開啟的六個分頁、地圖替代連結、字體快取可離線使用。
- 恢復網路後重試地圖引擎，以受控背景圖層確認恢復；再次斷網確認 AI 失敗提示與本機記帳。立即重新整理後應停在密碼頁，重新連線登入後紀錄仍須完整。
- 離線切換旅程會建立新文件，因此同樣需連線驗證；確認恢復連線後可進入目的旅程，且記帳資料彼此隔離。這不是「所有行程可離線冷啟動」的驗證。
- 阻擋 Service Worker，使用冷快取、200ms 延遲及 256,000 bytes/s 下載速率；字體另延遲 6 秒，確認替代字體期間可操作，六個分頁可顯示且無橫向溢出或未處理的頁面錯誤。

結果及截圖存於忽略的 `test-run.local/production-audit`，不覆蓋部署用 dist。三套旅程全部完成時為 12 組通過情境。外部服務採受控失敗或模擬回應，因此不宣稱已驗證真實 Google / GAS / MapTiler 帳戶權限與服務可用性。
