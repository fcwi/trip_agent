import { fetchGasWithRetry } from "./api.js";
import { tripNamespaceId } from "./tripStorage.js";

export const GAS_PLAIN_TEXT_HEADERS = Object.freeze({
  "Content-Type": "text/plain;charset=utf-8",
});

export const GAS_TRIP_PROPERTY_KEY_PATTERN =
  /^trip_agent_[a-z0-9][a-z0-9_-]*$/i;

export const getGasTripId = () => tripNamespaceId;

/** Apps Script 指令碼屬性名稱：預設 `trip_agent_{VITE_TRIP_ID}`。 */
export const gasTripPropertyKey = (
  tripId = tripNamespaceId,
  overrideKey = "",
) => {
  const custom = String(overrideKey || "").trim();
  if (custom && GAS_TRIP_PROPERTY_KEY_PATTERN.test(custom)) {
    return custom;
  }
  return `trip_agent_${String(tripId || "").trim()}`;
};

const configuredGasPropertyKey = String(
  import.meta.env?.VITE_GAS_TRIP_PROPERTY_KEY || "",
).trim();

export const withGasTripContext = (payload = {}) => ({
  ...payload,
  tripId: tripNamespaceId,
  gasPropertyKey: gasTripPropertyKey(tripNamespaceId, configuredGasPropertyKey),
});

export const buildGasActionRequest = (gasToken, action, extra = {}) => {
  if (!gasToken) throw new Error("GAS Token 缺失");
  if (!action) throw new Error("GAS action 缺失");

  return {
    method: "POST",
    headers: GAS_PLAIN_TEXT_HEADERS,
    body: JSON.stringify(
      withGasTripContext({
        type: "query",
        token: gasToken,
        action,
        ...extra,
      }),
    ),
  };
};

export const fetchGasAction = async (
  gasUrl,
  gasToken,
  action,
  extra = {},
  options = {},
) => {
  if (!gasUrl || !gasToken) return null;

  const { signal, timeoutMs = 20000, fetchImpl } = options;
  return fetchGasWithRetry(gasUrl, {
    ...buildGasActionRequest(gasToken, action, extra),
    signal,
    timeoutMs,
    fetchImpl,
  });
};
