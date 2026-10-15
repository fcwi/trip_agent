import { resolveTripId } from "../config/tripCatalog.js";

// Switching trips navigates to a new document so every store, request and
// database starts with the same immutable trip context.
export const activeTripId = resolveTripId(
  typeof window === "undefined" ? "" : window.location.search,
);
