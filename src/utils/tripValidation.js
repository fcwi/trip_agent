export const REQUIRED_TRIP_ARRAYS = [
  "itineraryData",
  "guidesData",
  "usefulLinks",
  "shopGuideData",
  "checklistData",
];

export const REQUIRED_COMPONENT_STYLES = [
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

const REQUIRED_CONFIG_PATHS = [
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

const hasValue = (value) =>
  typeof value === "string" ? value.trim().length > 0 : value != null;

const isValidTimeZone = (timeZone) => {
  if (!hasValue(timeZone)) return false;
  try {
    new Intl.DateTimeFormat("en", { timeZone }).format();
    return true;
  } catch {
    return false;
  }
};

const parseDate = (value) => {
  if (typeof value !== "string" || !value.trim()) return Number.NaN;
  return Date.parse(value);
};

export const validateTripData = (source) => {
  const errors = [];

  for (const exportName of REQUIRED_TRIP_ARRAYS) {
    if (!Array.isArray(source?.[exportName])) {
      errors.push(`${exportName} 必須是陣列`);
    }
  }

  const config = source?.tripConfig;
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    errors.push("tripConfig 必須是物件");
    return errors;
  }

  for (const path of REQUIRED_CONFIG_PATHS) {
    if (!hasValue(readPath(config, path))) {
      errors.push(`tripConfig.${path.join(".")} 不可為空`);
    }
  }

  if (!isValidTimeZone(config.timeZone)) {
    errors.push(`tripConfig.timeZone 不是有效的 IANA 時區：${config.timeZone || "(空白)"}`);
  }

  const startAt = parseDate(config.startDate);
  const endAt = parseDate(config.endDate);
  if (Number.isNaN(startAt)) {
    errors.push("tripConfig.startDate 必須是有效日期");
  }
  if (Number.isNaN(endAt)) {
    errors.push("tripConfig.endDate 必須是有效日期");
  }
  if (!Number.isNaN(startAt) && !Number.isNaN(endAt) && startAt > endAt) {
    errors.push("tripConfig.startDate 不可晚於 endDate");
  }

  for (const field of ["code", "source", "target"]) {
    const value = config.currency?.[field];
    if (hasValue(value) && !/^[a-z]{3}$/i.test(value)) {
      errors.push(`tripConfig.currency.${field} 必須是 3 碼幣別代碼`);
    }
  }

  for (const styleName of REQUIRED_COMPONENT_STYLES) {
    const style = config.theme?.componentStyles?.[styleName];
    if (!hasValue(style?.light) || !hasValue(style?.dark)) {
      errors.push(
        `tripConfig.theme.componentStyles.${styleName} 需要 light 與 dark`,
      );
    }
  }

  if (!Array.isArray(config.locations) || config.locations.length === 0) {
    errors.push("tripConfig.locations 至少需要一個地點");
  }

  const locationKeys = new Set();
  for (const [index, location] of (config.locations || []).entries()) {
    const path = `tripConfig.locations[${index}]`;
    if (!hasValue(location?.key) || !hasValue(location?.name)) {
      errors.push(`${path} 缺少 key 或 name`);
    }
    if (!Number.isFinite(location?.lat) || location.lat < -90 || location.lat > 90) {
      errors.push(`${path}.lat 必須是 -90 到 90 之間的數字`);
    }
    if (!Number.isFinite(location?.lon) || location.lon < -180 || location.lon > 180) {
      errors.push(`${path}.lon 必須是 -180 到 180 之間的數字`);
    }
    if (hasValue(location?.key) && locationKeys.has(location.key)) {
      errors.push(`tripConfig.locations 的 key 重複：${location.key}`);
    }
    if (hasValue(location?.key)) locationKeys.add(location.key);
  }

  const dayLabels = new Set();
  for (const [index, day] of (source.itineraryData || []).entries()) {
    const path = `itineraryData[${index}]`;
    if (!hasValue(day?.day)) errors.push(`${path}.day 不可為空`);
    if (!hasValue(day?.date)) errors.push(`${path}.date 不可為空`);
    if (!Array.isArray(day?.events)) errors.push(`${path}.events 必須是陣列`);
    if (hasValue(day?.day) && dayLabels.has(day.day)) {
      errors.push(`itineraryData 的 day 重複：${day.day}`);
    }
    if (hasValue(day?.day)) dayLabels.add(day.day);
    if (day?.locationKey && !locationKeys.has(day.locationKey)) {
      errors.push(`${path}.locationKey 找不到對應地點：${day.locationKey}`);
    }

    for (const [eventIndex, event] of (day?.events || []).entries()) {
      if (!hasValue(event?.title)) {
        errors.push(`${path}.events[${eventIndex}].title 不可為空`);
      }
      if (!hasValue(event?.time)) {
        errors.push(`${path}.events[${eventIndex}].time 不可為空`);
      }
    }
  }

  return errors;
};

export const assertTripData = (source) => {
  const errors = validateTripData(source);
  if (errors.length > 0) {
    throw new Error(`旅程資料驗證失敗：\n- ${errors.join("\n- ")}`);
  }
  return source;
};
