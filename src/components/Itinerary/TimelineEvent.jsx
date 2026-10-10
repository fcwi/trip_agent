import React from "react";
import { ChevronDown, ChevronUp, MapPin, Clock3 } from "lucide-react";

const CATEGORY_LABELS = {
  transport: "交通",
  food: "餐食",
  shopping: "購物",
  hotel: "住宿",
  spot: "景點",
  other: "行程",
};

export default function TimelineEvent({
  event,
  dayIndex,
  eventIndex,
  isOpen,
  toggleExpand,
  getMapLink,
}) {
  const isTransport =
    event.category === "transport" ||
    Boolean(event.transport) ||
    event.title.includes("交通");
  const category = isTransport
    ? "transport"
    : CATEGORY_LABELS[event.category]
      ? event.category
      : "other";
  const detailsId = `event-details-${dayIndex}-${eventIndex}`;
  return (
    <li
      className={`travel-timeline-event ${isTransport ? "travel-timeline-event--transport" : ""}`}
    >
      <div className="travel-timeline-event__time">{event.time}</div>
      <article className="travel-timeline-event__body">
        <div className="travel-timeline-event__heading">
          <h3>
            <button
              type="button"
              aria-expanded={Boolean(isOpen)}
              aria-controls={detailsId}
              onClick={() => toggleExpand(dayIndex, eventIndex)}
            >
              {React.isValidElement(event.icon) &&
                React.cloneElement(event.icon, {
                  "aria-hidden": true,
                  className: "h-5 w-5 flex-none",
                })}
              <span>{event.title}</span>
              {isOpen ? (
                <ChevronUp aria-hidden="true" className="h-4 w-4 flex-none" />
              ) : (
                <ChevronDown aria-hidden="true" className="h-4 w-4 flex-none" />
              )}
            </button>
          </h3>
        </div>
        <div className="travel-timeline-event__meta">
          <span className="travel-event-category">
            {isTransport && event.transport?.mode
              ? event.transport.mode
              : CATEGORY_LABELS[category]}
          </span>
          {isTransport && event.transport?.duration && (
            <span className="journal-transport-duration">
              <Clock3 aria-hidden="true" className="h-4 w-4" />
              {event.transport.duration}
            </span>
          )}
          <a
            className="travel-icon-button"
            href={getMapLink(event.mapQuery || event.title)}
            title="在 Google Maps 查看"
            aria-label={`在地圖查看${event.title}`}
          >
            <MapPin aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
        {!isTransport && event.desc && (
          <p
            className={`travel-timeline-event__description ${isOpen ? "" : "travel-timeline-event__description--collapsed"}`}
          >
            {event.desc}
          </p>
        )}
        {event.transport && (
          <div className="travel-transport-summary">
            <p>{event.transport.route || event.transport.mode}</p>
          </div>
        )}
        <div id={detailsId} hidden={!isOpen} className="travel-event-details">
          {isTransport && event.desc && (
            <section>
              <h4>交通說明</h4>
              <p>{event.desc}</p>
            </section>
          )}
          {event.transport?.note && (
            <section>
              <h4>交通提醒</h4>
              <p>{event.transport.note}</p>
            </section>
          )}
          {event.highlights?.length > 0 && (
            <section>
              <h4>必玩／必吃</h4>
              <ul>
                {event.highlights.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}
          {event.tips?.length > 0 && (
            <section>
              <h4>行程提醒</h4>
              <ul>
                {event.tips.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>
    </li>
  );
}
