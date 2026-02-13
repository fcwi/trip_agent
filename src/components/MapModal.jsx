import React, { useEffect, useRef, useMemo } from "react";
import { X, RotateCcw } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
 * MapController for Modal
 */
const ModalMapController = ({
  events,
  userLocation,
  routeCoords,
  otherUsersLocations = [],
}) => {
  const map = useMap();
  const hasInitializedRef = useRef(false);

  // 使用 Ref 儲存最新的重置邏輯，避免 useEffect 因依賴項變動而頻繁重跑計時器
  const resetView = () => {
    const points = [];
    events.forEach((e) => {
      if (e.lat && e.lon) points.push([e.lat, e.lon]);
    });
    if (routeCoords && routeCoords.length > 0) {
      // 抽樣點以優化效能
      routeCoords
        .filter((_, i) => i % 10 === 0)
        .forEach((pt) => points.push(pt));
    }
    if (userLocation && userLocation.lat && userLocation.lon) {
      points.push([userLocation.lat, userLocation.lon]);
    }

    // 納入其他使用者位置 (僅 24 小時內)
    otherUsersLocations
      .filter((loc) => new Date() - new Date(loc.timestamp) < 86400000)
      .forEach((loc) => {
        if (loc.lat && loc.lon) points.push([loc.lat, loc.lon]);
      });

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  };

  useEffect(() => {
    // 處理 Android/行動裝置地圖圖資未即時更新的問題
    // 透過多次呼叫 invalidateSize 確保在各種動畫階段都能正確計算容器大小
    const timers = [
      setTimeout(() => map.invalidateSize(), 100),
      setTimeout(() => map.invalidateSize(), 500),
      setTimeout(() => {
        map.invalidateSize();
        // 僅在首次載入時自動重置視野
        if (!hasInitializedRef.current) {
          resetView();
          hasInitializedRef.current = true;
        }
      }, 1000),
    ];

    return () => timers.forEach((t) => clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]); // 僅依賴 map 實例

  return (
    <button
      onClick={resetView}
      className="absolute bottom-6 right-6 z-[1000] p-3 rounded-2xl bg-white/90 dark:bg-neutral-800/90 shadow-xl border border-stone-200 dark:border-neutral-700 text-stone-600 dark:text-neutral-300 hover:scale-110 active:scale-95 transition-all"
      title="重置視野"
    >
      <RotateCcw className="w-5 h-5" />
    </button>
  );
};

/**
 * MapModal Component
 *
 * A full-screen interactive map modal for detailed route exploration.
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
}) => {
  // 1. 鎖定初始中心點與縮放，避免 React 重繪時因 props 變動導致地圖「彈回」
  // 我們只在彈窗開啟時計算一次，之後在地圖生命週期內保持不變
  const initialConfig = useMemo(() => {
    const valid = events.filter((e) => e.lat && e.lon);
    return {
      center:
        valid.length > 0 ? [valid[0].lat, valid[0].lon] : [35.6895, 139.6917],
      zoom: 13,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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

  // 移除條件返回 null，改用 CSS 控制顯示隱藏，以保留地圖實例 (Keep Alive)
  // if (!isOpen) return null;

  // 使用 OSM 標準圖磚（支援中文標籤、景點名稱等豐富資訊）
  const tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  // 使用主題設定或回退預設值 - 統一與主卡片樣式
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

  // Custom Icons
  const createNumberedIcon = (number, isDark) => {
    return new L.DivIcon({
      className: "custom-numbered-marker",
      html: `
        <div style="
          position: relative;
          width: 32px;
          height: 32px;
          background: ${isDark ? "linear-gradient(135deg, #60a5fa 0%, #0ea5e9 100%)" : "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
          box-shadow: ${isDark ? "0 0 16px rgba(96, 165, 250, 0.5), 0 3px 10px rgba(0, 0, 0, 0.4)" : "0 3px 10px rgba(0, 0, 0, 0.2)"};
        ">
          ${number + 1}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  };

  const createUserLocationIcon = (avatar) => {
    return new L.DivIcon({
      className: "custom-user-location-icon",
      html: `
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
            ${avatar || "👤"}
          </div>
        </div>
        <style>
          @keyframes orange-ping {
            75%, 100% { transform: scale(1.9); opacity: 0; }
          }
        </style>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 21],
      popupAnchor: [0, -22],
    });
  };

  const createOtherUserIcon = (avatar) => {
    return new L.DivIcon({
      className: "custom-other-user-icon",
      html: `
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
          ${avatar || "👤"}
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 21],
      popupAnchor: [0, -22],
    });
  };

  // 🚀 效能優化：使用 CSS 隱藏而非卸載組件，避免 Leaflet 重複初始化
  const visibilityClass = isOpen
    ? "opacity-100 pointer-events-auto scale-100"
    : "opacity-0 pointer-events-none scale-95 delay-150"; // 延遲隱藏以等待動畫結束

  return (
    <div
      className={`fixed inset-0 z-[5000] flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-in-out ${visibilityClass}`}
      // 注意：這層 wrapper 始終存在，所以必須管理 pointer-events
      style={{ visibility: isOpen ? "visible" : "hidden" }} // 雙重保險，確保隱藏時不可見不可點
      onTouchStart={(e) => {
        if (e.target === e.currentTarget) e.stopPropagation();
      }}
      onTouchMove={(e) => {
        if (!e.target.closest(".leaflet-container")) {
          e.stopPropagation();
        }
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-4xl h-[85vh] rounded-[32px] overflow-hidden border shadow-2xl flex flex-col animate-modal-in ${glassClass}`}
      >
        {/* Header (Calculator Style) */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDarkMode
              ? "border-white/5 bg-white/5"
              : "border-stone-200/50 bg-stone-50/50"
          }`}
          onTouchStart={(e) => e.stopPropagation()}
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
            className={`p-2 rounded-full transition-all active:scale-90 ${
              isDarkMode
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-stone-200 hover:bg-stone-300 text-stone-600"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            center={initialConfig.center}
            zoom={initialConfig.zoom}
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
            dragging={true}
            touchZoom={true}
            preferCanvas={true}
            bounceAtZoomLimits={false}
          >
            <TileLayer
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
              url={tileLayerUrl}
              updateWhenIdle={false}
              keepBuffer={3}
            />

            <ModalMapController
              events={validEvents}
              userLocation={userLocation}
              routeCoords={routeCoords}
              otherUsersLocations={otherUsersLocations}
            />

            {/* Route Polyline */}
            {routeCoords && routeCoords.length > 0 && (
              <>
                <Polyline
                  positions={routeCoords}
                  pathOptions={{
                    color: isDarkMode ? "rgba(0, 0, 0, 0.4)" : "white",
                    weight: 10,
                    opacity: 0.6,
                  }}
                />
                <Polyline
                  positions={routeCoords}
                  pathOptions={{
                    color: isDarkMode ? "#00d4ff" : "#3b82f6",
                    weight: isDarkMode ? 6 : 5,
                    opacity: isDarkMode ? 1 : 0.9,
                    lineCap: "round",
                    lineJoin: "round",
                  }}
                />
                {isDarkMode && (
                  <Polyline
                    positions={routeCoords}
                    pathOptions={{
                      color: "#00d4ff",
                      weight: 6,
                      opacity: 0.3,
                      lineCap: "round",
                      lineJoin: "round",
                    }}
                  />
                )}
              </>
            )}

            {/* Event Markers */}
            {validEvents.map((event, idx) => (
              <Marker
                key={idx}
                position={[event.lat, event.lon]}
                icon={createNumberedIcon(idx, isDarkMode)}
              >
                <Popup className="custom-popup" closeButton={false}>
                  <div
                    className={`p-4 rounded-2xl shadow-xl border backdrop-blur-md -m-[13px] -mb-[14px] min-w-[200px] ${
                      isDarkMode
                        ? "bg-[#1a1a1a]/95 border-neutral-700 text-neutral-200"
                        : "bg-white/95 border-stone-100 text-stone-800"
                    }`}
                  >
                    <div className="font-bold text-base mb-2 flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      {event.time} {event.title}
                    </div>
                    <div className={`text-sm leading-relaxed ${textSecClass}`}>
                      {event.desc}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* User Location */}
            {userLocation && userLocation.lat && userLocation.lon && (
              <Marker
                position={[userLocation.lat, userLocation.lon]}
                icon={createUserLocationIcon(currentUser?.avatar)}
                zIndexOffset={1000}
              >
                <Popup closeButton={false} className="custom-popup">
                  <div className="p-2 px-4 rounded-full bg-emerald-500 shadow-lg -m-[13px] -mb-[14px]">
                    <div className="font-bold text-xs text-white text-center whitespace-nowrap">
                      您的位置
                    </div>
                  </div>
                </Popup>
                <Tooltip
                  permanent
                  interactive
                  direction="top"
                  offset={[0, -14]}
                  className="user-name-tooltip"
                  eventHandlers={{
                    click: (e) => {
                      e.target._source.openPopup();
                    },
                  }}
                >
                  {currentUser?.name || "我"}
                </Tooltip>
              </Marker>
            )}

            {/* 其他使用者位置 */}
            {otherUsersLocations
              .filter((loc) => {
                const diff = new Date() - new Date(loc.timestamp);
                return diff < 86400000;
              })
              .map((loc, idx) => (
                <Marker
                  key={`other-${idx}`}
                  position={[loc.lat, loc.lon]}
                  icon={createOtherUserIcon(loc.user?.avatar)}
                  zIndexOffset={500}
                >
                  <Tooltip
                    permanent
                    interactive
                    direction={["right", "left", "top", "bottom"][idx % 4]}
                    offset={
                      ["right", "left"].includes(
                        ["right", "left", "top", "bottom"][idx % 4],
                      )
                        ? [14, 0]
                        : ["top"].includes(
                              ["right", "left", "top", "bottom"][idx % 4],
                            )
                          ? [0, -14]
                          : [0, 14]
                    }
                    className="user-name-tooltip"
                    eventHandlers={{
                      click: (e) => {
                        e.target._source.openPopup();
                      },
                    }}
                  >
                    {loc.user?.name || "未知"}
                  </Tooltip>
                  <Popup closeButton={false} className="custom-popup">
                    <div
                      className={`p-4 rounded-2xl shadow-xl border backdrop-blur-md -m-[13px] -mb-[14px] min-w-[150px] ${
                        isDarkMode
                          ? "bg-[#1a1a1a]/95 border-neutral-700 text-neutral-200"
                          : "bg-white/95 border-stone-100 text-stone-800"
                      }`}
                    >
                      <div className="font-bold text-base mb-2 flex items-center gap-2">
                        <span className="text-xl">
                          {loc.user?.avatar || "👤"}
                        </span>
                        {loc.user?.name}
                      </div>
                      <div
                        className={`text-xs font-bold ${
                          isDarkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      >
                        🕙 {getRelativeTime(loc.timestamp)}
                      </div>
                      {loc.device && (
                        <div
                          className={`text-[10px] mt-0.5 ${
                            isDarkMode ? "text-neutral-500" : "text-stone-400"
                          }`}
                        >
                          📱 {loc.device}
                        </div>
                      )}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lon}`}
                        className={`mt-2.5 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                          isDarkMode
                            ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        🧭 導航至此
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>

        {/* Footer / Controls */}
        <div
          className={`p-5 border-t flex items-center ${
            isDarkMode
              ? "border-white/5 bg-white/5"
              : "border-stone-200/50 bg-stone-50/30"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full bg-emerald-500 animate-pulse`}
            />
            <div className={`text-xs font-medium ${textSecClass}`}>
              點擊標記查看詳細資訊
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }
        .custom-popup .leaflet-popup-tip {
          display: none !important;
        }
        .user-name-tooltip {
          background: rgba(0, 0, 0, 0.7) !important;
          border: none !important;
          border-radius: 8px !important;
          color: white !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          padding: 3px 10px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
          white-space: nowrap !important;
          cursor: pointer !important;
        }
        .user-name-tooltip::before {
          border-bottom-color: rgba(0, 0, 0, 0.7) !important;
        }
      `}</style>
    </div>
  );
};

export default MapModal;
