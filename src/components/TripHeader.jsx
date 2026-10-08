import { Key, Lock, Moon, Sun } from "lucide-react";
import CurrencyWidget from "./CurrencyWidget.jsx";

const TripHeader = ({
  tripConfig,
  isDarkMode,
  testModeClickCount,
  onTitleClick,
  onLock,
  onToggleTheme,
  rateData,
  isOnline,
  isOverview = false,
}) => {
  const lockLabel = testModeClickCount === 10 ? "進入測試模式" : "鎖定行程";
  return (
    <header className="travel-header">
      <div className="travel-header__identity">
        <p className="travel-eyebrow">Trip Agent</p>
        <h1 className="travel-header__title">
          <button
            type="button"
            aria-label="行程標題；連續點擊可開啟測試模式"
            onClick={onTitleClick}
          >
            {isOverview ? "旅行手帳" : tripConfig.title}
          </button>
        </h1>
        {!isOverview && (
          <p className="travel-header__dates">{tripConfig.subTitle}</p>
        )}
      </div>
      <div className="travel-header__actions">
        <button
          type="button"
          onClick={onLock}
          className="travel-icon-button"
          title={lockLabel}
          aria-label={lockLabel}
        >
          {testModeClickCount === 10 ? (
            <Key aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Lock aria-hidden="true" className="h-5 w-5" />
          )}
        </button>
        <button
          type="button"
          onClick={onToggleTheme}
          className="travel-icon-button"
          aria-label={`切換到${isDarkMode ? "亮色" : "深色"}模式`}
        >
          {isDarkMode ? (
            <Moon aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Sun aria-hidden="true" className="h-5 w-5" />
          )}
        </button>
      </div>
      <div className="travel-header__currency">
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
