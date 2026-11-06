import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import engineUrl from "virtual:journal-map-engine-url";

let loading;
let attempts = 0;

// MapLibre 6 ships ES modules and a separate worker. Let Vite resolve and
// version those assets together instead of loading the removed UMD bundle.
export function loadJournalMapEngine() {
  if (window.maplibregl) return Promise.resolve(window.maplibregl);
  if (loading) return loading;
  const url = new URL(engineUrl, window.location.href);
  if (attempts++) url.searchParams.set("map-retry", String(attempts));
  loading = import(/* @vite-ignore */ url.href)
    .then((engine) => {
      engine.setWorkerUrl(workerUrl);
      window.maplibregl = engine;
      return engine;
    })
    .catch((cause) => {
      loading = null;
      throw new Error("地圖引擎暫時無法載入", { cause });
    });
  return loading;
}
