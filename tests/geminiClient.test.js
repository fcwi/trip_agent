import assert from "node:assert/strict";
import test from "node:test";
import { buildGeminiGenerateContentRequest } from "../src/utils/geminiClient.js";

test("routes Gemini through the backend without exposing a key", () => {
  const request = buildGeminiGenerateContentRequest(
    "gemini-3.5-flash-lite",
    "secret-key",
  );

  assert.equal(request.url, "/api/gemini/gemini-3.5-flash-lite");
  assert.equal(request.url.includes("secret-key"), false);
  assert.equal(request.headers["x-goog-api-key"], undefined);
});
