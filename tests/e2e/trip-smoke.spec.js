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
const LANDING_SCENARIOS = {
  "2026_busan": {
    date: "2026-07-02",
    time: "11:00",
    plan: "抵達釜山：豬肉湯飯與西面逛街",
    next: "交通：機場 → 西面",
    location: "西面站",
  },
  "2026_karuizawa": {
    date: "2026-01-24",
    time: "16:00",
    plan: "抵達與移動：直奔雪國",
    next: "上野站轉乘與午餐(點心)",
    location: "JR 上野站",
  },
  "2027_tohoku": {
    date: "2027-01-22",
    time: "12:00",
    plan: "仙台空港 → 天童／上山溫泉",
    next: "抵達仙台空港",
    location: "仙台空港",
  },
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

test("opens the trip when the browser does not provide speech synthesis", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "speechSynthesis", {
      value: undefined,
      configurable: true,
    });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      value: undefined,
      configurable: true,
    });
  });
  await page.goto("/");
  await unlockTrip(page);
  await expect(page.locator("#trip-cover-title")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "網站暫時無法顯示" }),
  ).toHaveCount(0);
});

test("remembers an opted-in unlock and clears it when the trip is locked", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("通關密碼").fill(TEST_PASSWORD);
  await page.getByLabel("在此裝置保持登入").check();
  await page.getByRole("button", { name: "解鎖行程" }).click();
  await expect(
    page.getByRole("button", { name: "行程標題；連續點擊可開啟測試模式" }),
  ).toBeVisible();

  await page.reload();
  await expect(
    page.getByRole("button", { name: "行程標題；連續點擊可開啟測試模式" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "鎖定行程" }).click();
  await expect(
    page.getByRole("heading", { name: "行程表已鎖定" }),
  ).toBeVisible();

  await page.reload();
  await expect(
    page.getByRole("heading", { name: "行程表已鎖定" }),
  ).toBeVisible();
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

test("surfaces today's plan, next location, and needed-now guidance in test mode", async ({
  page,
}) => {
  const scenario = LANDING_SCENARIOS[EXPECTED_TRIP_ID];
  expect(scenario).toBeDefined();

  await page.goto("/");
  await unlockTrip(page);
  await expect(
    page.locator('section[aria-labelledby="today-overview-heading"]'),
  ).toBeVisible();

  const title = page.getByRole("button", {
    name: "行程標題；連續點擊可開啟測試模式",
  });
  for (let click = 0; click < 10; click += 1) await title.click();
  await page.getByRole("button", { name: "進入測試模式" }).click();
  await page.locator("#testModeDate").fill(scenario.date);
  await page.locator("#testModeTime").fill(scenario.time);
  await page.getByRole("button", { name: "儲存變更" }).click();
  await page.getByRole("button", { name: "凍結設定" }).click();
  await page.getByRole("button", { name: "關閉測試模式" }).click();
  await page.getByRole("button", { name: /^總覽/ }).click();

  const overview = page.locator(
    'section[aria-labelledby="today-overview-heading"]',
  );
  await expect(overview.getByText("今天的計畫", { exact: true })).toBeVisible();
  await expect(
    overview.getByRole("heading", { name: scenario.plan }),
  ).toBeVisible();
  await expect(overview.getByText(scenario.next)).toBeVisible();
  await expect(
    overview.getByText(scenario.location, { exact: true }),
  ).toBeVisible();
  await expect(overview.getByText("現在需要", { exact: true })).toBeVisible();
});

test("keeps preparation reminders and saved checklist progress in sync", async ({
  page,
}) => {
  const beforeTrip = new Date(
    `${LANDING_SCENARIOS[EXPECTED_TRIP_ID].date}T00:00:00Z`,
  );
  beforeTrip.setUTCDate(beforeTrip.getUTCDate() - 2);
  await page.clock.setFixedTime(beforeTrip);
  await page.goto("/");
  await unlockTrip(page);
  const checklist = page.locator(
    'section[aria-labelledby="checklist-heading"]',
  );
  const overview = page.locator(
    'section[aria-labelledby="today-overview-heading"]',
  );
  const firstCheckbox = checklist.getByRole("checkbox").first();
  const itemText = await firstCheckbox.locator("..").innerText();
  await expect(
    overview.getByText(itemText.trim(), { exact: true }),
  ).toBeVisible();
  const countBefore = await checklist.locator("p").first().innerText();
  await firstCheckbox.locator("..").click();
  await expect(
    overview.getByText(itemText.trim(), { exact: true }),
  ).toHaveCount(0);
  await expect(checklist.locator("p").first()).not.toHaveText(countBefore);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "行程標題；連續點擊可開啟測試模式" }),
  ).toBeVisible();
  await expect(checklist.getByRole("checkbox").first()).toBeChecked();
  await expect(
    overview.getByText(itemText.trim(), { exact: true }),
  ).toHaveCount(0);
});

test("orders homepage information for preparation, travel and review", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  const scenarios = [
    {
      offset: -2,
      phase: "before",
      order: ["today", "flights", "checklist", "days", "weather"],
    },
    {
      offset: 0,
      phase: "during",
      order: ["today", "days", "weather", "flights"],
    },
    {
      offset: 20,
      phase: "after",
      order: ["today", "memories", "days", "flights", "weather"],
    },
  ];
  for (const scenario of scenarios) {
    const date = new Date(
      `${LANDING_SCENARIOS[EXPECTED_TRIP_ID].date}T03:00:00Z`,
    );
    date.setUTCDate(date.getUTCDate() + scenario.offset);
    await page.clock.setFixedTime(date);
    await page.goto("/");
    await unlockTrip(page);
    await page.getByRole("button", { name: /^總覽/ }).click();
    const overview = page.locator(".journal-overview");
    await expect(overview).toHaveAttribute("data-trip-phase", scenario.phase);
    await expect
      .poll(() =>
        overview
          .locator("[data-overview-section]")
          .evaluateAll((elements) =>
            elements.map((element) => element.dataset.overviewSection),
          ),
      )
      .toEqual(scenario.order);
    if (scenario.phase === "before")
      await expect(page.getByRole("checkbox").first()).toBeVisible();
    else
      await expect(
        page.locator('section[aria-labelledby="checklist-heading"]'),
      ).toHaveCount(0);
  }
});

test("keeps flight summaries visible while accommodation details are collapsed", async ({
  page,
}) => {
  await page.goto("/");
  await unlockTrip(page);
  const flights = page.locator(".travel-flight-info");
  await expect(
    flights.getByRole("article", { name: "去程航班" }),
  ).toBeVisible();
  await expect(
    flights.getByRole("article", { name: "回程航班" }),
  ).toBeVisible();
  const expand = flights.getByRole("button", { name: "航班與緊急資訊" });
  await expect(expand).toHaveAttribute("aria-expanded", "false");
  if (EXPECTED_TRIP_ID === "2027_tohoku") {
    await expect(
      flights.locator(".journal-flight-ticket__note").first(),
    ).toContainText("時刻依出發通知");
  }
  await expand.click();
  await expect(
    flights.getByRole("button", { name: /^複製.*地址$/ }).first(),
  ).toBeVisible();
  await expand.click();
  await expect(
    flights.getByRole("article", { name: "去程航班" }),
  ).toBeVisible();
  await expect(expand).toHaveAttribute("aria-expanded", "false");
});

test("opens a selected day from the homepage directory", async ({ page }) => {
  await page.goto("/");
  await unlockTrip(page);
  const directory = page.locator(
    'section[aria-labelledby="trip-days-heading"]',
  );
  const selectedDay = directory.getByRole("button").nth(1);
  const title = await selectedDay.locator("strong").innerText();
  await selectedDay.click();
  await expect(
    page.getByRole("heading", { name: title, exact: true }),
  ).toBeVisible();
  await expect(directory).toHaveCount(0);
  await page.getByRole("button", { name: /^總覽/ }).click();
  await expect(directory).toBeVisible();
});

test("expands timeline events with the keyboard and keeps transport readable", async ({
  page,
}) => {
  await page.goto("/");
  await unlockTrip(page);
  await page.locator('button[aria-label^="查看Day"]').first().click();
  const event = page.locator(".travel-timeline-event").first();
  const expand = event.getByRole("button");
  await expand.focus();
  await page.keyboard.press("Enter");
  await expect(expand).toHaveAttribute("aria-expanded", "true");
  await expect(event.locator(".travel-event-details")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(event.locator(".travel-event-details")).toBeHidden();
  const mapLink = event.getByRole("link", { name: /^在地圖查看/ });
  await expect(mapLink).toBeVisible();
  expect(
    await mapLink.evaluate((link) => link.closest("button") === null),
  ).toBe(true);
  const transport = page.locator(".travel-timeline-event--transport").first();
  await expect(transport.locator(".travel-transport-summary")).toBeVisible();
  await transport.getByRole("button").click();
  await expect(
    transport.getByRole("heading", { name: "交通說明" }),
  ).toBeVisible();
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
  await expect(dayButtons.first().locator("small")).toHaveText(/^Day \d+$/);
  await expect(dayButtons.first().locator(".journal-date-label")).toHaveText(
    /^\d{1,2}\/\d{1,2}$/,
  );
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
  // The reading pages stay calm even when the cached forecast says rain.
  await expect(page.locator('canvas[aria-hidden="true"]')).toHaveCount(0);
  await page.getByRole("button", { name: "指南", exact: true }).click();
  await expect(page.locator('canvas[aria-hidden="true"]')).toHaveCount(0);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator('canvas[aria-hidden="true"]')).toHaveCount(0);
  await page.getByRole("button", { name: "行程", exact: true }).click();

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

  for (const [width, dark] of [
    [320, false],
    [390, true],
  ]) {
    await page.setViewportSize({ width, height: 844 });
    const toggleTheme = page.getByRole("button", {
      name: dark ? "切換到深色模式" : "切換到亮色模式",
    });
    if (await toggleTheme.count()) await toggleTheme.click();
    await expect(page.locator(".journal-finance-record")).toBeVisible();
    const entryBox = await page
      .getByRole("button", { name: "送出紀錄" })
      .boundingBox();
    const navigationBox = await page
      .getByRole("navigation", { name: "主要功能" })
      .boundingBox();
    expect(entryBox.y + entryBox.height).toBeLessThan(navigationBox.y);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBe(width);
    await page.screenshot({
      path: `test-run.local/${EXPECTED_TRIP_ID}-ledger-${dark ? "dark" : "light"}.png`,
      fullPage: true,
      animations: "disabled",
      scale: "css",
    });
  }
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

test("keeps shop expansion and valid map links across tab changes", async ({
  page,
}) => {
  await page.goto("/");
  await unlockTrip(page);
  await page.getByRole("button", { name: "商店", exact: true }).click();
  const firstShop = page.locator("#panel-shops article").first();
  const toggle = firstShop.getByRole("button");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(
    firstShop.locator(".journal-place-card").first(),
  ).toHaveAttribute("href", /google\.com\/maps/);
  await page.getByRole("button", { name: "指南", exact: true }).click();
  await page.getByRole("button", { name: "商店", exact: true }).click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
});

test("renders every journal page with the bundled font in narrow light and dark layouts", async ({
  page,
}) => {
  await page.goto("/");
  await unlockTrip(page);
  await page.evaluate(async () => {
    await document.fonts.load('16px "Trip Journal"', "旅行手帳");
  });
  expect(
    await page.evaluate(() =>
      [...document.fonts].some(
        (font) => font.family === "Trip Journal" && font.status === "loaded",
      ),
    ),
  ).toBe(true);
  for (const [width, dark] of [
    [320, false],
    [390, true],
  ]) {
    await page.setViewportSize({ width, height: 844 });
    const switchTheme = page.getByRole("button", {
      name: dark ? "切換到深色模式" : "切換到亮色模式",
    });
    if (await switchTheme.count()) await switchTheme.click();
    for (const [label, name] of [
      ["guides", "指南"],
      ["shops", "商店"],
      ["ai", "導遊"],
      ["finance", "記錄"],
      ["home", "行程"],
    ]) {
      await page
        .getByRole("navigation", { name: "主要功能" })
        .getByRole("button", { name: new RegExp(`^${name}`) })
        .click();
      await expect(
        page.locator('.travel-shell[data-editorial="true"]').first(),
      ).toHaveAttribute("data-theme", dark ? "dark" : "light");
      if (label === "home")
        await page.getByRole("button", { name: /^總覽/ }).click();
      if (label === "home")
        await page.waitForFunction(() => {
          const overview = document.querySelector(".travel-overview");
          return (
            overview && getComputedStyle(overview.parentElement).opacity === "1"
          );
        });
      if (label === "finance")
        await expect(
          page.getByRole("heading", { name: "歡迎使用旅程記帳" }),
        ).toBeVisible();
      if (label === "guides" || label === "shops" || label === "ai")
        await expect(
          page.locator(".journal-panel:visible").first(),
        ).toBeVisible();
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
        .toBe(width);
      if (label === "guides" || label === "shops") {
        const toggle = page
          .locator(`#panel-${label} article`)
          .first()
          .getByRole("button");
        if ((await toggle.getAttribute("aria-expanded")) === "false")
          await toggle.click();
      }
      if (label === "ai") {
        const inputBox = await page
          .getByRole("button", { name: "傳送訊息" })
          .boundingBox();
        const navBox = await page
          .getByRole("navigation", { name: "主要功能" })
          .boundingBox();
        expect(inputBox.y + inputBox.height).toBeLessThan(navBox.y);
      }
      await page.screenshot({
        path: `test-run.local/${EXPECTED_TRIP_ID}-${label}-${dark ? "dark" : "light"}.png`,
        fullPage: true,
        animations: "disabled",
        scale: "css",
      });
      if (label === "home") {
        await page.locator('button[aria-label^="查看Day"]').first().click();
        await expect(page.locator(".travel-day-layout")).toBeVisible();
        await page.waitForFunction(
          () =>
            getComputedStyle(
              document.querySelector(".travel-day-layout").parentElement,
            ).opacity === "1",
        );
        await expect
          .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
          .toBe(width);
        await page.screenshot({
          path: `test-run.local/${EXPECTED_TRIP_ID}-daily-${dark ? "dark" : "light"}.png`,
          fullPage: true,
          animations: "disabled",
          scale: "css",
        });
      }
    }
  }
});

test("guide chat keeps input, reply and search working with journal bubbles", async ({
  page,
}) => {
  await page.route("https://generativelanguage.googleapis.com/**", (route) =>
    route.fulfill({
      json: {
        candidates: [
          {
            content: {
              parts: [{ text: "仙台旅行提醒：預留轉乘時間，攜帶保暖衣物。" }],
            },
          },
        ],
      },
    }),
  );
  await page.goto("/");
  await unlockTrip(page);
  await page.getByRole("button", { name: /^導遊/ }).click();
  await page
    .locator(".journal-ai")
    .getByRole("button", { name: "導遊", exact: true })
    .click();
  await page.getByLabel("詢問 AI 導遊").fill("請提供仙台旅行提醒");
  await page.getByRole("button", { name: "傳送訊息" }).click();
  await expect(
    page.locator('.journal-chat-bubble[data-message-role="model"]').last(),
  ).toContainText("預留轉乘時間");
  await page.getByRole("button", { name: "搜尋對話" }).click();
  await page.getByPlaceholder("搜尋對話內容...").fill("保暖");
  await expect(
    page.getByRole("button", { name: /仙台旅行提醒：/ }),
  ).toBeVisible();
});
