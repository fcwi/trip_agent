import { isValidLngLat } from "./mapHelpers.js";

export const MAP_MESSAGES = {
  loading: ["地圖載入中", "網路較慢時需要一些時間，仍可使用下方地點連結。"],
  empty: ["這一天尚未提供地點座標", "可從地點清單開啟 Google Maps 搜尋。"],
  unconfigured: ["互動地圖尚未設定", "可先使用 Google Maps 查看地點與路線。"],
  offline: [
    "目前離線，無法載入地圖",
    "行程文字仍可閱讀，恢復連線後會重新載入。",
  ],
  error: ["地圖暫時無法載入", "請重試，或使用 Google Maps 查看地點。"],
};

export function getMapPoints(
  events = [],
  route = [],
  userLocation,
  others = [],
) {
  const points = events.map((event) => [event.lon, event.lat]);
  points.push(...route);
  if (userLocation) points.push([userLocation.lon, userLocation.lat]);
  points.push(...others.map((location) => [location.lon, location.lat]));
  return points.filter(
    (point) => Array.isArray(point) && isValidLngLat(point[0], point[1]),
  );
}

export function eventMapUrl(event) {
  const query =
    event.mapQuery ||
    (isValidLngLat(event.lon, event.lat)
      ? `${event.lat},${event.lon}`
      : event.title);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || "")}`;
}
