import engineUrl from "maplibre-gl/dist/maplibre-gl.js?url";

let loading;

// A failed native module import is remembered for the life of the document.
// The packaged browser build can retry a failed download without reloading
// the trip or losing the reader's current position.
export function loadJournalMapEngine() {
  if (window.maplibregl) return Promise.resolve(window.maplibregl);
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    let settled = false;
    const script = document.createElement("script");
    script.src = engineUrl;
    script.async = true;
    const fail = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      script.remove();
      loading = null;
      reject(new Error("地圖引擎暫時無法載入"));
    };
    const timeout = setTimeout(fail, 12000);
    script.onerror = fail;
    script.onload = () => {
      if (settled) return;
      clearTimeout(timeout);
      script.remove();
      if (window.maplibregl) {
        settled = true;
        resolve(window.maplibregl);
      } else fail();
    };
    document.head.appendChild(script);
  });
  return loading;
}
