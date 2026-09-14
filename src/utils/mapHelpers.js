import { escapeHtml } from "./html.js";

export const isValidLngLat = (lng, lat) =>
  typeof lng === "number" &&
  typeof lat === "number" &&
  Number.isFinite(lng) &&
  Number.isFinite(lat) &&
  lng >= -180 &&
  lng <= 180 &&
  lat >= -90 &&
  lat <= 90;

/**
 * OSRM GeoJSON 與 MapLibre 都使用 [longitude, latitude]。
 * 直接過濾無效點，不要對調座標。
 */
export const toMapLibreRouteCoordinates = (osrmCoordinates = []) =>
  osrmCoordinates.filter(
    (coord) => Array.isArray(coord) && isValidLngLat(coord[0], coord[1]),
  );

export const buildEventPopupHtml = ({
  index,
  time,
  title,
  desc,
  isDarkMode,
  compact = false,
}) => {
  const heading = escapeHtml(`${time || ""} ${title || ""}`.trim());
  const description = escapeHtml(desc || "");
  const markerNumber = Number(index) + 1;
  const cardClass = compact
    ? `p-3 rounded-xl ${isDarkMode ? "bg-[#1a1a1a] text-neutral-200" : "bg-white text-stone-800"}`
    : `p-4 rounded-2xl ${
        isDarkMode
          ? "bg-[#1a1a1a]/95 border border-neutral-700 text-neutral-200"
          : "bg-white/95 border border-stone-100 text-stone-800"
      }`;
  const titleClass = compact
    ? "font-bold text-sm mb-1 flex items-center gap-2"
    : "font-bold text-base mb-2 flex items-center gap-2";
  const markerClass = compact
    ? "flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold"
    : "flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold";
  const descClass = compact
    ? `text-xs leading-snug ${isDarkMode ? "text-neutral-400" : "text-stone-500"}`
    : "text-sm leading-relaxed";

  return `
          <div class="${cardClass}">
            <div class="${titleClass}">
              <span class="${markerClass}">${markerNumber}</span>
              ${heading}
            </div>
            <div class="${descClass}">${description}</div>
          </div>
        `;
};

export const buildSharedLocationPopupHtml = ({
  name,
  avatar,
  device,
  relativeTime,
  lat,
  lon,
  isDarkMode,
}) => {
  const safeName = escapeHtml(name || "");
  const safeAvatar = escapeHtml(avatar || "👤");
  const safeDevice = device ? escapeHtml(device) : "";
  const safeRelativeTime = escapeHtml(relativeTime || "");
  const destination = isValidLngLat(lon, lat) ? `${lat},${lon}` : "";

  return `
            <div class="p-4 rounded-2xl shadow-xl border backdrop-blur-md -m-[13px] -mb-[14px] min-w-[150px] ${
              isDarkMode
                ? "bg-[#1a1a1a]/95 border-neutral-700 text-neutral-200"
                : "bg-white/95 border-stone-100 text-stone-800"
            }">
              <div class="font-bold text-base mb-2 flex items-center gap-2">
                <span class="text-xl">
                  ${safeAvatar}
                </span>
                ${safeName}
              </div>
              <div
                class="text-xs font-bold ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }"
              >
                🕙 ${safeRelativeTime}
              </div>
              ${
                safeDevice
                  ? `<div class="text-[10px] mt-0.5 ${isDarkMode ? "text-neutral-500" : "text-stone-400"}">📱 ${safeDevice}</div>`
                  : ""
              }
              ${
                destination
                  ? `<a
                href="https://www.google.com/maps/dir/?api=1&destination=${destination}"
                class="mt-2.5 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  isDarkMode
                    ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }"
                onclick="event.stopPropagation()"
              >
                🧭 導航至此
              </a>`
                  : ""
              }
            </div>
          `;
};
