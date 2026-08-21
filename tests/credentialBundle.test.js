import assert from "node:assert/strict";
import test from "node:test";
import {
  decryptCredentialBundle,
  EMPTY_CREDENTIALS,
} from "../src/utils/credentialBundle.js";

test("decrypts the credential bundle in one operation", async () => {
  const values = {
    gemini: "gemini-key-long-enough",
    maps: "maps-key",
    gasUrl: "https://example.com/gas",
    gasToken: "gas-token",
    maptiler: "maptiler-key",
  };

  const credentials = await decryptCredentialBundle({
    payloads: {
      apiKey: "gemini",
      mapsApiKey: "maps",
      gasUrl: "gasUrl",
      gasToken: "gasToken",
      maptilerKey: "maptiler",
    },
    password: "trip-password",
    decrypt: async (payload) => values[payload],
  });

  assert.deepEqual(credentials, {
    apiKey: values.gemini,
    mapsApiKey: values.maps,
    gasUrl: values.gasUrl,
    gasToken: values.gasToken,
    maptilerKey: values.maptiler,
  });
});

test("keeps optional credential failures isolated", async () => {
  const credentials = await decryptCredentialBundle({
    payloads: { apiKey: "gemini", mapsApiKey: "broken-maps" },
    password: "trip-password",
    decrypt: async (payload) => {
      if (payload === "broken-maps") throw new Error("unavailable");
      return "gemini-key-long-enough";
    },
  });

  assert.equal(credentials.apiKey, "gemini-key-long-enough");
  assert.equal(credentials.mapsApiKey, "");
  assert.deepEqual(
    Object.keys(credentials).sort(),
    Object.keys(EMPTY_CREDENTIALS).sort(),
  );
});

test("rejects an invalid required Gemini credential", async () => {
  await assert.rejects(
    decryptCredentialBundle({
      payloads: { apiKey: "gemini" },
      password: "wrong-password",
      decrypt: async () => "short",
    }),
  );
});
