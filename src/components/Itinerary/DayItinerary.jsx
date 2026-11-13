import { useRef, useState } from "react";
import { AlertCircle, Hotel, ListOrdered, Navigation } from "lucide-react";
import { JournalTurn } from "./JournalMarks.jsx";
import JournalSticker from "./JournalSticker.jsx";
import TimelineEvent from "./TimelineEvent.jsx";
import {
  EVENT_CATEGORY_LABELS,
  resolveEventCategory,
} from "../../utils/itineraryHelpers.js";
import { DayStamp } from "./JournalIllustration.jsx";
import { eventMapUrl } from "../../utils/journalMap.js";
import { isValidLngLat } from "../../utils/mapHelpers.js";

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
  renderMap,
}) {
  const timelineHeadingRef = useRef(null);
  const routeHeadingRef = useRef(null);
  const [mapStop, setMapStop] = useState(null);
  const jumpTo = (headingRef) => {
    const heading = headingRef.current;
    if (!heading) return;
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  if (!day) return null;
  const selectedEvent = mapStop === null ? null : day.events[mapStop];
  const showMap = Boolean(day.routeInfo || day.events.length);
  const legendCategories = Object.keys(EVENT_CATEGORY_LABELS).filter((cat) =>
    day.events.some((event) => resolveEventCategory(event) === cat),
  );
  const locationName =
    tripConfig.locations.find((location) => location.key === currentLocation)
      ?.name || "當地";
  return (
    <div
      className={`travel-day-layout ${showMap ? "travel-day-layout--with-route" : ""}`}
    >
      <div className="travel-day-main">
        <header
          className="travel-day-heading"
          data-journal-tone={activeDay % 3}
        >
          <div className="journal-day-picture">
            <DayStamp tripId={tripConfig.id} dayIndex={activeDay} />
          </div>
          <div className="journal-day-title">
            <p className="travel-eyebrow">
              {day.day} · {day.date}
            </p>
            <h2>{day.title}</h2>
            <p className="travel-muted">{locationName}</p>
            {day.stay &&
              !day.stay.includes("溫暖的家") &&
              (day.stayPending ? (
                <p className="travel-muted">
                  住宿區域：{day.stay}（飯店待確認）
                </p>
              ) : (
                <a
                  className="travel-text-button"
                  href={getMapLink(day.stayMapQuery || day.stay.split("(")[0])}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Hotel aria-hidden="true" className="h-4 w-4 flex-none" />
                  {day.stay}
                  <JournalTurn
                    aria-hidden="true"
                    className="h-4 w-4 flex-none"
                  />
                </a>
              ))}
          </div>
        </header>
        <nav className="journal-day-shortcuts" aria-label="當日快速導覽">
          <button type="button" onClick={() => jumpTo(timelineHeadingRef)}>
            <ListOrdered aria-hidden="true" />
            當日安排
            <JournalTurn aria-hidden="true" />
          </button>
          {showMap && (
            <button
              type="button"
              onClick={() => {
                setMapStop(null);
                jumpTo(routeHeadingRef);
              }}
            >
              <Navigation aria-hidden="true" />
              當日路線
              <JournalTurn aria-hidden="true" />
            </button>
          )}
        </nav>
        {day.intro && (
          <div className="journal-day-note">
            <JournalSticker kind="notebook" />
            <p className="journal-day-intro">{day.intro}</p>
          </div>
        )}
        {day.timingNote && (
          <p className="journal-timing-note">{day.timingNote}</p>
        )}
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
          <JournalTurn className="h-4 w-4 flex-none" />
        </button>
        {day.notice && (
          <aside
            className={`travel-day-notice ${day.notice.type === "alert" ? "travel-day-notice--alert" : ""}`}
          >
            <AlertCircle aria-hidden="true" className="h-5 w-5 flex-none" />
            <div>
              <h3>{day.notice.type === "alert" ? "重要提醒" : "今日提醒"}</h3>
              <p>{day.notice.text}</p>
            </div>
          </aside>
        )}
        <section
          className="travel-panel travel-timeline"
          aria-labelledby="daily-timeline-heading"
        >
          <div className="travel-section-heading">
            <h2
              id="daily-timeline-heading"
              ref={timelineHeadingRef}
              tabIndex={-1}
            >
              當日安排
            </h2>
            <span>{day.events.length} 個行程節點</span>
          </div>
          {legendCategories.length > 0 && (
            <ul className="journal-timeline-legend" aria-hidden="true">
              {legendCategories.map((cat) => (
                <li key={cat} data-event-category={cat}>
                  <span className="journal-timeline-legend__dot" />
                  {EVENT_CATEGORY_LABELS[cat]}
                </li>
              ))}
            </ul>
          )}
          <ol>
            {day.events.map((event, index) => (
              <TimelineEvent
                key={index}
                event={event}
                dayIndex={activeDay}
                eventIndex={index}
                isOpen={expandedItems[`${activeDay}-${index}`]}
                toggleExpand={toggleExpand}
                onPreviewMap={
                  showMap
                    ? () => {
                        setMapStop(index);
                        jumpTo(routeHeadingRef);
                      }
                    : undefined
                }
              />
            ))}
          </ol>
        </section>
      </div>
      {showMap && (
        <aside
          className="travel-panel travel-day-route"
          aria-labelledby="day-route-heading"
        >
          <div className="travel-section-heading">
            <h2 id="day-route-heading" ref={routeHeadingRef} tabIndex={-1}>
              當日路線
            </h2>
          </div>
          {day.routeInfo?.summary && (
            <p className="travel-muted">{day.routeInfo.summary}</p>
          )}
          {selectedEvent && (
            <div
              className="journal-map-selection"
              role="group"
              aria-label="目前選擇的地點"
            >
              <p role="status">
                <strong>
                  第 {mapStop + 1} 站 · {selectedEvent.title}
                </strong>
                {!isValidLngLat(selectedEvent.lon, selectedEvent.lat) && (
                  <span className="block travel-muted">
                    此站尚無座標，可使用地名搜尋。
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="journal-view-toggle"
                  onClick={() => {
                    jumpTo(routeHeadingRef);
                    setMapStop(null);
                  }}
                >
                  看全天路線
                </button>
                <a
                  className="journal-view-toggle"
                  href={eventMapUrl(selectedEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {isValidLngLat(selectedEvent.lon, selectedEvent.lat)
                    ? "在 Google Maps 開啟此站"
                    : "在 Google Maps 搜尋此站"}
                </a>
              </div>
            </div>
          )}
          <div
            className="travel-day-route__map"
            onTouchStart={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
            onTouchEnd={(event) => event.stopPropagation()}
          >
            {renderMap(mapStop)}
          </div>
          {day.routeInfo?.mapUrl && (
            <a
              className="travel-primary-button"
              href={day.routeInfo.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation aria-hidden="true" className="h-4 w-4" />
              開啟 Google Maps 查看路線
            </a>
          )}
        </aside>
      )}
    </div>
  );
}
