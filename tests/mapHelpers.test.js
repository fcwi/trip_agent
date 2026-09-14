import assert from "node:assert/strict";
import test from "node:test";
import {
  buildEventPopupHtml,
  buildSharedLocationPopupHtml,
  isValidLngLat,
  toMapLibreRouteCoordinates,
} from "../src/utils/mapHelpers.js";

test("isValidLngLat accepts MapLibre [lon, lat] pairs", () => {
  assert.equal(isValidLngLat(129.0756, 35.1796), true);
  assert.equal(isValidLngLat(200, 35), false);
  assert.equal(isValidLngLat(129, 95), false);
});

test("toMapLibreRouteCoordinates keeps OSRM [lon, lat] order", () => {
  const osrmCoordinates = [
    [129.0756, 35.1796],
    [129.1, 35.2],
    ["bad", 1],
  ];

  assert.deepEqual(toMapLibreRouteCoordinates(osrmCoordinates), [
    [129.0756, 35.1796],
    [129.1, 35.2],
  ]);
});

test("event popup HTML escapes itinerary text", () => {
  const html = buildEventPopupHtml({
    index: 0,
    time: "09:00",
    title: `<script>alert("x")</script>`,
    desc: `Hello <b>world</b>`,
    isDarkMode: false,
    compact: true,
  });

  assert.equal(html.includes("<script>"), false);
  assert.equal(html.includes("&lt;script&gt;"), true);
  assert.equal(html.includes("&lt;b&gt;world&lt;/b&gt;"), true);
  assert.equal(html.includes(">1<"), true);
});

test("shared location popup HTML escapes untrusted fields", () => {
  const html = buildSharedLocationPopupHtml({
    name: `<img src=x onerror=alert(1)>`,
    avatar: `<svg onload=alert(1)>`,
    device: `iPhone</div><script>alert(1)</script>`,
    relativeTime: "剛剛",
    lat: 35.1796,
    lon: 129.0756,
    isDarkMode: true,
  });

  assert.equal(html.includes("<script>"), false);
  assert.equal(html.includes("<img src=x"), false);
  assert.equal(html.includes("&lt;img src=x"), true);
  assert.equal(html.includes("destination=35.1796,129.0756"), true);
});
