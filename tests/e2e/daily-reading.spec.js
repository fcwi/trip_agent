import { test, expect } from "@playwright/test";
import { authenticate } from "./auth-fixture.js";

test.beforeEach(async ({ page }) => {
  await page.route("**/*", (route) =>
    new URL(route.request().url()).hostname === "127.0.0.1"
      ? route.continue()
      : route.abort(),
  );
  await authenticate(page);
  await page.goto("/?trip=2027_tohoku");
  await expect(page.locator(".travel-cover")).toBeVisible();
});

test("daily shortcuts move reading focus and tab returns preserve the reading position", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".travel-date-selector > button").nth(2).click();
  const shortcuts = page.getByRole("navigation", { name: "當日快速導覽" });
  await shortcuts.getByRole("button", { name: "當日路線" }).click();
  await expect(page.locator("#day-route-heading")).toBeFocused();
  await expect(page.locator("#day-route-heading")).toBeInViewport();
  await shortcuts.getByRole("button", { name: "當日安排" }).click();
  const heading = page.locator("#daily-timeline-heading");
  await expect(heading).toBeFocused();
  await expect(heading).toBeInViewport();
  const readingPosition = await page.evaluate(() => window.scrollY);
  expect(readingPosition).toBeGreaterThan(100);
  await page.locator("#tab-shops").click();
  await expect(page.locator("#panel-shops")).toBeVisible();
  await page.locator("#tab-itinerary").click();
  await expect(
    page.locator(".travel-day-heading .travel-eyebrow"),
  ).toContainText("Day 2");
  await expect
    .poll(async () =>
      Math.abs((await page.evaluate(() => window.scrollY)) - readingPosition),
    )
    .toBeLessThan(8);
});

test("daily disclosure stays explicit and accessible in both themes and narrow screens", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator(".travel-date-selector > button").nth(3).click();
  await expect(
    page.locator(".travel-day-heading .travel-eyebrow"),
  ).toContainText("Day 3");
  const card = page.locator(".travel-timeline-event__body").filter({
    has: page.locator(".journal-event-art .journal-day-stamp"),
  });
  const toggle = card.getByRole("button", {
    name: "阿仁纜車・森吉山樹冰",
    exact: true,
  });
  for (const theme of ["light", "dark"]) {
    if (
      (await page.locator(".travel-shell").getAttribute("data-theme")) !== theme
    ) {
      await page
        .getByRole("button", {
          name: theme === "light" ? "切換到亮色模式" : "切換到深色模式",
        })
        .click();
    }
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(toggle).toContainText("查看詳情");
      await toggle.focus();
      await page.keyboard.press("Enter");
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(toggle).toContainText("收合詳情");
      await expect(card.locator(".travel-event-details")).toBeVisible();
      await expect(card.locator(".travel-event-details")).toHaveCSS(
        "animation-name",
        "none",
      );
      await page.keyboard.press("Enter");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(card.locator(".travel-event-details")).toBeHidden();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      for (const button of await page
        .locator(".journal-day-shortcuts button")
        .all()) {
        const box = await button.boundingBox();
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
      }
    }
  }
});
