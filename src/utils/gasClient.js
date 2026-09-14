import { fetchGasWithRetry } from "./api.js";
import { tripNamespaceId } from "./tripStorage.js";

export const GAS_PLAIN_TEXT_HEADERS = Object.freeze({
  "Content-Type": "text/plain;charset=utf-8",
});

export const getGasTripId = () => tripNamespaceId;

export const withGasTripContext = (payload = {}) => ({
  ...payload,
  tripId: tripNamespaceId,
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
