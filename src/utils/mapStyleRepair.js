// The reported MapTiler light and dark water_label text-size evaluates nullable tile data.
// A camera-only size avoids that dependency while retaining gradual zoom scaling.
export function repairMapStyle(style) {
  if (!Array.isArray(style?.layers)) return style;
  let changed = false;
  const layers = style.layers.map((layer) => {
    if (
      layer.id !== "Sea labels" ||
      layer.type !== "symbol" ||
      layer.source !== "maptiler_planet_v4" ||
      layer["source-layer"] !== "water_label"
    )
      return layer;
    changed = true;
    return {
      ...layer,
      layout: {
        ...layer.layout,
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0,
          12,
          6,
          16,
          12,
          20,
        ],
      },
    };
  });
  return changed ? { ...style, layers } : style;
}

// Some regional tiles request a road shield with an empty suffix. There is no
// corresponding sprite. Keep that optional shield invisible, preserving labels
// and leaving every other missing image available for normal error reporting.
export function supplyEmptyRoadShield(map, { id }) {
  if (id !== "transportation:road_" || map.hasImage(id)) return;
  map.addImage(id, {
    width: 1,
    height: 1,
    data: new Uint8Array(4),
  });
}
