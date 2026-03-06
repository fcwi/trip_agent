import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Lock, Unlock, Loader2 } from "lucide-react";
import MapModal from "./MapModal.jsx";

/**
 * DayMap Component with MapLibre GL JS & MapTiler
 */

const DayMap = ({
  events,
  userLocation,
  isDarkMode,
  theme,
  onModalToggle,
  otherUsersLocations = [],
  currentUser,
  MAPTILER_KEY,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [routeCoords, setRouteCoords] = useState([]);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  // 根據深色模式選擇樣式
  const mapStyle = isDarkMode
    ? `https://api.maptiler.com/maps/ch-swisstopo-lbm-dark/style.json?key=${MAPTILER_KEY}`
    : `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

  // 當彈窗狀態改變時，通知父組件 (App.jsx)
  useEffect(() => {
    if (onModalToggle) {
      onModalToggle(isModalOpen);
    }
  }, [isModalOpen, onModalToggle]);

  // 過濾出有效座標的事件
  const validEvents = useMemo(
    () => events.filter((e) => e.lat && e.lon),
    [events],
  );

  // Set map language to Traditional Chinese with local language below
  const setMapLanguage = useCallback(
    (mapInstance) => {
      if (!mapInstance) return;
      const style = mapInstance.getStyle();
      if (!style || !style.layers) return;

      style.layers.forEach((layer) => {
        if (
          layer.type === "symbol" &&
          layer.layout &&
          layer.layout["text-field"]
        ) {
          const hasTranslation = [
            "any",
            ["has", "name:zh-Hant"],
            ["has", "name:zh"],
            ["has", "name:en"],
          ];

          const isLocalChinese = [
            "any",
            ["==", ["get", "name"], ["get", "name:zh-Hant"]],
            ["==", ["get", "name"], ["get", "name:zh"]],
            ["==", ["get", "name"], ["get", "name:zh-Hans"]],
          ];

          const showSecondary = ["all", hasTranslation, ["!", isLocalChinese]];

          mapInstance.setLayoutProperty(layer.id, "text-field", [
            "format",
            [
              "coalesce",
              ["get", "name:zh-Hant"],
              ["get", "name:zh"],
              ["get", "name:en"],
              ["get", "name"],
              "",
            ],
            { "font-scale": 1.0 },
            ["case", showSecondary, "\n", ""],
            {},
            ["case", showSecondary, ["coalesce", ["get", "name"], ""], ""],
            {
              "font-scale": 0.8,
              "text-color": isDarkMode ? "#9ca3af" : "#6b7280",
            },
          ]);
        }
      });
    },
    [isDarkMode],
  );

  // 初始化地圖
  useEffect(() => {
    if (map.current) return; // 只初始化一次

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [139.6917, 35.6895], // [lon, lat]
      zoom: 10,
      interactive: false, // 預設禁用交互，由遮罩處理
      attributionControl: false,
    });

    map.current.on("load", () => {
      setMapLanguage(map.current);
    });

    map.current.on("styledata", () => {
      setMapLanguage(map.current);
    });

    map.current.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right",
    );

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapStyle, setMapLanguage]);

  // 切換主題樣式
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle);
    }
  }, [isDarkMode, mapStyle]);

  // 核心邏輯：從 OSRM 獲取路線資料
  useEffect(() => {
    if (validEvents.length < 2) {
      setRouteCoords([]);
      return;
    }

    const fetchRoute = async () => {
      setIsRouteLoading(true);
      try {
        const waypoints = validEvents.map((e) => `${e.lon},${e.lat}`).join(";");
        const url = `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes[0]) {
          const coordinates = data.routes[0].geometry.coordinates;
          setRouteCoords(coordinates);
        }
      } catch (error) {
        console.error("Failed to fetch route:", error);
      } finally {
        setIsRouteLoading(false);
      }
    };

    fetchRoute();
  }, [validEvents]);

  // 更新地圖內容 (標記、路線、視野)
  useEffect(() => {
    if (!map.current) return;

    const currentMap = map.current;

    // 1. 清除現有標記
    markers.current.forEach((m) => m.remove());
    markers.current = [];

    const isValidLngLat = (lng, lat) => {
      return (
        typeof lng === "number" &&
        typeof lat === "number" &&
        !isNaN(lng) &&
        !isNaN(lat) &&
        lng >= -180 &&
        lng <= 180 &&
        lat >= -90 &&
        lat <= 90
      );
    };

    // 2. 準備邊界計算
    const bounds = new maplibregl.LngLatBounds();
    let hasPoints = false;

    // 3. 繪製活動標記
    validEvents.forEach((event, idx) => {
      if (!isValidLngLat(event.lon, event.lat)) return;
      const el = document.createElement("div");
      el.className = "custom-numbered-marker";
      el.innerHTML = `
        <div style="position: relative; width: 32px; height: 32px;">
          <div style="position: absolute; inset: 0; background: ${isDarkMode ? "linear-gradient(135deg, #60a5fa 0%, #0ea5e9 100%)" : "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"}; border-radius: 50%; opacity: 0.2; transform: scale(1.5);"></div>
          <div style="position: relative; width: 100%; height: 100%; background: ${isDarkMode ? "linear-gradient(135deg, #60a5fa 0%, #0ea5e9 100%)" : "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"}; border: 3px solid white; border-radius: 50%; box-shadow: ${isDarkMode ? "0 0 16px rgba(96, 165, 250, 0.5), 0 3px 10px rgba(0, 0, 0, 0.4)" : "0 3px 10px rgba(0, 0, 0, 0.2)"}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 14px; font-family: sans-serif;">
            ${idx + 1}
          </div>
        </div>
      `;

      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: false,
        className: "custom-maplibre-popup",
      }).setHTML(`
          <div class="p-3 rounded-xl ${isDarkMode ? "bg-[#1a1a1a] text-neutral-200" : "bg-white text-stone-800"}">
            <div class="font-bold text-sm mb-1 flex items-center gap-2">
              <span class="flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold">${idx + 1}</span>
              ${event.time} ${event.title}
            </div>
            <div class="text-xs leading-snug ${isDarkMode ? "text-neutral-400" : "text-stone-500"}">${event.desc}</div>
          </div>
        `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([event.lon, event.lat])
        .setPopup(popup)
        .addTo(currentMap);

      markers.current.push(marker);
      bounds.extend([event.lon, event.lat]);
      hasPoints = true;
    });

    // 4. 繪製使用者位置
    if (isValidLngLat(userLocation?.lon, userLocation?.lat)) {
      const el = document.createElement("div");
      el.className = "custom-user-location-icon";
      el.innerHTML = `
        <div style="position: relative; width: 38px; height: 38px;">
          <div style="position: absolute; top: -10px; left: -10px; width: 58px; height: 58px; background-color: rgba(251, 146, 60, 0.3); border-radius: 50%; animation: orange-ping 2s infinite; z-index: -1;"></div>
          <div style="width: 38px; height: 38px; background: white; border: 3px solid #fb923c; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 0 15px rgba(251, 146, 60, 0.6);">${currentUser?.avatar || "👤"}</div>
        </div>
      `;
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([userLocation.lon, userLocation.lat])
        .addTo(currentMap);
      markers.current.push(marker);
      bounds.extend([userLocation.lon, userLocation.lat]);
      hasPoints = true;
    }

    // 5. 繪製其他使用者
    otherUsersLocations
      .filter((loc) => new Date() - new Date(loc.timestamp) < 86400000)
      .forEach((loc) => {
        if (!isValidLngLat(loc.lon, loc.lat)) return;
        const el = document.createElement("div");
        el.className = "custom-other-user-icon";
        el.innerHTML = `
          <div style="width: 38px; height: 38px; background: white; border: 2px solid #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">${loc.user?.avatar || "👤"}</div>
        `;
        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([loc.lon, loc.lat])
          .addTo(currentMap);
        markers.current.push(marker);
        bounds.extend([loc.lon, loc.lat]);
        hasPoints = true;
      });

    // 6. 路線圖層處理
    const updateRouteLayer = () => {
      const sourceId = "route-source";
      if (currentMap.getSource(sourceId)) {
        currentMap.getSource(sourceId).setData({
          type: "Feature",
          geometry: { type: "LineString", coordinates: routeCoords },
        });
      } else {
        currentMap.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: { type: "LineString", coordinates: routeCoords },
          },
        });

        currentMap.addLayer({
          id: "route-layer-glow",
          type: "line",
          source: sourceId,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": isDarkMode ? "#00d4ff" : "#3b82f6",
            "line-width": 8,
            "line-opacity": 0.3,
          },
        });

        currentMap.addLayer({
          id: "route-layer",
          type: "line",
          source: sourceId,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": isDarkMode ? "#00d4ff" : "#3b82f6",
            "line-width": 4,
          },
        });
      }

      routeCoords.forEach((pt) => bounds.extend(pt));
      if (routeCoords.length > 0) hasPoints = true;
    };

    if (currentMap.isStyleLoaded()) {
      updateRouteLayer();
    } else {
      currentMap.once("style.load", updateRouteLayer);
    }

    // 7. 適應視野
    if (hasPoints) {
      currentMap.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
        duration: 1000,
      });
    }
  }, [
    validEvents,
    userLocation,
    routeCoords,
    otherUsersLocations,
    isDarkMode,
    currentUser?.avatar,
  ]);

  return (
    <div
      className={`relative w-full h-64 rounded-[2rem] overflow-hidden border z-0 group transition-all duration-300
      ${
        isDarkMode
          ? "border-neutral-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.3)] bg-[#1a1a1a]"
          : "border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-[#fdfdfd]"
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
          setShowHint(false);
        }}
        className={`absolute top-4 right-4 z-[10] flex items-center gap-1.5 px-4 py-2 rounded-full backdrop-blur-md shadow-lg border transition-all duration-300 active:scale-95
          ${
            isDarkMode
              ? "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
              : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
          }
        `}
      >
        <Unlock className="w-3.5 h-3.5" />
        <span className="text-[11px] font-black tracking-wider uppercase">
          開啟互動地圖
        </span>
      </button>

      {isRouteLoading && (
        <div className="absolute top-4 left-4 z-[10] bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-2">
          <Loader2 className="w-3 h-3 animate-spin" />
          計算路線中...
        </div>
      )}

      <div
        className="absolute inset-0 z-[5] flex items-center justify-center bg-transparent cursor-pointer"
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={() => setShowHint(true)}
        onMouseLeave={() => setShowHint(false)}
      >
        {showHint && (
          <div className="bg-black/80 text-white px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md shadow-2xl border border-white/10">
            🔍 點擊開啟互動地圖
          </div>
        )}
      </div>

      <div ref={mapContainer} style={{ height: "100%", width: "100%" }} />

      <style jsx global>{`
        @keyframes orange-ping {
          75%,
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
        .custom-maplibre-popup .maplibregl-popup-content {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .custom-maplibre-popup .maplibregl-popup-tip {
          display: none !important;
        }
      `}</style>

      {createPortal(
        <MapModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isDarkMode={isDarkMode}
          events={events}
          userLocation={userLocation}
          routeCoords={routeCoords}
          theme={theme}
          otherUsersLocations={otherUsersLocations}
          currentUser={currentUser}
          MAPTILER_KEY={MAPTILER_KEY}
        />,
        document.body,
      )}
    </div>
  );
};

export default DayMap;
