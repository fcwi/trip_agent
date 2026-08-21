import assert from "node:assert/strict";
import test from "node:test";
import {
  formatCurrency,
  getCurrencySymbol,
} from "../src/utils/currencyFormatter.js";

test("formats each trip currency with its own symbol", () => {
  assert.equal(formatCurrency(1234, "KRW"), "₩1,234");
  assert.equal(formatCurrency(1234, "JPY"), "¥1,234");
  assert.equal(formatCurrency(1234, "TWD"), "NT$1,234");
});

test("normalizes invalid amounts without rendering NaN", () => {
  assert.equal(formatCurrency("not-a-number", "JPY"), "¥0");
});

test("returns a standalone localized currency symbol", () => {
  assert.equal(getCurrencySymbol("krw"), "₩");
});
