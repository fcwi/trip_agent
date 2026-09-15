import assert from "node:assert/strict";
import test from "node:test";
import {
  buildEventPopupHtml,
  buildSharedLocationPopupHtml,
  toMapLibreRouteCoordinates,
} from "../src/utils/mapHelpers.js";

test("keeps OSRM lon/lat order for MapLibre routes", () => {
  assert.deepEqual(
    toMapLibreRouteCoordinates([
      [129.04, 35.11],
      ["bad", 1],
      [200, 0],
    ]),
    [[129.04, 35.11]],
  );
});

test("escapes itinerary text inside event popups", () => {
  const html = buildEventPopupHtml({
    index: 0,
    time: "09:00",
    title: "<b>Cafe</b>",
    desc: "a <script>alert(1)</script>",
    isDarkMode: false,
    compact: true,
  });

  assert.equal(html.includes("<b>Cafe</b>"), false);
  assert.equal(html.includes("&lt;b&gt;Cafe&lt;/b&gt;"), true);
  assert.equal(html.includes("<script>"), false);
});

test("omits navigation when shared coordinates are invalid", () => {
  const html = buildSharedLocationPopupHtml({
    name: "Ada",
    avatar: "🦊",
    relativeTime: "剛剛",
    lat: Number.NaN,
    lon: 129.04,
    isDarkMode: true,
  });

  assert.equal(html.includes("google.com/maps/dir"), false);
  assert.equal(html.includes("Ada"), true);
});
