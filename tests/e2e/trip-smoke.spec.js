import { expect, test } from "@playwright/test";

const TEST_PASSWORD = "trip-e2e-password";

const blockExternalRequests = async (page) => {
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1") {
      await route.continue();
      return;
    }
    await route.abort("blockedbyclient");
  });
};

const unlockTrip = async (page) => {
  await page.getByLabel("通關密碼").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "解鎖行程" }).click();
  await expect(
    page.getByRole("button", { name: "行程標題；連續點擊可開啟測試模式" }),
  ).toBeVisible();
};

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (error) => {
    console.error(`[pageerror] ${error.message}`);
  });
  await blockExternalRequests(page);
});

test("keeps authenticated application code behind the lock screen", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "行程表已鎖定" }),
  ).toBeVisible();

  const loadedResources = await page.evaluate(() =>
    performance.getEntriesByType("resource").map(({ name }) => name),
  );
  expect(
    loadedResources.some((url) => url.includes("AuthenticatedTripApp")),
  ).toBe(false);
});

test("reports a wrong password and unlocks with the test credential", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("通關密碼").fill("wrong-password");
  await page.getByRole("button", { name: "解鎖行程" }).click();
  await expect(page.getByRole("alert")).toContainText("密碼錯誤");
  await expect(page.getByRole("alert")).toBeFocused();

  await unlockTrip(page);
  await expect(page).toHaveURL(/\?tab=itinerary$/);
});

test("generates and copies an encrypted credential", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /設定／加密 API Key/ }).click();
  await page.getByLabel("Gemini API Key").fill("test-api-key-1234567890");
  await page.getByLabel("設定通關密碼").fill("local-test-password");
  await page.getByRole("button", { name: "生成加密字串" }).click();

  const encryptedValue = await page.locator("output").textContent();
  expect(encryptedValue?.split(":")).toHaveLength(3);
  await page.getByRole("button", { name: "複製加密字串" }).click();
  await expect(page.locator('p[role="status"]')).toContainText(
    "已複製加密字串",
  );
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(encryptedValue);
});

test("syncs bottom navigation with the URL and browser history", async ({
  page,
}) => {
  await page.goto("/");
  await unlockTrip(page);

  await page.getByRole("button", { name: /^指南/ }).click();
  await expect(page).toHaveURL(/\?tab=guides$/);
  await expect(
    page.getByRole("button", { name: "指南（目前分頁）" }),
  ).toHaveAttribute("aria-current", "page");

  await page.goBack();
  await expect(page).toHaveURL(/\?tab=itinerary$/);
  await expect(
    page.getByRole("button", { name: "行程（目前分頁）" }),
  ).toHaveAttribute("aria-current", "page");
});

test("opens a deep-linked tab after restoring the session", async ({
  page,
}) => {
  await page.goto("/");
  await unlockTrip(page);

  await page.goto("/?tab=shops");
  await expect(
    page.getByRole("button", { name: "商店（目前分頁）" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(page).toHaveURL(/\?tab=shops$/);
});
