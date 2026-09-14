let mapLibrePromise;

export const loadMapLibre = () => {
  if (!mapLibrePromise) {
    mapLibrePromise = Promise.all([
      import("maplibre-gl"),
      import("maplibre-gl/dist/maplibre-gl.css"),
    ]).then(([module]) => module.default);
  }

  return mapLibrePromise;
};
