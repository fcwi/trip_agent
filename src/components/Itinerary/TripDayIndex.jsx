import { useTripViewToggle } from "../../hooks/useTripViewToggle.js";
import { JournalTurn } from "./JournalMarks.jsx";
import { DayStamp } from "./JournalIllustration.jsx";

export default function TripDayIndex({
  itineraryData,
  tripConfig,
  changeDay,
  currentTripDayIndex,
  tripStatus,
}) {
  const [showSummary, setShowSummary] = useTripViewToggle("day-summary-view");

  return (
    <section
      className="travel-panel travel-day-index"
      aria-labelledby="trip-days-heading"
      style={{
        "--trip-day-count": Math.max(1, Math.min(6, itineraryData.length)),
      }}
    >
      <div className="travel-section-heading">
        <h2 id="trip-days-heading">每日行程</h2>
        <button
          type="button"
          className="journal-view-toggle"
          aria-pressed={showSummary}
          onClick={() => setShowSummary(!showSummary)}
        >
          跨日總覽
        </button>
      </div>
      <ol>
        {itineraryData.map((day, index) => {
          const first = day.events[0];
          const last = day.events.at(-1);
          return (
            <li key={day.day}>
              <button
                type="button"
                onClick={() => changeDay(index)}
                aria-label={`開啟${day.day}，${day.date}，${day.title}`}
                aria-describedby={
                  showSummary ? `trip-day-summary-${index}` : undefined
                }
              >
                <span className="travel-day-index__number">
                  <span className="journal-index-picture" aria-hidden="true">
                    <DayStamp tripId={tripConfig.id} dayIndex={index} />
                  </span>
                  {day.day}
                  <small>{day.date}</small>
                </span>
                <span className="travel-day-index__content">
                  <strong>{day.title}</strong>
                  {showSummary ? (
                    <span
                      id={`trip-day-summary-${index}`}
                      className="journal-day-summary"
                    >
                      {first && (
                        <span>
                          <b>首站</b> {first.time} {first.title}
                        </span>
                      )}
                      {day.routeInfo?.summary && (
                        <span>
                          <b>移動</b> {day.routeInfo.summary}
                        </span>
                      )}
                      {day.stay && !day.stay.includes("溫暖的家") ? (
                        <span>
                          <b>住宿</b> {day.stay}
                          {day.stayPending ? "（待確認）" : ""}
                        </span>
                      ) : (
                        last &&
                        last !== first && (
                          <span>
                            <b>末站</b> {last.time} {last.title}
                          </span>
                        )
                      )}
                    </span>
                  ) : (
                    <small>
                      {day.caption ||
                        tripConfig.locations.find(
                          (location) => location.key === day.locationKey,
                        )?.name ||
                        day.stay ||
                        "地點待確認"}
                    </small>
                  )}
                </span>
                {tripStatus === "during" && currentTripDayIndex === index && (
                  <span className="travel-badge">今天</span>
                )}
                <JournalTurn className="h-4 w-4 flex-none" />
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
