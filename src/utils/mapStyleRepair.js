// The reported MapTiler dark water_label text-size evaluates nullable tile data.
// A camera-only size avoids that dependency while retaining gradual zoom scaling.
export function repairMapStyle(style, { isDarkMode = false } = {}) {
  if (!isDarkMode || !Array.isArray(style?.layers)) return style;
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
