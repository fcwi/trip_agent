import { useRef, useState } from "react";
import { X, RotateCcw, LocateFixed, MapPin } from "lucide-react";
import JournalMapCanvas from "./JournalMapCanvas.jsx";
import { useModalAccessibility } from "../hooks/useModalAccessibility.js";
import { isValidLngLat } from "../utils/mapHelpers.js";
import { eventMapUrl } from "../utils/journalMap.js";

export default function MapModal({ isOpen, onClose, ...props }) {
  const dialogRef = useModalAccessibility(isOpen, onClose);
  const canvas = useRef(null);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState(null);
  return (
    <div
      className="journal-map-modal travel-shell"
      data-editorial="true"
      data-theme={props.isDarkMode ? "dark" : "light"}
    >
      <button
        type="button"
        className="journal-map-backdrop"
        onClick={onClose}
        aria-label="關閉地圖"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-modal-title"
        tabIndex={-1}
        className="journal-map-dialog"
      >
        <header>
          <div>
            <p className="travel-eyebrow">旅行路線手帳</p>
            <h2 id="map-modal-title">當前路線導覽</h2>
          </div>
          <button
            type="button"
            className="travel-icon-button"
            aria-label="關閉地圖"
            onClick={onClose}
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </header>
        <div className="journal-map-modal-content">
          <div className="journal-map-modal-view">
            <JournalMapCanvas
              ref={canvas}
              {...props}
              interactive
              onReady={setReady}
            />
            <div className="journal-map-actions">
              <button
                type="button"
                className="travel-icon-button"
                aria-label="重置地圖視野"
                disabled={!ready}
                onClick={() => {
                  canvas.current?.reset();
                  setSelected(null);
                }}
              >
                <RotateCcw aria-hidden="true" className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="travel-icon-button"
                aria-label="將地圖移到目前位置"
                disabled={
                  !ready ||
                  !isValidLngLat(
                    props.userLocation?.lon,
                    props.userLocation?.lat,
                  )
                }
                onClick={() => canvas.current?.locate()}
              >
                <LocateFixed aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>
          <section className="journal-map-itinerary" aria-label="地圖行程地點">
            <p className="travel-muted">
              依行程順序選取地點；無座標的項目仍可在 Google Maps 搜尋。
            </p>
            <ol>
              {props.events.map((event, index) => (
                <li key={index}>
                  <button
                    type="button"
                    disabled={!ready || !isValidLngLat(event.lon, event.lat)}
                    aria-pressed={selected === index}
                    aria-label={`定位第${index + 1}站：${event.title}`}
                    onClick={() => {
                      setSelected(index);
                      canvas.current?.focus(index);
                    }}
                  >
                    <span>{index + 1}</span>
                    <div>
                      <small>{event.time}</small>
                      <strong>{event.title}</strong>
                    </div>
                    <MapPin aria-hidden="true" className="h-4 w-4" />
                  </button>
                  <a
                    href={eventMapUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    在 Google Maps 查看
                    <span className="sr-only">{event.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
