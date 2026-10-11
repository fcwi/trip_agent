import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { loadJournalMapEngine } from "../utils/journalMapEngine.js";
import { Loader2, RotateCcw } from "lucide-react";
import {
  buildEventPopupHtml,
  buildSharedLocationPopupHtml,
  isValidLngLat,
} from "../utils/mapHelpers.js";
import {
  classifyMapFailure,
  getMapPoints,
  MAP_FAILURE_MESSAGES,
  MAP_MESSAGES,
} from "../utils/journalMap.js";

const EMPTY = [];
const JournalMapCanvas = forwardRef(function JournalMapCanvas(
  {
    events = EMPTY,
    routeCoords = EMPTY,
    routeSegments,
    userLocation,
    otherUsersLocations = EMPTY,
    currentUser,
    MAPTILER_KEY,
    isDarkMode,
    interactive = false,
    onReady,
  },
  ref,
) {
  const container = useRef(null);
  const mapRef = useRef(null);
  const engineRef = useRef(null);
  const popups = useRef(new Map());
  const [online, setOnline] = useState(() => navigator.onLine);
  const [status, setStatus] = useState("loading");
  const [failure, setFailure] = useState("unknown");
  const [retry, setRetry] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(
      () =>
        setNow((previous) => {
          const current = Date.now();
          const changed = otherUsersLocations.some((location) => {
            const timestamp = new Date(location.timestamp).getTime();
            return (
              previous - timestamp < 86400000 !== current - timestamp < 86400000
            );
          });
          return changed ? current : previous;
        }),
      60000,
    );
    return () => clearInterval(timer);
  }, [otherUsersLocations]);
  const validEvents = useMemo(
    () =>
      events
        .map((event, index) => ({ ...event, index }))
        .filter((event) => isValidLngLat(event.lon, event.lat)),
    [events],
  );
  const recentOthers = useMemo(
    () =>
      otherUsersLocations.filter(
        (location) =>
          now - new Date(location.timestamp) < 86400000 &&
          isValidLngLat(location.lon, location.lat),
      ),
    [otherUsersLocations, now],
  );
  const points = useMemo(
    () => getMapPoints(validEvents, routeCoords, userLocation, recentOthers),
    [validEvents, routeCoords, userLocation, recentOthers],
  );
  const visibleStatus = !validEvents.length
    ? "empty"
    : !MAPTILER_KEY
      ? "unconfigured"
      : !online
        ? "offline"
        : status;
  const callbackRef = useRef(onReady);
  useEffect(() => {
    callbackRef.current = onReady;
  }, [onReady]);
  useEffect(() => {
    callbackRef.current?.(visibleStatus === "ready");
  }, [visibleStatus]);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  const reset = () => {
    if (!mapRef.current || !points.length) return;
    popups.current.forEach((popup) => popup.remove());
    const bounds = new engineRef.current.LngLatBounds();
    points.forEach((point) => bounds.extend(point));
    mapRef.current.fitBounds(bounds, { padding: 48, maxZoom: 15, duration: 0 });
  };
  useImperativeHandle(ref, () => ({
    reset,
    locate: () => {
      if (isValidLngLat(userLocation?.lon, userLocation?.lat))
        mapRef.current?.flyTo({
          center: [userLocation.lon, userLocation.lat],
          zoom: 15,
          duration: 0,
        });
    },
    focus: (index) => {
      const event = events[index];
      if (!isValidLngLat(event?.lon, event?.lat) || !mapRef.current) return;
      mapRef.current.flyTo({
        center: [event.lon, event.lat],
        zoom: 15,
        duration: 0,
      });
      popups.current.forEach((popup) => popup.remove());
      popups.current
        .get(index)
        ?.setLngLat([event.lon, event.lat])
        .addTo(mapRef.current);
    },
  }));
  useEffect(() => {
    if (!MAPTILER_KEY || !online || !validEvents.length) return;
    let disposed = false;
    let loaded = false;
    let currentMap;
    let timeout;
    const createdMarkers = [];
    // MapLibre is an external renderer; mirror its initialization and failures.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("loading");
    setFailure("unknown");
    const clearMarkers = () => {
      createdMarkers.forEach((marker) => marker.remove());
      popups.current.clear();
    };
    const initialize = async () => {
      try {
        // The optional engine may not be cached on the first offline visit.
        const maplibregl = await loadJournalMapEngine();
        if (disposed) return;
        engineRef.current = maplibregl;
        currentMap = new maplibregl.Map({
          container: container.current,
          style: `https://api.maptiler.com/maps/${isDarkMode ? "streets-v4-dark" : "streets-v4-pastel"}/style.json?key=${encodeURIComponent(MAPTILER_KEY)}`,
          center: [validEvents[0].lon, validEvents[0].lat],
          zoom: 11,
          interactive,
          attributionControl: false,
        });
        mapRef.current = currentMap;
        currentMap.addControl(
          new maplibregl.AttributionControl({ compact: true }),
          "bottom-right",
        );
        if (interactive) {
          currentMap.addControl(new maplibregl.NavigationControl(), "top-left");
          for (const [selector, label] of [
            ["zoom-in", "放大地圖"],
            ["zoom-out", "縮小地圖"],
            ["compass", "重設地圖方向"],
          ]) {
            const button = container.current.querySelector(
              `.maplibregl-ctrl-${selector}`,
            );
            button?.setAttribute("type", "button");
            button?.setAttribute("aria-label", label);
          }
        }
        timeout = setTimeout(() => {
          if (!disposed && !loaded) {
            setFailure((previous) =>
              previous === "unknown" ? "timeout" : previous,
            );
            setStatus("error");
          }
        }, 12000);
        currentMap.on("error", (event) => {
          if (!disposed && !loaded) {
            const category = classifyMapFailure(event.error);
            setFailure((previous) =>
              category === "unknown" ? previous : category,
            );
            setStatus("error");
          }
        });
        currentMap.on("load", () => {
          if (disposed) return;
          loaded = true;
          clearTimeout(timeout);
          setStatus("ready");
          currentMap.getStyle().layers.forEach((layer) => {
            if (layer.type !== "symbol" || !layer.layout?.["text-field"])
              return;
            currentMap.setLayoutProperty(layer.id, "text-field", [
              "format",
              [
                "coalesce",
                ["get", "name:zh-Hant"],
                ["get", "name:zh"],
                ["get", "name:en"],
                ["get", "name"],
                "",
              ],
              {},
              [
                "case",
                [
                  "all",
                  ["has", "name"],
                  [
                    "!=",
                    ["get", "name"],
                    [
                      "coalesce",
                      ["get", "name:zh-Hant"],
                      ["get", "name:zh"],
                      ["get", "name:en"],
                      ["get", "name"],
                    ],
                  ],
                ],
                ["concat", "\n", ["get", "name"]],
                "",
              ],
              { "font-scale": 0.8 },
            ]);
          });
          validEvents.forEach((event) => {
            const element = document.createElement(
              interactive ? "button" : "div",
            );
            element.className = "journal-map-marker";
            element.textContent = String(event.index + 1);
            if (interactive) {
              element.type = "button";
              element.setAttribute(
                "aria-label",
                `地點 ${event.index + 1}：${event.title}`,
              );
            } else element.setAttribute("aria-hidden", "true");
            const marker = new maplibregl.Marker({ element })
              .setLngLat([event.lon, event.lat])
              .addTo(currentMap);
            if (interactive) {
              const popup = new maplibregl.Popup({
                offset: 20,
                closeButton: true,
                className: "journal-map-popup",
              }).setHTML(
                buildEventPopupHtml({ ...event, isDarkMode, compact: true }),
              );
              popup.on("open", () =>
                popup
                  .getElement()
                  .querySelector(".maplibregl-popup-close-button")
                  ?.setAttribute("aria-label", "關閉地點資訊"),
              );
              marker.setPopup(popup);
              popups.current.set(event.index, popup);
            }
            createdMarkers.push(marker);
          });
          const addPerson = (location, avatar, name, shared) => {
            if (!isValidLngLat(location?.lon, location?.lat)) return;
            const element = document.createElement(
              interactive && shared ? "button" : "div",
            );
            if (interactive && shared) element.type = "button";
            element.className = "journal-map-person";
            element.textContent = avatar || "👤";
            element.setAttribute("aria-label", name);
            const marker = new maplibregl.Marker({ element }).setLngLat([
              location.lon,
              location.lat,
            ]);
            if (shared && interactive)
              marker.setPopup(
                new maplibregl.Popup({ offset: 20 }).setHTML(
                  buildSharedLocationPopupHtml({
                    name,
                    avatar,
                    device: location.device,
                    relativeTime: "最近分享的位置",
                    lat: location.lat,
                    lon: location.lon,
                    isDarkMode,
                  }),
                ),
              );
            createdMarkers.push(marker.addTo(currentMap));
          };
          addPerson(userLocation, currentUser?.avatar, "目前位置", false);
          recentOthers.forEach((location) =>
            addPerson(
              location,
              location.user?.avatar,
              location.user?.name || "旅伴",
              true,
            ),
          );
          const routes = (routeSegments || [routeCoords])
            .map((segment) =>
              segment.filter((point) => isValidLngLat(point?.[0], point?.[1])),
            )
            .filter((segment) => segment.length > 1);
          if (routes.length) {
            currentMap.addSource("journal-route", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: { type: "MultiLineString", coordinates: routes },
              },
            });
            currentMap.addLayer({
              id: "journal-route",
              type: "line",
              source: "journal-route",
              paint: {
                "line-color": isDarkMode ? "#a5cede" : "#3c6472",
                "line-width": 4,
              },
              layout: { "line-join": "round", "line-cap": "round" },
            });
          }
          const bounds = new maplibregl.LngLatBounds();
          points.forEach((point) => bounds.extend(point));
          currentMap.fitBounds(bounds, {
            padding: 48,
            maxZoom: 15,
            duration: 0,
          });
        });
      } catch (error) {
        if (!disposed) {
          setFailure(classifyMapFailure(error));
          setStatus("error");
        }
      }
    };
    initialize();
    return () => {
      disposed = true;
      clearTimeout(timeout);
      clearMarkers();
      currentMap?.remove();
      mapRef.current = null;
    };
  }, [
    MAPTILER_KEY,
    online,
    validEvents,
    routeCoords,
    routeSegments,
    points,
    recentOthers,
    currentUser?.avatar,
    userLocation,
    interactive,
    isDarkMode,
    retry,
  ]);
  const message =
    visibleStatus === "error"
      ? MAP_FAILURE_MESSAGES[failure] || MAP_MESSAGES.error
      : MAP_MESSAGES[visibleStatus];
  return (
    <div className="journal-map-canvas" data-map-status={visibleStatus}>
      <div ref={container} className="journal-map-canvas__surface" />
      {message && (
        <div className="journal-map-state" role="status" aria-live="polite">
          {visibleStatus === "loading" && (
            <Loader2 aria-hidden="true" className="h-6 w-6 animate-spin" />
          )}
          <strong>{message[0]}</strong>
          <p>{message[1]}</p>
          {visibleStatus === "error" && (
            <button
              type="button"
              className="travel-text-button"
              onClick={() => setRetry((value) => value + 1)}
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              重新載入地圖
            </button>
          )}
        </div>
      )}
    </div>
  );
});
export default JournalMapCanvas;
