import { Key, Lock, Moon, Sun } from "lucide-react";
import CurrencyWidget from "./CurrencyWidget.jsx";
import TripSwitcher from "./TripSwitcher.jsx";
import { getTripPhase } from "../config/tripCatalog.js";

const phaseLabels = {
  upcoming: "即將出發",
  during: "旅程中",
  past: "旅程回顧",
};

const TripHeader = ({
  tripConfig,
  isDarkMode,
  testModeClickCount,
  onTitleClick,
  onLock,
  onToggleTheme,
  rateData,
  isOnline,
}) => {
  const lockLabel = testModeClickCount === 10 ? "進入測試模式" : "鎖定行程";
  const phase = getTripPhase(tripConfig);
  return (
    <header className="travel-header">
      <div className="travel-header__identity">
        <p className="travel-eyebrow journal-header-kicker">
          <span>Trip Agent</span>
          <span className="journal-header-phase" data-trip-phase={phase}>
            {phaseLabels[phase]}
          </span>
        </p>
        <h1 className="travel-header__title" aria-label={tripConfig.title}>
          <button
            type="button"
            aria-label="行程標題；連續點擊可開啟測試模式"
            onClick={onTitleClick}
          >
            <span className="travel-header__title-size" aria-hidden="true">
              {tripConfig.title}
            </span>
            <span>{tripConfig.title}</span>
          </button>
        </h1>
        <p className="travel-header__dates">{tripConfig.subTitle}</p>
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
        <TripSwitcher currentId={tripConfig.id} />
      </div>
    </header>
  );
};
export default TripHeader;
