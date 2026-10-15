import test from "node:test";
import assert from "node:assert/strict";
import {
  tripCatalog,
  chooseDefaultTrip,
  getTripPhase,
  resolveTripId,
  createTripUrl,
} from "../src/config/tripCatalog.js";

test("selects an ongoing trip before a future trip", () => {
  assert.equal(
    chooseDefaultTrip(tripCatalog, new Date("2026-07-03T03:00:00Z")),
    "2026_busan",
  );
});
test("selects the nearest future trip after earlier trips have ended", () => {
  assert.equal(
    chooseDefaultTrip(tripCatalog, new Date("2026-10-15T03:00:00Z")),
    "2027_tohoku",
  );
  assert.equal(
    chooseDefaultTrip(tripCatalog, new Date("2026-01-01T03:00:00Z")),
    "2026_karuizawa",
  );
});
test("uses the latest past trip if every trip has ended", () => {
  assert.equal(
    chooseDefaultTrip(tripCatalog, new Date("2028-01-01T00:00:00Z")),
    "2027_tohoku",
  );
  assert.equal(chooseDefaultTrip([], new Date()), null);
});
test("keeps departure and final dates inclusive in the destination timezone", () => {
  const trip = tripCatalog.find((item) => item.id === "2026_busan");
  assert.equal(
    getTripPhase(trip, new Date("2026-07-01T14:59:59Z")),
    "upcoming",
  );
  assert.equal(getTripPhase(trip, new Date("2026-07-01T15:00:00Z")), "during");
  assert.equal(getTripPhase(trip, new Date("2026-07-06T14:59:59Z")), "during");
  assert.equal(getTripPhase(trip, new Date("2026-07-06T15:00:00Z")), "past");
});
test("honors an explicit trip and safely handles unknown query values", () => {
  const now = new Date("2026-10-15T03:00:00Z");
  assert.equal(resolveTripId("?trip=2026_busan", now), "2026_busan");
  assert.equal(resolveTripId("?trip=../../other", now), "2027_tohoku");
});
test("trip links preserve unrelated query values and reset the open tab", () => {
  assert.equal(
    createTripUrl(
      "2026_busan",
      "https://example.test/trip_agent/?tab=finance&lang=zh#detail",
    ),
    "/trip_agent/?tab=itinerary&lang=zh&trip=2026_busan",
  );
  assert.throws(() => createTripUrl("unknown", "https://example.test/"));
});
