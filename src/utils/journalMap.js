import { isValidLngLat } from "./mapHelpers.js";

// Preserve road refs, shields and composite labels supplied by the basemap.
export function isPlaceNameLayer(layer) {
  if (layer.type !== "symbol") return false;
  const field = layer.layout?.["text-field"];
  let hasName = false;
  let hasOtherContent = false;
  const inspect = (value) => {
    if (typeof value === "string") {
      for (const match of value.matchAll(/\{([^}]+)\}/g)) {
        if (/^name(?::|_|$)/.test(match[1])) hasName = true;
        else hasOtherContent = true;
      }
    } else if (Array.isArray(value)) {
      if (value[0] === "literal") return;
      if (value[0] === "image") hasOtherContent = true;
      if (value[0] === "get") {
        if (typeof value[1] === "string" && /^name(?::|_|$)/.test(value[1]))
          hasName = true;
        else hasOtherContent = true;
      }
      value.slice(1).forEach(inspect);
    }
  };
  inspect(field);
  return hasName && !hasOtherContent;
}

// Flight events mark departure coordinates: keep the drive to the airport,
// then start a new road segment at the next stop instead of routing overseas.
export function getRoadRouteSegments(events = []) {
  const segments = [];
  let current = [];
  const finish = () => {
    if (current.length > 1) segments.push(current);
    current = [];
  };
  for (const event of events) {
    if (event.roadRouteBreakBefore) finish();
    if (isValidLngLat(event.lon, event.lat)) {
      const previous = current.at(-1);
      if (!previous || previous[0] !== event.lon || previous[1] !== event.lat)
        current.push([event.lon, event.lat]);
    }
    if (
      event.roadRouteBreakAfter ||
      /飛機|航班|flight|airplane/i.test(event.transport?.mode || "")
    )
      finish();
  }
  finish();
  return segments;
}

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

export const MAP_FAILURE_MESSAGES = {
  unauthorized: [
    "地圖服務拒絕存取（401）",
    "地圖金鑰可能已失效，請通知行程管理者。",
  ],
  forbidden: [
    "地圖服務拒絕存取（403）",
    "此網站目前無法使用地圖服務，請通知行程管理者確認授權。",
  ],
  quota: [
    "地圖服務已達使用限制（429）",
    "請稍後重試，或使用 Google Maps 查看地點。",
  ],
  missingStyle: ["地圖樣式無法取得（404）", "請通知行程管理者確認地圖設定。"],
  timeout: ["地圖連線逾時", "請確認網路後重試，或使用 Google Maps 查看地點。"],
  engine: ["地圖元件無法下載", "請確認網路後重試，或更新網站再開啟。"],
  graphics: [
    "瀏覽器無法顯示互動地圖",
    "請重新開啟瀏覽器，或使用 Google Maps 查看地點。",
  ],
};

// Only expose a fixed category; renderer errors can contain URLs with API keys.
export function classifyMapFailure(error) {
  const status = Number(error?.status);
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 429) return "quota";
  if (status === 404) return "missingStyle";
  const message = String(error?.message || "");
  if (/WebGL|GL context|context creation/i.test(message)) return "graphics";
  if (message === "地圖引擎暫時無法載入") return "engine";
  return "unknown";
}

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
