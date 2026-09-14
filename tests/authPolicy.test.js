import assert from "node:assert/strict";
import test from "node:test";
import { shouldAutoUnlockWithoutPassword } from "../src/utils/authPolicy.js";

test("empty encoded keys only skip the lock screen in development", () => {
  assert.equal(shouldAutoUnlockWithoutPassword("", true), true);
  assert.equal(shouldAutoUnlockWithoutPassword("   ", true), true);
  assert.equal(shouldAutoUnlockWithoutPassword("", false), false);
  assert.equal(shouldAutoUnlockWithoutPassword("ciphertext", true), false);
  assert.equal(shouldAutoUnlockWithoutPassword("ciphertext", false), false);
});
