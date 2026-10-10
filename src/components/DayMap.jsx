import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Unlock } from "lucide-react";
import JournalMapCanvas from "./JournalMapCanvas.jsx";
import MapModal from "./MapModal.jsx";
import {
  isValidLngLat,
  toMapLibreRouteCoordinates,
} from "../utils/mapHelpers.js";
import { eventMapUrl } from "../utils/journalMap.js";

export default function DayMap(props) {
  const { onModalToggle } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeStatus, setRouteStatus] = useState("idle");
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  const validEvents = useMemo(
    () => props.events.filter((event) => isValidLngLat(event.lon, event.lat)),
    [props.events],
  );
  useEffect(() => {
    onModalToggle?.(isModalOpen);
  }, [isModalOpen, onModalToggle]);
  useEffect(() => {
    const pop = () => {
      if (window.history.state?.modal !== "map") setIsModalOpen(false);
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  useEffect(() => {
    // Synchronize the displayed request state with new route inputs.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (validEvents.length < 2 || !props.MAPTILER_KEY || !online) {
      setRouteCoords([]);
      setRouteStatus("idle");
      return;
    }
    const controller = new AbortController();
    let disposed = false;
    const timeout = setTimeout(() => controller.abort(), 10000);
    setRouteStatus("loading");
    setRouteCoords([]);
    const waypoints = validEvents
      .map((event) => `${event.lon},${event.lat}`)
      .join(";");
    fetch(
      `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`,
      { signal: controller.signal },
    )
      .then((response) => {
        if (!response.ok) throw new Error("route unavailable");
        return response.json();
      })
      .then((data) => {
        if (disposed) return;
        const coordinates = toMapLibreRouteCoordinates(
          data.routes?.[0]?.geometry?.coordinates || [],
        );
        setRouteCoords(coordinates);
        setRouteStatus(coordinates.length > 1 ? "ready" : "unavailable");
      })
      .catch(() => {
        if (!disposed) setRouteStatus("unavailable");
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      disposed = true;
      clearTimeout(timeout);
      controller.abort();
    };
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [validEvents, props.MAPTILER_KEY, online]);
  return (
    <div className="journal-map-preview-block">
      <div className="travel-map-preview journal-map-preview">
        <JournalMapCanvas {...props} routeCoords={routeCoords} />
        <button
          type="button"
          className="travel-map-preview__open journal-map-open"
          onClick={() => setIsModalOpen(true)}
        >
          <Unlock aria-hidden="true" className="h-4 w-4" />
          開啟互動地圖
        </button>
      </div>
      {routeStatus === "loading" && (
        <p className="travel-muted" role="status">
          正在計算道路路線…
        </p>
      )}
      {routeStatus === "unavailable" && (
        <p className="travel-muted">
          道路路線暫無法取得，仍可查看地點標記；交通方式請以行程文字為準。
        </p>
      )}
      <p className="travel-muted">
        地圖編號對應行程順序；道路連線不代表所有交通方式。
      </p>
      <div className="journal-map-place-links">
        {props.events.map((event, index) => (
          <a
            key={index}
            href={eventMapUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {index + 1}. {event.title}
            <span className="sr-only">，在 Google Maps 查看</span>
          </a>
        ))}
      </div>
      {isModalOpen &&
        createPortal(
          <MapModal
            {...props}
            routeCoords={routeCoords}
            isOpen
            onClose={() => setIsModalOpen(false)}
          />,
          document.body,
        )}
    </div>
  );
}
