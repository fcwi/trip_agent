import assert from "node:assert/strict";
import test from "node:test";
import {
  fetchGasWithRetry,
  fetchJson,
  HttpError,
  RequestTimeoutError,
} from "../src/utils/api.js";

const jsonResponse = (data, { ok = true, status = 200 } = {}) => ({
  ok,
  status,
  statusText: ok ? "OK" : "Failed",
  json: async () => data,
});

test("fetchJson parses a successful response", async () => {
  const result = await fetchJson("https://example.com/data", {
    fetchImpl: async () => jsonResponse({ status: "ok" }),
  });

  assert.deepEqual(result, { status: "ok" });
});

test("fetchJson exposes HTTP status for callers", async () => {
  await assert.rejects(
    fetchJson("https://example.com/failure", {
      fetchImpl: async () => jsonResponse({}, { ok: false, status: 503 }),
    }),
    (error) => error instanceof HttpError && error.status === 503,
  );
});

test("fetchJson aborts requests that exceed the timeout", async () => {
  const neverCompletes = (_url, { signal }) =>
    new Promise((_resolve, reject) => {
      signal.addEventListener(
        "abort",
        () => reject(new DOMException("Aborted", "AbortError")),
        { once: true },
      );
    });

  await assert.rejects(
    fetchJson("https://example.com/slow", {
      fetchImpl: neverCompletes,
      timeoutMs: 5,
    }),
    RequestTimeoutError,
  );
});

test("fetchJson preserves caller cancellation", async () => {
  const controller = new AbortController();
  const reason = new DOMException("User cancelled", "AbortError");
  controller.abort(reason);

  await assert.rejects(
    fetchJson("https://example.com/cancelled", {
      signal: controller.signal,
      fetchImpl: async (_url, { signal }) => {
        if (signal.aborted) throw signal.reason;
        return jsonResponse({});
      },
    }),
    (error) => error === reason,
  );
});

test("fetchGasWithRetry retries Busy responses", async () => {
  let attempts = 0;
  const fetchImpl = async () => {
    attempts += 1;
    return jsonResponse(
      attempts === 1
        ? { status: "error", message: "Busy" }
        : { status: "success", data: [] },
    );
  };

  const result = await fetchGasWithRetry(
    "https://example.com/gas",
    { fetchImpl },
    1,
    1,
  );

  assert.equal(attempts, 2);
  assert.equal(result.status, "success");
});
