import * as source from "@trip-data-source";
import { assertTripData } from "../utils/tripValidation.js";

assertTripData(source);

const rawConfig = source.tripConfig;

const activeTripId =
  import.meta.env.VITE_TRIP_ID || rawConfig.id || "default-trip";

export const tripConfig = Object.freeze({
  ...rawConfig,
  id: activeTripId,
  currency: Object.freeze({
    ...rawConfig.currency,
    code: rawConfig.currency.code.toLowerCase(),
    source: rawConfig.currency.source.toUpperCase(),
    target: rawConfig.currency.target.toUpperCase(),
  }),
  meta: Object.freeze({
    ...rawConfig.meta,
    shortName: rawConfig.meta.shortName || rawConfig.meta.title.slice(0, 12),
  }),
});

export const itineraryData = source.itineraryData;
export const guidesData = source.guidesData;
export const usefulLinks = source.usefulLinks;
export const shopGuideData = source.shopGuideData;
export const checklistData = source.checklistData;
