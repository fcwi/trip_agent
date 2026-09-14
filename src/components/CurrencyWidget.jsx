import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  WifiOff,
} from "lucide-react";
const CurrencyWidget = ({ isDarkMode, rateData, isOnline, tripConfig }) => {
  const { code, target } = tripConfig.currency;
  const theme = tripConfig.theme || {};
  // 🆕 使用主題系統配置
  const interactions = theme.interactions || {};
  const shadows = theme.shadows || {};

  // Default state for rate data to prevent crashes
  const safeRateData = rateData || {
    current: null,
    trend: "neutral",
    diff: 0,
    loading: true,
    error: false,
  };

  const loading = safeRateData.loading && !safeRateData.error && isOnline;

  const formatRate = (val) => (val ? val.toFixed(3) : "--");
  const queryUrl = `https://www.google.com/search?q=1+${code.toUpperCase()}+to+${target.toUpperCase()}`;

  const containerClasses = `flex items-center gap-2 whitespace-nowrap rounded-xl border px-3 py-2 text-xs backdrop-blur-md ${shadows.subtle || "shadow-sm"} transition-[background-color,border-color,color,transform] duration-300 ${
    isDarkMode
      ? "border-stone-600/60 bg-stone-800/70 text-stone-100 ring-1 ring-white/10"
      : "border-stone-200/60 bg-white/80 text-stone-700 ring-1 ring-black/5"
  }`;

  const content = !isOnline ? (
    <div className="flex items-center gap-2">
      <WifiOff aria-hidden="true" className="h-3.5 w-3.5 text-amber-500" />
      <span className="font-bold">離線，保留上次匯率</span>
    </div>
  ) : loading ? (
    <div className="flex items-center gap-2" role="status" aria-live="polite">
      <span className="font-medium">匯率更新中…</span>
      <RefreshCw
        aria-hidden="true"
        className="h-3.5 w-3.5 animate-spin opacity-70"
      />
    </div>
  ) : safeRateData.error ? (
    <div className="flex items-center gap-2 font-bold">
      <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
      <span>暫時無法更新，點擊查詢</span>
    </div>
  ) : (
    <>
      <div className="flex items-baseline gap-1 tabular-nums">
        <span className="font-bold opacity-75">1 {code.toUpperCase()}</span>
        <span className="font-bold tracking-wide">
          ~ {formatRate(safeRateData.current)}
        </span>
        <span className="font-bold opacity-75">{target}</span>
      </div>

      <div aria-hidden="true" className="h-3 w-px bg-current opacity-20" />

      <div
        className="flex items-center"
        title={`與上週相比 ${safeRateData.diff > 0 ? "升值" : "貶值"} ${Math.abs(safeRateData.diff).toFixed(4)}`}
      >
        {safeRateData.trend === "up" && (
          <TrendingUp aria-hidden="true" className="h-3.5 w-3.5 text-red-500" />
        )}
        {safeRateData.trend === "down" && (
          <TrendingDown
            aria-hidden="true"
            className="h-3.5 w-3.5 text-emerald-500"
          />
        )}
        {safeRateData.trend === "neutral" && (
          <Minus aria-hidden="true" className="h-3.5 w-3.5 opacity-50" />
        )}
      </div>
    </>
  );

  if (!isOnline) {
    return (
      <div
        className={`${containerClasses} cursor-default`}
        role="status"
        aria-live="polite"
      >
        {content}
      </div>
    );
  }

  return (
    <a
      href={queryUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="點擊查看詳細匯率走勢"
      className={`${containerClasses} cursor-pointer hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${interactions.hover || "hover:scale-105"} ${interactions.active || "active:scale-95"}`}
    >
      {content}
    </a>
  );
};

export default CurrencyWidget;
