import assert from "node:assert/strict";
import test from "node:test";
import { buildNominatimReverseUrl } from "../src/utils/geocode.js";

test("Nominatim reverse URLs only include coordinates and locale", () => {
  const url = buildNominatimReverseUrl(35.1796, 129.0756);

  assert.equal(
    url.startsWith("https://nominatim.openstreetmap.org/reverse?"),
    true,
  );
  assert.equal(url.includes("lat=35.1796"), true);
  assert.equal(url.includes("lon=129.0756"), true);
  assert.equal(url.includes("token="), false);
});
