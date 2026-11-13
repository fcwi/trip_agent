import { test, expect } from "@playwright/test";
import { authenticate } from "./auth-fixture.js";

test.beforeEach(async ({ page }) => {
  await page.route("**/*", (route) =>
    new URL(route.request().url()).hostname === "127.0.0.1"
      ? route.continue()
      : route.abort(),
  );
  await authenticate(page);
});

test("each destination has real day/night artwork, warm surfaces and readable typography", async ({
  page,
}) => {
  // Manual theme must remain authoritative even with an opposite OS preference.
  await page.emulateMedia({ colorScheme: "dark" });
  for (const trip of ["2027_tohoku", "2026_karuizawa", "2026_busan"]) {
    await page.goto(`/?trip=${trip}`);
    const shell = page.locator(".travel-shell");
    await expect(page.locator(".travel-cover")).toBeVisible();
    if ((await shell.getAttribute("data-theme")) === "dark")
      await page.getByRole("button", { name: "切換到亮色模式" }).click();
    const art = page.locator(".travel-cover .journal-illustration");
    await expect(art).toHaveAttribute("data-artwork-theme", "light");
    await expect(art.locator("[data-night-sky]")).toHaveCount(0);
    expect(
      await page
        .locator(".travel-header__title")
        .evaluate((el) => getComputedStyle(el).fontFamily),
    ).toContain("Georgia");
    expect(
      await page
        .locator(".travel-section-heading h2")
        .first()
        .evaluate((el) => getComputedStyle(el).fontFamily),
    ).toContain("Trip Journal");
    expect(
      await page
        .locator(".journal-flight-ticket__route")
        .first()
        .evaluate((el) => getComputedStyle(el).fontFamily),
    ).toContain("Segoe UI");
    for (const width of [320, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1024 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
    }
    await page.getByRole("button", { name: "切換到深色模式" }).click();
    await expect(shell).toHaveCSS("background-color", "rgb(26, 22, 20)");
    await expect(art).toHaveAttribute("data-artwork-theme", "dark");
    await expect(art.locator("[data-night-sky]")).toHaveCount(1);
    const filters = await art.evaluate((el) => {
      const values = [];
      for (let current = el; current; current = current.parentElement)
        values.push(getComputedStyle(current).filter);
      return values;
    });
    expect(
      filters.every(
        (value) => !value.includes("invert") && !value.includes("grayscale"),
      ),
    ).toBe(true);
    const actualInk = await art
      .locator(":scope > g")
      .first()
      .evaluate((el) => getComputedStyle(el).stroke);
    expect(actualInk).toBe("rgb(33, 29, 34)");
    const footprints = page.locator(".travel-highlights li");
    for (const item of await footprints.all()) {
      await expect(item).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      await expect(item.locator(".journal-footprint-star")).toHaveCount(1);
    }
    await page.reload();
    await expect(
      page.locator(".travel-cover .journal-illustration"),
    ).toHaveAttribute("data-artwork-theme", "dark");
  }
});

test("boarding passes and the daily trail keep content and controls intact", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?trip=2027_tohoku");
  const ticket = page.getByRole("article", { name: "去程航班", exact: true });
  await expect(ticket).toBeVisible();
  const clipId = await ticket.locator("clipPath").getAttribute("id");
  expect(
    await ticket.evaluate((el) => getComputedStyle(el).clipPath),
  ).toContain(clipId);
  await expect(ticket.locator(".journal-flight-thread path")).toHaveAttribute(
    "stroke-linecap",
    "round",
  );
  await expect(ticket).toContainText("11:50");
  await expect(ticket).toContainText("16:00");
  await page.locator(".travel-date-selector button").nth(1).click();
  await expect(page.locator(".travel-day-heading")).toBeVisible();
  const route = await page.locator(".travel-timeline > ol").evaluate((el) => {
    const style = getComputedStyle(el, "::before");
    return { mask: style.maskImage, border: style.borderLeftWidth };
  });
  expect(route.mask).toContain("data:image/svg+xml");
  expect(route.border).toBe("0px");
  await expect(page.locator(".journal-day-stamp").first()).toHaveAttribute(
    "data-artwork-theme",
    /light|dark/,
  );
  const event = page.locator(".travel-timeline-event__heading button").first();
  await event.click();
  await expect(event).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("button", { name: /在地圖查看/ }).first().click();
  await expect(
    page.getByRole("link", { name: /在 Google Maps 開啟此站/ }),
  ).toHaveAttribute("href", /google/);
  await page.getByRole("button", { name: "開啟旅程工具" }).click();
  await expect(
    page.getByRole("button", { name: "開啟匯率計算機" }),
  ).toBeInViewport();
});

test("daily drawings remain prominent and illustrated stops keep usable controls", async ({
  page,
}) => {
  test.setTimeout(120_000);
  for (const trip of ["2027_tohoku", "2026_karuizawa", "2026_busan"]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/?trip=${trip}`);
    await expect(page.locator(".travel-cover")).toBeVisible();
    const days = (await page.locator(".travel-date-selector > button").count()) - 1;
    for (let day = 1; day <= days; day++) {
      await page.locator(".travel-date-selector > button").nth(day).click();
      await expect(page.locator(".travel-day-heading .travel-eyebrow")).toContainText(`Day ${day}`);
      const mainArt = page.locator(".journal-day-picture");
      await expect(mainArt.locator("svg")).toBeVisible();
      expect((await mainArt.boundingBox()).width).toBeGreaterThanOrEqual(128);
      const stopArt = page.locator(".journal-event-art .journal-day-stamp");
      await expect(stopArt).toHaveCount(1);
      await expect(stopArt).toHaveAttribute(
        "data-scene",
        await mainArt.locator("svg").getAttribute("data-scene"),
      );
    }
    await page.locator(".travel-date-selector > button").nth(2).click();
    await expect(page.locator(".travel-day-heading .travel-eyebrow")).toContainText("Day 2");
    for (const [width, height] of [[320, 740], [390, 844], [768, 1024], [1440, 900]]) {
      await page.setViewportSize({ width, height });
      const card = page.locator(".travel-timeline-event__body").filter({
        has: page.locator(".journal-event-art .journal-day-stamp"),
      });
      const toggle = card.locator("h3 button");
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(card.locator(".travel-event-details")).toBeVisible();
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      const titleBox = await toggle.boundingBox();
      const artBox = await card.locator(".journal-event-art").boundingBox();
      expect(titleBox.x + titleBox.width).toBeLessThanOrEqual(artBox.x + 1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      await expect(card.locator(".journal-event-art")).toHaveAttribute("aria-hidden", "true");
    }
    const currentTheme = await page.locator(".travel-shell").getAttribute("data-theme");
    await page.getByRole("button", {
      name: currentTheme === "light" ? "切換到深色模式" : "切換到亮色模式",
    }).click();
    await expect(page.locator(".journal-event-art .journal-day-stamp")).toHaveAttribute(
      "data-artwork-theme",
      await page.locator(".travel-shell").getAttribute("data-theme"),
    );
  }
});
