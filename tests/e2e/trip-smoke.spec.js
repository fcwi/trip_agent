import { expect, test } from "@playwright/test";
import process from "node:process";

const TEST_PASSWORD = "trip-e2e-password";
const EXPECTED_TRIP_ID = process.env.E2E_TRIP_ID || "2026_busan";
const pageErrors = new WeakMap();
const gasCallsByPage = new WeakMap();
const TRANSLATION_TARGETS = {
  "2026_busan": { code: "ko-KR", name: "韓文" },
  "2026_karuizawa": { code: "ja-JP", name: "日文" },
  "2027_tohoku": { code: "ja-JP", name: "日文" },
};

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

const interceptGasRequests = async (page) => {
  const calls = [];
  gasCallsByPage.set(page, calls);
  await page.route("**/__e2e_gas__**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    let body = {};
    if (request.method() === "POST") {
      try {
        body = JSON.parse(request.postData() || "{}");
      } catch {
        body = {};
      }
    }
    calls.push({
      method: request.method(),
      action: body.action || url.searchParams.get("action") || "add",
      tripId: body.tripId || url.searchParams.get("tripId"),
      hasPropertyKey: Boolean(
        body.gasPropertyKey || url.searchParams.get("gasPropertyKey"),
      ),
      hasTokenInUrl: url.searchParams.has("token"),
    });
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: "success", data: [] }),
    });
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
  const errors = [];
  pageErrors.set(page, errors);
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
  await blockExternalRequests(page);
  await interceptGasRequests(page);
});

test.afterEach(async ({ page }) => {
  expect(
    pageErrors.get(page) ?? [],
    "unexpected browser runtime errors",
  ).toEqual([]);
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

test("operates the trip tools menu with keyboard focus and opens the calculator", async ({
  page,
}) => {
  await page.goto("/");
  await unlockTrip(page);

  const trigger = page.locator('button[aria-controls="trip-tools-panel"]');
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(trigger).toHaveAccessibleName("關閉旅程工具");

  const shareAction = page.getByRole("button", { name: /分享目前位置/ });
  await expect(shareAction).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.click();
  await page.getByRole("button", { name: "開啟匯率計算機" }).click();
  await expect(page.getByRole("dialog", { name: "計算機" })).toBeVisible();
});

test("centers selected dates, names icon controls, and renders offline currency as status", async ({
  context,
  page,
}) => {
  await page.goto("/");
  await unlockTrip(page);
  await expect(
    page.getByRole("button", { name: /更新目前位置天氣/ }),
  ).toBeVisible();

  const dayButtons = page.locator('button[aria-label^="查看Day"]');
  await expect(dayButtons.first()).toHaveText(/^Day \d+$/);
  const selectedDay = dayButtons.nth(
    Math.min(2, (await dayButtons.count()) - 1),
  );
  await selectedDay.click();
  await expect
    .poll(() =>
      selectedDay.evaluate((button) => {
        const container = button.parentElement.getBoundingClientRect();
        const item = button.getBoundingClientRect();
        return Math.abs(
          item.left + item.width / 2 - (container.left + container.width / 2),
        );
      }),
    )
    .toBeLessThan(36);

  await context.setOffline(true);
  const offlineStatus = page.getByRole("status").filter({
    hasText: "離線，保留上次匯率",
  });
  await expect(offlineStatus).toBeVisible();
  await expect(
    page.locator("a").filter({ hasText: "離線，保留上次匯率" }),
  ).toHaveCount(0);
});

test("gives map icon controls accessible names", async ({ page }) => {
  await page.goto("/");
  await unlockTrip(page);
  const title = page.getByRole("button", {
    name: "行程標題；連續點擊可開啟測試模式",
  });
  for (let click = 0; click < 10; click += 1) await title.click();
  await page.getByRole("button", { name: "進入測試模式" }).click();
  await expect(page.getByRole("dialog", { name: "測試模式" })).toBeVisible();

  await expect(page.getByRole("button", { name: "放大地圖" })).toBeVisible();
  await expect(page.getByRole("button", { name: "縮小地圖" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "重置選擇的位置" }),
  ).toBeVisible();
});

test("offers common avatars first and exposes an accessible selected state", async ({
  page,
}) => {
  await page.goto("/");
  await unlockTrip(page);
  await page.getByRole("button", { name: /^記錄/ }).click();
  await expect(
    page.getByRole("heading", { name: "歡迎使用旅程記帳" }),
  ).toBeVisible();

  const avatarButtons = page.locator(
    'button[aria-label^="選擇"][aria-label$="頭像"]',
  );
  await expect(avatarButtons).toHaveCount(8);
  await expect(avatarButtons.first()).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: /更多頭像/ }).click();
  await expect(avatarButtons).toHaveCount(42);
  await avatarButtons.last().click();
  await expect(avatarButtons.last()).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("暱稱")).toHaveAttribute("autocomplete", "off");
});

test("preserves guide expansion and scroll position across tab changes", async ({
  page,
}) => {
  await page.goto("/");
  await unlockTrip(page);
  await page.getByRole("button", { name: /^指南/ }).click();

  const firstGuide = page
    .locator("#panel-guides button[aria-expanded]")
    .first();
  await firstGuide.click();
  await expect(firstGuide).toHaveAttribute("aria-expanded", "true");
  await page.evaluate(() =>
    window.scrollTo(0, Math.min(420, document.body.scrollHeight)),
  );
  const guideScrollPosition = await page.evaluate(() => window.scrollY);

  await page.getByRole("button", { name: "行程", exact: true }).click();
  await page.getByRole("button", { name: /^指南/ }).click();
  await expect(firstGuide).toHaveAttribute("aria-expanded", "true");
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThanOrEqual(Math.max(0, guideScrollPosition - 2));
});

test("honors reduced motion and keeps the closed tools clear of navigation", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "cached_user_weather",
      JSON.stringify({
        temp: 20,
        desc: "小雨",
        locationName: "測試位置",
        weatherCode: 61,
      }),
    );
  });
  await page.goto("/");
  await unlockTrip(page);
  await expect(page.locator('canvas[aria-hidden="true"]')).toHaveCount(1);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator('canvas[aria-hidden="true"]')).toHaveCount(0);

  const viewports = [
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 1280, height: 900 },
  ];
  const verifyResponsiveLayout = async () => {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await expect
        .poll(() =>
          page.evaluate(() => ({
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: document.documentElement.clientWidth,
          })),
        )
        .toEqual({
          documentWidth: viewport.width,
          viewportWidth: viewport.width,
        });

      const toolBox = await page
        .getByRole("button", { name: "開啟旅程工具" })
        .boundingBox();
      const navBox = await page
        .getByRole("navigation", { name: "主要功能" })
        .boundingBox();
      expect(toolBox).not.toBeNull();
      expect(navBox).not.toBeNull();
      expect(toolBox.x).toBeGreaterThanOrEqual(navBox.x + navBox.width - 8);
      expect(Math.abs(toolBox.y - navBox.y)).toBeLessThan(24);
    }
  };

  await verifyResponsiveLayout();

  const themeToggle = page.getByRole("button", {
    name: /切換到(深色|亮色)模式/,
  });
  await themeToggle.click();
  await expect(themeToggle).toBeVisible();
  await verifyResponsiveLayout();
});

test("scopes mocked GAS reads and writes to the active trip", async ({
  page,
}) => {
  await page.goto("/");
  await unlockTrip(page);

  await expect
    .poll(() =>
      (gasCallsByPage.get(page) || []).some(
        (call) => call.action === "getLocations",
      ),
    )
    .toBe(true);

  await page.getByRole("button", { name: /^記錄/ }).click();
  await page.getByLabel("暱稱").fill("E2E");
  await page.getByRole("button", { name: "開始記錄" }).click();
  await expect
    .poll(() =>
      (gasCallsByPage.get(page) || []).some((call) => call.action === "getAll"),
    )
    .toBe(true);

  await page.getByPlaceholder("金額").fill("120");
  await page.getByPlaceholder("項目說明…").fill("測試午餐");
  await page.getByRole("button", { name: "送出紀錄" }).click();
  await expect
    .poll(() =>
      (gasCallsByPage.get(page) || []).some(
        (call) => call.action === "add" && call.method === "POST",
      ),
    )
    .toBe(true);

  await page.getByRole("button", { name: "編輯紀錄" }).click({ force: true });
  await page.locator("#editContent").fill("測試午餐（已改）");
  await page.getByRole("button", { name: "儲存" }).click();
  await expect
    .poll(() =>
      (gasCallsByPage.get(page) || []).some((call) => call.action === "edit"),
    )
    .toBe(true);

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "刪除紀錄" }).click({ force: true });
  await expect
    .poll(() =>
      (gasCallsByPage.get(page) || []).some((call) => call.action === "delete"),
    )
    .toBe(true);

  const calls = gasCallsByPage.get(page) || [];
  expect(calls.length).toBeGreaterThan(0);
  for (const call of calls) {
    expect(call.tripId).toBe(EXPECTED_TRIP_ID);
    expect(call.hasPropertyKey).toBe(false);
    expect(call.method).toBe("POST");
    expect(call.hasTokenInUrl).toBe(false);
  }
});

test("sends an explicit destination-language translation task", async ({
  page,
}) => {
  let geminiPayload = null;
  await page.route(
    "https://generativelanguage.googleapis.com/**",
    async (route) => {
      geminiPayload = JSON.parse(route.request().postData() || "{}");
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          candidates: [
            { content: { parts: [{ text: "テスト訳 (Tesuto-yaku)" }] } },
          ],
        }),
      });
    },
  );

  await page.goto("/");
  await unlockTrip(page);
  await page.getByRole("button", { name: /^導遊/ }).click();
  await page
    .getByRole("button", { name: /^翻譯「/ })
    .first()
    .click();
  await page.getByRole("button", { name: "傳送訊息" }).click();

  await expect(page.getByText("テスト訳 (Tesuto-yaku)")).toBeVisible();
  const target = TRANSLATION_TARGETS[EXPECTED_TRIP_ID];
  expect(target).toBeDefined();
  expect(geminiPayload.systemInstruction.parts[0].text).toContain(target.name);
  expect(geminiPayload.systemInstruction.parts[0].text).toContain(target.code);
  expect(geminiPayload.contents).toHaveLength(1);
  expect(geminiPayload.contents[0].parts[0].text).toContain(
    `targetLanguage=${target.name}`,
  );
  expect(geminiPayload.contents[0].parts[0].text).not.toContain("翻譯「");
});
