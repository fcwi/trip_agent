import {
  getDailyLocationKey,
  getWeatherData,
  getWeatherForecastIndex,
} from "./itineraryHelpers.js";

const RAIN_CODES = new Set([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99]);
const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86]);

/**
 * 依據高低溫、日夜溫差與天氣代碼產出實用的服裝穿搭建議。
 */
export function getClothingAdvice({
  maxTemp,
  minTemp,
  weatherCode,
  precipProb,
} = {}) {
  if (!Number.isFinite(maxTemp) || !Number.isFinite(minTemp)) {
    return "尚未取得預報，建議出發前再確認當地氣溫。";
  }

  const parts = [];
  if (SNOW_CODES.has(weatherCode) || minTemp <= 0) {
    parts.push("防風厚羽絨、發熱衣與保暖帽/手套，搭配防滑防水鞋靴");
  } else if (maxTemp <= 10) {
    parts.push("厚外套或羽絨衣搭配保暖內層，早晚注意防寒");
  } else if (maxTemp <= 17) {
    parts.push("長袖上衣搭配針織衫或防風外套，方便室內外穿脫");
  } else if (maxTemp <= 24) {
    parts.push("薄長袖或透氣上衣，早晚可備一件輕薄外套");
  } else {
    parts.push("透氣短袖與輕便服裝，注意防曬與補充水分");
  }

  const spread = maxTemp - minTemp;
  if (spread >= 8) {
    parts.push(`日夜溫差達 ${Math.round(spread)}°C，建議洋蔥式穿搭`);
  }

  if (RAIN_CODES.has(weatherCode) || (Number.isFinite(precipProb) && precipProb >= 50)) {
    parts.push("建議攜帶折疊傘或防水外套");
  }

  return `${parts.join("；")}。`;
}

/**
 * 取得指定天數的預報摘要（高溫在左、低溫在右）。
 */
export function getDayForecastSummary({
  dayIndex,
  itineraryData,
  tripConfig,
  weatherForecast,
  tripStatus,
  currentTripDayIndex,
  getWeatherInfo,
}) {
  const locationKey = getDailyLocationKey(dayIndex, itineraryData, tripConfig);
  const locationName =
    tripConfig?.locations?.find((loc) => loc.key === locationKey)?.name || "當地";
  const weatherData = weatherForecast?.[locationKey];

  if (
    weatherForecast?.loading ||
    !weatherData ||
    !Array.isArray(weatherData.time) ||
    weatherData.time.length === 0
  ) {
    return {
      hasForecast: false,
      locationKey,
      locationName,
      tempText: "--",
      maxTemp: null,
      minTemp: null,
      weatherCode: null,
      precipProb: null,
      desc: weatherForecast?.loading ? "載入中" : "尚無預報",
      icon: null,
      clothingAdvice: getClothingAdvice(),
    };
  }

  const rawIndex = getWeatherForecastIndex(
    dayIndex,
    tripStatus,
    currentTripDayIndex,
  );
  const maxIndex = weatherData.time.length - 1;
  const forecastIndex = Math.min(Math.max(0, rawIndex), maxIndex);

  const rawMax = weatherData.temperature_2m_max?.[forecastIndex];
  const rawMin = weatherData.temperature_2m_min?.[forecastIndex];
  const maxTemp = Number.isFinite(rawMax) ? Math.round(rawMax) : null;
  const minTemp = Number.isFinite(rawMin) ? Math.round(rawMin) : null;
  const weatherCode = weatherData.weathercode?.[forecastIndex];
  const precipProb = weatherData.precipitation_probability_max?.[forecastIndex];

  const info = getWeatherInfo
    ? getWeatherInfo(weatherCode)
    : { ...getWeatherData(weatherCode), icon: null };

  const tempText =
    maxTemp !== null && minTemp !== null ? `${maxTemp}° / ${minTemp}°` : "--";

  return {
    hasForecast: maxTemp !== null && minTemp !== null,
    locationKey,
    locationName,
    tempText,
    maxTemp,
    minTemp,
    weatherCode,
    precipProb: Number.isFinite(precipProb) ? Math.round(precipProb) : null,
    desc: info.text,
    icon: info.icon || null,
    clothingAdvice: getClothingAdvice({
      maxTemp,
      minTemp,
      weatherCode,
      precipProb,
    }),
  };
}

/**
 * 判斷單一行程站點是否需要顯示「出發前確認」或「要注意」小徽章。
 */
export function getEventAttentionBadge(event) {
  if (!event) return null;
  if (event.attention?.label) {
    return {
      kind: event.attention.kind === "notice" ? "notice" : "confirm",
      label: event.attention.label,
    };
  }
  if (event.locationPending || event.locationProvisional) {
    return { kind: "confirm", label: "出發前確認" };
  }
  const combined = [event.desc, ...(event.tips || []), ...(event.highlights || [])]
    .filter(Boolean)
    .join(" ");
  if (/(出發通知|提前預約|官網預約|搶票|事先確認|先預約|開放售票)/.test(combined)) {
    return { kind: "confirm", label: "出發前確認" };
  }
  if (/(注意|提早|不可|勿|限制|打烊|末班|查驗)/.test(combined)) {
    return { kind: "notice", label: "要注意" };
  }
  return null;
}

/**
 * 比對當日住宿與 tripConfig.hotels，取得電話與地址資訊。
 */
export function findDayHotelDetails(day, tripConfig) {
  const stay = String(day?.stay || "").trim();
  if (!stay || stay.includes("溫暖的家")) return null;

  const normalizedStay = stay.split("(")[0].trim().toLowerCase();
  const matched = (tripConfig?.hotels || []).find((hotel) => {
    const hotelName = String(hotel?.name || "").split("(")[0].trim().toLowerCase();
    return (
      hotelName &&
      (normalizedStay.includes(hotelName) || hotelName.includes(normalizedStay))
    );
  });

  const phone = matched?.phone || "";
  const validPhone = /^[+\d][\d\s()-]+$/.test(phone);
  const address = matched?.address || "";
  const mapQuery = day?.stayMapQuery || address || stay.split("(")[0].trim();

  return {
    name: stay,
    pending: Boolean(day?.stayPending),
    phone,
    telHref: validPhone ? `tel:${phone.replace(/[\s()-]/g, "")}` : null,
    address,
    checkIn: matched?.checkIn || day?.checkIn || "",
    checkOut: matched?.checkOut || day?.checkOut || "",
    mapQuery,
  };
}

export const NEARBY_SEARCH_CATEGORIES = [
  { id: "convenience", label: "便利商店", query: "便利商店" },
  { id: "drugstore", label: "藥妝店", query: "藥妝店" },
  { id: "restaurant", label: "餐廳", query: "餐廳" },
  { id: "cafe", label: "咖啡廳", query: "咖啡廳" },
  { id: "ramen", label: "拉麵", query: "拉麵" },
  { id: "restroom", label: "廁所", query: "公廁 廁所" },
  { id: "parking", label: "停車場", query: "停車場" },
  { id: "atm", label: "ATM", query: "ATM" },
];

export function buildNearbyMapSearchUrl(categoryQuery) {
  const query = String(categoryQuery || "").trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
