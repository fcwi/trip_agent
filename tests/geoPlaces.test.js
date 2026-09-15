import assert from "node:assert/strict";
import test from "node:test";
import {
  parseReverseGeoName,
  lookupReverseGeoName,
  fetchGooglePlaces,
  getBestPOI,
  resolveShareLandmark,
} from "../src/utils/geoPlaces.js";

const jsonResponse = (data, { ok = true, status = 200 } = {}) => ({
  ok,
  status,
  json: async () => data,
});

test("parseReverseGeoName prefers a named landmark over a road", () => {
  assert.deepEqual(
    parseReverseGeoName({
      name: "東京車站",
      address: { city: "東京", road: "丸の内" },
    }),
    { city: "東京", landmark: "東京車站", isGeneric: false },
  );
});

test("parseReverseGeoName falls back to road and house number", () => {
  assert.deepEqual(
    parseReverseGeoName({
      address: {
        town: "輕井澤",
        road: "舊輕井澤銀座通",
        house_number: "12",
      },
    }),
    {
      city: "輕井澤",
      landmark: "舊輕井澤銀座通 12",
      isGeneric: true,
    },
  );
});

test("lookupReverseGeoName caches Nominatim results by rounded coords", async () => {
  const cacheRef = { current: {} };
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return jsonResponse({
      name: "釜山站",
      address: { city: "釜山" },
    });
  };

  const first = await lookupReverseGeoName({
    latitude: 35.11511,
    longitude: 129.04119,
    cacheRef,
    fetchImpl,
  });
  const second = await lookupReverseGeoName({
    latitude: 35.11514,
    longitude: 129.04121,
    cacheRef,
    fetchImpl,
  });

  assert.equal(calls, 1);
  assert.equal(first.landmark, "釜山站");
  assert.equal(second.city, "釜山");
  assert.equal(first.isGeneric, false);
});

test("fetchGooglePlaces returns cached names without calling the API", async () => {
  const cacheRef = { current: {} };
  const abortControllerRef = { current: null };
  cacheRef.current["35.1151,129.0412,100"] = {
    data: "Cached Cafe",
    timestamp: Date.now(),
  };

  const name = await fetchGooglePlaces({
    lat: 35.1151,
    lng: 129.0412,
    mapsApiKey: "maps-key",
    cacheRef,
    abortControllerRef,
    fetchImpl: async () => {
      throw new Error("should not fetch");
    },
  });

  assert.equal(name, "Cached Cafe");
});

test("fetchGooglePlaces retries at 300m when the first radius is empty", async () => {
  const cacheRef = { current: {} };
  const abortControllerRef = { current: null };
  const radii = [];

  const name = await fetchGooglePlaces({
    lat: 35.1151,
    lng: 129.0412,
    initialRadius: 100,
    mapsApiKey: "maps-key",
    cacheRef,
    abortControllerRef,
    fetchImpl: async (_url, options) => {
      const body = JSON.parse(options.body);
      radii.push(body.locationRestriction.circle.radius);
      if (body.locationRestriction.circle.radius === 100) {
        return jsonResponse({ places: [] });
      }
      return jsonResponse({
        places: [
          {
            displayName: { text: "海雲台" },
            addressDescriptor: {
              landmarks: [{ displayName: { text: "海雲台海水浴場" } }],
            },
          },
        ],
      });
    },
  });

  assert.deepEqual(radii, [100, 300]);
  assert.equal(name, "海雲台海水浴場");
});

test("getBestPOI skips Google when no maps key is set", async () => {
  const logs = [];
  const result = await getBestPOI({
    latitude: 35.1,
    longitude: 129.0,
    mapsApiKey: "",
    cacheRef: { current: {} },
    abortControllerRef: { current: null },
    debugLog: (...args) => logs.push(args.join(" ")),
    fetchImpl: async () => {
      throw new Error("should not fetch");
    },
  });

  assert.equal(result, null);
  assert.match(logs.join("\n"), /未設定 API Key/);
});

test("resolveShareLandmark keeps precise OSM names and asks Places for generic roads", async () => {
  const precise = await resolveShareLandmark({
    currentLandmark: "東京車站",
    isGeneric: false,
    locationName: "東京",
    latitude: 35.68,
    longitude: 139.76,
    getBestPOIImpl: async () => {
      throw new Error("should skip Places");
    },
  });
  assert.deepEqual(precise, {
    finalLandmark: "東京車站",
    tag: "Street(OSM)",
    updatedFromPoi: false,
  });

  const rescued = await resolveShareLandmark({
    currentLandmark: "中央通",
    isGeneric: true,
    locationName: "釜山",
    latitude: 35.1,
    longitude: 129.0,
    getBestPOIImpl: async () => ({ name: "南浦洞", source: "maps-direct" }),
  });
  assert.deepEqual(rescued, {
    finalLandmark: "南浦洞",
    tag: "POI(GoogleMaps)",
    updatedFromPoi: true,
  });
});
