import assert from "node:assert/strict";
import test from "node:test";
import { shouldSubmitTextInput } from "../src/utils/keyboard.js";

test("submits a plain Enter key", () => {
  assert.equal(shouldSubmitTextInput({ key: "Enter" }), true);
});

test("does not submit while composing CJK text", () => {
  assert.equal(
    shouldSubmitTextInput({ key: "Enter", isComposing: true }),
    false,
  );
  assert.equal(
    shouldSubmitTextInput({
      key: "Enter",
      nativeEvent: { isComposing: true },
    }),
    false,
  );
  assert.equal(shouldSubmitTextInput({ key: "Enter", keyCode: 229 }), false);
});

test("keeps Shift+Enter available for a new line", () => {
  assert.equal(shouldSubmitTextInput({ key: "Enter", shiftKey: true }), false);
});
