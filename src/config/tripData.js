import * as source from "@trip-data-source";

const requiredArrayExports = [
  "itineraryData",
  "guidesData",
  "usefulLinks",
  "shopGuideData",
  "checklistData",
];

const errors = [];

for (const exportName of requiredArrayExports) {
  if (!Array.isArray(source[exportName])) {
    errors.push(`${exportName} 必須是陣列`);
  }
}

const rawConfig = source.tripConfig;
if (!rawConfig || typeof rawConfig !== "object") {
  errors.push("tripConfig 必須是物件");
}

const requiredConfigPaths = [
  ["title"],
  ["timeZone"],
  ["startDate"],
  ["endDate"],
  ["currency", "code"],
  ["currency", "source"],
  ["currency", "target"],
  ["language", "code"],
  ["language", "name"],
  ["meta", "title"],
  ["meta", "description"],
];

const readPath = (object, path) =>
  path.reduce((value, key) => value?.[key], object);

for (const path of requiredConfigPaths) {
  if (!readPath(rawConfig, path)) {
    errors.push(`tripConfig.${path.join(".")} 不可為空`);
  }
}

if (!Array.isArray(rawConfig?.locations) || rawConfig.locations.length === 0) {
  errors.push("tripConfig.locations 至少需要一個地點");
}

const requiredComponentStyles = [
  "itineraryCard",
  "navButton",
  "navContainer",
  "chatUserBubble",
  "chatModelBubble",
  "chatContainer",
  "infoCard",
  "tagBase",
  "inputField",
  "buttonPrimary",
  "buttonSecondary",
  "modalBackdrop",
  "modalContent",
  "divider",
  "cardHover",
  "loadingOverlay",
  "toastSuccess",
  "toastWarning",
  "toastError",
  "mainBackground",
  "pageContainer",
];

for (const styleName of requiredComponentStyles) {
  const style = rawConfig?.theme?.componentStyles?.[styleName];
  if (!style?.light || !style?.dark) {
    errors.push(
      `tripConfig.theme.componentStyles.${styleName} 需要 light 與 dark`,
    );
  }
}

const locationKeys = new Set();
for (const [index, location] of (rawConfig?.locations || []).entries()) {
  if (!location?.key || !location?.name) {
    errors.push(`tripConfig.locations[${index}] 缺少 key 或 name`);
  }
  if (!Number.isFinite(location?.lat) || !Number.isFinite(location?.lon)) {
    errors.push(`tripConfig.locations[${index}] 的座標必須是數字`);
  }
  if (locationKeys.has(location?.key)) {
    errors.push(`tripConfig.locations 的 key 重複：${location.key}`);
  }
  locationKeys.add(location?.key);
}

for (const [index, day] of (source.itineraryData || []).entries()) {
  if (!day?.date || !Array.isArray(day?.events)) {
    errors.push(`itineraryData[${index}] 缺少 date 或 events`);
  }
  if (day?.locationKey && !locationKeys.has(day.locationKey)) {
    errors.push(
      `itineraryData[${index}].locationKey 找不到對應地點：${day.locationKey}`,
    );
  }
}

if (errors.length > 0) {
  throw new Error(`旅程資料驗證失敗：\n- ${errors.join("\n- ")}`);
}

const activeTripId =
  import.meta.env.VITE_TRIP_ID || rawConfig.id || "default-trip";

export const tripConfig = Object.freeze({
  ...rawConfig,
  id: activeTripId,
  currency: Object.freeze({
    ...rawConfig.currency,
    code: rawConfig.currency.code.toLowerCase(),
    source: rawConfig.currency.source.toUpperCase(),
    target: rawConfig.currency.target.toUpperCase(),
  }),
  meta: Object.freeze({
    ...rawConfig.meta,
    shortName: rawConfig.meta.shortName || rawConfig.meta.title.slice(0, 12),
  }),
});

export const itineraryData = source.itineraryData;
export const guidesData = source.guidesData;
export const usefulLinks = source.usefulLinks;
export const shopGuideData = source.shopGuideData;
export const checklistData = source.checklistData;
