import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/*", (route) =>
    new URL(route.request().url()).hostname === "127.0.0.1"
      ? route.continue()
      : route.abort(),
  );
});
async function login(page, path = "/?trip=2027_tohoku") {
  await page.goto(path);
  await page.getByLabel("通關密碼").fill("trip-e2e-password");
  await page.getByRole("button", { name: "解鎖行程" }).click();
  await page.locator(".travel-shell").waitFor();
}

test("failed logout remains locked across reload until server logout can complete", async ({
  page,
}) => {
  await login(page);
  await page.route("**/api/logout", (route) => route.abort());
  await page.getByRole("button", { name: "鎖定行程" }).click();
  await expect(page.getByLabel("通關密碼")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("通關密碼")).toBeVisible();
  await expect(page.locator(".travel-shell")).toHaveCount(0);
  await page.unroute("**/api/logout");
  await page.getByLabel("通關密碼").fill("trip-e2e-password");
  await page.getByRole("button", { name: "解鎖行程" }).click();
  await expect(page.locator(".travel-shell")).toBeVisible();
});

test("locking another tab removes access from an already-open itinerary", async ({
  page,
  context,
}) => {
  await login(page);
  const other = await context.newPage();
  await other.goto("/?trip=2026_busan");
  await other.locator(".travel-shell").waitFor();
  await page.getByRole("button", { name: "鎖定行程" }).click();
  await expect(other.getByLabel("通關密碼")).toBeVisible();
});

test("failed chat snapshot and receipt batch preserve the last committed data", async ({
  page,
}) => {
  await login(page);
  const result = await page.evaluate(async () => {
    const { aiChatDB, financeDB } =
      await import("/src/utils/indexedDBManager.js");
    await aiChatDB.saveMessages("guide", [
      { id: "old", role: "user", text: "保留舊訊息" },
    ]);
    let chatFailed = false;
    try {
      await aiChatDB.saveMessages("guide", [
        { id: "new", role: "user", text: "不得部分儲存" },
        { id: "invalid", invalid: () => {} },
      ]);
    } catch {
      chatFailed = true;
    }
    await financeDB.saveRecord({ id: "old-record", amount: 123 });
    let batchFailed = false;
    try {
      await financeDB.saveRecordBatch([
        { id: "new-record", amount: 456 },
        { amount: 789 },
      ]);
    } catch {
      batchFailed = true;
    }
    return {
      chatFailed,
      batchFailed,
      messages: await aiChatDB.loadMessages("guide"),
      records: await financeDB.loadAllRecords(),
    };
  });
  expect(result.chatFailed).toBe(true);
  expect(result.batchFailed).toBe(true);
  expect(result.messages.map((m) => m.id)).toEqual(["old"]);
  expect(result.records.map((r) => r.id)).toEqual(["old-record"]);
});

test("a reply survives an immediate mode switch and expired sessions show recovery instructions", async ({
  page,
}) => {
  await page.route("**/api/gemini/**", (route) =>
    route.fulfill({
      json: {
        candidates: [{ content: { parts: [{ text: "保留這個即時回覆" }] } }],
      },
    }),
  );
  await login(page, "/?trip=2027_tohoku&tab=ai");
  await page.locator('[data-journal-mode="guide"]').click();
  await page.getByLabel("詢問 AI 導遊").fill("第二天去哪裡？");
  await page.getByRole("button", { name: "傳送訊息", exact: true }).click();
  await expect(
    page.getByText("保留這個即時回覆", { exact: true }),
  ).toBeVisible();
  await page.locator('[data-journal-mode="translate"]').click();
  await page
    .locator('[data-journal-mode="translate"][aria-pressed="true"]')
    .waitFor();
  await page.locator('[data-journal-mode="guide"]').click();
  await expect(
    page.getByText("保留這個即時回覆", { exact: true }),
  ).toBeVisible();
  await page.route("**/api/gemini/**", (route) =>
    route.fulfill({ status: 401, json: { error: "Login required" } }),
  );
  await page.getByLabel("詢問 AI 導遊").fill("附近有商店嗎？");
  await page.getByRole("button", { name: "傳送訊息", exact: true }).click();
  await expect(
    page.getByText("登入已到期，請鎖定網站後重新登入；本機紀錄會保留。", {
      exact: true,
    }),
  ).toBeVisible();
});

test("an edited offline record survives reload before the debounce interval", async ({
  page,
}) => {
  await page.route("**/api/gas", (route) =>
    route.fulfill({ status: 503, json: { error: "controlled offline" } }),
  );
  await login(page, "/?trip=2027_tohoku&tab=finance");
  await page.getByLabel("暱稱").fill("離線旅人");
  await page.getByRole("button", { name: "開始記錄" }).click();
  await page.getByPlaceholder("金額", { exact: true }).fill("123");
  await page.getByPlaceholder("項目說明…").fill("離線午餐");
  await page.getByRole("button", { name: "送出紀錄" }).click();
  await expect(page.locator(".journal-finance-record")).toContainText(
    "離線午餐",
  );
  await expect(page.locator(".journal-record-actions")).toHaveCSS(
    "opacity",
    "1",
  );
  await page.getByRole("button", { name: "編輯紀錄" }).click();
  await page.locator("#editContent").fill("已修改的離線午餐");
  await page.getByRole("button", { name: "儲存", exact: true }).click();
  await expect(page.locator(".journal-finance-record")).toContainText(
    "已修改的離線午餐",
  );
  await page.reload();
  await expect(page.locator(".journal-finance-record")).toContainText(
    "已修改的離線午餐",
  );
  await expect(page.locator(".journal-finance-record")).toContainText(
    "尚未取得匯率，未換算",
  );
  await page.evaluate(async () => {
    const { financeDB } = await import("/src/utils/indexedDBManager.js");
    financeDB.deleteRecord = async () => {
      throw new Error("controlled storage failure");
    };
  });
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "刪除紀錄" }).click();
  await expect(
    page.getByText("無法刪除本機紀錄，請確認裝置儲存空間後重試", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator(".journal-finance-record")).toContainText(
    "已修改的離線午餐",
  );
});
