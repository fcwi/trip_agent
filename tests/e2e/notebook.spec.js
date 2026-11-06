import { test, expect } from "@playwright/test";
import { authenticate } from "./auth-fixture.js";

test.beforeEach(async ({ page }) => {
  await authenticate(page);
  await page.route("**/*", async (route) => {
    const host = new URL(route.request().url()).hostname;
    if (new URL(route.request().url()).pathname.startsWith("/api/gemini/"))
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: Array.from(
                      { length: 15 },
                      (_, index) =>
                        `行程提醒 ${index + 1}：請依當天交通及天候安排參訪時間。`,
                    ).join("\n"),
                  },
                ],
              },
            },
          ],
        }),
      });
    return host === "127.0.0.1" ? route.continue() : route.abort();
  });
});

test("route dates keep the reference layout and move the correct vehicle between real days", async ({
  page,
}) => {
  for (const [trip, index, kind] of [
    ["2027_tohoku", 2, "cable"],
    ["2026_busan", 1, "train"],
    ["2026_karuizawa", 0, "train"],
  ]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/?trip=${trip}`);
    const dates = page.locator(".journal-route-day");
    await expect(dates.first()).toBeVisible();
    await dates.nth(index).click();
    await expect(page.locator(".journal-route-vehicle")).toHaveAttribute(
      "data-vehicle",
      kind,
    );
    await expect(dates.nth(index)).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".travel-day-heading")).toBeVisible();
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      const target = await dates.nth(index).boundingBox();
      expect(target.width).toBeGreaterThanOrEqual(44);
      expect(target.height).toBeGreaterThanOrEqual(44);
      const eventSize = await page
        .locator(".travel-timeline-event__heading button")
        .first()
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(eventSize).toBeGreaterThanOrEqual(16);
    }
    await page.getByRole("button", { name: "總覽", exact: true }).click();
    await expect(
      page.locator(".travel-today .journal-paper-sticker"),
    ).toHaveCount(1);
    if (await page.locator(".travel-checklist").count()) {
      await expect(
        page.locator(".travel-checklist .journal-paper-sticker"),
      ).toHaveCount(1);
    }
  }
});

test("AI keeps a usable conversation canvas and scrolls real mock replies at all widths", async ({
  page,
}) => {
  await page.goto("/?trip=2027_tohoku&tab=ai");
  await expect(page.locator(".journal-chat-log")).toBeVisible();
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [768, 1024],
    [1440, 900],
  ]) {
    await page.setViewportSize({ width, height });
    const log = await page.locator(".journal-chat-log").boundingBox();
    expect(log.height).toBeGreaterThan(height * 0.35);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    for (const label of ["詢問 AI 導遊", "上傳圖片", "選擇語音輸入語言"])
      await expect(page.getByLabel(label, { exact: true })).toBeInViewport();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-journal-mode="guide"]').click();
  await page.getByLabel("詢問 AI 導遊").fill("請幫我安排當天的出發提醒");
  await page.getByRole("button", { name: "傳送訊息", exact: true }).click();
  await expect(page.locator(".journal-chat-log")).toContainText("行程提醒 15");
  expect(
    await page
      .locator(".journal-chat-log")
      .evaluate((el) => el.scrollHeight > el.clientHeight),
  ).toBe(true);
  await page.getByRole("button", { name: "搜尋對話", exact: true }).click();
  await page.getByLabel("搜尋對話內容").fill("出發提醒");
  await expect(page.locator("#ai-search-panel")).toContainText("出發提醒");
  await page.getByRole("button", { name: "搜尋對話", exact: true }).click();
  await page.locator('[data-journal-mode="translate"]').click();
  await expect(page.locator('[data-journal-mode="translate"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("AI input follows the visual viewport when a mobile keyboard reduces available height", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?trip=2027_tohoku&tab=ai");
  await expect(page.locator(".journal-chat-log")).toBeVisible();
  await page.getByLabel("詢問 AI 導遊").focus();
  await page.evaluate(() => {
    Object.defineProperty(window.visualViewport, "height", {
      configurable: true,
      value: 500,
    });
    window.visualViewport.dispatchEvent(new Event("resize"));
  });
  await expect(page.locator(".travel-shell")).toHaveAttribute(
    "data-chat-keyboard",
    "true",
  );
  await expect(page.locator(".travel-dock")).toBeHidden();
  const input = await page.locator(".journal-chat-input").boundingBox();
  expect(input.y + input.height).toBeLessThanOrEqual(501);
  expect(
    (await page.locator(".journal-chat-log").boundingBox()).height,
  ).toBeGreaterThan(180);
  await page.evaluate(() => {
    delete window.visualViewport.height;
    window.visualViewport.dispatchEvent(new Event("resize"));
  });
  await expect(page.locator(".travel-dock")).toBeVisible();
  await page.getByRole("button", { name: "行程", exact: true }).click();
  await expect(page.locator(".travel-overview")).toBeVisible();
});
