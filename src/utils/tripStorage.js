import { tripConfig } from "@trip-data";

export const tripNamespaceId = String(tripConfig.id).replace(
  /[^a-z0-9_-]/gi,
  "_",
);
const PREFIX = `trip_agent:${tripNamespaceId}`;

const legacyDatabaseNames = {
  aiChat: "trip_agent_aiChatDB",
  finance: "trip_agent_financeDB",
  images: "trip_agent_TokyoTripDB",
};

export const getTripDatabaseName = (type) => {
  if (tripNamespaceId === "2026_busan" && legacyDatabaseNames[type]) {
    return legacyDatabaseNames[type];
  }
  return `trip_agent_${tripNamespaceId}_${type}DB`;
};

export const tripDatabaseNames = new Set([
  getTripDatabaseName("aiChat"),
  getTripDatabaseName("finance"),
  getTripDatabaseName("images"),
]);

export const tripStorageKey = (name) => `${PREFIX}:${name}`;

export const tripStorage = {
  getItem(name, legacyKeys = []) {
    const scopedKey = tripStorageKey(name);
    const scopedValue = localStorage.getItem(scopedKey);
    if (scopedValue !== null) return scopedValue;

    for (const legacyKey of legacyKeys) {
      const legacyValue = localStorage.getItem(legacyKey);
      if (legacyValue !== null) {
        localStorage.setItem(scopedKey, legacyValue);
        return legacyValue;
      }
    }
    return null;
  },

  setItem(name, value) {
    localStorage.setItem(tripStorageKey(name), String(value));
  },

  removeItem(name) {
    localStorage.removeItem(tripStorageKey(name));
  },

  clear() {
    const keys = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith(`${PREFIX}:`)) keys.push(key);
    }
    keys.forEach((key) => localStorage.removeItem(key));
  },
};

export const tripSessionStorage = {
  getItem(name) {
    return sessionStorage.getItem(tripStorageKey(name));
  },

  setItem(name, value) {
    sessionStorage.setItem(tripStorageKey(name), String(value));
  },

  removeItem(name) {
    sessionStorage.removeItem(tripStorageKey(name));
  },
};
