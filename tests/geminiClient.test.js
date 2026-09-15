import assert from "node:assert/strict";
import test from "node:test";
import { buildGeminiGenerateContentRequest } from "../src/utils/geminiClient.js";

test("sends the Gemini API key in a header instead of the URL", () => {
  const request = buildGeminiGenerateContentRequest(
    "gemini-3.1-flash-lite-preview",
    "secret-key",
  );

  assert.equal(
    request.url,
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent",
  );
  assert.equal(request.url.includes("secret-key"), false);
  assert.equal(request.headers["x-goog-api-key"], "secret-key");
});
