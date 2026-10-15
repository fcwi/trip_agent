import { tripCatalog } from "../config/tripCatalog.js";

const key = (name) => `trip_agent:auth:${name}`;
const oldKeys = (name) =>
  tripCatalog.map((trip) => `trip_agent:${trip.id}:${name}`);
const storageFor = (name) =>
  name === "password" ? sessionStorage : localStorage;

// Credentials authenticate the app; itinerary data remains scoped per trip.
export const authStorage = {
  getItem(name) {
    const storage = storageFor(name);
    const existing = storage.getItem(key(name));
    if (existing !== null) return existing;
    for (const legacy of oldKeys(name)) {
      const value = storage.getItem(legacy);
      if (value !== null) {
        storage.setItem(key(name), value);
        oldKeys(name).forEach((old) => storage.removeItem(old));
        return value;
      }
    }
    return null;
  },
  setItem(name, value) {
    storageFor(name).setItem(key(name), value);
  },
  removeItem(name) {
    const storage = storageFor(name);
    storage.removeItem(key(name));
    oldKeys(name).forEach((old) => storage.removeItem(old));
  },
};
