import test from "node:test";
import assert from "node:assert/strict";
import { inspectMapStyle } from "../src/utils/mapStyleDiagnostics.js";
const makeMap = (layers) => ({
  getZoom: () => 4,
  getStyle: () => ({
    version: 8,
    sources: {},
    sprite: "https://example.com/?key=DO_NOT_PRINT",
    layers,
  }),
  listImages: () => [],
  querySourceFeatures: () => [
    {
      id: 88,
      properties: { kind: "place", privateValue: "DO_NOT_PRINT" },
      geometry: { type: "Point", coordinates: [121, 25] },
    },
  ],
});
const layer = {
  id: "place-label",
  type: "symbol",
  source: "basemap",
  "source-layer": "place",
  layout: {
    "text-size": ["interpolate", ["linear"], ["get", "rank"], 0, 12, 10, 24],
  },
};
test("map diagnostic identifies the layer and property using real style evaluation without exposing feature data", () => {
  const report = inspectMapStyle(makeMap([layer]));
  assert.deepEqual(report.issues, [
    {
      layer: "place-label",
      source: "basemap",
      sourceLayer: "place",
      section: "layout",
      property: "text-size",
      category: "number-null",
    },
  ]);
  assert.equal(JSON.stringify(report).includes("DO_NOT_PRINT"), false);
  assert.equal(JSON.stringify(report).includes("coordinates"), false);
});
test("map diagnostic respects layer filters, visibility and numeric fallbacks", () => {
  const report = inspectMapStyle(
    makeMap([
      { ...layer, id: "filtered", filter: ["==", ["get", "kind"], "road"] },
      {
        ...layer,
        id: "hidden",
        layout: { ...layer.layout, visibility: "none" },
      },
      {
        ...layer,
        id: "safe",
        layout: {
          "text-size": [
            "interpolate",
            ["linear"],
            ["coalesce", ["get", "rank"], 0],
            0,
            12,
            10,
            24,
          ],
        },
      },
    ]),
  );
  assert.deepEqual(report.issues, []);
  assert.equal(report.sampledLayers, 1);
});
test("map diagnostic bounds its evaluation work and marks incomplete samples", () => {
  const report = inspectMapStyle(makeMap([layer]), { maxEvaluations: 0 });
  assert.equal(report.truncated, true);
  assert.deepEqual(report.issues, []);
});
