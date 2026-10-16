import test from "node:test";
import assert from "node:assert/strict";
import {
  createWeatherClient,
  WEATHER_TTL_MS,
  WeatherRateLimitError,
} from "../src/utils/weatherClient.js";
const url =
  "https://api.open-meteo.com/v1/forecast?latitude=39&longitude=140&daily=weathercode";
const data = { daily: { time: ["2026-10-16"], weathercode: [0] } };
const store = () => {
  const values = {};
  return {
    getItem: (key) => values[key] ?? null,
    setItem: (key, value) => {
      values[key] = value;
    },
    removeItem: (key) => {
      delete values[key];
    },
  };
};
test("a network timeout is reported as a failure rather than a caller cancellation", async () => {
  const client = createWeatherClient({
    storage: () => null,
    fetchFn: async () => {
      throw new DOMException("Aborted", "AbortError");
    },
  });
  await assert.rejects(
    client.request(url),
    (error) => error.name !== "AbortError" && /timed out/.test(error.message),
  );
});
test("weather reuses fresh public forecasts after navigation and expires them without changing their timestamp", async () => {
  const storage = store();
  let time = 1000000;
  let calls = 0;
  const options = {
    storage: () => storage,
    now: () => time,
    fetchFn: async () => {
      calls++;
      return Response.json(data);
    },
  };
  let client = createWeatherClient(options);
  await client.request(url);
  const at = client.updatedAt(url);
  time += 1000;
  client = createWeatherClient(options);
  await client.request(url);
  assert.equal(calls, 1);
  assert.equal(client.updatedAt(url), at);
  time += WEATHER_TTL_MS;
  await client.request(url);
  assert.equal(calls, 2);
});
test("weather merges concurrent requests and an aborted caller cannot cancel another caller", async () => {
  let finish;
  let calls = 0;
  const client = createWeatherClient({
    storage: () => null,
    fetchFn: () => {
      calls++;
      return new Promise((resolve) => {
        finish = resolve;
      });
    },
  });
  const controller = new AbortController();
  const first = client.request(url, { signal: controller.signal });
  const second = client.request(url);
  const aborted = assert.rejects(first, { name: "AbortError" });
  controller.abort();
  await aborted;
  finish(Response.json(data));
  assert.deepEqual(await second, data);
  assert.equal(calls, 1);
});
test("429 cooldown spans endpoints and page reloads, honors Retry-After, then permits recovery", async () => {
  let time = Date.parse("2026-10-16T01:00:00Z");
  let calls = 0;
  let limited = true;
  const storage = store();
  const options = {
    storage: () => storage,
    now: () => time,
    fetchFn: async () => {
      calls++;
      return limited
        ? new Response("", { status: 429, headers: { "Retry-After": "120" } })
        : Response.json(data);
    },
  };
  let client = createWeatherClient(options);
  await assert.rejects(client.request(url), WeatherRateLimitError);
  client = createWeatherClient(options);
  time += 61000;
  await assert.rejects(
    client.request(url.replace("39", "40")),
    WeatherRateLimitError,
  );
  assert.equal(calls, 1);
  time += 60000;
  limited = false;
  await client.request(url);
  assert.equal(calls, 2);
});
test("429 accepts HTTP dates and missing headers use a minimum one-minute pause", async () => {
  for (const header of ["Fri, 16 Oct 2026 01:02:00 GMT", null]) {
    const time = Date.parse("2026-10-16T01:00:00Z");
    const client = createWeatherClient({
      now: () => time,
      storage: () => null,
      fetchFn: async () =>
        new Response("", {
          status: 429,
          headers: header ? { "Retry-After": header } : {},
        }),
    });
    await assert.rejects(client.request(url), WeatherRateLimitError);
    assert.equal(client.retryAt() - time, header ? 120000 : 60000);
  }
});
test("failed forecasts are retryable, and current-position queries are never persisted", async () => {
  const storage = store();
  let calls = 0;
  const client = createWeatherClient({
    storage: () => storage,
    fetchFn: async () =>
      ++calls === 1 ? new Response("", { status: 503 }) : Response.json(data),
  });
  await assert.rejects(client.request(url));
  await client.request(url + "&current_weather=true");
  let nextCalls = 0;
  const next = createWeatherClient({
    storage: () => storage,
    fetchFn: async () => {
      nextCalls++;
      return Response.json(data);
    },
  });
  await next.request(url + "&current_weather=true");
  assert.equal(nextCalls, 1);
});
