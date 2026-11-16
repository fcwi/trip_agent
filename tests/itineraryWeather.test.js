import test from "node:test";
import assert from "node:assert/strict";
import {
  buildNearbyMapSearchUrl,
  findDayHotelDetails,
  getClothingAdvice,
  getDayForecastSummary,
  getEventAttentionBadge,
} from "../src/utils/itineraryWeather.js";

test("getClothingAdvice handles snow, large temperature swings, and rain", () => {
  const snowAdvice = getClothingAdvice({
    maxTemp: 2,
    minTemp: -4,
    weatherCode: 73,
    precipProb: 60,
  });
  assert.match(snowAdvice, /雪靴|羽絨/);
  assert.match(snowAdvice, /折疊傘|防水/);

  const springSwingAdvice = getClothingAdvice({
    maxTemp: 21,
    minTemp: 11,
    weatherCode: 1,
    precipProb: 10,
  });
  assert.match(springSwingAdvice, /洋蔥式穿搭/);
  assert.match(springSwingAdvice, /10°C/);
});

test("getDayForecastSummary keeps high temp on left and low temp on right", () => {
  const summary = getDayForecastSummary({
    dayIndex: 1,
    itineraryData: [
      { day: "Day 1", locationKey: "yamagata" },
      { day: "Day 2", locationKey: "akita" },
    ],
    tripConfig: {
      locations: [
        { key: "yamagata", name: "山形" },
        { key: "akita", name: "秋田" },
      ],
    },
    weatherForecast: {
      loading: false,
      akita: {
        time: ["2026-11-16", "2026-11-17"],
        temperature_2m_max: [9.4, 6.8],
        temperature_2m_min: [1.2, -1.6],
        weathercode: [2, 71],
        precipitation_probability_max: [20, 70],
      },
    },
    tripStatus: "before",
    currentTripDayIndex: -1,
  });

  assert.equal(summary.hasForecast, true);
  assert.equal(summary.locationName, "秋田");
  assert.equal(summary.tempText, "7° / -2°");
  assert.equal(summary.maxTemp, 7);
  assert.equal(summary.minTemp, -2);
  assert.match(summary.clothingAdvice, /防滑防水鞋靴/);
});

test("getEventAttentionBadge identifies pending, booking, and caution events", () => {
  assert.deepEqual(
    getEventAttentionBadge({ title: "飯店", locationPending: true }),
    { kind: "confirm", label: "出發前確認" },
  );
  assert.deepEqual(
    getEventAttentionBadge({
      title: "天空膠囊",
      tips: ["務必提前在官網預約搶票"],
    }),
    { kind: "confirm", label: "出發前確認" },
  );
  assert.deepEqual(
    getEventAttentionBadge({
      title: "纜車",
      desc: "注意末班車時間，勿太晚下山",
    }),
    { kind: "notice", label: "要注意" },
  );
  assert.equal(
    getEventAttentionBadge({ title: "公園散步", desc: "自由活動" }),
    null,
  );
});

test("findDayHotelDetails matches tripConfig hotels and skips home", () => {
  const tripConfig = {
    hotels: [
      {
        name: "山形格蘭大飯店 (Yamagata Grand Hotel)",
        phone: "+81-23-641-2611",
        address: "山形市本町1-7-42",
      },
    ],
  };

  assert.equal(findDayHotelDetails({ stay: "溫暖的家" }, tripConfig), null);

  const matched = findDayHotelDetails(
    { stay: "山形格蘭大飯店", stayPending: false },
    tripConfig,
  );
  assert.equal(matched?.telHref, "tel:+81236412611");
  assert.equal(matched?.address, "山形市本町1-7-42");
});

test("buildNearbyMapSearchUrl encodes pure category keyword for current GPS area search", () => {
  const url = buildNearbyMapSearchUrl("便利商店");
  assert.equal(
    url,
    "https://www.google.com/maps/search/?api=1&query=%E4%BE%BF%E5%88%A9%E5%95%86%E5%BA%97",
  );
  const restroomUrl = buildNearbyMapSearchUrl("公廁 廁所");
  assert.equal(
    restroomUrl,
    "https://www.google.com/maps/search/?api=1&query=%E5%85%AC%E5%BB%81%20%E5%BB%81%E6%89%80",
  );
});
