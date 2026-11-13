import React from "react";
import { ChevronDown, MapPin, Clock3 } from "lucide-react";
import { SceneArtwork } from "./artwork/DailyArtwork.jsx";
import JournalSticker from "./JournalSticker.jsx";
import { eventMapUrl } from "../../utils/journalMap.js";

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
  onPreviewMap,
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
      data-expanded={Boolean(isOpen)}
    >
      <div className="travel-timeline-event__time">{event.time}</div>
      <article className="travel-timeline-event__body">
        <div className="travel-timeline-event__heading">
          <h3>
            <button
              type="button"
              aria-expanded={Boolean(isOpen)}
              aria-controls={detailsId}
              aria-label={event.title}
              onClick={() => toggleExpand(dayIndex, eventIndex)}
            >
              {React.isValidElement(event.icon) &&
                React.cloneElement(event.icon, {
                  "aria-hidden": true,
                  className: "h-5 w-5 flex-none",
                })}
              <span className="journal-event-heading-copy">
                <span>{event.title}</span>
                <span className="journal-event-disclosure" aria-hidden="true">
                  {isOpen ? "收合詳情" : "查看詳情"}
                  <ChevronDown className="journal-event-chevron" />
                </span>
              </span>
            </button>
          </h3>
          {(event.artworkScene || event.artworkSticker) && (
            <span className="journal-event-art" aria-hidden="true">
              {event.artworkScene ? (
                <SceneArtwork sceneId={event.artworkScene} />
              ) : (
                <JournalSticker kind={event.artworkSticker} />
              )}
            </span>
          )}
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
          {event.locationPending ? (
            <span className="journal-event-pending">
              <Clock3 aria-hidden="true" />
              地點待出發通知
            </span>
          ) : onPreviewMap ? (
            <button
              type="button"
              className="travel-icon-button journal-event-map-link"
              onClick={onPreviewMap}
              aria-label={`在地圖查看${event.title}`}
            >
              <MapPin aria-hidden="true" className="h-4 w-4" />
              <span aria-hidden="true">地圖</span>
            </button>
          ) : (
            <a
              className="travel-icon-button journal-event-map-link"
              href={eventMapUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              title="在 Google Maps 查看"
              aria-label={`在地圖查看${event.title}`}
            >
              <MapPin aria-hidden="true" className="h-4 w-4" />
              <span aria-hidden="true">地圖</span>
            </a>
          )}
        </div>
        {event.locationProvisional && (
          <p className="travel-muted">暫定飯店，依出發通知調整</p>
        )}
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
            <section className="journal-event-reminder">
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
            <section className="journal-event-reminder">
              <h4>行程提醒</h4>
              <ul>
                {event.tips.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}
          {event.sources?.length > 0 && (
            <section className="journal-event-sources">
              <h4>查閱來源</h4>
              {event.sources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {source.text}
                </a>
              ))}
            </section>
          )}
        </div>
      </article>
    </li>
  );
}
