import assert from "node:assert/strict";
import test from "node:test";
import {
  getLandingOverview,
  getTripTemporalContext,
  parseEventMinutes,
} from "../src/utils/landingOverview.js";

const itineraryData = [
  {
    day: "Day 1",
    locationKey: "seoul",
    title: "抵達與移動",
    stay: "首爾飯店",
    events: [
      {
        time: "約 09:30",
        title: "機場集合",
        mapQuery: "仁川機場",
        tips: ["護照放隨身包。", "先完成入境資料截圖。"],
      },
      {
        time: "12:10",
        title: "前往市區",
        mapQuery: "首爾站",
        transport: { note: "交通卡先儲值。" },
      },
    ],
  },
  {
    day: "Day 2",
    locationKey: "busan",
    title: "海邊散步",
    events: [{ time: "10:00", title: "前往海邊", mapQuery: "海雲台" }],
  },
];

const tripConfig = {
  title: "測試旅程",
  timeZone: "Asia/Seoul",
  startDate: "2026-07-02T00:00:00",
  endDate: "2026-07-03T23:59:59",
  locations: [
    { key: "seoul", name: "首爾" },
    { key: "busan", name: "釜山" },
  ],
};

test("parses exact and approximate itinerary times", () => {
  assert.equal(parseEventMinutes("09:30"), 570);
  assert.equal(parseEventMinutes("約 16:05"), 965);
  assert.equal(parseEventMinutes("待領隊"), null);
});

test("uses the configured trip time zone at a date boundary", () => {
  const context = getTripTemporalContext({
    now: new Date("2026-07-01T15:30:00Z"),
    timeZone: tripConfig.timeZone,
    startDate: tripConfig.startDate,
    endDate: tripConfig.endDate,
    itineraryLength: itineraryData.length,
  });

  assert.equal(context.dateKey, "2026-07-02");
  assert.equal(context.tripStatus, "during");
  assert.equal(context.currentTripDayIndex, 0);
  assert.equal(context.minutes, 30);
});

test("treats test-mode input as trip-local wall time and finds the next stop", () => {
  const context = getTripTemporalContext({
    now: new Date(2026, 6, 2, 10, 0),
    timeZone: tripConfig.timeZone,
    startDate: tripConfig.startDate,
    endDate: tripConfig.endDate,
    itineraryLength: itineraryData.length,
    treatAsLocal: true,
  });
  const overview = getLandingOverview({
    itineraryData,
    tripConfig,
    checklistData: [],
    temporalContext: context,
  });

  assert.equal(overview.eyebrow, "今天的計畫");
  assert.equal(overview.nextEvent.title, "前往市區");
  assert.equal(overview.nextLocation, "首爾站");
  assert.equal(overview.neededNow[0], "交通卡先儲值。");
});

test("shows checklist needs and the first stop before departure", () => {
  const context = getTripTemporalContext({
    now: new Date(2026, 5, 30, 8, 0),
    timeZone: tripConfig.timeZone,
    startDate: tripConfig.startDate,
    endDate: tripConfig.endDate,
    itineraryLength: itineraryData.length,
    treatAsLocal: true,
  });
  const overview = getLandingOverview({
    itineraryData,
    tripConfig,
    checklistData: [
      { text: "護照", checked: false },
      { text: "網卡", checked: false },
      { text: "已完成", checked: true },
    ],
    temporalContext: context,
  });

  assert.equal(overview.nextTiming, "旅程第一站");
  assert.equal(overview.nextEvent.title, "機場集合");
  assert.deepEqual(overview.neededNow, ["護照", "網卡"]);
});

test("falls forward to tomorrow after today's final event", () => {
  const overview = getLandingOverview({
    itineraryData,
    tripConfig,
    checklistData: [],
    temporalContext: {
      tripStatus: "during",
      currentTripDayIndex: 0,
      minutes: 23 * 60,
    },
  });

  assert.equal(overview.nextTiming, "明天第一站");
  assert.equal(overview.nextEvent.title, "前往海邊");
  assert.equal(overview.nextLocation, "海雲台");
});
