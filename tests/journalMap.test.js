import assert from "node:assert/strict";
import test from "node:test";
import {
  classifyMapFailure,
  MAP_FAILURE_MESSAGES,
  getMapPoints,
  eventMapUrl,
} from "../src/utils/journalMap.js";

test("map failure categories distinguish service rejection and never expose credential URLs", () => {
  for (const [status, category] of [
    [401, "unauthorized"],
    [403, "forbidden"],
    [429, "quota"],
    [404, "missingStyle"],
  ]) {
    const result = classifyMapFailure({
      status,
      message: "https://api.maptiler.com/maps/style.json?key=private-value",
    });
    assert.equal(result, category);
    assert.ok(
      !MAP_FAILURE_MESSAGES[result].join(" ").includes("private-value"),
    );
  }
  assert.equal(
    classifyMapFailure(new Error("Failed to initialize WebGL")),
    "graphics",
  );
  assert.equal(classifyMapFailure(new Error("地圖引擎暫時無法載入")), "engine");
  assert.equal(classifyMapFailure({ status: 503 }), "unknown");
});

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
