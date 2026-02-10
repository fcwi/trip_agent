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
        className={`flex items-center gap-1 px-3 h-[60px] rounded-full backdrop-blur-2xl border transition-all duration-300 shadow-xl
        ${
          isDarkMode
            ? `bg-${cBase}-900/90 border-white/10 ring-1 ring-white/5 shadow-black/40`
            : "bg-white/90 border-white/40 ring-1 ring-black/5 shadow-black/10"
        }`}
      >
        {/* 1. 行程 (Itinerary) */}
        <button
          onClick={() => {
            handleInterruptClick();
            handleTabChange("itinerary");
          }}
          className="relative flex flex-col items-center justify-center min-w-[50px] transition-all duration-300 group"
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
            ${
              activeTab === "itinerary"
                ? isDarkMode
                  ? `bg-${cBase}-800 text-${cAccent}-400`
                  : `bg-${cBase}-100 text-${cBase}-900`
                : isDarkMode
                  ? `text-${cBase}-400 group-hover:bg-white/5`
                  : `text-${cBase}-400 group-hover:bg-black/5`
            }`}
          >
            <Home
              className={`w-5 h-5 transition-all ${activeTab === "itinerary" ? "stroke-[2.5px]" : "stroke-2"}`}
            />
          </div>
          <span
            className={`text-[10px] font-medium leading-none mt-1 transition-colors duration-300
            ${
              activeTab === "itinerary"
                ? isDarkMode
                  ? `text-${cAccent}-400`
                  : `text-${cBase}-900`
                : `text-${cBase}-500`
            }`}
          >
            行程
          </span>
        </button>

        {/* 2. 記帳記事 (Finance) */}
        <button
          onClick={() => {
            handleInterruptClick();
            handleTabChange("finance");
          }}
          className="relative flex flex-col items-center justify-center min-w-[50px] transition-all duration-300 group"
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
            ${
              activeTab === "finance"
                ? isDarkMode
                  ? `bg-${cBase}-800 text-${cAccent}-400`
                  : `bg-${cBase}-100 text-${cBase}-900`
                : isDarkMode
                  ? `text-${cBase}-400 group-hover:bg-white/5`
                  : `text-${cBase}-400 group-hover:bg-black/5`
            }`}
          >
            <DollarSign
              className={`w-5 h-5 transition-all ${activeTab === "finance" ? "stroke-[2.5px]" : "stroke-2"}`}
            />
          </div>
          <span
            className={`text-[10px] font-medium leading-none mt-1 transition-colors duration-300
            ${
              activeTab === "finance"
                ? isDarkMode
                  ? `text-${cAccent}-400`
                  : `text-${cBase}-900`
                : `text-${cBase}-500`
            }`}
          >
            記錄
          </span>
        </button>

        {/* 3. AI 核心按鈕 (導遊) - 特殊樣式區塊 */}
        <button
          onClick={() => {
            handleInterruptClick();
            handleTabChange("ai");
          }}
          className="relative flex flex-col items-center justify-center min-w-[50px] group"
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border
            ${
              activeTab === "ai"
                ? "ring-2 ring-offset-1 ring-offset-transparent transform scale-105"
                : "opacity-90 group-hover:opacity-100"
            }
            ${(() => {
              const styles = {
                amber: isDarkMode
                  ? "bg-amber-500 border-amber-400/30 text-white shadow-amber-500/20"
                  : "bg-amber-400 border-amber-300/30 text-white shadow-amber-400/30",
                sky: isDarkMode
                  ? "bg-sky-500 border-sky-400/30 text-white shadow-sky-500/20"
                  : "bg-sky-400 border-sky-300/30 text-white shadow-sky-400/30",
                default: isDarkMode
                  ? "bg-stone-600 border-stone-500/30 text-white"
                  : "bg-stone-500 border-stone-400/30 text-white",
              };
              return styles[cAccent] || styles.default;
            })()}
          `}
          >
            <MessageSquare className="w-4 h-4 fill-current drop-shadow-sm" />
          </div>
          <span
            className={`text-[10px] font-bold leading-none mt-1 transition-colors duration-300
            ${
              activeTab === "ai"
                ? isDarkMode
                  ? `text-${cAccent}-400`
                  : `text-${cBase}-900`
                : `text-${cBase}-500`
            }`}
          >
            導遊
          </span>
        </button>

        {/* 4. 商家 (Shops) - 商店 */}
        <button
          onClick={() => {
            handleInterruptClick();
            handleTabChange("shops");
          }}
          className="relative flex flex-col items-center justify-center min-w-[50px] transition-all duration-300 group"
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
            ${
              activeTab === "shops"
                ? isDarkMode
                  ? `bg-${cBase}-800 text-${cAccent}-400`
                  : `bg-${cBase}-100 text-${cBase}-900`
                : isDarkMode
                  ? `text-${cBase}-400 group-hover:bg-white/5`
                  : `text-${cBase}-400 group-hover:bg-black/5`
            }`}
          >
            <Store
              className={`w-5 h-5 transition-all ${activeTab === "shops" ? "stroke-[2.5px]" : "stroke-2"}`}
            />
          </div>
          <span
            className={`text-[10px] font-medium leading-none mt-1 transition-colors duration-300
            ${
              activeTab === "shops"
                ? isDarkMode
                  ? `text-${cAccent}-400`
                  : `text-${cBase}-900`
                : `text-${cBase}-500`
            }`}
          >
            商店
          </span>
        </button>

        {/* 5. 指南與連結 (Guides) - 指南 */}
        <button
          onClick={() => {
            handleInterruptClick();
            handleTabChange("guides");
          }}
          className="relative flex flex-col items-center justify-center min-w-[50px] transition-all duration-300 group"
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
            ${
              activeTab === "guides"
                ? isDarkMode
                  ? `bg-${cBase}-800 text-${cAccent}-400`
                  : `bg-${cBase}-100 text-${cBase}-900`
                : isDarkMode
                  ? `text-${cBase}-400 group-hover:bg-white/5`
                  : `text-${cBase}-400 group-hover:bg-black/5`
            }`}
          >
            <BookOpen
              className={`w-5 h-5 transition-all ${activeTab === "guides" ? "stroke-[2.5px]" : "stroke-2"}`}
            />
          </div>
          <span
            className={`text-[10px] font-medium leading-none mt-1 transition-colors duration-300
            ${
              activeTab === "guides"
                ? isDarkMode
                  ? `text-${cAccent}-400`
                  : `text-${cBase}-900`
                : `text-${cBase}-500`
            }`}
          >
            指南
          </span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
