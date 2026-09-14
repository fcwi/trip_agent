import { fetchJson } from "./api.js";
import {
  addGasTripContextToPayload,
  addGasTripContextToUrl,
} from "./gasTripContextCore.js";
import { GasResponseError, requireGasSuccess } from "./gasResponse.js";

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
    const result = await fetchJson(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      signal,
      timeoutMs: 20000,
      ...(fetchImpl ? { fetchImpl } : {}),
    });
    return requireGasSuccess(result, [gasToken, gasUrl]);
  } catch (error) {
    if (error instanceof GasResponseError) throw error;
    throw new Error("無法連線至雲端服務，請檢查網路後重試", {
      cause: error,
    });
  }
};

export const fetchFromGasWithContext = async ({
  gasUrl,
  gasToken,
  context,
  signal,
  fetchImpl,
}) => {
  if (!gasUrl || !gasToken) return [];

  const requestUrl = new URL(gasUrl);
  requestUrl.searchParams.set("token", gasToken);
  requestUrl.searchParams.set("action", "getAll");
  const url = addGasTripContextToUrl(requestUrl.toString(), context);
  const result = await fetchJson(url, {
    method: "GET",
    signal,
    timeoutMs: 20000,
    ...(fetchImpl ? { fetchImpl } : {}),
  });
  requireGasSuccess(result, [gasToken, gasUrl]);
  if (!Array.isArray(result.data)) {
    throw new GasResponseError({ status: "error", code: "INVALID_PAYLOAD" });
  }
  return result.data;
};
