import React from "react";
import {
  Bus,
  ChevronDown,
  Clock3,
  Footprints,
  MapPin,
  Plane,
  Ship,
  Train,
} from "lucide-react";
import { SceneArtwork } from "./artwork/DailyArtwork.jsx";
import JournalSticker from "./JournalSticker.jsx";
import { eventMapUrl } from "../../utils/journalMap.js";
import {
  EVENT_CATEGORY_LABELS,
  resolveEventCategory,
} from "../../utils/itineraryHelpers.js";

const TRANSPORT_ICON_MATCHERS = [
  [/飛機|航班|航空|機場/, Plane],
  [/船|渡輪|遊覽船/, Ship],
  [/JR|新幹線|電車|地鐵|火車|鐵道|列車/, Train],
  [/步行|徒步|散步/, Footprints],
  [/遊覽車|巴士|公車|接駁|計程車|專車/, Bus],
];

const getTransportIcon = (mode = "") => {
  const match = TRANSPORT_ICON_MATCHERS.find(([pattern]) => pattern.test(mode));
  return match ? match[1] : null;
};

export default function TimelineEvent({
  event,
  dayIndex,
  eventIndex,
  isOpen,
  toggleExpand,
  onPreviewMap,
}) {
  const category = resolveEventCategory(event);
  const isTransport = category === "transport";
  const TransportIcon = isTransport
    ? getTransportIcon(event.transport?.mode)
    : null;
  const detailsId = `event-details-${dayIndex}-${eventIndex}`;
  return (
    <li
      className={`travel-timeline-event ${isTransport ? "travel-timeline-event--transport" : ""}`}
      data-event-category={category}
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
            {TransportIcon &&
              React.createElement(TransportIcon, {
                "aria-hidden": true,
                className: "h-3.5 w-3.5",
              })}
            {isTransport && event.transport?.mode
              ? event.transport.mode
              : EVENT_CATEGORY_LABELS[category]}
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
