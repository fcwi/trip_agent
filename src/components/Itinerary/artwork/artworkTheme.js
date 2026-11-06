import { createContext, useContext } from "react";

// Manual appearance is authoritative; OS media queries must not override it.
export const ArtworkThemeContext = createContext(false);
export const useArtworkNight = () => useContext(ArtworkThemeContext);

// Optional art-directed raster replacements. Leave null to use the complete SVG
// day/night illustrations. Add assets before enabling a path to avoid 404s.
export const artworkImageSlots = {
  "2027_tohoku": { light: null, dark: null },
  "2026_karuizawa": { light: null, dark: null },
  "2026_busan": { light: null, dark: null },
};
export const artworkReservedPaths = {
  "2027_tohoku": {
    light: "artwork/tohoku-light.png",
    dark: "artwork/tohoku-dark.png",
  },
  "2026_karuizawa": {
    light: "artwork/karuizawa-light.png",
    dark: "artwork/karuizawa-dark.png",
  },
  "2026_busan": {
    light: "artwork/busan-light.png",
    dark: "artwork/busan-dark.png",
  },
};
