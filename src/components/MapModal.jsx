import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { X, RotateCcw, LocateFixed } from "lucide-react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// 輔助函式：計算相對時間
const getRelativeTime = (timestamp) => {
  if (!timestamp) return "未知時間";
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return "剛剛";
  if (diffMins < 60) return `${diffMins} 分鐘前`;
  if (diffHours < 24) return `${diffHours} 小時前`;
  return "超過 24 小時";
};

/**
 * MapModal Component with MapLibre GL JS
 */
const MapModal = ({
  isOpen,
  onClose,
  isDarkMode,
  events,
  userLocation,
  routeCoords,
  theme,
  otherUsersLocations = [],
  currentUser,
  MAPTILER_KEY,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  const mapStyle = isDarkMode
    ? `https://api.maptiler.com/maps/ch-swisstopo-lbm-dark/style.json?key=${MAPTILER_KEY}`
    : `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

  const validEvents = useMemo(
    () => events.filter((e) => e.lat && e.lon),
    [events],
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  const resetView = useCallback(() => {
    if (!map.current) return;
    const bounds = new maplibregl.LngLatBounds();
    let hasPoints = false;

    validEvents.forEach((e) => {
      if (isValidLngLat(e.lon, e.lat)) {
        bounds.extend([e.lon, e.lat]);
        hasPoints = true;
      }
    });

    if (isValidLngLat(userLocation?.lon, userLocation?.lat)) {
      bounds.extend([userLocation.lon, userLocation.lat]);
      hasPoints = true;
    }

    routeCoords.forEach((pt) => {
      if (isValidLngLat(pt[1], pt[0])) {
        bounds.extend([pt[1], pt[0]]);
        hasPoints = true;
      }
    });

    // Include other users' locations for bounds calculation
    otherUsersLocations
      .filter((loc) => new Date() - new Date(loc.timestamp) < 86400000)
      .forEach((loc) => {
        if (isValidLngLat(loc.lon, loc.lat)) {
          bounds.extend([loc.lon, loc.lat]);
          hasPoints = true;
        }
      });

    if (hasPoints && !bounds.isEmpty()) {
      map.current.fitBounds(bounds, { padding: 50, duration: 1000 });
    }
  }, [validEvents, userLocation, routeCoords, otherUsersLocations]);

  const centerOnUser = useCallback(() => {
    if (!map.current || !userLocation?.lat || !userLocation?.lon) return;
    map.current.flyTo({
      center: [userLocation.lon, userLocation.lat],
      zoom: 15,
      duration: 1500,
    });
  }, [userLocation]);

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
          // We want Traditional Chinese primarily, and the original name below it
          // MapTiler streets style often uses {name:latin} or {name}
          // We can use a coalescing expression: [coalesce, [get, 'name:zh-Hant'], [get, 'name:zh'], [get, 'name']]
          // And for the secondary label, we use the original name
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
    if (!isOpen || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center:
        validEvents.length > 0
          ? [validEvents[0].lon, validEvents[0].lat]
          : [139.6917, 35.6895],
      zoom: 13,
      attributionControl: false,
    });

    map.current.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right",
    );
    map.current.addControl(new maplibregl.NavigationControl(), "top-left");

    map.current.on("load", () => {
      setMapLanguage(map.current);
      resetView();
    });

    map.current.on("styledata", () => {
      setMapLanguage(map.current);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isOpen, mapStyle, validEvents, resetView, setMapLanguage]);

  // 切換主題
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle);
    }
  }, [isDarkMode, mapStyle]);

  // 更新內容
  useEffect(() => {
    if (!map.current || !isOpen) return;
    const currentMap = map.current;

    // Clear existing markers
    markers.current.forEach((m) => m.remove());
    markers.current = [];

    // Add event markers
    validEvents.forEach((event, idx) => {
      const el = document.createElement("div");
      el.className = "custom-numbered-marker";
      el.innerHTML = `
        <div style="width: 32px; height: 32px; background: ${isDarkMode ? "linear-gradient(135deg, #60a5fa 0%, #0ea5e9 100%)" : "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"}; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; box-shadow: 0 3px 10px rgba(0,0,0,0.2);">${idx + 1}</div>
      `;
      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: false,
        className: "custom-maplibre-popup",
      }).setHTML(`
          <div class="p-4 rounded-2xl ${isDarkMode ? "bg-[#1a1a1a]/95 border border-neutral-700 text-neutral-200" : "bg-white/95 border border-stone-100 text-stone-800"}">
            <div class="font-bold text-base mb-2 flex items-center gap-2">
              <span class="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold">${idx + 1}</span>
              ${event.time} ${event.title}
            </div>
            <div class="text-sm leading-relaxed">${event.desc}</div>
          </div>
        `);
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([event.lon, event.lat])
        .setPopup(popup)
        .addTo(currentMap);
      markers.current.push(marker);
    });

    // Add user location marker
    if (userLocation?.lat && userLocation?.lon) {
      const el = document.createElement("div");
      el.className = "custom-user-location-icon";
      el.innerHTML = `
        <div style="position: relative; width: 42px; height: 42px;">
          <!-- Orange Glow & Ping -->
          <div style="
            position: absolute;
            top: -12px;
            left: -12px;
            width: 66px;
            height: 66px;
            background-color: rgba(251, 146, 60, 0.34);
            border-radius: 50%;
            animation: orange-ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite;
            z-index: -1;
          "></div>
          <div style="
            position: absolute;
            top: -6px;
            left: -6px;
            width: 54px;
            height: 54px;
            background-color: rgba(251, 146, 60, 0.45);
            border-radius: 50%;
            filter: blur(10px);
            z-index: -1;
          "></div>
          
          <!-- Avatar with Orange Frame -->
          <div style="
            width: 42px;
            height: 42px;
            background: white;
            border: 4px solid #fb923c;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 0 20px rgba(251, 146, 60, 0.7), 0 5px 15px rgba(0,0,0,0.4);
            z-index: 10;
          ">
            ${currentUser?.avatar || "👤"}
          </div>
        </div>
        <style>
          @keyframes orange-ping {
            75%, 100% { transform: scale(1.9); opacity: 0; }
          }
        </style>
      `;
      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: false,
        className: "custom-maplibre-popup",
      }).setHTML(`
          <div class="p-2 px-4 rounded-full bg-emerald-500 shadow-lg -m-[13px] -mb-[14px]">
            <div class="font-bold text-xs text-white text-center whitespace-nowrap">
              您的位置
            </div>
          </div>
        `);
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([userLocation.lon, userLocation.lat])
        .setPopup(popup)
        .addTo(currentMap);
      markers.current.push(marker);
    }

    // Add other users' location markers
    otherUsersLocations
      .filter((loc) => new Date() - new Date(loc.timestamp) < 86400000)
      .forEach((loc) => {
        const el = document.createElement("div");
        el.className = "custom-other-user-icon";
        el.innerHTML = `
          <div style="
            position: relative;
            width: 42px;
            height: 42px;
            background: white;
            border: 3px solid #3b82f6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          ">
            ${loc.user?.avatar || "👤"}
          </div>
        `;
        const popup = new maplibregl.Popup({
          offset: 25,
          closeButton: false,
          className: "custom-maplibre-popup",
        }).setHTML(`
            <div class="p-4 rounded-2xl shadow-xl border backdrop-blur-md -m-[13px] -mb-[14px] min-w-[150px] ${
              isDarkMode
                ? "bg-[#1a1a1a]/95 border-neutral-700 text-neutral-200"
                : "bg-white/95 border-stone-100 text-stone-800"
            }">
              <div class="font-bold text-base mb-2 flex items-center gap-2">
                <span class="text-xl">
                  ${loc.user?.avatar || "👤"}
                </span>
                ${loc.user?.name}
              </div>
              <div
                class="text-xs font-bold ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }"
              >
                🕙 ${getRelativeTime(loc.timestamp)}
              </div>
              ${loc.device ? `<div class="text-[10px] mt-0.5 ${isDarkMode ? "text-neutral-500" : "text-stone-400"}">📱 ${loc.device}</div>` : ""}
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lon}"
                class="mt-2.5 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  isDarkMode
                    ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }"
                onclick="event.stopPropagation()"
              >
                🧭 導航至此
              </a>
            </div>
          `);
        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([loc.lon, loc.lat])
          .setPopup(popup)
          .addTo(currentMap);
        markers.current.push(marker);
      });

    // Add/update route polyline
    const updateLayer = () => {
      if (!currentMap.isStyleLoaded()) {
        currentMap.once("style.load", updateLayer);
        return;
      }
      const geojsonRoute = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: routeCoords.map((coord) => [coord[1], coord[0]]), // MapLibre expects [lon, lat]
        },
      };

      if (currentMap.getSource("route")) {
        currentMap.getSource("route").setData(geojsonRoute);
      } else {
        currentMap.addSource("route", { type: "geojson", data: geojsonRoute });
        currentMap.addLayer({
          id: "route-glow",
          type: "line",
          source: "route",
          paint: {
            "line-color": isDarkMode ? "#00d4ff" : "#3b82f6",
            "line-width": 10,
            "line-opacity": 0.3,
            "line-cap": "round",
            "line-join": "round",
          },
        });
        currentMap.addLayer({
          id: "route-main",
          type: "line",
          source: "route",
          paint: {
            "line-color": isDarkMode ? "#00d4ff" : "#3b82f6",
            "line-width": isDarkMode ? 6 : 5,
            "line-opacity": isDarkMode ? 1 : 0.9,
            "line-cap": "round",
            "line-join": "round",
          },
        });
      }
    };

    updateLayer();
  }, [
    isOpen,
    validEvents,
    userLocation,
    routeCoords,
    otherUsersLocations,
    isDarkMode,
    currentUser,
    resetView,
  ]);

  const glassClass = isDarkMode
    ? theme?.glassColors?.card?.dark ||
      "bg-[#262626]/85 backdrop-blur-[24px] border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
    : theme?.glassColors?.card?.light ||
      "bg-white/95 backdrop-blur-[24px] border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]";

  const textClass = isDarkMode
    ? theme?.textColors?.dark || "text-stone-100"
    : theme?.textColors?.light || "text-stone-800";
  const textSecClass = isDarkMode
    ? theme?.textColors?.secDark || "text-stone-300"
    : theme?.textColors?.secLight || "text-stone-500";

  const visibilityClass = isOpen
    ? "opacity-100 pointer-events-auto scale-100"
    : "opacity-0 pointer-events-none scale-95 delay-150";

  return (
    <div
      className={`fixed inset-0 z-[5000] flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-in-out ${visibilityClass}`}
      style={{ visibility: isOpen ? "visible" : "hidden" }}
      onTouchStart={(e) => {
        if (e.target === e.currentTarget) e.stopPropagation();
      }}
      onTouchMove={(e) => {
        if (!e.target.closest(".maplibregl-canvas")) {
          e.stopPropagation();
        }
      }}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-4xl h-[85vh] rounded-[32px] overflow-hidden border shadow-2xl flex flex-col animate-modal-in ${glassClass}`}
      >
        <div
          className={`flex items-center justify-between p-6 border-b ${isDarkMode ? "border-white/5 bg-white/5" : "border-stone-200/50 bg-stone-50/50"}`}
        >
          <div className="flex flex-col">
            <span
              className={`text-[10px] font-black tracking-[0.2em] uppercase mb-1 ${isDarkMode ? "text-neutral-500" : "text-stone-400"}`}
            >
              Interactive Map
            </span>
            <div className="flex items-center gap-2">
              <h2 className={`text-xl font-bold ${textClass}`}>當前路線導覽</h2>
              <div
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${isDarkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}
              >
                LIVE
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-all active:scale-90 ${isDarkMode ? "bg-white/10 hover:bg-white/20 text-white" : "bg-stone-200 hover:bg-stone-300 text-stone-600"}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 relative">
          <div ref={mapContainer} style={{ height: "100%", width: "100%" }} />
          <button
            onClick={resetView}
            className="absolute bottom-6 right-6 z-[10] p-3 rounded-2xl bg-white/90 dark:bg-neutral-800/90 shadow-xl border border-stone-200 dark:border-neutral-700 text-stone-600 dark:text-neutral-300 hover:scale-110 active:scale-95 transition-all"
            title="重置視野"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={centerOnUser}
            className={`absolute bottom-[104px] right-6 z-[10] p-3 rounded-2xl bg-white/90 dark:bg-neutral-800/90 shadow-xl border border-stone-200 dark:border-neutral-700 hover:scale-110 active:scale-95 transition-all ${userLocation?.lat && userLocation?.lon ? "text-blue-500" : "text-stone-400 opacity-50 cursor-not-allowed"}`}
            title="回到目前位置"
          >
            <LocateFixed className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`p-5 border-t flex items-center ${isDarkMode ? "border-white/5 bg-white/5" : "border-stone-200/50 bg-stone-50/30"}`}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className={`text-xs font-medium ${textSecClass}`}>
              點擊標記查看詳細資訊
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-maplibre-popup .maplibregl-popup-content {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .custom-maplibre-popup .maplibregl-popup-tip {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default MapModal;
