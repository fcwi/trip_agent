import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeftRight, Check, X } from "lucide-react";
import {
  tripCatalog,
  getTripPhase,
  getTripSummary,
  createTripUrl,
} from "../config/tripCatalog.js";
import { useModalAccessibility } from "../hooks/useModalAccessibility.js";
import JournalIllustration from "./Itinerary/JournalIllustration.jsx";

const phaseLabels = {
  during: "旅程中",
  upcoming: "即將出發",
  past: "旅程回顧",
};

function TripChooser({ currentId, onClose }) {
  const dialogRef = useModalAccessibility(true, onClose);
  useEffect(() => {
    const root = document.getElementById("root");
    const previous = root?.inert;
    if (root) root.inert = true;
    return () => {
      if (root) root.inert = previous;
    };
  }, []);
  const selectTrip = (trip) => {
    if (trip.id === currentId) return onClose();
    onClose();
    window.location.assign(createTripUrl(trip.id, window.location.href));
  };
  return createPortal(
    <div className="journal-trip-overlay">
      <button
        type="button"
        className="journal-trip-scrim"
        tabIndex={-1}
        aria-label="關閉行程選擇"
        onClick={onClose}
      />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trip-chooser-title"
        tabIndex={-1}
        className="journal-trip-chooser"
      >
        <div className="journal-trip-chooser__heading">
          <div>
            <p className="travel-eyebrow">Trip Agent</p>
            <h2 id="trip-chooser-title">選擇旅程</h2>
          </div>
          <button
            type="button"
            className="travel-icon-button"
            aria-label="關閉行程選擇"
            onClick={onClose}
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>
        <p className="journal-trip-chooser__hint">
          回顧走過的風景，也為下一趟出發做準備。
        </p>
        <div className="journal-trip-list">
          {tripCatalog.map((trip) => (
            <button
              type="button"
              key={trip.id}
              aria-pressed={trip.id === currentId}
              aria-label={`切換至${trip.title}`}
              className="journal-trip-card"
              onClick={() => selectTrip(trip)}
            >
              <span
                className="journal-trip-card__art"
                data-artwork={trip.artwork.id}
              >
                <JournalIllustration tripId={trip.id} />
              </span>
              <span className="journal-trip-card__copy">
                <span className="journal-trip-card__phase">
                  {phaseLabels[getTripPhase(trip)]}
                  {trip.id === currentId && "・目前行程"}
                </span>
                <strong>{trip.title}</strong>
                <span>
                  {trip.startDate.replaceAll("-", "/")} –{" "}
                  {trip.endDate.slice(5).replace("-", "/")}
                </span>
              </span>
              {trip.id === currentId && (
                <Check
                  className="journal-trip-card__check"
                  aria-hidden="true"
                  size={20}
                />
              )}
            </button>
          ))}
        </div>
      </section>
    </div>,
    document.body,
  );
}

export default function TripSwitcher({ currentId }) {
  const [isOpen, setIsOpen] = useState(false);
  const current = getTripSummary(currentId);
  return (
    <>
      <button
        type="button"
        className="journal-trip-switch"
        aria-haspopup="dialog"
        aria-label={`切換行程，目前${current.label}`}
        onClick={() => setIsOpen(true)}
      >
        <ArrowLeftRight aria-hidden="true" size={16} />
        <span>{current.label}</span>
        <span className="journal-trip-switch__hint">切換行程</span>
      </button>
      {isOpen && (
        <TripChooser currentId={currentId} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
