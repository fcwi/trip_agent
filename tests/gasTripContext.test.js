import assert from "node:assert/strict";
import test from "node:test";
import {
  addGasTripContextToPayload,
  addGasTripContextToUrl,
  createGasTripContext,
} from "../src/utils/gasTripContextCore.js";
import {
  fetchFromGasWithContext,
  fetchLocationsFromGasWithContext,
  uploadToGasWithContext,
} from "../src/utils/gasClient.js";
import { GasResponseError } from "../src/utils/gasResponse.js";

const jsonResponse = (data) => ({
  ok: true,
  status: 200,
  statusText: "OK",
  json: async () => data,
});

test("creates distinct GAS contexts for different trips", () => {
  assert.deepEqual(createGasTripContext({ tripId: "2026_busan" }), {
    tripId: "2026_busan",
    gasPropertyKey: "",
  });
  assert.deepEqual(createGasTripContext({ tripId: "2026_karuizawa" }), {
    tripId: "2026_karuizawa",
    gasPropertyKey: "",
  });
});

test("adds trip context to every POST action without an empty property key", async () => {
  const context = createGasTripContext({ tripId: "2026_busan" });
  const actions = [
    ["add", { action: "add", type: "finance", id: "record-1" }],
    ["addBatch", { action: "addBatch", type: "finance", items: [] }],
    ["edit", { action: "edit", type: "finance", id: "record-1" }],
    ["delete", { action: "delete", type: "finance", id: "record-1" }],
    [
      "add",
      {
        action: "add",
        type: "location",
        id: "location-1",
        lat: 35.1,
        lon: 129.04,
      },
    ],
  ];

  for (const [expectedAction, data] of actions) {
    let requestBody;
    await uploadToGasWithContext({
      data,
      gasUrl: "https://example.com/gas",
      gasToken: "private-token",
      context,
      fetchImpl: async (_url, options) => {
        requestBody = JSON.parse(options.body);
        return jsonResponse({ status: "success" });
      },
    });

    assert.equal(requestBody.action, expectedAction);
    assert.equal(requestBody.tripId, "2026_busan");
    assert.equal("gasPropertyKey" in requestBody, false);
  }
});

test("adds and encodes optional context values in GET URLs", () => {
  const context = createGasTripContext({
    tripId: "2026_karuizawa",
    gasPropertyKey: "trip_agent_family trip",
  });
  const result = new URL(
    addGasTripContextToUrl("https://example.com/gas?action=getAll", context),
  );

  assert.equal(result.searchParams.get("tripId"), "2026_karuizawa");
  assert.equal(
    result.searchParams.get("gasPropertyKey"),
    "trip_agent_family trip",
  );
});

test("adds tripId to getAll and getLocations URLs without an empty property key", async () => {
  const context = createGasTripContext({ tripId: "2026_karuizawa" });
  const captured = [];

  const fetchImpl = async (url) => {
    captured.push(new URL(url));
    return jsonResponse({ status: "success", data: [] });
  };

  await fetchFromGasWithContext({
    gasUrl: "https://example.com/gas",
    gasToken: "private-token",
    context,
    fetchImpl,
  });
  await fetchLocationsFromGasWithContext({
    gasUrl: "https://example.com/gas",
    gasToken: "private-token",
    context,
    fetchImpl,
  });

  assert.equal(captured[0].searchParams.get("action"), "getAll");
  assert.equal(captured[1].searchParams.get("action"), "getLocations");
  for (const url of captured) {
    assert.equal(url.searchParams.get("tripId"), "2026_karuizawa");
    assert.equal(url.searchParams.has("gasPropertyKey"), false);
  }
});

test("adds custom property keys to POST payloads only when present", () => {
  const withoutKey = addGasTripContextToPayload(
    { action: "add" },
    createGasTripContext({ tripId: "2026_busan" }),
  );
  const withKey = addGasTripContextToPayload(
    { action: "add" },
    createGasTripContext({
      tripId: "2026_busan",
      gasPropertyKey: "trip_agent_2026_busan",
    }),
  );

  assert.equal("gasPropertyKey" in withoutKey, false);
  assert.equal(withKey.gasPropertyKey, "trip_agent_2026_busan");
});

test("does not turn GAS error or partial responses into successful reads", async () => {
  const context = createGasTripContext({ tripId: "2026_busan" });
  for (const response of [
    { status: "error", code: "SCHEMA_MISMATCH" },
    {
      status: "partial",
      code: "IMAGE_UPLOAD_FAILED",
      imageFailureIds: ["record-1"],
    },
  ]) {
    await assert.rejects(
      fetchFromGasWithContext({
        gasUrl: "https://example.com/gas",
        gasToken: "private-token",
        context,
        fetchImpl: async () => jsonResponse(response),
      }),
      (error) =>
        error instanceof GasResponseError && error.status === response.status,
    );
  }
});

test("redacts a token echoed by an unknown GAS error", async () => {
  const gasToken = "private-token-that-must-not-leak";
  const context = createGasTripContext({ tripId: "2026_busan" });

  await assert.rejects(
    uploadToGasWithContext({
      data: { action: "add", type: "finance", id: "record-1" },
      gasUrl: "https://example.com/gas",
      gasToken,
      context,
      fetchImpl: async () =>
        jsonResponse({
          status: "error",
          code: "UNKNOWN",
          message: `Rejected ${gasToken}`,
        }),
    }),
    (error) =>
      error instanceof GasResponseError &&
      !error.message.includes(gasToken) &&
      error.message.includes("[已隱藏]"),
  );
});
