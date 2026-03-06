import React, { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/**
 * MapPicker Component with MapLibre GL JS
 * An interactive map tool for selecting geographic coordinates.
 */
const MapPicker = ({
  latitude,
  longitude,
  onLocationChange,
  theme, // currentTheme object from App.jsx
  isDarkMode,
  maptilerKey,
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const isInternalUpdateRef = useRef(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 更新地圖語言 (繁體中文優先)
  const setMapLanguage = useCallback((map) => {
    if (!map) return;

    // 與 MapModal / DayMap 相同的語言邏輯
    const labelLayerIds = map
      .getStyle()
      .layers.filter((l) => l.layout && l.layout["text-field"])
      .map((l) => l.id);

    labelLayerIds.forEach((layerId) => {
      const isLocalChinese = [
        "any",
        ["==", ["get", "name"], ["get", "name:zh-Hant"]],
        ["==", ["get", "name"], ["get", "name:zh"]],
        ["==", ["get", "name"], ["get", "name:zh-Hans"]],
      ];

      const hasTranslation = [
        "any",
        ["has", "name:zh-Hant"],
        ["has", "name:zh-Hans"],
        ["has", "name:zh"],
        ["has", "name:en"],
      ];

      const showSecondary = ["all", hasTranslation, ["!", isLocalChinese]];

      map.setLayoutProperty(layerId, "text-field", [
        "format",
        [
          "coalesce",
          ["get", "name:zh-Hant"],
          ["get", "name:zh-Hans"],
          ["get", "name:zh"],
          ["get", "name:en"],
          ["get", "name"],
        ],
        {},
        ["case", showSecondary, "\n", ""],
        { "font-scale": 0.8 },
        ["case", showSecondary, ["coalesce", ["get", "name"], ""], ""],
        { "font-scale": 0.8 },
      ]);
    });
  }, []); // 不依賴 isDarkMode，因為我們在初始化和外部變化時會調用

  // 初始化地圖 (僅一次)
  useEffect(() => {
    if (!mapContainerRef.current || !maptilerKey || mapInstanceRef.current)
      return;

    const styleUrl = isDarkMode
      ? `https://api.maptiler.com/maps/ch-swisstopo-lbm-dark/style.json?key=${maptilerKey}`
      : `https://api.maptiler.com/maps/ch-swisstopo-lbm-light/style.json?key=${maptilerKey}`;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [longitude, latitude],
      zoom: 13,
      attributionControl: false,
    });

    map.on("load", () => {
      setMapLoaded(true);
      setMapLanguage(map);
    });

    map.on("style.load", () => {
      setMapLanguage(map);
    });

    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      isInternalUpdateRef.current = true;
      onLocationChange({ lat, lon: lng });
    });

    mapInstanceRef.current = map;

    // 清理
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maptilerKey]);

  // 監聽主題變化 (使用 setStyle 避免重新初始化)
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const styleUrl = isDarkMode
      ? `https://api.maptiler.com/maps/ch-swisstopo-lbm-dark/style.json?key=${maptilerKey}`
      : `https://api.maptiler.com/maps/ch-swisstopo-lbm-light/style.json?key=${maptilerKey}`;

    mapInstanceRef.current.setStyle(styleUrl);
  }, [isDarkMode, mapLoaded, maptilerKey]);

  // 監聽外部經緯度變化以同步標記
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    const map = mapInstanceRef.current;

    // 更新或創建標記
    if (markerRef.current) {
      markerRef.current.setLngLat([longitude, latitude]);
    } else {
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "32px";
      el.style.height = "32px";
      el.style.background = "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)";
      el.style.border = "3px solid white";
      el.style.borderRadius = "50%";
      el.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4)";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.color = "white";
      el.style.fontSize = "16px";
      el.innerHTML = "📍";

      markerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([longitude, latitude])
        .addTo(map);
    }

    // 如果不是內部更新，且位置變動較大，則移動視野
    if (!isInternalUpdateRef.current) {
      map.flyTo({
        center: [longitude, latitude],
        essential: true,
        duration: 1000,
      });
    }
    isInternalUpdateRef.current = false;
  }, [latitude, longitude, mapLoaded]);

  // 控制項處理
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleReset = () => {
    mapInstanceRef.current?.flyTo({
      center: [longitude, latitude],
      zoom: 13,
      essential: true,
    });
  };

  return (
    <div className="space-y-3">
      <h3 className={`text-sm font-bold flex items-center gap-2 ${theme.text}`}>
        <MapPin className="w-4 h-4" /> 互動式地圖選擇 (MapLibre)
      </h3>

      <div className="relative group isolate">
        <div
          ref={mapContainerRef}
          className={`w-full h-64 rounded-2xl border overflow-hidden transition-all duration-300 ${
            isDarkMode
              ? "border-neutral-700 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] bg-[#1a1a1a]"
              : "border-stone-200 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)] bg-[#fdfdfd]"
          }`}
          style={{ zIndex: 0 }}
        />

        {/* 控制按鈕 */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[10]">
          <div
            className={`flex flex-col rounded-xl border shadow-lg overflow-hidden backdrop-blur-md ${
              isDarkMode
                ? "bg-black/60 border-neutral-700/80"
                : "bg-white/80 border-stone-200/80"
            }`}
          >
            <button
              onClick={handleZoomIn}
              className={`p-2.5 transition-colors flex items-center justify-center border-b active:bg-black/10 ${
                isDarkMode
                  ? "hover:bg-neutral-700/80 text-white border-neutral-700/50"
                  : "hover:bg-stone-100/80 text-stone-700 border-stone-200/50"
              }`}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className={`p-2.5 transition-colors flex items-center justify-center active:bg-black/10 ${
                isDarkMode
                  ? "hover:bg-neutral-700/80 text-white"
                  : "hover:bg-stone-100/80 text-stone-700"
              }`}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleReset}
            className={`p-2.5 rounded-xl border shadow-lg transition-colors flex items-center justify-center backdrop-blur-md active:scale-95 ${
              isDarkMode
                ? "bg-black/60 border-neutral-700/80 hover:bg-neutral-700/80 text-white"
                : "bg-white/80 border-stone-200/80 hover:bg-stone-100/80 text-stone-700"
            }`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        className={`text-xs p-3 rounded-xl border flex justify-between items-center transition-colors ${
          isDarkMode
            ? "bg-neutral-900/50 border-neutral-700 text-neutral-300"
            : "bg-stone-50 border-stone-200 text-stone-600"
        }`}
      >
        <div className="flex flex-col gap-0.5">
          <div className={`font-bold ${theme.text}`}>選定的位置</div>
          <div className={`font-mono text-[10px] opacity-80`}>
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </div>
        </div>
        <div className="text-[10px] opacity-50 font-medium px-2 py-1 rounded bg-black/5 dark:bg-white/5">
          點擊地圖選擇
        </div>
      </div>
    </div>
  );
};

export default MapPicker;
