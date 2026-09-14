import assert from "node:assert/strict";
import test from "node:test";
import { escapeHtml } from "../src/utils/html.js";

test("escapeHtml encodes markup that could be injected into map popups", () => {
  assert.equal(
    escapeHtml(`<img src=x onerror="alert(1)"> Tom & Jerry`),
    "&lt;img src=x onerror=&quot;alert(1)&quot;&gt; Tom &amp; Jerry",
  );
});

test("escapeHtml treats nullish values as empty strings", () => {
  assert.equal(escapeHtml(undefined), "");
  assert.equal(escapeHtml(null), "");
});
