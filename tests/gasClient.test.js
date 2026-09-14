import assert from "node:assert/strict";
import test from "node:test";
import { buildGasActionRequest } from "../src/utils/gasClient.js";

test("GAS action requests keep the token in the POST body", () => {
  const request = buildGasActionRequest("secret-gas-token", "getAll");
  const payload = JSON.parse(request.body);

  assert.equal(request.method, "POST");
  assert.equal(payload.type, "query");
  assert.equal(payload.token, "secret-gas-token");
  assert.equal(payload.action, "getAll");
  assert.equal(request.headers["Content-Type"], "text/plain;charset=utf-8");
});
