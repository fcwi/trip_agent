import { assertTripData } from "../utils/tripValidation.js";
import { activeTripId } from "../utils/activeTrip.js";
import { getTripSummary } from "./tripCatalog.js";

const sources = import.meta.glob("../trip/tripdata_*.jsx", { eager: true });
const source = sources[`../trip/tripdata_${activeTripId}.jsx`];

assertTripData(source);

const rawConfig = source.tripConfig;
const summary = getTripSummary(activeTripId);
if (
  rawConfig.id !== activeTripId ||
  rawConfig.startDate.slice(0, 10) !== summary.startDate ||
  rawConfig.endDate.slice(0, 10) !== summary.endDate ||
  rawConfig.timeZone !== summary.timeZone
) {
  throw new Error(
    "旅程目錄與行程資料的 ID、日期或時區不一致，請更新旅程設定。",
  );
}

export const tripConfig = Object.freeze({
  ...rawConfig,
  id: activeTripId,
  artwork: Object.freeze(summary.artwork),
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
