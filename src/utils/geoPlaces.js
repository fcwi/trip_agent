/**
 * Google Places nearby search + Nominatim reverse-geocode helpers.
 * Behavior-equivalent extraction from AuthenticatedTripApp.
 */

export const CACHE_MAX_SIZE = 50;
export const CACHE_EXPIRY_MS = 3600000;

const GOOGLE_PLACES_TYPES = [
  "restaurant",
  "cafe",
  "convenience_store",
  "tourist_attraction",
  "park",
  "store",
  "lodging",
  "transit_station",
  "museum",
  "shopping_mall",
];

const noop = () => {};

/**
 * Parse Nominatim reverse-geocode JSON into city / landmark / isGeneric.
 */
export function parseReverseGeoName(geoData) {
  if (!geoData) {
    return { city: undefined, landmark: "", isGeneric: true };
  }

  const addr = geoData.address || {};
  const city =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.county ||
    addr.state ||
    "您的位置";

  let landmark = "";
  let isGeneric = true;

  // 判斷是否為具體地標（如建築物名稱），若無則回退至路名
  if (geoData.name) {
    landmark = geoData.name;
    isGeneric = false;
  } else if (addr.road) {
    landmark = addr.road;
    if (addr.house_number) landmark += ` ${addr.house_number}`;
  }

  return { city, landmark, isGeneric };
}

/**
 * Nominatim reverse geocode with in-memory expiry cache.
 */
export async function lookupReverseGeoName({
  latitude,
  longitude,
  cacheRef,
  cacheExpiryMs = CACHE_EXPIRY_MS,
  debugLog = noop,
  fetchImpl = fetch,
}) {
  const geoKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  let geoData = cacheRef.current[geoKey]?.data;

  if (
    !geoData ||
    Date.now() - (cacheRef.current[geoKey]?.timestamp || 0) > cacheExpiryMs
  ) {
    const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=zh-TW&zoom=18`;
    const geoRes = await fetchImpl(geoUrl);
    geoData = await geoRes.json();

    cacheRef.current[geoKey] = {
      data: geoData,
      timestamp: Date.now(),
    };
    debugLog(`🌍 [地名查詢] 新查詢: ${geoKey}`);
  } else {
    debugLog(`🌍 [地名快取命中] ${geoKey}`);
  }

  return { geoData, ...parseReverseGeoName(geoData) };
}

/**
 * Nearby Places search with cache, abort, and 100m → 300m retry.
 */
export async function fetchGooglePlaces({
  lat,
  lng,
  initialRadius = 100,
  mapsApiKey,
  cacheRef,
  abortControllerRef,
  cacheExpiryMs = CACHE_EXPIRY_MS,
  debugLog = noop,
  fetchImpl = fetch,
}) {
  const performSearch = async (radius) => {
    const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)},${radius}`;
    const cached = cacheRef.current[cacheKey];
    if (cached && Date.now() - cached.timestamp < cacheExpiryMs) {
      return cached.data;
    }

    if (!mapsApiKey) return null;

    const url = `https://places.googleapis.com/v1/places:searchNearby`;

    const body = {
      includedTypes: GOOGLE_PLACES_TYPES,
      maxResultCount: 1,
      locationRestriction: {
        circle: {
          center: { latitude: Number(lat), longitude: Number(lng) },
          radius: Number(radius),
        },
      },
      languageCode: "zh-TW",
    };

    try {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const res = await fetchImpl(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": mapsApiKey,
          "X-Goog-FieldMask": "places.displayName,places.addressDescriptor",
        },
        body: JSON.stringify(body),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) return null;

      const data = await res.json();
      let foundName = "";

      if (data.places && data.places.length > 0) {
        const firstPlace = data.places[0];
        const landmarks = firstPlace.addressDescriptor?.landmarks;
        // 優先取地標描述，次取店名
        foundName =
          landmarks?.[0]?.displayName?.text ||
          firstPlace.displayName?.text ||
          "";
      }

      if (foundName) {
        cacheRef.current[cacheKey] = {
          data: foundName,
          timestamp: Date.now(),
        };
      }
      return foundName;
    } catch (error) {
      if (error.name === "AbortError") return null;
      console.error(`❌ [Maps API] 錯誤:`, error);
      return null;
    }
  };

  // 2. 核心重試邏輯
  // 第一跳：嘗試精準半徑 (預設 100m)
  let placeName = await performSearch(initialRadius);

  // 第二跳：如果沒結果，且初次搜尋半徑小於 300m，則擴大範圍再試一次
  if (!placeName && initialRadius < 300) {
    debugLog(`🔍 [Maps API] ${initialRadius}m 無結果，擴大至 300m 重試...`);
    placeName = await performSearch(300);
  }

  return placeName || "";
}

/**
 * Best nearby POI via Google Places (100m default, then 300m).
 */
export async function getBestPOI({
  latitude,
  longitude,
  mapsApiKey,
  cacheRef,
  abortControllerRef,
  debugLog = noop,
  fetchImpl = fetch,
}) {
  if (!mapsApiKey) {
    debugLog("🗺️ [Google Maps] 略過：未設定 API Key");
    return null;
  }

  try {
    debugLog(
      `🗺️ [Google Maps] 查詢周邊 POI... (Lat: ${latitude}, Lng: ${longitude})`,
    );
    // 預設搜尋半徑 100m，優先尋找最接近的具體地標
    const places = await fetchGooglePlaces({
      lat: latitude,
      lng: longitude,
      initialRadius: 100,
      mapsApiKey,
      cacheRef,
      abortControllerRef,
      debugLog,
      fetchImpl,
    });
    debugLog("🗺️ [Google Maps] API 回傳結果:", places);

    if (places) {
      debugLog(`🗺️ [Google Maps] 找到最佳地標: "${places}"`);
      return { name: places, source: "maps-direct" };
    }
  } catch (e) {
    console.warn("getBestPOI 執行失敗:", e);
  }
  return null;
}

/**
 * Share-text landmark decision: keep precise OSM names, otherwise try Places.
 */
export async function resolveShareLandmark({
  currentLandmark,
  isGeneric,
  locationName,
  latitude,
  longitude,
  getBestPOIImpl,
  debugLog = noop,
  debugGroup = noop,
  debugGroupEnd = noop,
}) {
  debugGroup("🚀 [分享流程決策樹]");
  debugLog("1. 狀態輸入:", {
    landmark: currentLandmark || "(無)",
    isGeneric: isGeneric,
    city: locationName,
  });

  let finalLandmark = currentLandmark || "";
  let tag = currentLandmark ? "Street(OSM)" : "Unknown";
  let updatedFromPoi = false;

  // 決策邏輯：若 OSM 提供的地標為空，或是被判定為通用路名 (isGeneric)，則呼叫 Google Maps 補強
  if (!finalLandmark || isGeneric === true) {
    debugLog("2. 判定需要補強 (無地標或僅有路名)，呼叫 Google Maps...");

    const poi = await getBestPOIImpl(latitude, longitude);

    if (poi && poi.name) {
      finalLandmark = poi.name;
      tag = "POI(GoogleMaps)";
      updatedFromPoi = true;
      debugLog("3. Google Maps 救援成功！更新為:", finalLandmark);
    } else {
      debugLog("3. Google Maps 無結果，維持 OSM 路名。");
    }
  } else {
    debugLog("2. OSM 已是精準地標，跳過 Google Maps。");
  }

  debugLog(`🏁 [最終輸出] Landmark: "${finalLandmark}"`);
  debugGroupEnd();

  return { finalLandmark, tag, updatedFromPoi };
}
