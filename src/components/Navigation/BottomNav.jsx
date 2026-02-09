import React from "react";
import { Home, DollarSign, MessageSquare, Store, BookOpen } from "lucide-react";

/**
 * BottomNav 組件
 * 提取自 App.jsx，負責底部導覽切換。
 *
 * Props:
 * - activeTab: 當前啟動的分頁 (string)
 * - onTabChange: 切換分頁的回呼函式 (映射自原始 handleTabChange)
 * - handleInterruptClick: 點擊中斷邏輯函式
 * - isDarkMode: 是否為深色模式 (boolean)
 * - theme: 包含顏色配置的物件 (映射自原始 currentTheme)
 */
const BottomNav = ({
  activeTab,
  onTabChange,
  handleInterruptClick,
  isDarkMode,
  theme,
}) => {
  // 為了保持 JSX 內容 100% 不變，將 Props 映射回原始代碼中的變數名
  const handleTabChange = onTabChange;
  const cBase = theme.colorBase;
  const cAccent = theme.colorAccent;

  return (
    <div className="fixed bottom-3 left-1/2 transform -translate-x-1/2 z-50 w-auto pb-[env(safe-area-inset-bottom)]">
      <div
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-2xl border transition-all duration-300 shadow-2xl
        ${
          isDarkMode
            ? `bg-${cBase}-900/80 border-white/10 ring-1 ring-white/5 shadow-black/40`
            : "bg-white/80 border-white/40 ring-1 ring-black/5 shadow-black/10"
        }`}
      >
        {/* 1. 行程 (Itinerary) */}
        <button
          onClick={() => {
            handleInterruptClick();
            handleTabChange("itinerary");
          }}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group
            ${
              activeTab === "itinerary"
                ? isDarkMode
                  ? `bg-${cBase}-800 text-${cAccent}-400 shadow-lg shadow-${cAccent}-500/10`
                  : `bg-white text-${cBase}-800 shadow-lg shadow-black/5`
                : isDarkMode
                  ? `text-${cBase}-400 hover:text-${cBase}-200 hover:bg-white/5`
                  : `text-${cBase}-400 hover:text-${cBase}-700 hover:bg-black/5`
            }`}
        >
          <Home
            className={`w-4.5 h-4.5 transition-all ${activeTab === "itinerary" ? "stroke-[2.5px]" : "stroke-2"}`}
          />
          {activeTab === "itinerary" && (
            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-current"></span>
          )}
        </button>

        {/* 2. 記帳記事 (Finance) */}
        <button
          onClick={() => {
            handleInterruptClick();
            handleTabChange("finance");
          }}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group
            ${
              activeTab === "finance"
                ? isDarkMode
                  ? `bg-${cBase}-800 text-${cAccent}-400 shadow-lg shadow-${cAccent}-500/10`
                  : `bg-white text-${cBase}-800 shadow-lg shadow-black/5`
                : isDarkMode
                  ? `text-${cBase}-400 hover:text-${cBase}-200 hover:bg-white/5`
                  : `text-${cBase}-400 hover:text-${cBase}-700 hover:bg-black/5`
            }`}
        >
          <DollarSign
            className={`w-4.5 h-4.5 transition-all ${activeTab === "finance" ? "stroke-[2.5px]" : "stroke-2"}`}
          />
          {activeTab === "finance" && (
            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-current"></span>
          )}
        </button>

        {/* 3. AI 核心按鈕 */}
        <button
          onClick={() => {
            handleInterruptClick();
            handleTabChange("ai");
          }}
          className={`mx-1 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-md active:scale-95 border
            ${
              activeTab === "ai"
                ? "scale-110 -translate-y-2 ring-4 ring-opacity-20"
                : "hover:scale-105 -translate-y-1"
            }
            ${(() => {
              const styles = {
                amber: isDarkMode
                  ? "bg-gradient-to-tr from-amber-600 to-amber-500 ring-amber-500/40 border-amber-400/20 shadow-amber-500/30"
                  : "bg-gradient-to-tr from-amber-400 to-amber-500 ring-amber-400/40 border-amber-300/40 shadow-amber-500/40",
                sky: isDarkMode
                  ? "bg-gradient-to-tr from-sky-600 to-sky-500 ring-sky-500/40 border-sky-400/20 shadow-sky-500/30"
                  : "bg-gradient-to-tr from-sky-400 to-sky-500 ring-sky-400/40 border-sky-300/40 shadow-sky-500/40",
                default: isDarkMode
                  ? "bg-gradient-to-tr from-stone-600 to-stone-500 ring-stone-500/40 border-stone-400/20"
                  : "bg-gradient-to-tr from-stone-400 to-stone-500 ring-stone-400/40 border-stone-300/40",
              };
              return styles[cAccent] || styles.default;
            })()}
          `}
        >
          <MessageSquare className="w-5 h-5 text-white drop-shadow-md" />
        </button>

        {/* 4. 商家 (Shops) */}
        <button
          onClick={() => {
            handleInterruptClick();
            handleTabChange("shops");
          }}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group
            ${
              activeTab === "shops"
                ? isDarkMode
                  ? `bg-${cBase}-800 text-${cAccent}-400 shadow-lg shadow-${cAccent}-500/10`
                  : `bg-white text-${cBase}-800 shadow-lg shadow-black/5`
                : isDarkMode
                  ? `text-${cBase}-400 hover:text-${cBase}-200 hover:bg-white/5`
                  : `text-${cBase}-400 hover:text-${cBase}-700 hover:bg-black/5`
            }`}
        >
          <Store
            className={`w-4.5 h-4.5 transition-all ${activeTab === "shops" ? "stroke-[2.5px]" : "stroke-2"}`}
          />
          {activeTab === "shops" && (
            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-current"></span>
          )}
        </button>

        {/* 5. 指南與連結 (Guides) */}
        <button
          onClick={() => {
            handleInterruptClick();
            handleTabChange("guides");
          }}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group
            ${
              activeTab === "guides"
                ? isDarkMode
                  ? `bg-${cBase}-800 text-${cAccent}-400 shadow-lg shadow-${cAccent}-500/10`
                  : `bg-white text-${cBase}-800 shadow-lg shadow-black/5`
                : isDarkMode
                  ? `text-${cBase}-400 hover:text-${cBase}-200 hover:bg-white/5`
                  : `text-${cBase}-400 hover:text-${cBase}-700 hover:bg-black/5`
            }`}
        >
          <BookOpen
            className={`w-4.5 h-4.5 transition-all ${activeTab === "guides" ? "stroke-[2.5px]" : "stroke-2"}`}
          />
          {activeTab === "guides" && (
            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-current"></span>
          )}
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
