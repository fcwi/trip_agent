// 檔案說明：
// 應用啟動程式（entry point）
// - 主要職責：載入全域 CSS 並在 DOM#root 上 Mount `App` 元件
// - 不包含業務邏輯，僅作為 React 應用入口
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Loader } from "lucide-react";
import "./index.css";
import App from "./App.jsx";
import AppErrorBoundary from "./components/AppErrorBoundary.jsx";
import PwaUpdatePrompt from "./components/PwaUpdatePrompt.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppErrorBoundary>
      <Suspense
        fallback={
          <div
            role="status"
            aria-live="polite"
            className="flex h-screen w-screen items-center justify-center bg-[#FDFBF7]"
          >
            <Loader
              aria-hidden="true"
              className="h-10 w-10 animate-spin text-stone-400"
            />
            <span className="sr-only">載入網站中…</span>
          </div>
        }
      >
        <App />
      </Suspense>
      <PwaUpdatePrompt />
    </AppErrorBoundary>
  </StrictMode>,
);

// Service Worker 由 VitePWA 自動注入 registerSW.js 處理，無需手動註冊
