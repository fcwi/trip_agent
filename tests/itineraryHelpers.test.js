import assert from "node:assert/strict";
import test from "node:test";
import { getItineraryChipLabel } from "../src/utils/itineraryHelpers.js";

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
