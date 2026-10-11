import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Unlock } from "lucide-react";
import JournalMapCanvas from "./JournalMapCanvas.jsx";
import MapModal from "./MapModal.jsx";
import { toMapLibreRouteCoordinates } from "../utils/mapHelpers.js";
import { eventMapUrl, getRoadRouteSegments } from "../utils/journalMap.js";

export default function DayMap(props) {
  const { onModalToggle } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routeSegments, setRouteSegments] = useState([]);
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
  const roadSegments = useMemo(
    () => getRoadRouteSegments(props.events),
    [props.events],
  );
  const routeCoords = useMemo(() => routeSegments.flat(), [routeSegments]);
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
    if (!roadSegments.length || !props.MAPTILER_KEY || !online) {
      setRouteSegments([]);
      setRouteStatus("idle");
      return;
    }
    const controller = new AbortController();
    let disposed = false;
    const timeout = setTimeout(() => controller.abort(), 10000);
    setRouteStatus("loading");
    setRouteSegments([]);
    Promise.all(
      roadSegments.map(async (segment) => {
        try {
          const waypoints = segment.map((point) => point.join(",")).join(";");
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`,
            { signal: controller.signal },
          );
          if (!response.ok) return [];
          const data = await response.json();
          if (data.code && data.code !== "Ok") return [];
          return toMapLibreRouteCoordinates(
            data.routes?.[0]?.geometry?.coordinates || [],
          );
        } catch {
          return [];
        }
      }),
    )
      .then((results) => {
        if (disposed) return;
        const available = results.filter((segment) => segment.length > 1);
        setRouteSegments(available);
        setRouteStatus(
          available.length === results.length
            ? "ready"
            : available.length
              ? "partial"
              : "unavailable",
        );
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      disposed = true;
      clearTimeout(timeout);
      controller.abort();
    };
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [roadSegments, props.MAPTILER_KEY, online]);
  return (
    <div className="journal-map-preview-block">
      <div className="travel-map-preview journal-map-preview">
        <JournalMapCanvas
          {...props}
          routeCoords={routeCoords}
          routeSegments={routeSegments}
        />
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
      {routeStatus === "partial" && (
        <p className="travel-muted">
          部分道路路線暫無法取得，仍可查看全部地點標記。
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
            routeSegments={routeSegments}
            isOpen
            onClose={() => setIsModalOpen(false)}
          />,
          document.body,
        )}
    </div>
  );
}
