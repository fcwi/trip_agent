import assert from "node:assert/strict";
import test from "node:test";
import {
  getItineraryChipLabel,
  flattenItinerary,
} from "../src/utils/itineraryHelpers.js";

test("AI itinerary context distinguishes provisional hotels from confirmed bookings", () => {
  const text = flattenItinerary([
    {
      day: "Day 1",
      locationKey: "tendo",
      events: [
        {
          time: "19:00",
          title: "暫定住宿",
          desc: "規劃參考",
          locationProvisional: true,
          sources: [{ text: "飯店官網", url: "https://www.takinoyu.com/" }],
        },
      ],
    },
  ]);
  assert.match(text, /暫定飯店/);
  assert.match(text, /不可推定已確認入住或已預約/);
  assert.match(text, /https:\/\/www.takinoyu.com\//);
});

test("uses Day 1-5 labels on itinerary chips", () => {
  assert.equal(
    getItineraryChipLabel({
      day: "Day 1",
      date: "1/22 (五)",
      title: "仙台空港 → 天童 / 上山溫泉（低密度）",
    }),
    "Day 1",
  );
  assert.equal(
    getItineraryChipLabel({
      day: "Day 5",
      date: "1/26 (二)",
      title: "返程",
    }),
    "Day 5",
  );
  assert.equal(
    getItineraryChipLabel({
      date: "7/2 (四)",
      title: "抵達釜山：豬肉湯飯與西面逛街",
    }),
    "7/2",
  );
});
