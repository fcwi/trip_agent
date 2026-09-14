import assert from "node:assert/strict";
import test from "node:test";
import { createRecordId } from "../src/utils/ids.js";

test("createRecordId returns unique string identifiers", () => {
  const first = createRecordId();
  const second = createRecordId();

  assert.equal(typeof first, "string");
  assert.equal(first.length > 0, true);
  assert.notEqual(first, second);
});
