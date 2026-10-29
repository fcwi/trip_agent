# 密碼登入與後端密鑰部署

網站仍須輸入密碼才能進入。密碼由後端 scrypt 雜湊驗證，瀏覽器不再解密 Gemini / GAS / Places 密鑰，也不儲存密碼。HttpOnly、SameSite=Strict Cookie 維持登入；HTTPS 時加上 Secure。一般登入有效 8 小時，勾選保持登入有效 7 天，登出會撤銷伺服器 session。後端重新啟動會清除所有 session。

## 本機

需要 Node.js 22 以上。

1. 將 `server/.env.example` 複製為專案根目錄 `.env.server`（已忽略）。將 API 原始密鑰填在此檔，不要加 VITE_ 前綴。不要把此檔提交 Git 或放在 public/dist。
2. 產生密碼雜湊：在 bash 執行 `read -rs -p 'Password: ' trip_password; printf '%s' "$trip_password" | node server/hash-password.mjs; unset trip_password`，將輸出填入 APP_PASSWORD_HASH。使用至少 12 字元的獨立密碼。密碼不會出現在指令參數或歷史中。
3. `APP_ORIGIN=http://localhost:5173`，執行 `npm run server`，另一個終端執行 `npm run dev`，從 localhost:5173 進入網站。Vite 會代理 /api 至本機 3001。
4. 移除前端 .env 與 CI 中所有 VITE_ENCODED_* 設定。重新建置並取代舊版檔案與快取。

## 正式環境

GitHub Pages 只能提供靜態檔案，不能單獨執行本後端。需要支援 Node.js 的主機或容器，以及 HTTPS 反向代理：同一網域的 /api/* 轉發至後端，其餘路徑提供 dist。可保留 /trip_agent/ 靜態子路徑，但 API 必須由同一 origin 的 /api 提供。現有 GitHub Pages deploy 指令並不會部署後端。

在平台的 Secret Manager / Secret 設定 APP_PASSWORD_HASH、GEMINI_API_KEY、GOOGLE_MAPS_API_KEY、GAS_URL、GAS_TOKEN，環境變數設定 APP_ORIGIN 為實際 HTTPS 網域，例如 https://travel.example.com。用 `node server/app.mjs` 啟動；容器若需外部連線設定 HOST=0.0.0.0。不可對外提供 .env.server 或專案原始目錄。

後端只接受固定 Gemini 模型、固定 Google Places endpoint 和設定中的 GAS 網址，不允許前端指定代理目標或 GAS token。GAS 原有程式仍須驗證 token。錯誤回應不轉傳上游原始訊息。

目前的請求限制與 session 存於單一 process 記憶體，適合單 instance 的私人旅行網站；限制為每 IP 每分鐘 120 次、登入每 IP 5 次、登入全域 30 次、全域請求 1000 次、每 session 60 次（Gemini 10 次）。若部署多 instance，需要共用 session / 限流儲存。反向代理下以 socket IP 計算，可能全體共用額度；不要直接信任任意 X-Forwarded-For。亦需在 Google 平台設定 API 配額與費用告警，應用程式限流不是帳單硬上限。

MapTiler 為地圖瀏覽器 SDK 所需的公開 key，使用 MAPTILER_PUBLIC_KEY，必須在供應商設定允許的網站網域與用量限制。它會傳至前端。Gemini、GAS、Google Places 的私密密鑰不會傳至前端。

密碼限制應用程式功能與 API 存取；靜態 dist 中的行程資料仍可直接下載。若行程本身也需要保密，須將靜態網站放在具身分驗證的閘道之後，或將資料移至受保護 API。

上線前輪替曾在瀏覽器使用的 Gemini / Places key 與 GAS token，清除過去的公開部署；Git 歷史若曾有原始密鑰，刪檔不足以撤銷它。部署平台機密權限與原始碼編輯權限仍需限制。

## 容器部署（前後端同一網域）

專案根目錄已附 Dockerfile。建置階段只複製前端必要原始檔，不複製 .env，執行階段只包含 dist 與後端程式，並以非 root 使用者啟動。正式入口為 `server/production.mjs`，由同一服務提供前端與 /api。容器內部預設 3000 port，支援平台注入 PORT；健康檢查為 /healthz。

選擇平台後以 Dockerfile 部署，於平台機密介面設定上述變數；APP_ORIGIN 設為平台分配的 HTTPS 網址（不含路徑），重啟後測試密碼登入、Gemini、GAS 讀寫及登出。不要把正式密鑰提供給 Docker build args。此映像將 VITE_BASE_PATH 設為 /，前端正式網址為網域根目錄。

若不使用容器，先設定 VITE_BASE_PATH=/ 執行 npm ci 與 npm run build，再注入後端環境變數執行 npm start。不要以靜態站服務類型部署。現有 GitHub Pages 網址不會自動切換到新主機；須在新站驗證成功後另外處理舊站遷移。

## 建議平台：Render

已提供 render.yaml Blueprint，使用 Docker Web Service 免費方案與 /healthz 檢查，關閉自動部署以避免未驗證變更直接上線。方案可用性與限制以 Render 建立畫面為準。免費 instance 可能休眠；重啟會清除記憶體 session，需要重新登入。

1. 將本次修改推送到 GitHub 分支。
2. 登入 https://dashboard.render.com ，選 New > Blueprint，連接 fcwi/trip_agent 並選擇含本次修改的分支。
3. 建立畫面確認為 Free，填入所需機密。APP_ORIGIN 填服務實際 HTTPS 網址；若建立前尚未確定，先填暫時 HTTPS 網址，取得 Render 分配網址後更新並重新部署，再進行登入測試。Maps / MapTiler 不使用時留空。
4. 完成部署後打開 /healthz 確認 ok，打開 / 確認顯示密碼畫面；未登入呼叫 /api/session 應為 401。
5. 測試正確／錯誤密碼、保持登入、登出後重新整理，以及 Gemini / GAS 功能，通過後再遷移舊站。

不要把 key 或密碼貼在聊天中。只在 Render 的機密輸入框與本機雜湊工具中處理。Render 控制台的 APP_PASSWORD_HASH 填雜湊，不是原始登入密碼。
