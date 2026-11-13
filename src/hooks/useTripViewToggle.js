import { useState } from "react";
import { tripStorage } from "../utils/tripStorage.js";

export function useTripViewToggle(key) {
  const [enabled, setEnabled] = useState(() => {
    try {
      return tripStorage.getItem(key) === "true";
    } catch {
      return false;
    }
  });

  const update = (next) => {
    setEnabled(next);
    try {
      tripStorage.setItem(key, next);
    } catch {
      // Keep the selection usable when browser storage is unavailable.
    }
  };

  return [enabled, update];
}
