import assert from "node:assert/strict";
import test from "node:test";
import { escapeHtml } from "../src/utils/html.js";

test("escapes HTML special characters in map popup text", () => {
  assert.equal(
    escapeHtml(`<img src=x onerror="alert('xss')">`),
    "&lt;img src=x onerror=&quot;alert(&#39;xss&#39;)&quot;&gt;",
  );
});
