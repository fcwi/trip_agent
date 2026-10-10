import React from "react";
import { createRoot } from "react-dom/client";
import DayMap from "../../src/components/DayMap.jsx";

// Render the production map component with controlled coordinates and credentials.
let fixtureRoot;
export function mountMap(options = {}) {
  fixtureRoot?.unmount();
  document.getElementById("root")?.remove();
  document.getElementById("map-fixture")?.remove();
  const host = document.createElement("main");
  host.id = "map-fixture";
  host.className = "travel-shell";
  host.dataset.editorial = "true";
  host.dataset.theme = options.isDarkMode ? "dark" : "light";
  document.body.append(host);
  fixtureRoot = createRoot(host);
  fixtureRoot.render(
    <DayMap
      events={[
        { title: "仙台空港", time: "09:00", lon: 140.917, lat: 38.139 },
        { title: "尚未確定的午餐地點", time: "12:00" },
        { title: "山形站", time: "15:00", lon: 140.327, lat: 38.248 },
      ]}
      MAPTILER_KEY="e2e-map-key"
      {...options}
    />,
  );
}
