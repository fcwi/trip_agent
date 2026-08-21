import { Key, Lock, Moon, Sun } from "lucide-react";
import CurrencyWidget from "./CurrencyWidget.jsx";

const TripHeader = ({
  tripConfig,
  isDarkMode,
  theme,
  componentStyles,
  testModeClickCount,
  onTitleClick,
  onLock,
  onToggleTheme,
  rateData,
  isOnline,
}) => {
  const lockLabel = testModeClickCount === 10 ? "進入測試模式" : "鎖定行程";
  const actionClasses = `rounded-full border p-2 shadow-sm backdrop-blur-md transition-[background-color,border-color,color,box-shadow,transform] duration-300 active:scale-90 ${componentStyles.itineraryCard} ${theme.accent}`;

  return (
    <header className="relative z-20 flex items-end justify-between gap-4 px-4 pb-2 pt-5">
      <div
        className={`min-w-0 rounded-2xl border px-3 py-2.5 shadow-sm backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300 ${componentStyles.itineraryCard}`}
      >
        <h1
          className={`whitespace-nowrap text-base font-bold tracking-wide drop-shadow-sm transition-colors ${theme.text}`}
          style={{
            textShadow: isDarkMode
              ? "0 1px 2px rgba(0,0,0,0.5)"
              : "0 1px 1px rgba(255,255,255,0.5)",
          }}
        >
          <button
            type="button"
            aria-label="行程標題；連續點擊可開啟測試模式"
            className="rounded-md text-left"
            onClick={onTitleClick}
          >
            {tripConfig.title}
          </button>
        </h1>
        <p
          className={`mt-0.5 whitespace-nowrap text-[10px] font-medium tracking-widest opacity-70 ${theme.textSec}`}
        >
          {tripConfig.subTitle}
        </p>
      </div>

      <div className="flex flex-shrink-0 flex-col items-end gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onLock}
            className={actionClasses}
            title={lockLabel}
            aria-label={lockLabel}
          >
            {testModeClickCount === 10 ? (
              <Key
                aria-hidden="true"
                className="h-4 w-4 animate-bounce fill-current text-pink-500"
              />
            ) : (
              <Lock aria-hidden="true" className="h-4 w-4 fill-current" />
            )}
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className={actionClasses}
            aria-label={`切換到${isDarkMode ? "亮色" : "深色"}模式`}
          >
            {isDarkMode ? (
              <Moon aria-hidden="true" className="h-4 w-4 fill-current" />
            ) : (
              <Sun
                aria-hidden="true"
                className="h-4 w-4 fill-current text-amber-500"
              />
            )}
          </button>
        </div>

        <CurrencyWidget
          isDarkMode={isDarkMode}
          rateData={rateData}
          isOnline={isOnline}
          tripConfig={tripConfig}
        />
      </div>
    </header>
  );
};

export default TripHeader;
