import test from "node:test";
import assert from "node:assert/strict";
import { callGeminiSafe } from "../src/utils/aiHelpers.js";

test("mode change aborts pending Gemini backoff without starting another request", async () => {
  const originalFetch = globalThis.fetch;
  const ref = { current: null };
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    queueMicrotask(() => ref.current.abort());
    return new Response("{}", { status: 429 });
  };
  try {
    await assert.rejects(
      callGeminiSafe({
        apiKey: "server",
        payload: {},
        abortControllerRef: ref,
      }),
      (error) => error.name === "AbortError",
    );
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("rejected grounding is surfaced directly without silently retrying without tools", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async (_url, options) => {
    calls++;
    assert.ok(JSON.parse(options.body).tools);
    return new Response(JSON.stringify({ code: "GROUNDING_REQUEST_FAILED" }), {
      status: 502,
    });
  };
  try {
    await assert.rejects(
      callGeminiSafe({
        apiKey: "server",
        payload: { tools: [{ googleMaps: {} }] },
        abortControllerRef: { current: null },
      }),
      /GROUNDING_REQUEST_FAILED/,
    );
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
