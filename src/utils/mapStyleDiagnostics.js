import {
  createExpression,
  featureFilter,
  isExpression,
  latest,
} from "@maplibre/maplibre-gl-style-spec";

const safeId = (value) =>
  String(value || "")
    .replace(/[^a-zA-Z0-9_:. -]/g, "_")
    .slice(0, 100);
const geometryType = {
  Point: 1,
  MultiPoint: 1,
  LineString: 2,
  MultiLineString: 2,
  Polygon: 3,
  MultiPolygon: 3,
};

// Opt-in, local-only sampling. Never export source URLs, credentials, coordinates,
// feature IDs or property values. A clean sample does not certify every map tile.
export function inspectMapStyle(
  map,
  { theme = "light", maxEvaluations = 10000 } = {},
) {
  const zoom = map.getZoom();
  const style = map.getStyle();
  const issues = [];
  const featuresBySource = new Map();
  let evaluations = 0;
  let sampledLayers = 0;
  let skippedLayers = 0;
  let truncated = false;
  for (const layer of style.layers || []) {
    if (
      !layer.source ||
      layer.layout?.visibility === "none" ||
      zoom < (layer.minzoom ?? 0) ||
      zoom >= (layer.maxzoom ?? 24)
    )
      continue;
    let filter;
    try {
      filter = featureFilter(layer.filter);
      // Geometry-dependent filters require worker tile coordinates, unavailable here.
      if (filter.needGeometry) {
        skippedLayers++;
        continue;
      }
    } catch {
      skippedLayers++;
      continue;
    }
    const sourceKey = `${layer.source}/${layer["source-layer"] || ""}`;
    if (!featuresBySource.has(sourceKey)) {
      try {
        const features = map.querySourceFeatures(
          layer.source,
          layer["source-layer"] ? { sourceLayer: layer["source-layer"] } : {},
        );
        if (features.length > 150) truncated = true;
        featuresBySource.set(sourceKey, features.slice(0, 150));
      } catch {
        featuresBySource.set(sourceKey, []);
        skippedLayers++;
      }
    }
    const features = featuresBySource
      .get(sourceKey)
      .map((feature) => ({
        type: geometryType[feature.geometry?.type] || feature.type,
        properties: feature.properties || {},
        id: feature.id,
      }))
      .filter((feature) => filter.filter({ zoom }, feature));
    if (!features.length) continue;
    sampledLayers++;
    for (const section of ["layout", "paint"]) {
      for (const [property, expression] of Object.entries(
        layer[section] || {},
      )) {
        if (!isExpression(expression)) continue;
        const spec = latest[`${section}_${layer.type}`]?.[property];
        if (!spec) continue;
        const compiled = createExpression(expression, spec);
        if (compiled.result !== "success") continue;
        for (const feature of features) {
          if (++evaluations > maxEvaluations) {
            truncated = true;
            break;
          }
          try {
            compiled.value.evaluateWithoutErrorHandling(
              { zoom },
              feature,
              {},
              undefined,
              map.listImages(),
            );
          } catch (error) {
            if (
              !/Expected value to be of type number, but found null instead/.test(
                error.message,
              )
            )
              continue;
            issues.push({
              layer: safeId(layer.id),
              source: safeId(layer.source),
              sourceLayer: safeId(layer["source-layer"]),
              section,
              property: safeId(property),
              category: "number-null",
            });
            break;
          }
        }
        if (evaluations > maxEvaluations) break;
      }
      if (evaluations > maxEvaluations) break;
    }
    if (evaluations > maxEvaluations) break;
  }
  return {
    version: 1,
    theme,
    zoom: Math.round(zoom * 10) / 10,
    sampledLayers,
    skippedLayers,
    evaluations,
    truncated,
    issues,
    scope:
      "loaded-tile sample; worker-only context and unsampled tiles require further verification",
  };
}

export function attachMapStyleDiagnostics(map, theme) {
  let timer;
  let disposed = false;
  let previous;
  let count = 0;
  const missingImages = new Set();
  const run = () => {
    if (disposed || count >= 8 || !map.isStyleLoaded()) return;
    let report;
    try {
      report = inspectMapStyle(map, { theme });
    } catch {
      count++;
      console.info("[TripAgent map diagnostic] sample unavailable");
      return;
    }
    const fingerprint = JSON.stringify([
      report.zoom,
      report.issues,
      report.sampledLayers,
    ]);
    if (previous === fingerprint) return;
    previous = fingerprint;
    count++;
    console.info("[TripAgent map diagnostic] " + JSON.stringify(report));
  };
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(run, 200);
  };
  const missing = (event) => {
    if (
      !disposed &&
      !map.hasImage(event.id) &&
      !missingImages.has(event.id) &&
      missingImages.size < 16
    ) {
      missingImages.add(event.id);
      console.info(
        "[TripAgent map missing image] " +
          JSON.stringify({ theme, image: safeId(event.id) }),
      );
    }
  };
  map.on("idle", schedule);
  map.on("styleimagemissing", missing);
  schedule();
  return () => {
    disposed = true;
    clearTimeout(timer);
    map.off("idle", schedule);
    map.off("styleimagemissing", missing);
  };
}
