import assert from "node:assert/strict";
import test from "node:test";
import {
  createNavigationState,
  createTabUrl,
  resolveTab,
} from "../src/hooks/useTripNavigation.js";

test("resolves supported deep-linked tabs", () => {
  assert.equal(resolveTab("?tab=finance"), "finance");
  assert.equal(resolveTab("?foo=1&tab=ai"), "ai");
});

test("falls back to itinerary for unsupported tabs", () => {
  assert.equal(resolveTab("?tab=admin"), "itinerary");
  assert.equal(resolveTab(""), "itinerary");
});

test("updates tab while preserving other URL state", () => {
  assert.equal(
    createTabUrl("guides", "https://example.com/trip/?ref=share#today"),
    "/trip/?ref=share&tab=guides#today",
  );
});

test("creates normalized browser history state", () => {
  assert.deepEqual(createNavigationState("finance", "calculator"), {
    tab: "finance",
    modal: "calculator",
  });
  assert.deepEqual(createNavigationState("unknown"), { tab: "itinerary" });
});
