import React from "react";
import { createRoot } from "react-dom/client";
import CalculatorModal from "../../src/components/CalculatorModal.jsx";
import WeatherDetail from "../../src/components/WeatherDetail.jsx";

export function mountTool(kind, dark, options = {}) {
  document.getElementById("root")?.remove();
  const host = document.createElement("main");
  host.className =
    "travel-shell fixed inset-0 flex items-center justify-center p-4";
  host.dataset.editorial = "true";
  host.dataset.theme = dark ? "dark" : "light";
  document.documentElement.classList.toggle("dark", dark);
  document.body.append(host);
  const root = createRoot(host);
  const close = () => {
    root.unmount();
    host.remove();
  };
  const days = Array.from({ length: 7 }, (_, i) => `2027-01-${22 + i}`);
  const hours = Array.from(
    { length: 12 },
    (_, i) => `2027-01-22T${String(i + 8).padStart(2, "0")}:00`,
  );
  const weather = {
    locationName: "森吉山阿仁滑雪場",
    temp: -3,
    desc: "小雪",
    updatedAt: "2027-01-22T08:00:00Z",
    hourly: {
      time: hours,
      temperature_2m: hours.map(() => -3),
      apparent_temperature: [-6],
      uv_index: [1],
      wind_speed_10m: [12],
      relative_humidity_2m: [80],
      precipitation_probability: hours.map(() => 50),
      weathercode: hours.map(() => 71),
    },
    daily: {
      time: days,
      temperature_2m_max: [0, 2, 1, 0, -1, 2, 3],
      temperature_2m_min: [-6, -4, -5, -6, -7, -4, -3],
      sunrise: days.map((day) => day + "T07:00"),
      sunset: days.map((day) => day + "T16:30"),
      weathercode: days.map(() => 71),
      precipitation_probability_max: days.map(() => 60),
    },
  };
  let currentOptions = options;
  const render = () =>
    root.render(
      kind === "calculator" ? (
        <CalculatorModal
          isOpen
          isDarkMode={dark}
          currencyCode="JPY"
          currencyTarget="TWD"
          rateData={currentOptions.rateData || { current: 0.2, loading: false }}
          onClose={close}
        />
      ) : (
        <WeatherDetail
          weather={currentOptions.weather || weather}
          loading={currentOptions.loading}
          isDarkMode={dark}
          advice="雪地行走請注意防滑，備妥手套與毛帽。"
          onClose={close}
          onRefresh={currentOptions.onRefresh || (() => {})}
        />
      ),
    );
  window.updateToolFixture = (patch) => {
    currentOptions = { ...currentOptions, ...patch };
    render();
  };
  render();
}
