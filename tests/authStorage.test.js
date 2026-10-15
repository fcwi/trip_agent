import test from "node:test";
import assert from "node:assert/strict";
import { authStorage } from "../src/utils/authStorage.js";

const memory = () => {
  const data = new Map();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  };
};

test("moves a legacy trip session into the shared login without touching trip data", (t) => {
  const session = memory();
  const local = memory();
  const oldSession = globalThis.sessionStorage;
  const oldLocal = globalThis.localStorage;
  globalThis.sessionStorage = session;
  globalThis.localStorage = local;
  t.after(() => {
    globalThis.sessionStorage = oldSession;
    globalThis.localStorage = oldLocal;
  });
  session.setItem("trip_agent:2027_tohoku:password", "test-session");
  local.setItem("trip_agent:2027_tohoku:checklist-v1", "saved-list");
  assert.equal(authStorage.getItem("password"), "test-session");
  assert.equal(session.getItem("trip_agent:2027_tohoku:password"), null);
  assert.equal(authStorage.getItem("password"), "test-session");
  assert.equal(
    local.getItem("trip_agent:2027_tohoku:checklist-v1"),
    "saved-list",
  );
});

test("locking removes shared and legacy login values but preserves every itinerary", (t) => {
  const session = memory();
  const local = memory();
  const oldSession = globalThis.sessionStorage;
  const oldLocal = globalThis.localStorage;
  globalThis.sessionStorage = session;
  globalThis.localStorage = local;
  t.after(() => {
    globalThis.sessionStorage = oldSession;
    globalThis.localStorage = oldLocal;
  });
  authStorage.setItem("password", "test-session");
  authStorage.setItem("remembered-unlock-password-v1", "test-remembered");
  session.setItem("trip_agent:2026_busan:password", "test-legacy");
  local.setItem(
    "trip_agent:2026_busan:remembered-unlock-password-v1",
    "test-legacy",
  );
  local.setItem("trip_agent:2026_busan:checklist-v1", "saved-list");
  authStorage.removeItem("password");
  authStorage.removeItem("remembered-unlock-password-v1");
  assert.equal(authStorage.getItem("password"), null);
  assert.equal(authStorage.getItem("remembered-unlock-password-v1"), null);
  assert.equal(
    local.getItem("trip_agent:2026_busan:checklist-v1"),
    "saved-list",
  );
});
