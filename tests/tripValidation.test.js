import test from "node:test";
import assert from "node:assert/strict";
import {
  assertTripData,
  REQUIRED_COMPONENT_STYLES,
  validateTripData,
} from "../src/utils/tripValidation.js";

const createValidSource = () => ({
  tripConfig: {
    title: "測試旅程",
    timeZone: "Asia/Taipei",
    startDate: "2026-08-01T00:00:00",
    endDate: "2026-08-02T23:59:59",
    currency: { code: "jpy", source: "JPY", target: "TWD" },
    language: { code: "zh-TW", name: "繁體中文" },
    meta: { title: "測試旅程", description: "測試旅程說明" },
    locations: [
      { key: "taipei", name: "台北", lat: 25.033, lon: 121.5654 },
    ],
    theme: {
      componentStyles: Object.fromEntries(
        REQUIRED_COMPONENT_STYLES.map((name) => [
          name,
          { light: `${name}-light`, dark: `${name}-dark` },
        ]),
      ),
    },
  },
  itineraryData: [
    {
      day: "Day 1",
      date: "8/1 (六)",
      locationKey: "taipei",
      events: [{ time: "09:00", title: "集合" }],
    },
  ],
  guidesData: [],
  usefulLinks: [],
  shopGuideData: [],
  checklistData: [],
});

test("accepts a complete trip data source", () => {
  const source = createValidSource();
  assert.deepEqual(validateTripData(source), []);
  assert.equal(assertTripData(source), source);
});

test("aggregates missing exports and required config fields", () => {
  const errors = validateTripData({ tripConfig: {} });

  assert.ok(errors.includes("itineraryData 必須是陣列"));
  assert.ok(errors.includes("tripConfig.title 不可為空"));
  assert.ok(errors.includes("tripConfig.locations 至少需要一個地點"));
  assert.ok(errors.length > 10);
});

test("rejects invalid dates, time zones, and currency codes", () => {
  const source = createValidSource();
  source.tripConfig.timeZone = "Taipei/Nowhere";
  source.tripConfig.startDate = "not-a-date";
  source.tripConfig.currency.source = "YEN";
  source.tripConfig.currency.target = "TW";

  const errors = validateTripData(source);
  assert.ok(errors.some((message) => message.includes("IANA 時區")));
  assert.ok(errors.includes("tripConfig.startDate 必須是有效日期"));
  assert.ok(
    errors.includes("tripConfig.currency.target 必須是 3 碼幣別代碼"),
  );
  assert.ok(!errors.some((message) => message.includes("currency.source")));
});

test("rejects a reversed trip date range", () => {
  const source = createValidSource();
  source.tripConfig.startDate = "2026-08-03T00:00:00";

  assert.ok(
    validateTripData(source).includes(
      "tripConfig.startDate 不可晚於 endDate",
    ),
  );
});

test("validates coordinate ranges and unique location keys", () => {
  const source = createValidSource();
  source.tripConfig.locations.push({
    key: "taipei",
    name: "錯誤座標",
    lat: 91,
    lon: -181,
  });

  const errors = validateTripData(source);
  assert.ok(errors.some((message) => message.includes(".lat 必須是 -90 到 90")));
  assert.ok(
    errors.some((message) => message.includes(".lon 必須是 -180 到 180")),
  );
  assert.ok(errors.includes("tripConfig.locations 的 key 重複：taipei"));
});

test("validates itinerary references, labels, and events", () => {
  const source = createValidSource();
  source.itineraryData.push({
    day: "Day 1",
    date: "8/2 (日)",
    locationKey: "missing",
    events: [{ time: "", title: "" }],
  });

  const errors = validateTripData(source);
  assert.ok(errors.includes("itineraryData 的 day 重複：Day 1"));
  assert.ok(
    errors.includes(
      "itineraryData[1].locationKey 找不到對應地點：missing",
    ),
  );
  assert.ok(errors.includes("itineraryData[1].events[0].title 不可為空"));
  assert.ok(errors.includes("itineraryData[1].events[0].time 不可為空"));
});

test("throws one actionable error containing every validation failure", () => {
  assert.throws(
    () => assertTripData({ tripConfig: {} }),
    (error) =>
      error.message.startsWith("旅程資料驗證失敗：") &&
      error.message.includes("itineraryData 必須是陣列") &&
      error.message.includes("tripConfig.title 不可為空"),
  );
});
