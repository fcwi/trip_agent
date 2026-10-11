import { test, expect } from "@playwright/test";

test("mobile record fields retain labels and touch controls remain usable", async ({
  page,
}) => {
  await page.route("**/*", (route) =>
    new URL(route.request().url()).hostname === "127.0.0.1"
      ? route.continue()
      : route.abort(),
  );
  await page.goto("/");
  await page.getByLabel("通關密碼").fill("trip-e2e-password");
  await page.getByRole("button", { name: "解鎖行程" }).click();
  await page.getByRole("button", { name: /^記錄/ }).click();
  await page.getByLabel("暱稱", { exact: true }).fill("UI 檢查");
  await page.getByRole("button", { name: "開始記錄" }).click();
  await page.getByLabel(/^金額（/).fill("120");
  await page.getByLabel("項目說明", { exact: true }).fill("午餐");
  for (const width of [320, 402, 412]) {
    await page.setViewportSize({ width, height: 874 });
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBe(width);
    for (const name of ["搜尋紀錄", "同步資料", "送出紀錄"]) {
      const box = await page
        .getByRole("button", { name, exact: true })
        .boundingBox();
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  }
  await page.getByRole("button", { name: "記事", exact: true }).click();
  await expect(page.getByLabel("記事內容", { exact: true })).toHaveValue(
    "午餐",
  );
});

test("reduced-motion day changes avoid translation and colored headings have readable copy", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByLabel("通關密碼").fill("trip-e2e-password");
  await page.getByRole("button", { name: "解鎖行程" }).click();
  await expect(page.locator(".travel-overview")).toBeVisible();
  for (const dark of [false, true]) {
    if (dark)
      await page.getByRole("button", { name: /切換到深色模式/ }).click();
    for (const day of [1, 2, 3]) {
      await page
        .getByRole("button", { name: new RegExp(`Day ${day}`) })
        .first()
        .click();
      await expect(
        page.locator(".travel-day-heading .travel-eyebrow"),
      ).toContainText(`Day ${day}`);
      const result = await page.evaluate(async () => {
        const shifts = [];
        for (let i = 0; i < 6; i++) {
          const host =
            document.querySelector(".travel-day-layout")?.parentElement;
          if (host)
            shifts.push(new DOMMatrix(getComputedStyle(host).transform).m41);
          await new Promise(requestAnimationFrame);
        }
        const heading = document.querySelector(".travel-day-heading");
        const copy = heading.querySelector(".travel-muted");
        const luminance = (color) => {
          const rgb = color
            .match(/[\d.]+/g)
            .slice(0, 3)
            .map((v) => Number(v) / 255)
            .map((v) =>
              v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
            );
          return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
        };
        const a = luminance(getComputedStyle(copy).color),
          b = luminance(getComputedStyle(heading).backgroundColor);
        return {
          shifts,
          contrast: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
        };
      });
      expect(result.shifts.every((x) => Math.abs(x) < 0.1)).toBe(true);
      expect(result.contrast).toBeGreaterThanOrEqual(4.5);
    }
  }
});
