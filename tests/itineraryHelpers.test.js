import assert from "node:assert/strict";
import test from "node:test";
import { getItineraryChipLabel } from "../src/utils/itineraryHelpers.js";

test("builds travel-day chips from date and short title", () => {
  assert.equal(
    getItineraryChipLabel({
      day: "Day 1",
      date: "7/2 (四)",
      title: "抵達釜山：豬肉湯飯與西面逛街",
    }),
    "7/2 · 抵達釜山",
  );
  assert.equal(
    getItineraryChipLabel({
      day: "Day 3",
      date: "7/4 (六)",
      title: "水族館、新世界百貨與無人機秀",
    }),
    "7/4 · 水族館",
  );
  assert.equal(
    getItineraryChipLabel({
      day: "Day 1",
      date: "1/24 (六)",
      title: "抵達與移動：直奔雪國",
    }),
    "1/24 · 抵達與移動",
  );
});
