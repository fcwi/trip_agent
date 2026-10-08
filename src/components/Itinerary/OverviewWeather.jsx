import { ArrowRight, Cloud, Loader, RotateCcw } from "lucide-react";

export default function OverviewWeather({
  userWeather,
  handleWeatherDetailOpen,
  getUserLocationWeather,
  isUpdatingLocation,
  getWeatherInfo,
  changeDay,
  tripStatus,
  currentTripDayIndex,
}) {
  const hasTemperature = Number.isFinite(userWeather.temp);
  const high = userWeather.daily?.temperature_2m_max?.[0];
  const low = userWeather.daily?.temperature_2m_min?.[0];
  return (
    <section
      className="travel-panel travel-weather-summary"
      aria-labelledby="overview-weather-heading"
    >
      <div className="travel-section-heading">
        <h2 id="overview-weather-heading">目前所在地天氣</h2>
        <button
          type="button"
          className="travel-icon-button"
          disabled={isUpdatingLocation}
          aria-busy={isUpdatingLocation}
          aria-label={
            isUpdatingLocation ? "正在更新目前位置天氣" : "更新目前位置天氣"
          }
          onClick={() =>
            getUserLocationWeather({ isSilent: false, highAccuracy: false })
          }
        >
          {isUpdatingLocation ? (
            <Loader aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
          )}
        </button>
      </div>
      <div className="travel-weather-summary__reading">
        <span aria-hidden="true">
          {Number.isFinite(userWeather.weatherCode) ? (
            getWeatherInfo(userWeather.weatherCode).icon
          ) : (
            <Cloud className="h-6 w-6" />
          )}
        </span>
        <strong>
          {hasTemperature ? `${Math.round(userWeather.temp)}°` : "—"}
        </strong>
        <div>
          <p>{userWeather.locationName || "尚未取得位置"}</p>
          <small>
            {hasTemperature ? userWeather.desc || "天氣資訊" : "暫無天氣資料"}
          </small>
        </div>
      </div>
      {Number.isFinite(high) && Number.isFinite(low) && (
        <p className="travel-muted">
          高溫 {Math.round(high)}° · 低溫 {Math.round(low)}°
        </p>
      )}
      <button
        type="button"
        className="travel-text-button"
        onClick={handleWeatherDetailOpen}
      >
        詳細天氣資訊 <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </button>
      {tripStatus !== "after" && (
        <button
          type="button"
          className="travel-text-button travel-weather-summary__destination"
          onClick={() =>
            changeDay(tripStatus === "during" ? currentTripDayIndex : 0)
          }
        >
          查看目的地行程與天氣{" "}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </section>
  );
}
