import { useCallback, useRef } from "react";
import {
  fetchGooglePlaces as fetchGooglePlacesRequest,
  getBestPOI as getBestPOIRequest,
  lookupReverseGeoName as lookupReverseGeoNameRequest,
} from "../utils/geoPlaces.js";
import { logger } from "../utils/logger.js";

const debugLog = (...args) => logger.debug(...args);

/**
 * Places / reverse-geocode cache + abort controllers.
 * Behavior-equivalent extraction from AuthenticatedTripApp.
 */
export const useGeoPlaces = ({ mapsApiKey }) => {
  const mapsAbortControllerRef = useRef(null);
  const googlePlacesCacheRef = useRef({});
  const geoNamesCacheRef = useRef({});

  const fetchGooglePlaces = useCallback(
    (lat, lng, initialRadius = 100) =>
      fetchGooglePlacesRequest({
        lat,
        lng,
        initialRadius,
        mapsApiKey,
        cacheRef: googlePlacesCacheRef,
        abortControllerRef: mapsAbortControllerRef,
        debugLog,
      }),
    [mapsApiKey],
  );

  const getBestPOI = useCallback(
    (latitude, longitude) =>
      getBestPOIRequest({
        latitude,
        longitude,
        mapsApiKey,
        cacheRef: googlePlacesCacheRef,
        abortControllerRef: mapsAbortControllerRef,
        debugLog,
      }),
    [mapsApiKey],
  );

  const lookupReverseGeoName = useCallback(
    (latitude, longitude) =>
      lookupReverseGeoNameRequest({
        latitude,
        longitude,
        cacheRef: geoNamesCacheRef,
        debugLog,
      }),
    [],
  );

  const abortPlacesRequests = useCallback(() => {
    mapsAbortControllerRef.current?.abort();
  }, []);

  return {
    fetchGooglePlaces,
    getBestPOI,
    lookupReverseGeoName,
    abortPlacesRequests,
  };
};
