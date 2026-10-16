import test from "node:test";
import assert from "node:assert/strict";
import { createExpression, latest } from "@maplibre/maplibre-gl-style-spec";
import { repairMapStyle } from "../src/utils/mapStyleRepair.js";
const sea = {
  id: "Sea labels",
  type: "symbol",
  source: "maptiler_planet_v4",
  "source-layer": "water_label",
  layout: {
    "text-field": "{name}",
    "text-size": ["interpolate", ["linear"], ["get", "rank"], 0, 12, 6, 16],
  },
};
test("dark sea labels remain finite with missing tile data and scale gradually with zoom", () => {
  const style = { version: 8, sources: {}, layers: [sea] };
  const original = createExpression(
    sea.layout["text-size"],
    latest.layout_symbol["text-size"],
  );
  assert.throws(
    () =>
      original.value.evaluateWithoutErrorHandling(
        { zoom: 2.9 },
        { type: 1, properties: { rank: null } },
      ),
    /number.*null/,
  );
  const result = repairMapStyle(style, { isDarkMode: true });
  const expression = createExpression(
    result.layers[0].layout["text-size"],
    latest.layout_symbol["text-size"],
  );
  assert.equal(expression.result, "success");
  let previous = 0;
  for (const zoom of [0, 2.9, 6, 10, 12, 20]) {
    const value = expression.value.evaluateWithoutErrorHandling(
      { zoom },
      { type: 1, properties: { rank: null } },
    );
    assert.ok(
      Number.isFinite(value) && value >= 12 && value <= 20 && value >= previous,
    );
    previous = value;
  }
  assert.equal(result.layers[0].layout["text-field"], sea.layout["text-field"]);
  assert.deepEqual(style.layers[0], sea);
});
test("style repair preserves light mode, unrelated labels and source definitions", () => {
  const other = { ...sea, id: "Lake labels" };
  const style = {
    version: 8,
    sprite: "unchanged",
    sources: { basemap: { type: "vector" } },
    layers: [other, sea],
  };
  assert.equal(repairMapStyle(style), style);
  const result = repairMapStyle(style, { isDarkMode: true });
  assert.equal(result.sources, style.sources);
  assert.equal(result.sprite, style.sprite);
  assert.equal(result.layers[0], other);
  for (const patch of [
    { source: "other" },
    { "source-layer": "place" },
    { type: "circle" },
  ]) {
    const untouched = { ...style, layers: [{ ...sea, ...patch }] };
    assert.equal(repairMapStyle(untouched, { isDarkMode: true }), untouched);
  }
});
