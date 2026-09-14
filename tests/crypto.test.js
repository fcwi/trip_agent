import assert from "node:assert/strict";
import test from "node:test";
import { CryptoUtils } from "../src/utils/crypto.js";

test("encrypt and decrypt round-trip with the same password", async () => {
  const packed = await CryptoUtils.encrypt("gemini-secret", "trip-password");
  assert.match(packed, /^[0-9a-f]+:[0-9a-f]+:[0-9a-f]+$/i);
  assert.equal(
    await CryptoUtils.decrypt(packed, "trip-password"),
    "gemini-secret",
  );
});

test("decrypt rejects an incorrect password", async () => {
  const packed = await CryptoUtils.encrypt("gemini-secret", "trip-password");
  await assert.rejects(
    CryptoUtils.decrypt(packed, "wrong-password"),
    /密碼錯誤/,
  );
});
