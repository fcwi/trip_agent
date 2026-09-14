import { useEffect, useState } from "react";
import { loadMapLibre } from "../utils/loadMapLibre.js";

export const useMapLibre = () => {
  const [maplibregl, setMaplibregl] = useState(null);

  useEffect(() => {
    let cancelled = false;

    loadMapLibre()
      .then((library) => {
        if (!cancelled) setMaplibregl(library);
      })
      .catch((error) => {
        console.error("MapLibre 載入失敗:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return maplibregl;
};
