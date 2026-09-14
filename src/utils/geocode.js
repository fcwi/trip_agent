import { fetchJson } from "./api.js";

export const buildNominatimReverseUrl = (latitude, longitude) => {
  const params = new URLSearchParams({
    format: "json",
    lat: String(latitude),
    lon: String(longitude),
    "accept-language": "zh-TW",
    zoom: "18",
  });

  return `https://nominatim.openstreetmap.org/reverse?${params.toString()}`;
};

export const reverseGeocode = async (
  latitude,
  longitude,
  { signal, fetchImpl } = {},
) => {
  const siteUrl = String(import.meta.env?.VITE_PUBLIC_SITE_URL || "")
    .trim()
    .replace(/\/$/, "");

  return fetchJson(buildNominatimReverseUrl(latitude, longitude), {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(siteUrl ? { "Accept-Language": "zh-TW" } : {}),
    },
    referrer: siteUrl || undefined,
    referrerPolicy: "origin",
    signal,
    timeoutMs: 10000,
    fetchImpl,
  });
};
