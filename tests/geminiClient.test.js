import assert from "node:assert/strict";
import test from "node:test";
import { buildGeminiGenerateContentRequest } from "../src/utils/geminiClient.js";

test("Gemini requests keep the API key in a header instead of the URL", () => {
  const request = buildGeminiGenerateContentRequest(
    "gemini-test-model",
    "secret-api-key",
  );

  assert.equal(request.url.includes("secret-api-key"), false);
  assert.equal(request.url.includes("?key="), false);
  assert.equal(request.headers["x-goog-api-key"], "secret-api-key");
});

test("Gemini request builder requires an API key", () => {
  assert.throws(
    () => buildGeminiGenerateContentRequest("gemini-test-model", ""),
    /API Key/,
  );
});
