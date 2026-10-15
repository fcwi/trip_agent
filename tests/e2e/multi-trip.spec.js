import { test, expect } from "@playwright/test";

const trips = [
  {
    id: "2027_tohoku",
    name: "2027 東北雪國五日",
    title: "2027 東北／森吉樹冰五日",
    art: "tohoku-snow",
    currency: "JPY",
  },
  {
    id: "2026_karuizawa",
    name: "2026 東京輕井澤六日",
    title: "東京輕井澤親子之旅",
    art: "karuizawa-snow",
    currency: "JPY",
  },
  {
    id: "2026_busan",
    name: "2026 釜山親子五日",
    title: "韓國釜山親子之旅",
    art: "busan-coast",
    currency: "KRW",
  },
];

test.beforeEach(async ({ page }) => {
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.includes("__e2e_gas__"))
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ status: "success", data: [] }),
      });
    return url.hostname === "127.0.0.1" ? route.continue() : route.abort();
  });
});

const unlock = async (page) => {
  await page.getByLabel("通關密碼").fill("trip-e2e-password");
  await page.getByRole("button", { name: "解鎖行程" }).click();
  await expect(
    page.getByRole("button", { name: /^切換行程，目前/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "總覽", exact: true }).click();
  await expect(page.locator("#trip-cover-title")).toBeVisible();
};
const switchTo = async (page, trip) => {
  await page.getByRole("button", { name: /^切換行程，目前/ }).click();
  await page
    .getByRole("dialog", { name: "選擇旅程" })
    .getByRole("button", { name: `切換至${trip.name}`, exact: true })
    .click();
  await expect(page.locator("#trip-cover-title")).toHaveText(trip.title);
  await expect(page.getByLabel("通關密碼")).toHaveCount(0);
};

test("trip identity and phase stay visible across overview, daily and guide pages", async ({
  page,
}) => {
  for (const [id, date, phase, label] of [
    ["2027_tohoku", "2026-10-15T03:00:00Z", "upcoming", "即將出發"],
    ["2026_busan", "2026-07-03T03:00:00Z", "during", "旅程中"],
    ["2026_karuizawa", "2026-10-15T03:00:00Z", "past", "旅程回顧"],
  ]) {
    await page.clock.setFixedTime(new Date(date));
    await page.goto(`/?trip=${id}`);
    if (await page.getByLabel("通關密碼").count()) await unlock(page);
    const trip = trips.find((item) => item.id === id);
    const header = page.locator(".travel-header");
    await expect(
      header.getByRole("heading", { level: 1, name: trip.title, exact: true }),
    ).toBeVisible();
    await expect(header.locator(".journal-header-phase")).toHaveText(label);
    await expect(header.locator(".journal-header-phase")).toHaveAttribute(
      "data-trip-phase",
      phase,
    );
    await page.getByRole("button", { name: "總覽", exact: true }).click();
    const overviewHeight = (await header.boundingBox()).height;
    await page.locator('button[aria-label^="查看Day"]').first().click();
    await expect(page.locator(".travel-day-heading")).toBeVisible();
    expect(
      Math.abs((await header.boundingBox()).height - overviewHeight),
    ).toBeLessThan(1);
    await page
      .getByRole("navigation", { name: "主要功能" })
      .getByRole("button", { name: /^指南/ })
      .click();
    await expect(
      header.getByRole("heading", { level: 1, name: trip.title, exact: true }),
    ).toBeVisible();
    await expect(header.locator(".journal-header-phase")).toHaveText(label);
  }
});

test("automatically opens the ongoing or nearest future trip and falls back to the latest review", async ({
  page,
}) => {
  for (const [date, id] of [
    ["2026-01-25T03:00:00Z", "2026_karuizawa"],
    ["2026-07-03T03:00:00Z", "2026_busan"],
    ["2026-10-15T03:00:00Z", "2027_tohoku"],
    ["2028-01-01T03:00:00Z", "2027_tohoku"],
  ]) {
    await page.clock.setFixedTime(new Date(date));
    await page.goto("/");
    await expect(
      page.locator(".travel-shell, #lockScreenPassword"),
    ).toBeVisible();
    if (await page.getByLabel("通關密碼").count()) await unlock(page);
    await page.getByRole("button", { name: "總覽", exact: true }).click();
    const trip = trips.find((item) => item.id === id);
    await expect(page.locator("#trip-cover-title")).toHaveText(trip.title);
    await expect(page.locator(".travel-cover__drawing svg")).toHaveAttribute(
      "data-artwork",
      trip.art,
    );
  }
});

test("switches three itineraries without logging out and keeps custom checklists isolated", async ({
  page,
}) => {
  const requests = [];
  page.on("request", (request) => {
    if (request.url().includes("__e2e_gas__"))
      requests.push({ url: request.url(), body: request.postData() });
  });
  await page.goto("/?trip=2027_tohoku");
  await unlock(page);
  await page
    .getByRole("textbox", { name: "新增檢查項目", exact: true })
    .fill("東北專用清單項目");
  await page.getByRole("button", { name: "新增檢查項目", exact: true }).click();
  await expect(
    page.getByRole("checkbox", { name: "東北專用清單項目" }),
  ).toBeVisible();
  for (const trip of [trips[1], trips[2]]) {
    await switchTo(page, trip);
    await expect(page.locator(".travel-cover__drawing svg")).toHaveAttribute(
      "data-artwork",
      trip.art,
    );
    await expect(
      page.getByText("東北專用清單項目", { exact: true }),
    ).toHaveCount(0);
    await expect(page.locator(".travel-header__currency a")).toHaveAttribute(
      "href",
      new RegExp(trip.currency),
    );
    await page.getByRole("button", { name: /^記錄/ }).click();
    await expect(
      page.getByRole("heading", { name: "歡迎使用旅程記帳" }),
    ).toBeVisible();
    await page
      .getByRole("navigation", { name: "主要功能" })
      .getByRole("button", { name: "行程", exact: true })
      .click();
  }
  await switchTo(page, trips[0]);
  await page.getByRole("button", { name: /顯示全部/ }).click();
  await expect(
    page.getByRole("checkbox", { name: "東北專用清單項目" }),
  ).toBeVisible();
  const scoped = requests.map(({ url, body }) => {
    const data = body ? JSON.parse(body) : {};
    return data.tripId || new URL(url).searchParams.get("tripId");
  });
  for (const trip of trips) expect(scoped).toContain(trip.id);
  await page.getByRole("button", { name: "鎖定行程" }).click();
  await page.goto("/?trip=2026_busan");
  await expect(page.getByLabel("通關密碼")).toBeVisible();
});

test("trip chooser fits phones and landscape, contains focus, and restores the trigger", async ({
  page,
}) => {
  await page.goto("/?trip=2027_tohoku");
  await unlock(page);
  for (const [width, height] of [
    [320, 740],
    [402, 874],
    [412, 915],
    [874, 402],
  ]) {
    await page.setViewportSize({ width, height });
    for (const dark of [false, true]) {
      if (
        (await page.locator(".travel-shell").getAttribute("data-theme")) !==
        (dark ? "dark" : "light")
      )
        await page.getByRole("button", { name: /切換到.*模式/ }).click();
      const trigger = page.getByRole("button", { name: /^切換行程，目前/ });
      await trigger.click();
      const dialog = page.getByRole("dialog", { name: "選擇旅程" });
      await expect(dialog).toBeFocused();
      const bounds = await dialog.boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(15);
      expect(bounds.y).toBeGreaterThanOrEqual(15);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(height - 15);
      expect(
        await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
      ).toBe(true);
      await expect(page.locator("#root")).toHaveAttribute("inert", "");
      await page.keyboard.press("Shift+Tab");
      await expect(
        dialog.getByRole("button", { name: `切換至${trips[2].name}` }),
      ).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
    }
  }
});

test("a cached page cannot restore an itinerary after its shared login was locked", async ({
  page,
}) => {
  await page.goto("/?trip=2027_tohoku");
  await unlock(page);
  await page.evaluate(() => {
    sessionStorage.removeItem("trip_agent:auth:password");
    localStorage.removeItem("trip_agent:auth:remembered-unlock-password-v1");
    window.dispatchEvent(
      new PageTransitionEvent("pageshow", { persisted: true }),
    );
  });
  await expect(page.getByLabel("通關密碼")).toBeVisible();
  await expect(page.locator(".travel-shell")).toHaveCount(0);
});
