import { AlertCircle, ArrowUpRight, Hotel, Navigation } from "lucide-react";
import TimelineEvent from "./TimelineEvent.jsx";
import JournalIllustration from "./JournalIllustration.jsx";

export default function DayItinerary({
  day,
  activeDay,
  tripConfig,
  currentLocation,
  displayWeather,
  handleWeatherDetailOpen,
  expandedItems,
  toggleExpand,
  getMapLink,
  map,
}) {
  if (!day) return null;
  const locationName =
    tripConfig.locations.find((location) => location.key === currentLocation)
      ?.name || "當地";
  return (
    <div
      className={`travel-day-layout ${day.routeInfo ? "travel-day-layout--with-route" : ""}`}
    >
      <div className="travel-day-main">
        <header
          className="travel-day-heading"
          data-journal-tone={activeDay % 3}
        >
          <div className="journal-day-picture">
            <JournalIllustration
              tripId={tripConfig.id}
              miniature
              variant={activeDay}
            />
          </div>
          <div className="journal-day-title">
            <p className="travel-eyebrow">
              {day.day} · {day.date}
            </p>
            <h2>{day.title}</h2>
            <p className="travel-muted">{locationName}</p>
            {day.stay && !day.stay.includes("溫暖的家") && (
              <a
                className="travel-text-button"
                href={getMapLink(day.stay.split("(")[0])}
              >
                <Hotel aria-hidden="true" className="h-4 w-4 flex-none" />
                {day.stay}
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 flex-none"
                />
              </a>
            )}
          </div>
        </header>
        <button
          type="button"
          className="travel-day-weather"
          onClick={handleWeatherDetailOpen}
          aria-label={`查看${locationName}詳細天氣資訊`}
        >
          <span className="travel-day-weather__icon" aria-hidden="true">
            {displayWeather.icon}
          </span>
          <span>
            <strong>
              {displayWeather.temp} · {displayWeather.desc}
            </strong>
            <small>{displayWeather.advice}</small>
          </span>
          <ArrowUpRight aria-hidden="true" className="h-4 w-4 flex-none" />
        </button>
        {day.notice && (
          <aside
            className={`travel-day-notice ${day.notice.type === "alert" ? "travel-day-notice--alert" : ""}`}
          >
            <AlertCircle aria-hidden="true" className="h-5 w-5 flex-none" />
            <div>
              <h3>{day.notice.type === "alert" ? "重要提醒" : "行程備註"}</h3>
              <p>{day.notice.text}</p>
            </div>
          </aside>
        )}
        <section
          className="travel-panel travel-timeline"
          aria-labelledby="daily-timeline-heading"
        >
          <div className="travel-section-heading">
            <h2 id="daily-timeline-heading">當日安排</h2>
            <span>{day.events.length} 個行程節點</span>
          </div>
          <ol>
            {day.events.map((event, index) => (
              <TimelineEvent
                key={index}
                event={event}
                dayIndex={activeDay}
                eventIndex={index}
                isOpen={expandedItems[`${activeDay}-${index}`]}
                toggleExpand={toggleExpand}
                getMapLink={getMapLink}
              />
            ))}
          </ol>
        </section>
      </div>
      {day.routeInfo && (
        <aside
          className="travel-panel travel-day-route"
          aria-labelledby="day-route-heading"
        >
          <div className="travel-section-heading">
            <h2 id="day-route-heading">當日路線</h2>
          </div>
          <p className="travel-muted">{day.routeInfo.summary}</p>
          <div
            className="travel-day-route__map"
            onTouchStart={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
            onTouchEnd={(event) => event.stopPropagation()}
          >
            {map}
          </div>
          {day.routeInfo.mapUrl && (
            <a className="travel-primary-button" href={day.routeInfo.mapUrl}>
              <Navigation aria-hidden="true" className="h-4 w-4" />
              開啟 Google Maps 查看路線
            </a>
          )}
        </aside>
      )}
    </div>
  );
}
