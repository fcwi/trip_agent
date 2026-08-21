export class HttpError extends Error {
  constructor(response) {
    super(
      `HTTP ${response.status}: ${response.statusText || "Request failed"}`,
    );
    this.name = "HttpError";
    this.status = response.status;
  }
}

export class RequestTimeoutError extends Error {
  constructor(timeoutMs) {
    super(`Request timed out after ${timeoutMs}ms`);
    this.name = "RequestTimeoutError";
    this.timeoutMs = timeoutMs;
  }
}

const createRequestController = (parentSignal, timeoutMs) => {
  const controller = new AbortController();
  let didTimeout = false;

  const abortFromParent = () => controller.abort(parentSignal?.reason);
  if (parentSignal?.aborted) abortFromParent();
  else parentSignal?.addEventListener("abort", abortFromParent, { once: true });

  const timeoutId =
    timeoutMs > 0
      ? setTimeout(() => {
          didTimeout = true;
          controller.abort();
        }, timeoutMs)
      : null;

  return {
    signal: controller.signal,
    didTimeout: () => didTimeout,
    cleanup: () => {
      if (timeoutId !== null) clearTimeout(timeoutId);
      parentSignal?.removeEventListener("abort", abortFromParent);
    },
  };
};

export const fetchJson = async (
  url,
  { timeoutMs = 15000, fetchImpl = fetch, signal, ...options } = {},
) => {
  const requestController = createRequestController(signal, timeoutMs);

  try {
    const response = await fetchImpl(url, {
      ...options,
      signal: requestController.signal,
    });

    if (!response.ok) throw new HttpError(response);
    return await response.json();
  } catch (error) {
    if (requestController.didTimeout()) {
      throw new RequestTimeoutError(timeoutMs);
    }
    throw error;
  } finally {
    requestController.cleanup();
  }
};

export const waitForRetry = (delayMs, signal) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason || new DOMException("Aborted", "AbortError"));
      return;
    }

    const handleAbort = () => {
      clearTimeout(timeoutId);
      reject(signal.reason || new DOMException("Aborted", "AbortError"));
    };
    const timeoutId = setTimeout(() => {
      signal?.removeEventListener("abort", handleAbort);
      resolve();
    }, delayMs);

    signal?.addEventListener("abort", handleAbort, { once: true });
  });

/**
 * 使用指數退避處理 Google Apps Script 的 Busy 回應。
 */
export async function fetchGasWithRetry(
  url,
  options = {},
  retries = 3,
  backoff = 1000,
) {
  const { timeoutMs = 15000, signal, ...fetchOptions } = options;
  const data = await fetchJson(url, {
    ...fetchOptions,
    signal,
    timeoutMs,
  });

  const isBusy =
    data.status === "error" &&
    (data.message === "Busy" || data.message?.includes("Server is busy"));

  if (!isBusy) return data;
  if (retries <= 0) throw new Error("GAS busy, max retries reached.");

  await waitForRetry(backoff, signal);
  return fetchGasWithRetry(
    url,
    { ...fetchOptions, signal, timeoutMs },
    retries - 1,
    backoff * 2,
  );
}
