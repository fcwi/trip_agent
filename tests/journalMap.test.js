import assert from "node:assert/strict";
import test from "node:test";
import { getMapPoints, eventMapUrl } from "../src/utils/journalMap.js";

test("map bounds combine event, route and shared positions without reversing lon/lat", () => {
  assert.deepEqual(
    getMapPoints(
      [
        { lon: 140.9, lat: 38.1 },
        { lon: NaN, lat: 1 },
      ],
      [
        [140.3, 38.2],
        [999, 1],
      ],
      { lon: 0, lat: 0 },
      [{ lon: 139, lat: 35 }],
    ),
    [
      [140.9, 38.1],
      [140.3, 38.2],
      [0, 0],
      [139, 35],
    ],
  );
});
test("external map alternatives use explicit queries or valid coordinates and encode title fallback", () => {
  assert.equal(
    new URL(
      eventMapUrl({ mapQuery: "仙台 & lunch", lon: 140, lat: 38 }),
    ).searchParams.get("query"),
    "仙台 & lunch",
  );
  assert.equal(
    new URL(eventMapUrl({ lon: 140, lat: 38 })).searchParams.get("query"),
    "38,140",
  );
  assert.equal(
    new URL(
      eventMapUrl({ title: "午餐? 茶 & 點心", lon: 999, lat: 38 }),
    ).searchParams.get("query"),
    "午餐? 茶 & 點心",
  );
});
