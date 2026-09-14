import { tripConfig } from "@trip-data";
import {
  addGasTripContextToPayload,
  addGasTripContextToUrl,
  createGasTripContext,
} from "./gasTripContextCore.js";

export const gasTripContext = createGasTripContext({
  tripId: tripConfig.id,
  gasPropertyKey: import.meta.env?.VITE_GAS_TRIP_PROPERTY_KEY?.trim() || "",
});

export const withGasTripContext = (payload, context = gasTripContext) =>
  addGasTripContextToPayload(payload, context);

export const withGasTripContextUrl = (url, context = gasTripContext) =>
  addGasTripContextToUrl(url, context);
