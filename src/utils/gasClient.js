import { fetchGasWithRetry } from "./api.js";
import { addGasTripContextToPayload } from "./gasTripContextCore.js";
import { GasResponseError, requireGasSuccess } from "./gasResponse.js";

const requestGas = async (url, options) => {
  const { fetchImpl, signal, timeoutMs = 20000, ...fetchOptions } = options;
  return fetchGasWithRetry(url, {
    ...fetchOptions,
    signal,
    timeoutMs,
    ...(fetchImpl ? { fetchImpl } : {}),
  });
};

export const uploadToGasWithContext = async ({
  data,
  gasUrl,
  gasToken,
  context,
  signal,
  fetchImpl,
}) => {
  if (!gasUrl || !gasToken) {
    throw new Error("GAS 設定未完成 (URL 或 Token 缺失)");
  }

  const payload = {
    ...addGasTripContextToPayload(data, context),
    token: gasToken,
  };
  try {
    const result = await requestGas(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      signal,
      fetchImpl,
    });
    return requireGasSuccess(result, [gasToken, gasUrl]);
  } catch (error) {
    if (error instanceof GasResponseError) throw error;
    throw new Error("無法連線至雲端服務，請檢查網路後重試", {
      cause: error,
    });
  }
};

const fetchGasAction = async ({
  gasUrl,
  gasToken,
  context,
  action,
  signal,
  fetchImpl,
}) => {
  if (!gasUrl || !gasToken) return [];

  const result = await uploadToGasWithContext({
    data: { action },
    gasUrl,
    gasToken,
    context,
    signal,
    fetchImpl,
  });
  if (!Array.isArray(result.data)) {
    throw new GasResponseError({ status: "error", code: "INVALID_PAYLOAD" });
  }
  return result.data;
};

export const fetchFromGasWithContext = (options) =>
  fetchGasAction({ ...options, action: "getAll" });

export const fetchLocationsFromGasWithContext = (options) =>
  fetchGasAction({ ...options, action: "getLocations" });
