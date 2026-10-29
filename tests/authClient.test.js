import test from "node:test";
import assert from "node:assert/strict";
import { requestSession } from "../src/utils/authClient.js";
import { getAiErrorText } from "../src/utils/aiHelpers.js";

test("auth distinguishes wrong password, throttling and connection failure without exposing response text", async () => {
  for (const [status, pattern] of [
    [401, /密碼錯誤/],
    [429, /一分鐘/],
    [503, /主機可能啟動中/],
  ]) {
    await assert.rejects(
      requestSession(
        "login",
        { password: "test-only" },
        {
          fetchImpl: async () =>
            new Response("private upstream text", { status }),
        },
      ),
      (error) =>
        pattern.test(error.message) && !error.message.includes("private"),
    );
  }
  await assert.rejects(
    requestSession("session", undefined, {
      fetchImpl: async () => {
        throw new TypeError("offline");
      },
    }),
    /本機紀錄不會因此刪除/,
  );
  assert.match(getAiErrorText({ status: 401 }), /登入已到期/);
});
