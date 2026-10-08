import { ArrowUpRight } from "lucide-react";

export default function TripDayIndex({
  itineraryData,
  tripConfig,
  changeDay,
  currentTripDayIndex,
  tripStatus,
}) {
  return (
    <section
      className="travel-panel travel-day-index"
      aria-labelledby="trip-days-heading"
    >
      <div className="travel-section-heading">
        <h2 id="trip-days-heading">每日行程</h2>
        <span>{itineraryData.length} 天</span>
      </div>
      <ol>
        {itineraryData.map((day, index) => (
          <li key={day.day}>
            <button
              type="button"
              onClick={() => changeDay(index)}
              aria-label={`開啟${day.day}，${day.date}，${day.title}`}
            >
              <span className="travel-day-index__number">
                {day.day}
                <small>{day.date}</small>
              </span>
              <span className="travel-day-index__content">
                <strong>{day.title}</strong>
                <small>
                  {tripConfig.locations.find(
                    (location) => location.key === day.locationKey,
                  )?.name ||
                    day.stay ||
                    "地點待確認"}
                </small>
              </span>
              {tripStatus === "during" && currentTripDayIndex === index && (
                <span className="travel-badge">今天</span>
              )}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 flex-none" />
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
