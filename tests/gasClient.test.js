import assert from "node:assert/strict";
import test from "node:test";
import {
  buildGasActionRequest,
  gasTripPropertyKey,
} from "../src/utils/gasClient.js";

test("GAS action requests keep the token in the POST body", () => {
  const request = buildGasActionRequest("secret-gas-token", "getAll");
  const payload = JSON.parse(request.body);

  assert.equal(request.method, "POST");
  assert.equal(payload.type, "query");
  assert.equal(payload.token, "secret-gas-token");
  assert.equal(payload.action, "getAll");
  assert.equal(request.headers["Content-Type"], "text/plain;charset=utf-8");
  assert.equal(typeof payload.tripId, "string");
  assert.equal(payload.tripId.length > 0, true);
  assert.equal(payload.gasPropertyKey, `trip_agent_${payload.tripId}`);
});

test("GAS action requests keep the built-in tripId and property key", () => {
  const request = buildGasActionRequest("secret-gas-token", "getLocations", {
    tripId: "forged-trip",
    gasPropertyKey: "AUTH_TOKEN",
  });
  const payload = JSON.parse(request.body);

  assert.notEqual(payload.tripId, "forged-trip");
  assert.notEqual(payload.gasPropertyKey, "AUTH_TOKEN");
  assert.equal(typeof payload.tripId, "string");
  assert.equal(payload.tripId.length > 0, true);
  assert.equal(payload.gasPropertyKey, `trip_agent_${payload.tripId}`);
});

test("GAS property keys default to trip_agent_{tripId}", () => {
  assert.equal(gasTripPropertyKey("2026_busan"), "trip_agent_2026_busan");
  assert.equal(gasTripPropertyKey("busan2026"), "trip_agent_busan2026");
});

test("GAS property keys accept a trip_agent_* override", () => {
  assert.equal(
    gasTripPropertyKey("2026_busan", "trip_agent_busan2026"),
    "trip_agent_busan2026",
  );
  assert.equal(
    gasTripPropertyKey("2026_busan", "AUTH_TOKEN"),
    "trip_agent_2026_busan",
  );
  assert.equal(
    gasTripPropertyKey("2026_busan", "trip_agent_"),
    "trip_agent_2026_busan",
  );
});
